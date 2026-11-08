# Features

> **Status:** Draft proposal. Decisions still needed are listed under [Open questions](#open-questions).

## Product vision

Sailing Companion is a phone app for **cruising sailors**: people who take their own or a chartered boat on day trips and multi-day coastal passages. It helps them decide whether and when to go, calculates the best route for their boat and the forecast, keeps a logbook and lets them sleep well at anchor.

### Sailing areas

The first version is designed for two areas:

| Area | What matters there | Consequences for the app |
| --- | --- | --- |
| **Baltic Sea** (incl. Kattegat, Belt Sea, Gulf of Bothnia/Finland) | Short, steep waves; fast-changing wind; wind-driven water level changes (storm surge and low water, especially in the western Baltic); hardly any tide; many islands, sounds and shallow areas | Show water level deviation instead of tides; wave period matters as much as height; routing must handle narrow sounds and many short legs |
| **Mediterranean** | Strong local winds (Mistral, Tramontana, Bora, Meltemi, Sirocco…) that can build quickly; thermal sea breezes; longer open-water crossings; negligible tide | Highlight strong-wind risk clearly; routing over longer crossings with larger forecast uncertainty; daily wind pattern (calm morning, afternoon breeze) matters for departure times |

Forecasts, coastline data and routing are only offered inside these areas in v1. Outside, the app explains that the area isn't supported yet. More areas can be added later.

### Principles

- **Works at sea.** Coverage is patchy offshore. Everything the sailor saved or recorded must work offline; forecasts and routes are cached with a clear "last updated" time.
- **Glanceable.** Big numbers, high contrast, usable with wet hands and in bright sun. Key information readable in under two seconds.
- **Sailor's units by default.** Knots, nautical miles, degrees true, Beaufort as an option. Everything configurable.
- **Local first, no account needed.** Data lives on the device. Sync and sharing can come later.
- **Not a navigation instrument.** The app supports planning and awareness; it does not replace official charts, weather warnings or proper seamanship. Calculated routes don't know depths, shoals, traffic separation schemes or restricted areas. This is stated clearly in the app.

### Out of scope for v1

- Nautical charts / chart plotter (base map only)
- Depth-aware routing (no chart data, see [Trip planning](#3-trip-planning-weather-routing))
- AIS (other vessels' positions)
- Connecting to boat instruments (NMEA)
- User accounts, cloud sync and social features
- Racing tools (start timer, laylines)
- Sailing areas other than the Baltic Sea and the Mediterranean

---

## Feature overview

| # | Feature | Priority | Needs custom app build¹ |
| --- | --- | --- | --- |
| 1 | Conditions | Must | No |
| 2 | Boats | Must | No |
| 3 | Trip planning (weather routing) | Must | No |
| 4 | Logbook | Must | Yes (background GPS) |
| 5 | Anchor alarm | Must | Yes (background GPS, alarm sound) |
| 6 | Settings & onboarding | Must | No |

¹ Expo Go can't run background location or critical alarms, so these features need a development build made with EAS.

**Suggested build order:** 6 (basic settings) → 2 Boats → 1 Conditions → 3 Trip planning → 5 Anchor alarm → 4 Logbook. Routing needs the boat data and the forecast, so those come first. The anchor alarm and logbook share the background-GPS work.

---

## 1. Conditions

**Goal:** Answer "Can we go, and when?" for the current position or a saved place.

### User stories

- As a sailor, I want to see the current wind speed, gusts and direction where I am, so I can judge conditions at a glance.
- As a sailor, I want an hour-by-hour forecast for the next days, so I can choose a departure time.
- As a sailor, I want to see wave height and period, so I know how uncomfortable the passage will be.
- As a sailor in the Baltic, I want to see the expected water level deviation, so I know whether there's enough water in shallow harbours and whether the pier will be flooded.
- As a sailor in the Mediterranean, I want a clear warning when a strong local wind is forecast, so I'm not caught out by a Mistral or Meltemi.
- As a sailor, I want to save places (home harbour, anchorages), so I can check them quickly before driving down to the boat.
- As a sailor, I want the last forecast available offline, so I can still see it at sea.

### Requirements

- Current conditions: wind speed, gusts, direction (arrow + compass point), air temperature, weather, pressure and pressure trend, visibility if available.
- Marine data: significant wave height, wave period and direction, swell; sea temperature; surface current where available.
- Forecast: hourly for 48 h, then 3-hourly up to 7 days. Highlight hours above the boat's limits (see [Boats](#2-boats)).
- **Water level (instead of tides):** forecast deviation from mean sea level, mainly for the Baltic. Clearly marked "for planning only". Tide times are not shown, because tides are negligible in both areas.
- **Strong wind warning:** banner when the forecast gusts exceed the boat's limit in the next 48 h at the selected place, with time and expected strength. Official warnings (e.g. DWD sea weather for the German coast) are a later addition, see open questions.
- Sunrise, sunset and daylight hours.
- Location: current GPS position by default; switch to any saved place or a point picked on the map (inside the supported areas).
- Offline: show the cached forecast with its age ("Updated 3 h ago"); warn when older than 12 h.

### Data sources (proposal)

[Open-Meteo](https://open-meteo.com): free, no API key. Its high-resolution European models cover both areas:

- **Wind and weather:** DWD ICON-EU / ICON-D2 and other regional models via Open-Meteo's automatic model selection; ECMWF for days 4–7.
- **Waves, swell, currents, sea level:** Open-Meteo Marine API (European wave models for the Baltic and Mediterranean).

Open-Meteo is free for non-commercial use only; a commercial plan is needed if the app is ever sold. Which regional models give the best results in the Baltic and the Mediterranean should be checked against real conditions during development.

### Acceptance criteria

- With location permission granted and network available, the Conditions screen shows current wind and waves within 3 seconds.
- Without network, the last cached forecast is shown with its age.
- Hours with wind or gusts above the boat's limit are visibly highlighted.
- At a Baltic location, the water level deviation for the next 48 h is shown.

---

## 2. Boats

**Goal:** Store everything about the boat that the route calculation, the logbook and the anchor alarm need.

### User stories

- As a sailor, I want to enter my boat's size, type and speeds once, so routes are calculated for my boat.
- As a sailor who charters, I want to keep several boats and choose which one I'm sailing, so each trip uses the right data.
- As a sailor, I want to set my comfort limits (max wind, max waves), so the route avoids conditions I don't want to sail in.
- As a sailor who has a polar diagram for my boat, I want to import it, so the route calculation is as accurate as possible.
- As a sailor, I want the app to learn my real speeds from recorded trips, so the estimates get better over time.

### Boat data

| Group | Fields | Used for |
| --- | --- | --- |
| **General** | Name, type (sailing yacht, catamaran, motor sailer), model, photo | Display, logbook |
| **Dimensions** | Length overall, waterline length, beam, draft, air draft (mast height), displacement | Default sailing speeds, harbour and bridge warnings, anchor radius |
| **Sailing performance** | Polar diagram (imported), **or** estimated from boat data + a performance setting (cruising / performance / heavy displacement); reefing wind speed | Routing under sail |
| **Motor** | Cruising speed under motor, maximum speed, fuel consumption at cruising speed, fuel tank capacity | Routing under motor, range, fuel estimate |
| **Sailing preferences** | Use motor when sailing speed drops below X kn; closest angle to the true wind (e.g. 45°); night sailing allowed yes/no; max hours per day | Routing |
| **Comfort limits** | Max wind, max gusts, max wave height, max wind for a downwind/upwind course | Routing, highlighting in Conditions |
| **Anchoring** | Chain length, rope length, anchor type and weight | Anchor alarm radius suggestion |

### Requirements

- Several boat profiles; one is **active**. The active boat is shown in Trip planning and can be switched there.
- New boat wizard: only the essential fields first (type, length, motor cruising speed, draft); the rest optional with sensible defaults.
- **Speed model:** if no polar is imported, sailing speeds are estimated from waterline length, type and performance setting (based on hull speed and a generic cruising-yacht polar). The estimate is shown as a polar chart the user can check.
- Polar import from common text formats (e.g. CSV / tab-separated true wind angle × true wind speed tables).
- **Learned speeds (later version):** compare recorded logbook speeds with the forecast wind and adjust the model.
- Validation and units according to Settings.

### Acceptance criteria

- A boat can be created with only type, length, motor cruising speed and draft, and immediately used for route calculation.
- An imported polar is shown as a chart and used by the route calculation.
- Changing the active boat updates all planned routes' calculations.

---

## 3. Trip planning (weather routing)

**Goal:** The sailor enters where they want to go; the app calculates the best route and departure time for their boat and the forecast.

### How it works

1. The sailor enters **start, destination and optional via points** on the map (e.g. "pass north of this island").
2. They choose the **boat**, an **earliest departure** and optionally a **latest arrival**.
3. The app calculates the **best route** using the wind, wave and current forecast and the boat's performance:
   - For each step it considers sailing (speed from the polar for the wind angle and strength) and motoring (motor cruising speed), and uses the motor when sailing is too slow or impossible (e.g. dead upwind, no wind), according to the boat's preferences.
   - Avoids land using coastline data and keeps a safety distance from the coast.
   - Avoids conditions above the boat's comfort limits; if that's not possible, it says so and shows where and when the limits are exceeded.
   - Uses a standard weather-routing method (isochrones) that finds the fastest route; "best" can be set to **fastest**, **most comfortable** (least wind/waves on the nose) or **least motoring**.
4. The result shows the **route on the map**, ETA, total distance, time under sail vs. motor, fuel estimate, and the conditions along the way.
5. **Best departure time:** the calculation is repeated for departure times across a window (e.g. every hour for the next 24–48 h), so the sailor sees which departure gives the best passage.

### User stories

- As a sailor, I want to enter only start, destination and a few via points, so the app works out the route for me.
- As a sailor, I want the route to use the wind, so I sail as much as possible and only motor when it makes sense.
- As a sailor, I want to see when it's best to leave, so I can plan the morning.
- As a sailor, I want to see the wind and waves I'll have on each part of the route, so I can prepare the crew and boat.
- As a sailor, I want to know how much fuel I'll need, so I can refuel in time.
- As a sailor, I want to compare the calculated route with a straight route I draw myself, so I understand the trade-off.
- As a sailor, I want a pre-departure checklist, so I don't forget anything.
- As a sailor, I want to save trips and recalculate them with a new forecast, so I always have the current best route.

### Requirements

- Input: start, destination, up to 10 via points; boat; earliest departure; optional latest arrival; optimisation goal (fastest / most comfortable / least motoring).
- Route calculation on the device, using the forecast grid for the area around the route (wind, gusts, waves, currents).
- Output: route line with turning points, colour-coded by sail / motor and by wind strength; per leg: distance, course, sail or motor, expected speed, wind (true wind angle and speed), waves, ETA.
- Summary: total distance, duration, ETA, hours under sail and under motor, fuel needed vs. tank capacity.
- **Departure window:** chart of passage duration and max wind/waves over departure times; tap a departure time to see that route.
- **Limit warnings:** where and when the comfort limits are exceeded; suggestion to leave earlier/later or to stop at an intermediate harbour.
- **Manual comparison:** the sailor can also draw a fixed route; the app then only calculates timing, sail/motor and conditions for it.
- Recalculate with the latest forecast; show when the saved calculation is based on an old forecast.
- Night: respect "night sailing allowed" from the boat preferences (plan to arrive before dark, or warn).
- Checklists: editable pre-departure checklist with a default template (weather checked, crew briefing, life jackets, engine, fuel, water, VHF, float plan shared…). Reset per trip.
- Start trip from a plan: starts a logbook recording with the planned route attached.
- Clear disclaimer: the route ignores depths, shoals, traffic separation schemes, restricted areas and bridges; always check it against an official chart.

### Technical notes

- **Coastline data:** high-resolution land polygons for the Baltic and the Mediterranean (e.g. from OpenStreetMap), bundled or downloaded once per area so routing works offline.
- **Forecast data:** fetch a grid of points around the route corridor from Open-Meteo; cache it with the plan.
- **Performance:** a coastal passage (up to ~150 nm) should calculate in a few seconds on a phone. Longer Mediterranean crossings may need a coarser grid.

### Acceptance criteria

- Given start, destination and a boat, the app calculates a route that doesn't cross land and returns a result in under 10 seconds for a 50 nm passage.
- With wind dead on the nose and the motor allowed, the route uses the motor; with good sailing wind, it sails.
- The departure window shows at least 24 departure times.
- When the comfort limits can't be met, the app shows where and when instead of silently ignoring them.
- Saved plans and their routes are available offline.

---

## 4. Logbook

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
- Trip data: date, boat, from, to, crew, distance, duration, engine hours, fuel used, notes, weather summary (automatically from Conditions data at start).
- Plan vs. actual: when started from a plan, compare the actual track and times with the planned route.
- Events during a trip: timestamped quick entries (preset types + free text) with position; "Engine on/off" events give the motor hours.
- Photos attached to a trip (later version, see open questions).
- Manual trip entry and editing of recorded trips.
- Statistics: per season, per boat and all time: trips, nautical miles, hours under way, hours under sail vs. motor, nights aboard.
- Export: GPX for the track; trip summary as text or PDF (later).

### Acceptance criteria

- A recorded trip keeps tracking with the screen off for at least 8 hours.
- Distance from the track is within 2 % of the true distance on a test route.
- Trips and tracks are stored on the device and survive app restarts and updates.

---

## 5. Anchor alarm

**Goal:** Wake the crew if the anchor drags.

### User stories

- As a sailor, I want to set the anchor position when I drop the anchor, so the app knows where the boat should be.
- As a sailor, I want to set a swing radius based on my chain length, so normal swinging doesn't trigger the alarm.
- As a sailor, I want a loud alarm when the boat leaves the circle, also when the phone is locked, so I wake up.
- As a sailor, I want to see the boat's track around the anchor, so I can check that the anchor is holding.
- As a sailor in the Mediterranean, I want to see if a strong wind is forecast for the night, so I can let out more chain or choose a better anchorage.

### Requirements

- Set anchor: at the current position, or offset by distance and bearing (the anchor is ahead of the boat, not under the phone).
- Radius: set directly, or suggested from the active boat's chain length, length and the depth entered.
- Watch view: map with anchor, radius circle, current position, track of the last hours; distance to anchor and GPS accuracy.
- Night forecast: wind and gusts (and wind shift) for the next 12 h at the anchorage.
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

## 6. Settings & onboarding

### Requirements

- **Onboarding:** short intro, location permission explained before the system prompt, disclaimer acceptance, **create your first boat** (short wizard, can be skipped).
- **Units:** wind (kn, m/s, Bft, km/h), distance (nm, km), depth (m, ft), temperature (°C, °F), fuel (l, gal).
- **Saved places:** manage home harbour, marinas and anchorages.
- **Recording:** GPS interval for the logbook.
- **Anchor alarm:** default alarm delay and alarm sound.
- **Offline data:** download coastline data for the Baltic and/or the Mediterranean.
- **Data:** export all data, delete all data.
- **About:** version, data sources and licences, disclaimer.
- Theme: system, light, dark; red night mode to protect night vision (later).

Boat data, speeds and comfort limits live in [Boats](#2-boats), not in Settings.

---

## Data model (draft)

| Entity | Main fields |
| --- | --- |
| `Boat` | id, name, type, model, LOA, LWL, beam, draft, airDraft, displacement, performanceSetting, polar?, motorCruiseKn, motorMaxKn, fuelLph, fuelTankL, motorBelowKn, minTrueWindAngle, nightSailing, maxHoursPerDay, limits (wind, gusts, waves), chainM, isActive |
| `Polar` | boatId, true wind speeds[], true wind angles[], boat speeds[][], source (imported / estimated / learned) |
| `Place` | id, name, latitude, longitude, type (harbour, anchorage, other), area (baltic, mediterranean) |
| `TripPlan` | id, name, boatId, start, destination, viaPoints[], earliestDeparture, latestArrival?, goal, forecastFetchedAt, result? |
| `PlanResult` | departure, eta, distanceNm, hoursSail, hoursMotor, fuelL, legs[], limitWarnings[], departureWindow[] |
| `Trip` | id, boatId, planId?, startedAt, endedAt, from, to, distanceNm, engineHours, crew[], notes, weatherSummary |
| `TrackPoint` | tripId, timestamp, latitude, longitude, speedKn, accuracyM |
| `TripEvent` | id, tripId, timestamp, type, text, latitude, longitude |
| `AnchorWatch` | id, boatId, anchor position, radiusM, startedAt, endedAt, alarms[] |
| `Checklist` | id, name, items[] (text, checked) |
| `ForecastCache` | area/location key, fetchedAt, payload |
| `Settings` | units, alarm options, downloaded areas |

Storage proposal: SQLite on the device (`expo-sqlite`) for boats, plans, trips and tracks; small key-value storage for settings; coastline data as files.

---

## Decided

- **Sailing areas:** Baltic Sea and Mediterranean for v1.
- **Tides:** not shown; replaced by water level deviation (mainly relevant in the Baltic).
- **Trip planning:** weather routing from start, destination and via points, based on the forecast and the boat's data.
- **Boats:** dedicated section with several boat profiles, one active.

## Open questions

1. **Polars:** do you have a polar diagram for your own boat? If most users won't, the estimated speed model needs to be good. How should the performance setting be presented?
2. **Official warnings:** add official sea weather and gale warnings (DWD for the German Baltic, other national services in the Mediterranean) in v1, or later?
3. **Maps:** Apple Maps / Google Maps base map (simple, free) or an open map with optional sea marks (OpenSeaMap overlay)? Offline map tiles for the two areas?
4. **Routing restrictions:** should the sailor be able to mark areas to avoid (e.g. a shallow bay, a military area) as a simple workaround for missing chart data?
5. **Photos in the logbook:** v1 or later?
6. **Language:** English only for v1, or English and German?
7. **Monetisation:** free/personal project, or a paid app later? This affects data source licences (Open-Meteo is free for non-commercial use only).
