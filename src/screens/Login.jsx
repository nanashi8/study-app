// ログイン画面。先生が発行した ID（メール）とパスワードで入る。
// 未ログインでもアプリは使える（ゲスト）ので、この画面は任意。戻るで離脱できる。
import { useState } from 'react'
import { useAuth } from '../store/useAuth.js'
import { useStore } from '../store/useStore.js'
import { Button, Card } from '../components/ui.jsx'

export function LoginScreen() {
  const signIn = useAuth((s) => s.signIn)
  const busy = useAuth((s) => s.busy)
  const error = useAuth((s) => s.error)
  const back = useStore((s) => s.back)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!email || !password || busy) return
    signIn(email, password)
  }

  const field =
    'h-12 w-full rounded-2xl border-2 border-brand-200 bg-white px-4 text-base ' +
    'outline-none focus:border-brand-400 placeholder:text-ink/30'

  return (
    <div className="relative flex min-h-full flex-col items-center justify-center px-6 py-10">
      <div className="mb-6 text-center">
        <div className="text-5xl">⚔️</div>
        <h1 className="mt-2 font-display text-2xl font-extrabold text-ink">英語アプリ</h1>
        <p className="mt-1 text-sm font-bold text-ink/50">ログインして続きから学習</p>
      </div>

      <Card className="w-full max-w-sm p-6">
        <form onSubmit={submit} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-bold text-ink/70">ID（メールアドレス）</span>
            <input
              className={field}
              type="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              inputMode="email"
              placeholder="taro@eigo-quest.local"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-bold text-ink/70">パスワード</span>
            <input
              className={field}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {error && (
            <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-bold text-rose-600">
              {error}
            </p>
          )}

          <Button type="submit" full size="lg" disabled={busy || !email || !password}>
            {busy ? 'ログイン中…' : 'ログイン'}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-ink/40">
          IDとパスワードは先生から受け取ってください。
        </p>
      </Card>

      <button
        onClick={back}
        className="mt-5 text-xs font-extrabold text-brand-500 underline underline-offset-2"
      >
        ログインせずに使う（ゲスト）
      </button>
      <p className="mt-2 max-w-xs text-center text-[11px] font-bold text-ink/40">
        ログインしなくても学習できます。進捗はこの端末に保存され、QRコードで持ち運べます。
      </p>
    </div>
  )
}

// Firebase 未設定（config がダミーのまま）のときの案内。
export function UnconfiguredScreen() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 py-10 text-center">
      <div className="text-5xl">☁️</div>
      <h1 className="mt-3 font-display text-xl font-extrabold text-ink">クラウド保存を使えません</h1>
      <p className="mt-2 max-w-xs text-sm font-bold text-ink/60">
        この端末では、ログインして学習記録を保存する準備が終わっていません。
        端末への保存は、そのまま使えます。
      </p>
    </div>
  )
}
