import { EventsRepositoryDrizzle } from "@/infra/database/repositories/events-repository.drizzle";
import { CheckInUseCase } from "./check-in.use-case";
import { LocationsRepositoryDrizzle } from "@/infra/database/repositories/locations-repository.drizzle";

export function checkInUseCaseFactory() {
  const eventsRepository = new EventsRepositoryDrizzle();
  const locationsRepository = new LocationsRepositoryDrizzle();

  return new CheckInUseCase(eventsRepository, locationsRepository);
}
