# The Infinite Puzzle

An infinite, AI-controlled multiverse game built with Babylon.js.

## Project Brain

Project documentation lives in [`brain/`](brain/README.md) — the canonical source of truth
for vision, architecture, assets, art direction, gameplay, roadmap, and decisions.
New sessions (AI or human) should start with [`brain/CURRENT_STATE.md`](brain/CURRENT_STATE.md).

## Architecture

- `index.html` - Main entry point with location selector
- `js/worlds/` - World definitions and loading logic
- `js/rift.js` - Rift/teleporter system
- `js/player.js` - First-person player controller
- `js/graphics.js` - Post-processing and visual effects

## Locations (Phase A - Real World)

Each location is a high-quality 3D environment:
1. **Apartment** - Modern interior (starting point)
2. **Subway Station** - Urban underground
3. **Victorian Study** - Period room with character
4. **Forest Clearing** - Natural outdoor

## Running

Serve the directory with any local server:
```bash
npx serve .
```

Then open in browser at http://localhost:3000
