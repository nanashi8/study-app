import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import {
  getKanbunItem,
  kanbunDomainMeta,
} from '../data/kanbun-content.js'
import { KANBUN_LEVEL_BY_ID } from '../data/kanbun-meta.js'
import { Button, Card, Chip, cx, EmptyState, IconButton } from '../components/ui.jsx'
import { SpeechSettingsButton } from '../components/SpeechSettings.jsx'
import { Book, BookmarkFilled, Cards, ChevronLeft } from '../components/Icons.jsx'

const DOMAINS = ['vocab', 'grammar', 'culture']

export function KanbunSavedScreen() {
  const params = useStore((state) => state.params)
  const navigate = useStore((state) => state.navigate)
  const toggleSaved = useStore((state) => state.toggleKanbunList)
  const vocabIds = useStore((state) => state.kanbunVocabList)
  const grammarIds = useStore((state) => state.kanbunGrammarList)
  const cultureIds = useStore((state) => state.kanbunCultureList)
  const lists = { vocab: vocabIds, grammar: grammarIds, culture: cultureIds }
  const [domain, setDomain] = useState(DOMAINS.includes(params.domain) ? params.domain : 'vocab')
  const meta = kanbunDomainMeta(domain)
  const items = lists[domain].map((id) => getKanbunItem(domain, id)).filter(Boolean)

  return (
    <div className="pb-8">
      <header className="rounded-b-[2.5rem] bg-gradient-to-br from-amber-700 via-rose-800 to-red-950 px-5 pb-6 pt-[calc(env(safe-area-inset-top)+1.25rem)] text-white">
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('kanbunHome')}
            className="flex items-center gap-1 rounded-full bg-white/15 py-1 pl-1.5 pr-2.5 text-[11px] font-extrabold text-white/90"
          >
            <ChevronLeft size={14} /> 漢文アプリ
          </button>
          <SpeechSettingsButton compact inverse />
        </div>
        <p className="text-xs font-bold text-white/70">あとで何度でも暗記・テスト</p>
        <h1 className="font-display text-2xl font-extrabold">漢文の登録リスト</h1>
        <p className="mt-1 text-sm font-bold text-white/80">
          漢語 {vocabIds.length}語・文法 {grammarIds.length}項目・常識 {cultureIds.length}テーマ
        </p>
      </header>

      <main className="px-4 pt-5">
        <div className="grid grid-cols-3 rounded-2xl bg-rose-100 p-1">
          {DOMAINS.map((entry) => {
            const entryMeta = kanbunDomainMeta(entry)
            return (
              <button
                type="button"
                key={entry}
                onClick={() => setDomain(entry)}
                className={cx(
                  'rounded-xl px-1.5 py-2.5 text-[11px] font-extrabold transition-colors',
                  domain === entry ? 'bg-white text-rose-900 shadow-sm' : 'text-rose-900/55',
                )}
              >
                {entryMeta.emoji} {entryMeta.label} {lists[entry].length}
              </button>
            )
          })}
        </div>

        {!items.length ? (
          <EmptyState icon="🔖" title={`登録${meta.label}はまだありません`}>
            {meta.label}の一覧・暗記カード・テストから、覚えたい項目を登録できます。
          </EmptyState>
        ) : (
          <>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button onClick={() => navigate('kanbunStudy', { domain, ids: items.map((item) => item.id), title: `登録${meta.label}` })}>
                <Book size={16} /> 覚える
              </Button>
              <Button variant="secondary" onClick={() => navigate('kanbunQuiz', { domain, ids: items.map((item) => item.id), title: `登録${meta.label}テスト`, size: items.length })}>
                <Cards size={16} /> テスト
              </Button>
            </div>

            <div className="mt-4 space-y-2.5">
              {items.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap gap-2">
                        <Chip color={KANBUN_LEVEL_BY_ID[item.level]?.color}>{KANBUN_LEVEL_BY_ID[item.level]?.shortLabel}</Chip>
                        {item.reading && <Chip color="#be123c">{item.reading}</Chip>}
                      </div>
                      <h2 className="mt-2 font-display text-base font-extrabold leading-relaxed text-ink">{item.title}</h2>
                      {item.pattern && <p className="mt-1 font-mono text-xs font-extrabold text-rose-800">{item.pattern}</p>}
                      <p className="mt-1 text-xs font-bold leading-relaxed text-ink/55">{item.answer}</p>
                      <p className="mt-1 text-[11px] font-bold leading-relaxed text-ink/40">{item.clue}</p>
                    </div>
                    <IconButton
                      onClick={() => toggleSaved(domain, item.id)}
                      aria-label={`${item.title}を登録から外す`}
                      className="text-amber-600"
                    >
                      <BookmarkFilled size={20} />
                    </IconButton>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
