// 固まった処理を、時間切れで失敗にする。
// 2026-11-11、全教材監査が開始3秒で固まり、7時間そのままだった（前の日も7時間）。固まった処理は CPU を使わず、
// 失敗にも終了にもならないので、待っている側は気づけない。順番（lock.mjs）も持ち続けて、ほかの全監査・commit・push を待たせる。
// ここでは (1) 段ごとの時間切れ、(2) 子・孫のうち CPU が動かないまま残っているものの見張り、の2つで止める。
// 止めるときは、何が残っていたか（プロセスの一覧）を出してから、子・孫をまとめて止める。
import { spawn, spawnSync } from 'node:child_process'

export const TIMED_OUT_STATUS = 124
const POLL_MS = 5000

const seconds = (text) => {
  // ps の time は macOS で「分:秒.百分の一」、Linux で「時:分:秒」（日があれば「日-時:分:秒」）。
  const [days, rest] = text.includes('-') ? text.split('-') : ['0', text]
  return rest.split(':').reduce((total, part) => total * 60 + Number(part), 0) + Number(days) * 86400
}

/** 今のプロセスの一覧（pid・親・使った CPU の秒・コマンド）。ps が使えなければ null。 */
export function processTable() {
  const result = spawnSync('ps', ['-Ao', 'pid=,ppid=,time=,command='], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
  if (result.status !== 0 || !result.stdout) return null
  const table = []
  for (const line of result.stdout.split('\n')) {
    const match = line.match(/^\s*(\d+)\s+(\d+)\s+(\S+)\s+(.*)$/)
    if (match) table.push({ pid: Number(match[1]), ppid: Number(match[2]), cpu: seconds(match[3]), command: match[4] })
  }
  return table
}

/** pid の子・孫（pid 自身は入れない）。 */
export function descendants(table, pid) {
  const children = new Map()
  for (const row of table) {
    if (!children.has(row.ppid)) children.set(row.ppid, [])
    children.get(row.ppid).push(row)
  }
  const found = []
  const walk = (parent) => {
    for (const row of children.get(parent) ?? []) {
      found.push(row)
      walk(row.pid)
    }
  }
  walk(pid)
  return found
}

const kill = (pid) => {
  try {
    process.kill(pid, 'SIGKILL')
  } catch {
    // もう終わっている
  }
}

/** pid と、その子・孫をまとめて止める。孫から先に止める（親を先に止めると、孫の親が変わってたどれなくなる）。 */
export function killTree(pid, table = processTable()) {
  for (const row of descendants(table ?? [], pid).reverse()) kill(row.pid)
  kill(pid)
}

const brief = (command) => (command.length > 200 ? `${command.slice(0, 80)} … ${command.slice(-110)}` : command)

/**
 * 子・孫のうち「見張る相手」を選んで、CPU が動かない・長すぎるものを見つける見張りを作る。
 *   pick(row)  見張る相手なら、表示に使う名前を返す（そうでなければ null）
 *   idleMs     相手と、その子・孫の CPU が合わせてこれだけ動かなければ固まったとみなす
 *   maxMs      相手がこれより長く続いたら固まったとみなす
 * 返り値は (table, rootPid, now) => [{ pid, name, reason }]。
 */
export function stallWatcher({ pick, idleMs, maxMs }) {
  const seen = new Map()
  // 一度知らせた相手は、もう知らせない（止めたあと、親が片付けるまで一覧に残ることがある）。
  const reported = new Set()
  return (table, rootPid, now = Date.now()) => {
    const stalled = []
    const alive = new Set()
    for (const row of descendants(table, rootPid)) {
      // 終わって片付けを待っているだけのもの（<defunct>）は相手にしない。
      const name = /^[<(]/.test(row.command) || reported.has(row.pid) ? null : pick(row)
      if (!name) continue
      alive.add(row.pid)
      const cpu = row.cpu + descendants(table, row.pid).reduce((total, child) => total + child.cpu, 0)
      const state = seen.get(row.pid) ?? { firstSeen: now, cpu, cpuChangedAt: now }
      if (cpu !== state.cpu) Object.assign(state, { cpu, cpuChangedAt: now })
      seen.set(row.pid, state)
      if (now - state.cpuChangedAt >= idleMs) stalled.push({ pid: row.pid, name, reason: `CPU が ${Math.round((now - state.cpuChangedAt) / 1000)}秒 動かない` })
      else if (now - state.firstSeen >= maxMs) stalled.push({ pid: row.pid, name, reason: `${Math.round((now - state.firstSeen) / 60000)}分 たっても終わらない` })
    }
    for (const found of stalled) reported.add(found.pid)
    for (const pid of seen.keys()) if (!alive.has(pid)) seen.delete(pid)
    return stalled
  }
}

/**
 * コマンドを流して終わるのを待つ。timeoutMs を過ぎたら、残っていたプロセスを出して子・孫ごと止め、status 124 を返す。
 * watch（stallWatcher）が固まった子を見つけたら、その子だけを止める（コマンドはその子の失敗として続く）。
 * 返り値は { status, timedOut, stalled }。stalled は止めた子の名前。
 */
export function runWithDeadline(command, args, { label = command, timeoutMs, watch, pollMs = POLL_MS, log = (line) => console.error(line), ...options } = {}) {
  return new Promise((done, fail) => {
    const startedAt = Date.now()
    const child = spawn(command, args, { stdio: 'inherit', ...options })
    const stalled = []
    let timedOut = false
    const timer = setInterval(() => {
      const table = processTable()
      if (timeoutMs && Date.now() - startedAt >= timeoutMs) {
        timedOut = true
        clearInterval(timer)
        log(`\n❌ ${label} が ${Math.round(timeoutMs / 60000)}分 たっても終わらない（固まった）ので止めた。残っていたプロセス：`)
        for (const row of descendants(table ?? [], child.pid)) log(`   pid ${row.pid}・CPU ${row.cpu}秒・${brief(row.command)}`)
        killTree(child.pid, table)
        return
      }
      if (!watch || !table) return
      for (const found of watch(table, child.pid)) {
        stalled.push(found.name)
        log(`\n❌ ${found.name} が固まった（${found.reason}）ので止めた（pid ${found.pid}・${brief(table.find((row) => row.pid === found.pid)?.command ?? '')}）`)
        killTree(found.pid, table)
      }
    }, pollMs)
    child.on('error', (error) => {
      clearInterval(timer)
      fail(error)
    })
    child.on('exit', (code) => {
      clearInterval(timer)
      done({ status: timedOut ? TIMED_OUT_STATUS : (code ?? 1), timedOut, stalled })
    })
  })
}

/** 環境変数の時間（ミリ秒）。なければ既定。テストが短い時間で確かめるために使う。 */
export const envMs = (name, fallback) => {
  const value = Number(process.env[name])
  return Number.isFinite(value) && value > 0 ? value : fallback
}
