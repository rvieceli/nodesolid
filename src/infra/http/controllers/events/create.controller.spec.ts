import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../../app";
import {
  CreateFakeLocationFactoryFn,
  createFakeLocationFactory,
  fakeLocationFactory,
} from "../../test/fake-location.factory";
import { createFakeUserFactory } from "../../test/fake-user.factory";
import { createFakeAuthorizationFactory } from "../../test/fake-authenticate.factory";
import { randomUUID } from "crypto";

describe("Create Events Controller", () => {
  let authorization = "";
  let userId = "";
  let createFakeLocationFn: CreateFakeLocationFactoryFn;

  beforeAll(async () => {
    await app.ready();

    const user = await createFakeUserFactory(app)();
    const auth = await createFakeAuthorizationFactory(app)(user);

    userId = auth.userId;
    authorization = `Bearer ${auth.token}`;

    createFakeLocationFn = createFakeLocationFactory(app, authorization);

    await Promise.all(
      Array.from({ length: 20 }).map(() =>
        createFakeLocationFn(
          fakeLocationFactory({
            //random coordinates at 1.11 km distance
            latitude: 45.45 + Math.random() / 100,
            longitude: 7.85 + Math.random() / 100,
          }),
        ),
      ),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to check-in", async () => {
    const location = await createFakeLocationFn(
      fakeLocationFactory({
        latitude: -27.125803,
        longitude: -109.4213865,
      }),
    );

    const responseCreate = await request(app.server)
      .post(`/events/${location.id}/check-in`)
      .send({
        latitude: -27.126155774243696,
        longitude: -109.42053861638183,
      })
      .set("Authorization", authorization);

    expect(responseCreate.statusCode).toBe(201);
    expect(responseCreate.body).toMatchObject({
      event: {
        userId,
        locationId: location.id,
        validatedAt: null,
      },
    });
  });

  it("should not be possible to check in if the location is more than 100m away", async () => {
    const location = await createFakeLocationFn(
      fakeLocationFactory({
        latitude: -27.125803,
        longitude: -109.4213865,
      }),
    );

    const response = await request(app.server)
      .post(`/events/${location.id}/check-in`)
      .send({
        latitude: -27.1066108,
        longitude: -109.2523168,
      })
      .set("Authorization", authorization);

    expect(response.statusCode).toBe(400);
  });

  it("should not be able to check-in if the location does not exist", async () => {
    const response = await request(app.server)
      .post(`/events/${randomUUID()}/check-in`)
      .send({
        latitude: -27.1066108,
        longitude: -109.2523168,
      })
      .set("Authorization", authorization);

    expect(response.statusCode).toBe(404);
  });

  it("should not be able to check-in without authorization", async () => {
    const responseCreate = await request(app.server)
      .post(`/events/${randomUUID()}/check-in`)
      .send();
    expect(responseCreate.statusCode).toBe(401);
  });
});
