export interface Point {
  lat: number;
  lng: number;
}

export type PointTuple = [number, number];

const EARTH_RADIUS_IN_KM = 6371;

function radians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function haversine([lat1, lng1]: PointTuple, [lat2, lng2]: PointTuple): number {
  const lat1R = radians(lat1);
  const lat2R = radians(lat2);
  const deltaR = radians(lng2 - lng1);
  const distanceInKilometers = Math.acos(
    Math.sin(lat1R) * Math.sin(lat2R) +
      Math.cos(lat1R) * Math.cos(lat2R) * Math.cos(deltaR),
  );

  return distanceInKilometers;
}

function isPoint(point: unknown): point is Point {
  return (
    typeof point === "object" &&
    point !== null &&
    "lat" in point &&
    "lng" in point
  );
}

function tuple(point: Point | PointTuple): PointTuple {
  return isPoint(point) ? [point.lat, point.lng] : point;
}

const conversion = {
  meters: 1000,
  kilometers: 1,
  miles: 0.621371192,
  "nautical-miles": 0.539956803,
  feet: 3280.839895013,
  inches: 39370.078740158,
};

function getAvgEarthRadius(unit: keyof typeof conversion): number {
  return EARTH_RADIUS_IN_KM * conversion[unit];
}

export function getDistanceBetweenPoints(
  pointA: Point | PointTuple,
  pointB: Point | PointTuple,
  unit: keyof typeof conversion = "meters",
): number {
  const distance =
    haversine(tuple(pointA), tuple(pointB)) * getAvgEarthRadius(unit);

  return distance;
}
