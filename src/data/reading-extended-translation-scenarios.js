// 語彙強化ロングリーディングの講師監修・語順訳シナリオ。
//
// en は reading-grammar.js が作るブロックとの照合キー。orderedEn は解析器が出す
// SVOCMの役割単位と1対1で並べ、orderedJa はその各単位に対応する日本語を英語の
// 出現順に「／」で区切って書く。単位をまたぐ区切りを書くと、解析器の自動推定訳に置き換わってしまう。
// orderedJa の区切り数は orderedEn の単位数と必ず一致させる。少ないと最後の日本語が
// 余った単位へ複製され、同じ訳が二重に表示される。

const b = (en, orderedJa, tip = '', orderedEn = '') => {
  const jaSegments = Object.freeze(orderedJa.split('／').map((segment) => segment.trim()))
  const enSegments = orderedEn
    ? Object.freeze(orderedEn.split('／').map((segment) => segment.trim()))
    : null
  return Object.freeze({
    en,
    ja: jaSegments.join(' → '),
    jaSegments,
    enSegments,
    speechJa: jaSegments.join('。次に、'),
    tip,
  })
}
const passage = (sentences) => Object.freeze(sentences.map((sentence) => Object.freeze(sentence)))

export const EXTENDED_READING_TRANSLATION_SCENARIOS = Object.freeze({
  p_ext_1000_civic_decisions: passage([
    // ===== voice : 声と代表 =====
    [
      b('Every public decision begins', 'どの公共の決定も始まります'),
      b('with a simple question about', '単純な問いから、〜についての'),
      b(
        'whose voice actually reaches the room',
        '誰の声が実際にその場へ届いているのか',
        'whose は「誰の〜が」と所有をたずねる疑問詞。about の後ろ全体が名詞節です。',
      ),
      b('where the choice is made', 'その場所で／その選択が／行われる', '', 'where／the choice／is made'),
    ],
    [
      b('A town may hold meetings and publish notices', '町は／開くことができます／会合を、そして通知を出すことも', '', 'A town／may hold／meetings and publish notices'),
      b('yet still hear only the people', 'それでも／なお／聞こえます（対象は次へ）／その人々の声だけが', '', 'yet／still／hear only／the people'),
      b('who already know', 'その人々は／すでに／知っています', '', 'who／already／know'),
      b('how the system works', 'どのように／制度が動くのかを', '', 'how／the system works'),
    ],
    [
      b(
        'Representation is therefore a practice rather than a title',
        'したがって代表とは、肩書ではなく実践です',
        'rather than は後ろのBを退け、前のAを主張として残す対比の合図です。',
      ),
    ],
    [
      b('When people give a council a mandate', '人々が議会に負託を与えるとき'),
      b('they lend power', '彼らは／貸しています／権力を', '', 'they／lend／power'),
      b('for a limited time', '限られた期間だけ'),
    ],
    [
      b(
        'The council may nominate officials, form a coalition',
        '議会は／指名でき／職員を、また連立を組むこともできます',
        '',
        'The council／may nominate／officials, form a coalition',
      ),
      b('or ask a committee', 'あるいは／頼むこともできます／委員会に', '', 'or／ask／a committee'),
      b('to study a difficult problem', '調べるようにと／難しい問題を', '', 'to study／a difficult problem'),
    ],
    [
      b('None of these steps replaces the duty', 'こうした手続きのどれも／代わりにはなりません／その義務の', '', 'None of these steps／replaces／the duty'),
      b(
        'to explain the decision to the constituency',
        '説明するという／その決定を、権力を与えた選挙区に',
        '',
        'to explain／the decision to the constituency',
      ),
      b('that granted the power', 'その選挙区が／与えた／その権力を', '', 'that／granted／the power'),
    ],
    [
      b('Speaking is only half of representation', '話すことは〜にすぎません／代表の半分', '', 'Speaking is only／half of representation'),
      b('because listening decides', 'なぜなら／聞くことが／決めるからです', '', 'because／listening／decides'),
      b('whose problem becomes the next item', '誰の／問題が次の議題になるのかを', '', 'whose／problem becomes the next item'),
    ],
    [
      b('An oral report reaches people', '口頭の／報告は／人々に届きます', '', 'An oral／report／reaches people'),
      b('who cannot read long documents', 'その人々は／読むことができません／長い文書を', '', 'who／cannot read／long documents'),
      b('and a printed record protects those', 'そして／一つの／印刷された／記録が人々を守ります', '', 'and／a／printed／record protects those'),
      b('who cannot attend', 'その人々は／出席できません', '', 'who／cannot attend'),
    ],
    [
      b(
        'Communities that use both methods hear a wider range of residents than those that rely',
        '両方の方法を使う地域は／用います／その両方を、そして幅広い住民の声を聞きます／頼る地域よりも',
        'than those that … は「…する地域よりも」と、比較の相手をまとめて受け直します。',
        'Communities that／use／both methods hear a wider range of residents than those that／rely',
      ),
      b('on one channel', '一つの経路だけに'),
    ],
    [
      b('Dissent often shows', '反対意見は／しばしば／示します', '', 'Dissent／often／shows'),
      b(
        'that a plan has not yet',
        '次の内容だと（中身は次へ）／ある計画が／まだ〜されていない／その時点まで',
        '',
        'that／a plan／has not／yet',
      ),
      b(
        'been explained clearly enough to the people it affects',
        'はっきりと説明されて／影響を受ける人々に足りるほど',
        'has not yet been explained で「まだ説明されていない」。enough は「足りるだけ」の程度です。',
        'been explained clearly／enough to the people it affects',
      ),
    ],
    [
      b('If a council treats every objection', 'もし／議会が／扱うなら／あらゆる異議を', '', 'If／a council／treats／every objection'),
      b('as an attack', '〜として／一つの／攻撃', '', 'as／an／attack'),
      b(
        'it will soon receive silence instead of assent',
        '議会は／やがて受け取るでしょう／同意ではなく沈黙を',
        '',
        'it／will soon receive／silence instead of assent',
      ),
    ],
    [
      b('The habit of answering questions in public turns an official body', '〜という習慣が／答えるという／公の場で質問に、そして公式の組織を変えます', '', 'The habit of／answering／questions in public turns an official body'),
      b('into a representative one', '代表する組織へと'),
    ],

    // ===== rights : 法・権利・責任 =====
    [
      b('Rules become real only', '規則が／なるのは／現実のものにただそのときだけです', '', 'Rules／become／real only'),
      b('when everyone can find out their content and their limits', '誰もがその中身と限界を調べられるときに'),
    ],
    [
      b('A court has jurisdiction', '裁判所は／持ちます／管轄権を', '', 'A court／has／jurisdiction'),
      b('over certain places and certain kinds of dispute', '特定の場所と特定の種類の争いに対して'),
    ],
    [
      b('Outside those limits its orders carry no weight', 'その範囲の外では、その命令は何の効力も持ちません'),
      b('at all', 'まったく'),
      b(
        'however reasonable they may sound',
        'どれほど〜でも／筋が通って聞こえようとも',
        'however ＋ 形容詞 は「どれほど…でも」と譲歩をまとめる形です。',
        'however／reasonable they may sound',
      ),
    ],
    [
      b('Citizens', '市民は'),
      b('who understand the limits of a rule', 'その市民は／規則の限界を理解しています', '', 'who／understand the limits of a rule'),
      b('can also see', '見て取ることもできます'),
      b('where their own responsibility begins', 'どこから／自分自身の責任が／始まるのかを', '', 'where／their own responsibility／begins'),
    ],
    [
      b('A fair system treats a person', '公正な制度は／扱います／人を', '', 'A fair system／treats／a person'),
      b('who is accused of a crime', 'その人は／告発されています／犯罪で', '', 'who／is accused／of a crime'),
      b(
        'as innocent until the evidence has been tested',
        '〜として／無罪の者、証拠がそうなるまでは／検証される',
        'treat A as B で「AをBとして扱う」。until 以下がその扱いの続く期間です。',
        'as／innocent until the evidence／has been tested',
      ),
    ],
    [
      b('Prosecutors must show', '検察は／示さなければなりません', '', 'Prosecutors／must show'),
      b('why the charge fits the facts', 'なぜ／その／訴えが／事実に合うのかを', '', 'why／the／charge／fits the facts'),
      b(
        'and the defense may challenge every provision the state relies on',
        'そして／弁護側は／〜できます／国が根拠とするあらゆる条項に異議を唱えることが',
        '',
        'and／the defense／may／challenge every provision the state relies on',
      ),
    ],
    [
      b(
        'This slow procedure protects the innocent far more often than it protects the guilty',
        'この時間のかかる手続きは／守ります／有罪の者を守るよりはるかに多く無実の者を',
        '',
        'This slow procedure／protects／the innocent far more often than it protects the guilty',
      ),
    ],
    [
      b('Punishment is sometimes defended as a deterrent', '刑罰は／ときに擁護されます／抑止力として', '', 'Punishment／is sometimes defended／as a deterrent'),
      b('but a penalty deters nobody', 'しかし／罰は／抑止しません（対象は次へ）／誰も', '', 'but／a penalty／deters／nobody'),
      b('if the rule itself is unknown', 'もし／規則そのものが／〜なら／知られていない', '', 'if／the rule itself／is／unknown'),
    ],
    [
      b(
        'A clear law with a small penalty often changes behavior more than a harsh law full of loopholes',
        '罰の軽い明確な法律はしばしば／変えます／抜け穴だらけの厳しい法律よりも行動を',
        '',
        'A clear law with a small penalty often／changes／behavior more than a harsh law full of loopholes',
      ),
    ],
    [
      b('Each decision also creates a precedent', 'どの判断もまた／作ります／先例を', '', 'Each decision also／creates／a precedent'),
      b(
        'that later courts will read as guidance',
        'その先例を／のちの裁判所が／読むことになります／指針として',
        '',
        'that／later courts／will read／as guidance',
      ),
    ],
    [
      b('Rights and duties appear together', '権利と義務は／現れます／対になって', '', 'Rights and duties／appear／together'),
      b(
        'because a right that entitles one person makes some action obligatory',
        'なぜなら／ある人に資格を与える権利は、何らかの行為を義務的なものにするからです',
        '',
        'because／a right that entitles one person makes some action obligatory',
      ),
      b('for another', '別の人にとって'),
    ],
    [
      b('When a legislature enacts a rule', '議会が規則を制定するとき'),
      b('the useful question is not only', '役に立つ問いは〜だけではありません'),
      b('what it forbids but', 'それが何を禁じるのか、そうではなく'),
      b('who must act', '誰が／動かなければならないのか、です', '', 'who／must act'),
    ],

    // ===== information : 議論の前に必要な情報 =====
    [
      b('An argument about a public choice is only', '公共の選択をめぐる議論はただ〜にすぎません'),
      b('as good', '同じ程度に優れているだけ'),
      b(
        'as the information that both sides are able',
        '双方が〜できる情報と同じ程度に',
        'only as good as … は「…の質を超えることはない」という上限の言い方です。',
      ),
      b('to check', '確かめることが'),
    ],
    [
      b('Comparison becomes impossible', '比較は／なります／できない状態に', '', 'Comparison／becomes／impossible'),
      b('when key figures are hidden, delayed', '重要な数字が隠され、遅らされるとき'),
      b('or expressed in language', 'あるいは／言葉で表されるとき', '', 'or／expressed in language'),
      b('that no outsider understands', 'その言葉は／どの部外者も／理解できません', '', 'that／no outsider／understands'),
    ],
    [
      b('Openness is therefore not a courtesy', '公開とは／したがって〜ではありません／厚意', '', 'Openness／is therefore not／a courtesy'),
      b(
        'that officials may offer but a condition',
        'その厚意を／当局が／差し出してもよい／そうではなく条件です',
        'not A but B の A と B が離れているので、but の後ろを正体として受け直します。',
        'that／officials／may offer／but a condition',
      ),
      b('for honest debate', '誠実な議論のための'),
    ],
    [
      b('Misinformation spreads', '誤情報は広がります'),
      b('when people repeat a claim', '人々が主張を繰り返すときに'),
      b('that they believe', 'その主張を／自分が／信じています', '', 'that／they／believe'),
      b('to be true', '〜であると／本当', '', 'to be／true'),
    ],
    [
      b('Disinformation spreads', '偽情報は広がります'),
      b('when someone knows', '誰かが知っているときに'),
      b(
        'that the claim is false and shares it anyway',
        'その主張が／〜だと／誤りであり、それでも広めるとき',
        '',
        'that the claim／is／false and shares it anyway',
      ),
    ],
    [
      b('The two problems look alike', 'その二つの問題は／見えます／似ているように', '', 'The two problems／look／alike'),
      b('on a screen', '画面の上では'),
      b(
        'and yet they need completely different answers',
        'そして／それでも／二つは／まったく異なる対処を必要とします',
        '',
        'and／yet／they／need completely different answers',
      ),
    ],
    [
      b('The first is treated', '前者は／対処されます', '', 'The first／is treated'),
      b('by a better explanation', 'よりよい説明によって'),
      b('and the second by tracing', 'そして／後者は〜によって／たどること', '', 'and／the second by／tracing'),
      b('who gains', '誰が／得をするのかを', '', 'who／gains'),
      b('from the story', 'その話から'),
    ],
    [
      b('Every medium shapes what it carries', 'どの媒体も自分が運ぶものを／形づくります', '', 'Every medium shapes what it／carries'),
      b('because a broadcast compresses', 'なぜなら／放送は圧縮するからです', '', 'because／a broadcast compresses'),
      b('while a document accumulates', '一方で文書は積み重ねます'),
    ],
    [
      b('A reader', '読者は'),
      b('who is literate', 'その読者は／〜です／読みこなせる', '', 'who／is／literate'),
      b('in one medium', 'ある媒体を'),
      b('may still be almost helpless', 'それでも〜かもしれません／ほとんど無力', '', 'may still be／almost helpless'),
      b('in another', '別の媒体では'),
    ],
    [
      b('Schools that teach students', '生徒に教える学校は'),
      b('to check a source, a date', '確かめるように／出典を、日付を', '', 'to check／a source, a date'),
      b(
        'and a credential give them a skill they will use',
        'そして／資格をも確かめるよう教える学校は／生徒に技能を与えます／その技能を彼らは／使うことになります',
        '',
        'and／a credential／give／them a skill they／will use',
      ),
      b('for decades', '何十年もの間'),
    ],
    [
      b(
        'Officials often answer through a spokesman, and the public then judges the office',
        '当局は／しばしば／答え／報道官を通して、そして人々はそのあとその役所を判断します',
        '',
        'Officials／often／answer／through a spokesman, and the public then judges the office',
      ),
      b('by that single voice', 'そのただ一つの声によって'),
    ],
    [
      b('What matters most is', '最も大切なことは〜です'),
      b(
        'that a citizen can reach the original figure without asking anyone',
        '次の内容だと（中身は次へ）／市民が／たどり着けること／誰にも求めずに元の数字に',
        '',
        'that／a citizen／can reach／the original figure without asking anyone',
      ),
      b('for permission', '許可を'),
    ],

    // ===== resources : 予算と公共の選択 =====
    [
      b(
        'Every public promise spends something: the time, labor, land',
        'どの公的な約束も／費やします／何かを、すなわち時間・労働・土地',
        'コロンは直前の something を具体的に言い直す合図です。',
        'Every public promise／spends／something: the time, labor, land',
      ),
      b(
        'or money that could have served another goal',
        'あるいは／別の目的に使えたはずの資金を',
        '',
        'or／money that could have served another goal',
      ),
    ],
    [
      b('A budget is the clearest statement', '予算は最も明確な表明です'),
      b('that a government ever makes', 'その表明を／政府がこれまでに／行います', '', 'that／a government ever／makes'),
      b('about what it truly values', '自分が本当に何を重んじているかについて'),
    ],
    [
      b('Reading it carefully', 'それを丁寧に読むことは'),
      b(
        'is a civic skill rather than a narrow accounting one',
        '〜です／狭い会計の技能というより市民の技能',
        'one は前に出た skill の繰り返しを避ける代名詞です。',
        'is／a civic skill rather than a narrow accounting one',
      ),
    ],
    [
      b('A feasibility study asks', '実現可能性の調査は問います'),
      b('whether a plan can be built', '〜かどうかを／ある計画が／実行できる', '', 'whether／a plan／can be built'),
      b('at all', 'そもそも'),
      b(
        'and at what cost to the workforce that builds it',
        'そして／どれほどの負担で、その労働力にとって／作る／その計画を',
        '',
        'and／at what cost to the workforce that／builds／it',
      ),
    ],
    [
      b('When a single corporation holds a monopoly', 'ひとつの企業が独占を握るとき'),
      b('over a service', 'ある事業に対する'),
      b(
        'the town loses the comparison an auction provides',
        'その町は／失います／競売がもたらす比較を',
        '',
        'the town／loses／the comparison an auction provides',
      ),
    ],
    [
      b('Competition is valuable mainly', '競争が価値を持つのは主として'),
      b(
        'because it produces reliable information',
        'なぜなら／競争が／生み出すからです／信頼できる情報を',
        '',
        'because／it／produces／reliable information',
      ),
      b('about price', '価格についての'),
    ],
    [
      b('Households feel these decisions', '家計は／感じ取ります／こうした決定を', '', 'Households／feel／these decisions'),
      b('through rent', '家賃を通して'),
      b('a mortgage', '住宅ローンを通して'),
      b('the price of food, and the currency in their pockets', '食料品の値段、そして財布の中の通貨を通して'),
    ],
    [
      b(
        'A policy of austerity may balance the accounts',
        '緊縮の政策は／合わせるかもしれません／帳尻を',
        '',
        'A policy of austerity／may balance／the accounts',
      ),
      b('while moving the cost onto families', 'その一方でその負担を家庭へ移しながら'),
      b('who cannot insure themselves', 'その家庭は／備えることができません／自分自身に', '', 'who／cannot insure／themselves'),
    ],
    [
      b('Growth matters', '成長は重要です'),
      b('but distribution decides', 'しかし／分配が／決めます', '', 'but／distribution／decides'),
      b('who is able', '誰が／〜できるのか／その力がある', '', 'who／is／able'),
      b('to turn that growth into security', '変えることが／その成長を安心へ', '', 'to turn／that growth into security'),
    ],
    [
      b('Public money also carries a duty', '公金には／また／伴います／義務が', '', 'Public money／also／carries／a duty'),
      b('to explain', '説明するという'),
      b(
        'because a refund or a contract needs a reason residents can repeat',
        'なぜなら／払い戻しや契約には／必要だからです／住民が言い直せる理由が',
        '',
        'because／a refund or a contract／needs／a reason residents can repeat',
      ),
    ],
    [
      b('Some towns specialize', '一部の町は／特化します', '', 'Some towns／specialize'),
      b('in a single enterprise and then struggle', 'ひとつの事業に、そしてそのあと苦しみます'),
      b('when that industry moves away', 'その産業が去っていくときに'),
    ],
    [
      b('A budget that plans', '予算は／備えます', '', 'A budget that／plans'),
      b('for the second outcome is not pessimistic', '後者の結末に、悲観的なのではありません'),
      b('it is simply honest', 'それはただ正直なだけです'),
    ],

    // ===== revision : 見直せる決定 =====
    [
      b(
        'A good decision is firm enough to guide action and open enough',
        'よい決定は／〜です／行動を導けるほど確かで、そして十分に開かれている',
        'enough to do は「…できるほど十分に」。firm と open の二つの条件を対で読みます。',
        'A good decision／is／firm enough to guide action and open enough',
      ),
      b('to be revised', '見直せるほど'),
      b('when the evidence changes', '証拠が変わったときに'),
    ],
    [
      b('Treating every revision', 'あらゆる見直しを扱うことは'),
      b('as a failure is the surest way', '失敗として、最も確実な方法です'),
      b('to keep a mistake in place for years', '保つための／誤りを何年もそのままに', '', 'to keep／a mistake in place for years'),
    ],
    [
      b('Every rule should therefore carry a date and a stated method', 'どの規則も／したがって備えるべきです／期日と明記された方法を', '', 'Every rule／should therefore carry／a date and a stated method'),
      b('for review', '見直しのための'),
    ],
    [
      b('Guidelines work best', '指針が最もよく働くのは'),
      b('when they name the action, the decider, and the date of the next review', '指針が行為と、決める人と、次の見直しの期日を名指ししているときです'),
    ],
    [
      b(
        'A norm that nobody is allowed to question quietly becomes a threat to the trust that created it',
        '誰も〜ない規範は／許されていません／問い直すことを、そして静かに／なります／それを生んだ信頼にとって脅威に',
        '',
        'A norm that nobody／is allowed／to question quietly／becomes／a threat to the trust that created it',
      ),
    ],
    [
      b('Humility in public life is not a weakness', '公的な場での謙虚さは／〜ではありません／弱さ', '', 'Humility in public life／is not／a weakness'),
      b(
        'because it is a way of keeping options open',
        'なぜなら／それは選択肢を開いておく方法だからです',
        '',
        'because／it is a way of keeping options open',
      ),
    ],
    [
      b(
        'Globalization has made it much harder',
        'グローバル化は／してきました／それをはるかに難しく',
        'make it ... to do の it は形式目的語で、実際の内容は to separate 以下です。',
        'Globalization／has made／it much harder',
      ),
      b('to separate local choices from distant ones', '切り離すことを／地域の選択を遠くの選択から', '', 'to separate／local choices from distant ones'),
    ],
    [
      b('A rule about waste, wages', '廃棄物や賃金についての規則は'),
      b('or travel now touches many people', 'あるいは／移動についての規則はいまや／及びます／多くの人に', '', 'or／travel now／touches／many people'),
      b('who never voted', 'その人々は／一度も／投票していません', '', 'who／never／voted'),
      b('on it', 'それについて'),
    ],
    [
      b('Humanitarian and environmental arguments therefore enter debates', 'そのため人道的・環境的な議論が／入ってきます／議論の中に', '', 'Humanitarian and environmental arguments therefore／enter／debates'),
      b('once thought purely local', 'かつては／思われていた／純粋に地域的だと', '', 'once／thought purely／local'),
    ],
    [
      b('Mainstream opinion moves', '主流の意見は／動きます', '', 'Mainstream opinion／moves'),
      b(
        'and a reservation recorded yesterday can become tomorrow’s ordinary standard',
        'そして／留保が／記録された／昨日、明日の当たり前の基準になりうるのです',
        '',
        'and／a reservation／recorded／yesterday can become tomorrow’s ordinary standard',
      ),
    ],
    [
      b('The hardest role in any community is the bystander', 'どの地域社会でも最も厄介な役回りは傍観者です'),
      b('who sees a problem and assumes', 'その傍観者は／気づき／問題に、そして／こう思い込みます', '', 'who／sees／a problem and／assumes'),
      b(
        'that someone else will report it',
        '次の内容だと（中身は次へ）／誰か他の人が／知らせるだろうと／それを',
        '',
        'that／someone else／will report／it',
      ),
    ],
    [
      b(
        'A decision that can be revised is not a weak one',
        '決定は／見直すことができ、〜ではありません／弱い決定',
        '',
        'A decision that／can be revised is not／a weak one',
      ),
      b('because it expects citizens', 'なぜなら／その決定は／市民に期待しているからです', '', 'because／it／expects citizens'),
      b('to keep watching', '見続けることを'),
    ],
  ]),
  p_ext_2000_customs_across_borders: passage([
    // ===== greetings : 挨拶と第一印象 =====
    [
      b('A greeting is the shortest conversation a culture holds', '挨拶とは／〜です／ある文化が交わす最も短い会話', '', 'A greeting／is／the shortest conversation a culture holds'),
      b('with a stranger', '見知らぬ人と'),
      b('and it carries far more information than its few words suggest', 'そして／挨拶は／運びます／そのわずかな言葉が思わせるよりはるかに多くの情報を', '', 'and／it／carries／far more information than its few words suggest'),
    ],
    [
      b('It announces', '挨拶は／告げます', '', 'It／announces'),
      b('how close two people may stand', 'どれほど／二人が近くに立ってよいか', '', 'how／close two people may stand'),
      b('how formal the moment must be', 'どれほど／その場が改まっていなければならないか', '', 'how／formal the moment must be'),
      b('and', 'そして'),
      b('who is expected', '誰が／期待されているのか', '', 'who／is expected'),
      b('to speak first', '話すことを／最初に', '', 'to speak／first'),
    ],
    [
      b('Visitors usually notice the gestures long', '訪問者はたいてい／気づきます／身ぶりにずっと', '', 'Visitors usually／notice／the gestures long'),
      b('before they notice anything at all', '文法について何かに気づくよりも前に'),
      b('about the grammar', 'その文法について'),
    ],
    [
      b('In some places a surname comes first', '姓が先に来る場所があるのは'),
      b('because the family is understood', 'なぜなら／家族が／理解されているからです', '', 'because／the family／is understood'),
      b('to precede the individual', '先立つと／その個人に', '', 'to precede／the individual'),
      b('who carries it', 'その個人は／それを名乗ります', '', 'who／carries it'),
    ],
    [
      b('Elsewhere a first name is offered immediately', '別の場所では名前が／すぐに差し出されます', '', 'Elsewhere a first name／is offered immediately'),
      b(
        'and using a title instead can feel like a small refusal of friendship',
        'そして／使うことは／代わりに肩書を／感じさせることがあります／友情のささやかな拒絶のように',
        '',
        'and／using／a title instead／can feel／like a small refusal of friendship',
      ),
    ],
    [
      b(
        'Neither habit is more polite than the other',
        'どちらの習慣も／〜わけではありません／他方より礼儀正しい',
        '',
        'Neither habit／is／more polite than the other',
      ),
      b(
        'because each simply answers a different question about',
        'なぜなら／それぞれが／ただ／答えているからです／ある事柄についての別の問いに',
        '',
        'because／each／simply／answers／a different question about',
      ),
      b('where a person belongs', 'どこに／人が／属するのか', '', 'where／a person／belongs'),
    ],
    [
      b('A visitor', '訪問者は'),
      b(
        'who has learned this stops reading warmth or coldness',
        'その訪問者が／学んだ／これを、そして温かさや冷たさを読み込むのをやめます',
        '',
        'who／has learned／this stops reading warmth or coldness',
      ),
      b('into the simple order of two ordinary words', 'ありふれた二つの語の単純な順番に'),
    ],
    [
      b(
        'Bilingual speakers often move between two greeting systems',
        '二言語を話す人はよく／行き来します／二つのあいだを／挨拶の／体系を',
        '',
        'Bilingual speakers often／move／between two／greeting／systems',
      ),
      b('without noticing', '気づかないまま'),
      b(
        'that they have changed anything',
        '次の内容だと（中身は次へ）／自分が／変えた／何かを',
        '',
        'that／they／have changed／anything',
      ),
      b('at all', 'まったく'),
    ],
    [
      b(
        'A returnee may bow politely in one country and shake hands in another',
        '帰国者は／丁寧におじぎをすることがあります／ある国では、そして別の国では握手をします',
        '',
        'A returnee／may bow politely／in one country and shake hands in another',
      ),
      b('within a single week of travel', 'たった一週間の移動のうちに'),
    ],
    [
      b(
        'Their ease is not a talent so much',
        '彼らの自然さは／〜ではなく／それほど才能というもの',
        '',
        'Their ease／is not／a talent so much',
      ),
      b('as long practice', 'むしろ／長い／実践です', '', 'as／long／practice'),
      b('with the small rules', '細かな規則についての'),
      b(
        'that surround any introduction',
        'その規則が／取り巻いています／どんな紹介の場面も',
        '',
        'that／surround／any introduction',
      ),
    ],
    [
      b('Apologies carry much the same hidden structure', '謝罪も／持っています／ほぼ同じ隠れた構造を', '', 'Apologies／carry／much the same hidden structure'),
      b(
        'and they are misread even more often than greetings are',
        'そして／謝罪は／さらに誤読されます／挨拶よりも頻繁に',
        '',
        'and／they／are misread even／more often than greetings are',
      ),
    ],
    [
      b('In one setting an apology repairs a relationship', 'ある場面では謝罪は関係を修復します'),
      b('while in another it admits fault and invites a legal claim', '一方で別の場面では過失を認め、法的な請求を招きます'),
    ],
    [
      b('Because the two functions look identical', 'なぜなら／この二つの働きは同じに見えるからです', '', 'Because／the two functions look identical'),
      b('from outside', '外側からは'),
      b(
        'a sincere apology can produce an uproar rather than calm',
        '誠実な謝罪が／生むことがあります／落ち着きではなく騒動を',
        '',
        'a sincere apology／can produce／an uproar rather than calm',
      ),
    ],
    [
      b('Tone and timing matter', '口調と／間合いが／重要です', '', 'Tone and／timing／matter'),
      b('as much', '同じくらい'),
      b(
        'as the words themselves, and irony rarely survives translation intact',
        '〜と同じく／言葉そのものと、そして皮肉はめったに／生き延びません／翻訳を無傷で',
        '',
        'as／the words themselves, and irony rarely／survives／translation intact',
      ),
    ],
    [
      b('Even waiting has a grammar', '〜さえ／順番待ちには文法があります', '', 'Even／waiting has a grammar'),
      b('since a queue may be a straight line', 'なぜなら／列は一直線でありうるからです', '', 'since／a queue may be a straight line'),
      b('a loose cluster', 'ゆるやかな集まりでも'),
      b('or a numbered ticket', 'あるいは／一枚の／番号のついた／札でも', '', 'or／a／numbered／ticket'),
    ],
    [
      b('A visitor', '訪問者は'),
      b('who happens', 'その訪問者が／たまたま', '', 'who／happens'),
      b('to stand in the wrong place', '立つことになった／間違った場所に', '', 'to stand／in the wrong place'),
      b(
        'is usually judged careless rather than deliberately rude',
        'たいてい判断されます／意図的に無礼だというより不注意だと',
        '',
        'is usually judged／careless rather than deliberately rude',
      ),
    ],
    [
      b(
        'Hospitality toward strangers is common everywhere',
        '見知らぬ人へのもてなしは／〜です／どこにでもあるもの',
        '',
        'Hospitality toward strangers／is／common everywhere',
      ),
      b(
        'yet the way it is offered follows local rules',
        'しかし／その差し出し方は／〜され／土地の規則に従います',
        '',
        'yet／the way it／is offered／follows local rules',
      ),
      b('that nobody writes down', 'その規則を誰も／書き記しません', '', 'that nobody／writes down'),
    ],
    [
      b('The useful conclusion is not', '役に立つ結論は〜ではありません'),
      b('that greetings are arbitrary', '次の内容だと（中身は次へ）／挨拶が／〜だ／恣意的である', '', 'that／greetings／are／arbitrary'),
      b('but that they are learned', 'そうではなく／挨拶が／学ばれたものだということです', '', 'but／that they／are learned'),
      b('and can therefore be learned again', 'そして／したがって学び直せます／もう一度', '', 'and／can therefore be learned／again'),
    ],

    // ===== hospitality : もてなしと食卓 =====
    [
      b(
        'A shared meal is one of the oldest ways in',
        '共にとる食事は／〜です／最も古い方法の一つで、その中で',
        '',
        'A shared meal／is／one of the oldest ways in',
      ),
      b('which a household tells a stranger', 'ある家庭が見知らぬ人に告げます'),
      b('that he is welcome', '次の内容だと（中身は次へ）／その人が／歓迎されていると', '', 'that／he／is welcome'),
    ],
    [
      b(
        'What appears on the table matters far less than the obligations the meal quietly creates',
        '何が／現れるのか／食卓に、それはその食事が静かに生む義務よりはるかに重要ではありません',
        '',
        'What／appears／on the table matters far less than the obligations the meal quietly creates',
      ),
      b('between host and guest', '主人と客の間に'),
    ],
    [
      b('In many communities a guest', '多くの共同体では、客は'),
      b('who refuses food', 'その客が／食べ物を断る', '', 'who／refuses food'),
      b('is understood', '理解されます'),
      b('to be refusing the relationship the food represents', '断っていると／その食べ物が表す関係を', '', 'to be refusing／the relationship the food represents'),
    ],
    [
      b('Elsewhere a polite guest declines twice', '別の場所では礼儀正しい客は二度断り'),
      b('before accepting, and a host', '受け取る前に、そして主人は'),
      b('who stops offering', 'その主人が／やめる／勧めることを', '', 'who／stops／offering'),
      b('has ended the ritual too early', '終わらせたことになります／儀礼をあまりに／早く', '', 'has ended／the ritual too／early'),
    ],
    [
      b('Both rules are meticulous', 'どちらの規則も／〜です／細やか', '', 'Both rules／are／meticulous'),
      b('in their own way', 'それぞれのやり方で'),
      b('and both remain invisible to anyone', 'そして／どちらも／とどまります／誰にとっても見えないままに', '', 'and／both／remain／invisible to anyone'),
      b('who has never', 'その人が／一度も〜ない', '', 'who／has never'),
      b('been taught them', '教わって／それらを', '', 'been taught／them'),
    ],
    [
      b(
        'A host may spend days preparing a gorgeous meal',
        '主人は／費やすことがあります／何日もかけて豪華な食事を用意することに',
        '',
        'A host／may spend／days preparing a gorgeous meal',
      ),
      b('or may improvise something frugal', 'あるいは／即興で作ることもあります／何か質素なものを', '', 'or／may improvise／something frugal'),
      b('from anything the kitchen happens', '台所にたまたまあるどんなものからでも'),
      b('to hold', '置いている'),
    ],
    [
      b('The effort rather than the expense is', '費用ではなく手間のほうが／〜です', '', 'The effort rather than the expense／is'),
      b('what a guest is generally expected', '客が一般に期待されていること'),
      b('to notice and to acknowledge', '気づくことを／そして認めることを', '', 'to notice／and to acknowledge'),
    ],
    [
      b(
        'Where resources have been depleted, a small portion offered willingly',
        '〜する場所では／資源が乏しくなり、進んで差し出された少量が',
        '',
        'Where／resources have been depleted, a small portion offered willingly',
      ),
      b('can mean more than an imposing display of plenty', '意味しうる／堂々たる豊かさの誇示以上のものを', '', 'can mean／more than an imposing display of plenty'),
    ],
    [
      b('Visitors', '訪問者は'),
      b('who measure hospitality', 'その訪問者が／もてなしを測る', '', 'who／measure hospitality'),
      b('by cost alone', '費用だけで'),
      b('will therefore misread the generosity', 'したがって読み違えるでしょう／その寛大さを', '', 'will therefore misread／the generosity'),
      b('in front of them almost entirely', '目の前にある寛大さをほとんど完全に'),
    ],
    [
      b('Seating usually encodes rank, age', '席次はたいてい／暗号のように示します／序列や年齢を', '', 'Seating usually／encodes／rank, age'),
      b(
        'or the direction of a view that the household regards as honored',
        'あるいは／その家が名誉あるものとみなす眺めの方向を',
        '',
        'or／the direction of a view that the household regards as honored',
      ),
    ],
    [
      b('Guests', '客は'),
      b('who are asked', 'その客が／求められた', '', 'who／are asked'),
      b(
        'to sit in a particular place receive information, and not merely a chair',
        '座るように／特定の場所に、そして情報を受け取っているのであって、単に椅子を受け取っているのではありません',
        '',
        'to sit／in a particular place receive information, and not merely a chair',
      ),
    ],
    [
      b(
        'To behave sensibly at an unfamiliar table, it helps',
        '分別よくふるまうには／不慣れな食卓で、それが／役立ちます',
        '',
        'To behave sensibly／at an unfamiliar table, it／helps',
      ),
      b('to wait, to watch', '待つことが／観察することが', '', 'to wait,／to watch'),
      b('and to follow the person', 'そして／その人に従うことが', '', 'and／to follow the person'),
      b('who clearly belongs', 'その人は／明らかに／その場に属しています', '', 'who／clearly／belongs'),
    ],
    [
      b('Some tables require silence', 'ある食卓は／求めます／沈黙を', '', 'Some tables／require／silence'),
      b('while food is being served', '食事が供されている間'),
      b('while others treat continuous conversation as the whole point of eating together', '一方で別の食卓は絶え間ない会話を共に食べることの目的そのものとみなします'),
    ],
    [
      b('Timing is equally variable', '時間も／同じように／多様です', '', 'Timing／is equally／variable'),
      b(
        'since a main meal may commence at six in one country and at eleven',
        'なぜなら／主要な食事は／始まりうるからです／ある国では六時に、別の国では十一時に',
        '',
        'since／a main meal／may commence／at six in one country and at eleven',
      ),
      b('in another', '別の国では'),
    ],
    [
      b('Guests', '客は'),
      b(
        'who anticipate the local rhythm avoid arriving hungry',
        'その客が／土地の時間の流れを見越して避けます／着くことを／空腹で',
        '',
        'who／anticipate the local rhythm avoid／arriving／hungry',
      ),
      b('at a house', 'ある家に'),
      b('that has not yet', 'その家が／まだ〜していない／その時点まで', '', 'that／has not／yet'),
      b('begun to cook', '始めて／調理を', '', 'begun／to cook'),
    ],
    [
      b('What counts', '何が／数えられるのか', '', 'What／counts'),
      b('as edible is also a local judgment rather than a fixed biological fact', '食べられるものとしてかもまた、固定した生物学的事実ではなく土地の判断です'),
    ],
    [
      b('A dish that seems notorious to one visitor is ordinary comfort food to the family that is serving it', 'ある訪問者には悪名高く思える料理も、それを供している家族にとってはありふれた心安らぐ食べ物です'),
    ],
    [
      b('Curiosity that is expressed', '表される好奇心は'),
      b('without any comment is therefore almost always the safer and more welcome response', '何の論評もなしに、したがってほとんどの場合より安全でより歓迎される反応です'),
    ],

    // ===== belief : 祭り・信仰・日常生活 =====
    [
      b(
        'Festivals look like exceptions to daily life, and yet they usually restate what a community values most',
        '祭りは／見えます／日常生活の例外のように、それでもたいてい共同体が最も重んじるものを言い直しています',
        '',
        'Festivals／look／like exceptions to daily life, and yet they usually restate what a community values most',
      ),
    ],
    [
      b('A ritual repeated', '儀礼は／繰り返された', '', 'A ritual／repeated'),
      b('for centuries carries meanings', '何世紀も、そして意味を運んでいます'),
      b('that its own participants', 'その意味を／それ自身の／参加者が', '', 'that its／own／participants'),
      b('may no longer be able', 'もはや〜できないかもしれません／できる状態に', '', 'may no longer be／able'),
      b('to explain', '説明することが'),
    ],
    [
      b(
        'That is not ignorance',
        'それは／〜ではありません／無知',
        '',
        'That／is not／ignorance',
      ),
      b(
        'because tradition stores knowledge in a form that words alone would quickly lose',
        'なぜなら／伝統は知識を、ある形で蓄えるからです。その形とは、言葉だけなら／すぐに失ってしまうような形です',
        '',
        'because／tradition stores knowledge in a form that words alone／would quickly lose',
      ),
    ],
    [
      b('Some festivals are religious', 'ある祭りは／〜です／宗教的', '', 'Some festivals／are／religious'),
      b('in origin and now largely social', '起源においてそうであり、今ではおおむね社交的です'),
      b('while others have travelled', '一方で別の祭りは進んできました'),
      b('in the opposite direction', '反対の方向へ'),
    ],
    [
      b('A holy day can become a shopping season', '聖なる日が／なりうる／買い物の季節に', '', 'A holy day／can become／a shopping season'),
      b(
        'and a commercial event can gradually acquire a sincere ritual meaning',
        'そして／商業的な催しが／次第に帯びることもあります／誠実な儀礼の意味を',
        '',
        'and／a commercial event／can gradually acquire／a sincere ritual meaning',
      ),
    ],
    [
      b('Neither change makes the festival false', 'どちらの／変化も／祭りを偽物にはしません', '', 'Neither／change／makes the festival false'),
      b('since meaning is assigned', 'なぜなら／意味は与えられるからです', '', 'since／meaning is assigned'),
      b('by the people', '人々によって'),
      b('who actually keep it year', 'その人々が／実際に／続けています／それを／年ごとに', '', 'who／actually／keep／it／year'),
      b('after year', '年を追って'),
    ],
    [
      b(
        'Music, dancing, and calligraphy often carry the parts of belief',
        '音楽や／踊りや／そして／書はしばしば／運んでいます／信仰の部分を',
        '',
        'Music,／dancing,／and／calligraphy often／carry／the parts of belief',
      ),
      b(
        'that formal doctrine states rather poorly or leaves out completely',
        'その部分を／公式の教義がうまく述べられず、あるいは／取り／こぼしてしまいます',
        '',
        'that／formal doctrine states rather poorly or／leaves／out completely',
      ),
    ],
    [
      b('A rhythm learned', '律動は／覚えられた', '', 'A rhythm／learned'),
      b('at an early age can resonate long', '幼いころに、そして長く響き続けます'),
      b('after the theology that', 'その神学のあとも'),
      b('once explained it has been lost', 'かつて／説明した／それを、その神学が失われたあとも', '', 'once／explained／it has been lost'),
    ],
    [
      b('This is', 'これが／〜です', '', 'This／is'),
      b(
        'why an artifact removed from its festival can look like a pretty object',
        'なぜ／工芸品が／切り離され／祭りから、単なる美しい品に見えるのか',
        '',
        'why／an artifact／removed／from its festival can look like a pretty object',
      ),
      b('inside a well-lit museum case', '明るく照らされた博物館の陳列棚の中では'),
    ],
    [
      b('Superstition and principle are much harder', '迷信と信条はずっと難しいものです'),
      b(
        'to separate than outsiders usually assume them to be',
        '分けることが／部外者が普通そうだと考えるよりも',
        '',
        'to separate than outsiders usually assume them／to be',
      ),
    ],
    [
      b('A gesture made', 'なされる身ぶりは'),
      b('for luck may also be a form of respect toward the dead of a particular family', '幸運を願って、ある家の死者への敬意の形でもありうるのです'),
    ],
    [
      b('Calling such a gesture irrational', 'そうした身ぶりを非合理だと呼ぶことは'),
      b('answers a question', '答えることです／一つの問いに', '', 'answers／a question'),
      b(
        'that the people performing it were never actually asking',
        'その問いを／人々が／行っている／それを、実際には決して問うていませんでした',
        '',
        'that／the people／performing／it were never actually asking',
      ),
      b('in the first place', 'そもそも'),
    ],
    [
      b(
        'Many festivals now serve two audiences',
        '今日多くの祭りは／応えています／二つの観客に',
        '',
        'Many festivals now／serve／two audiences',
      ),
      b('at once: the community', '同時に、すなわち共同体と'),
      b(
        'that keeps them and the visitors who photograph them',
        'その共同体が／続けています／祭りを／そして、それを写真に撮る訪問者も',
        '',
        'that／keeps／them／and the visitors who photograph them',
      ),
    ],
    [
      b(
        'A photogenic ritual can survive because tourism funds it',
        '写真映えする儀礼は／生き残ることができます／観光がそれを支えるので',
        '',
        'A photogenic ritual／can survive／because tourism funds it',
      ),
      b('and can also be changed', 'そして／作り変えられることもあります', '', 'and／can also be changed'),
      b('by that very same attention', 'まさにその同じ関心によって'),
    ],
    [
      b('Whether this counts', '〜かどうか／これが数えられるのか', '', 'Whether／this counts'),
      b('as preservation or', '保存として／それとも', '', 'as／preservation or'),
      b('as loss is a genuine disagreement rather than a question', '喪失としてかは、一つの問いというより本物の意見の対立です'),
      b('with a settled answer', '決着した答えを持つ'),
    ],
    [
      b('Imperial history complicates the question further', '帝国の歴史は／さらに複雑にします／この問いを', '', 'Imperial history／complicates／the question further'),
      b(
        'since some traditions were suppressed and much later revived deliberately',
        'なぜなら／ある伝統は／抑圧され／そして／ずっと後に／復活させられたからです／意図的に',
        '',
        'since／some traditions／were suppressed／and／much later／revived／deliberately',
      ),
    ],
    [
      b('A revived custom is not less real', '復活した風習は／〜ではありません／現実味が薄い', '', 'A revived custom／is not／less real'),
      b('although it may serve purposes', 'ただし／それは／仕えているかもしれません／目的に', '', 'although／it／may serve／purposes'),
      b(
        'that the original version never had and',
        'その目的を／元の形は／決して／持たず／そして',
        '',
        'that／the original version／never／had／and',
      ),
      b('could not have imagined', '想像もできなかったでしょう'),
    ],
    [
      b('Reading a festival well therefore', 'したがって祭りをよく読むことは'),
      b('means asking', '意味します／問うことを', '', 'means／asking'),
      b('who keeps it', '誰が／それを続けているのか', '', 'who／keeps it'),
      b('who pays for it', '誰が／払うのか／その費用を', '', 'who／pays／for it'),
      b('and', 'そして'),
      b('who is left out', '誰が／締め出されているのかを', '', 'who／is left out'),
    ],

    // ===== memory : 芸術・物・記憶 =====
    [
      b('Objects outlive the people', '物は／長く残ります／人々より', '', 'Objects／outlive／the people'),
      b('who made them', 'その人々が／それらを作りました', '', 'who／made them'),
      b(
        'and they carry memory',
        'そして／物は／記憶を運びます',
        '',
        'and／they／carry memory',
      ),
      b('in a way', 'ある仕方で'),
      b('that paper documents cannot', 'その仕方は／紙の文書には／できません', '', 'that／paper documents／cannot'),
    ],
    [
      b('A length of fabric', '一巻きの布'),
      b('a brick', '一つの煉瓦'),
      b(
        'or a wooden chest can record a technique',
        'あるいは／木の櫃が／記録しうるのです／ある技法を',
        '',
        'or／a wooden chest／can record／a technique',
      ),
      b(
        'that no surviving manuscript ever describes',
        'その技法を／どの／現存する／写本も決して記していません',
        '',
        'that／no／surviving／manuscript ever describes',
      ),
    ],
    [
      b(
        'Museums preserve such things carefully',
        '博物館は／保存します／そうした物を／丁寧に',
        '',
        'Museums／preserve／such things／carefully',
      ),
      b(
        'but they also remove them',
        'しかし／博物館はまた／引き離しています／それらを',
        '',
        'but／they also／remove／them',
      ),
      b('from the ordinary rooms', 'ありふれた部屋から'),
      b('that', 'その部屋は'),
      b('once explained them', 'かつて／説明していました／それらを', '', 'once／explained／them'),
    ],
    [
      b(
        'A souvenir bought at a temple gate belongs to two systems of meaning',
        '寺の門前で買われた土産物は／属しています／二つの意味の体系に',
        '',
        'A souvenir bought at a temple gate／belongs／to two systems of meaning',
      ),
      b('at the very same time', 'まったく同じ時に'),
    ],
    [
      b('For the maker it may be an income', '作り手にとってそれは収入かもしれません'),
      b('while for the buyer it is a compressed memory of a journey', '一方で買い手にとっては旅を圧縮した記憶です'),
    ],
    [
      b(
        'Neither meaning is false',
        'どちらの／意味も〜ではありません／偽り',
        '',
        'Neither／meaning is／false',
      ),
      b(
        'although the two sides rarely acknowledge each other',
        'ただし／両者はめったに／認め合いません／互いを',
        '',
        'although／the two sides rarely／acknowledge／each other',
      ),
      b('in any explicit or public way', '明示的にも公の形でも'),
    ],
    [
      b(
        'Craft traditions usually pass through years of apprenticeship rather than',
        '工芸の伝統はたいてい／受け継がれます／何年もの徒弟の関係を通って、そうではなく',
        '',
        'Craft traditions usually／pass／through years of apprenticeship rather than',
      ),
      b('through instruction', '指導を通ってではなく'),
      b('that can be recorded and copied', 'その指導は／書き留められ／そして／複製できます', '', 'that／can be recorded／and／copied'),
    ],
    [
      b('A pedagogy built', '教え方は／築かれた', '', 'A pedagogy／built'),
      b('on watching and repeating transmits the kind of judgment', '見て真似ることの上に、そしてある種の判断を伝えます'),
      b('that verbal rules would inevitably flatten', 'その判断を／言葉の規則なら／必ず平板にしてしまうでしょう', '', 'that／verbal rules／would inevitably flatten'),
    ],
    [
      b('When a workshop closes', '工房が閉じるとき'),
      b('the loss is not a product but a set of decisions', '失われるものは／〜ではなく／製品ではなく一連の判断です', '', 'the loss／is not／a product but a set of decisions'),
      b('that nobody ever recorded', 'その判断を／誰も／書き留めませんでした', '', 'that／nobody ever／recorded'),
    ],
    [
      b(
        'Catastrophe accelerates this kind of loss',
        '災厄は／加速させます／この種の喪失を',
        '',
        'Catastrophe／accelerates／this kind of loss',
      ),
      b(
        'and so, much less obviously, does a period of sudden wealth',
        'そして／同じように／はるかに目立たない形で／それほど明らかにではなく／そうします／急激な富の時期も',
        '',
        'and／so,／much less／obviously,／does／a period of sudden wealth',
      ),
    ],
    [
      b(
        'A factory that produces a cheaper version of a traditional object can end the craft',
        '工場が／作る／伝統的な品物の安価な複製を、そしてその工芸を終わらせうるのです',
        '',
        'A factory that／produces／a cheaper version of a traditional object can end the craft',
      ),
      b('within a single generation', 'たった一世代のうちに'),
    ],
    [
      b(
        'The surplus that such a factory creates may later fund the museum that displays',
        'そうした工場が／生み出す余剰は、こうなるかもしれません／のちに、展示する博物館の資金になる',
        '',
        'The surplus that such a factory／creates may／later fund the museum that displays',
      ),
      b('what it replaced', 'それが取って代わったものを'),
    ],
    [
      b('Stories work', '物語も／働きます', '', 'Stories／work'),
      b('in much the same way', 'ほぼ同じように'),
      b(
        'since a protagonist can carry a moral premise',
        'なぜなら／主人公は／運べるからです／道徳的な前提を',
        '',
        'since／a protagonist／can carry／a moral premise',
      ),
      b('across many centuries', '何世紀にもわたって'),
    ],
    [
      b(
        'A myth is not a failed history',
        '神話は／〜ではありません／失敗した歴史',
        '',
        'A myth／is not／a failed history',
      ),
      b(
        'because it is a compressed argument about',
        'なぜなら／それは／〜だからです／圧縮された議論、〜についての',
        '',
        'because／it／is／a compressed argument about',
      ),
      b('how people should act', 'どのように／人が行動すべきか', '', 'how／people should act'),
    ],
    [
      b('Reading it', 'それを読むことは'),
      b(
        'as a literal claim therefore misses the function',
        '〜として／文字どおりの主張として、したがって／見落とします／その働きを',
        '',
        'as／a literal claim therefore／misses／the function',
      ),
      b(
        'that the story is actually performing',
        'その物語が／実際に果たしている',
        '',
        'that the story／is actually performing',
      ),
      b('for its readers', 'その読者のために'),
    ],
    [
      b('Every act of preservation is', 'あらゆる保存の行為は／〜です', '', 'Every act of preservation／is'),
      b('at the same time an act of selection', '同時に選別の行為'),
      b(
        'that someone has to make',
        'その選別を／誰かが／なりません／下さなければ',
        '',
        'that／someone／has／to make',
      ),
    ],
    [
      b('Someone decides', '誰かが決めます'),
      b('which manuscript is restored', 'どの写本が修復されるのか'),
      b('which building is protected', 'どの建物が守られるのか'),
      b('and', 'そして'),
      b('which one is quietly allowed to crack', 'どれが静かにひび割れるままにされるのかを'),
    ],
    [
      b('Those decisions quietly shape what a later generation will believe', 'そうした決定が、後の世代が何を信じるかを静かに形づくります'),
      b(
        'that its own ancestors actually cared about',
        '次の内容だと（中身は次へ）／自分たちの／固有の／祖先が実際に大切にしていたのだと',
        '',
        'that／its／own／ancestors actually cared about',
      ),
    ],

    // ===== movement : 言語・場所・移動 =====
    [
      b('Languages move together', '言語は／移動します／ともに', '', 'Languages／move／together'),
      b('with people', '人とともに'),
      b('and they change again', 'そして／言語は再び変化します', '', 'and／they change again'),
      b('in the places', 'その場所で'),
      b(
        'where those people eventually arrive and settle',
        'そこに／その人々がやがて／たどり着き／そして／落ち着きます',
        '',
        'where／those people eventually／arrive／and／settle',
      ),
    ],
    [
      b('A dialect is not a corrupted version of a standard', '方言は／〜ではありません／標準語の崩れた形', '', 'A dialect／is not／a corrupted version of a standard'),
      b('because it is a variety', 'なぜなら／それは一つの変種だからです', '', 'because／it is a variety'),
      b('with a history of its own', 'それ自身の歴史を持つ'),
    ],
    [
      b(
        'The variety that becomes the standard usually did so for political and economic reasons rather than',
        '変種が／なる／標準語に、たいてい政治的・経済的な理由でそうなったのであって、そうではなく',
        '',
        'The variety that／becomes／the standard usually did so for political and economic reasons rather than',
      ),
      b('for linguistic ones', '言語的な理由によってではありません'),
    ],
    [
      b(
        'Migration is often described as a single decision',
        '移住は／しばしば語られます／一つの決断として',
        '',
        'Migration／is often described／as a single decision',
      ),
      b(
        'though it is normally a long sequence of smaller ones',
        'ただし／それは／普通〜です／もっと小さな決断の長い連なり',
        '',
        'though／it／is normally／a long sequence of smaller ones',
      ),
    ],
    [
      b(
        'A family may send one member first, then a second',
        'ある／家族が／送り出すことがあります／まず一人を、そして次に二人目を',
        '',
        'A／family／may send／one member first, then a second',
      ),
      b(
        'and only much later consider the move permanent',
        'そして／ずっと後になってようやく／考えます／その移動を恒久的だと',
        '',
        'and／only much later／consider／the move permanent',
      ),
    ],
    [
      b('Remittances, return visits', '送金や、里帰りの／訪問', '', 'Remittances, return／visits'),
      b(
        'and unfinished plans can keep two distant places connected for several decades',
        'そして／未完の／計画が保ちうるのです／遠く離れた二つの場所を数十年つながったままに',
        '',
        'and／unfinished／plans can keep／two distant places connected for several decades',
      ),
      b('at a time', '一度に'),
    ],
    [
      b('Cities tend', '都市は／傾向があります', '', 'Cities／tend'),
      b('to grow at the outer edges', '成長する／外側の周縁で', '', 'to grow／at the outer edges'),
      b(
        'where new arrivals can still afford both',
        'そこでは／新しく来た人が／まだ余裕を持てます／両方に',
        '',
        'where／new arrivals／can still afford／both',
      ),
      b('to live and to work', '暮らすことも／そして働くことも', '', 'to live／and to work'),
    ],
    [
      b('Urbanization concentrates commerce', '都市化は／集中させます／商業を', '', 'Urbanization／concentrates／commerce'),
      b(
        'and congestion soon follows the very routes',
        'そして／やがて渋滞が／たどります／まさにその経路を',
        '',
        'and／congestion soon／follows／the very routes',
      ),
      b('that opportunity first took', 'その経路を／機会が最初に／通りました', '', 'that／opportunity first／took'),
    ],
    [
      b(
        'A suburban district that looks random is often an accurate record of',
        '無計画に見える郊外の一区画は／しばしば〜です／正確な記録、〜の',
        '',
        'A suburban district that looks random／is often／an accurate record of',
      ),
      b('who arrived', '誰が／着いたのか', '', 'who／arrived'),
      b('in which decade', 'どの十年に'),
    ],
    [
      b('Trade has always carried words along', '交易は／常に運んできました／言葉を一緒に', '', 'Trade／has always carried／words along'),
      b('with the commodities', 'それらの商品とともに'),
      b('that were being bought and sold', 'その商品は／〜されていました／売り買い', '', 'that／were being／bought and sold'),
      b('across long distances', '長い距離を越えて'),
    ],
    [
      b('A vendor', '商人は'),
      b(
        'who sells an imported textile gradually learns the name under',
        'その商人が／売る／輸入された織物を、そして次第にその名を覚えます、〜のもとで',
        '',
        'who／sells／an imported textile gradually learns the name under',
      ),
      b('which that cloth first travelled', 'その名でその布が最初に旅してきたのです'),
    ],
    [
      b('Over time the borrowed word outlives the trade route', '時が経つにつれ、借用された語はその交易路より長く生き残ります'),
      b(
        'that originally delivered it to the market',
        'その交易路が／もともと／届けました／それを市場へ',
        '',
        'that／originally／delivered／it to the market',
      ),
    ],
    [
      b('Work shapes language quite', '仕事は／言語をまったく形づくります', '', 'Work／shapes language quite'),
      b('as directly', '同じくらい直接に'),
      b('as geography does', '〜と同じく／地理が／するのと', '', 'as／geography／does'),
      b(
        'and it often does so rather more quickly',
        'そして／仕事はしばしば／行います／そうしたことをむしろ／もっと速く',
        '',
        'and／it often／does／so rather／more quickly',
      ),
    ],
    [
      b('An entrepreneur', '起業家と'),
      b('a contractor', '請負業者と'),
      b(
        'and a factory worker in one city may share a vocation',
        'そして／同じ都市の工場労働者は／共有しているかもしれません／一つの職業を',
        '',
        'and／a factory worker in one city／may share／a vocation',
      ),
      b('without sharing much vocabulary', '語彙をあまり共有しないままで'),
    ],
    [
      b('Registers separate people', '位相は／隔てます／人を', '', 'Registers／separate／people'),
      b('inside a single language', '一つの言語の内側で'),
      b('as firmly', '同じくらい確かに'),
      b('as national borders separate them', '〜と同じく／国境が／隔てる／人を', '', 'as／national borders／separate／them'),
      b('outside it', 'その言語の外側で'),
    ],
    [
      b('Bilingual communities are frequently described', '二言語の共同体はしばしば描かれます'),
      b(
        'as being trapped somewhere awkwardly',
        '〜として／捕らわれていると／どこかに／居心地悪く',
        '',
        'as／being trapped／somewhere／awkwardly',
      ),
      b('between two different worlds', '二つの異なる世界のはざまに'),
    ],
    [
      b(
        'That description flatters the observer more than it describes the speakers',
        'その描写は／持ち上げています／話し手を描くというより観察者を',
        '',
        'That description／flatters／the observer more than it describes the speakers',
      ),
      b(
        'who are usually managing both worlds competently',
        'その話し手は／たいていこなしています／両方の世界を／手際よく',
        '',
        'who／are usually managing／both worlds／competently',
      ),
    ],
    [
      b(
        'What looks like confusion from outside is, seen from',
        '何が／見えるのか／〜のように／外からの混乱／それは〜と見られれば／〜から',
        '',
        'What／looks／like／confusion from outside／is, seen／from',
      ),
      b('inside, ordinary and very often quite deliberate', '内側から見れば当たり前で、ごく多くの場合きわめて意図的です'),
    ],

    // ===== stereotypes : 決めつけずに学ぶ =====
    [
      b('A stereotype is a compressed observation', '固定観念とは／〜です／圧縮された観察', '', 'A stereotype／is／a compressed observation'),
      b('that has quietly stopped', 'その観察が／静かにやめてしまいました', '', 'that／has quietly stopped'),
      b('being tested against any new evidence', '検証されることを／どんな新しい証拠に照らしても', '', 'being tested／against any new evidence'),
      b('at all', 'まったく'),
    ],
    [
      b('It usually begins', 'それは／たいてい／始まります', '', 'It／usually／begins'),
      b(
        'with something a traveller genuinely saw and ends',
        '旅行者が実際に／見た／何かから、そして／終わります',
        '',
        'with something a traveller genuinely／saw／and／ends',
      ),
      b('as a claim', '〜として／一つの／主張', '', 'as／a／claim'),
      b('about millions of people', '何百万もの人についての'),
    ],
    [
      b('The error is not the original observation', '誤りは／〜ではありません／最初の観察', '', 'The error／is not／the original observation'),
      b('because the error lies', 'なぜなら／誤りは横たわっているからです', '', 'because／the error lies'),
      b('in the range over', 'その範囲の中に、その範囲にわたって'),
      b('which it is applied', 'それが適用されるのです'),
    ],
    [
      b('Words such as always and every are', 'always や every のような語は／〜です', '', 'Words such as always and every／are'),
      b('among the clearest signals', '最も明確な合図の一つ'),
      b('that a description has stopped', 'すなわち／記述が／やめてしまったという', '', 'that／a description／has stopped'),
      b('being precise', 'あることを／正確で', '', 'being／precise'),
    ],
    [
      b(
        'Most customs vary by region, by generation',
        'たいていの風習は／異なります／地域によって、世代によって',
        '',
        'Most customs／vary／by region, by generation',
      ),
      b('by economic class', '経済的な階層によって'),
      b('and by the particular occasion that is involved', 'そして／関わる特定の場面によって／関わっている', '', 'and／by the particular occasion that／is involved'),
    ],
    [
      b('A visitor', '訪問者は'),
      b('who has seen three families', 'その訪問者が／会った／三つの家族に', '', 'who／has seen／three families'),
      b('has seen three families', '会ったのです／三つの家族に', '', 'has seen／three families'),
      b('and has certainly not seen a whole nation', 'そして／決して会ってはいません／一つの国民全体に', '', 'and／has certainly not seen／a whole nation'),
    ],
    [
      b('Contrary cases are often dismissed as exceptions', '反対の事例は／しばしば／例外として退けられます', '', 'Contrary cases／are often dismissed／as exceptions'),
      b(
        'which quietly protects the original claim',
        'そしてそれが／静かに／守ってしまいます／元の主張を',
        '',
        'which／quietly／protects／the original claim',
      ),
      b('from any evidence', 'あらゆる証拠から'),
    ],
    [
      b('A useful habit is', '役に立つ習慣は／〜です', '', 'A useful habit／is'),
      b('to ask', '問うこと'),
      b('what would have to be true', '何が／〜でなければならないのか／真である', '', 'what／would have／to be true'),
      b('for the general claim itself', 'その一般的な主張そのものが'),
      b('to fail', '成り立たなくなるためには'),
    ],
    [
      b('If no answer to', 'もし／何の／答えも／〜に対する', '', 'If／no／answer／to'),
      b(
        'that question is available',
        'その／問いに／〜なら／答えが用意できる',
        '',
        'that／question／is／available',
      ),
      b('at all', 'まったく'),
      b(
        'the statement is an attitude rather than a description',
        'その言明は／〜です／記述というより態度',
        '',
        'the statement／is／an attitude rather than a description',
      ),
    ],
    [
      b('Comparison between cultures is unavoidable and', '文化どうしの比較は／〜です／避けられないものであり、そして', '', 'Comparison between cultures／is／unavoidable and'),
      b('when it is careful enough, genuinely informative', '十分に注意深く行われるなら、本当に有益です'),
      b('for both sides', '双方にとって'),
    ],
    [
      b('The difficulty is', '難しいのは／〜です', '', 'The difficulty／is'),
      b(
        'that comparisons usually flatter the culture',
        '次の内容だと（中身は次へ）／比較がたいてい／持ち上げてしまう／その文化を',
        '',
        'that／comparisons usually／flatter／the culture',
      ),
      b('that happens', 'その文化が／たまたま', '', 'that／happens'),
      b('to supply the standard of measurement', '提供することになった／測る基準を', '', 'to supply／the standard of measurement'),
    ],
    [
      b('Describing one', '一つを述べることは'),
      b('practice', 'ある慣行を'),
      b(
        'as the natural one makes every other practice look like a deviation',
        '〜として／自然なものが／見せます／他のあらゆる慣行を逸脱のように',
        '',
        'as／the natural one／makes／every other practice look like a deviation',
      ),
      b('from it', 'そこからの'),
    ],
    [
      b(
        'Reluctance to judge too quickly is not the same thing as indifference toward values',
        '性急に判断することへのためらいは／〜ではありません／価値への無関心と同じもの',
        '',
        'Reluctance to judge too quickly／is not／the same thing as indifference toward values',
      ),
    ],
    [
      b('It is the recognition', 'それは次の認識です'),
      b(
        'that a practice usually makes sense',
        '次の内容だと（中身は次へ）／ある慣行がたいてい／持つ／意味を',
        '',
        'that／a practice usually／makes／sense',
      ),
      b('inside conditions the visitor', '訪問者がまだ見ていない条件の内側では'),
      b('has not yet seen', 'まだ〜していない／見て', '', 'has not／yet seen'),
    ],
    [
      b('Once those conditions are understood', 'いったん／その条件が理解されると', '', 'Once／those conditions are understood'),
      b(
        'some practices still deserve criticism',
        'ある慣行は／なお／値します／批判に',
        '',
        'some practices／still／deserve／criticism',
      ),
      b('and that criticism rests', 'そして／その批判は／立っています', '', 'and／that criticism／rests'),
      b('on something solid', '確かなものの上に'),
    ],
    [
      b(
        'The aim of studying other customs is not simply',
        '〜の目的は／学ぶという／他の風習を、それは〜ではありません／単に',
        '',
        'The aim of／studying／other customs is not／simply',
      ),
      b(
        'to collect a store of facts about distant people',
        '集めること／遠くの人々についての事実の蓄えを',
        '',
        'to collect／a store of facts about distant people',
      ),
    ],
    [
      b('It is', 'それは／〜です', '', 'It／is'),
      b('to notice', '気づくこと'),
      b('that one’s own habits', '次の内容だと（中身は次へ）／自分自身の習慣もまた', '', 'that／one’s own habits'),
      b('are also local, also learned', '〜でもある／土地に根ざし、学ばれたものでもある', '', 'are also／local, also learned'),
      b(
        'and also open to question',
        'そして／また／開かれている／問い直しに',
        '',
        'and／also／open／to question',
      ),
    ],
    [
      b('That discovery is uncomfortable', 'その発見は／〜です／居心地が悪い', '', 'That discovery／is／uncomfortable'),
      b('for almost everyone', 'ほとんど誰にとっても'),
      b(
        'and the discomfort it produces is precisely the point',
        'そして／それが生む居心地の悪さ／こそがまさに／要点なのです',
        '',
        'and／the discomfort it／produces is precisely／the point',
      ),
    ],
  ]),
  p_ext_3000_shared_watershed: passage([
    // ===== source : 雨から川へ =====
    [
      b('A river basin is the whole area of land from', '流域とは、雨や雪がそこから流れ出す土地全体のことです'),
      b('which rain and melting snow drain', 'そこから雨と解けた雪が流れ下り'),
      b('into one single river', 'ただ一本の川へと入ります'),
    ],
    [
      b(
        'Its outer boundary is marked by ridges of high ground rather than',
        'その外側の境界は／示されます／高い尾根によってであって、そうではなく',
        '',
        'Its outer boundary／is marked／by ridges of high ground rather than',
      ),
      b('by any line', 'どんな線によってでもありません'),
      b(
        'that a government has ever set out and agreed on',
        'その線を／政府が／これまで／定めて合意してきた',
        '',
        'that／a government／has／ever set out and agreed on',
      ),
    ],
    [
      b(
        'That single difference explains a great deal of the trouble',
        'そのたった一つの違いが／説明します／多くの厄介ごとを',
        '',
        'That single difference／explains／a great deal of the trouble',
      ),
      b('that shared river basins tend', 'その厄介ごとを／共有された／流域が生みがちです', '', 'that／shared／river basins tend'),
      b('to produce later', '生み出す／のちになって', '', 'to produce／later'),
    ],
    [
      b(
        'Rain that falls on a forest does not reach the channel in the same way that rain falling',
        '雨は／降る／森に、そして同じようには川筋に届きません、降る雨が',
        '',
        'Rain that／falls／on a forest does not reach the channel in the same way that rain falling',
      ),
      b('on a paved road does', '舗装された道路にそうするようには'),
    ],
    [
      b('Leaves, roots', '葉と根'),
      b(
        'and the loose floor of a forest all slow the water down and let a large part of it sink',
        'そして／森のやわらかい地面が水の勢いを弱め／させます／その多くをしみ込ませることを',
        '',
        'and／the loose floor of a forest all slow the water down and／let／a large part of it sink',
      ),
      b('into the ground', '地面の中へ'),
    ],
    [
      b(
        'Water that sinks into the ground is stored up',
        '水は／しみ込む／地面へ、そして蓄えられます',
        '',
        'Water that／sinks／into the ground is stored up',
      ),
      b('for later', 'のちのために'),
      b('while water that runs off the surface arrives quickly and all', '一方で表面を流れ去る水は速く、そしてすべて'),
      b('at once', '一度に到達します'),
    ],
    [
      b(
        'A basin therefore behaves far less like a simple pipe than like a sponge',
        'したがって流域は／ふるまいます／単純な管というよりはるかに海綿のように',
        '',
        'A basin therefore／behaves／far less like a simple pipe than like a sponge',
      ),
      b('with a very uneven surface', 'ひどく不揃いな表面を持つ'),
    ],
    [
      b(
        'Snow adds a delay of several months',
        '雪は／加えます／数か月分の遅れを',
        '',
        'Snow／adds／a delay of several months',
      ),
      b(
        'that farmers living downstream have depended on',
        'その遅れに／農民が／暮らす／下流に／頼ってきました／ずっと',
        '',
        'that／farmers／living／downstream／have depended／on',
      ),
      b('for many centuries', '何世紀にもわたって'),
    ],
    [
      b(
        'A deep layer of winter snow collects several months of rainfall and then releases it slowly',
        '冬の深い雪の層は／その層が／それが／集めます／数か月分の降水を、そしてそれを放出します／ゆっくりと',
        '',
        'A deep layer of winter snow／collects／several months of rainfall and then／releases／it／slowly',
      ),
      b('through the spring and the early summer', '春から初夏にかけて'),
    ],
    [
      b('When more of that rainfall arrives as rain instead of snow', 'その降水がより多く雪ではなく雨として届くようになると'),
      b(
        'the same annual total reaches the fields',
        '同じ年間総量が／届きます／畑に',
        '',
        'the same annual total／reaches／the fields',
      ),
      b('at the wrong time of year', '一年のうち間違った時期に'),
    ],
    [
      b(
        'The contrast between those two patterns matters far more than the average figure that most reports choose',
        'その二つの型の対比のほうが、平均値よりはるかに重要です。その平均値とは、たいていの／報告が／選ぶ平均値です',
        '',
        'The contrast between those two patterns matters far more than the average figure that most／reports／choose',
      ),
      b('to quote', '引用することを'),
    ],
    [
      b(
        'Fog, pollen, and fine sand are all carried into the basin',
        '霧と花粉と細かな砂は／〜されます／みな流域へ運び込まれる',
        '',
        'Fog, pollen, and fine sand／are／all carried into the basin',
      ),
      b('by the same moving air', '動く同じ空気によって'),
      b('that also brings the rain', 'その空気が／また／もたらします／雨を', '', 'that／also／brings／the rain'),
    ],
    [
      b('What a river actually contains is therefore partly a record of', 'したがって川が実際に含むものは、部分的には〜の記録です'),
      b('what the wind has picked up along the way', '風が道すがら拾い上げてきたものの'),
    ],
    [
      b('A lake near the middle of a basin acts', '流域の中ほどにある湖は／働きます', '', 'A lake near the middle of a basin／acts'),
      b('as a quiet pool in', '〜として／静かな水たまり、その中で', '', 'as／a quiet pool in'),
      b('which much of this drifting material can settle', 'この漂う物質の多くが沈むことができます'),
    ],
    [
      b(
        'Its water leaves the lake much clearer than it entered',
        'その水は／出ていきます／入ってきたときよりずっと澄んで湖から',
        '',
        'Its water／leaves／the lake much clearer than it entered',
      ),
      b(
        'and its bed slowly gains a layer',
        'そして／その／底がゆっくりと得ます／ひとつの層を',
        '',
        'and／its／bed slowly gains／a layer',
      ),
      b('that scientists can later', 'その層を／科学者が／〜できます／のちに', '', 'that／scientists／can／later'),
      b('read', '読み取ることが'),
    ],
    [
      b('An anomaly in a single season is quite ordinary', 'ひとつの季節の異常はごくありふれたことです'),
      b(
        'but a long run of them is an indication of something else',
        'しかし／それが長く続くことは／〜です／別の何かの兆候',
        '',
        'but／a long run of them／is／an indication of something else',
      ),
    ],
    [
      b('Separating an ordinary season from a real', 'ありふれた季節を、本当の〜から見分けることは'),
      b('change requires records', '変化から／必要とします／記録を', '', 'change／requires／records'),
      b(
        'that run longer than any single working career',
        'その記録は／より長く続きます／どんな一つのものよりも／職業／人生よりも',
        '',
        'that／run longer／than any single／working／career',
      ),
    ],
    [
      b(
        'Communities that begin keeping such records early can see a crisis approaching',
        '早くから始める地域は／取ることを／そうした記録を、そして危機が近づくのを見て取れます',
        '',
        'Communities that begin／keeping／such records early can see a crisis approaching',
      ),
      b('while it is still relatively cheap', 'まだ比較的安いうちに'),
      b('to answer', '対処することが'),
    ],
    [
      b('Those that begin measuring only', 'それらの地域は／始める／測ることをようやく', '', 'Those that／begin／measuring only'),
      b('after a flood must argue about the past as well as', '洪水のあとになって、そして過去についても争わねばなりません、同じく'),
      b('about the future', '未来についても'),
    ],
    [
      b(
        'The first practical step in any river basin is therefore a plain one',
        'どの流域でも最初の実際的な一歩は／したがって〜です／地味なもの',
        '',
        'The first practical step in any river basin／is therefore／a plain one',
      ),
      b('which is simply', 'それは／ただ〜です', '', 'which／is simply'),
      b('to keep the numbers year after year', '取り続けること／数値を年ごとに', '', 'to keep／the numbers year after year'),
    ],

    // ===== ecosystem : 生きた仕組み =====
    [
      b(
        'A river is not merely a volume of moving water',
        '川は／単に〜ではありません／動く水の量',
        '',
        'A river／is not merely／a volume of moving water',
      ),
      b(
        'because it is also a corridor along',
        'なぜなら／それは／〜でもあり／その道に沿って',
        '',
        'because／it／is also／a corridor along',
      ),
      b('which living things travel', 'それに沿って／生きた／ものが移動するからです', '', 'which／living／things travel'),
    ],
    [
      b(
        'Fish, insects, birds, and seeds all use the same narrow channel',
        '魚も昆虫も鳥も種子もみな／使います／同じ狭い川筋を',
        '',
        'Fish, insects, birds, and seeds all／use／the same narrow channel',
      ),
      b('for purposes', 'さまざまな目的のために'),
      b('that have nothing', 'その目的は／何も持ちません', '', 'that／have nothing'),
      b('to do with each other', '関わることを／互いに', '', 'to do／with each other'),
    ],
    [
      b('A change', 'ある／変化が', '', 'A／change'),
      b(
        'that seems small to an engineer',
        'その変化は／見えます／技術者には小さく',
        '',
        'that／seems／small to an engineer',
      ),
      b('can be devastating to a species', '壊滅的でありうる／ある種にとって', '', 'can be devastating／to a species'),
      b('that depends', 'その種は／依存します', '', 'that／depends'),
      b('on one narrow stage of it', 'その狭い一段階に'),
    ],
    [
      b('Temperature is perhaps the clearest example of a quiet variable', '温度はおそらく、静かな変数の最も明確な例です'),
      b('that produces genuinely dramatic effects', 'その変数が／本当に生み出します／劇的な影響を', '', 'that／produces genuinely／dramatic effects'),
    ],
    [
      b('Many aquatic animals are highly susceptible to thermal change', '多くの水生動物は温度の変化にきわめて弱いのです'),
      b(
        'because they cannot regulate their own body heat',
        'なぜなら／それらは／調節できないからです／自分の体温を',
        '',
        'because／they／cannot regulate／their own body heat',
      ),
    ],
    [
      b('A rise of only two degrees may be adequate', 'わずか二度の上昇が十分でありうるのです'),
      b('to end reproduction for one species', '終わらせるのに／ある種の繁殖を', '', 'to end／reproduction for one species'),
      b('while another becomes more energetic', '一方で別の種はより活発になります'),
    ],
    [
      b(
        'The result is not simply a loss but a new arrangement',
        'その結果は／単なる〜ではありません／喪失ではなく新しい配置です',
        '',
        'The result／is not simply／a loss but a new arrangement',
      ),
      b('whose winners are very hard', 'その勝者はきわめて難しいのです'),
      b('to predict in advance', '予測することが／前もって', '', 'to predict／in advance'),
    ],
    [
      b(
        'The vegetation along a river bank does far more useful work than its modest appearance suggests',
        '川岸に沿った植生は／します／その控えめな見かけが思わせるよりはるかに有用な仕事を',
        '',
        'The vegetation along a river bank／does／far more useful work than its modest appearance suggests',
      ),
    ],
    [
      b('Roots hold the soil', '根が／つなぎとめます／土を', '', 'Roots／hold／the soil'),
      b('in place, shade cools the water', 'その場に、日陰が水を冷やし'),
      b(
        'and fallen leaves feed the insects',
        'そして／落ちた／葉が／昆虫を養います',
        '',
        'and／fallen／leaves／feed the insects',
      ),
      b('that fish depend on', 'その昆虫に／魚が／頼って／います', '', 'that／fish／depend／on'),
    ],
    [
      b('Removing that narrow', 'その狭い〜を取り除くことは'),
      b('strip is cheap and quick', '帯を／〜です／安く速い', '', 'strip／is／cheap and quick'),
      b('while restoring the same function may take several decades', '一方で同じ働きを取り戻すには数十年かかることがあります'),
    ],
    [
      b('This asymmetry between damage and repair is probably the single most important fact', '損傷と修復のあいだのこの非対称は、おそらく唯一最も重要な事実です'),
      b('about all living systems', 'あらゆる生きた仕組みについての'),
    ],
    [
      b('Species that arrive', '他所から到達する種は'),
      b('from elsewhere are described', '別の場所から来て、そう記述されます'),
      b('as harmful only', '有害だと、ようやく'),
      b('after they have already spread widely', 'すでに広く広がったあとになって'),
    ],
    [
      b('Before that point they simply look like an ordinary addition to a long list that nobody has the time to read', 'その時点までは、誰も読む暇のない長い目録への、ごく平凡な追加に見えるだけです'),
    ],
    [
      b(
        'A prevalent new species can push a native population toward the verge of collapse',
        '広く定着した新しい種は／押しやりえます／在来の個体群を崩壊の瀬戸際へ',
        '',
        'A prevalent new species／can push／a native population toward the verge of collapse',
      ),
      b('within a few short seasons', 'わずか数季のうちに'),
    ],
    [
      b('Preventing the arrival', '到達を防ぐことは'),
      b('is far cheaper than any campaign of removal', '〜です／どんな駆除の取り組みよりもはるかに安上がり', '', 'is／far cheaper than any campaign of removal'),
      b('that follows a failure', 'その取り組みは／失敗のあとに続きます', '', 'that／follows a failure'),
      b('to prevent it', '防ぐことの／それを', '', 'to prevent／it'),
    ],
    [
      b(
        'Long chains of cause and effect make the whole system genuinely difficult',
        '長い連なりは／原因の／そして／結果の／します／その仕組み全体を本当に難しく',
        '',
        'Long chains of／cause／and／effect／make／the whole system genuinely difficult',
      ),
      b('to describe with any confidence', '記述することを／少しでも自信をもって', '', 'to describe／with any confidence'),
    ],
    [
      b(
        'A cautious scientist will therefore call an early conclusion tentative',
        '慎重な科学者は／したがって呼びます／初期の結論を暫定的と',
        '',
        'A cautious scientist／will therefore call／an early conclusion tentative',
      ),
      b(
        'and that careful word is not a weakness',
        'そして／その慎重な語は／〜ではありません／弱さ',
        '',
        'and／that careful word／is not／a weakness',
      ),
      b('at all', 'まったく'),
    ],
    [
      b('It records', 'それは／記録しています', '', 'It／records'),
      b(
        'how much of the evidence has already arrived and',
        'どれだけ／証拠のどれだけが／すでに届いたのか／そして',
        '',
        'how／much of the evidence／has already arrived／and',
      ),
      b('how much of it is still', 'どれだけ／そのどれだけがまだ', '', 'how／much of it is still'),
      b('on the way', '途上にあるのかを'),
    ],
    [
      b('Readers', '読者は'),
      b('who treat every careful wording', 'その読者が／扱う／あらゆる慎重な言い回しを', '', 'who／treat／every careful wording'),
      b(
        'as doubt will misread the most responsible work',
        '〜として／疑い、そして／読み違えるでしょう／最も責任ある仕事を',
        '',
        'as／doubt／will misread／the most responsible work',
      ),
      b('in the whole field', 'その分野全体で'),
    ],
    [
      b('The useful question is never', '役に立つ問いは／決して〜ではありません', '', 'The useful question／is never'),
      b(
        'whether the science is fully certain',
        '〜かどうか／その科学が／完全に〜である／確実',
        '',
        'whether／the science／is fully／certain',
      ),
      b('but rather', 'そうではなく／むしろ', '', 'but／rather'),
      b('which parts of it are settled enough', 'そのどの部分が十分に固まっているのか'),
      b('to act on', '行動する／それに基づいて', '', 'to act／on'),
    ],

    // ===== food : 農地・食料・土 =====
    [
      b(
        'Agriculture takes more water out of most river basins than every city and every factory combined',
        '農業は／取り出します／たいていの流域から、すべての都市とすべての工場を合わせたよりも多くの水を',
        '',
        'Agriculture／takes／more water out of most river basins than every city and every factory combined',
      ),
    ],
    [
      b('That single fact decides', 'そのたった一つの事実が決めます'),
      b('how any serious argument about water scarcity in a basin has to begin', 'どのように／流域の水不足をめぐる真剣な議論が始まらねばならないのかを', '', 'how／any serious argument about water scarcity in a basin has to begin'),
    ],
    [
      b('A change', 'ある／変化は', '', 'A／change'),
      b('in the crops', '作物における'),
      b(
        'that farmers plant will move more water than any campaign aimed',
        'その作物を／農民が植えます、そして向けられたどんな取り組みよりも多くの水を動かします',
        '',
        'that farmers plant／will move more water than any campaign aimed',
      ),
      b('at households', '家庭に'),
    ],
    [
      b('Soil is the part of the whole system', '土はこの仕組み全体の中の部分です'),
      b('that is easiest to damage and hardest', 'その部分は／〜です／最も傷つけやすく、最も難しい', '', 'that／is／easiest to damage and hardest'),
      b('to replace', '取り替えることが'),
    ],
    [
      b('It takes several centuries', 'それは／かかります／数世紀も', '', 'It／takes／several centuries'),
      b(
        'to build up a few centimeters of good soil and a single wet season to lose them again',
        '築き上げるのに／数センチのよい土と一度の雨季が／失うのに／それらを再び',
        '',
        'to build／up a few centimeters of good soil and a single wet season／to lose／them again',
      ),
    ],
    [
      b('Bare ground between two harvests is the moment at', '二度の収穫のあいだの裸の地面こそ、その瞬間です'),
      b('which a field is most likely', 'そのときに畑が最も〜しやすいのです'),
      b('to wash away', '流されてしまうことが'),
    ],
    [
      b('Farmers', '農民は'),
      b(
        'who keep a cover crop growing through',
        'その農民が／保ちます／被覆／作物を育て続けます、〜を通して',
        '',
        'who／keep a／cover／crop growing through',
      ),
      b(
        'that gap lose far less of the layer they depend on',
        'その／期間を、そして／失います／頼りにする層をはるかに少なく',
        '',
        'that／gap／lose／far less of the layer they depend on',
      ),
    ],
    [
      b('Fertilizer', '肥料は'),
      b(
        'that a plant does not take up',
        'その肥料を／作物が／吸収しません',
        '',
        'that／a plant／does not take up',
      ),
      b('does not simply vanish', '単に消えてなくなりはしません'),
      b('from the field', 'その畑から'),
      b('where it was spread', 'そこで／それが／まかれた', '', 'where／it／was spread'),
    ],
    [
      b(
        'It travels with the next heavy rain into a ditch, then',
        'それは／移動します／次の激しい雨とともに用水路へ、次に',
        '',
        'It／travels／with the next heavy rain into a ditch, then',
      ),
      b('into a stream', '小川の中へ'),
      b('and finally into water that other people use', 'そして／最後に他の人が／使う水の中へ', '', 'and／finally into water that other people／use'),
    ],
    [
      b(
        'Downstream the very same chemical that raised a yield can feed an enormous growth of water plants and weeds',
        '下流ではまさに同じ化学物質が／上げた／収量を、そして水草や雑草の膨大な繁殖を養いうるのです',
        '',
        'Downstream the very same chemical that／raised／a yield can feed an enormous growth of water plants and weeds',
      ),
    ],
    [
      b('When that growth dies and decays', 'その繁殖が死んで分解するとき'),
      b('it removes the oxygen on', 'それは／奪います／酸素を、それに', '', 'it／removes／the oxygen on'),
      b('which the fish and insects depend', '魚と昆虫が頼っている酸素を'),
    ],
    [
      b(
        'Irrigation raises yields surely and steadily',
        '灌漑は／上げます／収量を確実に、そして／着実に',
        '',
        'Irrigation／raises／yields surely and／steadily',
      ),
      b(
        'and yet it also concentrates salt',
        'そして／それでも／それはまた／集めます／塩を',
        '',
        'and／yet／it also／concentrates／salt',
      ),
      b('in the very ground that it waters', '水をやるまさにその土地に'),
    ],
    [
      b('Every drop of water', 'どの／一滴も／水の', '', 'Every／drop／of water'),
      b('that evaporates leaves', 'その一滴が／蒸発して残します', '', 'that／evaporates leaves'),
      b('behind any minerals', 'あとに何であれ鉱物を'),
      b('that it happened', 'その鉱物を／それが／たまたま', '', 'that／it／happened'),
      b('to be carrying', '運んでいたのです'),
    ],
    [
      b(
        'A field can therefore become steadily less productive',
        '畑は／したがって着実になりうるのです／生産力の低いものに',
        '',
        'A field／can therefore become steadily／less productive',
      ),
      b('while every single season still looks successful', '一方でどの季節もなお成功しているように見えます'),
      b('at harvest', '収穫のときには'),
    ],
    [
      b(
        'Drainage that carries the salt away is expensive',
        '塩を運び去る排水は／〜です／高くつくもの',
        '',
        'Drainage that carries the salt away／is／expensive',
      ),
      b(
        'and it moves the problem to someone further down the valley',
        'そして／それは／移します／その問題を谷のより下の誰かへ',
        '',
        'and／it／moves／the problem to someone further down the valley',
      ),
    ],
    [
      b('Trade hides much of this', '貿易は／隠します／この多くを', '', 'Trade／hides／much of this'),
      b(
        'because a country that imports grain is also importing water that it never sees',
        'なぜなら／穀物を輸入する国は、決して目にしない水も輸入しているからです',
        '',
        'because／a country that imports grain is also importing water that it never sees',
      ),
    ],
    [
      b(
        'A dry region can eat well for many decades',
        '乾いた地域は／食べていけます／何十年もよく',
        '',
        'A dry region／can eat／well for many decades',
      ),
      b('by buying', '買うことによって'),
      b('what its own rainfall could never support', '自らの降水では決して支えられないものを'),
    ],
    [
      b(
        'That arrangement is neither dishonest nor unstable',
        'その仕組みは／〜です／不誠実でも不安定でもない',
        '',
        'That arrangement／is／neither dishonest nor unstable',
      ),
      b('but it does depend', 'しかし／それは／確かに依存しています', '', 'but／it／does depend'),
      b('on a market', 'ある市場に'),
      b('that stays open', 'その市場が／保ち続ける／開かれた状態を', '', 'that／stays／open'),
    ],
    [
      b(
        'A single export restriction can turn an ordinary shortage',
        '一度の輸出制限が／変えうるのです／ありふれた不足を',
        '',
        'A single export restriction／can turn／an ordinary shortage',
      ),
      b('into a full crisis several borders away', '国境をいくつも越えた先での本格的な危機へと'),
    ],
    [
      b('Reading a food price therefore', 'したがって食料価格を読むことは'),
      b(
        'means reading rainfall, soil, policy, and shipping costs all',
        '意味します／降水と土と政策と輸送費をすべて読むことを',
        '',
        'means／reading rainfall, soil, policy, and shipping costs all',
      ),
      b('at the same time', '同時に'),
    ],

    // ===== health : 水と公衆衛生 =====
    [
      b('The clearest link between a river and a human body is an infection carried', '川と人体を結ぶ最も明確な経路は、運ばれる感染です'),
      b('by water', '水によって'),
    ],
    [
      b(
        'A pathogen that survives a short journey downstream can reach thousands of households',
        '病原体は／生き延びる／下流への短い旅を、そして何千もの家庭に届きうるのです',
        '',
        'A pathogen that／survives／a short journey downstream can reach thousands of households',
      ),
      b('within a single day', 'たった一日のうちに'),
    ],
    [
      b('Separating drinking water from', '飲み水を〜から切り離すことは'),
      b('waste water is therefore the oldest and cheapest public health measure', '排水から、それはしたがって最も古く最も安い公衆衛生の対策です'),
      b('that is known', 'その対策は／〜です／知られているもの', '', 'that／is／known'),
    ],
    [
      b(
        'Every later advance in medicine rests on that basic separation rather than replacing it',
        'その後の医学のあらゆる進歩は／立っています／それに取って代わるのではなく、その基本的な分離の上に',
        '',
        'Every later advance in medicine／rests／on that basic separation rather than replacing it',
      ),
      b('in any way', 'どのような形でも'),
    ],
    [
      b(
        'Incidence tells a community',
        '発生率は／伝えます／地域に',
        '',
        'Incidence／tells／a community',
      ),
      b('how many new cases of an illness appeared', 'どれだけ／ある病気の新しい患者が何人現れたのかを', '', 'how／many new cases of an illness appeared'),
      b('inside a clearly stated period of time', '明確に述べられた期間の中で'),
    ],
    [
      b(
        'A number with no such period attached to it can be read',
        '数字は／添えられていない／それにそうした期間が／こう読まれうるのです',
        '',
        'A number with no such period／attached／to it／can be read',
      ),
      b('to mean almost anything at all', '意味すると／ほとんど何とでも', '', 'to mean／almost anything at all'),
    ],
    [
      b('Reports', '報告は'),
      b('that compare two regions', 'その報告が／二つの地域を比べます', '', 'that／compare two regions'),
      b('must also state', 'また〜しなければなりません／述べることを', '', 'must also／state'),
      b('how hard each of them actually looked', 'どれほど／それぞれが実際どれだけ熱心に探したのかを', '', 'how／hard each of them actually looked'),
      b('for cases', '患者を'),
    ],
    [
      b(
        'A place that tests its own people carefully will always appear less healthy than a place that tests rarely',
        '自分の住民を丁寧に検査する場所は／常に見えるでしょう／めったに検査しない場所より不健康に',
        '',
        'A place that tests its own people carefully／will always appear／less healthy than a place that tests rarely',
      ),
    ],
    [
      b(
        'Nutrition connects the same river to the same human body along a much slower and much quieter path',
        '栄養は／結び付けます／同じ川と同じ人体を、はるかに遅くはるかに静かな経路で',
        '',
        'Nutrition／connects／the same river to the same human body along a much slower and much quieter path',
      ),
    ],
    [
      b('Malnutrition weakens the immune response', '栄養不良は／弱めます／免疫の反応を', '', 'Malnutrition／weakens／the immune response'),
      b(
        'so that an otherwise mild infection can become a serious one',
        'その結果／そうでなければ軽い感染が／なりうるのです／重いものに',
        '',
        'so／that an otherwise mild infection／can become／a serious one',
      ),
    ],
    [
      b(
        'Protein and clean water are therefore treated together',
        'たんぱく質と清潔な水は／したがって扱われます／一緒に',
        '',
        'Protein and clean water／are therefore treated／together',
      ),
      b('in any program', 'どの計画においても'),
      b('that seriously expects', 'その計画が／真剣に／期待する', '', 'that／seriously／expects'),
      b('to see results', '見ることを／成果を', '', 'to see／results'),
    ],
    [
      b('Treating either of them alone', 'どちらか一方だけを扱うことは'),
      b('produces figures', '生みます／数字を', '', 'produces／figures'),
      b('that look encouraging', 'その数字は／見えます／励みになるように', '', 'that／look／encouraging'),
      b('on paper and change very little', '紙の上では、そしてほとんど何も変えません'),
    ],
    [
      b(
        'A flood does a kind of damage',
        '洪水は／もたらします／ある種の害を',
        '',
        'A flood／does／a kind of damage',
      ),
      b(
        'that no clinic can ever record',
        'その害を／どの診療所も／〜できません／決して記録することが',
        '',
        'that／no clinic／can／ever record',
      ),
      b('on an ordinary chart of injuries', '普通の外傷の記録票に'),
    ],
    [
      b(
        'Families that have lost a house carry a strain that lasts long',
        '家族は／持ちます／家を失い、長く続く負担を抱えます',
        '',
        'Families that／have／lost a house carry a strain that lasts long',
      ),
      b('after the water itself has disappeared', '水そのものが消えたあとも'),
    ],
    [
      b(
        'Grief, fear of the next season, and the loss of ordinary routine can all be measured',
        '悲しみ、次の季節への恐れ、日常の喪失は／〜できます／みな測られることが',
        '',
        'Grief, fear of the next season, and the loss of ordinary routine／can／all be measured',
      ),
      b('if anyone chooses', 'もし／誰かが／選ぶなら', '', 'if／anyone／chooses'),
      b('to measure them', '測ることを／それらを', '', 'to measure／them'),
    ],
    [
      b('Programs that ignore this part of the harm will consistently underestimate', 'この部分の害を無視する計画は、決まって過小に見積もります'),
      b('what a full recovery is going to cost', '完全な回復にどれだけ費用がかかるのかを'),
    ],
    [
      b('Distance quietly decides', '距離が静かに決めます'),
      b(
        'how much of any of this treatment a household is actually able',
        'どれだけ／こうした手当てのどれだけを家庭が／実際に〜である／できる状態に',
        '',
        'how／much of any of this treatment a household／is actually／able',
      ),
      b('to obtain', '得ることが'),
    ],
    [
      b(
        'A clinic two hours away is used only for emergencies and almost never',
        '二時間かかる診療所は／使われるだけです／緊急時にのみ、そしてほとんど決して〜ない',
        '',
        'A clinic two hours away／is used only／for emergencies and almost never',
      ),
      b('for the small problems', '小さな不調のためには'),
      b('that precede them', 'その不調が／先立ちます／緊急事態に', '', 'that／precede／them'),
    ],
    [
      b('Telemedicine narrows part of that gap', '遠隔医療はその隔たりの一部を狭めます'),
      b(
        'although it can neither set a fracture nor deliver a vaccine',
        'ただし／それは／〜できません／骨折を整復することもワクチンを届けることも',
        '',
        'although／it／can／neither set a fracture nor deliver a vaccine',
      ),
    ],
    [
      b(
        'The remaining distance has to be closed by better roads',
        'その／残された／距離は、よりよい道路によって埋められねばなりません',
        '',
        'The／remaining／distance has to be closed by better roads',
      ),
      b('by more staff', 'より多くの人員によって'),
      b('or by moving the service itself closer', 'あるいは／動かすことによって／提供の場そのものをより近くへ', '', 'or／by moving／the service itself closer'),
    ],

    // ===== infrastructure : 管・道路・建物 =====
    [
      b(
        'Most of the equipment that delivers water to a house is buried underground and therefore easy',
        '家へ水を届ける設備の大半は／埋められています／地下に、それゆえ容易です',
        '',
        'Most of the equipment that delivers water to a house／is buried／underground and therefore easy',
      ),
      b('to forget', '忘れることが'),
    ],
    [
      b(
        'A pipe installed a century ago may still work perfectly',
        '管が／据えられた／一世紀前に、それはなお完璧に働きうるのです／完璧に',
        '',
        'A pipe／installed／a century ago may still work／perfectly',
      ),
      b('while the one beside it is close to failure', '一方でその隣の管は破損に近いのです'),
    ],
    [
      b(
        'Nobody can separate the two from the surface alone',
        '誰も／分けられません／地表からだけではその二つを',
        '',
        'Nobody／can separate／the two from the surface alone',
      ),
      b('without instruments and a careful survey of the network', '器具と管網の丁寧な調査なしには'),
    ],
    [
      b(
        'Maintenance therefore competes for money',
        '維持管理は／したがって競います／予算を求めて',
        '',
        'Maintenance therefore／competes／for money',
      ),
      b('against new projects', '新しい事業と'),
      b(
        'that the public can actually see and even admire',
        'その事業を／人々が／実際に見ることができ／さらには称賛さえできます',
        '',
        'that／the public／can actually see／and even admire',
      ),
    ],
    [
      b(
        'A network full of small leaks loses a fixed share of everything',
        '管網は、小さな／漏れでいっぱいで／あらゆるものの一定の割合を失います',
        '',
        'A network full of small／leaks／loses a fixed share of everything',
      ),
      b('that is ever pumped', 'そのあらゆるものとは／〜されるものです／これまでに／送り込まれた', '', 'that／is／ever／pumped'),
      b('into its pipes', 'その管の中へ'),
    ],
    [
      b('In some cities that share reaches a third of the total', '都市によっては、その割合が総量の三分の一に達します'),
      b(
        'which is more than any conservation campaign',
        'それは／〜です／どんな節水の取り組みよりも多い量',
        '',
        'which／is／more than any conservation campaign',
      ),
      b('could save', '節約できるであろう量よりも'),
    ],
    [
      b('Finding those leaks is quiet and patient work', 'その漏れを見つけるのは、静かで根気のいる仕事です'),
      b(
        'that produces no photograph worth printing',
        'その仕事は／生みません／印刷する価値のある写真を一枚も',
        '',
        'that／produces no／photograph worth printing',
      ),
      b('in a newspaper', '新聞に'),
    ],
    [
      b('It is also the cheapest new supply', 'それは／〜でもあります／最も安い新しい供給源', '', 'It／is also／the cheapest new supply'),
      b(
        'that is available to almost every older city',
        'その供給源は／〜です／ほとんどすべての古い都市に利用できるもの',
        '',
        'that／is／available to almost every older city',
      ),
      b('in the world', '世界中の'),
    ],
    [
      b(
        'Roads change a basin quite as much as any dam',
        '道路は／変えます／どのダムにも劣らず流域を',
        '',
        'Roads／change／a basin quite as much as any dam',
      ),
      b('although they are rarely counted', 'ただし／道路はめったに数えられません', '', 'although／they are rarely counted'),
      b('as water projects', '〜として／水の事業', '', 'as／water projects'),
      b('at all', 'まったく'),
    ],
    [
      b(
        'A hard paved surface sends rain straight to the nearest drain instead of letting it soak',
        '硬い／舗装された／面は、しみ込ませる代わりに雨をまっすぐ最寄りの排水口へ送ります',
        '',
        'A hard／paved／surface sends rain straight to the nearest drain instead of letting it soak',
      ),
      b('into the ground', '地面の中へ'),
    ],
    [
      b(
        'The same storm therefore produces a higher and much faster peak in a city than',
        'したがって同じ嵐が／生みます／都市ではより高くはるかに速い頂点を、〜よりも',
        '',
        'The same storm therefore／produces／a higher and much faster peak in a city than',
      ),
      b('in an open field', '開けた畑でよりも'),
    ],
    [
      b('Engineers can slow that peak', '技術者は／〜できます／その頂点を低くすることが', '', 'Engineers／can／slow that peak'),
      b('with holding pools, gardens', '調整池や緑地で'),
      b('and open surfaces that cost far less than a concrete wall', 'そして／コンクリートの壁よりはるかに安い透水性の面で', '', 'and／open surfaces that cost far less than a concrete wall'),
    ],
    [
      b('Buildings then decide', '建物がそのうえで決めます'),
      b('who is exposed', '誰が／さらされるのかを', '', 'who／is exposed'),
      b('on the day', 'その日に'),
      b('when the peak of a flood arrives', '洪水の頂点が到達するとき'),
      b('in any case', 'いずれにせよ'),
    ],
    [
      b(
        'A ground floor that is used for storage recovers from a flood far more easily than one used',
        '一階は／使われる／倉庫として、そして使われる一階よりはるかに容易に洪水から立ち直ります',
        '',
        'A ground floor that／is used／for storage recovers from a flood far more easily than one used',
      ),
      b('for sleeping', '寝室として'),
    ],
    [
      b(
        'Rules that require the second of these uses to sit higher are cheap',
        '規則は／求めます／この二つ目の用途を高い階に置くよう／〜です／安上がり',
        '',
        'Rules that require the second of these／uses／to sit higher／are／cheap',
      ),
      b('while a district is still being built', 'その地区がまだ建設中のあいだは'),
    ],
    [
      b(
        'The very same rules become extremely expensive',
        'まさに同じ規則が／きわめてなります／高くつくものに',
        '',
        'The very same rules／become extremely／expensive',
      ),
      b(
        'once that district has been finished and fully occupied',
        'いったん／その地区が／完成し／そして人で満たされたなら',
        '',
        'once／that district／has been finished／and fully occupied',
      ),
    ],
    [
      b(
        'Every single one of these choices quietly moves some cost',
        'こうした選択のどれもが静かに／移します／いくらかの費用を',
        '',
        'Every single one of these choices quietly／moves／some cost',
      ),
      b('between the present and the future', '現在と未来のあいだで'),
    ],
    [
      b('Deferring maintenance', '維持を先送りすることは'),
      b('is not really saving money', '本当に節約していることには／なりません', '', 'is not really saving／money'),
      b('because it is borrowing', 'なぜなら／それは／前借りしているからです', '', 'because／it／is borrowing'),
      b('against a repair', 'ある修理を担保に'),
      b('that only grows larger', 'その修理は／ただ／なるばかりです／より大きく', '', 'that／only／grows／larger'),
    ],
    [
      b('The interest on that loan is paid', 'その借金の利子は支払われます'),
      b('by the family that happens', 'たまたま〜する家族によって'),
      b('to be living there', '住んでいる／そこに', '', 'to be living／there'),
      b('when the pipe finally breaks', '管がついに壊れたときに'),
    ],
    [
      b('A budget that states all of this openly is far easier', 'これをすべて率直に述べる予算は、はるかに容易です'),
      b(
        'to defend than one that simply postpones the question',
        '擁護することが／予算よりも／ただ／先送りする／その問いを',
        '',
        'to defend／than one that／simply／postpones／the question',
      ),
    ],

    // ===== energy : エネルギーと機械 =====
    [
      b(
        'Water and energy are so closely linked together',
        '水とエネルギーは／〜です／たがいにあまりに密接に結ばれている',
        '',
        'Water and energy／are／so closely linked together',
      ),
      b('that neither of them can be planned', 'そのため／どちらも／計画できません', '', 'that／neither of them／can be planned'),
      b('on its own', 'それ単独では'),
    ],
    [
      b('Moving water up to a higher place', '水を高い所へ動かすことは'),
      b('takes electricity', '必要とします／電力を', '', 'takes／electricity'),
      b(
        'and generating that electricity usually takes a great deal of water',
        'そして／作り出すこと／その電力を作るには、たいてい大量の水が要ります',
        '',
        'and／generating／that electricity usually takes a great deal of water',
      ),
    ],
    [
      b(
        'A drought therefore reduces power output',
        '干ばつは／したがって減らします／発電量を',
        '',
        'A drought therefore／reduces／power output',
      ),
      b('at exactly the moment', 'まさにその瞬間に'),
      b('when the demand', 'そのときに需要が'),
      b('for pumping water rises', '水を汲み上げるための需要が高まります'),
    ],
    [
      b('Planning either of these two systems without the other guarantees a shortage that nobody in', 'この二つの仕組みの一方を他方なしに計画することは、誰も〜ない不足を確実に招きます'),
      b('charge predicted', '責任ある立場の者が／予測しなかった', '', 'charge／predicted'),
    ],
    [
      b('A dam is the most visible machine', 'ダムは／〜です／最も目立つ機械', '', 'A dam／is／the most visible machine'),
      b('in any basin and also the hardest one', 'どの流域でも、そして最も難しいものでもあります'),
      b('to evaluate honestly', '誠実に評価することが'),
    ],
    [
      b(
        'It stores water, produces power, controls floods',
        'それは水を蓄え／生み出し／電力を、洪水を抑えます',
        '',
        'It stores water,／produces／power, controls floods',
      ),
      b('and blocks the movement of fish all', 'そして／妨げます／魚の移動をすべて', '', 'and／blocks／the movement of fish all'),
      b('at the same time', '同時に'),
    ],
    [
      b(
        'Each of those four effects is entirely real',
        'その四つの影響のどれもが／まったく〜です／本物',
        '',
        'Each of those four effects／is entirely／real',
      ),
      b(
        'and no single number can combine them',
        'そして／どんな一つの数字も／まとめられません／それらを',
        '',
        'and／no single number／can combine／them',
      ),
      b('into one verdict', '一つの判定へ'),
    ],
    [
      b(
        'Arguments about dams usually turn out',
        'ダムをめぐる議論はたいてい／こう分かります',
        '',
        'Arguments about dams usually／turn out',
      ),
      b('to be arguments about', '〜であると／〜についての議論', '', 'to be／arguments about'),
      b(
        'which of those effects gets counted first',
        'どれが／その影響のうちどれが／〜される／数えられる／最初に',
        '',
        'which／of those effects／gets／counted／first',
      ),
    ],
    [
      b(
        'Smaller machines now do a growing share of the work',
        'より小さな機械がいまや／担っています／その仕事の増えつつある割合を',
        '',
        'Smaller machines now／do／a growing share of the work',
      ),
      b('that used to require a large structure', 'その仕事は／かつては／大きな構造物を必要としていました', '', 'that／used／to require a large structure'),
    ],
    [
      b('A valve that opens', '開く弁は'),
      b('on a fixed schedule can hold back a flood peak that would otherwise pass downstream', '定められた時刻に、そのままなら下流へ抜けていく出水の頂点をせき止められます'),
    ],
    [
      b('A pump', 'ある／揚水機は', '', 'A／pump'),
      b('that is controlled', 'その揚水機が／制御されます', '', 'that／is controlled'),
      b('by a sensor uses far less electricity than one', 'センサーによって、そして〜よりはるかに少ない電力を使います'),
      b('that simply runs all day', 'その揚水機は／ただ／動きます／一日中', '', 'that／simply／runs／all day'),
    ],
    [
      b('These gains are quiet ones', 'こうした改善は地味なものです'),
      b(
        'and added together they often exceed',
        'そして／合わせられて／それらはしばしば／上回ります',
        '',
        'and／added／together they often／exceed',
      ),
      b('what an entire new power plant could supply', '新しい発電所ひとつが供給しうる量を'),
    ],
    [
      b('Control has now moved', '制御は／いまや移りました', '', 'Control／has now moved'),
      b('from valves and levers to software', '弁やてこから算法へと'),
      b('that runs', 'その算法は／動きます', '', 'that／runs'),
      b('on servers far away', '遠く離れたサーバーの上で'),
    ],
    [
      b(
        'That shift makes a system quick',
        'その移行は／します／仕組みを素早く',
        '',
        'That shift／makes／a system quick',
      ),
      b('to respond', '応答することに'),
      b(
        'and at the very same time it makes the whole system a target',
        'そして／まさに同じときにそれは／します／仕組み全体を標的に',
        '',
        'and／at the very same time it／makes／the whole system a target',
      ),
    ],
    [
      b(
        'A failure in connectivity can now stop a pump',
        '通信の障害が／いまや止めうるのです／ある揚水機を',
        '',
        'A failure in connectivity／can now stop／a pump',
      ),
      b(
        'that has nothing at all mechanically wrong',
        'その揚水機は／何も持ちません／機械的に悪いところを',
        '',
        'that／has nothing／at all mechanically wrong',
      ),
      b('with it', 'それ自体に'),
    ],
    [
      b(
        'Cybersecurity therefore belongs inside a water plan rather than only',
        'サイバー安全保障は／したがって属します／水の計画の中に、ただ〜だけではなく',
        '',
        'Cybersecurity therefore／belongs／inside a water plan rather than only',
      ),
      b('inside some separate technology plan', '別の技術の計画の中にだけ'),
    ],
    [
      b(
        'Old equipment usually becomes obsolete long',
        '古い設備はたいてい／なります／時代遅れにずっと前に',
        '',
        'Old equipment usually／becomes／obsolete long',
      ),
      b('before it actually stops working out', 'それが実際に働かなくなるよりも前に'),
      b('in the field', '現場で'),
    ],
    [
      b('Parts stop being made, the engineers', '部品が／作られなくなり／技術者たちは', '', 'Parts stop／being made,／the engineers'),
      b('who understand it retire', 'その技術者は／それを理解していて引退します', '', 'who／understand it retire'),
      b('and the records', 'そして／その／記録は', '', 'and／the／records'),
      b(
        'that explain it go missing',
        'その記録は／それを説明していて／なります／行方不明に',
        '',
        'that／explain it／go／missing',
      ),
    ],
    [
      b('A prototype that nobody ever fully described', '誰も完全には記述しなかった試作機は'),
      b('on paper is a risk disguised as a valuable asset', '紙の上で、貴重な資産の姿をした危険です'),
    ],
    [
      b('Writing down how a machine actually', '機械が実際にどう〜するのかを書き留めることは'),
      b('works is therefore an ordinary and necessary part of keeping the machine running', '働くのかを、したがってその機械を動かし続けることの当たり前で必要な一部です'),
    ],

    // ===== measurement : 測定と不確実性 =====
    [
      b('Every claim about a river finally rests', '川についてのあらゆる主張は、最終的に立っています'),
      b('on a measurement', 'ある測定の上に'),
      b('that someone', 'その測定を／誰かが', '', 'that／someone'),
      b('once chose', 'かつて／選びました', '', 'once／chose'),
      b('to make', '行うことを'),
    ],
    [
      b('Where the gauge sits', 'どこに／観測器が置かれているか', '', 'Where／the gauge sits'),
      b('how often it is read', 'どれほど／頻繁にそれが読み取られるか', '', 'how／often it is read'),
      b('and what it ignores all help to shape the result', 'そして／それが何を無視するかが、すべて結果を形づくる助けとなります', '', 'and／what it ignores all help to shape the result'),
    ],
    [
      b(
        'A number is therefore a summary of a human decision quite as much as a summary of the world',
        '数字は／したがって〜です／世界の要約であるのとまったく同じくらい人間の決定の要約',
        '',
        'A number／is therefore／a summary of a human decision quite as much as a summary of the world',
      ),
    ],
    [
      b('An average conceals the distribution', '平均は／覆い隠します／分布を', '', 'An average／conceals／the distribution'),
      b('that produced it', 'その分布が／それを生みました', '', 'that／produced it'),
      b(
        'and that distribution is usually what really matters',
        'そして／その分布こそが／たいてい〜です／本当に重要なもの',
        '',
        'and／that distribution／is usually／what really matters',
      ),
    ],
    [
      b('A basin with adequate rainfall on average can still fail', '平均では十分な降水がある流域も、なお立ち行かなくなりえます'),
      b('in the three years', 'その三年のあいだに'),
      b('that happen', 'その三年が／たまたま', '', 'that／happen'),
      b('to fall below the minimum', '下回るのです／最低量を', '', 'to fall／below the minimum'),
    ],
    [
      b('Planning for the', '〜に備えて計画することは'),
      b(
        'mean therefore prepares a community',
        '平均に、したがって／備えさせます／地域に',
        '',
        'mean therefore／prepares／a community',
      ),
      b('for a year', 'ある一年に'),
      b(
        'that it will only rarely experience',
        'その年を／地域はめったに／経験しません',
        '',
        'that it／will only rarely／experience',
      ),
    ],
    [
      b('Planning for the most severe year on', '記録上最も厳しい年に備えることは'),
      b(
        'record is expensive',
        '記録の上での年に／〜です／高くつくもの',
        '',
        'record／is／expensive',
      ),
      b('and it is the only figure', 'そして／それが唯一の数字です', '', 'and／it is the only figure'),
      b('that a household actually feels', 'その数字を／家庭が実際に／感じます', '', 'that／a household actually／feels'),
    ],
    [
      b(
        'A baseline is the quiet assumption sitting',
        '基準線は／〜です／内側に座っている静かな前提',
        '',
        'A baseline／is／the quiet assumption sitting',
      ),
      b('inside almost every comparison', 'ほとんどすべての比較の内側に'),
      b(
        'that ever gets published anywhere',
        'その比較が／これまで／〜される／どこかで公表される',
        '',
        'that／ever／gets／published anywhere',
      ),
    ],
    [
      b('Choosing a wet decade', '雨の多い十年を選ぶことは'),
      b(
        'as the starting point makes almost any later period look like a decline',
        '〜として／その／出発／点、それが／させます／その後のほとんどどの期間も減少に見えるように',
        '',
        'as／the／starting／point／makes／almost any later period look like a decline',
      ),
    ],
    [
      b('Choosing a dry decade instead', '代わりに乾いた十年を選ぶことは'),
      b(
        'makes exactly the same later period look like a welcome recovery',
        'まさに〜させます／その後の同じ期間を歓迎すべき回復に見えるように',
        '',
        'makes exactly／the same later period look like a welcome recovery',
      ),
    ],
    [
      b('Honest reports state the baseline first', '誠実な／報告は／まず基準線を述べます', '', 'Honest／reports／state the baseline first'),
      b(
        'because a reader cannot check any of the claims',
        'なぜなら／読者は／検証できないからです／どの主張も',
        '',
        'because／a reader／cannot check／any of the claims',
      ),
      b('without it', 'それなしには'),
    ],
    [
      b('Correlation appears', '相関は現れます'),
      b('in almost any pair of series', 'ほとんどどんな二つの系列の組にも'),
      b('that both happen', 'その二つが／どちらも／たまたま', '', 'that／both／happen'),
      b('to rise over the same decades', '上昇する／同じ数十年にわたって', '', 'to rise／over the same decades'),
    ],
    [
      b(
        'Causation requires a mechanism, a clear sequence',
        '因果は／必要とします／仕組みと、明確な順序を',
        '',
        'Causation／requires／a mechanism, a clear sequence',
      ),
      b('in time', '時間における'),
      b('and a case that fails', 'そして／成り立たなくなる事例を', '', 'and／a case that fails'),
      b('when the mechanism is absent', 'その仕組みがないときに'),
    ],
    [
      b('Reports', '報告は'),
      b(
        'that supply only the first of these',
        'その報告は／示すだけです／このうち最初のものだけを',
        '',
        'that／supply only／the first of these',
      ),
      b('are describing an accident of the record', '記述しています／記録の偶然を', '', 'are describing／an accident of the record'),
      b('with great confidence', '大いに自信をもって'),
    ],
    [
      b('Asking what', '何が〜かを問うことは'),
      b('would have to be observed', '〜ねばならない／観測されねば', '', 'would have／to be observed'),
      b('for such a claim', 'そのような主張が'),
      b('to fail is the fastest test available', '成り立たなくなるために／〜です／利用できる最も速い検証', '', 'to fail／is／the fastest test available'),
    ],
    [
      b(
        'Different academic disciplines measure the very same basin and only rarely produce the same picture of it',
        '異なる学問分野が／測ります／まさに同じ流域を、そしてめったに同じ像を結びません',
        '',
        'Different academic disciplines／measure／the very same basin and only rarely produce the same picture of it',
      ),
    ],
    [
      b('A water scientist', '水の科学者と'),
      b('a specialist in ecology', '生態学の専門家と'),
      b(
        'and an economist will each treat a different quantity as the important one',
        'そして／経済学者は／〜でしょう／それぞれ別の量を重要なものとして扱う',
        '',
        'and／an economist／will／each treat a different quantity as the important one',
      ),
    ],
    [
      b('None of them is simply wrong', 'どの人も／単に〜ではありません／間違っている', '', 'None of them／is simply／wrong'),
      b(
        'and none of their separate pictures is complete',
        'そして／彼らの／別々の／像はどれも／完全ではありません',
        '',
        'and／none of their／separate／pictures／is complete',
      ),
      b('on its own', 'それ単独では'),
    ],
    [
      b(
        'Work across several disciplines is slow precisely',
        'いくつもの分野にまたがる仕事は／〜です／まさに遅いもの',
        '',
        'Work across several disciplines／is／slow precisely',
      ),
      b(
        'because the separate vocabularies have to be reconciled first',
        'なぜなら／別々の用語が／〜ねばならないからです／まずすり合わせられ／最初に',
        '',
        'because／the separate vocabularies／have／to be reconciled／first',
      ),
    ],
    [
      b(
        'A basin that funds that slow work early avoids having to argue about basic definitions',
        'その遅い仕事に早くから資金を出す流域は／避けます／基本的な定義について争わねばならないことを',
        '',
        'A basin that funds that slow work early／avoids／having to argue about basic definitions',
      ),
      b('during an emergency', '非常時に'),
    ],

    // ===== cooperation : 下流まで共有する資源 =====
    [
      b('A river gives a community', '川は／与えます／ある地域に', '', 'A river／gives／a community'),
      b('near its source an advantage', 'その源に近い地域に、一つの有利さを'),
      b(
        'that no argument can ever fully remove',
        'その有利さを／どんな議論も／〜できません／決して完全に取り除くことが',
        '',
        'that／no argument／can／ever fully remove',
      ),
    ],
    [
      b('Anything that', '何であれ'),
      b('happens above arrives below', '上で起こることは／下に届きます', '', 'happens／above arrives below'),
      b('in time', 'やがて'),
      b(
        'and nothing that happens below ever travels back up again',
        'そして／何も／起こることは／下では、決して／戻りません／再び上流へは',
        '',
        'and／nothing that／happens／below ever／travels／back up again',
      ),
    ],
    [
      b('Every treaty about a shared river is an attempt', '共有された川についてのあらゆる条約は、一つの試みです'),
      b('to answer that one basic asymmetry somehow', '答えようとする／その一つの根本的な非対称に何とかして', '', 'to answer／that one basic asymmetry somehow'),
    ],
    [
      b(
        'Agreements that ignore this asymmetry collapse',
        '合意は／無視する／この非対称を、そして崩れます',
        '',
        'Agreements that／ignore／this asymmetry collapse',
      ),
      b('as soon', 'すぐに'),
      b('as the first genuinely dry year finally arrives', '〜すると／最初の本当に乾いた年がついに／到達すると', '', 'as／the first genuinely dry year finally／arrives'),
    ],
    [
      b(
        'A workable agreement gives the side',
        '機能する合意は／与えます／その側に',
        '',
        'A workable agreement／gives／the side',
      ),
      b('near the source something valuable', '源に近い側に、何か価値のあるものを'),
      b('that it cannot obtain', 'そのものを／その側は／得られません', '', 'that／it／cannot obtain'),
      b('on its own', '自力では'),
    ],
    [
      b(
        'Electricity, access to markets, flood warnings, and shared observations have all served that purpose rather well',
        '電力、市場への参入、洪水の警報、そして／共有された／観測値が、みなその役目をむしろ／よく果たしてきました',
        '',
        'Electricity, access to markets, flood warnings, and／shared／observations have all served that purpose rather／well',
      ),
    ],
    [
      b('An agreement that only asks the other side', '相手の側にただ求めるだけの合意は'),
      b('for restraint is a request rather than a bargain', '自制を、それは取引というよりお願いです'),
    ],
    [
      b('Requests hold only', 'お願いは／保たれるだけです', '', 'Requests／hold only'),
      b('while relations are warm and fail', '関係が温かいあいだは、そして破れます'),
      b('at exactly the moment', 'まさにその瞬間に'),
      b('when they are most needed', '最も必要とされるときに'),
    ],
    [
      b('Sovereignty makes enforcement difficult even', '主権は履行を難しくします、〜の場合でさえ'),
      b('in cases', 'そうした場合に'),
      b('where the text of a treaty is perfectly clear', 'そこでは／条約の文言が完全に明確です', '', 'where／the text of a treaty is perfectly clear'),
    ],
    [
      b(
        'What holds an agreement together is usually the cost of leaving it rather than any penalty stated',
        '何が／つなぎとめるのか／合意を、それはたいてい、述べられたどんな罰則でもなくそこから抜ける費用です',
        '',
        'What／holds／an agreement together is usually the cost of leaving it rather than any penalty stated',
      ),
      b('inside it', 'その中に'),
    ],
    [
      b('Joint monitoring is valuable mainly', '共同の観測が価値を持つのは主として'),
      b(
        'because it makes any disagreement',
        'なぜなら／それが／します／どんな不一致も',
        '',
        'because／it／makes／any disagreement',
      ),
      b('about the basic facts expensive and slow', '基本的な事実についての不一致を高くつき遅いものに'),
    ],
    [
      b(
        'Two governments that share a single gauge will argue about policy instead of arguing',
        '一つの観測器を共有する二つの政府は／議論するでしょう／政策について、争う代わりに',
        '',
        'Two governments that share a single gauge／will argue／about policy instead of arguing',
      ),
      b('about the numbers', '数字について'),
    ],
    [
      b(
        'Indigenous communities frequently hold the longest continuous record of',
        '先住の共同体は／しばしば／保っています／最も長く続く記録を、〜の',
        '',
        'Indigenous communities／frequently／hold／the longest continuous record of',
      ),
      b('how a particular basin actually behaves', 'どのように／ある流域が実際にふるまうのか', '', 'how／a particular basin actually behaves'),
    ],
    [
      b(
        'That record is stored in daily practice and in language rather than',
        'その記録は／蓄えられています／日々の実践と言語の中に、そうではなく',
        '',
        'That record／is stored／in daily practice and in language rather than',
      ),
      b('in any published series of numbers', '公表されたどんな数値の系列の中にでもありません'),
    ],
    [
      b('Treating it', 'それを扱うことは'),
      b('as folklore rather than', '〜として／民話としてであって、そうではなく', '', 'as／folklore rather than'),
      b(
        'as real evidence discards information',
        '〜として／本当の証拠として、そして／捨てます／情報を',
        '',
        'as／real evidence／discards／information',
      ),
      b('that cannot be recovered later', 'その情報は／取り戻せません／のちに', '', 'that／cannot be recovered／later'),
    ],
    [
      b('Consultation that begins', '協議は／始まります', '', 'Consultation that／begins'),
      b('after a plan is already complete is a formal step only', '計画がすでに完成したあとで、そしてそれは形式上の一段階にすぎません'),
      b(
        'and everyone understands it as one',
        'そして／誰もが／理解しています／それをそのようなものと',
        '',
        'and／everyone／understands／it as one',
      ),
    ],
    [
      b('A basin authority works only', '流域の管理機構が機能するのは、ただ'),
      b('when the people it governs can see', 'それが統治する人々が見られるときだけです'),
      b('what it decides and why', '何を／それが決めるのか、そしてなぜかを', '', 'what／it decides and why'),
    ],
    [
      b('Publishing the data, the model, and the reasoning costs very little and', '観測値と模型と論拠を公表することは費用がごくわずかで、そして'),
      b('buys a great deal of patience', '買います／多くの忍耐を', '', 'buys／a great deal of patience'),
    ],
    [
      b(
        'Communities will accept an unpopular decision far more readily',
        '人々は／受け入れるでしょう／歓迎できない決定をはるかに／もっと進んで',
        '',
        'Communities／will accept／an unpopular decision far／more readily',
      ),
      b('when they can follow the whole argument', 'その論拠全体をたどれるときに'),
      b('behind it', 'その決定の背後にある'),
    ],
    [
      b('A shared river is finally governed by', '共有された川を最終的に治めるのは'),
      b('whether the neighbors', '〜かどうかです／隣人たちが', '', 'whether／the neighbors'),
      b('who live along it', 'その隣人は／その川沿いに暮らしています', '', 'who／live along it'),
      b('can still talk to one another', 'なお話し合える／互いに', '', 'can still talk／to one another'),
    ],
  ]),
  p_ext_4000_generational_city: passage([
    // ===== time : 翌年より先を考える =====
    [
      b('A city is above all a machine for moving costs and benefits', '都市は／〜です／何よりも費用と利益を移す装置', '', 'A city／is／above all a machine for moving costs and benefits'),
      b('across time', '時間を越えて'),
      b(
        'although it is very rarely described',
        'ただし／それが／〜です／ごくまれにしか説明されない',
        '',
        'although／it／is／very rarely described',
      ),
      b('in quite those terms', 'まさにそうした言葉では'),
    ],
    [
      b(
        'A road that is built this year will be repaired, widened',
        '今年造られる道路は／修理され／広げられます',
        '',
        'A road that is built this year／will be repaired,／widened',
      ),
      b('and eventually replaced', 'そして／やがて／造り替えられます', '', 'and／eventually／replaced'),
      b('by people', '人々によって'),
      b('who have not yet', 'その人々は／まだ〜していない／その時点まで', '', 'who／have not／yet'),
      b('been born', '生まれて／いない', '', 'been／born'),
    ],
    [
      b(
        'A pension that is promised this year will be paid out of the future wages of workers',
        '年金は／約束される／今年、そして働き手の将来の賃金から支払われます',
        '',
        'A pension that／is promised／this year will be paid out of the future wages of workers',
      ),
      b('who are still', 'その働き手は／まだ〜です', '', 'who／are still'),
      b('at school today', '今日は学校にいる'),
    ],
    [
      b('Every serious argument about the future of a city is therefore', '都市の将来についてのあらゆる真剣な議論は／したがって〜です', '', 'Every serious argument about the future of a city／is therefore'),
      b('in the end an argument about', '結局のところ〜についての議論'),
      b('who pays', '誰が／払うのか', '', 'who／pays'),
      b('for it and when', 'その費用を、そしていつなのか'),
    ],
    [
      b('Economists usually handle this problem', '経済学者は／ふつう／扱います／この問題を', '', 'Economists／usually／handle／this problem'),
      b('with a discount rate, a single number', '割引率という、一つの数値で'),
      b(
        'that states how much a future benefit is worth today',
        'その数値が／将来の利益がどれほど〜かを述べます／〜である／今日価値がある',
        '',
        'that／states how much a future benefit／is／worth today',
      ),
    ],
    [
      b(
        'A high rate treats the distant future as almost worth nothing',
        '高い率は／扱います／遠い未来をほとんど価値のないものとして',
        '',
        'A high rate／treats／the distant future as almost worth nothing',
      ),
      b('while a low rate treats that same future as very nearly present indeed', '一方で低い率は同じ未来を、実にほぼ現在として扱います'),
    ],
    [
      b(
        'The choice of that single number therefore settles the answer long',
        'その一つの数値の選択が／したがって決めます／答えをずっと前に',
        '',
        'The choice of that single number therefore／settles／the answer long',
      ),
      b('before any piece of evidence has actually been examined', 'どの証拠も実際に調べられる前に'),
    ],
    [
      b('Honest analysis states the rate openly', '誠実な分析はその率を率直に述べます／率直に', '', 'Honest analysis states the rate／openly'),
      b('at the very start and then reports', 'まさに初めに、そしてそのあと報告します'),
      b(
        'how far the conclusion moves',
        'どこまで／結論が動くのかを',
        '',
        'how／far the conclusion moves',
      ),
      b('when that rate is changed', 'その率が変えられたとき'),
    ],
    [
      b('The terms that politicians serve are very much shorter than the objects that politics builds and then maintains', '政治家が務める任期は、政治が造り、そのあと維持する物よりはるかに短いのです'),
    ],
    [
      b('A mayor is elected', '市長は選ばれます'),
      b('for four years', '四年の任期で'),
      b('while the bridge that the same mayor opens is expected', '一方でその同じ市長が開通させる橋は期待されます'),
      b('to stand for a hundred', '立ち続けることを／百年', '', 'to stand／for a hundred'),
    ],
    [
      b('That gap quietly rewards those decisions', 'その／隔たりは静かにそうした決定に報います', '', 'That／gap quietly rewards those decisions'),
      b('whose benefits appear at', 'その／利益が現れる、〜に', '', 'whose／benefits appear at'),
      b('once and', 'すぐに／そして', '', 'once／and'),
      b('whose costs appear only', 'その費用が現れるのはようやく'),
      b('after the next election has passed', '次の選挙が過ぎたあとです'),
    ],
    [
      b(
        'No individual has to behave badly at all',
        '誰一人／〜する必要はありません／悪くふるまうことを／まったく',
        '',
        'No individual／has／to behave badly／at all',
      ),
      b('for that pattern', 'その型が'),
      b('to repeat itself in one city after another for decades', '繰り返すために／それ自身を、次々と都市で何十年も', '', 'to repeat／itself in one city after another for decades'),
    ],
    [
      b(
        'Households face exactly the same problem on a much smaller scale, and they generally solve it rather badly',
        '家庭はまったく同じ問題をはるかに小さな規模で抱え、そして／解いています／それをかなり／下手に',
        '',
        'Households face exactly the same problem on a much smaller scale, and they generally／solve／it rather／badly',
      ),
    ],
    [
      b('People save less than they intend', '人は／貯めます／自分が意図するより少なく', '', 'People／save／less than they intend'),
      b('to save, buy insurance later than they should', '貯めることを、保険を入るべきより遅く買い／そうすべきなのに', '', 'to save, buy insurance later than they／should'),
      b(
        'and repair a thing only',
        'そして／修理します／物を／ようやく',
        '',
        'and／repair／a thing／only',
      ),
      b('after it has already failed', 'それがすでに壊れたあとです'),
    ],
    [
      b(
        'Public bodies repeat all of these habits quite faithfully',
        '公的機関は／繰り返します／こうした習慣をどれもかなり忠実に',
        '',
        'Public bodies／repeat／all of these habits quite faithfully',
      ),
      b('for the simple reason', '単純な理由からです'),
      b(
        'that they are made of the very same people',
        'すなわち／それが／作られているという／まさに同じ人々から',
        '',
        'that／they／are made／of the very same people',
      ),
    ],
    [
      b('Recognizing the pattern', 'その型を認めることは'),
      b(
        'is far more useful than blaming the particular individuals',
        '〜です／特定の個人を責めるよりはるかに有用',
        '',
        'is／far more useful than blaming the particular individuals',
      ),
      b('who happen', 'その個人が／たまたま', '', 'who／happen'),
      b('to hold public office at the time', '就いている／そのとき公職に', '', 'to hold／public office at the time'),
    ],
    [
      b(
        'A generation is a useful unit of planning precisely',
        '世代は／〜です／まさに計画の有用な単位',
        '',
        'A generation／is／a useful unit of planning precisely',
      ),
      b(
        'because it is longer than any single working career can ever be',
        'なぜなら／それが／より長いからです／どんな一つの職業人生がなりうるよりも',
        '',
        'because／it／is longer／than any single working career can ever be',
      ),
    ],
    [
      b('Decisions about land, water, pensions', '決定は／土地／水や年金についての', '', 'Decisions about／land,／water, pensions'),
      b('and public buildings all outlast', 'そして／公共建築についての決定はみな／長く残ります', '', 'and／public buildings all／outlast'),
      b('by many years the people', '何年も、その人々より'),
      b(
        'who first make and approve them',
        'その人々が／最初に／下し／そして／それを承認します',
        '',
        'who／first／make／and／approve them',
      ),
    ],
    [
      b('A city that plans', '計画する都市は', '', 'A city that plans'),
      b('in generations does not thereby become any wiser', '世代単位で、それによって少しも賢くなりはしません'),
      b(
        'but it does become considerably harder',
        'しかし／それは／確かにかなりなります／より難しく',
        '',
        'but／it／does become considerably／harder',
      ),
      b('to surprise', '驚かせることが'),
    ],
    [
      b('The nine sections that follow examine', '続く九つの節が／続きます／検討します', '', 'The nine sections that／follow／examine'),
      b('how that longer view changes ordinary decisions', 'どのように／その長い視野が日常の決定を変えるのかを', '', 'how／that longer view changes ordinary decisions'),
      b('across nine different fields of public life', '公共生活の九つの異なる分野で'),
    ],

    // ===== mind : 恐れ・希望・注意 =====
    [
      b('Public argument is shaped', '公の議論は形づくられます'),
      b('by the direction of public attention long', '公衆の注意の向きによって、ずっと'),
      b('before it is shaped', 'それが形づくられるより前に'),
      b('by any piece of evidence', 'どんな証拠によってよりも'),
    ],
    [
      b(
        'A problem that nobody at all has noticed cannot be solved',
        '問題は／誰一人気づいていない、解決できません',
        '',
        'A problem that nobody at all／has noticed cannot be solved',
      ),
      b('however serious that problem may later turn out', 'どれほど／その問題がのちに深刻だと分かろうとも', '', 'however／serious that problem may later turn out'),
      b('to be', 'そうであると'),
    ],
    [
      b(
        'A problem that everybody has noticed will be answered somehow, even',
        '誰もが気づいた問題は／対処されます／何らかの形で、〜でさえ',
        '',
        'A problem that everybody has noticed／will be answered／somehow, even',
      ),
      b('in cases', 'そうした場合に'),
      b('where it is comparatively small and easy to bear', 'そこでは／それが比較的小さく耐えやすいのです', '', 'where／it is comparatively small and easy to bear'),
    ],
    [
      b('The order in', 'その順序、その中で'),
      b('which problems arrive', '問題が上ってくる順序'),
      b('on a public agenda', '公の議題に'),
      b('is therefore itself an important political outcome', '〜です／したがってそれ自体が重要な政治的結果', '', 'is therefore／itself an important political outcome'),
      b('in its own right as well', 'それ自身の資格においてもまた'),
    ],
    [
      b(
        'Fear responds to vivid images far more readily than it responds to rates',
        '恐れは／反応します／割合に反応するよりはるかに進んで生々しい映像に',
        '',
        'Fear／responds／to vivid images far more readily than it responds to rates',
      ),
      b('which is', 'そしてそれが／〜です', '', 'which／is'),
      b('why rare events dominate discussion', 'なぜ／まれな出来事が／占めるのか／議論を', '', 'why／rare events／dominate／discussion'),
    ],
    [
      b(
        'A single dramatic accident will change more behavior',
        '一件の劇的な事故が／変えます／より多くの行動を',
        '',
        'A single dramatic accident／will change／more behavior',
      ),
      b('in one month than a whole decade of quiet and careful figures', '一か月で、十年分の静かで丁寧な数値よりも'),
    ],
    [
      b(
        'This is not simple stupidity',
        'これは／〜ではありません／単なる愚かさ',
        '',
        'This／is not／simple stupidity',
      ),
      b(
        'because a single vivid case really does carry information',
        'なぜなら／一件の生々しい事例が／本当に運ぶからです／情報を',
        '',
        'because／a single vivid case really／does carry／information',
      ),
      b('that a long table of numbers hides', 'その情報を／長い数表は／隠します', '', 'that／a long table of numbers／hides'),
    ],
    [
      b('The error appears only', '誤りが現れるのはただ'),
      b('at the moment', 'その瞬間だけです'),
      b('when that one vivid case is treated', 'そのとき、その一件の生々しい事例が扱われます'),
      b('as though it were entirely typical', 'まったく典型であるかのように'),
    ],
    [
      b('Hope is quite', '希望は／〜です／まったく', '', 'Hope／is／quite'),
      b('as powerful', '同じくらい強い'),
      b('as fear is', '〜と同じく／恐れが／そうであるのと', '', 'as／fear／is'),
      b(
        'and it distorts public planning in precisely the opposite direction',
        'そして／それは／ゆがめます／公共の計画をちょうど反対の向きに',
        '',
        'and／it／distorts／public planning in precisely the opposite direction',
      ),
      b('from fear', '恐れとは反対に'),
    ],
    [
      b(
        'Optimism about a promising new technology regularly produces schedules',
        '有望な新技術への楽観は繰り返し／生みます／工程表を',
        '',
        'Optimism about a promising new technology regularly／produces／schedules',
      ),
      b('that nobody involved', 'その工程表を／誰も／関わっている', '', 'that／nobody／involved'),
      b('in it', 'それに'),
      b('could ever keep', '〜できませんでした／決して守ることが', '', 'could／ever keep'),
    ],
    [
      b(
        'That very same optimism also produces the sustained effort',
        'そのまったく同じ楽観がまた／生みます／持続的な努力を',
        '',
        'That very same optimism also／produces／the sustained effort',
      ),
      b(
        'that occasionally makes a genuinely difficult project succeed',
        'その努力が／ときに／させます／本当に難しい事業を成功させることを',
        '',
        'that／occasionally／makes／a genuinely difficult project succeed',
      ),
    ],
    [
      b('Removing it entirely', 'それを完全に取り除くことは'),
      b(
        'would leave a city perfectly accurate about the present and quite incapable of building anything',
        '残すでしょう／都市を現在について完璧に正確で、何も造れない状態に',
        '',
        'would leave／a city perfectly accurate about the present and quite incapable of building anything',
      ),
      b('at all', 'まったく'),
    ],
    [
      b(
        'Habits perform far more of the work of ordinary daily life than deliberate choices ever manage',
        '習慣は／果たします／意識的な選択がどうにか果たすよりはるかに多くの日常の仕事を',
        '',
        'Habits／perform／far more of the work of ordinary daily life than deliberate choices ever manage',
      ),
      b('to perform', '果たすことを'),
    ],
    [
      b('A resident', '住民は'),
      b('who has to think carefully', 'その住民が／〜ねばならない／丁寧に考えることを', '', 'who／has／to think carefully'),
      b('about recycling every single week', '毎週欠かさずリサイクルについて'),
      b('will in the end stop doing it completely', '〜でしょう／結局すっかりやめてしまう', '', 'will／in the end stop doing it completely'),
    ],
    [
      b(
        'A system that makes the desired action the easiest available action will survive every change',
        '仕組みは／します／望ましい行動を最も簡単な選択肢に、そしてあらゆる変化を生き延びます',
        '',
        'A system that／makes／the desired action the easiest available action will survive every change',
      ),
      b('in public enthusiasm', '世論の熱意における'),
    ],
    [
      b(
        'Design therefore matters far more than persuasion for anything at all that has to continue',
        'したがって設計は、どんなものについても説得よりはるかに重要です／そのものが／続かねばならない',
        '',
        'Design therefore matters far more than persuasion for anything at all that／has／to continue',
      ),
      b('for several decades', '数十年にわたって'),
    ],
    [
      b(
        'Trust behaves much more like a stock',
        '信頼は／ふるまいます／蓄えのようにずっと強く',
        '',
        'Trust／behaves／much more like a stock',
      ),
      b(
        'that is slowly accumulated than like a flow',
        'その蓄えは／ゆっくり積み上げられます／流れというよりも',
        '',
        'that／is slowly accumulated／than like a flow',
      ),
      b(
        'that arrives each year',
        'その流れが／届きます／毎年',
        '',
        'that／arrives／each year',
      ),
    ],
    [
      b('It builds up slowly', 'それは／築き上げます／ゆっくりと', '', 'It／builds／up slowly'),
      b('through a long series of small promises', '守られる小さな約束の長い連なりを通じて'),
      b(
        'that are kept and falls very quickly',
        'その約束が／守られ／そして／急速に落ちます',
        '',
        'that／are kept／and／falls very quickly',
      ),
      b('when one large promise fails', '大きな約束が一つ破られるとき'),
    ],
    [
      b(
        'A city with a deep reserve of public trust can attempt reforms',
        '公共の信頼の厚い蓄えを持つ都市は／試みられます／改革を',
        '',
        'A city with a deep reserve of public trust／can attempt／reforms',
      ),
      b(
        'that a more suspicious city simply cannot attempt',
        'その改革を／より疑い深い都市は単に／試みられません',
        '',
        'that／a more suspicious city simply／cannot attempt',
      ),
      b('at all', 'まったく'),
    ],
    [
      b('Spending that reserve on a', 'その蓄えを〜に使うことは'),
      b(
        'project that then fails is therefore much more expensive than the failed project itself',
        '事業に／のちに失敗する／その失敗した事業そのものよりずっと高くつきます',
        '',
        'project that then／fails is therefore／much more expensive than the failed project itself',
      ),
    ],

    // ===== work : 仕事・技能・組織 =====
    [
      b('Work is the place', '仕事は／〜です／その場所', '', 'Work／is／the place'),
      b(
        'where most people actually meet the economy',
        'そこで／大半の人が実際に／出会います／経済に',
        '',
        'where／most people actually／meet／the economy',
      ),
      b('and it is also', 'そして／それは／〜でもあります', '', 'and／it／is also'),
      b('where most public policy finally lands', 'そこに／大半の公共政策が最後に／着地します', '', 'where／most public policy finally／lands'),
    ],
    [
      b(
        'A rule about wages, working hours, or safety reaches a household only',
        '賃金や労働時間や安全についての規則は／届きます／家庭にただ',
        '',
        'A rule about wages, working hours, or safety／reaches／a household only',
      ),
      b('through the one particular job', 'その一つの特定の仕事を通してだけです'),
      b('that one member of it does', 'その仕事を／家族の一人が／します', '', 'that／one member of it／does'),
    ],
    [
      b('Changing that rule therefore', 'したがってその規則を変えることは'),
      b('changes different households', '変えます／異なる家庭を', '', 'changes／different households'),
      b('in ways that no average figure is able', 'どんな平均値にもできない仕方で'),
      b('to show at all', '示すことが／まったく', '', 'to show／at all'),
    ],
    [
      b(
        'Any honest account of a labor reform therefore has to name',
        '労働改革の誠実な説明は／したがって〜ねばなりません／名指ししなければ',
        '',
        'Any honest account of a labor reform therefore／has／to name',
      ),
      b('who gains', '誰が／得をするのか', '', 'who／gains'),
      b('from it and', 'それによって、そして'),
      b(
        'who loses by it',
        '誰が／損をするのか／それによって',
        '',
        'who／loses／by it',
      ),
    ],
    [
      b('A skill is not', '技能は／〜ではありません', '', 'A skill／is not'),
      b('at all the same thing as a certificate', 'まったく証書と同じもの'),
      b('because it is a set of judgments', 'なぜなら／それは一連の判断だからです', '', 'because／it is a set of judgments'),
      b('that are built', 'その判断は／築かれます', '', 'that／are built'),
      b('by long repetition', '長い繰り返しによって'),
    ],
    [
      b('A worker', '働き手は'),
      b('who has performed a task', 'その働き手が／こなしてきた／ある作業を', '', 'who／has performed／a task'),
      b('for many years', '何年も'),
      b('can see a problem', '見て取れます／ある問題を', '', 'can see／a problem'),
      b(
        'that no printed manual has ever been able',
        'その問題を／どの／印刷された／手引書もこれまでできませんでした',
        '',
        'that／no／printed／manual has ever been able',
      ),
      b('to describe', '記述することが'),
    ],
    [
      b(
        'Training programs reproduce the manual fully and consistently',
        '研修は／再現します／手引書を完全に、そして／一貫して',
        '',
        'Training programs／reproduce／the manual fully and／consistently',
      ),
      b(
        'and they reproduce the judgment only',
        'そして／それは／再現します／その判断を／ただ',
        '',
        'and／they／reproduce／the judgment／only',
      ),
      b('with the greatest of difficulty', 'このうえない困難とともに'),
    ],
    [
      b('That is precisely', 'それがまさに'),
      b(
        'why an experienced workforce is a valuable asset',
        'なぜ／経験を積んだ働き手が／〜なのか／貴重な資産',
        '',
        'why／an experienced workforce／is／a valuable asset',
      ),
      b(
        'that no line in any public budget ever records',
        'その資産を／どの公共予算のどの項目も決して／記録しません',
        '',
        'that／no line in any public budget ever／records',
      ),
    ],
    [
      b('Organizations remember', '組織は記憶します'),
      b('what they have learned through their formal procedures rather than', '学んだことを、成文の手順を通じて、そうではなく'),
      b('through the memories of their staff', '職員の記憶を通じてではありません'),
    ],
    [
      b('A form that asks an awkward and apparently useless question is very often the trace of an old and extremely expensive mistake', '厄介で一見無用な質問をする書式は、しばしば古くきわめて高くついた失敗の痕跡です'),
    ],
    [
      b('Removing such questions in order to', 'そうした質問を取り除くことは、〜のために'),
      b(
        'save a little time can quietly bring back the failure they were designed',
        '少し時間を節約する／静かに呼び戻しうるのです／設計された失敗を',
        '',
        'save a little time／can quietly bring／back the failure they were designed',
      ),
      b('to prevent', '防ぐために'),
    ],
    [
      b('Making a procedure simpler', '手順を簡素にすることは'),
      b('is valuable', '〜です／価値のあること', '', 'is／valuable'),
      b('but it should always begin', 'しかし／それは／常に始めるべきです', '', 'but／it／should always begin'),
      b('by asking', '問うことから'),
      b('what each step was originally built for', '各段階がもともと何のために作られたのかを'),
    ],
    [
      b(
        'Automation removes particular tasks rather than whole occupations',
        '自動化は／取り除きます／職業全体ではなく特定の作業を',
        '',
        'Automation／removes／particular tasks rather than whole occupations',
      ),
      b('in almost every single case', 'ほとんどすべての場合で'),
      b('that has been carefully recorded', 'その場合は／丁寧に記録されてきました', '', 'that／has been carefully recorded'),
    ],
    [
      b(
        'A job that is made up of ten separate tasks may lose four of them and become a different job',
        '仕事は／作られている／十の別々の作業から、そして四つを失って別の仕事になりえます',
        '',
        'A job that／is made／up of ten separate tasks may lose four of them and become a different job',
      ),
      b('with exactly the same title', 'まったく同じ名称の'),
    ],
    [
      b(
        'The person doing that job experiences the change',
        'その人は／担い／その仕事を、そして経験します／その変化を',
        '',
        'The person／doing／that job experiences the／change',
      ),
      b('as a demand', '〜として／一つの／要求', '', 'as／a／demand'),
      b('for new skills rather than as the simple loss of employment', '新しい技能への要求として、雇用の単なる喪失としてではなく'),
    ],
    [
      b(
        'Whether that demand is truly answered depends entirely',
        '〜かどうか／その要求が／本当に満たされるかは／かかっています／まったく',
        '',
        'Whether／that demand／is truly answered／depends／entirely',
      ),
      b('on training that begins well', '十分に早く始まる訓練に'),
      b('before the change has arrived', 'その変化が到達する前に'),
    ],
    [
      b('Transitions are', '移行とは／〜です', '', 'Transitions／are'),
      b(
        'where the whole cost of change concentrates',
        'そこに／〜の全費用が／変化の／集まります',
        '',
        'where／the whole cost of／change／concentrates',
      ),
      b(
        'and they are almost always planned last of all',
        'そして／それは／〜です／ほとんど常に最後に計画されるもの',
        '',
        'and／they／are／almost always planned last of all',
      ),
    ],
    [
      b('A city that funds retraining only', '再訓練に資金を出すのがようやくという都市は'),
      b('after a large factory has finally closed has already lost several genuinely useful years', '大きな工場がついに閉じたあとで、すでに本当に有用な数年を失っています'),
    ],
    [
      b('The very same money', 'まったく同じ資金も'),
      b(
        'if it is used earlier, reaches workers',
        'もし／それが／使われれば／より早く、働き手に届きます',
        '',
        'if／it／is used／earlier, reaches workers',
      ),
      b('while they still have savings, contacts', '彼らにまだ貯えと人脈があるうちに'),
      b('and a measure of confidence', 'そして／いくらかの自信も', '', 'and／a measure of confidence'),
    ],
    [
      b('Timing, rather than generosity', '気前のよさではなく時期が'),
      b('therefore decides', 'したがって／決めます', '', 'therefore／decides'),
      b('how much a transition program of this kind actually achieves', 'どれだけ／この種の移行の施策が実際に成し遂げるのかを', '', 'how／much a transition program of this kind actually achieves'),
    ],

    // ===== conditions : 結果を形づくる条件 =====
    [
      b('Two people', '二人が'),
      b('who make exactly the same decision', 'その二人が／まったく同じ決定をします', '', 'who／make exactly the same decision'),
      b('on the very same day', 'まさに同じ日に'),
      b('can end up', '行き着くことがあります'),
      b('in two very different places', '二つのまったく違う場所に'),
    ],
    [
      b('The difference usually lies', 'その違いはたいてい／横たわっています', '', 'The difference usually／lies'),
      b('in the conditions', 'その条件の中に'),
      b(
        'that surround the decision rather than in the quality of the decision itself',
        'その条件が／取り巻きます／決定を、決定そのものの質の中にではなく',
        '',
        'that／surround／the decision rather than in the quality of the decision itself',
      ),
      b('at all', 'まったく'),
    ],
    [
      b(
        'A single missed payment is a small trouble for one household and the beginning of a long spiral',
        '一度の／取り逃した／支払いは、ある家庭には小さな面倒であり、長い転落の始まりでもあります',
        '',
        'A single／missed／payment is a small trouble for one household and the beginning of a long spiral',
      ),
      b('for another', '別の家庭にとっては'),
    ],
    [
      b(
        'Any policy that ignores this asymmetry will end',
        'どんな政策も／無視する／この非対称を、そして結局こうなります',
        '',
        'Any policy that／ignores／this asymmetry will end',
      ),
      b('by describing the second of those households', 'その二つ目の家庭をこう記述することで'),
      b('as being simply careless', '単に不注意なのだと'),
    ],
    [
      b('A margin is the distance', '余裕とは／〜です／その距離', '', 'A margin／is／the distance'),
      b('between an ordinary setback and a setback', 'ありふれた不調と、ある不調とのあいだの'),
      b('that turns', 'その不調が／変わります', '', 'that／turns'),
      b('into something genuinely serious', '本当に深刻な何かへと'),
    ],
    [
      b('Savings, family support', '貯蓄や、家族の／支えは', '', 'Savings, family／support'),
      b('and secure housing all widen', 'そして／安定した住まいもみな広げます', '', 'and／secure housing all widen'),
      b(
        'that distance without ever appearing in any published official figure',
        'その／距離を、決して／現れることなく／公表されるどの公的な数値にも',
        '',
        'that／distance without ever／appearing／in any published official figure',
      ),
    ],
    [
      b(
        'Two households with identical incomes can therefore represent entirely different degrees of practical safety and personal freedom',
        '同額の収入を持つ二つの家庭は／したがってまったく表しうるのです／異なる実際的な安全と個人の自由の度合いを',
        '',
        'Two households with identical incomes／can therefore represent entirely／different degrees of practical safety and personal freedom',
      ),
    ],
    [
      b('Measuring income by itself', '収入だけを測ることは'),
      b('hides most of', '隠します／〜の大半を', '', 'hides／most of'),
      b('what actually determines', '何が／実際に／決めるのかを', '', 'what／actually／determines'),
      b('how a sudden shock is going', 'どのように／突然の衝撃が〜されようとしているのか', '', 'how／a sudden shock is going'),
      b('to be absorbed', '吸収されようと'),
    ],
    [
      b('Time is the resource', '時間はその資源です'),
      b(
        'that inequality distributes most unevenly and',
        'その資源を／不平等が／分配し／最も不均等に、そして',
        '',
        'that／inequality／distributes／most unevenly and',
      ),
      b(
        'that public policy notices least often',
        'その資源に／公共政策が／気づきます／最も／まれにしか',
        '',
        'that／public policy／notices／least／often',
      ),
    ],
    [
      b(
        'A long journey to work, an unpredictable shift',
        '長い道のりと／職場への／予測できない／勤務と',
        '',
        'A long journey／to work,／an unpredictable／shift',
      ),
      b(
        'and a second job all consume exactly the hours',
        'そして／二つ目の仕事がみな／まさに奪います／その時間を',
        '',
        'and／a second job all／consume exactly／the hours',
      ),
      b(
        'that any serious planning requires',
        'その時間を／どんな真剣な／計画も／必要とします',
        '',
        'that／any serious／planning／requires',
      ),
    ],
    [
      b('Advice that quietly assumes a free evening', '空いた夜を暗に前提にする助言は'),
      b('at home is entirely useless to the people', '家での、そしてその人々にはまったく役立ちません'),
      b(
        'who most need that advice',
        'その人々こそ／最も／必要とします／その助言を',
        '',
        'who／most／need／that advice',
      ),
    ],
    [
      b(
        'Public services designed around the schedules of their own staff exclude exactly those residents most of all',
        '行政の窓口は／職員／自身の予定に合わせて設計され、まさにそうした住民を何より締め出します',
        '',
        'Public services designed around the schedules of their／own／staff exclude exactly those residents most of all',
      ),
      b('in practice', '実際には'),
    ],

    [
      b('Place multiplies every other condition that a household faces, whether in a favorable direction or', '場所は、家庭が直面する他のあらゆる条件を増幅します。よい向きにであれ、あるいは'),
      b('in the opposite one', '反対の向きにであれ'),
    ],
    [
      b(
        'A child growing up ten kilometers away from a good school effectively lives in a different city',
        '子どもは／育ち／よい学校から十キロ離れたところで／事実上／暮らしています／別の都市に',
        '',
        'A child／growing／up ten kilometers away from a good school／effectively／lives／in a different city',
      ),
      b('from a nearer neighbor', 'より近い隣人とは'),
    ],
    [
      b(
        'Transport policy is therefore education policy as well',
        '交通政策は／したがって〜です／教育政策でもある',
        '',
        'Transport policy／is therefore／education policy as well',
      ),
      b(
        'although the two are almost never discussed',
        'ただし／その二つは／〜です／ほとんど決して論じられない',
        '',
        'although／the two／are／almost never discussed',
      ),
      b('in the same room', '同じ部屋の中では'),
    ],
    [
      b('Moving a single bus route', '一本のバス路線を動かすことは'),
      b(
        'can change more outcomes for children than an entirely new curriculum',
        '変えうるのです／まったく新しい教育課程より多くの子どもの結果を',
        '',
        'can change／more outcomes for children than an entirely new curriculum',
      ),
      b('in the same district', '同じ地区の'),
    ],
    [
      b(
        'None of this argument removes responsibility',
        'この議論のどれも／取り去りません／責任を',
        '',
        'None of this argument／removes／responsibility',
      ),
      b('from the individual', 'その個人から'),
      b(
        'who finally makes one particular choice',
        'その個人が／最終的に／下します／一つの特定の選択を',
        '',
        'who／finally／makes／one particular choice',
      ),
    ],
    [
      b('What it changes is the list of things', 'それが変えるのは、事柄の一覧です'),
      b(
        'that a fair comparison between two individuals would have to hold constant',
        'その事柄を／二人の公平な比較が／〜ねばなりません／保っておかねば／一定に',
        '',
        'that／a fair comparison between two individuals／would have／to hold／constant',
      ),
    ],
    [
      b(
        'A city that improves conditions is therefore not excusing anyone',
        '都市は／改善する／条件を、したがって誰かを免責しているのではありません',
        '',
        'A city that／improves／conditions is therefore not excusing anyone',
      ),
      b('because what it is doing is widening the margin', 'なぜなら／していることは余裕を広げることだからです', '', 'because／what it is doing is widening the margin'),
    ],
    [
      b('The practical question in every single case is', 'どの場合でも実際的な問いは／〜です', '', 'The practical question in every single case／is'),
      b(
        'which of those conditions can be changed',
        'どれが／その条件のうち／変えられるのか',
        '',
        'which／of those conditions／can be changed',
      ),
      b('at a cost', 'ある費用で'),
      b('that is worth paying', 'その費用が／〜です／払う価値のあるもの', '', 'that／is／worth paying'),
    ],
    [
      b('A price is a message', '価格は／〜です／一つの伝言', '', 'A price／is／a message'),
      b('about scarcity', '希少さについての'),
      b('and it is', 'そして／それは／〜でもあります', '', 'and／it／is'),
      b('at the very same time a bill', 'まさに同時に一つの請求書'),
      b(
        'that some particular household has to pay',
        'その請求書を／どこかの家庭が／〜ねばなりません／払わ',
        '',
        'that／some particular household／has／to pay',
      ),
    ],
    [
      b('Raising a price', '価格を上げることは'),
      b('reduces demand very efficiently indeed', '減らします／需要を実にきわめて効率よく', '', 'reduces／demand very efficiently indeed'),
      b('and it reduces', 'そして／それは／減らします', '', 'and／it／reduces'),
      b('that demand most sharply among those', 'その／需要を最も鋭く、人々のあいだで', '', 'that／demand most sharply among those'),
      b('with the least money', '最も金の少ない'),
    ],
    [
      b('Both of those statements are entirely true', 'その二つの言明は／まったく〜です／真実', '', 'Both of those statements／are entirely／true'),
      b(
        'and any policy that admits only one of them will sooner or later be resisted',
        'そして／どんな政策も／一方しか認めない／遅かれ早かれ抵抗を受けます',
        '',
        'and／any policy that／admits only／one of them will sooner or later be resisted',
      ),
    ],
    [
      b(
        'Pairing a price signal with a direct payment is usually the cheapest available way',
        '価格の合図に直接の給付を組み合わせることは／たいてい〜です／利用できる最も安い方法',
        '',
        'Pairing a price signal with a direct payment／is usually／the cheapest available way',
      ),
      b('to keep both effects at once', '保つための／両方の効果を同時に', '', 'to keep／both effects at once'),
    ],
    [
      b(
        'Housing is by a considerable margin the largest single expense',
        '住居費は／〜です／かなりの差をつけて最大の単一支出',
        '',
        'Housing／is／by a considerable margin the largest single expense',
      ),
      b('in the yearly budget of most households', 'たいていの家庭の年間予算の中で'),
    ],
    [
      b('It is also the asset through', 'それは／〜でもあります／その資産、それを通して', '', 'It／is also／the asset through'),
      b('which most families hold the wealth', 'それを通して多くの家族が財産を保持します'),
      b('that they have managed', 'その財産を／彼らが／どうにかしてきました', '', 'that／they／have managed'),
      b('to accumulate over a life', '蓄えることを／一生かけて', '', 'to accumulate／over a life'),
    ],
    [
      b('Those two roles pull housing policy', 'その二つの役割は／引きます／住宅政策を', '', 'Those two roles／pull／housing policy'),
      b('in opposite directions', '反対の向きへ'),
      b(
        'and they cannot both be fully satisfied',
        'そして／その二つは／〜できません／どちらも完全に満たされることが',
        '',
        'and／they／cannot／both be fully satisfied',
      ),
      b('at the same time', '同時に'),
    ],
    [
      b(
        'Cheaper housing is good for new buyers and bad',
        'より安い住宅は／〜です／新しい買い手にはよく、そして悪い',
        '',
        'Cheaper housing／is／good for new buyers and bad',
      ),
      b('for the existing owners', '既存の所有者にとっては'),
      b('who voted', 'その所有者は／投票しました', '', 'who／voted'),
      b('for the rules', 'その規則に'),
      b('that are now', 'その規則は／いま〜です', '', 'that／are now'),
      b('in force', '効力を持って'),
    ],
    [
      b(
        'Debt moves consumption from the future into the present',
        '負債は／移します／消費を未来から現在へ',
        '',
        'Debt／moves／consumption from the future into the present',
      ),
      b('at a price', 'ある価格で'),
      b('that is normally stated', 'その価格は／ふつう示されます', '', 'that／is normally stated'),
      b('in advance', '前もって'),
    ],
    [
      b('Used for education or', '教育のために使われれば、あるいは'),
      b('for the purchase of a house, it can raise the income of a whole life quite substantially', '住宅の購入のために使われれば、それは生涯の所得をかなり大きく引き上げうるのです'),
    ],
    [
      b(
        'Used for ordinary daily expenses, it converts a temporary shortage into a permanent charge',
        '日々の支出のために使われれば、それは／変えます／一時的な不足を／恒久的な負担へ',
        '',
        'Used for ordinary daily expenses, it／converts／a temporary shortage／into a permanent charge',
      ),
      b('on every future month', '将来のあらゆる月への'),
    ],
    [
      b(
        'The very same instrument therefore builds security for one household and steadily removes it',
        'まったく同じ道具が／したがって築きます／ある家庭には安定を、そして着実にそれを奪います',
        '',
        'The very same instrument therefore／builds／security for one household and steadily removes it',
      ),
      b('from the next', '次の家庭からは'),
    ],
    [
      b('Insurance is the market instrument that addresses risk', '保険は、危険に対処する市場の道具です'),
      b('between the generations more directly than any other instrument', '世代のあいだの危険に、他のどの道具よりも直接に'),
    ],
    [
      b('It works', 'それは働きます'),
      b('by pooling events', '出来事をまとめることによって'),
      b(
        'that are rare for any single individual and reasonably predictable',
        'その出来事は／〜です／どの個人にもまれで、十分予測できる',
        '',
        'that／are／rare for any single individual and reasonably predictable',
      ),
      b('for a whole population', '集団全体にとっては'),
    ],
    [
      b('When a risk becomes common rather than rare', '危険がまれではなく当たり前になるとき'),
      b(
        'that pool stops functioning properly and prices rise very sharply indeed',
        'その／集まりが／やめます／正しく働くことを、そして価格が／上がります／実に急激に',
        '',
        'that／pool／stops／functioning properly and prices／rise／very sharply indeed',
      ),
    ],
    [
      b('Flood cover', '水害保険は'),
      b('in an exposed coastal district is the clearest current example of exactly that kind of breakdown', '浸水しやすい沿岸の地区における、まさにその種の破綻の最も明確な現在の例です'),
    ],
    [
      b(
        'Markets allocate resources very efficiently',
        '市場は／配分します／資源をきわめて／効率よく',
        '',
        'Markets／allocate／resources very／efficiently',
      ),
      b('within the rules', 'その規則の内側で'),
      b(
        'that a society has already chosen to set out',
        'その規則を／社会が／すでに／定めることを選び／示しました',
        '',
        'that／a society／has already／chosen to set／out',
      ),
      b('for them', '市場のために'),
    ],
    [
      b('They cannot choose those rules', '市場は／選べません／その規則を', '', 'They／cannot choose／those rules'),
      b('for themselves', '自らのために'),
      b('and they cannot notice any cost', 'そして／市場は／気づけません／どんな費用にも', '', 'and／they／cannot notice／any cost'),
      b(
        'that nobody has yet',
        'その費用に／誰も／〜していない／まだ',
        '',
        'that／nobody／has／yet',
      ),
      b('put a price on', '値をつけていない'),
    ],
    [
      b('Treating a market outcome', '市場の結果を扱うことは'),
      b(
        'as a verdict about fairness therefore confuses a mechanism',
        '〜として／公正さの判定として、したがって／取り違えます／仕組みを',
        '',
        'as／a verdict about fairness therefore／confuses／a mechanism',
      ),
      b('with a considered judgment', '熟慮された判断と'),
    ],
    [
      b('The useful question is always', '役に立つ問いは／常に〜です', '', 'The useful question／is always'),
      b(
        'which particular set of rules produces outcomes',
        'どの／規則の組み合わせが／生むのか／結果を',
        '',
        'which／particular set of rules／produces／outcomes',
      ),
      b('that a city is prepared', 'その結果を／都市が／受け入れる用意がある', '', 'that／a city／is prepared'),
      b('to live with', '暮らすことを／それとともに', '', 'to live／with'),
    ],
    [
      b('An institution is essentially a promise', '制度とは／本質的に〜です／一つの約束', '', 'An institution／is essentially／a promise'),
      b('that keeps its force even', 'その約束が／効力を保ちます、〜でさえ', '', 'that／keeps its force even'),
      b('after the people', 'その人々のあとも'),
      b(
        'who first made it have left it behind',
        'その人々が／最初に／作りました／それを、そして／それを残して去ったあとも',
        '',
        'who／first／made／it／have left it behind',
      ),
    ],
    [
      b(
        'Its value comes from being consistently predictable rather than from being clever',
        'その価値は／来ます／賢いことからではなく、一貫して予測できることから',
        '',
        'Its value／comes／from being consistently predictable rather than from being clever',
      ),
      b('in any one particular case', 'どれか一つの特定の場面で'),
    ],
    [
      b('A court that decided every single case purely', 'すべての事件を純粋に裁く裁判所は'),
      b('on its own merits would be entirely fair and completely useless', 'その都度の是非だけで、完全に公正でありながらまったく役に立たないでしょう'),
    ],
    [
      b(
        'People arrange their whole lives around',
        '人は／組み立てます／自分の全／生活を／〜を軸に',
        '',
        'People／arrange／their whole／lives／around',
      ),
      b(
        'what they confidently expect an institution',
        '何を／人が確かに／期待するのか／制度に',
        '',
        'what／they confidently／expect／an institution',
      ),
      b('to do in the following year', 'することを／翌年に', '', 'to do／in the following year'),
    ],
    [
      b('Procedure is very often criticized', '手続きは／しばしば〜です／批判される', '', 'Procedure／is／very often criticized'),
      b('as useless delay', '〜として／無用な遅れ', '', 'as／useless delay'),
      b('and a part of that criticism is entirely justified', 'そして／その批判の一部は／まったく正当です', '', 'and／a part of that criticism／is entirely justified'),
    ],
    [
      b(
        'The remaining part of that criticism mistakes a safeguard for an obstacle that serves no useful purpose',
        'その／残りの／批判の部分は、安全装置を障害物と取り違えています／その障害物が果たさない／有用な目的を',
        '',
        'The／remaining／part of that criticism mistakes a safeguard for an obstacle that／serves no／useful purpose',
      ),
      b('at all', 'まったく'),
    ],
    [
      b('A step that appears useless', '段階は／見えます／無用に', '', 'A step that／appears／useless'),
      b('in ninety-nine ordinary cases exists entirely', '九十九のありふれた場合には、そしてもっぱら存在します'),
      b('because of the one rare case that remains', 'なぜなら／残る一つのまれな場合のためです', '', 'because／of the one rare case that remains'),
    ],
    [
      b(
        'Reform therefore requires knowing',
        '改革は／したがって要します／知ることを',
        '',
        'Reform therefore／requires／knowing',
      ),
      b('which particular kind of case each step was originally', '各段階がもともとどの種類の場合を'),
      b('built', '作られた'),
      b('to catch', '捉えるために'),
    ],
    [
      b('Accountability means simply', '説明責任は／単に意味します', '', 'Accountability／means simply'),
      b(
        'that someone can be identified by name',
        'すなわち／誰かが／特定されうるということを／名前で',
        '',
        'that／someone／can be identified／by name',
      ),
      b('at the point', 'その時点で'),
      b('when a decision turns out', 'そのとき決定が〜と分かります'),
      b('to be wrong', '〜であると／誤り', '', 'to be／wrong'),
    ],
    [
      b(
        'Systems that spread responsibility thinly across many offices consistently produce decisions that nobody',
        '仕組みは／分散させる／責任を多くの部署へ薄く、そして誰も〜ない決定を一貫して生みます',
        '',
        'Systems that／spread／responsibility thinly across many offices consistently produce decisions that nobody',
      ),
      b('at all owns', 'まったく引き受けない'),
    ],
    [
      b('Such systems are comfortable', 'そうした仕組みは／〜です／居心地がよい', '', 'Such systems／are／comfortable'),
      b(
        'to work inside and almost impossible to correct from anywhere outside them',
        '働くには／中で、そして外のどこからも正すことはほぼ不可能です',
        '',
        'to work／inside and almost impossible to correct from anywhere outside them',
      ),
    ],
    [
      b(
        'Naming the responsible office well in advance is therefore a technical measure rather than any form of punishment',
        '責任ある部署を十分前もって明記することは／したがって〜です／罰のどんな形でもなく技術的な措置',
        '',
        'Naming the responsible office well in advance／is therefore／a technical measure rather than any form of punishment',
      ),
    ],
    [
      b(
        'Transparency is frequently offered to the public',
        '透明性は／しばしば差し出されます／人々に',
        '',
        'Transparency／is frequently offered／to the public',
      ),
      b(
        'as a complete and sufficient answer to every kind of distrust',
        '〜として／一つの／完全な／そして十分な答えとして、あらゆる不信への',
        '',
        'as／a／complete／and sufficient answer to every kind of distrust',
      ),
    ],
    [
      b('Publishing a long document that nobody', '誰も〜ない長い文書を公表することは'),
      b('is actually able', '実際に〜できる／状態にある', '', 'is actually／able'),
      b(
        'to read produces the appearance of openness and none of its substance',
        '読むことが／公開の外見だけを生み、その中身は何も生みません',
        '',
        'to read／produces the appearance of openness and none of its substance',
      ),
    ],
    [
      b(
        'Genuinely useful transparency states the decision, the reason for it, the alternatives, and the date of the next review',
        '本当に役立つ透明性は、決定と、その理由と、選択肢と、次の見直しの期日を述べます／見直しの',
        '',
        'Genuinely useful transparency states the decision, the reason for it, the alternatives, and the date of the next／review',
      ),
    ],
    [
      b('Four short sentences of', '四つの短い文のほうが'),
      b('that kind will usually', 'その／種類の文は／たいてい', '', 'that／kind／will usually'),
      b('do more', 'より多くをします／より多く', '', 'do／more'),
      b('for public trust than four hundred pages of technical detail', '公共の信頼のために、四百頁の技術的な詳細よりも'),
    ],
    [
      b('Institutions decay very quietly', '制度は／衰えます／きわめて静かに', '', 'Institutions／decay／very quietly'),
      b(
        'and that decay becomes visible only',
        'そして／その／衰えが／見えるようになるのはただ',
        '',
        'and／that／decay／becomes visible only',
      ),
      b('in the way they respond to a genuine surprise', '本物の驚きにどう反応するかにおいてだけです'),
    ],
    [
      b(
        'A body that carries out its routine work extremely well may still be quite incapable of admitting a single error',
        '組織は／こなします／定型の／仕事をきわめて／うまく／それでも〜かもしれません／一つの誤りを認めることがまるでできない',
        '',
        'A body that／carries／out its routine／work extremely／well／may still be／quite incapable of admitting a single error',
      ),
    ],
    [
      b(
        'The ability to reverse an earlier decision in public is the clearest available sign',
        '以前の決定を公然と撤回できる力は／〜です／利用できる最も明確な証',
        '',
        'The ability to reverse an earlier decision in public／is／the clearest available sign',
      ),
      b(
        'that an institution is still fully alive',
        'すなわち／制度が／なお完全に〜だという／生きている',
        '',
        'that／an institution／is still fully／alive',
      ),
    ],
    [
      b(
        'A city should test that ability deliberately in small matters rather than waiting for a crisis to test it',
        '都市は／試すべきです／危機がそれを試すのを待つのではなく、小さな事柄で意図的にその力を',
        '',
        'A city／should test／that ability deliberately in small matters rather than waiting for a crisis to test it',
      ),
      b('for them', '自分たちのために'),
    ],

    // ===== knowledge : 知識と公共の学び =====
    [
      b(
        'A city passes on a great deal more knowledge outside its schools than it will ever pass on',
        '都市は／受け渡します／学校の中でこれから受け渡すよりはるかに多くの知識を',
        '',
        'A city／passes／on a great deal more knowledge outside its schools than it will ever pass on',
      ),
      b('inside them', '学校の中で'),
    ],
    [
      b('Libraries, places of work, families', '図書館や、〜の場所／仕事の／家族が', '', 'Libraries, places of／work,／families'),
      b(
        'and neighbors together carry most of',
        'そして／隣人が合わさって／運びます／〜の大半を',
        '',
        'and／neighbors together／carry／most of',
      ),
      b('what a resident of a city actually ends up learning', '都市の住民が結局実際に学ぶものの'),
    ],
    [
      b('Schools matter so much', '学校がこれほど重要なのは'),
      b(
        'because they are the one part of',
        'なぜなら／学校が／〜だからです／唯一の部分',
        '',
        'because／they／are／the one part of',
      ),
      b('that larger system that policy can reach directly', 'その／大きな仕組みのうち政策が直接届く部分', '', 'that／larger system that policy can reach directly'),
    ],
    [
      b('Treating schools', '学校を扱うことは'),
      b('as though they were the whole of', 'それが〜の全体であるかのように'),
      b('that system produces reforms', 'その／仕組みの、そして／生みます／改革を', '', 'that／system／produces／reforms'),
      b('that fail', 'その改革は／失敗します', '', 'that／fail'),
      b('for reasons nobody had predicted', '誰も予測しなかった理由で'),
    ],
    [
      b('Assessment shapes what is actually taught', '評価は何が／実際に教えられるかを形づくります', '', 'Assessment shapes what／is actually taught'),
      b('in a classroom far more powerfully than any curriculum document ever manages', '教室で、どの教育課程の文書がどうにか果たすよりもはるかに強く'),
      b('to do', 'そうすることを'),
    ],
    [
      b('Teachers respond rationally to the things', '教師は／合理的に応じます／その事柄に', '', 'Teachers／respond rationally／to the things'),
      b('that are measured', 'その事柄が／測られます', '', 'that／are measured'),
      b('and they are entirely right', 'そして／教師はまったく正しいのです', '', 'and／they are entirely right'),
      b('to respond in that way', '応じることが／そのように', '', 'to respond／in that way'),
    ],
    [
      b(
        'A test that mainly rewards recall will consistently produce classrooms that are organized',
        '主として暗記に報いる試験は／一貫して生みます／組み立てられた教室を',
        '',
        'A test that mainly rewards recall／will consistently produce／classrooms that are organized',
      ),
      b('around recall and nothing else', '暗記を軸に、そして他の何ものでもなく'),
    ],
    [
      b('Changing what', '何を〜かを変えることは'),
      b('is examined is therefore', '試験されるのかを、それはしたがって'),
      b('by far the fastest available way', '群を抜いて最も速い利用できる方法です'),
      b(
        'to change what is actually taught',
        '変えるための／何が／実際に教えられるかを',
        '',
        'to change／what／is actually taught',
      ),
    ],
    [
      b(
        'Some of the most valuable outcomes of an education are also the very hardest',
        '教育の最も価値ある成果のいくつかは／〜でもあります／まさに最も難しいもの',
        '',
        'Some of the most valuable outcomes of an education／are also／the very hardest',
      ),
      b('to measure at all', '測ることが／そもそも', '', 'to measure／at all'),
    ],
    [
      b(
        'Patience, curiosity, and a willingness to revise a strong belief all resist almost every simple instrument of measurement',
        '忍耐と好奇心と、〜する意志／改めることを／強い信念を、それらはみなほとんどどんな単純な測定の道具にも抵抗します',
        '',
        'Patience, curiosity, and a willingness／to revise／a strong belief all resist almost every simple instrument of measurement',
      ),
    ],
    [
      b('Measuring only what', '何を〜かだけを測ることは'),
      b('happens', 'たまたま'),
      b('to be easy therefore produces a system', '簡単であるものを／したがって一つの仕組みを生みます', '', 'to be／easy therefore produces a system'),
      b(
        'that quietly discards almost everything else of value',
        'その仕組みが／静かに／捨てます／価値ある他のほとんどすべてを',
        '',
        'that／quietly／discards／almost everything else of value',
      ),
    ],
    [
      b('Stating a goal that is not measured', '目標を述べることは／測られない', '', 'Stating a goal that／is not measured'),
      b('in plain language is a weak defense', '平易な言葉で、それは弱い防御です'),
      b(
        'but it is a good deal better than nothing',
        'しかし／それは／〜です／何もないよりずっとまし',
        '',
        'but／it／is／a good deal better than nothing',
      ),
    ],
    [
      b(
        'Adults learn in quite a different way',
        '大人は／学びます／かなり違ったやり方で',
        '',
        'Adults／learn／in quite a different way',
      ),
      b('from children', '子どもとは'),
      b(
        'and public systems rarely reflect that difference',
        'そして／公的な仕組みはめったに／反映しません／その違いを',
        '',
        'and／public systems rarely／reflect／that difference',
      ),
      b('at all', 'まったく'),
    ],
    [
      b(
        'An adult brings experience, severely limited time, and an immediate practical reason',
        '大人は／持ち込みます／経験と、ひどく限られた時間と、差し迫った実際的な理由を',
        '',
        'An adult／brings／experience, severely limited time, and an immediate practical reason',
      ),
      b('for learning one particular thing', '一つの特定のことを学ぶための'),
    ],
    [
      b('Courses that were designed', '設計された課程は'),
      b('for eighteen-year-old students will waste all three of those considerable advantages', '十八歳の学生向けに、その三つの大きな利点をすべて無駄にするでしょう'),
    ],
    [
      b(
        'Short and practical formats that can be repeated reach far more adults than long degree programs ever do',
        '短く実際的な形式は／繰り返すことができ／長い学位課程が届けるよりはるかに多くの大人に届きます',
        '',
        'Short and practical formats that／can be repeated／reach far more adults than long degree programs ever do',
      ),
    ],
    [
      b('Public knowledge decays steadily', '公共の知識は着実に朽ちていきます'),
      b('unless someone is actually paid', 'もし〜でなければ／誰かが実際に報酬を得ていなければ', '', 'unless／someone is actually paid'),
      b('to maintain and correct it year after year', '維持し／そして毎年それを正すために', '', 'to maintain／and correct it year after year'),
    ],
    [
      b(
        'Records are lost, formats become unreadable',
        '記録は／〜され／失われ、形式は読めなくなります',
        '',
        'Records／are／lost, formats become unreadable',
      ),
      b('and the people', 'そして／その人々は', '', 'and／the people'),
      b('who', 'その人々は'),
      b(
        'once understood an old system quietly retire',
        'かつて／理解していました／古い仕組みを、そして静かに引退します',
        '',
        'once／understood／an old system quietly retire',
      ),
    ],
    [
      b('Maintaining an archive', '文書館を維持することは'),
      b('is plain work', '〜です／地味な仕事', '', 'is／plain work'),
      b('that is never rewarded', 'その仕事は／決して報われません', '', 'that／is never rewarded'),
      b('and it is usually the first budget line', 'そして／それはたいてい最初の予算項目です', '', 'and／it is usually the first budget line'),
      b('to be cut', '削られる'),
    ],
    [
      b(
        'A city that cannot consult its own past will keep',
        '都市は／参照できない／自らの過去を、そして続けるでしょう',
        '',
        'A city that／cannot consult／its own past will keep',
      ),
      b(
        'on repeating experiments that it has already run once before',
        '繰り返し／すでに一度行った実験を',
        '',
        'on repeating／experiments that it has already run once before',
      ),
    ],

    // ===== health : 生涯にわたるケア =====
    [
      b('Health is produced for the most part', '健康は／生み出されます／おおむね', '', 'Health／is produced／for the most part'),
      b('outside hospitals', '病院の外で'),
      b(
        'and it is measured almost entirely',
        'そして／それは／測られます／ほとんど／完全に',
        '',
        'and／it／is measured／almost／entirely',
      ),
      b('inside them', '病院の中で'),
    ],
    [
      b('Housing, work, diet', '住まいと仕事と食事'),
      b(
        'and the quality of the air together account',
        'そして／〜の質が／空気の／合わさって説明します',
        '',
        'and／the quality of the／air／together account',
      ),
      b('for far more variation than any treatment ever does', 'どんな治療がするよりもはるかに大きな差を'),
    ],
    [
      b(
        'A health budget that is used entirely on treatment is therefore being used',
        '保健予算は／すべて使われる／治療に、そしてしたがってこう使われています',
        '',
        'A health budget that／is used entirely／on treatment is therefore being used',
      ),
      b('at the very last stage of the process', '過程のまさに最後の段階で'),
    ],
    [
      b('Moving part of that budget earlier', 'その予算の一部を前倒しすることは'),
      b('is difficult', '〜です／難しいこと', '', 'is／difficult'),
      b('because the benefits then appear', 'なぜなら／利益がそのとき／現れるからです', '', 'because／the benefits then／appear'),
      b('in the accounts of some other office', '他のどこかの役所の帳簿に'),
    ],
    [
      b('Prevention is very cheap', '予防は／〜です／きわめて安い', '', 'Prevention／is／very cheap'),
      b('when it is counted in total and yet completely invisible', '全体として数えられるとき、それでいてまったく目に見えません'),
      b('in every individual case', '個々の場面では'),
    ],
    [
      b(
        'Nobody is ever able to point to the particular illness',
        '誰も／〜です／その特定の病気を決して指し示せない',
        '',
        'Nobody／is／ever able to point to the particular illness',
      ),
      b('that a clean water supply did not happen', 'その病気を／清潔な水道はたまたま〜しませんでした', '', 'that／a clean water supply did not happen'),
      b('to cause', '引き起こすことを'),
    ],
    [
      b(
        'Treatment, by contrast, produces a grateful patient',
        '対照的に治療は／生みます／感謝する患者を',
        '',
        'Treatment, by contrast,／produces／a grateful patient',
      ),
      b(
        'who can be photographed and publicly thanked',
        'その患者は／写真に撮られ／そして公に感謝されえます',
        '',
        'who／can be photographed／and publicly thanked',
      ),
      b('by name', '名前を挙げて'),
    ],
    [
      b(
        'That difference in visibility explains most of the lasting imbalance',
        'その見えやすさの違いが／説明します／長く残る偏りの大半を',
        '',
        'That difference in visibility／explains／most of the lasting imbalance',
      ),
      b('in the way', 'そのやり方における'),
      b('that health money is used', 'そのやり方で／保健の資金が使われます', '', 'that／health money is used'),
    ],
    [
      b(
        'Care for the very old and for the very young is largely invisible',
        '高齢者と幼い子どもへのケアは／大半が〜です／目に見えない',
        '',
        'Care for the very old and for the very young／is largely／invisible',
      ),
      b('and it hardly ever appears', 'そして／それはほとんど決して／現れません', '', 'and／it hardly ever／appears'),
      b('in any official set of figures', 'どの公的な数値の一式にも'),
    ],
    [
      b(
        'It is performed at home, mostly by a woman',
        'それは／行われます／家庭で、多くは女性によって',
        '',
        'It／is performed／at home, mostly by a woman',
      ),
      b('in the family', '家族の中の'),
      b('and it never', 'そして／それは決して〜ない', '', 'and／it never'),
      b('once enters the national accounts', '一度も／入りません／国民経済計算に', '', 'once／enters／the national accounts'),
    ],
    [
      b('A policy that shifts care', '政策は／移す／ケアを', '', 'A policy that／shifts／care'),
      b('from an institution to a family has merely moved a cost rather than removed it', '施設から家庭へ、それは費用を取り除いたのではなく単に移しただけです'),
    ],
    [
      b('Counting that', 'その〜を数えることは'),
      b('work honestly', '仕事を誠実に'),
      b('even when nobody is paid', '〜でさえ／誰も報酬を得ていないときでさえ', '', 'even／when nobody is paid'),
      b('for it, changes', 'その仕事に対して、そして変えます'),
      b('which reform looks cheap and', 'どの改革が安く見え、そして'),
      b('which looks expensive', 'どの改革が／高く見えるのかを', '', 'which／looks expensive'),
    ],
    [
      b(
        'Medical technology extends the length of a life far more consistently than it manages',
        '医療技術は／延ばします／どうにかするよりはるかに一貫して人生の長さを',
        '',
        'Medical technology／extends／the length of a life far more consistently than it manages',
      ),
      b('to extend independence and comfort', '延ばすことを／自立と安楽を', '', 'to extend／independence and comfort'),
    ],
    [
      b(
        'A treatment that adds five years of life may equally add five years of dependence',
        '治療は／加える／五年の命を、そして同じだけ五年の依存を加えることもあります',
        '',
        'A treatment that／adds／five years of life may equally add five years of dependence',
      ),
      b('on someone else', '他の誰かへの'),
    ],
    [
      b(
        'Families usually discover this only',
        '家族はたいてい／知ります／このことを／ようやく',
        '',
        'Families usually／discover／this／only',
      ),
      b('after the decision has been made and can no longer easily be reversed', '決定が下され、もはや容易には覆せなくなったあとで'),
      b('at all', 'まったく'),
    ],
    [
      b('Discussing the question well in', 'その問いを十分に〜で話し合うことは'),
      b('advance is unpleasant', '前もって、それは不快です'),
      b('and it is the only point at', 'そして／それは／〜です／唯一の時点、そこで', '', 'and／it／is／the only point at'),
      b('which it can be discussed', 'そこでそれが話し合えるのです'),
      b('at all', 'そもそも'),
    ],
    [
      b(
        'Every health system in the world shares out care',
        '世界のどの医療制度も／分け与えます／ケアを',
        '',
        'Every health system in the world／shares／out care',
      ),
      b('and the honest ones state openly', 'そして／誠実な制度は率直に述べます／率直に', '', 'and／the honest ones state／openly'),
      b('how they do it', 'どのように／それをするのかを', '', 'how／they do it'),
    ],
    [
      b('Waiting lists, prices, distance', '待機名簿と価格と距離'),
      b('and rules about', 'そして／〜についての規則', '', 'and／rules about'),
      b('who qualifies are all different methods of sharing out care', '誰が／資格を持つのかの規則は、いずれもケアを分け与える異なる方法です', '', 'who／qualifies are all different methods of sharing out care'),
    ],
    [
      b('Pretending that no such choice', 'そのような選択が〜ないふりをすることは'),
      b(
        'is being made merely hides the choice rather than actually avoiding it',
        'なされていないという言い方は、単に隠すだけです／選択を、実際に避けるのではなく',
        '',
        'is being made merely hides／the choice rather than actually avoiding it',
      ),
      b('in any way', 'どのような形でも'),
    ],
    [
      b(
        'A rule that is stated openly can be argued with',
        '規則は／公然と述べられ、反論することができます／それに対して',
        '',
        'A rule that／is stated openly can be argued／with',
      ),
      b('while a rule that is never stated can only be quietly endured', '一方で決して述べられない規則には、静かに耐えるほかありません'),
    ],

    // ===== tools : 道具・ネットワーク・限界 =====
    [
      b(
        'Every new tool that a city adopts creates a new capability and a new dependence on it',
        'どの新しい道具も／都市が採用すれば／新しい能力とそれへの新しい依存を同時に生み出します',
        '',
        'Every new tool that a city／adopts／creates a new capability and a new dependence on it',
      ),
      b('at exactly the same moment', 'まさに同じ瞬間に'),
    ],
    [
      b('A payment system that works perfectly', '完璧に働く決済の仕組みは'),
      b('for many years quietly becomes infrastructure that can no longer be turned off', '何年ものあいだ、静かに、もはや止められない基盤設備になります'),
    ],
    [
      b('The dependence remains quite invisible', 'その依存は／とどまります／まったく見えないままに', '', 'The dependence／remains／quite invisible'),
      b('while the tool works and becomes total', '道具が働くあいだは、そして全面的なものになります'),
      b('on the day', 'その日に'),
      b('that it finally fails', 'その日に／それがついに／壊れます', '', 'that／it finally／fails'),
    ],
    [
      b('Planning carefully for that day', 'その日に向けて丁寧に備えることが'),
      b('is the whole difference', '〜です／違いのすべて', '', 'is／the whole difference'),
      b('between a small trouble and a complete stop', '小さな面倒と完全な停止とのあいだの'),
    ],
    [
      b(
        'Networks concentrate value at their center and concentrate most of the risk',
        'ネットワークは／集めます／価値を／中心に、そして危険の大半を集めます',
        '',
        'Networks／concentrate／value／at their center and concentrate most of the risk',
      ),
      b('at their outer edges instead', '代わりに外側の周縁に'),
    ],
    [
      b(
        'A service that absolutely everybody uses is highly efficient',
        '誰もが例外なく使う仕組みは／きわめて〜です／効率的',
        '',
        'A service that absolutely everybody uses／is highly／efficient',
      ),
      b(
        'and its failure then affects everybody',
        'そして／その故障がそのとき／及びます／全員に',
        '',
        'and／its failure then／affects／everybody',
      ),
      b('at once', '同時に'),
    ],
    [
      b('Keeping several options', '複数の選択肢を〜に保つことは'),
      b(
        'open is expensive',
        '開いたままに／〜です／高くつくこと',
        '',
        'open／is／expensive',
      ),
      b('in ordinary years and is the reason a city survives an unusual one', '平年には、そして都市が異常な年を生き延びる理由になります'),
    ],
    [
      b('Deciding how much duplication to', 'どれだけの重複を〜かを決めることは'),
      b('keep is in the end a judgment', '保つのか／〜です／結局のところ一つの判断', '', 'keep／is／in the end a judgment'),
      b('about how strange the future may turn out', '未来がどれほど奇妙になりうるかについての'),
      b('to be', 'そうなると'),
    ],
    [
      b(
        'Data that is collected for one stated purpose is almost always used later',
        'データは／集められる／一つの明示された目的のために、ほとんど常にのちに使われます',
        '',
        'Data that／is collected／for one stated purpose is almost always used later',
      ),
      b('for some quite different one', 'まったく別の目的のために'),
    ],
    [
      b('A record', 'ある／記録が', '', 'A／record'),
      b('that is kept', 'その記録は／保たれます', '', 'that／is kept'),
      b('in order', '〜のために'),
      b('to run a bus service', '運行するために／バスの便を', '', 'to run／a bus service'),
      b('can eventually answer a question', 'やがて答えうるのです／ある問いに', '', 'can eventually answer／a question'),
      b('about school attendance', '学校の出席についての'),
    ],
    [
      b('That very value is exactly', 'そのまさに価値こそが、まさに'),
      b(
        'why the limits have to be agreed',
        'なぜ／制限が／〜ねばならないのか／取り決められ',
        '',
        'why／the limits／have／to be agreed',
      ),
      b('before the data is ever gathered', 'データが集められるより前に'),
    ],
    [
      b(
        'Rules that are agreed later are always shaped',
        '規則は／取り決められます／あとから、そして常に形づくられます',
        '',
        'Rules that／are agreed／later are always shaped',
      ),
      b('by the value of the material that has already been collected', 'すでに集められた資料の価値によって'),
    ],
    [
      b(
        'Automation performs its work consistently',
        '自動化は／こなします／その仕事を一貫して',
        '',
        'Automation／performs／its work consistently',
      ),
      b('and for the same reason it fails', 'そして／同じ理由でそれは／失敗します', '', 'and／for the same reason it／fails'),
      b('in ways', 'あるやり方で'),
      b('that are equally consistent', 'そのやり方は／同じくらい〜です／一貫している', '', 'that／are equally／consistent'),
    ],
    [
      b(
        'A human error affects one case',
        '人の誤りは／及びます／一件に',
        '',
        'A human error／affects／one case',
      ),
      b('at a time', '一度に'),
      b('while a single error in the code affects every single case simultaneously', '一方で算法の中の一つの誤りは、全件に同時に及びます'),
    ],
    [
      b(
        'Scale therefore converts a small mistake into a very large one without any change at all',
        '規模は／したがって変えます／まったく何の変化もないまま小さな誤りを非常に大きな誤りへ',
        '',
        'Scale therefore／converts／a small mistake into a very large one without any change at all',
      ),
      b('in the mistake itself', 'その誤り自体には'),
    ],
    [
      b('Testing at full scale', '実規模で試験することは'),
      b('before any wide deployment is therefore not simple caution but a matter of ordinary arithmetic', '広く導入する前に、それはしたがって単なる慎重さではなく普通の算術の問題です'),
    ],
    [
      b('The strongest argument in favor of adopting a new tool is very rarely the fact', '新しい道具を採用することを支持する最も強い論拠が、その事実であることはごくまれです'),
      b(
        'that the tool is new',
        'その道具が／〜だという／新しい',
        '',
        'that the tool／is／new',
      ),
    ],
    [
      b('It is', 'それは／〜です', '', 'It／is'),
      b(
        'that the current arrangement has one specific failure',
        'すなわち現在の仕組みが／持つということ／一つの特定の欠陥を',
        '',
        'that the current arrangement／has／one specific failure',
      ),
      b('which this particular tool would', 'その欠陥にこの特定の道具が'),
      b('in fact actually address', '実のところ本当に対処するでしょう'),
    ],
    [
      b('Adopting a tool without naming that failure guarantees that nobody', 'その欠陥を名指しせずに道具を採用することは、誰も〜ないことを確実にします'),
      b('will be able', '〜できる／状態になる', '', 'will be／able'),
      b('to evaluate it properly later', '評価することが／それを／きちんとのちに', '', 'to evaluate／it／properly later'),
    ],
    [
      b('Stating the expected improvement', '述べることは／期待される／改善を', '', 'Stating the／expected／improvement'),
      b('in advance is much the cheapest form of accountability', '前もって、それは群を抜いて最も安い説明責任の形です'),
      b(
        'that is available to a public body',
        'その形は／〜です／公的機関に利用できるもの',
        '',
        'that／is／available to a public body',
      ),
    ],

    // ===== future : 見直しに開かれた未来 =====
    [
      b(
        'No plan survives an entire generation completely intact',
        'どんな計画も／越えません／一世代を丸ごと無傷では',
        '',
        'No plan／survives／an entire generation completely intact',
      ),
      b('and the genuinely useful plans are designed', 'そして／本当に役立つ／計画は設計されています', '', 'and／the genuinely useful／plans are designed'),
      b('from the start', '初めから'),
      b('to be changed', '変えられるように'),
    ],
    [
      b('The distinction that really matters here lies', 'ここで本当に重要な区別は横たわっています'),
      b('between decisions that can be reversed and decisions that cannot be reversed', '撤回できる決定と撤回できない決定とのあいだに'),
    ],
    [
      b(
        'A tax rate can be adjusted again next year',
        '税率は／調整できます／翌年また',
        '',
        'A tax rate／can be adjusted／again next year',
      ),
      b('while a building that has', '一方で建物は、それが〜した'),
      b('once been destroyed can never be restored', 'ひとたび／取り壊されたなら、決して元に戻せません', '', 'once／been destroyed can never be restored'),
    ],
    [
      b(
        'Decisions that cannot be reversed therefore deserve a much higher standard of evidence than decisions that can',
        '決定は／撤回できない、したがって値します／撤回できる決定よりずっと高い証拠の水準に',
        '',
        'Decisions that／cannot be reversed therefore deserve／a much higher standard of evidence than decisions that can',
      ),
    ],
    [
      b('Uncertainty is really an argument for keeping options open rather than an argument for doing nothing', '不確実性は実のところ、何もしないことの論拠ではなく選択肢を開いておくことの論拠です'),
      b('at all', 'まったく'),
    ],
    [
      b('Doing nothing', '何もしないことは'),
      b('is itself a decision', '〜です／それ自体が一つの決定', '', 'is／itself a decision'),
      b('and it is frequently the hardest decision of all', 'そして／それはしばしばすべての中で最も難しい決定です', '', 'and／it is frequently the hardest decision of all'),
      b('to reverse at a later date', '撤回することが／のちの日に', '', 'to reverse／at a later date'),
    ],
    [
      b('Land', '土地は'),
      b('that has been', 'その土地が／〜されてきた', '', 'that／has been'),
      b('built on cannot easily be cleared again', '建てられて／その上に、再び容易には空けられません', '', 'built／on cannot easily be cleared again'),
      b('and a species that is', 'そして／ある種が／〜である', '', 'and／a species that／is'),
      b(
        'once lost does not come back',
        'ひとたび／失われたなら／戻って／きません',
        '',
        'once／lost／does not come／back',
      ),
    ],
    [
      b(
        'Delay is therefore only prudent',
        '遅らせることは／したがってただ〜です／賢明',
        '',
        'Delay／is therefore only／prudent',
      ),
      b('in those particular cases', 'そうした特定の場合においてだけです'),
      b(
        'where the delay itself genuinely preserves the choice',
        'そこでは／その遅れ自体が本当に／保ちます／その選択を',
        '',
        'where／the delay itself genuinely／preserves／the choice',
      ),
      b('for later', 'のちのために'),
    ],
    [
      b('A clearly stated review date is much the cheapest instrument for building revision', '明確に述べられた見直しの期日は、修正を組み込むための群を抜いて安い道具です'),
      b('into almost any decision', 'ほとんどどんな決定にも'),
    ],
    [
      b(
        'It converts a permanent commitment into a temporary one without weakening its force in any way',
        'それは／変えます／その効力をいささかも弱めずに恒久的な約束を暫定的なものへ',
        '',
        'It／converts／a permanent commitment into a temporary one without weakening its force in any way',
      ),
      b('at all today', '今日まったく'),
    ],
    [
      b('Without such a date', 'そのような期日がなければ'),
      b(
        'a rule simply continues in force until someone spends real effort',
        '規則は単に／続きます／誰かが実際に労力を費やすまで効力を持ったまま',
        '',
        'a rule simply／continues／in force until someone spends real effort',
      ),
      b('on getting it removed', 'それを取り除かせることに'),
    ],
    [
      b('That asymmetry explains', 'その非対称が説明します'),
      b('why obsolete rules accumulate steadily', 'なぜ／時代遅れの規則が／着実に積み上がるのかを', '', 'why／obsolete rules／accumulate steadily'),
      b('in almost every long-lived public organization there is', '存在するほとんどすべての長く続く公的組織で'),
    ],
    [
      b('Residents', '住民は'),
      b('who will live in this city', 'その住民が／暮らすことになる／この都市に', '', 'who／will live／in this city'),
      b('in fifty years', '五十年後に'),
      b('cannot speak', '発言することができません'),
      b('at any meeting', 'どの会合でも'),
      b('that is arranged today', 'その会合は／設けられます／今日', '', 'that／is arranged／today'),
    ],
    [
      b('Any procedure that counts only the voices actually present', '実際にその場にある声だけを数えるどんな手続きも'),
      b('in the room will systematically favor the people of the present', '部屋の中の、体系的に現在の人々を優遇することになります'),
    ],
    [
      b('Some cities now appoint an officer', 'いくつかの都市はいまや／任じます／一人の職員を', '', 'Some cities now／appoint／an officer'),
      b('whose one formal task is to state the long-term case', 'その／唯一の正式な職務は長期的な立場を述べることです', '', 'whose／one formal task is to state the long-term case'),
      b('at every public meeting', 'どの公の会合でも'),
    ],
    [
      b(
        'That device is far',
        'その仕掛けは／〜です／ほど遠い',
        '',
        'That device／is／far',
      ),
      b('from perfect', '完全からは'),
      b(
        'and yet it is better than simply assuming',
        'そして／それでもそれは／よりましです／ただ想定するよりも',
        '',
        'and／yet it／is better／than simply assuming',
      ),
      b('that someone else will remember', 'すなわち／誰か他の人が／覚えているだろうと', '', 'that／someone else／will remember'),
    ],
    [
      b('A city that expects', '都市は／予期する', '', 'A city that／expects'),
      b('to be wrong about something builds in quite a different way', '〜であると／何かについて誤っていると、そしてかなり違うやり方で造ります', '', 'to be／wrong about something builds in quite a different way'),
      b('from one that expects to be right', '正しいと予期する都市とは'),
    ],
    [
      b(
        'It leaves physical space, keeps its records, states its assumptions, and schedules the exact moment of the next review',
        'それは／残します／物理的な余地を、記録を保ち、前提を述べ、次の見直しの正確な時を予定に入れます',
        '',
        'It／leaves／physical space, keeps its records, states its assumptions, and schedules the exact moment of the next review',
      ),
    ],
    [
      b(
        'None of that guarantees a good outcome, for the simple reason that no arrangement at all can ever promise one',
        'そのどれもよい結果を保証しません、どんな仕組みも／〜できない／決してそれを約束できないという単純な理由から',
        '',
        'None of that guarantees a good outcome, for the simple reason that no arrangement at all／can／ever promise one',
      ),
    ],
    [
      b('What it does guarantee is', 'それが確かに保証するのは'),
      b('that a mistake will be', 'すなわち／ある誤りが／〜だろうということです', '', 'that／a mistake／will be'),
      b(
        'found at a time',
        '見つかる／ある時点で',
        '',
        'found／at a time',
      ),
      b('when there is still time', 'まだ時間が残っているときに'),
      b('to put it right', '正すための／それを', '', 'to put／it right'),
    ],
  ]),
})
