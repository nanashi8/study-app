// 語法問題が問う「語法の型」。英検の短文の語句空所補充で実際に問われるものだけを置く。
//
// 語法＝その語がどの語と結び付くか、その語が後ろにどんな形をとるか。
//   「この語だから、こう言う」と、語ごとに覚える知識を問う。
// 文法＝規則がどの語にも同じように当てはまるもの（時制・相の形、主語と動詞の一致、
//   語順・倒置、付加疑問、感嘆文、関係詞や接続詞の選択、仮定法の形、冠詞の a / an、
//   代名詞の格など）。これらは語法ではないので、選択問題として出す。
//
// 2026-09-24、利用者の「語法問題の品質は英検で実際に問われる語法となっているか」への答えとして、
// 語法問題を1問ずつ読み直し、文法の規則で決まる問題を選択問題へ移したうえで、
// 残った全問にこの型を付けた。

export const USAGE_KINDS = Object.freeze({
  phrasal: Object.freeze({
    id: 'phrasal',
    name: '句動詞・動詞＋前置詞',
    description: '動詞と前置詞・副詞が組んで1つの意味になる言い方（get up・look for・take part in）',
  }),
  verbNoun: Object.freeze({
    id: 'verbNoun',
    name: '動詞＋名詞の決まった組み合わせ',
    description: 'その名詞にはこの動詞を使うという決まり（do one’s homework・take a picture・make a mistake）',
  }),
  verbForm: Object.freeze({
    id: 'verbForm',
    name: '動詞の語法（後ろにとる形）',
    description: '語ごとに決まる後ろの形や語順（finish＋動詞ing・promise＋to＋原形・let＋人＋原形・tell＋人＋物）',
  }),
  adjPrep: Object.freeze({
    id: 'adjPrep',
    name: '形容詞・分詞＋前置詞',
    description: 'be動詞や分詞と組む決まった前置詞（be good at・be covered with・be subject to）',
  }),
  noun: Object.freeze({
    id: 'noun',
    name: '名詞の語法',
    description: '数えられるかどうか、数え方、名詞と組む前置詞（a glass of・a pair of・the cancellation of）',
  }),
  preposition: Object.freeze({
    id: 'preposition',
    name: '前置詞の使い分け',
    description: '時・場所・期間を表す前置詞の選び分け（at seven・in April・for と since・by と until）',
  }),
  confusable: Object.freeze({
    id: 'confusable',
    name: '紛らわしい語の使い分け',
    description: '意味の近い語のどちらを使うか（many と much・few と little・say と tell・surprised と surprising）',
  }),
  setPhrase: Object.freeze({
    id: 'setPhrase',
    name: '決まり文句・慣用表現',
    description: 'まとまりで覚える言い方（not ... at all・cannot help ～ing・It takes 人 時間 to ～・may well）',
  }),
})

export const USAGE_KIND_IDS = Object.freeze(Object.keys(USAGE_KINDS))

export const usageKind = (id) => USAGE_KINDS[id] ?? null
