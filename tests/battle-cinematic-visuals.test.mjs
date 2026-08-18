import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import test from 'node:test'

const readSource = (path) => readFile(new URL(path, import.meta.url), 'utf8')

test('龍脈調査入口は世界の異変・日常調査・五地点の進捗を優先する', async () => {
  const source = await readSource('../src/screens/EnglishMap.jsx')

  assert.match(source, /data-testid="dragon-vein-restoration-board"/)
  assert.match(source, /英語を忘れた街の龍脈/)
  assert.match(source, /DailyDistortionCard/)
  assert.match(source, /DRAGON_VEIN_NODES\.map/)
  assert.match(source, /単語100語・熟語と構文100題/)
  assert.match(source, /1級EXTRA/)
  assert.match(source, /\[\.\.\.SESSION_SIZE_OPTIONS, SESSION_SIZE_ALL\]/)
  assert.doesNotMatch(source.slice(
    source.indexOf('export function AfterSchoolChronicleScreen'),
    source.indexOf('function ChroniclePortalCard'),
  ), /BattleHud|BattleOpponentStandingActor|enemy|HP|ATK|DEF|攻撃|撃破|対戦/)
})

test('解読ビジュアルは背景・生徒・先生・古文書を別レイヤーで合成する', async () => {
  const [stage, cast, actor] = await Promise.all([
    readSource('../src/components/DragonVeinCipherStage.jsx'),
    readSource('../src/lib/battleCast.js'),
    readSource('../src/components/BattleStandingActor.jsx'),
  ])

  assert.match(stage, /dragon-vein-stage-scene/)
  assert.match(stage, /--dragon-stage/)
  assert.match(stage, /dragon-vein-student-layer/)
  assert.match(stage, /dragon-vein-guide-layer/)
  assert.match(stage, /dragon-vein-manuscript-layer/)
  assert.match(stage, /<BattleStandingActor/)
  assert.match(stage, /guide\.standing/)
  assert.match(stage, /battleStudentPortrait\(student\.id, expression\)/)
  assert.match(stage, /dragonVeinExpression/)
  assert.match(stage, /source\?\.distortionPlace \?\? stage\.name/)
  assert.match(stage, /source\?\.distortionTitle \?\? '日常の龍脈解読'/)
  assert.match(stage, /source\?\.distortionSummary \?\? node\.clue/)
  assert.match(cast, /standing: publicAssetUrl\(`\/assets\/battle\/standing\/rivals\/\$\{id\}\.png`\)/)
  assert.match(actor, /data-battle-standing-student=\{student\.id\}/)
  assert.doesNotMatch(stage, /BattleOpponentStandingActor|spell|projectile|impact|attack|enemy|victory|defeat/)
  await access(new URL('../public/assets/battle/standing/rivals/math-takagi.png', import.meta.url))
})

test('単語・熟語・結果画面が解答状況と連続正解を表情へ渡す', async () => {
  const [vocab, phrase, result] = await Promise.all([
    readSource('../src/screens/VocabQuiz.jsx'),
    readSource('../src/screens/PhraseQuiz.jsx'),
    readSource('../src/screens/SessionResult.jsx'),
  ])

  for (const source of [vocab, phrase]) {
    assert.match(source, /<DragonVeinCipherStage/)
    assert.match(source, /lastAnswer=\{streakState\.lastAnswer\}/)
    assert.match(source, /streak=\{streakState\.streak\}/)
    assert.match(source, /wrongStreak=\{streakState\.wrongStreak\}/)
    assert.match(source, /連続\$\{streakState\.streak\}正解/)
    assert.doesNotMatch(source, /BattleHud|BattleOpponentStandingActor|enemyCurrentHp|heroCurrentHp|damage/)
  }
  assert.match(result, /data-testid="dragon-vein-result"/)
  assert.match(result, /expressionStreak = accuracy >= 0\.9 \? 5/)
  assert.match(result, /記憶の文脈が鮮明に戻った/)
  assert.match(result, /復元断片/)
  assert.doesNotMatch(result, /battle-result-console|enemyDefeated|対戦結果|撃破/)
})

test('龍脈ビジュアルは自然な呼吸だけを使い、狭幅と動きを減らす設定を守る', async () => {
  const css = await readSource('../src/index.css')
  const dragonVeinCss = css.slice(
    css.indexOf('.dragon-vein-cipher-stage'),
    css.indexOf('Layered battle magic'),
  )

  assert.match(css, /\.dragon-vein-cipher-stage\s*\{/)
  assert.match(css, /\.dragon-vein-stage-scene\s*\{/)
  assert.match(css, /\.dragon-vein-student-layer\s*\{[\s\S]*?animation: dragon-vein-natural-breathe/)
  assert.match(css, /@keyframes dragon-vein-natural-breathe/)
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.dragon-vein-student-layer \{ animation: none; \}/)
  assert.match(css, /@media \(max-width: 350px\), \(max-height: 640px\)[\s\S]*?\.dragon-vein-stage-scene/)
  assert.doesNotMatch(dragonVeinCss, /battle-spell|battle-anime-enemy|translate3d\(86%|attack/)
})

test('龍脈俯瞰画像は人物やUIを焼き込まず背景資産として独立する', async () => {
  const [theme, stage] = await Promise.all([
    readSource('../src/lib/battleThemes.js'),
    readSource('../src/components/DragonVeinCipherStage.jsx'),
  ])
  assert.match(theme, /dragon-vein-district\.webp/)
  assert.match(theme, /export function battleStageById/)
  assert.match(stage, /battleStageById/)
  await access(new URL('../public/assets/battle/world/dragon-vein-district.webp', import.meta.url))
})
