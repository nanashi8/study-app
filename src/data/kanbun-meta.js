export const KANBUN_LEVELS = Object.freeze([
  {
    id: 'middle',
    label: '中学入門',
    shortLabel: '中学',
    description: '訓読・基本語・故事成語を、語順から理解する',
    color: '#0f766e',
  },
  {
    id: 'basic',
    label: '高校基礎',
    shortLabel: '高校基礎',
    description: '再読文字・否定・疑問など定期テストの核を固める',
    color: '#0369a1',
  },
  {
    id: 'standard',
    label: '共通テスト・中堅大',
    shortLabel: '標準',
    description: '複数句法と文脈を結び、選択肢の根拠を説明する',
    color: '#4f46e5',
  },
  {
    id: 'advanced',
    label: '難関大',
    shortLabel: '難関',
    description: '省略・倒置・複合句法を含む長い一文を精読する',
    color: '#7e22ce',
  },
  {
    id: 'elite',
    label: '最難関大',
    shortLabel: '最難関',
    description: '思想・史伝・修辞の含意まで本文根拠で読み分ける',
    color: '#be123c',
  },
])

export const KANBUN_LEVEL_BY_ID = Object.freeze(
  Object.fromEntries(KANBUN_LEVELS.map((level) => [level.id, level])),
)

export const KANBUN_DOMAIN_META = Object.freeze({
  vocab: Object.freeze({
    id: 'vocab',
    label: '漢語',
    itemLabel: '語',
    emoji: '📖',
    color: '#0f766e',
    description: '重要漢字・熟語・虚字を、訓読と文中の働きで暗記',
    srsField: 'kanbunVocabSrs',
    listField: 'kanbunVocabList',
    analyticsSkill: 'kanbun_vocab',
  }),
  grammar: Object.freeze({
    id: 'grammar',
    label: '漢文法',
    itemLabel: '項目',
    emoji: '🧭',
    color: '#be123c',
    description: '返り点・再読文字・重要句法を、形と語順から見抜く',
    srsField: 'kanbunGrammarSrs',
    listField: 'kanbunGrammarList',
    analyticsSkill: 'kanbun_grammar',
  }),
  culture: Object.freeze({
    id: 'culture',
    label: '漢文常識',
    itemLabel: 'テーマ',
    emoji: '🏛️',
    color: '#7c3aed',
    description: '思想・歴史・文学・制度を、本文の判断材料として暗記',
    srsField: 'kanbunCultureSrs',
    listField: 'kanbunCultureList',
    analyticsSkill: 'kanbun_culture',
  }),
})

export function parseKanbunRows(raw, columns) {
  return String(raw)
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line, index) => {
      const values = line.split('|').map((value) => value.trim())
      if (values.length !== columns.length) {
        throw new Error(
          `漢文教材行${index + 1}の列数が不正です。期待:${columns.length} 実際:${values.length}`,
        )
      }
      return Object.fromEntries(columns.map((column, columnIndex) => [column, values[columnIndex]]))
    })
}

export function stableKanbunId(prefix, index) {
  return `${prefix}${String(index + 1).padStart(3, '0')}`
}
