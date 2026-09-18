import { createElement } from 'react'
import { tokenize } from '../lib/text.js'
import { translationRoleMeta } from '../lib/translation-roles.js'
import { buildReadingRoleAnnotation } from '../lib/reading-role-annotations.js'
import {
  PARALLEL_STACK_STYLE,
  layoutParallel,
  numberWords,
  textPieces,
} from '../lib/structure-parallel-layout.js'
import { PARALLEL_LINE_CLASS } from './StructureDiagram.js'

const ROLE_LINE_CLASS = Object.freeze({
  S: 'border-emerald-400',
  V: 'border-rose-400',
  O: 'border-sky-400',
  O1: 'border-sky-400',
  O2: 'border-cyan-400',
  C: 'border-amber-400',
  M: 'border-violet-400',
  LINK: 'border-slate-400',
  S_FORMAL: 'border-emerald-300 border-dashed',
  S_REAL: 'border-emerald-400',
  O_FORMAL: 'border-sky-300 border-dashed',
  O_REAL: 'border-sky-400',
})

const ROLE_LABEL_CLASS = Object.freeze({
  S: 'bg-emerald-100 text-emerald-800',
  V: 'bg-rose-100 text-rose-800',
  O: 'bg-sky-100 text-sky-800',
  O1: 'bg-sky-100 text-sky-800',
  O2: 'bg-cyan-100 text-cyan-800',
  C: 'bg-amber-100 text-amber-800',
  M: 'bg-violet-100 text-violet-800',
  LINK: 'bg-slate-100 text-slate-700',
  S_FORMAL: 'bg-emerald-50 text-emerald-700',
  S_REAL: 'bg-emerald-100 text-emerald-800',
  O_FORMAL: 'bg-sky-50 text-sky-700',
  O_REAL: 'bg-sky-100 text-sky-800',
})

function classes(...values) {
  return values.filter(Boolean).join(' ')
}

function renderRoleText(segment, {
  activeWord,
  isKnownWord,
  onWordClick,
}) {
  return tokenize(segment.sourceText.trim()).map((token, tokenIndex) => {
    if (token.space) return ' '
    if (!token.word) {
      return createElement('span', { key: `punctuation-${tokenIndex}` }, token.pre)
    }
    const known = isKnownWord(token)
    return createElement(
      'span',
      { key: `word-${tokenIndex}` },
      token.pre,
      createElement(
        'button',
        {
          type: 'button',
          onClick: () => onWordClick(token),
          title: `${token.word}の意味と発音を確認`,
          className: classes(
            'rounded px-0.5 transition-colors active:bg-brand-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-400',
            known ? 'bg-brand-50 font-extrabold text-brand-700' : 'font-semibold text-ink',
            activeWord === token.word && 'bg-brand-200',
          ),
        },
        token.word,
      ),
      token.post,
    )
  })
}

export function ReadingRoleSentence({
  sentence = '',
  parts = [],
  activeWord = '',
  isKnownWord = () => false,
  onWordClick = () => {},
  allowVerbOmission = false,
  verbOmissionNote = 'Vなし（動詞を省いた文体上の断片）',
  // 節・句の中を示すときは、動詞のない句や主語のない句をそのまま表示する。
  inner = false,
  // and・or・but で並ぶもの（構造台帳の parallel。英文の頭からの語の番号）。あれば改行して縦にそろえる。
  parallel = [],
}) {
  const annotation = buildReadingRoleAnnotation(sentence, parts, {
    allowVerbOmission,
    allowMissingVerb: inner,
    withoutImpliedSubject: inner,
  })
  const children = []

  if (annotation.verbOmitted) {
    children.push(createElement(
      'span',
      {
        key: 'verb-omission',
        'data-reading-omitted-role': 'V',
        className: 'inline-flex max-w-full flex-col items-start self-end',
      },
      createElement(
        'span',
        { className: 'border-b-[3px] border-dashed border-rose-400 pb-0.5 text-xs font-bold text-rose-800' },
        verbOmissionNote,
      ),
      createElement(
        'span',
        { className: 'mt-1 rounded-full bg-rose-100 px-1.5 py-0.5 text-[9px] font-black leading-none text-rose-800' },
        'V 省略',
      ),
    ))
  }

  if (annotation.impliedSubject) {
    children.push(createElement(
      'span',
      {
        key: 'implied-subject',
        'data-reading-implied-role': 'S',
        className: 'inline-flex max-w-full flex-col items-start self-end',
      },
      createElement(
        'span',
        { className: 'border-b-[3px] border-dashed border-emerald-400 pb-0.5 text-xs font-bold text-emerald-800' },
        '(you は省略)',
      ),
      createElement(
        'span',
        { className: 'mt-1 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-black leading-none text-emerald-800' },
        'S 主語',
      ),
    ))
  }

  const renderOptions = { parts, inner, activeWord, isKnownWord, onWordClick }
  const parallelLayout = parallel.length && !annotation.errors.length
  if (parallelLayout) {
    children.push(...parallelRoleChildren(annotation, parallel, renderOptions))
  } else {
    for (const segment of annotation.segments) {
      children.push(roleColumn(segment, segment.sourceText, {
        ...renderOptions,
        key: `role-${segment.index}`,
        showLabel: true,
        align: 'self-end',
      }))
    }
  }

  return createElement(
    'p',
    {
      lang: 'en',
      'aria-label': inner ? '節・句の中のS・V・O・C・M' : 'S・V・O・C・Mの役割を直接表示した英文',
      'data-reading-role-sentence': 'true',
      'data-reading-role-status': annotation.errors.length ? 'incomplete' : 'complete',
      'data-reading-role-segment-count': annotation.segments.length,
      ...(parallelLayout ? { 'data-reading-role-layout': 'parallel' } : {}),
      className: parallelLayout
        ? 'flex flex-wrap items-start gap-x-2 gap-y-3 text-ink'
        : 'flex flex-wrap items-end gap-x-2 gap-y-3 text-ink',
    },
    ...children,
  )
}

// 役割の下線と、その下の役割の札（S 主語・等位接続詞など）。
// 並列で一つの要素が複数の行に分かれるときは、要素の最後の行にだけ札を付ける。
function roleColumn(segment, text, {
  parts,
  inner,
  activeWord,
  isKnownWord,
  onWordClick,
  key,
  showLabel,
  align,
}) {
  const meta = translationRoleMeta(segment.role)
  // 接続詞・関係代名詞・同格の that など、つなぐ語の種類を役割の下に並べる。
  const connector = parts[segment.index]?.connector ?? ''
  // 接続語は、種類（接続詞・等位接続詞・接続副詞など）が分かるときは種類だけを出し、「接続 接続詞」と重ねない。
  const connectorOnly = meta.code === '接続' && Boolean(connector)
  return createElement(
    'span',
    {
      key,
      role: 'group',
      'aria-label': `${meta.code}（${meta.label}）：${text.trim()}`,
      ...(showLabel
        ? { 'data-reading-role': segment.role }
        : { 'data-reading-role-part': segment.role }),
      'data-reading-role-code': meta.code,
      className: `inline-flex max-w-full flex-col items-start ${align}`,
    },
    createElement(
      'span',
      {
        lang: 'en',
        className: classes(
          inner
            ? 'max-w-full border-b-[3px] pb-0.5 text-base leading-relaxed'
            : 'max-w-full border-b-[3px] pb-0.5 text-lg leading-relaxed',
          ROLE_LINE_CLASS[segment.role] ?? 'border-brand-400',
        ),
      },
      ...renderRoleText({ sourceText: text }, { activeWord, isKnownWord, onWordClick }),
    ),
    showLabel
      ? createElement(
        'span',
        { className: 'mt-1 flex flex-wrap items-center gap-1' },
        connectorOnly
          ? null
          : createElement(
            'span',
            {
              className: classes(
                'rounded-full px-1.5 py-0.5 text-[9px] font-black leading-none',
                ROLE_LABEL_CLASS[segment.role] ?? 'bg-brand-100 text-brand-800',
              ),
            },
            meta.code === '接続' ? meta.code : `${meta.code} ${meta.label}`,
          ),
        connector
          ? createElement(
            'span',
            {
              'data-reading-connector': connector,
              className: connectorOnly
                ? classes(
                  'rounded-full px-1.5 py-0.5 text-[9px] font-black leading-none',
                  ROLE_LABEL_CLASS[segment.role] ?? 'bg-brand-100 text-brand-800',
                )
                : 'rounded-full bg-sky-100 px-1.5 py-0.5 text-[9px] font-black leading-none text-sky-800',
            },
            connector,
          )
          : null,
      )
      : null,
  )
}

// 並列（and・or・but で並ぶもの）を改行して縦にそろえた、下線つきの英文。
// 行の中では同じ要素の小片を一つの下線にまとめ、並ぶものの枠は左の細い線で示す。
function parallelRoleChildren(annotation, parallel, options) {
  const pieces = numberWords(annotation.segments.flatMap((segment) =>
    textPieces(segment.sourceText, { element: segment.index })))
    .map((piece, index) => ({ ...piece, at: index }))
  const lastPiece = new Map()
  for (const piece of pieces) {
    if (piece.type !== 'space') lastPiece.set(piece.element, piece.at)
  }
  const renderRow = (row, path) => {
    const children = []
    let run = []
    const flush = () => {
      const text = run.map((piece) => piece.text).join('')
      if (text.trim()) {
        const element = run[0].element
        children.push(roleColumn(annotation.segments[element], text, {
          ...options,
          key: `${path}.${children.length}`,
          showLabel: run.some((piece) => piece.at === lastPiece.get(element)),
          align: 'self-start',
        }))
      }
      run = []
    }
    for (const item of row.items) {
      // 節・句の中の並びは、開き括弧から先を一つの枠にして、続きを開き括弧の位置にそろえる。
      if (item.type === 'box') {
        flush()
        const key = `${path}.${children.length}`
        children.push(createElement(
          'span',
          {
            key,
            className: 'flex flex-wrap items-start gap-x-2 gap-y-3',
            style: PARALLEL_STACK_STYLE,
            'data-reading-parallel-box': '',
          },
          ...renderRow(item.row, key),
        ))
        continue
      }
      if (item.type === 'stack') {
        flush()
        const key = `${path}.${children.length}`
        children.push(createElement(
          'span',
          {
            key,
            className: 'flex flex-col gap-y-3',
            style: PARALLEL_STACK_STYLE,
            'data-reading-parallel': item.kind,
          },
          ...item.lines.map((line, lineIndex) => createElement(
            'span',
            {
              key: `${key}.${lineIndex}`,
              className: `flex flex-wrap items-start gap-x-2 gap-y-3 pl-2 ${PARALLEL_LINE_CLASS[line.coordinator ? 'coordinator' : 'item']}`,
              'data-reading-parallel-line': line.coordinator ? 'coordinator' : 'item',
            },
            ...renderRow(line, `${key}.${lineIndex}`),
          )),
        ))
        continue
      }
      if (item.type === 'break') {
        flush()
        children.push(createElement('span', {
          key: `${path}.${children.length}`,
          className: 'basis-full',
          'aria-hidden': 'true',
        }))
        continue
      }
      if (run.length && run.at(-1).element !== item.element && item.type !== 'space') flush()
      run.push(item)
    }
    flush()
    return children
  }
  return renderRow(layoutParallel(pieces, parallel), 'parallel')
}
