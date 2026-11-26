import { LEVELS } from '../data/levels.js'
import { GRAMMAR_QUESTION_TYPE_META } from '../data/grammar-format-expansion.js'
import { INFLECTION_KINDS, inflectionQuestionsFor } from '../lib/inflectionQuiz.js'
import { summarizeSrsItems } from '../lib/contentProgress.js'
import { LearningEntryCard } from './LearningEntryCard.jsx'
import { BookOpen } from './Icons.jsx'

// 文法の入口の「語形変化」タブ。級別では5級の前、単元別では「文の基本と文型」の前に置く。
//   級別（by='kind'）  形の種類ごとの行（動詞の3単現・過去形・過去分詞・ing形、名詞の複数形、比較級・最上級）
//   単元別（by='level'）語の級ごとの行（下の級から）
// どの行にも学習（形の作り方と全部の語の形の一覧）とテスト（4択）の入口を置く。
// 問題は変化形の台帳から作る（src/lib/inflectionQuiz.js）。テストの問題の種類は選択だけ。

export const INFLECTION_TAB = Object.freeze({
  id: 'forms',
  label: '語形変化',
  emoji: '🔤',
  color: '#0ea5e9',
  ariaLabel: '語形変化（動詞の活用・名詞の複数形・比較級）',
})

const QUESTION_UNITS = { learning: '語', quiz: '問' }
const usable = (questionType) => questionType === 'mixed' || questionType === 'choice'

/** 語形変化の問題の数（テストの問題の種類ごと）。 */
export function inflectionTypeCount(questionType) {
  return usable(questionType) ? inflectionQuestionsFor().length : 0
}

function Row({ title, subtitle, emoji, items, questionType, srs, studyAriaLabel, onStudy, onQuiz, ...rest }) {
  const typeMeta = GRAMMAR_QUESTION_TYPE_META[questionType]
  const shown = usable(questionType) ? items : []
  return (
    <LearningEntryCard
      {...rest}
      emoji={emoji}
      accentColor={INFLECTION_TAB.color}
      title={title}
      subtitle={subtitle}
      status={shown.length ? summarizeSrsItems(shown, srs) : null}
      showLearningStatus={false}
      units={QUESTION_UNITS}
      note={shown.length ? undefined : `${typeMeta.short}の問題はありません（語形変化は選択の問題）`}
      studyLabel="学習"
      studyIcon={<BookOpen size={16} />}
      studyAriaLabel={studyAriaLabel}
      onStudy={onStudy}
      quizAriaLabel={`${title}を${typeMeta.label}でテスト（${shown.length}問）`}
      quizDisabled={!shown.length}
      onQuiz={onQuiz}
    />
  )
}

export function GrammarInflectionDivision({ by, questionType, srs, onStudy, onTest }) {
  const all = inflectionQuestionsFor()
  const rows = by === 'kind'
    ? INFLECTION_KINDS.map((kind) => ({
        key: kind.id,
        title: kind.label,
        emoji: kind.emoji,
        subtitle: `${inflectionQuestionsFor({ kind: kind.id }).length}語・易しい級の語から出題`,
        items: inflectionQuestionsFor({ kind: kind.id }),
        params: { kind: kind.id },
      }))
    : LEVELS.map((level) => ({
        key: level.id,
        title: `英検${level.label}の語の語形変化`,
        emoji: level.emoji,
        items: inflectionQuestionsFor({ level: level.id }),
        params: { level: level.id },
      }))
        .filter((row) => row.items.length)
        .map((row) => ({ ...row, subtitle: `動詞の活用・複数形・比較級を ${row.items.length}問` }))
  return (
    <>
      <Row
        className="mt-4"
        data-grammar-inflection-summary={by}
        title="語形変化"
        emoji={INFLECTION_TAB.emoji}
        subtitle="動詞の活用（3単現・過去形・過去分詞・ing形）、名詞の複数形、形容詞・副詞の比較級・最上級"
        items={all}
        questionType={questionType}
        srs={srs}
        studyAriaLabel="語形変化の作り方を学習"
        onStudy={() => onStudy(by === 'kind' ? { kind: INFLECTION_KINDS[0].id } : { level: LEVELS[0].id })}
        onQuiz={() => onTest({}, '語形変化')}
      />

      <h2 className="mb-2 mt-5 px-1 font-display text-base font-extrabold text-ink/80">目次</h2>
      <ol className="space-y-3" data-grammar-contents="forms">
        {rows.map((row) => (
          <li key={row.key} data-return-row={`forms-${row.key}`}>
            <Row
              data-grammar-inflection-row={row.key}
              title={row.title}
              emoji={row.emoji}
              subtitle={row.subtitle}
              items={row.items}
              questionType={questionType}
              srs={srs}
              studyAriaLabel={`${row.title}を学習`}
              onStudy={() => onStudy(row.params)}
              onQuiz={() => onTest(row.params, row.title)}
            />
          </li>
        ))}
      </ol>
    </>
  )
}
