// 本文の段落の見え方（依頼台帳 requests/2026-10-29-reading-paragraph-layout.json）。
// 375px の Chromium で、基礎長文50本と長文読解42本（通常38本・語彙強化4本の全節）を和訳OFF・ONの両方で開き、次を確かめる。
//   OFF … 段落の中の文は改行されずに続けて流れ（文の箱がすべて inline）、段落の間は文の行よりはっきり空き、段落の第1文が字下げされる。
//   ON  … 英文と和訳の組を一文ごとに並べたまま、段落の間が段落の中の組の間よりはっきり空き、段落の第1文の英文が字下げされる。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import net from 'node:net'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import { chromium } from 'playwright'
import { BASIC_READING_PASSAGES } from '../src/data/basic-reading/index.js'
import { basicReadingParagraphs } from '../src/lib/basicReading.js'
import { ALL_PASSAGES } from '../src/data/passages.js'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const WIDTH = 375
const HEIGHT = 740
// 段落の間の空白の下限と、ONで段落の中の組の間の空白との差の下限（px）。
const PARAGRAPH_GAP = 28
const GAP_MARGIN = 12
// 字下げの下限（px）。
const INDENT = 12

let vite
let browser
let page
let base
const problems = []

const freePort = () => new Promise((resolve, reject) => {
  const server = net.createServer()
  server.on('error', reject)
  server.listen(0, '127.0.0.1', () => {
    const { port } = server.address()
    server.close(() => resolve(port))
  })
})

const settle = () => page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))

async function waitScreen(screen) {
  await page.waitForFunction((name) => {
    const main = document.querySelector('.study-app-content')
    return window.__paragraphTest?.store.getState().screen === name && main && !main.innerText.includes('画面を読み込み中')
  }, screen, { timeout: 30_000 })
  await settle()
}

async function open(screen, params = {}) {
  await page.evaluate(([name, screenParams]) => {
    const state = window.__paragraphTest.store.getState()
    state.closeSpeechSettings()
    state.navigate(name, screenParams)
  }, [screen, params])
  await waitScreen(screen)
}

const groupSizes = (sentences) => {
  const sizes = []
  for (const sentence of sentences) {
    if (!sizes.length || sentence.paragraphStart) sizes.push(0)
    sizes[sizes.length - 1] += 1
  }
  return sizes
}

// 開いている本文の段落を測って、決まりに合わない所を problems へ足す。
async function measure(where, expectedSizes, showJa) {
  const found = await page.evaluate(([label, sizes, ja, gapMin, margin, indentMin]) => {
    const out = []
    const paragraphs = [...document.querySelectorAll('[data-reading-paragraph]')]
    if (paragraphs.length !== sizes.length) return [`${label}: 段落が${paragraphs.length}個（本文は${sizes.length}段落）`]
    const pairGaps = []
    paragraphs.forEach((paragraph, index) => {
      const firsts = paragraph.querySelectorAll('[data-reading-paragraph-first]')
      if (firsts.length !== 1) out.push(`${label} 第${index + 1}段落: 字下げする所が${firsts.length}か所`)
      const first = firsts[0]
      if (first && parseFloat(getComputedStyle(first).textIndent) < indentMin) out.push(`${label} 第${index + 1}段落: 第1文が字下げされていない`)
      if (ja) {
        const pairs = [...paragraph.querySelectorAll('[data-sentence-translation-pair]')]
        if (pairs.length !== sizes[index]) out.push(`${label} 第${index + 1}段落: 組が${pairs.length}（文は${sizes[index]}）`)
        if (first && !pairs[0]?.contains(first)) out.push(`${label} 第${index + 1}段落: 字下げが段落の第1文ではない`)
        for (let i = 1; i < pairs.length; i += 1) {
          pairGaps.push(pairs[i].getBoundingClientRect().top - pairs[i - 1].getBoundingClientRect().bottom)
        }
      } else {
        // 文が流れる：段落の文の箱（段落の子と、押せる文）に、行を分ける箱（inline 以外）がない。
        // 語彙強化長文の重点語のボタンは語の中の小さな箱なので、文の流れは分けない。
        const boxes = [...first.children, ...first.querySelectorAll('[data-reading-sentence-tap]')]
        const blocks = boxes.filter((element) => getComputedStyle(element).display !== 'inline')
        if (blocks.length) out.push(`${label} 第${index + 1}段落: 文が流れず <${blocks[0].tagName.toLowerCase()}>（${getComputedStyle(blocks[0]).display}）で行が分かれる`)
        const taps = first.querySelectorAll('[data-reading-sentence-tap]')
        if (taps.length && taps.length !== sizes[index]) {
          out.push(`${label} 第${index + 1}段落: 押せる文が${taps.length}（文は${sizes[index]}）`)
        }
      }
      if (index > 0) {
        const gap = paragraph.getBoundingClientRect().top - paragraphs[index - 1].getBoundingClientRect().bottom
        if (gap < gapMin) out.push(`${label} 第${index}・${index + 1}段落の間が${Math.round(gap)}px`)
        if (ja && pairGaps.length && gap < Math.max(...pairGaps) + margin) out.push(`${label} 第${index}・${index + 1}段落の間（${Math.round(gap)}px）が文の組の間（${Math.round(Math.max(...pairGaps))}px）と見分けにくい`)
      }
    })
    if (document.documentElement.scrollWidth > window.innerWidth + 1) out.push(`${label}: 横にはみ出す`)
    return out
  }, [where, expectedSizes, showJa, PARAGRAPH_GAP, GAP_MARGIN, INDENT])
  problems.push(...found)
}

before(async () => {
  const port = await freePort()
  vite = await createServer({
    root: ROOT,
    logLevel: 'silent',
    // 動かしている開発サーバーの依存の置き場を書き換えない。
    cacheDir: 'node_modules/.vite-paragraph-layout-test',
    // 画面の依存を最初に見つけておく（途中で見つけるとページを読み直し、開いた画面が入口へ戻る）。
    optimizeDeps: { entries: ['index.html', 'src/**/*.{js,jsx}'] },
    server: { port, host: '127.0.0.1', strictPort: true, hmr: false, watch: null },
  })
  await vite.listen()
  base = `http://127.0.0.1:${port}/`
  browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  })
  // 外への通信（Firebase・フォント）は止める。開発版の Firebase は本番のデータベースにつながっている。
  await context.route((url) => !url.href.startsWith(base), (route) => route.abort())
  page = await context.newPage()
  await page.goto(base)
  await page.waitForSelector('.study-app-content', { timeout: 60_000 })
  await page.evaluate(async () => {
    const moduleUrl = (path) => performance.getEntriesByType('resource')
      .map((entry) => entry.name)
      .find((name) => new URL(name).pathname === path)
    const { useStore } = await import(moduleUrl('/src/store/useStore.js'))
    window.__paragraphTest = { store: useStore }
  })
})

after(async () => {
  await browser?.close()
  await vite?.close()
})

test('基礎長文50本の全段落：和訳OFF・ONとも、段落の間が空き、段落の第1文が字下げされ、OFFは文が続けて流れる', async () => {
  let paragraphs = 0
  let sentences = 0
  for (const passage of BASIC_READING_PASSAGES) {
    const sizes = basicReadingParagraphs(passage).map((group) => group.length)
    for (const showJa of [false, true]) {
      await open('basicReadingLesson', { passageId: passage.id, showJa })
      await measure(`${passage.id}（和訳${showJa ? 'ON' : 'OFF'}）`, sizes, showJa)
    }
    paragraphs += sizes.length
    sentences += passage.sentences.length
  }
  assert.equal(sentences, 611)
  assert.ok(paragraphs >= 150, `段落${paragraphs}`)
  assert.deepEqual(problems.slice(0, 20), [])
})

test('長文読解42本（語彙強化長文は全節）の全段落：和訳OFF・ONとも、段落の間が空き、段落の第1文が字下げされ、OFFは文が続けて流れる', async () => {
  assert.equal(ALL_PASSAGES.length, 42)
  const before = problems.length
  let screens = 0
  for (const passage of ALL_PASSAGES) {
    const parts = passage.extended ? passage.sections : [passage]
    for (const [sectionIndex, part] of parts.entries()) {
      for (const showJa of [false, true]) {
        if (passage.extended) {
          await page.evaluate(([id, index]) => sessionStorage.setItem(`study-app:extended-reading-section:v1:${id}`, String(index)), [passage.id, sectionIndex])
          await open('home')
        }
        await open('reader', { passageId: passage.id, showJa })
        await measure(`${passage.id}${passage.extended ? ` 節${sectionIndex + 1}` : ''}（和訳${showJa ? 'ON' : 'OFF'}）`, groupSizes(part.sentences), showJa)
        screens += 1
      }
    }
  }
  assert.ok(screens > 84)
  assert.deepEqual(problems.slice(before, before + 20), [])
})
