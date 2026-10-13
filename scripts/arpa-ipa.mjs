// CMU Pronouncing Dictionary の ARPABET（ストレス付き）を IPA に変える。ストレス記号は音節頭に置く。
// 見出し語の発音記号（gen-phonetics.mjs）と、ほかの品詞の形の発音記号（word-form-candidates.mjs）が同じ書き方になるよう共有する。

const VOWELS = {
  AA: 'ɑ', AE: 'æ', AH: 'ʌ', AO: 'ɔ', AW: 'aʊ', AY: 'aɪ', EH: 'ɛ', ER: 'ɝ',
  EY: 'eɪ', IH: 'ɪ', IY: 'i', OW: 'oʊ', OY: 'ɔɪ', UH: 'ʊ', UW: 'u',
}
const CONS = {
  B: 'b', CH: 'tʃ', D: 'd', DH: 'ð', F: 'f', G: 'ɡ', HH: 'h', JH: 'dʒ', K: 'k',
  L: 'l', M: 'm', N: 'n', NG: 'ŋ', P: 'p', R: 'ɹ', S: 's', SH: 'ʃ', T: 't',
  TH: 'θ', V: 'v', W: 'w', Y: 'j', Z: 'z', ZH: 'ʒ',
}

// 英語で語頭に立てる子音連続（maximal onset 用）。IPA表記（r=ɹ, g=ɡ）。
const ONSET2 = new Set([
  'sp', 'st', 'sk', 'sm', 'sn', 'sl', 'sw',
  'pl', 'bl', 'kl', 'ɡl', 'fl',
  'pɹ', 'bɹ', 'tɹ', 'dɹ', 'kɹ', 'ɡɹ', 'fɹ', 'θɹ', 'ʃɹ', 'vɹ',
  'tw', 'dw', 'kw', 'ɡw', 'θw', 'hw',
  'pj', 'bj', 'kj', 'ɡj', 'fj', 'vj', 'mj', 'hj', 'nj', 'lj', 'tj', 'dj', 'sj',
])
const ONSET3 = new Set(['spl', 'spɹ', 'stɹ', 'skɹ', 'skw', 'spj', 'stj', 'skj'])
// sf は sphere 系（sfɪɹ・sfɛɹ）だけが語中でも語頭の連続子音になる。
// satisfy・transfer・disfavor・ceasefire・misfortune のように語幹の境目をまたぐ s+f は、強勢記号を f の前に置く
// （ˈsætɪsˌfaɪ）。sphere 系は母音が IH・EH のあとに R が続くので、そこで見分ける。
const SPHERE_VOWELS = new Set(['IH', 'EH'])
function onsetLen(cons, { wordInitial = false, sphere = false } = {}) {
  const n = cons.length
  if (wordInitial) return n
  if (n >= 3 && ONSET3.has(cons.slice(n - 3).join(''))) return 3
  if (n >= 2 && ONSET2.has(cons.slice(n - 2).join(''))) return 2
  if (n >= 2 && sphere && cons.slice(n - 2).join('') === 'sf') return 2
  return n >= 1 ? 1 : 0
}

// CMU は複合語や -teen・-ation の語に主強勢（1）を2つ以上付ける。辞書は主強勢を1つだけ書くので、
// 1つを主強勢（ˈ）に残し、ほかは副強勢（ˌ）にする。残す位置は、複合名詞のように最初の要素が強い語
// （widespread・ceasefire・overseer・baseball など）だけここに書き、それ以外は最後の主強勢を残す
// （thirteen・navigation・engineer・nearby・overdo のように、あとの音節が主強勢になる語）。
// キーは「最後の主強勢の母音までの ARPABET（強勢つき）」。活用形（overseers・engineering など）も同じキーで当たる。
const PRIMARY_ON_FIRST = new Set([
  'W AY1 D S P R EH1', // widespread
  'HH EH1 N S F AO1', // henceforth
  'HH IH1 DH ER2 T UW1', // hitherto
  'S IY1 S F AY1', // ceasefire
  'K OW1 W ER1', // coworker
  'OW1 V ER0 S IY1', // overseer
  'R AO1 NG D UW1', // wrongdoer
  'S AH1 M W AH1', // somewhat
  'B EY1 S B AO1', // baseball
  'K OW1 AA1', // coauthor
  'S AH1 B K AH0 M IH1', // subcommittee
  'EH1 K S L EH1', // excellency
])

export function arpaToIPA(arpa) {
  const segs = arpa.trim().split(/\s+/).map((p) => {
    const m = p.match(/^([A-Z]+)(\d)?$/)
    if (!m) return { ipa: '', isVowel: false, stress: null }
    const base = m[1]
    const stress = m[2] !== undefined ? Number(m[2]) : null
    if (base in VOWELS) {
      let ipa = VOWELS[base]
      if (base === 'AH' && stress === 0) ipa = 'ə'
      else if (base === 'ER') ipa = stress === 0 ? 'ɚ' : 'ɝ'
      return { ipa, isVowel: true, stress, base, token: p }
    }
    return { ipa: CONS[base] ?? '', isVowel: false, stress: null, base, token: p }
  })
  // 主強勢が2つ以上あるときは、1つだけ主強勢に残す。
  const primaries = segs.map((s, idx) => (s.isVowel && s.stress === 1 ? idx : -1)).filter((idx) => idx >= 0)
  if (primaries.length > 1) {
    const last = primaries[primaries.length - 1]
    const key = segs.slice(0, last + 1).map((s) => s.token).join(' ')
    const keep = PRIMARY_ON_FIRST.has(key) ? primaries[0] : last
    for (const idx of primaries) if (idx !== keep) segs[idx].stress = 2
  }
  // ストレス記号を音節頭に置く（直前の子音群のうち、語頭に立てる範囲だけを onset とする）
  const markers = {}
  segs.forEach((s, idx) => {
    if (s.isVowel && (s.stress === 1 || s.stress === 2)) {
      let p = idx - 1
      while (p >= 0 && !segs[p].isVowel) p--
      const cons = segs.slice(p + 1, idx).map((x) => x.ipa)
      const sphere = SPHERE_VOWELS.has(s.base) && segs[idx + 1]?.base === 'R'
      const pos = idx - onsetLen(cons, { wordInitial: p < 0, sphere })
      if (markers[pos] === undefined) markers[pos] = s.stress === 1 ? 'ˈ' : 'ˌ'
    }
  })
  let out = ''
  segs.forEach((s, idx) => {
    if (markers[idx]) out += markers[idx]
    out += s.ipa
  })
  return out ? `/${out}/` : ''
}
