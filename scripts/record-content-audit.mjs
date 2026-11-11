#!/usr/bin/env node

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { envMs, runWithDeadline, TIMED_OUT_STATUS } from './test-cache/deadline.mjs'
import { acquireTestLock } from './test-cache/lock.mjs'

const ROOT = fileURLToPath(new URL('..', import.meta.url))

// --full：全テストを流す。ふだんは変更に関係するテストだけ（読むファイルが前回の合格から変わったテスト）を流す。
const testArgs = ['scripts/run-tests.mjs', ...(process.argv.includes('--full') ? ['--full'] : [])]

const MINUTE = 60 * 1000
const LEDGER = path.join(ROOT, 'scripts/content-audit-ledger.mjs')

// 全工程。どの段にも時間切れがある（固まった段を失敗にして、子・孫を止め、順番を手放す。scripts/test-cache/deadline.mjs）。
// 2026-11-11、テストの段が開始3秒で固まり、7時間そのままだった。時間は、ふだんの長さ（テストは全部流して約30分、check:content は約90秒、ビルドは数秒）の数倍。
// テストのファイル1つずつの固まりは、テストを流す道具（run-tests.mjs）が5分で止める。
export const AUDIT_STEPS = [
  { command: process.execPath, args: testArgs, timeoutMs: 60 * MINUTE },
  { command: 'npm', args: ['run', 'check:content'], timeoutMs: 20 * MINUTE },
  { command: 'npm', args: ['exec', '--', 'vite', 'build'], timeoutMs: 10 * MINUTE },
  { command: 'npm', args: ['run', 'audit:dist'], timeoutMs: 10 * MINUTE },
  { command: 'git', args: ['diff', '--check'], timeoutMs: 5 * MINUTE },
  { command: process.execPath, args: [LEDGER, '--write'], timeoutMs: 10 * MINUTE, quiet: true },
  { command: process.execPath, args: [LEDGER], timeoutMs: 10 * MINUTE, quiet: true },
]

async function main() {
  // 機械全体で1つずつ流す（scripts/test-cache/lock.mjs）。段ごとの時間を最後にまとめて出す。
  acquireTestLock('全教材監査')
  const auditStartedAt = Date.now()
  const timings = []
  const elapsed = (from) => `${Math.round((Date.now() - from) / 1000)}秒`
  process.on('exit', () => {
    if (timings.length) console.log(`\n⏱ 全教材監査の時間：${timings.join('・')}・合計 ${elapsed(auditStartedAt)}`)
  })

  for (const { command, args, timeoutMs, quiet } of AUDIT_STEPS) {
    const shown = `${command === process.execPath ? 'node' : command} ${args.map((arg) => path.relative(ROOT, arg) && !path.relative(ROOT, arg).startsWith('..') && path.isAbsolute(arg) ? path.relative(ROOT, arg) : arg).join(' ')}`
    if (!quiet) console.log(`\n▶ ${shown}`)
    const stepStartedAt = Date.now()
    const { status, timedOut } = await runWithDeadline(command, args, {
      cwd: ROOT,
      env: process.env,
      label: shown,
      timeoutMs: envMs('STUDY_APP_AUDIT_STEP_TIMEOUT_MS', timeoutMs),
      pollMs: envMs('STUDY_APP_STALL_POLL_MS', undefined),
    })
    if (!quiet) timings.push(`${args.find((arg) => !arg.startsWith('-') && arg !== 'run' && arg !== 'exec') ?? command} ${elapsed(stepStartedAt)}`)
    if (status !== 0) {
      console.error(`\n❌ 全教材監査を中止: ${shown} (${timedOut ? '時間切れ・' : ''}exit ${status})`)
      // process.exit は呼ばない（Node 25 は終了の途中で固まることがある）。ふつうに終わらせる。
      process.exitCode = timedOut ? TIMED_OUT_STATUS : status
      return
    }
  }

  console.log('\n✅ 全教材監査と台帳記録が完了しました')
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main()
