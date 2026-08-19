// 「熟語・構文」に収録された長い一文を、英語の出現順のまま理解する教材。
// 12語以上を「長い一文」として固定し、発音して意味を受け取れる単位に区切る。
// 学習者には発音できて意味が通るまとまりを示し、S / V / O / C / M は内部注釈にする。
// naturalJa は既存の example.ja を使い、ここでは前から受け取る日本語を持つ。

import {
  translationRoleExplanation,
  translationRoleHeading,
  translationRoleMeta,
} from '../lib/translation-roles.js'
import {
  longManualReviewEvidence,
  pendingVerbGroupRule,
} from './reading-phrase-review-ledger.js'
import { buildMeaningPhraseSequence } from '../lib/meaning-phrases.js'
import { longSentenceMeaningPhrasesFor } from './long-sentence-meaning-phrases.js'

export const LONG_SENTENCE_WORD_THRESHOLD = 12
export const LONG_SENTENCE_CORE_WORD_LIMIT = 4
export const LONG_SENTENCE_MODIFIER_WORD_LIMIT = 5

const step = (role, en, ja, note, scope = '', options = {}) => {
  const rawRoleParts = options.roleParts ?? [{ role, en }]
  const roles = Object.freeze([...new Set(rawRoleParts.map((part) => part.role))])
  const roleNote = translationRoleExplanation(roles, ja, scope)
  const optionalBindings = Object.fromEntries([
    'agreementBinding',
    'clauseBinding',
    'closureBinding',
    'comparisonBinding',
    'coordinationBinding',
    'focusBinding',
    'infinitiveBinding',
    'punctuationBoundary',
  ].flatMap((key) => options[key] ? [[key, Object.freeze({ ...options[key] })]] : []))
  return Object.freeze({
    role: roles[0],
    roles,
    scope,
    roleHeading: translationRoleHeading(roles, scope),
    roleNote,
    roleQuestion: roles.map((item) => translationRoleMeta(item).question).join(' → '),
    roleParts: Object.freeze(rawRoleParts.map((part) => {
      const meta = translationRoleMeta(part.role)
      return Object.freeze({
        ...part,
        code: meta.code,
        label: meta.label,
        question: meta.question,
        japaneseShape: meta.japaneseShape,
      })
    })),
    en,
    spokenEn: en,
    displayEn: options.structureEn || en,
    structureEn: options.structureEn || '',
    ja,
    note,
    specialGrammar: Object.freeze([...(options.specialGrammar ?? [])]),
    ...optionalBindings,
    reviewState: 'unregistered',
    status: 'review-needed',
    pattern: options.pattern ?? '',
  })
}

const buildGuide = (tip, steps) => {
  return Object.freeze({
    tip,
    steps: Object.freeze(steps),
    reviewState: 'unregistered',
    status: 'review-needed',
  })
}

const guide = (tip, ...steps) => buildGuide(tip, steps)

const RAW_LONG_SENTENCE_TRANSLATIONS = Object.freeze({
  exam_syn_as_long_as: guide(
    '主節のS→V→Oを先に確定し、as long as が導く条件節(M)の中でもS→V→O→Cの順に進みます。',
    step('S', 'You', 'あなたは', '文の出発点となる主語です。'),
    step('V', 'may use', '使ってよいです（何をかは次へ）', 'may は許可、use は動作です。目的語は後ろへ保留します。'),
    step('O', 'the room', 'その部屋を（使ってよいです）', 'use の対象を置き、括弧で主節の動詞へ受け直します。'),
    step('LINK', 'as long as', 'ただし、〜する限り', '条件を導く構文の合図です。', '条件節(M)'),
    step('S', 'you', 'あなたが', '条件節の中の主語です。', '条件節(M)'),
    step('V', 'keep', '保ちます（対象・状態は次へ）', '条件節の動詞です。OとCが後ろに来るため、条件の語尾はまだ閉じません。', '条件節(M)'),
    step('O', 'it', 'それを（どんな状態にかは次へ）', 'it は the room を指し、keep の目的語Oです。', '条件節(M)'),
    step('C', 'clean.', 'きれいに保つ限り', 'keep O C のCまで到着して、「それをきれいに保つ限り」と条件節を完成します。', '条件節(M)', {
      closureBinding: { type: 'condition-clause', opener: 'as long as', governor: 'may use the room', clause: 'you keep it clean' },
    }),
  ),
  curr_syn_gr_more_1_tense_01: guide(
    '時の基準となるM節を置き、その中のS→Vを確認してから、主節のS→V→Mへ進みます。',
    step('LINK', 'By the time', '〜する時までには', '未来の基準時を導く合図です。', '時の節(M)'),
    step('S', 'the merger', '合併が', '時の節の主語です。', '時の節(M)'),
    step('V', 'is completed,', '合併が完了する時までには', 'be completed まで読んで By the time 節を完成し、主節の未来完了の基準時にします。', '時の節(M)', {
      closureBinding: { type: 'time-clause', opener: 'By the time', governor: 'will have operated', clause: 'the merger is completed' },
    }),
    step('S', 'the firms', '両社は', '主節の主語です。'),
    step('V', 'will have operated', '操業してきたことになります（様子・期間は次へ）', '未来完了で基準時までの継続を表し、後ろの様子と期間を保留します。'),
    step('M', 'independently', '独立して', 'operated の様子を足します。'),
    step('M', 'for decades.', '何十年もの間、独立して操業してきたことになります', '継続期間まで読んで主節の動作を完成します。', '', {
      closureBinding: { type: 'predicate-completion', opener: 'will have operated', governor: 'the firms', clause: 'the firms will have operated independently for decades' },
    }),
  ),
  curr_syn_gr_auto_1_agreement_neither_001: guide(
    'neither A nor B 全体を並列されたSとして取り、V→C→C内のV→Oへ進みます。',
    step('LINK', 'Neither', '次の一方も（否定は後ろへ）', 'neither A nor B の一つ目を導きます。', '', {
      specialGrammar: ['negative-correlative'],
      focusBinding: { type: 'negative-correlative', scope: 'the chair nor the members', completion: 'were ... willing' },
    }),
    step('S', 'the chair', '議長は', '並列主語の一つ目です。'),
    step('LINK', 'nor', 'もう一方として', 'the chair と the members を一つの並列主語にする合図です。', '', {
      specialGrammar: ['coordination'],
      coordinationBinding: { type: 'correlative-compound-subject', left: 'the chair', right: 'the members', governor: 'were willing' },
    }),
    step('S', 'the members', '委員たちも', '並列主語の二つ目です。'),
    step('V', 'were', '〜ではありませんでした（状態は次へ）', 'neither ... nor ... を受けます。動詞に近い主語 the members が複数なので、近接一致で were になります。', '', {
      specialGrammar: ['agreement'],
      agreementBinding: { type: 'proximity-agreement', controller: 'the members', number: 'plural' },
    }),
    step('C', 'willing', '進んで行う意思のある状態', '否定を重ねず、主語の状態だけを示す補語です。'),
    step('V', 'to revise', '修正しようとする（対象は次へ）', 'willing の具体的内容となる不定詞です。目的語が後ろに来るため、意思の内容はまだ閉じません。', 'Cの不定詞', {
      specialGrammar: ['infinitive'],
      infinitiveBinding: { type: 'adjective-complement', governor: 'willing', semanticSubject: 'the chair nor the members' },
    }),
    step('O', 'the proposal.', 'その提案を修正しようとする意思はありませんでした', 'revise の対象まで読んで、neither ... nor ... were willing の否定へ一度だけ受け直します。', 'Cの不定詞', {
      closureBinding: { type: 'infinitive-complement', opener: 'to revise', governor: 'were willing', clause: 'to revise the proposal' },
    }),
  ),
  curr_syn_gr_auto_1_all_the_more_001: guide(
    '主節をS→V→Cで取り、because が導く理由節(M)のS→Vを後ろへ足します。',
    step('S', "The committee's decision", '委員会の決定は', 'decision が主語の中心です。'),
    step('V', 'is', '〜です（評価は次へ）', '主語と補語を結び、具体的な評価を後ろへ保留します。'),
    step('C', 'all the more important', 'なおさら重要です', '主語への評価を補語Cで完成します。', '', {
      closureBinding: { type: 'linking-predicate', opener: 'is', governor: "The committee's decision", clause: "The committee's decision is all the more important" },
    }),
    step('LINK', 'because', 'なぜなら', '理由節を導く合図です。', '理由節(M)'),
    step('S', 'action', '対応が', '理由節の主語です。', '理由節(M)'),
    step('V', 'was delayed.', '遅れたからです', '受動態で理由を完成させます。', '理由節(M)'),
  ),
  curr_syn_gr_auto_1_future_perfect_progressive_001: guide(
    '基準時M→S→未来完了進行形V→O→期間Mの順に積み上げます。',
    step('M', 'By next June,', '来年6月までには', '未来の基準点を先に置きます。'),
    step('S', 'the committee', '委員会は', '主節の主語です。'),
    step('V', 'will have been revising', '修正し続けていることになります（対象・期間は次へ）', '未来完了進行形を一つの動詞群として取り、後ろの対象と期間を保留します。'),
    step('O', 'the proposal', 'その提案を', 'revising の対象です。'),
    step('M', 'for two months.', '2か月間、その提案を修正し続けていることになります', '期間まで読んで未来完了進行形の内容を完成します。', '', {
      closureBinding: { type: 'predicate-completion', opener: 'will have been revising', governor: 'the committee', clause: 'the committee will have been revising the proposal for two months' },
    }),
  ),
  curr_syn_gr_auto_1_no_sooner_001: guide(
    '倒置の合図→助動詞V→S→本動詞V→Oの英語順を保ち、than 以下のS→Vへ続けます。',
    step('LINK', 'No sooner', '〜するとすぐに', '二つの出来事がほぼ同時に起きる構文の合図です。', '', {
      specialGrammar: ['correlative'],
      comparisonBinding: { type: 'no-sooner-than', left: 'the committee revised the proposal', right: 'the public began to respond', head: 'No sooner ... than' },
    }),
    step('V', 'had', '過去のこととして（続きは次へ）', '倒置で主語より前へ出た過去完了の助動詞です。本動詞 revised の意味を先取りしません。'),
    step('S', 'the committee', '委員会が', '倒置された節の主語です。'),
    step('V', 'revised', '修正し終える動作として（対象は次へ）', '過去分詞で最初の動作を示しますが、目的語が後ろに来るため、No sooner の意味はまだ閉じません。'),
    step('O', 'the proposal', 'その提案を修正し終えるとすぐに', 'revised の対象まで読んで、No sooner が示す前件をここで完成します。', '', {
      closureBinding: { type: 'correlative-first-clause', opener: 'No sooner', governor: 'than / the public began to respond', clause: 'the committee had revised the proposal' },
    }),
    step('LINK', 'than', 'すると続いて', '即時性は No sooner で示したため、ここでは後件へ切り替えるだけです。', '', {
      specialGrammar: ['correlative'],
      comparisonBinding: { type: 'no-sooner-than', left: 'the committee revised the proposal', right: 'the public began to respond', head: 'No sooner ... than' },
    }),
    step('S', 'the public', '世間は', 'than 以下の主語です。'),
    step('V', 'began to respond.', '反応し始めました', 'begin to do を一つの動詞群Vとして読みます。', '', {
      specialGrammar: ['infinitive'],
      infinitiveBinding: { type: 'verb-complement', governor: 'began', semanticSubject: 'the public' },
    }),
  ),
  curr_syn_gr_auto_1_provided_that_001: guide(
    '主節のS→V→Oを先に取り、provided that の条件節(M)をS→Vで続けます。',
    step('S', 'The committee', '委員会は', '主節の主語です。'),
    step('V', 'may revise', '修正してよい', '可能・許可を表す動詞群です。'),
    step('O', 'the proposal', 'その提案を', 'revise の対象です。'),
    step('LINK', 'provided that', 'ただし〜という条件で', '条件節を導く合図です。', '条件節(M)'),
    step('S', 'the evidence', 'その証拠が', '条件節の主語です。', '条件節(M)'),
    step('V', 'is disclosed.', '公開されるという条件で', '受動態の動詞まで読んで、provided that の条件節を完成します。', '条件節(M)', {
      closureBinding: { type: 'condition-clause', opener: 'provided that', governor: 'may revise the proposal', clause: 'the evidence is disclosed' },
    }),
  ),
  curr_syn_gr_auto_1_superior_to_001: guide(
    '場面Mの中身をV→Oで取り、主節のS→V→Cと比較Mを順に置きます。',
    step('M', 'In handling', '扱う際には', '場面を設定するin＋動名詞です。'),
    step('O', 'the proposal,', 'その提案を扱う際には', 'handling の対象まで読んで、in handling の場面Mを完成します。', 'M句内', {
      closureBinding: { type: 'gerund-phrase', opener: 'In handling', governor: 'is superior', clause: 'handling the proposal' },
    }),
    step('S', 'this approach', 'この方法は', '比較される主語です。'),
    step('V', 'is', '〜です', '主語と補語を結びます。'),
    step('C', 'superior', '優れている', '主語の評価を示す補語です。'),
    step('M', 'to the previous one', '以前の方法より', 'superior の比較対象です。', '', {
      specialGrammar: ['comparison'],
      comparisonBinding: { type: 'superior-to', left: 'this approach', right: 'the previous one', head: 'superior' },
    }),
    step('M', 'in accuracy.', '正確さの点で（以前の方法より優れています）', '比較する観点まで置き、主節の評価へ受け直します。'),
  ),
  curr_syn_gr_auto_1_were_to_001: guide(
    '倒置された条件節をV→S→V→O→Mの英語順で取り、主節のS→V→Cへ進みます。',
    step('V', 'Were', '仮に（続きは次へ）', 'if が省略され、主語より前へ出た条件倒置のbe動詞です。条件内容は to revise で完成します。', '条件節(M)'),
    step('S', 'the committee', '委員会が', '条件節の主語です。', '条件節(M)'),
    step('V', 'to revise', '修正することとして（対象・様子は次へ）', 'were to do の動作を置きます。OとMが後ろに来るため、条件はまだ閉じません。', '条件節(M)', {
      specialGrammar: ['infinitive'],
      infinitiveBinding: { type: 'inverted-be-to-condition', governor: 'Were', semanticSubject: 'the committee' },
    }),
    step('O', 'the proposal', 'その提案を', 'revise の対象です。', '条件節(M)'),
    step('M', 'unexpectedly,', '予想外にその提案を修正するとすれば', 'revise の様子まで読んで、倒置された条件節をここで完成します。', '条件節(M)', {
      closureBinding: { type: 'inverted-condition-clause', opener: 'Were', governor: 'the consequences would be serious', clause: 'the committee were to revise the proposal unexpectedly' },
    }),
    step('S', 'the consequences', 'その結果は', '主節の主語です。'),
    step('V', 'would be', '〜になるでしょう（状態は次へ）', '仮定した場合の結果を示し、具体的な状態を後ろへ保留します。'),
    step('C', 'serious.', '重大になるでしょう', '結果の状態まで読んで would be の述語を完成します。', '', {
      closureBinding: { type: 'linking-predicate', opener: 'would be', governor: 'the consequences', clause: 'the consequences would be serious' },
    }),
  ),
  curr_syn_gr_exam_university_1_degree_adverb_001: guide(
    '主節S→Vのあと、that が省略された目的語内容節をS→V→Cで取り、コロン後はS→V→M→O→Mと進みます。',
    step('S', 'The laboratory test', 'その実験室での試験は', '文全体の主語です。'),
    step('V', 'showed', '示した', '後ろの内容節を目的語に取る動詞です。showed と the filter の間では内容節の that が省略されています。', '', {
      specialGrammar: ['content-clause'],
      clauseBinding: { type: 'omitted-that-content-clause', governor: 'showed', clauseRole: 'O', marker: '(that)' },
    }),
    step('S', 'the filter', 'そのフィルターが', '省略された (that) 以下で、showed の目的語となる内容節の主語です。', 'Oとなる内容節'),
    step('V', 'was', '〜でした（状態は次へ）', '内容節のbe動詞です。Cが後ろに来るため、showed へ戻る「と」はまだ付けません。', 'Oとなる内容節'),
    step('C', 'useless:', '役に立たないものだと（試験は示しました）――', 'filter の状態まで読んで、省略された that 内容節を showed へ受け直します。', 'Oとなる内容節', {
      closureBinding: { type: 'content-clause', opener: '(that)', governor: 'showed', clause: 'the filter was useless' },
    }),
    step('S', 'it', 'それは', 'コロンで前節の評価を閉じ、詳しい根拠を示す新しい独立節へ進みます。it は filter を指します。', '', {
      specialGrammar: ['colon-boundary'],
      punctuationBoundary: { mark: ':', relation: 'explanation', previousClause: 'the filter was useless', nextClause: 'it removed practically nothing' },
    }),
    step('V', 'removed', '取り除きました（何をかは次へ）', '後ろの nothing が出る前に否定を先取りせず、動作だけを置きます。'),
    step('M', 'practically', 'ほとんど', 'nothing の量を「ほとんど何もない」と限定します。'),
    step('O', 'nothing', '何も（取り除きませんでした）', 'nothing が英語の否定源です。日本語では述語を否定形にして、括弧で removed を一度だけ受け直します。', '', {
      specialGrammar: ['negative-quantifier'],
      focusBinding: { type: 'negative-quantifier', source: 'nothing', japaneseCompletion: '取り除きませんでした', governor: 'removed' },
    }),
    step('M', 'from the polluted water.', 'その汚染水からは、ほとんど何も取り除きませんでした', '取り除く元まで読んで、コロン後の独立節を完成します。', '', {
      closureBinding: { type: 'predicate-completion', opener: ':', governor: 'removed', clause: 'it removed practically nothing from the polluted water' },
    }),
  ),
  curr_syn_gr_more_1_modal_02: guide(
    'セミコロン前をS→V→C、後ろをS→Vの順で取り、二つの過去への判断を比べます。',
    step('S', 'The report', 'その報告書は', '前半の主語です。'),
    step('V', 'need not have been', '〜である必要はありませんでした（状態は次へ）', 'need not have been は過去の状態について「そうである必要はなかった」と義務の不在を示し、禁止ではありません。', '', {
      specialGrammar: ['negative-focus'],
      focusBinding: { type: 'absence-of-necessity', source: 'need not', scope: 'have been so lengthy', contrast: 'not prohibition' },
    }),
    step('C', 'so lengthy;', 'それほど長い状態（である必要はありませんでした）', 'report の状態を置き、括弧でVへ受け直します。'),
    step('S', 'a summary', '要約は', 'セミコロンで前の独立節を閉じ、代わりの判断を示す新しい独立節へ進みます。', '', {
      specialGrammar: ['semicolon-boundary'],
      punctuationBoundary: { mark: ';', relation: 'alternative', previousClause: 'The report need not have been so lengthy', nextClause: 'a summary would have sufficed' },
    }),
    step('V', 'would have sufficed.', '十分だったでしょう', '実現しなかった過去の可能な結果です。'),
  ),
  curr_syn_gr_more_1_emph_01: guide(
    'what節全体をSとし、その内部のS→Vを確認してから、主節Vとnot A but BのCへ進みます。',
    step('O', 'What', '次の「こと」を', '先行詞を含む what は objects to の目的語Oを兼ねます。what節全体は主節 is の主語Sになります。', '主語節(S)', {
      specialGrammar: ['fused-relative'],
      clauseBinding: { type: 'fused-relative-subject-clause', internalRole: 'O', outerRole: 'S', governor: 'objects to' },
    }),
    step('S', 'the committee', '委員会が', 'what節内の主語です。', '主語節(S)'),
    step('V', 'objects to', '反対している（ことは）', 'what が objects to の対象を兼ね、括弧で主語節全体を受け直します。', '主語節(S)'),
    step('V', 'is', '〜です', '長い主語と補語を結びます。'),
    step('LINK', 'not', '〜ではなく', 'the cost を候補Aとして否定し、後ろの but the lack of evidence へ対比を保留します。', '', {
      specialGrammar: ['negative-focus'],
      focusBinding: { type: 'not-a-but-b', source: 'not', scope: 'the cost', completion: 'but the lack of evidence' },
    }),
    step('C', 'the cost', '費用', '否定される補語Aです。'),
    step('LINK', 'but', 'むしろ', 'is に続く二つの補語 the cost と the lack of evidence を not A but B で対比します。', '', {
      specialGrammar: ['coordination'],
      coordinationBinding: { type: 'not-a-but-b-complements', left: 'the cost', right: 'the lack of evidence', governor: 'is' },
    }),
    step('C', 'the lack', '不足です', '本当に問題にする補語Bの中心です。'),
    step('M', 'of evidence.', '証拠の（不足です）', 'lack を後ろから説明し、括弧で係り先を受け直します。', 'C内'),
  ),
  curr_syn_gr_auto_1_agreement_neither_002: guide(
    'neither A nor B を並列Sとして取り、V→C→C内のV→Oへ進みます。',
    step('LINK', 'Neither', '次の一方も（否定は後ろへ）', 'neither A nor B の一つ目を導きます。', '', {
      specialGrammar: ['negative-correlative'],
      focusBinding: { type: 'negative-correlative', scope: 'the chair nor the members', completion: 'were ... willing' },
    }),
    step('S', 'the chair', '議長は', '並列主語の一つ目です。'),
    step('LINK', 'nor', 'もう一方として', 'the chair と the members を一つの並列主語にする合図です。', '', {
      specialGrammar: ['coordination'],
      coordinationBinding: { type: 'correlative-compound-subject', left: 'the chair', right: 'the members', governor: 'were willing' },
    }),
    step('S', 'the members', '委員たちも', '並列主語の二つ目です。'),
    step('V', 'were', '〜ではありませんでした（状態は次へ）', 'neither ... nor ... を受けます。動詞に近い主語 the members が複数なので、近接一致で were になります。', '', {
      specialGrammar: ['agreement'],
      agreementBinding: { type: 'proximity-agreement', controller: 'the members', number: 'plural' },
    }),
    step('C', 'willing', '進んで行う意思のある状態', '否定を重ねず、主語の状態だけを示す補語です。'),
    step('V', 'to verify', '検証しようとする（対象は次へ）', 'willing の具体的内容となる不定詞です。目的語が後ろに来るため、意思の内容はまだ閉じません。', 'Cの不定詞', {
      specialGrammar: ['infinitive'],
      infinitiveBinding: { type: 'adjective-complement', governor: 'willing', semanticSubject: 'the chair nor the members' },
    }),
    step('O', 'the results.', 'その結果を検証しようとする意思はありませんでした', 'verify の対象まで読んで、neither ... nor ... were willing の否定へ一度だけ受け直します。', 'Cの不定詞', {
      closureBinding: { type: 'infinitive-complement', opener: 'to verify', governor: 'were willing', clause: 'to verify the results' },
    }),
  ),
  curr_syn_gr_auto_1_all_the_more_002: guide(
    '主節をS→V→Cで取り、because が導く理由節(M)のS→Vを後ろへ足します。',
    step('S', "The committee's decision", '委員会の決定は', 'decision が主語の中心です。'),
    step('V', 'is', '〜です（評価は次へ）', '主語と補語を結び、具体的な評価を後ろへ保留します。'),
    step('C', 'all the more urgent', 'なおさら緊急です', '主語への評価を補語Cで完成します。', '', {
      closureBinding: { type: 'linking-predicate', opener: 'is', governor: "The committee's decision", clause: "The committee's decision is all the more urgent" },
    }),
    step('LINK', 'because', 'なぜなら', '理由節を導く合図です。', '理由節(M)'),
    step('S', 'action', '対応が', '理由節の主語です。', '理由節(M)'),
    step('V', 'was delayed.', '遅れたからです', '受動態で理由を完成させます。', '理由節(M)'),
  ),
  curr_syn_gr_auto_1_extent_to_which_002: guide(
    '主語の中心を置き、関係詞節内のS→V→Oを確認してから、主節Vへ戻ります。',
    step('S', 'The extent', 'その程度は', '長い主語の中心です。'),
    step('M', 'to which', 'その程度まで', 'which は先行詞 extent を受け、前置詞 to の目的語です。to which 以下の関係詞節全体が extent を後ろから説明します。', 'S内の関係詞節(M)', {
      specialGrammar: ['preposition-relative'],
      clauseBinding: { type: 'preposition-relative', antecedent: 'extent', preposition: 'to', whRole: 'O', clauseRole: 'M' },
    }),
    step('S', 'the committee', '委員会が', '関係詞節の主語です。', 'S内の関係詞節(M)'),
    step('V', 'revised', '修正した', '関係詞節の動詞です。', 'S内の関係詞節(M)'),
    step('O', 'the proposal', 'その提案を修正した（程度は）', 'revised の対象まで読んで、to which が extent を修飾する関係詞節を閉じます。', 'S内の関係詞節(M)', {
      closureBinding: { type: 'relative-clause', opener: 'to which', governor: 'The extent / is still disputed', clause: 'to which the committee revised the proposal' },
    }),
    step('V', 'is still disputed.', '今も議論されています', '主節へ戻った受動態の動詞です。'),
  ),
  curr_syn_gr_auto_1_future_perfect_progressive_002: guide(
    '基準時M→S→未来完了進行形V→O→期間Mの順に積み上げます。',
    step('M', 'By next June,', '来年6月までには', '未来の基準点を先に置きます。'),
    step('S', 'the committee', '委員会は', '主節の主語です。'),
    step('V', 'will have been revising', '修正し続けていることになります（対象・期間は次へ）', '未来完了進行形を一つの動詞群として取り、後ろの対象と期間を保留します。'),
    step('O', 'the proposal', 'その提案を', 'revising の対象です。'),
    step('M', 'for a year.', '1年間、その提案を修正し続けていることになります', '期間まで読んで未来完了進行形の内容を完成します。', '', {
      closureBinding: { type: 'predicate-completion', opener: 'will have been revising', governor: 'the committee', clause: 'the committee will have been revising the proposal for a year' },
    }),
  ),
  curr_syn_gr_auto_1_lest_002: guide(
    '主節をS→V→O→Mで取り、lest が導く目的節(M)のS→V→Oへ続けます。',
    step('S', 'The committee', '委員会は', '主節の主語です。'),
    step('V', 'explained', '説明した', '主節の動詞です。'),
    step('O', 'its decision', 'その決定を', 'explained の対象です。'),
    step('M', 'carefully', '注意深く', 'explained の様子を足します。'),
    step('LINK', 'lest', '次の事態を避けるために', '否定の目的節を導く合図です。否定を後ろの動詞へ重ねません。', '目的節(M)', {
      specialGrammar: ['negative-focus'],
      focusBinding: { type: 'negative-purpose', source: 'lest', scope: 'anyone should overlook a detail', completion: 'avoidance is expressed once by lest' },
    }),
    step('S', 'anyone', 'だれかが', '目的節の主語です。', '目的節(M)'),
    step('V', 'should overlook', '見落とすことがある（対象は次へ）', 'lest 節の動作は肯定語義で置き、目的語が来るまで回避の意味を閉じません。', '目的節(M)'),
    step('O', 'a detail.', '細部を見落とす事態を避けるために', 'overlook の対象まで読んで、lest の否定目的を一度だけ完成します。', '目的節(M)', {
      closureBinding: { type: 'negative-purpose-clause', opener: 'lest', governor: 'explained its decision carefully', clause: 'anyone should overlook a detail' },
    }),
  ),
  curr_syn_gr_auto_2_gerund_idiom_001: guide(
    '形式的な There is を一つのVとして置き、実質内容S、that節のS→V→O、最後の時Mへ進みます。',
    step('V', 'There is', 'あります（何があるかは次へ）', 'There is は英語が好む存在構文の形式的な入口です。there を場所の「そこ」とは訳しません。', '', {
      specialGrammar: ['existential-there'],
      clauseBinding: { type: 'existential-there', formalElement: 'There', postposedContent: 'no denying that ...' },
    }),
    step('S', 'no denying', '否定できないことが', 'There is no -ing は「〜することはできない」の意味を作ります。denying は動名詞で、that節の内容を否定する行為を名詞化しています。', '', {
      specialGrammar: ['gerund-idiom'],
      clauseBinding: { type: 'there-is-no-gerund', gerund: 'denying', meaning: 'cannot deny' },
    }),
    step('LINK', 'that', '次の内容を否定することはできません（中身は次へ）', '動名詞 denying の目的語となる内容節を導きます。訳は節末まで保留します。', 'Oとなる内容節', {
      specialGrammar: ['content-clause'],
      clauseBinding: { type: 'content-clause', governor: 'denying', clauseRole: 'O' },
    }),
    step('S', 'the committee', '委員会が', '内容節の主語です。', 'Oとなる内容節'),
    step('V', 'must revise', '修正しなければならない', '義務を表す動詞群です。', 'Oとなる内容節'),
    step('O', 'the proposal', 'その提案を', 'revise の対象です。', 'Oとなる内容節'),
    step('M', 'at this stage.', 'この段階でその提案を修正しなければならないことは、否定できません', '時点まで読んで that 内容節全体を There is no denying へ受け直します。', 'Oとなる内容節', {
      closureBinding: { type: 'content-clause', opener: 'that', governor: 'There is no denying', clause: 'the committee must revise the proposal at this stage' },
    }),
  ),
  curr_syn_gr_auto_2_inanimate_subject_001: guide(
    '無生物S→V→O→Cの不定詞内V→O→Mを、英語の並びどおり積み上げます。',
    step('S', 'The new system', 'その新しい制度は', '人ではないものを主語として保ちます。'),
    step('V', 'will enable', '可能にするでしょう（誰を・何を、は次へ）', 'enable O to do の動詞です。可能の意味はここで一度だけ示します。'),
    step('O', 'the committee', '委員会を（次の動作が可能な状態に）', 'enable の目的語Oで、to revise の意味上の主語でもあります。'),
    step('V', 'to revise', '修正する動作として（対象・方法は次へ）', 'enable O to do の不定詞で、目的語 the committee を意味上の主語にします。可能の意味は will enable にだけ置きます。', 'Cとなる不定詞', {
      specialGrammar: ['infinitive'],
      infinitiveBinding: { type: 'object-to-infinitive', governor: 'enable', semanticSubject: 'the committee' },
    }),
    step('O', 'the proposal', 'その提案を', 'revise の対象です。', 'Cとなる不定詞'),
    step('M', 'more efficiently.', 'より効率的にその提案を修正できるようにします', '方法まで読んで、enable O to do の内容を主節へ受け直します。', 'Cとなる不定詞', {
      closureBinding: { type: 'object-to-infinitive', opener: 'to revise', governor: 'will enable', clause: 'the committee to revise the proposal more efficiently' },
    }),
  ),
  curr_syn_gr_auto_2_past_subjunctive_001: guide(
    'if条件節(M)をLINK→S→V→O→M、主節をS→V→Cの順で読みます。',
    step('LINK', 'If', 'もし', '反実仮想の条件節を導きます。', '条件節(M)'),
    step('S', 'the committee', '委員会が', '条件節の主語です。', '条件節(M)'),
    step('V', 'had revised', '修正していたと仮定します（対象・時は次へ）', '過去完了の動作を置きます。OとMが後ろに来るため、条件はまだ閉じません。', '条件節(M)'),
    step('O', 'the proposal', 'その提案を', 'revised の対象です。', '条件節(M)'),
    step('M', 'earlier,', 'もっと早くその提案を修正していたなら', '時まで読んで if 条件節を完成します。', '条件節(M)', {
      closureBinding: { type: 'condition-clause', opener: 'If', governor: 'the outcome would have been different', clause: 'the committee had revised the proposal earlier' },
    }),
    step('S', 'the outcome', 'その結果は', '主節の主語です。'),
    step('V', 'would have been', '〜だったでしょう（状態は次へ）', '仮定した過去の結果を示し、具体的な状態を後ろへ保留します。'),
    step('C', 'different.', '違っていたでしょう', 'outcome の状態まで読んで would have been の述語を完成します。', '', {
      closureBinding: { type: 'linking-predicate', opener: 'would have been', governor: 'the outcome', clause: 'the outcome would have been different' },
    }),
  ),
  curr_syn_gr_auto_pre2_correlative_001: guide(
    '共通のS→助動詞Vを置き、not only と but also で二つのV→O→Mを並列します。',
    step('S', 'Ken', 'ケンは', '二つの動作に共通する主語です。'),
    step('V', 'can', '〜できます（動作は次へ）', '後ろの二つの動詞に共通する助動詞です。'),
    step('LINK', 'not only', '〜だけでなく', '後ろの but also と呼応し、「AだけでなくBも」の一つ目の動作を導きます。', '', {
      specialGrammar: ['correlative'],
      coordinationBinding: { type: 'not-only-but-also-predicates', left: 'play tennis after school', right: 'call Grandma in the evening', governor: 'Ken can' },
    }),
    step('V', 'play', 'します（何をかは次へ）', '一つ目の動作です。can の可能を重ねません。'),
    step('O', 'tennis', 'テニスを', 'play の対象です。'),
    step('M', 'after school', '放課後にテニスをすることができるだけでなく', '一つ目の動作を時まで読み、not only の前項を完成します。', '', {
      closureBinding: { type: 'coordinated-predicate', opener: 'not only', governor: 'Ken can', clause: 'play tennis after school' },
    }),
    step('LINK', 'but also', '〜もまた', '前の not only と呼応し、「AだけでなくBも」の二つ目の動作を追加します。', '', {
      specialGrammar: ['correlative'],
      coordinationBinding: { type: 'not-only-but-also-predicates', left: 'play tennis after school', right: 'call Grandma in the evening', governor: 'Ken can' },
    }),
    step('V', 'call', '電話することもできます（相手・時は次へ）', '二つ目の動作で、共通の can を日本語と構造表示だけに補います。音声は原文どおり call です。', '', {
      structureEn: '(can) call',
    }),
    step('O', 'Grandma', '祖母に', 'call の相手です。'),
    step('M', 'in the evening.', '夕方に祖母へ電話することもできます', '相手と時まで読んで but also の後項を完成します。', '', {
      closureBinding: { type: 'coordinated-predicate', opener: 'but also', governor: 'Ken can', clause: 'call Grandma in the evening' },
    }),
  ),
  curr_syn_gr_pre2_pron_3: guide(
    'セミコロン前をS→V→O、後ろをS→V→C、接続後もS→V→Cで対応させます。',
    step('S', 'I', '私は', '前半の主語です。'),
    step('V', 'have', '飼っています（何をかは次へ）', '所有を示す動詞で、目的語を後ろへ保留します。'),
    step('O', 'two cats;', '2匹の猫を飼っています', 'have の対象まで読んで第一独立節を閉じます。末尾はセミコロンです。', '', {
      closureBinding: { type: 'predicate-completion', opener: 'have', governor: 'I', clause: 'I have two cats' },
    }),
    step('S', 'one', '一匹は', 'セミコロンのあとに始まる第二独立節の主語で、two cats の一方を指します。', '', {
      specialGrammar: ['semicolon-boundary'],
      punctuationBoundary: { mark: ';', relation: 'elaboration', previousClause: 'I have two cats', nextClause: 'one is white and the other is black' },
    }),
    step('V', 'is', '〜です', '主語と色を結びます。'),
    step('C', 'white', '白いです', 'one の色を置き、be動詞の補語として第二節前半を完成します。'),
    step('LINK', 'and', 'そして', 'one is white と the other is black という二つの独立節を並列します。', '', {
      specialGrammar: ['coordination'],
      coordinationBinding: { type: 'clause-coordination', left: 'one is white', right: 'the other is black', governor: 'semicolon second clause' },
    }),
    step('S', 'the other', 'もう一匹は', '残ったもう一方を指します。'),
    step('V', 'is', '〜です', '主語と色を結びます。'),
    step('C', 'black.', '黒いです', 'the other の色を置き、第二節後半を完成します。'),
  ),
  curr_syn_gr_auto_pre1_agreement_001: guide(
    'A series of reviews を四語の一つの単数Sとして保ち、V→不定詞内V→O→V→Oへ進みます。',
    step('S', 'A series of reviews', '一連の審査が', '四語の名詞句全体を一役割の主語Sとして保ちます。中心語 series が単数なので後ろは is になります。', '', {
      specialGrammar: ['agreement'],
      agreementBinding: { type: 'head-noun-agreement', controller: 'series', number: 'singular' },
    }),
    step('V', 'is expected', '期待されています（内容は次へ）', '受動態の主節動詞です。'),
    step('V', 'to help', '助けることが期待されています（誰を何にかは次へ）', '期待される具体的な動作です。後ろのO→V→Oを読み終えるまで内容を保留します。', 'Cの不定詞', {
      specialGrammar: ['infinitive'],
      infinitiveBinding: { type: 'passive-verb-complement', governor: 'is expected', semanticSubject: 'A series of reviews' },
    }),
    step('O', 'the committee', '委員会が（次の動作をするのを）', 'help の目的語で、revise の意味上の主語です。', 'Cの不定詞'),
    step('V', 'revise', '修正すること（対象は次へ）', 'help O do の原形動詞です。目的語が後ろに来るため、ここでは格を閉じません。', 'Cの不定詞'),
    step('O', 'the proposal.', '委員会がその提案を修正するのに役立つと期待されています', 'revise の対象まで読んで、reviews が委員会の修正に役立つという to help 以下の内容を is expected へ受け直します。', 'Cの不定詞', {
      closureBinding: { type: 'infinitive-chain', opener: 'to help', governor: 'is expected', clause: 'to help the committee revise the proposal' },
    }),
  ),
  curr_syn_gr_auto_pre1_be_to_001: guide(
    'If節(M)をLINK→S→V→O→M、主節をS→V→Oの順で取ります。',
    step('LINK', 'If', 'もし', '必要条件を導きます。条件の具体的内容は後ろへ保留します。', '条件節(M)'),
    step('S', 'the committee', '委員会が', '条件節の主語です。', '条件節(M)'),
    step('V', 'is to revise', '修正することとして（対象・様子は次へ）', 'be to do の動作を置きます。OとMが後ろに来るため、必要条件はまだ閉じません。', '条件節(M)', {
      specialGrammar: ['infinitive'],
      infinitiveBinding: { type: 'be-to-condition', governor: 'is', semanticSubject: 'the committee' },
    }),
    step('O', 'the proposal', 'その提案を', 'revise の対象です。', '条件節(M)'),
    step('M', 'successfully,', 'その提案をうまく修正するためには', '様子まで読んで、目的実現の必要条件をここで完成します。', '条件節(M)', {
      closureBinding: { type: 'condition-clause', opener: 'If', governor: 'it needs more resources', clause: 'the committee is to revise the proposal successfully' },
    }),
    step('S', 'it', '委員会は', 'the committee を受ける普通の代名詞主語です。'),
    step('V', 'needs', '必要とします', '主節の動詞です。'),
    step('O', 'more resources.', 'さらに多くの資源を', 'needs の目的語Oです。'),
  ),
  curr_syn_gr_auto_pre1_conditional_inversion_001: guide(
    '倒置条件節をV→S→V→O→M、主節をS→Vの順で取ります。',
    step('V', 'Had', '仮に過去のこととして（続きは次へ）', 'if が省略され主語より前へ出た助動詞です。revised の意味は先取りしません。', '条件節(M)'),
    step('S', 'the committee', '委員会が', '条件節の主語です。', '条件節(M)'),
    step('V', 'revised', '修正していたと仮定します（対象・時は次へ）', '過去完了の本動詞を置きます。OとMが後ろに来るため、条件はまだ閉じません。', '条件節(M)'),
    step('O', 'the proposal', 'その提案を', 'revised の対象です。', '条件節(M)'),
    step('M', 'earlier,', 'もっと早くその提案を修正していたなら', '時まで読んで、倒置された条件節を完成します。', '条件節(M)', {
      closureBinding: { type: 'inverted-condition-clause', opener: 'Had', governor: 'the outcome would have differed', clause: 'the committee had revised the proposal earlier' },
    }),
    step('S', 'the outcome', 'その結果は', '主節の主語です。'),
    step('V', 'would have differed.', '異なっていたでしょう', '実際とは異なる過去の結果です。'),
  ),
  curr_syn_gr_auto_pre1_whale_001: guide(
    '観点M→S→V→Cを取り、than 以下の比較対象もS→Vで読みます。',
    step('M', 'In formal reasoning,', '厳密な推論では', '判断の領域を限定します。'),
    step('S', 'a rumor', 'うわさは', '比較される主語です。'),
    step('V', 'is', '〜です', '主語と補語を結びます。'),
    step('C', 'no more evidence', '証拠では決してない', 'no more A than B が「Bでないのと同様にAでない」という否定比較を作ります。', '', {
      specialGrammar: ['comparison'],
      comparisonBinding: { type: 'no-more-than', left: 'a rumor is evidence', right: 'a guess is evidence', head: 'no more evidence' },
    }),
    step('LINK', 'than', '〜と同じように', 'a guess is のあとに evidence が省略され、右側も「推測が証拠でない」と比較します。', '', {
      specialGrammar: ['comparison'],
      comparisonBinding: { type: 'no-more-than', left: 'a rumor is evidence', right: 'a guess is evidence', head: 'no more evidence', ellipsis: 'evidence after is' },
    }),
    step('S', 'a guess', '推測が', '比較対象の主語です。'),
    step('V', 'is.', '証拠でない', '省略された evidence を受けます。'),
  ),
  curr_syn_gr_auto_pre1_agreement_002: guide(
    'A series of reviews を四語の一つの単数Sとして保ち、V→不定詞内V→O→V→Oへ進みます。',
    step('S', 'A series of reviews', '一連の審査が', '四語の名詞句全体を一役割の主語Sとして保ちます。中心語 series が単数なので後ろは is になります。', '', {
      specialGrammar: ['agreement'],
      agreementBinding: { type: 'head-noun-agreement', controller: 'series', number: 'singular' },
    }),
    step('V', 'is expected', '期待されています（内容は次へ）', '受動態の主節動詞です。'),
    step('V', 'to help', '助けることが期待されています（誰を何にかは次へ）', '期待される具体的な動作です。後ろのO→V→Oを読み終えるまで内容を保留します。', 'Cの不定詞', {
      specialGrammar: ['infinitive'],
      infinitiveBinding: { type: 'passive-verb-complement', governor: 'is expected', semanticSubject: 'A series of reviews' },
    }),
    step('O', 'the research team', '研究チームが（次の動作をするのを）', 'help の目的語で、verify の意味上の主語です。', 'Cの不定詞'),
    step('V', 'verify', '検証すること（対象は次へ）', 'help O do の原形動詞です。目的語が後ろに来るため、ここでは格を閉じません。', 'Cの不定詞'),
    step('O', 'the results.', '研究チームがその結果を検証するのに役立つと期待されています', 'verify の対象まで読んで、reviews が研究チームの検証に役立つという to help 以下の内容を is expected へ受け直します。', 'Cの不定詞', {
      closureBinding: { type: 'infinitive-chain', opener: 'to help', governor: 'is expected', clause: 'to help the research team verify the results' },
    }),
  ),
  curr_syn_gr_auto_pre1_appositive_that_002: guide(
    'Sの中心語を置き、同格that節内をS→V→Oで取り、主節V→Oへ戻ります。',
    step('S', 'The fact', 'その事実は', '長い主語の中心です。'),
    step('LINK', 'that', '〜という', 'fact の内容を示す同格節を導きます。', 'S内の同格節'),
    step('S', 'the research team', '研究チームが', '同格節の主語です。', 'S内の同格節'),
    step('V', 'may verify', '検証するかもしれません（対象は次へ）', '同格節の動詞群です。目的語まで読むまで fact への接続を保留します。', 'S内の同格節'),
    step('O', 'the results', 'その結果を検証するかもしれない（という事実は）', 'verify の対象まで読んで、that節全体を The fact へ受け直します。', 'S内の同格節', {
      closureBinding: { type: 'appositive-content-clause', opener: 'that', governor: 'The fact / deserves attention', clause: 'the research team may verify the results' },
    }),
    step('V', 'deserves', '値します（何にかは次へ）', '主節へ戻り、目的語を後ろへ保留する動詞です。'),
    step('O', 'attention.', '注目に（値します）', 'deserves の目的語を置き、括弧で動詞へ受け直します。'),
  ),
  curr_syn_gr_auto_pre1_be_to_002: guide(
    'If節(M)をLINK→S→V→O→M、主節をS→V→Oの順で取ります。',
    step('LINK', 'If', 'もし', '必要条件を導きます。条件の具体的内容は後ろへ保留します。', '条件節(M)'),
    step('S', 'the committee', '委員会が', '条件節の主語です。', '条件節(M)'),
    step('V', 'is to revise', '修正することとして（対象・期限は次へ）', 'be to do の動作を置きます。Oと期限Mが後ろに来るため、必要条件はまだ閉じません。', '条件節(M)', {
      specialGrammar: ['infinitive'],
      infinitiveBinding: { type: 'be-to-condition', governor: 'is', semanticSubject: 'the committee' },
    }),
    step('O', 'the proposal', 'その提案を', 'revise の対象です。', '条件節(M)'),
    step('M', 'by the deadline,', 'その期限までにその提案を修正するためには', '期限まで読んで、目的実現の必要条件をここで完成します。', '条件節(M)', {
      closureBinding: { type: 'condition-clause', opener: 'If', governor: 'it needs more resources', clause: 'the committee is to revise the proposal by the deadline' },
    }),
    step('S', 'it', '委員会は', 'the committee を受ける普通の代名詞主語です。'),
    step('V', 'needs', '必要とします', '主節の動詞です。'),
    step('O', 'more resources.', 'さらに多くの資源を', 'needs の目的語Oです。'),
  ),
  curr_syn_gr_auto_pre1_comparison_002: guide(
    'S→Vを置き、not so much A as B の二つのC、最後に条件Mへ進みます。',
    step('S', 'The proposal', 'その提案は', '評価される主語です。'),
    step('V', 'is', '〜です（評価は次へ）', '主語と後ろの二つの評価を結びます。'),
    step('LINK', 'not so much', 'それほど', 'not so much A as B で、Aだけでは適切でないことを後ろへ保留します。', '', {
      specialGrammar: ['comparison'],
      comparisonBinding: { type: 'not-so-much-as', left: 'expensive', right: 'impractical', head: 'evaluation of the proposal' },
    }),
    step('C', 'expensive', '高価だというのではなく', '第一評価Aを見たあと、as 以下のBへ対比をつなぎます。'),
    step('LINK', 'as', 'むしろ', 'not so much と呼応して、より適切な第二評価Bへ切り替えます。', '', {
      specialGrammar: ['comparison'],
      comparisonBinding: { type: 'not-so-much-as', left: 'expensive', right: 'impractical', head: 'evaluation of the proposal' },
    }),
    step('C', 'impractical', '実用的でないのです', 'より適切な第二の評価Bです。'),
    step('M', 'under current conditions.', '現在の条件のもとでは（高価というより実用的でないのです）', '評価が成り立つ条件まで置き、not so much A as B の主節へ受け直します。'),
  ),
  curr_syn_gr_auto_pre1_conditional_inversion_002: guide(
    '倒置条件節をV→S→V→O→M、主節をS→Vの順で取ります。',
    step('V', 'Had', '仮に過去のこととして（続きは次へ）', 'if が省略され主語より前へ出た助動詞です。revised の意味は先取りしません。', '条件節(M)'),
    step('S', 'the committee', '委員会が', '条件節の主語です。', '条件節(M)'),
    step('V', 'revised', '修正していたと仮定します（対象・様子は次へ）', '過去完了の本動詞を置きます。OとMが後ろに来るため、条件はまだ閉じません。', '条件節(M)'),
    step('O', 'the proposal', 'その提案を', 'revised の対象です。', '条件節(M)'),
    step('M', 'more carefully,', 'もっと慎重にその提案を修正していたなら', '様子まで読んで、倒置された条件節を完成します。', '条件節(M)', {
      closureBinding: { type: 'inverted-condition-clause', opener: 'Had', governor: 'the outcome would have differed', clause: 'the committee had revised the proposal more carefully' },
    }),
    step('S', 'the outcome', 'その結果は', '主節の主語です。'),
    step('V', 'would have differed.', '異なっていたでしょう', '実際とは異なる過去の結果です。'),
  ),
  curr_syn_gr_auto_pre1_ellipsis_002: guide(
    '省略条件Mでは隠れたSとVを補って意味を確定し、主節をS→V→O→M→Mの順に読みます。',
    step('LINK', 'If', 'もし', '条件を導く合図です。', '条件句(M)'),
    step('C', 'necessary,', '必要であれば', '省略された it is の補語です。', '条件句(M)'),
    step('S', 'the research team', '研究チームは', '主節の主語です。'),
    step('V', 'will verify', '検証するでしょう（対象・回数・時は次へ）', '主節の動詞群で、後ろのOと二つのMを保留します。'),
    step('O', 'the results', 'その結果を', 'verify の対象です。'),
    step('M', 'again', 'もう一度', '反復を示します。'),
    step('M', 'after consultation.', '協議のあとで、その結果をもう一度検証するでしょう', '時まで読んで主節の動作を完成します。自然訳にもこの時を残します。', '', {
      closureBinding: { type: 'predicate-completion', opener: 'will verify', governor: 'the research team', clause: 'the research team will verify the results again after consultation' },
    }),
  ),
  curr_syn_gr_exam_eiken_2_past_perfect_progressive_2_001: guide(
    '過去完了進行形 had been＋ing の主節をS→V→Oの順に読み、二つのM（期間・基準時）を後ろへ足します。',
    step('S', 'My mother', '私の母は', '文全体の主語です。'),
    step('V', 'had been cooking', 'ずっと料理していました（対象は次へ）', '過去完了進行形 had been＋ing で、過去のある時点まで継続していた動作を表します。'),
    step('O', 'dinner', '夕食を', 'cooking の対象です。'),
    step('M', 'for over an hour', '1時間以上', '継続した時間の長さを表す修飾語です。'),
    step('M', 'when the guests arrived early.', '客たちが早く到着したとき', '動作が続いていた基準となる過去の時点を示す時の副詞節です。'),
  ),
})

const applyManualReviewState = (id, rawGuide) => {
  const sourceEnglish = rawGuide.steps.map((item) => item.spokenEn ?? item.en).join(' ')
  const reviewEvidence = longManualReviewEvidence(id, sourceEnglish, rawGuide.steps)
  const steps = Object.freeze(rawGuide.steps.map((item) => {
    const pendingRule = pendingVerbGroupRule(item.en, item.role)
    return Object.freeze({
      ...item,
      source: reviewEvidence ? 'manual-review-ledger' : 'unregistered',
      reviewEvidenceId: reviewEvidence?.id ?? '',
      pendingRule,
      reviewState: pendingRule
        ? 'rule-review-needed'
        : reviewEvidence
          ? reviewEvidence.reviewState
          : 'unregistered',
      status: reviewEvidence && !pendingRule ? reviewEvidence.status : 'review-needed',
    })
  }))
  const allStepsConfirmed = steps.every((item) => item.status === 'confirmed')
  const allStepsReviewed = steps.every((item) => ['reviewed', 'confirmed'].includes(item.status))
  const meaningSteps = buildMeaningPhraseSequence(steps, {
    wordLimit: 8,
    explicitGroups: longSentenceMeaningPhrasesFor(id),
  })
  return Object.freeze({
    ...rawGuide,
    steps,
    meaningSteps,
    reviewEvidenceId: reviewEvidence?.id ?? '',
    reviewState: allStepsConfirmed
      ? 'audit-confirmed'
      : allStepsReviewed
        ? 'manual-reviewed'
        : 'review-needed',
    status: allStepsConfirmed ? 'confirmed' : allStepsReviewed ? 'reviewed' : 'review-needed',
  })
}

export const applyLongManualReviewState = applyManualReviewState

export const LONG_SENTENCE_TRANSLATIONS = Object.freeze(Object.fromEntries(
  Object.entries(RAW_LONG_SENTENCE_TRANSLATIONS).map(([id, rawGuide]) => [
    id,
    applyManualReviewState(id, rawGuide),
  ]),
))

export function englishWordCount(value = '') {
  return value.match(/[A-Za-z][A-Za-z'’-]*/g)?.length ?? 0
}

export function isLongSyntaxSentence(item) {
  return item?.kind === 'syntax' &&
    englishWordCount(item.example?.en) >= LONG_SENTENCE_WORD_THRESHOLD
}

export function longSentenceTranslationFor(item) {
  if (!item?.id) return null
  return LONG_SENTENCE_TRANSLATIONS[item.id] ??
    LONG_SENTENCE_TRANSLATIONS[`curr_syn_${item.id}`] ??
    null
}
