import { useEffect, useState } from 'react'
import { useStore, todayIndex } from '../store/useStore.js'
import { PASSAGES } from '../data/passages.js'
import { LEVELS } from '../data/levels.js'
import { suggestStartPosition } from '../lib/session.js'
import {
  battleSource,
  enemyLevel,
  enemyLevelIndex,
} from '../lib/adaptive.js'
import {
  BATTLE_QUESTS,
  BATTLE_TACTICS,
  CHAPTERS,
  battleTactic,
  capEnemyPositionForHeroLevel,
  encounterFor,
  featuredBattleTacticId,
  featuredQuestId,
  heroProgress,
  relicStatLabel,
} from '../lib/rpg.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { HeroPortrait } from '../components/HeroPortrait.jsx'
import { MobPortrait } from '../components/MobPortrait.jsx'
import { ProgressRing, ProgressBar, Chip, cx } from '../components/ui.jsx'
import { Lightbulb, ArrowRight, Check } from '../components/Icons.jsx'

// テスト結果から弱点を判定するしきい値。
const MIN_ATTEMPTS = 10
const READING_MIN_ATTEMPTS = 4
const WEAK_ACC = 0.7

const SKILLS = [
  { id: 'vocab', label: '単語', emoji: '📖', color: '#6366f1', screen: 'vocabLevels', kind: 'acc' },
  { id: 'grammar', label: '文法', emoji: '💡', color: '#f59e0b', screen: 'grammar', kind: 'acc' },
  { id: 'usage', label: '語法・熟語', emoji: '✨', color: '#8b5cf6', screen: 'phrases', kind: 'acc' },
  { id: 'reading', label: '長文読解', emoji: '📚', color: '#10b981', screen: 'readingList', kind: 'reading' },
  { id: 'listening', label: 'リスニング', emoji: '🎧', color: '#0ea5e9', screen: 'listening', kind: 'acc' },
  { id: 'dictation', label: 'ディクテーション', emoji: '⌨️', color: '#14b8a6', screen: 'dictation', kind: 'acc' },
  { id: 'pronunciation', label: '発音チェック', emoji: '🎤', color: '#f43f5e', screen: 'pronounce', kind: 'acc' },
]

function skillInfo(skill, skillStats, readingsDone) {
  if (skill.kind === 'reading') {
    const total = PASSAGES.length
    const read = readingsDone.length
    const s = skillStats.reading
    const attempts = s?.answered ?? 0
    if (attempts < READING_MIN_ATTEMPTS) {
      return {
        status: attempts ? 'progress' : 'untested',
        value: 0,
        label: `読解 ${attempts}問・${read}/${total}本 読了`,
        attempts,
      }
    }
    const acc = s.correct / s.answered
    return {
      status: acc < WEAK_ACC ? 'weak' : 'ok',
      value: acc,
      acc,
      label: `読解正答率 ${Math.round(acc * 100)}%・${read}/${total}本`,
      attempts,
    }
  }

  const s = skillStats[skill.id]
  const attempts = s?.answered ?? 0
  if (attempts < MIN_ATTEMPTS) {
    return { status: 'untested', value: 0, label: `テスト ${attempts} 問`, attempts }
  }
  const acc = s.correct / s.answered
  return {
    status: acc < WEAK_ACC ? 'weak' : 'ok',
    value: acc,
    acc,
    label: `正答率 ${Math.round(acc * 100)}%・${attempts}問`,
    attempts,
  }
}

export function EnglishMapScreen() {
  const navigate = useStore((s) => s.navigate)
  const skillStats = useStore((s) => s.skillStats)
  const readingsDone = useStore((s) => s.readingsDone)
  const srs = useStore((s) => s.srs)
  const stats = useStore((s) => s.stats)
  const engPos = useStore((s) => s.engPos)
  const setEngPos = useStore((s) => s.setEngPos)
  const hero = heroProgress(stats.xp)
  const inferredPos = engPos ?? suggestStartPosition(srs)
  const pos = capEnemyPositionForHeroLevel(inferredPos, hero.level)

  useEffect(() => {
    if (engPos !== pos) setEngPos(pos)
  }, [engPos, pos, setEngPos])

  const day = todayIndex()
  const [tacticId, setTacticId] = useState(() => featuredBattleTacticId(day))
  const encounter = encounterFor({
    level: hero.level,
    day,
    enemyRankIndex: enemyLevelIndex(pos),
  })

  const infos = SKILLS.map((skill) => ({
    skill,
    info: skillInfo(skill, skillStats, readingsDone),
  }))
  const weak = infos
    .filter(({ info }) => info.status === 'weak')
    .sort((a, b) => (a.info.acc ?? 1) - (b.info.acc ?? 1))

  const startBattle = (quest) => {
    navigate('vocabQuiz', {
      source: {
        ...battleSource(pos),
        questId: quest.id,
        tacticId,
        adventureDay: day,
        heroLevel: hero.level,
      },
      title: `VS ${encounter.name}`,
      mode: 'quiz',
      size: quest.size,
    })
  }

  return (
    <div className="pb-8">
      <ScreenHeader
        title="冒険ギルド"
        subtitle="XPでLV1〜99へ育つ学習バトル"
        right={
          <Chip className="mr-2 bg-amber-100 text-amber-800">
            {hero.title.emoji} LV{hero.level}
          </Chip>
        }
      />

      <div className="space-y-4 px-4">
        <AdventureCard
          pos={pos}
          hero={hero}
          encounter={encounter}
          day={day}
          tacticId={tacticId}
          onTactic={setTacticId}
          onBattle={startBattle}
        />

        <AdventureProgress hero={hero} />

        <ChapterTrail hero={hero} />

        <RelicShelf hero={hero} />

        <section>
          <div className="mb-2 flex items-end justify-between px-1">
            <div>
              <p className="text-[10px] font-extrabold tracking-[0.18em] text-brand-500">
                TRAINING BOARD
              </p>
              <h2 className="font-display text-base font-extrabold text-ink">
                冒険を有利にする修行
              </h2>
            </div>
            <span className="text-[10px] font-bold text-ink/40">苦手を見つけて補強</span>
          </div>

          {weak.length > 0 ? (
            <div className="mb-3 rounded-2xl border-2 border-amber-300 bg-hint-soft p-3.5">
              <div className="flex items-center gap-1.5">
                <Lightbulb size={16} className="text-amber-600" />
                <span className="font-display text-sm font-extrabold text-amber-900">
                  攻略のヒント — 弱点を補強しよう
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {weak.map(({ skill, info }) => (
                  <button
                    key={skill.id}
                    onClick={() => navigate(skill.screen)}
                    className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-extrabold text-amber-800 shadow-sm active:scale-95"
                  >
                    {skill.emoji} {skill.label}
                    <span className="text-amber-500">（{Math.round(info.acc * 100)}%）</span>
                    <ArrowRight size={13} />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-3 rounded-2xl bg-correct-soft p-3.5 text-center text-sm font-bold text-emerald-700">
              大きな弱点なし。好きな修行を選んで先へ進もう 💪
            </div>
          )}

          <div className="space-y-2.5">
            {infos.map(({ skill, info }) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                info={info}
                onOpen={() => navigate(skill.screen)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function AdventureCard({
  pos,
  hero,
  encounter,
  day,
  tacticId,
  onTactic,
  onBattle,
}) {
  const enemyRank = enemyLevel(pos)
  const maxEnemyRank = LEVELS[hero.enemyRankCap]
  const featured = featuredQuestId(day)
  const featuredTactic = featuredBattleTacticId(day)
  const selectedTactic = battleTactic(tacticId)

  return (
    <section
      className="relative overflow-hidden rounded-[2rem] p-4 text-white shadow-[0_18px_50px_-22px_rgba(30,27,75,0.8)]"
      style={{ background: hero.chapter.gradient }}
    >
      <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-52 w-52 rounded-full bg-cyan-300/10 blur-2xl" />

      <div className="relative">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-black/20 px-2.5 py-1 text-[10px] font-extrabold tracking-[0.16em] text-white/80">
            CHAPTER {hero.chapter.number}
          </span>
          <span className="text-xs font-extrabold">
            {hero.chapter.emoji} {hero.chapter.name}
          </span>
          {encounter.isBoss && (
            <span className="ml-auto animate-pulse rounded-full bg-amber-300 px-2 py-1 text-[10px] font-extrabold text-amber-950">
              BOSS
            </span>
          )}
        </div>

        <div className="mt-3 rounded-2xl border border-white/15 bg-black/15 p-3 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <HeroPortrait
              level={hero.level}
              title={hero.title}
              className="h-14 w-14"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-display text-xl font-extrabold">LV{hero.level}</span>
                <span className="truncate text-xs font-extrabold text-white/75">
                  {hero.title.name}
                </span>
              </div>
              <div className="mt-1">
                <ProgressBar
                  value={hero.progress}
                  color="linear-gradient(90deg,#fde68a,#fbbf24)"
                  className="h-2 bg-white/15"
                />
              </div>
              <div className="mt-1 flex justify-between text-[10px] font-bold text-white/60">
                <span>{hero.totalXp.toLocaleString()} XP</span>
                <span>{hero.isMax ? 'MAX LEVEL' : `次まで ${hero.xpToNext} XP`}</span>
              </div>
              <div className="mt-1.5 grid grid-cols-3 gap-1 text-center text-[9px] font-extrabold">
                <span className="rounded-lg bg-white/10 px-1 py-1">
                  HP {hero.battleStats.maxHp}
                </span>
                <span className="rounded-lg bg-white/10 px-1 py-1">
                  ATK {hero.battleStats.attack}
                </span>
                <span className="rounded-lg bg-white/10 px-1 py-1">
                  DEF {hero.battleStats.defense}
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-3 text-xs font-bold leading-relaxed text-white/70">
          {hero.chapter.story}
        </p>

        <div className="mt-3 rounded-3xl bg-white p-3.5 text-ink shadow-xl shadow-black/15">
          <div
            className="mob-battle-stage -mx-3.5 -mt-3.5 mb-3.5 aspect-[16/9] rounded-t-3xl text-white"
            style={{ '--battle-scene': hero.chapter.gradient }}
          >
            <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-gradient-to-b from-slate-950/65 to-transparent px-3 pb-7 pt-2.5">
              <span className="rounded-full bg-white/15 px-2 py-1 text-[9px] font-extrabold tracking-[0.14em] backdrop-blur">
                LIVE BATTLE
              </span>
              <span className="text-[10px] font-extrabold text-violet-100">
                {encounter.isBoss ? '⚠ CHAPTER BOSS' : 'TODAY’S MOB'}
              </span>
            </div>
            <div className="relative flex h-full items-end justify-between gap-2 px-4 pb-4 pt-8">
              <div className="mb-1 flex shrink-0 flex-col items-center">
                <HeroPortrait
                  level={hero.level}
                  title={hero.title}
                  className="h-20 w-20"
                />
                <span className="mt-1 rounded-full bg-emerald-400 px-2 py-0.5 text-[8px] font-black tracking-wider text-emerald-950">
                  YOU · LV{hero.level}
                </span>
              </div>
              <div className="mob-versus-rune mb-12 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-amber-200/60 bg-slate-950/65 font-display text-xs font-black text-amber-300 shadow-[0_0_24px_rgba(251,191,36,0.35)]">
                VS
              </div>
              <MobPortrait
                encounter={encounter}
                className="h-[92%] max-h-44 min-h-28 aspect-square rounded-[2rem] ring-1 ring-white/40"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 z-10 h-8 bg-gradient-to-t from-slate-950/55 to-transparent" />
          </div>

          <div className="flex items-center gap-3">
            <MobPortrait
              encounter={encounter}
              decorative
              className="h-16 w-16 shrink-0 rounded-2xl ring-2 ring-violet-200"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-extrabold tracking-[0.14em] text-rose-500">
                {encounter.isBoss ? 'CHAPTER BOSS' : 'TODAY’S ENCOUNTER'}
              </p>
              <h2 className="truncate font-display text-lg font-extrabold">
                {encounter.name}
              </h2>
              <div className="mt-1 flex flex-wrap gap-1">
                <span
                  className="rounded-full border bg-white px-2 py-0.5 text-[9px] font-extrabold text-ink"
                  style={{ borderColor: encounter.accent }}
                >
                  {encounter.elementEmoji} {encounter.element}属性
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-ink/60">
                  {encounter.species}
                </span>
                <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[9px] font-bold text-violet-700">
                  {encounter.role}
                </span>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <Chip color={enemyRank.color}>敵ランク：英検{enemyRank.label}</Chip>
                <span className="text-[10px] font-bold text-ink/45">
                  LV{hero.level}の上限：英検{maxEnemyRank.label}
                </span>
              </div>
              {hero.nextEnemyRankUnlock && (
                <p className="mt-1 text-[9px] font-bold text-ink/40">
                  次の{hero.nextEnemyRankUnlock.label}は
                  LV{hero.nextEnemyRankUnlock.level}で解放
                </p>
              )}
            </div>
          </div>

          <p className="mt-2.5 rounded-2xl bg-slate-50 px-3 py-2 text-[10px] font-bold leading-relaxed text-ink/55">
            <span className="mr-1 font-extrabold text-brand-600">MOB図鑑：</span>
            {encounter.lore}
          </p>

          <div className="mt-2 grid gap-2">
            <div className="rounded-2xl bg-slate-900 px-3 py-2.5 text-xs font-bold leading-relaxed text-slate-100">
              <span className="mr-1 text-amber-300">▶</span>
              {encounter.intro}
            </div>
            <div className="flex items-center gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-rose-500 text-lg text-white shadow-sm">
                {encounter.elementEmoji}
              </span>
              <div className="min-w-0">
                <p className="text-[8px] font-black tracking-[0.16em] text-rose-500">
                  ENEMY INTENT · 次の行動
                </p>
                <p className="truncate text-xs font-extrabold text-rose-950">
                  {encounter.move}
                </p>
                <p className="truncate text-[9px] font-bold text-rose-800/65">
                  {encounter.intent}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-2xl border border-brand-100 bg-brand-50/70 p-2.5">
            <div className="flex items-end justify-between gap-2">
              <div>
                <p className="text-[9px] font-extrabold tracking-[0.15em] text-brand-500">
                  TACTIC CARD
                </p>
                <p className="text-xs font-extrabold text-ink">作戦を選ぶ</p>
              </div>
              <span className="text-[8px] font-bold text-ink/40">
                正答率・XPは共通
              </span>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {BATTLE_TACTICS.map((tactic) => {
                const selected = tactic.id === tacticId
                const isFeatured = tactic.id === featuredTactic
                return (
                  <button
                    key={tactic.id}
                    type="button"
                    onClick={() => onTactic(tactic.id)}
                    aria-pressed={selected}
                    aria-label={`${tactic.name}。${tactic.description}`}
                    className={cx(
                      'relative min-h-16 rounded-xl border-2 px-1 py-1.5 text-center transition-transform active:scale-95',
                      selected
                        ? 'border-brand-500 bg-white text-brand-900 shadow-sm'
                        : 'border-transparent bg-white/55 text-ink/55',
                    )}
                  >
                    {isFeatured && (
                      <span className="absolute -right-1 -top-1 rounded-full bg-amber-300 px-1.5 py-0.5 text-[7px] font-black text-amber-950">
                        今日
                      </span>
                    )}
                    <span className="block text-lg">{tactic.emoji}</span>
                    <span className="block text-[10px] font-extrabold">{tactic.label}</span>
                    <span className="block text-[8px] font-bold opacity-55">{tactic.short}</span>
                  </button>
                )
              })}
            </div>
            <p
              className="mt-2 rounded-xl bg-white px-2.5 py-2 text-[10px] font-bold leading-relaxed text-ink/60"
              aria-live="polite"
            >
              <span className="font-extrabold text-brand-700">
                {selectedTactic.emoji} {selectedTactic.name}：
              </span>
              {selectedTactic.description}
            </p>
          </div>

          <p className="mt-3 text-[10px] font-extrabold text-ink/45">
            戦闘時間を選ぶ
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {BATTLE_QUESTS.map((quest) => {
              const isFeatured = quest.id === featured
              return (
                <button
                  key={quest.id}
                  onClick={() => onBattle(quest)}
                  aria-label={`${quest.label}を開始。${quest.size}問、${quest.minutes}`}
                  className={cx(
                    'relative flex min-h-24 flex-col items-center justify-center rounded-2xl border-2 px-1.5 py-2 text-center transition-transform active:scale-95',
                    isFeatured
                      ? 'border-amber-300 bg-amber-50 text-amber-950'
                      : 'border-brand-100 bg-brand-50 text-brand-900',
                  )}
                >
                  {isFeatured && (
                    <span className="absolute -top-2 rounded-full bg-amber-400 px-2 py-0.5 text-[8px] font-extrabold text-amber-950">
                      今日のおすすめ
                    </span>
                  )}
                  <span className="text-xl">{quest.emoji}</span>
                  <span className="mt-0.5 text-xs font-extrabold">{quest.label}</span>
                  <span className="mt-0.5 text-[9px] font-bold opacity-55">
                    {quest.size}問・{quest.minutes}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <p className="mt-2.5 text-center text-[10px] font-bold leading-relaxed text-white/65">
          敵ランクは、冒険者LVで解放済みの範囲内だけで成績に合わせて変わります。
        </p>
      </div>
    </section>
  )
}

function AdventureProgress({ hero }) {
  const next = hero.nextRelic
  const progress = hero.chapter.maxLevel === hero.chapter.minLevel
    ? 1
    : (hero.level - hero.chapter.minLevel)
      / (hero.chapter.maxLevel - hero.chapter.minLevel)

  return (
    <section className="rounded-3xl bg-white p-4 shadow-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-extrabold tracking-[0.16em] text-brand-500">
            NEXT REWARD
          </p>
          <h2 className="font-display text-base font-extrabold text-ink">
            {next ? `${next.emoji} ${next.name}` : '👑 すべての戦利品を獲得'}
          </h2>
        </div>
        <span className="rounded-full bg-brand-100 px-2.5 py-1 text-xs font-extrabold text-brand-700">
          {next ? `LV${next.level}` : 'COMPLETE'}
        </span>
      </div>
      <p className="mt-1 text-xs font-bold text-ink/45">
        {next ? next.text : 'LV99の冒険は、何度でも続けられます。'}
      </p>
      {next && (
        <p className="mt-1 text-[10px] font-extrabold text-emerald-600">
          装備効果：{relicStatLabel(next)}
        </p>
      )}
      <div className="mt-3 flex items-center gap-3">
        <span className="text-[10px] font-bold text-ink/45">章の進行</span>
        <ProgressBar value={progress} color={hero.chapter.gradient} className="flex-1" />
        <span className="text-[10px] font-extrabold text-ink/60">
          {hero.level}/{hero.chapter.maxLevel}
        </span>
      </div>
    </section>
  )
}

function ChapterTrail({ hero }) {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between px-1">
        <h2 className="font-display text-base font-extrabold text-ink">冒険の章</h2>
        <span className="text-[10px] font-bold text-ink/40">LV1 → LV99</span>
      </div>
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {CHAPTERS.map((chapter) => {
          const current = chapter.id === hero.chapter.id
          const cleared = hero.level > chapter.maxLevel
          const locked = hero.level < chapter.minLevel
          return (
            <div
              key={chapter.id}
              className={cx(
                'flex w-28 shrink-0 flex-col rounded-2xl border-2 p-3',
                current && 'border-brand-400 bg-brand-50 shadow-card',
                cleared && 'border-emerald-200 bg-emerald-50',
                locked && 'border-transparent bg-white opacity-55',
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">{cleared ? '✅' : chapter.emoji}</span>
                <span className="text-[9px] font-extrabold text-ink/35">
                  {chapter.minLevel === chapter.maxLevel
                    ? `LV${chapter.minLevel}`
                    : `LV${chapter.minLevel}–${chapter.maxLevel}`}
                </span>
              </div>
              <span className="mt-2 text-xs font-extrabold leading-tight text-ink">
                {chapter.name}
              </span>
              <span className="mt-1 text-[9px] font-bold text-ink/40">
                {current ? '冒険中' : cleared ? '踏破済み' : '未解放'}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function RelicShelf({ hero }) {
  const newest = [...hero.relics].reverse().slice(0, 3)
  return (
    <section>
      <div className="mb-2 flex items-center justify-between px-1">
        <h2 className="font-display text-base font-extrabold text-ink">戦利品コレクション</h2>
        <span className="text-[10px] font-bold text-ink/40">{hero.relics.length}/21</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {newest.map((relic) => (
          <div
            key={relic.level}
            className="flex min-h-24 flex-col items-center justify-center rounded-2xl bg-white p-2 text-center shadow-card"
          >
            <span className="text-2xl">{relic.emoji}</span>
            <span className="mt-1 text-[10px] font-extrabold leading-tight text-ink">
              {relic.name}
            </span>
            <span className="mt-1 text-[9px] font-extrabold text-emerald-600">
              {relicStatLabel(relic)}
            </span>
            <span className="mt-0.5 text-[9px] font-bold text-ink/35">LV{relic.level}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

const STATUS_BADGE = {
  weak: { label: '弱点', cls: 'bg-amber-100 text-amber-700' },
  ok: { label: '良好', cls: 'bg-emerald-100 text-emerald-700' },
  progress: { label: '学習中', cls: 'bg-brand-100 text-brand-700' },
  untested: { label: 'テスト不足', cls: 'bg-ink/10 text-ink/50' },
}

function SkillCard({ skill, info, onOpen }) {
  const badge = STATUS_BADGE[info.status]
  const ringColor =
    info.status === 'weak'
      ? '#f59e0b'
      : info.status === 'ok'
        ? '#10b981'
        : skill.color

  return (
    <button
      onClick={onOpen}
      className="flex w-full items-center gap-3 rounded-2xl bg-white p-3.5 text-left shadow-card transition-transform active:scale-[0.98]"
    >
      <ProgressRing value={info.value} size={52} stroke={6} color={ringColor} track="#eee">
        <span className="text-xl leading-none">{skill.emoji}</span>
      </ProgressRing>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-display font-extrabold text-ink">{skill.label}</span>
          <Chip className={cx(badge.cls)}>
            {info.status === 'ok' && <Check size={12} />} {badge.label}
          </Chip>
        </div>
        <div className="mt-0.5 text-xs font-bold text-ink/45">
          {info.status === 'untested'
            ? `${info.label}（テストして弱点を診断）`
            : info.label}
        </div>
      </div>
      <span className="text-ink/30">
        <ArrowRight size={20} />
      </span>
    </button>
  )
}
