// check:content の時間の大半を使っていた2つの検査を、結果を変えずに速くした（requests/2026-11-11-audit-flow-recheck.json）。
// 2026-11-11、check:content 94秒のうち63秒が audit:word-levels（32秒）と audit:japanese（31秒）だった。
// check:content は、全教材監査のたび・公開のビルド（prebuild）のたびに全部流れる。
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'
import { lineNumberAt } from '../scripts/audit-learner-japanese.mjs'
import { inflectionOwners, inflections } from '../scripts/check-word-levels.mjs'
import { ALL_WORDS } from '../src/data/vocab.js'

test('「ほかの見出し語の活用形か」は、索引で引いても、全語の活用形を作り直す数え方と同じ', () => {
  const heads = [...new Set(ALL_WORDS.map((word) => word.word.toLowerCase()))]
  const owners = inflectionOwners(heads)
  const forms = heads.map((head) => [head, inflections(head)])
  let checked = 0
  let found = 0
  // 全見出し語の10語に1語と、活用形になる語の例。
  const sample = [...heads.filter((_, index) => index % 10 === 0), 'closing', 'opening', 'found', 'left', 'saw']
  for (const word of sample) {
    const slow = forms.some(([other, list]) => other !== word && list.includes(word))
    const fast = (owners.get(word) ?? []).some((other) => other !== word)
    assert.equal(fast, slow, word)
    checked += 1
    if (fast) found += 1
  }
  assert.ok(checked > 800 && found > 10, `${checked}語のうち、ほかの語の活用形 ${found}語`)
  // 自分自身の形は「ほかの語」に数えない。
  assert.deepEqual(inflectionOwners(['close']).get('close'), ['close'])
  assert.deepEqual(inflectionOwners(['close', 'closing']).get('closing').sort(), ['close', 'closing'])
})

test('行番号は、索引で引いても、先頭から改行を数える数え方と同じ', () => {
  const naive = (source, index) => {
    let line = 1
    for (let cursor = 0; cursor < index; cursor += 1) if (source[cursor] === '\n') line += 1
    return line
  }
  // 形の違う短い文は全位置、交互に引いても混ざらない。
  const small = ['', 'a', '\n', 'a\nb', '\n\n\n', 'あ\nい\n', 'a\r\nb\r\n', '最後に改行なし\n\n途中']
  for (let round = 0; round < 2; round += 1) {
    for (const source of small) {
      for (let index = 0; index <= source.length + 1; index += 1) assert.equal(lineNumberAt(source, index), naive(source, index), JSON.stringify([source, index]))
    }
  }
  // いちばん大きい教材のファイル3つは、97文字おきと両端。
  const walk = (dir, out = []) => {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name)
      if (statSync(path).isDirectory()) walk(path, out)
      else if (/\.(?:js|jsx)$/.test(name)) out.push(path)
    }
    return out
  }
  const largest = walk('src').sort((a, b) => statSync(b).size - statSync(a).size).slice(0, 3)
  for (const file of largest) {
    const source = readFileSync(file, 'utf8')
    let line = 1
    let checked = 0
    for (let index = 0; index <= source.length; index += 1) {
      if (index % 97 === 0 || index === source.length) {
        assert.equal(lineNumberAt(source, index), line, `${file} ${index}`)
        checked += 1
      }
      if (source[index] === '\n') line += 1
    }
    assert.ok(checked > 1000, file)
  }
})

test('2つの検査は通り、どちらも前の半分より短い時間で終わる（前は32秒と31秒）', () => {
  for (const [script, pass] of [
    ['scripts/check-word-levels.mjs', /^✅ 単語の級OK: \d+語/m],
    ['scripts/audit-learner-japanese.mjs', /^日本語案内監査: エラー0件$/m],
  ]) {
    const startedAt = Date.now()
    const result = spawnSync(process.execPath, [script], { encoding: 'utf8', timeout: 120_000 })
    const seconds = (Date.now() - startedAt) / 1000
    assert.equal(result.status, 0, result.stderr)
    assert.match(result.stdout, pass)
    // ほかのテストと並んで流れても余裕のある上限（直したあとは1秒ほど）。
    assert.ok(seconds < 15, `${script} が ${seconds.toFixed(1)}秒かかった`)
  }
})
