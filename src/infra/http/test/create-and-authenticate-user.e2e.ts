import { FastifyInstance } from "fastify";
import { createFakeUserFactory } from "./fake-user.factory";
import { createFakeAuthorizationFactory } from "./fake-authenticate.factory";
import { Role } from "@/core/repositories/users.repository";

export const userSample = {
  name: "John Doe",
  email: "john@example.com",
  password: "12345678",
};

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  data?: Partial<typeof userSample>,
  role?: Role,
) {
  const user = await createFakeUserFactory(app)(
    { ...userSample, ...data },
    role,
  );
  const { token } = await createFakeAuthorizationFactory(app)(user);
  const authorization = `Bearer ${token}`;
  return authorization;
}

export const createAndAuthenticateAdmin = (
  app: FastifyInstance,
  data?: Partial<typeof userSample>,
) => createAndAuthenticateUser(app, data, "ADMIN");
