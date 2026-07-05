# ASSETS

Where 3D content comes from and how it is prepared for the web. This pipeline is the
core of the project strategy (see VISION.md): the engine is proven; assets are the gap.

## Sourcing tiers

**Tier 1 — CC0 libraries (foundation; no attribution required, commercial-safe):**

| Source | Use for |
|---|---|
| Poly Haven | Realistic models, PBR textures, **HDRIs** (our HDRI source) |
| ambientCG | PBR surface materials + HDRIs — walls/floors/decay |
| Kenney / Quaternius / KayKit | Stylised + modular kits (incl. dungeon/interior) — candidates for modular chamber shells |

**Tier 2 — Photoreal:** Fab (Epic) — filter by CC/free licence; some free Megascans
(most Megascans are paid since 2025). Heavy scans → must pass the optimisation pipeline.

**Tier 3 — AI generation (bespoke, on-brand, API-driven):**

| Service | Strength |
|---|---|
| Meshy (~$20/mo) | Best all-round, GLB out, API |
| Tripo | Fastest, cheapest, clean game topology, API |
| Rodin | Highest quality + **style fine-tuning** for cross-chamber consistency |

Image-to-3D from concept art in the project palette gives the most consistent results.
Active accounts/keys for any of these: `Unknown – requires confirmation.`

**HDRIs → IBL:** download `.hdr` from Poly Haven → convert to Babylon `.env`
(Babylon Sandbox / IBL tool) → host once → reuse per chamber mood.

## Licence hygiene (from asset #1)

Every asset gets a row in `CREDITS.md` at repo root **when it is added**:
`asset | source | author | licence | changes made`. Prefer CC0. No asset ships without
a row. Test-era assets that must be logged if they remain in any build:
Khronos glTF sample assets (GlamVelvetSofa, SheenChair, DamagedHelmet, Sponza) and
`assets.babylonjs.com/environments/night.env`.

## Optimisation pipeline (raw → web-ready) — Phase B deliverable

Raw library/AI assets are too heavy for the web. Repeatable per-asset flow:

```
download raw → optimise → host optimised .glb → lazy-load per chamber
```

**Tool: `gltf-transform` (CLI):**

```bash
npm i -g @gltf-transform/cli
gltf-transform optimize input.glb output.glb \
  --texture-size 2048 --texture-compress webp --compress meshopt
# or: --compress draco   (Babylon supports both; Draco decoder already wired in reference code)
```

Covers: dedup, prune unused, resize textures 1–2K, WebP/KTX2 texture compression, weld,
Meshopt/Draco geometry compression. Also consider LODs for large environments and
instancing for repeated meshes.

**Status: NOT YET BUILT.** This could not be built in the planning environment and is the
first engineering deliverable after Stage One approval (see ROADMAP.md Phase B).

## Web budgets (targets — tune per chamber)

- Chamber environment GLB: **low single-digit MB** after compression.
- Textures: **1–2K**, never 4–8K.
- Geometry: Meshopt or Draco compressed; textures WebP/KTX2.
- **Round-trip test is mandatory**: load every optimised GLB in Babylon before committing.

## Delivery

- Host optimised GLBs + `.env` files on a CDN or in the repo
  (choice unratified: `Unknown – requires confirmation`).
- **Lazy-load per chamber**; loading state on every chamber transition.
