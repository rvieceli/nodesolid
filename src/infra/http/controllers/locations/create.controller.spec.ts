import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../../app";
import { createAndAuthenticateUser } from "../../test/create-and-authenticate-user.e2e";
import { fakeLocationFactory } from "../../test/fake-location.factory";

describe("Create Location Controller", () => {
  let authorization = "";

  beforeAll(async () => {
    await app.ready();

    authorization = await createAndAuthenticateUser(app);
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
      .set("Authorization", authorization);

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

  it("should not be able to create a new location without authorization", async () => {
    const responseCreate = await request(app.server).post("/locations").send();
    expect(responseCreate.statusCode).toBe(401);
  });
});
