import {
  CreateInput,
  UserData,
  UsersRepository,
} from "@/core/repositories/users-repository";
import { randomUUID } from "crypto";
import { InMemory } from "./in-memory";

export class UsersRepositoryInMemory
  extends InMemory
  implements UsersRepository
{
  private users: UserData[] = [];

  async create(data: CreateInput) {
    const user = {
      ...data,
      id: randomUUID(),
      created_at: new Date(),
    };

    this.users.push(user);

    return user;
  }

  async findByEmail(email: string) {
    const user = this.users.find((user) => user.email === email);

    if (!user) return;

    return user;
  }

  async findById(id: string) {
    const user = this.users.find((user) => user.id === id);

    if (!user) return;

    return user;
  }
}
