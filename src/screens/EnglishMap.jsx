import { useEffect, useState } from 'react'
import { useStore, todayIndex } from '../store/useStore.js'
import { PASSAGES } from '../data/passages.js'
import { LEVELS } from '../data/levels.js'
import {
  SCHOOL_LIFE_VISUAL_CATEGORIES,
  SCHOOL_LIFE_VISUALS,
  schoolLifeVisualById,
} from '../data/school-life-visuals.js'
import { suggestStartPosition } from '../lib/session.js'
import {
  battleSource,
  enemyLevel,
  enemyLevelIndex,
} from '../lib/adaptive.js'
import {
  BATTLE_QUESTS,
  CHAPTERS,
  battleQuest,
  battleRelicForLevel,
  capEnemyPositionForHeroLevel,
  encounterFor,
  featuredQuestId,
  heroProgress,
  relicStatLabel,
} from '../lib/rpg.js'
import {
  BATTLE_BARRIER_CENTER,
  BATTLE_BARRIER_MAP_IMAGE,
  BATTLE_BARRIER_NODES,
  BATTLE_BARRIER_STAR_ORDER,
  BATTLE_BARRIER_TRAFFIC_LIGHTS,
  BATTLE_BARRIER_WINDOW_LIGHTS,
  BATTLE_STARS_PER_EXCHANGE,
  BATTLE_THEMES,
  BATTLE_XP_PER_EXCHANGE,
  battleBarrierLocationById,
  battleXpExchange,
  battleThemeById,
} from '../lib/battleThemes.js'
import {
  BATTLE_DAILY_SCENES,
  BATTLE_EMOTION_STATES,
  BATTLE_RIVAL_GROUPS,
  BATTLE_RIVALS,
  BATTLE_STUDENTS,
  battleDailySceneById,
  battleEmotionById,
  battleOpponentForEncounter,
  battleRivalForEncounter,
  battleRivalTeacherSubject,
  battleStudentBestSubjects,
  battleStudentById,
  battleStudentLifestylePortrait,
  battleStudentPortrait,
  battleSupportStyleById,
  battleTeacherAffinity,
} from '../lib/battleCast.js'
import {
  BATTLE_TRAITS,
  BATTLE_TRAIT_POINT_STARS,
  MAX_BATTLE_TRAIT_LEVEL,
  battleStudentTraitProfile,
} from '../lib/battleTraits.js'
import {
  TEACHER_SCHOOL_LIFE,
  TEACHER_TEST_SCORE_CHOICES,
  createTeacherSchoolLifeConversation,
  teacherRemedialSubjectChoices,
  teacherSchoolLifeById,
} from '../lib/teacherSchoolLife.js'
import {
  AFTER_SCHOOL_CHRONICLE,
  afterSchoolBattleChapter,
  afterSchoolPrologue,
} from '../lib/afterSchoolStory.js'
import {
  afterSchoolBattleSkill,
  afterSchoolBondState,
  normalizeUnlockedBattleStudentIds,
} from '../lib/afterSchoolBonds.js'
import {
  AFTER_SCHOOL_STORY_ARCS,
  afterSchoolStoryArcForStep,
} from '../lib/storyProgression.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { LightNovelScene } from '../components/LightNovelScene.jsx'
import { MobPortrait } from '../components/MobPortrait.jsx'
import { TeacherPortrait } from '../components/TeacherPortrait.jsx'
import { BattleStandingActor } from '../components/BattleStandingActor.jsx'
import { ProgressRing, ProgressBar, Chip, cx } from '../components/ui.jsx'
import {
  ArrowRight,
  BookOpen,
  Cards,
  Check,
  Flame,
  Home as SchoolIcon,
  Lightbulb,
  Lock,
  Sparkles,
  Sprout,
  StarFilled,
  Teacher,
  Target,
} from '../components/Icons.jsx'
import { publicAssetUrl } from '../lib/publicAssetUrl.js'

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

const CHRONICLE_ICON_COMPONENTS = {
  title: StarFilled,
  chapter: SchoolIcon,
  scene: Sparkles,
  daily: Sprout,
  challenge: Target,
  journal: BookOpen,
  trait: StarFilled,
  theme: Sparkles,
  quest: Cards,
  battle: Flame,
  lock: Lock,
  faculty: Teacher,
}

const CHRONICLE_MENU_SECTIONS = Object.freeze([
  { id: 'battle', label: '対決', description: '今日の先生課題に挑む', icon: 'battle' },
  { id: 'growth', label: '育成', description: 'XPと進行報酬を確認する', icon: 'trait' },
  { id: 'friends', label: '仲間', description: '関係と同行者を振り返る', icon: 'journal' },
  { id: 'school', label: '学園', description: '校内の物語と先生に会う', icon: 'faculty' },
])

// ゲーム入口の主要アイコンはOSの絵文字フォントへ依存させない。
// 文字と別レイヤーのインラインSVGなので、絵文字を持たない端末でも必ず表示される。
function ChronicleIcon({ kind, size = 20, className = '' }) {
  const Icon = CHRONICLE_ICON_COMPONENTS[kind] ?? Sparkles
  return (
    <span
      className={cx('chronicle-vector-icon', className)}
      data-chronicle-icon={kind}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <Icon size={Math.max(12, Math.round(size * 0.62))} />
    </span>
  )
}

function skillInfo(skill, skillStats, readingsDone) {
  if (skill.kind === 'reading') {
    const total = PASSAGES.length
    // 「名作に親しむ」も同じ readingsDone へ保存するため、英検長文だけを数える。
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
  const stats = useStore((s) => s.stats)
  const hero = heroProgress(stats.xp)

  const infos = SKILLS.map((skill) => ({
    skill,
    info: skillInfo(skill, skillStats, readingsDone),
  }))
  const weak = infos
    .filter(({ info }) => info.status === 'weak')
    .sort((a, b) => (a.info.acc ?? 1) - (b.info.acc ?? 1))

  return (
    <div className="pb-8">
      <ScreenHeader
        title="学習マップ"
        subtitle="英語力を確認して、次の学習を選ぶ"
      />

      <div className="space-y-4 px-4">
        <ChroniclePortalCard
          hero={hero}
          onOpen={() => navigate('afterSchoolChronicle')}
        />
        <TrainingBoard navigate={navigate} weak={weak} infos={infos} />
      </div>
    </div>
  )
}

export function AfterSchoolChronicleScreen() {
  const navigate = useStore((s) => s.navigate)
  const srs = useStore((s) => s.srs)
  const stats = useStore((s) => s.stats)
  const engPos = useStore((s) => s.engPos)
  const setEngPos = useStore((s) => s.setEngPos)
  const battleRelicLevel = useStore((s) => s.battleRelicLevel)
  const battleStars = useStore((s) => s.battleStars)
  const battleXpSpent = useStore((s) => s.battleXpSpent)
  const exchangeXpForBattleStars = useStore((s) => s.exchangeXpForBattleStars)
  const battleThemeId = useStore((s) => s.battleThemeId)
  const battleStudentId = useStore((s) => s.battleStudentId)
  const afterSchoolBonds = useStore((s) => s.afterSchoolBonds)
  const unlockedBattleStudentIds = useStore((s) => s.unlockedBattleStudentIds)
  const battleTraitInvestments = useStore((s) => s.battleTraitInvestments)
  const battleStoryStep = useStore((s) => s.battleStoryStep)
  const hero = heroProgress(stats.xp)
  const battleRelic = battleRelicForLevel(hero.level, battleRelicLevel)
  const battleTheme = battleThemeById(battleThemeId, battleStars)
  const battleStudent = battleStudentById(battleStudentId)
  const battleBondSkill = afterSchoolBattleSkill(battleStudent.id, afterSchoolBonds)
  const studentTraitProfile = battleStudentTraitProfile(
    battleStudent.id,
    battleTraitInvestments,
    battleStars,
  )
  const inferredPos = engPos ?? suggestStartPosition(srs)
  const pos = capEnemyPositionForHeroLevel(inferredPos, hero.level)

  useEffect(() => {
    if (engPos !== pos) setEngPos(pos)
  }, [engPos, pos, setEngPos])

  const day = todayIndex()
  const [menuSectionId, setMenuSectionId] = useState('battle')
  const [showPrologue, setShowPrologue] = useState(() => battleStoryStep === 0)
  const [pendingQuest, setPendingQuest] = useState(null)
  const encounter = encounterFor({
    level: hero.level,
    day,
    enemyRankIndex: enemyLevelIndex(pos),
  })
  const baseBattleRival = battleRivalForEncounter(encounter, day)
  const battleRival = battleOpponentForEncounter(encounter, baseBattleRival)
  const teacherSubject = encounter.teacherSubject
    ?? battleRivalTeacherSubject(battleRival.id)
  const teacherAffinity = battleTeacherAffinity(
    battleStudent.id,
    teacherSubject,
  )
  const launchBattle = (quest) => {
    navigate('vocabQuiz', {
      source: {
        ...battleSource(pos),
        questId: quest.id,
        relicLevel: battleRelic.level,
        themeId: battleTheme.id,
        studentId: battleStudent.id,
        bondSkillId: battleBondSkill?.id ?? null,
        traitId: studentTraitProfile.dominant.id,
        rivalId: battleRival.id,
        teacherSubject,
        adventureDay: day,
        storyStep: battleStoryStep,
        heroLevel: hero.level,
      },
      title: `ことばの対決：${battleRival.name}`,
      mode: 'quiz',
      size: quest.size,
    })
  }

  const prologue = afterSchoolPrologue({ studentName: battleStudent.name })
  const battleChapter = pendingQuest
    ? afterSchoolBattleChapter({
        storyStep: battleStoryStep,
        studentName: battleStudent.name,
        rivalName: battleRival.name,
        encounterName: encounter.chapterName ?? encounter.name,
        questSize: pendingQuest.size,
        isTeacher: encounter.isTeacher,
      })
    : null
  const novelPortraits = {
    'student-curious': battleStudentPortrait(battleStudent.id, 'curious'),
    'student-determined': battleStudentPortrait(battleStudent.id, 'determined'),
    'student-focused': battleStudentPortrait(battleStudent.id, 'focused'),
  }
  const menuSection = CHRONICLE_MENU_SECTIONS.find(({ id }) => id === menuSectionId)
    ?? CHRONICLE_MENU_SECTIONS[0]

  if (showPrologue) {
    return (
      <LightNovelScene
        story={prologue}
        image={AFTER_SCHOOL_CHRONICLE.keyVisual}
        imageAlt="放課後の昇降口で、クラスメイトたちが校内図を囲んでいる"
        portraits={novelPortraits}
        onBack={() => setShowPrologue(false)}
        onComplete={() => setShowPrologue(false)}
        completeLabel="課題の章へ"
        skipLabel="章選択へ"
      />
    )
  }

  if (pendingQuest && battleChapter) {
    return (
      <LightNovelScene
        story={battleChapter}
        image={battleTheme.stage}
        imageAlt={`${battleTheme.name}。${battleRival.name}とのことばの対決が始まる舞台`}
        portraits={novelPortraits}
        onBack={() => setPendingQuest(null)}
        onComplete={() => launchBattle(pendingQuest)}
        completeLabel="ことばの対決へ"
        skipLabel="対決へ進む"
      />
    )
  }

  return (
    <div className="after-school-game-icons pb-8">
      <ScreenHeader
        title={AFTER_SCHOOL_CHRONICLE.title}
        subtitle="学習XPで進む放課後ゲーム"
        titleClassName="after-school-screen-title"
        subtitleClassName="after-school-screen-subtitle"
      />

      <div className="px-4">
        <div className="after-school-handheld" data-game-console>
          <div className="after-school-console-bezel">
            <div className="after-school-console-status" aria-hidden="true">
              <span>{menuSection.label}</span>
              <span>LV {hero.level}</span>
              <span>✦ {battleStars.toLocaleString()}</span>
            </div>

            <div
              key={menuSection.id}
              className="after-school-console-screen space-y-3"
              data-game-menu-panel={menuSection.id}
              role="region"
              aria-label={`${menuSection.label}メニュー。${menuSection.description}`}
              tabIndex={0}
            >
              {menuSection.id === 'battle' && (
                <AdventureCard
                  pos={pos}
                  hero={hero}
                  encounter={encounter}
                  day={day}
                  battleStars={battleStars}
                  battleTheme={battleTheme}
                  battleStudent={battleStudent}
                  studentTraitProfile={studentTraitProfile}
                  battleRival={battleRival}
                  teacherSubject={teacherAffinity.subject}
                  onBattle={setPendingQuest}
                />
              )}

              {menuSection.id === 'growth' && (
                <>
                  <XpExchangeCard
                    totalXp={stats.xp}
                    spentXp={battleXpSpent}
                    battleStars={battleStars}
                    onExchange={exchangeXpForBattleStars}
                  />
                  <ChronicleDrawer
                    icon="chapter"
                    title="育成の記録"
                    description="エリア・次の報酬・校内マップ"
                  >
                    <AfterSchoolWorld battleStars={battleStars} selectedTheme={battleTheme} />
                    <AdventureProgress hero={hero} />
                    <ChapterTrail hero={hero} />
                  </ChronicleDrawer>
                </>
              )}

              {menuSection.id === 'friends' && (
                <>
                  <AfterSchoolBondBoard
                    bonds={afterSchoolBonds}
                    currentStudentId={battleStudent.id}
                    unlockedStudentIds={unlockedBattleStudentIds}
                  />
                  <ChronicleDrawer
                    icon="trait"
                    title="仲間のプロフィール"
                    description="同行者・星彩・表情・人物記録"
                  >
                    <BattleCastRoster
                      selectedStudentId={battleStudent.id}
                      battleStars={battleStars}
                      investments={battleTraitInvestments}
                      unlockedStudentIds={unlockedBattleStudentIds}
                    />
                  </ChronicleDrawer>
                </>
              )}

              {menuSection.id === 'school' && (
                <>
                  <StoryArcTimeline storyStep={battleStoryStep} />
                  <ChronicleDrawer
                    icon="chapter"
                    title="校内マップ"
                    description="五芒星の結界と各地点"
                  >
                    <SchoolBarrierMap />
                  </ChronicleDrawer>
                  <ChronicleDrawer
                    icon="journal"
                    title="思い出アルバム"
                    description="学校生活の記録"
                  >
                    <SchoolLifeAlbum />
                  </ChronicleDrawer>
                  <ChronicleDrawer
                    icon="faculty"
                    title="先生と話す"
                    description="12科目の先生との学校生活"
                  >
                    <TeacherSchoolLife student={battleStudent} />
                  </ChronicleDrawer>
                </>
              )}
            </div>
          </div>

          <nav className="after-school-console-menu" aria-label="ゲームメニュー">
            {CHRONICLE_MENU_SECTIONS.map((section) => {
              const selected = section.id === menuSection.id
              return (
                <button
                  key={section.id}
                  type="button"
                  data-game-menu={section.id}
                  aria-pressed={selected}
                  onClick={() => setMenuSectionId(section.id)}
                  className="after-school-console-key"
                >
                  <ChronicleIcon kind={section.icon} size={20} />
                  <span>{section.label}</span>
                </button>
              )
            })}
          </nav>

          <div className="after-school-console-footer" aria-hidden="true">
            <span>ことば端末</span>
            <span className="after-school-console-speaker" />
          </div>
        </div>
      </div>
    </div>
  )
}

function ChroniclePortalCard({ hero, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="after-school-portal after-school-portal-console block w-full text-left transition-transform active:scale-[0.99]"
      aria-label={`${AFTER_SCHOOL_CHRONICLE.title}を開く`}
    >
      <span className="after-school-portal-bezel">
        <span className="after-school-portal-screen">
          <img
            src={publicAssetUrl(AFTER_SCHOOL_CHRONICLE.keyVisual)}
            alt="放課後の昇降口で、4人の高校生が校内図を囲んで次の課題ルートを相談している"
          />
          <span className="after-school-portal-screen-label">
            LV{hero.level} · {hero.chapter.name}
          </span>
        </span>
      </span>
      <span className="after-school-portal-copy">
        <span className="min-w-0">
          <strong className="block truncate font-display text-lg font-extrabold leading-tight text-ink">
            {AFTER_SCHOOL_CHRONICLE.title}
          </strong>
          <span className="mt-1 block truncate text-[10px] font-bold text-ink/50">
            対決後は友達と過ごす3つの日常へ
          </span>
        </span>
        <span className="after-school-portal-action">
          はじめる <ArrowRight size={14} />
        </span>
      </span>
    </button>
  )
}

function ChronicleDrawer({ icon, title, description, children }) {
  return (
    <details className="after-school-console-drawer">
      <summary>
        <span className="after-school-console-drawer-title">
          <ChronicleIcon kind={icon} size={22} />
          <span className="min-w-0">
            <strong>{title}</strong>
            <small>{description}</small>
          </span>
        </span>
        <span className="after-school-console-drawer-action" aria-hidden="true" />
      </summary>
      <div className="after-school-console-drawer-body space-y-3">
        {children}
      </div>
    </details>
  )
}

function TrainingBoard({ navigate, weak, infos }) {
  return (
    <section>
      <div className="mb-2 flex items-end justify-between px-1">
        <div>
          <p className="text-[10px] font-extrabold tracking-[0.18em] text-brand-500">
            LEARNING BOARD
          </p>
          <h2 className="font-display text-base font-extrabold text-ink">
            次の学習を選ぶ
          </h2>
        </div>
        <span className="text-[10px] font-bold text-ink/40">苦手を見つけて補強</span>
      </div>

      {weak.length > 0 ? (
        <div className="mb-3 rounded-2xl border-2 border-amber-300 bg-hint-soft p-3.5">
          <div className="flex items-center gap-1.5">
            <Lightbulb size={16} className="text-amber-600" />
            <span className="font-display text-sm font-extrabold text-amber-900">
              学習のヒント — 弱点を補強しよう
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
          大きな弱点なし。伸ばしたい分野を選ぼう 💪
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
          <p className="text-[9px] font-extrabold tracking-[0.12em] text-amber-600">
            学習XP → 放課後スター
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
  battleStars,
  battleTheme,
  battleStudent,
  studentTraitProfile,
  battleRival,
  teacherSubject,
  onBattle,
}) {
  const enemyRank = enemyLevel(pos)
  const maxEnemyRank = LEVELS[hero.enemyRankCap]
  const featured = featuredQuestId(day)
  const [questId, setQuestId] = useState(featured)
  const selectedQuest = battleQuest(questId)
  const opponentLabel = `${teacherSubject}担当からの課題`

  return (
    <section
      className="school-battle-card after-school-start-card relative overflow-hidden rounded-[2rem] p-4 text-white shadow-[0_18px_50px_-22px_rgba(79,70,229,0.65)]"
      data-battle-theme={battleTheme.id}
      data-battle-layout={battleTheme.presentation.layout}
      style={{
        background: battleTheme.gradient,
        '--battle-accent': battleTheme.accent,
        '--battle-accent-strong': battleTheme.accentStrong,
      }}
    >
      <div className="pointer-events-none absolute -right-10 -top-12 opacity-[0.08]">
        <ChronicleIcon kind="chapter" size={144} className="chronicle-vector-icon-ghost" />
      </div>
      <div className="pointer-events-none absolute -bottom-20 -left-16 h-48 w-48 rounded-full bg-pink-300/20 blur-3xl" />

      <div className="after-school-start-layout relative">
        <div className="after-school-start-meta flex items-center gap-2.5">
          <span className="rounded-full border border-white/25 bg-white/15 px-2.5 py-1 text-[10px] font-extrabold tracking-[0.14em] text-white/90 backdrop-blur">
            CHRONICLE STAGE {hero.chapter.number}
          </span>
          <span className="flex min-w-0 items-center gap-1 truncate text-xs font-extrabold">
            <ChronicleIcon kind="chapter" size={17} />
            <span className="truncate">{hero.chapter.name}</span>
          </span>
        </div>

        <div className="after-school-player-strip mt-3 flex items-center gap-2 rounded-2xl border border-white/15 bg-slate-950/15 p-2">
          <span
            className="battle-map-student-portrait battle-trait-avatar-aura h-10 w-10 shrink-0 overflow-hidden rounded-xl"
            style={{
              '--student-trait-color': studentTraitProfile.dominant.color,
              '--student-trait-secondary': studentTraitProfile.secondary.color,
            }}
          >
            <img
              src={battleStudentPortrait(battleStudent.id, 'confident')}
              alt={`${battleStudent.name}の自信の表情`}
              className="h-full w-full object-cover [image-rendering:pixelated]"
            />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-extrabold">
              LV{hero.level} · {hero.title.name}
            </p>
            <p className="truncate text-[9px] font-bold text-white/65">
              {hero.isMax ? '最高レベル' : `次まで ${hero.xpToNext} XP`} · {studentTraitProfile.colorLabel}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-extrabold text-amber-100">
            ✦ {battleStars.toLocaleString()}
          </span>
        </div>

        <div className="after-school-start-key-visual order-0">
          <img
            src={publicAssetUrl(AFTER_SCHOOL_CHRONICLE.keyVisual)}
            alt="放課後の昇降口で、4人の高校生が校内図を囲んで今日の対決ルートを相談している"
          />
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/25 to-transparent" />
          <div>
            <small>{hero.chapter.name}</small>
            <strong>今日の対決を選ぶ</strong>
          </div>
        </div>

        <div className="school-battle-paper order-1 mt-3 flex flex-col rounded-[1.65rem] bg-white p-3.5 text-ink shadow-xl shadow-black/15">
          <div
            className="battle-entry-standing-stage"
            data-battle-standing-entry
            style={{
              '--battle-entry-standing-scene': `linear-gradient(90deg,rgba(2,6,23,.34),rgba(2,6,23,.08),rgba(2,6,23,.42)), url("${publicAssetUrl(battleTheme.stage)}") center / cover`,
            }}
            role="img"
            aria-label={`${battleStudent.name}が背中を見せて${battleRival.name}との対決へ向かう`}
          >
            <BattleStandingActor
              student={battleStudent}
              pose="back"
              phase="entry"
              className="battle-entry-standing-hero"
              label={`${battleStudent.name}・背中を見せる構え`}
              fallback={(
                <img
                  src={battleStudentPortrait(battleStudent.id, 'determined')}
                  alt=""
                  className="battle-entry-standing-fallback"
                />
              )}
            />
            <span className="battle-entry-standing-versus" aria-hidden="true">VS</span>
            <span className="battle-map-rival-portrait battle-entry-standing-rival shrink-0 overflow-hidden rounded-2xl ring-2 ring-violet-100">
              {encounter.isTeacher ? (
                <TeacherPortrait teacher={encounter} className="h-full w-full" />
              ) : (
                <img
                  src={battleRival.portrait}
                  alt={`${battleRival.name}のドット絵ポートレート`}
                  className="h-full w-full object-cover [image-rendering:pixelated]"
                />
              )}
            </span>
          </div>

          <div className="mt-2 text-center">
            <p className="text-[9px] font-extrabold text-violet-500">
              {opponentLabel} · 英検{enemyRank.label}
            </p>
            <h2 className="font-display text-lg font-extrabold leading-tight">
              {battleRival.name}
            </h2>
          </div>

          <div className="after-school-quest-picker mt-3">
            <div className="flex items-end justify-between gap-2">
              <div>
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
                    <ChronicleIcon kind="quest" size={22} className="mx-auto" />
                    <span className="block text-[11px] font-extrabold">{quest.size}問</span>
                    <span className="block text-[8px] font-bold opacity-50">{quest.minutes}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onBattle(selectedQuest)}
            aria-label={`${battleRival.name}との${selectedQuest.size}問のことば対決を開始`}
            className="school-battle-start order-4 mt-3 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 px-4 py-3 font-display text-base font-extrabold text-white shadow-[0_10px_24px_-10px_rgba(79,70,229,0.8)] transition-transform active:scale-[0.98]"
          >
            <ChronicleIcon kind={encounter.isTeacher ? 'chapter' : 'battle'} size={22} />
            {selectedQuest.size}問のことば対決へ
            <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </section>
  )
}

function AfterSchoolWorld({ battleStars, selectedTheme }) {
  return (
    <section className="overflow-hidden rounded-3xl bg-slate-950 p-4 text-white shadow-card">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[9px] font-extrabold tracking-[0.18em] text-cyan-300">
            AFTER SCHOOL ACADEMY
          </p>
          <h2 className="mt-0.5 font-display text-base font-extrabold">
            3つの物語エリア
          </h2>
        </div>
        <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-extrabold text-amber-200">
          ✦ {battleStars.toLocaleString()}
        </span>
      </div>
      <p className="mt-2 text-[10px] font-bold leading-relaxed text-white/55">
        バトル正解やXP変換で閉ざされた校舎を開きます。次の対決演出はメニュー内「設定」で選びます。
      </p>

      <div className="mt-3 space-y-2">
        {BATTLE_THEMES.map((theme, index) => {
          const unlocked = battleStars >= theme.unlockAt
          const selected = theme.id === selectedTheme.id
          return (
            <article
              key={theme.id}
              className={cx(
                'flex w-full overflow-hidden rounded-2xl border text-left',
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
            </article>
          )
        })}
      </div>
    </section>
  )
}

function StoryArcTimeline({ storyStep }) {
  const current = afterSchoolStoryArcForStep(storyStep)
  const currentIndex = AFTER_SCHOOL_STORY_ARCS.findIndex((arc) => arc.id === current.id)

  return (
    <section className="overflow-hidden rounded-3xl bg-slate-950 text-white shadow-card">
      <div className="bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,.2),transparent_40%),linear-gradient(145deg,#0f172a,#312e81)] p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[9px] font-extrabold tracking-[0.12em] text-cyan-200">現在の物語 · 全11章</p>
            <h2 className="mt-0.5 font-display text-base font-extrabold">噂から龍脈へつながる物語</h2>
          </div>
          <span className="shrink-0 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[8px] font-extrabold text-amber-100">
            {current.number} / {AFTER_SCHOOL_STORY_ARCS.length}
          </span>
        </div>
        <div className="mt-3 rounded-2xl border border-cyan-200/20 bg-white/10 p-3">
          <p className="text-[8px] font-extrabold tracking-[0.1em] text-cyan-200">調査中</p>
          <h3 className="mt-1 text-sm font-extrabold">{current.title}</h3>
          <p className="mt-1 text-[10px] font-bold leading-relaxed text-white/60">{current.summary}</p>
          <p className="mt-2 text-[9px] font-extrabold leading-relaxed text-amber-100">🔎 {current.investigation}</p>
        </div>
        <ProgressBar
          value={(currentIndex + 1) / AFTER_SCHOOL_STORY_ARCS.length}
          color="linear-gradient(90deg,#22d3ee,#a78bfa,#f9a8d4)"
          className="mt-3 h-1.5 bg-white/10"
        />
      </div>

      <details className="group">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 py-3 text-xs font-extrabold text-white/75">
          <span>11段階の物語全体を見る</span>
          <span className="text-[9px] text-cyan-200 group-open:hidden">開く</span>
          <span className="hidden text-[9px] text-cyan-200 group-open:inline">閉じる</span>
        </summary>
        <ol className="border-t border-white/10 px-3 pb-4 pt-3">
          {AFTER_SCHOOL_STORY_ARCS.map((arc, index) => {
            const completed = index < currentIndex
            const active = index === currentIndex
            return (
              <li key={arc.id} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-2.5">
                <span className="relative flex justify-center">
                  <span className={cx(
                    'relative z-[1] grid h-7 w-7 place-items-center rounded-full border text-[9px] font-extrabold',
                    completed && 'border-emerald-300 bg-emerald-300 text-slate-950',
                    active && 'border-cyan-200 bg-cyan-300 text-slate-950 ring-4 ring-cyan-300/15',
                    !completed && !active && 'border-white/15 bg-white/[0.05] text-white/30',
                  )}>
                    {completed ? '✓' : arc.number}
                  </span>
                  {index < AFTER_SCHOOL_STORY_ARCS.length - 1 && (
                    <span className={cx(
                      'absolute bottom-0 top-7 w-px',
                      index < currentIndex ? 'bg-emerald-300/55' : 'bg-white/10',
                    )} />
                  )}
                </span>
                <div className={cx('pb-3.5', !completed && !active && 'opacity-40')}>
                  <p className="text-[10px] font-extrabold leading-relaxed">{arc.title}</p>
                  {(completed || active) && (
                    <p className="mt-0.5 text-[8px] font-bold leading-relaxed text-white/45">{arc.summary}</p>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      </details>
    </section>
  )
}

function AfterSchoolBondBoard({ bonds, currentStudentId, unlockedStudentIds }) {
  const normalizedUnlockedIds = normalizeUnlockedBattleStudentIds(unlockedStudentIds)
  const unlockedIdSet = new Set(normalizedUnlockedIds)
  const relationshipStates = BATTLE_STUDENTS.map((student) => (
    afterSchoolBondState(bonds, student.id)
  ))
  const current = relationshipStates.find((state) => (
    state.student.id === currentStudentId
  )) ?? relationshipStates[0]
  const skillCount = relationshipStates.filter((state) => state.skillUnlocked).length
  const itemCount = relationshipStates.filter((state) => state.itemUnlocked).length

  return (
    <section className="overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-card">
      <div className="bg-gradient-to-br from-indigo-950 via-violet-950 to-fuchsia-950 p-4 text-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[9px] font-extrabold tracking-[0.12em] text-cyan-200">
              関係と報酬
            </p>
            <h2 className="mt-0.5 font-display text-base font-extrabold">
              放課後の関係ノート
            </h2>
          </div>
          <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-[8px] font-extrabold text-amber-100">
            仲間 {normalizedUnlockedIds.length}/{BATTLE_STUDENTS.length}
          </span>
        </div>
        <p className="mt-2 text-[10px] font-bold leading-relaxed text-white/60">
          対決後の行き先で新しいクラスメイトと知り合うと共闘可能に。再び会って関係を育てると、特技とアイテムも増えます。
        </p>

        <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-3">
          <img
            src={battleStudentPortrait(current.student.id, current.skillUnlocked ? 'confident' : 'curious')}
            alt=""
            className="h-12 w-12 shrink-0 rounded-2xl border-2 border-white/25 bg-slate-900 object-cover [image-rendering:pixelated]"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-xs font-extrabold">{current.student.name}との絆</p>
              <span className="shrink-0 text-[8px] font-extrabold text-cyan-100">
                LV{current.level.level} · {current.level.label}
              </span>
            </div>
            <ProgressBar
              value={current.progress}
              color="linear-gradient(90deg,#67e8f9,#c4b5fd,#f9a8d4)"
              className="mt-1.5 h-1.5 bg-white/15"
            />
            <p className="mt-1.5 truncate text-[8px] font-bold text-white/55">
              {current.skillUnlocked
                ? `${current.profile.skill.emoji} ${current.profile.skill.name} · ${current.profile.skill.description}`
                : `絆LV2まであと${Math.max(0, 3 - current.points)} · 特技を解放`}
            </p>
          </div>
        </div>
      </div>

      <details className="group">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-xs font-extrabold text-violet-800">
          <span>仲間・出会い・関係報酬を見る</span>
          <span className="text-[9px] text-violet-500 group-open:hidden">開く</span>
          <span className="hidden text-[9px] text-violet-500 group-open:inline">閉じる</span>
        </summary>
        <div className="grid grid-cols-2 gap-2 border-t border-violet-100 bg-violet-50/45 p-3">
          {relationshipStates.map((state) => {
            const unlocked = unlockedIdSet.has(state.student.id)
            return (
              <div
                key={state.student.id}
                className={cx(
                  'min-w-0 rounded-2xl border p-2.5',
                  unlocked ? 'bg-white' : 'bg-slate-100/80',
                  state.student.id === currentStudentId ? 'border-violet-300 ring-2 ring-violet-100' : 'border-ink/10',
                )}
              >
              <div className="flex items-center gap-2">
                <img
                  src={battleStudentPortrait(state.student.id, 'idle')}
                  alt=""
                  loading="lazy"
                  className={cx(
                    'h-9 w-9 shrink-0 rounded-xl bg-slate-900 object-cover [image-rendering:pixelated]',
                    !unlocked && 'brightness-0 opacity-55',
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[10px] font-extrabold text-ink">{unlocked ? state.student.name : '？？？'}</p>
                  <p className={cx('truncate text-[8px] font-bold', unlocked ? 'text-violet-600' : 'text-ink/35')}>
                    {unlocked ? `絆LV${state.level.level} · ${state.points}pt` : '🔒 放課後イベントで出会う'}
                  </p>
                </div>
              </div>
              <p className={cx('mt-2 truncate text-[8px] font-extrabold', unlocked && state.skillUnlocked ? 'text-cyan-700' : 'text-ink/35')}>
                {unlocked ? state.profile.skill.emoji : '✦'} {unlocked && state.skillUnlocked ? state.profile.skill.name : unlocked ? 'LV2 特技' : '共闘能力 未確認'}
              </p>
              <p className={cx('mt-0.5 truncate text-[8px] font-extrabold', unlocked && state.itemUnlocked ? 'text-amber-700' : 'text-ink/35')}>
                {unlocked ? state.profile.item.emoji : '🔒'} {unlocked && state.itemUnlocked ? state.profile.item.name : unlocked ? 'LV3 アイテム' : '思い出 未記録'}
              </p>
              </div>
            )
          })}
        </div>
        <p className="border-t border-violet-100 bg-white px-4 py-2 text-[8px] font-bold text-ink/40">
          現在：特技 {skillCount}/{BATTLE_STUDENTS.length} · アイテム {itemCount}/{BATTLE_STUDENTS.length}
        </p>
      </details>
    </section>
  )
}

function SchoolBarrierMap() {
  const [locationId, setLocationId] = useState(BATTLE_BARRIER_CENTER.id)
  const selectedLocation = battleBarrierLocationById(locationId)
  const locationById = new Map(
    BATTLE_BARRIER_NODES.map((location) => [location.id, location]),
  )
  const outerPoints = BATTLE_BARRIER_NODES
    .map((location) => `${location.x},${location.y}`)
    .join(' ')
  const starPoints = BATTLE_BARRIER_STAR_ORDER
    .map((id) => locationById.get(id))
    .map((location) => `${location.x},${location.y}`)
    .join(' ')

  return (
    <section className="school-barrier-card overflow-hidden rounded-3xl bg-slate-950 text-white shadow-card">
      <div className="flex items-start justify-between gap-3 px-4 pb-3 pt-4">
        <div>
          <p className="text-[9px] font-extrabold tracking-[0.18em] text-cyan-300">
            STAR BARRIER DISTRICT
          </p>
          <h2 className="mt-0.5 font-display text-base font-extrabold">
            星環学区結界
          </h2>
        </div>
        <span className="shrink-0 rounded-full border border-amber-200/20 bg-amber-100/10 px-2 py-0.5 text-[7px] font-extrabold tracking-[0.12em] text-amber-100">
          ● LIVE DISTRICT
        </span>
      </div>
      <p className="px-4 pb-3 text-[10px] font-bold leading-relaxed text-white/55">
        学校を中心核として、街の五地点が五芒星を結ぶ。地点をタップして結界を確認しよう。
      </p>

      <div
        className="school-barrier-map relative aspect-video overflow-hidden bg-indigo-950"
        role="group"
        aria-label="学校を中心とする五芒星結界マップ"
      >
        <img
          src={BATTLE_BARRIER_MAP_IMAGE}
          alt="中央の学校と、図書館、駅前、中央公園、神社、競技場を俯瞰した現代日本の夜の街"
          className="school-barrier-map-image h-full w-full object-cover"
        />
        <span className="school-barrier-map-shade pointer-events-none absolute inset-0" />

        <span
          className="school-barrier-window-lights pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          {BATTLE_BARRIER_WINDOW_LIGHTS.map((light) => (
            <i
              key={light.id}
              className="school-barrier-window-light absolute rounded-full"
              style={{
                left: `${light.x}%`,
                top: `${light.y}%`,
                '--window-light-delay': `${-light.delay}s`,
                '--window-light-duration': `${light.duration}s`,
                '--window-light-size': `${light.size}px`,
              }}
            />
          ))}
        </span>

        <svg
          className="school-barrier-traffic pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {BATTLE_BARRIER_TRAFFIC_LIGHTS.map((light) => (
            <g
              key={light.id}
              className={cx(
                'school-barrier-traffic-car',
                `school-barrier-traffic-${light.kind}`,
              )}
            >
              <ellipse
                className="school-barrier-traffic-trail"
                cx="-1.45"
                rx={light.kind === 'train' ? '3.4' : '2.15'}
                ry="0.34"
              />
              <circle className="school-barrier-traffic-glow" r="1.65" />
              <circle className="school-barrier-traffic-lamp" r="0.52" />
              <animateMotion
                path={light.path}
                dur={`${light.duration}s`}
                begin={`${light.delay}s`}
                repeatCount="indefinite"
              />
            </g>
          ))}
        </svg>

        <svg
          className="school-barrier-lines pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polygon className="school-barrier-outer" points={outerPoints} />
          {BATTLE_BARRIER_NODES.map((location) => (
            <line
              key={location.id}
              className="school-barrier-spoke"
              x1={BATTLE_BARRIER_CENTER.x}
              y1={BATTLE_BARRIER_CENTER.y}
              x2={location.x}
              y2={location.y}
            />
          ))}
          <polyline className="school-barrier-star" points={starPoints} />
          <circle
            className="school-barrier-core-ring"
            cx={BATTLE_BARRIER_CENTER.x}
            cy={BATTLE_BARRIER_CENTER.y}
            r="5.5"
          />
        </svg>

        {[BATTLE_BARRIER_CENTER, ...BATTLE_BARRIER_NODES].map((location) => {
          const selected = location.id === selectedLocation.id
          const center = location.id === BATTLE_BARRIER_CENTER.id
          return (
            <button
              key={location.id}
              type="button"
              onClick={() => setLocationId(location.id)}
              aria-pressed={selected}
              aria-label={`${location.name}・${location.role}`}
              className={cx(
                'school-barrier-marker absolute z-10 -translate-x-1/2 -translate-y-1/2 text-center transition-transform active:scale-95',
                center && 'school-barrier-marker-core',
                selected && 'school-barrier-marker-selected',
              )}
              style={{
                left: `${location.x}%`,
                top: `${location.y}%`,
                '--barrier-node-color': location.accent,
              }}
            >
              <span className="school-barrier-marker-icon mx-auto grid place-items-center rounded-full border-2 bg-slate-950/85 shadow-lg backdrop-blur-sm">
                {location.emoji}
              </span>
              <span className="school-barrier-marker-label mt-0.5 block whitespace-nowrap rounded-full border border-white/15 bg-slate-950/80 px-1.5 py-0.5 text-[6px] font-extrabold leading-none shadow-md backdrop-blur-sm">
                {location.name}
              </span>
            </button>
          )
        })}
      </div>

      <div className="school-barrier-location flex items-center gap-3 px-4 py-3" aria-live="polite">
        <span
          key={selectedLocation.id}
          className="school-barrier-location-icon grid h-11 w-11 shrink-0 place-items-center rounded-2xl border text-xl"
          style={{
            borderColor: `${selectedLocation.accent}80`,
            backgroundColor: `${selectedLocation.accent}18`,
            color: selectedLocation.accent,
          }}
        >
          {selectedLocation.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-sm font-extrabold">
              {selectedLocation.name}
            </h3>
            <span
              className="rounded-full px-2 py-0.5 text-[7px] font-extrabold"
              style={{
                backgroundColor: `${selectedLocation.accent}1f`,
                color: selectedLocation.accent,
              }}
            >
              {selectedLocation.role}
            </span>
          </div>
          <p className="mt-1 text-[9px] font-bold leading-relaxed text-white/55">
            {selectedLocation.description}
          </p>
        </div>
        <span className="shrink-0 text-[8px] font-extrabold tracking-[0.12em] text-emerald-300">
          CONNECTED
        </span>
      </div>
    </section>
  )
}

function CampusLifeGallery({ onTalk }) {
  const [sceneId, setSceneId] = useState(BATTLE_DAILY_SCENES[0].id)
  const [choiceByScene, setChoiceByScene] = useState({})
  const scene = battleDailySceneById(sceneId)
  const sceneNumber = BATTLE_DAILY_SCENES.findIndex((item) => item.id === scene.id) + 1
  const episode = scene.episode
  const speaker = battleStudentById(episode.speakerId)
  const scenePortrait = (studentId, emotionId = 'idle') => (
    scene.outfitId === 'home' || scene.outfitId === 'weekend'
      ? battleStudentLifestylePortrait(studentId, scene.outfitId)
      : battleStudentPortrait(studentId, emotionId)
  )
  const selectedChoice = episode.choices.find(
    (choice) => choice.id === choiceByScene[scene.id],
  ) ?? null

  const selectEpisodeChoice = (choiceId) => {
    setChoiceByScene((current) => ({ ...current, [scene.id]: choiceId }))
  }

  return (
    <section className="campus-life-gallery overflow-hidden rounded-3xl bg-slate-950 text-white shadow-card">
      <div className="flex items-end justify-between gap-3 px-4 pb-3 pt-4">
        <div>
          <p className="text-[9px] font-extrabold tracking-[0.18em] text-pink-300">
            CAMPUS LIFE STORIES
          </p>
          <h2 className="mt-0.5 font-display text-base font-extrabold">
            友達と過ごす日常
          </h2>
        </div>
        <button
          type="button"
          onClick={onTalk}
          className="min-h-9 shrink-0 rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500 px-3 text-[9px] font-extrabold text-white shadow-md transition-transform active:scale-95"
        >
          💬 日常トークへ
        </button>
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
            alt={`${scene.name}で同じ活動を一緒に楽しむ友達のイラスト`}
            className="campus-life-scene-image h-full w-full object-cover"
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
              <span className="ml-1 inline-flex rounded-full border border-white/20 bg-white/10 px-2 py-1 text-[8px] font-extrabold text-cyan-100 backdrop-blur-sm">
                {scene.outfitId === 'weekend' ? '休日私服' : '学校・放課後'}
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
                      src={scenePortrait(student.id, emotionId)}
                      alt={student.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
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
        role="group"
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
            >
              <img
                src={item.image}
                alt=""
                loading="lazy"
                className="aspect-video w-full object-cover"
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

      <div className="border-t border-white/10 bg-white/[0.04] px-4 pb-4 pt-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[9px] font-extrabold tracking-[0.16em] text-amber-200">
              SHORT EPISODE
            </p>
            <h3 className="mt-0.5 font-display text-base font-extrabold text-white">
              {episode.title}
            </h3>
          </div>
          <span className="shrink-0 rounded-full bg-pink-400/15 px-2 py-1 text-[8px] font-extrabold text-pink-100">
            {speaker.emoji} {speaker.name}
          </span>
        </div>

        <p className="mt-2 text-[11px] font-bold leading-relaxed text-white/60">
          {episode.situation}
        </p>

        <div className="mt-3 flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-950/65 p-3">
          <span className="battle-expression-change h-14 w-14 shrink-0 overflow-hidden rounded-2xl border-2 border-white/15 bg-slate-900">
            <img
              src={scenePortrait(speaker.id, episode.openingEmotionId)}
              alt={`${speaker.name}の${battleEmotionById(episode.openingEmotionId).label}の表情`}
              className="h-full w-full object-cover"
            />
          </span>
          <div className="min-w-0 flex-1">
            <span className="text-[9px] font-extrabold text-cyan-200">
              {speaker.name} · {speaker.club}
            </span>
            <p className="mt-1 text-xs font-extrabold leading-relaxed text-white">
              {episode.opening}
            </p>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-end justify-between gap-2">
            <p className="text-xs font-extrabold text-white">
              {speaker.name}へ、どんな声をかける？
            </p>
            <span className="text-[8px] font-bold text-white/35">
              採点なし
            </span>
          </div>
          <p className="mt-1 text-[9px] font-bold leading-relaxed text-white/45">
            どれを選んでも正解・不正解はありません。言葉によって返事と表情が変わります。
          </p>

          <div
            className="mt-2.5 grid gap-2"
            role="group"
            aria-label={`${speaker.name}への声掛けを選択`}
          >
            {episode.choices.map((choice) => {
              const style = battleSupportStyleById(choice.styleId)
              const selected = selectedChoice?.id === choice.id
              return (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => selectEpisodeChoice(choice.id)}
                  aria-pressed={selected}
                  className={cx(
                    'min-h-12 rounded-2xl border px-3 py-2.5 text-left transition-transform active:scale-[0.99]',
                    selected
                      ? 'border-pink-200 bg-white/20 ring-2 ring-pink-300/20'
                      : 'border-white/10 bg-white/[0.06]',
                  )}
                >
                  <span className="block text-[8px] font-extrabold text-amber-200">
                    {style.emoji} {style.label}
                  </span>
                  <strong className="mt-0.5 block text-[11px] font-extrabold leading-relaxed text-white">
                    {choice.label}
                  </strong>
                </button>
              )
            })}
          </div>
        </div>

        {selectedChoice && (
          <div
            key={`${scene.id}-${selectedChoice.id}`}
            className="battle-expression-change mt-3 rounded-2xl border border-cyan-200/20 bg-gradient-to-br from-cyan-400/15 to-pink-400/10 p-3"
            role="status"
            aria-live="polite"
          >
            <div className="ml-auto max-w-[88%] rounded-2xl rounded-br-md bg-violet-500/75 px-3 py-2 text-right">
              <span className="text-[8px] font-extrabold text-violet-100">あなた（主人公）の声かけ</span>
              <p className="mt-0.5 text-[11px] font-extrabold leading-relaxed text-white">
                {selectedChoice.label}
              </p>
            </div>
            <div className="mt-2 flex items-start gap-3">
              <span className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border-2 border-cyan-100/30 bg-slate-900">
                <img
                  src={scenePortrait(speaker.id, selectedChoice.emotionId)}
                  alt={`${speaker.name}の${battleEmotionById(selectedChoice.emotionId).label}の表情`}
                  className="h-full w-full object-cover"
                />
              </span>
              <div className="min-w-0 flex-1">
                <span className="text-[9px] font-extrabold text-cyan-100">
                  {speaker.name}の返事 · {battleEmotionById(selectedChoice.emotionId).emoji}
                  {' '}{battleEmotionById(selectedChoice.emotionId).label}
                </span>
                <p className="mt-1 text-xs font-extrabold leading-relaxed text-white">
                  {selectedChoice.reply}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function SchoolLifeAlbum() {
  const [categoryId, setCategoryId] = useState('all')
  const [visualId, setVisualId] = useState(SCHOOL_LIFE_VISUALS[0].id)
  const visual = schoolLifeVisualById(visualId)
  const category = SCHOOL_LIFE_VISUAL_CATEGORIES.find(
    (item) => item.id === visual.category,
  )
  const filteredVisuals = categoryId === 'all'
    ? SCHOOL_LIFE_VISUALS
    : SCHOOL_LIFE_VISUALS.filter((item) => item.category === categoryId)
  const visualNumber = SCHOOL_LIFE_VISUALS.findIndex((item) => item.id === visual.id) + 1
  const totalSceneCount = BATTLE_DAILY_SCENES.length + SCHOOL_LIFE_VISUALS.length

  const selectCategory = (nextCategoryId) => {
    setCategoryId(nextCategoryId)
    if (nextCategoryId === 'all' || visual.category === nextCategoryId) return
    const firstVisual = SCHOOL_LIFE_VISUALS.find(
      (item) => item.category === nextCategoryId,
    )
    if (firstVisual) setVisualId(firstVisual.id)
  }

  return (
    <section className="school-life-album overflow-hidden rounded-3xl bg-slate-950 text-white shadow-card">
      <div className="flex items-start justify-between gap-3 px-4 pb-3 pt-4">
        <div className="min-w-0">
          <p className="text-[9px] font-extrabold tracking-[0.18em] text-cyan-300">
            SCHOOL LIFE GALLERY
          </p>
          <h2 className="mt-0.5 font-display text-base font-extrabold">
            学校生活・行事ギャラリー
          </h2>
          <p className="mt-1 text-[9px] font-bold leading-relaxed text-white/50">
            物語の舞台になる通学、授業、昼休み、部活、行事、下校の場面を見る。
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="rounded-full border border-cyan-200/20 bg-cyan-400/10 px-2 py-1 text-[8px] font-extrabold text-cyan-100">
            {totalSceneCount} SCENES
          </span>
          <span className="text-[7px] font-extrabold tracking-[0.12em] text-pink-300">
            +{SCHOOL_LIFE_VISUALS.length} NEW
          </span>
        </div>
      </div>

      <div
        className="school-life-category-list flex gap-2 overflow-x-auto px-3 pb-3"
        role="group"
        aria-label="学校生活アルバムのカテゴリ"
      >
        {SCHOOL_LIFE_VISUAL_CATEGORIES.map((item) => {
          const selected = item.id === categoryId
          const count = item.id === 'all'
            ? SCHOOL_LIFE_VISUALS.length
            : SCHOOL_LIFE_VISUALS.filter((visualItem) => visualItem.category === item.id).length
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => selectCategory(item.id)}
              aria-pressed={selected}
              className={cx(
                'min-h-11 shrink-0 rounded-full border px-3 text-[9px] font-extrabold transition-transform active:scale-95',
                selected
                  ? 'border-cyan-200 bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-500/15'
                  : 'border-white/10 bg-white/[0.06] text-white/70',
              )}
            >
              {item.emoji} {item.label} <span className="opacity-60">{count}</span>
            </button>
          )
        })}
      </div>

      <div
        id="school-life-album-scene"
        className="campus-life-stage relative aspect-video overflow-hidden bg-indigo-950"
        role="region"
        aria-live="polite"
        aria-label={`${visual.name}。${visual.description}`}
      >
        <span key={visual.id} className="campus-life-scene-frame absolute inset-0">
          <img
            src={visual.image}
            alt={`${visual.name}。${visual.description}`}
            className="campus-life-scene-image h-full w-full object-cover"
          />
        </span>
        <span className="campus-life-scanlines pointer-events-none absolute inset-0" />
        <span className="absolute right-3 top-3 z-[2] rounded-full border border-white/20 bg-slate-950/70 px-2 py-1 text-[8px] font-extrabold tracking-[0.12em] backdrop-blur-sm">
          {String(visualNumber).padStart(2, '0')} / {String(SCHOOL_LIFE_VISUALS.length).padStart(2, '0')}
        </span>

        <div className="absolute inset-x-0 bottom-0 z-[2] bg-gradient-to-t from-slate-950 via-slate-950/78 to-transparent px-4 pb-3 pt-10">
          <div className="flex flex-wrap items-center gap-1">
            <span className="rounded-full border border-white/20 bg-white/10 px-2 py-1 text-[8px] font-extrabold text-amber-100 backdrop-blur-sm">
              {visual.emoji} {visual.time}
            </span>
            <span className="rounded-full border border-white/20 bg-white/10 px-2 py-1 text-[8px] font-extrabold text-cyan-100 backdrop-blur-sm">
              {category?.emoji} {category?.label}
            </span>
          </div>
          <h3 className="mt-1.5 font-display text-base font-extrabold leading-tight">
            {visual.name}
          </h3>
          <p className="mt-1 max-w-[35rem] text-[9px] font-bold leading-relaxed text-white/65">
            {visual.description}
          </p>
        </div>
      </div>

      <div
        className="school-life-visual-grid grid grid-cols-2 gap-2 p-3 sm:grid-cols-3"
        role="group"
        aria-label="学校生活の場面を選択"
      >
        {filteredVisuals.map((item) => {
          const selected = item.id === visual.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setVisualId(item.id)}
              aria-pressed={selected}
              aria-controls="school-life-album-scene"
              className={cx(
                'school-life-visual-choice min-h-24 overflow-hidden rounded-2xl border text-left transition-transform active:scale-[0.98]',
                selected
                  ? 'border-cyan-200 bg-white/15 ring-2 ring-cyan-300/30'
                  : 'border-white/10 bg-white/[0.05]',
              )}
            >
              <span className="relative block">
                <img
                  src={item.image}
                  alt=""
                  loading="lazy"
                  className="aspect-video w-full object-cover"
                />
                <span className="absolute bottom-1 right-1 rounded-full bg-slate-950/75 px-1.5 py-0.5 text-[7px] font-extrabold text-white/80">
                  {item.time}
                </span>
              </span>
              <span className="block truncate px-2 py-2 text-[9px] font-extrabold">
                {item.emoji} {item.shortName}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function TeacherSchoolLife({ student }) {
  const [teacherId, setTeacherId] = useState(TEACHER_SCHOOL_LIFE[0].id)
  const [scoreChoiceId, setScoreChoiceId] = useState(null)
  const [remedialSubject, setRemedialSubject] = useState(null)
  const [resolutionId, setResolutionId] = useState(null)
  const teacher = teacherSchoolLifeById(teacherId)
  const conversation = createTeacherSchoolLifeConversation({
    teacherId: teacher.id,
    studentId: student.id,
    scoreChoiceId,
    remedialSubject,
    resolutionId,
  })
  const subjectChoices = teacherRemedialSubjectChoices(teacher.id)

  const resetConversation = () => {
    setScoreChoiceId(null)
    setRemedialSubject(null)
    setResolutionId(null)
  }

  const selectTeacher = (nextTeacherId) => {
    setTeacherId(nextTeacherId)
    setScoreChoiceId(null)
    setRemedialSubject(null)
    setResolutionId(null)
  }

  const selectScore = (nextScoreChoiceId) => {
    setScoreChoiceId(nextScoreChoiceId)
    setRemedialSubject(null)
    setResolutionId(null)
  }

  return (
    <section className="teacher-school-life overflow-hidden rounded-3xl bg-white shadow-card">
      <div
        className="relative overflow-hidden px-4 pb-3 pt-4 text-white"
        style={{
          background: `linear-gradient(135deg,#0f172a 0%,${teacher.accent} 145%)`,
        }}
      >
        <div className="pointer-events-none absolute -right-5 -top-8 text-[7rem] opacity-10">
          {teacher.subjectEmoji}
        </div>
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <p className="text-[9px] font-extrabold tracking-[0.18em] text-amber-200">
              FACULTY CAMPUS STORIES
            </p>
            <h2 className="mt-0.5 flex items-center gap-1.5 font-display text-base font-extrabold">
              <ChronicleIcon kind="faculty" size={24} />
              <span>先生たちとの学校生活</span>
            </h2>
          </div>
          <span className="shrink-0 rounded-full bg-white/10 px-2 py-1 text-[8px] font-extrabold">
            {TEACHER_SCHOOL_LIFE.length}人 · 12科目
          </span>
        </div>
        <p className="relative mt-2 text-[10px] font-bold leading-relaxed text-white/65">
          愛情も、冗談も、厳しさも先生ごとに別。選んだクラスメイトとして放課後の会話を体験できます。
        </p>

        <div
          className="teacher-school-life-selector relative mt-3 flex gap-2 overflow-x-auto pb-2"
          role="list"
          aria-label="話す先生を選ぶ"
        >
          {TEACHER_SCHOOL_LIFE.map((item) => {
            const selected = item.id === teacher.id
            return (
              <button
                key={item.id}
                type="button"
                role="listitem"
                aria-pressed={selected}
                onClick={() => selectTeacher(item.id)}
                className={cx(
                  'w-[70px] shrink-0 rounded-2xl border px-1.5 py-2 text-center transition-transform active:scale-95',
                  selected
                    ? 'border-amber-200 bg-white/20 ring-2 ring-amber-200/25'
                    : 'border-white/10 bg-white/[0.06]',
                )}
              >
                <TeacherPortrait
                  teacher={item}
                  decorative
                  className="mx-auto h-9 w-9 rounded-xl"
                />
                <strong className="mt-1 block truncate text-[8px] font-extrabold">
                  {item.name.replace(/先生$/u, '')}
                </strong>
                <span className="block truncate text-[7px] font-bold text-white/45">
                  {item.teacherSubject}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="p-3.5">
        <div className="flex items-center gap-3 rounded-2xl bg-slate-950 p-3 text-white">
          <MobPortrait
            encounter={teacher}
            className="h-20 w-20 shrink-0 rounded-2xl"
            showBadge={false}
          />
          <div className="min-w-0 flex-1">
            <span
              className="inline-flex rounded-full px-2 py-1 text-[8px] font-extrabold text-slate-950"
              style={{ backgroundColor: teacher.accent }}
            >
              {teacher.subjectEmoji} {teacher.teacherSubject}担当
            </span>
            <h3 className="mt-1.5 font-display text-base font-extrabold">
              {teacher.name}
            </h3>
            <p className="mt-0.5 text-[9px] font-bold leading-relaxed text-white/50">
              {teacher.lore}
            </p>
          </div>
          <span className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border-2 border-white/20 bg-slate-900">
            <img
              src={battleStudentPortrait(student.id, conversation.phase === 'resolution' ? 'surprised' : 'curious')}
              alt={`${student.name}の表情`}
              className="h-full w-full object-cover [image-rendering:pixelated]"
            />
          </span>
        </div>

        <div
          className="mt-3 space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-2.5"
          role="log"
          aria-live="polite"
          aria-label={`${teacher.name}と${student.name}の学校生活会話`}
        >
          {conversation.messages.map((item, index) => {
            if (item.role === 'narration') {
              return (
                <p
                  key={`${item.role}-${index}`}
                  className="rounded-xl bg-amber-50 px-2.5 py-2 text-[9px] font-bold leading-relaxed text-amber-900"
                >
                  ✦ {item.text}
                </p>
              )
            }
            const isStudent = item.role === 'student'
            return (
              <div
                key={`${item.role}-${index}`}
                className={cx('flex', isStudent ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={cx(
                    'max-w-[88%] rounded-2xl px-3 py-2 shadow-sm',
                    isStudent
                      ? 'rounded-br-md bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white'
                      : 'rounded-tl-md border border-slate-200 bg-white text-ink',
                  )}
                >
                  <span className={cx(
                    'block text-[8px] font-extrabold',
                    isStudent ? 'text-white/65' : 'text-violet-500',
                  )}
                  >
                    {isStudent ? student.name : teacher.name}
                  </span>
                  <p className="mt-0.5 text-[10px] font-extrabold leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {conversation.phase === 'score' && (
          <div className="mt-3 grid grid-cols-2 gap-2" role="group" aria-label="定期テストの点数を選ぶ">
            {TEACHER_TEST_SCORE_CHOICES.map((choice) => (
              <button
                key={choice.id}
                type="button"
                onClick={() => selectScore(choice.id)}
                className={cx(
                  'min-h-12 rounded-2xl border px-2 py-2 text-[10px] font-extrabold transition-transform active:scale-[0.98]',
                  choice.id === 'remedial'
                    ? 'border-rose-200 bg-rose-50 text-rose-700'
                    : 'border-violet-100 bg-violet-50 text-violet-800',
                )}
              >
                {choice.label}
              </button>
            ))}
          </div>
        )}

        {conversation.phase === 'subject' && (
          <div className="mt-3 grid grid-cols-3 gap-2" role="group" aria-label="補習になった教科を選ぶ">
            {subjectChoices.map((subject) => (
              <button
                key={subject.id}
                type="button"
                onClick={() => setRemedialSubject(subject.id)}
                className="min-h-12 rounded-2xl border border-amber-200 bg-amber-50 px-1.5 py-2 text-[9px] font-extrabold text-amber-900 transition-transform active:scale-[0.98]"
              >
                <span className="block text-base">{subject.emoji}</span>
                {subject.label}
              </button>
            ))}
          </div>
        )}

        {conversation.phase === 'resolution' && (
          <div className="mt-3 grid grid-cols-2 gap-2" role="group" aria-label="先生に見つかった後の行動を選ぶ">
            <button
              type="button"
              onClick={() => setResolutionId('escape')}
              className="min-h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 px-3 py-2 text-[10px] font-extrabold text-white shadow-md transition-transform active:scale-[0.98]"
            >
              🏃 逃げる！
            </button>
            <button
              type="button"
              onClick={() => setResolutionId('stay')}
              className="min-h-12 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 px-3 py-2 text-[10px] font-extrabold text-white shadow-md transition-transform active:scale-[0.98]"
            >
              📘 補習を受ける
            </button>
          </div>
        )}

        {conversation.phase === 'complete' && (
          <button
            type="button"
            onClick={resetConversation}
            className="mt-3 min-h-11 w-full rounded-2xl border border-violet-200 bg-violet-50 px-3 text-[10px] font-extrabold text-violet-700 transition-transform active:scale-[0.99]"
          >
            ↻ {teacher.name}と別の会話を試す
          </button>
        )}

        <p className="mt-2 text-center text-[8px] font-bold leading-relaxed text-ink/35">
          ここで選ぶ点数は物語上の架空成績です。実際の正答率・XP・SRS・診断結果は変わりません。
        </p>
      </div>
    </section>
  )
}

const TRAIT_STAR_DRAW_ORDER = [0, 2, 4, 1, 3, 0]
const TRAIT_SPHERE_CENTER = { x: 120, y: 112 }

function traitSpherePoint(trait, level) {
  const ratio = Math.max(0, Math.min(MAX_BATTLE_TRAIT_LEVEL, level))
    / MAX_BATTLE_TRAIT_LEVEL
  return {
    x: TRAIT_SPHERE_CENTER.x + (trait.x - TRAIT_SPHERE_CENTER.x) * ratio,
    y: TRAIT_SPHERE_CENTER.y + (trait.y - TRAIT_SPHERE_CENTER.y) * ratio,
  }
}

function BattleTraitSphere({
  student,
  battleStars,
  investments,
}) {
  const profile = battleStudentTraitProfile(student.id, investments, battleStars)
  const radarPoints = BATTLE_TRAITS.map((trait) =>
    traitSpherePoint(trait, profile.levels[trait.id]))
  const outerStar = TRAIT_STAR_DRAW_ORDER.map((index) => {
    const trait = BATTLE_TRAITS[index]
    return `${trait.x},${trait.y}`
  }).join(' ')
  const radarShape = radarPoints.map((point) => `${point.x},${point.y}`).join(' ')
  const sphereLabel = BATTLE_TRAITS.map(
    (trait) => `${trait.name}レベル${profile.levels[trait.id]}`,
  ).join('、')

  return (
    <section
      className="battle-trait-sphere mt-4 overflow-hidden rounded-3xl border border-violet-100 bg-slate-950 text-white"
      style={{
        '--student-trait-color': profile.dominant.color,
        '--student-trait-secondary': profile.secondary.color,
      }}
    >
      <div className="flex items-start justify-between gap-3 px-3 pb-1 pt-3">
        <div>
          <p className="text-[8px] font-black tracking-[0.18em] text-cyan-300">
            CHROMA SPHERE
          </p>
          <h4 className="mt-0.5 text-sm font-extrabold">五芒星の星彩スフィア</h4>
        </div>
        <div className="shrink-0 rounded-xl border border-white/10 bg-white/[0.07] px-2 py-1.5 text-right">
          <span className="block text-[8px] font-bold text-white/45">全員共通</span>
          <strong className="block text-[11px] text-amber-200">
            ◈ {profile.summary.available}/{profile.summary.budget} pt
          </strong>
        </div>
      </div>

      <div className="grid items-center gap-1 px-2 sm:grid-cols-[minmax(0,1fr)_112px]">
        <svg
          viewBox="0 0 240 220"
          className="mx-auto block w-full max-w-[250px]"
          role="img"
          aria-label={`${student.name}の星彩スフィア。${sphereLabel}。発現色は${profile.colorLabel}`}
        >
          <polygon
            points={outerStar}
            fill="rgba(255,255,255,0.025)"
            stroke="rgba(255,255,255,0.34)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {BATTLE_TRAITS.map((trait) => (
            <line
              key={`spoke-${trait.id}`}
              x1={TRAIT_SPHERE_CENTER.x}
              y1={TRAIT_SPHERE_CENTER.y}
              x2={trait.x}
              y2={trait.y}
              stroke={trait.color}
              strokeOpacity="0.28"
              strokeWidth="1.5"
              strokeDasharray="3 4"
            />
          ))}
          {BATTLE_TRAITS.map((trait, index) => {
            const point = radarPoints[index]
            const nextPoint = radarPoints[(index + 1) % radarPoints.length]
            return (
              <polygon
                key={`sector-${trait.id}`}
                points={`${TRAIT_SPHERE_CENTER.x},${TRAIT_SPHERE_CENTER.y} ${point.x},${point.y} ${nextPoint.x},${nextPoint.y}`}
                fill={trait.color}
                fillOpacity="0.38"
              />
            )
          })}
          <polygon
            points={radarShape}
            fill="none"
            stroke="rgba(255,255,255,0.88)"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <circle
            cx={TRAIT_SPHERE_CENTER.x}
            cy={TRAIT_SPHERE_CENTER.y}
            r="10"
            fill={profile.dominant.color}
            opacity="0.95"
            className="battle-trait-sphere-core"
          />
          {BATTLE_TRAITS.map((trait) => {
            const level = profile.levels[trait.id]
            return (
              <g key={`node-${trait.id}`}>
                <circle
                  cx={trait.x}
                  cy={trait.y}
                  r={12 + level * 0.8}
                  fill={trait.color}
                  fillOpacity={0.34 + level * 0.11}
                  stroke="rgba(255,255,255,0.8)"
                  strokeWidth="1.5"
                  className="battle-trait-sphere-node"
                />
                <text
                  x={trait.x}
                  y={trait.y + 3}
                  textAnchor="middle"
                  fill="white"
                  fontSize="9"
                  fontWeight="900"
                >
                  {level}
                </text>
              </g>
            )
          })}
        </svg>

        <div className="px-1 pb-2 text-center sm:text-left">
          <span
            className="inline-flex items-center rounded-full px-2 py-1 text-[9px] font-extrabold text-slate-950"
            style={{ background: profile.aura }}
          >
            {profile.dominant.emoji} 発現色：{profile.colorLabel}
          </span>
          <p
            key={`${student.id}-${profile.dominant.id}`}
            className="battle-trait-voice mt-2 text-[10px] font-extrabold leading-relaxed text-white/85"
            aria-live="polite"
          >
            {profile.voice}
          </p>
          <p className="mt-1.5 text-[8px] font-bold leading-relaxed text-white/40">
            {profile.dominant.description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-1.5 border-t border-white/10 bg-white/[0.035] p-2">
        {BATTLE_TRAITS.map((trait) => {
          const level = profile.levels[trait.id]
          const invested = profile.invested[trait.id] ?? 0
          return (
            <div
              key={trait.id}
              className="battle-trait-button min-h-16 min-w-0 rounded-xl border px-1 py-1.5 text-center"
              style={{
                '--trait-color': trait.color,
                '--trait-soft': trait.softColor,
              }}
            >
              <span className="block text-sm">{trait.emoji}</span>
              <strong className="block truncate text-[9px]">{trait.name}</strong>
              <span className="block text-[8px] font-black text-white/55">
                LV{level}{level >= MAX_BATTLE_TRAIT_LEVEL ? ' MAX' : ''}
              </span>
              {invested > 0 && (
                <span className="block text-[7px] font-bold text-white/35">育成+{invested}</span>
              )}
            </div>
          )
        })}
      </div>

      <div className="min-h-10 border-t border-white/10 px-3 py-2">
        <p className="text-[8px] font-bold leading-relaxed text-white/40">
          ✦ {BATTLE_TRAIT_POINT_STARS}スターで1pt。育成・振り直しはメニュー内「設定」で行います。学習評価は変わりません。
        </p>
      </div>
    </section>
  )
}

function BattleCastRoster({
  selectedStudentId,
  battleStars,
  investments,
  unlockedStudentIds,
}) {
  const unlockedCount = normalizeUnlockedBattleStudentIds(unlockedStudentIds).length
  const selectedStudent = battleStudentById(selectedStudentId)
  const traitProfile = battleStudentTraitProfile(
    selectedStudent.id,
    investments,
    battleStars,
  )
  const [emotionId, setEmotionId] = useState('playful')
  const emotion = battleEmotionById(emotionId)

  return (
    <section className="battle-cast-roster overflow-hidden rounded-3xl bg-white shadow-card">
      <div className="bg-gradient-to-br from-indigo-950 via-violet-950 to-fuchsia-950 p-4 text-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[9px] font-extrabold tracking-[0.18em] text-cyan-300">
              CLASSMATE CAST
            </p>
            <h2 className="mt-0.5 font-display text-base font-extrabold">
              現在の同行クラスメート
            </h2>
          </div>
          <div className="flex shrink-0 gap-1">
            <span className="rounded-full bg-white/10 px-2 py-1 text-[8px] font-extrabold">
              仲間 {unlockedCount}/{BATTLE_STUDENTS.length}
            </span>
            <span className="rounded-full bg-pink-400/20 px-2 py-1 text-[8px] font-extrabold text-pink-100">
              次の変更は戦果後
            </span>
          </div>
        </div>
        <p className="mt-2 text-[10px] font-bold leading-relaxed text-white/55">
          ここでは現在の同行者と星彩を確認できます。育成はメニュー内「設定」、同行者の選択はバトル後の戦果画面で行い、次のバトルから反映されます。
        </p>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3">
          <span
            key={`${selectedStudent.id}-${emotion.id}`}
            className="battle-expression-change battle-trait-avatar-aura h-24 w-24 shrink-0 overflow-hidden rounded-[1.6rem] border-4 bg-slate-950 shadow-lg"
            style={{
              '--student-trait-color': traitProfile.dominant.color,
              '--student-trait-secondary': traitProfile.secondary.color,
              borderColor: traitProfile.dominant.color,
            }}
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
              style={{ background: traitProfile.aura }}
            >
              {traitProfile.dominant.emoji} 発現色 · {traitProfile.colorLabel}
            </span>
            <h3 className="mt-1.5 font-display text-lg font-extrabold text-ink">
              {selectedStudent.emoji} {selectedStudent.name}
            </h3>
            <p className="text-[10px] font-extrabold text-violet-500">
              {selectedStudent.club} · {selectedStudent.reading}
            </p>
            <p className="mt-1 text-[9px] font-extrabold text-emerald-600">
              得意科目：{battleStudentBestSubjects(selectedStudent.id).join('・')}
            </p>
            <p className="mt-1 text-[10px] font-bold leading-relaxed text-ink/50">
              {selectedStudent.trait}
            </p>
          </div>
        </div>

        <BattleTraitSphere
          student={selectedStudent}
          battleStars={battleStars}
          investments={investments}
        />

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
                    <figure
                      key={rival.id}
                      className="min-w-0 text-center"
                      title={`${rival.name}・${rival.title}`}
                      aria-label={`${rival.name}・${rival.title}`}
                    >
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
                      <span className="mt-0.5 block line-clamp-2 text-[6px] font-bold leading-tight text-ink/35">
                        {rival.title.split('・')[0]}
                      </span>
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
        {next ? next.text : 'LV99になっても、「放課後と魔法の言葉」は何度でも続けられます。'}
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
