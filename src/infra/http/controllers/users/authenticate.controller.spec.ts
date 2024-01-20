import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../../app";

const userSample = {
  name: "John Doe",
  email: "john@example.com",
  password: "12345678",
};

describe("AuthenticateController", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to authenticate", async () => {
    const response = await request(app.server)
      .post("/register")
      .send(userSample);

    expect(response.status).toBe(201);

    const responseAuth = await request(app.server).post("/sessions").send({
      email: userSample.email,
      password: userSample.password,
    });

    expect(responseAuth.status).toBe(201);
    expect(responseAuth.body).toHaveProperty("token");
  });
});
