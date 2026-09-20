import { Fragment, createElement } from 'react'
import { parseKanbunMarkedText, returnMarkLabel, returnMarkMeta } from '../lib/kanbun-marks.js'

function classes(...values) {
  return values.filter(Boolean).join(' ')
}

// 一字を二段で組む。上段は字と右下の送り仮名、下段は字の下の返り点と、再読文字の二度目の読み。
// 下段の高さはどの字も同じにして、返り点の無い字とも行の高さをそろえる。
// レ点は「この字とすぐ下の字を入れ替える」記号なので、字の下ではなく次の字との境目に置く
// （一レ・上レも一つの点としてまとめて境目へ）。形は文字でなく図で描き、端末のフォントで位置や形が変わらないようにする。
// sm は用例・作品本文むけ。一行に入る字数を増やし、折り返しを減らす。
const SIZES = Object.freeze({
  md: Object.freeze({
    row: 'h-9',
    reTop: 'top-9',
    character: 'min-w-[1.75rem] text-2xl',
    punctuation: 'text-2xl',
    okurigana: 'pb-0.5 text-xs',
    lower: 'h-4',
    mark: 'text-[11px]',
    secondReading: 'text-[11px]',
  }),
  sm: Object.freeze({
    row: 'h-7',
    reTop: 'top-7',
    character: 'min-w-[1.4rem] text-xl',
    punctuation: 'text-xl',
    okurigana: 'text-[11px]',
    lower: 'h-3.5',
    mark: 'text-[10px]',
    secondReading: 'text-[10px]',
  }),
})

const RE_MARK = '㆑'

// レ点の形。縦に下ろしてから右上へはね上げる。幅と高さは周りの字の大きさ（em）に合わせる。
function reMarkShape(key) {
  return createElement(
    'svg',
    {
      key,
      viewBox: '0 0 10 10',
      'data-kanbun-re-mark-shape': '',
      className: 'inline-block h-[0.8em] w-[0.8em] shrink-0 overflow-visible',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 1.8,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    },
    createElement('path', { d: 'M2.5 1.5V8.5L8.5 3.5' }),
  )
}

// 返り点を並べて出す。レは図、ほかの点は字で。
function returnMarkContent(marks) {
  return marks.map((mark, index) => (
    mark === RE_MARK ? reMarkShape(`re-${index}`) : returnMarkLabel(mark)
  ))
}

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
    const hasReMark = unit.marks.includes(RE_MARK)
    const markBadge = (extra) => createElement(
      'span',
      {
        'aria-hidden': 'true',
        'data-kanbun-return-marks': labels,
        'data-kanbun-return-mark-place': hasReMark ? 'between' : 'below',
        className: classes(
          'inline-flex items-center whitespace-nowrap rounded px-px font-black leading-none tracking-[-0.08em]',
          scale.mark,
          inverse ? 'bg-white/15 text-amber-200' : 'bg-rose-50 text-rose-700',
          extra,
        ),
      },
      ...returnMarkContent(unit.marks),
    )
    return createElement(
      'span',
      {
        key: `character-${unit.sourceIndex}-${index}`,
        role: 'group',
        'aria-label': unitLabel(unit),
        'data-kanbun-character-unit': unit.character,
        'data-kanbun-return-mark-count': unit.marks.length,
        // レ点を境目に置く字は右に少し間を空け、次の字の返り点と重ならないようにする。
        className: classes('relative inline-grid shrink-0 grid-cols-[auto_auto] font-serif leading-none', hasReMark && 'mr-1.5'),
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
        // 一・二などは字の下の右寄せ（縦書きの「字の左下」にあたる、次の字の側）。前の字のレ点とも離れる。
        { className: classes('inline-flex items-start justify-end', scale.lower) },
        labels && !hasReMark ? markBadge() : null,
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
      // 境目（この字の右端と次の字の左端の間）にレの縦線が来るよう、右端から外へ出す。
      hasReMark ? markBadge(classes('absolute right-[calc(-5px-0.4em)]', scale.reTop)) : null,
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
            className: 'mx-px inline-flex translate-y-1 items-center rounded bg-rose-50 px-0.5 text-[0.7em] font-black leading-none text-rose-700',
          },
          ...returnMarkContent(unit.marks),
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
