import { Fragment } from 'react'
import { tokenizeKotenText } from '../lib/kotenFurigana.js'

export function KotenText({ children, readings = [] }) {
  if (children == null || children === '') return null
  if (typeof children !== 'string' && typeof children !== 'number') return children

  return tokenizeKotenText(children, readings).map((segment, index) =>
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

export function KotenWord({ word }) {
  if (!word) return null
  const readings =
    word.kana && word.kana !== word.word ? [[word.word, word.kana]] : []
  return <KotenText readings={readings}>{word.word}</KotenText>
}
