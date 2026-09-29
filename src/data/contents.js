// トップ（ポータル）に並べる「コンテンツ」の一覧。
//
// 設計方針：トップページは複数コンテンツの入り口。学習アプリ全体を
// 1コンテンツとして扱い、辞書・数学・古典など他の学びは《この配列に1件足すだけ》
// で別入り口として増やせる。画面側(Portal.jsx)はこの配列を（並べ替え設定を
// 反映して）描く。
//
//   id       … 一意キー（並べ替え・表示オン/オフの永続化キー。変更しないこと）
//   title    … タイトル
//   subtitle … 補足
//   emoji    … アイコン代わり
//   color    … テーマ色
//   screen   … 入った先の画面キー（App.jsx の SCREENS）。status:'available' のみ必須
//   status   … 'available'（公開中） | 'coming'（準備中・タップ不可）
//
// 並び順や表示/非表示はユーザーがポータルの「編集」から変えられる（useStore の
// portalOrder / portalHidden に保存）。ここでの配列順は初期値（既定の並び）。
export const CONTENTS = [
  {
    id: 'eigo-quest',
    title: '英語アプリ',
    subtitle: '英検5級〜1級の英単語・文法・長文',
    emoji: '🦉',
    color: '#6366f1',
    screen: 'home',
    status: 'available',
  },
  {
    id: 'koten-quest',
    title: '古典アプリ',
    subtitle: '古典単語・古典文法・古典常識を暗記・テスト',
    emoji: '📜',
    color: '#d97706',
    screen: 'kotenList',
    status: 'available',
  },
  {
    id: 'kanbun-quest',
    title: '漢文アプリ',
    subtitle: '漢語・漢文法・漢文常識と返り点を暗記・テスト',
    emoji: '📕',
    color: '#be123c',
    screen: 'kanbunHome',
    status: 'available',
  },
  {
    id: 'literature-listening',
    title: '名作に親しむ',
    subtitle: '間で区切った原文と訳を一対ずつ交互に聴く',
    emoji: '🎙️',
    color: '#0f766e',
    screen: 'literatureLibrary',
    status: 'available',
  },
  {
    id: 'math-quest',
    title: '数学アプリ',
    subtitle: '数えることから数IIIまで・歴史と図で学び、入試問題で演習する',
    emoji: '📐',
    color: '#7c3aed',
    screen: 'mathMap',
    status: 'available',
  },
  {
    id: 'social-quest',
    title: '社会アプリ',
    subtitle: '地理・歴史・公民を単元ごとに学び、基礎〜入試の問題で演習する',
    emoji: '🗾',
    color: '#0f766e',
    screen: 'socialHome',
    status: 'available',
  },
  {
    id: 'science-quest',
    title: '理科アプリ',
    subtitle: '1〜3年の理科を単元ごとに学び、基礎〜入試の問題で演習する',
    emoji: '🔬',
    color: '#15803d',
    screen: 'scienceHome',
    status: 'available',
  },
]

export const CONTENTS_BY_ID = Object.fromEntries(CONTENTS.map((c) => [c.id, c]))

// 既定の並び順（id配列）。保存された並び順が無いときの初期値。
export const DEFAULT_CONTENT_ORDER = CONTENTS.map((c) => c.id)
