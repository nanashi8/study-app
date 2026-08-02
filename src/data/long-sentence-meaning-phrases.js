// 12語以上の全33英文について、学習者が実際に発音して意味を取るフレーズを固定する。
// SVOCMの原子単位は文型確認用に残し、ここでは複数役割を自然な意味単位へまとめる。

const m = (en, ja, grammar = '', options = {}) => Object.freeze({
  en,
  ja,
  grammar,
  ...options,
})

const groups = (...items) => Object.freeze(items)

export const LONG_SENTENCE_MEANING_PHRASES = Object.freeze({
  exam_syn_as_long_as: groups(
    m('You may use the room', 'あなたはその部屋を使ってよいです'),
    m('as long as', 'ただし、〜する限り'),
    m('you keep it clean.', 'あなたがその部屋をきれいに保つ限り'),
  ),
  curr_syn_gr_more_1_tense_01: groups(
    m('By the time', '〜する時までには'),
    m('the merger is completed,', '合併が完了する（時までには）'),
    m('the firms will have operated independently', '両社は独立して操業してきたことになります'),
    m('for decades.', '何十年もの間（操業してきたことになります）'),
  ),
  curr_syn_gr_auto_1_agreement_neither_001: groups(
    m('Neither the chair nor the members', '議長も委員たちも'),
    m('were willing to revise the proposal.', 'その提案を進んで修正する意思はありませんでした'),
  ),
  curr_syn_gr_auto_1_all_the_more_001: groups(
    m("The committee's decision", '委員会の決定は'),
    m('is all the more important', 'なおさら重要です'),
    m('because', 'なぜなら'),
    m('action was delayed.', '対応が遅れたからです'),
  ),
  curr_syn_gr_auto_1_future_perfect_progressive_001: groups(
    m('By next June,', '来年6月までには'),
    m('the committee', '委員会は'),
    m('will have been revising the proposal', 'その提案を修正し続けていることになります'),
    m('for two months.', '2か月間（修正し続けていることになります）'),
  ),
  curr_syn_gr_auto_1_no_sooner_001: groups(
    m('No sooner', '〜するとすぐに'),
    m('had the committee revised the proposal', '委員会がその提案を修正し終える（とすぐに）'),
    m('than', 'すると続いて'),
    m('the public began to respond.', '世間が反応し始めました'),
  ),
  curr_syn_gr_auto_1_provided_that_001: groups(
    m('The committee may revise the proposal', '委員会はその提案を修正してよいです'),
    m('provided that', 'ただし〜という条件で'),
    m('the evidence is disclosed.', 'その証拠が公開されるという条件で'),
  ),
  curr_syn_gr_auto_1_superior_to_001: groups(
    m('In handling the proposal,', 'その提案を扱う際には'),
    m('this approach', 'この方法は'),
    m('is superior to the previous one', '以前の方法より優れています'),
    m('in accuracy.', '正確さの点で（優れています）'),
  ),
  curr_syn_gr_auto_1_were_to_001: groups(
    m('Were the committee to revise the proposal unexpectedly,', '仮に委員会がその提案を予想外に修正するとすれば'),
    m('the consequences would be serious.', 'その結果は重大になるでしょう'),
  ),
  curr_syn_gr_exam_university_1_degree_adverb_001: groups(
    m('The laboratory test showed', 'その実験室での試験は示しました（内容は次へ）'),
    m('the filter was useless:', 'そのフィルターは役に立たないと――'),
    m('it removed practically nothing', 'それはほとんど何も取り除きませんでした'),
    m('from the polluted water.', 'その汚染水からは（ほとんど何も取り除きませんでした）'),
  ),
  curr_syn_gr_more_1_modal_02: groups(
    m('The report', 'その報告書は'),
    m('need not have been so lengthy;', 'それほど長い必要はありませんでした。'),
    m('a summary would have sufficed.', '要約だけで十分だったでしょう'),
  ),
  curr_syn_gr_more_1_emph_01: groups(
    m('What the committee objects to', '委員会が反対していることは'),
    m('is not the cost', '費用ではなく'),
    m('but the lack of evidence.', 'むしろ証拠の不足です'),
  ),
  curr_syn_gr_auto_1_agreement_neither_002: groups(
    m('Neither the chair nor the members', '議長も委員たちも'),
    m('were willing to verify the results.', 'その結果を進んで検証する意思はありませんでした'),
  ),
  curr_syn_gr_auto_1_all_the_more_002: groups(
    m("The committee's decision", '委員会の決定は'),
    m('is all the more urgent', 'なおさら緊急です'),
    m('because', 'なぜなら'),
    m('action was delayed.', '対応が遅れたからです'),
  ),
  curr_syn_gr_auto_1_extent_to_which_002: groups(
    m('The extent to which', 'どの程度までかという点は'),
    m('the committee revised the proposal', '委員会がその提案を修正した（程度は）'),
    m('is still disputed.', '今も議論されています'),
  ),
  curr_syn_gr_auto_1_future_perfect_progressive_002: groups(
    m('By next June,', '来年6月までには'),
    m('the committee', '委員会は'),
    m('will have been revising the proposal', 'その提案を修正し続けていることになります'),
    m('for a year.', '1年間（修正し続けていることになります）'),
  ),
  curr_syn_gr_auto_1_lest_002: groups(
    m('The committee explained its decision carefully', '委員会はその決定を注意深く説明しました'),
    m('lest', '〜という事態を避けるために'),
    m('anyone should overlook a detail.', 'だれかが細部を見落とす（事態を避けるために）'),
  ),
  curr_syn_gr_auto_2_gerund_idiom_001: groups(
    m('There is no denying', '否定することはできません'),
    m('that', '次の内容を（否定できません）'),
    m('the committee must revise the proposal', '委員会がその提案を修正しなければならないことを'),
    m('at this stage.', 'この段階で（修正しなければならないことを）'),
  ),
  curr_syn_gr_auto_2_inanimate_subject_001: groups(
    m('The new system', 'その新しい制度は'),
    m('will enable the committee to revise the proposal', '委員会がその提案を修正できるようにします'),
    m('more efficiently.', 'より効率的に（修正できるようにします）'),
  ),
  curr_syn_gr_auto_2_past_subjunctive_001: groups(
    m('If', 'もし'),
    m('the committee had revised the proposal earlier,', '委員会がその提案をもっと早く修正していたなら'),
    m('the outcome would have been different.', 'その結果は違っていたでしょう'),
  ),
  curr_syn_gr_auto_pre2_correlative_001: groups(
    m('Ken can not only play tennis after school', 'ケンは放課後にテニスをするだけでなく'),
    m('but also', 'さらに'),
    m('call Grandma in the evening.', '夕方には祖母へ電話することもできます'),
  ),
  curr_syn_gr_pre2_pron_3: groups(
    m('I have two cats;', '私は猫を2匹飼っています。'),
    m('one is white', '一匹は白く'),
    m('and', 'そして'),
    m('the other is black.', 'もう一匹は黒いです'),
  ),
  curr_syn_gr_auto_pre1_agreement_001: groups(
    m('A series of reviews is expected', '一連の審査が期待されています'),
    m('to help the committee revise the proposal.', '委員会がその提案を修正する助けになると'),
  ),
  curr_syn_gr_auto_pre1_be_to_001: groups(
    m('If', 'もし'),
    m('the committee is to revise the proposal successfully,', '委員会がその提案をうまく修正するつもりなら'),
    m('it needs more resources.', '委員会にはさらに多くの資源が必要です'),
  ),
  curr_syn_gr_auto_pre1_conditional_inversion_001: groups(
    m('Had the committee revised the proposal earlier,', 'もし委員会がその提案をもっと早く修正していたなら'),
    m('the outcome would have differed.', 'その結果は異なっていたでしょう'),
  ),
  curr_syn_gr_auto_pre1_whale_001: groups(
    m('In formal reasoning,', '厳密な推論では'),
    m('a rumor', 'うわさは'),
    m('is no more evidence than a guess is.', '推測が証拠でないのと同じく、証拠ではありません'),
  ),
  curr_syn_gr_auto_pre1_agreement_002: groups(
    m('A series of reviews is expected', '一連の審査が期待されています'),
    m('to help the research team verify the results.', '研究チームがその結果を検証する助けになると'),
  ),
  curr_syn_gr_auto_pre1_appositive_that_002: groups(
    m('The fact that', '〜という事実は（内容は次へ）'),
    m('the research team may verify the results', '研究チームがその結果を検証するかもしれないという'),
    m('deserves attention.', '注目に値します'),
  ),
  curr_syn_gr_auto_pre1_be_to_002: groups(
    m('If', 'もし'),
    m('the committee is to revise the proposal', '委員会がその提案を修正するつもりなら'),
    m('by the deadline,', 'その期限までに（修正するつもりなら）'),
    m('it needs more resources.', '委員会にはさらに多くの資源が必要です'),
  ),
  curr_syn_gr_auto_pre1_comparison_002: groups(
    m('The proposal', 'その提案は'),
    m('is not so much expensive', '高価だというよりも'),
    m('as impractical', 'むしろ実用的でないのです'),
    m('under current conditions.', '現在の条件のもとでは（実用的でないのです）'),
  ),
  curr_syn_gr_auto_pre1_conditional_inversion_002: groups(
    m('Had the committee revised the proposal more carefully,', 'もし委員会がその提案をもっと慎重に修正していたなら'),
    m('the outcome would have differed.', 'その結果は異なっていたでしょう'),
  ),
  curr_syn_gr_auto_pre1_ellipsis_002: groups(
    m('If necessary,', '必要なら'),
    m('the research team will verify the results', '研究チームはその結果を検証するでしょう'),
    m('again after consultation.', '協議のあとでもう一度（検証するでしょう）'),
  ),
  curr_syn_gr_auto_pre1_only_inversion_002: groups(
    m('Only after the final review', '最終確認を終えて初めて'),
    m('did the research team verify the results.', '研究チームはその結果を検証しました'),
  ),
})

export function longSentenceMeaningPhrasesFor(id) {
  return LONG_SENTENCE_MEANING_PHRASES[id] ?? null
}
