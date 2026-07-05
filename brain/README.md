# The Infinite Puzzle — Project Brain

**This folder is the canonical source of truth for the project.** If a claim here conflicts
with memory, old chat transcripts, or assumptions from a previous session, this folder wins.
If a claim here conflicts with the actual code in the repository, the code wins — and the
Brain must be corrected in the same piece of work.

Last full revision: 2026-07-05

---

## Reading order for a new session (AI or human)

1. **CURRENT_STATE.md** — what exists right now, what is verified, what is unknown. Start here.
2. **AI_RULES.md** — how to work on this project (conventions, guardrails, update protocol).
3. **VISION.md** — why the project exists and where it is going.
4. Then whatever your task needs:
   - Building or changing the 3D client → **ARCHITECTURE.md**, then `reference/`
   - Anything touching models, textures, HDRIs → **ASSETS.md**
   - Anything visual (lighting, palette, post, mood) → **ART_BIBLE.md**
   - Gameplay, puzzles, progression → **GAME.md**
   - Planning or prioritising work → **ROADMAP.md**
   - "Why is it done this way?" → **DECISIONS.md**

A new AI session should be able to work productively after reading (1)–(3) plus the one
task-relevant document. That is the design target for this folder: **fast onboarding
without re-analysing the repository.**

## Document map

| Document | Question it answers | Change frequency |
|---|---|---|
| CURRENT_STATE.md | What exists today? What is unknown? | Every working session |
| AI_RULES.md | How do I work here without breaking things? | Rare |
| VISION.md | Why does this exist? What is the quality bar? | Rare |
| GAME.md | What is the game? | Occasional |
| ARCHITECTURE.md | How is it built? | When architecture changes |
| ASSETS.md | Where do 3D assets come from and how are they prepared? | When pipeline changes |
| ART_BIBLE.md | What does it look and feel like? | Stage Two, then occasional |
| ROADMAP.md | What order do we build in? | Per phase |
| DECISIONS.md | Why did we choose X? (append-only log) | Per decision |
| reference/ | Proven working code + original handover (frozen) | Never (frozen) |

## Update protocol (what keeps this "living")

- Every piece of work that changes architecture, gameplay, assets, workflow, or
  infrastructure **includes the matching Brain edit in the same commit / same session**.
  A change is not "done" until the Brain reflects it.
- **CURRENT_STATE.md** is re-dated on every working session that changes anything.
- **DECISIONS.md** is append-only. Never rewrite an old decision; supersede it with a new entry.
- Anything not verified against code or a live system is marked
  **`Unknown – requires confirmation`**. Never silently guess.
- Keep documents concise. If a document stops fitting on a few screens, split it and
  update this map.

## What this folder is not

- Not a tutorial on Babylon.js — see `reference/` for working code instead.
- Not a task tracker — ROADMAP.md holds phases and acceptance criteria, not daily todos.
- Not marketing copy — factual, current, and honest about gaps.
