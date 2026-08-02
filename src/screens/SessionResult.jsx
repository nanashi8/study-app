import { useEffect, useRef, useState } from 'react'
import { todayIndex, useStore } from '../store/useStore.js'
import { ProgressRing, ProgressBar, Button, Card } from '../components/ui.jsx'
import { Star, Flame, Refresh, Home, Bookmark, ArrowRight } from '../components/Icons.jsx'
import { battleProgression, enemyLevel } from '../lib/adaptive.js'
import {
  battleQuest,
  battleVerdict,
  capEnemyPositionForHeroLevel,
  encounterFor,
  heroProgress,
  maxEnemyRankIndexForHeroLevel,
  relicStatLabel,
  teacherBattleResultLine,
} from '../lib/rpg.js'
import { HeroPortrait } from '../components/HeroPortrait.jsx'
import { SpeechSettingsButton } from '../components/SpeechSettings.jsx'
import { TeacherPortrait } from '../components/TeacherPortrait.jsx'
import { BattleStandingActor } from '../components/BattleStandingActor.jsx'
import { BattleOpponentStandingActor } from '../components/BattleOpponentStandingActor.jsx'
import { BattleStageBackdrop } from '../components/BattleStageBackdrop.jsx'
import {
  battleStarsEarned,
  newlyUnlockedBattleThemes,
} from '../lib/battleThemes.js'
import {
  battleOpponentForEncounter,
  battleRivalById,
  battleRivalForEncounter,
  battleStudentById,
  battleStudentMotion,
  battleStudentPortrait,
  battleStudentResultAnimation,
  battleStudentResultState,
  battleStandingPoseForPhase,
} from '../lib/battleCast.js'

// セッションの種類から「スキル」を判定する（弱点ナビ用）。
function inferSkill({ engine, replayScreen }) {
  if (engine === 'grammar') return 'grammar'
  if (engine === 'phrase') return 'usage'
  if (engine === 'dictation') return 'dictation'
  if (engine === 'listening') return 'listening'
  if (replayScreen === 'dictationPlay') return 'dictation'
  if (replayScreen === 'listeningQuiz') return 'listening'
  return 'vocab'
}

const PIECES = ['🎉', '✨', '⭐', '🎊', '💫', '🌟']
const BATTLE_RESULT_PANELS = [
  { id: 'outcome', label: '戦果', glyph: '⚔' },
  { id: 'growth', label: '成長', glyph: '✦' },
]

function Confetti() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {Array.from({ length: 18 }).map((_, k) => (
        <span
          key={k}
          className="absolute top-0"
          style={{
            left: `${(k * 53) % 100}%`,
            fontSize: 16 + (k % 4) * 6,
            animation: `confetti-fall ${2.4 + (k % 5) * 0.4}s linear ${(k % 9) * 0.16}s`,
          }}
        >
          {PIECES[k % PIECES.length]}
        </span>
      ))}
    </div>
  )
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setPrefersReducedMotion(media.matches)
    media.addEventListener?.('change', update)
    return () => media.removeEventListener?.('change', update)
  }, [])

  return prefersReducedMotion
}

export function SessionResultScreen() {
  const params = useStore((s) => s.params)
  const navigate = useStore((s) => s.navigate)
  const goHome = useStore((s) => s.goHome)
  const streak = useStore((s) => s.stats.streak)
  const totalXp = useStore((s) => s.stats.xp)
  const battleStars = useStore((s) => s.battleStars)
  const battleStoryStep = useStore((s) => s.battleStoryStep)
  const markBattleStorySeen = useStore((s) => s.markBattleStorySeen)
  const recordTeacherKeyVisual = useStore((s) => s.recordTeacherKeyVisual)
  const battleUiMode = useStore((s) => (
    s.settings.battleUiMode === 'simple' ? 'simple' : 'gaming'
  ))
  const [battleResultPanel, setBattleResultPanel] = useState('outcome')

  const {
    title = '学習',
    mode = 'study',
    total = 0,
    correct = 0,
    wrong = 0,
    xpGained = 0,
    reviewIds = [],
    source,
    engine = 'word',
    battleReport = null,
  } = params
  const acc = total ? correct / total : 0
  const pct = Math.round(acc * 100)

  // この結果をスキル別テスト結果として1回だけ記録する（学習マップの弱点ナビが参照）。
  const recordSkillResult = useStore((s) => s.recordSkillResult)
  const setEngPos = useStore((s) => s.setEngPos)
  const isBattle = source?.type === 'battle'
  const battleStarsGained = isBattle ? battleStarsEarned(correct) : 0
  const newBattleThemes = isBattle
    ? newlyUnlockedBattleThemes(
        Math.max(0, battleStars - battleStarsGained),
        battleStars,
      )
    : []
  const heroBefore = heroProgress(Math.max(0, totalXp - xpGained))
  const heroAfter = heroProgress(totalXp)
  const battleRankCap = maxEnemyRankIndexForHeroLevel(heroAfter.level)
  const leveledUp = heroAfter.level > heroBefore.level
  const newRelics = heroAfter.relics.filter(
    (relic) => relic.level > heroBefore.level,
  )
  const encounter = isBattle
    ? encounterFor({
        level: source?.heroLevel ?? heroBefore.level,
        day: source?.adventureDay ?? 0,
        enemyRankIndex: source?.levelIndex ?? 0,
      })
    : null
  const battleStudent = isBattle ? battleStudentById(source?.studentId) : null
  const battleStudentEmotion = isBattle
    ? battleStudentResultState({ battleState: battleReport, accuracy: acc })
    : null
  const battleResultAnimation = isBattle
    ? battleStudentResultAnimation({
        studentId: battleStudent.id,
        battleState: battleReport,
        accuracy: acc,
      })
    : null
  const battleRival = isBattle
    ? battleOpponentForEncounter(
        encounter,
        battleRivalById(
          source?.rivalId
          ?? battleRivalForEncounter(encounter, source?.adventureDay ?? 0).id,
        ),
      )
    : null
  const quest = isBattle ? battleQuest(source?.questId) : null
  const verdict = isBattle ? battleVerdict(acc) : null
  const battleStart = isBattle
    ? capEnemyPositionForHeroLevel(
        source?.position
          ?? source?.levelIndex
          ?? useStore.getState().engPos
          ?? 0,
        heroAfter.level,
      )
    : 0
  const battle = isBattle
    ? battleProgression(
        { ...source, position: battleStart },
        acc,
        battleRankCap,
      )
    : null
  const battleDay = isBattle ? todayIndex() : null
  const recorded = useRef(false)
  useEffect(() => {
    // 暗記カード（自己採点の study）はテストではないので弱点判定に含めない。
    if (recorded.current || !total || mode === 'study') return
    recorded.current = true
    // 各設問は review() で時刻別分析へ記録済み。ここでは分野別の累計だけ更新する。
    recordSkillResult(inferSkill(params), correct, total, { trackLearning: false })
    // 適応バトルなら成績でポジションを上下させ、敵LVの変化を表示する。
    if (isBattle) {
      // 結果表示と同じ確定値を保存し、「予告だけ昇格」のずれを起こさない。
      setEngPos(battle.to)
      if (encounter.isTeacher && battleReport?.enemyDefeated) {
        recordTeacherKeyVisual({
          teacherId: encounter.id,
          studentId: battleStudent.id,
          themeId: battleReport?.battleTheme?.id ?? source?.themeId,
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const msg = isBattle
    ? {
        emoji: verdict.emoji,
        text: verdict.title,
        color:
          verdict.id === 'legendary'
            ? '#f59e0b'
            : verdict.id === 'victory'
              ? '#10b981'
              : verdict.id === 'draw'
                ? '#6366f1'
                : '#0ea5e9',
      }
    : acc >= 0.9
      ? { emoji: '🏆', text: 'パーフェクト級！', color: '#f59e0b' }
      : acc >= 0.7
        ? { emoji: '🎉', text: 'よくできました！', color: '#10b981' }
        : acc >= 0.4
          ? { emoji: '💪', text: 'いい調子！', color: '#6366f1' }
          : { emoji: '🌱', text: 'ここから伸びる！', color: '#0ea5e9' }

  const isPhrase = engine === 'phrase'
  const isGrammar = engine === 'grammar'
  const isDictation = engine === 'dictation' || params.replayScreen === 'dictationPlay'
  const isListening = engine === 'listening' || params.replayScreen === 'listeningQuiz'
  const isVocabStudy = mode === 'study' && engine === 'word'
  const isMemoryCheck = mode === 'study' && (engine === 'word' || engine === 'phrase')
  const reviewUnit = isGrammar || isDictation || isListening ? '問' : isPhrase ? '項目' : '語'
  const replaySource = isBattle && battle
    ? {
        ...battle.source,
        heroLevel: heroAfter.level,
      }
    : source
  const replay = () => {
    const target =
      params.replayScreen ??
      (isPhrase ? (mode === 'quiz' ? 'phraseQuiz' : 'phraseStudy') : mode === 'quiz' ? 'vocabQuiz' : 'vocabStudy')
    navigate(target, {
      source: replaySource,
      title: isBattle ? `ことばの対決：${battleRival.name}` : title,
      mode,
      engine,
      replayScreen: params.replayScreen,
      size: params.size,
      continueTo: params.continueTo,
    })
  }

  const reviewWrong = () =>
    isListening
      ? navigate('listeningQuiz', {
          source: { type: 'listeningList', ids: reviewIds, levelId: source?.levelId },
          title: `${title}・まちがい復習`,
          mode: 'quiz',
          engine: 'listening',
          replayScreen: 'listeningQuiz',
        })
      : isDictation
      ? navigate('dictationPlay', {
          source: { type: 'dictationList', ids: reviewIds, levelId: source?.levelId },
          title: `${title}・まちがい復習`,
          mode: 'quiz',
          engine: 'dictation',
          replayScreen: 'dictationPlay',
        })
      : isGrammar
      ? navigate('grammarQuiz', {
          source: { type: 'grammarList', ids: reviewIds },
          title: isMemoryCheck ? 'もう一度確認' : 'まちがい復習',
          mode: 'quiz',
          engine: 'grammar',
          replayScreen: 'grammarQuiz',
        })
      : isPhrase
      ? navigate('phraseStudy', {
          source:
            source?.type === 'customPhrase'
              ? {
                  type: 'customPhrase',
                  items: (source.items ?? []).filter((item) => reviewIds.includes(item.id)),
                }
              : { type: 'phraseList', kind: source?.kind, ids: reviewIds },
          title: isMemoryCheck ? 'もう一度確認' : 'まちがい復習',
          mode: 'study',
          engine: 'phrase',
          size: reviewIds.length,
          continueTo: params.continueTo,
        })
      : navigate('vocabStudy', {
          source: { type: 'mylist', ids: reviewIds },
          title: 'まちがい復習',
          mode: 'study',
          size: reviewIds.length,
          continueTo: params.continueTo,
        })

  const continueAfterBattle = () => {
    markBattleStorySeen(battleDay)
    navigate('afterSchoolInterlude', {
      fromBattle: true,
      rivalName: battleRival.name,
      verdictId: verdict.id,
      storyStep: battleStoryStep,
      isTeacher: encounter.isTeacher,
      teacherDefeated: encounter.isTeacher && battleReport?.enemyDefeated === true,
      teacherBattleLine: teacherBattleResultLine(encounter, battleReport),
    })
  }

  const moveBattleResultTab = (event, panelIndex) => {
    let nextIndex = panelIndex
    if (event.key === 'ArrowRight') nextIndex = (panelIndex + 1) % BATTLE_RESULT_PANELS.length
    else if (event.key === 'ArrowLeft') nextIndex = (panelIndex - 1 + BATTLE_RESULT_PANELS.length) % BATTLE_RESULT_PANELS.length
    else if (event.key === 'Home') nextIndex = 0
    else if (event.key === 'End') nextIndex = BATTLE_RESULT_PANELS.length - 1
    else return

    event.preventDefault()
    const nextPanel = BATTLE_RESULT_PANELS[nextIndex]
    setBattleResultPanel(nextPanel.id)
    event.currentTarget.parentElement
      ?.querySelector(`[data-battle-result-tab="${nextPanel.id}"]`)
      ?.focus()
  }

  return (
    <div
      className={isBattle
        ? 'battle-result-screen relative min-h-full overflow-x-hidden px-2 pb-8 pt-2 text-center'
        : 'relative flex min-h-full flex-col items-center gap-5 overflow-x-hidden px-6 pb-8 pt-8 text-center'}
      data-battle-theme={battleReport?.battleTheme?.id}
      data-battle-ui-mode={isBattle ? battleUiMode : undefined}
    >
      {(pct >= 80 || leveledUp) && (!isBattle || battleUiMode === 'gaming') && <Confetti />}
      <div className="absolute right-3 top-[calc(env(safe-area-inset-top)+0.75rem)] z-20">
        <SpeechSettingsButton compact />
      </div>
      {isBattle ? (
        <section
          className="battle-result-console-shell mx-auto w-full max-w-sm"
          data-testid="battle-result-console"
          data-battle-ui-mode={battleUiMode}
          aria-label="バトル結果コンソール"
        >
          <div className="battle-result-console-display">
            <header className="battle-result-console-header">
              <span className="battle-result-console-lights" aria-hidden="true">
                <i /><i /><i />
              </span>
              <span className="min-w-0 text-left">
                <small>AFTER SCHOOL BATTLE</small>
                <strong>戦果レポート</strong>
              </span>
              <em>{battleUiMode === 'gaming' ? 'GAMING UI' : '簡易UI'}</em>
            </header>

            <BattleResultStage
              battleReport={battleReport}
              student={battleStudent}
              rival={battleRival}
              emotion={battleStudentEmotion}
              verdict={verdict}
              encounter={encounter}
              quest={quest}
              animation={battleResultAnimation}
              uiMode={battleUiMode}
            />

            <BattleResultHud
              accuracy={acc}
              percent={pct}
              correct={correct}
              total={total}
              xpGained={xpGained}
              battleStarsGained={battleStarsGained}
              streak={streak}
              color={msg.color}
            />

            <div
              className="battle-result-tablist"
              role="tablist"
              aria-label="戦果の詳細"
            >
              {BATTLE_RESULT_PANELS.map((panel, panelIndex) => {
                const active = battleResultPanel === panel.id
                return (
                  <button
                    key={panel.id}
                    type="button"
                    role="tab"
                    id={`battle-result-tab-${panel.id}`}
                    aria-controls={`battle-result-panel-${panel.id}`}
                    aria-selected={active}
                    tabIndex={active ? 0 : -1}
                    data-battle-result-tab={panel.id}
                    onClick={() => setBattleResultPanel(panel.id)}
                    onKeyDown={(event) => moveBattleResultTab(event, panelIndex)}
                  >
                    <span aria-hidden="true">{panel.glyph}</span>
                    {panel.label}
                  </button>
                )
              })}
            </div>

            <div
              id={`battle-result-panel-${battleResultPanel}`}
              className="battle-result-panel"
              role="tabpanel"
              aria-labelledby={`battle-result-tab-${battleResultPanel}`}
              data-battle-result-panel={battleResultPanel}
            >
              {battleResultPanel === 'outcome' && (
                <div className="battle-result-panel-stack">
                  <BattleOutcome
                    battle={battle}
                    encounter={encounter}
                    verdict={verdict}
                    battleReport={battleReport}
                    battleRival={battleRival}
                  />
                  {encounter.isTeacher && battleReport?.enemyDefeated && (
                    <Card className="battle-result-key-visual-card w-full border border-amber-200 bg-amber-50 p-3 text-left">
                      <p className="text-[9px] font-extrabold tracking-[0.14em] text-amber-700">KEY VISUAL SAVED</p>
                      <p className="mt-1 text-xs font-extrabold text-ink">📖 {encounter.name}の影蝕解除をアルバムへ保存</p>
                      <p className="mt-1 text-[9px] font-bold leading-relaxed text-ink/45">戦った仲間と舞台も含めて、物語画面の思い出アルバムから振り返れます。</p>
                    </Card>
                  )}
                </div>
              )}

              {battleResultPanel === 'growth' && (
                <div className="battle-result-panel-stack">
                  <HeroLevelCard
                    before={heroBefore}
                    after={heroAfter}
                    xpGained={xpGained}
                    newRelics={newRelics}
                    battleStudent={battleStudent}
                    studentEmotion={battleStudentEmotion}
                  />
                  <BattleStarsCard
                    total={battleStars}
                    gained={battleStarsGained}
                    newThemes={newBattleThemes}
                  />
                </div>
              )}

            </div>
          </div>

          <div className="battle-result-console-actions">
            <Button full size="lg" onClick={continueAfterBattle}>
              戦いの結末を見る <ArrowRight size={18} />
            </Button>
            {params.continueTo?.screen && (
              <Button
                full
                onClick={() => navigate(params.continueTo.screen, params.continueTo.params ?? {})}
              >
                {params.continueTo.label ?? '次へ'} <ArrowRight size={18} />
              </Button>
            )}
            {wrong > 0 && (
              <Button full variant="secondary" onClick={reviewWrong}>
                <Bookmark size={18} /> まちがい {wrong}{reviewUnit}を復習
              </Button>
            )}
            <Button full variant="ghost" onClick={goHome}>
              <Home size={18} /> ホームへ
            </Button>
          </div>
        </section>
      ) : (
        <>
          <div className="text-6xl animate-float">{msg.emoji}</div>
          <h1 className="font-display text-2xl font-extrabold text-ink">{msg.text}</h1>
          <p className="-mt-3 text-sm font-bold text-ink/45">
            {title}・{mode === 'quiz' ? 'クイズ' : '暗記'}
          </p>
          <ProgressRing value={acc} size={150} stroke={14} color={msg.color}>
            <span className="font-display text-4xl font-extrabold text-ink">{pct}%</span>
            <span className="text-xs font-bold text-ink/45">
              {correct}/{total} 正解
            </span>
          </ProgressRing>

          <div className="flex w-full max-w-xs gap-3">
            <Card className="flex flex-1 flex-col items-center gap-1 p-3">
              <span className="text-hint"><Star size={22} /></span>
              <span className="font-display text-xl font-extrabold text-ink">+{xpGained}</span>
              <span className="text-[11px] font-bold text-ink/45">獲得XP</span>
            </Card>
            <Card className="flex flex-1 flex-col items-center gap-1 p-3">
              <span className="text-rose-500"><Flame size={22} /></span>
              <span className="font-display text-xl font-extrabold text-ink">{streak}</span>
              <span className="text-[11px] font-bold text-ink/45">連続日数</span>
            </Card>
          </div>

          <HeroLevelCard
            before={heroBefore}
            after={heroAfter}
            xpGained={xpGained}
            newRelics={newRelics}
          />

          <div className="mt-2 w-full max-w-xs space-y-2.5">
            {params.continueTo?.screen && (
              <Button
                full
                onClick={() => navigate(params.continueTo.screen, params.continueTo.params ?? {})}
              >
                {params.continueTo.label ?? '次へ'} <ArrowRight size={18} />
              </Button>
            )}
            {wrong > 0 && (
              <Button full variant="primary" onClick={reviewWrong}>
                {isMemoryCheck ? (
                  <><Refresh size={18} /> 「まだ」の{wrong}{reviewUnit}をもう一度確認する</>
                ) : (
                  <><Bookmark size={18} /> まちがい {wrong}{reviewUnit}を復習</>
                )}
              </Button>
            )}
            <Button full variant="secondary" onClick={replay}>
              {isVocabStudy ? <ArrowRight size={18} /> : <Refresh size={18} />}
              {isVocabStudy ? '次に進む' : 'もう一度'}
            </Button>
            <Button full variant="ghost" onClick={goHome}>
              <Home size={18} /> ホームへ
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

function BattleResultHud({
  accuracy,
  percent,
  correct,
  total,
  xpGained,
  battleStarsGained,
  streak,
  color,
}) {
  return (
    <section
      className="battle-result-hud"
      data-testid="battle-result-hud"
      aria-label={`正答率${percent}パーセント、${correct}問正解、獲得XP${xpGained}、獲得スター${battleStarsGained}、連続${streak}日`}
    >
      <div className="battle-result-score">
        <ProgressRing
          value={accuracy}
          size={76}
          stroke={8}
          color={color}
          track="rgb(148 163 184 / 0.24)"
        >
          <strong>{percent}%</strong>
          <small>正答率</small>
        </ProgressRing>
        <span>{correct}/{total} 正解</span>
      </div>
      <div className="battle-result-hud-metrics">
        <div>
          <Star size={18} aria-hidden="true" />
          <span><b>+{xpGained}</b><small>獲得XP</small></span>
        </div>
        <div>
          <span className="battle-result-star" aria-hidden="true">✦</span>
          <span><b>+{battleStarsGained}</b><small>スター</small></span>
        </div>
        <div>
          <Flame size={18} aria-hidden="true" />
          <span><b>{streak}日</b><small>連続記録</small></span>
        </div>
      </div>
    </section>
  )
}

function BattleStarsCard({ total, gained, newThemes }) {
  return (
    <Card className="w-full max-w-xs overflow-hidden bg-gradient-to-br from-violet-50 via-pink-50 to-cyan-50 p-3.5 text-left ring-1 ring-violet-100">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-violet-600 text-2xl text-white shadow-lg shadow-violet-200">
          ✦
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="font-display text-sm font-extrabold text-violet-950">
              放課後スター
            </span>
            <span className="rounded-full bg-white px-2 py-1 text-[10px] font-extrabold text-violet-700">
              +{gained}
            </span>
          </div>
          <p className="mt-0.5 text-[11px] font-bold text-violet-900/55">
            合計 {total.toLocaleString()}・バトル演出の解放に使用
          </p>
        </div>
      </div>

      {newThemes.map((theme) => (
        <div key={theme.id} className="mt-3 flex items-center gap-2 rounded-2xl bg-white/85 p-2">
          <img
            src={theme.preview}
            alt=""
            className="h-12 w-10 rounded-lg object-cover object-top [image-rendering:pixelated]"
          />
          <div className="min-w-0">
            <p className="text-[9px] font-extrabold tracking-[0.14em] text-amber-600">
              NEW BATTLE STYLE
            </p>
            <p className="truncate text-xs font-extrabold text-ink">
              {theme.emoji} {theme.name} を解放！
            </p>
          </div>
        </div>
      ))}
    </Card>
  )
}

function BattleResultStudentPortrait({
  student,
  emotion,
  level = null,
  placement,
  prominent = false,
  motionEmotion = null,
  prefersReducedMotion = false,
}) {
  const [motionFailed, setMotionFailed] = useState(false)
  const label = `${student.name}の戦闘後の表情${level ? `、生徒レベル${level}` : ''}`
  const portraitSrc = battleStudentPortrait(student.id, emotion)
  const motionSrc = motionEmotion
    ? battleStudentMotion(student.id, motionEmotion)
    : null
  const showMotion = motionSrc && !prefersReducedMotion && !motionFailed

  useEffect(() => {
    setMotionFailed(false)
  }, [motionSrc])

  return (
    <div
      role="img"
      aria-label={label}
      data-testid={`battle-result-${placement}-student`}
      data-student-id={student.id}
      data-result-motion={showMotion ? motionEmotion : 'still'}
      className={`battle-result-student-portrait relative grid shrink-0 place-items-center ${
        prominent ? 'h-20 w-20 animate-float' : 'h-12 w-12'
      }`}
    >
      <span
        className="battle-result-student-media h-full w-full"
        style={{
          borderColor: student.accent,
          boxShadow: `0 8px 22px ${student.accent}44`,
        }}
        aria-hidden="true"
      >
        {showMotion ? (
          <video
            key={motionSrc}
            src={motionSrc}
            poster={portraitSrc}
            className="battle-result-motion-video"
            autoPlay
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            onError={() => setMotionFailed(true)}
          />
        ) : (
          <img src={portraitSrc} alt="" />
        )}
      </span>
      {level && (
        <span
          aria-hidden="true"
          className="absolute -bottom-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full border border-white bg-slate-950 px-1 text-[9px] font-black leading-none text-amber-200"
        >
          {level}
        </span>
      )}
    </div>
  )
}

function BattleResultEffects({ animation }) {
  return (
    <span
      className="battle-result-effect-field"
      data-result-effect={animation.style}
      data-result-phase={animation.phase}
      aria-hidden="true"
    >
      <i className="battle-result-effect-halo" />
      {Array.from({ length: 8 }, (_, index) => (
        <i
          key={`${animation.id}-glyph-${index}`}
          className="battle-result-effect-glyph"
          style={{
            '--result-effect-index': index,
            '--result-effect-delay': `${index * 0.07}s`,
            '--result-effect-x': `${8 + ((index * 29) % 84)}px`,
            '--result-effect-y': `${8 + ((index * 37) % 116)}px`,
          }}
        >
          {animation.glyphs[index % animation.glyphs.length]}
        </i>
      ))}
      {animation.style === 'cool' && Array.from({ length: 3 }, (_, index) => (
        <i
          key={`${animation.id}-slash-${index}`}
          className="battle-result-effect-slash"
          style={{
            '--result-effect-y': `${42 + index * 29}px`,
            '--result-effect-delay': `${0.16 + index * 0.1}s`,
          }}
        />
      ))}
    </span>
  )
}

function BattleResultStage({
  battleReport,
  student,
  rival,
  emotion,
  verdict,
  encounter,
  quest,
  animation,
  uiMode = 'gaming',
}) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const motionDisabled = prefersReducedMotion || uiMode === 'simple'
  const [animationKey, setAnimationKey] = useState(0)
  const theme = battleReport?.battleTheme
  const outcome = battleReport?.enemyDefeated
    ? 'victory'
    : battleReport?.heroDefeated
      ? 'defeat'
      : verdict.id
  const scene = theme?.stage
    ? `linear-gradient(180deg,rgba(2,6,23,.16),rgba(2,6,23,.82)), url("${theme.stage}") center / cover`
    : 'linear-gradient(135deg,#312e81,#0f172a 68%,#164e63)'
  const standingPhase = outcome === 'victory' || outcome === 'legendary'
    ? 'victory'
    : outcome === 'defeat'
      ? 'defeat'
      : animation.phase === 'recovery'
        ? 'healing'
        : 'hero-action'
  const standingPose = battleStandingPoseForPhase(
    standingPhase,
    animation.phase === 'recovery' ? 'item-heal' : null,
  )
  const standingMotion = battleStudentMotion(student.id, animation.motionEmotion)
  const standingPoster = battleStudentPortrait(student.id, emotion)

  return (
    <section
      className="battle-result-stage w-full max-w-xs"
      data-testid="battle-result-stage"
      data-battle-theme={theme?.id ?? 'fallback'}
      data-battle-outcome={outcome}
      data-battle-result-style={animation.style}
      data-battle-result-phase={animation.phase}
      data-battle-ui-mode={uiMode}
      style={{
        '--battle-result-scene': scene,
        '--battle-result-accent': theme?.accent ?? '#a78bfa',
        '--battle-result-enemy': theme?.enemy ?? '#fb7185',
        '--battle-result-student': student.accent,
      }}
      aria-label={`${student.name}と${rival.name}の対決結果。${verdict.title}`}
    >
      <span className="battle-result-cinema-frame" aria-hidden="true" />
      <div className="battle-result-stage-heading">
        <span aria-hidden="true">{theme?.presentation?.modeLabel ?? 'SCHOOL DUEL'}</span>
        <span className="battle-result-stage-heading-actions">
          <strong aria-hidden="true">BATTLE RESULT</strong>
          {!motionDisabled && (
            <button
              type="button"
              className="battle-result-replay"
              onClick={() => setAnimationKey((key) => key + 1)}
              aria-label="バトル結果の演出をもう一度見る"
            >
              <span aria-hidden="true">↻</span>
              <span className="battle-result-replay-label">もう一度</span>
            </button>
          )}
        </span>
      </div>
      <div key={animationKey} className="battle-result-animation-sequence">
        <BattleStageBackdrop
          scene="var(--battle-result-scene)"
          phase={standingPhase}
        />
        {!motionDisabled && <BattleResultEffects animation={animation} />}
        <div className="battle-result-duelists">
          <div className="battle-result-duelist battle-result-duelist-hero">
            <div
              className="battle-result-standing-student"
              data-testid="battle-result-lead-student"
              data-student-id={student.id}
              data-result-motion={motionDisabled ? 'still' : animation.motionEmotion}
            >
              <BattleStandingActor
                student={student}
                pose={standingPose}
                phase={standingPhase}
                motionSrc={standingMotion}
                motionActive={!motionDisabled}
                posterSrc={standingPoster}
                defeated={outcome === 'defeat'}
                label={`${student.name}・${standingPose}・${animation.label}`}
                fallback={(
                  <BattleResultStudentPortrait
                    student={student}
                    emotion={emotion}
                    placement="lead-fallback"
                    prominent
                    motionEmotion={animation.motionEmotion}
                    prefersReducedMotion={motionDisabled}
                  />
                )}
              />
            </div>
            <b>{student.name}</b>
          </div>

          <div className="battle-result-verdict">
            <span aria-hidden="true">{verdict.emoji}</span>
            <h1>{verdict.title}</h1>
            <small data-result-animation-label={animation.id}>
              {animation.label}
            </small>
          </div>

          <div className="battle-result-duelist battle-result-duelist-enemy">
            <BattleOpponentStandingActor
              opponent={rival}
              phase={battleReport?.enemyDefeated ? 'defeat' : 'result'}
              defeated={battleReport?.enemyDefeated}
              className="battle-result-standing-opponent"
              label={`${rival.name}・戦闘結果`}
              fallback={rival.isTeacher ? (
                <TeacherPortrait
                  teacher={encounter}
                  defeated={battleReport?.enemyDefeated}
                />
              ) : (
                <img
                  src={rival.portrait}
                  alt={`${rival.name}の戦闘後の表情`}
                  className={battleReport?.enemyDefeated ? 'grayscale' : ''}
                />
              )}
            />
            <b>{rival.name}</b>
          </div>
        </div>
      </div>
      <p className="battle-result-stage-route">
        <span>{encounter.emoji} {encounter.name}</span>
        <i aria-hidden="true">◆</i>
        <span>{quest.label}</span>
      </p>
    </section>
  )
}

function HeroLevelCard({
  before,
  after,
  xpGained,
  newRelics,
  battleStudent,
  studentEmotion,
}) {
  const leveledUp = after.level > before.level
  return (
    <Card
      className={`w-full max-w-xs overflow-hidden p-3.5 ${
        leveledUp
          ? 'bg-gradient-to-br from-amber-50 to-violet-50 ring-2 ring-amber-300'
          : ''
      }`}
    >
      <div className="flex items-center gap-3">
        {battleStudent ? (
          <BattleResultStudentPortrait
            student={battleStudent}
            emotion={studentEmotion}
            level={after.level}
            placement="level"
          />
        ) : (
          <HeroPortrait
            level={after.level}
            title={after.title}
            className="h-12 w-12"
          />
        )}
        <div className="min-w-0 flex-1 text-left">
          <div className="flex items-center justify-between gap-2">
            <span className="font-display font-extrabold text-ink">
              {leveledUp
                ? `LEVEL UP! ${before.level} → ${after.level}`
                : `生徒 LV${after.level}`}
            </span>
            <span className="text-[10px] font-extrabold text-brand-500">
              +{xpGained} XP
            </span>
          </div>
          <p className="truncate text-[11px] font-bold text-ink/50">
            {after.title.name}
          </p>
          <ProgressBar
            value={after.progress}
            color={
              leveledUp
                ? 'linear-gradient(90deg,#fbbf24,#8b5cf6)'
                : '#6366f1'
            }
            className="mt-1.5 h-2"
          />
          <div className="mt-1 flex justify-between text-[9px] font-bold text-ink/40">
            <span>{after.totalXp.toLocaleString()} XP</span>
            <span>
              {after.isMax ? 'MAX LEVEL' : `次まで ${after.xpToNext} XP`}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-1.5">
        {[
          ['HP', before.battleStats.maxHp, after.battleStats.maxHp],
          ['ATK', before.battleStats.attack, after.battleStats.attack],
          ['DEF', before.battleStats.defense, after.battleStats.defense],
        ].map(([label, oldValue, value]) => (
          <div
            key={label}
            className="rounded-xl bg-white/75 px-1.5 py-2 text-center"
          >
            <p className="text-[8px] font-extrabold tracking-wider text-ink/40">
              {label}
            </p>
            <p className="font-display text-sm font-extrabold text-ink">
              {leveledUp && oldValue !== value ? (
                <>
                  <span className="text-[9px] text-ink/35">{oldValue} → </span>
                  <span className="text-emerald-600">{value}</span>
                </>
              ) : value}
            </p>
          </div>
        ))}
      </div>

      {newRelics.length > 0 && (
        <div className="mt-3 rounded-2xl bg-white/80 p-2.5 text-left">
          <p className="text-[9px] font-extrabold tracking-[0.15em] text-amber-600">
            NEW TREASURE
          </p>
          {newRelics.map((relic) => (
            <p key={relic.level} className="mt-0.5 text-xs font-extrabold text-ink">
              {relic.emoji} {relic.name}
              <span className="ml-1 font-bold text-ink/40">
                を獲得！ {relicStatLabel(relic)}
              </span>
            </p>
          ))}
        </div>
      )}
    </Card>
  )
}

// バトルの物語上の決着と、次回の適応敵ランクをまとめて示す。
const TREND = {
  up: { text: '次は相手ランクアップ', tone: 'text-emerald-700', bg: 'bg-correct-soft' },
  down: { text: '次は相手ランクを調整', tone: 'text-amber-800', bg: 'bg-hint-soft' },
  advance: { text: '昇格ポイント獲得', tone: 'text-emerald-700', bg: 'bg-correct-soft' },
  ease: { text: '同じ級で難易度を調整', tone: 'text-amber-800', bg: 'bg-hint-soft' },
  flat: { text: '次も同じ相手ランク', tone: 'text-brand-700', bg: 'bg-brand-100' },
}
function BattleOutcome({
  battle,
  encounter,
  verdict,
  battleReport,
  battleRival,
}) {
  const teacherResultLine = teacherBattleResultLine(encounter, battleReport)
  const t = TREND[battle.trend] ?? TREND.flat
  const from = enemyLevel(battle.from)
  const to = enemyLevel(battle.to)
  const moved = from.id !== to.id
  const pointChange = Math.round(Math.abs(battle.to - battle.from) * 100)
  const nextBattleText = moved
    ? battle.trend === 'up'
      ? `次は英検${to.label}へランクアップ`
      : `次は英検${to.label}へ調整`
    : battle.trend === 'advance'
      ? `次も英検${to.label}。昇格ポイント +${pointChange}`
      : battle.trend === 'ease'
        ? `次も英検${to.label}。難易度を${pointChange}ポイント調整`
        : `次も英検${to.label}。ランク変化なし`
  return (
    <Card className={`w-full max-w-xs p-3.5 ${t.bg}`}>
      <div className="flex items-start gap-3 text-left">
        {battleRival.isTeacher ? (
          <TeacherPortrait
            teacher={encounter}
            defeated={battleReport?.enemyDefeated}
            className="h-11 w-11 shrink-0 rounded-2xl ring-1 ring-white/70"
          />
        ) : (
          <img
            src={battleRival.portrait}
            alt={`${battleRival.name}のポートレート`}
            className={`h-11 w-11 shrink-0 rounded-2xl object-cover ring-1 ring-white/70 [image-rendering:pixelated] ${battleReport?.enemyDefeated ? 'grayscale' : ''}`}
          />
        )}
        <div>
          <div className={`font-display text-sm font-extrabold ${t.tone}`}>
            {verdict.title}
          </div>
          <p className="mt-0.5 text-[11px] font-bold leading-relaxed text-ink/55">
            {verdict.text}
          </p>
        </div>
      </div>
      {teacherResultLine && (
        <blockquote
          className="mt-2 rounded-xl border border-violet-200/80 bg-slate-950/90 px-3 py-2 text-left text-white"
          data-testid="teacher-battle-result-line"
        >
          <span className="block text-[9px] font-extrabold tracking-[0.12em] text-violet-200">
            {battleReport?.enemyDefeated
              ? `${encounter.name} · 悪いマナがほどける直前`
              : `${encounter.name} · 悪いマナに支配されている`}
          </span>
          <p className="mt-1 text-[11px] font-extrabold leading-relaxed">
            「{teacherResultLine}」
          </p>
        </blockquote>
      )}
      <div className="mt-3 flex items-center justify-center gap-2 rounded-2xl bg-white/55 p-2 text-ink">
        <span className="rounded-xl px-2.5 py-1 text-xs font-extrabold" style={{ backgroundColor: `${from.color}22`, color: from.color }}>
          英検{from.label}
        </span>
        <span className="font-extrabold text-ink/40">→</span>
        <span className="rounded-xl px-2.5 py-1 text-xs font-extrabold" style={{ backgroundColor: `${to.color}22`, color: to.color }}>
          英検{to.label}
        </span>
      </div>
      <p className="mt-1.5 text-center text-[11px] font-bold text-ink/50">
        {nextBattleText}
      </p>
      {battleReport && (
        <div className="mt-3 space-y-2">
          {battleReport.itemRelic && (
            <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-left text-amber-950">
              <span className="text-xl">{battleReport.itemRelic.emoji}</span>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-extrabold tracking-[0.14em] text-amber-600">
                  {battleReport.itemUsed ? 'ITEM USED' : 'ITEM CARRIED'}
                </p>
                <p className="truncate text-xs font-extrabold">
                  {battleReport.itemRelic.name}
                </p>
              </div>
              <p className="text-right text-[9px] font-extrabold text-amber-700">
                {battleReport.itemSummary}
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
