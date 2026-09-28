// テストが一時フォルダに作ったもの（使い捨てのリポジトリ・台帳など）を、終わったら消しているかを確かめる。
// 2026-09-28、git のフックのテストと依頼台帳のテストが、npm test のたびに一時フォルダへ作ったものを残していた
// （使い捨てのリポジトリ 112個・台帳のフォルダ 169個がたまっていた）。
// 一時フォルダを作るテストのファイルを、空の一時フォルダ（TMPDIR）で1つずつ動かし、通ったうえで何も残らないことを見る。
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const TESTS = fileURLToPath(new URL('.', import.meta.url))
const ROOT = fileURLToPath(new URL('..', import.meta.url))
const SELF = basename(fileURLToPath(import.meta.url))
// 一時フォルダを使うテスト：tmpdir() か mkdtemp を呼ぶファイル（このファイルを除く）。
const USES_TEMP = /\btmpdir\(\)|\bmkdtemp(?:Sync)?\(/

const tempTests = readdirSync(TESTS)
  .filter((name) => name.endsWith('.test.mjs') && name !== SELF)
  .filter((name) => USES_TEMP.test(readFileSync(join(TESTS, name), 'utf8')))
  .sort()

test('一時フォルダを作るテストのファイルを、すべて調べる', () => {
  // 2026-09-28 の時点の3つ。一時フォルダを使うテストを足せば、下で自動で調べる。
  for (const name of ['leftover-changes.test.mjs', 'requests-gate.test.mjs', 'requests-ledger.test.mjs']) {
    assert.ok(tempTests.includes(name), name)
  }
})

for (const name of tempTests) {
  test(`${name} は、一時フォルダに作ったものを終わったら消す`, () => {
    const temp = mkdtempSync(join(tmpdir(), 'temp-cleanup-'))
    try {
      // このテストを動かしている node --test の子として扱われないよう、その目印（NODE_TEST_CONTEXT）は渡さない。
      const env = { ...process.env, TMPDIR: `${temp}/` }
      delete env.NODE_TEST_CONTEXT
      const result = spawnSync(process.execPath, ['--test', join('tests', name)], {
        cwd: ROOT,
        env,
        encoding: 'utf8',
        maxBuffer: 1 << 26,
      })
      assert.equal(result.status, 0, `${name} が通らない\n${result.stdout.slice(-2000)}${result.stderr.slice(-2000)}`)
      assert.deepEqual(readdirSync(temp), [], `${name} が一時フォルダに残したもの`)
    } finally {
      rmSync(temp, { recursive: true, force: true })
    }
  })
}
