import { etymologyCardsForWord, etymologyStoryForWord, homographsFor } from '../data/vocab.js'
import { getLevel, levelChipText } from '../data/levels.js'
import { exampleSpeechAllowed } from '../lib/speechGuard.js'
import { SpeakButton } from './SpeakButton.jsx'
import { CustomEtymology, EtymologyBlock, HomographWords, OtherSenses, PosBadge } from './WordBits.jsx'
import { GrammarRoles } from './GrammarRoles.jsx'
import { PronunciationNote } from './PronunciationNote.jsx'
import { MeaningText } from './MeaningText.jsx'
import { ExplainedText, ExplanationScope } from './ExplainedText.jsx'
import { UsageGuideSection } from './UsageGuideCards.jsx'
import { UsageGuideProvider } from './UsageGuideLink.jsx'
import {
  AntonymSection,
  ConfusableSection,
  CustomDerivativeSection,
  CustomPhraseSection,
  IdiomEquivalentSection,
  LoanwordHint,
  SynonymSection,
  UsagePartnerSection,
  WordFormSection,
  WordPhraseSection,
} from './WordRelations.jsx'
import { StudyReviewHistory } from './StudyReviewHistory.jsx'
import { Chip } from './ui.jsx'
import { ArrowRight, Lightbulb } from './Icons.jsx'

/**
 * 英単語のカード1枚。暗記カード（VocabStudy）と、英和辞書・一覧などから開く単語の詳細（WordDetail）で
 * 同じものを使い、どこから開いても見慣れた並びで確かめられるようにする。
 * 詳細では開いた面（意味・例文・語源…）を最初から出す（flipped を true のまま渡す）。
 *
 * - relations / relatedPhrases: wordRelationsFor・phraseGroupsForWord の結果（呼ぶ側で語ごとに覚えておく）
 * - openWord: 関連語の辞書ページへ。navigateTo: 参考書・語根・熟語の仲間へ移るとき（暗記の途中なら記録を残してから）
 * - returnTo: 使い分けカード・熟語の学習から戻る先
 * - footer: 開いた面の末尾に置くもの（暗記カードの「辞書ページで関連語も見る」）
 */
export function WordStudyCard({
  word,
  entry = null,
  flipped,
  onOpen = null,
  spellingHidden = false,
  hideSpelling = false,
  showPhonetic = true,
  speechItems = [],
  speechKey = null,
  relations,
  relatedPhrases,
  openWord,
  navigateTo,
  returnTo = null,
  onRoot = null,
  onPack = null,
  onGrammarRef = null,
  footer = null,
}) {
  const level = getLevel(word.level)
  return (
    <div
      key={word.id}
      onClick={() => !flipped && onOpen?.()}
      className="animate-pop-in rounded-[2rem] bg-white p-6 shadow-card"
      data-word-study-card={word.id}
    >
      {/* 表：単語（左上に英検の級、右上に品詞） */}
      <div className="flex items-start justify-between gap-2" data-vocab-card-level>
        <Chip color={level.color}>{levelChipText(level)}</Chip>
        <PosBadge pos={word.pos} />
      </div>

      <div className="mt-2 flex flex-col items-center text-center">
        {spellingHidden ? (
          // スペルを隠すモード：意味から英単語を思い出す。つづり・発音記号・読み上げはカードを開くまで出さない。
          <>
            <p className="text-xs font-extrabold text-brand-500">意味</p>
            <h2 className="mt-1 font-display text-2xl font-extrabold leading-snug text-ink" data-vocab-spelling-hidden>
              <MeaningText>{word.meanings.join('・')}</MeaningText>
            </h2>
          </>
        ) : (
          <>
            <h2 className="font-display text-4xl font-extrabold tracking-tight text-ink">{word.word}</h2>
            {showPhonetic && word.phonetic && (
              <p className="mt-1 text-sm font-bold text-ink/45">{word.phonetic}</p>
            )}
            {/* 同じつづりで由来のちがう語が、別のカードになっている。どちらの語かは品詞と裏の意味で確かめる。 */}
            {homographsFor(word).length > 0 && (
              <p className="mt-1 text-[11px] font-extrabold text-rose-600/80" data-vocab-homograph-note>
                同じつづりの別の語があります
              </p>
            )}
            {/* 使い方で発音が変わる語は音声を出さない。裏を見る前は意味を書かない短い形で知らせる。 */}
            <PronunciationNote word={word} compact className="mt-1" />
            <div className="mt-3">
              <SpeakButton
                text={word.word}
                phrases={speechItems}
                phraseIndex={0}
                speechKey={speechKey}
                title="単語カード"
                size="lg"
              />
            </div>
          </>
        )}
        <StudyReviewHistory entry={entry} className="mt-2" />
      </div>

      {!flipped ? (
        <div className="mt-6 flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-brand-200 py-8 text-brand-400">
          <span className="text-sm font-extrabold">
            {hideSpelling ? 'タップしてスペルと発音を確かめる' : 'タップして意味と語源を見る'}
          </span>
          <ArrowRight size={20} className="rotate-90" />
        </div>
      ) : (
        <ExplanationScope selfId={word.id} onWord={openWord}>
        <div className="mt-5 space-y-4 animate-slide-up">
          {/* 意味 */}
          <div className="rounded-2xl bg-brand-50 p-4">
            <div className="text-xs font-extrabold text-brand-500">意味</div>
            <div className="mt-0.5 font-display text-xl font-extrabold text-ink">
              <MeaningText>{word.meanings.join('・')}</MeaningText>
            </div>
          </div>

          {/* 疑問詞・関係詞の語は、働き（疑問詞・関係代名詞など）ごとの意味と解説。参考書の単元へ移れる。 */}
          <GrammarRoles word={word} onGrammarRef={onGrammarRef ?? ((unitId) => navigateTo('grammarReference', { unitId }))} />

          {/* 使い方で発音が変わる語の読み分け */}
          <PronunciationNote word={word} />

          {/* 日本語に定着したカタカナ語。意味がずれる語は注意書きを添える。 */}
          <LoanwordHint hint={relations.loanword} />

          {/* 代表義以外の意味。取り違えないよう品詞と習う級を添えて並べる。 */}
          <OtherSenses senses={word.otherSenses} level={word.level} />

          {/* 由来のちがう、同じつづりの別の語。それぞれ独立したカードとして暗記する。 */}
          <HomographWords word={word} onWord={openWord} />

          {/* 例文 */}
          {word.example && (
            <div className="rounded-2xl bg-white p-3 ring-1 ring-brand-100">
              <div className="flex items-start gap-2">
                {exampleSpeechAllowed(word) && (
                  <SpeakButton
                    text={word.example.en}
                    phrases={speechItems}
                    phraseIndex={1}
                    speechKey={speechKey}
                    title="単語カード"
                    size="sm"
                  />
                )}
                <div className="flex-1">
                  <p className="font-bold text-ink" data-explain-exempt="例文">{word.example.en}</p>
                  <p className="mt-0.5 text-sm font-bold text-ink/55" data-explain-exempt="例文"><MeaningText>{word.example.ja}</MeaningText></p>
                </div>
              </div>
            </div>
          )}

          {/* 手動監査を通った語源だけを表示する。語根カードが無い語も成り立ちは出す。 */}
          {(etymologyCardsForWord(word).length > 0 || etymologyStoryForWord(word)) && (
            <div className="rounded-2xl bg-white p-4 ring-1 ring-brand-100">
              {/* 見出しは辞書ページ・テストの答え合わせと同じ「語の成り立ち」を1回だけ置く。 */}
              <div className="mb-2 flex items-center gap-1.5 text-brand-600">
                <Lightbulb size={16} />
                <span className="text-xs font-extrabold" data-etymology-heading>語の成り立ち</span>
              </div>
              <EtymologyBlock
                word={word}
                onRoot={onRoot ?? ((rootId) => navigateTo('rootDetail', { rootId }))}
                onPack={onPack ?? undefined}
                onWord={openWord}
              />
            </div>
          )}

          {/* 自作単語（英単語のカード）に自分で書いた語の成り立ち。 */}
          {word.custom && word.customEtymology && (
            <div className="rounded-2xl bg-white p-4 ring-1 ring-brand-100">
              <CustomEtymology word={word} />
            </div>
          )}

          {/* 使い方・使い分け（辞書ページと同じ中身）。 */}
          {word.usage && (
            <div className="rounded-2xl bg-amber-50 px-4 py-3 ring-1 ring-amber-100" data-word-usage>
              <div className="mb-1 flex items-center gap-1.5 text-amber-600">
                <Lightbulb size={14} />
                <span className="text-xs font-extrabold">使い方・使い分け</span>
              </div>
              <p className="text-sm font-bold leading-relaxed text-amber-900/90"><ExplainedText>{word.usage}</ExplainedText></p>
            </div>
          )}
          {/* 使い分けカードと、カードで比べる相手の語。下の関連語の行の相手が同じカードに入っていれば、行のボタンからこのカードへ移る。 */}
          <UsageGuideProvider guides={word.usageGuides}>
          <UsageGuideSection guides={word.usageGuides} self={{ wordId: word.id }} onWord={openWord} navigateTo={navigateTo} returnTo={returnTo} />

          {/* 自作単語に自分で書いた派生語・ほかの品詞の形。 */}
          {word.custom && relations.derivatives.length > 0 && (
            <div className="rounded-2xl bg-white p-4 ring-1 ring-emerald-100">
              <CustomDerivativeSection items={relations.derivatives} onWord={openWord} showPhonetic={showPhonetic} />
            </div>
          )}

          {/* 品詞がちがうだけで同じ語から来た形。発音を聞いて、その語の辞書ページへ移れる。 */}
          {(relations.forms.length > 0 || relations.sameForms.length > 0) && (
            <div className="rounded-2xl bg-white p-4 ring-1 ring-emerald-100">
              <WordFormSection items={relations.forms} sameItems={relations.sameForms} ownNote={relations.formOwnNote} onWord={openWord} showPhonetic={showPhonetic} />
            </div>
          )}

          {/* 意味が同じ・近い語、同じ意味の熟語、反対・対照の語。辞書にある語はタップでその語の辞書ページへ。 */}
          {(relations.synonyms.length > 0 || relations.idioms.length > 0 || relations.antonyms.length > 0 || relations.usagePartners.length > 0) && (
            <div className="space-y-3 rounded-2xl bg-white p-4 ring-1 ring-brand-100">
              <SynonymSection items={relations.synonyms} onWord={openWord} showPhonetic={showPhonetic} />
              <IdiomEquivalentSection phrases={relations.idioms} navigateTo={navigateTo} returnTo={returnTo} />
              <AntonymSection items={relations.antonyms} onWord={openWord} showPhonetic={showPhonetic} />
              <UsagePartnerSection items={relations.usagePartners} onWord={openWord} showPhonetic={showPhonetic} />
            </div>
          )}

          {/* つづりが似ていて間違えやすい語。ちがう文字に色をつける。 */}
          {relations.confusables.length > 0 && (
            <div className="rounded-2xl bg-white p-4 ring-1 ring-rose-100">
              <ConfusableSection word={word} items={relations.confusables} onWord={openWord} showPhonetic={showPhonetic} />
            </div>
          )}

          {/* 自作単語に自分で書いた熟語・構文。 */}
          {word.custom && word.customPhrases?.length > 0 && (
            <div className="rounded-2xl bg-white p-4 ring-1 ring-sky-100">
              <CustomPhraseSection word={word} />
            </div>
          )}

          {/* その語を含む熟語・構文と、ほかの品詞の形を使う熟語・構文。辞書ページと同じ中身。 */}
          {(relatedPhrases.all.length > 0 || relatedPhrases.viaForms.length > 0) && (
            <div className="rounded-2xl bg-white p-4 ring-1 ring-sky-100">
              <WordPhraseSection word={word} groups={relatedPhrases} navigateTo={navigateTo} returnTo={returnTo} />
            </div>
          )}
          </UsageGuideProvider>

          {footer}
        </div>
        </ExplanationScope>
      )}
    </div>
  )
}
