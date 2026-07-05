# DECISIONS

Append-only log of significant decisions (lightweight ADR format). Never edit or delete
an entry; supersede it with a new one. Add an entry whenever a choice would otherwise
have to be re-litigated by a future session.

---

## D-001 · Scrap the 2D canvas client; rebuild as first-person 3D — **Accepted** (≈2026-06/07)
- **Context:** The 2D layered-canvas approach hit its ceiling for the target immersion.
- **Decision:** Full pivot to a browser-based first-person 3D walkthrough. 2D front-end,
  its renderer, mouse-proximity system, and audio coupling are scrapped. Concept,
  aesthetic, progression design, and server backends survive.
- **Consequences:** Front-end is greenfield. Old 2D deploys kept only as reference.
- **Source:** `reference/PHASE3-HANDOVER-3D-PIVOT.md`.

## D-002 · Babylon.js as the engine — **Accepted** (≈2026-06/07)
- **Context:** Validated extensively with four live test scenes (two preserved in
  `reference/`) covering glTF/Draco runtime loading, IBL, PBR, SSAO2, post stack,
  first-person collisions, particles.
- **Decision:** Babylon.js (core + loaders). No visual editor.
- **Consequences:** All rendering work follows Babylon idioms; reference code is the
  canonical pattern library.

## D-003 · Assets-first strategy; no hand-built production geometry — **Accepted** (≈2026-06/07)
- **Context:** Core validation finding: engine quality was never the gap — authored
  assets were. Hand-built primitive shells read as flat regardless of lighting.
- **Decision:** Production chambers use authored environment models / high-quality
  modular kits + authored hero props. Hand-built boxes are test scaffolding only.
- **Consequences:** Asset sourcing + optimisation pipeline (ASSETS.md) is the critical
  path of the whole project.

## D-004 · CC0-first licensing with a mandatory per-asset log — **Accepted** (≈2026-06/07)
- **Decision:** Prefer CC0 sources; every asset logged in `CREDITS.md` on addition
  (asset, source, author, licence, changes).
- **Consequences:** Commercial-safe by construction; small ongoing discipline cost.

## D-005 · Babylon via CDN UMD globals; no build step — **Provisional** (2026-07-05)
- **Context:** Both proven reference scenes load `cdn.babylonjs.com` UMD bundles; the
  cloud build environment cannot reach npm; a build step adds friction for a static site.
- **Decision:** Keep CDN globals + plain static files for now. Revisit (npm + bundler,
  version pinning, offline resilience) once the repo/CI picture is confirmed.
- **Consequences:** Zero tooling; engine version currently floats with the CDN
  (**risk** — pin an explicit version URL when ratifying this decision).

## D-006 · Keep the AI backends; do not touch until Phase D — **Accepted** (≈2026-06/07)
- **Decision:** `generate-puzzle.js` and `generate-video.js` (Vercel) survive as-is;
  only the consuming front-end is new. Video output is repurposed as in-world surface
  textures. No backend edits before Phase D.

## D-007 · Establish the Project Brain as canonical source of truth — **Accepted** (2026-07-05)
- **Context:** Owner directive: multi-AI, long-horizon development was rediscovering
  information each session; feature work paused.
- **Decision:** This folder is the single source of truth; updating it is part of the
  definition of done for all significant work; development priority order fixed
  (Brain → Art Bible → AI Workflow → Standards → Core Systems → Features).
- **Consequences:** Slight overhead per change; large reduction in re-analysis and drift.

---

*Template for new entries:*

```
## D-NNN · Title — Status (date)
- Context:
- Decision:
- Consequences:
- Source/links:
```
