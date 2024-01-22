import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../../app";
import {
  createAndAuthenticateAdmin,
  createAndAuthenticateUser,
} from "../../test/create-and-authenticate-user.e2e";
import { fakeLocationFactory } from "../../test/fake-location.factory";

describe("Create Location Controller", () => {
  let adminToken = "";
  let memberToken = "";

  beforeAll(async () => {
    await app.ready();

    memberToken = await createAndAuthenticateUser(app, {
      email: "member@create-location-controller.com",
    });

    adminToken = await createAndAuthenticateAdmin(app, {
      email: "admin@create-location-controller.com",
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create a new location", async () => {
    const { latitude, longitude, ...location } = fakeLocationFactory();

    const responseCreate = await request(app.server)
      .post("/locations")
      .send({
        ...location,
        latitude,
        longitude,
      })
      .set("Authorization", adminToken);

    expect(responseCreate.statusCode).toBe(201);
    expect(responseCreate.body).toMatchObject({
      location: {
        ...location,
        coordinates: {
          lat: latitude,
          lng: longitude,
        },
      },
    });
  });

  it("should not be able to create a location as a Member user", async () => {
    const response = await request(app.server)
      .post("/locations")
      .send() // body does matter
      .set("Authorization", memberToken);

    expect(response.statusCode).toBe(403);
    expect(response.body).toMatchObject({
      error: "ForbiddenException",
    });
  });

  it("should not be able to create a new location without authorization", async () => {
    const responseCreate = await request(app.server).post("/locations").send();
    expect(responseCreate.statusCode).toBe(401);
  });
});
