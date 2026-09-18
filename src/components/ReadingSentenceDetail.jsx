import { useEffect, useState } from 'react'
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
import { WordListSheet, useWordInAnyBook } from './WordListSheet.jsx'
import { Bookmark, BookmarkFilled, BookOpen, Lightbulb, Link } from './Icons.jsx'
import { cx } from './ui.jsx'
import { MeaningText } from './MeaningText.jsx'
import {
  STRUCTURE_DISPLAY_ROLE,
  structurePatternName,
} from '../lib/reading-sentence-structure.js'

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
                {meta.label}：{meta.question}
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

function structureDisplayParts(parts = []) {
  return parts.map((part) => ({
    role: STRUCTURE_DISPLAY_ROLE[part.role] ?? part.role,
    text: part.text,
    connector: part.connector ?? '',
  }))
}

function structurePatternsText(patterns = []) {
  const names = patterns.map(structurePatternName).filter(Boolean)
  if (names.length <= 1) return names[0] ?? ''
  return names.map((name, index) => `${index + 1}つ目の述語 ${name}`).join('／')
}

// 節・句の中の要素。入れ子の深さだけ字下げし、主節の要素と同じ段に混ぜない。
function StructureUnitRows({ units, activeWord, isKnownWord, onWordClick }) {
  if (!units.length) return null
  return (
    <ol className="mt-3 space-y-2 border-t border-brand-100 pt-3" aria-label="節・句の中の要素">
      {units.map((unit) => (
        <li
          key={unit.id}
          className="border-l-2 border-sky-200 bg-white/70 py-1.5 pl-2 pr-1"
          style={{ marginLeft: `${unit.depth * 0.75}rem` }}
          data-reading-structure-unit={unit.base}
        >
          <p className="text-[11px] font-extrabold text-sky-800">{unit.label}</p>
          <p className="text-[10px] font-bold leading-relaxed text-ink/55">{unit.functionText}</p>
          <div className="mt-1">
            {unit.parts.length ? (
              <ReadingRoleSentence
                sentence={unit.marked}
                parts={structureDisplayParts(unit.parts)}
                parallel={unit.parallel ?? []}
                activeWord={activeWord}
                isKnownWord={isKnownWord}
                onWordClick={onWordClick}
                inner
              />
            ) : (
              <p lang="en" className="text-sm font-bold text-ink">{unit.marked}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  )
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
  const [bookSheetOpen, setBookSheetOpen] = useState(false)
  const inWordBook = useWordInAnyBook(activeWord?.id)
  // 別の語を開いたら、単語帳を選ぶ窓は閉じた状態から始める。
  useEffect(() => setBookSheetOpen(false), [activeWord?.id])
  if (!sentence || !sentenceAnalysis) return null
  const visiblePhraseExplanations = readingPhraseExplanationTexts(sentenceAnalysis)
  const visibleBlockExplanations = readingBlockExplanationTexts(
    sentenceAnalysis,
    visiblePhraseExplanations,
  )
  const structure = sentenceAnalysis.structure ?? null
  const structurePhrases = sentenceAnalysis.structurePhrases ?? []
  const visibleSentenceRules = readingRulesForSentence(sentence, 3, structure)
  const closeSentence = () => onNavigateAway?.()
  const tapToken = (token) => onWordTap?.(token)
  const isKnownWord = (token) => Boolean(
    resolvePassageWord(token.key, sentence.gloss)?.id,
  )
  const patternText = structure ? structurePatternsText(structure.patterns) : ''
  return (
          <div className="space-y-4">
            {/* 構文ラベルを原文へ直接対応させた英文（単語タップ可） */}
            <div
              className="rounded-2xl bg-brand-50 p-4"
              data-reading-role-card="direct-labels"
              data-reading-structure={structure ? 'ledger' : 'analyzer'}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-extrabold tracking-wide text-brand-500">
                  文の要素
                </span>
                <SpeakButton text={sentence.en} size="sm" />
              </div>
              <ReadingRoleSentence
                sentence={structure ? structure.markedSentence : sentence.en}
                parts={structure
                  ? structureDisplayParts(structure.elements)
                  : sentenceFlowParts(sentenceAnalysis)}
                parallel={structure?.parallel ?? []}
                activeWord={activeWord?.word}
                isKnownWord={isKnownWord}
                onWordClick={tapToken}
              />
              {patternText && (
                <p className="mt-2 text-xs font-extrabold text-brand-700" data-reading-sentence-pattern>
                  文型：{patternText}
                </p>
              )}
              {structure && (
                <StructureUnitRows
                  units={structure.units}
                  activeWord={activeWord?.word}
                  isKnownWord={isKnownWord}
                  onWordClick={tapToken}
                />
              )}
              <p className="mt-2 text-[10px] font-bold leading-relaxed text-ink/55">
                {structure
                  ? '上の下線は文全体の骨組みでの役割です。( ) は主語と動詞を持つ節、< > は前置詞句や不定詞などの句です。and・or・but で並ぶものは改行して先頭をそろえ、並ぶものごとに左に線を引きます。節や句の中の役割は、字下げした行に分けて示します。青い太字は重要語で、どの単語もタップできます。'
                  : '下線の下にあるS・V・O・C・Mが、その役割の範囲です。青い太字は重要語で、どの単語もタップできます。'}
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
                      {activeWord.ja ? <MeaningText>{activeWord.ja}</MeaningText> : '（発音を確認できます）'}
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
                {/* 単語帳に入れる（語彙データにある語のみ）。押すと入れる単語帳を選ぶ。 */}
                {activeWord.id && (
                  <button
                    type="button"
                    onClick={() => setBookSheetOpen(true)}
                    aria-haspopup="dialog"
                    data-reading-word-book
                    className={cx(
                      'mt-3 flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-extrabold transition-colors',
                      inWordBook
                        ? 'bg-hint-soft text-amber-700'
                        : 'bg-brand-500 text-white active:bg-brand-600',
                    )}
                  >
                    {inWordBook ? (
                      <>
                        <BookmarkFilled size={16} /> 単語帳に入っています（入れる冊を選ぶ）
                      </>
                    ) : (
                      <>
                        <Bookmark size={16} /> 単語帳に入れる
                      </>
                    )}
                  </button>
                )}
                <WordListSheet
                  open={bookSheetOpen && Boolean(activeWord.id)}
                  onClose={() => setBookSheetOpen(false)}
                  wordId={activeWord.id}
                  wordLabel={activeWord.word}
                />
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
                  <b className="text-violet-700">&lt; &gt;</b> は
                  {structure
                    ? '不定詞・動名詞・分詞などの句'
                    : '句（句自体にS+Vなし・中に節を含む場合あり）'}
                </span>
              </div>
              <p
                className="text-base font-bold leading-loose text-ink"
                data-reading-structure-diagram={sentenceAnalysis.marked}
              >
                <StructureDiagram
                  tokens={structure?.structureTokens ?? sentenceAnalysis.structureTokens}
                  parallel={structure?.parallel ?? []}
                />
              </p>
              <div className="mt-3">
                <SvocFlow parts={structure
                  ? structure.elements.map((element) => ({
                    role: element.displayRole,
                    text: element.trimmed,
                  }))
                  : sentenceFlowParts(sentenceAnalysis)} />
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
                  const structurePhrase = structurePhrases[phraseIndex] ?? null
                  const structureNote = structure
                    ? structure.notes[phraseItem.spokenEn ?? phraseItem.en] ?? ''
                    : ''
                  const phraseGrammar = structure
                    ? [structurePhrase?.explanation, structureNote].filter(Boolean).join(' ')
                    : visiblePhraseExplanations[phraseIndex]
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
                            {phraseIndex + 1}. {structurePhrase?.pattern || phraseItem.pattern || phraseItem.label || '意味フレーズ'}
                          </span>
                          {structurePhrase?.scope && (
                            <span className="border border-sky-100 bg-sky-50 px-1.5 py-0.5 text-sky-800">
                              {structurePhrase.scope}の中
                            </span>
                          )}
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
                      {phraseGrammar && (
                        <p className="mt-2 border-l-2 border-sky-300 bg-sky-50/70 px-2 py-1.5 text-xs font-bold leading-relaxed text-ink/65">
                          フレーズ内の文法：{phraseGrammar}
                        </p>
                      )}
                    </article>
                  )
                })}
              </div>
            </section>

            {/* 構造台帳がある文は、節・句ごとの種類・働き・中の順序を台帳から示す。 */}
            {structure ? (
              (structure.units.length > 0 || structure.links.length > 0) && (
                <section data-reading-grammar-explanations="ledger">
                  <div className="mb-2 flex items-center gap-1.5 text-brand-600">
                    <BookOpen size={16} />
                    <span className="text-[11px] font-extrabold uppercase tracking-wide">
                      節・句とつなぐ語の解説
                    </span>
                  </div>
                  <div className="space-y-2">
                    {structure.units.map((unit, index) => (
                      <article
                        key={unit.id}
                        className="border border-brand-100 bg-white p-3"
                        data-reading-structure-unit-card={unit.base}
                      >
                        <div className="flex flex-wrap items-center gap-1 text-[10px] font-extrabold">
                          <span className="bg-brand-50 px-1.5 py-0.5 text-brand-700">
                            {index + 1}. {unit.label}
                          </span>
                          {unit.connector && (
                            <span className="bg-sky-50 px-1.5 py-0.5 text-sky-800" data-reading-connector-kind>
                              {unit.connector.kind}
                            </span>
                          )}
                          {unit.parts.length > 0 && (
                            <span className="bg-ink/5 px-1.5 py-0.5 text-ink/60">
                              中の順：{flowPattern(structureDisplayParts(unit.parts))}
                            </span>
                          )}
                        </div>
                        <p lang="en" className="mt-1 text-xs font-bold leading-relaxed text-ink/55">
                          {unit.text}
                        </p>
                        <p className="mt-2 border-l-2 border-sky-300 bg-sky-50/70 px-2 py-1.5 text-xs font-bold leading-relaxed text-sky-900/75">
                          文中の働き：{unit.functionText}
                        </p>
                        {unit.connector && (
                          <p className="mt-2 border-l-2 border-emerald-300 bg-emerald-50/70 px-2 py-1.5 text-xs font-bold leading-relaxed text-ink/70">
                            つなぐ語：{unit.connector.explanation}
                          </p>
                        )}
                        {unit.patterns.length > 0 && (
                          <p className="mt-1 text-[11px] font-bold text-ink/55">
                            節の中の文型：{structurePatternsText(unit.patterns)}
                          </p>
                        )}
                        {unit.note && (
                          <p className="mt-2 border-l-2 border-amber-300 bg-amber-50/70 px-2 py-1.5 text-xs font-bold leading-relaxed text-ink/65">
                            文法の決まり：{unit.note}
                          </p>
                        )}
                      </article>
                    ))}
                    {structure.links.map((link, index) => (
                      <article
                        key={`link-${index}`}
                        className="border border-brand-100 bg-white p-3"
                        data-reading-link-card={link.chip}
                      >
                        <div className="flex flex-wrap items-center gap-1 text-[10px] font-extrabold">
                          <span className="bg-sky-50 px-1.5 py-0.5 text-sky-800">
                            {structure.units.length + index + 1}. {link.kind}
                          </span>
                        </div>
                        <p lang="en" className="mt-1 text-xs font-bold leading-relaxed text-ink/55">
                          {link.word}
                        </p>
                        <p className="mt-2 border-l-2 border-emerald-300 bg-emerald-50/70 px-2 py-1.5 text-xs font-bold leading-relaxed text-ink/70">
                          つなぐ語：{link.explanation}
                        </p>
                      </article>
                    ))}
                  </div>
                </section>
              )
            ) : (
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
            )}

            {/* 自然な和訳 */}
            <div className="rounded-2xl bg-hint-soft/70 p-4">
              <div className="mb-1 text-[11px] font-extrabold uppercase tracking-wide text-amber-500">きれいな日本語訳</div>
              <p className="font-bold leading-relaxed text-amber-900">{sentence.ja}</p>
            </div>
    </div>
  )
}
