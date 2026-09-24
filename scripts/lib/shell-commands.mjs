// シェルのコマンド文字列を、単純コマンドの並びとして読む（依頼台帳のフック scripts/check-requests.mjs が使う）。
// シェルの文法を全部扱うのではなく、Claude Code の Bash の道具に書かれるコマンドを読むのに要る範囲だけを扱う：
// クォート・エスケープ・$( )・` `・コメント・演算子（&& || ; | & 改行 ( )）・リダイレクト・ヒアドキュメント・
// 変数の代入と展開・cd／pushd／popd・bash -c とヒアドキュメントで渡したシェル。
import { homedir } from 'node:os'
import { resolve } from 'node:path'

/**
 * 単純コマンドに分ける。返す要素は { words, redirects, heredocs }。
 * words はクォートを外した語（$NAME・$( ) はそのまま残す）、redirects は { op, target }、heredocs はヒアドキュメントの本文。
 */
export function shellSegments(command) {
  const src = String(command ?? '')
  const segments = []
  const pendingHeredocs = []
  let segment = { words: [], redirects: [], heredocs: [] }
  let word = null
  let pending = null // 次の語を何に使うか（リダイレクトの行き先・ヒアドキュメントの終わりの印）

  const append = (text) => { word = (word ?? '') + text }
  const endWord = () => {
    if (word === null) return
    if (pending === '<<' || pending === '<<-') pendingHeredocs.push({ delimiter: word, strip: pending === '<<-', segment })
    else if (pending) segment.redirects.push({ op: pending, target: word })
    else segment.words.push(word)
    pending = null
    word = null
  }
  const endSegment = () => {
    endWord()
    pending = null
    if (segment.words.length || segment.redirects.length) segments.push(segment)
    segment = { words: [], redirects: [], heredocs: [] }
  }
  // 閉じる印までを、入れ子と中のクォートを数えながら読み飛ばす（$( ) と ${ } の中身はそのまま語に残す）。
  const skipBalanced = (start, open, close) => {
    let depth = 0
    for (let k = start; k < src.length; k += 1) {
      const char = src[k]
      if (char === '\\') { k += 1; continue }
      if (char === "'") { k = src.indexOf("'", k + 1); if (k === -1) return src.length - 1; continue }
      if (char === '"') {
        for (k += 1; k < src.length && src[k] !== '"'; k += 1) if (src[k] === '\\') k += 1
        continue
      }
      if (char === open) depth += 1
      else if (char === close) {
        depth -= 1
        if (depth === 0) return k
      }
    }
    return src.length - 1
  }

  for (let i = 0; i < src.length; i += 1) {
    const char = src[i]
    const next = src[i + 1]
    if (char === '\\') {
      if (next === '\n') { i += 1; continue }
      if (next !== undefined) append(next)
      i += 1
      continue
    }
    if (char === "'") {
      const close = src.indexOf("'", i + 1)
      const end = close === -1 ? src.length : close
      append(src.slice(i + 1, end))
      i = end
      continue
    }
    if (char === '"') {
      let text = ''
      let k = i + 1
      for (; k < src.length && src[k] !== '"'; k += 1) {
        if (src[k] === '\\' && src[k + 1] !== undefined && '$`"\\\n'.includes(src[k + 1])) {
          if (src[k + 1] !== '\n') text += src[k + 1]
          k += 1
        } else if (src[k] === '$' && src[k + 1] === '(') {
          const end = skipBalanced(k + 1, '(', ')')
          text += src.slice(k, end + 1)
          k = end
        } else text += src[k]
      }
      append(text)
      i = k
      continue
    }
    if (char === '$' && (next === '(' || next === '{')) {
      const end = skipBalanced(i + 1, next, next === '(' ? ')' : '}')
      append(src.slice(i, end + 1))
      i = end
      continue
    }
    if (char === '`') {
      let k = i + 1
      while (k < src.length && src[k] !== '`') k += src[k] === '\\' ? 2 : 1
      append(src.slice(i, k + 1))
      i = k
      continue
    }
    if (char === '#' && word === null) {
      const newline = src.indexOf('\n', i)
      i = (newline === -1 ? src.length : newline) - 1
      continue
    }
    if (char === ' ' || char === '\t') { endWord(); continue }
    if (char === '\n') {
      endSegment()
      // 行の終わりで、この行に書いたヒアドキュメントの本文を読む。
      let position = i + 1
      for (const doc of pendingHeredocs) {
        const lines = []
        while (position < src.length) {
          const newline = src.indexOf('\n', position)
          const end = newline === -1 ? src.length : newline
          const line = src.slice(position, end)
          position = end + 1
          if ((doc.strip ? line.replace(/^\t+/, '') : line) === doc.delimiter) break
          lines.push(line)
        }
        doc.segment.heredocs.push(lines.join('\n'))
      }
      pendingHeredocs.length = 0
      i = position - 1
      continue
    }
    if (char === '&' && next === '&') { endSegment(); i += 1; continue }
    if (char === '|' && next === '|') { endSegment(); i += 1; continue }
    if (char === '|') { endSegment(); if (next === '&') i += 1; continue }
    if (char === ';') { endSegment(); if (next === ';') i += 1; continue }
    if (char === '&' && next === '>') {
      endWord()
      pending = src[i + 2] === '>' ? '>>' : '>'
      i += src[i + 2] === '>' ? 2 : 1
      continue
    }
    if (char === '&') { endSegment(); continue }
    if (char === '(' || char === ')') { endSegment(); continue }
    if (char === '>' || char === '<') {
      // 2> のような番号つきのリダイレクトの番号は語にしない。
      if (word !== null && /^\d+$/.test(word)) word = null
      endWord()
      const three = src.slice(i, i + 3)
      const two = src.slice(i, i + 2)
      if (three === '<<<') { pending = '<<<'; i += 2; continue }
      if (three === '<<-') { pending = '<<-'; i += 2; continue }
      if (two === '<<') { pending = '<<'; i += 1; continue }
      if (two === '>&' || two === '<&') {
        // 2>&1・>&2 は出力のつなぎ替えで、ファイルではない。
        let k = i + 2
        while (/[\d-]/.test(src[k] ?? '')) k += 1
        if (k > i + 2) { i = k - 1; continue }
        pending = '>'
        i += 1
        continue
      }
      if (two === '>>') { pending = '>>'; i += 1; continue }
      if (two === '>|' || two === '<>') { pending = two; i += 1; continue }
      pending = char
      continue
    }
    append(char)
  }
  endSegment()
  return segments
}

const ASSIGNMENT = /^[A-Za-z_][A-Za-z0-9_]*=/
// 前に付いても、動かすコマンドを変えない語。
const PREFIX_KEYWORDS = new Set(['if', 'then', 'else', 'elif', 'fi', 'do', 'done', 'while', 'until', '!', '{', '}', 'esac'])
const WRAPPERS = new Set(['sudo', 'env', 'time', 'nohup', 'command', 'exec', 'nice', 'builtin'])

/** 単純コマンドを、前に付いた代入・動かすコマンド・引数に分ける。 */
export function commandParts(segment) {
  const words = segment.words
  const assignments = []
  let k = 0
  while (k < words.length) {
    const word = words[k]
    if (PREFIX_KEYWORDS.has(word)) { k += 1; continue }
    if (ASSIGNMENT.test(word)) {
      const eq = word.indexOf('=')
      assignments.push([word.slice(0, eq), word.slice(eq + 1)])
      k += 1
      continue
    }
    if (WRAPPERS.has(word) || word === 'timeout') {
      k += 1
      while (k < words.length && words[k].startsWith('-')) k += 1
      // timeout は、動かすコマンドの前に時間を1つとる。
      if (word === 'timeout' && k < words.length) k += 1
      continue
    }
    break
  }
  const program = words[k] ?? null
  return { assignments, program: program?.split('/').pop() ?? null, args: words.slice(k + 1) }
}

/**
 * 語の変数（$NAME・${NAME}）と先頭の ~ を広げる。
 * 分からない変数や $( )・` ` が残るときは known: false。for で決めた変数は、並べた語を空白でつなぐ。
 */
export function expandWord(word, vars) {
  let text = String(word)
  if (text === '~' || text.startsWith('~/')) text = homedir() + text.slice(1)
  let known = true
  text = text.replace(/\$\{([A-Za-z_][A-Za-z0-9_]*)\}|\$([A-Za-z_][A-Za-z0-9_]*)/g, (match, braced, bare) => {
    const name = braced ?? bare
    const value = Object.hasOwn(vars, name) ? vars[name] : (name === 'HOME' ? homedir() : undefined)
    if (value === undefined) {
      known = false
      return match
    }
    return Array.isArray(value) ? value.join(' ') : value
  })
  // 広げられなかった $（$( )・${ } の書き方・$1 や $? など）や ` ` が残れば、中身は分からない。
  if (/\$[\w{(?@#*!$-]|`/.test(text)) known = false
  return { text, known }
}

export const SHELLS = new Set(['bash', 'sh', 'zsh', 'dash'])

/** git の全体のオプション（-C パス・-c 設定 など）を飛ばして、動かす場所（-C）・サブコマンド・残りを返す。 */
export function gitParts(args) {
  const dirs = []
  let k = 0
  while (k < args.length) {
    const arg = args[k]
    if (arg === '-C') { dirs.push(args[k + 1] ?? ''); k += 2; continue }
    if (arg === '-c' || arg === '--git-dir' || arg === '--work-tree' || arg === '--namespace') { k += 2; continue }
    if (arg.startsWith('-')) { k += 1; continue }
    break
  }
  return { dirs, sub: args[k] ?? null, rest: args.slice(k + 1) }
}

/**
 * コマンドの中の単純コマンドを、書いた順に、そのときの場所（cd の行き先）と変数を付けて渡す。
 * bash -c の中と、シェルへ渡したヒアドキュメントの中も読む。場所が分からなくなったら dir は null。
 */
export function walkCommand(command, { cwd = process.cwd(), onSegment }) {
  const vars = {}
  let dir = cwd
  const stack = []
  const walk = (text, depth) => {
    for (const segment of shellSegments(text)) {
      const { assignments, program, args } = commandParts(segment)
      for (const [name, value] of assignments) vars[name] = expandWord(value, vars).text
      if (!program) {
        onSegment({ segment, program, args: [], vars, dir })
        continue
      }
      if (['export', 'declare', 'local', 'readonly', 'typeset'].includes(program)) {
        for (const arg of args.filter((item) => ASSIGNMENT.test(item))) {
          const eq = arg.indexOf('=')
          vars[arg.slice(0, eq)] = expandWord(arg.slice(eq + 1), vars).text
        }
        continue
      }
      if (program === 'for' && args[1] === 'in') {
        vars[args[0]] = args.slice(2).map((arg) => expandWord(arg, vars).text)
        continue
      }
      if (program === 'cd' || program === 'pushd') {
        const target = args.find((arg) => !arg.startsWith('-') || arg === '-')
        if (program === 'pushd') stack.push(dir)
        if (target === undefined) dir = homedir()
        else if (target === '-' || dir === null) dir = null
        else {
          const expanded = expandWord(target, vars)
          dir = expanded.known ? resolve(dir, expanded.text) : null
        }
        continue
      }
      if (program === 'popd') {
        dir = stack.length ? stack.pop() : null
        continue
      }
      if (SHELLS.has(program) && depth < 4) {
        const flag = args.findIndex((arg) => /^-[a-z]*c$/.test(arg))
        if (flag !== -1 && args[flag + 1] !== undefined) {
          walk(args[flag + 1], depth + 1)
          continue
        }
        if (!args.some((arg) => !arg.startsWith('-')) && segment.heredocs.length) {
          for (const body of segment.heredocs) walk(body, depth + 1)
          continue
        }
      }
      onSegment({ segment, program, args, vars, dir })
    }
  }
  walk(command, 0)
}
