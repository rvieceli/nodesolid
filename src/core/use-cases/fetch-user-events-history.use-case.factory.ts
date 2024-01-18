import { EventsRepositoryDrizzle } from "@/infra/database/repositories/events-repository.drizzle";
import { FetchUserEventsHistoryUseCase } from "./fetch-user-events-history.use-case";

export function fetchUserEventsHistoryUseCaseFactory() {
  const eventsRepository = new EventsRepositoryDrizzle();

  return new FetchUserEventsHistoryUseCase(eventsRepository);
}
