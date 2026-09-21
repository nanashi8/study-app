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
  'sp', 'st', 'sk', 'sf', 'sm', 'sn', 'sl', 'sw',
  'pl', 'bl', 'kl', 'ɡl', 'fl',
  'pɹ', 'bɹ', 'tɹ', 'dɹ', 'kɹ', 'ɡɹ', 'fɹ', 'θɹ', 'ʃɹ', 'vɹ',
  'tw', 'dw', 'kw', 'ɡw', 'θw', 'hw',
  'pj', 'bj', 'kj', 'ɡj', 'fj', 'vj', 'mj', 'hj', 'nj', 'lj', 'tj', 'dj', 'sj',
])
const ONSET3 = new Set(['spl', 'spɹ', 'stɹ', 'skɹ', 'skw', 'spj', 'stj', 'skj'])
function onsetLen(cons) {
  const n = cons.length
  if (n >= 3 && ONSET3.has(cons.slice(n - 3).join(''))) return 3
  if (n >= 2 && ONSET2.has(cons.slice(n - 2).join(''))) return 2
  return n >= 1 ? 1 : 0
}

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
      return { ipa, isVowel: true, stress }
    }
    return { ipa: CONS[base] ?? '', isVowel: false, stress: null }
  })
  // ストレス記号を音節頭に置く（直前の子音群のうち、語頭に立てる範囲だけを onset とする）
  const markers = {}
  segs.forEach((s, idx) => {
    if (s.isVowel && (s.stress === 1 || s.stress === 2)) {
      let p = idx - 1
      while (p >= 0 && !segs[p].isVowel) p--
      const cons = segs.slice(p + 1, idx).map((x) => x.ipa)
      const pos = idx - onsetLen(cons)
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
