import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { mkdir, writeFile } from 'node:fs/promises'

const sitesStaticWorker = () => ({
  name: 'sites-static-worker',
  apply: 'build',
  async closeBundle() {
    await mkdir('dist/server', { recursive: true })
    await writeFile(
      'dist/server/index.js',
      `const worker = {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request)
    if (response.status !== 404 || request.method !== 'GET') return response

    const indexUrl = new URL('/index.html', request.url)
    return env.ASSETS.fetch(new Request(indexUrl, request))
  },
}

export default worker
`,
    )
  },
})

// base: './' keeps asset URLs relative so the build works under any
// GitHub Pages path (https://<user>.github.io/<repo>/) without extra config.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), sitesStaticWorker()],
})
