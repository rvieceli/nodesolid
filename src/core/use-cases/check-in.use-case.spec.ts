import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EventsRepository } from "../repositories/events.repository";
import { EventsRepositoryInMemory } from "@/infra/database/repositories/events-repository.in-memory";
import { CheckInUseCase } from "./check-in.use-case";
import { randomUUID } from "node:crypto";

describe("CheckInUseCase", () => {
  let eventsRepository: EventsRepository;
  let checkInUseCase: CheckInUseCase;

  beforeEach(() => {
    eventsRepository = new EventsRepositoryInMemory();
    checkInUseCase = new CheckInUseCase(eventsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    const { event } = await checkInUseCase.handler({
      userId: randomUUID(),
      locationId: randomUUID(),
    });

    expect(event).toBeDefined();
  });

  it("should not be possible to check in twice in the same day", async () => {
    const userId = randomUUID();

    await checkInUseCase.handler({ userId, locationId: randomUUID() });

    const rejected = expect(async () =>
      checkInUseCase.handler({ userId, locationId: randomUUID() }),
    ).rejects;

    rejected.toThrowError(Error);
  });

  it("should be possible to check in twice in different days", async () => {
    const userId = randomUUID();

    vi.setSystemTime(new Date(2023, 0, 14, 10, 0, 0));

    const checkIn1 = await checkInUseCase.handler({
      userId,
      locationId: randomUUID(),
    });

    vi.setSystemTime(new Date(2023, 0, 15, 10, 0, 0));

    const checkIn2 = await checkInUseCase.handler({
      userId,
      locationId: randomUUID(),
    });

    expect(checkIn1).toBeDefined();
    expect(checkIn2).toBeDefined();
  });
});
