#!/usr/bin/env node
// リポジトリの追跡ファイルを全件、どこから使われているかで分ける（requests/2026-10-20-remove-unused-files.json）。
//   ① コード：src/main.jsx（アプリの入口）・index.html・vite.config.js・tests・scripts から import をたどって届くか。
//      src のコードはこれだけで決める（コメントに名前が出るだけでは使われていない）
//   ② public の画像など：アプリのコードが組み立てる画像のパス（publicAssetUrl を使うモジュールの書き出しを全部たどり、
//      生徒・敵・先生の画像を組み立てる関数も全員分呼ぶ）か、index.html・site.webmanifest・コードの文字列に出るか
//   ③ そのほか（文書・台帳・試料・設定・道具）：ほかの追跡ファイルに名前（ファイル名かパス）が出るか、
//      フォルダごと読まれる置き場所（KEEP_DIRS）にあるか、先頭のコメントに使い方（node scripts/<自分>）を書いた道具か
// どれにも当たらないファイル（使われていないファイル）と、消したファイル（REMOVED）が戻った・名指しされたものがあれば失敗する。
// 使い方: node scripts/checks/unused-files.mjs [--json]
import { execSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { basename, dirname, join, posix } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))

/** フォルダの中身をまとめて読む置き場所。ファイルごとに名前が出なくても使われている。 */
export const KEEP_DIRS = {
  'requests/': '依頼台帳。scripts/check-requests.mjs がフォルダを全部読む',
  'tests/fixtures/vocab-ocr/': '教科書から単語追加の読み取りの試料。テストが samples.json のページ id から画像の名前を作って読む',
  'docs/audits/word-forms-review/': 'ほかの品詞の形を1語ずつ見直した記録（word-forms-review-apply.mjs に渡した決めた中身の元）',
  'docs/audits/relation-review/': '関連語の使い分けの見直しの記録（relation-review-apply.mjs に渡した決めた中身の元）',
  'docs/audits/lookalike-forms/': '形の似た語を全件読んだ決めた中身の元（lookalike-forms-apply.mjs が台帳を作り直す）',
  'docs/audits/confusables-survey/': 'つづり注意を1組ずつ読んだ決めた中身の元（confusables-survey-apply.mjs に渡す）',
  'docs/audits/example-sense-review/': '例文の意味の見直しの決めた中身の元（example-sense-apply.mjs に渡す）',
  'docs/audits/phrase-links-review/': '熟語・構文のつながりの見直しの記録（phrase-links-review-apply.mjs に渡す）',
  'scripts/git-hooks/': 'git のフック。.claude/settings.json の env で core.hooksPath にフォルダごと渡す',
}

/** 名前ではなく道具の決まりで読まれるファイル。 */
export const KEEP_FILES = {
  '.gitignore': 'git が読む',
  '.firebaserc': 'firebase のコマンドが読む（.github/workflows/firebase-rules.yml の公開）',
}

/** 2026-10-20 に消したファイル。どこからも使われておらず、消してもアプリ・テスト・道具に何も起きないことを確かめた。 */
export const REMOVED = {
  'src/assets/rpg-battle-vignette.jpg': 'どのファイルからも読み込まれない画像',
  'src/components/BattleOpponentStandingActor.jsx': 'どこからも読み込まれない部品（テストは「使っていないこと」だけを見ていた）',
  'src/components/BattleStageBackdrop.jsx': 'どこからも読み込まれない部品',
  'src/components/HeroPortrait.jsx': 'どこからも読み込まれない部品',
  'src/lib/etymologyCompanions.js': 'どこからも読み込まれないモジュール',
  'src/lib/etymologyMeaning.js': 'どこからも読み込まれないモジュール',
  'src/lib/reading-phrase-review.js': 'どこからも読み込まれないモジュール',
  'public/assets/battle/fullbody/rivals/math-takagi.png': 'コードが組み立てない画像（敵の全身画像のパスは作らない）',
  'public/assets/battle/pixel/art-stage.webp': 'コードが組み立てない画像',
  'public/assets/battle/pixel/library-stage.webp': 'コードが組み立てない画像',
  'public/assets/battle/pixel/music-stage.webp': 'コードが組み立てない画像',
  'public/assets/battle/scenes/classroom-v2.webp': 'コードが組み立てない画像（教室の場面は classroom-v3.webp）',
  'public/assets/battle/scenes/park.webp': 'コードが組み立てない画像（公園の場面は外した）',
  'public/assets/battle/world/barrier-district.webp': 'コードが組み立てない画像（地図は dragon-vein-district.webp）',
  'public/assets/battle/world/barrier-district-night-v2.webp': 'コードが組み立てない画像',
}

const BINARY = /\.(png|jpe?g|webp|webm|gif|ico|onnx|tar|woff2?|ttf|mp3|wav|pdf|xlsx)$/i
const CODE = /\.(m?jsx?|css)$/
// 自分と、消したことを書いた依頼台帳は、消したファイルの名前を書いてよい。
const SELF = 'scripts/checks/unused-files.mjs'
const REMOVED_LEDGER = 'requests/2026-10-20-remove-unused-files.json'

function trackedFiles() {
  return execSync('git ls-files', { cwd: ROOT, encoding: 'utf8' }).trim().split('\n')
    .filter((file) => existsSync(join(ROOT, file)))
}

/** ファイル名・パスらしい語ごとに、それを書いたファイル（2件まで）を集める。 */
function nameIndex(texts) {
  const index = new Map()
  for (const [file, text] of texts) {
    for (const token of new Set(text.match(/[\w@.\-/]+\.[A-Za-z0-9]+/g) ?? [])) {
      const names = new Set([token, basename(token)])
      for (const part of token.split('/')) if (part.includes('.')) names.add(part)
      for (const name of names) {
        const writers = index.get(name) ?? []
        if (writers.length < 2 && !writers.includes(file)) writers.push(file)
        index.set(name, writers)
      }
    }
  }
  return index
}

const namedElsewhere = (index, file) => {
  const writers = [...(index.get(file) ?? []), ...(index.get(basename(file)) ?? [])]
  return writers.some((writer) => writer !== file)
}

function resolveImport(set, from, spec) {
  if (!spec.startsWith('.') && !spec.startsWith('/')) return null
  const base = spec.startsWith('/') ? spec.slice(1) : posix.join(posix.dirname(from), spec)
  const path = base.split('?')[0]
  for (const candidate of [path, `${path}.js`, `${path}.jsx`, `${path}.mjs`, `${path}/index.js`, `${path}/index.jsx`]) {
    if (set.has(candidate)) return candidate
  }
  return null
}

const IMPORT_PATTERN = /(?:import|export)\s[^'"]*?from\s*['"]([^'"]+)['"]|import\s*\(\s*['"`]([^'"`$]+)['"`]|import\s*['"]([^'"]+)['"]|new URL\(\s*['"`]([^'"`$]+)['"`]\s*,\s*import\.meta\.url|@import\s+['"]([^'"]+)['"]|<script[^>]+src=["']([^"']+)["']/g

/** ① 入口から import をたどって届くコードのファイル。 */
function reachableCode(files, texts) {
  const set = new Set(files)
  const roots = files.filter((file) => file === 'src/main.jsx' || file === 'index.html' || file === 'vite.config.js'
    || (/^(tests|scripts)\//.test(file) && /\.m?js$/.test(file)))
  const seen = new Set(roots)
  const queue = [...roots]
  while (queue.length) {
    const file = queue.pop()
    const text = texts.get(file)
    if (!text || !(CODE.test(file) || file.endsWith('.html'))) continue
    for (const match of text.matchAll(IMPORT_PATTERN)) {
      const spec = match.slice(1).find(Boolean)
      const target = resolveImport(set, file, spec)
      if (target && !seen.has(target)) {
        seen.add(target)
        queue.push(target)
      }
    }
  }
  return seen
}

/** ② アプリのコードが組み立てる public のパス（先頭の / なし）。 */
async function builtAssetPaths(files, texts) {
  const paths = new Set()
  const add = (value) => {
    if (typeof value !== 'string') return
    const match = value.match(/assets\/[^\s'"`)]+/)
    if (match) paths.add(match[0])
  }
  const seen = new Set()
  const walk = (value, depth = 0) => {
    if (value == null || depth > 8) return
    if (typeof value === 'string') return add(value)
    if (typeof value !== 'object' || seen.has(value)) return
    seen.add(value)
    if (value instanceof Map || value instanceof Set) for (const item of value.values()) walk(item, depth + 1)
    for (const key of Object.keys(value)) walk(value[key], depth + 1)
  }
  const modules = files.filter((file) => /^src\/.*\.js$/.test(file) && texts.get(file)?.includes('publicAssetUrl('))
  const loaded = {}
  for (const file of modules) {
    loaded[file] = await import(pathToFileURL(join(ROOT, file)))
    walk(loaded[file])
  }
  const cast = loaded['src/lib/battleCast.js']
  if (cast) {
    for (const student of cast.BATTLE_STUDENTS) {
      for (const emotion of cast.BATTLE_EMOTION_STATES) {
        add(cast.battleStudentPortrait(student.id, emotion.id))
        add(cast.battleStudentMotion(student.id, emotion.id))
      }
      for (const outfit of cast.BATTLE_LIFESTYLE_OUTFITS) add(cast.battleStudentLifestylePortrait(student.id, outfit.id ?? outfit))
    }
  }
  for (const file of files.filter((item) => /^src\//.test(item) && CODE.test(item))) {
    for (const match of texts.get(file).matchAll(/assets\/[\w./-]+\.(?:webp|png|webm|jpe?g|svg|mp3)/g)) paths.add(match[0])
  }
  return paths
}

const usageComment = (file, text) => {
  const head = text.split('\n').slice(0, 15).join('\n')
  return head.includes(`node ${file}`)
}

export async function surveyUnusedFiles() {
  const files = trackedFiles()
  const texts = new Map(files.filter((file) => !BINARY.test(file)).map((file) => [file, readFileSync(join(ROOT, file), 'utf8')]))
  const index = nameIndex(texts)
  const reachable = reachableCode(files, texts)
  const assets = await builtAssetPaths(files, texts)
  const reasons = new Map()
  const unused = []
  for (const file of files) {
    const dir = Object.keys(KEEP_DIRS).find((prefix) => file.startsWith(prefix))
    let reason = null
    if (reachable.has(file)) reason = 'import でたどれる'
    else if (/^src\//.test(file) && CODE.test(file)) reason = null
    else if (file.startsWith('public/') && assets.has(file.slice('public/'.length))) reason = 'アプリが組み立てる画像のパス'
    else if (dir) reason = KEEP_DIRS[dir]
    else if (KEEP_FILES[file]) reason = KEEP_FILES[file]
    else if (/^(docs\/.*|[^/]+)\.md$/.test(file)) reason = '人が読む文書（設計・監査の記録）'
    else if (/^tests\/.*\.test\.mjs$/.test(file)) reason = 'npm test が全部動かす'
    else if (namedElsewhere(index, file)) reason = 'ほかのファイルに名前が出る'
    else if (/^scripts\//.test(file) && texts.has(file) && usageComment(file, texts.get(file))) reason = '手で動かす道具（先頭に使い方）'
    if (reason) reasons.set(file, reason)
    else unused.push(file)
  }
  const removedBack = Object.keys(REMOVED).filter((file) => existsSync(join(ROOT, file)))
  // 消したファイルの名指しは、public の画像は public からのパス（assets/battle/fullbody/rivals/math-takagi.png）、
  // ほかはフォルダ名つきの名前（コードは拡張子なしの components/HeroPortrait も）で探す。
  // ファイル名だけだと、同じ名前の別のファイル（standing/rivals/math-takagi.png）まで拾う。
  const removedNamed = []
  for (const file of Object.keys(REMOVED)) {
    const tail = file.startsWith('public/') ? file.slice('public/'.length) : file.split('/').slice(-2).join('/')
    const needles = CODE.test(file) ? [tail.replace(/\.[^.]+$/, '')] : [tail]
    const writers = [...texts].filter(([writer, text]) => writer !== SELF && writer !== REMOVED_LEDGER
      && needles.some((needle) => new RegExp(`(^|[^\\w-])${needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\w-])`).test(text)))
      .map(([writer]) => writer)
    if (writers.length) removedNamed.push(`${file} ← ${writers.join(', ')}`)
  }
  return { files, reasons, unused, removedBack, removedNamed }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { files, reasons, unused, removedBack, removedNamed } = await surveyUnusedFiles()
  const counts = {}
  for (const reason of reasons.values()) counts[reason] = (counts[reason] ?? 0) + 1
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify({ files: files.length, counts, unused, removedBack, removedNamed }, null, 2))
  } else {
    console.log(`追跡ファイル ${files.length}件`)
    for (const [reason, count] of Object.entries(counts).sort((a, b) => b[1] - a[1])) console.log(`  ${count}件 ${reason}`)
    console.log(`使われていない ${unused.length}件${unused.length ? `\n  ${unused.join('\n  ')}` : ''}`)
    if (removedBack.length) console.log(`消したのに戻ったファイル:\n  ${removedBack.join('\n  ')}`)
    if (removedNamed.length) console.log(`消したのに名指しされている:\n  ${removedNamed.join('\n  ')}`)
  }
  process.exit(unused.length || removedBack.length || removedNamed.length ? 1 : 0)
}
