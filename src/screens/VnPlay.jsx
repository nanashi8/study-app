import { useState, useRef, useEffect, useMemo } from 'react'
import { useStore } from '../store/useStore.js'
import { getEpisode, SPEAKERS } from '../data/vn.js'
import { speak, stopSpeaking } from '../lib/tts.js'
import { Button, IconButton, cx } from '../components/ui.jsx'
import { Close, SpeakerWave, ArrowRight, Lightbulb } from '../components/Icons.jsx'

// 1つの吹き出し。英文はタップで読み上げ。
function Bubble({ entry, showJa, rate, voiceURI }) {
  const { kind } = entry
  if (kind === 'narration') {
    return (
      <div className="my-1 px-4 text-center">
        <p className="text-sm font-bold italic leading-relaxed text-ink/55">{entry.en}</p>
        {showJa && <p className="mt-0.5 text-xs font-bold text-ink/35">{entry.ja}</p>}
      </div>
    )
  }
  if (kind === 'note') {
    return <NoteCard note={entry.note} showJa={showJa} />
  }
  const mine = kind === 'you'
  // シナリオ側の話者指定漏れがあっても、相手の台詞をプレイヤーに誤帰属しない。
  const sp = SPEAKERS[entry.speaker] ?? SPEAKERS.narrator
  return (
    <div className={cx('flex items-end gap-2', mine ? 'flex-row-reverse' : 'flex-row')}>
      {!mine && (
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl"
          style={{ backgroundColor: `${sp.color}22` }}
        >
          {sp.emoji}
        </span>
      )}
      <button
        onClick={() => speak(entry.en, { rate, voiceURI })}
        className={cx(
          'max-w-[78%] rounded-2xl px-3.5 py-2.5 text-left active:opacity-80 transition-opacity',
          mine ? 'bg-brand-500 text-white' : 'bg-white text-ink shadow-sm ring-1 ring-brand-100',
        )}
      >
        {!mine && <div className="mb-0.5 text-[11px] font-extrabold" style={{ color: sp.color }}>{sp.name}</div>}
        <div className="flex items-start gap-1.5">
          <span className="font-bold leading-snug">{entry.en}</span>
          <SpeakerWave size={14} className={cx('mt-1 shrink-0', mine ? 'text-white/70' : 'text-brand-300')} />
        </div>
        {showJa && (
          <div className={cx('mt-1 text-xs font-bold leading-snug', mine ? 'text-white/80' : 'text-ink/45')}>
            {entry.ja}
          </div>
        )}
      </button>
    </div>
  )
}

// 表現メモ（受験ポイント）。
function NoteCard({ note, showJa }) {
  return (
    <div className="my-1 rounded-2xl bg-hint-soft/70 p-3">
      <div className="mb-1 flex items-center gap-1.5 text-amber-600">
        <Lightbulb size={15} />
        <span className="text-[11px] font-extrabold uppercase tracking-wide">表現メモ・{note.label}</span>
      </div>
      <div className="font-display text-sm font-extrabold text-amber-900">{note.en}</div>
      {showJa && <div className="mt-0.5 text-xs font-bold text-amber-700/80">{note.ja}</div>}
    </div>
  )
}

export function VnPlayScreen() {
  const episodeId = useStore((s) => s.params.episodeId)
  const back = useStore((s) => s.back)
  const navigate = useStore((s) => s.navigate)
  const settings = useStore((s) => s.settings)
  const markVnCleared = useStore((s) => s.markVnCleared)
  const episode = getEpisode(episodeId)

  const [showJa, setShowJa] = useState(true)
  const [entries, setEntries] = useState([])
  const [nodeId, setNodeId] = useState(null)
  const [resolvedNext, setResolvedNext] = useState(null) // 選択後の続き先
  const [finished, setFinished] = useState(false)
  const scrollRef = useRef(null)

  // エピソードの表現メモ一覧（クリア後のおさらい用）。
  const allNotes = useMemo(
    () => (episode ? Object.values(episode.nodes).map((n) => n.note).filter(Boolean) : []),
    [episode],
  )

  // 開始（エピソードが変わったら最初から）。
  useEffect(() => {
    if (!episode) return
    const start = episode.nodes[episode.start]
    setEntries(nodeEntries(start))
    setNodeId(episode.start)
    setResolvedNext(null)
    setFinished(false)
  }, [episode])

  // 新しい吹き出しが増えたら一番下へ。
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [entries])

  // 画面を離れたら読み上げを止める。
  useEffect(() => () => stopSpeaking(), [])

  if (!episode) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <p className="font-bold text-ink/50">エピソードが見つかりませんでした。</p>
        <Button onClick={back}>もどる</Button>
      </div>
    )
  }

  const node = episode.nodes[nodeId]
  const awaitingChoice = node?.choices && resolvedNext == null
  const rate = settings.ttsRate
  const voiceURI = settings.ttsVoiceURI

  // ノードを吹き出し配列に変換（ナレーション/セリフ＋ノート）。
  function nodeEntries(n) {
    const out = []
    if (n.speaker === 'narration') out.push({ kind: 'narration', en: n.en, ja: n.ja })
    else out.push({ kind: 'line', speaker: n.speaker, en: n.en, ja: n.ja })
    // 選択肢ノートは選択エリアに出すので、ここでは選択肢の無いノードのノートだけ流す
    if (n.note && !n.choices) out.push({ kind: 'note', note: n.note })
    return out
  }

  const goTo = (id) => {
    const n = episode.nodes[id]
    if (!n) return
    setEntries((prev) => [...prev, ...nodeEntries(n)])
    setNodeId(id)
    setResolvedNext(null)
    if (n.end) {
      setFinished(true)
      markVnCleared(episode.id)
    }
  }

  const advance = () => {
    const nextId = resolvedNext ?? node?.next
    if (nextId) goTo(nextId)
  }

  const pick = (choice) => {
    const reply = choice.reply
    setEntries((prev) => [
      ...prev,
      { kind: 'you', speaker: 'you', en: choice.en, ja: choice.ja },
      ...(reply
        ? [{ kind: 'reply', speaker: reply.speaker ?? node.speaker, en: reply.en, ja: reply.ja }]
        : []),
    ])
    setResolvedNext(choice.next)
    if (reply) speak(reply.en, { rate, voiceURI })
  }

  const restart = () => {
    const start = episode.nodes[episode.start]
    setEntries(nodeEntries(start))
    setNodeId(episode.start)
    setResolvedNext(null)
    setFinished(false)
  }

  return (
    <div className="flex h-full flex-col bg-paper">
      {/* ヘッダー */}
      <header
        className="flex items-center gap-1 px-2 py-2.5"
        style={{ background: `linear-gradient(to bottom, ${episode.color}22, transparent)` }}
      >
        <IconButton onClick={back} aria-label="閉じる">
          <Close size={22} />
        </IconButton>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-base font-extrabold text-ink">{episode.title}</h1>
          <p className="truncate text-xs font-bold text-ink/50">{episode.titleJa}</p>
        </div>
        <button
          onClick={() => setShowJa((v) => !v)}
          className={cx(
            'rounded-full px-3 py-1.5 text-xs font-extrabold transition-colors',
            showJa ? 'bg-brand-500 text-white' : 'bg-brand-100 text-brand-700',
          )}
        >
          和訳 {showJa ? 'ON' : 'OFF'}
        </button>
      </header>

      {/* 会話ログ */}
      <div ref={scrollRef} className="flex-1 space-y-2.5 overflow-y-auto px-3 py-3">
        {entries.map((e, i) => (
          <Bubble key={i} entry={e} showJa={showJa} rate={rate} voiceURI={voiceURI} />
        ))}

        {/* クリア後のおさらい */}
        {finished && (
          <div className="mt-3 rounded-3xl bg-white p-4 shadow-card">
            <div className="text-center">
              <div className="text-3xl">🎉</div>
              <div className="mt-1 font-display text-lg font-extrabold text-ink">エピソード クリア！</div>
              <div className="text-xs font-bold text-ink/50">使った英会話表現のおさらい</div>
            </div>
            <ul className="mt-3 space-y-1.5">
              {allNotes.map((n, i) => (
                <li key={i} className="rounded-2xl bg-brand-50 p-2.5">
                  <div className="text-[11px] font-extrabold text-brand-500">{n.label}</div>
                  <div className="text-sm font-bold text-ink">{n.en}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 操作エリア */}
      <div className="shrink-0 border-t border-brand-100 bg-white/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur">
        {finished ? (
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={restart}>
              もう一度
            </Button>
            <Button className="flex-1" onClick={() => navigate('vnList')}>
              エピソード一覧へ <ArrowRight size={16} />
            </Button>
          </div>
        ) : awaitingChoice ? (
          <div className="space-y-2">
            {node.note && <NoteCard note={node.note} showJa={showJa} />}
            <p className="px-1 text-[11px] font-bold text-ink/40">あなたの返事を選ぼう（どれでも話は続きます）</p>
            {node.choices.map((c, i) => (
              <button
                key={i}
                onClick={() => pick(c)}
                className="flex w-full items-center gap-2 rounded-2xl bg-brand-50 p-3 text-left ring-1 ring-brand-100 transition-transform active:scale-[0.99] active:bg-brand-100"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500 text-xs font-extrabold text-white">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold leading-snug text-ink">{c.en}</span>
                  {showJa && <span className="block text-xs font-bold text-ink/50">{c.ja}</span>}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <Button full size="lg" onClick={advance}>
            つぎへ <ArrowRight size={18} />
          </Button>
        )}
      </div>
    </div>
  )
}
