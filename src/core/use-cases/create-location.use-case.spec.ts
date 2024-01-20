import { beforeEach, describe, expect, it } from "vitest";
import { CreateLocationUseCase } from "./create-location.use-case";
import { LocationsRepository } from "../repositories/locations.repository";
import { LocationsRepositoryInMemory } from "@/infra/database/repositories/locations-repository.in-memory";
import { makeCreateLocationInput } from "./test-samples/location.samples";

describe("CreateLocationUseCase", () => {
  let createLocationUseCase: CreateLocationUseCase;
  let locationsRepository: LocationsRepository;

  beforeEach(() => {
    locationsRepository = new LocationsRepositoryInMemory();
    createLocationUseCase = new CreateLocationUseCase(locationsRepository);
  });

  it("should be able to create a location", async () => {
    const { location } = await createLocationUseCase.handler(
      makeCreateLocationInput(),
    );

    expect(location).toBeDefined();
    expect(location).toHaveProperty("id");
  });
});
