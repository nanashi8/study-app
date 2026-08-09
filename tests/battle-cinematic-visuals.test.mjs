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
  assert.match(source, /<BattleOpponentStandingActor[\s\S]*?phase="entry"/)
  assert.match(source, /data-battle-standing-entry/)
  assert.match(source, /battleStudentPortrait\(battleStudent\.id, 'confident'\)/)
  assert.match(source, /opponent=\{battleRival\}/)
  assert.match(source, /問題数をえらぶ/)
  assert.match(source, /問のことば対決へ/)
  assert.doesNotMatch(source, /battle-entry-route|相性・絆・対決演出|このバトルの作戦|先生は悪役|encounter\.move/)
})

test('実戦は独立背景の上で生徒と先生の全身アニメを主役にする', async () => {
  const [source, cast, actor, opponentActor] = await Promise.all([
    readSource('../src/screens/VocabQuiz.jsx'),
    readSource('../src/lib/battleCast.js'),
    readSource('../src/components/BattleStandingActor.jsx'),
    readSource('../src/components/BattleOpponentStandingActor.jsx'),
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
  assert.match(source, /\{battleStage\.name\}/)
  assert.match(source, /<BattleStandingActor/)
  assert.match(source, /<BattleOpponentStandingActor/)
  assert.match(source, /student=\{battleStudent\}/)
  assert.match(source, /pose=\{standingPose\}/)
  assert.match(source, /opponent=\{battleRival\}/)
  assert.match(source, /phase=\{battlePhase\}/)
  assert.match(source, /battle-stage-unit-fullbody/)
  assert.match(source, /battle-anime-fighter-hero/)
  assert.match(source, /battle-anime-fighter-enemy/)
  assert.match(source, /battle-spell-bolt-hero/)
  assert.match(source, /battle-spell-bolt-enemy/)
  assert.match(source, /battle-spell-impact-on-enemy/)
  assert.match(source, /battle-spell-impact-on-hero/)
  assert.match(source, /battle-cinematic-caption/)
  assert.match(source, /battleStageForEncounter\(/)
  assert.match(source, /data-battle-stage-id=\{battleStage\.id\}/)
  assert.doesNotMatch(source, /BattleManaAnimation|battle-stage-aura|battle-stage-clash-axis/)
  assert.doesNotMatch(source, /battle-theme-stage-decoration|battle-theme-particles|battle-theme-action-effect/)
  assert.match(cast, /BATTLE_STANDING_POSES/)
  assert.match(cast, /standingSheet: publicAssetUrl/)
  assert.match(cast, /battleStandingPoseForPhase/)
  assert.match(cast, /standing: publicAssetUrl\(`\/assets\/battle\/standing\/rivals\/\$\{id\}\.png`\)/)
  assert.match(actor, /data-battle-standing-pose=\{pose\}/)
  assert.doesNotMatch(actor, /<video|battle-standing-motion-cut-in|motionSrc|motionActive/)
  assert.match(opponentActor, /data-battle-standing-opponent=\{opponentId\}/)
  await access(new URL('../public/assets/battle/standing/rivals/math-takagi.png', import.meta.url))
  assert.match(source, /battle-combatants-bar/)
  assert.match(source, /battle-command-shell/)
  assert.match(source, /data-battle-phase=\{battlePhase\}/)
  assert.match(source, /<em>\{battlePhaseLabel\}<\/em>/)
})

test('背景は独立レイヤーで待機中は静止し、戦況カメラと停止設定を守る', async () => {
  const [backdrop, entry, battle, result, css] = await Promise.all([
    readSource('../src/components/BattleStageBackdrop.jsx'),
    readSource('../src/screens/EnglishMap.jsx'),
    readSource('../src/screens/VocabQuiz.jsx'),
    readSource('../src/screens/SessionResult.jsx'),
    readSource('../src/index.css'),
  ])

  assert.match(backdrop, /data-battle-stage-backdrop/)
  assert.match(backdrop, /data-battle-backdrop-phase=\{phase\}/)
  assert.match(backdrop, /battle-stage-backdrop-image/)
  assert.doesNotMatch(backdrop, /battle-stage-backdrop-atmosphere/)
  assert.match(entry, /<BattleStageBackdrop[\s\S]*?scene="var\(--battle-entry-standing-scene\)"[\s\S]*?phase="entry"/)
  assert.match(battle, /<BattleStageBackdrop[\s\S]*?scene="var\(--battle-scene\)"[\s\S]*?phase=\{battlePhase\}/)
  assert.match(result, /<BattleStageBackdrop[\s\S]*?scene="var\(--battle-result-scene\)"[\s\S]*?phase=\{standingPhase\}/)

  for (const animation of [
    'entry',
    'hero-impact',
    'enemy-impact',
    'guard',
    'healing',
    'victory',
    'defeat',
  ]) {
    assert.match(css, new RegExp(`@keyframes battle-stage-backdrop-${animation}`), animation)
  }
  assert.match(css, /\.battle-stage-backdrop-image\s*\{[\s\S]*?animation: none;/)
  for (const phase of [
    'entry',
    'hero-action',
    'enemy-action',
    'guard',
    'healing',
    'victory',
    'defeat',
  ]) {
    assert.match(css, new RegExp(`data-battle-backdrop-phase='${phase}'`), phase)
  }
  assert.match(css, /data-battle-ui-mode='simple'[\s\S]*?\.battle-stage-backdrop[\s\S]*?animation: none;/)
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.battle-stage-backdrop-image,[\s\S]*?animation: none;/)
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.battle-stage-backdrop :where\([\s\S]*?animation: none !important;[\s\S]*?transform: none !important;/)
})

test('戦闘結果は舞台・決着・主要4指標・次の操作だけを一枚に残す', async () => {
  const source = await readSource('../src/screens/SessionResult.jsx')

  assert.match(source, /data-testid="battle-result-console"/)
  assert.match(source, /data-testid="battle-result-hud"/)
  assert.match(source, /<div><b>\{percent\}%<\/b><small>\{correct\}\/\{total\} 正解<\/small><\/div>/)
  assert.match(source, /<div><b>\+\{xpGained\}<\/b><small>XP<\/small><\/div>/)
  assert.match(source, /<div><b>\+\{battleStarsGained\}<\/b><small>スター<\/small><\/div>/)
  assert.match(source, /<div><b>LV \{level\}<\/b>/)
  assert.doesNotMatch(source, /BATTLE_RESULT_PANELS|battleResultPanel|battle-result-tablist|battle-result-panel/)
  assert.doesNotMatch(source, /<BattleCompanionPicker/)
  assert.match(source, /次へ：戦いの結末/)
  assert.match(source, /function BattleResultStage/)
  assert.match(source, /data-testid="battle-result-stage"/)
  assert.match(source, /url\("\$\{theme\.stage\}"\)/)
  assert.match(source, /data-testid="battle-result-lead-student"/)
  assert.match(source, /<BattleStandingActor/)
  assert.match(source, /<BattleOpponentStandingActor/)
  assert.match(source, /pose=\{standingPose\}/)
  assert.doesNotMatch(source, /motionSrc=\{standingMotion\}/)
  assert.match(source, /opponent=\{rival\}/)
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
  assert.doesNotMatch(source, /バトル結果の演出をもう一度見る|battle-result-replay/)
  assert.match(source, /prefers-reduced-motion: reduce/)
})

test('共通CSSは狭幅・低画面・動きを減らす設定まで対決演出を支える', async () => {
  const css = await readSource('../src/index.css')

  assert.match(css, /\.battle-entry-route\s*\{/)
  assert.match(css, /\.pixel-battle-stage\[data-battle-phase='hero-action'\]/)
  assert.match(css, /\.pixel-battle-stage\[data-battle-phase='enemy-action'\]/)
  assert.match(css, /\.battle-result-stage\s*\{/)
  assert.match(css, /\.battle-result-console-shell\s*\{/)
  assert.match(css, /\.battle-result-hud\s*\{/)
  assert.match(css, /grid-template-columns: repeat\(4, minmax\(0, 1fr\)\)/)
  assert.doesNotMatch(css, /\.battle-result-tablist\s*\{|\.battle-result-panel\s*\{/)
  assert.match(css, /\.battle-result-screen\[data-battle-ui-mode='gaming'\]/)
  assert.match(css, /\.battle-result-console-shell\[data-battle-ui-mode='simple'\]/)
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
  assert.match(css, /\.battle-anime-fighter-hero/)
  assert.match(css, /\.battle-anime-fighter-enemy/)
  assert.match(css, /\.battle-quiz-screen\[data-battle-theme\] \.pixel-battle-stage\[data-battle-phase='hero-action'\] \.battle-anime-fighter-hero\s*\{[\s\S]*?animation: battle-anime-hero-cast/)
  assert.match(css, /\.battle-quiz-screen\[data-battle-theme\] \.pixel-battle-stage\[data-battle-phase='enemy-action'\] \.battle-anime-fighter-enemy\s*\{[\s\S]*?animation: battle-anime-enemy-cast/)
  assert.match(css, /@keyframes battle-anime-hero-cast/)
  assert.match(css, /@keyframes battle-anime-enemy-cast/)
  assert.match(css, /@keyframes battle-spell-bolt-right/)
  assert.match(css, /@keyframes battle-spell-bolt-left/)
  assert.match(css, /@keyframes battle-spell-impact/)
  assert.match(css, /@keyframes battle-anime-hero-guard/)
  assert.match(css, /@keyframes battle-anime-hero-recover/)
  assert.match(css, /@keyframes battle-anime-hero-victory/)
  assert.match(css, /@media \(max-height: 640px\)[\s\S]*\.battle-key-visual-stage[\s\S]*height: 164px;/)
  assert.match(css, /\.battle-combatants-bar \.pixel-battle-portrait,[\s\S]*display: none;/)
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/)
  assert.match(css, /\.battle-spell-bolt/)
  assert.match(css, /\.battle-spell-impact/)
  assert.doesNotMatch(css, /battle-anime-(?:hero|enemy)-combo/)
  assert.doesNotMatch(css, /translate3d\((?:86|-86|-62)%/)
  assert.match(css, /\.battle-result-stage,/)
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.battle-anime-fighter,[\s\S]*?\.battle-spell-bolt,[\s\S]*?animation: none !important;/)
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
