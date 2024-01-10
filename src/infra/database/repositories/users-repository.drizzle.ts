import { eq } from "drizzle-orm";
import { database } from "..";
import { users } from "../schema";
import {
  CreateInput,
  UsersRepository,
  applyUserProxy,
} from "@/core/repositories/users-repository";

export class UsersRepositoryDrizzle implements UsersRepository {
  async create(data: CreateInput) {
    const [user] = await database
      .insert(users)
      .values(data)
      .returning()
      .execute();

    return applyUserProxy(user);
  }

  async findByEmail(email: string) {
    const user = await database.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) return;

    return applyUserProxy(user);
  }
}
