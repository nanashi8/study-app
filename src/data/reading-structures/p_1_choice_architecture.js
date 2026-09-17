import { st } from './entry.js'

export default Object.freeze([
  st('[S People] [M often] [V describe] [O choice] [M {副詞節:様態| [接 as if] [S it] [V begins] [M only {副詞節:時| [接 when] [S a person] [M consciously] [V compares] [O several options]}]}].', {
    chunks: [
      ['People often describe choice', '人はよく、選ぶことをこう語ります（どのようにかは次へ）'],
      ['as if it begins only', 'まるで、それが始まるのは〜のときだけであるかのように'],
      ['when a person consciously compares several options', '人が意識していくつかの選択肢を比べるとき'],
    ],
    notes: {
      'as if it begins only': 'as if 〜 で「まるで〜のように」。it は choice を指します。only が後ろの when の節にかかります。',
      'when a person consciously compares several options': 'consciously は「意識して」。この文は、選択についてよくある思い込みを示しています。',
    },
    rules: ['paragraph-map', 'negation-scope', 'main-clause-skeleton'],
  }),
  st('[M {前| In practice}], [S decisions] [V are] [M also] [V shaped] [M {前| by {疑問詞節| [S which option] [V appears] [M first]}, {疑問詞節| [S which action] [V requires] [O effort]}, and {what節| [S what] [V happens] [M {副詞節:時| [接 when] [S someone] [V does] [O nothing]}]}}].', {
    chunks: [
      ['In practice, decisions are also shaped', '実際には、決め方は形づくられてもいます（何によってかは次へ）'],
      ['by which option appears first,', 'どの選択肢が先に出てくるか'],
      ['which action requires effort,', 'どの行動に手間がかかるか'],
      ['and what happens when someone does nothing', 'そして、何もしないときに何が起こるかによって'],
    ],
    notes: {
      'In practice, decisions are also shaped': 'are … shaped が受け身で、間の also は「〜もまた」。In practice は「実際には」。',
      'by which option appears first,': 'by の後ろに、疑問詞で始まる3つの名詞のまとまりが並びます。',
      'and what happens when someone does nothing': '「何もしないとき」に何が起こるかも、選択に影響するということです。',
    },
  }),
  st('[S These features] [V form] [O a choice architecture: {同格>a choice architecture| the environment {関係>the environment| [M within which] [S people] [V decide]}}].', {
    chunks: [
      ['These features form a choice architecture:', 'こうした特徴が、選択のしくみを作ります（言いかえは次へ）'],
      ['the environment within which people decide', 'つまり、人が決めるときの環境です'],
    ],
    notes: {
      'These features form a choice architecture:': 'feature はここでは「（しくみの）特徴となる点」。',
      'the environment within which people decide': 'コロンの後ろは a choice architecture の言いかえです。within which は「その中で」で、the environment を説明します。',
    },
  }),
  st('[S Architecture] [V is not] [M merely] [C a metaphor], [M {副詞節:理由| [接 because] [S every digital screen, form, cafeteria, and public procedure] [V must arrange] [O alternatives] [M somehow]}].', {
    chunks: [
      ['Architecture is not merely a metaphor,', 'しくみというのは、ただのたとえではありません'],
      ['because every digital screen, form,', 'なぜなら、どの画面や書類'],
      ['cafeteria, and public procedure must arrange alternatives somehow', '食堂や公の手続きも、選択肢を何らかの形で並べざるをえないからです'],
    ],
    notes: {
      'Architecture is not merely a metaphor,': 'metaphor は「たとえ」。not merely 〜 で「ただの〜ではない」。',
      'cafeteria, and public procedure must arrange alternatives somehow': 'arrange は「並べる・配置する」。somehow は「何らかの形で」。',
    },
  }),
  st('[S Behavioral researchers] [V have shown] [O {that節| [接 that] [S small changes {前| in this environment}] [V can influence] [O large numbers {前| of decisions}]}].', {
    chunks: [
      ['Behavioral researchers have shown that', '行動を研究する人たちは、〜と示してきました（内容は次へ）'],
      ['small changes in this environment', 'この環境の小さな変化が'],
      ['can influence large numbers of decisions', '非常に多くの決定に影響しうる（ということを）'],
    ],
    notes: {
      'Behavioral researchers have shown that': 'have shown は現在完了で「これまでに示してきた」。',
      'can influence large numbers of decisions': 'large numbers of 〜 で「非常に多くの〜」。',
    },
  }),
  st('[S Employees] [V save] [O more] [M {前| for retirement}] [M {副詞節:時| [接 when] [S enrollment] [V is] [C automatic] [接 but] [V can be canceled]}] [M {副詞節:比較| [接 than] [M {副詞節:時| [接 when] [S they] [V must complete] [O a form] [M {to:副詞(目的)| [V to join]}]}]}].', {
    chunks: [
      ['Employees save more for retirement', '働く人は、老後のためにより多く貯めます（どんなときかは次へ）'],
      ['when enrollment is automatic but can be canceled', '登録が自動で、しかも取り消せるとき'],
      ['than when they must complete', 'それに対して、書かなければならないときより'],
      ['a form to join', '加入のための書類を'],
    ],
    notes: {
      'when enrollment is automatic but can be canceled': 'enrollment は「登録・加入」。is automatic と can be canceled が but で並びます。',
      'than when they must complete': 'more … than when 〜 で「〜のときより多く」。2つの when の節を比べています。',
    },
    rules: ['comparison-pairs', 'parallel-shape', 'main-clause-skeleton'],
  }),
  st('[S Diners] [V may select] [O healthier food] [M more often] [M {副詞節:時| [接 when] [S it] [V is] [C easy {to:副詞(形容詞)| [V to see] [接 and] [V reach]}]}], [M {副詞節:譲歩| [接 even though] [S less healthy choices] [V remain] [C available]}].', {
    chunks: [
      ['Diners may select healthier food more often', '食堂を使う人は、体によい食べ物をより多く選ぶことがあります'],
      ['when it is easy to see and reach,', '見やすく、手が届きやすいところにあるとき'],
      ['even though less healthy choices remain available', '体によくない選択肢も選べるままであっても'],
    ],
    notes: {
      'when it is easy to see and reach,': 'easy to 〜 で「〜しやすい」。to see と (to) reach が and で並びます。',
      'even though less healthy choices remain available': 'even though 〜 で「〜だとしても」。選択肢を取り上げていない点が大事です。',
    },
  }),
  st('[S Households] [V may use] [O less electricity] [M {副詞節:時| [接 when] [S bills] [V compare] [O their use] [M {前| with that {前| of similar homes}}]}].', {
    chunks: [
      ['Households may use less electricity', '家庭は、電気の使用を減らすことがあります（どんなときかは次へ）'],
      ['when bills compare their use', '請求書が、その家の使用量を比べるとき（何とかは次へ）'],
      ['with that of similar homes', '似た家の使用量と'],
    ],
    notes: {
      'when bills compare their use': 'compare A with B で「AをBと比べる」。',
      'with that of similar homes': 'that は use のくり返しを避ける代わりの語で、「似た家の使用量」を表します。',
    },
  }),
  st('[S Such interventions] [V are] [M sometimes] [V called] [C nudges] [M {副詞節:理由| [接 because] [S they] [V alter] [O behavior] [M {前| without {動名詞| [M formally] [V removing] [O options]}}]}].', {
    chunks: [
      ['Such interventions are sometimes called nudges', 'こうした働きかけは、ナッジと呼ばれることがあります'],
      ['because they alter behavior', 'なぜなら、行動を変えるからです（どうやってかは次へ）'],
      ['without formally removing options', '選択肢を正式に取り上げることなく'],
    ],
    notes: {
      'Such interventions are sometimes called nudges': 'call A B（AをBと呼ぶ）の受け身です。nudge は「そっとひと押しすること」。',
      'without formally removing options': 'without ＋ -ing で「〜せずに」。選択肢は残したまま行動を変える点が、ナッジの特徴です。',
    },
    rules: ['passive-active', 'cause-result', 'paragraph-map'],
  }),
  st('[S Their appeal] [V is] [C clear] [M {前| in settings {関係>settings| [M where] [S information] [V is] [C complex], [S attention] [V is] [C limited], [接 and] [S delay] [V carries] [O real costs]}}].', {
    chunks: [
      ['Their appeal is clear', 'その良さがはっきり分かるのは（どんな場面かは次へ）'],
      ['in settings where information is complex,', '情報が複雑な場面です'],
      ['attention is limited, and delay carries real costs', '注意には限りがあり、先延ばしが実際の損につながる場面です'],
    ],
    notes: {
      'Their appeal is clear': 'Their は前の文の nudges を指します。appeal は「魅力・良さ」。',
      'attention is limited, and delay carries real costs': 'where の節の中に3つの場面が並びます。carry real costs で「実際の損を伴う」。',
    },
  }),
  st('[S A well-designed default] [V may help] [O people] [C {原形| [V carry out] [O an intention {関係省略:目的格>an intention| [S they] [M already] [V have] [接 but] [M repeatedly] [V postpone]}]}].', {
    chunks: [
      ['A well-designed default may help people', 'よく考えられた初期設定は、人を助けることがあります（何をするのをかは次へ）'],
      ['carry out an intention', 'やろうと思っていることを実行するのを（どんな意図かは次へ）'],
      ['they already have but repeatedly postpone', 'もう持っているのに、何度も先延ばしにしている（意図を）'],
    ],
    notes: {
      'A well-designed default may help people': 'default は「最初からそうなっている設定」。help ＋ 人 ＋ 動詞の原形 で「人が〜するのを助ける」。',
      'they already have but repeatedly postpone': 'have と postpone が but で並び、どちらも an intention を目的語にします。postpone は「先延ばしにする」。',
    },
  }),
  st('[S It] [V can] [M also] [V reduce] [O the advantage {過去分詞>the advantage| [V enjoyed] [M {前| by people {関係>people| [S who] [V have] [O more time, confidence, or expert assistance] [M {前| for {動名詞| [V navigating] [O procedures]}}]}}]}].', {
    chunks: [
      ['It can also reduce the advantage', 'それはまた、有利さを小さくできます（だれの有利さかは次へ）'],
      ['enjoyed by people who have more time,', '時間をより多く持つ人が受けている（有利さを）'],
      ['confidence, or expert assistance for navigating procedures', '自信や、手続きを進めるための専門家の助けを持つ人の'],
    ],
    notes: {
      'It can also reduce the advantage': 'It は前の文の A well-designed default を指します。',
      'enjoyed by people who have more time,': 'enjoyed は過去分詞で the advantage を後ろから説明して「〜が受けている有利さ」。',
      'confidence, or expert assistance for navigating procedures': 'navigate procedures は「手続きをうまく進める」。初期設定は、そうした余裕のない人の不利を小さくできます。',
    },
  }),
  st('[S The same feature] [V can assist] [O one group] [M {副詞節:時| [接 while] [M quietly] [V creating] [O a new obstacle] [M {前| for another}]}].', {
    chunks: [
      ['The same feature can assist one group', '同じしくみが、ある集団を助けることがあります'],
      ['while quietly creating a new obstacle', '一方で、気づかれないうちに新しい壁を作りながら（だれにとってかは次へ）'],
      ['for another', 'ほかの集団にとっての'],
    ],
    notes: {
      'while quietly creating a new obstacle': 'while ＋ -ing で「〜しながら」。quietly は「静かに・気づかれずに」。',
      'for another': 'another は another group のことです。同じ設計が、助けにも壁にもなりうるという段落の要点です。',
    },
    rules: ['contrast-concession', 'ing-ed-role', 'reference-chain'],
  }),
  st('[S The ethical difficulty] [V begins] [M {前| with the fact {同格that>the fact| [接 that] [S influence and assistance] [V are not] [M easily] [V separated]}}].', {
    chunks: [
      ['The ethical difficulty begins with the fact', '倫理の面での難しさは、次の事実から始まります（内容は次へ）'],
      ['that influence and assistance are not easily separated', '影響を与えるのと助けるのは、簡単には分けられないという事実です'],
    ],
    notes: {
      'The ethical difficulty begins with the fact': 'begin with 〜 で「〜から始まる」。',
      'that influence and assistance are not easily separated': 'この that は the fact の中身を説明する同格の that です。are not … separated は受け身です。',
    },
    rules: ['that-diagnosis', 'paragraph-map', 'main-clause-skeleton'],
  }),
  st('[S The person or institution {関係>The person or institution| [S that] [V selects] [O a default]}] [V makes] [O a judgment] [M {前| about {疑問詞節| [S which outcome] [V should occur] [M most easily]}}].', {
    chunks: [
      ['The person or institution that selects a default', '初期設定を選ぶ人や組織は'],
      ['makes a judgment', '一つの判断をしています（何についてかは次へ）'],
      ['about which outcome should occur most easily', 'どの結果が最も起こりやすくあるべきか、について'],
    ],
    notes: {
      'about which outcome should occur most easily': 'which outcome 以下は「どの結果が〜か」という名詞のまとまりで、about の目的語です。',
    },
  }),
  st('[S That judgment] [V may reflect] [O good evidence and a legitimate public goal], [接 but] [S it] [V may] [M also] [V serve] [O the designer\'s interests].', {
    chunks: [
      ['That judgment may reflect good evidence', 'その判断は、よい根拠を反映していることもあります'],
      ['and a legitimate public goal,', 'そして、正当な公の目標も'],
      ['but it may also serve the designer\'s interests', 'しかし、設計する側の利益に役立っていることもあります'],
    ],
    notes: {
      'That judgment may reflect good evidence': 'reflect は「映し出す・反映する」。may は「〜することもある」。',
      'but it may also serve the designer\'s interests': 'serve someone\'s interests で「〜の利益になる」。同じ判断が、公のためとも、作る側のためともなりうるということです。',
    },
  }),
  st('[S A subscription company], [M {前| for example}], [V benefits] [M {副詞節:時| [接 when] [S cancellation] [V requires] [O several screens] [M {副詞節:対比| [接 while] [S renewal] [V occurs] [M automatically]}]}].', {
    chunks: [
      ['A subscription company, for example, benefits', 'たとえば、定期購読の会社は得をします（どんなときかは次へ）'],
      ['when cancellation requires several screens', 'やめる手続きに画面を何枚も通る必要があるとき'],
      ['while renewal occurs automatically', '一方で、更新は自動で行われるとき'],
    ],
    notes: {
      'A subscription company, for example, benefits': 'benefit はここでは動詞で「得をする」。for example がコンマで挟まれています。',
      'while renewal occurs automatically': 'while はここでは「一方で」。やめにくく、続けやすい形になっているということです。',
    },
  }),
  st('[M Formally], [S customers] [V retain] [O a choice]; [M practically], [S friction] [V has been distributed] [M {to:副詞(目的)| [V to protect] [O one side]}].', {
    chunks: [
      ['Formally, customers retain a choice;', '形の上では、客は選ぶ自由を保っています'],
      ['practically, friction has been distributed', '実際には、手間が割りふられています（何のためかは次へ）'],
      ['to protect one side', '片方の側を守るために'],
    ],
    notes: {
      'Formally, customers retain a choice;': 'formally は「形の上では」。retain は「保ち続ける」。',
      'practically, friction has been distributed': 'friction は「摩擦」で、ここでは手続きの面倒さのことです。has been distributed は受け身の現在完了です。',
    },
    rules: ['punctuation-map', 'passive-active', 'contrast-concession'],
  }),
  st('[S Defenders {前| of nudging}] [V respond] [O {that節| [接 that] [S no neutral design] [V is] [C available]}].', {
    chunks: [
      ['Defenders of nudging respond that', 'ナッジを擁護する人たちは、こう答えます（内容は次へ）'],
      ['no neutral design is available', '中立な設計などない、と'],
    ],
    notes: {
      'Defenders of nudging respond that': 'defender は「擁護する人」。ここから、ナッジを支持する側の言い分になります。',
      'no neutral design is available': 'no ＋ 名詞 で「どんな〜もない」。どう作っても何らかの誘導になる、という主張です。',
    },
    rules: ['author-stance', 'that-diagnosis', 'paragraph-map'],
  }),
  st('[S A form] [V must place] [O one question] [M {前| before another}], [接 and] [S a digital service] [V must decide] [O {what節| [S what] [V happens] [M {副詞節:時| [接 when] [S users] [V ignore] [O a notice]}]}].', {
    chunks: [
      ['A form must place one question before another,', '書類は、ある質問を別の質問より先に置かざるをえません'],
      ['and a digital service must decide', 'そしてデジタルのサービスは、決めなければなりません（何をかは次へ）'],
      ['what happens when users ignore a notice', '利用者が知らせを無視したとき、何が起こるかを'],
    ],
    notes: {
      'A form must place one question before another,': 'どちらを先に置くかを選ばずにはいられない、という例です。',
      'what happens when users ignore a notice': 'what 以下は「何が〜か」という名詞のまとまりで、decide の目的語です。',
    },
  }),
  st('[M {副詞節:条件| [接 If] [S architecture] [V is] [C unavoidable]}], [M {挿入| [S they] [V argue]}], [S it] [V should be designed] [M {to:副詞(目的)| [V to advance] [O welfare]}] [M {前| rather than left {前| to accident or commercial power}}].', {
    chunks: [
      ['If architecture is unavoidable, they argue,', 'しくみが避けられないのなら、と彼らは言います'],
      ['it should be designed to advance welfare', 'それは人々の幸せを進めるように設計されるべきだ'],
      ['rather than left to accident or commercial power', '偶然や商売の力に任されるのではなく'],
    ],
    notes: {
      'If architecture is unavoidable, they argue,': 'they argue が文の途中にコンマで挟まれた挿入です。they は前の文の Defenders を指します。',
      'rather than left to accident or commercial power': 'rather than (being) left の being が省かれた形です。A rather than B で「BではなくA」。',
    },
    rules: ['insertion', 'contrast-concession', 'passive-active'],
  }),
  st('[S This response] [V is] [C persuasive] [M {副詞節:範囲| [接 as far as] [S it] [V goes]}], [接 yet] [S inevitability] [V does not settle] [O {疑問詞節| [S who] [V may design]}, {前| for whom}, or {前| toward what end}].', {
    chunks: [
      ['This response is persuasive', 'この答えは説得力があります（どの範囲でかは次へ）'],
      ['as far as it goes,', 'その範囲においては'],
      ['yet inevitability does not settle who may design,', 'しかし、避けられないということだけでは、だれが設計してよいかは決まりません'],
      ['for whom, or toward what end', 'だれのために、何を目指して設計するのかも'],
    ],
    notes: {
      'as far as it goes,': 'as far as it goes で「その範囲では」。認めたうえで足りない点を示す言い方です。',
      'for whom, or toward what end': 'for whom と toward what end は、前の who may design と並ぶ問いで、may design がくり返しを避けて省かれています。',
    },
    rules: ['contrast-concession', 'wh-clause', 'author-stance'],
  }),
  st('[S Transparency] [V is] [M often] [V proposed] [C {前| as the first safeguard}].', {
    chunks: [
      ['Transparency is often proposed', '分かるようにしておくことは、よく提案されます（何としてかは次へ）'],
      ['as the first safeguard', '最初の守りの手立てとして'],
    ],
    notes: {
      'Transparency is often proposed': 'is … proposed が受け身で、間の often は「よく」。',
      'as the first safeguard': 'safeguard は「守るための手立て」。この段落から、歯止めの案が順に出てきます。',
    },
    rules: ['passive-active', 'paragraph-map', 'main-clause-skeleton'],
  }),
  st('[S People] [V should be told] [O {that節| [接 that] [S a default] [V was chosen] [M deliberately]}] [接 and] [V should understand] [O {疑問詞to| [M how] [V to select] [O another option]}].', {
    chunks: [
      ['People should be told that', '人には、知らされるべきです（内容は次へ）'],
      ['a default was chosen deliberately', '初期設定はわざわざ選ばれたものだということを'],
      ['and should understand how to select another option', 'そして、別の選択肢を選ぶ方法も分かるべきです'],
    ],
    notes: {
      'People should be told that': 'tell ＋ 人 ＋ that 節（人に〜と伝える）の受け身です。',
      'and should understand how to select another option': 'how to 〜 で「〜のしかた」。and の後ろの should understand の主語も People です。',
    },
  }),
  st('[S Disclosure] [V matters], [接 but] [S a sentence {過去分詞>a sentence| [V hidden] [M {前| in a long policy}]}] [V does not create] [O meaningful awareness].', {
    chunks: [
      ['Disclosure matters,', '知らせること自体は大事です'],
      ['but a sentence hidden in a long policy', 'しかし、長い規約の中に埋もれた一文では'],
      ['does not create meaningful awareness', '本当に気づいてもらうことにはなりません'],
    ],
    notes: {
      'but a sentence hidden in a long policy': 'hidden は過去分詞で a sentence を後ろから説明して「隠れた一文」。',
      'does not create meaningful awareness': 'meaningful awareness は「実際に役に立つ気づき」。',
    },
  }),
  st('[S Researchers] [M also] [V distinguish] [O information {関係>information| [S that] [V is] [C technically available]}] [M {前| from information {関係>information| [O that] [S ordinary users] [V can notice] [接 and] [V act on]}}].', {
    chunks: [
      ['Researchers also distinguish information', '研究者はまた、情報を区別します（どんな情報かは次へ）'],
      ['that is technically available', '仕組みの上では手に入る（情報と）'],
      ['from information', 'つぎの情報とを（どんな情報かは次へ）'],
      ['that ordinary users can notice and act on', 'ふつうの利用者が気づいて動ける（情報と）'],
    ],
    notes: {
      'Researchers also distinguish information': 'distinguish A from B で「AとBを区別する」。',
      'that ordinary users can notice and act on': 'act on 〜 で「〜に基づいて動く」。that は can notice と act on の両方の目的語です。',
    },
  }),
  st('[M Nor] [V does] [S transparency] [M {前| by itself}] [V correct] [O a process {関係>a process| [S that] [V imposes] [O repeated effort] [M {前| on the people least able {to:副詞(形容詞)| [V to provide] [O it]}}]}].', {
    chunks: [
      ['Nor does transparency by itself correct a process', '分かるようにするだけでは、手続きを正すこともできません（どんな手続きかは次へ）'],
      ['that imposes repeated effort', '何度も手間を負わせる（手続きを）'],
      ['on the people least able to provide it', 'その手間をかける余裕が最も少ない人に'],
    ],
    notes: {
      'Nor does transparency by itself correct a process': 'Nor が文頭に出ると、後ろが does transparency … correct という疑問文の語順になります。「〜もまた…ない」。',
      'on the people least able to provide it': 'least able to 〜 で「最も〜できない」。it は repeated effort を指します。',
    },
    rules: ['negation-scope', 'relative-clause', 'main-clause-skeleton'],
  }),
  st('[S A second safeguard] [V is] [C easy and genuine refusal].', {
    chunks: [
      ['A second safeguard is easy and genuine refusal', '二つ目の守りの手立ては、簡単で本物の「断り方」です'],
    ],
    notes: {
      'A second safeguard is easy and genuine refusal': 'genuine は「見かけだけでない・本物の」。refusal は refuse の名詞形で「断ること」。',
    },
    rules: ['paragraph-map', 'main-clause-skeleton', 'svoc-core'],
  }),
  st('[S An alternative] [V is not] [C meaningful] [M {副詞節:条件| [接 if] [S it] [V is] [C difficult {to:副詞(形容詞)| [V to find]}], [V requires] [O expert knowledge], [接 or] [V carries] [O a punishment unrelated {前| to the policy goal}]}].', {
    chunks: [
      ['An alternative is not meaningful', 'ほかの選択肢は、意味を持ちません（どんなときかは次へ）'],
      ['if it is difficult to find,', 'それが見つけにくいとき'],
      ['requires expert knowledge,', '専門の知識が必要なとき'],
      ['or carries a punishment', 'または、不利を伴うとき（どんな不利かは次へ）'],
      ['unrelated to the policy goal', 'その政策の目的と関係のない'],
    ],
    notes: {
      'if it is difficult to find,': 'if の節の中に、is difficult・requires・carries の3つが並びます。',
      'unrelated to the policy goal': 'unrelated to 〜 は a punishment を後ろから説明して「〜と関係のない」。',
    },
  }),
  st('[S The burden {前| of {動名詞| [V opting out]}}] [V should be compared] [M {前| with the burden {関係>the burden| [O that] [S the default] [V removes]}}].', {
    chunks: [
      ['The burden of opting out', '断るための手間は'],
      ['should be compared', '比べられるべきです（何とかは次へ）'],
      ['with the burden that the default removes', '初期設定が取り除いてくれる手間と'],
    ],
    notes: {
      'The burden of opting out': 'opt out で「（初期設定から）抜ける・断る」。動名詞のまとまりが of の目的語です。',
      'with the burden that the default removes': 'that は the burden を受ける関係代名詞で、removes の目的語にあたります。',
    },
  }),
  st('[M Otherwise], [S convenience {前| for the majority}] [V may be purchased] [M {前| by {動名詞| [V creating] [O barriers] [M {前| for a vulnerable minority}]}}].', {
    chunks: [
      ['Otherwise, convenience for the majority', 'そうでなければ、多数の人の便利さは'],
      ['may be purchased', '得られることになりかねません（何と引き換えかは次へ）'],
      ['by creating barriers for a vulnerable minority', '弱い立場の少数の人に壁を作るのと引き換えに'],
    ],
    notes: {
      'Otherwise, convenience for the majority': 'Otherwise は「そうしなければ」。前の文の比べ方をしない場合の話です。',
      'by creating barriers for a vulnerable minority': 'be purchased by 〜ing で「〜することで買われる」。多数の便利さの代金を少数が払う形になる、ということです。',
    },
    rules: ['passive-active', 'ing-ed-role', 'contrast-concession'],
  }),
  st('[S Distribution] [M therefore] [V provides] [O a third test {前| of ethical design}].', {
    chunks: [
      ['Distribution therefore provides a third test', 'そのため、配分のしかたが三つ目の試しになります（何のかは次へ）'],
      ['of ethical design', '倫理にかなう設計かどうかの'],
    ],
    notes: {
      'Distribution therefore provides a third test': 'Distribution は「負担と利益がどう配られるか」。therefore は前の文を受けています。',
    },
    rules: ['paragraph-map', 'reference-chain', 'main-clause-skeleton'],
  }),
  st('[S Average improvement] [V can hide] [O the fact {同格that>the fact| [接 that] [S a policy] [V helps] [O people {関係>people| [S who] [V were] [M already] [C secure]}] [M {副詞節:対比| [接 while] [V confusing] [接 or] [V excluding] [O others]}]}].', {
    chunks: [
      ['Average improvement can hide the fact', '平均の改善は、次の事実を隠すことがあります（内容は次へ）'],
      ['that a policy helps people', '政策が助けているのが〜の人だという事実です（どんな人かは次へ）'],
      ['who were already secure', 'もともと安定していた（人）'],
      ['while confusing or excluding others', 'ほかの人を混乱させたり、外したりしているという事実です'],
    ],
    notes: {
      'that a policy helps people': 'この that は the fact の中身を説明する同格の that です。secure は「安定した」。',
      'while confusing or excluding others': 'while ＋ -ing で「〜しながら」。confusing と excluding が or で並びます。',
    },
  }),
  st('[S Designers] [V need] [O evidence {前| about age, disability, language, income, digital access, and previous experience}, not merely a total response rate].', {
    chunks: [
      ['Designers need evidence about age, disability,', '設計する人には、年齢や障害についての根拠が必要です'],
      ['language, income, digital access, and previous experience,', '言語、収入、デジタル機器を使えるか、これまでの経験についても'],
      ['not merely a total response rate', '全体の反応の割合だけでは足りません'],
    ],
    notes: {
      'language, income, digital access, and previous experience,': 'about の後ろに6つの項目が並びます。',
      'not merely a total response rate': 'not merely 〜 で「ただの〜ではない」。平均や合計だけでは、だれが取り残されたか分かりません。',
    },
  }),
  st('[S {動名詞| [V Collecting] [O such data]}] [V creates] [O its own privacy risks], [接 so] [S evaluation] [V must use] [O only {what節| [S what] [V is] [C necessary]}] [接 and] [V protect] [O it] [M carefully].', {
    chunks: [
      ['Collecting such data creates its own privacy risks,', 'そうしたデータを集めること自体が、私生活が守られない危険を生みます'],
      ['so evaluation must use only what is necessary', 'だから、評価に使うのは必要なものだけにして'],
      ['and protect it carefully', 'それをていねいに守らなければなりません'],
    ],
    notes: {
      'Collecting such data creates its own privacy risks,': 'Collecting such data は動名詞のまとまりで、文の主語です。',
      'so evaluation must use only what is necessary': 'what is necessary は「必要なもの」という名詞のまとまりで、use の目的語です。',
    },
  }),
  st('[M Even] [S a successful intervention] [V should not become] [C permanent] [M {前| without review}].', {
    chunks: [
      ['Even a successful intervention', 'うまくいった働きかけであっても'],
      ['should not become permanent without review', '見直しなしに、ずっと続くものにするべきではありません'],
    ],
    notes: {
      'Even a successful intervention': 'Even は「〜であっても」と主語を強めています。',
      'should not become permanent without review': 'permanent は「ずっと変わらない」。without review は「見直しをしないまま」。',
    },
    rules: ['paragraph-map', 'negation-scope', 'svoc-core'],
  }),
  st('[S People] [V learn], [S markets] [V adapt], [S technologies] [V change], [接 and] [S a once-helpful default] [V may become] [C irrelevant or exploitable].', {
    chunks: [
      ['People learn, markets adapt, technologies change,', '人は学び、市場は合わせて変わり、技術も変わります'],
      ['and a once-helpful default may become', 'そして、かつて役立った初期設定が（どうなるかは次へ）'],
      ['irrelevant or exploitable', '合わないものや、悪用されうるものになりかねません'],
    ],
    notes: {
      'People learn, markets adapt, technologies change,': '短い3つの文が並び、どれも「変わっていく」ことを示します。',
      'irrelevant or exploitable': 'once-helpful は「かつて役に立っていた」。exploitable は「悪用されうる」。',
    },
  }),
  st('[S Review dates] [V force] [O institutions] [C {to:補語| [V to restate] [O the goal], [V publish] [O results], [V examine] [O unequal effects], [接 and] [V consider] [O less intrusive alternatives]}].', {
    chunks: [
      ['Review dates force institutions to restate the goal,', '見直しの期日があると、組織は目標を言い直すことになります'],
      ['publish results, examine unequal effects,', '結果を公表し、偏った影響を調べ'],
      ['and consider less intrusive alternatives', 'より立ち入らないやり方も検討することになります'],
    ],
    notes: {
      'Review dates force institutions to restate the goal,': 'force ＋ 人 ＋ to 〜 で「人にどうしても〜させる」。to の後ろに4つの動作が並びます。',
      'and consider less intrusive alternatives': 'intrusive は「立ち入りすぎる」。less intrusive で「より立ち入らない」。',
    },
  }),
  st('[S A scheduled review] [V can] [M also] [V reveal] [O {whether節| [接 whether] [S people] [V have learned] [O {to:名詞| [V to avoid] [接 or] [V exploit] [O the original design]}]}].', {
    chunks: [
      ['A scheduled review can also reveal', '前もって決めた見直しは、明らかにもできます（何をかは次へ）'],
      ['whether people have learned', '人が〜するようになっていないかを（何をかは次へ）'],
      ['to avoid or exploit the original design', 'もとの設計を避けたり、悪用したり'],
    ],
    notes: {
      'to avoid or exploit the original design': 'learn to 〜 で「〜するようになる」。to avoid と (to) exploit が or で並びます。',
    },
  }),
  st('[S Scheduled reviews] [M also] [V make] [O failure] [C informative] [M {前| rather than {動名詞| [V allowing] [O an ineffective design] [C {to:補語| [V to survive] [M {前| through habit}]}]}}].', {
    chunks: [
      ['Scheduled reviews also make failure informative', '決められた見直しは、失敗を学びにも変えます'],
      ['rather than allowing an ineffective design', '効き目のない設計を放っておくのではなく（どうなるのをかは次へ）'],
      ['to survive through habit', '習慣だけで生き残るのを'],
    ],
    notes: {
      'Scheduled reviews also make failure informative': 'make ＋ もの ＋ 形容詞 で「ものを〜の状態にする」。informative は「役に立つことを教えてくれる」。',
      'to survive through habit': 'allow ＋ もの ＋ to 〜 で「ものが〜するのを許す」。through habit は「習慣で・なんとなく続いて」。',
    },
  }),
  st('[S Democratic oversight] [V is] [M especially] [C important] [M {副詞節:時| [接 when] [S choice architecture] [V is used] [M {前| by public institutions}]}].', {
    chunks: [
      ['Democratic oversight is especially important', '民主的な見張りが特に大事になります（どんなときかは次へ）'],
      ['when choice architecture is used by public institutions', '選択のしくみを公の組織が使うときには'],
    ],
    notes: {
      'Democratic oversight is especially important': 'oversight はここでは「見張り・監督」。',
      'when choice architecture is used by public institutions': 'is used が受け身で、by 以下がその動作をする側です。',
    },
    rules: ['paragraph-map', 'passive-active', 'main-clause-skeleton'],
  }),
  st('[S Citizens] [V need not vote] [M {前| on every button or sentence}], [接 but] [S they] [V should be] [C able {to:副詞(形容詞)| [V to challenge] [O goals, evidence, and hidden burdens]}].', {
    chunks: [
      ['Citizens need not vote', '市民が投票する必要はありません（何にかは次へ）'],
      ['on every button or sentence,', 'ボタンや文の一つ一つに'],
      ['but they should be able to challenge', 'しかし、異議を言えるべきです（何にかは次へ）'],
      ['goals, evidence, and hidden burdens', '目標や根拠、隠れた負担に'],
    ],
    notes: {
      'Citizens need not vote': 'need not 〜 で「〜する必要はない」。',
      'but they should be able to challenge': 'challenge はここでは「異議を申し立てる」。be able to 〜 で「〜できる」。',
    },
  }),
  st('[S Independent review] [V can test] [O {whether節| [接 whether] [S claimed benefits] [V are] [C real]} and {whether節| [接 whether] [S commercial or political interests] [V have shaped] [O the design]}].', {
    chunks: [
      ['Independent review can test', '外からの独立した審査なら、確かめられます（何をかは次へ）'],
      ['whether claimed benefits are real', '言われている良さが本当かどうか'],
      ['and whether commercial or political interests', 'そして、商売や政治の思惑が'],
      ['have shaped the design', '設計を左右していないかを'],
    ],
    notes: {
      'whether claimed benefits are real': 'claimed は「主張されている」。2つの whether のまとまりが and で並び、どちらも test の目的語です。',
    },
  }),
  st('[S Public explanation] [V should describe] [O not only {what節| [O what] [S the system] [V does]} but {疑問詞節| [M why] [S that architecture] [V was chosen] [M {前| over plausible alternatives}]}].', {
    chunks: [
      ['Public explanation should describe not only', '公の説明が示すべきなのは、〜だけではありません（何かは次へ）'],
      ['what the system does', 'そのしくみが何をするか'],
      ['but why that architecture was chosen', 'なぜその設計が選ばれたのかも示すべきです（何と比べてかは次へ）'],
      ['over plausible alternatives', 'ほかにもありえた案よりも'],
    ],
    notes: {
      'but why that architecture was chosen': 'not only A but B で「AだけでなくBも」。was chosen は受け身です。',
      'over plausible alternatives': 'choose A over B で「BよりAを選ぶ」。plausible は「ありえそうな・もっともな」。',
    },
  }),
  st('[S The lesson] [V is] [C neither {that節| [接 that] [S nudges] [V are] [C harmless]} nor {that節| [接 that] [S all influence] [V is] [C manipulation]}].', {
    chunks: [
      ['The lesson is neither that nudges are harmless', '学べることは、ナッジが無害だということでもなく'],
      ['nor that all influence is manipulation', 'すべての影響が操作だということでもありません'],
    ],
    notes: {
      'The lesson is neither that nudges are harmless': 'neither A nor B で「AでもBでもない」。2つの that 節が並びます。',
      'nor that all influence is manipulation': 'manipulation は「（人を）思うように動かすこと」。どちらの極端も退けています。',
    },
    rules: ['paragraph-map', 'negation-scope', 'author-stance'],
  }),
  st('[S Choice architecture] [V is] [C unavoidable], [接 but] [S particular architectures] [V are not].', {
    chunks: [
      ['Choice architecture is unavoidable,', '選択のしくみそのものは避けられません'],
      ['but particular architectures are not', 'しかし、ある特定の作り方が避けられないわけではありません'],
    ],
    notes: {
      'but particular architectures are not': 'are not の後ろに unavoidable が省かれています。どう作るかは選べる、という筆者の要点です。',
    },
  }),
  st('[S A responsible design] [V pursues] [O a legitimate goal], [V preserves] [O a real exit], [V examines] [O distribution], [V limits] [O data], [接 and] [V remains] [C open {前| to revision}].', {
    chunks: [
      ['A responsible design pursues a legitimate goal,', '責任ある設計は、正当な目標を追い'],
      ['preserves a real exit, examines distribution,', '本当に抜けられる道を残し、配分を調べ'],
      ['limits data, and remains open to revision', 'データを集めすぎず、直す余地を残し続けます'],
    ],
    notes: {
      'A responsible design pursues a legitimate goal,': '5つの動詞が並び、主語はどれも A responsible design です。',
      'limits data, and remains open to revision': 'remain open to 〜 で「〜に開かれたままである」。revision は「見直し・書き直し」。',
    },
  }),
  st('[S Convenience] [V becomes] [C ethically defensible] [M only {副詞節:時| [接 when] [S the people {関係>the people| [S whose behavior] [V is shaped]}] [V can understand], [V refuse], [接 and] [V contest] [O the terms {前| of that convenience}]}].', {
    chunks: [
      ['Convenience becomes ethically defensible only', '便利さが倫理の面で正しいと言えるのは、〜のときだけです'],
      ['when the people whose behavior is shaped', '行動を形づくられる人たちが'],
      ['can understand, refuse, and contest the terms', 'その条件を理解し、断り、異議を言えるとき'],
      ['of that convenience', 'その便利さの（条件を）'],
    ],
    notes: {
      'when the people whose behavior is shaped': 'whose behavior is shaped は the people を後ろから説明して「行動を形づくられる人たち」。',
      'can understand, refuse, and contest the terms': '3つの動詞が並びます。contest は「異議を申し立てる」。terms は「条件」。',
    },
    rules: ['negation-scope', 'relative-clause', 'author-stance'],
  }),
])
