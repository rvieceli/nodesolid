import { eq } from "drizzle-orm";
import { database } from "..";
import { users } from "../schema";
import {
  CreateInput,
  UserData,
  UsersRepository,
} from "@/core/repositories/users.repository";

export class UsersRepositoryDrizzle implements UsersRepository {
  async create(data: CreateInput): Promise<UserData> {
    const [user] = await database
      .insert(users)
      .values(data)
      .returning()
      .execute();

    return user;
  }

  async findByEmail(email: string): Promise<UserData | undefined> {
    const user = await database.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) return;

    return user;
  }

  async findById(id: string) {
    const user = await database.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!user) return;

    return user;
  }
}
