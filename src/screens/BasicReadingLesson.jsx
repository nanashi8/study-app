import { useEffect, useRef, useState } from 'react'
import { useContentSettings, useScreenParam, useStore } from '../store/useStore.js'
import {
  BASIC_READING_KINDS,
  BASIC_READING_QUIZ_DOMAIN,
  basicReadingPassagesForLevel,
  basicReadingQuestionId,
  basicReadingThemeLabel,
  getBasicReadingPassage,
} from '../data/basic-reading/index.js'
import { getLevel } from '../data/levels.js'
import { READING_RULES_BY_ID, getReadingRulePhase } from '../data/reading-rules.js'
import {
  basicReadingParagraphs,
  basicReadingWordCount,
} from '../lib/basicReading.js'
import { limitQuizChoices, UNKNOWN_CHOICE_ID } from '../lib/quizChoices.js'
import { dismissSpeechPlayer, playSpeechItems } from '../lib/speech-player.js'
import { analyzeBasicReadingSentence, basicReadingSentence, basicReadingWordMeaning } from '../lib/basicReadingSentence.js'
import { ChoiceExplanations } from '../components/ChoiceExplanations.jsx'
import { ReadingSentenceDetail } from '../components/ReadingSentenceDetail.jsx'
import { SentenceTap } from '../components/SentenceTap.jsx'
import { Sheet } from '../components/Sheet.jsx'
import { ReadingRuleCard } from '../components/ReadingRuleCard.jsx'
import { SpeechSettingsButton } from '../components/SpeechSettings.jsx'
import { UnknownChoiceButton } from '../components/UnknownChoiceButton.jsx'
import { Button, Chip, IconButton, cx } from '../components/ui.jsx'
import { ArrowRight, BookOpen, Close, Lightbulb, Refresh, SpeakerWave } from '../components/Icons.jsx'

const readShown = (value) => value === true
const draftKey = (passageId) => `study-app:basic-reading:v1:${passageId}`

// 答えている途中で辞書や暗記へ移っても、戻ったときに同じ回答から続けられるよう、端末の一時保存に置く。
function readDraft(passageId) {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(draftKey(passageId)) ?? 'null')
    return {
      answers: parsed?.answers && typeof parsed.answers === 'object' ? parsed.answers : {},
      checked: parsed?.checked === true,
    }
  } catch {
    return { answers: {}, checked: false }
  }
}

function writeDraft(passageId, draft) {
  try {
    sessionStorage.setItem(draftKey(passageId), JSON.stringify(draft))
  } catch {
    // 一時保存を使えない環境では、この画面の中だけで回答を持つ。
  }
}

function StepTitle({ step, children }) {
  return (
    <h2 className="flex items-center gap-2 px-1 font-display text-base font-extrabold text-ink">
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-500 text-xs font-black text-white">{step}</span>
      {children}
    </h2>
  )
}

function RuleQuestion({ passage, lesson, index, answer, checked, onChoose }) {
  const rule = READING_RULES_BY_ID[lesson.rule]
  const phase = getReadingRulePhase(rule.phase)
  const questionId = basicReadingQuestionId(passage, lesson)
  const correctText = lesson.choices[lesson.answer][0]
  // 教材は4択、出題は「3択＋わからない」。解説も出題した選択肢だけを並べる。
  const shown = limitQuizChoices(lesson.choices, (_, choiceIndex) => choiceIndex === lesson.answer, { seed: questionId })
  const rows = shown.map(([text, note]) => ({
    id: text,
    heading: text,
    body: note,
    correct: text === correctText,
    chosen: answer === text,
  }))
  const unknown = answer === UNKNOWN_CHOICE_ID

  return (
    <fieldset className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200" data-basic-reading-question={questionId}>
      <legend className="sr-only">{`問${index + 1}`}</legend>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-black text-ink/45">問{index + 1}</span>
        <Chip color={phase.color}>{phase.step}. {phase.label}</Chip>
      </div>
      <p className="mt-1.5 text-xs font-extrabold text-sky-700">ルール：{rule.title}</p>
      <p className="mt-1.5 text-sm font-extrabold leading-relaxed text-ink">{lesson.question}</p>
      <div className="mt-3 space-y-2">
        {shown.map(([text]) => {
          const selected = answer === text
          const isCorrect = text === correctText
          const tone = checked
            ? isCorrect
              ? 'border-emerald-400 bg-correct-soft text-emerald-800'
              : selected
                ? 'border-rose-400 bg-wrong-soft text-rose-800'
                : 'border-transparent bg-paper text-ink/35'
            : selected
              ? 'border-brand-400 bg-brand-50 text-brand-800'
              : 'border-brand-100 bg-white text-ink'
          return (
            <button
              key={text}
              type="button"
              disabled={checked}
              aria-pressed={selected}
              onClick={() => onChoose(text)}
              className={cx('w-full rounded-xl border-2 px-3 py-2.5 text-left text-sm font-bold transition-colors', tone)}
            >
              {text}
            </button>
          )
        })}
        <UnknownChoiceButton
          selected={unknown}
          disabled={checked}
          onClick={() => onChoose(UNKNOWN_CHOICE_ID)}
          className="rounded-xl py-2.5"
        />
      </div>
      {checked && (
        <div className="mt-3 space-y-2" data-basic-reading-explanation={questionId}>
          <p className={cx('text-sm font-extrabold', answer === correctText ? 'text-emerald-600' : 'text-rose-600')}>
            {answer === correctText ? '正解' : unknown ? 'わからない（正解を確かめよう）' : '不正解'}
          </p>
          <div className="rounded-xl bg-sky-50 px-3 py-2.5">
            <p className="text-[10px] font-extrabold text-sky-700">この本文での使い方</p>
            <p className="mt-0.5 text-sm font-bold leading-relaxed text-ink/75">{lesson.how}</p>
          </div>
          <ul className="space-y-1" aria-label="ルールを使う文">
            {lesson.sentences.map((sentenceIndex) => (
              <li key={sentenceIndex} className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-bold leading-relaxed text-ink/70">
                <span className="font-black text-amber-700">第{sentenceIndex + 1}文 </span>
                <span className="font-display text-sm text-ink">{passage.sentences[sentenceIndex].en}</span>
                <span className="mt-0.5 block text-ink/55">{passage.sentences[sentenceIndex].ja}</span>
              </li>
            ))}
          </ul>
          <ChoiceExplanations title={`選択肢の説明（${rows.length}つすべて）`} name="basic-reading" rows={rows} />
          <ReadingRuleCard rule={rule} compact />
        </div>
      )}
    </fieldset>
  )
}

// 次の長文へ進むと同じ画面のまま params だけが変わるので、長文ごとに中身を作り直す。
export function BasicReadingLessonScreen() {
  const passageId = useStore((state) => state.params.passageId)
  return <BasicReadingLesson key={passageId ?? ''} passageId={passageId} />
}

function BasicReadingLesson({ passageId }) {
  const navigate = useStore((state) => state.navigate)
  const back = useStore((state) => state.back)
  const params = useStore((state) => state.params)
  const markReadingDone = useStore((state) => state.markReadingDone)
  const recordContentQuizResult = useStore((state) => state.recordContentQuizResult)
  const recordSkillResult = useStore((state) => state.recordSkillResult)
  const settings = useContentSettings()
  const passage = getBasicReadingPassage(passageId)
  const [showJa, setShowJa] = useScreenParam('showJa', readShown)
  const initial = useRef(readDraft(passageId)).current
  const [answers, setAnswers] = useState(initial.answers)
  const [checked, setChecked] = useState(initial.checked)
  const questionsRef = useRef(null)
  const [activeIdx, setActiveIdx] = useState(null)
  const [activeWord, setActiveWord] = useState(null)
  const sentenceSheetScrollRef = useRef(null)
  const recordVocabHistory = useStore((state) => state.recordVocabHistory)

  useEffect(() => {
    if (passage) writeDraft(passage.id, { answers, checked })
  }, [answers, checked, passage])

  // 画面を離れたら読み上げを止める。
  useEffect(() => dismissSpeechPlayer, [])

  if (!passage) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <p className="font-bold text-ink/50">長文が見つかりませんでした。</p>
        <Button onClick={back}>戻る</Button>
      </div>
    )
  }

  const level = getLevel(passage.level)
  const paragraphs = basicReadingParagraphs(passage)
  const lessons = passage.lessons
  const answeredAll = lessons.every((lesson) => answers[lesson.rule] != null)
  const correctCount = lessons.filter((lesson) => answers[lesson.rule] === lesson.choices[lesson.answer][0]).length
  const levelPassages = basicReadingPassagesForLevel(passage.level)
  const nextPassage = levelPassages[levelPassages.findIndex((item) => item.id === passage.id) + 1] ?? null

  const choose = (rule, value) => {
    if (checked) return
    setAnswers((current) => ({ ...current, [rule]: value }))
  }

  const check = () => {
    if (!answeredAll) {
      questionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    setChecked(true)
    markReadingDone(passage.id)
    for (const lesson of lessons) {
      const correct = answers[lesson.rule] === lesson.choices[lesson.answer][0]
      recordContentQuizResult(BASIC_READING_QUIZ_DOMAIN, basicReadingQuestionId(passage, lesson), correct ? 1 : 0, 1)
    }
    recordSkillResult('reading', correctCount, lessons.length)
  }

  const retry = () => {
    setAnswers({})
    setChecked(false)
    questionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // 文を押すと、長文と同じ一文の構文解説（構造台帳から作る）を開く。
  const openSentence = (index) => {
    dismissSpeechPlayer()
    setActiveWord(null)
    if (sentenceSheetScrollRef.current) sentenceSheetScrollRef.current.scrollTop = 0
    setActiveIdx(index)
  }
  const closeSentence = () => {
    dismissSpeechPlayer()
    setActiveIdx(null)
  }
  const tapToken = (token) => {
    playSpeechItems([{ text: token.word, label: token.word, style: 'word' }], {
      title: '単語の読み上げ',
      rate: settings.ttsRate,
      voiceURI: settings.ttsVoiceURI,
      japaneseVoiceURI: settings.ttsJapaneseVoiceURI,
    })
    const meaning = basicReadingWordMeaning(passage, token.key)
    if (meaning?.id) recordVocabHistory(meaning.id)
    setActiveWord({ word: token.word, ja: meaning?.ja ?? null, id: meaning?.id ?? null })
  }
  const activeSentence = activeIdx != null ? basicReadingSentence(passage, activeIdx) : null
  const activeAnalysis = activeIdx != null ? analyzeBasicReadingSentence(passage, activeIdx) : null

  const readAloud = () => playSpeechItems(
    passage.sentences.map((sentence) => ({ label: sentence.en, text: sentence.en, style: 'passage' })),
    {
      title: '基礎長文・全文',
      rate: settings.ttsRate,
      voiceURI: settings.ttsVoiceURI,
      japaneseVoiceURI: settings.ttsJapaneseVoiceURI,
      autoAdvance: true,
      pauseBetweenItemsMs: 250,
    },
  )

  return (
    <div className="flex h-full flex-col" data-basic-reading-lesson={passage.id}>
      <header
        className="flex items-center gap-1 px-2 py-2.5"
        style={{ background: `linear-gradient(to bottom, ${level.color}22, transparent)` }}
      >
        <IconButton onClick={back} aria-label="閉じる">
          <Close size={22} />
        </IconButton>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-base font-extrabold text-ink">{passage.title}</h1>
          <p className="truncate text-xs font-bold text-ink/50">{passage.titleJa}</p>
        </div>
        <SpeechSettingsButton compact />
        <Chip color={level.color}>英検{level.label}</Chip>
      </header>

      {/* relative：問題の sr-only の見出しをこの欄の中に置く。外枠を基準にすると外枠がはみ出し、
          「ルールの問題へ」などのスクロールで外枠ごと動いて上の帯（戻る・メニュー）が画面の外へ出る。 */}
      <div className="relative flex-1 space-y-4 overflow-y-auto px-4 pb-6 pt-1" data-return-scroll="basicReadingLesson">
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-extrabold text-brand-700">{basicReadingThemeLabel(passage)}</span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-extrabold text-ink/60">{BASIC_READING_KINDS[passage.kind]}</span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-extrabold text-ink/60">本文 {basicReadingWordCount(passage)}語</span>
        </div>

        {/* 長文と同じ操作バー：読解の準備（単語・熟語・表現と読解ルール）と、全30ルールへ。 */}
        <div className="flex flex-wrap items-center gap-2" data-basic-reading-lesson-tools>
          <button
            type="button"
            onClick={() => navigate('basicReadingPrep', { passageId: passage.id, returnTo: params.returnTo })}
            className="flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1.5 text-xs font-extrabold text-brand-700"
            data-basic-reading-lesson-prep
          >
            <BookOpen size={14} /> 単語・熟語・表現
          </button>
          <button
            type="button"
            onClick={() => navigate('readingRules')}
            className="flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1.5 text-xs font-extrabold text-sky-700"
          >
            <Lightbulb size={14} /> 読解ルール
          </button>
        </div>

        <section className="space-y-2">
          <StepTitle step={1}>本文を読む</StepTitle>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowJa((value) => !value)}
              aria-pressed={showJa}
              className={cx(
                'rounded-full px-3 py-1.5 text-xs font-extrabold transition-colors',
                showJa ? 'bg-brand-500 text-white' : 'bg-brand-100 text-brand-700',
              )}
            >
              和訳 {showJa ? 'ON' : 'OFF'}
            </button>
            <button
              type="button"
              onClick={readAloud}
              className="flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1.5 text-xs font-extrabold text-brand-700"
            >
              <SpeakerWave size={14} /> 全文を読み上げ
            </button>
          </div>
          <p className="px-1 text-xs font-bold text-ink/45">
            {'文を押すと、前から読む訳と文の組み立ての解説が開きます。'}
          </p>
          {/* 段落の間は文の間より大きく空け、段落の第1文を字下げする（和訳ON・OFFとも。長文と同じ）。 */}
          <div className="space-y-8 rounded-3xl bg-white p-5 text-lg leading-loose text-ink shadow-card" data-basic-reading-passage-text>
            {paragraphs.map((paragraph, paragraphIndex) => (
              <section key={paragraphIndex} data-reading-paragraph>
                {/* 和訳ONは英文と和訳を一文ごとに交互に並べ、OFFは英文だけを段落で読む。 */}
                {showJa ? (
                  <div className="space-y-3">
                    {paragraph.map(({ item, index }, sentenceIndex) => (
                      <div key={index} data-sentence-translation-pair>
                        <p
                          className={sentenceIndex === 0 ? 'indent-[1.5em]' : undefined}
                          data-reading-paragraph-first={sentenceIndex === 0 ? '' : undefined}
                        >
                          <span className="mr-0.5 align-super text-[10px] font-black text-ink/30">{index + 1}</span>
                          <SentenceTap onOpen={() => openSentence(index)} data-basic-reading-sentence={index + 1}>
                            {item.en}
                          </SentenceTap>
                        </p>
                        <p
                          className="mt-1 border-l-2 border-brand-200 pl-2 text-sm font-bold leading-relaxed text-ink/55"
                          data-sentence-translation
                        >
                          {item.ja}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="indent-[1.5em]" data-reading-paragraph-first>
                    {paragraph.map(({ item, index }) => (
                      <span key={index}>
                        <span className="mr-0.5 align-super text-[10px] font-black text-ink/30">{index + 1}</span>
                        <SentenceTap onOpen={() => openSentence(index)} data-basic-reading-sentence={index + 1}>
                          {item.en}
                        </SentenceTap>{' '}
                      </span>
                    ))}
                  </p>
                )}
              </section>
            ))}
          </div>
        </section>

        <section className="scroll-mt-3 space-y-2" ref={questionsRef}>
          <StepTitle step={2}>ルールを使って解く</StepTitle>
          <div className="space-y-3">
            {lessons.map((lesson, index) => (
              <RuleQuestion
                key={lesson.rule}
                passage={passage}
                lesson={lesson}
                index={index}
                answer={answers[lesson.rule]}
                checked={checked}
                onChoose={(value) => choose(lesson.rule, value)}
              />
            ))}
          </div>
          {checked && (
            <div className="rounded-2xl bg-brand-50 p-3 text-center" data-basic-reading-score={`${correctCount}/${lessons.length}`}>
              <p className="font-display text-lg font-extrabold text-brand-700">{correctCount}/{lessons.length}問 正解</p>
              <p className="text-xs font-bold text-brand-600/70">読んだ長文として記録しました</p>
            </div>
          )}
        </section>
      </div>

      <div className="shrink-0 border-t border-brand-100 bg-white/90 p-4 backdrop-blur">
        {checked ? (
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" className="min-h-12" onClick={retry}>
              <Refresh size={16} /> 解き直す
            </Button>
            <Button
              className="min-h-12"
              onClick={() => (nextPassage
                ? navigate('basicReadingLesson', { passageId: nextPassage.id })
                : navigate('basicReading', { level: passage.level }))}
            >
              {nextPassage ? '次の長文へ' : '級の一覧へ'} <ArrowRight size={18} />
            </Button>
          </div>
        ) : (
          <Button full size="lg" onClick={check} data-basic-reading-check>
            {answeredAll ? '答え合わせ' : `ルールの問題へ（${Object.keys(answers).length}/${lessons.length}問）`}
            <ArrowRight size={18} />
          </Button>
        )}
      </div>

      <Sheet
        open={activeIdx != null}
        onClose={closeSentence}
        title="一文の構文解説"
        maxH="88vh"
        scrollAreaRef={sentenceSheetScrollRef}
        footer={activeSentence ? (
          <nav className="flex items-center justify-between gap-2" aria-label="文の移動" data-basic-reading-sentence-navigation>
            <Button
              variant="secondary"
              size="sm"
              className="min-h-12"
              disabled={activeIdx === 0}
              onClick={() => openSentence(activeIdx - 1)}
            >
              ← 前の文
            </Button>
            <span className="text-xs font-bold text-ink/40" aria-live="polite">
              {activeIdx + 1}/{passage.sentences.length}
            </span>
            <Button
              variant="secondary"
              size="sm"
              className="min-h-12"
              disabled={activeIdx >= passage.sentences.length - 1}
              onClick={() => openSentence(activeIdx + 1)}
            >
              次の文 →
            </Button>
          </nav>
        ) : null}
      >
        <ReadingSentenceDetail
          sentence={activeSentence}
          sentenceAnalysis={activeAnalysis}
          activeWord={activeWord}
          onWordTap={tapToken}
          onNavigateAway={closeSentence}
          resolveWord={(key) => basicReadingWordMeaning(passage, key)}
        />
      </Sheet>
    </div>
  )
}
