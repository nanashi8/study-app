import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const readSource = (path) => readFile(new URL(path, import.meta.url), 'utf8')

test('対決入口は選択中の演出と生徒・相手を同じ舞台で予告する', async () => {
  const source = await readSource('../src/screens/EnglishMap.jsx')

  assert.match(source, /className="after-school-start-key-visual order-0"/)
  assert.match(source, /src=\{publicAssetUrl\(AFTER_SCHOOL_CHRONICLE\.keyVisual\)\}/)
  assert.match(source, /今日の対決を選ぶ/)
  assert.match(source, /className="battle-entry-route mt-3"/)
  assert.match(source, /data-battle-theme=\{battleTheme\.id\}/)
  assert.match(source, /battleTheme\.presentation\.modeLabel/)
  assert.match(source, /battleStudentPortrait\(battleStudent\.id, 'confident'\)/)
  assert.match(source, /src=\{battleRival\.portrait\}/)
  assert.match(source, /aria-label=\{`\$\{battleTheme\.name\}で\$\{battleStudent\.name\}と\$\{battleRival\.name\}が対決する準備画面`\}/)
})

test('実戦は舞台キービジュアルを主役にし、全イベントを共通フェーズへ変換する', async () => {
  const source = await readSource('../src/screens/VocabQuiz.jsx')

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
  assert.match(source, /\{battleTheme\.name\} · \{scene\.name\}/)
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
  assert.match(source, /placement="lead"/)
  assert.match(source, /src=\{rival\.portrait\}/)
  assert.match(source, /<h1>\{verdict\.title\}<\/h1>/)
  assert.match(source, /aria-label=\{`\$\{student\.name\}と\$\{rival\.name\}の対決結果。\$\{verdict\.title\}`\}/)
})

test('共通CSSは狭幅・低画面・動きを減らす設定まで対決演出を支える', async () => {
  const css = await readSource('../src/index.css')

  assert.match(css, /\.battle-entry-route\s*\{/)
  assert.match(css, /\.pixel-battle-stage\[data-battle-phase='hero-action'\]/)
  assert.match(css, /\.pixel-battle-stage\[data-battle-phase='enemy-action'\]/)
  assert.match(css, /\.battle-result-stage\s*\{/)
  assert.match(css, /@media \(max-width: 350px\)/)
  assert.match(css, /@media \(max-height: 640px\)/)
  assert.match(css, /\.pixel-battle-hud\[data-battle-ui-mode='simple'\]\[data-battle-theme\] \.battle-key-visual-stage\s*\{[\s\S]*display: block;/)
  assert.match(css, /@media \(max-height: 640px\)[\s\S]*\.battle-key-visual-stage[\s\S]*height: 112px;/)
  assert.match(css, /\.battle-combatants-bar \.pixel-battle-portrait,[\s\S]*display: none;/)
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/)
  assert.match(css, /\.battle-stage-clash-axis,/)
  assert.match(css, /\.battle-result-stage,/)
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
