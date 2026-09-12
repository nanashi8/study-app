import { useMemo, useRef, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useStore } from '../store/useStore.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { WordListSheet } from '../components/WordListSheet.jsx'
import { Button, Card, Chip, EmptyState, cx } from '../components/ui.jsx'
import {
  Bookmark,
  BookmarkFilled,
  Check,
  Close,
  Download,
  Plus,
  Upload,
} from '../components/Icons.jsx'
import { getLevel } from '../data/levels.js'
import {
  CUSTOM_WORD_FIELDS,
  CUSTOM_WORD_LEVELS,
  CUSTOM_WORD_LIMITS,
  CUSTOM_WORD_POS,
  DEFAULT_CUSTOM_WORD,
  customWordsFileName,
  customWordsFileText,
  parseCustomWordsFile,
} from '../lib/customWords.js'

const emptyForm = () => ({
  id: null,
  word: '',
  meaning: '',
  pos: DEFAULT_CUSTOM_WORD.pos,
  level: DEFAULT_CUSTOM_WORD.level,
  field: DEFAULT_CUSTOM_WORD.field,
  phonetic: '',
  exampleEn: '',
  exampleJa: '',
  note: '',
  // 登録と同時に入れる単語帳。null は「並びの先頭の単語帳」、'' は「入れない」。
  addToBookId: null,
})

const formFromWord = (word) => ({
  id: word.id,
  word: word.word,
  meaning: word.meanings.join('・'),
  pos: word.pos,
  level: word.level,
  field: word.field,
  phonetic: word.phonetic,
  exampleEn: word.example?.en ?? '',
  exampleJa: word.example?.ja ?? '',
  note: word.note,
  addToBookId: '',
})

const IMPORT_MESSAGE = {
  broken: 'JSONとして読めないファイルです。書き出したファイルをそのまま選んでください。',
  other: 'この画面で書き出したファイルではありません。',
  empty: '登録できる単語が入っていませんでした。',
}

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="text-[10px] font-extrabold text-ink/55">{label}</span>
      {children}
      {hint && <span className="mt-0.5 block text-[10px] font-bold text-ink/40">{hint}</span>}
    </label>
  )
}

const inputClass = 'mt-1 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-bold text-ink outline-none focus:border-brand-500'
const selectClass = 'mt-1 h-11 w-full rounded-lg border border-slate-300 bg-white px-2 text-sm font-bold text-ink outline-none focus:border-brand-500'

function WordForm({ form, books = [], onChange, onSubmit, onCancel, error }) {
  const set = (key) => (event) => onChange({ ...form, [key]: event.target.value })

  return (
    <Card className="p-4" data-custom-word-form>
      <div className="space-y-2.5">
        <Field label={`単語（最大${CUSTOM_WORD_LIMITS.word}字）`}>
          <input
            value={form.word}
            onChange={set('word')}
            maxLength={CUSTOM_WORD_LIMITS.word}
            placeholder="例：serendipity"
            data-custom-word-input="word"
            className={inputClass}
          />
        </Field>
        <Field label="意味" hint={`「・」で区切ると${CUSTOM_WORD_LIMITS.meanings}つまで並べられます`}>
          <input
            value={form.meaning}
            onChange={set('meaning')}
            placeholder="例：思いがけない発見・幸運な巡り合わせ"
            data-custom-word-input="meaning"
            className={inputClass}
          />
        </Field>
        <div className="grid grid-cols-3 gap-2">
          <Field label="品詞">
            <select value={form.pos} onChange={set('pos')} className={selectClass}>
              {CUSTOM_WORD_POS.map((pos) => (
                <option key={pos.id} value={pos.id}>{pos.label}</option>
              ))}
            </select>
          </Field>
          <Field label="級">
            <select value={form.level} onChange={set('level')} className={selectClass}>
              {CUSTOM_WORD_LEVELS.map((level) => (
                <option key={level.id} value={level.id}>{level.label}</option>
              ))}
            </select>
          </Field>
          <Field label="発音">
            <input
              value={form.phonetic}
              onChange={set('phonetic')}
              maxLength={CUSTOM_WORD_LIMITS.phonetic}
              placeholder="/ˌserənˈdɪpəti/"
              className={inputClass}
            />
          </Field>
        </div>
        <Field label="分野">
          <select value={form.field} onChange={set('field')} className={selectClass}>
            {CUSTOM_WORD_FIELDS.map((field) => (
              <option key={field} value={field}>{field}</option>
            ))}
          </select>
        </Field>
        <Field label="例文（英語）">
          <input
            value={form.exampleEn}
            onChange={set('exampleEn')}
            maxLength={CUSTOM_WORD_LIMITS.example}
            placeholder="Finding this book was pure serendipity."
            className={inputClass}
          />
        </Field>
        <Field label="例文の訳">
          <input
            value={form.exampleJa}
            onChange={set('exampleJa')}
            maxLength={CUSTOM_WORD_LIMITS.example}
            placeholder="この本に出会えたのは、まったくの幸運だった。"
            className={inputClass}
          />
        </Field>
        <Field label="メモ" hint="覚え方や、授業で聞いた補足など">
          <input
            value={form.note}
            onChange={set('note')}
            maxLength={CUSTOM_WORD_LIMITS.note}
            className={inputClass}
          />
        </Field>
        {/* 登録と同時に入れる単語帳。どの単語帳も同じように選べる。 */}
        {!form.id && (
          <Field label="入れる単語帳">
            <select
              value={form.addToBookId ?? books[0]?.id ?? ''}
              onChange={(event) => onChange({ ...form, addToBookId: event.target.value })}
              data-custom-word-book-select
              className={selectClass}
            >
              <option value="">入れない</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>{book.title}</option>
              ))}
            </select>
          </Field>
        )}
      </div>

      {error && (
        <p className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-xs font-extrabold text-rose-700" data-custom-word-error>
          {error}
        </p>
      )}

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button size="sm" variant="secondary" onClick={onCancel}>
          <Close size={15} /> やめる
        </Button>
        <Button size="sm" onClick={onSubmit} data-custom-word-save>
          <Check size={15} /> {form.id ? '書き換える' : '登録する'}
        </Button>
      </div>
    </Card>
  )
}

function CustomWordCard({ word, inBook, onEdit, onDelete, onOpenLists }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const level = getLevel(word.level)

  return (
    <Card className="p-3.5" data-custom-word-id={word.id}>
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <Chip color={level.color}>英検{level.label}</Chip>
            <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-extrabold text-ink/60">
              {word.pos}
            </span>
            <span className="truncate rounded-md bg-slate-50 px-1.5 py-0.5 text-[10px] font-bold text-ink/45">
              {word.field}
            </span>
          </div>
          <p className="mt-1 break-words font-display text-xl font-extrabold text-ink">{word.word}</p>
          {word.phonetic && <p className="text-xs font-bold text-ink/40">{word.phonetic}</p>}
          <p className="mt-0.5 break-words text-sm font-extrabold text-ink/70">
            {word.meanings.join('・')}
          </p>
          {word.example?.en && (
            <p className="mt-1 break-words text-xs font-bold text-ink/55">{word.example.en}</p>
          )}
          {word.example?.ja && (
            <p className="break-words text-xs font-bold text-ink/40">{word.example.ja}</p>
          )}
          {word.note && (
            <p className="mt-1 break-words rounded-lg bg-amber-50 px-2 py-1 text-[11px] font-bold text-amber-950">
              {word.note}
            </p>
          )}
        </div>
        <SpeakButton text={word.word} size="sm" />
      </div>

      <div className="mt-2.5 grid grid-cols-3 gap-1.5 border-t border-slate-200 pt-2.5">
        {/* 保存先は「単語帳」1つ。押すと入れる冊を選ぶ。 */}
        <button
          type="button"
          onClick={() => onOpenLists(word)}
          aria-haspopup="dialog"
          data-custom-word-book
          className={cx(
            'flex min-h-10 items-center justify-center gap-1 rounded-lg border px-1 text-[10px] font-extrabold',
            inBook ? 'border-hint/30 bg-hint/10 text-hint' : 'border-slate-300 bg-white text-ink/60',
          )}
        >
          {inBook ? <BookmarkFilled size={14} /> : <Bookmark size={14} />}
          単語帳
        </button>
        <button
          type="button"
          onClick={() => onEdit(word)}
          className="min-h-10 rounded-lg border border-slate-300 bg-white px-1 text-[10px] font-extrabold text-ink/70"
        >
          編集
        </button>
        <button
          type="button"
          onClick={() => (confirmDelete ? onDelete(word.id) : setConfirmDelete(true))}
          onBlur={() => setConfirmDelete(false)}
          data-custom-word-delete
          className={cx(
            'min-h-10 rounded-lg border px-1 text-[10px] font-extrabold',
            confirmDelete
              ? 'border-rose-300 bg-rose-50 text-rose-700'
              : 'border-slate-300 bg-white text-ink/70',
          )}
        >
          {confirmDelete ? '本当に消す' : '削除'}
        </button>
      </div>
    </Card>
  )
}

export function CustomWordsScreen() {
  const { customWords, wordBookSets } = useStore(useShallow((state) => ({
    customWords: state.customWords,
    wordBookSets: state.learningNotebook.sets,
  })))
  const saveCustomWord = useStore((state) => state.saveCustomWord)
  const deleteCustomWord = useStore((state) => state.deleteCustomWord)
  const importCustomWords = useStore((state) => state.importCustomWords)
  const setNotebookSetItem = useStore((state) => state.setNotebookSetItem)
  const navigate = useStore((state) => state.navigate)
  const back = useStore((state) => state.back)
  const params = useStore((state) => state.params)
  // 英和辞書で見つからなかった語から来たときは、その語を入れた登録欄から始める。
  const draftWord = typeof params.draft?.word === 'string' ? params.draft.word : ''

  const [tab, setTab] = useState('words')
  const [form, setForm] = useState(() => (
    draftWord
      ? { ...emptyForm(), word: draftWord.slice(0, CUSTOM_WORD_LIMITS.word), fromDictionary: true }
      : null
  ))
  const [error, setError] = useState('')
  const [listSheetWord, setListSheetWord] = useState(null)
  const [fileNotice, setFileNotice] = useState('')
  const [pending, setPending] = useState(null)
  const fileInput = useRef(null)

  // どれかの単語帳に入っている語。
  const bookedIds = useMemo(() => new Set(
    wordBookSets.flatMap((set) => set.refs
      .filter((ref) => ref.startsWith('vocab:'))
      .map((ref) => ref.slice('vocab:'.length))),
  ), [wordBookSets])
  const ids = useMemo(() => customWords.map((word) => word.id), [customWords])

  const submit = () => {
    const result = saveCustomWord({
      id: form.id,
      word: form.word,
      meanings: form.meaning,
      pos: form.pos,
      level: form.level,
      field: form.field,
      phonetic: form.phonetic,
      example: { en: form.exampleEn, ja: form.exampleJa },
      note: form.note,
    })
    if (result.status === 'invalid') {
      setError('単語と意味の両方を入れてください。')
      return
    }
    if (result.status === 'full') {
      setError(`自作単語は${CUSTOM_WORD_LIMITS.words}語までです。使わない語を消すとまた足せます。`)
      return
    }
    const bookId = form.addToBookId ?? wordBookSets[0]?.id ?? ''
    if (!form.id && bookId) setNotebookSetItem(bookId, 'vocab', result.id, true)
    setError('')
    setForm(null)
    // 辞書から来た登録は、終わったら辞書へ戻す（引いていた語と、登録した語が出る）。
    if (form.fromDictionary) back()
  }

  const cancelForm = () => {
    setForm(null)
    setError('')
    if (form?.fromDictionary) back()
  }

  const startSession = (screen) => {
    if (!ids.length) return
    // 枚数はカード上部の「1回のカード数」に任せる。ここで頭打ちにしない。
    navigate(screen, {
      source: { type: 'mylist', ids },
      title: '自作単語',
      mode: screen === 'vocabStudy' ? 'study' : 'quiz',
      returnTo: { screen: 'customWords', params: {} },
    })
  }

  const download = () => {
    const blob = new Blob([customWordsFileText(customWords)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = customWordsFileName()
    anchor.click()
    URL.revokeObjectURL(url)
    setFileNotice(`${customWords.length}語を書き出しました。`)
  }

  const openFile = async (file) => {
    setPending(null)
    if (!file) return
    const parsed = parseCustomWordsFile(await file.text())
    if (parsed.status !== 'ok') {
      setFileNotice(IMPORT_MESSAGE[parsed.status] ?? '読み込めませんでした。')
      return
    }
    setFileNotice('')
    setPending({ name: file.name, words: parsed.words })
  }

  const applyImport = (mode) => {
    const result = importCustomWords(pending.words, mode)
    setPending(null)
    setFileNotice(
      mode === 'replace'
        ? `${result.addedCount}語に入れ替えました。`
        : `${result.addedCount}語を足し、${result.updatedCount}語を書き換えました。`
          + (result.skippedCount ? `${result.skippedCount}語は上限を超えるため見送りました。` : ''),
    )
  }

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader title="自作単語" subtitle="辞書に無い語を自分で登録して学ぶ" />

      <div className="shrink-0 border-b border-slate-200 bg-white px-4 py-2">
        <div className="grid grid-cols-2 gap-1.5" data-custom-words-tabs>
          {[
            { id: 'words', label: `単語 ${customWords.length}語` },
            { id: 'file', label: 'ファイル' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              aria-pressed={tab === item.id}
              className={cx(
                'min-h-10 rounded-lg text-xs font-extrabold transition-colors',
                tab === item.id ? 'bg-brand-600 text-white' : 'bg-slate-100 text-ink/60',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {tab === 'words' ? (
          <>
            {form?.fromDictionary && (
              <p
                className="rounded-2xl bg-amber-50 px-4 py-3 text-xs font-extrabold leading-relaxed text-amber-900"
                data-custom-word-from-dictionary
              >
                英和辞書にない「{draftWord}」を自作単語として登録します。意味を入れて登録すると、辞書の画面へ戻ります。
              </p>
            )}
            {form ? (
              <WordForm
                form={form}
                books={wordBookSets}
                onChange={setForm}
                onSubmit={submit}
                onCancel={cancelForm}
                error={error}
              />
            ) : (
              <Button full onClick={() => { setForm(emptyForm()); setError('') }} data-custom-word-add>
                <Plus size={17} /> 単語を登録する
              </Button>
            )}

            {customWords.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="secondary" onClick={() => startSession('vocabStudy')}>
                  自作単語を暗記
                </Button>
                <Button size="sm" variant="secondary" onClick={() => startSession('vocabQuiz')}>
                  自作単語をテスト
                </Button>
              </div>
            )}

            {customWords.length === 0 ? (
              <EmptyState icon="✍️" title="まだ自作単語はありません">
                辞書に無い語や、授業で出た語をここに登録すると、単語帳に入れて辞書の語と同じように暗記・テスト・復習ができます。
              </EmptyState>
            ) : (
              <ul className="space-y-2">
                {customWords.map((word) => (
                  <li key={word.id}>
                    <CustomWordCard
                      word={word}
                      inBook={bookedIds.has(word.id)}
                      onEdit={(target) => { setForm(formFromWord(target)); setError('') }}
                      onDelete={deleteCustomWord}
                      onOpenLists={setListSheetWord}
                    />
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <>
            <Card className="p-4">
              <h2 className="font-display text-base font-extrabold text-ink">ファイルに書き出す</h2>
              <p className="mt-1 text-xs font-bold leading-relaxed text-ink/55">
                いまの自作単語{customWords.length}語をJSONファイルとして保存します。
                保存先はお使いの端末（ダウンロード先のフォルダ）です。
              </p>
              <Button full size="sm" className="mt-2.5" onClick={download} disabled={!customWords.length}>
                <Download size={16} /> {customWordsFileName()} を保存
              </Button>
            </Card>

            <Card className="p-4">
              <h2 className="font-display text-base font-extrabold text-ink">ファイルから読み込む</h2>
              <p className="mt-1 text-xs font-bold leading-relaxed text-ink/55">
                書き出したJSONファイルを選ぶと、中の単語をこの端末へ取り込みます。
                取り込んだ語は、この画面でそのまま書き換え・削除できます。
              </p>
              <input
                ref={fileInput}
                type="file"
                accept="application/json,.json"
                data-custom-words-file-input
                onChange={(event) => {
                  openFile(event.target.files?.[0])
                  event.target.value = ''
                }}
                className="hidden"
              />
              <Button
                full
                size="sm"
                variant="secondary"
                className="mt-2.5"
                onClick={() => fileInput.current?.click()}
              >
                <Upload size={16} /> ファイルを選ぶ
              </Button>
            </Card>

            {pending && (
              <Card className="p-4" data-custom-words-import-choice>
                <p className="text-sm font-extrabold text-ink">
                  {pending.name} から{pending.words.length}語を読み込みました。
                </p>
                <p className="mt-1 text-xs font-bold leading-relaxed text-ink/55">
                  いまの{customWords.length}語にどう反映しますか。
                </p>
                <div className="mt-2.5 grid grid-cols-2 gap-2">
                  <Button size="sm" onClick={() => applyImport('merge')}>
                    足す・書き換える
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => applyImport('replace')}>
                    まるごと入れ替える
                  </Button>
                </div>
                <Button
                  full
                  size="sm"
                  variant="secondary"
                  className="mt-2"
                  onClick={() => setPending(null)}
                >
                  やめる
                </Button>
              </Card>
            )}

            {fileNotice && (
              <p
                className="rounded-2xl bg-brand-50 px-4 py-3 text-xs font-extrabold text-brand-700"
                data-custom-words-file-notice
              >
                {fileNotice}
              </p>
            )}

            <p className="px-1 text-[11px] font-bold leading-relaxed text-ink/45">
              自作単語はこの端末に保存され、ログインしていればクラウドにも保存されます。
              進捗コード・QRにも入りますが、語数が多いとQRに収まらないことがあります。
              端末を替えるときや、まとめて直したいときはこのファイルを使ってください。
            </p>
          </>
        )}
      </div>

      <WordListSheet
        open={Boolean(listSheetWord)}
        onClose={() => setListSheetWord(null)}
        wordId={listSheetWord?.id}
        wordLabel={listSheetWord?.word}
      />
    </div>
  )
}
