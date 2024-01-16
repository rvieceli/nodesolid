import { LocationData } from "../repositories/locations.repository";
import {
  Point,
  getDistanceBetweenPoints,
} from "../utils/get-distance-between-points";

export class CheckInDistancePolicy {
  static MAX_DISTANCE_IN_METERS = 100;

  static isAllowed(location: LocationData, userLocation: Point): boolean {
    const { latitude, longitude } = location;

    const distanceInMeters = getDistanceBetweenPoints(
      userLocation,
      [latitude, longitude],
      "meters",
    );

    return distanceInMeters < CheckInDistancePolicy.MAX_DISTANCE_IN_METERS;
  }
}
