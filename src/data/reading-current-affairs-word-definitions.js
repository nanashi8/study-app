// 時事長文で初めて必要になった独立語義。
// 活用形・透明な派生語は passage-gloss.js で既存語へ戻し、ここには
// 本文を読むために独立して覚える価値のある語だけを置く。

export const CURRENT_AFFAIRS_READING_WORD_DEFINITIONS = Object.freeze([
  { id: 'outside', pos: '副', level: '5', meaning: '外で・外へ', field: '機能語' },
  { id: 'roof', pos: '名', level: '4', meaning: '屋根', field: '食・生活' },
  { id: 'battery', pos: '名', level: '4', meaning: '電池・蓄電池', field: '技術' },
  { id: 'text', pos: '名', level: '3', meaning: '文章・本文', field: '情報' },
  { id: 'something', pos: '代', level: '3', meaning: '何か・あるもの', field: '機能語' },
  { id: 'anything', pos: '代', level: '3', meaning: '何でも・（否定文で）何も', field: '機能語' },
  { id: 'ai', word: 'AI', pos: '名', level: '3', meaning: '人工知能・AI', field: '技術', phonetic: '/ˌeɪ ˈaɪ/' },
  { id: 'double', surface: 'doubled', pos: '動', level: '3', meaning: '2倍になる・2倍にする', field: '時間・数量' },
  { id: 'kilometer', surface: 'kilometers', pos: '名', level: '3', meaning: 'キロメートル', field: '時間・数量' },
  { id: 'taxi', pos: '名', level: '3', meaning: 'タクシー', field: '交通' },
  { id: 'edit', surface: 'edits', pos: '名', level: 'pre2', meaning: '編集・修正した箇所', field: '情報' },
  { id: 'prefecture', pos: '名', level: 'pre2', meaning: '県・都道府県', field: '政治' },
  { id: 'net', surface: 'nets', pos: '名', level: 'pre2', meaning: '網・ネット', field: '技術' },
  { id: 'centimeter', pos: '名', level: 'pre2', meaning: 'センチメートル', field: '時間・数量' },
  { id: 'spacecraft', pos: '名', level: '2', meaning: '宇宙機・宇宙船', field: '技術' },
  { id: 'radar', pos: '名', level: '2', meaning: 'レーダー・電波探知機', field: '技術' },
  { id: 'debris', pos: '名', level: '2', meaning: '破片・残骸', field: '技術', phonetic: '/dəˈbɹi/' },
  { id: 'newsroom', surface: 'newsrooms', pos: '名', level: 'pre1', meaning: '報道部門・編集局', field: '情報' },
  { id: 'bribe', pos: '名', level: 'pre1', meaning: '賄賂・わいろ', field: '政治' },
  { id: 'synthetic', pos: '形', level: '1', meaning: '合成の・人工的に作られた', field: '技術' },
  { id: 'metadata', pos: '名', level: '1', meaning: '付随情報・メタデータ', field: '情報', phonetic: '/ˈmɛtəˌdeɪtə/' },
  { id: 'provenance', pos: '名', level: '1', meaning: '来歴・出所', field: '情報', phonetic: '/ˈpɹɑvənəns/' },
  { id: 'custody', pos: '名', level: '1', meaning: '管理・保管', field: '法律' },
])
