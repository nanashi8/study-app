const IRREGULAR_BASES = {
  am: 'be',
  are: 'be',
  is: 'be',
  was: 'be',
  were: 'be',
  been: 'be',
  did: 'do',
  done: 'do',
  went: 'go',
  gone: 'go',
  had: 'have',
  made: 'make',
  took: 'take',
  taken: 'take',
  came: 'come',
  saw: 'see',
  seen: 'see',
  gave: 'give',
  given: 'give',
  wrote: 'write',
  written: 'write',
  spoke: 'speak',
  spoken: 'speak',
  bought: 'buy',
  brought: 'bring',
  taught: 'teach',
  thought: 'think',
  caught: 'catch',
  found: 'find',
  knew: 'know',
  known: 'know',
  got: 'get',
  gotten: 'get',
  left: 'leave',
  felt: 'feel',
  kept: 'keep',
  held: 'hold',
  heard: 'hear',
  met: 'meet',
  paid: 'pay',
  sent: 'send',
  built: 'build',
  became: 'become',
  began: 'begin',
  begun: 'begin',
  broke: 'break',
  broken: 'break',
  chose: 'choose',
  chosen: 'choose',
  drove: 'drive',
  driven: 'drive',
  ate: 'eat',
  eaten: 'eat',
  fell: 'fall',
  fallen: 'fall',
  forgot: 'forget',
  forgotten: 'forget',
  grew: 'grow',
  grown: 'grow',
  lost: 'lose',
  ran: 'run',
  sold: 'sell',
  sat: 'sit',
  slept: 'sleep',
  stood: 'stand',
  swam: 'swim',
  swum: 'swim',
  understood: 'understand',
  wore: 'wear',
  worn: 'wear',
  won: 'win',
  children: 'child',
  people: 'person',
  men: 'man',
  women: 'woman',
  feet: 'foot',
  teeth: 'tooth',
  mice: 'mouse',
  geese: 'goose',
  better: 'good',
  best: 'good',
  worse: 'bad',
  worst: 'bad',
}

export function normalizeOcrToken(value) {
  return String(value ?? '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[‐‑‒–—―]/g, '-')
    .replace(/^[^a-z]+|[^a-z]+$/g, '')
}

export function extractEnglishTokens(text) {
  const normalized = String(text ?? '')
    .normalize('NFKC')
    .replace(/[’‘]/g, "'")
    .replace(/[‐‑‒–—―]/g, '-')
  return normalized.match(/[A-Za-z]+(?:['-][A-Za-z]+)*/g) ?? []
}

function possibleBaseForms(token) {
  const forms = []
  const add = (value) => {
    const normalized = normalizeOcrToken(value)
    if (normalized.length >= 2 && normalized !== token && !forms.includes(normalized)) {
      forms.push(normalized)
    }
  }

  add(IRREGULAR_BASES[token])

  if (token.endsWith("'s")) add(token.slice(0, -2))
  if (token.endsWith("s'")) add(token.slice(0, -1))

  if (token.length > 3 && token.endsWith('s')) add(token.slice(0, -1))
  if (token.length > 4 && token.endsWith('ies')) add(`${token.slice(0, -3)}y`)
  if (token.length > 4 && token.endsWith('ves')) {
    add(`${token.slice(0, -3)}f`)
    add(`${token.slice(0, -3)}fe`)
  }
  if (token.length > 4 && token.endsWith('es')) add(token.slice(0, -2))

  if (token.length > 4 && token.endsWith('ied')) add(`${token.slice(0, -3)}y`)
  if (token.length > 4 && token.endsWith('ed')) {
    add(token.slice(0, -1))
    const withoutEd = token.slice(0, -2)
    add(withoutEd)
    if (withoutEd.at(-1) === withoutEd.at(-2)) add(withoutEd.slice(0, -1))
  }

  if (token.length > 5 && token.endsWith('ying')) add(`${token.slice(0, -4)}ie`)
  if (token.length > 5 && token.endsWith('ing')) {
    const withoutIng = token.slice(0, -3)
    add(withoutIng)
    add(`${withoutIng}e`)
    if (withoutIng.at(-1) === withoutIng.at(-2)) add(withoutIng.slice(0, -1))
  }

  for (const suffix of ['est', 'er']) {
    if (token.length <= suffix.length + 2 || !token.endsWith(suffix)) continue
    if (token.endsWith(`i${suffix}`)) add(`${token.slice(0, -(suffix.length + 1))}y`)
    const stem = token.slice(0, -suffix.length)
    add(stem)
    add(`${stem}e`)
    if (stem.at(-1) === stem.at(-2)) add(stem.slice(0, -1))
  }

  return forms
}

function buildHeadwordIndex(words) {
  const index = new Map()
  for (const word of words) {
    const headword = normalizeOcrToken(word?.word)
    if (!headword || /[^a-z'-]/.test(headword) || index.has(headword)) continue
    index.set(headword, word)
  }
  return index
}

export function matchOcrTextToWords(text, words) {
  const index = buildHeadwordIndex(words)
  const tokens = extractEnglishTokens(text)
  const matches = new Map()
  const unmatched = new Map()
  let matchedTokenCount = 0

  for (const surface of tokens) {
    const normalized = normalizeOcrToken(surface)
    if (normalized.length < 2) continue

    let word = index.get(normalized)
    if (!word) {
      for (const base of possibleBaseForms(normalized)) {
        word = index.get(base)
        if (word) break
      }
    }

    if (!word) {
      const current = unmatched.get(normalized) ?? {
        token: normalized,
        q: surface,
        occurrences: 0,
        observed: [],
      }
      current.occurrences += 1
      if (!current.observed.includes(surface)) current.observed.push(surface)
      unmatched.set(normalized, current)
      continue
    }

    matchedTokenCount += 1
    const current = matches.get(word.id) ?? {
      id: word.id,
      headword: word.word,
      meaning: word.meaning,
      level: word.level,
      occurrences: 0,
      observed: [],
    }
    current.occurrences += 1
    if (!current.observed.includes(surface)) current.observed.push(surface)
    matches.set(word.id, current)
  }

  return {
    candidates: [...matches.values()],
    tokenCount: tokens.filter((token) => normalizeOcrToken(token).length >= 2).length,
    matchedTokenCount,
    unmatchedTokenCount: [...unmatched.values()].reduce((sum, item) => sum + item.occurrences, 0),
    unmatched: [...unmatched.values()],
  }
}
