import {
  translationRoleExplanation,
  translationRoleHeading,
  translationRoleMeta,
} from './translation-roles.js'

const ARGUMENT_ROLES = new Set(['O', 'O1', 'O2', 'C'])
const OPTIONAL_BINDINGS = Object.freeze([
  'agreementBinding',
  'clauseBinding',
  'closureBinding',
  'comparisonBinding',
  'conditionBinding',
  'coordinationBinding',
  'focusBinding',
  'infinitiveBinding',
  'ingBinding',
  'particleBinding',
  'prepositionBinding',
  'punctuationBoundary',
  'reducedRelativeBinding',
  'sharedObjectBinding',
  'zeroRelativeBinding',
])

const PENDING_JAPANESE = /(?:次へ|続き|対象|内容|中身|何を|だれを|どんな|どのよう|実際の|評価|様子|期間|状態は|基準は)/u
const CONTENT_LINKS = new Set(['that', 'whether'])
const CLAUSE_STARTING_MODIFIERS = new Set(['how', 'what', 'when', 'where', 'whether', 'why'])
const MEANINGFUL_LINK_PAIRS = new Set([
  'and how',
  'and that',
  'and whether',
  'but because',
  'but when',
  'or if',
])

const englishWords = (value = '') =>
  `${value}`.match(/[A-Za-z][A-Za-z'’-]*/g) ?? []

const normalizedEnglish = (value = '') =>
  englishWords(value).map((word) => word.toLowerCase()).join(' ')

const rolesOf = (item) => [...new Set(
  item?.roles ?? item?.roleParts?.map((part) => part.role) ?? (item?.role ? [item.role] : []),
)]

const primaryRole = (item) => rolesOf(item)[0] ?? 'M'

const displayEnglish = (items) => items
  .map((item) => item.displayEn ?? item.en)
  .join(' ')
  .replace(/\s+([,.;:!?])/g, '$1')
  .trim()

const spokenEnglish = (items) => items
  .map((item) => item.spokenEn ?? item.en)
  .join(' ')
  .replace(/\s+([,.;:!?])/g, '$1')
  .trim()

function japanesePieces(value = '') {
  const parentheticals = []
  const base = `${value}`.replace(/（([^（）]*)）/gu, (_match, content) => {
    parentheticals.push(content.trim())
    return ''
  }).trim()
  return {
    base,
    pending: parentheticals.filter((content) => PENDING_JAPANESE.test(content)),
    completions: parentheticals.filter((content) => !PENDING_JAPANESE.test(content)),
  }
}

function cleanJapaneseBase(value = '') {
  return japanesePieces(value).base
    .replace(/^〜(?=[でにはをがと]?)/u, '')
    .replace(/（[^（）]*）/gu, '')
    .trim()
}

function japaneseCompletion(item) {
  if (item?.closureBinding) return ''
  return japanesePieces(item?.ja).completions.join('')
}

function joinJapanese(parts) {
  return parts
    .filter(Boolean)
    .join('')
    .replace(/にに/gu, 'に')
    .replace(/をを/gu, 'を')
    .replace(/がが/gu, 'が')
    .replace(/はは/gu, 'は')
    .replace(/、、/gu, '、')
    .trim()
}

function japaneseHasParenthetical(value = '') {
  return /（[^）]+）/u.test(`${value}`)
}

function japaneseHasCompletion(value = '') {
  return japanesePieces(value).completions.length > 0
}

function japaneseEndsWithCaseParticle(value = '') {
  return /(?:を|に|へ|が|は|と|で|から|まで|より|の)$/u.test(`${value}`.trim())
}

function japaneseLooksComplete(value = '') {
  return /(?:です|でした|でしょう|ます|ました|ません|ない|なかった|だった|である|であり|ある|いる|なる|なった|できる|できない|える|られる|れる|せる|たい|ほしい)$/u
    .test(`${value}`.trim())
}

function japaneseParentheticalCompletesPredicate(value = '') {
  return japanesePieces(value).completions.some((content) =>
    /(?:ます|ました|ません|です|でした|でしょう|なら|たら|れば|ため|とき|から|ので|ながら|一方で|考え|学び|測り|助け|望み|決め)/u.test(content))
}

function japaneseList(items, bases) {
  if (bases.length <= 1) return bases[0] ?? ''
  const particles = bases.map((base) => base.match(/(を|に|へ|が|は|と|で)$/u)?.[1] ?? '')
  const sameParticle = particles.every(Boolean) && particles.every((particle) => particle === particles[0])
  if (sameParticle) {
    return `${bases
      .map((base) => base.replace(new RegExp(`${particles[0]}$`, 'u'), ''))
      .join('・')}${particles[0]}`
  }
  return items.map((item, index) => {
    const base = bases[index]
    return /[,;:]\s*$/u.test(item.en) ? `${base}、` : base
  }).join('')
}

function japaneseWithPlaceholder(predicate, content) {
  if (!predicate.includes('〜')) return joinJapanese([content, predicate])
  let replacement = content
  if (/〜に/u.test(predicate) && replacement.endsWith('に')) {
    replacement = replacement.slice(0, -1)
  }
  if (/〜に/u.test(predicate) && replacement.endsWith('な')) {
    replacement = replacement.slice(0, -1)
  }
  const keepsOuterMeaning = /(?:かもしれ|べき|なければ|必要|でしょう|であり続け|のままで)/u.test(predicate)
  if (/であるべき/u.test(predicate) && replacement.endsWith('できる')) {
    return replacement.replace(/できる$/u, 'できなければなりません')
  }
  if (/であるべき/u.test(predicate) && replacement.endsWith('べき')) {
    return predicate.replace('〜であるべき', replacement)
  }
  if (japaneseLooksComplete(replacement) && !keepsOuterMeaning) return replacement
  if (/〜(?:では|である|にも)/u.test(predicate)) {
    replacement = replacement.replace(/な$/u, '')
  } else if (/〜です/u.test(predicate) && /な$/u.test(replacement)) {
    replacement = replacement.slice(0, -1)
  }
  if (/〜です/u.test(predicate) && japaneseLooksComplete(replacement) && !keepsOuterMeaning) {
    return replacement
  }
  return predicate.replace('〜', replacement)
}

function japaneseIncludesBase(value, base) {
  const normalizedValue = `${value}`.replace(/[、・（）()\s]/gu, '')
  const normalizedBase = `${base}`.replace(/[、・（）()\s]/gu, '')
  return Boolean(normalizedBase) && normalizedValue.includes(normalizedBase)
}

function completedJapaneseWithMissingParts(finalJapanese, precedingBases) {
  const missing = precedingBases.filter((base) => !japaneseIncludesBase(finalJapanese, base))
  return joinJapanese([...missing, finalJapanese])
}

function isRelativeBoundary(item) {
  const key = normalizedEnglish(item?.en)
  return ['that', 'which', 'who', 'whom', 'whose'].includes(key) &&
    (item?.specialGrammar?.includes('relative') ||
      item?.specialGrammar?.includes('relative-determiner'))
}

function japaneseForMeaningGroup(items) {
  if (items.length === 1) return items[0].ja

  const roles = items.map(primaryRole)
  const signature = roles.join('+')
  const bases = items.map((item) => cleanJapaneseBase(item.ja))
  const finalItem = items.at(-1)
  const completion = japaneseCompletion(finalItem)

  if (signature === 'LINK+LINK') return joinJapanese(bases)

  if (/^S(?:\+M)*\+V$/.test(signature)) {
    const last = finalItem.closureBinding ? finalItem.ja : bases.at(-1)
    const subject = bases[0]
    const subjectStem = subject.replace(/[はが]$/u, '')
    if (
      finalItem.closureBinding &&
      subjectStem &&
      last.includes(subjectStem)
    ) return last
    return joinJapanese([...bases.slice(0, -1), last])
  }

  if (/^V\+(?:O|O1|O2)(?:\+(?:O|O1|O2))*$/.test(signature)) {
    const argumentItems = items.slice(1)
    const argumentsJa = bases.slice(1)
    if (finalItem.closureBinding || japaneseHasCompletion(finalItem.ja)) {
      return completedJapaneseWithMissingParts(finalItem.ja, argumentsJa.slice(0, -1))
    }
    const lastArgument = argumentsJa.at(-1)
    // 原子Oがすでに述語まで含む場合は、その完成形を優先する。
    if (!japaneseEndsWithCaseParticle(lastArgument)) return finalItem.ja
    return joinJapanese([
      japaneseList(argumentItems, argumentsJa),
      bases[0],
    ])
  }

  if (/^V\+(?:O|O1|O2)(?:\+(?:O|O1|O2))*\+C$/.test(signature)) {
    const objectItems = items.slice(1, -1)
    const objectJa = japaneseList(objectItems, bases.slice(1, -1))
    const complementJa = bases.at(-1)
    if (finalItem.closureBinding || japaneseHasCompletion(finalItem.ja)) {
      return completedJapaneseWithMissingParts(finalItem.ja, bases.slice(1, -1))
    }
    const predicate = bases[0].replace(/^に(?=します)/u, '')
    return joinJapanese([objectJa, complementJa, predicate])
  }

  if (
    /^V(?:\+(?:O|O1|O2))+\+M$/.test(signature) &&
    finalItem.particleBinding?.type === 'separable-phrasal-verb'
  ) {
    return completedJapaneseWithMissingParts(finalItem.ja, bases.slice(1, -1))
  }

  if (/^V(?:\+M)+\+C$/.test(signature)) {
    const modifierBases = bases.slice(1, -1)
    if (finalItem.closureBinding || japaneseHasCompletion(finalItem.ja)) {
      return completedJapaneseWithMissingParts(finalItem.ja, modifierBases)
    }
    const content = joinJapanese([...modifierBases, bases.at(-1)])
    return japaneseWithPlaceholder(japanesePieces(items[0].ja).base, content)
  }

  if (/^V(?:\+C)+$/.test(signature)) {
    if (
      finalItem.closureBinding ||
      (japaneseHasCompletion(finalItem.ja) && (
        japaneseLooksComplete(bases.at(-1)) ||
        japaneseParentheticalCompletesPredicate(finalItem.ja)
      ))
    ) return finalItem.ja
    const complements = japaneseList(items.slice(1), bases.slice(1))
    if (completion && japaneseParentheticalCompletesPredicate(finalItem.ja)) {
      return joinJapanese([complements, completion])
    }
    return japaneseWithPlaceholder(japanesePieces(items[0].ja).base, complements)
  }

  if (/^V\+V(?:\+(?:O|O1|O2|C|M))*$/.test(signature)) {
    if (finalItem.closureBinding) {
      return completedJapaneseWithMissingParts(finalItem.ja, bases.slice(1, -1))
    }
    const inner = japaneseForMeaningGroup(items.slice(1))
    const outer = japanesePieces(items[0].ja).base
    if (japaneseIncludesBase(inner, cleanJapaneseBase(items[0].ja))) return inner
    if (/〜/u.test(outer)) {
      if (/(?:であり|では|である)$/u.test(inner)) return inner
      return japaneseWithPlaceholder(outer, inner)
    }
    const outerKey = normalizedEnglish(items[0].en)
    if (/\bneed$/u.test(outerKey)) {
      return inner
        .replace(/することを?$/u, 'する必要があります')
        .replace(/ることを?$/u, 'る必要があります')
    }
    if (/\b(?:are|is|was|were) expected$/u.test(outerKey)) {
      return joinJapanese([inner.replace(/ことを?$/u, 'ことが'), outer])
    }
    const particle = /(?:こと|ことを)$/u.test(inner) && !/ことを$/u.test(inner) ? 'を' : ''
    return joinJapanese([inner, particle, outer])
  }

  if (/^V\+(?:O|O1|O2)\+V(?:\+(?:O|O1|O2|C|M))*$/.test(signature)) {
    if (finalItem.closureBinding) return finalItem.ja
    const controller = bases[1]
    const inner = japaneseForMeaningGroup(items.slice(2))
    const outer = cleanJapaneseBase(items[0].ja)
    if (
      japaneseIncludesBase(inner, outer) ||
      (japaneseLooksComplete(inner) && japaneseIncludesBase(inner, controller))
    ) return inner
    return joinJapanese([controller, inner, outer])
  }

  // be / seem などの外側V＋不定詞C＋その目的語・補語。
  // 内側の目的語等を不定詞の前へ置き、その内容全体を外側Vの〜へ戻す。
  if (/^V\+C\+(?:O|O1|O2|C)(?:\+(?:O|O1|O2|C))*$/.test(signature)) {
    if (finalItem.closureBinding) return finalItem.ja
    const innerItems = items.slice(2)
    const innerBases = bases.slice(2)
    const objects = innerItems
      .map((item, index) => ({ item, base: innerBases[index] }))
      .filter(({ item }) => ['O', 'O1', 'O2'].includes(primaryRole(item)))
    const complements = innerItems
      .map((item, index) => ({ item, base: innerBases[index] }))
      .filter(({ item }) => primaryRole(item) === 'C')
    const objectJa = japaneseList(objects.map(({ item }) => item), objects.map(({ base }) => base))
    const complementJa = japaneseList(
      complements.map(({ item }) => item),
      complements.map(({ base }) => base),
    )
    const innerPredicate = bases[1]
      .replace(/(?:では|であり)$/u, '')
      .replace(/（[^）]*）/gu, '')
    const inner = joinJapanese([objectJa, complementJa, innerPredicate])
    return japaneseWithPlaceholder(japanesePieces(items[0].ja).base, inner)
  }

  if (/^V(?:\+(?:O|O1|O2))+\+LINK$/.test(signature) && normalizedEnglish(finalItem.en) === 'that') {
    const argumentsJa = japaneseList(items.slice(1, -1), bases.slice(1, -1))
    return `${argumentsJa}、that以下の内容を${bases[0]}`
  }

  if (/^V\+C\+LINK$/.test(signature) && normalizedEnglish(finalItem.en) === 'that') {
    const predicate = japaneseWithPlaceholder(japanesePieces(items[0].ja).base, bases[1])
    return `that以下の内容を示す${predicate}`
  }

  if (/^(?:O|O1|O2|S|C)\+M$/.test(signature) && /^of\b/i.test(items[1].en)) {
    const modifier = bases[1]
    const head = bases[0]
    return modifier.endsWith('の') ? `${modifier}${head}` : joinJapanese([head, modifier])
  }

  if (signature === 'V+LINK' && CONTENT_LINKS.has(normalizedEnglish(finalItem.en))) {
    const linkKey = normalizedEnglish(finalItem.en)
    const verbKey = normalizedEnglish(items[0].en)
    if (/^(?:am|are|is|was|were)$/u.test(verbKey)) {
      return completion || bases[1] || joinJapanese(bases)
    }
    if (linkKey === 'that' && /気づ/u.test(bases[0])) {
      return `that以下の内容に${bases[0]}`
    }
    if (linkKey === 'that') return `that以下の内容を${bases[0]}`
    return joinJapanese([bases[1], bases[0]])
  }

  if (finalItem.closureBinding) return finalItem.ja

  return joinJapanese(bases)
}

function specificExplanation(item) {
  const explanation = `${item?.explanation ?? item?.grammarNote ?? item?.note ?? ''}`.trim()
  const roleNote = `${item?.roleNote ?? ''}`.trim()
  if (!roleNote || explanation === roleNote) return explanation === roleNote ? '' : explanation
  return explanation.endsWith(roleNote)
    ? explanation.slice(0, -roleNote.length).trim()
    : explanation
}

function rolePartFor(item) {
  if (item.roleParts?.length) return item.roleParts
  return rolesOf(item).map((role) => {
    const meta = translationRoleMeta(role)
    return Object.freeze({
      role,
      en: item.en,
      code: meta.code,
      label: meta.label,
      question: meta.question,
      japaneseShape: meta.japaneseShape,
    })
  })
}

function combinedBinding(items, key) {
  return items.find((item) => item?.[key])?.[key]
}

function buildMeaningPhrase(items, index, overrides) {
  const en = spokenEnglish(items)
  const override = overrides?.[en] ?? overrides?.[normalizedEnglish(en)] ?? null
  const roleParts = Object.freeze(items.flatMap(rolePartFor))
  const roles = Object.freeze([...new Set(roleParts.map((part) => part.role))])
  const scope = override?.scope ?? items.find((item) => item.scope)?.scope ?? ''
  const ja = override?.ja ?? japaneseForMeaningGroup(items)
  const roleNote = translationRoleExplanation(roles, ja, scope)
  const specificNotes = [...new Set(items.map(specificExplanation).filter(Boolean))]
  const specificExplanationText = [override?.grammar, ...specificNotes]
    .filter(Boolean)
    .join(' ')
  const explanation = [specificExplanationText, roleNote].filter(Boolean).join(' ')
  const optionalBindings = Object.fromEntries(
    OPTIONAL_BINDINGS.flatMap((key) => {
      const binding = combinedBinding(items, key)
      return binding ? [[key, binding]] : []
    }),
  )
  const specialGrammar = Object.freeze([...new Set(
    items.flatMap((item) => item.specialGrammar ?? []),
  )])
  const allConfirmed = items.every((item) => item.status === 'confirmed')
  const allReviewed = items.every((item) => ['reviewed', 'confirmed'].includes(item.status))
  const reviewStates = [...new Set(items.map((item) => item.reviewState).filter(Boolean))]
  const displayEn = override?.displayEn ?? displayEnglish(items)

  return Object.freeze({
    ...items[0],
    ...optionalBindings,
    id: `meaning-${index}-${items.map((item) => item.id ?? item.en).join('+')}`,
    en,
    spokenEn: en,
    displayEn,
    structureEn: displayEn === en ? '' : displayEn,
    ja,
    role: roles[0] ?? 'M',
    roles,
    roleParts,
    roleHeading: translationRoleHeading(roles, scope),
    roleQuestion: roles.map((role) => translationRoleMeta(role).question).join(' → '),
    roleNote,
    scope,
    explanation,
    grammar: explanation,
    grammarNote: explanation,
    note: specificExplanationText || roleNote,
    label: override?.label ?? '意味・発音のまとまり',
    pattern: override?.pattern ?? roles.map((role) => translationRoleMeta(role).code).join('＋'),
    meaningBoundaryAfter: override?.boundaryAfter ?? '',
    source: 'meaning-phrase',
    sourceItems: Object.freeze(items),
    specialGrammar,
    reviewState: reviewStates.length === 1 ? reviewStates[0] : (allReviewed ? 'manual-reviewed' : 'review-needed'),
    status: allConfirmed ? 'confirmed' : allReviewed ? 'reviewed' : 'review-needed',
  })
}

function isShortInternalModifier(item) {
  if (!item) return false
  if (primaryRole(item) !== 'M') return false
  const key = normalizedEnglish(item.en)
  return englishWords(item.en).length <= 2 &&
    !CLAUSE_STARTING_MODIFIERS.has(key) &&
    !/^(?:at|by|for|from|in|into|of|on|to|under|with|without)\b/.test(key)
}

function isPredicateFocusModifier(item) {
  if (!item) return false
  return primaryRole(item) === 'M' &&
    /^(?:also|always|even|fully|merely|never|not always|not merely|not simply|often|only|simply)$/u
      .test(normalizedEnglish(item.en))
}

function collectMeaningGroups(items, wordLimit, separations = []) {
  const separationKeys = new Set(separations.map((value) => normalizedEnglish(value)))
  const mustSeparate = (left, right) =>
    separationKeys.has(normalizedEnglish(`${left.en} / ${right.en}`)) ||
    separationKeys.has(normalizedEnglish(`${left.en} ${right.en}`))
  const groups = []
  for (let index = 0; index < items.length;) {
    const current = items[index]
    const role = primaryRole(current)
    const currentKey = normalizedEnglish(current.en)

    if (
      role === 'M' &&
      currentKey === 'how' &&
      primaryRole(items[index + 1]) === 'C' &&
      primaryRole(items[index + 2]) === 'S' &&
      primaryRole(items[index + 3]) === 'V' &&
      englishWords(spokenEnglish(items.slice(index, index + 4))).length <= wordLimit
    ) {
      groups.push(items.slice(index, index + 4))
      index += 4
      continue
    }

    if (role === 'LINK') {
      const next = items[index + 1]
      if (
        currentKey === 'nor' &&
        primaryRole(next) === 'C' &&
        englishWords(spokenEnglish([current, next])).length <= wordLimit
      ) {
        groups.push([current, next])
        index += 2
        continue
      }
      if (
        next &&
        primaryRole(next) === 'LINK' &&
        MEANINGFUL_LINK_PAIRS.has(normalizedEnglish(`${current.en} ${next.en}`)) &&
        englishWords(`${current.en} ${next.en}`).length <= 3
      ) {
        groups.push([current, next])
        index += 2
      } else {
        groups.push([current])
        index++
      }
      continue
    }

    if (role === 'S') {
      let verbIndex = index + 1
      while (isShortInternalModifier(items[verbIndex])) verbIndex++
      const verb = items[verbIndex]
      const verbKey = normalizedEnglish(verb?.en)
      const nextRole = primaryRole(items[verbIndex + 1])
      const nextVerbItem = items[verbIndex + 1]
      const nextVerbBinding = nextVerbItem?.infinitiveBinding ?? nextVerbItem?.ingBinding
      const hasPredicateComplement = nextRole === 'V' && (
        (nextVerbBinding && `${nextVerbBinding.type ?? ''}` !== 'noun-modifier') ||
        /\bhelp(?:ed|s)?$/u.test(verbKey)
      )
      const incompleteAuxiliary = /^(?:am|are|is|was|were|be|been|being|can|could|do|does|did|had|has|have|may|might|must|shall|should|will|would)$/u.test(verbKey)
      const incompletePredicate = incompleteAuxiliary || /〜/u.test(`${verb?.ja ?? ''}`)
      const hasImmediateArgument = ARGUMENT_ROLES.has(nextRole) ||
        hasPredicateComplement ||
        (nextRole === 'LINK' && incompletePredicate)
      const candidate = items.slice(index, verbIndex + 1)
      if (
        verb &&
        primaryRole(verb) === 'V' &&
        !incompletePredicate &&
        !hasImmediateArgument &&
        englishWords(spokenEnglish(candidate)).length <= Math.min(wordLimit, 6)
      ) {
        groups.push(candidate)
        index = verbIndex + 1
      } else {
        groups.push([current])
        index++
      }
      continue
    }

    if (role === 'V') {
      const focusModifier = items[index + 1]
      const focusedVerb = items[index + 2]
      const auxiliaryWithFocus =
        /^(?:am|are|be|can|cannot|could|had|has|have|is|may|might|must|shall|should|was|were|will|would)$/u
          .test(currentKey) &&
        isPredicateFocusModifier(focusModifier) &&
        primaryRole(focusedVerb) === 'V'
      if (auxiliaryWithFocus) {
        const candidate = [current]
        let cursor = index + 1
        while (
          isPredicateFocusModifier(items[cursor]) &&
          primaryRole(items[cursor + 1]) === 'V' &&
          englishWords(spokenEnglish([...candidate, items[cursor], items[cursor + 1]])).length <= wordLimit
        ) {
          candidate.push(items[cursor], items[cursor + 1])
          cursor += 2
        }
        while (
          ARGUMENT_ROLES.has(primaryRole(items[cursor])) &&
          !isRelativeBoundary(items[cursor]) &&
          englishWords(spokenEnglish([...candidate, items[cursor]])).length <= wordLimit
        ) {
          candidate.push(items[cursor])
          cursor++
        }
        groups.push(candidate)
        index = cursor
        continue
      }

      const controlledSubject = items[index + 1]
      const controlledVerb = items[index + 2]
      const controlledBinding = controlledVerb?.infinitiveBinding
      const bareObjectControlGovernor = /\b(?:help|helps|helped|make|makes|made|making)$/u
        .test(currentKey)
      if (
        ['O', 'O1', 'O2'].includes(primaryRole(controlledSubject)) &&
        primaryRole(controlledVerb) === 'V' &&
        (controlledBinding?.type === 'object-to-infinitive' || bareObjectControlGovernor)
      ) {
        const candidate = [current, controlledSubject, controlledVerb]
        let cursor = index + 3
        while (cursor < items.length) {
          const next = items[cursor]
          const nextRole = primaryRole(next)
          const key = normalizedEnglish(next.en)
          const includeArgument = ARGUMENT_ROLES.has(nextRole)
          const includeModifier = nextRole === 'M' &&
            !CLAUSE_STARTING_MODIFIERS.has(key) &&
            !/^(?:after|before|instead|to|while|without)$/u.test(key)
          if (!includeArgument && !includeModifier) break
          if (isRelativeBoundary(next)) break
          if (englishWords(spokenEnglish([...candidate, next])).length > wordLimit) break
          candidate.push(next)
          cursor++
        }
        groups.push(candidate)
        index = cursor
        continue
      }

      if (
        currentKey === 'prevent' &&
        ['O', 'O1', 'O2'].includes(primaryRole(items[index + 1]))
      ) {
        const candidate = [current]
        let cursor = index + 1
        while (cursor < items.length) {
          const next = items[cursor]
          const nextRole = primaryRole(next)
          if (!['O', 'O1', 'O2', 'M', 'C'].includes(nextRole)) break
          if (englishWords(spokenEnglish([...candidate, next])).length > wordLimit) break
          candidate.push(next)
          cursor++
        }
        groups.push(candidate)
        index = cursor
        continue
      }

      if (
        currentKey === 'would' &&
        isShortInternalModifier(items[index + 1]) &&
        primaryRole(items[index + 2]) === 'V' &&
        primaryRole(items[index + 3]) === 'C' &&
        englishWords(spokenEnglish(items.slice(index, index + 4))).length <= wordLimit
      ) {
        groups.push(items.slice(index, index + 4))
        index += 4
        continue
      }

      if (
        /^(?:am|are|is|was|were)$/u.test(currentKey) &&
        normalizedEnglish(items[index + 1]?.en) === 'neither' &&
        primaryRole(items[index + 2]) === 'C' &&
        englishWords(spokenEnglish(items.slice(index, index + 3))).length <= wordLimit
      ) {
        groups.push(items.slice(index, index + 3))
        index += 3
        continue
      }

      const complementVerb = items[index + 1]
      const complementBinding = complementVerb?.infinitiveBinding ?? complementVerb?.ingBinding
      const complementType = `${complementBinding?.type ?? ''}`
      const predicateComplement =
        primaryRole(complementVerb) === 'V' &&
        (
          (complementBinding && complementType !== 'noun-modifier') ||
          /\bhelp(?:ed|s)?$/u.test(normalizedEnglish(current.en))
        )
      if (predicateComplement) {
        const candidate = [current, complementVerb]
        let cursor = index + 2
        while (cursor < items.length) {
          const next = items[cursor]
          const nextRole = primaryRole(next)
          const includeArgument = ARGUMENT_ROLES.has(nextRole)
          const includeClosingModifier = nextRole === 'M' && Boolean(next.closureBinding)
          if (!includeArgument && !includeClosingModifier) break
          if (isRelativeBoundary(next)) break
          if (englishWords(spokenEnglish([...candidate, next])).length > wordLimit) break
          candidate.push(next)
          cursor++
        }
        groups.push(candidate)
        index = cursor
        continue
      }

      let modifierCursor = index + 1
      const predicateModifiers = []
      while (isShortInternalModifier(items[modifierCursor])) {
        predicateModifiers.push(items[modifierCursor])
        modifierCursor++
      }
      const predicateComplementItem = items[modifierCursor]
      if (
        predicateModifiers.length &&
        primaryRole(predicateComplementItem) === 'C' &&
        englishWords(spokenEnglish([current, ...predicateModifiers, predicateComplementItem])).length <= wordLimit
      ) {
        groups.push([current, ...predicateModifiers, predicateComplementItem])
        index = modifierCursor + 1
        continue
      }

      const candidate = [current]
      let cursor = index + 1
      while (cursor < items.length) {
        const next = items[cursor]
        const nextRole = primaryRole(next)
        const contentLink = nextRole === 'LINK' && CONTENT_LINKS.has(normalizedEnglish(next.en))
        const preventFromConstruction =
          /\bprevent$/i.test(normalizedEnglish(current.en)) &&
          ['O', 'O1', 'O2'].includes(nextRole) &&
          /^from\b/i.test(items[cursor + 1]?.en ?? '')
        if (preventFromConstruction) break
        if (!ARGUMENT_ROLES.has(nextRole) && !contentLink) break
        if (mustSeparate(candidate.at(-1), next)) break
        if (isRelativeBoundary(next)) break
        if (
          contentLink &&
          candidate.length > 1 &&
          !candidate.slice(1).some((item) => primaryRole(item) === 'C') &&
          !candidate.slice(1).every((item) => cleanJapaneseBase(item.ja).endsWith('に'))
        ) break
        if (englishWords(spokenEnglish([...candidate, next])).length > wordLimit) break
        candidate.push(next)
        cursor++
        if (contentLink) break
      }
      const particle = items[cursor]
      if (
        particle?.particleBinding?.type === 'separable-phrasal-verb' &&
        candidate.some((item) => ['O', 'O1', 'O2'].includes(primaryRole(item))) &&
        englishWords(spokenEnglish([...candidate, particle])).length <= wordLimit
      ) {
        candidate.push(particle)
        cursor++
      }
      groups.push(candidate)
      index = cursor
      continue
    }

    const next = items[index + 1]
    const afterNext = items[index + 2]
    if (
      ['O', 'O1', 'O2'].includes(role) &&
      next &&
      primaryRole(next) === 'M' &&
      /^from\b/i.test(next.en) &&
      afterNext &&
      ['O', 'O1', 'O2'].includes(primaryRole(afterNext)) &&
      englishWords(`${current.en} ${next.en} ${afterNext.en}`).length <= wordLimit
    ) {
      groups.push([current, next, afterNext])
      index += 3
      continue
    }
    if (
      next &&
      ['O', 'O1', 'O2', 'S', 'C'].includes(role) &&
      primaryRole(next) === 'M' &&
      /^of\b/i.test(next.en) &&
      englishWords(`${current.en} ${next.en}`).length <= wordLimit
    ) {
      groups.push([current, next])
      index += 2
      continue
    }

    groups.push([current])
    index++
  }
  return groups
}

function collectExplicitMeaningGroups(items, definitions) {
  const groups = []
  let cursor = 0
  for (const definition of definitions) {
    const expected = normalizedEnglish(definition.en)
    const group = []
    let actual = ''
    while (cursor < items.length && actual !== expected) {
      group.push(items[cursor])
      cursor++
      actual = normalizedEnglish(spokenEnglish(group))
      if (!expected.startsWith(actual)) break
    }
    if (!group.length || actual !== expected) {
      throw new Error(`意味フレーズ「${definition.en}」を原文の連続部分として復元できません。`)
    }
    groups.push({ group, definition })
  }
  if (cursor !== items.length) {
    throw new Error(`意味フレーズ定義の末尾に未使用の原文「${spokenEnglish(items.slice(cursor))}」があります。`)
  }
  return groups
}

function expandedSplitItem(source, definition, index) {
  const role = definition.role ?? primaryRole(source)
  const meta = translationRoleMeta(role)
  const roles = Object.freeze([role])
  const roleParts = Object.freeze([Object.freeze({
    role,
    en: definition.en,
    code: meta.code,
    label: meta.label,
    question: meta.question,
    japaneseShape: meta.japaneseShape,
  })])
  const scope = definition.scope ?? source.scope ?? ''
  const roleNote = translationRoleExplanation(roles, definition.ja, scope)
  const explanation = [definition.grammar, roleNote].filter(Boolean).join(' ')
  return Object.freeze({
    ...source,
    id: `${source.id ?? source.en}-meaning-split-${index}`,
    en: definition.en,
    spokenEn: definition.en,
    displayEn: definition.displayEn ?? definition.en,
    structureEn: definition.displayEn && definition.displayEn !== definition.en
      ? definition.displayEn
      : '',
    ja: definition.ja,
    role,
    roles,
    roleParts,
    roleHeading: translationRoleHeading(roles, scope),
    roleNote,
    scope,
    grammar: explanation,
    grammarNote: explanation,
    explanation,
    source: 'meaning-split',
  })
}

function expandMeaningSplits(items, overrides) {
  return items.flatMap((source) => {
    const decision = overrides?.[source.en] ?? overrides?.[normalizedEnglish(source.en)]
    if (!Array.isArray(decision?.split) || !decision.split.length) return [source]
    const splitEnglish = decision.split.map((item) => item.en).join(' ')
    if (normalizedEnglish(splitEnglish) !== normalizedEnglish(source.spokenEn ?? source.en)) {
      throw new Error(`意味フレーズ分割「${splitEnglish}」が原文「${source.en}」と一致しません。`)
    }
    return decision.split.map((definition, index) =>
      expandedSplitItem(source, definition, index))
  })
}

export function buildMeaningPhraseSequence(items, {
  wordLimit = 8,
  overrides = null,
  explicitGroups = null,
} = {}) {
  if (!Array.isArray(items) || !items.length) return Object.freeze([])
  const expandedItems = expandMeaningSplits(items, overrides)
  const reviewedGroups = explicitGroups ?? overrides?.groups
  if (Array.isArray(reviewedGroups) && reviewedGroups.length) {
    const groups = collectExplicitMeaningGroups(expandedItems, reviewedGroups)
    return Object.freeze(groups.map(({ group, definition }, index) =>
      buildMeaningPhrase(group, index, {
        [spokenEnglish(group)]: definition,
      })))
  }
  const groups = collectMeaningGroups(expandedItems, wordLimit, overrides?.separate ?? [])
  return Object.freeze(groups.map((group, index) =>
    buildMeaningPhrase(group, index, overrides)))
}

export function meaningPhraseWordCount(value = '') {
  return englishWords(value).length
}
