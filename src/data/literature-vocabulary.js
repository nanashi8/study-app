// 名作本文の語彙予習。
//
// 英語は本文の全トークンを活用形ごとに解決し、同じ見出し語へまとめる。
// 共通辞書にない固有名詞・古風な語も作品専用カードにして、本文から消さない。
// 古典・漢文は共通単語カードに加え、朗読の全区切りを原文→現代語訳の
// 「本文語句」カードにすることで、本文全体を漏れなく予習できるようにする。

import { getWord } from './vocab.js'
import { getKoten } from './koten.js'
import { getKanbunVocab } from './kanbun-vocab.js'
import { resolvePassageWord } from './passage-gloss.js'
import { LITERATURE_FULL_TEXT_GLOSS } from './literature-full-text/gloss.js'
import { tokenize } from '../lib/text.js'
import { literatureSentences } from './literature-sentences.js'

export const LITERATURE_ENGLISH_GLOSS = Object.freeze({
  '8': '8ドル（金額）',
  alice: 'アリス（人名）',
  alleys: '路地・細い道（複数）',
  aloft: '高い所に・上方に',
  anything: '何か・どんなものでも',
  battery: '砲台のある岬（ニューヨーク南端の地名）',
  bennet: 'ベネット（姓）',
  bingley: 'ビングリー（姓）',
  bulldozing: '強引に押し切ること',
  burned: '焼けた・ひりひりした',
  burning: '燃えるような・ひどく熱い',
  butcher: '肉屋',
  came: '来た（comeの過去形）',
  'can’t': '〜できない（cannot）',
  cents: 'セント（貨幣単位、複数）',
  chaise: '軽い四輪馬車',
  china: '中国',
  christmas: 'クリスマス',
  circumambulate: 'ぐるりと歩いて回る',
  clinched: 'しっかり固定された・縛り付けられた',
  coenties: 'コーエンティーズ（ニューヨークの地名）',
  corlears: 'コーリアーズ（ニューヨークの地名）',
  councillors: '議員・評議員たち',
  crystal: '水晶・水晶のように澄んだもの',
  della: 'デラ（人名）',
  dreamy: '夢見るような・ぼんやりした',
  'eighty-seven': '87',
  england: 'イングランド',
  ever: 'これまでに・いつでも',
  favoured: '特に好意を受けた・恵まれた',
  feet: '足（footの複数）・フィート',
  'five-and-twentieth': '25番目の（古風な言い方）',
  france: 'フランス',
  gilded: '金箔をかぶせた・金色に飾った',
  gold: '金・黄金',
  gone: '行ってしまった・なくなった（goの過去分詞）',
  grocer: '食料品店主・食料品店',
  heard: '聞いた（hearの過去・過去分詞）',
  heaven: '天・天国',
  heralded: '到来を告げた・前触れとなった',
  howl: '大声で泣く・遠ぼえする',
  imputation: '非難・悪いことを人のせいにすること',
  incredulity: '信じようとしないこと・疑い',
  indian: 'インドの・インド人の',
  inlanders: '内陸に住む人々',
  instigates: '引き起こす・そそのかす',
  isles: '島々',
  landsmen: '陸で暮らす人々・船乗りでない人々',
  lath: '木ずり（壁下地の細い木材）',
  lee: '風下・風の当たらない側',
  lest: '〜しないように・〜するといけないので',
  let: '貸し出された',
  loaves: 'パンのかたまり（loafの複数）',
  london: 'ロンドン',
  leagues: 'リーグ（距離の単位、複数）',
  manhattoes: 'マンハッタン（古い呼び名）',
  men: '男性たち・人々（manの複数）',
  michaelmas: 'ミカエル祭（9月29日）',
  mistress: '女主人・女性の家長',
  mole: '防波堤・突堤',
  morris: 'モリス（姓）',
  mr: '〜氏・〜さん（男性の敬称）',
  mrs: '〜夫人・〜さん（既婚女性の敬称）',
  neighbourhood: '近所・地域（英国式つづり）',
  netherfield: 'ネザーフィールド（屋敷名）',
  nigh: '近くに・近い（古風な語）',
  northward: '北へ・北向きに',
  oh: 'ああ・まあ（驚きなどの声）',
  parsimony: '極端な倹約・けち',
  plaster: 'しっくい・石こう',
  pennies: 'ペニー硬貨（pennyの複数）',
  pent: '閉じ込められた',
  per: '〜につき・〜ごとに',
  'pier-heads': '桟橋の先端（複数）',
  pop: 'ぽんと飛び込む・急に入る',
  possibly: 'できる限り・ひょっとすると',
  predominating: '大部分を占める・最も目立つ',
  property: '所有物・当然自分のものにできる相手',
  prophetic: '予言の・未来を告げる',
  quite: 'まったく・かなり',
  'rabbit-hole': 'ウサギ穴',
  ran: '走った（runの過去形）',
  revelations: '啓示・明らかにされたこと（複数）',
  reveries: '空想・物思い（複数）',
  rigging: '船の帆柱を支える綱具',
  rightful: '当然の権利がある',
  sabbath: '安息日・日曜日',
  sapphires: 'サファイア（複数）',
  seaward: '海の方へ・海向きの',
  sentinels: '見張り番・歩哨（複数）',
  'seventy-five': '75',
  sight: '視界・見える範囲',
  sixty: '60',
  miles: 'マイル（距離の単位、複数）',
  sniffles: '鼻をすする泣き方・すすり泣き',
  southcott: 'サウスコット（人名）',
  spiles: '桟橋を支える杭（複数）',
  superlative: '最上級の・極端な',
  surf: '打ち寄せる波・波しぶき',
  'sword-hilt': '剣のつか',
  taken: '取られた・借りられた（takeの過去分詞）',
  thence: 'そこから（古風な語）',
  thither: 'そこへ（古風な語）',
  throne: '王座・王位',
  unpractical: '実際的でない・現実離れした',
  upon: '〜の上に・〜すると',
  avenues: '大通り（複数）',
  'waistcoat-pocket': 'チョッキのポケット',
  'water-gazers': '水面を見つめる人々',
  waterward: '水辺の方へ',
  weathercock: '風見鶏',
  went: '行った（goの過去形）',
  westminster: 'ウェストミンスター（ロンドンの地名）',
  wharves: '波止場（wharfの複数）',
  whitehall: 'ホワイトホール（ニューヨークの地名）',
  worst: '最悪の（badの最上級）',
  yonder: '向こうの・あちらに（古風な語）',
})

// 共通辞書では拾えない不規則形も、意味が同じ既存語には進捗を接続する。
// ja は本文中の表層形に合わせ、id は共通辞書の保存先を示す。
export const LITERATURE_ENGLISH_FORM_ALIASES = Object.freeze({
  anything: Object.freeze({ id: 'any', ja: '何か・どんなものでも' }),
  announcing: Object.freeze({ id: 'announce', ja: '告げること・発表すること' }),
  came: Object.freeze({ id: 'come', ja: '来た（comeの過去形）' }),
  councillors: Object.freeze({ id: 'council', ja: '議員・評議員たち' }),
  favoured: Object.freeze({ id: 'favor', ja: '特に好意を受けた・恵まれた' }),
  feet: Object.freeze({ id: 'foot', ja: '足（footの複数）' }),
  gone: Object.freeze({ id: 'go', ja: '行ってしまった・なくなった' }),
  heard: Object.freeze({ id: 'hear', ja: '聞いた（hearの過去・過去分詞）' }),
  inlanders: Object.freeze({ id: 'inland', ja: '内陸に住む人々' }),
  isles: Object.freeze({ id: 'island', ja: '島々' }),
  loaves: Object.freeze({ id: 'loaf', ja: 'パンのかたまり（複数）' }),
  men: Object.freeze({ id: 'man', ja: '男性たち・人々' }),
  northward: Object.freeze({ id: 'north', ja: '北へ・北向きに' }),
  possibly: Object.freeze({ id: 'possible', ja: 'できる限り・ひょっとすると' }),
  ran: Object.freeze({ id: 'run', ja: '走った（runの過去形）' }),
  revelations: Object.freeze({ id: 'reveal', ja: '啓示・明らかにされたこと（複数）' }),
  rightful: Object.freeze({ id: 'right', ja: '当然の権利がある' }),
  seaward: Object.freeze({ id: 'sea', ja: '海の方へ・海向きの' }),
  taken: Object.freeze({ id: 'take', ja: '取られた・借りられた' }),
  waterward: Object.freeze({ id: 'water', ja: '水辺の方へ' }),
  went: Object.freeze({ id: 'go', ja: '行った（goの過去形）' }),
  worst: Object.freeze({ id: 'bad', ja: '最悪の（badの最上級）' }),
})

const contextGloss = (ja, id) => Object.freeze(
  id === undefined ? { ja } : { ja, id },
)

// 作品本文で使われている意味を優先する語義表。
// 共通辞書に別の品詞・語義しかない場合は id:null とし、誤った進捗へ結び付けない。
// `s文の番号:語` は、同じ作品内でも用法が変わる語にだけ使う（文の番号は literature-sentences.js の番号）。
export const LITERATURE_ENGLISH_CONTEXT_GLOSS = Object.freeze({
  lit_en_moby_dick_water_gazers: Object.freeze({
    insular: contextGloss('島のような・島にある'),
    belted: contextGloss('ぐるりと縁取られた・囲まれた'),
    round: contextGloss('ぐるりと・周囲を'),
    's10:right': contextGloss('右へ'),
    left: contextGloss('左へ'),
    's10:take': contextGloss('（通りが人を）導く'),
    extreme: contextGloss('いちばん端の'),
    downtown: contextGloss('町のいちばん南の部分', null),
    noble: contextGloss('立派な・堂々とした'),
    washed: contextGloss('波に洗われた'),
    cooled: contextGloss('風で冷やされた'),
    previous: contextGloss('それより前の'),
    land: contextGloss('陸地'),
    hook: contextGloss('フック（地名の一部）', null),
    slip: contextGloss('スリップ（船着場の地名）', null),
    posted: contextGloss('配置されて立っている'),
    like: contextGloss('〜のように'),
    fixed: contextGloss('心を奪われた・没頭した'),
    seated: contextGloss('腰を下ろした・座っている'),
    still: contextGloss('さらに・いっそう'),
    better: contextGloss('もっとよい・もっとよく', 'good'),
    days: contextGloss('平日'),
    tied: contextGloss('売り台につながれた'),
    counters: contextGloss('売り台・カウンター'),
    nailed: contextGloss('釘付けにされた'),
    benches: contextGloss('作業台・長いす'),
    pacing: contextGloss('歩きながら進む'),
    straight: contextGloss('まっすぐに'),
    bound: contextGloss('今にも〜しそうな・〜へ向かう'),
    content: contextGloss('満足させる'),
    extremest: contextGloss('いちばん端の・最果ての'),
    's25:just': contextGloss('まさに・ぎりぎり'),
    possibly: contextGloss('できる限り'),
    virtue: contextGloss('磁力・ものを引き付ける働き', null),
    needles: contextGloss('羅針盤の針'),
  }),
  lit_en_pride_prejudice_netherfield: Object.freeze({
    universally: contextGloss('世間一般に・広く'),
    single: contextGloss('独身の'),
    possession: contextGloss('所有・持っていること'),
    fortune: contextGloss('財産・資産'),
    's1:want': contextGloss('必要として・求めて'),
    's2:little': contextGloss('ほとんど〜ない'),
    's2:may': contextGloss('〜であっても・〜かもしれない', null),
    entering: contextGloss('初めて入って来ること'),
    well: contextGloss('しっかりと・深く'),
    fixed: contextGloss('固く根付いた'),
    minds: contextGloss('心・考え'),
    surrounding: contextGloss('周囲の・近隣の'),
    dear: contextGloss('あなた・親愛なる人への呼びかけ'),
    lady: contextGloss('夫人・妻'),
    park: contextGloss('パーク（屋敷名の一部）', null),
    last: contextGloss('とうとう・ついに'),
    returned: contextGloss('言い返した・返答した'),
    long: contextGloss('ロング（姓）', null),
    's6:made': contextGloss('答えをしなかった'),
    taken: contextGloss('借りられた・入居者が決まった'),
    cried: contextGloss('叫んだ・声を上げた'),
    impatiently: contextGloss('いらだって・待ちきれずに'),
    hearing: contextGloss('聞くこと'),
    invitation: contextGloss('話し始めるきっかけ'),
    why: contextGloss('ねえ・ほら（話を切り出す声）'),
    place: contextGloss('屋敷・その場所'),
    delighted: contextGloss('とても気に入った・喜んだ'),
    agreed: contextGloss('合意した・契約した'),
    's10:take': contextGloss('入居する・手に入れる'),
    sure: contextGloss('もちろん（to be sure）'),
    fine: contextGloss('すばらしい・好都合な'),
    thing: contextGloss('こと・好機'),
  }),
  lit_en_tale_two_cities_times: Object.freeze({
    best: contextGloss('最良の（goodの最上級）', 'good'),
    times: contextGloss('時代・時世'),
    before: contextGloss('前方に・待ち受けて'),
    direct: contextGloss('まっすぐに'),
    short: contextGloss('要するに（in short）'),
    far: contextGloss('それほど・その程度まで'),
    like: contextGloss('〜によく似て'),
    present: contextGloss('現在の・今の'),
    noisiest: contextGloss('最も声高な'),
    authorities: contextGloss('権威ある論者たち'),
    received: contextGloss('評価された・受け止められた'),
    fair: contextGloss('美しい'),
    clearer: contextGloss('より明らかな'),
    state: contextGloss('国家・政府'),
    preserves: contextGloss('保護区・特権として囲い込んだ領域', null),
    settled: contextGloss('安定して決着している'),
    's4:ever': contextGloss('永久に（for ever）'),
    's5:lord': contextGloss('主・キリスト'),
    conceded: contextGloss('認められていた'),
    favoured: contextGloss('恵まれたとされた'),
    attained: contextGloss('到達した・迎えた'),
    private: contextGloss('一兵卒・兵士'),
    's7:life': contextGloss('近衛騎兵隊（Life Guardsの一部）'),
    guards: contextGloss('近衛騎兵隊'),
    appearance: contextGloss('登場・到来'),
    arrangements: contextGloss('手はず・準備'),
    swallowing: contextGloss('のみ込むこと・壊滅させること'),
  }),
  lit_en_alice_rabbit_hole: Object.freeze({
    beginning: contextGloss('〜し始めている'),
    's1:get': contextGloss('〜になる'),
    tired: contextGloss('うんざりした・飽きた'),
    's1:by': contextGloss('〜のそばに'),
    's2:by': contextGloss('〜のそばに'),
    having: contextGloss('〜があること・持つこと'),
    use: contextGloss('役立つこと・用途'),
    remarkable: contextGloss('不思議な・珍しい'),
    's4:out': contextGloss('普通から外れて'),
    's4:way': contextGloss('普通・いつものあり方'),
    hear: contextGloss('聞く'),
    itself: contextGloss('自分自身に・独りで'),
    dear: contextGloss('たいへんだ・ああ'),
    watch: contextGloss('腕時計・懐中時計'),
    hurried: contextGloss('急いで先へ進んだ'),
    started: contextGloss('ぱっと立ち上がった'),
    burning: contextGloss('好奇心でいっぱいになった'),
    's6:after': contextGloss('〜を追って'),
    's6:just': contextGloss('ちょうど間に合って'),
    's6:see': contextGloss('目にする'),
    pop: contextGloss('ぽんと飛び込む'),
    's7:went': contextGloss('入って行った'),
    considering: contextGloss('考えること'),
    world: contextGloss('いったい（強調）'),
    's7:get': contextGloss('外へ出る'),
  }),
  lit_en_happy_prince_statue: Object.freeze({
    gilded: contextGloss('金箔でおおわれた'),
    's2:leaves': contextGloss('薄い葉・箔（leafの複数）', 'leaf'),
    's2:fine': contextGloss('上質な・純度の高い'),
    admired: contextGloss('ほめたたえられた'),
    remarked: contextGloss('評した・述べた'),
    wished: contextGloss('〜したがった'),
    reputation: contextGloss('評判'),
    having: contextGloss('持っていること'),
    tastes: contextGloss('趣味・鑑賞眼'),
    only: contextGloss('ただし・とはいえ'),
    's4:quite': contextGloss('完全に・まったく'),
    so: contextGloss('それほど・同じくらい'),
    added: contextGloss('付け加えて言った', 'add'),
    fearing: contextGloss('〜を恐れて'),
    lest: contextGloss('〜するといけないので'),
    should: contextGloss('〜するのではないか'),
    like: contextGloss('〜のように'),
    's5:crying': contextGloss('欲しがって泣いている'),
    's6:crying': contextGloss('欲しがって泣いている'),
    dreams: contextGloss('夢にも思う'),
    's7:as': contextGloss('〜しながら・〜するとき'),
    's8:as': contextGloss('〜しながら・〜するとき'),
  }),
  lit_en_gift_of_magi_opening: Object.freeze({
    saved: contextGloss('貯めた・節約して残した'),
    bulldozing: contextGloss('強引に値切ること'),
    vegetable: contextGloss('野菜を売る'),
    'one’s': contextGloss('人の・自分の'),
    burned: contextGloss('熱くなった・赤くなった'),
    close: contextGloss('細かな・厳しい'),
    dealing: contextGloss('値切り・取引'),
    implied: contextGloss('暗に示した'),
    clearly: contextGloss('どう見ても・明らかに'),
    instigates: contextGloss('考えを呼び起こす'),
    moral: contextGloss('教訓めいた'),
    's10:reflection': contextGloss('考え・省察'),
    's10:made': contextGloss('〜からできている'),
    's10:up': contextGloss('構成して（made up of）'),
    predominating: contextGloss('いちばん多くを占めて'),
    mistress: contextGloss('家の女主人'),
    subsiding: contextGloss('泣き方が落ち着いていく'),
    stage: contextGloss('段階'),
    furnished: contextGloss('家具付きの'),
    flat: contextGloss('アパート'),
  }),
})

const literatureOnlyId = (workId, key) => (
  `litv_${workId.replace(/^lit_/, '')}_${String(key)
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')}`
)

export function resolveLiteratureEnglishWord(key, context = null) {
  const workId = typeof context === 'string' ? context : context?.workId
  const sentenceNumber = typeof context === 'object' ? context?.sentenceNumber : null
  const workGlosses = workId ? LITERATURE_ENGLISH_CONTEXT_GLOSS[workId] : null
  const indexedContextual = workGlosses?.[
    Number.isInteger(sentenceNumber) ? `s${sentenceNumber}:${key}` : ''
  ]
  const alias = LITERATURE_ENGLISH_FORM_ALIASES[key]
  const shared = resolvePassageWord(key)
  // 章・短編全文では同じ語が別の意味でも現れる。文を指定した語義は優先し、
  // 作品共通の補助語義は共通辞書で解決できない語にだけ使う。
  const contextual = indexedContextual ?? (shared ? null : workGlosses?.[key])
  if (contextual || alias) {
    const hasContextId = contextual
      ? Object.prototype.hasOwnProperty.call(contextual, 'id')
      : false
    const id = hasContextId
      ? contextual.id
      : alias?.id ?? shared?.id ?? null
    return {
      ja: contextual?.ja ?? alias.ja,
      id,
      literatureOnly: !id,
    }
  }
  if (shared) return { ...shared, literatureOnly: false }
  const ja = LITERATURE_ENGLISH_GLOSS[key] ?? LITERATURE_FULL_TEXT_GLOSS[key]
  return ja ? { ja, id: null, literatureOnly: true } : null
}

function englishVocabulary(work) {
  const groups = new Map()
  const missingOccurrences = []
  let totalOccurrences = 0

  // 文ごとに引く（同じ作品でも文によって意味が変わる語は、文の番号つきの語義を使う）。
  for (const sentence of literatureSentences(work)) {
    for (const token of tokenize(sentence.text).filter((item) => item.word)) {
      totalOccurrences += 1
      const resolved = resolveLiteratureEnglishWord(token.key, {
        workId: work.id,
        sentenceNumber: sentence.number,
      })
      if (!resolved) {
        missingOccurrences.push({
          key: token.key,
          word: token.word,
          sentence: sentence.number,
        })
        continue
      }

      const id = resolved.id ?? literatureOnlyId('en', token.key)
      const group = groups.get(id) ?? {
        id,
        dictionaryId: resolved.id,
        literatureOnly: !resolved.id,
        word: resolved.id ? getWord(resolved.id)?.word ?? token.word : token.word,
        forms: new Set(),
        contextMeanings: new Set(),
        paragraphNumbers: new Set(),
        occurrences: 0,
        firstSentence: sentence,
      }
      group.forms.add(token.word)
      group.contextMeanings.add(resolved.ja)
      group.paragraphNumbers.add(sentence.paragraphIndex + 1)
      group.occurrences += 1
      groups.set(id, group)
    }
  }

  const entries = [...groups.values()].map((group) => {
    const shared = group.dictionaryId ? getWord(group.dictionaryId) : null
    const contextMeanings = [...group.contextMeanings]
    return {
      ...(shared ?? {}),
      id: group.id,
      dictionaryId: group.dictionaryId,
      word: group.word,
      meanings: contextMeanings,
      meaning: contextMeanings.join('・'),
      contextMeanings,
      sourceForms: [...group.forms],
      paragraphNumbers: [...group.paragraphNumbers],
      occurrences: group.occurrences,
      firstSentenceOriginal: group.firstSentence.text,
      firstSentenceTranslation: group.firstSentence.ja,
      example: shared?.example ?? {
        en: group.firstSentence.text,
        ja: group.firstSentence.ja,
      },
      pos: shared?.pos ?? '本文語',
      level: shared?.level ?? work.level,
      lang: work.language || 'en-US',
      speech: group.word,
      literatureOnly: group.literatureOnly,
      reviewDomain: 'vocab',
      reviewSkill: 'reading',
      entryType: 'word',
    }
  })

  entries.sort((a, b) => {
    const firstParagraph = Math.min(...a.paragraphNumbers) - Math.min(...b.paragraphNumbers)
    if (firstParagraph !== 0) return firstParagraph
    return a.word.localeCompare(b.word, 'en')
  })

  const sharedIds = entries
    .map((entry) => entry.dictionaryId)
    .filter(Boolean)

  return {
    entries,
    sharedEntries: entries.filter((entry) => !entry.literatureOnly),
    contextEntries: [],
    sharedIds,
    totalOccurrences,
    coveredOccurrences: totalOccurrences - missingOccurrences.length,
    uniqueForms: new Set(
      literatureSentences(work).flatMap((sentence) => tokenize(sentence.text)
        .filter((item) => item.word)
        .map((item) => item.key)),
    ).size,
    missingOccurrences,
    coverageUnitLabel: '語',
  }
}

function sharedJapaneseEntries(work) {
  if (work.kind === 'classical') {
    return (work.kotenWordIds ?? []).map(getKoten).filter(Boolean).map((item) => ({
      ...item,
      dictionaryId: item.id,
      word: item.word,
      speech: item.kana,
      contextMeanings: item.meanings,
      sourceForms: [item.word],
      paragraphNumbers: [],
      occurrences: null,
      pos: '古典単語',
      lang: 'ja-JP',
      literatureOnly: false,
      reviewDomain: 'koten',
      reviewSkill: 'koten_reading',
      entryType: 'dictionary',
    }))
  }
  if (work.kind === 'kanbun') {
    return (work.kanbunVocabIds ?? []).map(getKanbunVocab).filter(Boolean).map((item) => ({
      id: item.id,
      dictionaryId: item.id,
      word: item.title,
      speech: item.reading,
      meanings: [item.answer],
      meaning: item.answer,
      contextMeanings: [item.answer],
      sourceForms: [item.title],
      paragraphNumbers: [],
      occurrences: null,
      example: item.original
        ? { en: item.original, ja: item.translation ?? item.answer }
        : null,
      pos: '漢文語彙',
      level: item.level,
      lang: 'ja-JP',
      literatureOnly: false,
      reviewDomain: 'kanbun',
      reviewSkill: 'kanbun',
      entryType: 'dictionary',
    }))
  }
  return []
}

function japaneseVocabulary(work) {
  const sharedEntries = sharedJapaneseEntries(work)
  const contextEntries = []
  const missingOccurrences = []
  // 朗読の区切りがどの段落の文に入るか（読む画面の段落の番号で示す）。
  const paragraphOf = new Map()
  for (const sentence of literatureSentences(work)) {
    for (const segment of sentence.segments) {
      paragraphOf.set(`${segment.sceneIndex}:${segment.segmentIndex}`, sentence.paragraphIndex + 1)
    }
  }

  for (const [sceneIndex, scene] of work.scenes.entries()) {
    const segments = scene.narrationSegments?.length
      ? scene.narrationSegments
      : [scene]
    for (const [segmentIndex, segment] of segments.entries()) {
      if (!segment.original?.trim() || !segment.translation?.trim()) {
        missingOccurrences.push({
          scene: sceneIndex + 1,
          segment: segmentIndex + 1,
        })
        continue
      }
      const paragraph = paragraphOf.get(`${sceneIndex}:${segmentIndex}`)
      contextEntries.push({
        id: literatureOnlyId(
          work.id,
          `${sceneIndex + 1}_${segmentIndex + 1}`,
        ),
        dictionaryId: null,
        word: segment.original,
        speech: segment.speech || scene.speech || segment.original,
        meanings: [segment.translation],
        meaning: segment.translation,
        contextMeanings: [segment.translation],
        sourceForms: [segment.original],
        paragraphNumbers: paragraph ? [paragraph] : [],
        occurrences: 1,
        pos: work.kind === 'kanbun' ? '漢文語句' : '古文語句',
        level: work.level,
        lang: 'ja-JP',
        literatureOnly: true,
        reviewDomain: 'literature',
        reviewSkill: work.kind === 'kanbun' ? 'kanbun' : 'koten_reading',
        entryType: 'phrase',
      })
    }
  }

  return {
    entries: [...sharedEntries, ...contextEntries],
    sharedEntries,
    contextEntries,
    sharedIds: sharedEntries.map((entry) => entry.id),
    totalOccurrences: contextEntries.length + missingOccurrences.length,
    coveredOccurrences: contextEntries.length,
    uniqueForms: contextEntries.length,
    missingOccurrences,
    coverageUnitLabel: '語句',
  }
}

export function buildLiteratureVocabulary(work) {
  if (!work?.scenes?.length) {
    return {
      entries: [],
      sharedEntries: [],
      contextEntries: [],
      sharedIds: [],
      totalOccurrences: 0,
      coveredOccurrences: 0,
      uniqueForms: 0,
      missingOccurrences: [],
      coverageUnitLabel: '語句',
    }
  }
  return work.kind === 'english'
    ? englishVocabulary(work)
    : japaneseVocabulary(work)
}

export function englishLiteratureWordIds(work) {
  return englishVocabulary(work).sharedIds
}

// 英文の単語を押したときの意味（文の番号つきの語義があれば、それを使う）。
export function resolveLiteratureSentenceWord(work, sentence, key) {
  return resolveLiteratureEnglishWord(key, { workId: work?.id, sentenceNumber: sentence?.number })
}
