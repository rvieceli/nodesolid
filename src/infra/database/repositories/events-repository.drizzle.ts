import {
  CreateEventInput,
  DateTimeRange,
  EventsRepository,
  UpdateEventInput,
} from "@/core/repositories/events.repository";
import { PaginatedRequest, PaginatedResponse } from "@/core/utils/pagination";
import { database } from "..";
import { eq, count, and, between, desc } from "drizzle-orm";
import { events } from "../schema";

export class EventsRepositoryDrizzle implements EventsRepository {
  async create(data: CreateEventInput) {
    const [event] = await database
      .insert(events)
      .values(data)
      .returning()
      .execute();

    return event;
  }

  async findById(id: string) {
    return database.query.events.findFirst({
      where: eq(events.id, id),
    });
  }

  async updateById(id: string, data: UpdateEventInput) {
    const [event] = await database
      .update(events)
      .set(data)
      .where(eq(events.id, id))
      .returning()
      .execute();

    return event;
  }

  async findByUserIdWithinDateRange(userId: string, range: DateTimeRange) {
    return database
      .select()
      .from(events)
      .where(
        and(
          eq(events.userId, userId),
          between(events.createdAt, range.start, range.end),
        ),
      )
      .execute();
  }

  async findByUserIdPaginated(userId: string, pagination: PaginatedRequest) {
    const { items, total } = await database.transaction(
      async (trx) => {
        const items = await trx
          .select()
          .from(events)
          .where(eq(events.userId, userId))
          .limit(pagination.pageSize)
          .offset((pagination.page - 1) * pagination.pageSize)
          .orderBy(desc(events.createdAt))
          .execute();

        const [{ total }] = await trx
          .select({
            total: count(),
          })
          .from(events)
          .where(eq(events.userId, userId))
          .execute();

        return { items, total };
      },
      { accessMode: "read only" },
    );

    return new PaginatedResponse(items, total, pagination);
  }

  async countByUserId(userId: string) {
    const [{ total }] = await database
      .select({
        total: count(),
      })
      .from(events)
      .where(eq(events.userId, userId))
      .execute();

    return total;
  }
}
