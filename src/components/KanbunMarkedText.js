import { createElement } from 'react'
import { parseKanbunMarkedText, returnMarkMeta } from '../lib/kanbun-marks.js'

function classes(...values) {
  return values.filter(Boolean).join(' ')
}

export function KanbunMarkedText({
  marked = '',
  className = '',
  inverse = false,
  showLegend = true,
}) {
  const parsed = parseKanbunMarkedText(marked)
  const units = parsed.units.map((unit, index) => {
    if (unit.type === 'punctuation') {
      return createElement(
        'span',
        {
          key: `punctuation-${unit.sourceIndex}-${index}`,
          'data-kanbun-punctuation': unit.character,
          className: 'inline-flex h-12 min-w-[0.65em] items-start justify-center pt-1 font-serif text-2xl',
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
        className: 'relative inline-flex h-12 w-9 shrink-0 items-start justify-center pt-0.5 font-serif text-2xl font-extrabold leading-none',
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
              'data-kanbun-return-marks': unit.marks.join(''),
              className: classes(
                'absolute bottom-0 left-0 inline-flex max-w-full items-end whitespace-nowrap rounded px-0.5 font-serif text-[11px] font-black leading-none tracking-[-0.08em]',
                inverse ? 'bg-white/15 text-amber-200' : 'bg-rose-50 text-rose-700',
              ),
            },
            unit.marks.join(''),
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
        className: 'flex flex-wrap items-start justify-center gap-x-0.5 gap-y-2',
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
