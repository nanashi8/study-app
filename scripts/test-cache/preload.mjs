// テストの結果の控え。node --test の子プロセスへ NODE_OPTIONS=--import で読み込む。
// テスト1ファイルごとに「実際に読んだファイル」を記録し、合格したら中身のハッシュと一緒に控える。
// 次に流すとき、読んだファイルが1つも変わっていなければ、前回の合格をそのまま使って流さない。
// 外から入るもの（git などのコマンド）を使ったテストは、読んだものが分からないので控えない（毎回流す）。
import { createRequire, registerHooks, syncBuiltinESMExports } from 'node:module'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  appendHit, currentRecord, envSignature, evaluateRecord, loadTraces, removeRecord, saveRecord, saveTrace,
} from './store.mjs'

const require = createRequire(import.meta.url)
const fs = require('node:fs')
const childProcess = require('node:child_process')

const ROOT = process.env.AUDIT_TEST_ROOT
const CACHE_DIR = process.env.AUDIT_TEST_CACHE_DIR
const USE_CACHE = process.env.AUDIT_TEST_USE_CACHE === '1'
const HIT_LOG = process.env.AUDIT_TEST_HIT_LOG

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
    if (USE_CACHE) {
      const verdict = evaluateRecord({ root: ROOT, record: currentRecord(CACHE_DIR, owner), signature, now: startedAt, runId: process.env.AUDIT_TEST_RUN_ID })
      if (verdict.hit) {
        appendHit(HIT_LOG, owner)
        process.exit(0)
      }
    }
    process.env.AUDIT_TEST_OWNER = owner
    process.env.AUDIT_TEST_TRACE_DIR = mkdtempSync(join(tmpdir(), 'study-app-test-trace-'))
    const trace = installTrace()
    // vite の build は Rust の中でファイルを読むので、読んだものが分からない。
    if (/\bbuild\(\{/.test(fs.readFileSync(process.argv[1], 'utf8'))) trace.uncacheable.add('vite build')
    process.on('exit', (code) => {
      const merged = loadTraces(process.env.AUDIT_TEST_TRACE_DIR, trace)
      if (code !== 0 || process.exitCode) {
        removeRecord(CACHE_DIR, owner)
        return
      }
      saveRecord({ root: ROOT, cacheDir: CACHE_DIR, owner, signature, trace: merged, startedAt, runId: process.env.AUDIT_TEST_RUN_ID })
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
    if (rel.startsWith('..') || /^(node_modules|\.git|dist)(\/|$)/.test(rel)) return null
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
