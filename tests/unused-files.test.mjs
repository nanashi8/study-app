import assert from 'node:assert/strict'
import test from 'node:test'
import { REMOVED, surveyUnusedFiles } from '../scripts/checks/unused-files.mjs'

// requests/2026-10-20-remove-unused-files.json：追跡ファイルを全件、どこから使われているかで分け、
// どこからも使われていないファイルを残さない。消したファイルは戻さず、どこからも名指ししない。
test('追跡ファイルの全件がどこかから使われている', async () => {
  const { files, reasons, unused } = await surveyUnusedFiles()
  assert.deepEqual(unused, [])
  assert.equal(reasons.size, files.length)
  // public の画像はアプリのコードが組み立てるパスで数える。組み立てを読めなくなったら全部が使われていないに落ちる。
  const builtAssets = [...reasons.values()].filter((reason) => reason === 'アプリが組み立てる画像のパス').length
  assert.ok(builtAssets >= 800, `アプリが組み立てる画像 ${builtAssets}件`)
})

test('消したファイルは戻らず、どこからも名指しされない', async () => {
  const { removedBack, removedNamed } = await surveyUnusedFiles()
  assert.equal(Object.keys(REMOVED).length, 15)
  assert.deepEqual(removedBack, [])
  assert.deepEqual(removedNamed, [])
})
