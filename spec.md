# Your Age on Other Planets

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Mobile-first single-page calculator app
- Birthdate input (date picker)
- Age calculation for 7 planets using real orbital period ratios relative to Earth:
  - Mercury: 0.2408467 Earth years
  - Venus: 0.6151972 Earth years
  - Mars: 1.8808158 Earth years
  - Jupiter: 11.862615 Earth years
  - Saturn: 29.447498 Earth years
  - Uranus: 84.016846 Earth years
  - Neptune: 164.79132 Earth years
- Results displayed as stacked planet cards showing planet name, icon/symbol, and age
- Fun comparison line highlighting the youngest and oldest planet ages
- Space-themed dark background with subtle animated star field
- All calculations are purely frontend (no backend calls)

### Modify
- Nothing (new project)

### Remove
- Nothing (new project)

## Implementation Plan
1. Minimal Motoko backend (placeholder greeting actor, no real logic needed)
2. Frontend: Star field canvas background animation
3. Frontend: Birthdate input form with validation
4. Frontend: Age calculation logic using orbital period constants
5. Frontend: Planet result cards (stacked, mobile-first)
6. Frontend: Fun comparison line computed from results
7. Frontend: data-ocid markers on all interactive elements
