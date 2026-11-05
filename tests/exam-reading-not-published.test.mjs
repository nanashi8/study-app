// 入試長文（高校入試の長文の大問6本と参考書ページ）は、ウェブアプリの教材としては公開しない
// （依頼台帳 requests/2026-11-05-exam-reading-a3.json。利用者「ウェブアプリのコンテンツとしては公開せずに、pdfファイルで見せなさい。
// 非公開コンテンツに転用できるように資料は残しなさい。」）。資料は手元だけの private.local/exam-reading に置き、git に入れない。
// 公開リポジトリと公開版に、教材・画面・PDF・登録が入っていないことを確かめる。
import test from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const tracked = execFileSync('git', ['ls-files'], { cwd: ROOT, encoding: 'utf8' }).split('\n').filter(Boolean)

test('入試長文の教材・画面・PDF は、追跡ファイルにも公開のフォルダにもない', () => {
  const found = tracked.filter((path) => (
    /(^|\/)exam-reading(\/|\.|-|$)|ExamReading|examReading/.test(path) &&
    path !== 'tests/exam-reading-not-published.test.mjs' &&
    !path.startsWith('requests/')
  ))
  assert.deepEqual(found, [])
  for (const path of ['src/data/exam-reading', 'public/exam-reading', 'src/screens/ExamReading.jsx', 'src/lib/examReading.js']) {
    assert.equal(existsSync(new URL(`../${path}`, import.meta.url)), false, path)
  }
})

test('アプリの画面・英語ホーム・メニュー・教材の一覧に、入試長文の登録がない', () => {
  for (const path of ['src/App.jsx', 'src/screens/Home.jsx', 'src/lib/appMenu.js', 'src/lib/appHome.js', 'src/lib/contentSettings.js', 'src/lib/learningContentProgress.js', 'src/lib/learningContentCatalog.js']) {
    assert.doesNotMatch(read(path), /examReading|exam-reading|入試長文/, path)
  }
})

test('手元の資料のフォルダ（private.local）は git に入らない', () => {
  assert.ok(read('.gitignore').split('\n').includes('*.local'))
  assert.deepEqual(tracked.filter((path) => path.startsWith('private.local/')), [])
})
