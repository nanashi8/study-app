// 漢語の「まとめて暗記する仲間」と漢文法の体系表を、項目の id と結びつける。
// 仲間（src/data/kanbun-vocab-groups.js）と体系表（src/data/kanbun-grammar-systems.js）は
// 見出し（title）で書いてあるので、ここで項目の本体へ引き当てる。項目の id は並び順から作るため、
// 台帳を id で書くと、項目を足したときに指す先がずれる。
import { KANBUN_VOCAB } from '../data/kanbun-vocab.js'
import { KANBUN_GRAMMAR } from '../data/kanbun-grammar.js'
import {
  KANBUN_VOCAB_GROUP_TYPES,
  KANBUN_VOCAB_GROUPS,
} from '../data/kanbun-vocab-groups.js'
import { KANBUN_GRAMMAR_SYSTEMS } from '../data/kanbun-grammar-systems.js'

const VOCAB_BY_TITLE = new Map(KANBUN_VOCAB.map((item) => [item.title, item]))
const GRAMMAR_BY_TITLE = new Map(KANBUN_GRAMMAR.map((item) => [item.title, item]))

export const KANBUN_GROUP_TYPE_BY_ID = Object.fromEntries(
  KANBUN_VOCAB_GROUP_TYPES.map((type) => [type.id, type]),
)

/** 仲間ごとに、漢語の本体を並べたもの。 */
export const KANBUN_GROUPS = KANBUN_VOCAB_GROUPS.map((group) => ({
  ...group,
  typeInfo: KANBUN_GROUP_TYPE_BY_ID[group.type],
  items: group.members.map((title) => VOCAB_BY_TITLE.get(title)).filter(Boolean),
}))

export const KANBUN_GROUP_BY_ID = Object.fromEntries(KANBUN_GROUPS.map((group) => [group.id, group]))

const GROUPS_BY_ITEM = new Map()
for (const group of KANBUN_GROUPS) {
  for (const item of group.items) {
    const list = GROUPS_BY_ITEM.get(item.id) ?? []
    list.push(group)
    GROUPS_BY_ITEM.set(item.id, list)
  }
}

/** その漢語が入っている仲間。 */
export const kanbunGroupsForItem = (id) => GROUPS_BY_ITEM.get(id) ?? []

/** 種類ごとに仲間を並べた目次。 */
export const KANBUN_GROUP_TOC = KANBUN_VOCAB_GROUP_TYPES.map((type) => ({
  type,
  groups: KANBUN_GROUPS.filter((group) => group.type === type.id),
})).filter((entry) => entry.groups.length > 0)

/** 体系表。行ごとに、題名から引いた漢文法の項目の id（ids）を持たせる。 */
export const KANBUN_SYSTEMS = KANBUN_GRAMMAR_SYSTEMS.map((system) => ({
  ...system,
  rows: system.rows.map((entry) => (entry.group ? entry : {
    ...entry,
    ids: entry.items.map((title) => GRAMMAR_BY_TITLE.get(title)?.id).filter(Boolean),
  })),
}))

export const KANBUN_SYSTEM_BY_ID = Object.fromEntries(KANBUN_SYSTEMS.map((system) => [system.id, system]))

/** 体系表に出てくる漢文法の項目の id（表の順・重なりなし）。 */
export function kanbunSystemItemIds(system) {
  const ids = []
  for (const entry of system?.rows ?? []) {
    for (const id of entry.ids ?? []) if (!ids.includes(id)) ids.push(id)
  }
  return ids
}

/** その漢文法の項目が出てくる体系表。 */
export const kanbunSystemsForItem = (id) =>
  KANBUN_SYSTEMS.filter((system) => system.rows.some((entry) => entry.ids?.includes(id)))
