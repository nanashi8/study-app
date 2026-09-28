// main に入っていない変更がこの端末に残っていないかを確かめる道具（scripts/checks/leftover-changes.mjs）の見分け方を守る。
// 「すべての変更をデプロイまで」の依頼（2026-09-25・2026-09-28）で、複製と旧 Codex の写しをこれで洗い出した。
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import {
  cloneLeftovers,
  findRepositories,
  isStudyAppClone,
  mainHistory,
  snapshotTransitions,
} from '../scripts/checks/leftover-changes.mjs'

// 使い捨てのリポジトリで動かす git。リポジトリの場所を渡す環境変数を外し、コミットの名前を渡し、フックは使わない。
const REPOSITORY_ENV = /^GIT_(?:DIR|WORK_TREE|INDEX_FILE|PREFIX|OBJECT_DIRECTORY|ALTERNATE_OBJECT_DIRECTORIES|COMMON_DIR|NAMESPACE|QUARANTINE_PATH)$/
const ENV = {
  ...Object.fromEntries(Object.entries(process.env).filter(([key]) => !REPOSITORY_ENV.test(key))),
  GIT_AUTHOR_NAME: 'test',
  GIT_AUTHOR_EMAIL: 'test@example.com',
  GIT_COMMITTER_NAME: 'test',
  GIT_COMMITTER_EMAIL: 'test@example.com',
}
const git = (dir, ...args) => execFileSync('git', ['-C', dir, '-c', 'core.hooksPath=/dev/null', '-c', 'commit.gpgsign=false', ...args], {
  encoding: 'utf8',
  env: ENV,
  stdio: ['ignore', 'pipe', 'pipe'],
})
const write = (dir, name, text) => writeFileSync(join(dir, name), text)

function withRepositories(run) {
  const base = mkdtempSync(join(tmpdir(), 'leftover-'))
  try {
    const main = join(base, 'main')
    mkdirSync(main)
    git(main, 'init', '-q', '-b', 'main')
    write(main, 'a.txt', 'one\n')
    write(main, 'gone.txt', 'old\n')
    git(main, 'add', '-A')
    git(main, 'commit', '-q', '-m', 'first')
    const clone = join(base, 'clone')
    git(base, 'clone', '-q', main, clone)
    run({ base, main, clone })
  } finally {
    rmSync(base, { recursive: true, force: true })
  }
}

test('旧 Codex の写しで、一度もコミットされていない版が次の写しで捨てられたかを見分ける', () => {
  // 版 v1 は 1 秒、old は 0.5 秒、v3 は 5 秒の時点で初めてコミットされた。w で始まる版はコミットされていない。
  const first = new Map([['a.js\0v1', { time: 1000 }], ['b.js\0old', { time: 500 }], ['a.js\0v3', { time: 5000 }]])
  const snapshots = [
    { time: 2000, files: new Map([['a.js', 'w1'], ['b.js', 'w2'], ['c.js', 'w3'], ['d.js', 'w4']]) },
    { time: 3000, files: new Map([['a.js', 'w1b'], ['b.js', 'old'], ['d.js', 'w4']]) },
    { time: 6000, files: new Map([['a.js', 'v3'], ['d.js', 'w4']]) },
  ]
  const { counts, dropped, leftAtEnd } = snapshotTransitions(snapshots, first)
  // a.js はさらに編集され（w1→w1b）、その後にコミットされた版へ進んだ（w1b→v3）。d.js は2回そのまま。
  assert.deepEqual(counts, { same: 2, edited: 1, committedLater: 1 })
  // b.js は写す前からあるコミットの版へ戻り、c.js は次の写しで消えた。どちらも編集が捨てられている。
  assert.deepEqual(dropped.map(({ path, how }) => `${path}:${how}`), [
    'b.js:写す前からあるコミットの版へ戻った',
    'c.js:次の写しでファイルが消えた',
  ])
  // いちばん新しい写しに、コミットされていない d.js が残る。
  assert.deepEqual(leftAtEnd, ['d.js'])
})

test('複製の未コミット・stash・ローカルの枝のコミットのうち、main の履歴に一度も入っていない変更を数える', () => {
  withRepositories(({ main, clone }) => {
    git(clone, 'checkout', '-q', '-b', 'work')
    write(clone, 'c.txt', 'three\n')
    git(clone, 'add', 'c.txt')
    git(clone, 'commit', '-q', '-m', 'local')
    write(clone, 'a.txt', 'two\n')
    git(clone, 'stash', 'push', '-q', '-m', 'wip')
    write(clone, 'n.txt', 'new\n')
    rmSync(join(clone, 'gone.txt'))

    const before = cloneLeftovers(clone, mainHistory(main, { main: 'main' }))
    assert.equal(before.commits, 1)
    assert.deepEqual(
      before.leftovers.map(({ where, path }) => `${where.replace(/ [0-9a-f]{7}$/, '')}:${path}`).sort(),
      ['stash:a.txt', 'コミット:c.txt', '未コミット:gone.txt', '未コミット:n.txt'],
    )

    // 同じ中身が main に入れば数えない。消したファイルも、main から消えれば数えない。
    write(main, 'a.txt', 'two\n')
    write(main, 'c.txt', 'three\n')
    write(main, 'n.txt', 'new\n')
    rmSync(join(main, 'gone.txt'))
    git(main, 'add', '-A')
    git(main, 'commit', '-q', '-m', 'deliver')
    const after = cloneLeftovers(clone, mainHistory(main, { main: 'main' }))
    assert.deepEqual(after.leftovers, [])
    // ローカルのコミットそのものは main にないが、変えた中身は main に入っている。
    assert.equal(after.commits, 1)
  })
})

test('この端末の git リポジトリを探し、main の最初のコミットを持つものを study-app の複製とみなす', () => {
  withRepositories(({ base, main, clone }) => {
    const other = join(base, 'other')
    mkdirSync(other)
    git(other, 'init', '-q', '-b', 'main')
    write(other, 'x.txt', 'x\n')
    git(other, 'add', '-A')
    git(other, 'commit', '-q', '-m', 'other')
    assert.deepEqual(findRepositories([base]), [clone, main, other].sort())
    const history = mainHistory(main, { main: 'main' })
    assert.equal(isStudyAppClone(clone, history), true)
    assert.equal(isStudyAppClone(other, history), false)
  })
})
