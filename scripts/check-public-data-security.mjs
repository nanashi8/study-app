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
