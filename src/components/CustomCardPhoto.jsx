import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useStore } from '../store/useStore.js'
import { ALL_WORDS } from '../data/vocab.js'
import { getLevel } from '../data/levels.js'
import { ScreenHeader } from './AppShell.jsx'
import { CategorySelect, NEW_CATEGORY_OPTION, TemplateChooser } from './CustomCardForm.jsx'
import { PhotoOcrPicker, usePhotoOcr } from './PhotoOcrPicker.jsx'
import { Button, Card, cx } from './ui.jsx'
import { ArrowRight, Check, Refresh } from './Icons.jsx'
import { activeNotebookSetId } from '../lib/learningNotebook.js'
import { createContextReading } from '../lib/ocrContext.js'
import { ocrTokenConfidences } from '../lib/vocabOcr.js'
import {
  CUSTOM_CARD_LIMITS,
  CUSTOM_CARD_TEMPLATE_IDS,
  CUSTOM_SUBJECT_BY_ID,
  DEFAULT_CATEGORY_ID,
  ENGLISH_TEMPLATE_ID,
  categoryTitle,
  customCategoryChoices,
  defaultTemplateFor,
  subjectCategoryId,
} from '../lib/customCards.js'
import { CUSTOM_WORD_LIMITS, CUSTOM_WORD_POS } from '../lib/customWords.js'
import {
  buildPhotoCardCandidates,
  existingPhotoKeys,
  photoCandidateIssues,
  photoEntryValues,
  photoFieldLabels,
  photoFrontKey,
  photoRowConfidences,
  photoRowsFromLines,
  photoTextFromRows,
} from '../lib/customCardsPhoto.js'

// 自作カードの「写真から作る」。単語表・プリント・ノートの写真を読み取り、1行を1枚のカードの候補（表・裏）にして、
// 選んだ候補を選んだ分類・テンプレートのカードとしてまとめて登録する。候補の表・裏は登録の前に直せる。
// 読み取りは「教科書から単語追加」と同じ部品（PhotoOcrPicker.jsx）、候補の作り方は lib/customCardsPhoto.js。

const POS_LABEL_BY_ID = Object.fromEntries(CUSTOM_WORD_POS.map((pos) => [pos.id, pos.label]))
const NOTEBOOK_ITEMS_PER_BOOK = 500
const inputClass = 'h-11 w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 text-sm font-bold text-ink outline-none focus:border-brand-500 disabled:bg-slate-50 disabled:text-ink/50'
const selectClass = 'mt-1 h-11 w-full rounded-lg border border-slate-300 bg-white px-2 text-sm font-bold text-ink outline-none focus:border-brand-500'

const TEMPLATE_HINT = Object.freeze({
  english: '英語と日本語が並ぶ行は、英語を単語、日本語を意味にします。英文の中の語は、辞書の意味を入れた候補にします（登録する語を選びます）。',
  qa: '1行を1枚にします。「？」の後ろか、空白・「：」の後ろを答えにします。「？」で終わる行は、次の行を答えにします。',
  other: '1行を1枚にします。左右に離れた文字や、空白・「：」の後ろを意味にします。',
})

const scopeTitle = (subject, title) => (subject ? `${CUSTOM_SUBJECT_BY_ID[subject].label}の${title}` : title)

function useCustomLibrary() {
  return useStore(useShallow((state) => ({
    words: state.customWords,
    cards: state.customCards,
    categories: state.customCategories,
  })))
}

/** 候補1枚の下に出す、品詞・級・発音記号（英単語）や品詞・活用（古文単語）。登録するとカードに入る。 */
function candidateDetails(candidate, template) {
  if (template === ENGLISH_TEMPLATE_ID) {
    return [
      candidate.posId ? POS_LABEL_BY_ID[candidate.posId] : null,
      candidate.level ? `英検${getLevel(candidate.level).label}` : null,
      candidate.phonetic || null,
    ].filter(Boolean).join('・')
  }
  return candidate.pos ? `品詞・活用：${candidate.pos}` : ''
}

/** 最初は選ばない理由や、候補の出どころの知らせ。 */
function candidateNotes(candidate, { issues, existing }) {
  const notes = []
  if (candidate.saved) return [{ tone: 'saved', text: '登録しました' }]
  if (issues.overflow.length) notes.push({ tone: 'error', text: `${issues.overflow.join('、')}です。直すと登録できます。` })
  if (issues.missing.length) notes.push({ tone: 'warn', text: `${issues.missing.join('と')}を入れると登録できます。` })
  if (existing) notes.push({ tone: 'warn', text: 'この分類にもうあります。' })
  if (candidate.uncertain) notes.push({ tone: 'warn', text: '読み取りが不確かです。写真で確かめてから選んでください。' })
  if (candidate.rejected) notes.push({ tone: 'info', text: '英単語として確かめられませんでした（人名・地名や読み違いのことがあります）。' })
  if (candidate.listed) notes.push({ tone: 'info', text: '辞書にない英単語です。' })
  const observed = candidate.observed
    .filter((surface) => photoFrontKey(ENGLISH_TEMPLATE_ID, surface) !== photoFrontKey(ENGLISH_TEMPLATE_ID, candidate.front))
    .join('・')
  if (observed && !candidate.rejected) {
    notes.push({
      tone: 'info',
      text: `${observed} → ${candidate.front}${candidate.corrected ? '（読み違いを直しました）' : candidate.split ? '（続けて読まれた語を分けました）' : ''}`,
    })
  }
  if (candidate.meaningFrom === 'dictionary' && !candidate.backEdited) notes.push({ tone: 'muted', text: '意味は辞書から入れました。' })
  return notes
}

const NOTE_TONE = Object.freeze({
  saved: 'text-emerald-700',
  error: 'text-rose-600',
  warn: 'text-amber-700',
  info: 'text-brand-600',
  muted: 'text-ink/45',
})

function PhotoCandidateRow({ candidate, number, template, labels, checked, existing, onToggle, onChange }) {
  const issues = photoCandidateIssues(candidate, template)
  const details = candidateDetails(candidate, template)
  const notes = candidateNotes(candidate, { issues, existing })
  const frontLimit = template === ENGLISH_TEMPLATE_ID ? CUSTOM_WORD_LIMITS.word : CUSTOM_CARD_LIMITS.front
  return (
    <li
      className={cx(
        'rounded-2xl p-3 shadow-sm ring-1',
        candidate.saved ? 'bg-emerald-50/70 ring-emerald-100' : checked ? 'bg-white ring-brand-200' : 'bg-white/60 ring-ink/5',
      )}
      data-custom-photo-candidate={candidate.key}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={checked}
          disabled={candidate.saved || issues.blocked}
          onChange={onToggle}
          aria-label={`${number}枚目を登録する`}
          className="mt-3 h-5 w-5 shrink-0 accent-indigo-600"
          data-custom-photo-check
        />
        <div className="min-w-0 flex-1 space-y-1.5">
          <input
            value={candidate.front}
            onChange={(event) => onChange({ front: event.target.value })}
            disabled={candidate.saved}
            aria-label={`${number}枚目の${labels.front}`}
            placeholder={labels.front}
            className={cx(inputClass, 'font-display text-base font-extrabold')}
            maxLength={Math.max(frontLimit, candidate.front.length)}
            data-custom-photo-front
          />
          <input
            value={candidate.back}
            onChange={(event) => onChange({ back: event.target.value, backEdited: true })}
            disabled={candidate.saved}
            aria-label={`${number}枚目の${labels.back}`}
            placeholder={`${labels.back}を入れる`}
            className={inputClass}
            data-custom-photo-back
          />
          {details && <p className="text-[11px] font-bold text-ink/50" data-custom-photo-details>{details}</p>}
          {notes.map((note) => (
            <p key={note.text} className={cx('text-[11px] font-bold leading-relaxed', NOTE_TONE[note.tone])} data-custom-photo-note={note.tone}>
              {note.text}
            </p>
          ))}
        </div>
      </div>
    </li>
  )
}

export function CustomCardPhotoView({ subject, categoryId, templateId }) {
  const library = useCustomLibrary()
  const { wordBookSets, activeBookId } = useStore(useShallow((state) => ({
    wordBookSets: state.learningNotebook.sets,
    // 登録と同時に入れる単語帳は、はじめは単語帳ボタンの登録先（カードを作る画面と同じ）。
    activeBookId: activeNotebookSetId(state.learningNotebook),
  })))
  const navigate = useStore((state) => state.navigate)
  const addCustomEntries = useStore((state) => state.addCustomEntries)
  const saveCustomCategory = useStore((state) => state.saveCustomCategory)
  const setNotebookSetItems = useStore((state) => state.setNotebookSetItems)
  const ocr = usePhotoOcr({ readingStatus: '写真の文字を読み取り中…' })
  const base = subject ? { subject } : {}

  const [category, setCategory] = useState(() => {
    if (customCategoryChoices(library.categories).some((choice) => choice.id === categoryId)) return categoryId
    return subject ? subjectCategoryId(subject) : DEFAULT_CATEGORY_ID
  })
  const [template, setTemplate] = useState(() => (
    CUSTOM_CARD_TEMPLATE_IDS.includes(templateId) ? templateId : defaultTemplateFor(library.categories, category)
  ))
  const [templateTouched, setTemplateTouched] = useState(CUSTOM_CARD_TEMPLATE_IDS.includes(templateId))
  const [newCategoryTitle, setNewCategoryTitle] = useState('')
  const [chosenBookId, setChosenBookId] = useState(null)
  // 読み取った文字（1行が1枚）と、候補を作るのに使う読み取りの情報（行と語の確からしさ・英単語の表・品詞の道具）。
  const [text, setText] = useState('')
  const [textChanged, setTextChanged] = useState(false)
  const [reading, setReading] = useState(null)
  const [result, setResult] = useState(null)
  const [selected, setSelected] = useState(() => new Set())
  const [notice, setNotice] = useState(null)
  const [error, setError] = useState('')
  const bookId = chosenBookId ?? activeBookId ?? ''
  const labels = photoFieldLabels(template)
  const existingKeys = existingPhotoKeys(library, category, template)
  const isExisting = (candidate) => existingKeys.has(photoFrontKey(template, candidate.front))
  const candidates = result?.candidates ?? []

  const rebuild = (nextText, nextTemplate, nextCategory, info) => {
    const built = buildPhotoCardCandidates(nextText, {
      template: nextTemplate,
      words: ALL_WORDS,
      englishWords: info?.englishWords ?? null,
      tokenConfidences: info?.tokenConfidences ?? new Map(),
      rowConfidences: info?.rowConfidences ?? new Map(),
      contextReading: info?.tagger ? (joined) => createContextReading(info.tagger, joined, ALL_WORDS) : null,
    })
    const existing = existingPhotoKeys(library, nextCategory, nextTemplate)
    setResult(built)
    setSelected(new Set(built.candidates
      .filter((candidate) => candidate.suggested
        && !existing.has(photoFrontKey(nextTemplate, candidate.front))
        && !photoCandidateIssues(candidate, nextTemplate).blocked)
      .map((candidate) => candidate.key)))
    setTextChanged(false)
    setNotice(null)
    setError('')
  }

  const changeTemplate = (next) => {
    setTemplate(next)
    setTemplateTouched(true)
    if (result) rebuild(text, next, category, reading)
  }
  const changeCategory = (next) => {
    setCategory(next)
    // テンプレートをまだ選んでいなければ、分類の最初のテンプレートに合わせる（カードを作る画面と同じ）。
    if (!templateTouched && next !== NEW_CATEGORY_OPTION) {
      const nextTemplate = defaultTemplateFor(library.categories, next)
      if (nextTemplate !== template) {
        setTemplate(nextTemplate)
        if (result) rebuild(text, nextTemplate, next, reading)
        return
      }
    }
    if (!result) return
    // 同じ候補のまま分類だけ替えた：移し先にある語は選びを外し、元の分類にあったので選ばなかった語は選ぶ（ほかの選びはそのまま）。
    const before = existingPhotoKeys(library, category, template)
    const after = existingPhotoKeys(library, next, template)
    setSelected((current) => {
      const selection = new Set(current)
      for (const candidate of candidates) {
        if (candidate.saved) continue
        const key = photoFrontKey(template, candidate.front)
        if (after.has(key)) selection.delete(candidate.key)
        else if (before.has(key) && candidate.suggested && !photoCandidateIssues(candidate, template).blocked) selection.add(candidate.key)
      }
      return selection
    })
  }

  const clearResults = () => {
    setText('')
    setReading(null)
    setResult(null)
    setSelected(new Set())
    setNotice(null)
    setError('')
  }

  const scan = async () => {
    if (!ocr.file || ocr.scanning) return
    clearResults()
    const read = await ocr.scan()
    if (!read) return
    const rows = photoRowsFromLines(read.page.lines)
    const nextText = photoTextFromRows(rows)
    const info = {
      rowConfidences: photoRowConfidences(rows),
      tokenConfidences: ocrTokenConfidences(read.page.words),
      englishWords: read.englishWords,
      tagger: read.tagger,
    }
    setReading(info)
    setText(nextText)
    rebuild(nextText, template, category, info)
  }

  const updateCandidate = (key, patch) => {
    const before = candidates.find((candidate) => candidate.key === key)
    if (!before) return
    const after = { ...before, ...patch }
    setResult((current) => ({
      ...current,
      candidates: current.candidates.map((candidate) => (candidate.key === key ? after : candidate)),
    }))
    // 足りなかった欄を書き入れたら選び、登録できなくなったら選びを外す。
    const beforeIssues = photoCandidateIssues(before, template)
    const afterIssues = photoCandidateIssues(after, template)
    setSelected((current) => {
      const next = new Set(current)
      if (afterIssues.blocked) next.delete(key)
      else if (beforeIssues.blocked && !existingKeys.has(photoFrontKey(template, after.front))) next.add(key)
      return next
    })
  }

  const toggle = (key) => setSelected((current) => {
    const next = new Set(current)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    return next
  })

  const ready = candidates.filter((candidate) => (
    selected.has(candidate.key) && !candidate.saved && !photoCandidateIssues(candidate, template).blocked
  ))
  const selectable = candidates.filter((candidate) => (
    !candidate.saved && !isExisting(candidate) && !photoCandidateIssues(candidate, template).blocked
  ))
  const newCategoryMissing = category === NEW_CATEGORY_OPTION && !newCategoryTitle.trim()

  const register = () => {
    if (!ready.length) return
    let target = category
    if (category === NEW_CATEGORY_OPTION) {
      const created = saveCustomCategory({ title: newCategoryTitle, subject, template })
      if (created.status !== 'saved') {
        setError(created.status === 'full'
          ? `カテゴリーは${CUSTOM_CARD_LIMITS.categories}個までです。`
          : '新しいカテゴリーの名前を入れてください。')
        return
      }
      target = created.id
      setCategory(created.id)
      setNewCategoryTitle('')
    }
    const saved = addCustomEntries({ template, category: target, entries: ready.map((candidate) => photoEntryValues(candidate, template)) })
    const savedKeys = new Set(ready.filter((_, at) => saved.ids[at]).map((candidate) => candidate.key))
    const savedIds = saved.ids.filter(Boolean)
    let bookMissed = 0
    const book = wordBookSets.find((set) => set.id === bookId) ?? null
    if (book && savedIds.length) {
      const domain = saved.kind === 'word' ? 'vocab' : 'customCards'
      setNotebookSetItems(book.id, domain, savedIds, true)
      const refs = useStore.getState().learningNotebook.sets.find((set) => set.id === book.id)?.refs ?? []
      bookMissed = savedIds.filter((id) => !refs.includes(`${domain}:${id}`)).length
    }
    setResult((current) => ({
      ...current,
      candidates: current.candidates.map((candidate) => (savedKeys.has(candidate.key) ? { ...candidate, saved: true } : candidate)),
    }))
    setSelected((current) => new Set([...current].filter((key) => !savedKeys.has(key))))
    setError('')
    setNotice({
      category: target,
      text: [
        `${savedIds.length}枚を「${categoryTitle(useStore.getState().customCategories, target)}」に登録しました。`,
        saved.fullCount
          ? `上限（英単語のカード${CUSTOM_WORD_LIMITS.words}語・カード${CUSTOM_CARD_LIMITS.cards}枚）のため、${saved.fullCount}枚は登録できませんでした。`
          : '',
        saved.invalidCount
          ? `${saved.invalidCount}枚は${labels.front}か${labels.back}が空のため登録できませんでした。`
          : '',
        book && savedIds.length
          ? bookMissed
            ? `単語帳「${book.title}」は1冊${NOTEBOOK_ITEMS_PER_BOOK}項目までのため、${bookMissed}枚は入りませんでした。`
            : `単語帳「${book.title}」にも入れました。`
          : '',
      ].join(''),
    })
  }

  const firstWordIndex = candidates.findIndex((candidate) => candidate.kind === 'word')

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader title="写真から作る" subtitle={scopeTitle(subject, '自作カード')} compact />
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4" data-custom-photo>
        <Card className="overflow-hidden p-4">
          <div className="mb-3 flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-2xl" aria-hidden="true">
              📷
            </div>
            <div>
              <h2 className="font-display font-extrabold text-ink">単語表やノートを撮影</h2>
              <p className="mt-0.5 text-xs font-bold leading-relaxed text-ink/50">
                {'1行を1枚のカードの候補にします。左右に並んだ単語と意味、問題と答えは、カードの表と裏になります。'}
              </p>
            </div>
          </div>
          <PhotoOcrPicker
            ocr={ocr}
            onPicked={clearResults}
            onRead={scan}
            showRead={Boolean(ocr.file && !result)}
            readLabel="文字を読み取る"
          />
        </Card>

        <Card className="space-y-3 p-4" data-custom-photo-target>
          <h2 className="text-sm font-extrabold text-ink">登録するカードのテンプレート</h2>
          <TemplateChooser value={template} onChange={changeTemplate} />
          <CategorySelect value={category} categories={library.categories} onChange={changeCategory} data-custom-photo-category />
          {category === NEW_CATEGORY_OPTION && (
            <label className="block">
              <span className="text-[11px] font-extrabold text-ink/60">
                新しいカテゴリーの名前
                <span className="ml-1 text-rose-600">必須</span>
              </span>
              <input
                value={newCategoryTitle}
                onChange={(event) => setNewCategoryTitle(event.target.value)}
                maxLength={CUSTOM_CARD_LIMITS.categoryTitle}
                placeholder="例：2学期中間英語"
                className={cx(inputClass, 'mt-1')}
                data-custom-photo-new-category
              />
            </label>
          )}
          <label className="block">
            <span className="text-[11px] font-extrabold text-ink/60">入れる単語帳</span>
            <select value={bookId} onChange={(event) => setChosenBookId(event.target.value)} className={selectClass} data-custom-photo-book>
              <option value="">入れない</option>
              {wordBookSets.map((book) => <option key={book.id} value={book.id}>{book.title}</option>)}
            </select>
          </label>
        </Card>

        {result && (
          <Card className="p-4" data-custom-photo-text-card>
            <h2 className="font-display font-extrabold text-ink" data-custom-photo-summary>
              {`${result.rowCount}行から${candidates.length}枚の候補`}
            </h2>
            <p className="mt-0.5 text-xs font-bold leading-relaxed text-ink/50">
              {TEMPLATE_HINT[template] ?? TEMPLATE_HINT.other}
            </p>
            {result.japaneseOnlyRows > 0 && (
              <p className="mt-1 text-xs font-bold leading-relaxed text-ink/50" data-custom-photo-japanese-rows>
                {`日本語だけの行（${result.japaneseOnlyRows}行）は、英単語のカードにしていません。`}
              </p>
            )}
            <label className="mt-3 block text-xs font-extrabold text-ink/70" htmlFor="custom-photo-text">
              読み取った文字（1行が1枚。誤読は直せます）
            </label>
            <textarea
              id="custom-photo-text"
              value={text}
              onChange={(event) => {
                setText(event.target.value)
                setTextChanged(true)
              }}
              className="mt-1.5 h-28 w-full resize-y rounded-2xl bg-paper p-3 text-sm font-bold leading-relaxed text-ink ring-1 ring-ink/10 focus:outline-none focus:ring-2 focus:ring-brand-300"
              placeholder="読み取った文字がここに表示されます"
            />
            {textChanged && (
              <Button full size="sm" variant="secondary" className="mt-2" onClick={() => rebuild(text, template, category, reading)} data-custom-photo-rebuild>
                <Refresh size={16} /> 直した文字で候補を作り直す
              </Button>
            )}
          </Card>
        )}

        {result && (candidates.length > 0 ? (
          <section aria-labelledby="custom-photo-candidates-title">
            <div className="mb-2 flex items-end justify-between gap-3 px-1">
              <div>
                <h2 id="custom-photo-candidates-title" className="font-display text-lg font-extrabold text-ink">
                  登録するカード
                </h2>
                <p className="text-xs font-bold text-ink/45" data-custom-photo-count>
                  {`候補 ${candidates.length}枚・選択中 ${ready.length}枚`}
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setSelected(new Set(selectable.map((candidate) => candidate.key)))}
                  className="rounded-xl px-2.5 py-2 text-xs font-extrabold text-brand-700 active:bg-brand-100"
                  data-custom-photo-select-all
                >
                  すべて選択
                </button>
                <button
                  type="button"
                  onClick={() => setSelected(new Set())}
                  className="rounded-xl px-2.5 py-2 text-xs font-extrabold text-ink/45 active:bg-ink/5"
                >
                  解除
                </button>
              </div>
            </div>

            <ul className="space-y-2" data-custom-photo-candidates>
              {candidates.map((candidate, at) => (
                <PhotoCandidateGroup key={candidate.key} heading={at === firstWordIndex}>
                  <PhotoCandidateRow
                    candidate={candidate}
                    number={at + 1}
                    template={template}
                    labels={labels}
                    checked={!candidate.saved && selected.has(candidate.key)}
                    existing={isExisting(candidate)}
                    onToggle={() => toggle(candidate.key)}
                    onChange={(patch) => updateCandidate(candidate.key, patch)}
                  />
                </PhotoCandidateGroup>
              ))}
            </ul>

            <div className="sticky bottom-3 z-10 mt-4 space-y-2 rounded-3xl bg-paper/90 p-2 shadow-xl backdrop-blur">
              {notice && (
                <div className="rounded-2xl bg-emerald-50 p-3" role="status" data-custom-photo-notice>
                  <p className="text-xs font-extrabold leading-relaxed text-emerald-800">{notice.text}</p>
                  <button
                    type="button"
                    onClick={() => navigate('customWords', { ...base, category: notice.category })}
                    className="mt-1.5 inline-flex min-h-10 items-center gap-1 rounded-lg px-1 text-xs font-extrabold text-emerald-700 active:bg-emerald-100"
                    data-custom-photo-open-category
                  >
                    カードを見る <ArrowRight size={15} />
                  </button>
                </div>
              )}
              {error && (
                <p className="rounded-2xl bg-rose-50 px-3 py-2 text-xs font-extrabold text-rose-700" data-custom-photo-error>{error}</p>
              )}
              <Button full disabled={!ready.length || newCategoryMissing} onClick={register} data-custom-photo-save>
                <Check size={18} /> {`選んだ${ready.length}枚を登録する`}
              </Button>
              {newCategoryMissing && ready.length > 0 && (
                <p className="px-2 text-[11px] font-bold text-amber-700">{'新しいカテゴリーの名前を入れると登録できます。'}</p>
              )}
            </div>
          </section>
        ) : (
          <Card className="p-5 text-center">
            <div className="text-4xl" aria-hidden="true">🔎</div>
            <h2 className="mt-2 font-display font-extrabold text-ink">カードにできる行がありませんでした</h2>
            <p className="mt-1 text-xs font-bold leading-relaxed text-ink/50">
              {'上の文字を直して候補を作り直すか、テンプレートを替えてください。'}
            </p>
          </Card>
        ))}

        {!result && !ocr.scanning && (
          <div className="rounded-2xl bg-white/60 p-3 text-xs font-bold leading-relaxed text-ink/50">
            <p className="font-extrabold text-ink/65">きれいに読み取るコツ</p>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>ページとカメラを平行にして、影や光の反射を避ける</li>
              <li>単語と意味、問題と答えが1行に並ぶように写す</li>
              <li>登録する前に、候補の表と裏を確かめる</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

/** 英文の中の語の前に、見出しを1つ置く。 */
function PhotoCandidateGroup({ heading, children }) {
  if (!heading) return children
  return (
    <>
      <li className="px-1 pt-2" data-custom-photo-word-heading>
        <h3 className="text-sm font-extrabold text-ink">英文の中の語</h3>
        <p className="text-[11px] font-bold leading-relaxed text-ink/45">{'登録する語を選んでください。辞書にある語は、辞書の意味を入れています。'}</p>
      </li>
      {children}
    </>
  )
}
