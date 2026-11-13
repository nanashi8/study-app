import { useScreenParam, useStore } from '../store/useStore.js'
import { getLevel } from '../data/levels.js'
import { getGrammar } from '../data/grammar.js'
import { GRAMMAR_QUESTION_TYPE_META } from '../data/grammar-format-expansion.js'
import { grammarReferenceFor } from '../data/grammar-reference/index.js'
import {
  GRAMMAR_DIAGNOSTIC_ROUND,
  GRAMMAR_DIAGNOSTIC_SCOPES,
  GRAMMAR_DIAGNOSTIC_VERDICTS,
  grammarDiagnosticHistory,
  grammarDiagnosticLevels,
  grammarDiagnosticPracticeIds,
  grammarDiagnosticScope,
  grammarDiagnosticUnit,
  grammarDiagnosticUnits,
  nextGrammarDiagnosticRound,
  summarizeGrammarDiagnostic,
} from '../lib/grammarDiagnostic.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { Button, Card, cx } from '../components/ui.jsx'
import { ArrowRight, BookOpen } from '../components/Icons.jsx'
import { formatStudyDay } from '../lib/studyLog.js'

// 文法の実力診断。範囲を選ぶ → 文法テストの画面で10単元ずつの区切りで解く → 系統×級のマップで弱い単元を見つける。
// 受けるたびに前の回と別の問題を出し、回ごとの成績を履歴から開ける。
const DIAGNOSTIC_COLOR = '#6366f1'
const VERDICT_TONE = Object.freeze({
  ok: 'bg-emerald-500',
  unsure: 'bg-amber-400',
  weak: 'bg-rose-500',
  pending: 'bg-slate-300',
  todo: 'bg-slate-200',
})
const readView = (value) => (value === 'start' ? 'start' : 'result')
const readList = (value) => (value === 'unsure' ? 'unsure' : 'weak')
const readUnit = (value) => (grammarDiagnosticUnit(value) ? value : null)
const LIST_SHOWN = 5
const readAttempt = (value) => (Number.isSafeInteger(value) ? value : null)
const attemptLabel = (attempt) => `第${attempt + 1}回`

export function GrammarDiagnosticScreen() {
  const navigate = useStore((s) => s.navigate)
  const srs = useStore((s) => s.srs)
  const record = useStore((s) => s.grammarDiagnostic)
  const startDiagnostic = useStore((s) => s.startGrammarDiagnostic)
  const [view, setView] = useScreenParam('view', readView)
  const [attempt, setAttempt] = useScreenParam('attempt', readAttempt)
  const current = summarizeGrammarDiagnostic(record)
  // 履歴から開いた回（受けている回なら、いつもの結果）。
  const summary = attempt != null ? summarizeGrammarDiagnostic(record, attempt) ?? current : current
  const history = grammarDiagnosticHistory(record)

  const startRound = () => {
    const ids = nextGrammarDiagnosticRound(useStore.getState().grammarDiagnostic, { srs: useStore.getState().srs })
    if (!ids.length) return
    navigate('grammarQuiz', {
      source: { type: 'grammarList', ids, preserveOrder: true, diagnostic: true },
      size: ids.length,
      title: '文法の実力診断',
      levelColor: DIAGNOSTIC_COLOR,
      returnTo: { screen: 'grammarDiagnostic', params: { view: 'result' } },
      continueTo: { screen: 'grammarDiagnostic', params: { view: 'result' }, label: '診断の結果へ' },
    })
  }
  const begin = (scopeId) => {
    startDiagnostic(scopeId)
    setAttempt(null)
    setView('result')
    startRound()
  }

  if (view === 'start' || !summary) {
    const nextAttempt = Math.max(-1, current?.attempt ?? -1, ...history.map((row) => row.attempt)) + 1
    return <DiagnosticStart current={current} nextAttempt={nextAttempt} onBegin={begin} onBack={current ? () => setView('result') : null} />
  }
  return (
    <DiagnosticResult
      summary={summary}
      history={history}
      srs={srs}
      onNextRound={startRound}
      onChooseScope={() => setView('start')}
      onOpenAttempt={(next) => setAttempt(next === current?.attempt ? null : next)}
    />
  )
}

function DiagnosticStart({ current, nextAttempt, onBegin, onBack }) {
  const [scopeId, setScopeId] = useScreenParam('scope', (value) => (grammarDiagnosticScope(value) ? value : 'high'))
  const units = grammarDiagnosticUnits(scopeId)
  const rounds = Math.ceil(units.length / GRAMMAR_DIAGNOSTIC_ROUND)
  const scope = grammarDiagnosticScope(scopeId)
  return (
    <div className="pb-6">
      <ScreenHeader title="文法の実力診断" subtitle="受ける入試の範囲から、全部の単元を1問ずつ解いて弱い単元を見つける" />
      <div className="space-y-3 px-4 pt-3">
        <Card className="p-4">
          <h2 className="font-display text-base font-extrabold text-ink">{'範囲を選ぶ'}</h2>
          <div className="mt-3 space-y-2" role="radiogroup" aria-label="範囲">
            {GRAMMAR_DIAGNOSTIC_SCOPES.map((item) => {
              const count = grammarDiagnosticUnits(item.id).length
              const levels = grammarDiagnosticLevels(item.id)
              const selected = item.id === scopeId
              return (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  data-grammar-diagnostic-scope={item.id}
                  onClick={() => setScopeId(item.id)}
                  className={cx(
                    'w-full rounded-2xl border-2 px-3.5 py-3 text-left transition-colors',
                    selected ? 'border-brand-400 bg-brand-50' : 'border-slate-200 bg-white',
                  )}
                >
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="font-extrabold text-ink">{item.label}</span>
                    <span className="font-display text-lg font-extrabold text-ink">{count}<span className="ml-0.5 text-xs">{'単元'}</span></span>
                  </span>
                  <span className="block text-xs font-bold text-ink/50">{item.note}</span>
                  <span className="mt-1.5 flex gap-1" aria-hidden="true">
                    {grammarDiagnosticLevels('nankan').map((level) => (
                      <span
                        key={level}
                        className={cx(
                          'flex-1 rounded-md py-px text-center text-[10px] font-extrabold',
                          levels.includes(level) ? 'bg-brand-500 text-white' : 'bg-slate-100 text-ink/30',
                        )}
                      >
                        {getLevel(level).label}
                      </span>
                    ))}
                  </span>
                </button>
              )
            })}
          </div>
        </Card>
        <Card className="space-y-2 p-4 text-sm font-bold text-ink/70">
          <h2 className="font-display text-base font-extrabold text-ink">{'すすめ方'}</h2>
          <p>{`1単元1問ずつ、易しい級から出します。${GRAMMAR_DIAGNOSTIC_ROUND}単元ずつの区切りで、${rounds}区切りに分けて解けます。`}</p>
          <p>{'まちがえた単元は、次の区切りの初めにもう1問出します。2問ともまちがえたら「弱点」、2問目が合えば「あやふや」です。'}</p>
          <p>{'受け直すたびに、前の回と別の問題を出します。回ごとの成績は、結果の画面の「これまでの回」で見られます。'}</p>
          <p>{'途中でやめても続きから解けます。わからない問題は「わからない」を押すと、結果が正確になります。'}</p>
        </Card>
        {current && (
          <p className="px-1 text-xs font-bold text-ink/50">
            {current.finished
              ? `始めると${attemptLabel(nextAttempt)}になります。これまでの回の成績は履歴に残ります。`
              : `いまの${attemptLabel(current.attempt)}（${grammarDiagnosticScope(current.scope).label}・${current.answered}/${current.total}単元）は、途中のまま履歴に残り、新しい回は最初からになります。`}
          </p>
        )}
        <Button full size="lg" onClick={() => onBegin(scopeId)} data-grammar-diagnostic-begin>
          {`${scope.label}の診断を始める（${attemptLabel(nextAttempt)}）`} <ArrowRight size={18} />
        </Button>
        {onBack && <Button full variant="ghost" onClick={onBack}>{'いまの診断の結果へ戻る'}</Button>}
      </div>
    </div>
  )
}

function DiagnosticResult({ summary, history, onNextRound, onChooseScope, onOpenAttempt }) {
  const navigate = useStore((s) => s.navigate)
  const [list, setList] = useScreenParam('list', readList)
  const [selectedKey, setSelectedKey] = useScreenParam('unit', readUnit)
  const [more, setMore] = useScreenParam('more', (value) => value === true)
  const scope = grammarDiagnosticScope(summary.scope)
  const levels = grammarDiagnosticLevels(summary.scope)
  const { counts } = summary
  const restUnits = summary.total - summary.answered
  const returnTo = {
    screen: 'grammarDiagnostic',
    params: { view: 'result', list, unit: selectedKey, attempt: summary.isCurrent ? null : summary.attempt },
  }

  const openReference = (unit) => {
    const page = grammarReferenceFor(unit.level, unit.topic)
    if (page) navigate('grammarReference', { unitId: page.id })
  }
  const testUnit = (unit) => navigate('grammarQuiz', {
    source: { type: 'grammar', level: unit.level, topic: unit.topic, questionType: 'mixed' },
    title: `${unit.topic}・${GRAMMAR_QUESTION_TYPE_META.mixed.short}`,
    levelColor: getLevel(unit.level).color,
    returnTo,
  })
  const testWeak = () => navigate('grammarQuiz', {
    source: { type: 'grammarList', ids: grammarDiagnosticPracticeIds(summary.weak) },
    title: `弱点の${summary.weak.length}単元`,
    levelColor: DIAGNOSTIC_COLOR,
    returnTo,
  })

  const rows = list === 'weak' ? summary.weak : summary.unsure
  const shown = more ? rows : rows.slice(0, LIST_SHOWN)
  const selected = selectedKey ? grammarDiagnosticUnit(selectedKey) : null

  return (
    <div className="pb-6">
      <ScreenHeader title="文法の実力診断" subtitle={`${attemptLabel(summary.attempt)}・${scope.label}・${summary.total}単元`} />
      <div className="space-y-3 px-4 pt-3">
        <Card className="p-4" data-grammar-diagnostic-summary data-attempt={summary.attempt}>
          {!summary.isCurrent && (
            <p className="mb-2 rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-ink/60" data-grammar-diagnostic-past>
              {`${attemptLabel(summary.attempt)}（${formatStudyDay(summary.day)}）の結果を見ています。`}
            </p>
          )}
          <h2 className="font-display text-xl font-extrabold text-ink">
            {summary.answered === 0
              ? 'まだ解いていません'
              : `${summary.finished ? '' : 'ここまでの'}${counts.weak ? `弱点は ${counts.weak}単元` : '弱点の単元はありません'}`}
          </h2>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <Stat value={counts.ok} label="できた単元" className="text-emerald-600" />
            <Stat value={counts.unsure} label="あやふや" className="text-amber-600" />
            <Stat value={counts.weak} label="弱点" className="text-rose-600" />
          </div>
          <p className="mt-3 text-xs font-bold text-ink/50">
            {summary.finished
              ? `${summary.total}単元すべてを解きました。`
              : `${summary.total}単元中 ${summary.answered}単元を解きました。${restUnits ? `残り ${restUnits}単元。` : ''}${counts.pending ? `確かめの問題が ${counts.pending}問あります。` : ''}`}
          </p>
          {summary.isCurrent && !summary.finished && (
            <Button full className="mt-3" onClick={onNextRound} data-grammar-diagnostic-next>
              {summary.answered ? '続きを解く' : '解き始める'} <ArrowRight size={18} />
            </Button>
          )}
          {!summary.isCurrent && (
            <Button full variant="secondary" className="mt-3" onClick={() => onOpenAttempt(null)}>
              {'いまの回の結果へ戻る'}
            </Button>
          )}
        </Card>

        <Card className="p-4">
          <h2 className="font-display text-base font-extrabold text-ink">{'弱点マップ'}</h2>
          <p className="mt-1 text-xs font-bold text-ink/50">{'縦が文法の系統、横が級です。四角1つが1単元。押すと、解いた問題が見られます。'}</p>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-bold text-ink/55">
            {['ok', 'unsure', 'weak', 'todo'].map((key) => (
              <span key={key} className="inline-flex items-center gap-1">
                <span className={cx('h-3 w-3 rounded-[3px]', VERDICT_TONE[key])} />
                {GRAMMAR_DIAGNOSTIC_VERDICTS[key]}
              </span>
            ))}
          </div>
          <div
            className="mt-3 grid items-stretch gap-[3px]"
            style={{ gridTemplateColumns: `minmax(5.5rem, 1.4fr) repeat(${levels.length}, minmax(1.8rem, 1fr))` }}
            data-grammar-diagnostic-map
          >
            <span className="text-[11px] font-bold text-ink/45">{'系統'}</span>
            {levels.map((level) => (
              <span key={level} className="text-center text-[11px] font-bold text-ink/45">{getLevel(level).label}</span>
            ))}
            {summary.strands.map((row) => (
              <StrandRow key={row.strand.id} row={row} levels={levels} summary={summary} selectedKey={selectedKey} onSelect={setSelectedKey} />
            ))}
          </div>
          {selected && (
            <UnitSheet
              unit={selected}
              verdict={summary.verdictOf(selected)}
              answers={summary.unitAnswers(selected)}
              onRead={() => openReference(selected)}
              onTest={() => testUnit(selected)}
            />
          )}
        </Card>

        <Card className="p-4">
          <h2 className="font-display text-base font-extrabold text-ink">{'まず直す単元'}</h2>
          <div className="mt-2 flex gap-2">
            <ListTab active={list === 'weak'} tone="rose" onClick={() => { setList('weak'); setMore(false) }}>{`弱点 ${counts.weak}`}</ListTab>
            <ListTab active={list === 'unsure'} tone="amber" onClick={() => { setList('unsure'); setMore(false) }}>{`あやふや ${counts.unsure}`}</ListTab>
          </div>
          <p className="mt-2 text-xs font-bold text-ink/50">{'易しい級の単元から並べています。下の級の単元を直すと、上の級の同じ系統も解きやすくなります。'}</p>
          <div className="mt-2 space-y-2">
            {shown.map((unit) => (
              <div key={unit.key} className="rounded-2xl border border-slate-200 p-3" data-grammar-diagnostic-unit={unit.key}>
                <p className="text-sm">
                  <span className={cx('mr-1.5 rounded-md px-1.5 py-px text-[11px] font-extrabold', list === 'weak' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-700')}>
                    {getLevel(unit.level).label}
                  </span>
                  <span className="font-extrabold text-ink">{unit.topic}</span>
                </p>
                <p className="mt-0.5 text-[11px] font-bold text-ink/45">{unit.strand.name}</p>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="secondary" className="flex-1" onClick={() => openReference(unit)}>
                    <BookOpen size={15} /> {'参考書で学習'}
                  </Button>
                  <Button size="sm" className="flex-1" onClick={() => testUnit(unit)} data-grammar-diagnostic-test={unit.key}>
                    {'この単元をテスト'}
                  </Button>
                </div>
              </div>
            ))}
            {!rows.length && <p className="text-xs font-bold text-ink/45">{'この欄に入る単元はありません。'}</p>}
          </div>
          {!more && rows.length > LIST_SHOWN && (
            <Button full size="sm" variant="ghost" className="mt-2" onClick={() => setMore(true)}>
              {`残り ${rows.length - LIST_SHOWN}単元も見る`}
            </Button>
          )}
          {list === 'weak' && summary.weak.length > 1 && (
            <Button full className="mt-3" onClick={testWeak} data-grammar-diagnostic-weak-test>
              {`弱点の${summary.weak.length}単元をまとめてテスト`}
            </Button>
          )}
        </Card>

        <AttemptHistory history={history} viewing={summary.attempt} onOpen={onOpenAttempt} />

        <Button full variant="secondary" onClick={onChooseScope}>{'範囲を選んで診断し直す'}</Button>
      </div>
    </div>
  )
}

function Stat({ value, label, className }) {
  return (
    <div className="rounded-xl bg-slate-50 px-2.5 py-2">
      <p className={cx('font-display text-2xl font-extrabold leading-none', className)}>{value}</p>
      <p className="mt-1 text-[11px] font-bold text-ink/50">{label}</p>
    </div>
  )
}

function ListTab({ active, tone, children, ...props }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cx(
        'rounded-full border px-3 py-1 text-xs font-extrabold',
        !active && 'border-slate-200 bg-white text-ink/55',
        active && tone === 'rose' && 'border-rose-300 bg-rose-50 text-rose-600',
        active && tone === 'amber' && 'border-amber-300 bg-amber-50 text-amber-700',
      )}
      {...props}
    >
      {children}
    </button>
  )
}

function StrandRow({ row, levels, summary, selectedKey, onSelect }) {
  const rate = row.rate == null ? null : Math.round(row.rate * 100)
  return (
    <>
      <span className="flex min-w-0 items-center justify-between gap-1 py-0.5 pr-1 text-[11px] font-bold leading-tight text-ink/75">
        <span className="min-w-0">{row.strand.name}</span>
        <span className={cx('shrink-0 tabular-nums', rate != null && rate < 60 ? 'font-extrabold text-rose-500' : 'text-ink/40')}>
          {rate == null ? '–' : `${rate}%`}
        </span>
      </span>
      {levels.map((level) => (
        <span key={level} className="flex min-h-6 flex-wrap content-center justify-center gap-0.5 rounded-md bg-slate-50 p-0.5">
          {row.units.filter((unit) => unit.level === level).map((unit) => {
            const verdict = summary.verdictOf(unit)
            return (
              <button
                key={unit.key}
                type="button"
                aria-label={`${getLevel(unit.level).label} ${unit.topic}：${GRAMMAR_DIAGNOSTIC_VERDICTS[verdict]}`}
                aria-pressed={selectedKey === unit.key}
                data-grammar-diagnostic-cell={unit.key}
                data-verdict={verdict}
                onClick={() => onSelect(unit.key)}
                className={cx('h-3 w-3 rounded-[3px]', VERDICT_TONE[verdict], selectedKey === unit.key && 'ring-2 ring-ink ring-offset-1')}
              />
            )
          })}
        </span>
      ))}
    </>
  )
}

function UnitSheet({ unit, verdict, answers, onRead, onTest }) {
  return (
    <div className="mt-3 space-y-2 rounded-2xl border border-slate-200 p-3" data-grammar-diagnostic-sheet={unit.key}>
      <p className="text-[11px] font-bold text-ink/45">{`${getLevel(unit.level).label}・${unit.strand.name}`}</p>
      <p className="font-extrabold text-ink">
        {unit.topic}
        <span className="ml-2 text-xs font-bold text-ink/50">{GRAMMAR_DIAGNOSTIC_VERDICTS[verdict]}</span>
      </p>
      {!answers.length && <p className="text-xs font-bold text-ink/45">{'まだ解いていません。'}</p>}
      {answers.map(({ id, ok }) => {
        const item = getGrammar(id)
        if (!item) return null
        return (
          <div key={id} className="rounded-xl bg-slate-50 px-3 py-2 text-sm" data-grammar-diagnostic-answer={id}>
            <p className="font-bold text-ink">{item.q}</p>
            <p className="mt-0.5 text-xs font-extrabold">
              <span className={ok ? 'text-emerald-600' : 'text-rose-500'}>{ok ? '○ 正解' : '× まちがい'}</span>
              <span className="ml-2 text-ink/60">{`答え ${item.answer}`}</span>
            </p>
          </div>
        )
      })}
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" className="flex-1" onClick={onRead}><BookOpen size={15} /> {'参考書で学習'}</Button>
        <Button size="sm" className="flex-1" onClick={onTest}>{'この単元をテスト'}</Button>
      </div>
    </div>
  )
}

// 回ごとの成績。新しい回から並べ、同じ範囲の前の回から弱点がいくつ増減したかを添える。押すとその回の結果を開く。
function AttemptHistory({ history, viewing, onOpen }) {
  if (!history.length) return null
  return (
    <Card className="p-4" data-grammar-diagnostic-history>
      <h2 className="font-display text-base font-extrabold text-ink">{'これまでの回'}</h2>
      <p className="mt-1 text-xs font-bold text-ink/50">{'押すと、その回の弱点マップと弱点の一覧が見られます。'}</p>
      <div className="mt-2 space-y-2">
        {history.map((row) => {
          const change = row.previous?.weak ?? null
          return (
            <button
              key={row.attempt}
              type="button"
              aria-pressed={row.attempt === viewing}
              data-grammar-diagnostic-attempt={row.attempt}
              onClick={() => onOpen(row.attempt)}
              className={cx(
                'w-full rounded-2xl border px-3 py-2.5 text-left',
                row.attempt === viewing ? 'border-brand-400 bg-brand-50' : 'border-slate-200 bg-white',
              )}
            >
              <span className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-extrabold text-ink">
                  {`${attemptLabel(row.attempt)}・${grammarDiagnosticScope(row.scope).label}`}
                </span>
                <span className="shrink-0 text-[11px] font-bold text-ink/45">{formatStudyDay(row.day)}</span>
              </span>
              <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs font-bold tabular-nums">
                <span className="text-emerald-600">{`できた ${row.counts.ok}`}</span>
                <span className="text-amber-600">{`あやふや ${row.counts.unsure}`}</span>
                <span className="text-rose-600">{`弱点 ${row.counts.weak}`}</span>
                <span className="text-ink/45">
                  {row.finished ? `${row.total}単元・正答率 ${Math.round((row.rate ?? 0) * 100)}%` : `途中 ${row.answered}/${row.total}単元`}
                </span>
              </span>
              {change != null && row.finished && (
                <span className={cx('mt-0.5 block text-[11px] font-extrabold', change < 0 ? 'text-emerald-600' : change > 0 ? 'text-rose-500' : 'text-ink/45')}>
                  {change === 0 ? `${attemptLabel(row.previous.attempt)}と弱点の数は同じ` : `${attemptLabel(row.previous.attempt)}から弱点 ${change > 0 ? '+' : '−'}${Math.abs(change)}`}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </Card>
  )
}
