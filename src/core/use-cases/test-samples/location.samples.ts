import { CreateLocationInput } from "@/core/repositories/locations.repository";
import { Point } from "@/core/utils/get-distance-between-points";
import { faker } from "@faker-js/faker";

export function makeCoordinates(): Point {
  return {
    lng: faker.location.longitude(),
    lat: faker.location.latitude(),
  };
}

export function makeCreateLocationInput(
  overwrite?: Partial<CreateLocationInput>,
): CreateLocationInput {
  return {
    name: faker.company.name(),
    address: faker.location.streetAddress(),
    phone: faker.phone.number(),
    description: faker.lorem.paragraph(),
    coordinates: makeCoordinates(),
    ...overwrite,
  };
}
