import dayjs from "dayjs";
import { EventData } from "../repositories/events.repository";
import { EventExpiredException } from "../exceptions/EventExpired.exception";

export class CheckInExpirationPolicy {
  static MAX_TIME_IN_MINUTES = 20;

  static isAllowed(event: EventData): boolean {
    const differentInMinutes = dayjs().diff(event.createdAt, "minute");
    return differentInMinutes <= this.MAX_TIME_IN_MINUTES;
  }

  static isAllowedOrThrow(event: EventData): void {
    if (!this.isAllowed(event)) {
      throw new EventExpiredException();
    }
  }
}
