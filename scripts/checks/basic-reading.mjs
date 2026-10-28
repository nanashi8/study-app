// 基礎長文の検査：本文の語の級、熟語、テーマ、ルールの学習、長さ。
//   node scripts/checks/basic-reading.mjs            … 問題をすべて出す（0件なら終了コード0）
//   node scripts/checks/basic-reading.mjs --phrases  … 本文に当たる熟語の候補を長文ごとに出す（作るときの道具）
import {
  BASIC_READING_LENGTH,
  BASIC_READING_KINDS,
  BASIC_READING_LEVEL_IDS,
  BASIC_READING_PASSAGES,
  BASIC_READING_THEMES,
  basicReadingPassagesForLevel,
} from '../../src/data/basic-reading/index.js'
import { READING_RULES, READING_RULES_BY_ID } from '../../src/data/reading-rules.js'
import { PHRASES, getPhrase } from '../../src/data/phrases.js'
import { getWord, vocabFieldGroupFor, VOCAB_FIELD_GROUPS, wordsByLevel } from '../../src/data/vocab.js'
import {
  basicReadingLevelWords,
  basicReadingParagraphs,
  basicReadingTokens,
  basicReadingWordCount,
  levelRank,
} from '../../src/lib/basicReading.js'
import { compilePhrase, phraseAnchors, phraseInSentence, sentenceTokens } from './reading-prep-alignment.mjs'

// 段落の流れ・文章の種類・読み分けを学ぶルールは、段落が2つ以上ある長文で学ぶ。
export const MULTI_PARAGRAPH_RULES = new Set(['paragraph-map', 'genre-prediction', 'purpose-first', 'reading-mode'])

// 1本の長文で確かめる、その級の見出し語の数の下限（級の語彙を身につけるため）。
export const MIN_LEVEL_WORDS = 8

// 熟語の照合器で本文に当たっても、熟語として使っていない語の並び（長文id|熟語id → 理由）。
export const BASIC_READING_PHRASE_NOT_USED = Object.freeze({
  'br5_big_sale|exam_idm_be_from': 'is from Friday to Sunday は期間の from で、「〜出身だ」の be from ではない',
  'br4_autumn_event|curr1900_idm_4_see_you': 'We hope to see you there は「会えるのを楽しみにしている」で、別れのあいさつの See you. ではない',
  'br4_himeji_trip|jr_idm_take_a_to_b': 'took a trip to Himeji は take a trip（旅行する）で、「AをBに連れて行く」ではない',
  'br4_himeji_trip|curr_idm_4_more_than': 'more than before は比較級 more と than で「前よりもっと」。数量が「〜を超える」の more than ではない',
  'br4_email_emma|jr_idm_like_to_do': 'would like to try は「〜してみたい」で、「〜するのが好きだ」の like to do ではない',
  'br4_reading_club|jr_idm_stay_in': 'must stay in the library は「図書館の中にとどまる（持ち出さない）」で、「〜に滞在する」ではない',
  'br3_river_clean_up|curr_idm_3_work_for': 'work for three hours は「3時間働く」で、「〜に勤める・〜のために働く」の work for ではない',
  'br3_helen_keller|jr_idm_come_to_do': 'came to her house は「家に来た」で、「〜するようになる」の come to do ではない',
  'br3_christmas_australia|exam_idm_come_in': 'comes in winter は「冬に来る」で、「中に入る」の come in ではない',
  'br3_christmas_australia|jr_idm_together_with': 'sing songs together with small lights は「いっしょに歌う」の together と「明かりを持って」の with で、「〜と一緒に」の together with ではない',
  'br3_letter_in_bag|exam_idm_be_from': 'It was from Saki は「サキからの手紙だった」で、「〜出身である」の be from ではない',
  'br3_letter_in_bag|jr_idm_want_a_to_do': 'wanted to play alone は want to do で、「Aに〜してほしい」の want A to do ではない',
  'br3_basketball|jr_idm_want_a_to_do': 'wanted to create a game は want to do で、「Aに〜してほしい」の want A to do ではない',
  'br3_recycling|curr_idm_3_work_for': 'create work for people は名詞の work（仕事）で、「〜に勤める」の work for ではない',
  'br3_smartphones|jr_idm_would_you_blank': 'What rules would you make は「どんなルールを作りますか」とたずねる文で、依頼の Would you ~? ではない',
  'br3_breakfast|jr_idm_the_way_to': 'on the way to school として載せている（「〜への道」の the way to だけではない）',
  'brp2_plastic|curr_idm_3_choose_a_from_b': 'by choosing products made from them は「それで作られた製品を選ぶ」で、「BからAを選ぶ」ではない',
  'brp2_plastic|curr1900_idm_4_a_lot': 'a lot of plastic の a lot of として載せている（a lot だけの「とても」ではない）',
  'brp2_washi|curr_idm_pre2_hand_in': 'made by hand in Japan は by hand（手で）と in Japan で、「提出する」の hand in ではない',
  'brp2_washi|jr_idm_want_a_to_do': 'who want to protect は want to do で、「Aに〜してほしい」の want A to do ではない',
  'brp2_bees|jr_idm_not_a_but_b': 'do not know all the reasons, but chemicals … は部分否定と but の文で、「AではなくB」の not A but B ではない',
  'brp2_curry|curr_idm_4_from_a_to_b': 'came from India, but it was introduced to Japan の from と to は別の動詞の語句で、「AからBまで」ではない',
  'brp2_tourism|curr1900_idm_pre2_used_to_do': 'the money should be used to keep the town clean は受け身の be used と目的の to で、「以前は〜した」の used to do ではない',
  'brp2_online_classes|curr_idm_5_this_way': 'In this way の in this way として載せている',
  'brp2_community_cafe|jr_idm_want_a_to_do': 'wants to become は want to do で、「Aに〜してほしい」の want A to do ではない',
  'br2_false_news|curr1900_idm_2_what_blank_is': 'what is true and what is not は「何が本当で何がそうでないか」で、「〜の現在の姿・本質」の what ... is ではない',
  'br2_homework|curr1900_idm_2_be_to_do': 'The key is to give … は「大切なのは〜することだ」の補語の to 不定詞で、予定・義務の be to do ではない',
  'br2_homework|jr_idm_not_a_but_b': 'I do not think … と別の文の but が並んだだけで、「AではなくB」の not A but B ではない',
  'br2_aging_society|curr1900_idm_pre2_used_to_do': 'are being used to help は受け身の be used と目的の to で、「以前は〜した」の used to do ではない',
  'br2_aging_society|jr_idm_want_a_to_do': 'want to keep working は want to do で、「Aに〜してほしい」の want A to do ではない',
  'br2_four_day_week|curr_idm_2_cut_in': 'without any cut in pay は名詞の cut（削減）と in pay（給料の）で、「割り込む」の cut in ではない',
  'br2_four_day_week|curr_idm_3_work_for': 'may not work for every type of business は「すべての仕事でうまくいく」の work で、「〜に勤める」の work for ではない',
  'br2_silk_mill|curr_idm_5_this_way': 'In this way の in this way として載せている',
  'br2_silk_mill|curr_idm_4_from_a_to_b': 'from all over Japan came to work は from all over（各地から）で、「AからBまで」ではない',
  'br2_silk_mill|curr1900_idm_2_come_to': 'came to work there は「働きに来た」で、「意識を取り戻す・合計〜になる」の come to ではない',
  'br2_silk_mill|jr_idm_come_to_do': 'came to work there は「働きに来た」で、「〜するようになる」の come to do ではない',
  'br2_silk_mill|jr_idm_want_a_to_do': 'wanted to become は want to do で、「Aに〜してほしい」の want A to do ではない',
  'br2_silk_mill|jr_idm_as_blank_as_blank': 'as quickly as possible の as ... as possible として載せている',
  'br2_dolphins|curr1900_idm_pre2_on_earth': 'on Earth は固有名詞の地球（地球上で）で、強めの「いったい」の on earth ではない',
  'br2_food_waste|curr1900_idm_4_a_lot': 'a lot of water の a lot of として載せている（a lot だけの「とても」ではない）',
  'br2_community_bus|jr_idm_tell_a_to_do': 'have told us that … は tell A that（Aに〜と伝える）で、「Aに〜するように言う」の tell A to do ではない',
  'br3_homestay|jr_idm_want_a_to_do': 'I want to improve は want to do で、「Aに〜してほしい」の want A to do ではない',
  'brp2_washi|curr1900_idm_4_a_lot': 'a lot of patience の a lot of として載せている（a lot だけの「とても」ではない）',
  'brp2_tourism|syn_so_that': 'so that visitors can learn は目的の so that（〜できるように）で、「とても…なので〜」の so ... that ではない',
  'br2_homework|syn_so_that': 'so that students can rest は目的の so that（〜できるように）で、「とても…なので〜」の so ... that ではない',
  'br2_homework|curr1900_idm_pre1_blank_so_that_blank': 'so that students can rest は目的（〜できるように）で、「その結果…」の , so that ではない',
  'br2_dolphins|curr1900_idm_3_help_a_with_b': 'help us reconsider our relationship with … は help A do（Aが〜するのを助ける）で、「AのBを手伝う」ではない',
  'br2_dolphins|jr_idm_need_to_do': 'efforts are needed to protect は受け身の be needed と目的の to で、「〜する必要がある」の need to do ではない',
  'br2_food_waste|jr_idm_not_a_but_b': 'not only … but also … の not only A but also B として載せている',
  'br2_community_bus|curr_idm_1_for_all': 'for all residents は「すべての住民にとって」で、「〜にもかかわらず」の for all ではない',
  'br4_elephants|curr1900_idm_4_a_lot': 'a lot of grass の a lot of として載せている（a lot だけの「とても」ではない）',
})

const matchable = PHRASES
  .filter((phrase) => phrase.kind === 'idiom' || /^syn_/.test(phrase.id))
  .map((phrase) => ({ phrase, parts: compilePhrase(phrase.phrase) }))
  .filter((entry) => entry.parts && phraseAnchors(entry.parts) >= 2)

/** 本文に当たる、長文の級以下の熟語・構文。 */
export function phraseCandidates(passage) {
  const rank = levelRank(passage.level)
  return matchable.filter(({ phrase, parts }) => (
    levelRank(phrase.level) <= rank &&
    passage.sentences.some((sentence) => phraseInSentence(parts, sentenceTokens(sentence.en)))
  )).map(({ phrase }) => phrase)
}

export function vocabProblems() {
  const problems = []
  for (const passage of BASIC_READING_PASSAGES) {
    const rank = levelRank(passage.level)
    const infer = new Set(passage.inferWords ?? [])
    for (const token of basicReadingTokens(passage)) {
      if (token.isName) continue
      if (!token.word) {
        problems.push(`${passage.id} 第${token.sentenceIndex + 1}文: 辞書にない語「${token.surface}」`)
        continue
      }
      if (levelRank(token.word.level) > rank && !infer.has(token.word.id)) {
        problems.push(`${passage.id} 第${token.sentenceIndex + 1}文: 級より上の語「${token.surface}」→ ${token.word.id}（${token.word.level}）`)
      }
    }
    for (const id of infer) {
      const word = getWord(id)
      if (!word) problems.push(`${passage.id}: 推測させる語 ${id} が辞書にない`)
      else if (levelRank(word.level) <= rank) problems.push(`${passage.id}: 推測させる語 ${id} は級以下（${word.level}）なので推測の問題にならない`)
      if (!passage.lessons.some((lesson) => lesson.rule === 'unknown-word-context')) problems.push(`${passage.id}: 推測させる語があるのに、推測のルールの問題がない`)
      if (!basicReadingTokens(passage).some((token) => token.word?.id === id)) problems.push(`${passage.id}: 推測させる語 ${id} が本文にない`)
    }
    for (const name of passage.names ?? []) {
      if (![passage.title, ...passage.sentences.map((sentence) => sentence.en)].some((text) => text.includes(name))) problems.push(`${passage.id}: 固有名詞 ${name} が題名にも本文にもない`)
    }
    // 熟語：載せた熟語は実在し、級以下で、本文に当たる。本文に当たる級以下の熟語は、載せるか理由を書く。
    const listed = new Set(passage.phrases ?? [])
    for (const id of listed) {
      const phrase = getPhrase(id)
      if (!phrase) { problems.push(`${passage.id}: 熟語 ${id} がない`); continue }
      if (levelRank(phrase.level) > rank) problems.push(`${passage.id}: 熟語 ${id} は級より上（${phrase.level}）`)
      const parts = compilePhrase(phrase.phrase)
      if (!parts || !passage.sentences.some((sentence) => phraseInSentence(parts, sentenceTokens(sentence.en)))) {
        problems.push(`${passage.id}: 熟語 ${id}「${phrase.phrase}」が本文に当たらない`)
      }
    }
    for (const phrase of phraseCandidates(passage)) {
      if (listed.has(phrase.id) || BASIC_READING_PHRASE_NOT_USED[`${passage.id}|${phrase.id}`]) continue
      problems.push(`${passage.id}: 本文に当たる熟語「${phrase.phrase}」（${phrase.id}・${phrase.level}）を載せるか、使っていない理由を書く`)
    }
    const levelWords = basicReadingLevelWords(passage).length
    if (levelWords < MIN_LEVEL_WORDS) problems.push(`${passage.id}: その級の語が語彙の確認の欄に${levelWords}語（${MIN_LEVEL_WORDS}語以上）`)
  }
  for (const key of Object.keys(BASIC_READING_PHRASE_NOT_USED)) {
    const [passageId, phraseId] = key.split('|')
    const passage = BASIC_READING_PASSAGES.find((item) => item.id === passageId)
    if (!passage || !phraseCandidates(passage).some((phrase) => phrase.id === phraseId)) problems.push(`古い理由の行: ${key}`)
  }
  return problems
}

/** 級ごとに、その級の語がある分野のうち、基礎長文の語彙の確認の欄に出ない分野。 */
export function fieldCoverage(level) {
  const fieldsWithWords = new Set(wordsByLevel(level).map((word) => vocabFieldGroupFor(word)?.id).filter(Boolean))
  const covered = new Set(
    basicReadingPassagesForLevel(level).flatMap((passage) => basicReadingLevelWords(passage))
      .map((word) => vocabFieldGroupFor(word)?.id).filter(Boolean),
  )
  return {
    fields: VOCAB_FIELD_GROUPS.filter((group) => fieldsWithWords.has(group.id)).map((group) => group.id),
    missing: VOCAB_FIELD_GROUPS.filter((group) => fieldsWithWords.has(group.id) && !covered.has(group.id)).map((group) => group.id),
  }
}

export function themeProblems() {
  const problems = []
  for (const level of BASIC_READING_LEVEL_IDS) {
    const themes = BASIC_READING_THEMES[level]
    const passages = basicReadingPassagesForLevel(level)
    for (const theme of themes) {
      const count = passages.filter((passage) => passage.theme === theme.id).length
      if (count !== 1) problems.push(`${level}級: テーマ「${theme.label}」の長文が${count}本`)
    }
    for (const passage of passages) {
      if (!themes.some((theme) => theme.id === passage.theme)) problems.push(`${passage.id}: テーマ ${passage.theme} が一覧にない`)
    }
    const { missing } = fieldCoverage(level)
    if (missing.length) problems.push(`${level}級: その級の語を確かめられない分野 ${missing.join('・')}`)
  }
  return problems
}

export function lessonProblems() {
  const problems = []
  const ids = new Set()
  for (const passage of BASIC_READING_PASSAGES) {
    if (ids.has(passage.id)) problems.push(`長文の id の重複 ${passage.id}`)
    ids.add(passage.id)
    if (!BASIC_READING_KINDS[passage.kind]) problems.push(`${passage.id}: 文章の種類 ${passage.kind} がない`)
    for (const key of ['emoji', 'title', 'titleJa']) if (!passage[key]) problems.push(`${passage.id}: ${key} がない`)
    for (const [index, sentence] of passage.sentences.entries()) {
      if (!sentence.en?.trim() || !sentence.ja?.trim()) problems.push(`${passage.id} 第${index + 1}文: 英文か和訳がない`)
    }
    if (!passage.sentences[0]?.paragraphStart) problems.push(`${passage.id}: 最初の文が段落の始まりではない`)
    const paragraphs = basicReadingParagraphs(passage).length
    if (paragraphs < 2) problems.push(`${passage.id}: 段落が${paragraphs}つ`)
    const words = basicReadingWordCount(passage)
    const range = BASIC_READING_LENGTH[passage.level]
    if (words < range.min || words > range.max) problems.push(`${passage.id}: 本文 ${words}語（目安 ${range.min}〜${range.max}語）`)
    if (passage.lessons.length !== 3) problems.push(`${passage.id}: ルールの学習が${passage.lessons.length}つ（3つずつ）`)
    for (const lesson of passage.lessons) {
      const where = `${passage.id}#${lesson.rule}`
      if (!READING_RULES_BY_ID[lesson.rule]) problems.push(`${where}: ルールがない`)
      if (MULTI_PARAGRAPH_RULES.has(lesson.rule) && paragraphs < 2) problems.push(`${where}: 段落が2つ以上の長文で学ぶルール`)
      if (!lesson.sentences?.length) problems.push(`${where}: ルールを使う文がない`)
      for (const index of lesson.sentences ?? []) {
        if (!passage.sentences[index]) problems.push(`${where}: 文の番号 ${index} が本文にない`)
      }
      if (!lesson.how?.trim()) problems.push(`${where}: 当てはめ方の解説がない`)
      if (!lesson.question?.trim()) problems.push(`${where}: 問題文がない`)
      if (lesson.choices?.length !== 4) problems.push(`${where}: 選択肢が${lesson.choices?.length ?? 0}つ（4つ）`)
      const texts = new Set()
      const notes = new Set()
      for (const choice of lesson.choices ?? []) {
        const [text, note] = choice
        if (!text?.trim() || !note?.trim()) problems.push(`${where}: 選択肢か説明が空`)
        if (texts.has(text)) problems.push(`${where}: 同じ選択肢「${text}」`)
        if (notes.has(note)) problems.push(`${where}: 同じ説明「${note}」`)
        texts.add(text)
        notes.add(note)
      }
      if (!Number.isInteger(lesson.answer) || !lesson.choices?.[lesson.answer]) problems.push(`${where}: 正解の番号が選択肢にない`)
      // 問題文が「第N文 英文」と引いた英文は、その番号の文にある（文を足して番号がずれたら止める）。
      for (const match of String(lesson.question).matchAll(/第(\d+)文 ([A-Z][^\u3000-\u30ff\u4e00-\u9fff]*?[.?!])(?=\s*(?:の|で|を|は|に|$))/g)) {
        const sentence = passage.sentences[Number(match[1]) - 1]
        if (!sentence?.en.includes(match[2].replace(/ …[^.?!]*/, '').trim().replace(/\.\.\.$/, ''))) {
          problems.push(`${where}: 問題文の「第${match[1]}文 ${match[2]}」が、第${match[1]}文（${sentence?.en ?? 'なし'}）と合わない`)
        }
      }
      // 当てはめ方の解説が引く3語以上の英語は、ルールを使う文か、問題文・選択肢にある。挿入を外した骨組み
      // （insertion）と、A・B を使う型（ask A to do）は本文にそのまま無いので除く。
      const quotedIn = [lesson.question, ...(lesson.choices ?? []).map((choice) => choice[0]), ...lesson.sentences.map((index) => passage.sentences[index]?.en ?? '')]
        .join('\n').toLowerCase()
      const quoted = lesson.rule === 'insertion' ? [] : [...String(lesson.how).matchAll(/([A-Za-z][A-Za-z'’ ,]+[A-Za-z])/g)]
        .map((m) => m[1]).filter((t) => t.split(' ').length >= 3 && !/\b[AB]\b/.test(t))
      for (const phrase of quoted) {
        if (!quotedIn.includes(phrase.toLowerCase())) {
          problems.push(`${where}: 解説が引く「${phrase}」が、ルールを使う文（${lesson.sentences.map((index) => index + 1).join('・')}）にない`)
        }
      }
      // 解説・問題文の「第N文」は本文にある文を指す。
      for (const text of [lesson.how, lesson.question, ...(lesson.choices ?? []).map((choice) => choice[1])]) {
        for (const match of String(text).matchAll(/第([\d・〜]+)文/g)) {
          for (const number of match[1].split(/[・〜]/).map(Number)) {
            if (number > passage.sentences.length) problems.push(`${where}: 「${match[0]}」は本文にない（${passage.sentences.length}文）`)
          }
        }
      }
    }
  }
  // 級ごとに30ルールを1つずつ。
  for (const level of BASIC_READING_LEVEL_IDS) {
    const rules = basicReadingPassagesForLevel(level).flatMap((passage) => passage.lessons.map((lesson) => lesson.rule))
    for (const rule of READING_RULES) {
      const count = rules.filter((id) => id === rule.id).length
      if (count !== 1) problems.push(`${level}級: ルール ${rule.id} の学習が${count}つ`)
    }
  }
  return problems
}

export function allBasicReadingProblems() {
  return [...lessonProblems(), ...vocabProblems(), ...themeProblems()]
}

if (import.meta.url === `file://${process.argv[1]}`) {
  if (process.argv.includes('--phrases')) {
    for (const passage of BASIC_READING_PASSAGES) {
      const listed = new Set(passage.phrases ?? [])
      const rows = phraseCandidates(passage).map((phrase) => `${listed.has(phrase.id) ? '載' : '未'} ${phrase.id}「${phrase.phrase}」${phrase.level}`)
      console.log(`${passage.id}: ${rows.join(' / ') || 'なし'}`)
    }
  } else {
    const problems = allBasicReadingProblems()
    for (const problem of problems) console.log(problem)
    console.log(`基礎長文 ${BASIC_READING_PASSAGES.length}本・問題 ${problems.length}件`)
    process.exitCode = problems.length ? 1 : 0
  }
}
