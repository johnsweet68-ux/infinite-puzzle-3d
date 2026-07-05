# The Infinite Puzzle — Phase 3 Handover
## Pivot: 2D canvas → high-definition 3D walkthrough (Babylon.js)

---

## ⚠️ READ THIS FIRST — the project direction has changed

CC, this is not a continuation of the previous build. **The 2D canvas version of the game is being scrapped.** We are starting the client fresh as a **first-person, high-definition 3D walkthrough** built on **Babylon.js**.

Do not pattern-match to the old front-end. Assume the old world engine, the layered 2D canvas renderer, the mouse-proximity-to-canvas system, and the sealed-scar rendering **no longer exist**. Treat the front-end as a greenfield project.

**What is KEPT (the DNA of the game):**
- The concept: an atmospheric puzzle game where the player crosses between realities through *tears / breaches* into a sequence of *chambers*, solving a puzzle in each.
- The aesthetic: **Stranger Things × The Matrix** — cold decayed "Upside Down" corruption, drifting spores, organic vines, flickering practical lights, a breach in the wall, teal/red/amber palette, film-grain 80s-horror grade.
- The chamber progression / unlock logic (conceptually).
- The **backend logic** may survive largely intact (see §7): AI puzzle generation and the flaq.ai video generation are server-side and reusable.

**What is SCRAPPED / rebuilt from zero:**
- The entire 2D canvas front-end and its rendering.
- Any 2D-specific audio-proximity coupling (audio will be re-approached in 3D space).
- Hand-built "box" geometry as a final look (used only as throwaway test scaffolding — see §4/§9).

---

## 1. What the game is now

A browser-based, first-person 3D game. The player **walks through** real 3D chambers — actual authored environments, not flat backdrops — lit with real HDR image-based lighting and cinematic post-processing, drowned in the game's signature corrupted-reality atmosphere. Each chamber contains a puzzle (some AI-generated, as before). Tears/breaches are 3D geometry the player approaches. The target quality bar is "a real place you're standing inside," not "a nice-looking 2D scene."

Runs in-browser. Must perform on mid-range hardware including mobile.

---

## 2. Why we pivoted (context, brief)

The 2D canvas approach hit its ceiling for the immersion we want. We validated Babylon.js extensively (see §3). The core finding: **Babylon can absolutely deliver the target look — the quality gap is authored ART ASSETS, not the engine or the code.** Loading real authored models + real HDR lighting produced convincing spaces immediately; hand-built primitive geometry did not, no matter how it was lit. So the whole strategy now centres on sourcing/optimising assets and staging them, rather than drawing everything by hand.

---

## 3. What was already proven (reference implementations)

A series of Babylon test scenes were built and confirmed working live (deployed on a throwaway Netlify test site). **The user will hand you the HTML files** — treat them as working reference code, not production code. The most important two:

- **`babylon-pipeline.html`** — the key one. A hand-built room shell with **real authored furniture loaded at runtime from a URL** (Khronos `GlamVelvetSofa`, CC0 `SheenChair`) plus a composited artifact (`DamagedHelmet`), IBL, SSAO, first-person walk + collisions, and the full corruption layer (fog, spores, breach, vines, string lights, swinging bulb with dynamic shadows, ACES + grain + vignette + chromatic aberration + teal/orange colour grade). This demonstrates the **procedural-shell + authored-hero-props hybrid** and the **load-and-composite pattern**.
- **`babylon-chamber.html`** — loads a **full authored environment** (Khronos Sponza) as a walkable space and drapes the corruption mood over it. Demonstrates loading a whole environment model, not just props.

Others available if useful: `babylon-fragment.html` (Draco-compressed + animated glTF via `LittlestTokyo`, IBL, mirror floor), `babylon-artifact.html` (single authored object showcase with IBL + SSAO + mirror).

**Proven capabilities to carry forward:** runtime glTF/GLB loading from plain CORS URLs (incl. Draco); compositing multiple assets from different sources into one scene with auto-fit/auto-place; `.env` HDR image-based lighting; PBR materials; shadow maps; SSAO2; `DefaultRenderingPipeline` post stack; `GlowLayer`; first-person `UniversalCamera` + collisions; particle systems; robust load-with-fallback.

---

## 4. Target technical architecture

**Stack:** Babylon.js (core + `loaders` for glTF/Draco) via CDN or npm. No visual editor. Deployed via the existing GitHub → Netlify auto-deploy flow.

**Per-chamber scene anatomy (the reusable template):**
1. `Scene` with dark `clearColor` + exponential fog (mood + draw-distance).
2. **IBL:** `CubeTexture.CreateFromPrefilteredData(<chamber>.env, scene)` as `scene.environmentTexture`. This is the single biggest realism lever — every chamber gets a mood-appropriate HDR.
3. **Environment model:** an authored 3D space loaded as GLB (see §5/§6), OR a modular kit assembled from authored pieces. **Not** hand-built boxes for production.
4. **Hero props / puzzle objects:** authored GLBs composited in via the load-and-place helper.
5. **Lighting:** a key light (directional/spot) with a `ShadowGenerator`; coloured "corruption" point lights (teal/red/amber), flickering.
6. **Corruption layer (reusable module):** fog, drifting spore + code-mote particle systems, a pulsing breach mesh + vines, optional swinging bare bulb with moving shadows.
7. **Post-processing (reusable module):** `DefaultRenderingPipeline` with ACES tone mapping, moderate bloom, vignette, animated grain, subtle chromatic aberration, and a `ColorCurves` grade (teal shadows / warm highlights). Add `SSAO2RenderingPipeline` (guarded by `IsSupported`) for contact shadows. `GlowLayer` for emissive corruption.
8. **Camera:** `UniversalCamera` (first-person, WASD + pointer-lock look, collisions) for walkable chambers; `ArcRotateCamera` for object-showcase moments.

**Load-and-composite pattern (proven — reuse this shape):**
```js
// Loads any GLB from a URL, auto-scales to targetSize, drops it on the floor at pos.
function placeGLB(url, targetSize, pos, rotY, onDone) {
  const i = url.lastIndexOf('/') + 1, root = url.slice(0, i), file = url.slice(i);
  BABYLON.SceneLoader.ImportMesh(null, root, file, scene, meshes => {
    // compute combined world bounds, normalise scale, centre X/Z, sit base at floor,
    // parent under a positioned/rotated TransformNode, register shadow casters. 
    // (see babylon-pipeline.html for the exact implementation)
    onDone && onDone();
  }, null, (s, msg) => { /* fallback placeholder so a slot is never empty */ });
}
```
**Robustness:** every external load wrapped with an error fallback + a global safety timeout that reveals the scene even if an asset stalls. All post-processing that can vary by GPU (mirror, SSAO, god rays) wrapped in `try/catch`.

---

## 5. Asset sourcing strategy

Prefer **CC0** (public domain, no attribution, commercial-safe). Keep a per-asset licence log from day one (`CREDITS.md`: asset, source, author, licence, changes made).

**Free / CC0 (foundation):**
- **Poly Haven** — CC0 realistic models, textures, and HDRIs. Best all-rounder + our HDRI source.
- **ambientCG** — CC0 PBR surface materials + HDRIs. For walls/floors/decay.
- **Kenney / Quaternius / KayKit** — CC0 stylised + modular kits (incl. dungeon/interior kits) — candidates for modular chamber shells.

**Photoreal:** **Fab (Epic)** — mixed free/paid, filter by CC/free licence; some free Megascans (most Megascans are paid since 2025). Photoreal scans are heavy → must be optimised for web (§6).

**AI generation (bespoke, on-brand, fits the automation vision):** **Meshy** (best all-round, GLB, API, ~$20/mo), **Tripo** (fastest, cheapest, clean game topology, API), **Rodin** (highest quality + *style fine-tuning* to keep one consistent look across all chambers). Image-to-3D from concept art in our palette gives the most on-brand, consistent results. These have APIs and slot naturally into the existing "generate everything via API" ethos.

**HDRIs:** grab `.hdr` from Poly Haven → convert to Babylon `.env` (Babylon Sandbox / IBL tool) → host once, reuse per chamber mood.

---

## 6. The asset optimisation pipeline — **CC to build this** (key deliverable)

Raw library/AI assets are too heavy for the web as-is. This is the piece that couldn't be built in the planning chat (no local network there) and is the core of your job. Build it as a repeatable step.

**Per-asset flow:** download raw asset → optimise → host optimised `.glb` → lazy-load per chamber.

**Optimise with `gltf-transform` (CLI):** dedup, prune unused, resize textures to 1–2K, convert textures to WebP/KTX2, weld, and compress geometry with **Meshopt or Draco**. Example:
```bash
npm i -g @gltf-transform/cli
gltf-transform optimize input.glb output.glb \
  --texture-size 2048 --texture-compress webp --compress meshopt
# or: --compress draco   (Babylon supports both; Draco needs the decoder, already wired in tests)
```
Consider generating LODs for large environments and instancing repeated meshes.

**Web budgets (targets, tune per chamber):** aim for a chamber GLB in the low single-digit MB after compression; textures 1–2K (not 4–8K); prefer Meshopt/Draco geometry + WebP/KTX2 textures. Test the round-trip (load the optimised GLB in Babylon) before committing.

**Delivery:** host optimised GLBs + `.env` files on a CDN or the repo; **lazy-load per chamber** (don't load all chambers up front); show a loading state per chamber transition.

---

## 7. What survives from the old project (don't rebuild these blindly)

- **AI puzzle generation backend** (`generate-puzzle.js` on Vercel, three chamber personas, `<<<PUZZLE_START>>>`/`<<<PUZZLE_END>>>` marker extraction): the *logic and endpoints* are reusable. Only the front-end that consumes them is new.
- **Video generation backend** (`generate-video.js`, flaq.ai Seedance): reusable — and arguably *more* useful now, since generated video can play as a **texture on surfaces inside a 3D chamber** rather than as a flat backdrop.
- **Chamber unlock/progression logic:** the design survives; the implementation moves into the 3D client.
- **Env vars / API keys** (`ANTHROPIC_API_KEY`, `FLAQ_API_KEY`) carry over.

Everything front-end / rendering / audio-coupling is new.

---

## 8. Suggested build plan (phased)

- **Phase A — Scaffold:** stand up the Babylon project + repo structure + Netlify deploy. Get **one walkable chamber shell** working: IBL (`.env`) + PBR + first-person camera + collisions + the post-processing module. (Shell can be a placeholder authored environment or a modular kit — not boxes.)
- **Phase B — Asset pipeline:** build the `gltf-transform` optimise step. Prove it: take one raw authored asset → optimise → load the optimised GLB in the chamber. Establish the CDN/hosting + lazy-load approach and the `CREDITS.md` discipline.
- **Phase C — Chamber system:** generalise into a reusable chamber loader (environment + composited hero props + corruption module + post module), driven by per-chamber config (which env model, which `.env`, palette, puzzle id).
- **Phase D — Reconnect backends:** wire the surviving puzzle/video endpoints into 3D chambers (video → surface textures; puzzle → in-world UI/interaction).
- **Phase E — Content + polish:** build out chambers from sourced/generated assets; audio in 3D space; transitions; performance passes to hit web budgets.

---

## 9. Open decisions & flags

- **The shell must be authored too.** In the test scenes the room *shell* was hand-built boxes and reads as flat/"2D" — that was scaffolding only. Production chamber shells need authored environment models or high-quality modular kits, same as the props.
- **Performance is a first-class constraint** (browser + mobile). Budget assets aggressively; the optimisation pipeline (§6) is not optional.
- **Licence hygiene** from the first asset (`CREDITS.md`, prefer CC0).
- **Consistent art style** across chambers is a real risk with mixed-source assets — the strongest mitigation is AI generation with style fine-tuning (Rodin) or committing to one CC0 kit family.
- **Game name is still unresolved** (unrelated to this pivot, but still a blocker for the social/marketing layer).

---

## 10. How to brief CC (for the user)

Start a **fresh CC session**. Reason: CC's current context is anchored to the scrapped 2D project and will actively mislead it toward the old approach. A clean slate is safer than fighting stale assumptions.

When you open the new session, hand CC:
1. **This document.**
2. The reference test files — at minimum **`babylon-pipeline.html`** and **`babylon-chamber.html`** (working patterns to learn from, not to ship).
3. A one-line framing so it doesn't reach for old code: *"New direction — we're rebuilding The Infinite Puzzle as a first-person 3D Babylon.js walkthrough. Ignore the old 2D canvas build. Read the handover doc and the reference files, then start with Phase A."*

Keep the surviving backend repo (puzzle/video endpoints) available for Phase D, but don't let CC touch it until then.
