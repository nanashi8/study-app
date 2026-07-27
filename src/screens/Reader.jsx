import { useState, useMemo, useRef, useEffect } from 'react'
import { useStore } from '../store/useStore.js'
import { getPassage } from '../data/passages.js'
import { getLevel } from '../data/levels.js'
import { tokenize } from '../lib/text.js'
import { resolvePassageWord } from '../data/passage-gloss.js'
import { speak, speakWith, stopSpeaking } from '../lib/tts.js'
import { Sheet } from '../components/Sheet.jsx'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { Button, Chip, IconButton } from '../components/ui.jsx'
import { Close, SpeakerWave, ArrowRight, Lightbulb, Link, ChevronLeft, ChevronRight, Bookmark, BookmarkFilled, BookOpen } from '../components/Icons.jsx'
import { cx } from '../components/ui.jsx'

export function ReaderScreen() {
  const passageId = useStore((s) => s.params.passageId)
  const navigate = useStore((s) => s.navigate)
  const back = useStore((s) => s.back)
  const settings = useStore((s) => s.settings)
  const myList = useStore((s) => s.myList)
  const toggleMyList = useStore((s) => s.toggleMyList)
  const passage = getPassage(passageId)

  const [showJa, setShowJa] = useState(false)
  const [activeIdx, setActiveIdx] = useState(null) // 詳細ウィンドウ対象の文
  const [activeWord, setActiveWord] = useState(null)

  // ── 区切り再生（英文チャンク→日本語訳を交互に読み上げ）──
  // 全文を文の区切り（chunks）ごとに平坦化。各要素に元の文番号 si を持たせる。
  const chunks = useMemo(
    () =>
      passage
        ? passage.sentences.flatMap((s, si) => (s.chunks || []).map((c) => ({ ...c, si })))
        : [],
    [passage],
  )
  const paragraphs = useMemo(() => {
    const groups = []
    for (const [index, item] of (passage?.sentences ?? []).entries()) {
      if (!groups.length || item.paragraphStart) groups.push([])
      groups.at(-1).push({ item, index })
    }
    return groups
  }, [passage])
  const [playOpen, setPlayOpen] = useState(false) // 再生パネルの表示
  const [playIdx, setPlayIdx] = useState(0) // 現在のチャンク
  const [playing, setPlaying] = useState(false) // 自動送り中か
  const [dir, setDir] = useState(1) // 1=順送り / -1=戻り
  const [phase, setPhase] = useState('en') // いま英語/日本語どちらを読んでいるか
  const tokenRef = useRef(0) // 再生の世代。停止・やり直しで無効化する

  // 画面を離れたら必ず止める
  useEffect(() => () => stopSpeaking(), [])

  // idx のチャンクを「英→日」で読む。auto なら direction 方向へ自動で続ける。
  const speakChunkSeq = (idx, { auto, direction }) => {
    const token = ++tokenRef.current
    stopSpeaking()
    const run = (i) => {
      if (tokenRef.current !== token) return
      if (i < 0 || i >= chunks.length) {
        setPlaying(false)
        return
      }
      setPlayIdx(i)
      const c = chunks[i]
      setPhase('en')
      speakWith(c.en, {
        rate: settings.ttsRate,
        voiceURI: settings.ttsVoiceURI,
        lang: 'en-US',
        onend: () => {
          if (tokenRef.current !== token) return
          setPhase('ja')
          speakWith(c.ja, {
            rate: settings.ttsRate,
            lang: 'ja-JP',
            onend: () => {
              if (tokenRef.current !== token) return
              if (auto) run(i + direction)
              else setPlaying(false)
            },
          })
        },
      })
    }
    run(idx)
  }

  const stopPlay = () => {
    tokenRef.current++ // 進行中の連鎖を無効化
    stopSpeaking()
    setPlaying(false)
  }
  // direction 方向に現在位置から自動再生
  const playChunks = (direction) => {
    setDir(direction)
    setPlaying(true)
    speakChunkSeq(playIdx, { auto: true, direction })
  }
  // 1チャンクだけ手動で移動して読む
  const stepChunk = (delta) => {
    const ni = Math.min(chunks.length - 1, Math.max(0, playIdx + delta))
    stopPlay()
    speakChunkSeq(ni, { auto: false, direction: dir })
  }
  const openPlayer = () => {
    setPlayOpen(true)
    setPlayIdx(0)
    setPhase('en')
  }
  const closePlayer = () => {
    stopPlay()
    setPlayOpen(false)
  }

  if (!passage) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <p className="font-bold text-ink/50">長文が見つかりませんでした。</p>
        <Button onClick={back}>もどる</Button>
      </div>
    )
  }

  const level = getLevel(passage.level)
  const sentence = activeIdx != null ? passage.sentences[activeIdx] : null
  const cur = chunks[playIdx] // 区切り再生でいま読んでいるチャンク

  const openSentence = (i) => {
    stopPlay()
    setActiveWord(null)
    setActiveIdx(i)
  }
  const tapToken = (tok) => {
    speak(tok.word, { rate: settings.ttsRate, voiceURI: settings.ttsVoiceURI })
    const meaning = resolvePassageWord(tok.key, sentence?.gloss)
    setActiveWord({ word: tok.word, ja: meaning?.ja ?? null, id: meaning?.id ?? null })
  }

  return (
    <div className="flex h-full flex-col">
      {/* ヘッダー */}
      <header
        className="flex items-center gap-1 px-2 py-2.5"
        style={{ background: `linear-gradient(to bottom, ${level.color}22, transparent)` }}
      >
        <IconButton onClick={back} aria-label="閉じる">
          <Close size={22} />
        </IconButton>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-base font-extrabold text-ink">{passage.title}</h1>
          <p className="truncate text-xs font-bold text-ink/50">{passage.titleJa}</p>
        </div>
        <Chip color={level.color}>英検{level.label}</Chip>
      </header>

      {/* 操作バー */}
      <div className="flex flex-wrap items-center gap-2 px-4 py-2">
        <button
          onClick={() => navigate('readingPrep', { passageId })}
          className="flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1.5 text-xs font-extrabold text-brand-700"
        >
          <BookOpen size={14} /> 重要語・表現
        </button>
        <button
          onClick={() => setShowJa((v) => !v)}
          className={cx(
            'rounded-full px-3 py-1.5 text-xs font-extrabold transition-colors',
            showJa ? 'bg-brand-500 text-white' : 'bg-brand-100 text-brand-700',
          )}
        >
          和訳 {showJa ? 'ON' : 'OFF'}
        </button>
        <button
          onClick={() => {
            stopPlay()
            speak(passage.sentences.map((s) => s.en).join(' '), {
              rate: settings.ttsRate,
              voiceURI: settings.ttsVoiceURI,
            })
          }}
          className="flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1.5 text-xs font-extrabold text-brand-700"
        >
          <SpeakerWave size={14} /> 全文を読み上げ
        </button>
        <button
          onClick={openPlayer}
          className={cx(
            'flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-extrabold transition-colors',
            playOpen ? 'bg-brand-500 text-white' : 'bg-brand-100 text-brand-700',
          )}
        >
          <SpeakerWave size={14} /> 区切り再生
        </button>
      </div>

      {/* 本文 */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="rounded-3xl bg-white p-5 shadow-card">
          <div className="space-y-5 text-lg leading-loose text-ink">
            {paragraphs.map((paragraph, paragraphIndex) => (
              <p key={paragraphIndex}>
                {paragraph.map(({ item, index }) => (
                  <span key={index}>
                    <button
                      onClick={() => openSentence(index)}
                      className={cx(
                        'rounded-md px-0.5 text-left transition-colors hover:bg-brand-50 active:bg-brand-100',
                        playOpen && chunks[playIdx]?.si === index && 'bg-amber-200',
                      )}
                    >
                      {item.en}
                    </button>{' '}
                  </span>
                ))}
              </p>
            ))}
          </div>
          {showJa && (
            <div className="mt-4 space-y-3 border-t border-brand-100 pt-4 text-sm font-bold leading-relaxed text-ink/55">
              {paragraphs.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex}>
                  {paragraph.map(({ item }) => item.ja).join(' ')}
                </p>
              ))}
            </div>
          )}
        </div>
        <p className="mt-3 px-1 text-center text-xs font-bold text-ink/40">
          一文をタップすると、発音・区切り直訳・和訳が見られます。
        </p>
      </div>

      {/* 区切り再生バー（英文チャンク→日本語訳を交互に読み上げ） */}
      {playOpen && (
        <div className="shrink-0 border-t border-brand-100 bg-white px-4 py-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wide text-brand-400">
              区切り再生（英→日）
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-ink/40">
                {Math.min(playIdx + 1, chunks.length)}/{chunks.length}
              </span>
              <IconButton onClick={closePlayer} aria-label="区切り再生を閉じる">
                <Close size={18} />
              </IconButton>
            </div>
          </div>

          {/* いま読んでいるまとまり */}
          {cur && (
            <div className="mb-3 rounded-2xl bg-brand-50 p-3">
              <div className={cx('font-bold leading-snug', phase === 'en' ? 'text-brand-700' : 'text-ink')}>
                {cur.en}
              </div>
              <div
                className={cx(
                  'mt-0.5 text-sm font-bold leading-snug',
                  phase === 'ja' ? 'text-amber-600' : 'text-ink/55',
                )}
              >
                {cur.ja}
              </div>
            </div>
          )}

          {/* 操作：前へ / 再生・一時停止 / 次へ */}
          <div className="flex items-center gap-2">
            <IconButton onClick={() => stepChunk(-1)} disabled={playIdx <= 0} aria-label="前のまとまり">
              <ChevronLeft size={20} />
            </IconButton>
            {playing ? (
              <Button full variant="secondary" onClick={stopPlay}>
                ⏸ 一時停止
              </Button>
            ) : (
              <Button full onClick={() => playChunks(dir)}>
                <SpeakerWave size={16} /> {dir === 1 ? '順に再生' : '戻して再生'}
              </Button>
            )}
            <IconButton
              onClick={() => stepChunk(1)}
              disabled={playIdx >= chunks.length - 1}
              aria-label="次のまとまり"
            >
              <ChevronRight size={20} />
            </IconButton>
          </div>

          {/* 向き（順送り / 戻り読み）切替 */}
          <div className="mt-2 flex items-center justify-center gap-1.5">
            <span className="text-[11px] font-bold text-ink/40">向き</span>
            {[
              { v: 1, label: '順送り' },
              { v: -1, label: '戻り読み' },
            ].map((o) => (
              <button
                key={o.v}
                onClick={() => {
                  setDir(o.v)
                  if (playing) playChunks(o.v)
                }}
                className={cx(
                  'rounded-full px-3 py-1 text-xs font-extrabold transition-colors',
                  dir === o.v ? 'bg-brand-500 text-white' : 'bg-brand-100 text-brand-700',
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* フッター */}
      <div className="shrink-0 border-t border-brand-100 bg-white/90 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur">
        <Button full size="lg" onClick={() => navigate('readingSummary', { passageId })}>
          読解チェック・単語まとめ <ArrowRight size={18} />
        </Button>
      </div>

      {/* 一文の詳細ウィンドウ */}
      <Sheet open={activeIdx != null} onClose={() => setActiveIdx(null)} title="文の詳細" maxH="88vh">
        {sentence && (
          <div className="space-y-4">
            {/* 英文（単語タップ可） */}
            <div className="rounded-2xl bg-brand-50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wide text-brand-400">英文</span>
                <SpeakButton text={sentence.en} size="sm" />
              </div>
              <p className="text-lg leading-relaxed text-ink">
                {tokenize(sentence.en).map((tok, k) => {
                  if (tok.space) return ' '
                  if (!tok.word) return <span key={k}>{tok.pre}</span>
                  // 重要語（語彙データにある語）は下線で示す。機能語も意味は出る。
                  const known = !!resolvePassageWord(tok.key, sentence.gloss)?.id
                  return (
                    <span key={k}>
                      {tok.pre}
                      <button
                        onClick={() => tapToken(tok)}
                        className={cx(
                          'rounded transition-colors active:bg-brand-200',
                          known
                            ? 'font-bold text-brand-700 underline decoration-brand-300 decoration-2 underline-offset-2'
                            : 'text-ink underline decoration-dotted decoration-ink/20 underline-offset-2',
                          activeWord?.word === tok.word && 'bg-brand-200',
                        )}
                      >
                        {tok.word}
                      </button>
                      {tok.post}
                    </span>
                  )
                })}
              </p>
            </div>

            {/* タップした単語 */}
            {activeWord && (
              <div className="animate-pop-in rounded-2xl bg-white p-3 ring-2 ring-brand-200">
                <div className="flex items-center gap-3">
                  <SpeakButton text={activeWord.word} size="sm" />
                  <div className="flex-1">
                    <div className="font-display text-lg font-extrabold text-ink">{activeWord.word}</div>
                    <div className="text-sm font-bold text-ink/60">
                      {activeWord.ja ?? '（発音を確認できます）'}
                    </div>
                  </div>
                  {activeWord.id && (
                    <button
                      onClick={() => navigate('wordDetail', { id: activeWord.id })}
                      className="flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1.5 text-xs font-extrabold text-brand-700"
                    >
                      <Link size={14} /> 詳しく
                    </button>
                  )}
                </div>
                {/* マイ単語に追加（語彙データにある語のみ） */}
                {activeWord.id && (
                  <button
                    onClick={() => toggleMyList(activeWord.id)}
                    className={cx(
                      'mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-extrabold transition-colors',
                      myList.includes(activeWord.id)
                        ? 'bg-hint-soft text-amber-700'
                        : 'bg-brand-500 text-white active:bg-brand-600',
                    )}
                  >
                    {myList.includes(activeWord.id) ? (
                      <>
                        <BookmarkFilled size={16} /> マイ単語に追加済み（タップで解除）
                      </>
                    ) : (
                      <>
                        <Bookmark size={16} /> マイ単語に追加
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* 区切り読み（直訳） */}
            <div>
              <div className="mb-2 flex items-center gap-1.5 text-brand-600">
                <Lightbulb size={16} />
                <span className="text-[11px] font-extrabold uppercase tracking-wide">区切り読み（直訳）</span>
              </div>
              <div className="space-y-1.5">
                {sentence.chunks.map((c, k) => (
                  <div key={k} className="flex items-center gap-2 rounded-2xl bg-white p-2.5 ring-1 ring-brand-100">
                    <SpeakButton text={c.en} size="sm" />
                    <div className="flex-1">
                      <div className="font-bold text-ink">{c.en}</div>
                      <div className="text-sm font-bold text-brand-600">{c.ja}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 自然な和訳 */}
            <div className="rounded-2xl bg-hint-soft/70 p-4">
              <div className="mb-1 text-[11px] font-extrabold uppercase tracking-wide text-amber-500">きれいな日本語訳</div>
              <p className="font-bold leading-relaxed text-amber-900">{sentence.ja}</p>
            </div>

            {/* 文の移動 */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <Button
                variant="secondary"
                size="sm"
                disabled={activeIdx === 0}
                onClick={() => openSentence(activeIdx - 1)}
              >
                ← 前の文
              </Button>
              <span className="text-xs font-bold text-ink/40">
                {activeIdx + 1}/{passage.sentences.length}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={activeIdx >= passage.sentences.length - 1}
                onClick={() => openSentence(activeIdx + 1)}
              >
                次の文 →
              </Button>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  )
}
