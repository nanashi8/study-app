import { st } from './entry.js'

export default Object.freeze([
  st('[M {前| In many rural areas}], [S the local bus] [V is] [C the only way {前:意味上の主語| for people {前| without cars}} {to:形容詞>the only way| [V to reach] [O a hospital]}].', {
    chunks: [
      ['In many rural areas,', '多くの農山村では'],
      ['the local bus is the only way', '路線バスが、ただ一つの手段です（だれにとって・何のためかは次へ）'],
      ['for people without cars', '車を持たない人にとって'],
      ['to reach a hospital', '病院へ行くための'],
    ],
    notes: {
      'the local bus is the only way': 'the only way to 〜 で「〜するためのただ一つの手段」。',
      'for people without cars': 'for people without cars は to reach の意味上の主語で、「車のない人が病院へ行く」という関係です。',
    },
    rules: ['paragraph-map', 'infinitive-role', 'main-clause-skeleton'],
  }),
  st('[M Yet] [S the number {前| of passengers}] [V has decreased] [M steadily] [M {副詞節:比例| [接 as] [S young people] [V moved] [M {前| to cities}]}].', {
    chunks: [
      ['Yet the number of passengers has decreased steadily', 'しかし乗客の数は、着実に減ってきました'],
      ['as young people moved to cities', '若い人たちが都市へ移るにつれて'],
    ],
    notes: {
      'Yet the number of passengers has decreased steadily': 'Yet は「しかし」。has decreased は現在完了で、今まで減り続けてきたことを表します。',
      'as young people moved to cities': 'as はここでは「〜するにつれて」。人が出ていくのと乗客が減るのが並んで進んだということです。',
    },
  }),
  st('[S Some companies] [V used to run] [O several routes], [接 but] [M today] [S they] [V cannot fill] [M even] [O one bus].', {
    chunks: [
      ['Some companies used to run several routes,', 'かつては複数の路線を走らせていた会社もあります'],
      ['but today they cannot fill even one bus', 'しかし今では、バス1台さえ乗客で埋められません'],
    ],
    notes: {
      'Some companies used to run several routes,': 'used to 〜 で「以前は〜していた（今はしていない）」。run はここでは「（路線を）運行する」。',
      'but today they cannot fill even one bus': 'even は「〜さえ」と、たった1台でも満員にならないことを強めます。they は Some companies を指します。',
    },
  }),
  st('[S A further problem] [V is] [C {that節| [接 that] [S many drivers] [V are] [C close {前| to retirement age}]}].', {
    chunks: [
      ['A further problem is that', 'さらにもう一つの問題は、〜ということです（内容は次へ）'],
      ['many drivers are close to retirement age', '多くの運転手が定年に近い（ということ）'],
    ],
    notes: {
      'A further problem is that': 'further は「さらに加わる」。乗客が減ることに続く、二つ目の問題です。',
      'many drivers are close to retirement age': 'be close to 〜 で「〜に近い」。retirement age は「定年」。',
    },
  }),
  st('[S One village] [V ended] [O its afternoon service] [M last spring], [接 and] [S the effect] [V appeared] [M quickly].', {
    chunks: [
      ['One village ended its afternoon service last spring,', 'ある村は昨年の春、午後の便をやめました'],
      ['and the effect appeared quickly', 'するとその影響はすぐに表れました'],
    ],
    notes: {
      'One village ended its afternoon service last spring,': 'service はここでは「（バスの）便・運行」。its は One village を指します。',
      'and the effect appeared quickly': 'the effect は、午後の便をやめたことの影響です。次の2文がその例です。',
    },
    rules: ['paragraph-map', 'cause-result', 'main-clause-skeleton'],
  }),
  st('[S An elderly resident] [V had to change] [O three appointments] [M {副詞節:理由| [接 because] [S no bus] [V reached] [O the clinic]}].', {
    chunks: [
      ['An elderly resident had to change three appointments', 'ある高齢の住民は、予約を三つ変えなければなりませんでした（なぜかは次へ）'],
      ['because no bus reached the clinic', '診療所まで行くバスが一つもなかったからです'],
    ],
    notes: {
      'An elderly resident had to change three appointments': 'had to 〜 は have to の過去で「〜しなければならなかった」。appointment は「（病院などの）予約」。',
      'because no bus reached the clinic': 'no bus は「どのバスも〜ない」。reach は「〜に着く」。',
    },
  }),
  st('[S A high school student] [V began] [O {動名詞| [V cycling] [M nine kilometers] [M {前| in the rain}]}].', {
    chunks: [
      ['A high school student began cycling nine kilometers', 'ある高校生は、9キロの道を自転車で通い始めました（どんな中をかは次へ）'],
      ['in the rain', '雨の中を'],
    ],
    notes: {
      'A high school student began cycling nine kilometers': 'begin ＋ -ing で「〜し始める」。nine kilometers は「9キロの道のりを」と距離を表すMです。',
    },
  }),
  st('[S The village office] [V received] [O complaints], [接 but] [S {動名詞| [M simply] [V restoring] [O the old timetable]}] [V was] [C too expensive].', {
    chunks: [
      ['The village office received complaints,', '村役場には苦情が届きました'],
      ['but simply restoring the old timetable', 'しかし、前の時刻表にただ戻すことは'],
      ['was too expensive', 'お金がかかりすぎました'],
    ],
    notes: {
      'but simply restoring the old timetable': 'restoring 以下は動名詞のまとまりで、but の後ろの文の主語です。simply は「ただ（元に戻すだけ）」。',
      'was too expensive': 'too expensive は「（お金が）かかりすぎる」。元に戻すだけでは解決にならない、という流れです。',
    },
  }),
  st('[S Officials] [M therefore] [V studied] [O {疑問詞節| [M how] [S residents] [M actually] [V traveled] [M {前| during one ordinary week}]}].', {
    chunks: [
      ['Officials therefore studied how', 'そこで職員は、〜を調べました（どのように〜かは次へ）'],
      ['residents actually traveled during one ordinary week', 'ふだんの1週間に、住民が実際にどのように移動したか（を）'],
    ],
    notes: {
      'Officials therefore studied how': 'therefore は、苦情と費用の問題を受けて「そこで」。how 以下は studied の目的語になる疑問詞の節です。',
      'residents actually traveled during one ordinary week': 'actually は「実際に」。ordinary は「ふだんの・特別でない」。',
    },
    rules: ['paragraph-map', 'wh-clause', 'main-clause-skeleton'],
  }),
  st('[S They] [V discovered] [O {that節| [接 that] [S most trips] [V were] [C short] [接 and] [V happened] [M {前| at predictable times}]}].', {
    chunks: [
      ['They discovered that', '職員は〜と分かりました（内容は次へ）'],
      ['most trips were short', '大半の移動は短く'],
      ['and happened at predictable times', '前もって分かる時間帯に行われていた（と）'],
    ],
    notes: {
      'They discovered that': 'They は前の文の Officials を指します。',
      'and happened at predictable times': 'and の後ろの happened の主語も most trips です。predictable は「予測できる」。',
    },
  }),
  st('[S Very few people] [V used] [O the full route] [M {反復| from end to end}].', {
    chunks: [
      ['Very few people used the full route', 'ごくわずかな人しか、路線全体を使いませんでした（どのようにかは次へ）'],
      ['from end to end', '端から端まで'],
    ],
    notes: {
      'Very few people used the full route': 'very few は「ほとんど〜ない」という否定の意味です。a few（少しはある）と区別します。',
      'from end to end': 'from A to B で「AからBまで」。路線の始まりから終わりまで乗る人はほとんどいなかったということです。',
    },
  }),
  st('[S The evening bus], [M {前| for example}], [M often] [V carried] [O a single passenger].', {
    chunks: [
      ['The evening bus, for example,', 'たとえば夕方のバスは'],
      ['often carried a single passenger', '乗客を一人しか乗せていないことがよくありました'],
    ],
    notes: {
      'The evening bus, for example,': 'for example は、前の文の「使う人が少ない」ことの例を挙げる合図です。',
      'often carried a single passenger': 'a single passenger は「たった一人の乗客」。',
    },
  }),
  st('[S The village] [M then] [V tested] [O a small bus {関係>a small bus| [S that] [V comes] [M only] [M {副詞節:時| [接 when] [S someone] [V books] [O it]}]}].', {
    chunks: [
      ['The village then tested a small bus', '村はそれから、小型バスを試しました（どんなバスかは次へ）'],
      ['that comes only when someone books it', 'だれかが予約したときだけ来る（バスを）'],
    ],
    notes: {
      'The village then tested a small bus': 'then は、移動の調べを受けて「それから」。',
      'that comes only when someone books it': 'only when 〜 で「〜するときだけ」。books はここでは動詞で「予約する」、it は a small bus を指します。',
    },
    rules: ['paragraph-map', 'relative-clause', 'main-clause-skeleton'],
  }),
  st('[S Residents] [V call] [O a number] [接 or] [V use] [O a simple app], [接 and] [S the route] [V changes] [M each day].', {
    chunks: [
      ['Residents call a number', '住民は、決まった番号に電話するか'],
      ['or use a simple app,', '簡単なアプリを使います'],
      ['and the route changes each day', 'そして道順は日ごとに変わります'],
    ],
    notes: {
      'Residents call a number': 'call a number は「（決まった）番号に電話する」。',
      'or use a simple app,': 'or は予約のしかたを二つ並べます。use の主語も Residents です。',
      'and the route changes each day': 'the route はバスが通る道順です。予約に合わせて毎日変わります。',
    },
  }),
  st('[M {副詞節:理由| [接 Because] [S the vehicle] [V is] [C smaller]}], [S the cost {前| for each trip}] [V dropped] [M {前| by about a third}].', {
    chunks: [
      ['Because the vehicle is smaller,', '車両が小さいので'],
      ['the cost for each trip dropped', '1回の移動にかかる費用は下がりました（どれだけかは次へ）'],
      ['by about a third', '約3分の1だけ'],
    ],
    notes: {
      'Because the vehicle is smaller,': 'smaller は small の比較級で、前のバスより小さいということです。',
      'by about a third': 'by は差を表し、by about a third で「約3分の1だけ（下がった）」。',
    },
  }),
  st('[S Drivers] [V reported] [O {that節| [接 that] [S the work] [V was] [C less stressful {前| than {動名詞| [V following] [O a fixed schedule]}}]}].', {
    chunks: [
      ['Drivers reported that', '運転手は〜と報告しました（内容は次へ）'],
      ['the work was less stressful', 'その仕事は、より負担が少ない（何よりかは次へ）'],
      ['than following a fixed schedule', '決まった時刻表どおりに走るよりも'],
    ],
    notes: {
      'the work was less stressful': 'less ＋ 形容詞 で「より〜でない」。stressful は「気が張る・負担の大きい」。',
      'than following a fixed schedule': 'than の後ろの following は動名詞で「〜に従うこと」。',
    },
  }),
  st('[M However], [S the system] [V created] [O new difficulties {関係>new difficulties| [O that] [S planners] [V had not expected]}].', {
    chunks: [
      ['However, the system created new difficulties', 'しかし、その仕組みは新しい困りごとを生みました（どんな困りごとかは次へ）'],
      ['that planners had not expected', '計画した人たちが予想していなかった（困りごとを）'],
    ],
    notes: {
      'However, the system created new difficulties': 'However は、ここまでの良い結果から話を折り返す合図です。',
      'that planners had not expected': 'had not expected は過去完了で「（始める前には）予想していなかった」。',
    },
    rules: ['paragraph-map', 'contrast-concession', 'relative-clause'],
  }),
  st('[S Some older residents] [V disliked] [O {動名詞| [V booking]}] [接 and] [V preferred] [O a bus {関係>a bus| [S that] [M always] [V came] [M {前| at the same time}]}].', {
    chunks: [
      ['Some older residents disliked booking', '一部の高齢の住民は、予約するのをいやがり'],
      ['and preferred a bus', 'バスのほうを好みました（どんなバスかは次へ）'],
      ['that always came at the same time', 'いつも同じ時刻に来る（バスを）'],
    ],
    notes: {
      'Some older residents disliked booking': 'booking は動名詞で「予約すること」。disliked の目的語です。',
      'and preferred a bus': 'and の後ろの preferred の主語も Some older residents です。prefer は「〜のほうを好む」。',
    },
  }),
  st('[S Others] [V could not use] [O the app] [M {副詞節:理由| [接 because] [S the mobile signal] [V was] [C weak] [M {前| in the mountains}]}].', {
    chunks: [
      ['Others could not use the app', 'ほかに、アプリを使えない人もいました（なぜかは次へ）'],
      ['because the mobile signal was weak', '携帯の電波が弱かったからです（どこでかは次へ）'],
      ['in the mountains', '山の中では'],
    ],
    notes: {
      'Others could not use the app': 'Others は前の文の Some older residents と対になる「ほかの人たち」です。',
      'because the mobile signal was weak': 'mobile signal は「携帯電話の電波」。',
    },
  }),
  st('[S The office] [M therefore] [V kept] [O a telephone line] [接 and] [V trained] [O volunteers] [C {to:補語| [V to help] [M {前| with the first booking}]}].', {
    chunks: [
      ['The office therefore kept a telephone line', 'そこで役場は、電話の窓口を残し'],
      ['and trained volunteers', 'ボランティアを育てました（何をするようにかは次へ）'],
      ['to help with the first booking', '最初の予約を手伝えるように'],
    ],
    notes: {
      'The office therefore kept a telephone line': 'therefore は、前の2文の困りごとを受けて「そこで」。kept は「残しておいた」。',
      'to help with the first booking': 'train ＋ 人 ＋ to 〜 で「人が〜できるように育てる」。help with 〜 で「〜を手伝う」。',
    },
  }),
  st('[S A neighboring town] [V chose] [O a different answer] [接 and] [V paid] [O taxi companies] [C {to:補語| [V to carry] [O passengers]}].', {
    chunks: [
      ['A neighboring town chose a different answer', '隣の町は別の答えを選び'],
      ['and paid taxi companies', 'タクシー会社にお金を払いました（何をしてもらうためかは次へ）'],
      ['to carry passengers', '乗客を運んでもらうように'],
    ],
    notes: {
      'A neighboring town chose a different answer': 'a different answer は、村の予約制の小型バスとは別のやり方です。',
      'to carry passengers': 'pay ＋ 人 ＋ to 〜 で「人にお金を払って〜してもらう」。乗客を運ぶのは taxi companies です。',
    },
    rules: ['paragraph-map', 'comparison-pairs', 'infinitive-role'],
  }),
  st('[S That plan] [V started] [M faster], [接 but] [S the cost {前| for each passenger}] [V stayed] [C higher].', {
    chunks: [
      ['That plan started faster,', 'その方式は、より早く始まりました'],
      ['but the cost for each passenger stayed higher', 'しかし、乗客一人あたりの費用は高いままでした'],
    ],
    notes: {
      'That plan started faster,': 'faster は比較級で、村の小型バスより早く始まったということです。',
      'but the cost for each passenger stayed higher': 'stay ＋ 形容詞 で「〜のままである」。higher も村のやり方と比べた比較級です。',
    },
  }),
  st('[S Neither approach] [V can succeed] [M {副詞節:条件| [接 if] [S no one] [V is] [C willing {to:副詞(形容詞)| [V to drive]}]}].', {
    chunks: [
      ['Neither approach can succeed', 'どちらのやり方もうまくいきません（どんな場合かは次へ）'],
      ['if no one is willing to drive', '進んで運転しようという人がだれもいなければ'],
    ],
    notes: {
      'Neither approach can succeed': 'neither は「（二つの）どちらも〜ない」。村の方式と隣町の方式の両方のことです。',
      'if no one is willing to drive': 'no one は「だれも〜ない」。be willing to 〜 で「進んで〜する」。',
    },
  }),
  st('[S The prefecture] [V has] [M now] [V begun] [O {動名詞| [V paying] [O part {前| of the cost {前| of driver training}}]}].', {
    chunks: [
      ['The prefecture has now begun', '県は今、〜し始めています（何をかは次へ）'],
      ['paying part of the cost', '費用の一部を負担することを'],
      ['of driver training', '運転手を育てる研修の'],
    ],
    notes: {
      'The prefecture has now begun': 'has begun は現在完了で「始めている」。間の now は「今では」。',
      'paying part of the cost': 'paying は動名詞で、begun の目的語です。part of 〜 で「〜の一部」。',
    },
    rules: ['paragraph-map', 'ing-ed-role', 'main-clause-skeleton'],
  }),
  st('[S {whether節| [接 Whether] [S such support] [V arrives] [M {前| in time}]}] [V will depend] [M {前| on decisions {過去分詞>decisions| [V made] [M {前| in the next few years}]}}].', {
    chunks: [
      ['Whether such support arrives in time', 'そうした支援が間に合うかどうかは'],
      ['will depend on decisions', '決定しだいです（どんな決定かは次へ）'],
      ['made in the next few years', 'これから数年の間になされる（決定）'],
    ],
    notes: {
      'Whether such support arrives in time': 'Whether 〜 は「〜かどうか」という名詞のまとまりで、文全体の主語です。in time は「間に合って」。',
      'will depend on decisions': 'depend on 〜 で「〜しだいである」。',
      'made in the next few years': 'made 以下は decisions を後ろから説明する過去分詞で「なされる決定」。',
    },
  }),
])
