import { st } from './entry.js'

export default Object.freeze([
  st('[S Students {前| at one junior high school}] [V noticed] [O {that節| [接 that] [S a lot {前| of food}] [V was left] [M {前| in the cafeteria}] [M {前| after lunch}]}].', {
    chunks: [
      ['Students at one junior high school', 'ある中学校の生徒たちは'],
      ['noticed that', '〜ことに気づきました（内容は次へ）'],
      ['a lot of food was left', 'たくさんの食べ物が残されている（ことに）'],
      ['in the cafeteria after lunch', '昼食のあとの食堂に'],
    ],
    notes: {
      'noticed that': 'notice that ＋ 主語 ＋ 動詞 で「〜ということに気づく」。',
      'a lot of food was left': 'was left は leave（残す）の受け身で「残された」。',
    },
  }),
  st('[S The cooking staff] [V had to throw] [O the leftovers] [M away], [M {副詞節:譲歩| [接 even though] [S most {前| of the food}] [V was] [M still] [C fresh]}].', {
    chunks: [
      ['The cooking staff', '調理スタッフは'],
      ['had to throw the leftovers away,', '残り物を捨てなければなりませんでした'],
      ['even though', '〜にもかかわらず（内容は次へ）'],
      ['most of the food was still fresh', '食べ物のほとんどはまだ新鮮だった（のに）'],
    ],
    notes: {
      'had to throw the leftovers away,': 'had to は have to（〜しなければならない）の過去形です。throw A away で「Aを捨てる」。',
      'even though': 'even though ＋ 主語 ＋ 動詞 で「〜なのに・〜にもかかわらず」。',
    },
  }),
  st('[S A science class] [V decided] [O {to:名詞| [V to study] [O the problem]}] [M {前| instead of {動名詞| [M simply] [V asking] [O everyone] [C {to:補語| [V to eat] [M more]}]}}].', {
    chunks: [
      ['A science class', 'ある理科のクラスは'],
      ['decided to study the problem', 'その問題を調べることにしました'],
      ['instead of simply asking everyone to eat more', 'ただ全員にもっと食べるよう求めるのではなく'],
    ],
    notes: {
      'decided to study the problem': 'decide to ＋ 動詞の原形 で「〜することに決める」。',
      'instead of simply asking everyone to eat more': 'instead of 〜ing で「〜するのではなく・〜する代わりに」。ask ＋ 人 ＋ to 〜 で「人に〜するよう求める」。',
    },
    rules: ['contrast-concession', 'infinitive-role', 'ing-ed-role'],
  }),
  st('[M First], [S the students] [V gave] [O1 the other classes] [O2 a short survey].', {
    chunks: [
      ['First,', 'まず'],
      ['the students', '生徒たちは'],
      ['gave the other classes a short survey', 'ほかのクラスに短いアンケートを配りました'],
    ],
    notes: {
      'gave the other classes a short survey': 'give ＋ 人 ＋ もの で「人にものを渡す」。',
    },
  }),
  st('[S Many younger students] [V said] [O {that省略| [S the usual portions] [V were] [C too large]}], [M {副詞節:対比| [接 while] [S some older students] [V wanted] [O more food] [M {前| after sports practice}]}].', {
    chunks: [
      ['Many younger students said', '多くの下級生は言いました（内容は次へ）'],
      ['the usual portions were too large,', 'いつもの量は多すぎる（と）'],
      ['while', '一方で'],
      ['some older students wanted more food', '上級生の中には、もっと食べたい人もいました'],
      ['after sports practice', '運動部の練習のあとに'],
    ],
    notes: {
      'Many younger students said': 'said の後ろに、接続詞の that が省略されています。',
      'the usual portions were too large,': 'too ＋ 形容詞 で「〜すぎる」。',
      while: 'while はここでは「一方で」と、下級生と上級生の違いを比べています。',
    },
  }),
  st('[S The class] [M then] [V measured] [O the amount {前| of {並列| rice, | vegetables, | and bread} {過去分詞>rice, vegetables, and bread| [V left] [M each day]}}] [M {前| for two weeks}].', {
    chunks: [
      ['The class then measured the amount', '次にクラスは量を測りました（何の量かは次へ）'],
      ['of rice, vegetables, and bread', 'ご飯・野菜・パンの（量を）'],
      ['left each day', '毎日残った（ご飯・野菜・パンの）'],
      ['for two weeks', '2週間にわたって'],
    ],
    notes: {
      'left each day': 'left は leave の過去分詞で、rice, vegetables, and bread を後ろから説明して「毎日残った〜」。',
    },
  }),
  st('[S They] [V discovered] [O {that節| [接 that] [S waste] [V was] [C greatest] [M {前| on days {関係>days| [M when] [S every student] [V received] [O the same large portion]}}]}].', {
    chunks: [
      ['They discovered that', '生徒たちは〜ことを発見しました（内容は次へ）'],
      ['waste was greatest', '食品ロスが最も多かった（ことを）'],
      ['on days', 'ある日に（どんな日かは次へ）'],
      ['when every student received the same large portion', '全員が同じ大盛りを受け取った（日に）'],
    ],
    notes: {
      'waste was greatest': 'greatest は great の最上級で「最も多い」。',
      'when every student received the same large portion': 'when は days を受ける関係副詞で、その日がどんな日かを説明します。',
    },
  }),
  st('[S The students] [V suggested] [O {動名詞| [V offering] [O two plate sizes] [M {前| at the start {前| of lunch}}]}].', {
    chunks: [
      ['The students suggested', '生徒たちは提案しました（何をかは次へ）'],
      ['offering two plate sizes', '2種類の大きさの皿を用意することを'],
      ['at the start of lunch', '昼食の始めに（用意することを）'],
    ],
    notes: {
      'offering two plate sizes': 'suggest ＋ 〜ing で「〜することを提案する」。suggest の後ろには to 不定詞を置きません。',
    },
  }),
  st('[S Anyone {関係>Anyone| [S who] [V chose] [O the smaller plate]}] [V could return] [M {前| for more food}] [M later].', {
    chunks: [
      ['Anyone who chose the smaller plate', '小さいほうの皿を選んだ人はだれでも'],
      ['could return for more food later', 'あとでもっと食べ物を取りに戻ることができました'],
    ],
    notes: {
      'Anyone who chose the smaller plate': 'who は Anyone を受ける関係代名詞で、Anyone who … plate 全体が主語です。',
      'could return for more food later': 'return for 〜 で「〜を取りに戻る」。',
    },
  }),
  st('[S The cafeteria] [M also] [V put] [O pictures {前| of both portions}] [M {前| near the entrance}] [M {副詞節:目的| [接 so] [S students] [V could choose] [M {前| before {動名詞| [V reaching] [O the counter]}}]}].', {
    chunks: [
      ['The cafeteria also put pictures', '食堂は写真も置きました（何の写真かは次へ）'],
      ['of both portions', '両方の量の（写真を）'],
      ['near the entrance', '入口の近くに'],
      ['so students could choose', '生徒が選べるように'],
      ['before reaching the counter', '配膳台に着く前に'],
    ],
    notes: {
      'so students could choose': 'so ＋ 主語 ＋ could 〜 は so that と同じく「〜できるように」という目的を表します。',
      'before reaching the counter': 'before の後ろに動名詞 reaching を置き、「〜に着く前に」。',
    },
  }),
  st('[M {前| After one month}], [S food waste] [V was] [C almost half {前| of the earlier amount}].', {
    chunks: [
      ['After one month,', '1か月後には'],
      ['food waste was almost half', '食品ロスはほぼ半分になっていました（何の半分かは次へ）'],
      ['of the earlier amount', '以前の量の'],
    ],
    notes: {
      'food waste was almost half': 'almost は「ほとんど・ほぼ」。half of 〜 で「〜の半分」。',
    },
    rules: ['comparison-pairs', 'main-clause-skeleton', 'paragraph-map'],
  }),
  st('[S More students] [V finished] [O their meals], [接 but] [S nobody] [V had to remain] [C hungry].', {
    chunks: [
      ['More students finished their meals,', 'より多くの生徒が食事を食べ終えました'],
      ['but', 'しかし'],
      ['nobody had to remain hungry', 'だれも空腹のままでいる必要はありませんでした'],
    ],
    notes: {
      'nobody had to remain hungry': 'nobody は「だれも〜ない」。remain ＋ 形容詞 で「〜のままでいる」。',
    },
  }),
  st('[S Daily records] [V helped] [O the cooking staff] [C {to:補語| [V to prepare] [O a better amount {前| for each menu}]}].', {
    chunks: [
      ['Daily records', '毎日の記録は'],
      ['helped the cooking staff', '調理スタッフを助けました（何をするのをかは次へ）'],
      ['to prepare a better amount', 'より適切な量を用意するのを'],
      ['for each menu', 'それぞれの献立に合った（量を）'],
    ],
    notes: {
      'helped the cooking staff': 'help ＋ 人 ＋ to 〜 で「人が〜するのを助ける」。',
    },
  }),
  st('[S The project] [V taught] [O1 them] [O2 {that節| [接 that] [S {動名詞| [V reducing] [O food waste]}] [V does not require] [O one perfect rule {前| for everyone}]}].', {
    chunks: [
      ['The project taught them that', 'その活動は生徒たちに〜ことを教えました（内容は次へ）'],
      ['reducing food waste', '食品ロスを減らすことは'],
      ['does not require one perfect rule', '一つの完璧な規則を必要としない（ことを）'],
      ['for everyone', '全員に当てはまる（規則を）'],
    ],
    notes: {
      'The project taught them that': 'teach ＋ 人 ＋ that 〜 で「人に〜ということを教える」。them は生徒たちを指します。',
      'reducing food waste': 'reducing 以下は「〜を減らすこと」という動名詞のまとまりで、that節の中の主語です。',
    },
  }),
  st('[S It] [V can begin] [M {前| by {動名詞| [V giving] [O1 people] [O2 {並列| clear information | and a useful choice}]}}].', {
    chunks: [
      ['It can begin', 'それは始められます（どう始めるかは次へ）'],
      ['by giving people', '人々に与えることで（何をかは次へ）'],
      ['clear information and a useful choice', '分かりやすい情報と役に立つ選択肢を'],
    ],
    notes: {
      'It can begin': 'It は前の文の reducing food waste（食品ロスを減らすこと）を指します。',
      'by giving people': 'by ＋ 〜ing で「〜することによって」。give ＋ 人 ＋ もの の形です。',
    },
    rules: ['reference-chain', 'ing-ed-role', 'parallel-shape'],
  }),
  st('[S The students] [M now] [V share] [O their results] [M {前| with nearby schools}] [接 and] [V encourage] [O them] [C {to:補語| [V to measure] [O their own waste]}].', {
    chunks: [
      ['The students now share their results', '生徒たちは今、自分たちの結果を共有しています'],
      ['with nearby schools', '近くの学校と'],
      ['and encourage them', 'そしてそれらの学校に勧めています（何をかは次へ）'],
      ['to measure their own waste', 'それぞれの学校の食品ロスを測るように'],
    ],
    notes: {
      'and encourage them': 'encourage ＋ 人 ＋ to 〜 で「人に〜するよう勧める」。them は nearby schools を指します。',
    },
  }),
  st('[S They] [V explain] [O {that節| [接 that] [S every meal] [V uses] [O {並列| water, | energy, | and work}] [M {副詞節:時| [接 before] [S it] [V reaches] [O a plate]}], [接 so] [M even] [S a small improvement] [V can protect] [O valuable resources]}].', {
    chunks: [
      ['They explain that', '生徒たちは〜と説明しています（内容は次へ）'],
      ['every meal uses water, energy, and work', 'どの食事も、水やエネルギー、人の労力を使います'],
      ['before it reaches a plate,', '皿に届くまでに'],
      ['so', 'だから'],
      ['even a small improvement', '小さな改善でも'],
      ['can protect valuable resources', '大切な資源を守ることができる（と）'],
    ],
    notes: {
      'every meal uses water, energy, and work': 'that の後ろから文の最後までが、生徒たちが説明している内容です。',
      'before it reaches a plate,': 'it は every meal を指します。',
      'even a small improvement': 'even は a small improvement を強めて「〜でさえ」。',
    },
  }),
])
