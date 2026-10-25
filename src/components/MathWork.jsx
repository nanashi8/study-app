import { fillLineIndexes, fillTex, judgeLine, solvedTex, tileOrder, workLinesDone } from '../lib/mathWork.js'
import { ChoiceExplanations } from './ChoiceExplanations.jsx'
import { MathBlock, MathInline, MathText } from './MathText.jsx'
import { Check, Lightbulb, Refresh } from './Icons.jsx'
import { cx } from './ui.jsx'

// 計算の経過の穴埋め（lib/mathWork.js）。誘導問題と入試演習で同じ部品を使う。
//   解いた行は消えずに上へ積み上がり、式の経過を続けて読める。いまの行だけ空所①②…とタイルを出す。
//   考え方は行ごとのヒントボタンを押したときだけ開く。答え合わせで空所ごとに○×、まちがえたタイルは
//   どんな計算・勘ちがいでその値になるかを出して入れ直させる。答え合わせのあと（reviewed）は全行の考え方と全タイルの説明。
//
// state[行] = { placed: [タイルの教材の番号], tries: [[○×…], …], solved, hint }（親が持つ）。
export function MathWorkSteps({ problemId, lines, state = {}, onPlace, onRemove, onClear, onCheck, onHint, reviewed = false }) {
  const fills = fillLineIndexes(lines)
  const done = workLinesDone(lines, state)
  const current = reviewed ? null : fills[done] ?? null
  // いまの行までを出す（答え合わせのあとは全行）。
  const shownUntil = reviewed || current === null ? lines.length : current + 1

  return (
    <section className="mt-3 rounded-2xl bg-white p-3.5 shadow-card" aria-label="計算の経過" data-math-work>
      <p className="text-[11px] font-extrabold text-violet-700">
        {reviewed ? '計算の経過' : `計算の経過（空所のある行 ${Math.min(done + 1, fills.length)}/${fills.length}）`}
      </p>
      <ol className="mt-1.5 space-y-2">
        {lines.slice(0, shownUntil).map((line, lineIndex) => {
          if (line.given) {
            return (
              <li key={lineIndex} data-math-work-given={lineIndex}>
                <MathBlock tex={line.tex} className="overflow-x-auto text-left text-ink [&_.katex]:text-[1.1rem]" />
              </li>
            )
          }
          const lineState = state[lineIndex] ?? {}
          if (lineIndex !== current) {
            return (
              <li key={lineIndex} data-math-work-solved={lineIndex}>
                <MathBlock tex={solvedTex(line)} className="overflow-x-auto text-left text-ink [&_.katex]:text-[1.1rem]" />
              </li>
            )
          }
          return (
            <li key={lineIndex}>
              <CurrentLine
                problemId={problemId}
                line={line}
                lineIndex={lineIndex}
                lineState={lineState}
                onPlace={onPlace}
                onRemove={onRemove}
                onClear={onClear}
                onCheck={onCheck}
                onHint={onHint}
              />
            </li>
          )
        })}
      </ol>
      {/* 解き終わりのあとは、経過を続けて読めるように式を並べてから、行ごとの考え方と全タイルの説明を出す。 */}
      {reviewed && (
        <div className="mt-3 space-y-3 border-t border-violet-100 pt-3" data-math-work-reviews>
          <p className="text-[11px] font-extrabold text-violet-700">行ごとの考え方とタイルの説明</p>
          {fills.map((lineIndex) => (
            <ReviewedLine key={lineIndex} line={lines[lineIndex]} lineIndex={lineIndex} lineState={state[lineIndex] ?? {}} problemId={problemId} />
          ))}
        </div>
      )}
    </section>
  )
}

function CurrentLine({ problemId, line, lineIndex, lineState, onPlace, onRemove, onClear, onCheck, onHint }) {
  const placed = lineState.placed ?? []
  // 答え合わせのあと入れ直すまでは（入れたタイルが前の答え合わせと同じ間は）、○×の色を残す。
  const lastTry = lineState.tries?.at(-1) ?? null
  const lastPlaced = lineState.placedHistory?.at(-1) ?? null
  const unchanged = lastPlaced && lastPlaced.length === placed.length && lastPlaced.every((tileIndex, slot) => tileIndex === placed[slot])
  const marks = lastTry && unchanged ? lastTry : []
  const order = tileOrder(problemId, lineIndex, line.tiles.length)
  const used = new Set(placed)
  const full = placed.length === line.blanks.length
  const wrongTiles = marks.length ? placed.filter((tileIndex, slot) => marks[slot] === false) : []

  return (
    <div className="rounded-2xl border-2 border-violet-200 bg-violet-50/40 p-3" data-math-work-current={lineIndex}>
      <MathBlock
        tex={fillTex(line.tex, placed.map((tileIndex) => line.tiles[tileIndex]?.label), marks)}
        className="overflow-x-auto text-left text-ink [&_.katex]:text-[1.25rem]"
      />

      {lineState.hint ? (
        <div className="mt-2 flex gap-2 rounded-xl bg-hint-soft px-3 py-2 text-sm font-bold leading-relaxed text-amber-950/85" data-math-work-hint>
          <Lightbulb size={16} className="mt-0.5 shrink-0 text-amber-600" />
          <span className="min-w-0 flex-1">
            <span className="mr-1 text-[11px] font-extrabold text-amber-700">考え方</span>
            <MathText>{line.why}</MathText>
          </span>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => onHint?.(lineIndex)}
          className="mt-2 inline-flex min-h-9 items-center gap-1 rounded-full border-2 border-dashed border-amber-300 px-3 text-xs font-extrabold text-amber-800 active:scale-[0.98]"
          data-math-work-hint-button
        >
          <Lightbulb size={14} /> ヒント：考え方を見る
        </button>
      )}

      {/* 空所①②…。押すと入れたタイルを外す。 */}
      <div className="mt-3 flex flex-wrap items-center gap-2" data-math-work-slots>
        {line.blanks.map((_, slot) => {
          const tileIndex = placed[slot]
          const has = tileIndex !== undefined
          const mark = marks[slot]
          return (
            <button
              key={slot}
              type="button"
              disabled={!has}
              onClick={() => onRemove?.(lineIndex, slot)}
              data-math-work-slot={slot}
              className={cx(
                'inline-flex min-h-11 min-w-[3.25rem] items-center justify-center gap-1 rounded-xl border-2 px-3 py-1.5 font-bold transition-all',
                !has && 'border-dashed border-violet-200 text-ink/30',
                has && mark === undefined && 'border-violet-400 bg-violet-500 text-white active:scale-95',
                mark === true && 'border-emerald-400 bg-correct-soft text-emerald-700',
                mark === false && 'border-rose-400 bg-wrong-soft text-rose-600',
              )}
            >
              <span className="text-[10px] opacity-60">{['①', '②', '③'][slot]}</span>
              {has ? <MathInline tex={line.tiles[tileIndex].label} /> : <span>□</span>}
            </button>
          )
        })}
      </div>

      {/* まちがえたタイルは、どんな計算・勘ちがいでその値になるかを出す。 */}
      {wrongTiles.length > 0 && (
        <div className="mt-2 space-y-1.5" data-math-work-wrong>
          {wrongTiles.map((tileIndex) => (
            <p key={tileIndex} className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-bold leading-relaxed text-rose-900/85">
              <MathInline tex={line.tiles[tileIndex].label} className="mr-1.5" />
              <MathText>{line.tiles[tileIndex].note}</MathText>
            </p>
          ))}
          <p className="px-1 text-[11px] font-bold text-rose-700/80">{'×の空所を押して外し、入れ直そう。'}</p>
        </div>
      )}

      {/* タイル */}
      <div className="mt-3 flex flex-wrap items-center gap-2" data-math-work-tiles>
        {order.map((tileIndex) => (
          <button
            key={tileIndex}
            type="button"
            disabled={used.has(tileIndex) || full}
            onClick={() => onPlace?.(lineIndex, tileIndex)}
            data-math-work-tile={tileIndex}
            className={cx(
              'min-h-11 rounded-xl bg-white px-3.5 py-1.5 font-bold text-ink shadow-card ring-1 ring-violet-100 transition-transform active:scale-95 active:bg-violet-50',
              used.has(tileIndex) && 'opacity-30',
              !used.has(tileIndex) && full && 'opacity-60',
            )}
          >
            <MathInline tex={line.tiles[tileIndex].label} />
          </button>
        ))}
        {placed.length > 0 && (
          <button
            type="button"
            onClick={() => onClear?.(lineIndex)}
            className="min-h-11 px-2 text-sm font-extrabold text-ink/45 active:text-ink/60"
          >
            <Refresh size={16} className="inline" /> 外す
          </button>
        )}
      </div>

      <button
        type="button"
        disabled={!full || marks.length > 0}
        onClick={() => onCheck?.(lineIndex)}
        data-math-work-check
        className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-2xl bg-violet-600 px-4 text-sm font-extrabold text-white transition-transform active:scale-[0.99] disabled:bg-violet-200"
      >
        <Check size={16} /> {full ? 'この行を答え合わせ' : `この行を答え合わせ（あと${line.blanks.length - placed.length}つ）`}
      </button>
    </div>
  )
}

function ReviewedLine({ line, lineIndex, lineState, problemId }) {
  const chosen = new Set((lineState.placedHistory ?? []).flat())
  const order = tileOrder(problemId, lineIndex, line.tiles.length)
  return (
    <div className="space-y-1.5" data-math-work-review={lineIndex}>
      <MathBlock tex={solvedTex(line)} className="overflow-x-auto text-left text-ink [&_.katex]:text-[1rem]" />
      <p className="rounded-xl bg-hint-soft px-3 py-2 text-xs font-bold leading-relaxed text-amber-950/85">
        <span className="mr-1 text-[11px] font-extrabold text-amber-700">考え方</span>
        <MathText>{line.why}</MathText>
      </p>
      <ChoiceExplanations
        title={`タイルの説明（${line.tiles.length}枚すべて）`}
        name={`math-work-${lineIndex}`}
        renderText={(text) => <MathText>{text}</MathText>}
        rows={order.map((tileIndex) => ({
          id: String(tileIndex),
          heading: <MathInline tex={line.tiles[tileIndex].label} />,
          body: line.tiles[tileIndex].note,
          correct: line.tiles[tileIndex].blank !== null,
          chosen: chosen.has(tileIndex),
        }))}
      />
    </div>
  )
}
