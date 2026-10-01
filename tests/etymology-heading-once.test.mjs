// 「語の成り立ち」の見出しを、どの画面でも1回だけ出すことを守るテスト（requests/2026-10-02-etymology-heading-once.json）。
//
// 2026-10-02 まで、辞書ページは欄の見出し「語の成り立ち」と、その中の EtymologyBlock が本文の箱に付ける見出し
// 「語の成り立ち」が2回続けて出ていた（辞書の8,929語すべてに本文があるので、全語で重なっていた）。
// 暗記カードの裏も、欄の見出し「語源」と本文の箱の見出しが重なっていた。
// 見出しの数は語の種類（語根カードがあるか・本文があるか・自作単語か）だけで決まる作りなので、
//   作り … EtymologyBlock の本文の箱に見出しを付けず、3画面の欄がそれぞれ1つだけ見出しを置く
//   画面 … 375px の Chromium で、3画面×語の種類ごとに見出しが1回だけ出て、横にはみ出さない
// の2つで全語を確かめる。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { ALL_WORDS, etymologyCardsForWord, etymologyStoryForWord } from '../src/data/vocab.js'
import { quizMeaning } from '../src/data/compact.js'
import { startCustomCardBrowser } from './custom-cards-browser.mjs'

const source = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const KINDS = {
  rootsAndStory: 'export', // 語根カードもある語
  storyOnly: 'apple', // 本文だけの語
}

test('語の種類：辞書の8,929語すべてに本文があり、語根カードもある語4,026・本文だけの語4,903（語根カードだけの語はない）', () => {
  const counts = { rootsAndStory: 0, storyOnly: 0, rootsOnly: 0, none: 0 }
  for (const word of ALL_WORDS) {
    const story = Boolean(etymologyStoryForWord(word))
    const roots = etymologyCardsForWord(word).length > 0
    counts[story && roots ? 'rootsAndStory' : story ? 'storyOnly' : roots ? 'rootsOnly' : 'none'] += 1
  }
  assert.deepEqual(counts, { rootsAndStory: 4_026, storyOnly: 4_903, rootsOnly: 0, none: 0 })
  assert.ok(etymologyCardsForWord(ALL_WORDS.find((word) => word.id === KINDS.rootsAndStory)).length > 0)
  assert.equal(etymologyCardsForWord(ALL_WORDS.find((word) => word.id === KINDS.storyOnly)).length, 0)
})

test('作り：本文の箱には見出しを付けず、語の成り立ちを出す3画面の欄と自作単語の欄が、それぞれ見出しを1つだけ置く', () => {
  const bits = source('src/components/WordBits.jsx')
  const block = bits.slice(bits.indexOf('export function EtymologyBlock'), bits.indexOf('export function RelatedWords'))
  assert.ok(block.includes('data-reviewed-word-story'), 'EtymologyBlock の本文の箱')
  assert.ok(!block.includes('>語の成り立ち<'), 'EtymologyBlock の本文の箱に見出しを付けない')
  const custom = bits.slice(bits.indexOf('export function CustomEtymology'), bits.indexOf('export function OtherSenses'))
  assert.equal(custom.match(/data-etymology-heading/gu)?.length, 1, '自作単語の欄の見出し')
  for (const screen of ['src/screens/WordDetail.jsx', 'src/screens/VocabStudy.jsx', 'src/screens/VocabQuiz.jsx']) {
    const text = source(screen)
    assert.equal(text.match(/data-etymology-heading>語の成り立ち</gu)?.length, 1, `${screen}: 欄の見出しは1つ`)
    assert.ok(text.includes('<EtymologyBlock'), `${screen}: 語の成り立ちの欄`)
  }
})

let ui

before(async () => {
  ui = await startCustomCardBrowser({ cacheDir: 'node_modules/.vite-etymology-heading-test' })
})

after(async () => {
  await ui?.close()
})

// 画面に出ている「語の成り立ち」という見出しの数（ほかの文字を持たない要素）と、印の付いた見出しの数。
const headingCount = () => ui.page.evaluate(() => {
  const main = document.querySelector('.study-app-content')
  const exact = [...main.querySelectorAll('*')]
    .filter((element) => element.textContent.trim() === '語の成り立ち' && ![...element.children].some((child) => child.textContent.trim() === '語の成り立ち'))
  return { exact: exact.length, marked: main.querySelectorAll('[data-etymology-heading]').length }
})

async function answerQuiz(word) {
  await ui.page.locator('.study-app-content button', { hasText: quizMeaning(word) }).first().click()
  await ui.page.waitForSelector('[data-etymology-heading], [data-custom-word-etymology]')
  await ui.settle()
}

test('辞書ページ・暗記カードの裏・単語テストの答え合わせで、語根カードもある語と本文だけの語の見出しが1回だけ出る', async () => {
  for (const [kind, id] of Object.entries(KINDS)) {
    const word = ALL_WORDS.find((candidate) => candidate.id === id)
    await ui.open('wordDetail', { id })
    await ui.page.waitForSelector('[data-reviewed-word-story]')
    assert.deepEqual(await headingCount(), { exact: 1, marked: 1 }, `辞書ページ ${kind} ${id}`)
    await ui.checkWidth(`辞書ページ ${id}`)

    await ui.act('setContentSetting', null, 'revealAnswers', true)
    try {
      await ui.open('vocabStudy', { source: { type: 'mylist', ids: [id] }, title: '語の成り立ち', mode: 'study' })
      await ui.page.waitForSelector('[data-reviewed-word-story]')
      assert.deepEqual(await headingCount(), { exact: 1, marked: 1 }, `暗記カードの裏 ${kind} ${id}`)
      await ui.checkWidth(`暗記カードの裏 ${id}`)
    } finally {
      await ui.act('setContentSetting', null, 'revealAnswers', false)
    }

    await ui.open('wordDetail', { id })
    await ui.open('vocabQuiz', { source: { type: 'mylist', ids: [id] }, title: '語の成り立ち', mode: 'quiz' })
    await answerQuiz(word)
    assert.deepEqual(await headingCount(), { exact: 1, marked: 1 }, `テストの答え合わせ ${kind} ${id}`)
    await ui.checkWidth(`テストの答え合わせ ${id}`)
  }
})

test('自作単語の語の成り立ちも、辞書ページ・暗記カードの裏・テストの答え合わせで見出しが1回だけ出る', async () => {
  const saved = await ui.act('saveCustomWord', {
    word: 'glimmerous',
    meanings: 'かすかに光る',
    pos: '形',
    level: '2',
    etymology: 'glimmer（かすかな光）に、形容詞を作る -ous を付けた自分用の語。',
  })
  assert.equal(saved.status, 'saved')
  try {
    await ui.open('wordDetail', { id: saved.id })
    await ui.page.waitForSelector('[data-custom-word-etymology]')
    assert.deepEqual(await headingCount(), { exact: 1, marked: 1 }, '自作単語の辞書ページ')

    await ui.act('setContentSetting', null, 'revealAnswers', true)
    try {
      await ui.open('vocabStudy', { source: { type: 'mylist', ids: [saved.id] }, title: '語の成り立ち', mode: 'study' })
      await ui.page.waitForSelector('[data-custom-word-etymology]')
      assert.deepEqual(await headingCount(), { exact: 1, marked: 1 }, '自作単語の暗記カードの裏')
    } finally {
      await ui.act('setContentSetting', null, 'revealAnswers', false)
    }

    await ui.open('wordDetail', { id: saved.id })
    await ui.open('vocabQuiz', { source: { type: 'mylist', ids: [saved.id] }, title: '語の成り立ち', mode: 'quiz' })
    await ui.page.locator('.study-app-content button', { hasText: 'かすかに光る' }).first().click()
    await ui.page.waitForSelector('[data-custom-word-etymology]')
    await ui.settle()
    assert.deepEqual(await headingCount(), { exact: 1, marked: 1 }, '自作単語のテストの答え合わせ')
    await ui.checkWidth('自作単語のテストの答え合わせ')
  } finally {
    await ui.act('deleteCustomWord', saved.id)
  }
})

test('語の成り立ちの欄は、375px の幅で横にはみ出さない', () => {
  assert.deepEqual(ui.overflow, [])
})
