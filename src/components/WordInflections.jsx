import { inflectionsForWord } from '../lib/wordInflections.js'
import { inflectionPhoneticFor } from '../lib/inflectionSpeech.js'
import { PosBadge } from './PosBadge.jsx'
import { SpeakButton } from './SpeakButton.jsx'
import { cx } from './ui.jsx'

// 辞書のような「変化形」の欄。動詞の活用・名詞の複数形・形容詞と副詞の比較級を、品詞ごとに見出しつきで並べる。
// 暗記カードの裏と、辞書・一覧から開く詳細（どちらも WordStudyCard）に出す。
// 台帳は src/data/word-inflections.js（全見出し語を1語ずつ決めたもの）。
// 欄の英字はその見出し語自身の変化形（waters・respects など）で、意味は同じ文に書いてあるので、解説の英単語のリンクの検査から外す（data-explain-exempt）。
// 形ごとに発音ボタンを置く。端末の声が正しく読めない形（read の過去形など）は、音声を出さずに発音記号を見せる。

/** 形1つ：つづりと、発音ボタン（または発音記号）。 */
export function InflectionForm({ form, wordId, label }) {
  const phonetic = inflectionPhoneticFor(wordId, label, form.text)
  return (
    <span className="inline-flex items-center gap-1" data-inflection-form={form.text}>
      <span className="font-display font-extrabold text-ink">
        {form.british && <span className="mr-0.5 text-[10px] font-bold text-ink/45">《英》</span>}
        {form.text}
      </span>
      {phonetic ? (
        <span className="text-[11px] font-bold text-ink/50" data-inflection-phonetic>{phonetic}</span>
      ) : (
        <SpeakButton text={form.text} size="sm" title="変化形" className="!h-6 !w-6" />
      )}
    </span>
  )
}

function FormList({ forms, wordId, label }) {
  return (
    <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
      {forms.map((form) => (
        <InflectionForm key={`${form.text}-${form.british ? 'b' : 'a'}`} form={form} wordId={wordId} label={label} />
      ))}
    </span>
  )
}

export function WordInflections({ word, className = '' }) {
  const entries = inflectionsForWord(word)
  if (!entries.length) return null
  const silent = entries.some((entry) =>
    entry.rows.some((row) => row.forms.some((form) => inflectionPhoneticFor(word.id, row.label, form.text))))
  return (
    <div className={cx('rounded-2xl bg-white p-4 ring-1 ring-brand-100', className)} data-word-inflections={word.id} data-speech-group>
      <div className="mb-2 text-xs font-extrabold text-brand-500">変化形</div>
      <div className="space-y-2.5">
        {entries.map((entry) => (
          <div key={entry.pos} className="flex items-start gap-2" data-inflection-pos={entry.pos}>
            <PosBadge pos={entry.pos} />
            <div className="min-w-0 flex-1 space-y-1">
              {entry.baseOf && (
                <p className="text-sm font-bold text-ink/75" data-explain-exempt="変化形">
                  <span className="font-display font-extrabold text-ink">{entry.baseOf.word}</span> の{entry.baseOf.label}
                </p>
              )}
              {entry.rows.length > 0 && (
                <dl className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-1">
                  {entry.rows.map((row) => (
                    <div key={row.label} className="contents">
                      <dt className="text-[11px] font-extrabold text-ink/45">{row.label}</dt>
                      <dd className="text-sm">
                        <FormList forms={row.forms} wordId={word.id} label={row.label} />
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
              {entry.status && <p className="text-xs font-bold text-ink/55" data-explain-exempt="変化形">{entry.status}</p>}
              {entry.note && <p className="text-xs font-bold leading-relaxed text-amber-700/90" data-explain-exempt="変化形">{entry.note}</p>}
            </div>
          </div>
        ))}
      </div>
      {silent && (
        <p className="mt-2 text-[11px] font-bold leading-relaxed text-ink/50" data-inflection-silent-note>
          {'発音記号だけの形は、同じつづりで発音がちがう語があり、端末の声が読み違えるので音声を出しません。'}
        </p>
      )}
    </div>
  )
}
