const clean = (value) => String(value ?? '')
  .replace(/\s+/g, ' ')
  .replace(/。{2,}/g, '。')
  .replace(/([！？!?])\1+/g, '$1')
  .replace(/[.．]。/g, '。')
  .trim()
const quote = (value) => `「${clean(value)}」`
const list = (values, separator = '・') =>
  (values ?? []).map(clean).filter(Boolean).join(separator)

const explanation = ({ answer, evidence, trap, strategy }) => ({
  answer: clean(answer),
  evidence: clean(evidence),
  trap: clean(trap),
  strategy: clean(strategy),
})

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

export function isCompleteInstructorExplanation(value) {
  return ['answer', 'evidence', 'trap', 'strategy'].every(
    (key) => (
      clean(value?.[key]).length > 0
      && !/\bundefined\b/.test(clean(value?.[key]))
    ),
  )
}
