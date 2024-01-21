import { faker } from "@faker-js/faker";
import { FastifyInstance } from "fastify";
import request from "supertest";
import { BodySchema } from "../controllers/users/authenticate.controller";
import { jwtDecode } from "jwt-decode";

export function fakeAuthenticateFactory(
  overwrite?: Partial<BodySchema>,
): BodySchema {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...overwrite,
  };
}

export type CreateFakeUserFactoryFn = (
  overwrite?: Partial<BodySchema>,
) => Promise<{
  token: string;
  userId: string;
}>;

export function createFakeAuthorizationFactory(
  app: FastifyInstance,
): CreateFakeUserFactoryFn {
  return async function (overwrite) {
    const params = fakeAuthenticateFactory(overwrite);

    const { body } = await request(app.server).post("/sessions").send({
      email: params.email,
      password: params.password,
    });

    const userId = jwtDecode(body.token).sub!;

    return {
      token: body.token,
      userId,
    };
  };
}
