import {
  CreateInput,
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

  async create(data: CreateInput) {
    const event = {
      ...data,
      id: randomUUID(),
      validatedAt: null,
      createdAt: new Date(),
    };

    this.events.push(event);

    return event;
  }

  async findByUserIdWithinDateRange(
    userId: string,
    range: DateTimeRange,
  ): Promise<EventData[]> {
    const events = this.events.filter(
      (event) =>
        event.userId === userId &&
        event.createdAt >= range.start &&
        event.createdAt <= range.end,
    );

    return events;
  }
}
