import { GRAMMAR_QUESTION_TYPE_META } from '../data/grammar-format-expansion.js'
import {
  INFLECTION_GROUPS,
  INFLECTION_LEVEL_ROWS,
  IRREGULAR_GROUP,
  inflectionQuestionsFor,
  inflectionStudyRows,
  irregularRows,
} from '../lib/inflectionQuiz.js'
import { summarizeSrsItems } from '../lib/contentProgress.js'
import { LearningEntryCard } from './LearningEntryCard.jsx'
import { BookOpen } from './Icons.jsx'

// 文法の入口の「語形変化」タブ。級別では5級の前、単元別では「文の基本と文型」の前に置く。
//   級別（by='kind'）  表の種類ごとの行（動詞の活用表・名詞の複数形・形容詞と副詞の比較級と最上級）
//   単元別（by='level'）級ごとの行（5級・4級・3級・準2級〜1級の不規則動詞）
// どの行にも学習（形の作り方と全部の語の形の一覧）とテスト（約5語の表の3か所の空所を埋める）の入口を置く。
// 問題は変化形の台帳から作る（src/lib/inflectionQuiz.js）。範囲は3級以下の語と準2級以上の不規則動詞。

export const INFLECTION_TAB = Object.freeze({
  id: 'forms',
  label: '語形変化',
  emoji: '🔤',
  color: '#0ea5e9',
  ariaLabel: '語形変化（動詞の活用・名詞の複数形・比較級）',
})

const QUESTION_UNITS = { learning: '語', quiz: '表' }
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
      note={shown.length ? undefined : `${typeMeta.short}の問題はありません（語形変化は表の空所を選んで埋める問題）`}
      studyLabel="学習"
      studyIcon={<BookOpen size={16} />}
      studyAriaLabel={studyAriaLabel}
      onStudy={onStudy}
      quizAriaLabel={`${title}をテスト（表${shown.length}問）`}
      quizDisabled={!shown.length}
      onQuiz={onQuiz}
    />
  )
}

export function GrammarInflectionDivision({ by, questionType, srs, onStudy, onTest }) {
  const all = inflectionQuestionsFor().filter((item) => item.group !== IRREGULAR_GROUP)
  const rows = by === 'kind'
    ? INFLECTION_GROUPS.map((group) => ({
        key: group.id,
        title: group.label,
        emoji: group.emoji,
        subtitle: `${inflectionStudyRows({ group: group.id }).length}語・易しい級の語から出題`,
        items: inflectionQuestionsFor({ group: group.id }),
        params: { group: group.id },
      }))
    : INFLECTION_LEVEL_ROWS.map((level) => ({
        key: level.id,
        title: `${level.label}の語形変化`,
        emoji: level.id === 'irregular' ? '⚡' : '📘',
        subtitle: `${inflectionStudyRows({ level: level.id }).length}語の活用表・複数形・比較級`,
        items: inflectionQuestionsFor({ level: level.id }),
        params: { level: level.id },
      }))
  // 不規則に変化する語（級を問わず全部）は、どちらの区分でも最後の行に別に置く。
  rows.push({
    key: 'irregular-forms',
    title: '不規則に変化する語',
    emoji: '⚡',
    subtitle: `全級の${irregularRows().length}語を型ごとの表で（A-A-A・A-B-A・A-B-B・A-B-C、名詞、比較級）`,
    items: inflectionQuestionsFor({ group: IRREGULAR_GROUP }),
    params: { group: IRREGULAR_GROUP },
  })
  return (
    <>
      <Row
        className="mt-4"
        data-grammar-inflection-summary={by}
        title="語形変化"
        emoji={INFLECTION_TAB.emoji}
        subtitle="3級以下の語と準2級以上の不規則動詞の、動詞の活用表・名詞の複数形・比較級と最上級"
        items={all}
        questionType={questionType}
        srs={srs}
        studyAriaLabel="語形変化の作り方を学習"
        onStudy={() => onStudy(by === 'kind' ? { group: INFLECTION_GROUPS[0].id } : { level: INFLECTION_LEVEL_ROWS[0].id })}
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
