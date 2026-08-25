// 単語まわりの再利用パーツ：品詞バッジと、監査済み語源カードへの導線。
import {
  etymologyCardsForWord,
  getRoot,
  getWord,
} from '../data/vocab.js'
import { ArrowRight, Check } from './Icons.jsx'
import { cx } from './ui.jsx'

const POS_COLORS = {
  動: '#6366f1', 名: '#0ea5e9', 形: '#f59e0b', 副: '#10b981',
  前: '#8b5cf6', 接: '#ec4899', 代: '#14b8a6',
}

export function PosBadge({ pos, className = '' }) {
  const color = POS_COLORS[pos] ?? '#6366f1'
  return (
    <span
      className={cx('inline-flex h-6 min-w-6 items-center justify-center rounded-md px-1.5 text-xs font-extrabold', className)}
      style={{ backgroundColor: `${color}1f`, color }}
    >
      {pos}
    </span>
  )
}

const cardAction = (card, onPack, onRoot) => {
  if (onPack) return () => onPack(card.id, { mode: 'root', rootId: card.rootId })
  if (onRoot) return () => onRoot(card.rootId)
  return undefined
}

function ReviewedEtymologyCard({ card, onPack, onRoot, compact = false }) {
  const action = cardAction(card, onPack, onRoot)
  const body = (
    <>
      <span className={cx(
        'flex shrink-0 items-center justify-center rounded-xl bg-white shadow-sm',
        compact ? 'h-9 w-9 text-lg' : 'h-11 w-11 text-xl',
      )} aria-hidden="true">
        {card.emoji}
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-display text-sm font-extrabold text-violet-800">{card.rootForm}</span>
          <span className="text-xs font-extrabold text-violet-700">＝ {card.rootMeaning}</span>
        </span>
        {!compact && (
          <span className="mt-0.5 block text-xs font-bold leading-relaxed text-slate-500">
            {card.rootOrigin}
          </span>
        )}
        <span className="mt-0.5 block text-xs font-extrabold text-emerald-700">
          <Check size={12} className="mr-1 inline" />確認済み・紐づく{card.coverageIds.length}語
        </span>
      </span>
      {action && <ArrowRight size={17} className="shrink-0 text-violet-400" />}
    </>
  )

  return action ? (
    <button
      type="button"
      onClick={action}
      className="flex min-h-14 w-full items-center gap-2.5 rounded-2xl bg-violet-50 p-3 ring-1 ring-violet-100 active:bg-violet-100"
    >
      {body}
    </button>
  ) : (
    <div className="flex min-h-14 w-full items-center gap-2.5 rounded-2xl bg-violet-50 p-3 ring-1 ring-violet-100">
      {body}
    </div>
  )
}

/** 監査済みカードだけを語根の要約として表示する。 */
export function ReferenceRootSummary({ word, onRoot }) {
  const cards = etymologyCardsForWord(word)
  if (!cards.length) return null

  return (
    <div data-reference-root-summary className="space-y-2">
      {cards.map((card) => (
        <ReviewedEtymologyCard key={card.id} card={card} onRoot={onRoot} compact />
      ))}
    </div>
  )
}

/**
 * 単語画面の語源ブロック。
 * 手動監査台帳を通ったカード以外は表示しない。単語レコード内の自由記述や
 * 自動綴り判定は、公開可否の根拠にも画面表示にも使わない。
 */
export function EtymologyBlock({ word, onRoot, onPack }) {
  const cards = etymologyCardsForWord(word)
  if (!cards.length) return null

  return (
    <div className="space-y-2.5" data-reviewed-etymology-cards>
      <p className="px-1 text-xs font-bold leading-relaxed text-slate-500">
        同じ由来をたどれる語根のうち、出典と単語のつながりを確認したカードだけを表示しています。
      </p>
      {cards.map((card) => (
        <ReviewedEtymologyCard
          key={card.id}
          card={card}
          onPack={onPack}
          onRoot={onRoot}
        />
      ))}
    </div>
  )
}

/** 語源でつながる単語。監査済みカードに明記した単語だけを表示する。 */
export function RelatedWords({ word, onPick, onRoot }) {
  const groups = etymologyCardsForWord(word)
    .map((card) => ({
      card,
      words: card.coverageIds
        .filter((wordId) => wordId !== word.id)
        .map(getWord)
        .filter(Boolean),
    }))
    .filter((group) => group.words.length)

  if (!groups.length) return null

  return (
    <div className="space-y-4" data-reviewed-related-words>
      {groups.map(({ card, words }) => {
        const root = getRoot(card.rootId)
        const visibleWords = words.slice(0, 12)
        return (
          <section key={card.id}>
            <button
              type="button"
              disabled={!onRoot}
              onClick={() => onRoot?.(card.rootId)}
              className="mb-1.5 flex min-h-11 w-full items-center gap-1.5 rounded-xl px-2 text-left active:bg-violet-50 disabled:cursor-default"
              aria-label={`${card.rootForm}（${card.rootMeaning}）の確認済み語源カードを開く`}
            >
              <span className="text-base" aria-hidden="true">{root?.emoji ?? card.emoji}</span>
              <span className="font-display text-sm font-extrabold text-violet-700">{card.rootForm}</span>
              <span className="min-w-0 flex-1 text-xs font-bold text-ink/45">＝ {card.rootMeaning}</span>
              {onRoot && <ArrowRight size={16} className="shrink-0 text-violet-400" />}
            </button>
            <div className="grid gap-1.5 sm:grid-cols-2">
              {visibleWords.map((relatedWord) => (
                <button
                  key={relatedWord.id}
                  type="button"
                  onClick={() => onPick?.(relatedWord.id)}
                  className="flex min-h-12 w-full items-center gap-2 rounded-2xl bg-white p-2.5 text-left shadow-sm active:bg-violet-50"
                >
                  <PosBadge pos={relatedWord.pos} />
                  <span className="min-w-0 flex-1">
                    <span className="block font-display font-extrabold text-ink">{relatedWord.word}</span>
                    <span className="block truncate text-xs font-bold text-ink/55">
                      {relatedWord.meanings?.[0] ?? relatedWord.meaning}
                    </span>
                  </span>
                  <ArrowRight size={17} className="shrink-0 text-violet-400" />
                </button>
              ))}
            </div>
            {words.length > visibleWords.length && (
              <button
                type="button"
                disabled={!onRoot}
                onClick={() => onRoot?.(card.rootId)}
                className="mt-2 min-h-10 w-full rounded-xl bg-violet-50 px-3 text-xs font-extrabold text-violet-700 active:bg-violet-100 disabled:cursor-default"
              >
                残り{words.length - visibleWords.length}語をカードで見る
              </button>
            )}
          </section>
        )
      })}
    </div>
  )
}
