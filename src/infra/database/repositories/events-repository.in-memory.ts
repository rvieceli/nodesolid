import {
  CreateEventInput,
  EventData,
  EventsRepository,
  DateTimeRange,
} from "@/core/repositories/events.repository";
import { randomUUID } from "crypto";
import { InMemory } from "./in-memory";

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
}
