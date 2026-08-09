import { BATTLE_DAILY_SCENES, battleDailySceneById } from './battleCast.js'
import { publicAssetUrl } from './publicAssetUrl.js'
import {
  afterSchoolNextStoryArc,
  afterSchoolStoryArcForStep,
} from './storyProgression.js'

export const AFTER_SCHOOL_CHRONICLE = {
  id: 'after-school-chronicle',
  title: '英語記憶・龍脈調査録',
  shortTitle: '龍脈調査録',
  subtitle: '英語を忘れた街で、先生と生徒が記憶の暗号を協力して解く物語',
  keyVisual: publicAssetUrl('/assets/battle/chronicle/after-school-route-key-visual.webp'),
}

const RESTORATION_EPILOGUES = Object.freeze({
  legendary: { title: '記憶が鮮明につながる', narration: '最後の答えが文脈にはまり、忘れられていた英語の役割が鮮やかに戻った。' },
  victory: { title: '消えた一行を復元', narration: '積み重ねた正解が、街の中で不自然に切れていた文脈をつないだ。' },
  draw: { title: '次の手掛かり', narration: 'すべては戻らなくても、先生の記憶と生徒の違和感を重ねると次に読む断片が見えた。' },
  retreat: { title: '未解読の断片', narration: '答えにはまだ届かない。それでも誤りの記録が、次に選ぶべき道を残してくれた。' },
})

function safeStoryText(value, fallback) {
  const text = String(value ?? '').trim()
  return text || fallback
}

export function afterSchoolPrologue({ studentName = 'クラスメイト' } = {}) {
  const companion = safeStoryText(studentName, 'クラスメイト')
  return {
    id: 'after-school-prologue',
    chapterLabel: 'PROLOGUE',
    title: '当たり前だった言葉の消失',
    pages: [
      { kind: 'narration', text: 'その朝、駅の案内板やニュースの字幕から英語が消えていた。しかし、街の人々は何も失われていないかのように日常を続けていた。' },
      { kind: 'dialogue', speaker: companion, portraitId: 'student-curious', text: '「あそこ、空白じゃなかったよね？　英語って言っても、みんな“そんなものはない”って……」' },
      { kind: 'narration', text: `英語の存在を覚えていたのは、あなたと${companion}たち、そしてごく一部の生徒だけだった。先生たちには、担当分野の用語をうまく思い出せないという違和感が残っていた。` },
      { kind: 'dialogue', speaker: companion, portraitId: 'student-focused', text: '「先生たちの専門知識と、私たちの記憶を合わせよう。暗号や古文書を解くみたいに、一語ずつ戻せるはず」' },
      { kind: 'narration', text: '学校の地下を中心に、図書館、駅前、中央公園、神社、競技場へ五芒星状の龍脈が伸びていた。五つの頂点で言葉を紡ぎ直す調査が始まった。' },
    ],
  }
}

// 保存済み画面がこの関数名を参照するため名前は維持するが、内容は対決ではなく共同解読。
export function afterSchoolBattleChapter({
  storyStep = 0,
  studentName = 'クラスメイト',
  rivalName = '先生',
  encounterName = '放課後の教室',
  questSize = 10,
} = {}) {
  const episode = afterSchoolEpisodeNumber(storyStep)
  const arc = afterSchoolStoryArcForStep(storyStep)
  const companion = safeStoryText(studentName, 'クラスメイト')
  const guide = safeStoryText(rivalName, '先生')
  const location = safeStoryText(encounterName, '放課後の教室')
  const questionCount = Math.max(1, Math.floor(Number(questSize)) || 10)
  return {
    id: `after-school-restoration-${episode}`,
    storyArcId: arc.id,
    chapterLabel: `RESTORATION FILE ${String(arc.number).padStart(2, '0')}`,
    title: arc.title,
    pages: [
      { kind: 'narration', text: `${arc.investigation}${location}で、意味だけが抜け落ちた英語の断片が見つかった。` },
      { kind: 'dialogue', speaker: guide, text: `「この用語は見覚えがある。担当分野の知識から手掛かりを出すから、${questionCount}の断片を一緒に確かめよう」` },
      { kind: 'dialogue', speaker: companion, portraitId: 'student-focused', text: '「焦らず、意味・語源・使われる場面を照らし合わせよう。間違いも次の手掛かりになる」' },
      { kind: 'narration', text: '誰かを打ち負かすためではない。先生と生徒の記憶を重ね、消えた英語を日常へ戻すための解読だ。' },
    ],
  }
}

export function afterSchoolBattleEpilogue({
  storyStep = 0,
  studentName = 'クラスメイト',
  rivalName = '先生',
  verdictId = 'draw',
} = {}) {
  const episode = afterSchoolEpisodeNumber(storyStep)
  const arc = afterSchoolStoryArcForStep(storyStep)
  const nextArc = afterSchoolNextStoryArc(storyStep)
  const companion = safeStoryText(studentName, 'クラスメイト')
  const guide = safeStoryText(rivalName, '先生')
  const outcome = RESTORATION_EPILOGUES[verdictId] ?? RESTORATION_EPILOGUES.draw
  return {
    id: `after-school-epilogue-${episode}`,
    storyArcId: arc.id,
    chapterLabel: `EPISODE ${String(episode).padStart(2, '0')} · AFTER RESTORATION`,
    title: outcome.title,
    pages: [
      { kind: 'narration', text: outcome.narration },
      { kind: 'dialogue', speaker: guide, text: '「私の中にも、この言葉を使っていた感覚が少し戻った。記録を残しておこう」' },
      { kind: 'narration', text: `${arc.discovery}校舎も街も壊れていない。ただ、忘れられていた一語が日常の中に戻った。` },
      { kind: 'dialogue', speaker: companion, portraitId: 'student-relieved', text: `「${arc.nextLead}${nextArc ? ` 次は『${nextArc.shortTitle}』を確かめよう。` : ''}」` },
    ],
  }
}

export function afterSchoolDailyChapter({
  storyStep = 0,
  studentName = 'クラスメイト',
  routeLabel = '友達との日常',
  location = '帰り道',
  situation = '調査を終え、友達といつもの時間へ戻っていく。',
  opening = '「少し話していかない？」',
  firstMeeting = false,
} = {}) {
  const episode = afterSchoolEpisodeNumber(storyStep)
  const arc = afterSchoolStoryArcForStep(storyStep)
  const companion = safeStoryText(studentName, 'クラスメイト')
  return {
    id: `after-school-daily-${episode}`,
    storyArcId: arc.id,
    chapterLabel: `DAILY STORY ${String(episode).padStart(2, '0')}`,
    title: `${firstMeeting ? 'はじめての出会い' : safeStoryText(routeLabel, '友達との日常')} · ${safeStoryText(location, '帰り道')}`,
    pages: [
      { kind: 'narration', text: safeStoryText(situation, '調査を終え、友達といつもの時間へ戻っていく。') },
      { kind: 'dialogue', speaker: companion, portraitId: 'student-opening', text: safeStoryText(opening, '「少し話していかない？」') },
      { kind: 'narration', text: firstMeeting ? `${companion}も、みんなが忘れた英語への違和感を抱いていた。ここから調査を協力する関係が始まる。` : `教科書の答えではなく、友達へ返す自分の言葉を選ぶ。『${arc.shortTitle}』の調査も、こうした日常の違和感から続いていく。` },
    ],
  }
}

export const MAX_BATTLE_STORY_STEP = 999_999
export const AFTER_SCHOOL_INTERLUDE_CHANCE = 1 / 3

export function normalizeBattleStoryStep(value) {
  if (!Number.isSafeInteger(value) || value < 0) return 0
  return Math.min(value, MAX_BATTLE_STORY_STEP)
}

export function normalizeBattleStoryLastDay(value) {
  return Number.isSafeInteger(value) && value >= 0 ? value : null
}

export function shouldContinueToAfterSchoolInterlude({ storyStep = 0, lastDay = null, currentDay = null, roll = 1 } = {}) {
  const day = normalizeBattleStoryLastDay(currentDay)
  if (day !== null && normalizeBattleStoryLastDay(lastDay) === day) return false
  if (normalizeBattleStoryStep(storyStep) === 0) return true
  return Number.isFinite(roll) && roll >= 0 && roll < AFTER_SCHOOL_INTERLUDE_CHANCE
}

export function afterSchoolSceneForStep(step) {
  const normalized = normalizeBattleStoryStep(step)
  return BATTLE_DAILY_SCENES[normalized % BATTLE_DAILY_SCENES.length]
}

export function afterSchoolScene({ sceneId, step = 0 } = {}) {
  return sceneId ? battleDailySceneById(sceneId) : afterSchoolSceneForStep(step)
}

export function afterSchoolEpisodeNumber(step) {
  return normalizeBattleStoryStep(step) + 1
}
