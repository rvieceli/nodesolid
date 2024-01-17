import { PageSizePolicy } from "../policies/page-size.policy";
import { EventData, EventsRepository } from "../repositories/events.repository";
import { PaginatedRequest, PaginatedResponse } from "../utils/pagination";

interface FetchUserEventsHistoryUseCaseRequest
  extends Partial<PaginatedRequest> {
  userId: string;
}

export class FetchUserEventsHistoryUseCase {
  constructor(private readonly eventsRepository: EventsRepository) {}

  async handler({
    userId,
    page = 1,
    pageSize = PageSizePolicy.DEFAULT_PAGE_SIZE,
  }: FetchUserEventsHistoryUseCaseRequest): Promise<
    PaginatedResponse<EventData>
  > {
    PageSizePolicy.isAllowedOrThrow(pageSize);

    return this.eventsRepository.findByUserIdPaginated(userId, {
      page,
      pageSize,
    });
  }
}
