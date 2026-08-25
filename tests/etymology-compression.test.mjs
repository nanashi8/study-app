import test from 'node:test'
import assert from 'node:assert/strict'
import {
  ALL_WORDS,
  ETYMOLOGY_DOMAIN_META,
  ETYMOLOGY_FIELD_TO_DOMAIN,
  ETYMOLOGY_FORMATION_META,
  ETYMOLOGY_MODE_META,
  ETYMOLOGY_LEGACY_PACKS as ETYMOLOGY_PACKS,
  ETYMOLOGY_SOURCE_META,
  ETYMOLOGY_LEGACY_SUMMARY as ETYMOLOGY_SUMMARY,
  ROOTS,
  etymologyLearningGuideFor,
  relatedByEtymology,
  rootIdsForWord,
  wordsByRoot,
} from '../src/data/vocab.js'
import {
  REFERENCE_ROOT_LINK_COUNT,
  REFERENCE_ROOT_WORDS,
  REFERENCE_ROOTS,
} from '../src/data/etymology-reference-roots.js'
import { ETYMOLOGY_COMPLETION_WORDS } from '../src/data/words-etymology-completion.js'
import { CURRICULUM_1900_WORDS } from '../src/data/words-curriculum-1900.js'
import { wordsForSource } from '../src/lib/session.js'

const compact = (value = '') => value.toLowerCase().replace(/[^a-z0-9]+/g, '')
const completionWordIds = new Set(ETYMOLOGY_COMPLETION_WORDS.map((word) => word.id))
const curriculum1900WordIds = new Set(CURRICULUM_1900_WORDS.map((word) => word.id))
const sourceGroup = (id) => completionWordIds.has(id)
  ? 'completion'
  : curriculum1900WordIds.has(id)
    ? 'curriculum-1900'
    : 'legacy'
const byHead = new Map()
const byId = new Map(ALL_WORDS.map((word) => [word.id, word]))
const legacyPackById = new Map(ETYMOLOGY_PACKS.map((pack) => [pack.id, pack]))
const getEtymologyPack = (packId) => legacyPackById.get(packId)
for (const word of ALL_WORDS) {
  byHead.set(word.word.toLowerCase(), word)
  if (!byHead.has(compact(word.word))) byHead.set(compact(word.word), word)
}

const familyRelationIds = (word) => new Set(
  [...(word.family ?? []), ...(word.derivatives ?? [])]
    .map((item) => byHead.get(item.w.toLowerCase()) ?? byHead.get(compact(item.w)))
    .map((related) => related?.id)
    .filter((id) => id && id !== word.id),
)

test('全英単語が4つの語源濃縮ルートへ重複なく入る', () => {
  assert.equal(ETYMOLOGY_SUMMARY.total, ALL_WORDS.length)
  assert.equal(ETYMOLOGY_SUMMARY.covered, ALL_WORDS.length)
  assert.equal(
    Object.values(ETYMOLOGY_SUMMARY.counts).reduce((sum, count) => sum + count, 0),
    ALL_WORDS.length,
  )
  assert.deepEqual(
    new Set(Object.keys(ETYMOLOGY_SUMMARY.counts)),
    new Set(Object.keys(ETYMOLOGY_MODE_META)),
  )

  const coverage = ETYMOLOGY_PACKS.flatMap((pack) => pack.coverageIds)
  assert.equal(coverage.length, ALL_WORDS.length)
  assert.equal(new Set(coverage).size, ALL_WORDS.length)
  assert.deepEqual(new Set(coverage), new Set(ALL_WORDS.map((word) => word.id)))

  for (const word of ALL_WORDS) {
    assert.ok(word.compression, word.id)
    const pack = getEtymologyPack(word.compression.packId)
    assert.ok(pack, `${word.id}: ${word.compression.packId}`)
    assert.equal(pack.mode, word.compression.mode, word.id)
    assert.ok(pack.coverageIds.includes(word.id), word.id)
  }
})

test('濃縮ルートは語源データの強さを越えて推測しない', () => {
  for (const word of ALL_WORDS) {
    const formula = (word.etymology?.parts?.length ?? 0) >= 2
    const relations = new Set([...familyRelationIds(word)].filter((id) =>
      sourceGroup(id) === sourceGroup(word.id)))
    const mode = word.compression.mode

    if (formula) {
      assert.equal(mode, 'formula', word.id)
    } else if (word.roots.length) {
      assert.equal(mode, 'root', word.id)
    } else if (relations.size) {
      assert.equal(mode, 'family', word.id)
    } else {
      assert.equal(mode, 'origin', word.id)
    }

    if (mode === 'family') {
      assert.ok(
        word.compression.anchorId === word.id ||
          relations.has(word.compression.anchorId),
        `${word.id}: anchor=${word.compression.anchorId}`,
      )
    }
  }
})

test('由来カードは学習用の組分けだと明示し、全カードを8語以内で学べる', () => {
  const packIds = new Set()
  for (const pack of ETYMOLOGY_PACKS) {
    assert.ok(!packIds.has(pack.id), pack.id)
    packIds.add(pack.id)
    assert.doesNotMatch(pack.id, /[.#$[\]/]/, `${pack.id}: Firebaseで保存できないID`)
    assert.ok(pack.coverageIds.length > 0, pack.id)
    assert.ok(pack.studyIds.length > 0 && pack.studyIds.length <= 8, pack.id)
    assert.equal(new Set(pack.studyIds).size, pack.studyIds.length, pack.id)
    assert.ok(pack.studyIds.every((id) => ALL_WORDS.some((word) => word.id === id)), pack.id)
    if (pack.mode === 'origin') {
      assert.equal(pack.groupClaim, 'study-batch', pack.id)
      if (pack.studyIds.length === 1) assert.doesNotMatch(pack.caution, /語どうし/, pack.id)
      else {
        assert.match(pack.caution, /学習量をまとめたセット/, pack.id)
        assert.match(pack.caution, /関連語という意味ではありません/, pack.id)
      }
    }
    if (pack.mode === 'family') {
      assert.equal(pack.groupClaim, 'study-batch', pack.id)
      assert.match(pack.subtitle, /^1語ずつ形と由来を確かめる$/, pack.id)
      if (pack.studyIds.length === 1) assert.doesNotMatch(pack.caution, /語どうし/, pack.id)
      else assert.match(pack.caution, /関連語という意味ではありません/, pack.id)
    }

    assert.deepEqual(
      wordsForSource({ type: 'deck', ids: pack.studyIds }).map((word) => word.id),
      pack.studyIds,
      pack.id,
    )
  }
})

test('複合語を経由した別の構成語を、同じ学習カードへ連鎖追加しない', () => {
  const cases = [
    ['family:work:work', 'art'],
    ['family:out:out', 'line'],
    ['family:ship:ship', 'war'],
    ['family:like:likewise', 'war'],
  ]
  for (const [packId, excludedId] of cases) {
    const pack = getEtymologyPack(packId)
    assert.ok(pack, packId)
    assert.ok(!pack.studyIds.includes(excludedId), `${packId}: ${excludedId}`)
  }
})

test('由来カードの内部整理軸を混ぜず、画面では関連語の組だと主張しない', () => {
  const originPacks = ETYMOLOGY_PACKS.filter((pack) => pack.mode === 'origin')
  assert.equal(originPacks.length, ETYMOLOGY_SUMMARY.origin.packs)
  assert.equal(
    originPacks.filter((pack) => pack.coverageIds.length === 1).length,
    ETYMOLOGY_SUMMARY.origin.singletonPacks,
  )

  for (const pack of originPacks) {
    assert.ok(ETYMOLOGY_FORMATION_META[pack.formationKey], pack.id)
    assert.ok(ETYMOLOGY_SOURCE_META[pack.sourceKey], pack.id)
    assert.ok(ETYMOLOGY_DOMAIN_META[pack.domainKey], pack.id)
    assert.ok(pack.sharedLabel, pack.id)
    assert.match(pack.subtitle, /^1語ずつ由来を確かめる/, pack.id)
    if (pack.studyIds.length === 1) assert.doesNotMatch(pack.caution, /語どうし/, pack.id)
    else assert.match(pack.caution, /関連語という意味ではありません/, pack.id)
    assert.doesNotMatch(pack.caution, /共通点は|同じ作られ方の語/, pack.id)
    assert.doesNotMatch(pack.title, /意味変化の物語|由来の読み方/, pack.id)

    const words = pack.coverageIds.map((id) => byId.get(id))
    assert.ok(words.every(Boolean), pack.id)
    assert.deepEqual(
      new Set(words.map((word) => word.compression.formationKey)),
      new Set([pack.formationKey]),
      pack.id,
    )
    assert.deepEqual(
      new Set(words.map((word) => word.compression.sourceKey)),
      new Set([pack.sourceKey]),
      pack.id,
    )
    assert.deepEqual(
      new Set(words.map((word) => word.compression.domainKey)),
      new Set([pack.domainKey]),
      pack.id,
    )
    assert.ok(
      words.every((word) =>
        (ETYMOLOGY_FIELD_TO_DOMAIN[word.field] ?? 'other') === pack.domainKey),
      pack.id,
    )
    if (pack.domainKey === 'core') {
      assert.equal(pack.wordClasses.length, 1, `${pack.id}: 基礎・日常は品詞群も統一`)
    }
  }
})

test('代表語を形成法と言語層の別軸へ分類し、旧来の無関係な束を分離する', () => {
  const word = (head) => ALL_WORDS.find((item) => item.word.toLowerCase() === head)
  assert.deepEqual(
    [word('sun').compression.formationKey, word('sun').compression.sourceKey],
    ['inherited', 'oldEnglish'],
  )
  assert.deepEqual(
    [word('travel').compression.formationKey, word('travel').compression.sourceKey],
    ['borrowing', 'french'],
  )
  assert.deepEqual(
    [word('window').compression.formationKey, word('window').compression.sourceKey],
    ['construction', 'norse'],
  )
  assert.deepEqual(
    [word('zoo').compression.formationKey, word('zoo').compression.sourceKey],
    ['shortening', 'greek'],
  )
  assert.equal(word('big').compression.formationKey, 'uncertain')
  assert.notEqual(word('comic').compression.packId, word('box').compression.packId)
})

test('既存語源パックを固定し、2種の補完語だけを各名前空間へ分離する', () => {
  const legacyWords = ALL_WORDS.filter((word) => sourceGroup(word.id) === 'legacy')
  const completionWords = ALL_WORDS.filter((word) => completionWordIds.has(word.id))
  const curriculum1900Words = ALL_WORDS.filter((word) => curriculum1900WordIds.has(word.id))
  const legacyPacks = ETYMOLOGY_PACKS.filter((pack) =>
    !pack.id.startsWith('completion:') && !pack.id.startsWith('curriculum-1900:'))
  const completionPacks = ETYMOLOGY_PACKS.filter((pack) => pack.id.startsWith('completion:'))
  const curriculum1900Packs = ETYMOLOGY_PACKS.filter((pack) => pack.id.startsWith('curriculum-1900:'))

  assert.equal(legacyWords.length, 8234)
  assert.equal(legacyPacks.length, 2688)
  assert.equal(completionWords.length, 215)
  assert.equal(curriculum1900Words.length, 420)
  assert.ok(completionPacks.length > 0)
  assert.ok(curriculum1900Packs.length > 0)
  assert.ok(legacyWords.every((word) =>
    !word.compression.packId.startsWith('completion:') &&
    !word.compression.packId.startsWith('curriculum-1900:')))
  assert.ok(completionWords.every((word) => word.compression.packId.startsWith('completion:')))
  assert.ok(curriculum1900Words.every((word) => word.compression.packId.startsWith('curriculum-1900:')))
  assert.deepEqual(
    new Set(completionPacks.flatMap((pack) => pack.coverageIds)),
    completionWordIds,
  )
  assert.deepEqual(
    new Set(curriculum1900Packs.flatMap((pack) => pack.coverageIds)),
    curriculum1900WordIds,
  )
})

test('全英単語に中高生向けの4段階語源ガイドを表示できる', () => {
  for (const word of ALL_WORDS) {
    const guide = etymologyLearningGuideFor(word)
    assert.ok(guide.formationLabel, `${word.id}: 作られ方ラベル`)
    assert.ok(guide.formationText, `${word.id}: 作られ方説明`)
    assert.ok(guide.sourceLabel, `${word.id}: もとの言語ラベル`)
    assert.ok(guide.sourceText, `${word.id}: もとの形・言語`)
    assert.ok(guide.storyLabel, `${word.id}: 変化ラベル`)
    assert.ok(guide.storySteps.length, `${word.id}: 由来の記録`)
    assert.ok(guide.storySteps.every((step) => step.trim()), `${word.id}: 空の変化段階`)
    assert.ok(guide.currentMeaning, `${word.id}: 今の意味`)
    assert.doesNotMatch(
      [guide.formationLabel, guide.formationText, guide.sourceLabel, guide.storyLabel].join(' '),
      /現在義|共通軸|記載上の出発言語|濃縮パック/,
      word.id,
    )
  }
})

test('全語源カードの見出しは不完全な表示を出さず短く読める', () => {
  for (const pack of ETYMOLOGY_PACKS) {
    const learnerText = [pack.title, pack.subtitle, pack.description, pack.caution].join(' ')
    assert.doesNotMatch(learnerText, /undefined|（\s*）|\(\s*\)/, pack.id)
    assert.ok(pack.title.length <= 45, `${pack.id}: ${pack.title.length}字`)
  }
})

test('補助語根は既存語だけを明示的につなぎ、語源カードIDの分類へ混ぜない', () => {
  const rootIds = new Set(ROOTS.map((root) => root.id))
  const referenceRootIds = new Set(REFERENCE_ROOTS.map((root) => root.id))
  assert.equal(referenceRootIds.size, REFERENCE_ROOTS.length)
  assert.ok([...referenceRootIds].every((rootId) => rootIds.has(rootId)))

  let links = 0
  for (const [rootId, heads] of Object.entries(REFERENCE_ROOT_WORDS)) {
    assert.ok(rootIds.has(rootId), rootId)
    assert.equal(new Set(heads).size, heads.length, `${rootId}: 同じ単語が重複`)
    for (const head of heads) {
      const word = byHead.get(head)
      assert.ok(word, `${rootId}: 未収録語 ${head}`)
      assert.ok(word.referenceRoots.includes(rootId), `${head}: ${rootId}`)
      assert.ok(rootIdsForWord(word).includes(rootId), `${head}: 統合語根 ${rootId}`)
      assert.ok(wordsByRoot(rootId).some((item) => item.id === word.id), `${rootId}: ${head}`)
      links++
    }
  }
  assert.equal(links, REFERENCE_ROOT_LINK_COUNT)

  // referenceRoots を足しても、保存互換の分類元 roots は書き換えない。
  const administer = byHead.get('administer')
  assert.deepEqual(administer.roots, [])
  assert.ok(administer.referenceRoots.includes('mini'))
  assert.notEqual(administer.compression.mode, 'root')
})

test('追加した補助語根は既存語の内容と関連語へ適用される', () => {
  const legacyWords = ALL_WORDS.filter((word) => sourceGroup(word.id) === 'legacy')
  const applied = legacyWords.filter((word) => word.referenceRoots.length > 0)
  assert.equal(applied.length, 461)
  assert.equal(
    applied.reduce((sum, word) => sum + word.referenceRoots.length, 0),
    462,
  )

  for (const word of applied) {
    for (const rootId of word.referenceRoots) {
      assert.ok(rootIdsForWord(word).includes(rootId), `${word.id}: ${rootId}`)
      assert.ok(wordsByRoot(rootId).some((candidate) => candidate.id === word.id), `${word.id}: root page`)
      assert.ok(
        relatedByEtymology(word).some((relation) => relation.via === rootId),
        `${word.id}: related ${rootId}`,
      )
    }
  }
})

test('補完語の語族は既存語との境界を越えて109組すべて双方向につながる', () => {
  const directed = new Set()
  const pairIds = new Set()
  const legacyWords = new Set()
  const completionWords = new Set()

  for (const word of ALL_WORDS) {
    for (const family of word.family ?? []) {
      const related = byHead.get(family.w.toLowerCase()) ?? byHead.get(compact(family.w))
      if (!related || new Set([sourceGroup(word.id), sourceGroup(related.id)]).size !== 2) continue
      if (curriculum1900WordIds.has(word.id) || curriculum1900WordIds.has(related.id)) continue
      directed.add(`${word.id}>${related.id}`)
      pairIds.add([word.id, related.id].sort().join('|'))
      if (completionWordIds.has(word.id)) completionWords.add(word.id)
      else legacyWords.add(word.id)
    }
  }

  assert.equal(pairIds.size, 109)
  assert.equal(directed.size, 218)
  assert.equal(legacyWords.size, 103)
  assert.equal(completionWords.size, 105)
  for (const pairId of pairIds) {
    const [left, right] = pairId.split('|')
    assert.ok(directed.has(`${left}>${right}`), pairId)
    assert.ok(directed.has(`${right}>${left}`), pairId)
  }

  assert.deepEqual(
    new Set([...familyRelationIds(byHead.get('capital'))].filter((id) => completionWordIds.has(id))),
    new Set(['capitalism', 'capitalist', 'capitalize']),
  )
  assert.ok(familyRelationIds(byHead.get('adjust')).has('adjustable'))
  assert.ok(familyRelationIds(byHead.get('predict')).has('prediction'))
  assert.ok(familyRelationIds(byHead.get('secure')).has('security'))
})

test('補助語根は同じ綴りの別語源を混ぜない', () => {
  const excludes = [
    ['imminent', 'mini'],
    ['money', 'mon'],
    ['curse', 'curr'],
    ['passion', 'pass'],
    ['test', 'testis'],
    ['recover', 'cover'],
    ['incident', 'cide'],
  ]
  for (const [head, rootId] of excludes) {
    const word = byHead.get(head)
    assert.ok(word, head)
    assert.ok(!word.referenceRoots.includes(rootId), `${head} を ${rootId} へ誤接続`)
  }

  assert.ok(byHead.get('supply').referenceRoots.includes('plere'))
  assert.ok(!rootIdsForWord(byHead.get('supply')).includes('plic'))
  assert.ok(rootIdsForWord(byHead.get('duplicate')).includes('plic'))
})
