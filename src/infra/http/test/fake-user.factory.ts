import { faker } from "@faker-js/faker";
import { FastifyInstance } from "fastify";
import request from "supertest";
import { BodySchema } from "../controllers/users/register.controller";

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
) => Promise<BodySchema>;

export function createFakeUserFactory(
  app: FastifyInstance,
): CreateFakeUserFactoryFn {
  return async function (overwrite) {
    const user = fakeUserFactory(overwrite);
    await request(app.server).post("/register").send(user).expect(201);

    return user;
  };
}
