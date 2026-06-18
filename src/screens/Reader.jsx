import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import { getPassage } from '../data/passages.js'
import { getLevel } from '../data/levels.js'
import { tokenize } from '../lib/text.js'
import { speak } from '../lib/tts.js'
import { Sheet } from '../components/Sheet.jsx'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { Button, Chip, IconButton } from '../components/ui.jsx'
import { Close, SpeakerWave, ArrowRight, Lightbulb, Link } from '../components/Icons.jsx'
import { cx } from '../components/ui.jsx'

export function ReaderScreen() {
  const passageId = useStore((s) => s.params.passageId)
  const navigate = useStore((s) => s.navigate)
  const back = useStore((s) => s.back)
  const settings = useStore((s) => s.settings)
  const passage = getPassage(passageId)

  const [showJa, setShowJa] = useState(false)
  const [activeIdx, setActiveIdx] = useState(null) // 詳細ウィンドウ対象の文
  const [activeWord, setActiveWord] = useState(null)

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

  const openSentence = (i) => {
    setActiveWord(null)
    setActiveIdx(i)
  }
  const tapToken = (tok, gloss) => {
    speak(tok.word, { rate: settings.ttsRate, voiceURI: settings.ttsVoiceURI })
    setActiveWord({ word: tok.word, ...(gloss ?? {}) })
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
      <div className="flex items-center gap-2 px-4 py-2">
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
          onClick={() =>
            speak(passage.sentences.map((s) => s.en).join(' '), {
              rate: settings.ttsRate,
              voiceURI: settings.ttsVoiceURI,
            })
          }
          className="flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1.5 text-xs font-extrabold text-brand-700"
        >
          <SpeakerWave size={14} /> 全文を読み上げ
        </button>
        <span className="ml-auto text-[11px] font-bold text-ink/40">タップで詳細</span>
      </div>

      {/* 本文 */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="rounded-3xl bg-white p-5 shadow-card">
          <p className="text-lg leading-loose text-ink">
            {passage.sentences.map((s, i) => (
              <span key={i}>
                <button
                  onClick={() => openSentence(i)}
                  className="rounded-md px-0.5 text-left transition-colors hover:bg-brand-50 active:bg-brand-100"
                >
                  {s.en}
                </button>{' '}
              </span>
            ))}
          </p>
          {showJa && (
            <div className="mt-4 space-y-1 border-t border-brand-100 pt-4 text-sm font-bold text-ink/55">
              {passage.sentences.map((s, i) => (
                <p key={i}>{s.ja}</p>
              ))}
            </div>
          )}
        </div>
        <p className="mt-3 px-1 text-center text-xs font-bold text-ink/40">
          一文をタップすると、発音・区切り直訳・和訳が見られます。
        </p>
      </div>

      {/* フッター */}
      <div className="shrink-0 border-t border-brand-100 bg-white/90 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur">
        <Button full size="lg" onClick={() => navigate('readingSummary', { passageId })}>
          まとめ・単語を学習する <ArrowRight size={18} />
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
                  const gloss = sentence.gloss?.[tok.key]
                  return (
                    <span key={k}>
                      {tok.pre}
                      <button
                        onClick={() => tapToken(tok, gloss)}
                        className={cx(
                          'rounded transition-colors active:bg-brand-200',
                          gloss
                            ? 'font-bold text-brand-700 underline decoration-brand-300 decoration-2 underline-offset-2'
                            : 'text-ink',
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
