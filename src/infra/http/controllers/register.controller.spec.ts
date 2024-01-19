import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../app";

const userSample = {
  name: "John Doe",
  email: "john@example.com",
  password: "12345678",
};

describe("RegisterController", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to register a new user", async () => {
    const response = await request(app.server)
      .post("/register")
      .send(userSample);

    expect(response.status).toBe(201);
  });

  it("should not be able to register a new user with same email from another", async () => {
    const uniqueEmail = "unique@example.com";

    const responseOk = await request(app.server)
      .post("/register")
      .send({
        ...userSample,
        email: uniqueEmail,
      });

    expect(responseOk.status).toBe(201);

    const responseFail = await request(app.server)
      .post("/register")
      .send({
        ...userSample,
        email: uniqueEmail,
      });

    expect(responseFail.status).toBe(409);
  });
});
