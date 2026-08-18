import { Component } from 'react'
import { Button } from './ui.jsx'
import { isChunkLoadError, reloadFresh, forceReloadFresh } from '../lib/appRecovery.js'

// 描画中の例外を受け止める境界。これが無いと React はツリー全体を捨ててしまい、
// 画面が真っ白（ホワイトアウト）になる。ここで受け止めて、必ず何かを表示する。
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null, reloading: false }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // 原因追跡用。ユーザーには下の画面だけが見える。
    console.error('画面の描画に失敗しました', error, info?.componentStack)
    // 古い HTML が消えた JS を読みに行った場合は、取り直せば直る。
    if (isChunkLoadError(error) && reloadFresh()) {
      this.setState({ reloading: true })
    }
  }

  // 画面を切り替えたら、前の画面のエラーを引きずらない。
  componentDidUpdate(prevProps) {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null, reloading: false })
    }
  }

  render() {
    const { error, reloading } = this.state
    if (!error) return this.props.children

    const chunk = isChunkLoadError(error)
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="text-4xl">🧩</div>
        <p className="text-base font-bold text-ink">
          {reloading
            ? '最新の状態に更新しています…'
            : chunk
              ? 'うまく読み込めませんでした'
              : 'この画面を表示できませんでした'}
        </p>
        {!reloading && (
          <p className="text-xs text-ink/60">
            {chunk
              ? '通信が不安定か、アプリが更新された可能性があります。'
              : '進んだ記録は残っています。もう一度ひらいてみてください。'}
          </p>
        )}
        {!reloading && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button onClick={forceReloadFresh}>再読み込み</Button>
            {this.props.onHome && (
              <Button variant="secondary" onClick={this.props.onHome}>
                ホームへ
              </Button>
            )}
          </div>
        )}
      </div>
    )
  }
}
