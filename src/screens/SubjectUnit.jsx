import { useStore } from '../store/useStore.js'
import {
  PRACTICE_KINDS,
  PRACTICE_LEVELS,
  PRACTICE_LEVEL_IDS,
  SUBJECTS,
  bookMeta,
  getSubjectUnit,
} from '../data/subjects/index.js'
import {
  SUBJECT_PRACTICE_RESULTS,
  latestSubjectPractice,
  subjectPracticeCounts,
} from '../lib/subjectPractice.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { SubjectFigure } from '../components/SubjectFigure.jsx'
import { SubjectText } from '../components/SubjectText.jsx'
import { WordBookButton } from '../components/WordListSheet.jsx'
import { Button, Card, Chip } from '../components/ui.jsx'
import { ArrowRight, BookOpen, Cards, Target } from '../components/Icons.jsx'

// 単元のページ。めあて → 要点（図つき）→ 重要語句（暗記・語句テスト）→ 演習（基礎・標準・入試）の順に読む。
// 演習の問題は段階ごとに並べ、前回の結果を添える。1問を選んで解くこともできる。

const RESULT_ROWS = Object.freeze([
  ...Object.entries(SUBJECT_PRACTICE_RESULTS),
  ['unanswered', { label: 'まだ', short: 'まだ', color: '#5f5b78' }],
])

function SubjectUnitScreen({ subject }) {
  const meta = SUBJECTS[subject]
  const params = useStore((state) => state.params)
  const navigate = useStore((state) => state.navigate)
  const practiceLog = useStore((state) => state[meta.practiceLogField])
  const unit = getSubjectUnit(params.unitId)

  if (!unit || unit.subject !== subject) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">{meta.emoji}</div>
        <p className="font-display text-lg font-extrabold text-ink">この単元はありません</p>
      </div>
    )
  }

  const book = bookMeta(subject, unit.book)
  const returnTo = { screen: meta.screens.unit, params: { unitId: unit.id } }
  const questionIds = unit.questions.map((question) => question.id)
  const counts = subjectPracticeCounts(practiceLog, questionIds)
  const study = () => navigate(meta.screens.study, {
    ids: unit.terms.map((term) => term.id),
    title: `${unit.title}の重要語句`,
    preserveOrder: true,
    returnTo,
  })
  const quiz = () => navigate(meta.screens.quiz, {
    ids: unit.terms.map((term) => term.id),
    title: `${unit.title}の語句テスト`,
    returnTo,
  })
  const practice = (extra) => navigate(meta.screens.practice, { unitId: unit.id, ...extra, returnTo })
  const levelCount = (level) => unit.questions.filter((question) => question.level === level).length

  return (
    <div className="pb-8" data-subject-unit-page={unit.id}>
      <ScreenHeader title={<SubjectText>{unit.title}</SubjectText>} subtitle={`${book.label}・${unit.chapter}`} />

      <div className="space-y-4 px-4 pt-3">
        <Card className="p-4" data-subject-unit-goal>
          <div className="flex items-center gap-2">
            <Chip color={book.color}>{`${book.emoji} ${book.label}`}</Chip>
            <span className="text-[11px] font-extrabold text-ink/45">{unit.part}</span>
          </div>
          {unit.goal && (
            <p className="mt-3 text-sm font-extrabold leading-relaxed text-ink/80">
              <span className="mr-1 text-[11px] text-emerald-700">めあて</span>
              <SubjectText>{unit.goal}</SubjectText>
            </p>
          )}
        </Card>

        {/* 要点：見出しと本文、必要なら図。 */}
        <section className="space-y-3" aria-label="要点" data-subject-unit-points>
          <h2 className="px-1 font-display text-base font-extrabold text-ink/80">要点</h2>
          {unit.points.map((point, index) => (
            <Card key={point.heading} className="p-4" data-subject-point={index + 1}>
              <h3 className="flex items-start gap-2 font-display text-base font-extrabold leading-snug text-ink">
                <span
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs text-white"
                  style={{ backgroundColor: book.color }}
                >
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1"><SubjectText>{point.heading}</SubjectText></span>
              </h3>
              <p className="mt-2 text-sm font-bold leading-relaxed text-ink/75"><SubjectText>{point.body}</SubjectText></p>
              {point.figure && (
                <div className="mt-3 rounded-2xl bg-paper p-2">
                  <SubjectFigure figure={point.figure} showGuide />
                </div>
              )}
            </Card>
          ))}
        </section>

        {/* 重要語句：語句と意味。カードで暗記し、意味から語句を選ぶテストで確かめる。 */}
        <section className="space-y-3" aria-label="重要語句" data-subject-unit-terms>
          <h2 className="px-1 font-display text-base font-extrabold text-ink/80">{`重要語句（${unit.terms.length}）`}</h2>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={study} disabled={!unit.terms.length} data-subject-unit-study>
              <BookOpen size={16} /> 暗記
            </Button>
            <Button variant="secondary" onClick={quiz} disabled={!unit.terms.length} data-subject-unit-quiz>
              <Cards size={16} /> 語句テスト
            </Button>
          </div>
          <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white shadow-card">
            {unit.terms.map((term) => (
              <li key={term.id} className="px-4 py-3" data-subject-term={term.id}>
                <div className="flex items-start gap-2">
                  <p className="min-w-0 flex-1 font-display text-base font-extrabold text-ink"><SubjectText>{term.term}</SubjectText></p>
                  <div className="w-24 shrink-0">
                    <WordBookButton
                      domain={meta.notebookTerms}
                      itemId={term.id}
                      itemLabel={term.term}
                      className="min-h-9 bg-paper px-2 text-[10px] text-emerald-800"
                    />
                  </div>
                </div>
                <p className="mt-1 text-sm font-bold leading-relaxed text-ink/65"><SubjectText>{term.meaning}</SubjectText></p>
                {term.note && <p className="mt-1 text-[13px] font-bold leading-relaxed text-ink/55" data-subject-term-note><SubjectText>{term.note}</SubjectText></p>}
              </li>
            ))}
          </ul>
        </section>

        {/* 演習：段階ごとの問題と、前回の結果。 */}
        <section className="space-y-3" aria-label="演習" data-subject-unit-practice>
          <h2 className="px-1 font-display text-base font-extrabold text-ink/80">{`演習（${unit.questions.length}問）`}</h2>
          <Card className="p-4">
            <div className="grid grid-cols-4 gap-1 text-center" data-subject-unit-counts>
              {RESULT_ROWS.map(([id, row]) => (
                <div key={id} className="rounded-xl bg-paper px-1 py-1.5">
                  <p className="text-[10px] font-extrabold leading-tight" style={{ color: row.color }}>{row.short}</p>
                  <p className="font-display text-base font-extrabold text-ink">{counts[id]}</p>
                </div>
              ))}
            </div>
            <Button
              full
              className="mt-3"
              disabled={!unit.questions.length}
              onClick={() => practice({ title: `${unit.title}の演習` })}
              data-subject-unit-start="all"
            >
              <Target size={17} /> {`すべて解く（${unit.questions.length}問）`}
            </Button>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {PRACTICE_LEVEL_IDS.map((level) => (
                <Button
                  key={level}
                  size="sm"
                  variant="secondary"
                  disabled={!levelCount(level)}
                  onClick={() => practice({ level, title: `${unit.title}の演習（${PRACTICE_LEVELS[level].label}）` })}
                  data-subject-unit-start={level}
                >
                  {`${PRACTICE_LEVELS[level].label}（${levelCount(level)}）`}
                </Button>
              ))}
            </div>
          </Card>

          {PRACTICE_LEVEL_IDS.map((level) => {
            const questions = unit.questions.filter((question) => question.level === level)
            if (!questions.length) return null
            const levelMeta = PRACTICE_LEVELS[level]
            return (
              <section key={level} className="space-y-2" data-subject-level-section={level}>
                <h3 className="px-1 text-sm font-extrabold" style={{ color: levelMeta.color }}>{levelMeta.label}</h3>
                <ol className="space-y-2">
                  {questions.map((question) => {
                    const latest = latestSubjectPractice(practiceLog, question.id)
                    return (
                      <li key={question.id} data-return-row={question.id}>
                        <button
                          type="button"
                          onClick={() => practice({ ids: [question.id], preserveOrder: true, title: `${unit.title}の演習（${levelMeta.label}）` })}
                          className="flex w-full items-center gap-3 rounded-2xl bg-white p-3.5 text-left shadow-card transition-transform active:scale-[0.99]"
                          data-subject-question-row={question.id}
                        >
                          <span className="min-w-0 flex-1">
                            <span className="flex flex-wrap items-center gap-1.5">
                              <Chip color={levelMeta.color}>{levelMeta.label}</Chip>
                              <span className="text-[11px] font-extrabold text-ink/45">{PRACTICE_KINDS[question.kind].label}</span>
                              {latest && (
                                <span className="text-[11px] font-extrabold" style={{ color: SUBJECT_PRACTICE_RESULTS[latest.result].color }}>
                                  {`前回：${SUBJECT_PRACTICE_RESULTS[latest.result].short}`}
                                </span>
                              )}
                            </span>
                            <span className="mt-1 line-clamp-2 block text-sm font-bold leading-relaxed text-ink/80"><SubjectText>{question.text}</SubjectText></span>
                          </span>
                          <span className="shrink-0" style={{ color: book.color }}><ArrowRight size={18} /></span>
                        </button>
                      </li>
                    )
                  })}
                </ol>
              </section>
            )
          })}
        </section>
      </div>
    </div>
  )
}

export function SocialUnitScreen() {
  return <SubjectUnitScreen subject="social" />
}

export function ScienceUnitScreen() {
  return <SubjectUnitScreen subject="science" />
}
