import { faker } from "@faker-js/faker";
import { FastifyInstance } from "fastify";
import request from "supertest";
import { BodySchema } from "../controllers/users/register.controller";
import { Role } from "@/core/repositories/users.repository";
import { database } from "@/infra/database";
import { users } from "@/infra/database/schema";
import { eq } from "drizzle-orm";

export function fakeUserFactory(overwrite?: Partial<BodySchema>): BodySchema {
  return {
    name: faker.company.name(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...overwrite,
  };
}

export type CreateFakeUserFactoryFn = (
  overwrite?: Partial<BodySchema>,
  role?: Role,
) => Promise<BodySchema>;

export function createFakeUserFactory(
  app: FastifyInstance,
): CreateFakeUserFactoryFn {
  return async function (overwrite, role) {
    const user = fakeUserFactory(overwrite);
    await request(app.server).post("/register").send(user).expect(201);

    if (role) {
      await database
        .update(users)
        .set({ role })
        .where(eq(users.email, user.email));
    }

    return user;
  };
}
