import { battleStudentById } from './battleCast.js'
import { TEACHER_RIVALS } from './rpg.js'

export const TEACHER_SCHOOL_LIFE_IDS = [
  'grass-wolf',
  'forest-keeper',
  'chronos',
  'leviathan',
  'librarian',
  'silent-dragon',
  'tempest',
  'nameless-king',
  'archive-angel',
  'word-emperor',
  'endless-book',
]

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
    location: '地図と掲示物の並ぶ社会科教室',
    everyday: '地図野先生は世界地図へ新しい写真を貼り、その土地の挨拶を小さく書き込んでいる。',
    opening: '今日出てきた国のこと、名前だけで終わらせないでね。そこにも毎日の暮らしがあるから。',
    excellent: '92点！ 出来事を場所と理由まで結びつけられていたね。地図を読む目が育っているよ。',
    good: '76点。大きな流れはつかめている。次は地図のどこで起きたかも一緒に覚えよう。',
    close: '42点か。国境線のように、合格線ぎりぎりだね。越えた後こそ地図を確認しよう。',
    ownRemedial: '社会!? 地図上のどこへ逃げても、補習教室はここです！ 地球儀を回して待っています！',
    stay: '戻ってきてくれてありがとう。年号を全部抱えず、まず三つの出来事を一本の線で結ぼう。',
    pursuit: '回転する地球儀が次々と近道を示し、地図野先生が先回りして手を振っている。',
    otherConcern: '担当の先生にも事情があるはず。まずは答案を持って、助けを求めに行こう。',
  },
  librarian: {
    location: '放課後の理科室',
    everyday: '火野先生は全員分の安全ゴーグルを点検し、曇った一枚を黙って磨き直している。',
    opening: '今日の実験、予想と違ったからこそ面白かったね。失敗も立派な観察結果だよ。',
    excellent: '92点！ 結果だけでなく「なぜ」を書けていた。科学者らしい答案だったよ。',
    good: '76点。観察はできているね。条件をもう一つそろえれば、説明まできれいにつながる。',
    close: '42点……ぎりぎり成功、とは実験では言わない。再現できるように間違いを確かめよう。',
    ownRemedial: '理科で赤点だとぉ!? その結果は再実験が必要だ！ 安全ゴーグルと答案を持ってきなさい！',
    stay: 'よし、正直な報告は良い実験の第一歩だ。失敗した条件から一緒に調べ直そう。',
    pursuit: '火野先生は安全ゴーグルを二つ抱え、「廊下は走るな！」と言いながら早歩きで追ってくる。',
    otherConcern: '失敗を隠さず担当の先生へ見せよう。それが次の仮説を作る一番のデータになる。',
  },
  'silent-dragon': {
    location: '夕日の音楽室',
    everyday: '響先生は誰もいない教室で椅子を並べ、最後の一脚まで静かに高さを確かめている。',
    opening: '今日の声は小さくても、よく届いていたよ。音量より、相手へ届けようとしたことが大切だ。',
    excellent: '92点。休符まで読めていたね。鳴っていない場所を聴ける答案だった。',
    good: '76点。旋律はつかめている。迷った記号だけ、音にして確かめよう。',
    close: '42点……合格の音は鳴った。でも少し不安定だ。帰る前に一度だけ合わせよう。',
    ownRemedial: '……音楽で赤点？ 今、聞きたくない不協和音が聞こえた。放課後、楽譜と答案を持って音楽室へ。',
    stay: '大丈夫。外した音を責めるための補習ではない。次の音へ戻る場所を一緒に探そう。',
    pursuit: '響先生が鳴らした音叉の澄んだ音が、逃げた先の廊下まで迷わず追いかけてくる。',
    otherConcern: '担当の先生の説明にも、その教科なりのリズムがある。分からない小節から聞き直そう。',
  },
  tempest: {
    location: '夕焼けの体育館',
    everyday: '速水先生は最後まで残った生徒の水筒を確認し、床の汗を自分で拭いている。',
    opening: '今日も最後までやったな！ 速さより、途中で投げ出さなかったことを先生は見ているぞ！',
    excellent: '92点！ よく走り切った！ だが残り8点も置き去りにせず、クールダウンで見直すぞ！',
    good: '76点！ 悪くない！ 苦手な問題だけフォームを直せば、次はもっと伸びる！',
    close: '42点！ ゴール線は越えた！ しかし倒れ込む前に、間違いを一周だけ確認だ！',
    ownRemedial: 'なにぃぃぃ!? 貴様っ！ 私の体育で赤点を取ったのか!! まずグラウンド一周……いや、補習プリントだ！',
    stay: 'よし、戻ったな！ 怒鳴って悪かった。できるまで付き合うから、まず水を飲んで座れ！',
    pursuit: '速水先生のホイッスルが鳴る。逃げ足をほめながら、本人はさらに速く追ってくる。',
    otherConcern: '担当の先生も毎日全力だ！ 苦手ならなおさら、補習へ正面から飛び込んでこい！',
  },
  'nameless-king': {
    location: '木の香りが残る技術室',
    everyday: '工藤先生は壊れた椅子を直しながら、誰が使っても指を挟まないか何度も確かめている。',
    opening: '作品は完成した瞬間より、直した跡に作った人らしさが出る。今日のやり直しは良かったぞ。',
    excellent: '92点。設計も手順も堅実だ。残り8点のぐらつきだけ締め直しておこう。',
    good: '76点。形にはなっている。道具を選ぶ理由まで分かれば、もっと丈夫な答えになる。',
    close: '42点……一応は組み上がったな。だがこのまま提出すると、次の振動で外れるぞ。直す。',
    ownRemedial: '技術で赤点だと!? 壊れた点数は直せる！ 工具箱じゃない、教科書と答案を持ってこい！',
    stay: 'それでいい。作った本人が直し方を覚えれば、前より強くなる。最初の部品から見よう。',
    pursuit: '工藤先生は廊下を走らず、先回りして「逃げ道の設計が甘い」と工作台を指した。',
    otherConcern: '担当の先生へ答案を見せてこい。壊れた場所が分からなければ、直しようがないからな。',
  },
  'archive-angel': {
    location: '絵の具の香る美術室',
    everyday: '彩先生は床に落ちた小さな絵の具まで拾い、色ごとに新しいパレットへ戻している。',
    opening: '今日の絵、正解を探さずに自分の見え方を選べていたね。その一筆、私は好きだよ。',
    excellent: '92点！ 答案全体に君の観察が出ていた。残り8点の余白も、次の作品に使えそう。',
    good: '76点。輪郭は見えているよ。迷ったところへ、もう一色だけ重ねてみよう。',
    close: '42点……合格色ではあるけれど、ずいぶん薄塗りね。直しで自分の根拠を濃くしよう。',
    ownRemedial: '美術!? その答案、赤点まで含めて赤一色だったの!? 放課後、最初の下描きからやり直すよ！',
    stay: 'いい子。怒っているより、君が何を見ていたのか知りたいの。消さずに上から描き直そう。',
    pursuit: '彩先生の長い筆から伸びた絵の具の線が、廊下に鮮やかな追跡ルートを描いていく。',
    otherConcern: '担当の先生が見たいのは赤点だけじゃないよ。君がどこで迷ったか、答案ごと見せよう。',
  },
  'word-emperor': {
    location: '職員室前の廊下',
    everyday: '鐘ヶ江教頭は厳しい顔で出席簿を閉じ、雨で濡れた生徒の鞄へそっとタオルを渡した。',
    opening: '廊下は走らない。……急ぐ理由があるなら聞きます。困っている生徒を止めたいわけではありません。',
    excellent: '92点。よくできました。毎日の小さな一問まで、出席簿ではなく先生たちが覚えていますよ。',
    good: '76点。努力は見えています。提出前の確認をもう一度習慣にすると、さらに安定します。',
    close: '42点。規則上は合格です。しかし、ぎりぎりを常態化することは認めません。直しを提出してください。',
    ownRemedial: '総合で赤点!? 教科横断で、いったい何を横断してきたのですか！ 出席簿を確認します！',
    stay: '正直に残った点は評価します。叱って終わりにはしません。予定を整理してから補習へ行きましょう。',
    pursuit: '鐘ヶ江教頭は走らず校内放送を入れた。「廊下を逃走中の生徒、職員室前へ戻りなさい」',
    otherConcern: '担当の先生も準備を重ねています。気まずくても、まず答案を持って会いに行きなさい。',
  },
  'endless-book': {
    location: '朝礼後の講堂',
    everyday: '学園坂校長は長い話を終えたあと、片付ける生徒一人ひとりへ短く礼を伝えている。',
    opening: '短く一言だけ。今日も学校へ来てくれて、ありがとう。……さて、ここからが少し長い話です。',
    excellent: '92点。立派です。点数だけでなく、そこへ至る毎日の積み重ねについて、朝礼で三十分ほど……。',
    good: '76点。十分な成果です。ただし十分とは「もう何もしなくてよい」という意味ではなく……。',
    close: '42点。合格した安心と、次に備える決意について、校長から短く二十項目お話ししましょう。',
    ownRemedial: '卒業試験で赤点!? ……短く一言。まだ卒業はさせません。ここから長い補習のお話を始めます。',
    stay: '戻ってくれてうれしいです。長い話は半分にします。その代わり、最後の一問まで一緒に考えましょう。',
    pursuit: '講堂のスピーカーから校長の話が続き、どこまで逃げても「最後にもう一点」が聞こえてくる。',
    otherConcern: '担当の先生も、君に分かってほしいから待っています。謝るより先に、教えてくださいと言いましょう。',
  },
}

function teacherLifeProfile(id) {
  const teacher = TEACHER_RIVALS[id]
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
