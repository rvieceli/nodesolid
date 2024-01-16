import { EventsRepository } from "../repositories/events.repository";
import { LocationsRepository } from "../repositories/locations.repository";
import { ResourceNotFoundException } from "../exceptions/resource-not-found.exception";
import { Point } from "../utils/get-distance-between-points";
import { CheckInDistancePolicy } from "../policies/check-in-distance.policy";
import { CheckInRecurrencePolicy } from "../policies/check-in-recurrence.policy";
import { TooFarAwayException } from "../exceptions/too-far-away.exception";
import { RecurrenceException } from "../exceptions/recurrence.exception";

export interface CheckInUseCaseRequest {
  userId: string;
  locationId: string;
  userCoordinates: Point;
}

export class CheckInUseCase {
  constructor(
    private readonly eventsRepository: EventsRepository,
    private readonly locationsRepository: LocationsRepository,
  ) {}

  async handler({
    userId,
    locationId,
    userCoordinates,
  }: CheckInUseCaseRequest) {
    const location = await this.locationsRepository.findById(locationId);

    if (!location) {
      throw new ResourceNotFoundException("Location");
    }

    if (!CheckInDistancePolicy.isAllowed(location.coordinates, userCoordinates))
      throw new TooFarAwayException();

    const checkInRecurrencePolicy = new CheckInRecurrencePolicy(
      this.eventsRepository,
    );

    const canUserCheckInToday = await checkInRecurrencePolicy.isAllowed(userId);

    if (!canUserCheckInToday) throw new RecurrenceException();

    const event = await this.eventsRepository.create({
      userId,
      locationId,
    });

    return { event };
  }
}
