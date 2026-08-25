import { GRAMMAR_EXPANSION } from './grammar-expansion.js'
import { GENERATED_GRAMMAR } from './grammar-generated.js'
import { GRAMMAR_EXAM_PATTERNS } from './grammar-exam-patterns.js'
import {
  GRAMMAR_FORMAT_EXPANSION,
  grammarQuestionType,
} from './grammar-format-expansion.js'
import { createGrammarChoiceGuidance } from '../lib/grammarChoiceGuidance.js'

// 既存の手作り問題にも、生成問題・入試型問題と同じ文法判断を問うものがある。
// IDや並び順は変えず、出題時だけ同じ variationGroup として重複を抑える。
const LEGACY_VARIATION_GROUPS = Object.freeze({
  gr_5_pron_1: 'exam:eiken:5_pronoun_form',
  gr_5_pron_2: 'exam:eiken:5_pronoun_form',
  gr_5_pron_3: 'exam:eiken:5_pronoun_form',
  gr_5_pron_4: 'exam:eiken:5_pronoun_form',
  gr_5_pron_x1: 'exam:eiken:5_pronoun_form',
  gr_more_5_pron_01: 'exam:eiken:5_pronoun_form',
  gr_5_neg_1: 'exam:eiken:5_present_negative',
  gr_5_verb_x1: 'exam:eiken:5_present_negative',
  gr_5_neg_2: 'auto:5_does_question',
  gr_more_5_neg_01: 'auto:5_do_question',
  gr_4_comp_1: 'auto:4_comparative',
  gr_4_comp_2: 'auto:4_superlative',
  gr_4_comp_3: 'auto:4_comparative',
  gr_4_comp_4: 'auto:4_superlative',
  gr_4_comp_5: 'auto:4_comparative',
  gr_4_comp_6: 'exam:eiken:4_equal_comparison',
  gr_4_comp_x1: 'auto:4_superlative',
  gr_4_comp_x2: 'auto:4_comparative',
  gr_more_4_comp_01: 'exam:eiken:4_equal_comparison',
  gr_4_have_to_1: 'exam:eiken:4_have_to',
  gr_more_4_modal_01: 'exam:eiken:4_have_to',
  gr_3_perf_2: 'exam:eiken:3_perfect_question',
  gr_3_perf_6: 'exam:eiken:3_perfect_question',
  gr_more_3_perf_01: 'exam:eiken:3_perfect_question',
  gr_pre2_ger_5: 'exam:eiken:pre2_used_to_contrast',
  gr_more_pre1_conc_01: 'exam:university:pre1_concession_as',
  gr_1_invc_1: 'exam:university:1_not_until_inversion',
  gr_1_subj_1: 'exam:university:pre1_mandative',
})

const GENERATED_VARIATION_GROUPS = Object.freeze({
  'auto:5_pronoun': 'exam:eiken:5_pronoun_form',
  'auto:4_used_to': 'exam:eiken:pre2_used_to_contrast',
  'auto:1_mandative': 'exam:university:pre1_mandative',
})

const withVariationGroup = (item) => {
  const variationGroup = LEGACY_VARIATION_GROUPS[item.id]
    ?? GENERATED_VARIATION_GROUPS[item.pattern]
  return variationGroup ? { ...item, variationGroup } : item
}

// 級ごとの文法問題データ。4択（空所補充）形式。
// SRS は単語・熟語と同じ store.srs を id で共用（id が一意なら衝突しない）。
//   { id, level, topic, q(空所は ___ ), choices:[4], answer(正解の文字列), explain, sentence:{en,ja} }
// q = 問題文（___ が空所）／ answer = choices のうちの正解／ sentence = 正解を入れた完成文＋和訳。
export const GRAMMAR = [
  // ───────── 5級（中1）─────────
  { id: 'gr_5_be_1', level: '5', topic: 'be動詞', q: 'I ___ a student.', choices: ['am', 'is', 'are', 'be'], answer: 'am', explain: '主語が I のとき be動詞は am。', sentence: { en: 'I am a student.', ja: '私は学生です。' } },
  { id: 'gr_5_be_2', level: '5', topic: 'be動詞', q: 'She ___ kind.', choices: ['is', 'am', 'are', 'do'], answer: 'is', explain: '主語が3人称単数(she)のとき be動詞は is。', sentence: { en: 'She is kind.', ja: '彼女は親切です。' } },
  { id: 'gr_5_be_3', level: '5', topic: 'be動詞', q: 'You and Tom ___ friends.', choices: ['are', 'is', 'am', 'be'], answer: 'are', explain: '主語が複数(you and Tom)のとき be動詞は are。', sentence: { en: 'You and Tom are friends.', ja: 'あなたとトムは友達です。' } },
  { id: 'gr_5_verb_1', level: '5', topic: '一般動詞・3単現', q: 'He ___ tennis every day.', choices: ['plays', 'play', 'playing', 'played'], answer: 'plays', explain: '主語が3人称単数で現在の文は動詞に s をつける。', sentence: { en: 'He plays tennis every day.', ja: '彼は毎日テニスをします。' } },
  { id: 'gr_5_verb_2', level: '5', topic: '一般動詞・3単現', q: 'My sister ___ to school by bus.', choices: ['goes', 'go', 'going', 'gone'], answer: 'goes', explain: 'go は3単現で goes（o で終わる語は es）。', sentence: { en: 'My sister goes to school by bus.', ja: '姉はバスで学校へ行きます。' } },
  { id: 'gr_5_verb_3', level: '5', topic: '一般動詞・3単現', q: 'I ___ soccer after school.', choices: ['play', 'plays', 'playing', 'to play'], answer: 'play', explain: '主語が I のときは s をつけない。', sentence: { en: 'I play soccer after school.', ja: '私は放課後サッカーをします。' } },
  { id: 'gr_5_neg_1', level: '5', topic: '否定文・疑問文', q: 'I ___ like natto.', choices: ['do not', 'does not', 'am not', 'not'], answer: 'do not', explain: '一般動詞(I/you/複数)の否定は do not（don’t）。', sentence: { en: 'I do not like natto.', ja: '私は納豆が好きではありません。' } },
  { id: 'gr_5_neg_2', level: '5', topic: '否定文・疑問文', q: '___ she play the piano?', choices: ['Does', 'Do', 'Is', 'Are'], answer: 'Does', explain: '3単現の疑問文は Does で始め、動詞は原形。', sentence: { en: 'Does she play the piano?', ja: '彼女はピアノを弾きますか。' } },
  { id: 'gr_5_plural_1', level: '5', topic: '名詞の複数形', q: 'I have three ___.', choices: ['boxes', 'boxs', 'box', 'boxies'], answer: 'boxes', explain: 'x で終わる語の複数は es をつける。', sentence: { en: 'I have three boxes.', ja: '私は箱を3つ持っています。' } },
  { id: 'gr_5_plural_2', level: '5', topic: '名詞の複数形', q: 'There are many ___ in the zoo.', choices: ['animals', 'animal', 'animales', 'animals’'], answer: 'animals', explain: '数えられる名詞の複数は基本 s をつける。', sentence: { en: 'There are many animals in the zoo.', ja: '動物園にはたくさんの動物がいます。' } },
  { id: 'gr_5_pron_1', level: '5', topic: '代名詞', q: 'This is Ken. I know ___.', choices: ['him', 'he', 'his', 'they'], answer: 'him', explain: '動詞の目的語には目的格(him)を使う。', sentence: { en: 'This is Ken. I know him.', ja: 'こちらはケンです。私は彼を知っています。' } },
  { id: 'gr_5_pron_2', level: '5', topic: '代名詞', q: 'This bag is ___.', choices: ['mine', 'my', 'me', 'I'], answer: 'mine', explain: '「私のもの」は所有代名詞 mine。', sentence: { en: 'This bag is mine.', ja: 'このかばんは私のものです。' } },
  { id: 'gr_5_wh_1', level: '5', topic: '疑問詞', q: '___ is your birthday? — In May.', choices: ['When', 'Where', 'Who', 'What'], answer: 'When', explain: '時をたずねるときは When。', sentence: { en: 'When is your birthday?', ja: 'あなたの誕生日はいつですか。' } },
  { id: 'gr_5_wh_2', level: '5', topic: '疑問詞', q: '___ do you live? — In Osaka.', choices: ['Where', 'When', 'How', 'Why'], answer: 'Where', explain: '場所をたずねるときは Where。', sentence: { en: 'Where do you live?', ja: 'あなたはどこに住んでいますか。' } },
  { id: 'gr_5_prep_1', level: '5', topic: '前置詞', q: 'The cat is ___ the table.', choices: ['under', 'in', 'at', 'of'], answer: 'under', explain: '「〜の下に」は under。', sentence: { en: 'The cat is under the table.', ja: '猫はテーブルの下にいます。' } },
  { id: 'gr_5_prep_2', level: '5', topic: '前置詞', q: 'I get up ___ seven.', choices: ['at', 'on', 'in', 'to'], answer: 'at', explain: '時刻の前は at。', sentence: { en: 'I get up at seven.', ja: '私は7時に起きます。' } },
  { id: 'gr_5_can_1', level: '5', topic: '助動詞 can', q: 'She ___ swim very well.', choices: ['can', 'cans', 'is', 'does'], answer: 'can', explain: 'can のあとの動詞は原形。canに s はつかない。', sentence: { en: 'She can swim very well.', ja: '彼女はとても上手に泳げます。' } },
  { id: 'gr_5_prog_1', level: '5', topic: '現在進行形', q: 'He is ___ TV now.', choices: ['watching', 'watch', 'watches', 'watched'], answer: 'watching', explain: '現在進行形は be動詞＋動詞ing。', sentence: { en: 'He is watching TV now.', ja: '彼は今テレビを見ています。' } },
  { id: 'gr_5_imp_1', level: '5', topic: '命令文', q: '___ quiet, please.', choices: ['Be', 'Are', 'Do', 'Is'], answer: 'Be', explain: 'be動詞の命令文は Be で始める。', sentence: { en: 'Be quiet, please.', ja: '静かにしてください。' } },

  // ───────── 4級（中2）─────────
  { id: 'gr_4_past_1', level: '4', topic: '過去形', q: 'I ___ to Kyoto last week.', choices: ['went', 'go', 'goes', 'going'], answer: 'went', explain: 'go の過去形は went（不規則動詞）。', sentence: { en: 'I went to Kyoto last week.', ja: '私は先週京都へ行きました。' } },
  { id: 'gr_4_past_2', level: '4', topic: '過去形', q: 'She ___ a letter yesterday.', choices: ['wrote', 'writes', 'write', 'written'], answer: 'wrote', explain: 'write の過去形は wrote。', sentence: { en: 'She wrote a letter yesterday.', ja: '彼女は昨日手紙を書きました。' } },
  { id: 'gr_4_past_3', level: '4', topic: '過去形', q: 'Did you ___ the game?', choices: ['watch', 'watched', 'watching', 'watches'], answer: 'watch', explain: 'Did の疑問文では動詞は原形。', sentence: { en: 'Did you watch the game?', ja: 'あなたはその試合を見ましたか。' } },
  { id: 'gr_4_future_1', level: '4', topic: '未来表現', q: 'It ___ rain tomorrow.', choices: ['will', 'wills', 'is', 'does'], answer: 'will', explain: '未来は will＋動詞の原形。', sentence: { en: 'It will rain tomorrow.', ja: '明日は雨が降るでしょう。' } },
  { id: 'gr_4_future_2', level: '4', topic: '未来表現', q: 'I am going ___ study tonight.', choices: ['to', 'for', 'at', 'of'], answer: 'to', explain: 'be going to＋動詞の原形で予定を表す。', sentence: { en: 'I am going to study tonight.', ja: '私は今夜勉強するつもりです。' } },
  { id: 'gr_4_comp_1', level: '4', topic: '比較', q: 'Tom is ___ than Ken.', choices: ['taller', 'tall', 'tallest', 'more tall'], answer: 'taller', explain: '比較級は -er。than と一緒に使う。', sentence: { en: 'Tom is taller than Ken.', ja: 'トムはケンより背が高い。' } },
  { id: 'gr_4_comp_2', level: '4', topic: '比較', q: 'This is the ___ book of the three.', choices: ['most interesting', 'more interesting', 'interesting', 'interestinger'], answer: 'most interesting', explain: '長い語の最上級は most＋原級。the をつける。', sentence: { en: 'This is the most interesting book of the three.', ja: 'これは3冊の中で一番面白い本です。' } },
  { id: 'gr_4_comp_3', level: '4', topic: '比較', q: 'She runs ___ than I.', choices: ['faster', 'fast', 'fastest', 'more fast'], answer: 'faster', explain: '副詞 fast の比較級は faster。', sentence: { en: 'She runs faster than I.', ja: '彼女は私より速く走ります。' } },
  { id: 'gr_4_modal_1', level: '4', topic: '助動詞', q: 'You ___ finish your homework first.', choices: ['must', 'are', 'do', 'can to'], answer: 'must', explain: 'must＋原形で「〜しなければならない」。', sentence: { en: 'You must finish your homework first.', ja: 'まず宿題を終えなければならない。' } },
  { id: 'gr_4_inf_1', level: '4', topic: '不定詞', q: 'I want ___ a doctor.', choices: ['to be', 'be', 'being', 'to being'], answer: 'to be', explain: 'want to＋原形で「〜したい」。', sentence: { en: 'I want to be a doctor.', ja: '私は医者になりたい。' } },
  { id: 'gr_4_inf_2', level: '4', topic: '不定詞', q: 'I have a lot of work ___.', choices: ['to do', 'doing', 'do', 'does'], answer: 'to do', explain: '名詞を後ろから修飾する形容詞的用法の不定詞。', sentence: { en: 'I have a lot of work to do.', ja: '私にはやるべき仕事がたくさんある。' } },
  { id: 'gr_4_ger_1', level: '4', topic: '動名詞', q: 'He enjoys ___ soccer.', choices: ['playing', 'to play', 'play', 'played'], answer: 'playing', explain: 'enjoy のあとは動名詞(ing)。to不定詞は不可。', sentence: { en: 'He enjoys playing soccer.', ja: '彼はサッカーをするのを楽しむ。' } },
  { id: 'gr_4_conj_1', level: '4', topic: '接続詞', q: 'Call me ___ you arrive.', choices: ['when', 'that', 'but', 'or'], answer: 'when', explain: 'when は「〜するとき」を表す接続詞。', sentence: { en: 'Call me when you arrive.', ja: '着いたら電話してください。' } },
  { id: 'gr_4_there_1', level: '4', topic: 'There is/are', q: 'There ___ many books on the desk.', choices: ['are', 'is', 'has', 'have'], answer: 'are', explain: '後ろが複数(books)なら There are。', sentence: { en: 'There are many books on the desk.', ja: '机の上にたくさんの本があります。' } },
  { id: 'gr_4_pastprog_1', level: '4', topic: '過去進行形', q: 'I ___ watching TV at nine.', choices: ['was', 'were', 'am', 'did'], answer: 'was', explain: '過去進行形は was/were＋ing。主語 I は was。', sentence: { en: 'I was watching TV at nine.', ja: '私は9時にテレビを見ていました。' } },

  // ───────── 3級（中3）─────────
  { id: 'gr_3_perf_1', level: '3', topic: '現在完了', q: 'I have ___ in Tokyo for ten years.', choices: ['lived', 'live', 'living', 'lives'], answer: 'lived', explain: '現在完了は have＋過去分詞。継続を表す。', sentence: { en: 'I have lived in Tokyo for ten years.', ja: '私は10年間東京に住んでいます。' } },
  { id: 'gr_3_perf_2', level: '3', topic: '現在完了', q: 'Have you ___ finished it?', choices: ['already', 'ever', 'yet', 'since'], answer: 'already', explain: 'already は「もう・すでに」。疑問文では驚きや確認の気持ちを添える。', sentence: { en: 'Have you already finished it?', ja: 'もう終えましたか。' } },
  { id: 'gr_3_perf_3', level: '3', topic: '現在完了', q: 'She has ___ to Australia twice.', choices: ['been', 'gone', 'went', 'being'], answer: 'been', explain: 'have been to で「行ったことがある（経験）」。', sentence: { en: 'She has been to Australia twice.', ja: '彼女は2回オーストラリアに行ったことがあります。' } },
  { id: 'gr_3_pass_1', level: '3', topic: '受動態', q: 'This book ___ by many people.', choices: ['is read', 'reads', 'is reading', 'read'], answer: 'is read', explain: '受動態は be動詞＋過去分詞。「読まれている」。', sentence: { en: 'This book is read by many people.', ja: 'この本は多くの人に読まれています。' } },
  { id: 'gr_3_pass_2', level: '3', topic: '受動態', q: 'The room ___ cleaned yesterday.', choices: ['was', 'is', 'has', 'did'], answer: 'was', explain: '過去の受動態は was/were＋過去分詞。', sentence: { en: 'The room was cleaned yesterday.', ja: 'その部屋は昨日掃除された。' } },
  { id: 'gr_3_rel_1', level: '3', topic: '関係代名詞', q: 'I have a friend ___ lives in Canada.', choices: ['who', 'which', 'whose', 'what'], answer: 'who', explain: '先行詞が人で主格なら who。', sentence: { en: 'I have a friend who lives in Canada.', ja: '私にはカナダに住む友達がいます。' } },
  { id: 'gr_3_rel_2', level: '3', topic: '関係代名詞', q: 'This is the book ___ I bought yesterday.', choices: ['which', 'who', 'whose', 'where'], answer: 'which', explain: '先行詞が物で目的格なら which（that も可）。', sentence: { en: 'This is the book which I bought yesterday.', ja: 'これは私が昨日買った本です。' } },
  { id: 'gr_3_indq_1', level: '3', topic: '間接疑問', q: 'I don’t know ___ he is.', choices: ['who', 'who is', 'is who', 'whom is'], answer: 'who', explain: '間接疑問は〈疑問詞＋主語＋動詞〉の語順。', sentence: { en: 'I don’t know who he is.', ja: '私は彼が誰なのか知りません。' } },
  { id: 'gr_3_indq_2', level: '3', topic: '間接疑問', q: 'Tell me ___ the station is.', choices: ['where', 'where is', 'how', 'what'], answer: 'where', explain: '間接疑問では where のあとも〈主語＋動詞〉の順。', sentence: { en: 'Tell me where the station is.', ja: '駅がどこか教えてください。' } },
  { id: 'gr_3_inf_1', level: '3', topic: '不定詞応用', q: 'It is important ___ English every day.', choices: ['to study', 'study', 'studying', 'studied'], answer: 'to study', explain: 'It is ... to do（〜することは…だ）の形式主語。', sentence: { en: 'It is important to study English every day.', ja: '毎日英語を勉強することは大切だ。' } },
  { id: 'gr_3_inf_2', level: '3', topic: '不定詞応用', q: 'I want you ___ help me.', choices: ['to', 'that', 'for', 'will'], answer: 'to', explain: 'want＋人＋to do で「人に〜してほしい」。', sentence: { en: 'I want you to help me.', ja: 'あなたに手伝ってほしい。' } },
  { id: 'gr_3_comp_1', level: '3', topic: '比較応用', q: 'Health is ___ important as money.', choices: ['as', 'so', 'more', 'than'], answer: 'as', explain: 'as＋原級＋as で「同じくらい〜」。', sentence: { en: 'Health is as important as money.', ja: '健康はお金と同じくらい大切だ。' } },
  { id: 'gr_3_svoo_1', level: '3', topic: '文型(SVOO/SVOC)', q: 'He ___ me a present.', choices: ['gave', 'gave to', 'gave for', 'gives to'], answer: 'gave', explain: 'give＋人＋物（SVOO）。toは不要。', sentence: { en: 'He gave me a present.', ja: '彼は私にプレゼントをくれた。' } },
  { id: 'gr_3_svoc_1', level: '3', topic: '文型(SVOO/SVOC)', q: 'The news made me ___.', choices: ['happy', 'happily', 'happiness', 'to happy'], answer: 'happy', explain: 'make＋O＋C(形容詞)で「OをCにする」。', sentence: { en: 'The news made me happy.', ja: 'その知らせは私を幸せにした。' } },

  // ───────── 準2級（高1〜）─────────
  { id: 'gr_pre2_part_1', level: 'pre2', topic: '分詞', q: 'Look at the ___ baby.', choices: ['sleeping', 'slept', 'sleep', 'to sleep'], answer: 'sleeping', explain: '現在分詞(ing)が名詞を修飾し「〜している」。', sentence: { en: 'Look at the sleeping baby.', ja: '眠っている赤ちゃんを見て。' } },
  { id: 'gr_pre2_part_2', level: 'pre2', topic: '分詞', q: 'This is a watch ___ in Japan.', choices: ['made', 'making', 'make', 'makes'], answer: 'made', explain: '過去分詞が名詞を後ろから修飾し「〜された」。', sentence: { en: 'This is a watch made in Japan.', ja: 'これは日本製の時計です。' } },
  { id: 'gr_pre2_reladv_1', level: 'pre2', topic: '関係副詞', q: 'This is the house ___ I was born.', choices: ['where', 'which', 'who', 'when'], answer: 'where', explain: '先行詞が場所で後ろが完全文なら関係副詞 where。', sentence: { en: 'This is the house where I was born.', ja: 'ここは私が生まれた家です。' } },
  { id: 'gr_pre2_subj_1', level: 'pre2', topic: '仮定法(基礎)', q: 'If I ___ rich, I would travel.', choices: ['were', 'am', 'are', 'be'], answer: 'were', explain: '仮定法過去では be動詞は主語に関係なく were。', sentence: { en: 'If I were rich, I would travel.', ja: 'もし金持ちなら旅行するのに。' } },
  { id: 'gr_pre2_caus_1', level: 'pre2', topic: '使役・知覚', q: 'My mother made me ___ the dishes.', choices: ['wash', 'to wash', 'washing', 'washed'], answer: 'wash', explain: '使役動詞 make＋O＋原形（〜させる）。', sentence: { en: 'My mother made me wash the dishes.', ja: '母は私に皿を洗わせた。' } },
  { id: 'gr_pre2_itto_1', level: 'pre2', topic: 'it...to/for', q: 'It is hard ___ me to wake up early.', choices: ['for', 'to', 'of', 'with'], answer: 'for', explain: 'It is ... for 人 to do（人にとって〜だ）。', sentence: { en: 'It is hard for me to wake up early.', ja: '私には早起きが難しい。' } },

  // ───────── 2級（高校卒業程度）─────────
  { id: 'gr_2_subjpast_1', level: '2', topic: '仮定法過去完了', q: 'If I had known, I ___ have helped you.', choices: ['would', 'will', 'would have to', 'am'], answer: 'would', explain: '仮定法過去完了：If＋had＋過分, 主語＋would have＋過分。', sentence: { en: 'If I had known, I would have helped you.', ja: '知っていたら手伝ったのに。' } },
  { id: 'gr_2_partc_1', level: '2', topic: '分詞構文', q: '___ tired, he went to bed early.', choices: ['Being', 'Be', 'To be', 'Been'], answer: 'Being', explain: '分詞構文は動詞ing で文を始め「〜なので」等を表す。', sentence: { en: 'Being tired, he went to bed early.', ja: '疲れていたので彼は早く寝た。' } },
  { id: 'gr_2_what_1', level: '2', topic: '関係代名詞 what', q: '___ he said surprised us.', choices: ['What', 'That', 'Which', 'Who'], answer: 'What', explain: 'what は「〜すること/もの」を表す（先行詞を含む）。', sentence: { en: 'What he said surprised us.', ja: '彼が言ったことは私たちを驚かせた。' } },
  { id: 'gr_2_perf_1', level: '2', topic: '完了形応用', q: 'By next year, I ___ here for ten years.', choices: ['will have worked', 'will work', 'have worked', 'worked'], answer: 'will have worked', explain: '未来完了 will have＋過分（〜してしまっているだろう）。', sentence: { en: 'By next year, I will have worked here for ten years.', ja: '来年で私はここで10年働いたことになる。' } },
  { id: 'gr_2_whose_1', level: '2', topic: '関係代名詞 whose', q: 'I met a man ___ car was stolen.', choices: ['whose', 'who', 'which', 'whom'], answer: 'whose', explain: '所有を表す関係代名詞は whose（〜の…）。', sentence: { en: 'I met a man whose car was stolen.', ja: '私は車を盗まれた男性に会った。' } },

  // ───────── 準1級（大学中級）─────────
  { id: 'gr_pre1_inv_1', level: 'pre1', topic: '倒置', q: 'Never ___ I seen such a sight.', choices: ['have', 'I have', 'did', 'had'], answer: 'have', explain: '否定語句が文頭に出ると倒置〈助動詞＋主語〉。', sentence: { en: 'Never have I seen such a sight.', ja: 'そんな光景は見たことがない。' } },
  { id: 'gr_pre1_subj_1', level: 'pre1', topic: '仮定法応用', q: 'I wish I ___ speak French.', choices: ['could', 'can', 'will', 'am able'], answer: 'could', explain: 'I wish＋仮定法過去（could）で現在の願望。', sentence: { en: 'I wish I could speak French.', ja: 'フランス語が話せたらなあ。' } },
  { id: 'gr_pre1_conc_1', level: 'pre1', topic: '譲歩', q: '___ rich he is, he is never happy.', choices: ['However', 'Whatever', 'No matter', 'Although'], answer: 'However', explain: 'However＋形容詞＋S＋V で「どんなに〜でも」。', sentence: { en: 'However rich he is, he is never happy.', ja: 'どんなに金持ちでも彼は決して幸せでない。' } },

  // ───────── 1級（大学上級）─────────
  { id: 'gr_1_invc_1', level: '1', topic: '倒置・強調', q: 'Not until then ___ the truth.', choices: ['did I realize', 'I realized', 'I did realize', 'realized I'], answer: 'did I realize', explain: 'Not until ... が文頭で倒置〈did＋主語＋原形〉。', sentence: { en: 'Not until then did I realize the truth.', ja: 'そのときになって初めて真実に気づいた。' } },
  { id: 'gr_1_subj_1', level: '1', topic: '仮定法・語法', q: 'The doctor suggested that he ___ a rest.', choices: ['take', 'takes', 'took', 'taking'], answer: 'take', explain: 'suggest など要求・提案の that節は動詞原形(should省略)。', sentence: { en: 'The doctor suggested that he take a rest.', ja: '医者は彼に休養をとるよう勧めた。' } },
  { id: 'gr_1_idiom_1', level: '1', topic: '高度語法', q: 'He spoke as though he ___ everything.', choices: ['knew', 'knows', 'has known', 'know'], answer: 'knew', explain: 'as though＋仮定法過去で「まるで〜のように」。', sentence: { en: 'He spoke as though he knew everything.', ja: '彼はまるで何でも知っているかのように話した。' } },

  // ───────── 5級 追加 ─────────
  { id: 'gr_5_be_4', level: '5', topic: 'be動詞', q: '___ you a teacher? — Yes, I am.', choices: ['Are', 'Is', 'Am', 'Do'], answer: 'Are', explain: '主語 you の be動詞疑問文は Are で始める。', sentence: { en: 'Are you a teacher?', ja: 'あなたは先生ですか。' } },
  { id: 'gr_5_art_1', level: '5', topic: '冠詞', q: 'I have ___ apple.', choices: ['an', 'a', 'the', 'one'], answer: 'an', explain: '母音で始まる語の前は a でなく an。', sentence: { en: 'I have an apple.', ja: '私はリンゴを1個持っています。' } },
  { id: 'gr_5_this_1', level: '5', topic: '指示語', q: '___ are my books.', choices: ['These', 'This', 'That', 'It'], answer: 'These', explain: '複数(books)を指すので These。', sentence: { en: 'These are my books.', ja: 'これらは私の本です。' } },
  { id: 'gr_5_wh_3', level: '5', topic: '疑問詞', q: '___ is that man? — He is my uncle.', choices: ['Who', 'What', 'Whose', 'Where'], answer: 'Who', explain: '人が誰かをたずねるときは Who。', sentence: { en: 'Who is that man?', ja: 'あの男性は誰ですか。' } },
  { id: 'gr_5_how_1', level: '5', topic: '疑問詞', q: '___ many pens do you have?', choices: ['How', 'What', 'How much', 'Which'], answer: 'How', explain: '数をたずねる how many。後ろは複数名詞。', sentence: { en: 'How many pens do you have?', ja: 'ペンを何本持っていますか。' } },
  { id: 'gr_5_can_2', level: '5', topic: '助動詞 can', q: '___ I open the window?', choices: ['Can', 'Do', 'Am', 'Is'], answer: 'Can', explain: 'Can I 〜? で許可を求める。', sentence: { en: 'Can I open the window?', ja: '窓を開けてもいいですか。' } },
  { id: 'gr_5_prep_3', level: '5', topic: '前置詞', q: 'My birthday is ___ April.', choices: ['in', 'on', 'at', 'to'], answer: 'in', explain: '月の前は in。', sentence: { en: 'My birthday is in April.', ja: '私の誕生日は4月です。' } },

  // ───────── 4級 追加 ─────────
  { id: 'gr_4_inf_3', level: '4', topic: '不定詞', q: 'He went to the library ___ books.', choices: ['to borrow', 'borrow', 'borrowing', 'borrowed'], answer: 'to borrow', explain: '目的「〜するために」を表す副詞的用法の不定詞。', sentence: { en: 'He went to the library to borrow books.', ja: '彼は本を借りるために図書館へ行った。' } },
  { id: 'gr_4_ger_2', level: '4', topic: '動名詞', q: '___ books is fun.', choices: ['Reading', 'Read', 'To reading', 'Reads'], answer: 'Reading', explain: '動名詞は主語にもなれる（〜することは）。', sentence: { en: 'Reading books is fun.', ja: '読書は楽しい。' } },
  { id: 'gr_4_comp_4', level: '4', topic: '比較', q: 'This is the ___ mountain in Japan.', choices: ['highest', 'higher', 'high', 'most high'], answer: 'highest', explain: '短い語の最上級は -est。the をつける。', sentence: { en: 'This is the highest mountain in Japan.', ja: 'これは日本で一番高い山です。' } },
  { id: 'gr_4_must_1', level: '4', topic: '助動詞', q: 'You ___ not run here.', choices: ['must', 'are', 'do', 'have'], answer: 'must', explain: 'must not で「〜してはいけない」（禁止）。', sentence: { en: 'You must not run here.', ja: 'ここで走ってはいけません。' } },
  { id: 'gr_4_have_to_1', level: '4', topic: '助動詞', q: 'I ___ to get up early tomorrow.', choices: ['have', 'must', 'am', 'do'], answer: 'have', explain: 'have to＋原形で「〜しなければならない」。', sentence: { en: 'I have to get up early tomorrow.', ja: '明日は早く起きなければならない。' } },
  { id: 'gr_4_conj_2', level: '4', topic: '接続詞', q: 'I was tired, ___ I went to bed early.', choices: ['so', 'but', 'or', 'that'], answer: 'so', explain: 'so は「だから」と結果を表す。', sentence: { en: 'I was tired, so I went to bed early.', ja: '疲れていたので早く寝た。' } },
  { id: 'gr_4_conj_3', level: '4', topic: '接続詞', q: 'I think ___ he is right.', choices: ['that', 'what', 'if', 'so'], answer: 'that', explain: 'think that 〜 で「〜だと思う」。that は省略可。', sentence: { en: 'I think that he is right.', ja: '私は彼が正しいと思う。' } },

  // ───────── 3級 追加 ─────────
  { id: 'gr_3_perf_4', level: '3', topic: '現在完了', q: 'I have known him ___ 2010.', choices: ['since', 'for', 'from', 'in'], answer: 'since', explain: '起点は since（〜以来）、期間は for。', sentence: { en: 'I have known him since 2010.', ja: '私は2010年から彼を知っている。' } },
  { id: 'gr_3_perf_5', level: '3', topic: '現在完了', q: 'He has not come home ___.', choices: ['yet', 'already', 'ever', 'since'], answer: 'yet', explain: '否定文の文末 yet は「まだ（〜ない）」。', sentence: { en: 'He has not come home yet.', ja: '彼はまだ帰宅していない。' } },
  { id: 'gr_3_pass_3', level: '3', topic: '受動態', q: 'English ___ all over the world.', choices: ['is spoken', 'speaks', 'is speaking', 'spoke'], answer: 'is spoken', explain: '受動態 be＋過去分詞。「話されている」。', sentence: { en: 'English is spoken all over the world.', ja: '英語は世界中で話されている。' } },
  { id: 'gr_3_rel_3', level: '3', topic: '関係代名詞', q: 'The man ___ I met was kind.', choices: ['whom', 'who is', 'which', 'whose'], answer: 'whom', explain: '関係詞節で met の目的語になるため、目的格 whom を使う。会話では who や that、または省略も可能。', sentence: { en: 'The man whom I met was kind.', ja: '私が会った男性は親切だった。' } },
  { id: 'gr_3_inf_3', level: '3', topic: '不定詞応用', q: 'I was glad ___ the news.', choices: ['to hear', 'hear', 'hearing', 'heard'], answer: 'to hear', explain: '感情の原因を表す副詞的用法（〜して）。', sentence: { en: 'I was glad to hear the news.', ja: 'その知らせを聞いてうれしかった。' } },
  { id: 'gr_3_comp_2', level: '3', topic: '比較応用', q: 'Tokyo is one of the ___ cities in the world.', choices: ['largest', 'larger', 'large', 'more large'], answer: 'largest', explain: 'one of the＋最上級＋複数名詞（最も〜のひとつ）。', sentence: { en: 'Tokyo is one of the largest cities in the world.', ja: '東京は世界最大級の都市の一つだ。' } },
  { id: 'gr_3_so_1', level: '3', topic: 'so...that', q: 'He was ___ tired that he fell asleep.', choices: ['so', 'such', 'too', 'very'], answer: 'so', explain: 'so＋形容詞＋that …（とても〜なので…）。', sentence: { en: 'He was so tired that he fell asleep.', ja: '彼はとても疲れていて眠ってしまった。' } },

  // ───────── 準2級 追加 ─────────
  { id: 'gr_pre2_part_3', level: 'pre2', topic: '分詞', q: 'I heard someone ___ my name.', choices: ['calling', 'call', 'to call', 'called'], answer: 'calling', explain: '知覚動詞 hear＋O＋ing（〜しているのが聞こえる）。', sentence: { en: 'I heard someone calling my name.', ja: '誰かが私の名前を呼んでいるのが聞こえた。' } },
  { id: 'gr_pre2_perf_1', level: 'pre2', topic: '現在完了進行形', q: 'It ___ raining since morning.', choices: ['has been', 'is', 'was', 'has'], answer: 'has been', explain: '現在完了進行形 have been＋ing（ずっと〜し続けている）。', sentence: { en: 'It has been raining since morning.', ja: '朝からずっと雨が降り続いている。' } },
  { id: 'gr_pre2_rel_1', level: 'pre2', topic: '関係代名詞(継続)', q: 'My uncle, ___ lives in NY, is a doctor.', choices: ['who', 'that', 'which', 'whom'], answer: 'who', explain: '非制限用法（コンマ）では that は使えない。人は who。', sentence: { en: 'My uncle, who lives in NY, is a doctor.', ja: 'おじはニューヨークに住んでいて、医者だ。' } },
  { id: 'gr_pre2_subj_2', level: 'pre2', topic: '仮定法(基礎)', q: 'If I had time, I ___ help you.', choices: ['would', 'will', 'can', 'am'], answer: 'would', explain: '仮定法過去の帰結節は would＋原形。', sentence: { en: 'If I had time, I would help you.', ja: '時間があれば手伝うのに。' } },
  { id: 'gr_pre2_caus_2', level: 'pre2', topic: '使役・知覚', q: 'I had my hair ___ yesterday.', choices: ['cut', 'cutting', 'to cut', 'cuts'], answer: 'cut', explain: 'have＋物＋過去分詞（〜してもらう/される）。', sentence: { en: 'I had my hair cut yesterday.', ja: '昨日髪を切ってもらった。' } },
  { id: 'gr_pre2_let_1', level: 'pre2', topic: '使役・知覚', q: 'Please let me ___ your bag.', choices: ['carry', 'to carry', 'carrying', 'carried'], answer: 'carry', explain: 'let＋O＋原形（〜させてやる）。', sentence: { en: 'Please let me carry your bag.', ja: 'かばんを持たせてください。' } },
  { id: 'gr_pre2_too_1', level: 'pre2', topic: 'too/enough', q: 'This coffee is too hot ___ drink.', choices: ['to', 'for', 'that', 'so'], answer: 'to', explain: 'too＋形容詞＋to do（…すぎて〜できない）。', sentence: { en: 'This coffee is too hot to drink.', ja: 'このコーヒーは熱すぎて飲めない。' } },
  { id: 'gr_pre2_indq_1', level: 'pre2', topic: '間接疑問', q: 'I wonder ___ it will rain.', choices: ['whether', 'that', 'what', 'which'], answer: 'whether', explain: 'whether/if は「〜かどうか」を表す。', sentence: { en: 'I wonder whether it will rain.', ja: '雨が降るかどうか気になる。' } },

  // ───────── 2級 追加 ─────────
  { id: 'gr_2_subj_1', level: '2', topic: '仮定法', q: 'I wish I ___ taller.', choices: ['were', 'am', 'was being', 'will be'], answer: 'were', explain: 'I wish＋仮定法過去（現在の願望）。be は were。', sentence: { en: 'I wish I were taller.', ja: 'もっと背が高ければなあ。' } },
  { id: 'gr_2_subj_2', level: '2', topic: '仮定法', q: '___ for your help, I would have failed.', choices: ['But', 'Except', 'Without', 'Unless'], answer: 'But', explain: 'But for 〜（〜がなかったら）＝仮定法。', sentence: { en: 'But for your help, I would have failed.', ja: 'あなたの助けがなければ失敗していただろう。' } },
  { id: 'gr_2_partc_2', level: '2', topic: '分詞構文', q: '___ from space, the earth looks blue.', choices: ['Seen', 'Seeing', 'See', 'To see'], answer: 'Seen', explain: '受動の分詞構文は過去分詞で始める（〜されると）。', sentence: { en: 'Seen from space, the earth looks blue.', ja: '宇宙から見ると地球は青く見える。' } },
  { id: 'gr_2_emph_1', level: '2', topic: '強調構文', q: 'It was John ___ broke the window.', choices: ['that', 'what', 'which', 'whom'], answer: 'that', explain: 'It is/was ... that 〜 の強調構文。', sentence: { en: 'It was John that broke the window.', ja: '窓を割ったのはジョンだった。' } },
  { id: 'gr_2_inanimate_1', level: '2', topic: '無生物主語', q: 'The heavy rain ___ us from going out.', choices: ['prevented', 'stopped to', 'avoided', 'refused'], answer: 'prevented', explain: 'prevent＋O＋from doing（OがVするのを妨げる）。', sentence: { en: 'The heavy rain prevented us from going out.', ja: '大雨で外出できなかった。' } },
  { id: 'gr_2_conj_1', level: '2', topic: '接続副詞', q: 'He is rich; ___, he is not happy.', choices: ['however', 'therefore', 'moreover', 'thus'], answer: 'however', explain: 'however は「しかしながら」と逆接。', sentence: { en: 'He is rich; however, he is not happy.', ja: '彼は裕福だが、幸せではない。' } },
  { id: 'gr_2_rel_1', level: '2', topic: '関係代名詞応用', q: 'He has two sons, both of ___ are doctors.', choices: ['whom', 'who', 'which', 'them'], answer: 'whom', explain: '前置詞 of の後は目的格 whom。', sentence: { en: 'He has two sons, both of whom are doctors.', ja: '彼には息子が2人いて、2人とも医者だ。' } },

  // ───────── 準1級 追加 ─────────
  { id: 'gr_pre1_inv_2', level: 'pre1', topic: '倒置', q: 'Hardly had I arrived ___ it began to rain.', choices: ['when', 'than', 'that', 'then'], answer: 'when', explain: 'Hardly had S done when 〜（〜するやいなや）。', sentence: { en: 'Hardly had I arrived when it began to rain.', ja: '着くやいなや雨が降り出した。' } },
  { id: 'gr_pre1_subj_2', level: 'pre1', topic: '仮定法応用', q: '___ I known, I would have told you.', choices: ['Had', 'If', 'Have', 'Did'], answer: 'Had', explain: 'if省略の倒置：Had＋S＋過分（=If S had done）。', sentence: { en: 'Had I known, I would have told you.', ja: '知っていたら教えたのに。' } },
  { id: 'gr_pre1_part_1', level: 'pre1', topic: '独立分詞構文', q: 'The weather ___ fine, we went hiking.', choices: ['being', 'is', 'was', 'be'], answer: 'being', explain: '独立分詞構文：主語が異なる分詞構文（〜なので）。', sentence: { en: 'The weather being fine, we went hiking.', ja: '天気がよかったのでハイキングに行った。' } },
  { id: 'gr_pre1_conc_2', level: 'pre1', topic: '譲歩', q: '___ she was, she kept working.', choices: ['Tired as', 'As tired', 'Though tired', 'Although tired'], answer: 'Tired as', explain: '〈形容詞＋as＋S＋V〉で「〜だけれども」（譲歩の倒置）。', sentence: { en: 'Tired as she was, she kept working.', ja: '疲れていたが彼女は働き続けた。' } },
  { id: 'gr_pre1_nounclause_1', level: 'pre1', topic: '名詞節', q: 'The fact ___ he lied shocked us.', choices: ['that', 'which', 'what', 'whether'], answer: 'that', explain: '同格の that（〜という事実）。後ろは完全文。', sentence: { en: 'The fact that he lied shocked us.', ja: '彼がうそをついたという事実に私たちは衝撃を受けた。' } },

  // ───────── 1級 追加 ─────────
  { id: 'gr_1_inv_2', level: '1', topic: '倒置・強調', q: 'Only after the war ___ the truth.', choices: ['did they learn', 'they learned', 'they did learn', 'learned they'], answer: 'did they learn', explain: 'Only＋副詞句が文頭→倒置〈did＋S＋原形〉。', sentence: { en: 'Only after the war did they learn the truth.', ja: '戦後になって初めて彼らは真実を知った。' } },
  { id: 'gr_1_subj_2', level: '1', topic: '仮定法・語法', q: 'It is essential that every student ___ present.', choices: ['be', 'is', 'was', 'will be'], answer: 'be', explain: 'essential などの that節は should省略の原形(be)。', sentence: { en: 'It is essential that every student be present.', ja: '全生徒が出席することが不可欠だ。' } },
  { id: 'gr_1_were_1', level: '1', topic: '仮定法・語法', q: '___ to do it again, I would choose differently.', choices: ['Were I', 'If I am', 'Was I', 'Should I be'], answer: 'Were I', explain: 'if省略倒置の仮定法：Were S to do（仮に〜なら）。', sentence: { en: 'Were I to do it again, I would choose differently.', ja: '仮にもう一度やるなら別の選択をするだろう。' } },
  { id: 'gr_1_idiom_2', level: '1', topic: '高度語法', q: 'No sooner had he sat down ___ the phone rang.', choices: ['than', 'when', 'that', 'then'], answer: 'than', explain: 'No sooner had S done than 〜（〜するやいなや）。', sentence: { en: 'No sooner had he sat down than the phone rang.', ja: '彼が座るやいなや電話が鳴った。' } },

  // ═══════════ 充実バッチ ═══════════
  // ───────── 5級 ─────────
  { id: 'gr_5_be_5', level: '5', topic: 'be動詞', q: 'My parents ___ teachers.', choices: ['are', 'is', 'am', 'be'], answer: 'are', explain: 'parents は複数なので are。', sentence: { en: 'My parents are teachers.', ja: '私の両親は教師です。' } },
  { id: 'gr_5_verb_4', level: '5', topic: '一般動詞・3単現', q: 'My father ___ a car.', choices: ['has', 'have', 'haves', 'having'], answer: 'has', explain: 'have の3単現は has（不規則）。', sentence: { en: 'My father has a car.', ja: '父は車を持っています。' } },
  { id: 'gr_5_verb_5', level: '5', topic: '一般動詞・3単現', q: 'Does he ___ English?', choices: ['speak', 'speaks', 'speaking', 'spoke'], answer: 'speak', explain: 'Does の疑問文では動詞は原形。', sentence: { en: 'Does he speak English?', ja: '彼は英語を話しますか。' } },
  { id: 'gr_5_plural_3', level: '5', topic: '名詞の複数形', q: 'I see three ___ over there.', choices: ['children', 'childs', 'childes', 'child'], answer: 'children', explain: 'child の複数は children（不規則）。', sentence: { en: 'I see three children over there.', ja: '向こうに3人の子どもが見える。' } },
  { id: 'gr_5_plural_4', level: '5', topic: '名詞の複数形', q: 'There are many ___ in the pond.', choices: ['fish', 'fishs', 'fishies', 'fishes'], answer: 'fish', explain: 'fish は単複同形（複数でも fish）。', sentence: { en: 'There are many fish in the pond.', ja: '池にたくさんの魚がいる。' } },
  { id: 'gr_5_pron_3', level: '5', topic: '代名詞', q: '___ is a doctor. (Tom)', choices: ['He', 'His', 'Him', 'They'], answer: 'He', explain: '主語には主格 he を使う。', sentence: { en: 'He is a doctor.', ja: '彼は医者です。' } },
  { id: 'gr_5_pron_4', level: '5', topic: '代名詞', q: 'These are ___ pencils.', choices: ['our', 'us', 'ours', 'we'], answer: 'our', explain: '名詞の前は所有格 our（私たちの）。', sentence: { en: 'These are our pencils.', ja: 'これらは私たちの鉛筆です。' } },
  { id: 'gr_5_wh_4', level: '5', topic: '疑問詞', q: '___ bag is this? — It’s Mary’s.', choices: ['Whose', 'Who', 'Which', 'What'], answer: 'Whose', explain: '持ち主をたずねるときは Whose。', sentence: { en: 'Whose bag is this?', ja: 'これは誰のかばんですか。' } },
  { id: 'gr_5_wh_5', level: '5', topic: '疑問詞', q: '___ time is it now?', choices: ['What', 'When', 'How', 'Which'], answer: 'What', explain: '時刻は What time でたずねる。', sentence: { en: 'What time is it now?', ja: '今何時ですか。' } },
  { id: 'gr_5_prep_4', level: '5', topic: '前置詞', q: 'We play soccer ___ Sundays.', choices: ['on', 'in', 'at', 'to'], answer: 'on', explain: '曜日の前は on。', sentence: { en: 'We play soccer on Sundays.', ja: '私たちは日曜日にサッカーをする。' } },
  { id: 'gr_5_prep_5', level: '5', topic: '前置詞', q: 'There is a picture ___ the wall.', choices: ['on', 'in', 'under', 'of'], answer: 'on', explain: '壁などに接して「〜に」は on。', sentence: { en: 'There is a picture on the wall.', ja: '壁に絵がかかっている。' } },
  { id: 'gr_5_imp_2', level: '5', topic: '命令文', q: '___ open the door.', choices: ['Don’t', 'Not', 'No', 'Doesn’t'], answer: 'Don’t', explain: '否定命令は Don’t＋動詞の原形。', sentence: { en: 'Don’t open the door.', ja: 'ドアを開けないで。' } },
  { id: 'gr_5_lets_1', level: '5', topic: '命令文', q: '___ play tennis.', choices: ['Let’s', 'Let', 'We', 'Do'], answer: 'Let’s', explain: 'Let’s＋原形で「〜しよう」と勧誘。', sentence: { en: 'Let’s play tennis.', ja: 'テニスをしよう。' } },
  { id: 'gr_5_prog_2', level: '5', topic: '現在進行形', q: 'They ___ lunch now.', choices: ['are having', 'have', 'has', 'having'], answer: 'are having', explain: '進行形は be動詞＋ing。主語複数は are。', sentence: { en: 'They are having lunch now.', ja: '彼らは今昼食をとっている。' } },
  { id: 'gr_5_can_3', level: '5', topic: '助動詞 can', q: 'My dog ___ run fast.', choices: ['can', 'cans', 'is', 'can to'], answer: 'can', explain: 'can のあとは原形、s不要。', sentence: { en: 'My dog can run fast.', ja: '私の犬は速く走れる。' } },

  // ───────── 4級 ─────────
  { id: 'gr_4_past_4', level: '4', topic: '過去形', q: 'I ___ a movie last night.', choices: ['saw', 'see', 'seen', 'sees'], answer: 'saw', explain: 'see の過去形は saw。', sentence: { en: 'I saw a movie last night.', ja: '私は昨夜映画を見た。' } },
  { id: 'gr_4_past_5', level: '4', topic: '過去形', q: 'She ___ breakfast at seven.', choices: ['had', 'has', 'have', 'having'], answer: 'had', explain: 'have の過去形は had。', sentence: { en: 'She had breakfast at seven.', ja: '彼女は7時に朝食をとった。' } },
  { id: 'gr_4_past_6', level: '4', topic: '過去形', q: 'I ___ not busy yesterday.', choices: ['was', 'were', 'did', 'am'], answer: 'was', explain: 'be動詞の過去（I）は was。', sentence: { en: 'I was not busy yesterday.', ja: '私は昨日忙しくなかった。' } },
  { id: 'gr_4_future_3', level: '4', topic: '未来表現', q: 'What ___ you do tomorrow?', choices: ['will', 'do', 'are', 'did'], answer: 'will', explain: '未来の疑問文は will＋主語＋原形。', sentence: { en: 'What will you do tomorrow?', ja: '明日は何をしますか。' } },
  { id: 'gr_4_comp_5', level: '4', topic: '比較', q: 'This bag is ___ than that one.', choices: ['better', 'gooder', 'good', 'best'], answer: 'better', explain: 'good の比較級は better（不規則）。', sentence: { en: 'This bag is better than that one.', ja: 'このかばんはあれよりよい。' } },
  { id: 'gr_4_comp_6', level: '4', topic: '比較', q: 'Ken is ___ tall as his father.', choices: ['as', 'so', 'more', 'than'], answer: 'as', explain: 'as＋原級＋as（同じくらい〜）。', sentence: { en: 'Ken is as tall as his father.', ja: 'ケンは父と同じくらい背が高い。' } },
  { id: 'gr_4_modal_2', level: '4', topic: '助動詞', q: '___ you open the window? — Sure.', choices: ['Could', 'Do', 'Are', 'May'], answer: 'Could', explain: 'Could you 〜? で丁寧な依頼。', sentence: { en: 'Could you open the window?', ja: '窓を開けてくれますか。' } },
  { id: 'gr_4_modal_3', level: '4', topic: '助動詞', q: '___ I use your pen?', choices: ['May', 'Do', 'Am', 'Will'], answer: 'May', explain: 'May I 〜? で許可を求める（丁寧）。', sentence: { en: 'May I use your pen?', ja: 'ペンをお借りしてもいいですか。' } },
  { id: 'gr_4_inf_4', level: '4', topic: '不定詞', q: 'It started ___ rain.', choices: ['to', 'for', 'at', 'of'], answer: 'to', explain: 'start to do（〜し始める）。', sentence: { en: 'It started to rain.', ja: '雨が降り始めた。' } },
  { id: 'gr_4_ger_3', level: '4', topic: '動名詞', q: 'Thank you for ___ me.', choices: ['helping', 'help', 'to help', 'helped'], answer: 'helping', explain: '前置詞 for のあとは動名詞(ing)。', sentence: { en: 'Thank you for helping me.', ja: '手伝ってくれてありがとう。' } },
  { id: 'gr_4_ger_4', level: '4', topic: '動名詞', q: 'Stop ___ , please.', choices: ['talking', 'to talk', 'talk', 'talked'], answer: 'talking', explain: 'stop doing は「〜するのをやめる」。', sentence: { en: 'Stop talking, please.', ja: 'おしゃべりをやめてください。' } },
  { id: 'gr_4_conj_4', level: '4', topic: '接続詞', q: '___ you are free, let’s go out.', choices: ['If', 'That', 'But', 'So'], answer: 'If', explain: 'If は「もし〜なら」の条件。', sentence: { en: 'If you are free, let’s go out.', ja: 'もしひまなら出かけよう。' } },
  { id: 'gr_4_conj_5', level: '4', topic: '接続詞', q: 'Wash your hands ___ you eat.', choices: ['before', 'during', 'while', 'that'], answer: 'before', explain: 'before は「〜する前に」。', sentence: { en: 'Wash your hands before you eat.', ja: '食べる前に手を洗いなさい。' } },
  { id: 'gr_4_there_2', level: '4', topic: 'There is/are', q: '___ a cat under the chair.', choices: ['There is', 'There are', 'It is', 'Have'], answer: 'There is', explain: '単数(a cat)なら There is。', sentence: { en: 'There is a cat under the chair.', ja: 'いすの下に猫がいる。' } },
  { id: 'gr_4_pastprog_2', level: '4', topic: '過去進行形', q: 'They ___ playing soccer then.', choices: ['were', 'was', 'are', 'did'], answer: 'were', explain: '主語複数の過去進行形は were＋ing。', sentence: { en: 'They were playing soccer then.', ja: '彼らはそのときサッカーをしていた。' } },
  { id: 'gr_4_howto_1', level: '4', topic: '疑問詞+不定詞', q: 'I don’t know how ___ to the station.', choices: ['to get', 'getting', 'get', 'got'], answer: 'to get', explain: 'how to do（〜のしかた）。', sentence: { en: 'I don’t know how to get to the station.', ja: '駅への行き方がわからない。' } },

  // ───────── 3級 ─────────
  { id: 'gr_3_perf_6', level: '3', topic: '現在完了', q: 'Have you ___ been to Hawaii?', choices: ['ever', 'yet', 'already', 'just'], answer: 'ever', explain: '経験をたずねる疑問文では ever（今までに）。', sentence: { en: 'Have you ever been to Hawaii?', ja: '今までにハワイへ行ったことがありますか。' } },
  { id: 'gr_3_perf_7', level: '3', topic: '現在完了', q: 'The train has ___ left.', choices: ['just', 'yet', 'ever', 'since'], answer: 'just', explain: 'just は「ちょうど〜したところ」（完了）。', sentence: { en: 'The train has just left.', ja: '電車はちょうど出たところだ。' } },
  { id: 'gr_3_pass_4', level: '3', topic: '受動態', q: '___ this letter written by Tom?', choices: ['Was', 'Did', 'Has', 'Were'], answer: 'Was', explain: '受動態の疑問文は be動詞を前へ。単数過去は Was。', sentence: { en: 'Was this letter written by Tom?', ja: 'この手紙はトムによって書かれましたか。' } },
  { id: 'gr_3_pass_5', level: '3', topic: '受動態', q: 'The mountain is covered ___ snow.', choices: ['with', 'by', 'of', 'in'], answer: 'with', explain: 'be covered with（〜で覆われている）。byでない熟語。', sentence: { en: 'The mountain is covered with snow.', ja: '山は雪で覆われている。' } },
  { id: 'gr_3_rel_4', level: '3', topic: '関係代名詞', q: 'I have a dog ___ name is Pochi.', choices: ['whose', 'who', 'which', 'that'], answer: 'whose', explain: '所有を表す関係代名詞は whose。', sentence: { en: 'I have a dog whose name is Pochi.', ja: '私はポチという名前の犬を飼っている。' } },
  { id: 'gr_3_rel_5', level: '3', topic: '関係代名詞', q: 'This is the best movie ___ I have ever seen.', choices: ['that', 'who', 'whose', 'where'], answer: 'that', explain: '最上級が先行詞のときは that を好む。', sentence: { en: 'This is the best movie that I have ever seen.', ja: 'これは今まで見た中で最高の映画だ。' } },
  { id: 'gr_3_indq_3', level: '3', topic: '間接疑問', q: 'Do you know ___ this is?', choices: ['what', 'what is', 'how', 'that'], answer: 'what', explain: '間接疑問は〈疑問詞＋主語＋動詞〉。', sentence: { en: 'Do you know what this is?', ja: 'これが何か知っていますか。' } },
  { id: 'gr_3_inf_4', level: '3', topic: '不定詞応用', q: 'This box is too heavy ___ carry.', choices: ['to', 'for', 'that', 'so'], answer: 'to', explain: 'too＋形容詞＋to do（…すぎて〜できない）。', sentence: { en: 'This box is too heavy to carry.', ja: 'この箱は重すぎて運べない。' } },
  { id: 'gr_3_inf_5', level: '3', topic: '不定詞応用', q: 'He is old enough ___ drive.', choices: ['to', 'for', 'that', 'of'], answer: 'to', explain: '形容詞＋enough to do（〜できるほど…）。', sentence: { en: 'He is old enough to drive.', ja: '彼は運転できる年齢だ。' } },
  { id: 'gr_3_part_1', level: '3', topic: '分詞', q: 'The girl ___ over there is my sister.', choices: ['standing', 'stand', 'stood', 'to stand'], answer: 'standing', explain: '現在分詞 -ing が名詞を後置修飾（〜している）。', sentence: { en: 'The girl standing over there is my sister.', ja: '向こうに立っている女の子は私の妹だ。' } },
  { id: 'gr_3_part_2', level: '3', topic: '分詞', q: 'I read a book ___ in easy English.', choices: ['written', 'writing', 'wrote', 'write'], answer: 'written', explain: '過去分詞が名詞を後置修飾（〜された）。', sentence: { en: 'I read a book written in easy English.', ja: '私は易しい英語で書かれた本を読んだ。' } },
  { id: 'gr_3_comp_3', level: '3', topic: '比較応用', q: 'This room is twice as large ___ that one.', choices: ['as', 'than', 'so', 'that'], answer: 'as', explain: '倍数＋as＋原級＋as（〜の…倍）。', sentence: { en: 'This room is twice as large as that one.', ja: 'この部屋はあの部屋の2倍の広さだ。' } },
  { id: 'gr_3_svoc_2', level: '3', topic: '文型(SVOO/SVOC)', q: 'Please keep the door ___.', choices: ['open', 'opening', 'opened', 'to open'], answer: 'open', explain: 'keep＋O＋C(形容詞)で「Oを〜のままにする」。', sentence: { en: 'Please keep the door open.', ja: 'ドアを開けたままにしておいてください。' } },
  { id: 'gr_3_conj_1', level: '3', topic: '接続詞', q: 'I stayed home ___ it was raining.', choices: ['because', 'so', 'but', 'or'], answer: 'because', explain: 'because は理由「〜だから」を表す。', sentence: { en: 'I stayed home because it was raining.', ja: '雨だったので家にいた。' } },

  // ───────── 準2級 ─────────
  { id: 'gr_pre2_partc_1', level: 'pre2', topic: '分詞構文', q: '___ down the street, I met Tom.', choices: ['Walking', 'Walked', 'Walk', 'To walk'], answer: 'Walking', explain: '分詞構文 -ing で「〜していると」。', sentence: { en: 'Walking down the street, I met Tom.', ja: '通りを歩いているとトムに会った。' } },
  { id: 'gr_pre2_what_1', level: 'pre2', topic: '関係代名詞 what', q: 'Tell me ___ you want.', choices: ['what', 'that', 'which', 'how'], answer: 'what', explain: 'what は先行詞を含み「〜するもの/こと」。', sentence: { en: 'Tell me what you want.', ja: '欲しいものを言って。' } },
  { id: 'gr_pre2_reladv_2', level: 'pre2', topic: '関係副詞', q: 'I remember the day ___ we first met.', choices: ['when', 'which', 'where', 'who'], answer: 'when', explain: '先行詞が時で後ろが完全文なら関係副詞 when。', sentence: { en: 'I remember the day when we first met.', ja: '私たちが初めて会った日を覚えている。' } },
  { id: 'gr_pre2_reladv_3', level: 'pre2', topic: '関係副詞', q: 'Tell me the reason ___ you were late.', choices: ['why', 'which', 'how', 'when'], answer: 'why', explain: '先行詞が reason のときは関係副詞 why。', sentence: { en: 'Tell me the reason why you were late.', ja: '遅れた理由を教えて。' } },
  { id: 'gr_pre2_pastperf_1', level: 'pre2', topic: '過去完了', q: 'The train had ___ when I arrived.', choices: ['left', 'leave', 'leaving', 'leaves'], answer: 'left', explain: '過去完了 had＋過去分詞（過去のある時より前）。', sentence: { en: 'The train had left when I arrived.', ja: '私が着いたとき電車はすでに出ていた。' } },
  { id: 'gr_pre2_caus_3', level: 'pre2', topic: '使役・知覚', q: 'I saw him ___ the room.', choices: ['enter', 'to enter', 'enters', 'entered'], answer: 'enter', explain: '知覚動詞 see＋O＋原形（〜するのを見る）。', sentence: { en: 'I saw him enter the room.', ja: '彼が部屋に入るのを見た。' } },
  { id: 'gr_pre2_caus_4', level: 'pre2', topic: '使役・知覚', q: 'I got my brother ___ help me.', choices: ['to', 'do', 'will', 'for'], answer: 'to', explain: 'get＋O＋to do（Oに〜させる/してもらう）。', sentence: { en: 'I got my brother to help me.', ja: '弟に手伝ってもらった。' } },
  { id: 'gr_pre2_help_1', level: 'pre2', topic: '使役・知覚', q: 'She helped me ___ my homework.', choices: ['do', 'doing', 'did', 'does'], answer: 'do', explain: 'help＋O＋(to) do。原形が一般的。', sentence: { en: 'She helped me do my homework.', ja: '彼女は私の宿題を手伝ってくれた。' } },
  { id: 'gr_pre2_such_1', level: 'pre2', topic: 'so/such...that', q: 'It was ___ a hot day that we stayed inside.', choices: ['such', 'so', 'too', 'very'], answer: 'such', explain: 'such＋(a)＋形容詞＋名詞＋that …。', sentence: { en: 'It was such a hot day that we stayed inside.', ja: 'とても暑い日だったので中にいた。' } },
  { id: 'gr_pre2_notonly_1', level: 'pre2', topic: '相関接続詞', q: 'He can speak not only English ___ also French.', choices: ['but', 'and', 'or', 'nor'], answer: 'but', explain: 'not only A but also B（AだけでなくBも）。', sentence: { en: 'He can speak not only English but also French.', ja: '彼は英語だけでなくフランス語も話せる。' } },
  { id: 'gr_pre2_thethe_1', level: 'pre2', topic: '比較応用', q: 'The harder you study, ___ better you will be.', choices: ['the', 'a', 'so', 'much'], answer: 'the', explain: 'The＋比較級, the＋比較級（〜するほど…）。', sentence: { en: 'The harder you study, the better you will be.', ja: '一生懸命勉強するほど上達する。' } },
  { id: 'gr_pre2_prep_rel_1', level: 'pre2', topic: '前置詞+関係代名詞', q: 'This is the house in ___ he lives.', choices: ['which', 'where', 'that', 'who'], answer: 'which', explain: '前置詞のあとの関係代名詞は which（that不可）。', sentence: { en: 'This is the house in which he lives.', ja: 'これは彼が住んでいる家だ。' } },
  { id: 'gr_pre2_subj_3', level: 'pre2', topic: '仮定法(基礎)', q: 'If it ___ tomorrow, I will stay home.', choices: ['rains', 'rained', 'will rain', 'would rain'], answer: 'rains', explain: '条件のif節は未来でも現在形（時・条件の副詞節）。', sentence: { en: 'If it rains tomorrow, I will stay home.', ja: '明日雨なら家にいる。' } },

  // ───────── 2級 ─────────
  { id: 'gr_2_subj_3', level: '2', topic: '仮定法', q: 'If I ___ you, I would accept the offer.', choices: ['were', 'am', 'was', 'be'], answer: 'were', explain: '仮定法過去（現在の反実）。be は were。', sentence: { en: 'If I were you, I would accept the offer.', ja: '私があなたなら申し出を受けるのに。' } },
  { id: 'gr_2_subj_4', level: '2', topic: '仮定法', q: 'He acts as if he ___ the boss.', choices: ['were', 'is', 'will be', 'has been'], answer: 'were', explain: 'as if＋仮定法過去（まるで〜かのように）。', sentence: { en: 'He acts as if he were the boss.', ja: '彼はまるで上司であるかのようにふるまう。' } },
  { id: 'gr_2_subj_5', level: '2', topic: '仮定法', q: 'It’s time you ___ to bed.', choices: ['went', 'go', 'will go', 'have gone'], answer: 'went', explain: 'It’s time＋仮定法過去（もう〜する時間だ）。', sentence: { en: 'It’s time you went to bed.', ja: 'もう寝る時間だよ。' } },
  { id: 'gr_2_partc_3', level: '2', topic: '分詞構文', q: '___ finished the work, he went home.', choices: ['Having', 'Has', 'Have', 'Had'], answer: 'Having', explain: '完了の分詞構文 Having＋過分（〜し終えて）。', sentence: { en: 'Having finished the work, he went home.', ja: '仕事を終えて彼は帰宅した。' } },
  { id: 'gr_2_partc_4', level: '2', topic: '分詞構文', q: '___ what to say, she kept silent.', choices: ['Not knowing', 'Not know', 'Knowing not', 'Don’t know'], answer: 'Not knowing', explain: '分詞構文の否定は not を分詞の前に置く。', sentence: { en: 'Not knowing what to say, she kept silent.', ja: '何と言ってよいかわからず彼女は黙っていた。' } },
  { id: 'gr_2_inv_1', level: '2', topic: '倒置', q: 'I like coffee. — ___ do I.', choices: ['So', 'Neither', 'Either', 'Too'], answer: 'So', explain: 'So＋助動詞＋主語（〜も同様だ）。', sentence: { en: 'So do I.', ja: '私もです。' } },
  { id: 'gr_2_inv_2', level: '2', topic: '倒置', q: 'I can’t swim. — ___ can I.', choices: ['Neither', 'So', 'Either', 'Nor do'], answer: 'Neither', explain: '否定への同意は Neither＋助動詞＋主語。', sentence: { en: 'Neither can I.', ja: '私も泳げません。' } },
  { id: 'gr_2_emph_2', level: '2', topic: '強調構文', q: 'It was in Paris ___ I met her.', choices: ['that', 'where', 'which', 'when'], answer: 'that', explain: '副詞句の強調も It is ... that 〜。', sentence: { en: 'It was in Paris that I met her.', ja: '私が彼女に会ったのはパリでだった。' } },
  { id: 'gr_2_emph_3', level: '2', topic: '強調', q: 'I ___ want to see you.', choices: ['do', 'am', 'have', 'will'], answer: 'do', explain: '動詞の強調は do/does/did＋原形。', sentence: { en: 'I do want to see you.', ja: '本当にあなたに会いたい。' } },
  { id: 'gr_2_perf_2', level: '2', topic: '完了形応用', q: 'I ___ studying for two hours.', choices: ['have been', 'have', 'am', 'had'], answer: 'have been', explain: '現在完了進行形 have been＋ing（継続）。', sentence: { en: 'I have been studying for two hours.', ja: '私は2時間ずっと勉強している。' } },
  { id: 'gr_2_noun_1', level: '2', topic: '名詞節', q: 'I’m not sure ___ he will come.', choices: ['whether', 'that', 'what', 'which'], answer: 'whether', explain: 'whether/if は「〜かどうか」の名詞節。', sentence: { en: 'I’m not sure whether he will come.', ja: '彼が来るかどうかわからない。' } },
  { id: 'gr_2_partial_1', level: '2', topic: '部分否定', q: '___ all of them agreed.', choices: ['Not', 'No', 'None', 'Never'], answer: 'Not', explain: 'not all で「すべてが〜とは限らない」（部分否定）。', sentence: { en: 'Not all of them agreed.', ja: '全員が賛成したわけではない。' } },
  { id: 'gr_2_caus_1', level: '2', topic: '使役', q: 'The teacher had us ___ the room.', choices: ['clean', 'to clean', 'cleaning', 'cleaned'], answer: 'clean', explain: '使役 have＋O＋原形（〜させる）。', sentence: { en: 'The teacher had us clean the room.', ja: '先生は私たちに部屋を掃除させた。' } },

  // ───────── 準1級 ─────────
  { id: 'gr_pre1_inv_3', level: 'pre1', topic: '倒置', q: 'Not only ___ he late, but he was rude.', choices: ['was', 'he was', 'did', 'were'], answer: 'was', explain: 'Not only が文頭→倒置〈be/助動詞＋主語〉。', sentence: { en: 'Not only was he late, but he was rude.', ja: '彼は遅れただけでなく失礼でもあった。' } },
  { id: 'gr_pre1_inv_4', level: 'pre1', topic: '倒置', q: 'Little ___ that danger was near.', choices: ['did he know', 'he knew', 'he did know', 'knew he'], answer: 'did he know', explain: '否定語 Little が文頭→倒置。', sentence: { en: 'Little did he know that danger was near.', ja: '危険が迫っているとは彼は思いもしなかった。' } },
  { id: 'gr_pre1_subj_3', level: 'pre1', topic: '仮定法応用', q: '___ it not for water, nothing could live.', choices: ['Were', 'If', 'Had', 'Was'], answer: 'Were', explain: 'Were it not for 〜（〜がなければ）＝if省略倒置。', sentence: { en: 'Were it not for water, nothing could live.', ja: '水がなければ何も生きられない。' } },
  { id: 'gr_pre1_subj_4', level: 'pre1', topic: '仮定法応用', q: 'I would rather you ___ now.', choices: ['left', 'leave', 'will leave', 'have left'], answer: 'left', explain: 'would rather＋S＋仮定法過去（むしろ〜してほしい）。', sentence: { en: 'I would rather you left now.', ja: 'もう帰ってほしいのですが。' } },
  { id: 'gr_pre1_comp_1', level: 'pre1', topic: 'whatever等', q: '___ happens, I will support you.', choices: ['Whatever', 'However', 'Whenever', 'Wherever'], answer: 'Whatever', explain: '複合関係代名詞 whatever（何が〜しようとも）。', sentence: { en: 'Whatever happens, I will support you.', ja: '何が起ころうと君を支える。' } },
  { id: 'gr_pre1_conc_3', level: 'pre1', topic: '譲歩', q: '___ hard it may be, never give up.', choices: ['However', 'Whatever', 'Whichever', 'Whoever'], answer: 'However', explain: 'However＋形容詞/副詞＋S＋V（どんなに〜でも）。', sentence: { en: 'However hard it may be, never give up.', ja: 'どんなに難しくても決してあきらめるな。' } },
  { id: 'gr_pre1_part_2', level: 'pre1', topic: '分詞構文応用', q: '___ written in haste, the report had errors.', choices: ['Having been', 'Having', 'Being write', 'Wrote'], answer: 'Having been', explain: '完了受動の分詞構文 Having been＋過分。', sentence: { en: 'Having been written in haste, the report had errors.', ja: '急いで書かれたので報告書には誤りがあった。' } },

  // ───────── 1級 ─────────
  { id: 'gr_1_inv_3', level: '1', topic: '倒置・強調', q: 'So absurd ___ that no one believed it.', choices: ['was the story', 'the story was', 'did the story', 'the story did'], answer: 'was the story', explain: 'So＋補語が文頭→倒置〈be＋主語〉。', sentence: { en: 'So absurd was the story that no one believed it.', ja: 'その話はあまりにばかげていて誰も信じなかった。' } },
  { id: 'gr_1_inv_4', level: '1', topic: '倒置・強調', q: 'Such ___ his anger that he left at once.', choices: ['was', 'did', 'were', 'has'], answer: 'was', explain: 'Such＋be＋主語＋that …（あまりの〜に）。', sentence: { en: 'Such was his anger that he left at once.', ja: '彼の怒りはすさまじく、すぐに立ち去った。' } },
  { id: 'gr_1_subj_3', level: '1', topic: '仮定法・語法', q: 'He demanded that the rule ___ changed.', choices: ['be', 'is', 'was', 'will be'], answer: 'be', explain: 'demand など要求の that節は原形(should省略)。', sentence: { en: 'He demanded that the rule be changed.', ja: '彼は規則を変えるよう要求した。' } },
  { id: 'gr_1_lest_1', level: '1', topic: '高度語法', q: 'He spoke slowly lest he ___ misunderstood.', choices: ['be', 'is', 'was', 'will be'], answer: 'be', explain: 'lest S (should) 原形（〜しないように）。', sentence: { en: 'He spoke slowly lest he be misunderstood.', ja: '誤解されないように彼はゆっくり話した。' } },
  { id: 'gr_1_idiom_3', level: '1', topic: '高度語法', q: 'She is the last person ___ tell a lie.', choices: ['to', 'who', 'that', 'for'], answer: 'to', explain: 'the last＋名詞＋to do（最も〜しそうにない）。', sentence: { en: 'She is the last person to tell a lie.', ja: '彼女は決してうそをつくような人ではない。' } },

  // ═══════════ 教科書単元の網羅バッチ ═══════════
  // ── 付加疑問・感嘆文（中学）──
  { id: 'gr_4_tag_1', level: '4', topic: '付加疑問', q: 'You are from Canada, ___?', choices: ['aren’t you', 'are you', 'don’t you', 'isn’t it'], answer: 'aren’t you', explain: '肯定文の付加疑問は否定形＋主語。be動詞は aren’t you。', sentence: { en: 'You are from Canada, aren’t you?', ja: 'あなたはカナダ出身ですよね。' } },
  { id: 'gr_4_tag_2', level: '4', topic: '付加疑問', q: 'He plays the guitar, ___?', choices: ['doesn’t he', 'isn’t he', 'does he', 'doesn’t it'], answer: 'doesn’t he', explain: '一般動詞3単現の付加疑問は doesn’t he。', sentence: { en: 'He plays the guitar, doesn’t he?', ja: '彼はギターを弾きますよね。' } },
  { id: 'gr_3_tag_1', level: '3', topic: '付加疑問', q: 'Let’s take a break, ___?', choices: ['shall we', 'will you', 'don’t we', 'shall you'], answer: 'shall we', explain: 'Let’s 〜 の付加疑問は shall we?。', sentence: { en: 'Let’s take a break, shall we?', ja: '休憩しましょうか。' } },
  { id: 'gr_4_excl_1', level: '4', topic: '感嘆文', q: '___ a beautiful view this is!', choices: ['What', 'How', 'Such', 'Very'], answer: 'What', explain: 'What＋(a)＋形容詞＋名詞 ! の感嘆文。', sentence: { en: 'What a beautiful view this is!', ja: 'なんて美しい景色だろう！' } },
  { id: 'gr_4_excl_2', level: '4', topic: '感嘆文', q: '___ fast he runs!', choices: ['How', 'What', 'So', 'Very'], answer: 'How', explain: 'How＋形容詞/副詞＋S＋V ! の感嘆文。', sentence: { en: 'How fast he runs!', ja: 'なんて速く走るんだ！' } },

  // ── 原形不定詞・現在完了進行形・仮定法基礎（新課程 中3）──
  { id: 'gr_3_caus_1', level: '3', topic: '原形不定詞', q: 'My mother let me ___ out.', choices: ['go', 'to go', 'going', 'went'], answer: 'go', explain: 'let＋O＋原形（〜させてやる）。', sentence: { en: 'My mother let me go out.', ja: '母は私を外出させてくれた。' } },
  { id: 'gr_3_caus_2', level: '3', topic: '原形不定詞', q: 'This song makes me ___ happy.', choices: ['feel', 'to feel', 'feeling', 'felt'], answer: 'feel', explain: 'make＋O＋原形（Oに〜させる）。', sentence: { en: 'This song makes me feel happy.', ja: 'この歌は私を幸せな気持ちにさせる。' } },
  { id: 'gr_3_perfprog_1', level: '3', topic: '現在完了進行形', q: 'It has been ___ for three hours.', choices: ['snowing', 'snow', 'snowed', 'snows'], answer: 'snowing', explain: '現在完了進行形 have been＋ing（ずっと〜している）。', sentence: { en: 'It has been snowing for three hours.', ja: '3時間ずっと雪が降っている。' } },
  { id: 'gr_3_subj_1', level: '3', topic: '仮定法(基礎)', q: 'If I ___ a bird, I could fly.', choices: ['were', 'am', 'was', 'be'], answer: 'were', explain: '仮定法過去（現在の反実）。be は were。', sentence: { en: 'If I were a bird, I could fly.', ja: 'もし鳥だったら飛べるのに。' } },

  // ── 助動詞＋have done（高校）──
  { id: 'gr_2_modalp_1', level: '2', topic: '助動詞+have done', q: 'He ___ have missed the train.', choices: ['must', 'must to', 'is', 'does'], answer: 'must', explain: 'must have＋過分（〜したにちがいない）。', sentence: { en: 'He must have missed the train.', ja: '彼は電車に乗り遅れたにちがいない。' } },
  { id: 'gr_2_modalp_2', level: '2', topic: '助動詞+have done', q: 'You ___ have told me earlier.', choices: ['should', 'must', 'can', 'will'], answer: 'should', explain: 'should have＋過分（〜すべきだったのに）。', sentence: { en: 'You should have told me earlier.', ja: 'もっと早く言ってくれればよかったのに。' } },
  { id: 'gr_2_modalp_3', level: '2', topic: '助動詞+have done', q: 'She ___ have done it; she was away.', choices: ['cannot', 'must', 'should', 'may'], answer: 'cannot', explain: 'cannot have＋過分（〜したはずがない）。', sentence: { en: 'She cannot have done it; she was away.', ja: '彼女がやったはずがない、留守だったのだから。' } },
  { id: 'gr_2_modalp_4', level: '2', topic: '助動詞+have done', q: 'You ___ not have hurried; we had time.', choices: ['need', 'do', 'must', 'will'], answer: 'need', explain: 'need not have＋過分（〜する必要はなかったのに）。', sentence: { en: 'You need not have hurried; we had time.', ja: '急ぐ必要はなかったのに、時間はあった。' } },

  // ── used to / would（過去の習慣）・had better（高校）──
  { id: 'gr_4_used_1', level: '4', topic: 'used to', q: 'There ___ to be a tree here.', choices: ['used', 'use', 'uses', 'using'], answer: 'used', explain: 'used to＋原形（以前は〜だった/よく〜した）。', sentence: { en: 'There used to be a tree here.', ja: '昔ここには木があった。' } },
  { id: 'gr_pre2_would_1', level: 'pre2', topic: '過去の習慣', q: 'He ___ often swim in this river as a boy.', choices: ['would', 'used', 'did', 'was'], answer: 'would', explain: 'would often＋原形（よく〜したものだ）。', sentence: { en: 'He would often swim in this river as a boy.', ja: '彼は少年のころよくこの川で泳いだものだ。' } },
  { id: 'gr_pre2_better_1', level: 'pre2', topic: 'had better', q: 'You ___ better see a doctor.', choices: ['had', 'would', 'have', 'will'], answer: 'had', explain: 'had better＋原形（〜したほうがよい・強い忠告）。', sentence: { en: 'You had better see a doctor.', ja: '医者に診てもらったほうがいい。' } },

  // ── 話法（高校）──
  { id: 'gr_2_speech_1', level: '2', topic: '話法', q: 'He said that he ___ busy then.', choices: ['was', 'is', 'will be', 'has been'], answer: 'was', explain: '間接話法では時制の一致（is→was）。', sentence: { en: 'He said that he was busy then.', ja: '彼はそのとき忙しいと言った。' } },
  { id: 'gr_2_speech_2', level: '2', topic: '話法', q: 'She asked me ___ I was free.', choices: ['if', 'that', 'what', 'which'], answer: 'if', explain: 'Yes/No疑問の伝達は if/whether＋S＋V。', sentence: { en: 'She asked me if I was free.', ja: '彼女は私にひまかどうか尋ねた。' } },
  { id: 'gr_pre1_speech_1', level: 'pre1', topic: '話法', q: 'He told me ___ careful.', choices: ['to be', 'be', 'that be', 'being'], answer: 'to be', explain: '命令の伝達は tell＋O＋to do。', sentence: { en: 'He told me to be careful.', ja: '彼は私に気をつけるよう言った。' } },

  // ── 完了不定詞・be to構文・in order to（高校）──
  { id: 'gr_2_inf_3', level: '2', topic: '完了不定詞', q: 'He seems to ___ been ill.', choices: ['have', 'has', 'had', 'having'], answer: 'have', explain: 'seem to have＋過分（過去のことを今思う）。', sentence: { en: 'He seems to have been ill.', ja: '彼は病気だったようだ。' } },
  { id: 'gr_2_inf_4', level: '2', topic: '完了不定詞', q: 'I am sorry ___ have kept you waiting.', choices: ['to', 'for', 'that', 'of'], answer: 'to', explain: 'to have＋過分で本動詞より前を表す。', sentence: { en: 'I am sorry to have kept you waiting.', ja: 'お待たせして申し訳ありません。' } },
  { id: 'gr_2_beto_1', level: '2', topic: 'be to構文', q: 'You ___ to finish this by noon.', choices: ['are', 'will', 'have', 'must'], answer: 'are', explain: 'be to do（義務・予定など）。', sentence: { en: 'You are to finish this by noon.', ja: '正午までにこれを終えなさい。' } },
  { id: 'gr_pre1_beto_1', level: 'pre1', topic: 'be to構文', q: 'Not a sound ___ to be heard.', choices: ['was', 'is', 'did', 'were'], answer: 'was', explain: 'be to do の可能用法（否定文で〜できた）。', sentence: { en: 'Not a sound was to be heard.', ja: '物音ひとつ聞こえなかった。' } },
  { id: 'gr_pre2_inorder_1', level: 'pre2', topic: '目的の表現', q: 'He got up early ___ order to catch the train.', choices: ['in', 'for', 'so', 'to'], answer: 'in', explain: 'in order to＋原形（〜するために）。', sentence: { en: 'He got up early in order to catch the train.', ja: '彼は電車に間に合うよう早く起きた。' } },
  { id: 'gr_pre2_soas_1', level: 'pre2', topic: '目的の表現', q: 'Speak slowly ___ that everyone can understand.', choices: ['so', 'such', 'in', 'as'], answer: 'so', explain: 'so that S can 〜（〜できるように）。', sentence: { en: 'Speak slowly so that everyone can understand.', ja: 'みなが理解できるようにゆっくり話して。' } },

  // ── 接続詞（高校）──
  { id: 'gr_pre2_unless_1', level: 'pre2', topic: '接続詞', q: '___ you hurry, you’ll miss the bus.', choices: ['Unless', 'If', 'Though', 'While'], answer: 'Unless', explain: 'unless＝if … not（〜しない限り）。', sentence: { en: 'Unless you hurry, you’ll miss the bus.', ja: '急がないとバスに乗り遅れるよ。' } },
  { id: 'gr_pre2_aslong_1', level: 'pre2', topic: '接続詞', q: 'You may stay ___ long as you like.', choices: ['as', 'so', 'too', 'very'], answer: 'as', explain: 'as long as（〜する限り・条件）。', sentence: { en: 'You may stay as long as you like.', ja: '好きなだけいていいよ。' } },
  { id: 'gr_2_incase_1', level: '2', topic: '接続詞', q: 'Take an umbrella ___ it rains.', choices: ['in case', 'even if', 'as if', 'so that'], answer: 'in case', explain: 'in case＋S＋V（〜する場合に備えて）。', sentence: { en: 'Take an umbrella in case it rains.', ja: '雨が降るといけないから傘を持って行きなさい。' } },
  { id: 'gr_2_nowthat_1', level: '2', topic: '接続詞', q: '___ that you are here, let’s begin.', choices: ['Now', 'So', 'Such', 'Even'], answer: 'Now', explain: 'now that＋S＋V（今や〜だから）。', sentence: { en: 'Now that you are here, let’s begin.', ja: 'もう来たのだから始めよう。' } },
  { id: 'gr_2_asfar_1', level: '2', topic: '接続詞', q: '___ far as I know, he is honest.', choices: ['As', 'So', 'By', 'In'], answer: 'As', explain: 'as far as I know（私の知る限り・範囲）。', sentence: { en: 'As far as I know, he is honest.', ja: '私の知る限り彼は正直だ。' } },

  // ── 形式目的語・動名詞慣用（高校）──
  { id: 'gr_2_it_1', level: '2', topic: '形式目的語', q: 'I found ___ hard to believe.', choices: ['it', 'that', 'this', 'what'], answer: 'it', explain: 'find/think＋it＋C＋to do（形式目的語 it）。', sentence: { en: 'I found it hard to believe.', ja: '私はそれを信じがたいと思った。' } },
  { id: 'gr_2_it_2', level: '2', topic: '形式目的語', q: 'I make ___ a rule to walk every day.', choices: ['it', 'that', 'this', 'me'], answer: 'it', explain: 'make it a rule to do（〜することにしている）。', sentence: { en: 'I make it a rule to walk every day.', ja: '私は毎日歩くことにしている。' } },
  { id: 'gr_pre2_ger_5', level: 'pre2', topic: '動名詞の慣用', q: 'I am used to ___ early.', choices: ['getting up', 'get up', 'got up', 'to get up'], answer: 'getting up', explain: 'be used to doing（〜に慣れている）。to は前置詞。', sentence: { en: 'I am used to getting up early.', ja: '私は早起きに慣れている。' } },
  { id: 'gr_2_ger_3', level: '2', topic: '動名詞の慣用', q: 'I cannot help ___ at the joke.', choices: ['laughing', 'laugh', 'to laugh', 'laughed'], answer: 'laughing', explain: 'cannot help doing（〜せずにはいられない）。', sentence: { en: 'I cannot help laughing at the joke.', ja: 'その冗談に笑わずにはいられない。' } },
  { id: 'gr_2_ger_4', level: '2', topic: '動名詞の慣用', q: 'It is no use ___ over spilt milk.', choices: ['crying', 'cry', 'to cry', 'cried'], answer: 'crying', explain: 'It is no use doing（〜してもむだだ）。', sentence: { en: 'It is no use crying over spilt milk.', ja: '覆水盆に返らず。' } },
  { id: 'gr_pre2_ger_6', level: 'pre2', topic: '動名詞の慣用', q: 'I feel like ___ tonight.', choices: ['cooking', 'cook', 'to cook', 'cooked'], answer: 'cooking', explain: 'feel like doing（〜したい気がする）。', sentence: { en: 'I feel like cooking tonight.', ja: '今夜は料理がしたい気分だ。' } },

  // ── 数量・代名詞語法（中高）──
  { id: 'gr_pre2_quant_1', level: 'pre2', topic: '数量表現', q: 'He has ___ money, so he can’t buy it.', choices: ['little', 'a little', 'few', 'a few'], answer: 'little', explain: '数えられない名詞＋little は「ほとんどない」（否定的）。', sentence: { en: 'He has little money, so he can’t buy it.', ja: '彼はお金がほとんどないので買えない。' } },
  { id: 'gr_pre2_quant_2', level: 'pre2', topic: '数量表現', q: 'I have ___ friends, so I’m not lonely.', choices: ['a few', 'few', 'a little', 'little'], answer: 'a few', explain: '数えられる名詞＋a few は「少しはある」（肯定的）。', sentence: { en: 'I have a few friends, so I’m not lonely.', ja: '友達が少しはいるのでさびしくない。' } },
  { id: 'gr_4_pron_2', level: '4', topic: '代名詞', q: 'I lost my pen, so I bought a new ___.', choices: ['one', 'it', 'that', 'this'], answer: 'one', explain: '前出の名詞と同種の不特定物は one。', sentence: { en: 'I lost my pen, so I bought a new one.', ja: 'ペンをなくしたので新しいのを買った。' } },
  { id: 'gr_pre2_pron_3', level: 'pre2', topic: '代名詞', q: 'I have two cats; one is white and ___ is black.', choices: ['the other', 'another', 'other', 'others'], answer: 'the other', explain: '2つのうち「もう一方」は the other。', sentence: { en: 'I have two cats; one is white and the other is black.', ja: '猫が2匹いて、1匹は白、もう1匹は黒だ。' } },
  { id: 'gr_pre2_pron_4', level: 'pre2', topic: '代名詞', q: 'They helped ___ other.', choices: ['each', 'every', 'one', 'both'], answer: 'each', explain: 'each other（お互いに）。', sentence: { en: 'They helped each other.', ja: '彼らは互いに助け合った。' } },

  // ── 前置詞 by/until・時制（高校）──
  { id: 'gr_3_prep_2', level: '3', topic: '前置詞', q: 'Finish your report ___ Friday.', choices: ['by', 'until', 'till', 'in'], answer: 'by', explain: '期限「〜までに(完了)」は by。継続は until。', sentence: { en: 'Finish your report by Friday.', ja: '金曜までにレポートを仕上げなさい。' } },
  { id: 'gr_pre2_prep_3', level: 'pre2', topic: '前置詞', q: 'Please wait ___ I come back.', choices: ['until', 'by', 'for', 'in'], answer: 'until', explain: '継続「〜まで(ずっと)」は until/till。', sentence: { en: 'Please wait until I come back.', ja: '私が戻るまで待っていて。' } },
  { id: 'gr_2_tense_1', level: '2', topic: '過去完了進行形', q: 'She had been ___ for an hour when I arrived.', choices: ['waiting', 'wait', 'waited', 'waits'], answer: 'waiting', explain: '過去完了進行形 had been＋ing（過去のある時まで継続）。', sentence: { en: 'She had been waiting for an hour when I arrived.', ja: '私が着いたとき彼女は1時間待っていた。' } },

  // ── 比較の重要構文・連鎖関係詞（高校〜）──
  { id: 'gr_3_comp_4', level: '3', topic: '比較応用', q: 'Come back as soon as ___.', choices: ['possible', 'can', 'you', 'soon'], answer: 'possible', explain: 'as 〜 as possible（できるだけ〜）。', sentence: { en: 'Come back as soon as possible.', ja: 'できるだけ早く戻ってきて。' } },
  { id: 'gr_2_comp_2', level: '2', topic: '比較応用', q: 'No other student is ___ tall as Tom.', choices: ['as', 'so', 'more', 'than'], answer: 'as', explain: 'No other 〜 as … as A（最上級相当）。', sentence: { en: 'No other student is as tall as Tom.', ja: 'トムほど背の高い生徒は他にいない。' } },
  { id: 'gr_pre1_whale_1', level: 'pre1', topic: 'クジラ構文', q: 'A whale is no ___ a fish than a horse is.', choices: ['more', 'less', 'better', 'fewer'], answer: 'more', explain: 'A is no more B than C is（AがBでないのはCと同じ＝クジラ構文）。', sentence: { en: 'A whale is no more a fish than a horse is.', ja: 'クジラが魚でないのは馬が魚でないのと同じだ。' } },
  { id: 'gr_1_comp_2', level: '1', topic: '高度語法', q: 'I have no ___ than a thousand yen.', choices: ['more', 'less', 'fewer', 'better'], answer: 'more', explain: 'no more than＝only（たった〜）。', sentence: { en: 'I have no more than a thousand yen.', ja: '私はたった千円しか持っていない。' } },
  { id: 'gr_pre1_rel_2', level: 'pre1', topic: '連鎖関係詞', q: 'The man ___ I thought was honest lied.', choices: ['who', 'whom', 'whose', 'which'], answer: 'who', explain: '連鎖関係代名詞：I thought を挟むが主格 who。', sentence: { en: 'The man who I thought was honest lied.', ja: '正直だと思っていた男がうそをついた。' } },

  // ═══════════ 単元の厚みづけ・難級拡張バッチ ═══════════
  // ── 5級 ──
  { id: 'gr_5_be_x1', level: '5', topic: 'be動詞', q: 'This ___ not my bag.', choices: ['is', 'are', 'am', 'do'], answer: 'is', explain: 'be動詞の否定は be動詞＋not。単数は is。', sentence: { en: 'This is not my bag.', ja: 'これは私のかばんではない。' } },
  { id: 'gr_5_verb_x1', level: '5', topic: '否定文・疑問文', q: 'He ___ not like fish.', choices: ['does', 'do', 'is', 'are'], answer: 'does', explain: '3単現の否定は does not＋原形。', sentence: { en: 'He does not like fish.', ja: '彼は魚が好きではない。' } },
  { id: 'gr_5_pl_x1', level: '5', topic: '名詞の複数形', q: 'I have two ___.', choices: ['knives', 'knifes', 'knife', 'knifies'], answer: 'knives', explain: 'fで終わる語の複数は ves（knife→knives）。', sentence: { en: 'I have two knives.', ja: '私はナイフを2本持っている。' } },
  { id: 'gr_5_pron_x1', level: '5', topic: '代名詞', q: 'Whose pen is this? — It’s ___.', choices: ['hers', 'her', 'she', 'his’'], answer: 'hers', explain: '「彼女のもの」は所有代名詞 hers。', sentence: { en: 'It’s hers.', ja: 'それは彼女のものです。' } },
  { id: 'gr_5_wh_x1', level: '5', topic: '疑問詞', q: '___ do you like, tea or coffee?', choices: ['Which', 'What', 'Who', 'Where'], answer: 'Which', explain: '限られた中から選ぶときは Which。', sentence: { en: 'Which do you like, tea or coffee?', ja: '紅茶とコーヒー、どちらが好きですか。' } },
  { id: 'gr_5_can_x1', level: '5', topic: '助動詞 can', q: 'I ___ swim at all.', choices: ['cannot', 'don’t', 'am not', 'isn’t'], answer: 'cannot', explain: 'can の否定は cannot（can’t）。', sentence: { en: 'I cannot swim at all.', ja: '私は全く泳げない。' } },
  { id: 'gr_5_prep_x1', level: '5', topic: '前置詞', q: 'Cut the cake ___ a knife.', choices: ['with', 'by', 'in', 'of'], answer: 'with', explain: '道具「〜を使って」は with。', sentence: { en: 'Cut the cake with a knife.', ja: 'ナイフでケーキを切って。' } },
  { id: 'gr_5_prog_x1', level: '5', topic: '現在進行形', q: 'Is he ___ now?', choices: ['sleeping', 'sleep', 'sleeps', 'slept'], answer: 'sleeping', explain: '進行形の疑問文も be動詞＋ing。', sentence: { en: 'Is he sleeping now?', ja: '彼は今眠っていますか。' } },

  // ── 4級 ──
  { id: 'gr_4_past_x1', level: '4', topic: '過去形', q: 'I ___ not go to school yesterday.', choices: ['did', 'was', 'do', 'were'], answer: 'did', explain: '一般動詞の過去否定は did not＋原形。', sentence: { en: 'I did not go to school yesterday.', ja: '私は昨日学校へ行かなかった。' } },
  { id: 'gr_4_fut_x1', level: '4', topic: '未来表現', q: 'Are you ___ to play soccer?', choices: ['going', 'go', 'will', 'goes'], answer: 'going', explain: 'be going to の疑問文は be＋主語＋going to。', sentence: { en: 'Are you going to play soccer?', ja: 'サッカーをするつもりですか。' } },
  { id: 'gr_4_comp_x1', level: '4', topic: '比較', q: 'He is the tallest ___ his class.', choices: ['in', 'of', 'at', 'on'], answer: 'in', explain: '最上級の範囲：集団・場所は in、複数名詞は of。', sentence: { en: 'He is the tallest in his class.', ja: '彼はクラスで一番背が高い。' } },
  { id: 'gr_4_comp_x2', level: '4', topic: '比較', q: 'I like cats ___ than dogs.', choices: ['better', 'well', 'good', 'more'], answer: 'better', explain: 'like A better than B（BよりAが好き）。', sentence: { en: 'I like cats better than dogs.', ja: '私は犬より猫が好きだ。' } },
  { id: 'gr_4_modal_x1', level: '4', topic: '助動詞', q: 'You ___ see a doctor.', choices: ['should', 'are', 'do', 'must to'], answer: 'should', explain: 'should＋原形（〜したほうがよい・すべきだ）。', sentence: { en: 'You should see a doctor.', ja: '医者に診てもらうべきだ。' } },
  { id: 'gr_4_ger_x1', level: '4', topic: '動名詞', q: 'I finished ___ the book.', choices: ['reading', 'to read', 'read', 'reads'], answer: 'reading', explain: 'finish のあとは動名詞(ing)。', sentence: { en: 'I finished reading the book.', ja: '私はその本を読み終えた。' } },
  { id: 'gr_4_conj_x1', level: '4', topic: '接続詞', q: 'I was cooking ___ he came home.', choices: ['when', 'that', 'so', 'or'], answer: 'when', explain: 'when は「〜したとき」を表す。', sentence: { en: 'I was cooking when he came home.', ja: '彼が帰宅したとき私は料理していた。' } },
  { id: 'gr_4_wht_x1', level: '4', topic: '疑問詞+不定詞', q: 'I don’t know what ___ do.', choices: ['to', 'doing', 'for', 'will'], answer: 'to', explain: 'what to do（何をすべきか）。', sentence: { en: 'I don’t know what to do.', ja: '何をすべきかわからない。' } },

  // ── 3級 ──
  { id: 'gr_3_perf_x1', level: '3', topic: '現在完了', q: 'I have read this book ___.', choices: ['twice', 'since', 'yet', 'ago'], answer: 'twice', explain: '回数 twice などは経験用法でよく使う。', sentence: { en: 'I have read this book twice.', ja: '私はこの本を2回読んだことがある。' } },
  { id: 'gr_3_pass_x1', level: '3', topic: '受動態', q: 'Stars can ___ seen at night.', choices: ['be', 'is', 'being', 'been'], answer: 'be', explain: '助動詞＋be＋過去分詞（〜されうる）。', sentence: { en: 'Stars can be seen at night.', ja: '星は夜に見える。' } },
  { id: 'gr_3_pass_x2', level: '3', topic: '受動態', q: 'America was discovered ___ Columbus.', choices: ['by', 'with', 'of', 'from'], answer: 'by', explain: '受動態の行為者は by＋人。', sentence: { en: 'America was discovered by Columbus.', ja: 'アメリカはコロンブスによって発見された。' } },
  { id: 'gr_3_rel_x1', level: '3', topic: '関係代名詞', q: 'I took a train ___ goes to Tokyo.', choices: ['which', 'who', 'whose', 'where'], answer: 'which', explain: '先行詞が物で主格なら which（that も可）。', sentence: { en: 'I took a train which goes to Tokyo.', ja: '私は東京行きの電車に乗った。' } },
  { id: 'gr_3_part_x1', level: '3', topic: '分詞', q: 'English is a language ___ in many countries.', choices: ['spoken', 'speaking', 'speak', 'spoke'], answer: 'spoken', explain: '過去分詞の後置修飾（〜される言語）。', sentence: { en: 'English is a language spoken in many countries.', ja: '英語は多くの国で話されている言語だ。' } },
  { id: 'gr_3_svoo_x1', level: '3', topic: '文型(SVOO/SVOC)', q: 'He showed ___ the picture.', choices: ['me', 'to me', 'for me', 'my'], answer: 'me', explain: 'show＋人＋物（SVOO）。to は不要。', sentence: { en: 'He showed me the picture.', ja: '彼は私にその写真を見せた。' } },
  { id: 'gr_3_indq_x1', level: '3', topic: '間接疑問', q: 'I asked her how old ___.', choices: ['she was', 'was she', 'is she', 'she is'], answer: 'she was', explain: '間接疑問は〈疑問詞＋主語＋動詞〉＋時制の一致。', sentence: { en: 'I asked her how old she was.', ja: '私は彼女に何歳か尋ねた。' } },
  { id: 'gr_3_conj_x1', level: '3', topic: '接続詞', q: '___ it was cold, we went out.', choices: ['Although', 'Because', 'So', 'If'], answer: 'Although', explain: 'although は「〜だけれども」（譲歩）。', sentence: { en: 'Although it was cold, we went out.', ja: '寒かったが私たちは外出した。' } },

  // ── 準2級 ──
  { id: 'gr_pre2_pc_x1', level: 'pre2', topic: '分詞構文', q: '___ home, he took a hot bath.', choices: ['Arriving', 'Arrived', 'Arrive', 'To arrive'], answer: 'Arriving', explain: '分詞構文 -ing（〜して/すると）。', sentence: { en: 'Arriving home, he took a hot bath.', ja: '帰宅すると彼は熱い風呂に入った。' } },
  { id: 'gr_pre2_radv_x1', level: 'pre2', topic: '関係副詞', q: 'This is ___ he solved the problem.', choices: ['how', 'the way how', 'which', 'who'], answer: 'how', explain: '方法の関係副詞は how（the way how は不可）。', sentence: { en: 'This is how he solved the problem.', ja: 'こうやって彼は問題を解いた。' } },
  { id: 'gr_pre2_subj_x1', level: 'pre2', topic: '仮定法(基礎)', q: 'If I had wings, I ___ fly to you.', choices: ['could', 'can', 'will', 'am'], answer: 'could', explain: '仮定法過去の帰結は would/could＋原形。', sentence: { en: 'If I had wings, I could fly to you.', ja: '翼があれば君のところへ飛んでいけるのに。' } },
  { id: 'gr_pre2_caus_x1', level: 'pre2', topic: '使役・知覚', q: 'I must get this report ___ by five.', choices: ['done', 'do', 'doing', 'to do'], answer: 'done', explain: 'get＋O＋過去分詞（〜してしまう/される）。', sentence: { en: 'I must get this report done by five.', ja: '5時までにこの報告書を仕上げねばならない。' } },
  { id: 'gr_pre2_perc_x1', level: 'pre2', topic: '使役・知覚', q: 'I watched them ___ baseball.', choices: ['play', 'to play', 'played', 'plays'], answer: 'play', explain: '知覚動詞 watch＋O＋原形（最後まで見る）。', sentence: { en: 'I watched them play baseball.', ja: '私は彼らが野球をするのを見た。' } },
  { id: 'gr_pre2_pp_x1', level: 'pre2', topic: '過去完了', q: 'I had never ___ such a beautiful sight.', choices: ['seen', 'saw', 'see', 'seeing'], answer: 'seen', explain: '過去完了 had＋過分（過去のある時までの経験）。', sentence: { en: 'I had never seen such a beautiful sight.', ja: 'そんな美しい光景は見たことがなかった。' } },
  { id: 'gr_pre2_comp_x1', level: 'pre2', topic: '比較応用', q: 'This room is three times ___ large as mine.', choices: ['as', 'than', 'so', 'more'], answer: 'as', explain: '倍数＋as＋原級＋as（〜の…倍）。', sentence: { en: 'This room is three times as large as mine.', ja: 'この部屋は私の部屋の3倍の広さだ。' } },
  { id: 'gr_pre2_emph_x1', level: 'pre2', topic: '再帰代名詞', q: 'She painted the wall ___.', choices: ['herself', 'her', 'hers', 'she'], answer: 'herself', explain: '「自分で」を強める再帰代名詞 herself。', sentence: { en: 'She painted the wall herself.', ja: '彼女は自分で壁を塗った。' } },

  // ── 2級 ──
  { id: 'gr_2_subj_x1', level: '2', topic: '仮定法', q: 'If I had studied harder, I ___ be a doctor now.', choices: ['would', 'will', 'can', 'am'], answer: 'would', explain: '混合仮定法：過去の条件＋現在の帰結 would＋原形。', sentence: { en: 'If I had studied harder, I would be a doctor now.', ja: 'もっと勉強していたら今頃医者なのに。' } },
  { id: 'gr_2_subj_x2', level: '2', topic: '仮定法', q: 'If you ___ change your mind, let me know.', choices: ['should', 'will', 'would', 'are'], answer: 'should', explain: 'if S should do（万一〜なら）。可能性の低い条件。', sentence: { en: 'If you should change your mind, let me know.', ja: '万一気が変わったら知らせて。' } },
  { id: 'gr_2_inv_x1', level: '2', topic: '倒置', q: 'Only then ___ I understand the truth.', choices: ['did', 'do', 'have', 'was'], answer: 'did', explain: 'Only＋副詞が文頭→倒置〈did＋S＋原形〉。', sentence: { en: 'Only then did I understand the truth.', ja: 'そのとき初めて真実がわかった。' } },
  { id: 'gr_2_emph_x1', level: '2', topic: '強調構文', q: '___ was it that broke the vase?', choices: ['Who', 'Whom', 'Which', 'How'], answer: 'Who', explain: '疑問詞の強調構文：疑問詞＋is/was it that 〜?。', sentence: { en: 'Who was it that broke the vase?', ja: '花びんを割ったのは誰だったのか。' } },
  { id: 'gr_2_noun_x1', level: '2', topic: '名詞節', q: '___ he is honest is certain.', choices: ['That', 'What', 'Which', 'If'], answer: 'That', explain: 'That節が主語（〜ということ）。', sentence: { en: 'That he is honest is certain.', ja: '彼が正直だということは確かだ。' } },
  { id: 'gr_2_rel_x1', level: '2', topic: '関係代名詞 what', q: 'Reading is to the mind ___ food is to the body.', choices: ['what', 'that', 'which', 'as'], answer: 'what', explain: 'A is to B what C is to D（AのBに対する関係はCのDに対する関係と同じ）。', sentence: { en: 'Reading is to the mind what food is to the body.', ja: '読書の精神に対する関係は食物の体に対する関係に等しい。' } },
  { id: 'gr_2_comp_x1', level: '2', topic: '比較応用', q: 'He is the ___ of the two.', choices: ['taller', 'tallest', 'tall', 'more tall'], answer: 'taller', explain: '2者の比較で「より〜なほう」は the＋比較級。', sentence: { en: 'He is the taller of the two.', ja: '彼は2人のうち背が高いほうだ。' } },
  { id: 'gr_2_conj_x1', level: '2', topic: '接続詞', q: '___ he was tired, he kept working.', choices: ['Even though', 'Even if', 'As if', 'In case'], answer: 'Even though', explain: 'even though＝実際に〜だけれども（事実の譲歩）。', sentence: { en: 'Even though he was tired, he kept working.', ja: '疲れていたけれど彼は働き続けた。' } },

  // ── 準1級 ──
  { id: 'gr_pre1_inv_x1', level: 'pre1', topic: '倒置', q: 'Seldom ___ he late for school.', choices: ['is', 'he is', 'does', 'did'], answer: 'is', explain: '頻度の否定語 Seldom が文頭→倒置〈be＋主語〉。', sentence: { en: 'Seldom is he late for school.', ja: '彼が学校に遅れることはめったにない。' } },
  { id: 'gr_pre1_subj_x1', level: 'pre1', topic: '仮定法応用', q: 'But for air, no living thing ___ survive.', choices: ['could', 'can', 'will', 'is'], answer: 'could', explain: 'But for 〜（〜がなければ）＝仮定法。帰結は could/would。', sentence: { en: 'But for air, no living thing could survive.', ja: '空気がなければ生物は生きられないだろう。' } },
  { id: 'gr_pre1_comp_x1', level: 'pre1', topic: '複合関係詞', q: '___ you go, I will follow you.', choices: ['Wherever', 'However', 'Whatever', 'Whenever'], answer: 'Wherever', explain: '複合関係副詞 wherever（どこへ〜しようとも）。', sentence: { en: 'Wherever you go, I will follow you.', ja: 'あなたがどこへ行こうとついて行く。' } },
  { id: 'gr_pre1_comp_x2', level: 'pre1', topic: '複合関係詞', q: '___ comes will be welcome.', choices: ['Whoever', 'Whomever', 'Whatever', 'However'], answer: 'Whoever', explain: 'whoever は「〜する人は誰でも」（主格）。', sentence: { en: 'Whoever comes will be welcome.', ja: '来る人は誰でも歓迎する。' } },
  { id: 'gr_pre1_app_x1', level: 'pre1', topic: '同格', q: 'There is no doubt ___ he is guilty.', choices: ['that', 'which', 'what', 'if'], answer: 'that', explain: '同格の that（〜という疑い/事実）。後ろは完全文。', sentence: { en: 'There is no doubt that he is guilty.', ja: '彼が有罪なのは疑いない。' } },
  { id: 'gr_pre1_with_x1', level: 'pre1', topic: '付帯状況', q: 'He sat there ___ his eyes closed.', choices: ['with', 'by', 'on', 'of'], answer: 'with', explain: 'with＋O＋分詞/形容詞（〜したまま・付帯状況）。', sentence: { en: 'He sat there with his eyes closed.', ja: '彼は目を閉じたまま座っていた。' } },
  { id: 'gr_pre1_ellip_x1', level: 'pre1', topic: '省略', q: 'Call me if ___.', choices: ['necessary', 'it necessary', 'is necessary', 'to be'], answer: 'necessary', explain: '副詞節中の〈S＋be〉は省略可（if (it is) necessary）。', sentence: { en: 'Call me if necessary.', ja: '必要なら電話して。' } },
  { id: 'gr_pre1_emph_x1', level: 'pre1', topic: '強調', q: 'It was not until noon ___ he woke up.', choices: ['that', 'when', 'which', 'then'], answer: 'that', explain: 'It is not until 〜 that …（〜して初めて…）。', sentence: { en: 'It was not until noon that he woke up.', ja: '正午になって初めて彼は目を覚ました。' } },

  // ── 1級 ──
  { id: 'gr_1_emph_x1', level: '1', topic: '強調・倒置', q: 'That is the ___ thing I wanted.', choices: ['very', 'much', 'more', 'most'], answer: 'very', explain: 'the very＋名詞（まさにその〜）と強調。', sentence: { en: 'That is the very thing I wanted.', ja: 'それこそまさに私が欲しかったものだ。' } },
  { id: 'gr_1_comp_x1', level: '1', topic: '高度比較', q: 'He is not so much a scholar ___ a poet.', choices: ['as', 'than', 'but', 'like'], answer: 'as', explain: 'not so much A as B（AというよりむしろB）。', sentence: { en: 'He is not so much a scholar as a poet.', ja: '彼は学者というよりむしろ詩人だ。' } },
  { id: 'gr_1_idiom_x1', level: '1', topic: '高度語法', q: 'He is, ___ it were, a walking dictionary.', choices: ['as', 'so', 'like', 'that'], answer: 'as', explain: 'as it were（いわば）。慣用的な仮定法。', sentence: { en: 'He is, as it were, a walking dictionary.', ja: '彼はいわば歩く辞書だ。' } },
  { id: 'gr_1_subj_x1', level: '1', topic: '仮定法・語法', q: '___ it not been for your advice, I would have failed.', choices: ['Had', 'Were', 'If', 'Have'], answer: 'Had', explain: 'Had it not been for 〜（〜がなかったら）＝if省略倒置(過去完了)。', sentence: { en: 'Had it not been for your advice, I would have failed.', ja: 'あなたの助言がなければ失敗していただろう。' } },
  { id: 'gr_1_conj_x1', level: '1', topic: '高度語法', q: 'You may go out ___ that you come home by ten.', choices: ['provided', 'supposing', 'unless', 'lest'], answer: 'provided', explain: 'provided (that)（〜という条件で）。', sentence: { en: 'You may go out provided that you come home by ten.', ja: '10時までに帰るなら出かけてよい。' } },
  { id: 'gr_1_idiom_x2', level: '1', topic: '高度語法', q: 'You cannot be ___ careful when you drive.', choices: ['too', 'very', 'so', 'much'], answer: 'too', explain: 'cannot be too 〜（いくら〜してもしすぎることはない）。', sentence: { en: 'You cannot be too careful when you drive.', ja: '運転はいくら注意してもしすぎることはない。' } },
  { id: 'gr_1_idiom_x3', level: '1', topic: '高度語法', q: 'It goes ___ saying that health is important.', choices: ['without', 'with', 'by', 'for'], answer: 'without', explain: 'It goes without saying that 〜（〜は言うまでもない）。', sentence: { en: 'It goes without saying that health is important.', ja: '健康が大切なのは言うまでもない。' } },
  { id: 'gr_1_opt_x1', level: '1', topic: '祈願文', q: 'Long ___ the king!', choices: ['live', 'lives', 'lived', 'living'], answer: 'live', explain: '祈願文は動詞の原形（May ... の may 省略）。', sentence: { en: 'Long live the king!', ja: '国王万歳！' } },

  ...GRAMMAR_EXPANSION,
  ...GENERATED_GRAMMAR,
  ...GRAMMAR_EXAM_PATTERNS,
].map(withVariationGroup)

export const grammarByLevel = (level) => GRAMMAR.filter((g) => g.level === level)
export const grammarByTopic = (level, topic) => GRAMMAR.filter((g) => g.level === level && g.topic === topic)
export const topicsForLevel = (level) => [...new Set(grammarByLevel(level).map((g) => g.topic))]

// 既存3,450問は教材・説明監査の母数として維持し、形式拡充105問を
// 実際の文法テスト在庫へ加える。既存IDのSRS履歴と各種固定件数を壊さない。
export const GRAMMAR_PRACTICE = Object.freeze([...GRAMMAR, ...GRAMMAR_FORMAT_EXPANSION])
export const grammarPracticeByLevel = (level, questionType = 'mixed') =>
  GRAMMAR_PRACTICE.filter((item) =>
    item.level === level
    && (questionType === 'mixed' || grammarQuestionType(item) === questionType))
export const grammarPracticeByTopic = (level, topic, questionType = 'mixed') =>
  grammarPracticeByLevel(level, questionType).filter((item) => item.topic === topic)
export const grammarPracticeTopicsForLevel = (level, questionType = 'mixed') => [
  ...new Set(grammarPracticeByLevel(level, questionType).map((item) => item.topic)),
]
export const getGrammar = (id) => GRAMMAR_PRACTICE.find((g) => g.id === id)
export const grammarPatternGroup = (item) =>
  item?.variationGroup ?? item?.pattern ?? null

const grammarChoiceGuidance = createGrammarChoiceGuidance(
  GRAMMAR_PRACTICE.filter((item) => grammarQuestionType(item) !== 'word-order'),
)

// 各選択肢がこの問題の条件に合わない理由と、その形が成立する条件を全問で補う。
export const grammarChoiceGuidanceFor = (item, choice) =>
  grammarChoiceGuidance(item, choice)

// 正答を含む4択すべての「その形をどう使うか」を返す。
// 既存の誤答APIは後方互換のため正答に null を返す契約を維持する。
export const grammarChoiceUsageFor = (item, choice) => {
  if (!item || choice == null) return null
  const guidance = choice === item.answer
    ? grammarChoiceGuidance({ ...item, answer: '__correct_choice__' }, choice)
    : grammarChoiceGuidance(item, choice)
  if (choice === item.answer && (!guidance || guidance.status === 'unresolved')) {
    return {
      status: 'valid',
      summary: `${item.explain} この問題では「${choice}」を入れた「${item.sentence.en}」が、その規則を満たす完成文です。`,
      pattern: item.sentence.en,
      source: 'correct-answer-rule',
    }
  }
  return guidance
}

// 解説欄に出す「同じ形の例」。同じ級・単元の検証済み完成文から、現在の問題を除いて返す。
export const samePatternExamplesFor = (item, limit = 2) => {
  if (!item || limit <= 0) return []
  const patternGroup = grammarPatternGroup(item)
  const patternMatches = patternGroup
    ? GRAMMAR_PRACTICE.filter((candidate) =>
        candidate.level === item.level
        && candidate.topic === item.topic
        && grammarPatternGroup(candidate) === patternGroup)
    : []
  const candidates = patternMatches.length > limit
    ? patternMatches
    : grammarPracticeByTopic(item.level, item.topic)
  return candidates
    .filter((candidate) => candidate.id !== item.id)
    .slice(0, limit)
    .map((candidate) => ({
      id: candidate.id,
      en: candidate.sentence.en,
      ja: candidate.sentence.ja,
    }))
}

// 手薄だった単元（命令文・指示語・付加疑問など）を厚くした収録目標。
export const GRAMMAR_LEVEL_TARGETS = Object.freeze({
  5: 489,
  4: 469,
  3: 499,
  pre2: 519,
  2: 538,
  pre1: 488,
  1: 448,
})

// 単元別テストと「同じ形の例」2文を成立させるため、各級・各単元に最低3問置く。
export const GRAMMAR_TOPIC_MINIMUM = 3
export const GRAMMAR_TOTAL_TARGET = 3450
