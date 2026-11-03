// テストの結果の控えの読み書き。控えは「テスト1ファイル→読んだファイルとそのハッシュ」。
// ハッシュで比べるので、枝や clone が違っても、読んだものが同じなら同じ結果とみなせる。
import { createHash } from 'node:crypto'
import {
  appendFileSync, existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, statSync, writeFileSync,
} from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

// 合格の控えを使える長さ。日付で変わるテストや、たまに落ちるテストを見逃し続けないよう、1日で流し直す。
export const RECORD_TTL_MS = 24 * 60 * 60 * 1000
// 控えの形や道具を変えたら、前の控えを使わない。
const TOOL_FILES = ['store.mjs', 'preload.mjs'].map((name) => fileURLToPath(new URL(name, import.meta.url)))

const sha = (value) => createHash('sha256').update(value).digest('hex').slice(0, 32)
export const keyFor = (owner) => sha(owner)
const recordPath = (cacheDir, owner) => join(cacheDir, `${keyFor(owner)}.json`)

/** テストの結果が変わりうる、ファイルの外のもの（Node の版・機械・依存パッケージ・この道具）。 */
export function envSignature(root) {
  const lock = readFileSync(join(root, 'package-lock.json'))
  const tools = TOOL_FILES.map((file) => readFileSync(file))
  return sha(JSON.stringify([process.version, process.platform, process.arch, sha(lock), tools.map(sha)]))
}

export function currentRecord(cacheDir, owner) {
  try {
    return JSON.parse(readFileSync(recordPath(cacheDir, owner), 'utf8'))
  } catch {
    return null
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
const listing = (root, rel, recursive) => {
  try {
    return sha(readdirSync(join(root, rel), { recursive }).map(String).sort().join('\n'))
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

/** 控えが今も使えるか。使えないときは、どのファイルが変わったかを返す。 */
export function evaluateRecord({ root, record, signature, now, runId }) {
  if (!record) return { hit: false, reason: '控えなし' }
  // 読んだものが分からないテストの控えは、同じ1回の確認（commit・push の前の確認）の中でだけ使う。
  if (record.runId) return record.runId === runId ? { hit: true } : { hit: false, reason: '別の回の確認' }
  if (record.signature !== signature) return { hit: false, reason: '環境が変わった' }
  if (now - record.passedAt > RECORD_TTL_MS) return { hit: false, reason: '1日たった' }
  for (const [kind, entries] of Object.entries(record.deps)) {
    for (const [rel, expected] of Object.entries(entries)) {
      if (READERS[kind](root, rel) !== expected) return { hit: false, reason: `${rel} が変わった` }
    }
  }
  return { hit: true }
}

export function saveRecord({ root, cacheDir, owner, signature, trace, startedAt, runId }) {
  removeRecord(cacheDir, owner)
  // 控えないテスト：node 以外のコマンドを使った・ビルドは Rust の中で読むので読んだものが分からない。
  // ただし commit・push の前の確認は、作業ツリーが変わらない1回の中で同じテストを何度も呼ぶ（いくつもの条件の check が
  // 同じテストを流す）ので、その回の中でだけ使う控えを残す（2026-11-03、本番ビルドのテストを1回の commit で何度も流していた）。
  if (trace.uncacheable.size) {
    saveUncacheable(cacheDir, owner, [...trace.uncacheable])
    if (runId) writeAtomic(recordPath(cacheDir, owner), JSON.stringify({ owner, signature, passedAt: Date.now(), runId, deps: {} }))
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
  writeAtomic(recordPath(cacheDir, owner), JSON.stringify({ owner, signature, passedAt: Date.now(), deps }))
}

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
