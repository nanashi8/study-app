import { access, readFile, readdir } from 'node:fs/promises'
import { dirname, relative, resolve } from 'node:path'
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

async function sourceFilesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(entries.map(async (entry) => {
    const path = resolve(directory, entry.name)
    if (entry.isDirectory()) return sourceFilesUnder(path)
    return /\.(?:js|jsx|css)$/.test(entry.name) ? [path] : []
  }))
  return files.flat()
}

if (await fileExists(fromRoot('.openai', 'hosting.json'))) {
  failures.push('.openai/hosting.json が存在します。旧Sites設定を削除してください。')
}

const [workflow, html, viteConfig, packageJsonText, manifestText] = await Promise.all([
  readProjectFile('.github/workflows/deploy.yml'),
  readProjectFile('index.html'),
  readProjectFile('vite.config.js'),
  readProjectFile('package.json'),
  readProjectFile('public/site.webmanifest'),
])

const requiredIconFiles = [
  'public/favicon.svg',
  'public/favicon-32x32.png',
  'public/apple-touch-icon.png',
  'public/icon-192.png',
  'public/icon-512.png',
  'public/site.webmanifest',
]

for (const iconFile of requiredIconFiles) {
  if (!(await fileExists(fromRoot(iconFile)))) {
    failures.push(`サイトアイコンがありません: ${iconFile}`)
  }
}

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

for (const requiredIconMetadata of [
  '%BASE_URL%favicon.svg',
  '%BASE_URL%favicon-32x32.png',
  '%BASE_URL%apple-touch-icon.png',
  '%BASE_URL%site.webmanifest',
]) {
  if (!html.includes(requiredIconMetadata)) {
    failures.push(`index.html にサイトアイコン指定がありません: ${requiredIconMetadata}`)
  }
}

for (const requiredStandaloneMetadata of [
  '<meta name="mobile-web-app-capable" content="yes" />',
  '<meta name="apple-mobile-web-app-capable" content="yes" />',
  '<meta name="apple-mobile-web-app-status-bar-style" content="default" />',
  '<meta name="apple-mobile-web-app-title" content="スタディアプリ" />',
]) {
  if (!html.includes(requiredStandaloneMetadata)) {
    failures.push(`index.html にスタンドアロン起動指定がありません: ${requiredStandaloneMetadata}`)
  }
}

// `/assets/...` はGitHub Pagesのドメイン直下へ解決され、/study-app/ を失う。
// publicAssetUrl() を必須にして、ゲーム画像の一括404を公開前に止める。
for (const sourceFile of await sourceFilesUnder(fromRoot('src'))) {
  const source = await readFile(sourceFile, 'utf8')
  source.split('\n').forEach((line, index) => {
    if (/['"`]\/assets\//.test(line) && !line.includes('publicAssetUrl(')) {
      failures.push(
        `${relative(projectRoot, sourceFile)}:${index + 1} のpublic画像がGitHub Pagesのbaseを通っていません。`,
      )
    }
  })
}

try {
  const packageJson = JSON.parse(packageJsonText)
  if (packageJson.name !== 'study-app') {
    failures.push('package.json のnameは study-app にしてください。')
  }
} catch (error) {
  failures.push(`package.json を解析できません: ${error.message}`)
}

try {
  const manifest = JSON.parse(manifestText)
  if (manifest.display !== 'standalone') {
    failures.push('site.webmanifest のdisplayは standalone にしてください。')
  }
  if (manifest.start_url !== './' || manifest.scope !== './') {
    failures.push('site.webmanifest のstart_urlとscopeはGitHub Pages配下を保つ ./ にしてください。')
  }
} catch (error) {
  failures.push(`public/site.webmanifest を解析できません: ${error.message}`)
}

if (failures.length > 0) {
  console.error('❌ 公開先監査に失敗しました。正式公開先はGitHub Pagesのみです。')
  for (const failure of failures) console.error(`  - ${failure}`)
  process.exitCode = 1
} else {
  console.log(`✅ 公開先監査OK: ${canonicalUrl}`)
}
