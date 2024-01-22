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

  it("should be able to refresh a token", async () => {
    const register = await request(app.server)
      .post("/register")
      .send(userSample);

    expect(register.status).toBe(201);

    const authorization = await request(app.server).post("/sessions").send({
      email: userSample.email,
      password: userSample.password,
    });

    expect(authorization.status).toBe(201);

    const profileBeforeRefresh = await request(app.server)
      .get("/me")
      .set("Authorization", `Bearer ${authorization.body.token}`);

    const cookies = authorization.get("Set-Cookie");

    const refreshToken = await request(app.server)
      .patch("/sessions/refresh")
      .set("Cookie", cookies)
      .send();

    expect(refreshToken.status).toBe(200);
    expect(refreshToken.body.token).toBeDefined();
    expect(refreshToken.get("Set-Cookie")).toEqual([
      expect.stringContaining("refreshToken="),
    ]);

    const profileAfterRefresh = await request(app.server)
      .get("/me")
      .set("Authorization", `Bearer ${refreshToken.body.token}`);

    expect(profileAfterRefresh.status).toBe(200);
    expect(profileAfterRefresh.body).toMatchObject(profileBeforeRefresh.body);
  });
});
