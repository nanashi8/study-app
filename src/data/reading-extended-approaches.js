const approach = (title, summary, steps, ruleIds) => Object.freeze({
  title,
  summary,
  steps: Object.freeze(steps),
  ruleIds: Object.freeze(ruleIds),
})
export const EXTENDED_PASSAGE_READING_APPROACHES = Object.freeze({
  p_ext_1000_civic_decisions: approach(
    '五つの公共課題を「主張・条件・見直し」で地図化する',
    '一文ずつの語彙事例を単独で終わらせず、節の問いに対する根拠の種類として分類する。',
    ['節見出しから中心の問いを一つ作る', '事例を権利・責任・資源・修正のどれかに置く', '節末で最も強い断定と残る条件を分ける'],
    ['paragraph-map', 'parallel-shape', 'contrast-concession', 'author-stance', 'evidence-backtrack', 'distractor-strength'],
  ),
  p_ext_2000_customs_across_borders: approach(
    '風習の事例を「文脈」と「変化」の二軸で比べる',
    '国や文化に一つの固定的な特徴を当てはめず、地域・世代・個人・場面が意味をどう変えるかを追う。',
    ['物や行為が表す意味を文脈付きで拾う', '世代・地域・移動による変化を比べる', 'always・everyのように一般化を強めた読みを避ける'],
    ['genre-prediction', 'example-restatement', 'comparison-pairs', 'reference-chain', 'unknown-word-context', 'distractor-strength'],
  ),
  p_ext_3000_shared_watershed: approach(
    '流域を「原因の連鎖」と「上流・下流の立場」で読む',
    '自然現象、農業、医療、設備、測定、政策を別々の話にせず、水を介した因果と利害の連鎖に戻す。',
    ['見える変化と遅い隠れた変化を分ける', '一つの行動が次の場所に与える影響を矢印でつなぐ', '測定値から言える範囲と協力の条件を確かめる'],
    ['paragraph-map', 'cause-result', 'comparison-pairs', 'author-stance', 'evidence-backtrack', 'repair-monitor'],
  ),
  p_ext_4000_generational_city: approach(
    '分野を越えて「誰が、いつ、何を負担するか」を追う',
    '経済、心理、制度、医療、技術の語彙事例を、現在の利益と将来の費用、その分配と見直し可能性に戻す。',
    ['現在と将来の利益・費用を分ける', '感情・制度・技術のどの条件が結果を変えるか拾う', '結論に残された異論・証拠・修正の余地を確かめる'],
    ['reading-mode', 'paragraph-map', 'contrast-concession', 'cause-result', 'author-stance', 'unknown-word-context'],
  ),
})
