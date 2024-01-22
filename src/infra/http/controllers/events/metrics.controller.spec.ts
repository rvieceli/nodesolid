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

describe("Metrics Events Controller", () => {
  let authorization = "";
  let createFakeLocationFn: CreateFakeLocationFactoryFn;

  beforeAll(async () => {
    await app.ready();

    const user = await createFakeUserFactory(app)();
    const auth = await createFakeAuthorizationFactory(app)(user);

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

  it("should be able get user metrics", async () => {
    const location = await createFakeLocationFn(
      fakeLocationFactory({
        latitude: -27.125803,
        longitude: -109.4213865,
      }),
    );

    const create = await request(app.server)
      .post(`/events/${location.id}/check-in`)
      .send({
        latitude: -27.126155774243696,
        longitude: -109.42053861638183,
      })
      .set("Authorization", authorization);

    const eventId = create.body.event.id;

    await request(app.server)
      .patch(`/events/${eventId}/validate`)
      .send({
        latitude: -27.126155774243696,
        longitude: -109.42053861638183,
      })
      .set("Authorization", authorization);

    const metrics = await request(app.server)
      .get(`/events/metrics`)
      .send()
      .set("Authorization", authorization);

    expect(metrics.body).toMatchObject({
      count: 1,
    });
  });

  it("should not succeed without authorization", async () => {
    const response = await request(app.server).get(`/events/metrics`).send();

    expect(response.statusCode).toBe(401);
    expect(response.body).toMatchObject({
      error: "UnauthorizedException",
    });
  });
});
