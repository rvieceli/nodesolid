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

describe("Validate Events Controller", () => {
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

  it("should be able to validate the events", async () => {
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

    const validate = await request(app.server)
      .patch(`/events/${eventId}/validate`)
      .send({
        latitude: -27.126155774243696,
        longitude: -109.42053861638183,
      })
      .set("Authorization", authorization);

    expect(validate.statusCode).toBe(200);
    expect(validate.body).toMatchObject({
      event: {
        userId,
        locationId: location.id,
      },
    });

    const validatedAt = validate.body.event.validatedAt;

    expect(validatedAt).toBe(new Date(validatedAt).toISOString());
  });

  it("should not be able to validate if the events does not exist", async () => {
    const response = await request(app.server)
      .patch(`/events/${randomUUID()}/validate`)
      .send({
        latitude: -27.1066108,
        longitude: -109.2523168,
      })
      .set("Authorization", authorization);

    expect(response.statusCode).toBe(404);
    expect(response.body).toMatchObject({
      error: "ResourceNotFoundException",
    });
  });

  it("should not be able to validate without authorization", async () => {
    const response = await request(app.server)
      .patch(`/events/${randomUUID()}/validate`)
      .send();

    expect(response.statusCode).toBe(401);
    expect(response.body).toMatchObject({
      error: "UnauthorizedException",
    });
  });
});
