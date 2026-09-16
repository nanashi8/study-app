// CMU Pronouncing Dictionary は綴りごとに代表発音を1つ返すため、
// 品詞・語義で発音が変わる同綴異音語は、アプリの見出し語の用法に合わせて補正する。
// キーは vocab の id。追加時は例文・品詞・意味と一致する発音だけを登録する。
export const PHONETIC_OVERRIDES = {
  read: '/ˈɹid/',       // 動詞・現在形「読む」
  lead: '/ˈlid/',       // 動詞「導く」
  live: '/ˈlɪv/',       // 動詞「住む・生きる」
  close: '/ˈkloʊz/',    // 動詞「閉じる」
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
  // 2026-09-16: 品詞・意味と発音記号が食い違っていたカード（読み分けは heteronyms.js）。
  abuse: '/əˈbjuz/', // 動詞
  accent: '/ˈækˌsɛnt/', // 名詞
  alternate: '/ˈɔltɚˌneɪt/', // 動詞
  arithmetic: '/ɚˈɪθməˌtɪk/', // 名詞
  associate: '/əˈsoʊsiˌeɪt/', // 動詞
  capitulate: '/kəˈpɪtʃəˌleɪt/', // 動詞
  combine: '/kəmˈbaɪn/', // 動詞
  compress: '/kəmˈpɹɛs/', // 動詞
  concrete: '/ˈkɑnkɹit/', // 名詞「コンクリート」
  console: '/kənˈsoʊl/', // 動詞「慰める」
  converse: '/kənˈvɝs/', // 動詞「会話する」
  convert: '/kənˈvɝt/', // 動詞
  coordinate: '/koʊˈɔɹdəˌneɪt/', // 動詞
  degenerate: '/dɪˈdʒɛnɚˌeɪt/', // 動詞
  detach: '/diˈtætʃ/', // 動詞
  diffuse: '/dɪˈfjuz/', // 動詞
  disabuse: '/dɪsəˈbjuz/', // 動詞
  discount: '/ˈdɪskaʊnt/', // 名詞
  duplicate: '/ˈdupləˌkeɪt/', // 動詞
  elaborate: '/ɪˈlæbɚˌeɪt/', // 動詞
  estimate: '/ˈɛstəˌmeɪt/', // 動詞
  excuse: '/ɪkˈskjuz/', // 動詞「許す」
  expatriate: '/ɛkˈspeɪtɹiət/', // 名詞・形容詞
  exploit: '/ˌɛkˈsplɔɪt/', // 動詞
  extract: '/ɪkˈstɹækt/', // 動詞
  illuminate: '/ɪˈluməˌneɪt/', // 動詞
  impact: '/ˈɪmpækt/', // 名詞
  insubordinate: '/ˌɪnsəˈbɔɹdənət/', // 形容詞
  insult: '/ˈɪnˌsʌlt/', // 名詞
  invalid: '/ˌɪnˈvæləd/', // 形容詞「無効な」
  invigorate: '/ɪnˈvɪɡɚˌeɪt/', // 動詞
  nominate: '/ˈnɑməˌneɪt/', // 動詞
  outlast: '/aʊtˈlæst/', // 動詞
  overflow: '/ˌoʊvɚˈfloʊ/', // 動詞
  perfect: '/ˈpɝˌfɪkt/', // 形容詞
  profligate: '/ˈpɹɑfləɡət/', // 形容詞
  radiate: '/ˈɹeɪdiˌeɪt/', // 動詞
  rebel: '/ɹɪˈbɛl/', // 動詞
  recall: '/ɹɪˈkɔl/', // 動詞
  refill: '/ɹiˈfɪl/', // 動詞
  refund: '/ˈɹiˌfʌnd/', // 名詞
  reprobate: '/ˈɹɛpɹəˌbeɪt/', // 名詞
  reuse: '/ɹiˈjuz/', // 動詞
  reverberate: '/ɹɪˈvɝbɚˌeɪt/', // 動詞
  simulate: '/ˈsɪmjəˌleɪt/', // 動詞
  sow: '/ˈsoʊ/', // 動詞「（種を）まく」
  subject: '/ˈsʌbdʒɪkt/', // 名詞・形容詞
  subordinate: '/səˈbɔɹdənət/', // 名詞・形容詞
  surcharge: '/ˈsɝˌtʃɑɹdʒ/', // 名詞
  torment: '/tɔɹˈmɛnt/', // 動詞
  wound: '/ˈwund/', // 名詞「傷」・動詞「傷つける」
}
