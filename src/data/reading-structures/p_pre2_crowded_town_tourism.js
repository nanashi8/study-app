import { st } from './entry.js'

export default Object.freeze([
  st('[S A small mountain town {前| near a famous shrine}] [V has become] [C popular {前| with foreign visitors}].', {
    chunks: [
      ['A small mountain town near a famous shrine', '有名な神社の近くにある小さな山あいの町が'],
      ['has become popular with foreign visitors', '外国人観光客に人気になりました'],
    ],
    notes: {
      'A small mountain town near a famous shrine': 'near a famous shrine は A small mountain town を後ろから説明して「有名な神社の近くの町」。',
      'has become popular with foreign visitors': 'has become は現在完了で「（今では）〜になっている」。be popular with 〜 で「〜に人気がある」。',
    },
    rules: ['paragraph-map', 'noun-boundary', 'main-clause-skeleton'],
  }),
  st('[S Photographs {過去分詞>Photographs| [V shared] [M online]}] [V showed] [O a quiet street {前| with old wooden houses and a view {前| of the valley}}].', {
    chunks: [
      ['Photographs shared online showed a quiet street', 'ネット上で共有された写真が、静かな通りを映していました（どんな通りかは次へ）'],
      ['with old wooden houses', '古い木造の家が並び'],
      ['and a view of the valley', '谷の眺めもある（通りを）'],
    ],
    notes: {
      'Photographs shared online showed a quiet street': 'shared online は Photographs を後ろから説明する過去分詞で「ネット上で共有された写真」。',
      'and a view of the valley': 'and は with が導く二つの特徴（古い家並みと谷の眺め）を並べます。どちらも a quiet street がどんな通りかを説明しています。',
    },
    rules: ['ing-ed-role', 'noun-boundary', 'main-clause-skeleton'],
  }),
  st('[S The number {前| of visitors {前| on spring weekends}}] [V doubled] [M {前| within three years}].', {
    chunks: [
      ['The number of visitors on spring weekends', '春の週末の来訪者の数が'],
      ['doubled within three years', '3年のうちに2倍になりました'],
    ],
    notes: {
      'The number of visitors on spring weekends': 'on spring weekends は visitors を後ろから説明して「春の週末に来る人」。数えているのは春の週末の来訪者です。',
      'doubled within three years': 'double はここでは動詞で「2倍になる」。within 〜 で「〜のうちに」。',
    },
  }),
  st('[S Shops and restaurants] [V welcomed] [O the change] [M {副詞節:理由| [接 because] [S many young families] [V had left] [O the town]}].', {
    chunks: [
      ['Shops and restaurants welcomed the change', '商店や飲食店は、その変化を歓迎しました（なぜかは次へ）'],
      ['because many young families had left the town', '多くの若い家族が町を去っていたからです'],
    ],
    notes: {
      'Shops and restaurants welcomed the change': 'the change は、来訪者が増えたという前の段落の変化です。',
      'because many young families had left the town': 'had left は過去完了で、歓迎した時より前に「去ってしまっていた」ことを表します。',
    },
    rules: ['paragraph-map', 'cause-result', 'main-clause-skeleton'],
  }),
  st('[S New jobs] [V appeared], [接 and] [S two empty buildings] [V became] [C a cafe and a small hotel].', {
    chunks: [
      ['New jobs appeared,', '新しい仕事が生まれ'],
      ['and two empty buildings became a cafe', 'そして二つの空き家が、喫茶店と'],
      ['and a small hotel', '小さな宿になりました'],
    ],
    notes: {
      'New jobs appeared,': 'appear はここでは「現れる・生まれる」。',
      'and a small hotel': '空き家が2つあり、一方が喫茶店、もう一方が小さな宿になりました。',
    },
  }),
  st('[M However], [S residents] [M soon] [V noticed] [O problems {関係>problems| [O that] [S the first reports] [V had not mentioned]}].', {
    chunks: [
      ['However, residents soon noticed problems', 'しかし住民たちは、やがて問題に気づきました（どんな問題かは次へ）'],
      ['that the first reports had not mentioned', '最初の報道が触れていなかった（問題に）'],
    ],
    notes: {
      'However, residents soon noticed problems': 'However は前の良い面から話を折り返す合図です。soon は「やがて」。',
      'that the first reports had not mentioned': 'had not mentioned は過去完了で「（気づく前の報道では）触れていなかった」。写真や記事に出ていなかった問題ということです。',
    },
  }),
  st('[S Narrow streets] [V were] [C crowded], [接 and] [S buses] [V were] [M often] [C too full {前| for people {現在分詞>people| [V going] [M {前| to the hospital}]}}].', {
    chunks: [
      ['Narrow streets were crowded,', '狭い通りは混み合い'],
      ['and buses were often too full', 'バスはしばしば混みすぎていました（だれにとってかは次へ）'],
      ['for people going to the hospital', '病院へ行く人にとって'],
    ],
    notes: {
      'and buses were often too full': 'too ＋ 形容詞 で「〜すぎる」。満員で乗れないということです。',
      'for people going to the hospital': 'going to the hospital は people を後ろから説明する現在分詞で「病院へ行く人」。too full for 〜 は「〜には満員すぎる」。',
    },
  }),
  st('[S Some visitors] [V entered] [O private gardens] [M {副詞節:理由| [接 because] [S the path {前| to the shrine}] [V was not clearly marked]}].', {
    chunks: [
      ['Some visitors entered private gardens', '私有地の庭に入ってしまう来訪者もいました（なぜかは次へ）'],
      ['because the path to the shrine', '神社へ行く道が'],
      ['was not clearly marked', 'はっきり示されていなかったからです'],
    ],
    notes: {
      'Some visitors entered private gardens': 'private gardens は「よその家の庭」。悪気があったのではなく、道が分からなかったのです。',
      'was not clearly marked': 'was marked は受け身で「示されていた」。not が打ち消し、clearly は marked にかかって「はっきりとは示されていなかった」。',
    },
  }),
  st('[S Litter] [V increased] [M {前| near the bus stop}], [接 and] [S neighbors] [V collected] [O it] [M themselves] [M every Monday].', {
    chunks: [
      ['Litter increased near the bus stop,', 'バス停の近くでごみが増え'],
      ['and neighbors collected it themselves every Monday', '近所の人が毎週月曜日に自分たちで拾いました'],
    ],
    notes: {
      'Litter increased near the bus stop,': 'litter は「散らかったごみ」。bus stop で「バス停」。',
      'and neighbors collected it themselves every Monday': 'themselves は「自分たちで」と主語を強めます。町ではなく住民が拾っていたということです。',
    },
  }),
  st('[S The town council] [V did not want] [O {to:名詞| [V to stop] [O tourism]}], [接 so] [S it] [V looked] [M {前| for practical answers}].', {
    chunks: [
      ['The town council did not want', '町議会は望みませんでした（何をかは次へ）'],
      ['to stop tourism,', '観光を止めようとは'],
      ['so it looked for practical answers', 'そこで議会は、現実的な答えを探しました'],
    ],
    notes: {
      'to stop tourism,': 'want to 〜 で「〜したい」。not が want を打ち消し、「観光そのものをやめる気はなかった」と示します。',
      'so it looked for practical answers': 'it は The town council を指します。look for 〜 で「〜を探す」。practical は「現実的な」。',
    },
    rules: ['paragraph-map', 'negation-scope', 'main-clause-skeleton'],
  }),
  st('[S Officials] [M first] [V counted] [O visitors] [M {前| at three points}] [接 and] [V recorded] [O the busiest hours].', {
    chunks: [
      ['Officials first counted visitors at three points', '職員はまず、3か所で来訪者を数え'],
      ['and recorded the busiest hours', 'いちばん混み合う時間帯を記録しました'],
    ],
    notes: {
      'Officials first counted visitors at three points': 'first は「まず」。対策の前に数を数えたという順番を示します。',
      'and recorded the busiest hours': 'and の後ろの recorded の主語も Officials です。busiest は busy の最上級です。',
    },
  }),
  st('[S The data] [V showed] [O {that節| [接 that] [S most people] [V arrived] [M {前| between ten and two}] [M {前| on Saturdays}]}].', {
    chunks: [
      ['The data showed that', 'そのデータは〜と示しました（内容は次へ）'],
      ['most people arrived between ten and two', '大半の人が10時から2時の間に来ていた'],
      ['on Saturdays', '土曜日には（そうだったと）'],
    ],
    notes: {
      'most people arrived between ten and two': 'between A and B で「AとBの間に」。ten と two は時刻です。',
      'on Saturdays': '複数形の Saturdays は「土曜日にはいつも」という決まった曜日の話を表します。',
    },
  }),
  st('[S The town] [M then] [V asked] [O the bus company] [C {to:補語| [V to add] [O two morning buses {前| for residents only}]}].', {
    chunks: [
      ['The town then asked the bus company', '町はそれから、バス会社に頼みました（何をかは次へ）'],
      ['to add two morning buses', '朝のバスを2本増やすように'],
      ['for residents only', '住民だけが乗れる'],
    ],
    notes: {
      'The town then asked the bus company': 'ask ＋ 人 ＋ to 〜 で「人に〜するよう頼む」。then は数えた結果を受けて「それから」。',
      'for residents only': 'for residents only は two morning buses を後ろから説明して「住民専用のバス」。only が residents を「住民だけ」と限ります。',
    },
  }),
  st('[S Volunteers] [V put] [O clear signs and simple maps] [M {前| at the station}] [接 and] [M {前| near the shrine}].', {
    chunks: [
      ['Volunteers put clear signs and simple maps', 'ボランティアが、分かりやすい標識と簡単な地図を置きました（どこにかは次へ）'],
      ['at the station and near the shrine', '駅と、神社の近くに'],
    ],
    notes: {
      'Volunteers put clear signs and simple maps': 'put は過去形も put です。第8文の「道が分からない」問題への手当てです。',
      'at the station and near the shrine': 'and は置いた場所を二つ並べます。',
    },
  }),
  st('[S A local group] [M also] [V suggested] [O a small fee {前| for large tour buses}].', {
    chunks: [
      ['A local group also suggested a small fee', '地元の団体はさらに、少額の料金を提案しました（何にかかるかは次へ）'],
      ['for large tour buses', '大型観光バスにかける'],
    ],
    notes: {
      'A local group also suggested a small fee': 'also は、バスと標識の対策に「さらに」一つ加わることを示します。fee は「料金」。',
      'for large tour buses': 'for large tour buses は a small fee を後ろから説明して「大型観光バスにかかる料金」。',
    },
    rules: ['paragraph-map', 'noun-boundary', 'main-clause-skeleton'],
  }),
  st('[S The money] [V would pay] [M {前| for cleaning, toilets, and translation}].', {
    chunks: [
      ['The money would pay for cleaning,', 'その資金で、清掃の費用をまかなう予定でした'],
      ['toilets, and translation', 'トイレと翻訳の費用も'],
    ],
    notes: {
      'The money would pay for cleaning,': 'pay for 〜 で「〜の代金をはらう」。would は「〜する予定だった」と、その時点の見通しを表します。',
      'toilets, and translation': '集めた料金の使い道が、清掃・トイレ・翻訳の三つ並んでいます。',
    },
  }),
  st('[S Large tour buses] [V put] [O more pressure] [M {前| on narrow roads}] [M {副詞節:比較| [接 than] [S private cars] [V do]}].', {
    chunks: [
      ['Large tour buses put more pressure', '大型観光バスは、より大きな負担をかけます（どこにかは次へ）'],
      ['on narrow roads', '狭い道に'],
      ['than private cars do', '自家用車がかけるよりも'],
    ],
    notes: {
      'Large tour buses put more pressure': 'put pressure on 〜 で「〜に負担をかける」。more は「より大きな」。',
      'than private cars do': 'than の後ろの do は put more pressure の代わりです。料金を大型バスにかける理由を説明しています。',
    },
  }),
  st('[S Some shop owners] [V disagreed] [M {副詞節:理由| [接 because] [S they] [V feared] [O {that節| [接 that] [S fewer buses] [V would mean] [O fewer customers]}]}].', {
    chunks: [
      ['Some shop owners disagreed', '反対した商店主もいました（なぜかは次へ）'],
      ['because they feared that', 'その人たちが〜と心配したからです（内容は次へ）'],
      ['fewer buses would mean fewer customers', 'バスが減れば客も減る（と）'],
    ],
    notes: {
      'Some shop owners disagreed': 'disagree は「反対する・意見が合わない」。町の中で意見が分かれた場面です。',
      'fewer buses would mean fewer customers': 'fewer は few の比較級で「より少ない」。A would mean B で「AはBということになるだろう」。',
    },
  }),
  st('[S The council] [M therefore] [V decided] [O {to:名詞| [V to charge] [O the fee] [M {前| for one year}] [接 and] [V publish] [O the results]}].', {
    chunks: [
      ['The council therefore decided', 'そこで議会は決めました（何をかは次へ）'],
      ['to charge the fee for one year', 'その料金を1年間とること'],
      ['and publish the results', 'そして結果を公表することを'],
    ],
    notes: {
      'to charge the fee for one year': 'charge はここでは「（料金を）とる」。for one year で「1年間」と期限を区切っています。',
      'and publish the results': 'publish の前に to が省かれています。decided の目的語は「料金をとること」と「結果を公表すること」の二つです。',
    },
  }),
  st('[M {前| After the first season}], [S complaints {前| about noise}] [V decreased], [接 but] [S the streets] [V were] [M still] [C crowded] [M {前| at noon}].', {
    chunks: [
      ['After the first season, complaints about noise decreased,', '最初の観光の季節が終わると、騒音の苦情は減りました'],
      ['but the streets were still crowded at noon', 'しかし通りは、昼どきには今も混み合っていました'],
    ],
    notes: {
      'After the first season, complaints about noise decreased,': 'the first season は料金を集めた最初の観光の季節です。about noise は complaints を後ろから説明して「騒音についての苦情」。',
      'but the streets were still crowded at noon': 'still は「今も変わらず」。at noon は「昼どきに」。騒音は減ったが、昼の混雑は残ったという対比です。',
    },
    rules: ['paragraph-map', 'contrast-concession', 'main-clause-skeleton'],
  }),
  st('[S Residents] [V said] [O {that節| [接 that] [S the new buses] [V helped] [O older people] [M most]}].', {
    chunks: [
      ['Residents said that', '住民は〜と言いました（内容は次へ）'],
      ['the new buses helped older people most', '新しいバスは、年配の人をいちばん助けた（と）'],
    ],
    notes: {
      'the new buses helped older people most': 'most は「いちばん」。だれよりも年配の人の役に立った、という住民の受け取り方です。',
    },
  }),
  st('[M However], [S younger residents] [V wanted] [O more evening events {前| for visitors}].', {
    chunks: [
      ['However, younger residents wanted more evening events', 'しかし若い住民は、夜の催しをもっと望みました（だれ向けかは次へ）'],
      ['for visitors', '来訪者のための'],
    ],
    notes: {
      'However, younger residents wanted more evening events': 'However は前の文の住民の声と対比しています。younger residents は「町の中でより若い住民」。',
    },
  }),
  st('[S The council] [M now] [V plans] [O a new comparison {前| of weekday and weekend data}] [M {前| before {動名詞| [V changing] [O the rules] [M again]}}].', {
    chunks: [
      ['The council now plans a new comparison', '議会は今、新たに比べてみる計画です（何をかは次へ）'],
      ['of weekday and weekend data', '平日と週末のデータを'],
      ['before changing the rules again', 'もう一度決まりを変える前に'],
    ],
    notes: {
      'The council now plans a new comparison': 'comparison は compare（比べる）の名詞形で「比較」。',
      'before changing the rules again': 'before の後ろの changing は動名詞で「変えること」。決まりを変える前に、もう一度数字を見るということです。',
    },
  }),
  st('[S The mayor] [V said] [O {that節| [接 that] [S tourism] [V must serve] [O the people {関係>the people| [S who] [V live] [M there] [M every day]}]}].', {
    chunks: [
      ['The mayor said that', '町長は〜と言いました（内容は次へ）'],
      ['tourism must serve the people', '観光は人々の役に立たなければならない（どんな人々かは次へ）'],
      ['who live there every day', '毎日そこで暮らしている（人々の）'],
    ],
    notes: {
      'tourism must serve the people': 'serve はここでは「役に立つ・尽くす」。must は「〜しなければならない」。',
      'who live there every day': 'there は「その町で」。観光客より、毎日暮らす住民を先に考えるという結びです。',
    },
  }),
])
