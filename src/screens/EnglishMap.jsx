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
  battleQuest,
  battleRelicForLevel,
  battleTactic,
  capEnemyPositionForHeroLevel,
  encounterFor,
  featuredBattleTacticId,
  featuredQuestId,
  heroProgress,
  relicBattleAbility,
  relicStatLabel,
} from '../lib/rpg.js'
import {
  BATTLE_STAR_PER_CORRECT,
  BATTLE_STARS_PER_EXCHANGE,
  BATTLE_THEMES,
  BATTLE_XP_PER_EXCHANGE,
  battleXpExchange,
  battleThemeById,
  nextBattleTheme,
} from '../lib/battleThemes.js'
import {
  BATTLE_DAILY_SCENES,
  BATTLE_EMOTION_STATES,
  BATTLE_RIVAL_GROUPS,
  BATTLE_RIVALS,
  BATTLE_STUDENTS,
  battleDailySceneById,
  battleEmotionById,
  battleRivalForEncounter,
  battleStudentById,
  battleStudentPortrait,
} from '../lib/battleCast.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { ProgressRing, ProgressBar, Chip, cx } from '../components/ui.jsx'
import { Lightbulb, ArrowRight, Check } from '../components/Icons.jsx'

// テスト結果から弱点を判定するしきい値。
const MIN_ATTEMPTS = 10
const READING_MIN_ATTEMPTS = 4
const WEAK_ACC = 0.7
const PASSAGE_IDS = new Set(PASSAGES.map((passage) => passage.id))

const SKILLS = [
  { id: 'vocab', label: '単語', emoji: '📖', color: '#6366f1', screen: 'vocabLevels', kind: 'acc' },
  { id: 'grammar', label: '文法', emoji: '💡', color: '#f59e0b', screen: 'grammar', kind: 'acc' },
  { id: 'usage', label: '語法・熟語', emoji: '✨', color: '#8b5cf6', screen: 'phrases', kind: 'acc' },
  { id: 'reading', label: '長文読解', emoji: '📚', color: '#10b981', screen: 'readingList', kind: 'reading' },
  { id: 'listening', label: 'リスニング', emoji: '🎧', color: '#0ea5e9', screen: 'listening', kind: 'acc' },
  { id: 'dictation', label: 'ディクテーション', emoji: '⌨️', color: '#14b8a6', screen: 'dictation', kind: 'acc' },
]

function skillInfo(skill, skillStats, readingsDone) {
  if (skill.kind === 'reading') {
    const total = PASSAGES.length
    // 名作交互朗読も同じ readingsDone へ保存するため、英検長文だけを数える。
    const read = new Set(readingsDone.filter((id) => PASSAGE_IDS.has(id))).size
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
  const battleRelicLevel = useStore((s) => s.battleRelicLevel)
  const setBattleRelicLevel = useStore((s) => s.setBattleRelicLevel)
  const battleStars = useStore((s) => s.battleStars)
  const battleXpSpent = useStore((s) => s.battleXpSpent)
  const exchangeXpForBattleStars = useStore((s) => s.exchangeXpForBattleStars)
  const battleThemeId = useStore((s) => s.battleThemeId)
  const setBattleThemeId = useStore((s) => s.setBattleThemeId)
  const battleStudentId = useStore((s) => s.battleStudentId)
  const setBattleStudentId = useStore((s) => s.setBattleStudentId)
  const hero = heroProgress(stats.xp)
  const battleRelic = battleRelicForLevel(hero.level, battleRelicLevel)
  const battleTheme = battleThemeById(battleThemeId, battleStars)
  const battleStudent = battleStudentById(battleStudentId)
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
  const battleRival = battleRivalForEncounter(encounter, day)

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
        relicLevel: battleRelic.level,
        themeId: battleTheme.id,
        studentId: battleStudent.id,
        rivalId: battleRival.id,
        adventureDay: day,
        heroLevel: hero.level,
      },
      title: `VS ${battleRival.name}`,
      mode: 'quiz',
      size: quest.size,
    })
  }

  return (
    <div className="pb-8">
      <ScreenHeader
        title="放課後バトル"
        subtitle="先生や校内モンスターと、ことばで勝負！"
        right={
          <div className="mr-2 flex items-center gap-1">
            <Chip className="bg-violet-100 text-violet-800">
              ✦ {battleStars.toLocaleString()}
            </Chip>
            <Chip className="bg-amber-100 text-amber-800">
              {hero.title.emoji} LV{hero.level}
            </Chip>
          </div>
        }
      />

      <div className="space-y-4 px-4">
        <AdventureCard
          pos={pos}
          hero={hero}
          encounter={encounter}
          day={day}
          tacticId={tacticId}
          battleRelic={battleRelic}
          battleStars={battleStars}
          battleTheme={battleTheme}
          battleStudent={battleStudent}
          battleRival={battleRival}
          onTactic={setTacticId}
          onRelic={setBattleRelicLevel}
          onTheme={setBattleThemeId}
          onBattle={startBattle}
        />

        <XpExchangeCard
          totalXp={stats.xp}
          spentXp={battleXpSpent}
          battleStars={battleStars}
          onExchange={exchangeXpForBattleStars}
        />

        <AfterSchoolWorld
          battleStars={battleStars}
          selectedTheme={battleTheme}
          onTheme={setBattleThemeId}
        />

        <CampusLifeGallery />

        <BattleCastRoster
          selectedStudentId={battleStudent.id}
          onStudent={setBattleStudentId}
        />

        <AdventureProgress hero={hero} />

        <ChapterTrail hero={hero} />

        <section>
          <div className="mb-2 flex items-end justify-between px-1">
            <div>
              <p className="text-[10px] font-extrabold tracking-[0.18em] text-brand-500">
                TRAINING BOARD
              </p>
              <h2 className="font-display text-base font-extrabold text-ink">
                バトル前のトレーニング
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

function XpExchangeCard({ totalXp, spentXp, battleStars, onExchange }) {
  const [message, setMessage] = useState('')
  const exchange = battleXpExchange(totalXp, spentXp, battleStars)

  const exchangeNow = () => {
    if (!exchange.canExchange) return
    onExchange()
    setMessage(
      `${exchange.xpCost.toLocaleString()} XPを、放課後スター ${exchange.starsGained.toLocaleString()}個に変換しました。`,
    )
  }

  return (
    <section className="overflow-hidden rounded-3xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 via-white to-violet-50 p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[9px] font-extrabold tracking-[0.18em] text-amber-600">
            XP CONVERTER
          </p>
          <h2 className="mt-0.5 font-display text-base font-extrabold text-ink">
            学習XPをゲームの力へ
          </h2>
        </div>
        <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-extrabold text-amber-800">
          {BATTLE_XP_PER_EXCHANGE} XP → ✦ {BATTLE_STARS_PER_EXCHANGE}
        </span>
      </div>

      <p className="mt-2 text-[10px] font-bold leading-relaxed text-ink/50">
        英語クイズなどで貯めた未変換XPを、ドット絵エリアの解放に使う放課後スターへ変換できます。
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-white px-3 py-2.5 ring-1 ring-amber-100">
          <span className="block text-[9px] font-bold text-ink/40">交換できるXP</span>
          <strong className="mt-0.5 block font-display text-lg font-extrabold text-amber-700">
            {exchange.availableXp.toLocaleString()} XP
          </strong>
          <span className="block text-[8px] font-bold text-ink/35">
            累計 {exchange.totalXp.toLocaleString()} XP
          </span>
        </div>
        <div className="rounded-2xl bg-white px-3 py-2.5 ring-1 ring-violet-100">
          <span className="block text-[9px] font-bold text-ink/40">放課後スター</span>
          <strong className="mt-0.5 block font-display text-lg font-extrabold text-violet-700">
            ✦ {battleStars.toLocaleString()}
          </strong>
          <span className="block text-[8px] font-bold text-ink/35">
            背景・エリア能力の解放に使用
          </span>
        </div>
      </div>

      <button
        type="button"
        disabled={!exchange.canExchange}
        onClick={exchangeNow}
        className="mt-3 min-h-12 w-full rounded-2xl bg-gradient-to-r from-amber-500 to-violet-600 px-3 py-2.5 font-display text-sm font-extrabold text-white shadow-md transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:from-slate-200 disabled:to-slate-300 disabled:text-slate-500 disabled:shadow-none"
      >
        {exchange.canExchange
          ? `${exchange.xpCost.toLocaleString()} XPを ✦ ${exchange.starsGained.toLocaleString()} にまとめて変換`
          : exchange.starCapacityReached
            ? '放課後スターは上限です'
            : `あと ${exchange.xpUntilNext.toLocaleString()} XPで変換できます`}
      </button>

      <p className="mt-2 text-center text-[9px] font-bold leading-relaxed text-ink/40">
        LVに使う累計XPは減りません。一度変換した分は再変換できません。
      </p>
      <p className="sr-only" aria-live="polite" role="status">
        {message}
      </p>
    </section>
  )
}

function AdventureCard({
  pos,
  hero,
  encounter,
  day,
  tacticId,
  battleRelic,
  battleStars,
  battleTheme,
  battleStudent,
  battleRival,
  onTactic,
  onRelic,
  onTheme,
  onBattle,
}) {
  const enemyRank = enemyLevel(pos)
  const maxEnemyRank = LEVELS[hero.enemyRankCap]
  const featured = featuredQuestId(day)
  const featuredTactic = featuredBattleTacticId(day)
  const selectedTactic = battleTactic(tacticId)
  const [questId, setQuestId] = useState(featured)
  const selectedQuest = battleQuest(questId)
  const itemAbility = relicBattleAbility(battleRelic)
  const nextTheme = nextBattleTheme(battleStars)
  const opponentLabel = encounter.isTeacher
    ? `${encounter.teacherSubject}の先生チャレンジ`
    : '校内モンスター'

  return (
    <section
      className="school-battle-card relative overflow-hidden rounded-[2rem] p-4 text-white shadow-[0_18px_50px_-22px_rgba(79,70,229,0.65)]"
      style={{
        background: battleTheme.gradient,
        '--battle-accent': battleTheme.accent,
        '--battle-accent-strong': battleTheme.accentStrong,
      }}
    >
      <div className="pointer-events-none absolute -right-10 -top-12 text-[9rem] opacity-[0.08]">
        {hero.chapter.emoji}
      </div>
      <div className="pointer-events-none absolute -bottom-20 -left-16 h-48 w-48 rounded-full bg-pink-300/20 blur-3xl" />

      <div className="relative">
        <div className="flex items-center gap-2.5">
          <span className="rounded-full border border-white/25 bg-white/15 px-2.5 py-1 text-[10px] font-extrabold tracking-[0.14em] text-white/90 backdrop-blur">
            SCHOOL STAGE {hero.chapter.number}
          </span>
          <span className="min-w-0 truncate text-xs font-extrabold">
            {hero.chapter.emoji} {hero.chapter.name}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <span className="battle-map-student-portrait h-12 w-12 shrink-0 overflow-hidden rounded-2xl">
            <img
              src={battleStudentPortrait(battleStudent.id, 'confident')}
              alt={`${battleStudent.name}の自信の表情`}
              className="h-full w-full object-cover [image-rendering:pixelated]"
            />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-xs font-extrabold">
                LV{hero.level} · {hero.title.name}
              </span>
              <span className="shrink-0 text-[10px] font-bold text-white/65">
                {hero.isMax ? 'MAX' : `次まで ${hero.xpToNext} XP`}
              </span>
            </div>
            <ProgressBar
              value={hero.progress}
              color="linear-gradient(90deg,#fde68a,#f9a8d4)"
              className="mt-1.5 h-2 bg-white/15"
            />
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-white/20 bg-slate-950/20 px-3 py-2.5 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-2 text-[10px] font-extrabold">
            <span>✦ 放課後スター {battleStars.toLocaleString()}</span>
            <span className="text-white/70">正解1問 +{BATTLE_STAR_PER_CORRECT}</span>
          </div>
          {nextTheme ? (
            <>
              <ProgressBar
                value={battleStars / nextTheme.unlockAt}
                color="linear-gradient(90deg,#fde68a,#f9a8d4,#67e8f9)"
                className="mt-2 h-1.5 bg-white/15"
              />
              <p className="mt-1 text-[9px] font-bold text-white/70">
                あと {(nextTheme.unlockAt - battleStars).toLocaleString()} で
                {' '}{nextTheme.emoji} {nextTheme.name} を解放
              </p>
            </>
          ) : (
            <p className="mt-1 text-[9px] font-bold text-white/70">
              3つのバトル演出をすべて解放済み
            </p>
          )}
        </div>

        <div className="school-battle-paper mt-3 rounded-[1.65rem] bg-white p-3.5 text-ink shadow-xl shadow-black/15">
          <div className="flex items-center gap-3.5">
            <span className="battle-map-rival-portrait h-24 w-24 shrink-0 overflow-hidden rounded-[1.7rem] ring-4 ring-violet-100">
              <img
                src={battleRival.portrait}
                alt={`${battleRival.name}のドット絵ポートレート`}
                className="h-full w-full object-cover [image-rendering:pixelated]"
              />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-extrabold tracking-[0.12em] text-violet-500">
                {battleRival.title} · TODAY
              </p>
              <h2 className="mt-0.5 font-display text-lg font-extrabold leading-tight">
                {battleRival.name}
              </h2>
              <p className="mt-1 text-[10px] font-bold text-ink/45">
                {opponentLabel} · {encounter.name} · 英検{enemyRank.label}
              </p>
              <div className="mt-2 inline-flex max-w-full items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1.5 text-[10px] font-extrabold text-rose-700">
                <span>{encounter.attackEmoji ?? encounter.elementEmoji}</span>
                <span className="truncate">{encounter.move}</span>
              </div>
            </div>
          </div>

          <p className="mt-3 rounded-2xl bg-violet-50/75 px-3 py-2.5 text-[11px] font-bold leading-relaxed text-ink/65">
            <span className="mr-1">{encounter.isTeacher ? '💬' : '✨'}</span>
            {battleRival.name}が「{encounter.move}」で待ち受ける。{encounter.intro}
          </p>

          <div className="mt-3">
            <div className="flex items-end justify-between gap-2">
              <div>
                <p className="text-[9px] font-extrabold tracking-[0.14em] text-violet-500">
                  BATTLE SIZE
                </p>
                <p className="text-xs font-extrabold text-ink">問題数をえらぶ</p>
              </div>
              <span className="text-[9px] font-bold text-ink/40">
                上限 英検{maxEnemyRank.label}
              </span>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {BATTLE_QUESTS.map((quest) => {
                const selected = quest.id === questId
                return (
                  <button
                    key={quest.id}
                    type="button"
                    onClick={() => setQuestId(quest.id)}
                    aria-pressed={selected}
                    className={cx(
                      'relative min-h-14 rounded-2xl border-2 px-1.5 py-2 text-center transition-transform active:scale-95',
                      selected
                        ? 'border-violet-500 bg-violet-50 text-violet-900 shadow-sm'
                        : 'border-slate-100 bg-white text-ink/55',
                    )}
                  >
                    {quest.id === featured && (
                      <span className="absolute -right-1 -top-1 rounded-full bg-amber-300 px-1.5 py-0.5 text-[7px] font-black text-amber-950">
                        おすすめ
                      </span>
                    )}
                    <span className="block text-sm">{quest.emoji}</span>
                    <span className="block text-[11px] font-extrabold">{quest.size}問</span>
                    <span className="block text-[8px] font-bold opacity-50">{quest.minutes}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <details className="school-battle-options mt-3 rounded-2xl border border-violet-100 bg-violet-50/55">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 px-3 py-2 text-xs font-extrabold text-violet-800">
              <span>⚙️ 作戦・持ち物・演出</span>
              <span className="text-[9px] font-bold text-violet-500">
                {selectedTactic.emoji} {battleRelic.emoji} {battleTheme.emoji} 変更
              </span>
            </summary>
            <div className="border-t border-violet-100 px-3 pb-3 pt-2.5">
              <p className="text-[9px] font-bold text-ink/45">
                作戦（正答率・XPは変わりません）
              </p>
              <div className="mt-1.5 grid grid-cols-3 gap-1.5">
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
                        ? 'border-violet-500 bg-white text-violet-900 shadow-sm'
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
                  </button>
                )
              })}
              </div>
              <p className="mt-2.5 text-[9px] font-bold text-ink/45">
                バトル演出（放課後スターで解放）
              </p>
              <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                {BATTLE_THEMES.map((theme) => {
                  const unlocked = battleStars >= theme.unlockAt
                  const selected = theme.id === battleTheme.id
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      disabled={!unlocked}
                      onClick={() => onTheme(theme.id)}
                      aria-pressed={selected}
                      aria-label={
                        unlocked
                          ? `${theme.name}を選ぶ。${theme.description}`
                          : `${theme.name}は放課後スター${theme.unlockAt}で解放`
                      }
                      className={cx(
                        'overflow-hidden rounded-xl border-2 bg-white text-left transition-transform active:scale-95',
                        selected
                          ? 'border-violet-500 shadow-sm'
                          : unlocked
                            ? 'border-slate-100'
                            : 'border-slate-100 opacity-55',
                      )}
                    >
                      <span className="relative block h-12 overflow-hidden bg-slate-900">
                        <img
                          src={theme.preview}
                          alt=""
                          className="h-full w-full object-cover object-top [image-rendering:pixelated]"
                        />
                        {!unlocked && (
                          <span className="absolute inset-0 grid place-items-center bg-slate-950/55 text-sm">
                            🔒
                          </span>
                        )}
                      </span>
                      <span className="block truncate px-1.5 pb-1.5 pt-1 text-[8px] font-extrabold text-ink">
                        {theme.emoji} {theme.shortName}
                      </span>
                      <span className="block px-1.5 pb-1 text-[7px] font-bold text-ink/40">
                        {unlocked ? (selected ? '選択中' : '解放済み') : `✦ ${theme.unlockAt}`}
                      </span>
                    </button>
                  )
                })}
              </div>
              <label className="mt-2.5 block text-[9px] font-bold text-ink/45" htmlFor="school-battle-item">
                学校アイテム（1バトル1回）
              </label>
              <select
                id="school-battle-item"
                value={battleRelic.level}
                onChange={(event) => onRelic(Number(event.target.value))}
                className="mt-1.5 h-11 w-full rounded-xl border-2 border-violet-100 bg-white px-3 text-xs font-extrabold text-ink outline-none focus:border-violet-400"
              >
                {hero.relics.map((relic) => (
                  <option key={relic.level} value={relic.level}>
                    {relic.emoji} {relic.name} · {relicBattleAbility(relic).label}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-[9px] font-bold leading-relaxed text-ink/50">
                {battleRelic.emoji} {itemAbility.description}
                {' '}所持効果：{relicStatLabel(battleRelic)}
              </p>
            </div>
          </details>

          <button
            type="button"
            onClick={() => onBattle(selectedQuest)}
            aria-label={`${battleRival.name}との${selectedQuest.size}問バトルを開始`}
            className="school-battle-start mt-3 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 px-4 py-3 font-display text-base font-extrabold text-white shadow-[0_10px_24px_-10px_rgba(79,70,229,0.8)] transition-transform active:scale-[0.98]"
          >
            <span>{encounter.isTeacher ? '🏫' : '✨'}</span>
            {selectedQuest.size}問バトルをはじめる
            <ArrowRight size={18} />
          </button>
        </div>

        <p className="mt-2.5 text-center text-[10px] font-bold leading-relaxed text-white/70">
          先生はこわい悪役ではなく、成長を試す放課後のライバルです。
        </p>
      </div>
    </section>
  )
}

function AfterSchoolWorld({ battleStars, selectedTheme, onTheme }) {
  return (
    <section className="overflow-hidden rounded-3xl bg-slate-950 p-4 text-white shadow-card">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[9px] font-extrabold tracking-[0.18em] text-cyan-300">
            AFTER SCHOOL ACADEMY
          </p>
          <h2 className="mt-0.5 font-display text-base font-extrabold">
            3つの放課後エリア
          </h2>
        </div>
        <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-extrabold text-amber-200">
          ✦ {battleStars.toLocaleString()}
        </span>
      </div>
      <p className="mt-2 text-[10px] font-bold leading-relaxed text-white/55">
        バトル正解やXP変換で閉ざされた校舎を開き、エリア固有のバトル能力を身につけよう。
      </p>

      <div className="mt-3 space-y-2">
        {BATTLE_THEMES.map((theme, index) => {
          const unlocked = battleStars >= theme.unlockAt
          const selected = theme.id === selectedTheme.id
          return (
            <button
              key={theme.id}
              type="button"
              disabled={!unlocked}
              onClick={() => onTheme(theme.id)}
              aria-pressed={selected}
              className={cx(
                'flex w-full overflow-hidden rounded-2xl border text-left transition-transform active:scale-[0.99]',
                selected
                  ? 'border-white/65 bg-white/14'
                  : unlocked
                    ? 'border-white/10 bg-white/[0.07]'
                    : 'border-white/5 bg-white/[0.035] opacity-65',
              )}
            >
              <span className="relative h-24 w-20 shrink-0 overflow-hidden bg-slate-900">
                <img
                  src={theme.preview}
                  alt=""
                  className="h-full w-full object-cover object-top [image-rendering:pixelated]"
                />
                {!unlocked && (
                  <span className="absolute inset-0 grid place-items-center bg-slate-950/65 text-xl">
                    🔒
                  </span>
                )}
                <span className="absolute left-1.5 top-1.5 rounded-md bg-slate-950/70 px-1.5 py-0.5 text-[7px] font-black">
                  AREA {index + 1}
                </span>
                <span
                  className="battle-theme-actor-preview"
                  style={{ backgroundImage: `url("${theme.actorsSheet}")` }}
                  aria-hidden="true"
                />
              </span>
              <span className="min-w-0 flex-1 px-3 py-2.5">
                <span className="flex items-center justify-between gap-2">
                  <strong className="truncate text-xs font-extrabold">
                    {theme.emoji} {theme.name}
                  </strong>
                  <span className="shrink-0 text-[8px] font-extrabold text-amber-200">
                    {unlocked ? (selected ? 'SELECTED' : 'OPEN') : `✦ ${theme.unlockAt}`}
                  </span>
                </span>
                <span className="mt-1 block text-[9px] font-bold leading-relaxed text-white/55">
                  {theme.lore}
                </span>
                <span
                  className="mt-1.5 inline-flex rounded-full px-2 py-1 text-[8px] font-extrabold"
                  style={{
                    backgroundColor: `${theme.accent}24`,
                    color: theme.accent === '#a78bfa' ? '#ddd6fe' : theme.accent,
                  }}
                >
                  {theme.ability.emoji} {theme.ability.name}：{theme.ability.label}
                </span>
                <span className="mt-1.5 flex flex-wrap gap-1">
                  {theme.scenes.map((scene) => (
                    <span
                      key={scene.id}
                      className="rounded-full border border-white/10 px-1.5 py-0.5 text-[7px] font-extrabold text-white/50"
                    >
                      {scene.name}
                    </span>
                  ))}
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function CampusLifeGallery() {
  const [sceneId, setSceneId] = useState(BATTLE_DAILY_SCENES[0].id)
  const scene = battleDailySceneById(sceneId)
  const sceneNumber = BATTLE_DAILY_SCENES.findIndex((item) => item.id === scene.id) + 1

  return (
    <section className="campus-life-gallery overflow-hidden rounded-3xl bg-slate-950 text-white shadow-card">
      <div className="flex items-end justify-between gap-3 px-4 pb-3 pt-4">
        <div>
          <p className="text-[9px] font-extrabold tracking-[0.18em] text-pink-300">
            CAMPUS LIFE STORIES
          </p>
          <h2 className="mt-0.5 font-display text-base font-extrabold">
            学生たちの一日
          </h2>
        </div>
        <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-extrabold text-cyan-100">
          9 SCENES
        </span>
      </div>

      <div
        id="campus-life-scene"
        className="campus-life-stage relative aspect-video overflow-hidden bg-indigo-950"
        role="region"
        aria-live="polite"
        aria-label={`${scene.name}。${scene.description}`}
      >
        <span key={scene.id} className="campus-life-scene-frame absolute inset-0">
          <img
            src={scene.image}
            alt={`${scene.name}を過ごす生徒たちのドット絵`}
            className="campus-life-scene-image h-full w-full object-cover [image-rendering:pixelated]"
          />
        </span>
        <span className="campus-life-scanlines pointer-events-none absolute inset-0" />
        <span className="absolute right-3 top-3 rounded-full border border-white/20 bg-slate-950/65 px-2 py-1 text-[8px] font-extrabold tracking-[0.12em] backdrop-blur-sm">
          {String(sceneNumber).padStart(2, '0')} / {String(BATTLE_DAILY_SCENES.length).padStart(2, '0')}
        </span>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent px-4 pb-3 pt-12">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0 flex-1">
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-2 py-1 text-[8px] font-extrabold text-amber-100 backdrop-blur-sm">
                {scene.emoji} {scene.time}
              </span>
              <h3 className="mt-1.5 font-display text-base font-extrabold leading-tight">
                {scene.name}
              </h3>
              <p className="mt-1 max-w-[31rem] text-[9px] font-bold leading-relaxed text-white/65">
                {scene.description}
              </p>
            </div>

            <div className="flex shrink-0 -space-x-2" aria-label="この場面の登場生徒">
              {scene.cast.map(({ studentId, emotionId }) => {
                const student = battleStudentById(studentId)
                return (
                  <span
                    key={student.id}
                    className="h-9 w-9 overflow-hidden rounded-xl border-2 border-slate-950 bg-slate-900 shadow-lg"
                    title={`${student.name}・${battleEmotionById(emotionId).label}`}
                  >
                    <img
                      src={battleStudentPortrait(student.id, emotionId)}
                      alt={student.name}
                      loading="lazy"
                      className="h-full w-full object-cover [image-rendering:pixelated]"
                    />
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div
        className="campus-life-scene-list flex gap-2 overflow-x-auto px-3 py-3"
        role="list"
        aria-label="学生の日常シーンを選択"
      >
        {BATTLE_DAILY_SCENES.map((item) => {
          const selected = item.id === scene.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSceneId(item.id)}
              aria-pressed={selected}
              aria-controls="campus-life-scene"
              className={cx(
                'campus-life-scene-choice w-[82px] shrink-0 overflow-hidden rounded-xl border text-left transition-transform active:scale-95',
                selected
                  ? 'border-pink-200 bg-white/15 ring-2 ring-pink-300/30'
                  : 'border-white/10 bg-white/[0.06]',
              )}
              role="listitem"
            >
              <img
                src={item.image}
                alt=""
                loading="lazy"
                className="aspect-video w-full object-cover [image-rendering:pixelated]"
              />
              <span className="flex items-center justify-between gap-1 px-1.5 py-1.5">
                <strong className="truncate text-[8px] font-extrabold">
                  {item.emoji} {item.shortName}
                </strong>
                <span className="shrink-0 text-[6px] font-bold text-white/40">
                  {item.time}
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function BattleCastRoster({ selectedStudentId, onStudent }) {
  const selectedStudent = battleStudentById(selectedStudentId)
  const [emotionId, setEmotionId] = useState('playful')
  const emotion = battleEmotionById(emotionId)

  return (
    <section className="battle-cast-roster overflow-hidden rounded-3xl bg-white shadow-card">
      <div className="bg-gradient-to-br from-indigo-950 via-violet-950 to-fuchsia-950 p-4 text-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[9px] font-extrabold tracking-[0.18em] text-cyan-300">
              PLAYABLE CAST
            </p>
            <h2 className="mt-0.5 font-display text-base font-extrabold">
              主役の生徒をえらぶ
            </h2>
          </div>
          <div className="flex shrink-0 gap-1">
            <span className="rounded-full bg-white/10 px-2 py-1 text-[8px] font-extrabold">
              10人
            </span>
            <span className="rounded-full bg-pink-400/20 px-2 py-1 text-[8px] font-extrabold text-pink-100">
              各24状態
            </span>
          </div>
        </div>
        <p className="mt-2 text-[10px] font-bold leading-relaxed text-white/55">
          能力差はありません。好きな生徒を選ぶと、回答結果に合わせて表情と動作が変わります。
        </p>

        <div className="battle-student-selector mt-3 flex gap-2 overflow-x-auto pb-2" role="list">
          {BATTLE_STUDENTS.map((student) => {
            const selected = student.id === selectedStudent.id
            return (
              <button
                key={student.id}
                type="button"
                onClick={() => onStudent(student.id)}
                aria-pressed={selected}
                className={cx(
                  'battle-student-choice w-[72px] shrink-0 rounded-2xl border p-1.5 text-center transition-transform active:scale-95',
                  selected
                    ? 'border-cyan-200 bg-white/20 shadow-lg shadow-cyan-400/15'
                    : 'border-white/10 bg-white/[0.06]',
                )}
                role="listitem"
              >
                <span className="block aspect-square overflow-hidden rounded-xl bg-slate-900">
                  <img
                    src={battleStudentPortrait(student.id, selected ? 'delighted' : 'idle')}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover [image-rendering:pixelated]"
                  />
                </span>
                <strong className="mt-1 block truncate text-[9px] font-extrabold">
                  {student.name.replace(/^[^ぁ-んァ-ヶ一-龠々ー]+/, '')}
                </strong>
                <span className="block truncate text-[7px] font-bold text-white/45">
                  {student.club}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3">
          <span
            key={`${selectedStudent.id}-${emotion.id}`}
            className="battle-expression-change h-24 w-24 shrink-0 overflow-hidden rounded-[1.6rem] border-4 bg-slate-950 shadow-lg"
            style={{ borderColor: selectedStudent.accent }}
          >
            <img
              src={battleStudentPortrait(selectedStudent.id, emotion.id)}
              alt={`${selectedStudent.name}の${emotion.label}の表情`}
              className="h-full w-full object-cover [image-rendering:pixelated]"
            />
          </span>
          <div className="min-w-0 flex-1">
            <span
              className="inline-flex rounded-full px-2 py-1 text-[8px] font-extrabold text-white"
              style={{ backgroundColor: selectedStudent.accent }}
            >
              SELECTED · {emotion.emoji} {emotion.label}
            </span>
            <h3 className="mt-1.5 font-display text-lg font-extrabold text-ink">
              {selectedStudent.emoji} {selectedStudent.name}
            </h3>
            <p className="text-[10px] font-extrabold text-violet-500">
              {selectedStudent.club} · {selectedStudent.reading}
            </p>
            <p className="mt-1 text-[10px] font-bold leading-relaxed text-ink/50">
              {selectedStudent.trait}
            </p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-1.5">
          {['gentle', 'playful', 'healing', 'victory'].map((featuredEmotionId) => {
            const featured = battleEmotionById(featuredEmotionId)
            return (
              <button
                key={featured.id}
                type="button"
                onClick={() => setEmotionId(featured.id)}
                className={cx(
                  'rounded-xl border px-1.5 py-2 text-[8px] font-extrabold transition-transform active:scale-95',
                  featured.id === emotion.id
                    ? 'border-violet-400 bg-violet-50 text-violet-800'
                    : 'border-slate-100 bg-slate-50 text-ink/50',
                )}
              >
                <span className="block text-base">{featured.emoji}</span>
                {featured.label}
              </button>
            )
          })}
        </div>

        <details className="battle-cast-details mt-3 rounded-2xl border border-violet-100 bg-violet-50/50">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-3 text-xs font-extrabold text-violet-800">
            <span>🎭 {selectedStudent.name}の全24表情・動作</span>
            <span className="text-[9px] text-violet-500">喜怒哀楽＋癒し＋戦闘</span>
          </summary>
          <div className="grid grid-cols-4 gap-2 border-t border-violet-100 p-3">
            {BATTLE_EMOTION_STATES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setEmotionId(item.id)}
                aria-pressed={item.id === emotion.id}
                className={cx(
                  'overflow-hidden rounded-xl border bg-white text-center transition-transform active:scale-95',
                  item.id === emotion.id
                    ? 'border-violet-500 ring-2 ring-violet-200'
                    : 'border-slate-100',
                )}
              >
                <img
                  src={battleStudentPortrait(selectedStudent.id, item.id)}
                  alt=""
                  loading="lazy"
                  className="aspect-square w-full object-cover [image-rendering:pixelated]"
                />
                <span className="block truncate px-1 py-1 text-[7px] font-extrabold text-ink/55">
                  {item.emoji} {item.label}
                </span>
              </button>
            ))}
          </div>
        </details>

        <details className="battle-cast-details mt-2 rounded-2xl border border-slate-200 bg-slate-50">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-3 text-xs font-extrabold text-ink">
            <span>🏫 先生・敵役アーカイブ</span>
            <span className="text-[9px] text-ink/40">5陣営 · 50人</span>
          </summary>
          <div className="space-y-4 border-t border-slate-200 p-3">
            {BATTLE_RIVAL_GROUPS.map((group) => (
              <div key={group.id}>
                <div className="mb-2 flex items-center justify-between">
                  <strong className="text-[10px] font-extrabold text-ink">
                    {group.emoji} {group.name}
                  </strong>
                  <span className="text-[8px] font-bold text-ink/35">10人</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {BATTLE_RIVALS.filter((rival) => rival.groupId === group.id).map((rival) => (
                    <figure key={rival.id} className="min-w-0 text-center">
                      <img
                        src={rival.portrait}
                        alt={`${rival.name}のドット絵ポートレート`}
                        loading="lazy"
                        className="aspect-square w-full rounded-xl border-2 bg-slate-900 object-cover [image-rendering:pixelated]"
                        style={{ borderColor: `${group.accent}88` }}
                      />
                      <figcaption className="mt-1 truncate text-[7px] font-extrabold text-ink/55">
                        {rival.name}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </details>
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
            {next ? `${next.emoji} ${next.name}` : '🎓 学校アイテムをすべて獲得'}
          </h2>
        </div>
        <span className="rounded-full bg-brand-100 px-2.5 py-1 text-xs font-extrabold text-brand-700">
          {next ? `LV${next.level}` : 'COMPLETE'}
        </span>
      </div>
      <p className="mt-1 text-xs font-bold text-ink/45">
        {next ? next.text : 'LV99の放課後バトルは、何度でも続けられます。'}
      </p>
      {next && (
        <p className="mt-1 text-[10px] font-extrabold text-emerald-600">
          装備効果：{relicStatLabel(next)}
        </p>
      )}
      <div className="mt-3 flex items-center gap-3">
        <span className="text-[10px] font-bold text-ink/45">校内ステージ</span>
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
        <h2 className="font-display text-base font-extrabold text-ink">放課後の校内マップ</h2>
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
                {current ? '挑戦中' : cleared ? 'クリア' : '未解放'}
              </span>
            </div>
          )
        })}
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
