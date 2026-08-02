import {
  AFTER_SCHOOL_BRANCHES,
  afterSchoolBranchById,
  normalizeAfterSchoolBonds,
} from './afterSchoolBonds.js'
import {
  BATTLE_STUDENTS,
  isRestorableBattleStudentId,
  normalizeBattleStudentId,
} from './battleCast.js'
import { isBattleThemeId } from './battleThemes.js'
import { TEACHER_RIVALS } from './rpg.js'
import {
  AFTER_SCHOOL_STORY_ARCS,
  afterSchoolStoryArcById,
  afterSchoolStoryArcForStep,
} from './storyProgression.js'

const BRANCH_IDS = new Set(AFTER_SCHOOL_BRANCHES.map((branch) => branch.id))
const TEACHER_IDS = new Set(Object.keys(TEACHER_RIVALS))
const STORY_ARC_IDS = new Set(AFTER_SCHOOL_STORY_ARCS.map((arc) => arc.id))
const STUDENT_IDS = new Set(BATTLE_STUDENTS.map((student) => student.id))

export const EMPTY_STORY_KEY_VISUAL_ALBUM = Object.freeze({
  events: Object.freeze([]),
  teacherVictories: Object.freeze([]),
})

function normalizeEventMemory(entry) {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return null
  if (!BRANCH_IDS.has(entry.branchId) || !STORY_ARC_IDS.has(entry.storyArcId)) return null
  const branch = afterSchoolBranchById(entry.branchId)
  return {
    branchId: branch.id,
    storyArcId: afterSchoolStoryArcById(entry.storyArcId).id,
    studentId: branch.studentId,
  }
}

function normalizeTeacherVictory(entry) {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return null
  if (!TEACHER_IDS.has(entry.teacherId)) return null
  if (!isRestorableBattleStudentId(entry.studentId)) return null
  if (!isBattleThemeId(entry.themeId)) return null
  return {
    teacherId: entry.teacherId,
    studentId: normalizeBattleStudentId(entry.studentId),
    themeId: entry.themeId,
  }
}

export function normalizeStoryKeyVisualAlbum(value) {
  const events = []
  const teacherVictories = []
  const seenBranches = new Set()
  const seenTeachers = new Set()

  for (const raw of Array.isArray(value?.events) ? value.events : []) {
    const event = normalizeEventMemory(raw)
    if (!event || seenBranches.has(event.branchId)) continue
    seenBranches.add(event.branchId)
    events.push(event)
  }
  for (const raw of Array.isArray(value?.teacherVictories) ? value.teacherVictories : []) {
    const victory = normalizeTeacherVictory(raw)
    if (!victory || seenTeachers.has(victory.teacherId)) continue
    seenTeachers.add(victory.teacherId)
    teacherVictories.push(victory)
  }

  return { events, teacherVictories }
}

export function isValidStoryKeyVisualAlbum(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  if (!Array.isArray(value.events) || !Array.isArray(value.teacherVictories)) return false
  const normalized = normalizeStoryKeyVisualAlbum(value)
  return normalized.events.length === value.events.length
    && normalized.teacherVictories.length === value.teacherVictories.length
    && value.events.every((entry, index) => (
      entry.branchId === normalized.events[index]?.branchId
      && entry.storyArcId === normalized.events[index]?.storyArcId
      && entry.studentId === normalized.events[index]?.studentId
      && STUDENT_IDS.has(entry.studentId)
    ))
    && value.teacherVictories.every((entry, index) => (
      entry.teacherId === normalized.teacherVictories[index]?.teacherId
      && entry.studentId === normalized.teacherVictories[index]?.studentId
      && entry.themeId === normalized.teacherVictories[index]?.themeId
    ))
}

export function recordAfterSchoolEventMemory(album, { branchId, storyStep = 0 } = {}) {
  const normalized = normalizeStoryKeyVisualAlbum(album)
  if (!BRANCH_IDS.has(branchId)) return normalized
  if (normalized.events.some((entry) => entry.branchId === branchId)) return normalized
  const branch = afterSchoolBranchById(branchId)
  return {
    ...normalized,
    events: [
      ...normalized.events,
      {
        branchId: branch.id,
        storyArcId: afterSchoolStoryArcForStep(storyStep).id,
        studentId: branch.studentId,
      },
    ],
  }
}

export function recordTeacherVictoryMemory(album, {
  teacherId,
  studentId,
  themeId,
} = {}) {
  const normalized = normalizeStoryKeyVisualAlbum(album)
  const next = normalizeTeacherVictory({ teacherId, studentId, themeId })
  if (!next || normalized.teacherVictories.some((entry) => entry.teacherId === teacherId)) {
    return normalized
  }
  return {
    ...normalized,
    teacherVictories: [...normalized.teacherVictories, next],
  }
}

export function storyKeyVisualAlbumFromLegacyBonds(bonds) {
  const normalizedBonds = normalizeAfterSchoolBonds(bonds)
  const events = AFTER_SCHOOL_BRANCHES
    .filter((branch) => (normalizedBonds[branch.studentId]?.visits ?? 0) > 0)
    .map((branch, index) => ({
      branchId: branch.id,
      storyArcId: afterSchoolStoryArcForStep(index).id,
      studentId: branch.studentId,
    }))
  return { events, teacherVictories: [] }
}

export function storyKeyVisualAlbumCount(album) {
  const normalized = normalizeStoryKeyVisualAlbum(album)
  return normalized.events.length + normalized.teacherVictories.length
}

export function storyKeyVisualAlbumCapacity() {
  return AFTER_SCHOOL_BRANCHES.length
    + Object.keys(TEACHER_RIVALS).length
}
