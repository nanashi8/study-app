// スクリプトを途中で止める（process.exit の代わり）。
// 2026-11-11、Node 25 は process.exit の途中で、裏のコンパイル用スレッドの終了を待ったまま止まることがあると分かった
// （全教材監査が開始3秒で固まり、7時間そのままだった。836回に6回）。ふつうに終わる（最後まで流れる）ときは固まらない。
// そこで scripts/ と tests/ では process.exit を呼ばない（tests/no-process-exit.test.mjs が止める）。
//   最後に終わるところ：process.exitCode = 1
//   途中で止めるところ：stop(1)（終了コードを入れて、止めるための印つきの例外を投げる。印つきの例外は表示せずに捨て、
//                       ほかに待っているものがなければ、そのままふつうに終わる）
// 印のない本物の例外は、今までどおり表示して終了コード 1 にする。
// try の中で stop() を呼ぶと、その catch に捕まる。catch で isStop(error) なら投げ直す。
const STOP = Symbol.for('study-app.stop')

let listening = false

/** 終了コードを入れて止める。 */
export function stop(code = 1) {
  // 受け口は初めて止めるときに付ける（部品として読み込むだけのテストの、例外の扱いを変えない）。
  if (!listening) {
    listening = true
    process.on('uncaughtException', (error) => {
      if (error?.[STOP]) return
      console.error(error)
      process.exitCode = 1
    })
  }
  process.exitCode = code
  throw Object.assign(new Error(`stop(${code})`), { [STOP]: true })
}

/** stop() が投げた例外か。 */
export const isStop = (error) => Boolean(error?.[STOP])
