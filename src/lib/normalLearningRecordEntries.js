import { PHRASES } from '../data/phrases.js'
import { ETYMOLOGY_PACKS } from '../data/vocab.js'
import { KOTEN_WORDS } from '../data/koten.js'
import { KOTEN_GRAMMAR } from '../data/koten-grammar.js'
import { KOTEN_CULTURE } from '../data/koten-culture.js'
import { KANBUN_VOCAB } from '../data/kanbun-vocab.js'
import { KANBUN_GRAMMAR } from '../data/kanbun-grammar.js'
import { KANBUN_CULTURE } from '../data/kanbun-culture.js'

const entry = (id, label, contentId, screen, params, sourceFile, items) => Object.freeze({
  id,
  label,
  contentId,
  screen,
  params: Object.freeze(params),
  sourceFile,
  items: Object.freeze([...items]),
})

// 「暗記・テストの記録」ではなく、各教材の通常入口から開く一覧の監査母集団。
export const NORMAL_LEARNING_RECORD_ENTRIES = Object.freeze([
  entry('usage-idiom', '熟語', 'usage', 'phrases', { kind: 'idiom' }, 'src/screens/Phrases.jsx', PHRASES.filter((item) => item.kind === 'idiom')),
  entry('usage-syntax', '構文', 'usage', 'phrases', { kind: 'syntax' }, 'src/screens/Phrases.jsx', PHRASES.filter((item) => item.kind === 'syntax')),
  entry('etymology', '語源', 'etymology', 'roots', {}, 'src/screens/Roots.jsx', ETYMOLOGY_PACKS),
  entry('koten-vocab', '古文単語', 'koten-vocab', 'kotenList', {}, 'src/screens/KotenList.jsx', KOTEN_WORDS),
  entry('koten-grammar', '古文文法', 'koten-grammar', 'kotenGrammar', {}, 'src/screens/KotenGrammar.jsx', KOTEN_GRAMMAR),
  entry('koten-culture', '古文常識', 'koten-culture', 'kotenCulture', {}, 'src/screens/KotenCulture.jsx', KOTEN_CULTURE),
  entry('kanbun-vocab', '漢語', 'kanbun-vocab', 'kanbunCatalog', { domain: 'vocab' }, 'src/screens/KanbunCatalog.jsx', KANBUN_VOCAB),
  entry('kanbun-grammar', '漢文法', 'kanbun-grammar', 'kanbunCatalog', { domain: 'grammar' }, 'src/screens/KanbunCatalog.jsx', KANBUN_GRAMMAR),
  entry('kanbun-culture', '漢文常識', 'kanbun-culture', 'kanbunCatalog', { domain: 'culture' }, 'src/screens/KanbunCatalog.jsx', KANBUN_CULTURE),
])

export const NORMAL_LEARNING_RECORD_TOTAL = NORMAL_LEARNING_RECORD_ENTRIES.reduce(
  (sum, current) => sum + current.items.length,
  0,
)
