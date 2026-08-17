import { useEffect, useMemo, useRef, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import jsQR from 'jsqr'
import { useStore } from '../store/useStore.js'
import { LEVELS } from '../data/levels.js'
import {
  ETYMOLOGY_MODE_META,
  ETYMOLOGY_PACKS,
  getWord,
  wordsByLevel,
} from '../data/vocab.js'
import { etymologyProgress } from '../lib/etymologyProgress.js'
import { overallProgress } from '../lib/session.js'
import {
  LEARNING_CONTENT_GROUPS,
  buildLearningContentProgress,
} from '../lib/learningContentProgress.js'
import { summarizeSrsItems } from '../lib/contentProgress.js'
import {
  decodeProgress,
  selectProgressState,
  summarizePayload,
} from '../lib/progressCode.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { LearningAnalyticsPanel } from '../components/LearningAnalytics.jsx'
import { ProgressBackupPanel } from '../components/ProgressBackup.jsx'
import { Sheet } from '../components/Sheet.jsx'
import { Card, Button } from '../components/ui.jsx'
import {
  LearningStatusBars,
  StatusDistributionBar,
} from '../components/LearningStatusBars.jsx'
import { Upload } from '../components/Icons.jsx'

function RecordSummary({ stats, progress, analytics }) {
  const accuracy = stats.answered
    ? `${Math.round((stats.correct / stats.answered) * 100)}%`
    : '—'
  const learning = progress?.learning ?? {}
  const quiz = progress?.quiz ?? {}
  const total = progress?.total ?? 0
  return (
    <section className="overflow-hidden rounded-xl border-2 border-slate-700 bg-white" aria-label="学習記録票の基本情報">
      <div className="flex items-center justify-between gap-3 border-b border-slate-300 bg-slate-800 px-4 py-3 text-white">
        <div>
          <p className="text-[10px] font-extrabold tracking-[0.18em] text-slate-300">STUDENT LEARNING RECORD</p>
          <h2 className="font-display text-lg font-extrabold">学習記録票</h2>
        </div>
        <span className="whitespace-nowrap border border-slate-500 px-2 py-1 text-[10px] font-extrabold">端末集計</span>
      </div>
      <table className="w-full table-fixed border-collapse text-[10px] sm:text-xs" data-progress-record-summary>
        <tbody>
          {[
            ['英単語 学習済', `${learning.learned ?? 0}/${total}`, '英単語 復習中', `${learning.reviewing ?? 0}/${total}`],
            ['英単語 未学習', `${learning.unlearned ?? 0}/${total}`, 'クイズ 正解', `${quiz.correct ?? 0}/${total}`],
            ['クイズ 不正解', `${quiz.incorrect ?? 0}/${total}`, 'クイズ 未回答', `${quiz.unanswered ?? 0}/${total}`],
            ['累計回答', stats.answered.toLocaleString(), '累計正答率', accuracy],
            ['分析入力', `${analytics?.inputs ?? 0}件`, '連続学習', `${stats.streak}日`],
          ].map(([leftLabel, leftValue, rightLabel, rightValue]) => (
            <tr key={leftLabel} className="border-b border-slate-200 last:border-0">
              <th className="w-[24%] bg-slate-100 px-1 py-2 text-left font-extrabold text-slate-600 [word-break:keep-all] sm:px-2">{leftLabel}</th>
              <td className="w-[26%] px-1 py-2 text-right font-extrabold tracking-tight tabular-nums text-slate-950 sm:px-2">{leftValue}</td>
              <th className="w-[24%] bg-slate-100 px-1 py-2 text-left font-extrabold text-slate-600 [word-break:keep-all] sm:px-2">{rightLabel}</th>
              <td className="w-[26%] px-1 py-2 text-right font-extrabold tracking-tight tabular-nums text-slate-950 sm:px-2">{rightValue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

function AllContentStatus({ contents, onOpen }) {
  return (
    <Card className="overflow-hidden rounded-xl border-slate-300 p-0 shadow-none" data-all-content-status>
      <div className="border-b border-slate-300 bg-slate-100 px-3 py-2.5">
        <h2 className="font-display text-base font-extrabold text-slate-950">全教材・3区分進捗表</h2>
        <p className="text-[10px] font-bold text-slate-500">学習の自己判定とクイズの直近結果を別々に集計</p>
      </div>
      <div className="divide-y divide-slate-200">
        {LEARNING_CONTENT_GROUPS.map((group) => (
          <section key={group.id} className="p-3" aria-labelledby={`record-group-${group.id}`}>
            <h3 id={`record-group-${group.id}`} className="mb-2 text-xs font-extrabold text-slate-700">{group.label}</h3>
            <div className="space-y-3">
              {contents.filter((content) => content.group === group.id).map((content) => (
                <div key={content.id} className="rounded-xl border border-slate-200 bg-white p-3" data-record-content={content.id}>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-extrabold text-slate-900">{content.label}</p>
                      <p className="text-[9px] font-bold text-slate-400">全{content.progress.total.toLocaleString('ja-JP')}{content.unit}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpen(content)}
                      className="min-h-9 rounded-lg border border-slate-300 px-2 text-[10px] font-extrabold text-slate-700 active:bg-slate-50"
                    >
                      開く
                    </button>
                  </div>
                  <LearningStatusBars progress={content.progress} compact />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Card>
  )
}

export function ProgressScreen() {
  const navigate = useStore((s) => s.navigate)
  const srs = useStore((s) => s.srs)
  const stats = useStore((s) => s.stats)
  // 進捗コードは全データを持ち運ぶため、永続スライスをまとめて購読する。
  // 共有セレクタを使い、項目追加時も画面だけ購読漏れにならないようにする。
  const full = useStore(useShallow(selectProgressState))
  const importCode = useStore((s) => s.importCode)

  const prog = overallProgress(srs)
  const etymology = useMemo(
    () => etymologyProgress(ETYMOLOGY_PACKS, full.etymologySrs),
    [full.etymologySrs],
  )
  const contentProgress = useMemo(() => buildLearningContentProgress(full), [full])
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(null) // {summary} 確認シート
  const fileInput = useRef(null)
  const summarize = (payload) => summarizePayload(payload, (id) => !!getWord(id))

  // 保存したQR画像を選んで読み込む。画像をcanvasに描いてjsQRでデコード→
  // 中身（URL or 生コード）からEQ1-コードを取り出し、貼り付けたときと同じ
  // プレビュー確認フローに乗せる（勝手に上書きはしない）。
  const onPickQrImage = async (e) => {
    setError('')
    const file = e.target.files?.[0]
    e.target.value = '' // 同じ画像を続けて選べるようにクリア
    if (!file) return
    try {
      const bitmap = await createImageBitmap(file)
      const canvas = document.createElement('canvas')
      canvas.width = bitmap.width
      canvas.height = bitmap.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(bitmap, 0, 0)
      const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const result = jsQR(data, width, height)
      if (!result) {
        setError('画像からQRコードを読み取れませんでした。別の画像で試してください。')
        return
      }
      // QRの中身はURL（#code=EQ1-...）か、生のEQ1-コード。どちらからも取り出す。
      const m = result.data.match(/(EQ1-[^&\s]+)/)
      if (!m) {
        setError('このQRコードはえいごクエストの進捗コードではないようです。')
        return
      }
      const incoming = decodeURIComponent(m[1])
      const payload = decodeProgress(incoming)
      setInput(incoming)
      setPreview({ summary: summarize(payload) })
    } catch {
      setError('画像の読み込みに失敗しました。')
    }
  }

  const tryLoad = () => {
    setError('')
    try {
      const payload = decodeProgress(input)
      setPreview({ summary: summarize(payload) })
    } catch (e) {
      setError(e.message || 'コードを読み込めませんでした。')
    }
  }

  const confirmLoad = () => {
    try {
      importCode(input)
      setPreview(null)
      setInput('')
      setError('')
    } catch (e) {
      setError(e.message || '復元に失敗しました。')
      setPreview(null)
    }
  }

  const openContent = (content) => {
    if (content.id.startsWith('kanbun-') && content.id !== 'kanbun-kundoku') {
      navigate(content.screen, { domain: content.id.replace('kanbun-', '') })
      return
    }
    navigate(content.screen)
  }

  // QRのURL（#code=...）で開かれたら、そのコードを読み込んで復元確認を出す。
  // 勝手に上書きしないよう、必ずプレビュー→本人の確認を挟む。
  useEffect(() => {
    const m = location.hash.match(/[#&]code=(EQ1-[^&]+)/)
    if (!m) return
    const incoming = decodeURIComponent(m[1])
    // 再読み込みで再発火しないよう、ハッシュは消す。
    history.replaceState(null, '', location.pathname + location.search)
    try {
      const payload = decodeProgress(incoming)
      setInput(incoming)
      setPreview({ summary: summarize(payload) })
    } catch {
      /* 壊れたコードは無視（通常の画面のまま） */
    }
  }, [])

  return (
    <div className="pb-6">
      <ScreenHeader title="学習の記録" />

      <div className="space-y-5 px-4">
        <RecordSummary
          stats={stats}
          progress={contentProgress.find((content) => content.id === 'vocab')?.progress}
          analytics={full.learningAnalytics}
        />

        <LearningAnalyticsPanel
          progressState={full}
          learningAnalytics={full.learningAnalytics}
          srs={srs}
          etymologySrs={full.etymologySrs}
          kotenSrs={full.kotenSrs}
          kotenGrammarSrs={full.kotenGrammarSrs}
          kotenCultureSrs={full.kotenCultureSrs}
          kotenInterpretationSrs={full.kotenInterpretationSrs}
          kanbunVocabSrs={full.kanbunVocabSrs}
          kanbunGrammarSrs={full.kanbunGrammarSrs}
          kanbunCultureSrs={full.kanbunCultureSrs}
          kanbunKundokuSrs={full.kanbunKundokuSrs}
          skillStats={full.skillStats}
          diagnosticHistory={full.diagnosticHistory}
          stats={stats}
          dueCount={prog.due}
          onOpenDiagnostic={() => navigate('diagnostic')}
          onNavigate={(screen, params) => navigate(screen, params)}
        />

        <AllContentStatus contents={contentProgress} onOpen={openContent} />

        {/* 級別の進捗 */}
        <Card className="overflow-hidden rounded-xl border-slate-300 p-0 shadow-none">
          <div className="border-b border-slate-300 bg-slate-100 px-3 py-2.5">
            <h2 className="font-display text-base font-extrabold text-slate-950">英検級別・履修状況表</h2>
            <p className="text-[10px] font-bold text-slate-500">英単語SRSを級別に集計</p>
          </div>
          <div className="divide-y divide-slate-200" data-level-progress-table>
            {LEVELS.map((level) => {
              const progress = summarizeSrsItems(wordsByLevel(level.id), srs)
              return (
                <div key={level.id} className="space-y-2.5 p-3">
                  <h3 className="text-xs font-extrabold text-slate-800">{level.emoji} {level.label}</h3>
                  <StatusDistributionBar kind="learning" counts={progress.learning} compact />
                  <StatusDistributionBar kind="quiz" counts={progress.quiz} compact />
                </div>
              )
            })}
          </div>
        </Card>

        {/* 語源知識は単語SRSとは分け、部品式・語根・語族ごとの進み具合を示す。 */}
        <Card className="overflow-hidden rounded-xl border-slate-300 p-0 shadow-none">
          <div className="flex items-start justify-between gap-3 border-b border-slate-300 bg-slate-100 px-3 py-2.5">
            <div>
              <h2 className="font-display text-base font-extrabold text-slate-950">語源知識・履修状況表</h2>
              <p className="text-[10px] font-bold text-slate-500">単語SRSとは別集計・全{etymology.total}項目</p>
            </div>
            <span className="border border-slate-300 bg-white px-2 py-1 text-[10px] font-extrabold text-slate-700">今日の復習 {etymology.due}</span>
          </div>
          <div className="divide-y divide-slate-200" data-etymology-progress-table>
            {Object.entries(ETYMOLOGY_MODE_META).map(([mode, meta]) => {
              const progress = summarizeSrsItems(
                ETYMOLOGY_PACKS.filter((pack) => pack.mode === mode),
                full.etymologySrs,
              )
              return (
                <div key={mode} className="space-y-2.5 p-3">
                  <h3 className="text-xs font-extrabold text-slate-800">{meta.emoji} {meta.label}</h3>
                  <StatusDistributionBar kind="learning" counts={progress.learning} compact />
                  <StatusDistributionBar kind="quiz" counts={progress.quiz} compact />
                </div>
              )
            })}
          </div>
          <div className="border-t border-slate-200 p-3">
            <Button full variant="secondary" onClick={() => navigate('roots')}>語源カードの進み具合を見る</Button>
          </div>
        </Card>

        {/* 進捗コード：発行 */}
        <Card className="p-4">
          <ProgressBackupPanel progressState={full} />
        </Card>

        {/* 進捗コード：読込 */}
        <Card className="p-4">
          <div className="mb-1 flex items-center gap-2 text-brand-600">
            <Upload size={18} />
            <h2 className="font-display text-base font-extrabold">進捗コードを読み込む</h2>
          </div>
          <p className="mb-3 text-xs font-bold text-ink/50">
            保存したQR画像を選ぶか、発行したコードを貼り付けて読み込むと、その時点から再開できます（今の進捗は上書きされます）。
          </p>

          {/* 保存したQR画像（アルバム/ファイル）を選んで読み込む */}
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPickQrImage}
          />
          <Button full variant="secondary" onClick={() => fileInput.current?.click()}>
            <Upload size={18} /> QR画像から読み込む
          </Button>

          <div className="my-3 flex items-center gap-2 text-[11px] font-bold text-ink/30">
            <span className="h-px flex-1 bg-ink/10" />または<span className="h-px flex-1 bg-ink/10" />
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="EQ1-...（コードを貼り付け）"
            className="h-24 w-full resize-none rounded-2xl bg-paper p-3 font-mono text-xs text-ink ring-1 ring-brand-100 placeholder:text-ink/30"
          />
          {error && <p className="mt-2 text-xs font-bold text-rose-500">{error}</p>}
          <Button full className="mt-2" variant="secondary" disabled={!input.trim()} onClick={tryLoad}>
            コードを読み込む
          </Button>
        </Card>
      </div>

      {/* 上書き確認 */}
      <Sheet open={!!preview} onClose={() => setPreview(null)} title="この内容で再開しますか？">
        {preview && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-brand-50 p-3 text-center">
                <div className="font-display text-2xl font-extrabold text-brand-700">{preview.summary.words}</div>
                <div className="text-[11px] font-bold text-ink/50">旧履歴がある単語</div>
              </div>
              <div className="rounded-2xl bg-brand-50 p-3 text-center">
                <div className="font-display text-2xl font-extrabold text-brand-700">{preview.summary.mastered}</div>
                <div className="text-[11px] font-bold text-ink/50">旧SRS段階4以上の単語</div>
              </div>
              <div className="rounded-2xl bg-violet-50 p-3 text-center">
                <div className="font-display text-2xl font-extrabold text-violet-700">{preview.summary.etymologyStarted}</div>
                <div className="text-[11px] font-bold text-ink/50">旧履歴がある語源</div>
              </div>
              <div className="rounded-2xl bg-violet-50 p-3 text-center">
                <div className="font-display text-2xl font-extrabold text-violet-700">{preview.summary.etymologyMastered}</div>
                <div className="text-[11px] font-bold text-ink/50">旧SRS段階4以上の語源</div>
              </div>
              <div className="rounded-2xl bg-hint-soft p-3 text-center">
                <div className="font-display text-2xl font-extrabold text-amber-700">{preview.summary.streak}</div>
                <div className="text-[11px] font-bold text-ink/50">連続学習（日）</div>
              </div>
              <div className="rounded-2xl bg-hint-soft p-3 text-center">
                <div className="font-display text-2xl font-extrabold text-amber-700">{preview.summary.notebookSaved}</div>
                <div className="text-[11px] font-bold text-ink/50">マイノート（問題集 {preview.summary.notebookSets}冊）</div>
              </div>
              <div className="rounded-2xl bg-violet-50 p-3 text-center">
                <div className="font-display text-2xl font-extrabold text-violet-700">{preview.summary.myGrammar}</div>
                <div className="text-[11px] font-bold text-ink/50">マイ文法</div>
              </div>
              <div className="rounded-2xl bg-cyan-50 p-3 text-center">
                <div className="font-display text-2xl font-extrabold text-cyan-700">{preview.summary.writing}</div>
                <div className="text-[11px] font-bold text-ink/50">完成した英作文</div>
              </div>
            </div>
            <p className="text-xs font-bold text-rose-500">
              ※ 現在のこの端末の進捗は上書きされます。心配な場合は先に「発行」で今のコードを保存してください。
            </p>
            <Button full onClick={confirmLoad}>この内容で再開する</Button>
            <Button full variant="ghost" onClick={() => setPreview(null)}>キャンセル</Button>
          </div>
        )}
      </Sheet>
    </div>
  )
}
