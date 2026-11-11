// 公開のビルドが、写真の読み取りのモデルの取り寄せの一時的な失敗で落ちない（requests/2026-11-11-audit-leftovers-fix.json）。
// 2026-11-10、公開の自動処理（run 42768524753）が取り寄せの時間切れ（fetch failed・ETIMEDOUT）で落ちた。
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { FETCH_ATTEMPTS, FETCH_TIMEOUT_MS, OCR_MODELS, fetchWithRetry } from '../scripts/ocr-models.mjs'

const ok = (text) => ({ ok: true, status: 200, arrayBuffer: async () => new TextEncoder().encode(text).buffer })
const timedOut = () => Object.assign(new TypeError('fetch failed'), { cause: Object.assign(new Error('connect'), { code: 'ETIMEDOUT' }) })

test('つながらない・時間切れ・200 以外が続いても、やり直して取り込む', async () => {
  const replies = [() => { throw timedOut() }, () => ({ ok: false, status: 503 }), () => ok('model')]
  const waits = []
  const logs = []
  const signals = []
  const buffer = await fetchWithRetry('https://example.invalid/m.tar', {
    fetchImpl: async (url, options) => { signals.push(options.signal); return replies.shift()() },
    wait: async (ms) => waits.push(ms),
    log: (line) => logs.push(line),
  })
  assert.equal(buffer.toString(), 'model')
  assert.deepEqual(waits, [5_000, 20_000])
  assert.match(logs[0], /1回目：fetch failed・ETIMEDOUT）。5秒後にやり直す/)
  assert.match(logs[1], /2回目：503）。20秒後にやり直す/)
  // 1回ごとに時間を区切る。
  assert.ok(signals.every((signal) => signal instanceof AbortSignal))
})

test('決めた回数だけ試してもだめなら、理由を全部つけて失敗にする', async () => {
  let calls = 0
  await assert.rejects(
    fetchWithRetry('https://example.invalid/m.tar', { fetchImpl: async () => { calls++; throw timedOut() }, wait: async () => {}, log: () => {} }),
    /を 4回 試して取り込めない（fetch failed・ETIMEDOUT \/ fetch failed・ETIMEDOUT \/ fetch failed・ETIMEDOUT \/ fetch failed・ETIMEDOUT）/,
  )
  assert.equal(calls, FETCH_ATTEMPTS)
})

test('取り寄せるモデルの全ファイル（det・rec）が、やり直しのある取り寄せを通る', () => {
  assert.deepEqual(OCR_MODELS.map((model) => model.kind), ['det', 'rec'])
  assert.ok(FETCH_ATTEMPTS >= 3 && FETCH_TIMEOUT_MS >= 60_000)
  const source = readFileSync('scripts/ocr-models.mjs', 'utf8')
  const body = source.slice(source.indexOf('export async function ensureOcrModels'))
  assert.match(body, /await fetchWithRetry\(`\$\{SOURCE\}\$\{model\.file\}`\)/)
  // fetchWithRetry のほかに、じかに取り寄せる所がない。
  assert.equal(source.match(/\bawait fetch(?:Impl)?\(/g)?.length, 1)
})
