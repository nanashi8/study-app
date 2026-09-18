import { st } from './entry.js'

export default Object.freeze([
  st('[M Next month], [S our town] [V will hold] [O a bicycle safety week {前| for {並列| children | and their families}}].', {
    chunks: [
      ['Next month,', '来月'],
      ['our town', '私たちの町は'],
      ['will hold a bicycle safety week', '自転車安全週間を開きます'],
      ['for children and their families', '子どもたちとその家族のための（安全週間を）'],
    ],
    notes: {
      'will hold a bicycle safety week': 'hold はここでは「（行事を）開く・行う」。',
      'for children and their families': 'for 〜 は a bicycle safety week を後ろから説明して「〜のための安全週間」。their は children を指します。',
    },
  }),
  st('[S The program] [V will teach] [O simple traffic rules] [接 and] [V show] [O1 people] [O2 {疑問詞to| [M how] [V to prevent] [O common bicycle accidents]}].', {
    chunks: [
      ['The program', 'その催しは'],
      ['will teach simple traffic rules', '簡単な交通ルールを教えます'],
      ['and', 'そして'],
      ['show people', '人々に示します（何をかは次へ）'],
      ['how to prevent common bicycle accidents', 'よくある自転車事故の防ぎ方を'],
    ],
    notes: {
      'show people': 'show ＋ 人 ＋ もの で「人にものを示す」。show も will を共有しています（will show）。',
      'how to prevent common bicycle accidents': 'how to ＋ 動詞の原形 で「〜のしかた・〜する方法」。',
    },
  }),
  st('[S It] [V begins] [M {前| with a short talk {前| at the community center}}] [M {前| on Monday evening}].', {
    chunks: [
      ['It begins', 'その催しは始まります'],
      ['with a short talk', '短い話から'],
      ['at the community center', 'コミュニティセンターでの（短い話から）'],
      ['on Monday evening', '月曜日の夕方に'],
    ],
    notes: {
      'It begins': 'It は前の文の The program（自転車安全週間の催し）を指します。',
      'with a short talk': 'begin with 〜 で「〜から始まる」。',
    },
    rules: ['reference-chain', 'main-clause-skeleton', 'svoc-core'],
  }),
  st('[S A police officer] [V will explain] [O {疑問詞節| [M why] [S every rider] [V should wear] [O a helmet]}].', {
    chunks: [
      ['A police officer will explain', '警察官が説明します（何をかは次へ）'],
      ['why every rider should wear a helmet', '自転車に乗る人がみな、なぜヘルメットを着けるべきなのかを'],
    ],
    notes: {
      'why every rider should wear a helmet': 'why ＋ 主語 ＋ 動詞 で「なぜ〜なのか」。疑問文の語順にはならず、every rider should wear の順です。rider は「（自転車に）乗る人」。',
    },
  }),
  st('[S Children] [V will] [M also] [V learn] [O the correct place {to:形容詞>the correct place| [V to stop] [M {副詞節:時| [接 before] [S they] [V cross] [O a busy road]}]}].', {
    chunks: [
      ['Children', '子どもたちは'],
      ['will also learn the correct place', '正しい場所も学びます（何をする場所かは次へ）'],
      ['to stop before they cross a busy road', '交通量の多い道路を渡る前に止まる（場所を）'],
    ],
    notes: {
      'to stop before they cross a busy road': 'to stop は the correct place を後ろから説明して「止まるための場所」。before 以下は stop にかかり、「渡る前に止まる」。they は Children を指します。',
    },
  }),
  st('[S They] [V must use] [O bicycle lights] [M {副詞節:理由| [接 because] [S drivers] [V may not notice] [O them] [M {前| after dark}]}].', {
    chunks: [
      ['They', '子どもたちは'],
      ['must use bicycle lights', '自転車のライトを使わなければなりません'],
      ['because', 'なぜなら'],
      ['drivers may not notice them after dark', '暗くなると、運転手が子どもたちに気づかないかもしれないからです'],
    ],
    notes: {
      They: 'They と後ろの them は、前の文の Children（子どもたち）を指します。',
      'drivers may not notice them after dark': 'may not は「〜しないかもしれない」。after dark は「暗くなってから」。',
    },
    rules: ['cause-result', 'reference-chain', 'negation-scope'],
  }),
  st('[M {前| On Wednesday}], [S families] [V can bring] [O their bicycles] [M {前| to the park}].', {
    chunks: [
      ['On Wednesday,', '水曜日には'],
      ['families', '家族は'],
      ['can bring their bicycles', '自分たちの自転車を持ってくることができます'],
      ['to the park', '公園へ'],
    ],
    notes: {
      'can bring their bicycles': 'bring は「持ってくる」。their は families を指します。',
    },
  }),
  st('[S Local shop workers] [V will check] [O the {並列| brakes, | seats, | and lights}] [M {前| for free}].', {
    chunks: [
      ['Local shop workers', '地元の店の人たちが'],
      ['will check the brakes, seats, and lights', 'ブレーキや座席、ライトを点検します'],
      ['for free', '無料で'],
    ],
    notes: {
      'will check the brakes, seats, and lights': 'A, B, and C の形で三つを並べ、どれも check の目的語です。',
    },
  }),
  st('[S They] [V can repair] [O small problems], [接 but] [S they] [V cannot replace] [O expensive parts].', {
    chunks: [
      ['They can repair small problems,', '店の人たちは小さな不具合を直せます'],
      ['but', 'しかし'],
      ['they cannot replace expensive parts', '高価な部品は交換できません'],
    ],
    notes: {
      'They can repair small problems,': 'They は前の文の Local shop workers（地元の店の人たち）を指します。',
      'they cannot replace expensive parts': 'cannot は「〜できない」。but の前後で、できることとできないことを比べています。',
    },
  }),
  st('[S The week] [V ends] [M {前| with a practice ride {前| on Saturday morning}}].', {
    chunks: [
      ['The week ends', 'その安全週間は終わります'],
      ['with a practice ride', '練習走行で'],
      ['on Saturday morning', '土曜日の朝の（練習走行で）'],
    ],
    notes: {
      'with a practice ride': 'end with 〜 で「〜で終わる」。',
    },
  }),
  st('[S Volunteers] [V will ride] [M {前| with small groups}] [M {前| through quiet streets}].', {
    chunks: [
      ['Volunteers will ride', 'ボランティアが走ります'],
      ['with small groups', '小さなグループと一緒に'],
      ['through quiet streets', '静かな通りを通って'],
    ],
    notes: {
      'through quiet streets': 'through は「〜を通り抜けて」。',
    },
  }),
  st('[S Parents] [V should join] [O the ride] [M too], [M {副詞節:目的| [接 so] [S they] [V can practice] [O the rules] [M {前| with their children}]}].', {
    chunks: [
      ['Parents should join the ride too,', '保護者もその走行に参加するべきです'],
      ['so they can practice the rules', 'ルールを練習できるように'],
      ['with their children', '自分の子どもたちと一緒に'],
    ],
    notes: {
      'Parents should join the ride too,': 'should は「〜するべきだ」。文の終わりの too は「〜も」。',
      'so they can practice the rules': 'so ＋ 主語 ＋ can 〜 は so that と同じく「〜できるように」という目的を表します。they は Parents を指します。',
    },
  }),
  st('[S The town] [V believes] [O {that節| [接 that] [S careful riding] [V will protect] [O everyone {関係>everyone| [S who] [V uses] [O the road]}]}].', {
    chunks: [
      ['The town believes that', '町は〜と考えています（内容は次へ）'],
      ['careful riding will protect everyone', '注意深く自転車に乗ることが、すべての人を守るだろう（と）'],
      ['who uses the road', '道路を使う（すべての人を）'],
    ],
    notes: {
      'careful riding will protect everyone': 'riding は「（自転車に）乗ること」という名詞です。',
      'who uses the road': 'who は everyone を受ける関係代名詞です。everyone は単数として扱うので uses になります。',
    },
  }),
])
