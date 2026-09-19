// 文法の参考書の「級をまたいだ単元」（grammar-strands.js の系統）1つ分。
//
//   id       : 系統の ID（grammar-strands.js と同じ）
//   overview : 全体の見取り図（段落）。下の級から上の級へ、何がどう増えるか
//   steps    : 段ごとの要点 [級, 単元, この段で増えること, 英文, 和訳, gloss?]。
//              系統の topics と同じ順・同じ組でそろえる（check-data が確かめる）
//   links    : 段どうしのつながり・取り違えやすい組（文）
//   related  : 系統の段には入っていないが、一緒に読むとよい単元 [級, 単元]

export function strandReference({ id, overview, steps, links = [], related = [] }) {
  return Object.freeze({
    id,
    overview: Object.freeze(overview),
    steps: Object.freeze(steps.map(([level, topic, point, en, ja, gloss = null]) => Object.freeze({
      level,
      topic,
      point,
      example: Object.freeze({ en, ja, gloss }),
    }))),
    links: Object.freeze(links),
    related: Object.freeze(related.map(([level, topic]) => Object.freeze({ level, topic }))),
  })
}
