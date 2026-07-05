# ROADMAP

## Now: Stage One — Project Brain (2026-07-05)

Feature development is **paused by directive** until Stage One is complete and approved.
Stage One = this folder, delivered with a completion report. Everything below resumes
only after approval.

## Development philosophy (priority order)

1. Project Brain → 2. World Art Bible → 3. AI Workflow → 4. Development Standards →
5. Core Systems → 6. Game Features

## Engineering phases (from the ratified handover plan)

### Phase A — Scaffold
Stand up the Babylon project + repo structure + Netlify deploy. **One walkable chamber
shell**: IBL (`.env`) + PBR + first-person camera + collisions + post module.
Shell = placeholder authored environment or modular kit — **not boxes**.
- Status: *started then paused* (scaffold begun in a cloud workspace 2026-07-05; only
  `index.html` written). Note: the live `infinite-puzzle-3d.netlify.app` build may
  already satisfy some or all of Phase A — **reconcile before resuming**
  (`Unknown – requires confirmation`).
- Acceptance: walk around an authored space in-browser with the full mood stack, deployed.

### Phase B — Asset pipeline
Build the `gltf-transform` optimise step; prove one raw asset → optimised → loads in a
chamber. Establish hosting/CDN + lazy-load + `CREDITS.md` discipline.
- Acceptance: documented, repeatable per-asset flow; one real round-trip; budgets met.

### Phase C — Chamber system
Generalise into a reusable chamber loader (environment + hero props + corruption module +
post module) driven by per-chamber config (env model, `.env`, palette, puzzle id).
- Acceptance: two+ different chambers from config alone, no code fork.

### Phase D — Reconnect backends
Wire surviving puzzle/video endpoints into 3D chambers (video → surface textures;
puzzle → in-world UI/interaction). Backend repo untouched until this phase.
- Acceptance: a chamber presents an AI-generated puzzle end-to-end in 3D.

### Phase E — Content + polish
Build out chambers from sourced/generated assets; spatial audio; transitions;
performance passes to hit web budgets (including mobile).

## Cross-cutting must-dos

- Licence log from asset #1 (ASSETS.md).
- Performance budgets enforced every phase, not retrofitted.
- Brain updated as part of every phase's definition of done.

## Unscheduled / blocked

- Game name decision (blocks social/marketing layer).
- Style-consistency decision (Rodin fine-tune vs single kit family) — needed by Phase E
  at the latest, ideally before mass asset production.
