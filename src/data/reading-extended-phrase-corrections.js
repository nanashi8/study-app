// 語彙強化ロングリーディング（散文化済み）のSVOCM訂正台帳。
// match は現在の連続フレーズ、parts は英語順を保った訂正後の役割・隣接訳。
// 自動推定では役割の境目を取り違える箇所だけを、本文を読んで確定する。

const correction = (match, parts, note, occurrence = 1) => Object.freeze({
  match: Object.freeze(match),
  parts: Object.freeze(parts.map((part) => Object.freeze(part))),
  note,
  occurrence,
})

export const EXTENDED_READING_PHRASE_CORRECTIONS = Object.freeze({
  'A network full of small leaks loses a fixed share of everything that is ever pumped into its pipes.': Object.freeze([
    correction(['that'], [
      { role: 'S', en: 'that', ja: 'そのあらゆるものとは' },
    ], 'この that は everything を受ける関係代名詞で、後ろの節の主語Sです。内容節を導く that ではありません。'),
  ]),
  'Rules become real only when everyone can find out what they require and who may apply them.': Object.freeze([
    correction(['require and'], [
      { role: 'O', en: 'require and', ja: '求めているのか、そして' },
    ], 'find out の目的語となる what 節の述語Vで、and が次の who 節へ渡します。'),
  ]),
  'Punishment is sometimes defended as a deterrent, but a penalty deters nobody if the rule itself is unknown.': Object.freeze([
    correction(['deters', 'nobody'], [
      { role: 'V', en: 'deters nobody', ja: '誰も抑止しません' },
    ], 'nobody は deters の目的語で、日本語では「誰も〜ない」と述語とひとまとまりにします。'),
  ]),
  'A town may hold meetings and publish notices, yet still hear only the people who already know how the system works.': Object.freeze([
    correction(['may hold', 'meetings and publish notices'], [
      { role: 'V', en: 'may hold meetings and publish notices', ja: '会合を開き通知を出すことができます' },
    ], 'hold と publish は may を共有する二つの述語Vで、meetings と notices はそれぞれの目的語です。'),
  ]),
  'An oral report reaches people who cannot read long documents, and a printed record protects those who cannot attend.': Object.freeze([
    correction(['An oral', 'report'], [
      { role: 'S', en: 'An oral report', ja: '口頭の報告は' },
    ], 'An oral report がひとまとまりの主語Sです。'),
    correction(['a', 'printed', 'record protects those'], [
      { role: 'S', en: 'a printed record', ja: '印刷された記録は' },
      { role: 'V', en: 'protects', ja: '守ります（対象は次へ）' },
      { role: 'O', en: 'those', ja: '出席できない人々を' },
    ], 'printed は record を修飾する過去分詞で、述語Vは protects です。'),
  ]),
  'Communities that use both methods hear a wider range of residents than those that rely on one channel.': Object.freeze([
    correction(['Communities that', 'use', 'both methods hear a wider range of residents than those that', 'rely'], [
      { role: 'S', en: 'Communities that use both methods', ja: '両方の方法を使う地域は' },
      { role: 'V', en: 'hear', ja: '聞き取ります（対象は次へ）' },
      { role: 'O', en: 'a wider range of residents', ja: 'より幅広い住民の声を' },
      { role: 'M', en: 'than those that rely', ja: '頼る地域よりも' },
    ], '関係詞節 that use both methods までが主語Sで、主節の動詞Vは hear です。'),
  ]),
  'If a council treats every objection as an attack, it will soon receive silence instead of assent.': Object.freeze([
    correction(['as', 'an', 'attack'], [
      { role: 'M', en: 'as an attack', ja: '攻撃として' },
    ], 'as an attack は treats の扱い方を示す前置詞句Mで、attack は動詞ではありません。'),
  ]),
  'The habit of answering questions in public turns an official body into a representative one.': Object.freeze([
    correction(['The habit of', 'answering', 'questions in public turns an official body'], [
      { role: 'S', en: 'The habit of answering questions in public', ja: '公の場で質問に答えるという習慣が' },
      { role: 'V', en: 'turns', ja: '変えます（対象は次へ）' },
      { role: 'O', en: 'an official body', ja: '公式の組織を' },
    ], 'answering は of の目的語となる動名詞で、主節の動詞Vは turns です。'),
  ]),
  'Prosecutors must show why the charge fits the facts, and the defense may challenge every provision the state relies on.': Object.freeze([
    correction(['the', 'charge', 'fits the facts'], [
      { role: 'S', en: 'the charge', ja: 'その訴えが' },
      { role: 'V', en: 'fits', ja: '合うのかを' },
      { role: 'O', en: 'the facts', ja: '事実に' },
    ], 'why 節の中は the charge が主語S、fits が動詞Vです。'),
  ]),
  'The hardest role in any community is the bystander who sees a problem and assumes that someone else will report it.': Object.freeze([
    correction(['who', 'sees', 'a problem and', 'assumes'], [
      { role: 'S', en: 'who', ja: 'その傍観者は' },
      { role: 'V', en: 'sees', ja: '気づき（対象は次へ）' },
      { role: 'O', en: 'a problem', ja: '問題に' },
      { role: 'LINK', en: 'and', ja: 'そして' },
      { role: 'V', en: 'assumes', ja: 'こう思い込みます' },
    ], 'who が関係詞節の主語Sで、sees と assumes が and で並ぶ二つの述語Vです。'),
  ]),
})
