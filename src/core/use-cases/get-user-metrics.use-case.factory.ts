import { EventsRepositoryDrizzle } from "@/infra/database/repositories/events-repository.drizzle";
import { GetUserMetricsUseCase } from "./get-user-metrics.use-case";

export function getUserMetricsUseCaseFactory() {
  const eventsRepository = new EventsRepositoryDrizzle();

  return new GetUserMetricsUseCase(eventsRepository);
}
