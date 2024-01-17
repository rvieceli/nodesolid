import { ResourceNotFoundException } from "../exceptions/resource-not-found.exception";
import { CheckInExpirationPolicy } from "../policies/check-in-expiration.policy";
import { EventData, EventsRepository } from "../repositories/events.repository";

interface ValidateCheckInUseCaseRequest {
  eventId: string;
}

interface ValidateCheckInUseCaseResponse {
  event: EventData;
}

export class ValidateCheckInUseCase {
  constructor(private readonly eventsRepository: EventsRepository) {}

  async handler({
    eventId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const event = await this.eventsRepository.findById(eventId);

    if (!event) {
      throw new ResourceNotFoundException("Event");
    }

    CheckInExpirationPolicy.isAllowedOrThrow(event);

    if (event.validatedAt) {
      return { event };
    }

    const eventUpdated = await this.eventsRepository.updateById(eventId, {
      validatedAt: new Date(),
    });

    return {
      event: eventUpdated,
    };
  }
}
