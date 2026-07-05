# ART BIBLE — seed draft

> **Status: DRAFT.** The full World Art Bible is priority 2 in the development philosophy
> and is a Stage Two deliverable. This seed captures every visual fact already proven in
> working code (`reference/`), so nothing is lost and no future session reinvents values.

## Mood

**Stranger Things × The Matrix.** A real place, gone wrong. Cold decayed "Upside Down"
corruption over ordinary spaces; practical lights that flicker; something organic growing
where it shouldn't; one glowing wound in the wall. 80s-horror film grade: grain, vignette,
slight lens fringing. Dread through atmosphere, not gore.

## Palette (values verified from reference code)

| Role | Linear RGB (Babylon Color3) | Approx hex | Used for |
|---|---|---|---|
| TEAL (corruption) | 0.16, 0.92, 0.85 | #29ebd9 | Corruption glow, monolith, motes |
| RED (corruption) | 0.90, 0.12, 0.14 | #e61f24 | Hostile corruption lights |
| GATE / breach orange | 1.00, 0.35, 0.15 | #ff5926 | Breach emissive + breach light |
| COLD moonlight | 0.55, 0.62–0.68, 0.85–0.95 | #8ca9d9-ish | Windows, ambient, moon |
| Warm bulb | 1.00, 0.85–0.88, 0.5–0.6 | #ffd98c-ish | Practical bulbs, swinging lamp |
| Grade | shadows hue 210 (teal), highlights hue 30 (warm amber) | — | ColorCurves |

String-light bulb set: red (1,0.2,0.15) · green (0.2,0.9,0.3) · amber (1,0.8,0.2) ·
blue (0.25,0.5,1) · pink (1,0.4,0.7) — ~35% of bulbs flicker.

## Light recipe (per chamber)

- Hemispheric ambient, very low (0.12–0.18), cold diffuse, warm-dark ground colour.
- One key light with PCF shadows (moon/directional outdoors, swinging spot indoors).
- 2–3 coloured corruption point lights (teal + reds) that breathe on sine curves and
  randomly spike/flicker.
- Fog: EXP2, density 0.032–0.045, near-black blue-green (≈ 0.03–0.04, 0.06–0.07, 0.08–0.09).
- IBL: dim nocturnal `.env`, intensity 0.5–0.65.

## Post grade (the "film stock" — keep consistent across chambers)

ACES tone mapping · exposure 1.1–1.15 · contrast 1.3 · bloom threshold 0.6–0.65,
weight 0.5–0.7, kernel 64 · vignette 3.2 · animated grain 7–8 · chromatic aberration
9–13, radial 0.7–0.8 · ColorCurves teal-shadows/warm-highlights · SSAO2 where supported ·
GlowLayer for emissives · optional god rays (exposure ~0.16–0.18).

## Corruption motifs (the signature set)

Drifting spores (slow, falling, additive) · rising code-motes (teal-green, Matrix nod) ·
breach: jagged-edged glowing disc, pulsing scale + emissive, vines radiating from it ·
vines: dark randomized tubes crawling walls/floor · festoon string lights (Stranger
Things nod) · a swinging bare bulb with real moving shadows.

## Open items for the full Art Bible (Stage Two)

- Canonical concept-art set per chamber mood (also feeds image-to-3D generation).
- Material language: decay levels, wetness, dust rules.
- Chamber-to-chamber palette variation rules (what may change vs the fixed grade).
- Typography/UI in-world vs overlay. Current UI font: ui-monospace stack, letterspaced
  uppercase, teal-tinted.
- Style-consistency strategy for mixed-source assets (Rodin fine-tune vs one kit family)
  — decision pending, see DECISIONS.md.
