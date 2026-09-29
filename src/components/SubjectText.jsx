import { Fragment } from 'react'
import { isSubjectTextSource, tokenizeSubjectText } from '../lib/subjectText.js'

// 社会・理科の文。常用漢字にない字をふくむ語（阿蘇山・菅原道真など）に、教科書と同じように読みがなを付ける。
export function SubjectText({ children }) {
  if (children == null || children === '') return null
  if (typeof children !== 'string' && typeof children !== 'number') return children
  return tokenizeSubjectText(children).map((segment, index) => (
    segment.reading ? (
      <ruby
        key={`${segment.text}:${index}`}
        className="subject-ruby"
        aria-label={`${segment.text}（${segment.reading}）`}
      >
        {segment.text}
        <rp>（</rp>
        <rt>{segment.reading}</rt>
        <rp>）</rp>
      </ruby>
    ) : (
      <Fragment key={`${segment.text}:${index}`}>{segment.text}</Fragment>
    )
  ))
}

// 一覧・単語帳・学習の記録のように、いろいろな教材の項目が並ぶ画面で使う。
// source が社会・理科の教材のときだけ読みがなを付け、ほかの教材の文はそのまま出す。
export function SubjectSourceText({ source, children }) {
  return isSubjectTextSource(source) ? <SubjectText>{children}</SubjectText> : (children ?? null)
}
