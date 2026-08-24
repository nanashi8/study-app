const clean = (value) => String(value ?? '')
  .replace(/\s+/g, ' ')
  .replace(/。{2,}/g, '。')
  .trim()

const quote = (value) => `「${clean(value)}」`
const stripTerminal = (value) => clean(value).replace(/[。.!！?？]+$/u, '')
const asSentence = (value) => {
  const normalized = clean(value)
  return normalized && !/[。.!！?？]$/u.test(normalized) ? `${normalized}。` : normalized
}
const targetMeaning = (item) => stripTerminal(item?.sentence?.ja)

const normalizeEnglish = (value) => clean(value)
  .toLocaleLowerCase('en-US')
  .replace(/[’]/g, "'")
  .replace(/[^a-z]+/g, ' ')
  .trim()

const INFLECTION_GROUPS = Object.freeze([
  ['am', 'is', 'are', 'was', 'were', 'be', 'been', 'being'],
  ['do', 'does', 'did', 'done', 'doing'],
  ['have', 'has', 'had', 'having'],
])

const regularForms = (base) => {
  const forms = new Set([base])
  if (!base || base.includes(' ')) return forms
  forms.add(`${base}s`)
  forms.add(`${base}es`)
  forms.add(`${base}ed`)
  forms.add(`${base}ing`)
  if (base.endsWith('e')) {
    forms.add(`${base}d`)
    forms.add(`${base.slice(0, -1)}ing`)
  }
  if (/[^aeiou]y$/.test(base)) {
    forms.add(`${base.slice(0, -1)}ies`)
    forms.add(`${base.slice(0, -1)}ied`)
  }
  if (/[^aeiou][aeiou][^aeiouwxy]$/.test(base)) {
    const last = base.at(-1)
    forms.add(`${base}${last}ed`)
    forms.add(`${base}${last}ing`)
  }
  return forms
}

const choicesAreOneVisibleInflectionFamily = (choices) => {
  const normalized = choices.map(normalizeEnglish)
  if (normalized.some((choice) => !choice || choice.includes(' '))) return false
  if (INFLECTION_GROUPS.some((group) => normalized.every((choice) => group.includes(choice)))) {
    return true
  }
  return normalized.some((candidate) => {
    const forms = regularForms(candidate)
    return normalized.every((choice) => forms.has(choice))
  })
}

// 語形だけで4択を切れる問題では、解答前の和訳を答えのヒントにしない。
// それ以外は意味も判断材料になるため、和訳を問題の一部として明示する。
export function grammarQuestionNeedsMeaningCue(item) {
  if (typeof item?.meaningCueRequired === 'boolean') return item.meaningCueRequired
  return !choicesAreOneVisibleInflectionFamily(item?.choices ?? [])
}

const blankSides = (item) => {
  const [before = '', after = ''] = clean(item?.q).split('___')
  return {
    before: before.trim().split(/\s+/).filter(Boolean).slice(-4).join(' '),
    after: after.trim().split(/\s+/).filter(Boolean).slice(0, 4).join(' '),
  }
}

const answerRule = (item, reason) => `${reason}。したがって、空所は${quote(item?.answer)}に決まる。`

const FOCUS_CUES = Object.freeze({
  'able-to': (item) => answerRule(item, 'be able to の to の後ろには動詞の原形を置く'),
  'adjective-complement': (item) => answerRule(
    item,
    `${/\bremain(?:ed|s)?\b/i.test(clean(item?.q)) ? 'remain は主語の状態が続くことを示す連結動詞なので' : 'be動詞の後ろで主語の状態を説明するため'}、程度を表す副詞の後ろには補語となる形容詞${quote(item?.answer)}が必要である`,
  ),
  'afford-infinitive': (item) => answerRule(item, 'afford は「〜する余裕がある」の意味では to不定詞を目的語に取る'),
  'agree-infinitive': (item) => answerRule(item, 'agree は「〜することに同意する」の意味では to不定詞を取る'),
  'all-pronoun': (item) => answerRule(item, '「全員」を一まとまりで指し、of the students の前に置く'),
  'allowed-to-negative': (item) => answerRule(item, 'be allowed to の to の後ろには動詞の原形を置く'),
  'allowed-to-question': (item) => answerRule(item, 'be allowed to の to の後ろには動詞の原形を置く'),
  'always-imperative': (item) => answerRule(item, '「いつも・必ず〜しなさい」は〈Always＋動詞の原形〉で表す'),
  'another-noun': (item) => answerRule(item, '単数名詞の前で「もう一つの・別の」を表すには another を置く'),
  'another-same-kind': (item) => answerRule(item, 'すでに出た単数の物と同種の「別の一つ」は another one で表す'),
  'as-as-ever': (item) => answerRule(item, 'as ... as ever で「相変わらず・これまでと同じくらい」を表す'),
  'as-as-possible': (item) => answerRule(item, 'as ... as possible の最初と最後の as をそろえて「できるだけ〜」を表す'),
  'be-form': (item) => answerRule(item, 'be supposed to の be動詞を主語と時制に一致させる'),
  'be-imperative': (item) => answerRule(item, 'be動詞の肯定命令は主語を置かず〈Be＋補語〉で始める'),
  'be-imperative-adjective': (item) => answerRule(item, '形容詞を補語にする命令文は〈Be＋形容詞〉で作る'),
  'be-used-to-gerund': (item) => answerRule(item, 'be used to の to は前置詞なので、後ろには動名詞を置く'),
  'both-pronoun': (item) => answerRule(item, '二人・二つの「両方」を指す主語には both を使う'),
  'by-oneself-idiom': (item) => answerRule(item, 'by oneself で「一人で・自力で」を表し、主語に再帰代名詞を一致させる'),
  'comparative-complement': (item) => answerRule(
    item,
    clean(item?.answer).toLocaleLowerCase('en-US') === 'more'
      ? 'than が比較の相手を導き、長い形容詞 convincing の比較級は〈more convincing〉で作る。far はその比較級を強める'
      : `than が比較の相手を導き、形容詞 high を比較級${quote(item?.answer)}にする。considerably はその比較級を強める`,
  ),
  'comparative-of-two': (item) => answerRule(item, '二者のうち「より〜な方」は〈the＋比較級＋of the two〉で表す'),
  'consider-gerund': (item) => answerRule(item, 'consider は「〜することを検討する」の意味では動名詞を取る'),
  'degree-adverb': (item) => {
    const cue = {
      almost: 'identical を修飾して「完全に同じではないが、ほとんど同じ」と表す程度副詞は almost である',
      practically: 'impossible を修飾して「実際上・事実上ほぼ不可能」と表す程度副詞は practically である',
      barely: '動詞 remember を修飾して「かろうじてしか思い出せない・ほとんど思い出せない」と表す副詞は barely である',
    }[clean(item?.answer).toLocaleLowerCase('en-US')]
    return answerRule(item, cue || '形容詞・動詞・数量表現の程度を示す位置には副詞が必要である')
  },
  'demonstrative-object-position': (item) => answerRule(item, 'すでに話題にした近くの単数物を目的語として単独で指す'),
  'demonstrative-question-form': (item) => answerRule(item, 'here が示す近くの単数物を、be動詞の主語として指す'),
  'difficulty-noun': (item) => answerRule(item, 'have difficulty/trouble doing の have の目的語には名詞を置く'),
  'do-support-use': (item) => answerRule(item, 'did の後ろでは used ではなく動詞原形 use に戻す'),
  'duration-marker': (item) => answerRule(item, '期間をたずねる現在完了の疑問は How long で始める'),
  'each-other-reciprocal': (item) => answerRule(item, '二人以上が「お互いに」動作を向け合うので each other を目的語にする'),
  'each-pronoun': (item) => answerRule(item, '集団の一人一人を個別に捉えるので Each of ... を使い、動詞は単数扱いにする'),
  'emphatic-itself': (item) => answerRule(item, '直前の単数名詞を「それ自体」と強調する再帰代名詞を置く'),
  'emphatic-reflexive-subject': (item) => answerRule(item, '主語本人が行ったことを強調するため、主語に一致する再帰代名詞を添える'),
  'expect-infinitive': (item) => answerRule(item, 'expect は「〜することを期待する」の意味では to不定詞を取る'),
  'gerund-after-to': (item) => answerRule(item, 'be used to の to は前置詞なので、後ろには動名詞を置く'),
  'get-used-to-form': (item) => answerRule(item, 'get used to で「〜に慣れる」を表すので used を置く'),
  'give-up-gerund': (item) => answerRule(item, 'give up の後ろで「〜することをやめる」と表すには動名詞を置く'),
  'group-among': (item) => answerRule(item, '三人以上の集団の間で分ける関係には among を使う'),
  'had-better-base-verb': (item) => answerRule(item, 'had better の直後には to を付けず動詞の原形を置く'),
  'have-to-negative-auxiliary': (item) => answerRule(item, 'does not の後ろでは has ではなく原形 have に戻す'),
  'have-perfect-tag': (item) => answerRule(item, '現在完了の肯定文なので、has を保った否定形の付加疑問にし、主語を she で受ける'),
  'i-am-special': (item) => answerRule(item, 'I am ... の付加疑問は例外的に aren’t I を使う'),
  'imperative-will-you-tag': (item) => answerRule(item, '命令文の付加疑問には通常 will you を付ける'),
  'in-marker': (item) => answerRule(item, 'have difficulty in doing の省略可能な前置詞位置なので in を置く'),
  'indefinite-everyone-everything': (item) => answerRule(item, '人について「全員」を表し、単数扱いの動詞 passed の主語になる'),
  'indefinite-someone-anyone': (item) => answerRule(item, '否定を含む文脈で、特定しない「誰か・誰も」を表す anyone を使う'),
  'indefinite-something-nothing': (item) => answerRule(item, 'something wrong で「どこかおかしい・何か問題がある」を表す'),
  'inflected-have': (item) => answerRule(item, '必要・義務を表す have to の have を主語の人称・数と時制に一致させる'),
  'infinitive-complement': (item) => answerRule(item, '直前の動詞が to不定詞を目的語に取る'),
  'intensifier-comparative': (item) => answerRule(
    item,
    clean(item?.answer).toLocaleLowerCase('en-US') === 'even'
      ? '比較級 longer の前で「さらに」と差が増すことを表す強調語は even である'
      : '比較級 faster の前で「ずっと」と差が大きいことを表す強調語は much である',
  ),
  'inverted-word-order': (item) => answerRule(item, 'Not until が文頭にあるため、主節を〈be動詞＋主語＋補語〉の倒置語順にする'),
  'it-distance': (item) => answerRule(item, '距離を表す文の形式主語には It を使う'),
  'it-time': (item) => answerRule(item, '時刻を表す文の形式主語には It を使う'),
  'it-vs-one-contrast': (item) => answerRule(item, '同じ物そのものではなく、同種の新しい一つを指すので one を使う'),
  'it-weather': (item) => answerRule(item, '天候を表す文の形式主語には It を使う'),
  'learn-infinitive': (item) => answerRule(item, 'learn は「〜することを身につける」の意味では to不定詞を取る'),
  'lets-negative-suggestion': (item) => answerRule(item, '「〜しないようにしよう」という否定の勧誘は〈Let’s not＋動詞の原形〉で表す'),
  'lets-suggestion': (item) => answerRule(item, '「一緒に〜しよう」という勧誘は〈Let’s＋動詞の原形〉で表す'),
  'lets-suggestion-second': (item) => answerRule(item, '「一緒に〜しよう」という勧誘は〈Let’s＋動詞の原形〉で表す'),
  'mind-gerund': (item) => answerRule(item, 'Would you mind ...? の mind の後ろには動名詞を置く'),
  'modal-must': (item) => answerRule(item, '本文の must を保ち、肯定文なので否定形の付加疑問にする'),
  'modal-should-negative': (item) => answerRule(item, '本文の should を保ち、否定文なので肯定形の付加疑問にする'),
  'negative-be-imperative-caution': (item) => answerRule(item, 'Don’t の後ろでは be動詞も原形 be にする'),
  'negative-be-imperative-encourage': (item) => answerRule(item, 'Don’t の後ろでは be動詞も原形 be にする'),
  'negative-be-used-to': (item) => answerRule(item, 'be not used to で「〜に慣れていない」を表すので used を置く'),
  'negative-imperative': (item) => answerRule(item, '「〜するな・〜しないで」という否定命令は〈Don’t＋動詞の原形〉で表す'),
  'negative-imperative-dont': (item) => answerRule(item, '「〜するな・〜しないで」という否定命令は〈Don’t＋動詞の原形〉で表す'),
  'negative-meaning': (item) => answerRule(item, '「〜する必要はない」は must not ではなく do not have to で表す'),
  'negative-position': (item) => answerRule(item, '要求・必要性を表す that 節の動詞を否定するときは原形の直前に not を置く'),
  'negative-use-to': (item) => answerRule(item, 'did not の後ろでは used ではなく原形 use に戻す'),
  'never-imperative': (item) => answerRule(item, '「決して〜するな」という強い否定命令は〈Never＋動詞の原形〉で表す。Don’t は一般的な「〜するな」だが、目標の意味にある「決して」まで表すのは Never である'),
  'no-other-as-as': (item) => answerRule(item, 'No other ... is as＋原級＋as で「ほかに同じほど〜なものはない」を表す'),
  'not-as-as': (item) => answerRule(item, 'not as＋原級＋as で「…ほど〜ではない」を表す'),
  'not-until-marker': (item) => answerRule(item, '「〜して初めて」を表す時のまとまりを文頭に出すので Not until を置く'),
  'once-time': (item) => answerRule(item, '「いったん〜すれば・〜したら」という時の節を Once で導く'),
  'one-another-reciprocal': (item) => answerRule(item, '複数の人が「互いに」動作を向け合うので one another を目的語にする'),
  'one-of-the-superlative': (item) => answerRule(item, 'one of the＋最上級＋複数名詞で「最も〜なものの一つ」を表す'),
  'one-substitute': (item) => answerRule(item, 'すでに出た単数可算名詞を繰り返さず one で受ける'),
  'ones-plural-substitute': (item) => answerRule(item, 'すでに出た複数可算名詞を繰り返さず ones で受ける'),
  'object-pronoun': (item) => answerRule(item, '動詞・前置詞の目的語位置なので、前に出た名詞に合う目的格の代名詞を使う'),
  'other-plural-noun': (item) => answerRule(item, '複数名詞の前で不特定の「ほかの」を表すので other を置く'),
  'others-indefinite': (item) => answerRule(item, '名詞を伴わず不特定の「ほかの人たち」を指すので others を使う'),
  'others-remainder': (item) => answerRule(item, '先に挙げた人以外の不特定の人たちを名詞なしで受けるので others を使う'),
  'pair-between': (item) => answerRule(item, '二つの物の間を表すので between を使う'),
  'please-imperative': (item) => answerRule(item, '依頼を丁寧にするため命令文の先頭に Please を置く'),
  'possessive-adjective': (item) => answerRule(item, '直後の名詞が誰のものかを示す位置なので所有格を使う'),
  'possessive-pronoun': (item) => answerRule(item, '後ろに名詞を置かず「〜のもの」と表す位置なので所有代名詞を使う'),
  'predicate-verb': (item) => answerRule(item, '譲歩の as 節でも主語の後ろには述語動詞が必要である'),
  'promise-infinitive': (item) => answerRule(item, 'promise は「〜すると約束する」の意味では to不定詞を取る'),
  'provided-that': (item) => answerRule(item, 'provided that の that を補って「〜という条件で」を表す'),
  'purpose-so-that': (item) => answerRule(item, '後ろが主語＋助動詞＋動詞の節なので、目的を表す so that でつなぐ'),
  'purpose-so-that-emphasis': (item) => answerRule(item, '「〜できるように」という目的を表し、後ろに節が続くので so that を使う'),
  'question-use-to': (item) => answerRule(item, 'Did の後ろでは used ではなく原形 use に戻して Did ... use to do? とする'),
  'reflexive-herself': (item) => answerRule(item, '主語 Aya と動作の相手が同じ女性なので herself を使う'),
  'reflexive-himself': (item) => answerRule(item, '主語 Tom と動作の相手が同じ男性なので himself を使う'),
  'reflexive-myself': (item) => answerRule(item, '主語 I と動作の相手が同じなので myself を使う'),
  'reflexive-ourselves': (item) => answerRule(item, '主語 We と動作の相手が同じなので ourselves を使う'),
  'reflexive-themselves': (item) => answerRule(item, '複数主語と動作の相手が同じなので themselves を使う'),
  'reflexive-yourself': (item) => answerRule(item, '主語 you と動作の相手が同じなので yourself を使う'),
  'required-to': (item) => answerRule(item, 'be required to の to の後ろには動詞の原形を置く'),
  'some-others-contrast': (item) => answerRule(item, 'some ... others ... で「〜する人もいれば、ほかの人は…」と対比する'),
  'subject-position': (item) => answerRule(
    item,
    /^not until\b/i.test(clean(item?.q))
      ? 'Not until により主節は〈did＋主語＋動詞の原形〉へ倒置しているため、did の直後かつ understand の前には主語を置く'
      : '譲歩の〈形容詞＋as＋主語＋be動詞〉で、as の後ろには主格の主語を置く',
  ),
  'subject-pronoun': (item) => answerRule(item, '文の主語位置なので、指す人と数に合う主格の代名詞を使う'),
  'supposed-form': (item) => answerRule(item, '〈be supposed to＋原形〉の決まった形を作る'),
  'supposed-to-negative': (item) => answerRule(item, 'be supposed to の to の後ろには動詞の原形を置く'),
  'supposed-to-past': (item) => answerRule(item, 'was supposed to の to の後ろには動詞の原形を置く'),
  'supposed-to-question': (item) => answerRule(item, 'be supposed to の to の後ろには動詞の原形を置く'),
  'than-any-other': (item) => answerRule(item, '比較級＋than any other＋単数名詞で「ほかのどの〜よりも」を表す'),
  'that-referring-back': (item) => answerRule(item, '直前の出来事全体を「そのこと」と受けるので That を使う'),
  'the-other-of-two': (item) => answerRule(item, '二つのうち一方を one で示した後の「もう一方」は the other で表す'),
  'the-others-definite-remainder': (item) => answerRule(item, '範囲が決まった集団の「残り全部」を名詞なしで指すので the others を使う'),
  'there-be-tag': (item) => answerRule(item, 'There is/are の付加疑問でも主語位置には there を保つ'),
  'there-used-to-be': (item) => answerRule(item, 'There used to be で「以前〜があった」を表すので used を置く'),
  'this-it-contrast': (item) => answerRule(item, '一度示した単数の物を次の文で受け直す代名詞には It を使う'),
  'this-that-contrast': (item) => answerRule(item, '話し手の手元の this と対比し、相手の手元にある単数名詞には that を使う'),
  'these-those-subject-verb': (item) => answerRule(item, '近くの複数物を指し、複数動詞 belong と一致する These を使う'),
  'used-marker': (item) => answerRule(item, 'be used to＋名詞・動名詞で「〜に慣れている」を表すので used を置く'),
  'used-to-base': (item) => answerRule(item, 'used to の後ろには動詞の原形を置く'),
  'used-to-base-verb': (item) => answerRule(item, '過去の習慣を表す used to の後ろには動詞の原形を置く'),
  'used-to-form': (item) => answerRule(item, 'There used to be の be は動詞原形にする'),
  'whatever-may-be': (item) => answerRule(item, 'Whatever＋主語＋may be で「〜が何であっても」を表す'),
  'whatever-object': (item) => answerRule(item, '後続節で needed の目的語を兼ね、「必要なものは何でも」と表すので whatever を使う'),
  'whatever-plus-noun': (item) => answerRule(item, 'Whatever＋名詞で「どんな〜であっても」を表す'),
  'whenever-time': (item) => answerRule(item, '時について「〜するときはいつでも」と表すので whenever を使う'),
  'wherever-place': (item) => answerRule(item, '場所について「どこで〜しても」と表すので wherever を使う'),
  'whether-clause': (item) => answerRule(item, '真偽が未確定の「〜かどうか」を表す名詞節なので whether を使う'),
  'whether-infinitive': (item) => answerRule(item, 'whether to do で「〜するかどうか」を表す'),
  'whether-or-clause': (item) => answerRule(item, 'or で二つの選択肢を並べる「〜か…か」なので whether を使う'),
  'which-one-response': (item) => answerRule(item, '提示された単数の選択肢の一方を「こちら」と指すので this を使う'),
  'whichever-plus-noun': (item) => answerRule(item, '限られた候補から「どの〜でも」を表すので whichever＋名詞を使う'),
  'whoever-subject': (item) => answerRule(item, '後続節の主語を兼ねて「〜する人は誰でも」と表すので whoever を使う'),
  'whomever-object': (item) => answerRule(item, '後続節の目的語を兼ねて「誰を〜しても」と表すので whomever を使う'),
  'whose-these-those': (item) => answerRule(item, '近くにある複数物を指し、複数動詞 are と一致する these を使う'),
})

function patternedFocusCue(item) {
  const focus = clean(item?.examFocus)
  const answer = quote(item?.answer)

  if (focus === 'that-subject-clause') {
    return answerRule(
      item,
      '空所から述語動詞までの完全文を「〜ということ」という一つの主語にするため、内容を表す接続詞 That で名詞節を導く',
    )
  }

  if (/^(?:this|that|these|those)-(?:subject|adjective|noun)/.test(focus)) {
    const near = focus.startsWith('this-') || focus.startsWith('these-')
    const plural = focus.startsWith('these-') || focus.startsWith('those-')
    const role = focus.includes('-adjective-') || focus.includes('-noun-')
      ? '後ろの名詞を直接修飾する'
      : '名詞を伴わず主語になる'
    return answerRule(
      item,
      `${near ? 'here・近く' : 'over there・遠く'}を指し、${plural ? '複数' : '単数'}で、${role}`,
    )
  }

  if (/^(?:be|general)-(?:present|past)-(?:affirmative|negative)$/.test(focus)) {
    const negativeBody = focus.endsWith('-negative')
    const tense = focus.includes('-past-') ? '過去' : '現在'
    const verbKind = focus.startsWith('be-') ? 'be動詞' : '一般動詞を支える助動詞'
    return answerRule(
      item,
      `付加疑問は本文と同じ${tense}の${verbKind}と対応する代名詞を使い、本文が${negativeBody ? '否定なので肯定形' : '肯定なので否定形'}にする`,
    )
  }

  if (/^emphatic-(?:do|does|did)/.test(focus)) {
    const tense = focus.includes('-did') ? '過去形' : '現在形'
    return answerRule(item, `一般動詞を「本当に・確かに」と強調し、主語と${tense}に合う do / does / did を原形動詞の前に置く`)
  }
  if (focus === 'emphatic-very-noun') {
    return answerRule(item, 'the very＋名詞で「まさにその〜」と名詞を強調する')
  }

  if (focus === 'base-verb') {
    return answerRule(item, '直前の助動詞・do・does・did・to、またはこの文型が動詞の原形を要求する')
  }
  if (focus === 'base-form') {
    return answerRule(item, '同等比較の〈as＋原級＋as〉なので、形容詞・副詞を比較級や最上級にせず原級で置く')
  }
  if (focus === 'base-verb-imperative') {
    return answerRule(item, '肯定命令は主語を置かず動詞の原形で始める')
  }
  if (focus === 'base-verb-imperative-please') {
    return answerRule(item, 'please が丁寧さを示しており、命令文の動詞は原形にする')
  }

  if (focus === 'do-support') {
    return answerRule(
      item,
      clean(item?.answer).toLocaleLowerCase('en-US') === 'have'
        ? 'does not がすでに否定を作っているので、その後ろの have to は原形 have に戻す'
        : `一般動詞の現在形の否定・疑問を作る助動詞を主語に一致させる。この文の主語には${quote(item?.answer)}を使う`,
    )
  }
  if (focus === 'negator') {
    return answerRule(item, 'do / does と動詞原形の間に否定語 not を置く')
  }
  if (focus === 'negative-phrase') {
    return answerRule(item, '一般動詞の現在形を否定するため、主語に合う do not / does not を動詞原形の前に置く')
  }
  if (focus === 'negative-marker') {
    return answerRule(item, '比較表現を否定して「…ほど〜ではない」にする位置へ not を置く')
  }
  if (focus === 'negative-quantifier') {
    const cue = {
      nothing: 'removed の目的語として「何も取り除かなかった」と言い切る代名詞 nothing を置き、practically が「ほとんど」を加える',
      no: 'chance という名詞を直接否定する限定詞 no を置き、virtually no chance で「可能性はほぼない」とする',
      any: '否定に近い hardly の後ろで、数えられない名詞 evidence を限定する any を置く',
    }[clean(item?.answer).toLocaleLowerCase('en-US')]
    return answerRule(item, cue || '後ろの名詞の有無と否定の範囲に合う数量語を選ぶ')
  }

  if (focus === 'auxiliary') {
    return answerRule(item, '現在完了の疑問文なので、主語の単数・複数に合う Have / Has を文頭に置く')
  }
  if (focus === 'participle') {
    return answerRule(item, 'have / has の後ろなので動詞の過去分詞を置く')
  }
  if (focus === 'perfect-adverb') {
    const cue = {
      ever: '疑問文の完了形で「これまでに〜したことがあるか」と経験をたずねる副詞は ever である',
      yet: '疑問文の文末で「もう〜したか」と完了をたずねる副詞は yet である',
      already: 'had been explained の間に入り、過去の基準時までに「すでに」説明済みだったことを表す副詞は already である',
    }[clean(item?.answer).toLocaleLowerCase('en-US')]
    return answerRule(item, cue || '完了形の経験・完了と位置に合う副詞を選ぶ')
  }
  if (focus === 'perfect-auxiliary') {
    return answerRule(item, '完了形の助動詞 have / has / had を主語と基準時に一致させる')
  }
  if (focus === 'been-marker') {
    return answerRule(item, '完了形と受動態を重ねるため〈have / has / had＋been＋過去分詞〉の been を置く')
  }
  if (focus === 'past-participle') {
    return answerRule(item, '受動態の be / been の後ろなので動詞の過去分詞を置く')
  }
  if (/^past-perfect-progressive-/.test(focus)) {
    return answerRule(item, '過去の基準時まで続いていた動作を〈had been＋動詞ing〉で表すため、動詞ing形を置く')
  }

  if (focus === 'gerund-complement' || focus === 'gerund-after-noun') {
    return answerRule(item, '直前の動詞・名詞が後ろに動名詞を取る決まった結び付きである')
  }
  if (focus === 'governing-verb') {
    const cue = {
      enjoyed: '後ろが walking という動名詞で、日本語は「歩くことを楽しんだ」なので〈enjoy＋動名詞〉を過去形にする',
      want: '後ろが to keep というto不定詞で、日本語は「借りておきたい」なので〈want＋to不定詞〉を使う',
      kept: '後ろが smiling という動名詞で、日本語は「ほほ笑み続けた」なので〈keep＋動名詞〉を過去形にする',
    }[clean(item?.answer).toLocaleLowerCase('en-US')]
    return answerRule(item, cue || '後ろの形と日本語の意味の両方に合う動詞を選ぶ')
  }
  if (focus === 'have-support') {
    return answerRule(item, 'have difficulty / trouble doing の have を主語と時制に一致させる')
  }
  if (focus === 'to-marker') {
    return answerRule(item, '直前の語と動詞原形を結ぶ不定詞の to、または決まった句の to が必要な位置である')
  }
  if (/^(?:avoid|imagine)-gerund$/.test(focus)) {
    return answerRule(item, `${focus.split('-')[0]} は目的語に動名詞を取る`)
  }

  if (focus === 'passive-be') {
    return answerRule(
      item,
      /supposed to\s+___/i.test(clean(item?.q))
        ? 'be supposed to の to の後ろは原形で、さらに後ろの過去分詞と受動態を作るため〈to be＋過去分詞〉にする'
        : '提案・要求・命令を表す動詞の that 節では動詞を原形にし、主語が動作を受けるため〈be＋過去分詞〉の受動態にする',
    )
  }
  if (focus === 'trigger-expression') {
    return answerRule(item, '要求・提案・必要性を表す語が後ろの that 節で動詞原形を要求する')
  }
  if (focus === 'that-marker') {
    return answerRule(item, '要求・提案の内容を表す that 節を導く接続詞が必要である')
  }

  if (focus === 'as-marker') {
    return answerRule(item, '前に出した形容詞・副詞・無冠詞名詞の後ろへ as を置き、譲歩の節を作る')
  }
  if (focus === 'fronted-adverb') {
    return answerRule(item, '譲歩の as より前に副詞を出して〈副詞＋as＋主語＋動詞〉の語順にする')
  }
  if (focus === 'fronted-complement') {
    return answerRule(item, '譲歩の as より前に主語を説明する補語を出す')
  }
  if (focus === 'inverted-auxiliary') {
    return answerRule(item, 'Not until が文頭にあるため、主節の助動詞を主語の前に出す')
  }

  if (/^(?:opening|closing)-as$/.test(focus)) {
    return answerRule(item, '同等比較の〈as＋原級＋as〉で不足している as を置く')
  }
  if (focus === 'multiple-times-as-as') {
    return answerRule(item, '倍数＋as＋原級＋as の最後の as を置く')
  }
  if (focus === 'less-than') {
    return answerRule(item, 'less＋原級＋than で「…より〜でない」を表す')
  }

  if (/^(?:time|continuation|duration|deadline|before|after|until|till|as|once)-/.test(focus)
    || /^(?:before|after|until|till)-time$/.test(focus)) {
    const timeMeaning = {
      'time-by-deadline': '期限の「〜までに」には by を使う',
      'deadline-by': '期限の「〜までに」には by を使う',
      'time-until-point': '動作・状態が続く終点の「〜まで」には until を使う',
      'continuation-until': '動作・状態が続く終点の「〜まで」には until を使う',
      'continuation-till': '動作・状態が続く終点の「〜まで」には till を使う',
      'time-till-point': '動作・状態が続く終点の「〜まで」には till を使う',
      'duration-since-point': '継続の開始時点には since を使う',
      'time-since-perfect': '現在完了の継続を始めた時点には since を使う',
      'duration-for': '継続した期間には for を使う',
      'time-for-duration': '継続した期間には for を使う',
      'time-during-period': '特定の期間中を表す名詞の前には during を使う',
      'time-during': '特定の期間中を表す名詞の前には during を使う',
      'time-before': 'ある時・出来事より前には before を使う',
      'before-time': '「〜する前に」の時の節は before で導く',
      'time-after': 'ある時・出来事より後には after を使う',
      'after-time': '「〜した後に」の時の節は after で導く',
      'until-time': '「〜するまで」動作を続ける節は until で導く',
      'till-time': '「〜するまで」動作を続ける節は till で導く',
      'time-till': '「〜するまで」動作を続ける節は till で導く',
      'as-time': '二つの出来事が重なる「〜したとき」は as で導く',
      'once-time': '「いったん〜すれば・〜したら」は once で導く',
      'time-once': '「いったん〜すれば・〜したら」は once で導く',
      'time-while': '二つの動作が同時に続く「〜する間」は while で導く',
    }[focus]
    if (timeMeaning) return answerRule(item, timeMeaning)
  }

  if (/^(?:direction|motion|location|place)-/.test(focus)) {
    const relation = focus.split('-').at(-1)
    const meanings = {
      across: '一方の側から反対側へ横切る関係',
      along: '線・道・海岸などに沿って進む関係',
      through: '空間・内部を通り抜ける関係',
      over: '物の上を越える関係',
      around: '物の周囲を回る関係',
      behind: '物の後ろの位置関係',
      among: '三つ以上の物に囲まれた位置関係',
      between: '二つの物の間の位置関係',
      above: '接触せず基準より上にある位置関係',
      below: '基準より下にある位置関係',
      near: '近くにある位置関係',
    }
    if (meanings[relation]) return answerRule(item, meanings[relation])
  }

  if (/^(?:reason|condition|concession|although|though|if|unless|since|while)-/.test(focus)
    || focus === 'contrast-in-case-even-if') {
    const logic = {
      'reason-since': '聞き手にも分かっている理由を「〜なので」と示すので Since',
      'reason-as': '理由を背景として「〜なので」と示すので As',
      'since-reason': '理由を「〜なので」と示すので Since',
      'condition-unless': '「〜しない限り」という否定条件なので Unless',
      'unless-condition': '「〜しない限り」という否定条件なので Unless',
      'condition-provided': '「〜という条件なら」という限定条件なので Provided',
      'condition-if': '一般的な「もし〜なら」という条件なので If',
      'if-condition': '一般的な「もし〜なら」という条件なので If',
      'concession-though': '事実を認めて「〜だけれども」と譲歩するので Though',
      'though-concession': '事実を認めて「〜だけれども」と譲歩するので Though',
      'concession-although': '事実を認めて「〜だけれども」と譲歩するので Although',
      'although-concession': '事実を認めて「〜だけれども」と譲歩するので Although',
      'concession-even-though': '実際の事実を強く認めて「〜だけれども」と譲歩するので Even though',
      'while-simultaneous': '二つの動作が同時に進む「〜する間」なので While',
      'contrast-in-case-even-if': '懐中電灯が止まる可能性に前もって備える「〜の場合に備えて」なので in case。even if は「たとえ〜でも」で、備えの目的を表さない',
    }[focus]
    if (logic) return answerRule(item, logic)
  }
  if (focus === 'reason-because-of') {
    return answerRule(item, '後ろが名詞句なので、理由を表す前置詞句 because of を使う')
  }
  if (focus === 'concession-despite') {
    return answerRule(item, '後ろが名詞句なので、「〜にもかかわらず」を表す前置詞 despite を使う')
  }

  if (/^(?:another|other|others|the-other|the-others|one|ones|some-others|each-other|one-another)/.test(focus)) {
    return answerRule(item, '前に出た名詞が単数か複数か、範囲が特定されているかを合わせて代名詞を選ぶ')
  }

  if (/^(?:appositive-that|that-object-clause|that-subject-clause)$/.test(focus)) {
    const role = focus === 'appositive-that'
      ? '直前の名詞の内容を説明する同格節'
      : focus === 'that-subject-clause'
        ? '文全体の主語になる内容節'
        : '動詞の目的語になる内容節'
    return answerRule(item, `${role}は、要素の欠けていない完全文を that で導く`)
  }
  if (/^what-(?:subject|object|thing)-clause$/.test(focus)) {
    return answerRule(item, '後続節で欠けている名詞要素を兼ねて「〜するもの・こと」を表すので what を使う')
  }
  if (focus === 'if-noun-clause') {
    return answerRule(item, '二択を明示しない「〜かどうか」の目的語節なので if を使える')
  }

  if (/^however-(?:adj|adv)-concession$/.test(focus)) {
    return answerRule(item, '〈However＋形容詞・副詞＋主語＋動詞〉で「どれほど〜しても」を表す')
  }

  return ''
}

export function grammarExamFocusExplanationFor(item) {
  if (!item?.examFocus) return ''
  const exact = FOCUS_CUES[item.examFocus]
  return clean(exact ? exact(item) : patternedFocusCue(item))
}

const withoutAnswerConclusion = (value) => clean(value).replace(
  /。したがって、空所は「[^」]+」に決まる。?$/u,
  '',
)

export function grammarAnswerEvidenceFor(item) {
  if (!item) return null
  const { before, after } = blankSides(item)
  const visiblePrompt = clean(item.q).replace('___', '［空所］')
  const position = before && after
    ? `空所の直前が${quote(before)}、直後が${quote(after)}`
    : before
      ? `空所の直前が${quote(before)}で、空所は文末側にある`
      : after
        ? `文頭の空所の直後が${quote(after)}`
        : '空所の前後を完成文全体で確かめる'
  const focusRule = withoutAnswerConclusion(grammarExamFocusExplanationFor(item))
  const baseRule = asSentence(item.explain)
  const rule = asSentence(focusRule || baseRule)
  const requiresMeaningCue = grammarQuestionNeedsMeaningCue(item)
  const completed = clean(item?.sentence?.en)
  return {
    requiresMeaningCue,
    englishClue: `問題文${quote(visiblePrompt)}で、${position}。`,
    meaningClue: requiresMeaningCue
      ? `和訳${quote(targetMeaning(item))}も選択条件である。`
      : '',
    baseRule,
    rule,
    conclusion: `この手掛かりと規則を4択すべてに当てはめると、${quote(item.answer)}だけが完成文${quote(completed)}の形と意味を同時に満たす。したがって、空所は${quote(item.answer)}に決まる。`,
  }
}

export function grammarCorrectChoiceExplanationFor(item) {
  const evidence = grammarAnswerEvidenceFor(item)
  if (!evidence) return ''
  const otherChoices = (item?.choices ?? [])
    .filter((choice) => choice !== item.answer)
    .map(quote)
    .join('・')
  return clean([
    `${quote(item.answer)}が正解。`,
    `英語の手掛かり：${evidence.englishClue}`,
    evidence.meaningClue && `意味の手掛かり：${evidence.meaningClue}`,
    `適用する規則：${evidence.rule}`,
    evidence.conclusion,
    otherChoices && `残りの3択（${otherChoices}）は、この形・意味・文脈の少なくとも一つを満たさないため、正解は一つに決まる。`,
  ].filter(Boolean).join(' '))
}

export function grammarQuestionExplanationFor(item) {
  if (!item) return ''
  const evidence = grammarAnswerEvidenceFor(item)
  return clean([
    evidence.baseRule !== evidence.rule && `基礎規則：${evidence.baseRule}`,
    `英語の手掛かり：${evidence.englishClue}`,
    evidence.meaningClue && `意味の手掛かり：${evidence.meaningClue}`,
    `この問題に適用する規則：${evidence.rule}`,
    evidence.conclusion,
    `正解を入れた完成文は${quote(item?.sentence?.en)}で、意味は${quote(targetMeaning(item))}。`,
  ].filter(Boolean).join(' '))
}

const wrongChoiceExplanation = (item, choice, specificReason = '') => {
  const evidence = grammarAnswerEvidenceFor(item)
  const attempted = clean(item?.q).replace('___', clean(choice))
  return clean([
    specificReason,
    `${quote(choice)}を入れると${quote(attempted)}となる。`,
    `英語の手掛かり：${evidence.englishClue}`,
    `意味の確認：和訳は${quote(targetMeaning(item))}。`,
    `適用する規則：${evidence.rule}`,
    `この条件を満たすのは${quote(item.answer)}であり、${quote(choice)}はこの問題では正解にならない。`,
  ].filter(Boolean).join(' '))
}

export function grammarChoiceMismatchExplanationFor(item, choice) {
  if (!item || choice == null || choice === item.answer) return ''
  const normalizedChoice = clean(choice).toLocaleLowerCase('en-US').replace(/[’]/g, "'")
  const focus = clean(item.examFocus)

  if (focus === 'never-imperative' && normalizedChoice === "don't") {
    return wrongChoiceExplanation(
      item,
      choice,
      `${quote(choice)}でも一般的な「〜するな」という否定命令にはなるが、この問題が示す${quote(targetMeaning(item))}の「決して」まで表すのは${quote(item.answer)}である。`,
    )
  }
  if (focus === 'never-imperative' && normalizedChoice === 'no') {
    return wrongChoiceExplanation(
      item,
      choice,
      `${quote(choice)}は名詞の前で数量を否定するか、単独で「いいえ」と答える語であり、動詞の原形の直前に置いて否定命令を作れない。${quote(targetMeaning(item))}には〈${item.answer}＋動詞の原形〉を使う。`,
    )
  }
  if (focus === 'never-imperative' && normalizedChoice === 'not') {
    return wrongChoiceExplanation(
      item,
      choice,
      `${quote(choice)}は否定する語句の前に置く語だが、単独で普通の命令文を始められない。${quote(targetMeaning(item))}という強い否定命令は〈${item.answer}＋動詞の原形〉で作る。`,
    )
  }
  if (focus === 'always-imperative' && ['never', 'never to', 'please', "don't"].includes(normalizedChoice)) {
    return wrongChoiceExplanation(
      item,
      choice,
      `${quote(choice)}を入れると命令の頻度・肯否・丁寧さが変わり、目標の意味${quote(targetMeaning(item))}にある「いつも・必ず」と一致しない。ここでは${quote(item.answer)}を使う。`,
    )
  }

  const focusExplanation = grammarExamFocusExplanationFor(item)
  const decisive = focusExplanation || clean(item.explain)
  return wrongChoiceExplanation(
    item,
    choice,
    `${quote(choice)}では、この問題の決め手（${decisive}）を満たせない。`,
  )
}

export function grammarChoiceExplanationFor(item, choice) {
  return choice === item?.answer
    ? grammarCorrectChoiceExplanationFor(item)
    : grammarChoiceMismatchExplanationFor(item, choice)
}

export function grammarChoiceDecisionFor(item, choice) {
  if (!item || !(item.choices ?? []).includes(choice)) return null
  const isCorrect = choice === item.answer
  return {
    choice,
    isCorrect,
    status: isCorrect ? 'correct' : 'incorrect',
    explanation: grammarChoiceExplanationFor(item, choice),
  }
}

export function isCompleteGrammarQuestionExplanation(item) {
  const value = grammarQuestionExplanationFor(item)
  const evidence = grammarAnswerEvidenceFor(item)
  const normalized = value.toLocaleLowerCase('en-US').replace(/[’]/g, "'")
  const answer = clean(item?.answer).toLocaleLowerCase('en-US').replace(/[’]/g, "'")
  const decisions = (item?.choices ?? []).map((choice) => grammarChoiceDecisionFor(item, choice))
  return Boolean(
    value
    && answer
    && normalized.includes(answer)
    && value.includes(clean(item?.sentence?.en))
    && value.includes(targetMeaning(item))
    && value.includes(clean(item?.q).replace('___', '［空所］'))
    && evidence?.rule
    && decisions.length === 4
    && decisions.filter((decision) => decision?.isCorrect).length === 1
    && decisions.every((decision) => decision?.explanation)
    && (!item?.examFocus || grammarExamFocusExplanationFor(item)),
  )
}
