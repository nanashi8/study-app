import { battleStudentById } from './battleCast.js'
import { SCHOOL_TEACHERS } from './rpg.js'

export const TEACHER_SCHOOL_LIFE_IDS = Object.freeze(Object.keys(SCHOOL_TEACHERS))

const TEACHER_LIFE_DETAILS = {
  'grass-wolf': {
    location: '放課後の英語教室',
    everyday: '白石先生は返却する答案へ、一枚ずつ違う英語のひとことを書き添えている。',
    opening: 'お疲れさま。今日の授業、最後の文までよく声が出ていたね。Excellent!',
    excellent: '92点！ Excellent! 間違えた8点も、次に伸びる場所としてちゃんと見ておこう。',
    good: '76点なら土台はできているよ。あと一歩だった問題を、放課後に一緒に声へ出そう。',
    close: '42点……合格点は越えた。でも、その安心した顔は少し早いかな。三問だけ直して帰ろう。',
    ownRemedial: 'なにぃぃぃ!? 私の英語で赤点を取ったの!? 教科書を持って戻ってきなさーい！',
    stay: '逃げずに言えてえらい。全部ではなく、間違えた三問から一緒にやり直そう。',
    pursuit: '廊下の後ろから、白石先生の「Wait!」とチョークを握る音が追ってくる。',
    otherConcern: '分からないところを言葉にできれば、担当の先生もきっと力になってくれるよ。',
  },
  'forest-keeper': {
    location: '図書室前の廊下',
    everyday: '文月先生は返却本を抱えながら、生徒の作文に挟む小さな栞を選んでいる。',
    opening: '今日の発言には、きちんと理由があったね。答えだけでなく、そこへ至る言葉を大切にしなさい。',
    excellent: '92点。答案の余白に書いた根拠まで読んだよ。君の言葉で説明できていたのが何よりいい。',
    good: '76点か。読み取れている。あとは、頭の中の根拠を答案へ一文残せるとさらに強い。',
    close: '42点。合格ではあるが、主語を省いて喜びまで省略してはいけない。直しを一緒に読もう。',
    ownRemedial: '……今、国語と言ったな。主語も述語も明瞭だ。残念ながら聞き間違いではない。補習です。',
    stay: 'よろしい。叱りたいのではない。君が本当は何を読み取っていたのか、最後まで聞かせてほしい。',
    pursuit: '文月先生は走らず、「逃げる」という動詞の行き先を静かに廊下の先へ問いかけた。',
    otherConcern: '担当の先生へ、どこから分からなくなったかを一文で伝えてみなさい。',
  },
  chronos: {
    location: '時計の止まった数学教室',
    everyday: '角田先生は傾いた机を見つけ、巨大コンパスを使わず指一本でまっすぐに直した。',
    opening: '途中の考え方を消さずに残したな。答えへ届かなくても、そこには次の一手がある。',
    excellent: '92点。計算も根拠もきれいだ。残り8点は誤差ではないから、そこだけ検算しておこう。',
    good: '76点。式の立て方は合っている。符号を一つずつ確かめれば、まだ伸びるぞ。',
    close: '42点……合格点との差は正だ。しかし油断するとすぐ負になる。放課後、途中式を見せなさい。',
    ownRemedial: '数学だと!? 計算が合わん！ 私の授業＋君の努力が、なぜ赤点になる！ 再計算だ！',
    stay: 'よし。間違いは故障ではなく手掛かりだ。どの式で道を外れたか、一緒に逆算しよう。',
    pursuit: '角田先生のコンパスが廊下へ大きな円を描き、逃走経路を幾何学的にふさいでいく。',
    otherConcern: '担当の先生と答案を分解しなさい。問題は必ず、解ける大きさまで小さくできる。',
  },
  leviathan: {
    location: '地図と掲示物の並ぶ地理教室',
    everyday: '地図野先生は世界地図へ新しい写真を貼り、その土地の挨拶を小さく書き込んでいる。',
    opening: '今日出てきた国のこと、名前だけで終わらせないでね。そこにも毎日の暮らしがあるから。',
    excellent: '92点！ 出来事を場所と理由まで結びつけられていたね。地図を読む目が育っているよ。',
    good: '76点。大きな流れはつかめている。次は地図のどこで起きたかも一緒に覚えよう。',
    close: '42点か。国境線のように、合格線ぎりぎりだね。越えた後こそ地図を確認しよう。',
    ownRemedial: '地理!? 地図上のどこへ逃げても、補習教室はここです！ 地球儀を回して待っています！',
    stay: '戻ってきてくれてありがとう。年号を全部抱えず、まず三つの出来事を一本の線で結ぼう。',
    pursuit: '回転する地球儀が次々と近道を示し、地図野先生が先回りして手を振っている。',
    otherConcern: '担当の先生にも事情があるはず。まずは答案を持って、助けを求めに行こう。',
  },
  librarian: {
    location: '放課後の化学実験室',
    everyday: '火野先生は全員分の安全ゴーグルを点検し、曇った一枚を黙って磨き直している。',
    opening: '今日の実験、予想と違ったからこそ面白かったね。失敗も立派な観察結果だよ。',
    excellent: '92点！ 結果だけでなく「なぜ」を書けていた。科学者らしい答案だったよ。',
    good: '76点。観察はできているね。条件をもう一つそろえれば、説明まできれいにつながる。',
    close: '42点……ぎりぎり成功、とは実験では言わない。再現できるように間違いを確かめよう。',
    ownRemedial: '化学で赤点だとぉ!? その結果は再実験が必要だ！ 安全ゴーグルと答案を持ってきなさい！',
    stay: 'よし、正直な報告は良い実験の第一歩だ。失敗した条件から一緒に調べ直そう。',
    pursuit: '火野先生は安全ゴーグルを二つ抱え、「廊下は走るな！」と言いながら早歩きで追ってくる。',
    otherConcern: '失敗を隠さず担当の先生へ見せよう。それが次の仮説を作る一番のデータになる。',
  },
  'silent-dragon': {
    location: '録音機材のある英語コミュニケーション教室',
    everyday: '響先生は録音した会話を聞き直し、生徒ごとに伝わりやすかった一言へ印を付けている。',
    opening: '今日の声は小さくても、相手へ届いていたよ。完璧な発音より、伝えようとしたことが大切だ。',
    excellent: '92点。聞き取った内容を、自分の英語で言い換えられていたね。会話がきちんと続いていた。',
    good: '76点。意味は伝わっている。迷ったフレーズだけ、リズムに合わせてもう一度言おう。',
    close: '42点……会話は途切れなかった。でも返事が一語だけだった所を、短い一文へ直そう。',
    ownRemedial: '……英コミュで赤点？ 聞き取れないふりはできないよ。放課後、ヘッドホンと答案を持って教室へ。',
    stay: '大丈夫。発音を笑うための補習ではない。伝わる一文へ戻る場所を一緒に探そう。',
    pursuit: '廊下のスピーカーから響先生の「Could you come back?」が、逃げた先まで明瞭に届く。',
    otherConcern: '担当の先生にも、どこから分からなくなったかを短く伝えてみよう。会話はそこから始まる。',
  },
  tempest: {
    location: '実験用レールを敷いた物理教室',
    everyday: '速水先生は台車を一台ずつ転がし、センサーが同じ位置で反応するか最後まで確認している。',
    opening: '今日も最後まで測ったな！ 速さだけでなく、変化を記録し続けたことを先生は見ているぞ！',
    excellent: '92点！ 力と加速度の向きを図で説明できた！ 残り8点も誤差にせず検算するぞ！',
    good: '76点！ 悪くない！ 単位と向きをそろえれば、式と実験結果がもっときれいにつながる！',
    close: '42点！ 合格線は越えた！ しかし公式を置いただけの問題を、台車の動きから確認だ！',
    ownRemedial: 'なにぃぃぃ!? 貴様っ！ 私の物理で赤点を取ったのか!! まず加速度を測定……いや、補習プリントだ！',
    stay: 'よし、戻ったな！ 怒鳴って悪かった。式が動きに見えるまで、実験から付き合うぞ！',
    pursuit: '速水先生が光電センサーを廊下へ向け、逃げる速度を測りながら本人は早歩きで追ってくる。',
    otherConcern: '担当の先生も原因を一緒に探してくれる！ 苦手なら、分からない式を正面から見せてこい！',
  },
  'nameless-king': {
    location: '岩石標本の並ぶ地学教室',
    everyday: '工藤先生は校庭で拾った石を分類し、採集場所と地層を書いた札を一枚ずつ添えている。',
    opening: '石は黙っているが、できた場所の記録は残している。今日の観察は細部までよく見ていたぞ。',
    excellent: '92点。地層の順序と当時の環境を結びつけられた。残り8点の年代だけ確かめよう。',
    good: '76点。大地の流れはつかめている。岩石を見分ける根拠を一つ足せばもっと強い。',
    close: '42点……合格層には届いたが、根拠が風化している。標本を見てもう一度書き直すぞ。',
    ownRemedial: '地学で赤点だと!? 地層は積み直せないが、知識は積み直せる！ 標本と答案を持ってこい！',
    stay: 'それでいい。どの層から分からなくなったか、古い順に一緒に掘り出そう。',
    pursuit: '工藤先生は廊下を走らず、校内地質図を開いて逃走先の地盤を先回りして確認した。',
    otherConcern: '担当の先生へ答案を見せてこい。分からなくなった層が見えれば、学び直せるからな。',
  },
  'archive-angel': {
    location: '顕微鏡と観察図の並ぶ生物教室',
    everyday: '彩先生は顕微鏡のレンズを拭き、観察を終えた植物標本を傷めないよう棚へ戻している。',
    opening: '今日のスケッチ、小さな違いを自分の目で見つけられていたね。その観察を大切にしよう。',
    excellent: '92点！ 形だけでなく働きまで説明できていた。生命をつながりで見られる答案だったよ。',
    good: '76点。輪郭は見えているよ。細胞と器官の関係をもう一本の線で結んでみよう。',
    close: '42点……合格ではあるけれど、観察した根拠が薄いね。標本を見て説明を足そう。',
    ownRemedial: '生物で赤点!? 生命の仕組みを丸ごと見失ったの!? 放課後、顕微鏡の焦点から合わせ直すよ！',
    stay: 'いい子。怒るより、君が何を見落としたか一緒に知りたいの。観察図を消さずに直そう。',
    pursuit: '彩先生は廊下の植木を指し、「そこにも復習対象がいるよ」と観察しながら追ってくる。',
    otherConcern: '担当の先生が見たいのは赤点だけじゃないよ。どこで理解が途切れたか、答案ごと見せよう。',
  },
  'word-emperor': {
    location: '年表と史料の並ぶ日本史教室',
    everyday: '鐘ヶ江教頭は古い校務日誌を年代順に並べ、学校の出来事を地域史の年表へ書き足している。',
    opening: '出来事の名前だけでなく、その前後を説明できましたね。歴史は人の選択がつながった流れです。',
    excellent: '92点。史料の言葉を根拠に、出来事の原因と結果まで説明できています。よくできました。',
    good: '76点。大きな時代の流れは見えています。人物と制度をもう一度結びつけましょう。',
    close: '42点。規則上は合格です。しかし年号だけの丸暗記で終えることは認めません。直しを提出してください。',
    ownRemedial: '日本史で赤点!? 過去から学ばず、同じ誤答を繰り返したのですか！ 年表と答案を確認します！',
    stay: '正直に残った点は評価します。叱って終わりにはしません。時代を三つに区切って学び直しましょう。',
    pursuit: '鐘ヶ江教頭は走らず校内放送を入れた。「逃走という出来事を記録する前に、日本史教室へ戻りなさい」',
    otherConcern: '担当の先生も資料を準備しています。気まずくても、まず答案を持って会いに行きなさい。',
  },
  'endless-book': {
    location: '世界地図を広げた朝礼後の講堂',
    everyday: '学園坂校長は長い講話を終えたあと、世界地図を片付ける生徒一人ひとりへ短く礼を伝えている。',
    opening: '短く一言だけ。文明は一つで生まれず、交流の中で育ちます。……ここから少し長い話です。',
    excellent: '92点。異なる地域の出来事を同じ時代の流れで比較できました。立派です。残り8点については……。',
    good: '76点。大きな流れはつかめています。ただし国名を覚えただけで交流を見落としてはいけません。',
    close: '42点。合格した安心と、次の時代へ備える決意について、短く二十項目お話ししましょう。',
    ownRemedial: '世界史で赤点!? ……短く一言。文明の流れから置いていかれています。ここから長い補習を始めます。',
    stay: '戻ってくれてうれしいです。長い話は半分にします。その代わり、世界地図を見ながら最後まで考えましょう。',
    pursuit: '講堂のスピーカーから校長の世界史講話が続き、どこまで逃げても「次の文明ですが」が聞こえてくる。',
    otherConcern: '担当の先生も、君に分かってほしいから待っています。謝るより先に、教えてくださいと言いましょう。',
  },
  'classical-ogura': {
    location: '百人一首と注釈書の並ぶ古典教室',
    everyday: '小倉先生は読み終えた古典の頁へ薄い紙を挟み、次の生徒が迷わないよう語句の場所を整えている。',
    opening: '昔の人の言葉でも、迷ったり笑ったりする気持ちは近いでしょう。今日はその心情まで読めていました。',
    excellent: '92点。助動詞の意味だけでなく、誰が誰を思う場面かまで説明できました。とてもよい読みです。',
    good: '76点。大意はつかめています。主語と敬意の向きを補えば、場面がもっと鮮明になりますよ。',
    close: '42点。現代語訳は届いていますが、助動詞を一つ取り違えました。本文へ戻って確かめましょう。',
    ownRemedial: '古文で赤点ですか!? 「いとをかし」では済みません。活用表と本文を持って古典教室へ来なさい！',
    stay: '逃げずに来られましたね。全部を暗記し直さず、まず主語と助動詞を一文ずつ確かめましょう。',
    pursuit: '小倉先生が廊下の先で扇を開き、「逃ぐ」の活用と行き先を落ち着いて問いかけている。',
    otherConcern: '担当の先生へ、読めなくなった一文をそのまま見せてください。分からない場所が分かれば進めます。',
  },
}

function teacherLifeProfile(id) {
  const teacher = SCHOOL_TEACHERS[id]
  const details = TEACHER_LIFE_DETAILS[id]
  return Object.freeze({ id, ...teacher, ...details })
}

export const TEACHER_SCHOOL_LIFE = Object.freeze(
  TEACHER_SCHOOL_LIFE_IDS.map(teacherLifeProfile),
)

const TEACHER_LIFE_BY_ID = new Map(
  TEACHER_SCHOOL_LIFE.map((teacher) => [teacher.id, teacher]),
)
const TEACHER_LIFE_BY_SUBJECT = new Map(
  TEACHER_SCHOOL_LIFE.map((teacher) => [teacher.teacherSubject, teacher]),
)

export const TEACHER_TEST_SCORE_CHOICES = Object.freeze([
  { id: 'excellent', label: '92点でした！', score: 92 },
  { id: 'good', label: '76点でした', score: 76 },
  { id: 'close', label: '42点でした……', score: 42 },
  { id: 'remedial', label: '赤点で、補習でした……', score: 31 },
])

const SCORE_CHOICE_BY_ID = new Map(
  TEACHER_TEST_SCORE_CHOICES.map((choice) => [choice.id, choice]),
)

const STUDENT_ESCAPE_NARRATION = {
  mio: 'ミオは楽譜を胸へ抱え、「補習には後で行きます！」と半音高い声を残して走り出した。',
  ren: 'レンはスケッチブックを盾のように掲げ、曲がり角の先へ一筆書きのように逃げた。',
  haru: 'ハルは返却本を抱え、図書室までの最短経路を静かな観察眼で選んだ。',
  akari: 'アカリは「これは逃走経路の実験です！」と言い残し、階段の条件を変えながら駆けた。',
  kaito: 'カイトは返事より先にスタートを切った。廊下を走ってはいけないので、競歩である。',
  rei: 'レイは手帳へ「補習・予定再調整」と書き込みながら、冷静な早歩きでその場を離れた。',
  nao: 'ナオは「Sorry! 放課後に戻ります！」と両手を合わせ、笑顔のまま廊下へ飛び出した。',
  tsubaki: 'ツバキは深く一礼してから身を翻した。礼は正しいが、逃げたことに変わりはない。',
  noa: 'ノアは校内案内アプリで先生から最も遠い経路を検索し、非常階段ではない方へ急いだ。',
  yuu: 'ユウは「主人公はここで逃げ出した」と心の中で書き、物語どおり廊下へ駆け出した。',
}

export function teacherSchoolLifeById(id) {
  return TEACHER_LIFE_BY_ID.get(id) ?? TEACHER_SCHOOL_LIFE[0]
}

export function teacherSchoolLifeBySubject(subject) {
  return TEACHER_LIFE_BY_SUBJECT.get(subject) ?? null
}

export function teacherRemedialSubjectChoices(teacherId) {
  const teacher = teacherSchoolLifeById(teacherId)
  const subjects = TEACHER_SCHOOL_LIFE.map((item) => item.teacherSubject)
  const ownIndex = subjects.indexOf(teacher.teacherSubject)
  const others = [
    subjects[(ownIndex + 3) % subjects.length],
    subjects[(ownIndex + 7) % subjects.length],
  ]
  const ownPosition = Math.abs(ownIndex) % 3
  const choices = [...others]
  choices.splice(ownPosition, 0, teacher.teacherSubject)
  return choices.map((subject) => {
    const subjectTeacher = teacherSchoolLifeBySubject(subject)
    return {
      id: subject,
      label: subject,
      emoji: subjectTeacher?.elementEmoji ?? '📘',
      isOwn: subject === teacher.teacherSubject,
    }
  })
}

function teacherDisplayName(teacher) {
  return teacher.name.replace(/先生$/u, '')
}

function message(role, text, speakerId = null) {
  return { role, text, speakerId }
}

export function createTeacherSchoolLifeConversation({
  teacherId,
  studentId,
  scoreChoiceId = null,
  remedialSubject = null,
  resolutionId = null,
} = {}) {
  const teacher = teacherSchoolLifeById(teacherId)
  const student = battleStudentById(studentId)
  const scoreChoice = SCORE_CHOICE_BY_ID.get(scoreChoiceId) ?? null
  const messages = [
    message('narration', `${teacher.location}。${teacher.everyday}`),
    message('teacher', teacher.opening, teacher.id),
    message('teacher', 'そういえば、この間の定期テストは何点だった？', teacher.id),
  ]

  if (!scoreChoice) {
    return { phase: 'score', teacher, student, messages }
  }

  messages.push(message('student', scoreChoice.label, student.id))

  if (scoreChoice.id !== 'remedial') {
    messages.push(message('teacher', teacher[scoreChoice.id], teacher.id))
    return { phase: 'complete', teacher, student, scoreChoice, messages }
  }

  messages.push(message(
    'teacher',
    'そうか、補習だったな……。先生たちは日々一生懸命教えているのに、担当の先生も気の毒に。で、補習の教科は何だった？',
    teacher.id,
  ))

  if (!remedialSubject) {
    return { phase: 'subject', teacher, student, scoreChoice, messages }
  }

  messages.push(message('student', `${remedialSubject}です……`, student.id))

  if (remedialSubject !== teacher.teacherSubject) {
    const subjectTeacher = teacherSchoolLifeBySubject(remedialSubject)
    const colleague = subjectTeacher
      ? `${teacherDisplayName(subjectTeacher)}先生`
      : `${remedialSubject}の先生`
    messages.push(message(
      'teacher',
      `そうか、${colleague}の${remedialSubject}か……。${teacher.otherConcern}`,
      teacher.id,
    ))
    return {
      phase: 'complete',
      teacher,
      student,
      scoreChoice,
      remedialSubject,
      messages,
    }
  }

  messages.push(message('teacher', teacher.ownRemedial, teacher.id))

  if (!resolutionId) {
    return {
      phase: 'resolution',
      teacher,
      student,
      scoreChoice,
      remedialSubject,
      messages,
    }
  }

  if (resolutionId === 'escape') {
    messages.push(message('student', '……逃げる！', student.id))
    messages.push(message(
      'narration',
      `${STUDENT_ESCAPE_NARRATION[student.id] ?? `${student.name}は廊下へ逃げ出した。`} ${teacher.pursuit}`,
    ))
  } else {
    messages.push(message('student', '逃げません。補習を受けます……！', student.id))
    messages.push(message('teacher', teacher.stay, teacher.id))
  }

  return {
    phase: 'complete',
    teacher,
    student,
    scoreChoice,
    remedialSubject,
    resolutionId,
    messages,
  }
}
