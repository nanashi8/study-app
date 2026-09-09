// 同じ語の単数形と複数形が、それぞれ別の単語カードになっている組の台帳。
//
// なぜ要るか:
// 単語カードは1見出し1枚で、覚え具合(SRS)も1見出しに1つ持つ。
// 単数形と複数形を別々に登録すると、同じことを二度覚えさせることになり、
// さらに片方の代表義がもう片方の誤答選択肢に出て「正解なのに不正解」になりうる。
//
// 別見出しを立ててよいのは、複数形にその形でしか出ない意味があるときだけ。
// 意味が単数形と重なるだけの複数形は、本来は見出しを立てない。
//
// 「その形でしか出ない意味かどうか」は辞書の判断で、意味欄の文字列からは決まらない。
// 書き方が違うだけの組（fee「料金・謝礼」と fees「料金・手数料」）は、
// 文字列としては一部しか重ならないが、複数形固有の意味は持っていない。
// そこで下の PLURAL_ONLY_SENSES に人が書き、検査はその台帳だけを見る。
//
// ここに並ぶのは、その原則ができる前に登録された組。
// 消すと手動確認済みの語源カード（ETYMOLOGY_PACKS）が参照している見出しが
// 欠けるため、いまは残したままにしてある。新しく同じ形を足すことは
// scripts/check-data.mjs が止める。台帳から消えた組は「もう重複ではない」
// ことを意味するので、直したら必ずここからも消す（検査が両方向を見る）。
// その形でしか出ない意味を持つ複数形。単数形と意味が重なっていても別見出しでよい。
// 判断は辞書を見て人が書く。ここに無い複数形は、単数形と意味が重なった時点で重複とみなす。
export const PLURAL_ONLY_SENSES = Object.freeze({
  manners: '作法・行儀（単数の manner は「方法」で、行儀の意味は持たない）',
  arms: '兵器・武器（単数の arm は「腕」）',
  goods: '商品・品物（単数の good は形容詞「良い」）',
  glasses: 'めがね（単数の glass は「ガラス・コップ」）',
  riches: '富・財産（単数形は形容詞 rich）',
  economics: '経済学（学問名。単数扱いの動詞を取る）',
  ethics: '倫理学（学問名。an ethic は「道徳原則」で別）',
  brains: '知力・頭のよさ（He has brains. 単数の brain は器官の「脳」）',
  means: '手段・方法（単複同形。動詞 mean とは別）',
  clothes: '衣服（単数形を持たない）',
  belongings: '所持品・持ち物（単数形を持たない）',
  surroundings: '周辺・環境（単数形を持たない）',
})

export const KNOWN_DUPLICATE_FORMS = Object.freeze({
  // 手動確認済みの語源カードが見出しとして参照している（消すと語源カードが壊れる）
  products: Object.freeze({ singular: 'product', packs: 'root:duct, root:pf-pro' }),
  armaments: Object.freeze({ singular: 'armament', packs: 'root:arma' }),
  germs: Object.freeze({ singular: 'germ', packs: 'root:germ' }),
  microbes: Object.freeze({ singular: 'microbe', packs: 'root:bio' }),
  allegations: Object.freeze({ singular: 'allegation', packs: 'root:lex, root:pf-ad' }),
  facts: Object.freeze({ singular: 'fact', packs: 'root:fact' }),
  announcements: Object.freeze({ singular: 'announcement', packs: 'root:nounce, root:pf-ad' }),
  descendants: Object.freeze({ singular: 'descendant', packs: 'root:scend, root:pf-de' }),
  heirs: Object.freeze({ singular: 'heir', packs: 'root:heres' }),

  // 語源カードは参照していないが、収録リスト側がその形を挙げている
  weapons: Object.freeze({ singular: 'weapon', packs: '' }),
  accusations: Object.freeze({ singular: 'accusation', packs: '' }),
  assertions: Object.freeze({ singular: 'assertion', packs: '' }),
  declarations: Object.freeze({ singular: 'declaration', packs: '' }),
  ancestors: Object.freeze({ singular: 'ancestor', packs: '' }),
  grapes: Object.freeze({ singular: 'grape', packs: '' }),
  socks: Object.freeze({ singular: 'sock', packs: '' }),

  // 意味欄の書き方が違うだけで、複数形固有の意味は持たない組
  costs: Object.freeze({ singular: 'cost', packs: '' }),
  fees: Object.freeze({ singular: 'fee', packs: '' }),
  wages: Object.freeze({ singular: 'wage', packs: '' }),
  forces: Object.freeze({ singular: 'force', packs: 'root:fort' }),
})

// 不規則な複数形。綴りの規則では単数形へ戻せないので表で持つ。
export const IRREGULAR_PLURALS = Object.freeze({
  children: 'child', people: 'person', feet: 'foot', teeth: 'tooth',
  men: 'man', women: 'woman', mice: 'mouse', geese: 'goose',
  criteria: 'criterion', phenomena: 'phenomenon', data: 'datum', media: 'medium',
  bacteria: 'bacterium', analyses: 'analysis', crises: 'crisis', theses: 'thesis',
  hypotheses: 'hypothesis', indices: 'index', appendices: 'appendix',
  stimuli: 'stimulus', fungi: 'fungus', nuclei: 'nucleus', lives: 'life',
})

// 複数形から単数形になりうる綴りを返す。当たった見出しが実在するかは呼び出し側が見る。
export function singularCandidates(word) {
  const lower = String(word ?? '').toLowerCase()
  if (IRREGULAR_PLURALS[lower]) return [IRREGULAR_PLURALS[lower]]
  if (!lower.endsWith('s') || lower.length < 4) return []
  const forms = [lower.slice(0, -1)]
  if (lower.endsWith('es')) forms.push(lower.slice(0, -2))
  if (lower.endsWith('ies')) forms.push(`${lower.slice(0, -3)}y`)
  if (lower.endsWith('ves')) forms.push(`${lower.slice(0, -3)}f`, `${lower.slice(0, -3)}fe`)
  return forms
}
