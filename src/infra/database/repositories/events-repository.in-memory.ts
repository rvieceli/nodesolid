import {
  CreateEventInput,
  EventData,
  EventsRepository,
  DateTimeRange,
  UpdateEventInput,
} from "@/core/repositories/events.repository";
import { randomUUID } from "crypto";
import { InMemory } from "./in-memory";
import { PaginatedRequest, PaginatedResponse } from "@/core/utils/pagination";
import { ResourceNotFoundException } from "@/core/exceptions/resource-not-found.exception";

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

  async updateById(id: string, data: UpdateEventInput): Promise<EventData> {
    const event = await this.findById(id);

    if (!event) {
      throw new ResourceNotFoundException("Event");
    }

    Object.assign(event, data);

    return event;
  }

  async findById(id: string): Promise<EventData | undefined> {
    return this.events.find((event) => event.id === id);
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
