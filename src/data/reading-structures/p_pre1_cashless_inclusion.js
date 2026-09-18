import { st } from './entry.js'

export default Object.freeze([
  st('[S Cashless payment] [V has] [M recently] [V moved] [M {前| from a convenient option}] [M {前| to the expected form {前| of payment}}] [M {前| in many shops, transport systems, and public facilities}].', {
    chunks: [
      ['Cashless payment has recently moved', 'キャッシュレス決済は、近年移り変わってきました（何から何へかは次へ）'],
      ['from a convenient option', '便利な選択肢から'],
      ['to the expected form of payment', '当然とされる支払い方法へ'],
      ['in many shops, transport systems, and public facilities', '多くの店や交通機関、公共施設で'],
    ],
    notes: {
      'Cashless payment has recently moved': 'has moved は現在完了で、「（これまでに）移ってきた」。move from A to B で「AからBへ移る」。',
      'to the expected form of payment': 'expected は「当然そうだと思われている」。',
    },
  }),
  st('[S Supporters] [V cite] [O faster transactions, lower handling costs, and reduced risk {前| of theft {前| for merchants}}].', {
    chunks: [
      ['Supporters cite', '支持する人々は挙げます（何をかは次へ）'],
      ['faster transactions, lower handling costs,', 'より速い取引や、現金を扱う費用の低さ'],
      ['and reduced risk of theft for merchants', 'そして商店にとっての盗難の危険の減少を'],
    ],
    notes: {
      'Supporters cite': 'cite は「（根拠として）挙げる」。',
      'and reduced risk of theft for merchants': 'faster transactions から merchants までの三つが cite の目的語です。',
    },
  }),
  st('[S Digital records] [V can] [M also] [V help] [O consumers] [C {原形| [V follow] [O their spending]}] [接 and] [V allow] [O small businesses] [C {to:補語| [V to sell] [O goods] [M online]}].', {
    chunks: [
      ['Digital records can also help consumers', 'デジタルの記録は、消費者を助けることもできます（何をするのをかは次へ）'],
      ['follow their spending', '自分の支出を把握するのを'],
      ['and allow small businesses', 'そして小さな事業者に可能にします（何をかは次へ）'],
      ['to sell goods online', 'オンラインで商品を売ることを'],
    ],
    notes: {
      'Digital records can also help consumers': 'help ＋ 人 ＋ 動詞の原形 で「人が〜するのを助ける」。',
      'and allow small businesses': 'allow ＋ 人 ＋ to 〜 で「人が〜できるようにする」。allow も can を共有しています。',
    },
  }),
  st('[S These benefits] [V are] [C real], [接 but] [S they] [V are not shared] [M equally].', {
    chunks: [
      ['These benefits are real,', 'こうした利点は本物です'],
      ['but they are not shared equally', 'しかし、それらは平等に分け合われてはいません'],
    ],
    notes: {
      'but they are not shared equally': 'are not shared は受け身の否定です。they は These benefits を指します。',
    },
  }),
  st('[S Some people] [V do not have] [O a bank account, a suitable phone, reliable internet access, or the identity documents {過去分詞>the identity documents| [V required] [M {to:副詞(目的)| [V to open] [O a digital account]}]}].', {
    chunks: [
      ['Some people do not have a bank account,', '一部の人々は、銀行口座を持っていません'],
      ['a suitable phone, reliable internet access,', '使える電話や、安定したインターネット接続も'],
      ['or the identity documents', 'あるいは身分証明書も（どんな書類かは次へ）'],
      ['required to open a digital account', 'デジタルの口座を開くのに必要な（身分証明書も）'],
    ],
    notes: {
      'a suitable phone, reliable internet access,': 'a bank account から the identity documents までの四つが、どれも have の目的語です。',
      'required to open a digital account': 'required は「必要とされる」という過去分詞で、the identity documents を後ろから説明します。',
    },
  }),
  st('[S Others] [V can use] [O digital services] [接 but] [V struggle] [M {前| with small fees, complex passwords, or interfaces {関係>interfaces| [S that] [V were not designed] [M {前| for disabilities}]}}].', {
    chunks: [
      ['Others can use digital services', 'ほかの人々は、デジタルのサービスは使えます'],
      ['but struggle', 'しかし苦労しています（何にかは次へ）'],
      ['with small fees, complex passwords,', '少額の手数料や複雑なパスワード'],
      ['or interfaces', 'あるいは画面に（どんな画面かは次へ）'],
      ['that were not designed for disabilities', '障害に配慮して作られていない（画面に）'],
    ],
    notes: {
      'Others can use digital services': 'Others は other people のことで、前の文の Some people と別の人々です。',
      'but struggle': 'struggle with 〜 で「〜に苦労する」。struggle も Others を主語にしています。',
    },
  }),
  st('[M {前| For these users}], [S {動名詞| [V refusing] [O cash]}] [V does] [O more {前| than {原形| [V remove] [O a familiar habit]}}]; [S it] [V can limit] [O access {前| to food, transport, and public life}].', {
    chunks: [
      ['For these users,', 'こうした利用者にとって'],
      ['refusing cash', '現金を受け付けないことは'],
      ['does more than remove a familiar habit;', '慣れた習慣をなくすだけでは済みません'],
      ['it can limit access', 'それは利用を制限することがあります（何のかは次へ）'],
      ['to food, transport, and public life', '食べ物や交通、社会生活への'],
    ],
    notes: {
      'refusing cash': 'refusing cash は「現金を受け付けないこと」という動名詞のまとまりで、主語です。',
      'does more than remove a familiar habit;': 'do more than 〜 で「〜するだけにとどまらない」。than の後ろは動詞の原形 remove です。',
      'it can limit access': 'it は refusing cash を指します。access to 〜 で「〜を利用できること」。',
    },
  }),
  st('[S Privacy] [V is] [C a different concern].', {
    chunks: [
      ['Privacy is a different concern', 'プライバシーは、また別の心配ごとです'],
    ],
    notes: {
      'Privacy is a different concern': 'a different concern は、前の段落の「使えない人がいる」問題とは別の心配ごと、という意味です。',
    },
  }),
  st('[S Cash] [M usually] [V leaves] [O no detailed record {現在分詞>no detailed record| [V linking] [O a person] [M {前| to a particular purchase}]}], [M {副詞節:対比| [接 whereas] [S digital payment] [V creates] [O data {関係>data| [S that] [V may be stored, combined, or sold]}]}].', {
    chunks: [
      ['Cash usually leaves no detailed record', '現金は、ふつう詳しい記録を残しません（どんな記録かは次へ）'],
      ['linking a person to a particular purchase,', '人と特定の買い物を結びつける（記録を）'],
      ['whereas', '一方で'],
      ['digital payment creates data', 'デジタル決済はデータを生み出します（どんなデータかは次へ）'],
      ['that may be stored, combined, or sold', '保存されたり、組み合わされたり、売られたりするかもしれない（データを）', 'that may be stored, combined, or sold'],
    ],
    notes: {
      'linking a person to a particular purchase,': 'linking は現在分詞で、no detailed record を後ろから説明します。link A to B で「AをBに結びつける」。',
      'that may be stored, combined, or sold': 'may be の後ろに、stored・combined・sold の三つの過去分詞が並んでいます。',
    },
  }),
  st('[S Such records] [V can detect] [O fraud] [接 and] [V improve] [O services], [接 yet] [S they] [V can] [M also] [V reveal] [O medical needs, political interests, or daily movements].', {
    chunks: [
      ['Such records can detect fraud and improve services,', 'そうした記録は、不正を見つけてサービスをよくすることができます'],
      ['yet', 'しかし'],
      ['they can also reveal', 'それは明らかにしてしまうこともあります（何をかは次へ）'],
      ['medical needs, political interests, or daily movements', '医療上の必要や政治的な関心、毎日の移動を'],
    ],
    notes: {
      'Such records can detect fraud and improve services,': 'improve も can を共有しています（can improve）。',
      'they can also reveal': 'yet は「しかし」。they は Such records を指します。',
    },
  }),
  st('[S People {前| with little economic or political power}] [V may be] [M especially] [C vulnerable] [M {副詞節:時| [接 when] [S they] [V cannot choose] [O a private alternative]}].', {
    chunks: [
      ['People with little economic or political power', '経済的・政治的な力の乏しい人々は'],
      ['may be especially vulnerable', '特に弱い立場に置かれるかもしれません'],
      ['when they cannot choose a private alternative', 'プライバシーを守れる別の手段を選べないときに'],
    ],
    notes: {
      'People with little economic or political power': 'little は「ほとんどない」。with 以下は People を後ろから説明します。',
      'when they cannot choose a private alternative': 'a private alternative は、記録が残らない（プライバシーを守れる）別の支払い方法のことです。',
    },
  }),
  st('[S A common response] [V is] [C {to:名詞| [V to teach] [O digital skills] [接 and] [V provide] [O low-cost accounts]}].', {
    chunks: [
      ['A common response', 'よくある対応は'],
      ['is to teach digital skills', 'デジタルの技能を教えること（と）'],
      ['and provide low-cost accounts', '安い費用で使える口座を用意することです'],
    ],
    notes: {
      'is to teach digital skills': 'to teach 以下は「〜を教えること」という名詞のまとまりで、補語です。provide も to を共有しています。',
    },
  }),
  st('[S These measures] [V can expand] [O participation], [接 but] [S they] [V do not solve] [O every problem].', {
    chunks: [
      ['These measures can expand participation,', 'こうした対策は、参加を広げることができます'],
      ['but they do not solve every problem', 'しかし、すべての問題を解決するわけではありません'],
    ],
    notes: {
      'but they do not solve every problem': 'not … every は「すべてが〜というわけではない」という部分否定です。',
    },
  }),
  st('[S Training] [V provides] [O only limited value] [M {前| in rural areas {前| with weak mobile service}} or {前| during payment system failures {前| after serious natural disasters and emergencies}}].', {
    chunks: [
      ['Training provides only limited value', '訓練は、限られた価値しか生みません'],
      ['in rural areas with weak mobile service', '携帯電話の電波が弱い農村部では'],
      ['or during payment system failures', 'あるいは決済の仕組みが止まっている間には'],
      ['after serious natural disasters and emergencies', '深刻な自然災害や緊急事態のあとの（止まっている間には）'],
    ],
    notes: {
      'Training provides only limited value': 'only limited で「限られた〜しか」。',
      'or during payment system failures': 'in rural areas … と during payment system failures … の二つを or で並べています。',
    },
  }),
  st('[接 Nor] [V should] [S inclusion] [V mean] [O {動名詞| [V forcing] [O everyone] [M {前| into a system}] [M simply {副詞節:理由| [接 because] [S institutions] [V find] [O it] [C efficient]}]}].', {
    chunks: [
      ['Nor should inclusion mean', 'また、包摂が〜を意味するべきでもありません（内容は次へ）'],
      ['forcing everyone into a system', '全員を一つの仕組みに押し込むことを'],
      ['simply because institutions find it efficient', '機関がそれを効率的だと思うというだけの理由で'],
    ],
    notes: {
      'Nor should inclusion mean': 'Nor ＋ 助動詞 ＋ 主語 ＋ 動詞 の語順（倒置）で「〜もまた…ない」。inclusion は「だれも取り残さずに参加できるようにすること（包摂）」。',
      'simply because institutions find it efficient': 'find ＋ O ＋ C で「OをCだと思う」。it は a system を指します。',
    },
  }),
  st('[S Cash] [V can] [M also] [V provide] [O a simple budgeting tool] [M {前| for households {関係>households| [S whose income] [V changes] [M {前| from week} {前| to week}]}}].', {
    chunks: [
      ['Cash can also provide a simple budgeting tool', '現金は、簡単な家計管理の手段にもなります（だれにとってかは次へ）'],
      ['for households', '家庭にとって（どんな家庭かは次へ）'],
      ['whose income changes from week to week', '収入が週ごとに変わる（家庭にとって）'],
    ],
    notes: {
      'whose income changes from week to week': 'whose は households を受け、「その家庭の」という意味の関係代名詞です。from week to week で「週ごとに」。',
    },
  }),
  st('[S A fixed amount {前| in an envelope}] [V stays] [C visible], [M {副詞節:対比| [接 while] [S digital balances] [V may be divided] [M {前| across several apps and delayed transactions}]}].', {
    chunks: [
      ['A fixed amount in an envelope stays visible,', '封筒に入れた決まった金額は、目に見えたままです'],
      ['while', '一方で'],
      ['digital balances may be divided', 'デジタルの残高は分かれているかもしれません（どこにかは次へ）'],
      ['across several apps and delayed transactions', 'いくつものアプリや、処理が遅れている取引に'],
    ],
    notes: {
      'A fixed amount in an envelope stays visible,': 'stay ＋ 形容詞 で「〜のままである」。',
      while: 'while はここでは「一方で」と、現金とデジタルの残高を比べています。',
    },
  }),
  st('[S This] [V does not make] [O cash] [C universally superior], [接 but] [S it] [V shows] [O {疑問詞節| [M why] [S a preferred tool] [V can depend] [M {前| on a person’s circumstances} {前| rather than technical knowledge alone}]}].', {
    chunks: [
      ['This does not make cash universally superior,', 'これで、現金がどんな場合にも優れていることにはなりません'],
      ['but it shows', 'しかし、これは示しています（何をかは次へ）'],
      ['why a preferred tool can depend', '好まれる手段が左右されることがある理由を（何にかは次へ）'],
      ['on a person’s circumstances', 'その人の事情に'],
      ['rather than technical knowledge alone', '技術的な知識だけよりも'],
    ],
    notes: {
      'This does not make cash universally superior,': 'make ＋ O ＋ C で「OをCにする」。This は前の文の封筒の例を指します。',
      'rather than technical knowledge alone': 'A rather than B alone で「Bだけよりも、むしろA」。',
    },
  }),
  st('[S Some governments] [M therefore] [V require] [O essential businesses] [C {to:補語| [V to accept] [O cash]}] [M {副詞節:対比| [接 while] [V encouraging] [O digital innovation] [M elsewhere]}].', {
    chunks: [
      ['Some governments therefore require essential businesses', 'そのため一部の政府は、生活に欠かせない事業者に求めています（何をかは次へ）'],
      ['to accept cash', '現金を受け付けるように'],
      ['while encouraging digital innovation elsewhere', 'ほかの場面では、デジタルの新しい取り組みを後押しする一方で'],
    ],
    notes: {
      'Some governments therefore require essential businesses': 'require ＋ 人 ＋ to 〜 で「人に〜するよう求める」。',
      'while encouraging digital innovation elsewhere': 'while encouraging は while (they are) encouraging の形で、「〜する一方で」。',
    },
  }),
  st('[S Critics] [V argue] [O {that節| [接 that] [S such rules] [V create] [O costs] [M {前| for merchants {関係>merchants| [S who] [V must maintain] [O two payment systems]}}]}].', {
    chunks: [
      ['Critics argue that', '批判する人々は、〜と主張します（内容は次へ）'],
      ['such rules create costs for merchants', 'そうした規則は商店に費用を生む（と）'],
      ['who must maintain two payment systems', '二つの支払いの仕組みを保たなければならない（商店に）'],
    ],
    notes: {
      'Critics argue that': 'Critics argue は、筆者ではなく批判する人々の意見です。',
    },
  }),
  st('[S That objection] [V is] [C important], [M particularly {前| for small shops {前| with narrow profit margins}}].', {
    chunks: [
      ['That objection is important,', 'その反論は重要です'],
      ['particularly for small shops', '特に小さな店にとっては（どんな店かは次へ）'],
      ['with narrow profit margins', '利益の幅が小さい（店にとっては）'],
    ],
    notes: {
      'That objection is important,': 'That objection は前の文の批判する人々の主張を指します。筆者はその反論を重要だと認めています。',
    },
    rules: ['author-stance', 'reference-chain', 'svoc-core'],
  }),
  st('[S Policy] [V can reduce] [O the burden] [M {前| through shared cash services, tax incentives, or exemptions {前| for clearly defined cases}}].', {
    chunks: [
      ['Policy can reduce the burden', '政策は、その負担を減らすことができます（どうやってかは次へ）'],
      ['through shared cash services, tax incentives,', '共同の現金サービスや税の優遇'],
      ['or exemptions for clearly defined cases', 'または、はっきり決められた場合の免除によって'],
    ],
    notes: {
      'through shared cash services, tax incentives,': 'through は手段を表して「〜によって」。三つの手段を並べています。',
    },
  }),
  st('[S The broader lesson] [V is] [C {that節| [接 that] [S innovation] [V should be judged] [M {前| by the range {前| of people {関係>people| [S who] [V can use] [O it]}}}, not only {前| by the speed {前| of its average transaction}}]}].', {
    chunks: [
      ['The broader lesson is that', 'より広い教訓とは、〜ということです（内容は次へ）'],
      ['innovation should be judged', '新しい技術は評価されるべきだ（何によってかは次へ）'],
      ['by the range of people', '人々の範囲によって（どんな人々かは次へ）'],
      ['who can use it,', 'それを使える（人々の範囲によって）'],
      ['not only by the speed', '速さだけによってではなく（何の速さかは次へ）'],
      ['of its average transaction', '平均的な取引の（速さ）'],
    ],
    notes: {
      'innovation should be judged': 'should be judged は「評価されるべきだ」という受け身です。',
      'not only by the speed': 'A, not only B で「Bだけでなく、Aによって」。',
      'of its average transaction': 'its は innovation を指します。',
    },
  }),
  st('[S A payment system] [V is] [C part {前| of social infrastructure}], [接 and] [S infrastructure] [V must remain] [C usable] [M {前| under varied human and technical conditions}].', {
    chunks: [
      ['A payment system is part of social infrastructure,', '支払いの仕組みは、社会基盤の一部です'],
      ['and infrastructure must remain usable', 'そして社会基盤は、使える状態であり続けなければなりません'],
      ['under varied human and technical conditions', '人や技術のさまざまな条件のもとで'],
    ],
    notes: {
      'and infrastructure must remain usable': 'remain ＋ 形容詞 で「〜のままである」。',
    },
  }),
  st('[S Cash] [V may] [M sometimes] [V appear] [C inefficient] [M {前| as an option}], [M {副詞節:様態| [接 just as] [S backup power] [V can appear] [C wasteful] [M {前| on an ordinary day}]}].', {
    chunks: [
      ['Cash may sometimes appear inefficient', '現金は、ときに効率が悪く見えるかもしれません'],
      ['as an option,', '選択肢としては'],
      ['just as backup power can appear wasteful', 'ちょうど予備の電源がむだに見えることがあるのと同じように（いつかは次へ）'],
      ['on an ordinary day', 'ふだんの日には'],
    ],
    notes: {
      'Cash may sometimes appear inefficient': 'appear ＋ 形容詞 で「〜に見える」。',
      'just as backup power can appear wasteful': 'just as ＋ 主語 ＋ 動詞 で「ちょうど〜と同じように」。現金を予備の電源にたとえています。',
    },
    rules: ['comparison-pairs', 'author-stance', 'main-clause-skeleton'],
  }),
  st('[M However], [S this apparent duplication] [V provides] [O valuable resilience] [M {前| during a network failure}].', {
    chunks: [
      ['However,', 'しかし'],
      ['this apparent duplication', 'この見かけ上の重複は'],
      ['provides valuable resilience', '大切な回復力をもたらします（いつかは次へ）'],
      ['during a network failure', '通信が止まったときに'],
    ],
    notes: {
      'this apparent duplication': 'this apparent duplication は、現金とデジタルの二つの支払い方法を両方用意しておくことを指します。',
    },
    rules: ['contrast-concession', 'reference-chain', 'svoc-core'],
  }),
  st('[S The goal] [V need not be] [C {to:名詞| [V to stop] [O the transition {前| toward digital payment}]}].', {
    chunks: [
      ['The goal need not be', '目標は、〜である必要はありません（内容は次へ）'],
      ['to stop the transition toward digital payment', 'デジタル決済への移り変わりを止めること'],
    ],
    notes: {
      'The goal need not be': 'need not ＋ 動詞の原形 で「〜する必要はない」。この need は助動詞です。',
    },
  }),
  st('[S It] [V should be] [C {to:名詞| [V to preserve] [O meaningful alternatives] [M {副詞節:対比| [接 while] [V removing] [O barriers {関係>barriers| [S that] [V prevent] [O people] [M {前| from {動名詞| [V choosing] [M freely]}}]}]}]}].', {
    chunks: [
      ['It should be', '目標は、〜であるべきです（内容は次へ）'],
      ['to preserve meaningful alternatives', '意味のある別の手段を残すこと'],
      ['while removing barriers', '障壁を取り除きながら（どんな障壁かは次へ）'],
      ['that prevent people from choosing freely', '人々が自由に選ぶのを妨げる（障壁を）'],
    ],
    notes: {
      'It should be': 'It は前の文の The goal を指します。',
      'that prevent people from choosing freely': 'prevent ＋ O ＋ from -ing で「Oが〜するのを妨げる」。',
    },
  }),
  st('[S A genuinely modern system] [V is not] [C one {関係>one| [S that] [V eliminates] [O older tools] [M as quickly {前| as possible}]}, but one {関係>one| [S that] [V combines] [O convenience, privacy, inclusion, and flexibility] [M {前| in practice}]}].', {
    chunks: [
      ['A genuinely modern system is not one', '本当に現代的な仕組みとは、〜ものではありません（内容は次へ）'],
      ['that eliminates older tools as quickly as possible,', '古い道具をできるだけ早くなくす（ものでは）'],
      ['but one', 'そうではなく、〜ものです（内容は次へ）'],
      ['that combines convenience, privacy, inclusion, and flexibility', '便利さやプライバシー、包摂、柔軟さを組み合わせる（ものです）'],
      ['in practice', '実際に'],
    ],
    notes: {
      'A genuinely modern system is not one': 'one は a system の代わりです。not A but B で「AではなくB」。',
      'that eliminates older tools as quickly as possible,': 'as 〜 as possible で「できるだけ〜」。',
    },
  }),
])
