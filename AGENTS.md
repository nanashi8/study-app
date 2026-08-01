# Repository instructions

## Canonical hosting

- The only production homepage for this repository is GitHub Pages:
  `https://nanashi8.github.io/study-app/`.
- Production deployment is handled only by `.github/workflows/deploy.yml` after
  changes reach `main`.
- The former Eigo Quest ChatGPT Sites project is retired. Never create or
  restore `.openai/hosting.json`, package this repository for Sites, push to a
  Sites source repository, or deploy to a `chatgpt.site` URL.
- Do not infer a deployment target from legacy `eigo-quest` identifiers. The
  localStorage key, progress-code prefix, and persisted content IDs are retained
  solely for saved-data compatibility.
- Run `npm run check:deployment` before reporting any hosting or release work as
  ready. A failure is a release blocker.

## Visual direction

- Before generating, editing, selecting, or reviewing game visuals, read
  `docs/game-visual-direction.md` in full.
- Treat every item in its "Hard rejection gates" section as a release gate.
- Do not add an image that has not passed the documented scene-logic and
  character-continuity checklist.
