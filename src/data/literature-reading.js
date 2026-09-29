// 英語名作の読解チェック（作品ごとに3問）。根拠は本文の文で示し、押すとその文の構文解説が開く。
import { literatureSentences } from './literature-sentences.js'

const question = (id, prompt, choices, answer, explanation) => Object.freeze({
  id,
  prompt,
  choices: Object.freeze(choices),
  answer,
  explanation,
})

export const LITERATURE_READING_QUESTIONS = Object.freeze({
  lit_en_moby_dick_water_gazers: Object.freeze([
    question('moby-q1', 'What direction do the streets of the Manhattoes seem to take people?', [
      'Toward the green fields.',
      'Toward the water.',
      'Toward the northern mountains.',
      'Toward the market counters.',
    ], 1, 'the streets take you waterward が、通りが人を水辺へ導くと明示しています。'),
    question('moby-q2', 'What do the many different people around the waterfront have in common?', [
      'They are sailors returning from China.',
      'They are selling goods at the warehouses.',
      'They are landsmen whose attention is fixed on the sea.',
      'They are searching for green fields.',
    ], 2, '姿勢や仕事は違っても、all landsmen が ocean reveries に心を奪われています。'),
    question('moby-q3', 'What does the final question suggest about the sea?', [
      'It attracts people with a force compared to magnetism.',
      'It is dangerous because every compass is broken.',
      'It separates people arriving from different directions.',
      'It matters only to those who work on ships.',
    ], 0, '羅針盤の magnetic virtue を持ち出し、海の引力を磁力になぞらえています。'),
  ]),
  lit_en_pride_prejudice_netherfield: Object.freeze([
    question('pride-q1', 'Whose assumption is presented as a “truth” in the opening?', [
      'The wealthy man’s private wish.',
      'The surrounding families’ belief that he should marry one of their daughters.',
      'Mr. Bennet’s plan to rent Netherfield Park.',
      'Mrs. Long’s decision to move north.',
    ], 1, 'this truth は surrounding families の心に根づき、男性を娘の相手と見なす考えだと分かります。'),
    question('pride-q2', 'Why does Mrs. Bennet know so much about the new tenant?', [
      'Mr. Morris wrote directly to her.',
      'Her husband had already visited him.',
      'Mrs. Long had just visited and told her about it.',
      'One of her daughters had rented the house.',
    ], 2, 'Mrs. Long has just been here, and she told me all about it が情報源です。'),
    question('pride-q3', 'What most clearly reveals Mrs. Bennet’s interest in the news?', [
      'She asks whether the house has a garden.',
      'She repeats that Bingley came from northern England.',
      'She calls his arrival a fine thing for their girls.',
      'She objects to hearing any more details.',
    ], 2, '最後の What a fine thing for our girls! が、娘たちの結婚を期待する夫人の狙いを直接示します。'),
  ]),
  lit_en_tale_two_cities_times: Object.freeze([
    question('cities-q1', 'How does the narrator first describe the period?', [
      'By giving only a list of its achievements.',
      'By pairing opposite descriptions of the same time.',
      'By comparing England with ancient Greece.',
      'By explaining one ruler’s private thoughts.',
    ], 1, 'best / worst、wisdom / foolishness など正反対の語を同じ時代へ重ねています。'),
    question('cities-q2', 'What attitude does the phrase “superlative degree ... only” criticize?', [
      'Refusing to compare the past with the present.',
      'Describing a complex period only in extreme terms.',
      'Using dates instead of seasons.',
      'Trusting every spiritual revelation.',
    ], 1, 'good / evil のどちらでも最上級だけで評価する論者を皮肉り、単純な時代像を批判します。'),
    question('cities-q3', 'What did the rulers of both countries believe?', [
      'That the existing order would remain settled for ever.',
      'That every citizen should move to the capital.',
      'That England and France should share one throne.',
      'That London had already disappeared.',
    ], 0, 'things in general were settled for ever が、支配する側の思い込みを示します。'),
  ]),
  lit_en_alice_rabbit_hole: Object.freeze([
    question('alice-q1', 'Why was Alice becoming tired?', [
      'She had been running across the field.',
      'She had nothing to do and the book lacked pictures and conversations.',
      'Her sister would not let her read.',
      'The Rabbit had taken her watch.',
    ], 1, '最初の文で、することがなく、姉の読む本に絵も会話もないことが退屈の理由だと分かります。'),
    question('alice-q2', 'What finally made Alice start to her feet?', [
      'The Rabbit spoke to her sister.',
      'The book fell into the river.',
      'The Rabbit took out a watch, looked at it, and hurried on.',
      'She heard someone call her name.',
    ], 2, '時計を取り出して時刻を見て急いだ、という普通ではない三つの動作が決め手です。'),
    question('alice-q3', 'What did Alice fail to consider before following the Rabbit?', [
      'How she would get out again.',
      'Whether the Rabbit could speak.',
      'Where her sister had gone.',
      'How late it had become.',
    ], 0, '最後の never once considering 以下が、出口を考えなかったことを明示します。'),
  ]),
  lit_en_happy_prince_statue: Object.freeze([
    question('prince-q1', 'Where did the statue of the Happy Prince stand?', [
      'Inside the Town Hall.',
      'Beside a weathercock.',
      'High above the city on a tall column.',
      'Near the little boy’s home.',
    ], 2, '冒頭の場所表現 High above the city, on a tall column が根拠です。'),
    question('prince-q2', 'Why did the Councillor add “not quite so useful”?', [
      'He wanted the statue to be removed.',
      'He feared people might think him unpractical.',
      'He disliked artistic tastes.',
      'He believed the statue was crying.',
    ], 1, 'fearing lest ... が発言を付け足した理由を表しています。'),
    question('prince-q3', 'What do the speakers near the beginning have in common?', [
      'They know how the Prince truly feels.',
      'They judge happiness or value mainly from appearance and their own concerns.',
      'They all want the Prince’s jewels.',
      'They have met the Prince in person.',
    ], 1, '人々は像の外見や自分の都合から「幸福」「有用」を決め、王子の内面はまだ知りません。'),
  ]),
  lit_en_gift_of_magi_opening: Object.freeze([
    question('magi-q1', 'How much money did Della have?', [
      'Sixty cents.',
      'Eight dollars.',
      'One dollar and eighty-seven cents.',
      'Eighty-seven dollars.',
    ], 2, 'One dollar and eighty-seven cents の反復が、デラの所持金を強調します。'),
    question('magi-q2', 'How had many of the pennies been saved?', [
      'By bargaining at the grocer, vegetable seller, and butcher.',
      'By selling the furnished flat.',
      'By working for the Town Councillor.',
      'By finding coins under the couch.',
    ], 0, 'by bulldozing ... は、店で一度に1、2セントずつ値切ったことを表します。'),
    question('magi-q3', 'What is the main effect of the repeated amount and short fragments?', [
      'They make the home seem luxurious.',
      'They hide when Christmas will arrive.',
      'They stress Della’s poverty and emotional pressure.',
      'They show that Della cannot count.',
    ], 2, '金額の反復と短い断片は、わずかな所持金とクリスマス前日の切迫感を強めます。'),
  ]),
})

const LITERATURE_QUESTION_EVIDENCE = Object.freeze({
  'moby-q1': 'the streets take you waterward',
  'moby-q2': 'all landsmen',
  'moby-q3': 'magnetic virtue',
  'pride-q1': 'surrounding families',
  'pride-q2': 'Mrs. Long has just been here',
  'pride-q3': 'What a fine thing for our girls',
  'cities-q1': 'best of times',
  'cities-q2': 'superlative degree',
  'cities-q3': 'settled for ever',
  'alice-q1': 'pictures or conversations',
  'alice-q2': 'took a watch out of its waistcoat-pocket',
  'alice-q3': 'get out again',
  'prince-q1': 'HIGH above the city',
  'prince-q2': 'fearing lest people',
  'prince-q3': 'Mathematical Master frowned',
  'magi-q1': 'One dollar and eighty-seven cents',
  'magi-q2': 'bulldozing the grocer',
  'magi-q3': 'One dollar and eighty-seven cents',
})

const QUESTION_CACHE = new WeakMap()

export function getLiteratureReadingQuestions(workId, work = null) {
  const questions = LITERATURE_READING_QUESTIONS[workId] ?? Object.freeze([])
  if (!work?.scenes?.length) return questions
  if (QUESTION_CACHE.has(work)) return QUESTION_CACHE.get(work)
  const sentences = literatureSentences(work)
  const resolved = Object.freeze(questions.map((item) => {
    const evidence = LITERATURE_QUESTION_EVIDENCE[item.id]
    // 根拠は、本文で押して構文解説を開ける文で示す。
    const evidenceSentence = sentences.findIndex((sentence) => sentence.text.includes(evidence))
    return Object.freeze({ ...item, evidenceSentence })
  }))
  QUESTION_CACHE.set(work, resolved)
  return resolved
}
