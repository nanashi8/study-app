import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { isSensitivePath, scanText } from '../scripts/audit-public-secrets.mjs'

test('公開禁止の鍵・トークン・個人メールを値なしの検出結果にする', () => {
  const pemMarker = '-----BEGIN ' + 'PRIVATE KEY-----'
  const tokenCandidate = 'ghp_' + 'A'.repeat(36)
  const personalEmail = ['student', 'private-school.jp'].join('@')
  const findings = scanText(
    'src/example.js',
    `${pemMarker}\nconst token = "${tokenCandidate}"\nconst email = "${personalEmail}"`,
  )

  assert.deepEqual(
    new Set(findings.map(({ rule }) => rule)),
    new Set(['private-key', 'github-token', 'literal-credential', 'email-address']),
  )
  assert.equal(findings.every((finding) => !('value' in finding)), true)
})

test('例示値と正確なFirebase Web APIキーだけを秘密情報扱いしない', () => {
  const firebaseConfig = readFileSync(new URL('../src/lib/firebaseConfig.js', import.meta.url), 'utf8')
  const expectedKey = firebaseConfig.match(/apiKey:\s*["'](AIza[0-9A-Za-z_-]{35})["']/)?.[1]
  assert.ok(expectedKey)

  assert.deepEqual(scanText('tests/example.js', 'student@example.com'), [])
  assert.deepEqual(scanText('src/lib/firebaseConfig.js', `apiKey: "${expectedKey}"`), [])
  assert.deepEqual(scanText('dist/assets/app.js', `apiKey: "${expectedKey}"`), [])

  const unexpectedKey = 'AIza' + (expectedKey.endsWith('A') ? 'B' : 'A').repeat(35)
  assert.equal(
    scanText('dist/assets/app.js', `apiKey: "${unexpectedKey}"`).some(({ rule }) => rule === 'google-api-key'),
    true,
  )
  assert.equal(
    scanText('dist/assets/app.js', `const leaked = "${'ghp_' + 'A'.repeat(36)}"`)
      .some(({ rule }) => rule === 'github-token'),
    true,
  )
})

test('環境ファイル・秘密鍵・サービスアカウント候補のファイル名を拒否する', () => {
  assert.equal(isSensitivePath('.env'), true)
  assert.equal(isSensitivePath('.env.production'), true)
  assert.equal(isSensitivePath('.env.example'), false)
  assert.equal(isSensitivePath('config/service-account.json'), true)
  assert.equal(isSensitivePath('certs/release.pem'), true)
})
