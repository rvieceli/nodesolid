import { EventsRepositoryDrizzle } from "@/infra/database/repositories/events-repository.drizzle";
import { ValidateCheckInUseCase } from "./validate-check-in.use-case";

export function validateCheckInUseCaseFactory() {
  const eventsRepository = new EventsRepositoryDrizzle();

  return new ValidateCheckInUseCase(eventsRepository);
}
