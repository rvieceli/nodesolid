import { RegisterUseCaseRequest } from "../register.use-case";
import { faker } from "@faker-js/faker";

export const REGISTER_USER_SAMPLE: RegisterUseCaseRequest = {
  email: "john@example.com",
  name: "John Doe",
  password: "12345678",
};

export const REGISTER_WRONG_USER_SAMPLE: RegisterUseCaseRequest = {
  email: "wrong-email@wrong.com",
  name: "John Wrong",
  password: "wrong-password",
};

export function makeCreateUserInput(
  overwrite: Partial<RegisterUseCaseRequest>,
): RegisterUseCaseRequest {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...overwrite,
  };
}
