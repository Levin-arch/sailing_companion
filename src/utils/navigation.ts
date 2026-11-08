import type { Coordinate } from '@/types';

const EARTH_RADIUS_M = 6_371_000;
const METERS_PER_NAUTICAL_MILE = 1852;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

/** Great-circle distance between two coordinates in meters (haversine formula). */
export function distanceMeters(a: Coordinate, b: Coordinate): number {
  const dLat = toRadians(b.latitude - a.latitude);
  const dLon = toRadians(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(a.latitude)) * Math.cos(toRadians(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
}

export function metersToNauticalMiles(meters: number): number {
  return meters / METERS_PER_NAUTICAL_MILE;
}

export function knotsToMetersPerSecond(knots: number): number {
  return (knots * METERS_PER_NAUTICAL_MILE) / 3600;
}

/** True when the boat has moved further from the anchor position than the alarm radius. */
export function isOutsideAnchorRadius(
  anchor: Coordinate,
  boat: Coordinate,
  radiusMeters: number,
): boolean {
  return distanceMeters(anchor, boat) > radiusMeters;
}
