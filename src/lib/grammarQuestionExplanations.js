import { GRAMMAR_RULE_EXPLANATIONS } from '../data/grammar-rule-explanations.js'

const clean = (value) => String(value ?? '')
  .replace(/\s+/g, ' ')
  .replace(/。{2,}/g, '。')
  .trim()

const normalizeEnglish = (value) => clean(value)
  .toLocaleLowerCase('en-US')
  .replace(/[’]/g, "'")
  .replace(/[^a-z]+/g, ' ')
  .trim()

const INFLECTION_GROUPS = Object.freeze([
  ['am', 'is', 'are', 'was', 'were', 'be', 'been', 'being'],
  ['do', 'does', 'did', 'done', 'doing'],
  ['have', 'has', 'had', 'having'],
])

const regularForms = (base) => {
  const forms = new Set([base])
  if (!base || base.includes(' ')) return forms
  forms.add(`${base}s`)
  forms.add(`${base}es`)
  forms.add(`${base}ed`)
  forms.add(`${base}ing`)
  if (base.endsWith('e')) {
    forms.add(`${base}d`)
    forms.add(`${base.slice(0, -1)}ing`)
  }
  if (/[^aeiou]y$/.test(base)) {
    forms.add(`${base.slice(0, -1)}ies`)
    forms.add(`${base.slice(0, -1)}ied`)
  }
  if (/[^aeiou][aeiou][^aeiouwxy]$/.test(base)) {
    const last = base.at(-1)
    forms.add(`${base}${last}ed`)
    forms.add(`${base}${last}ing`)
  }
  return forms
}

const choicesAreOneVisibleInflectionFamily = (choices) => {
  const normalized = choices.map(normalizeEnglish)
  if (normalized.some((choice) => !choice || choice.includes(' '))) return false
  if (INFLECTION_GROUPS.some((group) => normalized.every((choice) => group.includes(choice)))) {
    return true
  }
  return normalized.some((candidate) => {
    const forms = regularForms(candidate)
    return normalized.every((choice) => forms.has(choice))
  })
}

// 答え合わせの「解説」。問題データの explain（短い規則）ごとに、形の決まり方とその文への当てはめを書いてある。
// 単元別の並び替え・語法問題は、問題ごとに1本ずつ書いた解説を問題データ（ruleExplanation）に持つ。
export function grammarRuleExplanationFor(item) {
  return item?.ruleExplanation ?? GRAMMAR_RULE_EXPLANATIONS[item?.explain] ?? ''
}

// 語形だけで4択を切れる問題では、解答前の和訳を答えのヒントにしない。
// それ以外は意味も判断材料になるため、和訳を問題の一部として明示する。
export function grammarQuestionNeedsMeaningCue(item) {
  if (typeof item?.meaningCueRequired === 'boolean') return item.meaningCueRequired
  return !choicesAreOneVisibleInflectionFamily(item?.choices ?? [])
}
