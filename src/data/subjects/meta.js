// 中学の社会・理科の教材の決まり（教科・冊・演習の段階・問題の形）。本文は各冊のファイル（geography.js など）。
//
// 単元の並びは、今の中学校教科書（社会は地理・歴史・公民の3冊、理科は1〜3年の3冊）の単元の順にそろえる。
// 本文・図・問題はこのアプリで書いたもので、教科書の文や図は使わない。
//
//   単元 = {
//     id: 'geo-01',                         // 冊の略号（geo・his・civ・gso・hso・gtk・jtk・sc1・sc2・sc3）＋2けたの番号。並べ替えない
//                                           // gso＝高校の地理総合（geoSogo）、hso＝高校の歴史総合（hisSogo）、
//                                           // gtk＝高校の地理探究（geoTankyu）、jtk＝高校の日本史探究（jhsTankyu）
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
//   単元には、高校の4冊（地理総合・歴史総合・地理探究・日本史探究）だけ exam（共通テストでの出方、1〜2文）を足す。冊には examTrend（出題傾向）を持たせる。
//   level は 'basic'（基礎）・'standard'（標準）・'exam'（入試）。

export const SUBJECT_IDS = Object.freeze(['social', 'science'])

const book = (id, label, short, emoji, color, description, examTrend = null) => Object.freeze({ id, label, short, emoji, color, description, examTrend })

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
      // 高校の必履修科目（地理総合・歴史総合）。単元は出版社の教科書の目次の順。共通テストの出題傾向は冊のトップに出す。
      book('geoSogo', '地理総合', '地総', '🧭', '#0369a1', '高校の必履修科目：地図とGIS・世界の生活文化と地球的課題・防災と地域調査', Object.freeze([
        Object.freeze({ heading: '試験の形', body: '共通テストでは「地理総合，地理探究」と「地理総合，歴史総合，公共」で出題される。後者は地理総合・歴史総合・公共の3つから2つを選んで解答する（各50点）。国公立大学の二次試験や私立大学では、大学ごとに出題範囲が決まっている。' }),
        Object.freeze({ heading: '問われ方', body: '統計表・統計地図・グラフ・地形図・衛星画像などの資料を組み合わせて読み取り、基本的な知識をもとに分析して判断する問題が中心になる。用語の暗記だけでは解けず、資料のどこを見るかが問われる。' }),
        Object.freeze({ heading: '出題の柱', body: '学習指導要領の3つの柱に沿う。A 地図・GIS（図法・時差・地形図・統計地図）、B 世界の生活文化と地球的課題（気候・産業・宗教・環境・資源・人口・都市）、C 防災と地域づくり（自然災害・ハザードマップ・地域調査）。' }),
        Object.freeze({ heading: 'この冊の学び方', body: '各単元の要点で用語と図の読み方をつかみ、「入試」の演習で資料を読む練習をする。統計の問題は、実数か割合か、いつの値か、単位は何かを最初に確かめる。' }),
      ])),
      book('hisSogo', '歴史総合', '歴総', '📜', '#9a3412', '高校の必履修科目：近代化・大衆化・グローバル化の中の日本と世界', Object.freeze([
        Object.freeze({ heading: '試験の形', body: '共通テストでは「歴史総合，日本史探究」「歴史総合，世界史探究」「地理総合，歴史総合，公共」で出題される。2025年度から、日本史探究・世界史探究の受験者にも歴史総合が出題範囲に加わった。' }),
        Object.freeze({ heading: '問われ方', body: '史料文・図版・地図・表・グラフなどの資料を読み取り、知識と結びつけて判断する問題が中心になる。会話文やレポートの形で、複数の資料や仮説を比べる問題も多い。単純な暗記だけで解ける問題は少ない。' }),
        Object.freeze({ heading: '出題の中心', body: '近代化・大衆化・グローバル化の3つの視点から、日本と世界の出来事のつながりを問う。年代の暗記より、出来事の原因・結果・順序・影響が問われる。近代の比重が大きい。' }),
        Object.freeze({ heading: 'この冊の学び方', body: '出来事を「いつ・どこで・なぜ・何をもたらしたか」で整理し、年表で前後関係を確かめる。「入試」の演習で、史料や統計を読んで答える練習をする。' }),
      ])),
      // 高校の選択科目（地理探究・日本史探究）。単元は出版社の教科書の目次の順。
      book('geoTankyu', '地理探究', '地探', '🗺️', '#047857', '高校の選択科目：自然・産業・人口と都市・生活文化の系統地理、世界の諸地域の地誌、これからの日本の国土像', Object.freeze([
        Object.freeze({ heading: '試験の形', body: '共通テストでは「地理総合，地理探究」として出題される（100点・60分）。地理探究の範囲に加えて、地理総合の範囲からも出題されるので、地理総合の内容もあわせて学ぶ必要がある。国公立大学の二次試験でも、地理探究が出題範囲になる大学が多い。' }),
        Object.freeze({ heading: '問われ方', body: '統計表・グラフ・主題図・地形図・衛星画像などの資料をもとに、自然・産業・人口・都市などの系統地理の知識と、地域の特色を結びつけて判断する問題が中心になる。複数の資料から、ある国や地域を見分ける問題も多い。' }),
        Object.freeze({ heading: '出題の柱', body: '学習指導要領の3つの柱に沿う。A 現代世界の系統地理的考察（自然環境・資源と産業・交通と通信・人口と都市・生活文化と民族・宗教）、B 現代世界の地誌的考察（世界の諸地域）、C 現代世界におけるこれからの日本の国土像。' }),
        Object.freeze({ heading: 'この冊の学び方', body: '系統地理の単元で、気候・農業・工業などの分布のしくみを図とあわせてつかみ、地誌の単元で、それらを1つの地域にまとめて確かめる。「入試」の演習で、統計や地図から国や地域を見分ける練習をする。' }),
      ])),
      book('jhsTankyu', '日本史探究', '日探', '⛩️', '#7f1d1d', '高校の選択科目：原始・古代から現代までの日本の歴史と、資料から考える現代日本の課題', Object.freeze([
        Object.freeze({ heading: '試験の形', body: '共通テストでは「歴史総合，日本史探究」として出題される（100点・60分）。日本史探究の範囲に加えて、歴史総合の範囲からも出題される。国公立大学の二次試験や私立大学でも、日本史探究が出題範囲になる大学が多い。' }),
        Object.freeze({ heading: '問われ方', body: '史料文・図版・地図・年表・統計などの資料を読み取り、知識と結びつけて判断する問題が中心になる。会話文やレポートの形で、出来事の背景や影響、時代のちがいを比べる問題が多い。出来事を年代の順に並べる問題もよく出る。' }),
        Object.freeze({ heading: '出題の柱', body: '原始・古代、中世、近世、近代・現代の各時代の政治・社会・経済・文化と、東アジアや世界との関係が問われる。1つの時代だけでなく、土地の制度の移り変わりのように、時代をまたいだ変化を問う問題も多い。' }),
        Object.freeze({ heading: 'この冊の学び方', body: '単元の要点で、出来事を「いつ・だれが・なぜ・何をもたらしたか」で整理し、図や年表で前後関係を確かめる。「入試」の演習で、史料や資料を読んで答える練習をする。' }),
      ])),
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

// 1つの単元に置く問題の数（段階ごと）。中学の冊は各3問、高校の4冊は各4問。tests/junior-social-science.test.mjs が全単元で確かめる。
export const QUESTIONS_PER_LEVEL = Object.freeze({ basic: 3, standard: 3, exam: 3 })
export const HIGH_SCHOOL_QUESTIONS_PER_LEVEL = Object.freeze({ basic: 4, standard: 4, exam: 4 })
export const HIGH_SCHOOL_BOOK_IDS = Object.freeze(['geoSogo', 'hisSogo', 'geoTankyu', 'jhsTankyu'])

/** 冊の1単元あたりの問題の数（段階ごと）。 */
export const questionsPerLevel = (bookId) => (HIGH_SCHOOL_BOOK_IDS.includes(bookId) ? HIGH_SCHOOL_QUESTIONS_PER_LEVEL : QUESTIONS_PER_LEVEL)
