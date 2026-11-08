# Screens

> **Status:** Draft proposal, based on [features.md](features.md). Screen names match the planned Expo Router routes.

## Navigation map

```
Onboarding (first launch only)
  └─ Welcome → Location permission → Disclaimer → Create your first boat (skippable)

Tab bar
├─ Conditions                     /
│   ├─ Location picker            /places
│   └─ Day forecast               /forecast/[day]
├─ Plan                           /plan
│   ├─ New plan                   /plan/new
│   ├─ Route result               /plan/[planId]
│   │   ├─ Departure window       /plan/[planId]/departures
│   │   └─ Leg detail             /plan/[planId]/legs/[leg]
│   └─ Checklist                  /plan/checklist
├─ Logbook                        /logbook
│   ├─ Active trip                /logbook/active
│   ├─ Trip detail                /logbook/[tripId]
│   ├─ Trip editor                /logbook/[tripId]/edit   (also "new")
│   └─ Statistics                 /logbook/stats
└─ Anchor                         /anchor
    ├─ Anchor setup               /anchor/setup
    └─ Alarm (full screen)        /anchor/alarm

Boats (boat button in the header of every tab, and the boat chip in Plan)
├─ My boats                       /boats
├─ Boat detail                    /boats/[boatId]
├─ Boat editor                    /boats/[boatId]/edit     (also "new", as a wizard)
└─ Speed model / polar            /boats/[boatId]/polar

Settings (gear icon in the header of every tab)   /settings
```

**Global elements**

- **Header:** every tab shows the **active boat** (name + small icon) on the left, which opens My boats, and the Settings gear on the right.
- **Activity banner:** while a trip is recording or an anchor watch is running, a slim banner above the tab bar shows it (e.g. "Recording · 12.4 nm · 2:31 h" or "Anchor watch · 18 m from anchor"). Tapping it opens the active screen.
- **Offline indicator:** small badge in the header when there's no network.
- **Outside supported area:** when the position or a chosen point is outside the Baltic or the Mediterranean, the screen explains that the area isn't supported yet.

Every data screen defines four states: **loading**, **content**, **empty**, **error / offline**.

---

## Onboarding

| Screen | Content | Actions |
| --- | --- | --- |
| Welcome | App name, three short benefit lines (conditions, route planning for your boat, logbook & anchor alarm), supported areas: Baltic Sea and Mediterranean | Continue |
| Location permission | Why location is used (conditions where you are, trip recording, anchor alarm), note that background access is asked later when needed | Allow, Not now |
| Disclaimer | "Not for navigation": routes ignore depths, shoals, traffic separation schemes and restricted areas | Accept (required) |
| Create your first boat | Short version of the boat wizard: type, length, motor cruising speed, draft | Save, Skip for now |

---

## Conditions tab

### Conditions (`/`)

**Purpose:** Wind and sea state now and next, for one place.

**Content (top to bottom)**

1. Header: place name (current position or saved place), "Updated 10 min ago", offline badge.
2. **Strong wind banner** (only when relevant): "Gusts up to 34 kn expected Thu 14:00–22:00", in red/amber. Tap → Day forecast.
3. **Now card:** big wind speed and gusts with direction arrow and compass point; colour-coded against the active boat's limits. Below: weather icon, air temperature, pressure + trend.
4. **Sea card:** wave height, period and direction; swell; sea temperature; current if available.
5. **Next hours strip:** horizontal scroll, hourly for 48 h: time, wind arrow, speed/gust, wave height. Hours over the boat's limits highlighted.
6. **Water level card** (Baltic): deviation from mean sea level now and the next 48 h as a small chart, e.g. "+45 cm Thu evening"; "for planning only". Hidden in the Mediterranean.
7. **Days list:** 7 days with min/max wind, dominant direction, weather icon. Tap → Day forecast.
8. Sunrise / sunset.

**Actions:** tap place name → Location picker; pull to refresh.

**States:** no location permission → prompt with button to grant or pick a saved place; offline → cached data with age; no cache → empty state "Connect to load the forecast"; outside supported area → explanation and button to pick a place in the Baltic or Mediterranean.

### Location picker (`/places`)

Current position, list of saved places grouped by area (Baltic, Mediterranean), search by name, "Pick on map". Add / rename / delete saved places.

### Day forecast (`/forecast/[day]`)

Hour-by-hour table for one day: wind, gusts, direction, waves, weather, pressure, water level (Baltic). Wind chart over the day.

---

## Plan tab

### Plans (`/plan`)

**Content:** active boat chip (tap to switch boat); list of saved plans: name, start → destination, best departure and ETA, "Forecast from 6 h ago" when outdated; "Pre-departure checklist" entry.

**Actions:** **New plan** → New plan; tap a plan → Route result; swipe to duplicate or delete; pull to recalculate all with the latest forecast.

**Empty state:** "Plan your first passage: enter start and destination, the app finds the best route for your boat."

**No boat yet:** "Add your boat first, so routes are calculated for it" → Boat editor wizard.

### New plan (`/plan/new`)

**Content:** full-screen map with a bottom sheet.

1. Map: tap to set **Start**, **Destination**, and add **Via points** (numbered). Saved places and the current position can be picked from a list. Drag to move, tap to remove.
2. Bottom sheet:
   - Boat (active boat, switchable)
   - Earliest departure (date + time), optional latest arrival
   - Goal: **Fastest** · **Most comfortable** · **Least motoring**
   - Advanced (collapsed): allow motor yes/no, allow night sailing (default from boat), departure window length (12 / 24 / 48 h)
3. **Calculate route** button.

**States:** point on land → "Move this point onto the water"; outside supported area → explanation; offline → "Calculation needs a forecast; connect to the internet" (or use a cached forecast if one exists for the area).

**Calculating:** progress indicator with steps (loading forecast → calculating routes → comparing departure times). Cancel.

### Route result (`/plan/[planId]`)

**Content**

1. **Map:** calculated route, coloured by sail (blue) / motor (grey) and with wind arrows along the way; turning points; optional comparison line for the straight route.
2. **Summary card:** recommended departure, ETA, distance, duration, hours under sail / under motor, fuel needed vs. tank, max wind and waves on the way.
3. **Limit warnings** (if any): "Gusts 32 kn between 15:00 and 17:00 near waypoint 3, above your limit of 25 kn", with suggestions (leave 3 h earlier, stop in harbour X).
4. **Departure window preview:** small chart of passage duration and max wind over departure times; "See all" → Departure window.
5. **Legs list:** per leg: course, distance, sail or motor, true wind angle and speed, waves, expected boat speed, ETA. Tap → Leg detail.
6. Forecast basis: "Forecast from today 06:00 UTC" and a **Recalculate** button.

**Actions:** Recalculate, Edit inputs (→ New plan with values), Compare with straight route, Open checklist, **Start trip** (→ Active trip with this route), Share/Export (GPX of the route).

**States:** no route possible within limits → the closest result plus a clear explanation of which limit blocks it and when; outdated forecast → banner "Forecast is 9 h old, recalculate".

### Departure window (`/plan/[planId]/departures`)

Chart and list of departure times across the window: for each, duration, ETA, max wind/gusts, max waves, hours under motor, and whether limits are exceeded. The best option per goal is marked. Tap a departure time → Route result for that departure.

### Leg detail (`/plan/[planId]/legs/[leg]`)

One leg: map section, course, distance, sail/motor, point of sail (close-hauled, beam reach, …), wind and waves over time, expected speed from the polar.

### Checklist (`/plan/checklist`)

Checkable list, grouped (Weather, Crew, Safety, Boat, Navigation). Edit items, reset all.

---

## Logbook tab

### Logbook (`/logbook`)

**Content:** big **Start trip** button (or the active trip card while recording); season summary (trips, nm, hours, filterable by boat); list of trips grouped by month: date, boat, from → to, distance, duration, mini track preview.

**Actions:** Start trip → Active trip; tap trip → Trip detail; "Add trip manually" → Trip editor; Statistics.

**Empty state:** "No trips yet. Start recording on your next sail."

### Active trip (`/logbook/active`)

**Content:** map with the track so far and the planned route (if any); big numbers: speed over ground, distance, duration; average and max speed; next waypoint with distance, course and ahead/behind plan (if started from a plan).

**Actions:** **Add event** (quick buttons: Reef, Sails up, Engine on/off, Moored, Note…); **Stop trip** (with confirmation) → Trip editor to complete the details.

### Trip detail (`/logbook/[tripId]`)

Map with the full track (and the planned route if any); summary (date, boat, from → to, distance, duration, avg/max speed, engine hours, fuel); plan vs. actual; weather at departure; crew; events timeline; notes. Actions: Edit, Export GPX, Delete.

### Trip editor (`/logbook/[tripId]/edit`)

Form: boat, from, to, date and times, crew, engine hours, fuel, notes. For manual trips also distance.

### Statistics (`/logbook/stats`)

Season and boat selector; totals (trips, nm, hours under way, under sail vs. motor, nights aboard); distance per month chart; longest trip.

---

## Anchor tab

### Anchor (`/anchor`)

**Idle state:** short explanation and **Drop anchor** button → Anchor setup. Last anchor watches listed (place, date, duration, alarms).

**Watching state (anchor watch running)**

- Full map centred on the anchor: anchor icon, radius circle, boat position, track of the last hours.
- Big numbers: distance to anchor / radius (e.g. "18 / 40 m"), GPS accuracy, bearing to anchor.
- Status line: "Holding" (green), "Near the edge" (amber, > 80 % of radius), "Outside" (red).
- **Night forecast strip:** wind, gusts and direction for the next 12 h; warning if wind increases or shifts strongly.
- Battery status and warning.
- Actions: Adjust radius, Re-anchor here, **Stop watch** (press and hold to confirm).

### Anchor setup (`/anchor/setup`)

1. Anchor position: "At my position" or "Offset" (distance and bearing from the boat).
2. Radius: slider, or calculate from depth (entered) and the active boat's chain length and boat length.
3. Preview on the map.
4. **Start watch** → requests background location and notification permission the first time.

### Alarm (`/anchor/alarm`)

Full-screen red alert shown when the alarm fires (and as a notification when the phone is locked): "Anchor alarm: 52 m from anchor (radius 40 m)", map, **Silence** (snooze), **Stop watch**. Same screen for "GPS signal lost".

---

## Boats

### My boats (`/boats`)

**Content:** list of boat profiles: photo, name, type and length, motor cruising speed; the **active** boat marked. 

**Actions:** tap → Boat detail; **Set as active**; **Add boat** → Boat editor wizard; swipe to delete (with confirmation; trips keep the boat name).

**Empty state:** "Add your boat so routes are calculated for it."

### Boat detail (`/boats/[boatId]`)

Overview grouped like the editor: General, Dimensions, Sailing performance (polar chart preview + source: imported / estimated), Motor, Sailing preferences, Comfort limits, Anchoring. Statistics for this boat (trips, nm). Actions: Edit, Set as active, View speed model.

### Boat editor (`/boats/[boatId]/edit`, `/boats/new`)

**New boat = wizard** (each step can be skipped except step 1):

1. **Basics:** name, type (sailing yacht / catamaran / motor sailer), length overall, draft
2. **Motor:** cruising speed, maximum speed, fuel consumption, tank capacity
3. **Sailing:** waterline length, displacement, performance (cruising / performance / heavy), reefing wind speed, or **import polar**
4. **Preferences & limits:** motor when sailing speed below X kn, closest angle to the wind, night sailing allowed, max hours per day, max wind / gusts / waves
5. **Anchoring:** chain length, rope length, anchor type and weight

**Edit = one scrolling form** with the same groups. Fields show units from Settings; sensible defaults are pre-filled and marked "estimated".

### Speed model / polar (`/boats/[boatId]/polar`)

Polar chart (boat speed over true wind angle for several wind speeds) and the same data as a table. Source shown: estimated / imported / learned. Actions: **Import polar file**, adjust performance setting, reset to estimate. Motor speed shown as a reference line.

---

## Settings (`/settings`)

Grouped list, each group opens a sub-screen or inline controls:

- **Units:** wind, distance, depth, temperature, fuel
- **Saved places**
- **Offline data:** download coastline data for the Baltic / Mediterranean, with size and status
- **Logbook recording:** GPS interval
- **Anchor alarm:** default alarm delay, sound
- **Appearance:** system / light / dark
- **Data:** export all, delete all
- **About:** version, data sources and licences, disclaimer

---

## Change from the current skeleton

The skeleton has the four tabs with placeholder screens. To match this spec we'll add:

- Boats section (`/boats/...`) and the active-boat button in the tab headers
- Settings route and a gear button in the tab headers
- Nested stacks inside the Plan, Logbook and Anchor tabs (`(tabs)/plan/_layout.tsx` etc.)
- Onboarding flow shown on first launch, including the first-boat wizard
- Activity banner component above the tab bar
