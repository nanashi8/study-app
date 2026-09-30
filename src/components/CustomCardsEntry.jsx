import { useShallow } from 'zustand/react/shallow'
import { useStore } from '../store/useStore.js'
import { CUSTOM_SUBJECT_BY_ID, customEntryCountForSubject } from '../lib/customCards.js'
import { ContentMenuButton } from './ContentMenu.jsx'
import { ChooserTile } from './ContentTop.jsx'
import { ArrowRight, Cards } from './Icons.jsx'

// 教科のアプリのホームに置く「自作カード」の入口。その教科を選んで登録したカード（と、その教科に表示するカテゴリーのカード）の
// 枚数を出し、押すとその教科の自作カード（一覧・暗記・テスト・登録）を開く。

const CUSTOM_CARD_COLOR = '#0891b2'

/** その教科のアプリに出す自作カードの枚数。 */
export function useCustomSubjectCount(subject) {
  const library = useStore(useShallow((state) => ({
    words: state.customWords,
    cards: state.customCards,
    categories: state.customCategories,
  })))
  return customEntryCountForSubject(library, subject)
}

function useOpenCustomCards(subject) {
  const navigate = useStore((state) => state.navigate)
  return () => navigate('customWords', { subject })
}

/** アプリのホーム（学ぶ内容を選ぶ一覧）に並べる入口。英語・古典・漢文のホームで使う。 */
export function CustomCardsMenuButton({ subject }) {
  const count = useCustomSubjectCount(subject)
  const open = useOpenCustomCards(subject)
  return (
    <ContentMenuButton
      icon={Cards}
      color={CUSTOM_CARD_COLOR}
      label="自作カード"
      detail={`${count}枚`}
      onClick={open}
      aria-label={`${CUSTOM_SUBJECT_BY_ID[subject].label}の自作カード。${count}枚`}
      data-custom-cards-entry={subject}
    />
  )
}

/** 選び方の入口（語句の一覧・単語帳と同じ形のタイル）。社会・理科のホームで使う。 */
export function CustomCardsTile({ subject, ...props }) {
  const count = useCustomSubjectCount(subject)
  const open = useOpenCustomCards(subject)
  return (
    <ChooserTile
      onClick={open}
      aria-label={`${CUSTOM_SUBJECT_BY_ID[subject].label}の自作カード。${count}枚`}
      data-custom-cards-entry={subject}
      icon={<Cards size={19} />}
      iconClassName="bg-cyan-100 text-cyan-700"
      label="自作カード"
      {...props}
    >
      {`${count}枚`}
    </ChooserTile>
  )
}

/** 大きめの入口のカード。数学のホーム（数学の歴史・入試演習と同じ形）で使う。 */
export function CustomCardsCard({ subject }) {
  const count = useCustomSubjectCount(subject)
  const open = useOpenCustomCards(subject)
  return (
    <button
      type="button"
      onClick={open}
      className="flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-card transition-transform active:scale-[0.98]"
      data-custom-cards-entry={subject}
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-100 text-2xl" aria-hidden="true">✍️</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] font-extrabold text-cyan-700">自分で作る</span>
        <span className="block font-display text-base font-extrabold text-ink">自作カード</span>
        <span className="mt-0.5 block text-xs font-bold leading-relaxed text-ink/55">
          {'公式・用語・一問一答などをテンプレートで登録して、暗記・テストする'}
        </span>
        <span className="mt-1 block text-[11px] font-extrabold text-cyan-700">{`${count}枚`}</span>
      </span>
      <ArrowRight size={20} className="shrink-0 text-cyan-700" />
    </button>
  )
}
