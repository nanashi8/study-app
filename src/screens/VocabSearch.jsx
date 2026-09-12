import { useEffect, useMemo, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { getWord } from '../data/vocab.js'
import { getLevel } from '../data/levels.js'
import {
  requestWord,
  WORD_REQUEST_DEVICE_DAILY_LIMIT,
  WORD_REQUEST_TOTAL_LIMIT,
} from '../lib/wordRequests.js'
import { normalizeVocabQuery } from '../lib/vocabSearch.js'
import {
  DICTIONARY_COUNTS,
  DICTIONARY_TYPE_META,
  searchDictionary,
} from '../lib/dictionary.js'
import { customWordDraftFromQuery, customWordToStudyWord } from '../lib/customWords.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { SyntaxFamilyGuide } from '../components/SyntaxFamilyGuide.jsx'
import { PosBadge } from '../components/WordBits.jsx'
import { WordListSheet } from '../components/WordListSheet.jsx'
import { wordBookVocabIds } from '../lib/wordBooks.js'
import { Chip, IconButton } from '../components/ui.jsx'
import { Search, Close, ArrowRight, Bookmark, BookmarkFilled, Plus } from '../components/Icons.jsx'

// 見つからなかったときの案内。ボタンを押さなくても、その場で自動リクエストする。
// query が変わると state がリセットされるよう、呼び出し側で key={query} を付ける。
//
// 入力の途中（例: goa → goab → goabr）まで送ると、打ちかけの語で受付枠が
// 埋まってしまう。入力が止まってから送るために、少し待ってから1回だけ送る。
const AUTO_REQUEST_DELAY_MS = 1500

const REQUEST_MESSAGE = {
  waiting: { tone: 'text-ink/35', text: '入力が終わると、辞書への追加を自動でリクエストします。' },
  sending: { tone: 'text-ink/45', text: '辞書への追加をリクエストしています…' },
  sent: { tone: 'text-emerald-600', text: 'リクエストを受け付けました📩 追加されるまで少しお待ちください。' },
  already: { tone: 'text-emerald-600', text: 'この単語はすでにリクエスト済みです📩 追加をお待ちください。' },
  full: {
    tone: 'text-amber-600',
    text: `リクエストは全体で${WORD_REQUEST_TOTAL_LIMIT}語まで受け付けます。今はいっぱいなので、追加され次第また送れます。`,
  },
  limit: {
    tone: 'text-amber-600',
    text: `自動リクエストは1台につき1日${WORD_REQUEST_DEVICE_DAILY_LIMIT}語までです。続きは明日また受け付けます。`,
  },
  invalid: { tone: 'text-ink/45', text: '英単語の形ではないため、リクエストは送っていません。' },
  offline: { tone: 'text-rose-500', text: 'いまは送信できませんでした。通信状態が戻るともう一度試せます。' },
}

// 自作単語として登録する入口は、この案内の見出しのすぐ下に children で差し込む。
function NoResults({ query, onSeeList, children }) {
  const [phase, setPhase] = useState('waiting')

  useEffect(() => {
    let alive = true
    setPhase('waiting')
    // 打ちかけの語を送らないよう、入力が止まってから送る。
    // 検索語が変わるとこの要素ごと作り直されるので、待ち時間も数え直す。
    const timer = setTimeout(() => {
      if (!alive) return
      setPhase('sending')
      requestWord(query, { source: 'dictionary-search' })
        .then((result) => {
          if (alive) setPhase(result.status)
        })
        .catch(() => {
          if (alive) setPhase('offline')
        })
    }, AUTO_REQUEST_DELAY_MS)
    return () => {
      alive = false
      clearTimeout(timer)
    }
  }, [query])

  const message = REQUEST_MESSAGE[phase] ?? REQUEST_MESSAGE.offline
  return (
    <div className="px-6 py-12 text-center" data-dictionary-no-results>
      <div className="text-4xl">🔍</div>
      <p className="mt-3 font-extrabold text-ink/70">「{query}」は辞書にありません</p>
      {children}
      <p className="mt-1 text-sm font-bold text-ink/40">
        辞書にない語は、ボタンを押さなくても自動で追加リクエストします。
      </p>
      <p className={`mt-3 text-sm font-bold leading-relaxed ${message.tone}`} role="status">
        {message.text}
      </p>
      <button onClick={onSeeList} className="mt-5 text-xs font-extrabold text-brand-500 underline underline-offset-2">
        リクエストの受付方法を見る
      </button>
    </div>
  )
}

// 辞書の見出しに無い語を、そのまま自作単語の登録欄へ渡す入口。
function RegisterCustomWord({ word, onRegister, className = '' }) {
  return (
    <button
      type="button"
      onClick={onRegister}
      data-dictionary-register-custom
      className={`flex w-full items-center gap-3 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50 px-3 py-2.5 text-left active:bg-amber-100 ${className}`}
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-500 text-white">
        <Plus size={18} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block break-words text-sm font-extrabold text-ink">「{word}」を自作単語に登録</span>
        <span className="block text-[11px] font-bold leading-relaxed text-ink/50">
          意味を入れると、単語帳に入れて暗記・テストできます
        </span>
      </span>
    </button>
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

// 自作単語は辞書の語と見分けられるよう、種類の位置に「自作」と出す。
function CustomBadge() {
  return (
    <span className="shrink-0 rounded-lg bg-amber-500 px-1.5 py-0.5 text-[10px] font-extrabold text-white">
      自作
    </span>
  )
}

// 右端の「単語帳」は、押すと入れる単語帳を選ぶ窓を開く（どの冊に入っていても塗りで示す）。
function WordRow({ word, inBook = false, custom = false, onOpen, onChooseBook }) {
  const level = getLevel(word.level)
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-white p-2.5 shadow-sm" data-dictionary-custom-word={custom ? word.id : undefined}>
      <SpeakButton text={word.word} size="sm" />
      <button onClick={onOpen} className="flex min-w-0 flex-1 items-center gap-2 text-left">
        {custom ? <CustomBadge /> : <KindBadge type="word" />}
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate font-display font-extrabold text-ink">{word.word}</span>
            <Chip color={level.color}>{level.label}</Chip>
          </div>
          <div className="flex min-w-0 items-center gap-1.5">
            <PosBadge pos={word.pos} className="h-5 min-w-5 px-1 text-[10px]" />
            <span className="truncate text-xs font-bold text-ink/55">{word.meaning}</span>
          </div>
        </div>
        <span className="text-brand-300"><ArrowRight size={16} /></span>
      </button>
      <button
        type="button"
        onClick={onChooseBook}
        aria-haspopup="dialog"
        aria-label={inBook ? `${word.word}の単語帳を選ぶ（単語帳に入っています）` : `${word.word}を入れる単語帳を選ぶ`}
        data-dictionary-word-book
        className={`inline-flex min-h-12 shrink-0 items-center gap-1 rounded-xl px-2 text-[10px] font-extrabold ring-1 active:scale-[0.98] ${
          inBook
            ? 'bg-amber-50 text-amber-700 ring-amber-200'
            : 'bg-white text-brand-600 ring-brand-200'
        }`}
      >
        {inBook ? <BookmarkFilled size={14} /> : <Bookmark size={14} />}
        単語帳
      </button>
    </div>
  )
}

// 熟語・構文はその場で開いて意味・例文・解説まで読める（単語詳細に当たる表示）。
function PhraseRow({ phrase, inBook = false, onChooseBook, onStudy }) {
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
              {inBook && (
                <span className="inline-flex shrink-0 items-center gap-0.5 text-[10px] font-extrabold text-amber-600">
                  <BookmarkFilled size={13} /> 単語帳
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
              <p className="text-[11px] font-extrabold text-ink/40">
                {phrase.kind === 'syntax' ? 'この文のポイント' : '成り立ち'}
              </p>
              <p className="text-xs font-bold leading-relaxed text-ink/70">{phrase.origin}</p>
            </div>
          )}
          {phrase.note && (
            <div>
              <p className="text-[11px] font-extrabold text-ink/40">使い方メモ</p>
              <p className="text-xs font-bold leading-relaxed text-ink/70">{phrase.note}</p>
            </div>
          )}
          <SyntaxFamilyGuide item={phrase} />
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={onStudy}
              className="rounded-full px-3 py-1.5 text-xs font-extrabold text-brand-500 ring-1 ring-brand-100 active:bg-brand-50"
            >
              ▶ この項目で学習
            </button>
            <button
              onClick={onChooseBook}
              aria-haspopup="dialog"
              data-dictionary-phrase-word-book
              className="rounded-full px-3 py-1.5 text-xs font-extrabold text-amber-600 ring-1 ring-amber-100 active:bg-amber-50"
            >
              {inBook ? '★ 単語帳に入っています' : '☆ 単語帳に入れる'}
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

const headwordOf = (entry) => (entry.type === 'word' ? entry.word.word : entry.phrase.phrase)

export function VocabSearchScreen() {
  const navigate = useStore((s) => s.navigate)
  const replaceParams = useStore((s) => s.replaceParams)
  const params = useStore((s) => s.params)
  const vocabHistory = useStore((s) => s.vocabHistory)
  const clearVocabHistory = useStore((s) => s.clearVocabHistory)
  const learningNotebook = useStore((s) => s.learningNotebook)
  const customWords = useStore((s) => s.customWords)
  // 語の詳細・学習・自作単語の登録から戻ったときは、引いていた語と種類の絞り込みから続ける。
  const [q, setQ] = useState(() => (typeof params.q === 'string' ? params.q : ''))
  const [type, setType] = useState(() => (TABS.some((tab) => tab.id === params.type) ? params.type : 'all'))
  const [shown, setShown] = useState(PAGE)
  // 単語帳を選ぶ窓を開いている語。
  const [bookWord, setBookWord] = useState(null)
  // 単語帳を選ぶ窓を開いている熟語・構文。
  const [bookPhrase, setBookPhrase] = useState(null)

  const query = normalizeVocabQuery(q)

  // 単語・熟語・構文を1本にまとめ、一致の強い順に検索する。
  const matched = useMemo(() => searchDictionary(query), [query])
  const pool = query ? matched : []
  // 自作単語は辞書に混ぜず、つづりか意味が合う語を検索結果の先頭へ別に並べる。
  const customMatches = useMemo(() => (
    query
      ? customWords
        .map(customWordToStudyWord)
        .filter(Boolean)
        .filter((word) => [word.word, ...word.meanings]
          .some((text) => normalizeVocabQuery(text).includes(query)))
      : []
  ), [customWords, query])
  const shownCustom = type === 'all' || type === 'word' ? customMatches : []
  const counts = useMemo(() => {
    const tally = { all: pool.length + customMatches.length, word: customMatches.length, idiom: 0, syntax: 0 }
    for (const entry of pool) tally[entry.type] += 1
    return tally
  }, [customMatches.length, pool])
  const listed = useMemo(
    () => (type === 'all' ? pool : pool.filter((entry) => entry.type === type)),
    [pool, type],
  )
  // 辞書の見出しにも自作単語にも無い英語なら、自作単語として登録できる。
  const draft = useMemo(
    () => customWordDraftFromQuery(q, { headwords: pool.map(headwordOf), customWords }),
    [customWords, pool, q],
  )
  // 見出しに引いた語を含むものが無ければ入口を先頭に、あれば（入力の途中など）結果の後ろに置く。
  const draftFirst = Boolean(draft)
    && !pool.some((entry) => normalizeVocabQuery(headwordOf(entry)).includes(query))

  // 検索語・絞り込みが変わったら、表示件数は先頭に戻す。
  useEffect(() => {
    setShown(PAGE)
  }, [query, type])

  // 検索を消したときは種類の絞り込みも解く。
  useEffect(() => {
    if (!query) setType('all')
  }, [query])

  const historyWords = useMemo(
    () => vocabHistory.map(getWord).filter(Boolean),
    [vocabHistory],
  )
  // どれかの単語帳に入っている語。
  const inBookIds = useMemo(
    () => new Set(learningNotebook.sets.flatMap((set) => wordBookVocabIds(set))),
    [learningNotebook.sets],
  )

  // 詳細から戻ると履歴の params ごと戻るので、引いていた語をいまの params へ残してから移る。
  const openWord = (word) => {
    replaceParams({ ...params, q, type })
    navigate('wordDetail', { id: word.id })
  }
  const studyPhrase = (phrase) =>
    navigate('phraseStudy', {
      source: { type: 'phraseList', ids: [phrase.id] },
      size: 1,
      title: phrase.kind === 'syntax' ? '構文' : '熟語',
      returnTo: { screen: 'vocabSearch', params: { q, type } },
    })
  // 登録を終えたら（やめても）この画面へ戻り、同じ語を引いた状態から続けられるようにする。
  const registerCustomWord = () =>
    navigate('customWords', {
      draft: { word: draft.word },
      returnTo: { screen: 'vocabSearch', params: { q: draft.word } },
    })

  const renderEntry = (entry) =>
    entry.type === 'word' ? (
      <WordRow
        key={entry.id}
        word={entry.word}
        inBook={inBookIds.has(entry.word.id)}
        onOpen={() => openWord(entry.word)}
        onChooseBook={() => setBookWord(entry.word)}
      />
    ) : (
      <PhraseRow
        key={entry.id}
        phrase={entry.phrase}
        inBook={learningNotebook.sets.some((set) => set.refs.includes(`phrases:${entry.phrase.id}`))}
        onChooseBook={() => setBookPhrase(entry.phrase)}
        onStudy={() => studyPhrase(entry.phrase)}
      />
    )

  const showList = Boolean(query)
  const registerEntry = draft && (
    <RegisterCustomWord word={draft.word} onRegister={registerCustomWord} />
  )

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader
        title="英和辞書"
        subtitle={`単語${DICTIONARY_COUNTS.word}・熟語${DICTIONARY_COUNTS.idiom}・構文${DICTIONARY_COUNTS.syntax}を収録`}
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
                ? `「${q.trim()}」に一致する${listed.length + shownCustom.length}件を、単語・熟語・構文まとめて表示`
                : ''}
            </p>
          </>
        )}
      </div>

      {/* 結果リスト */}
      <div className="no-scrollbar mt-1 flex-1 overflow-y-auto px-4 pb-4">
        {!showList ? (
          <>
            {historyWords.length > 0 ? (
              <section className="pb-2 pt-3">
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
                      custom={Boolean(word.custom)}
                      inBook={inBookIds.has(word.id)}
                      onOpen={() => openWord(word)}
                      onChooseBook={() => setBookWord(word)}
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
                  検索・参照した単語や、単語帳に入れた語はここに残ります
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            {listed.length === 0 && shownCustom.length === 0 ? (
              query && pool.length === 0 && customMatches.length === 0 ? (
                <NoResults
                  key={query}
                  query={query}
                  onSeeList={() => navigate('wordRequests')}
                >
                  {registerEntry && <div className="mb-3 mt-4">{registerEntry}</div>}
                </NoResults>
              ) : (
                <p className="px-6 py-12 text-center text-sm font-bold text-ink/40">
                  この絞り込みでは見つかりませんでした
                </p>
              )
            ) : (
              <div className="space-y-2">
                {draftFirst && registerEntry}
                {shownCustom.length > 0 && (
                  <div className="space-y-2" data-dictionary-custom-words>
                    {shownCustom.map((word) => (
                      <WordRow
                        key={word.id}
                        word={word}
                        custom
                        inBook={inBookIds.has(word.id)}
                        onOpen={() => openWord(word)}
                        onChooseBook={() => setBookWord(word)}
                      />
                    ))}
                  </div>
                )}
                {listed.slice(0, shown).map(renderEntry)}
                {listed.length > shown && (
                  <button
                    onClick={() => setShown(shown + PAGE)}
                    className="w-full rounded-2xl bg-white py-3 text-sm font-extrabold text-brand-500 shadow-sm ring-1 ring-brand-100 active:bg-brand-50"
                  >
                    続きを表示（残り{listed.length - shown}件）
                  </button>
                )}
                {!draftFirst && registerEntry}
              </div>
            )}
          </>
        )}
      </div>

      <WordListSheet
        open={Boolean(bookWord)}
        onClose={() => setBookWord(null)}
        wordId={bookWord?.id}
        wordLabel={bookWord?.word}
      />
      <WordListSheet
        open={Boolean(bookPhrase)}
        onClose={() => setBookPhrase(null)}
        domain="phrases"
        itemId={bookPhrase?.id}
        label={bookPhrase?.phrase}
      />
    </div>
  )
}
