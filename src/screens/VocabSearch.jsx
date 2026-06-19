import { useMemo, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { useAuth } from '../store/useAuth.js'
import { ALL_WORDS, SORTED_WORDS } from '../data/vocab.js'
import { LEVELS, getLevel } from '../data/levels.js'
import { requestWord } from '../lib/wordRequests.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { PosBadge } from '../components/WordBits.jsx'
import { Chip, IconButton, Button } from '../components/ui.jsx'
import { Search, Close, ArrowRight } from '../components/Icons.jsx'
import { cx } from '../components/ui.jsx'

// 見つからなかったときの案内＋「この単語をリクエスト」ボタン。
// query が変わると state がリセットされるよう、呼び出し側で key={query} を付ける。
function NoResults({ query, user, onSeeList }) {
  const [phase, setPhase] = useState('idle') // idle | sending | done | error
  const send = async () => {
    setPhase('sending')
    try {
      const ok = await requestWord(query, user)
      setPhase(ok ? 'done' : 'error')
    } catch {
      setPhase('error')
    }
  }
  return (
    <div className="px-6 py-12 text-center">
      <div className="text-4xl">🔍</div>
      <p className="mt-3 font-extrabold text-ink/70">「{query}」は辞書にありません</p>
      {phase === 'done' ? (
        <p className="mt-3 text-sm font-bold text-emerald-600">
          リクエストを送りました📩<br />追加されるまで少しお待ちください。
        </p>
      ) : (
        <>
          <p className="mt-1 text-sm font-bold text-ink/40">
            この単語を辞書に追加してほしいときはリクエストできます。
          </p>
          <div className="mt-4">
            <Button onClick={send} disabled={phase === 'sending'}>
              📩 {phase === 'sending' ? '送信中…' : 'この単語をリクエスト'}
            </Button>
          </div>
          {phase === 'error' && (
            <p className="mt-2 text-xs font-bold text-rose-500">送信できませんでした。通信環境を確認してください。</p>
          )}
        </>
      )}
      <button onClick={onSeeList} className="mt-5 text-xs font-extrabold text-brand-500 underline underline-offset-2">
        みんなのリクエスト一覧を見る
      </button>
    </div>
  )
}

const CAP = 80

// 引いた感じを出すための一致ランク。小さいほど上に出す。
//  0: 見出し語が完全一致 / 1: 見出し語が前方一致 /
//  2: 見出し語に含む       / 3: 意味に含む
function matchRank(w, query) {
  const word = w.word.toLowerCase()
  if (word === query) return 0
  if (word.startsWith(query)) return 1
  if (word.includes(query)) return 2
  if (w.meaning.toLowerCase().includes(query) || w.meanings.some((m) => m.toLowerCase().includes(query))) return 3
  return -1
}

export function VocabSearchScreen() {
  const navigate = useStore((s) => s.navigate)
  const user = useAuth((s) => s.user)
  const [q, setQ] = useState('')
  const [level, setLevel] = useState('all')

  const query = q.trim().toLowerCase()
  const results = useMemo(() => {
    if (!query) return []
    const hits = []
    for (const w of SORTED_WORDS) {
      if (level !== 'all' && w.level !== level) continue
      const rank = matchRank(w, query)
      if (rank >= 0) hits.push({ w, rank })
    }
    // 一致ランク順、同ランク内は辞書順（SORTED_WORDS の順）を維持。
    hits.sort((a, b) => a.rank - b.rank)
    return hits.map((h) => h.w)
  }, [query, level])

  const shown = results.slice(0, CAP)

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader
        title="単語をさがす"
        subtitle={`全${ALL_WORDS.length}語から検索`}
        right={
          <button
            onClick={() => navigate('wordRequests')}
            className="rounded-full px-3 py-1.5 text-xs font-extrabold text-brand-500 ring-1 ring-brand-100 active:bg-brand-50"
          >
            📩 リクエスト
          </button>
        }
      />

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

        {query && (
          <p className="mt-2 px-1 text-xs font-bold text-ink/40">
            {results.length}件{results.length > CAP && `（上位${CAP}件を表示）`}
          </p>
        )}
      </div>

      {/* 結果リスト */}
      <div className="no-scrollbar mt-1 flex-1 overflow-y-auto px-4 pb-4">
        {!query ? (
          <div className="px-6 py-16 text-center">
            <div className="text-4xl">📖</div>
            <p className="mt-3 font-extrabold text-ink/70">調べたい単語を入力</p>
            <p className="mt-1 text-sm font-bold text-ink/40">
              英語でも日本語でも引けます（例: run, 走る）
            </p>
            <p className="mt-1 text-xs font-bold text-ink/30">
              全{ALL_WORDS.length}語 ／ 単語ページで前後の見出し語もめくれます
            </p>
          </div>
        ) : shown.length === 0 ? (
          <NoResults key={query} query={query} user={user} onSeeList={() => navigate('wordRequests')} />
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
