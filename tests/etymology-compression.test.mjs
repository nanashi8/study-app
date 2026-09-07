import test from 'node:test'
import assert from 'node:assert/strict'
import {
  ALL_WORDS,
  ETYMOLOGY_DOMAIN_META,
  ETYMOLOGY_FIELD_TO_DOMAIN,
  ETYMOLOGY_FORMATION_META,
  ETYMOLOGY_MODE_META,
  ETYMOLOGY_LEGACY_PACKS as ETYMOLOGY_PACKS,
  ETYMOLOGY_PACKS as ETYMOLOGY_PUBLIC_PACKS,
  ETYMOLOGY_WORD_STORIES,
  etymologyCardsForWord,
  etymologyStoryForWord,
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
import { AUDITED_MORPHEME_ROOT_WORDS } from '../src/data/etymology-morpheme-audit.js'
import {
  CLASSICAL_ROOTS,
  CLASSICAL_ROOT_WORDS,
} from '../src/data/etymology-classical-roots.js'
import {
  GERMANIC_ROOTS,
  GERMANIC_ROOT_WORDS,
} from '../src/data/etymology-germanic-roots.js'
import { etymologyOriginFamily } from '../src/data/etymology-origin-families.js'
import {
  AUDIT_STEM_ROOTS,
  AUDIT_STEM_ROOT_WORDS,
} from '../src/data/etymology-audit-stems.js'
import { AUDITED_LINK_WORDS } from '../src/data/etymology-link-audit.js'
import {
  PREFIX_ROOTS,
  PREFIX_ROOT_WORDS,
  PREFIX_VARIANTS,
} from '../src/data/etymology-prefix-roots.js'
import {
  SUFFIX_ROOTS,
  SUFFIX_ROOT_WORDS,
  SUFFIX_VARIANTS,
} from '../src/data/etymology-suffix-roots.js'
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

  const classicalRootIds = new Set(CLASSICAL_ROOTS.map((root) => root.id))
  assert.equal(classicalRootIds.size, CLASSICAL_ROOTS.length)
  assert.ok([...classicalRootIds].every((rootId) => rootIds.has(rootId)))
  assert.deepEqual(
    Object.keys(CLASSICAL_ROOT_WORDS).sort(),
    [...classicalRootIds].sort(),
    '追加語根の語リストと語根定義が一致しません',
  )

  const prefixRootIds = new Set(PREFIX_ROOTS.map((root) => root.id))
  assert.equal(prefixRootIds.size, PREFIX_ROOTS.length)
  assert.ok([...prefixRootIds].every((rootId) => rootIds.has(rootId)))
  assert.ok([...prefixRootIds].every((rootId) => rootId.startsWith('pf-')))
  assert.deepEqual(
    Object.keys(PREFIX_ROOT_WORDS).sort(),
    [...prefixRootIds].sort(),
    '接頭辞カードの語リストと語根定義が一致しません',
  )

  const auditStemIds = new Set(AUDIT_STEM_ROOTS.map((root) => root.id))
  assert.equal(auditStemIds.size, AUDIT_STEM_ROOTS.length)
  assert.ok([...auditStemIds].every((rootId) => rootIds.has(rootId)))
  assert.deepEqual(
    Object.keys(AUDIT_STEM_ROOT_WORDS).sort(),
    [...auditStemIds].sort(),
    '追加した語幹カードの語リストと語根定義が一致しません',
  )
  for (const heads of Object.values(AUDIT_STEM_ROOT_WORDS)) assert.ok(heads.length >= 3)

  const suffixRootIds = new Set(SUFFIX_ROOTS.map((root) => root.id))
  assert.equal(suffixRootIds.size, SUFFIX_ROOTS.length)
  assert.ok([...suffixRootIds].every((rootId) => rootIds.has(rootId)))
  assert.ok([...suffixRootIds].every((rootId) => rootId.startsWith('sf-')))
  assert.deepEqual(
    Object.keys(SUFFIX_ROOT_WORDS).sort(),
    [...suffixRootIds].sort(),
    '接尾辞カードの語リストと語根定義が一致しません',
  )

  const germanicRootIds = new Set(GERMANIC_ROOTS.map((root) => root.id))
  assert.equal(germanicRootIds.size, GERMANIC_ROOTS.length)
  assert.ok([...germanicRootIds].every((rootId) => rootIds.has(rootId)))
  assert.ok([...germanicRootIds].every((rootId) => rootId.startsWith('ge-')))
  assert.deepEqual(
    Object.keys(GERMANIC_ROOT_WORDS).sort(),
    [...germanicRootIds].sort(),
    '土着語根の語リストと語根定義が一致しません',
  )

  // 手書き許可リスト・形態素監査台帳・古典語根・土着語根は、どれも明示リンク。
  const seen = new Set()
  for (const source of [
    REFERENCE_ROOT_WORDS,
    AUDITED_MORPHEME_ROOT_WORDS,
    CLASSICAL_ROOT_WORDS,
    GERMANIC_ROOT_WORDS,
    AUDITED_LINK_WORDS,
    PREFIX_ROOT_WORDS,
    SUFFIX_ROOT_WORDS,
    AUDIT_STEM_ROOT_WORDS,
  ]) {
    for (const [rootId, heads] of Object.entries(source)) {
      assert.ok(rootIds.has(rootId), rootId)
      assert.equal(new Set(heads).size, heads.length, `${rootId}: 同じ単語が重複`)
      for (const head of heads) {
        const word = byHead.get(head)
        assert.ok(word, `${rootId}: 未収録語 ${head}`)
        assert.ok(word.referenceRoots.includes(rootId), `${head}: ${rootId}`)
        assert.ok(rootIdsForWord(word).includes(rootId), `${head}: 統合語根 ${rootId}`)
        assert.ok(wordsByRoot(rootId).some((item) => item.id === word.id), `${rootId}: ${head}`)
        seen.add(`${rootId}:${head}`)
      }
    }
  }
  assert.equal(seen.size, REFERENCE_ROOT_LINK_COUNT)

  // referenceRoots を足しても、保存互換の分類元 roots は書き換えない。
  const administer = byHead.get('administer')
  assert.deepEqual(administer.roots, [])
  assert.ok(administer.referenceRoots.includes('mini'))
  assert.notEqual(administer.compression.mode, 'root')
})

test('追加した補助語根は既存語の内容と関連語へ適用される', () => {
  const legacyWords = ALL_WORDS.filter((word) => sourceGroup(word.id) === 'legacy')
  const applied = legacyWords.filter((word) => word.referenceRoots.length > 0)
  assert.equal(applied.length, 3726)
  assert.equal(
    applied.reduce((sum, word) => sum + word.referenceRoots.length, 0),
    5644,
  )

  for (const word of applied) {
    // 語根が複数ある語は、同じ関連語を先に出た語根でまとめる。ここでは
    // 「どの語根も一覧に載り、関連語を1語以上持つ」ことだけを保証する。
    const relations = relatedByEtymology(word)
    const viaRootIds = new Set(relations.map((relation) => relation.via))
    assert.ok(relations.length > 0, `${word.id}: 関連語なし`)
    assert.ok(
      word.referenceRoots.some((rootId) => viaRootIds.has(rootId))
      || (word.etymology?.parts ?? []).some((part) => viaRootIds.has(part.root)),
      `${word.id}: 関連語の語根が自分の語根と一致しない`,
    )
    for (const rootId of word.referenceRoots) {
      assert.ok(rootIdsForWord(word).includes(rootId), `${word.id}: ${rootId}`)
      assert.ok(wordsByRoot(rootId).some((candidate) => candidate.id === word.id), `${word.id}: root page`)
      assert.ok(wordsByRoot(rootId).length >= 2, `${word.id}: ${rootId} に関連語がない`)
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

test('英語の土着語カードは接辞の形と別語源の除外を守る', () => {
  // 接辞カードは「土着の接辞＋借用語幹」の混成語を含むが、綴りの上では必ずその接辞で始まる／終わる。
  const AFFIX_SHAPES = {
    'ge-be': /^be/, 'ge-for': /^for/, 'ge-fore': /^for/, 'ge-with': /^with/,
    'ge-out': /^out/, 'ge-over': /^over/, 'ge-under': /^under/, 'ge-up': /^up/,
    'ge-mis': /^mis/, 'ge-un': /^un/,
    'ge-ship': /ship$/, 'ge-hood': /hood$/, 'ge-dom': /dom$/, 'ge-th': /th$/,
    'ge-en': /en$/, 'ge-ward': /ward$/, 'ge-some': /some$/, 'ge-less': /less$/,
    'ge-ful': /ful$/, 'ge-ness': /ness$/,
  }
  for (const [rootId, shape] of Object.entries(AFFIX_SHAPES)) {
    for (const head of GERMANIC_ROOT_WORDS[rootId]) {
      assert.match(head, shape, `${rootId}: ${head}`)
    }
  }

  // 語族カードは語そのものが土着。既存の語源メモが借用語を示す語は入れない。
  const affixIds = new Set(Object.keys(AFFIX_SHAPES))
  for (const [rootId, heads] of Object.entries(GERMANIC_ROOT_WORDS)) {
    assert.ok(heads.length >= 2, `${rootId}: 関連語が1語以下`)
    if (affixIds.has(rootId)) continue
    for (const head of heads) {
      const note = byHead.get(head)?.etymology?.note ?? ''
      assert.doesNotMatch(
        note,
        /ラテン|ギリシャ|フランス|イタリア|スペイン|アラビア/,
        `${rootId}: ${head} は借用語のため語族カードへ入れない`,
      )
    }
  }

  // 綴りが似ているだけの別語源。1件でも混ざると語源そのものの説明が壊れる。
  const excludes = [
    ['outrage', 'ge-out'], ['overt', 'ge-over'], ['uproar', 'ge-up'],
    ['misery', 'ge-mis'], ['miserable', 'ge-mis'], ['missile', 'ge-mis'],
    ['because', 'ge-be'], ['betray', 'ge-be'],
    ['forever', 'ge-for'], ['forfeit', 'ge-for'],
    ['foreign', 'ge-fore'], ['forest', 'ge-fore'], ['wither', 'ge-with'],
    ['uncle', 'ge-un'], ['until', 'ge-un'], ['unique', 'ge-un'], ['unit', 'ge-un'],
    ['union', 'ge-un'], ['universe', 'ge-un'], ['understand', 'ge-un'],
    ['reward', 'ge-ward'], ['award', 'ge-ward'], ['coward', 'ge-ward'], ['ward', 'ge-ward'],
    ['less', 'ge-less'], ['unless', 'ge-less'], ['nevertheless', 'ge-less'],
    ['nonetheless', 'ge-less'], ['bless', 'ge-less'],
    ['harness', 'ge-ness'], ['wistful', 'ge-ful'],
    ['random', 'ge-dom'], ['seldom', 'ge-dom'],
    ['warship', 'ge-ship'], ['battleship', 'ge-ship'],
    ['month', 'ge-th'], ['tenth', 'ge-th'], ['worth', 'ge-th'], ['faith', 'ge-th'],
  ]
  for (const [head, rootId] of excludes) {
    const word = byHead.get(head)
    assert.ok(word, head)
    assert.ok(!word.referenceRoots.includes(rootId), `${head} を ${rootId} へ誤接続`)
  }

  // 土着の接辞・語族は、綴りの自動推測ではなく明示リンクだけでカードへ載る。
  assert.ok(byHead.get('withstand').referenceRoots.includes('ge-with'))
  assert.ok(byHead.get('withstand').referenceRoots.includes('ge-stand'))
  assert.ok(byHead.get('health').referenceRoots.includes('ge-whole'))
  assert.ok(byHead.get('bless').referenceRoots.includes('ge-blood'))
  for (const rootId of Object.keys(GERMANIC_ROOT_WORDS)) {
    assert.ok(wordsByRoot(rootId).length >= 2, rootId)
  }
})

test('語源カードの系統は由来文の最初の言語で決まる', () => {
  assert.equal(etymologyOriginFamily('ラテン語 portāre「運ぶ」'), 'latin')
  assert.equal(etymologyOriginFamily('ギリシャ語 graphein「書く」'), 'greek')
  assert.equal(etymologyOriginFamily('古英語 be-「まわりに・すっかり」'), 'germanic')
  assert.equal(etymologyOriginFamily('古ノルド語 kasta「投げる」'), 'germanic')
  // 複数の言語に触れる由来文は、最初に出てくる言語をその語根の出どころとみなす。
  assert.equal(etymologyOriginFamily('古英語 lang / ラテン語 longus「長い」'), 'germanic')
  assert.equal(etymologyOriginFamily('ラテン語 nōmen / ギリシャ語 onyma「名前」'), 'latin')
  assert.equal(etymologyOriginFamily('後期ラテン語 carrus「車」'), 'latin')

  const counts = ETYMOLOGY_PUBLIC_PACKS.reduce((totals, card) => ({
    ...totals,
    [card.originFamily]: (totals[card.originFamily] ?? 0) + 1,
  }), {})
  assert.deepEqual(counts, { latin: 251, greek: 40, germanic: 48 })
  for (const rootId of Object.keys(GERMANIC_ROOT_WORDS)) {
    const card = ETYMOLOGY_PUBLIC_PACKS.find((item) => item.rootId === rootId)
    assert.ok(card, rootId)
    assert.equal(card.originFamily, 'germanic', rootId)
  }
})

test('ラテン語・ギリシャ語の接頭辞カードは同化形と別語源の除外を守る', () => {
  for (const [rootId, heads] of Object.entries(PREFIX_ROOT_WORDS)) {
    assert.ok(heads.length >= 2, `${rootId}: 関連語が1語以下`)
    const variants = PREFIX_VARIANTS[rootId]
    assert.ok(variants?.length, rootId)
    for (const head of heads) {
      const matched = variants.filter((variant) => head.startsWith(variant))
      assert.ok(matched.length, `${rootId}: ${head} はこの接頭辞の形で始まらない`)
      // 接頭辞そのものと同じ語は入らない（control のように綴りが縮んだ語は許す）。
      assert.ok(
        matched.some((variant) => head.length > variant.length),
        `${rootId}: ${head} は接頭辞そのもの`,
      )
    }
  }

  // 綴りが接頭辞に見えるだけの語。1件でも混ざると分解の説明が壊れる。
  const excludes = [
    ['republic', 'pf-re'], ['republican', 'pf-re'],
    ['office', 'pf-ob'], ['officer', 'pf-ob'], ['official', 'pf-ob'],
    ['diminish', 'pf-dis'], ['alarm', 'pf-ad'],
    ['empathy', 'pf-in-into'], ['endemic', 'pf-in-into'],
  ]
  for (const [head, rootId] of excludes) {
    assert.ok(!byHead.get(head).referenceRoots.includes(rootId), `${head} を ${rootId} へ誤接続`)
  }

  // in- は「〜でない」と「中へ」を取り違えない。
  assert.ok(byHead.get('invisible').referenceRoots.includes('pf-in-not'))
  assert.ok(!byHead.get('invisible').referenceRoots.includes('pf-in-into'))
  assert.ok(byHead.get('include').referenceRoots.includes('pf-in-into'))
  assert.ok(!byHead.get('include').referenceRoots.includes('pf-in-not'))

  // 接頭辞と語幹が両方そろって初めて、語全体を分解して見せられる。
  const cardIds = (head) => etymologyCardsForWord(byHead.get(head)).map((card) => card.rootId)
  assert.deepEqual(new Set(cardIds('submit')), new Set(['miss', 'pf-sub']))
  assert.deepEqual(new Set(cardIds('incapable')), new Set(['cept', 'pf-in-not', 'sf-able']))
  assert.deepEqual(new Set(cardIds('ideology')), new Set(['ide', 'log']))
  assert.deepEqual(new Set(cardIds('suffocation')), new Set(['pf-sub', 'sf-tion']))
})

test('語の成り立ちは全語を出典つきで出す', () => {
  assert.equal(ETYMOLOGY_WORD_STORIES.length, ALL_WORDS.length)
  const kinds = ETYMOLOGY_WORD_STORIES.reduce((totals, story) => ({
    ...totals,
    [story.origin]: (totals[story.origin] ?? 0) + 1,
  }), {})
  assert.deepEqual(kinds, { 'reviewed-text': 291, 'sealed-note': 8578 })
  for (const story of ETYMOLOGY_WORD_STORIES) {
    // January / Ms. のように大文字で始まる見出し語もあるため、引くときは小文字にそろえる。
    const word = byHead.get(story.head.toLowerCase())
    assert.ok(word, story.head)
    assert.equal(story.wordId, word.id)
    assert.ok(story.note.length >= 6, story.head)
    assert.doesNotMatch(story.note, /確かな語源分解を収録していないため/, story.head)
    assert.equal(story.evidence.sources.length, 2)
    assert.equal(etymologyStoryForWord(word)?.note, story.note)
  }
  // 語根カードでは表せない語こそ、この台帳が受け持つ。
  assert.match(etymologyStoryForWord(byHead.get('ideology')).note, /1796年/)
  assert.match(etymologyStoryForWord(byHead.get('suffocation')).note, /faucēs/)
  assert.match(etymologyStoryForWord(byHead.get('panic')).note, /パン/)
  // 綴りが接頭辞の形と合わない語は、カードではなく台帳が受け持つ。
  assert.match(etymologyStoryForWord(byHead.get('enemy')).note, /amīcus/)
  assert.equal(etymologyCardsForWord(byHead.get('enemy')).length, 0)
})

test('ラテン語・ギリシャ語の接尾辞カードは語尾と別語源の除外を守る', () => {
  for (const [rootId, heads] of Object.entries(SUFFIX_ROOT_WORDS)) {
    assert.ok(heads.length >= 2, `${rootId}: 関連語が1語以下`)
    const variants = SUFFIX_VARIANTS[rootId]
    assert.ok(variants?.length, rootId)
    for (const head of heads) {
      assert.ok(
        variants.some((variant) => head.endsWith(variant)),
        `${rootId}: ${head} はこの接尾辞の形で終わらない`,
      )
    }
  }
  // -ant / -ent は -ment を拾わない（-ment はそちらのカードが受け持つ）。
  for (const head of SUFFIX_ROOT_WORDS['sf-ant']) {
    assert.doesNotMatch(head, /ment$/, `sf-ant: ${head}`)
  }

  // 語尾が接尾辞に見えるだけの語。1件でも混ざると語形の説明が壊れる。
  const excludes = [
    ['receive', 'sf-ive'], ['survive', 'sf-ive'], ['deprive', 'sf-ive'], ['forgive', 'sf-ive'],
    ['promise', 'sf-ize'], ['precise', 'sf-ize'], ['advise', 'sf-ize'], ['supervise', 'sf-ize'],
    ['otherwise', 'sf-ize'], ['sunrise', 'sf-ize'],
    ['assist', 'sf-ist'], ['resist', 'sf-ist'], ['insist', 'sf-ist'],
    ['secure', 'sf-ure'], ['procure', 'sf-ure'], ['endure', 'sf-ure'], ['injure', 'sf-ure'],
    ['minor', 'sf-or'], ['senior', 'sf-or'], ['behavior', 'sf-or'], ['outdoor', 'sf-or'],
    ['memory', 'sf-ary'], ['victory', 'sf-ary'], ['appeal', 'sf-al'],
    ['consent', 'sf-ant'], ['invent', 'sf-ant'], ['descent', 'sf-ant'],
  ]
  for (const [head, rootId] of excludes) {
    assert.ok(!byHead.get(head).referenceRoots.includes(rootId), `${head} を ${rootId} へ誤接続`)
  }

  // 接頭辞・語幹・接尾辞がそろうと、語全体を組み立て直して見せられる。
  const cardIds = (head) => new Set(etymologyCardsForWord(byHead.get(head)).map((card) => card.rootId))
  assert.deepEqual(cardIds('production'), new Set(['duct', 'pf-pro', 'sf-tion']))
  assert.deepEqual(cardIds('incapable'), new Set(['cept', 'pf-in-not', 'sf-able']))
  assert.deepEqual(cardIds('productivity'), new Set(['duct', 'pf-pro', 'sf-ity']))
})
