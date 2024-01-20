import { beforeEach, describe, expect, it } from "vitest";
import { LocationsRepository } from "../repositories/locations.repository";
import { LocationsRepositoryInMemory } from "@/infra/database/repositories/locations-repository.in-memory";
import { SearchNearbyLocationsUseCase } from "./search-nearby-locations.use-case";
import {
  makeCoordinates,
  makeCreateLocationInput,
} from "./test-samples/location.samples";
import { Point } from "../utils/get-distance-between-points";
import { PageSizeTooBigException } from "../exceptions/page-size-too-big.exception";

describe("SearchNearbyLocationsUseCase", () => {
  let locationsRepository: LocationsRepository;
  let searchNearbyLocationsUseCase: SearchNearbyLocationsUseCase;

  beforeEach(() => {
    locationsRepository = new LocationsRepositoryInMemory();
    searchNearbyLocationsUseCase = new SearchNearbyLocationsUseCase(
      locationsRepository,
    );

    Array.from({ length: 20 }).forEach(() => {
      locationsRepository.create(
        makeCreateLocationInput({
          coordinates: {
            // nearby easter island
            lat: 45.4 + Math.random() / 10,
            lng: 7.8 + Math.random() / 10,
          },
        }),
      );
    });
  });

  it("should return a list of locations", async () => {
    const useCoordinates: Point = {
      // nearby Malta
      lat: 35.8929442,
      lng: 14.4241799,
    };
    const locationCoordinates: Point = {
      lat: 35.8984239,
      lng: 14.4138949,
    };

    locationsRepository.create(
      makeCreateLocationInput({
        coordinates: locationCoordinates,
      }),
    );

    const page = await searchNearbyLocationsUseCase.handler({
      coordinates: useCoordinates,
      page: 1,
      pageSize: 10,
    });

    expect(page).toMatchObject({
      items: [
        {
          coordinates: locationCoordinates,
        },
      ],
      page: 1,
      pageSize: 10,
      total: 1,
      totalPages: 1,
    });
  });

  it("should throw an error when page size is too big", async () => {
    const pageSize = 100;

    await expect(
      searchNearbyLocationsUseCase.handler({
        coordinates: makeCoordinates(),
        page: 1,
        pageSize,
      }),
    ).rejects.toThrowError(PageSizeTooBigException);
  });
});
