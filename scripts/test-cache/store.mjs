// テストの結果の控えの読み書き。控えは「テスト1ファイル→読んだファイルとそのハッシュ」。
// ハッシュで比べるので、枝や clone が違っても、読んだものが同じなら同じ結果とみなせる。
import { createHash } from 'node:crypto'
import {
  appendFileSync, existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, statSync, writeFileSync,
} from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { needsGitState } from './tree.mjs'

// 合格の控えを使える長さ。日付で変わるテストや、たまに落ちるテストを見逃し続けないよう、1日で流し直す。
export const RECORD_TTL_MS = 24 * 60 * 60 * 1000
// 控えの形や道具を変えたら、前の控えを使わない。
const TOOL_FILES = ['store.mjs', 'preload.mjs', 'tree.mjs'].map((name) => fileURLToPath(new URL(name, import.meta.url)))

const sha = (value) => createHash('sha256').update(value).digest('hex').slice(0, 32)
export const keyFor = (owner) => sha(owner)
const recordPath = (cacheDir, owner) => join(cacheDir, `${keyFor(owner)}.json`)

/** テストの結果が変わりうる、ファイルの外のもの（Node の版・機械・依存パッケージ・この道具）。 */
export function envSignature(root) {
  const lock = readFileSync(join(root, 'package-lock.json'))
  const tools = TOOL_FILES.map((file) => readFileSync(file))
  return sha(JSON.stringify([process.version, process.platform, process.arch, sha(lock), tools.map(sha)]))
}

// 1本のテストにつき、中身の違う控えを RECORDS_PER_TEST 件まで持つ。作業ツリーと検証用の clone のように中身の違う所で
// 交互に流すと、1件だけでは上書きし合って毎回流し直しになった（2026-11-03）。
export const RECORDS_PER_TEST = 8

/** そのテストの控えの並び（新しい順）。 */
export function currentRecord(cacheDir, owner) {
  try {
    const stored = JSON.parse(readFileSync(recordPath(cacheDir, owner), 'utf8'))
    return Array.isArray(stored.records) ? stored.records : []
  } catch {
    return []
  }
}

const fileHash = (root, rel) => {
  try {
    return sha(readFileSync(join(root, rel)))
  } catch {
    return 'missing'
  }
}
const existence = (root, rel) => (existsSync(join(root, rel)) ? 'exists' : 'missing')
// 作られるもの・道具が置くもの。テストの結果に関わらないので、読んだファイルにもフォルダの一覧にも入れない。
// 2026-11-05、全監査の vite build が検証用の clone に dist/ を作り、いちばん上のフォルダの一覧を読む画面のテスト
// 約27本が、中身は同じなのに次の全監査で流し直しになっていた。
export const GENERATED = /^(node_modules|\.git|dist|dist-ssr)(\/|$)|(^|\/)(node_modules|\.DS_Store)(\/|$)/
const listing = (root, rel, recursive) => {
  try {
    const entries = readdirSync(join(root, rel), { recursive }).map(String)
    return sha(entries.filter((entry) => !GENERATED.test(rel === '.' ? entry : `${rel}/${entry}`)).sort().join('\n'))
  } catch {
    return 'missing'
  }
}
const READERS = {
  read: fileHash,
  stat: existence,
  list: (root, rel) => listing(root, rel, false),
  rlist: (root, rel) => listing(root, rel, true),
}

/**
 * 控えが今も使えるか。使えないときは、どのファイルが変わったかを返す。
 * state：今の作業ツリーの指紋を返す関数（tree.mjs の treeState。読んだものが分からないテストの控えを比べるときだけ呼ぶ）。
 */
export function evaluateRecord({ root, record, signature, now, state = () => null }) {
  // 控えの並びを渡されたら、どれか1件が使えれば使う。
  if (Array.isArray(record)) {
    if (!record.length) return { hit: false, reason: '控えなし' }
    const verdicts = record.map((item) => evaluateRecord({ root, record: item, signature, now, state }))
    return verdicts.find((verdict) => verdict.hit) ?? verdicts[0]
  }
  if (!record) return { hit: false, reason: '控えなし' }
  if (record.signature !== signature) return { hit: false, reason: '環境が変わった' }
  if (now - record.passedAt > RECORD_TTL_MS) return { hit: false, reason: '1日たった' }
  // 読んだものが分からないテストの控えは、作業ツリーの中身（git を使うテストは HEAD と index も）が同じときだけ使う。
  if (record.tree) {
    const current = state()
    if (!current || current.tree !== record.tree) return { hit: false, reason: '読んだものが分からないテストで、作業ツリーの中身が前回の合格と違う' }
    if (record.git && current.git !== record.git) return { hit: false, reason: 'git を読むテストで、HEAD か index が前回の合格と違う' }
    return { hit: true }
  }
  for (const [kind, entries] of Object.entries(record.deps)) {
    for (const [rel, expected] of Object.entries(entries)) {
      if (READERS[kind](root, rel) !== expected) return { hit: false, reason: `${rel} が変わった` }
    }
  }
  return { hit: true }
}

// 控えを足す（同じ中身の古い控えと、使えなくなった控えは外す）。
function addRecord(cacheDir, owner, record) {
  const key = JSON.stringify([record.tree ?? null, record.git ?? null, record.deps])
  const kept = currentRecord(cacheDir, owner)
    .filter((item) => item.signature === record.signature && record.passedAt - item.passedAt <= RECORD_TTL_MS)
    .filter((item) => JSON.stringify([item.tree ?? null, item.git ?? null, item.deps]) !== key)
  writeAtomic(recordPath(cacheDir, owner), JSON.stringify({ owner, records: [record, ...kept].slice(0, RECORDS_PER_TEST) }))
}

/**
 * state：流し始めたときと終わったときの作業ツリーの指紋（tree.mjs の treeState）。読んだものが分からないテストは、
 * 2つが同じとき（流している間に誰も中身を変えなかったとき）だけ、その指紋で控える。
 */
export function saveRecord({ root, cacheDir, owner, signature, trace, startedAt, state }) {
  // 読んだものが分からないテスト：node 以外のコマンドを使った・ビルドは Rust の中で読む。読んだファイルで比べられないので、
  // 作業ツリーの中身の指紋で控える（全監査で通ったものを commit・push の前の確認で流し直さない。2026-11-05）。
  if (trace.uncacheable.size) {
    const reasons = [...trace.uncacheable]
    saveUncacheable(cacheDir, owner, reasons)
    const before = state?.before
    const after = state?.after?.()
    if (!before || !after || before.tree !== after.tree || before.git !== after.git) return
    addRecord(cacheDir, owner, { owner, signature, passedAt: Date.now(), tree: before.tree, git: needsGitState(reasons) ? before.git : undefined, deps: {} })
    return
  }
  const deps = {}
  for (const kind of Object.keys(READERS)) {
    deps[kind] = {}
    for (const rel of [...trace[kind]].sort()) {
      if (kind === 'read') {
        // 流している間に書き換わった（別のセッションの編集など）なら、どの中身で合格したか分からない。
        try {
          if (statSync(join(root, rel)).mtimeMs > startedAt) return
        } catch {
          // 消えたファイルは下で missing として控える。
        }
      }
      deps[kind][rel] = READERS[kind](root, rel)
    }
  }
  addRecord(cacheDir, owner, { owner, signature, passedAt: Date.now(), deps })
}

// 落ちたテストは、どの中身の控えも捨てる（同じ中身でまた落ちるかもしれない）。
export const removeRecord = (cacheDir, owner) => rmSync(recordPath(cacheDir, owner), { force: true })

const uncacheablePath = (cacheDir) => join(cacheDir, 'uncacheable')
function saveUncacheable(cacheDir, owner, reasons) {
  mkdirSync(uncacheablePath(cacheDir), { recursive: true })
  writeFileSync(join(uncacheablePath(cacheDir), `${keyFor(owner)}.json`), JSON.stringify({ owner, reasons }))
}

function writeAtomic(path, text) {
  const dir = path.slice(0, path.lastIndexOf('/'))
  mkdirSync(dir, { recursive: true })
  const temp = `${path}.${process.pid}.tmp`
  writeFileSync(temp, text)
  renameSync(temp, path)
}

/** テストの子が動かした node（スクリプト）の記録。テスト本体の合格のときに合わせて控える。 */
export function saveTrace(dir, trace) {
  if (!dir) return
  try {
    writeFileSync(join(dir, `${process.pid}.json`), JSON.stringify(Object.fromEntries(Object.entries(trace).map(([key, set]) => [key, [...set]]))))
  } catch {
    // テスト本体が先に終わって片付けた後：残っていた子の記録は控えに入らない。
  }
}

export function loadTraces(dir, trace) {
  for (const name of readdirSync(dir)) {
    const child = JSON.parse(readFileSync(join(dir, name), 'utf8'))
    for (const [key, values] of Object.entries(child)) values.forEach((value) => trace[key].add(value))
  }
  rmSync(dir, { recursive: true, force: true })
  return trace
}

export const appendHit = (path, owner) => {
  if (path) appendFileSync(path, `${owner}\n`)
}

/** 控えが使えずに流したテストと、その理由（scripts/run-tests.mjs と commit・push の前の確認が最後にまとめて出す）。 */
export const appendMiss = (path, owner, reason) => {
  if (path) appendFileSync(path, `${owner}\t${reason}\n`)
}

/** 流し直した理由ごとに、テストの数と名前をまとめた行。 */
export function missSummary(path, { limit = 6 } = {}) {
  let lines = []
  try {
    lines = readFileSync(path, 'utf8').trim().split('\n').filter(Boolean)
  } catch {
    return []
  }
  const byReason = new Map()
  for (const line of lines) {
    const [owner, reason] = line.split('\t')
    if (!byReason.has(reason)) byReason.set(reason, [])
    byReason.get(reason).push(owner.replace(/^tests\//, '').replace(/\.test\.mjs$/, ''))
  }
  return [...byReason].sort((a, b) => b[1].length - a[1].length)
    .map(([reason, owners]) => `  ${owners.length}本 ${reason}：${owners.slice(0, limit).join('・')}${owners.length > limit ? ` ほか${owners.length - limit}本` : ''}`)
}

// 一時フォルダを使うテスト：tmpdir() か mkdtemp を呼ぶファイル。preload.mjs が空の一時フォルダで流し、後始末を確かめる。
export const USES_TEMP = /\btmpdir\(\)|\bmkdtemp(?:Sync)?\(/
export const usesTemp = (source) => USES_TEMP.test(source)
