#!/usr/bin/env node

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { basename, extname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)))
const MAX_TEXT_BYTES = 25 * 1024 * 1024
const HISTORY_BATCH_BYTES = 32 * 1024 * 1024
const FIREBASE_CONFIG_SOURCE = readFileSync(resolve(ROOT, 'src/lib/firebaseConfig.js'), 'utf8')
const EXPECTED_FIREBASE_WEB_API_KEY = FIREBASE_CONFIG_SOURCE.match(
  /apiKey:\s*["'](AIza[0-9A-Za-z_-]{35})["']/,
)?.[1]
if (!EXPECTED_FIREBASE_WEB_API_KEY) {
  throw new Error('Expected Firebase Web API key was not found in src/lib/firebaseConfig.js')
}
const SKIP_DIRS = new Set([
  '.git',
  '.vite',
  'coverage',
  'dist',
  'dist-ssr',
  'node_modules',
  'playwright-report',
  'test-results',
])
const BINARY_EXTENSIONS = new Set([
  '.7z', '.aiff', '.avif', '.br', '.bz2', '.class', '.dmg', '.eot', '.flac',
  '.gif', '.gz', '.ico', '.jar', '.jpeg', '.jpg', '.m4a', '.mov', '.mp3',
  '.mp4', '.ogg', '.otf', '.pdf', '.png', '.tar', '.tgz', '.ttf', '.wav',
  '.webm', '.webp', '.woff', '.woff2', '.zip',
])
const SECRET_RULES = [
  {
    id: 'private-key',
    pattern: /-----BEGIN(?: [A-Z0-9_-]+)* PRIVATE KEY-----/g,
  },
  {
    id: 'aws-access-key',
    pattern: /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g,
  },
  {
    id: 'github-token',
    pattern: /\b(?:gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,})\b/g,
  },
  {
    id: 'slack-token',
    pattern: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/g,
  },
  {
    id: 'stripe-secret',
    pattern: /\b(?:sk|rk)_(?:live|test)_[A-Za-z0-9]{12,}\b/g,
  },
  {
    id: 'webhook-secret',
    pattern: /\bwhsec_[A-Za-z0-9]{12,}\b/g,
  },
  {
    id: 'npm-token',
    pattern: /\bnpm_[A-Za-z0-9]{20,}\b/g,
  },
  {
    id: 'google-oauth-token',
    pattern: /\bya29\.[A-Za-z0-9_-]{20,}\b/g,
  },
  {
    id: 'google-api-key',
    pattern: /\bAIza[0-9A-Za-z_-]{35}\b/g,
  },
  {
    id: 'credentialed-url',
    pattern: /https?:\/\/[^\s/:@]+:[^\s/@]+@/g,
  },
  {
    id: 'service-account-json',
    pattern: /["'](?:private_key_id|client_email)["']\s*:/g,
  },
  {
    id: 'literal-credential',
    pattern: /\b(?:api[_-]?key|secret|token|password|passwd|private[_-]?key|client[_-]?secret|access[_-]?key|authorization)\s*[:=]\s*["'`]([^"'`\r\n]{6,})["'`]/gi,
    valueGroup: 1,
  },
  {
    id: 'absolute-user-path',
    pattern: /\/Users\/[A-Za-z0-9._-]+(?:\/|\b)/g,
  },
  {
    id: 'email-address',
    pattern: /\b([A-Za-z0-9._%+-]+)@([A-Za-z0-9.-]+\.[A-Za-z]{2,})\b/g,
    valueGroup: 0,
  },
]

const PLACEHOLDER_PARTS = [
  '<redacted',
  '<your',
  '${',
  '${{',
  'dummy',
  'example',
  'fake',
  'paste_',
  'placeholder',
  'process.env',
  'test-',
  'your_',
]

const ALLOWED_EMAIL_DOMAINS = new Set([
  'eigo-quest.local',
  'example.com',
  'example.net',
  'example.org',
  'users.noreply.github.com',
])

function normalizePath(filePath) {
  return filePath.replaceAll('\\', '/').replace(/^\.\//, '')
}

export function isSensitivePath(filePath) {
  const normalized = normalizePath(filePath)
  const name = basename(normalized).toLowerCase()

  if (/^\.env(?:\.|$)/.test(name) && !/^\.env\.(?:example|sample|template)$/.test(name)) {
    return true
  }
  if (/^(?:\.npmrc|\.netrc|\.pypirc)$/.test(name)) return true
  if (/^(?:id_rsa|id_ed25519)(?:\.pub)?$/.test(name)) return true
  if (/\.(?:jks|key|keystore|p12|pem|pfx)$/.test(name)) return true
  if (/(?:credentials?|service[-_]?account).*\.json$/.test(name)) return true
  return false
}

function isPlaceholder(value) {
  const lower = value.toLowerCase()
  return PLACEHOLDER_PARTS.some((part) => lower.includes(part))
}

function isAllowedMatch(ruleId, filePath, match) {
  const normalized = normalizePath(filePath)
  const value = match[1] ?? match[0]

  // Minified application/data bundles routinely contain fields such as
  // `password: "パスワード"` or dependency parser labels. Current source is
  // already checked for broad literal assignments; compiled output retains the
  // high-confidence provider/key/URL rules without this noisy heuristic.
  if (ruleId === 'literal-credential' && normalized.startsWith('dist/')) {
    return true
  }

  if (ruleId === 'email-address') {
    const local = match[1]?.toLowerCase()
    const domain = match[2]?.toLowerCase()
    return ALLOWED_EMAIL_DOMAINS.has(domain)
      || /(?:^|\.)(?:invalid|local|localhost|test)$/.test(domain)
      || /^(?:no-?reply)$/.test(local)
  }

  // Firebase Web configuration is shipped to every browser by design. Allow
  // only the exact reviewed identifier, and only in its source or compiled
  // public-build location.
  if (
    (ruleId === 'google-api-key' || ruleId === 'literal-credential')
    && value === EXPECTED_FIREBASE_WEB_API_KEY
    && (normalized === 'src/lib/firebaseConfig.js' || normalized.startsWith('dist/'))
  ) {
    return true
  }

  return ruleId === 'literal-credential' && isPlaceholder(value)
}

function lineNumberAt(text, index) {
  let line = 1
  for (let i = 0; i < index; i += 1) {
    if (text.charCodeAt(i) === 10) line += 1
  }
  return line
}

export function scanText(filePath, text) {
  const findings = []

  for (const rule of SECRET_RULES) {
    rule.pattern.lastIndex = 0
    for (const match of text.matchAll(rule.pattern)) {
      if (isAllowedMatch(rule.id, filePath, match)) continue
      findings.push({
        file: normalizePath(filePath),
        line: lineNumberAt(text, match.index ?? 0),
        rule: rule.id,
      })
    }
  }

  return findings
}

function looksBinary(buffer, filePath) {
  if (BINARY_EXTENSIONS.has(extname(filePath).toLowerCase())) return true
  const sample = buffer.subarray(0, Math.min(buffer.length, 8192))
  return sample.includes(0)
}

function printableMetadata(buffer) {
  const parts = []
  let current = ''
  for (const byte of buffer) {
    if (byte >= 0x20 && byte <= 0x7e) {
      current += String.fromCharCode(byte)
      continue
    }
    if (current.length >= 6) parts.push(current)
    current = ''
  }
  if (current.length >= 6) parts.push(current)
  return parts.join('\n')
}

function embeddedMetadata(buffer, filePath) {
  const extension = extname(filePath).toLowerCase()
  const payloads = []

  if (
    extension === '.webp'
    && buffer.length >= 12
    && buffer.toString('ascii', 0, 4) === 'RIFF'
    && buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    let offset = 12
    while (offset + 8 <= buffer.length) {
      const type = buffer.toString('ascii', offset, offset + 4)
      const size = buffer.readUInt32LE(offset + 4)
      const start = offset + 8
      const end = Math.min(start + size, buffer.length)
      if (type === 'EXIF' || type === 'XMP ') payloads.push(buffer.subarray(start, end))
      offset = start + size + (size % 2)
    }
  } else if (
    extension === '.png'
    && buffer.length >= 8
    && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  ) {
    let offset = 8
    while (offset + 12 <= buffer.length) {
      const size = buffer.readUInt32BE(offset)
      const type = buffer.toString('ascii', offset + 4, offset + 8)
      const start = offset + 8
      const end = Math.min(start + size, buffer.length)
      if (['eXIf', 'iTXt', 'tEXt', 'zTXt'].includes(type)) {
        payloads.push(buffer.subarray(start, end))
      }
      offset = end + 4
      if (type === 'IEND') break
    }
  } else if (extension === '.jpg' || extension === '.jpeg') {
    let offset = 2
    while (offset + 4 <= buffer.length && buffer[offset] === 0xff) {
      const marker = buffer[offset + 1]
      if (marker === 0xda || marker === 0xd9) break
      const size = buffer.readUInt16BE(offset + 2)
      if (size < 2) break
      const start = offset + 4
      const end = Math.min(offset + 2 + size, buffer.length)
      if (marker === 0xe1 || marker === 0xed || marker === 0xfe) {
        payloads.push(buffer.subarray(start, end))
      }
      offset += size + 2
    }
  }

  const metadata = payloads.map(printableMetadata).filter(Boolean).join('\n')
  return metadata
}

function walkCurrentTree(directory = ROOT) {
  const files = []
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue
    if (entry.isSymbolicLink()) continue
    if (entry.isDirectory()) {
      files.push(...walkCurrentTree(join(directory, entry.name)))
      continue
    }
    if (entry.isFile()) files.push(join(directory, entry.name))
  }
  return files
}

function scanDirectory(directory, { publicBuild = false } = {}) {
  const findings = []
  let binaryFiles = 0
  let scannedFiles = 0
  let oversizedFiles = 0

  for (const absolutePath of walkCurrentTree(directory)) {
    const filePath = normalizePath(relative(ROOT, absolutePath))
    if (isSensitivePath(filePath)) {
      findings.push({ file: filePath, line: 1, rule: 'sensitive-filename' })
    }
    if (publicBuild && filePath.endsWith('.map')) {
      findings.push({ file: filePath, line: 1, rule: 'public-source-map' })
    }

    const size = statSync(absolutePath).size
    if (size > MAX_TEXT_BYTES) {
      oversizedFiles += 1
      continue
    }
    const buffer = readFileSync(absolutePath)
    if (looksBinary(buffer, filePath)) {
      binaryFiles += 1
      findings.push(...scanText(filePath, embeddedMetadata(buffer, filePath)))
      continue
    }
    scannedFiles += 1
    findings.push(...scanText(filePath, buffer.toString('utf8')))
  }

  return { binaryFiles, findings, oversizedFiles, scannedFiles }
}

function scanCurrentTree() {
  return scanDirectory(ROOT)
}

function runGit(args, options = {}) {
  const result = spawnSync('git', args, {
    cwd: ROOT,
    encoding: options.encoding ?? 'utf8',
    input: options.input,
    maxBuffer: options.maxBuffer ?? 128 * 1024 * 1024,
  })
  if (result.status !== 0) {
    const detail = String(result.stderr || result.stdout || '').trim()
    throw new Error(`git ${args.join(' ')} failed${detail ? `: ${detail}` : ''}`)
  }
  return result.stdout
}

function historyObjects(ref) {
  const raw = runGit(['rev-list', '--objects', ref])
  const objects = raw
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const separator = line.indexOf(' ')
      return separator === -1
        ? { object: line, file: '' }
        : { object: line.slice(0, separator), file: normalizePath(line.slice(separator + 1)) }
    })

  const check = runGit(
    ['cat-file', '--batch-check=%(objectname) %(objecttype) %(objectsize)'],
    { input: `${objects.map(({ object }) => object).join('\n')}\n` },
  ).trimEnd().split('\n')

  return objects.flatMap((entry, index) => {
    const [, type, sizeText] = check[index]?.split(' ') ?? []
    if (type !== 'blob' || !entry.file) return []
    return [{ ...entry, size: Number(sizeText) }]
  })
}

function parseBatch(buffer, entries) {
  const blobs = []
  let offset = 0

  for (const entry of entries) {
    const newline = buffer.indexOf(10, offset)
    if (newline === -1) throw new Error('Unexpected git cat-file batch output')
    const header = buffer.subarray(offset, newline).toString('utf8').split(' ')
    const size = Number(header[2])
    const start = newline + 1
    const end = start + size
    blobs.push({ entry, buffer: buffer.subarray(start, end) })
    offset = end + 1
  }

  return blobs
}

function historicalPaths(ref) {
  const raw = runGit(['log', ref, '--format=', '--name-only', '-z'], { encoding: 'buffer' })
  return new Set(
    raw.toString('utf8').split('\0').map(normalizePath).filter(Boolean),
  )
}

function historicalCommitText(ref) {
  const raw = runGit(
    ['log', ref, '--format=%H%x00%ae%x00%ce%x00%B%x00'],
    { encoding: 'buffer' },
  ).toString('utf8')
  const fields = raw.split('\0')
  const records = []
  for (let index = 0; index + 3 < fields.length; index += 4) {
    const commit = fields[index].trim()
    if (!commit) continue
    records.push({
      file: `git-commit:${commit.slice(0, 12)}`,
      text: `${fields[index + 1]}\n${fields[index + 2]}\n${fields[index + 3]}`,
    })
  }
  return records
}

function scanHistory(ref) {
  const findings = []
  let binaryFiles = 0
  let scannedFiles = 0
  let oversizedFiles = 0

  for (const filePath of historicalPaths(ref)) {
    if (isSensitivePath(filePath)) {
      findings.push({ file: filePath, line: 1, rule: 'sensitive-filename' })
    }
  }

  for (const record of historicalCommitText(ref)) {
    scannedFiles += 1
    findings.push(...scanText(record.file, record.text))
  }

  const entries = historyObjects(ref).filter((entry) => {
    if (entry.size > MAX_TEXT_BYTES) {
      oversizedFiles += 1
      return false
    }
    return true
  })

  const chunks = []
  let chunk = []
  let chunkBytes = 0
  for (const entry of entries) {
    if (chunk.length && (chunk.length >= 250 || chunkBytes + entry.size > HISTORY_BATCH_BYTES)) {
      chunks.push(chunk)
      chunk = []
      chunkBytes = 0
    }
    chunk.push(entry)
    chunkBytes += entry.size
  }
  if (chunk.length) chunks.push(chunk)

  for (const historyChunk of chunks) {
    const buffer = runGit(['cat-file', '--batch'], {
      encoding: 'buffer',
      input: Buffer.from(`${historyChunk.map(({ object }) => object).join('\n')}\n`),
      maxBuffer: 256 * 1024 * 1024,
    })
    for (const { entry, buffer: blob } of parseBatch(buffer, historyChunk)) {
      if (looksBinary(blob, entry.file)) {
        binaryFiles += 1
        findings.push(...scanText(entry.file, embeddedMetadata(blob, entry.file)))
        continue
      }
      scannedFiles += 1
      findings.push(...scanText(entry.file, blob.toString('utf8')))
    }
  }

  return { binaryFiles, findings, oversizedFiles, scannedFiles }
}

function deduplicate(findings) {
  const seen = new Set()
  return findings.filter((finding) => {
    const key = `${finding.rule}\0${finding.file}\0${finding.line}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function printResult(label, result) {
  const findings = deduplicate(result.findings)
  console.log(
    `${label}: text_records_scanned=${result.scannedFiles} binary_files_inspected=${result.binaryFiles} oversized_skipped=${result.oversizedFiles} findings=${findings.length}`,
  )
  for (const finding of findings) {
    console.error(`${finding.rule}: ${finding.file}:${finding.line}`)
  }
  return findings.length
}

function main(argv = process.argv.slice(2)) {
  if (argv[0] === '--history') {
    const ref = argv[1] ?? 'HEAD'
    process.exitCode = printResult(`history(${ref})`, scanHistory(ref)) ? 1 : 0
    return
  }
  if (argv[0] === '--directory' && argv.length === 2) {
    const directory = resolve(ROOT, argv[1])
    const directoryName = normalizePath(relative(ROOT, directory))
    if (!directoryName || directoryName.startsWith('../') || directoryName === '..') {
      console.error('audit directory must be inside the repository')
      process.exitCode = 2
      return
    }
    if (!statSync(directory).isDirectory()) {
      console.error(`audit directory is not a directory: ${directoryName}`)
      process.exitCode = 2
      return
    }
    process.exitCode = printResult(
      `directory(${directoryName})`,
      scanDirectory(directory, { publicBuild: directoryName === 'dist' }),
    ) ? 1 : 0
    return
  }
  if (argv.length) {
    console.error('Usage: node scripts/audit-public-secrets.mjs [--history <git-ref> | --directory <path>]')
    process.exitCode = 2
    return
  }
  process.exitCode = printResult('current-tree', scanCurrentTree()) ? 1 : 0
}

const isDirectRun = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isDirectRun) main()
