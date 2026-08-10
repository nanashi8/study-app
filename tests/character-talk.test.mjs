import test from 'node:test'
import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import {
  BATTLE_EMOTION_STATES,
  BATTLE_STUDENTS,
  battleStudentLifestylePortrait,
} from '../src/lib/battleCast.js'
import {
  CHARACTER_TALK_INTENTS,
  CHARACTER_TALK_PATTERN_COUNT,
  CHARACTER_TALK_PERSONAS,
  CHARACTER_TALK_TOPICS,
  characterTalkChoices,
  characterTalkPatternCount,
  chooseCharacterTalkCompanion,
  createCharacterTalkExchange,
  createCharacterTalkOpening,
  resolveCharacterTalkCast,
} from '../src/lib/characterTalk.js'
import {
  CHARACTER_DAILY_CATEGORIES,
  CHARACTER_DAILY_COMPANION_TOPICS,
  CHARACTER_DAILY_FACTS,
  CHARACTER_PRIVATE_LIFE,
  CHARACTER_LEARNING_ADVICE,
  CHARACTER_DAILY_PATTERN_COUNT,
  CHARACTER_DAILY_QUESTIONS,
  characterDailyPatternCount,
  characterDailyQuestionSuggestions,
  createCharacterDailyExchange,
  nextCharacterSchoolTest,
} from '../src/lib/characterDailyTalk.js'
import {
  CHARACTER_DAILY_VISUAL_COUNT,
  CHARACTER_DAILY_VISUAL_MOMENTS,
  CHARACTER_DAILY_VISUALS,
  characterDailyVisualForCategory,
  characterDailyVisualsByStudent,
} from '../src/lib/characterDailyVisuals.js'
import {
  CHARACTER_REVEAL_SCENES,
  characterRevealSceneById,
} from '../src/lib/characterRevealScenes.js'
import {
  CHARACTER_GRIEVANCE_COUNT,
  CHARACTER_GRIEVANCE_PATTERN_COUNT,
  CHARACTER_GRIEVANCE_STANCES,
  CHARACTER_GRIEVANCES,
  characterGrievanceChoices,
  characterGrievancePatternCount,
  characterGrievancePrompt,
  createCharacterGrievanceExchange,
} from '../src/lib/characterGrievanceTalk.js'

const studentIds = new Set(BATTLE_STUDENTS.map((student) => student.id))
const emotionIds = new Set(BATTLE_EMOTION_STATES.map((emotion) => emotion.id))
const intentIds = new Set(CHARACTER_TALK_INTENTS.map((intent) => intent.id))
const topicIds = new Set(CHARACTER_TALK_TOPICS.map((topic) => topic.id))

function distinctPlayerId(speakerId, companionId) {
  return BATTLE_STUDENTS.find(
    (student) => student.id !== speakerId && student.id !== companionId,
  ).id
}

function webpDimensions(bytes) {
  assert.equal(bytes.subarray(0, 4).toString('ascii'), 'RIFF')
  assert.equal(bytes.subarray(8, 12).toString('ascii'), 'WEBP')

  let offset = 12
  while (offset + 8 <= bytes.length) {
    const chunkType = bytes.subarray(offset, offset + 4).toString('ascii')
    const chunkSize = bytes.readUInt32LE(offset + 4)
    const payload = offset + 8

    if (chunkType === 'VP8X') {
      return {
        width: bytes.readUIntLE(payload + 4, 3) + 1,
        height: bytes.readUIntLE(payload + 7, 3) + 1,
      }
    }
    if (chunkType === 'VP8 ') {
      assert.equal(bytes.subarray(payload + 3, payload + 6).toString('hex'), '9d012a')
      return {
        width: bytes.readUInt16LE(payload + 6) & 0x3fff,
        height: bytes.readUInt16LE(payload + 8) & 0x3fff,
      }
    }
    if (chunkType === 'VP8L') {
      assert.equal(bytes[payload], 0x2f)
      const bits = bytes.readUInt32LE(payload + 1)
      return {
        width: (bits & 0x3fff) + 1,
        height: ((bits >>> 14) & 0x3fff) + 1,
      }
    }

    offset = payload + chunkSize + (chunkSize % 2)
  }

  assert.fail('WebP image chunk was not found')
}

test('10人×15話題の性格別会話データが全分岐を持つ', () => {
  assert.equal(BATTLE_STUDENTS.length, 10)
  assert.equal(CHARACTER_TALK_TOPICS.length, 15)
  assert.equal(CHARACTER_TALK_INTENTS.length, 4)
  assert.deepEqual(new Set(Object.keys(CHARACTER_TALK_PERSONAS)), studentIds)

  const addedEverydayTopicIds = new Set([
    'small-talk',
    'school-chatter',
    'test-prep',
    'study-routine',
    'homework',
  ])
  assert.equal(addedEverydayTopicIds.isSubsetOf(topicIds), true)

  for (const topic of CHARACTER_TALK_TOPICS) {
    assert.ok(topic.label && topic.emoji, topic.id)
    assert.equal(topic.leadIns.length, 3, `${topic.id}: opening variants`)
    assert.equal(topic.emotions.every((id) => emotionIds.has(id)), true, topic.id)
    for (const intentId of intentIds) {
      assert.equal(topic.choices[intentId].length, 2, `${topic.id}/${intentId}: choices`)
      assert.equal(topic.followUps[intentId].length, 2, `${topic.id}/${intentId}: follow ups`)
      assert.equal(topic.choices[intentId].every((line) => line.length <= 34), true)
    }
  }

  for (const student of BATTLE_STUDENTS) {
    const persona = CHARACTER_TALK_PERSONAS[student.id]
    assert.ok(persona.motto, student.id)
    assert.equal(persona.arrivals.length, 3, `${student.id}: arrivals`)
    assert.equal(topicIds.isSubsetOf(new Set(Object.keys(persona.topics))), true, `${student.id}: topics`)
    for (const intentId of intentIds) {
      assert.equal(persona.responses[intentId].length, 3, `${student.id}/${intentId}: replies`)
      assert.equal(persona.reactions[intentId].length, 2, `${student.id}/${intentId}: banter`)
    }
  }

  for (const topicId of addedEverydayTopicIds) {
    const characterLines = BATTLE_STUDENTS.map(
      (student) => CHARACTER_TALK_PERSONAS[student.id].topics[topicId],
    )
    assert.equal(new Set(characterLines).size, 10, `${topicId}: character-specific`)
    assert.equal(characterLines.every((line) => line.length >= 28), true, topicId)
  }

  assert.equal(characterTalkPatternCount(), 9_331_200)
  assert.equal(CHARACTER_TALK_PATTERN_COUNT, 9_331_200)
})

test('主人公・話し相手・同席者の全10×9×8組で有効な掛け合いを生成する', () => {
  const seenReplies = new Set()
  for (const speaker of BATTLE_STUDENTS) {
    const autoCompanion = chooseCharacterTalkCompanion(speaker.id, 20260801)
    assert.notEqual(autoCompanion.id, speaker.id)

    for (const companion of BATTLE_STUDENTS) {
      if (companion.id === speaker.id) continue
      for (const player of BATTLE_STUDENTS) {
        if (player.id === speaker.id || player.id === companion.id) continue
        for (const topic of CHARACTER_TALK_TOPICS) {
          const opening = createCharacterTalkOpening({
            playerId: player.id,
            speakerId: speaker.id,
            companionId: companion.id,
            topicId: topic.id,
            seed: 20260801,
          })
          assert.equal(opening.player.id, player.id)
          assert.equal(opening.messages.length, 2)
          assert.equal(opening.messages[0].studentId, speaker.id)
          assert.equal(opening.messages[1].studentId, companion.id)

          const choices = characterTalkChoices({
            topicId: topic.id,
            speakerId: speaker.id,
            seed: 20260801,
            turn: 2,
          })
          assert.deepEqual(new Set(choices.map((choice) => choice.id)), intentIds)

          for (const intent of CHARACTER_TALK_INTENTS) {
            const exchange = createCharacterTalkExchange({
              playerId: player.id,
              speakerId: speaker.id,
              companionId: companion.id,
              topicId: topic.id,
              intentId: intent.id,
              seed: 20260801,
              turn: 2,
            })
            assert.deepEqual(exchange.messages.map((message) => message.role), ['user', 'character', 'character'])
            assert.equal(exchange.messages[0].studentId, player.id)
            assert.equal(exchange.messages[1].studentId, speaker.id)
            assert.equal(exchange.messages[2].studentId, companion.id)
            assert.equal(exchange.messages.every((message) => message.text.length >= 8), true)
            assert.equal(exchange.messages.every((message) => emotionIds.has(message.emotionId)), true)
            seenReplies.add(exchange.messages[1].text)
          }
        }
      }
    }
  }
  assert.ok(seenReplies.size >= 350, `character replies: ${seenReplies.size}`)
})

test('日常・学習・私生活質問は30カテゴリ各5問・全150問を持ち、生活の全領域を巡る', async () => {
  assert.equal(CHARACTER_DAILY_CATEGORIES.length, 30)
  assert.equal(CHARACTER_DAILY_QUESTIONS.length, 150)
  assert.equal(CHARACTER_DAILY_QUESTIONS.length >= 30, true)
  assert.equal(new Set(CHARACTER_DAILY_QUESTIONS.map((item) => item.id)).size, 150)

  for (const category of CHARACTER_DAILY_CATEGORIES) {
    const questions = CHARACTER_DAILY_QUESTIONS.filter((item) => item.categoryId === category.id)
    assert.equal(questions.length, 5, category.id)
    assert.equal(topicIds.has(CHARACTER_DAILY_COMPANION_TOPICS[category.id]), true, `${category.id}: companion topic`)
  }

  const allPhrases = CHARACTER_DAILY_QUESTIONS.flatMap((item) => item.phrases).join('\n')
  assert.match(allPhrases, /テストまで、あと何日/)
  assert.match(allPhrases, /1日どれくらい勉強/)
  assert.match(allPhrases, /夏休みは部活、忙しい/)
  assert.match(allPhrases, /集中が続くコツ/)
  assert.match(allPhrases, /やる気が出ない日/)
  assert.match(allPhrases, /家に着いたら、最初に何する/)
  assert.match(allPhrases, /文化祭で何をやってみたい/)
  assert.match(allPhrases, /学校で君を探すなら/)
  assert.match(allPhrases, /放課後に一時間だけ空いたら/)
  assert.match(allPhrases, /家族の中ではどんな役/)
  assert.match(allPhrases, /自分の部屋、もっと詳しく/)
  assert.match(allPhrases, /いちばん得意な家事/)
  assert.match(allPhrases, /朝の身支度/)
  assert.match(allPhrases, /休日の買い物コース/)
  assert.match(allPhrases, /スマホの待受/)
  assert.match(allPhrases, /寝る直前のルーティン/)
  assert.match(allPhrases, /近所でいちばん好きな場所/)
  assert.match(allPhrases, /お小遣い、どうやって管理/)
  assert.match(allPhrases, /風邪をひいた日/)

  const factKeys = Object.keys(CHARACTER_DAILY_FACTS.mio).sort()
  assert.deepEqual(new Set(Object.keys(CHARACTER_DAILY_FACTS)), studentIds)
  for (const student of BATTLE_STUDENTS) {
    assert.deepEqual(Object.keys(CHARACTER_DAILY_FACTS[student.id]).sort(), factKeys, student.id)
    assert.equal(Object.values(CHARACTER_DAILY_FACTS[student.id]).every(Boolean), true)
  }

  const privateLifeKeys = Object.keys(CHARACTER_PRIVATE_LIFE.mio).sort()
  assert.equal(privateLifeKeys.length, 20)
  assert.deepEqual(new Set(Object.keys(CHARACTER_PRIVATE_LIFE)), studentIds)
  for (const student of BATTLE_STUDENTS) {
    assert.deepEqual(Object.keys(CHARACTER_PRIVATE_LIFE[student.id]).sort(), privateLifeKeys, student.id)
    assert.equal(
      Object.values(CHARACTER_PRIVATE_LIFE[student.id]).every((detail) => detail.length >= 20),
      true,
      `${student.id}: private life detail`,
    )
  }
  for (const key of privateLifeKeys) {
    assert.equal(
      new Set(BATTLE_STUDENTS.map((student) => CHARACTER_PRIVATE_LIFE[student.id][key])).size,
      10,
      `${key}: character-specific`,
    )
  }

  const privateCategoryIds = new Set([
    'family', 'room', 'chores', 'appearance', 'shopping',
    'digital-life', 'evening', 'neighborhood', 'money', 'self-care',
  ])
  assert.equal(
    CHARACTER_DAILY_CATEGORIES
      .filter((category) => privateCategoryIds.has(category.id))
      .every((category) => category.outfitId === 'home' || category.outfitId === 'weekend'),
    true,
  )
  assert.equal(
    CHARACTER_DAILY_CATEGORIES.find((category) => category.id === 'club').outfitId,
    'club',
  )
  for (const student of BATTLE_STUDENTS) {
    const clubPortrait = new URL(
      `../public${battleStudentLifestylePortrait(student.id, 'club')}`,
      import.meta.url,
    )
    const bytes = await readFile(clubPortrait)
    assert.deepEqual(webpDimensions(bytes), { width: 512, height: 512 }, `${student.id}: club portrait`)
  }

  const learningKeys = Object.keys(CHARACTER_LEARNING_ADVICE.mio).sort()
  assert.equal(learningKeys.length, 10)
  assert.deepEqual(new Set(Object.keys(CHARACTER_LEARNING_ADVICE)), studentIds)
  for (const student of BATTLE_STUDENTS) {
    assert.deepEqual(Object.keys(CHARACTER_LEARNING_ADVICE[student.id]).sort(), learningKeys, student.id)
    assert.equal(Object.values(CHARACTER_LEARNING_ADVICE[student.id]).every((tip) => tip.length >= 20), true)
  }

  assert.equal(characterDailyPatternCount(), 864_000)
  assert.equal(CHARACTER_DAILY_PATTERN_COUNT, 864_000)
  assert.equal(CHARACTER_TALK_PATTERN_COUNT + CHARACTER_DAILY_PATTERN_COUNT, 10_195_200)
})

test('10人の愚痴50種へ、聞く・スルー・冷たい・励ますの4態度で反応する', () => {
  assert.equal(CHARACTER_GRIEVANCE_COUNT, 50)
  assert.equal(CHARACTER_GRIEVANCE_STANCES.length, 4)
  assert.deepEqual(
    new Set(CHARACTER_GRIEVANCE_STANCES.map((stance) => stance.id)),
    new Set(['listen', 'ignore', 'cold', 'encourage']),
  )
  assert.deepEqual(new Set(Object.keys(CHARACTER_GRIEVANCES)), studentIds)

  for (const student of BATTLE_STUDENTS) {
    const grievances = CHARACTER_GRIEVANCES[student.id]
    assert.equal(grievances.length, 5, student.id)
    assert.equal(new Set(grievances.map((item) => item.id)).size, 5, student.id)
    for (const item of grievances) {
      assert.ok(item.label && emotionIds.has(item.emotionId), `${student.id}/${item.id}`)
      assert.equal(item.lines.length, 2, `${student.id}/${item.id}`)
      assert.equal(item.lines.every((line) => line.length >= 30), true, `${student.id}/${item.id}`)
    }

    const reachablePromptIds = new Set()
    for (let turn = 0; turn < 5; turn += 1) {
      reachablePromptIds.add(characterGrievancePrompt({
        speakerId: student.id,
        seed: 20260802,
        turn,
      }).id)
    }
    assert.equal(reachablePromptIds.size, 5, `${student.id}: every grievance reachable`)
  }

  for (const stance of CHARACTER_GRIEVANCE_STANCES) {
    assert.equal(stance.lines.length, 2, stance.id)
    assert.equal(stance.description.length >= 12, true, stance.id)
    assert.equal(stance.playerEmotions.every((id) => emotionIds.has(id)), true, stance.id)
    assert.equal(stance.speakerEmotions.every((id) => emotionIds.has(id)), true, stance.id)
    assert.equal(stance.companionEmotions.every((id) => emotionIds.has(id)), true, stance.id)
  }

  assert.equal(characterGrievancePatternCount(), 288_000)
  assert.equal(CHARACTER_GRIEVANCE_PATTERN_COUNT, 288_000)
  assert.equal(
    CHARACTER_TALK_PATTERN_COUNT + CHARACTER_DAILY_PATTERN_COUNT + CHARACTER_GRIEVANCE_PATTERN_COUNT,
    10_483_200,
  )
})

test('主人公・愚痴を言う人物・同席者の全組合せで4者の発話を生成する', () => {
  for (const speaker of BATTLE_STUDENTS) {
    for (const companion of BATTLE_STUDENTS) {
      if (companion.id === speaker.id) continue
      for (const player of BATTLE_STUDENTS) {
        if (player.id === speaker.id || player.id === companion.id) continue
        for (let turn = 0; turn < 5; turn += 1) {
          const choices = characterGrievanceChoices({
            playerId: player.id,
            speakerId: speaker.id,
            seed: 41,
            turn,
          })
          assert.deepEqual(
            new Set(choices.map((choice) => choice.id)),
            new Set(['listen', 'ignore', 'cold', 'encourage']),
          )

          for (const stance of CHARACTER_GRIEVANCE_STANCES) {
            const exchange = createCharacterGrievanceExchange({
              playerId: player.id,
              speakerId: speaker.id,
              companionId: companion.id,
              stanceId: stance.id,
              seed: 41,
              turn,
            })
            assert.deepEqual(
              exchange.messages.map((message) => message.role),
              ['character', 'user', 'character', 'character'],
            )
            assert.deepEqual(
              exchange.messages.map((message) => message.studentId),
              [speaker.id, player.id, speaker.id, companion.id],
            )
            assert.equal(exchange.messages.every((message) => emotionIds.has(message.emotionId)), true)
            assert.equal(exchange.messages.every((message) => message.text.length >= 12), true)
            assert.equal(exchange.stance.id, stance.id)
          }
        }
      }
    }
  }
})

test('スルーと冷たい返しは、聞く・励ますとは異なる現実的な反応になる', () => {
  const common = {
    playerId: 'mio',
    speakerId: 'rei',
    companionId: 'tsubaki',
    seed: 20260802,
    turn: 2,
  }
  const exchanges = Object.fromEntries(CHARACTER_GRIEVANCE_STANCES.map((stance) => [
    stance.id,
    createCharacterGrievanceExchange({ ...common, stanceId: stance.id }),
  ]))
  assert.equal(new Set(Object.values(exchanges).map((exchange) => exchange.messages[1].text)).size, 4)
  assert.equal(new Set(Object.values(exchanges).map((exchange) => exchange.messages[2].text)).size, 4)
  assert.match(exchanges.ignore.messages[2].text, /話題|聞かない|保留/)
  assert.match(exchanges.cold.messages[2].text, /責任|言い方|残念/)
  assert.notEqual(exchanges.ignore.messages[3].text, exchanges.cold.messages[3].text)
})

test('日常アルバムは10人×30場面の300枚を持ち、主人公を描かず私服でやりとりを表す', async () => {
  assert.equal(CHARACTER_DAILY_VISUAL_MOMENTS.length, 30)
  assert.equal(CHARACTER_DAILY_VISUAL_COUNT, 300)
  assert.equal(CHARACTER_DAILY_VISUALS.length, 300)
  assert.equal(new Set(CHARACTER_DAILY_VISUALS.map((visual) => visual.id)).size, 300)
  assert.equal(new Set(CHARACTER_DAILY_VISUALS.map((visual) => visual.image)).size, 300)
  assert.deepEqual(
    new Set(CHARACTER_DAILY_VISUALS.map((visual) => visual.studentId)),
    studentIds,
  )

  for (const student of BATTLE_STUDENTS) {
    const visuals = characterDailyVisualsByStudent(student.id)
    assert.equal(visuals.length, 30, `${student.id}: daily visual count`)
    assert.equal(visuals.filter((visual) => visual.outfitId === 'home').length, 15)
    assert.equal(visuals.filter((visual) => visual.outfitId === 'weekend').length, 15)

    for (const visual of visuals) {
      assert.equal(visual.protagonistVisible, false, visual.id)
      assert.match(visual.imageAlt, /主人公の手・姿・影・反射は描かれていない/)
      assert.match(visual.image, new RegExp(`/daily/${student.id}/[a-z-]+\\.webp$`))
      assert.ok(visual.interactionCue.length >= 18, `${visual.id}: interaction cue`)

      const asset = new URL(`../public${visual.image}`, import.meta.url)
      await access(asset)
      const bytes = await readFile(asset)
      assert.ok(bytes.length >= 20_000, `${visual.id}: image size`)
      assert.deepEqual(webpDimensions(bytes), { width: 960, height: 540 }, visual.id)
    }
  }

  const categorySceneIds = new Set()
  for (const category of CHARACTER_DAILY_CATEGORIES) {
    const visual = characterDailyVisualForCategory('mio', category.id)
    assert.ok(visual, category.id)
    assert.equal(visual.studentId, 'mio')
    assert.equal(['home', 'weekend'].includes(visual.outfitId), true, category.id)
    categorySceneIds.add(visual.sceneId)
  }
  assert.equal(categorySceneIds.size, 30)
})

test('意外な一面は10人分の固有設定と、主人公にバレる画像付き3択シーンを持つ', async () => {
  assert.deepEqual(new Set(Object.keys(CHARACTER_REVEAL_SCENES)), studentIds)
  assert.equal(Object.values(CHARACTER_REVEAL_SCENES).filter((scene) => scene.growth).length, 1)

  const surpriseFacts = Object.values(CHARACTER_DAILY_FACTS)
    .flatMap((facts) => [
      facts.unexpectedSide,
      facts.sweetSecret,
      facts.animalSide,
      facts.secretHobby,
      facts.weekendLook,
    ])
    .join('\n')
  assert.match(surpriseFacts, /超(?:がつく)?甘党/)
  assert.match(surpriseFacts, /猫派/)
  assert.match(surpriseFacts, /犬派/)
  assert.match(surpriseFacts, /ヘビーゲーマー/)
  assert.match(surpriseFacts, /和菓子|アイシングクッキー/)
  assert.match(surpriseFacts, /ばっちりメイク/)

  assert.doesNotMatch(CHARACTER_DAILY_FACTS.akari.secretHobby, /お菓子|ケーキ/)
  assert.doesNotMatch(CHARACTER_DAILY_FACTS.kaito.secretHobby, /刺しゅう|裁縫/)
  assert.doesNotMatch(CHARACTER_DAILY_FACTS.haru.secretHobby, /ゲーム|レイド/)
  assert.match(CHARACTER_DAILY_FACTS.kaito.unexpectedSide, /妹|お兄ちゃん/)
  assert.match(CHARACTER_DAILY_FACTS.tsubaki.secretHobby, /フランス人形/)
  assert.match(CHARACTER_DAILY_FACTS.tsubaki.secretHobby, /ガラスの瞳|巻き髪|レースのドレス/)
  assert.doesNotMatch(CHARACTER_DAILY_FACTS.tsubaki.secretHobby, /小さな着物|着物姿/)
  assert.doesNotMatch(CHARACTER_DAILY_FACTS.tsubaki.secretHobby, /和菓子|お菓子|アイシング/)
  assert.match(CHARACTER_DAILY_FACTS.yuu.unexpectedSide, /内向的/)
  assert.match(CHARACTER_DAILY_FACTS.yuu.secretHobby, /ヒトカラ/)

  for (const student of BATTLE_STUDENTS) {
    const scene = characterRevealSceneById(student.id)
    assert.equal(scene.studentId, student.id)
    assert.ok(scene.title && scene.place && scene.imageAlt, student.id)
    assert.match(scene.image, new RegExp(`/reveals/${student.id}\\.webp$`))
    assert.match(scene.discovery, /あなた/)
    assert.ok(scene.caughtLine.length >= 18, `${student.id}: caught line`)
    assert.equal(scene.choices.length, 3, `${student.id}: choices`)
    assert.equal(new Set(scene.choices.map((choice) => choice.id)).size, 3)
    for (const choice of scene.choices) {
      assert.ok(choice.label.length >= 8, `${student.id}/${choice.id}: label`)
      assert.ok(choice.response.length >= 18, `${student.id}/${choice.id}: response`)
      assert.equal(emotionIds.has(choice.emotionId), true)
    }

    const assetPaths = [
      scene.image,
      ...(scene.growth?.steps.map((step) => step.image) ?? []),
    ]
    for (const assetPath of assetPaths) {
      const asset = new URL(`../public${assetPath}`, import.meta.url)
      await access(asset)
      const bytes = await readFile(asset)
      assert.ok(bytes.length >= 20_000, `${student.id}: reveal image size`)
      assert.equal(bytes.subarray(0, 4).toString('ascii'), 'RIFF', `${student.id}: webp header`)
    }
  }

  assert.match(CHARACTER_REVEAL_SCENES.kaito.discovery, /妹のヒナ/)
  assert.match(CHARACTER_REVEAL_SCENES.rei.discovery, /ばっちりメイク/)
  assert.match(CHARACTER_REVEAL_SCENES.haru.discovery, /うどん店/)
  assert.match(CHARACTER_REVEAL_SCENES.tsubaki.discovery, /フランス人形/)
  assert.match(CHARACTER_REVEAL_SCENES.tsubaki.discovery, /磁器|ガラスの瞳|レースのドレス/)
  assert.doesNotMatch(CHARACTER_REVEAL_SCENES.tsubaki.discovery, /小さな着物|着物姿/)
  assert.doesNotMatch(CHARACTER_REVEAL_SCENES.tsubaki.discovery, /和菓子|練り切り/)
  assert.match(CHARACTER_REVEAL_SCENES.yuu.discovery, /ヒトカラ/)
  assert.equal(CHARACTER_REVEAL_SCENES.yuu.growth.steps.length, 1)
  assert.deepEqual(
    CHARACTER_REVEAL_SCENES.yuu.growth.steps.map((step) => step.id),
    ['first-livehouse'],
  )
  assert.match(CHARACTER_REVEAL_SCENES.yuu.growth.steps[0].title, /ライブハウス/)
  assert.match(CHARACTER_REVEAL_SCENES.yuu.growth.steps[0].text, /人前でも一曲を歌い切れる/)
})

test('この学校のテスト日だけを固定日程から計算し、利用者の日程を推測しない', () => {
  assert.deepEqual(
    nextCharacterSchoolTest(new Date(2026, 7, 1)),
    {
      id: 'second-midterm',
      month: 10,
      day: 15,
      label: '二学期中間テスト',
      year: 2026,
      eventUtc: Date.UTC(2026, 9, 15),
      dateLabel: '10月15日',
      daysUntil: 75,
    },
  )
  assert.equal(nextCharacterSchoolTest(new Date(2026, 9, 15)).daysUntil, 0)
  assert.equal(nextCharacterSchoolTest(new Date(2026, 11, 4)).id, 'year-end')

  const companion = BATTLE_STUDENTS[1]
  const exchange = createCharacterDailyExchange({
    playerId: distinctPlayerId('mio', companion.id),
    speakerId: 'mio',
    companionId: companion.id,
    questionId: 'test-countdown',
    seed: 7,
    turn: 0,
    now: new Date(2026, 7, 1),
  })
  assert.match(exchange.messages[1].text, /10月15日/)
  assert.match(exchange.messages[1].text, /あと75日/)
})

test('全150問が10人それぞれに異なる回答を返し、同席キャラも反応する', () => {
  const schedule = nextCharacterSchoolTest(new Date(2026, 7, 1))
  const allAuthoredAnswers = new Set()
  const malformedAnswer = /(こと(?:ため|経験|気持ち|つらさ|とき)|。って|遅め(?:けど|から|よう)|休日は休日は|くらいくらい)/u
  for (const question of CHARACTER_DAILY_QUESTIONS) {
    assert.equal(question.phrases.length, 2, question.id)
    assert.equal(intentIds.has(question.intentId), true, question.id)
    const studentAnswers = new Set()
    for (const speaker of BATTLE_STUDENTS) {
      const answers = question.answer({
        facts: CHARACTER_DAILY_FACTS[speaker.id],
        privateLife: CHARACTER_PRIVATE_LIFE[speaker.id],
        learning: CHARACTER_LEARNING_ADVICE[speaker.id],
        persona: CHARACTER_TALK_PERSONAS[speaker.id],
        student: speaker,
        schedule,
      })
      assert.equal(answers.length, 2, `${question.id}/${speaker.id}`)
      assert.equal(new Set(answers).size, 2, `${question.id}/${speaker.id}: answer variants`)
      assert.equal(answers.every((answer) => answer.length >= 18 && !answer.includes('undefined')), true)
      assert.equal(answers.every((answer) => !malformedAnswer.test(answer)), true, `${question.id}/${speaker.id}: natural join`)
      answers.forEach((answer) => allAuthoredAnswers.add(answer))
      studentAnswers.add(answers.join('\n'))

      const companion = chooseCharacterTalkCompanion(speaker.id, question.id)
      const playerId = distinctPlayerId(speaker.id, companion.id)
      const exchange = createCharacterDailyExchange({
        playerId,
        speakerId: speaker.id,
        companionId: companion.id,
        questionId: question.id,
        seed: 20260801,
        turn: 3,
        now: new Date(2026, 7, 1),
      })
      assert.deepEqual(exchange.messages.map((message) => message.role), ['user', 'character', 'character'])
      assert.equal(exchange.messages[0].studentId, playerId)
      assert.equal(exchange.messages[1].studentId, speaker.id)
      assert.equal(exchange.messages[2].studentId, companion.id)
      assert.equal(exchange.messages.every((message) => emotionIds.has(message.emotionId)), true)
      const companionTopicId = CHARACTER_DAILY_COMPANION_TOPICS[question.categoryId]
      assert.match(
        exchange.messages[2].text,
        new RegExp(CHARACTER_TALK_PERSONAS[companion.id].topics[companionTopicId].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
      )
    }
    assert.equal(studentAnswers.size, 10, `${question.id}: character-specific answers`)
  }
  assert.equal(allAuthoredAnswers.size, 3_000)

  for (const category of CHARACTER_DAILY_CATEGORIES) {
    const suggestions = characterDailyQuestionSuggestions({
      categoryId: category.id,
      speakerId: 'mio',
      seed: 42,
      turn: 0,
    })
    assert.equal(suggestions.length, 4)
    assert.equal(new Set(suggestions.map((item) => item.id)).size, 4)
    assert.equal(suggestions.every((item) => item.categoryId === category.id), true)

    const reachableIds = new Set()
    for (let suggestionTurn = 0; suggestionTurn < 12; suggestionTurn += 1) {
      characterDailyQuestionSuggestions({
        categoryId: category.id,
        speakerId: 'mio',
        seed: 42,
        turn: suggestionTurn,
      }).forEach((item) => reachableIds.add(item.id))
    }
    assert.equal(reachableIds.size, 5, `${category.id}: all questions reachable`)
  }
})

test('勉強時間と夏の部活は10人で別の具体的な答えになる', () => {
  for (const questionId of ['study-daily', 'summer-club-busy']) {
    const answers = new Set()
    for (const speaker of BATTLE_STUDENTS) {
      const companion = chooseCharacterTalkCompanion(speaker.id, questionId)
      const exchange = createCharacterDailyExchange({
        playerId: distinctPlayerId(speaker.id, companion.id),
        speakerId: speaker.id,
        companionId: companion.id,
        questionId,
        seed: 11,
        turn: 0,
        now: new Date(2026, 7, 1),
      })
      answers.add(exchange.messages[1].text)
    }
    assert.equal(answers.size, 10, questionId)
  }
})

test('学習の知恵・テクニック・相談は10人の性格別に具体的な答えになる', () => {
  for (const questionId of [
    'technique-focus',
    'technique-memory',
    'technique-review',
    'technique-mistakes',
    'technique-explain',
    'advice-motivation',
    'advice-planning',
    'advice-stuck',
    'advice-nerves',
    'advice-backlog',
  ]) {
    const answers = new Set()
    for (const speaker of BATTLE_STUDENTS) {
      const companion = chooseCharacterTalkCompanion(speaker.id, questionId)
      const exchange = createCharacterDailyExchange({
        playerId: distinctPlayerId(speaker.id, companion.id),
        speakerId: speaker.id,
        companionId: companion.id,
        questionId,
        seed: 37,
        turn: 0,
        now: new Date(2026, 7, 1),
      })
      answers.add(exchange.messages[1].text)
    }
    assert.equal(answers.size, 10, questionId)
  }
})

test('主人公と重なる指定でも3人を自動的に別人物へ補正する', () => {
  const cast = resolveCharacterTalkCast({
    playerId: 'mio',
    speakerId: 'mio',
    companionId: 'mio',
    seed: 19,
  })
  assert.equal(new Set([cast.player.id, cast.speaker.id, cast.companion.id]).size, 3)
  assert.equal(cast.player.id, 'mio')
})

test('同じ種類の質問が続いても同席キャラの相槌を連続重複させない', () => {
  const common = {
    playerId: 'ren',
    speakerId: 'mio',
    companionId: 'tsubaki',
    seed: 20260801,
    now: new Date(2026, 7, 1),
  }
  const first = createCharacterDailyExchange({
    ...common,
    questionId: 'test-countdown',
    turn: 0,
  })
  const second = createCharacterDailyExchange({
    ...common,
    questionId: 'study-daily',
    turn: 1,
  })
  assert.notEqual(first.messages[2].text, second.messages[2].text)
})

test('終了した仲間会話は公開導線から外し、互換用UIだけを保持する', async () => {
  const [app, home, map, interlude, screen, css, talkLogic, dailyLogic, visualLogic, revealLogic, grievanceLogic] = await Promise.all([
    readFile(new URL('../src/App.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/screens/Home.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/screens/EnglishMap.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/screens/AfterSchoolInterlude.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/screens/CharacterTalk.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/index.css', import.meta.url), 'utf8'),
    readFile(new URL('../src/lib/characterTalk.js', import.meta.url), 'utf8'),
    readFile(new URL('../src/lib/characterDailyTalk.js', import.meta.url), 'utf8'),
    readFile(new URL('../src/lib/characterDailyVisuals.js', import.meta.url), 'utf8'),
    readFile(new URL('../src/lib/characterRevealScenes.js', import.meta.url), 'utf8'),
    readFile(new URL('../src/lib/characterGrievanceTalk.js', import.meta.url), 'utf8'),
  ])

  assert.doesNotMatch(app, /characterTalk: CharacterTalkScreen/)
  assert.doesNotMatch(app, /afterSchoolChronicle: AfterSchoolChronicleScreen/)
  assert.doesNotMatch(home, /navigate\('afterSchoolChronicle'\)/)
  assert.doesNotMatch(home, /AFTER_SCHOOL_CHRONICLE\.title/)
  assert.doesNotMatch(home, /navigate\('characterTalk'\)/)
  assert.doesNotMatch(map, /<CampusLifeGallery/)
  assert.match(interlude, /navigate\('characterTalk', \{ fromBattle: true, storyStep \}\)/)
  assert.match(interlude, /もっと友達と話す/)
  assert.match(screen, /AFTER_SCHOOL_CHRONICLE\.shortTitle}・仲間との会話/)

  assert.match(screen, /質問・相談/)
  assert.match(screen, /仲間の話/)
  assert.match(screen, /仲間から聞く話題/)
  assert.match(screen, /勉強・テスト対策・世間話/)
  assert.match(screen, /愚痴を聞く/)
  assert.match(grievanceLogic, /じっくり聞く/)
  assert.match(grievanceLogic, /スルーする/)
  assert.match(grievanceLogic, /冷たく返す/)
  assert.match(grievanceLogic, /励ます/)
  assert.match(screen, /createCharacterGrievanceExchange/)
  assert.match(screen, /CHARACTER_GRIEVANCE_PATTERN_COUNT/)
  assert.match(screen, /主人公（あなた）/)
  assert.match(screen, /playerId: player\.id/)
  assert.match(screen, /student\.id !== player\.id/)
  assert.match(screen, /学習アドバイス/)
  assert.match(screen, /CHARACTER_DAILY_CATEGORIES\.map/)
  assert.match(screen, /CHARACTER_DAILY_QUESTIONS\.length/)
  assert.match(screen, /何ターンでも続きます/)
  assert.match(screen, /role="log"/)
  assert.match(screen, /aria-live="polite"/)
  assert.match(screen, /grid grid-cols-2/)
  assert.match(screen, /min-h-12/)
  assert.match(screen, /MAX_VISIBLE_MESSAGES = 42/)
  assert.match(screen, /この学校の架空予定/)
  assert.match(screen, /主人公にバレた日/)
  assert.match(screen, /CharacterRevealDialog/)
  assert.match(screen, /role="dialog"/)
  assert.match(screen, /この続きで話す/)
  assert.match(screen, /characterRevealSceneById/)
  assert.match(screen, /AFTER THE SECRET/)
  assert.match(screen, /scene\.growth\.steps\.map/)
  assert.match(screen, /battleStudentLifestylePortrait/)
  assert.match(screen, /部活動ビジュアル/)
  assert.match(screen, /dailyOutfitForCategory/)
  assert.match(screen, /outfitId/)
  assert.match(screen, /日常アルバム/)
  assert.match(screen, /主人公は画面外/)
  assert.match(screen, /手・姿・影・反射/)
  assert.match(screen, /characterDailyVisualsByStudent/)
  assert.match(screen, /max-h-\[50dvh\]/)
  assert.doesNotMatch(screen, /\[player, speaker, companion\]\.map/)
  assert.match(visualLogic, /protagonistVisible: false/)
  assert.match(visualLogic, /\/assets\/battle\/daily/)

  assert.match(css, /@keyframes character-talk-message-in/)
  assert.match(css, /character-talk-message,[\s\S]*animation: none/)
  assert.doesNotMatch(talkLogic, /fetch\(|XMLHttpRequest|openai/i)
  assert.doesNotMatch(dailyLogic, /fetch\(|XMLHttpRequest|openai/i)
  assert.doesNotMatch(visualLogic, /fetch\(|XMLHttpRequest|openai/i)
  assert.doesNotMatch(revealLogic, /fetch\(|XMLHttpRequest|openai/i)
  assert.doesNotMatch(grievanceLogic, /fetch\(|XMLHttpRequest|openai/i)
})
