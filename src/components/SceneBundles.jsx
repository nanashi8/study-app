import { useMemo, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { getLevel } from '../data/levels.js'
import { getPassage } from '../data/passages.js'
import { summarizeSrsItems } from '../lib/contentProgress.js'
import { sceneBundleExamples } from '../lib/sceneBundles.js'
import { LearningStatusBars } from './LearningStatusBars.jsx'
import { MeaningText } from './MeaningText.jsx'
import { Sheet } from './Sheet.jsx'
import { SpeakButton } from './SpeakButton.jsx'
import { WordListSheet } from './WordListSheet.jsx'
import { Button, cx } from './ui.jsx'
import { ArrowRight, Bookmark, Cards, ChevronRight } from './Icons.jsx'

/** 1つの長文の場面の束を、番号・名前・語の並び・暗記した数の1行ずつで並べる。 */
export function SceneBundleRows({ bundles, srs, onOpen, className = '' }) {
  return (
    <ol className={cx('divide-y divide-slate-100', className)}>
      {bundles.map((bundle) => {
        const total = bundle.wordIds.length
        const learned = summarizeSrsItems(bundle.wordIds, srs).learning.learned
        return (
          <li key={bundle.id}>
            <button
              type="button"
              onClick={() => onOpen(bundle)}
              className="flex min-h-14 w-full items-center gap-3 px-4 py-2.5 text-left transition-colors active:bg-brand-50"
              aria-label={`場面の束${bundle.number}「${bundle.name}」。${total}語のうち${learned}語を暗記済み`}
              data-scene-bundle={bundle.id}
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-100 text-xs font-black text-brand-700">
                {bundle.number}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-extrabold leading-snug text-ink">{bundle.name}</span>
                <span className="block truncate text-[11px] font-bold text-ink/45">
                  {bundle.headwords.join(' · ')}
                </span>
              </span>
              <span className="shrink-0 text-[11px] font-extrabold tabular-nums text-ink/45">
                {learned}/{total}語
              </span>
              <ChevronRight size={16} className="shrink-0 text-ink/25" />
            </button>
          </li>
        )
      })}
    </ol>
  )
}

/** 本文の一文の中で、束の語が出ている形を太字にする。 */
function SentenceWithWord({ text, surface }) {
  if (!surface) return text
  const match = new RegExp(`\\b${surface}\\b`).exec(text)
  if (!match) return text
  return (
    <>
      {text.slice(0, match.index)}
      <strong className="rounded bg-amber-100 px-0.5 font-extrabold text-ink">{surface}</strong>
      {text.slice(match.index + surface.length)}
    </>
  )
}

/**
 * 場面の束の中身。暗記・テストへ進むボタン、束の語と本文での出方、単語帳へ入れるボタン、
 * 下端に「この長文を読む」を置く。bundle が null のあいだは何も描かない。
 */
export function SceneBundleSheet({ bundle, onClose, onStudy, onQuiz, onRead }) {
  const srs = useStore((state) => state.srs)
  const navigate = useStore((state) => state.navigate)
  const [bookSheetOpen, setBookSheetOpen] = useState(false)
  const examples = useMemo(() => (bundle ? sceneBundleExamples(bundle) : []), [bundle])
  const passage = bundle ? getPassage(bundle.passageId) : null
  if (!bundle || !passage) return null

  const level = getLevel(passage.level)
  const total = bundle.wordIds.length
  const status = summarizeSrsItems(bundle.wordIds, srs)

  return (
    <>
      <Sheet
        open
        onClose={onClose}
        title={bundle.name}
        footer={(
          <Button full size="lg" onClick={onRead} data-scene-bundle-read>
            この長文を読む <ArrowRight size={18} />
          </Button>
        )}
      >
        <div className="space-y-4 pb-2" data-scene-bundle-sheet={bundle.id}>
          <p className="text-xs font-bold leading-relaxed text-ink/55">
            「{passage.titleJa}」（{level.label}）の本文に出る{total}語です。暗記 → テスト → 本文の順に進めます。
          </p>
          <LearningStatusBars progress={status} compact units={{ learning: '語', quiz: '問' }} />
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={onStudy} data-scene-bundle-study aria-label={`「${bundle.name}」の${total}語を暗記`}>
              <Cards size={17} /> 暗記
            </Button>
            <Button variant="secondary" onClick={onQuiz} data-scene-bundle-quiz aria-label={`「${bundle.name}」の${total}語をテスト`}>
              テスト
            </Button>
          </div>

          <section aria-label="本文での出方">
            <h4 className="text-xs font-extrabold text-ink/45">本文ではこう出る</h4>
            <ol className="mt-2 space-y-2" data-speech-group>
              {examples.map(({ word, sentence, surface }) => (
                <li key={word.id} className="rounded-2xl bg-white p-3 ring-1 ring-brand-100" data-scene-bundle-word={word.id}>
                  <div className="flex items-center gap-2">
                    <SpeakButton text={word.word} size="sm" />
                    <button
                      type="button"
                      onClick={() => navigate('wordDetail', { id: word.id })}
                      className="min-w-0 flex-1 text-left"
                      aria-label={`${word.word}の詳細を見る`}
                    >
                      <span className="font-display text-base font-extrabold text-ink">{word.word}</span>
                      <span className="ml-2 text-xs font-bold text-ink/55">
                        <MeaningText>{word.meaning}</MeaningText>
                      </span>
                    </button>
                  </div>
                  {sentence && (
                    <p className="mt-1.5 text-sm font-bold leading-relaxed text-ink/70">
                      <SentenceWithWord text={sentence.en} surface={surface} />
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </section>

          <Button
            full
            variant="soft"
            onClick={() => setBookSheetOpen(true)}
            aria-haspopup="dialog"
            data-scene-bundle-word-book
          >
            <Bookmark size={17} /> この束の語を単語帳に入れる
          </Button>
        </div>
      </Sheet>
      <WordListSheet
        open={bookSheetOpen}
        onClose={() => setBookSheetOpen(false)}
        wordIds={bundle.wordIds}
        wordLabel={`場面の束「${bundle.name}」の${total}語`}
      />
    </>
  )
}
