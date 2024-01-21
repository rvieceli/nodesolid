import { FastifyInstance } from "fastify";
import { createFakeUserFactory } from "./fake-user.factory";
import { createFakeAuthorizationFactory } from "./fake-authenticate.factory";

export const userSample = {
  name: "John Doe",
  email: "john@example.com",
  password: "12345678",
};

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  data?: typeof userSample,
) {
  const user = await createFakeUserFactory(app)({ ...userSample, ...data });
  const { token } = await createFakeAuthorizationFactory(app)(user);
  const authorization = `Bearer ${token}`;
  return authorization;
}
