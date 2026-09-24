// 古典単語の「まとめて暗記する仲間」を、見出し語の id と結びつける。
// 仲間の定義（src/data/koten-word-groups.js）は見出し語で書いてあるので、ここで語の本体へ引き当てる。
import { KOTEN_WORDS } from '../data/koten.js'
import {
  KOTEN_WORD_GROUP_TYPES,
  KOTEN_WORD_GROUPS,
} from '../data/koten-word-groups.js'

const WORDS_BY_HEAD = new Map()
for (const word of KOTEN_WORDS) {
  const list = WORDS_BY_HEAD.get(word.word) ?? []
  list.push(word)
  WORDS_BY_HEAD.set(word.word, list)
}

/** 仲間の書き方「見出し語」「見出し語/品詞」から語の本体を引く。見つからない・決まらないときは null。 */
export function resolveKotenMember(ref) {
  const [head, pos] = String(ref).split('/')
  const list = WORDS_BY_HEAD.get(head) ?? []
  const matches = pos ? list.filter((word) => word.pos === pos) : list
  return matches.length === 1 ? matches[0] : null
}

export const KOTEN_GROUP_TYPE_BY_ID = Object.fromEntries(
  KOTEN_WORD_GROUP_TYPES.map((type) => [type.id, type]),
)

/** 仲間ごとに、語の本体とその仲間での位置づけを並べたもの。 */
export const KOTEN_GROUPS = KOTEN_WORD_GROUPS.map((group) => ({
  ...group,
  typeInfo: KOTEN_GROUP_TYPE_BY_ID[group.type],
  entries: group.members
    .map(([ref, role]) => ({ word: resolveKotenMember(ref), role, ref }))
    .filter((entry) => entry.word),
}))

export const KOTEN_GROUP_BY_ID = Object.fromEntries(KOTEN_GROUPS.map((group) => [group.id, group]))

const GROUPS_BY_WORD = new Map()
for (const group of KOTEN_GROUPS) {
  for (const entry of group.entries) {
    const list = GROUPS_BY_WORD.get(entry.word.id) ?? []
    list.push({ group, role: entry.role })
    GROUPS_BY_WORD.set(entry.word.id, list)
  }
}

/** その語が入っている仲間と、仲間の中での位置づけ。 */
export const kotenGroupsForWord = (id) => GROUPS_BY_WORD.get(id) ?? []

/** 種類ごとに仲間を並べた目次。 */
export const KOTEN_GROUP_TOC = KOTEN_WORD_GROUP_TYPES.map((type) => ({
  type,
  groups: KOTEN_GROUPS.filter((group) => group.type === type.id),
})).filter((entry) => entry.groups.length > 0)
