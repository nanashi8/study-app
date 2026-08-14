import { createElement } from 'react'
import { tokenize } from '../lib/text.js'
import { translationRoleMeta } from '../lib/translation-roles.js'
import { buildReadingRoleAnnotation } from '../lib/reading-role-annotations.js'

const ROLE_LINE_CLASS = Object.freeze({
  S: 'border-emerald-400',
  V: 'border-rose-400',
  O: 'border-sky-400',
  O1: 'border-sky-400',
  O2: 'border-cyan-400',
  C: 'border-amber-400',
  M: 'border-violet-400',
  LINK: 'border-slate-400',
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
})

function classes(...values) {
  return values.filter(Boolean).join(' ')
}

function renderRoleText(segment, {
  activeWord,
  isKnownWord,
  onWordClick,
}) {
  return tokenize(segment.sourceText.trimEnd()).map((token, tokenIndex) => {
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
}) {
  const annotation = buildReadingRoleAnnotation(sentence, parts, { allowVerbOmission })
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
        { className: 'rounded-full bg-rose-100 px-1.5 py-0.5 text-[9px] font-black leading-none text-rose-800' },
        'V 省略',
      ),
      createElement(
        'span',
        { className: 'mt-1 border-b-[3px] border-dashed border-rose-400 pb-0.5 text-xs font-bold text-rose-800' },
        verbOmissionNote,
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
        { className: 'rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-black leading-none text-emerald-800' },
        'S 主語',
      ),
      createElement(
        'span',
        { className: 'mt-1 border-b-[3px] border-dashed border-emerald-400 pb-0.5 text-xs font-bold text-emerald-800' },
        '(you は省略)',
      ),
    ))
  }

  for (const segment of annotation.segments) {
    const meta = translationRoleMeta(segment.role)
    children.push(createElement(
      'span',
      {
        key: `role-${segment.index}`,
        role: 'group',
        'aria-label': `${meta.code}（${meta.label}）：${segment.sourceText.trim()}`,
        'data-reading-role': segment.role,
        'data-reading-role-code': meta.code,
        className: 'inline-flex max-w-full flex-col items-start self-end',
      },
      createElement(
        'span',
        {
          className: classes(
            'rounded-full px-1.5 py-0.5 text-[9px] font-black leading-none',
            ROLE_LABEL_CLASS[segment.role] ?? 'bg-brand-100 text-brand-800',
          ),
        },
        meta.code === '接続' ? meta.code : `${meta.code} ${meta.label}`,
      ),
      createElement(
        'span',
        {
          lang: 'en',
          className: classes(
            'mt-1 max-w-full border-b-[3px] pb-0.5 text-lg leading-relaxed',
            ROLE_LINE_CLASS[segment.role] ?? 'border-brand-400',
          ),
        },
        ...renderRoleText(segment, { activeWord, isKnownWord, onWordClick }),
      ),
    ))
  }

  return createElement(
    'p',
    {
      lang: 'en',
      'aria-label': 'S・V・O・C・Mの役割を直接表示した英文',
      'data-reading-role-sentence': 'true',
      'data-reading-role-status': annotation.errors.length ? 'incomplete' : 'complete',
      'data-reading-role-segment-count': annotation.segments.length,
      className: 'flex flex-wrap items-end gap-x-2 gap-y-3 text-ink',
    },
    ...children,
  )
}
