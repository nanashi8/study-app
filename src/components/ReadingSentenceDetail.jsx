import { useStore } from '../store/useStore.js'
import { resolvePassageWord } from '../data/passage-gloss.js'
import { readingRulesForSentence } from '../data/reading-rules.js'
import { translationRoleMeta } from '../lib/translation-roles.js'
import {
  readingBlockExplanationTexts,
  readingPhraseExplanationTexts,
} from '../lib/explanationDedup.js'
import { SpeakButton } from './SpeakButton.jsx'
import { StructureDiagram } from './StructureDiagram.js'
import { ReadingRoleSentence } from './ReadingRoleSentence.js'
import { ReadingRuleCard } from './ReadingRuleCard.jsx'
import { Bookmark, BookmarkFilled, BookOpen, Lightbulb, Link } from './Icons.jsx'
import { cx } from './ui.jsx'

const ROLE_STYLE = {
  S: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  V: 'border-rose-200 bg-rose-50 text-rose-800',
  O: 'border-sky-200 bg-sky-50 text-sky-800',
  O1: 'border-sky-200 bg-sky-50 text-sky-800',
  O2: 'border-cyan-200 bg-cyan-50 text-cyan-800',
  C: 'border-amber-200 bg-amber-50 text-amber-800',
  M: 'border-violet-200 bg-violet-50 text-violet-800',
  LINK: 'border-slate-200 bg-slate-50 text-slate-700',
  並列: 'border-slate-200 bg-slate-50 text-slate-700',
}

function SvocFlow({ parts }) {
  if (!parts?.length) return null
  return (
    <ol className="space-y-1.5" aria-label="SVOCMを英語順に読む型">
      {parts.map((part, index) => {
        const meta = translationRoleMeta(part.role)
        return (
          <li
            key={`${part.role}-${index}`}
            className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-start gap-2 border border-ink/5 bg-white px-2 py-2"
          >
            <span className={cx(
              'flex h-7 items-center justify-center border text-[11px] font-black',
              ROLE_STYLE[part.role] ?? 'border-brand-200 bg-brand-50 text-brand-800',
            )}>
              {meta.code}
            </span>
            <div className="min-w-0">
              <p lang="en" className="break-words text-xs font-extrabold leading-relaxed text-ink">
                {part.text}
              </p>
              <p className="mt-0.5 text-[10px] font-bold leading-relaxed text-ink/50">
                {meta.label}：{meta.question} → {meta.japaneseShape}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function blockFlowParts(block) {
  return block?.phrasePairs.flatMap((pair) =>
    pair.roleParts.map((part) => ({ role: part.role, text: part.en }))) ?? []
}

function sentenceFlowParts(analysis) {
  return analysis?.phraseSequence.flatMap((pair) =>
    pair.roleParts.map((part) => ({ role: part.role, text: part.en }))) ?? []
}

function flowPattern(parts) {
  return parts.map((part) => translationRoleMeta(part.role).code).join(' → ')
}

// 一文をタップしたときの構文詳細。受験長文と語彙強化ロングリーディングで共通。
export function ReadingSentenceDetail({
  sentence,
  sentenceAnalysis,
  activeWord,
  onWordTap,
  onNavigateAway,
}) {
  const navigate = useStore((s) => s.navigate)
  const myList = useStore((s) => s.myList)
  const toggleMyList = useStore((s) => s.toggleMyList)
  if (!sentence || !sentenceAnalysis) return null
  const visiblePhraseExplanations = readingPhraseExplanationTexts(sentenceAnalysis)
  const visibleBlockExplanations = readingBlockExplanationTexts(
    sentenceAnalysis,
    visiblePhraseExplanations,
  )
  const visibleSentenceRules = readingRulesForSentence(sentence)
  const closeSentence = () => onNavigateAway?.()
  const tapToken = (token) => onWordTap?.(token)
  return (
          <div className="space-y-4">
            {/* 構文ラベルを原文へ直接対応させた英文（単語タップ可） */}
            <div className="rounded-2xl bg-brand-50 p-4" data-reading-role-card="direct-labels">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-extrabold tracking-wide text-brand-500">
                  文の要素
                </span>
                <SpeakButton text={sentence.en} size="sm" />
              </div>
              <ReadingRoleSentence
                sentence={sentence.en}
                parts={sentenceFlowParts(sentenceAnalysis)}
                activeWord={activeWord?.word}
                isKnownWord={(token) => Boolean(
                  resolvePassageWord(token.key, sentence.gloss)?.id,
                )}
                onWordClick={tapToken}
              />
              <p className="mt-2 text-[10px] font-bold leading-relaxed text-ink/55">
                下線の下にあるS・V・O・C・Mが、その役割の範囲です。青い太字は重要語で、どの単語もタップできます。
              </p>
            </div>

            {/* タップした単語 */}
            {activeWord && (
              <div className="animate-pop-in rounded-2xl bg-white p-3 ring-2 ring-brand-200">
                <div className="flex items-center gap-3">
                  <SpeakButton text={activeWord.word} size="sm" />
                  <div className="flex-1">
                    <div className="font-display text-lg font-extrabold text-ink">{activeWord.word}</div>
                    <div className="text-sm font-bold text-ink/60">
                      {activeWord.ja ?? '（発音を確認できます）'}
                    </div>
                  </div>
                  {activeWord.id && (
                    <button
                      onClick={() => navigate('wordDetail', { id: activeWord.id })}
                      className="flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1.5 text-xs font-extrabold text-brand-700"
                    >
                      <Link size={14} /> 詳しく
                    </button>
                  )}
                </div>
                {/* マイ単語に追加（語彙データにある語のみ） */}
                {activeWord.id && (
                  <button
                    onClick={() => toggleMyList(activeWord.id)}
                    className={cx(
                      'mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-extrabold transition-colors',
                      myList.includes(activeWord.id)
                        ? 'bg-hint-soft text-amber-700'
                        : 'bg-brand-500 text-white active:bg-brand-600',
                    )}
                  >
                    {myList.includes(activeWord.id) ? (
                      <>
                        <BookmarkFilled size={16} /> マイ単語に追加済み（タップで解除）
                      </>
                    ) : (
                      <>
                        <Bookmark size={16} /> マイ単語に追加
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* 節・句の区分と文全体の流れ */}
            <section className="border-y border-brand-100 bg-white py-3">
              <div className="mb-2 flex items-center gap-1.5 text-brand-600">
                <Lightbulb size={16} />
                <span className="text-[11px] font-extrabold uppercase tracking-wide">長文読解</span>
              </div>
              <div className="mb-2 flex flex-wrap gap-2 text-[11px] font-bold text-ink/55">
                <span><b className="text-sky-700">( )</b> は節（S+Vを含む）</span>
                <span>
                  <b className="text-violet-700">&lt; &gt;</b> は句
                  （句自体にS+Vなし・中に節を含む場合あり）
                </span>
              </div>
              <p
                className="text-base font-bold leading-loose text-ink"
                data-reading-structure-diagram={sentenceAnalysis.marked}
              >
                <StructureDiagram tokens={sentenceAnalysis.structureTokens} />
              </p>
              <div className="mt-3">
                <SvocFlow parts={sentenceFlowParts(sentenceAnalysis)} />
              </div>
            </section>

            <section
              className="rounded-2xl border border-sky-100 bg-sky-50/50 p-3"
              data-reading-rules-for-sentence={sentence.reviewId}
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="text-[11px] font-extrabold uppercase tracking-wide text-sky-600">
                    読解ルール
                  </div>
                  <p className="mt-0.5 text-xs font-bold text-ink/50">
                    文中の合図から選んだ{visibleSentenceRules.length}件
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    closeSentence()
                    navigate('readingRules')
                  }}
                  className="shrink-0 rounded-full bg-white px-2.5 py-1.5 text-[11px] font-extrabold text-sky-700"
                >
                  全30件
                </button>
              </div>
              <div className="mt-2 space-y-2">
                {visibleSentenceRules.map((rule) => (
                  <ReadingRuleCard key={rule.id} rule={rule} compact />
                ))}
              </div>
            </section>

            {/* 文法ブロックから独立した、全長文共通の意味フレーズ列 */}
            <section
              className="border-y border-emerald-100 bg-emerald-50/40 py-3"
              data-reading-phrase-method={sentenceAnalysis.phraseMethod}
            >
              <div className="space-y-2" aria-label="英文と対応する日本語">
                {sentenceAnalysis.meaningPhraseSequence.map((phraseItem, phraseIndex) => {
                  return (
                    <article
                      key={phraseItem.id}
                      className="border border-emerald-100 bg-white p-3"
                      data-reading-phrase-status={phraseItem.status}
                      data-reading-review-state={phraseItem.reviewState}
                    >
                      <div className="min-w-0">
                        <div className="mb-1 flex flex-wrap items-center gap-1 text-[10px] font-extrabold">
                          <span className="border border-emerald-100 bg-emerald-50 px-1.5 py-0.5 text-emerald-800">
                            {phraseIndex + 1}. {phraseItem.pattern || phraseItem.label || '意味フレーズ'}
                          </span>
                        </div>
                        <p lang="en" className="font-bold leading-relaxed text-ink">
                          {phraseItem.displayEn}
                        </p>
                        {phraseItem.structureEn && (
                          <p className="mt-0.5 text-[10px] font-bold text-ink/45">
                            音声では原文どおり「{phraseItem.spokenEn}」と発音
                          </p>
                        )}
                        <p className="mt-1 text-sm font-bold leading-relaxed text-brand-700">
                          {phraseItem.ja}
                        </p>
                      </div>
                      {visiblePhraseExplanations[phraseIndex] && (
                        <p className="mt-2 border-l-2 border-sky-300 bg-sky-50/70 px-2 py-1.5 text-xs font-bold leading-relaxed text-ink/65">
                          フレーズ内の文法：{visiblePhraseExplanations[phraseIndex]}
                        </p>
                      )}
                    </article>
                  )
                })}
              </div>
            </section>

            {/* 上段の意味フレーズを再掲せず、節・句ごとの固有情報だけを示す。 */}
            <section data-reading-grammar-explanations>
              <div className="mb-2 flex items-center gap-1.5 text-brand-600">
                <BookOpen size={16} />
                <span className="text-[11px] font-extrabold uppercase tracking-wide">
                  文法解説
                </span>
              </div>
              <div className="space-y-2">
                {sentenceAnalysis.blocks.map((block, index) => {
                  const readingExplanation = visibleBlockExplanations[index * 2]
                  const grammarExplanation = visibleBlockExplanations[index * 2 + 1]
                  return (
                    <article key={block.id} className="border border-brand-100 bg-white p-3">
                      <div className="flex flex-wrap items-center gap-1 text-[10px] font-extrabold">
                        <span className="bg-brand-50 px-1.5 py-0.5 text-brand-700">
                          {index + 1}. {block.label}
                        </span>
                        <span className={cx(
                          'border px-1.5 py-0.5',
                          ROLE_STYLE[block.role] ?? 'border-brand-200 bg-brand-50 text-brand-800',
                        )}>
                          {block.role ? `文中の働き ${block.role}` : '主節'}
                        </span>
                        {blockFlowParts(block).length > 0 && (
                          <span className="bg-ink/5 px-1.5 py-0.5 text-ink/60">
                            まとまりの順：{flowPattern(blockFlowParts(block))}
                          </span>
                        )}
                      </div>
                      <p lang="en" className="mt-1 text-xs font-bold leading-relaxed text-ink/55">
                        {block.displayEn}
                      </p>
                      {blockFlowParts(block).length > 1 && (
                        <div className="mt-2">
                          <SvocFlow parts={blockFlowParts(block)} />
                        </div>
                      )}
                      {readingExplanation && (
                        <p className="mt-2 border-l-2 border-sky-300 bg-sky-50/70 px-2 py-1.5 text-xs font-bold leading-relaxed text-sky-900/75">
                          読み進め方：{readingExplanation}
                        </p>
                      )}
                      {grammarExplanation && (
                        <p className="mt-2 border-l-2 border-amber-300 bg-amber-50/70 px-2 py-1.5 text-xs font-bold leading-relaxed text-ink/65">
                          文法の決まり：{grammarExplanation}
                        </p>
                      )}
                    </article>
                  )
                })}
              </div>
            </section>

            {/* 自然な和訳 */}
            <div className="rounded-2xl bg-hint-soft/70 p-4">
              <div className="mb-1 text-[11px] font-extrabold uppercase tracking-wide text-amber-500">きれいな日本語訳</div>
              <p className="font-bold leading-relaxed text-amber-900">{sentence.ja}</p>
            </div>
    </div>
  )
}
