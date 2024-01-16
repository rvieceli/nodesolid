export type CreateInput = {
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

export interface EventsRepository {
  create(data: CreateInput): Promise<EventData>;
  findByUserIdWithinDateRange(
    userId: string,
    range: DateTimeRange,
  ): Promise<EventData[]>;
}
