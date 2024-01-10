import {
  CreateInput,
  User,
  UsersRepository,
  applyUserProxy,
} from "@/core/repositories/users-repository";
import { randomUUID } from "crypto";
import { InMemory } from "./in-memory";

export class UsersRepositoryInMemory
  extends InMemory
  implements UsersRepository
{
  private users: User[] = [];

  async create(data: CreateInput) {
    const user = {
      ...data,
      id: randomUUID(),
      created_at: new Date(),
    };

    this.users.push(user);

    return applyUserProxy(user);
  }

  async findByEmail(email: string) {
    const user = this.users.find((user) => user.email === email);

    if (!user) return;

    return applyUserProxy(user);
  }
}
