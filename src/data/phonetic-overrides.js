// CMU Pronouncing Dictionary は綴りごとに代表発音を1つ返すため、
// 品詞・語義で発音が変わる同綴異音語は、アプリの見出し語の用法に合わせて補正する。
// キーは vocab の id。追加時は例文・品詞・意味と一致する発音だけを登録する。
export const PHONETIC_OVERRIDES = {
  read: '/ˈɹid/',       // 動詞・現在形「読む」
  lead: '/ˈlid/',       // 動詞「導く」
  live: '/ˈlɪv/',       // 動詞「住む・生きる」
  close: '/ˈkloʊz/',    // 動詞「閉じる」
  minute: '/maɪˈnut/',  // 形容詞「微小な」
  use: '/ˈjuz/',        // 動詞「使う」
  wind: '/ˈwɪnd/',      // 名詞「風」
  export: '/ɪkˈspɔɹt/', // 動詞「輸出する」
  project: '/pɹəˈdʒɛkt/',
  conduct: '/kənˈdʌkt/',
  advocate: '/ˈædvəˌkeɪt/',
  attribute: '/əˈtɹɪbjut/',
  survey: '/ˈsɝˌveɪ/',  // 名詞「調査」
  barrier_free: '/ˈbæɹiɚ fɹi/',
  passer_by: '/ˌpæsɚˈbaɪ/',
  subtropical: '/ˌsʌbˈtɹɑpɪkəl/',
  exportation: '/ˌɛkspɔɹˈteɪʃən/',
  biennially: '/baɪˈɛniəli/',
  prophesy: '/ˈpɹɑfəˌsaɪ/',
  sirloin: '/ˈsɝˌlɔɪn/',
  entreat: '/ɛnˈtɹit/',
  acquirement: '/əˈkwaɪɚmənt/',
  monocycle: '/ˈmɑnəˌsaɪkəl/',
  detestable: '/dɪˈtɛstəbəl/',
  subnormal: '/ˌsʌbˈnɔɹməl/',
  habituate: '/həˈbɪtʃuˌeɪt/',
}
