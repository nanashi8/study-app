import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { PASSAGES } from '../src/data/passages.js'
import { resolvePassageWord } from '../src/data/passage-gloss.js'
import { ALL_WORDS } from '../src/data/vocab.js'

const OUTPUT_URL = new URL('../src/data/reading-extended-sentences.generated.js', import.meta.url)
const WORD_PATTERN = /[A-Za-z]+(?:['’][A-Za-z]+)*/g
const normalizeToken = (value) => value.toLowerCase().replace('’', "'")
const wordsIn = (value = '') => value.match(WORD_PATTERN) ?? []
const countWords = (value = '') => wordsIn(value).length
const knownWordIds = new Set(ALL_WORDS.map((word) => word.id))

const existingCoverage = new Set()
for (const passage of PASSAGES.filter((item) => !item.extended)) {
  for (const sentence of passage.sentences ?? []) {
    for (const token of wordsIn(sentence.en)) {
      const resolved = resolvePassageWord(normalizeToken(token), sentence.gloss)
      if (resolved?.id && knownWordIds.has(resolved.id)) existingCoverage.add(resolved.id)
    }
  }
}

const sentenceResolvesTo = (sentence, id) => {
  const resolvedIds = wordsIn(sentence).map((token) =>
    resolvePassageWord(normalizeToken(token), {})?.id)
  return resolvedIds.includes(id) && resolvedIds.every(Boolean)
}

const candidateRows = ALL_WORDS
  .filter((word) => !existingCoverage.has(word.id))
  .filter((word) => word.example?.en && word.example?.ja)
  // 学習者画面の操作名と教材例文の名詞が衝突する例は、
  // 本文へ複製せず別の監査済み例文を選ぶ。
  .filter((word) => !/クイズ/.test(word.example.ja))
  .filter((word) => /^[A-Z“"']/.test(word.example.en) && /[.]$/.test(word.example.en))
  .filter((word) => {
    const length = countWords(word.example.en)
    return length >= 5 && length <= 22
  })
  .filter((word) => sentenceResolvesTo(word.example.en, word.id))

const uniqueCandidateRows = []
const seenExamples = new Set()
for (const word of candidateRows) {
  const key = word.example.en.toLowerCase().replace(/\s+/g, ' ').trim()
  if (seenExamples.has(key)) continue
  seenExamples.add(key)
  uniqueCandidateRows.push(word)
}

const section = (id, title, titleJa, fields, introductions) => ({
  id,
  title,
  titleJa,
  fields,
  introductions,
})

const specs = [
  {
    id: 'p_ext_1000_civic_decisions',
    targetWords: 1000,
    sections: [
      section('voice', 'Voice and Representation', '声と代表', ['政治', 'コミュニケーション'], [
        ['A public decision begins with a question about who may speak and who still has no voice in the room.', '公共の決定は、誰が発言でき、誰の声がまだその場に届いていないのかという問いから始まります。'],
        ['The cases in this section show that representation is a practice rather than a title.', 'この節の事例は、代表とは肩書ではなく実践であることを示します。'],
      ]),
      section('rights', 'Law, Rights, and Responsibility', '法・権利・責任', ['法律'], [
        ['A fair procedure must protect rights while also explaining duties and limits.', '公正な手続きは、権利を守ると同時に義務と限界も説明しなければなりません。'],
        ['Short legal examples help readers separate an accusation from evidence and a judgment.', '短い法律上の事例は、訴え、証拠、判断を区別する助けになります。'],
      ]),
      section('information', 'Information Before an Argument', '議論の前に必要な情報', ['メディア', '情報', '教育'], [
        ['Citizens cannot compare proposals when important information is hidden or difficult to verify.', '重要な情報が隠され、確かめにくければ、市民は提案を比較できません。'],
        ['Education and responsible media therefore support the same public task.', 'したがって教育と責任あるメディアは、同じ公共的な課題を支えます。'],
      ]),
      section('resources', 'Budgets and Public Choices', '予算と公共の選択', ['経済', 'ビジネス'], [
        ['Every promise uses time, labor, money, or another resource that could serve a different goal.', 'どの約束にも、別の目的に使えた時間、労働、お金、その他の資源が必要です。'],
        ['Economic examples reveal the difficult choices that a simple political claim may conceal.', '経済の事例は、単純な政治的主張が隠しかねない難しい選択を明らかにします。'],
      ]),
      section('revision', 'A Decision That Can Be Revised', '見直せる決定', ['社会', '軍事'], [
        ['A democratic choice should be firm enough to guide action and open enough to be revised.', '民主的な選択は、行動を導けるほど明確でありながら、見直せるほど開かれているべきです。'],
        ['The final cases ask how institutions can learn without treating every correction as defeat.', '最後の事例は、制度があらゆる修正を敗北とみなさずに学ぶ方法を問いかけます。'],
      ]),
    ],
  },
  {
    id: 'p_ext_2000_customs_across_borders',
    targetWords: 2000,
    sections: [
      section('greetings', 'Greetings and First Impressions', '挨拶と第一印象', ['コミュニケーション', '家族・人', '言語', '社会'], [
        ['A custom often becomes visible only when a visitor expects people to act differently.', '風習は、旅行者が人々に別の振る舞いを予想したときに初めて見えることがあります。'],
        ['Greetings can express distance, equality, age, affection, or respect without a long explanation.', '挨拶は、長い説明をせずに距離、平等、年齢、親しさ、敬意を表せます。'],
      ]),
      section('hospitality', 'Hospitality and the Shared Table', 'もてなしと食卓', ['料理', '食・生活', '動作・行為', '性質・状態'], [
        ['Meals give hosts and guests a practical way to show welcome, restraint, gratitude, and care.', '食事は、主人と客が歓迎、節度、感謝、配慮を示す具体的な方法になります。'],
        ['Yet table manners make sense only after readers learn what a community is trying to protect.', 'しかし食卓の作法は、その共同体が何を守ろうとしているかを知って初めて理解できます。'],
      ]),
      section('belief', 'Festivals, Belief, and Daily Life', '祭り・信仰・日常生活', ['宗教', '音楽', '歴史', '芸術', '文学'], [
        ['A festival may be religious, seasonal, historical, commercial, or several of these at once.', '祭りは宗教的、季節的、歴史的、商業的である場合も、それらが重なる場合もあります。'],
        ['Music and repeated actions allow a community to remember ideas that no single speech could preserve.', '音楽と繰り返される行為は、一つの演説では残せない考えを共同体が記憶する助けになります。'],
      ]),
      section('memory', 'Art, Objects, and Memory', '芸術・物・記憶', ['芸術', '歴史', '教育', '一般'], [
        ['Clothing, buildings, tools, and works of art can carry memories across generations.', '衣服、建物、道具、芸術作品は、世代を越えて記憶を運ぶことができます。'],
        ['Their meaning changes when museums, families, and governments select different parts of the past.', '博物館、家族、政府が過去の異なる部分を選ぶと、その意味も変化します。'],
      ]),
      section('movement', 'Language, Place, and Migration', '言語・場所・移動', ['言語', '地理', '交通', '経済', 'ビジネス'], [
        ['People carry words and habits with them when work, study, danger, or hope moves them abroad.', '仕事、学業、危険、希望によって海外へ移るとき、人は言葉と習慣も携えていきます。'],
        ['A borrowed expression may keep an old meaning, gain a new one, or connect several identities.', '借用された表現は、古い意味を保つことも、新しい意味を得ることも、複数の帰属意識を結ぶこともあります。'],
      ]),
      section('stereotypes', 'Learning Without Stereotypes', '決めつけずに学ぶ', ['社会', '文学', '心理', '性質・状態', '教育', '法律', '一般'], [
        ['No country has one unchanging culture, and no custom explains every person who lives there.', 'どの国にも一つだけの不変な文化はなく、一つの風習でそこに暮らすすべての人を説明することもできません。'],
        ['Careful readers compare context, generation, region, and individual choice before making a claim.', '注意深い読み手は、結論を出す前に文脈、世代、地域、個人の選択を比較します。'],
      ]),
    ],
  },
  {
    id: 'p_ext_3000_shared_watershed',
    targetWords: 3000,
    sections: [
      section('source', 'From Rain to River', '雨から川へ', ['自然', '気象', '一般'], [
        ['A river begins as weather, soil, stone, plants, and countless small movements of water.', '川は、天候、土、石、植物、そして無数の小さな水の動きから始まります。'],
        ['Understanding the whole system requires attention to both visible events and slow hidden change.', '仕組み全体を理解するには、目に見える出来事と、ゆっくり進む隠れた変化の両方に注意が必要です。'],
      ]),
      section('ecosystem', 'Living Systems', '生きた仕組み', ['環境', '科学', '性質・状態'], [
        ['Water supports an ecosystem whose parts react to temperature, pollution, disease, and human repair.', '水は、気温、汚染、病気、人の修復に反応する多くの部分から成る生態系を支えます。'],
        ['Scientific examples show why one dramatic observation cannot represent a changing habitat.', '科学の事例は、一度の劇的な観察だけでは変化する生息地を代表できない理由を示します。'],
      ]),
      section('food', 'Farms, Food, and Soil', '農地・食料・土', ['農業', '食・生活', '動作・行為', '経済'], [
        ['Farmers depend on water, but their choices also affect the water that reaches people downstream.', '農家は水に頼りますが、その選択は下流の人々へ届く水にも影響します。'],
        ['The cases connect crops and soil with labor, nutrition, markets, and long term resilience.', 'この節の事例は、作物と土を、労働、栄養、市場、長期的な回復力へ結び付けます。'],
      ]),
      section('health', 'Water and Public Health', '水と公衆衛生', ['医学', '心理'], [
        ['Clean water is a medical resource even when no hospital appears in the picture.', '清潔な水は、写真に病院が写っていなくても医療資源です。'],
        ['Health examples reveal how exposure, prevention, diagnosis, and treatment belong to one chain.', '健康の事例は、接触、予防、診断、治療が一つの連鎖に属することを示します。'],
      ]),
      section('infrastructure', 'Pipes, Roads, and Buildings', '管・道路・建物', ['建築', '交通', '一般', '動作・行為'], [
        ['Infrastructure directs water and people, but it can also transfer danger from one place to another.', '基盤設備は水と人を導きますが、危険をある場所から別の場所へ移すこともあります。'],
        ['Design must consider maintenance, access, failure, and the people who cannot choose an alternative.', '設計では、維持管理、利用可能性、故障、代替手段を選べない人々を考えなければなりません。'],
      ]),
      section('energy', 'Energy and Machines', 'エネルギーと機械', ['技術'], [
        ['Pumps, sensors, software, and power systems make modern water management possible.', 'ポンプ、センサー、ソフトウェア、電力設備が現代の水管理を可能にしています。'],
        ['Technology helps only when operators can understand, repair, and govern it under pressure.', '技術が役立つのは、担当者が緊急時にも理解し、修理し、管理できる場合だけです。'],
      ]),
      section('measurement', 'Measurement and Uncertainty', '測定と不確実性', ['測定', '数学', '学問', '時間・数量', '副詞'], [
        ['A measurement is useful when readers know where it came from and what uncertainty remains.', '測定値は、それがどこから来て、どんな不確実性が残るかを読み手が知っているときに役立ちます。'],
        ['Models can compare futures, but they cannot remove the need for judgment and revision.', 'モデルは将来を比較できますが、判断と見直しの必要をなくすことはできません。'],
      ]),
      section('cooperation', 'A Resource Shared Downstream', '下流まで共有する資源', ['社会', '政治', '法律', 'ビジネス'], [
        ['Communities near the source and those farther down experience the same river through different risks and benefits.', '水源に近い共同体と、そこからさらに下にある共同体は、異なる危険と利益を通して同じ川を経験します。'],
        ['Durable cooperation combines rules, evidence, compensation, local knowledge, and a way to revise mistakes.', '長続きする協力には、規則、証拠、補償、地域の知識、誤りを見直す方法が必要です。'],
      ]),
    ],
  },
  {
    id: 'p_ext_4000_generational_city',
    targetWords: 4000,
    sections: [
      section('time', 'Thinking Beyond the Next Year', '翌年より先を考える', ['時間・数量', '副詞', '機能語'], [
        ['A city that thinks in generations must connect urgent needs with consequences that arrive slowly.', '世代単位で考える都市は、緊急の必要と、ゆっくり現れる結果を結び付けなければなりません。'],
        ['Time words matter because a benefit today may become a cost tomorrow, or the reverse.', '今日の利益が明日の費用になることも、その逆もあるため、時間を表す語は重要です。'],
      ]),
      section('mind', 'Fear, Hope, and Attention', '恐れ・希望・注意', ['心理', 'コミュニケーション'], [
        ['Public choices are shaped by emotion as well as evidence, memory, habit, and expectation.', '公共の選択は、証拠だけでなく、感情、記憶、習慣、予想にも左右されます。'],
        ['Examples about the mind help readers notice why a reasonable person may resist a useful change.', '心理の事例は、合理的な人でも有益な変化に抵抗する理由へ気づく助けになります。'],
      ]),
      section('work', 'Work, Skill, and Organization', '仕事・技能・組織', ['動作・行為', 'スポーツ', '軍事'], [
        ['Plans become real through ordinary actions performed by people with different skills and authority.', '計画は、異なる技能と権限を持つ人々の普通の行動を通して現実になります。'],
        ['The examples distinguish intention from execution and activity from a result that can be measured.', 'この節の事例は、意図と実行、活動と測定できる結果を区別します。'],
      ]),
      section('conditions', 'Conditions That Shape Outcomes', '結果を形づくる条件', ['性質・状態', '様子・程度'], [
        ['The same policy can be effective, fragile, fair, costly, visible, or nearly invisible in different settings.', '同じ政策でも、状況によって効果的、脆弱、公正、高価、目立つ、ほとんど気づかれないものになりえます。'],
        ['Precise language prevents readers from treating every difference as success or failure.', '正確な言葉は、読み手があらゆる違いを成功や失敗として扱うのを防ぎます。'],
      ]),
      section('markets', 'Markets and Household Security', '市場と家計の安定', ['経済', 'ビジネス', '食・生活'], [
        ['Prices, wages, debt, savings, ownership, and risk connect national policy with daily household life.', '物価、賃金、負債、貯蓄、所有、危険は、国の政策と日々の家計を結び付けます。'],
        ['Economic growth matters, but distribution decides who can turn growth into security and choice.', '経済成長は重要ですが、誰が成長を安心と選択へ変えられるかは分配が決めます。'],
      ]),
      section('institutions', 'Institutions and Public Trust', '制度と公共の信頼', ['社会', '法律', '政治'], [
        ['Trust does not require perfect institutions, but it does require explanation, correction, and accountability.', '信頼に完全な制度は必要ありませんが、説明、修正、説明責任は必要です。'],
        ['Social and legal cases show how formal rules interact with status, custom, access, and power.', '社会と法律の事例は、正式な規則が地位、慣習、利用可能性、力とどう関わるかを示します。'],
      ]),
      section('knowledge', 'Knowledge and Public Learning', '知識と公共の学び', ['一般', '教育', 'メディア', '情報', '言語'], [
        ['A learning city treats knowledge as something to test, share, question, and improve.', '学ぶ都市は、知識を検証し、共有し、問い直し、改善するものとして扱います。'],
        ['General examples provide the language needed to connect specialized debates without erasing their differences.', '一般分野の事例は、専門的な議論の違いを消さずに結び付けるための言葉を与えます。'],
      ]),
      section('health', 'Care Across a Lifetime', '生涯にわたるケア', ['医学', '家族・人', '食・生活'], [
        ['Health policy reaches from birth and prevention to disability, aging, treatment, and care at the end of life.', '健康政策は、誕生と予防から、障害、加齢、治療、人生の終わりのケアまで及びます。'],
        ['A long view asks not only what medicine can do but also who receives time, dignity, and support.', '長期的な視点は、医療に何ができるかだけでなく、誰が時間、尊厳、支援を受けるかも問います。'],
      ]),
      section('tools', 'Tools, Networks, and Limits', '道具・ネットワーク・限界', ['技術', '科学', '数学', '測定', '建築', '交通', '環境', '自然', '気象', '農業', '地理'], [
        ['Digital systems can coordinate a large city, yet dependence creates new points of failure and exclusion.', 'デジタル設備は大都市を調整できますが、依存は新たな故障点と排除を生みます。'],
        ['Scientific and technical examples must therefore be read with their assumptions, boundaries, and maintenance needs.', 'したがって科学と技術の事例は、前提、限界、維持管理の必要とともに読まなければなりません。'],
      ]),
      section('future', 'A Future Open to Revision', '見直しに開かれた未来', ['学問', '文学', '芸術', '音楽', '宗教', '歴史', '料理'], [
        ['Stories and research let people imagine futures that cannot yet be observed directly.', '物語と研究は、まだ直接観察できない未来を人々が想像する助けになります。'],
        ['The final task is to choose a direction while preserving evidence, disagreement, and the ability to change course.', '最後の課題は、証拠、異論、進路を変える力を守りながら方向を選ぶことです。'],
      ]),
    ],
  },
]

const stableHash = (value) => {
  let hash = 2166136261
  for (const char of value) {
    hash ^= char.codePointAt(0)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

const usedWordIds = new Set()
const usedExamples = new Set()
const generated = {}
const finalPassageId = specs.at(-1).id
const initialFieldCounts = uniqueCandidateRows.reduce((counts, word) => {
  counts.set(word.field, (counts.get(word.field) ?? 0) + 1)
  return counts
}, new Map())
const finalFieldReserves = new Map([...initialFieldCounts].map(([field, count]) =>
  [field, Math.max(2, Math.floor(count * 0.12))]))
const remainingInField = (field) => uniqueCandidateRows
  .filter((word) => word.field === field && !usedWordIds.has(word.id)).length
const heldForFinalPassage = (word, spec) =>
  spec.id !== finalPassageId &&
  remainingInField(word.field) <= (finalFieldReserves.get(word.field) ?? 0)

const introRow = ([en, ja], spec, sectionSpec, index) => ({
  en,
  ja,
  targetId: null,
  targetWord: null,
  field: null,
  sectionId: sectionSpec.id,
  sectionTitle: sectionSpec.title,
  sectionTitleJa: sectionSpec.titleJa,
  paragraphStart: index === 0,
  editorialOrder: index,
  source: 'editorial-transition',
})

for (const spec of specs) {
  const rows = []
  for (const sectionSpec of spec.sections) {
    rows.push(...sectionSpec.introductions.map((item, index) =>
      introRow(item, spec, sectionSpec, index)))
  }

  const minimum = Math.floor(spec.targetWords * 0.985)
  const maximum = Math.ceil(spec.targetWords * 1.015)
  let totalWords = rows.reduce((sum, row) => sum + countWords(row.en), 0)
  let cursor = 0
  let stalledSections = 0

  const pools = spec.sections.map((sectionSpec) => uniqueCandidateRows
    .filter((word) => sectionSpec.fields.includes(word.field))
    .filter((word) => !usedWordIds.has(word.id))
    .sort((left, right) =>
      stableHash(`${spec.id}:${sectionSpec.id}:${left.id}`) -
      stableHash(`${spec.id}:${sectionSpec.id}:${right.id}`)))

  while (totalWords < minimum) {
    const sectionIndex = cursor % spec.sections.length
    const sectionSpec = spec.sections[sectionIndex]
    let word = pools[sectionIndex].shift()

    while (word && (
      usedWordIds.has(word.id) ||
      heldForFinalPassage(word, spec) ||
      usedExamples.has(word.example.en.toLowerCase().replace(/\s+/g, ' ').trim()) ||
      totalWords + countWords(word.example.en) > maximum
    )) word = pools[sectionIndex].shift()

    if (!word) {
      cursor += 1
      stalledSections += 1
      if (stalledSections >= spec.sections.length) {
        throw new Error(`${spec.id}: 節の分野に合う候補だけで${minimum}語へ届けられません (${totalWords}語)`)
      }
      continue
    }

    stalledSections = 0
    const exampleKey = word.example.en.toLowerCase().replace(/\s+/g, ' ').trim()
    usedWordIds.add(word.id)
    usedExamples.add(exampleKey)
    rows.push({
      en: word.example.en,
      ja: word.example.ja,
      targetId: word.id,
      targetWord: word.word,
      field: word.field,
      sectionId: sectionSpec.id,
      sectionTitle: sectionSpec.title,
      sectionTitleJa: sectionSpec.titleJa,
      paragraphStart: false,
      source: 'shared-vocabulary-example',
    })
    totalWords += countWords(word.example.en)
    cursor += 1
  }

  const sectionOrder = new Map(spec.sections.map((item, index) => [item.id, index]))
  const orderedRows = rows
    .sort((left, right) => {
      const sectionDelta = sectionOrder.get(left.sectionId) - sectionOrder.get(right.sectionId)
      if (sectionDelta !== 0) return sectionDelta
      if (left.source === 'editorial-transition' && right.source !== 'editorial-transition') return -1
      if (right.source === 'editorial-transition' && left.source !== 'editorial-transition') return 1
      if (left.source === 'editorial-transition' && right.source === 'editorial-transition') {
        return left.editorialOrder - right.editorialOrder
      }
      return stableHash(`${spec.id}:${left.en}`) - stableHash(`${spec.id}:${right.en}`)
    })

  for (const sectionSpec of spec.sections) {
    let withinSection = 0
    for (const row of orderedRows.filter((item) => item.sectionId === sectionSpec.id)) {
      row.paragraphStart = withinSection % 7 === 0
      withinSection += 1
    }
  }

  generated[spec.id] = {
    targetWords: spec.targetWords,
    actualWords: orderedRows.reduce((sum, row) => sum + countWords(row.en), 0),
    targetVocabularyCount: orderedRows.filter((row) => row.targetId).length,
    sectionFields: Object.fromEntries(spec.sections.map((item) => [item.id, item.fields])),
    rows: orderedRows,
  }
}

for (const [passageId, data] of Object.entries(generated)) {
  if (Math.abs(data.actualWords - data.targetWords) > data.targetWords * 0.015) {
    throw new Error(`${passageId}: ${data.actualWords}語は目標${data.targetWords}語の許容範囲外です`)
  }
}

const banner = `// このファイルは scripts/generate-extended-reading.mjs が生成します。\n` +
  `// 共通辞書の監査済み例文と編集済みの接続文を、分野別ロングリーディングへ固定します。\n\n`
const output = `${banner}export const EXTENDED_READING_GENERATED = Object.freeze(${JSON.stringify(generated, null, 2)})\n`
writeFileSync(fileURLToPath(OUTPUT_URL), output)

const summary = Object.fromEntries(Object.entries(generated).map(([id, value]) => [id, {
  words: value.actualWords,
  targetVocabulary: value.targetVocabularyCount,
  sentences: value.rows.length,
}]))
console.log(JSON.stringify(summary, null, 2))
