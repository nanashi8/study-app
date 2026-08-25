// 追加長文を全文で読み、一般語義では意味がずれる箇所と、
// 一つの構文として読ませるべき箇所を本文単位で確定した訂正台帳。
// 英語は原文順のまま保ち、日本語はその場で必要な意味だけを隣接させる。

const freeze = (value) => Object.freeze(value)

const correction = (match, parts, note, occurrence = 1) => freeze({
  match: freeze(match),
  parts: freeze(parts.map((part) => freeze(part))),
  note,
  occurrence,
})

export const EXPANDED_READING_PHRASE_CORRECTIONS = freeze({
  'If it rains, we visit the science museum instead.': freeze([
    correction(['instead'], [
      {
        role: 'M',
        en: 'instead',
        ja: '代わりに（雨が降る場合は、科学博物館を訪れます）',
        conditionBinding: {
          type: 'forward-condition-closure',
          connector: 'If',
          clause: 'it rains',
          governor: 'we visit the science museum instead',
        },
      },
    ], 'Ifで保留した条件を文末で受け直し、雨天時の代替先まで含めて条件と主節を結びます。'),
  ]),
  'Last year, junior high school students decided to make a safer walking map.': freeze([
    correction(['to make'], [
      {
        role: 'V',
        en: 'to make',
        ja: '作ることに（対象は次へ）',
        infinitiveBinding: {
          type: 'verb-complement',
          governor: 'decided',
          semanticSubject: 'junior high school students',
        },
      },
    ], 'decide to do の不定詞で、作る主体は中学生です。目的語を先取りせず「作ることに」と次へつなぎます。'),
  ]),
  'They first interviewed residents about places that became dangerous during storms.': freeze([
    correction(['first interviewed'], [
      { role: 'M', en: 'first', ja: 'まず' },
      { role: 'V', en: 'interviewed', ja: '聞き取りをしました' },
    ], 'first は順序を示すM、interviewed は住民から情報を集めるVとして分け、「まず／聞き取りをしました」と読みます。'),
  ]),
  'When the first map was ready, families tested it on a rainy afternoon.': freeze([
    correction(['When the first map', 'was ready'], [
      { role: 'LINK', en: 'When', ja: '〜したとき' },
      { role: 'S', en: 'the first map', ja: '最初の地図が' },
      { role: 'V', en: 'was', ja: '〜でした（状態は次へ）' },
      {
        role: 'C',
        en: 'ready',
        ja: '完成した状態（になったとき）',
        closureBinding: {
          type: 'time-clause',
          opener: 'When',
          governor: 'families tested it on a rainy afternoon',
          clause: 'the first map was ready',
        },
      },
    ], 'When を時の節の入口として独立させ、節内のS→V→Cを順に読みます。'),
  ]),
  'They found that one sign was hidden behind a large tree.': freeze([
    correction(['was', 'hidden'], [
      { role: 'V', en: 'was hidden', ja: '隠されていました' },
    ], 'was hidden は受け身の述語を一まとまりにし、標識が見えない状態を表します。'),
  ]),
  'Families suggested marking places where people could wait safely if the rain grew stronger.': freeze([
    correction(['grew stronger'], [
      { role: 'V', en: 'grew', ja: '〜になれば（状態は次へ）' },
      {
        role: 'C',
        en: 'stronger',
        ja: 'さらに強い状態',
        conditionBinding: {
          type: 'forward-condition-closure',
          connector: 'if',
          clause: 'the rain grew stronger',
          governor: 'Families suggested marking places where people could wait safely',
        },
      },
    ], 'grow はここでは「育つ」ではなく変化を表し、stronger を補語Cに取ります。'),
  ]),
  'Local students wanted to help them explore the town without getting lost.': freeze([
    correction(['to help them'], [
      {
        role: 'V',
        en: 'to help',
        ja: '手助けしたいと（対象は次へ）',
        infinitiveBinding: {
          type: 'verb-complement',
          governor: 'wanted',
          semanticSubject: 'Local students',
        },
      },
      { role: 'O', en: 'them', ja: '旅行者を（次の explore の動作主として）' },
    ], 'to help は wanted の内容、them は help の目的語であると同時に後ろの explore の意味上の主語です。'),
    correction(['explore'], [
      { role: 'V', en: 'explore', ja: '見て回るように' },
    ], 'explore は them が行う動作で、後ろの the town を目的語に取ります。'),
  ]),
  'They decided to create a walking guide in Japanese and easy English.': freeze([
    correction(['to create'], [
      {
        role: 'V',
        en: 'to create',
        ja: '作ることに（対象は次へ）',
        infinitiveBinding: {
          type: 'verb-complement',
          governor: 'decided',
          semanticSubject: 'They',
        },
      },
    ], 'decide to do の不定詞で、作る主体はTheyです。目的語のガイドを次へ保留して読みます。'),
  ]),
  'They tested the walking times twice because busy summer streets could slow a group.': freeze([
    correction(['could', 'slow'], [
      { role: 'V', en: 'could slow', ja: '遅らせることがあるため' },
    ], 'could slow は可能性を示す助動詞と本動詞を一つの述語として読みます。'),
  ]),
  'The office kept a number that families could call in an emergency.': freeze([
    correction(['that'], [
      { role: 'O', en: 'that', ja: 'その番号に' },
    ], 'that は内容節ではなく call の目的語となる関係代名詞で、先行詞 a number を受けます。'),
  ]),
  'If an assignment was unclear, students became distracted even without a phone nearby.': freeze([
    correction(['even', 'without a phone nearby'], [
      { role: 'M', en: 'even without a phone nearby', ja: 'スマートフォンが近くになくても' },
    ], 'even without を一まとまりにし、端末がない場合にも結果が変わらないことを示します。'),
  ]),
  'The school therefore allowed teachers to approve necessary learning tools.': freeze([
    correction(['to approve'], [
      {
        role: 'V',
        en: 'to approve',
        ja: '許可できるように（対象は次へ）',
        infinitiveBinding: {
          type: 'object-to-infinitive',
          governor: 'allowed',
          semanticSubject: 'teachers',
        },
      },
    ], 'allow O to do の不定詞で、teachers が approve の意味上の主語です。許可する対象は次へ送ります。'),
  ]),
  'The survey asked whether an exchanged item replaced a planned purchase, since that choice could reduce new production.': freeze([
    correction(['could reduce'], [
      { role: 'V', en: 'could reduce', ja: '減らせます（対象と理由の完了は次へ）' },
    ], 'could reduce を目的語より前で閉じず、new production とsince理由節末の受け直しへつなぎます。'),
  ]),
  'They also ask who receives jobs, training, and affordable food from the investment.': freeze([
    correction(['receives'], [
      { role: 'V', en: 'receives', ja: '得るのか（対象は次へ）' },
    ], 'who節の述語を目的語より前で閉じず、得る内容を次へ保留します。'),
  ]),
  'In practice, decisions are also shaped by which option appears first, which action requires effort, and what happens when someone does nothing.': freeze([
    correction(['by', 'which option'], [
      { role: 'LINK', en: 'by which option', ja: 'どの選択肢が（判断を左右する基準として）' },
    ], 'by は後続する三つの間接疑問全体を支配し、which option が一つ目の判断基準を導きます。'),
  ]),
  'These features form a choice architecture: the environment within which people decide.': freeze([
    correction(['within', 'which'], [
      { role: 'LINK', en: 'within which', ja: 'その中で' },
    ], 'within which は前置詞＋関係代名詞で、先行詞the environmentを受け「その環境の中で」と読みます。'),
  ]),
  'People often describe choice as if it begins only when a person consciously compares several options.': freeze([
    correction(['as'], [
      { role: 'LINK', en: 'as', ja: 'まるで（ifと一組で）' },
    ], 'as は単独の目的格補語Cではありません。直後のifと一組でas ifを作り、describeの様子を示す副詞節Mを導きます。'),
    correction(['if'], [
      { role: 'LINK', en: 'if', ja: '〜かのように（節の中身は次へ）' },
    ], 'このifは独立した条件節の入口ではなく、直前のasと一組の接続表現as ifです。'),
    correction(['begins only'], [
      { role: 'V', en: 'begins', ja: '始まります' },
      {
        role: 'M',
        en: 'only',
        ja: '〜のときだけ（時の節は次へ）',
        focusBinding: {
          type: 'focus-clause',
          marker: 'only',
          target: 'when a person consciously compares several options',
          governor: 'begins',
        },
      },
    ], 'beginsだけが述語Vです。onlyは直後のwhen節全体に焦点を当て、始まる時を「そのときだけ」に限定するMです。'),
    correction(['several options'], [
      {
        role: 'O',
        en: 'several options',
        ja: '複数の選択肢を（人が意識的に比較するときだけ、選択が始まるかのように）',
        conditionBinding: {
          type: 'forward-condition-closure',
          connector: 'as if / when',
          clause: 'it begins only when a person consciously compares several options',
          governor: 'People often describe choice',
        },
      },
    ], 'as ifの仮想とwhenの時条件を文末でまとめて受け直し、主節describeへ戻します。'),
  ]),
  'Architecture is not merely a metaphor, because every digital screen, form, cafeteria, and public procedure must arrange alternatives somehow.': freeze([
    correction(['must arrange'], [
      { role: 'V', en: 'must arrange', ja: '配置しなければなりません（対象と理由の完了は次へ）' },
    ], 'must arrange を目的語より前で理由まで閉じず、alternativesとbecause節末へつなぎます。'),
  ]),
  'Public explanation should describe not only what the system does but why that architecture was chosen over plausible alternatives.': freeze([
    correction(['was chosen'], [
      { role: 'V', en: 'was chosen', ja: '選ばれました（比較先は次へ）' },
    ], 'why節の受動態を比較先over plausible alternativesより前で閉じず、比較先を次へ保留します。'),
  ]),
  'A scheduled review can also reveal whether people have learned to avoid or exploit the original design.': freeze([
    correction(['or exploit'], [
      {
        role: 'V',
        en: 'or exploit',
        ja: 'または逆に利用する（対象は次へ）',
        infinitiveBinding: {
          type: 'parallel-infinitive',
          governor: 'have learned / to avoid',
          semanticSubject: 'people',
        },
      },
    ], 'or exploit はto avoidとtoを共有する並列不定詞です。構造上は「to avoid or (to) exploit」と読みます。'),
  ]),
  'Public reports allow residents to see whether promised improvements actually occur.': freeze([
    correction(['allow', 'residents', 'to see'], [
      { role: 'V', en: 'allow residents to see', ja: '住民が確かめられるようにします' },
    ], 'allow O to do を一まとまりにし、住民が確認できるという関係を前から示します。'),
  ]),
  'They understood the English but sometimes missed a turn shown only by a street name.': freeze([
    correction(['sometimes'], [
      { role: 'M', en: 'sometimes', ja: 'ときどき' },
    ], 'sometimes は頻度を表すため「ときどき」と取ります。'),
    correction(['shown only'], [
      {
        role: 'M',
        en: 'shown',
        ja: '示された（曲がり角を）',
        reducedRelativeBinding: {
          type: 'reduced-passive-relative',
          governor: 'a turn',
          semanticSubject: 'a turn',
        },
      },
      {
        role: 'M',
        en: 'only',
        ja: '〜だけによって（手段は次へ）',
        focusBinding: {
          type: 'focus-prepositional-phrase',
          marker: 'only',
          target: 'by a street name',
          governor: 'shown',
        },
      },
    ], 'shownはa turnを後ろから説明する省略受動のMです。onlyもMで、直後のby a street nameだけに表示手段を限定します。'),
  ]),
  'The organizers reported successful exchanges and waste they could not process; they did not publish only a cheerful total.': freeze([
    correction(['only a cheerful total'], [
      { role: 'M', en: 'only', ja: '〜だけを（対象は次へ）' },
      { role: 'O', en: 'a cheerful total', ja: '明るい合計値だけを' },
    ], 'onlyはpublishの目的語a cheerful totalだけに範囲を限定するMです。目的語Oそのものはa cheerful totalです。'),
  ]),
  'However, a policy should not protect only places where darkness can be sold as an experience.': freeze([
    correction(['should not protect only places'], [
      { role: 'V', en: 'should not protect', ja: '守るべきではありません' },
      { role: 'M', en: 'only', ja: '〜だけを（対象は次へ）' },
      { role: 'O', en: 'places', ja: '場所を' },
    ], 'should not protectが述語V、placesが目的語Oです。onlyはplacesだけに保護対象を限定するMで、Vの一部ではありません。'),
  ]),
  'Collecting such data creates its own privacy risks, so evaluation must use only what is necessary and protect it carefully.': freeze([
    correction(['must use only'], [
      { role: 'V', en: 'must use', ja: '使わなければなりません（対象は次へ）' },
      { role: 'M', en: 'only', ja: '必要なものだけを' },
    ], 'must useが述語Vです。onlyは後ろのwhat is necessary全体だけに利用範囲を限定するMです。'),
  ]),
  'Scheduled reviews also make failure informative rather than allowing an ineffective design to survive through habit.': freeze([
    correction(['informative'], [
      { role: 'C', en: 'informative', ja: '役立つ情報に' },
    ], 'make O C の informative は failure の結果状態を表す補語Cとして読みます。'),
  ]),
})
