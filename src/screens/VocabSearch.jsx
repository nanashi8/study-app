import { useMemo, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { useAuth } from '../store/useAuth.js'
import { ALL_WORDS, SORTED_WORDS, getWord } from '../data/vocab.js'
import { getLevel } from '../data/levels.js'
import { requestWord } from '../lib/wordRequests.js'
import { normalizeVocabQuery, vocabMatchRank } from '../lib/vocabSearch.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { PosBadge } from '../components/WordBits.jsx'
import { Chip, IconButton, Button } from '../components/ui.jsx'
import { Search, Close, ArrowRight, BookmarkFilled } from '../components/Icons.jsx'

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

function WordRow({ word, saved = false, onOpen }) {
  const level = getLevel(word.level)
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-white p-2.5 shadow-sm">
      <SpeakButton text={word.word} size="sm" />
      <button onClick={onOpen} className="flex min-w-0 flex-1 items-center gap-2 text-left">
        <PosBadge pos={word.pos} />
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate font-display font-extrabold text-ink">{word.word}</span>
            <Chip color={level.color}>{level.label}</Chip>
            {saved && (
              <span className="inline-flex shrink-0 items-center gap-0.5 text-[10px] font-extrabold text-amber-600">
                <BookmarkFilled size={13} /> マイ単語
              </span>
            )}
          </div>
          <div className="truncate text-xs font-bold text-ink/55">{word.meaning}</div>
        </div>
        <span className="text-brand-300"><ArrowRight size={16} /></span>
      </button>
    </div>
  )
}

export function VocabSearchScreen() {
  const navigate = useStore((s) => s.navigate)
  const vocabHistory = useStore((s) => s.vocabHistory)
  const clearVocabHistory = useStore((s) => s.clearVocabHistory)
  const myList = useStore((s) => s.myList)
  const user = useAuth((s) => s.user)
  const [q, setQ] = useState('')

  const query = normalizeVocabQuery(q)
  const results = useMemo(() => {
    if (!query) return []
    const hits = []
    for (const w of SORTED_WORDS) {
      const rank = vocabMatchRank(w, query)
      if (rank >= 0) hits.push({ w, rank })
    }
    // 一致ランク順、同ランク内は辞書順（SORTED_WORDS の順）を維持。
    hits.sort((a, b) => a.rank - b.rank)
    return hits.map((h) => h.w)
  }, [query])
  const historyWords = useMemo(
    () => vocabHistory.map(getWord).filter(Boolean),
    [vocabHistory],
  )
  const savedIds = useMemo(() => new Set(myList), [myList])

  const shown = results.slice(0, CAP)
  const openWord = (word) => navigate('wordDetail', { id: word.id })

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
            placeholder="単語・意味・語法で検索（例: affect, 影響, 余分な前置詞）"
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

        {query && (
          <p className="mt-2 px-1 text-xs font-bold text-ink/40">
            {results.length}件{results.length > CAP && `（上位${CAP}件を表示）`}
          </p>
        )}
      </div>

      {/* 結果リスト */}
      <div className="no-scrollbar mt-1 flex-1 overflow-y-auto px-4 pb-4">
        {!query ? (
          historyWords.length > 0 ? (
            <section className="pb-2 pt-3">
              <div className="mb-3 flex items-start justify-between gap-3 px-1">
                <div>
                  <h2 className="font-display text-base font-extrabold text-ink/80">
                    検索・参照履歴
                  </h2>
                  <p className="mt-0.5 text-xs font-bold leading-relaxed text-ink/40">
                    検索、語源・長文での参照、マイ単語への追加を新しい順に表示
                  </p>
                </div>
                <button
                  onClick={clearVocabHistory}
                  className="shrink-0 rounded-full px-2.5 py-1.5 text-xs font-extrabold text-rose-500 ring-1 ring-rose-100 active:bg-rose-50"
                >
                  全削除
                </button>
              </div>
              <div className="space-y-2">
                {historyWords.map((word) => (
                  <WordRow
                    key={word.id}
                    word={word}
                    saved={savedIds.has(word.id)}
                    onOpen={() => openWord(word)}
                  />
                ))}
              </div>
            </section>
          ) : (
            <div className="px-6 py-16 text-center">
              <div className="text-4xl">📖</div>
              <p className="mt-3 font-extrabold text-ink/70">調べたい単語を入力</p>
              <p className="mt-1 text-sm font-bold text-ink/40">
                単語・日本語・例文・使い分けから引けます
              </p>
              <p className="mt-1 text-xs font-bold text-ink/30">
                検索・参照した単語や、マイ単語に追加した語はここに残ります
              </p>
            </div>
          )
        ) : shown.length === 0 ? (
          <NoResults key={query} query={query} user={user} onSeeList={() => navigate('wordRequests')} />
        ) : (
          <div className="space-y-2">
            {shown.map((word) => (
              <WordRow
                key={word.id}
                word={word}
                saved={savedIds.has(word.id)}
                onOpen={() => openWord(word)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
