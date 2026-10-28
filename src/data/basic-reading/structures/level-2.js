// 基礎長文・2級の構造台帳（本文の順に1文ずつ）。書き方は entry.js と長文の構造台帳を見る。
import { bs } from './entry.js'

export const BASIC_READING_STRUCTURES_2 = Object.freeze({
  br2_renewable_energy: Object.freeze([
    bs(`[M {前| For a long time}], [S most {前| of the world's electricity}] [V has been produced] [M {前| by {動名詞| [V burning] [O {並列| coal, | oil, | and gas}]}}].`, {
      chunks: [
        ['For a long time,', '長い間'],
        ["most of the world's electricity", '世界の電気のほとんどは'],
        ['has been produced', 'つくられてきました'],
        ['by burning coal, oil, and gas.', '石炭・石油・ガスを燃やすことで'],
      ],
    }),
    bs('[M However], [S {動名詞| [V burning] [O these fuels]}] [V creates] [O large amounts {前| of emissions}, {関係,>emissions| [S which] [V are] [C one {前| of the main causes {前| of global warming}}]}].', {
      chunks: [
        ['However, burning these fuels creates', 'しかし、これらの燃料を燃やすと生まれます'],
        ['large amounts of emissions,', '大量の排出ガスが'],
        ['which are one of the main causes', 'それはおもな原因の一つです'],
        ['of global warming.', '地球温暖化の'],
      ],
      notes: {
        'which are one of the main causes': 'コンマのあとの which は、前の emissions を受けて説明を足します。',
      },
    }),
    bs('[M {to:副詞(目的)| [V To deal with] [O this problem]}], [S many countries] [V are turning] [M {前| to renewable energy, {前| such as {並列| solar | and wind} power}}].', {
      chunks: [
        ['To deal with this problem,', 'この問題に対処するために'],
        ['many countries are turning', '多くの国が目を向けています'],
        ['to renewable energy,', '再生可能エネルギーに'],
        ['such as solar and wind power.', '太陽光や風力のような'],
      ],
      notes: {
        'To deal with this problem,': '段落ごとの役割は、問題→解決策→限界→今後、と並びます。この段落は解決策を示します。',
      },
      rules: ['paragraph-map'],
    }),
    bs('[S These sources] [V will] [M never] [V run out], [接 and] [S they] [V generate] [O very few emissions].', {
      chunks: [
        ['These sources will never run out,', 'これらのエネルギー源はなくなることがありません'],
        ['and they generate very few emissions.', 'そして排出ガスをほとんど出しません'],
      ],
    }),
    bs('[M {前| In addition}], [S solar panels] [V have become] [C much cheaper {副詞節:比較| [接 than] [S they] [V were] [M ten years ago]}], [接 so] [S more {並列| homes | and companies}] [V can afford] [O them].', {
      chunks: [
        ['In addition,', 'さらに'],
        ['solar panels have become much cheaper', '太陽光パネルはずっと安くなりました'],
        ['than they were ten years ago,', '10年前よりも'],
        ['so more homes and companies', 'だから、より多くの家庭や会社が'],
        ['can afford them.', 'それを買えます'],
      ],
      notes: {
        'than they were ten years ago,': '比べているのは今の太陽光パネルと10年前の太陽光パネルで、比べる点は値段です。were の後ろに cheap が省略されています。',
      },
      rules: ['comparison-pairs'],
    }),
    bs('[S Renewable energy] [M also] [V has] [O some weak points].', {
      chunks: [
        ['Renewable energy also has', '再生可能エネルギーにもあります'],
        ['some weak points.', 'いくつかの弱点が'],
      ],
      notes: {
        'some weak points.': 'この段落は、解決策にも限界（弱点）があることを示す役割です。',
      },
      rules: ['paragraph-map'],
    }),
    bs('[M {副詞節:理由| [接 Because] [S {並列| solar | and wind} power] [V depend on] [O the weather]}], [S they] [V cannot] [M always] [V provide] [O a steady supply {前| of electricity}].', {
      chunks: [
        ['Because solar and wind power', '太陽光や風力は'],
        ['depend on the weather,', '天気に左右されるので'],
        ['they cannot always provide', 'いつも供給できるとは限りません'],
        ['a steady supply of electricity.', '安定した電気を'],
      ],
      notes: {
        'depend on the weather,': 'Because の後ろが原因（天気に左右される）、後半が結果（いつも安定して供給できるとは限らない）です。',
      },
      rules: ['cause-result', 'paragraph-map'],
    }),
    bs('[M {前| On {並列| cloudy days | or calm nights}}], [S other sources] [V must be used] [M instead].', {
      chunks: [
        ['On cloudy days or calm nights,', 'くもりの日や風のない夜には'],
        ['other sources must be used', 'ほかのエネルギー源が使われなければなりません'],
        ['instead.', '代わりに'],
      ],
      rules: ['paragraph-map'],
    }),
    bs('[M {to:副詞(目的)| [V To solve] [O this problem]}], [S engineers] [V are developing] [O better batteries {関係>better batteries| [S that] [V can store] [O extra electricity] [M {前| for later use}]}].', {
      chunks: [
        ['To solve this problem,', 'この問題を解決するために'],
        ['engineers are developing', '技術者は開発しています'],
        ['better batteries', 'よりよい電池を'],
        ['that can store extra electricity', '余った電気をためられる'],
        ['for later use.', 'あとで使うために'],
      ],
    }),
    bs('[M {副詞節:条件| [接 If] [S such technology] [V improves]}], [S renewable energy] [V may become] [C the main source {前| of electricity} {前| in many countries}, {前| including Japan}].', {
      chunks: [
        ['If such technology improves,', 'もしこうした技術が進めば'],
        ['renewable energy may become', '再生可能エネルギーはなるかもしれません'],
        ['the main source of electricity', '電気のおもな供給源に'],
        ['in many countries, including Japan.', '日本をふくむ多くの国で'],
      ],
    }),
    bs('[S Some experts] [M also] [V point out] [O a drawback]: [S {動名詞| [V building] [O large solar farms]}] [M sometimes] [V requires] [O {動名詞| [V cutting down] [O forests, {関係,>forests| [S which] [V can damage] [O local ecosystems]}]}].', {
      chunks: [
        ['Some experts also point out', '指摘する専門家もいます'],
        ['a drawback:', '欠点を'],
        ['building large solar farms', '大きな太陽光発電所を建てることは'],
        ['sometimes requires cutting down forests,', 'ときに森林を切りひらく必要があります'],
        ['which can damage local ecosystems.', 'そしてそれは地域の生態系を傷つけることがあります'],
      ],
      marks: [[':', '前の「欠点」が何かを、コロンの後ろで具体的に説明します。']],
    }),
    bs('[M Therefore], [S governments] [V need] [O a comprehensive plan {関係>a comprehensive plan| [S that] [V balances] [O clean energy] [M {前| with the conservation {前| of nature}}]}].', {
      chunks: [
        ['Therefore, governments need', 'そのため、政府には必要です'],
        ['a comprehensive plan', '総合的な計画が'],
        ['that balances clean energy', 'きれいなエネルギーをつり合わせる'],
        ['with the conservation of nature.', '自然の保護と'],
      ],
    }),
    bs('[S Experts] [V predict] [O {that節| [接 that] [S the share {前| of renewable energy}] [V will continue] [O {to:名詞| [V to expand]}] [M {前| over the next decade}]}].', {
      chunks: [
        ['Experts predict', '専門家は予測しています'],
        ['that the share of renewable energy', '再生可能エネルギーの割合が'],
        ['will continue to expand', '広がり続けると'],
        ['over the next decade.', 'これからの10年で'],
      ],
    }),
  ]),
  br2_antibiotics: Object.freeze([
    bs('[M {前| Before the twentieth century}], [S a small cut] [V could] [M sometimes] [V kill] [O a person].', {
      chunks: [
        ['Before the twentieth century,', '20世紀より前には'],
        ['a small cut could sometimes kill', '小さな切り傷がときに死なせることがありました'],
        ['a person.', '人を'],
      ],
    }),
    bs('[S This] [V was] [C {副詞節:理由| [接 because] [S the wound] [V could become] [C infected] [M {前| by bacteria, {同格>bacteria| tiny living things {関係>tiny living things| [S that] [V cause] [O many kinds {前| of illness}]}}}]}].', {
      chunks: [
        ['This was because the wound', 'これは、傷が〜だったからです'],
        ['could become infected by bacteria,', '細菌に感染することがあった'],
        ['tiny living things', 'つまり、とても小さな生き物で'],
        ['that cause many kinds of illness.', 'いろいろな病気を引き起こす'],
      ],
      notes: {
        'tiny living things': 'コンマのあとが bacteria の言いかえ（同格）です。知らない語は、この言いかえから意味を推測します。',
      },
      rules: ['unknown-word-context'],
    }),
    bs('[M {前| In 1928}], [S the first antibiotic, {同格>the first antibiotic| penicillin},] [V was discovered] [M {前| by a British scientist {過去分詞>a British scientist| [V named] [C Alexander Fleming]}}].', {
      chunks: [
        ['In 1928,', '1928年'],
        ['the first antibiotic, penicillin,', '最初の抗生物質であるペニシリンが'],
        ['was discovered', '発見されました'],
        ['by a British scientist', 'イギリスの科学者によって'],
        ['named Alexander Fleming.', 'アレクサンダー・フレミングという名前の'],
      ],
      notes: {
        'was discovered': 'be＋過去分詞の受け身です。by 以下を主語にすると「フレミングがペニシリンを発見した」となります。',
      },
      rules: ['passive-active'],
    }),
    bs('[S Antibiotics] [V are] [C medicines {関係>medicines| [S that] [V kill] [O bacteria] [接 or] [V stop] [O them] [M {前| from {動名詞| [V growing]}}]}].', {
      chunks: [
        ['Antibiotics are medicines', '抗生物質は薬です'],
        ['that kill bacteria', '細菌を殺す'],
        ['or stop them from growing.', 'あるいは細菌が増えるのを止める'],
      ],
    }),
    bs('[M {前| Since then}], [S they] [V have saved] [O millions {前| of lives}].', {
      chunks: [
        ['Since then,', 'それ以来'],
        ['they have saved millions of lives.', '抗生物質は何百万もの命を救ってきました'],
      ],
    }),
    bs('[M However], [M not] [S all illnesses] [V can be treated] [M {前| with antibiotics}].', {
      chunks: [
        ['However, not all illnesses', 'しかし、すべての病気が〜というわけではありません'],
        ['can be treated with antibiotics.', '抗生物質で治せる'],
      ],
      notes: {
        'However, not all illnesses': 'not all は部分否定で、「すべての病気が治せるわけではない」。治せる病気もあります。',
      },
      rules: ['negation-scope'],
    }),
    bs('[M {前| For example}], [S colds] [V are caused] [M {前| by viruses}], [接 and] [S antibiotics] [V do not work] [M {前| against viruses}].', {
      chunks: [
        ['For example,', 'たとえば'],
        ['colds are caused by viruses,', 'かぜはウイルスによって起こります'],
        ['and antibiotics do not work', 'そして抗生物質は効きません'],
        ['against viruses.', 'ウイルスには'],
      ],
      rules: ['negation-scope'],
    }),
    bs('[M Even so], [S some people] [V take] [O antibiotics] [M {副詞節:時| [接 when] [S they] [V have] [O a cold]}], [接 and] [S this] [V creates] [O a serious problem].', {
      chunks: [
        ['Even so,', 'それでも'],
        ['some people take antibiotics', '抗生物質を飲む人がいます'],
        ['when they have a cold,', 'かぜをひいたときに'],
        ['and this creates a serious problem.', 'そしてこれが深刻な問題を生んでいます'],
      ],
    }),
    bs('[M {副詞節:時| [接 When] [S antibiotics] [V are used] [M too often]}], [S some bacteria] [V survive] [接 and] [V become] [C resistant {前| to them}].', {
      chunks: [
        ['When antibiotics are used too often,', '抗生物質が使われすぎると'],
        ['some bacteria survive', '生き残る細菌が出てきます'],
        ['and become resistant to them.', 'そして抗生物質が効かなくなります'],
      ],
    }),
    bs('[S Doctors] [V are] [C worried] [M {that節| [接 that] [M {前| in the future}], [S common infections] [V may become] [C difficult {to:副詞(形容詞)| [V to treat]}]}].', {
      chunks: [
        ['Doctors are worried', '医者たちは心配しています'],
        ['that in the future,', '将来'],
        ['common infections may become', 'よくある感染症がなるかもしれないと'],
        ['difficult to treat.', '治しにくく'],
      ],
    }),
    bs('[M {前| For this reason}], [S patients] [V should take] [O antibiotics] [M only] [M {副詞節:時| [接 when] [S a doctor] [V tells] [O them] [C to]}].', {
      chunks: [
        ['For this reason,', 'そのため'],
        ['patients should take antibiotics', '患者は抗生物質を飲むべきです'],
        ['only when a doctor tells them to.', '医者に言われたときだけ'],
      ],
      notes: {
        'only when a doctor tells them to.': '最後の to は to take antibiotics の省略です。くり返しをさけて to だけを残しています。',
      },
    }),
    bs('[S This problem] [V is] [M now] [V considered] [C one {前| of the biggest threats {前| to public health}}].', {
      chunks: [
        ['This problem is now considered', 'この問題は今、考えられています'],
        ['one of the biggest threats', 'もっとも大きな脅威の一つだと'],
        ['to public health.', '公衆衛生への'],
      ],
    }),
    bs('[S Scientists] [V are working] [M {to:副詞(目的)| [V to develop] [O new medicines]}], [接 but] [S the process] [V takes] [O many years] [接 and] [V requires] [O a huge budget].', {
      chunks: [
        ['Scientists are working', '科学者は取り組んでいます'],
        ['to develop new medicines,', '新しい薬を開発するために'],
        ['but the process takes many years', 'しかし、その過程には何年もかかります'],
        ['and requires a huge budget.', 'そしてばく大な予算が必要です'],
      ],
    }),
    bs('[M Meanwhile], [S {並列| {動名詞| [V washing] [O our hands]} | and {動名詞| [V getting] [O vaccines]}}] [V can prevent] [O infections] [M {前| in the first place}], [M {関係,>前の内容| [S which] [V reduces] [O the need {前| for antibiotics}]}].', {
      chunks: [
        ['Meanwhile,', 'その間にも'],
        ['washing our hands and getting vaccines', '手を洗うこととワクチンを受けることは'],
        ['can prevent infections', '感染を防ぐことができます'],
        ['in the first place,', 'そもそも'],
        ['which reduces the need', 'そしてそれは必要を減らします'],
        ['for antibiotics.', '抗生物質の'],
      ],
      notes: {
        'which reduces the need': 'コンマのあとの which は、前の文の内容全体（感染を防げること）を受けています。',
      },
    }),
    bs('[S Some physicians] [M also] [V say] [O {that節| [接 that] [S patients] [M sometimes] [V insist on] [O {動名詞| [V getting] [O antibiotics]}] [M {副詞節:譲歩| [接 even when] [S they] [V are not] [C necessary]}]}].', {
      chunks: [
        ['Some physicians also say', '言う医師もいます'],
        ['that patients sometimes insist', '患者がときに言いはると'],
        ['on getting antibiotics', '抗生物質をもらうことを'],
        ['even when they are not necessary.', '必要がないときでさえ'],
      ],
    }),
  ]),
  br2_false_news: Object.freeze([
    bs('[M Today], [S many young people] [V get] [O news] [M {前| from social media}] [M {前| rather than {前| from {並列| newspapers | or television}}}].', {
      chunks: [
        ['Today, many young people get news', '今では、多くの若者がニュースを得ています'],
        ['from social media', 'ソーシャルメディアから'],
        ['rather than from newspapers or television.', '新聞やテレビよりも'],
      ],
    }),
    bs('[S Social media] [V is] [C {並列| fast | and convenient}], [接 but] [S it] [M also] [V has] [O a dark side]: [S misinformation] [V can spread] [M very quickly].', {
      chunks: [
        ['Social media is fast and convenient,', 'ソーシャルメディアは速くて便利です'],
        ['but it also has a dark side:', 'しかし、暗い面もあります'],
        ['misinformation can spread', '誤った情報が広まることがあるのです'],
        ['very quickly.', 'とても速く'],
      ],
      marks: [[':', '前の「暗い面」が何かを、コロンの後ろで説明します（誤った情報が速く広まること）。']],
    }),
    bs('[S One study] [V found] [O {that節| [接 that] [S false news] [V spread] [M faster {前| than true news}] [M {前| on social media}]}].', {
      chunks: [
        ['One study found', 'ある研究で分かりました'],
        ['that false news spread faster', 'うそのニュースのほうが速く広まったことが'],
        ['than true news', '本当のニュースよりも'],
        ['on social media.', 'ソーシャルメディア上では'],
      ],
      notes: {
        'One study found': 'One study found は「ある研究で分かった」。いつもそうだ（always）とまでは言っていません。',
      },
      rules: ['distractor-strength'],
    }),
    bs('[S This] [V may be] [C {副詞節:理由| [接 because] [S false stories] [V are] [M often] [C more surprising], [接 and] [S people] [V like] [O {to:名詞| [V to share] [O surprising things]}]}].', {
      chunks: [
        ['This may be because', 'これは〜だからかもしれません'],
        ['false stories are often more surprising,', 'うその話のほうがおどろくような内容であることが多く'],
        ['and people like to share', 'そして人は伝えたがる'],
        ['surprising things.', 'おどろくようなことを'],
      ],
      rules: ['distractor-strength'],
    }),
    bs('[S Some people] [V argue] [O {that節| [接 that] [S social media companies] [V should remove] [O all false information]}].', {
      chunks: [
        ['Some people argue', '主張する人もいます'],
        ['that social media companies', 'ソーシャルメディアの会社が'],
        ['should remove all false information.', 'うその情報をすべて取り除くべきだと'],
      ],
      notes: {
        'Some people argue': 'ほかの人の意見を紹介する合図です。筆者の意見は In my view から始まります。',
      },
      rules: ['author-stance'],
    }),
    bs('[S Others] [V say] [O {並列| {that節| [接 that] [仮S it] [V is] [C difficult] [真S {to:名詞| [V to decide] [O {並列| {what節| [S what] [V is] [C true]} | and {what節| [S what] [V is] [M not]}}]}]}, | and {that節| [接 that] [S {動名詞| [V removing] [O posts]}] [V may limit] [O free speech]}}].', {
      chunks: [
        ['Others say', 'ほかの人は言います'],
        ['that it is difficult to decide', '決めるのはむずかしいと'],
        ['what is true and what is not,', '何が本当で何がそうでないかを'],
        ['and that removing posts', 'そして投稿を消すことは'],
        ['may limit free speech.', '言論の自由を制限するかもしれないと'],
      ],
      rules: ['author-stance'],
    }),
    bs('[M {前| In my view}], [S the most effective solution] [V is] [C education].', {
      chunks: [
        ['In my view,', 'わたしの考えでは'],
        ['the most effective solution', 'もっとも効果的な解決策は'],
        ['is education.', '教育です'],
      ],
      notes: {
        'In my view,': 'In my view から、筆者自身の意見が始まります。',
      },
      rules: ['author-stance'],
    }),
    bs('[S Schools] [V should teach] [O1 students] [O2 {並列| {疑問詞to| [M how] [V to check] [O {疑問詞節| [M where] [S information] [V comes from]}]} | and {whether節| [接 whether] [S it] [V is supported] [M {前| by evidence}]}}].', {
      chunks: [
        ['Schools should teach students', '学校は生徒に教えるべきです'],
        ['how to check', '確かめる方法を'],
        ['where information comes from', '情報がどこから来たのか'],
        ['and whether it is supported', 'そしてそれが支えられているかどうかを'],
        ['by evidence.', '証拠に'],
      ],
      notes: {
        'Schools should teach students': '筆者が学校にすべきだと考えていることの根拠になる文です。設問の schools should と同じ語を本文から探します。',
      },
      rules: ['evidence-backtrack', 'author-stance'],
    }),
    bs('[M {副詞節:条件| [接 If] [S young people] [V learn] [O these skills]}], [S they] [V will be] [C less likely {to:副詞(形容詞)| [V to {並列| believe | or share}] [O false news]}].', {
      chunks: [
        ['If young people learn these skills,', '若者がこうした技能を身につければ'],
        ['they will be less likely', 'しにくくなるでしょう'],
        ['to believe or share false news.', 'うそのニュースを信じたり広めたり'],
      ],
      rules: ['distractor-strength'],
    }),
    bs('[S Each {前| of us}] [V should] [M also] [V stop] [接 and] [V think] [M {副詞節:時| [接 before] [S we] [V share] [O something] [M online]}].', {
      chunks: [
        ['Each of us should also', 'わたしたち一人一人もするべきです'],
        ['stop and think', '立ち止まって考えることを'],
        ['before we share something online.', 'ネットで何かを広める前に'],
      ],
    }),
    bs('[S This kind {前| of education}] [V is] [M often] [V called] [C media literacy], [接 and] [S some countries] [M already] [V include] [O it] [M {前| in their school curriculum}].', {
      chunks: [
        ['This kind of education', 'この種類の教育は'],
        ['is often called media literacy,', 'メディアリテラシーと呼ばれることが多いです'],
        ['and some countries already include it', 'そしてすでにそれを取り入れている国もあります'],
        ['in their school curriculum.', '学校の教育課程に'],
      ],
    }),
    bs('[M {前| In the digital age}], [S the ability {to:形容詞>the ability| [V to evaluate] [O information] [M carefully]}] [V may be] [C just as important {前| as the ability {to:形容詞>the ability| [V to {並列| read | and write}]}}].', {
      chunks: [
        ['In the digital age,', 'デジタルの時代には'],
        ['the ability to evaluate information', '情報を評価する力が'],
        ['carefully', '注意深く'],
        ['may be just as important', 'ちょうど同じくらい大切かもしれません'],
        ['as the ability to read and write.', '読み書きの力と'],
      ],
    }),
    bs('[S False information] [V can] [M also] [V cause] [O real harm]; [M {前| for example}], [S misleading posts {前| about health}] [V have led] [O some people] [C {to:補語| [V to avoid] [O vaccines]}].', {
      chunks: [
        ['False information can also cause', 'うその情報はもたらすこともあります'],
        ['real harm;', '実際の害を'],
        ['for example,', 'たとえば'],
        ['misleading posts about health', '健康についての誤解をまねく投稿が'],
        ['have led some people', '一部の人にさせてきました'],
        ['to avoid vaccines.', 'ワクチンを避けることを'],
      ],
      marks: [[';', '前の「実際の害をもたらす」と、後ろのその具体例（ワクチンを避けた人）を、関係の深い二つの文としてつなぎます。']],
    }),
    bs('[S We] [V should not blame] [O only the companies], [M {副詞節:理由| [接 because] [S every user] [V has] [O a responsibility] [M as well]}].', {
      chunks: [
        ['We should not blame', 'わたしたちは責めるべきではありません'],
        ['only the companies,', '会社だけを'],
        ['because every user has', 'なぜなら、利用者一人一人にもあるからです'],
        ['a responsibility as well.', '責任が'],
      ],
    }),
    bs(`[S {動名詞| [V Learning] [O {to:名詞| [V to think] [M carefully] [M {前| about {what節| [O what] [S we] [V read]}}]}]}] [V is] [C vital] [M {前| in today's world}].`, {
      chunks: [
        ['Learning to think carefully', '注意深く考えられるようになることは'],
        ['about what we read', '読んだものについて'],
        ['is vital', 'とても大切です'],
        ["in today's world.", '今の世の中では'],
      ],
    }),
  ]),
  br2_homework: Object.freeze([
    bs('[S Homework] [V has] [M long] [V been] [C a normal part {前| of school life}].', {
      chunks: [
        ['Homework has long been', '宿題は昔から〜でした'],
        ['a normal part of school life.', '学校生活の当たり前の一部'],
      ],
    }),
    bs('[S Many teachers] [V believe] [O {that節| [接 that] [S it] [V helps] [O students] [C {原形| [V review] [O {what節| [O what] [S they] [V have learned] [M {前| in class}]}]}]}].', {
      chunks: [
        ['Many teachers believe', '多くの先生は考えています'],
        ['that it helps students review', 'それは生徒が復習する助けになると'],
        ['what they have learned in class.', '授業で学んだことを'],
      ],
    }),
    bs('[M However], [S some education experts] [M now] [V question] [O {whether節| [接 whether] [S large amounts {前| of homework}] [V are] [M really] [C useful]}].', {
      chunks: [
        ['However, some education experts', 'しかし、教育の専門家の中には'],
        ['now question', '今、疑問に思う人もいます'],
        ['whether large amounts of homework', '大量の宿題が'],
        ['are really useful.', '本当に役に立つのかを'],
      ],
    }),
    bs('[S Too much homework] [V can make] [O students] [C {並列| tired | and stressed}], [接 and] [S it] [V leaves] [O1 them] [O2 little time {前| for {並列| sleep, | sports, | or hobbies}}].', {
      chunks: [
        ['Too much homework', '多すぎる宿題は'],
        ['can make students tired and stressed,', '生徒を疲れさせ、ストレスを感じさせることがあります'],
        ['and it leaves them little time', 'そして生徒にほとんど時間を残しません'],
        ['for sleep, sports, or hobbies.', '睡眠やスポーツ、趣味のための'],
      ],
      notes: {
        'can make students tired and stressed,': 'make＋人＋状態で「人を〜の状態にする」。students が目的語、tired and stressed が補語です。',
      },
      rules: ['svoc-core'],
    }),
    bs('[S Some studies] [V suggest] [O {that節| [接 that], [M {前| for younger students} {前| in particular}], [S more homework] [V does] [M not] [M always] [V lead] [M {前| to better academic results}]}].', {
      chunks: [
        ['Some studies suggest that,', 'いくつかの研究が示しています'],
        ['for younger students in particular,', '特に年下の生徒にとっては'],
        ['more homework does not always lead', '宿題が多いほどつながるとは限らないと'],
        ['to better academic results.', 'よりよい学業の成績に'],
      ],
    }),
    bs('[M {副詞節:譲歩| [接 Although] [S homework] [V has] [O its problems]}], [S I] [V do not think] [O {that省略| [S schools] [V should stop] [O {動名詞| [V giving] [O it]}]}].', {
      chunks: [
        ['Although homework has its problems,', '宿題には問題もありますが'],
        ['I do not think', 'わたしは思いません'],
        ['schools should stop giving it.', '学校が宿題を出すのをやめるべきだとは'],
      ],
      notes: {
        'Although homework has its problems,': 'Although の節は相手の考えを一度認める譲歩です。筆者が重く見るのは後ろの主節です。',
      },
      rules: ['contrast-concession'],
    }),
    bs('[S The key] [V is] [C {to:補語| [V to give] [O the right {並列| kind | and amount} {前| of homework}]}].', {
      chunks: [
        ['The key is', '大切なのは〜です'],
        ['to give the right kind and amount', 'ちょうどよい種類と量を出すこと'],
        ['of homework.', '宿題の'],
      ],
    }),
    bs('[S Short tasks {関係>Short tasks| [S that] [V ask] [O students] [C {to:補語| [V to use] [O new knowledge] [M {前| in their own way}]}]}] [V are] [C more effective {前| than long lists {前| of exercises}}].', {
      chunks: [
        ['Short tasks', '短い課題は'],
        ['that ask students to use new knowledge', '新しい知識を使わせる'],
        ['in their own way', '自分なりのやり方で'],
        ['are more effective', 'より効果的です'],
        ['than long lists of exercises.', '長い練習問題の一覧よりも'],
      ],
    }),
    bs('[S Teachers] [V can] [M also] [V give] [O1 students] [O2 a choice {前| of tasks}] [M {to:副詞(目的)| [V to keep] [O them] [C interested]}].', {
      chunks: [
        ['Teachers can also give students', '先生は生徒にあたえることもできます'],
        ['a choice of tasks', '課題を選ぶ機会を'],
        ['to keep them interested.', '生徒が興味を持ち続けられるように'],
      ],
      notes: {
        'to keep them interested.': '文が完成したあとの to keep は「〜するために」と目的を表します。keep＋人＋状態で「人を〜の状態に保つ」。',
      },
      rules: ['infinitive-role'],
    }),
    bs('[M {前| With well-planned homework}], [S students] [V can learn] [O {to:名詞| [V to study] [M {前| on their own}]}], [M {関係,>前の内容| [S which] [V is] [C a skill {関係省略:目的格>a skill| [S they] [V will need] [M {前| for the rest {前| of their lives}}]}]}].', {
      chunks: [
        ['With well-planned homework,', 'よく考えられた宿題があれば'],
        ['students can learn', '生徒は身につけられます'],
        ['to study on their own,', '自分で勉強することを'],
        ['which is a skill', 'それは技能です'],
        ['they will need', '必要になる'],
        ['for the rest of their lives.', '一生の間'],
      ],
    }),
    bs('[M {前| In the end}], [S homework] [V should support] [O learning] [M {前| rather than {原形| [V become] [C a burden {関係>a burden| [O that] [S students] [V dread] [M every evening]}]}}].', {
      chunks: [
        ['In the end,', '結局のところ'],
        ['homework should support learning', '宿題は学びを支えるべきです'],
        ['rather than become a burden', '重荷になるのではなく'],
        ['that students dread every evening.', '生徒が毎晩おそれる'],
      ],
    }),
    bs('[S {動名詞| [V Finding] [O this balance]}] [V is not] [C easy {前| for teachers}], [接 but] [S it] [V is] [C {成句| worth the effort}].', {
      chunks: [
        ['Finding this balance is not easy', 'このつり合いを見つけるのは簡単ではありません'],
        ['for teachers,', '先生にとって'],
        ['but it is worth the effort.', 'しかし努力する価値があります'],
      ],
    }),
    bs('[S Some schools] [V have] [M even] [V adopted] [O a policy {前| of {動名詞| [V giving] [O no homework] [M {前| on weekends}]}}] [M {副詞節:目的| [接 so that] [S students] [V can rest]}].', {
      chunks: [
        ['Some schools have even adopted', '取り入れた学校さえあります'],
        ['a policy of giving no homework', '宿題を出さないという方針を'],
        ['on weekends', '週末には'],
        ['so that students can rest.', '生徒が休めるように'],
      ],
    }),
    bs('[S Parents] [M also] [V play] [O a vital role] [M {前| by {動名詞| [V showing] [O interest] [M {前| in {what節| [O what] [S their children] [V are learning]}}]}}].', {
      chunks: [
        ['Parents also play a vital role', '保護者も大切な役割を果たします'],
        ['by showing interest', '関心を示すことで'],
        ['in what their children are learning.', '子どもが学んでいることに'],
      ],
    }),
    bs('[M {前| After all}], [S the main aim {前| of homework}] [V should be] [C {to:補語| [V to foster] [O a love {前| of learning}]}].', {
      chunks: [
        ['After all,', 'つまるところ'],
        ['the main aim of homework', '宿題のいちばんの目的は'],
        ['should be to foster', '育てることであるべきです'],
        ['a love of learning.', '学ぶことを好きになる気持ちを'],
      ],
    }),
  ]),
  br2_aging_society: Object.freeze([
    bs('[S Japan] [V has] [O one {前| of the oldest populations {前| in the world}}].', {
      chunks: [
        ['Japan has one', '日本は一つです'],
        ['of the oldest populations', 'もっとも高齢化が進んだ国の'],
        ['in the world.', '世界で'],
      ],
    }),
    bs('[S Nearly 30 percent {前| of the people {現在分詞>the people| [V living] [M {前| in Japan}]}}] [V are] [C {並列| 65 | or older}].', {
      chunks: [
        ['Nearly 30 percent of the people', '人々の30パーセント近くが'],
        ['living in Japan', '日本に住む'],
        ['are 65 or older.', '65歳以上です'],
      ],
      notes: {
        'Nearly 30 percent of the people': '数字の 30 を目印に読み進めると、中心の名詞は percent です。後ろの語句が「何の30パーセントか」を説明しています。',
      },
      rules: ['noun-boundary'],
    }),
    bs('[M {前| At the same time}], [S fewer babies] [V are being born] [M each year].', {
      chunks: [
        ['At the same time,', '同時に'],
        ['fewer babies are being born', '生まれる赤ちゃんは減っています'],
        ['each year.', '毎年'],
      ],
    }),
    bs('[S This situation] [V causes] [O several problems].', {
      chunks: [
        ['This situation causes', 'この状況は引き起こします'],
        ['several problems.', 'いくつかの問題を'],
      ],
      notes: {
        'This situation causes': 'this＋名詞は、前の段落全体の内容（高齢者が多く、生まれる赤ちゃんが減っていること）を指します。',
      },
      rules: ['reference-chain'],
    }),
    bs('[M {副詞節:比例| [接 As] [S the number {前| of workers}] [V decreases]}], [S {並列| many companies, | hospitals, | and stores}] [V have] [O difficulty] [M {動名詞| [V finding] [O enough staff]}].', {
      chunks: [
        ['As the number of workers decreases,', '働く人の数が減るにつれて'],
        ['many companies, hospitals, and stores', '多くの会社や病院、店が'],
        ['have difficulty finding enough staff.', '十分な人手を見つけるのに苦労しています'],
      ],
    }),
    bs('[S The cost {前| of {並列| medical care | and pensions}}] [V is] [M also] [V rising], [接 and] [S younger generations] [V must support] [O it] [M {前| through taxes}].', {
      chunks: [
        ['The cost of medical care and pensions', '医療と年金の費用も'],
        ['is also rising,', '増えています'],
        ['and younger generations must support it', 'そして若い世代がそれを支えなければなりません'],
        ['through taxes.', '税金で'],
      ],
    }),
    bs('[M {to:副詞(目的)| [V To deal with] [O these challenges]}], [S Japan] [V is trying] [O various solutions].', {
      chunks: [
        ['To deal with these challenges,', 'こうした課題に対処するために'],
        ['Japan is trying various solutions.', '日本はさまざまな解決策を試しています'],
      ],
      notes: {
        'To deal with these challenges,': '設問の「どう対処しているか」と同じ内容で始まる段落です。ここからペースを落として読みます。',
      },
      rules: ['reading-mode'],
    }),
    bs('[S Some companies] [M now] [V hire] [O older people {関係>older people| [S who] [V want] [O {to:名詞| [V to keep] [O {動名詞| [V working]}]}] [M {副詞節:時| [接 after] [S they] [V retire]}]}].', {
      chunks: [
        ['Some companies now hire', '今、雇う会社もあります'],
        ['older people', '年配の人を'],
        ['who want to keep working', '働き続けたい'],
        ['after they retire.', '退職したあとも'],
      ],
      rules: ['reading-mode'],
    }),
    bs('[S {並列| Robots | and new technology}] [V are being used] [M {to:副詞(目的)| [V to help] [O {原形| [V care for] [O elderly people]}]}].', {
      chunks: [
        ['Robots and new technology', 'ロボットや新しい技術が'],
        ['are being used', '使われています'],
        ['to help care for elderly people.', 'お年寄りの世話を助けるために'],
      ],
      rules: ['reading-mode'],
    }),
    bs('[S Many towns] [M also] [V run] [O programs {関係>programs| [S that] [V help] [O older residents] [C {原形| [V stay] [C {並列| healthy | and active}]}]}].', {
      chunks: [
        ['Many towns also run programs', '多くの町はプログラムも行っています'],
        ['that help older residents', '年配の住民を助ける'],
        ['stay healthy and active.', '健康で活動的でいられるように'],
      ],
      rules: ['reading-mode'],
    }),
    bs('[S Experts] [M also] [V predict] [O {that節| [接 that] [S the number {前| of people {前| with dementia}}] [V will keep] [O {動名詞| [V rising]}]}], [接 so] [S more {並列| care facilities | and trained staff}] [V will be needed].', {
      chunks: [
        ['Experts also predict', '専門家は予測もしています'],
        ['that the number of people', '人の数が'],
        ['with dementia will keep rising,', '認知症の人の数が増え続けると'],
        ['so more care facilities', 'だから、より多くの介護施設と'],
        ['and trained staff will be needed.', '訓練を受けた職員が必要になるでしょう'],
      ],
    }),
    bs('[S Many older people] [M also] [V have] [O valuable expertise {関係>valuable expertise| [O that] [S they] [V can share] [M {前| with younger workers}]}].', {
      chunks: [
        ['Many older people also have', '多くの年配の人は持ってもいます'],
        ['valuable expertise', '貴重な専門的知識を'],
        ['that they can share', '伝えることができる'],
        ['with younger workers.', '若い働き手に'],
      ],
    }),
    bs('[M {前| In some towns}], [S {並列| children | and elderly residents}] [V take part in] [O activities] [M together], [M {関係,>前の内容| [S which] [V helps] [O {原形| [V reduce] [O isolation]}]}].', {
      chunks: [
        ['In some towns,', 'いくつかの町では'],
        ['children and elderly residents', '子どもと年配の住民が'],
        ['take part in activities together,', 'いっしょに活動に参加します'],
        ['which helps reduce isolation.', 'そしてそれは孤立を減らす助けになります'],
      ],
    }),
    bs('[S A society {前| with many older people}] [V is] [M not] [M only] [C a problem]; [S it] [V can] [M also] [V be] [C a chance {to:形容詞>a chance| [V to create] [O a society {関係>a society| [M where] [S people {前| of all ages}] [V can play] [O an active role]}]}].', {
      chunks: [
        ['A society with many older people', '高齢者の多い社会は'],
        ['is not only a problem;', '問題であるだけではありません'],
        ['it can also be a chance', 'それは機会にもなりえます'],
        ['to create a society', '社会をつくる'],
        ['where people of all ages', 'あらゆる年代の人が'],
        ['can play an active role.', '活躍できる'],
      ],
      marks: [[';', '前の「問題であるだけではない」と、後ろの「機会にもなる」を、関係の深い二つの文としてつなぎます。']],
    }),
  ]),
  br2_four_day_week: Object.freeze([
    bs('[M {前| For many years}], [S most office workers] [V have worked] [M five days] [M a week].', {
      chunks: [
        ['For many years,', '長年'],
        ['most office workers have worked', 'ほとんどの会社員は働いてきました'],
        ['five days a week.', '週5日'],
      ],
    }),
    bs('[M Recently], [M however], [S some companies] [V have been testing] [O a new idea: {同格>a new idea| a four-day work week}].', {
      chunks: [
        ['Recently, however,', 'しかし最近'],
        ['some companies have been testing', '試している会社があります'],
        ['a new idea:', '新しい考えを'],
        ['a four-day work week.', '週4日勤務です'],
      ],
      notes: {
        'some companies have been testing': '新しい考えを試す話のあとには、実例や調査の結果が来ると予測できます。',
      },
      marks: [[':', '前の「新しい考え」が何かを、コロンの後ろで示します（週4日勤務）。']],
      rules: ['genre-prediction'],
    }),
    bs('[M {前| In 2022}], [S {数量| more than 60} British companies] [V took part in] [O a six-month trial].', {
      chunks: [
        ['In 2022,', '2022年には'],
        ['more than 60 British companies', '60社を超えるイギリスの会社が'],
        ['took part in a six-month trial.', '6か月の試験的な取り組みに参加しました'],
      ],
      rules: ['genre-prediction'],
    }),
    bs('[S Their employees] [V worked] [M four days] [M a week] [M {前| without any cut {前| in pay}}].', {
      chunks: [
        ['Their employees worked', 'その社員たちは働きました'],
        ['four days a week', '週4日'],
        ['without any cut in pay.', '給料を減らされることなく'],
      ],
    }),
    bs('[M {前| At the end {前| of the trial}}], [S most {前| of the companies}] [V decided] [O {to:名詞| [V to continue] [O the system]}].', {
      chunks: [
        ['At the end of the trial,', '取り組みの終わりに'],
        ['most of the companies decided', 'ほとんどの会社が決めました'],
        ['to continue the system.', 'この仕組みを続けることを'],
      ],
    }),
    bs('[S Many workers] [V said] [O {that節| [接 that] [S they] [V felt] [O less stress]}], [接 and] [S some employers] [V reported] [O {that節| [接 that] [S fewer workers] [V quit] [O their jobs]}].', {
      chunks: [
        ['Many workers said', '多くの社員は言いました'],
        ['that they felt less stress,', 'ストレスが減ったと'],
        ['and some employers reported', 'そして報告した雇い主もいました'],
        ['that fewer workers quit their jobs.', '辞める社員が減ったと'],
      ],
    }),
    bs('[S Supporters {前| of the idea}] [V believe] [O {that節| [接 that] [S people] [V work] [M more efficiently] [M {副詞節:時| [接 when] [S they] [V have] [O more time {to:形容詞>more time| [V to rest]}]}]}].', {
      chunks: [
        ['Supporters of the idea believe', 'この考えを支持する人は考えています'],
        ['that people work more efficiently', '人はより効率よく働けると'],
        ['when they have more time to rest.', '休む時間が多いほうが'],
      ],
      rules: ['logic-connectors'],
    }),
    bs('[M However], [S the system] [V may not work] [M {前| for every type {前| of business}}].', {
      chunks: [
        ['However, the system may not work', 'しかし、この仕組みはうまくいかないかもしれません'],
        ['for every type of business.', 'あらゆる種類の仕事で'],
      ],
      notes: {
        'However, the system may not work': 'However は、前の「支持する人の考え」と反対の向きの内容を示す接続語です。',
      },
      rules: ['logic-connectors'],
    }),
    bs('[M {前| For example}], [S {並列| hospitals | and stores}] [V need] [O workers] [M every day], [接 so] [仮S it] [V is] [C hard] [真S {前:意味上の主語| for them} {to:名詞| [V to give] [O1 all their staff] [O2 an extra day] [M off]}].', {
      chunks: [
        ['For example,', 'たとえば'],
        ['hospitals and stores need workers', '病院や店では働く人が必要です'],
        ['every day,', '毎日'],
        ['so it is hard for them', 'だから、それらにはむずかしいのです'],
        ['to give all their staff', 'すべての職員にあたえることが'],
        ['an extra day off.', '休みをもう1日'],
      ],
    }),
    bs('[M {前| In Japan}], [M too], [S some employers] [V have introduced] [O flexible styles {前| of work}, {前| such as {動名詞| [V working] [M {前| from home}]}}, {関係,>前の内容| [S which] [V saves] [O1 employees] [O2 a long commute]}].', {
      chunks: [
        ['In Japan, too,', '日本でも'],
        ['some employers have introduced', '取り入れた雇い主がいます'],
        ['flexible styles of work,', '柔軟な働き方を'],
        ['such as working from home,', '在宅勤務のような'],
        ['which saves employees', 'そしてそれは社員にしなくてよくします'],
        ['a long commute.', '長い通勤を'],
      ],
    }),
    bs('[M However], [S such changes] [V require] [O careful management], [M {副詞節:理由| [接 because] [S teams] [M still] [V need] [O {to:名詞| [V to communicate] [M well]}]}].', {
      chunks: [
        ['However, such changes require', 'しかし、こうした変化には必要です'],
        ['careful management,', '注意深い管理が'],
        ['because teams still need', 'なぜなら、チームはやはり必要があるからです'],
        ['to communicate well.', 'うまく連絡を取り合う'],
      ],
    }),
    bs('[S {what節| [S What] [V matters] [M most]}] [V may be] [C {動名詞| [V finding] [O a way {前| of {動名詞| [V working]}} {関係>a way of working| [S that] [V fits] [O {並列| both the company | and its workers}]}]}].', {
      chunks: [
        ['What matters most', 'いちばん大切なことは'],
        ['may be finding', '見つけることかもしれません'],
        ['a way of working', '働き方を'],
        ['that fits both the company', '会社と'],
        ['and its workers.', 'そこで働く人の両方に合う'],
      ],
      notes: {
        'What matters most': 'What から most までがひとかたまりの名詞で、文の主語です。文の動詞は may be です。',
      },
      rules: ['wh-clause'],
    }),
    bs('[M {副詞節:譲歩| [接 No matter] [O which system] [S a company] [V adopts]}], [S employment rules] [V must protect] [O the health {前| of its workers}].', {
      chunks: [
        ['No matter which system', 'どんな仕組みを'],
        ['a company adopts,', '会社が取り入れても'],
        ['employment rules must protect', '雇用のルールは守らなければなりません'],
        ['the health of its workers.', '働く人の健康を'],
      ],
    }),
    bs('[M {前| In the end}], [S a healthy workforce] [V benefits] [O {並列| both employers | and society}] [M {前| as a whole}].', {
      chunks: [
        ['In the end,', '結局'],
        ['a healthy workforce benefits', '健康な働き手は利益をもたらします'],
        ['both employers and society', '雇い主にも社会にも'],
        ['as a whole.', '全体として'],
      ],
    }),
  ]),
  br2_silk_mill: Object.freeze([
    bs('[M About 150 years ago], [S Japan] [V entered] [O a new era] [接 and] [V wanted] [O {to:名詞| [V to become] [C a modern, industrial country] [M as quickly {前| as possible}]}].', {
      chunks: [
        ['About 150 years ago,', '約150年前'],
        ['Japan entered a new era', '日本は新しい時代に入りました'],
        ['and wanted to become', 'そしてなりたいと思っていました'],
        ['a modern, industrial country', '近代的な工業国に'],
        ['as quickly as possible.', 'できるだけ早く'],
      ],
    }),
    bs('[M {to:副詞(目的)| [V To earn] [O money] [M {前| from abroad}]}], [S the government] [V decided] [O {to:名詞| [V to produce] [O more silk, {関係,>more silk| [S which] [V was] [M {前| in great demand}] [M {前| in Europe}]}]}].', {
      chunks: [
        ['To earn money from abroad,', '外国からお金を得るために'],
        ['the government decided', '政府は決めました'],
        ['to produce more silk,', 'もっと生糸をつくることを'],
        ['which was in great demand', 'それは需要が大きかったのです'],
        ['in Europe.', 'ヨーロッパで'],
      ],
    }),
    bs('[M {前| In 1872}], [S the government] [V built] [O the Tomioka Silk Mill {前| in Gunma}, {同格>the Tomioka Silk Mill| a large factory {関係>a large factory| [S that] [V used] [O machines {前| from France}]}}].', {
      chunks: [
        ['In 1872,', '1872年'],
        ['the government built', '政府は建てました'],
        ['the Tomioka Silk Mill in Gunma,', '群馬に富岡製糸場を'],
        ['a large factory', 'つまり大きな工場で'],
        ['that used machines from France.', 'フランスの機械を使う'],
      ],
      notes: {
        'a large factory': 'コンマのあとは the Tomioka Silk Mill の言いかえの補足です。外すと the government built the Tomioka Silk Mill in Gunma が残ります。',
      },
      rules: ['insertion'],
    }),
    bs('[S A French engineer {関係>A French engineer| [S who] [V had] [O experience] [M {前| in the silk industry}]}] [V was invited] [M {to:副詞(目的)| [V to help] [O {原形| [V design] [O it]}]}].', {
      chunks: [
        ['A French engineer', 'フランス人の技術者が'],
        ['who had experience', '経験のある'],
        ['in the silk industry', '絹の産業で'],
        ['was invited', '招かれました'],
        ['to help design it.', 'その設計を手伝うために'],
      ],
      notes: {
        'who had experience': 'who の直前の A French engineer が先行詞です。節の中で had の主語が欠けていて、それが技術者です。',
      },
      rules: ['relative-clause'],
    }),
    bs('[S Many young women {前| from {成句| all over Japan}}] [V came] [M {to:副詞(目的)| [V to work] [M there]}].', {
      chunks: [
        ['Many young women', '多くの若い女性が'],
        ['from all over Japan', '日本中から'],
        ['came to work there.', 'そこで働くためにやって来ました'],
      ],
    }),
    bs('[M {副詞節:時| [接 After] [S they] [V had learned] [O the new techniques]}], [S many {前| of them}] [V returned] [M {前| to their hometowns}] [接 and] [V taught] [O other workers].', {
      chunks: [
        ['After they had learned', '身につけたあと'],
        ['the new techniques,', '新しい技術を'],
        ['many of them returned', '彼女たちの多くは戻りました'],
        ['to their hometowns', '故郷に'],
        ['and taught other workers.', 'そしてほかの働き手に教えました'],
      ],
      notes: {
        'many of them returned': 'After の節をかっこに入れると、many of them … returned … and taught という骨組みが残ります。',
      },
      rules: ['main-clause-skeleton'],
    }),
    bs(`[M {前| In this way}], [S the new methods] [V spread] [M {前| across the country}], [S silk] [V became] [C one {前| of Japan's most important exports}], [接 and] [S the textile industry] [V grew] [M rapidly].`, {
      chunks: [
        ['In this way,', 'このようにして'],
        ['the new methods spread', '新しい方法は広まりました'],
        ['across the country,', '国中に'],
        ['silk became one', '生糸は一つになりました'],
        ["of Japan's most important exports,", '日本のもっとも重要な輸出品の'],
        ['and the textile industry grew rapidly.', 'そして繊維産業は急速に成長しました'],
      ],
    }),
    bs('[S The factory] [V kept] [O {動名詞| [V operating] [M {前| for {数量| more than 100} years}]}] [M {副詞節:時| [接 until] [S it] [V closed] [M {前| in 1987}]}].', {
      chunks: [
        ['The factory kept operating', 'この工場は動き続けました'],
        ['for more than 100 years', '100年を超える間'],
        ['until it closed in 1987.', '1987年に閉じるまで'],
      ],
    }),
    bs(`[M {前| In 2014}], [S it] [V was added] [M {前| to the list {前| of World Heritage Sites}}], [接 and] [M today] [S many tourists] [V visit] [O it] [M {to:副詞(目的)| [V to learn about] [O Japan's history]}].`, {
      chunks: [
        ['In 2014,', '2014年'],
        ['it was added', 'それは加えられました'],
        ['to the list of World Heritage Sites,', '世界遺産の一覧に'],
        ['and today many tourists visit it', 'そして今では多くの観光客が訪れます'],
        ["to learn about Japan's history.", '日本の歴史を学ぶために'],
      ],
    }),
    bs('[S The historic buildings] [V remind] [O visitors] [M {前| of the young workers {関係>the young workers| [S whose skills] [V helped] [O {原形| [V build] [O modern Japan]}]}}].', {
      chunks: [
        ['The historic buildings remind visitors', '歴史ある建物は訪れる人に思い起こさせます'],
        ['of the young workers', '若い働き手たちのことを'],
        ['whose skills helped build modern Japan.', 'その技術が近代日本を築く助けになった'],
      ],
    }),
    bs('[S Visitors] [V can] [M still] [V see] [O the original machines] [接 and] [V learn about] [O the harsh conditions {関係>the harsh conditions| [O that] [S the workers] [M sometimes] [V faced]}].', {
      chunks: [
        ['Visitors can still see', '訪れた人は今でも見ることができます'],
        ['the original machines', '当時の機械を'],
        ['and learn about the harsh conditions', 'そしてきびしい環境について学ぶことができます'],
        ['that the workers sometimes faced.', '働き手がときに直面した'],
      ],
    }),
  ]),
  br2_dolphins: Object.freeze([
    bs('[S Dolphins] [V are known] [M {前| as some {前| of the most intelligent animals {前| on Earth}}}], [M {前| along with apes}].', {
      chunks: [
        ['Dolphins are known', 'イルカは知られています'],
        ['as some of the most intelligent animals', 'もっとも知能の高い動物の一つとして'],
        ['on Earth,', '地球上で'],
        ['along with apes.', '類人猿とならんで'],
      ],
    }),
    bs('[S Scientists {現在分詞>Scientists| [V studying] [O them]}] [V have found] [O several surprising abilities].', {
      chunks: [
        ['Scientists', '科学者たちは'],
        ['studying them', 'イルカを研究している'],
        ['have found several surprising abilities.', 'いくつかのおどろくべき能力を発見してきました'],
      ],
      notes: {
        'studying them': 'Scientists を後ろから「イルカを研究している」と説明しています。文の動詞は have found です。',
        'have found several surprising abilities.': 'several surprising abilities（いくつかのおどろくべき能力）が、あとの段落の具体例をまとめる言葉です。',
      },
      rules: ['postmodifier', 'example-restatement'],
    }),
    bs('[M First], [S dolphins] [V seem] [C {to:補語| [V to recognize] [O themselves]}].', {
      chunks: [
        ['First,', 'まず'],
        ['dolphins seem to recognize themselves.', 'イルカは自分自身を見分けているようです'],
      ],
      rules: ['example-restatement'],
    }),
    bs(`[M {前| In one experiment}], [S researchers] [V put] [O a mark] [M {前| on a dolphin's body}] [接 and] [V placed] [O a mirror] [M {前| in its pool}].`, {
      chunks: [
        ['In one experiment,', 'ある実験で'],
        ['researchers put a mark', '研究者は印を付けました'],
        ["on a dolphin's body", 'イルカの体に'],
        ['and placed a mirror', 'そして鏡を置きました'],
        ['in its pool.', 'プールに'],
      ],
    }),
    bs('[S The dolphin] [V swam] [M {前| to the mirror}] [接 and] [V turned] [O its body] [M {to:副詞(目的)| [V to look at] [O the mark]}], [M {関係,>前の内容| [S which] [V suggests] [O {that節| [接 that] [S it] [V understood] [O {that節| [接 that] [S it] [V was seeing] [O itself]}]}]}].', {
      chunks: [
        ['The dolphin swam to the mirror', 'イルカは鏡のところへ泳いで行きました'],
        ['and turned its body', 'そして体の向きを変えました'],
        ['to look at the mark,', '印を見るために'],
        ['which suggests that it understood', 'これはイルカが分かっていたことを示しています'],
        ['that it was seeing itself.', '自分の姿を見ていると'],
      ],
      notes: {
        'that it was seeing itself.': 'was seeing は be＋-ing の進行形です。名詞を説明する分詞ではありません。',
      },
      rules: ['ing-ed-role'],
    }),
    bs('[S Dolphins] [V can] [M also] [V communicate] [M {前| in complex ways}].', {
      chunks: [
        ['Dolphins can also communicate', 'イルカはまた、伝え合うことができます'],
        ['in complex ways.', '複雑な方法で'],
      ],
      rules: ['example-restatement'],
    }),
    bs('[S Each dolphin] [V makes] [O its own special sound], [接 and] [S other dolphins] [V use] [O this sound] [M {to:副詞(目的)| [V to call] [O it]}], [M almost {前| like a name}].', {
      chunks: [
        ['Each dolphin makes', 'イルカはそれぞれ出します'],
        ['its own special sound,', '自分だけの特別な音を'],
        ['and other dolphins use this sound', 'そしてほかのイルカはその音を使います'],
        ['to call it,', 'そのイルカを呼ぶために'],
        ['almost like a name.', 'まるで名前のように'],
      ],
    }),
    bs('[S Some dolphins] [M even] [V use] [O tools].', {
      chunks: [
        ['Some dolphins even use tools.', '道具を使うイルカさえいます'],
      ],
      rules: ['example-restatement'],
    }),
    bs('[M {前| Off the coast {前| of Western Australia}}], [S some dolphins] [V carry] [O sea sponges] [M {前| on their noses}] [M {副詞節:時| [接 while] [S they] [V search for] [O food] [M {前| on the sea floor}]}].', {
      chunks: [
        ['Off the coast of Western Australia,', '西オーストラリアの沖では'],
        ['some dolphins carry sea sponges', '海綿を運ぶイルカがいます'],
        ['on their noses', '鼻の先にのせて'],
        ['while they search for food', 'えさを探す間に'],
        ['on the sea floor.', '海底で'],
      ],
    }),
    bs('[S The sponge] [V protects] [O their noses] [M {前| from sharp rocks}], [接 and] [S young dolphins] [V learn] [O this skill] [M {前| by {動名詞| [V watching] [O their mothers]}}].', {
      chunks: [
        ['The sponge protects their noses', '海綿は鼻を守ります'],
        ['from sharp rocks,', 'とがった岩から'],
        ['and young dolphins learn this skill', 'そして子どものイルカはこの技を身につけます'],
        ['by watching their mothers.', '母親を見ることで'],
      ],
    }),
    bs('[S {動名詞| [V Studying] [O dolphins]}] [V shows] [O1 us] [O2 {that節| [接 that] [S animals] [V can be] [C intelligent] [M {前| in many different ways}]}].', {
      chunks: [
        ['Studying dolphins shows us', 'イルカを研究すると分かります'],
        ['that animals can be intelligent', '動物が賢くなれることが'],
        ['in many different ways.', 'さまざまなやり方で'],
      ],
    }),
    bs('[S Their cognitive abilities] [V have] [M also] [V led] [O many people] [C {to:補語| [V to question] [O {whether節| [接 whether] [仮S it] [V is] [C acceptable] [真S {to:名詞| [V to keep] [O dolphins] [M {前| in small pools}] [M {前| for entertainment}]}]}]}].', {
      chunks: [
        ['Their cognitive abilities have also led', 'その認知能力はさせてもきました'],
        ['many people to question', '多くの人に疑問を持つことを'],
        ['whether it is acceptable', 'よいことなのかどうか'],
        ['to keep dolphins in small pools', 'イルカを小さなプールで飼うのが'],
        ['for entertainment.', '楽しみのために'],
      ],
    }),
    bs('[M However], [S dolphins] [M also] [V face] [O many threats] [M {前| in the wild}], [M {前| such as {並列| pollution | and fishing nets}}].', {
      chunks: [
        ['However, dolphins also face', 'しかし、イルカは向き合ってもいます'],
        ['many threats in the wild,', '野生での多くの脅威に'],
        ['such as pollution and fishing nets.', '汚染や漁の網のような'],
      ],
    }),
    bs('[S Some species] [V are] [M now] [C endangered], [接 so] [S international efforts] [V are needed] [M {to:副詞(目的)| [V to protect] [O their habitats]}].', {
      chunks: [
        ['Some species are now endangered,', '今、絶滅のおそれがある種もいます'],
        ['so international efforts are needed', 'だから国際的な取り組みが必要です'],
        ['to protect their habitats.', 'すみかを守るために'],
      ],
    }),
    bs('[S Scientists] [V hope] [O {that節| [接 that] [S {動名詞| [V learning] [O more] [M {前| about dolphins}]}] [V will raise] [O awareness {前| of ocean conservation}] [接 and] [V help] [O us] [C {原形| [V reconsider] [O our relationship {前| with other animals}]}]}].', {
      chunks: [
        ['Scientists hope', '科学者は期待しています'],
        ['that learning more about dolphins', 'イルカについてもっと知ることが'],
        ['will raise awareness', '意識を高めると'],
        ['of ocean conservation', '海の保護への'],
        ['and help us reconsider', 'そしてわたしたちが見直す助けになると'],
        ['our relationship with other animals.', 'ほかの動物との関係を'],
      ],
    }),
  ]),
  br2_food_waste: Object.freeze([
    bs('[M Every year], [S millions {前| of tons {前| of food}}] [V are thrown] [M away] [M {前| in Japan}], [M {副詞節:譲歩| [接 even though] [S much {前| of it}] [V could] [M still] [V be eaten]}].', {
      chunks: [
        ['Every year,', '毎年'],
        ['millions of tons of food', '何百万トンもの食べ物が'],
        ['are thrown away in Japan,', '日本で捨てられています'],
        ['even though much of it', 'その多くは〜なのに'],
        ['could still be eaten.', 'まだ食べられる'],
      ],
    }),
    bs('[S This food waste] [V comes] [M {前| from three main places: {同格>three main places| {並列| farms, | stores, | and homes}}}].', {
      chunks: [
        ['This food waste comes', 'この食品ロスは出ます'],
        ['from three main places:', 'おもに三つの場所から'],
        ['farms, stores, and homes.', '農場・店・家庭です'],
      ],
      notes: {
        'from three main places:': 'コロンの後ろが three main places の中身です。続く段落もこの順番で説明します。',
      },
      marks: [[':', '前の「おもに三つの場所」の中身（農場・店・家庭）を、コロンの後ろで具体的に挙げます。']],
      rules: ['punctuation-map'],
    }),
    bs('[M {前| On farms}], [S vegetables {関係>vegetables| [S that] [V {並列| are too small | or have strange shapes}]}] [V are] [M often] [M not] [V sent] [M {前| to stores}], [M {副詞節:理由| [接 because] [S customers] [V prefer] [O perfect-looking products]}].', {
      chunks: [
        ['On farms,', '農場では'],
        ['vegetables', '野菜は'],
        ['that are too small or have strange shapes', '小さすぎたり形が変わっていたりする'],
        ['are often not sent to stores,', 'よく店に送られません'],
        ['because customers prefer', 'なぜなら、客が好むからです'],
        ['perfect-looking products.', '見た目のよい商品を'],
      ],
    }),
    bs('[M {前| In stores}], [S food {関係>food| [S that] [V is] [C close {前| to its sell-by date}]}] [V is removed] [M {前| from the shelves}].', {
      chunks: [
        ['In stores,', '店では'],
        ['food that is close', '近い食べ物は'],
        ['to its sell-by date', '販売期限に'],
        ['is removed from the shelves.', '棚から取り除かれます'],
      ],
    }),
    bs('[M {前| At home}], [S people] [V buy] [O more] [M {副詞節:比較| [接 than] [S they] [V need]}], [V forget] [M {前| about food {関係省略:目的格>food| [S they] [M already] [V have]}}], [接 and] [V throw] [O it] [M away] [M later].', {
      chunks: [
        ['At home,', '家庭では'],
        ['people buy more than they need,', '人々は必要以上に買います'],
        ['forget about food', '食べ物のことを忘れます'],
        ['they already have,', 'すでに持っている'],
        ['and throw it away later.', 'そしてあとでそれを捨てます'],
      ],
      notes: {
        'people buy more than they need,': '主語 people と組になる動詞は buy・forget・throw の三つです。need と have は主語 they の別の節の動詞です。',
      },
      rules: ['finite-verb-check'],
    }),
    bs('[S Food waste] [V is] [M not] [M only] [C a waste {前| of money}]; [S it] [M also] [V harms] [O the environment].', {
      chunks: [
        ['Food waste is not only', '食品ロスは〜だけではありません'],
        ['a waste of money;', 'お金のむだ'],
        ['it also harms the environment.', '環境にも害を与えます'],
      ],
      marks: [[';', '前の「お金のむだだけではない」と、後ろの「環境にも害を与える」を、関係の深い二つの文としてつなぎます。']],
    }),
    bs('[S {並列| {動名詞| [V Growing]}, | {動名詞| [V carrying]}, | and {動名詞| [V storing] [O food]}}] [V uses] [O a lot {前| of {並列| water | and energy}}], [接 and] [S the disposal {前| of food waste}] [V produces] [O gases {関係>gases| [S that] [V warm] [O the planet]}].', {
      chunks: [
        ['Growing, carrying, and storing food', '食べ物を育て、運び、保存することは'],
        ['uses a lot of water and energy,', '多くの水とエネルギーを使います'],
        ['and the disposal of food waste', 'そして食品のごみを処分することは'],
        ['produces gases', 'ガスを出します'],
        ['that warm the planet.', '地球を温める'],
      ],
      notes: {
        'Growing, carrying, and storing food': 'and の後ろの storing と同じ -ing 形を前にさかのぼると、Growing と carrying が見つかります。',
      },
      rules: ['parallel-shape'],
    }),
    bs('[S {並列| Some companies | and local governments}] [V are] [M now] [V taking] [O action].', {
      chunks: [
        ['Some companies and local governments', 'いくつかの会社や自治体が'],
        ['are now taking action.', '今、行動を起こしています'],
      ],
    }),
    bs('[S Some stores] [V sell] [O vegetables {前| with strange shapes}] [M {前| at lower prices}], [接 and] [S others] [V distribute] [O surplus food] [M {前| to people {前| in need}}].', {
      chunks: [
        ['Some stores sell vegetables', '野菜を売る店もあります'],
        ['with strange shapes', '形の変わった'],
        ['at lower prices,', 'より安い値段で'],
        ['and others distribute surplus food', 'そして余った食べ物を配る店もあります'],
        ['to people in need.', '困っている人に'],
      ],
    }),
    bs('[M {前| At home}], [S we] [V can help] [M {前| by {並列| {動名詞| [V planning] [O our meals]}, | {動名詞| [V checking] [O {what節| [O what] [S we] [M already] [V have]}]}, | and {動名詞| [V buying] [M only] [O {what節| [O what] [S we] [V will eat]}]}}}].', {
      chunks: [
        ['At home, we can help', '家庭では、わたしたちは協力できます'],
        ['by planning our meals,', '食事の計画を立てることで'],
        ['checking what we already have,', 'すでにある物を確かめることで'],
        ['and buying only what we will eat.', 'そして食べる分だけを買うことで'],
      ],
    }),
    bs('[S {動名詞| [V Reducing] [O food waste]}] [V is] [C a simple way {前:意味上の主語| for consumers} {to:形容詞>a simple way| [V to save] [O money] [接 and] [V protect] [O the environment]}] [M {前| at the same time}].', {
      chunks: [
        ['Reducing food waste is a simple way', '食品ロスを減らすことは簡単な方法です'],
        ['for consumers to save money', '消費者がお金を節約し'],
        ['and protect the environment', '環境を守るための'],
        ['at the same time.', '同時に'],
      ],
    }),
    bs('[M {前| In France}], [S a law] [V prohibits] [O large supermarkets] [M {前| from {動名詞| [V throwing] [M away] [O edible food]}}].', {
      chunks: [
        ['In France,', 'フランスでは'],
        ['a law prohibits large supermarkets', '法律が大きなスーパーマーケットに禁じています'],
        ['from throwing away edible food.', '食べられる食品を捨てることを'],
      ],
    }),
    bs('[M Instead], [S stores] [V donate] [O it] [M {前| to charities}], [接 and] [S similar efforts] [V are becoming] [C widespread] [M {前| in other countries}].', {
      chunks: [
        ['Instead,', '代わりに'],
        ['stores donate it to charities,', '店はそれを慈善団体に寄付します'],
        ['and similar efforts are becoming widespread', 'そして同じような取り組みが広がっています'],
        ['in other countries.', 'ほかの国でも'],
      ],
    }),
    bs('[S {動名詞| [V Reducing] [O waste]}] [V is] [M not] [M only] [C {並列| an individual responsibility | but also a challenge {前| for the whole food industry}}], [接 and] [S even minimal changes] [V can help].', {
      chunks: [
        ['Reducing waste is not only', 'ロスを減らすことは〜だけではありません'],
        ['an individual responsibility', '一人一人の責任'],
        ['but also a challenge', '課題でもあります'],
        ['for the whole food industry,', '食品業界全体の'],
        ['and even minimal changes can help.', 'そしてほんの小さな変化でも役に立ちます'],
      ],
    }),
    bs('[S Some smartphone apps] [M also] [V help] [O consumers] [C {原形| [V purchase] [O surplus food] [M {前| from stores}] [M {前| at lower prices}]}].', {
      chunks: [
        ['Some smartphone apps also help consumers', 'スマートフォンのアプリの中には消費者を助けるものもあります'],
        ['purchase surplus food from stores', '店の余った食品を買うのを'],
        ['at lower prices.', 'より安い値段で'],
      ],
    }),
  ]),
  br2_community_bus: Object.freeze([
    bs('[独 Dear residents {前| of Green Hills}],', {
      fragment: true,
      chunks: [
        ['Dear residents of Green Hills,', 'グリーンヒルズの住民のみなさまへ'],
      ],
      notes: {
        'Dear residents of Green Hills,': 'Eメールの書き出しの呼びかけです。市から住民へのお知らせだと見当をつけます。',
      },
      rules: ['purpose-first'],
    }),
    bs('[S We] [V are] [C pleased {to:副詞(原因)| [V to announce] [O {that節| [接 that] [S a new community bus] [V will start] [O {動名詞| [V running]}] [M {前| on April 1}]}]}].', {
      chunks: [
        ['We are pleased to announce', 'お知らせできてうれしく思います'],
        ['that a new community bus', '新しいコミュニティバスが'],
        ['will start running', '走り始めることを'],
        ['on April 1.', '4月1日に'],
      ],
      rules: ['purpose-first'],
    }),
    bs('[S Many {前| of you}] [V have told] [O us] [O {that節| [接 that] [仮S it] [V is] [C difficult] [真S {to:名詞| [V to get] [M {前| to {並列| the hospital | and the shopping center}}] [M {前| without a car}]}]}].', {
      chunks: [
        ['Many of you have told us', '多くの方が伝えてくださいました'],
        ['that it is difficult to get', '行くのがむずかしいと'],
        ['to the hospital and the shopping center', '病院やショッピングセンターに'],
        ['without a car.', '車がないと'],
      ],
      notes: {
        'that it is difficult to get': 'that の後ろが主語と動詞のそろった文なので「〜ということ」の節で、told us の伝えた中身です。',
      },
      rules: ['that-diagnosis'],
    }),
    bs('[S The bus] [V will run] [M every 30 minutes] [M {前| from 7:00 a.m.} {前| to 8:00 p.m.}]', {
      chunks: [
        ['The bus will run', 'バスは走ります'],
        ['every 30 minutes', '30分ごとに'],
        ['from 7:00 a.m. to 8:00 p.m.', '午前7時から午後8時まで'],
      ],
      marks: [
        [':', '時刻の「時」と「分」を区切る記号で、7:00 は7時ちょうどです。'],
        [':', '時刻の「時」と「分」を区切る記号で、8:00 は8時ちょうどです。'],
      ],
    }),
    bs('[S It] [V will stop] [M {前| at {並列| the hospital, | the shopping center, | the city library, | and Lake Station}}].', {
      chunks: [
        ['It will stop at the hospital,', 'バスは病院に止まります'],
        ['the shopping center, the city library,', 'ショッピングセンター、市立図書館'],
        ['and Lake Station.', 'そしてレイク駅に'],
      ],
    }),
    bs('[M Please] [V note] [O {that節| [接 that] [S the bus] [V will not stop] [M {前| at Central Station, {関係,>Central Station| [S which] [V is] [M {前| under construction}]}}]}].', {
      chunks: [
        ['Please note', 'ご注意ください'],
        ['that the bus will not stop', 'バスが止まらないことに'],
        ['at Central Station,', 'セントラル駅には'],
        ['which is under construction.', 'そこは工事中なのです'],
      ],
      notes: {
        'that the bus will not stop': '次の文の「セントラル駅へ行ける」と食い違うように見えたら、否定と接続語を見直します。',
      },
      rules: ['repair-monitor'],
    }),
    bs('[M However], [S you] [V can] [M still] [V reach] [O Central Station] [M {前| by {動名詞| [V changing] [M {前| to the train}] [M {前| at Lake Station}]}}].', {
      chunks: [
        ['However, you can still reach', 'しかし、それでも行くことができます'],
        ['Central Station', 'セントラル駅へ'],
        ['by changing to the train', '電車に乗りかえることで'],
        ['at Lake Station.', 'レイク駅で'],
      ],
      notes: {
        'by changing to the train': 'by＋-ing で方法を表します。バスでは直接行けないが、乗りかえれば行ける、と読み直せます。',
      },
      rules: ['repair-monitor'],
    }),
    bs('[S The fare] [V is] [C {並列| 200 yen {前| for adults} | and free {前| for {並列| children {前| under 12} | and people {前| over 70}}}}].', {
      chunks: [
        ['The fare is 200 yen for adults', '運賃は大人200円です'],
        ['and free for children under 12', 'そして12歳未満の子どもと'],
        ['and people over 70.', '70歳を超える方は無料です'],
      ],
    }),
    bs('[M {副詞節:条件| [接 If] [S you] [V have] [O any {並列| questions | or suggestions}]}], [M please] [V contact] [O the city transport office].', {
      chunks: [
        ['If you have any questions or suggestions,', 'ご質問やご提案があれば'],
        ['please contact', 'ご連絡ください'],
        ['the city transport office.', '市の交通課まで'],
      ],
    }),
    bs('[S We] [M also] [V hope] [O {that節| [接 that] [S the new bus] [V will reduce] [O traffic congestion] [接 and] [V make] [O our streets] [C safer {前| for pedestrians}]}].', {
      chunks: [
        ['We also hope', '願ってもいます'],
        ['that the new bus will reduce', '新しいバスが減らすことを'],
        ['traffic congestion', '交通渋滞を'],
        ['and make our streets safer', 'そして道路をより安全にすることを'],
        ['for pedestrians.', '歩行者にとって'],
      ],
    }),
    bs('[S All the buses] [V are] [C barrier-free], [接 so] [S passengers {現在分詞>passengers| [V using] [O wheelchairs]}] [V can get on] [M easily].', {
      chunks: [
        ['All the buses are barrier-free,', 'バスはすべてバリアフリーです'],
        ['so passengers using wheelchairs', 'だから車いすを使う乗客も'],
        ['can get on easily.', '楽に乗ることができます'],
      ],
    }),
    bs('[S We] [V will review] [O the route] [M {前| after six months}], [M {分詞構文:付帯状況| [V based] [M {前| on your feedback}]}].', {
      chunks: [
        ['We will review the route', '路線を見直します'],
        ['after six months,', '6か月後に'],
        ['based on your feedback.', 'みなさまのご意見をもとに'],
      ],
    }),
    bs('[S We] [V are] [C committed {前| to {動名詞| [V making] [O public transport] [C convenient] [M {前| for all residents}], [M {前| including {並列| elderly people | and people {前| with disabilities}}}]}}].', {
      chunks: [
        ['We are committed to making', 'わたしたちは力を注いでいます'],
        ['public transport convenient', '公共交通を便利にすることに'],
        ['for all residents,', 'すべての住民にとって'],
        ['including elderly people', 'お年寄りや'],
        ['and people with disabilities.', '障がいのある方をふくむ'],
      ],
    }),
    bs('[S We] [V will launch] [O the service] [M {前| with six buses}] [接 and] [V add] [O more] [M {副詞節:条件| [接 if] [V needed]}].', {
      chunks: [
        ['We will launch the service', '運行を始めます'],
        ['with six buses', '6台のバスで'],
        ['and add more', 'そして増やします'],
        ['if needed.', '必要であれば'],
      ],
    }),
    bs('[S We] [V hope] [O {that節| [接 that] [S many {前| of you}] [V will use] [O the new bus] [M {前| for {並列| commuting | and shopping}}]}].', {
      chunks: [
        ['We hope', '願っています'],
        ['that many of you will use', '多くの方が使ってくださることを'],
        ['the new bus', '新しいバスを'],
        ['for commuting and shopping.', '通勤や買い物に'],
      ],
    }),
    bs('[独 Best regards],', {
      fragment: true,
      chunks: [
        ['Best regards,', 'よろしくお願いいたします'],
      ],
    }),
    bs('[独 Green Hills City Office]', {
      fragment: true,
      chunks: [
        ['Green Hills City Office', 'グリーンヒルズ市役所'],
      ],
    }),
  ]),
})
