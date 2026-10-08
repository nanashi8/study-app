// 疑問詞・関係詞の語の「文の中での働き」。働き（疑問詞・関係代名詞など）ごとに、意味・形・解説・例文と、
// その働きを説明している文法の参考書の単元を並べる。単語カードの裏と辞書ページで、意味のすぐ下に出す。
// 代表義の訳語の働き（main）も並べるので、代表義のどの訳語がどの働きの意味かが分かる。
import { LEVELS, getLevel } from '../data/levels.js'
import { GRAMMAR_ROLE_STYLES, GRAMMAR_ROLE_UNITS } from '../data/word-grammar-roles.js'
import { ArrowRight, BookOpen } from './Icons.jsx'
import { MeaningText } from './MeaningText.jsx'
import { ExplainedText } from './ExplainedText.jsx'
import { Chip, cx } from './ui.jsx'
import { PosBadge } from './WordBits.jsx'

function RoleBadge({ role }) {
  return (
    <span
      className={cx('inline-flex h-6 items-center rounded-md px-1.5 text-xs font-extrabold text-white', GRAMMAR_ROLE_STYLES[role] ?? 'bg-teal-600')}
      data-word-grammar-role-name
    >
      {role}
    </span>
  )
}

function GrammarRefLinks({ ids, onGrammarRef }) {
  const units = ids.filter((id) => GRAMMAR_ROLE_UNITS[id]).map((id) => ({ id, ...GRAMMAR_ROLE_UNITS[id] }))
  if (!units.length || !onGrammarRef) return null
  return (
    <div className="mt-2 space-y-1.5">
      {units.map((unit) => {
        const unitLevel = getLevel(unit.level)
        return (
          <button
            key={unit.id}
            type="button"
            onClick={() => onGrammarRef(unit.id)}
            className="flex min-h-11 w-full items-center gap-2 rounded-lg bg-white px-2.5 py-1.5 text-left ring-1 ring-teal-100 active:bg-teal-50"
            data-word-grammar-ref={unit.id}
          >
            <BookOpen size={15} className="shrink-0 text-teal-600" />
            {/* カードの裏は幅がせまいので、単元名に1行を使い、級はその下に小さく出す。 */}
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-extrabold text-teal-800">{`参考書「${unit.topic}」`}</span>
              <span className="block text-[10px] font-extrabold" style={{ color: unitLevel.color }}>{`英検${unitLevel.label}の単元`}</span>
            </span>
            <ArrowRight size={14} className="shrink-0 text-teal-300" />
          </button>
        )
      })}
    </div>
  )
}

/** 文の中での働き。働きのない語では何も出さない。 */
export function GrammarRoles({ word, onGrammarRef, className = '' }) {
  const roles = word?.grammarRoles ?? []
  if (!roles.length) return null
  const baseRank = LEVELS.findIndex((item) => item.id === word.level)
  return (
    <div className={cx('rounded-2xl bg-white p-4 ring-1 ring-teal-100', className)} data-word-grammar-roles>
      <div className="text-xs font-extrabold text-teal-700">{'文の中での働き'}</div>
      <ul className="mt-2 space-y-2.5">
        {roles.map((item) => {
          const itemLevel = getLevel(item.level)
          const ahead = baseRank >= 0 && LEVELS.findIndex((level) => level.id === item.level) > baseRank
          return (
            <li
              key={`${item.role}-${item.pos}-${item.meaning}`}
              className="rounded-xl bg-teal-50/60 p-3"
              data-word-grammar-role={item.role}
            >
              <div className="flex flex-wrap items-center gap-1.5">
                <PosBadge pos={item.pos} />
                <RoleBadge role={item.role} />
                <Chip color={itemLevel.color}>{`英検${itemLevel.label}`}</Chip>
                {ahead && (
                  <span className="text-[11px] font-bold text-ink/45">{'この先の級で出てくる'}</span>
                )}
              </div>
              <p className="mt-1.5 text-base font-extrabold text-ink"><ExplainedText>{item.meaning}</ExplainedText></p>
              {/* 品詞の「形」（形容詞）と取り違えないよう、文の形は「語順」と呼ぶ。 */}
              {item.form && (
                <p className="mt-1 text-xs font-bold leading-relaxed text-teal-900/80" data-word-grammar-role-form>
                  <span className="mr-1.5 rounded bg-teal-100 px-1.5 py-0.5 text-[10px] font-extrabold text-teal-800">{'語順'}</span>
                  <ExplainedText>{item.form}</ExplainedText>
                </p>
              )}
              <p className="mt-1.5 text-sm font-bold leading-relaxed text-ink/75"><ExplainedText>{item.explain}</ExplainedText></p>
              {item.example && (
                <div className="mt-2 rounded-lg bg-white/80 p-2.5">
                  <p className="text-sm font-bold text-ink" data-explain-exempt="例文">{item.example.en}</p>
                  <p className="mt-0.5 text-xs font-bold text-ink/55" data-explain-exempt="例文"><MeaningText>{item.example.ja}</MeaningText></p>
                </div>
              )}
              <GrammarRefLinks ids={item.grammar ?? []} onGrammarRef={onGrammarRef} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
