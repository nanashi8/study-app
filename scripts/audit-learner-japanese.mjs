import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourceRoot = path.join(projectRoot, 'src')
const japanesePattern = /[\u3040-\u30ff\u3400-\u9fff々]/u
const LEARNER_COPY_DATA_FILES = new Set([
  'src/data/contents.js',
])

// 中高生向け画面に出すと、意味を推測させたり、文のつながりを壊したりする表現。
// 単語の意味・本文・訳などの教材データは対象外とし、全JSXと画面用文章を作るlib全体を監査する。
const FORBIDDEN_GUIDANCE = [
  ['通常セッションは固定配分ではありません', '学習者に不要な出題アルゴリズムの説明'],
  ['教材データに個別ガイドを追加してください', '開発者向けの修正依頼を学習者へ見せている'],
  ['この問題の前後から判断できません', '教材側の不足ではなく、比べる対象を直接示す'],
  ['監査で検知します', '品質管理の内部手順を学習者へ見せている'],
  ['監査済みの意味', '品質管理の内部状態より、確認できる内容を具体的に示す'],
  ['未対応は0件', '品質管理の合格件数を学習者へ見せている'],
  ['自然な間・抑揚補正：すべての読み上げで有効', '変更できない音声処理を設定画面で説明している'],
  ['全体の受付語数で調整', '受付の内部処理ではなく利用者の行動を示す'],
  ['人が確認したカードだけ', '品質管理の内部手順を学習者へ見せている'],
  ['未確認の説明は学習画面へ出しません', '品質管理の内部方針ではなく、出典の確認方法を示す'],
  ['主人公は画面外', '画像制作上の制約を学習者へ見せている'],
  ['対戦・攻撃・HPの演出はありません', '廃止した演出の説明を学習者へ見せている'],
  ['固定された能力やIQ', '学習案内に不要な注意書きを重ねている'],
  ['医療検査や公式試験', '学習案内に関係の薄い注意書きを重ねている'],
  ['最新が「', '何の最新値か分からない'],
  ['最新が『', '何の最新値か分からない'],
  ['覚えた内容', '「覚えた」だけか「まだ」も含むか分からない'],
  ['今日に復習', '助詞が不自然'],
  ['明日に復習', '助詞が不自然'],
  ['今回の間隔アップ', '復習処理の変化を学生の成果として見せている'],
  ['長期定着へ到達', '内部の復習段階を学生の目標として見せている'],
  ['長期定着への到達', '内部の復習段階を学生の目標として見せている'],
  ['復習の段階', '保存上の段階番号を学生に見せている'],
  ['復習段階', '保存上の段階名を学生に見せている'],
  ['定着段階', '保存上の段階名を学生に見せている'],
  ['記憶段階', '保存上の段階名を学生に見せている'],
  ['よく覚えた段階', '内部のしきい値を学生の成果として見せている'],
  ['長く覚えている段階', '内部のしきい値を学生の状態として断定している'],
  ['まだ短い段階', '何が短いのか分からない'],
  ['定着を維持', '内部の並べ替え理由を学生向けの結果として見せている'],
  ['間隔復習', '専門的な学習方法を名詞で詰めている'],
  ['復習期限', '事務的な期限ではなく具体的な復習日を示す'],
  ['期限前の語', '「学習済みの語」や具体的な復習日で示す'],
  ['今日が期限', '「今日が復習日」と具体的に示す'],
  ['次の期限', '「次の復習日」と具体的に示す'],
  ['語が期限', '語そのものではなく復習する日を示す'],
  ['到達段階', '学年や目標など選択基準を具体的に示す'],
  ['到達レベル', '学年や難しさなど選択基準を具体的に示す'],
  ['優先度', '先にすることを動作で示す'],
  ['優先して復習', '「先に復習」で簡潔に示す'],
  ['復習優先', '「先に復習」で助詞を補う'],
  ['今回の得意', '助詞を省かず「今回よくできた分野」と示す'],
  ['定着推定', '何を計算した値か分からない'],
  ['定着度', '何を見た値か分からない'],
  ['学習効率', '正答や学習時間など実際に見る内容を示す'],
  ['覚えている見込み', '予測値を観測した結果のように見せている'],
  ['覚え具合', '正解・不正解・復習日など実際の記録を示す'],
  ['忘れやすさの予測', '予測値より実際の回答と復習日を示す'],
  ['復習しない場合の予測', '結果画面では次の行動を示す'],
  ['自動集計', '何を数えたかを具体的に示す'],
  ['直近7日', '「最近7日間」で具体的に示す'],
  ['旧履歴', '保存方式ではなく「以前の記録」と示す'],
  ['パーフェクト級', '日本語として不自然'],
  ['学習索引', '中高生向けの画面名として抽象的'],
  ['3区分進捗表', '仕組みをそのまま画面名にしている'],
  ['履修状況表', '学校事務のように堅い'],
  ['端末集計', '何を集計した値か伝わらない'],
  ['分析入力', '開発者向けの内部用語'],
  ['成績分析票', '学校事務のように堅い'],
  ['全進捗', '名詞を詰めた不自然な短縮'],
  ['反映済み', '処理状態だけを示す開発者向け表現'],
  ['先取り復習', '意味を補わない独自の短縮語'],
  ['取り出せるか', '記憶についての説明として不自然'],
  ['定着段階アップ', '日本語と英語を不自然に連結'],
  ['間隔アップ', '何が変わったか分からない'],
  ['多角的な学習処方箋', '医療用語を重ねた抽象的な見出し'],
  ['標本数', '学習記録の件数を統計用語で示している'],
  ['測定根拠', '中高生向け案内として堅い'],
  ['留意点', '中高生向け案内として堅い'],
  ['直近暗記判定', '名詞を詰めた不自然な短縮'],
  ['復習BOX', '内部の保存方式を画面へ出している'],
  ['SRS', '内部の復習方式を画面へ出している'],
  ['想起', '「思い出す」で伝えられる専門語'],
  ['収集中', '「記録を集めています」のように動作を明示する'],
  ['計測中', '何を待っているのか分からない'],
  ['見える化', '「分かるようにする」で伝えられる流行語'],
  ['伸びしろ', '具体的な復習対象が分からない'],
  ['級またぎ', '助詞を省いた不自然な短縮'],
  ['分野横断', '助詞を省いた不自然な短縮'],
  ['体系解説', '助詞を省いた不自然な短縮'],
  ['辞書照合', '処理名をそのまま案内にしている'],
  ['観測値', '学習結果に対する統計用語'],
  ['自己判定', '「覚えた／まだ」の記録と具体的に示す'],
  ['暗記周回', '暗記した回数をゲーム用語で示している'],
  ['照合', '「比べる」「確かめる」で伝えられる堅い語'],
  ['処方', '学習案を医療用語で示している'],
  ['再現率', 'このアプリでは正解率を指すため不明瞭'],
  ['同日反復', '助詞を省いた専門的な短縮'],
  ['後続テスト', '助詞を省いた専門的な短縮'],
  ['定着予測', '「覚えている見込み」で具体的に示す'],
  ['暗記判定', '「覚えた／まだ」の記録と具体的に示す'],
  ['対応が必要', '次に何をするかを具体的に示していない'],
  ['滞留なし', '学習者向け案内として事務的'],
  ['期限到来済み', '助詞を省いた事務的な短縮'],
  ['平均入力', '何を数えた値か分からない内部用語'],
  ['項目ID', '保存上の識別方法をそのまま画面へ出している'],
  ['項目別ID', '保存形式をそのまま画面へ出している'],
  ['セッション集計', '操作単位と集計方法を開発者用語で示している'],
  ['1セッション', '「1回の学習」で具体的に伝えられる'],
  ['読み上げコンソール', '「再生パネル」で役割を具体的に示す'],
  ['共通コンソール', '「再生パネル」で役割を具体的に示す'],
  ['スナップショット', '「今回の結果」で具体的に示す'],
  ['モデル推定値', '計算した目安であることが伝わりにくい'],
  ['回答履歴からの推定', '「これまでの回答から選んだ目安」と示す'],
  ['暗記時刻の効果', '因果を断定せず「正解しやすかった時刻」と示す'],
  ['まだ判定できません', '何を見れば判断できるか、今回の事実で示す'],
  ['期限到来', '「今日の復習」と具体的に示す'],
  ['中心義', '「基本の意味」で伝えられる専門語'],
  ['未収集', '「まだ記録がありません」と文で示す'],
  ['負荷を移す', '学習行動として何を増やすか分からない'],
  ['作業票', '学習者向け案内として事務的'],
  ['固定評価', '抽象的で説明を補わないと意味が伝わらない'],
  ['参考推定', '「計算した目安」で伝えられる'],
  ['アーカイブ', '「一覧」で役割を具体的に示す'],
  ['三手', '「三つの手順」で伝えられる独自の短縮語'],
  ['何周', '「何回」で伝えられる学習者向けでない数え方'],
  ['測定中', '何を待っているか分からない'],
  ['時刻効果', '助詞を省いた分析用語'],
  ['根拠を固定', '学習行動として何をするか分からない'],
  ['互換データ', '保存の内部事情をそのまま画面へ出している'],
  ['正常化', '何がどう直るのか分からない物語内の機械的表現'],
  ['もどる', '操作名は「戻る」に統一する'],
]

// 既知の重大な問題表現は、通常の画面案内だけでなく教材データを含むsrc全体でも再発を止める。
const SOURCE_WIDE_FORBIDDEN_GUIDANCE = [
  ['通常セッションは固定配分ではありません', '学習者に不要な出題アルゴリズムの説明'],
  ['最新が「', '主語が欠けた結果表示'],
  ['最新が『', '主語が欠けた結果表示'],
  ['今回の間隔アップ', '内部の復習処理を学生向け成果として表示'],
  ['長期定着へ到達', '内部のしきい値を学生向け成果として表示'],
  ['長期定着への到達', '内部のしきい値を学生向け成果として表示'],
]

const normalize = (value) => String(value ?? '')
  .replace(/\\[nrt]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(entries.map(async (entry) => {
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) return sourceFiles(target)
    return /\.(?:js|jsx)$/.test(entry.name) ? [target] : []
  }))
  return nested.flat()
}

function lineNumberAt(source, index) {
  let line = 1
  for (let cursor = 0; cursor < index; cursor += 1) {
    if (source[cursor] === '\n') line += 1
  }
  return line
}

function quotedJapanese(source) {
  const values = []
  let index = 0
  while (index < source.length) {
    const char = source[index]
    const next = source[index + 1]
    if (char === '/' && next === '/') {
      index += 2
      while (index < source.length && source[index] !== '\n') index += 1
      continue
    }
    if (char === '/' && next === '*') {
      index += 2
      while (index < source.length && !(source[index] === '*' && source[index + 1] === '/')) index += 1
      index += 2
      continue
    }
    if (char !== "'" && char !== '"' && char !== '`') {
      index += 1
      continue
    }

    const quote = char
    const start = index
    index += 1
    let raw = ''
    while (index < source.length) {
      const current = source[index]
      if (current === '\\') {
        raw += current
        raw += source[index + 1] ?? ''
        index += 2
        continue
      }
      if (current === quote) {
        index += 1
        break
      }
      raw += current
      index += 1
    }
    const text = normalize(raw)
    if (japanesePattern.test(text)) values.push({ text, line: lineNumberAt(source, start) })
  }
  return values
}

function sourceWithoutComments(source) {
  let output = ''
  let index = 0
  let quote = null
  while (index < source.length) {
    const char = source[index]
    const next = source[index + 1]
    if (quote) {
      output += char
      if (char === '\\') {
        output += next ?? ''
        index += 2
        continue
      }
      if (char === quote) quote = null
      index += 1
      continue
    }
    if (char === "'" || char === '"' || char === '`') {
      quote = char
      output += char
      index += 1
      continue
    }
    if (char === '/' && next === '/') {
      output += '  '
      index += 2
      while (index < source.length && source[index] !== '\n') {
        output += ' '
        index += 1
      }
      continue
    }
    if (char === '/' && next === '*') {
      output += '  '
      index += 2
      while (index < source.length && !(source[index] === '*' && source[index + 1] === '/')) {
        output += source[index] === '\n' ? '\n' : ' '
        index += 1
      }
      output += '  '
      index += 2
      continue
    }
    output += char
    index += 1
  }
  return output
}

function jsxJapanese(source) {
  const values = []
  const visibleSource = sourceWithoutComments(source)
  // JSX本文は改行や式の差し込みを含むため、タグまたは式の境界までを一続きで読む。
  // 1行だけを見る監査では、短い案内が改行されただけで監査対象から漏れてしまう。
  const pattern = /(?:>|\})([^<>{}]*[\u3040-\u30ff\u3400-\u9fff々][^<>{}]*)(?=<|\{)/gu
  for (const match of visibleSource.matchAll(pattern)) {
    const text = normalize(match[1])
    if (!text || /^(?:return|const|let|if|else)\b/.test(text)) continue
    values.push({ text, line: lineNumberAt(visibleSource, match.index) })
  }
  return values
}

function isLearnerSurface(relative) {
  return relative.endsWith('.jsx')
    || relative.startsWith('src/lib/')
    || LEARNER_COPY_DATA_FILES.has(relative)
}

export async function auditLearnerJapanese() {
  const files = await sourceFiles(sourceRoot)
  const allEntries = []
  const learnerEntries = []
  const learnerFiles = new Set()

  for (const file of files) {
    const source = await readFile(file, 'utf8')
    const relative = path.relative(projectRoot, file)
    const entries = [
      ...quotedJapanese(source),
      ...(relative.endsWith('.jsx') ? jsxJapanese(source) : []),
    ].map((entry) => ({ ...entry, file: relative }))
    allEntries.push(...entries)
    if (isLearnerSurface(relative)) {
      learnerFiles.add(relative)
      learnerEntries.push(...entries)
    }
  }

  const issueByKey = new Map()
  const recordIssue = (entry, forbidden, reason, scope) => {
    const key = `${entry.file}:${entry.line}:${forbidden}`
    if (!issueByKey.has(key)) issueByKey.set(key, { ...entry, forbidden, reason, scope })
  }
  for (const entry of learnerEntries) {
    for (const [forbidden, reason] of FORBIDDEN_GUIDANCE) {
      if (entry.text.includes(forbidden)) {
        recordIssue(entry, forbidden, reason, 'learner')
      }
    }
  }
  for (const entry of allEntries) {
    for (const [forbidden, reason] of SOURCE_WIDE_FORBIDDEN_GUIDANCE) {
      if (entry.text.includes(forbidden)) {
        recordIssue(entry, forbidden, reason, 'source')
      }
    }
  }

  return {
    sourceFiles: files.length,
    sourceJapaneseEntries: allEntries.length,
    sourceUniqueJapaneseEntries: new Set(allEntries.map((entry) => entry.text)).size,
    learnerFiles: learnerFiles.size,
    learnerJapaneseEntries: learnerEntries.length,
    learnerUniqueJapaneseEntries: new Set(learnerEntries.map((entry) => entry.text)).size,
    issues: [...issueByKey.values()],
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await auditLearnerJapanese()
  console.log(
    `日本語案内監査: 学習者画面 ${result.learnerFiles}ファイル・${result.learnerJapaneseEntries}表記`
    + `（重複なし${result.learnerUniqueJapaneseEntries}表記）／ソース全体 ${result.sourceFiles}ファイル・${result.sourceJapaneseEntries}表記`,
  )
  if (result.issues.length) {
    for (const issue of result.issues) {
      console.error(`${issue.file}:${issue.line}: 「${issue.forbidden}」— ${issue.reason}`)
    }
    console.error(`日本語案内監査エラー: ${result.issues.length}件`)
    process.exitCode = 1
  } else {
    console.log('日本語案内監査: エラー0件')
  }
}
