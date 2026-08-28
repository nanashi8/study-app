import { useState } from 'react'
import { todayIndex, useStore } from '../store/useStore.js'
import { PHRASE_KINDS, phrasesByKind } from '../data/phrases.js'
import {
  SYNTAX_FAMILY_GUIDES,
  syntaxFamilyFor,
  syntaxFamilySearchText,
} from '../data/syntax-families.js'
import {
  FEATURED_IDIOM_FORM_FAMILY_IDS,
  IDIOM_FORM_FAMILIES,
  IDIOM_FORM_FAMILY_SECTIONS,
  idiomBelongsToFormFamily,
  idiomFormFamilyById,
  idiomFormSearchText,
} from '../data/idiom-form-families.js'
import { curriculum1900PhraseAliasesFor } from '../data/curriculum-1900-resolutions.js'
import { longSentenceTranslationFor } from '../data/long-sentence-translations.js'
import { LEVELS, getLevel } from '../data/levels.js'
import { phraseSpeechText } from '../lib/phrase-speech.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { Sheet } from '../components/Sheet.jsx'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { LongSentenceTranslation } from '../components/LongSentenceTranslation.jsx'
import { SyntaxFamilyGuide } from '../components/SyntaxFamilyGuide.jsx'
import { IdiomFormGuide } from '../components/IdiomFormGuide.jsx'
import { Card, Button, Chip, IconButton } from '../components/ui.jsx'
import { LearningEntryCard } from '../components/LearningEntryCard.jsx'
import { LearningViewTabs } from '../components/LearningViewTabs.jsx'
import { LearningStatusBars } from '../components/LearningStatusBars.jsx'
import { NormalLearningRecordList } from '../components/NormalLearningRecordList.jsx'
import { summarizeSrsItems } from '../lib/contentProgress.js'
import { scrollScreenToTop } from '../lib/screenScroll.js'
import { ArrowRight, Book, Cards, Lightbulb, Link, Refresh, Search, Sparkles } from '../components/Icons.jsx'
import { cx } from '../components/ui.jsx'

const levelOrder = Object.fromEntries(LEVELS.map((l, i) => [l.id, i]))
const PHRASE_COUNTS = Object.freeze(Object.fromEntries(
  PHRASE_KINDS.map((item) => [item.id, phrasesByKind(item.id).length]),
))
const PHRASE_RECORD_ENTRY_IDS = Object.freeze({
  idiom: 'usage-idiom',
  syntax: 'usage-syntax',
})
const PHRASE_TOTAL = Object.values(PHRASE_COUNTS).reduce((sum, count) => sum + count, 0)
// 級カードは英単語と同じ並びで出すので、種類×級の集合をあらかじめ固めておく。
const PHRASE_ITEMS_BY_KIND_LEVEL = Object.freeze(Object.fromEntries(
  PHRASE_KINDS.map((item) => [
    item.id,
    Object.freeze(Object.fromEntries(LEVELS.map((level) => [
      level.id,
      Object.freeze(phrasesByKind(item.id).filter((phrase) => phrase.level === level.id)),
    ]))),
  ]),
))
const PHRASE_LEVEL_COUNTS = Object.freeze(Object.fromEntries(
  LEVELS.map((level) => {
    const idiom = PHRASE_ITEMS_BY_KIND_LEVEL.idiom[level.id].length
    const syntax = PHRASE_ITEMS_BY_KIND_LEVEL.syntax[level.id].length
    return [level.id, Object.freeze({ idiom, syntax, total: idiom + syntax })]
  }),
))
const SYNTAX_FAMILY_OPTIONS = Object.freeze(
  SYNTAX_FAMILY_GUIDES.map((guide) => ({
    ...guide,
    count: phrasesByKind('syntax').filter((item) => syntaxFamilyFor(item)?.id === guide.id).length,
  })).filter((guide) => guide.count > 0),
)
const IDIOM_FORM_OPTIONS = IDIOM_FORM_FAMILIES
const FEATURED_IDIOM_FORM_OPTIONS = Object.freeze(
  FEATURED_IDIOM_FORM_FAMILY_IDS.map(idiomFormFamilyById).filter(Boolean),
)

// 「10分野から学ぶ」と同じ役目の入口。熟語は形、構文は仲間でまとめて選ぶ。
function FormChooser({ meta, onChoose }) {
  return (
    <button
      type="button"
      onClick={onChoose}
      className="block w-full overflow-hidden rounded-2xl bg-white text-left shadow-card active:bg-brand-50"
      data-phrase-form-entry={meta.id}
    >
      <div className="bg-gradient-to-r from-brand-500 to-violet-500 p-4 text-white">
        <div className="flex items-center gap-2">
          <Sparkles size={18} />
          <h2 className="font-display text-lg font-extrabold">
            {meta.id === 'syntax' ? '仲間から学ぶ' : '形から学ぶ'}
          </h2>
        </div>
        <p className="mt-1 text-xs font-bold text-white/80">
          {meta.id === 'syntax'
            ? `全${PHRASE_COUNTS.syntax}構文を${SYNTAX_FAMILY_OPTIONS.length}組の仲間に整理`
            : `全${PHRASE_COUNTS.idiom}熟語を${IDIOM_FORM_OPTIONS.length}組の形に整理`}
        </p>
      </div>
      <div className="flex items-center justify-between gap-3 p-4">
        <p className="text-xs font-bold leading-relaxed text-ink/55">
          {meta.id === 'syntax'
            ? '似た形の構文を並べて、意味の差と入試の見分け方を比べられます。'
            : '同じ前置詞・同じ動詞の熟語を並べて、意味の差を比べられます。'}
        </p>
        <ArrowRight size={20} className="shrink-0 text-brand-500" />
      </div>
    </button>
  )
}

export function PhrasesScreen() {
  const navigate = useStore((s) => s.navigate)
  const srs = useStore((s) => s.srs)
  const screenParams = useStore((s) => s.params)
  const initialKind = screenParams.kind ?? 'idiom'
  const [kind, setKind] = useState(initialKind)
  const [view, setView] = useState(screenParams.view === 'list' ? 'list' : 'home')
  const [detail, setDetail] = useState(null)
  const [query, setQuery] = useState(screenParams.query ?? '')
  const [levelFilter, setLevelFilter] = useState(screenParams.levelFilter ?? 'all')
  const [familyFilter, setFamilyFilter] = useState(screenParams.familyFilter ?? 'all')

  const meta = PHRASE_KINDS.find((k) => k.id === kind)
  const kindItems = phrasesByKind(kind)
  const normalizedQuery = query.trim().toLowerCase()
  const items = [...kindItems]
    .filter((item) => levelFilter === 'all' || item.level === levelFilter)
    .filter((item) => familyFilter === 'all' || (
      kind === 'syntax'
        ? syntaxFamilyFor(item)?.id === familyFilter
        : idiomBelongsToFormFamily(item, familyFilter)
    ))
    .filter((item) => {
      if (!normalizedQuery) return true
      return [
        item.phrase,
        item.meaning,
        item.note,
        item.example?.en,
        item.example?.ja,
        syntaxFamilySearchText(item),
        idiomFormSearchText(item),
        ...(item.aliases ?? []),
        ...curriculum1900PhraseAliasesFor(item.phrase),
      ].filter(Boolean).join(' ').toLowerCase().includes(normalizedQuery)
    })
    .sort((a, b) => levelOrder[a.level] - levelOrder[b.level])

  const selectedFamily = familyFilter === 'all'
    ? null
    : kind === 'syntax'
      ? SYNTAX_FAMILY_OPTIONS.find((guide) => guide.id === familyFilter) ?? null
      : idiomFormFamilyById(familyFilter)
  const selectedSource = normalizedQuery || familyFilter !== 'all'
    ? { type: 'phraseList', ids: items.map((item) => item.id) }
    : {
        type: 'phrase',
        kind,
        ...(levelFilter === 'all' ? {} : { levelId: levelFilter }),
      }
  const selectedTitle = [
    levelFilter === 'all' ? null : getLevel(levelFilter).label,
    selectedFamily?.title,
    meta.label,
  ].filter(Boolean).join(' ')
  const detailTranslation = longSentenceTranslationFor(detail)
  const status = summarizeSrsItems(items, srs)
  const dueItems = items.filter((item) => srs[item.id]?.due <= todayIndex())
  const due = dueItems.length

  // 一覧から始めたときは、終わったあとも一覧へ戻す。
  const returnTarget = {
    screen: 'phrases',
    params: { kind, levelFilter, familyFilter, query },
  }
  if (view === 'list') returnTarget.params.view = view
  const selectedFormParams = kind === 'idiom' && familyFilter !== 'all'
    ? { idiomFormFamilyId: familyFilter }
    : {}
  const study = () => navigate('phraseStudy', {
    source: selectedSource,
    title: selectedTitle,
    mode: 'study',
    engine: 'phrase',
    ...selectedFormParams,
    returnTo: returnTarget,
  })
  const quiz = () => navigate('phraseQuiz', {
    source: selectedSource,
    title: selectedTitle,
    engine: 'phrase',
    ...selectedFormParams,
    returnTo: returnTarget,
  })
  const reviewDue = () =>
    navigate('phraseStudy', {
      source: { type: 'phraseList', ids: dueItems.map((item) => item.id) },
      title: `${selectedTitle}の復習`,
      mode: 'study',
      engine: 'phrase',
      ...selectedFormParams,
      returnTo: returnTarget,
    })

  // 入口カード（全範囲・級別）からそのまま暗記・テストを始める。
  const startScope = ({ levelId, title, asQuiz = false }) =>
    navigate(asQuiz ? 'phraseQuiz' : 'phraseStudy', {
      source: { type: 'phrase', kind, ...(levelId ? { levelId } : {}) },
      title,
      ...(asQuiz ? {} : { mode: 'study' }),
      engine: 'phrase',
      returnTo: returnTarget,
    })
  const openCatalog = (levelId = 'all') => {
    scrollScreenToTop()
    setLevelFilter(levelId)
    setFamilyFilter('all')
    setQuery('')
    setView('list')
  }

  const kindDueItems = kindItems.filter((item) => srs[item.id]?.due <= todayIndex())

  const kindTabs = (
    <div className="grid grid-cols-2 gap-2">
      {PHRASE_KINDS.map((k) => {
        const on = kind === k.id
        return (
          <button
            key={k.id}
            onClick={() => {
              setKind(k.id)
              setFamilyFilter('all')
            }}
            className={cx(
              'flex items-center justify-center gap-2 rounded-2xl py-3 font-display font-extrabold transition-all',
              on ? 'text-white shadow-pop' : 'bg-white text-ink/60',
            )}
            style={on ? { background: k.color } : undefined}
          >
            <span className="text-xl">{k.emoji}</span> {k.label}
          </button>
        )
      })}
    </div>
  )

  const homeView = (
    <>
      <ScreenHeader
        title="熟語・構文"
        subtitle="英検の級と形から選んで練習"
        right={
          <IconButton onClick={() => openCatalog('all')} aria-label="熟語・構文を検索">
            <Search size={22} />
          </IconButton>
        }
      />

      <div className="space-y-3 px-4">
        {/* 種類切替 */}
        {kindTabs}

        <section
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
          aria-label="熟語・構文の収録状況"
          data-phrase-corpus-summary
        >
          <div className="grid grid-cols-3 divide-x divide-slate-200 text-center">
            {[
              ['総収録', PHRASE_TOTAL],
              ['熟語', PHRASE_COUNTS.idiom],
              ['構文', PHRASE_COUNTS.syntax],
            ].map(([label, value]) => (
              <div key={label} className="px-2 py-2.5">
                <p className="text-[10px] font-extrabold text-slate-500">{label}</p>
                <p className="font-display text-lg font-extrabold tabular-nums text-slate-900">
                  {value.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          <details className="border-t border-slate-200">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-3 text-xs font-extrabold text-slate-600">
              <span>英検5級〜1級の級別内訳</span>
              <span className="text-slate-400">全7級</span>
            </summary>
            <div className="overflow-x-auto border-t border-slate-100 p-3 pt-2">
              <table className="w-full min-w-[19rem] border-collapse text-xs" data-phrase-level-table>
                <thead>
                  <tr className="border-b border-slate-300 text-left text-[10px] font-extrabold text-slate-500">
                    <th className="py-1.5">級</th>
                    <th className="py-1.5 text-right">熟語</th>
                    <th className="py-1.5 text-right">構文</th>
                    <th className="py-1.5 text-right">計</th>
                  </tr>
                </thead>
                <tbody>
                  {LEVELS.map((level) => {
                    const counts = PHRASE_LEVEL_COUNTS[level.id]
                    return (
                      <tr key={level.id} className="border-b border-slate-100 font-bold text-slate-700 last:border-0">
                        <th className="py-1.5 text-left">{level.label}</th>
                        <td className="py-1.5 text-right tabular-nums">{counts.idiom}</td>
                        <td className="py-1.5 text-right tabular-nums">{counts.syntax}</td>
                        <td className="py-1.5 text-right tabular-nums">{counts.total}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </details>
        </section>

        <FormChooser meta={meta} onChoose={() => openCatalog('all')} />

        {/* 全範囲：英単語の級カードと同じ並び */}
        <LearningEntryCard
          data-phrase-entry={`${kind}-all`}
          emoji={meta.emoji}
          accentColor={meta.color}
          title={`${meta.label}の全範囲`}
          chip={<Chip color={meta.color}>全7級</Chip>}
          subtitle={meta.desc}
          countLabel={`全${PHRASE_COUNTS[kind].toLocaleString('ja-JP')}項目`}
          status={summarizeSrsItems(kindItems, srs)}
          units={{ learning: '項目', quiz: '問' }}
          note={kindDueItems.length > 0
            ? `復習が必要 ${kindDueItems.length}項目`
            : '次の復習日まで待つ'}
          noteTone={kindDueItems.length > 0 ? 'alert' : 'muted'}
          studyAriaLabel={`${meta.label}の全範囲を暗記`}
          onStudy={() => startScope({ title: `${meta.label}・全範囲` })}
          quizAriaLabel={`${meta.label}の全範囲をテスト`}
          onQuiz={() => startScope({ title: `${meta.label}・全範囲`, asQuiz: true })}
          catalogLabel="一覧を確認"
          catalogAriaLabel={`${meta.label}の全項目を一覧で確認する`}
          onCatalog={() => openCatalog('all')}
        >
          {kindDueItems.length > 0 && (
            <Button
              full
              variant="hint"
              className="mt-2"
              onClick={() => navigate('phraseStudy', {
                source: { type: 'phraseList', ids: kindDueItems.map((item) => item.id) },
                title: `${meta.label}・今日の復習`,
                mode: 'study',
                engine: 'phrase',
                returnTo: returnTarget,
              })}
            >
              <Refresh size={16} /> 今日の復習 {kindDueItems.length}項目
            </Button>
          )}
        </LearningEntryCard>

        {/* 級別：英単語と同じカード */}
        {LEVELS.map((level) => {
          const levelItems = PHRASE_ITEMS_BY_KIND_LEVEL[kind][level.id]
          const levelDue = levelItems.filter((item) => srs[item.id]?.due <= todayIndex()).length
          return (
            <LearningEntryCard
              key={level.id}
              data-phrase-entry={`${kind}-${level.id}`}
              emoji={level.emoji}
              accentColor={level.color}
              title={`英検${level.label}`}
              chip={<Chip color={level.color}>{level.cefr}</Chip>}
              subtitle={level.sub}
              countLabel={`全${levelItems.length}項目`}
              status={summarizeSrsItems(levelItems, srs)}
              units={{ learning: '項目', quiz: '問' }}
              note={levelDue > 0 ? `復習が必要 ${levelDue}項目` : '次の復習日まで待つ'}
              noteTone={levelDue > 0 ? 'alert' : 'muted'}
              studyDisabled={!levelItems.length}
              studyAriaLabel={`英検${level.label}の${meta.label}を暗記`}
              onStudy={() => startScope({
                levelId: level.id,
                title: `英検${level.label} ${meta.label}`,
              })}
              quizDisabled={!levelItems.length}
              quizAriaLabel={`英検${level.label}の${meta.label}をテスト`}
              onQuiz={() => startScope({
                levelId: level.id,
                title: `英検${level.label} ${meta.label}`,
                asQuiz: true,
              })}
              catalogLabel="一覧を確認"
              catalogAriaLabel={`英検${level.label}の${meta.label}を一覧で確認する`}
              catalogDisabled={!levelItems.length}
              onCatalog={() => openCatalog(level.id)}
            />
          )
        })}
      </div>
    </>
  )

  const listView = (
    <>
      <ScreenHeader title={`${meta.label}の一覧を確認`} compact />

      <div className="px-4 pt-2">
        <LearningViewTabs
          view="list"
          onChange={(nextView) => setView(nextView)}
          learnLabel="級から学ぶ"
          listLabel="一覧を確認"
          label="熟語・構文の見方"
        />

        <div className="mt-3">{kindTabs}</div>

        {/* 1,000項目以上でも目的の表現へすぐ到達できる検索・級フィルター */}
        <div className="mt-3 space-y-2">
          <label className="flex items-center gap-2 rounded-2xl bg-white px-3 shadow-sm ring-1 ring-brand-100 focus-within:ring-2 focus-within:ring-brand-300">
            <Search size={17} className="shrink-0 text-brand-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="英語・意味・語法で絞り込む"
              className="h-11 min-w-0 flex-1 bg-transparent text-sm font-bold text-ink outline-none placeholder:font-normal placeholder:text-ink/30"
              aria-label="熟語と構文を検索"
            />
          </label>
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setLevelFilter('all')}
              className={cx(
                'shrink-0 rounded-full px-3 py-1.5 text-xs font-extrabold',
                levelFilter === 'all' ? 'bg-ink text-white' : 'bg-white text-ink/50',
              )}
            >
              全級
            </button>
            {LEVELS.map((level) => (
              <button
                key={level.id}
                onClick={() => setLevelFilter(level.id)}
                className={cx(
                  'shrink-0 rounded-full px-3 py-1.5 text-xs font-extrabold',
                  levelFilter === level.id ? 'text-white' : 'bg-white text-ink/50',
                )}
                style={levelFilter === level.id ? { background: level.color } : undefined}
              >
                {level.label}
              </button>
            ))}
          </div>
          {kind === 'syntax' && (
            <div
              className="rounded-2xl bg-violet-50 p-3 ring-1 ring-violet-100"
              data-syntax-family-filter
            >
              <label className="block text-[11px] font-extrabold text-violet-700" htmlFor="syntax-family-filter">
                構文を仲間でまとめて学ぶ
              </label>
              <select
                id="syntax-family-filter"
                value={familyFilter}
                onChange={(event) => setFamilyFilter(event.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border border-violet-200 bg-white px-3 text-sm font-bold text-ink outline-none focus:border-violet-400"
              >
                <option value="all">全ファミリー（{SYNTAX_FAMILY_OPTIONS.length}組・{PHRASE_COUNTS.syntax}構文）</option>
                {SYNTAX_FAMILY_OPTIONS.map((guide) => (
                  <option key={guide.id} value={guide.id}>
                    {guide.title}（{guide.count}構文）
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs font-bold leading-relaxed text-violet-900/70">
                {selectedFamily
                  ? selectedFamily.summary
                  : '似た形を比較しながら覚えます。各カードにも、同じ仲間の形・意味差・入試の見分け方をまとめて表示します。'}
              </p>
            </div>
          )}
          {kind === 'idiom' && (
            <div
              className="rounded-2xl bg-sky-50 p-3 ring-1 ring-sky-100"
              data-idiom-form-filter
            >
              <label className="block text-[11px] font-extrabold text-sky-700" htmlFor="idiom-form-filter">
                熟語を同じ形でまとめて学ぶ
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2" data-idiom-featured-forms>
                {FEATURED_IDIOM_FORM_OPTIONS.map((guide) => {
                  const selected = familyFilter === guide.id
                  return (
                    <button
                      key={guide.id}
                      type="button"
                      onClick={() => setFamilyFilter(guide.id)}
                      aria-pressed={selected}
                      data-idiom-featured-form={guide.id}
                      className={cx(
                        'flex min-h-11 items-center justify-between gap-2 rounded-xl px-3 text-left text-xs font-extrabold ring-1 transition-colors',
                        selected
                          ? 'bg-sky-600 text-white ring-sky-600'
                          : 'bg-white text-sky-900 ring-sky-200',
                      )}
                    >
                      <span className="font-display">{guide.title}</span>
                      <span className={selected ? 'text-white/75' : 'text-sky-600/70'}>{guide.count}件</span>
                    </button>
                  )
                })}
              </div>
              <select
                id="idiom-form-filter"
                value={familyFilter}
                onChange={(event) => setFamilyFilter(event.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border border-sky-200 bg-white px-3 text-sm font-bold text-ink outline-none focus:border-sky-400"
              >
                <option value="all">すべての熟語（{PHRASE_COUNTS.idiom}件）</option>
                {IDIOM_FORM_FAMILY_SECTIONS.map((section) => (
                  <optgroup key={section.id} label={section.label}>
                    {section.families.map((guide) => (
                      <option key={guide.id} value={guide.id}>
                        {guide.title}（{guide.count}件）
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <p className="mt-2 text-xs font-bold leading-relaxed text-sky-900/70">
                {selectedFamily
                  ? selectedFamily.summary
                  : `「〜 up」「〜 at」「〜 with」「be 〜 at」など、${IDIOM_FORM_OPTIONS.length}組から形を選び、意味の違いを比べられます。`}
              </p>
            </div>
          )}
        </div>

        {/* 絞り込んだ範囲の進捗＋学習ボタン */}
        <Card className="mt-4 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-display text-lg font-extrabold text-ink">
                {meta.emoji} {meta.label}
              </div>
              <div className="text-xs font-bold text-ink/50">{meta.desc}・表示対象{items.length}項目</div>
            </div>
            <div className="text-right text-xs font-bold text-ink/45">全{items.length}項目</div>
          </div>
          <LearningStatusBars progress={status} className="mt-3" compact units={{ learning: '項目', quiz: '問' }} />
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button onClick={study} disabled={!items.length}><Book size={16} /> 暗記</Button>
            <Button variant="secondary" onClick={quiz} disabled={!items.length}><Cards size={16} /> テスト</Button>
          </div>
          {due > 0 && (
            <Button full variant="hint" className="mt-2" onClick={reviewDue}>
              <Refresh size={16} /> 今日の復習 {due}項目
            </Button>
          )}
        </Card>

        {/* 一覧 */}
        <h2 className="mb-2 mt-5 px-1 font-display text-base font-extrabold text-ink/80">
          {meta.label}の一覧
          <span className="ml-2 text-xs text-ink/35">全{items.length}項目</span>
        </h2>
        <NormalLearningRecordList
          entryId={PHRASE_RECORD_ENTRY_IDS[kind]}
          contentId="usage"
          items={items}
          unit="項目"
          pageSize={60}
          onOpen={(item) => setDetail(item)}
          openLabel={`${meta.label}の説明を見る`}
          openHint="説明"
          titleLanguage="en"
          emptyMessage={`条件に合う${meta.label}はありません。`}
        />
      </div>
    </>
  )

  return (
    <div className="pb-6">
      {view === 'list' ? listView : homeView}

      {/* 詳細シート */}
      <Sheet open={!!detail} onClose={() => setDetail(null)} title="くわしく">
        {detail && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <SpeakButton text={phraseSpeechText(detail)} size="md" />
              <div>
                <div className="font-display text-2xl font-extrabold text-ink">{detail.phrase}</div>
                <Chip color={getLevel(detail.level).color}>英検{getLevel(detail.level).label}</Chip>
              </div>
            </div>
            <div className="rounded-2xl bg-brand-50 p-3">
              <div className="text-[11px] font-extrabold uppercase tracking-wide text-brand-400">意味</div>
              <div className="font-display text-lg font-extrabold text-ink">{detail.meanings.join('・')}</div>
            </div>
            <div className="rounded-2xl bg-white p-3 ring-1 ring-brand-100">
              <div className="flex items-start gap-2">
                <SpeakButton text={detail.example.en} size="sm" />
                <div>
                  <p className="font-bold text-ink">{detail.example.en}</p>
                  <p className="mt-0.5 text-sm font-bold text-ink/55">
                    {detailTranslation && <span className="mr-1 text-[11px] text-ink/35">自然な和訳</span>}
                    {detail.example.ja}
                  </p>
                </div>
              </div>
            </div>
            <LongSentenceTranslation guide={detailTranslation} />
            {detail.origin && (
              <div className="rounded-2xl bg-violet-50 p-3 ring-1 ring-violet-100">
                <div className="mb-1 flex items-center gap-1.5 text-violet-600">
                  <Link size={16} />
                  <span className="text-[11px] font-extrabold uppercase tracking-wide">
                    {detail.kind === 'syntax' ? 'この文のポイント' : '成り立ち'}
                  </span>
                </div>
                <p className="text-sm font-bold leading-relaxed text-violet-900/90">{detail.origin}</p>
              </div>
            )}
            {detail.note && (
              <div className="flex gap-2 rounded-2xl bg-hint-soft/70 p-3">
                <span className="mt-0.5 shrink-0 text-hint"><Lightbulb size={18} /></span>
                <p className="text-sm font-bold leading-relaxed text-amber-900/90">{detail.note}</p>
              </div>
            )}
            <SyntaxFamilyGuide item={detail} />
            <IdiomFormGuide item={detail}
              familyId={kind === 'idiom' && familyFilter !== 'all' ? familyFilter : null}
              returnTo={returnTarget}
            />
          </div>
        )}
      </Sheet>
    </div>
  )
}
