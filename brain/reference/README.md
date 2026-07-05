# reference/ — frozen evidence

Working code and the original strategy document. **Frozen: do not edit these files.**
They are patterns to learn from, not production code to ship.

| File | What it proves |
|---|---|
| `PHASE3-HANDOVER-3D-PIVOT.md` | The original pivot handover — the project's strategic vision, verbatim. |
| `babylon-pipeline.html` | The hybrid pattern: procedural shell + **authored hero props loaded at runtime from URLs** (Khronos GlamVelvetSofa, SheenChair, DamagedHelmet), IBL, SSAO2, first-person collisions, full corruption layer (fog/spores/breach/vines/string lights/swinging bulb with dynamic shadows), full post stack, `placeGLB` auto-fit/auto-place with fallbacks, progress + safety-timeout reveal. |
| `babylon-chamber.html` | Loading a **full authored environment** (Khronos Sponza) as a walkable space: per-mesh collisions, selection octree, download progress bar, environment-scale mood (moon key light + god rays + corruption lights + monolith focal object). |

Two further test scenes existed (`babylon-fragment.html` — Draco + animated glTF;
`babylon-artifact.html` — single-object showcase). Not preserved here.
`Unknown – requires confirmation` whether copies still exist on the test site
(peaceful-kashata-5c6d1b.netlify.app hosts at least the pipeline test).

Licence note: the Khronos sample assets and `night.env` used in these scenes are for
testing; log them in `CREDITS.md` if they appear in any shipped build.
