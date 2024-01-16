import {
  CreateUserInput,
  UserData,
  UsersRepository,
} from "@/core/repositories/users.repository";
import { randomUUID } from "crypto";
import { InMemory } from "./in-memory";

export class UsersRepositoryInMemory
  extends InMemory
  implements UsersRepository
{
  private users: UserData[] = [];

  async create(data: CreateUserInput) {
    const user = {
      id: randomUUID(),
      ...data,
      createdAt: new Date(),
    };

    this.users.push(user);

    return user;
  }

  async findByEmail(email: string) {
    return this.users.find((user) => user.email === email);
  }

  async findById(id: string) {
    return this.users.find((user) => user.id === id);
  }
}
