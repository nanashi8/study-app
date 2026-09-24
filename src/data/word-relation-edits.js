// 類義語・反対語の欄を、単語データ（words*.js など）の外で直す台帳（人が1件ずつ読んで決めたもの）。
// 単語データを読みこむとき（vocab.js の normalize）に当てるので、辞書ページ・暗記カード・検索のどこでも同じ中身になる。
//
// RELATION_ADDITIONS … 足す項目 [見出し語 id, 'syn'|'ant', 英単語, 意味, 足した理由]
//   語の成り立ちや使い方の欄が名指しした語で、意味が近い・反対なのに欄になかったもの（rupture の erupt など）。
// RELATION_REMOVALS  … 外す項目 [見出し語 id, 'syn'|'ant', 英単語, 外した理由]
//   読んで、意味が同じ・近い語／反対・対照の語とは言えないと分かったもの。欄を移すときは外して足す。
// RELATION_MEANING_FIXES … 添えた意味を直す項目 [見出し語 id, 'syn'|'ant', 英単語, 直した意味]
export const RELATION_ADDITIONS = [
  ['accomplish', 'syn', 'complete', '完成させる', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['accretion', 'syn', 'increase', '増加・増える', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['adolescent', 'ant', 'adult', '大人・成人', '語の成り立ちで同じ語源と名指しした、意味が反対・対照の語'],
  ['adult', 'ant', 'adolescent', '思春期の若者', '語の成り立ちで同じ語源と名指しした、意味が反対・対照の語'],
  ['allure', 'syn', 'lure', '誘惑・おびき寄せるもの', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['amend', 'syn', 'mend', '直す・修理する', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['annotation', 'syn', 'note', '注・メモ', '使い方の欄で名指しした、意味の近い語'],
  ['antique', 'syn', 'ancient', '古代の・大昔の', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['apathy', 'ant', 'sympathy', '同情・共感', '語の成り立ちで同じ語源と名指しした、意味が反対・対照の語'],
  ['arc', 'syn', 'arch', 'アーチ・弓形', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['arch', 'syn', 'arc', '弧', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['attest', 'syn', 'testify', '証言する・証明する', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['biodegradable', 'syn', 'compostable', '堆肥化できる', '使い方の欄で名指しした、意味の近い語'],
  ['borrow', 'syn', 'rent', '(お金を払って)借りる・貸す', '使い方の欄で名指しした、意味の近い語'],
  ['breach', 'syn', 'break', '(約束・規則を)破る', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['can_2', 'syn', 'tin', '(イギリス英語で)缶', '使い方の欄で名指しした、意味の近い語'],
  ['captain', 'syn', 'chief', '(組織の)長', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['captivate', 'syn', 'capture', '(心を)とらえる', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['castigate', 'syn', 'chasten', '懲らしめる', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['causation', 'ant', 'correlation', '相関', '使い方の欄で名指しした、意味が反対・対照の語'],
  ['channel', 'syn', 'canal', '運河・水路', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['chasten', 'syn', 'castigate', '厳しく非難する・罰する', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['chill', 'syn', 'cold', '寒さ・冷たい', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['chromosome', 'syn', 'gene', '遺伝子', '使い方の欄で名指しした、意味の近い語'],
  ['clamber', 'syn', 'climb', '登る', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['cohesion', 'syn', 'coherence', '一貫性', '使い方の欄で名指しした、意味の近い語'],
  ['cold', 'syn', 'cool', '涼しい', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['comparatively', 'syn', 'relatively', '比較的', '使い方の欄で名指しした、意味の近い語'],
  ['complement', 'syn', 'complete', '完成させる', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['compostable', 'syn', 'biodegradable', '生分解性の', '使い方の欄で名指しした、意味の近い語'],
  ['conclude', 'syn', 'close', '(会などを)終える', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['confidence', 'syn', 'faith', '信頼・信仰', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['cool', 'syn', 'cold', '寒い・冷たい', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['correlation', 'syn', 'relation', '関係・関連', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['credence', 'syn', 'credit', '信用', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['crucially', 'syn', 'importantly', '重要なことに', '使い方の欄で名指しした、意味の近い語'],
  ['dataset', 'syn', 'data', 'データ・資料', '使い方の欄で名指しした、意味の近い語'],
  ['demand', 'syn', 'command', '命令する', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['depict', 'syn', 'picture', '(絵や言葉で)描く', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['domestic', 'ant', 'foreign', '外国の', '使い方の欄で名指しした、意味が反対・対照の語'],
  ['domestic', 'ant', 'international', '国際的な', '使い方の欄で名指しした、意味が反対・対照の語'],
  ['drag', 'syn', 'draw', '引く・引っぱる', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['duplicate', 'syn', 'double', '2倍にする・二重にする', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['elder', 'syn', 'old', '年をとった・年上の', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['erupt', 'syn', 'rupture', '破裂する・裂ける', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['excuse', 'ant', 'accuse', '責める・告発する', '語の成り立ちで同じ語源と名指しした、意味が反対・対照の語'],
  ['external', 'syn', 'exterior', '外側の・外部', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['famous', 'syn', 'notorious', '悪名高い', '使い方の欄で名指しした、意味の近い語'],
  ['feast', 'syn', 'festival', '祭り・祝祭', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['festival', 'syn', 'feast', '祝宴', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['filthy', 'syn', 'foul', '汚い・不快な', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['frail', 'syn', 'fragile', '壊れやすい・もろい', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['garden', 'syn', 'yard', '(家の)庭', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['grandiose', 'syn', 'grand', '壮大な・堂々とした', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['guarantee', 'syn', 'warrant', '保証する・正当化する', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['impel', 'syn', 'propel', '推進する・駆り立てる', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['important', 'syn', 'essential', '不可欠な', '使い方の欄で名指しした、意味の近い語'],
  ['inclusivity', 'syn', 'diversity', '多様性', '使い方の欄で名指しした、意味の近い語'],
  ['inept', 'ant', 'apt', '適切な・のみこみが早い', '語の成り立ちで同じ語源と名指しした、意味が反対・対照の語'],
  ['insist', 'syn', 'persist', 'やり続ける・固執する', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['juncture', 'syn', 'junction', '合流点・接合点', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['lecture', 'syn', 'lesson', '授業・レッスン', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['legal', 'syn', 'legitimate', '合法の・正当な', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['legitimate', 'syn', 'legal', '合法の', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['lend', 'syn', 'loan', '貸す・貸付', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['lesson', 'syn', 'lecture', '講義', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['loan', 'syn', 'lend', '貸す', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['loquacious', 'syn', 'eloquent', '雄弁な', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['male', 'syn', 'masculine', '男性的な・男らしい', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['marvel', 'syn', 'miracle', '奇跡', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['maximize', 'ant', 'minimize', '最小化する', '使い方の欄で名指しした、意味が反対・対照の語'],
  ['methodology', 'syn', 'method', '方法', '使い方の欄で名指しした、意味の近い語'],
  ['mom', 'syn', 'mama', 'ママ', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['month', 'syn', 'moon', '(空の)月', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['moon', 'syn', 'month', '(暦の)月', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['morality', 'syn', 'ethics', '倫理・倫理学', '使い方の欄で名指しした、意味の近い語'],
  ['negate', 'syn', 'deny', '否定する・拒む', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['never', 'ant', 'ever', 'これまでに・一度でも', '語の成り立ちで同じ語源と名指しした、意味が反対・対照の語'],
  ['nominate', 'syn', 'name', '(役職に)指名する', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['notice', 'syn', 'note', '(動詞で)気づく・注意する', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['novel', 'syn', 'new', '新しい', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['occupy', 'syn', 'capture', '(力ずくで)奪う・占領する', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['omit', 'syn', 'miss', '抜かす・見落とす', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['one', 'syn', 'a', '1つの・ある（不定冠詞）', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['one', 'syn', 'an', '1つの（母音の前の不定冠詞）', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['pathogen', 'syn', 'virus', 'ウイルス', '使い方の欄で名指しした、意味の近い語'],
  ['petite', 'syn', 'petty', 'ささいな', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['petty', 'syn', 'petite', '小柄な', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['poignant', 'syn', 'pungent', '刺激的な・鼻をつく', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['popular', 'syn', 'public', '公の・一般の人々の', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['proportion', 'syn', 'portion', '部分・一人前', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['public', 'syn', 'popular', '人気のある・一般の人々の', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['pungent', 'syn', 'poignant', '痛切な・心に突き刺さる', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['query', 'syn', 'inquire', '尋ねる・問い合わせる', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['quiescent', 'syn', 'quiet', '静かな・穏やかな', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['rear_2', 'syn', 'raise', '育てる', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['recover', 'syn', 'recuperate', '回復する', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['redundant', 'syn', 'abundant', '豊富な・あり余る', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['relate', 'syn', 'refer', '言及する・参照する', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['reliability', 'syn', 'validity', '妥当性', '使い方の欄で名指しした、意味の近い語'],
  ['request', 'syn', 'ask', '頼む', '使い方の欄で名指しした、意味の近い語'],
  ['resemble', 'syn', 'similar', '似ている・同様の', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['resolve', 'syn', 'solve', '解く・解決する', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['resplendent', 'syn', 'splendid', '見事な・すばらしい', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['reveal', 'ant', 'veil', '覆い隠す', '語の成り立ちで同じ語源と名指しした、意味が反対・対照の語'],
  ['revenge', 'syn', 'avenge', '復讐する・かたきを討つ', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['rob', 'syn', 'steal', '盗む', '使い方の欄で名指しした、意味の近い語'],
  ['rupture', 'syn', 'erupt', '噴き出す・噴火する', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['sever', 'syn', 'separate', '切り離す・分ける', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['shadow', 'syn', 'shade', '日陰', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['shelter', 'syn', 'shield', '保護する・盾', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['similar', 'syn', 'same', '同じ', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['singular', 'syn', 'single', '一つの・単一の', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['sleek', 'syn', 'slick', '滑らかな・巧妙な', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['slick', 'syn', 'sleek', 'つやのある・流線型の', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['sojourn', 'syn', 'journey', '旅・行程', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['sole', 'syn', 'solo', '単独の・ひとりで', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['solitary', 'syn', 'sole', '唯一の・単独の', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['splinter', 'syn', 'split', '割れる・分裂する', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['stance', 'syn', 'stand', '(名詞で)立場・態度', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['steal', 'syn', 'rob', '強奪する・奪う', '使い方の欄で名指しした、意味の近い語'],
  ['sully', 'syn', 'soil', '(動詞で)汚す', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['superb', 'syn', 'super', 'すばらしい', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['surcharge', 'syn', 'charge', '料金・請求する', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['theorem', 'ant', 'hypothesis', '仮説', '使い方の欄で名指しした、意味が反対・対照の語'],
  ['tow', 'syn', 'tug', 'ぐいと引く', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['tug', 'syn', 'tow', '牽引する・引いて運ぶ', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['utilize', 'syn', 'use', '使う', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['validity', 'syn', 'reliability', '信頼性', '使い方の欄で名指しした、意味の近い語'],
  ['vivacious', 'syn', 'vivid', '生き生きとした', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['void', 'syn', 'vacant', '空いている・うつろな', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['warrant', 'syn', 'guarantee', '保証する・保証', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
  ['what', 'syn', 'which', 'どれ・どちら', '語の成り立ちで同じ語源と名指しした、意味の近い語'],
]

export const RELATION_REMOVALS = [
]

export const RELATION_MEANING_FIXES = [
]

const lower = (text) => String(text ?? '').trim().toLowerCase()
const KINDS = { syn: 'synonyms', ant: 'antonyms' }

const EDITS = new Map()
const editsFor = (id, kind) => {
  if (!EDITS.has(id)) EDITS.set(id, {})
  const byKind = EDITS.get(id)
  if (!byKind[kind]) byKind[kind] = { add: [], remove: new Map(), fix: new Map() }
  return byKind[kind]
}
for (const [id, kind, w, m] of RELATION_ADDITIONS) editsFor(id, kind).add.push({ w, m })
for (const [id, kind, w, reason] of RELATION_REMOVALS) editsFor(id, kind).remove.set(lower(w), reason)
for (const [id, kind, w, m] of RELATION_MEANING_FIXES) editsFor(id, kind).fix.set(lower(w), m)

// 当てる先が単語データに見つからなかった「外す」「意味を直す」の項目（台帳が古くなった印）。確認スクリプトが読む。
export const UNMATCHED_RELATION_EDITS = []

/** 見出し語 id の類義語（'syn'）・反対語（'ant'）の欄に、台帳の直しを当てた項目を返す。 */
export function applyRelationEdits(id, kind, items) {
  const edits = EDITS.get(id)?.[kind]
  if (!edits) return items
  const present = new Set(items.map((item) => lower(item?.w)))
  for (const w of edits.remove.keys()) if (!present.has(w)) UNMATCHED_RELATION_EDITS.push(`${id} の${KINDS[kind]}に ${w} がない（外す）`)
  for (const w of edits.fix.keys()) if (!present.has(w) || edits.remove.has(w)) UNMATCHED_RELATION_EDITS.push(`${id} の${KINDS[kind]}に ${w} がない（意味を直す）`)
  for (const item of edits.add) if (present.has(lower(item.w)) && !edits.remove.has(lower(item.w))) UNMATCHED_RELATION_EDITS.push(`${id} の${KINDS[kind]}に ${item.w} がもうある（足す）`)
  const kept = items
    .filter((item) => !edits.remove.has(lower(item?.w)))
    .map((item) => (edits.fix.has(lower(item?.w)) ? { ...item, m: edits.fix.get(lower(item.w)) } : item))
  return [...kept, ...edits.add]
}
