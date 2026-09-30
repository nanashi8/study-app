// 一番下までスクロールすると上へ戻れなくなる不具合の依頼（requests/2026-09-28-scroll-back-from-bottom.json）の受け入れ条件。
// 2026-09-28 利用者: たまにコンテンツを見ようと一番下までスクロールするとそこから上にスクロールできない不具合がある。
//   原因を突き止めて報告し修正しなさい。
//
// 原因：ページそのもの（文書）がスクロールできた。外枠の高さは見えている範囲の実測値（visualViewport）で書くが、
// html・body は最初の高さ（iPhone の Safari ではツールバーが出ているときの高さ）のままで、はみ出しを切っていなかった。
// ツールバーが縮むと見えている範囲がページより高くなり、ツールバーが戻る途中は外枠が見えている範囲より高く残る。その差の
// ぶんページが動ける。欄やシートを一番下まで送った先の指はページへ渡ってページをずらし、上部の「戻る・メニュー」と一覧の
// 先頭が画面の上へ出る。一覧の main は指の動きをページへ渡さない（overscroll-behavior: contain）ので、main の中からは
// 戻せない。ページの跳ね返し止め（overscroll-behavior）も body に書いてあり、ページには効いていなかった（効くのは html）。
//
// 実ブラウザ（Playwright の Chromium・スマホの大きさ・指の送りは CDP の synthesizeScrollGesture）で全画面を動かす。
// 見えている範囲の値は、iPhone の Safari が返す値を外枠の計算（src/lib/safeArea.js の syncSafeArea）へ渡して作る。
// 標準の大きさで中身が収まり、縦に動く欄がない画面（社会・理科の暗記カード）は、小さい画面（iPhone SE の Safari で見える範囲）で確かめる。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import net from 'node:net'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import { chromium } from 'playwright'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
// iPhone の Safari でツールバーが出ているときのページの高さ（html・body の 100%）と、ツールバーが縮んだときの差。
const PAGE_HEIGHT = 664
const TOOLBAR = 81
// 標準の大きさ（390×PAGE_HEIGHT）では中身が画面に収まり、縦に動く欄がない画面を確かめる大きさ。
// iPhone SE（第2・第3世代、画面 375×667）の Safari で、ツールバーが出ているときに見えるおよその範囲。
const SMALL_VIEWPORT = { width: 375, height: 548 }
// 標準の大きさでは縦に動く欄がなく、小さい画面で確かめる画面（暗記カードの裏が意味だけで短い、社会・理科の暗記カード）。
// ここにない画面で縦に動く欄がなくなったら、テストが止める（理由を確かめてから足す）。
const SMALL_ONLY_SCREENS = ['socialStudy', 'scienceStudy']
// 全画面を確かめるときに同時に動かす画面の数。
const PHONES = 4

// App.jsx の SCREENS の全画面。画面を足せば自動で対象に入る。
const SCREEN_NAMES = (() => {
  const source = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8')
  const start = source.indexOf('const SCREENS = {')
  const block = source.slice(start, source.indexOf('}', start))
  return [...block.matchAll(/^\s+(\w+):/gm)].map((match) => match[1])
})()

// 見えている範囲の状態。iPhone の Safari が返す値を外枠の計算へ渡す（Chromium の実際の見えている範囲は変えない）。
const FRAME_STATES = [
  { id: 'normal', label: 'ふつう' },
  { id: 'toolbar-collapsed', label: 'ツールバーが縮んだ（見えている範囲がページより高い）' },
  { id: 'toolbar-returning', label: 'ツールバーが戻る途中（外枠が見えている範囲より高い）' },
  { id: 'keyboard', label: 'キーボードが出ている' },
  { id: 'zoomed', label: '拡大している' },
]

let vite
let browser
let base
let paramsByScreen
const phones = []

const freePort = () => new Promise((resolve, reject) => {
  const server = net.createServer()
  server.on('error', reject)
  server.listen(0, '127.0.0.1', () => {
    const { port } = server.address()
    server.close(() => resolve(port))
  })
})

// ページ（html・body）・外枠・上部バーの位置。ページが動いていないかを見る。
function assertPageStill(state, where) {
  assert.equal(state.pageRange <= 0, true, `${where}: ページにスクロールできるはみ出しがある（${state.pageRange}px）`)
  assert.equal(state.pageY, 0, `${where}: ページが ${state.pageY}px 動いた`)
  assert.equal(state.barTop, 0, `${where}: 上部の「戻る・メニュー」が画面の上端にない（${state.barTop}px）`)
  assert.equal(state.shellTop, 0, `${where}: 外枠が画面の上端からずれた（${state.shellTop}px）`)
  assert.equal(state.surfaceTop, 0, `${where}: 外枠の中身がずれた（${state.surfaceTop}px）`)
}

// スマホの大きさの画面1つ。全画面の確かめは、何台かに画面を分けて同時に動かす。
class Phone {
  static async open() {
    const context = await browser.newContext({
      viewport: { width: 390, height: PAGE_HEIGHT },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
    })
    // 外への通信（Firebase・フォント）は止める。開発版の Firebase は本番のデータベースにつながっている。
    await context.route((url) => !url.href.startsWith(base), (route) => route.abort())
    const page = await context.newPage()
    const phone = new Phone(page, await context.newCDPSession(page))
    page.on('load', () => { phone.loads += 1 })
    await page.goto(base)
    await phone.ensureApp()
    return phone
  }

  constructor(page, cdp) {
    this.page = page
    this.cdp = cdp
    // ページを読み込んだ回数。読み直すと、開いていた画面・差し込んだ決まりが消える。
    this.loads = 0
  }

  async ensureApp() {
    await this.page.waitForSelector('.study-app-content', { timeout: 30_000 })
    const started = await this.page.evaluate(async () => {
      if (window.__scrollTest) return false
      const moduleUrl = (path) => performance.getEntriesByType('resource')
        .map((entry) => entry.name)
        .find((name) => new URL(name).pathname === path)
      const store = (await import(moduleUrl('/src/store/useStore.js'))).useStore
      const safeArea = await import(moduleUrl('/src/lib/safeArea.js') ?? '/src/lib/safeArea.js')
      const bind = (target, value) => (typeof value === 'function' ? value.bind(target) : value)
      // visualViewport などだけを差し替えた window を外枠の計算へ渡す。
      const fakeView = (visualViewport, overrides = {}) => new Proxy(window, {
        get: (target, key) => {
          if (key === 'visualViewport') return { addEventListener() {}, removeEventListener() {}, ...visualViewport }
          if (key in overrides) return overrides[key]
          return bind(target, Reflect.get(target, key))
        },
      })
      const typingDocument = new Proxy(document, {
        get: (target, key) => (key === 'activeElement' ? { tagName: 'TEXTAREA' } : bind(target, Reflect.get(target, key))),
      })
      const applyFrameState = (id, toolbar) => {
        const height = window.innerHeight
        safeArea.syncSafeArea(window)
        if (id === 'toolbar-collapsed') {
          safeArea.syncSafeArea(fakeView({ height: height + toolbar, offsetTop: 0, scale: 1 }, { innerHeight: height + toolbar }))
        } else if (id === 'toolbar-returning') {
          // ツールバーは戻ったが、外枠はまだ縮んでいたときの高さのまま（resize が届く前）。
          document.documentElement.style.setProperty(safeArea.APP_FRAME_HEIGHT_VAR, `${height + toolbar}px`)
        } else if (id === 'keyboard') {
          safeArea.syncSafeArea(fakeView({ height: height - 300, offsetTop: 120, scale: 1 }, { document: typingDocument }))
        } else if (id === 'zoomed') {
          safeArea.syncSafeArea(fakeView({ height: height / 2, offsetTop: 160, scale: 2 }))
        }
        return getComputedStyle(document.documentElement).getPropertyValue(safeArea.APP_FRAME_HEIGHT_VAR).trim()
      }
      const pageState = () => {
        const scroller = document.scrollingElement
        const bar = document.querySelector('[data-global-menu-bar]').getBoundingClientRect()
        return {
          pageY: Math.round(window.scrollY),
          pageRange: scroller.scrollHeight - scroller.clientHeight,
          barTop: Math.round(bar.top),
          barBottom: Math.round(bar.bottom),
          surfaceTop: document.querySelector('.study-app-surface').scrollTop,
          shellTop: Math.round(document.querySelector('.study-app-viewport').getBoundingClientRect().top),
        }
      }
      window.__scrollTest = { store, applyFrameState, pageState }
      return true
    })
    // 起動の直後は、外枠の高さを 0.4 秒後・1.2 秒後にも測り直す（src/lib/safeArea.js の startSafeAreaSync）。
    // 読み込んだばかりのページで外枠の状態を差し替えると、その測り直しで元へ戻るので、終わるまで待つ。
    if (started) await this.page.waitForTimeout(1300)
  }

  // 見えている範囲の大きさを変える。外枠は resize を受けて測り直す。
  async resize(viewport) {
    await this.page.setViewportSize(viewport)
    await this.page.waitForTimeout(150)
    await this.settle()
  }

  async evaluate(fn, arg) {
    for (let attempt = 0; ; attempt += 1) {
      try {
        await this.ensureApp()
        return await this.page.evaluate(fn, arg)
      } catch (error) {
        if (attempt >= 3) throw error
        await this.page.waitForTimeout(1500)
      }
    }
  }

  // 描き終わるまで待つ（2フレーム）。
  settle() {
    return this.page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
  }

  // 画面の引数。何もないと空の表示になる画面には、教材の最初の項目などを渡して中身を出す。
  screenParams() {
    return this.evaluate(async () => {
      const [
        vocab, passages, math, mathHistory, strands, grammarReference, writing, writingExam,
        koten, kotenInterpretations, kotenGrammar, kotenCulture, literature, subjects,
      ] = await Promise.all([
        '/src/data/vocab.js',
        '/src/data/passages.js',
        '/src/data/math.js',
        '/src/data/math-history.js',
        '/src/data/grammar-strands.js',
        '/src/data/grammar-reference/index.js',
        '/src/data/writing.js',
        '/src/data/writing-exam.js',
        '/src/data/koten.js',
        '/src/data/koten-interpretations.js',
        '/src/data/koten-grammar.js',
        '/src/data/koten-culture.js',
        '/src/data/public-domain-literature.js',
        '/src/data/subjects/index.js',
      ].map((path) => import(path)))
      const ids = (items, count) => items.slice(0, count).map((item) => item.id)
      const rootPack = vocab.ETYMOLOGY_PACKS.find((pack) => String(pack.id).startsWith('root:'))
      const passageId = passages.ALL_PASSAGES.at(-1).id
      const mathUnit = math.MATH_UNITS.find((unit) => math.problemsForUnit(unit.id).length > 0)
      return {
        vocabStudy: { source: { type: 'all' }, title: '単語' },
        vocabQuiz: { source: { type: 'all' }, title: '単語' },
        wordDetail: { id: vocab.ALL_WORDS.find((word) => word.word === 'take').id },
        rootDetail: { rootId: String(rootPack.id).slice('root:'.length) },
        etymologyPack: { packId: vocab.ETYMOLOGY_PACKS[0].id },
        etymologyStudy: { ids: ids(vocab.ETYMOLOGY_PACKS, 10), title: '語源' },
        etymologyQuiz: { ids: ids(vocab.ETYMOLOGY_PACKS, 10) },
        readingPrep: { passageId },
        reader: { passageId },
        readingSummary: { passageId },
        literatureReader: { workId: literature.PUBLIC_DOMAIN_LITERATURE[0].id },
        vocabSearch: { q: 'take' },
        mathIntro: { unitId: mathUnit.id },
        mathSolve: { unitId: mathUnit.id },
        mathExamUnit: { unitId: mathUnit.id },
        mathExamSolve: { unitId: mathUnit.id },
        mathStory: { chapterId: mathHistory.MATH_HISTORY_CHAPTERS[0].id },
        grammarReference: { unitId: grammarReference.GRAMMAR_REFERENCE_UNITS[0].id },
        grammarStrandReference: { strandId: strands.GRAMMAR_STRANDS[0].id },
        writingPlay: { exerciseId: writing.WRITING_EXERCISES[0].id, mode: 'free' },
        writingExam: { unitId: writingExam.WRITING_EXAM_UNITS[0].id, mode: 'free' },
        kotenStudy: { ids: ids(koten.KOTEN_WORDS, 10) },
        kotenQuiz: { ids: ids(koten.KOTEN_WORDS, 10) },
        kotenWordDetail: { id: koten.KOTEN_WORDS[0].id },
        kotenInterpretationPrep: { ids: ids(kotenInterpretations.KOTEN_INTERPRETATIONS, 5) },
        kotenInterpretationQuiz: { ids: ids(kotenInterpretations.KOTEN_INTERPRETATIONS, 5) },
        kotenGrammarStudy: { ids: ids(kotenGrammar.KOTEN_GRAMMAR, 10) },
        kotenGrammarQuiz: { ids: ids(kotenGrammar.KOTEN_GRAMMAR, 10) },
        kotenCultureStudy: { ids: ids(kotenCulture.KOTEN_CULTURE, 10) },
        kotenCultureQuiz: { ids: ids(kotenCulture.KOTEN_CULTURE, 10) },
        // 自作カードは、seedFor が入れる決まった ID の見本のカード。
        customCardStudy: { ids: [1, 2, 3, 4, 5].map((index) => `c-scroll${index}`), title: '見本' },
        customCardQuiz: { ids: [1, 2, 3, 4, 5].map((index) => `c-scroll${index}`), title: '見本' },
        // 社会・理科は、それぞれ最初の単元（地理「世界の姿」・理科1年の最初の単元）を開く。
        ...Object.fromEntries(['social', 'science'].flatMap((subject) => {
          const meta = subjects.SUBJECTS[subject]
          const unit = subjects.subjectUnits(subject)[0]
          const termIds = unit.terms.map((term) => term.id)
          return [
            [meta.screens.unit, { unitId: unit.id }],
            [meta.screens.study, { ids: termIds }],
            [meta.screens.quiz, { ids: termIds }],
            [meta.screens.practice, { unitId: unit.id }],
          ]
        })),
      }
    })
  }

  async openScreen(screen, params = {}) {
    let opened
    for (let attempt = 0; attempt < 3 && opened !== screen; attempt += 1) {
      await this.evaluate(([name, screenParams]) => {
        window.__scrollTest.store.getState().closeSpeechSettings()
        window.__scrollTest.store.getState().navigate(name, screenParams)
      }, [screen, params])
      await this.page.waitForFunction(() => {
        const main = document.querySelector('.study-app-content')
        return window.__scrollTest && main && !main.innerText.includes('画面を読み込み中')
      }, null, { timeout: 30_000 }).catch(() => {})
      await this.page.waitForTimeout(120)
      await this.settle()
      opened = await this.evaluate(() => window.__scrollTest.store.getState().screen)
    }
    return opened
  }

  async applyFrameState(id) {
    const frame = await this.evaluate(([stateId, toolbar]) => window.__scrollTest.applyFrameState(stateId, toolbar), [id, TOOLBAR])
    await this.settle()
    return frame
  }

  pageState() {
    return this.evaluate(() => window.__scrollTest.pageState())
  }

  openMenu() {
    return this.evaluate(() => window.__scrollTest.store.getState().openSpeechSettings())
      .then(() => this.page.waitForSelector('[data-sheet-scroll-area]'))
  }

  closeMenu() {
    return this.evaluate(() => window.__scrollTest.store.getState().closeSpeechSettings()).then(() => this.settle())
  }

  // 指でなでる。yDistance が負なら下の続きへ（指を上へ）、正なら上へ戻す（指を下へ）。
  async swipe(point, yDistance) {
    await this.cdp.send('Input.synthesizeScrollGesture', {
      x: Math.round(point.x),
      y: Math.round(point.y),
      yDistance,
      gestureSourceType: 'touch',
      speed: 5000,
      preventFling: true,
    })
    await this.settle()
  }

  // いまの画面の、実際に縦へスクロールできる欄（main と画面の中の欄）。画面に見えている所を指で触れるものだけ。
  scrollAreas() {
    return this.evaluate(() => {
      const main = document.querySelector('.study-app-content')
      const areas = [main, ...main.querySelectorAll('*')].filter((element) => {
        const style = getComputedStyle(element)
        if (!['auto', 'scroll'].includes(style.overflowY)) return false
        const rect = element.getBoundingClientRect()
        const visibleTop = Math.max(rect.top, 0)
        const visibleBottom = Math.min(rect.bottom, window.innerHeight)
        return element.scrollHeight - element.clientHeight > 4 && visibleBottom - visibleTop >= 48
      })
      areas.forEach((element, index) => element.setAttribute('data-scroll-test-area', String(index)))
      return areas.map((element, index) => ({
        index,
        name: element === main ? 'main' : (element.getAttribute('data-return-scroll') ?? element.className.split(' ').slice(0, 3).join(' ')),
      }))
    })
  }

  // まっさらな記録では中身が空になる画面に、中身を入れる（自作カード・保存した文法）。
  seedFor(screen) {
    return this.evaluate(async (name) => {
      const state = window.__scrollTest.store.getState()
      if (name === 'customWords' && state.customWords.length < 20) {
        for (let index = 0; index < 20; index += 1) state.saveCustomWord({ word: `sample${index}`, meaning: `見本の語${index}` })
        // 自作カードの画面は分類（教科・カテゴリー）ごとに並ぶので、カテゴリーも作って一覧を縦に送れる長さにする。
        for (let index = 0; index < 5; index += 1) {
          const category = state.saveCustomCategory({ title: `見本のカテゴリー${index}` })
          state.saveCustomCard({ template: 'term', category: category.id, front: `見本の用語${index}`, back: `見本の意味${index}` })
        }
      }
      // 自作カードの暗記・テストは、決まった ID の見本のカード（screenParams の customCardStudy・customCardQuiz）。
      if ((name === 'customCardStudy' || name === 'customCardQuiz') && !state.customCards.some((card) => card.id === 'c-scroll1')) {
        const long = '見本の文。'.repeat(40)
        state.importCustomLibrary({
          cards: [1, 2, 3, 4, 5].map((index) => ({
            id: `c-scroll${index}`,
            template: 'koten',
            category: 'subject:koten',
            front: `見本の古語${index}`,
            reading: 'みほん',
            back: `見本の意味${index}。${long}`,
            example: long,
            exampleTranslation: long,
            note: long,
          })),
        }, 'merge')
      }
      if ((name === 'myGrammar' || name === 'writingGrammarReview') && state.myGrammarList.length < 20) {
        const { WRITING_GRAMMAR } = await import('/src/data/writing.js')
        state.addManyToMyGrammar(WRITING_GRAMMAR.slice(0, 20).map((item) => item.id))
      }
    }, screen)
  }

  // 中身を開く。暗記カードはカードを開き（意味・成り立ちが出る）、テストは「わからない」で答える（答えと解説が出る）。
  async reveal() {
    const revealed = await this.evaluate(() => {
      const card = document.querySelector('.study-app-content [data-card-swipe-track] > *')
      if (card) {
        card.click()
        return 'カードを開いた後'
      }
      const unknown = [...document.querySelectorAll('.study-app-content button')]
        .find((button) => button.textContent.includes('わからない') && !button.disabled)
      if (unknown) {
        unknown.click()
        return '「わからない」で答えた後'
      }
      return null
    })
    if (revealed) {
      await this.page.waitForTimeout(150)
      await this.settle()
    }
    return revealed
  }

  clearScrollAreas() {
    return this.evaluate(() => {
      document.querySelectorAll('[data-scroll-test-area]').forEach((element) => {
        element.scrollTop = 0
        element.removeAttribute('data-scroll-test-area')
      })
    })
  }

  // 欄の見えている所で指を置ける所、スクロールの位置、外側の欄が送られたままか。
  areaState(selector) {
    return this.evaluate((css) => {
      const element = document.querySelector(css)
      if (!element) return null
      const rect = element.getBoundingClientRect()
      const bar = document.querySelector('[data-global-menu-bar]').getBoundingClientRect()
      const top = Math.max(rect.top, bar.bottom, 0)
      const bottom = Math.min(rect.bottom, window.innerHeight)
      // 指を置く所は、その欄がいちばん内側の縦のスクロール欄になる所（入力欄など、中の別の欄の上に置かない）。
      const innermostScroller = (start) => {
        for (let node = start; node; node = node.parentElement) {
          const overflowY = getComputedStyle(node).overflowY
          if ((overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight - node.clientHeight > 0) return node
        }
        return null
      }
      let point = null
      for (let y = top + 24; y <= bottom - 24 && !point; y += 24) {
        for (const x of [rect.left + rect.width / 2, rect.left + 28, rect.right - 28]) {
          if (innermostScroller(document.elementFromPoint(x, y)) === element) {
            point = { x, y }
            break
          }
        }
      }
      let outerScrolled = false
      for (let parent = element.parentElement; parent; parent = parent.parentElement) {
        if (parent.scrollTop > 0) outerScrolled = true
      }
      return {
        point,
        scrollTop: Math.round(element.scrollTop),
        max: element.scrollHeight - element.clientHeight,
        top: Math.round(rect.top),
        outerScrolled,
      }
    }, selector)
  }

  setAreaScroll(selector, value) {
    return this.evaluate(([css, top]) => {
      const element = document.querySelector(css)
      if (element) element.scrollTop = top === 'bottom' ? element.scrollHeight : top
    }, [selector, value])
  }

  // 一番下まで送ったところから、さらに指で下の続きへ送り、そのあと指で上へ戻す。
  async checkBackUpFromBottom(selector, where) {
    await this.setAreaScroll(selector, 'bottom')
    const atBottom = await this.areaState(selector)
    assert.ok(atBottom, `${where}: 欄が見つからない`)
    assert.ok(atBottom.scrollTop >= atBottom.max - 1, `${where}: 一番下まで送れない`)
    assert.ok(atBottom.point, `${where}: 一番下で、この欄の上に指を置ける所がない`)
    await this.swipe(atBottom.point, -240)
    assertPageStill(await this.pageState(), `${where}（一番下からさらに指で下の続きへ）`)

    await this.swipe(atBottom.point, 240)
    const movedUp = await this.areaState(selector)
    assert.ok(movedUp, `${where}: 一番下から指で上へ送ったら欄がなくなった`)
    assert.ok(movedUp.point, `${where}: この欄の上に指を置ける所がない`)
    assert.ok(movedUp.scrollTop < atBottom.scrollTop, `${where}: 一番下から指で上へ戻せない（${atBottom.scrollTop}→${movedUp.scrollTop}）`)
    assertPageStill(await this.pageState(), `${where}（一番下から指で上へ）`)

    // 先頭まで戻す。入れ子の欄は、先頭まで戻した先の指で外側の欄（main など）も戻す。
    await this.setAreaScroll(selector, Math.min(movedUp.scrollTop, 150))
    let atTop = await this.areaState(selector)
    for (let attempt = 0; attempt < 4 && (attempt === 0 || atTop.scrollTop > 0 || atTop.outerScrolled); attempt += 1) {
      await this.swipe(atTop.point ?? movedUp.point, 400)
      atTop = await this.areaState(selector)
    }
    const state = await this.pageState()
    assert.equal(atTop.scrollTop, 0, `${where}: 指で先頭まで戻らない（${atTop.scrollTop}px）`)
    assert.equal(atTop.outerScrolled, false, `${where}: 外側の欄が指で先頭まで戻らない`)
    assertPageStill(state, `${where}（先頭まで戻した）`)
    assert.ok(atTop.top >= state.barBottom - 1, `${where}: 欄の先頭が上部バーの下に見えていない（欄 ${atTop.top}・バー ${state.barBottom}）`)
  }
}

// 全画面を何台かに分けて同時に確かめる。1画面の失敗で止めず、失敗した画面をまとめて出す。
async function eachScreen(check) {
  while (phones.length < PHONES) phones.push(await Phone.open())
  const queue = [...SCREEN_NAMES]
  const failures = []
  await Promise.all(phones.map(async (phone) => {
    for (let screen = queue.shift(); screen; screen = queue.shift()) {
      // 途中でページが読み直されたときだけ、その画面をやり直す（開いていた画面が入口へ戻るため）。
      for (let attempt = 0; ; attempt += 1) {
        const loads = phone.loads
        try {
          await check(phone, screen)
          break
        } catch (error) {
          if (phone.loads !== loads && attempt < 2) continue
          failures.push(`${screen}: ${error.message.split('\n')[0]}`)
          break
        }
      }
    }
  }))
  assert.deepEqual(failures, [])
}

before(async () => {
  const port = await freePort()
  vite = await createServer({
    root: ROOT,
    logLevel: 'silent',
    // 動かしている開発サーバーの依存の置き場を書き換えない。
    cacheDir: 'node_modules/.vite-scroll-test',
    // 全画面の依存を最初に見つけておく（途中で見つけるとページを読み直し、開いた画面が入口へ戻る）。
    optimizeDeps: { entries: ['index.html', 'src/**/*.{js,jsx}'] },
    // ファイルの変更を見張らない。ほかの作業でファイルが変わると、ページを読み直して画面が入口へ戻る。
    server: { port, host: '127.0.0.1', strictPort: true, hmr: false, watch: null },
  })
  await vite.listen()
  base = `http://127.0.0.1:${port}/`
  browser = await chromium.launch()
  phones.push(await Phone.open())
  paramsByScreen = await phones[0].screenParams()
})

after(async () => {
  await browser?.close()
  await vite?.close()
})

test('直す前の作りでは、欄の下端から先の指でページがずれ、main の中から戻せない（直した作りでは起きない）', async () => {
  const [phone] = phones
  // 直す前の外枠とページの決まり（2026-09-28 までの src/index.css）をそのまま上書きで戻す。
  const beforeFix = `
    html, body { overflow: visible !important; overscroll-behavior: auto !important; }
    body { overscroll-behavior-y: none !important; }
    .study-app-viewport { position: static !important; height: auto !important; min-height: var(--app-frame-height, 100svh) !important; }
  `
  const runScenario = async () => {
    await phone.openScreen('home')
    await phone.applyFrameState('toolbar-returning')
    const start = await phone.pageState()
    // メニューを開き、欄を一番下まで送ってから、さらに指で下の続きへ送る。
    await phone.openMenu()
    await phone.setAreaScroll('[data-sheet-scroll-area]', 'bottom')
    const sheet = await phone.areaState('[data-sheet-scroll-area]')
    assert.ok(sheet.point, 'メニューの欄の上に指を置ける所がない')
    await phone.swipe(sheet.point, -300)
    const afterSheet = await phone.pageState()
    await phone.closeMenu()
    // 一覧（main）の中で指を下へ4回なでて、上へ戻そうとする。
    const main = await phone.areaState('.study-app-content')
    assert.ok(main.point, '一覧（main）の上に指を置ける所がない')
    for (let index = 0; index < 4; index += 1) await phone.swipe(main.point, 400)
    const afterMain = await phone.pageState()
    // 上部バーの上で指を上へ送る（main の外の指もページへ渡る）。
    await phone.evaluate(() => window.scrollTo(0, 0))
    await phone.swipe({ x: 195, y: 30 }, -200)
    const afterBar = await phone.pageState()
    await phone.evaluate(() => window.scrollTo(0, 0))
    await phone.applyFrameState('normal')
    return { start, afterSheet, afterMain, afterBar }
  }

  // 途中でページが読み直されると差し込んだ決まりが消えるので、読み直しのない1回が取れるまでやり直す。
  let broken
  for (let attempt = 0; attempt < 3 && !broken; attempt += 1) {
    const loads = phone.loads
    const injected = await phone.page.addStyleTag({ content: beforeFix })
    const result = await runScenario()
    await injected.evaluate((element) => element.remove()).catch(() => {})
    if (phone.loads === loads) broken = result
  }
  assert.ok(broken, '直す前の作りを差し込んだまま、読み直しなしで動かせない')
  // 直す前：外枠がページより高いぶん（ツールバーの差）ページがスクロールでき、指でずれて戻らない。
  assert.equal(broken.start.pageRange, TOOLBAR, 'ページのはみ出しがツールバーの差にならない')
  assert.equal(broken.afterSheet.pageY, TOOLBAR, 'メニューの欄の下端から先の指でページがずれていない')
  assert.equal(broken.afterSheet.barTop, -TOOLBAR)
  assert.equal(broken.afterMain.pageY, TOOLBAR, 'main の中の指でページが戻ってしまった（再現していない）')
  assert.equal(broken.afterMain.barTop, -TOOLBAR, '上部の「戻る・メニュー」が画面の上へ出たまま戻らない、が再現していない')
  assert.ok(broken.afterBar.pageY > 0, '上部バーの上の指でページがずれていない')

  const fixed = await runScenario()
  for (const [where, state] of Object.entries(fixed)) assertPageStill(state, `直した作り・${where}`)
})

test('全89画面で、見えている範囲のどの状態でもページそのものが動かない', async () => {
  assert.equal(SCREEN_NAMES.length, 89)
  const checked = new Set()
  await eachScreen(async (phone, screen) => {
    const opened = await phone.openScreen(screen, paramsByScreen[screen])
    assert.equal(opened, screen, `${screen} を開けない（${opened}）`)
    for (const { id, label } of FRAME_STATES) {
      const where = `${screen}・${label}`
      const frame = await phone.applyFrameState(id)
      assert.ok(frame.endsWith('px'), `${where}: 外枠の高さが書かれていない`)
      assertPageStill(await phone.pageState(), where)
      // スクリプト：ページを動かす命令と、外枠の一番下・上部バーを見せる命令。
      await phone.evaluate(() => {
        window.scrollTo(0, 400)
        document.querySelector('[data-app-bottom-clearance]').scrollIntoView({ block: 'end' })
        document.querySelector('[data-global-menu-bar]').scrollIntoView({ block: 'end' })
      })
      assertPageStill(await phone.pageState(), `${where}（scrollTo・scrollIntoView）`)
      // ホイールと指：main の外（上部バー）の上で下の続きへ送る。
      await phone.page.mouse.move(195, 30)
      await phone.page.mouse.wheel(0, 400)
      await phone.swipe({ x: 195, y: 30 }, -200)
      assertPageStill(await phone.pageState(), `${where}（上部バーの上のホイールと指）`)
      checked.add(`${screen}|${id}`)
    }
    await phone.applyFrameState('normal')
  })
  // メニューのシートを開いた状態も、同じ5つの状態で、欄の下端から先へ送って確かめる。
  const [phone] = phones
  await phone.openScreen('home')
  await phone.openMenu()
  for (const { id, label } of FRAME_STATES) {
    const where = `メニューのシート・${label}`
    await phone.applyFrameState(id)
    await phone.setAreaScroll('[data-sheet-scroll-area]', 'bottom')
    const sheet = await phone.areaState('[data-sheet-scroll-area]')
    assert.ok(sheet.point, `${where}: メニューの欄の上に指を置ける所がない`)
    await phone.swipe(sheet.point, -300)
    assertPageStill(await phone.pageState(), where)
    checked.add(`menu|${id}`)
  }
  await phone.closeMenu()
  await phone.applyFrameState('normal')
  assert.equal(checked.size, 89 * FRAME_STATES.length + FRAME_STATES.length)
})

test('全89画面の縦に動く欄で、一番下から上へ戻れる', async (t) => {
  const counts = new Map()
  const revealedScreens = []
  const smallScreens = []
  let total = 0
  await eachScreen(async (phone, screen) => {
    await phone.seedFor(screen)
    let seen = 0
    // 標準の大きさで確かめ、中身が収まって縦に動く欄がない画面は、小さい画面（SMALL_VIEWPORT）でも確かめる。
    for (const viewport of [null, SMALL_VIEWPORT]) {
      if (viewport && seen) break
      const size = viewport ? '・小さい画面' : ''
      try {
        if (viewport) {
          await phone.resize(viewport)
          // 同じ画面名へ続けて開くと画面が作り直されないので、いったんポータルを挟む。
          await phone.openScreen('portal')
          smallScreens.push(screen)
        }
        await phone.openScreen(screen, paramsByScreen[screen])
        // 開いたままと、中身を開いた後（カードの裏・答えと解説）の両方で。
        for (let pass = 0; pass < 2; pass += 1) {
          const content = pass === 0 ? '開いたまま' : await phone.reveal()
          if (!content) break
          if (pass === 1) revealedScreens.push(`${screen}${size}（${content}）`)
          // ふつうの状態と、外枠が見えている範囲より高い状態（直す前にページが動けた状態）の両方で。
          for (const stateId of ['normal', 'toolbar-returning']) {
            await phone.applyFrameState(stateId)
            const areas = await phone.scrollAreas()
            seen = Math.max(seen, areas.length)
            for (const area of areas) {
              await phone.checkBackUpFromBottom(`[data-scroll-test-area="${area.index}"]`, `${screen}${size}・${content}・${area.name}・${stateId}`)
              total += 1
            }
            await phone.clearScrollAreas()
          }
          await phone.applyFrameState('normal')
        }
      } finally {
        if (viewport) await phone.resize({ width: 390, height: PAGE_HEIGHT })
      }
    }
    counts.set(screen, seen)
  })
  // メニューのシートの欄。
  const [phone] = phones
  await phone.openScreen('home')
  for (const stateId of ['normal', 'toolbar-returning']) {
    await phone.applyFrameState(stateId)
    await phone.openMenu()
    await phone.checkBackUpFromBottom('[data-sheet-scroll-area]', `メニューのシート・${stateId}`)
    await phone.closeMenu()
    total += 1
  }
  await phone.applyFrameState('normal')
  const without = SCREEN_NAMES.filter((screen) => !counts.get(screen))
  t.diagnostic(`縦に動く欄のある画面 ${SCREEN_NAMES.length - without.length}/${SCREEN_NAMES.length}（欄 ${[...counts.values()].reduce((sum, count) => sum + count, 0)}、状態2つとメニューで ${total} 回）`)
  t.diagnostic(`中身を開いてからも確かめた画面 ${revealedScreens.length}：${revealedScreens.join('・')}`)
  t.diagnostic(`小さい画面（${SMALL_VIEWPORT.width}×${SMALL_VIEWPORT.height}）で確かめた画面 ${smallScreens.length}：${smallScreens.join('・')}`)
  assert.equal(counts.size, 89)
  // 標準の大きさで縦に動く欄がない画面は、決めた画面だけ（ほかの画面で欄がなくなったら理由を確かめる）。
  assert.deepEqual([...new Set(smallScreens)].sort(), [...SMALL_ONLY_SCREENS].sort(), '標準の大きさで縦に動く欄がない画面')
  // どの画面にも、一番下まで送る縦の欄がある（中身が空の画面には中身を入れてから開く）。
  assert.deepEqual(without, [], '縦に動く欄がない画面')
})

test('外枠の決まりを保つ：キーボードの間は外枠を縮めない・シートは見えている範囲に収める・上下の余白の位置', async () => {
  const [phone] = phones
  // 打つ欄のある画面：英作文の文法別トラック（WritingExam のチャレンジ）・英和辞書の検索・自作カード。
  for (const [screen, selector] of [
    ['writingExam', 'textarea'],
    ['vocabSearch', 'input'],
    ['customWords', 'input'],
  ]) {
    await phone.openScreen(screen, paramsByScreen[screen])
    // 自作カードは「カードを作る」を押すと打つ欄が出る。
    if (screen === 'customWords') await phone.page.click('[data-custom-word-add]')
    assert.ok(await phone.evaluate((css) => Boolean(document.querySelector(`.study-app-content ${css}`)), selector), `${screen}: 打つ欄がない`)
    const result = await phone.evaluate(([css, stateId]) => {
      const field = [...document.querySelectorAll(`.study-app-content ${css}`)].find((element) => !element.disabled && !element.readOnly)
      field.focus()
      const normalFrame = window.__scrollTest.applyFrameState('normal', 0)
      const main = document.querySelector('.study-app-content').getBoundingClientRect()
      const typingFrame = window.__scrollTest.applyFrameState(stateId, 0)
      const mainTyping = document.querySelector('.study-app-content').getBoundingClientRect()
      field.blur()
      return { normalFrame, typingFrame, mainBottom: main.bottom, mainBottomTyping: mainTyping.bottom, innerHeight: window.innerHeight }
    }, [selector, 'keyboard'])
    assert.equal(result.typingFrame, `${result.innerHeight}px`, `${screen}: キーボードの間に外枠が縮んだ`)
    assert.equal(result.typingFrame, result.normalFrame, `${screen}: キーボードの間に外枠の高さが変わった`)
    assert.equal(result.mainBottomTyping, result.mainBottom, `${screen}: キーボードの間に本文の欄が縮んだ`)
    assertPageStill(await phone.pageState(), `${screen}・キーボード`)
    await phone.applyFrameState('normal')
  }

  // シートは見えている範囲（キーボードの上）に収める。
  await phone.openScreen('home')
  await phone.applyFrameState('keyboard')
  await phone.openMenu()
  const sheet = await phone.evaluate(() => {
    const layer = document.querySelector('[data-sheet-layer]').getBoundingClientRect()
    const panel = document.querySelector('[data-sheet-layer] > div:last-child').getBoundingClientRect()
    const root = getComputedStyle(document.documentElement)
    return {
      layerTop: layer.top,
      layerHeight: layer.height,
      panelHeight: panel.height,
      visibleHeight: parseFloat(root.getPropertyValue('--app-visual-viewport-height')),
      visibleTop: parseFloat(root.getPropertyValue('--app-visual-viewport-top')),
    }
  })
  assert.equal(sheet.layerTop, sheet.visibleTop, 'シートの層が見えている範囲の上端にない')
  assert.equal(sheet.layerHeight, sheet.visibleHeight, 'シートの層が見えている範囲の高さでない')
  assert.ok(sheet.panelHeight <= sheet.visibleHeight - 8 + 0.5, 'シートが見えている範囲からはみ出す')
  await phone.closeMenu()
  await phone.applyFrameState('normal')

  // 上部バーはセーフエリアの下、下端の余白（ホームバー）と画面の下の枠は外枠の一番下。
  for (const screen of ['home', 'vocabStudy', 'reader']) {
    await phone.openScreen(screen, paramsByScreen[screen])
    const shell = await phone.evaluate(() => {
      const bar = document.querySelector('[data-global-menu-bar]')
      const clearance = document.querySelector('[data-app-bottom-clearance]').getBoundingClientRect()
      const surface = document.querySelector('.study-app-surface').getBoundingClientRect()
      return {
        barTop: bar.getBoundingClientRect().top,
        barPadding: getComputedStyle(bar).paddingTop,
        clearanceBottom: clearance.bottom,
        surfaceBottom: surface.bottom,
        frame: parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--app-frame-height')),
      }
    })
    assert.equal(shell.barTop, 0, `${screen}: 上部バーが画面の上端にない`)
    assert.equal(shell.barPadding, '8px', `${screen}: 上部バーの上の余白がセーフエリア＋0.5remでない`)
    assert.equal(shell.surfaceBottom, shell.frame, `${screen}: 外枠の下端が外枠の高さと合わない`)
    assert.equal(shell.clearanceBottom, shell.frame, `${screen}: 下端の余白が外枠の一番下にない`)
  }
})
