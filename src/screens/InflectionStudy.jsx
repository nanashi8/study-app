import { useMemo, useState } from 'react'
import { useScreenParam, useStore } from '../store/useStore.js'
import { LEVELS, getLevel } from '../data/levels.js'
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
  INFLECTION_KINDS,
  INFLECTION_RULE_TEXT,
  inflectionKind,
  inflectionQuestionsFor,
  inflectionStudyRows,
} from '../lib/inflectionQuiz.js'

// 語形変化の学習ページ。文法の「語形変化」の行の「学習」から開く。
//   形の種類（kind）… その形の作り方の決まりと、決まりごとの例、その形を持つ全部の語（易しい級から）
//   級（level）      … その級の語の変化形を全部
// 形には発音ボタンを付ける（端末の声が読み違える形は発音記号）。下まで読むと続きを足す。

const PAGE = 40

function readKind(value) {
  return inflectionKind(value) ? value : null
}
function readLevel(value) {
  return LEVELS.some((level) => level.id === value) ? value : null
}

/** 形の種類の決まり。問題で使う決まりごとに、易しい語の例を2つ並べる。 */
function RuleList({ kind }) {
  const groups = useMemo(() => {
    const map = new Map()
    for (const item of inflectionQuestionsFor({ kind: kind.id })) {
      if (!map.has(item.rule)) map.set(item.rule, [])
      const list = map.get(item.rule)
      if (list.length < 2) list.push(item)
    }
    return [...map]
  }, [kind.id])
  return (
    <section className="rounded-2xl bg-white p-4 ring-1 ring-sky-100" data-inflection-rules={kind.id}>
      <h2 className="text-xs font-extrabold text-sky-600">{`${kind.short}の作り方`}</h2>
      <ul className="mt-2 space-y-2.5">
        {groups.map(([rule, items]) => (
          <li key={rule} className="rounded-xl bg-sky-50/70 p-2.5" data-inflection-rule={rule}>
            <p className="text-sm font-bold leading-relaxed text-ink/80">{INFLECTION_RULE_TEXT[rule](kind.id)}</p>
            <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm">
              {items.map((item) => (
                <span key={item.id} className="inline-flex items-center gap-1">
                  <span className="font-display font-extrabold text-ink/60">{getWord(item.wordId)?.word}</span>
                  <ArrowRight size={12} className="text-ink/30" />
                  <InflectionForm form={{ text: item.answer }} wordId={item.wordId} label={kind.row} />
                </span>
              ))}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** 語1つの行：見出し・意味・その行で見せる形（形の種類のページはその形だけ、級のページは全部）。 */
function WordRow({ row, kind }) {
  const word = getWord(row.wordId)
  if (!word) return null
  const level = getLevel(word.level)
  const entry = inflectionsForWord(word).find((item) => item.pos === row.pos)
  const rows = (entry?.rows ?? []).filter((item) => !kind || item.label === kind.row)
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
  const [kindId, setKindId] = useScreenParam('kind', readKind)
  const [levelId, setLevelId] = useScreenParam('level', readLevel)
  const kind = inflectionKind(kindId)
  const byLevel = !kind
  const level = levelId ?? LEVELS[0].id
  const rows = useMemo(
    () => (kind ? inflectionStudyRows({ kind: kind.id }) : inflectionStudyRows({ level })),
    [kind, level],
  )
  const [shown, setShown] = useState(PAGE)
  const visible = rows.slice(0, shown)
  const title = kind ? kind.label : `英検${getLevel(level).label}の語の語形変化`
  const tabs = byLevel
    ? LEVELS.filter((item) => inflectionQuestionsFor({ level: item.id }).length).map((item) => ({ id: item.id, label: getLevel(item.id).label }))
    : INFLECTION_KINDS.map((item) => ({ id: item.id, label: item.short }))
  const choose = (id) => {
    setShown(PAGE)
    if (byLevel) setLevelId(id)
    else setKindId(id)
  }
  const test = () => navigate('grammarQuiz', {
    source: { type: 'inflection', ...(kind ? { kind: kind.id } : { level }), questionType: 'choice' },
    title: `${title}・選択`,
    levelColor: INFLECTION_TAB.color,
    returnTo: params.returnTo ?? { screen: 'grammar', params: {} },
  })

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader title={title} subtitle="語形変化の学習" />
      <div className="flex-1 overflow-y-auto px-4 pb-4" data-return-scroll="inflection-study">
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="group" aria-label={byLevel ? '級' : '形の種類'}>
          {tabs.map((tab) => {
            const on = (byLevel ? level : kind?.id) === tab.id
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

        {kind && <div className="mt-3"><RuleList kind={kind} /></div>}

        <h2 className="mb-2 mt-5 px-1 font-display text-base font-extrabold text-ink/80">
          {`全${rows.length}語（易しい級から）`}
        </h2>
        <ul className="space-y-2.5" data-inflection-study-list>
          {visible.map((row) => (
            <WordRow key={`${row.wordId}|${row.pos}`} row={row} kind={kind} />
          ))}
        </ul>
        {shown < rows.length && (
          <div className="mt-3">
            <LoadMoreButton count={shown} onMore={() => setShown((value) => value + PAGE)}>
              {`次の${Math.min(PAGE, rows.length - shown)}語を表示`}
            </LoadMoreButton>
          </div>
        )}
      </div>
      <div className="shrink-0 border-t border-brand-100 bg-white/90 p-4 pb-4 backdrop-blur">
        <Button full size="lg" onClick={test} data-inflection-study-test>
          {`${title}をテストする`} <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  )
}
