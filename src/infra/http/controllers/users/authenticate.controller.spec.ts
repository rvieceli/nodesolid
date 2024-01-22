import request from "supertest";
import TestAgent from "supertest/lib/agent";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../../app";

describe("AuthenticateController", () => {
  const email = "john@authenticate-controller.com";
  const password = "12345678";
  let agent: TestAgent;

  beforeAll(async () => {
    await app.ready();
    agent = request(app.server);

    await agent.post("/register").send({
      name: "John Doe",
      email,
      password,
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to authenticate", async () => {
    const response = await agent.post("/sessions").send({
      email,
      password,
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("token");
    expect(response.get("Set-Cookie")).toEqual([
      expect.stringContaining("refreshToken="),
    ]);
  });

  it("should be return a cookie with refreshToken", async () => {
    const response = await agent.post("/sessions").send({
      email,
      password,
    });

    expect(response.status).toBe(201);
    expect(response.get("Set-Cookie")).toEqual([
      expect.stringContaining("refreshToken="),
    ]);
  });
});
