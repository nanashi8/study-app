// フロンティア語を見出し語に昇格したとき、既存エントリの der にその語が残っていると
// 語族ルール違反（二重計上）になる。check が「派生語「X」は独立エントリ」と出したら
//   node scripts/strip-der.mjs X Y Z ...
// で、指定語を全 words*.js の der 配列から一括除去する（fam は重複可なので触らない）。
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const targets = process.argv.slice(2)
if (!targets.length) {
  console.error('usage: node scripts/strip-der.mjs <word> [word...]')
  process.exit(1)
}
const dir = 'src/data'
let changed = 0
for (const file of readdirSync(dir).filter((f) => /^words.*\.js$/.test(f))) {
  const p = path.join(dir, file)
  let s = readFileSync(p, 'utf8')
  for (const w of targets) {
    const re1 = new RegExp("\\{\\s*w:\\s*'" + w + "'\\s*,\\s*m:\\s*'[^']*'\\s*\\}", 'g')
    const re2 = new RegExp('\\{\\s*"w":\\s*"' + w + '"\\s*,\\s*"m":\\s*"[^"]*"\\s*\\}', 'g')
    s = s.replace(re1, '§DEL§').replace(re2, '§DEL§')
  }
  if (s.includes('§DEL§')) {
    s = s.replace(/,\s*§DEL§/g, '').replace(/§DEL§\s*,\s*/g, '').replace(/§DEL§/g, '')
    s = s.replace(/,\s*"der":\s*\[\s*\]/g, '').replace(/"der":\s*\[\s*\]\s*,\s*/g, '')
    s = s.replace(/,\s*der:\s*\[\s*\]/g, '').replace(/der:\s*\[\s*\]\s*,\s*/g, '')
    writeFileSync(p, s)
    changed++
  }
}
console.log('der から除去:', targets.join(', '), '/ 変更ファイル', changed)
