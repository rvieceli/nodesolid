import { FastifyInstance } from "fastify";
import request from "supertest";

export const userSample = {
  name: "John Doe",
  email: "john@example.com",
  password: "12345678",
};

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  data?: typeof userSample,
) {
  await request(app.server)
    .post("/register")
    .send({ ...userSample, ...data });

  const response = await request(app.server)
    .post("/sessions")
    .send({
      email: data?.email ?? userSample.email,
      password: data?.password ?? userSample.password,
    });

  const { token } = response.body;
  const authorization = `Bearer ${token}`;

  return authorization;
}
