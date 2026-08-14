import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import { getPassage } from '../data/passages.js'
import { getLevel } from '../data/levels.js'
import { getReadingStudy, passageWordCount } from '../data/reading-study.js'
import { readingRulesForPassage } from '../data/reading-rules.js'
import { phraseSpeechText } from '../lib/phrase-speech.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { ReadingRuleCard } from '../components/ReadingRuleCard.jsx'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { PosBadge } from '../components/WordBits.jsx'
import { Button, Card, Chip, IconButton, ProgressBar, cx } from '../components/ui.jsx'
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  BookmarkFilled,
  Cards,
  Check,
} from '../components/Icons.jsx'

const phraseLabel = (item) =>
  item.category === 'expression' ? '表現' : item.kind === 'syntax' ? '構文' : '熟語'

export function ReadingPrepScreen() {
  const passageId = useStore((state) => state.params.passageId)
  const navigate = useStore((state) => state.navigate)
  const myList = useStore((state) => state.myList)
  const srs = useStore((state) => state.srs)
  const toggleMyList = useStore((state) => state.toggleMyList)
  const addManyToMyList = useStore((state) => state.addManyToMyList)
  const [tab, setTab] = useState('words')

  const passage = getPassage(passageId)

  if (!passage) {
    return (
      <div>
        <ScreenHeader title="読解の準備" />
        <div className="p-8 text-center font-bold text-ink/50">長文が見つかりませんでした。</div>
      </div>
    )
  }

  const level = getLevel(passage.level)
  const { words, phrases } = getReadingStudy(passage)
  const passageRules = readingRulesForPassage(passage)
  const wordIds = words.map((word) => word.id)
  const itemIds = [...wordIds, ...phrases.map((item) => item.id)]
  const studied = itemIds.filter((id) => srs[id]).length
  const allSaved = wordIds.length > 0 && wordIds.every((id) => myList.includes(id))
  const continueTo = {
    screen: 'readingPrep',
    params: { passageId },
    label: '読解の準備に戻る',
  }

  const studyWords = () =>
    navigate('vocabStudy', {
      source: { type: 'deck', ids: wordIds },
      size: wordIds.length,
      title: `${passage.titleJa}・必須語彙`,
      mode: 'study',
      continueTo,
    })

  const studyPhrases = () =>
    navigate('phraseStudy', {
      source: { type: 'customPhrase', items: phrases },
      size: phrases.length,
      title: `${passage.titleJa}・熟語と表現`,
      mode: 'study',
      engine: 'phrase',
      continueTo,
    })

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader
        title="読解の準備"
        subtitle={passage.titleJa}
        color={level.color}
        right={<Chip color={level.color}>{passage.examTypes.join('・')}</Chip>}
      />

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <section className="pb-4 pt-1">
          <div className="flex items-start gap-3">
            <span
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl"
              style={{ backgroundColor: `${level.color}22` }}
            >
              {passage.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-xl font-extrabold leading-tight text-ink">
                {passage.title}
              </h1>
              <p className="mt-1 text-sm font-bold leading-relaxed text-ink/55">{passage.blurb}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-extrabold text-ink/45">
            <span>本文 {passageWordCount(passage)}語</span>
            <span>テーマ必須語彙 {words.length}語</span>
            <span>熟語・表現 {phrases.length}項目</span>
          </div>
        </section>

        <Card className="mb-4 p-4">
          <div className="text-xs font-extrabold text-ink/45">厳選テーマ</div>
          <div className="mt-1 font-display text-base font-extrabold text-ink">
            {passage.theme}
          </div>
          <div className="mt-3 text-xs font-extrabold text-ink/45">入試・英検の読解ポイント</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {passage.examFocus.map((focus) => (
              <Chip key={focus} color={level.color}>{focus}</Chip>
            ))}
          </div>
        </Card>

        <Card className="mb-4 p-4" data-reading-rules-for-passage={passage.id}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-extrabold text-ink/45">この本文で使う</div>
              <div className="mt-0.5 font-display text-lg font-extrabold text-ink">
                読解ルール {passageRules.length}件
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('readingRules')}
              className="shrink-0 rounded-full bg-brand-100 px-3 py-1.5 text-xs font-extrabold text-brand-700"
            >
              全30件
            </button>
          </div>
          <p className="mt-1 text-xs font-bold leading-relaxed text-ink/50">
            本文の構成と言葉から選んだルールです。読む前に二つ、迷った文で一つ開けば十分です。
          </p>
          <div className="mt-3 space-y-2">
            {passageRules.map((rule) => (
              <ReadingRuleCard key={rule.id} rule={rule} compact />
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-xs font-extrabold text-ink/45">事前学習</div>
              <div className="mt-0.5 font-display text-lg font-extrabold text-ink">
                {studied}/{itemIds.length} 項目を学習済み
              </div>
            </div>
            <span className="text-sm font-extrabold" style={{ color: level.color }}>
              {itemIds.length ? Math.round((studied / itemIds.length) * 100) : 0}%
            </span>
          </div>
          <ProgressBar
            className="mt-3"
            value={itemIds.length ? studied / itemIds.length : 0}
            color={level.color}
          />
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button onClick={studyWords} disabled={!words.length}>
              <Cards size={17} /> 必須語カード
            </Button>
            <Button variant="secondary" onClick={studyPhrases} disabled={!phrases.length}>
              <BookOpen size={17} /> 熟語・表現
            </Button>
          </div>
        </Card>

        <div className="mt-4 grid grid-cols-2 rounded-2xl bg-brand-100 p-1">
          {[
            { id: 'words', label: `必須語彙 ${words.length}` },
            { id: 'phrases', label: `熟語・表現 ${phrases.length}` },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={cx(
                'min-h-10 rounded-xl px-2 py-2 text-sm font-extrabold transition-colors',
                tab === item.id ? 'bg-white text-brand-700 shadow-sm' : 'text-brand-700/65',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === 'words' ? (
          <section className="mt-3">
            <Button
              full
              variant={allSaved ? 'soft' : 'hint'}
              disabled={allSaved}
              onClick={() => addManyToMyList(wordIds)}
            >
              {allSaved ? (
                <>
                  <Check size={17} /> 全語をマイ単語に保存済み
                </>
              ) : (
                <>
                  <Bookmark size={17} /> 全語をマイ単語に保存
                </>
              )}
            </Button>

            <div className="mt-3 space-y-2">
              {words.map((word) => {
                const saved = myList.includes(word.id)
                const learned = Boolean(srs[word.id])
                return (
                  <div
                    key={word.id}
                    className="flex min-h-16 items-center gap-2 rounded-2xl bg-white p-2.5 shadow-sm"
                  >
                    <SpeakButton text={word.word} size="sm" />
                    <button
                      onClick={() => navigate('wordDetail', { id: word.id })}
                      className="min-w-0 flex-1 text-left"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <PosBadge pos={word.pos} />
                        <span className="truncate font-display font-extrabold text-ink">{word.word}</span>
                        {learned && <Check size={15} className="shrink-0 text-emerald-500" />}
                      </div>
                      <div className="mt-0.5 truncate text-xs font-bold text-ink/55">{word.meaning}</div>
                    </button>
                    <IconButton
                      onClick={() => toggleMyList(word.id)}
                      className={saved ? 'text-hint' : 'text-ink/30'}
                      aria-label={saved ? 'マイ単語から外す' : 'マイ単語に保存'}
                    >
                      {saved ? <BookmarkFilled size={20} /> : <Bookmark size={20} />}
                    </IconButton>
                  </div>
                )
              })}
            </div>
          </section>
        ) : (
          <section className="mt-3 space-y-2">
            {phrases.map((item) => {
              const learned = Boolean(srs[item.id])
              const category = phraseLabel(item)
              return (
                <div key={item.id} className="rounded-2xl bg-white p-3 shadow-sm">
                  <div className="flex items-start gap-2">
                    <SpeakButton text={phraseSpeechText(item)} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-display font-extrabold text-ink">{item.phrase}</span>
                        <Chip color={category === '表現' ? '#0ea5e9' : '#8b5cf6'}>{category}</Chip>
                        {learned && <Check size={15} className="text-emerald-500" />}
                      </div>
                      <p className="mt-0.5 text-sm font-bold text-ink/60">{item.meaning}</p>
                      <p className="mt-1 text-xs font-bold leading-relaxed text-ink/40">{item.example.en}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </section>
        )}
      </div>

      <div className="shrink-0 border-t border-brand-100 bg-white/90 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur">
        <Button full size="lg" onClick={() => navigate('reader', { passageId })}>
          本文を読む <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  )
}
