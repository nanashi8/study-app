import { readFile, readdir } from 'node:fs/promises'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const sourceRoot = resolve(projectRoot, 'src')

// 旧保存データの往復だけにプロパティ名を残す。
const compatibilityFiles = new Set([
  'src/lib/legacyProgress.js',
  'src/lib/progressCode.js',
  'src/lib/cloudSync.js',
  'src/store/useStore.js',
])

// 全保存項目を分類する台帳では、この旧フィールド名の列挙だけを許す。
// ファイル全体を互換扱いにしないことで、説明文や処理へのXP再混入は検出する。
const compatibilityOnlyLines = new Map([
  ['src/lib/progressReset.js', [/^\s*'battleXpSpent',\s*$/u]],
])

const retiredRuntimePattern = /\bXP\b|\bxp\b|battleXp|xpGained|xpAtStart|totalXp|heroProgress|xpToNext|BATTLE_XP|itemXpBonus|xpBonus|exchangeXp|放課後XP|経験値|冒険者LV|累計XP/u

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(entries.map(async (entry) => {
    const path = resolve(directory, entry.name)
    if (entry.isDirectory()) return sourceFiles(path)
    return /\.(?:js|jsx|mjs)$/.test(entry.name) ? [path] : []
  }))
  return nested.flat()
}

function section(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker)
  if (start < 0) return ''
  const end = endMarker ? source.indexOf(endMarker, start + startMarker.length) : -1
  return source.slice(start, end < 0 ? source.length : end)
}

export async function auditXpRetirement() {
  const failures = []
  const compatibilityReferences = []
  const files = await sourceFiles(sourceRoot)

  for (const file of files) {
    const projectPath = relative(projectRoot, file)
    const source = await readFile(file, 'utf8')
    source.split('\n').forEach((line, index) => {
      if (!retiredRuntimePattern.test(line)) return
      const compatibilityLine = compatibilityOnlyLines
        .get(projectPath)
        ?.some((pattern) => pattern.test(line))
      if (compatibilityFiles.has(projectPath) || compatibilityLine) {
        compatibilityReferences.push(`${projectPath}:${index + 1}`)
      } else {
        failures.push(`${projectPath}:${index + 1} にXP関連の実行参照が残っています。`)
      }
    })
  }

  const [store, progress, cloud, legacy, afterSchool] = await Promise.all([
    readFile(resolve(projectRoot, 'src/store/useStore.js'), 'utf8'),
    readFile(resolve(projectRoot, 'src/lib/progressCode.js'), 'utf8'),
    readFile(resolve(projectRoot, 'src/lib/cloudSync.js'), 'utf8'),
    readFile(resolve(projectRoot, 'src/lib/legacyProgress.js'), 'utf8'),
    readFile(resolve(projectRoot, 'src/lib/afterSchoolBonds.js'), 'utf8'),
  ])

  for (const forbidden of [
    'exchangeXpForBattleStars',
    'battleXpExchange',
    'xpGained',
    'itemXpBonus',
    'xpAtStart',
    'heroProgress',
  ]) {
    if (store.includes(forbidden)) failures.push(`storeに廃止済み処理 ${forbidden} が残っています。`)
  }
  if (/\.xp\s*(?:\+\+|--|[+\-*/]?=)/u.test(store)) {
    failures.push('storeが旧stats.xpを更新しています。')
  }

  const reviewSection = section(store, 'function applyReview', 'function awardWriting')
  const writingSection = section(store, 'function awardWriting', 'export function migratePersistedState')
  const rewardSection = section(afterSchool, 'export function resolveAfterSchoolReward')
  for (const [name, source] of [
    ['回答処理', reviewSection],
    ['英作文完了処理', writingSection],
    ['放課後報酬', rewardSection],
  ]) {
    if (!source) failures.push(`${name}の監査範囲を取得できません。`)
    else if (retiredRuntimePattern.test(source)) failures.push(`${name}がXP関連値を読んでいます。`)
  }

  const summarySection = section(progress, 'export function summarizePayload')
  if (retiredRuntimePattern.test(summarySection)) {
    failures.push('進捗復元プレビューがXP関連値を要約しています。')
  }

  for (const field of ["'stats'", "'battleXpSpent'"]) {
    if (!progress.includes(field)) failures.push(`旧進捗コード互換項目 ${field} がありません。`)
  }
  if (!progress.includes("from './legacyProgress.js'")) {
    failures.push('進捗コードが旧XP値の専用正規化を使っていません。')
  }
  if (!cloud.includes("from './legacyProgress.js'")) {
    failures.push('クラウド復元が旧XP値の専用正規化を使っていません。')
  }
  if (!store.includes("from '../lib/legacyProgress.js'")) {
    failures.push('端末保存が旧XP値の専用正規化を使っていません。')
  }
  for (const helper of ['normalizeLegacyXp', 'normalizeLegacyStats', 'isValidLegacyXp']) {
    if (!legacy.includes(`function ${helper}`)) failures.push(`互換ヘルパー ${helper} がありません。`)
  }

  return {
    filesScanned: files.length,
    compatibilityReferences,
    failures,
  }
}

async function main() {
  const result = await auditXpRetirement()
  console.log('XP関連システム廃止監査')
  console.log(`  実行ソース      ${result.filesScanned}ファイル`)
  console.log(`  互換専用参照    ${result.compatibilityReferences.length}件`)
  console.log(`  機能利用違反      ${result.failures.length}件`)
  if (result.failures.length) {
    result.failures.forEach((failure) => console.error(`❌ ${failure}`))
    process.exitCode = 1
  } else {
    console.log('✅ XPは旧保存互換だけに隔離され、学習・表示・報酬では使用されていません。')
  }
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : ''
if (import.meta.url === invokedPath) await main()
