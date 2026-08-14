// 意味フレーズを機械的なSVOCM境界より優先する、本文別の確定値。
// キーは実際に発音する連続した原文英語で、構造上の補いは displayEn だけに置く。

const item = (ja, grammar = '', options = {}) => Object.freeze({
  ja,
  grammar,
  ...options,
})

const sentence = (phrases) => Object.freeze(phrases)
const split = (...phrases) => Object.freeze({ split: Object.freeze(phrases) })

export const READING_MEANING_PHRASE_OVERRIDES = Object.freeze({
  'She goes to school by bus every morning.': sentence({
    'She goes': item(
      '彼女は行きます',
      'She がS、goes がVです。ただし、二語で自然な一息の意味になるため、一つのフレーズで読みます。',
    ),
  }),

  'Rina is a junior high school student.': sentence({
    'is a junior high school student': item(
      '一人の中学生です',
      'is と補語 a junior high school student を一つの述部として読みます。SVCの分析は内部注釈で確認します。',
    ),
  }),

  'Many families come early because the room is not very large.': sentence({
    'Many families come': item(
      '多くの家族が来ます',
      'Many families がS、come がVです。ここは一息で意味が完成します。',
    ),
    'is not very large': item(
      'あまり広くありません（からです）',
      'is not と補語 very large を分断せず、一つの状態として読みます。括弧内で because の理由関係を節末に受け直します。',
    ),
  }),

  'The students began to understand how temperature, rain, and insects affected the vegetables.': sentence({
    'began to understand': item(
      '理解し始めました（何を理解したかは次へ）',
      'begin to do は「〜し始める」です。began と to understand を一つの述語として読み、how 以下の理解内容へつなげます。',
    ),
  }),

  'Visitors are expected to sit with volunteers and take part in the work instead of simply leaving an item at a counter.': sentence({
    'are expected to sit': item(
      '座ることが求められています（だれと座るかは次へ）',
      'be expected to do は「〜することが求められている」です。受動態と後続の不定詞を分断せず、一つの述語として読みます。',
    ),
  }),

  'In recent years, however, some of the most useful technologies have been designed to be almost invisible.': sentence({
    'have been designed to be almost invisible': item(
      'ほとんど目立たないように設計されてきました',
      'have been designed が受動態の述語、to be almost invisible が設計された状態・ねらいです。二つを合わせて一つの意味になる述部として読みます。',
    ),
  }),

  'For example, several train stations have introduced sensors that measure how crowded each platform is.': sentence({
    'how crowded each platform is': item(
      '各ホームがどれほど混雑しているのかを（測ります）',
      'how＋形容詞の間接疑問です。疑問文の語順にはせず、how crowded＋S＋V の順で「どれほど混雑しているのか」という一つの内容として読みます。',
    ),
  }),

  'Volunteers must refuse jobs that could be dangerous, and replacement parts are sometimes unavailable or too expensive.': sentence({
    'are sometimes unavailable': item(
      'ときには入手できません',
      'are と頻度の副詞 sometimes、補語 unavailable を一つの状態として読みます。後ろの or too expensive と並ぶ一つ目の述部です。',
    ),
  }),

  'Large infrastructure projects are attractive to politicians because they are visible and can be announced as decisive action.': sentence({
    'are visible': item(
      '目に見える状態で',
      'be動詞と補語 visible を一つにします。and の後ろの can be announced と理由を共有するため、ここでは「状態で」と次へつなぎます。',
    ),
  }),

  'It must also recognize that the absence of disaster is not proof that preparation was unnecessary.': sentence({
    'was unnecessary': item(
      '不要だったという（証拠ではありません）',
      'that preparation was unnecessary が proof の内容です。was と補語 unnecessary を一つにし、括弧で is not proof へ受け直します。',
    ),
  }),

  'Technology should be judged not by how modern it appears, but by whether it solves a real problem for the people who use the space.': sentence({
    'how modern it appears': item(
      'それがどれほど現代的に見えるかによって',
      'how＋形容詞の間接疑問で、how modern が appears の見え方の程度を表します。how modern＋S＋V 全体が not by の評価基準です。',
    ),
  }),

  'A science class decided to study the problem instead of simply asking everyone to eat more.': sentence({
    'decided to study the problem': item(
      'その問題を調べることにしました',
      'decide to do は「〜することに決める」です。to study と目的語 the problem までを含めて一つの決定内容として読みます。',
    ),
    'asking everyone to eat more': item(
      '全員にもっと食べるよう求めるのではなく（単に）',
      'ask O to do は「Oに〜するよう求める」です。everyone が to eat の意味上の主語で、more までを一つの要求内容として読みます。',
    ),
  }),

  'The students used this advice to plan a second garden, which made the project continue beyond one school term.': sentence({
    'made the project continue beyond one school term': item(
      'この活動を一学期を越えて続けさせました',
      'make O do は「Oに〜させる」です。the project を continue の意味上の主語として捉え、期間の beyond one school term までを一つの出来事として読みます。',
    ),
  }),

  'Staff members used to write long explanations for adults, but they now ask student volunteers to read the labels first.': sentence({
    'ask student volunteers to read the labels first': item(
      '学生ボランティアに、その説明文を最初に読むよう頼みます',
      'ask O to do は「Oに〜するよう頼む」です。student volunteers が to read の意味上の主語で、the labels と first までが頼む内容です。',
    ),
  }),

  'At these events, local volunteers help visitors examine broken things and, when possible, repair them.': sentence({
    'help visitors examine broken things': item(
      '来場者が壊れた物を調べるのを手助けします',
      'help O do は「Oが〜するのを手助けする」です。visitors を「来場者を」と切らず、examine broken things までと一つにします。',
    ),
  }),

  'This process allows participants to gain practical skills and confidence.': sentence({
    'allows participants to gain practical skills and confidence': item(
      '参加者が実用的な技能と自信を身につけられるようにします',
      'allow O to do は「Oが〜できるようにする」です。participants を to gain の意味上の主語として、二つの目的語まで一つにします。',
    ),
  }),

  'In addition, the events encourage people to think differently about ownership.': sentence({
    'encourage people to think differently about ownership': item(
      '人々に、所有について異なる見方で考えるよう促します',
      'encourage O to do は「Oに〜するよう促す」です。people が think の意味上の主語で、differently と about ownership までが促す内容です。',
    ),
  }),

  'If these issues are handled carefully, quiet technology can improve public spaces without making people feel controlled by it.': sentence({
    'making people feel controlled by it': item(
      '人々に、その技術に支配されていると感じさせること',
      'make O do は「Oに〜させる」です。people が feel の意味上の主語で、controlled by it までを一つの知覚内容として読みます。',
    ),
  }),

  'A park that cools a wealthy district, for example, may increase nearby rents and force lower-income residents to move before they enjoy the benefits.': sentence({
    'force lower-income residents to move': item(
      '低所得の住民に転居を強いるかもしれません',
      'force O to do は「Oに〜することを強いる」です。lower-income residents が to move の意味上の主語です。',
    ),
  }),

  'Local knowledge also helps officials identify failures that computer models miss.': sentence({
    'helps officials identify failures': item(
      '行政担当者が不具合を見つける助けになります',
      'help O do は「Oが〜する助けになる」です。officials を identify の意味上の主語として、failures までを一つの内容で読みます。',
    ),
    'computer models miss': item(
      'コンピューターモデルが見落とす不具合を、行政担当者が見つける助けになります',
      'computer models がS、miss がVです。関係詞 that の先行詞 failures を目的語として補い、括弧なしでも前の help 構文へ戻れる訳にします。',
    ),
  }),

  'Setting review dates and publishing results allows governments to revise policies without treating revision as failure.': sentence({
    'allows governments to revise policies': item(
      '政府が政策を改められるようにします',
      'allow O to do は「Oが〜できるようにする」です。governments は allow のOであると同時に to revise の意味上の主語です。',
    ),
  }),

  'Daily records helped the cooking staff to prepare a better amount for each menu.': sentence({
    'helped the cooking staff to prepare': item(
      '調理スタッフが用意するのを助けました（何を用意するかは次へ）',
      'help O to do は「Oが〜するのを助ける」です。the cooking staff を to prepare の意味上の主語として一つにし、目的語へつなげます。',
    ),
  }),

  'Many research groups need more information, so they invite ordinary people to join projects known as citizen science.': sentence({
    'invite ordinary people to join projects': item(
      '一般の人々に、活動へ参加するよう呼びかけます',
      'invite O to do は「Oに〜するよう呼びかける」です。ordinary people が to join の意味上の主語で、projects までが参加先です。',
    ),
  }),

  'They provide pictures and recordings that help volunteers identify species correctly.': sentence({
    'help volunteers identify species correctly': item(
      'ボランティアが鳥の種を正しく特定する助けになります（写真と録音が）',
      'help O do は「Oが〜する助けになる」です。volunteers を identify の意味上の主語として、species correctly までを一つにします。',
    ),
  }),

  'Digital records can also help consumers follow their spending and allow small businesses to sell goods online.': sentence({
    'can also help consumers follow their spending': item(
      '消費者が自分の支出を追えるよう、さらに助けることができます',
      'help O do は「Oが〜するのを助ける」です。consumers を follow の意味上の主語として、their spending までを一つにします。',
    ),
  }),

  'Instead, they help readers to judge how strong a conclusion can reasonably be.': sentence({
    'help readers to judge': item(
      '読み手が判断するのを助けます',
      'help O to do は「Oが〜するのを助ける」です。readers を to judge の意味上の主語として一つにし、判断内容の how 以下へつなげます。',
    ),
    'how strong a conclusion can reasonably be': item(
      '結論をどの程度強く述べるのが妥当かを',
      'how＋形容詞＋a＋名詞＋S＋V の間接疑問です。how strong a conclusion を一まとまりで捉え、can reasonably be までで判断内容を完成させます。',
    ),
  }),

  'Context does not excuse every poor result; it helps institutions distinguish causes that demand different responses.': sentence({
    'helps institutions distinguish causes': item(
      '制度が原因を区別する助けになります',
      'help O do は「Oが〜する助けになる」です。institutions を distinguish の意味上の主語として、causes までを一つにします。',
    ),
  }),

  'The brain begins to feel sleepy later at night, but students must still wake up early for school.': sentence({
    'begins to feel sleepy': item(
      '眠気を感じ始めます',
      'begin to do と feel＋C が重なった述語です。to feel と補語 sleepy を切り離さず、「眠気を感じ始める」と一つにします。',
    ),
  }),

  'At one school, students helped design the change, and their suggestions produced a bus timetable that protected both sleep and afternoon activities.': sentence({
    'helped design the change': item(
      'その変更を設計するのを手伝いました',
      'help＋動詞の原形は「〜するのを手伝う」です。helped、補われる to を伴う design、目的語 the change を一つの意味として読みます。',
      { displayEn: 'helped (to) design the change' },
    ),
  }),

  'A school may devote more time to easily tested skills while neglecting discussion, curiosity, or students whose improvement is unlikely to change its ranking.': sentence({
    'is unlikely to change its ranking': item(
      '学校の順位を変える見込みが低い（その向上は）',
      'be unlikely to do は「〜する見込みが低い」です。to change の目的語 its ranking までを含め、whose improvement の述語として読みます。',
    ),
  }),

  'At the same time, they need intellectual habits that prevent skepticism from turning into cynicism.': sentence({
    'prevent skepticism from turning into cynicism': item(
      '懐疑心が冷笑へ変わるのを防ぎます',
      'prevent O from -ing は「Oが〜するのを防ぐ」です。skepticism は prevent のOですが、from turning の意味上の主語なので、日本語では「懐疑心が」と訳します。',
    ),
  }),

  'Citizen science is valuable not because volunteers replace professionals, but because the two groups contribute different strengths.': sentence({
    'is valuable': item(
      '価値があります',
      'is と補語 valuable を一つの状態として読みます。後ろの not because ... but because ... が、その理由を対比します。',
    ),
  }),

  'Yet these details alone do not show whether the health claim is reliable.': sentence({
    'is reliable': item(
      '信頼できるのかを（示しません）',
      'whether節内の is＋C です。主張が信頼できるかを一つにし、括弧で do not show へ受け直します。',
    ),
  }),

  'A careful reader first asks who produced the message and what evidence is actually available.': sentence({
    'A careful reader first asks': item(
      '注意深い読み手は最初に尋ねます',
      'S＋時の副詞＋Vが一息の導入になります。尋ねる二つの内容は後ろで順に示されます。',
    ),
    'is actually available': item(
      '実際に利用可能なのかを（尋ねます）',
      'what evidence を主語とする間接疑問の述部です。is、actually、available を一つにします。',
    ),
  }),

  'None of these questions gives a quick promise that a claim is true or false.': sentence({
    'is true or false': item(
      '正しいのか誤りなのかという（保証を）',
      'is の補語として true と false が or で並列されています。that節の内容を完成させ、括弧で a quick promise へ受け直します。',
    ),
  }),

  'It should be to preserve meaningful alternatives while removing barriers that prevent people from choosing freely.': sentence({
    'prevent people from choosing freely': item(
      '人々が自由に選ぶのを妨げる（障壁を）',
      'prevent O from -ing は「Oが〜するのを妨げる」です。people を「人々を」と細切れにせず、freely までを一つの内容として読みます。',
    ),
  }),

  'They can expose failure that would otherwise remain hidden behind confident speeches or professional authority.': sentence({
    'would otherwise remain hidden': item(
      'そうでなければ隠れたままでしょう',
      'would と remain hidden が一つの述語で、otherwise はその中に入る条件の副詞です。「そうでなければ隠れたままだろう」と一息で読みます。',
    ),
  }),

  'The relevant choice is neither perfect numbers nor pure wisdom, because neither exists.': sentence({
    'is neither perfect numbers': item(
      '完全な数字でもなく',
      'neither A nor B の前半です。is と neither、補語 perfect numbers を一つにし、「Aでもなく」と読みます。',
    ),
    'nor pure wisdom': item(
      '純粋な英知でもありません',
      'neither A nor B の後半で、nor が二つ目の補語 pure wisdom を導きます。前の is を補って読みます。',
      { displayEn: 'nor (is it) pure wisdom' },
    ),
  }),

  'Critics sometimes conclude that quantification itself is the problem and that experienced professionals should simply be trusted to exercise judgment.': sentence({
    'should simply be trusted to exercise judgment': item(
      '専門的判断を行うものとして、ただ信頼されるべきだ（と結論づけます）',
      'be trusted to do は「〜するものとして信頼される」です。受動態 should be trusted と不定詞 to exercise judgment を一つの述語として読みます。',
    ),
  }),

  'This evidence makes it easier to improve a design or decide that a simpler solution would work better.': sentence({
    'makes it easier': item(
      'それを簡単にします',
      'make O C のまとまりです。it は形式目的語O、easier は目的格補語Cで、英語が短い it を先に置き、実質内容の不定詞を後ろへ送る後重心を好むことを説明します。',
    ),
    'to improve a design': item(
      '設計を改善することを',
      'to improve と目的語 a design は「設計を改善すること」という一つの不定詞内容です。',
    ),
    'decide that': item(
      'that以下の内容を判断することを',
      'decide は前の to improve と並列で、二つ目の to が省略されています。that は関係詞ではなく、decide の目的語となる内容節の入口です。',
      { displayEn: '(to) decide that' },
    ),
    'a simpler solution would work': item(
      '単純な解決策が機能するだろう',
      'a simpler solution が内容節内のS、would work がVです。このS＋Vは「解決策が機能するだろう」と一息で読みます。',
    ),
  }),

  'The integrity of public memory is then shaped less by what is available than by what is repeatedly presented as relevant.': sentence({
    separate: Object.freeze(['is repeatedly presented / as relevant']),
    'is then shaped': item(
      'そのとき形づくられます',
      'be動詞・副詞 then・過去分詞 shaped は一つの受動態の述語として読みます。',
    ),
    'by what': item(
      'あるものによって',
      'by と先行詞を含む what を一息で読み、what節全体が by の目的語になることを確認します。',
    ),
    'is available': item(
      '利用可能な（あるものによって）',
      'what節内の述語です。括弧で先に読んだ by what へ受け直します。',
    ),
    'is repeatedly presented': item(
      '繰り返し提示される（あるものによって）',
      '受動態の述語を一息で読み、二つ目の by what へ受け直します。',
      { boundaryAfter: 'as relevant' },
    ),
  }),

  'If that practice declines, even perfect archives will not prevent societies from losing their ability to learn from what they once knew.': sentence({
    'that practice declines': item(
      'その実践が衰えれば',
      'that practice が条件節内のS、declines がVです。短いS＋Vを一つの出来事として読みます。',
    ),
    'societies from losing their ability': item(
      '社会が自分たちの能力を失うのを',
      'prevent O from -ing の O は、from losing の意味上の主語です。societies を「社会を」と切り離さず、一つの内容で読みます。',
    ),
    'they once knew': item(
      '社会がかつて知っていた（ものから）',
      'they がS、once が時のM、knew がVです。三つを「社会がかつて知っていた」と一息で読み、括弧で from what の「ものから」を受け直します。',
    ),
  }),

  'The broader lesson is that innovation should be judged by the range of people who can use it, not only by the speed of its average transaction.': sentence({
    'not only by the speed of its average transaction': split(
      item(
        '〜だけでなく',
        'not only は、既出の広い評価基準と「平均速度だけ」という狭い基準を対照させる焦点表現です。',
        { en: 'not only', role: 'LINK' },
      ),
      item(
        '平均的な取引速度によって（だけではなく）',
        'by the speed of its average transaction は一つの評価基準です。括弧で not only の対照を受け直します。',
        { en: 'by the speed of its average transaction', role: 'M' },
      ),
    ),
  }),

  'The goal is not simply to remove phones, but to build habits that protect attention.': sentence({
    'The goal': item(
      '目標は',
      'not simply A, but Bという長い対照述部を見通しやすくするため、主語を先に確定し、次の述部へ送ります。',
      { boundaryAfter: 'is not simply' },
    ),
    'is not simply': item(
      '単に〜ではありません',
      'not simplyで一つ目の候補を否定する構えを作り、to remove phonesを次の意味単位として待ちます。',
      { boundaryAfter: 'to remove phones' },
    ),
  }),

  'People often describe choice as if it begins only when a person consciously compares several options.': sentence({
    it: item(
      'それが',
      'as if節の主語itを先に確定し、onlyの焦点とwhen節を含む述部begins onlyへつなぎます。',
      { boundaryAfter: 'begins only' },
    ),
  }),

  'People should be told that a default was chosen deliberately and should understand how to select another option.': sentence({
    'should understand': item(
      '理解できるようにすべきです',
      '述語should understandを確定してから、理解内容となるhow＋不定詞へ進む意図的な節境界です。',
      { boundaryAfter: 'how to select another option' },
    ),
  }),

  'An alternative is not meaningful if it is difficult to find, requires expert knowledge, or carries a punishment unrelated to the policy goal.': sentence({
    'to find,': item(
      '見つけるのが難しいなら',
      'コンマで一つ目の条件is difficult to findが閉じ、次の並列条件requires expert knowledgeへ切り替わります。',
      { boundaryAfter: 'requires expert knowledge' },
    ),
  }),

  'A scheduled review can also reveal whether people have learned to avoid or exploit the original design.': sentence({
    'to avoid or exploit the original design': item(
      '元の設計を避けたり、逆に利用したりする方法を',
      'to avoidとor exploitはtoを共有する並列不定詞で、共通目的語the original designまでを一息で読みます。',
    ),
  }),
})

export function readingMeaningPhraseOverridesFor(sentenceEnglish) {
  return READING_MEANING_PHRASE_OVERRIDES[sentenceEnglish] ?? null
}
