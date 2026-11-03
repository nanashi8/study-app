#!/usr/bin/env node

import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { acquireTestLock } from './test-cache/lock.mjs'

const ROOT = fileURLToPath(new URL('..', import.meta.url))

// --full：全テストを流す。ふだんは変更に関係するテストだけ（読むファイルが前回の合格から変わったテスト）を流す。
const testArgs = ['scripts/run-tests.mjs', ...(process.argv.includes('--full') ? ['--full'] : [])]

const steps = [
  [process.execPath, testArgs],
  ['npm', ['run', 'check:content']],
  ['npm', ['exec', '--', 'vite', 'build']],
  ['npm', ['run', 'audit:dist']],
  ['git', ['diff', '--check']],
]

// 機械全体で1つずつ流す（scripts/test-cache/lock.mjs）。段ごとの時間を最後にまとめて出す。
acquireTestLock('全教材監査')
const auditStartedAt = Date.now()
const timings = []
const elapsed = (from) => `${Math.round((Date.now() - from) / 1000)}秒`
process.on('exit', () => {
  if (timings.length) console.log(`\n⏱ 全教材監査の時間：${timings.join('・')}・合計 ${elapsed(auditStartedAt)}`)
})

for (const [command, args] of steps) {
  console.log(`\n▶ ${command} ${args.join(' ')}`)
  const stepStartedAt = Date.now()
  const result = spawnSync(command, args, {
    cwd: ROOT,
    env: process.env,
    stdio: 'inherit',
  })
  timings.push(`${args.find((arg) => !arg.startsWith('-') && arg !== 'run' && arg !== 'exec') ?? command} ${elapsed(stepStartedAt)}`)
  if (result.error) throw result.error
  if (result.status !== 0) {
    console.error(`\n❌ 全教材監査を中止: ${command} ${args.join(' ')} (exit ${result.status})`)
    process.exit(result.status ?? 1)
  }
}

const writer = spawnSync(
  process.execPath,
  [path.join(ROOT, 'scripts/content-audit-ledger.mjs'), '--write'],
  { cwd: ROOT, env: process.env, stdio: 'inherit' },
)
if (writer.error) throw writer.error
if (writer.status !== 0) process.exit(writer.status ?? 1)

const verifier = spawnSync(
  process.execPath,
  [path.join(ROOT, 'scripts/content-audit-ledger.mjs')],
  { cwd: ROOT, env: process.env, stdio: 'inherit' },
)
if (verifier.error) throw verifier.error
if (verifier.status !== 0) process.exit(verifier.status ?? 1)

console.log('\n✅ 全教材監査と台帳記録が完了しました')
