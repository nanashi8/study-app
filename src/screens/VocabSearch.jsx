import { useMemo, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { useAuth } from '../store/useAuth.js'
import { ALL_WORDS, SORTED_WORDS, getWord } from '../data/vocab.js'
import { PHRASES } from '../data/phrases.js'
import { getLevel } from '../data/levels.js'
import { requestWord } from '../lib/wordRequests.js'
import { normalizeVocabQuery, vocabMatchRank, phraseMatchRank } from '../lib/vocabSearch.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { PosBadge } from '../components/WordBits.jsx'
import { Chip, IconButton, Button } from '../components/ui.jsx'
import { Search, Close, ArrowRight, BookmarkFilled } from '../components/Icons.jsx'

// 見つからなかったときの案内＋「この単語をリクエスト」ボタン。
// query が変わると state がリセットされるよう、呼び出し側で key={query} を付ける。
function NoResults({ query, user, onSeeList, onLogin }) {
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
          {user ? (
            <>
              <p className="mt-1 text-sm font-bold text-ink/40">
                この語・熟語を辞書に追加してほしいときはリクエストできます。
              </p>
              <div className="mt-4">
                <Button onClick={send} disabled={phase === 'sending'}>
                  📩 {phase === 'sending' ? '送信中…' : 'この単語をリクエスト'}
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="mt-2 text-sm font-bold text-ink/45">
                公開投稿の悪用を防ぐため、リクエスト送信にはログインが必要です。
              </p>
              <div className="mt-4">
                <Button onClick={onLogin}>ログイン画面へ</Button>
              </div>
            </>
          )}
          {phase === 'error' && (
            <p className="mt-2 text-xs font-bold text-rose-500">送信できませんでした。通信環境を確認してください。</p>
          )}
        </>
      )}
      <button onClick={onSeeList} className="mt-5 text-xs font-extrabold text-brand-500 underline underline-offset-2">
        リクエストの公開範囲を確認
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


const PHRASE_KIND_LABEL = {
  idiom: { label: '熟語', color: '#0ea5e9' },
  syntax: { label: '構文', color: '#8b5cf6' },
}

// 熟語・構文はその場で開いて意味・例文・成り立ちまで読める（単語詳細に当たる表示）。
function PhraseRow({ phrase, saved = false, onToggleSave, onStudy }) {
  const [open, setOpen] = useState(false)
  const level = getLevel(phrase.level)
  const kind = PHRASE_KIND_LABEL[phrase.kind] ?? PHRASE_KIND_LABEL.idiom
  const meanings = phrase.meanings?.length ? phrase.meanings : [phrase.meaning]
  return (
    <div className="rounded-2xl bg-white p-2.5 shadow-sm">
      <div className="flex items-center gap-2">
        <SpeakButton text={phrase.phrase} size="sm" />
        <button onClick={() => setOpen(!open)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
          <span
            className="shrink-0 rounded-lg px-1.5 py-0.5 text-[10px] font-extrabold text-white"
            style={{ backgroundColor: kind.color }}
          >
            {kind.label}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <span className="truncate font-display font-extrabold text-ink">{phrase.phrase}</span>
              <Chip color={level.color}>{level.label}</Chip>
              {saved && (
                <span className="inline-flex shrink-0 items-center gap-0.5 text-[10px] font-extrabold text-amber-600">
                  <BookmarkFilled size={13} /> ノート
                </span>
              )}
            </div>
            <div className="truncate text-xs font-bold text-ink/55">{phrase.meaning}</div>
          </div>
          <span className="text-brand-300">{open ? '▲' : '▼'}</span>
        </button>
      </div>

      {open && (
        <div className="mt-2 space-y-2 border-t border-brand-50 pt-2 text-sm">
          <div>
            <p className="text-[11px] font-extrabold text-ink/40">意味</p>
            <p className="font-bold text-ink">{meanings.join('／')}</p>
          </div>
          {phrase.example && (
            <div>
              <p className="text-[11px] font-extrabold text-ink/40">例文</p>
              <div className="flex items-start gap-2">
                <SpeakButton text={phrase.example.en} size="sm" />
                <div className="min-w-0">
                  <p className="font-bold text-ink">{phrase.example.en}</p>
                  <p className="text-xs font-bold text-ink/55">{phrase.example.ja}</p>
                </div>
              </div>
            </div>
          )}
          {phrase.origin && (
            <div>
              <p className="text-[11px] font-extrabold text-ink/40">成り立ち</p>
              <p className="text-xs font-bold leading-relaxed text-ink/70">{phrase.origin}</p>
            </div>
          )}
          {phrase.note && (
            <div>
              <p className="text-[11px] font-extrabold text-ink/40">使い方メモ</p>
              <p className="text-xs font-bold leading-relaxed text-ink/70">{phrase.note}</p>
            </div>
          )}
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={onStudy}
              className="rounded-full px-3 py-1.5 text-xs font-extrabold text-brand-500 ring-1 ring-brand-100 active:bg-brand-50"
            >
              ▶ この項目で学習
            </button>
            <button
              onClick={onToggleSave}
              className="rounded-full px-3 py-1.5 text-xs font-extrabold text-amber-600 ring-1 ring-amber-100 active:bg-amber-50"
            >
              {saved ? '★ ノートから外す' : '☆ マイ学習ノートへ'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const TABS = [
  { id: 'all', label: 'すべて' },
  { id: 'word', label: '単語' },
  { id: 'phrase', label: '熟語・構文' },
]

export function VocabSearchScreen() {
  const navigate = useStore((s) => s.navigate)
  const vocabHistory = useStore((s) => s.vocabHistory)
  const clearVocabHistory = useStore((s) => s.clearVocabHistory)
  const myList = useStore((s) => s.myList)
  const user = useAuth((s) => s.user)
  const learningNotebook = useStore((s) => s.learningNotebook)
  const toggleNotebookItem = useStore((s) => s.toggleNotebookItem)
  const [q, setQ] = useState('')
  const [tab, setTab] = useState('all')

  const query = normalizeVocabQuery(q)
  const wordResults = useMemo(() => {
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
  // 熟語・構文も同じ検索欄から引ける（見出し・意味・例文・成り立ち・注意が対象）。
  const phraseResults = useMemo(() => {
    if (!query) return []
    const hits = []
    for (const p of PHRASES) {
      const rank = phraseMatchRank(p, query)
      if (rank >= 0) hits.push({ p, rank })
    }
    hits.sort((a, b) => a.rank - b.rank)
    return hits.map((h) => h.p)
  }, [query])
  const totalCount = wordResults.length + phraseResults.length
  const shownWords = tab === 'phrase' ? [] : wordResults.slice(0, CAP)
  const shownPhrases = tab === 'word' ? [] : phraseResults.slice(0, CAP)
  const historyWords = useMemo(
    () => vocabHistory.map(getWord).filter(Boolean),
    [vocabHistory],
  )
  const savedIds = useMemo(() => new Set(myList), [myList])

  const openWord = (word) => navigate('wordDetail', { id: word.id })
  const studyPhrase = (phrase) =>
    navigate('phraseStudy', {
      source: { type: 'phraseList', ids: [phrase.id] },
      size: 1,
      title: phrase.kind === 'syntax' ? '構文' : '熟語',
    })

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader
        title="単語をさがす"
        subtitle={`単語${ALL_WORDS.length}語＋熟語・構文${PHRASES.length}項目から検索`}
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
            placeholder="単語・熟語・構文・意味で検索（例: affect, look at, 影響）"
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
          <>
            <div className="mt-2 flex gap-1.5">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-extrabold ${
                    tab === t.id
                      ? 'bg-brand-500 text-white'
                      : 'bg-white text-ink/50 ring-1 ring-brand-100'
                  }`}
                >
                  {t.label}
                  {t.id === 'word' && ` ${wordResults.length}`}
                  {t.id === 'phrase' && ` ${phraseResults.length}`}
                </button>
              ))}
            </div>
            <p className="mt-2 px-1 text-xs font-bold text-ink/40">
              単語{wordResults.length}件・熟語構文{phraseResults.length}件
              {(wordResults.length > CAP || phraseResults.length > CAP) && `（各上位${CAP}件を表示）`}
            </p>
          </>
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
                単語も熟語・構文も、日本語・例文・使い分けから引けます
              </p>
              <p className="mt-1 text-xs font-bold text-ink/30">
                検索・参照した単語や、マイ単語に追加した語はここに残ります
              </p>
            </div>
          )
        ) : totalCount === 0 ? (
          <NoResults
            key={query}
            query={query}
            user={user}
            onSeeList={() => navigate('wordRequests')}
            onLogin={() => navigate('login')}
          />
        ) : (
          <div className="space-y-2">
            {shownWords.map((word) => (
              <WordRow
                key={word.id}
                word={word}
                saved={savedIds.has(word.id)}
                onOpen={() => openWord(word)}
              />
            ))}
            {shownPhrases.length > 0 && shownWords.length > 0 && (
              <p className="px-1 pt-2 text-xs font-extrabold text-ink/40">熟語・構文</p>
            )}
            {shownPhrases.map((phrase) => (
              <PhraseRow
                key={phrase.id}
                phrase={phrase}
                saved={learningNotebook?.entries?.[`phrases:${phrase.id}`]?.saved === true}
                onToggleSave={() => toggleNotebookItem('phrases', phrase.id)}
                onStudy={() => studyPhrase(phrase)}
              />
            ))}
            {shownWords.length === 0 && shownPhrases.length === 0 && (
              <p className="px-6 py-12 text-center text-sm font-bold text-ink/40">
                この絞り込みでは見つかりませんでした
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
