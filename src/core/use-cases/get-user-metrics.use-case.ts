import { EventsRepository } from "../repositories/events.repository";

interface GetUserMetricsUseCaseResponse {
  count: number;
}

interface GetUserMetricsUseCaseRequest {
  userId: string;
}

export class GetUserMetricsUseCase {
  constructor(private readonly eventsRepository: EventsRepository) {}

  async handler({
    userId,
  }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {
    const count = await this.eventsRepository.countByUserId(userId);
    return { count };
  }
}
