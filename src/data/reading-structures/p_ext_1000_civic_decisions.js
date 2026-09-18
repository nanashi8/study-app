import { st } from './entry.js'

// 語彙強化ロングリーディング（約1,000語）の構造台帳。60文すべてを手で確かめて書いた。
export default Object.freeze([
  st('[S Every public decision] [V begins] [M {前| with a simple question {前| about {疑問詞節| [S whose voice] [M actually] [V reaches] [O the room {関係>the room| [M where] [S the choice] [V is made]}]}}}].', {
    chunks: [
      ['Every public decision begins', 'どの公共の決定も始まります'],
      ['with a simple question about', '単純な問いから'],
      ['whose voice actually reaches the room', 'だれの声が実際にその場に届くのかという'],
      ['where the choice is made', '選択が行われる（場に）'],
    ],
    notes: {
      'whose voice actually reaches the room': 'この whose は疑問詞で、「だれの声が…か」という間接疑問を作ります。',
    },
  }),
  st('[S A town] [V may hold] [O meetings] [接 and] [V publish] [O notices], [接 yet] [M still] [V hear] [O only the people {関係>the people| [S who] [M already] [V know] [O {疑問詞節| [M how] [S the system] [V works]}]}].', {
    chunks: [
      ['A town may hold meetings and publish notices,', '町は会合を開き、通知を出せます'],
      ['yet still hear only the people', 'それでも聞こえるのはこういう人の声だけ、ということがあります'],
      ['who already know how the system works', '制度の仕組みをすでに知っている（人）'],
    ],
    notes: {
      'who already know how the system works': 'how the system works は「制度がどう動くか」という間接疑問です。',
    },
  }),
  st('[S Representation] [V is] [M therefore] [C a practice {前| rather than a title}].', {
    chunks: [
      ['Representation is therefore a practice', 'したがって代表とは実践であって'],
      ['rather than a title', '肩書ではありません'],
    ],
    notes: {
      'rather than a title': 'rather than … で「…ではなく」。',
    },
  }),
  st('[M {副詞節:時| [接 When] [S people] [V give] [O1 a council] [O2 a mandate]}], [S they] [V lend] [O power] [M {前| for a limited time}].', {
    chunks: [
      ['When people give a council a mandate,', '人々が議会に負託を与えるとき'],
      ['they lend power', '彼らは権力を貸しているのです'],
      ['for a limited time', '限られた期間だけ'],
    ],
    notes: {
      'When people give a council a mandate,': 'give ＋ 人 ＋ もの の形。mandate は「まかされた権限」。',
    },
  }),
  st('[S The council] [V may nominate] [O officials], [V form] [O a coalition], [接 or] [V ask] [O a committee] [C {to:補語| [V to study] [O a difficult problem]}].', {
    chunks: [
      ['The council may nominate officials,', '議会は職員を指名し'],
      ['form a coalition,', '連立を組み'],
      ['or ask a committee to study a difficult problem', 'あるいは委員会に難しい問題の調査を頼めます'],
    ],
    notes: {
      'or ask a committee to study a difficult problem': 'ask ＋ 人 ＋ to ＋ 動詞 で「人に〜するよう頼む」。',
    },
  }),
  st('[S None {前| of these steps}] [V replaces] [O the duty {to:形容詞>the duty| [V to explain] [O the decision] [M {前| to the constituency {関係>the constituency| [S that] [V granted] [O the power]}}]}].', {
    chunks: [
      ['None of these steps replaces the duty', 'こうした手続きのどれも、義務の代わりにはなりません'],
      ['to explain the decision', 'その決定を説明するという（義務の）'],
      ['to the constituency that granted the power', '権力を与えた選挙区に'],
    ],
    notes: {
      'to explain the decision': 'the duty to ＋ 動詞 で「〜する義務」。constituency は「議員を選んだ地区の人々」。',
    },
  }),
  st('[S {動名詞| [V Speaking]}] [V is] [M only] [C half {前| of representation}], [M {副詞節:理由| [接 because] [S {動名詞| [V listening]}] [V decides] [O {疑問詞節| [S whose problem] [V becomes] [C the next item]}]}].', {
    chunks: [
      ['Speaking is only half of representation,', '話すことは代表の半分にすぎません'],
      ['because listening decides', '決めるのは聞くことだからです'],
      ['whose problem becomes the next item', 'だれの問題が次の議題になるかを'],
    ],
    notes: {
      'whose problem becomes the next item': 'この whose は疑問詞で、「だれの問題が…か」という間接疑問を作ります。',
    },
  }),
  st('[S An oral report] [V reaches] [O people {関係>people| [S who] [V cannot read] [O long documents]}], [接 and] [S a printed record] [V protects] [O those {関係>those| [S who] [V cannot attend]}].', {
    chunks: [
      ['An oral report reaches people', '口頭の報告はこういう人に届きます'],
      ['who cannot read long documents,', '長い文書を読めない（人に）'],
      ['and a printed record protects those who cannot attend', 'そして印刷された記録は出席できない人を守ります'],
    ],
    notes: {
      'who cannot read long documents,': 'oral は「口で伝える」、printed は「印刷された」。',
    },
  }),
  st('[S Communities {関係>Communities| [S that] [V use] [O both methods]}] [V hear] [O a wider range {前| of residents}] [M {前| than those {関係>those| [S that] [V rely] [M {前| on one channel}]}}].', {
    chunks: [
      ['Communities that use both methods', '両方のやり方を使う地域は'],
      ['hear a wider range of residents', 'より幅広い住民の声を聞きます'],
      ['than those that rely on one channel', '一つの経路だけに頼る地域よりも'],
    ],
    notes: {
      'than those that rely on one channel': 'この those は communities の代わりです。rely on … で「…に頼る」。',
    },
  }),
  st('[S Dissent] [M often] [V shows] [O {that節| [接 that] [S a plan] [V has] [M not yet] [V been explained] [M clearly enough] [M {前| to the people {関係省略:目的格>the people| [S it] [V affects]}}]}].', {
    chunks: [
      ['Dissent often shows that a plan', '反対意見はしばしば、計画が〜だと示します'],
      ['has not yet been explained clearly enough', 'まだ十分はっきりと説明されていない'],
      ['to the people it affects', 'その計画が影響を与える人々に'],
    ],
    notes: {
      'to the people it affects': 'people の後ろに目的格の関係代名詞が省かれています。',
    },
  }),
  st('[M {副詞節:条件| [接 If] [S a council] [V treats] [O every objection] [C {前| as an attack}]}], [S it] [V will] [M soon] [V receive] [O silence] [M {前| instead of assent}].', {
    chunks: [
      ['If a council treats every objection as an attack,', '議会があらゆる異議を攻撃として扱えば'],
      ['it will soon receive silence', 'やがて返ってくるのは沈黙で'],
      ['instead of assent', '同意ではありません'],
    ],
    notes: {
      'If a council treats every objection as an attack,': 'treat A as B で「AをBとして扱う」。objection は「異議」。',
    },
  }),
  st('[S The habit {前| of {動名詞| [V answering] [O questions] [M {前| in public}]}}] [V turns] [O an official body] [M {前| into a representative one}].', {
    chunks: [
      ['The habit of answering questions in public', '公の場で質問に答えるという習慣が'],
      ['turns an official body', '公式の組織を'],
      ['into a representative one', '代表する組織へと変えます'],
    ],
    notes: {
      'into a representative one': 'turn A into B で「AをBに変える」。この one は body の代わりです。',
    },
  }),
  st('[S Rules] [V become] [C real] [M only] [M {副詞節:時| [接 when] [S everyone] [V can find out] [O their content and their limits]}].', {
    chunks: [
      ['Rules become real only when', '規則が現実のものになるのは'],
      ['everyone can find out their content and their limits', 'だれもがその中身と限界を調べられるときだけです'],
    ],
    notes: {
      'everyone can find out their content and their limits': 'find out … で「調べて知る」。',
    },
  }),
  st('[S A court] [V has] [O jurisdiction] [M {前| over certain places and certain kinds {前| of dispute}}].', {
    chunks: [
      ['A court has jurisdiction', '裁判所が権限を持つのは'],
      ['over certain places', '決まった場所と'],
      ['and certain kinds of dispute', '決まった種類の争いについてです'],
    ],
    notes: {
      'A court has jurisdiction': 'jurisdiction は「裁く権限の及ぶ範囲」。',
    },
  }),
  st('[M {前| Outside those limits}] [S its orders] [V carry] [O no weight] [M {前| at all}], [M {副詞節:譲歩| [C however reasonable] [S they] [V may sound]}].', {
    chunks: [
      ['Outside those limits its orders carry no weight at all,', 'その範囲の外では、その命令にまったく効力はありません'],
      ['however reasonable they may sound', 'どれほど筋が通って聞こえても'],
    ],
    notes: {
      'however reasonable they may sound': 'however ＋ 形容詞 で「どれほど〜でも」。文の後ろに譲歩のまとまりを作ります。',
    },
  }),
  st('[S Citizens {関係>Citizens| [S who] [V understand] [O the limits {前| of a rule}]}] [V can] [M also] [V see] [O {疑問詞節| [M where] [S their own responsibility] [V begins]}].', {
    chunks: [
      ['Citizens who understand the limits of a rule', '規則の限界を分かっている市民は'],
      ['can also see', '見て取ることもできます'],
      ['where their own responsibility begins', '自分の責任がどこから始まるのかを'],
    ],
    notes: {
      'where their own responsibility begins': 'この where は疑問詞で、「どこから始まるか」という間接疑問を作ります。',
    },
  }),
  st('[S A fair system] [V treats] [O a person {関係>a person| [S who] [V is accused] [M {前| of a crime}]}] [C {前| as innocent}] [M {副詞節:時| [接 until] [S the evidence] [V has been tested]}].', {
    chunks: [
      ['A fair system treats a person', '公正な制度は、こういう人を'],
      ['who is accused of a crime', '犯罪で訴えられた（人を）'],
      ['as innocent', '無実の者として扱います'],
      ['until the evidence has been tested', '証拠が確かめられるまでは'],
    ],
    notes: {
      'who is accused of a crime': 'be accused of … で「…の罪で訴えられる」。',
    },
  }),
  st('[S Prosecutors] [V must show] [O {疑問詞節| [M why] [S the charge] [V fits] [O the facts]}], [接 and] [S the defense] [V may challenge] [O every provision {関係省略:目的格(relies)>every provision| [S the state] [V relies] [M on]}].', {
    chunks: [
      ['Prosecutors must show', '検察は示さねばなりません'],
      ['why the charge fits the facts,', 'なぜその訴えが事実に合うのかを'],
      ['and the defense may challenge every provision', 'そして弁護側はどの条項にも異議を唱えられます'],
      ['the state relies on', '国がよりどころにする（条項に）'],
    ],
    notes: {
      'the state relies on': 'provision の後ろに目的格の関係代名詞が省かれています。文の終わりに on が残っています。',
    },
  }),
  st('[S This slow procedure] [V protects] [O the innocent] [M far more often] [M {副詞節:比較| [接 than] [S it] [V protects] [O the guilty]}].', {
    chunks: [
      ['This slow procedure protects the innocent', 'この時間のかかる手続きが守るのは無実の人で'],
      ['far more often than it protects the guilty', '罪を犯した人を守るよりはるかに多いのです'],
    ],
    notes: {
      'This slow procedure protects the innocent': 'the ＋ 形容詞 で「〜な人々」。the innocent は「無実の人々」。',
    },
  }),
  st('[S Punishment] [V is] [M sometimes] [V defended] [M {前| as a deterrent}], [接 but] [S a penalty] [V deters] [O nobody] [M {副詞節:条件| [接 if] [S the rule itself] [V is] [C unknown]}].', {
    chunks: [
      ['Punishment is sometimes defended as a deterrent,', '刑罰は抑止力として擁護されることがあります'],
      ['but a penalty deters nobody', 'けれども罰はだれも思いとどまらせません'],
      ['if the rule itself is unknown', '規則そのものが知られていなければ'],
    ],
    notes: {
      'but a penalty deters nobody': 'deterrent は「思いとどまらせるもの」、deter は「思いとどまらせる」。',
    },
  }),
  st('[S A clear law {前| with a small penalty}] [M often] [V changes] [O behavior] [M more] [M {前| than a harsh law {形容詞>a harsh law| full {前| of loopholes}}}].', {
    chunks: [
      ['A clear law with a small penalty', '罰の軽い明確な法律は'],
      ['often changes behavior more', 'しばしば行動をよりよく変えます'],
      ['than a harsh law full of loopholes', '抜け穴だらけの厳しい法律よりも'],
    ],
    notes: {
      'than a harsh law full of loopholes': 'loophole は「抜け穴」。full of … で「…だらけの」。',
    },
  }),
  st('[S Each decision] [M also] [V creates] [O a precedent {関係>a precedent| [O that] [S later courts] [V will read] [C {前| as guidance}]}].', {
    chunks: [
      ['Each decision also creates a precedent', 'どの判断も先例を作ります'],
      ['that later courts will read as guidance', 'のちの裁判所が指針として読む（先例を）'],
    ],
    notes: {
      'that later courts will read as guidance': 'precedent は「先例」、guidance は「手引き」。',
    },
  }),
  st('[S Rights and duties] [V appear] [M together], [M {副詞節:理由| [接 because] [S a right {関係>a right| [S that] [V entitles] [O one person]}] [V makes] [O some action] [C obligatory] [M {前| for another}]}].', {
    chunks: [
      ['Rights and duties appear together,', '権利と義務は対になって現れます'],
      ['because a right that entitles one person', 'ある人に資格を与える権利は'],
      ['makes some action obligatory for another', '別の人に何らかの行為を義務づけるからです'],
    ],
    notes: {
      'makes some action obligatory for another': 'make ＋ 目的語 ＋ 形容詞 で「〜を…にする」。obligatory は「しなければならない」。',
    },
  }),
  st('[M {副詞節:時| [接 When] [S a legislature] [V enacts] [O a rule]}], [S the useful question] [V is] [M not only] [C {疑問詞節| [O what] [S it] [V forbids]}] [接 but] [C {疑問詞節| [S who] [V must act]}].', {
    chunks: [
      ['When a legislature enacts a rule,', '議会が規則を制定するとき'],
      ['the useful question is not only what it forbids', '役に立つ問いは、何を禁じるのかだけでなく'],
      ['but who must act', 'だれが動かねばならないのか、です'],
    ],
    notes: {
      'but who must act': 'not only A but B で「AだけでなくBも」。legislature は「議会」。',
    },
  }),
  st('[S An argument {前| about a public choice}] [V is] [M only] [C as good] [M {前| as the information {関係>the information| [O that] [S both sides] [V are able to check]}}].', {
    chunks: [
      ['An argument about a public choice', '公共の選択をめぐる議論は'],
      ['is only as good as the information', 'その情報と同じ程度にしかよくなりません'],
      ['that both sides are able to check', '双方が確かめられる（情報と）'],
    ],
    notes: {
      'is only as good as the information': 'as … as ～ で「～と同じくらい…」。be able to ＋ 動詞 で「〜できる」。',
    },
  }),
  st('[S Comparison] [V becomes] [C impossible] [M {副詞節:時| [接 when] [S key figures] [V are hidden, delayed, or expressed] [M {前| in language {関係>language| [O that] [S no outsider] [V understands]}}]}].', {
    chunks: [
      ['Comparison becomes impossible', '比較はできなくなります'],
      ['when key figures are hidden, delayed, or expressed', '大事な数字が隠され、遅らされ、あるいは書かれるときには'],
      ['in language that no outsider understands', '部外者にはだれも分からない言葉で'],
    ],
    notes: {
      'in language that no outsider understands': 'figure はここでは「数字」。outsider は「外の人」。',
    },
  }),
  st('[S Openness] [V is] [M therefore not] [C a courtesy {関係>a courtesy| [O that] [S officials] [V may offer]}] [接 but] [C a condition {前| for honest debate}].', {
    chunks: [
      ['Openness is therefore not a courtesy', 'したがって公開とは、厚意ではありません'],
      ['that officials may offer', '当局が差し出してもよい（厚意）'],
      ['but a condition for honest debate', '誠実な議論の条件なのです'],
    ],
    notes: {
      'but a condition for honest debate': 'not A but B で「AではなくB」。courtesy は「厚意・心づかい」。',
    },
  }),
  st('[S Misinformation] [V spreads] [M {副詞節:時| [接 when] [S people] [V repeat] [O a claim {関係>a claim| [O that] [S they] [V believe] [C {to:補語| [V to be] [C true]}]}]}].', {
    chunks: [
      ['Misinformation spreads', '誤情報が広がるのは'],
      ['when people repeat a claim', '人々が主張を繰り返すときです'],
      ['that they believe to be true', '本当だと信じている（主張を）'],
    ],
    notes: {
      'that they believe to be true': 'believe ＋ 目的語 ＋ to be … で「〜を…だと信じる」。',
    },
  }),
  st('[S Disinformation] [V spreads] [M {副詞節:時| [接 when] [S someone] [V knows] [O {that節| [接 that] [S the claim] [V is] [C false]}] [接 and] [V shares] [O it] [M anyway]}].', {
    chunks: [
      ['Disinformation spreads', '偽情報が広がるのは'],
      ['when someone knows that the claim is false', 'その主張が誤りだとだれかが知りながら'],
      ['and shares it anyway', 'それでも広めるときです'],
    ],
    notes: {
      'when someone knows that the claim is false': 'この that は接続詞で、knows の目的語になる名詞のまとまりを作ります。',
    },
  }),
  st('[S The two problems] [V look] [C alike] [M {前| on a screen}], [接 and yet] [S they] [V need] [O completely different answers].', {
    chunks: [
      ['The two problems look alike on a screen,', 'この二つの問題は画面の上ではよく似ています'],
      ['and yet they need completely different answers', 'それでも必要な答えはまったく違います'],
    ],
    notes: {
      'The two problems look alike on a screen,': 'look ＋ 形容詞 で「〜に見える」。alike は「よく似ている」。',
    },
  }),
  st('[S The first] [V is treated] [M {前| by a better explanation}], [接 and] [S the second] [M {前| by {動名詞| [V tracing] [O {疑問詞節| [S who] [V gains] [M {前| from the story}]}]}}].', {
    chunks: [
      ['The first is treated by a better explanation,', '前者に効くのはよりよい説明で'],
      ['and the second by tracing', '後者に効くのはたどることです'],
      ['who gains from the story', 'その話でだれが得をするのかを'],
    ],
    notes: {
      'and the second by tracing': 'the second の後ろに is treated が省かれています。',
    },
  }),
  st('[S Every medium] [V shapes] [O {what節| [O what] [S it] [V carries]}], [M {副詞節:理由| [接 because] [S a broadcast] [V compresses] [M {副詞節:対比| [接 while] [S a document] [V accumulates]}]}].', {
    chunks: [
      ['Every medium shapes what it carries,', 'どの媒体も、運ぶ中身を形づくります'],
      ['because a broadcast compresses', '放送は切り詰め'],
      ['while a document accumulates', '文書は積み上げるからです'],
    ],
    notes: {
      'Every medium shapes what it carries,': 'この what は「〜するもの」という意味の名詞のまとまりを作ります。medium は「伝える手立て」。',
    },
  }),
  st('[S A reader {関係>A reader| [S who] [V is] [C literate] [M {前| in one medium}]}] [V may] [M still] [V be] [C almost helpless] [M {前| in another}].', {
    chunks: [
      ['A reader who is literate in one medium', 'ある媒体を読みこなせる読者でも'],
      ['may still be almost helpless', 'ほとんど何もできないことがあります'],
      ['in another', '別の媒体では'],
    ],
    notes: {
      'A reader who is literate in one medium': 'literate は「読み書きができる・読みこなせる」。',
    },
  }),
  st('[S Schools {関係>Schools| [S that] [V teach] [O students] [C {to:補語| [V to check] [O a source, a date, and a credential]}]}] [V give] [O1 them] [O2 a skill {関係省略:目的格(use)>a skill| [S they] [V will use] [M {前| for decades}]}].', {
    chunks: [
      ['Schools that teach students to check', '確かめるよう生徒に教える学校は'],
      ['a source, a date, and a credential', '出典と日付と資格を'],
      ['give them a skill', '生徒に技能を与えます'],
      ['they will use for decades', '何十年も使う（技能を）'],
    ],
    notes: {
      'a source, a date, and a credential': 'credential は「資格を示すもの」。',
    },
  }),
  st('[S Officials] [M often] [V answer] [M {前| through a spokesman}], [接 and] [S the public] [M then] [V judges] [O the office] [M {前| by that single voice}].', {
    chunks: [
      ['Officials often answer through a spokesman,', '当局はしばしば報道官を通して答えます'],
      ['and the public then judges the office', 'すると人々はその役所を判断します'],
      ['by that single voice', 'その一つの声によって'],
    ],
    notes: {
      'Officials often answer through a spokesman,': 'spokesman は「代わりに話す役の人」。',
    },
  }),
  st('[S {what節| [S What] [V matters] [M most]}] [V is] [C {that節| [接 that] [S a citizen] [V can reach] [O the original figure] [M {前| without {動名詞| [V asking] [O anyone] [M {前| for permission}]}}]}].', {
    chunks: [
      ['What matters most is', '最も大切なのは'],
      ['that a citizen can reach the original figure', '市民が元の数字にたどり着けることです'],
      ['without asking anyone for permission', 'だれにも許可を求めずに'],
    ],
    notes: {
      'that a citizen can reach the original figure': 'この that は接続詞で、is の補語になる名詞のまとまりを作ります。',
    },
  }),
  st('[S Every public promise] [V spends] [O something: the time, labor, land, or money {関係>the time, labor, land, or money| [S that] [V could have served] [O another goal]}].', {
    chunks: [
      ['Every public promise spends something:', 'どの公的な約束も、何かを費やします'],
      ['the time, labor, land, or money', 'つまり時間や労働や土地やお金を'],
      ['that could have served another goal', '別の目的に役立てられたはずの（もの）'],
    ],
    notes: {
      'that could have served another goal': 'could have ＋ 過去分詞 で「〜できたはずだ」。',
    },
  }),
  st('[S A budget] [V is] [C the clearest statement {関係>the clearest statement| [O that] [S a government] [M ever] [V makes] [M {前| about {what節| [O what] [S it] [M truly] [V values]}}]}].', {
    chunks: [
      ['A budget is the clearest statement', '予算は最も明確な表明です'],
      ['that a government ever makes', '政府が示す中で（最も明確な）'],
      ['about what it truly values', '本当に何を重んじているかについての'],
    ],
    notes: {
      'that a government ever makes': '最上級 ＋ that ＋ 主語 ＋ ever ＋ 動詞 で「これまでに〜する中で最も…」。',
    },
  }),
  st('[S {動名詞| [V Reading] [O it] [M carefully]}] [V is] [C a civic skill {前| rather than a narrow accounting one}].', {
    chunks: [
      ['Reading it carefully is a civic skill', 'それを丁寧に読むことは市民の技能であって'],
      ['rather than a narrow accounting one', '狭い会計の技能ではありません'],
    ],
    notes: {
      'rather than a narrow accounting one': 'この one は skill の代わりです。civic は「市民の」。',
    },
  }),
  st('[S A feasibility study] [V asks] [O {whether節| [接 whether] [S a plan] [V can be built] [M {前| at all}], [接 and] [M {前| at what cost {前| to the workforce {関係>the workforce| [S that] [V builds] [O it]}}}]}].', {
    chunks: [
      ['A feasibility study asks', '実現可能性の調査が問うのは'],
      ['whether a plan can be built at all,', 'その計画がそもそも実行できるのか'],
      ['and at what cost to the workforce', 'そしてどれだけの負担が働き手にかかるのか、です'],
      ['that builds it', 'それを作る（働き手に）'],
    ],
    notes: {
      'whether a plan can be built at all,': 'この whether は「〜かどうか」という名詞のまとまりを作ります。feasibility は「実行できるかどうか」。',
    },
  }),
  st('[M {副詞節:時| [接 When] [S a single corporation] [V holds] [O a monopoly] [M {前| over a service}]}], [S the town] [V loses] [O the comparison {関係省略:目的格(provides)>the comparison| [S an auction] [V provides]}].', {
    chunks: [
      ['When a single corporation holds a monopoly over a service,', '一つの企業がある事業を独占すると'],
      ['the town loses the comparison', '町は比べる手だてを失います'],
      ['an auction provides', '競売がもたらす（比べる手だてを）'],
    ],
    notes: {
      'an auction provides': 'comparison の後ろに目的格の関係代名詞が省かれています。monopoly は「独占」。',
    },
  }),
  st('[S Competition] [V is] [C valuable] [M mainly] [M {副詞節:理由| [接 because] [S it] [V produces] [O reliable information {前| about price}]}].', {
    chunks: [
      ['Competition is valuable mainly', '競争が価値を持つのは主に'],
      ['because it produces reliable information about price', '価格についての信頼できる情報を生むからです'],
    ],
    notes: {
      'because it produces reliable information about price': 'この because は理由のまとまりを作る接続詞です。',
    },
  }),
  st('[S Households] [V feel] [O these decisions] [M {前| through rent, a mortgage, the price {前| of food}, and the currency {前| in their pockets}}].', {
    chunks: [
      ['Households feel these decisions', '家計はこうした決定を感じ取ります'],
      ['through rent, a mortgage, the price of food,', '家賃や住宅ローンや食べ物の値段'],
      ['and the currency in their pockets', 'そして財布の中の通貨を通して'],
    ],
    notes: {
      'through rent, a mortgage, the price of food,': 'mortgage は「家を買うための借り入れ」。',
    },
  }),
  st('[S A policy {前| of austerity}] [V may balance] [O the accounts] [M {副詞節:対比| [接 while] [V moving] [O the cost] [M {前| onto families {関係>families| [S who] [V cannot insure] [O themselves]}}]}].', {
    chunks: [
      ['A policy of austerity may balance the accounts', '緊縮の政策は帳尻を合わせるかもしれませんが'],
      ['while moving the cost onto families', 'その一方で負担を家庭へ移します'],
      ['who cannot insure themselves', '自分では備えられない（家庭へ）'],
    ],
    notes: {
      'while moving the cost onto families': 'while の後ろに主語と be動詞（it is）が省かれています。austerity は「緊縮」。',
    },
  }),
  st('[S Growth] [V matters], [接 but] [S distribution] [V decides] [O {疑問詞節| [S who] [V is able to turn] [O that growth] [M {前| into security}]}].', {
    chunks: [
      ['Growth matters,', '成長は大切です'],
      ['but distribution decides', 'けれども決めるのは分配です'],
      ['who is able to turn that growth into security', 'その成長を安心に変えられるのがだれかを'],
    ],
    notes: {
      'who is able to turn that growth into security': 'この who は疑問詞で、「だれが〜できるのか」という間接疑問を作ります。',
    },
  }),
  st('[S Public money] [M also] [V carries] [O a duty {to:形容詞>a duty| [V to explain]}], [M {副詞節:理由| [接 because] [S a refund or a contract] [V needs] [O a reason {関係省略:目的格(repeat)>a reason| [S residents] [V can repeat]}]}].', {
    chunks: [
      ['Public money also carries a duty to explain,', '公金には説明する義務も伴います'],
      ['because a refund or a contract needs a reason', '払い戻しにも契約にも理由が要るからです'],
      ['residents can repeat', '住民が言い直せる（理由が）'],
    ],
    notes: {
      'residents can repeat': 'reason の後ろに目的格の関係代名詞が省かれています。refund は「払い戻し」。',
    },
  }),
  st('[S Some towns] [V specialize] [M {前| in a single enterprise}] [接 and] [M then] [V struggle] [M {副詞節:時| [接 when] [S that industry] [V moves away]}].', {
    chunks: [
      ['Some towns specialize in a single enterprise', '一つの事業に特化する町もあり'],
      ['and then struggle', 'そしてやがて苦しみます'],
      ['when that industry moves away', 'その産業が去っていくときに'],
    ],
    notes: {
      'Some towns specialize in a single enterprise': 'specialize in … で「…に特化する」。enterprise は「事業」。',
    },
  }),
  st('[S A budget {関係>A budget| [S that] [V plans] [M {前| for the second outcome}]}] [V is not] [C pessimistic]; [S it] [V is] [M simply] [C honest].', {
    chunks: [
      ['A budget that plans for the second outcome', '後のほうの結末に備える予算は'],
      ['is not pessimistic;', '悲観的なのではなく'],
      ['it is simply honest', 'ただ正直なだけです'],
    ],
    notes: {
      'A budget that plans for the second outcome': 'plan for … で「…に備えて計画する」。pessimistic は「悲観的な」。',
    },
  }),
  st('[S A good decision] [V is] [C firm enough {to:副詞(程度)| [V to guide] [O action]}] [接 and] [C open enough {to:副詞(程度)| [V to be revised] [M {副詞節:時| [接 when] [S the evidence] [V changes]}]}].', {
    chunks: [
      ['A good decision is firm enough to guide action', 'よい決定は、行動を導けるほど確かで'],
      ['and open enough to be revised', '見直せるほど開かれています'],
      ['when the evidence changes', '証拠が変わったときに'],
    ],
    notes: {
      'A good decision is firm enough to guide action': '形容詞 ＋ enough to ＋ 動詞 で「〜できるほど…だ」。',
    },
  }),
  st('[S {動名詞| [V Treating] [O every revision] [C {前| as a failure}]}] [V is] [C the surest way {to:形容詞>the surest way| [V to keep] [O a mistake] [M {前| in place}] [M {前| for years}]}].', {
    chunks: [
      ['Treating every revision as a failure', 'あらゆる見直しを失敗とみなすことは'],
      ['is the surest way', '最も確実な方法です'],
      ['to keep a mistake in place for years', '誤りを何年もそのまま残す（方法）'],
    ],
    notes: {
      'to keep a mistake in place for years': 'keep … in place で「そのままにしておく」。revision は「見直し」。',
    },
  }),
  st('[S Every rule] [V should] [M therefore] [V carry] [O a date and a stated method {前| for review}].', {
    chunks: [
      ['Every rule should therefore carry', 'したがってどの規則も備えるべきです'],
      ['a date and a stated method for review', '期日と、はっきり示された見直しの手順を'],
    ],
    notes: {
      'a date and a stated method for review': 'stated は「はっきり書かれた」。',
    },
  }),
  st('[S Guidelines] [V work] [M best] [M {副詞節:時| [接 when] [S they] [V name] [O the action, the decider, and the date {前| of the next review}]}].', {
    chunks: [
      ['Guidelines work best', '指針が最もよく働くのは'],
      ['when they name the action, the decider,', '行いと、決める人と'],
      ['and the date of the next review', '次の見直しの期日を挙げているときです'],
    ],
    notes: {
      'when they name the action, the decider,': 'name はここでは「名指しで挙げる」という動詞です。',
    },
  }),
  st('[S A norm {関係>A norm| [O that] [S nobody] [V is allowed] [C {to:補語| [V to question]}]}] [M quietly] [V becomes] [C a threat {前| to the trust {関係>the trust| [S that] [V created] [O it]}}].', {
    chunks: [
      ['A norm that nobody is allowed to question', 'だれも問い直すことを許されない規範は'],
      ['quietly becomes a threat', '静かに脅威となります'],
      ['to the trust that created it', 'それを生んだ信頼にとっての'],
    ],
    notes: {
      'A norm that nobody is allowed to question': 'be allowed to ＋ 動詞 で「〜することを許される」。norm は「決まりごと」。',
    },
  }),
  st('[S Humility {前| in public life}] [V is not] [C a weakness], [M {副詞節:理由| [接 because] [S it] [V is] [C a way {前| of {動名詞| [V keeping] [O options] [C open]}}]}].', {
    chunks: [
      ['Humility in public life is not a weakness,', '公の場での謙虚さは弱さではありません'],
      ['because it is a way of keeping options open', '選択肢を開いておく方法だからです'],
    ],
    notes: {
      'because it is a way of keeping options open': 'keep ＋ 目的語 ＋ 形容詞 で「〜を…のままにする」。humility は「謙虚さ」。',
    },
  }),
  st('[S Globalization] [V has made] [仮O it] [C much harder] [真O {to:名詞| [V to separate] [O local choices] [M {前| from distant ones}]}].', {
    chunks: [
      ['Globalization has made it much harder', 'グローバル化は、はるかに難しくしました'],
      ['to separate local choices from distant ones', '地域の選択を遠くの選択から切り離すことを'],
    ],
    notes: {
      'Globalization has made it much harder': 'この it は仮の目的語で、中身は後ろの to separate … です。',
    },
  }),
  st('[S A rule {前| about waste, wages, or travel}] [M now] [V touches] [O many people {関係>many people| [S who] [M never] [V voted] [M {前| on it}]}].', {
    chunks: [
      ['A rule about waste, wages, or travel', '廃棄物や賃金や移動についての規則は'],
      ['now touches many people', 'いまや多くの人に及びます'],
      ['who never voted on it', 'それに投票したことのない（人に）'],
    ],
    notes: {
      'who never voted on it': 'vote on … で「…について投票する」。',
    },
  }),
  st('[S Humanitarian and environmental arguments] [M therefore] [V enter] [O debates {過去分詞>debates| [M once] [V thought] [C purely local]}].', {
    chunks: [
      ['Humanitarian and environmental arguments', '人道の議論も環境の議論も'],
      ['therefore enter debates', 'そのため議論の中に入ってきます'],
      ['once thought purely local', 'かつては純粋に地域のことだと思われていた（議論に）'],
    ],
    notes: {
      'once thought purely local': 'debates を後ろから説明する過去分詞のまとまりです。once はここでは「かつては」。',
    },
  }),
  st('[S Mainstream opinion] [V moves], [接 and] [S a reservation {過去分詞>a reservation| [V recorded] [M yesterday]}] [V can become] [C tomorrow’s ordinary standard].', {
    chunks: [
      ['Mainstream opinion moves,', '主流の意見は動きます'],
      ['and a reservation recorded yesterday', 'そして昨日書き留められた留保が'],
      ['can become tomorrow’s ordinary standard', '明日には当たり前の基準になりえます'],
    ],
    notes: {
      'and a reservation recorded yesterday': 'reservation はここでは「留保・ためらいの表明」。',
    },
  }),
  st('[S The hardest role {前| in any community}] [V is] [C the bystander {関係>the bystander| [S who] [V sees] [O a problem] [接 and] [V assumes] [O {that節| [接 that] [S someone else] [V will report] [O it]}]}].', {
    chunks: [
      ['The hardest role in any community', 'どの地域社会でも最も難しい役回りは'],
      ['is the bystander who sees a problem', '問題に気づく傍観者です'],
      ['and assumes that someone else will report it', 'そしてだれかほかの人が知らせるだろうと思い込む（傍観者）'],
    ],
    notes: {
      'and assumes that someone else will report it': 'bystander は「そばで見ている人」。この that は接続詞で、assumes の目的語になるまとまりを作ります。',
    },
  }),
  st('[S A decision {関係>A decision| [S that] [V can be revised]}] [V is not] [C a weak one], [M {副詞節:理由| [接 because] [S it] [V expects] [O citizens] [C {to:補語| [V to keep] [O {動名詞| [V watching]}]}]}].', {
    chunks: [
      ['A decision that can be revised', '見直せる決定は'],
      ['is not a weak one,', '弱い決定ではありません'],
      ['because it expects citizens to keep watching', '市民が見続けることを前提にしているからです'],
    ],
    notes: {
      'because it expects citizens to keep watching': 'expect ＋ 目的語 ＋ to ＋ 動詞 で「〜が…すると見込む」。keep ＋ -ing で「〜し続ける」。',
    },
  }),
])
