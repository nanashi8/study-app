// 単語まわりの再利用パーツ：品詞バッジ・語源分解・語源つながり。
import {
  ETYMOLOGY_MODE_META,
  getEtymologyPack,
  getRoot,
  relatedByEtymology,
} from '../data/vocab.js'
import { Lightbulb, ArrowRight } from './Icons.jsx'
import { cx } from './ui.jsx'

const POS_COLORS = {
  動: '#6366f1', 名: '#0ea5e9', 形: '#f59e0b', 副: '#10b981',
  前: '#8b5cf6', 接: '#ec4899', 代: '#14b8a6',
}

export function PosBadge({ pos, className = '' }) {
  const color = POS_COLORS[pos] ?? '#6366f1'
  return (
    <span
      className={cx('inline-flex h-6 min-w-6 items-center justify-center rounded-md px-1.5 text-xs font-extrabold', className)}
      style={{ backgroundColor: `${color}1f`, color }}
    >
      {pos}
    </span>
  )
}

// 語源パーツの色分け（接頭辞/語根/接尾辞/語幹）。
const KIND_STYLE = {
  prefix: { bg: 'bg-amber-100', text: 'text-amber-700', label: '接頭辞' },
  root: { bg: 'bg-brand-100', text: 'text-brand-700', label: '語根' },
  suffix: { bg: 'bg-slate-100', text: 'text-slate-600', label: '接尾辞' },
  stem: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: '語幹' },
}

/** 指定した語根が、単語の語源パーツとして明示的に分解されているか。 */
export function hasRootBreakdown(word, rootId) {
  return (word?.etymology?.parts ?? []).some((p) => p.kind === 'root' && p.root === rootId)
}

/**
 * 接頭辞＋語根＋接尾辞 → 現在の意味、という「意味の式」。
 * 語根ページや関連語一覧では、単語名と訳だけでなく推測の手掛かりも並べる。
 */
export function EtymologyFormula({ word, rootId, compact = false }) {
  const parts = word?.etymology?.parts ?? []
  if (!parts.length || (rootId && !hasRootBreakdown(word, rootId))) return null

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {parts.map((p, i) => {
        const st = KIND_STYLE[p.kind] ?? KIND_STYLE.stem
        return (
          <span key={`${p.t}-${i}`} className="contents">
            <span
              className={cx(
                'inline-flex items-baseline gap-1 rounded-lg px-2 py-1',
                st.bg,
                st.text,
              )}
            >
              <span className={cx('font-display font-extrabold', compact ? 'text-xs' : 'text-sm')}>
                {p.t}
              </span>
              {p.gloss && (
                <span className={cx('font-bold opacity-75', compact ? 'text-[10px]' : 'text-[11px]')}>
                  {p.gloss}
                </span>
              )}
            </span>
            {i < parts.length - 1 && <span className="text-xs font-black text-ink/25">＋</span>}
          </span>
        )
      })}
      <span className="text-xs font-black text-brand-300">→</span>
      <span className={cx(
        'rounded-lg bg-white px-2 py-1 font-extrabold text-ink ring-1 ring-brand-100',
        compact ? 'text-[11px]' : 'text-xs',
      )}>
        {word.meanings?.slice(0, 2).join('・') || word.meaning}
      </span>
    </div>
  )
}

/** 単語を接頭辞＋語根＋接尾辞に分解して見せる。語根はタップで語源詳細へ。 */
export function EtymologyParts({ parts = [], onRoot }) {
  return (
    <div className="flex flex-wrap items-stretch gap-1.5">
      {parts.map((p, i) => {
        const st = KIND_STYLE[p.kind] ?? KIND_STYLE.stem
        const tappable = p.kind === 'root' && p.root && onRoot
        return (
          <div key={i} className="flex items-center gap-1.5">
            <button
              disabled={!tappable}
              onClick={tappable ? () => onRoot(p.root) : undefined}
              className={cx(
                'flex min-w-14 flex-col items-center rounded-2xl px-3 py-2 text-center',
                st.bg, st.text,
                tappable && 'ring-2 ring-brand-300 active:scale-95 transition-transform',
              )}
            >
              <span className="font-display text-base font-extrabold leading-none">{p.t}</span>
              {p.gloss && <span className="mt-1 text-[11px] font-bold opacity-80">{p.gloss}</span>}
              <span className="mt-0.5 text-[9px] font-bold uppercase opacity-50">{st.label}</span>
            </button>
            {i < parts.length - 1 && <span className="text-lg font-black text-ink/30">+</span>}
          </div>
        )
      })}
    </div>
  )
}

/** 語源ブロック：全語の濃縮ルート + 分解 + 由来ストーリー + 出典。 */
export function EtymologyBlock({ word, onRoot, onPack }) {
  const ety = word.etymology
  if (!ety) return null
  const profile = word.compression
  const pack = profile ? getEtymologyPack(profile.packId) : null
  const mode = profile ? ETYMOLOGY_MODE_META[profile.mode] : null
  const compressionBody = profile && pack && (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
        {mode.emoji}
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block text-[10px] font-extrabold uppercase tracking-wide text-brand-400">
          この語の濃縮ルート
        </span>
        <span className="block truncate text-sm font-extrabold text-brand-700">
          {mode.label}・{profile.size > 1 ? `${profile.size}語を1束で` : '1語を部品へ圧縮'}
        </span>
      </span>
      {onPack && <ArrowRight size={17} className="shrink-0 text-brand-400" />}
    </>
  )
  return (
    <div className="space-y-3">
      {compressionBody && (
        onPack ? (
          <button
            type="button"
            onClick={() => onPack(profile.packId, profile)}
            className="flex w-full items-center gap-2 rounded-2xl bg-brand-50 p-2.5 ring-1 ring-brand-100 active:bg-brand-100"
          >
            {compressionBody}
          </button>
        ) : (
          <div className="flex items-center gap-2 rounded-2xl bg-brand-50 p-2.5 ring-1 ring-brand-100">
            {compressionBody}
          </div>
        )
      )}
      {ety.parts?.length > 0 && (
        <div className="space-y-2">
          <p className="px-1 text-[11px] font-extrabold text-ink/45">
            パーツの意味を前から足してみよう
          </p>
          <EtymologyParts parts={ety.parts} onRoot={onRoot} />
          <div className="flex flex-wrap items-center gap-2 rounded-xl bg-brand-50 px-3 py-2">
            <span className="text-xs font-black text-brand-400">→</span>
            <span className="text-[11px] font-bold text-ink/45">現在の意味</span>
            <span className="font-extrabold text-ink">
              {word.meanings?.slice(0, 2).join('・') || word.meaning}
            </span>
          </div>
        </div>
      )}
      {ety.note && (
        <div className="flex gap-2 rounded-2xl bg-hint-soft/70 p-3">
          <span className="mt-0.5 shrink-0 text-hint">
            <Lightbulb size={18} />
          </span>
          <p className="text-sm font-bold leading-relaxed text-amber-900/90">{ety.note}</p>
        </div>
      )}
      {ety.origin && (
        <p className="px-1 text-xs font-bold text-ink/45">語源：{ety.origin}</p>
      )}
    </div>
  )
}

/** 語源でつながる単語（同じ語根を持つ語）。タップで詳細へ。 */
export function RelatedWords({ word, onPick }) {
  const related = relatedByEtymology(word)
  if (!related.length) return null
  // 語根ごとにまとめる
  const byRoot = {}
  for (const r of related) {
    ;(byRoot[r.via] ??= []).push(r.word)
  }
  return (
    <div className="space-y-3">
      {Object.entries(byRoot).map(([rootId, words]) => {
        const root = getRoot(rootId)
        const ordered = [...words].sort(
          (a, b) => Number(hasRootBreakdown(b, rootId)) - Number(hasRootBreakdown(a, rootId)),
        )
        return (
          <div key={rootId}>
            <div className="mb-1.5 flex items-center gap-1.5 px-1">
              <span className="text-base">{root?.emoji}</span>
              <span className="font-display text-sm font-extrabold text-brand-700">
                {root?.form}
              </span>
              <span className="text-xs font-bold text-ink/45">＝{root?.meaning}</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {ordered.map((w) => (
                <button
                  key={w.id}
                  onClick={() => onPick?.(w.id)}
                  className="w-full rounded-2xl bg-white p-2.5 text-left shadow-sm active:bg-brand-50"
                >
                  <div className="flex items-center gap-2">
                    <PosBadge pos={w.pos} />
                    <div className="min-w-0 flex-1">
                      <div className="font-display font-extrabold text-ink">{w.word}</div>
                      {!hasRootBreakdown(w, rootId) && (
                        <div className="truncate text-xs font-bold text-ink/55">{w.meaning}</div>
                      )}
                    </div>
                    <span className="text-brand-400">
                      <ArrowRight size={18} />
                    </span>
                  </div>
                  {hasRootBreakdown(w, rootId) ? (
                    <div className="mt-2 pl-8">
                      <EtymologyFormula word={w} rootId={rootId} compact />
                    </div>
                  ) : (
                    w.etymology?.note && (
                      <p className="mt-1.5 line-clamp-2 pl-8 text-[11px] font-bold leading-relaxed text-ink/45">
                        {w.etymology.note}
                      </p>
                    )
                  )}
                </button>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
