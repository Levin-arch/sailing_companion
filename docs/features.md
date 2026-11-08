# Features

> **Status:** Draft proposal. Everything here is open for discussion; decisions still needed are listed under [Open questions](#open-questions).

## Product vision

Sailing Companion is a phone app for **cruising sailors**: people who take their own or a chartered boat on day trips and multi-day coastal passages. It helps them decide whether and when to go, plan the passage, keep a logbook and sleep well at anchor.

### Principles

- **Works at sea.** Coverage is patchy offshore. Everything the sailor saved or recorded must work offline; forecasts are cached with a clear "last updated" time.
- **Glanceable.** Big numbers, high contrast, usable with wet hands and in bright sun. Key information readable in under two seconds.
- **Sailor's units by default.** Knots, nautical miles, degrees true, Beaufort as an option. Everything configurable.
- **Local first, no account needed.** Data lives on the device. Sync and sharing can come later.
- **Not a navigation instrument.** The app supports planning and awareness; it does not replace official charts, tide tables or proper seamanship. This is stated clearly in the app.

### Out of scope for v1

- Nautical charts / chart plotter (base map only, see [Trip planning](#2-trip-planning))
- AIS (other vessels' positions)
- Connecting to boat instruments (NMEA)
- User accounts, cloud sync and social features
- Racing tools (start timer, laylines)

---

## Feature overview

| # | Feature | Priority | Needs custom app build¹ |
| --- | --- | --- | --- |
| 1 | Conditions | Must | No |
| 2 | Trip planning | Must | No |
| 3 | Logbook | Must | Yes (background GPS) |
| 4 | Anchor alarm | Must | Yes (background GPS, alarm sound) |
| 5 | Settings & onboarding | Must | No |

¹ Expo Go can't run background location or critical alarms, so these features need a development build made with EAS.

**Suggested build order:** 5 (basic settings) → 1 → 2 → 4 → 3. Conditions and planning are useful straight away and testable in Expo Go; the anchor alarm and logbook share the background-GPS work.

---

## 1. Conditions

**Goal:** Answer "Can we go, and when?" for the current position or a saved place.

### User stories

- As a sailor, I want to see the current wind speed, gusts and direction where I am, so I can judge conditions at a glance.
- As a sailor, I want an hour-by-hour forecast for the next days, so I can choose a departure time.
- As a sailor, I want to see wave height and period, so I know how uncomfortable the passage will be.
- As a sailor, I want to save places (home harbour, anchorages), so I can check them quickly before driving down to the boat.
- As a sailor, I want the last forecast available offline, so I can still see it at sea.

### Requirements

- Current conditions: wind speed, gusts, direction (arrow + compass point), air temperature, weather, pressure and pressure trend, visibility if available.
- Marine data: significant wave height, wave period and direction, swell; sea temperature.
- Forecast: hourly for 48 h, then 3-hourly up to 7 days. Highlight hours above the user's wind limit (see Settings).
- Tides: high and low water times and heights where data is available, clearly marked as "for planning only". See open questions.
- Sunrise, sunset and daylight hours.
- Location: current GPS position by default; switch to any saved place or a point picked on the map.
- Offline: show the cached forecast with its age ("Updated 3 h ago"); warn when older than 12 h.

### Data source (proposal)

[Open-Meteo](https://open-meteo.com): free, no API key, worldwide. Forecast API for wind and weather, Marine API for waves, swell and sea level. Free for non-commercial use; a commercial plan is needed if the app is ever sold.

### Acceptance criteria

- With location permission granted and network available, the Conditions screen shows current wind and waves within 3 seconds.
- Without network, the last cached forecast is shown with its age.
- Hours with wind or gusts above the user's limit are visibly highlighted.

---

## 2. Trip planning

**Goal:** Plan a passage from A to B, see how long it takes and what the weather will be on the way.

### User stories

- As a sailor, I want to draw a route by tapping waypoints on a map, so I can plan a passage.
- As a sailor, I want to see each leg's distance and course, and the total distance, so I can estimate the passage.
- As a sailor, I want to enter my expected boat speed and departure time, so I get an ETA for each waypoint.
- As a sailor, I want to see the forecast wind at each waypoint at the time I'll be there, so I can spot the difficult part of the trip.
- As a sailor, I want a pre-departure checklist, so I don't forget anything.
- As a sailor, I want to save routes and reuse them, so I don't redraw common passages.

### Requirements

- Map with tap-to-add waypoints; drag to move, tap to rename or delete; reorder in a list view.
- Per leg: distance (nm), course (° true), time at the planned speed.
- Totals: distance, duration, ETA from departure time.
- Passage forecast: wind and waves at each waypoint at its ETA.
- Departure time suggestion: show how the passage forecast changes if departing earlier or later (e.g. −3 h to +6 h).
- Checklists: editable pre-departure checklist with a default template (weather checked, crew briefing, life jackets, engine, fuel, water, VHF, float plan shared…). Reset per trip.
- Start trip from a route: starts a logbook recording with the route attached.
- Disclaimer: base map is not a nautical chart; depth and hazards are not shown.

### Acceptance criteria

- A route with at least 2 waypoints shows per-leg distance and course, and total distance accurate to 0.1 nm.
- Changing speed or departure time updates ETAs immediately.
- Saved routes are available offline.

---

## 3. Logbook

**Goal:** Keep a record of every trip, mostly automatically.

### User stories

- As a sailor, I want to start recording when I leave the harbour and stop when I arrive, so my trip is logged with track, distance and time.
- As a sailor, I want recording to continue when my phone is locked, so I don't have to keep the app open.
- As a sailor, I want to add notes and events during the trip (reefed, engine on, sighting), so the log tells the story.
- As a sailor, I want to add a trip afterwards by hand, so trips without recording also count.
- As a sailor, I want to see season totals, so I know how far and how long I've sailed.
- As a sailor, I want to export a trip, so I can share it or keep a backup.

### Requirements

- Trip recording: start/stop, GPS track in the background, live distance, duration, speed over ground (current and average), max speed.
- Battery-aware: configurable recording interval; show the impact in Settings.
- Trip data: date, from, to, crew, boat, distance, duration, engine hours, notes, weather summary (automatically from Conditions data at start).
- Events during a trip: timestamped quick entries (preset types + free text) with position.
- Photos attached to a trip (later version, see open questions).
- Manual trip entry and editing of recorded trips.
- Statistics: per season and all time: trips, nautical miles, hours under way, nights aboard.
- Export: GPX for the track; trip summary as text or PDF (later).

### Acceptance criteria

- A recorded trip keeps tracking with the screen off for at least 8 hours.
- Distance from the track is within 2 % of the true distance on a test route.
- Trips and tracks are stored on the device and survive app restarts and updates.

---

## 4. Anchor alarm

**Goal:** Wake the crew if the anchor drags.

### User stories

- As a sailor, I want to set the anchor position when I drop the anchor, so the app knows where the boat should be.
- As a sailor, I want to set a swing radius based on my chain length, so normal swinging doesn't trigger the alarm.
- As a sailor, I want a loud alarm when the boat leaves the circle, also when the phone is locked, so I wake up.
- As a sailor, I want to see the boat's track around the anchor, so I can check that the anchor is holding.

### Requirements

- Set anchor: at the current position, or offset by distance and bearing (the anchor is ahead of the boat, not under the phone).
- Radius: set directly, or suggested from chain length and depth.
- Watch view: map with anchor, radius circle, current position, track of the last hours; distance to anchor and GPS accuracy.
- Alarm: when outside the radius for a configurable time (e.g. 10 s), to avoid false alarms from GPS jumps. Loud sound + vibration + full-screen alert, also in the background and in silent mode as far as the OS allows.
- GPS lost alarm: alert when no position fix for a configurable time.
- Battery warning when the phone battery is low and not charging.
- Snooze and "re-anchor here".
- Keeps running in the background until stopped; survives app restarts.

### Acceptance criteria

- The alarm sounds within 30 seconds after the boat (phone) leaves the radius, with the phone locked.
- No alarm when the phone stays within the radius for 8 hours in normal GPS conditions.
- Stopping the watch always requires a deliberate action (no accidental stop).

---

## 5. Settings & onboarding

### Requirements

- **Onboarding:** short intro, location permission explained before the system prompt, disclaimer acceptance.
- **Units:** wind (kn, m/s, Bft, km/h), distance (nm, km), depth (m, ft), temperature (°C, °F).
- **Boat profile:** name, type, length, draft, typical cruising speed (used in Trip planning), anchor chain length.
- **Wind limit:** wind and gust thresholds used for highlighting in Conditions and Trip planning.
- **Saved places:** manage home harbour, marinas and anchorages.
- **Recording:** GPS interval for the logbook.
- **Anchor alarm:** default radius, alarm delay, alarm sound.
- **Data:** export all data, delete all data.
- **About:** version, data sources and licences, disclaimer.
- Theme: system, light, dark; red night mode to protect night vision (later).

---

## Data model (draft)

| Entity | Main fields |
| --- | --- |
| `Place` | id, name, latitude, longitude, type (harbour, anchorage, other) |
| `Route` | id, name, waypoints[], plannedSpeedKn, createdAt |
| `Waypoint` | id, name, latitude, longitude |
| `Trip` | id, startedAt, endedAt, from, to, routeId?, distanceNm, crew[], notes, weatherSummary |
| `TrackPoint` | tripId, timestamp, latitude, longitude, speedKn, accuracyM |
| `TripEvent` | id, tripId, timestamp, type, text, latitude, longitude |
| `AnchorWatch` | id, anchor position, radiusM, startedAt, endedAt, alarms[] |
| `Checklist` | id, name, items[] (text, checked) |
| `ForecastCache` | location key, fetchedAt, payload |
| `Settings` | units, boat profile, limits, alarm options |

Storage proposal: SQLite on the device (`expo-sqlite`) for trips, tracks and routes; small key-value storage for settings.

---

## Open questions

1. **Tides:** Open-Meteo's sea-level data is a model, not an official tide table. Is that good enough for v1 (marked "for planning only"), or do we need official tide data for specific countries later?
2. **Region:** No focus for now, so data sources must be worldwide. Revisit if most users end up in one area (e.g. North Sea tides, Mediterranean local winds).
3. **Maps:** Apple Maps / Google Maps base map (simple, free) or an open map with optional sea marks (OpenSeaMap overlay)? Offline map tiles?
4. **Photos in the logbook:** v1 or later?
5. **Multiple boats:** one boat profile, or several (e.g. own boat + charter boats)?
6. **Language:** English only for v1, or English and German?
7. **Monetisation:** free/personal project, or a paid app later? This affects data source licences (Open-Meteo is free for non-commercial use only).
