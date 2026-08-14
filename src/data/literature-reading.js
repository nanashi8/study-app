const role = (roleCode, text) => Object.freeze({ role: roleCode, text })
const sceneGuide = (parts, options = {}) => Object.freeze({
  parts: Object.freeze(parts),
  allowVerbOmission: Boolean(options.allowVerbOmission),
  note: options.note ?? '',
})
const question = (id, prompt, choices, answer, explanation, evidenceScene) => Object.freeze({
  id,
  prompt,
  choices: Object.freeze(choices),
  answer,
  explanation,
  evidenceScene,
})

const ALICE_SCENES = Object.freeze([
  sceneGuide([
    role('S', 'Alice'), role('V', 'was beginning to get'), role('C', 'very tired'),
    role('M', 'of sitting'), role('M', 'by her sister'), role('M', 'on the bank'),
    role('LINK', 'and'), role('M', 'of having nothing to do'),
  ], { note: 'of sitting と of having は、退屈の理由を並列で補っています。' }),
  sceneGuide([
    role('M', 'Once or twice'), role('S', 'she'), role('V', 'had peeped'),
    role('M', 'into the book'), role('S', 'her sister'), role('V', 'was reading'),
    role('LINK', 'but'), role('S', 'it'), role('V', 'had'), role('O', 'no pictures'),
    role('LINK', 'or'), role('O', 'conversations'), role('M', 'in it'),
  ], { note: 'the book の直後に関係代名詞 that が省略され、her sister was reading が book を説明します。' }),
  sceneGuide([
    role('LINK', 'And'), role('C', 'what'), role('V', 'is'), role('S', 'the use'),
    role('M', 'of a book'), role('V', 'thought'), role('S', 'Alice'),
    role('M', 'without pictures'), role('LINK', 'or'), role('M', 'conversations'),
  ], { note: '疑問文の引用の途中に thought Alice が挟まっています。引用の骨格を先につかみます。' }),
  sceneGuide([
    role('LINK', 'There'), role('V', 'was'), role('S', 'nothing'),
    role('C', 'so very remarkable'), role('M', 'in that'), role('LINK', 'nor'),
    role('V', 'did'), role('S', 'Alice'), role('V', 'think'), role('O', 'it'),
    role('C', 'so very much out of the way'), role('M', 'to hear'),
    role('O', 'the Rabbit'), role('V', 'say'), role('M', 'to itself'),
    role('LINK', 'Oh dear Oh dear'), role('S', 'I'), role('V', 'shall be'), role('C', 'late'),
  ], { note: 'nor が前に出たため did Alice think と倒置しています。引用内の I shall be late は独立した S＋V です。' }),
  sceneGuide([
    role('LINK', 'But when'), role('S', 'the Rabbit'), role('M', 'actually'),
    role('V', 'took'), role('O', 'a watch'), role('M', 'out of its waistcoat-pocket'),
    role('LINK', 'and'), role('V', 'looked'), role('M', 'at it'),
    role('LINK', 'and then'), role('V', 'hurried'), role('M', 'on'),
    role('S', 'Alice'), role('V', 'started'), role('M', 'to her feet'),
  ], { note: 'when 節の三つの動作 took → looked → hurried のあと、主節 Alice started が来ます。' }),
  sceneGuide([
    role('M', 'Burning with curiosity'), role('S', 'she'), role('V', 'ran'),
    role('M', 'across the field'), role('M', 'after it'), role('LINK', 'and'),
    role('V', 'was'), role('C', 'just in time'), role('M', 'to see'),
    role('O', 'it'), role('V', 'pop down'), role('M', 'a large rabbit-hole'),
    role('M', 'under the hedge'),
  ], { note: 'Burning ... は主語 she の状態。see＋it＋pop は「それが飛び込むのを見る」です。' }),
  sceneGuide([
    role('M', 'In another moment'), role('M', 'down'), role('V', 'went'),
    role('S', 'Alice'), role('M', 'after it'), role('M', 'never once'),
    role('V', 'considering'), role('LINK', 'how'), role('M', 'in the world'),
    role('S', 'she'), role('V', 'was to get'), role('M', 'out again'),
  ], { note: 'down を先頭に出した倒置です。通常の骨格 Alice went down を復元して読みます。' }),
])

const HAPPY_PRINCE_SCENES = Object.freeze([
  sceneGuide([
    role('M', 'High above the city'), role('M', 'on a tall column'),
    role('V', 'stood'), role('S', 'the statue'), role('M', 'of the Happy Prince'),
  ], { note: '場所を先に見せる倒置。通常の骨格は the statue stood です。' }),
  sceneGuide([
    role('S', 'He'), role('V', 'was gilded'), role('M', 'all over'),
    role('M', 'with thin leaves of fine gold'), role('M', 'for eyes'),
    role('S', 'he'), role('V', 'had'), role('O', 'two bright sapphires'),
    role('LINK', 'and'), role('S', 'a large red ruby'), role('V', 'glowed'),
    role('M', 'on his sword-hilt'),
  ], { note: 'セミコロン相当の三つの描写を、金箔→目→剣の柄の順に追います。' }),
  sceneGuide([
    role('S', 'He'), role('V', 'was'), role('M', 'very much'), role('V', 'admired'), role('M', 'indeed'),
  ], { note: 'was admired は受け身で、「人々が彼を称賛した」を像の側から述べています。' }),
  sceneGuide([
    role('S', 'He'), role('V', 'is'), role('C', 'as beautiful'), role('LINK', 'as'),
    role('C', 'a weathercock'), role('V', 'remarked'), role('S', 'one of the Town Councillors'),
    role('S', 'who'), role('V', 'wished'), role('O', 'to gain a reputation'),
    role('M', 'for having artistic tastes'),
  ], { note: 'as ... as の比較のあとに発言者が続き、who 以下がその人物の見栄を説明します。' }),
  sceneGuide([
    role('LINK', 'Only'), role('C', 'not quite so useful'), role('S', 'he'),
    role('V', 'added'), role('M', 'fearing'), role('LINK', 'lest'),
    role('S', 'people'), role('V', 'should think'), role('O', 'him'), role('C', 'unpractical'),
  ], { note: '引用部は He is が省略された補足。lest 以下は「そう思われるといけないので」という理由です。' }),
  sceneGuide([
    role('LINK', 'Why'), role('V', 'can’t'), role('S', 'you'), role('V', 'be'),
    role('C', 'like the Happy Prince'), role('V', 'asked'), role('S', 'a sensible mother'),
    role('M', 'of her little boy'), role('S', 'who'), role('V', 'was crying'), role('M', 'for the moon'),
  ], { note: '疑問文のあとに asked＋発言者。who 以下は little boy を説明します。' }),
  sceneGuide([
    role('S', 'The Happy Prince'), role('M', 'never'), role('V', 'dreams'),
    role('M', 'of crying'), role('M', 'for anything'),
  ], { note: 'never dreams of ... は「…など夢にも思わない」という強い否定です。' }),
  sceneGuide([
    role('S', 'I'), role('V', 'am'), role('C', 'glad'), role('LINK', 'there'),
    role('V', 'is'), role('S', 'some one'), role('M', 'in the world'),
    role('S', 'who'), role('V', 'is'), role('C', 'quite happy'),
    role('V', 'muttered'), role('S', 'a disappointed man'), role('LINK', 'as'),
    role('S', 'he'), role('V', 'gazed'), role('M', 'at the wonderful statue'),
  ], { note: '発言内容・発言者・as の同時動作という三層です。who は some one を説明します。' }),
])

const MAGI_SCENES = Object.freeze([
  sceneGuide([
    role('C', 'One dollar and eighty-seven cents'), role('S', 'That'), role('V', 'was'), role('C', 'all'),
  ], { note: '最初は金額だけの断片。その金額を That で受け、That was all と断定します。' }),
  sceneGuide([
    role('LINK', 'And'), role('S', 'sixty cents of it'), role('V', 'was'), role('C', 'in pennies'),
  ], { note: 'And で前の金額へ追い打ちをかけ、しかも大半が小銭だったと示します。' }),
  sceneGuide([
    role('S', 'Pennies'), role('V', 'saved'), role('M', 'one and two at a time'),
    role('M', 'by bulldozing'), role('O', 'the grocer'), role('LINK', 'and'),
    role('O', 'the vegetable man'), role('LINK', 'and'), role('O', 'the butcher'),
    role('LINK', 'until'), role('S', 'one’s cheeks'), role('V', 'burned'),
    role('M', 'with the silent imputation'), role('M', 'of parsimony'),
    role('O', 'that'), role('S', 'such close dealing'), role('V', 'implied'),
  ], { note: 'Pennies (were) saved と受け身の were が省略された断片から、until 節へ伸びる一文です。' }),
  sceneGuide([
    role('M', 'Three times'), role('S', 'Della'), role('V', 'counted'), role('O', 'it'),
    role('C', 'One dollar and eighty-seven cents'), role('LINK', 'And'),
    role('S', 'the next day'), role('V', 'would be'), role('C', 'Christmas'),
  ], { note: '数え直す動作→金額の反復→翌日はクリスマス、という短文三段で切迫感を作ります。' }),
  sceneGuide([
    role('LINK', 'There'), role('V', 'was'), role('M', 'clearly'), role('S', 'nothing'),
    role('M', 'to do'), role('LINK', 'but'), role('V', 'flop down'),
    role('M', 'on the shabby little couch'), role('LINK', 'and'), role('V', 'howl'),
    role('LINK', 'So'), role('S', 'Della'), role('V', 'did'), role('O', 'it'),
  ], { note: 'nothing to do but ... は「…するほかない」。最後の短文が語り手のユーモアです。' }),
  sceneGuide([
    role('S', 'Which'), role('V', 'instigates'), role('O', 'the moral reflection'),
    role('LINK', 'that'), role('S', 'life'), role('V', 'is made up'),
    role('M', 'of sobs sniffles and smiles'), role('M', 'with sniffles predominating'),
  ], { note: 'Which は直前の泣く行動全体を受けます。that 以下が reflection の内容です。' }),
  sceneGuide([
    role('LINK', 'While'), role('S', 'the mistress'), role('M', 'of the home'),
    role('V', 'is'), role('M', 'gradually'), role('V', 'subsiding'),
    role('M', 'from the first stage to the second'), role('V', 'take'),
    role('O', 'a look'), role('M', 'at the home'),
  ], { note: 'While 節のあと、主節は命令文 take a look。主語 you は省略されています。' }),
  sceneGuide([
    role('C', 'A furnished flat'), role('M', 'at $8 per week'),
  ], {
    allowVerbOmission: true,
    note: 'Vなし：A furnished flat ... という名詞句だけで部屋を提示する、文体上の断片です。',
  }),
])

export const LITERATURE_READING_GUIDES = Object.freeze({
  lit_en_alice_rabbit_hole: ALICE_SCENES,
  lit_en_happy_prince_statue: HAPPY_PRINCE_SCENES,
  lit_en_gift_of_magi_opening: MAGI_SCENES,
})

export const LITERATURE_READING_QUESTIONS = Object.freeze({
  lit_en_alice_rabbit_hole: Object.freeze([
    question('alice-q1', 'Why was Alice becoming tired?', [
      'She had been running across the field.',
      'She had nothing to do and the book lacked pictures and conversations.',
      'Her sister would not let her read.',
      'The Rabbit had taken her watch.',
    ], 1, '第1・2場面では、することがなく、本に絵も会話もないことが退屈の理由です。', 1),
    question('alice-q2', 'What finally made Alice start to her feet?', [
      'The Rabbit spoke to her sister.',
      'The book fell into the river.',
      'The Rabbit took out a watch, looked at it, and hurried on.',
      'She heard someone call her name.',
    ], 2, '時計を取り出して時刻を見て急いだ、という普通ではない三つの動作が決め手です。', 4),
    question('alice-q3', 'What did Alice fail to consider before following the Rabbit?', [
      'How she would get out again.',
      'Whether the Rabbit could speak.',
      'Where her sister had gone.',
      'How late it had become.',
    ], 0, '最後の never once considering 以下が、出口を考えなかったことを明示します。', 6),
  ]),
  lit_en_happy_prince_statue: Object.freeze([
    question('prince-q1', 'Where did the statue of the Happy Prince stand?', [
      'Inside the Town Hall.',
      'Beside a weathercock.',
      'High above the city on a tall column.',
      'Near the little boy’s home.',
    ], 2, '冒頭の場所表現 High above the city, on a tall column が根拠です。', 0),
    question('prince-q2', 'Why did the Councillor add “not quite so useful”?', [
      'He wanted the statue to be removed.',
      'He feared people might think him unpractical.',
      'He disliked artistic tastes.',
      'He believed the statue was crying.',
    ], 1, 'fearing lest ... が発言を付け足した理由を表しています。', 4),
    question('prince-q3', 'What do the speakers have in common in this passage?', [
      'They know how the Prince truly feels.',
      'They judge happiness or value mainly from appearance and their own concerns.',
      'They all want the Prince’s jewels.',
      'They have met the Prince in person.',
    ], 1, '人々は像の外見や自分の都合から「幸福」「有用」を決め、王子の内面はまだ知りません。', 7),
  ]),
  lit_en_gift_of_magi_opening: Object.freeze([
    question('magi-q1', 'How much money did Della have?', [
      'Sixty cents.',
      'Eight dollars.',
      'One dollar and eighty-seven cents.',
      'Eighty-seven dollars.',
    ], 2, '冒頭と第4場面で One dollar and eighty-seven cents が反復されます。', 0),
    question('magi-q2', 'How had many of the pennies been saved?', [
      'By bargaining at the grocer, vegetable seller, and butcher.',
      'By selling the furnished flat.',
      'By working for the Town Councillor.',
      'By finding coins under the couch.',
    ], 0, 'by bulldozing ... は、店で一度に1、2セントずつ値切ったことを表します。', 2),
    question('magi-q3', 'What is the main effect of the repeated amount and short fragments?', [
      'They make the home seem luxurious.',
      'They hide when Christmas will arrive.',
      'They stress Della’s poverty and emotional pressure.',
      'They show that Della cannot count.',
    ], 2, '金額の反復と短い断片は、わずかな所持金とクリスマス前日の切迫感を強めます。', 3),
  ]),
})

export function getLiteratureReadingGuide(workId, sceneIndex) {
  return LITERATURE_READING_GUIDES[workId]?.[sceneIndex] ?? null
}

export function getLiteratureReadingQuestions(workId) {
  return LITERATURE_READING_QUESTIONS[workId] ?? Object.freeze([])
}
