import { LocationsRepositoryDrizzle } from "@/infra/database/repositories/locations-repository.drizzle";
import { SearchNearByLocationsUseCase } from "./search-near-by-locations.use-case";

export function searchNearByLocationUseCaseFactory() {
  const locationsRepository = new LocationsRepositoryDrizzle();

  return new SearchNearByLocationsUseCase(locationsRepository);
}
