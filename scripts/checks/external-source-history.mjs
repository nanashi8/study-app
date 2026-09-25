#!/usr/bin/env node
// 他人の資料への言及を、公開している履歴から消した（2026-09-25）。消した行が、履歴（全コミットの全ファイルの全版・
// 全コミットの文）と今の版に戻っていないかを確かめる。消した行そのものは書かず、行の SHA-256（先頭16桁）だけを持つ。
//   node scripts/checks/external-source-history.mjs --files     … 全コミットの全ファイルの全版（テキスト）
//   node scripts/checks/external-source-history.mjs --messages  … 全コミットの文
//   引数なし … 両方
import { createHash } from 'node:crypto'
import { execFileSync, spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const git = (...args) => execFileSync('git', ['-C', ROOT, ...args], { encoding: 'utf8', maxBuffer: 2 ** 30 })
export const lineHash = (line) => createHash('sha256').update(String(line).trim()).digest('hex').slice(0, 16)

// 消した行（ファイル）の値。
export const REMOVED_FILE_LINES = new Set([
  'b27c2df8b6bc7eae',
  'bb9b31c2cb872554',
  '039f8949699d7ed7',
  '0427580910c3b36a',
  '04c19d32c25c039d',
  '072b2a26cc00bab1',
  '085a44167d29235b',
  '088ad780a66c2aa7',
  '0ac7ff96b6fa1221',
  '0b79c75de989f027',
  '0c40b49f2bfc7460',
  '0d01c8ee1b0e701d',
  '0f1ef2168c5e52d0',
  '13b88301fd14a198',
  '14a574227a69d73e',
  '158c073005358403',
  '16f0b5fa76a8e29e',
  '18f248fff3e6236a',
  '1ae3bd4e43d6382e',
  '1bedf0823fc3a3b0',
  '1cc46662e6e9ad2f',
  '1ffdee415c4757bb',
  '20af0f178fb4c8a4',
  '262f68566b406bd4',
  '2b0ea3f94dac95ac',
  '2e09828ed5d6a39a',
  '30c5158d7e2e4eb3',
  '313d5b05be0dc2b8',
  '33a213f181523012',
  '369677d613e228f0',
  '378e32d9190efff2',
  '39d9d7eba90c46c4',
  '3aa64b50c951080b',
  '3b086c07bec8cf74',
  '3e6ee88c2a736092',
  '3e823f38a71a65d1',
  '3ed0f0cb221795c9',
  '42975c5e5ef10a07',
  '42ddd6fe56e617a4',
  '4332a0bdc1ff140b',
  '44612fd12085ced8',
  '44fc2a871a7024d5',
  '458c6f4e43dd050c',
  '4628ab47f50ad77a',
  '4756914380209b39',
  '4a2899d3f95ab37a',
  '4cfecc846a6535d6',
  '500b1c9a19ea3f92',
  '5113bbfaf7a510ac',
  '52098d0ba28769f9',
  '57ced04a5f934e23',
  '590057e505826f4f',
  '5ac21edc68e1ed43',
  '5cdd2bf222110228',
  '5d9db6ba91b603fa',
  '5e15bfd2d28afc12',
  '5eb48a923392c9b3',
  '60cb2a117e48fec0',
  '63d36d0f4a16f6ec',
  '64e3e374b2f0de2a',
  '667749b79d77118f',
  '66cc84b764bbc4b2',
  '6a3d4e7a2a172c47',
  '6f2d35122b46a84c',
  '6f749d79fcdb912e',
  '712647b37dd75f57',
  '72971a1d3df79f11',
  '76b77a7874242f8f',
  '773e2f353a4bc093',
  '79b98a481be22e04',
  '79be08964dc08311',
  '7a9d61cccdf1a832',
  '7cd55f6cd1c43d37',
  '83df84dad405a973',
  '844d8235bce0ee26',
  '85b91b464bf7085f',
  '88de9fdf4a5a4a15',
  '8b2581aab5c4b031',
  '8b83a76b5233342d',
  '8cd5fedfe7418908',
  '8cec2dc848a827e4',
  '91007715fe974d71',
  '95d705f6c768cf0c',
  '98d3688742d1bc47',
  '98f28758fdd8668c',
  '9a4daa17aee4fdd5',
  '9d0c990585753f9f',
  '9f72f2e2b664848c',
  '9f9d85a7e9b9e63c',
  'a02fcd33b644984c',
  'a16481316c5c2432',
  'a588ebdf453c1f5a',
  'aa300a6e40ae72b2',
  'aa668f6b0bca5c44',
  'ab2dedade9b57f25',
  'ae51d719aaec3da7',
  'af9294d370a0d85a',
  'afd40fa80e345345',
  'b22b3999c2e7c8e4',
  'b3631c9c942479a8',
  'b48edbc92598e36c',
  'b49527419979688a',
  'b654604795ac74d6',
  'b7bce3503833f4e9',
  'bb2a3c707d4e33ad',
  'bb4be703dc0528a0',
  'bd9cd154528ffb0b',
  'bdf7777587ec5429',
  'bdfa30a9b925a284',
  'c2d01b23cc596637',
  'c56aa3177cdf4553',
  'c8d925e8701c7f77',
  'c9b86d9488fab686',
  'ca1c53da9c782235',
  'cd5a16a46907617e',
  'ce27c40c7cdc633d',
  'ce39ae3b50a4f388',
  'cfb8ab4f7d97005c',
  'd1f5643dba61bc71',
  'd2fa65bf0a2322e1',
  'd32928445ed47c89',
  'd5bf71cb0765314d',
  'd5d8a3dfc7fa0f84',
  'd63d0e074a965dd3',
  'd66f995cd07e1967',
  'd6cba848dd39dd18',
  'da3754077448b845',
  'da3d4c44bf64b8cd',
  'dc1dcfd4413536b2',
  'dcf75bf8ba49a8fc',
  'de0abc37135694da',
  'de824b4dc8d26239',
  'e4d5f734f60464d2',
  'e4ed5cc26e0075bc',
  'e714d2134bf821db',
  'e8dbf521b0ab879e',
  'e95dee5d1f23dc44',
  'ec1c6a706e11ba97',
  'eff53a15cc6e0778',
  'f51ffcfde35c991e',
  'f574386fb41aa9e5',
  'f58681f34fc8a348',
  'f690638fa570dc7d',
  'f7079565d857d6a0',
  'f9a3a61387bfb86e',
  'fa0bc1db514399a8',
  'fa8322e58e52e5e1',
  'fccef8d6f47fc5ce',
  'fd764a3ff49e7c12',
])
// 消した行（コミットの文）の値。
export const REMOVED_MESSAGE_LINES = new Set([
  '09b12c39d3a5d6a0',
  '2d06a877f46843cc',
  '2dae5d4c883f9b7c',
  '31fce90650137277',
  '380ee01c53187398',
  '3cbd61e4293b047f',
  '3dd73120d7122a17',
  '5f3642342d896ec5',
  '7736cc9dfedb9cde',
  '79eb86489cb5d313',
  '7d864b5e9374941c',
  '8794a994d3dca04b',
  '8a95992463a09f13',
  '8c9c3d368230f978',
  'a1a36719166ddaec',
  'bab864f4abc08f48',
  'c354e1caa1ebdae1',
  'da70c739b98a712f',
  'fc118a1e3d05c412',
  'ff2713c99091ba20',
])

/** 全コミットの全ファイルの全版から、消した行を探す。 */
export function fileHits() {
  const objects = git('rev-list', '--objects', 'HEAD').trim().split('\n').map((line) => line.split(' ')).filter((parts) => parts.length >= 2)
  const pathOf = new Map(objects.map(([sha, ...path]) => [sha, path.join(' ')]))
  const batch = spawnSync('git', ['-C', ROOT, 'cat-file', '--batch'], { input: [...pathOf.keys()].join('\n') + '\n', maxBuffer: 2 ** 31 })
  const buffer = batch.stdout
  const hits = []
  let blobs = 0
  let offset = 0
  while (offset < buffer.length) {
    const newline = buffer.indexOf(10, offset)
    const [sha, type, size] = buffer.subarray(offset, newline).toString().split(' ')
    const start = newline + 1
    const end = start + Number(size)
    if (type === 'blob') {
      const content = buffer.subarray(start, end)
      if (!content.includes(0)) {
        blobs += 1
        for (const line of content.toString('utf8').split('\n')) {
          if (line.trim().length >= 8 && REMOVED_FILE_LINES.has(lineHash(line))) hits.push(`${pathOf.get(sha)}（${sha.slice(0, 8)}）`)
        }
      }
    }
    offset = end + 1
  }
  return { blobs, hits }
}

/** 全コミットの文から、消した行を探す。 */
export function messageHits() {
  const hits = []
  let commits = 0
  for (const chunk of git('log', '--format=%H%x00%B%x01', 'HEAD').split('\x01')) {
    const [sha, body = ''] = chunk.trim().split('\x00')
    if (!sha) continue
    commits += 1
    for (const line of body.split('\n')) if (line.trim().length >= 8 && REMOVED_MESSAGE_LINES.has(lineHash(line))) hits.push(sha.slice(0, 7))
  }
  return { commits, hits }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const both = !process.argv.includes('--files') && !process.argv.includes('--messages')
  let failed = false
  if (both || process.argv.includes('--files')) {
    const { blobs, hits } = fileHits()
    console.log(`全コミットのファイルの版 ${blobs}個を読み、消した言及の行 ${hits.length}か所`)
    for (const hit of hits.slice(0, 20)) console.log(`  ${hit}`)
    if (hits.length) failed = true
  }
  if (both || process.argv.includes('--messages')) {
    const { commits, hits } = messageHits()
    console.log(`全コミット ${commits}件の文を読み、消した言及の行 ${hits.length}か所`)
    for (const hit of hits.slice(0, 20)) console.log(`  ${hit}`)
    if (hits.length) failed = true
  }
  process.exit(failed ? 1 : 0)
}
