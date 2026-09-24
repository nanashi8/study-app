import { useStore } from '../store/useStore.js'
import {
  KOTEN_CATEGORIES,
  KOTEN_WORD_LEVEL_BY_ID,
  getKoten,
} from '../data/koten.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { Button, Card, Chip } from '../components/ui.jsx'
import { KotenText, KotenWord } from '../components/KotenFurigana.jsx'
import { WordBookButton } from '../components/WordListSheet.jsx'
import { LearningStatusBars } from '../components/LearningStatusBars.jsx'
import { StudyReviewHistory } from '../components/StudyReviewHistory.jsx'
import {
  KotenBackground,
  KotenKanjiLine,
  KotenWordConjugation,
  KotenWordGroups,
} from '../components/KotenWordExtras.jsx'
import { summarizeSrsItems } from '../lib/contentProgress.js'
import { Book, Lightbulb } from '../components/Icons.jsx'

// 古典単語の辞書ページ。英単語の辞書ページと同じく、1語の意味・用例・活用・仲間と使い分け・
// 時代背景を1枚にまとめ、仲間の語へそのまま移れる。
export function KotenWordDetailScreen() {
  const params = useStore((state) => state.params)
  const navigate = useStore((state) => state.navigate)
  const back = useStore((state) => state.back)
  const srs = useStore((state) => state.kotenSrs)
  const word = getKoten(params.id)

  if (!word) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="font-display text-lg font-extrabold text-ink">{'この古典単語は見つかりません'}</p>
        <Button onClick={back}>戻る</Button>
      </div>
    )
  }

  const level = KOTEN_WORD_LEVEL_BY_ID[word.level]
  const category = KOTEN_CATEGORIES.find((entry) => entry.id === word.category)
  const status = summarizeSrsItems([word], srs)
  const openWord = (id) => navigate('kotenWordDetail', { id })
  const studyGroup = (group) => navigate('kotenStudy', {
    ids: group.entries.map((entry) => entry.word.id),
    title: group.title,
  })

  return (
    <div className="flex h-full flex-col" data-koten-word-detail={word.id}>
      <div className="min-h-0 flex-1 overflow-y-auto pb-4" data-return-scroll="koten-word-detail">
        <ScreenHeader title={word.word} color="#f59e0b" />
        <div className="space-y-4 px-4 pt-3">
          <Card className="p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-extrabold text-amber-700">{word.pos}</span>
              {level && <Chip color={level.color}>{level.label}</Chip>}
              {category && <Chip color={category.color}>{category.emoji} {category.label}</Chip>}
            </div>
            <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-ink">
              <KotenWord word={word} />
            </h1>
            <KotenKanjiLine word={word} className="mt-2" />
            <div className="mt-3 rounded-2xl bg-amber-50 p-3">
              <p className="font-display text-xl font-extrabold text-ink"><KotenText>{word.meanings.join('・')}</KotenText></p>
            </div>
            <LearningStatusBars progress={status} className="mt-4" compact units={{ learning: '語', quiz: '問' }} />
            <StudyReviewHistory entry={srs?.[word.id]} className="mt-3 justify-start" />
          </Card>

          <Card className="p-4">
            <p className="text-[11px] font-extrabold tracking-wide text-amber-600">用例</p>
            <p className="mt-1 font-bold leading-relaxed text-ink"><KotenText>{word.example.ja}</KotenText></p>
            <p className="mt-0.5 text-sm font-bold leading-relaxed text-ink/55"><KotenText>{word.example.gendai}</KotenText></p>
          </Card>

          <Card className="p-4">
            <div className="mb-1.5 flex items-center gap-1.5 text-amber-600">
              <Lightbulb size={16} />
              <span className="text-[11px] font-extrabold tracking-wide">覚え方・ポイント</span>
            </div>
            <p className="text-sm font-bold leading-relaxed text-ink/75"><KotenText>{word.note}</KotenText></p>
          </Card>

          <KotenWordConjugation word={word} className="rounded-3xl bg-white p-4 shadow-card" />

          <KotenBackground text={word.background} />

          <Card className="p-4">
            <KotenWordGroups word={word} onOpenWord={openWord} onStudyGroup={studyGroup} />
          </Card>
        </div>
      </div>

      <div className="shrink-0 space-y-2 border-t border-amber-100 bg-white/95 p-4 backdrop-blur">
        <Button full onClick={() => navigate('kotenStudy', { ids: [word.id], title: word.word })}>
          <Book size={18} /> {'この語を暗記'}
        </Button>
        <WordBookButton domain="kotenVocab" itemId={word.id} itemLabel={word.word} className="text-amber-700 ring-1 ring-amber-200" />
      </div>
    </div>
  )
}
