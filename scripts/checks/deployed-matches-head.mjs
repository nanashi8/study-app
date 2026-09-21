#!/usr/bin/env node
// いまの HEAD が origin/main に push 済みで、その commit の GitHub Pages へのデプロイが成功しているかを確かめる。
import { execSync } from 'node:child_process'

const run = (command) => execSync(command, { encoding: 'utf8' }).trim()
try {
  run('git fetch -q origin main')
  const head = run('git rev-parse HEAD')
  const remote = run('git rev-parse origin/main')
  if (head !== remote) {
    console.log(`HEAD ${head.slice(0, 7)} が origin/main ${remote.slice(0, 7)} と一致しない（未 push か、ほかの変更がある）`)
    process.exit(1)
  }
  const runs = JSON.parse(run('gh run list --workflow deploy.yml --limit 10 --json headSha,status,conclusion'))
  const deploy = runs.find((item) => item.headSha === head)
  if (!deploy || deploy.status !== 'completed' || deploy.conclusion !== 'success') {
    console.log(`commit ${head.slice(0, 7)} のデプロイが成功していない（${deploy ? `${deploy.status}/${deploy.conclusion}` : '見つからない'}）`)
    process.exit(1)
  }
  console.log(`commit ${head.slice(0, 7)} は push 済みで、公開版へのデプロイが成功している`)
} catch (error) {
  console.log(`確かめられない: ${error.message}`)
  process.exit(1)
}
