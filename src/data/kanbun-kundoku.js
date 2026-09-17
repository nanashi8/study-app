import { orderForStudy } from '../lib/studyOrder.js'

export const KANBUN_KUNDOKU_LEVELS = Object.freeze([
  { id: 'middle', label: 'レ点・一二点', color: '#0f766e' },
  { id: 'basic', label: '上下点・置き字', color: '#0369a1' },
  { id: 'standard', label: '複合返り・句法', color: '#4f46e5' },
  { id: 'advanced', label: '甲乙点・長文', color: '#7e22ce' },
  { id: 'elite', label: '最難関・複合構造', color: '#be123c' },
])

const freezeExercise = (exercise) => Object.freeze({
  ...exercise,
  tokens: Object.freeze(exercise.tokens.map((token) => Object.freeze(token))),
  order: Object.freeze(exercise.order),
})

export const KANBUN_KUNDOKU_EXERCISES = Object.freeze([
  freezeExercise({
    id: 'kk001', level: 'middle', title: 'レ点：二字の小返り',
    marked: '読ム㆑書ヲ。', tokens: [{ id: 'read', label: '読' }, { id: 'book', label: '書' }], order: ['book', 'read'],
    kakikudashi: '書を読む。', translation: '本を読む。',
    clue: 'レ点の付いた「読」を保留し、すぐ下の「書」を先に読む。',
    pitfall: '上から「読む・書」と読まず、二字だけを入れ替える。',
  }),
  freezeExercise({
    id: 'kk002', level: 'middle', title: 'レ点：否定',
    marked: '不㆑知ラ。', tokens: [{ id: 'not', label: '不' }, { id: 'know', label: '知' }], order: ['know', 'not'],
    kakikudashi: '知らず。', translation: '知らない。',
    clue: '「不」は後ろの動詞「知」を読んでから「ず」と返る。',
    pitfall: '「不知」を音読みの熟語として終えず、文語の否定へ直す。',
  }),
  freezeExercise({
    id: 'kk003', level: 'middle', title: 'レ点：目的語',
    marked: '愛ス㆑人ヲ。', tokens: [{ id: 'love', label: '愛' }, { id: 'people', label: '人' }], order: ['people', 'love'],
    kakikudashi: '人を愛す。', translation: '他者を大切にする。',
    clue: '下の「人」を目的語「人を」として先に読む。',
    pitfall: '「人が愛する」と主語・目的語を逆にしない。',
  }),
  freezeExercise({
    id: 'kk004', level: 'middle', title: 'レ点の連続',
    marked: '不㆑可カラ㆑忘ル。', tokens: [{ id: 'not', label: '不' }, { id: 'can', label: '可' }, { id: 'forget', label: '忘' }], order: ['forget', 'can', 'not'],
    kakikudashi: '忘るべからず。', translation: '忘れてはならない。',
    clue: '最も下の「忘」から、可、不へ一字ずつ戻る。',
    pitfall: '「忘れられない」と不可能に固定せず、規範文では禁止と判断する。',
  }),
  freezeExercise({
    id: 'kk005', level: 'middle', title: '一二点：遠くへ返る',
    marked: '学ブ㆓於師ニ㆒。', tokens: [{ id: 'learn', label: '学' }, { id: 'at', label: '於' }, { id: 'teacher', label: '師' }], order: ['teacher', 'at', 'learn'],
    kakikudashi: '師に学ぶ。', translation: '先生から学ぶ。',
    clue: '一点の「師」を読み、置き字「於」を助詞「に」として補って、二点の「学」へ返る。',
    pitfall: '「二→一」の数字順ではなく、一点を先に読んで二点へ戻る。',
  }),
  freezeExercise({
    id: 'kk006', level: 'middle', title: '一二点：三字目的語',
    marked: '読ム㆓古書ヲ㆒。', tokens: [{ id: 'read', label: '読' }, { id: 'old', label: '古' }, { id: 'book', label: '書' }], order: ['old', 'book', 'read'],
    kakikudashi: '古書を読む。', translation: '古い書物を読む。',
    clue: '一点側の名詞句「古書」をまとめてから、二点の動詞へ戻る。',
    pitfall: '「古」と「書」を返り点のために逆転させない。名詞句の内部は原順。',
  }),
  freezeExercise({
    id: 'kk007', level: 'middle', title: '一二点：人物と動作',
    marked: '問フ㆓道ヲ於師ニ㆒。', tokens: [{ id: 'ask', label: '問' }, { id: 'way', label: '道' }, { id: 'at', label: '於' }, { id: 'teacher', label: '師' }], order: ['way', 'teacher', 'at', 'ask'],
    kakikudashi: '道を師に問ふ。', translation: '道理を先生に尋ねる。',
    clue: '目的語「道を」と相手「師に」を先に置き、最後に動詞「問ふ」。',
    pitfall: '「師を道に問う」と格関係を入れ替えない。',
  }),
  freezeExercise({
    id: 'kk008', level: 'middle', title: '返読文字「可」',
    marked: '此ノ事可シ㆑行フ。', tokens: [{ id: 'this', label: '此' }, { id: 'matter', label: '事' }, { id: 'can', label: '可' }, { id: 'do', label: '行' }], order: ['this', 'matter', 'do', 'can'],
    kakikudashi: '此の事行ふべし。', translation: 'このことは実行できる。',
    clue: '主語「此事」は先に読み、「行」から「可」へ返って「行ふべし」。',
    pitfall: '可を先に「可能」と音読しない。',
  }),
  freezeExercise({
    id: 'kk009', level: 'middle', title: '再読文字「未」',
    marked: '未ダ〈ズ〉㆑見㆓其ノ人ヲ㆒。', tokens: [{ id: 'notyet1', label: '未①' }, { id: 'see', label: '見' }, { id: 'that', label: '其' }, { id: 'person', label: '人' }, { id: 'notyet2', label: '未②' }], order: ['notyet1', 'that', 'person', 'see', 'notyet2'],
    kakikudashi: '未だ其の人を見ず。', translation: 'まだその人に会っていない。',
    clue: '再読文字は「未だ」を先に読み、目的語と動詞の後で「ず」と二度目を読む。',
    pitfall: '未を一度だけ最後に読み、単純過去否定にしない。',
  }),
  freezeExercise({
    id: 'kk010', level: 'middle', title: '置き字「而」',
    marked: '学ビテ而時ニ習フ㆑之ヲ。', tokens: [{ id: 'learn', label: '学' }, { id: 'and', label: '而' }, { id: 'time', label: '時' }, { id: 'practice', label: '習' }, { id: 'it', label: '之' }], order: ['learn', 'and', 'time', 'it', 'practice'],
    kakikudashi: '学びて時に之を習ふ。', translation: '学んだことを時機に応じて復習する。',
    clue: '而は順接「て」を補う。レ点で之を習より先に読む。',
    pitfall: '而を必ず音読せず、前後関係に合う接続へ変える。',
  }),
  freezeExercise({
    id: 'kk011', level: 'basic', title: '使役と一二点',
    marked: '使ム㆓人ヲシテ読マ㆒㆑書ヲ。', tokens: [{ id: 'make', label: '使' }, { id: 'person', label: '人' }, { id: 'read', label: '読' }, { id: 'book', label: '書' }], order: ['person', 'book', 'read', 'make'],
    kakikudashi: '人をして書を読ましむ。', translation: '人に本を読ませる。',
    clue: 'レ点で書→読。一点の読まで処理してから二点の使へ返る。人は読の意味上の主語。',
    pitfall: '使を最初に読み「使う人」としない。',
  }),
  freezeExercise({
    id: 'kk012', level: 'basic', title: '一二点とレ点の入れ子',
    marked: '欲ス㆓自ラ学バント㆒㆑道ヲ。', tokens: [{ id: 'want', label: '欲' }, { id: 'self', label: '自' }, { id: 'learn', label: '学' }, { id: 'way', label: '道' }], order: ['self', 'way', 'learn', 'want'],
    kakikudashi: '自ら道を学ばんと欲す。', translation: '自分から道理を学びたい。',
    clue: 'まず道→学の小返りを解き、まとまり「自ら道を学ばんと」から二点の欲へ戻る。',
    pitfall: '欲の直後だけを目的語にせず、動作全体を願望内容とする。',
  }),
  freezeExercise({
    id: 'kk013', level: 'basic', title: '上下一二点：二層の返り',
    marked: '有リ㆘能ク読ム㆓古書ヲ㆒者㆖。', tokens: [{ id: 'have', label: '有' }, { id: 'able', label: '能' }, { id: 'read', label: '読' }, { id: 'old', label: '古' }, { id: 'book', label: '書' }, { id: 'person', label: '者' }], order: ['able', 'old', 'book', 'read', 'person', 'have'],
    kakikudashi: '能く古書を読む者有り。', translation: '古い書物を読める者がいる。',
    clue: '内側の古書→読を一二点で処理し、上点の者まで読んでから外側の下点の有へ返る。',
    pitfall: '外側の有を先に読まない。返りは内側から解く。',
  }),
  freezeExercise({
    id: 'kk014', level: 'basic', title: '受身「為…所…」',
    marked: '後ルレバ則チ為ル㆓人ノ所ト㆒㆑制スル。', tokens: [{ id: 'late', label: '後' }, { id: 'then', label: '則' }, { id: 'become', label: '為' }, { id: 'person', label: '人' }, { id: 'passive', label: '所' }, { id: 'control', label: '制' }], order: ['late', 'then', 'person', 'control', 'passive', 'become'],
    kakikudashi: '後るれば則ち人の制する所と為る。', translation: '後れを取れば、人に押さえられる。',
    clue: '人が動作主、制が動作。制→所で「制する所」とまとめ、最後に為るで受身を完成。',
    pitfall: '自分が人を制する能動文へ逆転しない。',
  }),
  freezeExercise({
    id: 'kk015', level: 'basic', title: '疑問「何以」',
    marked: '何ヲ以テ知ル㆑之ヲ。', tokens: [{ id: 'what', label: '何' }, { id: 'with', label: '以' }, { id: 'know', label: '知' }, { id: 'it', label: '之' }], order: ['what', 'with', 'it', 'know'],
    kakikudashi: '何を以て之を知る。', translation: '何によってそのことを知るのか。',
    clue: '何以を手段の問い「何を以て」とし、レ点で之→知。',
    pitfall: '「なぜ知っている」と理由だけに固定しない。',
  }),
  freezeExercise({
    id: 'kk016', level: 'basic', title: '反語「不亦…乎」',
    marked: '不㆓亦タ説バシカラ㆒乎。', tokens: [{ id: 'not', label: '不' }, { id: 'also', label: '亦' }, { id: 'joyful', label: '説' }, { id: 'question', label: '乎' }], order: ['also', 'joyful', 'not', 'question'],
    kakikudashi: '亦た説ばしからずや。', translation: 'なんと喜ばしいことではないか。',
    clue: '亦・説を読んで不へ返り、乎を「や」として反語・詠嘆にする。',
    pitfall: '「喜ばしくないのか」と否定の疑問のままにしない。',
  }),
  freezeExercise({
    id: 'kk017', level: 'basic', title: '比較「不如」',
    marked: '百聞ハ不㆑如カ㆓一見ニ㆒。', tokens: [{ id: 'manyhears', label: '百聞' }, { id: 'not', label: '不' }, { id: 'compare', label: '如' }, { id: 'onesee', label: '一見' }], order: ['manyhears', 'onesee', 'compare', 'not'],
    kakikudashi: '百聞は一見に如かず。', translation: '何度も聞くことは一度見ることに及ばない。',
    clue: '比較基準の一見を先に置き、如→不で「如かず」。',
    pitfall: '百聞の方が優れると比較方向を逆にしない。',
  }),
  freezeExercise({
    id: 'kk018', level: 'basic', title: '再読文字「将」',
    marked: '日将ニ〈ス〉㆑暮レント。', tokens: [{ id: 'sun', label: '日' }, { id: 'soon1', label: '将①' }, { id: 'dark', label: '暮' }, { id: 'soon2', label: '将②' }], order: ['sun', 'soon1', 'dark', 'soon2'],
    kakikudashi: '日将に暮れんとす。', translation: '日が今にも暮れようとしている。',
    clue: '将にを先、暮の後に「んとす」を補って二度読む。',
    pitfall: '「日は将軍の夕方」と漢字を名詞化しない。',
  }),
  freezeExercise({
    id: 'kk019', level: 'basic', title: '上下点：外側へ返る',
    marked: '勿カレ㆘以テ㆓悪ノ小ナルヲ㆒而為スコト㆖㆑之ヲ。', tokens: [{ id: 'do_not', label: '勿' }, { id: 'with', label: '以' }, { id: 'evil', label: '悪' }, { id: 'small', label: '小' }, { id: 'and', label: '而' }, { id: 'do', label: '為' }, { id: 'it', label: '之' }], order: ['evil', 'small', 'with', 'and', 'it', 'do', 'do_not'],
    kakikudashi: '悪の小なるを以て之を為すこと勿かれ。', translation: '悪事が小さいからといって、それをしてはならない。',
    clue: '悪小→以の一二点、之→為のレ点を解き、為に付いた上点から外側の下点の勿へ返る。',
    pitfall: '上下点を一二点より先に処理しない。',
  }),
  freezeExercise({
    id: 'kk020', level: 'basic', title: '置き字と逆接',
    marked: '学ビテ而不レバ㆑思ハ則チ罔シ。', tokens: [{ id: 'learn', label: '学' }, { id: 'but', label: '而' }, { id: 'not', label: '不' }, { id: 'think', label: '思' }, { id: 'then', label: '則' }, { id: 'blind', label: '罔' }], order: ['learn', 'but', 'think', 'not', 'then', 'blind'],
    kakikudashi: '学びて思はざれば則ち罔し。', translation: '学んでも自分で考えなければ、物事が見えない。',
    clue: '而はここでは譲歩を含む接続。不は思へ返る。則が条件の結果を導く。',
    pitfall: '而を順接「そして」に固定して論理を弱めない。',
  }),
  freezeExercise({
    id: 'kk021', level: 'standard', title: '使役・二重目的語',
    marked: '王、使ム㆓臣ヲシテ守ラ㆒㆑城ヲ。', tokens: [{ id: 'king', label: '王' }, { id: 'make', label: '使' }, { id: 'vassal', label: '臣' }, { id: 'guard', label: '守' }, { id: 'castle', label: '城' }], order: ['king', 'vassal', 'castle', 'guard', 'make'],
    kakikudashi: '王、臣をして城を守らしむ。', translation: '王は家臣に城を守らせる。',
    clue: '王は使役者、臣は守の意味上の主語、城は守の目的語。',
    pitfall: '王が城を守る、臣を守る、と兼語を取り違えない。',
  }),
  freezeExercise({
    id: 'kk022', level: 'standard', title: '見…於…の受身',
    marked: '臣、見ル㆑疑ハ㆓於王ニ㆒。', tokens: [{ id: 'vassal', label: '臣' }, { id: 'passive', label: '見' }, { id: 'doubt', label: '疑' }, { id: 'by', label: '於' }, { id: 'king', label: '王' }], order: ['vassal', 'king', 'by', 'doubt', 'passive'],
    kakikudashi: '臣、王に疑はる。', translation: '家臣は王に疑われる。',
    clue: '於王が動作主「王に」。見は見るでなく受身「る」。',
    pitfall: '家臣が王を疑う文へ逆転しない。',
  }),
  freezeExercise({
    id: 'kk023', level: 'standard', title: '抑揚「況…乎」',
    marked: '匹夫スラ尚ホ不㆑可カラ㆑奪フ㆑志ヲ、況ンヤ君子ヲ乎。', tokens: [{ id: 'ordinary', label: '匹夫' }, { id: 'even', label: '尚' }, { id: 'not', label: '不' }, { id: 'can', label: '可' }, { id: 'take', label: '奪' }, { id: 'will', label: '志' }, { id: 'muchmore', label: '況' }, { id: 'gentleman', label: '君子' }, { id: 'question', label: '乎' }], order: ['ordinary', 'even', 'will', 'take', 'can', 'not', 'muchmore', 'gentleman', 'question'],
    kakikudashi: '匹夫すら尚ほ志を奪ふべからず、況んや君子をや。', translation: '普通の人でさえ志を奪えない。まして君子ならなおさらだ。',
    clue: '前半は志→奪→可→不。後半の況がより強い例「君子」を導く。',
    pitfall: '況以下を疑問のままにせず、なおさら成立する結論を補う。',
  }),
  freezeExercise({
    id: 'kk024', level: 'standard', title: '比較と一二点',
    marked: '青ハ取リテ㆓之ヲ於藍ヨリ㆒、而青シ㆓於藍ヨリ㆒。', tokens: [{ id: 'blue1', label: '青①' }, { id: 'take', label: '取' }, { id: 'it', label: '之' }, { id: 'from', label: '於' }, { id: 'indigo1', label: '藍①' }, { id: 'but', label: '而' }, { id: 'blue2', label: '青②' }, { id: 'than', label: '於' }, { id: 'indigo2', label: '藍②' }], order: ['blue1', 'it', 'indigo1', 'from', 'take', 'but', 'indigo2', 'than', 'blue2'],
    kakikudashi: '青は之を藍より取りて、藍より青し。', translation: '青色は藍から取るが、藍より青い。',
    clue: '前の於は起点「より」、後ろの於は比較基準「より」。同じ字の役割を動詞で分ける。',
    pitfall: '二つの藍を同じ位置へ一度だけ置かない。',
  }),
  freezeExercise({
    id: 'kk025', level: 'standard', title: '与其…寧…の選択',
    marked: '与リハ㆓其ノ生キテ而無カラン㆒㆑義、寧ロ死シテ而守ラン㆑節ヲ。', tokens: [{ id: 'ratherthan', label: '与' }, { id: 'that', label: '其' }, { id: 'live', label: '生' }, { id: 'but1', label: '而' }, { id: 'no', label: '無' }, { id: 'justice', label: '義' }, { id: 'rather', label: '寧' }, { id: 'die', label: '死' }, { id: 'but2', label: '而' }, { id: 'keep', label: '守' }, { id: 'integrity', label: '節' }], order: ['that', 'live', 'but1', 'justice', 'no', 'ratherthan', 'rather', 'die', 'but2', 'integrity', 'keep'],
    kakikudashi: '其の生きて義無からんよりは、寧ろ死して節を守らん。', translation: '正義なく生きるより、むしろ死んで節義を守ろう。',
    clue: '与其側が退ける案、寧側が選ぶ案。義→無まで読んで与へ返り、節→守はレ点で返る。',
    pitfall: '前半を選ぶと優先順位を逆転する。',
  }),
  freezeExercise({
    id: 'kk026', level: 'standard', title: '部分否定「不必」',
    marked: '賢者不㆓必ズシモ富マ㆒。', tokens: [{ id: 'wise', label: '賢者' }, { id: 'not', label: '不' }, { id: 'always', label: '必' }, { id: 'rich', label: '富' }], order: ['wise', 'always', 'rich', 'not'],
    kakikudashi: '賢者必ずしも富まず。', translation: '賢い人が必ず裕福だとは限らない。',
    clue: '不は「富」だけでなく全称副詞「必」を否定する。',
    pitfall: '賢者は決して富まない、という全部否定にしない。',
  }),
  freezeExercise({
    id: 'kk027', level: 'standard', title: '最上級「莫…於」',
    marked: '善ハ莫シ㆑大ナルハ㆓於改ムルヨリ㆒㆑過チヲ。', tokens: [{ id: 'good', label: '善' }, { id: 'none', label: '莫' }, { id: 'great', label: '大' }, { id: 'than', label: '於' }, { id: 'correct', label: '改' }, { id: 'mistake', label: '過' }], order: ['good', 'mistake', 'correct', 'than', 'great', 'none'],
    kakikudashi: '善は過ちを改むるより大なるは莫し。', translation: '過ちを改めることほど大きな善はない。',
    clue: '過→改で比較基準を作り、於→大→莫で「より大なるは莫し」。',
    pitfall: '莫を禁止「改めるな」と読まない。',
  }),
  freezeExercise({
    id: 'kk028', level: 'standard', title: '仮定「若…則…」',
    marked: '若シ不ンバ㆑学バ、則チ不㆑知ラ。', tokens: [{ id: 'if', label: '若' }, { id: 'not1', label: '不①' }, { id: 'learn', label: '学' }, { id: 'then', label: '則' }, { id: 'not2', label: '不②' }, { id: 'know', label: '知' }], order: ['if', 'learn', 'not1', 'then', 'know', 'not2'],
    kakikudashi: '若し学ばずんば、則ち知らず。', translation: 'もし学ばなければ、知ることはできない。',
    clue: '若が条件節、則が結果節。各不は直後の動詞へ返る。',
    pitfall: '若を比況「ごとし」と読まない。',
  }),
  freezeExercise({
    id: 'kk029', level: 'standard', title: '逆接仮定「雖…而…」',
    marked: '雖モ㆑学ブト、而不㆑思ハ。', tokens: [{ id: 'although', label: '雖' }, { id: 'learn', label: '学' }, { id: 'but', label: '而' }, { id: 'not', label: '不' }, { id: 'think', label: '思' }], order: ['learn', 'although', 'but', 'think', 'not'],
    kakikudashi: '学ぶと雖も、思はず。', translation: '学んではいるが、自分で考えない。',
    clue: '学→雖で譲歩「学ぶといえども」。而以下が主張の中心。',
    pitfall: '学ぶことを否定する文にしない。',
  }),
  freezeExercise({
    id: 'kk030', level: 'standard', title: '二重否定「無不」',
    marked: '人、無シ㆑不ルハ㆑愛セ㆓其ノ子ヲ㆒。', tokens: [{ id: 'people', label: '人' }, { id: 'none', label: '無' }, { id: 'not', label: '不' }, { id: 'love', label: '愛' }, { id: 'their', label: '其' }, { id: 'child', label: '子' }], order: ['people', 'their', 'child', 'love', 'not', 'none'],
    kakikudashi: '人、其の子を愛せざるは無し。', translation: '人は皆、自分の子を愛する。',
    clue: '其子→愛→不で「愛せざる」、さらに無へ返り「は無し」。',
    pitfall: '否定を一つ落として「誰も愛さない」としない。',
  }),
  freezeExercise({
    id: 'kk031', level: 'advanced', title: '甲乙点：三層の使役',
    marked: '吾、欲ス㆚使メ㆘子弟ヲシテ読ミテ㆓古書ヲ㆒而知ラ㆖㆑礼ヲ、以テ治メント㆙㆑家ヲ。', tokens: [{ id: 'i', label: '吾' }, { id: 'want', label: '欲' }, { id: 'make', label: '使' }, { id: 'youth', label: '子弟' }, { id: 'read', label: '読' }, { id: 'old', label: '古' }, { id: 'book', label: '書' }, { id: 'and', label: '而' }, { id: 'know', label: '知' }, { id: 'ritual', label: '礼' }, { id: 'with', label: '以' }, { id: 'govern', label: '治' }, { id: 'house', label: '家' }], order: ['i', 'youth', 'old', 'book', 'read', 'and', 'ritual', 'know', 'make', 'with', 'house', 'govern', 'want'],
    kakikudashi: '吾、子弟をして古書を読みて礼を知らしめ、以て家を治めんと欲す。', translation: '私は、若者たちに古い書物を読ませて礼を理解させ、そうして家を治めたい。',
    clue: '古書→読を一二点、礼→知から使へ上下点で返り、家→治を読んでから甲点を経て乙点の欲へ戻る。',
    pitfall: '外側の欲から先に読み始めない。',
  }),
  freezeExercise({
    id: 'kk032', level: 'advanced', title: '所字句と否定',
    marked: '己ノ所㆑不ル㆑欲セ、勿カレ㆑施スコト㆓於人ニ㆒。', tokens: [{ id: 'self', label: '己' }, { id: 'thing', label: '所' }, { id: 'not1', label: '不' }, { id: 'want', label: '欲' }, { id: 'do_not', label: '勿' }, { id: 'do', label: '施' }, { id: 'to', label: '於' }, { id: 'people', label: '人' }], order: ['self', 'want', 'not1', 'thing', 'people', 'to', 'do', 'do_not'],
    kakikudashi: '己の欲せざる所、人に施すこと勿かれ。', translation: '自分が望まないことを、他人にしてはならない。',
    clue: '欲→不で「欲せざる」を作り所で名詞化。人に→施→勿で禁止。',
    pitfall: '所を場所と訳し「望まない場所」にしない。',
  }),
  freezeExercise({
    id: 'kk033', level: 'advanced', title: '唯…是…の倒置',
    marked: '唯ダ命ノミ是レ従フ。', tokens: [{ id: 'only', label: '唯' }, { id: 'order', label: '命' }, { id: 'this', label: '是' }, { id: 'obey', label: '従' }], order: ['only', 'order', 'this', 'obey'],
    kakikudashi: '唯だ命のみ是れ従ふ。', translation: 'ただ命令だけに従う。',
    clue: '唯と是に囲まれた「命」が、従の強調された目的語。',
    pitfall: '是を「これは」と新しい主語にしない。',
  }),
  freezeExercise({
    id: 'kk034', level: 'advanced', title: '反語と受身',
    marked: '豈ニ見レン㆑欺カ㆓於小人ニ㆒乎。', tokens: [{ id: 'how', label: '豈' }, { id: 'passive', label: '見' }, { id: 'deceive', label: '欺' }, { id: 'by', label: '於' }, { id: 'petty', label: '小人' }, { id: 'question', label: '乎' }], order: ['how', 'petty', 'by', 'deceive', 'passive', 'question'],
    kakikudashi: '豈に小人に欺かれんや。', translation: 'どうして小人物にだまされるだろうか、いや、だまされない。',
    clue: '小人に→欺→見で受身。その全体を豈…乎が反語にする。',
    pitfall: '見を「小人を見る」と能動にしない。',
  }),
  freezeExercise({
    id: 'kk035', level: 'advanced', title: '再読・使役・複合返り',
    marked: '当ニ〈ベシ〉㆑使ム㆓臣ヲシテ察セ㆒㆑民ヲ。', tokens: [{ id: 'should1', label: '当①' }, { id: 'make', label: '使' }, { id: 'vassal', label: '臣' }, { id: 'observe', label: '察' }, { id: 'people', label: '民' }, { id: 'should2', label: '当②' }], order: ['should1', 'vassal', 'people', 'observe', 'make', 'should2'],
    kakikudashi: '当に臣をして民を察せしむべし。', translation: '当然、家臣に民情を調べさせるべきだ。',
    clue: '当にを先に置く。民→察→使を解き、最後に当の二度目「べし」。',
    pitfall: '再読文字を返り点の最後だけで一度読む形にしない。',
  }),
  freezeExercise({
    id: 'kk036', level: 'advanced', title: '非唯…亦…の累加',
    marked: '非ズ㆓唯ダ利スルノミニ㆒㆑国ヲ、亦タ利ス㆑民ヲ。', tokens: [{ id: 'not', label: '非' }, { id: 'only', label: '唯' }, { id: 'benefit1', label: '利①' }, { id: 'country', label: '国' }, { id: 'also', label: '亦' }, { id: 'benefit2', label: '利②' }, { id: 'people', label: '民' }], order: ['only', 'country', 'benefit1', 'not', 'also', 'people', 'benefit2'],
    kakikudashi: '唯だ国を利するのみに非ず、亦た民を利す。', translation: '国に利益があるだけでなく、民にも利益がある。',
    clue: '国→利→唯→非で「国だけではない」。亦以下で民を追加。',
    pitfall: '国への利益を否定して民だけを肯定しない。両方成立する。',
  }),
  freezeExercise({
    id: 'kk037', level: 'elite', title: '使役と受身の複合',
    marked: '使ム㆔臣ヲシテ為ラ㆓敵ノ所ト㆒㆑疑フ。', tokens: [{ id: 'make', label: '使' }, { id: 'vassal', label: '臣' }, { id: 'become', label: '為' }, { id: 'enemy', label: '敵' }, { id: 'passive', label: '所' }, { id: 'doubt', label: '疑' }], order: ['vassal', 'enemy', 'doubt', 'passive', 'become', 'make'],
    kakikudashi: '臣をして敵の疑ふ所と為らしむ。', translation: '家臣が敵に疑われるように仕向ける。',
    clue: '敵→疑→所と受身を作り、一点から二点の為、三点の使へと外側へ返る。',
    pitfall: '敵が家臣を使う、臣が敵を疑う、と階層を平らにしない。',
  }),
  freezeExercise({
    id: 'kk038', level: 'elite', title: '反実仮想「使…則…」',
    marked: '使メバ㆓我ヲシテ有ラ㆒㆑翼、則チ飛ビテ而至ラン。', tokens: [{ id: 'if', label: '使' }, { id: 'me', label: '我' }, { id: 'have', label: '有' }, { id: 'wing', label: '翼' }, { id: 'then', label: '則' }, { id: 'fly', label: '飛' }, { id: 'and', label: '而' }, { id: 'arrive', label: '至' }], order: ['me', 'wing', 'have', 'if', 'then', 'fly', 'and', 'arrive'],
    kakikudashi: '我をして翼有らしめば、則ち飛びて至らん。', translation: 'もし私に翼があったなら、飛んで着くだろう。',
    clue: '我→翼→有と読んでから二点の使へ返り、「しめば」で仮の条件を作る。則が反実の結果を導く。',
    pitfall: '第三者が私へ命令する通常使役と断定しない。',
  }),
  freezeExercise({
    id: 'kk039', level: 'elite', title: '何異於の反語比較',
    marked: '是レ何ゾ異ナラン㆓於刺シテ㆑人ヲ而殺スニ㆒㆑之ヲ。', tokens: [{ id: 'this', label: '是' }, { id: 'what', label: '何' }, { id: 'differ', label: '異' }, { id: 'than', label: '於' }, { id: 'stab', label: '刺' }, { id: 'person', label: '人' }, { id: 'and', label: '而' }, { id: 'kill', label: '殺' }, { id: 'them', label: '之' }], order: ['this', 'what', 'person', 'stab', 'and', 'them', 'kill', 'than', 'differ'],
    kakikudashi: '是れ何ぞ人を刺して之を殺すに異ならん。', translation: 'これは人を刺し殺すことと何が違うだろうか、いや同じだ。',
    clue: '何は返り点が無いので是の次に読む。人→刺、之→殺で比べる内容を作り、於を経て二点の異へ返る。',
    pitfall: '本当に違いを尋ねる中立疑問にしない。',
  }),
  freezeExercise({
    id: 'kk040', level: 'elite', title: '最外層の天地人点',
    marked: '吾、願フ㆞欲シ㆚令メ㆘臣ヲシテ学ビテ㆓古礼ヲ㆒而知ラ㆖㆑義ヲ、安ンゼント㆙㆑国ヲ、以テ成サンコトヲ㆝㆑業ヲ。', tokens: [{ id: 'i', label: '吾' }, { id: 'wish', label: '願' }, { id: 'want', label: '欲' }, { id: 'order', label: '令' }, { id: 'vassal', label: '臣' }, { id: 'learn', label: '学' }, { id: 'old', label: '古' }, { id: 'ritual', label: '礼' }, { id: 'and', label: '而' }, { id: 'know', label: '知' }, { id: 'duty', label: '義' }, { id: 'peace', label: '安' }, { id: 'country', label: '国' }, { id: 'with', label: '以' }, { id: 'achieve', label: '成' }, { id: 'work', label: '業' }], order: ['i', 'vassal', 'old', 'ritual', 'learn', 'and', 'duty', 'know', 'order', 'country', 'peace', 'want', 'with', 'work', 'achieve', 'wish'],
    kakikudashi: '吾、臣をして古礼を学びて義を知らしめ、国を安んぜんと欲し、以て業を成さんことを願ふ。', translation: '私は、家臣に昔の礼を学ばせて道理を理解させ、国を安定させたいと思い、そうして事業を成し遂げることを願う。',
    clue: '古礼→学を一二点、義→知から令へ上下点、国→安から欲へ甲乙点、最後に業→成から願へ天地人点で返る。',
    pitfall: '点の種類が増えても原則は同じ。最外層から読まず、内側から閉じる。',
  }),
])

export const KANBUN_KUNDOKU_BY_ID = Object.freeze(
  Object.fromEntries(KANBUN_KUNDOKU_EXERCISES.map((item) => [item.id, item])),
)

export const getKanbunKundokuExercise = (id) => KANBUN_KUNDOKU_BY_ID[id]

export function pickKanbunKundokuExercises(
  ids,
  { size = 10, rng = Math.random, preserveOrder = false, srs = {}, now = Date.now() } = {},
) {
  const requested = Array.isArray(ids) && ids.length
    ? new Set(ids)
    : null
  const candidates = KANBUN_KUNDOKU_EXERCISES.filter(
    (item) => !requested || requested.has(item.id),
  )
  // 一覧で選んだ順ならそのまま。それ以外は全教材共通の出題順（lib/studyOrder.js）で、
  // 返り点ドリルはテストだけの教材なので、まだ答えていない問題を先に出す。
  const ordered = preserveOrder
    ? Array.isArray(ids)
      ? ids.map((id) => candidates.find((item) => item.id === id)).filter(Boolean)
      : [...candidates]
    : orderForStudy(candidates, srs, { purpose: 'quiz', now, rng })
  return ordered.slice(0, Math.min(Math.max(0, Number(size) || 10), ordered.length))
}

export function isCorrectKanbunKundokuOrder(exercise, selectedIds) {
  if (!exercise || !Array.isArray(selectedIds)) return false
  return exercise.order.length === selectedIds.length
    && exercise.order.every((id, index) => id === selectedIds[index])
}
