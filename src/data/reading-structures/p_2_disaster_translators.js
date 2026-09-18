import { st } from './entry.js'

export default Object.freeze([
  st('[S A strong typhoon] [V reached] [O our coastal town] [M three years ago].', {
    chunks: [
      ['A strong typhoon reached our coastal town', '強い台風が、海沿いの私たちの町にやって来ました（いつかは次へ）'],
      ['three years ago', '3年前に'],
    ],
    notes: {
      'A strong typhoon reached our coastal town': 'reach は「〜に着く・届く」で、前置詞なしで目的語を取ります。coastal は「海沿いの・沿岸の」。',
    },
  }),
  st('[S The local authority] [V sent] [O an evacuation warning] [M {前| at nine {前| in the evening}}].', {
    chunks: [
      ['The local authority sent an evacuation warning', '地元の当局は、避難の警報を送りました（いつかは次へ）'],
      ['at nine in the evening', '夜の9時に'],
    ],
    notes: {
      'The local authority sent an evacuation warning': 'local authority は町などの「地元の行政機関」。evacuation warning は「避難の警報」。',
      'at nine in the evening': 'in the evening は nine を後ろから説明して「夜の9時」＝午後9時。',
    },
  }),
  st('[S The message] [V reached] [O every phone {前| in the area}] [M {前| within a minute}].', {
    chunks: [
      ['The message reached every phone', 'その知らせは、すべての電話に届きました（どこのかは次へ）'],
      ['in the area', 'その地域の'],
      ['within a minute', '1分以内に'],
    ],
    notes: {
      'The message reached every phone': 'The message は前の文の避難の警報です。reach はここでは「〜に届く」。',
      'within a minute': 'within は「〜以内に」。',
    },
  }),
  st('[S Foreign residents] [V read] [O the warning] [接 but] [V did not move].', {
    chunks: [
      ['Foreign residents read the warning', '外国出身の住民は、その警報を読みました'],
      ['but did not move', 'しかし、動きませんでした'],
    ],
    notes: {
      'Foreign residents read the warning': 'read はここでは過去形（発音は red）。resident は「住民」。',
      'but did not move': 'did not move は「動かなかった」＝避難しなかったということです。',
    },
  }),
  st('[S A later study] [V explained] [O the whole process] [M {前| in clear terms}].', {
    chunks: [
      ['A later study explained the whole process', 'のちの調査が、その一連の流れを説明しました（どのようにかは次へ）'],
      ['in clear terms', 'はっきりした言葉で'],
    ],
    notes: {
      'A later study explained the whole process': 'later は「のちの・あとの」。process は「（出来事の）流れ」で、警報が届いたのに人が動かなかった流れのことです。',
      'in clear terms': 'term はここでは「言葉・言い方」。',
    },
  }),
  st('[S The message] [V used] [O {並列| old official words | and a difficult grammar form}].', {
    chunks: [
      ['The message used old official words', 'その知らせは、古い公式の言葉を使っていました'],
      ['and a difficult grammar form', 'そして、難しい文法の形も'],
    ],
    notes: {
      'The message used old official words': 'official は「公式の・役所の」。used の目的語は、and で結ばれた二つです。',
      'and a difficult grammar form': 'grammar form は「文法の形」。',
    },
  }),
  st('[S Machine translation] [V turned] [O one urgent sentence] [M {前| into a polite invitation}].', {
    chunks: [
      ['Machine translation turned one urgent sentence', '機械翻訳は、一つの緊急の文を変えてしまいました（何にかは次へ）'],
      ['into a polite invitation', 'ていねいな誘いに'],
    ],
    notes: {
      'Machine translation turned one urgent sentence': 'machine translation は「機械翻訳」。turn A into B で「A を B に変える」。urgent は「緊急の」。',
      'into a polite invitation': 'invitation は「誘い」。すぐに逃げるよう求める文が、「よろしければどうぞ」のような誘いの言い方になったということです。',
    },
  }),
  st('[S A second sentence] [V became] [C ambiguous] [M {前| in three languages}].', {
    chunks: [
      ['A second sentence became ambiguous', '二つ目の文は、あいまいになりました（何語でかは次へ）'],
      ['in three languages', '三つの言語で'],
    ],
    notes: {
      'A second sentence became ambiguous': 'ambiguous は「あいまいな（二通り以上に取れる）」。become ＋ 形容詞 で「〜になる」。',
    },
  }),
  st('[S The warning] [V was] [C {並列| accurate {前| in Japanese} | and useless {前| in practice}}].', {
    chunks: [
      ['The warning was accurate in Japanese', 'その警報は、日本語としては正確でした'],
      ['and useless in practice', 'そして、実際には役に立たないものでした'],
    ],
    notes: {
      'The warning was accurate in Japanese': 'accurate は「正確な」。in Japanese は「日本語としては」。',
      'and useless in practice': 'was の補語は accurate と useless の二つです。反対の向きの語を and で並べ、「正確なのに役に立たない」ことを表します。in practice は「実際には」。',
    },
  }),
  st('[S The office] [V had followed] [O its own manual], [接 and] [S the message] [M still] [V failed].', {
    chunks: [
      ['The office had followed its own manual,', '役場は、自分たちの手引きに従っていました'],
      ['and the message still failed', 'そして、知らせはそれでもうまくいきませんでした'],
    ],
    notes: {
      'The office had followed its own manual,': 'had followed は過去完了で、警報を出したときより前から手引きどおりにしていたことを表します。manual は「手引き」。',
      'and the message still failed': 'still はここでは「それでも」。fail は「うまくいかない・失敗する」で、知らせは届いたのに、人を動かせなかったことを指します。',
    },
  }),
  st('[S A group {前| of {並列| residents | and teachers}}] [V began] [O a small project].', {
    chunks: [
      ['A group of residents and teachers', '住民と教員の集まりが'],
      ['began a small project', '小さな取り組みを始めました'],
    ],
    notes: {
      'A group of residents and teachers': 'group が中心の名詞で、of residents and teachers が「だれの集まりか」を後ろから説明します。',
      'began a small project': 'project はここでは「取り組み」。',
    },
  }),
  st('[S They] [V wrote] [O thirty common notices] [M again] [M {前| in easy Japanese}].', {
    chunks: [
      ['They wrote thirty common notices again', '彼らは、30のよくある知らせを書き直しました（どう書き直したかは次へ）'],
      ['in easy Japanese', 'やさしい日本語で'],
    ],
    notes: {
      'They wrote thirty common notices again': 'They は前の文の集まりを指します。write 〜 again で「〜を書き直す」。common はここでは「よくある」、notice は「知らせ・お知らせ」。',
      'in easy Japanese': 'easy Japanese は「やさしい日本語」で、外国出身の人にも分かるように言い方を工夫した日本語です。',
    },
  }),
  st('[S Each notice] [V keeps] [M {前| to {並列| one idea, | one action | and a short sentence}}].', {
    chunks: [
      ['Each notice keeps to one idea, one action', 'それぞれの知らせは、一つの考え、一つの行動に絞っています'],
      ['and a short sentence', 'そして、短い一文に'],
    ],
    notes: {
      'Each notice keeps to one idea, one action': 'keep to 〜 で「〜だけにとどめる・〜に絞る」。to の後ろに三つが並んでいます。action はここでは、読んだ人がする「行動」。',
      'and a short sentence': '一つの知らせを、短い一文で書くということです。',
    },
  }),
  st('[S The group] [M also] [V tested] [O every notice] [M {前| with new immigrants}].', {
    chunks: [
      ['The group also tested every notice', 'その集まりはまた、すべての知らせを試しました（だれを相手にかは次へ）'],
      ['with new immigrants', '新しく来た移民の人たちを相手に'],
    ],
    notes: {
      'The group also tested every notice': 'also は「また」。test はここでは「（実際に使って）試す」。',
      'with new immigrants': 'immigrant は「（外国から来た）移民」。来たばかりの人に読んでもらい、伝わるかを確かめたということです。',
    },
  }),
  st('[S A reader {前| from another country}] [V did not understand] [O the word {前| for a shelter}].', {
    chunks: [
      ['A reader from another country', '別の国から来た一人の読み手は'],
      ['did not understand the word', 'その語が分かりませんでした（何を表す語かは次へ）'],
      ['for a shelter', '避難所を表す'],
    ],
    notes: {
      'A reader from another country': 'from another country は reader を後ろから説明して「別の国から来た読み手」。',
      'for a shelter': 'the word for 〜 で「〜を表す語」。shelter は「避難所」。',
    },
  }),
  st('[S The team] [M then] [V added] [O pictures] [M {前| near the important terms}].', {
    chunks: [
      ['The team then added pictures', 'そこでチームは、絵を加えました（どこにかは次へ）'],
      ['near the important terms', '大事な語の近くに'],
    ],
    notes: {
      'The team then added pictures': 'The team は、知らせを書き直している集まりのことです。then は「そこで」。',
      'near the important terms': 'term はここでは「語・用語」。避難所を表す語のような大事な語のそばに、絵を置いたということです。',
    },
  }),
  st('[S Translation alone] [V did not solve] [O the problem].', {
    chunks: [
      ['Translation alone', '翻訳だけでは'],
      ['did not solve the problem', 'その問題は解決しませんでした'],
    ],
    notes: {
      'Translation alone': '名詞のすぐ後ろの alone は「〜だけ」。Translation alone で「翻訳だけ（では）」。',
      'did not solve the problem': 'solve は「解決する」。',
    },
  }),
  st('[S The town] [V needed] [O people {関係>people| [S who] [V could interpret] [M {前| in the shelter itself}]}].', {
    chunks: [
      ['The town needed people', '町は、人を必要としていました（どんな人かは次へ）'],
      ['who could interpret in the shelter itself', '避難所そのもので通訳できる'],
    ],
    notes: {
      'who could interpret in the shelter itself': 'interpret は「通訳する」。itself は the shelter を強めて「避難所そのもの（の中）で」。',
    },
  }),
  st('[S Twelve residents] [V joined] [O a training course] [M {前| after their own working hours}].', {
    chunks: [
      ['Twelve residents joined a training course', '12人の住民が、研修の講座に参加しました（いつかは次へ）'],
      ['after their own working hours', '自分の仕事が終わったあとに'],
    ],
    notes: {
      'Twelve residents joined a training course': 'training course は「研修の講座」。join は「〜に加わる・参加する」。',
      'after their own working hours': 'working hours は「勤務時間」。their own は「（それぞれ）自分の」。',
    },
  }),
  st('[S They] [V practice] [O the phrases {前| for {並列| medical help, | food | and lost family members}}].', {
    chunks: [
      ['They practice the phrases', '彼らは、言い回しを練習します（何のためのかは次へ）'],
      ['for medical help, food and lost family members', '医療の助け・食べ物・行方の分からない家族のための'],
    ],
    notes: {
      'They practice the phrases': 'phrase は「言い回し・決まった言い方」。',
      'for medical help, food and lost family members': 'for の後ろに三つが並びます。lost family members は、行方が分からなくなった家族のことです。',
    },
  }),
  st('[S Many {前| of them}] [V remember] [O the same {並列| confusion | and anxiety} {前| in their first year}].', {
    chunks: [
      ['Many of them', '彼らの多くは'],
      ['remember the same confusion and anxiety', '同じ混乱と不安を覚えています（いつのかは次へ）'],
      ['in their first year', '自分たちの最初の年の'],
    ],
    notes: {
      'Many of them': 'them は前の文の12人の住民を指します。',
      'remember the same confusion and anxiety': 'confusion は「混乱」、anxiety は「不安」。the same は、いま外国出身の住民が感じているのと同じ、ということです。',
      'in their first year': '自分たちが（ここに来て）最初の年に感じた混乱と不安、ということです。',
    },
  }),
  st('[S The most useful work] [V happens] [M {前| before a disaster}].', {
    chunks: [
      ['The most useful work happens', 'いちばん役に立つ働きは、行われます（いつかは次へ）'],
      ['before a disaster', '災害の前に'],
    ],
    notes: {
      'The most useful work happens': 'the most useful は useful の最上級で「いちばん役に立つ」。happen は「起こる・行われる」。',
      'before a disaster': '災害が起きてからではなく、その前の備えが大切だということです。',
    },
  }),
  st('[S The group] [V visits] [O {並列| language classes | and local organizations}] [M every spring].', {
    chunks: [
      ['The group visits language classes and local organizations', 'その集まりは、語学教室と地元の団体を訪ねます'],
      ['every spring', '毎年春に'],
    ],
    notes: {
      'The group visits language classes and local organizations': 'language class は、外国出身の人が日本語などを学ぶ「語学教室」。organization は「団体・組織」。',
    },
  }),
  st('[S Volunteers] [V explain] [O the meaning {前| of the local warning levels}].', {
    chunks: [
      ['Volunteers explain the meaning', 'ボランティアが、意味を説明します（何のかは次へ）'],
      ['of the local warning levels', '地域の警報の段階の'],
    ],
    notes: {
      'of the local warning levels': 'warning level は「警報の段階（レベル）」。',
    },
  }),
  st('[S They] [V confirm] [O the nearest shelter] [M {前| with each family}].', {
    chunks: [
      ['They confirm the nearest shelter', '彼らは、最寄りの避難所を確かめます（だれとかは次へ）'],
      ['with each family', 'それぞれの家庭といっしょに'],
    ],
    notes: {
      'They confirm the nearest shelter': 'confirm は「確かめる」。nearest は near の最上級で「いちばん近い」＝最寄りの。',
    },
  }),
  st('[S A simple picture map] [V is] [M now] [M {前| on the wall {前| in many homes}}].', {
    chunks: [
      ['A simple picture map', '簡単な絵の地図が'],
      ['is now on the wall', '今では壁に貼ってあります（どこのかは次へ）'],
      ['in many homes', '多くの家の'],
    ],
    notes: {
      'A simple picture map': 'picture map は、絵で道や場所を示した地図です。',
      'is now on the wall': 'be ＋ 場所 で「〜にある」。now は「今では」。',
    },
  }),
  st('[M Two years later], [S a second typhoon] [V tested] [O the new system].', {
    chunks: [
      ['Two years later,', '2年後'],
      ['a second typhoon tested the new system', '二つ目の台風が、その新しい仕組みを試しました'],
    ],
    notes: {
      'a second typhoon tested the new system': 'test はここでは「（本当に役立つかを）試す」。台風が来て、新しい仕組みが実際に役立つかが確かめられたということです。system は「仕組み」。',
    },
  }),
  st('[S Most {前| of the foreign residents}] [V left] [O their homes] [M {前| on time}].', {
    chunks: [
      ['Most of the foreign residents', '外国出身の住民の大半は'],
      ['left their homes on time', '時間どおりに家を出ました'],
    ],
    notes: {
      'Most of the foreign residents': 'most of the 〜 で「〜の大部分」。',
      'left their homes on time': 'left は leave（出る・離れる）の過去形。on time は「時間どおりに」で、避難が間に合ったということです。',
    },
  }),
  st('[S Some elderly Japanese neighbors] [M also] [V used] [O the easy notices].', {
    chunks: [
      ['Some elderly Japanese neighbors', '年配の日本人の隣人の一部も'],
      ['also used the easy notices', 'そのやさしい知らせを使いました'],
    ],
    notes: {
      'Some elderly Japanese neighbors': 'elderly は「年配の」。neighbor は「近所の人」。',
      'also used the easy notices': 'also は「〜も」で、外国出身の住民だけでなく年配の日本人も、ということです。the easy notices は、やさしい日本語で書き直した知らせです。',
    },
  }),
  st('[S Awareness {前| of simple wording}] [V grew] [M {前| across the whole town}].', {
    chunks: [
      ['Awareness of simple wording grew', '分かりやすい言い方への意識が、広がりました（どこにかは次へ）'],
      ['across the whole town', '町全体に'],
    ],
    notes: {
      'Awareness of simple wording grew': 'awareness は「意識・気づき」。wording は「言葉の選び方・言い方」。grow はここでは「広がる・高まる」。',
      'across the whole town': 'across は「〜じゅうに」。',
    },
  }),
  st('[S The town office] [V noticed] [O {that節| [接 that] [S simple language] [V helps] [O everyone]}].', {
    chunks: [
      ['The town office noticed that', '町役場は〜と気づきました（内容は次へ）'],
      ['simple language helps everyone', 'やさしい言葉はみんなを助ける（と）'],
    ],
    notes: {
      'simple language helps everyone': '気づいた内容はいつでも当てはまることなので、that 節の中は現在形 helps です。',
    },
  }),
  st('[S Simple language] [V is not] [C a service {前| for foreign residents alone}].', {
    chunks: [
      ['Simple language is not a service', 'やさしい言葉は、サービスではありません（だれのためのかは次へ）'],
      ['for foreign residents alone', '外国出身の住民だけのための'],
    ],
    notes: {
      'Simple language is not a service': 'service はここでは「（相手のための）サービス・支援」。',
      'for foreign residents alone': 'alone は foreign residents の後ろについて「〜だけ」。not と合わせて「外国出身の住民だけのためのものではない」となります。',
    },
  }),
  st('[S The group] [M still] [V reports] [O serious limits].', {
    chunks: [
      ['The group still reports serious limits', 'その集まりは、今も深刻な限界があると伝えています'],
    ],
    notes: {
      'The group still reports serious limits': 'still は「今も」。limit は「限界」、serious は「深刻な」。ここから、うまくいかない点が続きます。',
    },
  }),
  st('[S A rare language] [V has] [O no interpreter] [M {前| in the town}] [M {前| at all}].', {
    chunks: [
      ['A rare language has no interpreter', '珍しい言語には、通訳がいません（どこにかは次へ）'],
      ['in the town at all', '町にはまったく'],
    ],
    notes: {
      'A rare language has no interpreter': 'rare は「珍しい・まれな」で、話す人の少ない言語のことです。interpreter は「通訳（する人）」。',
      'in the town at all': 'at all は no や not と結びついて「まったく（〜ない）」と否定を強めます。',
    },
  }),
  st('[S A phone {前| without power}] [V cannot show] [O the translation].', {
    chunks: [
      ['A phone without power', '電源のない電話は'],
      ['cannot show the translation', '翻訳を表示できません'],
    ],
    notes: {
      'A phone without power': 'without power は phone を後ろから説明して「電源のない電話」。災害で電気が止まったときのことです。',
      'cannot show the translation': 'show はここでは「（画面に）表示する」。',
    },
  }),
  st('[S An urgent message] [V may reach] [O a person {関係>a person| [S who] [V cannot read] [O the local script]}].', {
    chunks: [
      ['An urgent message may reach a person', '緊急の知らせが、人に届くかもしれません（どんな人かは次へ）'],
      ['who cannot read the local script', '地元の文字を読めない'],
    ],
    notes: {
      'An urgent message may reach a person': 'may は「〜かもしれない」。',
      'who cannot read the local script': 'script はここでは「文字」。the local script は、その土地で使われている文字のことです。',
    },
  }),
  st('[S The group] [M therefore] [V relies] [M {前| on the network {前| of neighbors}}] [M {前| in the end}].', {
    chunks: [
      ['The group therefore relies', 'そこでその集まりは、頼ります（何にかは次へ）'],
      ['on the network of neighbors', '近所の人のつながりに'],
      ['in the end', '最後には'],
    ],
    notes: {
      'The group therefore relies': 'therefore は「それゆえ・そこで」で、前の文までの限界を受けます。rely on 〜 で「〜に頼る」。',
      'on the network of neighbors': 'network はここでは「（人と人の）つながり」。',
      'in the end': 'in the end は「最後には・結局は」。',
    },
  }),
  st('[S They] [V argue] [O {that節| [接 that] [S real safety] [V grows] [M {前| from contact {前| between people} {前| in ordinary times}}]}].', {
    chunks: [
      ['They argue that', '彼らは〜と主張します（内容は次へ）'],
      ['real safety grows', '本当の安全は育つ（何からかは次へ）'],
      ['from contact between people in ordinary times', 'ふだんの、人と人とのふれあいから（と）'],
    ],
    notes: {
      'They argue that': 'argue that 〜 で「〜だと主張する」。They はこの集まりの人たちで、ここが文章全体の結論です。',
      'real safety grows': 'grow はここでは「（少しずつ）育つ」。',
      'from contact between people in ordinary times': 'contact は「接触・ふれあい」。between people は「人と人との」、in ordinary times は「ふだんの（災害のないときの）」。',
    },
  }),
])
