import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { etymologyCardsForWord, etymologyStoryForWord } from '../data/vocab.js'
import { getLevel } from '../data/levels.js'
import {
  answeredSessionIndexes,
  buildDeck,
  growDeck,
  isAutomaticVocabularySource,
  recordStudyAnswer,
  restartSessionCount,
  vocabularyStockCount,
} from '../lib/session.js'
import { vocabMixEmptyNotice, vocabMixFreshShare } from '../lib/vocabMix.js'
import { phraseGroupsForWord } from '../lib/wordPhrases.js'
import { playSpeechItems } from '../lib/speech-player.js'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { RevealAnswersToggle } from '../components/RevealAnswers.jsx'
import { EtymologyBlock } from '../components/WordBits.jsx'
import { OtherSenses, PosBadge } from '../components/WordBits.jsx'
import { Button, Chip } from '../components/ui.jsx'
import { ArrowRight, Lightbulb } from '../components/Icons.jsx'
import { SessionCounter, useCarriedAnswers, useSessionSize } from '../components/SessionSize.jsx'
import { VocabReviewHistory } from '../components/VocabReviewHistory.jsx'
import { CardSaveToggle, CardStudyFooter, CardSwipeRegion } from '../components/CardStudyControls.jsx'
import { WordListSheet, useWordInAnyBook } from '../components/WordListSheet.jsx'
import {
  nextUnansweredSessionIndex,
  QuestionSessionControls,
  useIndexedSessionState,
} from '../components/QuestionSessionControls.jsx'

const sessionKey = (params) => (
  `vocab-study|${JSON.stringify(params.source ?? { type: 'due' })}|${params.title ?? ''}|${params.size ?? ''}`
)

export function VocabStudyScreen() {
  const params = useStore((s) => s.params)
  const navigate = useStore((s) => s.navigate)
  const returnTo = useStore((s) => s.returnTo)
  const review = useStore((s) => s.review)
  const settings = useStore((s) => s.settings)
  const saveQuizSession = useStore((s) => s.saveQuizSession)
  const clearQuizSession = useStore((s) => s.clearQuizSession)

  // 暗記モード：ONなら毎カード、タップせず最初から意味・語源を開いて見せる。
  const revealAll = settings.revealAnswers

  const source = params.source ?? { type: 'due' }

  // コンテンツ画面の「戻る」は履歴でなく、単語の種類を選ぶ画面（元の階層）へ。
  const backToVocabParent = () => {
    if (params.returnTo?.screen) {
      returnTo(params.returnTo.screen, params.returnTo.params ?? {})
      return
    }
    if (source?.type === 'field') {
      returnTo('vocabGroups')
      return
    }
    if (source?.type === 'levelField') {
      returnTo('vocabDecks', { levelId: source.levelId })
      return
    }
    returnTo('vocabLevels')
  }

  const [restore] = useState(() => {
    const saved = useStore.getState().quizSession
    return saved && saved.key === sessionKey(params) ? saved : null
  })
  useEffect(() => clearQuizSession(), [clearQuizSession])

  const srsAtStart = useRef(useStore.getState().srs)
  // size=0 は「絞り込みなし」。在庫数を数えて、問題数の選択肢を実態に合わせる。
  const buildFor = (size) =>
    buildDeck(source, {
      srs: srsAtStart.current,
      size,
      purpose: 'study',
      cycleIds: params.vocabCycleIds,
      freshShareOverride: vocabMixFreshShare(useStore.getState().settings.vocabMix),
    })
  // 「1回のカード数」で選べる上限は、今日の候補ではなく教材の在庫。
  // 今日ぶんを終えかけた級でも、5〜200枚とすべてを選べる状態を保つ。
  const [poolSize] = useState(() => vocabularyStockCount(source, {
    srs: srsAtStart.current,
    purpose: 'study',
    cycleIds: params.vocabCycleIds,
  }))
  const sessionSize = useSessionSize(poolSize || Infinity)
  const [deck, setDeck] = useState(() => (
    restore?.deck ?? buildFor(params.size ?? sessionSize)
  ))
  const [i, setI] = useState(restore?.i ?? 0)
  const [flipped, setFlipped] = useState(restore?.flipped ?? revealAll)
  const [listSheetOpen, setListSheetOpen] = useState(false)
  const {
    value: recordedAnswer,
    setValue: setRecordedAnswer,
    clear: clearRecordedAnswers,
    values: recordedAnswers,
  } = useIndexedSessionState(i, null, restore?.ratings ?? {})
  const results = useRef(restore
    ? {
        ...restore.results,
        forgotIds: [...(restore.results?.forgotIds ?? [])],
      }
    : { remembered: 0, forgot: 0, forgotIds: [] })
  // 1回のカード数を減らして数え直す前に答えたカード。結果の「今回学んだ語」に含める。
  const carried = useCarriedAnswers(restore?.carried)
  const beforeBoxesAtStart = useRef(
    restore?.beforeBoxes
    ?? Object.fromEntries(deck.map((item) => [
      item.id,
      Number.isFinite(srsAtStart.current[item.id]?.box)
        ? srsAtStart.current[item.id].box
        : null,
    ])),
  )
  const rememberBoxesAtStart = (items) => {
    for (const item of items) {
      if (!Object.hasOwn(beforeBoxesAtStart.current, item.id)) {
        beforeBoxesAtStart.current[item.id] = Number.isFinite(srsAtStart.current[item.id]?.box)
          ? srsAtStart.current[item.id].box
          : null
      }
    }
  }

  // 出題バランスのバーを動かしたら、まだ答えていない先のカードをその割合で組み直す。
  // いま見ているカードと答えたカードはそのまま残す（次の回まで待たせない）。
  const appliedVocabMix = useRef(settings.vocabMix)
  useEffect(() => {
    if (appliedVocabMix.current === settings.vocabMix) return
    appliedVocabMix.current = settings.vocabMix
    if (!isAutomaticVocabularySource(source)) return
    const size = params.size ?? sessionSize
    const answeredIndexes = answeredSessionIndexes(recordedAnswers)
    setDeck((current) => {
      const keepCount = current.length
        ? Math.max(i + 1, ...answeredIndexes.map((index) => index + 1))
        : 0
      const nextDeck = growDeck(current, keepCount, buildFor(size), Math.max(size, keepCount))
      rememberBoxesAtStart(nextDeck)
      return nextDeck
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.vocabMix])
  const word = deck[i]
  const entry = useStore((state) => (word ? state.srs[word.id] : null))
  const inWordBook = useWordInAnyBook(word?.id)
  // その語を含む熟語・構文は全部見せる（数を絞ると使い方が抜ける）。
  const relatedPhrases = useMemo(() => phraseGroupsForWord(word), [word?.id])

  // カードが変わるたび自動で読み上げ
  useEffect(() => {
    if (word && settings.autoSpeak) {
      playSpeechItems([
        { text: word.word, label: word.word, style: 'word' },
        ...(word.example
          ? [{ text: word.example.en, label: word.example.en, style: 'sentence' }]
          : []),
      ], {
        title: '単語カード',
        rate: settings.ttsRate,
        voiceURI: settings.ttsVoiceURI,
        japaneseVoiceURI: settings.ttsJapaneseVoiceURI,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, word?.id])

  if (!deck.length) {
    // 「未修だけ」「復習だけ」で出せる語がないときは、そう選んでいることと続け方を示す。
    const mixNotice = isAutomaticVocabularySource(source) ? vocabMixEmptyNotice(settings.vocabMix) : null
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center" data-vocab-empty-deck>
        <div className="text-5xl">🌳</div>
        <p className="font-display text-lg font-extrabold text-ink">
          {mixNotice?.title ?? '学習できる単語がありません'}
        </p>
        <p className="text-sm font-bold text-ink/50">
          {mixNotice?.detail ?? 'この条件では対象の単語が見つかりませんでした。'}
        </p>
        <Button onClick={backToVocabParent}>戻る</Button>
      </div>
    )
  }

  const answeredIndexes = answeredSessionIndexes(recordedAnswers)
  // 結果として送るのは、実際に答えたカードだけ。途中で枚数を変えてデッキが
  // 組み直されても、まだ見ていない語を「学んだ語」に混ぜない。
  const answeredWordIds = (answers) => (
    Object.keys(answers)
      .map(Number)
      .filter(Number.isInteger)
      .sort((a, b) => a - b)
      .map((index) => deck[index]?.id)
      .filter(Boolean)
  )

  const finish = (answers = recordedAnswers) => {
    const completedAt = Date.now()
    const wordIds = [...carried.ids, ...answeredWordIds(answers)]
    navigate('sessionResult', {
      title: params.title ?? '単語学習',
      mode: 'study',
      total: wordIds.length,
      correct: results.current.remembered,
      wrong: results.current.forgot,
      reviewIds: results.current.forgotIds,
      source,
      size: params.size,
      continueTo: params.continueTo,
      returnTo: params.returnTo,
      vocabSession: {
        cycleIds: params.vocabCycleIds,
        wordIds,
        beforeBoxes: Object.fromEntries(
          wordIds.map((id) => [
            id,
            Object.hasOwn(beforeBoxesAtStart.current, id)
              ? beforeBoxesAtStart.current[id]
              : Number.isFinite(srsAtStart.current[id]?.box)
                ? srsAtStart.current[id].box
                : null,
          ]),
        ),
        completedAt,
      },
    })
  }

  const answer = (remembered) => {
    if (recordedAnswer !== null) return
    review(word.id, remembered ? 'remembered' : 'forgot', 'vocab')
    results.current = recordStudyAnswer(results.current, word.id, remembered)
    const nextAnswers = { ...recordedAnswers, [i]: remembered }
    setRecordedAnswer(remembered)
    if (Object.keys(nextAnswers).length >= deck.length) finish(nextAnswers)
    else moveToCard(nextUnansweredSessionIndex(i, deck.length, nextAnswers), nextAnswers)
  }

  const moveToCard = (nextIndex, answers = recordedAnswers) => {
    setI(nextIndex)
    setFlipped(revealAll || Object.hasOwn(answers, nextIndex))
  }

  const level = getLevel(word.level)
  const wordSpeechItems = [
    { text: word.word, label: word.word, style: 'word' },
    ...(word.example
      ? [{ text: word.example.en, label: word.example.en, style: 'sentence' }]
      : []),
  ]

  const saveBeforeReference = (screen, referenceParams) => {
    saveQuizSession({
      key: sessionKey(params),
      deck,
      i,
      flipped,
      ratings: { ...recordedAnswers },
      carried: carried.snapshot(),
      beforeBoxes: { ...beforeBoxesAtStart.current },
      results: {
        ...results.current,
        forgotIds: [...results.current.forgotIds],
      },
    })
    navigate(screen, referenceParams)
  }

  return (
    <div className="flex h-full flex-col">
      <QuestionSessionControls
        index={i}
        total={deck.length}
        onPrevious={() => moveToCard(Math.max(0, i - 1))}
        onNext={() => moveToCard(Math.min(deck.length - 1, i + 1))}
        nextDisabled={i + 1 >= deck.length}
        itemLabel="カード"
        progressColor="var(--color-brand-500)"
        progressControl={(
          <SessionCounter
            index={i}
            total={deck.length}
            max={poolSize}
            label="カード"
            className="h-11 w-full min-w-0 px-0 text-center text-xs no-underline"
            reached={Math.max(i, answeredIndexes.at(-1) ?? 0)}
            onResize={(size, { restart }) => {
              if (restart) {
                // 答えたカードの記録と結果は残したまま、まだ答えていないカードを1枚目として数え直す。
                const next = restartSessionCount(deck, answeredIndexes, i, buildFor(size + deck.length), size)
                carried.carry(next.answeredItems)
                rememberBoxesAtStart(next.deck)
                setDeck(next.deck)
                clearRecordedAnswers()
                moveToCard(0, {})
              } else {
                setDeck((current) => {
                  const nextDeck = growDeck(current, Math.max(i, answeredIndexes.at(-1) ?? 0) + 1, buildFor(size), size)
                  rememberBoxesAtStart(nextDeck)
                  return nextDeck
                })
              }
            }}
          />
        )}
        trailingActions={(
          <>
            <RevealAnswersToggle
              label="意味"
              toolbar
              onChange={(on) => setFlipped(on)}
            />
            {/* 保存先はマイ単語を含む「単語帳」1つ。押すと入れる冊を選ぶ。 */}
            <CardSaveToggle
              saved={inWordBook}
              onToggle={() => setListSheetOpen(true)}
              label="単語帳"
              savedLabel={`${word.word}の単語帳を選ぶ（単語帳に入っています）`}
              unsavedLabel={`${word.word}を入れる単語帳を選ぶ`}
              aria-pressed={undefined}
              aria-haspopup="dialog"
              data-vocab-word-book-toggle
            />
          </>
        )}
      />

      {/* カード */}
      <CardSwipeRegion
        index={i}
        total={deck.length}
        onIndexChange={moveToCard}
        className="flex-1 overflow-y-auto px-4 pb-4"
      >
        <div
          key={word.id}
          onClick={() => !flipped && setFlipped(true)}
          className="animate-pop-in rounded-[2rem] bg-white p-6 shadow-card"
        >
          {/* 表：単語（左上に英検の級、右上に品詞） */}
          <div className="flex items-start justify-between gap-2" data-vocab-card-level>
            <Chip color={level.color}>英検{level.label}</Chip>
            <PosBadge pos={word.pos} />
          </div>

          <div className="mt-2 flex flex-col items-center text-center">
            <h2 className="font-display text-4xl font-extrabold tracking-tight text-ink">{word.word}</h2>
            {settings.showPhonetic && word.phonetic && (
              <p className="mt-1 text-sm font-bold text-ink/45">{word.phonetic}</p>
            )}
            <div className="mt-3">
              <SpeakButton
                text={word.word}
                phrases={wordSpeechItems}
                phraseIndex={0}
                title="単語カード"
                size="lg"
              />
            </div>
            <VocabReviewHistory entry={entry} className="mt-2" />
          </div>

          {!flipped ? (
            <div className="mt-6 flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-brand-200 py-8 text-brand-400">
              <span className="text-sm font-extrabold">タップして意味と語源を見る</span>
              <ArrowRight size={20} className="rotate-90" />
            </div>
          ) : (
            <div className="mt-5 space-y-4 animate-slide-up">
              {/* 意味 */}
              <div className="rounded-2xl bg-brand-50 p-4">
                <div className="text-xs font-extrabold text-brand-500">意味</div>
                <div className="mt-0.5 font-display text-xl font-extrabold text-ink">
                  {word.meanings.join('・')}
                </div>
              </div>

              {/* 代表義以外の意味。取り違えないよう品詞と習う級を添えて並べる。 */}
              <OtherSenses senses={word.otherSenses} level={word.level} />

              {/* 例文 */}
              {word.example && (
                <div className="rounded-2xl bg-white p-3 ring-1 ring-brand-100">
                  <div className="flex items-start gap-2">
                    <SpeakButton
                      text={word.example.en}
                      phrases={wordSpeechItems}
                      phraseIndex={1}
                      title="単語カード"
                      size="sm"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-ink">{word.example.en}</p>
                      <p className="mt-0.5 text-sm font-bold text-ink/55">{word.example.ja}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 手動監査を通った語源だけを表示する。語根カードが無い語も成り立ちは出す。 */}
              {(etymologyCardsForWord(word).length > 0 || etymologyStoryForWord(word)) && (
                <div className="rounded-2xl bg-white p-4 ring-1 ring-brand-100">
                  <div className="mb-2 flex items-center gap-1.5 text-brand-600">
                    <Lightbulb size={16} />
                    <span className="text-xs font-extrabold">語源</span>
                  </div>
                  <EtymologyBlock
                    word={word}
                    onRoot={(rootId) => saveBeforeReference('rootDetail', { rootId })}
                  />
                </div>
              )}

              {relatedPhrases.all.length > 0 && (
                <div className="rounded-2xl bg-white p-4 ring-1 ring-sky-100" data-word-phrases>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs font-extrabold text-sky-700">
                      {word.word} を含む熟語・構文
                    </span>
                    <span className="text-[11px] font-bold text-ink/40">
                      全{relatedPhrases.all.length}項目
                    </span>
                  </div>
                  <ul className="mt-2 space-y-1.5">
                    {relatedPhrases.all.map((phrase) => (
                      <li key={phrase.id} className="flex items-start gap-2">
                        <span
                          className="mt-0.5 shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-extrabold text-white"
                          style={{ backgroundColor: phrase.kind === 'syntax' ? '#8b5cf6' : '#0ea5e9' }}
                        >
                          {phrase.kind === 'syntax' ? '構文' : '熟語'}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-display text-sm font-extrabold leading-snug text-ink">
                            {phrase.phrase}
                          </p>
                          <p className="text-xs font-bold leading-relaxed text-ink/55">{phrase.meaning}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => saveBeforeReference('wordDetail', { id: word.id })}
                className="flex w-full items-center justify-center gap-1.5 rounded-2xl bg-brand-100 py-3 text-sm font-extrabold text-brand-700 active:bg-brand-200"
              >
                辞書ページで関連語も見る
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </CardSwipeRegion>

      {/* フッター操作 */}
      <CardStudyFooter className="vocab-study-actions border-brand-100" data-vocab-study-actions>
        {recordedAnswer !== null ? (
          <Button full size="lg" variant={recordedAnswer ? 'success' : 'danger'} disabled>
            {recordedAnswer ? '覚えた' : 'まだ'}（回答済み）
          </Button>
        ) : !flipped ? (
          <Button full size="lg" onClick={() => setFlipped(true)}>
            答えを見る
          </Button>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Button variant="danger" size="lg" onClick={() => answer(false)}>
              まだ🤔
            </Button>
            <Button variant="success" size="lg" onClick={() => answer(true)}>
              覚えた👍
            </Button>
          </div>
        )}
      </CardStudyFooter>

      <WordListSheet
        open={listSheetOpen}
        onClose={() => setListSheetOpen(false)}
        wordId={word.id}
        wordLabel={word.word}
      />
    </div>
  )
}
