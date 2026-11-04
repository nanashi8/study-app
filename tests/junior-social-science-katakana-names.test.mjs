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
  // 中学の6語に、高校（地理総合・歴史総合）で現地の読みを示す6語（深圳・金日成・李承晩・平壌・仁川・板門店）を足した。
  // 地理探究・日本史探究と、地理総合・歴史総合に足した単元で、近代の人名と現地の読みで示す地名の5語（朴正熙・釜山・漢江・珠海・海南）を足した。
  // 学習者の日本語の見直し（2026-11-04）で、日明貿易の港の寧波（ニンポー）と、長江の三峡（サンシャ）ダムの2語を足した。
  // 近世より前の朝鮮の人名（李成桂・李舜臣）は、教科書と同じく日本語の読みで示す。
  assert.deepEqual(Object.keys(ledger.katakana).sort(), ['上海', '北京', '南京', '安重根', '青島', '香港', '深圳', '金日成', '李承晩', '平壌', '仁川', '板門店', '朴正熙', '釜山', '漢江', '珠海', '海南', '寧波', '三峡'].sort())
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
