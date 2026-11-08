export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type Waypoint = Coordinate & {
  id: string;
  name: string;
};

export type Route = {
  id: string;
  name: string;
  waypoints: Waypoint[];
};

export type LogEntry = {
  id: string;
  startedAt: string; // ISO 8601
  endedAt?: string; // ISO 8601
  from: string;
  to: string;
  distanceNm?: number;
  windKnots?: number;
  notes?: string;
};
