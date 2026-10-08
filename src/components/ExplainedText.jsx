// 英単語の解説の文を出す部品（requests/2026-10-08-explanation-word-links.json）。
// 文に出てくる英単語は、辞書に見出しがあれば押すとその語の辞書ページへ移るリンクにし、意味が書いていなければ小さく添える。
// どの語をリンクにし、何を添えるかは lib/explanationWords.js が決める。リンクの見た目は WordLink 1つにそろえる。
import { createContext, useContext } from 'react'
import { useStore } from '../store/useStore.js'
import { explanationSegments } from '../lib/explanationWords.js'
import { MeaningText } from './MeaningText.jsx'

// 画面ごとに、いま見ている語（リンクにしない）と、語を開く方法（暗記・テストは続きを退避してから開く）を渡す。
const ExplanationContext = createContext({ selfId: null, onWord: null })

export function ExplanationScope({ selfId = null, onWord = null, children }) {
  return <ExplanationContext.Provider value={{ selfId, onWord }}>{children}</ExplanationContext.Provider>
}

/** 語の後ろに添える意味。 */
function AddedMeaning({ meaning }) {
  if (!meaning) return null
  return (
    <span className="text-[0.85em] font-bold opacity-75" data-explain-meaning>
      （<MeaningText>{meaning}</MeaningText>）
    </span>
  )
}

/** 解説の中の、見出しのある英単語へのリンク。どの解説でも同じ見た目。marks は全件を確かめる道具が読む印。 */
export function WordLink({ wordId, children, meaning = '', marks = {} }) {
  const { onWord, selfId } = useContext(ExplanationContext)
  const navigate = useStore((state) => state.navigate)
  // いま見ている語は、押しても同じページなのでリンクにしない。
  if (wordId === selfId) return <span data-explain-kind="self" {...marks}>{children}</span>
  const open = () => (onWord ? onWord(wordId) : navigate('wordDetail', { id: wordId }))
  return (
    <button
      type="button"
      onClick={open}
      className="inline rounded-sm font-display font-extrabold text-brand-700 underline decoration-brand-300 decoration-dotted underline-offset-2 active:bg-brand-50"
      data-explain-kind="link"
      data-explain-link={wordId}
      {...marks}
    >
      {children}
      <AddedMeaning meaning={meaning} />
    </button>
  )
}

const marksOf = (segment) => ({ 'data-explain-key': segment.key, 'data-explain-source': segment.source })

function Segment({ segment }) {
  switch (segment.kind) {
    case undefined:
      return <MeaningText>{segment.text}</MeaningText>
    case 'link':
      return <WordLink wordId={segment.wordId} meaning={segment.meaning} marks={marksOf(segment)}>{segment.text}</WordLink>
    case 'phrase':
      // 英語の句・例。句の中の語はリンク、句の意味がなければ後ろに添える。
      return (
        <span data-explain-kind="phrase" {...marksOf(segment)}>
          {segment.parts.map((part, index) => <Segment key={`${index}:${part.text}`} segment={part} />)}
          <AddedMeaning meaning={segment.meaning} />
        </span>
      )
    case 'word':
      return (
        <span data-explain-kind="word" {...marksOf(segment)}>
          {segment.text}
          <AddedMeaning meaning={segment.meaning} />
        </span>
      )
    default:
      // self（そのページの語）・foreign（英語でない語・語の部品・型の記号）・phrase-word（句の中の働きの語）
      return <span data-explain-kind={segment.kind} {...marksOf(segment)}>{segment.text}</span>
  }
}

/** 解説の文。text は台帳の鍵になるので、加工しない元の文字列を渡す。 */
export function ExplainedText({ children }) {
  const { selfId } = useContext(ExplanationContext)
  if (children == null || children === '') return null
  if (typeof children !== 'string') return children
  return explanationSegments(children, { selfId }).map((segment, index) => (
    <Segment key={`${index}:${segment.text}`} segment={segment} />
  ))
}
