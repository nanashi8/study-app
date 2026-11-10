import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, relative } from 'node:path'
import test from 'node:test'

import { isSensitivePath, publishableFiles, scanText } from '../scripts/audit-public-secrets.mjs'

test('公開禁止の鍵・トークン・個人メールを値なしの検出結果にする', () => {
  const pemMarker = '-----BEGIN ' + 'PRIVATE KEY-----'
  const tokenCandidate = 'ghp_' + 'A'.repeat(36)
  const personalEmail = ['student', 'private-school.jp'].join('@')
  const findings = scanText(
    'src/example.js',
    `${pemMarker}\nconst token = "${tokenCandidate}"\nconst email = "${personalEmail}"`,
  )

  assert.deepEqual(
    new Set(findings.map(({ rule }) => rule)),
    new Set(['private-key', 'github-token', 'literal-credential', 'email-address']),
  )
  assert.equal(findings.every((finding) => !('value' in finding)), true)
})

test('例示値と正確なFirebase Web APIキーだけを秘密情報扱いしない', () => {
  const firebaseConfig = readFileSync(new URL('../src/lib/firebaseConfig.js', import.meta.url), 'utf8')
  const expectedKey = firebaseConfig.match(/apiKey:\s*["'](AIza[0-9A-Za-z_-]{35})["']/)?.[1]
  assert.ok(expectedKey)

  assert.deepEqual(scanText('tests/example.js', 'student@example.com'), [])
  assert.deepEqual(scanText('src/lib/firebaseConfig.js', `apiKey: "${expectedKey}"`), [])
  assert.deepEqual(scanText('dist/assets/app.js', `apiKey: "${expectedKey}"`), [])

  const unexpectedKey = 'AIza' + (expectedKey.endsWith('A') ? 'B' : 'A').repeat(35)
  assert.equal(
    scanText('dist/assets/app.js', `apiKey: "${unexpectedKey}"`).some(({ rule }) => rule === 'google-api-key'),
    true,
  )
  assert.equal(
    scanText('dist/assets/app.js', `const leaked = "${'ghp_' + 'A'.repeat(36)}"`)
      .some(({ rule }) => rule === 'github-token'),
    true,
  )
})

test('環境ファイル・秘密鍵・サービスアカウント候補のファイル名を拒否する', () => {
  assert.equal(isSensitivePath('.env'), true)
  assert.equal(isSensitivePath('.env.production'), true)
  assert.equal(isSensitivePath('.env.example'), false)
  assert.equal(isSensitivePath('config/service-account.json'), true)
  assert.equal(isSensitivePath('certs/release.pem'), true)
})

// 使い捨てのリポジトリで動かす git。リポジトリの場所を渡す環境変数を外し、フックは使わない。
const REPOSITORY_ENV = /^GIT_(?:DIR|WORK_TREE|INDEX_FILE|PREFIX|OBJECT_DIRECTORY|ALTERNATE_OBJECT_DIRECTORIES|COMMON_DIR|NAMESPACE|QUARANTINE_PATH)$/
const GIT_ENV = {
  ...Object.fromEntries(Object.entries(process.env).filter(([key]) => !REPOSITORY_ENV.test(key))),
  GIT_AUTHOR_NAME: 'test',
  GIT_AUTHOR_EMAIL: 'test@example.com',
  GIT_COMMITTER_NAME: 'test',
  GIT_COMMITTER_EMAIL: 'test@example.com',
}
const git = (dir, ...args) => execFileSync('git', ['-C', dir, '-c', 'core.hooksPath=/dev/null', '-c', 'commit.gpgsign=false', ...args], {
  encoding: 'utf8',
  env: GIT_ENV,
  stdio: ['ignore', 'pipe', 'pipe'],
})

function scratchTree() {
  const dir = realpathSync(mkdtempSync(join(tmpdir(), 'secrets-audit-')))
  const write = (name, text = 'x\n') => {
    mkdirSync(join(dir, name, '..'), { recursive: true })
    writeFileSync(join(dir, name), text)
  }
  write('.gitignore', '*.local\nnode_modules\n')
  write('src/tracked.js')
  write('src/removed.js')
  write('src/untracked.js')
  write('drafts.local/draft.mjs')
  write('private.local/notes/memo.txt')
  write('settings.local')
  write('node_modules/pkg/index.js')
  symlinkSync(join(dir, 'src/tracked.js'), join(dir, 'src/link.js'))
  return { dir, list: () => publishableFiles(dir).map((file) => relative(dir, file)) }
}

test('今のツリーの検査は、git が無視する下書きを読まず、追跡するファイルと無視していない未追跡のファイルは全部読む', () => {
  const { dir, list } = scratchTree()
  try {
    // git のないフォルダ（push の前に取り出したコミットの中身など）では、フォルダを歩いて全部読む。
    assert.deepEqual(list().sort(), [
      '.gitignore',
      'drafts.local/draft.mjs',
      'private.local/notes/memo.txt',
      'settings.local',
      'src/removed.js',
      'src/tracked.js',
      'src/untracked.js',
    ])
    git(dir, 'init', '-q')
    git(dir, 'add', '.gitignore', 'src/tracked.js', 'src/removed.js')
    git(dir, 'commit', '-q', '-m', 'first')
    rmSync(join(dir, 'src/removed.js'))
    // 無視する下書き（*.local）は読まない。消したファイルとリンクも読まない。まだ追跡していない src/untracked.js は読む。
    assert.deepEqual(list(), ['.gitignore', 'src/tracked.js', 'src/untracked.js'])
    // 無視するファイルでも、無理に追跡させたもの（git add -f）は公開されるので読む。
    git(dir, 'add', '-f', 'drafts.local/draft.mjs')
    assert.deepEqual(list(), ['.gitignore', 'drafts.local/draft.mjs', 'src/tracked.js', 'src/untracked.js'])
    // リポジトリのいちばん上でないフォルダは、フォルダを歩いて全部読む。
    assert.deepEqual(publishableFiles(join(dir, 'private.local')).map((file) => relative(dir, file)), ['private.local/notes/memo.txt'])
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('このリポジトリの今のツリーの検査は、git が無視するファイルを1つも読まず、追跡するファイルを全部読む', () => {
  const root = realpathSync(new URL('..', import.meta.url).pathname)
  const scanned = new Set(publishableFiles(root).map((file) => relative(root, file)))
  assert.ok(scanned.size > 1000)
  const lines = (...args) => git(root, ...args).split('\0').filter(Boolean)
  const ignored = lines('ls-files', '-z', '--others', '--ignored', '--exclude-standard')
  assert.deepEqual(ignored.filter((name) => scanned.has(name)), [])
  const deleted = new Set(lines('ls-files', '-z', '--deleted'))
  const expected = [...lines('ls-files', '-z', '--cached'), ...lines('ls-files', '-z', '--others', '--exclude-standard')]
    .filter((name) => !deleted.has(name))
  assert.deepEqual(expected.filter((name) => !scanned.has(name)), [])
})
