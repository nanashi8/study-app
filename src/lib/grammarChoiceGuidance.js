import { ALL_WORDS } from '../data/vocab.js'

const LEVEL_ORDER = Object.freeze({
  5: 0,
  4: 1,
  3: 2,
  pre2: 3,
  2: 4,
  pre1: 5,
  1: 6,
})

const POS_USAGE = Object.freeze({
  動: '動作・状態を表す動詞として使います。',
  名: '人・物・概念を指す名詞として使います。',
  形: '名詞を修飾したり、主語・目的語の状態を説明したりする形容詞として使います。',
  副: '動詞・形容詞・文全体を詳しくする副詞として使います。',
  前: '後ろに名詞（句）を置く前置詞として使います。',
  接: '語・句・節をつなぐ接続詞として使います。',
  代: '名詞の代わりをする代名詞として使います。',
})

const normalizeChoice = (value) =>
  String(value ?? '')
    .trim()
    .toLocaleLowerCase('en-US')
    .replace(/[’]/g, "'")
    .replace(/\s+/g, ' ')

const guide = (status, summary, extra = {}) => ({
  status,
  summary,
  ...extra,
})

const valid = (summary, extra = {}) => guide('valid', summary, extra)
const invalid = (summary, extra = {}) => guide('invalid', summary, extra)

const SPECIAL_GUIDES = Object.freeze({
  'am not': valid(
    'be動詞の否定で、主語が I のときに使います。一般動詞や can の否定には使いません。',
    { pattern: 'I am not busy.' },
  ),
  'are not': valid(
    'be動詞の否定で、主語が you または複数のときに使います。一般動詞の否定は do not を使います。',
    { pattern: 'We are not busy.' },
  ),
  'is not': valid(
    'be動詞 is の否定で、主語の状態・身分・場所などを否定するときに使います。一般動詞の否定には does not を使います。',
    { pattern: 'The bus is not crowded.' },
  ),
  'did not': valid(
    '過去の一般動詞を否定するときに使い、後ろには動詞原形を置きます。be動詞の過去の否定は was not / were not です。',
    { pattern: 'I did not arrive late.' },
  ),
  'not do': valid(
    '助動詞の後ろや to不定詞の中で、動詞原形 do を否定するときにはこの語順を使えます。主語から始める現在の否定文は do not＋原形です。',
    { pattern: 'You must not do that.' },
  ),
  'not know': valid(
    '助動詞の後ろなどで動詞原形 know を否定するときには使えます。文頭の分詞構文なら Not knowing ... にします。',
    { pattern: 'You may not know the answer.' },
  ),
  'only not': valid(
    '前の内容に「ただし〜だけは違う」と例外を付ける、くだけた補足では使えます。Not until ... の代わりに倒置を起こす表現ではありません。',
    { pattern: 'I can meet you, only not on Monday.' },
  ),
  'until not': valid(
    'until の後ろで not が別の語句を否定するときには使えます。Not until ... のように「〜して初めて」を表す倒置とは語順が異なります。',
    { pattern: 'The rule applied until not long ago.' },
  ),
  'since not': valid(
    'since が理由の節を導き、その節の主語などを not で否定するときには使えます。Not until ... のような時点の倒置には使いません。',
    { pattern: 'Since not everyone agreed, we postponed the vote.' },
  ),
  'to unlocked': valid(
    'to が不定詞ではなく変化の到達点を示す前置詞で、unlocked を状態を表す形容詞として使うときには可能です。',
    { pattern: 'The icon changed from locked to unlocked.' },
  ),
  'to used': valid(
    'to が不定詞ではなく範囲・到達点を示す前置詞で、used が後ろの名詞を修飾するときには使えます。不定詞なら to use です。',
    { pattern: 'The shop sells everything from new to used books.' },
  ),
  'am able': valid(
    '主語が I で「〜する能力・可能性がある」と述べるときに、am able to＋動詞原形の形で使います。',
    { pattern: 'I am able to swim.' },
  ),
  'can be': valid(
    'can＋be で「〜であり得る・〜になることができる」と述べるときに使います。後ろに形容詞・名詞・過去分詞などを続けます。',
    { pattern: 'The work can be difficult.' },
  ),
  'should be': valid(
    'should＋be で「〜であるべきだ・〜のはずだ」と述べるときに使います。',
    { pattern: 'The bus should be here soon.' },
  ),
  'should i be': valid(
    '直接疑問で「私は〜すべきですか」とたずねるか、条件節の if を省いた倒置で「もし私が〜なら」と述べるときに使います。',
    { pattern: 'Should I be late, start without me.' },
  ),
  'would have to': valid(
    '仮定した条件のもとで「〜しなければならないだろう」と述べるときに、would have to＋動詞原形で使います。',
    { pattern: 'I would have to leave early.' },
  ),
  'was being': valid(
    '過去の一時的な振る舞い・状態を was being＋形容詞で表すか、was being＋過去分詞で進行中の受動を表すときに使います。',
    { pattern: 'He was being unusually quiet.' },
  ),
  'were being': valid(
    '複数主語などについて、過去の一時的な振る舞い・状態、または進行中の受動を表すときに使います。',
    { pattern: 'The rooms were being cleaned.' },
  ),
  'is who': valid(
    'be動詞の補語として who で始まる名詞節を置くときには使えます。間接疑問の節内では who＋主語＋be動詞の語順にします。',
    { pattern: 'The question is who will lead.' },
  ),
  'had the noise': valid(
    'had＋目的語として「その音を経験した・処理の対象にした」と述べる文脈なら使えます。倒置の空所に主語まで含めて入れる形ではありません。',
    { pattern: 'We had the noise measured.' },
  ),
  'had the policy': valid(
    'had＋目的語として「その方針を持っていた・処理の対象にした」と述べる文脈なら使えます。倒置の空所に主語まで含めて入れる形ではありません。',
    { pattern: 'The company had the policy reviewed.' },
  ),
  'has checking': valid(
    'has を「持っている」、checking を後ろの名詞を説明する語として使う文脈なら使えます。義務の have to の代わりにはなりません。',
    { pattern: 'The bank has checking accounts.' },
  ),
  ones: valid(
    'すでに出た複数の可算名詞を繰り返さず、「〜なものたち」と代用するときに使います。単数名詞の代用は one です。',
    { pattern: 'I prefer the smaller ones.' },
  ),
  'each other': valid(
    '二人・二つ以上が互いに同じ動作をすることを表す相互代名詞として使います。',
    { pattern: 'They help each other.' },
  ),
  cans: valid(
    '助動詞 can の活用形ではありませんが、動詞 can「缶詰にする」の3単現、または名詞 can「缶」の複数形として使えます。',
    { pattern: 'The factory cans tomatoes. / two cans' },
  ),
  wills: valid(
    '助動詞 will の活用形ではありませんが、動詞 will「意志で決める・遺贈する」の3単現、または名詞 will「遺言書」の複数形として使えます。',
    { pattern: 'She wills the house to her son. / two wills' },
  ),
  haves: valid(
    '動詞 have の3単現ではありませんが、名詞として「持てる人々」を表す the haves という対比表現で使えます。',
    { pattern: 'the haves and the have-nots' },
  ),
  fewest: valid(
    '数えられる名詞について「最も少ない」と三つ以上を比べる最上級で使います。',
    { pattern: 'This class has the fewest students.' },
  ),
  irrelevantly: valid(
    '「関係なく・見当違いに」という副詞として、動詞や発言の仕方などを修飾するときに使います。be動詞の補語には irrelevant を使います。',
    { pattern: 'He answered irrelevantly.' },
  ),
  difficultly: invalid(
    '標準的な学習英語では difficultly は通常使いません。「苦労して」なら with difficulty を使います。',
  ),
  whitely: valid(
    '「白く」と表すまれな文学的副詞としては使えます。通常の英語では in white / with a white color などの方が自然です。',
    { pattern: 'The moon shone whitely through the clouds.' },
  ),
  'recommends to': valid(
    '主語が3人称単数で、recommend＋物＋to＋人の形で「物事を人に勧める」ときに使えます。recommend to＋人＋to do とはしません。',
    { pattern: 'She recommends this book to beginners.' },
  ),
  'relevant to not': valid(
    'not が not only ... but also ... を始め、relevant to の目的語を並べるときには使えます。単純に relevant を否定するなら not relevant to ... です。',
    { pattern: 'This is relevant to not only students but also teachers.' },
  ),
  "isn't": valid(
    'be動詞 is の否定形で、主語の状態・身分・場所などを否定するときに使います。',
    { pattern: "He isn't busy." },
  ),
  'was used to': valid(
    '「〜に慣れていた」の意味で、後ろに名詞または動名詞を置きます。過去の習慣を表す used to＋原形とは別の形です。',
    { pattern: 'He was used to getting up early.' },
  ),
  'use to': valid(
    'did / did not の後ろで、過去の習慣を表す used to の used が原形に戻るときに使います。',
    { pattern: 'Did he use to play here?' },
  ),
  'using to': invalid(
    '過去の習慣にも「〜に慣れている」にも using to は使いません。used to＋原形、または be used to＋名詞・動名詞にします。',
  ),
  'to being': valid(
    'to が不定詞ではなく前置詞になる表現の後ろで、動名詞 being を置くときに使います。',
    { pattern: 'She is used to being busy.' },
  ),
  'because of': valid(
    '理由を名詞（句）で続けるときに使います。because の後ろには主語＋動詞の節を置きます。',
    { pattern: 'The game was canceled because of the rain.' },
  ),
  'because of all': valid(
    '「そのすべての〜が理由で」と、理由になる名詞句を続けるときに使います。譲歩の意味にはなりません。',
    { pattern: 'Because of all the delays, we changed the plan.' },
  ),
  'even if': valid(
    'まだ事実とは限らない条件を「たとえ〜でも」と述べるときに使います。',
    { pattern: 'I will go even if it rains.' },
  ),
  'as if': valid(
    '実際にそうかは別として「まるで〜のように」と様子を比べるときに使います。',
    { pattern: 'He talks as if he knew everything.' },
  ),
  'so that': valid(
    '目的なら「〜するように」、結果なら「そのため〜」となる節を続けるときに使います。',
    { pattern: 'Speak slowly so that everyone can understand.' },
  ),
  'so to': valid(
    'so to speak という定型句の一部で、「いわば・言ってみれば」と表すときには使えます。目的を表すなら so as to＋動詞原形です。',
    { pattern: 'He is, so to speak, the heart of the team.' },
  ),
  whenever: valid(
    '時を表す「〜するときはいつでも」の意味で使います。物・内容を表す whatever とは役割が異なります。',
    { pattern: 'Call me whenever you need help.' },
  ),
  'however much': valid(
    '量・程度について「どれほど〜しても」と譲歩を表すときに使います。',
    { pattern: 'However much it costs, safety comes first.' },
  ),
  'few of': valid(
    'the / these / us などで範囲を限定した複数のうち「ほとんど〜ない」と言うときに使います。',
    { pattern: 'Few of the students were absent.' },
  ),
  'whether or': valid(
    '二つの可能性を並べるときに whether A or B の形で使います。単に「〜かどうか」なら whether / if＋節です。',
    { pattern: 'I do not know whether to stay or leave.' },
  ),
  'which one is': valid(
    '複数の候補から一つを直接たずねる疑問文で使います。',
    { pattern: 'Which one is yours?' },
  ),
  'what does': valid(
    '一般動詞を使う直接疑問文で、主語が3人称単数のときに使います。',
    { pattern: 'What does this word mean?' },
  ),
  'theirs are': valid(
    'theirs を主語にして「彼らのものは〜だ」と述べるときに使います。前置詞 to の目的語には them を使います。',
    { pattern: 'Ours are here, and theirs are over there.' },
  ),
  'should have': valid(
    'should have＋過去分詞で、過去への後悔・非難や過去についての推量を表すときに使います。',
    { pattern: 'You should have checked the answer.' },
  ),
  'had been': valid(
    '過去完了の had been として、過去の基準時より前からの状態・受動・進行を表すときに使います。',
    { pattern: 'She had been busy before the meeting.' },
  ),
  'will have': valid(
    'will have＋過去分詞で、未来の基準時までの完了を表すときに使います。',
    { pattern: 'She will have finished by noon.' },
  ),
  'would have': valid(
    'would have＋過去分詞で、実際には起きなかった過去の結果などを表すときに使います。',
    { pattern: 'I would have helped if I had known.' },
  ),
  'is necessary': valid(
    '主語について「必要である」と述べる通常の be動詞の文で使います。',
    { pattern: 'Another check is necessary.' },
  ),
  'it necessary': valid(
    'find / consider / make などの後ろで it を目的語、necessary を目的格補語にするときに使えます。',
    { pattern: 'We consider it necessary to check again.' },
  ),
  'to be necessary': valid(
    'seem / prove などの後ろや、名詞を説明する不定詞で「必要であること」を表すときに使います。',
    { pattern: 'Another check seems to be necessary.' },
  ),
  'is possible': valid(
    '主語について「可能である」と述べる通常の be動詞の文で使います。',
    { pattern: 'A second attempt is possible.' },
  ),
  'it possible': valid(
    'make / find などの後ろで it を目的語、possible を目的格補語にするときに使います。',
    { pattern: 'This tool makes it possible to work faster.' },
  ),
  'to be possible': valid(
    'seem などの後ろで「可能であるように思える」と述べるときに使います。',
    { pattern: 'A solution appears to be possible.' },
  ),
  'to get up': valid(
    'to不定詞として「起きること・起きるために」を表すときに使います。be used to の to は前置詞なので getting up にします。',
    { pattern: 'I want to get up early.' },
  ),
  'get up': valid(
    '現在形、命令文、助動詞の後ろなど、動詞の原形が必要なときに使います。',
    { pattern: 'I get up at seven.' },
  ),
  'got up': valid(
    '過去のある時点に「起きた」と述べる肯定文で使います。',
    { pattern: 'I got up early yesterday.' },
  ),
  'to momo': valid(
    'to を方向・相手を表す前置詞として、Momo をその目的語にするときには使えます。',
    { pattern: 'Ken spoke to Momo.' },
  ),
  let: valid(
    'let＋人＋動詞原形で「人に〜させる・〜するのを許す」と表すときに使います。場所へ導く意味には lead / bring を使います。',
    { pattern: 'Let me try again.' },
  ),
  'stopped to': valid(
    'stop to＋動詞原形で「〜するために立ち止まる」と表すときに使います。stop＋人＋from doing とは別の構文です。',
    { pattern: 'We stopped to rest.' },
  ),
  'suggested to': valid(
    'suggested to＋人 で「人に提案した」と相手を示すときには使えます。suggest that 節の直前には to を置きません。',
    { pattern: 'She suggested the idea to us.' },
  ),
  unchange: invalid(
    '状態を表す補語には過去分詞由来の形容詞 unchanged を使います。unchange は通常の学習英語ではこの意味に使いません。',
  ),
  unchanges: invalid(
    '「変わらない状態」を表す補語に動詞形 unchanges は使いません。形容詞 unchanged を使います。',
  ),
  unchangingly: valid(
    '副詞として「変わることなく」の意味で形容詞などを修飾するときにまれに使えます。remain の補語には形容詞 unchanged を使います。',
    { pattern: 'She remained unchangingly loyal.' },
  ),
  lest: valid(
    '「〜しないように」という予防目的を表し、lest＋主語＋(should)＋動詞原形の形で使います。',
    { pattern: 'We left early lest we should miss the train.' },
  ),
  'much as': valid(
    '文頭で「〜ではあるが」と譲歩を表すか、比較で「〜と同じくらい」を表すときに使います。',
    { pattern: 'Much as I respect him, I disagree.' },
  ),
  sufficing: valid(
    'suffice の ing形として、主に改まった分詞表現で「十分である」と述べるときには使えます。ただし Suffice it to say ... は動詞原形で始める定型表現です。',
    { pattern: 'The evidence sufficing for this purpose, no further proof was required.' },
  ),
  'how many': valid(
    '数えられる名詞の数を「いくつ・何人」とたずねるときに使い、後ろに複数名詞を置きます。',
    { pattern: 'How many books do you have?' },
  ),
  'where to': valid(
    '「どこで・どこへ〜すべきか」を表す疑問詞＋不定詞で、後ろに動詞原形を置きます。',
    { pattern: 'Please tell me where to wait.' },
  ),
  much: valid(
    '不可算名詞の量を表すか、比較級・過去分詞などを「ずっと・大いに」と強めるときに使います。',
    { pattern: 'This plan is much better.' },
  ),
  ours: valid(
    '「私たちのもの」と名詞を繰り返さずに表す所有代名詞として使います。名詞の直前には our を使います。',
    { pattern: 'These pencils are ours.' },
  ),
  itself: valid(
    '主語と目的語が同じ「それ自身」を表すか、it を強調するときに使います。',
    { pattern: 'The machine turned itself off.' },
  ),
  'which is': valid(
    '「どちら・どれが〜ですか」と直接たずねる疑問文で使います。後ろに名詞を直接置くなら Which＋名詞にします。',
    { pattern: 'Which is your bag?' },
  ),
  'never to': valid(
    'promise / decide などの後ろで、to不定詞を否定して「決して〜しない」と表すときに使います。',
    { pattern: 'She promised never to forget.' },
  ),
  'to not': valid(
    'to不定詞を否定する分離不定詞として使われることがあります。学習英語では通常 not to＋原形を優先します。',
    { pattern: 'Try not to worry. / Try to not worry.' },
  ),
  'all ready': valid(
    'all が ready を強めて「全員・全部準備ができた」と表すときに使います。「すでに」の already とは別です。',
    { pattern: 'We are all ready to leave.' },
  ),
  'all two': valid(
    'two が hundred / thousand などを伴う大きな数の一部なら、「その200すべて」のように all two ... と続けられます。二つだけを「両方」と言うなら both を使います。',
    { pattern: 'All two hundred seats were filled.' },
  ),
  'in the': valid(
    '特定の場所・期間を示す名詞の前で使います。時間表現は in the morning に対し、night は通常 at night です。',
    { pattern: 'We study in the morning.' },
  ),
  'by the': valid(
    '特定の物のそば・手段・単位などを表すときに使います。night を時として言う通常表現は at night です。',
    { pattern: 'She sat by the window.' },
  ),
  'who is': valid(
    '「誰が・誰ですか」とたずねる直接疑問文で使います。間接疑問では who＋主語＋is の平叙文語順にします。',
    { pattern: 'Who is that student?' },
  ),
  anything: valid(
    '否定文・疑問文・条件文で「何か・何も・何でも」を表す代名詞として使います。',
    { pattern: 'I did not see anything.' },
  ),
  something: valid(
    '主に肯定文で、不特定の「何か」を表す代名詞として使います。',
    { pattern: 'I heard something outside.' },
  ),
  'more good': valid(
    'good を不可算名詞「善・良い効果」として量を比べるときには使えます。形容詞 good の普通の比較級は better です。',
    { pattern: 'The change did more good than harm.' },
  ),
  hopely: invalid(
    'hope にそのまま ly を付けた hopely は標準的な副詞ではありません。「願わくは」は hopefully を使います。',
  ),
  animales: invalid(
    'animal の複数形は animals です。animales という複数形は使いません。',
  ),
  fishs: invalid(
    'fish の通常の複数形は fish です。fishs とはしません。',
  ),
  fishies: valid(
    '幼児語・親しみを込めたくだけた言い方で「お魚たち」と呼ぶときには使えます。標準的な複数形の答案は fish です。',
    { pattern: 'Look at the little fishies!' },
  ),
  mices: invalid(
    'mouse の複数形は不規則変化して mice です。mices とはしません。',
  ),
  fishes: valid(
    '複数の種類・種として魚を区別するときの複数形、または動詞 fish の3単現として使えます。通常、同種の魚が複数なら fish です。',
    { pattern: 'The reef contains many fishes. / She fishes on Sundays.' },
  ),
  mouses: valid(
    'コンピューターの入力機器 mouse の複数形としては mouses も使えます。動物の mouse の複数形は mice です。',
    { pattern: 'We tested several computer mouses.' },
  ),
  knifes: valid(
    '名詞 knife の複数形ではありませんが、動詞 knife「ナイフで切る・鋭く進む」の3単現として使えます。',
    { pattern: 'The boat knifes through the water.' },
  ),
  leafs: valid(
    '名詞 leaf の複数形ではありませんが、動詞 leaf の3単現として leaf through「ページをぱらぱらめく」で使えます。',
    { pattern: 'She leafs through the magazine.' },
  ),
  mans: valid(
    '名詞 man の複数形ではありませんが、動詞 man「持ち場につく・配置する」の3単現として使えます。',
    { pattern: 'She mans the front desk.' },
  ),
  "his'": invalid(
    '所有代名詞 his にはアポストロフィを付けません。「彼のもの」は his のまま使います。',
  ),
  "it's": valid(
    'it is または it has の短縮形として使います。「それの」という所有はアポストロフィなしの its です。',
    { pattern: "It's cold today." },
  ),
  "he's": valid(
    'he is または he has の短縮形として使います。名詞の前で「彼の」と表すときは his です。',
    { pattern: "He's my brother." },
  ),
  yours: valid(
    '「あなたのもの」と名詞を繰り返さずに表す所有代名詞として使います。名詞の直前には your を使います。',
    { pattern: 'This seat is yours.' },
  ),
  yourself: valid(
    '主語 you と同じ人を目的語にするか、you を強調するときに使う再帰代名詞です。',
    { pattern: 'You should trust yourself.' },
  ),
  'to trouble': valid(
    'to不定詞で「人を困らせること」を表すときに使います。have trouble の後ろでは動名詞を使います。',
    { pattern: "I don't want to trouble you." },
  ),
  'although hard': valid(
    '主語と be動詞を省いた譲歩節で「難しいけれど」と言うときに使えます。hard as S V の as と重ねては使いません。',
    { pattern: 'Although hard, the task was useful.' },
  ),
  'although simple': valid(
    '主語と be動詞を省いた譲歩節で「単純ではあるが」と言うときに使えます。simple as S V の as と重ねては使いません。',
    { pattern: 'Although simple, the method is effective.' },
  ),
  'although tired': valid(
    '主語と be動詞を省いた譲歩節で「疲れていたけれど」と言うときに使えます。後ろに主語＋be動詞を残すなら Although she was tired の語順です。',
    { pattern: 'Although tired, she kept working.' },
  ),
  'as tired': valid(
    'as tired as ... の形で「〜と同じくらい疲れて」と比較するときに使います。譲歩倒置なら Tired as S V です。',
    { pattern: 'I was as tired as Ken.' },
  ),
  bareness: valid(
    '「裸・むき出しの状態」という名詞として、主語・目的語・前置詞の後ろで使います。動詞 remember を修飾する位置には副詞 barely が必要です。',
    { pattern: 'the bareness of the room' },
  ),
  bared: valid(
    'bare（露出させる）の過去形・過去分詞として使います。動詞 remember の程度を表す位置には副詞 barely が必要です。',
    { pattern: 'The dog bared its teeth.' },
  ),
  became: valid(
    'become の過去形で、過去に「〜になった」と述べる肯定文で使います。did の後ろでは原形 become に戻します。',
    { pattern: 'The truth became public.' },
  ),
  'confidential data should': valid(
    '通常の平叙文で「機密データは〜すべきだ」と主語＋助動詞の語順にするときに使います。否定語句が文頭なら should を主語の前に出します。',
    { pattern: 'Confidential data should remain private.' },
  ),
  'despite promising': valid(
    'promising を動名詞として「約束したにもかかわらず」と表すときに使います。形容詞＋as の譲歩倒置とは別です。',
    { pattern: 'Despite promising to help, he left early.' },
  ),
  'difficulties to': valid(
    '複数名詞 difficulties を、後ろの不定詞が「克服すべき困難」のように説明するときに使います。have difficulty の定型は doing を取ります。',
    { pattern: 'We faced several difficulties to overcome.' },
  ),
  "doesn't": valid(
    '3人称単数主語の一般動詞を現在形で否定するときに使い、後ろの動詞は原形にします。',
    { pattern: "She doesn't open the door." },
  ),
  "don't know": valid(
    '主語を伴う I / you / we / they don’t know で「知らない」と述べます。分詞構文の否定は Not knowing ... にします。',
    { pattern: "I don't know the answer." },
  ),
  'earlier than': valid(
    '二つの時点を比べて「〜より早く」と表す比較表現として使います。',
    { pattern: 'The train arrived earlier than expected.' },
  ),
  'either one of': valid(
    '二つのうち「どちらか一方」を表し、後ろに複数名詞・代名詞、述語は単数扱いを置くときに使います。',
    { pattern: 'Either one of these keys will work.' },
  ),
  'for follow': invalid(
    '前置詞 for の後ろに動詞を置くなら動名詞 following にします。for follow とはしません。',
  ),
  'for hold': invalid(
    '用途を動作で表すなら前置詞 for の後ろを動名詞にして for holding とします。標準的な学習英語では for hold とはしません。',
  ),
  'for install': invalid(
    '前置詞 for の後ろに動詞を置くなら動名詞 installing にします。for install とはしません。',
  ),
  'for manage': invalid(
    '前置詞 for の後ろに動詞を置くなら動名詞 managing にします。for manage とはしません。',
  ),
  'for support': valid(
    'support を名詞「支援・支え」として使うときに for＋名詞で「支援のために」と表せます。',
    { pattern: 'Contact us for support.' },
  ),
  'for swimming': valid(
    '前置詞 for の後ろに動名詞を置き、用途を「泳ぐための」と説明するときに使います。',
    { pattern: 'This pool is for swimming.' },
  ),
  'for travel': valid(
    'travel を名詞として「旅行用に・旅行のために」と表すときに使います。動詞として目的語を続ける位置では使いません。',
    { pattern: 'This bag is useful for travel.' },
  ),
  'for understand': invalid(
    '前置詞 for の後ろに動詞を置くなら動名詞 understanding にします。for understand とはしません。',
  ),
  'for me': valid(
    '受益者・代理・評価の立場を「私のために・私にとって」と表すときに使います。到達先・受け手なら to me です。',
    { pattern: 'She bought a ticket for me.' },
  ),
  'to me': valid(
    '動作・物・言葉の到達先を「私に」と表すときに使います。受益者の「私のために」なら for me です。',
    { pattern: 'She showed the picture to me.' },
  ),
  'he did know': valid(
    '肯定を強調する通常語順で「彼は確かに知っていた」と述べるときに使います。否定語句が文頭なら did he know と倒置します。',
    { pattern: 'He did know the answer.' },
  ),
  'how much': valid(
    '不可算名詞の量・金額・程度を「どのくらい」とたずねるときに使います。可算名詞の個数は how many です。',
    { pattern: 'How much water do you need?' },
  ),
  'i did realize': valid(
    '肯定を強調する通常語順で「私は確かに気づいた」と述べるときに使います。否定語句の文頭化で倒置すると did I realize です。',
    { pattern: 'I did realize the truth.' },
  ),
  'if i am': valid(
    '現在・未来に実際に起こり得る条件を If＋現在形で述べるときに使います。事実に反する仮定なら If I were / Were I です。',
    { pattern: 'If I am free tomorrow, I will help.' },
  ),
  'if or': valid(
    'if と別の疑問詞を or で並べ、「〜か、またいつ…か」のように二つの未確定点を示すときには使えます。単純な二者択一は whether A or B です。',
    { pattern: "I don't know if or when he will return." },
  ),
  irrelevance: valid(
    '「無関係であること」という名詞として主語・目的語・前置詞の後ろで使います。be動詞の補語には形容詞 irrelevant を使います。',
    { pattern: 'the irrelevance of the detail' },
  ),
  'it accepts': valid(
    'it を主語とする現在形の節として、後ろに目的語などを伴って使います。受動の省略節 If accepted とは別です。',
    { pattern: 'It accepts card payments.' },
  ),
  justly: valid(
    '「正当に・公正に」という副詞として動詞や過去分詞を修飾するときに使います。',
    { pattern: 'She was justly praised.' },
  ),
  'let to': valid(
    '建物などを「人に貸す」という動詞 let の受動態で、借り手を to で示すときには使えます。使役の let＋人＋動詞原形では to を置きません。',
    { pattern: 'The apartment was let to a family.' },
  ),
  'may have': valid(
    'may have＋過去分詞で、過去について「〜したかもしれない」と推量するときに使います。',
    { pattern: 'She may have missed the train.' },
  ),
  'much of': valid(
    '不可算名詞や代名詞の前で「〜の多く」を表すときに使います。比較級を強めるなら much more＋形容詞です。',
    { pattern: 'Much of the work is finished.' },
  ),
  'no matter': valid(
    'no matter how / what / who ... の形で「どれほど・何が・誰が〜しても」と譲歩を表すときに使います。',
    { pattern: 'No matter how busy he is, he calls.' },
  ),
  'nor do': valid(
    '前の否定文に「〜もまた…ない」と同意し、Nor＋助動詞＋主語の倒置語順を作るときに使います。',
    { pattern: "I don't smoke, nor do my friends." },
  ),
  reservation: valid(
    '「予約・留保」という名詞として主語・目的語・前置詞の後ろで使います。受動態には過去分詞 reserved が必要です。',
    { pattern: 'I made a reservation.' },
  ),
  'since of': invalid(
    'since は前置詞・接続詞として名詞または節を直接取るため、of は続けません。',
  ),
  suggestion: valid(
    '「提案」という名詞として主語・目的語・前置詞の後ろで使います。文の述語には動詞 suggested などが必要です。',
    { pattern: 'They accepted her suggestion.' },
  ),
  'that be': valid(
    '要求・提案などに続く that 節で、that＋主語＋be の一部として仮定法現在を作るときに使います。',
    { pattern: 'They requested that he be careful.' },
  ),
  'that is': valid(
    '関係代名詞 that＋be動詞で名詞を説明するか、「つまり」の that is として使います。',
    { pattern: 'the book that is on the desk' },
  ),
  'that so': valid(
    'that が節を導き、その直後の so が形容詞・副詞・many / much を強めるときには使えます。前の動作を代用する定型は do so です。',
    { pattern: "I didn't know that so many people would come." },
  ),
  'that why': valid(
    'that が指示代名詞で、後ろの why 節を補語・説明としてたずねるときには使えます。接続詞を二つ重ねる形ではありません。',
    { pattern: 'Is that why you left early?' },
  ),
  'the most': valid(
    '最上級の形容詞・副詞の前、または「最も多く」の意味で使います。',
    { pattern: 'the most useful method' },
  ),
  'the noise did': valid(
    '通常語順で the noise を主語にし、did＋動詞原形で過去の肯定を強調するときに使えます。否定語句が文頭なら did the noise と倒置します。',
    { pattern: 'The noise did stop at midnight.' },
  ),
  'the policy did': valid(
    '通常語順で the policy を主語にし、did＋動詞原形で過去の肯定を強調するときに使えます。Not only が文頭なら did the policy と倒置します。',
    { pattern: 'The policy did fail.' },
  ),
  'the report will': valid(
    '通常の平叙文で主語＋will の語順を使うときの並びです。Not until などが文頭なら will を主語の前に出します。',
    { pattern: 'The report will be available next month.' },
  ),
  'the team could': valid(
    '通常の平叙文で主語＋could の語順を使うときの並びです。否定語句が文頭なら could を主語の前に出します。',
    { pattern: 'The team could leave after the storm.' },
  ),
  'the team did': valid(
    '通常語順で the team を主語にし、did＋動詞原形で過去の肯定を強調するときに使えます。Not until の後の主節では did the team と倒置します。',
    { pattern: 'The team did finish the analysis.' },
  ),
  'the way how': invalid(
    '標準的な学習英語では the way と how を重ねません。the way (that) ... または how ... のどちらかにします。',
  ),
  'there are': valid(
    '後ろの名詞が複数のときに「〜がある・いる」と表します。単数名詞には There is を使います。',
    { pattern: 'There are two cats outside.' },
  ),
  'they did learn': valid(
    'did で過去の肯定を強調する通常語順で「彼らは確かに知った」と述べるときに使います。Only 句が文頭なら did they learn と倒置します。',
    { pattern: 'They did learn the truth.' },
  ),
  'though tired': valid(
    '主語と be動詞を省いた譲歩節で「疲れていたけれど」と表すときに使います。',
    { pattern: 'Though tired, she kept working.' },
  ),
  'tired though': valid(
    '形容詞を前に出す譲歩倒置で Tired though＋主語＋be動詞の形を作るときに使います。',
    { pattern: 'Tired though she was, she kept working.' },
  ),
  till: valid(
    'ある時点まで動作・状態が続くことを「〜まで」と表します。締め切り時点までの完了は by を使います。',
    { pattern: 'I worked till Friday.' },
  ),
  'to rewrite': valid(
    'to不定詞として「書き直すこと・書き直すために」を表すときに使います。能動態の make＋人 の後ろでは to なしの原形です。',
    { pattern: 'The teacher asked us to rewrite it.' },
  ),
  'understood aya': valid(
    '主語の後ろで understood を述語、Aya を目的語にして「アヤを理解した」と述べる通常文なら使えます。倒置では助動詞を主語の前に置きます。',
    { pattern: 'I understood Aya.' },
  ),
  'learned they': valid(
    'learned の後ろで that を省いた内容節を置き、they をその節の主語にするときには使えます。直接疑問・倒置の語順ではありません。',
    { pattern: 'I learned they had already left.' },
  ),
  'realized i': valid(
    'realized の後ろで that を省いた内容節を置き、I をその節の主語にするときには使えます。倒置なら did I realize の語順です。',
    { pattern: 'Later, she realized I was right.' },
  ),
  'knew he': valid(
    'knew の後ろで that を省いた内容節を置き、he をその節の主語にするときには使えます。疑問・倒置で knew を直接主語の前には置きません。',
    { pattern: 'I knew he was ready.' },
  ),
  'very to': valid(
    'to the point「要を得た」が形容詞句として働き、それを very で強める very to the point では使えます。結果を表す不定詞へつなぐなら too＋形容詞＋to do です。',
    { pattern: 'Her answer was very to the point.' },
  ),
  'what did': valid(
    '過去の一般動詞を使う直接疑問文で What did＋主語＋動詞原形の形を作るときに使います。',
    { pattern: 'What did he say?' },
  ),
  'what is': valid(
    '「何が・何ですか」とたずねる直接疑問文で使います。間接疑問では what＋主語＋is の語順にします。',
    { pattern: 'What is this?' },
  ),
  'where is': valid(
    '場所をたずねる直接疑問文で Where is＋主語の語順にします。間接疑問では where＋主語＋is です。',
    { pattern: 'Where is the station?' },
  ),
  'whom is': valid(
    '人を目的語としてたずねる改まった直接疑問文で Whom is＋主語＋動詞ing などの形を作れます。',
    { pattern: 'Whom is she calling?' },
  ),
  whomever: valid(
    '「誰を〜しても」のように、節の中で目的語になる複合関係代名詞として使います。主語なら whoever です。',
    { pattern: 'Invite whomever you trust.' },
  ),
  'why did': valid(
    '過去の理由をたずねる直接疑問文で Why did＋主語＋動詞原形の形を作ります。間接疑問では why＋主語＋過去形です。',
    { pattern: 'Why did he leave?' },
  ),
  'you should': valid(
    '通常の平叙文で主語＋should の語順を使うときの並びです。否定語句が文頭なら should you と倒置します。',
    { pattern: 'You should keep it secret.' },
  ),
})

const INVALID_EXACT = Object.freeze({
  'are not have to': 'be動詞と have to をこの順では重ねません。「必要がない」は do not have to にします。',
  'do not has to': 'do not の後ろは動詞の原形なので has にはしません。do not have to にします。',
  'is have to': 'be動詞 is と have to をこの順では重ねません。主語が3人称単数なら has to にします。',
  'has checking': '義務を表す have to の代わりに has checking は使いません。has to＋原形にします。',
  'must to': '助動詞 must の直後に to は置きません。must＋動詞原形にします。',
  'can to': '助動詞 can の直後に to は置きません。can＋動詞原形にします。',
  'may to': '助動詞 may の直後に to は置きません。may＋動詞原形にします。',
  'should to': '助動詞 should の直後に to は置きません。should＋動詞原形にします。',
  'although of': 'although は接続詞なので of を続けません。although＋主語＋動詞、または despite＋名詞にします。',
  'whereas of': 'whereas は節をつなぐ接続詞なので of を続けません。whereas＋主語＋動詞にします。',
  'unless of': 'unless は条件節を導く接続詞なので of を続けません。unless＋主語＋動詞にします。',
  'before of': 'before は前置詞・接続詞としてそのまま名詞または節を取るため、before of にはしません。',
  'during of': 'during は前置詞として名詞を直接取るため、of を続けません。',
  'while of': 'while は接続詞として節を取るため、of を続けません。',
  'after to': 'after の後ろに動作を置くなら after＋動名詞、または after＋主語＋動詞にします。',
  'until to': 'until の後ろには時点を表す名詞か主語＋動詞の節を置き、to は続けません。',
  'so to': '目的を表すなら so as to＋原形、または so that＋節にします。so to だけでは使いません。',
  'over than': '比較対象の前に over than は使いません。通常は than、superior などの後ろなら to を使います。',
  'that whether': 'that と whether をこの順で重ねて名詞節を導くことはしません。内容なら that、可否なら whether を選びます。',
  'if or not': '「〜かどうか」は whether or not または whether / if＋節で表し、if or not を節の前には置きません。',
  'although of all': 'although は of を取らないため、このまとまりは使いません。although＋節、または despite all＋名詞にします。',
  'with despite': 'with と despite をこの順では重ねません。with＋名詞、または despite＋名詞を使います。',
  'not do': '一般動詞の現在形を否定するときは do not＋原形の語順にします。',
  'having accept': '完了分詞構文は having＋過去分詞なので、having accepted にします。',
  'being write': '受動の分詞構文は being written、完了受動なら having been written にします。',
  'relevant to not': '否定するなら not relevant to ... の語順にし、relevant to not とはしません。',
  'was look': 'be動詞 was の直後に動詞原形 look は置きません。過去形 looked か was looking などにします。',
  makeing: 'make の ing形は語末の e を取って making と綴ります。',
  momoing: '固有名詞 Momo に ing を付けたこの形は、標準的な語形としては使いません。',
  momoly: '固有名詞 Momo に ly を付けたこの形は、標準的な副詞としては使いません。',
  'to unlocked': '不定詞の to の後ろには動詞原形を置くため、過去分詞 unlocked は続けません。',
  unlockeding: 'unlocked にさらに ing を付けたこの形は使いません。進行形なら unlocking、状態なら unlocked です。',
  unlockedly: 'unlocked に ly を付けたこの形は、標準的な副詞としては使いません。',
  'only not': '時点までの否定を表して倒置を起こす形は Not until ... です。Only not にはしません。',
  'until not': '時点までの否定を表す語順は Not until ... です。Until not にはしません。',
  'since not': '時点までの否定を表す語順は Not until ... です。Since not にはしません。',
  'more large': 'large の通常の比較級は larger です。more large は標準的な比較級には使いません。',
  'more fast': 'fast の通常の比較級は faster です。more fast は標準的な比較級には使いません。',
  'more bright': 'bright の通常の比較級は brighter です。more bright は標準的な比較級には使いません。',
  'more heavy': 'heavy の通常の比較級は heavier です。more heavy は標準的な比較級には使いません。',
  'more long': 'long の通常の比較級は longer です。more long は標準的な比較級には使いません。',
  'more wide': 'wide の通常の比較級は wider です。more wide は標準的な比較級には使いません。',
  'more deep': 'deep の通常の比較級は deeper です。more deep は標準的な比較級には使いません。',
  'more high': 'high の通常の比較級は higher です。more high は標準的な比較級には使いません。',
  'more strong': 'strong の通常の比較級は stronger です。more strong は標準的な比較級には使いません。',
  'more tall': 'tall の通常の比較級は taller です。more tall は標準的な比較級には使いません。',
  'more thick': 'thick の通常の比較級は thicker です。more thick は標準的な比較級には使いません。',
  'more longer': '比較級 longer にさらに more は重ねません。longer だけを使います。',
  gooder: 'good の比較級は不規則変化して better です。gooder とはしません。',
  muchest: 'much / many の最上級は不規則変化して most です。muchest とはしません。',
  hopeing: 'hope の ing形は語末の e を取って hoping と綴ります。Hopeing とはしません。',
  almostly: 'almost 自体が副詞なので、さらに ly を付けた almostly は使いません。',
  studys: 'study の3単現は子音字＋yを i に変えて studies と綴ります。studys とはしません。',
  'having feel': '完了分詞構文は having＋過去分詞なので、having felt にします。having feel とはしません。',
  'am finish': 'be動詞 am の後ろに動詞原形 finish は置きません。進行なら am finishing、受動なら am finished などにします。',
  'knowing not': '分詞・動名詞を否定するときは not を前に置いて not knowing とします。Knowing not は標準的な学習語順にはしません。',
  'learned they': '通常文は they learned、倒置が必要なら did they learn とします。語彙動詞 learned を直接主語の前には置きません。',
  'realized i': '通常文は I realized、倒置が必要なら did I realize とします。語彙動詞 realized を直接主語の前には置きません。',
  'knew he': '通常文は he knew、倒置が必要なら did he know とします。語彙動詞 knew を直接主語の前には置きません。',
  brighting: 'bright はこの意味では形容詞です。動詞「明るくなる・明るくする」なら brighten / brightening を使い、brighting とはしません。',
  difficulting: 'difficult は形容詞なので ing を付けた difficulting という語形は使いません。',
  usefuling: 'useful は形容詞なので ing を付けた usefuling という語形は使いません。',
})

function shortComparisonForms(base) {
  if (/[^aeiou]y$/.test(base)) {
    return { comparative: `${base.slice(0, -1)}ier`, superlative: `${base.slice(0, -1)}iest` }
  }
  if (base.endsWith('e')) {
    return { comparative: `${base}r`, superlative: `${base}st` }
  }
  if (['big', 'hot', 'thin', 'fat', 'wet'].includes(base)) {
    return {
      comparative: `${base}${base.at(-1)}er`,
      superlative: `${base}${base.at(-1)}est`,
    }
  }
  return { comparative: `${base}er`, superlative: `${base}est` }
}

const SHORT_COMPARISON_BASES = new Set([
  'bright',
  'deep',
  'early',
  'fast',
  'heavy',
  'high',
  'large',
  'long',
  'old',
  'short',
  'small',
  'strong',
  'tall',
  'thick',
  'warm',
  'wide',
  'young',
])

function restrictedShortComparisonGuide(choice) {
  const normalized = normalizeChoice(choice)
  const match = normalized.match(/^(more|most) ([a-z]+)$/)
  if (!match || !SHORT_COMPARISON_BASES.has(match[2])) return null
  const [, degree, base] = match
  const forms = shortComparisonForms(base)
  if (degree === 'more') {
    return valid(
      `普通に程度を比べるなら ${forms.comparative} を使います。ただし「より〜というより…」と性質を対照する more ${base} than ... では使えます。`,
      { pattern: `more ${base} than ...`, source: 'comparison-rule' },
    )
  }
  return valid(
    `普通の最上級なら ${forms.superlative} を使います。ただし the を付けず、改まった調子で「とても〜」と強める most ${base} では使えます。`,
    { pattern: `a most ${base} + 名詞`, source: 'comparison-rule' },
  )
}

function invalidSpellingGuide(item, choice) {
  const normalized = normalizeChoice(choice)
  const answer = normalizeChoice(item?.answer)
  const choices = (item?.choices ?? []).map(normalizeChoice)
  const pluralQuestion = item?.topic === '名詞の複数形'

  if (pluralQuestion && normalized === `${answer}es`) {
    return invalid(`複数形「${item.answer}」にさらに es は付けません。`)
  }

  const pluralPairs = [
    ['box', 'boxes'],
    ['city', 'cities'],
    ['knife', 'knives'],
    ['child', 'children'],
    ['woman', 'women'],
    ['man', 'men'],
    ['leaf', 'leaves'],
    ['watch', 'watches'],
    ['bus', 'buses'],
    ['baby', 'babies'],
    ['foot', 'feet'],
    ['tooth', 'teeth'],
  ]
  for (const [singular, plural] of pluralPairs) {
    if (!pluralQuestion || answer !== plural || !choices.includes(singular)) continue
    if (normalized !== singular) {
      return invalid(`「${singular}」の複数形は ${plural} です。「${choice}」という複数形は使いません。`)
    }
  }

  const longAdjective = choices.find((candidate) =>
    candidate !== normalized
    && (answer === `more ${candidate}` || answer === `most ${candidate}`))
  if (
    longAdjective
    && (normalized === `${longAdjective}er` || normalized === `${longAdjective}est`)
  ) {
    return invalid(
      `長い形容詞「${longAdjective}」は通常 -er / -est を直接付けず、more / most ${longAdjective} とします。`,
    )
  }

  const shortComparativeBase = choices.find((candidate) =>
    Object.values(shortComparisonForms(candidate)).includes(answer))
  if (
    shortComparativeBase
    && (normalized === `more ${shortComparativeBase}` || normalized === `most ${shortComparativeBase}`)
  ) {
    if (normalized.startsWith('more ')) {
      return valid(
        `普通に程度を比べるなら ${shortComparisonForms(shortComparativeBase).comparative} を使います。ただし「より〜というより…」と性質を対照する more ${shortComparativeBase} than ... では使えます。`,
        {
          pattern: `more ${shortComparativeBase} than ...`,
          source: 'comparison-rule',
        },
      )
    }
    return valid(
      `普通の最上級なら ${shortComparisonForms(shortComparativeBase).superlative} を使います。ただし the を付けず、改まった調子で「とても〜」と強める most ${shortComparativeBase} では使えます。`,
      {
        pattern: `a most ${shortComparativeBase} + 名詞`,
        source: 'comparison-rule',
      },
    )
  }

  return null
}

const IRREGULAR_VERB_FORMS = Object.freeze({
  be: { past: ['was', 'were'], pp: 'been', ing: 'being', third: 'is' },
  begin: { past: 'began', pp: 'begun', ing: 'beginning', third: 'begins' },
  buy: { past: 'bought', pp: 'bought', ing: 'buying', third: 'buys' },
  choose: { past: 'chose', pp: 'chosen', ing: 'choosing', third: 'chooses' },
  cut: { past: 'cut', pp: 'cut', ing: 'cutting', third: 'cuts' },
  do: { past: 'did', pp: 'done', ing: 'doing', third: 'does' },
  draw: { past: 'drew', pp: 'drawn', ing: 'drawing', third: 'draws' },
  drink: { past: 'drank', pp: 'drunk', ing: 'drinking', third: 'drinks' },
  drive: { past: 'drove', pp: 'driven', ing: 'driving', third: 'drives' },
  feel: { past: 'felt', pp: 'felt', ing: 'feeling', third: 'feels' },
  forbid: { past: 'forbade', pp: 'forbidden', ing: 'forbidding', third: 'forbids' },
  get: { past: 'got', pp: 'gotten', ing: 'getting', third: 'gets' },
  give: { past: 'gave', pp: 'given', ing: 'giving', third: 'gives' },
  go: { past: 'went', pp: 'gone', ing: 'going', third: 'goes' },
  have: { past: 'had', pp: 'had', ing: 'having', third: 'has' },
  hear: { past: 'heard', pp: 'heard', ing: 'hearing', third: 'hears' },
  know: { past: 'knew', pp: 'known', ing: 'knowing', third: 'knows' },
  meet: { past: 'met', pp: 'met', ing: 'meeting', third: 'meets' },
  read: { past: 'read', pp: 'read', ing: 'reading', third: 'reads' },
  permit: { past: 'permitted', pp: 'permitted', ing: 'permitting', third: 'permits' },
  plan: { past: 'planned', pp: 'planned', ing: 'planning', third: 'plans' },
  reset: { past: 'reset', pp: 'reset', ing: 'resetting', third: 'resets' },
  rewrite: { past: 'rewrote', pp: 'rewritten', ing: 'rewriting', third: 'rewrites' },
  run: { past: 'ran', pp: 'run', ing: 'running', third: 'runs' },
  see: { past: 'saw', pp: 'seen', ing: 'seeing', third: 'sees' },
  sleep: { past: 'slept', pp: 'slept', ing: 'sleeping', third: 'sleeps' },
  speak: { past: 'spoke', pp: 'spoken', ing: 'speaking', third: 'speaks' },
  stand: { past: 'stood', pp: 'stood', ing: 'standing', third: 'stands' },
  stop: { past: 'stopped', pp: 'stopped', ing: 'stopping', third: 'stops' },
  swim: { past: 'swam', pp: 'swum', ing: 'swimming', third: 'swims' },
  take: { past: 'took', pp: 'taken', ing: 'taking', third: 'takes' },
  teach: { past: 'taught', pp: 'taught', ing: 'teaching', third: 'teaches' },
  write: { past: 'wrote', pp: 'written', ing: 'writing', third: 'writes' },
})

function regularVerbForms(base) {
  const third = /[^aeiou]y$/.test(base)
    ? `${base.slice(0, -1)}ies`
    : /(s|sh|ch|x|z|o)$/.test(base)
      ? `${base}es`
      : `${base}s`
  const past = /[^aeiou]y$/.test(base)
    ? `${base.slice(0, -1)}ied`
    : base.endsWith('e')
      ? `${base}d`
      : `${base}ed`
  const ing = base.endsWith('ie')
    ? `${base.slice(0, -2)}ying`
    : base.endsWith('e') && !base.endsWith('ee')
      ? `${base.slice(0, -1)}ing`
      : `${base}ing`
  return { third, past, pp: past, ing }
}

function verbForms(base) {
  return { ...regularVerbForms(base), ...IRREGULAR_VERB_FORMS[base] }
}

function replaceFirstWord(phrase, replacement) {
  const [, tail = ''] = phrase.match(/^\S+(.*)$/) ?? []
  return `${replacement}${tail}`
}

function structuralVerbGuide(item, choice) {
  const normalized = normalizeChoice(choice)
  const choices = (item?.choices ?? []).map(normalizeChoice)
  const toChoice = choices.find((candidate) => /^to [a-z]+(?: [a-z]+)*$/.test(candidate))
  const explicitBase = choices.find((candidate) =>
    /^[a-z]+(?: [a-z]+)*$/.test(candidate)
    && choices.some((other) => normalizeChoice(other).startsWith(`to ${candidate}`)))
  const modalBases = choices
    .map((candidate) =>
      candidate.match(/^(?:will|would|can|could|may|might|must|shall|should) (.+)$/)?.[1])
    .filter(Boolean)
  const modalBase = modalBases.find(
    (candidate) => modalBases.filter((other) => other === candidate).length >= 2,
  )
  const inferredBase = choices
    .filter((candidate) => /^[a-z]+(?: [a-z]+)*$/.test(candidate))
    .map((candidate) => {
      const [candidateWord] = candidate.split(' ')
      const forms = verbForms(candidateWord)
      const variants = new Set([
        candidate,
        replaceFirstWord(candidate, forms.third),
        replaceFirstWord(candidate, forms.past),
        replaceFirstWord(candidate, forms.pp),
        replaceFirstWord(candidate, forms.ing),
      ])
      const matches = choices.filter(
        (other) => variants.has(other) || variants.has(other.replace(/^to /, '')),
      ).length
      return { candidate, matches }
    })
    .sort((a, b) => b.matches - a.matches)[0]
  const inferredBasePhrase = inferredBase?.matches >= 3 ? inferredBase.candidate : null
  const basePhrase = inferredBasePhrase ?? explicitBase ?? modalBase ?? toChoice?.slice(3)
  if (!basePhrase) return null

  const [baseWord] = basePhrase.split(' ')
  const forms = verbForms(baseWord)
  const variants = {
    base: basePhrase,
    third: replaceFirstWord(basePhrase, forms.third),
    past: replaceFirstWord(basePhrase, forms.past),
    pp: replaceFirstWord(basePhrase, forms.pp),
    ing: replaceFirstWord(basePhrase, forms.ing),
  }

  if (normalized === variants.base) {
    return valid(
      '動詞原形として、I / you / 複数主語の現在形、助動詞・do / does / did・to の後ろ、命令文などで使います。',
      { pattern: `${choice}（動詞原形）`, source: 'structure-rule' },
    )
  }
  if (normalized === variants.third) {
    return valid(
      '一般動詞の現在形で、主語が he / she / it や単数名詞などの3人称単数のときに使います。',
      { pattern: `he / she / it + ${choice}`, source: 'structure-rule' },
    )
  }
  if (normalized === variants.past || normalized === variants.pp) {
    return valid(
      '過去形なら過去の肯定文で、過去分詞なら have / be などの後ろで完了・受動を作るときに使います。',
      { pattern: `${choice}（過去形・過去分詞）`, source: 'structure-rule' },
    )
  }
  if (normalized === variants.ing) {
    return valid(
      '動詞の ing形として、be動詞の後ろで進行を表すか、動名詞として主語・目的語・前置詞の後ろに置くときに使います。',
      { pattern: `be + ${choice} / 前置詞 + ${choice}`, source: 'structure-rule' },
    )
  }
  if (normalized === `for ${variants.ing}`) {
    return valid(
      'for を前置詞として、用途・理由を動名詞で「〜するための」と説明するときに使います。',
      { pattern: `for ${variants.ing}`, source: 'structure-rule' },
    )
  }
  if (normalized === `to ${variants.ing}`) {
    return valid(
      'to が前置詞になる表現の後ろで、動名詞として使えます。不定詞の to の後ろなら動詞原形にします。',
      { pattern: `look forward to ${variants.ing}`, source: 'structure-rule' },
    )
  }
  if (normalized === `to ${variants.base}`) {
    return valid(
      'to＋動詞原形の不定詞として、目的・希望・予定などを表すときに使います。',
      { pattern: `to ${variants.base}`, source: 'structure-rule' },
    )
  }
  if (normalized === `to ${variants.past}` || normalized === `to ${variants.pp}`) {
    return invalid(
      `不定詞の to の後ろには動詞原形「${basePhrase}」を置きます。「${choice}」の過去形・過去分詞部分は、過去の肯定文や have / be の後ろなどで使います。`,
      { source: 'invalid-rule' },
    )
  }
  return null
}

function comparisonGuide(item, choice) {
  const normalized = normalizeChoice(choice)
  const validMoreForms = new Set([
    'more interesting',
    'more beautiful',
    'more clearly',
    'more highly',
    'more loudly',
    'more strongly',
  ])
  if (normalized.startsWith('more ')) {
    if (!validMoreForms.has(normalized)) return null
    return valid(
      '長めの形容詞・副詞の比較級として、二つを比べるときに使います。',
      { pattern: `${choice} than ...`, source: 'comparison-rule' },
    )
  }
  if (normalized.startsWith('most ')) {
    return valid(
      '長めの形容詞・副詞の最上級として、三つ以上の中で最も〜と述べるときに使います。',
      { pattern: `the ${choice}`, source: 'comparison-rule' },
    )
  }
  return null
}

function candidateScore(item, candidate) {
  let score = 0
  if (candidate.level === item.level && candidate.topic === item.topic) score += 1_000
  else if (candidate.level === item.level) score += 500
  const itemLevel = LEVEL_ORDER[item.level] ?? 0
  const candidateLevel = LEVEL_ORDER[candidate.level] ?? itemLevel
  score -= Math.abs(candidateLevel - itemLevel) * 20
  if (candidateLevel <= itemLevel) score += 10
  score -= candidate.sentence.en.length / 100
  return score
}

function corpusGuide(item, choice, answerIndex) {
  const candidates = answerIndex.get(normalizeChoice(choice)) ?? []
  const candidate = candidates
    .filter((entry) => entry.id !== item.id)
    .sort((a, b) => candidateScore(item, b) - candidateScore(item, a))[0]
  if (!candidate) return null
  return valid(candidate.explain, {
    example: {
      en: candidate.sentence.en,
      ja: candidate.sentence.ja,
    },
    source: 'grammar-corpus',
    referenceId: candidate.id,
  })
}

function vocabularyGuide(choice, wordsByText) {
  const word = wordsByText.get(normalizeChoice(choice))
  if (!word) return null
  const usage = word.usage?.trim() ? ` ${word.usage.trim()}` : ''
  return valid(
    `${POS_USAGE[word.pos] ?? '独立した語として使います。'} 主な意味は「${word.meaning}」です。${usage}`.trim(),
    {
      example: word.example?.en
        ? { en: word.example.en, ja: word.example.ja ?? '' }
        : undefined,
      source: 'vocabulary',
      referenceId: word.id,
    },
  )
}

function wordCandidatesFromText(text, wordsByText) {
  const candidates = []
  for (const token of normalizeChoice(text).match(/[a-z]+(?:'[a-z]+)?/g) ?? []) {
    const forms = new Set([token])
    if (token.endsWith('ies')) forms.add(`${token.slice(0, -3)}y`)
    if (token.endsWith('ied')) forms.add(`${token.slice(0, -3)}y`)
    if (token.endsWith('es')) {
      forms.add(token.slice(0, -1))
      forms.add(token.slice(0, -2))
    }
    if (token.endsWith('s')) forms.add(token.slice(0, -1))
    if (token.endsWith('ed')) {
      forms.add(token.slice(0, -1))
      forms.add(token.slice(0, -2))
      const withoutEd = token.slice(0, -2)
      if (withoutEd.at(-1) === withoutEd.at(-2)) forms.add(withoutEd.slice(0, -1))
    }
    if (token.endsWith('ing')) {
      const withoutIng = token.slice(0, -3)
      forms.add(withoutIng)
      forms.add(`${withoutIng}e`)
      if (withoutIng.at(-1) === withoutIng.at(-2)) forms.add(withoutIng.slice(0, -1))
    }
    for (const form of forms) {
      const word = wordsByText.get(form)
      if (word) candidates.push(word)
    }
  }
  return candidates
}

function findSiblingWords(item, choice, wordsByText) {
  const normalizedChoice = normalizeChoice(choice)
  const siblingWords = wordCandidatesFromText(choice, wordsByText)
  for (const sibling of item.choices ?? []) {
    if (normalizeChoice(sibling) === normalizedChoice) continue
    const normalizedSibling = normalizeChoice(sibling)
    const direct = wordsByText.get(normalizedSibling)
    if (direct) siblingWords.push(direct)
    siblingWords.push(...wordCandidatesFromText(normalizedSibling, wordsByText))
  }
  return [...new Map(siblingWords.map((word) => [word.id, word])).values()]
}

function matchesForm(word, form) {
  return (Array.isArray(form) ? form : [form]).some(
    (candidate) => normalizeChoice(candidate) === normalizeChoice(word),
  )
}

function verbFormGuide(choice, lemma) {
  const normalized = normalizeChoice(choice)
  const base = normalizeChoice(lemma.word)
  const forms = verbForms(base)
  const [first = '', second = ''] = normalized.split(' ')
  const modalMatch = normalized.match(
    /^(will|would|can|could|may|might|must|shall|should) (.+)$/,
  )

  if (modalMatch) {
    const [, modal, rest] = modalMatch
    const [restFirst = '', restSecond = ''] = rest.split(' ')
    const simple = restFirst === base
    const passive = restFirst === 'be' && matchesForm(restSecond, forms.pp)
    const perfect = restFirst === 'have' && matchesForm(restSecond, forms.pp)
    if (simple || passive || perfect) {
      const summary = modal === 'will'
        ? 'will の後ろに動詞原形を置き、未来の予測・意志を表すときに使います。'
        : modal === 'would'
          ? 'would の後ろに動詞原形を置き、仮定した結果・過去から見た未来・控えめな意向などを表すときに使います。'
          : `${modal} の後ろに動詞原形を置いて、その助動詞の意味を加えるときに使います。`
      return valid(summary, {
        pattern: `主語 + ${choice}`,
        source: 'form-rule',
        referenceId: lemma.id,
      })
    }
  }

  if (normalized.startsWith('to ')) {
    const rest = normalized.slice(3)
    const [restFirst = '', restSecond = ''] = rest.split(' ')
    if (restFirst === base) {
      return valid(
        'to＋動詞原形の不定詞として、目的・希望・予定や「どのように〜するか」などを表すときに使います。',
        { pattern: choice, source: 'form-rule', referenceId: lemma.id },
      )
    }
    if (matchesForm(restFirst, forms.ing)) {
      return valid(
        'to が前置詞になる表現の後ろで、動名詞として使えます。不定詞の to なら後ろは動詞原形です。',
        { pattern: `look forward to ${rest}`, source: 'form-rule', referenceId: lemma.id },
      )
    }
    if (restFirst === 'be' && matchesForm(restSecond, forms.pp)) {
      return valid(
        'to be＋過去分詞の受動不定詞として、「〜されること・〜されるために」を表すときに使います。',
        { pattern: choice, source: 'form-rule', referenceId: lemma.id },
      )
    }
    if (restFirst === 'have' && matchesForm(restSecond, forms.pp)) {
      return valid(
        'to have＋過去分詞の完了不定詞として、主節の動詞より前の出来事を表すときに使います。',
        { pattern: choice, source: 'form-rule', referenceId: lemma.id },
      )
    }
  }

  if (/^(have|has|had) /.test(normalized) && matchesForm(second, forms.pp)) {
    return valid(
      'have / has / had＋過去分詞の完了形として、基準時までの経験・完了・継続を表すときに使います。',
      { pattern: choice, source: 'form-rule', referenceId: lemma.id },
    )
  }

  if (
    /^(am|is|are|was|were|be|been|being) /.test(normalized)
    && (matchesForm(second, forms.ing) || matchesForm(second, forms.pp))
  ) {
    return valid(
      matchesForm(second, forms.ing)
        ? 'be動詞＋動詞ingの進行形として、ある時点で進行中の動作を表すときに使います。'
        : 'be動詞＋過去分詞の受動態として、主語が動作を受けることを表すときに使います。',
      { pattern: choice, source: 'form-rule', referenceId: lemma.id },
    )
  }

  const doSupport = normalized.match(/^(do|does|did)(?: not)? (.+)$/)
  if (doSupport && doSupport[2].split(' ')[0] === base) {
    return valid(
      'do / does / did（またはその否定形）の後ろに動詞原形を置き、疑問・否定・強調を作るときに使います。',
      { pattern: choice, source: 'form-rule', referenceId: lemma.id },
    )
  }

  if (matchesForm(first, forms.ing)) {
    return valid(
      '動詞の ing形として、be動詞の後ろで進行を表すか、動名詞として主語・目的語・前置詞の後ろに置くときに使います。',
      { pattern: `be + ${choice} / 前置詞 + ${choice}`, source: 'form-rule', referenceId: lemma.id },
    )
  }
  if (matchesForm(first, forms.past) || matchesForm(first, forms.pp)) {
    return valid(
      '過去形なら過去の肯定文で、過去分詞なら have / be などの後ろで完了・受動を作るときに使います。',
      { pattern: `${choice}（過去形・過去分詞）`, source: 'form-rule', referenceId: lemma.id },
    )
  }
  if (matchesForm(first, forms.third)) {
    return valid(
      '一般動詞の現在形で、主語が he / she / it や単数名詞などの3人称単数のときに使います。',
      { pattern: `he / she / it + ${choice}`, source: 'form-rule', referenceId: lemma.id },
    )
  }
  if (normalized === base || normalized.startsWith(`${base} `)) {
    return valid(
      '動詞の原形として、I / you / 複数主語の現在形、助動詞・do / does / did・to の後ろ、命令文などで使います。',
      { pattern: `${choice}（動詞原形）`, source: 'form-rule', referenceId: lemma.id },
    )
  }
  return null
}

const IRREGULAR_COMPARISON_FORMS = Object.freeze({
  bad: { comparative: ['worse'], superlative: ['worst'] },
  far: { comparative: ['farther', 'further'], superlative: ['farthest', 'furthest'] },
  good: { comparative: ['better'], superlative: ['best'] },
  little: { comparative: ['less'], superlative: ['least'] },
  many: { comparative: ['more'], superlative: ['most'] },
  much: { comparative: ['more'], superlative: ['most'] },
  well: { comparative: ['better'], superlative: ['best'] },
})

function adjectiveFormGuide(choice, lemma) {
  const normalized = normalizeChoice(choice)
  const base = normalizeChoice(lemma.word)
  const comparison = IRREGULAR_COMPARISON_FORMS[base] ?? shortComparisonForms(base)
  if (normalized === `more ${base}`) {
    return valid(
      '長めの形容詞・副詞を使って二つを比べる比較級で使います。',
      { pattern: `more ${base} than ...`, source: 'form-rule', referenceId: lemma.id },
    )
  }
  if (normalized === `most ${base}`) {
    return valid(
      '長めの形容詞・副詞で、三つ以上の中の最上級を表すときに使います。',
      { pattern: `the most ${base}`, source: 'form-rule', referenceId: lemma.id },
    )
  }
  if (matchesForm(normalized, comparison.comparative)) {
    return valid(
      '短い形容詞・副詞の比較級として、二つを比べるときに使います。',
      { pattern: `${choice} than ...`, source: 'form-rule', referenceId: lemma.id },
    )
  }
  if (matchesForm(normalized, comparison.superlative)) {
    return valid(
      '短い形容詞・副詞の最上級として、三つ以上の中で最も〜と述べるときに使います。',
      { pattern: `the ${choice}`, source: 'form-rule', referenceId: lemma.id },
    )
  }
  const adverb = base.endsWith('y')
    ? `${base.slice(0, -1)}ily`
    : base.endsWith('le')
      ? `${base.slice(0, -1)}y`
      : `${base}ly`
  if (normalized === adverb) {
    return valid(
      '副詞として動詞・形容詞・文全体を修飾するときに使います。名詞や目的語の状態を説明する補語には形容詞を使います。',
      { pattern: `${choice} + 動詞 / 動詞 + ${choice}`, source: 'form-rule', referenceId: lemma.id },
    )
  }
  if (normalized === `to ${base}`) {
    return valid(
      `to が不定詞ではなく、変化・範囲の到達点を表す前置詞で、形容詞「${base}」を状態として置くときには使えます。不定詞の to の後ろには動詞原形が必要です。`,
      {
        pattern: `from ... to ${base}`,
        source: 'form-rule',
        referenceId: lemma.id,
      },
    )
  }
  if (normalized === `${base}ing`) {
    return invalid(
      `形容詞「${base}」にそのまま ing を付けた「${choice}」は標準的な語形として使いません。`,
      { source: 'invalid-rule' },
    )
  }
  return null
}

function nounFormGuide(choice, lemma) {
  const normalized = normalizeChoice(choice)
  const base = normalizeChoice(lemma.word)
  if (normalized === `to ${base}`) {
    return valid(
      'to を方向・到達点・相手を表す前置詞として、その後ろに名詞を置くときに使います。',
      { pattern: `to ${base}`, source: 'form-rule', referenceId: lemma.id },
    )
  }
  if (/['’]s?$/.test(String(choice).trim())) {
    return valid(
      '所有格として、後ろの名詞が「〜のもの」であることを表すときに使います。',
      { pattern: `${choice} + 名詞`, source: 'form-rule', referenceId: lemma.id },
    )
  }
  return null
}

function siblingGuide(item, choice, wordsByText) {
  const lemmas = findSiblingWords(item, choice, wordsByText)
  for (const lemma of lemmas.filter((candidate) => candidate.pos === '動')) {
    const form = verbFormGuide(choice, lemma)
    if (form) return form
  }
  for (const lemma of lemmas.filter((candidate) => ['形', '副'].includes(candidate.pos))) {
    const form = adjectiveFormGuide(choice, lemma)
    if (form) return form
  }
  for (const lemma of lemmas.filter((candidate) => candidate.pos === '名')) {
    const form = nounFormGuide(choice, lemma)
    if (form) return form
  }
  return null
}

function tagQuestionGuide(choice) {
  const normalized = normalizeChoice(choice)
  if (!/^(?:am|are|is|was|were|do|does|did|have|has|had|will|would|can|could|shall|should|must)(?:n't| not)? (?:i|you|he|she|it|we|they)$/.test(normalized)) {
    return null
  }
  const negative = normalized.includes("n't") || normalized.includes(' not ')
  return valid(
    `付加疑問として、本文と同じ助動詞・be動詞と対応する代名詞を使い、本文が${negative ? '肯定なら否定形' : '否定なら肯定形'}にするときに使います。`,
    { pattern: `..., ${choice}?`, source: 'tag-question-rule' },
  )
}

function clauseOrderGuide(choice) {
  const normalized = normalizeChoice(choice)
  if (/^(?:i|you|he|she|it|we|they|aya|the result|the story) (?:am|are|is|was|were|do|does|did|have|has|had|will|would|can|could|learned|knew|realized)$/.test(normalized)) {
    return valid(
      '主語＋動詞の平叙文語順として、通常の文や間接疑問の中で使います。倒置を起こす表現の直後では助動詞・be動詞を主語の前に出します。',
      { pattern: choice, source: 'clause-order-rule' },
    )
  }
  if (/^(?:did|was|were|is|are|have|has|had|will|would|can|could) (?:i|you|he|she|it|we|they|aya|the result|the story)$/.test(normalized)) {
    return valid(
      '助動詞・be動詞＋主語の倒置語順として、直接疑問文や、否定語句・only などで倒置が必要な主節に使います。',
      { pattern: choice, source: 'clause-order-rule' },
    )
  }
  return null
}

export function createGrammarChoiceGuidance(allItems) {
  const answerIndex = new Map()
  for (const item of allItems) {
    const key = normalizeChoice(item.answer)
    const candidates = answerIndex.get(key) ?? []
    candidates.push(item)
    answerIndex.set(key, candidates)
  }

  const wordsByText = new Map()
  for (const word of ALL_WORDS) {
    const key = normalizeChoice(word.word)
    if (!wordsByText.has(key)) wordsByText.set(key, word)
  }

  return (item, choice) => {
    if (!item || choice == null || choice === item.answer) return null
    const normalized = normalizeChoice(choice)

    const special = SPECIAL_GUIDES[normalized]
    if (special) return { ...special, source: special.source ?? 'special-rule' }

    const restrictedComparison = restrictedShortComparisonGuide(choice)
    if (restrictedComparison) return restrictedComparison

    const spelling = invalidSpellingGuide(item, choice)
    if (spelling) return { source: 'invalid-rule', ...spelling }

    const exactInvalid = INVALID_EXACT[normalized]
    if (exactInvalid) return invalid(exactInvalid, { source: 'invalid-rule' })

    const fromCorpus = corpusGuide(item, choice, answerIndex)
    if (fromCorpus) return fromCorpus

    const structural = structuralVerbGuide(item, choice)
    if (structural) return structural

    const comparison = comparisonGuide(item, choice)
    if (comparison) return comparison

    const tag = tagQuestionGuide(choice)
    if (tag) return tag

    const order = clauseOrderGuide(choice)
    if (order) return order

    const fromVocabulary = vocabularyGuide(choice, wordsByText)
    if (fromVocabulary) return fromVocabulary

    const fromSibling = siblingGuide(item, choice, wordsByText)
    if (fromSibling) return fromSibling

    return guide(
      'unresolved',
      `「${choice}」の使う場面を特定できません。教材データに個別ガイドを追加してください。`,
      { source: 'unresolved' },
    )
  }
}
