import { useEffect, useRef } from 'react'
import { useStore } from '../store/useStore.js'
import { getWord, neighborWords, rootIdsForWord, vocabFieldFor } from '../data/vocab.js'
import { getLevel } from '../data/levels.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { EtymologyBlock, RelatedWords, PosBadge } from '../components/WordBits.jsx'
import { UsageGuideCards } from '../components/UsageGuideCards.jsx'
import { LearningStatusBars } from '../components/LearningStatusBars.jsx'
import { Card, Button, Chip, IconButton } from '../components/ui.jsx'
import { Bookmark, BookmarkFilled, Link, Lightbulb, ArrowRight } from '../components/Icons.jsx'
import { summarizeSrsItems } from '../lib/contentProgress.js'
import { cx } from '../components/ui.jsx'

const toId = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')

// 類義語・反対語・派生語のチップ。items=[{w,m}]。辞書にある語はタップで詳細へ。
const TONES = {
  syn: 'bg-brand-50 text-brand-700 ring-brand-100',
  ant: 'bg-rose-50 text-rose-600 ring-rose-100',
  der: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  fam: 'bg-violet-50 text-violet-700 ring-violet-100',
}
function RefChips({ items, tone, navigate }) {
  const cls = TONES[tone] ?? TONES.syn
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((it, i) => {
        const exists = getWord(toId(it.w))
        const body = (
          <>
            <span className="font-extrabold">{it.w}</span>
            {it.m && <span className="font-bold opacity-70">{it.m}</span>}
            {exists && (
              <span className="rounded-full bg-white/70 px-1 text-[9px] font-extrabold leading-tight ring-1 ring-current/20">
                {getLevel(exists.level).label}
              </span>
            )}
            {exists && <ArrowRight size={11} className="opacity-70" />}
          </>
        )
        const base = 'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ring-1'
        return exists ? (
          <button key={i} onClick={() => navigate('wordDetail', { id: toId(it.w) })} className={cx(base, cls, 'active:opacity-80')}>
            {body}
          </button>
        ) : (
          <span key={i} className={cx(base, cls)}>{body}</span>
        )
      })}
    </div>
  )
}

// 辞書の前後（アルファベット順で隣り合う見出し語）。ページをめくる感覚で移動。
function NeighborList({ word, navigate }) {
  const { prev, next } = neighborWords(word.id, 2, 2)
  const Row = ({ w, dir }) => {
    const lv = getLevel(w.level)
    return (
      <button
        onClick={() => navigate('wordDetail', { id: w.id })}
        className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left active:bg-brand-50"
      >
        <span className="w-4 shrink-0 text-center text-xs font-extrabold text-brand-300">
          {dir === 'prev' ? '↑' : '↓'}
        </span>
        <span className="font-display font-extrabold text-ink">{w.word}</span>
        <Chip color={lv.color}>{lv.label}</Chip>
        <span className="min-w-0 flex-1 truncate text-xs font-bold text-ink/45">{w.meaning}</span>
      </button>
    )
  }
  return (
    <Card className="p-3">
      <div className="mb-1 px-1 text-[11px] font-extrabold uppercase tracking-wide text-ink/35">辞書の前後</div>
      <div className="divide-y divide-brand-50">
        {prev.map((w) => <Row key={w.id} w={w} dir="prev" />)}
        <div className="flex items-center gap-2 px-2 py-2">
          <span className="w-4 shrink-0 text-center text-xs font-extrabold text-brand-400">●</span>
          <span className="font-display font-extrabold text-brand-600">{word.word}</span>
        </div>
        {next.map((w) => <Row key={w.id} w={w} dir="next" />)}
      </div>
    </Card>
  )
}

export function WordDetailScreen() {
  const screenRef = useRef(null)
  const id = useStore((s) => s.params.id)
  const navigate = useStore((s) => s.navigate)
  const myList = useStore((s) => s.myList)
  const toggleMyList = useStore((s) => s.toggleMyList)
  const recordVocabHistory = useStore((s) => s.recordVocabHistory)
  const entry = useStore((s) => s.srs[id])
  const word = getWord(id)

  useEffect(() => {
    if (word) recordVocabHistory(word.id)
  }, [recordVocabHistory, word])

  useEffect(() => {
    screenRef.current?.closest('.study-app-content')?.scrollTo({ top: 0 })
  }, [word?.id])

  if (!word) {
    return (
      <div>
        <ScreenHeader title="単語" />
        <div className="p-8 text-center font-bold text-ink/50">単語が見つかりませんでした。</div>
      </div>
    )
  }

  const level = getLevel(word.level)
  const saved = myList.includes(word.id)
  const progress = summarizeSrsItems([word], entry ? { [word.id]: entry } : {})

  return (
    <div ref={screenRef} className="pb-28">
      <ScreenHeader
        title={word.word}
        color={level.color}
        right={
          <IconButton
            onClick={() => toggleMyList(word.id)}
            className={saved ? 'text-hint' : 'text-ink/30'}
            aria-label="マイ単語に保存"
          >
            {saved ? <BookmarkFilled size={24} /> : <Bookmark size={24} />}
          </IconButton>
        }
      />

      <div className="space-y-4 px-4">
        {/* ヒーロー */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <PosBadge pos={word.pos} />
              <Chip color={level.color}>英検{level.label}</Chip>
              {word.field && (
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-600 ring-1 ring-emerald-100">
                  {vocabFieldFor(word)}
                </span>
              )}
            </div>
          </div>
          <div className="mt-3 flex items-end gap-3">
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink">{word.word}</h1>
            <SpeakButton text={word.word} size="md" className="mb-1" />
          </div>
          {word.phonetic && <p className="mt-1 text-sm font-bold text-ink/45">{word.phonetic}</p>}
          <div className="mt-3 rounded-2xl bg-brand-50 p-3">
            <div className="font-display text-xl font-extrabold text-ink">{word.meanings.join('・')}</div>
          </div>
          <LearningStatusBars progress={progress} className="mt-4" compact units={{ learning: '語', quiz: '問' }} />
        </Card>

        {/* 例文 */}
        {word.example && (
          <Card className="p-4">
            <div className="mb-1 text-[11px] font-extrabold uppercase tracking-wide text-brand-400">例文</div>
            <div className="flex items-start gap-2">
              <SpeakButton text={word.example.en} size="sm" />
              <div className="flex-1">
                <p className="font-bold text-ink">{word.example.en}</p>
                <p className="mt-0.5 text-sm font-bold text-ink/55">{word.example.ja}</p>
              </div>
            </div>
          </Card>
        )}

        {/* 使い方・使い分け＋派生語 */}
        {(word.usage || word.derivatives?.length > 0) && (
          <Card className="space-y-3 p-4">
            {word.usage && (
              <div>
                <div className="mb-2 flex items-center gap-1.5 text-amber-600">
                  <Lightbulb size={16} />
                  <span className="text-[11px] font-extrabold uppercase tracking-wide">使い方・使い分け</span>
                </div>
                <p className="text-sm font-bold leading-relaxed text-amber-900/90">{word.usage}</p>
              </div>
            )}
            {word.derivatives?.length > 0 && (
              <div>
                <div className="mb-1.5 text-[11px] font-extrabold uppercase tracking-wide text-emerald-500">派生語</div>
                <RefChips items={word.derivatives} tone="der" navigate={navigate} />
              </div>
            )}
          </Card>
        )}

        {/* 入試・英検で混同しやすい語の比較と推奨表現 */}
        <UsageGuideCards guides={word.usageGuides} />

        {/* 語族（基語＋関連形） */}
        {word.family?.length > 0 && (
          <Card className="p-4">
            <div className="mb-1.5 flex items-center gap-1.5 text-violet-500">
              <Link size={16} />
              <span className="text-[11px] font-extrabold uppercase tracking-wide">語族（同じ語根の仲間）</span>
            </div>
            <RefChips items={word.family} tone="fam" navigate={navigate} />
          </Card>
        )}

        {/* 類義語・反対語 */}
        {(word.synonyms?.length > 0 || word.antonyms?.length > 0) && (
          <Card className="space-y-3 p-4">
            {word.synonyms?.length > 0 && (
              <div>
                <div className="mb-1.5 text-[11px] font-extrabold uppercase tracking-wide text-brand-400">類義語・同義語</div>
                <RefChips items={word.synonyms} tone="syn" navigate={navigate} />
              </div>
            )}
            {word.antonyms?.length > 0 && (
              <div>
                <div className="mb-1.5 text-[11px] font-extrabold uppercase tracking-wide text-rose-400">反対語</div>
                <RefChips items={word.antonyms} tone="ant" navigate={navigate} />
              </div>
            )}
          </Card>
        )}

        {/* 語源（ある単語のみ） */}
        {word.etymology && (
          <Card className="p-4">
            <div className="mb-3 text-sm font-extrabold text-brand-600">語源で覚える</div>
            <EtymologyBlock
              word={word}
              onRoot={(rootId) => navigate('rootDetail', { rootId })}
              onPack={(packId, compression) =>
                compression.mode === 'root'
                  ? navigate('rootDetail', { rootId: compression.rootId })
                  : navigate('etymologyPack', { packId })}
            />
          </Card>
        )}

        {/* 語源つながり */}
        {rootIdsForWord(word).length > 0 && (
          <Card className="p-4">
            <div className="mb-3 flex items-center gap-1.5 text-brand-600">
              <Link size={16} />
              <span className="text-[11px] font-extrabold uppercase tracking-wide">この語源から増やせる単語</span>
            </div>
            <RelatedWords
              word={word}
              onPick={(wid) => navigate('wordDetail', { id: wid })}
              onRoot={(rootId) => navigate('rootDetail', { rootId })}
            />
          </Card>
        )}

        {/* 辞書の前後（隣の見出し語へ） */}
        <NeighborList word={word} navigate={navigate} />
      </div>

      {/* 保存ボタン（固定） */}
      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md border-t border-brand-100 bg-white/95 p-4 pb-[calc(1rem+var(--app-safe-bottom))] backdrop-blur">
        <Button full variant={saved ? 'soft' : 'primary'} onClick={() => toggleMyList(word.id)}>
          {saved ? <BookmarkFilled size={18} /> : <Bookmark size={18} />}
          {saved ? 'マイ単語に保存済み（タップで解除）' : 'マイ単語リストに保存'}
        </Button>
      </div>
    </div>
  )
}
