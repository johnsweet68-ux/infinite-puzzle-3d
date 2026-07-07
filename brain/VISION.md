# VISION

> **Creative foundation:** what this project is *about* — people, memory, meaning, and why
> anything matters — is defined canonically in **PROJECT_PHILOSOPHY.md**. This document
> owns strategy, constraints, and the quality bar. Where the two seem to pull apart,
> PROJECT_PHILOSOPHY.md governs meaning and intent.

## One paragraph

**The Infinite Puzzle** is a browser-based, first-person 3D puzzle game. The player crosses
between realities through *tears/breaches* into a sequence of *chambers* — real, walkable,
authored 3D spaces drowned in a corrupted-reality atmosphere — and solves a puzzle in each.
Some puzzles are AI-generated server-side. The quality bar is **"a real place you are
standing inside"**, not "a nice-looking scene". Beneath the puzzles and the multiverse,
the project is about people and the meaning they attach to existence — every major
feature is tested against *"What does this teach us about humanity?"*
(PROJECT_PHILOSOPHY.md).

## The pivot that defines the current era

The project began as a 2D layered-canvas game. In mid-2026 it pivoted to a full 3D
first-person walkthrough built on **Babylon.js** (see DECISIONS.md D-001/D-002). The 2D
front-end is scrapped; the concept, aesthetic, progression design, and server-side AI
backends survive. The original pivot rationale and full strategic detail are preserved
verbatim in `reference/PHASE3-HANDOVER-3D-PIVOT.md`.

The core validated finding driving all strategy since the pivot:

> Babylon.js can deliver the target look — the quality gap is authored **art assets**,
> not the engine or the code.

Therefore the project centres on **sourcing/generating/optimising assets and staging
them**, not hand-building geometry.

## Aesthetic north star

**Stranger Things × The Matrix.** Cold, decayed "Upside Down" corruption; drifting spores;
organic vines; flickering practical lights; a breach in the wall; teal/red/amber palette;
film-grain 80s-horror grade. Full visual specification: ART_BIBLE.md.

## Hard constraints (non-negotiable)

1. **Runs in the browser**, and must perform on mid-range hardware **including mobile**.
2. **Licence hygiene** from the first asset: prefer CC0; every asset logged in `CREDITS.md`.
3. **Performance budgets are first-class** — the asset optimisation pipeline (ASSETS.md)
   is not optional.
4. **Consistent art style across chambers** despite mixed-source assets (strongest
   mitigations: AI generation with style fine-tuning, or one CC0 kit family).

## Development philosophy (priority order, set 2026-07-05)

1. Project Brain (this folder) — the operating system for the project itself
2. World Art Bible
3. AI Workflow
4. Development Standards
5. Core Systems
6. Game Features

Accuracy, clarity, and maintainability outrank speed of development. The project is built
to be developed collaboratively by multiple AI systems and human contributors over years.

## Known strategic gaps

- **Game name is unresolved** — blocker for the social/marketing layer.
  `Unknown – requires confirmation.`
- Monetisation / distribution plans: not defined anywhere available to this Brain.
  `Unknown – requires confirmation.`
