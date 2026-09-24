// 単語データのファイルの類義語・反対語の欄を書き換える（外す・意味を直す）。relation-review-apply.mjs が使う。
// 単語データは2通りの書き方がある。
//  1) 1語1行の並び ['word', '品詞', ..., { syn: [{ w: 'x', m: '…' }], ant: [...] }]（words*.js。JSON の書き方の行もある）
//  2) 同じつづりの別の語 homograph-words.js の Object.freeze({ id: 'x_2', ... synonyms: Object.freeze([Object.freeze({ w, m }), ...]) })
// どちらでも、その語の欄の配列の中から英単語 w の項目を探して、消すか意味を差しかえる。見つからない・2か所以上なら止める。
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'

const escapeRe = (text) => String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const toId = (text) => String(text).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')

// 配列の文字列の中から w の項目を探す。{ start, end, mStart, mEnd, quote } を返す。
function findItem(arrayText, w) {
  const re = new RegExp(
    `(?:Object\\.freeze\\()?\\{\\s*(["']?)w\\1\\s*:\\s*(["'])${escapeRe(w)}\\2\\s*,\\s*(["']?)m\\3\\s*:\\s*(["'])((?:\\\\.|(?!\\4).)*)\\4\\s*,?\\s*\\}(?:\\))?`,
    'ud',
  )
  const match = re.exec(arrayText)
  if (!match) return null
  const [mStart, mEnd] = match.indices[5]
  return { start: match.index, end: match.index + match[0].length, mStart, mEnd, quote: match[4] }
}

export function createSourceEditor(dataDir) {
  const names = readdirSync(dataDir).filter((name) => /^words.*\.js$/.test(name) || name === 'homograph-words.js' || name === 'exam-lexicon.js')
  const sources = new Map(names.map((name) => [name, readFileSync(new URL(name, dataDir), 'utf8')]))
  const changed = new Set()

  const locate = (id, kind, w) => {
    const hits = []
    for (const [name, text] of sources) {
      if (name === 'homograph-words.js') {
        const at = text.indexOf(`id: '${id}',`)
        if (at < 0) continue
        const blockEnd = text.indexOf('\n  }),', at)
        const key = kind === 'syn' ? 'synonyms: Object.freeze([' : 'antonyms: Object.freeze(['
        const keyAt = text.indexOf(key, at)
        if (keyAt < 0 || keyAt > blockEnd) continue
        const arrayStart = keyAt + key.length
        const arrayEnd = text.indexOf('])', arrayStart)
        const item = findItem(text.slice(arrayStart, arrayEnd), w)
        if (item) hits.push({ name, offset: arrayStart, item })
        continue
      }
      let offset = 0
      for (const line of text.split('\n')) {
        const head = line.match(/^\s*\[\s*(["'])((?:\\.|(?!\1).)*)\1\s*,/u)
        if (head && toId(head[2].replace(/\\(.)/g, '$1')) === id) {
          const keyMatch = line.match(new RegExp(`(["']?)${kind}\\1\\s*:\\s*\\[`))
          if (keyMatch) {
            const arrayStart = keyMatch.index + keyMatch[0].length
            const arrayEnd = line.indexOf(']', arrayStart)
            const item = findItem(line.slice(arrayStart, arrayEnd), w)
            if (item) hits.push({ name, offset: offset + arrayStart, item })
          }
        }
        offset += line.length + 1
      }
    }
    return hits
  }

  /** 項目を消す（newMeaning が null）か、意味を newMeaning に差しかえる。問題があれば文を返す。 */
  const edit = (id, kind, w, newMeaning = null) => {
    const hits = locate(id, kind, w)
    if (hits.length !== 1) return `${id} の ${kind} の ${w} が単語データのファイルに${hits.length ? `${hits.length}か所ある` : '見つからない'}（手で直す）`
    const { name, offset, item } = hits[0]
    let text = sources.get(name)
    if (newMeaning == null) {
      // 項目と、前後の区切りの「, 」を1つだけ消す。
      let start = offset + item.start
      let end = offset + item.end
      const after = text.slice(end).match(/^\s*,\s*/)
      const before = text.slice(0, start).match(/,\s*$/)
      if (after) end += after[0].length
      else if (before) start -= before[0].length
      text = text.slice(0, start) + text.slice(end)
    } else {
      const escaped = item.quote === "'"
        ? String(newMeaning).replace(/\\/g, '\\\\').replace(/'/g, "\\'")
        : JSON.stringify(String(newMeaning)).slice(1, -1)
      text = text.slice(0, offset + item.mStart) + escaped + text.slice(offset + item.mEnd)
    }
    sources.set(name, text)
    changed.add(name)
    return ''
  }

  const save = () => {
    for (const name of changed) writeFileSync(new URL(name, dataDir), sources.get(name))
    return [...changed]
  }

  return { locate, edit, save, sources }
}
