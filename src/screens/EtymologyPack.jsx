import { useEffect, useRef } from 'react'
import { useStore, todayIndex } from '../store/useStore.js'
import {
  ETYMOLOGY_DOMAIN_META,
  ETYMOLOGY_FORMATION_META,
  ETYMOLOGY_MODE_META,
  ETYMOLOGY_SOURCE_META,
  getEtymologyPack,
  getWord,
} from '../data/vocab.js'
import {
  etymologyKnowledgeStatus,
  isEtymologyDue,
  ETYMOLOGY_MASTER_BOX,
  ETYMOLOGY_STATUS_META,
} from '../lib/etymologyProgress.js'
import { getLevel } from '../data/levels.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import {
  EtymologyFormula,
  EtymologyHistoryTrail,
  PosBadge,
} from '../components/WordBits.jsx'
import { Button, Card, Chip, ProgressRing, cx } from '../components/ui.jsx'
import { ArrowRight, Cards, Check, Sparkles } from '../components/Icons.jsx'

const WORD_MASTER_BOX = 4

const STATUS_CLASS = {
  unstarted: 'bg-slate-100 text-slate-600',
  learning: 'bg-amber-50 text-amber-700',
  mastered: 'bg-emerald-50 text-emerald-700',
  due: 'bg-rose-50 text-rose-700',
}

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
        <ScreenHeader title="語源の濃縮パック" />
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
  const mastered = progressWords.filter(
    (word) => (srs[word.id]?.box ?? 0) >= WORD_MASTER_BOX,
  ).length
  const points = progressWords.reduce(
    (sum, word) => sum + Math.min(srs[word.id]?.box ?? 0, WORD_MASTER_BOX),
    0,
  )
  const wordRatio = progressWords.length
    ? points / (progressWords.length * WORD_MASTER_BOX)
    : 0
  const etymologyEntry = etymologySrs[pack.id]
  const baseStatus = etymologyKnowledgeStatus(etymologyEntry)
  const knowledgeStatus = isEtymologyDue(etymologyEntry, todayIndex()) ? 'due' : baseStatus
  const knowledgeRatio = Math.min(etymologyEntry?.box ?? 0, ETYMOLOGY_MASTER_BOX)
    / ETYMOLOGY_MASTER_BOX

  const studyKnowledge = () =>
    navigate('etymologyStudy', {
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
      <ScreenHeader title="語源の濃縮パック" />

      <div className="space-y-4 px-4">
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-brand-600 to-violet-700 p-5 text-white">
            <div className="flex items-center gap-3">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-3xl">
                {pack.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-extrabold uppercase tracking-wide text-white/65">
                  {mode.label}
                </p>
                <h1 className="font-display text-lg font-extrabold leading-tight">
                  {displayTitle}
                </h1>
                <p className="mt-1 text-xs font-bold text-white/75">{pack.subtitle}</p>
              </div>
              <ProgressRing
                value={knowledgeRatio}
                size={54}
                stroke={7}
                color="#ffffff"
                track="rgba(255,255,255,0.25)"
              >
                <span className="text-[10px] font-extrabold">
                  {Math.round(knowledgeRatio * 100)}%
                </span>
              </ProgressRing>
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
                  ['成り立ち', formation?.emoji, formation?.short],
                  ['出発言語', source?.emoji, source?.short],
                  ['意味分野', domain?.emoji, pack.fieldLabel ?? domain?.label],
                ].map(([label, emoji, value]) => (
                  <div
                    key={label}
                    className="min-w-0 rounded-xl bg-slate-50 px-2 py-2 text-center ring-1 ring-slate-100"
                  >
                    <p className="text-[9px] font-extrabold text-ink/35">{label}</p>
                    <p className="mt-0.5 truncate text-[10px] font-extrabold text-ink/70">
                      {emoji} {value}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between rounded-xl bg-violet-50 px-3 py-2">
              <div>
                <p className="text-[10px] font-extrabold text-violet-500">語源知識の進捗</p>
                <p className="text-xs font-extrabold text-violet-800">
                  反復レベル {Math.min(etymologyEntry?.box ?? 0, ETYMOLOGY_MASTER_BOX)}/
                  {ETYMOLOGY_MASTER_BOX}
                </p>
              </div>
              <span className={cx(
                'rounded-full px-2.5 py-1 text-[10px] font-extrabold',
                STATUS_CLASS[knowledgeStatus],
              )}>
                {knowledgeStatus === 'due'
                  ? '復習待ち'
                  : ETYMOLOGY_STATUS_META[knowledgeStatus].label}
              </span>
            </div>
            <Button full onClick={studyKnowledge}>
              <Sparkles size={18} /> この語源をカードで覚える
            </Button>
            <div className="flex items-center justify-between text-xs font-extrabold text-brand-600">
              <span>関連 {progressWords.length}語・表示 {words.length}語</span>
              <span>単語習得 {mastered}/{progressWords.length}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-brand-100">
              <div
                className="h-full rounded-full bg-brand-500 transition-[width]"
                style={{ width: `${Math.round(wordRatio * 100)}%` }}
              />
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
                🌳 この語根の全単語へ広げる
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </Card>

        <div>
          <div className="mb-2 px-1">
            <h2 className="font-display text-base font-extrabold text-ink/80">
              {pack.mode === 'formula'
                ? '意味の式を比べる'
                : pack.mode === 'origin'
                  ? '出発点から現在義をたどる'
                  : '1つの束で見比べる'}
            </h2>
            <p className="mt-0.5 text-xs font-bold text-ink/45">
              {pack.mode === 'origin'
                ? '共通軸を確認し、語ごとの意味の橋は混同せずに覚えます。'
                : '足がかりの語も含め、一度に8語以内に絞っています。'}
            </p>
          </div>

          <div className="space-y-2">
            {words.map((word) => {
              const level = getLevel(word.level)
              const box = srs[word.id]?.box ?? 0
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
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-extrabold text-emerald-700 ring-1 ring-emerald-100">
                            足がかり
                          </span>
                        )}
                        {box >= WORD_MASTER_BOX && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-emerald-600">
                            <Check size={13} /> 習得
                          </span>
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
                    <p className="mt-2 line-clamp-3 pl-8 text-xs font-bold leading-relaxed text-ink/50">
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
