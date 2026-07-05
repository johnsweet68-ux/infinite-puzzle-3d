# CURRENT STATE

**Snapshot date: 2026-07-05.** Re-date and update this file in every session that
changes anything material.

## Where the project stands, in three sentences

The 2D→3D pivot is decided and validated; the project is pre-Phase-A on the greenfield
3D client, with a paused scaffold and a live deployed 3D prototype whose source has not
yet been reconciled with the plan. Feature development is paused by owner directive
until this Project Brain (Stage One) is approved. The asset optimisation pipeline —
the project's critical path — does not exist yet.

## What verifiably exists (as of the snapshot date)

| Artefact | Where | Verified how |
|---|---|---|
| Strategic handover doc (the vision) | `brain/reference/PHASE3-HANDOVER-3D-PIVOT.md` | Read in full |
| Reference scene: hybrid shell + authored props + full mood stack | `brain/reference/babylon-pipeline.html` | Read in full; live copy confirmed on peaceful-kashata site |
| Reference scene: full authored environment (Sponza) walkable | `brain/reference/babylon-chamber.html` | Read in full |
| Live 3D prototype: "Modern Apartment", WASD, "Press E to enter the rift" | infinite-puzzle-3d.netlify.app | HTTP probe 2026-07-05 |
| Old 2D game (scrapped era) | infinite-puzzle.netlify.app (+ serene-fudge-f0f39a) | HTTP probe 2026-07-05 |
| Test-scene host site | peaceful-kashata-5c6d1b.netlify.app | HTTP probe 2026-07-05 |
| Netlify account: 4 sites, all deploys `ready`, git-linked branch URLs | Netlify (John Sweet / johnsweet68@gmail.com, team-dev plan) | Netlify API 2026-07-05 |
| Paused Phase A scaffold (index.html + empty module dirs only) | Cloud session workspace (`infinite-puzzle-3d/`) | Created this session, then paused by directive |
| AI puzzle backend: `generate-puzzle.js`, 3 personas, marker extraction | Vercel | **Handover only — not independently verified** |
| Video backend: `generate-video.js`, flaq.ai Seedance | Vercel | **Handover only — not independently verified** |

## What does NOT exist yet

- Asset optimisation pipeline (gltf-transform flow) — Phase B, critical path.
- Reusable chamber-loader/config system — Phase C.
- 3D puzzle interaction & backend wiring — Phase D.
- Spatial audio, chamber transitions, content set — Phase E.
- `CREDITS.md` licence log (template exists in this delivery; not yet populated in a repo).
- Full World Art Bible (seed draft only: ART_BIBLE.md).

## Unknowns — require confirmation (consolidated)

| # | Unknown | Why it matters | How to resolve |
|---|---|---|---|
| U-1 | GitHub repo URL(s) for the 3D client (and 2D-era repo) | Can't reconcile deployed prototype vs plan; can't set up Brain-in-repo | Owner: connect the repo folder or share the URL |
| U-2 | Source + provenance of the live "Modern Apartment" build (who/when/what state; does it satisfy Phase A?) | Determines whether Phase A resumes or is already done | Read that repo (needs U-1) |
| U-3 | Vercel backend URLs + exact API contracts + persona definitions | Needed for Phase D; claims currently rest on the handover alone | Owner: share Vercel project or endpoint URLs |
| U-4 | Where env vars (`ANTHROPIC_API_KEY`, `FLAQ_API_KEY`) are configured | Phase D wiring + security review | Vercel dashboard check |
| U-5 | Chamber list, puzzle designs, progression rules | Game content scope | Owner decision / design session |
| U-6 | Final game name | Blocks social/marketing layer | Owner decision |
| U-7 | Meshy / Tripo / Rodin accounts & API keys | Tier-3 asset generation | Owner confirmation |
| U-8 | Asset hosting choice (repo vs CDN vs bucket) | Phase B design | Decide at Phase B start |
| U-9 | Canonical term: tear vs breach vs rift | Consistency in code, UI, and docs | Owner decision (one line) |
| U-10 | Purpose of serene-fudge-f0f39a vs infinite-puzzle site | Housekeeping; possible deletion | Owner confirmation |

## Environment note for AI sessions (verified this session)

The cloud workspace used for engineering has **no outbound network access to CDNs or
npm** (403/blocked). Consequences: Babylon cannot be vendored or executed headlessly
there; local WebGL testing is impossible. Working verification path: edit → deploy
(Netlify) → test in a real browser (owner's Chrome via browser tools, or manually).
Plan builds around this until the network policy changes.
