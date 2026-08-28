import { Button, Card, cx } from './ui.jsx'
import { LearningStatusBars } from './LearningStatusBars.jsx'
import { ArrowRight, Book, BookOpen, Cards } from './Icons.jsx'

// 教材の入口カード。英単語の級カードと同じ並びを、熟語・構文、10分野、
// 古典、漢文でも共通に使う。
//   1段目：見出し（記号・題名・件数）
//   2段目：暗記とテストの進み具合
//   3段目：暗記／テスト
//   4段目：任意の絞り込み入口／一覧を確認
const NOTE_TONES = Object.freeze({
  muted: 'text-ink/45',
  alert: 'text-amber-700',
})

function EntryHeading({ emoji, icon, accentColor, title, chip, subtitle, countLabel, showArrow }) {
  return (
    <>
      {(emoji || icon) && (
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl"
          style={accentColor ? { backgroundColor: `${accentColor}22`, color: accentColor } : undefined}
          aria-hidden="true"
        >
          {emoji ?? icon}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-display text-lg font-extrabold text-ink">{title}</span>
          {chip}
        </span>
        {subtitle && <span className="mt-0.5 block text-xs font-bold leading-relaxed text-ink/50">{subtitle}</span>}
      </span>
      {countLabel && (
        <span className="shrink-0 text-xs font-extrabold tabular-nums text-ink/45">{countLabel}</span>
      )}
      {showArrow && <ArrowRight size={19} className="shrink-0 text-brand-500" />}
    </>
  )
}

export function LearningEntryCard({
  emoji,
  icon,
  accentColor,
  title,
  chip,
  subtitle,
  countLabel,
  onOpen,
  openAriaLabel,
  status,
  units,
  showQuizStatus = true,
  note,
  noteTone = 'muted',
  noteProps,
  studyLabel = '暗記',
  studyAriaLabel,
  studyDisabled = false,
  onStudy,
  quizLabel = 'テスト',
  quizAriaLabel,
  quizDisabled = false,
  onQuiz,
  browseLabel,
  browseIcon,
  browseAriaLabel,
  browseDisabled = false,
  browseProps,
  onBrowse,
  catalogLabel = '一覧を確認',
  catalogAriaLabel,
  catalogDisabled = false,
  catalogProps,
  onCatalog,
  className = '',
  children,
  ...rest
}) {
  const hasSubRow = Boolean(onBrowse || onCatalog)
  return (
    <Card className={cx('p-4', className)} {...rest}>
      {onOpen ? (
        <button
          type="button"
          onClick={onOpen}
          aria-label={openAriaLabel}
          className="flex w-full items-center gap-3 text-left transition-transform active:scale-[0.99]"
        >
          <EntryHeading
            emoji={emoji}
            icon={icon}
            accentColor={accentColor}
            title={title}
            chip={chip}
            subtitle={subtitle}
            countLabel={countLabel}
            showArrow
          />
        </button>
      ) : (
        <div className="flex items-center gap-3">
          <EntryHeading
            emoji={emoji}
            icon={icon}
            accentColor={accentColor}
            title={title}
            chip={chip}
            subtitle={subtitle}
            countLabel={countLabel}
          />
        </div>
      )}

      {status && (
        <LearningStatusBars
          progress={status}
          className="mt-3"
          compact
          units={units}
          showQuiz={showQuizStatus}
        />
      )}

      {note && (
        <p
          className={cx('mt-1.5 text-right text-[10px] font-extrabold', NOTE_TONES[noteTone] ?? NOTE_TONES.muted)}
          {...noteProps}
        >
          {note}
        </p>
      )}

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button
          variant="primary"
          size="sm"
          disabled={studyDisabled}
          onClick={onStudy}
          aria-label={studyAriaLabel}
        >
          <Book size={16} /> {studyLabel}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={quizDisabled}
          onClick={onQuiz}
          aria-label={quizAriaLabel}
        >
          <Cards size={16} /> {quizLabel}
        </Button>
      </div>

      {hasSubRow && (
        <div className={cx('mt-2 grid gap-2', onBrowse && onCatalog ? 'grid-cols-2' : 'grid-cols-1')}>
          {onBrowse && (
            <button
              type="button"
              onClick={onBrowse}
              disabled={browseDisabled}
              aria-label={browseAriaLabel}
              className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-paper px-2 text-xs font-extrabold text-brand-600 transition-transform active:scale-[0.98] disabled:opacity-50"
              {...browseProps}
            >
              {browseIcon}
              {browseLabel}
            </button>
          )}
          {onCatalog && (
            <button
              type="button"
              onClick={onCatalog}
              disabled={catalogDisabled}
              aria-label={catalogAriaLabel}
              className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-brand-50 px-2 text-xs font-extrabold text-brand-700 transition-transform active:scale-[0.98] disabled:opacity-50"
              {...catalogProps}
            >
              <BookOpen size={15} /> {catalogLabel}
            </button>
          )}
        </div>
      )}

      {children}
    </Card>
  )
}
