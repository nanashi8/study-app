import { useState } from 'react'
import { getLevel } from '../data/levels.js'
import { getWord } from '../data/vocab.js'
import { ArrowRight } from './Icons.jsx'
import { isAmbiguousSpeechText } from '../lib/speechGuard.js'
import { phraseSpeechText } from '../lib/phrase-speech.js'
import { FORM_POS_LABELS } from '../lib/wordRelations.js'
import { MeaningText } from './MeaningText.jsx'
import { SpeakButton } from './SpeakButton.jsx'
import { Chip, cx } from './ui.jsx'

// 単語カードの裏と辞書ページで使う、その語と組にして押さえたい語の表示部品。
// どの語を出すかは lib/wordRelations.js が決め、ここは並べ方だけを持つ。

const toId = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')

const TONES = {
  syn: { title: 'text-brand-500', row: 'divide-brand-50' },
  ant: { title: 'text-rose-500', row: 'divide-rose-50' },
  der: { title: 'text-emerald-600', row: 'divide-emerald-50' },
  form: { title: 'text-emerald-600', row: 'divide-emerald-50' },
}

// 行に並べる語を、辞書の見出し語（あれば）とそろえる。
// items は類義語・反対語・派生語欄の {w,m,id?} か、辞書の語そのもの（ほかの品詞の形）。
// id があるのは同じつづりの別の語を指す項目で、つづりで引くと元の語へ飛んでしまうもの。
function toRows(items) {
  return items.map((item) => {
    // 辞書に見出しのない形は、発音記号と意味だけを持つ（タップ先の辞書ページはない）。
    if (item.extra) {
      return { text: item.word, meaning: item.meaning, entry: null, phonetic: item.phonetic, pos: item.pos, note: item.formNote ?? '', usage: item.usageNote ?? '' }
    }
    if (item.word && item.pos) {
      return { text: item.word, meaning: item.meaning, entry: item, pos: item.pos, note: item.formNote ?? '', usage: item.usageNote ?? '' }
    }
    const entry = getWord(item.id ?? toId(item.w)) ?? null
    return { text: item.w, meaning: item.m || entry?.meaning || '', entry, pos: null, note: '', usage: item.usageNote ?? '' }
  })
}

// 関連語どうしの使い分け（word-usage-notes.js）。行の下に参考として出す。
function UsageNote({ text }) {
  if (!text) return null
  return (
    <p className="mt-1 rounded-lg bg-amber-50 px-2 py-1 text-[11px] font-bold leading-relaxed text-amber-900/85 ring-1 ring-amber-100" data-word-usage-note>
      <span className="mr-1 font-extrabold text-amber-700">使い分け</span>
      {text}
    </p>
  )
}

// 発音ボタン。使い方で発音が変わる語はボタンを出さない（SpeakButton）ので、同じ幅の空きで語の頭をそろえる。
function RowSpeakButton({ text, title = '単語' }) {
  return isAmbiguousSpeechText(text)
    ? <span className="h-8 w-8 shrink-0" aria-hidden="true" />
    : <SpeakButton text={text} size="sm" title={title} />
}

/**
 * 組にして押さえたい語の一覧。1行に発音ボタン・語・発音記号・意味・習う級を並べ、辞書にある語はタップでその語へ。
 * 発音ボタンは一覧ごとにまとまり（data-speech-group）、再生パネルの前後で同じ一覧の語へ移れる。
 */
export function RelatedWordList({ items, tone = 'syn', onWord, showPhonetic = true }) {
  const rows = toRows(items)
  const divide = (TONES[tone] ?? TONES.syn).row
  return (
    <ul className={cx('divide-y', divide)} data-speech-group>
      {rows.map((row, index) => {
        const level = row.entry ? getLevel(row.entry.level) : null
        const canOpen = Boolean(row.entry && onWord)
        const body = (
          <>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                {row.pos && (
                  <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-extrabold text-emerald-700 ring-1 ring-emerald-100">
                    {FORM_POS_LABELS[row.pos]}
                  </span>
                )}
                <span className="font-display text-base font-extrabold tracking-wide text-ink">{row.text}</span>
                {showPhonetic && (row.phonetic ?? row.entry?.phonetic) && (
                  <span className="text-xs font-bold text-ink/40">{row.phonetic ?? row.entry.phonetic}</span>
                )}
                {level && <Chip color={level.color}>{level.label}</Chip>}
              </div>
              {row.meaning && (
                <p className="text-xs font-bold leading-relaxed text-ink/55"><MeaningText>{row.meaning}</MeaningText></p>
              )}
              {/* 意味が広がった・ずれた形は、もとの語の意味からの筋道を添える。 */}
              {row.note && (
                <p className="mt-0.5 text-[11px] font-bold leading-relaxed text-amber-800/80" data-word-form-note>{row.note}</p>
              )}
              <UsageNote text={row.usage} />
            </div>
            {canOpen && <ArrowRight size={14} className="shrink-0 text-ink/30" />}
          </>
        )
        return (
          <li key={`${row.text}-${index}`} className="flex items-center gap-2 py-1.5">
            <RowSpeakButton text={row.text} />
            {canOpen ? (
              <button
                type="button"
                onClick={() => onWord(row.entry.id)}
                className="flex min-w-0 flex-1 items-center gap-2 text-left active:opacity-70"
              >
                {body}
              </button>
            ) : (
              <div className="flex min-w-0 flex-1 items-center gap-2">{body}</div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

function SectionTitle({ className, children }) {
  return <div className={cx('mb-1.5 text-xs font-extrabold tracking-wide', className)}>{children}</div>
}

/**
 * 同じ語から来た語。品詞がちがう形（decide なら decision・decisive・decisively）と、
 * 同じ品詞の派生語（music なら musician、decision なら decisiveness）を分けて並べる。
 */
export function WordFormSection({ items, sameItems = [], onWord, showPhonetic, ownNote = '' }) {
  if (!items.length && !sameItems.length) return null
  return (
    <div data-word-forms>
      {/* この語自身が、もとの語から意味の離れた語のとき。並ぶ形はもとの語のものなので、つながりを先に示す。 */}
      {ownNote && (
        <p className="mb-1 text-[11px] font-bold leading-relaxed text-amber-800/80" data-word-form-own-note>{ownNote}</p>
      )}
      {items.length > 0 && (
        <>
          <SectionTitle className={TONES.form.title}>ほかの品詞の形</SectionTitle>
          <RelatedWordList items={items} tone="form" onWord={onWord} showPhonetic={showPhonetic} />
        </>
      )}
      {sameItems.length > 0 && (
        <div className={items.length ? 'mt-3' : ''} data-word-same-forms>
          <SectionTitle className={TONES.form.title}>同じ品詞の派生語</SectionTitle>
          <RelatedWordList items={sameItems} tone="form" onWord={onWord} showPhonetic={showPhonetic} />
        </div>
      )}
    </div>
  )
}

/** 意味が同じ・近い語。 */
export function SynonymSection({ items, onWord, showPhonetic }) {
  if (!items.length) return null
  return (
    <div data-word-synonyms>
      <SectionTitle className={TONES.syn.title}>意味が同じ・近い語</SectionTitle>
      <RelatedWordList items={items} tone="syn" onWord={onWord} showPhonetic={showPhonetic} />
    </div>
  )
}

/** 使い分けに注意する語（ほかの欄に出ない使い分けの相手）。 */
export function UsagePartnerSection({ items, onWord, showPhonetic }) {
  if (!items.length) return null
  return (
    <div data-word-usage-partners>
      <SectionTitle className="text-amber-700">使い分けに注意する語</SectionTitle>
      <RelatedWordList items={items} tone="syn" onWord={onWord} showPhonetic={showPhonetic} />
    </div>
  )
}

/** 意味が反対の語と、対になる語（反意語欄）。 */
export function AntonymSection({ items, onWord, showPhonetic }) {
  if (!items.length) return null
  return (
    <div data-word-antonyms>
      <SectionTitle className={TONES.ant.title}>意味が反対・対照の語</SectionTitle>
      <RelatedWordList items={items} tone="ant" onWord={onWord} showPhonetic={showPhonetic} />
    </div>
  )
}

/** 1語と同じ意味で言いかえられる熟語。熟語ごとに発音ボタンをつける。 */
export function IdiomEquivalentSection({ phrases }) {
  if (!phrases.length) return null
  return (
    <div data-word-idiom-equivalents>
      <SectionTitle className="text-sky-700">同じ意味の熟語</SectionTitle>
      <ul className="space-y-1.5" data-speech-group>
        {phrases.map((phrase) => (
          <li key={phrase.id} className="flex items-start gap-2">
            <RowSpeakButton text={phraseSpeechText(phrase)} title="熟語" />
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-extrabold leading-snug text-ink">{phrase.phrase}</p>
              <p className="text-xs font-bold leading-relaxed text-ink/55">{phrase.meaning}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** 熟語・構文の一覧（発音ボタン・種類・見出し・意味）。構文は見出しの記号でなく例文を読む。 */
function PhraseList({ phrases }) {
  return (
    <ul className="mt-2 space-y-1.5" data-speech-group>
      {phrases.map((phrase) => (
        <li key={phrase.id} className="flex items-start gap-2">
          <RowSpeakButton text={phraseSpeechText(phrase)} title={phrase.kind === 'syntax' ? '構文' : '熟語'} />
          <span
            className="mt-0.5 shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-extrabold text-white"
            style={{ backgroundColor: phrase.kind === 'syntax' ? '#8b5cf6' : '#0ea5e9' }}
          >
            {phrase.kind === 'syntax' ? '構文' : '熟語'}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-sm font-extrabold leading-snug text-ink">
              {phrase.phrase}
            </p>
            <p className="text-xs font-bold leading-relaxed text-ink/55">{phrase.meaning}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}

function PhraseListHeading({ label, count }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-xs font-extrabold text-sky-700">{label}</span>
      <span className="text-[11px] font-bold text-ink/40">
        全{count}項目
      </span>
    </div>
  )
}

/** ほかの品詞の形を使う熟語・構文。項目が多い形（being に対する be など）は畳んでおき、押すと開く。 */
function FormPhraseGroup({ group }) {
  const { form, phrases, collapsed } = group
  const [open, setOpen] = useState(!collapsed)
  const label = `${form.word}（${FORM_POS_LABELS[form.pos]}）を含む熟語・構文`
  return (
    <div data-word-form-phrases={form.word}>
      {collapsed ? (
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="flex w-full items-baseline justify-between gap-2 text-left active:opacity-70"
        >
          <span className="text-xs font-extrabold text-sky-700">
            {open ? '▼' : '▶'} {label}
          </span>
          <span className="text-[11px] font-bold text-ink/40">
            全{phrases.length}項目
          </span>
        </button>
      ) : (
        <PhraseListHeading label={label} count={phrases.length} />
      )}
      {open && <PhraseList phrases={phrases} />}
    </div>
  )
}

/**
 * その語を含む熟語・構文を省略せず全部と、ほかの品詞の形を使う熟語・構文（decide に対する make a decision）。
 * 暗記カードの裏と辞書ページで同じ中身を出す。groups は lib/wordPhrases.js の phraseGroupsForWord。
 */
export function WordPhraseSection({ word, groups }) {
  if (!groups.all.length && !groups.viaForms.length) return null
  return (
    <div className="space-y-4">
      {groups.all.length > 0 && (
        <div data-word-phrases>
          <PhraseListHeading label={`${word.word} を含む熟語・構文`} count={groups.all.length} />
          <PhraseList phrases={groups.all} />
        </div>
      )}
      {groups.viaForms.map((group) => (
        <FormPhraseGroup key={group.form.word} group={group} />
      ))}
    </div>
  )
}

/** つづりが似ていて間違えやすい語。いま見ている語とちがう文字に色をつける。 */
export function ConfusableSection({ word, items, onWord, showPhonetic = true }) {
  if (!items.length) return null
  return (
    <div data-word-confusables>
      <SectionTitle className="text-rose-500">つづりが似ていて間違えやすい語</SectionTitle>
      <p className="-mt-1 text-[11px] font-bold text-ink/45">色つきの文字が {word.word} とちがう所</p>
      <ul className="divide-y divide-rose-50" data-speech-group>
        {items.map((item) => {
          const level = item.word.level ? getLevel(item.word.level) : null
          // 辞書に見出しのない語（admire に対する admiral）は、意味と発音記号だけを出す。
          const canOpen = Boolean(item.word.id && onWord)
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
                  {showPhonetic && item.word.phonetic && (
                    <span className="text-xs font-bold text-ink/40">{item.word.phonetic}</span>
                  )}
                  {level && <Chip color={level.color}>{level.label}</Chip>}
                  {item.sameSound && (
                    <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-extrabold text-violet-600 ring-1 ring-violet-100">
                      発音が同じ
                    </span>
                  )}
                </div>
                <p className="text-xs font-bold leading-relaxed text-ink/55"><MeaningText>{item.word.meaning}</MeaningText></p>
                <UsageNote text={item.usageNote} />
              </div>
              {canOpen && <ArrowRight size={14} className="shrink-0 text-ink/30" />}
            </>
          )
          return (
            <li key={item.word.id ?? item.word.word} className="flex items-center gap-2 py-2">
              <RowSpeakButton text={item.word.word} />
              {canOpen ? (
                <button
                  type="button"
                  onClick={() => onWord(item.word.id)}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left active:opacity-70"
                >
                  {body}
                </button>
              ) : (
                <div className="flex min-w-0 flex-1 items-center gap-2">{body}</div>
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
