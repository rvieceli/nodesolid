import { beforeEach, describe, expect, it } from "vitest";
import { LocationsRepository } from "../repositories/locations.repository";
import { SearchLocationsUseCase } from "./search-locations.use-case";
import { LocationsRepositoryInMemory } from "@/infra/database/repositories/locations-repository.in-memory";
import { PageSizeTooBigException } from "../exceptions/page-size-too-big.exception";
import { makeCreateLocationInput } from "./test-samples/location.samples";

describe("SearchLocationUseCase", () => {
  let locationsRepository: LocationsRepository;
  let searchLocationUseCase: SearchLocationsUseCase;

  beforeEach(() => {
    locationsRepository = new LocationsRepositoryInMemory();
    searchLocationUseCase = new SearchLocationsUseCase(locationsRepository);

    Array.from({ length: 20 }).forEach((_, idx) => {
      locationsRepository.create(
        makeCreateLocationInput({
          name: `Location ${idx}`,
          address: `Address ${idx}`,
          description: `Description ${idx}`,
          phone: `98765432${idx}`,
        }),
      );
    });
  });

  it("should return a paginated list of locations", async () => {
    const page = await searchLocationUseCase.handler({
      query: "Location",
      page: 1,
      pageSize: 10,
    });

    expect(page.items).toHaveLength(10);
    expect(page.page).toBe(1);
    expect(page.pageSize).toBe(10);
    expect(page.total).toBe(20);
    expect(page.totalPages).toBe(2);
  });

  it("should return a paginated list of locations", async () => {
    locationsRepository.create(
      makeCreateLocationInput({
        name: `Unique name`,
        address: `A Street`,
        phone: `98765432`,
      }),
    );

    const page = await searchLocationUseCase.handler({
      query: "Unique",
      page: 1,
      pageSize: 10,
    });

    expect(page).toMatchObject({
      items: [
        {
          name: "Unique name",
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
      searchLocationUseCase.handler({ query: "", page: 1, pageSize }),
    ).rejects.toThrowError(PageSizeTooBigException);
  });
});
