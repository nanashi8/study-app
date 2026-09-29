// 中学の社会・理科の教材の決まり（教科・冊・演習の段階・問題の形）。本文は各冊のファイル（geography.js など）。
//
// 単元の並びは、今の中学校教科書（社会は地理・歴史・公民の3冊、理科は1〜3年の3冊）の単元の順にそろえる。
// 本文・図・問題はこのアプリで書いたもので、教科書の文や図は使わない。
//
//   単元 = {
//     id: 'geo-01',                         // 冊の略号（geo・his・civ・sc1・sc2・sc3）＋2けたの番号。並べ替えない
//     book: 'geography',
//     part: '第1編 世界と日本の地域構成',     // 教科書の編・章・単元（見出しに出す）
//     chapter: '第1章 世界の姿',              // 教科書の章・節（単元の名前の前に出す）
//     title: '世界の姿',
//     goal: 'この単元で説明できるようになること（1文）',
//     points: [{ heading, body, figure? }],   // 要点（学ぶ）。body は2〜4文
//     terms: [[語句, 意味] | [語句, 意味, { note }]],   // 重要語句。ID は `${単元ID}-t01` から順に付く（足すときは末尾へ）
//     questions: [問題],                      // 演習。ID は `${単元ID}-q01` から順に付く（足すときは末尾へ）
//   }
//
//   問題（選ぶ）   = { level, text, figure?, choices: [[選択肢, その選択肢の説明], …4つ。先頭が正解], explanation }
//   問題（数を入れる）= { level, kind: 'number', text, figure?, answer: 2.7, unit: 'g/cm³', steps: [解き方の文], explanation }
//   問題（並べる） = { level, kind: 'order', text, items: [[並べるもの, そこに置く理由], …正しい順], explanation }
//   level は 'basic'（基礎）・'standard'（標準）・'exam'（入試）。

export const SUBJECT_IDS = Object.freeze(['social', 'science'])

const book = (id, label, short, emoji, color, description) => Object.freeze({ id, label, short, emoji, color, description })

export const SUBJECTS = Object.freeze({
  social: Object.freeze({
    id: 'social',
    label: '社会',
    appLabel: '社会アプリ',
    emoji: '🗾',
    color: '#0f766e',
    screens: Object.freeze({
      home: 'socialHome',
      unit: 'socialUnit',
      study: 'socialStudy',
      quiz: 'socialQuiz',
      practice: 'socialPractice',
    }),
    // 記録の置き場所（暗記の記録・演習の記録）と、問題ごとの結果の教材ID。
    termSrsField: 'socialTermSrs',
    practiceLogField: 'socialPracticeLog',
    termDomain: 'social-terms',
    practiceDomain: 'social-practice',
    notebookTerms: 'socialTerms',
    notebookPractice: 'socialPractice',
    termSkill: 'social_terms',
    practiceSkill: 'social_practice',
    books: Object.freeze([
      book('geography', '地理', '地理', '🌏', '#0e7490', '世界と日本の地域の特色'),
      book('history', '歴史', '歴史', '🏯', '#b45309', '古代から現代までの日本と世界'),
      book('civics', '公民', '公民', '⚖️', '#4338ca', '憲法・政治・経済・国際社会'),
    ]),
  }),
  science: Object.freeze({
    id: 'science',
    label: '理科',
    appLabel: '理科アプリ',
    emoji: '🔬',
    color: '#15803d',
    screens: Object.freeze({
      home: 'scienceHome',
      unit: 'scienceUnit',
      study: 'scienceStudy',
      quiz: 'scienceQuiz',
      practice: 'sciencePractice',
    }),
    termSrsField: 'scienceTermSrs',
    practiceLogField: 'sciencePracticeLog',
    termDomain: 'science-terms',
    practiceDomain: 'science-practice',
    notebookTerms: 'scienceTerms',
    notebookPractice: 'sciencePractice',
    termSkill: 'science_terms',
    practiceSkill: 'science_practice',
    books: Object.freeze([
      book('science1', '1年', '1年', '🌱', '#15803d', '生物の分類・物質・光と音と力・大地の変化'),
      book('science2', '2年', '2年', '⚡', '#0369a1', '化学変化・生物のからだ・天気・電気'),
      book('science3', '3年', '3年', '🪐', '#7c3aed', 'イオン・生命の連続性・運動とエネルギー・地球と宇宙・環境'),
    ]),
  }),
})

export const subjectMeta = (subject) => SUBJECTS[subject] ?? null

export const bookMeta = (subject, bookId) => SUBJECTS[subject]?.books.find((item) => item.id === bookId) ?? null

// 演習の段階。基礎は用語と基本の理解、標準は資料・理由・計算、入試は複数の知識を組み合わせる問題。
export const PRACTICE_LEVELS = Object.freeze({
  basic: Object.freeze({ id: 'basic', label: '基礎', color: '#0284c7' }),
  standard: Object.freeze({ id: 'standard', label: '標準', color: '#d97706' }),
  exam: Object.freeze({ id: 'exam', label: '入試', color: '#be123c' }),
})

export const PRACTICE_LEVEL_IDS = Object.freeze(Object.keys(PRACTICE_LEVELS))

// 問題の形。選ぶ（4択）・数を入れる（計算）・並べる（年代順・手順）。
export const PRACTICE_KINDS = Object.freeze({
  choice: Object.freeze({ id: 'choice', label: '選ぶ' }),
  number: Object.freeze({ id: 'number', label: '数を入れる' }),
  order: Object.freeze({ id: 'order', label: '並べる' }),
})

// 1つの単元に置く問題の数（段階ごと）。tests/junior-social-science.test.mjs が全単元で確かめる。
export const QUESTIONS_PER_LEVEL = Object.freeze({ basic: 3, standard: 3, exam: 3 })
