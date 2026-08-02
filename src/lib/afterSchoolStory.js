import { BATTLE_DAILY_SCENES, battleDailySceneById } from './battleCast.js'
import { publicAssetUrl } from './publicAssetUrl.js'
import {
  afterSchoolNextStoryArc,
  afterSchoolStoryArcForStep,
} from './storyProgression.js'

export const AFTER_SCHOOL_CHRONICLE = {
  id: 'after-school-chronicle',
  title: '放課後と魔法の言葉',
  shortTitle: '放課後と魔法の言葉',
  subtitle: '先生の課題に挑み、対決後は友達との日常へ進む学園ライトノベル',
  keyVisual: publicAssetUrl('/assets/battle/chronicle/after-school-route-key-visual.webp'),
}

const VERDICT_EPILOGUES = Object.freeze({
  legendary: {
    title: '影のほどける音',
    narration: '最後の正答が光へ変わる。崩れかけた影蝕は、先生の口を借りて最後の捨て台詞を吐き、音もなくほどけ始めた。',
  },
  victory: {
    title: 'いつもの声が戻るまで',
    narration: '積み重ねた正答が術式の中心を貫く。黒い文字列は薄い光へ変わりながら、先生の口元に最後の強がりを残した。',
  },
  draw: {
    title: '余白に残った一行',
    narration: '影蝕の文字列は大きく揺らぎ、いくつかの行が消えていく。完全にはほどけなくても、次に読み解くべき一行は見えた。',
  },
  retreat: {
    title: '次に解く言葉',
    narration: '術式はまだ黒板に残っている。それでも正答の光が一筋だけ差し込み、次にほどくべき言葉を照らしていた。',
  },
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
    title: 'チャイムのあとに残る噂',
    pages: [
      {
        kind: 'narration',
        text: '「放課後、誰もいない教室で消したはずの文字が光る」。そんな噂が、昼休みの教室で小さく広がっていた。',
      },
      {
        kind: 'dialogue',
        speaker: companion,
        portraitId: 'student-curious',
        text: '「気になるなら、今日の放課後に確かめよう。私も同じ噂を聞いて、ずっと引っかかってたんだ」',
      },
      {
        kind: 'narration',
        text: `チャイムのあと、あなたと${companion}は噂の教室へ向かった。何が起きても一人で抱えず、見たものを二人で記録する。それが最初の約束になった。`,
      },
      {
        kind: 'dialogue',
        speaker: companion,
        portraitId: 'student-determined',
        text: '「まだ魔法かどうかも分からない。でも、噂を噂のままにしないで調べよう。——行こう。私も隣で考える」',
      },
    ],
  }
}

export function afterSchoolBattleChapter({
  storyStep = 0,
  studentName = 'クラスメイト',
  rivalName = '先生',
  encounterName = '放課後の教室',
  questSize = 10,
  isTeacher = true,
} = {}) {
  const episode = afterSchoolEpisodeNumber(storyStep)
  const arc = afterSchoolStoryArcForStep(storyStep)
  const companion = safeStoryText(studentName, 'クラスメイト')
  const rival = safeStoryText(rivalName, '先生')
  const location = safeStoryText(encounterName, '放課後の教室')
  const questionCount = Math.max(1, Math.floor(Number(questSize)) || 10)

  return {
    id: `after-school-battle-${episode}`,
    storyArcId: arc.id,
    chapterLabel: `MYSTERY FILE ${String(arc.number).padStart(2, '0')}`,
    title: arc.title,
    pages: [
      {
        kind: 'narration',
        text: `${arc.investigation}${location}へ足を踏み入れた瞬間、宙に浮かぶ文字が一斉にこちらを向き、中央に${rival}の姿が現れた。`,
      },
      {
        kind: 'dialogue',
        speaker: isTeacher ? `${rival}（悪いマナに支配されている）` : rival,
        text: isTeacher
          ? `「${questionCount}問すべてを迷わせてやる。覚えた言葉ごと、悪いマナの底へ沈むがいい！」`
          : `「${questionCount}問の言葉を読み解け。答えが、先へ進む道を決める」`,
      },
      {
        kind: 'dialogue',
        speaker: companion,
        portraitId: 'student-focused',
        text: '「焦らず一問ずついこう。覚えた言葉を思い出せば、きっと答えは見つかるよ」',
      },
      {
        kind: 'narration',
        text: isTeacher
          ? '先生を倒すんじゃない。解くべき相手は先生を縛る影の文章だ。ノートを開くと、覚えた言葉が淡い光になり、影だけをほどくため指先へ集まった。'
          : '姿に惑わされず、異変を形づくる文章の意味を読み取る。ノートを開くと、覚えた言葉が淡い光になって指先へ集まった。',
      },
    ],
  }
}

export function afterSchoolBattleEpilogue({
  storyStep = 0,
  studentName = 'クラスメイト',
  rivalName = '先生',
  verdictId = 'draw',
  isTeacher = true,
  teacherDefeated = false,
  teacherBattleLine = '',
} = {}) {
  const episode = afterSchoolEpisodeNumber(storyStep)
  const arc = afterSchoolStoryArcForStep(storyStep)
  const nextArc = afterSchoolNextStoryArc(storyStep)
  const companion = safeStoryText(studentName, 'クラスメイト')
  const rival = safeStoryText(rivalName, '先生')
  const outcome = VERDICT_EPILOGUES[verdictId] ?? VERDICT_EPILOGUES.draw
  const controlledTeacherLine = safeStoryText(
    teacherBattleLine,
    'まだ終わりではない……次の対決では、一問たりとも答えさせん！',
  )

  return {
    id: `after-school-epilogue-${episode}`,
    storyArcId: arc.id,
    chapterLabel: `EPISODE ${String(episode).padStart(2, '0')} · AFTER BATTLE`,
    title: outcome.title,
    pages: [
      {
        kind: 'narration',
        text: outcome.narration,
      },
      {
        kind: 'dialogue',
        speaker: isTeacher
          ? `${rival}（${teacherDefeated ? '悪いマナがほどける直前' : '悪いマナに支配されている'}）`
          : companion,
        portraitId: isTeacher ? undefined : 'student-relieved',
        text: isTeacher
          ? `「${controlledTeacherLine}」`
          : `「記録できた。${arc.discovery} 次の場所でも同じ印を探そう」`,
      },
      {
        kind: 'narration',
        text: `現実の校舎には傷ひとつない。対決の魔力が静かに消えると、窓の外から運動部の掛け声と商店街の音が戻ってきた。${isTeacher && teacherDefeated ? `${rival}を覆っていた影蝕も光へほどけた。` : ''}${arc.discovery}`,
      },
      {
        kind: 'dialogue',
        speaker: companion,
        portraitId: 'student-relieved',
        text: `「${arc.nextLead}${nextArc ? ` 次は『${nextArc.shortTitle}』を確かめよう。` : ''}その前に、今日出会った人とも話していこう」`,
      },
    ],
  }
}

export function afterSchoolDailyChapter({
  storyStep = 0,
  studentName = 'クラスメイト',
  routeLabel = '友達との日常',
  location = '帰り道',
  situation = '対決を終え、友達といつもの時間へ戻っていく。',
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
      {
        kind: 'narration',
        text: safeStoryText(situation, '対決を終え、友達といつもの時間へ戻っていく。'),
      },
      {
        kind: 'dialogue',
        speaker: companion,
        portraitId: 'student-opening',
        text: safeStoryText(opening, '「少し話していかない？」'),
      },
      {
        kind: 'narration',
        text: firstMeeting
          ? `${companion}も放課後の異変を気にしていた。ここで交わす言葉が、一緒に噂を調べ、次の戦いで力を貸してもらう最初のきっかけになる。`
          : `教科書の答えではなく、友達へ返す自分の言葉を選ぶ時間が始まる。『${arc.shortTitle}』の調査も、こうした日常の会話から次へ続いていく。`,
      },
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

// 旧バージョンの保存データ・テストとの互換用。現在の戦果画面は毎回3ルートへ進む。
export function shouldContinueToAfterSchoolInterlude({
  storyStep = 0,
  lastDay = null,
  currentDay = null,
  roll = 1,
} = {}) {
  const day = normalizeBattleStoryLastDay(currentDay)
  if (day !== null && normalizeBattleStoryLastDay(lastDay) === day) return false
  if (normalizeBattleStoryStep(storyStep) === 0) return true
  return Number.isFinite(roll)
    && roll >= 0
    && roll < AFTER_SCHOOL_INTERLUDE_CHANCE
}

export function afterSchoolSceneForStep(step) {
  const normalized = normalizeBattleStoryStep(step)
  return BATTLE_DAILY_SCENES[normalized % BATTLE_DAILY_SCENES.length]
}

export function afterSchoolScene({ sceneId, step = 0 } = {}) {
  return sceneId
    ? battleDailySceneById(sceneId)
    : afterSchoolSceneForStep(step)
}

export function afterSchoolEpisodeNumber(step) {
  return normalizeBattleStoryStep(step) + 1
}
