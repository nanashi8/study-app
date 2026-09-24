// 単元別の並び替え・語法：英検1級（全12単元）。参考書の各ページで学ぶ形をそのまま問う。
import { unitFormats } from './build.js'

export const GRAMMAR_UNIT_FORMATS_1 = unitFormats('1', [
  {
    unit: 'gref_1_tense',
    order: [
      ['未来完了は will have＋過去分詞', 'By next autumn, the team will have completed the survey.', '来年の秋までに、チームは調査を終えているでしょう。', '未来のある時点までに終わることを表すので will have＋過去分詞にする。基準の時は by 〜 で示す。'],
      ['未来完了進行形は will have been＋動詞ing', 'By June, she will have been serving for ten years.', '6月で、彼女は10年間務めていることになります。', '未来の基準まで続いている活動を表すので will have been＋動詞ing にする。'],
      ['This is the first time＋現在完了', 'This is the first time the plan has been discussed openly.', 'その計画が公に話し合われたのは、これが初めてです。', 'This is the first time のあとは現在完了にして、今までの経験とのつながりを表す。'],
    ],
    usage: [
      ['This is the first time のあとは現在完了', 'This is the first time I ___ this city.', ['have visited', 'visit', 'visited', 'am visiting'], 'have visited', '私がこの都市を訪れたのは、これが初めてです。', 'This is the first time のあとは、今までの経験とのつながりを表す現在完了 have visited にする。', [
        'This is the first time のあとは現在完了にして、今までの経験を表す。',
        'visit と現在形にすると、これまでの経験とのつながりを表せない。',
        'visited は過去のある時点のことを表すだけで、この形には合わない。',
        'am visiting は今まさにしていることを表し、経験の回数を表せない。',
      ]],
      ['未来の基準までの継続', 'By April, she ___ on the board for eight years.', ['will have been serving', 'will be serving', 'has been serving', 'is serving'], 'will have been serving', '4月で、彼女は8年間理事を務めていることになります。', '未来の基準までの続きを表すので will have been serving とする。will be＋ing では続いた長さを表せない。', [
        '未来の基準 by April までの続きなので will have been serving にする。',
        'will be serving はその時点でしている最中であることを表すだけで、8年の積み重ねを表せない。',
        'has been serving は今までの続きで、未来の基準には合わない。',
        'is serving は今の様子を表し、未来の基準には合わない。',
      ]],
      ['完了形は基準とのつながりを表す', 'Researchers ___ the issue for decades, but no consensus has emerged.', ['have studied', 'studied', 'study', 'are studying'], 'have studied', '研究者たちは何十年もその問題を研究してきましたが、意見の一致は生まれていません。', '今までの積み重ねを表すので現在完了 have studied にする。過去形では今とのつながりが切れてしまう。', [
        'for decades と今までの積み重ねを表すので、現在完了 have studied にする。',
        'studied は過去のある時期のことだけを表し、今とのつながりを表せない。',
        'study は今の習慣を表すだけで、何十年の積み重ねを表せない。',
        'are studying は今まさにしていることを表し、積み重ねを表せない。',
      ]],
    ],
  },
  {
    unit: 'gref_1_hedging',
    order: [
      ['cannot have＋過去分詞で強く打ち消す', 'She cannot have overlooked such an obvious error.', '彼女がそんな明らかな誤りを見落としたはずがありません。', 'cannot have＋過去分詞で「〜したはずがない」と、過去のことを強く打ち消す。'],
      ['may で控えめに述べる', 'The pattern may reflect differences in access to education.', 'その傾向は教育を受ける機会の差を反映している可能性があります。', 'may＋原形で「〜かもしれない」と、断定を避けた控えめな言い方にする。'],
      ['tend to で傾向を述べる', 'People tend to value information that confirms their beliefs.', '人は自分の信念を裏づける情報を重んじる傾向があります。', 'tend to＋原形で「〜する傾向がある」と、一般的な傾向を控えめに述べる。'],
    ],
    usage: [
      ['may well have＋過去分詞', 'Given the noise, he may well ___ missed the announcement.', ['have', 'has', 'had', 'having'], 'have', 'さわがしかったことを考えると、彼が知らせを聞き逃したのももっともです。', 'may well have＋過去分詞で「〜したのももっともだ」を表す。助動詞のあとは原形 have にする。', [
        '助動詞 may のあとは原形 have を置き、may well have＋過去分詞とする。',
        'may has という形はない。助動詞のあとは原形にする。',
        'may had という形もない。助動詞のあとは原形にする。',
        'may having という形もない。',
      ]],
      ['need not have＋過去分詞', 'The letter ___ have been so long; a note would have sufficed.', ['need not', 'must not', 'cannot', 'should'], 'need not', 'その手紙はあれほど長くする必要はなかったのに。短いメモで十分でした。', 'need not have＋過去分詞で「〜する必要はなかったのに（してしまった）」を表す。', [
        'need not have＋過去分詞で「〜する必要はなかったのに」を表す。',
        'must not have been という言い方はふつうしない。禁止は must not＋原形で表す。',
        'cannot have been so long は「長かったはずがない」となり、後ろの文と合わない。',
        'should have been so long では「長くすべきだった」となり、意味が逆になる。',
      ]],
      ['控えめに述べる suggest', 'The findings ___ that the policy may reduce inequality.', ['suggest', 'prove', 'insist', 'declare'], 'suggest', 'その調査結果は、その政策が不平等を減らす可能性を示唆しています。', 'suggest は「〜を示唆する」と、断定を避けて述べるときに使う。証拠が十分なら prove を使う。', [
        'suggest は断定を避けて「〜を示唆する」と述べるときに使う。',
        'prove は「証明する」で、may とつり合わないほど強い言い方になる。',
        'insist は人が強く主張することを表し、調査結果を主語にするには合わない。',
        'declare も人が公に宣言することを表し、調査結果には合わない。',
      ]],
    ],
  },
  {
    unit: 'gref_1_subjunctive',
    order: [
      ['要求の that 節は原形', 'He demanded that the rule be changed at once.', '彼はその規則をただちに変えるよう要求しました。', 'demand の that 節の中は、主語に関係なく動詞を原形にする。受け身なら be＋過去分詞。'],
      ['「〜がなかったら」は Had it not been for', 'Had it not been for her warning, we would have continued.', '彼女の警告がなかったら、私たちは続けていたでしょう。', 'If it had not been for 〜 の if を省くと、Had を先頭に出した語順になる。'],
    ],
    usage: [
      ['It is essential that の中は原形', 'It is essential that every student ___ present at the ceremony.', ['be', 'is', 'was', 'being'], 'be', 'すべての生徒が式典に出席していることが不可欠です。', 'It is essential / vital that 〜 の that 節の中は、主語に関係なく動詞を原形にして be とする。', [
        '必要性を述べる that 節の中は原形なので be を置く。',
        'is とすると事実を述べる形になり、必要性を述べるこの言い方に合わない。',
        'was は過去の事実を述べる形で、これから求めることを表さない。',
        'being では that 節の動詞にならない。',
      ]],
      ['Were I to do の倒置', '___ I to start over, I would choose another field.', ['Were', 'Was', 'If', 'Had'], 'Were', '一からやり直すとしたら、私は別の分野を選ぶでしょう。', 'If I were to do 〜 の if を省くと Were を先頭に出した語順になる。Was にはしない。', [
        'If I were to start 〜 の if を省くと、Were を先頭に出す。',
        'Was は仮定法では使わない。主語が何でも were にする。',
        'If を置くなら If I were to start 〜 と were が必要になる。',
        'Had I to start という形ではこの仮定を表せない。',
      ]],
      ['It is high time＋過去形', 'It is high time the old rule ___ reconsidered.', ['was', 'is', 'will be', 'be'], 'was', 'その古い規則はそろそろ見直されてよいころです。', 'It is high time のあとは、今のことでも過去形 was にして「もう〜してよいころだ」を表す。', [
        'It is high time のあとは過去形にするので was を置く。',
        'is とすると、この決まった言い方にならない。',
        'will be もこの決まった言い方には合わない。',
        'be と原形にするのは要求・提案の that 節で、この形ではない。',
      ]],
    ],
  },
  {
    unit: 'gref_1_optative',
    order: [
      ['May＋主語＋原形', 'May all your efforts be rewarded!', 'あなたの努力がすべて報われますように。', '願いを表す文は May＋主語＋動詞の原形の語順にする。疑問文とは語順が同じでも意味がちがう。'],
      ['「〜しませんように」は Heaven forbid that', 'Heaven forbid that such an accident should occur again.', 'そのような事故が二度と起こりませんように。', 'Heaven forbid that 〜 は原形 forbid で始まる決まった祈願文。that 節の中には should を置くことが多い。'],
      ['May＋主語＋原形で祝う', 'May the new year bring you happiness!', '新しい年があなたに幸せをもたらしますように。', 'May で始める祈願文。主語のあとの動詞は原形 bring のまま置く。'],
    ],
    usage: [
      ['祈願の May は文の先頭', '___ you both be happy together!', ['May', 'Can', 'Will', 'Do'], 'May', 'お二人がともに幸せでありますように。', '願いを表す祈願文は May＋主語＋原形の形にする。can や will ではこの意味にならない。', [
        'May＋主語＋原形で「〜しますように」と願いを表す。',
        'Can you both be happy? は「幸せでいられますか」とたずねる文になる。',
        'Will you both be happy? も願いではなく、たずねる文になる。',
        'Do you both be happy という形はない。',
      ]],
      ['Long live は原形のまま', 'Long ___ the queen!', ['live', 'lives', 'lived', 'living'], 'live', '女王万歳。', 'Long live 〜! は May を省いた祈願文なので、動詞は原形 live のまま置く。s は付けない。', [
        'May を省いた祈願文なので、動詞は原形 live のままにする。',
        'lives と s を付けると、ふつうの現在の文になってしまう。',
        'lived は過去形で、願いを表す形にならない。',
        'living は ing 形で、文の動詞にならない。',
      ]],
      ['God bless も原形', 'God ___ you and your family!', ['bless', 'blesses', 'blessed', 'blessing'], 'bless', 'あなたとご家族に神の祝福がありますように。', 'God bless 〜! も May を省いた祈願文なので、動詞は原形のまま置く。', [
        'May God bless 〜 の May を省いた形なので、原形 bless のままにする。',
        'blesses と s を付けると、ふつうの現在の文になってしまう。',
        'blessed は過去形・過去分詞で、祈願文の形にならない。',
        'blessing は ing 形で、文の動詞にならない。',
      ]],
    ],
  },
  {
    unit: 'gref_1_inversion',
    order: [
      ['Not until＋助動詞＋主語', 'Not until the storm passed did the ferry leave.', '嵐が去って初めて、船は港を出ました。', 'Not until 〜 を先頭に出すと、主節が〈did＋主語＋動詞の原形〉の語順になる。'],
      ['On no account＋助動詞＋主語', 'On no account should these files be copied.', 'これらのファイルを複写することは決して許されません。', 'On no account という強い否定の語句を先頭に出すと、後ろが〈助動詞＋主語＋動詞〉の語順になる。'],
    ],
    usage: [
      ['Only when のあとの主節が倒置', 'Only when the report arrived ___ the problem become clear.', ['did', 'was', 'had', 'has'], 'did', '報告書が届いて初めて、その問題がはっきりしました。', 'Only＋語句を先頭に出すと、倒置が起こるのは後ろの主節で、did＋主語＋動詞の原形 になる。', [
        '主節を〈did＋主語＋動詞の原形〉にするので did を置く。',
        'was のあとに動詞の原形 become は続けられない。',
        'had のあとには過去分詞が必要で、原形 become は続けられない。',
        'has のあとにも過去分詞が必要で、原形 become は続けられない。',
      ]],
      ['So＋形容詞を前に出す倒置', 'So strange ___ the rumor that nobody believed it.', ['was', 'it was', 'did', 'had'], 'was', 'そのうわさはあまりに奇妙だったので、だれも信じませんでした。', 'So＋形容詞を先頭に出すと、後ろが〈be動詞＋主語〉の語順になり was the rumor とする。', [
        'So strange を前に出したので、was the rumor と倒置させる。',
        'So strange it was 〜 では倒置していない。',
        'did のあとに the rumor that 〜 を続けても、形が整わない。',
        'had のあとには過去分詞が必要で、この形には合わない。',
      ]],
      ['Not only を前に出す倒置', 'Not only ___ the plan fail, but it also wasted time.', ['did', 'was', 'has', 'is'], 'did', 'その計画は失敗しただけでなく、時間もむだにしました。', 'Not only を先頭に出すと、後ろが〈did＋主語＋動詞の原形〉の語順になる。', [
        '一般動詞の過去の文なので、did the plan fail と倒置させる。',
        'was のあとに動詞の原形 fail は続けられない。',
        'has のあとには過去分詞が必要で、原形 fail は続けられない。',
        'is のあとにも動詞の原形 fail は続けられない。',
      ]],
    ],
  },
  {
    unit: 'gref_1_emphasis',
    order: [
      ['What S V is 〜 で焦点を後ろに', 'What the committee objects to is the lack of evidence.', '委員会が反対しているのは、証拠がないことです。', 'What で始まる主語のまとまりを作り、is のあとに伝えたい焦点を置く。'],
      ['It is 〜 that … で焦点を前に', 'It was the sudden price rise that provoked public anger.', '人々の怒りを招いたのは、急な値上げでした。', '強めたい語句を It was と that の間にはさみ、残りの文を that の後ろに置く。'],
    ],
    usage: [
      ['焦点を後ろに置くのは What', '___ the committee needs is more evidence.', ['What', 'That', 'Which', 'It'], 'What', '委員会が必要としているのは、より多くの証拠です。', 'needs の目的語が欠けているので、先行詞をふくむ What を使って主語のまとまりを作る。', [
        'needs の目的語が欠けているので、先行詞をふくむ What を使う。',
        'That the committee needs 〜 では needs の目的語が足りず、文として成り立たない。',
        'Which は前に先行詞が必要で、文の先頭には置けない。',
        'It needs is 〜 という形にはならない。',
      ]],
      ['強調構文を受けるのは that', 'It was the missing receipt ___ caused all the trouble.', ['that', 'what', 'which one', 'when'], 'that', 'すべての面倒を引き起こしたのは、なくなった領収書でした。', '強調構文は It is / was 〜 that … の形で決まっている。what では受けられない。', [
        '強調構文なので、強めた語句を that で受ける。',
        'what は先行詞をふくむ語で、前に the missing receipt があるこの文には置けない。',
        'which one は「どちらか」を表し、この形には入らない。',
        'when は時を説明する語で、強調構文の that の代わりにはならない。',
      ]],
      ['名詞を強めるのは the very', 'That is the ___ thing I wanted to ask about.', ['very', 'much', 'more', 'own'], 'very', 'それこそ、私が聞きたかったことです。', 'the very＋名詞で「まさにその〜」と名詞そのものを強める。', [
        'the very＋名詞で「まさにその〜」と名詞を強める。',
        'the much thing という言い方はない。much は量を表す語。',
        'the more thing という言い方もない。more は比較級を作る語。',
        'the own thing という言い方はしない。own は my own のように所有格と組にする。',
      ]],
    ],
  },
  {
    unit: 'gref_1_relapp',
    order: [
      ['「どの程度〜か」は the extent to which', 'The extent to which the budget was cut remains unclear.', '予算がどの程度削られたのかは、はっきりしないままです。', 'the extent to which＋〈主語＋動詞〉で「どの程度〜か」という主語のまとまりを作る。'],
      ['数量＋of which', 'He has written four books, two of which became bestsellers.', '彼は4冊の本を書き、そのうち2冊はベストセラーになりました。', 'of の後ろで物を受けるので which を使う。them では2つの文をつなげない。'],
      ['前の文全体を受ける , which', 'The trial was postponed, which surprised the participants.', '裁判は延期され、そのことが関係者を驚かせました。', 'コンマ＋which は、前の文全体を受けて「そのことが〜」と続ける働きをする。'],
    ],
    usage: [
      ['前置詞のあとは which', 'The extent to ___ the rule was applied remains unclear.', ['which', 'that', 'what', 'where'], 'which', 'その規則がどの程度適用されたのかは、はっきりしないままです。', '前置詞 to のすぐ後ろには that を置けない。物を受けるので which を使う。', [
        '前置詞 to の後ろなので which を使い、the extent to which 〜 とする。',
        '前置詞のすぐ後ろに that は置けない。',
        'what は先行詞をふくむ語なので、the extent のあとには置けない。',
        'where は場所を説明する語で、前置詞の後ろには置けない。',
      ]],
      ['them ではなく which', 'The report lists ten risks, several of ___ are avoidable.', ['which', 'them', 'that', 'what'], 'which', 'その報告書は10の危険を挙げており、そのうちいくつかは避けられます。', 'コンマだけで文を2つつなぐことはできないので、them ではなく which を使う。', [
        'of の後ろで物を受けるので which を使い、1つの文の中でつなぐ。',
        'them を使うと、つなぐ語のないまま文が2つ並んでしまう。',
        '前置詞 of の後ろに that は置けない。',
        'what は先行詞をふくむ語で、この形には入らない。',
      ]],
      ['what little＋名詞', 'What ___ money remained was spent on repairs.', ['little', 'few', 'small', 'less'], 'little', 'わずかに残っていたお金は、すべて修理に使われました。', 'what little＋数えられない名詞で「わずかながらあるすべての〜」を表す。', [
        'money は数えられない名詞なので、what little money とする。',
        'few は数えられる名詞に使う語で、money には合わない。',
        'what small money という言い方はしない。',
        'less は比較級で、この決まった言い方には入らない。',
      ]],
    ],
  },
  {
    unit: 'gref_1_comparison',
    order: [
      ['all the＋比較級＋because 〜', 'The delay is all the more serious because patients are waiting.', '患者が待っているので、その遅れはなおさら深刻です。', 'all the＋比較級＋because 〜 で「〜なのでなおさら…」を表す。'],
      ['none the less＋形容詞＋for 〜', 'Her report was none the less valuable for being short.', '彼女の報告は短かったからといって、少しも価値が劣りませんでした。', 'none the less＋形容詞＋for 〜 で「〜だからといって少しも…でないわけではない」を表す。'],
      ['「〜より優れている」は superior to', 'This engine is superior to the previous model in speed.', 'このエンジンは速さで前の型より優れています。', 'superior は比べる相手を than ではなく to で示す。この形の語には inferior・senior・prior などがある。'],
    ],
    usage: [
      ['superior は than ではなく to', 'This approach is superior ___ the previous one in accuracy.', ['to', 'than', 'from', 'over'], 'to', 'この方法は正確さで前の方法より優れています。', 'superior・inferior・senior・junior・prior は、比べる相手を to で示す。than は使わない。', [
        'superior は比べる相手を to で示す。superior to 〜 の形で覚える。',
        'superior than という言い方はしない。than は比較級と組にする語。',
        'superior from という結び付きはない。',
        'superior over という結び付きもない。',
      ]],
      ['all the＋比較級', 'The loss is all the ___ painful because it was avoidable.', ['more', 'most', 'much', 'very'], 'more', '避けられたことなので、その損失はなおさらつらいものです。', 'all the＋比較級＋because 〜 の形なので、painful の比較級を作る more を置く。', [
        'all the more painful で「なおさらつらい」を表す。比較級を使う。',
        'all the most painful という言い方はしない。最上級は使わない。',
        'all the much painful という言い方もない。',
        'all the very painful という言い方もない。',
      ]],
      ['打ち消しをそろえる no more A than B', 'There is no ___ reason to trust this source than that one.', ['more', 'less', 'better', 'further'], 'more', 'あの情報源を信じる理由がないのと同じで、この情報源を信じる理由もありません。', 'no more A than B で「BがAでないのと同じく、AもそうではないB」と強く打ち消す。', [
        'no more 〜 than … で、than の後ろと同じように打ち消す。',
        'no less 〜 than … は「…に劣らず〜だ」と、どちらもそうであることを表す。',
        'no better than 〜 は「〜も同然だ」という別の意味になる。',
        'no further than 〜 は距離や範囲を表し、この形には合わない。',
      ]],
    ],
  },
  {
    unit: 'gref_1_agreement',
    order: [
      ['neither A nor B は B に合わせる', 'Neither the teacher nor the students were ready to leave.', '先生も生徒たちも帰る用意ができていませんでした。', 'neither A nor B が主語のときは、動詞を近いほうの B（the students）に合わせる。'],
      ['more than one＋単数名詞は単数扱い', 'More than one applicant has withdrawn from the selection.', '選考から辞退した応募者は1人ではありません。', 'more than one＋単数名詞は、意味は複数でも形の上では単数として扱う。'],
      ['many a＋単数名詞も単数扱い', 'Many a young writer has struggled before finding success.', '多くの若い作家が、成功する前に苦労してきました。', 'many a＋単数名詞は「多くの〜」を表すが、動詞は単数に合わせる。'],
    ],
    usage: [
      ['a number of は複数扱い', 'A number of objections ___ been raised at the meeting.', ['have', 'has', 'is', 'was'], 'have', '会議では多くの反対意見が出されました。', 'a number of＋複数名詞は「多くの〜」で複数扱いなので have にする。the number of との違いに気をつける。', [
        'a number of objections は「多くの反対意見」で複数なので have を使う。',
        'has は単数の主語に使う形。the number of 〜 なら has になる。',
        'is は単数の主語に使う形で、複数の objections には合わない。',
        'was も単数の主語に使う形で、ここでは合わない。',
      ]],
      ['the number of は単数扱い', 'The number of complaints ___ declined this year.', ['has', 'have', 'are', 'were'], 'has', '苦情の数は今年減りました。', 'the number of＋複数名詞は「〜の数」という1つのまとまりなので、動詞は単数に合わせて has にする。', [
        'the number of 〜 は「〜の数」で1つのまとまりなので has を使う。',
        'have は複数の主語に使う形。a number of 〜 なら have になる。',
        'are は複数の主語に使う形で、the number には合わない。',
        'were も複数の主語に使う形で、ここでは合わない。',
      ]],
      ['There 構文は後ろの名詞に合わせる', 'There ___ several questions still to be answered.', ['remain', 'remains', 'is', 'was'], 'remain', 'まだ答えるべき質問がいくつか残っています。', 'There＋動詞の文では、動詞を後ろに来る名詞に合わせる。several questions は複数なので remain にする。', [
        '後ろの several questions が複数なので、動詞も複数に合わせて remain にする。',
        'remains は単数の主語に使う形で、複数の questions には合わない。',
        'is も単数の主語に使う形で、複数の questions には合わない。',
        'was も単数の主語に使う形で、ここでは合わない。',
      ]],
    ],
  },
  {
    unit: 'gref_1_determiners',
    order: [
      ['each of＋複数名詞は単数扱い', 'Each of the proposals has a clear weakness.', 'どの提案にもはっきりした弱点があります。', 'each of＋複数名詞は「それぞれ1つずつ」を指すので、動詞は単数に合わせる。'],
      ['few, if any, を挟む', 'Few, if any, readers noticed the small change.', 'その小さな変更に気づいた読者は、いたとしてもごくわずかでした。', 'few, if any, をコンマではさんで名詞の前に置き、「いたとしてもごくわずか」を表す。'],
      ['both は複数扱い', 'Both approaches have advantages, but neither is sufficient alone.', 'どちらの方法にも利点がありますが、どちらも単独では十分ではありません。', 'both＋複数名詞は複数扱いで have、neither は1つずつを指すので単数扱いで is になる。'],
    ],
    usage: [
      ['all the＋名詞の語順', '___ the students agreed with the new schedule.', ['All', 'The all', 'All of', 'Every'], 'All', 'すべての生徒が新しい予定に賛成しました。', 'all は the の前に置いて all the＋名詞の語順にする。the all という語順にはしない。', [
        'all は the の前に置くので、All the students という語順になる。',
        'The all students という語順にはしない。',
        'All of のあとは the students と続けるので、of だけでは形が整わない。',
        'Every のあとは単数名詞なので、複数の students には合わない。',
      ]],
      ['each of のあとは単数動詞', 'Each of the options ___ a serious drawback.', ['has', 'have', 'are having', 'were'], 'has', 'どの選択肢にも深刻な欠点があります。', 'each of＋複数名詞は1つずつを指すので、動詞は単数に合わせて has にする。', [
        'Each of 〜 は1つずつを指すので、動詞は単数の has にする。',
        'have は of the options に引きずられた形で、主語の each とは合わない。',
        'are having も複数の形で、each には合わない。',
        'were も複数の形で、each には合わない。',
      ]],
      ['seldom, if ever の倒置', 'Seldom, if ever, ___ a single rule fit every case.', ['does', 'do', 'is', 'has'], 'does', '1つの規則がすべての場合に当てはまることは、あるとしてもめったにありません。', 'Seldom という否定の語句を先頭に出したので、後ろが〈does＋主語＋動詞の原形〉になる。', [
        '主語 a single rule は単数なので、does を置いて倒置させる。',
        'do は複数の主語に使う形で、a single rule には合わない。',
        'is のあとに動詞の原形 fit は続けられない。',
        'has のあとには過去分詞が必要で、原形 fit は続けられない。',
      ]],
    ],
  },
  {
    unit: 'gref_1_ellipsis',
    order: [
      ['one で名詞を受ける', 'This dictionary is more useful than the old one.', 'この辞書は古い辞書より役に立ちます。', 'くり返しを避けるため、同じ種類の名詞を one で受ける。it では別の物を指してしまう。'],
      ['do so で動作を受ける', 'She agreed to call the office but forgot to do so.', '彼女は事務所に電話すると約束しましたが、忘れてしまいました。', '前に出た動作をくり返すかわりに do so を置く。do such とは言わない。'],
    ],
    usage: [
      ['比べる名詞は that / those', 'The population of this city is larger than ___ of the capital.', ['that', 'it', 'one', 'those'], 'that', 'この都市の人口は首都の人口より多いです。', '比べる相手の名詞をくり返すかわりに that を置く。population は単数なので that を使う。', [
        'population は数えられない名詞として単数で受けるので that を使う。',
        'it は前に出た物そのものを指し、比べる相手を表せない。',
        'one は数えられる名詞を受ける語で、population には使わない。',
        'those は複数の名詞を受ける形で、単数の population には合わない。',
      ]],
      ['副詞節の主語＋be動詞を省く', 'If ___, the new rule will take effect in April.', ['accepted', 'accept', 'accepting', 'it accept'], 'accepted', '受け入れられれば、その新しい規則は4月に実施されます。', 'If it is accepted の〈主語＋be動詞〉を省いた形。修正案は「受け入れられる」側なので過去分詞にする。', [
        'If it is accepted の〈主語＋be動詞〉を省くので、過去分詞 accepted を置く。規則は受け入れられる側。',
        'accept と原形にすると、省略した形として成り立たない。',
        'accepting では規則が受け入れる側になってしまう。',
        'it accept では動詞の形が合わない。',
      ]],
      ['並べる要素の形をそろえる', 'The program aims to reduce costs, improve access, and ___ privacy.', ['protect', 'protecting', 'protection', 'protects'], 'protect', 'その計画は費用を減らし、利用しやすくし、個人情報を守ることを目指しています。', 'to のあとに並べる動詞は、同じ原形の形にそろえて protect とする。名詞や ing 形を混ぜない。', [
        'reduce・improve と同じ原形にそろえるので protect を置く。',
        'protecting では前の2つと形がそろわない。',
        'protection は名詞で、前に並べた動詞と形がそろわない。',
        'protects は3人称単数のときの現在形で、to のあとには置けない。',
      ]],
    ],
  },
  {
    unit: 'gref_1_usage',
    order: [
      ['lest＋主語＋原形', 'She wrote clearly lest her note be misread.', 'メモを読みちがえられないように、彼女ははっきり書きました。', 'lest＋主語＋(should)＋原形で「〜しないように」を表す。lest 自体が打ち消しをふくむ。'],
      ['Notwithstanding＋名詞', 'Notwithstanding the delays, the team finished the project.', '遅れがあったにもかかわらず、チームはその事業を終えました。', 'notwithstanding は前置詞なので、後ろに名詞のまとまりを置く。文を続けるときは although を使う。'],
    ],
    usage: [],
  },
])
