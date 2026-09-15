import { UNKNOWN_CHOICE_ID } from './quizChoices.js'
import {
  grammarChoiceMismatchExplanationFor,
  grammarCorrectChoiceExplanationFor,
  grammarExamFocusExplanationFor,
  grammarQuestionExplanationFor,
} from './grammarQuestionExplanations.js'

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
    return 'まず時を示す語と出来事の前後関係を拾い、基準時を現在・過去・未来のどこに置くか決める。最後に主語と動詞の形が合うか確かめる。'
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
    return '空所の後ろが完全文か不完全文かを見て、空所が節をつなぐだけか、節内の主語・目的語を兼ねるかを判定する。先行詞の有無と、人・物・場所・時の区別が合うか確かめる。'
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
    return '空所の後ろが完全文か不完全文かを見て、空所が節をつなぐだけか、節内の主語・目的語を兼ねるかを判定する。先行詞の有無と、人・物・場所・時の区別が合うか確かめる。'
  }
  if (/接続|名詞節|譲歩|相関/.test(value)) {
    return '空所の前後が語・句・節のどれかを判定し、同じ文法上の役割どうしを結ぶ。節なら主語と動詞がそろうか、因果・逆接・譲歩のどの論理関係かまで確認する。'
  }
  if (/be動詞|3単現|3人称単数|主語と動詞|There is\/are/.test(value)) {
    return 'まず主語の人称と単数・複数を確定し、次に時制を決める。その二条件から動詞の形を一つに絞り、完成文を音読して主語と動詞の一致を確認する。'
  }
  if (/名詞の複数形|冠詞|限定詞|数量表現|限定詞・数量|指示語/.test(value)) {
    return '空所の後ろの名詞が数えられるか、単数か複数か、話し手と聞き手の間で特定済みかを順に確認する。数量語・冠詞・指示語と名詞の形が合うか確かめる。'
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
    return 'まず時を示す語と出来事の前後関係を拾い、基準時を現在・過去・未来のどこに置くか決める。最後に主語と動詞の形が合うか確かめる。'
  }
  if (/比較/.test(value)) {
    return '比較する対象の数と、原級・比較級・最上級の合図を先に探す。than、as、of / in まで一まとまりで確認する。'
  }
  if (/受動|分詞|使役|知覚/.test(value)) {
    return '主語・目的語と動作の関係が「する側」か「される側」かを決め、原形・現在分詞・過去分詞を選び分ける。'
  }
  return `まず完成文で必要な意味と品詞を言葉にし、選択肢の語形・語順・結び付きを一つずつ比べる。この問題では${stripTerminal(
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
    return '疑問詞が求める情報の種類を決め、固有名詞・時・場所・動作の周辺を本文から探す。見つけた一文と、選択肢の言い換えを比べる。'
  }
  return '設問のキーワードを本文に戻し、根拠の一文を指で示せる選択肢だけを残す。本文にない常識や印象は足さない。'
}

const DIAGNOSTIC_SKILL_LABEL = Object.freeze({
  vocab: '語彙',
  grammar: '文法',
  usage: '熟語・語法',
  reading: '読解',
})

export function buildGrammarInstructorExplanation(item, selected, selectedGuidance, choices = item?.choices ?? []) {
  if (item?.questionType === 'word-order') {
    const picked = chosenText(selected)
    return explanation({
      answer: `正しい語順は${quote(item?.sentence?.en)}。日本語では${quote(item?.sentence?.ja)}。`,
      evidence: `${clean(item?.explain)} 英文では、主語と動詞の骨格を先に置き、目的語・補語・修飾語をそれぞれの結び付きのまま続ける。`,
      trap: isUnknown(selected)
        ? `分からないときは、まず動詞を探し、その動作をする主語を左に置く。次に${clean(item?.explain)}`
        : picked === clean(item?.answer)
          ? `正解できても、単語を暗記した順ではなく、どの語がどの語に結び付くかを説明する。${clean(item?.explain)}`
          : `並べた文${quote(picked)}では、正しい文${quote(item?.answer)}の語の結び付きと一致しない。${clean(item?.explain)}`,
      strategy: '日本語の語順から一語ずつ置かず、「主語 + 動詞」を最初に作る。次に動詞が必要とする目的語・補語を置き、時・場所・理由などの説明を最後に加える。',
    })
  }
  const decisive = grammarExamFocusExplanationFor(item) || clean(item?.explain)
  const fullExplanation = grammarQuestionExplanationFor(item)
  return explanation({
    answer: grammarCorrectChoiceExplanationFor(item, choices),
    evidence: fullExplanation,
    trap: selectionTrap({
      selected,
      correct: item?.answer,
      wrong: (picked) => selectedGuidance?.summary
        ? `${grammarChoiceMismatchExplanationFor(item, picked)} 基礎規則は ${clean(item?.explain)} なお、別の文では ${clean(selectedGuidance.summary)}`
        : `${grammarChoiceMismatchExplanationFor(item, picked)} 基礎規則は ${clean(item?.explain)} 正解を入れた文全体で比較する。`,
      unknown: `迷ったときは選択肢を眺め続けず、目標の意味と空所の役割を先に言葉にする。${fullExplanation}`,
      correctAnswer: `正解できた場合も、答えの語だけでなく、この文の決め手を説明できるか確認する。${decisive}`,
    }),
    strategy: grammarStrategy(item),
  })
}

export function buildReadingInstructorExplanation(question, selected) {
  const basis = stripTerminal(question?.explain)
  const questionJa = clean(question?.questionJa)
  const answerJa = clean(question?.answerJa ?? question?.choiceTranslations?.[question?.answer])
  const answerTranslation = answerJa ? `（${answerJa}）` : ''
  return explanation({
    answer: `${questionJa ? `設問の和訳は${quote(questionJa)}。` : ''}正解は${quote(question?.answer)}${answerTranslation}。設問が求める情報に対し、本文と同じ内容を過不足なく言い換えている。`,
    evidence: `${basis}。${answerJa ? `したがって、本文の答えは${quote(answerJa)}となる。` : ''}この本文上の事実を、設問が求める形に言い換えれば正解へ到達する。`,
    trap: selectionTrap({
      selected,
      correct: question?.answer,
      wrong: (picked) => {
        const pickedJa = clean(question?.choiceTranslations?.[picked])
        return `${quote(picked)}${pickedJa ? `は${quote(pickedJa)}という意味。` : 'を選ぶには、'}この設問で本文が示す答えは${answerJa ? quote(answerJa) : quote(question?.answer)}であり、決め手は「${basis}」である。別箇所の語だけが一致しても、この設問への答えにならない選択肢は切る。`
      },
      unknown: `分からないときは全文を読み直す前に、${questionJa ? `設問の和訳${quote(questionJa)}を確認し、` : ''}疑問詞と名詞を本文へ戻す。この問題の根拠は「${basis}」である。`,
      correctAnswer: `正解できても、${answerJa ? `英語と和訳${quote(answerJa)}を対応させ、` : ''}本文のどの一文が根拠かを指せるか確認する。`,
    }),
    strategy: readingStrategy(question?.q ?? question?.prompt),
  })
}

export function buildReadingChoiceExplanations(question) {
  const basis = stripTerminal(question?.explain)
  const answerJa = clean(question?.answerJa ?? question?.choiceTranslations?.[question?.answer])

  return {
    question: {
      en: clean(question?.q ?? question?.prompt),
      ja: clean(question?.questionJa),
    },
    choices: (question?.choices ?? []).map((choice) => {
      const ja = clean(question?.choiceTranslations?.[choice])
      const correct = choice === question?.answer
      return {
        en: clean(choice),
        ja,
        correct,
        explanation: correct
          ? `${basis}。この内容が設問に直接答えている。`
          : `${quote(ja || choice)}という内容だが、この設問で本文が示す答えは${quote(answerJa || question?.answer)}である。${basis}。したがって、この選択肢はこの設問への答えにはならない。`,
      }
    }),
  }
}

// 実力診断の文法・読解問題の解説。単語・熟語の問題は意味を知っているかだけを問うので、
// 画面では4段の解説を使わず、語の説明と選択肢の中身だけを示す。
export function buildDiagnosticInstructorExplanation(question, selected) {
  const review = question?.review?.en && question?.review?.ja
    ? ` 確認例${quote(question.review.en)}は${quote(question.review.ja)}。`
    : ''
  const strategy = question?.skill === 'reading'
    ? readingStrategy(question?.prompt)
    : grammarStrategy(question)
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
