import { PageSizePolicy } from "../policies/page-size.policy";
import { EventData, EventsRepository } from "../repositories/events.repository";
import { PaginatedResponse } from "../utils/pagination";

export class FetchUserEventsHistoryUseCase {
  constructor(private readonly eventsRepository: EventsRepository) {}

  async handler(
    userId: string,
    page: number = 1,
    pageSize: number = PageSizePolicy.DEFAULT_PAGE_SIZE,
  ): Promise<PaginatedResponse<EventData>> {
    PageSizePolicy.isAllowedOrThrow(pageSize);

    return this.eventsRepository.findByUserIdPaginated(userId, {
      page,
      pageSize,
    });
  }
}
