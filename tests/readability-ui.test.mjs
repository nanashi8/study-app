import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'

async function jsxFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(entries.map(async (entry) => {
    const url = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, directory)
    if (entry.isDirectory()) return jsxFiles(url)
    return entry.name.endsWith('.jsx') ? [url] : []
  }))
  return nested.flat()
}

test('公開中の全59ルートは共通の可読性レイヤー・上部戻る・上部メニューを通る', async () => {
  const [app, shell] = await Promise.all([
    readFile(new URL('../src/App.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/AppShell.jsx', import.meta.url), 'utf8'),
  ])
  const screenMap = app.slice(app.indexOf('const SCREENS = {'), app.indexOf('// 全公開画面'))
  const routeCount = (screenMap.match(/^  [A-Za-z][A-Za-z0-9]*:/gm) ?? []).length

  assert.equal(routeCount, 59)
  assert.match(app, /<AppShell>/)
  assert.doesNotMatch(app, /BottomNav|nav=\{/)
  assert.match(shell, /study-app-surface/)
  assert.match(shell, /study-app-content/)
  assert.match(shell, /min-h-16/)
  assert.match(shell, /text-xl font-extrabold/)
  assert.doesNotMatch(shell, /linear-gradient\(to bottom/)
})

test('画面・共通部品の6〜11px指定は全件を共通拡大規則で受ける', async () => {
  const [css, screenFiles, componentFiles] = await Promise.all([
    readFile(new URL('../src/index.css', import.meta.url), 'utf8'),
    jsxFiles(new URL('../src/screens/', import.meta.url)),
    jsxFiles(new URL('../src/components/', import.meta.url)),
  ])
  const sources = await Promise.all([...screenFiles, ...componentFiles].map((url) => readFile(url, 'utf8')))
  const sizes = []
  for (const source of sources) {
    for (const match of source.matchAll(/text-\[(\d+)px\]/g)) {
      const size = Number(match[1])
      if (size <= 11) sizes.push(size)
    }
  }
  const uniqueSizes = [...new Set(sizes)].sort((a, b) => a - b)

  assert.ok(sizes.length >= 650, `audited ${sizes.length} compact labels`)
  assert.deepEqual(uniqueSizes, [6, 7, 8, 9, 10, 11])
  for (const size of uniqueSizes) {
    assert.equal(css.includes(`.text-\\[${size}px\\]`), true, `${size}px override`)
  }
  assert.match(css, /\.study-app-surface \.text-xs/)
  assert.match(css, /\.study-app-surface \.text-sm/)
  assert.match(css, /font-size: 0\.8125rem/)
  assert.match(css, /font-size: 0\.9375rem/)
})

test('共通カード・ボタン・統一上部メニューは装飾を抑えて文字を優先する', async () => {
  const [ui, shell, css] = await Promise.all([
    readFile(new URL('../src/components/ui.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/AppShell.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/index.css', import.meta.url), 'utf8'),
  ])

  assert.match(ui, /'bg-brand-600 text-white shadow-sm active:bg-brand-700'/)
  assert.match(ui, /rounded-2xl border border-slate-200\/70 bg-white/)
  assert.doesNotMatch(ui.slice(ui.indexOf('const VARIANTS'), ui.indexOf('const SIZES')), /bg-gradient-to-b/)
  assert.match(shell, /data-global-menu-bar/)
  assert.match(shell, /data-global-back-button/)
  assert.match(shell, /data-global-menu-button/)
  assert.match(shell, /aria-label="統一メニューを開く"/)
  assert.doesNotMatch(shell, /data-global-bottom-nav/)
  assert.match(shell, /text-xs/)
  assert.doesNotMatch(shell, /scale-110/)
  assert.match(css, /--shadow-card: 0 2px 8px -5px/)
})

test('英語ホームは学習選択を直接表示し、終了したゲーム導線を出さない', async () => {
  const home = await readFile(new URL('../src/screens/Home.jsx', import.meta.url), 'utf8')
  const primaryModes = home.match(/const PRIMARY_LEARNING_MODES = \[([\s\S]*?)\n\]/)?.[1] ?? ''

  assert.deepEqual(
    [...primaryModes.matchAll(/id: '([^']+)'/g)].map((match) => match[1]),
    ['vocab', 'reading', 'phrases', 'grammar', 'listening'],
  )
  assert.match(home, /data-home-learning-menu/)
  assert.match(home, /PRIMARY_LEARNING_MODES\.map/)
  assert.match(home, /英語の主要学習/)
  assert.match(home, /上部の「メニュー」にまとめています/)
  assert.doesNotMatch(home, /EXTRA_LEARNING_MODES|data-home-recommendation|data-home-mode-group="support"/)
  assert.doesNotMatch(home, /screen: 'diagnostic'|screen: 'myList'|screen: 'myGrammar'/)
  assert.doesNotMatch(home, /data-home-mode-group="game"|afterSchoolChronicle|englishMap|AFTER_SCHOOL_CHRONICLE/)
  assert.doesNotMatch(home, /home-title-screen|data-home-title-action|learningMenuOpen|つづきから/)
  assert.doesNotMatch(home, /recommendation\.reason|recommendation\.timing|ProgressRing|きょうの語源/)
})

test('五芒星マップは選択中の地点名だけを表示し、ボタン名は保持する', async () => {
  const [css, map] = await Promise.all([
    readFile(new URL('../src/index.css', import.meta.url), 'utf8'),
    readFile(new URL('../src/screens/EnglishMap.jsx', import.meta.url), 'utf8'),
  ])

  assert.match(css, /\.school-barrier-marker-label\s*{\s*display: none;/)
  assert.match(css, /\.school-barrier-marker-selected \.school-barrier-marker-label/)
  assert.match(map, /aria-label=\{`\$\{location\.name\}・\$\{location\.role\}`\}/)
})

test('龍脈調査入口は修復情報を絞り、低い画面でも4択を保つ', async () => {
  const [css, map, quiz] = await Promise.all([
    readFile(new URL('../src/index.css', import.meta.url), 'utf8'),
    readFile(new URL('../src/screens/EnglishMap.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/screens/VocabQuiz.jsx', import.meta.url), 'utf8'),
  ])

  assert.match(map, /data-testid="dragon-vein-restoration-board"/)
  assert.match(map, /一度に解く問題数/)
  assert.doesNotMatch(map.slice(
    map.indexOf('export function AfterSchoolChronicleScreen'),
    map.indexOf('function ChroniclePortalCard'),
  ), /school-battle-context|相性・絆・対決演出|このバトルの作戦|先生は悪役|HP|ATK|DEF/)
  assert.match(quiz, /isDragonVein \? 'mt-2 grid grid-cols-2 gap-2'/)
  assert.match(quiz, /\{options\.map\(/)
  assert.match(quiz, /<UnknownChoiceButton/)
  assert.match(css, /@media \(max-width: 350px\), \(max-height: 640px\)[\s\S]*\.dragon-vein-stage-scene \{ height: 11\.25rem; \}/)
})

test('終了したゲーム実装は互換用に保持しても、公開ルートとメニューへ接続しない', async () => {
  const [map, shell, css, menu, album, app, visibility] = await Promise.all([
    readFile(new URL('../src/screens/EnglishMap.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/AppShell.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/index.css', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/SpeechSettings.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/screens/StoryAlbum.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/App.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/lib/learnerVisibility.js', import.meta.url), 'utf8'),
  ])
  const menuConfig = map.slice(
    map.indexOf('const CHRONICLE_MENU_SECTIONS'),
    map.indexOf('// ゲーム入口の主要アイコン'),
  )
  const screen = map.slice(
    map.indexOf('export function AfterSchoolChronicleScreen'),
    map.indexOf('function ChroniclePortalCard'),
  )

  assert.deepEqual(
    [...menuConfig.matchAll(/id: '([^']+)', label: '([^']+)'/g)]
      .map(([, id, label]) => [id, label]),
    [
      ['restoration', '修復'],
      ['growth', '記録'],
      ['friends', '協力者'],
      ['school', '学園'],
    ],
  )
  assert.match(screen, /aria-label="ゲームメニュー"/)
  assert.match(screen, /data-game-console/)
  assert.match(screen, /className="after-school-console-screen space-y-3"/)
  assert.match(screen, /className="after-school-console-key"/)
  assert.match(screen, /data-game-menu=\{section\.id\}/)
  assert.match(screen, /data-game-menu-panel=\{menuSection\.id\}/)
  assert.match(screen, /menuSection\.id === 'restoration'[\s\S]*<DragonVeinRestorationBoard/)
  assert.doesNotMatch(screen, /ChronicleHero/)
  assert.match(screen, /menuSection\.id === 'growth'[\s\S]*<DragonVeinProgressSummary/)
  assert.doesNotMatch(screen, /InvestigationExperienceCard|\bXP\b|heroProgress/)
  assert.match(screen, /menuSection\.id === 'friends'[\s\S]*<AfterSchoolBondBoard[\s\S]*<BattleCastRoster/)
  assert.match(screen, /menuSection\.id === 'school'[\s\S]*<StoryArcTimeline[\s\S]*<SchoolBarrierMap[\s\S]*<SchoolLifeAlbum[\s\S]*<TeacherSchoolLife/)
  assert.match(screen, /title="調査の記録"/)
  assert.match(screen, /title="協力する生徒たち"/)
  assert.match(screen, /title="先生の記憶を聞く"/)
  assert.doesNotMatch(screen, /StoryKeyVisualAlbum|storyKeyVisualAlbum/)
  assert.doesNotMatch(menu, /APP_MENU_EXTRAS|data-menu-extras|data-menu-extra|storyAlbum|afterSchoolChronicle|GameSettingsPanel|龍脈/)
  assert.match(album, /data-story-album-screen/)
  assert.match(album, /<StoryKeyVisualAlbum album=\{album\} \/>/)
  assert.doesNotMatch(app, /englishMap:|afterSchoolChronicle:|afterSchoolInterlude:|characterTalk:|storyAlbum:/)
  for (const screen of ['englishMap', 'afterSchoolChronicle', 'afterSchoolInterlude', 'characterTalk', 'storyAlbum']) {
    assert.match(visibility, new RegExp(`'${screen}'`))
  }
  assert.match(screen, /titleClassName="after-school-screen-title"/)
  assert.match(map, /after-school-portal-console/)
  assert.match(shell, /titleClassName = ''/)
  assert.match(css, /\.after-school-handheld\s*\{/)
  assert.match(css, /\.after-school-console-screen\s*\{[\s\S]*height: clamp\(20rem, 58dvh, 36rem\);[\s\S]*overflow-y: auto;/)
  assert.match(css, /\.after-school-console-key\[aria-pressed='true'\]/)
  assert.match(css, /\.after-school-console-drawer-action::after[\s\S]*content: 'ひらく';/)
  assert.match(css, /@media \(max-width: 350px\)[\s\S]*\.after-school-screen-title[\s\S]*white-space: normal;[\s\S]*\.after-school-screen-subtitle[\s\S]*display: none;/)
})
