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
  const request = requests?.$id

  if (requests?.['.read'] !== false) {
    errors.push('wordRequests must not be publicly readable')
  }
  if (!/auth\s*!=\s*null/.test(request?.['.write'] ?? '')) {
    errors.push('wordRequests writes must require Firebase authentication')
  }
  if (!/!data\.exists\(\)/.test(request?.['.write'] ?? '')) {
    errors.push('wordRequests entries must be append-only')
  }
  if (request?.$other?.['.validate'] !== false) {
    errors.push('wordRequests must reject unknown fields')
  }
  for (const field of ['word', 'q', 'ts', 'source']) {
    if (typeof request?.[field]?.['.validate'] !== 'string') {
      errors.push(`wordRequests.${field} must have a server-side validation rule`)
    }
  }

  const requestClient = read(root, 'src/lib/wordRequests.js')
  if (/byEmail|user\?\.email|fetchWordRequests/.test(requestClient)) {
    errors.push('wordRequests client must not store email addresses or fetch the collection')
  }
  if (!/!user\?\.uid/.test(requestClient)) {
    errors.push('wordRequests client must fail closed when signed out')
  }

  const requestScreen = read(root, 'src/screens/WordRequests.jsx')
  if (!requestScreen.includes('リクエスト一覧は公開していません')) {
    errors.push('wordRequests screen must explain that the collection is private')
  }

  const pagesWorkflow = read(root, '.github/workflows/deploy.yml')
  if (/\$\{\{\s*secrets\./.test(pagesWorkflow)) {
    errors.push('GitHub Pages build must not receive repository secrets')
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

  return errors
}

function main() {
  const errors = publicDataSecurityErrors()
  if (errors.length) {
    for (const error of errors) console.error(`public-data-security: ${error}`)
    process.exitCode = 1
    return
  }
  console.log('public-data-security: 9 controls passed')
}

const isDirectRun = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isDirectRun) main()
