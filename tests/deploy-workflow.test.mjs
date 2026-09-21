// main へ push した版が、そのまま GitHub Pages の公開版になる流れと、その確かめ方を守る。
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('main への push で、ビルドした版を GitHub Pages へデプロイする', () => {
  const workflow = read('.github/workflows/deploy.yml')
  assert.match(workflow, /on:\s*\n\s*push:\s*\n\s*branches: \[main\]/)
  assert.match(workflow, /run: npm run build/)
  assert.match(workflow, /upload-pages-artifact@[^\n]*\n\s*with:\s*\n\s*path: dist/)
  assert.match(workflow, /needs: build/)
  assert.match(workflow, /actions\/deploy-pages@/)
})

test('公開版の確認は、HEAD が push 済みで、そのコミットのデプロイが成功したかを見る', () => {
  const check = read('scripts/checks/deployed-matches-head.mjs')
  assert.match(check, /git rev-parse origin\/main/)
  assert.match(check, /gh run list --workflow deploy\.yml/)
  assert.match(check, /item\.headSha === head/)
  assert.match(check, /conclusion !== 'success'/)
})
