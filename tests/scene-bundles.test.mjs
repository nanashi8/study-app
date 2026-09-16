import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { PASSAGES, getPassage } from '../src/data/passages.js'
import { SCENE_BUNDLE_LEDGER } from '../src/data/scene-bundles.js'
import { getWord } from '../src/data/vocab.js'
import {
  SCENE_BUNDLES,
  SCENE_BUNDLE_LEVELS,
  SCENE_BUNDLE_PASSAGES,
  SCENE_BUNDLE_SIZE,
  SCENE_BUNDLE_SUMMARY,
  findSceneWordInPassage,
  getSceneBundle,
  sceneBundleExamples,
  sceneBundleLaunch,
  sceneBundleWordCount,
  sceneBundlesForPassage,
  sceneWordForms,
} from '../src/lib/sceneBundles.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('一文ごとに確かめた長文38本すべてに、場面の束を2つ以上置く', () => {
  assert.deepEqual(SCENE_BUNDLE_SUMMARY, { passages: 38, bundles: 176, words: 1263 })
  assert.equal(sceneBundleWordCount(SCENE_BUNDLES), 1671)
  assert.deepEqual(Object.keys(SCENE_BUNDLE_LEDGER).sort(), PASSAGES.map((passage) => passage.id).sort())
  for (const passage of PASSAGES) {
    assert.ok(sceneBundlesForPassage(passage.id).length >= 2, passage.id)
  }
  // 語彙強化の節送り長文には、まだ束を置かない。
  assert.deepEqual(sceneBundlesForPassage('p_ext_1000_civic_decisions'), [])
  assert.deepEqual(SCENE_BUNDLE_LEVELS.map((level) => level.id), ['5', '4', '3', 'pre2', 'pre2plus', '2', 'pre1', '1'])
  assert.equal(SCENE_BUNDLE_PASSAGES.length, 38)
})

test('束の語はすべて本文に出る順で並び、同じ長文の束どうしで重ならない', () => {
  const names = new Set()
  for (const [passageId, bundles] of Object.entries(SCENE_BUNDLE_LEDGER)) {
    const passage = getPassage(passageId)
    const seen = new Set()
    for (const bundle of bundles) {
      assert.ok(!names.has(bundle.name), `束の名前が重複: ${bundle.name}`)
      names.add(bundle.name)
      assert.ok(bundle.words.length >= SCENE_BUNDLE_SIZE.min && bundle.words.length <= SCENE_BUNDLE_SIZE.max, bundle.name)
      let last = -1
      for (const id of bundle.words) {
        const word = getWord(id)
        assert.ok(word, `${bundle.name}: ${id}`)
        assert.ok(!seen.has(id), `${passageId}: ${id} が2つの束にある`)
        seen.add(id)
        const found = findSceneWordInPassage(passage, word)
        assert.ok(found, `${bundle.name}: ${id} が本文にない`)
        assert.ok(found.index >= last, `${bundle.name}: ${id} の並び`)
        last = found.index
      }
    }
  }
})

test('本文に出る形は、原形・規則変化・長文の不規則変化だけを数える', () => {
  // 名詞・動詞には比べる形を作らない（teacher を teach、uses を us と数えない）。
  assert.ok(!sceneWordForms(getWord('teach')).has('teacher'))
  assert.ok(sceneWordForms(getWord('safe')).has('safer'))
  assert.ok(sceneWordForms(getWord('plan')).has('planned'))
  assert.ok(sceneWordForms(getWord('study')).has('studied'))
  assert.ok(sceneWordForms(getWord('leave')).has('left'))
  assert.ok(sceneWordForms(getWord('leaf')).has('leaves'))
  assert.deepEqual([...sceneWordForms({ id: 'ice_cream', word: 'ice cream', pos: '名' })], [])

  // 本文の語義が同じ見出し語を指す出現を先に選ぶ（1文目の claims は別の見出し語「claims」に解決される）。
  const health = getPassage('p_2_online_health_claims')
  assert.equal(findSceneWordInPassage(health, getWord('claim')).index, 2)
  // 別の見出し語にしか解決されない形でも、語形変化として本文に出ていれば数える。
  const garden = getPassage('p_3_school_garden')
  assert.deepEqual(findSceneWordInPassage(garden, getWord('decrease')), { index: 10, surface: 'decreased' })
  // 同じつづりの別の語（_2）は、本文の語義がその語を指すときだけ数える。
  assert.equal(findSceneWordInPassage(getPassage('p_4_emergency_map'), getWord('last_2')), null)
  assert.equal(findSceneWordInPassage(garden, getWord('zebra')), null)
})

test('束の中身は、語と本文で初めて出る一文を並べて見せる', () => {
  const bundle = getSceneBundle('p_2_disaster_translators#1')
  assert.equal(bundle.name, '台風の夜の警報')
  assert.equal(bundle.number, 1)
  assert.deepEqual(bundle.headwords.slice(0, 3), ['typhoon', 'coastal', 'authority'])
  const examples = sceneBundleExamples(bundle)
  assert.equal(examples.length, bundle.wordIds.length)
  const resident = examples.find((example) => example.word.id === 'resident')
  assert.equal(resident.sentenceIndex, 3)
  assert.equal(resident.surface, 'residents')
  assert.equal(resident.sentence.en, 'Foreign residents read the warning but did not move.')
  assert.equal(getSceneBundle('p_2_disaster_translators#99'), null)
})

test('束の暗記・テストは語を固定した出題で開き、終えたら束へ戻る', () => {
  const bundle = getSceneBundle('p_4_emergency_map#2')
  const target = { screen: 'sceneBundles', params: { levelId: '4', bundleId: bundle.id } }
  const study = sceneBundleLaunch(bundle, 'study', {
    continueTo: { ...target, label: '場面の束に戻る' },
    returnTo: target,
  })
  assert.equal(study.screen, 'vocabStudy')
  assert.deepEqual(study.params.source, { type: 'deck', ids: bundle.wordIds })
  assert.notEqual(study.params.source.ids, bundle.wordIds, '台帳の配列をそのまま渡さない')
  assert.equal(study.params.size, bundle.wordIds.length)
  assert.equal(study.params.mode, 'study')
  assert.equal(study.params.title, '雨の日のための安全マップ・危ない橋と別の道')
  assert.equal(study.params.continueTo.label, '場面の束に戻る')
  assert.deepEqual(study.params.returnTo, target)

  const quiz = sceneBundleLaunch(bundle, 'quiz')
  assert.equal(quiz.screen, 'vocabQuiz')
  assert.equal('mode' in quiz.params, false)
  assert.equal('continueTo' in quiz.params, false)
})

test('場面の束は長文一覧から開き、読解の準備でも本文の前に暗記できる', () => {
  const app = read('src/App.jsx')
  assert.match(app, /const SceneBundlesScreen = lazyScreen\(\(\) => import\('\.\/screens\/SceneBundles\.jsx'\), 'SceneBundlesScreen'\)/)
  assert.match(app, /sceneBundles: SceneBundlesScreen,/)
  assert.match(read('src/lib/appHome.js'), /'readingPrep', 'sceneBundles', 'reader'/)

  const list = read('src/screens/ReadingList.jsx')
  assert.match(list, /data-scene-bundles-entry/)
  assert.match(list, /navigate\('sceneBundles'\)/)
  assert.match(list, /場面の束 \{sceneBundleCount\}/)

  const screen = read('src/screens/SceneBundles.jsx')
  assert.match(screen, /role="tablist" aria-label="級を選ぶ"/)
  assert.match(screen, /replaceParams\(\{ \.\.\.params, levelId: nextLevelId, bundleId: undefined \}\)/)
  assert.match(screen, /continueTo: \{ \.\.\.returnTarget\(bundle\.id\), label: '場面の束に戻る' \}/)
  assert.match(screen, /navigate\('reader', \{ passageId, returnTo: returnTarget\(\) \}\)/)
  assert.match(screen, /navigate\('readingPrep', \{ passageId: passage\.id, returnTo: returnTarget\(\) \}\)/)
  // 外枠は448px固定なので、ビューポート基準の sm: で列を増やさない。
  assert.doesNotMatch(screen, /\bsm:/)

  const prep = read('src/screens/ReadingPrep.jsx')
  assert.match(prep, /data-reading-prep-scenes/)
  assert.match(prep, /<SceneBundleRows/)
  assert.match(prep, /<SceneBundleSheet/)
  // 束の暗記から戻っても、本文から戻る先（params.returnTo）を失わない。
  assert.match(prep, /params: \{ passageId, bundleId: bundle\.id, \.\.\.\(params\.returnTo \? \{ returnTo: params\.returnTo \} : \{\}\) \}/)
  // 場面の束は、必須語彙のカードより前に置く。
  assert.ok(prep.indexOf('data-reading-prep-scenes') < prep.indexOf('data-reading-prep-entry="words"'))
  // フックは長文が見つからないときの早期 return より前に置く。
  assert.ok(prep.indexOf('const [openBundle, setOpenBundle] = useState') < prep.indexOf('if (!passage)'))
  for (const source of [screen, prep]) {
    assert.match(source, /if \(params\.bundleId\) replaceParams\(\{ \.\.\.params, bundleId: undefined \}\)/)
  }

  const parts = read('src/components/SceneBundles.jsx')
  assert.match(parts, /<MeaningText>\{word\.meaning\}<\/MeaningText>/)
  assert.match(parts, /本文ではこう出る/)
  assert.match(parts, /この長文を読む/)
  assert.match(parts, /<WordListSheet/)
  // フックは束が無いときの早期 return より前に置く。
  assert.ok(parts.indexOf('useMemo(') < parts.indexOf('if (!bundle || !passage) return null'))
})
