export const LEARNING_CONTENT_PLAN_SCHEMA_VERSION = 1
export const LEARNING_CONTENT_PLAN_MAX_PRIORITY = 3

const CONTENT_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const isRecord = (value) =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value)

const cleanTimestamp = (value) =>
  Number.isFinite(value) && value >= 0 ? Math.floor(value) : null

export function learningContentPlanRef(contentId, itemId) {
  const cleanContentId = typeof contentId === 'string' ? contentId.trim().slice(0, 40) : ''
  const cleanItemId = typeof itemId === 'string' ? itemId.trim().slice(0, 220) : ''
  if (!CONTENT_ID_PATTERN.test(cleanContentId) || !cleanItemId) return null
  return `${cleanContentId}:${cleanItemId}`
}

export function parseLearningContentPlanRef(ref) {
  if (typeof ref !== 'string') return null
  const separator = ref.indexOf(':')
  if (separator <= 0 || separator >= ref.length - 1) return null
  const contentId = ref.slice(0, separator)
  const itemId = ref.slice(separator + 1)
  return learningContentPlanRef(contentId, itemId) === ref
    ? { contentId, itemId }
    : null
}

function normalizeEntry(value) {
  if (!isRecord(value)) return null
  const registered = value.registered === true
  const hidden = value.hidden === true
  if (!registered && !hidden) return null
  const priority = registered
    ? Math.max(0, Math.min(
      LEARNING_CONTENT_PLAN_MAX_PRIORITY,
      Math.floor(Number(value.priority) || 0),
    ))
    : 0
  return {
    registered,
    hidden,
    priority,
    registeredAt: registered ? cleanTimestamp(value.registeredAt) : null,
    hiddenAt: hidden ? cleanTimestamp(value.hiddenAt) : null,
    updatedAt: cleanTimestamp(value.updatedAt),
  }
}

export function createLearningContentPlan() {
  return {
    version: LEARNING_CONTENT_PLAN_SCHEMA_VERSION,
    entries: {},
  }
}

export function normalizeLearningContentPlan(value) {
  const source = isRecord(value) ? value : {}
  const entries = {}
  if (isRecord(source.entries)) {
    for (const [ref, rawEntry] of Object.entries(source.entries)) {
      if (!parseLearningContentPlanRef(ref)) continue
      const entry = normalizeEntry(rawEntry)
      if (entry) entries[ref] = entry
    }
  }
  return {
    version: LEARNING_CONTENT_PLAN_SCHEMA_VERSION,
    entries,
  }
}

export function learningContentPlanEntry(plan, contentId, itemId) {
  const ref = learningContentPlanRef(contentId, itemId)
  if (!ref) return null
  return normalizeEntry(plan?.entries?.[ref])
}

export function updateLearningContentPlan(
  plan,
  contentId,
  itemId,
  action,
  timestamp = Date.now(),
) {
  const ref = learningContentPlanRef(contentId, itemId)
  const current = normalizeLearningContentPlan(plan)
  if (!ref) return current
  const previous = current.entries[ref] ?? {
    registered: false,
    hidden: false,
    priority: 0,
    registeredAt: null,
    hiddenAt: null,
    updatedAt: null,
  }
  let next = previous

  if (action === 'register') {
    next = {
      ...previous,
      registered: true,
      priority: previous.registered ? previous.priority : 0,
      registeredAt: previous.registeredAt ?? timestamp,
      updatedAt: timestamp,
    }
  } else if (action === 'hide') {
    next = {
      ...previous,
      hidden: true,
      hiddenAt: previous.hiddenAt ?? timestamp,
      updatedAt: timestamp,
    }
  } else if (action === 'remove') {
    next = {
      ...previous,
      registered: false,
      priority: 0,
      registeredAt: null,
      updatedAt: timestamp,
    }
  } else if (action === 'restore') {
    next = {
      ...previous,
      hidden: false,
      hiddenAt: null,
      updatedAt: timestamp,
    }
  } else if (action === 'raise-priority') {
    next = {
      ...previous,
      registered: true,
      priority: Math.min(
        LEARNING_CONTENT_PLAN_MAX_PRIORITY,
        previous.priority + 1,
      ),
      registeredAt: previous.registeredAt ?? timestamp,
      updatedAt: timestamp,
    }
  } else {
    return current
  }

  const normalized = normalizeEntry(next)
  const entries = { ...current.entries }
  if (normalized) entries[ref] = normalized
  else delete entries[ref]
  return { ...current, entries }
}
