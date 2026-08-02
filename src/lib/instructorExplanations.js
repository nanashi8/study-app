import { UNKNOWN_CHOICE_ID } from './quizChoices.js'

const POS_GUIDE = Object.freeze({
  動: '動作・状態を表す動詞',
  名: '人・物・概念を指す名詞',
  形: '名詞や状態を説明する形容詞',
  副: '動作・程度・文全体を詳しくする副詞',
  前: '後ろの名詞句との関係を示す前置詞',
  接: '語・句・節をつなぐ接続詞',
  代: '名詞の代わりをする代名詞',
})

const clean = (value) => String(value ?? '')
  .replace(/\s+/g, ' ')
  .replace(/。{2,}/g, '。')
  .replace(/([！？!?])\1+/g, '$1')
  .replace(/[.．]。/g, '。')
  .trim()
const stripTerminal = (value) => clean(value).replace(/[。.!！?？]+$/u, '')
const quote = (value) => `「${clean(value)}」`
const list = (values, separator = '・') =>
  (values ?? []).map(clean).filter(Boolean).join(separator)

const explanation = ({ answer, evidence, trap, strategy }) => ({
  answer: clean(answer),
  evidence: clean(evidence),
  trap: clean(trap),
  strategy: clean(strategy),
})

const isUnknown = (selected) =>
  selected === UNKNOWN_CHOICE_ID || selected?.id === UNKNOWN_CHOICE_ID

const chosenText = (selected) => {
  if (selected == null || isUnknown(selected)) return ''
  if (typeof selected === 'string' || typeof selected === 'number') return clean(selected)
  return clean(
    selected.text
      ?? selected.meaning
      ?? selected.meanings?.[0]
      ?? selected.word
      ?? selected.phrase,
  )
}

const selectionTrap = ({
  selected,
  correct,
  wrong,
  unknown,
  correctAnswer,
}) => {
  if (isUnknown(selected)) return clean(unknown)
  const picked = chosenText(selected)
  if (picked && clean(correct) && picked !== clean(correct)) {
    return clean(wrong(picked))
  }
  return clean(correctAnswer)
}

const grammarStrategy = (source = '') => {
  const topic = typeof source === 'object' ? clean(source?.topic) : clean(source)
  const details = typeof source === 'object'
    ? clean(`${source?.prompt ?? source?.q ?? ''} ${source?.explain ?? ''}`)
    : ''
  // 通常問題は単元名を最優先する。解説本文中に「主語」「前置詞」などが
  // 偶然現れても、別単元の解法へ誤分類しないためである。
  const value = topic || details
  // 診断問題には単元名がないため、解説中のより強い文法標識を先に拾う。
  if (!topic && /疑問文|疑問詞|間接疑問|付加疑問/.test(details)) {
    return 'まず肯定文の語順で主語と動詞を確定し、必要な助動詞を前へ出す。疑問詞が問う情報を空所にして、疑問文全体の語順と時制を組み直す。'
  }
  if (!topic && /受動態|受け身|分詞構文/.test(details)) {
    return '主語・目的語と動作の関係が「する側」か「される側」かを決め、原形・現在分詞・過去分詞を選び分ける。'
  }
  if (!topic && /進行形|完了形|時制|時を表す副詞節|過去のある時/.test(details)) {
    return 'まず時を示す語と出来事の前後関係を拾い、基準時を現在・過去・未来のどこに置くか決める。最後に主語と動詞の形を照合する。'
  }
  if (!topic && /比較級|最上級|原級|倍数/.test(details)) {
    return '比較する対象の数と、原級・比較級・最上級の合図を先に探す。than、as、of / in まで一まとまりで確認する。'
  }
  if (!topic && /助動詞|\b(?:must|may|should|could|would|can)\b/i.test(details)) {
    return '事実なのか、可能性・義務・反実仮想なのかを先に判定する。助動詞の後ろは原形、仮定法は条件節と帰結節の時制を対で確認する。'
  }
  if (!topic && /相関接続詞|\b(?:either|neither|both)\b/i.test(details)) {
    return '空所の前後が語・句・節のどれかを判定し、同じ文法上の役割どうしを結ぶ。節なら主語と動詞がそろうか、因果・逆接・譲歩のどの論理関係かまで確認する。'
  }
  if (!topic && /関係詞|関係代名詞|\bwhich\b/i.test(details)) {
    return '空所の後ろが完全文か不完全文かを見て、空所が節をつなぐだけか、節内の主語・目的語を兼ねるかを判定する。先行詞の有無と、人・物・場所・時の区別まで照合する。'
  }
  if (/used to\s*\/\s*be used to/.test(value)) {
    return 'used to の後ろが動詞原形なら「以前は〜した」、be used to の to が前置詞なら後ろは名詞・動名詞で「〜に慣れている」。to の品詞と直後の形を対で見る。'
  }
  if (/be to構文/.test(value)) {
    return 'be to は予定・義務・可能・運命・意図のどれかを、主語、時を示す語、前後の文脈から決める。be動詞の時制を先に確定し、to の後ろは動詞原形にする。'
  }
  if (/疑問詞\+不定詞|完了不定詞|原形不定詞|不定詞|動名詞/.test(value)) {
    return '空所が名詞・形容詞・副詞のどの働きかを見たうえで、直前の動詞が to不定詞と動名詞のどちらを取るか確認する。完了形なら述語動詞との時間差、原形なら使役・知覚との関係まで見る。'
  }
  if (/so\.\.\.that|so\/such\.\.\.that|too\/enough|目的の表現/.test(value)) {
    return '程度・結果・目的のどれを表す文かを日本語で確定し、so / such、too / enough、to不定詞や that節の型へ当てはめる。形容詞・名詞と語順を一まとまりで確認する。'
  }
  if (/命令文|感嘆文|祈願文/.test(value)) {
    return '文が命令・感嘆・願望のどれかを判定し、その文型の先頭語と動詞の形を固定する。通常の平叙文へ戻した意味と一致するか最後に確かめる。'
  }
  if (/倒置|強調|省略|代用|部分否定|クジラ構文/.test(value)) {
    return '強調・倒置・省略をいったん通常語順へ戻し、何が移動または省略されたかを補う。否定語の位置と及ぶ範囲まで確定してから、元の形へ組み直す。'
  }
  if (/it\.\.\.to\/for/.test(value)) {
    return '形式主語 It の後ろに真の主語である to不定詞を置き、不定詞の動作主を示す前置詞を決める。一般的な評価は for 人、人の性質を評価する形容詞は of 人と判定する。'
  }
  if (/形式目的語/.test(value)) {
    return 'find / make / think などの後ろで、長い to不定詞・that節を真の目的語として後置し、その位置を形式目的語 it で埋める。動詞＋it＋補語＋真の目的語の骨格を取る。'
  }
  if (/^(?:一致|主語と動詞の一致)$/.test(value)) {
    return '主語の中心語を of 句などの修飾語から切り離し、単数・複数を確定する。neither A nor B などの特殊則、数量を一まとまりと見る場合も確認して動詞を一致させる。'
  }
  if (/文型|無生物主語|同格|付帯状況/.test(value)) {
    return '修飾語をいったん外して主語・動詞・目的語・補語の骨格を取る。動詞が要求する文型と、各要素が同一関係か動作の対象かを確認してから語形を選ぶ。'
  }
  if (/関係|複合関係詞|whatever|連鎖関係詞|前置詞\+関係代名詞/.test(value)) {
    return '空所の後ろが完全文か不完全文かを見て、空所が節をつなぐだけか、節内の主語・目的語を兼ねるかを判定する。先行詞の有無と、人・物・場所・時の区別まで照合する。'
  }
  if (/接続|名詞節|譲歩|相関/.test(value)) {
    return '空所の前後が語・句・節のどれかを判定し、同じ文法上の役割どうしを結ぶ。節なら主語と動詞がそろうか、因果・逆接・譲歩のどの論理関係かまで確認する。'
  }
  if (/be動詞|3単現|3人称単数|主語と動詞|There is\/are/.test(value)) {
    return 'まず主語の人称と単数・複数を確定し、次に時制を決める。その二条件から動詞の形を一つに絞り、完成文を音読して主語と動詞の一致を確認する。'
  }
  if (/名詞の複数形|冠詞|限定詞|数量表現|限定詞・数量|指示語/.test(value)) {
    return '空所の後ろの名詞が数えられるか、単数か複数か、話し手と聞き手の間で特定済みかを順に確認する。数量語・冠詞・指示語と名詞の形を一組で照合する。'
  }
  if (/再帰代名詞|代名詞/.test(value)) {
    return '代名詞が指す名詞を先に特定し、人称・単数複数・主格／目的格／所有格を決める。主語と目的語が同一人物なら再帰代名詞になるかも確認する。'
  }
  if (/前置詞/.test(value)) {
    return '前置詞は日本語一語に置き換えず、後ろの名詞との位置・方向・時・手段の関係を図にする。動詞や形容詞との決まった結び付きも含めて完成句で判断する。'
  }
  if (/否定文・疑問文|付加疑問|間接疑問|疑問詞/.test(value)) {
    return 'まず肯定文の語順で主語と動詞を確定し、必要な助動詞を前へ出す。疑問詞が問う情報を空所にして、疑問文全体の語順と時制を組み直す。'
  }
  if (/助動詞|仮定|条件|had better/.test(value)) {
    return '事実なのか、可能性・義務・反実仮想なのかを先に判定する。助動詞の後ろは原形、仮定法は条件節と帰結節の時制を対で確認する。'
  }
  if (/時制|完了|進行|過去形|未来表現|過去の習慣|used to|話法/.test(value)) {
    return 'まず時を示す語と出来事の前後関係を拾い、基準時を現在・過去・未来のどこに置くか決める。最後に主語と動詞の形を照合する。'
  }
  if (/比較/.test(value)) {
    return '比較する対象の数と、原級・比較級・最上級の合図を先に探す。than、as、of / in まで一まとまりで確認する。'
  }
  if (/受動|分詞|使役|知覚/.test(value)) {
    return '主語・目的語と動作の関係が「する側」か「される側」かを決め、原形・現在分詞・過去分詞を選び分ける。'
  }
  return `まず完成文で必要な意味と品詞を言葉にし、選択肢の語形・語順・結び付きを一つずつ照合する。この問題では${stripTerminal(
    typeof source === 'object' ? source?.explain : source,
  )}を最終判断の軸にする。`
}

const readingStrategy = (question = '') => {
  const value = clean(question).toLowerCase()
  if (value.startsWith('why')) {
    return 'Why は理由を問う。because / so / therefore だけでなく、原因と結果が別文に分かれていないかを確認し、本文の因果を言い換えた選択肢を選ぶ。'
  }
  if (value.startsWith('how')) {
    return 'How は方法・状態・経緯を問う。動作の手段や変化の流れを本文で特定し、同じ内容を別表現にした選択肢と結ぶ。'
  }
  if (/main|best expresses|suggest|author/.test(value)) {
    return '主旨・筆者意見は一文だけで決めず、導入の問題提起、本文の対比、結論の主張が共通して向かう内容を選ぶ。強すぎる断定は切る。'
  }
  if (/where|when|who|what/.test(value)) {
    return '疑問詞が求める情報の種類を固定し、固有名詞・時・場所・動作の周辺を本文から探す。見つけた一文を選択肢の言い換えと照合する。'
  }
  return '設問のキーワードを本文に戻し、根拠の一文を指で示せる選択肢だけを残す。本文にない常識や印象は足さない。'
}

const listeningQuestionKind = (item = {}) => {
  const question = clean(item?.question).toLowerCase()
  const lastUtterance = clean(item?.audio?.at(-1)?.text).toLowerCase()
  const focus = item?.type === 'response' ? lastUtterance : question
  if (item?.type === 'picture') return 'picture'
  if (/\b(cheapest|highest|lowest|largest|smallest|most expensive|least expensive|better)\b/.test(focus)) {
    return 'comparison'
  }
  if (/^(how many|how much)\b/.test(focus)) return 'quantity'
  if (/^how long/.test(focus)) return 'duration'
  if (/^(when|what time|what day|which day)/.test(focus)) return 'time'
  if (/^(where|which (?:place|room|platform))/.test(focus)) return 'place'
  if (/^why|what caused|what cause|what reason|what influences?/.test(focus)) return 'reason'
  if (/^how(?! many| much| long)/.test(focus)) return 'method'
  if (item?.type === 'response') {
    if (/please|could you|would you|can you/.test(focus)) return 'request-response'
    if (/shall we|how about|why don't/.test(focus)) return 'suggestion-response'
    if (/^(do|does|did|is|are|was|were|have|has|can|could|will|would|may|shall)/.test(focus)) {
      return 'yes-no-response'
    }
    return 'response'
  }
  if (/main point|purpose|best title|mainly about|central idea/.test(question)) return 'main'
  if (/suggest|imply|infer|probably|attitude|feel|believe|conclusion/.test(question)) {
    return 'inference'
  }
  if (/^who\b/.test(question)) return 'person'
  if (/designed to|trying to|intended to|goal|purpose/.test(question)) return 'purpose'
  if (/\b(condition|qualification|limitation|challenge|problem|weakness|concern|caution)\b/.test(question)) {
    return 'constraint'
  }
  if (/\b(change|changes|changed|result|happened|effect|benefit|advantage)\b/.test(question)) {
    return 'change-effect'
  }
  if (/\b(tradeoff|contrast|difference|principle)\b/.test(question)) return 'contrast'
  if (/\b(agree|decide|plan|solution|recommend|advise|propose)\b/.test(question)) {
    return 'decision'
  }
  if (/^what (?:will|did|does|should|are|was|were|is)\b/.test(question)) return 'detail'
  if (/^which/.test(focus)) return 'selection'
  return 'detail'
}

const listeningFocus = (item = {}) => {
  switch (listeningQuestionKind(item)) {
    case 'quantity': return '人数・個数・金額などの数量'
    case 'comparison': return '複数候補を比べた最大・最小または最安・最高'
    case 'duration': return 'どのくらい続いたかという期間'
    case 'time': return '最終的に決まった曜日・日付・時刻'
    case 'place': return '人物や物が向かう場所・位置'
    case 'selection': return 'Which の直後に示された種類の具体的な選択'
    case 'reason': return '出来事の原因・理由'
    case 'method': return '目的を実現する方法・手段'
    case 'main': return '話全体を貫く主旨・目的'
    case 'inference': return '明言と状況から導く話者の意図・推測'
    case 'person': return '設問の条件に該当する人物・対象者'
    case 'purpose': return '行動・制度・物が実現しようとする目的'
    case 'constraint': return '結論を限定する条件・問題点・注意点'
    case 'change-effect': return '以前との変化、その結果または具体的な利点'
    case 'contrast': return '対立する二項と、両者を整理する原則・相違点'
    case 'decision': return '提案の中から最終的に合意・推奨された行動'
    case 'detail': return '設問の主語について放送が明示した具体的な事実'
    case 'yes-no-response': return 'Yes / No だけでなく内容までつながる自然な返答'
    case 'request-response': return '依頼を受けるか断るかと、その理由を示す返答'
    case 'suggestion-response': return '提案への賛否と次の行動を示す返答'
    case 'response': return '最後の発話に会話として自然につながる返答'
    case 'picture': return 'イラストの人物・動作・場所'
    case 'realLife': return '案内の対象者・時刻・条件・行動'
    case 'interview': return '回答者の結論と限定条件'
    case 'conversation': return '話者が最終的に決めたこと・理由・意図'
    case 'passage': return '説明の話題・対比・結論'
    default: return '設問が指定した情報'
  }
}

const listeningStrategy = (item = {}) => {
  const kind = listeningQuestionKind(item)
  if (
    item?.type === 'response'
    && ['quantity', 'comparison', 'duration', 'time', 'place', 'selection', 'reason', 'method'].includes(kind)
  ) {
    return `最後の発話の疑問詞から、答えるべき情報を${quote(listeningFocus(item))}に固定する。その種類に答えていない選択肢を先に外し、代名詞・時制・会話の自然さまで照合する。`
  }
  if (kind === 'quantity') {
    return 'How many / How much が問う数量を先に特定し、放送中の数字を役割付きでメモする。一部の数字だけを選ばず、必要なら合計・差・残りを計算して単位まで合わせる。'
  }
  if (kind === 'comparison') {
    return '比較する候補と数値を対応させてメモし、何が最大・最小・最安かを最後に比べる。数字だけ聞き取って、別の候補へ結び付けないようにする。'
  }
  if (kind === 'duration') {
    return 'How long は期間を問う。for＋期間と since＋起点を区別し、場所や時刻ではなく「どのくらい続いたか」を答える表現だけを残す。'
  }
  if (kind === 'time') {
    return '曜日・日付・時刻をすべてメモし、but / instead / after など変更を示す語の後を最終回答にする。最初に出た予定をそのまま選ばない。'
  }
  if (kind === 'place') {
    return '場所を表す語の前後で、誰がどこへ行くのか、出発地か目的地かを確認する。変更や否定があれば最後に有効な場所だけを選ぶ。'
  }
  if (kind === 'selection') {
    return 'Which の直後の名詞を確認し、バス番号・ページ・品物など何を選ぶ問題かを固定する。候補をメモし、訂正や言い直しの後に残った一つを選ぶ。'
  }
  if (kind === 'reason') {
    return 'Why は理由を問う。出来事そのものと原因を分け、because / so /ため・のでに当たる因果関係を一組で取る。'
  }
  if (kind === 'method') {
    return 'How は方法・手段を問う。目的と実際に採用した行動を結び、却下された案や単なる状況説明を外す。'
  }
  if (kind === 'main') {
    return '主旨・目的は冒頭の話題、対比の転換、最後の結論を三点で追う。細部が正しくても話全体を包めない選択肢は外す。'
  }
  if (kind === 'inference') {
    return '推測問題は明言された事実を二つ以上組み合わせ、言える範囲だけを選ぶ。本文より強い断定や、常識を足した選択肢は外す。'
  }
  if (kind === 'person') {
    return 'Who は人物・対象者を問う。放送に出た人名や役割をすべて候補にし、設問の条件を満たす行動・資格・行き先を持つ人物だけを残す。'
  }
  if (kind === 'purpose') {
    return '目的問題は「何をしたか」と「何のためにしたか」を分ける。so that / to / in order to や問題提起の後を追い、手段そのものを答えにしない。'
  }
  if (kind === 'constraint') {
    return '条件・弱点・懸念は、主張本体ではなく but / however / only / if の後に置かれやすい。何ができるかと、どこからは言えないかを対にして選ぶ。'
  }
  if (kind === 'change-effect') {
    return '変化・結果は before / after、予想 / 実際、原因 / 結果を二列でメモする。設問が変化そのものと結果のどちらを問うかを最後に照合する。'
  }
  if (kind === 'contrast') {
    return '対比される二項を左右に分け、それぞれの長所・短所を対応させる。片方だけの細部ではなく、両者を結ぶ相違点や原則を答える。'
  }
  if (kind === 'decision') {
    return '会話中の案を候補として並べ、却下理由と but / so / then の後に残る最終案を追う。最初の提案や一人だけの意見を合意事項と取り違えない。'
  }
  if (kind === 'detail') {
    return '設問の主語と動詞を先に囲み、放送中の同じ人物・物事の周辺だけを集中して取る。選択肢は単語一致でなく、誰が何をしたかという関係まで照合する。'
  }
  if (kind === 'yes-no-response' || kind === 'request-response' || kind === 'suggestion-response' || kind === 'response') {
    return '最後の発話が質問・依頼・提案・感想のどれかを判定し、代名詞・時制・肯定否定を合わせる。意味だけでなく、次の発話として自然に続く返答を選ぶ。'
  }
  if (kind === 'conversation') {
    return '会話は各発言を同じ重さで聞かず、but / yet / so の後と、最後に合意した提案を重く取る。質問が求める「決定・理由・意図」に印を付ける。'
  }
  if (kind === 'passage') {
    return '説明文は冒頭の話題、対比の転換、最後の結論を三点で追う。細部が正しくても全体の主張に答えていない選択肢は外す。'
  }
  if (kind === 'realLife') {
    return '案内は「誰が・いつ・どの条件なら・何をする」を表にして聞く。変更、例外、禁止を示す but / only / instead / until を聞き逃さない。'
  }
  if (kind === 'interview') {
    return '質問者の問いに対する回答者の最初の結論と、その後の限定条件をセットで取る。具体例だけを主張そのものと取り違えない。'
  }
  if (kind === 'picture') {
    return '写真問題は人物・動作・場所の三点を順に確認する。聞こえた名詞だけで決めず、主語の数、動作の進行、物の位置が一つでも違う選択肢を外す。'
  }
  return '先に質問の焦点を定め、音声中の言い換えと転換語を拾う。聞こえた単語があるだけの選択肢ではなく、内容が一致するものを選ぶ。'
}

const classicalGrammarStrategy = (question = {}) => {
  if (question.category === 'auxiliary') {
    return '助動詞は①直前の活用形から接続を決める ②文中の時・主語・語調から意味を絞る ③現代語訳へ戻して不自然でないか確かめる。'
  }
  if (/敬語|honorific/.test(`${question.category} ${question.format}`)) {
    return '敬語は語形だけでなく、誰から誰への敬意かを人物関係で決める。主体を高める尊敬、受け手を高める謙譲、聞き手への丁寧を分ける。'
  }
  if (/識別|活用|conjugation/.test(`${question.category} ${question.format}`)) {
    return '傍線部を単独暗記で決めず、直前・直後の語が要求する活用形と、文中での働きを同時に照合する。'
  }
  return '傍線部の直前直後を見て、接続・活用・文中の意味を順に確定する。最後に現代語訳へ入れて文脈が通るか検算する。'
}

const DIAGNOSTIC_SKILL_LABEL = Object.freeze({
  vocab: '語彙',
  grammar: '文法',
  usage: '熟語・語法',
  reading: '読解',
})

export function buildVocabInstructorExplanation(word, selectedWord) {
  const meanings = list(word?.meanings) || clean(word?.meaning)
  const selectedMeaning = selectedWord
    ? list(selectedWord.meanings) || clean(selectedWord.meaning)
    : ''
  const role = POS_GUIDE[word?.pos] ?? `${clean(word?.pos)}としての働き`
  return explanation({
    answer: `${quote(word?.word)}の核となる意味は${quote(meanings)}。まずこの中心義を正解として押さえる。`,
    evidence: `用例 ${quote(word?.example?.en)} では、${quote(word?.word)}が${role}として働く。日本語では${quote(word?.example?.ja)}となるため、意味を文脈の中で確定できる。`,
    trap: selectionTrap({
      selected: selectedWord,
      correct: word?.meaning,
      wrong: () => `${quote(selectedMeaning)}は${quote(selectedWord?.word)}側の意味。日本語だけの印象で選ばず、問われた綴り${quote(word?.word)}と一対一で照合する。`,
      unknown: `意味が出てこないときは、品詞${quote(word?.pos)}と例文の位置から働きを先に絞る。空欄のままにせず、中心義${quote(meanings)}へ戻す。`,
      correctAnswer: `意味を一語訳だけで固定せず、${quote(word?.word)}が${role}として使われることまで確認すると、別の文脈でも崩れにくい。`,
    }),
    strategy: `次からは「品詞 → 中心義 → 例文」の順で再生する。記憶の手掛かりは ${clean(word?.etymology?.note)}。`,
  })
}

export function buildPhraseInstructorExplanation(item, selectedItem) {
  const meanings = list(item?.meanings) || clean(item?.meaning)
  const selectedMeaning = selectedItem
    ? list(selectedItem.meanings) || clean(selectedItem.meaning)
    : ''
  return explanation({
    answer: `${quote(item?.phrase)}は、まとまりで${quote(meanings)}。語をばらばらに直訳せず、ひとかたまりの表現として取る。`,
    evidence: `${clean(item?.origin)} 例文 ${quote(item?.example?.en)} は${quote(item?.example?.ja)}となり、この意味が文脈でも確認できる。`,
    trap: selectionTrap({
      selected: selectedItem,
      correct: item?.meaning,
      wrong: () => `${quote(selectedMeaning)}は${quote(selectedItem?.phrase)}の意味。共通する単語の印象ではなく、前置詞・副詞まで含む形全体を見分ける。`,
      unknown: `思い出せないときは、中心動詞だけで決めず、後ろの前置詞・副詞が作る方向や状態を手掛かりにする。正解は${quote(meanings)}。`,
      correctAnswer: `${quote(item?.phrase)}は一語ずつの訳より、使う場面と結び付ける。${clean(item?.note)}`,
    }),
    strategy: `「表現の形 → 成り立ち → 例文」の三点セットで覚える。次に同じ表現を見たら、まず${quote(item?.example?.ja)}の場面を思い出す。`,
  })
}

export function buildGrammarInstructorExplanation(item, selected, selectedGuidance) {
  const completed = clean(item?.sentence?.en)
  return explanation({
    answer: `正解は${quote(item?.answer)}。完成文は${quote(completed)}となり、${quote(item?.sentence?.ja)}という意味になる。`,
    evidence: `${clean(item?.explain)} 空所の前後だけでなく、文全体の主語・時制・構造がこの形を要求している。`,
    trap: selectionTrap({
      selected,
      correct: item?.answer,
      wrong: (picked) => selectedGuidance?.summary
        ? `${quote(picked)}はここでは不適切。この文の決め手は ${clean(item?.explain)} なお、${clean(selectedGuidance.summary)}`
        : `${quote(picked)}を入れると、${quote(item?.topic)}の条件と完成文の構造が一致しない。この文の決め手は ${clean(item?.explain)} 正解を入れた文全体で比較する。`,
      unknown: `迷ったときは選択肢を眺め続けず、空所が担う役割を先に言葉にする。この問題では${clean(item?.explain)}`,
      correctAnswer: `正解できた場合も、答えの語だけでなく${quote(item?.topic)}という判断条件を言える状態にしておく。`,
    }),
    strategy: grammarStrategy(item),
  })
}

export function buildReadingInstructorExplanation(question, selected) {
  const basis = stripTerminal(question?.explain)
  return explanation({
    answer: `正解は${quote(question?.answer)}。設問が求める情報に対し、本文と同じ内容を過不足なく言い換えている。`,
    evidence: `${basis}。この本文上の事実を、設問が求める形に言い換えれば正解へ到達する。`,
    trap: selectionTrap({
      selected,
      correct: question?.answer,
      wrong: (picked) => `${quote(picked)}を選ぶには本文中に同内容の根拠が必要だが、この問題の決め手は「${basis}」である。本文にない補足や、別箇所の語だけが一致する選択肢は切る。`,
      unknown: `分からないときは全文を読み直す前に、設問の疑問詞と名詞を本文へ戻す。この問題の根拠は「${basis}」である。`,
      correctAnswer: '正解できても、選択肢の表現ではなく本文のどの一文が根拠かを指せるか確認する。',
    }),
    strategy: readingStrategy(question?.q ?? question?.prompt),
  })
}

export function buildListeningInstructorExplanation(item, selectedChoice) {
  const correctChoice = item?.choices?.find((choice) => choice.id === item.answer)
  const kind = listeningQuestionKind(item)
  const focus = listeningFocus(item)
  const lastUtterance = clean(item?.audio?.at(-1)?.text)
  const answer = item?.type === 'response'
    ? `正解は${quote(correctChoice?.text)}。最後の発話${quote(lastUtterance)}に対し、意味と会話の流れが自然につながる応答である。`
    : item?.type === 'picture'
      ? `正解は${quote(correctChoice?.text)}。${focus}を過不足なく表し、イラストと英文の主語・動作・場所が一致している。`
      : `正解は${quote(correctChoice?.text)}。質問${quote(item?.question)}が求める情報は${quote(focus)}であり、その答えとして放送内容と一致している。`
  const evidence = item?.type === 'response'
    ? `放送の最後は${quote(lastUtterance)}。${stripTerminal(item?.explain)}。したがって${quote(focus)}を満たす${quote(correctChoice?.text)}が会話を正しく続ける。`
    : `${stripTerminal(item?.explain)}。設問の焦点は${quote(focus)}であり、その条件を満たすのが${quote(correctChoice?.text)}である。`
  return explanation({
    answer,
    evidence,
    trap: selectionTrap({
      selected: selectedChoice,
      correct: correctChoice?.text,
      wrong: (picked) => `${quote(picked)}は、設問の焦点${quote(focus)}として放送の決め手と一致しない。${stripTerminal(item?.explain)}。聞こえた一語や途中の情報ではなく、設問が指定した情報の種類まで合わせて切る。`,
      unknown: `聞き取れなかった場合も、まず設問の焦点を${quote(focus)}と日本語で固定する。次に${quote(stripTerminal(item?.explain))}を支える箇所だけを聞き直す。`,
      correctAnswer: `正解できても、聞こえた単語の一致ではなく、${quote(focus)}を放送のどの箇所から判断したかを説明する。`,
    }),
    strategy: listeningStrategy(item),
  })
}

export function buildKotenWordInstructorExplanation(word, selectedWord) {
  const meanings = list(word?.meanings) || clean(word?.meaning)
  const selectedMeaning = selectedWord
    ? list(selectedWord.meanings) || clean(selectedWord.meaning)
    : ''
  const example = word?.example?.ja && word?.example?.gendai
    ? `用例${quote(word.example.ja)}は${quote(word.example.gendai)}。`
    : ''
  return explanation({
    answer: `${quote(word?.word)}の中心義は${quote(meanings)}。品詞は${quote(word?.pos)}である。`,
    evidence: `${clean(word?.note)} 品詞と、人物・物事に向けられた評価の方向を合わせると、この中心義に決まる。${example}`,
    trap: selectionTrap({
      selected: selectedWord,
      correct: word?.meaning,
      wrong: () => `${quote(selectedMeaning)}は${quote(selectedWord?.word)}側の意味。現代語の見た目や音だけでなく、古語の品詞と中心義を照合する。この語の判別点は ${clean(word?.note)}`,
      unknown: `意味が出ないときは、品詞${quote(word?.pos)}と語の感情・評価の向きを先に思い出す。正解は${quote(meanings)}。`,
      correctAnswer: '正解できても、現代語と同じ意味だと思い込まず、古文特有の中心義と文脈での広がりを確認する。',
    }),
    strategy: `古典単語は「中心義 → 文脈での派生義 → 用例」の順で覚える。まず ${clean(word?.note)}`,
  })
}

export function buildKotenGrammarInstructorExplanation(question, selected) {
  return explanation({
    answer: `正解は${quote(question?.answer)}。傍線部だけでなく、接続と文脈を合わせて判定する。`,
    evidence: `${clean(question?.explanation)}${question?.translation ? ` 現代語訳は${quote(question.translation)}。` : ''}`,
    trap: selectionTrap({
      selected,
      correct: question?.answer,
      wrong: (picked) => `${quote(picked)}では、傍線部の接続・活用または文脈上の意味を同時に満たせない。${clean(question?.explanation)}`,
      unknown: `迷ったら語の見た目だけで決めず、直前の活用形を確認する。判定の根拠は ${clean(question?.explanation)}`,
      correctAnswer: '正解できても、名称だけでなく「どの形に接続し、ここでは何を表すか」を一息で説明する。',
    }),
    strategy: classicalGrammarStrategy(question),
  })
}

export function buildKotenCultureInstructorExplanation(question, selected, related) {
  return explanation({
    answer: `正解は${quote(question?.answer)}。古典常識を単語の定義ではなく、本文中の人物・場所・行動の関係へ当てはめる。`,
    evidence: `${clean(question?.explanation)}${related?.core ? ` 背景の核は${clean(related.core)}` : ''}`,
    trap: selectionTrap({
      selected,
      correct: question?.answer,
      wrong: (picked) => `${quote(picked)}は本文の時代背景・身分関係・場面のいずれかと合わない。この問題の決め手は ${clean(question?.explanation)} 用語だけでなく、誰がどこで何をしているかを照合する。`,
      unknown: `分からないときは固有語を「人物・場所・制度・年中行事」のどれかに分類する。そこから本文での役割へ戻す。`,
      correctAnswer: `正解できても、知識を本文の因果へ変換できるか確認する。${clean(related?.examTip)}`,
    }),
    strategy: '古典常識は用語集として暗記せず、①誰の世界か ②どこで起きたか ③その慣習が行動をどう決めたか、の三点で本文へ接続する。',
  })
}

export function buildKotenInterpretationInstructorExplanation(item, selected) {
  return explanation({
    answer: `正解は${quote(item?.answer)}。単語・文法・背景の三つが同じ読みを支えている。`,
    evidence: `単語は ${clean(item?.vocabTip)} 文法は ${clean(item?.grammarTip)} したがって現代語訳は${quote(item?.translation)}となる。`,
    trap: selectionTrap({
      selected,
      correct: item?.answer,
      wrong: (picked) => `${quote(picked)}は、語義・助動詞や活用・省略された主語の少なくとも一つが本文と合わない。この文では ${clean(item?.vocabTip)} ${clean(item?.grammarTip)} 現代語として自然かより先に、原文の形を守る。`,
      unknown: `訳せないときは一気に自然な日本語を作らず、重要語の意味、助動詞・活用、主語の順に骨格を作る。`,
      correctAnswer: `正解できても、${quote(item?.culture?.title)}という背景までつなぐと、同じ表現を別本文でも判断できる。`,
    }),
    strategy: '古文解釈は①重要単語を置く ②助動詞・助詞で関係を決める ③省略された主語を補う ④最後に自然な現代語へ整える。この順序を崩さない。',
  })
}

export function buildDiagnosticInstructorExplanation(question, selected) {
  const review = question?.review?.en && question?.review?.ja
    ? ` 確認例${quote(question.review.en)}は${quote(question.review.ja)}。`
    : ''
  const strategy = question?.skill === 'reading'
    ? readingStrategy(question?.prompt)
    : question?.skill === 'grammar'
      ? grammarStrategy(question)
      : question?.skill === 'usage'
      ? '熟語・語法は一語ずつ直訳せず、前置詞まで含む形と、例文での使われ方を一まとまりで確認する。'
      : '単語は綴りと品詞を確認し、中心義を例文の中で再生する。日本語の選択肢だけを見比べない。'
  const skillLabel = DIAGNOSTIC_SKILL_LABEL[question?.skill] ?? '基礎力'
  return explanation({
    answer: `正解は${quote(question?.answer)}。この一問では${quote(skillLabel)}の基礎となる判断を確認している。`,
    evidence: `${clean(question?.explain)}${review}`,
    trap: selectionTrap({
      selected,
      correct: question?.answer,
      wrong: (picked) => `${quote(picked)}では設問の条件を満たさない。正解の暗記で終えず、${clean(question?.explain)}`,
      unknown: `「わからない」は弱点を正確に見つけた回答。まず ${clean(question?.explain)} を自分の言葉で言い直してから、例文で再確認する。`,
      correctAnswer: '正解できても、勘ではなく根拠を説明できるか確認する。説明できなければ復習対象に含める。',
    }),
    strategy,
  })
}

export function buildMathChoiceInstructorExplanation(problem, question, selected) {
  const correct = question?.choices?.[question.answer]
  return explanation({
    answer: `正解は${quote(correct)}。この選択が、問題で与えられた条件と使うべき方針を同時に満たす。`,
    evidence: `判断の根拠は次の通り。${clean(question?.why ?? question?.note)} 条件を式へ戻しても同じ結論になる。`,
    trap: selectionTrap({
      selected: selected === UNKNOWN_CHOICE_ID ? selected : question?.choices?.[selected],
      correct,
      wrong: (picked) => `${quote(picked)}では問題の条件または途中式と一致しない。この設問の決め手は ${clean(question?.why ?? question?.note)} ${clean(problem?.pitfall)}`,
      unknown: `方針が立たないときは、求めるものと与えられた条件を分け、使う公式を一つに絞る。${clean(problem?.pitfall)}`,
      correctAnswer: `正解できても、選択肢を見ずに理由を言えるか確認する。${clean(problem?.pitfall)}`,
    }),
    strategy: list(problem?.recall?.points, '。') || '条件を式へ翻訳し、一段ずつ計算して、元の問いへ答えが戻っているか検算する。',
  })
}

export function buildMathFillInstructorExplanation(problem, step, selectedValues = []) {
  const correctItems = (step?.fill?.blanks ?? []).map(clean)
  const pickedItems = selectedValues.map(clean)
  const correctValues = list(correctItems, '、')
  const pickedValues = list(selectedValues, '、')
  const sameValues = correctItems.length === pickedItems.length
    && (
      step?.fill?.unordered
        ? [...correctItems].sort().every((value, index) => value === [...pickedItems].sort()[index])
        : correctItems.every((value, index) => value === pickedItems[index])
    )
  return explanation({
    answer: `空欄は${quote(correctValues)}。一つ前の式との関係を保ったまま、この値を当てはめる。`,
    evidence: `この空欄で行っている操作は次の通り。${clean(step?.note)} 前後の式を比べると値の役割が確認できる。`,
    trap: pickedValues && !sameValues
      ? `入れた値${quote(pickedValues)}は途中式の条件と一致しない。この段階では ${clean(step?.note)} ${clean(problem?.pitfall)}`
      : `${step?.fill?.unordered ? '順序を入れ替えても条件を満たす値の組は同じである。' : ''}数値だけを合わせず、なぜこの演算・符号・式変形になるかを確認する。${clean(problem?.pitfall)}`,
    strategy: list(problem?.recall?.points, '。') || '一つ前の式から何を変えたかを言葉にし、等号の左右が同じ量を表すことを毎段確認する。',
  })
}

export function buildMathSolvedInstructorExplanation(problem) {
  const stepReasons = list(problem?.steps?.map((step) => step.note), ' ')
  return explanation({
    answer: `最終答案は${quote(problem?.answer)}。単位や問いの形式まで含めて答える。`,
    evidence: `途中の論理は次の順でつながる。${stepReasons} 各段が一つ前の式・条件から導けることを確認する。`,
    trap: `最も注意したい誤りは次の点。${clean(problem?.pitfall)} 答えが出た後にも、この観点で検算する。`,
    strategy: `${list(problem?.recall?.points, '。')}。解き終えたら、条件への代入・概算・単位の少なくとも一つで検算する。`,
  })
}

export function buildDictationInstructorExplanation(item, result) {
  const attempts = result?.wrongSelections ?? 0
  return explanation({
    answer: `正しい英文は${quote(item?.text)}。意味は${quote(item?.ja)}。`,
    evidence: `この文の聞き取りの核は${quote(item?.focus)}。内容語だけでなく、主語・動詞・接続語を含む意味のまとまりで取る。`,
    trap: attempts > 0
      ? `${attempts}回迷った位置は、単語単体ではなく前後との結び付きが弱かった箇所。日本語順へ引っ張られず、英語の語順のまま区切る。`
      : 'ノーミスでも、カードの形を覚えただけで終えず、音声だけから同じ語順を再現できるかを確認する。',
    strategy: `英文を意味のまとまりで二、三か所に区切り、通常速度で聞く → 見ずに復唱する → ${quote(item?.focus)}を意識してもう一度聞く。`,
  })
}

export function buildWritingInstructorExplanation(step, option, grammar) {
  return explanation({
    answer: `完成文は${quote(option?.text)}。${quote(option?.ja)}を、英語の基本語順で表している。`,
    evidence: `${clean(grammar?.explanation)} この文では ${clean(option?.tip)}`,
    trap: `この段階の条件は${quote(step?.constraint)}。日本語の語順だけで並べると、${quote(grammar?.pattern)}の核が崩れる。この文では${quote(option?.tip)}を外さない。`,
    strategy: `①${quote(step?.prompt)}で文の役割を確認する ②${quote(grammar?.pattern)}の型を先に置く ③${quote(option?.tip)}を確認して残りの語をつなぐ ④完成文を見ずに同じ型でもう一文言う。`,
  })
}

export function isCompleteInstructorExplanation(value) {
  return ['answer', 'evidence', 'trap', 'strategy'].every(
    (key) => (
      clean(value?.[key]).length > 0
      && !/\bundefined\b/.test(clean(value?.[key]))
    ),
  )
}
