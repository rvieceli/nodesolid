import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../../app";
import { createAndAuthenticateUser } from "../../test/create-and-authenticate-user.e2e";
import {
  CreateFakeLocationFactoryFn,
  createFakeLocationFactory,
} from "../../test/fake-location.factory";

describe("Search Location Controller", () => {
  let authorization = "";
  let createFakeLocationFn: CreateFakeLocationFactoryFn;

  beforeAll(async () => {
    await app.ready();

    authorization = await createAndAuthenticateUser(app);
    createFakeLocationFn = createFakeLocationFactory(app, authorization);

    // create 20 locations before running tests
    const items = Array.from({ length: 20 }).map((_, idx) =>
      createFakeLocationFn({
        name: `A nice place ${idx}`,
        address: `${idx} Street, Somewhere, 10000`,
        description: null,
        phone: `+0 ${String(idx).repeat(10)}`,
      }),
    );

    await Promise.all(items);
  });

  afterAll(async () => {
    await app.close();
  });

  it.each([
    ["name", "Very Tall Rock", "tall rock"],
    ["description", "Short Tail Place", "short tail"],
    ["address", "Via Roma, 1, 10010, Torino, Italy", "Torino"],
    ["phone", "+39 12342345", "12342345"],
  ])("should be able to search by %s", async (field, value, query) => {
    const location = await createFakeLocationFn({
      [field]: value,
    });

    const params = new URLSearchParams({
      q: query,
    });

    const response = await request(app.server)
      .get(`/locations/search?${params.toString()}`)
      .send()
      .set("Authorization", authorization);

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      items: [location],
      page: 1,
      pageSize: 10,
      total: 1,
      totalPages: 1,
    });
  });

  it("should be able to search with pagination", async () => {
    const params = new URLSearchParams({
      q: "nice place",
      page: "2",
      pageSize: "10",
    });

    const response = await request(app.server)
      .get(`/locations/search?${params.toString()}`)
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
    const response = await request(app.server).get("/locations/search").send();
    expect(response.statusCode).toBe(401);
  });
});
