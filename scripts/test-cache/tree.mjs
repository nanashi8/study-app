// 作業ツリーの中身の指紋。読んだものが分からないテスト（git などのコマンドや vite の build を使う）の合格を、
// 中身が同じ間だけ使い回すために使う（全監査 → commit の前の確認 → push の前の確認で、同じテストを流し直さない）。
//   tree : git が追うファイルと、無視していない新しいファイルの中身（一時の index に git add -A して write-tree）。
//          commit してもしなくても、中身が同じなら同じ値になる。
//   git  : HEAD と index。git の履歴や git ls-files を読むテストは、これも同じときだけ使い回す。
import { createHash } from 'node:crypto'
import { spawnSync as defaultSpawnSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdtempSync, realpathSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

// 指紋に入れないファイル。全教材監査台帳は全監査がテストの後に書き直す（auditedAt も変わる）ので、入れると全監査で通った
// テストを commit の前の確認で流し直す（2026-11-05、本番ビルドのテストが43秒）。台帳は tests/content-audit-ledger.test.mjs
// （読んだファイルで控える）と push の前の確認（check-requests.mjs の ledgerProblemsAt）が別に確かめる。
export const OUTSIDE_FINGERPRINT = Object.freeze(['docs/audits/content-audit-ledger.json'])

/**
 * @param {string} root リポジトリの一番上
 * @param {typeof defaultSpawnSync} [spawnSync] テストの記録に入れない spawnSync（preload.mjs が包む前のもの）を渡す
 * @returns {{ tree: string, git: string } | null} git のリポジトリでないときは null（使い回さない）
 */
export function treeState(root, spawnSync = defaultSpawnSync) {
  // git のフックの中では、git がリポジトリの場所や index を環境変数で渡す。ここでは root のリポジトリを自分で見る。
  const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('GIT_')))
  const git = (args, extra = {}) => spawnSync('git', args, { cwd: root, env: { ...env, ...extra }, encoding: 'utf8', maxBuffer: 1 << 30, timeout: 60_000 })
  const top = git(['rev-parse', '--show-toplevel'])
  if (top.status !== 0) return null
  try {
    if (realpathSync(top.stdout.trim()) !== realpathSync(root)) return null
  } catch {
    return null
  }
  const dir = mkdtempSync(join(tmpdir(), 'study-app-tree-'))
  try {
    // 本物の index は書き換えない。写しに git add -A する（写しの記録で、変わっていないファイルは読み直さない）。
    const index = join(dir, 'index')
    const real = resolve(root, git(['rev-parse', '--git-path', 'index']).stdout.trim())
    if (existsSync(real)) copyFileSync(real, index)
    if (git(['add', '-A'], { GIT_INDEX_FILE: index }).status !== 0) return null
    if (git(['rm', '-q', '--cached', '--ignore-unmatch', '--', ...OUTSIDE_FINGERPRINT], { GIT_INDEX_FILE: index }).status !== 0) return null
    const tree = git(['write-tree'], { GIT_INDEX_FILE: index })
    if (tree.status !== 0) return null
    const head = git(['rev-parse', '--verify', '-q', 'HEAD']).stdout.trim() || 'no-commit'
    const entries = (git(['ls-files', '-s', '-z']).stdout ?? '').split('\0').filter((entry) => !OUTSIDE_FINGERPRINT.includes(entry.split('\t')[1]))
    const staged = createHash('sha256').update(entries.join('\0')).digest('hex').slice(0, 32)
    return { tree: tree.stdout.trim(), git: `${head}:${staged}` }
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

// 中身だけで結果が決まるもの（ビルド・処理の一覧やメモリの測り方）。これ以外のコマンド（git・sh・tar・node など）を使うテストは、
// HEAD と index も同じときだけ使い回す。
const CONTENT_ONLY = /^(vite build|glob |command (which|ps|notifyutil|footprint)$)/
export const needsGitState = (reasons) => reasons.some((reason) => !CONTENT_ONLY.test(reason))
