import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import test from 'node:test'

const readSource = (path) => readFile(new URL(path, import.meta.url), 'utf8')

test('対決入口はキービジュアル・先生・問題数・開始操作だけを優先する', async () => {
  const source = await readSource('../src/screens/EnglishMap.jsx')

  assert.match(source, /className="after-school-start-key-visual order-0"/)
  assert.match(source, /src=\{publicAssetUrl\(AFTER_SCHOOL_CHRONICLE\.keyVisual\)\}/)
  assert.match(source, /今日の対決を選ぶ/)
  assert.match(source, /data-battle-theme=\{battleTheme\.id\}/)
  assert.match(source, /<BattleStandingActor[\s\S]*?pose="back"[\s\S]*?phase="entry"/)
  assert.match(source, /data-battle-standing-entry/)
  assert.match(source, /battleStudentPortrait\(battleStudent\.id, 'confident'\)/)
  assert.match(source, /src=\{battleRival\.portrait\}/)
  assert.match(source, /問題数をえらぶ/)
  assert.match(source, /問のことば対決へ/)
  assert.doesNotMatch(source, /battle-entry-route|相性・絆・対決演出|このバトルの作戦|先生は悪役|encounter\.move/)
})

test('実戦は全生徒の4姿と既存モーションを舞台の主役にする', async () => {
  const [source, cast, actor] = await Promise.all([
    readSource('../src/screens/VocabQuiz.jsx'),
    readSource('../src/lib/battleCast.js'),
    readSource('../src/components/BattleStandingActor.jsx'),
  ])

  for (const phase of [
    'victory',
    'defeat',
    'healing',
    'guard',
    'hero-action',
    'enemy-action',
    'ready',
  ]) {
    assert.match(source, new RegExp(`['"]?${phase}['"]?`), phase)
  }
  assert.match(source, /battle-key-visual-stage/)
  assert.match(source, /data-battle-key-visual=\{battleStageUrl\}/)
  assert.match(source, /data-battle-reference-visual=\{battleTheme\.preview\}/)
  assert.match(source, /\{battleTheme\.name\} · \{scene\.name\}/)
  assert.match(source, /function FullBodyBattleActor/)
  assert.match(source, /data-battle-full-body=\{resolvedSrc\}/)
  assert.match(source, /<BattleStandingActor/)
  assert.match(source, /student=\{battleStudent\}/)
  assert.match(source, /pose=\{standingPose\}/)
  assert.match(source, /motionSrc=\{studentMotion\}/)
  assert.match(source, /motionActive=\{presentationActive\}/)
  assert.match(source, /src=\{battleRival\.fullBody\}/)
  assert.match(source, /battle-stage-unit-fullbody/)
  assert.match(cast, /BATTLE_STANDING_POSES/)
  assert.match(cast, /standingSheet: publicAssetUrl/)
  assert.match(cast, /battleStandingPoseForPhase/)
  assert.match(cast, /FULL_BODY_BATTLE_RIVAL_IDS = new Set\(\['math-takagi'\]\)/)
  assert.match(actor, /data-battle-standing-pose=\{pose\}/)
  assert.match(actor, /<video[\s\S]*?autoPlay[\s\S]*?muted[\s\S]*?playsInline/)
  assert.match(actor, /prefers-reduced-motion: reduce/)
  await access(new URL('../public/assets/battle/fullbody/rivals/math-takagi.png', import.meta.url))
  assert.match(source, /battle-combatants-bar/)
  assert.match(source, /battle-command-shell/)
  assert.match(source, /data-battle-phase=\{battlePhase\}/)
  assert.match(source, /className="battle-stage-ground"/)
  assert.match(source, /battle-stage-aura-hero/)
  assert.match(source, /battle-stage-aura-enemy/)
  assert.match(source, /battle-stage-clash-axis/)
  assert.match(source, /<em>\{battlePhaseLabel\}<\/em>/)
})

test('戦闘結果は選択した舞台、生徒、相手、決着を一枚の結果画面に残す', async () => {
  const source = await readSource('../src/screens/SessionResult.jsx')

  assert.match(source, /function BattleResultStage/)
  assert.match(source, /data-testid="battle-result-stage"/)
  assert.match(source, /url\("\$\{theme\.stage\}"\)/)
  assert.match(source, /data-testid="battle-result-lead-student"/)
  assert.match(source, /<BattleStandingActor/)
  assert.match(source, /pose=\{standingPose\}/)
  assert.match(source, /motionSrc=\{standingMotion\}/)
  assert.match(source, /src=\{rival\.portrait\}/)
  assert.match(source, /<h1>\{verdict\.title\}<\/h1>/)
  assert.match(source, /aria-label=\{`\$\{student\.name\}と\$\{rival\.name\}の対決結果。\$\{verdict\.title\}`\}/)
})

test('戦闘結果は生徒別のかわいい・かっこいい動画演出を再生できる', async () => {
  const source = await readSource('../src/screens/SessionResult.jsx')

  assert.match(source, /battleStudentResultAnimation\(\{/)
  assert.match(source, /function BattleResultEffects/)
  assert.match(source, /data-battle-result-style=\{animation\.style\}/)
  assert.match(source, /data-battle-result-phase=\{animation\.phase\}/)
  assert.match(source, /battleStudentMotion\(student\.id, motionEmotion\)/)
  assert.match(source, /className="battle-result-motion-video"/)
  assert.match(source, /<video[\s\S]*?autoPlay[\s\S]*?muted[\s\S]*?playsInline/)
  assert.match(source, /バトル結果の演出をもう一度見る/)
  assert.match(source, /prefers-reduced-motion: reduce/)
})

test('共通CSSは狭幅・低画面・動きを減らす設定まで対決演出を支える', async () => {
  const css = await readSource('../src/index.css')

  assert.match(css, /\.battle-entry-route\s*\{/)
  assert.match(css, /\.pixel-battle-stage\[data-battle-phase='hero-action'\]/)
  assert.match(css, /\.pixel-battle-stage\[data-battle-phase='enemy-action'\]/)
  assert.match(css, /\.battle-result-stage\s*\{/)
  assert.match(css, /@keyframes battle-result-cute-hero/)
  assert.match(css, /@keyframes battle-result-cool-hero/)
  assert.match(css, /@keyframes battle-result-cute-pop/)
  assert.match(css, /@keyframes battle-result-cool-slash/)
  assert.match(css, /\.battle-result-motion-video/)
  assert.match(css, /\.battle-result-effect-field\[data-result-effect='cute'\]/)
  assert.match(css, /\.battle-result-effect-field\[data-result-effect='cool'\]/)
  assert.match(css, /@media \(max-width: 350px\)/)
  assert.match(css, /@media \(max-height: 640px\)/)
  assert.match(css, /\.pixel-battle-hud\[data-battle-ui-mode='simple'\]\[data-battle-theme\] \.battle-key-visual-stage\s*\{[\s\S]*display: block;/)
  assert.match(css, /\.battle-fullbody-actor > img\s*\{[\s\S]*object-fit: contain;/)
  assert.match(css, /\.battle-standing-actor\s*\{[\s\S]*aspect-ratio: 1;/)
  assert.match(css, /\.battle-standing-actor\[data-battle-standing-pose='back'\]/)
  assert.match(css, /\.battle-standing-actor\[data-battle-standing-pose='wind'\]/)
  assert.match(css, /\.battle-standing-actor\[data-battle-standing-pose='battle'\]/)
  assert.match(css, /\.battle-standing-actor\[data-battle-standing-pose='mana'\]/)
  assert.match(css, /\.pixel-battle-stage\[data-battle-layout='music-duel'\] \.battle-stage-unit-fullbody/)
  assert.match(css, /\.pixel-battle-stage\[data-battle-layout='art-grid'\] \.battle-stage-unit-fullbody\.battle-stage-hero/)
  assert.match(css, /\.pixel-battle-stage\[data-battle-layout='library-duel'\] \.battle-stage-unit-fullbody/)
  assert.match(css, /@media \(max-height: 640px\)[\s\S]*\.battle-key-visual-stage[\s\S]*height: 164px;/)
  assert.match(css, /\.battle-combatants-bar \.pixel-battle-portrait,[\s\S]*display: none;/)
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/)
  assert.match(css, /\.battle-stage-clash-axis,/)
  assert.match(css, /\.battle-result-stage,/)
  assert.match(css, /\.battle-result-effect-field,[\s\S]*?\.battle-result-replay,[\s\S]*?\.battle-standing-motion-cut-in\s*\{[\s\S]*?display: none;/)
})

test('先生たちとの学校生活は専用の先生ビジュアルと配色を持つ', async () => {
  const [source, css] = await Promise.all([
    readSource('../src/screens/EnglishMap.jsx'),
    readSource('../src/index.css'),
  ])

  assert.match(source, /faculty:\s*Teacher/)
  assert.match(source, /<ChronicleIcon kind="faculty" size=\{24\} \/>/)
  assert.match(css, /\.chronicle-vector-icon\[data-chronicle-icon='faculty'\]\s*\{/)
  assert.match(css, /\.teacher-avatar-icon > img\s*\{/)
})
