import { useStore } from '../store/useStore.js'
import {
  idiomBelongsToFormFamily,
  idiomFormFamilyById,
  idiomFormFamilyFor,
  relatedIdiomForms,
} from '../data/idiom-form-families.js'
import { Button, cx } from './ui.jsx'

export function IdiomFormGuide({ item, familyId = null, returnTo = null, className = '' }) {
  const navigate = useStore((state) => state.navigate)
  const selectedFamily = idiomFormFamilyById(familyId)
  const family = selectedFamily && idiomBelongsToFormFamily(item, selectedFamily.id)
    ? selectedFamily
    : idiomFormFamilyFor(item)
  const related = relatedIdiomForms(item, 5, family?.id)
  if (!family || item?.kind !== 'idiom' || related.length === 0) return null

  const ids = family.memberIds
  const title = `${family.title}（${family.count}件）`
  const open = (screen) => (event) => {
    event.stopPropagation()
    navigate(screen, {
      source: { type: 'phraseList', ids },
      title,
      mode: screen === 'phraseStudy' ? 'study' : 'quiz',
      engine: 'phrase',
      idiomFormFamilyId: family.id,
      returnTo: returnTo ?? { screen: 'phrases', params: { kind: 'idiom', familyFilter: family.id } },
    })
  }

  return (
    <section
      className={cx('rounded-2xl bg-sky-50 p-4 ring-1 ring-sky-200', className)}
      data-idiom-form-guide
      data-idiom-form-id={family.id}
      aria-label={`${family.title}の比較`}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex flex-wrap items-center gap-2 text-sky-800">
        <span className="rounded-full bg-sky-600 px-2 py-1 text-[10px] font-extrabold text-white">
          同じ形で比べる
        </span>
        <h3 className="font-display text-sm font-extrabold">{family.title}</h3>
      </div>
      <p className="mt-2 text-xs font-bold leading-relaxed text-sky-950/75">{family.summary}</p>
      <p className="mt-2 rounded-xl bg-white/80 p-2.5 text-xs font-bold leading-relaxed text-ink/70 ring-1 ring-sky-100">
        見分け方：{family.decision}
      </p>
      <div className="mt-3 space-y-2" role="list" aria-label={`${family.title}の別の熟語`}>
        {related.map((candidate) => (
          <div key={candidate.id} className="rounded-xl bg-white p-3 ring-1 ring-sky-100" role="listitem">
            <p className="font-display text-xs font-extrabold text-sky-800">{candidate.phrase}</p>
            <p className="mt-0.5 text-xs font-bold text-ink/65">{candidate.meanings?.[0] ?? candidate.meaning}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button size="sm" variant="secondary" onClick={open('phraseStudy')}>この形を暗記</Button>
        <Button size="sm" onClick={open('phraseQuiz')}>この形をテスト</Button>
      </div>
    </section>
  )
}
