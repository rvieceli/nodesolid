import {
  DateTimeRange,
  EventsRepository,
} from "../repositories/events.repository";
import dayjs from "dayjs";

export interface CheckInUseCaseRequest {
  userId: string;
  locationId: string;
}

export class CheckInUseCase {
  constructor(private eventsRepository: EventsRepository) {}

  async handler({ userId, locationId }: CheckInUseCaseRequest) {
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

    if (userCheckIns.length > 0) {
      throw new Error("User already checked in today");
    }

    const event = await this.eventsRepository.create({
      userId,
      locationId,
    });

    return { event };
  }
}
