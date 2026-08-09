import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

const projectUrl = new URL('../', import.meta.url)
const read = (path) => readFileSync(new URL(path, projectUrl), 'utf8')

test('ゲーム用の音源・再生器・生成処理を配布物へ残さない', () => {
  const retiredPaths = [
    'public/assets/bgm',
    'src/components/GameBgm.jsx',
    'src/data/game-bgm.js',
    'src/data/game-soundtrack-production.js',
    'src/lib/gameBgmPlayer.js',
    'src/lib/gameBgmRouter.js',
    'src/lib/gameBgmSequencer.js',
    'scripts/check-game-bgm.mjs',
    'scripts/render-game-soundtracks.mjs',
    'scripts/game-soundtrack-arrangement.mjs',
    'scripts/render-game-soundtrack.swift',
    'docs/game-soundtrack-rendering.md',
  ]

  for (const path of retiredPaths) {
    assert.equal(existsSync(new URL(path, projectUrl)), false, path)
  }
})

test('アプリ本体と設定からゲーム音楽の起動契約を除去する', () => {
  const app = read('src/App.jsx')
  const settingsPanel = read('src/components/GameSettings.jsx')
  const store = read('src/store/useStore.js')
  const packageJson = read('package.json')

  for (const source of [app, settingsPanel, store, packageJson]) {
    assert.doesNotMatch(source, /GameBgm|gameBgm|bgmEnabled|bgmVolume|check:bgm|render:bgm/)
  }
})
