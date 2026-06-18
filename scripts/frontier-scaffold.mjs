// フロンティアの語を「ほぼ完成の下書き」に自動展開する足場ジェネレータ。
//   npm run scaffold 120  → 上位120語を src/data/_scaffold.js に出力。
// 機械的に決まる部分（品詞・語源・分野・語族・級）を接尾辞ルールと既存語から自動推定し、
// 例文だけ 'EN?'/'JA?' のプレースホルダにする。人手は「例文を書く＋推定の確認」のみ＝高速化。
import { writeFileSync } from 'node:fs'
import { ALL_WORDS, WORDS_BY_ID } from '../src/data/vocab.js'

const N = Number(process.argv[2]) || 120
const frontier = JSON.parse(
  (await import('node:fs')).readFileSync(new URL('../vocab-frontier.json', import.meta.url), 'utf8'),
)
const ids = new Set(ALL_WORDS.map((w) => w.id))

// 接尾辞 → [品詞, 基語の候補を返す関数(複数可), 接尾辞表示]。基語が既存見出し語のときだけ語源を採用。
const deY = (s) => (s.endsWith('i') ? s.slice(0, -1) + 'y' : s)
const SUF = [
  ['ness', '名', (s) => [deY(s.slice(0, -4))], '-ness'],
  ['ment', '名', (s) => [s.slice(0, -4), s.slice(0, -4) + 'e'], '-ment'],
  ['ization', '名', (s) => [s.slice(0, -7) + 'ize'], '-ization'],
  ['ation', '名', (s) => [s.slice(0, -5) + 'ate', s.slice(0, -5) + 'e', s.slice(0, -3)], '-ation'],
  ['ition', '名', (s) => [s.slice(0, -5) + 'e', s.slice(0, -5)], '-ition'],
  ['sion', '名', (s) => [s.slice(0, -4) + 'd', s.slice(0, -4) + 'de', s.slice(0, -3) + 't'], '-sion'],
  ['tion', '名', (s) => [s.slice(0, -4) + 'te', s.slice(0, -4), s.slice(0, -3) + 'e'], '-tion'],
  ['ity', '名', (s) => [s.slice(0, -3) + 'e', s.slice(0, -3), s.slice(0, -3) + 'le'], '-ity'],
  ['ance', '名', (s) => [s.slice(0, -4), s.slice(0, -4) + 'e'], '-ance'],
  ['ence', '名', (s) => [s.slice(0, -4), s.slice(0, -4) + 'e'], '-ence'],
  ['er', '名', (s) => [s.slice(0, -2), s.slice(0, -1)], '-er'],
  ['or', '名', (s) => [s.slice(0, -2) + 'e', s.slice(0, -2)], '-or'],
  ['ize', '動', (s) => [s.slice(0, -3), s.slice(0, -3) + 'e'], '-ize'],
  ['ify', '動', (s) => [s.slice(0, -3), s.slice(0, -3) + 'y'], '-ify'],
  ['en', '動', (s) => [s.slice(0, -2)], '-en'],
  ['ful', '形', (s) => [s.slice(0, -3)], '-ful'],
  ['less', '形', (s) => [s.slice(0, -4)], '-less'],
  ['ous', '形', (s) => [s.slice(0, -3), s.slice(0, -3) + 'e'], '-ous'],
  ['ive', '形', (s) => [s.slice(0, -3) + 'e', s.slice(0, -3)], '-ive'],
  ['able', '形', (s) => [s.slice(0, -4) + 'e', s.slice(0, -4)], '-able'],
  ['ible', '形', (s) => [s.slice(0, -4) + 'e', s.slice(0, -4)], '-ible'],
  ['ic', '形', (s) => [s.slice(0, -2), s.slice(0, -2) + 'y'], '-ic'],
  ['ly', '副', (s) => [deY(s.slice(0, -2))], '-ly'],
]

// 日本語訳から品詞を当てる（接尾辞が効かないとき）。
function posFromGloss(m) {
  const g = m.split('・')[0]
  if (/する$|せる$|る$|う$|む$|ぶ$|す$|つ$|ぐ$|く$|ける$/.test(g)) return '動'
  if (/な$|い$/.test(g)) return '形'
  if (/に$|的に$/.test(g)) return '副'
  return '名'
}

const broadField = { 動: '動作・行為', 形: '性質・状態', 副: '副詞', 名: '一般' }

function scaffold(word, meaning) {
  const w = word.toLowerCase()
  let pos = null, ety = 'TODO語源', fam = null, field = null, level = 'pre1'
  for (const [suf, p, restore, label] of SUF) {
    if (w.endsWith(suf) && w.length > suf.length + 2) {
      // 基語候補のうち「既存の見出し語」だけ採用＝誤分解を出さない高精度方針。
      const base = restore(w).find((b) => WORDS_BY_ID[b])
      if (base) {
        const be = WORDS_BY_ID[base]
        pos = p
        ety = `${base}(${be.meaning.split('・')[0]})+ ${label}`
        fam = base
        field = be.field || null
        level = be.level || 'pre1'
        break
      }
      // 基語が未収録でも品詞だけは接尾辞から推定（語源は手入力に回す）。
      if (!pos) pos = p
    }
  }
  if (!pos) pos = posFromGloss(meaning)
  if (!field) field = broadField[pos]
  return { word, pos, level, meaning, ety, fam, field }
}

const picked = frontier.filter((f) => /^[a-z]+$/i.test(f.word) && !ids.has(f.word.toLowerCase())).slice(0, N)
const lines = picked.map((f) => {
  const s = scaffold(f.word, f.meaning)
  const extra = ['field: ' + JSON.stringify(s.field)]
  if (s.fam) extra.unshift(`fam: [{ w: ${JSON.stringify(s.fam)}, m: ${JSON.stringify((WORDS_BY_ID[s.fam]?.meaning || '').split('・')[0])} }]`)
  return `  [${JSON.stringify(s.word)}, ${JSON.stringify(s.pos)}, ${JSON.stringify(s.level)}, ${JSON.stringify(s.meaning)}, 'EN?', 'JA?', ${JSON.stringify(s.ety)}, { ${extra.join(', ')} }],`
})

const out = `// 足場（npm run scaffold 生成）— 例文(EN?/JA?)を書き、TODO語源を埋め、品詞/級を確認したら words<N>.js にする。
import { expandCompact } from './compact.js'

const RAW = [
${lines.join('\n')}
]

export const WORDS_MORE_SCAFFOLD = RAW.map(expandCompact)
`
writeFileSync(new URL('../src/data/_scaffold.js', import.meta.url), out)
const autoEty = picked.filter((f) => !scaffold(f.word, f.meaning).ety.startsWith('TODO')).length
console.log(`足場 ${picked.length}語 → src/data/_scaffold.js`)
console.log(`  語源 自動 ${autoEty}語 / 要手入力(TODO) ${picked.length - autoEty}語`)
console.log('  例文 EN?/JA? を埋め、TODO語源を補い、品詞/級を確認 → words<N>.js にリネームして取り込む。')
