import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'
import { BATTLE_STUDENTS } from '../src/lib/battleCast.js'
import { SCHOOL_TEACHERS, TEACHER_RIVALS } from '../src/lib/rpg.js'
import { SCHOOL_SUBJECT_NAMES } from '../src/lib/schoolSubjects.js'
import {
  TEACHER_PORTRAIT_IDS,
  hasTeacherPortrait,
  teacherPortraitProfile,
} from '../src/lib/teacherPortraits.js'
import {
  TEACHER_SCHOOL_LIFE,
  TEACHER_SCHOOL_LIFE_IDS,
  TEACHER_TEST_SCORE_CHOICES,
  createTeacherSchoolLifeConversation,
  teacherRemedialSubjectChoices,
  teacherSchoolLifeById,
  teacherSchoolLifeBySubject,
} from '../src/lib/teacherSchoolLife.js'

test('全12科目の担当教員が愛情・面白さ・厳しさを持つ学校生活会話へ登場する', () => {
  assert.equal(Object.keys(TEACHER_RIVALS).length, 11)
  assert.equal(TEACHER_SCHOOL_LIFE.length, 12)
  assert.deepEqual(TEACHER_SCHOOL_LIFE_IDS, Object.keys(SCHOOL_TEACHERS))
  assert.equal(new Set(TEACHER_SCHOOL_LIFE_IDS).size, 12)
  assert.deepEqual(TEACHER_PORTRAIT_IDS, TEACHER_SCHOOL_LIFE_IDS)
  assert.deepEqual(
    new Set(TEACHER_SCHOOL_LIFE.map((teacher) => teacher.teacherSubject)),
    new Set(SCHOOL_SUBJECT_NAMES),
  )

  for (const teacher of TEACHER_SCHOOL_LIFE) {
    assert.equal(teacherSchoolLifeById(teacher.id), teacher)
    assert.equal(teacherSchoolLifeBySubject(teacher.teacherSubject), teacher)
    assert.ok(teacher.location && teacher.everyday && teacher.opening, teacher.id)
    assert.ok(teacher.excellent && teacher.good && teacher.close, teacher.id)
    assert.ok(teacher.ownRemedial && teacher.stay && teacher.pursuit, teacher.id)
    assert.ok(teacher.otherConcern && teacher.lore, teacher.id)
    assert.match(teacher.ownRemedial, /赤点|補習|卒業/u, teacher.id)
    assert.equal(teacher.portraitId, teacher.id)
    assert.equal(hasTeacherPortrait(teacher), true)
  }

  const portraits = TEACHER_SCHOOL_LIFE.map((teacher) => teacherPortraitProfile(teacher))
  assert.equal(new Set(portraits.map((profile) => profile.src)).size, 12)
  const portraitHashes = []
  for (const profile of portraits) {
    assert.match(profile.src, /^\/assets\/battle\/teachers\/[a-z-]+\.webp$/u)
    const portraitUrl = new URL(`../public${profile.src}`, import.meta.url)
    assert.equal(
      existsSync(portraitUrl),
      true,
      `${profile.id}: visual file`,
    )
    const image = readFileSync(portraitUrl)
    assert.ok(image.byteLength > 20_000, `${profile.id}: full visual data`)
    portraitHashes.push(createHash('sha256').update(image).digest('hex'))
  }
  assert.equal(new Set(portraitHashes).size, 12, 'all teachers use different visuals')

  assert.match(
    teacherSchoolLifeById('tempest').ownRemedial,
    /なにぃぃぃ.*貴様っ.*私の物理で赤点/u,
  )
})

test('全先生で定期テスト4結果と自教科・他教科の補習分岐を最後まで体験できる', () => {
  assert.deepEqual(
    TEACHER_TEST_SCORE_CHOICES.map((choice) => choice.id),
    ['excellent', 'good', 'close', 'remedial'],
  )
  assert.deepEqual(
    TEACHER_TEST_SCORE_CHOICES.map((choice) => choice.score),
    [92, 76, 42, 31],
  )

  for (const teacher of TEACHER_SCHOOL_LIFE) {
    const opening = createTeacherSchoolLifeConversation({
      teacherId: teacher.id,
      studentId: 'mio',
    })
    assert.equal(opening.phase, 'score', teacher.id)
    assert.match(opening.messages.at(-1).text, /定期テストは何点だった/u, teacher.id)

    for (const scoreChoice of TEACHER_TEST_SCORE_CHOICES.slice(0, 3)) {
      const result = createTeacherSchoolLifeConversation({
        teacherId: teacher.id,
        studentId: 'mio',
        scoreChoiceId: scoreChoice.id,
      })
      assert.equal(result.phase, 'complete', `${teacher.id}:${scoreChoice.id}`)
      assert.equal(
        result.messages.some((message) => message.text === teacher[scoreChoice.id]),
        true,
        `${teacher.id}:${scoreChoice.id}: teacher-specific reply`,
      )
    }

    const remedial = createTeacherSchoolLifeConversation({
      teacherId: teacher.id,
      studentId: 'mio',
      scoreChoiceId: 'remedial',
    })
    assert.equal(remedial.phase, 'subject', teacher.id)
    assert.match(remedial.messages.at(-1).text, /先生たちは日々一生懸命教えている/u)
    assert.match(remedial.messages.at(-1).text, /補習の教科は何だった/u)

    const subjects = teacherRemedialSubjectChoices(teacher.id)
    assert.equal(subjects.length, 3, teacher.id)
    assert.equal(new Set(subjects.map((subject) => subject.id)).size, 3, teacher.id)
    assert.equal(subjects.filter((subject) => subject.isOwn).length, 1, teacher.id)
    assert.equal(subjects.some((subject) => subject.id === teacher.teacherSubject), true)

    const otherSubject = subjects.find((subject) => !subject.isOwn)
    const otherResult = createTeacherSchoolLifeConversation({
      teacherId: teacher.id,
      studentId: 'mio',
      scoreChoiceId: 'remedial',
      remedialSubject: otherSubject.id,
    })
    assert.equal(otherResult.phase, 'complete', `${teacher.id}:other subject`)
    assert.equal(
      otherResult.messages.some((message) => message.text.includes(teacher.otherConcern)),
      true,
      `${teacher.id}: concern for colleague and learner`,
    )

    const caught = createTeacherSchoolLifeConversation({
      teacherId: teacher.id,
      studentId: 'mio',
      scoreChoiceId: 'remedial',
      remedialSubject: teacher.teacherSubject,
    })
    assert.equal(caught.phase, 'resolution', `${teacher.id}:own subject`)
    assert.equal(caught.messages.at(-1).text, teacher.ownRemedial)

    const escape = createTeacherSchoolLifeConversation({
      teacherId: teacher.id,
      studentId: 'mio',
      scoreChoiceId: 'remedial',
      remedialSubject: teacher.teacherSubject,
      resolutionId: 'escape',
    })
    assert.equal(escape.phase, 'complete', `${teacher.id}:escape`)
    assert.match(escape.messages.at(-1).text, /ミオ/u)
    assert.equal(escape.messages.at(-1).text.includes(teacher.pursuit), true)

    const stay = createTeacherSchoolLifeConversation({
      teacherId: teacher.id,
      studentId: 'mio',
      scoreChoiceId: 'remedial',
      remedialSubject: teacher.teacherSubject,
      resolutionId: 'stay',
    })
    assert.equal(stay.phase, 'complete', `${teacher.id}:stay`)
    assert.equal(stay.messages.at(-1).text, teacher.stay)
  }
})

test('逃げる場面は全10人の性格と所属に応じた別々の行動になる', () => {
  const teacher = teacherSchoolLifeById('tempest')
  const narrations = BATTLE_STUDENTS.map((student) => {
    const conversation = createTeacherSchoolLifeConversation({
      teacherId: teacher.id,
      studentId: student.id,
      scoreChoiceId: 'remedial',
      remedialSubject: teacher.teacherSubject,
      resolutionId: 'escape',
    })
    const narration = conversation.messages.at(-1)
    assert.equal(narration.role, 'narration', student.id)
    assert.equal(narration.text.includes(teacher.pursuit), true, student.id)
    return narration.text.replace(teacher.pursuit, '').trim()
  })

  assert.equal(narrations.length, 10)
  assert.equal(new Set(narrations).size, 10)
})

test('放課後と魔法の言葉から先生の日常会話を操作でき、実学習成績へ混ぜない', () => {
  const source = readFileSync(
    new URL('../src/screens/EnglishMap.jsx', import.meta.url),
    'utf8',
  )

  assert.match(source, /<TeacherSchoolLife student=\{battleStudent\}/)
  assert.match(source, /TEACHER_SCHOOL_LIFE\.map/)
  assert.match(source, /TEACHER_SCHOOL_LIFE\.length\}人 · 12科目/u)
  assert.match(source, /faculty:\s*Teacher/)
  assert.match(source, /<ChronicleIcon kind="faculty" size=\{24\} \/>/)
  assert.match(source, /TEACHER_TEST_SCORE_CHOICES\.map/)
  assert.match(source, /teacherRemedialSubjectChoices/)
  assert.match(source, /🏃 逃げる！/u)
  assert.match(source, /📘 補習を受ける/u)
  assert.match(source, /実際の正答率・SRS・診断結果は変わりません/u)
})

test('先生専用ビジュアルを学校生活と龍脈の共同解読で利用する', () => {
  const map = readFileSync(new URL('../src/screens/EnglishMap.jsx', import.meta.url), 'utf8')
  const stage = readFileSync(new URL('../src/components/DragonVeinCipherStage.jsx', import.meta.url), 'utf8')
  const vocab = readFileSync(new URL('../src/screens/VocabQuiz.jsx', import.meta.url), 'utf8')
  const result = readFileSync(new URL('../src/screens/SessionResult.jsx', import.meta.url), 'utf8')

  assert.match(map, /TeacherPortrait/u)
  assert.match(map, /先生の記憶を聞く/u)
  assert.match(stage, /guide\.standing/u)
  assert.match(stage, /dragon-vein-guide-layer/u)
  assert.match(stage, /手掛かり/u)
  assert.match(vocab, /<DragonVeinCipherStage/u)
  assert.match(result, /<DragonVeinCipherStage/u)
  for (const source of [map, stage, vocab, result]) assert.doesNotMatch(source, /portraitEmoji/u)

  const portraitComponent = readFileSync(
    new URL('../src/components/TeacherPortrait.jsx', import.meta.url),
    'utf8',
  )
  assert.match(portraitComponent, /data-teacher-visual=\{profile\.src\}/u)
  assert.match(portraitComponent, /<img[\s\S]*src=\{profile\.src\}/u)
  assert.doesNotMatch(portraitComponent, /<svg/u)

  assert.doesNotMatch(stage, /BattleOpponentStandingActor|enemy|attack|defeat/u)
})
