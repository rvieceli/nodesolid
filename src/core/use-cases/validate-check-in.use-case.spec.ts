import { EventsRepositoryInMemory } from "@/infra/database/repositories/events-repository.in-memory";
import { describe } from "node:test";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { EventsRepository } from "../repositories/events.repository";
import { ValidateCheckInUseCase } from "./validate-check-in.use-case";
import { randomUUID } from "node:crypto";
import { ResourceNotFoundException } from "../exceptions/resource-not-found.exception";
import { EventExpiredException } from "../exceptions/EventExpired.exception";

describe("ValidateCheckInUseCase", () => {
  let eventsRepository: EventsRepository;
  let useCase: ValidateCheckInUseCase;

  beforeEach(() => {
    vi.useFakeTimers();

    eventsRepository = new EventsRepositoryInMemory();
    useCase = new ValidateCheckInUseCase(eventsRepository);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should validate check-in", async () => {
    const eventToValidate = await eventsRepository.create({
      userId: randomUUID(),
      locationId: randomUUID(),
    });

    vi.advanceTimersByTime(1000);

    const now = new Date();

    vi.setSystemTime(now);

    const { event } = await useCase.handler({
      eventId: eventToValidate.id,
    });

    expect(event).toMatchObject({
      id: eventToValidate.id,
      validatedAt: now,
    });
  });

  it("should return the event if it is already validated", async () => {
    const eventToValidate = await eventsRepository.create({
      userId: randomUUID(),
      locationId: randomUUID(),
    });

    vi.advanceTimersByTime(1000);

    const firstValidationDate = new Date();

    await useCase.handler({
      eventId: eventToValidate.id,
    });

    vi.advanceTimersByTime(1000);

    const { event } = await useCase.handler({
      eventId: eventToValidate.id,
    });

    expect(event).toMatchObject({
      id: eventToValidate.id,
      validatedAt: firstValidationDate,
    });
  });

  it("should throw an error if the event does not exist", async () => {
    await expect(
      useCase.handler({
        eventId: randomUUID(),
      }),
    ).rejects.toThrowError(new ResourceNotFoundException("Event"));
  });

  it("should not be able to validate after expiration time", async () => {
    const eventToValidate = await eventsRepository.create({
      userId: randomUUID(),
      locationId: randomUUID(),
    });

    vi.advanceTimersByTime(1000 * 60 * 23); // 23 minutes

    await expect(
      useCase.handler({
        eventId: eventToValidate.id,
      }),
    ).rejects.toThrowError(EventExpiredException);
  });
});
