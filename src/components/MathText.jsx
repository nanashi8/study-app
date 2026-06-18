// KaTeX で数式を描画する小さなラッパ。
// - <MathBlock tex="x^2+1" />        … 中央寄せの大きな数式（displayMode）
// - <MathText>足して$5$かけて$6$</MathText> … 文章中の $...$ をインライン数式に
// KaTeX 記法の文字列をそのまま受け取る。throwOnError:false なので不正式でも崩れない。
import katex from 'katex'

const render = (tex, displayMode) =>
  katex.renderToString(tex ?? '', { throwOnError: false, displayMode })

export function MathBlock({ tex, className = '' }) {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: render(tex, true) }}
    />
  )
}

// 文章に混ぜず単体の数式断片をインライン描画する（タイル・空所の中身など）。
export function MathInline({ tex, className = '' }) {
  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: render(tex, false) }}
    />
  )
}

// 文字列を $...$ 区切りで「文章」と「数式」に分解する。
function splitInline(src) {
  const out = []
  const re = /\$([^$]+)\$/g
  let last = 0
  let m
  while ((m = re.exec(src))) {
    if (m.index > last) out.push({ math: false, s: src.slice(last, m.index) })
    out.push({ math: true, s: m[1] })
    last = m.index + m[0].length
  }
  if (last < src.length) out.push({ math: false, s: src.slice(last) })
  return out
}

export function MathText({ children, className = '' }) {
  const src = typeof children === 'string' ? children : ''
  const parts = splitInline(src)
  return (
    <span className={className}>
      {parts.map((p, i) =>
        p.math ? (
          <span
            key={i}
            dangerouslySetInnerHTML={{ __html: render(p.s, false) }}
          />
        ) : (
          <span key={i}>{p.s}</span>
        ),
      )}
    </span>
  )
}
