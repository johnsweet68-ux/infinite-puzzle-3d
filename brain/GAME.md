# GAME

What the player experiences. For how it is implemented, see ARCHITECTURE.md.

## Core loop

1. The player stands inside a **chamber** — a walkable, authored 3D interior/space.
2. They explore first-person (WASD + mouse look, pointer lock, collisions).
3. Each chamber contains **one puzzle**. Some puzzles are AI-generated server-side
   (three "chamber personas" exist in the surviving backend — see ARCHITECTURE.md §Backends).
4. Solving the puzzle unlocks progression to the next chamber via a **tear/breach** —
   a physical, glowing rupture in the world the player approaches (and, in the currently
   deployed build, activates with **E**).
5. Repeat, chamber by chamber, deeper into the corrupted sequence of realities.

## Key nouns (project vocabulary)

| Term | Meaning |
|---|---|
| **Chamber** | One self-contained walkable 3D space containing one puzzle |
| **Tear / Breach / Rift** | The glowing rupture used to cross between chambers/realities. All three words appear in project materials; they refer to the same mechanic. Canonical term: `Unknown – requires confirmation.` |
| **Corruption** | The Upside-Down-style visual layer draped over every chamber (fog, spores, vines, breach glow, flicker) |
| **Persona** | A server-side AI "character" that authors a chamber's puzzle (three exist) |

## Progression & unlock logic

The chamber progression / unlock design from the 2D era **survives conceptually**; its
implementation moves into the 3D client. The old 2D landing page tracked
"N CHAMBERS OPENED". Exact rules (linear vs branching, saving, gating):
`Unknown – requires confirmation.`

## Puzzle system

- AI puzzle generation is server-side (`generate-puzzle.js`, Vercel) with three chamber
  personas and `<<<PUZZLE_START>>>` / `<<<PUZZLE_END>>>` marker extraction.
- How a puzzle manifests **inside a 3D chamber** (in-world objects? UI overlay? both?) is
  a Phase D design task — not yet decided. See ROADMAP.md.
- Generated **video** (flaq.ai Seedance backend) is intended to play as **textures on
  surfaces inside chambers** (e.g. a TV screen), replacing the old idea of flat backdrops.

## Chambers

- Number, themes, and order of chambers: `Unknown – requires confirmation.`
- One chamber exists in the live deployed 3D build: **"Modern Apartment"**
  (verified live on infinite-puzzle-3d.netlify.app, 2026-07-05). Its source code has not
  been analysed by this Brain. `Unknown – requires confirmation.`

## Audio

The 2D build's audio-proximity coupling is scrapped. Audio will be re-approached as
**spatial audio in 3D space** (Phase E). No implementation exists yet.

## Name

The game's final name is unresolved. Working title everywhere: **The Infinite Puzzle**.
