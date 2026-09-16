import { heteronymFor } from '../lib/speechGuard.js'
import { cx } from './ui.jsx'

// 使い方（品詞・意味・時制）で発音が変わる語の読み分け。単語だけの音声は出さないので、発音記号で確かめる。
// compact は答えを見る前の面に出す短い形で、意味を書かない。
export function PronunciationNote({ word, compact = false, className = '' }) {
  const entry = heteronymFor(word)
  if (!entry) return null
  if (compact) {
    return (
      <p className={cx('text-[11px] font-extrabold text-amber-700', className)} data-pronunciation-note-compact>
        使い方で発音が変わる語（音声なし）
      </p>
    )
  }
  return (
    <div className={cx('rounded-2xl bg-amber-50 px-4 py-3 text-left ring-1 ring-amber-100', className)} data-pronunciation-note>
      <p className="text-xs font-extrabold text-amber-700">使い方で発音が変わる語</p>
      <ul className="mt-1.5 space-y-1">
        {entry.readings.map((reading) => {
          const current = reading.phonetic === word?.phonetic
          return (
            <li key={reading.phonetic} className="flex flex-wrap items-baseline gap-x-2 text-sm font-bold">
              <span className={current ? 'text-ink' : 'text-ink/60'}>{reading.use}</span>
              <span className={cx('font-display', current ? 'text-amber-800' : 'text-ink/60')}>{reading.phonetic}</span>
              {current && <span className="text-[11px] font-extrabold text-amber-700">この語</span>}
            </li>
          )
        })}
      </ul>
      <p className="mt-1.5 text-[11px] font-bold leading-relaxed text-amber-900/70">
        {entry.exampleSpeech
          ? 'つづりだけでは発音が決まらないので、単語だけの音声はありません。'
          : 'つづりだけでは発音が決まらないので、この語と例文の音声はありません。'}
      </p>
    </div>
  )
}
