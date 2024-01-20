import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../../app";

const userSample = {
  name: "John Doe",
  email: "john@example.com",
  password: "12345678",
};

describe("ProfileController", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to get user profile", async () => {
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

    const token = responseAuth.body.token;

    const responseProfile = await request(app.server)
      .get("/me")
      .set("Authorization", `Bearer ${token}`);

    expect(responseProfile.status).toBe(200);
    expect(responseProfile.body).toMatchObject({
      user: {
        name: userSample.name,
        email: userSample.email,
      },
    });
  });

  it("should not be able to get user profile without token", async () => {
    const response = await request(app.server).get("/me");

    expect(response.status).toBe(401);
  });

  it("should not be able to get user profile with invalid token", async () => {
    const response = await request(app.server)
      .get("/me")
      .set(
        "Authorization",
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiZDdlNzI3Mi05ZWViLTQzNzEtYTg1Ni01N2Y2NDZhZmI5MTUiLCJpYXQiOjE3MDU2MDk0NzIsImV4cCI6MTcwNTY5NTg3Mn0.cLERy8rM3PK8d0yALDlV_e1bracCBJX_fkXkQvju0UM`,
      );

    expect(response.status).toBe(401);
  });
});
