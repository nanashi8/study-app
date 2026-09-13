import { getLevel } from '../data/levels.js'
import { getWord } from '../data/vocab.js'
import { ArrowRight } from './Icons.jsx'
import { MeaningText } from './MeaningText.jsx'
import { Chip, cx } from './ui.jsx'

// 単語カードの裏と辞書ページで使う、その語と組にして押さえたい語の表示部品。
// どの語を出すかは lib/wordRelations.js が決め、ここは並べ方だけを持つ。

const toId = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')

const TONES = {
  syn: 'bg-brand-50 text-brand-700 ring-brand-100',
  ant: 'bg-rose-50 text-rose-600 ring-rose-100',
  der: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
}

// 類義語・反対語・派生語のチップ。items=[{w,m}]。辞書にある語はタップでその語へ。
export function RefChips({ items, tone, onWord }) {
  const cls = TONES[tone] ?? TONES.syn
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((it, i) => {
        const exists = getWord(toId(it.w))
        const level = exists ? getLevel(exists.level) : null
        const body = (
          <>
            <span className="font-extrabold">{it.w}</span>
            {it.m && <span className="font-bold opacity-70"><MeaningText>{it.m}</MeaningText></span>}
            {level && (
              <span className="rounded-full bg-white/70 px-1 text-[9px] font-extrabold leading-tight ring-1 ring-current/20">
                {level.label}
              </span>
            )}
            {exists && onWord && <ArrowRight size={11} className="opacity-70" />}
          </>
        )
        const base = 'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ring-1'
        return exists && onWord ? (
          <button key={i} type="button" onClick={() => onWord(exists.id)} className={cx(base, cls, 'active:opacity-80')}>
            {body}
          </button>
        ) : (
          <span key={i} className={cx(base, cls)}>{body}</span>
        )
      })}
    </div>
  )
}

function SectionTitle({ className, children }) {
  return <div className={cx('mb-1.5 text-xs font-extrabold tracking-wide', className)}>{children}</div>
}

/** 意味が同じ・近い語。 */
export function SynonymSection({ items, onWord }) {
  if (!items.length) return null
  return (
    <div data-word-synonyms>
      <SectionTitle className="text-brand-500">意味が同じ・近い語</SectionTitle>
      <RefChips items={items} tone="syn" onWord={onWord} />
    </div>
  )
}

/** 1語と同じ意味で言いかえられる熟語。 */
export function IdiomEquivalentSection({ phrases }) {
  if (!phrases.length) return null
  return (
    <div data-word-idiom-equivalents>
      <SectionTitle className="text-sky-700">同じ意味の熟語</SectionTitle>
      <ul className="space-y-1.5">
        {phrases.map((phrase) => (
          <li key={phrase.id}>
            <p className="font-display text-sm font-extrabold leading-snug text-ink">{phrase.phrase}</p>
            <p className="text-xs font-bold leading-relaxed text-ink/55">{phrase.meaning}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** つづりが似ていて間違えやすい語。いま見ている語とちがう文字に色をつける。 */
export function ConfusableSection({ word, items, onWord }) {
  if (!items.length) return null
  return (
    <div data-word-confusables>
      <SectionTitle className="text-rose-500">つづりが似ていて間違えやすい語</SectionTitle>
      <p className="-mt-1 text-[11px] font-bold text-ink/45">色つきの文字が {word.word} とちがう所</p>
      <ul className="divide-y divide-rose-50">
        {items.map((item) => {
          const level = getLevel(item.word.level)
          const body = (
            <>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-display text-base font-extrabold tracking-wide text-ink">
                    {item.segments.map((segment, index) => (
                      <span key={index} className={segment.changed ? 'rounded-sm bg-rose-100 text-rose-600' : undefined}>
                        {segment.text}
                      </span>
                    ))}
                  </span>
                  {level && <Chip color={level.color}>{level.label}</Chip>}
                  {item.sameSound && (
                    <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-extrabold text-violet-600 ring-1 ring-violet-100">
                      発音が同じ
                    </span>
                  )}
                </div>
                <p className="text-xs font-bold leading-relaxed text-ink/55"><MeaningText>{item.word.meaning}</MeaningText></p>
              </div>
              {onWord && <ArrowRight size={14} className="shrink-0 text-ink/30" />}
            </>
          )
          return (
            <li key={item.word.id}>
              {onWord ? (
                <button
                  type="button"
                  onClick={() => onWord(item.word.id)}
                  className="flex w-full items-center gap-2 py-2 text-left active:opacity-70"
                >
                  {body}
                </button>
              ) : (
                <div className="flex items-center gap-2 py-2">{body}</div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/** 日本語に定着したカタカナ語。意味がずれる語は注意書きを添える。 */
export function LoanwordHint({ hint, className }) {
  if (!hint) return null
  return (
    <div className={cx('rounded-2xl bg-amber-50 px-3 py-2.5 ring-1 ring-amber-100', className)} data-word-loanword>
      <div className="flex flex-wrap items-baseline gap-x-2">
        <span className="text-xs font-extrabold text-amber-700">カタカナ語のヒント</span>
        <span className="font-display text-base font-extrabold text-ink">{hint.kana}</span>
      </div>
      {hint.note && <p className="mt-1 text-xs font-bold leading-relaxed text-amber-900/80">{hint.note}</p>}
    </div>
  )
}
