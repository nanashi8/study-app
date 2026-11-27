#!/usr/bin/env node
// 作業者の回答・進捗・ツールの説明文を日本語で書かせる（CLAUDE.md「報告の書き方」）。
// Claude Code のフック（.claude/settings.json）から呼ばれる。
//   --tool : ツールを動かす前（PreToolUse）。説明文（description・action_summary・recap など）が日本語でなければ止める。
//   --stop : ターンを終えるとき（Stop）。このターンに作業者が書いた文が日本語でなければ終わらせず、書き直させる。
//            止めたあと（stop_hook_active）は、最後の回答だけを見る（前に書いた英語の文で止まり続けないため）。
// 判定は文の中の日本語の字と英語の語を数えて決める。コードの塊・`コード`・URL・ファイルの道筋は数えない。
import { readFileSync } from 'node:fs'

const JAPANESE = /[぀-ヿ㐀-鿿ｦ-ﾟ]/g
const ENGLISH_WORD = /[A-Za-z][A-Za-z'’-]*[A-Za-z]/g

/** 数えない部分（コード・URL・道筋・リンク先）を除いた文。 */
export function proseOf(text) {
  return String(text ?? '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`\n]*`/g, ' ')
    .replace(/\]\([^)]*\)/g, '] ')
    .replace(/\bhttps?:\/\/\S+/g, ' ')
    .replace(/[\w.-]+@[\w.-]+/g, ' ')
    .replace(/(?:[\w.~-]*\/)+[\w.-]+/g, ' ')
    .replace(/<[^>\n]*>/g, ' ')
}

/** 日本語の字の数と英語の語の数。 */
export function languageCounts(text) {
  const prose = proseOf(text)
  return {
    japanese: (prose.match(JAPANESE) ?? []).length,
    english: (prose.match(ENGLISH_WORD) ?? []).length,
  }
}

/**
 * 回答・進捗の文が日本語か。英語の語が多く、日本語の字が英語の語の2倍に届かなければ日本語でない。
 * 日本語の文は1語に2字以上を使うので、英単語やコード名を混ぜた日本語の文はこれを満たす。
 */
export function isJapaneseProse(text) {
  const { japanese, english } = languageCounts(text)
  if (english < 10) return !(english >= 6 && japanese === 0)
  return japanese >= english * 2
}

/** ツールの説明文が日本語か。英語の語が2つ以上あって日本語の字が1つもなければ日本語でない。 */
export function isJapaneseLabel(text) {
  const { japanese, english } = languageCounts(text)
  if (english >= 2 && japanese === 0) return false
  return english < 8 || japanese >= english
}

// 説明文として利用者に見える欄。ファイルの中身（content・new_string など）は見ない。
const LABEL_KEYS = new Set(['description', 'action_summary', 'recap', 'ask', 'caption', 'statusMessage'])

/** ツールの入力から、日本語でない説明文を {key, text} で返す。 */
export function nonJapaneseLabels(toolName, toolInput) {
  const found = []
  const visit = (value, key) => {
    if (typeof value === 'string') {
      if (LABEL_KEYS.has(key) && !isJapaneseLabel(value)) found.push({ key, text: value })
      return
    }
    if (Array.isArray(value)) {
      for (const item of value) visit(item, key)
      return
    }
    if (value && typeof value === 'object') {
      for (const [childKey, child] of Object.entries(value)) visit(child, childKey)
    }
  }
  visit(toolInput, '')
  // 作業の一覧（画面の下に出る）と、次の一歩のボタンの文字も利用者が読む。
  if (/update_plan$/.test(toolName ?? '')) {
    for (const item of toolInput?.items ?? []) {
      if (typeof item?.content === 'string' && !isJapaneseLabel(item.content)) found.push({ key: 'items.content', text: item.content })
    }
  }
  if (/wrap_up$/.test(toolName ?? '')) {
    for (const action of toolInput?.actions ?? []) {
      if (typeof action?.label === 'string' && !isJapaneseLabel(action.label)) found.push({ key: 'actions.label', text: action.label })
    }
  }
  return found
}

const isToolResultOnly = (content) => Array.isArray(content)
  && content.length > 0
  && content.every((block) => block?.type === 'tool_result')

/**
 * 会話の記録（JSONL の行を読んだもの）から、いまのターンに作業者が書いた文を返す。
 * ターンは、最後の利用者の発言（ツールの結果・フックの知らせでない user の行）のあと。
 * lastOnly のときは、最後の文（止められて書き直した最後の回答）だけを返す。
 */
export function turnTexts(entries, { lastOnly = false } = {}) {
  let start = 0
  entries.forEach((entry, index) => {
    if (entry?.type !== 'user' || entry.isMeta) return
    if (isToolResultOnly(entry.message?.content)) return
    start = index + 1
  })
  let texts = []
  for (const entry of entries.slice(start)) {
    if (entry?.type !== 'assistant') continue
    const content = entry.message?.content
    const blocks = typeof content === 'string' ? [{ type: 'text', text: content }] : content ?? []
    for (const block of blocks) {
      if (block?.type === 'text' && block.text?.trim()) texts.push(block.text)
    }
  }
  return lastOnly ? texts.slice(-1) : texts
}

/** 文の並びのうち、日本語でないもの。1つずつと、全部をつないだものの両方で見る。 */
export function nonJapaneseTexts(texts) {
  const bad = texts.filter((text) => !isJapaneseProse(text))
  if (!bad.length && texts.length > 1 && !isJapaneseProse(texts.join('\n'))) return [...texts]
  return bad
}

const readInput = () => {
  if (process.stdin.isTTY) return {}
  try {
    return JSON.parse(readFileSync(0, 'utf8') || '{}')
  } catch {
    return {}
  }
}

const readTranscript = (path) => {
  try {
    return readFileSync(path, 'utf8').split('\n').filter(Boolean).flatMap((line) => {
      try {
        return [JSON.parse(line)]
      } catch {
        return []
      }
    })
  } catch {
    return []
  }
}

const quote = (text) => {
  const one = String(text).replace(/\s+/g, ' ').trim()
  return one.length > 80 ? `${one.slice(0, 80)}…` : one
}

function main() {
  const input = readInput()
  if (process.argv.includes('--tool')) {
    const found = nonJapaneseLabels(input.tool_name, input.tool_input)
    if (!found.length) return 0
    console.error([
      'ツールの説明文は日本語で書く（CLAUDE.md「報告の書き方」）。次の欄を日本語に直してから呼び直すこと。',
      ...found.map(({ key, text }) => `- ${key}: 「${quote(text)}」`),
    ].join('\n'))
    return 2
  }
  if (process.argv.includes('--stop')) {
    const lastOnly = input.stop_hook_active === true
    let texts = turnTexts(readTranscript(input.transcript_path), { lastOnly })
    if (lastOnly && typeof input.last_assistant_message === 'string' && input.last_assistant_message.trim()) {
      texts = [input.last_assistant_message]
    }
    const bad = nonJapaneseTexts(texts)
    if (!bad.length) return 0
    const reason = [
      '回答・進捗は日本語で書く（CLAUDE.md「報告の書き方」）。このターンに日本語でない文がある。',
      'ターンを終えずに、利用者への報告を日本語で書き直して最後に出すこと（コード名・英単語の例はそのままでよい）。',
      ...bad.slice(0, 5).map((text) => `- 「${quote(text)}」`),
    ].join('\n')
    console.log(JSON.stringify({ decision: 'block', reason }))
    return 0
  }
  console.log('使い方: node scripts/check-japanese-reply.mjs --tool | --stop（フックの入力を標準入力で渡す）')
  return 0
}

if (import.meta.url === `file://${process.argv[1]}`) process.exitCode = main()
