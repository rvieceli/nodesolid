import { PaginatedRequest, PaginatedResponse } from "../utils/pagination";
import { RequireAtLeastOne } from "../utils/types";

export type CreateEventInput = {
  id?: string;
  userId: string;
  locationId: string;
};

export type DateTimeRange = {
  start: Date;
  end: Date;
};

export interface EventData {
  id: string;
  userId: string;
  locationId: string;
  validatedAt: Date | null;
  createdAt: Date;
}

export type UpdateEventInput = RequireAtLeastOne<
  Pick<EventData, "validatedAt">
>;

export interface EventsRepository {
  create(data: CreateEventInput): Promise<EventData>;
  findById(id: string): Promise<EventData | undefined>;
  updateById(id: string, data: UpdateEventInput): Promise<EventData>;
  findByUserIdWithinDateRange(
    userId: string,
    range: DateTimeRange,
  ): Promise<EventData[]>;
  findByUserIdPaginated(
    userId: string,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<EventData>>;
  countByUserId(userId: string): Promise<number>;
}
