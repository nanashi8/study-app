import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { getWord, pickDistractors, registerCustomWords } from '../src/data/vocab.js'
import { UNSET_LEVEL, getLevel, levelChipText } from '../src/data/levels.js'
import {
  DEFAULT_CUSTOM_WORD,
  customStudyWords,
  normalizeCustomWord,
  upsertCustomWord,
} from '../src/lib/customWords.js'
import { customWordInput, emptyEntryValues, entryValuesFromWord } from '../src/lib/customEntryForm.js'
import { CUSTOM_CARD_TABLE_COLUMNS, customCardsCsvText, parseCustomCardsTable } from '../src/lib/customCardsCsv.js'
import { buildCustomLibraryFile, parseCustomLibraryFile } from '../src/lib/customLibrary.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

const bare = { word: 'sunrise', meanings: ['日の出'] }

test('新規の既定は品詞・級・分野とも「ー」（空）で、入力しなくても登録できる', () => {
  assert.deepEqual([DEFAULT_CUSTOM_WORD.pos, DEFAULT_CUSTOM_WORD.level, DEFAULT_CUSTOM_WORD.field], ['', '', ''])
  const values = emptyEntryValues()
  assert.deepEqual([values.posId, values.level, values.field], ['', '', ''])
  values.front = 'sunrise'
  values.back = '日の出'
  const saved = upsertCustomWord([], customWordInput(values, 'english'))
  assert.equal(saved.status, 'saved')
  const [word] = saved.words
  assert.deepEqual([word.pos, word.level, word.field], ['', '', ''])
})

test('「ー」のまま保存・読み戻し・書き出しをしても空のまま残り、決めた値は変わらない', () => {
  const word = normalizeCustomWord(bare)
  assert.deepEqual([word.pos, word.level, word.field], ['', '', ''])
  assert.deepEqual(entryValuesFromWord(word).posId, '')
  const file = buildCustomLibraryFile({ words: [word], cards: [], categories: [] })
  const back = parseCustomLibraryFile(JSON.stringify(file))
  const loaded = back.library?.words?.[0] ?? back.words?.[0]
  assert.deepEqual([loaded.pos, loaded.level, loaded.field], ['', '', ''])
  const set = normalizeCustomWord({ ...bare, pos: '名', level: 'pre2', field: '学校・教育' })
  assert.deepEqual([set.pos, set.level], ['名', 'pre2'])
})

test('CSV・Excel は「ー」と空欄を決めていない印として往復し、警告を出さない', () => {
  const word = normalizeCustomWord(bare)
  const text = customCardsCsvText({ words: [word], cards: [], categories: [] })
  const parsed = parseCustomCardsTable(text)
  assert.equal(parsed.errors?.length ?? 0, 0)
  assert.equal(parsed.warnings?.length ?? 0, 0)
  const loaded = (parsed.library?.words ?? parsed.words)[0]
  assert.deepEqual([loaded.pos, loaded.level, loaded.field], ['', '', ''])
  // 品詞・級・分野の欄に「ー」と書いても同じ（警告なし）。
  const cells = CUSTOM_CARD_TABLE_COLUMNS.map((item) => {
    if (item.key === 'front') return 'sunrise'
    if (item.key === 'back') return '日の出'
    return ['pos', 'level', 'field'].includes(item.key) ? 'ー' : ''
  })
  const header = CUSTOM_CARD_TABLE_COLUMNS.map((item) => item.header)
  assert.ok(['pos', 'level', 'field'].every((key) => CUSTOM_CARD_TABLE_COLUMNS.some((item) => item.key === key)))
  const dashed = parseCustomCardsTable(`${header.join(',')}\n${cells.join(',')}`)
  assert.equal(dashed.warnings?.length ?? 0, 0)
  const [fromDash] = dashed.library?.words ?? dashed.words
  assert.deepEqual([fromDash.pos, fromDash.level, fromDash.field], ['', '', ''])
})

test('級が空のカードは「ー」と表示され、出題の誤答作りも落ちない', () => {
  assert.equal(getLevel(''), UNSET_LEVEL)
  assert.equal(levelChipText(getLevel('')), '級ー')
  assert.equal(levelChipText(getLevel('3')), '英検3級')
  const [study] = customStudyWords([bare])
  registerCustomWords([study])
  assert.equal(getWord(study.id).level, '')
  const picked = pickDistractors(study, 3, () => 0.5)
  assert.equal(picked.length, 3)
  registerCustomWords([])
})

test('選択欄の先頭は「ー」、品詞バッジは空なら何も出さない', () => {
  const form = read('src/components/CustomCardForm.jsx')
  for (const key of ['posId', 'level', 'field']) {
    const at = form.indexOf(`data-custom-card-input="${key}"`)
    assert.ok(at > 0, key)
    assert.match(form.slice(at, at + 160), /<option value="">ー<\/option>/u, key)
  }
  assert.match(read('src/components/PosBadge.jsx'), /if \(!pos\) return null/u)
})
