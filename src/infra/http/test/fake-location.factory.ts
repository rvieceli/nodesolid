import { faker } from "@faker-js/faker";
import { BodySchema } from "../controllers/locations/create.controller";
import { FastifyInstance } from "fastify";
import request from "supertest";
import { LocationData } from "@/core/repositories/locations.repository";

export function fakeLocationFactory(
  overwrite?: Partial<BodySchema>,
): BodySchema {
  return {
    name: faker.company.name(),
    address: faker.location.streetAddress(),
    phone: faker.phone.number(),
    description: faker.lorem.paragraph(),
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
    ...overwrite,
  };
}

export type CreateFakeLocationFactoryFn = (
  overwrite?: Partial<BodySchema>,
) => Promise<LocationData>;

export function createFakeLocationFactory(
  app: FastifyInstance,
  authorization: string,
): CreateFakeLocationFactoryFn {
  return async function (overwrite) {
    const { body } = await request(app.server)
      .post("/locations")
      .send(fakeLocationFactory(overwrite))
      .set("Authorization", authorization);

    return body.location as LocationData;
  };
}
