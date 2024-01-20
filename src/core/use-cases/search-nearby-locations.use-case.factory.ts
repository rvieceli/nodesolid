import { LocationsRepositoryDrizzle } from "@/infra/database/repositories/locations-repository.drizzle";
import { SearchNearbyLocationsUseCase } from "./search-nearby-locations.use-case";

export function searchNearbyLocationUseCaseFactory() {
  const locationsRepository = new LocationsRepositoryDrizzle();

  return new SearchNearbyLocationsUseCase(locationsRepository);
}
