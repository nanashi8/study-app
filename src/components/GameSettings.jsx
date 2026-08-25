export function GameSettingsPanel() {
  return (
    <section aria-label="龍脈調査の設定">
      <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-cyan-50 p-3">
        <p className="text-xs font-extrabold tracking-[0.12em] text-violet-600">DRAGON VEIN RESEARCH</p>
        <h3 className="mt-1 font-display text-sm font-extrabold text-ink">龍脈解読の表示</h3>
        <p className="mt-1 text-xs font-bold leading-relaxed text-ink/50">
          生徒の思考や表情、先生からの専門的な手掛かりを表示します。対戦・攻撃・HPの演出はありません。
        </p>
      </div>

      <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold leading-relaxed text-ink/45">
        龍脈調査の表示は、正答率・復習記録・診断の結果を変更しません。
      </p>
    </section>
  )
}
