import {
  CreateLocationInput,
  LocationData,
  LocationsRepository,
} from "@/core/repositories/locations.repository";
import { randomUUID } from "crypto";
import { InMemory } from "./in-memory";
import { PaginatedRequest, PaginatedResponse } from "@/core/utils/pagination";
import {
  Point,
  getDistanceBetweenPoints,
} from "@/core/utils/get-distance-between-points";

export class LocationsRepositoryInMemory
  extends InMemory
  implements LocationsRepository
{
  private items: (LocationData & { search: string })[] = [];

  async create(data: CreateLocationInput) {
    const location = {
      id: randomUUID(),
      ...data,
      search: this.generatedConcat(data, [
        "name",
        "address",
        "description",
        "phone",
      ]),
      createdAt: new Date(),
    };

    this.items.push(location);

    return location;
  }

  async findById(id: string) {
    return this.items.find((location) => location.id === id);
  }

  async searchPaginated(
    query: string,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<LocationData>> {
    const allItems = this.items.filter((location) =>
      location.search.toLowerCase().includes(query.toLowerCase()),
    );

    return this.paginate(allItems, pagination);
  }

  async searchByProximityPaginated(
    coordinates: Point,
    distanceInKm: number,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<LocationData>> {
    const allItems = this.items.filter(
      (location) =>
        getDistanceBetweenPoints(
          coordinates,
          location.coordinates,
          "kilometers",
        ) <= distanceInKm,
    );

    return this.paginate(allItems, pagination);
  }
}
