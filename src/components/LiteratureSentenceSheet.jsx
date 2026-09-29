import { useStore } from '../store/useStore.js'
import { Sheet } from './Sheet.jsx'
import { SpeakButton } from './SpeakButton.jsx'
import { KanbunMarkedText } from './KanbunMarkedText.js'
import { KanbunText } from './KanbunFurigana.jsx'
import { KotenText } from './KotenFurigana.jsx'
import { MeaningText } from './MeaningText.jsx'
import { ReadingSentenceDetail } from './ReadingSentenceDetail.jsx'
import { Button, cx } from './ui.jsx'
import { SpeakerWave } from './Icons.jsx'
import { analyzeLiteratureSentence } from '../lib/literature-sentence-analysis.js'
import { kanbunReadingOrder, parseKanbunMarkedText } from '../lib/kanbun-marks.js'

// 置き字：書き下し文では読まない字。読む順の表示では「読まない」と添える。
const PLACEHOLDER_CHARACTERS = new Set(['而', '於', '于', '矣', '焉', '兮'])

function SectionTitle({ children }) {
  return <h3 className="text-[11px] font-extrabold tracking-wide text-ink/55">{children}</h3>
}

// 区切り（朗読で間を置くまとまり）ごとの原文と現代語訳。
function SegmentList({ sentence, kanbun }) {
  return (
    <section className="rounded-2xl border border-teal-100 bg-white p-3" data-literature-segments={sentence.segments.length}>
      <SectionTitle>区切りごとの現代語訳</SectionTitle>
      <ol className="mt-2 space-y-2">
        {sentence.segments.map((segment, index) => (
          <li key={`${segment.sceneIndex}:${segment.segmentIndex}`} className="border-l-2 border-teal-200 pl-2.5">
            <p className="font-serif text-base font-bold leading-relaxed text-ink">
              <span className="mr-1.5 font-sans text-[10px] font-black text-teal-700">{index + 1}</span>
              {kanbun ? <KanbunText>{segment.speech}</KanbunText> : <KotenText>{segment.original}</KotenText>}
            </p>
            <p className="mt-0.5 text-sm font-bold leading-relaxed text-amber-900">{segment.translation}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

// 語句の意味。古典単語・漢文のカードがある語は、そのカードへ行ける。
function WordNotes({ words, onOpen, cardLabel }) {
  if (!words?.length) return null
  return (
    <section className="rounded-2xl border border-violet-100 bg-violet-50/50 p-3" data-literature-word-notes={words.length}>
      <SectionTitle>語句の意味</SectionTitle>
      <ul className="mt-2 space-y-2">
        {words.map((word) => (
          <li key={word.term} className="rounded-xl bg-white px-3 py-2">
            <div className="flex items-start justify-between gap-2">
              <p className="min-w-0 font-bold leading-relaxed">
                <span className="font-serif text-base text-ink">{word.term}</span>
                {word.reading && <span className="ml-1.5 text-xs text-ink/50">（{word.reading}）</span>}
              </p>
              {word.id && (
                <button
                  type="button"
                  onClick={() => onOpen(word)}
                  className="shrink-0 rounded-full bg-violet-100 px-2.5 py-1 text-[11px] font-extrabold text-violet-800"
                  data-literature-word-card={word.id}
                >
                  {cardLabel}
                </button>
              )}
            </div>
            <p className="mt-0.5 text-sm font-bold leading-relaxed text-ink/75">{word.meaning}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

// 文法（古文）・句法（漢文）の説明。カードがある項目は、そのカードへ行ける。
function GrammarNotes({ title, items, onOpen, cardLabel }) {
  if (!items?.length) return null
  return (
    <section className="rounded-2xl border border-sky-100 bg-sky-50/50 p-3" data-literature-grammar-notes={items.length}>
      <SectionTitle>{title}</SectionTitle>
      <ul className="mt-2 space-y-2">
        {items.map((item) => (
          <li key={item.term} className="rounded-xl bg-white px-3 py-2">
            <div className="flex items-start justify-between gap-2">
              <p className="min-w-0 font-serif text-base font-bold leading-relaxed text-sky-900">{item.term}</p>
              {item.id && (
                <button
                  type="button"
                  onClick={() => onOpen(item)}
                  className="shrink-0 rounded-full bg-sky-100 px-2.5 py-1 text-[11px] font-extrabold text-sky-800"
                  data-literature-grammar-card={item.id}
                >
                  {cardLabel}
                </button>
              )}
            </div>
            <p className="mt-0.5 text-sm font-bold leading-relaxed text-ink/75">{item.text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

function TranslationBox({ sentence, label }) {
  return (
    <div className="rounded-2xl bg-hint-soft/70 p-4" data-literature-sentence-translation>
      <div className="mb-1 text-[11px] font-extrabold tracking-wide text-amber-600">{label}</div>
      <p className="font-bold leading-relaxed text-amber-950">{sentence.ja}</p>
    </div>
  )
}

function PointBox({ point }) {
  if (!point) return null
  return (
    <div className="rounded-2xl bg-emerald-50 p-3" data-literature-sentence-point>
      <p className="text-[11px] font-extrabold text-emerald-700">読みのポイント</p>
      <p className="mt-1 text-sm font-bold leading-relaxed text-emerald-950/80">{point}</p>
    </div>
  )
}

function ClassicalSentenceDetail({ sentence, onOpenWord, onOpenGrammar }) {
  const entry = sentence.entry
  return (
    <div className="space-y-4" data-literature-classical-detail={sentence.number}>
      <div className="rounded-2xl bg-amber-50 p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-[11px] font-extrabold tracking-wide text-amber-700">原文</span>
          <SpeakButton text={sentence.speech} lang="ja-JP" size="sm" />
        </div>
        <p className="font-serif text-xl font-bold leading-[2.1] text-ink"><KotenText>{sentence.text}</KotenText></p>
        <p className="mt-2 border-t border-amber-100 pt-2 text-sm font-bold leading-relaxed text-ink/55">
          <span className="mr-1 text-[10px] font-black text-amber-700">読み</span>
          {sentence.speech}
        </p>
      </div>
      <SegmentList sentence={sentence} kanbun={false} />
      <WordNotes words={entry.words} onOpen={onOpenWord} cardLabel="古典単語" />
      <GrammarNotes title="文法" items={entry.grammar} onOpen={onOpenGrammar} cardLabel="文法カード" />
      <PointBox point={entry.point} />
      <TranslationBox sentence={sentence} label="現代語訳" />
    </div>
  )
}

// 返り点どおりに読む順。送り仮名つきで並べ、置き字には「読まない」と添える。
function ReadingOrder({ marked }) {
  const parsed = parseKanbunMarkedText(marked)
  const order = kanbunReadingOrder(parsed)
  if (order.errors.length || !order.order.length) return null
  return (
    <section className="rounded-2xl border border-rose-100 bg-white p-3" data-literature-reading-order={order.order.length}>
      <SectionTitle>返り点どおりに読む順</SectionTitle>
      <ol className="mt-2 flex flex-wrap items-center gap-1.5" lang="ja">
        {order.order.map((index, position) => {
          const unit = parsed.units[index]
          const placeholder = PLACEHOLDER_CHARACTERS.has(unit.character) && !unit.okurigana
          return (
            <li key={`${index}-${position}`} className="flex items-center gap-1.5">
              {position > 0 && <span aria-hidden="true" className="text-xs font-black text-rose-300">›</span>}
              <span
                className={cx(
                  'rounded-lg px-1.5 py-0.5 font-serif text-base font-bold',
                  placeholder ? 'bg-slate-100 text-ink/40' : 'bg-rose-50 text-ink',
                )}
              >
                {unit.character}
                {unit.okurigana && <span className="text-xs text-ink/60">{unit.okurigana}</span>}
                {placeholder && <span className="ml-0.5 font-sans text-[9px] text-ink/45">読まない</span>}
              </span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

function KanbunSentenceDetail({ sentence, onOpenWord, onOpenGrammar }) {
  const entry = sentence.entry
  return (
    <div className="space-y-4" data-literature-kanbun-detail={sentence.number}>
      <div className="rounded-2xl bg-rose-50/60 p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-[11px] font-extrabold tracking-wide text-rose-700">訓読文（返り点・送り仮名つき）</span>
          <SpeakButton text={sentence.speech} lang="ja-JP" size="sm" />
        </div>
        <KanbunMarkedText marked={sentence.marked} align="start" />
      </div>
      <div className="rounded-2xl bg-white p-3 ring-1 ring-rose-100">
        <SectionTitle>書き下し文</SectionTitle>
        <p className="mt-1 font-serif text-lg font-bold leading-[2] text-ink"><KanbunText>{entry.kakikudashi}</KanbunText></p>
        <p className="mt-1 text-sm font-bold leading-relaxed text-ink/55">
          <span className="mr-1 text-[10px] font-black text-rose-700">読み</span>
          {sentence.speech}
        </p>
      </div>
      <ReadingOrder marked={sentence.marked} />
      <SegmentList sentence={sentence} kanbun />
      <WordNotes words={entry.words} onOpen={onOpenWord} cardLabel="漢文カード" />
      <GrammarNotes title="句法" items={entry.grammar} onOpen={onOpenGrammar} cardLabel="句法カード" />
      <PointBox point={entry.point} />
      <TranslationBox sentence={sentence} label="現代語訳" />
    </div>
  )
}

// 本文の文を押したときに開く、一文の解説。英語は長文読解と同じ構文解説、古文・漢文は語句・文法・訳。
export function LiteratureSentenceSheet({
  work,
  sentences,
  index,
  onClose,
  onMove,
  onPlayFrom,
  playEnabled,
  activeWord,
  onWordTap,
  resolveWord,
  scrollAreaRef,
}) {
  const navigate = useStore((state) => state.navigate)
  const sentence = index != null ? sentences[index] : null
  const english = work.kind === 'english'
  const analysis = english && sentence ? analyzeLiteratureSentence(sentence) : null
  const openWord = (word) => {
    onClose()
    if (work.kind === 'classical') navigate('kotenWordDetail', { id: word.id })
    else navigate('kanbunStudy', { domain: 'vocab', ids: [word.id], title: `${work.titleJa}・${word.term}` })
  }
  const openGrammar = (item) => {
    onClose()
    if (work.kind === 'classical') navigate('kotenGrammarStudy', { ids: [item.id], title: `${work.titleJa}・${item.term}` })
    else navigate('kanbunStudy', { domain: 'grammar', ids: [item.id], title: `${work.titleJa}・${item.term}` })
  }
  const partLabel = sentence && sentence.partCount > 1
    ? `（長い1文を${sentence.partCount}つに分けた${sentence.partIndex + 1}つ目）`
    : ''
  return (
    <Sheet
      open={sentence != null}
      onClose={onClose}
      title={english ? '一文の構文解説' : '一文の解説'}
      maxH="88vh"
      scrollAreaRef={scrollAreaRef}
      footer={sentence ? (
        <nav className="flex items-center justify-between gap-2" aria-label="文の移動" data-literature-sentence-navigation>
          <Button variant="secondary" size="sm" className="min-h-12" disabled={index === 0} onClick={() => onMove(index - 1)}>
            ← 前の文
          </Button>
          <span className="text-xs font-bold text-ink/40" aria-live="polite">{index + 1}/{sentences.length}</span>
          <Button variant="secondary" size="sm" className="min-h-12" disabled={index >= sentences.length - 1} onClick={() => onMove(index + 1)}>
            次の文 →
          </Button>
        </nav>
      ) : null}
    >
      {sentence && (
        <div className="space-y-4" data-literature-sentence-sheet={sentence.number}>
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-extrabold text-ink/45">
              {`第${sentence.paragraphIndex + 1}段落・${sentence.number}番目の文${partLabel}`}
            </p>
            <Button size="sm" variant="soft" disabled={!playEnabled} onClick={() => onPlayFrom(index)}>
              <SpeakerWave size={15} /> ここから交互再生
            </Button>
          </div>
          {english ? (
            <ReadingSentenceDetail
              sentence={sentence}
              sentenceAnalysis={analysis}
              activeWord={activeWord}
              onWordTap={onWordTap}
              onNavigateAway={onClose}
              resolveWord={resolveWord}
            />
          ) : work.kind === 'kanbun' ? (
            <KanbunSentenceDetail sentence={sentence} onOpenWord={openWord} onOpenGrammar={openGrammar} />
          ) : (
            <ClassicalSentenceDetail sentence={sentence} onOpenWord={openWord} onOpenGrammar={openGrammar} />
          )}
          {english && sentence.partCount > 1 && (
            <p className="text-xs font-bold leading-relaxed text-ink/50" data-literature-sentence-part>
              <MeaningText>{'この文はとても長いので、セミコロン・コロンで区切られた独立した節ごとに分けて解説しています。前の文・次の文で、同じ文の続きへ移れます。'}</MeaningText>
            </p>
          )}
        </div>
      )}
    </Sheet>
  )
}
