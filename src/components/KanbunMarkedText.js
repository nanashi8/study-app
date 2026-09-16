import { createElement } from 'react'
import { parseKanbunMarkedText, returnMarkLabel, returnMarkMeta } from '../lib/kanbun-marks.js'

function classes(...values) {
  return values.filter(Boolean).join(' ')
}

// 返り点は親字の左下に置くので、字の下に点一つ分の高さを空ける。
// sm は用例・作品本文むけ。一行に入る字数を増やし、折り返しを減らす。
const SIZES = Object.freeze({
  md: Object.freeze({
    character: 'h-12 w-9 text-2xl',
    punctuation: 'h-12 text-2xl',
    mark: 'text-[11px]',
  }),
  sm: Object.freeze({
    character: 'h-10 w-7 text-xl',
    punctuation: 'h-10 text-xl',
    mark: 'text-[10px]',
  }),
})

export function KanbunMarkedText({
  marked = '',
  className = '',
  inverse = false,
  showLegend = true,
  align = 'center',
  size = 'md',
}) {
  const scale = SIZES[size] ?? SIZES.md
  const parsed = parseKanbunMarkedText(marked)
  const units = parsed.units.map((unit, index) => {
    if (unit.type === 'punctuation') {
      return createElement(
        'span',
        {
          key: `punctuation-${unit.sourceIndex}-${index}`,
          'data-kanbun-punctuation': unit.character,
          className: classes('inline-flex min-w-[0.65em] items-start justify-center pt-1 font-serif', scale.punctuation),
        },
        unit.character,
      )
    }

    const markNames = unit.marks.map((mark) => returnMarkMeta(mark)?.name ?? mark)
    return createElement(
      'span',
      {
        key: `character-${unit.sourceIndex}-${index}`,
        role: 'group',
        'aria-label': unit.marks.length
          ? `${unit.character}に${markNames.join('・')}`
          : unit.character,
        'data-kanbun-character-unit': unit.character,
        'data-kanbun-return-mark-count': unit.marks.length,
        className: classes('relative inline-flex shrink-0 items-start justify-center pt-0.5 font-serif font-extrabold leading-none', scale.character),
      },
      createElement(
        'span',
        { 'data-kanbun-base-character': unit.character },
        unit.character,
      ),
      unit.marks.length
        ? createElement(
            'span',
            {
              'aria-hidden': 'true',
              'data-kanbun-return-marks': unit.marks.map(returnMarkLabel).join(''),
              className: classes(
                'absolute bottom-0 left-0 inline-flex max-w-full items-end whitespace-nowrap rounded px-0.5 font-serif font-black leading-none tracking-[-0.08em]',
                scale.mark,
                inverse ? 'bg-white/15 text-amber-200' : 'bg-rose-50 text-rose-700',
              ),
            },
            unit.marks.map(returnMarkLabel).join(''),
          )
        : null,
    )
  })

  return createElement(
    'figure',
    {
      className: classes('m-0', className),
      'data-kanbun-marked-text': parsed.source,
      'data-kanbun-mark-status': parsed.errors.length ? 'incomplete' : 'complete',
      'data-kanbun-return-mark-total': parsed.returnMarkCount,
    },
    createElement(
      'div',
      {
        lang: 'zh-Hant',
        role: 'text',
        'aria-label': `返り点付き漢文：${parsed.source}`,
        className: classes(
          'flex flex-wrap items-start gap-x-0.5 gap-y-2',
          align === 'start' ? 'justify-start' : 'justify-center',
        ),
      },
      ...units,
    ),
    showLegend
      ? createElement(
          'figcaption',
          {
            className: classes(
              'mt-2 text-center text-[10px] font-bold leading-relaxed',
              inverse ? 'text-white/65' : 'text-ink/45',
            ),
          },
          '小さな返り点は、同じまとまりの大きな親字に付いています。折り返しても離れません。',
        )
      : null,
  )
}
