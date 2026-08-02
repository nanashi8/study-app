import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import {
  BATTLE_ITEM_FILTERS,
  BATTLE_ITEM_SORTS,
  RELICS,
  heroProgress,
  organizeBattleItems,
  relicBattleAbility,
  relicStatLabel,
} from '../lib/rpg.js'
import {
  BATTLE_THEMES,
  battleThemeById,
} from '../lib/battleThemes.js'
import {
  BATTLE_TRAITS,
  BATTLE_TRAIT_POINT_STARS,
  MAX_BATTLE_TRAIT_LEVEL,
  battleStudentTraitProfile,
  canRaiseBattleTrait,
} from '../lib/battleTraits.js'
import {
  battleStudentById,
  battleStudentPortrait,
} from '../lib/battleCast.js'
import { Check } from './Icons.jsx'
import { cx } from './ui.jsx'

function Toggle({ on, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className={cx(
        'relative h-7 w-12 shrink-0 rounded-full transition-colors',
        on ? 'bg-brand-500' : 'bg-ink/20',
      )}
      aria-label={label}
      aria-pressed={on}
    >
      <span
        className={cx(
          'absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform',
          on ? 'translate-x-5' : 'translate-x-0.5',
        )}
      />
    </button>
  )
}

function GameSettingRow({ title, desc, children, stacked = false }) {
  return (
    <div className={cx('gap-3 py-3', stacked ? 'space-y-2' : 'flex items-center justify-between')}>
      <div className="min-w-0">
        <p className="font-bold text-ink">{title}</p>
        {desc && <p className="text-xs font-bold leading-relaxed text-ink/45">{desc}</p>}
      </div>
      <div className={cx(stacked ? 'w-full' : 'shrink-0')}>{children}</div>
    </div>
  )
}

const BATTLE_ITEM_KIND_STYLE = {
  power: { label: '攻撃', className: 'bg-rose-100 text-rose-700' },
  guard: { label: '防御', className: 'bg-sky-100 text-sky-700' },
  heal: { label: '回復', className: 'bg-emerald-100 text-emerald-700' },
}

export function BattleItemBox({ relics, equippedRelic, nextRelic, onEquip }) {
  const [isOpen, setIsOpen] = useState(false)
  const [filterId, setFilterId] = useState('all')
  const [sortId, setSortId] = useState('acquired')
  const equippedAbility = relicBattleAbility(equippedRelic)
  const organizedRelics = organizeBattleItems(relics, { filterId, sortId })
  const kindCounts = relics.reduce(
    (counts, relic) => {
      const kind = relicBattleAbility(relic)?.kind
      counts.all += 1
      if (kind in counts) counts[kind] += 1
      return counts
    },
    { all: 0, power: 0, guard: 0, heal: 0 },
  )

  return (
    <section
      id="school-battle-item-box"
      className="mt-3 overflow-hidden rounded-2xl border-2 border-violet-100 bg-white shadow-sm"
      aria-labelledby="school-battle-item-box-title"
    >
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="school-battle-item-box-panel"
        aria-label={`アイテムボックスを${isOpen ? '閉じる' : '開く'}。装備中は${equippedRelic.name}`}
        className="flex min-h-16 w-full items-center gap-2.5 px-3 py-2.5 text-left"
      >
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-violet-50 text-2xl" aria-hidden="true">
          {equippedRelic.emoji}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5">
            <span id="school-battle-item-box-title" className="shrink-0 whitespace-nowrap text-[9px] font-extrabold tracking-[0.08em] text-violet-500">
              アイテムボックス
            </span>
            <span className="shrink-0 rounded-full bg-violet-100 px-1.5 py-0.5 text-[8px] font-extrabold text-violet-700">
              {relics.length}/{RELICS.length}
            </span>
          </span>
          <span className="mt-0.5 block truncate text-xs font-extrabold text-ink">{equippedRelic.name}</span>
          <span className="mt-0.5 block truncate text-[9px] font-bold text-ink/45">
            {equippedAbility.short} · 所持効果 {relicStatLabel(equippedRelic)}
          </span>
        </span>
        <span className="shrink-0 text-right text-[9px] font-extrabold text-violet-600">
          <span className="block">整理</span>
          <span aria-hidden="true">{isOpen ? '▲' : '▼'}</span>
        </span>
      </button>

      <p className="border-t border-violet-50 px-3 py-2 text-[9px] font-bold leading-relaxed text-ink/50">
        {equippedAbility.description} 1バトル1回使え、何度使ってもなくなりません。
      </p>

      {isOpen && (
        <div id="school-battle-item-box-panel" className="border-t border-violet-100 bg-violet-50/45 px-2.5 pb-2.5 pt-3">
          <p className="text-[9px] font-extrabold text-ink/50">効果で絞り込む</p>
          <div className="mt-1.5 grid grid-cols-4 gap-1" aria-label="アイテムの効果分類">
            {BATTLE_ITEM_FILTERS.map((filter) => {
              const selected = filter.id === filterId
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setFilterId(filter.id)}
                  aria-pressed={selected}
                  aria-label={`${filter.label}のアイテム ${kindCounts[filter.id]}個`}
                  className={cx(
                    'min-h-11 rounded-xl border px-1 py-1 text-[9px] font-extrabold transition-colors',
                    selected
                      ? 'border-violet-500 bg-violet-600 text-white'
                      : 'border-violet-100 bg-white text-ink/55',
                  )}
                >
                  <span className="block">{filter.label}</span>
                  <span className="block text-[8px] opacity-70">{kindCounts[filter.id]}</span>
                </button>
              )
            })}
          </div>

          <label htmlFor="school-battle-item-sort" className="mt-2.5 flex items-center justify-between gap-2 text-[9px] font-extrabold text-ink/50">
            <span>並び替え</span>
            <select
              id="school-battle-item-sort"
              value={sortId}
              onChange={(event) => setSortId(event.target.value)}
              className="h-11 min-w-32 rounded-xl border border-violet-100 bg-white px-2 text-[10px] font-extrabold text-ink outline-none focus:border-violet-400"
            >
              {BATTLE_ITEM_SORTS.map((sort) => (
                <option key={sort.id} value={sort.id}>{sort.label}</option>
              ))}
            </select>
          </label>

          <p className="mt-2 text-[9px] font-bold text-ink/45" aria-live="polite">
            {organizedRelics.length}個を表示 · 装備中：{equippedRelic.name}
          </p>

          {organizedRelics.length > 0 ? (
            <ul className="mt-1.5 max-h-72 space-y-1.5 overflow-y-auto overscroll-contain pr-0.5" role="list">
              {organizedRelics.map((relic) => {
                const ability = relicBattleAbility(relic)
                const style = BATTLE_ITEM_KIND_STYLE[ability.kind]
                const selected = relic.level === equippedRelic.level
                return (
                  <li key={relic.level}>
                    <button
                      type="button"
                      onClick={() => onEquip(relic.level)}
                      aria-pressed={selected}
                      aria-label={`${relic.name}を次のバトルへ装備。${ability.description}`}
                      className={cx(
                        'grid min-h-16 w-full grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-2 rounded-xl border-2 px-2 py-2 text-left transition-transform active:scale-[0.99]',
                        selected ? 'border-violet-500 bg-white shadow-sm' : 'border-transparent bg-white/80',
                      )}
                    >
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-50 text-xl" aria-hidden="true">{relic.emoji}</span>
                      <span className="min-w-0">
                        <span className="block truncate text-[10px] font-extrabold text-ink">{relic.name}</span>
                        <span className="mt-1 flex min-w-0 items-center gap-1">
                          <span className={cx('shrink-0 rounded-full px-1.5 py-0.5 text-[8px] font-extrabold', style.className)}>{style.label}</span>
                          <span className="truncate text-[8px] font-bold text-ink/45">LV{relic.level} · {ability.short}</span>
                        </span>
                        <span className="mt-0.5 block truncate text-[8px] font-bold text-ink/35">所持効果 {relicStatLabel(relic)}</span>
                      </span>
                      <span className={cx(
                        'inline-flex min-h-8 min-w-12 items-center justify-center gap-0.5 rounded-lg px-1.5 text-[8px] font-extrabold',
                        selected ? 'bg-violet-600 text-white' : 'bg-violet-100 text-violet-700',
                      )}>
                        {selected && <Check size={12} />}
                        {selected ? '装備中' : '装備'}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="mt-2 rounded-xl bg-white px-3 py-4 text-center text-[10px] font-bold text-ink/45">
              この種類のアイテムはまだありません。
            </p>
          )}

          <p className="mt-2 text-center text-[8px] font-bold text-ink/40">
            {nextRelic
              ? `次のアイテムはLV${nextRelic.level}で入手：${nextRelic.name}`
              : '学校アイテムをすべて入手済みです'}
          </p>
        </div>
      )}
    </section>
  )
}

function BattleThemeSettings({ battleStars, selectedTheme, onSelect }) {
  return (
    <section className="mt-4" aria-label="対決演出設定">
      <h3 className="font-display text-sm font-extrabold text-ink">対決演出</h3>
      <p className="mt-1 text-xs font-bold leading-relaxed text-ink/50">
        放課後スターで解放した演出から、次のバトルに使うものを選びます。
      </p>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {BATTLE_THEMES.map((theme) => {
          const unlocked = battleStars >= theme.unlockAt
          const selected = theme.id === selectedTheme.id
          return (
            <button
              key={theme.id}
              type="button"
              disabled={!unlocked}
              onClick={() => onSelect(theme.id)}
              aria-pressed={selected}
              aria-label={unlocked ? `${theme.name}を選ぶ` : `${theme.name}は放課後スター${theme.unlockAt}で解放`}
              className={cx(
                'overflow-hidden rounded-xl border-2 bg-white text-left transition-transform active:scale-95',
                selected ? 'border-violet-500 shadow-sm' : 'border-slate-100',
                !unlocked && 'opacity-55',
              )}
            >
              <span className="relative block h-16 overflow-hidden bg-slate-900">
                <img src={theme.preview} alt="" className="h-full w-full object-cover object-top [image-rendering:pixelated]" />
                {!unlocked && <span className="absolute inset-0 grid place-items-center bg-slate-950/60 text-lg">🔒</span>}
              </span>
              <span className="block truncate px-2 pt-1.5 text-[9px] font-extrabold text-ink">{theme.shortName}</span>
              <span className="block px-2 pb-2 text-[8px] font-bold text-ink/40">
                {unlocked ? (selected ? '選択中' : '解放済み') : `✦ ${theme.unlockAt}`}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function BattleTraitSettings({ student, battleStars, investments, onRaise, onReset }) {
  const profile = battleStudentTraitProfile(student.id, investments, battleStars)
  return (
    <section className="mt-4 rounded-2xl border border-violet-100 bg-violet-50/45 p-3" aria-label="星彩パラメータ設定">
      <div className="flex items-center gap-3">
        <img
          src={battleStudentPortrait(student.id, 'confident')}
          alt={`${student.name}の自信の表情`}
          className="h-14 w-14 shrink-0 rounded-xl bg-slate-900 object-cover [image-rendering:pixelated]"
        />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-sm font-extrabold text-ink">同行中：{student.name}</h3>
          <p className="mt-0.5 text-[10px] font-bold text-violet-600">発現色：{profile.colorLabel}</p>
          <p className="mt-1 text-[10px] font-bold leading-relaxed text-ink/45">
            同行者の変更はバトル後の戦果画面だけで行います。
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 rounded-xl bg-white px-2.5 py-2">
        <p className="text-[10px] font-extrabold text-ink/55">星彩ポイント</p>
        <p className="text-xs font-extrabold text-violet-700">{profile.summary.available}/{profile.summary.budget} pt</p>
      </div>

      <div className="mt-2 grid grid-cols-5 gap-1.5">
        {BATTLE_TRAITS.map((trait) => {
          const level = profile.levels[trait.id]
          const canRaise = canRaiseBattleTrait({
            battleStars,
            investments,
            studentId: student.id,
            traitId: trait.id,
          })
          return (
            <button
              key={trait.id}
              type="button"
              disabled={!canRaise}
              onClick={() => onRaise(student.id, trait.id)}
              aria-label={`${student.name}の${trait.name}をレベル${level}から上げる`}
              className="min-h-16 min-w-0 rounded-xl border border-white bg-white px-1 py-1.5 text-center transition-transform enabled:active:scale-95 disabled:opacity-55"
            >
              <span className="block text-base">{trait.emoji}</span>
              <strong className="block truncate text-[8px] text-ink">{trait.name}</strong>
              <span className="block text-[8px] font-black text-ink/50">LV{level}{level < MAX_BATTLE_TRAIT_LEVEL ? ' ＋' : ''}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <p className="text-[9px] font-bold leading-relaxed text-ink/40">
          ✦ {BATTLE_TRAIT_POINT_STARS}で1pt。学習評価は変わりません。
        </p>
        {profile.investedTotal > 0 && (
          <button
            type="button"
            onClick={() => onReset(student.id)}
            className="min-h-10 shrink-0 rounded-xl bg-white px-3 text-[9px] font-extrabold text-violet-700"
          >
            振り直す
          </button>
        )}
      </div>
    </section>
  )
}

export function GameSettingsPanel() {
  const settings = useStore((state) => state.settings)
  const setSetting = useStore((state) => state.setSetting)
  const stats = useStore((state) => state.stats)
  const battleRelicLevel = useStore((state) => state.battleRelicLevel)
  const setBattleRelicLevel = useStore((state) => state.setBattleRelicLevel)
  const battleStars = useStore((state) => state.battleStars)
  const battleThemeId = useStore((state) => state.battleThemeId)
  const setBattleThemeId = useStore((state) => state.setBattleThemeId)
  const battleStudentId = useStore((state) => state.battleStudentId)
  const battleTraitInvestments = useStore((state) => state.battleTraitInvestments)
  const raiseBattleTrait = useStore((state) => state.raiseBattleTrait)
  const resetBattleStudentTraits = useStore((state) => state.resetBattleStudentTraits)
  const hero = heroProgress(stats.xp)
  const equippedRelic = hero.relics.find((relic) => relic.level === battleRelicLevel)
    ?? hero.relics.at(-1)
  const selectedTheme = battleThemeById(battleThemeId, battleStars)
  const student = battleStudentById(battleStudentId)
  const battleUiMode = settings.battleUiMode === 'simple' ? 'simple' : 'gaming'

  return (
    <section aria-label="ゲーム設定">
      <GameSettingRow
        title="バトル画面"
        desc="情報優先の簡易画面と、演出を含むゲーミング画面を切り替え"
        stacked
      >
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'simple', label: '簡易UI', desc: 'HP・ターンを優先' },
            { id: 'gaming', label: 'ゲーミングUI', desc: 'ステージ演出を表示' },
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              data-battle-ui-mode-choice={mode.id}
              onClick={() => setSetting('battleUiMode', mode.id)}
              aria-pressed={battleUiMode === mode.id}
              className={cx(
                'min-h-14 rounded-xl border-2 px-2 py-2 text-left transition-colors',
                battleUiMode === mode.id
                  ? 'border-violet-500 bg-violet-50 text-violet-800'
                  : 'border-slate-100 bg-white text-ink/55',
              )}
            >
              <strong className="block text-xs font-extrabold">{mode.label}</strong>
              <span className="block text-[9px] font-bold opacity-65">{mode.desc}</span>
            </button>
          ))}
        </div>
      </GameSettingRow>

      <section data-game-bgm-control>
        <h3 className="pt-2 font-display text-sm font-extrabold text-ink">
          放課後と魔法の言葉 BGM
        </h3>
        <p className="mt-1 text-xs font-bold leading-relaxed text-ink/50">
          日常・ことばの対決・先生戦・結果で切り替わります。通常の単語・文法・長文など学習画面では鳴りません。
        </p>
        <div className="divide-y divide-brand-50">
          <GameSettingRow title="ゲームBGMを再生" desc="ゲーム画面で最初に操作した後から再生">
            <Toggle
              label="ゲームBGMを再生"
              on={settings.bgmEnabled !== false}
              onChange={(value) => setSetting('bgmEnabled', value)}
            />
          </GameSettingRow>
          <GameSettingRow title="BGM音量" desc={`現在 ${Math.round((settings.bgmVolume ?? 0.35) * 100)}%`} stacked>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.bgmVolume ?? 0.35}
              onChange={(event) => setSetting('bgmVolume', Number(event.target.value))}
              aria-label="BGM音量"
              className="w-full accent-brand-500"
            />
          </GameSettingRow>
        </div>
      </section>

      <BattleThemeSettings
        battleStars={battleStars}
        selectedTheme={selectedTheme}
        onSelect={setBattleThemeId}
      />

      <BattleItemBox
        relics={hero.relics}
        equippedRelic={equippedRelic}
        nextRelic={hero.nextRelic}
        onEquip={setBattleRelicLevel}
      />

      <BattleTraitSettings
        student={student}
        battleStars={battleStars}
        investments={battleTraitInvestments}
        onRaise={raiseBattleTrait}
        onReset={resetBattleStudentTraits}
      />
    </section>
  )
}
