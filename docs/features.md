# Features

> **Status:** Draft. Decisions so far are listed under [Decided](#decided); remaining questions under [Open questions](#open-questions).

## Product vision

Sailing Companion is a phone app for **cruising sailors**: people who take their own or a chartered boat on day trips and multi-day coastal passages. It helps them decide whether and when to go, calculates the best route for their boat, the forecast and the chart, keeps a logbook and lets them sleep well at anchor.

The app is a **planning tool**: it's used before and between passages to plan the route and the departure. **Navigation on board is done in Navionics**; the planned route is exported to Navionics as a GPX file. The logbook and anchor alarm are used on board alongside Navionics.

The app is a **free, personal project**. It is not sold and has no accounts, ads or subscriptions. It is installed on the owner's phones via EAS internal distribution; a public App Store / Play Store release is not planned for v1.

### Sailing areas

The first version is designed for two areas:

| Area | What matters there | Consequences for the app |
| --- | --- | --- |
| **Baltic Sea** (incl. Kattegat, Belt Sea, Gulf of Bothnia/Finland) | Short, steep waves; fast-changing wind; wind-driven water level changes (storm surge and low water, especially in the western Baltic); hardly any tide; many islands, sounds and shallow areas | Show water level deviation instead of tides; include the water level in the depth calculation for routing; wave period matters as much as height; routing must handle narrow sounds, buoyed channels and many short legs |
| **Mediterranean** | Strong local winds (Mistral, Tramontana, Bora, Meltemi, Sirocco…) that can build quickly; thermal sea breezes; longer open-water crossings; negligible tide; deep water close to the coast | Highlight strong-wind risk clearly; routing over longer crossings with larger forecast uncertainty; daily wind pattern (calm morning, afternoon breeze) matters for departure times |

Forecasts, chart data and routing are only offered inside these areas in v1. Outside, the app explains that the area isn't supported yet. More areas can be added later.

### Principles

- **Works at sea.** Coverage is patchy offshore. Everything the sailor saved or recorded, the chart data and the map must work offline; forecasts and routes are cached with a clear "last updated" time.
- **Glanceable.** Big numbers, high contrast, usable with wet hands and in bright sun. Key information readable in under two seconds.
- **Sailor's units by default.** Knots, nautical miles, degrees true, Beaufort as an option. Everything configurable.
- **Local first, no account needed.** Data lives on the device.
- **German first, ready for English.** The app is in German for v1. All text, number, date and unit formatting goes through a translation layer, so adding English later means adding one translation file (see [Localization](#8-localization)).
- **Open data, honestly labelled.** Map and chart data come from open sources (OpenStreetMap, OpenSeaMap, EMODnet). They are good for planning but are not official nautical charts. The app says so clearly and always shows where the data comes from.

### Out of scope for v1

- Official / certified electronic nautical charts (ENC, S-57/S-63); the app uses open chart data instead
- Official weather and gale warnings (planned for a later version)
- Photos in the logbook (planned for a later version)
- English translation (the app is prepared for it, but only German is shipped)
- AIS (other vessels' positions)
- Connecting to boat instruments (NMEA)
- User accounts, cloud sync and social features
- Racing tools (start timer, laylines)
- Sailing areas other than the Baltic Sea and the Mediterranean
- Public App Store / Play Store release

---

## Feature overview

| # | Feature | Priority | Needs custom app build¹ |
| --- | --- | --- | --- |
| 1 | Conditions | Must | No |
| 2 | Boats | Must | No |
| 3 | Trip planning (weather & chart routing) | Must | Probably² |
| 4 | Logbook | Must | Yes (background GPS) |
| 5 | Anchor alarm | Must | Yes (background GPS, alarm sound) |
| 6 | Settings & onboarding | Must | No |
| 7 | Map & chart data | Must | Probably² |
| 8 | Localization (German, English-ready) | Must | No |

¹ Expo Go can't run background location or critical alarms, so these features need a development build made with EAS. Since the app is for personal use only, a development build installed via EAS internal distribution is the normal way to run it anyway.
² Depends on the map library: an offline-capable map with custom vector layers (e.g. MapLibre) needs a development build.

**Suggested build order:** 8 Localization setup + 6 basic settings → 2 Boats → 7 Map & chart data → 1 Conditions → 3 Trip planning → 5 Anchor alarm → 4 Logbook.
Routing needs the boat data, the chart data and the forecast, so those come first. Localization is set up first because every later screen depends on it. The anchor alarm and logbook share the background-GPS work.

---

## 1. Conditions

**Goal:** Answer "Can we go, and when?" for the current position or a saved place.

### User stories

- As a sailor, I want to see the current wind speed, gusts and direction where I am, so I can judge conditions at a glance.
- As a sailor, I want an hour-by-hour forecast for the next days, so I can choose a departure time.
- As a sailor, I want to see wave height and period, so I know how uncomfortable the passage will be.
- As a sailor in the Baltic, I want to see the expected water level deviation, so I know whether there's enough water in shallow harbours and whether the pier will be flooded.
- As a sailor in the Mediterranean, I want a clear warning when a strong wind is forecast, so I'm not caught out by a Mistral or Meltemi.
- As a sailor, I want to save places (home harbour, anchorages), so I can check them quickly before driving down to the boat.
- As a sailor, I want the last forecast available offline, so I can still see it at sea.

### Requirements

- Current conditions: wind speed, gusts, direction (arrow + compass point), air temperature, weather, pressure and pressure trend, visibility if available.
- Marine data: significant wave height, wave period and direction, swell; sea temperature; surface current where available.
- Forecast: hourly for 48 h, then 3-hourly up to 7 days. Highlight hours above the active boat's limits (see [Boats](#2-boats)).
- **Water level (instead of tides):** forecast deviation from mean sea level, mainly for the Baltic. Clearly marked "for planning only". Tide times are not shown, because tides are negligible in both areas.
- **Strong wind warning (forecast-based):** banner when the forecast gusts exceed the boat's limit in the next 48 h at the selected place, with time and expected strength. Official warnings (e.g. DWD sea weather) come in a later version.
- Sunrise, sunset and daylight hours.
- Location: current GPS position by default; switch to any saved place or a point picked on the map (inside the supported areas).
- Offline: show the cached forecast with its age ("Aktualisiert vor 3 Std."); warn when older than 12 h.

### Data sources

[Open-Meteo](https://open-meteo.com): free for non-commercial use, which fits this personal project; no API key.

- **Wind and weather:** DWD ICON-EU / ICON-D2 and other regional models via Open-Meteo's automatic model selection; ECMWF for days 4–7.
- **Waves, swell, currents, sea level:** Open-Meteo Marine API (European wave models for the Baltic and Mediterranean).

Which regional models give the best results in each area should be checked against real conditions during development.

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
- As a sailor, I want to set my comfort limits (max wind, max waves) and how much water I need under the keel, so the route avoids conditions and areas I don't want.
- As a sailor without a polar diagram, I want the app to estimate my boat's sailing speeds from its data, so routing works without one.
- As a sailor, I want the app to learn my real speeds from recorded trips, so the estimates get better over time.

### Boat data

| Group | Fields | Used for |
| --- | --- | --- |
| **General** | Name, type (sailing yacht, catamaran, motor sailer), model, photo | Display, logbook |
| **Dimensions** | Length overall, waterline length, beam, **draft**, **air draft** (mast height above water), displacement | Speed estimate, depth check, bridge and power line clearance in routing, anchor radius |
| **Sailing performance** | Performance setting (cruising / performance / heavy displacement); reefing wind speed; optional polar import | Routing under sail |
| **Motor** | Cruising speed under motor, maximum speed, fuel consumption at cruising speed, fuel tank capacity | Routing under motor, range, fuel estimate |
| **Sailing preferences** | Use motor when sailing speed drops below X kn; closest angle to the true wind (e.g. 45°); night sailing allowed yes/no; max hours per day | Routing |
| **Safety margins** | Minimum depth under the keel (default 1.0 m in the Baltic, 2.0 m in the Mediterranean); minimum clearance above the mast (default 2 m); minimum distance from hazards (rocks, wrecks; default 100 m) | Routing |
| **Comfort limits** | Max wind, max gusts, max wave height, max wind for an upwind course | Routing, highlighting in Conditions |
| **Anchoring** | Chain length, rope length, anchor type and weight | Anchor alarm radius suggestion |

### Requirements

- Several boat profiles; one is **active**. The active boat is shown in Trip planning and can be switched there.
- New boat wizard: only the essential fields first (type, length, draft, motor cruising speed); the rest optional with sensible defaults.
- **Speed model (main source):** since there's no polar diagram for the boats, sailing speeds are **estimated** from waterline length, displacement, type and performance setting, based on hull speed and a generic cruising-yacht polar. The estimate is shown as a polar chart and can be adjusted with a simple factor ("my boat is 10 % slower than estimated").
- **Learned speeds (v1):** after recorded trips, compare the actual speeds with the forecast wind at that time and suggest a correction of the speed model per wind angle. The sailor confirms before it's applied.
- Polar import from common text formats (CSV / tab-separated tables) stays possible as an optional extra.
- Validation and units according to Settings.

### Acceptance criteria

- A boat can be created with only type, length, draft and motor cruising speed, and immediately used for route calculation.
- The estimated speed model is shown as a chart and can be adjusted.
- After at least 3 recorded trips with this boat, the app can suggest a corrected speed model.
- Changing the active boat updates all planned routes' calculations.

---

## 3. Trip planning (weather & chart routing)

**Goal:** The sailor enters where they want to go; the app calculates the best route and departure time for their boat, the forecast and the chart.

### How it works

1. The sailor enters **start, destination and optional via points** on the chart (e.g. "pass north of this island").
2. They choose the **boat**, an **earliest departure** and optionally a **latest arrival**.
3. The app calculates the **best route** using the forecast, the chart data and the boat's data:
   - **Weather:** for each step it considers sailing (speed from the speed model for the wind angle and strength) and motoring (motor cruising speed), and uses the motor when sailing is too slow or impossible (e.g. dead upwind, no wind), according to the boat's preferences. Currents are added to the boat's speed.
   - **Depth:** only water deeper than *draft + minimum depth under keel* is used. In the Baltic, the forecast water level at the time the boat passes is added to the charted depth (low water reduces the depth, high water increases it).
   - **Chart features:** avoids land, rocks, wrecks and obstructions (with the safety distance); avoids prohibited and restricted areas; does not sail inside traffic separation zones and crosses traffic lanes at right angles; respects bridge and power line clearance against the boat's air draft.
   - **Comfort limits:** avoids conditions above the boat's limits; if that's not possible, it says so and shows where and when the limits are exceeded.
   - Uses a standard weather-routing method (isochrones) on a navigation grid built from the chart data. "Best" can be set to **fastest**, **most comfortable** (least wind/waves on the nose) or **least motoring**.
4. The result shows the **route on the chart**, ETA, total distance, time under sail vs. motor, fuel estimate, the minimum depth along the route, and the conditions along the way.
5. **Best departure time:** the calculation is repeated for departure times across a window (e.g. every hour for the next 24–48 h), so the sailor sees which departure gives the best passage.

### User stories

- As a sailor, I want to enter only start, destination and a few via points, so the app works out the route for me.
- As a sailor, I want the route to stay in water that is deep enough for my boat, so I don't run aground.
- As a sailor, I want the route to respect traffic separation schemes and restricted areas, so I sail legally and safely.
- As a sailor, I want the route to use the wind, so I sail as much as possible and only motor when it makes sense.
- As a sailor, I want to see when it's best to leave, so I can plan the morning.
- As a sailor, I want to see the wind, waves and minimum depth on each part of the route, so I can prepare the crew and boat.
- As a sailor, I want to know how much fuel I'll need, so I can refuel in time.
- As a sailor, I want to compare the calculated route with a straight route I draw myself, so I understand the trade-off.
- As a sailor, I want a pre-departure checklist, so I don't forget anything.
- As a sailor, I want to save trips and recalculate them with a new forecast, so I always have the current best route.

### Requirements

- Input: start, destination, up to 10 via points; boat; earliest departure; optional latest arrival; optimisation goal (fastest / most comfortable / least motoring).
- Route calculation on the device, using the downloaded chart data and the forecast grid for the area around the route (wind, gusts, waves, currents, water level).
- Output: route line with turning points, colour-coded by sail / motor and by wind strength; per leg: distance, course, sail or motor, expected speed, wind (true wind angle and speed), waves, minimum depth, ETA.
- Summary: total distance, duration, ETA, hours under sail and under motor, fuel needed vs. tank capacity, minimum depth under keel on the route.
- **Departure window:** chart of passage duration and max wind/waves over departure times; tap a departure time to see that route.
- **Limit warnings:** where and when the comfort limits are exceeded; suggestion to leave earlier/later or to stop at an intermediate harbour.
- **Depth warnings:** sections where the depth under keel is close to the minimum, or where the chart data is coarse (see [Map & chart data](#7-map--chart-data)).
- **Manual comparison:** the sailor can also draw a fixed route; the app then calculates timing, sail/motor and conditions for it, and warns where it crosses shallow water or restricted areas.
- **Harbour approach:** the last part into a harbour or marina is usually narrower than the chart data's resolution. The route ends at the harbour entrance (or the nearest navigable grid point); the approach is done in Navionics.
- **Export to Navionics:** export the planned route (turning points with names and ETAs) as a GPX file via the share sheet, for import into Navionics. Re-export after a recalculation.
- Recalculate with the latest forecast; show when the saved calculation is based on an old forecast.
- Night: respect "night sailing allowed" from the boat preferences (plan to arrive before dark, or warn).
- Checklists: editable pre-departure checklist with a default template (weather checked, crew briefing, life jackets, engine, fuel, water, VHF, float plan shared…). Reset per trip.
- Start trip from a plan: starts a logbook recording with the planned route attached.
- The app does not give turn-by-turn navigation; it's a planning tool.
- Disclaimer: routes are based on open chart data and forecasts; they are not a replacement for official charts and the skipper's judgement.

### Technical notes

- **Navigation grid:** built per area from the chart data (depth, land, hazards, restricted areas, TSS). Pre-processed outside the app into compact files and downloaded per region pack (see [Map & chart data](#7-map--chart-data)), so routing works offline.
- **Forecast data:** fetch a grid of points around the route corridor from Open-Meteo; cache it with the plan.
- **Performance:** a coastal passage (up to ~150 nm) should calculate in a few seconds on a phone. Longer Mediterranean crossings may use a coarser grid in open water and a finer one near the coast.

### Acceptance criteria

- Given start, destination and a boat, the app calculates a route that doesn't cross land or water shallower than draft + margin, and returns a result in under 10 seconds for a 50 nm passage.
- A route never passes through a traffic separation zone or a prohibited area in the chart data.
- In the Baltic, a forecast low water of −50 cm makes the route avoid areas that are only just deep enough at mean sea level.
- With wind dead on the nose and the motor allowed, the route uses the motor; with good sailing wind, it sails.
- The departure window shows at least 24 departure times.
- When the comfort limits can't be met, the app shows where and when instead of silently ignoring them.
- Saved plans, their routes and the chart data are available offline.
- An exported route imports into Navionics with all turning points in the right order.

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
- Events during a trip: timestamped quick entries (preset types + free text) with position; "Engine on/off" events give the motor hours and mark which parts were under sail (used for [learned speeds](#2-boats)).
- Manual trip entry and editing of recorded trips.
- Statistics: per season, per boat and all time: trips, nautical miles, hours under way, hours under sail vs. motor, nights aboard.
- Export: GPX for the track; trip summary as text or PDF (later).
- Photos: later version.

### Acceptance criteria

- A recorded trip keeps tracking with the screen off for at least 8 hours.
- Distance from the track is within 2 % of the true distance on a test route.
- Trips and tracks are stored on the device and survive app restarts and updates.

---

## 5. Anchor alarm

**Goal:** Wake the crew if the anchor drags.

### User stories

- As a sailor, I want to set the anchor position when I drop the anchor, so the app knows where the boat should be.
- As a sailor, I want to set a swing radius based on my chain length and the depth, so normal swinging doesn't trigger the alarm.
- As a sailor, I want a loud alarm when the boat leaves the circle, also when the phone is locked, so I wake up.
- As a sailor, I want to see the boat's track around the anchor, so I can check that the anchor is holding.
- As a sailor, I want to see if a strong wind or wind shift is forecast for the night, so I can let out more chain or choose a better anchorage.

### Requirements

- Set anchor: at the current position, or offset by distance and bearing (the anchor is ahead of the boat, not under the phone).
- Radius: set directly, or suggested from the active boat's chain length and length and the depth (pre-filled from the chart data, editable).
- Watch view: chart with anchor, radius circle, current position, track of the last hours; distance to anchor and GPS accuracy.
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

- **Onboarding:** short intro, location permission explained before the system prompt, disclaimer acceptance, **download chart data** for the first region, **create your first boat** (short wizard, can be skipped).
- **Units:** wind (kn, m/s, Bft, km/h), distance (nm, km), depth (m, ft), temperature (°C, °F), fuel (l, gal).
- **Saved places:** manage home harbour, marinas and anchorages.
- **Charts & offline data:** download, update and delete region packs (see [Map & chart data](#7-map--chart-data)); show size and data date.
- **Recording:** GPS interval for the logbook.
- **Anchor alarm:** default alarm delay and alarm sound.
- **Language:** hidden while only German is available; appears automatically when a second language is added.
- **Data:** export all data, delete all data.
- **About:** version, data sources, licences and required attributions (OpenStreetMap, OpenSeaMap, EMODnet, Open-Meteo), disclaimer.
- Theme: system, light, dark; red night mode to protect night vision (later).

Boat data, speeds, safety margins and comfort limits live in [Boats](#2-boats), not in Settings.

---

## 7. Map & chart data

**Goal:** A nautical map for every screen and the chart data that routing needs, both available offline.

### What's shown and used

| Layer | Source | Used for |
| --- | --- | --- |
| Base map (land, coastline, harbours, place names) | OpenStreetMap | Display |
| **Sea marks** (buoys, beacons, lights, harbour info, anchorages) | **OpenSeaMap** (OpenStreetMap `seamark:*` data) | Display, routing (channels, hazards) |
| **Depth / bathymetry** | **EMODnet Bathymetry** (European seas, approx. 115 m grid), optionally refined with depth contours and soundings from OpenSeaMap where available | Display (depth shading and contours), routing (depth check), anchor radius suggestion |
| Traffic separation schemes, prohibited / restricted areas, cables and pipelines | OpenSeaMap / OpenStreetMap `seamark:*` data | Display, routing |
| Rocks, wrecks, obstructions | OpenSeaMap / OpenStreetMap `seamark:*` data | Display, routing (safety distance) |
| Bridges and overhead power lines with clearance | OpenStreetMap | Routing (air draft) |

### Requirements

- One map style used everywhere in the app: base map + OpenSeaMap sea marks + depth shading with contours (e.g. 2, 5, 10, 20 m), in light and dark (night) variants.
- **Region packs** for offline use, e.g. Western Baltic, Central Baltic, Gulf of Bothnia/Finland, Western Mediterranean, Adriatic, Ionian & Aegean. Each pack contains the map tiles, the sea mark data and the navigation grid for routing.
- Packs are built outside the app by a data pipeline (scripts in this repository) from the open sources, and downloaded in Settings. The app shows each pack's data date and offers updates.
- Tap a sea mark or depth area to see its details (name, type, light characteristics, charted depth).
- **Data quality:** the depth data's resolution is shown where it matters: near harbours, in narrow sounds and in areas with few soundings, the route and the map show "coarse depth data, navigate by official chart".
- Attribution for all sources visible on the map and in About, as their licences require.

### Technical notes

- **Map library:** an offline-capable vector map for React Native (e.g. MapLibre) with self-hosted vector tiles in the region packs. Bulk-downloading tiles from the public OpenStreetMap or OpenSeaMap tile servers is not allowed by their usage policies, so the packs are generated from the raw data instead.
- **Pipeline:** OpenStreetMap extracts for the two areas (base map + `seamark:*` tags) and the EMODnet Bathymetry grid → vector tiles + navigation grid per region. Rebuilt a few times per season.
- **Hosting:** the packs need a place to download from (e.g. GitHub Releases of this repository). See open questions.

### Acceptance criteria

- With a region pack downloaded, the map with sea marks and depths works in flight mode.
- The depth shown at a point matches the EMODnet data for that point.
- Buoys and lights from OpenSeaMap are shown at their correct positions with the right symbols.

---

## 8. Localization

**Goal:** German UI now, English (or other languages) later with minimal work.

### Requirements

- **All UI text** comes from translation files (one per language, e.g. `src/i18n/de.json`); no text is written directly in the screens. German is the only language shipped in v1.
- Translation keys are grouped by screen/feature (e.g. `conditions.now.title`) and support plurals and placeholders ("vor {{count}} Std.").
- **Numbers, dates and times** are formatted with the device locale's rules (German: decimal comma, `08.11.2026`, 24-hour time), never by hand.
- **Units** are formatted through one helper that uses the unit settings and the translation files (e.g. "12 kn", "3 Bft", "0,8 m").
- Sailing terms are stored as translation keys too (points of sail, sea mark types, event types), so the logbook and route results translate automatically.
- Data stored on the device (trips, events, boats) stores codes, not translated text, so switching the language later changes how existing data is shown.
- The device language decides the app language; until English exists, the app is German regardless of the device setting.

### Technical notes

- Library: `i18next` + `react-i18next` with `expo-localization` to read the device locale (to be confirmed against the Expo SDK docs when implementing).
- A check in CI or a script flags missing keys between language files once there's a second language.

### Acceptance criteria

- No user-visible string literals in screen components (checked by lint rule or review).
- Adding an English file and the language option shows the whole app in English without code changes in the screens.

---

## Data model (draft)

| Entity | Main fields |
| --- | --- |
| `Boat` | id, name, type, model, LOA, LWL, beam, draft, airDraft, displacement, performanceSetting, speedFactor, polar?, motorCruiseKn, motorMaxKn, fuelLph, fuelTankL, motorBelowKn, minTrueWindAngle, nightSailing, maxHoursPerDay, minDepthUnderKeelM, minAirClearanceM, hazardDistanceM, limits (wind, gusts, waves), chainM, isActive |
| `SpeedModel` | boatId, true wind speeds[], true wind angles[], boat speeds[][], source (estimated / imported / learned), updatedAt |
| `Place` | id, name, latitude, longitude, type (harbour, anchorage, other), area (baltic, mediterranean) |
| `TripPlan` | id, name, boatId, start, destination, viaPoints[], earliestDeparture, latestArrival?, goal, forecastFetchedAt, chartPackVersion, result? |
| `PlanResult` | departure, eta, distanceNm, hoursSail, hoursMotor, fuelL, minDepthUnderKeelM, legs[], limitWarnings[], depthWarnings[], departureWindow[] |
| `Trip` | id, boatId, planId?, startedAt, endedAt, from, to, distanceNm, engineHours, crew[], notes, weatherSummary |
| `TrackPoint` | tripId, timestamp, latitude, longitude, speedKn, accuracyM |
| `TripEvent` | id, tripId, timestamp, type (code), text, latitude, longitude |
| `AnchorWatch` | id, boatId, anchor position, radiusM, depthM, startedAt, endedAt, alarms[] |
| `Checklist` | id, name, items[] (text, checked) |
| `ChartPack` | id, region, version, dataDate, sizeMb, downloadedAt, path |
| `ForecastCache` | area/location key, fetchedAt, payload |
| `Settings` | units, alarm options, language (later) |

Storage proposal: SQLite on the device (`expo-sqlite`) for boats, plans, trips and tracks; small key-value storage for settings; region packs as files.

---

## Decided

- **Use:** free, personal project; no store release, no monetisation. Open-Meteo's free non-commercial tier is fine.
- **Sailing areas:** Baltic Sea and Mediterranean for v1.
- **Tides:** not shown; replaced by water level deviation (mainly relevant in the Baltic), which is also used in the routing depth check.
- **Trip planning:** weather routing from start, destination and via points, based on the forecast, the boat's data **and chart data** (depth, hazards, traffic separation schemes, restricted areas, clearances).
- **Map:** OpenStreetMap base map with the OpenSeaMap sea mark layer and EMODnet depths, available offline as region packs.
- **Boats:** dedicated section with several boat profiles, one active. No polar diagrams available: speeds are estimated from the boat data and improved from recorded trips.
- **Language:** German only for v1, fully prepared for English.
- **Later versions:** official weather and gale warnings; photos in the logbook.
- **First region pack:** Western Baltic; the other regions follow later.
- **Pack hosting:** region packs are published as GitHub Releases of this repository.
- **Depth margins:** defaults of 1.0 m under the keel in the Baltic and 2.0 m in the Mediterranean.
- **Planning, not navigation:** the app plans routes ahead; navigation on board is done in Navionics. Routes are exported as GPX. EMODnet depth data (~115 m grid) is precise enough for this; routes end at the harbour entrance.

## Open questions

None at the moment.
