// メニューの「設定・アカウント」欄にあった「ログイン・保存」の行を、紛らわしいので出さない。
// 2026-09-27 利用者「設定・アカウントのログイン・保存は紛らわしいので見えないようにしなさい。」
// 行とアカウントの表示・ログイン画面を外し、ほかの画面のログインの案内も出さない。
// すでにログインしている端末は、見えないまま今までどおりクラウドへ保存・復元を続ける。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
import { APP_MENU_ACTIONS, APP_MENU_SECTIONS } from '../src/lib/appMenu.js'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const read = (file) => readFileSync(join(ROOT, file), 'utf8')
const LOGIN_WORDS = /ログイン|ログアウト|アカウント|パスワード|クラウド|ゲスト/u
const EMAIL = 'student@example.com'

// ログインの状態は3つ。どれでもメニューは同じに見える。
const AUTH_STATES = [
  ['ゲスト', { status: 'out', user: null }],
  ['Firebase 未設定', { status: 'unconfigured', user: null }],
  ['ログイン中', { status: 'in', user: { uid: 'hidden-login-test', email: EMAIL } }],
]

// 直す前の全28行から「ログイン・保存」の1行だけを外した27行。ほかの行は1つも消さない。
const EXPECTED_ROWS = [
  ['apps', 'portal', 'スタディアプリ ホーム'],
  ['apps', 'home', '英語アプリ'],
  ['apps', 'mathMap', '数学アプリ'],
  ['apps', 'kotenList', '古典アプリ'],
  ['apps', 'kanbunHome', '漢文アプリ'],
  ['apps', 'literatureLibrary', '名作に親しむ'],
  ['english', 'vocabLevels', '英単語'],
  ['english', 'vocabSearch', '英和辞書'],
  ['english', 'writing', '英作文'],
  ['english', 'roots', '語源学習'],
  ['english', 'readingList', '長文読解'],
  ['english', 'phrases', '熟語・構文'],
  ['english', 'grammar', '英文法'],
  ['english', 'listening', 'リスニング'],
  ['support', 'advisor', '学習アドバイザー'],
  ['support', 'analytics', '学習記録とおすすめ'],
  ['support', 'diagnostic', '学習診断'],
  ['support', 'dictation', 'ディクテーション'],
  ['support', 'vocabCamera', '教科書から単語追加'],
  ['support', 'customWords', '自作単語'],
  ['support', 'wordRequests', '辞書リクエスト一覧'],
  ['records', 'myList', 'マイ学習ノート'],
  ['records', 'myLearning', '暗記・テストの記録'],
  ['records', 'myGrammar', 'マイ文法'],
  ['records', 'progress', '学習記録・バックアップ'],
  ['settings', 'settings', '設定'],
  ['settings', 'reset', '学習履歴を選んでリセット'],
]

const unescapeHtml = (text) => text
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&#x27;/g, "'")
  .replace(/&amp;/g, '&')
const textOf = (html) => unescapeHtml(html.replace(/<[^>]+>/g, '\n')).replace(/\n+/g, '\n').trim()

// コメントを空白にして、画面に出る文字列と JSX の地の文だけを残す。
function withoutComments(source) {
  let output = ''
  let index = 0
  let quote = null
  while (index < source.length) {
    const char = source[index]
    const next = source[index + 1]
    if (quote) {
      output += char
      if (char === '\\') {
        output += next ?? ''
        index += 2
        continue
      }
      if (char === quote) quote = null
      index += 1
      continue
    }
    if (char === "'" || char === '"' || char === '`') {
      quote = char
      output += char
      index += 1
      continue
    }
    if (char === '/' && next === '/') {
      while (index < source.length && source[index] !== '\n') {
        output += ' '
        index += 1
      }
      continue
    }
    if (char === '/' && next === '*') {
      index += 2
      while (index < source.length && !(source[index] === '*' && source[index + 1] === '/')) {
        output += source[index] === '\n' ? '\n' : ' '
        index += 1
      }
      index += 2
      continue
    }
    output += char
    index += 1
  }
  return output
}

// 学習者向け日本語の監査と同じ範囲：src の全 .jsx・src/lib・src/data/contents.js。
function learnerFiles(directory = join(ROOT, 'src')) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name)
    if (statSync(path).isDirectory()) return learnerFiles(path)
    const file = relative(ROOT, path)
    const learner = extname(file) === '.jsx'
      || (file.startsWith('src/lib/') && extname(file) === '.js')
      || file === 'src/data/contents.js'
    return learner ? [file] : []
  })
}

// サーバー描画（renderToStaticMarkup）では、zustand はストアの今の値ではなく初期値（getInitialState）を読む。
// 初期値の中身を一時的に差し替えて描き、描き終えたら元に戻す。
function withInitialState(store, patch, run) {
  const initial = store.getInitialState()
  const saved = Object.fromEntries(Object.keys(patch).map((key) => [key, initial[key]]))
  Object.assign(initial, patch)
  try {
    return run()
  } finally {
    Object.assign(initial, saved)
  }
}

let vite
let modules

before(async () => {
  vite = await createServer({
    configFile: false,
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  })
  modules = {
    menu: await vite.ssrLoadModule('/src/components/SpeechSettings.jsx'),
    auth: await vite.ssrLoadModule('/src/store/useAuth.js'),
    store: await vite.ssrLoadModule('/src/store/useStore.js'),
  }
})

after(async () => {
  await vite?.close()
})

test('メニューの台帳に「ログイン・保存」の行がなく、ほかの27行はそのまま残る', () => {
  assert.deepEqual(APP_MENU_SECTIONS.map(({ id, label }) => [id, label]), [
    ['apps', 'スタディアプリ'],
    ['english', '英語の学習'],
    ['support', '学習サポート'],
    ['records', '保存・記録'],
    ['settings', '設定'],
  ])
  const rows = APP_MENU_SECTIONS.flatMap((section) => section.items.map((item) => [
    section.id,
    item.kind === 'screen' ? item.screen : item.action,
    item.label,
  ]))
  assert.deepEqual(rows, EXPECTED_ROWS)
  assert.ok(!APP_MENU_ACTIONS.includes('account'))
  for (const section of APP_MENU_SECTIONS) {
    assert.doesNotMatch(section.label, LOGIN_WORDS, section.id)
    for (const item of section.items) {
      assert.doesNotMatch(item.label, LOGIN_WORDS, item.label)
      assert.doesNotMatch(item.description, LOGIN_WORDS, item.label)
    }
  }
})

for (const [name, state] of AUTH_STATES) {
  test(`${name}の端末でメニューを開いても、ログイン・保存の行もアカウントも出ない`, () => {
    const html = withInitialState(modules.auth.useAuth, state, () => withInitialState(
      modules.store.useStore,
      { speechSettingsOpen: true },
      () => renderToStaticMarkup(React.createElement(modules.menu.SpeechSettingsSheet)),
    ))
    {
      const text = textOf(html)
      assert.match(html, /data-app-menu-panel/)
      assert.doesNotMatch(text, LOGIN_WORDS)
      assert.ok(!text.includes(EMAIL), 'ログイン中のメールアドレスを出さない')
      assert.doesNotMatch(html, /data-menu-account-entry|data-menu-action="account"|data-menu-account-panel/)

      // 全27行がそのまま並ぶ。
      const labels = [...html.matchAll(/<strong[^>]*>([^<]+)<\/strong>/g)].map((match) => unescapeHtml(match[1]))
      for (const [, , label] of EXPECTED_ROWS) assert.ok(labels.includes(label), `${label} の行がない`)
      assert.equal((html.match(/ data-menu-item="true"/g) ?? []).length, EXPECTED_ROWS.length)

      // 「設定」の欄は「設定」と「学習履歴を選んでリセット」の2行だけ。
      const settingsSection = html.slice(html.indexOf('data-menu-section="settings"'), html.indexOf('</nav>'))
      assert.match(settingsSection, /<h2[^>]*>設定<\/h2>/)
      assert.deepEqual(
        [...settingsSection.matchAll(/data-menu-action="([^"]+)"/g)].map((match) => match[1]),
        ['settings', 'reset'],
      )
    }
  })
}

test('アカウントの表示とログイン画面は、どこからも開けない', () => {
  const app = read('src/App.jsx')
  const menu = read('src/components/SpeechSettings.jsx')
  const settingsScreen = read('src/screens/Settings.jsx')
  const auth = read('src/store/useAuth.js')

  // ログイン画面はコードから外した。
  assert.ok(!existsSync(join(ROOT, 'src/screens/Login.jsx')))
  const screenMap = app.slice(app.indexOf('const SCREENS = {'), app.indexOf('// 全公開画面'))
  const routes = [...screenMap.matchAll(/^ {2}([A-Za-z][A-Za-z0-9]*):/gm)].map((match) => match[1])
  assert.equal(routes.length, 73)
  assert.ok(!routes.includes('login'))
  assert.doesNotMatch(app, /LoginScreen|screens\/Login/)

  // メニューのシートの表示は、アカウントを除く7つ（と、既定のメニュー）。
  assert.deepEqual(
    [...menu.matchAll(/view === '([a-z-]+)'(?: && contentSettingsItem)? \? \(/g)].map((match) => match[1]),
    ['content-settings', 'settings', 'advisor', 'analytics', 'reset', 'reset-complete', 'backup-reset'],
  )
  assert.doesNotMatch(menu, /AccountPanel|signOutNow|openScreen\('login'\)|authStatus|isAccount/)
  // どこからも開かれない設定画面にも、アカウントの欄を残さない。
  assert.doesNotMatch(settingsScreen, /useAuth|ログイン|ログアウト|アカウント/)
  // ログイン・ログアウトの処理を呼べる場所も残さない。
  assert.doesNotMatch(auth, /signInWithEmailAndPassword|signOut\b|signIn\(|signOutNow/)
  for (const file of learnerFiles()) {
    const source = withoutComments(read(file))
    assert.doesNotMatch(source, /navigate\('login'\)|openScreen\('login'\)|screen === 'login'/, file)
  }
})

// ログイン中の端末でリセットしたときだけ出る結果の知らせ。ゲストの端末には出ず、ログインの入口が
// なくなるので新しくこの表示に当たる端末もできない。すでにログインしている端末では、クラウドの
// 古い記録が戻らないための再試行に要るので残す（台帳 requests/2026-09-27-hide-login-save.json）。
const KEPT_FOR_LOGGED_IN_RESET = [
  ['src/components/SpeechSettings.jsx', '端末への保存は完了しました。クラウドへ反映しています…'],
  ['src/components/SpeechSettings.jsx', '端末の履歴は消去済みですが、クラウド保存を確認できませんでした。古い履歴が戻らないよう、通信を確認して再試行してください。'],
  ['src/components/SpeechSettings.jsx', "<Button full size=\"sm\" variant=\"hint\" onClick={onRetry}>クラウド保存を再試行</Button>"],
  ['src/components/SpeechSettings.jsx', "? 'この端末とクラウドの初期化を確認しました。'"],
  // 公開終了したゲームの敵の技の名前。クラウド保存とは関係がない。
  ['src/lib/rpg.js', "'クラウド・コイル'"],
]

test('画面の文言で、ログインに触れたり、クラウド保存へ誘ったりしない', () => {
  const files = learnerFiles()
  assert.ok(files.length >= 290, `学習者向けのファイルが${files.length}件しか読めていない`)
  const found = []
  for (const file of files) {
    withoutComments(read(file)).split('\n').forEach((line, index) => {
      if (!LOGIN_WORDS.test(line)) return
      const kept = KEPT_FOR_LOGGED_IN_RESET.some(([keptFile, text]) => keptFile === file && line.includes(text))
      if (!kept) found.push(`${file}:${index + 1}: ${line.trim()}`)
    })
  }
  assert.deepEqual(found, [])

  // 直した3つの画面の案内。
  const customWords = read('src/screens/CustomWords.jsx')
  assert.ok(customWords.includes("{'自作単語はこの端末に保存されます。'}"))
  const camera = read('src/screens/VocabCamera.jsx')
  assert.ok(camera.includes("{'選んだ語だけを辞書登録リクエストへ送ります。'}"))
  const requests = read('src/screens/WordRequests.jsx')
  assert.ok(requests.includes("{'英和辞書で調べて見つからなかった語は、ボタンを押さなくてもそのまま追加リクエストになります。'}"))
  for (const source of [customWords, camera, requests]) assert.doesNotMatch(source, /ログイン|クラウド/)

  // 学習者向け日本語の監査が、ログインの入口と案内を今後も止める。
  const audit = read('scripts/audit-learner-japanese.mjs')
  for (const word of ['ログイン', 'ログアウト', 'アカウント', 'パスワード', 'クラウド保存を使', 'クラウドにも保存']) {
    assert.ok(audit.includes(`['${word}', `), `${word} が禁止語にない`)
  }
})

test('すでにログインしている端末は、見えないまま記録をクラウドへ保存・復元し続ける', () => {
  const app = read('src/App.jsx')
  const menu = read('src/components/SpeechSettings.jsx')
  const auth = read('src/store/useAuth.js')

  // 起動時にログイン状態を読み、ログイン中ならクラウドから復元して、以後は自動で保存する。
  assert.match(app, /useEffect\(\(\) => init\(\), \[init\]\)/)
  assert.match(app, /if \(status !== 'in' \|\| !user\) return/)
  assert.match(app, /pullOrInit\(user\.uid, user\.email\)/)
  assert.match(app, /stop = startAutoSave\(user\.uid, user\.email\)/)
  assert.match(auth, /onAuthStateChanged\(auth, \(u\) => \{/)
  assert.match(auth, /set\(\{ status: 'in', user: \{ uid: u\.uid, email: u\.email \} \}\)/)
  // ログアウトで端末の記録を消す処理は、どこからも呼ばれない（ストアから外した）。
  assert.doesNotMatch(auth, /resetProgress/)
  // リセットは、ログイン中ならクラウドの記録ごと行う。
  assert.match(menu, /const account = useAuth\(\(state\) => state\.user\)/)
  assert.match(menu, /resetProgressEverywhere\(account, selectedGroups\)/)
  assert.match(menu, /resetProgressEverywhere\(account, resetGroupIds\)/)
})
