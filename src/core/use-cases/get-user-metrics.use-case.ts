import { EventsRepository } from "../repositories/events.repository";

interface GetUserMetricsUseCaseResponse {
  count: number;
}

export class GetUserMetricsUseCase {
  constructor(private readonly eventsRepository: EventsRepository) {}

  async handler(userId: string): Promise<GetUserMetricsUseCaseResponse> {
    const count = await this.eventsRepository.countByUserId(userId);
    return { count };
  }
}
