import { LocationsRepositoryDrizzle } from "@/infra/database/repositories/locations-repository.drizzle";
import { CreateLocationUseCase } from "./create-location.use-case";

export function createLocationUseCaseFactory() {
  const locationsRepository = new LocationsRepositoryDrizzle();

  return new CreateLocationUseCase(locationsRepository);
}
