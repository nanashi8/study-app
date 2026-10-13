// 設問が「the man / the woman / the boy / the girl」で話者を指すリスニング問題の確認
// （requests/2026-10-14-content-observations-fix.json）。台本には性別がなく、音声は端末の声で話者を分けるので、
// 設問の人物が話者A・Bのどちらかを台帳（src/data/listening-speaker-roles.js）に決め、性別に合う声・声の高さ・
// 本文の話者名へつなぐ。
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { LISTENING_ITEMS } from '../src/data/listening.js'
import { LISTENING_ROLE_LABELS, LISTENING_SPEAKER_ROLES } from '../src/data/listening-speaker-roles.js'
import {
  createListeningSpeechItems,
  listeningSpeakerGenders,
  listeningSpeakerLabel,
  voiceGender,
} from '../src/lib/listening.js'

const ROLE_WORD = { woman: 'woman', man: 'man', boy: 'boy', girl: 'girl' }
const NAMES_A_PERSON = /\b(?:the|The) (woman|man|boy|girl)\b|\b(woman|man|boy|girl)['’]s\b/g

// 設問・選択肢が人物を名指す問題のうち、絵の設問（Which sentence matches the picture?）は話者ではないので外す。
const isPicture = (item) => /matches the picture/i.test(item.question)
const namedRoles = (item) => {
  const text = [item.question, ...item.choices.map((choice) => choice.text)].join(' ')
  return new Set([...text.matchAll(NAMES_A_PERSON)].map((match) => match[1] ?? match[2]))
}
const TARGETS = LISTENING_ITEMS.filter((item) => !isPicture(item) && namedRoles(item).size > 0)

test('設問が性別で話者を指す問題は全件、台帳が話者A・Bのどちらかを決めている', () => {
  assert.equal(LISTENING_ITEMS.length, 160)
  assert.equal(TARGETS.length, 22, '性別で話者を指す設問の数')
  assert.deepEqual(
    TARGETS.map((item) => item.id).sort(),
    Object.keys(LISTENING_SPEAKER_ROLES).sort(),
    '設問が指す問題と台帳の問題が一致しない',
  )
  for (const item of TARGETS) {
    const roles = LISTENING_SPEAKER_ROLES[item.id]
    const speakersInAudio = new Set(item.audio.map((segment) => segment.speaker))
    for (const [speaker, role] of Object.entries(roles)) {
      assert.ok(['A', 'B'].includes(speaker), `${item.id}: 話者 ${speaker}`)
      assert.ok(speakersInAudio.has(speaker), `${item.id}: 台本に話者${speaker}がいない`)
      assert.ok(ROLE_WORD[role], `${item.id}: 人物 ${role}`)
    }
    // 設問が名指した人物は、必ず台帳のどちらかの話者に当たる。
    const assigned = new Set(Object.values(roles))
    for (const role of namedRoles(item)) assert.ok(assigned.has(role), `${item.id}: 設問の ${role} が台帳にない`)
    // 台帳の人物は、設問や選択肢の語（his・her）と性別が食い違わない。
    const text = [item.question, ...item.choices.map((choice) => choice.text)].join(' ')
    const male = [...assigned].some((role) => role === 'man' || role === 'boy')
    const female = [...assigned].some((role) => role === 'woman' || role === 'girl')
    if (/\b(his|He|he)\b/.test(text)) assert.ok(male, `${item.id}: his・he なのに男性の人物がない`)
    if (/\b(her|She|she)\b/.test(text)) assert.ok(female, `${item.id}: her・she なのに女性の人物がない`)
  }
})

test('台帳の人物は、台本の発言と食い違わない（絵の設問は台帳に入れない）', () => {
  for (const item of LISTENING_ITEMS.filter(isPicture)) {
    assert.equal(LISTENING_SPEAKER_ROLES[item.id], undefined, `${item.id}: 絵の設問は話者ではない`)
  }
  // 設問の人物がした発言（台本の根拠）。台帳の話者が、その発言の話者であること。
  const evidence = {
    listen_2_03: { A: /Keep the data/, B: /Should I remove/ },
    listen_2_02: { B: /I will take the local train/ },
    listen_3_09: { B: /make it for my family/ },
    listen_3_10: { B: /Join us by phone/ },
    listen_3_11: { B: /I will finish it tonight/ },
    listen_4_14: { B: /I will call her back/ },
    listen_5_11: { B: /I will bring a cake/ },
    listen_5_13: { B: /I will take my umbrella/ },
    listen_pre2_08: { B: /basketball practice until noon/ },
    listen_pre2plus_06: { B: /practice call/ },
    listen_1_05: { A: /renewable loan/ },
    listen_pre1_06: { A: /test the financial model/ },
    listen_pre2_13: { A: /should not run/ },
    listen_4_11: { A: /fifty dollars/ },
    listen_5_10: { A: /Is this bus for Central Park/ },
  }
  for (const [id, speakers] of Object.entries(evidence)) {
    const item = LISTENING_ITEMS.find((candidate) => candidate.id === id)
    for (const [speaker, pattern] of Object.entries(speakers)) {
      assert.ok(LISTENING_SPEAKER_ROLES[id]?.[speaker], `${id}: 台帳に話者${speaker}がない`)
      const lines = item.audio.filter((segment) => segment.speaker === speaker).map((segment) => segment.text).join(' ')
      assert.match(lines, pattern, `${id}: 話者${speaker}の発言`)
    }
  }
})

test('性別に合う声と声の高さを割り当てる（女性・女の子は女性の声と高い声、男性・男の子は男性の声と低い声）', () => {
  const voice = (name, voiceURI, lang = 'en-US') => ({ name, voiceURI, lang, default: false, localService: true })
  const alex = voice('Alex', 'voice-alex')
  const samantha = voice('Samantha', 'voice-samantha')
  assert.equal(voiceGender(samantha), 'female')
  assert.equal(voiceGender(alex), 'male')
  assert.equal(voiceGender(voice('Google UK English Female', 'g-f')), 'female')
  assert.equal(voiceGender(voice('Google UK English Male', 'g-m')), 'male')
  assert.equal(voiceGender(voice('Microsoft Zira - English (United States)', 'ms-z')), 'female')
  assert.equal(voiceGender(voice('Compact Voice', 'x')), null)

  const speak = (id, voices, voiceURI) => {
    const item = LISTENING_ITEMS.find((candidate) => candidate.id === id)
    const byRole = {}
    for (const entry of createListeningSpeechItems(item, { voiceURI, voices })) {
      if (['A', 'B'].includes(entry.meta.speaker)) byRole[entry.meta.speaker] = entry
    }
    return byRole
  }

  // 女性が話者B（listen_2_02）。男性の声が設定音声でも、B は女性の声。A は反対の性別（男性）の声。
  const female = speak('listen_2_02', [alex, samantha], alex.voiceURI)
  assert.equal(female.B.voiceURI, samantha.voiceURI)
  assert.equal(female.A.voiceURI, alex.voiceURI)
  assert.ok(female.B.pitch > female.A.pitch, '女性の声が男性の声より高い')

  // 男性が話者A（listen_1_05）。設定音声が女性の声でも、A は男性の声。
  const male = speak('listen_1_05', [alex, samantha], samantha.voiceURI)
  assert.equal(male.A.voiceURI, alex.voiceURI)
  assert.equal(male.B.voiceURI, samantha.voiceURI)
  assert.ok(male.B.pitch > male.A.pitch)

  // 男の子（listen_3_09 の B）。もう一方の A は反対の性別の声。
  const boy = speak('listen_3_09', [alex, samantha], samantha.voiceURI)
  assert.equal(boy.B.voiceURI, alex.voiceURI)
  assert.equal(boy.A.voiceURI, samantha.voiceURI)

  // 声が1つの端末でも、性別で声の高さが変わり、話者A・Bの高さが違う。
  const single = speak('listen_2_02', [alex], alex.voiceURI)
  assert.ok(single.B.pitch > single.A.pitch, '1つの声でも女性が高い')
  assert.notEqual(single.A.pitch, single.B.pitch)

  // 性別が分からない声だけの端末でも、話者A・Bは別の声（または高さ）になる。
  const unknownA = voice('Voice One', 'voice-one')
  const unknownB = voice('Voice Two', 'voice-two')
  const unknown = speak('listen_2_02', [unknownA, unknownB], unknownA.voiceURI)
  assert.notEqual(unknown.A.voiceURI, unknown.B.voiceURI)

  // 台帳にない問題は、従来どおり設定音声が A・別の音声が B で、高さは A 0.94・B 1.06。
  const plain = speak('listen_1_01', [alex, samantha], alex.voiceURI)
  assert.equal(plain.A.voiceURI, alex.voiceURI)
  assert.equal(plain.B.voiceURI, samantha.voiceURI)
  assert.equal(plain.A.pitch, 0.94)
  assert.equal(plain.B.pitch, 1.06)
  assert.deepEqual(listeningSpeakerGenders(LISTENING_ITEMS.find((item) => item.id === 'listen_1_01')), {})
})

test('本文の話者名は、台帳が人物を書いた話者に「（女性）」などを添え、画面がそれを使う', () => {
  const item = LISTENING_ITEMS.find((candidate) => candidate.id === 'listen_2_03')
  assert.equal(listeningSpeakerLabel(item, 'A'), '話者A（女性）')
  assert.equal(listeningSpeakerLabel(item, 'B'), '話者B（男性）')
  const oneSided = LISTENING_ITEMS.find((candidate) => candidate.id === 'listen_3_09')
  assert.equal(listeningSpeakerLabel(oneSided, 'B'), '話者B（男の子）')
  assert.equal(listeningSpeakerLabel(oneSided, 'A'), '話者A', '台帳が書かない話者は性別を添えない')
  assert.deepEqual(Object.values(LISTENING_ROLE_LABELS).sort(), ['女の子', '女性', '男の子', '男性'])
  const screen = readFileSync(new URL('../src/screens/ListeningQuiz.jsx', import.meta.url), 'utf8')
  assert.match(screen, /listeningSpeakerLabel\(item, segment\.speaker/)
})
