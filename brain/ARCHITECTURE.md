# ARCHITECTURE

How the system is built. Verified against: the two reference implementations in
`reference/` (read in full), the live Netlify deploys (probed 2026-07-05), and the
handover document. Items not verifiable are marked.

## System overview

```
┌────────────────────────────────────────────────────────────┐
│ 3D CLIENT (browser, Babylon.js)                            │
│  static site, GitHub → Netlify auto-deploy                 │
│  per-chamber: env GLB + IBL .env + corruption + post       │
└──────────────┬─────────────────────────────┬───────────────┘
               │ HTTPS                       │ HTTPS
┌──────────────▼──────────────┐ ┌────────────▼───────────────┐
│ generate-puzzle.js (Vercel) │ │ generate-video.js (Vercel) │
│ Anthropic API               │ │ flaq.ai Seedance           │
│ 3 chamber personas          │ │ video → surface textures   │
│ <<<PUZZLE_START/END>>>      │ │                            │
└─────────────────────────────┘ └────────────────────────────┘
   env: ANTHROPIC_API_KEY          env: FLAQ_API_KEY
```

## Front-end stack

- **Babylon.js** core + `loaders` (glTF/GLB incl. Draco), currently loaded as UMD globals
  from `cdn.babylonjs.com` (as in both reference files). npm/bundled build is an open
  option; no build step exists today. (DECISIONS.md D-005)
- Plain static site. No framework, no visual editor.
- Deploy: GitHub → Netlify auto-deploy. Branch deploy URLs (`main--…`) confirm git-linked
  sites. **Repository URL(s): `Unknown – requires confirmation.`**

## Live infrastructure (verified 2026-07-05 via Netlify API + HTTP probes)

| Netlify site | URL | What it is |
|---|---|---|
| infinite-puzzle-3d | infinite-puzzle-3d.netlify.app | **In-progress 3D build**: "Modern Apartment" chamber, WASD + mouse look, "Press E to enter the rift". Source unanalysed. |
| infinite-puzzle | infinite-puzzle.netlify.app | The **old 2D game** (scrapped era). Desktop-only landing, "0 CHAMBERS OPENED". Keep for reference; do not build on it. |
| peaceful-kashata-5c6d1b | peaceful-kashata-5c6d1b.netlify.app | Throwaway **test-scene site** — hosts the Babylon validation scenes (PIPELINE TEST confirmed live). |
| serene-fudge-f0f39a | serene-fudge-f0f39a.netlify.app | Another copy of the 2D-era landing page. Purpose vs `infinite-puzzle`: `Unknown – requires confirmation.` |

Backend endpoints (`generate-puzzle.js`, `generate-video.js`) are on **Vercel**; exact
URLs, request/response contracts, and the three persona definitions:
`Unknown – requires confirmation.` (Documented behaviours from handover: marker-based
puzzle extraction; Seedance video generation.)

## Per-chamber scene anatomy (the reusable template)

Proven shape, extracted from the working reference scenes:

1. `Scene` — dark `clearColor`, `FOGMODE_EXP2` (mood + draw-distance control), `collisionsEnabled`.
2. **IBL** — `CubeTexture.CreateFromPrefilteredData('<chamber>.env', scene)` →
   `scene.environmentTexture`. *The single biggest realism lever.* Per-chamber mood HDR.
3. **Environment model** — authored GLB or modular-kit assembly. **Never hand-built boxes
   in production** (D-003).
4. **Hero props / puzzle objects** — authored GLBs composited via `placeGLB` (below).
5. **Lighting** — key light (directional/spot) + `ShadowGenerator` (1024, PCF, medium
   quality); coloured corruption point lights (teal/red/amber) that breathe/flicker.
6. **Corruption layer** (reusable module) — fog, spore + code-mote particle systems,
   pulsing breach mesh (perturbed disc + point light + click burst), randomized tube
   vines, festoon string lights, optional swinging bare bulb with dynamic shadows.
7. **Post-processing** (reusable module) — `DefaultRenderingPipeline`: FXAA, bloom
   (threshold ~0.6, kernel 64), ACES tone mapping, exposure ~1.1, contrast ~1.3, vignette
   ~3.2, animated grain 7–8, chromatic aberration 9–13, `ColorCurves` grade (shadows hue
   210 teal / highlights hue 30 warm). Plus `SSAO2RenderingPipeline` (guard with
   `IsSupported` + try/catch), `GlowLayer` for emissives, optional volumetric light
   scattering (try/catch).
8. **Camera** — `UniversalCamera` first-person: speed 0.22–0.28, `angularSensibility`
   3600, `minZ` 0.05, fov ~1.0, collision ellipsoid, pointer-lock on click, eye height
   pinned each frame (1.7–1.8, no gravity). `ArcRotateCamera` for showcase moments.

## The load-and-composite pattern (`placeGLB`)

Canonical implementation: `reference/babylon-pipeline.html` lines ~184–206. Behaviour:

- `SceneLoader.ImportMesh` from any CORS URL (root/file split).
- Compute combined world bounds of all loaded meshes → normalise to `targetSize`,
  centre X/Z, sit base on floor, parent under a positioned/rotated `TransformNode`.
- Register every real mesh as shadow caster + receiver.
- **On error: place a fallback box so a slot is never empty.**
- Track pending/settled counts → drive the loading bar → reveal when all settle.

## Robustness rules (non-negotiable, all proven in reference code)

- Every external load has an **error fallback**.
- A **global safety timeout** (30–45 s) reveals the scene even if an asset stalls.
- All GPU-variable post effects (SSAO, mirrors, god rays) wrapped in **try/catch**, SSAO
  additionally gated on `IsSupported`.
- Large environments: per-mesh `checkCollisions` + `createOrUpdateSelectionOctree()`.

## Asset delivery

Optimised GLBs + `.env` files hosted on CDN or in the repo; **lazy-loaded per chamber**
(never all chambers up front) with a loading state per transition. Details: ASSETS.md.

## Environment variables

`ANTHROPIC_API_KEY`, `FLAQ_API_KEY` (both backend-side, carried over from the 2D era).
Where they are set (Vercel project settings assumed): `Unknown – requires confirmation.`

## Proposed repository layout (not yet ratified — see CURRENT_STATE.md)

```
/
├─ index.html            # entry, loading UI, CDN scripts
├─ js/
│  ├─ main.js            # bootstrap + render loop
│  ├─ config.js          # palette, quality flags
│  ├─ modules/           # engine, camera, loader, corruption, post, chamberLoader
│  └─ chambers/          # one config file per chamber
├─ assets/               # optimised .glb / .env (or CDN-hosted instead)
├─ brain/                # ← this folder
├─ CREDITS.md            # per-asset licence log
└─ netlify.toml
```
