import { access, readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const canonicalUrl = 'https://nanashi8.github.io/study-app/'
const failures = []

const fromRoot = (...parts) => resolve(projectRoot, ...parts)

async function fileExists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

async function readProjectFile(path) {
  try {
    return await readFile(fromRoot(path), 'utf8')
  } catch (error) {
    failures.push(`${path} を読み取れません: ${error.message}`)
    return ''
  }
}

if (await fileExists(fromRoot('.openai', 'hosting.json'))) {
  failures.push('.openai/hosting.json が存在します。旧Sites設定を削除してください。')
}

const [workflow, html, viteConfig, packageJsonText] = await Promise.all([
  readProjectFile('.github/workflows/deploy.yml'),
  readProjectFile('index.html'),
  readProjectFile('vite.config.js'),
  readProjectFile('package.json'),
])

for (const requiredAction of [
  'actions/configure-pages@',
  'actions/upload-pages-artifact@',
  'actions/deploy-pages@',
]) {
  if (!workflow.includes(requiredAction)) {
    failures.push(`GitHub Pagesワークフローに ${requiredAction} がありません。`)
  }
}

if (!workflow.includes('branches: [main]')) {
  failures.push('GitHub Pagesワークフローが main ブランチ公開に固定されていません。')
}

if (/sites-static-worker|dist\/server\/index\.js/i.test(viteConfig)) {
  failures.push('vite.config.js に旧Sites専用ビルド処理が残っています。')
}

if (/chatgpt\.site/i.test(html)) {
  failures.push('index.html に廃止済みChatGPT Sites URLが残っています。')
}

for (const requiredMetadata of [
  `<link rel="canonical" href="${canonicalUrl}" />`,
  `<meta property="og:url" content="${canonicalUrl}" />`,
  `${canonicalUrl}og.png`,
]) {
  if (!html.includes(requiredMetadata)) {
    failures.push(`index.html に正式URLの指定がありません: ${requiredMetadata}`)
  }
}

try {
  const packageJson = JSON.parse(packageJsonText)
  if (packageJson.name !== 'study-app') {
    failures.push('package.json のnameは study-app にしてください。')
  }
} catch (error) {
  failures.push(`package.json を解析できません: ${error.message}`)
}

if (failures.length > 0) {
  console.error('❌ 公開先監査に失敗しました。正式公開先はGitHub Pagesのみです。')
  for (const failure of failures) console.error(`  - ${failure}`)
  process.exitCode = 1
} else {
  console.log(`✅ 公開先監査OK: ${canonicalUrl}`)
}

