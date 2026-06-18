import { useMemo, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { ALL_WORDS } from '../data/vocab.js'
import { LEVELS, getLevel } from '../data/levels.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { PosBadge } from '../components/WordBits.jsx'
import { Chip, IconButton } from '../components/ui.jsx'
import { Search, Close, ArrowRight } from '../components/Icons.jsx'
import { cx } from '../components/ui.jsx'

const SORTED = [...ALL_WORDS].sort((a, b) => a.word.localeCompare(b.word))
const CAP = 120

export function VocabSearchScreen() {
  const navigate = useStore((s) => s.navigate)
  const [q, setQ] = useState('')
  const [level, setLevel] = useState('all')

  const query = q.trim().toLowerCase()
  const results = useMemo(() => {
    return SORTED.filter((w) => {
      if (level !== 'all' && w.level !== level) return false
      if (!query) return true
      return (
        w.word.toLowerCase().includes(query) ||
        w.meaning.toLowerCase().includes(query) ||
        w.meanings.some((m) => m.toLowerCase().includes(query))
      )
    })
  }, [query, level])

  const shown = results.slice(0, CAP)

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader title="単語をさがす" subtitle={`全${ALL_WORDS.length}語から検索`} />

      <div className="px-4">
        {/* 検索ボックス */}
        <div className="flex items-center gap-2 rounded-2xl bg-white px-3 shadow-card ring-1 ring-brand-100 focus-within:ring-2 focus-within:ring-brand-300">
          <Search size={18} className="text-brand-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="英語 / 日本語で検索（例: run, 走る）"
            autoCapitalize="off"
            autoCorrect="off"
            className="h-12 flex-1 bg-transparent font-bold text-ink outline-none placeholder:font-normal placeholder:text-ink/30"
          />
          {q && (
            <IconButton onClick={() => setQ('')} className="h-8 w-8" aria-label="クリア">
              <Close size={16} />
            </IconButton>
          )}
        </div>

        {/* 級フィルタ */}
        <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto pb-1">
          {[{ id: 'all', label: 'すべて', color: '#6366f1' }, ...LEVELS].map((l) => {
            const on = level === l.id
            return (
              <button
                key={l.id}
                onClick={() => setLevel(l.id)}
                className={cx(
                  'shrink-0 rounded-full px-3 py-1.5 text-xs font-extrabold transition-colors',
                  on ? 'text-white' : 'bg-white text-ink/55 ring-1 ring-brand-100',
                )}
                style={on ? { background: l.color } : undefined}
              >
                {l.id === 'all' ? 'すべて' : l.label}
              </button>
            )
          })}
        </div>

        <p className="mt-2 px-1 text-xs font-bold text-ink/40">
          {results.length}件{results.length > CAP && `（先頭${CAP}件を表示）`}
        </p>
      </div>

      {/* 結果リスト */}
      <div className="no-scrollbar mt-1 flex-1 overflow-y-auto px-4 pb-4">
        {shown.length === 0 ? (
          <div className="py-16 text-center font-bold text-ink/40">見つかりませんでした</div>
        ) : (
          <div className="space-y-2">
            {shown.map((w) => {
              const lv = getLevel(w.level)
              return (
                <div key={w.id} className="flex items-center gap-2 rounded-2xl bg-white p-2.5 shadow-sm">
                  <SpeakButton text={w.word} size="sm" />
                  <button onClick={() => navigate('wordDetail', { id: w.id })} className="flex min-w-0 flex-1 items-center gap-2 text-left">
                    <PosBadge pos={w.pos} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-extrabold text-ink">{w.word}</span>
                        <Chip color={lv.color}>{lv.label}</Chip>
                      </div>
                      <div className="truncate text-xs font-bold text-ink/55">{w.meaning}</div>
                    </div>
                    <span className="text-brand-300"><ArrowRight size={16} /></span>
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
