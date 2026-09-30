// 社会・理科の文で、漢字で書いてカタカナで読む外国の人名・地名に読みがなが付くことの確認
// （依頼台帳 requests/2026-09-30-subject-katakana-quality.json の katakana-names）。
// 2026-09-30 利用者「カタカナで読む名前も読みがなを付けなさい。」
// 教材に出る漢字のかたまりを全件見て決めた記録は docs/audits/junior-social-science-katakana-names.json。
// 読みは src/data/subjects/readings.js の辞書に載せ、本文・語句・演習はルビ、地図のラベルも同じ辞書で読みを出す。
// 「シャンハイ（上海）」のように読みが先に書いてある所には重ねない。
import test from 'node:test'
import assert from 'node:assert/strict'
import { tokenizeSubjectText } from '../src/lib/subjectText.js'
import {
  katakanaNamesProblems,
  readKatakanaNamesLedger,
  subjectTexts,
} from '../scripts/checks/junior-social-science-katakana-names.mjs'

test('社会・理科の漢字のかたまりを全件見た記録と、今の教材が一致し、カタカナの読みは辞書にある', async () => {
  const ledger = readKatakanaNamesLedger()
  assert.ok(ledger.runs.length >= 7000, '漢字のかたまりの数')
  assert.deepEqual(Object.keys(ledger.katakana).sort(), ['上海', '北京', '南京', '安重根', '青島', '香港'].sort())
  assert.deepEqual(await katakanaNamesProblems(ledger), [])
})

test('カタカナで読む名前は、教材のどこに出ても読みがなが付く（読みが前後に書いてある所をのぞく）', async () => {
  const ledger = readKatakanaNamesLedger()
  const missing = []
  let checked = 0
  for (const [text, where] of await subjectTexts()) {
    // 図の部品の文字はルビを出せないので、名前を書くときは「上海（シャンハイ）」のように文に読みを書く。
    for (const [word, reading] of Object.entries(ledger.katakana)) {
      let from = 0
      while ((from = text.indexOf(word, from)) >= 0) {
        checked += 1
        const around = text.slice(Math.max(0, from - reading.length - 1), from + word.length + reading.length + 1)
        const written = around.includes(`${reading}（${word}`) || around.includes(`${word}（${reading}`)
        const ruby = where.startsWith('src/data/') && tokenizeSubjectText(text).some((segment) => segment.text === word && segment.reading === reading)
        if (!written && !ruby) missing.push(`${word}（${where}: ${text.slice(Math.max(0, from - 10), from + 15)}）`)
        from += word.length
      }
    }
  }
  assert.ok(checked >= 60, `名前の出てくる所の数（${checked}）`)
  assert.deepEqual(missing, [])
})
