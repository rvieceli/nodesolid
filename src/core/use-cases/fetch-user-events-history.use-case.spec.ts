import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EventsRepository } from "../repositories/events.repository";
import { EventsRepositoryInMemory } from "@/infra/database/repositories/events-repository.in-memory";
import { FetchUserEventsHistoryUseCase } from "./fetch-user-events-history.use-case";
import { randomUUID } from "crypto";
import { PageSizeTooBigException } from "../exceptions/page-size-too-big.exception";

describe("FetchUserEventsHistoryUseCase", () => {
  let eventsRepository: EventsRepository;
  let fetchUserEventsHistoryUseCase: FetchUserEventsHistoryUseCase;

  beforeEach(async () => {
    vi.useFakeTimers();

    eventsRepository = new EventsRepositoryInMemory();
    fetchUserEventsHistoryUseCase = new FetchUserEventsHistoryUseCase(
      eventsRepository,
    );

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

  it("should return an empty paginated list of events", async () => {
    const { items, page, pageSize, total, totalPages } =
      await fetchUserEventsHistoryUseCase.handler(randomUUID(), 1, 10);

    expect(items).toHaveLength(0);
    expect(page).toBe(1);
    expect(pageSize).toBe(10);
    expect(total).toBe(0);
    expect(totalPages).toBe(0);
  });

  it("should return a paginated list of events", async () => {
    const userId = randomUUID();
    const locationId = randomUUID();

    vi.setSystemTime(new Date(2021, 0, 1, 10, 0, 0));
    eventsRepository.create({
      locationId,
      userId,
    });

    vi.setSystemTime(new Date(2021, 0, 2, 10, 0, 0));
    eventsRepository.create({
      locationId,
      userId,
    });

    const { items, page, pageSize, total, totalPages } =
      await fetchUserEventsHistoryUseCase.handler(userId, 1, 10);

    expect(items).toMatchObject([
      {
        userId,
        locationId,
        createdAt: new Date(2021, 0, 2, 10, 0, 0),
      },
      {
        userId,
        locationId,
        createdAt: new Date(2021, 0, 1, 10, 0, 0),
      },
    ]);
    expect(page).toBe(1);
    expect(pageSize).toBe(10);
    expect(total).toBe(2);
    expect(totalPages).toBe(1);
  });

  it("should paginate events correctly", async () => {
    const userId = randomUUID();
    for (let i = 0; i < 15; i++) {
      vi.setSystemTime(new Date(2021, 0, i, 10, 0, 0));

      eventsRepository.create({
        locationId: randomUUID(),
        userId,
      });
    }

    const page1 = await fetchUserEventsHistoryUseCase.handler(userId, 1, 10);

    expect(page1.items).toHaveLength(10);
    expect(page1.page).toBe(1);
    expect(page1.pageSize).toBe(10);
    expect(page1.total).toBe(15);
    expect(page1.totalPages).toBe(2);

    const page2 = await fetchUserEventsHistoryUseCase.handler(userId, 2, 10);

    expect(page2.items).toHaveLength(5);
    expect(page2.page).toBe(2);
    expect(page2.pageSize).toBe(10);
    expect(page2.total).toBe(15);
    expect(page2.totalPages).toBe(2);
  });

  it("should throw an error when page size is too big", async () => {
    const userId = randomUUID();
    const pageSize = 100;

    await expect(
      fetchUserEventsHistoryUseCase.handler(userId, 1, pageSize),
    ).rejects.toThrowError(PageSizeTooBigException);
  });
});
