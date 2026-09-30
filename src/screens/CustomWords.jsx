import { useMemo, useRef, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useStore } from '../store/useStore.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { CustomCardForm, NEW_CATEGORY_OPTION } from '../components/CustomCardForm.jsx'
import {
  CustomCategoryBlock,
  CustomCategorySheet,
  CustomEntryCard,
  categoryCaption,
} from '../components/CustomCardItems.jsx'
import { activeNotebookSetId } from '../lib/learningNotebook.js'
import { Button, Card, EmptyState, IconButton } from '../components/ui.jsx'
import { ArrowRight, Check, Close, Download, Gear, Plus, Search, Upload } from '../components/Icons.jsx'
import {
  CUSTOM_CARD_LIMITS,
  CUSTOM_CARD_TEMPLATES,
  CUSTOM_SUBJECT_BY_ID,
  CUSTOM_SUBJECT_IDS,
  DEFAULT_CATEGORY_ID,
  ENGLISH_TEMPLATE_ID,
  cardSearchText,
  customCategoryChoices,
  customCategoryGroups,
  defaultTemplateFor,
  findCustomCategory,
  subjectCategoryId,
} from '../lib/customCards.js'
import { CUSTOM_WORD_LIMITS } from '../lib/customWords.js'
import {
  carryEntryValues,
  emptyEntryValues,
  entryValuesFromCard,
  entryValuesFromWord,
  missingEntryFields,
} from '../lib/customEntryForm.js'
import {
  customLibraryCounts,
  customLibraryFileName,
  customLibraryFileText,
  parseCustomLibraryFile,
} from '../lib/customLibrary.js'
import {
  customCardsCsvFileName,
  customCardsCsvSample,
  customCardsCsvText,
  decodeTableBytes,
  parseCustomCardsTable,
} from '../lib/customCardsCsv.js'

// 自作カード（これまでの自作単語を広げたもの）。テンプレートを選んでカードを登録し、
// 分類（既存の教科、または自分で作ったカテゴリー）ごとに暗記・テストする。
// 見え方は params で決める（戻るで前の見え方へ帰れるように、見え方を変えるときは navigate で積む）。
//   subject  … 教科のアプリから開いたときの教科。その教科と、その教科に表示するカテゴリーだけを出す。
//   category … 分類1つのカードの一覧。
//   form     … 登録欄（{ kind, id } なら書き換え、{ template, category } なら新しく作る）。
//   draft    … 英和辞書から渡された語（英単語のテンプレートで登録欄を開く）。
//   view     … 'file' ならファイルの書き出し・読み込み。

const IMPORT_MESSAGE = {
  broken: 'JSONとして読めないファイルです。書き出したファイルをそのまま選んでください。',
  other: 'この画面で書き出したファイルではありません。',
  empty: '登録できるカードが入っていませんでした。',
}

const readSubject = (value) => (CUSTOM_SUBJECT_IDS.includes(value) ? value : null)

function useCustomLibrary() {
  return useStore(useShallow((state) => ({
    words: state.customWords,
    cards: state.customCards,
    categories: state.customCategories,
  })))
}

/** 教科から開いたときの見出しの前につける名前（「社会の」）。 */
const scopeTitle = (subject, title) => (subject ? `${CUSTOM_SUBJECT_BY_ID[subject].label}の${title}` : title)

// ── 分類の一覧（最初の見え方） ────────────────────────────────

function CategoryListView({ subject }) {
  const library = useCustomLibrary()
  const navigate = useStore((state) => state.navigate)
  const [sheet, setSheet] = useState(null)
  const groups = customCategoryGroups(library, { subject })
  const base = subject ? { subject } : {}

  const openForm = (form) => navigate('customWords', { ...base, form })
  const startStudy = useStartStudy(subject, base)

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader
        title={scopeTitle(subject, '自作カード')}
        subtitle="テンプレートを選んで登録し、教科・カテゴリーごとに暗記・テストする"
      />
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4" data-return-scroll="custom-words" data-custom-words-home={subject ?? 'all'}>
        <div className="space-y-2">
          <Button
            full
            onClick={() => openForm(subject ? { category: subjectCategoryId(subject) } : {})}
            data-custom-word-add
          >
            <Plus size={17} /> カードを作る
          </Button>
          <Button
            full
            size="sm"
            variant="secondary"
            onClick={() => setSheet({ category: null })}
            disabled={library.categories.length >= CUSTOM_CARD_LIMITS.categories}
            data-custom-category-add
          >
            <Plus size={16} /> カテゴリーを作る
          </Button>
        </div>

        {groups.length === 0 ? (
          <EmptyState icon="✍️" title="まだ自作カードはありません">
            {'「カードを作る」でテンプレートを選んで登録すると、ここで教科・カテゴリーごとに暗記・テストできます。'}
            {'教科を選んだカードは、その教科のアプリにも出ます。'}
          </EmptyState>
        ) : (
          <ul className="space-y-3">
            {groups.map((group) => (
              <li key={group.category.id} data-return-row={group.category.id}>
                <CustomCategoryBlock
                  group={group}
                  onStudy={startStudy}
                  onOpen={(category) => navigate('customWords', { ...base, category: category.id })}
                  onCreate={(category) => openForm({ category: category.id })}
                  onSettings={group.category.kind === 'custom' ? (category) => setSheet({ category }) : null}
                />
              </li>
            ))}
          </ul>
        )}

        {!subject && (
          <p className="px-1 text-[11px] font-bold leading-relaxed text-ink/45">
            {'教科（英語・古典・漢文・数学・社会・理科）を選んで登録したカードは、その教科のアプリのホームの「自作カード」にも出ます。'}
          </p>
        )}

        <button
          type="button"
          onClick={() => navigate('customWords', { ...base, view: 'file' })}
          className="flex min-h-12 w-full items-center justify-between rounded-2xl bg-white px-4 text-left text-sm font-extrabold text-ink/70 shadow-card"
          data-custom-words-file-open
        >
          {'カードの一覧をファイルで編集（Excel・テキストエディタ）'}
          <ArrowRight size={17} className="shrink-0 text-ink/30" />
        </button>
      </div>

      {sheet && (
        <CustomCategorySheet
          key={sheet.category?.id ?? 'new'}
          open
          category={sheet.category}
          defaultSubject={subject}
          cardCount={sheet.category
            ? library.words.filter((word) => word.category === sheet.category.id).length
              + library.cards.filter((card) => card.category === sheet.category.id).length
            : 0}
          isFirst={library.categories[0]?.id === sheet.category?.id}
          isLast={library.categories.at(-1)?.id === sheet.category?.id}
          onClose={() => setSheet(null)}
        />
      )}
    </div>
  )
}

/** 分類のカードを暗記・テストで始める。英単語のカードは英単語の暗記・テスト、ほかは自作カードの暗記・テスト。 */
function useStartStudy(subject, returnParams) {
  const navigate = useStore((state) => state.navigate)
  return (group, kind, mode) => {
    const returnTo = { screen: 'customWords', params: returnParams }
    const title = group.category.title
    if (kind === 'word') {
      const ids = group.words.map((word) => word.id)
      if (!ids.length) return
      // 枚数はカード上部の「1回のカード数」に任せる。ここで頭打ちにしない。
      navigate(mode === 'study' ? 'vocabStudy' : 'vocabQuiz', {
        source: { type: 'mylist', ids },
        title,
        mode,
        returnTo,
      })
      return
    }
    const ids = group.cards.map((card) => card.id)
    if (!ids.length) return
    navigate(mode === 'study' ? 'customCardStudy' : 'customCardQuiz', {
      ids,
      title,
      ...(subject ? { subject } : {}),
      returnTo,
    })
  }
}

// ── 分類1つのカード ─────────────────────────────────────

function CategoryView({ subject, categoryId }) {
  const library = useCustomLibrary()
  const srs = useStore((state) => state.srs)
  const cardSrs = useStore((state) => state.customCardSrs)
  const navigate = useStore((state) => state.navigate)
  const deleteCustomWord = useStore((state) => state.deleteCustomWord)
  const deleteCustomCard = useStore((state) => state.deleteCustomCard)
  const [sheet, setSheet] = useState(false)
  const [query, setQuery] = useState('')
  const base = subject ? { subject } : {}
  const startStudy = useStartStudy(subject, { ...base, category: categoryId })
  const category = findCustomCategory(library.categories, categoryId)

  if (!category) {
    return (
      <div className="flex h-full flex-col">
        <ScreenHeader title="自作カード" />
        <p className="p-8 text-center text-sm font-bold text-ink/50">このカテゴリーは消されました。</p>
      </div>
    )
  }

  const group = {
    category,
    words: library.words.filter((word) => word.category === category.id),
    cards: library.cards.filter((card) => card.category === category.id),
  }
  const normalized = query.trim().toLocaleLowerCase('ja')
  const matches = (text) => !normalized || text.toLocaleLowerCase('ja').includes(normalized)
  // 新しく登録したものから並べる。
  const entries = [
    ...group.words.map((word) => ({ kind: 'word', entry: word, text: [word.word, word.meanings.join(' '), word.note, word.example?.en ?? '', word.example?.ja ?? ''].join(' ') })),
    ...group.cards.map((card) => ({ kind: 'card', entry: card, text: cardSearchText(card) })),
  ]
    .filter((item) => matches(item.text))
    .sort((a, b) => (b.entry.createdAt ?? 0) - (a.entry.createdAt ?? 0))
  const total = group.words.length + group.cards.length
  const categoryIndex = library.categories.findIndex((item) => item.id === category.id)

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader
        title={category.title}
        subtitle={categoryCaption(category)}
        right={category.kind === 'custom' ? (
          <IconButton onClick={() => setSheet(true)} aria-label={`カテゴリー「${category.title}」の設定`} data-custom-category-settings={category.id}>
            <Gear size={22} />
          </IconButton>
        ) : null}
      />
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4" data-return-scroll="custom-words" data-custom-category-view={category.id}>
        <CustomCategoryBlock
          group={group}
          onStudy={startStudy}
          onCreate={() => navigate('customWords', { ...base, form: { category: category.id } })}
        />

        {total > 0 && (
          <label className="flex items-center gap-2 rounded-2xl bg-white px-3.5 py-2.5 shadow-sm">
            <Search size={18} className="text-ink/35" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="用語・意味・解説で探す"
              aria-label={`${category.title}のカードを探す`}
              className="min-w-0 flex-1 bg-transparent text-sm font-bold text-ink outline-none placeholder:text-ink/30"
              data-custom-category-search
            />
          </label>
        )}

        {total > 0 && entries.length === 0 && (
          <p className="rounded-2xl bg-white p-5 text-center text-sm font-bold text-ink/45 shadow-card">一致するカードがありません。</p>
        )}
        <ul className="space-y-2" data-custom-entry-list>
          {entries.map(({ kind, entry }) => (
            <li key={entry.id} data-return-row={entry.id}>
              <CustomEntryCard
                kind={kind}
                entry={entry}
                srsEntry={kind === 'word' ? srs[entry.id] : cardSrs[entry.id]}
                onEdit={(editKind, target) => navigate('customWords', { ...base, form: { kind: editKind, id: target.id } })}
                onDelete={(deleteKind, id) => (deleteKind === 'word' ? deleteCustomWord(id) : deleteCustomCard(id))}
                onOpenWord={(id) => navigate('wordDetail', { id })}
              />
            </li>
          ))}
        </ul>
      </div>

      {sheet && category.kind === 'custom' && (
        <CustomCategorySheet
          open
          category={category}
          cardCount={total}
          isFirst={categoryIndex === 0}
          isLast={categoryIndex === library.categories.length - 1}
          onClose={() => setSheet(false)}
        />
      )}
    </div>
  )
}

// ── 登録欄 ──────────────────────────────────────────

function initialForm({ form, draftWord, subject, library }) {
  if (form?.id && form.kind === 'word') {
    const word = library.words.find((item) => item.id === form.id)
    if (word) return { template: ENGLISH_TEMPLATE_ID, values: entryValuesFromWord(word), category: word.category, previous: { kind: 'word', id: word.id } }
  }
  if (form?.id && form.kind === 'card') {
    const card = library.cards.find((item) => item.id === form.id)
    if (card) return { template: card.template, values: entryValuesFromCard(card), category: card.category, previous: { kind: 'card', id: card.id } }
  }
  const requested = customCategoryChoices(library.categories).some((choice) => choice.id === form?.category) ? form.category : null
  const category = requested ?? (draftWord ? DEFAULT_CATEGORY_ID : subject ? subjectCategoryId(subject) : DEFAULT_CATEGORY_ID)
  const template = draftWord ? ENGLISH_TEMPLATE_ID : form?.template ?? defaultTemplateFor(library.categories, category)
  return {
    template,
    values: { ...emptyEntryValues(), front: draftWord.slice(0, CUSTOM_WORD_LIMITS.word) },
    category,
    previous: null,
  }
}

function EntryFormView({ subject, form, draftWord }) {
  const library = useCustomLibrary()
  const { wordBookSets, activeBookId } = useStore(useShallow((state) => ({
    wordBookSets: state.learningNotebook.sets,
    // 登録と同時に入れる単語帳は、はじめは単語帳ボタンの登録先（画面下部の「単語帳」で選んだ冊）。
    activeBookId: activeNotebookSetId(state.learningNotebook),
  })))
  const saveCustomEntry = useStore((state) => state.saveCustomEntry)
  const saveCustomCategory = useStore((state) => state.saveCustomCategory)
  const setNotebookSetItem = useStore((state) => state.setNotebookSetItem)
  const back = useStore((state) => state.back)
  const [initial] = useState(() => initialForm({ form, draftWord, subject, library }))
  const [template, setTemplate] = useState(initial.template)
  const [templateTouched, setTemplateTouched] = useState(Boolean(initial.previous || form?.template))
  const [values, setValues] = useState(initial.values)
  const [category, setCategory] = useState(initial.category)
  const [newCategoryTitle, setNewCategoryTitle] = useState('')
  const [addToBookId, setAddToBookId] = useState(null)
  const [error, setError] = useState('')
  const editing = Boolean(initial.previous)
  const fromDictionary = Boolean(draftWord)
  const bookId = addToBookId ?? activeBookId ?? ''

  const changeTemplate = (next) => {
    setValues((current) => carryEntryValues(current, template, next))
    setTemplate(next)
    setTemplateTouched(true)
  }
  const changeCategory = (next) => {
    setCategory(next)
    // テンプレートをまだ選んでいなければ、分類の最初のテンプレートに合わせる。
    if (!templateTouched && next !== NEW_CATEGORY_OPTION) {
      const nextTemplate = defaultTemplateFor(library.categories, next)
      setValues((current) => carryEntryValues(current, template, nextTemplate))
      setTemplate(nextTemplate)
    }
  }

  const submit = () => {
    const missing = missingEntryFields(template, values)
    if (missing.length) {
      setError(`${missing.join('と')}を入れてください。`)
      return
    }
    let categoryId = category
    if (category === NEW_CATEGORY_OPTION) {
      const created = saveCustomCategory({ title: newCategoryTitle, subject, template })
      if (created.status !== 'saved') {
        setError(created.status === 'full'
          ? `カテゴリーは${CUSTOM_CARD_LIMITS.categories}個までです。`
          : '新しいカテゴリーの名前を入れてください。')
        return
      }
      categoryId = created.id
      setCategory(created.id)
    }
    const result = saveCustomEntry({ template, category: categoryId, values, previous: initial.previous })
    if (result.status === 'invalid') {
      setError('必須の欄を入れてください。')
      return
    }
    if (result.status === 'full') {
      setError(template === ENGLISH_TEMPLATE_ID
        ? `英単語のカードは${CUSTOM_WORD_LIMITS.words}語までです。使わないカードを消すとまた足せます。`
        : `カードは${CUSTOM_CARD_LIMITS.cards}枚までです。使わないカードを消すとまた足せます。`)
      return
    }
    if (!editing && bookId) setNotebookSetItem(bookId, result.kind === 'word' ? 'vocab' : 'customCards', result.id, true)
    setError('')
    // 辞書から来た登録は、終わったら辞書へ戻す（引いていた語と、登録した語が出る）。
    back()
  }

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader title={editing ? 'カードを書き換える' : 'カードを作る'} subtitle={scopeTitle(subject, '自作カード')} compact />
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {fromDictionary && (
          <p
            className="rounded-2xl bg-amber-50 px-4 py-3 text-xs font-extrabold leading-relaxed text-amber-900"
            data-custom-word-from-dictionary
          >
            {`英和辞書にない「${draftWord}」を、英単語のカードとして登録します。意味を入れて登録すると、辞書の画面へ戻ります。`}
          </p>
        )}
        <CustomCardForm
          template={template}
          onTemplateChange={changeTemplate}
          values={values}
          onValuesChange={setValues}
          category={category}
          onCategoryChange={changeCategory}
          categories={library.categories}
          newCategoryTitle={newCategoryTitle}
          onNewCategoryTitleChange={setNewCategoryTitle}
          books={wordBookSets}
          bookId={bookId}
          onBookChange={setAddToBookId}
          editing={editing}
          error={error}
        />
      </div>
      <div className="shrink-0 border-t border-slate-200 bg-white/95 p-3 backdrop-blur" data-custom-card-form-actions>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" onClick={() => back()} data-custom-word-cancel>
            <Close size={15} /> やめる
          </Button>
          <Button onClick={submit} data-custom-word-save>
            <Check size={15} /> {editing ? '書き換える' : '登録する'}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── ファイルで編集する（CSV：Excel・テキストエディタ）・まるごと保存する（JSON） ─────────────

// 端末へファイルを保存する（ダウンロード先のフォルダ）。
function saveFile(text, name, type) {
  const blob = new Blob([text], { type })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = name
  anchor.click()
  URL.revokeObjectURL(url)
}

// 表（CSV）の列の書き方。読み込む前に確かめられるよう、ファイルの画面に並べる。
const TABLE_GUIDE = [
  ['分類（教科・カテゴリー）', '英語・古典・漢文・数学・社会・理科か、自分のカテゴリーの名前。ない名前のカテゴリーは読み込むときに作ります。空なら英語（教科から開いたときはその教科）'],
  ['テンプレート', `${CUSTOM_CARD_TEMPLATES.map((template) => template.label).join('・')}のどれか。空なら分類の最初のテンプレート`],
  ['表・裏', '用語・問題・単語と、意味・答え。どの行にも必ず書きます'],
  ['品詞', '英単語は名詞・動詞・形容詞・副詞・前置詞・接続詞・代名詞のどれか'],
  ['級・分野（英単語）', '級は「準2級」のように書きます。分野は登録の画面の分野の名前'],
  ['派生語・類義語など（英単語）', '「famous（有名な）；well-known（よく知られた）」のように、語（意味）を「；」で区切ります'],
  ['ほかの意味（英単語）', '「名詞：人気者」のように、品詞：意味を「；」で区切ります'],
  ['ID', '書き出したカードの ID。消さずに読み込むと同じカードを書き換えます（暗記・テストの記録が残ります）。新しい行は空のまま'],
]

function FileView({ subject }) {
  const library = useCustomLibrary()
  const importCustomLibrary = useStore((state) => state.importCustomLibrary)
  const [fileNotice, setFileNotice] = useState('')
  const [pending, setPending] = useState(null)
  const [pasted, setPasted] = useState('')
  const [pasteOpen, setPasteOpen] = useState(false)
  const tableInput = useRef(null)
  const jsonInput = useRef(null)
  const counts = customLibraryCounts(library)
  const hasCards = Boolean(counts.words || counts.cards)

  const readTable = (text, name) => {
    const parsed = parseCustomCardsTable(text, { categories: library.categories, subject })
    if (parsed.status !== 'ok') {
      setPending(null)
      setFileNotice(parsed.errors.length
        ? `カードになる行がありませんでした。${parsed.errors.map((error) => `${error.line}行目：${error.message}`).join('。')}`
        : 'カードになる行がありませんでした。1行目に列の名前、2行目からカードを書きます。')
      return
    }
    setFileNotice('')
    setPending({ kind: 'table', name, ...parsed })
  }

  const openTableFile = async (file) => {
    setPending(null)
    if (!file) return
    readTable(decodeTableBytes(await file.arrayBuffer()), file.name)
  }

  const openJsonFile = async (file) => {
    setPending(null)
    if (!file) return
    const parsed = parseCustomLibraryFile(await file.text())
    if (parsed.status !== 'ok') {
      setFileNotice(IMPORT_MESSAGE[parsed.status] ?? '読み込めませんでした。')
      return
    }
    setFileNotice('')
    setPending({ kind: 'json', name: file.name, library: parsed.library, errors: [], warnings: [], newCategories: [] })
  }

  const applyImport = (mode) => {
    const result = importCustomLibrary(pending.library, mode)
    setPending(null)
    setPasted('')
    setPasteOpen(false)
    setFileNotice(
      mode === 'replace'
        ? `${result.addedCount}枚のカードに入れ替えました。`
        : `${result.addedCount}枚を足し、${result.updatedCount}枚を書き換えました。`
          + (result.categoryCount ? `カテゴリーを${result.categoryCount}個作りました。` : '')
          + (result.skippedCount ? `${result.skippedCount}枚は上限を超えるため見送りました。` : ''),
    )
  }

  const pendingCounts = pending ? customLibraryCounts(pending.library) : null

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader title="カードの一覧をファイルで編集" subtitle={scopeTitle(subject, '自作カード')} compact />
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4" data-custom-words-file>
        <Card className="p-4" data-custom-cards-table>
          <h2 className="font-display text-base font-extrabold text-ink">Excel・テキストエディタで編集する</h2>
          <p className="mt-1 text-xs font-bold leading-relaxed text-ink/55">
            {'カードの一覧を、1行が1枚のCSVファイルにします。'}
            {'Excel やテキストエディタで直したり、一から作ったりしたファイルを読み込むと、カードになります。'}
          </p>
          <div className="mt-2.5 grid grid-cols-1 gap-2">
            <Button
              full
              size="sm"
              onClick={() => {
                saveFile(customCardsCsvText(library), customCardsCsvFileName(), 'text/csv;charset=utf-8')
                setFileNotice(`英単語のカード${counts.words}語・カード${counts.cards}枚をCSVで書き出しました。`)
              }}
              disabled={!hasCards}
              data-custom-cards-csv-export
            >
              <Download size={16} /> {'カードの一覧をCSVで書き出す'}
            </Button>
            <Button
              full
              size="sm"
              variant="secondary"
              onClick={() => {
                saveFile(customCardsCsvSample(), customCardsCsvFileName(Date.now(), true), 'text/csv;charset=utf-8')
                setFileNotice('見本のCSVを保存しました。見本の行を書き換えて読み込むと、カードになります。')
              }}
              data-custom-cards-csv-sample
            >
              <Download size={16} /> {'見本のCSVを保存（一から作るとき）'}
            </Button>
            <input
              ref={tableInput}
              type="file"
              accept=".csv,.tsv,.txt,text/csv,text/tab-separated-values,text/plain"
              data-custom-cards-csv-input
              onChange={(event) => {
                openTableFile(event.target.files?.[0])
                event.target.value = ''
              }}
              className="hidden"
            />
            <Button full size="sm" variant="secondary" onClick={() => tableInput.current?.click()} data-custom-cards-csv-open>
              <Upload size={16} /> {'CSV・テキストのファイルを読み込む'}
            </Button>
            <Button full size="sm" variant="secondary" onClick={() => setPasteOpen((open) => !open)} aria-expanded={pasteOpen} data-custom-cards-paste-open>
              {'表を貼り付けて読み込む'}
            </Button>
          </div>
          {pasteOpen && (
            <div className="mt-2.5 space-y-2" data-custom-cards-paste>
              <p className="text-[11px] font-bold leading-relaxed text-ink/50">
                {'Excel でえらんでコピーした表や、カンマ・タブで区切った文を貼り付けます。1行目が列の名前でないときは、「表・裏・解説」の順に読みます。'}
              </p>
              <textarea
                value={pasted}
                onChange={(event) => setPasted(event.target.value)}
                rows={6}
                placeholder={'例：\nphotosynthesis\t光合成\nrespiration\t呼吸'}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold leading-relaxed text-ink outline-none focus:border-brand-500"
                data-custom-cards-paste-input
              />
              <Button full size="sm" onClick={() => readTable(pasted, '貼り付けた表')} disabled={!pasted.trim()} data-custom-cards-paste-read>
                {'貼り付けた表を読み込む'}
              </Button>
            </div>
          )}
          <details className="mt-3 rounded-xl bg-slate-50 px-3 py-2" data-custom-cards-table-guide>
            <summary className="min-h-10 cursor-pointer py-2 text-xs font-extrabold text-ink/65">{'列の書き方'}</summary>
            <dl className="space-y-1.5 pb-1">
              {TABLE_GUIDE.map(([name, text]) => (
                <div key={name}>
                  <dt className="text-[11px] font-extrabold text-ink/70">{name}</dt>
                  <dd className="text-[11px] font-bold leading-relaxed text-ink/50">{text}</dd>
                </div>
              ))}
            </dl>
          </details>
        </Card>

        <Card className="p-4" data-custom-cards-json>
          <h2 className="font-display text-base font-extrabold text-ink">まるごと保存する</h2>
          <p className="mt-1 text-xs font-bold leading-relaxed text-ink/55">
            {'カード・カテゴリー（表示する教科・最初のテンプレートも）をそのままJSONファイルにします。端末を替えるときに使います。'}
            {'以前の自作単語のファイルも読み込めます。'}
          </p>
          <div className="mt-2.5 grid grid-cols-1 gap-2">
            <Button
              full
              size="sm"
              variant="secondary"
              onClick={() => {
                saveFile(customLibraryFileText(library), customLibraryFileName(), 'application/json')
                setFileNotice(`英単語のカード${counts.words}語・カード${counts.cards}枚・カテゴリー${counts.categories}個を書き出しました。`)
              }}
              disabled={!counts.words && !counts.cards && !counts.categories}
            >
              <Download size={16} /> {'JSONファイルで保存'}
            </Button>
            <input
              ref={jsonInput}
              type="file"
              accept="application/json,.json"
              data-custom-words-file-input
              onChange={(event) => {
                openJsonFile(event.target.files?.[0])
                event.target.value = ''
              }}
              className="hidden"
            />
            <Button full size="sm" variant="secondary" onClick={() => jsonInput.current?.click()}>
              <Upload size={16} /> {'JSONファイルを読み込む'}
            </Button>
          </div>
        </Card>

        {pending && (
          <Card className="p-4" data-custom-words-import-choice>
            <p className="text-sm font-extrabold text-ink">
              {`${pending.name}から、英単語のカード${pendingCounts.words}語・カード${pendingCounts.cards}枚を読み込みました。`}
            </p>
            {pending.newCategories.length > 0 && (
              <p className="mt-1 text-xs font-bold leading-relaxed text-ink/60" data-custom-cards-import-new-categories>
                {`新しく作るカテゴリー：${pending.newCategories.join('・')}`}
              </p>
            )}
            {pending.errors.length > 0 && (
              <div className="mt-2 rounded-lg bg-rose-50 px-3 py-2" data-custom-cards-import-errors>
                <p className="text-xs font-extrabold text-rose-700">{`読めなかった行（${pending.errors.length}行）`}</p>
                <ul className="mt-1 space-y-0.5">
                  {pending.errors.slice(0, 20).map((error) => (
                    <li key={`${error.line}-${error.message}`} className="text-[11px] font-bold leading-relaxed text-rose-800">{`${error.line}行目：${error.message}`}</li>
                  ))}
                </ul>
              </div>
            )}
            {pending.warnings.length > 0 && (
              <div className="mt-2 rounded-lg bg-amber-50 px-3 py-2" data-custom-cards-import-warnings>
                <p className="text-xs font-extrabold text-amber-800">{`読んだけれど、一部の欄を読まなかった行（${pending.warnings.length}件）`}</p>
                <ul className="mt-1 space-y-0.5">
                  {pending.warnings.slice(0, 20).map((warning) => (
                    <li key={`${warning.line}-${warning.message}`} className="text-[11px] font-bold leading-relaxed text-amber-900">{`${warning.line}行目：${warning.message}`}</li>
                  ))}
                </ul>
              </div>
            )}
            <p className="mt-2 text-xs font-bold leading-relaxed text-ink/55">
              {`いまのカード${counts.words + counts.cards}枚にどう反映しますか。`}
              {'足す・書き換えるは、ID の同じカードを書き換えて、ほかを足します。まるごと入れ替えるは、いまのカードとカテゴリーを、このファイルの中身だけにします。'}
            </p>
            <div className="mt-2.5 grid grid-cols-2 gap-2">
              <Button size="sm" onClick={() => applyImport('merge')} data-custom-cards-import-merge>
                足す・書き換える
              </Button>
              <Button size="sm" variant="danger" onClick={() => applyImport('replace')} data-custom-cards-import-replace>
                まるごと入れ替える
              </Button>
            </div>
            <Button full size="sm" variant="secondary" className="mt-2" onClick={() => setPending(null)}>
              やめる
            </Button>
          </Card>
        )}

        {fileNotice && (
          <p className="rounded-2xl bg-brand-50 px-4 py-3 text-xs font-extrabold leading-relaxed text-brand-700" data-custom-words-file-notice>
            {fileNotice}
          </p>
        )}

        <p className="px-1 text-[11px] font-bold leading-relaxed text-ink/45">
          {'自作カードはこの端末に保存されます。'}
          {'進捗コード・QRにも入りますが、カードが多いとQRに収まらないことがあります。'}
          {'端末を替えるときや、まとめて直したいときはファイルを使ってください。'}
        </p>
      </div>
    </div>
  )
}

export function CustomWordsScreen() {
  const params = useStore((state) => state.params)
  const subject = readSubject(params.subject)
  // 英和辞書で見つからなかった語から来たときは、その語を入れた英単語の登録欄から始める。
  const draftWord = typeof params.draft?.word === 'string' ? params.draft.word : ''
  const formKey = useMemo(() => JSON.stringify(params.form ?? null) + draftWord, [params.form, draftWord])

  if (params.form || draftWord) {
    return <EntryFormView key={formKey} subject={subject} form={params.form ?? null} draftWord={draftWord} />
  }
  if (params.view === 'file') return <FileView subject={subject} />
  if (typeof params.category === 'string') {
    return <CategoryView key={params.category} subject={subject} categoryId={params.category} />
  }
  return <CategoryListView subject={subject} />
}
