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

const group = (id, label, description, sections) => Object.freeze({
  id,
  label,
  description,
  sections: Object.freeze(sections),
})

// 共通メニューの情報設計を一か所に集約する。
// 英和辞書・英作文・語源学習は最初の画面から直接開き、残りの項目は4分類にまとめる。
// 画面IDは保存済み履歴・戻る履歴との互換性のため変更しない。
export const APP_MENU_DIRECT_ITEMS = Object.freeze([
  screenItem('vocabSearch', '英和辞書', '意味・語法・語源・参照履歴'),
  screenItem('writing', '英作文', '書いて使える知識にする'),
  screenItem('roots', '語源学習', '部品・同じ語根・ことばの歴史で理解する'),
])

export const APP_MENU_GROUPS = Object.freeze([
  group('learn', '教材を選ぶ', '教科・教材', [
    section('subjects', '教科・辞書・名作', [
      screenItem('portal', '教科を選ぶホーム', '全教科・辞書・名作の入口'),
      screenItem('mathMap', '数学アプリ', '単元マップと理解度'),
      screenItem('kotenList', '古典アプリ', '古典単語・文法・常識・短文'),
      screenItem('kanbunHome', '漢文アプリ', '漢語・漢文法・漢文常識・返り点'),
      screenItem('literatureLibrary', '名作に親しむ', '英語・古典・漢文の朗読'),
    ]),
    section('english', '英語', [
      screenItem('home', '英語学習ホーム', '主要5分野から選ぶ'),
      screenItem('vocabLevels', '英単語', '級別・分野別・品詞別に学習'),
      screenItem('readingList', '長文読解', '前から読む訳・文法・設問'),
      screenItem('phrases', '熟語・構文', '全1,500項目を検索・復習'),
      screenItem('grammar', '英文法', '級別問題と体系解説'),
      screenItem('listening', 'リスニング', '級別形式・本文確認・復習'),
    ]),
  ]),
  group('tools', '学習ツール', '診断・練習', [
    section('practice', '診断・発展学習', [
      screenItem('diagnostic', '学習診断', '28問で得意・弱点と現在地を確認'),
      screenItem('dictation', 'ディクテーション', '聞き取りとつづりを結びつける'),
    ]),
    section('dictionary-tools', '辞書の補助機能', [
      screenItem('vocabCamera', '教科書から単語追加', '写真OCRで辞書照合・保存'),
      screenItem('wordRequests', '辞書リクエスト一覧', '辞書への追加希望を確認'),
    ]),
  ]),
  group('records', '保存・記録', '保存・履歴', [
    section('personal', '自分の学習', [
      screenItem('myList', 'マイ学習ノート', '8分野のメモ・問題集・履歴'),
      screenItem('myLearning', '全学習索引', '学習済み項目を分野横断で確認'),
      screenItem('myGrammar', 'マイ文法', '保存した文法を復習'),
      screenItem('kotenSaved', '古典の登録リスト', '古典単語・文法・常識を管理'),
      screenItem('kanbunSaved', '漢文の登録リスト', '漢語・漢文法・漢文常識を管理'),
      screenItem('progress', '学習記録・バックアップ', '成績、級別進捗、QR・コード'),
    ]),
  ]),
  group('manage', '設定・データ', '設定・履歴', [
    section('management', '設定とデータ', [
      actionItem('settings', '設定', '学習カード・音声・表示・メニュー配置'),
      actionItem('account', 'ログイン・アカウント', 'クラウド保存とログアウト'),
      actionItem('reset', '学習履歴を選んでリセット', 'すべて、または項目を選択', 'danger'),
    ]),
  ]),
])

export const APP_MENU_ITEMS = Object.freeze(
  [
    ...APP_MENU_DIRECT_ITEMS,
    ...APP_MENU_GROUPS.flatMap((menuGroup) =>
      menuGroup.sections.flatMap((menuSection) => menuSection.items)),
  ],
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

export function appMenuGroupById(id) {
  return APP_MENU_GROUPS.find((menuGroup) => menuGroup.id === id) ?? null
}
