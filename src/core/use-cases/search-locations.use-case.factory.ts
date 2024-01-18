import { LocationsRepositoryDrizzle } from "@/infra/database/repositories/locations-repository.drizzle";
import { SearchLocationsUseCase } from "./search-locations.use-case";

export function searchLocationUseCaseFactory() {
  const locationsRepository = new LocationsRepositoryDrizzle();

  return new SearchLocationsUseCase(locationsRepository);
}
