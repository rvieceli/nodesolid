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
  private items: LocationData[] = [];

  async create(data: CreateLocationInput) {
    const user = {
      id: randomUUID(),
      ...data,
      createdAt: new Date(),
    };

    this.items.push(user);

    return user;
  }

  async findById(id: string) {
    return this.items.find((location) => location.id === id);
  }
}
