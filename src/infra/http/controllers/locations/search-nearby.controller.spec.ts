import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../../app";
import { createAndAuthenticateUser } from "../../test/create-and-authenticate-user.e2e";
import {
  CreateFakeLocationFactoryFn,
  createFakeLocationFactory,
  fakeLocationFactory,
} from "../../test/fake-location.factory";

describe("Search Nearby Location Controller", () => {
  let authorization = "";
  let createFakeLocationFn: CreateFakeLocationFactoryFn;

  beforeAll(async () => {
    await app.ready();

    authorization = await createAndAuthenticateUser(app);
    createFakeLocationFn = createFakeLocationFactory(app, authorization);

    // create 20 locations before running tests
    const items = Array.from({ length: 20 }).map(() =>
      createFakeLocationFn(
        fakeLocationFactory({
          //random coordinates at 1.11 km distance
          latitude: 45.45 + Math.random() / 100,
          longitude: 7.85 + Math.random() / 100,
        }),
      ),
    );

    await Promise.all(items);
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to search for nearby locations", async () => {
    const closeLocation = await createFakeLocationFn(
      fakeLocationFactory({
        latitude: 35.8984239,
        longitude: 14.4138949,
      }),
    );

    const params = new URLSearchParams({
      latitude: "35.8929442",
      longitude: "14.4241799",
    });

    const response = await request(app.server)
      .get(`/locations/nearby?${params.toString()}`)
      .send()
      .set("Authorization", authorization);

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      items: [closeLocation],
      page: 1,
      pageSize: 10,
      total: 1,
      totalPages: 1,
    });
  });

  it("should be able to search for nearby locations with pagination", async () => {
    const params = new URLSearchParams({
      latitude: "45.45",
      longitude: "7.85",
      page: "2",
      pageSize: "10",
    });

    const response = await request(app.server)
      .get(`/locations/nearby?${params.toString()}`)
      .send()
      .set("Authorization", authorization);

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      page: 2,
      pageSize: 10,
      total: 20,
      totalPages: 2,
    });
  });

  it("should not be able to search without authorization", async () => {
    const response = await request(app.server).get("/locations/nearby").send();
    expect(response.statusCode).toBe(401);
  });
});
