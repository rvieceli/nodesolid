import {
  CreateInput,
  User,
  UsersRepository,
} from "@/core/repositories/users-repository";
import { randomUUID } from "crypto";
import { InMemory } from "./in-memory";

export class UsersRepositoryInMemory
  extends InMemory
  implements UsersRepository
{
  private users: User[] = [];

  async create(data: CreateInput): Promise<User> {
    const user = {
      ...data,
      id: randomUUID(),
      created_at: new Date(),
    };

    this.users.push(user);

    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = this.users.find((user) => user.email === email);

    return user;
  }
}
