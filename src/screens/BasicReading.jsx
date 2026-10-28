import { useStore } from '../store/useStore.js'
import {
  BASIC_READING_KINDS,
  BASIC_READING_LEVEL_IDS,
  BASIC_READING_PASSAGES,
  BASIC_READING_QUESTIONS,
  BASIC_READING_QUIZ_DOMAIN,
  BASIC_READING_THEMES,
  basicReadingPassagesForLevel,
  basicReadingQuestionId,
  basicReadingThemeLabel,
} from '../data/basic-reading/index.js'
import { getLevel } from '../data/levels.js'
import { READING_RULES_BY_ID } from '../data/reading-rules.js'
import { basicReadingWordCount } from '../lib/basicReading.js'
import {
  contentQuizKey,
  normalizeContentQuizResults,
  summarizeCompletionItems,
  summarizeQuizItems,
} from '../lib/contentProgress.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { Card, Chip } from '../components/ui.jsx'
import { LearningStatusBars } from '../components/LearningStatusBars.jsx'
import { ArrowRight, Book, Check } from '../components/Icons.jsx'

// 長文1本の結果：読み終えたか、ルールの問題の直近の正解数。
function passageResult(passage, readingsDone, quizResults) {
  const correct = passage.lessons.filter((lesson) => (
    quizResults[contentQuizKey(BASIC_READING_QUIZ_DOMAIN, basicReadingQuestionId(passage, lesson))]?.lastResult === 'correct'
  )).length
  return { done: readingsDone.includes(passage.id), correct, total: passage.lessons.length }
}

// 読んだ長文（答え合わせをした長文）と、ルールの問題ごとの直近の結果の3色バー。
function BasicReadingStatus({ passages, readingsDone, quizResults, label }) {
  const ids = new Set(passages.map((passage) => passage.id))
  const learning = summarizeCompletionItems({ items: passages, completedIds: readingsDone })
  const quiz = summarizeQuizItems({
    items: BASIC_READING_QUESTIONS.filter((question) => ids.has(question.passageId)),
    quizResults,
    quizDomain: BASIC_READING_QUIZ_DOMAIN,
  })
  return (
    <Card className="p-4" data-basic-reading-status>
      <LearningStatusBars progress={{ ...learning, quiz: quiz.counts }} compact units={{ learning: '本', quiz: '問' }} />
      <p className="mt-2 text-[10px] font-bold text-ink/45">{label}</p>
    </Card>
  )
}

function LevelList({ navigate, readingsDone, quizResults }) {
  return (
    <div className="space-y-3 px-4">
      <Card className="p-4">
        <h2 className="font-display text-base font-extrabold text-ink">進め方</h2>
        <ol className="mt-2 grid gap-1.5">
          {[
            '自分に合う級を選び、長文を1本選ぶ。',
            '本文に出るその級の単語・熟語を確かめてから、本文を読む。',
            'ルールを使って3問を解き、答え合わせで、この本文での使い方を確かめる。',
          ].map((text, index) => (
            <li key={text} className="flex gap-2 text-xs font-bold leading-relaxed text-ink/65">
              <span className="font-black text-brand-500">{index + 1}</span>
              <span>{text}</span>
            </li>
          ))}
        </ol>
        <p className="mt-2 text-xs font-bold leading-relaxed text-ink/50">
          {'どの級も10本で、長文読解の30ルールを一つずつ学べます。'}
        </p>
      </Card>

      <BasicReadingStatus
        passages={BASIC_READING_PASSAGES}
        readingsDone={readingsDone}
        quizResults={quizResults}
        label={`読んだ長文と、ルールの問題の最近の結果を、全${BASIC_READING_PASSAGES.length}本・${BASIC_READING_QUESTIONS.length}問でまとめて表示`}
      />

      {BASIC_READING_LEVEL_IDS.map((levelId) => {
        const level = getLevel(levelId)
        const passages = basicReadingPassagesForLevel(levelId)
        const results = passages.map((passage) => passageResult(passage, readingsDone, quizResults))
        const done = results.filter((result) => result.done).length
        const correct = results.reduce((sum, result) => sum + result.correct, 0)
        const total = results.reduce((sum, result) => sum + result.total, 0)
        return (
          <Card key={levelId} className="overflow-hidden" data-return-row={`basic-reading-${levelId}`}>
            <button
              type="button"
              onClick={() => navigate('basicReading', { level: levelId })}
              className="flex w-full items-center gap-3 p-4 text-left active:bg-brand-50"
              data-basic-reading-level={levelId}
            >
              <span
                className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-2xl"
                style={{ backgroundColor: `${level.color}22` }}
                aria-hidden="true"
              >
                {level.emoji}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-base font-extrabold text-ink">英検{level.label}</span>
                  <span className="text-[11px] font-bold text-ink/45">{level.sub}</span>
                </span>
                <span className="mt-0.5 block text-xs font-bold leading-relaxed text-ink/55">
                  {BASIC_READING_THEMES[levelId].map((theme) => theme.label).join('・')}
                </span>
                <span className="mt-1 block text-[11px] font-extrabold text-brand-600">
                  {passages.length}本・30ルール ・ 読んだ長文 {done}/{passages.length} ・ 正解 {correct}/{total}問
                </span>
              </span>
              <ArrowRight size={19} className="shrink-0 text-brand-500" />
            </button>
          </Card>
        )
      })}

      <Card className="overflow-hidden" data-return-row="readingRules">
        <button
          type="button"
          onClick={() => navigate('readingRules')}
          className="flex w-full items-center gap-3 p-4 text-left active:bg-brand-50"
        >
          <span className="min-w-0 flex-1">
            <span className="block font-display text-base font-extrabold text-ink">長文読解の30ルール</span>
            <span className="mt-0.5 block text-xs font-bold leading-relaxed text-ink/50">
              全ルールの合図・手順・図をまとめて確かめる
            </span>
          </span>
          <ArrowRight size={19} className="shrink-0 text-brand-500" />
        </button>
      </Card>
    </div>
  )
}

function PassageList({ levelId, navigate, readingsDone, quizResults }) {
  const level = getLevel(levelId)
  const passages = basicReadingPassagesForLevel(levelId)
  return (
    <div className="space-y-3 px-4">
      <BasicReadingStatus
        passages={passages}
        readingsDone={readingsDone}
        quizResults={quizResults}
        label={`英検${level.label}の${passages.length}本・${passages.length * 3}問の、読んだ長文とルールの問題の最近の結果`}
      />
      {passages.map((passage, index) => {
        const result = passageResult(passage, readingsDone, quizResults)
        return (
          <Card key={passage.id} className="overflow-hidden" data-return-row={passage.id}>
            <button
              type="button"
              onClick={() => navigate('basicReadingLesson', { passageId: passage.id })}
              className="flex w-full items-start gap-3 p-4 text-left active:bg-brand-50"
              data-basic-reading-passage={passage.id}
              aria-label={`${passage.titleJa}を学習する`}
            >
              <span
                className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-2xl"
                style={{ backgroundColor: `${level.color}22` }}
                aria-hidden="true"
              >
                {passage.emoji}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-black text-ink/40">{index + 1}本目 ・ {BASIC_READING_KINDS[passage.kind]}</span>
                <span className="block font-display text-base font-extrabold leading-snug text-ink">{passage.title}</span>
                <span className="block text-sm font-bold text-ink/55">{passage.titleJa}</span>
                <span className="mt-0.5 block text-[11px] font-extrabold text-brand-600">{basicReadingThemeLabel(passage)}</span>
                <span className="mt-1.5 flex flex-wrap gap-1">
                  {passage.lessons.map((lesson) => (
                    <span key={lesson.rule} className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-extrabold text-sky-700">
                      {READING_RULES_BY_ID[lesson.rule]?.title}
                    </span>
                  ))}
                </span>
                <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] font-bold text-ink/40">
                  <span className="inline-flex items-center gap-0.5 whitespace-nowrap"><Book size={12} /> 本文 {basicReadingWordCount(passage)}語</span>
                  {result.done && (
                    <span className="inline-flex items-center gap-0.5 whitespace-nowrap text-emerald-600">
                      <Check size={12} /> 正解 {result.correct}/{result.total}問
                    </span>
                  )}
                </span>
              </span>
              <ArrowRight size={19} className="mt-3 shrink-0 text-brand-500" />
            </button>
          </Card>
        )
      })}
    </div>
  )
}

export function BasicReadingScreen() {
  const params = useStore((state) => state.params)
  const navigate = useStore((state) => state.navigate)
  const readingsDone = useStore((state) => state.readingsDone)
  const quizResults = normalizeContentQuizResults(useStore((state) => state.contentQuizResults))
  const levelId = BASIC_READING_LEVEL_IDS.includes(params.level) ? params.level : null
  const level = levelId ? getLevel(levelId) : null

  return (
    <div className="pb-8">
      <ScreenHeader
        title={level ? `基礎長文 英検${level.label}` : '基礎長文'}
        subtitle={level ? 'この級の語彙で読み、30ルールを1本に3つずつ学ぶ' : '級の語彙で読み、長文読解の30ルールを学ぶ'}
        color={level?.color}
        right={level ? <Chip color={level.color}>{basicReadingPassagesForLevel(levelId).length}本</Chip> : null}
      />
      <div className="pt-3">
        {levelId
          ? <PassageList levelId={levelId} navigate={navigate} readingsDone={readingsDone} quizResults={quizResults} />
          : <LevelList navigate={navigate} readingsDone={readingsDone} quizResults={quizResults} />}
      </div>
    </div>
  )
}
