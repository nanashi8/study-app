#!/usr/bin/env node
// 意味欄の訳語のうち、見出しの品詞とちがう品詞に見えるのに品詞の印（(名)・(動)・(形)・(副)）がないものを拾う。
// 例: work（動）「働く・仕事」の「仕事」、end（動）「終わり・終わらせる」の「終わり」、whole（形）「全体の・全部の・全体」の「全体」。
// 別の品詞の訳語には印を付け（「働く・仕事(名)」）、先頭の訳語は見出しの品詞の訳語にする（先頭の訳語はテストの答えと品詞バッジが指す意味）。
// 訳語の終わり方で見当をつけるだけなので、見出しの品詞のままでよい訳語（want の「ほしい」、疑問の「〜かしら」など）は
// docs/audits/meaning-pos-marks.json の reviewed に理由の略号を書く。見出し語を足すと、読むまでこの確認は通らない。
import { readFileSync } from 'node:fs'
import { ALL_WORDS } from '../../src/data/vocab.js'
import { splitMeanings } from '../../src/data/compact.js'

export const MEANING_POS_MARKS_PATH = new URL('../../docs/audits/meaning-pos-marks.json', import.meta.url)

// 印を付けない理由の略号。
export const MEANING_POS_MARK_REASONS = {
  同品詞: '訳語の終わり方がちがって見えるだけで、見出しの品詞の訳語（want の「ほしい」、successive の「連続する」、bench の「長いす」など）',
  数詞: '数・数量を表す語で、数そのものと数の形容詞を一緒に載せる決まり（eight の「8」、all の「全部」など）',
  説明: '品詞の訳語ではなく、使い方の説明（「doの過去」「beの過去分詞」など）',
}

const MARK = /[（(](名|動|形|副)[）)]$/u
const core = (gloss) => gloss.replace(/[（(][^）)]*[）)]/gu, '').replace(/[〜~…]/gu, '').trim()
const VERB_END = /[うくぐすつぬぶむる]$/u
const NOUN_END = /[\u4E00-\u9FFF\u30A0-\u30FF0-9０-９A-Za-z々]$/u

/** 見出しの品詞から見て、別の品詞に見える訳語（先頭の訳語も見る）。 */
function looksOtherPos(pos, gloss) {
  const text = core(gloss)
  if (!text) return false
  // 動詞の訳語は、動詞の終わり方（う段）で終わる。
  if (pos === '動') return !VERB_END.test(text)
  // 名詞のカードに、動詞・形容詞の終わり方の訳語がある。
  if (pos === '名') return VERB_END.test(text) || /(な|の)$/u.test(text)
  // 形容詞のカードに、名詞の終わり方や「〜する・〜させる」の訳語がある。
  if (pos === '形') return NOUN_END.test(text) || /(する|させる|にする)$/u.test(text)
  if (pos === '副') return NOUN_END.test(text) || (VERB_END.test(text) && !/(く|て)$/u.test(text))
  return false
}

/** 印のない、見出しの品詞とちがって見える訳語（語 id|訳語）。 */
export function meaningPosMarkHits() {
  const hits = []
  for (const word of ALL_WORDS) {
    if (!['動', '名', '形', '副'].includes(word.pos)) continue
    for (const gloss of splitMeanings(word.meaning)) {
      if (MARK.test(gloss)) continue
      if (looksOtherPos(word.pos, gloss)) hits.push(`${word.id}|${gloss}`)
    }
  }
  return hits
}

export function meaningPosMarksGap() {
  const ledger = JSON.parse(readFileSync(MEANING_POS_MARKS_PATH, 'utf8'))
  const reviewed = ledger.reviewed ?? {}
  const hits = meaningPosMarkHits()
  const hitSet = new Set(hits)
  return {
    hits: hits.length,
    undecided: hits.filter((key) => !reviewed[key]),
    stale: Object.keys(reviewed).filter((key) => !hitSet.has(key)),
    badCodes: Object.entries(reviewed).filter(([, code]) => !MEANING_POS_MARK_REASONS[code]).map(([key]) => key),
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  if (process.argv.includes('--list')) {
    for (const key of meaningPosMarkHits()) console.log(key)
    process.exit(0)
  }
  const gap = meaningPosMarksGap()
  console.log(`意味欄の品詞の印: 拾った訳語 ${gap.hits} 件（印も理由もないもの ${gap.undecided.length}・拾われなくなった理由の行 ${gap.stale.length}・略号ちがい ${gap.badCodes.length}）`)
  for (const key of gap.undecided.slice(0, 30)) console.log(`  印も理由もない: ${key}`)
  for (const key of gap.stale.slice(0, 30)) console.log(`  拾われなくなった: ${key}`)
  process.exit(gap.undecided.length || gap.stale.length || gap.badCodes.length ? 1 : 0)
}
