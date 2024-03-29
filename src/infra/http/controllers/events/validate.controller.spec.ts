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
import { createAndAuthenticateAdmin } from "../../test/create-and-authenticate-user.e2e";

describe("Validate Events Controller", () => {
  let adminToken = "";
  let memberToken = "";
  let memberId = "";
  let createFakeLocationFn: CreateFakeLocationFactoryFn;

  beforeAll(async () => {
    await app.ready();

    adminToken = await createAndAuthenticateAdmin(app, {
      email: "admin@validate-events-controller.com",
    });

    createFakeLocationFn = createFakeLocationFactory(app, adminToken);

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

    const user = await createFakeUserFactory(app)({
      email: "member@validate-events-controller.com",
    });
    const auth = await createFakeAuthorizationFactory(app)(user);

    memberId = auth.userId;
    memberToken = `Bearer ${auth.token}`;
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
      .set("Authorization", memberToken);

    const eventId = create.body.event.id;

    const validate = await request(app.server)
      .patch(`/events/${eventId}/validate`)
      .send({
        latitude: -27.126155774243696,
        longitude: -109.42053861638183,
      })
      .set("Authorization", adminToken);

    expect(validate.statusCode).toBe(200);
    expect(validate.body).toMatchObject({
      event: {
        userId: memberId,
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
      .set("Authorization", adminToken);

    expect(response.statusCode).toBe(404);
    expect(response.body).toMatchObject({
      error: "ResourceNotFoundException",
    });
  });

  it("should not be able to validate as a Member user", async () => {
    const response = await request(app.server)
      .patch(`/events/${randomUUID()}/validate`)
      .send({
        latitude: -27.1066108,
        longitude: -109.2523168,
      })
      .set("Authorization", memberToken);

    expect(response.statusCode).toBe(403);
    expect(response.body).toMatchObject({
      error: "ForbiddenException",
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
