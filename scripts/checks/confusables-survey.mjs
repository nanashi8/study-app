#!/usr/bin/env node
// つづりが似た見出し語の組と、同じ発音の見出し語の組を全部拾い、1組ずつ決めたかを確かめる。
// 母集団: 4文字以上の語どうしで1字違い（置き換え・足し引き）か隣り合う2字の入れ替え、7文字以上の語どうしで2字違い、
// 発音辞書 CMU のどれかの読みが同じ組。同じまとまり（word-forms.js の WORD_FORM_GROUPS）の組は除く。
// 決め方: 取り違えやすい組は src/data/spelling-confusables.js の SPELLING_CONFUSABLE_PAIRS に載せ、
// 載せない組は docs/audits/confusables-survey.json の reviewed に理由の略号を書く。見出し語を足すと、読むまでこの確認は通らない。
import { readFileSync } from 'node:fs'
import { dictionary } from 'cmu-pronouncing-dictionary'
import { ALL_WORDS } from '../../src/data/vocab.js'
import { WORD_FORM_GROUPS } from '../../src/data/word-forms.js'
import { SPELLING_CONFUSABLE_PAIRS } from '../../src/data/spelling-confusables.js'

export const CONFUSABLES_SURVEY_PATH = new URL('../../docs/audits/confusables-survey.json', import.meta.url)

// 載せない理由の略号。
export const CONFUSABLE_SKIP_REASONS = {
  別語: 'つづりは似ているが、意味・品詞・発音がはっきりちがい、取り違えにくい',
  変化形: '一方が他方の複数形・活用形などの形で、同じ語の形として覚える',
  同じ語: '同じ語の別の品詞・別のつづりで、同じ語として覚える',
  まれ: '一方が学習でまず出会わない語・固有名詞・略語で、取り違える場面がない',
}

const pairKey = (a, b) => [a, b].sort().join('|')

function editDistance(a, b, limit) {
  if (Math.abs(a.length - b.length) > limit) return limit + 1
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i += 1) {
    const current = [i]
    let best = current[0]
    for (let j = 1; j <= b.length; j += 1) {
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
      best = Math.min(best, current[j])
    }
    if (best > limit) return limit + 1
    previous = current
  }
  return previous[b.length]
}

const deletions = (word, depth) => {
  let level = new Set([word])
  const all = new Set([word])
  for (let d = 0; d < depth; d += 1) {
    const next = new Set()
    for (const text of level) for (let i = 0; i < text.length; i += 1) next.add(text.slice(0, i) + text.slice(i + 1))
    for (const text of next) all.add(text)
    level = next
  }
  return all
}

/** 母集団の組（"a|b" → 拾った理由の配列）。 */
export function confusableSurveyPairs() {
  const spellings = [...new Set(ALL_WORDS.map((word) => word.word.toLowerCase()))].filter((word) => /^[a-z]+$/.test(word))
  const idsBySpelling = new Map()
  for (const word of ALL_WORDS) {
    const key = word.word.toLowerCase()
    if (!idsBySpelling.has(key)) idsBySpelling.set(key, [])
    idsBySpelling.get(key).push(word.id)
  }
  const groupOf = new Map()
  WORD_FORM_GROUPS.forEach((group, index) => { for (const id of group) groupOf.set(id, index) })
  const sameGroup = (a, b) => (idsBySpelling.get(a) ?? []).some((x) => (idsBySpelling.get(b) ?? []).some((y) => groupOf.has(x) && groupOf.get(x) === groupOf.get(y)))
  const pairs = new Map()
  const add = (a, b, why) => {
    if (a === b || sameGroup(a, b)) return
    const key = pairKey(a, b)
    if (!pairs.has(key)) pairs.set(key, new Set())
    pairs.get(key).add(why)
  }
  // 1字違い・2字違い（削除の近傍で候補を集め、編集距離で確かめる）
  for (const [depth, minLength, why] of [[1, 4, '1字違い'], [2, 7, '2字違い']]) {
    const buckets = new Map()
    for (const word of spellings) {
      if (word.length < minLength) continue
      for (const key of deletions(word, depth)) {
        if (!buckets.has(key)) buckets.set(key, [])
        buckets.get(key).push(word)
      }
    }
    for (const words of buckets.values()) {
      if (words.length < 2) continue
      for (let i = 0; i < words.length; i += 1) {
        for (let j = i + 1; j < words.length; j += 1) {
          const distance = editDistance(words[i], words[j], depth)
          if (distance === depth) add(words[i], words[j], why)
        }
      }
    }
  }
  // 隣り合う2字の入れ替え
  const spellingSet = new Set(spellings)
  for (const word of spellings) {
    if (word.length < 4) continue
    for (let i = 0; i + 1 < word.length; i += 1) {
      if (word[i] === word[i + 1]) continue
      const swapped = word.slice(0, i) + word[i + 1] + word[i] + word.slice(i + 2)
      if (spellingSet.has(swapped)) add(word, swapped, '入れ替え')
    }
  }
  // 同じ発音（CMU の読みのどれかが同じ）
  const bySound = new Map()
  for (const word of spellings) {
    for (let variant = 0; variant < 4; variant += 1) {
      const arpa = dictionary[variant ? `${word}(${variant})` : word]
      if (!arpa) continue
      const sound = arpa.replace(/[0-9]/g, '')
      if (!bySound.has(sound)) bySound.set(sound, new Set())
      bySound.get(sound).add(word)
    }
  }
  for (const words of bySound.values()) {
    const list = [...words]
    for (let i = 0; i < list.length; i += 1) for (let j = i + 1; j < list.length; j += 1) add(list[i], list[j], '同じ発音')
  }
  return new Map([...pairs].map(([key, whys]) => [key, [...whys]]))
}

export function confusablesSurveyGap() {
  const ledger = JSON.parse(readFileSync(CONFUSABLES_SURVEY_PATH, 'utf8'))
  const reviewed = ledger.reviewed ?? {}
  const pairs = confusableSurveyPairs()
  const listed = new Set(SPELLING_CONFUSABLE_PAIRS.map(([a, b]) => pairKey(String(a).replace(/_\d+$/, ''), String(b).replace(/_\d+$/, ''))))
  return {
    pairs: pairs.size,
    listed: [...pairs.keys()].filter((key) => listed.has(key)).length,
    undecided: [...pairs.keys()].filter((key) => !listed.has(key) && !reviewed[key]),
    stale: Object.keys(reviewed).filter((key) => !pairs.has(key) || listed.has(key)),
    badCodes: Object.entries(reviewed).filter(([, code]) => !CONFUSABLE_SKIP_REASONS[code]).map(([key]) => key),
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  if (process.argv.includes('--list')) {
    for (const [key, whys] of confusableSurveyPairs()) console.log(`${key}\t${whys.join('・')}`)
    process.exit(0)
  }
  const gap = confusablesSurveyGap()
  console.log(`つづりが似た組・同じ発音の組: ${gap.pairs} 組（載せた ${gap.listed}・理由のない組 ${gap.undecided.length}・古い理由の行 ${gap.stale.length}・略号ちがい ${gap.badCodes.length}）`)
  for (const key of gap.undecided.slice(0, 20)) console.log(`  決めていない: ${key}`)
  for (const key of gap.stale.slice(0, 20)) console.log(`  古い理由の行: ${key}`)
  process.exit(gap.undecided.length || gap.stale.length || gap.badCodes.length ? 1 : 0)
}
