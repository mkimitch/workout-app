# Rack

A vertical slice of a self-hosted workout tracker, built to answer one question:
**what should starting, performing and finishing a workout feel like on a phone?**

The flow is Home → choose a routine → Active Workout → Finish → Summary. The
Active Workout screen is the part that matters; everything else exists to reach
it and to close the loop afterwards.

This is a prototype, not a product. There is no backend, no persistence and no
history beyond the mock data described below.

## Running it

```sh
yarn
yarn dev          # http://localhost:5173, also served on the LAN for phone testing
```

Other scripts:

```sh
yarn typecheck    # tsc -b, strict
yarn test         # vitest run
yarn test:watch
yarn lint         # oxlint
yarn build        # typecheck + production bundle
yarn preview      # serve the production build
```

To try it on a phone, run `yarn dev` and open the printed Network URL on a device
on the same network.

## Layout

```
src/
  domain/       types, formatting and pure workout logic (no React, no data source)
  data/         mock routines, exercises and history behind a small repository module
  state/        reducer, factory that wires data into the domain, announcer context
  hooks/        elapsed clock, rest timer, theme, screen focus
  components/   ui/ primitives, workout/ and home/ feature components
  screens/      Home, Active Workout, Summary
  styles/       design tokens and base styles
```

`src/data/workoutRepository.ts` is the only module that reads stored data. It is
synchronous and in-memory today; replacing it with local storage or a fetch layer
should not require changes above it.

## Conventions

- Native modern CSS with nesting. No preprocessor, no CSS-in-JS, no utility
  framework.
- Light and dark themes are described once each; the resolved theme is stamped on
  `<html>` as `data-theme` before first paint.
- Semantic HTML first. The only custom widget is the set-completion toggle, which
  follows the WAI-ARIA toggle button pattern.
- Tabs for indentation, arrow functions, destructured and alphabetised imports.
