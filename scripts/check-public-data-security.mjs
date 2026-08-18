#!/usr/bin/env node

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)))

function read(root, filePath) {
  return readFileSync(resolve(root, filePath), 'utf8')
}

function parseCommentedJson(source) {
  return JSON.parse(source.replace(/^\s*\/\/.*$/gm, ''))
}

export function publicDataSecurityErrors(root = ROOT) {
  const errors = []
  const rulesSource = read(root, 'database.rules.json')
  const rules = parseCommentedJson(rulesSource).rules
  const requests = rules?.wordRequests
  const request = requests?.$word
  const quota = rules?.wordRequestQuota

  if (requests?.['.read'] !== false) {
    errors.push('wordRequests must not be publicly readable')
  }
  // ログイン必須をやめた代わりに、全体の受付上限をルール側で強制する。
  const ruleLimit = Number(
    /wordRequestQuota\/used'\)\.val\(\)\s*<\s*(\d+)/.exec(request?.['.write'] ?? '')?.[1],
  )
  if (!Number.isFinite(ruleLimit)) {
    errors.push('wordRequests writes must be capped by a numeric wordRequestQuota limit')
  }
  if (!/!data\.exists\(\)/.test(request?.['.write'] ?? '')) {
    errors.push('wordRequests entries must be append-only')
  }
  // キーが見出し語なので、同じ語は永久に1件だけ。ルールで一致を強制する。
  if (!/newData\.child\('word'\)\.val\(\)\s*===\s*\$word/.test(request?.['.validate'] ?? '')) {
    errors.push('wordRequests key must equal the stored headword so duplicates cannot pile up')
  }
  if (request?.$other?.['.validate'] !== false) {
    errors.push('wordRequests must reject unknown fields')
  }
  for (const field of ['word', 'q', 'ts', 'source']) {
    if (typeof request?.[field]?.['.validate'] !== 'string') {
      errors.push(`wordRequests.${field} must have a server-side validation rule`)
    }
  }

  const quotaWrite = quota?.used?.['.write'] ?? ''
  if (!/newData\.val\(\)\s*===\s*data\.val\(\)\s*\+\s*1/.test(quotaWrite)) {
    errors.push('wordRequestQuota must only ever move up by one')
  }
  const quotaLimit = Number(/data\.val\(\)\s*<\s*(\d+)/.exec(quotaWrite)?.[1])
  if (!Number.isFinite(quotaLimit) || quotaLimit !== ruleLimit) {
    errors.push('wordRequestQuota limit must match the wordRequests write limit')
  }
  if (quota?.$other?.['.validate'] !== false) {
    errors.push('wordRequestQuota must reject unknown fields')
  }

  const requestClient = read(root, 'src/lib/wordRequests.js')
  if (/byEmail|user\?\.email|fetchWordRequests/.test(requestClient)) {
    errors.push('wordRequests client must not store email addresses or fetch the collection')
  }
  if (/\buser\b/.test(requestClient)) {
    errors.push('wordRequests client must not read the signed-in account')
  }
  const clientLimit = Number(
    /WORD_REQUEST_TOTAL_LIMIT\s*=\s*(\d+)/.exec(requestClient)?.[1],
  )
  if (!Number.isFinite(clientLimit) || clientLimit !== ruleLimit) {
    errors.push('wordRequests client limit must match the security-rule limit')
  }

  // 自動で送るぶんは、端末ごとの1日の上限で受付を絞る。
  if (!/WORD_REQUEST_DEVICE_DAILY_LIMIT\s*=\s*(\d+)/.test(requestClient)) {
    errors.push('wordRequests client must cap automatic requests per device and day')
  }

  // 辞書画面は手動のリクエストボタンを持たず、自動で送る。
  const dictionaryScreen = read(root, 'src/screens/VocabSearch.jsx')
  if (/この単語をリクエスト|ログイン画面へ/.test(dictionaryScreen)) {
    errors.push('dictionary screen must request automatically without a button or login')
  }
  if (!/AUTO_REQUEST_DELAY_MS/.test(dictionaryScreen)) {
    errors.push('dictionary screen must wait for typing to settle before requesting')
  }

  const requestScreen = read(root, 'src/screens/WordRequests.jsx')
  if (!requestScreen.includes('リクエスト一覧は公開していません')) {
    errors.push('wordRequests screen must explain that the collection is private')
  }
  if (!requestScreen.includes('WORD_REQUEST_TOTAL_LIMIT')) {
    errors.push('wordRequests screen must show the shared total limit')
  }

  const pagesWorkflow = read(root, '.github/workflows/deploy.yml')
  if (/\$\{\{\s*secrets\./.test(pagesWorkflow)) {
    errors.push('GitHub Pages build must not receive repository secrets')
  }

  const packageJson = JSON.parse(read(root, 'package.json'))
  if (packageJson.scripts?.['audit:dist'] !== 'node scripts/audit-public-secrets.mjs --directory dist') {
    errors.push('public build must have an exact dist secret-audit command')
  }
  if (packageJson.scripts?.postbuild !== 'npm run audit:dist') {
    errors.push('public build must run its secret audit after every build')
  }

  const rulesWorkflow = read(root, '.github/workflows/firebase-rules.yml')
  if (!/^permissions:\s*\n\s+contents:\s+read\s*$/m.test(rulesWorkflow)) {
    errors.push('Firebase Rules workflow must use a read-only GitHub token')
  }
  if (!rulesWorkflow.includes('umask 077')) {
    errors.push('Firebase service-account file must be owner-readable only')
  }
  if (!/if:\s*always\(\)[\s\S]*rm -f "\$RUNNER_TEMP\/sa\.json"/.test(rulesWorkflow)) {
    errors.push('Firebase service-account file must be removed on every outcome')
  }
  if (!rulesWorkflow.includes('firebase-tools@15.27.0')) {
    errors.push('Firebase CLI must be pinned to the reviewed version')
  }

  for (const [workflowName, workflow] of [
    ['Pages', pagesWorkflow],
    ['Firebase Rules', rulesWorkflow],
  ]) {
    for (const match of workflow.matchAll(/^\s+(?:-\s+)?uses:\s+([^@\s]+)@([^\s#]+)/gm)) {
      const [, action, ref] = match
      if (!/^[0-9a-f]{40}$/.test(ref)) {
        errors.push(`${workflowName} workflow action ${action} must be pinned to a commit SHA`)
      }
    }
  }

  return errors
}

function main() {
  const errors = publicDataSecurityErrors()
  if (errors.length) {
    for (const error of errors) console.error(`public-data-security: ${error}`)
    process.exitCode = 1
    return
  }
  console.log('public-data-security: controls passed')
}

const isDirectRun = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isDirectRun) main()
