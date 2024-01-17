import {
  CreateLocationInput,
  LocationData,
  LocationsRepository,
} from "@/core/repositories/locations.repository";
import { randomUUID } from "crypto";
import { InMemory } from "./in-memory";

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
}
