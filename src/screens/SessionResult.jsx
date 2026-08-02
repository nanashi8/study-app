import { useEffect, useRef, useState } from 'react'
import { todayIndex, useStore } from '../store/useStore.js'
import { ProgressRing, ProgressBar, Button, Card } from '../components/ui.jsx'
import { Star, Flame, Refresh, Home, Bookmark, ArrowRight } from '../components/Icons.jsx'
import { battleProgression } from '../lib/adaptive.js'
import {
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
import { battleStarsEarned } from '../lib/battleThemes.js'
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
  const battleStoryStep = useStore((s) => s.battleStoryStep)
  const markBattleStorySeen = useStore((s) => s.markBattleStorySeen)
  const recordTeacherKeyVisual = useStore((s) => s.recordTeacherKeyVisual)
  const battleUiMode = useStore((s) => (
    s.settings.battleUiMode === 'simple' ? 'simple' : 'gaming'
  ))
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
              <strong>戦果</strong>
              <small>RESULT</small>
            </header>

            <BattleResultStage
              battleReport={battleReport}
              student={battleStudent}
              rival={battleRival}
              emotion={battleStudentEmotion}
              verdict={verdict}
              encounter={encounter}
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
              beforeLevel={heroBefore.level}
              level={heroAfter.level}
              leveledUp={leveledUp}
            />

            {battleReport?.itemRelic && (
              <p className="battle-result-item-note">
                <span>{battleReport.itemRelic.emoji} {battleReport.itemRelic.name}</span>
                <b>{battleReport.itemUsed ? battleReport.itemSummary : '持ち込み'}</b>
              </p>
            )}
            {encounter.isTeacher && battleReport?.enemyDefeated && (
              <p className="battle-result-saved-note">📖 結末をアルバムに記録しました</p>
            )}
          </div>

          <div className="battle-result-console-actions">
            <Button full onClick={continueAfterBattle}>
              次へ：戦いの結末 <ArrowRight size={18} />
            </Button>
            <div className="battle-result-secondary-actions">
              {wrong > 0 && (
                <Button full size="sm" variant="secondary" onClick={reviewWrong}>
                  <Bookmark size={16} /> 復習 {wrong}{reviewUnit}
                </Button>
              )}
              <Button full size="sm" variant="ghost" onClick={goHome}>
                <Home size={16} /> ホーム
              </Button>
            </div>
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
  percent,
  correct,
  total,
  xpGained,
  battleStarsGained,
  beforeLevel,
  level,
  leveledUp,
}) {
  return (
    <section
      className="battle-result-hud"
      data-testid="battle-result-hud"
      aria-label={`正答率${percent}パーセント、${correct}問正解、獲得XP${xpGained}、獲得スター${battleStarsGained}、レベル${level}`}
    >
      <div><b>{percent}%</b><small>{correct}/{total} 正解</small></div>
      <div><b>+{xpGained}</b><small>XP</small></div>
      <div><b>+{battleStarsGained}</b><small>スター</small></div>
      <div><b>LV {level}</b><small>{leveledUp ? `${beforeLevel} → ${level}` : '現在'}</small></div>
    </section>
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
  animation,
  uiMode = 'gaming',
}) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const motionDisabled = prefersReducedMotion || uiMode === 'simple'
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
      <div className="battle-result-animation-sequence">
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
