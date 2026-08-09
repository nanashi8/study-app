import { BattleStandingActor } from './BattleStandingActor.jsx'
import {
  battleRivalById,
  battleStudentById,
  battleStudentPortrait,
} from '../lib/battleCast.js'
import { battleStageById } from '../lib/battleThemes.js'
import {
  dragonVeinExpression,
  dragonVeinNodeById,
} from '../lib/dragonVein.js'
import { cx } from './ui.jsx'

const FEELING_LABELS = {
  thinking: '思考中',
  focused: '手掛かりに集中',
  worried: '焦りを抑えて再考',
  hurt: '苦悶しながら立て直し',
  relieved: '記憶の断片を復元',
  confident: '解読の要領をつかんだ',
  delighted: 'とびきりの笑顔',
}

const LEVEL_LABELS = {
  5: '5級',
  4: '4級',
  3: '3級',
  pre2: '準2級',
  2: '2級',
  pre1: '準1級',
  1: '1級',
}

export function DragonVeinCipherStage({
  source,
  studentId = 'mio',
  answered = false,
  lastAnswer = null,
  streak = 0,
  wrongStreak = 0,
  current = 1,
  total = 10,
  className,
}) {
  const node = dragonVeinNodeById(source?.locationId)
  const student = battleStudentById(source?.studentId ?? studentId)
  const guide = battleRivalById(source?.guideId ?? node.guideId)
  const stage = battleStageById(source?.stageId ?? node.stageId)
  const guideName = source?.guideName
    ?? `${guide.name}${guide.name.endsWith('校長') ? '' : '先生'}`
  const guideRole = source?.guideRole
    ?? guide.legacyTitle?.split('・')[0]
    ?? '龍脈調査協力者'
  const placeName = source?.isDaily
    ? source?.distortionPlace ?? stage.name
    : node.name
  const headline = source?.isDaily
    ? source?.distortionTitle ?? '日常の龍脈解読'
    : `${node.name}の龍脈解読`
  const levelLabel = LEVEL_LABELS[source?.levelId] ?? node.levelLabel
  const expression = dragonVeinExpression({
    answered,
    lastAnswer,
    streak,
    wrongStreak,
  })
  const studentSrc = battleStudentPortrait(student.id, expression)
  const progress = total > 0 ? Math.max(0, Math.min(1, (current - 1) / total)) : 0
  const guideMessage = lastAnswer === 'correct'
    ? 'その語が周囲の文脈とつながりました。次の断片も追いましょう。'
    : answered
      ? '誤りも記録です。残った違和感と例文を手掛かりにしましょう。'
      : source?.distortionSummary ?? node.clue

  return (
    <section
      className={cx('dragon-vein-cipher-stage', className)}
      data-testid="dragon-vein-cipher-stage"
      data-expression={expression}
      data-last-answer={lastAnswer ?? 'none'}
      aria-label={`${placeName}で${guideName}と協力し、${student.name}が龍脈の暗号を解読中。${FEELING_LABELS[expression] ?? '思考中'}`}
      style={{
        '--dragon-accent': node.accent,
        '--dragon-stage': `url("${stage.image}")`,
        '--dragon-progress': `${progress * 100}%`,
      }}
    >
      <div className="dragon-vein-stage-scene" aria-hidden="true">
        <div className="dragon-vein-stage-vignette" />
        <div className="dragon-vein-student-layer">
          <BattleStandingActor
            student={student}
            pose="wind"
            phase="ready"
            label={`${student.name}・${FEELING_LABELS[expression] ?? expression}`}
            fallback={<img src={studentSrc} alt="" />}
          />
          <img className="dragon-vein-expression-inset" src={studentSrc} alt="" />
        </div>
        <div className="dragon-vein-manuscript-layer">
          <span className="dragon-vein-manuscript-mark">英語記憶断片</span>
          <span className="dragon-vein-manuscript-lines" />
          <b>{current}/{total}</b>
        </div>
        <div className="dragon-vein-guide-layer">
          <img src={guide.standing} alt="" />
        </div>
      </div>

      <div className="dragon-vein-stage-meta">
        <div className="dragon-vein-stage-title">
          <span>{source?.isDaily ? '🧩' : node.emoji}</span>
          <p><small>{levelLabel}・{stage.name}</small><b>{headline}</b></p>
        </div>
        <span className="dragon-vein-feeling">{FEELING_LABELS[expression] ?? '思考中'}</span>
      </div>
      <div className="dragon-vein-guide-note">
        <strong>{guideName}</strong>
        <span>{guideRole}</span>
        <p>{guideMessage}</p>
      </div>
      <div className="dragon-vein-stage-progress" aria-hidden="true"><i /></div>
    </section>
  )
}
