import { useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { ALL_WORDS } from '../data/vocab.js'
import { getLevel } from '../data/levels.js'
import { matchOcrTextToWords, normalizeOcrToken, ocrTokenConfidences } from '../lib/vocabOcr.js'
import { createContextReading } from '../lib/ocrContext.js'
import { requestWords, WORD_REQUEST_TOTAL_LIMIT } from '../lib/wordRequests.js'
import { wordBookRef } from '../lib/wordBooks.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { PhotoOcrPicker, usePhotoOcr } from '../components/PhotoOcrPicker.jsx'
import { useWordBookSlot, wordBookSlotButtonText } from '../components/WordBookSlot.jsx'
import { activeNotebookSetId } from '../lib/learningNotebook.js'
import { Button, Card, Chip } from '../components/ui.jsx'
import { Check, Close, Refresh } from '../components/Icons.jsx'

const NO_REFS = Object.freeze([])

export function VocabCameraScreen() {
  const navigate = useStore((state) => state.navigate)
  // 登録先の単語帳（画面下部の「単語帳」で選んだ冊）に入っている語。
  const activeBookRefs = useStore((state) => (
    state.learningNotebook.sets.find((set) => set.id === activeNotebookSetId(state.learningNotebook))?.refs ?? NO_REFS
  ))
  // 写真を選んで読み取る部品（自作カードの「写真から作る」と同じもの）。
  const ocr = usePhotoOcr({ readingStatus: '教科書の文字を読み取り中…' })
  // 読み取りのたびに作る、候補の判定に使うもの（文字を直して候補を更新するときも使う）。
  const englishWordsRef = useRef(null)
  // 英文の品詞を決める道具（saw ＝ see の過去形／のこぎり などを、前後の語から読み分ける）。
  const taggerRef = useRef(null)
  const confidencesRef = useRef(new Map())

  const [ocrText, setOcrText] = useState('')
  const [textChanged, setTextChanged] = useState(false)
  const [summary, setSummary] = useState(null)
  const [selected, setSelected] = useState(() => new Set())
  const [selectedRequests, setSelectedRequests] = useState(() => new Set())
  const [requestedWords, setRequestedWords] = useState(() => new Set())
  const [requesting, setRequesting] = useState(false)
  const [requestError, setRequestError] = useState('')
  const [requestedCount, setRequestedCount] = useState(0)
  const [addedCount, setAddedCount] = useState(0)
  // 登録先の単語帳に入っている語は、候補のなかで「入っている」と示して選べなくする。
  const inWordBook = (id, refs = activeBookRefs) => refs.includes(wordBookRef(id))
  // 選んだ語は、登録先の単語帳にまとめて入れる。
  const pendingIds = [...selected].filter((id) => !inWordBook(id))
  const wordBook = useWordBookSlot(pendingIds.map(wordBookRef), {
    label: `読み取った${pendingIds.length}語`,
    present: true,
  })

  // 読み取りが不確かな語と、読み違いを直した語は、最初は選ばない（写真で確かめてから選ぶ）。
  const applyMatches = (text) => {
    const next = matchOcrTextToWords(text, ALL_WORDS, {
      englishWords: englishWordsRef.current,
      confidences: confidencesRef.current,
      contextReading: taggerRef.current ? createContextReading(taggerRef.current, text, ALL_WORDS) : null,
    })
    setSummary(next)
    setSelected(new Set(next.candidates
      .filter((item) => !inWordBook(item.id) && !item.uncertain && !item.corrected && !item.split)
      .map((item) => item.id)))
    setSelectedRequests(new Set(next.unmatched.map((item) => item.token)))
    setRequestedWords(new Set())
    setRequestedCount(0)
    setRequestError('')
    setTextChanged(false)
    setAddedCount(0)
  }

  // 新しい写真を選んだら、前の写真の結果を消す。
  const clearResults = () => {
    setOcrText('')
    setSummary(null)
    setSelected(new Set())
    setSelectedRequests(new Set())
    setRequestedWords(new Set())
    setRequestedCount(0)
    setRequestError('')
    setAddedCount(0)
  }

  const scanImage = async () => {
    if (!ocr.file || ocr.scanning) return
    setOcrText('')
    setSummary(null)
    setAddedCount(0)
    const result = await ocr.scan()
    if (!result) return
    englishWordsRef.current = result.englishWords
    taggerRef.current = result.tagger
    confidencesRef.current = ocrTokenConfidences(result.page.words)
    setOcrText(result.text)
    applyMatches(result.text)
  }

  const toggleCandidate = (id) => {
    if (inWordBook(id)) return
    setSelected((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAllNew = () => {
    if (!summary) return
    setSelected(new Set(summary.candidates.filter((item) => !inWordBook(item.id)).map((item) => item.id)))
  }

  // 入れた語は選択から外し、入れた数を示す（入らなかったときは画面下部で知らせ、単語帳の設定を開く）。
  const addSelected = () => {
    if (!pendingIds.length) return
    wordBook.press()
    const { learningNotebook } = useStore.getState()
    const refs = learningNotebook.sets.find((set) => set.id === activeNotebookSetId(learningNotebook))?.refs ?? NO_REFS
    const added = pendingIds.filter((id) => inWordBook(id, refs))
    if (!added.length) return
    setSelected((current) => {
      const next = new Set(current)
      for (const id of added) next.delete(id)
      return next
    })
    setAddedCount(added.length)
  }

  const toggleRequest = (token) => {
    if (requestedWords.has(token)) return
    setSelectedRequests((current) => {
      const next = new Set(current)
      if (next.has(token)) next.delete(token)
      else next.add(token)
      return next
    })
  }

  const sendRequests = async () => {
    if (!summary || !selectedRequests.size || requesting) return
    const items = summary.unmatched.filter((item) => selectedRequests.has(item.token))
    if (!items.length) return
    setRequesting(true)
    setRequestError('')
    try {
      const result = await requestWords(items.map((item) => item.q), { source: 'camera-ocr' })
      const accepted = result.sent + result.already
      if (accepted > 0) {
        setRequestedWords((current) => new Set([...current, ...items.map((item) => item.token)]))
        setSelectedRequests(new Set())
        setRequestedCount(accepted)
      }
      if (result.status === 'limit') {
        setRequestError('今日ぶんのリクエスト上限に達しました。残りは明日また送れます。')
      } else if (result.status === 'full') {
        setRequestError(`リクエストは全体で${WORD_REQUEST_TOTAL_LIMIT}語まで受け付けます。今はいっぱいなので、残りは辞書へ追加され次第送れます。`)
      } else if (accepted === 0) {
        setRequestError('送信できませんでした。通信環境を確認して、もう一度お試しください。')
      }
    } catch (reason) {
      console.warn('camera OCR word requests failed', reason)
      setRequestError('送信できませんでした。通信環境を確認して、もう一度お試しください。')
    } finally {
      setRequesting(false)
    }
  }

  const newCandidateCount = summary?.candidates.filter((item) => !inWordBook(item.id)).length ?? 0
  const pendingRequestCount = summary?.unmatched.filter((item) => !requestedWords.has(item.token)).length ?? 0

  return (
    <div className="pb-8">
      <ScreenHeader title="教科書から単語を追加" subtitle="撮影した写真から英単語を読み取る" />

      <div className="space-y-4 px-4">
        <Card className="overflow-hidden p-4">
          <div className="mb-3 flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-2xl">
              📷
            </div>
            <div>
              <h2 className="font-display font-extrabold text-ink">教科書をまっすぐ撮影</h2>
              <p className="mt-0.5 text-xs font-bold leading-relaxed text-ink/50">
                {'日本語の訳や説明がまざったページも、そのまま撮れます。英語の部分を大きく写すと、読み取りやすくなります。'}
              </p>
            </div>
          </div>

          <PhotoOcrPicker
            ocr={ocr}
            onPicked={clearResults}
            onRead={scanImage}
            showRead={Boolean(ocr.file && !summary)}
            readLabel="英単語を読み取る"
            previewAlt="読み取る教科書の写真"
          />
        </Card>

        {summary && (
          <>
            <Card className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Check size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-display font-extrabold text-ink">
                    {summary.candidates.length}語が辞書と一致
                  </h2>
                  <p className="mt-0.5 text-xs font-bold leading-relaxed text-ink/50">
                    {`読み取った英語 ${summary.tokenCount} 語のうち、辞書にある単語を候補にしました。`}
                    {'意味を確認して追加する語を選んでください。'}
                  </p>
                </div>
              </div>

              <label className="mt-4 block text-xs font-extrabold text-ink/70" htmlFor="ocr-text">
                読み取った文字（誤読は修正できます）
              </label>
              <textarea
                id="ocr-text"
                value={ocrText}
                onChange={(event) => {
                  setOcrText(event.target.value)
                  setTextChanged(true)
                }}
                className="mt-1.5 h-28 w-full resize-y rounded-2xl bg-paper p-3 text-sm font-bold leading-relaxed text-ink ring-1 ring-ink/10 focus:outline-none focus:ring-2 focus:ring-brand-300"
                placeholder="読み取った文字がここに表示されます"
              />
              {textChanged && (
                <Button
                  full
                  size="sm"
                  variant="secondary"
                  className="mt-2"
                  onClick={() => applyMatches(ocrText)}
                >
                  <Refresh size={16} /> 修正した文字で候補を更新
                </Button>
              )}
            </Card>

            {summary.candidates.length > 0 ? (
              <section aria-labelledby="ocr-candidates-title">
                <div className="mb-2 flex items-end justify-between gap-3 px-1">
                  <div>
                    <h2 id="ocr-candidates-title" className="font-display text-lg font-extrabold text-ink">
                      追加する単語
                    </h2>
                    <p className="text-xs font-bold text-ink/45">
                      新規 {newCandidateCount}語・選択中 {selected.size}語
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={selectAllNew}
                      className="rounded-xl px-2.5 py-2 text-xs font-extrabold text-brand-700 active:bg-brand-100"
                    >
                      すべて選択
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelected(new Set())}
                      className="rounded-xl px-2.5 py-2 text-xs font-extrabold text-ink/45 active:bg-ink/5"
                    >
                      解除
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {summary.candidates.map((item) => {
                    const level = getLevel(item.level)
                    const saved = inWordBook(item.id)
                    const checked = saved || selected.has(item.id)
                    const observed = item.observed
                      .filter((surface) => normalizeOcrToken(surface) !== normalizeOcrToken(item.headword))
                      .join('・')
                    return (
                      <label
                        key={item.id}
                        className={`flex min-h-16 items-center gap-3 rounded-2xl p-3 shadow-sm ring-1 ${
                          saved
                            ? 'bg-amber-50/80 ring-amber-100'
                            : checked
                              ? 'bg-white ring-brand-200'
                              : 'bg-white/60 ring-ink/5'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={saved}
                          onChange={() => toggleCandidate(item.id)}
                          className="h-5 w-5 shrink-0 accent-indigo-600"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="font-display text-base font-extrabold text-ink">
                              {item.headword}
                            </span>
                            <Chip color={level.color}>{level.label}</Chip>
                            {item.occurrences > 1 && (
                              <span className="text-[11px] font-extrabold text-ink/35">
                                {item.occurrences}回
                              </span>
                            )}
                          </span>
                          <span className="mt-0.5 block text-xs font-bold text-ink/55">
                            {item.meaning}
                          </span>
                          {observed && (
                            <span className="mt-0.5 block text-[11px] font-bold text-brand-600">
                              {observed} → {item.headword}
                              {item.corrected ? '（読み違いを直しました）' : item.split ? '（続けて読まれた語を分けました）' : ''}
                            </span>
                          )}
                          {item.uncertain && !saved && (
                            <span className="mt-0.5 block text-[11px] font-bold text-amber-700" data-ocr-uncertain>
                              {'読み取りが不確かです。写真で確かめてから選んでください。'}
                            </span>
                          )}
                        </span>
                        {saved && (
                          <span className="shrink-0 text-[11px] font-extrabold text-amber-700">
                            単語帳にある
                          </span>
                        )}
                      </label>
                    )
                  })}
                </div>

                <div className="sticky bottom-3 z-10 mt-4 rounded-3xl bg-paper/90 p-2 shadow-xl backdrop-blur">
                  <Button full disabled={!pendingIds.length} onClick={addSelected} data-ocr-word-book>
                    <Check size={18} /> {wordBookSlotButtonText({ bookTitle: wordBook.bookTitle, inBook: false, what: `選んだ${pendingIds.length}語を` })}
                  </Button>
                </div>
              </section>
            ) : (
              <Card className="p-5 text-center">
                <div className="text-4xl">🔎</div>
                <h2 className="mt-2 font-display font-extrabold text-ink">単語帳へ入れられる語はありませんでした</h2>
                <p className="mt-1 text-xs font-bold leading-relaxed text-ink/50">
                  上の文字を修正するか、下の未登録語を確認して辞書登録をリクエストできます。
                </p>
              </Card>
            )}

            {summary.unmatched.length > 0 && (
              <section aria-labelledby="ocr-requests-title">
                <Card className="border-2 border-sky-100 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xl">
                      📩
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 id="ocr-requests-title" className="font-display font-extrabold text-ink">
                        辞書にない単語
                      </h2>
                      <p className="mt-0.5 text-xs font-bold leading-relaxed text-ink/50">
                        {'辞書にまだない英単語です。'}
                        {'選んだ語だけを辞書登録リクエストへ送ります。'}
                        {'写真や教科書の本文、メールアドレスは送信しません。'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-end justify-between gap-3">
                    <p className="text-xs font-bold text-ink/45">
                      未送信 {pendingRequestCount}語・選択中 {selectedRequests.size}語
                    </p>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setSelectedRequests(new Set(
                          summary.unmatched
                            .filter((item) => !requestedWords.has(item.token))
                            .map((item) => item.token),
                        ))}
                        className="rounded-xl px-2.5 py-2 text-xs font-extrabold text-sky-700 active:bg-sky-50"
                      >
                        すべて選択
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedRequests(new Set())}
                        className="rounded-xl px-2.5 py-2 text-xs font-extrabold text-ink/45 active:bg-ink/5"
                      >
                        解除
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {summary.unmatched.map((item) => {
                      const sent = requestedWords.has(item.token)
                      return (
                        <label
                          key={item.token}
                          className={`flex min-h-12 items-center gap-2 rounded-xl p-2.5 ring-1 ${
                            sent
                              ? 'bg-emerald-50 ring-emerald-100'
                              : selectedRequests.has(item.token)
                                ? 'bg-sky-50 ring-sky-200'
                                : 'bg-paper ring-ink/10'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={sent || selectedRequests.has(item.token)}
                            disabled={sent}
                            onChange={() => toggleRequest(item.token)}
                            className="h-4 w-4 shrink-0 accent-sky-600"
                          />
                          <span className="min-w-0 flex-1 truncate text-sm font-extrabold text-ink">
                            {item.q}
                          </span>
                          {item.occurrences > 1 && (
                            <span className="shrink-0 text-[10px] font-extrabold text-ink/35">
                              {item.occurrences}回
                            </span>
                          )}
                          {sent && (
                            <span className="shrink-0 text-[10px] font-extrabold text-emerald-700">
                              送信済み
                            </span>
                          )}
                        </label>
                      )
                    })}
                  </div>

                  {requestedCount > 0 && (
                    <p className="mt-3 rounded-xl bg-emerald-50 p-2.5 text-center text-xs font-extrabold text-emerald-700">
                      {requestedCount}語を送信しました。
                    </p>
                  )}
                  {requestError && (
                    <p role="alert" className="mt-3 rounded-xl bg-rose-50 p-2.5 text-xs font-bold text-rose-600">
                      {requestError}
                    </p>
                  )}
                  <Button
                    full
                    className="mt-3"
                    variant="secondary"
                    disabled={!selectedRequests.size || requesting}
                    onClick={sendRequests}
                  >
                    📩 {requesting
                      ? '送信中…'
                      : `選んだ ${selectedRequests.size}語を送る`}
                  </Button>
                </Card>
              </section>
            )}

            {summary.rejected.length > 0 && (
              <section aria-labelledby="ocr-rejected-title">
                <Card className="p-4">
                  <h2 id="ocr-rejected-title" className="font-display font-extrabold text-ink">
                    英単語として確かめられなかった文字
                  </h2>
                  <p className="mt-0.5 text-xs font-bold leading-relaxed text-ink/50">
                    {'人名・地名や、読み違えた文字です。単語帳にもリクエストにも入れません。'}
                    {'英単語の読み違いなら、写真と見比べて上の文字を直すと候補に入ります。'}
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-1.5" data-ocr-rejected>
                    {summary.rejected.map((item) => (
                      <li
                        key={item.token}
                        className="rounded-lg bg-ink/5 px-2 py-1 text-xs font-extrabold text-ink/60"
                      >
                        {item.q}
                        {item.occurrences > 1 && (
                          <span className="ml-1 text-[10px] text-ink/35">{item.occurrences}回</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </Card>
              </section>
            )}
          </>
        )}

        {addedCount > 0 && (
          <Card className="border-2 border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                <Check size={21} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display font-extrabold text-emerald-800">
                  {addedCount}語を単語帳に入れました
                </p>
                <p className="text-xs font-bold text-emerald-700/70">
                  単語画面の「単語帳」から、その冊で暗記とテストができます。
                </p>
              </div>
            </div>
            <Button full className="mt-3" variant="success" onClick={() => navigate('myList')}>
              マイ学習ノートで単語帳を見る
            </Button>
          </Card>
        )}

        {!summary && !ocr.scanning && (
          <div className="rounded-2xl bg-white/60 p-3 text-xs font-bold leading-relaxed text-ink/50">
            <p className="font-extrabold text-ink/65">きれいに読み取るコツ</p>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>ページとカメラを平行にして、影や光の反射を避ける</li>
              <li>英語部分が小さいときは、近づいて数段落ずつ撮る</li>
              <li>追加前に候補と日本語の意味を必ず確認する</li>
            </ul>
          </div>
        )}

        {summary && (
          <Button
            full
            variant="ghost"
            onClick={() => {
              setSummary(null)
              setOcrText('')
              setSelected(new Set())
              setSelectedRequests(new Set())
              setRequestedWords(new Set())
              setRequestedCount(0)
              setRequestError('')
              setAddedCount(0)
            }}
          >
            <Close size={17} /> この結果を閉じる
          </Button>
        )}
      </div>

    </div>
  )
}
