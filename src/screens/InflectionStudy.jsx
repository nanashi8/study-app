import { useMemo, useState } from 'react'
import { useScreenParam, useStore } from '../store/useStore.js'
import { getLevel } from '../data/levels.js'
import { getWord } from '../data/vocab.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { Button, Chip, cx } from '../components/ui.jsx'
import { LoadMoreButton } from '../components/LoadMoreButton.jsx'
import { MeaningText } from '../components/MeaningText.jsx'
import { PosBadge } from '../components/PosBadge.jsx'
import { InflectionForm } from '../components/WordInflections.jsx'
import { INFLECTION_TAB } from '../components/GrammarInflectionDivision.jsx'
import { ArrowRight } from '../components/Icons.jsx'
import { inflectionsForWord } from '../lib/wordInflections.js'
import {
  INFLECTION_GROUPS,
  INFLECTION_LEVEL_ROWS,
  IRREGULAR_CATEGORIES,
  IRREGULAR_GROUP,
  irregularCategory,
  irregularRows,
  INFLECTION_RULE_TEXT,
  inflectionGroup,
  inflectionKind,
  inflectionRuleExamples,
  inflectionStudyRows,
} from '../lib/inflectionQuiz.js'

// 語形変化の学習ページ。文法の「語形変化」の行の「学習」から開く。
//   表の種類（group）… その表の形の作り方の決まりと、決まりごとの例、その表の全部の語（易しい級から）
//   級（level）       … その級の語（準2級〜1級は不規則動詞）の変化形を全部
// 範囲はテストと同じ（3級以下の語と準2級以上の不規則動詞）。
// 形には発音ボタンを付ける（端末の声が読み違える形は発音記号）。下まで読むと続きを足す。

const PAGE = 40

function readGroup(value) {
  return inflectionGroup(value) || value === IRREGULAR_GROUP ? value : null
}
function readCategory(value) {
  return irregularCategory(value) ? value : IRREGULAR_CATEGORIES[0].id
}

/** 不規則に変化する語の型ごとの表。その型の全部の語を易しい級から、形ごとに発音ボタンを付けて並べる。 */
function IrregularTable({ category }) {
  const rows = irregularRows({ category: category.id })
  const columns = rows[0]?.cells.map((cell) => cell.label) ?? []
  return (
    <section className="rounded-2xl bg-white p-3 shadow-card" data-irregular-table={category.id} data-speech-group>
      <h2 className="px-1 font-display text-base font-extrabold text-ink">{category.label}</h2>
      <p className="mt-0.5 px-1 text-xs font-bold leading-relaxed text-ink/60">{category.note}</p>
      <p className="mt-0.5 px-1 font-display text-sm font-extrabold text-sky-600">{category.example}</p>
      {/* 画面の幅に収める（列の幅をそろえ、発音ボタンは語の下へ回り込む）。 */}
      <div className="mt-2">
        <table className="w-full table-fixed border-separate border-spacing-x-1 border-spacing-y-1 text-left">
          <thead>
            <tr>
              {columns.map((label) => (
                <th key={label} className="px-1.5 text-[10px] font-extrabold text-ink/45">{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.wordId} data-irregular-row={row.wordId}>
                {row.cells.map((cell, index) => (
                  <td key={cell.id} className="rounded-lg bg-brand-50/50 px-1.5 py-1 align-top">
                    <InflectionForm form={{ text: cell.answer }} wordId={row.wordId} label={cell.label} />
                    {index === 0 && <span className="block text-[10px] font-bold leading-tight text-ink/50">{`${row.meaning}・${getLevel(row.level).label}`}</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
function readLevel(value) {
  return INFLECTION_LEVEL_ROWS.some((level) => level.id === value) ? value : null
}

/** 表の種類の形の作り方。形の種類ごと・決まりごとに、易しい語の例を2つ並べる。 */
function RuleList({ group }) {
  const sections = useMemo(
    () => group.kinds.map((kindId) => ({ kind: inflectionKind(kindId), rules: inflectionRuleExamples(kindId) })),
    [group],
  )
  return (
    <section className="space-y-3" data-inflection-rules={group.id}>
      {sections.map(({ kind, rules }) => (
        <div key={kind.id} className="rounded-2xl bg-white p-4 ring-1 ring-sky-100">
          <h2 className="text-xs font-extrabold text-sky-600">{`${kind.short}の作り方`}</h2>
          <ul className="mt-2 space-y-2.5">
            {rules.map(([rule, examples]) => (
              <li key={rule} className="rounded-xl bg-sky-50/70 p-2.5" data-inflection-rule={rule}>
                <p className="text-sm font-bold leading-relaxed text-ink/80">{INFLECTION_RULE_TEXT[rule](kind.id)}</p>
                <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm">
                  {examples.map(({ row, cell }) => (
                    <span key={row.wordId} className="inline-flex items-center gap-1">
                      <span className="font-display font-extrabold text-ink/60">{row.head}</span>
                      <ArrowRight size={12} className="text-ink/30" />
                      <InflectionForm form={{ text: cell.answer }} wordId={row.wordId} label={kind.row} />
                    </span>
                  ))}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}

/** 語1つの行：見出し・意味・その行で見せる形（形の種類のページはその形だけ、級のページは全部）。 */
function WordRow({ row }) {
  const word = getWord(row.wordId)
  if (!word) return null
  const level = getLevel(word.level)
  const entry = inflectionsForWord(word).find((item) => item.pos === row.pos)
  const rows = entry?.rows ?? []
  return (
    <li className="rounded-2xl bg-white p-3 shadow-card" data-inflection-word={row.wordId} data-speech-group>
      <div className="flex items-start gap-2">
        <PosBadge pos={row.pos} />
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-1.5">
            <span className="font-display text-lg font-extrabold text-ink">{word.word}</span>
            <Chip color={level.color}>{`英検${level.label}`}</Chip>
          </p>
          <p className="mt-0.5 text-xs font-bold text-ink/55"><MeaningText>{word.meanings.join('・')}</MeaningText></p>
          <dl className="mt-1.5 grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-1">
            {rows.map((item) => (
              <div key={item.label} className="contents">
                <dt className="text-[11px] font-extrabold text-ink/45">{item.label}</dt>
                <dd className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
                  {item.forms.map((form) => (
                    <InflectionForm key={form.text} form={form} wordId={word.id} label={item.label} />
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </li>
  )
}

export function InflectionStudyScreen() {
  const navigate = useStore((s) => s.navigate)
  const params = useStore((s) => s.params)
  const [groupId, setGroupId] = useScreenParam('group', readGroup)
  const [levelId, setLevelId] = useScreenParam('level', readLevel)
  const [categoryId, setCategoryId] = useScreenParam('category', readCategory)
  const irregular = groupId === IRREGULAR_GROUP
  const category = irregularCategory(categoryId) ?? IRREGULAR_CATEGORIES[0]
  const group = inflectionGroup(groupId)
  const byLevel = !group && !irregular
  const level = levelId ?? INFLECTION_LEVEL_ROWS[0].id
  const levelRow = INFLECTION_LEVEL_ROWS.find((item) => item.id === level)
  const rows = useMemo(
    () => (group ? inflectionStudyRows({ group: group.id }) : inflectionStudyRows({ level })),
    [group, level],
  )
  const [shown, setShown] = useState(PAGE)
  const visible = rows.slice(0, shown)
  const title = irregular ? '不規則に変化する語' : group ? group.label : `${levelRow.label}の語形変化`
  const tabs = irregular
    ? IRREGULAR_CATEGORIES.map((item) => ({ id: item.id, label: item.short }))
    : byLevel
      ? INFLECTION_LEVEL_ROWS.map((item) => ({ id: item.id, label: item.id === 'irregular' ? '不規則動詞' : getLevel(item.id).label }))
      : INFLECTION_GROUPS.map((item) => ({ id: item.id, label: item.short }))
  const choose = (id) => {
    setShown(PAGE)
    if (irregular) setCategoryId(id)
    else if (byLevel) setLevelId(id)
    else setGroupId(id)
  }
  const test = () => navigate('grammarQuiz', {
    source: {
      type: 'inflection',
      ...(irregular ? { group: IRREGULAR_GROUP, category: category.id } : group ? { group: group.id } : { level }),
      questionType: 'choice',
    },
    title: `${irregular ? category.label : title}・表`,
    levelColor: INFLECTION_TAB.color,
    returnTo: params.returnTo ?? { screen: 'grammar', params: {} },
  })

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader title={title} subtitle="語形変化の学習" />
      <div className="flex-1 overflow-y-auto px-4 pb-4" data-return-scroll="inflection-study">
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="group" aria-label={irregular ? '型' : byLevel ? '級' : '表の種類'}>
          {tabs.map((tab) => {
            const on = (irregular ? category.id : byLevel ? level : group?.id) === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => choose(tab.id)}
                aria-pressed={on}
                className={cx(
                  'shrink-0 rounded-2xl px-3.5 py-2 font-display text-sm font-extrabold',
                  on ? 'bg-sky-500 text-white shadow-pop' : 'bg-white text-ink/55',
                )}
                data-inflection-study-tab={tab.id}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {irregular ? (
          <div className="mt-3"><IrregularTable category={category} /></div>
        ) : (
          <>
          {group && <div className="mt-3"><RuleList group={group} /></div>}

          <h2 className="mb-2 mt-5 px-1 font-display text-base font-extrabold text-ink/80">
            {`全${rows.length}語（易しい級から）`}
          </h2>
          <ul className="space-y-2.5" data-inflection-study-list>
            {visible.map((row) => (
              <WordRow key={`${row.wordId}|${row.pos}`} row={row} />
            ))}
          </ul>
          {shown < rows.length && (
            <div className="mt-3">
              <LoadMoreButton count={shown} onMore={() => setShown((value) => value + PAGE)}>
                {`次の${Math.min(PAGE, rows.length - shown)}語を表示`}
              </LoadMoreButton>
            </div>
          )}
          </>
        )}
      </div>
      <div className="shrink-0 border-t border-brand-100 bg-white/90 p-4 pb-4 backdrop-blur">
        <Button full size="lg" onClick={test} data-inflection-study-test>
          {`${irregular ? category.label : title}をテストする`} <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  )
}
