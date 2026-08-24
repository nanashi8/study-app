#!/usr/bin/env node

import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))

const steps = [
  ['npm', ['test']],
  ['npm', ['run', 'check:content']],
  ['npm', ['exec', '--', 'vite', 'build']],
  ['npm', ['run', 'audit:dist']],
  ['git', ['diff', '--check']],
]

for (const [command, args] of steps) {
  console.log(`\n▶ ${command} ${args.join(' ')}`)
  const result = spawnSync(command, args, {
    cwd: ROOT,
    env: process.env,
    stdio: 'inherit',
  })
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
