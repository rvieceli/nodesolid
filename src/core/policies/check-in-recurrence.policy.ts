import dayjs from "dayjs";
import {
  DateTimeRange,
  EventsRepository,
} from "../repositories/events.repository";

export class CheckInRecurrencePolicy {
  constructor(private readonly eventsRepository: EventsRepository) {}

  async isAllowed(userId: string): Promise<boolean> {
    const today = dayjs();

    // might be a good idea to use timezone (of the User) here
    const todayRange: DateTimeRange = {
      start: today.startOf("day").toDate(),
      end: today.endOf("day").toDate(),
    };

    const userCheckIns =
      await this.eventsRepository.findByUserIdWithinDateRange(
        userId,
        todayRange,
      );

    return userCheckIns.length === 0;
  }
}
