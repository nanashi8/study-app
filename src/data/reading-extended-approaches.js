const approach = (title, summary, steps, ruleIds) => Object.freeze({
  title,
  summary,
  steps: Object.freeze(steps),
  ruleIds: Object.freeze(ruleIds),
})
export const EXTENDED_PASSAGE_READING_APPROACHES = Object.freeze({
  p_ext_1000_civic_decisions: approach(
    '公共の決定を「主張・条件・見直し」で整理する',
    '公共の決定を扱う論説文では、節ごとの問いを先につかみ、代表・権利・情報・予算の具体例を、その問いへの答えとして読む。',
    ['節の見出しから、その節が答える問いを一つ作る', '具体例を、権利・責任・資源・見直しのどの話かに分ける', '節の終わりで、言い切っている主張と、残る条件を分ける'],
    ['paragraph-map', 'parallel-shape', 'contrast-concession', 'author-stance', 'evidence-backtrack', 'distractor-strength'],
  ),
  p_ext_2000_customs_across_borders: approach(
    '風習の例を、場面と変化の二つの面から比べる',
    '文化を比べる論説文では、国や文化に一つの決まった特徴を当てはめず、地域・世代・個人・場面によって意味がどう変わるかを追う。',
    ['物や行為が表す意味を、場面とあわせて拾う', '世代・地域・移動による変化を比べる', 'always・everyのような決めつける言い方に注意して読む'],
    ['genre-prediction', 'example-restatement', 'comparison-pairs', 'reference-chain', 'unknown-word-context', 'distractor-strength'],
  ),
  p_ext_3000_shared_watershed: approach(
    '流域を「原因の連鎖」と「上流・下流の立場」で読む',
    '流域を扱う論説文では、自然・農業・健康・設備・測定・政策を別々の話にせず、水を通してつながる原因と結果や、立場による利害として読む。',
    ['目に見える変化と、ゆっくり進む見えにくい変化を分ける', '一つの行動が次の場所に与える影響を、矢印でつなぐ', '測定値から言える範囲と、協力の条件を確かめる'],
    ['paragraph-map', 'cause-result', 'comparison-pairs', 'author-stance', 'evidence-backtrack', 'repair-monitor'],
  ),
  p_ext_4000_generational_city: approach(
    '分野を越えて「誰が、いつ、何を負担するか」を追う',
    '世代を越えて都市を考える論説文では、経済・心理・制度・医療・技術の話を、今の利益と将来の費用、その分け方と見直しの余地に結びつけて読む。',
    ['今と将来の、利益と費用を分ける', '感情・制度・技術のどの条件が結果を変えるかを拾う', '結論に残された異論・証拠・修正の余地を確かめる'],
    ['reading-mode', 'paragraph-map', 'contrast-concession', 'cause-result', 'author-stance', 'unknown-word-context'],
  ),
})
