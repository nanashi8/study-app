// 文法の「系統」＝級をまたいで同じ文法概念が発展していく筋道。
//
// 級ごとの単元名は級の中で完結するよう付けてあるため、同じ概念でも級が変わると
// 名前が変わる（比較 → 比較応用 → 比較構文 → 高度比較）。そのままでは
// 「比較を下の級から順に鍛える」学習ができないので、ここで単元名を系統へ束ねる。
//
// topics は [級, 単元名] のタプルを易→難の順に並べる。単元名は grammar.js の
// topic と完全一致していなければならず、GRAMMAR に実在する全ての(級,単元)の組を
// 過不足なく1系統ずつ持つことを check-data.mjs が強制する（分類漏れ＝学習漏れのため）。

import { GRAMMAR, grammarByTopic } from './grammar.js'
import { LEVELS } from './levels.js'

const LEVEL_ORDER = LEVELS.map((level) => level.id)

export const GRAMMAR_STRANDS = Object.freeze([
  {
    id: 'sentence-basics',
    name: '文の基本と文型',
    emoji: '🧱',
    summary: 'be動詞・一般動詞の文から、SVOO / SVOC、形式目的語や無生物主語まで',
    topics: [
      ['5', 'be動詞'],
      ['5', '一般動詞・3単現'],
      ['4', 'There is/are'],
      ['3', '文型(SVOO/SVOC)'],
      ['2', '形式目的語'],
      ['2', '無生物主語'],
    ],
  },
  {
    id: 'negation-question',
    name: '否定文・疑問文',
    emoji: '❓',
    summary: 'do/does の否定・疑問から、疑問詞、間接疑問、付加疑問、部分否定まで',
    topics: [
      ['5', '否定文・疑問文'],
      ['5', '疑問詞'],
      ['4', '疑問詞+不定詞'],
      ['4', '付加疑問'],
      ['3', '付加疑問'],
      ['3', '間接疑問'],
      ['pre2', '間接疑問'],
      ['2', '部分否定'],
    ],
  },
  {
    id: 'imperative-exclamation',
    name: '命令文・感嘆文',
    emoji: '📣',
    summary: '主語を省く命令文・Let’s と、What / How で始まる感嘆文',
    topics: [
      ['5', '命令文'],
      ['4', '感嘆文'],
    ],
  },
  {
    id: 'noun-article-quantity',
    name: '名詞・冠詞・数量',
    emoji: '🔢',
    summary: '複数形と a / the の使い分けから、few / little などの数量表現まで',
    topics: [
      ['5', '名詞の複数形'],
      ['5', '冠詞'],
      ['pre2', '数量表現'],
      ['1', '限定詞・数量'],
    ],
  },
  {
    id: 'pronoun',
    name: '代名詞',
    emoji: '👤',
    summary: '格変化と this / that から、one・the other・others、再帰代名詞まで',
    topics: [
      ['5', '代名詞'],
      ['5', '指示語'],
      ['4', '代名詞'],
      ['pre2', '代名詞'],
      ['pre2', '再帰代名詞'],
    ],
  },
  {
    id: 'preposition',
    name: '前置詞',
    emoji: '📍',
    summary: '時と場所の基本から、by / until の対比、despite など句を作る前置詞まで',
    topics: [
      ['5', '前置詞'],
      ['3', '前置詞'],
      ['pre2', '前置詞'],
    ],
  },
  {
    id: 'tense',
    name: '時制（現在・過去・未来）',
    emoji: '⏱️',
    summary: '進行形・過去形・未来表現から、時制の一致と相の使い分けまで',
    topics: [
      ['5', '現在進行形'],
      ['4', '過去形'],
      ['4', '未来表現'],
      ['4', '過去進行形'],
      ['1', '時制・相'],
    ],
  },
  {
    id: 'modal',
    name: '助動詞',
    emoji: '🗝️',
    summary: 'can の基本から、have to / had better、助動詞＋have done の推量まで',
    topics: [
      ['5', '助動詞 can'],
      ['4', '助動詞'],
      ['pre2', 'had better'],
      ['2', '助動詞+have done'],
      ['2', '助動詞・義務'],
      ['pre1', '助動詞'],
      ['1', '助動詞・推量'],
    ],
  },
  {
    id: 'comparison',
    name: '比較',
    emoji: '⚖️',
    summary: '原級・比較級・最上級から、倍数表現・最上級相当・クジラ構文まで',
    topics: [
      ['4', '比較'],
      ['3', '比較応用'],
      ['pre2', '比較応用'],
      ['2', '比較応用'],
      ['pre1', '比較構文'],
      ['pre1', 'クジラ構文'],
      ['1', '高度比較'],
    ],
  },
  {
    id: 'infinitive',
    name: '不定詞',
    emoji: '🎯',
    summary: '3用法の基本から、too/enough・形式主語、原形不定詞、be to 構文まで',
    topics: [
      ['4', '不定詞'],
      ['3', '不定詞応用'],
      ['3', '原形不定詞'],
      ['pre2', 'it...to/for'],
      ['pre2', 'too/enough'],
      ['pre2', '目的の表現'],
      ['2', '完了不定詞'],
      ['2', 'be to構文'],
      ['pre1', 'be to構文'],
    ],
  },
  {
    id: 'gerund',
    name: '動名詞',
    emoji: '🌀',
    summary: '動名詞の基本と、動詞ごとの使い分け、look forward to などの慣用表現',
    topics: [
      ['4', '動名詞'],
      ['3', '動詞と不定詞・動名詞'],
      ['pre2', '動名詞の慣用'],
      ['2', '動名詞の慣用'],
    ],
  },
  {
    id: 'conjunction',
    name: '接続詞と副詞節',
    emoji: '🔗',
    summary: 'and / but / when から、so…that、相関接続詞、接続副詞、譲歩節まで',
    topics: [
      ['4', '接続詞'],
      ['3', '接続詞'],
      ['3', 'so...that'],
      ['pre2', '接続詞'],
      ['pre2', '相関接続詞'],
      ['pre2', 'so/such...that'],
      ['2', '接続詞'],
      ['2', '接続副詞'],
      ['pre1', '譲歩'],
    ],
  },
  {
    id: 'used-to',
    name: 'used to・過去の習慣',
    emoji: '🕰️',
    summary: 'used to＋原形の過去の習慣と、be / get used to＋動名詞の「慣れ」の対比',
    topics: [
      ['4', 'used to'],
      ['pre2', '過去の習慣'],
      ['pre2', 'used to / be used to'],
    ],
  },
  {
    id: 'perfect',
    name: '完了形',
    emoji: '⏳',
    summary: '現在完了の3用法から、完了進行形・過去完了・未来完了まで',
    topics: [
      ['3', '現在完了'],
      ['3', '現在完了進行形'],
      ['pre2', '現在完了進行形'],
      ['pre2', '過去完了'],
      ['2', '過去完了進行形'],
      ['2', '完了形応用'],
    ],
  },
  {
    id: 'passive',
    name: '受動態',
    emoji: '🔄',
    summary: 'be＋過去分詞の作り方と、助動詞・完了形と組み合わせた受動態',
    topics: [
      ['3', '受動態'],
    ],
  },
  {
    id: 'participle',
    name: '分詞・分詞構文',
    emoji: '🍃',
    summary: '名詞を修飾する分詞から、分詞構文・独立分詞構文・付帯状況まで',
    topics: [
      ['3', '分詞'],
      ['pre2', '分詞'],
      ['pre2', '分詞構文'],
      ['2', '分詞構文'],
      ['pre1', '独立分詞構文'],
      ['pre1', '分詞構文応用'],
      ['pre1', '付帯状況'],
    ],
  },
  {
    id: 'relative',
    name: '関係詞',
    emoji: '🪢',
    summary: '関係代名詞の主格・目的格から、関係副詞・継続用法・連鎖・複合関係詞まで',
    topics: [
      ['3', '関係代名詞'],
      ['pre2', '関係副詞'],
      ['pre2', '関係代名詞(継続)'],
      ['pre2', '関係代名詞 what'],
      ['pre2', '前置詞+関係代名詞'],
      ['2', '関係代名詞 what'],
      ['2', '関係代名詞 whose'],
      ['2', '関係代名詞応用'],
      ['pre1', '連鎖関係詞'],
      ['pre1', '複合関係詞'],
      ['pre1', 'whatever等'],
      ['1', '関係詞応用'],
    ],
  },
  {
    id: 'subjunctive',
    name: '仮定法',
    emoji: '🌙',
    summary: '仮定法過去の基本から、過去完了・if の省略と倒置・慣用表現まで',
    topics: [
      ['3', '仮定法(基礎)'],
      ['pre2', '仮定法(基礎)'],
      ['2', '仮定法'],
      ['2', '仮定法過去完了'],
      ['pre1', '仮定法応用'],
      ['1', '仮定法・語法'],
    ],
  },
  {
    id: 'causative-perception',
    name: '使役・知覚動詞',
    emoji: '👀',
    summary: 'make / let / have＋原形と、see / hear＋O＋原形・ing の使い分け',
    topics: [
      ['pre2', '使役・知覚'],
      ['2', '使役'],
    ],
  },
  {
    id: 'noun-clause',
    name: '名詞節・同格',
    emoji: '📦',
    summary: 'that / whether が作る名詞節と、名詞の内容を説明する同格の that',
    topics: [
      ['2', '名詞節'],
      ['pre1', '名詞節'],
      ['pre1', '同格'],
    ],
  },
  {
    id: 'inversion-emphasis',
    name: '倒置・強調',
    emoji: '💥',
    summary: '強調の do と It is … that の強調構文から、否定語句の文頭倒置まで',
    topics: [
      ['2', '倒置'],
      ['2', '強調'],
      ['2', '強調構文'],
      ['pre1', '倒置'],
      ['pre1', '強調'],
      ['1', '倒置・強調'],
      ['1', '強調・倒置'],
    ],
  },
  {
    id: 'reported-speech',
    name: '話法',
    emoji: '💬',
    summary: '直接話法から間接話法への転換と、時制・代名詞・副詞の書き換え',
    topics: [
      ['2', '話法'],
      ['pre1', '話法'],
    ],
  },
  {
    id: 'ellipsis',
    name: '省略・代用',
    emoji: '✂️',
    summary: '副詞節中の〈S＋be〉の省略と、do so・one など繰り返しを避ける代用表現',
    topics: [
      ['pre1', '省略'],
      ['1', '省略・代用'],
    ],
  },
  {
    id: 'agreement',
    name: '主語と動詞の一致',
    emoji: '⚙️',
    summary: '主語の数と動詞を合わせる原則と、紛らわしい主語での判断',
    topics: [
      ['pre1', '一致'],
      ['1', '主語と動詞の一致'],
    ],
  },
  {
    id: 'advanced-usage',
    name: '高度語法',
    emoji: '🎓',
    summary: 'cannot be too ~ や as it were などの慣用表現と、祈願文',
    topics: [
      ['1', '高度語法'],
      ['1', '祈願文'],
    ],
  },
])

// 単元名は「関係代名詞 what」「used to / be used to」のように空白を含むため、
// (級,単元)のキーは空白ではなくNUL区切りで一本化する。分類表とGRAMMAR側で
// 別々に組み立てると突き合わせが静かに失敗するので、必ずこの関数を通す。
export const grammarTopicKey = (level, topic) => `${level}\u0000${topic}`

const strandById = new Map(GRAMMAR_STRANDS.map((strand) => [strand.id, strand]))

const strandByTopicKey = new Map(
  GRAMMAR_STRANDS.flatMap((strand) =>
    strand.topics.map(([level, topic]) => [grammarTopicKey(level, topic), strand]),
  ),
)

export const getGrammarStrand = (id) => strandById.get(id) ?? null

// ある(級,単元)がどの系統に属するか。級別画面から系統へ橋渡しするために使う。
export const grammarStrandForTopic = (level, topic) =>
  strandByTopicKey.get(grammarTopicKey(level, topic)) ?? null

// 系統が実際に扱う級を、易→難の順で返す。
export function grammarStrandLevels(strand) {
  if (!strand) return []
  const seen = new Set(strand.topics.map(([level]) => level))
  return LEVEL_ORDER.filter((level) => seen.has(level))
}

// 系統×級の問題。級を省くとその系統の全問題。
export function grammarStrandQuestions(strand, level = null) {
  if (!strand) return []
  return strand.topics
    .filter(([topicLevel]) => level == null || topicLevel === level)
    .flatMap(([topicLevel, topic]) => grammarByTopic(topicLevel, topic))
}

export const GRAMMAR_STRAND_COUNT = GRAMMAR_STRANDS.length

// 分類漏れ検出用。GRAMMAR に実在する(級,単元)の全組。
export function grammarTopicPairs() {
  return [...new Set(GRAMMAR.map((item) => grammarTopicKey(item.level, item.topic)))]
}
