import { useEffect, useMemo, useRef, useState } from 'react'
import { ScreenHeader } from '../components/AppShell.jsx'
import { cx } from '../components/ui.jsx'
import { useStore } from '../store/useStore.js'
import {
  battleEmotionById,
  battleStudentById,
  battleStudentLifestylePortrait,
  battleStudentPortrait,
} from '../lib/battleCast.js'
import {
  CHARACTER_TALK_TOPICS,
  characterTalkChoices,
  characterTalkHash,
  characterTalkPersonaById,
  chooseCharacterTalkCompanion,
  createCharacterTalkExchange,
  createCharacterTalkOpening,
} from '../lib/characterTalk.js'
import {
  CHARACTER_DAILY_CATEGORIES,
  characterDailyQuestionById,
  characterDailyQuestionSuggestions,
  createCharacterDailyExchange,
  nextCharacterSchoolTest,
} from '../lib/characterDailyTalk.js'
import {
  characterDailyVisualById,
  characterDailyVisualForCategory,
  characterDailyVisualsByStudent,
} from '../lib/characterDailyVisuals.js'
import {
  characterGrievanceChoices,
  characterGrievancePrompt,
  createCharacterGrievanceExchange,
} from '../lib/characterGrievanceTalk.js'
import { characterRevealSceneById } from '../lib/characterRevealScenes.js'
import { AFTER_SCHOOL_CHRONICLE } from '../lib/afterSchoolStory.js'
import { unlockedBattleStudents } from '../lib/afterSchoolBonds.js'

const MAX_VISIBLE_MESSAGES = 42
function dailyOutfitForCategory(categoryId) {
  return CHARACTER_DAILY_CATEGORIES.find((category) => category.id === categoryId)?.outfitId
    ?? 'uniform'
}

function characterPortraitForOutfit(studentId, emotionId, outfitId = 'uniform') {
  return outfitId === 'home' || outfitId === 'weekend' || outfitId === 'club'
    ? battleStudentLifestylePortrait(studentId, outfitId)
    : battleStudentPortrait(studentId, emotionId)
}

function characterPortraitLabel(outfitId, emotionId) {
  if (outfitId === 'home') return '自宅の私服'
  if (outfitId === 'weekend') return '休日の私服'
  if (outfitId === 'club') return '部活動中の姿'
  return `${battleEmotionById(emotionId).label}の表情`
}

function nextConversationSeed(seed, salt) {
  return characterTalkHash(`${seed}|${salt}|${Date.now()}|${Math.random()}`)
}

function latestEmotion(messages, studentId, fallback = 'idle') {
  return [...messages]
    .reverse()
    .find((message) => message.studentId === studentId)?.emotionId ?? fallback
}

function TalkMessage({ message }) {
  if (message.role === 'user') {
    const student = battleStudentById(message.studentId)
    const emotion = battleEmotionById(message.emotionId)
    return (
      <div className="character-talk-message flex items-start justify-end gap-2">
        <div className="max-w-[85%] rounded-[1.25rem] rounded-br-md bg-gradient-to-br from-violet-500 to-fuchsia-500 px-3 py-2 text-white shadow-md">
          <span className="block text-[8px] font-extrabold tracking-[0.12em] text-white/65">
            {student.name}（あなた） · {emotion.emoji} {emotion.label}
          </span>
          <p className="mt-0.5 text-[11px] font-extrabold leading-relaxed">
            {message.text}
          </p>
        </div>
        <span className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border-2 border-violet-200 bg-slate-900 shadow-md">
          <img
            src={characterPortraitForOutfit(student.id, emotion.id, message.outfitId)}
            alt={`${student.name}（主人公）の${characterPortraitLabel(message.outfitId, emotion.id)}`}
            className="h-full w-full object-cover"
          />
        </span>
      </div>
    )
  }

  const student = battleStudentById(message.studentId)
  const emotion = battleEmotionById(message.emotionId)
  return (
    <div className="character-talk-message flex items-start gap-2">
      <span className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border-2 border-white bg-slate-900 shadow-md">
        <img
          src={characterPortraitForOutfit(student.id, emotion.id, message.outfitId)}
          alt={`${student.name}の${characterPortraitLabel(message.outfitId, emotion.id)}`}
          className="h-full w-full object-cover"
        />
      </span>
      <div className="max-w-[82%] rounded-[1.25rem] rounded-tl-md border border-slate-200 bg-white px-3 py-2 text-ink shadow-sm">
        <span className="block text-[8px] font-extrabold" style={{ color: student.accent }}>
          {student.name} · {emotion.emoji} {emotion.label}
        </span>
        <p className="mt-0.5 text-[11px] font-bold leading-relaxed">
          {message.text}
        </p>
      </div>
    </div>
  )
}

function CharacterRevealDialog({
  student,
  scene,
  selectedChoiceId,
  onChoice,
  onKeep,
  onClose,
}) {
  const selectedChoice = scene.choices.find((choice) => choice.id === selectedChoiceId)

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/75 p-2 backdrop-blur-sm sm:items-center">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="character-reveal-title"
        className="flex max-h-[94dvh] w-full max-w-lg flex-col overflow-hidden rounded-[1.75rem] border border-white/20 bg-slate-950 text-white shadow-2xl"
      >
        <div className="relative aspect-video shrink-0 overflow-hidden bg-slate-900">
          <img
            src={scene.image}
            alt={scene.imageAlt}
            className="h-full w-full object-cover"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 px-4 pb-3">
            <p className="text-[8px] font-extrabold tracking-[0.18em] text-fuchsia-200">
              SECRET FOUND · {scene.place}
            </p>
            <h2 id="character-reveal-title" className="font-display text-lg font-extrabold">
              {scene.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-slate-950/65 text-sm font-extrabold text-white"
            aria-label="発覚シーンを閉じる"
          >
            ×
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-[calc(1rem+var(--app-bottom-clearance))] pt-3">
          <p className="text-[10px] font-bold leading-relaxed text-white/70">
            {scene.discovery}
          </p>
          <blockquote className="mt-2 rounded-2xl border border-fuchsia-300/20 bg-fuchsia-300/10 px-3 py-2 text-[11px] font-extrabold leading-relaxed text-fuchsia-50">
            {student.name}：{scene.caughtLine}
          </blockquote>

          {selectedChoice ? (
            <div className="mt-3">
              <p className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-[11px] font-bold leading-relaxed text-cyan-50">
                {selectedChoice.response}
              </p>
              {scene.growth && (
                <section
                  aria-label={`${student.name}のその後`}
                  className="mt-3 overflow-hidden rounded-2xl border border-amber-200/20 bg-amber-100/5"
                >
                  <div className="px-3 pb-2 pt-3">
                    <p className="text-[8px] font-extrabold tracking-[0.18em] text-amber-200">
                      AFTER THE SECRET
                    </p>
                    <h3 className="mt-0.5 font-display text-sm font-extrabold text-white">
                      {scene.growth.title}
                    </h3>
                    <p className="mt-1 text-[9px] font-bold leading-relaxed text-white/65">
                      {scene.growth.intro}
                    </p>
                  </div>
                  <div className="space-y-2 px-2 pb-2">
                    {scene.growth.steps.map((step) => (
                      <article
                        key={step.id}
                        className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900"
                      >
                        <div className="relative aspect-video overflow-hidden bg-slate-800">
                          <img
                            src={step.image}
                            alt={step.imageAlt}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                          <span className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                          <div className="absolute inset-x-0 bottom-0 px-3 pb-2">
                            <p className="text-[7px] font-extrabold tracking-[0.16em] text-amber-200">
                              {step.eyebrow}
                            </p>
                            <h4 className="text-[11px] font-extrabold text-white">
                              {step.title}
                            </h4>
                          </div>
                        </div>
                        <p className="px-3 py-2 text-[9px] font-bold leading-relaxed text-white/65">
                          {step.text}
                        </p>
                      </article>
                    ))}
                  </div>
                </section>
              )}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onChoice(null)}
                  className="min-h-11 rounded-2xl border border-white/15 bg-white/5 px-3 text-[10px] font-extrabold text-white/75"
                >
                  別の返しを選ぶ
                </button>
                <button
                  type="button"
                  onClick={onKeep}
                  className="min-h-11 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-violet-500 px-3 text-[10px] font-extrabold text-white shadow-lg"
                >
                  この続きで話す
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-3 grid gap-2" role="group" aria-label={`${student.name}へ返す言葉`}>
              {scene.choices.map((choice) => (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => onChoice(choice.id)}
                  className="min-h-11 rounded-2xl border border-white/15 bg-white/5 px-3 py-2 text-left text-[10px] font-extrabold text-white transition-colors active:bg-white/10"
                >
                  <span className="mr-1" aria-hidden="true">{choice.emoji}</span>
                  {choice.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function CharacterTalkLocked({ students, onOpenStory }) {
  return (
    <div className="min-h-full bg-gradient-to-b from-slate-950 via-indigo-950 to-violet-950 pb-8 text-white">
      <ScreenHeader
        title={`${AFTER_SCHOOL_CHRONICLE.shortTitle}・仲間との会話`}
        subtitle="出会った仲間だけが集まる放課後トーク"
        color="#0f172a"
        inverse
      />
      <div className="px-4">
        <section className="overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.07] p-5 text-center shadow-2xl">
          <div className="mx-auto flex w-fit -space-x-2">
            {students.map((student) => (
              <img
                key={student.id}
                src={battleStudentPortrait(student.id, 'curious')}
                alt={student.name}
                className="h-14 w-14 rounded-2xl border-2 border-white/60 bg-slate-900 object-cover [image-rendering:pixelated]"
              />
            ))}
            {Array.from({ length: Math.max(0, 3 - students.length) }).map((_, index) => (
              <span key={index} className="grid h-14 w-14 place-items-center rounded-2xl border-2 border-white/20 bg-slate-900 text-lg text-white/35">🔒</span>
            ))}
          </div>
          <p className="mt-4 text-[9px] font-extrabold tracking-[0.16em] text-cyan-200">FRIEND GROUP {students.length}/3</p>
          <h1 className="mt-1 font-display text-lg font-extrabold">あと{3 - students.length}人と出会うと、みんなで話せる</h1>
          <p className="mt-2 text-[10px] font-bold leading-relaxed text-white/55">
            先生戦のあとの放課後イベントでクラスメイトと知り合うと、共闘できる仲間と会話の相手が増えます。
          </p>
          <button
            type="button"
            onClick={onOpenStory}
            className="mt-5 min-h-12 w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-400 px-4 text-xs font-extrabold text-slate-950 active:scale-[0.99]"
          >
            噂の調査と先生課題へ戻る
          </button>
        </section>
      </div>
    </div>
  )
}

export function CharacterTalkScreen() {
  const unlockedStudentIds = useStore((state) => state.unlockedBattleStudentIds)
  const navigate = useStore((state) => state.navigate)
  const students = unlockedBattleStudents(unlockedStudentIds)
  return students.length < 3
    ? <CharacterTalkLocked students={students} onOpenStory={() => navigate('afterSchoolChronicle')} />
    : <CharacterTalkConversation talkStudents={students} />
}

function CharacterTalkConversation({ talkStudents }) {
  const preferredStudentId = useStore((state) => state.battleStudentId)
  const talkStudentIds = talkStudents.map((student) => student.id)
  const boot = useRef(null)
  if (!boot.current) {
    const seed = characterTalkHash(`${Date.now()}|${Math.random()}|character-talk`)
    const player = talkStudents.find((student) => student.id === preferredStudentId)
      ?? talkStudents[0]
    const speaker = chooseCharacterTalkCompanion(
      player.id,
      `${seed}|speaker`,
      null,
      talkStudentIds,
    )
    const companion = chooseCharacterTalkCompanion(
      speaker.id,
      `${seed}|companion`,
      player.id,
      talkStudentIds,
    )
    const topic = CHARACTER_TALK_TOPICS[seed % CHARACTER_TALK_TOPICS.length]
    const opening = createCharacterTalkOpening({
      playerId: player.id,
      speakerId: speaker.id,
      companionId: companion.id,
      topicId: topic.id,
      seed,
    })
    boot.current = { seed, opening }
  }

  const [seed, setSeed] = useState(boot.current.seed)
  const [speakerId, setSpeakerId] = useState(boot.current.opening.speaker.id)
  const [companionId, setCompanionId] = useState(boot.current.opening.companion.id)
  const [topicId, setTopicId] = useState(boot.current.opening.topic.id)
  const [messages, setMessages] = useState(boot.current.opening.messages)
  const [turn, setTurn] = useState(0)
  const [talkMode, setTalkMode] = useState('ask')
  const [dailyCategoryId, setDailyCategoryId] = useState('school')
  const [dailyVisualId, setDailyVisualId] = useState('home-study')
  const [revealOpen, setRevealOpen] = useState(false)
  const [revealChoiceId, setRevealChoiceId] = useState(null)
  const logRef = useRef(null)
  const controlsRef = useRef(null)

  const player = boot.current.opening.player
  const speaker = battleStudentById(speakerId)
  const companion = battleStudentById(companionId)
  const topic = CHARACTER_TALK_TOPICS.find((item) => item.id === topicId)
    ?? CHARACTER_TALK_TOPICS[0]
  const speakerPersona = characterTalkPersonaById(speaker.id)
  const revealScene = characterRevealSceneById(speaker.id)
  const choices = useMemo(
    () => characterTalkChoices({ topicId: topic.id, speakerId: speaker.id, seed, turn }),
    [seed, speaker.id, topic.id, turn],
  )
  const dailyQuestions = useMemo(
    () => characterDailyQuestionSuggestions({
      categoryId: dailyCategoryId,
      speakerId: speaker.id,
      seed,
      turn,
    }),
    [dailyCategoryId, seed, speaker.id, turn],
  )
  const dailyVisuals = useMemo(
    () => characterDailyVisualsByStudent(speaker.id),
    [speaker.id],
  )
  const activeDailyVisual = characterDailyVisualById(speaker.id, dailyVisualId)
  const grievancePrompt = useMemo(
    () => characterGrievancePrompt({ speakerId: speaker.id, seed, turn }),
    [seed, speaker.id, turn],
  )
  const grievanceChoices = useMemo(
    () => characterGrievanceChoices({
      playerId: player.id,
      speakerId: speaker.id,
      seed,
      turn,
    }),
    [player.id, seed, speaker.id, turn],
  )
  const nextSchoolTest = nextCharacterSchoolTest()
  const playerEmotion = latestEmotion(messages, player.id, 'confident')
  const speakerEmotion = latestEmotion(messages, speaker.id, 'idle')
  const companionEmotion = latestEmotion(messages, companion.id, 'gentle')
  const dailyOutfitId = dailyOutfitForCategory(dailyCategoryId)
  const activeOutfitId = talkMode === 'grievance' ? 'uniform' : dailyOutfitId

  useEffect(() => {
    const node = logRef.current
    if (node) node.scrollTo({ top: node.scrollHeight, behavior: turn ? 'smooth' : 'auto' })
  }, [messages, turn])

  useEffect(() => {
    if (!revealOpen) return undefined
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setRevealOpen(false)
        setRevealChoiceId(null)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [revealOpen])

  const restartConversation = ({
    nextSpeakerId = speaker.id,
    nextCompanionId = companion.id,
    nextTopicId = topic.id,
    salt = 'restart',
  } = {}) => {
    const nextSeed = nextConversationSeed(seed, `${salt}|${turn}`)
    const opening = createCharacterTalkOpening({
      playerId: player.id,
      speakerId: nextSpeakerId,
      companionId: nextCompanionId,
      topicId: nextTopicId,
      seed: nextSeed,
    })
    setSeed(nextSeed)
    setSpeakerId(opening.speaker.id)
    setCompanionId(opening.companion.id)
    setTopicId(opening.topic.id)
    setMessages(opening.messages)
    setTurn(0)
    setRevealOpen(false)
    setRevealChoiceId(null)
  }

  const selectSpeaker = (nextSpeakerId) => {
    if (nextSpeakerId === player.id) return
    const nextCompanionId = nextSpeakerId === companion.id ? speaker.id : companion.id
    setDailyVisualId(
      characterDailyVisualForCategory(nextSpeakerId, dailyCategoryId).sceneId,
    )
    restartConversation({
      nextSpeakerId,
      nextCompanionId,
      salt: `speaker-${nextSpeakerId}`,
    })
    if (controlsRef.current) controlsRef.current.open = false
  }

  const selectTopic = (nextTopicId) => {
    restartConversation({ nextTopicId, salt: `topic-${nextTopicId}` })
    if (controlsRef.current) controlsRef.current.open = false
  }

  const selectDailyCategory = (categoryId) => {
    setDailyCategoryId(categoryId)
    setDailyVisualId(
      characterDailyVisualForCategory(speaker.id, categoryId).sceneId,
    )
  }

  const shuffleCompanion = () => {
    const nextSeed = nextConversationSeed(seed, `companion-${turn}`)
    const nextCompanion = chooseCharacterTalkCompanion(
      speaker.id,
      nextSeed,
      [player.id, companion.id],
      talkStudentIds,
    )
    restartConversation({
      nextCompanionId: nextCompanion.id,
      salt: `companion-${nextCompanion.id}-${nextSeed}`,
    })
    if (controlsRef.current) controlsRef.current.open = false
  }

  const respond = (intentId) => {
    const exchange = createCharacterTalkExchange({
      playerId: player.id,
      speakerId: speaker.id,
      companionId: companion.id,
      topicId: topic.id,
      intentId,
      seed,
      turn,
    })
    setMessages((current) => (
      [...current, ...exchange.messages].slice(-MAX_VISIBLE_MESSAGES)
    ))
    setTurn((current) => current + 1)
  }

  const askDailyQuestion = (questionId) => {
    const question = characterDailyQuestionById(questionId)
    const outfitId = dailyOutfitForCategory(question.categoryId)
    setDailyVisualId(
      characterDailyVisualForCategory(speaker.id, question.categoryId).sceneId,
    )
    const exchange = createCharacterDailyExchange({
      playerId: player.id,
      speakerId: speaker.id,
      companionId: companion.id,
      questionId,
      seed,
      turn,
    })
    setMessages((current) => (
      [
        ...current,
        ...exchange.messages.map((message) => ({ ...message, outfitId })),
      ].slice(-MAX_VISIBLE_MESSAGES)
    ))
    setTurn((current) => current + 1)
  }

  const respondToGrievance = (stanceId) => {
    const exchange = createCharacterGrievanceExchange({
      playerId: player.id,
      speakerId: speaker.id,
      companionId: companion.id,
      stanceId,
      seed,
      turn,
    })
    setMessages((current) => (
      [...current, ...exchange.messages].slice(-MAX_VISIBLE_MESSAGES)
    ))
    setTurn((current) => current + 1)
  }

  const openRevealScene = () => {
    setRevealChoiceId(null)
    setRevealOpen(true)
  }

  const closeRevealScene = () => {
    setRevealOpen(false)
    setRevealChoiceId(null)
  }

  const keepRevealExchange = () => {
    const choice = revealScene.choices.find((item) => item.id === revealChoiceId)
    if (!choice) return
    setMessages((current) => ([
      ...current,
      {
        id: `reveal-caught-${seed}-${turn}-${speaker.id}`,
        role: 'character',
        studentId: speaker.id,
        emotionId: 'surprised',
        text: revealScene.caughtLine,
      },
      {
        id: `reveal-user-${seed}-${turn}-${player.id}-${choice.id}`,
        role: 'user',
        studentId: player.id,
        emotionId: 'curious',
        text: choice.label,
      },
      {
        id: `reveal-answer-${seed}-${turn}-${speaker.id}-${choice.id}`,
        role: 'character',
        studentId: speaker.id,
        emotionId: choice.emotionId,
        text: choice.response,
      },
    ].slice(-MAX_VISIBLE_MESSAGES)))
    setTurn((current) => current + 1)
    closeRevealScene()
  }

  return (
    <div className="character-talk-shell flex h-full min-h-0 flex-col bg-slate-100">
      <ScreenHeader
        title={`${AFTER_SCHOOL_CHRONICLE.shortTitle}・仲間との会話`}
        subtitle="クラスメイトと話す"
      />

      <div className="flex min-h-0 flex-1 flex-col gap-2 px-3 pb-3">
        <section className="character-talk-cast shrink-0 overflow-hidden rounded-3xl bg-slate-950 px-3 py-2.5 text-white shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex shrink-0 -space-x-3">
              <span
                key={`${player.id}-${playerEmotion}-${activeOutfitId}`}
                className="battle-expression-change h-14 w-14 overflow-hidden rounded-2xl border-2 border-violet-300 bg-slate-900 shadow-lg ring-2 ring-violet-400/30"
              >
                <img
                  src={characterPortraitForOutfit(player.id, playerEmotion, activeOutfitId)}
                  alt={`${player.name}（主人公）の${characterPortraitLabel(activeOutfitId, playerEmotion)}`}
                  className="h-full w-full object-cover"
                />
              </span>
              <span
                key={`${speaker.id}-${speakerEmotion}-${activeOutfitId}`}
                className="battle-expression-change mt-1 h-12 w-12 overflow-hidden rounded-2xl border-2 border-white/70 bg-slate-900 shadow-lg"
              >
                <img
                  src={characterPortraitForOutfit(speaker.id, speakerEmotion, activeOutfitId)}
                  alt={`${speaker.name}の${characterPortraitLabel(activeOutfitId, speakerEmotion)}`}
                  className="h-full w-full object-cover"
                />
              </span>
              <span
                key={`${companion.id}-${companionEmotion}-${activeOutfitId}`}
                className="battle-expression-change mt-3 h-10 w-10 overflow-hidden rounded-xl border-2 border-cyan-200/80 bg-slate-900 shadow-lg"
              >
                <img
                  src={characterPortraitForOutfit(companion.id, companionEmotion, activeOutfitId)}
                  alt={`${companion.name}の${characterPortraitLabel(activeOutfitId, companionEmotion)}`}
                  className="h-full w-full object-cover"
                />
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[8px] font-extrabold text-violet-200">
                主人公（あなた）: {player.name}
              </p>
              <p className="mt-0.5 truncate font-display text-xs font-extrabold">
                話し相手: {speaker.name}
                <span className="ml-1 text-[8px] text-white/45">＋ {companion.name}</span>
              </p>
              <p className="mt-0.5 line-clamp-2 text-[9px] font-bold leading-relaxed text-white/55">
                {speakerPersona.motto}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <span className="rounded-full bg-fuchsia-400/15 px-2 py-0.5 text-[8px] font-extrabold text-fuchsia-100">
                  {topic.emoji} {topic.label}
                </span>
                {activeOutfitId === 'club' && (
                  <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[8px] font-extrabold text-amber-100">
                    🎽 部活動ビジュアル
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        <details
          ref={controlsRef}
          className="character-talk-controls shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between px-3 py-2 text-[10px] font-extrabold text-slate-600">
            <span>👥 話す相手・話題を変える</span>
          </summary>
          <div className="max-h-[30dvh] space-y-3 overflow-y-auto border-t border-slate-100 px-3 pb-3 pt-2.5">
            <div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-[9px] font-extrabold tracking-[0.1em] text-slate-500">話しかける相手</p>
                <button
                  type="button"
                  onClick={shuffleCompanion}
                  className="rounded-full bg-cyan-50 px-2 py-1 text-[8px] font-extrabold text-cyan-700 active:scale-95"
                >
                  同席を入れ替える
                </button>
              </div>
              <div className="character-talk-selector mt-2 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="主人公が話しかける相手を選ぶ">
                {talkStudents.filter((student) => student.id !== player.id).map((student) => {
                  const selected = student.id === speaker.id
                  return (
                    <button
                      key={student.id}
                      type="button"
                      onClick={() => selectSpeaker(student.id)}
                      aria-pressed={selected}
                      className={cx(
                        'w-14 shrink-0 rounded-xl border px-1 py-1.5 text-center transition-transform active:scale-95',
                        selected
                          ? 'border-violet-400 bg-violet-50 ring-2 ring-violet-200'
                          : 'border-slate-200 bg-white',
                      )}
                    >
                      <img
                        src={battleStudentPortrait(student.id, selected ? 'delighted' : 'idle')}
                        alt=""
                        loading="lazy"
                        className="mx-auto h-9 w-9 rounded-xl object-cover [image-rendering:pixelated]"
                      />
                      <span className="mt-1 block truncate text-[8px] font-extrabold text-slate-700">
                        {student.name.replace(/^.{2}/u, '')}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <p className="text-[9px] font-extrabold tracking-[0.1em] text-slate-500">話題</p>
              <div className="character-talk-selector mt-2 flex gap-1.5 overflow-x-auto pb-1" role="group" aria-label="話題を選ぶ">
                {CHARACTER_TALK_TOPICS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectTopic(item.id)}
                    aria-pressed={item.id === topic.id}
                    className={cx(
                      'min-h-9 shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-extrabold active:scale-95',
                      item.id === topic.id
                        ? 'border-fuchsia-300 bg-fuchsia-50 text-fuchsia-700'
                        : 'border-slate-200 bg-white text-slate-600',
                    )}
                  >
                    {item.emoji} {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </details>

        <div
          ref={logRef}
          className="character-talk-log min-h-0 flex-1 space-y-2 overflow-y-auto rounded-3xl border border-white/80 bg-white/55 px-2.5 py-3 shadow-inner"
          role="log"
          aria-live="polite"
          aria-relevant="additions"
          aria-label={`${player.name}（主人公）と${speaker.name}たちの会話`}
        >
          {messages.map((message) => <TalkMessage key={message.id} message={message} />)}
        </div>

        <section className="max-h-[50dvh] shrink-0 overflow-y-auto overscroll-contain rounded-3xl border border-slate-200 bg-white p-2.5 shadow-card">
          <div className="mb-2 grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1" role="tablist" aria-label="会話のしかた">
            <button
              type="button"
              role="tab"
              aria-selected={talkMode === 'ask'}
              onClick={() => setTalkMode('ask')}
              className={cx(
                'min-h-8 rounded-lg text-[9px] font-extrabold transition-colors',
                talkMode === 'ask' ? 'bg-white text-fuchsia-700 shadow-sm' : 'text-slate-500',
              )}
            >
              💬 質問・相談
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={talkMode === 'reply'}
              onClick={() => setTalkMode('reply')}
              className={cx(
                'min-h-8 rounded-lg text-[9px] font-extrabold transition-colors',
                talkMode === 'reply' ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-500',
              )}
            >
              🗣️ 仲間の話
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={talkMode === 'grievance'}
              onClick={() => setTalkMode('grievance')}
              className={cx(
                'min-h-8 rounded-lg text-[9px] font-extrabold transition-colors',
                talkMode === 'grievance' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-500',
              )}
            >
              😮‍💨 愚痴を聞く
            </button>
          </div>

          <div className="mb-2 flex items-center justify-between gap-2 px-0.5">
            <div className="min-w-0">
              <p className="truncate text-[10px] font-extrabold text-ink">
                {talkMode === 'ask'
                  ? `${player.name}として、${speaker.name}に何を聞く？`
                  : talkMode === 'reply'
                    ? `${speaker.name}の「${topic.label}」に、${player.name}はどう返す？`
                    : `${speaker.name}の愚痴に、${player.name}はどう返す？`}
              </p>
              <p className="text-[8px] font-bold text-ink/40">
                {talkMode === 'grievance'
                  ? '聞く・スルー・冷たく返す・励ますで反応が変わります'
                  : talkMode === 'reply'
                    ? `勉強・テスト対策・世間話など${CHARACTER_TALK_TOPICS.length}話題／主人公の4択で反応`
                    : '正解・不正解なし／何ターンでも続きます'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => restartConversation()}
              className="min-h-8 shrink-0 rounded-full bg-slate-100 px-2.5 text-[8px] font-extrabold text-slate-600 active:scale-95"
              aria-label="同じ相手と新しい会話を始める"
            >
              ↻ 新しい会話
            </button>
          </div>

          {talkMode === 'ask' ? (
            <>
              <div className="character-talk-selector -mx-0.5 mb-2 flex gap-1 overflow-x-auto px-0.5 pb-1" role="tablist" aria-label="日常質問の種類">
                {CHARACTER_DAILY_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    role="tab"
                    aria-selected={category.id === dailyCategoryId}
                    onClick={() => selectDailyCategory(category.id)}
                    className={cx(
                      'min-h-8 shrink-0 rounded-full border px-2 text-[8px] font-extrabold active:scale-95',
                      category.id === dailyCategoryId
                        ? 'border-fuchsia-300 bg-fuchsia-50 text-fuchsia-700'
                        : 'border-slate-200 bg-white text-slate-500',
                    )}
                  >
                    {category.emoji} {category.label}
                  </button>
                ))}
              </div>

              <section
                className="mb-2 overflow-hidden rounded-2xl border border-cyan-100 bg-slate-950 shadow-sm"
                aria-label={`${speaker.name}の日常アルバム`}
              >
                <figure className="relative aspect-video overflow-hidden bg-slate-900">
                  <img
                    key={activeDailyVisual.id}
                    src={activeDailyVisual.image}
                    alt={activeDailyVisual.imageAlt}
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent px-2.5 pb-2 pt-8 text-white">
                    <div className="flex items-end justify-between gap-2">
                      <div className="min-w-0">
                        <span className="block text-[7px] font-extrabold tracking-[0.12em] text-cyan-200">
                          {activeDailyVisual.outfitId === 'home' ? '🏠 自宅の私服' : '🗓️ 休日の私服'}
                        </span>
                        <strong className="mt-0.5 block truncate text-[10px] font-extrabold">
                          {speaker.name}・{activeDailyVisual.label}
                        </strong>
                      </div>
                      <span className="shrink-0 rounded-full bg-white/15 px-2 py-0.5 text-[7px] font-extrabold text-white/85">
                        {dailyVisuals.findIndex((visual) => visual.id === activeDailyVisual.id) + 1}/{dailyVisuals.length}
                      </span>
                    </div>
                  </figcaption>
                </figure>

                <div className="px-2.5 py-2">
                  <p className="text-[8px] font-bold leading-relaxed text-white/80">
                    {activeDailyVisual.interactionCue}。
                  </p>
                  <div className="character-talk-selector -mx-0.5 mt-2 flex gap-1.5 overflow-x-auto px-0.5 pb-1" role="group" aria-label={`${speaker.name}の日常場面を選ぶ`}>
                    {dailyVisuals.map((visual) => {
                      const selected = visual.id === activeDailyVisual.id
                      return (
                        <button
                          key={visual.id}
                          type="button"
                          aria-pressed={selected}
                          aria-label={`${visual.label}を表示`}
                          onClick={() => setDailyVisualId(visual.sceneId)}
                          className={cx(
                            'w-[5.25rem] shrink-0 overflow-hidden rounded-xl border bg-slate-900 text-left transition-transform active:scale-95',
                            selected
                              ? 'border-cyan-300 ring-2 ring-cyan-300/40'
                              : 'border-white/15',
                          )}
                        >
                          <img
                            src={visual.image}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="aspect-video w-full object-cover"
                          />
                          <span className={cx(
                            'block truncate px-1.5 py-1 text-[7px] font-extrabold',
                            selected ? 'text-cyan-200' : 'text-white/65',
                          )}
                          >
                            {visual.emoji} {visual.label}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </section>

              {dailyCategoryId === 'school' && (
                <p className="mb-1.5 rounded-xl bg-amber-50 px-2 py-1 text-[7px] font-bold text-amber-700">
                  この学校の架空予定：次は{nextSchoolTest.dateLabel}の{nextSchoolTest.label}（あと{nextSchoolTest.daysUntil}日）
                </p>
              )}

              {dailyCategoryId === 'surprise' && (
                <button
                  type="button"
                  onClick={openRevealScene}
                  className="mb-1.5 flex w-full items-center gap-2 overflow-hidden rounded-2xl border border-fuchsia-100 bg-fuchsia-50 p-1.5 text-left active:scale-[0.99]"
                >
                  <img
                    src={revealScene.image}
                    alt=""
                    className="h-12 w-[5.3rem] shrink-0 rounded-xl object-cover"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[7px] font-extrabold tracking-[0.12em] text-fuchsia-500">
                      👀 主人公にバレた日
                    </span>
                    <strong className="mt-0.5 block truncate text-[9px] font-extrabold text-fuchsia-800">
                      {revealScene.title}
                    </strong>
                    <span className="mt-0.5 block truncate text-[7px] font-bold text-fuchsia-600/70">
                      絵と3つの返し方でシーンを見る
                    </span>
                  </span>
                  <span className="pr-1 text-fuchsia-400" aria-hidden="true">›</span>
                </button>
              )}

              {(dailyCategoryId === 'learning-technique' || dailyCategoryId === 'learning-advice') && (
                <p className="mb-1.5 rounded-xl bg-violet-50 px-2 py-1 text-[7px] font-bold text-violet-700">
                  暗記・集中・復習・計画・やる気などを、{speaker.name}らしい具体的な手順で教えてくれます
                </p>
              )}

              <div className="grid grid-cols-2 gap-1.5" role="group" aria-label={`${player.name}が${speaker.name}へ尋ねる質問を選ぶ`}>
                {dailyQuestions.map((item) => (
                  <button
                    key={`${turn}-${item.id}-${item.text}`}
                    type="button"
                    onClick={() => askDailyQuestion(item.id)}
                    className="min-h-12 rounded-2xl border border-fuchsia-100 bg-gradient-to-br from-fuchsia-50 to-cyan-50 px-2 py-1.5 text-left transition-transform active:scale-[0.98]"
                  >
                    <span className="block text-[8px] font-extrabold text-fuchsia-600">
                      {CHARACTER_DAILY_CATEGORIES.find((category) => category.id === item.categoryId)?.emoji}
                      {' '}{item.categoryId.startsWith('learning-') ? '学習アドバイス' : '日常質問'}
                    </span>
                    <strong className="mt-0.5 line-clamp-2 block text-[9px] font-extrabold leading-snug text-slate-800">
                      {item.text}
                    </strong>
                  </button>
                ))}
              </div>
            </>
          ) : talkMode === 'reply' ? (
            <>
              <div
                className="character-talk-selector -mx-0.5 mb-2 flex gap-1 overflow-x-auto px-0.5 pb-1"
                role="tablist"
                aria-label="仲間から聞く話題"
              >
                {CHARACTER_TALK_TOPICS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={item.id === topic.id}
                    onClick={() => selectTopic(item.id)}
                    className={cx(
                      'min-h-8 shrink-0 rounded-full border px-2 text-[8px] font-extrabold active:scale-95',
                      item.id === topic.id
                        ? 'border-violet-300 bg-violet-50 text-violet-700'
                        : 'border-slate-200 bg-white text-slate-500',
                    )}
                  >
                    {item.emoji} {item.label}
                  </button>
                ))}
              </div>

              <div className="mb-2 rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-fuchsia-50 px-3 py-2">
                <span className="block text-[8px] font-extrabold tracking-[0.08em] text-violet-600">
                  {topic.emoji} {speaker.name}から・{topic.label}
                </span>
                <p className="mt-1 text-[10px] font-extrabold leading-relaxed text-slate-700">
                  {speakerPersona.topics[topic.id]}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-1.5" role="group" aria-label={`${player.name}が${speaker.name}へ返す言葉を選ぶ`}>
                {choices.map((choice) => (
                  <button
                    key={`${turn}-${choice.id}-${choice.text}`}
                    type="button"
                    onClick={() => respond(choice.id)}
                    className="min-h-12 rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-fuchsia-50 px-2 py-1.5 text-left transition-transform active:scale-[0.98]"
                  >
                    <span className="block text-[8px] font-extrabold text-violet-600">
                      {choice.emoji} {choice.label}
                    </span>
                    <strong className="mt-0.5 line-clamp-2 block text-[9px] font-extrabold leading-snug text-slate-800">
                      {choice.text}
                    </strong>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="mb-2 rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-slate-50 px-3 py-2">
                <span className="block text-[8px] font-extrabold tracking-[0.08em] text-sky-700">
                  😮‍💨 {grievancePrompt.label}の愚痴
                </span>
                <p className="mt-1 text-[10px] font-extrabold leading-relaxed text-slate-700">
                  {speaker.name}「{grievancePrompt.text}」
                </p>
              </div>
              <div className="grid grid-cols-2 gap-1.5" role="group" aria-label={`${player.name}が${speaker.name}の愚痴へ返す態度を選ぶ`}>
                {grievanceChoices.map((choice) => (
                  <button
                    key={`${turn}-${choice.id}-${choice.text}`}
                    type="button"
                    onClick={() => respondToGrievance(choice.id)}
                    className={cx(
                      'min-h-[3.75rem] rounded-2xl border px-2 py-1.5 text-left transition-transform active:scale-[0.98]',
                      choice.id === 'listen' && 'border-cyan-100 bg-gradient-to-br from-cyan-50 to-white',
                      choice.id === 'ignore' && 'border-slate-200 bg-gradient-to-br from-slate-50 to-white',
                      choice.id === 'cold' && 'border-blue-200 bg-gradient-to-br from-blue-50 to-slate-100',
                      choice.id === 'encourage' && 'border-amber-100 bg-gradient-to-br from-amber-50 to-white',
                    )}
                  >
                    <span className="block text-[8px] font-extrabold text-slate-600">
                      {choice.emoji} {choice.label}
                    </span>
                    <strong className="mt-0.5 line-clamp-2 block text-[9px] font-extrabold leading-snug text-slate-800">
                      {choice.text}
                    </strong>
                    <span className="mt-0.5 block truncate text-[7px] font-bold text-slate-400">
                      {choice.description}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

        </section>
      </div>

      {revealOpen && (
        <CharacterRevealDialog
          student={speaker}
          scene={revealScene}
          selectedChoiceId={revealChoiceId}
          onChoice={setRevealChoiceId}
          onKeep={keepRevealExchange}
          onClose={closeRevealScene}
        />
      )}
    </div>
  )
}
