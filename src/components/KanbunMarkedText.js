import { Fragment, createElement } from 'react'
import { parseKanbunMarkedText, returnMarkLabel, returnMarkMeta } from '../lib/kanbun-marks.js'

function classes(...values) {
  return values.filter(Boolean).join(' ')
}

// 一字を二段で組む。上段は字と右下の送り仮名、下段は字の下の返り点と、再読文字の二度目の読み。
// 下段の高さはどの字も同じにして、返り点の無い字とも行の高さをそろえる。
// sm は用例・作品本文むけ。一行に入る字数を増やし、折り返しを減らす。
const SIZES = Object.freeze({
  md: Object.freeze({
    row: 'h-9',
    character: 'min-w-[1.75rem] text-2xl',
    punctuation: 'text-2xl',
    okurigana: 'pb-0.5 text-xs',
    lower: 'h-4',
    mark: 'text-[11px]',
    secondReading: 'text-[11px]',
  }),
  sm: Object.freeze({
    row: 'h-7',
    character: 'min-w-[1.4rem] text-xl',
    punctuation: 'text-xl',
    okurigana: 'text-[11px]',
    lower: 'h-3.5',
    mark: 'text-[10px]',
    secondReading: 'text-[10px]',
  }),
})

function unitLabel(unit) {
  const reading = `${unit.character}${unit.okurigana}`
  const parts = []
  if (unit.secondReading) parts.push(`二度目の読み${unit.secondReading}`)
  if (unit.marks.length) parts.push(unit.marks.map((mark) => returnMarkMeta(mark)?.name ?? mark).join('・'))
  return parts.length ? `${reading}に${parts.join('・')}` : reading
}

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
          className: classes('inline-flex min-w-[0.65em] items-center justify-center font-serif leading-none', scale.row, scale.punctuation),
        },
        unit.character,
      )
    }

    const labels = unit.marks.map(returnMarkLabel).join('')
    return createElement(
      'span',
      {
        key: `character-${unit.sourceIndex}-${index}`,
        role: 'group',
        'aria-label': unitLabel(unit),
        'data-kanbun-character-unit': unit.character,
        'data-kanbun-return-mark-count': unit.marks.length,
        className: 'inline-grid shrink-0 grid-cols-[auto_auto] font-serif leading-none',
      },
      createElement(
        'span',
        {
          'data-kanbun-base-character': unit.character,
          className: classes('inline-flex items-center justify-center font-extrabold', scale.row, scale.character),
        },
        unit.character,
      ),
      createElement(
        'span',
        {
          'aria-hidden': 'true',
          'data-kanbun-okurigana': unit.okurigana || undefined,
          className: classes(
            'inline-flex items-end whitespace-nowrap font-bold tracking-[-0.04em]',
            scale.row,
            scale.okurigana,
            inverse ? 'text-white/90' : 'text-ink/80',
          ),
        },
        unit.okurigana,
      ),
      createElement(
        'span',
        {
          'aria-hidden': 'true',
          'data-kanbun-return-marks': labels || undefined,
          className: classes('inline-flex items-start justify-start', scale.lower),
        },
        labels
          ? createElement(
              'span',
              {
                className: classes(
                  'whitespace-nowrap rounded px-0.5 font-black leading-none tracking-[-0.08em]',
                  scale.mark,
                  inverse ? 'bg-white/15 text-amber-200' : 'bg-rose-50 text-rose-700',
                ),
              },
              labels,
            )
          : null,
      ),
      createElement(
        'span',
        {
          'aria-hidden': 'true',
          'data-kanbun-second-reading': unit.secondReading || undefined,
          className: classes(
            'inline-flex items-start whitespace-nowrap font-bold leading-none',
            scale.lower,
            scale.secondReading,
            inverse ? 'text-sky-200' : 'text-sky-700',
          ),
        },
        unit.secondReading,
      ),
    )
  })

  const legend = parsed.secondReadingCount
    ? '字の右は送り仮名、字の下は返り点です。青い仮名は再読文字の二度目の読みです。'
    : '字の右は送り仮名、字の下は返り点です。'

  return createElement(
    'figure',
    {
      className: classes('m-0', className),
      'data-kanbun-marked-text': parsed.source,
      'data-kanbun-mark-status': parsed.errors.length ? 'incomplete' : 'complete',
      'data-kanbun-return-mark-total': parsed.returnMarkCount,
      'data-kanbun-okurigana-total': parsed.okuriganaCount,
    },
    createElement(
      'div',
      {
        lang: 'ja',
        role: 'text',
        'aria-label': `訓読文：${parsed.source}`,
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
          legend,
        )
      : null,
  )
}

// 句法の「形」（A為㆓B所㆒㆑V など）を文の中にそのまま並べて出す。
// 返り点は本文の「二」「一」と見分けられるよう、字の右下に小さな記号で添える。
export function KanbunPatternText({ pattern = '' }) {
  const parsed = parseKanbunMarkedText(pattern)
  return createElement(
    Fragment,
    null,
    ...parsed.units.map((unit, index) => {
      if (!unit.marks.length) return unit.sourceText
      const labels = unit.marks.map(returnMarkLabel).join('')
      return createElement(
        'span',
        {
          key: `pattern-${unit.sourceIndex}-${index}`,
          className: 'whitespace-nowrap',
          'data-kanbun-pattern-unit': unit.character,
        },
        `${unit.character}${unit.okurigana}`,
        createElement(
          'span',
          {
            'aria-hidden': 'true',
            'data-kanbun-pattern-marks': labels,
            className: 'mx-px inline-block translate-y-1 rounded bg-rose-50 px-0.5 text-[0.7em] font-black leading-none text-rose-700',
          },
          labels,
        ),
        createElement(
          'span',
          { className: 'sr-only' },
          `（${unit.marks.map((mark) => returnMarkMeta(mark)?.name ?? mark).join('・')}）`,
        ),
      )
    }),
  )
}
