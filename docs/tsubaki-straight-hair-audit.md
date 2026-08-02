# Kiryu Tsubaki straight-hair visual audit

This is the completion ledger for the straight-hair continuity correction. The
canonical rule is in `docs/game-visual-direction.md` and the machine-readable
profile is on Tsubaki's `BATTLE_STUDENTS` entry.

## Full target

The explicit Tsubaki asset universe contains 44 app-displayed assets:

| Group | Count | Paths |
| --- | ---: | --- |
| battle emotion portraits | 24 | `public/assets/battle/cast/students/tsubaki/*.webp` |
| lifestyle portraits | 3 | `public/assets/battle/cast/lifestyle/tsubaki/*.webp` |
| character daily visuals | 10 | `public/assets/battle/daily/tsubaki/*.webp` |
| character reveal | 1 | `public/assets/battle/reveals/tsubaki.webp` |
| shared daily scenes | 1 | `public/assets/battle/scenes/everyday.webp` |
| derived battle motions | 5 | `public/assets/battle/motion/students/tsubaki/*.webm` |
| **Total** | **44** | |

The shared scene is selected from `BATTLE_DAILY_SCENES` by the explicit `cast`
entry for Tsubaki. Generic background students and unidentified people are not
silently treated as Tsubaki.

## Acceptance result

- All 39 raster sources use dark purple-black straight hair.
- A high straight ponytail is the default. The lunch scene may use straight high
  twin ponytails, as allowed by the character profile.
- All 24 emotions remain distinct; the straight-hair edit does not flatten the
  expression or action state.
- The reveal keeps the French dolls' intentionally curled wigs unchanged; only
  Tsubaki's own hair follows her continuity rule.
- The five WebM clips are regenerated from the corrected portrait frames.
- The removed park scene is no longer selected by `BATTLE_DAILY_SCENES`.
  Remaining character asset URLs and persistence contracts stay unchanged.

`tests/character-visual-continuity.test.mjs` checks the exact target count,
dimensions, shared-scene selection, profile rule, and derived video presence.
