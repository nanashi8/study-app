import { useEffect, useRef } from 'react'
import { KanbunMarkedText } from './KanbunMarkedText.js'
import { KanbunText } from './KanbunFurigana.jsx'
import { KotenText } from './KotenFurigana.jsx'
import { MeaningText } from './MeaningText.jsx'
import { cx } from './ui.jsx'

// 漢文は文ごとに訓点つきの行で組むので、段落は div、英語・古文は文を続けて流すので p。
function Paragraph({ kanbun, children }) {
  return kanbun ? <div className="space-y-2">{children}</div> : <p>{children}</p>
}

// 名作の本文を段落ごとに続けて見せる。文（英語は1文、古文・漢文は「。」などで終わる1文）を押すと、
// その文の解説を開く。交互朗読で読んでいる文は色で示す。
// showTranslation：段落の下に訳（英語は和訳、古文・漢文は現代語訳）を出す。
// showKakikudashi：漢文の文の下に書き下し文を出す。
export function LiteratureFullText({
  work,
  paragraphs,
  currentIndex = -1,
  playing = false,
  onOpen,
  showTranslation = false,
  showKakikudashi = false,
}) {
  const refs = useRef(new Map())

  // 交互朗読で次の文へ進んだら、その文が画面に見えるようにする。
  useEffect(() => {
    if (!playing || currentIndex < 0) return
    refs.current.get(currentIndex)?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' })
  }, [currentIndex, playing])

  const english = work.kind === 'english'
  const kanbun = work.kind === 'kanbun'

  return (
    <div
      className={cx(
        'space-y-5 text-ink',
        english ? 'text-[1.05rem] leading-[1.95]' : 'font-serif text-lg leading-[2.1]',
      )}
      lang={english ? 'en' : 'ja'}
      data-literature-full-text={work.id}
    >
      {paragraphs.map((paragraph) => (
        <section key={paragraph.index} data-literature-paragraph={paragraph.index + 1}>
          <Paragraph kanbun={kanbun}>
            {paragraph.sentences.map((sentence) => {
              const active = sentence.index === currentIndex
              const common = {
                ref: (node) => {
                  if (node) refs.current.set(sentence.index, node)
                  else refs.current.delete(sentence.index)
                },
                onClick: () => onOpen(sentence.index),
                'aria-label': `${sentence.number}番目の文の解説を開く`,
                'aria-current': active ? 'true' : undefined,
                'data-literature-sentence': sentence.number,
                'data-literature-syntax-trigger': english ? sentence.number : undefined,
              }
              // 英語・古文は文を行の途中から続けて流すので、行をまたげる span を押せるようにする
              // （button は行の途中で折り返せない）。漢文は文ごとの行なので button。
              const Tag = kanbun ? 'button' : 'span'
              const keyboard = kanbun
                ? { type: 'button' }
                : {
                    role: 'button',
                    tabIndex: 0,
                    onKeyDown: (event) => {
                      if (event.key !== 'Enter' && event.key !== ' ') return
                      event.preventDefault()
                      onOpen(sentence.index)
                    },
                  }
              const button = (
                <Tag
                  key={sentence.id}
                  {...common}
                  {...keyboard}
                  className={cx(
                    'cursor-pointer rounded-md text-left font-[inherit] leading-[inherit] transition-colors hover:bg-brand-50 active:bg-brand-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-400',
                    kanbun ? 'block w-full px-0.5 py-1' : 'box-decoration-clone',
                    active && (playing ? 'bg-teal-100 text-teal-950' : 'bg-amber-50'),
                  )}
                >
                  {kanbun ? (
                    <>
                      <KanbunMarkedText marked={sentence.marked} showLegend={false} align="start" size="sm" inline />
                      {showKakikudashi && (
                        <span className="mt-1 block text-sm font-bold leading-relaxed text-ink/60">
                          <KanbunText>{sentence.entry.kakikudashi}</KanbunText>
                        </span>
                      )}
                    </>
                  ) : english ? (
                    sentence.text
                  ) : (
                    <KotenText>{sentence.text}</KotenText>
                  )}
                </Tag>
              )
              return kanbun ? button : (
                <span key={sentence.id}>
                  {button}
                  {english ? ' ' : ''}
                </span>
              )
            })}
          </Paragraph>
          {showTranslation && (
            <p
              className="mt-2 border-l-2 border-amber-300 bg-amber-50/70 px-3 py-2 font-sans text-sm font-bold leading-relaxed text-ink/70"
              lang="ja"
              data-literature-paragraph-translation={paragraph.index + 1}
            >
              {english
                ? <MeaningText>{paragraph.sentences.map((sentence) => sentence.ja).join('')}</MeaningText>
                : paragraph.sentences.map((sentence) => sentence.ja).join('')}
            </p>
          )}
        </section>
      ))}
    </div>
  )
}
