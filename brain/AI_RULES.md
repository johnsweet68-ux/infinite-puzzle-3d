# AI RULES

Operating rules for any AI system (and a good checklist for humans) working on
The Infinite Puzzle. These exist so multiple AI sessions produce one coherent project.

## 1. Orientation

- Read CURRENT_STATE.md first, then this file, then VISION.md. Do not start work from
  memory of a previous conversation.
- **The 2D canvas build is dead.** Do not pattern-match to layered-canvas rendering,
  mouse-proximity audio, or 2D-era code, even if you find it in old deploys or chats.
- The Brain outranks recollection; the repository code outranks the Brain — and when it
  does, fix the Brain in the same piece of work.

## 2. Source-of-truth discipline

- Never present an assumption as fact. Anything unverified is written as
  `Unknown – requires confirmation.` and added to CURRENT_STATE.md's unknowns table.
- DECISIONS.md is append-only. To reverse a decision, add a superseding entry.
- When you make a significant choice, log it in DECISIONS.md **in the same session**.

## 3. Definition of done (every task)

1. The change works (see §6 Verification).
2. The relevant Brain documents are updated (at minimum CURRENT_STATE.md's date + deltas).
3. Any new asset has a `CREDITS.md` row (asset, source, author, licence, changes).
4. Performance budgets respected (ASSETS.md); nothing 4K-textured "temporarily".

## 4. Engineering conventions (proven in `reference/`; follow unless superseded)

- Babylon.js idioms; per-chamber scene anatomy as specified in ARCHITECTURE.md.
- **Every external asset load has an error fallback**; a slot is never left empty.
- **Global safety timeout** (30–45 s) so the scene always reveals.
- GPU-variable features (SSAO2, god rays, mirrors) gated by capability checks and
  try/catch — the game must degrade, never break.
- First-person camera settings: see ARCHITECTURE.md §anatomy item 8; keep values
  consistent across chambers unless a chamber config overrides them deliberately.
- Production geometry is authored (GLB/kits). Primitive boxes are throwaway scaffolding
  only and must not ship.
- No new frameworks, bundlers, or editors without a DECISIONS.md entry.

## 5. Boundaries

- **Do not modify the backend** (`generate-puzzle.js`, `generate-video.js`) before
  Phase D, and then only additively unless the owner approves changes.
- Do not touch the old 2D deploys/repos except to read.
- Do not commit secrets; API keys live in platform env settings only.
- Do not mass-produce assets before the style-consistency decision (ROADMAP.md).

## 6. Verification reality check

The engineering cloud workspace has no CDN/npm network access (CURRENT_STATE.md).
Therefore: treat "it should work" as unverified until it has rendered in a real browser.
The working loop is edit → deploy (Netlify draft or site) → load in a real browser →
check console + walk the scene. Budget for this loop; do not skip it.

## 7. Communication back to the owner

- Lead with what changed and what is now true; keep chamber-by-chamber detail in the Brain.
- Surface new unknowns and decisions explicitly, referencing U-numbers / D-numbers.
- If a directive conflicts with the Brain, flag the conflict rather than silently obeying
  either.
