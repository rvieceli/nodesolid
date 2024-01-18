import {
  CreateLocationInput,
  LocationData,
  LocationsRepository,
} from "@/core/repositories/locations.repository";
import { Point } from "@/core/utils/get-distance-between-points";
import { PaginatedRequest, PaginatedResponse } from "@/core/utils/pagination";
import { database } from "..";
import { locations } from "../schema";
import { asc, count, eq, ilike, sql } from "drizzle-orm";

export class LocationsRepositoryDrizzle implements LocationsRepository {
  private map({
    latitude,
    longitude,
    ...from
  }: typeof locations.$inferSelect): LocationData {
    return {
      ...from,
      coordinates: {
        lat: parseFloat(latitude),
        lng: parseFloat(longitude),
      },
    };
  }

  async create({ coordinates, ...data }: CreateLocationInput) {
    const [location] = await database
      .insert(locations)
      .values({
        ...data,
        latitude: String(coordinates.lat),
        longitude: String(coordinates.lng),
      })
      .returning()
      .execute();

    return this.map(location);
  }

  async findById(id: string) {
    const location = await database.query.locations.findFirst({
      where: eq(locations.id, id),
    });

    if (!location) return;

    return this.map(location);
  }

  async searchPaginated(query: string, pagination: PaginatedRequest) {
    const { items, total } = await database.transaction(async (trx) => {
      const items = await trx
        .select()
        .from(locations)
        .where(ilike(locations.search, `%${query}%`))
        .limit(pagination.pageSize)
        .offset((pagination.page - 1) * pagination.pageSize)
        .execute();

      const [{ total }] = await trx
        .select({
          total: count(),
        })
        .from(locations)
        .where(ilike(locations.search, `%${query}%`))
        .execute();

      return { items, total };
    });

    return new PaginatedResponse(items.map(this.map), total, pagination);
  }

  async searchByProximityPaginated(
    coordinates: Point,
    distanceInKm: number,
    pagination: PaginatedRequest,
  ) {
    const { items, total } = await database.transaction(async (trx) => {
      const { lat, lng } = coordinates;

      const distance = sql`earth_distance(ll_to_earth(${lat}, ${lng}), ll_to_earth(latitude, longitude))`;
      const condition = sql`${distance} <= ${distanceInKm * 1000}`;

      const items = await trx
        .select()
        .from(locations)
        .where(condition)
        .limit(pagination.pageSize)
        .offset((pagination.page - 1) * pagination.pageSize)
        .orderBy(asc(distance))
        .execute();

      const [{ total }] = await trx
        .select({
          total: count(),
        })
        .from(locations)
        .where(condition)
        .execute();

      return { items, total };
    });

    return new PaginatedResponse(items.map(this.map), total, pagination);
  }
}
