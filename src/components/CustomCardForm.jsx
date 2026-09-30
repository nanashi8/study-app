import { Card, cx } from './ui.jsx'
import { Close, Plus } from './Icons.jsx'
import {
  CUSTOM_CARD_LIMITS,
  CUSTOM_CARD_TEMPLATES,
  ENGLISH_TEMPLATE_ID,
  customCategoryChoices,
  templateFor,
} from '../lib/customCards.js'
import {
  CUSTOM_WORD_FIELDS,
  CUSTOM_WORD_LEVELS,
  CUSTOM_WORD_LIMITS,
  CUSTOM_WORD_POS,
  ENGLISH_WORD_FIELDS,
  ENGLISH_WORD_SECTIONS,
} from '../lib/customWords.js'

// 自作カードの登録欄。テンプレートを選ぶと、そのテンプレートの欄だけを出す。
// 「用語と意味」は用語と意味の2欄だけ、「英単語」は英単語の辞書ページ・暗記カードが使う情報の16欄。
// 分類は教科（その教科のアプリにも出る）か、自分で作ったカテゴリー。ここから新しいカテゴリーも作れる。

// 分類の選択肢で「新しいカテゴリーを作る」を表す値。
export const NEW_CATEGORY_OPTION = '__new-category__'

const inputClass = 'mt-1 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-bold text-ink outline-none focus:border-brand-500'
const textareaClass = 'mt-1 min-h-20 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold leading-relaxed text-ink outline-none focus:border-brand-500'
const selectClass = 'mt-1 h-11 w-full rounded-lg border border-slate-300 bg-white px-2 text-sm font-bold text-ink outline-none focus:border-brand-500'
const rowInputClass = 'h-11 min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-2.5 text-sm font-bold text-ink outline-none focus:border-brand-500'

function Field({ label, hint, required = false, children }) {
  return (
    <label className="block">
      <span className="text-[11px] font-extrabold text-ink/60">
        {label}
        {required && <span className="ml-1 text-rose-600">必須</span>}
      </span>
      {children}
      {hint && <span className="mt-0.5 block text-[11px] font-bold leading-relaxed text-ink/45">{hint}</span>}
    </label>
  )
}

/** テンプレートを選ぶ。名前を並べ、選んだテンプレートの説明（どの欄を書くか）を下に出す。 */
export function TemplateChooser({ value, onChange }) {
  const selected = templateFor(value)
  return (
    <div>
      <div className="grid grid-cols-2 gap-1.5" role="radiogroup" aria-label="テンプレート" data-custom-card-templates>
        {CUSTOM_CARD_TEMPLATES.map((template) => {
          const on = template.id === value
          return (
            <button
              key={template.id}
              type="button"
              role="radio"
              aria-checked={on}
              aria-label={template.label}
              onClick={() => onChange(template.id)}
              data-custom-card-template={template.id}
              className={cx(
                'flex min-h-12 items-center gap-1.5 rounded-xl border-2 px-2 py-1.5 text-left text-sm font-extrabold transition-colors',
                on ? 'border-brand-500 bg-brand-50 text-brand-800' : 'border-slate-200 bg-white text-ink active:bg-slate-50',
              )}
            >
              <span aria-hidden="true">{template.emoji}</span>
              <span className="min-w-0 flex-1 leading-snug">{template.label}</span>
            </button>
          )
        })}
      </div>
      <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs font-bold leading-relaxed text-ink/60" data-custom-card-template-description>
        {`${selected.label}：${selected.description}`}
      </p>
    </div>
  )
}

/** 分類（教科・自分のカテゴリー）を選ぶ。いちばん下で新しいカテゴリーを作れる。 */
export function CategorySelect({ value, categories, onChange, label = '分類（教科・カテゴリー）', allowNew = true, ...props }) {
  const choices = customCategoryChoices(categories)
  const subjects = choices.filter((choice) => choice.kind === 'subject')
  const custom = choices.filter((choice) => choice.kind === 'custom')
  return (
    <Field label={label} hint="教科を選ぶと、その教科のアプリにも出ます。カテゴリーは「表示する教科」を選ぶと、その教科のアプリにも出ます。">
      <select value={value} onChange={(event) => onChange(event.target.value)} className={selectClass} {...props}>
        <optgroup label="教科">
          {subjects.map((choice) => <option key={choice.id} value={choice.id}>{choice.title}</option>)}
        </optgroup>
        {custom.length > 0 && (
          <optgroup label="自分のカテゴリー">
            {custom.map((choice) => <option key={choice.id} value={choice.id}>{choice.title}</option>)}
          </optgroup>
        )}
        {allowNew && custom.length < CUSTOM_CARD_LIMITS.categories && (
          <option value={NEW_CATEGORY_OPTION}>＋ 新しいカテゴリーを作る</option>
        )}
      </select>
    </Field>
  )
}

/** 1つの欄（1行または複数行）。 */
function TextField({ item, value, onChange, limit }) {
  const props = {
    value,
    onChange: (event) => onChange(event.target.value),
    maxLength: limit,
    placeholder: item.placeholder,
    'data-custom-card-input': item.key,
  }
  return (
    <Field label={item.label} hint={item.hint} required={item.required}>
      {item.multiline
        ? <textarea rows={3} className={textareaClass} {...props} />
        : <input className={inputClass} {...props} />}
    </Field>
  )
}

// 行を足して書く欄（語と意味・品詞と意味・熟語と意味）の、行の中の2つの欄。
const ROW_SHAPES = Object.freeze({
  pair: { first: 'w', second: 'm', firstLabel: '語', secondLabel: '意味', firstLimit: CUSTOM_WORD_LIMITS.relatedWord, secondLimit: CUSTOM_WORD_LIMITS.relatedMeaning, max: CUSTOM_WORD_LIMITS.relatedWords },
  sense: { first: 'pos', second: 'meaning', firstLabel: '品詞', secondLabel: '意味', secondLimit: CUSTOM_WORD_LIMITS.meaning, max: CUSTOM_WORD_LIMITS.otherSenses },
  phrase: { first: 'phrase', second: 'meaning', firstLabel: '熟語・構文', secondLabel: '意味', firstLimit: CUSTOM_WORD_LIMITS.phrase, secondLimit: CUSTOM_WORD_LIMITS.phraseMeaning, max: CUSTOM_WORD_LIMITS.phrases },
})

const ROW_PLACEHOLDERS = Object.freeze({
  derivatives: ['例：popularity', '例：人気'],
  synonyms: ['例：famous', '例：有名な'],
  antonyms: ['例：unpopular', '例：不人気な'],
  confusables: ['例：populate', '例：住む'],
  phrases: ['例：be popular with ～', '例：～に人気がある'],
  otherSenses: [null, '例：大衆の・民衆の'],
})

/** 行を足して書く欄。行ごとに2つの欄と、行を消すボタン。 */
function RowListField({ item, rows, onChange, fallbackPos }) {
  const shape = ROW_SHAPES[item.list]
  const list = Array.isArray(rows) ? rows : []
  const [firstPlaceholder, secondPlaceholder] = ROW_PLACEHOLDERS[item.key] ?? ['', '']
  const update = (index, key, value) => onChange(list.map((row, at) => (at === index ? { ...row, [key]: value } : row)))
  const add = () => onChange([...list, item.list === 'sense'
    ? { pos: fallbackPos, meaning: '' }
    : { [shape.first]: '', [shape.second]: '' }])
  const remove = (index) => onChange(list.filter((_, at) => at !== index))
  return (
    <div data-custom-card-list={item.key}>
      <p className="text-[11px] font-extrabold text-ink/60">{item.label}</p>
      <ul className="mt-1 space-y-1.5">
        {list.map((row, index) => (
          <li key={index} className="flex items-center gap-1.5">
            {item.list === 'sense' ? (
              <select
                value={row.pos}
                onChange={(event) => update(index, 'pos', event.target.value)}
                aria-label={`${item.label}の${index + 1}行目の${shape.firstLabel}`}
                className="h-11 w-20 shrink-0 rounded-lg border border-slate-300 bg-white px-1 text-sm font-bold text-ink outline-none focus:border-brand-500"
              >
                {CUSTOM_WORD_POS.map((pos) => <option key={pos.id} value={pos.id}>{pos.label}</option>)}
              </select>
            ) : (
              <input
                value={row[shape.first] ?? ''}
                onChange={(event) => update(index, shape.first, event.target.value)}
                maxLength={shape.firstLimit}
                placeholder={firstPlaceholder ?? ''}
                aria-label={`${item.label}の${index + 1}行目の${shape.firstLabel}`}
                className={rowInputClass}
              />
            )}
            <input
              value={row[shape.second] ?? ''}
              onChange={(event) => update(index, shape.second, event.target.value)}
              maxLength={shape.secondLimit}
              placeholder={secondPlaceholder ?? ''}
              aria-label={`${item.label}の${index + 1}行目の${shape.secondLabel}`}
              className={rowInputClass}
            />
            <button
              type="button"
              onClick={() => remove(index)}
              aria-label={`${item.label}の${index + 1}行目を消す`}
              className="grid h-11 w-10 shrink-0 place-items-center rounded-lg text-ink/40 active:bg-slate-100"
            >
              <Close size={16} />
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={add}
        disabled={list.length >= shape.max}
        className="mt-1.5 inline-flex min-h-10 items-center gap-1 rounded-lg px-2 text-xs font-extrabold text-brand-600 active:bg-brand-50 disabled:text-ink/30"
        data-custom-card-list-add={item.key}
      >
        <Plus size={15} /> {`${item.label}を足す`}
      </button>
    </div>
  )
}

/** 英単語のテンプレートの欄（16欄）。まとまりごとに並べる。 */
function EnglishFields({ values, onChange }) {
  const set = (key) => (value) => onChange({ ...values, [key]: value })
  const field = (key) => ENGLISH_WORD_FIELDS.find((item) => item.key === key)
  const text = (key, extra = {}) => ({ ...field(key), ...extra })
  const renderField = (item) => {
    switch (item.key) {
      case 'word':
        return <TextField key="word" item={text('word', { placeholder: '例：popular' })} value={values.front} onChange={set('front')} limit={CUSTOM_WORD_LIMITS.word} />
      case 'meanings':
        return (
          <TextField
            key="meanings"
            item={text('meanings', { placeholder: '例：人気のある・大衆の', hint: `「・」で区切ると${CUSTOM_WORD_LIMITS.meanings}つまで並べられます` })}
            value={values.back}
            onChange={set('back')}
          />
        )
      case 'pos':
        return (
          <Field key="pos" label={item.label}>
            <select value={values.posId} onChange={(event) => set('posId')(event.target.value)} className={selectClass} data-custom-card-input="posId">
              {CUSTOM_WORD_POS.map((pos) => <option key={pos.id} value={pos.id}>{pos.label}</option>)}
            </select>
          </Field>
        )
      case 'level':
        return (
          <Field key="level" label={item.label}>
            <select value={values.level} onChange={(event) => set('level')(event.target.value)} className={selectClass} data-custom-card-input="level">
              {CUSTOM_WORD_LEVELS.map((level) => <option key={level.id} value={level.id}>{`英検${level.label}`}</option>)}
            </select>
          </Field>
        )
      case 'field':
        return (
          <Field key="field" label={item.label}>
            <select value={values.field} onChange={(event) => set('field')(event.target.value)} className={selectClass} data-custom-card-input="field">
              {CUSTOM_WORD_FIELDS.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
          </Field>
        )
      case 'phonetic':
        return <TextField key="phonetic" item={text('phonetic', { placeholder: '例：/ˈpɑːpjələr/' })} value={values.phonetic} onChange={set('phonetic')} limit={CUSTOM_WORD_LIMITS.phonetic} />
      case 'exampleEn':
        return <TextField key="exampleEn" item={text('exampleEn', { placeholder: '例：This song is popular with young people.', multiline: true })} value={values.example} onChange={set('example')} limit={CUSTOM_WORD_LIMITS.example} />
      case 'exampleJa':
        return <TextField key="exampleJa" item={text('exampleJa', { placeholder: '例：この歌は若い人たちに人気がある。', multiline: true })} value={values.exampleTranslation} onChange={set('exampleTranslation')} limit={CUSTOM_WORD_LIMITS.example} />
      case 'note':
        return <TextField key="note" item={text('note', { placeholder: '覚え方や、授業で聞いた補足など', multiline: true })} value={values.note} onChange={set('note')} limit={CUSTOM_WORD_LIMITS.note} />
      case 'etymology':
        return <TextField key="etymology" item={text('etymology', { placeholder: '例：ラテン語の populus（人々）から。「人々の」→「人気のある」', multiline: true })} value={values.etymology} onChange={set('etymology')} limit={CUSTOM_WORD_LIMITS.etymology} />
      default:
        return <RowListField key={item.key} item={item} rows={values[item.key]} onChange={set(item.key)} fallbackPos={values.posId} />
    }
  }
  return (
    <div className="space-y-4" data-custom-card-english-fields>
      {ENGLISH_WORD_SECTIONS.map((section) => {
        const items = ENGLISH_WORD_FIELDS.filter((item) => item.section === section.id)
        return (
          <section key={section.id} className="space-y-2.5" data-custom-card-section={section.id}>
            <h3 className="text-xs font-extrabold text-brand-700">{section.label}</h3>
            {section.id === 'basic' ? (
              <>
                {items.filter((item) => ['word', 'meanings'].includes(item.key)).map(renderField)}
                <div className="grid grid-cols-3 gap-2">
                  {items.filter((item) => ['pos', 'level', 'field'].includes(item.key)).map(renderField)}
                </div>
                {items.filter((item) => item.key === 'phonetic').map(renderField)}
              </>
            ) : items.map(renderField)}
          </section>
        )
      })}
    </div>
  )
}

/** 英単語以外のテンプレートの欄。 */
function CardFields({ template, values, onChange }) {
  return (
    <div className="space-y-2.5" data-custom-card-fields={template}>
      {templateFor(template).fields.map((item) => (
        <TextField
          key={item.key}
          item={item}
          value={values[item.key] ?? ''}
          onChange={(value) => onChange({ ...values, [item.key]: value })}
          limit={CUSTOM_CARD_LIMITS[item.key]}
        />
      ))}
    </div>
  )
}

/**
 * 登録欄のまとまり。テンプレート → 分類 → 欄 → 入れる単語帳（新しく作るときだけ）の順。
 * values は lib/customEntryForm.js の入れ物（どのテンプレートでも同じ）。
 */
export function CustomCardForm({
  template,
  onTemplateChange,
  values,
  onValuesChange,
  category,
  onCategoryChange,
  categories,
  newCategoryTitle,
  onNewCategoryTitleChange,
  books = [],
  bookId = '',
  onBookChange,
  editing = false,
  error = '',
}) {
  return (
    <div className="space-y-3" data-custom-card-form>
      <Card className="p-4">
        <h2 className="mb-2 text-sm font-extrabold text-ink">テンプレート</h2>
        <TemplateChooser value={template} onChange={onTemplateChange} />
      </Card>

      <Card className="space-y-2.5 p-4">
        <CategorySelect value={category} categories={categories} onChange={onCategoryChange} data-custom-card-category />
        {category === NEW_CATEGORY_OPTION && (
          <Field label="新しいカテゴリーの名前" required>
            <input
              value={newCategoryTitle}
              onChange={(event) => onNewCategoryTitleChange(event.target.value)}
              maxLength={CUSTOM_CARD_LIMITS.categoryTitle}
              placeholder="例：2学期中間英語"
              className={inputClass}
              data-custom-card-new-category
            />
          </Field>
        )}
      </Card>

      <Card className="p-4">
        <h2 className="mb-2 text-sm font-extrabold text-ink">{templateFor(template).label}</h2>
        {template === ENGLISH_TEMPLATE_ID
          ? <EnglishFields values={values} onChange={onValuesChange} />
          : <CardFields template={template} values={values} onChange={onValuesChange} />}
      </Card>

      {/* 登録と同時に入れる単語帳。どの単語帳も同じように選べる。 */}
      {!editing && (
        <Card className="p-4">
          <Field label="入れる単語帳">
            <select
              value={bookId}
              onChange={(event) => onBookChange(event.target.value)}
              data-custom-word-book-select
              className={selectClass}
            >
              <option value="">入れない</option>
              {books.map((book) => <option key={book.id} value={book.id}>{book.title}</option>)}
            </select>
          </Field>
        </Card>
      )}

      {error && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-extrabold text-rose-700" data-custom-word-error>
          {error}
        </p>
      )}
    </div>
  )
}
