// 画面下部の枠（読み上げ・出題・単語帳）の一時状態。学習の記録ではないので保存しない。
//   wordBookButtons … いまの画面に出ている単語帳ボタンの数。1つ以上あれば、下部に「単語帳」（登録先）を出す
//   notice          … 単語帳ボタンを押した結果（入れた・外した・入らない）。下部の「単語帳」に少しのあいだ出す
//   settings        … 単語帳の設定（登録先を選ぶ窓）を開いているか。pending は、単語帳がないときに押した項目
//                     （設定で単語帳を作ったら、そこへ入れる）
const EMPTY = Object.freeze({ wordBookButtons: 0, notice: null, settings: null })

let state = EMPTY
let noticeSequence = 0
const listeners = new Set()

function update(patch) {
  state = Object.freeze({ ...state, ...patch })
  listeners.forEach((listener) => listener())
}

export const getStudyDockSnapshot = () => state
// このアプリはブラウザだけで描く。サーバー描画（テストで画面を描いて確かめるとき）も、いまの状態で描く。
export const getStudyDockServerSnapshot = () => state

export function subscribeStudyDock(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** 単語帳ボタンが画面に出たことを知らせる。返す関数で、ボタンが消えたことを知らせる。 */
export function registerWordBookButton() {
  update({ wordBookButtons: state.wordBookButtons + 1 })
  let registered = true
  return () => {
    if (!registered) return
    registered = false
    update({ wordBookButtons: Math.max(0, state.wordBookButtons - 1) })
  }
}

/** 単語帳ボタンの結果を下部の「単語帳」に出す。tone は ok（入れた・外した）か warn（入らない）。 */
export function announceWordBook(text, tone = 'ok') {
  if (!text) return
  noticeSequence += 1
  update({ notice: Object.freeze({ id: noticeSequence, text, tone }) })
}

export function clearWordBookNotice(id) {
  if (state.notice && (id === undefined || state.notice.id === id)) update({ notice: null })
}

/** 単語帳の設定（登録先を選ぶ窓）を開く。pending は、作った単語帳にそのまま入れる項目 { refs, label }。 */
export function openWordBookSettings(pending = null) {
  update({ settings: Object.freeze({ pending }) })
}

export function closeWordBookSettings() {
  if (state.settings) update({ settings: null })
}

// 下部の枠に並べる順（左の縦の切り替えの上から）。
export const STUDY_DOCK_PANELS = Object.freeze(['speech', 'mix', 'book'])

/**
 * いまの画面で下部の枠に出すもの。
 * 読み上げ（speech）は読み上げ列があるとき、出題（mix）は暗記・テストの全21画面、単語帳（book）は単語帳ボタンがあるとき。
 */
export function studyDockPanels({ speechVisible = false, mixContext = null, wordBookButtons = 0 } = {}) {
  const available = { speech: Boolean(speechVisible), mix: Boolean(mixContext), book: wordBookButtons > 0 }
  return STUDY_DOCK_PANELS.filter((panel) => available[panel])
}

/**
 * 出すもののうち、いま前に出すもの。押した結果を見せている単語帳（flash）→ 自分で選んだもの（chosen）→ 並びの先頭。
 */
export function studyDockShowing(panels = [], { flash = null, chosen = null } = {}) {
  return [flash, chosen, ...panels].find((panel) => panel && panels.includes(panel)) ?? null
}
