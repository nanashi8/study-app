# School-life uniform audit

This audit is the acceptance record for the 24-image school-life album. It must
be checked together with `docs/game-visual-direction.md` before any image is
replaced or extended.

## Uniform acceptance rule

- Every female student in an ordinary school-uniform scene, including small
  background figures, wears the canonical white sailor blouse, navy sailor
  collar with two white stripes, navy striped cuffs, violet ribbon, and navy
  pleated skirt.
- Every male student keeps the dark navy stand-collar gakuran. A uniform edit
  that gives a boy white sailor sleeves or a sailor collar is rejected.
- Situation-specific clothing is allowed only when the activity requires it:
  coordinated sportswear for athletics, lab coats and eye protection for the
  science experiment, and service aprons over the canonical uniform at the
  culture-festival cafe.
- Adult teachers, parents, visitors, coaches, and school-store staff are not
  students and keep role-appropriate clothing.
- Passing the clothing check never overrides the scene-logic, safety,
  non-duplication, desk/board geometry, or relationship-neutral gates.

## Accepted asset inventory

| Scene id | Accepted asset | Uniform context |
| --- | --- | --- |
| `school-gate-arrival` | `school-gate-arrival-v2.webp` | Canonical sailor uniform |
| `bicycle-commute` | `bicycle-commute-v2.webp` | Canonical sailor uniform; boys retain gakuran |
| `train-commute` | `train-commute-v2.webp` | Canonical sailor uniform; platform safety retained |
| `shoe-lockers` | `shoe-lockers-v2.webp` | Canonical sailor uniform, including background girls |
| `morning-assembly` | `morning-assembly-v2.webp` | Canonical sailor uniform; rows remain aligned |
| `morning-homeroom` | `morning-homeroom-v2.webp` | Canonical sailor uniform; desks face the front board |
| `pop-quiz` | `pop-quiz-v2.webp` | Canonical sailor uniform; individual desk rows retained |
| `test-prep` | `test-prep-v2.webp` | Canonical sailor uniform; one inclusive four-person group |
| `midterm-exam` | `midterm-exam-v2.webp` | Canonical sailor uniform, including rear rows |
| `test-return` | `test-return-v2.webp` | Canonical sailor uniform, including background girls |
| `lunch-classroom` | `lunch-classroom.webp` | Already compliant canonical sailor uniform |
| `school-store` | `school-store.webp` | Student girls compliant; counter clerk is staff |
| `cafeteria` | `cafeteria-v2.webp` | Canonical sailor uniform; one inclusive friend group |
| `cleaning-time` | `cleaning-time-v2.webp` | Canonical sailor uniform; cleaning-tool logic retained |
| `committee-meeting` | `committee-meeting-v2.webp` | Canonical sailor uniform; one six-person work group |
| `track-club` | `track-club.webp` | Activity-required coordinated sportswear |
| `basketball-club` | `basketball-club.webp` | Activity-required coordinated sportswear |
| `art-club` | `art-club-v2.webp` | Canonical sailor uniform; canvas perspective retained |
| `science-club` | `science-club.webp` | Canonical uniform under required lab coats and goggles |
| `sports-festival` | `sports-festival.webp` | Activity-required coordinated sportswear |
| `culture-festival` | `culture-festival-v2.webp` | Service aprons over canonical uniform |
| `school-trip` | `school-trip-v2.webp` | Canonical sailor uniform; boys retain gakuran |
| `entrance-ceremony` | `entrance-ceremony-v2.webp` | Canonical sailor uniform; adults remain in formal wear |
| `school-gate-dismissal` | `school-gate-dismissal-v2.webp` | Canonical sailor uniform, including both main girls |

Any future replacement must update this table and pass the automated asset
existence, dimensions, and version-reference tests.
