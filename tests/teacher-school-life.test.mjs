import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { BATTLE_STUDENTS } from '../src/lib/battleCast.js'
import { TEACHER_RIVALS } from '../src/lib/rpg.js'
import {
  TEACHER_SCHOOL_LIFE,
  TEACHER_SCHOOL_LIFE_IDS,
  TEACHER_TEST_SCORE_CHOICES,
  createTeacherSchoolLifeConversation,
  teacherRemedialSubjectChoices,
  teacherSchoolLifeById,
  teacherSchoolLifeBySubject,
} from '../src/lib/teacherSchoolLife.js'

test('全11章の先生が愛情・面白さ・厳しさを持つ学校生活会話へ登場する', () => {
  assert.equal(TEACHER_SCHOOL_LIFE.length, 11)
  assert.deepEqual(TEACHER_SCHOOL_LIFE_IDS, Object.keys(TEACHER_RIVALS))
  assert.equal(new Set(TEACHER_SCHOOL_LIFE_IDS).size, 11)
  assert.equal(new Set(TEACHER_SCHOOL_LIFE.map((teacher) => teacher.teacherSubject)).size, 11)

  for (const teacher of TEACHER_SCHOOL_LIFE) {
    assert.equal(teacherSchoolLifeById(teacher.id), teacher)
    assert.equal(teacherSchoolLifeBySubject(teacher.teacherSubject), teacher)
    assert.ok(teacher.location && teacher.everyday && teacher.opening, teacher.id)
    assert.ok(teacher.excellent && teacher.good && teacher.close, teacher.id)
    assert.ok(teacher.ownRemedial && teacher.stay && teacher.pursuit, teacher.id)
    assert.ok(teacher.otherConcern && teacher.lore, teacher.id)
    assert.match(teacher.ownRemedial, /赤点|補習|卒業/u, teacher.id)
  }

  assert.match(
    teacherSchoolLifeById('tempest').ownRemedial,
    /なにぃぃぃ.*貴様っ.*私の体育で赤点/u,
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

test('放課後ことば探検記から先生の日常会話を操作でき、実学習成績へ混ぜない', () => {
  const source = readFileSync(
    new URL('../src/screens/EnglishMap.jsx', import.meta.url),
    'utf8',
  )

  assert.match(source, /<TeacherSchoolLife student=\{battleStudent\}/)
  assert.match(source, /TEACHER_SCHOOL_LIFE\.map/)
  assert.match(source, /TEACHER_TEST_SCORE_CHOICES\.map/)
  assert.match(source, /teacherRemedialSubjectChoices/)
  assert.match(source, /🏃 逃げる！/u)
  assert.match(source, /📘 補習を受ける/u)
  assert.match(source, /実際の正答率・XP・SRS・診断結果は変わりません/u)
})
