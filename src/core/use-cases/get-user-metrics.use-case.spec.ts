import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EventsRepository } from "../repositories/events.repository";
import { EventsRepositoryInMemory } from "@/infra/database/repositories/events-repository.in-memory";
import { randomUUID } from "crypto";
import { GetUserMetricsUseCase } from "./get-user-metrics.use-case";

describe("GetUserMetricsUseCase", () => {
  let eventsRepository: EventsRepository;
  let getUserMetricsUseCase: GetUserMetricsUseCase;

  beforeEach(async () => {
    vi.useFakeTimers();

    eventsRepository = new EventsRepositoryInMemory();
    getUserMetricsUseCase = new GetUserMetricsUseCase(eventsRepository);

    for (let i = 0; i < 10; i++) {
      vi.setSystemTime(new Date(2021, 1, i, 10, 0, 0));

      eventsRepository.create({
        locationId: randomUUID(),
        userId: randomUUID(),
      });
    }
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return the count", async () => {
    const userId = randomUUID();
    const COUNT = 15;

    for (let i = 0; i < COUNT; i++) {
      vi.setSystemTime(new Date(2021, 0, i, 10, 0, 0));

      eventsRepository.create({
        locationId: randomUUID(),
        userId,
      });
    }

    const { count } = await getUserMetricsUseCase.handler(userId);

    expect(count).toBe(COUNT);
  });

  it("should return an count=0 if there're no events for the user", async () => {
    const { count } = await getUserMetricsUseCase.handler(randomUUID());

    expect(count).toBe(0);
  });
});
