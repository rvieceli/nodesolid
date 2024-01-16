import {
  Point,
  getDistanceBetweenPoints,
} from "../utils/get-distance-between-points";

export class CheckInDistancePolicy {
  static MAX_DISTANCE_IN_METERS = 100;

  static isAllowed(
    locationCoordinates: Point,
    userCoordinates: Point,
  ): boolean {
    const distanceInMeters = getDistanceBetweenPoints(
      locationCoordinates,
      userCoordinates,
      "meters",
    );

    return distanceInMeters < CheckInDistancePolicy.MAX_DISTANCE_IN_METERS;
  }
}
