import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EventsRepository } from "../repositories/events.repository";
import { EventsRepositoryInMemory } from "@/infra/database/repositories/events-repository.in-memory";
import { CheckInUseCase } from "./check-in.use-case";
import { randomUUID } from "node:crypto";
import {
  LocationData,
  LocationsRepository,
} from "../repositories/locations.repository";
import { LocationsRepositoryInMemory } from "@/infra/database/repositories/locations-repository.in-memory";
import { ResourceNotFoundException } from "../exceptions/resource-not-found.exception";
import { makeCreateLocationInput } from "./test-samples/location.samples";
import { Point } from "../utils/get-distance-between-points";

const locationCoordinates: Point = {
  lat: -27.125803,
  lng: -109.4213865,
};

const coordinatesWithin100MetersRadius: Point = {
  lat: -27.126155774243696,
  lng: -109.42053861638183,
};

const coordinatesOutside100MetersRadius: Point = {
  lat: -27.1066108,
  lng: -109.2523168,
};

describe("CheckInUseCase", () => {
  let eventsRepository: EventsRepository;
  let locationsRepository: LocationsRepository;
  let checkInUseCase: CheckInUseCase;
  let location: LocationData;

  beforeEach(async () => {
    eventsRepository = new EventsRepositoryInMemory();
    locationsRepository = new LocationsRepositoryInMemory();
    checkInUseCase = new CheckInUseCase(eventsRepository, locationsRepository);

    location = await locationsRepository.create(
      makeCreateLocationInput({
        coordinates: locationCoordinates,
      }),
    );

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    const { event } = await checkInUseCase.handler({
      userId: randomUUID(),
      locationId: location.id,
      userCoordinates: coordinatesWithin100MetersRadius,
    });

    expect(event).toBeDefined();
  });

  it("should not be possible to check in twice in the same day", async () => {
    const userId = randomUUID();

    await checkInUseCase.handler({
      userId,
      locationId: location.id,
      userCoordinates: coordinatesWithin100MetersRadius,
    });

    const rejected = expect(async () =>
      checkInUseCase.handler({
        userId,
        locationId: location.id,
        userCoordinates: coordinatesWithin100MetersRadius,
      }),
    ).rejects;

    rejected.toThrowError(Error);
  });

  it("should be possible to check in twice in different days", async () => {
    const userId = randomUUID();

    vi.setSystemTime(new Date(2023, 0, 14, 10, 0, 0));

    const checkIn1 = await checkInUseCase.handler({
      userId,
      locationId: location.id,
      userCoordinates: coordinatesWithin100MetersRadius,
    });

    vi.setSystemTime(new Date(2023, 0, 15, 10, 0, 0));

    const checkIn2 = await checkInUseCase.handler({
      userId,
      locationId: location.id,
      userCoordinates: coordinatesWithin100MetersRadius,
    });

    expect(checkIn1).toBeDefined();
    expect(checkIn2).toBeDefined();
  });

  it("should not be possible to check in if location does not exist", async () => {
    const rejected = expect(async () =>
      checkInUseCase.handler({
        userId: randomUUID(),
        locationId: randomUUID(),
        userCoordinates: coordinatesWithin100MetersRadius,
      }),
    ).rejects;

    rejected.toBeInstanceOf(ResourceNotFoundException);
    rejected.toThrowError(new ResourceNotFoundException("Location"));
  });

  it("should not be possible to check in if the location is more than 100m away", async () => {
    await expect(() =>
      checkInUseCase.handler({
        userId: randomUUID(),
        locationId: location.id,
        userCoordinates: coordinatesOutside100MetersRadius,
      }),
    ).rejects.toThrowError(Error);
  });
});
