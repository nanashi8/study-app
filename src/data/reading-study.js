import { getPhrase } from './phrases.js'
import { resolvePassageWord } from './passage-gloss.js'
import { PASSAGE_DICTIONARY_WORD_IDS } from './reading-words.js'
import { getWord } from './vocab.js'

// 本文固有の表現。kind は既存の熟語カードエンジンと共通で、
// category は読解準備画面で「熟語／表現」を表示し分けるために使う。
const expression = (id, level, phrase, meaning, en, ja, note, kind = 'idiom') => ({
  id: `rdx_${id}`,
  kind,
  category: 'expression',
  level,
  phrase,
  meaning,
  meanings: [meaning],
  example: { en, ja },
  origin: note,
  note,
})

export const READING_STUDY = {
  p_5_lost_notebook: {
    phraseIds: [],
    expressions: [
      expression(
        'p5_go_to_school',
        '5',
        'go to school',
        '学校へ行く・通学する',
        'She goes to school by bus every morning.',
        '彼女は毎朝バスで学校へ行きます。',
        'go to ＋ 場所で「その場所へ行く」。school の前には通常 the を付けない。',
      ),
      expression(
        'p5_by_bus',
        '5',
        'by bus',
        'バスで',
        'She goes to school by bus every morning.',
        '彼女は毎朝バスで学校へ行きます。',
        'by ＋ 交通手段で「〜で」。bus の前に a や the は付けない。',
      ),
      expression(
        'p5_every_morning',
        '5',
        'every morning',
        '毎朝',
        'She goes to school by bus every morning.',
        '彼女は毎朝バスで学校へ行きます。',
        'every ＋ 時を表す名詞で、繰り返す習慣を表す。',
      ),
      expression(
        'p5_after_lunch',
        '5',
        'after lunch',
        '昼食後に',
        'After lunch, Rina cannot find her blue notebook.',
        '昼食後、リナは青いノートを見つけられません。',
        'after ＋ 名詞で「〜の後に」。文頭に置くと、その後の出来事の時を示す。',
      ),
      expression(
        'p5_say_thank_you',
        '5',
        'say thank you',
        'ありがとうと言う',
        'Rina says thank you and writes a short story in it.',
        'リナはお礼を言い、そのノートに短い物語を書きます。',
        'say の後ろに、実際に口にする言葉 thank you を置く。',
      ),
    ],
  },

  p_4_library_event: {
    phraseIds: ['idm_listen_to'],
    expressions: [
      expression(
        'p4_first_day_every_month',
        '4',
        'on the first ... of every month',
        '毎月最初の〜に',
        'The event is on the first Saturday of every month.',
        'イベントは毎月第一土曜日にあります。',
        'on ＋ 曜日、the first ＋ 曜日、of every month の順で日程を表す。',
      ),
      expression(
        'p4_talk_about',
        '4',
        'talk about',
        '〜について話す',
        'She will talk about the old station.',
        '彼女は古い駅について話します。',
        'talk「話す」＋ about「〜について」。話題を about の後ろに置く。',
      ),
      expression(
        'p4_do_not_have_to',
        '4',
        'do not have to do',
        '〜する必要はない',
        'People do not have to pay.',
        '参加者はお金を払う必要はありません。',
        'have to「〜しなければならない」を否定すると「〜する必要はない」。',
        'syntax',
      ),
      expression(
        'p4_in_a_way',
        '4',
        'in a ... way',
        '〜な方法で',
        'Children can learn about their town in a fun way.',
        '子どもたちは楽しく自分たちの町について学べます。',
        'way の前に形容詞を置き、どのような方法かを表す。',
      ),
    ],
  },

  p_3_school_garden: {
    phraseIds: ['syn_enough_to', 'idm_proud_of'],
    expressions: [
      expression(
        'p3_at_first',
        '3',
        'at first',
        '最初は',
        'At first, many students thought the work would be simple.',
        '最初、多くの生徒はその作業は簡単だと思っていました。',
        '後で状況が変わる話の導入に使う。「第一に」の first とは異なる。',
      ),
      expression(
        'p3_have_to',
        '3',
        'have to do',
        '〜しなければならない',
        'They had to choose a sunny place.',
        '彼らは日当たりのよい場所を選ばなければなりませんでした。',
        '必要・義務を表す。過去では have が had に変わる。',
        'syntax',
      ),
      expression(
        'p3_after_that',
        '3',
        'after that',
        'その後',
        'After that, the garden changed quickly.',
        'その後、畑は急速に変わりました。',
        '前に述べた出来事を that で受け、その後の展開へつなぐ。',
      ),
      expression(
        'p3_by_the_end_of',
        '3',
        'by the end of',
        '〜の終わりまでには',
        'By the end of the project, the students were proud of the result.',
        'プロジェクトの終わりには、生徒たちは結果を誇りに思っていました。',
        'by は期限を示す。「その時までに状態が完成する」という含みがある。',
      ),
    ],
  },

  p_pre2_museum_volunteers: {
    phraseIds: ['idm_interested_in'],
    expressions: [
      expression(
        'pre2_take_part',
        'pre2',
        'take part',
        '参加する',
        'When young people take part, exhibitions feel more open.',
        '若者が参加すると、展示はより開かれたものに感じられます。',
        'part「役割」を take「受け持つ」ことから、活動に加わる意味になる。',
      ),
      expression(
        'pre2_be_used_to',
        'pre2',
        'be used to ...',
        '〜に慣れている',
        'They help visitors who are not used to museums.',
        '彼らは博物館に慣れていない来館者を助けます。',
        'used to の to は前置詞。後ろには名詞または動名詞を置く。',
      ),
      expression(
        'pre2_as_well',
        'pre2',
        'as well',
        '〜もまた',
        'For the museum, the benefit is clear as well.',
        '博物館にとっても、その利点は明らかです。',
        'also と同じく追加を表すが、通常は文末に置く。',
      ),
      expression(
        'pre2_be_willing_to',
        'pre2',
        'be willing to do',
        '進んで〜する',
        'Visitors are more willing to ask questions.',
        '来館者はより進んで質問するようになります。',
        'willing は「嫌がらず進んで行う気がある」。後ろは to ＋ 動詞。',
        'syntax',
      ),
      expression(
        'pre2_without_doing',
        'pre2',
        'without doing',
        '〜せずに',
        'The staff make the language clearer without removing the main idea.',
        '職員は中心となる考えを削らずに表現を分かりやすくします。',
        'without は前置詞なので、動作を続けるときは動名詞 doing を使う。',
        'syntax',
      ),
    ],
  },

  p_pre2plus_repair_cafes: {
    phraseIds: [],
    expressions: [
      expression(
        'pre2plus_in_response',
        'pre2plus',
        'in response',
        'それに応じて',
        'In response, communities have started events called repair cafes.',
        'それに応じて、地域社会はリペアカフェと呼ばれる催しを始めました。',
        '直前に示された問題や出来事を受けて、次の行動・変化を導く論理表現。',
      ),
      expression(
        'pre2plus_take_part_in',
        'pre2plus',
        'take part in',
        '〜に参加する',
        'Visitors take part in the repair work.',
        '来場者は修理作業に参加します。',
        'part「役割」を take「引き受ける」ことから、活動へ参加する意味になる。',
      ),
      expression(
        'pre2plus_instead_of_doing',
        'pre2plus',
        'instead of doing',
        '〜する代わりに',
        'Visitors help instead of simply leaving an item at a counter.',
        '来場者は品物を受付に預けるだけでなく、作業を手伝います。',
        'instead of の後ろに動作を置くときは動名詞を使う。',
        'syntax',
      ),
      expression(
        'pre2plus_allow_a_to',
        'pre2plus',
        'allow A to do',
        'Aが〜することを可能にする',
        'The process allows participants to gain practical skills.',
        'その過程は参加者が実用的な技能を得ることを可能にします。',
        'allow の目的語Aの後ろに to不定詞を置き、可能・許可を表す。',
        'syntax',
      ),
      expression(
        'pre2plus_be_designed_so_that',
        'pre2plus',
        'be designed so that ...',
        '〜するように設計されている',
        'Some products are designed so that they are difficult to open.',
        '製品には開けにくいよう設計されたものがあります。',
        'so that 以下で、設計が生む結果や意図を示す。',
        'syntax',
      ),
      expression(
        'pre2plus_by_themselves',
        'pre2plus',
        'by themselves',
        'それらだけで・自力で',
        'Repair cafes cannot change product design by themselves.',
        'リペアカフェだけで製品設計を変えることはできません。',
        '文脈により「助けなしに」または「それだけでは」の意味になる。',
      ),
    ],
  },

  p_2_quiet_technology: {
    phraseIds: ['idm_for_example', 'syn_not_at_all'],
    expressions: [
      expression(
        'p2_in_recent_years',
        '2',
        'in recent years',
        '近年',
        'In recent years, useful technologies have become almost invisible.',
        '近年、役に立つ技術はほとんど目立たなくなっています。',
        '現在まで続く「ここ数年」を表し、現在完了形とよく使う。',
      ),
      expression(
        'p2_can_be_found_in',
        '2',
        'can be found in',
        '〜に見られる',
        'Another example can be found in public libraries.',
        '別の例は公共図書館に見られます。',
        '直訳は「〜の中で見つけられる」。例や傾向の所在を示す受動表現。',
        'syntax',
      ),
      expression(
        'p2_instead_of',
        '2',
        'instead of',
        '〜の代わりに・〜ではなく',
        'Technology may make services unequal instead of convenient.',
        '技術はサービスを便利にする代わりに不平等にするかもしれません。',
        'of の後ろに、置き換えられる名詞・代名詞・動名詞を置く。',
      ),
      expression(
        'p2_be_judged_by',
        '2',
        'be judged by',
        '〜によって判断される',
        'Technology should be judged by whether it solves a real problem.',
        '技術は実際の問題を解決するかどうかで判断されるべきです。',
        'judge A by B「Bを基準にAを判断する」の受動形。',
        'syntax',
      ),
      expression(
        'p2_be_left_out',
        '2',
        'be left out',
        '取り残される・除外される',
        'City leaders need to ask who might be left out.',
        '都市の指導者は誰が取り残されるかを問う必要があります。',
        'leave A out「Aを外に残す・除外する」の受動形。',
      ),
    ],
  },

  p_pre1_resilient_cities: {
    phraseIds: [],
    expressions: [
      expression(
        'pre1_respond_to',
        'pre1',
        'respond to',
        '〜に対応する',
        'Cities have always had to respond to weather.',
        '都市は常に天候に対応しなければなりませんでした。',
        'respond の対象は前置詞 to で示す。',
      ),
      expression(
        'pre1_for_instance',
        'pre1',
        'for instance',
        '例えば',
        'For instance, higher walls may push water downstream.',
        '例えば、より高い壁が水を下流へ押しやるかもしれません。',
        '具体例を導く表現。for example とほぼ同じ。',
      ),
      expression(
        'pre1_at_once',
        'pre1',
        'at once',
        '同時に・すぐに',
        'Some resources can serve several needs at once.',
        '一部の資源は複数の必要に同時に役立ちます。',
        'この文では「同時に」。命令文などでは「すぐに」の意味にもなる。',
      ),
      expression(
        'pre1_be_based_on',
        'pre1',
        'be based on',
        '〜に基づいている',
        'Good policy must be based on evidence.',
        '良い政策は証拠に基づかなければなりません。',
        'base A on B「Aの土台をBに置く」の受動形。',
      ),
      expression(
        'pre1_rather_than',
        'pre1',
        'rather than',
        '〜ではなく',
        'Policy must use local evidence rather than copied ideas.',
        '政策は借りた考えではなく地域の証拠を使わなければなりません。',
        '対比する二つの要素を同じ形で並べる。',
      ),
      expression(
        'pre1_come_first',
        'pre1',
        'come first',
        '優先される・第一になる',
        'Residents may disagree about which projects should come first.',
        '住民はどの事業を優先すべきかで意見が分かれるかもしれません。',
        '順番の「最初に来る」から、優先順位が最も高いことを表す。',
      ),
      expression(
        'pre1_over_a_long_period',
        'pre1',
        'over a long period',
        '長期間にわたって',
        'Cities must evaluate projects over a long period.',
        '都市は事業を長期間にわたって評価しなければなりません。',
        'over は、ある期間の初めから終わりまでの広がりを表す。',
      ),
    ],
  },

  p_1_collective_memory: {
    phraseIds: ['idm_depend_on', 'syn_not_only'],
    expressions: [
      expression(
        'p1_in_practice',
        '1',
        'in practice',
        '実際には',
        'In practice, abundance can produce a different kind of loss.',
        '実際には、豊富さが別の種類の喪失を生むことがあります。',
        '理論・予想と実際を対比するときに使う。',
      ),
      expression(
        'p1_rather_than',
        '1',
        'rather than',
        '〜ではなく',
        'The past becomes isolated facts rather than a resource for judgment.',
        '過去は判断の資源ではなく、孤立した事実になります。',
        '選ばれない側を than の後ろ、重視する側を前に置く。',
      ),
      expression(
        'p1_at_the_same_time',
        '1',
        'at the same time',
        '同時に・その一方で',
        'At the same time, students need intellectual habits.',
        '同時に、生徒には知的習慣も必要です。',
        '時間の同時性だけでなく、別の観点を追加する論説表現として使う。',
      ),
      expression(
        'p1_turn_into',
        '1',
        'turn into',
        '〜に変わる',
        'Skepticism can turn into cynicism.',
        '懐疑は冷笑へと変わることがあります。',
        'turn「向きを変える」＋ into「〜の状態へ」で変化を表す。',
      ),
      expression(
        'p1_beyond',
        '1',
        'beyond ...',
        '〜を越えて・〜の先まで',
        'Citizens must be willing to read beyond headlines.',
        '市民は見出しを越えて読む意思を持たなければなりません。',
        '物理的な境界だけでなく、表面的な範囲を越える意味にも使う。',
      ),
      expression(
        'p1_in_this_sense',
        '1',
        'in this sense',
        'この意味では',
        'Remembering, in this sense, is an active practice.',
        'この意味で、記憶することは能動的な実践です。',
        '直前までに定義・説明した意味へ読み手を戻す論説表現。',
      ),
    ],
  },
}

export function getReadingWords(passage) {
  const ids = []
  const seen = new Set()
  const add = (id) => {
    if (!id || seen.has(id)) return
    seen.add(id)
    ids.push(id)
  }
  for (const id of passage?.vocab ?? []) add(id)

  const supplementalIds = new Set(PASSAGE_DICTIONARY_WORD_IDS)
  for (const sentence of passage?.sentences ?? []) {
    const tokens = sentence.en.match(/[A-Za-z]+(?:['’][A-Za-z]+)*/g) ?? []
    for (const token of tokens) {
      const id = resolvePassageWord(token.toLowerCase(), sentence.gloss)?.id
      if (supplementalIds.has(id)) add(id)
    }
  }
  return ids.map(getWord).filter(Boolean)
}

export function getReadingPhrases(passageId) {
  const study = READING_STUDY[passageId]
  if (!study) return []
  return [
    ...(study.phraseIds ?? []).map(getPhrase).filter(Boolean),
    ...(study.expressions ?? []),
  ]
}

export function getReadingStudy(passage) {
  return {
    words: getReadingWords(passage),
    phrases: getReadingPhrases(passage?.id),
  }
}

export function passageWordCount(passage) {
  const text = (passage?.sentences ?? []).map((sentence) => sentence.en).join(' ')
  return text.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g)?.length ?? 0
}

// 英検公式の直近3回分で観測した最長本文を基準にした教材レンジ。
// 5級の筆記には独立長文がないため、5級だけはアプリ独自の導入教材レンジ。
export const READING_WORD_COUNT_TARGETS = Object.freeze({
  5: Object.freeze({ min: 70, max: 110, officialLongPassage: false }),
  4: Object.freeze({ min: 160, max: 180, officialLongPassage: true }),
  3: Object.freeze({ min: 260, max: 300, officialLongPassage: true }),
  pre2: Object.freeze({ min: 300, max: 330, officialLongPassage: true }),
  pre2plus: Object.freeze({ min: 330, max: 350, officialLongPassage: true }),
  2: Object.freeze({ min: 360, max: 400, officialLongPassage: true }),
  pre1: Object.freeze({ min: 510, max: 550, officialLongPassage: true }),
  1: Object.freeze({ min: 800, max: 850, officialLongPassage: true }),
})
