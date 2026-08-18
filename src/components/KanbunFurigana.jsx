import { Fragment } from 'react'
import { tokenizeKanbunText } from '../lib/kanbunFurigana.js'

// 漢文の本文・書き下し文・見出し語へふりがな（ルビ）を振る。
// readings に [漢字, よみ] を渡すと、その語だけ辞書より優先して読ませられる。
export function KanbunText({ children, readings = [] }) {
  if (children == null || children === '') return null
  if (typeof children !== 'string' && typeof children !== 'number') return children

  return tokenizeKanbunText(children, readings).map((segment, index) =>
    segment.reading ? (
      <ruby
        key={`${segment.text}:${segment.reading}:${index}`}
        className="koten-ruby"
        aria-label={`${segment.text}（${segment.reading}）`}
      >
        {segment.text}
        <rp>（</rp>
        <rt>{segment.reading}</rt>
        <rp>）</rp>
      </ruby>
    ) : (
      <Fragment key={`${segment.text}:${index}`}>{segment.text}</Fragment>
    ),
  )
}

// 見出し語は、その項目が持つ読み（reading）を最優先でルビにする。
export function KanbunHeadword({ item }) {
  if (!item?.title) return null
  const primary = item.reading ? String(item.reading).split('・')[0] : ''
  const readings = primary && primary !== item.title ? [[item.title, primary]] : []
  return <KanbunText readings={readings}>{item.title}</KanbunText>
}
