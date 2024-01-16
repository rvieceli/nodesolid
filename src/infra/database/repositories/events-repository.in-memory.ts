import {
  CreateEventInput,
  EventData,
  EventsRepository,
  DateTimeRange,
} from "@/core/repositories/events.repository";
import { randomUUID } from "crypto";
import { InMemory } from "./in-memory";
import { PaginatedRequest, PaginatedResponse } from "@/core/utils/pagination";

export class EventsRepositoryInMemory
  extends InMemory
  implements EventsRepository
{
  private events: EventData[] = [];

  async create(data: CreateEventInput) {
    const event = {
      id: randomUUID(),
      validatedAt: null,
      ...data,
      createdAt: new Date(),
    };

    this.events.push(event);

    return event;
  }

  async findByUserIdWithinDateRange(
    userId: string,
    range: DateTimeRange,
  ): Promise<EventData[]> {
    return this.events.filter(
      (event) =>
        event.userId === userId &&
        event.createdAt >= range.start &&
        event.createdAt <= range.end,
    );
  }

  async findByUserIdPaginated(
    userId: string,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<EventData>> {
    const allUserEvents = this.events
      .filter((event) => event.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const items = allUserEvents.slice(...this.paginationToSlice(pagination));

    return {
      items,
      page: pagination.page,
      pageSize: pagination.pageSize,
      total: allUserEvents.length,
      totalPages: Math.ceil(allUserEvents.length / pagination.pageSize),
    };
  }

  async countByUserId(userId: string): Promise<number> {
    return this.events.reduce(
      (acc, event) => (event.userId === userId ? acc + 1 : acc),
      0,
    );
  }
}
