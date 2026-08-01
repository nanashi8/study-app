export const TRANSLATION_ROLE_META = Object.freeze({
  LINK: Object.freeze({
    code: '接続',
    label: 'つなぎ・構文の合図',
    question: '後ろをどんな関係で足すか',
    japaneseShape: '「もし」「なぜなら」「そして」など',
  }),
  S: Object.freeze({
    code: 'S',
    label: '主語',
    question: 'だれが・何が',
    japaneseShape: '「〜は／〜が」',
  }),
  V: Object.freeze({
    code: 'V',
    label: '動詞',
    question: 'どうする・どんな状態だ',
    japaneseShape: '「〜する／〜である」',
  }),
  O: Object.freeze({
    code: 'O',
    label: '目的語',
    question: '何を・だれを',
    japaneseShape: '「〜を」',
  }),
  O1: Object.freeze({
    code: 'O1',
    label: '間接目的語',
    question: 'だれに',
    japaneseShape: '「〜に」',
  }),
  O2: Object.freeze({
    code: 'O2',
    label: '直接目的語',
    question: '何を',
    japaneseShape: '「〜を」',
  }),
  C: Object.freeze({
    code: 'C',
    label: '補語',
    question: 'S・Oは何か／どんな状態か',
    japaneseShape: '「〜だ／〜に」',
  }),
  M: Object.freeze({
    code: 'M',
    label: '修飾語',
    question: 'いつ・どこで・どのように・なぜ',
    japaneseShape: '「〜で／〜に／〜なので」など',
  }),
})

export function translationRoleMeta(role) {
  return TRANSLATION_ROLE_META[role] ?? TRANSLATION_ROLE_META.M
}

export function translationRoleHeading(roles, scope = '') {
  const normalized = (roles ?? []).filter(Boolean)
  const sequence = normalized
    .map((role) => translationRoleMeta(role).code)
    .join(' → ')
  return [scope, sequence].filter(Boolean).join('・')
}

export function translationRoleExplanation(roles, ja, scope = '') {
  const normalized = (roles ?? []).filter(Boolean)
  const prefix = scope
    ? scope.endsWith('内')
      ? `${scope}では、`
      : `${scope}の中で、`
    : ''
  if (!normalized.length) {
    return `${prefix}「${ja}」を、直前までの意味へ英語の順で足します。`
  }
  if (normalized.length === 1) {
    const meta = translationRoleMeta(normalized[0])
    return `${prefix}${meta.code}（${meta.label}）は「${meta.question}」を示す部分です。直訳では${meta.japaneseShape}の形で「${ja}」と置きます。`
  }
  const route = normalized
    .map((role) => {
      const meta = translationRoleMeta(role)
      return `${meta.code}（${meta.label}）`
    })
    .join('→')
  return `${prefix}この短いまとまりには${route}が続きます。「${ja}」の中でも、この順を意識します。`
}
