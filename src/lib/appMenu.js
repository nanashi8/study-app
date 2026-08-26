const screenItem = (screen, label, description) => Object.freeze({
  kind: 'screen',
  screen,
  label,
  description,
})

const actionItem = (action, label, description, tone = 'default') => Object.freeze({
  kind: 'action',
  action,
  label,
  description,
  tone,
})

const section = (id, label, items) => Object.freeze({
  id,
  label,
  items: Object.freeze(items),
})

// メニューの情報設計を一か所に集約する。
// 見出しは整理のためだけに使い、全項目を同じ画面から直接開けるようにする。
// 画面IDは保存済み履歴・戻る履歴との互換性のため変更しない。
export const APP_MENU_SECTIONS = Object.freeze([
  section('apps', 'スタディアプリ', [
    screenItem('portal', 'スタディアプリ ホーム', '英語・数学・古典・漢文・名作から選ぶ'),
    screenItem('home', '英語アプリ', '英検5級〜1級の主要学習'),
    screenItem('mathMap', '数学アプリ', '単元マップと理解度'),
    screenItem('kotenList', '古典アプリ', '古典単語・文法・常識・短文'),
    screenItem('kanbunHome', '漢文アプリ', '漢語・漢文法・漢文常識・返り点'),
    screenItem('literatureLibrary', '名作に親しむ', '英語・古典・漢文の朗読'),
  ]),
  section('english', '英語の学習', [
    screenItem('vocabLevels', '英単語', '級別・分野別・品詞別に学習'),
    screenItem('vocabSearch', '英和辞書', '単語・熟語・構文を検索'),
    screenItem('writing', '英作文', '書いて使える知識にする'),
    screenItem('roots', '語源学習', '語源から関連英単語を一緒に暗記'),
    screenItem('readingList', '長文読解', '前から読む訳・文法・設問'),
    screenItem('phrases', '熟語・構文', '全2,104項目を検索・復習'),
    screenItem('grammar', '英文法', '級別問題と順序立てた解説'),
    screenItem('listening', 'リスニング', '級別形式・本文確認・復習'),
  ]),
  section('support', '学習サポート', [
    actionItem('advisor', '学習アドバイザー', '今日のおすすめと優先して伸ばす分野'),
    actionItem('analytics', '学習記録とおすすめ', '正答・復習日・学習時間を確認'),
    screenItem('diagnostic', '学習診断', '28問で得意・弱点と現在地を確認'),
    screenItem('dictation', 'ディクテーション', '聞き取りとつづりを結びつける'),
    screenItem('vocabCamera', '教科書から単語追加', '写真の文字を辞書と比べて保存'),
    screenItem('wordRequests', '辞書リクエスト一覧', '辞書への追加希望を確認'),
  ]),
  section('records', '保存・記録', [
    screenItem('myList', 'マイ学習ノート', '8分野のメモ・問題集・履歴'),
    screenItem('myLearning', '暗記・テストの記録', '全18教材の一覧を確認し、「覚えた／まだ」と正解・不正解を見直す'),
    screenItem('myGrammar', 'マイ文法', '保存した文法を復習'),
    screenItem('kotenSaved', '古典の登録リスト', '古典単語・文法・常識を管理'),
    screenItem('kanbunSaved', '漢文の登録リスト', '漢語・漢文法・漢文常識を管理'),
    screenItem('progress', '学習記録・バックアップ', '教材別の記録、学習の傾向、QR・コード'),
  ]),
  section('settings', '設定・アカウント', [
    actionItem('settings', '設定', '学習カード・音声・ホームの表示'),
    actionItem('account', 'ログイン・アカウント', 'クラウド保存とログアウト'),
    actionItem('reset', '学習履歴を選んでリセット', 'すべて、または項目を選択', 'danger'),
  ]),
])

export const APP_MENU_ITEMS = Object.freeze(
  APP_MENU_SECTIONS.flatMap((menuSection) => menuSection.items),
)

export const APP_MENU_SCREEN_DESTINATIONS = Object.freeze(
  APP_MENU_ITEMS
    .filter((item) => item.kind === 'screen')
    .map((item) => item.screen),
)

export const APP_MENU_ACTIONS = Object.freeze(
  APP_MENU_ITEMS
    .filter((item) => item.kind === 'action')
    .map((item) => item.action),
)
