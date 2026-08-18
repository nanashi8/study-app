import { useEffect, useMemo, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { useAuth } from '../store/useAuth.js'
import { getWord } from '../data/vocab.js'
import { getLevel } from '../data/levels.js'
import { requestWord } from '../lib/wordRequests.js'
import { normalizeVocabQuery } from '../lib/vocabSearch.js'
import {
  DICTIONARY_COUNTS,
  DICTIONARY_INITIALS,
  DICTIONARY_TYPE_META,
  dictionaryByInitial,
  searchDictionary,
} from '../lib/dictionary.js'
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

// 一度に並べる見出しの数。続きは「もっと見る」で足していく。
const PAGE = 60

// 単語・熟語・構文のどれなのかを、同じ位置・同じ形で示す。
function KindBadge({ type }) {
  const meta = DICTIONARY_TYPE_META[type] ?? DICTIONARY_TYPE_META.word
  return (
    <span
      className="shrink-0 rounded-lg px-1.5 py-0.5 text-[10px] font-extrabold text-white"
      style={{ backgroundColor: meta.color }}
    >
      {meta.label}
    </span>
  )
}

function WordRow({ word, saved = false, onOpen }) {
  const level = getLevel(word.level)
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-white p-2.5 shadow-sm">
      <SpeakButton text={word.word} size="sm" />
      <button onClick={onOpen} className="flex min-w-0 flex-1 items-center gap-2 text-left">
        <KindBadge type="word" />
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
          <div className="flex min-w-0 items-center gap-1.5">
            <PosBadge pos={word.pos} className="h-5 min-w-5 px-1 text-[10px]" />
            <span className="truncate text-xs font-bold text-ink/55">{word.meaning}</span>
          </div>
        </div>
        <span className="text-brand-300"><ArrowRight size={16} /></span>
      </button>
    </div>
  )
}

// 熟語・構文はその場で開いて意味・例文・成り立ちまで読める（単語詳細に当たる表示）。
function PhraseRow({ phrase, saved = false, onToggleSave, onStudy }) {
  const [open, setOpen] = useState(false)
  const level = getLevel(phrase.level)
  const meanings = phrase.meanings?.length ? phrase.meanings : [phrase.meaning]
  return (
    <div className="rounded-2xl bg-white p-2.5 shadow-sm">
      <div className="flex items-center gap-2">
        <SpeakButton text={phrase.phrase} size="sm" />
        <button onClick={() => setOpen(!open)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
          <KindBadge type={phrase.kind} />
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
  { id: 'idiom', label: '熟語' },
  { id: 'syntax', label: '構文' },
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
  const [type, setType] = useState('all')
  const [letter, setLetter] = useState(null)
  const [shown, setShown] = useState(PAGE)

  const query = normalizeVocabQuery(q)

  // 単語・熟語・構文を1本にまとめた見出しの並び。
  // 検索中は一致の強い順、頭文字から引くときは辞書と同じABC順。
  const matched = useMemo(() => searchDictionary(query), [query])
  const browsed = useMemo(() => (letter ? dictionaryByInitial(letter) : []), [letter])
  const pool = query ? matched : browsed
  const counts = useMemo(() => {
    const tally = { all: pool.length, word: 0, idiom: 0, syntax: 0 }
    for (const entry of pool) tally[entry.type] += 1
    return tally
  }, [pool])
  const listed = useMemo(
    () => (type === 'all' ? pool : pool.filter((entry) => entry.type === type)),
    [pool, type],
  )

  // 検索語・絞り込み・頭文字が変わったら、表示件数は先頭に戻す。
  useEffect(() => {
    setShown(PAGE)
  }, [query, type, letter])

  // ABC一覧へ戻ったときは種類の絞り込みも解く。
  // 絞り込んだままだと、頭文字に出ている件数と開いた中身が食い違う。
  useEffect(() => {
    if (!query && !letter) setType('all')
  }, [query, letter])

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

  const renderEntry = (entry) =>
    entry.type === 'word' ? (
      <WordRow
        key={entry.id}
        word={entry.word}
        saved={savedIds.has(entry.word.id)}
        onOpen={() => openWord(entry.word)}
      />
    ) : (
      <PhraseRow
        key={entry.id}
        phrase={entry.phrase}
        saved={learningNotebook?.entries?.[`phrases:${entry.phrase.id}`]?.saved === true}
        onToggleSave={() => toggleNotebookItem('phrases', entry.phrase.id)}
        onStudy={() => studyPhrase(entry.phrase)}
      />
    )

  const showList = Boolean(query) || Boolean(letter)

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader
        title="英和辞書"
        subtitle={`単語${DICTIONARY_COUNTS.word}・熟語${DICTIONARY_COUNTS.idiom}・構文${DICTIONARY_COUNTS.syntax}をABC順に収録`}
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
            placeholder="単語・熟語・構文・意味で検索（例: go, go ahead, 影響）"
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

        {showList && (
          <>
            <div className="mt-2 flex gap-1.5">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setType(t.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-extrabold ${
                    type === t.id
                      ? 'bg-brand-500 text-white'
                      : 'bg-white text-ink/50 ring-1 ring-brand-100'
                  }`}
                >
                  {t.label} {counts[t.id]}
                </button>
              ))}
            </div>
            <p className="mt-2 px-1 text-xs font-bold text-ink/40">
              {query
                ? `「${q.trim()}」に一致する${listed.length}件を、単語・熟語・構文まとめてABC順に表示`
                : `${letter}で始まる${listed.length}件を、単語・熟語・構文まとめてABC順に表示`}
            </p>
          </>
        )}
      </div>

      {/* 結果リスト */}
      <div className="no-scrollbar mt-1 flex-1 overflow-y-auto px-4 pb-4">
        {!showList ? (
          <>
            <section className="pb-1 pt-3">
              <div className="px-1">
                <h2 className="font-display text-base font-extrabold text-ink/80">ABCから引く</h2>
                <p className="mt-0.5 text-xs font-bold leading-relaxed text-ink/40">
                  単語も熟語も構文も、紙の辞書と同じ並び（go → go abroad → go ahead）で見られます
                </p>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {DICTIONARY_INITIALS.map(({ letter: initial, count }) => (
                  <button
                    key={initial}
                    onClick={() => setLetter(initial)}
                    className="min-w-11 rounded-xl bg-white px-2 py-1.5 text-center shadow-sm ring-1 ring-brand-100 active:bg-brand-50"
                  >
                    <span className="block font-display text-sm font-extrabold text-ink">{initial}</span>
                    <span className="block text-[10px] font-bold text-ink/35">{count}</span>
                  </button>
                ))}
              </div>
            </section>

            {historyWords.length > 0 ? (
              <section className="pb-2 pt-5">
                <div className="mb-3 flex items-start justify-between gap-3 px-1">
                  <div>
                    <h2 className="font-display text-base font-extrabold text-ink/80">
                      検索・参照履歴
                    </h2>
                    <p className="mt-0.5 text-xs font-bold leading-relaxed text-ink/40">
                      検索、参照を新しい順に表示
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
              <div className="px-6 py-10 text-center">
                <div className="text-4xl">📖</div>
                <p className="mt-3 font-extrabold text-ink/70">調べたい語を入力</p>
                <p className="mt-1 text-sm font-bold text-ink/40">
                  単語も熟語・構文も、日本語・例文・使い分けから引けます
                </p>
                <p className="mt-1 text-xs font-bold text-ink/30">
                  検索・参照した単語や、マイ単語に追加した語はここに残ります
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            {letter && !query && (
              <div className="flex items-center justify-between gap-3 px-1 pb-2 pt-3">
                <h2 className="font-display text-lg font-extrabold text-ink/80">{letter}</h2>
                <button
                  onClick={() => setLetter(null)}
                  className="rounded-full px-2.5 py-1.5 text-xs font-extrabold text-ink/50 ring-1 ring-brand-100 active:bg-brand-50"
                >
                  ABC一覧へ戻る
                </button>
              </div>
            )}
            {listed.length === 0 ? (
              query ? (
                <NoResults
                  key={query}
                  query={query}
                  user={user}
                  onSeeList={() => navigate('wordRequests')}
                  onLogin={() => navigate('login')}
                />
              ) : (
                <p className="px-6 py-12 text-center text-sm font-bold text-ink/40">
                  この絞り込みでは見つかりませんでした
                </p>
              )
            ) : (
              <div className="space-y-2">
                {listed.slice(0, shown).map(renderEntry)}
                {listed.length > shown && (
                  <button
                    onClick={() => setShown(shown + PAGE)}
                    className="w-full rounded-2xl bg-white py-3 text-sm font-extrabold text-brand-500 shadow-sm ring-1 ring-brand-100 active:bg-brand-50"
                  >
                    続きを表示（残り{listed.length - shown}件）
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
