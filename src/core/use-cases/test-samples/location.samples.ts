import { CreateLocationInput } from "@/core/repositories/locations.repository";
import { faker } from "@faker-js/faker";

export function makeCreateLocationInput(
  overwrite?: Partial<CreateLocationInput>,
): CreateLocationInput {
  return {
    name: faker.company.name(),
    address: faker.location.streetAddress(),
    phone: faker.phone.number(),
    description: faker.lorem.paragraph(),
    longitude: faker.location.longitude(),
    latitude: faker.location.latitude(),
    ...overwrite,
  };
}
