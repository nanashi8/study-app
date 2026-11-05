// テストの結果の控え。node --test の子プロセスへ NODE_OPTIONS=--import で読み込む。
// テスト1ファイルごとに「実際に読んだファイル」を記録し、合格したら中身のハッシュと一緒に控える。
// 次に流すとき、読んだファイルが1つも変わっていなければ、前回の合格をそのまま使って流さない。
// 外から入るもの（git などのコマンド）を使ったテストは、読んだものが分からないので控えない（毎回流す）。
import { createRequire, registerHooks, syncBuiltinESMExports } from 'node:module'
import { tmpdir } from 'node:os'
import { join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  appendHit, appendMiss, currentRecord, envSignature, evaluateRecord, GENERATED, loadTraces, removeRecord, saveRecord, saveTrace,
  usesTemp,
} from './store.mjs'
import { treeState } from './tree.mjs'

const require = createRequire(import.meta.url)
const fs = require('node:fs')
const childProcess = require('node:child_process')

// node はテストのファイルの場所を本当の場所（/var → /private/var など）で渡すので、ROOT もそろえる。
const ROOT = process.env.AUDIT_TEST_ROOT && fs.realpathSync(process.env.AUDIT_TEST_ROOT)
const CACHE_DIR = process.env.AUDIT_TEST_CACHE_DIR
const USE_CACHE = process.env.AUDIT_TEST_USE_CACHE === '1'
const HIT_LOG = process.env.AUDIT_TEST_HIT_LOG
const MISS_LOG = process.env.AUDIT_TEST_MISS_LOG
// 作業ツリーの指紋を取る git は、テストの記録（読んだものが分からない印）に入れない。包む前の関数を取っておく。
const rawSpawnSync = childProcess.spawnSync
const { mkdtempSync, readdirSync, rmSync } = fs

const isTestChild = !process.env.AUDIT_TEST_OWNER
  && process.env.NODE_TEST_CONTEXT === 'child-v8'
  && Boolean(process.argv[1])
  && relative(ROOT ?? '', resolve(process.argv[1])).startsWith('tests')

if (ROOT && CACHE_DIR && (isTestChild || process.env.AUDIT_TEST_OWNER)) start()

function start() {
  const startedAt = Date.now()
  if (isTestChild) {
    const owner = relative(ROOT, resolve(process.argv[1])).split('\\').join('/')
    const signature = envSignature(ROOT)
    let before
    const state = () => (before ??= treeState(ROOT, rawSpawnSync))
    if (USE_CACHE) {
      const verdict = evaluateRecord({ root: ROOT, record: currentRecord(CACHE_DIR, owner), signature, now: startedAt, state })
      if (verdict.hit) {
        appendHit(HIT_LOG, owner)
        process.exit(0)
      }
      appendMiss(MISS_LOG, owner, verdict.reason)
    }
    const source = fs.readFileSync(process.argv[1], 'utf8')
    // 流す前の作業ツリーの指紋（読んだものが分からないテストは、終わったときの指紋と同じなら控える）。包む前に取る。
    state()
    process.env.AUDIT_TEST_OWNER = owner
    process.env.AUDIT_TEST_TRACE_DIR = mkdtempSync(join(tmpdir(), 'study-app-test-trace-'))
    // 一時フォルダを使うテストは、空の一時フォルダ（TMPDIR）で流し、終わったときに何も残っていないことを確かめる。
    // 2026-09-28、使い捨てのリポジトリ 112個・台帳のフォルダ 169個がたまっていた。前は tests/test-temp-cleanup.test.mjs が
    // そのテストを子としてもう一度流していた（約160秒。2026-11-05 にこちらへ移した）。
    const realTmp = process.env.TMPDIR
    const privateTmp = usesTemp(source) ? mkdtempSync(join(tmpdir(), 'study-app-test-tmp-')) : null
    if (privateTmp) process.env.TMPDIR = `${privateTmp}/`
    const trace = installTrace()
    // vite の build は Rust の中でファイルを読むので、読んだものが分からない。
    if (/\bbuild\(\{/.test(source)) trace.uncacheable.add('vite build')
    process.on('exit', (code) => {
      if (privateTmp) {
        const left = readdirSync(privateTmp)
        rmSync(privateTmp, { recursive: true, force: true })
        if (realTmp === undefined) delete process.env.TMPDIR
        else process.env.TMPDIR = realTmp
        if (left.length) {
          console.error(`\n${owner} が一時フォルダに作ったものを消さずに終わった：${left.slice(0, 10).join('、')}${left.length > 10 ? ` ほか${left.length - 10}件` : ''}`)
          process.exitCode = 1
        }
      }
      const merged = loadTraces(process.env.AUDIT_TEST_TRACE_DIR, trace)
      if (code !== 0 || process.exitCode) {
        removeRecord(CACHE_DIR, owner)
        return
      }
      saveRecord({
        root: ROOT, cacheDir: CACHE_DIR, owner, signature, trace: merged, startedAt,
        state: { before, after: () => treeState(ROOT, rawSpawnSync) },
      })
    })
    return
  }
  const trace = installTrace()
  process.on('exit', () => saveTrace(process.env.AUDIT_TEST_TRACE_DIR, trace))
}

function installTrace() {
  const trace = { read: new Set(), stat: new Set(), list: new Set(), rlist: new Set(), uncacheable: new Set() }
  const inside = (value) => {
    let text
    try {
      if (typeof value === 'string') text = value
      else if (value instanceof URL) text = fileURLToPath(value)
      else if (Buffer.isBuffer(value)) text = value.toString()
      else return null
    } catch {
      return null
    }
    const rel = relative(ROOT, resolve(text))
    if (rel.startsWith('..') || GENERATED.test(rel)) return null
    return rel === '' ? '.' : rel
  }
  const note = (set, value) => {
    const rel = inside(value)
    if (rel) set.add(rel)
  }

  registerHooks({
    load(url, context, next) {
      if (url.startsWith('file:')) note(trace.read, new URL(url))
      return next(url, context)
    },
  })

  const wrap = (target, names, record) => {
    for (const name of names) {
      const original = target[name]
      if (typeof original !== 'function') continue
      target[name] = function traced(...args) {
        record(args)
        return original.apply(this, args)
      }
      Object.assign(target[name], original)
    }
  }
  const noteRead = ([path]) => note(trace.read, path)
  // 開発サーバーのファイル監視は全フォルダを見て回るだけで、テストの結果には関わらない。
  const fromWatcher = () => /ReaddirpStream|NodeFsHandler|FSWatcher/.test(new Error().stack)
  const noteStat = ([path]) => {
    if (!fromWatcher()) note(trace.stat, path)
  }
  const noteList = ([path, options]) => {
    if (!fromWatcher()) note(options?.recursive ? trace.rlist : trace.list, path)
  }
  const noteGlob = ([pattern]) => trace.uncacheable.add(`glob ${pattern}`)
  wrap(fs, ['readFileSync', 'readFile', 'createReadStream', 'openSync', 'open'], noteRead)
  wrap(fs, ['statSync', 'stat', 'lstatSync', 'lstat', 'existsSync', 'exists', 'accessSync', 'access', 'realpathSync', 'realpath'], noteStat)
  wrap(fs, ['readdirSync', 'readdir', 'opendirSync', 'opendir'], noteList)
  wrap(fs, ['globSync', 'glob'], noteGlob)
  wrap(fs.promises, ['readFile', 'open'], noteRead)
  wrap(fs.promises, ['stat', 'lstat', 'access', 'realpath'], noteStat)
  wrap(fs.promises, ['readdir', 'opendir'], noteList)
  wrap(fs.promises, ['glob'], noteGlob)
  syncBuiltinESMExports()

  // node 以外のコマンドは読んだものが分からない。ブラウザの本体だけはリポジトリを読まない（画面は開発サーバー経由で traced）。
  const isBrowser = (command) => /ms-playwright|chrome|chromium|webkit|firefox/i.test(command)
  const isNode = (command) => command === process.execPath || /^node(\s|$)/.test(command)
  const noteSpawn = (command, options) => {
    const text = String(command ?? '')
    if (isBrowser(text)) return
    if (isNode(text) && !/[;&|]/.test(text) && (!options?.env || options.env.NODE_OPTIONS)) return
    trace.uncacheable.add(`command ${text.split(/\s+/)[0]}`)
  }
  const optionsOf = (args) => args.find((arg) => arg && typeof arg === 'object' && !Array.isArray(arg))
  wrap(childProcess, ['spawn', 'spawnSync', 'exec', 'execSync', 'execFile', 'execFileSync'], (args) => noteSpawn(args[0], optionsOf(args)))
  wrap(childProcess, ['fork'], (args) => {
    const options = optionsOf(args)
    if (options?.env && !options.env.NODE_OPTIONS) trace.uncacheable.add('command fork')
  })
  syncBuiltinESMExports()
  return trace
}
