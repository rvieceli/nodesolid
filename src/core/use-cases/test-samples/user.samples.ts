import { RegisterUseCaseRequest } from "../register.use-case";

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
