import { LEVELS } from '../data/levels.js'
import { ScreenHeader } from './AppShell.jsx'
import { Chip } from './ui.jsx'
import { ArrowRight, Bookmark } from './Icons.jsx'

/** リスニング/ディクテーション/発音採点で使い回す級選択。
 *  countFor(levelId) -> 件数 / detailFor(levelId) -> 級別の補足 */
export function LevelPicker({
  title,
  subtitle,
  accent = '#6366f1',
  levels = LEVELS,
  countFor,
  countUnit = '語',
  detailFor,
  onPick,
  myListCount = 0,
  onMyList,
  note,
}) {
  return (
    <div className="pb-6">
      <ScreenHeader title={title} subtitle={subtitle} color={accent} />
      <div className="space-y-3 px-4">
        {note && (
          <p className="rounded-2xl bg-brand-50 px-4 py-3 text-xs font-bold leading-relaxed text-brand-700">{note}</p>
        )}

        {myListCount > 0 && onMyList && (
          <button
            onClick={onMyList}
            className="flex w-full items-center gap-3 rounded-2xl bg-hint-soft p-3 text-left active:scale-[0.98] transition-transform"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-hint/20 text-hint">
              <Bookmark size={20} />
            </span>
            <div className="flex-1">
              <div className="text-sm font-extrabold text-amber-900">マイ単語で挑戦</div>
              <div className="text-[11px] font-bold text-amber-800/70">{myListCount}語</div>
            </div>
            <ArrowRight size={18} className="text-amber-600" />
          </button>
        )}

        {levels.map((l) => {
          const n = countFor ? countFor(l.id) : 0
          const detail = detailFor?.(l.id)
          return (
            <button
              key={l.id}
              disabled={!n}
              onClick={() => onPick(l.id, l.label)}
              className="flex w-full items-center gap-3 rounded-2xl bg-white p-3.5 text-left shadow-card active:scale-[0.98] transition-transform disabled:opacity-45 disabled:active:scale-100"
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl"
                style={{ backgroundColor: `${l.color}22` }}
              >
                {l.emoji}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-display text-lg font-extrabold text-ink">英検{l.label}</span>
                  <Chip color={l.color}>{l.cefr}</Chip>
                </div>
                <div className="text-xs font-bold text-ink/50">{l.sub}・{n}{countUnit}</div>
                {detail && <div className="mt-1 text-[11px] font-bold leading-snug text-ink/40">{detail}</div>}
              </div>
              <ArrowRight size={20} className="text-brand-400" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
