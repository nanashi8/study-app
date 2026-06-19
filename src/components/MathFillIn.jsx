import { MathBlock, MathInline, MathText } from './MathText.jsx'
import { Refresh } from './Icons.jsx'
import { cx } from './ui.jsx'

const CIRCLED = ['①', '②', '③', '④', '⑤']

// 作業式の \square を順に値で置き換えて完成形の KaTeX を作る。
export function resolveFill(fill, values) {
  const parts = fill.tex.split('\\square')
  return parts
    .map((s, k) => s + (k < parts.length - 1 ? `{${values[k] ?? '\\square'}}` : ''))
    .join('')
}

// 穴埋め（タップ式）。空所スロットにタイルを入れて式を完成させる。
// 状態（placed / result）は親が持ち、ここは表示と操作だけ。
//  - bank:   [{ id, label }]（シャッフル済みタイル）
//  - placed: スロット順に入れた bank.id の配列
//  - result: null | { perBlank: bool[] }
export function MathFillIn({ fill, bank, placed, result, onAdd, onRemove, onClear }) {
  const labelOf = (id) => bank.find((b) => b.id === id)?.label ?? ''
  const placedSet = new Set(placed)
  const available = bank.filter((b) => !placedSet.has(b.id))
  // 表示式：答え合わせ後は正解で埋めた完成形、作業中は □ のまま。
  const shownTex = result ? resolveFill(fill, fill.blanks) : fill.tex

  return (
    <div className="mt-4">
      <p className="mb-2 px-1 font-extrabold text-ink/80"><MathText>{fill.ask}</MathText></p>

      {/* 作業中の式（□が空所） */}
      <div className="rounded-2xl bg-white p-4 text-center shadow-card">
        <MathBlock tex={shownTex} className="text-ink [&_.katex]:text-[1.35rem]" />
      </div>

      {/* 空所スロット（左の□から順に①②…） */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        {fill.blanks.map((_, k) => {
          const id = placed[k]
          const has = id !== undefined
          const ok = result?.perBlank[k]
          return (
            <button
              key={k}
              disabled={!!result || !has}
              onClick={() => onRemove(k)}
              className={cx(
                'inline-flex min-w-[3.25rem] items-center justify-center gap-1 rounded-xl border-2 px-3 py-2 font-bold transition-all',
                !has && 'border-dashed border-violet-200 text-ink/25',
                has && !result && 'border-violet-400 bg-violet-500 text-white active:scale-95',
                result && ok && 'border-emerald-400 bg-correct-soft text-emerald-700',
                result && ok === false && 'border-rose-400 bg-wrong-soft text-rose-600',
              )}
            >
              <span className="text-[10px] opacity-60">{CIRCLED[k]}</span>
              {has ? <MathInline tex={labelOf(id)} /> : <span>□</span>}
            </button>
          )
        })}
      </div>

      {/* タイル */}
      {!result && (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          {available.map((b) => (
            <button
              key={b.id}
              onClick={() => onAdd(b.id)}
              className="rounded-xl bg-white px-3.5 py-2 font-bold text-ink shadow-card ring-1 ring-violet-100 transition-transform active:scale-95 active:bg-violet-50"
            >
              <MathInline tex={b.label} />
            </button>
          ))}
          {placed.length > 0 && (
            <button
              onClick={onClear}
              className="px-2 py-2 text-sm font-extrabold text-ink/40 active:text-ink/60"
            >
              <Refresh size={16} className="inline" /> やり直す
            </button>
          )}
        </div>
      )}
    </div>
  )
}
