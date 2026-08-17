import { useEffect, useRef } from 'react'
import { useStore } from '../store/useStore.js'
import {
  ETYMOLOGY_DOMAIN_META,
  ETYMOLOGY_FORMATION_META,
  ETYMOLOGY_MODE_META,
  ETYMOLOGY_SOURCE_META,
  getEtymologyPack,
  getWord,
} from '../data/vocab.js'
import { getLevel } from '../data/levels.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import {
  EtymologyFormula,
  EtymologyHistoryTrail,
  PosBadge,
} from '../components/WordBits.jsx'
import { LearningStatusBars } from '../components/LearningStatusBars.jsx'
import { Button, Card, Chip } from '../components/ui.jsx'
import { learningStatusForSrsEntry, summarizeSrsItems } from '../lib/contentProgress.js'
import { ArrowRight, Cards, Check, Sparkles } from '../components/Icons.jsx'

export function EtymologyPackScreen() {
  const rootRef = useRef(null)
  const packId = useStore((state) => state.params.packId)
  const navigate = useStore((state) => state.navigate)
  const srs = useStore((state) => state.srs)
  const etymologySrs = useStore((state) => state.etymologySrs)
  const pack = getEtymologyPack(packId)

  useEffect(() => {
    rootRef.current?.closest('main')?.scrollTo({ top: 0, behavior: 'auto' })
  }, [packId])

  if (!pack) {
    return (
      <div ref={rootRef}>
        <ScreenHeader title="語源カード" />
        <div className="p-8 text-center font-bold text-ink/50">
          学習パックが見つかりませんでした。
        </div>
      </div>
    )
  }

  const mode = ETYMOLOGY_MODE_META[pack.mode]
  const formation = pack.formationKey
    ? ETYMOLOGY_FORMATION_META[pack.formationKey]
    : null
  const source = pack.sourceKey ? ETYMOLOGY_SOURCE_META[pack.sourceKey] : null
  const domain = pack.domainKey ? ETYMOLOGY_DOMAIN_META[pack.domainKey] : null
  const displayTitle = pack.title.replace(/(準?[0-9])級/g, '$1\u2060級')
  const coverage = new Set(pack.coverageIds)
  const words = pack.studyIds.map(getWord).filter(Boolean)
  const progressWords = pack.coverageIds.map(getWord).filter(Boolean)
  const packProgress = summarizeSrsItems([pack], etymologySrs)
  const wordProgress = summarizeSrsItems(progressWords, srs)

  const studyKnowledge = () =>
    navigate('etymologyStudy', {
      packIds: [pack.id],
      size: 1,
    })

  const quizKnowledge = () =>
    navigate('etymologyQuiz', {
      packIds: [pack.id],
      size: 1,
    })

  const study = () =>
    navigate('vocabStudy', {
      source: { type: 'deck', ids: pack.studyIds },
      title: pack.title,
      mode: 'study',
      size: pack.studyIds.length,
    })

  const quiz = () =>
    navigate('vocabQuiz', {
      source: { type: 'deck', ids: pack.studyIds },
      title: pack.title,
      size: pack.studyIds.length,
    })

  return (
    <div ref={rootRef} className="pb-6">
      <ScreenHeader title="語源カード" />

      <div className="space-y-4 px-4">
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-brand-600 to-violet-700 p-5 text-white">
            <div className="flex items-center gap-3">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-3xl">
                {pack.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-extrabold text-white/75">
                  {mode.label}
                </p>
                <h1 className="font-display text-lg font-extrabold leading-tight">
                  {displayTitle}
                </h1>
                <p className="mt-1 text-xs font-bold text-white/75">{pack.subtitle}</p>
              </div>
            </div>
          </div>
          <div className="space-y-3 p-4">
            <p className="text-sm font-bold leading-relaxed text-ink/60">
              {pack.description}
            </p>
            {pack.caution && (
              <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-extrabold leading-relaxed text-amber-800 ring-1 ring-amber-100">
                {pack.caution}
              </p>
            )}
            {pack.mode === 'origin' && (
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  ['作られ方', formation?.emoji, formation?.short],
                  ['もとの言語', source?.emoji, source?.short],
                  ['今の分野', domain?.emoji, pack.fieldLabel ?? domain?.label],
                ].map(([label, emoji, value]) => (
                  <div
                    key={label}
                    className="min-w-0 rounded-xl bg-slate-50 px-2 py-2 text-center ring-1 ring-slate-100"
                  >
                    <p className="text-xs font-extrabold text-ink/45">{label}</p>
                    <p className="mt-1 text-xs font-extrabold leading-snug text-ink/75">
                      {emoji} {value}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <div className="rounded-xl bg-violet-50 px-3 py-3">
              <p className="mb-2 text-xs font-extrabold text-violet-800">この語源カード</p>
              <LearningStatusBars progress={packProgress} compact />
            </div>
            <div className="grid grid-cols-2 gap-2" data-etymology-pack-actions>
              <Button full onClick={studyKnowledge}>
                <Sparkles size={18} /> 覚える
              </Button>
              <Button full variant="secondary" onClick={quizKnowledge}>
                <Cards size={18} /> 確認問題
              </Button>
            </div>
            <div className="rounded-xl bg-brand-50 px-3 py-3">
              <p className="mb-2 text-xs font-extrabold text-brand-700">
                関連英単語 {progressWords.length}語・この画面 {words.length}語
              </p>
              <LearningStatusBars progress={wordProgress} compact />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" onClick={study}>
                <Sparkles size={18} /> 単語カード
              </Button>
              <Button variant="secondary" onClick={quiz}>
                <Cards size={18} /> 単語クイズ
              </Button>
            </div>
            {pack.rootId && (
              <button
                type="button"
                onClick={() => navigate('rootDetail', { rootId: pack.rootId })}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-violet-50 py-2 text-xs font-extrabold text-violet-700 ring-1 ring-violet-100 active:bg-violet-100"
              >
                🌳 同じ語根の全単語を見る
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </Card>

        <div>
          <div className="mb-2 px-1">
            <h2 className="font-display text-base font-extrabold text-ink/80">
              {pack.mode === 'formula'
                ? '部品の意味を比べる'
                : pack.mode === 'origin'
                  ? 'もとの形から今の意味をたどる'
                  : '仲間を見比べる'}
            </h2>
            <p className="mt-0.5 text-xs font-bold text-ink/45">
              {pack.mode === 'origin'
                ? '作られ方やもとの言語を確認し、1語ずつ変化をたどります。'
                : '足がかりの語も含め、一度に8語以内に絞っています。'}
            </p>
          </div>

          <div className="space-y-2">
            {words.map((word) => {
              const level = getLevel(word.level)
              const learningStatus = learningStatusForSrsEntry(srs[word.id])
              const isAnchor = word.id === pack.anchorId
              const isSupport = !coverage.has(word.id)
              return (
                <button
                  key={word.id}
                  onClick={() => navigate('wordDetail', { id: word.id })}
                  className="w-full rounded-2xl bg-white p-3 text-left shadow-sm active:bg-brand-50"
                >
                  <div className="flex items-center gap-2">
                    <PosBadge pos={word.pos} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-display text-lg font-extrabold text-ink">
                          {word.word}
                        </span>
                        <Chip color={level.color}>{level.label}</Chip>
                        {(isAnchor || isSupport) && (
                          <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-extrabold text-emerald-700 ring-1 ring-emerald-100">
                            見本の語
                          </span>
                        )}
                        {learningStatus === 'learned' && (
                          <span className="inline-flex items-center gap-0.5 text-xs font-extrabold text-emerald-600">
                            <Check size={13} /> 学習済
                          </span>
                        )}
                        {learningStatus === 'reviewing' && (
                          <span className="text-xs font-extrabold text-amber-600">復習中</span>
                        )}
                      </div>
                      <p className="truncate text-xs font-bold text-ink/55">{word.meaning}</p>
                    </div>
                    <span className="text-brand-300"><ArrowRight size={17} /></span>
                  </div>

                  {pack.mode === 'formula' ? (
                    <div className="mt-2.5 pl-8">
                      <EtymologyFormula word={word} compact />
                    </div>
                  ) : pack.mode === 'origin' ? (
                    <div className="mt-2.5 pl-8">
                      <EtymologyHistoryTrail word={word} compact />
                    </div>
                  ) : (
                    <p className="mt-2 pl-8 text-xs font-bold leading-relaxed text-ink/60">
                      {word.etymology?.note}
                    </p>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
