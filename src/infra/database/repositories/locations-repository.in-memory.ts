import {
  CreateLocationInput,
  LocationData,
  LocationsRepository,
} from "@/core/repositories/locations.repository";
import { randomUUID } from "crypto";
import { InMemory } from "./in-memory";
import { PaginatedRequest, PaginatedResponse } from "@/core/utils/pagination";

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

    const items = allItems.slice(...this.paginationToSlice(pagination));

    return {
      items,
      page: pagination.page,
      pageSize: pagination.pageSize,
      total: allItems.length,
      totalPages: Math.ceil(allItems.length / pagination.pageSize),
    };
  }
}
