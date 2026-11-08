# Screens

> **Status:** Draft proposal, based on [features.md](features.md). Screen names match the planned Expo Router routes.

## Navigation map

```
Onboarding (first launch only)
  └─ Welcome → Location permission → Disclaimer

Tab bar
├─ Conditions                     /
│   ├─ Location picker            /places
│   └─ Day forecast               /forecast/[day]
├─ Plan                           /plan
│   ├─ Route editor               /plan/[routeId]/edit
│   ├─ Route briefing             /plan/[routeId]
│   └─ Checklist                  /plan/checklist
├─ Logbook                        /logbook
│   ├─ Active trip                /logbook/active
│   ├─ Trip detail                /logbook/[tripId]
│   ├─ Trip editor                /logbook/[tripId]/edit   (also "new")
│   └─ Statistics                 /logbook/stats
└─ Anchor                         /anchor
    ├─ Anchor setup               /anchor/setup
    └─ Alarm (full screen)        /anchor/alarm

Settings (gear icon in the header of every tab)   /settings
  ├─ Units, Boat profile, Wind limits, Saved places,
  └─ Recording, Anchor alarm, Data, About
```

**Global elements**

- **Activity banner:** while a trip is recording or an anchor watch is running, a slim banner above the tab bar shows it (e.g. "Recording · 12.4 nm · 2:31 h" or "Anchor watch · 18 m from anchor"). Tapping it opens the active screen.
- **Offline indicator:** small badge in the header when there's no network.

Every data screen defines four states: **loading**, **content**, **empty**, **error / offline**.

---

## Onboarding

| Screen | Content | Actions |
| --- | --- | --- |
| Welcome | App name, three short benefit lines (conditions, planning & logbook, anchor alarm) | Continue |
| Location permission | Why location is used (conditions where you are, trip recording, anchor alarm), note that background access is asked later when needed | Allow, Not now |
| Disclaimer | "Not for navigation" text | Accept (required) |

---

## Conditions tab

### Conditions (`/`)

**Purpose:** Wind and sea state now and next, for one place.

**Content (top to bottom)**

1. Header: place name (current position or saved place), "Updated 10 min ago", offline badge.
2. **Now card:** big wind speed and gusts with direction arrow and compass point; colour-coded against the wind limit. Below: weather icon, air temperature, pressure + trend.
3. **Sea card:** wave height, period and direction; swell; sea temperature.
4. **Next hours strip:** horizontal scroll, hourly for 48 h: time, wind arrow, speed/gust, wave height. Hours over the limit highlighted.
5. **Tides card:** next high and low water with heights, small curve for today; "for planning only".
6. **Days list:** 7 days with min/max wind, dominant direction, weather icon. Tap → Day forecast.
7. Sunrise / sunset.

**Actions:** tap place name → Location picker; pull to refresh.

**States:** no location permission → prompt with button to grant or pick a saved place; offline → cached data with age; no cache → empty state "Connect to load the forecast".

### Location picker (`/places`)

Current position, list of saved places, search by name, "Pick on map". Add / rename / delete saved places.

### Day forecast (`/forecast/[day]`)

Hour-by-hour table for one day: wind, gusts, direction, waves, weather, pressure. Wind chart over the day.

---

## Plan tab

### Routes (`/plan`)

**Content:** list of saved routes (name, total distance, number of waypoints, last used); "Pre-departure checklist" entry.

**Actions:** New route → Route editor; tap route → Route briefing; swipe to duplicate or delete.

**Empty state:** illustration + "Plan your first passage" button.

### Route editor (`/plan/[routeId]/edit`)

**Content:** full-screen map; waypoints as numbered markers connected by lines; bottom sheet with the waypoint list (drag to reorder), per-leg distance and course, total distance.

**Actions:** tap map to add waypoint; drag marker to move; tap marker to rename or delete; undo; name and save route.

### Route briefing (`/plan/[routeId]`)

**Content**

1. Small map with the route.
2. Inputs: departure date and time, planned speed (defaults from boat profile).
3. Summary: total distance, duration, ETA.
4. Legs table: leg, distance, course, ETA at waypoint, forecast wind and waves at that time (highlighted over limit).
5. Departure window: compact comparison of departing −3 h … +6 h (max wind and gust along the route).

**Actions:** Edit route, Open checklist, **Start trip** (→ Active trip with this route).

### Checklist (`/plan/checklist`)

Checkable list, grouped (Weather, Crew, Safety, Boat, Navigation). Edit items, reset all.

---

## Logbook tab

### Logbook (`/logbook`)

**Content:** big **Start trip** button (or the active trip card while recording); season summary (trips, nm, hours); list of trips grouped by month: date, from → to, distance, duration, mini track preview.

**Actions:** Start trip → Active trip; tap trip → Trip detail; "Add trip manually" → Trip editor; Statistics.

**Empty state:** "No trips yet. Start recording on your next sail."

### Active trip (`/logbook/active`)

**Content:** map with the track so far and the planned route (if any); big numbers: speed over ground, distance, duration; average and max speed; next waypoint with distance and course (if a route is attached).

**Actions:** **Add event** (quick buttons: Reef, Sails up, Engine on/off, Moored, Note…); **Stop trip** (with confirmation) → Trip editor to complete the details.

### Trip detail (`/logbook/[tripId]`)

Map with the full track; summary (date, from → to, distance, duration, avg/max speed, engine hours); weather at departure; crew; events timeline; notes. Actions: Edit, Export GPX, Delete.

### Trip editor (`/logbook/[tripId]/edit`)

Form: from, to, date and times, crew, boat, engine hours, notes. For manual trips also distance.

### Statistics (`/logbook/stats`)

Season selector; totals (trips, nm, hours under way, nights aboard); distance per month chart; longest trip.

---

## Anchor tab

### Anchor (`/anchor`)

**Idle state:** short explanation and **Drop anchor** button → Anchor setup. Last anchor watches listed (place, date, duration, alarms).

**Watching state (anchor watch running)**

- Full map centred on the anchor: anchor icon, radius circle, boat position, track of the last hours.
- Big numbers: distance to anchor / radius (e.g. "18 / 40 m"), GPS accuracy, bearing to anchor.
- Status line: "Holding" (green), "Near the edge" (amber, > 80 % of radius), "Outside" (red).
- Battery status and warning.
- Actions: Adjust radius, Re-anchor here, **Stop watch** (press and hold to confirm).

### Anchor setup (`/anchor/setup`)

1. Anchor position: "At my position" or "Offset" (distance and bearing from the boat).
2. Radius: slider, or calculate from chain length and depth.
3. Preview on the map.
4. **Start watch** → requests background location and notification permission the first time.

### Alarm (`/anchor/alarm`)

Full-screen red alert shown when the alarm fires (and as a notification when the phone is locked): "Anchor alarm: 52 m from anchor (radius 40 m)", map, **Silence** (snooze), **Stop watch**. Same screen for "GPS signal lost".

---

## Settings (`/settings`)

Grouped list, each group opens a sub-screen or inline controls:

- **Units:** wind, distance, depth, temperature
- **Boat:** name, type, length, draft, cruising speed, chain length
- **Wind limits:** wind and gust thresholds
- **Saved places**
- **Logbook recording:** GPS interval
- **Anchor alarm:** default radius, alarm delay, sound
- **Appearance:** system / light / dark
- **Data:** export all, delete all
- **About:** version, data sources and licences, disclaimer

---

## Change from the current skeleton

The skeleton has the four tabs with placeholder screens. To match this spec we'll add:

- Settings route and a gear button in the tab headers
- Nested stacks inside the Plan, Logbook and Anchor tabs (`(tabs)/plan/_layout.tsx` etc.)
- Onboarding flow shown on first launch
- Activity banner component above the tab bar
