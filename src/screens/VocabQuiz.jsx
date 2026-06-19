import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { buildDeck } from '../lib/session.js'
import { pickDistractors, shuffle } from '../data/vocab.js'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { PosBadge } from '../components/WordBits.jsx'
import { Button, ProgressBar, IconButton } from '../components/ui.jsx'
import { Close, Check, ArrowRight } from '../components/Icons.jsx'
import { cx } from '../components/ui.jsx'

// このクイズ画面の同一性キー（出題ソース・タイトル・問題数）。
// 退避したセッションが「今まさに戻ってきたクイズ」のものかを照合するのに使う。
const sessionKey = (p) =>
  `vocab|${JSON.stringify(p.source ?? { type: 'due' })}|${p.title ?? ''}|${p.size ?? ''}`

export function VocabQuizScreen() {
  const params = useStore((s) => s.params)
  const navigate = useStore((s) => s.navigate)
  const back = useStore((s) => s.back)
  const review = useStore((s) => s.review)
  const saveQuizSession = useStore((s) => s.saveQuizSession)
  const clearQuizSession = useStore((s) => s.clearQuizSession)

  // 語源を見て戻ってきたときだけ復元。退避セッションのキーが一致したら採用。
  const [restore] = useState(() => {
    const s = useStore.getState().quizSession
    return s && s.key === sessionKey(params) ? s : null
  })
  // 取り出したら退避は消費（古いセッションが残って誤復元しないよう必ずクリア）。
  useEffect(() => {
    clearQuizSession()
  }, [clearQuizSession])

  const xpAtStart = useRef(restore ? restore.xpAtStart : useStore.getState().stats.xp)
  const [deck] = useState(() =>
    restore
      ? restore.deck
      : buildDeck(params.source ?? { type: 'due' }, {
          srs: useStore.getState().srs,
          size: params.size ?? (['level', 'battle'].includes(params.source?.type) ? 10 : 20),
        }),
  )
  const [i, setI] = useState(() => (restore ? restore.i : 0))
  const [selected, setSelected] = useState(() => (restore ? restore.selected : null)) // option id か 'unknown'
  const results = useRef(restore ? restore.results : { correct: 0, wrong: 0, unknown: 0, wrongIds: [] })

  const word = deck[i]
  // 選択肢（正解＋誤答2つ）を問題ごとに固定
  const options = useMemo(() => {
    if (!word) return []
    return shuffle([word, ...pickDistractors(word, 2)])
  }, [word?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!deck.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">🧩</div>
        <p className="font-display text-lg font-extrabold text-ink">出題できる単語がありません</p>
        <Button onClick={back}>もどる</Button>
      </div>
    )
  }

  const answered = selected !== null

  const finish = () => {
    const xpGained = useStore.getState().stats.xp - xpAtStart.current
    navigate('sessionResult', {
      title: params.title ?? 'クイズ',
      mode: 'quiz',
      total: deck.length,
      correct: results.current.correct,
      wrong: results.current.wrong + results.current.unknown,
      xpGained,
      reviewIds: results.current.wrongIds.length ? results.current.wrongIds : deck.map((w) => w.id),
      source: params.source,
    })
  }

  const choose = (optId) => {
    if (answered) return
    setSelected(optId)
    if (optId === 'unknown') {
      review(word.id, 'unknown')
      results.current.unknown++
      results.current.wrongIds.push(word.id)
    } else if (optId === word.id) {
      review(word.id, 'correct')
      results.current.correct++
    } else {
      review(word.id, 'wrong')
      results.current.wrong++
      results.current.wrongIds.push(word.id)
    }
  }

  const next = () => {
    if (i + 1 >= deck.length) finish()
    else {
      setI(i + 1)
      setSelected(null)
    }
  }

  const isCorrectPick = answered && selected === word.id

  return (
    <div className="flex h-full flex-col">
      {/* 進捗 */}
      <div className="flex items-center gap-3 px-3 py-3">
        <IconButton onClick={back} aria-label="やめる">
          <Close size={22} />
        </IconButton>
        <div className="flex-1">
          <ProgressBar value={i / deck.length} color="#0ea5e9" />
        </div>
        <span className="w-12 text-right text-sm font-extrabold text-ink/50">
          {i + 1}/{deck.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {/* 出題語 */}
        <div className="mt-2 flex flex-col items-center rounded-[2rem] bg-white p-6 text-center shadow-card">
          <PosBadge pos={word.pos} className="self-start" />
          <h2 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-ink">{word.word}</h2>
          {word.phonetic && <p className="mt-1 text-sm font-bold text-ink/40">{word.phonetic}</p>}
          <div className="mt-3">
            <SpeakButton text={word.word} size="md" />
          </div>
          <p className="mt-4 text-sm font-extrabold text-ink/55">この単語の意味は？</p>
        </div>

        {/* 選択肢 */}
        <div className="mt-4 space-y-2.5">
          {options.map((o) => {
            const correct = o.id === word.id
            const chosen = selected === o.id
            let tone = 'idle'
            if (answered) {
              if (correct) tone = 'correct'
              else if (chosen) tone = 'wrong'
              else tone = 'dim'
            }
            return (
              <button
                key={o.id}
                disabled={answered}
                onClick={() => choose(o.id)}
                className={cx(
                  'flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left font-bold transition-all',
                  tone === 'idle' && 'border-brand-100 bg-white text-ink active:bg-brand-50 active:scale-[0.99]',
                  tone === 'correct' && 'border-emerald-400 bg-correct-soft text-emerald-800',
                  tone === 'wrong' && 'animate-shake border-rose-400 bg-wrong-soft text-rose-800',
                  tone === 'dim' && 'border-transparent bg-paper text-ink/35',
                )}
              >
                <span className="flex-1">{o.meanings?.[0] ?? o.meaning}</span>
                {tone === 'correct' && <Check size={20} className="text-emerald-600" />}
                {tone === 'wrong' && <Close size={18} className="text-rose-500" />}
              </button>
            )
          })}

          {/* わからない */}
          <button
            disabled={answered}
            onClick={() => choose('unknown')}
            className={cx(
              'w-full rounded-2xl border-2 border-dashed px-4 py-3 text-sm font-extrabold transition-all',
              selected === 'unknown'
                ? 'border-amber-400 bg-hint-soft text-amber-800'
                : 'border-ink/15 bg-transparent text-ink/45 active:bg-ink/5',
              answered && selected !== 'unknown' && 'opacity-40',
            )}
          >
            わからない🙈
          </button>
        </div>

        {/* 答え合わせ後 */}
        {answered && (
          <div className="mt-4 animate-slide-up rounded-2xl bg-white p-4 shadow-card">
            <p className={cx('font-display text-lg font-extrabold', isCorrectPick ? 'text-emerald-600' : 'text-rose-500')}>
              {isCorrectPick ? '正解！🎉' : selected === 'unknown' ? '答えはこちら' : 'ざんねん…'}
            </p>
            <p className="mt-1 font-bold text-ink">
              <span className="font-display">{word.word}</span> ＝ {word.meanings.join('・')}
            </p>
            <button
              onClick={() => {
                // 解答済みの状態を退避してから語源詳細へ。戻ると結果画面のまま復元。
                saveQuizSession({
                  key: sessionKey(params),
                  deck,
                  i,
                  selected,
                  results: results.current,
                  xpAtStart: xpAtStart.current,
                })
                navigate('wordDetail', { id: word.id })
              }}
              className="mt-2 inline-flex items-center gap-1 text-sm font-extrabold text-brand-600"
            >
              語源をくわしく見る <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-brand-100 bg-white/90 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur">
        <Button full size="lg" disabled={!answered} onClick={next}>
          {i + 1 >= deck.length ? '結果を見る' : '次へ'} <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  )
}
