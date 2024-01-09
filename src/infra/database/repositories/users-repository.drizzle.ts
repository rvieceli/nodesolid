import { eq } from "drizzle-orm";
import { database } from "..";
import { users } from "../schema";
import {
  CreateInput,
  User,
  UsersRepository,
} from "@/core/repositories/users-repository";

export class UsersRepositoryDrizzle implements UsersRepository {
  async create(data: CreateInput): Promise<User> {
    const [user] = await database
      .insert(users)
      .values(data)
      .returning()
      .execute();

    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await database.query.users.findFirst({
      where: eq(users.email, email),
    });

    return user;
  }
}
