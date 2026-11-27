import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test, { after } from 'node:test'
import {
  isJapaneseLabel,
  isJapaneseProse,
  nonJapaneseLabels,
  nonJapaneseTexts,
  turnTexts,
} from '../scripts/check-japanese-reply.mjs'

// 回答・進捗・ツールの説明文を日本語で書かせるフック（scripts/check-japanese-reply.mjs）。
// 2026-11-27、日本語で書く決まりがあるのに、作業者が進捗と最終の報告を英語で書いた。そのとき実際に書いた文で確かめる。

const SCRIPT = new URL('../scripts/check-japanese-reply.mjs', import.meta.url).pathname
const SETTINGS = JSON.parse(readFileSync(new URL('../.claude/settings.json', import.meta.url), 'utf8'))

const dir = mkdtempSync(join(tmpdir(), 'japanese-reply-'))
after(() => rmSync(dir, { recursive: true, force: true }))

// 2026-11-27 のセッションで実際に英語で書いた報告・進捗（写し）。
const ENGLISH_REPORTS = [
  'Both lists came back unchanged. Next, I\'ll check for errors and write the results into the ledger.',
  'After the swipe it read "63語・残り62語・覚えた1・まだ1・学習前61". Next, I\'ll open うれし\'s dictionary page and come back.',
  [
    'I checked both the 18-subject list and the shared list in the dev build at phone width (375px). In all three cases below, the counts changed with each swipe, and the state was unchanged after moving to a detail or study screen and coming back. I didn\'t change any code.',
    '',
    '**18-subject list**',
    '- **英単語:** I searched "make" and got 4 words.',
    '  - Swiping make right (まだ) changed the count line to "4語・残り3語・覚えた1・まだ1・学習前2", and the tab to 学習 2/4語.',
  ].join('\n'),
]

// 同じセッションで日本語で書いた報告（英単語・コード名・ファイルの道筋を混ぜたもの）。
const JAPANESE_REPORTS = [
  [
    '語の詳細から戻っても、絞り込んだ一覧の状態がそのまま残るようにしました。公開版にも出ています（2da2275e）。',
    '',
    '**直したこと**',
    '- 英単語の一覧（級・分野・単語帳の3画面）では、学習状況で絞り込んだ語を、一覧を離れるときの戻り状態に入れておくようにしました。',
    '- スマホの幅のブラウザでも確かめました。maker を覚えたにしてから別の語の詳細を開き、戻りました。',
    '- 全教材監査は、1回目にページのスクロールを確かめるテスト（`scroll-back-from-bottom`）が1件落ちました。',
  ].join('\n'),
  'CatalogRecordCounts を LearningContentCatalog と NormalLearningRecordList から使い、[VocabDecks.jsx](src/screens/VocabDecks.jsx) の pinnedIds を戻り状態に載せました。',
  '判定はこの会話の記録で正しく働きました。英語で書いた進捗・報告43件をすべて「日本語でない」と判定し、日本語の報告19件は通しました。',
]

test('実際に英語で書いた報告・進捗は日本語でないと判定する', () => {
  for (const text of ENGLISH_REPORTS) assert.equal(isJapaneseProse(text), false, text)
  // 1つずつは短くても、ターン全体が英語なら止める。
  assert.deepEqual(nonJapaneseTexts(['Tool loaded.', 'Done.']).length, 0)
  assert.ok(nonJapaneseTexts(['Tests pass.', 'Now checking the browser for the list screen.', 'All good, the counts are right now.']).length > 0)
})

test('英単語・コード名・道筋を混ぜた日本語の報告は止めない', () => {
  for (const text of JAPANESE_REPORTS) assert.equal(isJapaneseProse(text), true, text)
  assert.deepEqual(nonJapaneseTexts(JAPANESE_REPORTS), [])
  // コードの塊の中の英語は数えない。
  assert.equal(isJapaneseProse('次のコマンドで確かめます。\n```bash\nnpm run audit:all-content -- --verbose --reporter spec --only changed files here\n```'), true)
})

test('ツールの説明文：英語は止め、日本語は通す', () => {
  for (const text of ['List files in current directory', 'Show working tree status', 'Opens the Filters menu', 'Run tests']) {
    assert.equal(isJapaneseLabel(text), false, text)
  }
  for (const text of ['全教材監査を裏で流す', 'make の行を右へスワイプして「まだ」に記録', 'git の状態を見る', 'npm ci で依存を入れる']) {
    assert.equal(isJapaneseLabel(text), true, text)
  }
  // 入れ子の action_summary・作業の一覧・次の一歩の欄も見る。ファイルの中身は見ない。
  const batch = nonJapaneseLabels('mcp__Claude_Browser__browser_batch', {
    actions: [{ name: 'computer', input: { action: 'left_click', action_summary: 'Clicks the back button' } }],
  })
  assert.deepEqual(batch.map((item) => item.key), ['action_summary'])
  assert.equal(nonJapaneseLabels('mcp__ccd_turn__update_plan', { items: [{ content: 'Write the hook', status: 'pending' }] }).length, 1)
  assert.equal(nonJapaneseLabels('mcp__ccd_turn__wrap_up', { recap: 'The hook is in place and deployed.', actions: [{ label: 'Commit now' }] }).length, 2)
  assert.deepEqual(nonJapaneseLabels('Write', { file_path: 'a.js', content: 'export const english = "This file is all English text"' }), [])
})

const assistant = (...blocks) => ({ type: 'assistant', message: { content: blocks } })
const text = (value) => ({ type: 'text', text: value })
const toolUse = { type: 'tool_use', id: 't1', name: 'Bash', input: { command: 'ls', description: '一覧を見る' } }
const human = (value) => ({ type: 'user', message: { content: value } })
const toolResult = { type: 'user', message: { content: [{ type: 'tool_result', tool_use_id: 't1', content: 'ok' }] } }

function runStop(entries, extra = {}) {
  const transcript = join(dir, `t-${Math.random().toString(36).slice(2)}.jsonl`)
  writeFileSync(transcript, entries.map((entry) => JSON.stringify(entry)).join('\n'))
  const result = spawnSync('node', [SCRIPT, '--stop'], {
    input: JSON.stringify({ session_id: 's', transcript_path: transcript, ...extra }),
    encoding: 'utf8',
  })
  assert.equal(result.status, 0, result.stderr)
  return result.stdout.trim() ? JSON.parse(result.stdout) : null
}

test('Stop：このターンの英語の進捗・報告で止め、日本語なら終われる', () => {
  const englishTurn = [
    human('一覧も確認しなさい。'),
    assistant(text(ENGLISH_REPORTS[0]), toolUse),
    toolResult,
    assistant(text(ENGLISH_REPORTS[2])),
  ]
  const blocked = runStop(englishTurn)
  assert.equal(blocked?.decision, 'block')
  assert.match(blocked.reason, /日本語で書き直して/)

  const japaneseTurn = [human('一覧も確認しなさい。'), assistant(text(JAPANESE_REPORTS[2]), toolUse), toolResult, assistant(text(JAPANESE_REPORTS[0]))]
  assert.equal(runStop(japaneseTurn), null)

  // 前のターンの英語では止めない（ツールの結果は新しいターンにしない）。
  assert.equal(runStop([...englishTurn, human('次の依頼です。'), assistant(text(JAPANESE_REPORTS[1]), toolUse), toolResult, assistant(text(JAPANESE_REPORTS[0]))]), null)
})

test('Stop：止めたあとは最後の回答だけを見るので、日本語で書き直せば終われる', () => {
  const rewritten = [
    human('一覧も確認しなさい。'),
    assistant(text(ENGLISH_REPORTS[0]), toolUse),
    toolResult,
    assistant(text(ENGLISH_REPORTS[2])),
    { type: 'system', subtype: 'stop_hook_summary' },
    assistant(text(JAPANESE_REPORTS[0])),
  ]
  assert.equal(runStop(rewritten, { stop_hook_active: true }), null)
  assert.equal(runStop(rewritten, { stop_hook_active: true, last_assistant_message: ENGLISH_REPORTS[2] })?.decision, 'block')
  assert.equal(runStop(rewritten.slice(0, -1), { stop_hook_active: true })?.decision, 'block')
  assert.deepEqual(turnTexts(rewritten, { lastOnly: true }), [JAPANESE_REPORTS[0]])
})

test('ツールを動かす前に英語の説明文を止める（PreToolUse・終了コード2）', () => {
  const run = (input) => spawnSync('node', [SCRIPT, '--tool'], { input: JSON.stringify(input), encoding: 'utf8' })
  const blocked = run({ tool_name: 'Bash', tool_input: { command: 'git status', description: 'Show working tree status' } })
  assert.equal(blocked.status, 2)
  assert.match(blocked.stderr, /日本語に直して/)
  assert.equal(run({ tool_name: 'Bash', tool_input: { command: 'git status', description: '作業ツリーの状態を見る' } }).status, 0)
})

test('.claude/settings.json が全ツールの前と Stop でこの判定を呼ぶ', () => {
  const command = (mode) => `node "$CLAUDE_PROJECT_DIR/scripts/check-japanese-reply.mjs" --${mode}`
  const preToolUse = SETTINGS.hooks.PreToolUse.filter((entry) => !entry.matcher)
  assert.ok(preToolUse.some((entry) => entry.hooks.some((hook) => hook.command === command('tool'))), '全ツールの前（matcher なし）')
  assert.ok(SETTINGS.hooks.Stop.some((entry) => entry.hooks.some((hook) => hook.command === command('stop'))))
})
