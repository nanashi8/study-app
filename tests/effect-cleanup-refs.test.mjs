// effect の後始末で ref に値を入れたら、effect の本体でも入れ直す（requests/2026-09-28-vocab-camera-dev-ocr.json）。
// 2026-09-28、「教科書から単語追加」（src/screens/VocabCamera.jsx）の読み取りが、開発版で「写真を読み込んでいます…」2% の
// まま止まった。生存フラグ mountedRef を useRef(true) で作り、effect の後始末だけで false にしていた。src/main.jsx の
// StrictMode は開発版で effect を「付ける→外す→付ける」と2回走らせるので、印は false のまま残り、読み取りは写真を
// 読み込んだ直後の `if (!mountedRef.current) return` で抜けていた。後始末で入れた値は、付け直したときに本体で戻す。
// 名前（mountedRef・aliveRef など）によらず、src の全 .js・.jsx の effect を構文木で読んで確かめる。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseAst } from 'vite'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const EFFECTS = new Set(['useEffect', 'useLayoutEffect', 'useInsertionEffect'])
const FUNCTIONS = new Set(['ArrowFunctionExpression', 'FunctionExpression', 'FunctionDeclaration'])

const sourceFiles = (directory) => readdirSync(directory).flatMap((name) => {
  const path = join(directory, name)
  if (statSync(path).isDirectory()) return sourceFiles(path)
  return ['.js', '.jsx'].includes(extname(path)) ? [path] : []
})

// 木をたどる。intoFunctions が false なら、入れ子の関数の中へは入らない。
function walk(node, visit, { intoFunctions = true } = {}) {
  if (!node || typeof node !== 'object') return
  if (Array.isArray(node)) {
    for (const child of node) walk(child, visit, { intoFunctions })
    return
  }
  if (typeof node.type === 'string') visit(node)
  for (const value of Object.values(node)) {
    if (!value || typeof value !== 'object') continue
    if (!intoFunctions && typeof value.type === 'string' && FUNCTIONS.has(value.type)) continue
    walk(value, visit, { intoFunctions })
  }
}

// X.current = … の X の名前。
function refAssignments(node, options) {
  const names = []
  walk(node, (child) => {
    const target = child.type === 'AssignmentExpression' ? child.left : null
    if (target?.type === 'MemberExpression' && !target.computed && target.property?.name === 'current'
      && target.object?.type === 'Identifier') {
      names.push(target.object.name)
    }
  }, options)
  return names
}

const effectName = (callee) => (
  callee?.type === 'Identifier' ? callee.name
    : callee?.type === 'MemberExpression' ? callee.property?.name
      : null
)

// effect の本体（付けるときに走る文）と、後始末（本体が返す関数）に分ける。
// 後始末は、本体の return が返す関数か、本体の中で名前を付けて作った関数（return stop のような書き方）。
function effectParts(effect) {
  if (effect.body.type !== 'BlockStatement') {
    return { setup: [], cleanups: FUNCTIONS.has(effect.body.type) ? [effect.body] : [] }
  }
  const localFunctions = new Map()
  walk(effect.body.body, (node) => {
    if (node.type === 'VariableDeclarator' && node.id?.type === 'Identifier' && FUNCTIONS.has(node.init?.type)) {
      localFunctions.set(node.id.name, node.init)
    }
    if (node.type === 'FunctionDeclaration' && node.id) localFunctions.set(node.id.name, node)
  }, { intoFunctions: false })
  const cleanups = []
  walk(effect.body.body, (node) => {
    if (node.type !== 'ReturnStatement' || !node.argument) return
    if (FUNCTIONS.has(node.argument.type)) cleanups.push(node.argument)
    else if (node.argument.type === 'Identifier' && localFunctions.has(node.argument.name)) {
      cleanups.push(localFunctions.get(node.argument.name))
    }
  }, { intoFunctions: false })
  return { setup: effect.body.body, cleanups }
}

/** 後始末で ref に値を入れ、本体では入れ直さない effect を並べる。 */
export function cleanupOnlyRefs(source, file = 'source.jsx') {
  const ast = parseAst(source, { lang: extname(file) === '.jsx' ? 'jsx' : 'js' })
  const findings = []
  let effects = 0
  let withCleanup = 0
  walk(ast, (node) => {
    if (node.type !== 'CallExpression' || !EFFECTS.has(effectName(node.callee))) return
    const effect = node.arguments?.[0]
    if (!effect || !['ArrowFunctionExpression', 'FunctionExpression'].includes(effect.type)) return
    effects += 1
    const { setup, cleanups } = effectParts(effect)
    if (!cleanups.length) return
    withCleanup += 1
    // 付けるときにそのまま走る代入だけを数える（入れ子の関数の中の代入は、付けたときには走らない）。
    const restored = new Set(refAssignments(setup, { intoFunctions: false }))
    for (const cleanup of cleanups) {
      for (const ref of new Set(refAssignments(cleanup.body ?? cleanup))) {
        if (restored.has(ref)) continue
        const line = source.slice(0, node.start).split('\n').length
        findings.push(`${file}:${line} ${effectName(node.callee)} の後始末で ${ref}.current に入れ、本体では入れ直さない`)
      }
    }
  })
  return { findings, effects, withCleanup }
}

test('src の全 effect で、後始末で ref に入れた値は本体でも入れ直す', () => {
  let effects = 0
  let withCleanup = 0
  const findings = []
  for (const path of sourceFiles(join(ROOT, 'src'))) {
    const source = readFileSync(path, 'utf8')
    if (!/\buse(?:Layout|Insertion)?Effect\b/.test(source)) continue
    const result = cleanupOnlyRefs(source, relative(ROOT, path))
    effects += result.effects
    withCleanup += result.withCleanup
    findings.push(...result.findings)
  }
  // 読み取りが効いているかの目安（2026-09-28 は effect 68件・後始末を返すもの 13件）。
  assert.ok(effects >= 60, `effect が ${effects}件しか読めていない`)
  assert.ok(withCleanup >= 10, `後始末を返す effect が ${withCleanup}件しか読めていない`)
  assert.deepEqual(findings, [])
})

// 直す前の「教科書から単語追加」の書き方（2026-09-28 まで）。
const BEFORE_FIX = `
import { useEffect, useRef } from 'react'
export function VocabCameraScreen() {
  const previewUrlRef = useRef('')
  const workerRef = useRef(null)
  const mountedRef = useRef(true)
  useEffect(() => () => {
    mountedRef.current = false
    workerRef.current?.terminate()
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
  }, [])
  return null
}
`

test('直す前の「教科書から単語追加」の書き方と、名前や書き方を変えた同じ型を止める', () => {
  assert.deepEqual(cleanupOnlyRefs(BEFORE_FIX, 'VocabCamera.jsx').findings, [
    'VocabCamera.jsx:7 useEffect の後始末で mountedRef.current に入れ、本体では入れ直さない',
  ])
  const variants = [
    // 本体を書いた effect が、後始末の関数を返す。
    `useEffect(() => { start(); return () => { aliveRef.current = false } }, [])`,
    // 名前を付けた後始末を返す。
    `useLayoutEffect(() => { const stop = () => { activeRef.current = false }; return stop }, [])`,
    // React. を付けて呼ぶ。後始末の中の入れ子の関数で入れる。
    `React.useEffect(() => () => { setTimeout(() => { unmountedRef.current = true }) }, [])`,
    // 本体の入れ子の関数（付けたときには走らない）で入れても、入れ直したことにはならない。
    `useEffect(() => { const later = () => { liveRef.current = true }; later; return () => { liveRef.current = false } }, [])`,
  ]
  for (const source of variants) {
    assert.equal(cleanupOnlyRefs(source, 'variant.jsx').findings.length, 1, source)
  }
})

test('本体で入れ直す effect、ref に入れない後始末は止めない', () => {
  const fixed = BEFORE_FIX.replace(
    'useEffect(() => () => {',
    'useEffect(() => {\n    mountedRef.current = true\n    return () => {',
  ).replace('  }, [])', '    }\n  }, [])')
  assert.match(fixed, /mountedRef\.current = true\n    return \(\) => \{/)
  assert.deepEqual(cleanupOnlyRefs(fixed, 'VocabCamera.jsx').findings, [])
  const fine = [
    `useEffect(() => { timerRef.current = setTimeout(tick, 100); return () => { clearTimeout(timerRef.current); timerRef.current = null } }, [])`,
    `useEffect(() => { let alive = true; load().then(() => alive && set(1)); return () => { alive = false } }, [])`,
    `useEffect(() => () => dismissSpeechPlayer(), [screen])`,
    `useEffect(() => { window.addEventListener('resize', onResize); return () => window.removeEventListener('resize', onResize) }, [])`,
  ]
  for (const source of fine) {
    assert.deepEqual(cleanupOnlyRefs(source, 'fine.jsx').findings, [], source)
  }
})
