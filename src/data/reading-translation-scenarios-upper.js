// 2級・準1級長文の講師監修・語順訳シナリオ。

const b = (en, ja, tip = '') => Object.freeze({ en, ja, tip })
const passage = (sentences) => Object.freeze(sentences.map((sentence) => Object.freeze(sentence)))

export const UPPER_READING_TRANSLATION_SCENARIOS = Object.freeze({
  p_2_quiet_technology: passage([
    [
      b('When people discuss technology', '人々がテクノロジーについて話すとき'),
      b('they often imagine large machines, bright screens', '人々は、大きな機械や明るい画面を思い浮かべることが多いです'),
      b('or dramatic changes', 'あるいは、劇的な変化を'),
      b('in daily life', '日常生活における'),
    ],
    [
      b('In recent years', '近年では'),
      b('however, some of the most useful technologies have been designed', 'しかし、最も役立つ技術のいくつかは設計されてきました'),
      b('to be almost invisible', 'ほとんど目立たないように'),
    ],
    [
      b('For example', '例えば'),
      b('several train stations have introduced sensors', 'いくつかの駅はセンサーを導入しています'),
      b('that measure', 'そのセンサーが測ります'),
      b('how crowded each platform is', 'それぞれのホームがどのくらい混雑しているのかを'),
    ],
    [
      b('The information is sent to signs and phone apps', 'その情報は表示板やスマートフォンのアプリへ送られます'),
      b('so passengers can choose a less crowded area', 'そのため、乗客はより空いている場所を選べます'),
      b('before the train arrives', '電車が到着する前に'),
    ],
    [
      b('The system does not tell people what to do', 'その仕組みは、人々に何をすべきかを命令しません'),
      b('but it gives them a better source of information', 'その代わりに、人々へよりよい情報源を与えます'),
    ],
    [
      b('This small difference can reduce stress, especially for elderly passengers or parents traveling', 'この小さな違いはストレスを減らせます、特に高齢の乗客や移動中の親にとって'),
      b('with children', '子どもを連れて'),
    ],
    [
      b('Another example can be found', '別の例は見つけられます'),
      b('in public libraries', '公共図書館で'),
    ],
    [
      b('Some libraries now use quiet air-control systems', '現在、一部の図書館は静かな空調システムを使っています'),
      b('that keep rooms comfortable while using less energy than older equipment', 'そのシステムは、古い設備より少ないエネルギーを使いながら、部屋を快適に保ちます'),
    ],
    [
      b('Visitors may not notice the system', '来館者はそのシステムに気づかないかもしれません'),
      b('at all', 'まったく'),
      b('yet it affects', 'それでも、そのシステムは影響を与えます'),
      b('how long they can read or study', '来館者がどのくらい長く読書や勉強を続けられるかに'),
      b('without becoming tired', '疲れることなく'),
    ],
    [
      b('These cases suggest', 'こうした例は示しています'),
      b('that successful technology is not always the technology', '成功した技術が、必ずしもそのような技術ではないということを'),
      b('that attracts the most attention', '最も多くの注目を集める'),
    ],
    [
      b('Cost is still an important factor', '費用は依然として重要な要因です'),
      b('and cities must consider', 'そして、都市は考えなければなりません'),
      b('whether new systems can be maintained', '新しいシステムを維持できるかどうかを'),
      b('for many years', '何年にもわたって'),
    ],
    [
      b('Privacy is another concern', 'プライバシーはもう一つの懸念です'),
      b('because sensors can collect data', 'なぜなら、センサーはデータを集めることができるからです'),
      b('about public behavior', '公共の場での人々の行動についての'),
    ],
    [
      b('For that reason', 'その理由から'),
      b('officials should explain clearly', '行政担当者は明確に説明すべきです'),
      b('what kind of data is collected and', 'どのような種類のデータが集められるのか、そして'),
      b('how it will be protected', 'そのデータがどのように保護されるのかを'),
    ],
    [
      b('There is also a social problem', '社会的な問題もあります'),
      b(
        'that is easy',
        'その問題は、容易なのです',
        'easy だけで意味を閉じず、後ろの to overlook が「何をするのが容易か」を示すまで待ちます。',
      ),
      b(
        'to overlook',
        '見落としてしまうことが。つまり、見落としやすい問題です',
        'easy to overlook を一つにすると「見落としやすい」。to overlook は easy の具体的な内容です。',
      ),
    ],
    [
      b('If only wealthy areas receive the newest systems', 'もし裕福な地域だけが最新のシステムを受け取るなら'),
      b('technology may make public services more unequal instead of more convenient', '技術は公共サービスを、より便利にする代わりに、さらに不平等にするかもしれません'),
    ],
    [
      b('City leaders therefore need', 'したがって、都市の指導者には必要があります'),
      b('to ask', '問うことが'),
      b('where a new system will have the greatest effect and', '新しいシステムがどこで最大の効果を発揮するのか、そして'),
      b(
        'who might be',
        'だれが、そうなるかもしれないのか',
        '受け身の be の後ろに left out が続きます。「だれが取り残されるかもしれないのか」と完成させます。',
      ),
      b('left out', '取り残されるのか'),
    ],
    [
      b('In some cases', '場合によっては'),
      b('a simple repair to an old bus stop or a clearer sign may help residents more than an expensive digital service', '古いバス停の簡単な修理や、より分かりやすい標識の方が、高価なデジタルサービスより住民の役に立つかもしれません'),
    ],
    [
      b('Several cities have therefore begun small trial programs', 'そのため、いくつかの都市は小規模な試験運用を始めています'),
      b('before introducing a system everywhere', 'システムをあらゆる場所へ導入する前に'),
    ],
    [
      b('They compare energy use, waiting times', '都市はエネルギー使用量や待ち時間を比較します'),
      b('and complaints in different neighborhoods, then publish the results', 'そして、異なる地域の苦情も比較し、そのあと結果を公表します'),
    ],
    [
      b('This evidence makes it easier', 'この証拠によって、次のことがしやすくなります'),
      b('to improve a design or decide', '設計を改善したり、判断したりすることが'),
      b('that a simpler solution would work better', 'もっと単純な解決策の方がうまく機能するだろうと'),
    ],
    [
      b('Technology should be judged not by', '技術は、次の基準によってではなく評価されるべきです'),
      b('how modern it appears', 'それがどのくらい現代的に見えるか'),
      b('but by whether it solves a real problem', 'そうではなく、実際の問題を解決するかどうかによって'),
      b('for the people', 'その人々にとっての'),
      b('who use the space', 'その空間を使う'),
    ],
    [
      b('If these issues are handled carefully', 'もし、こうした問題が慎重に扱われれば'),
      b('quiet technology can improve public spaces without making people feel controlled', '静かな技術は、人々に支配されていると感じさせずに、公共空間を改善できます'),
      b('by it', 'その技術によって'),
    ],
  ]),

  p_2_online_health_claims: passage([
    [
      b('A short video claims', 'ある短い動画が主張します'),
      b('that a certain drink improves memory', '特定の飲み物が記憶力を高めると'),
      b('and thousands of users share it', 'そして、何千人もの利用者がその動画を共有します'),
      b('within a day', '1日のうちに'),
    ],
    [
      b('The speaker may sound confident and may even mention a scientific study', '話し手は自信があるように聞こえ、科学的研究に触れることさえあるかもしれません'),
    ],
    [
      b('Yet these details alone do not show', 'しかし、こうした詳細だけでは示せません'),
      b('whether the health claim is reliable', 'その健康情報が信頼できるかどうかを'),
    ],
    [
      b('A careful reader first asks', '注意深い読み手はまず問いかけます'),
      b('who produced the message and', 'だれがその情報を作ったのか、そして'),
      b('what evidence is actually available', '実際にはどのような証拠を利用できるのかを'),
    ],
    [
      b('Readers can check a university report', '読み手は大学の報告書を検証できます'),
      b('that describes its methods more easily than a video', 'その報告書は方法を説明しており、動画より簡単に検証できます'),
      b('with no named source', '情報源の名前が示されていない'),
    ],
    [
      b('However', 'しかし'),
      b('the name of an expert or institution should not end the investigation', '専門家や機関の名前だけで、調査を終えるべきではありません'),
    ],
    [
      b('Readers still need', '読み手には、それでも必要があります'),
      b('to examine', '調べることが'),
      b('how the study was designed and', 'その研究がどのように設計されたのか、そして'),
      b('whether other researchers found similar results', 'ほかの研究者も同様の結果を得たのかどうかを'),
    ],
    [
      b('Sample size is one important clue', '標本の大きさは重要な手がかりの一つです'),
    ],
    [
      b('A result from twelve volunteers may be interesting', '12人のボランティアから得た結果は興味深いかもしれません'),
      b('but it may not apply to people of different ages or health conditions', 'しかし、それは年齢や健康状態が異なる人々には当てはまらないかもしれません'),
    ],
    [
      b('A useful study also compares groups so', '役立つ研究は、グループ同士も比較します、その目的は'),
      b('that researchers can separate the treatment', '研究者が治療の効果を分けられるようにすることです'),
      b('from other possible factors', 'ほかの考えられる要因から'),
    ],
    [
      b('Without such a comparison', 'そのような比較がなければ'),
      b('improvement may come', '改善は生じたのかもしれません'),
      b('from sleep, diet, expectation, or simple chance', '睡眠や食事、期待、あるいは単なる偶然から'),
    ],
    [
      b('Another common mistake is', 'もう一つのよくある誤りは、次のことです'),
      b('to treat correlation', '相関関係を扱うことです'),
      b('as proof of cause', '原因の証明として'),
    ],
    [
      b('Suppose a survey finds', 'ある調査から分かったと仮定しましょう'),
      b('that people', 'その人々は'),
      b('who drink more tea report less stress', 'より多くのお茶を飲み、より少ないストレスを報告すると'),
    ],
    [
      b('Tea might reduce stress', 'お茶がストレスを減らすのかもしれません'),
      b('but perhaps relaxed people simply choose', 'しかし、もしかすると、リラックスした人がお茶を飲むことを選んでいるだけかもしれません'),
      b('to drink more tea', 'もっと多くのお茶を飲むことを'),
    ],
    [
      b('Income, working hours, and social habits might influence both tea drinking and stress as well', '収入や労働時間や社会的習慣が、お茶を飲むこととストレスの両方に影響している可能性もあります'),
    ],
    [
      b('Readers should also distinguish an early report', '読み手は初期の報告も区別するべきです'),
      b('from a review', '再評価から'),
      b('that considers many studies', 'その再評価は多数の研究を検討しています'),
    ],
    [
      b('One experiment can suggest a possibility', '一つの実験は可能性を示せます'),
      b('whereas repeated studies help show', '一方、繰り返し行われた研究は示す助けになります'),
      b('whether an effect appears', '効果が現れるのかどうかを'),
      b('under different conditions', '異なる条件のもとで'),
    ],
    [
      b('Financial interests behind a study provide useful context', '研究の背後にある金銭的な利害関係は、役立つ背景を与えます'),
      b('for readers', '読み手に'),
    ],
    [
      b('Company funding does not automatically make research false', '企業の資金提供が、自動的に研究を誤りにするわけではありません'),
      b('but readers should check', 'しかし、読み手は確認するべきです'),
      b('whether the company sells the product being tested', 'その企業が試験されている製品を販売しているかどうかを'),
    ],
    [
      b('Independent review and a clear statement of possible conflicts make the evidence easier', '独立した審査と、起こり得る利害対立の明確な説明によって、証拠はもっと容易になります'),
      b('to evaluate', '評価することが'),
    ],
    [
      b('None of these questions gives a quick promise', 'こうした問いのどれも、すぐに保証してはくれません'),
      b('that a claim is true or false', 'ある主張が正しいか誤りかを'),
    ],
    [
      b('Instead, they help readers to judge', 'その代わりに、こうした問いは読み手が判断するのを助けます'),
      b('how strong a conclusion can reasonably be', '結論をどの程度強く述べるのが妥当なのかを'),
    ],
    [
      b('When a decision involves serious health risks', 'ある決定が重大な健康上の危険を伴うとき'),
      b('online reading should support, not replace, advice', 'オンラインで読むことは、助言を補うべきであって、置き換えるべきではありません'),
      b('from a qualified professional', '資格を持つ専門家からの'),
    ],
    [
      b('Responsible readers are not people', '責任ある読み手とは、そのような人々ではありません'),
      b('who doubt everything', 'あらゆることを疑う'),
      b('they are people', '責任ある読み手とは、そのような人々です'),
      b('who match their confidence to the quality of the evidence', '自分の確信の強さを、証拠の質に合わせる'),
    ],
  ]),

  p_pre1_resilient_cities: passage([
    [
      b('Cities have always had to respond to weather', '都市は常に、天候に対応しなければなりませんでした'),
      b('but the challenge has become more complicated', 'しかし、その課題はさらに複雑になっています'),
      b('as extreme heat and sudden storms occur more frequently', '猛暑や突然の嵐が、より頻繁に起こるにつれて'),
    ],
    [
      b('In the past', 'かつては'),
      b('local governments often treated floods, heat waves', '地方自治体は、洪水や熱波を扱うことがよくありました'),
      b('and water shortages', 'そして、水不足も'),
      b('as separate problems', '互いに別の問題として'),
    ],
    [
      b('Today', '今日では'),
      b('many planners argue', '多くの都市計画者は主張しています'),
      b('that cities need a broader framework', '都市には、より広い枠組みが必要だと'),
      b('that connects transportation, housing, energy, and public health', 'その枠組みは、交通、住宅、エネルギー、公衆衛生を結び付けます'),
    ],
    [
      b('One reason is', '理由の一つは、次のことです'),
      b('that a measure designed', '設計された対策が'),
      b('for a single purpose', '一つの目的のために'),
      b('can have unexpected consequences', '予期しない結果をもたらす可能性があることです'),
      b('in another area', '別の分野で'),
    ],
    [
      b('For instance', '例えば'),
      b('building higher concrete walls along a river may reduce flooding', '川沿いにもっと高いコンクリート壁を建てれば、洪水を減らせるかもしれません'),
      b('in one district while pushing water toward a poorer neighborhood downstream', 'ある地区では、その一方で水を下流のより貧しい地域へ押しやることになります'),
    ],
    [
      b('Similarly', '同様に'),
      b('installing powerful', '強力なものを設置することは'),
      b('air conditioners in public buildings may protect residents', '公共施設のエアコンを設置することは、住民を守るかもしれません'),
      b('during heat waves', '熱波の間に'),
      b('yet it can increase energy demand', 'しかし、それはエネルギー需要を増やす可能性があります'),
      b(
        'when the power supply is already',
        '電力供給がすでに、負荷のかかった状態にあるときに',
        'be under pressure の途中です。already まで読んだら、状態を表す under pressure を次で受けます。',
      ),
      b('under pressure', 'つまり、大きな負担を受けているときに'),
    ],
    [
      b('A more resilient city therefore begins', 'したがって、より回復力のある都市は始めます'),
      b('by assessing', '評価することから'),
      b('who is most vulnerable and', 'だれが最も弱い立場にあるのか、そして'),
      b('which resources can serve several needs', 'どの資源が複数の必要に役立てるのかを'),
      b('at once', '同時に'),
    ],
    [
      b('Trees are a useful example', '樹木は役立つ例です'),
    ],
    [
      b('They provide shade, absorb rainwater, improve air quality', '樹木は日陰を作り、雨水を吸収し、空気の質を改善します'),
      b('and make streets more pleasant', 'そして、通りをもっと快適にします'),
      b('for walking', '歩くのに'),
    ],
    [
      b('However', 'しかし'),
      b('planting trees', '木を植えることは'),
      b('is not a simple solution', '単純な解決策ではありません'),
      b('if maintenance money is limited or', '維持費が限られている場合、あるいは'),
      b('if sidewalks are too narrow', '歩道が狭すぎる場合には'),
      b('for roots', '根にとって'),
      b('to grow safely', '安全に伸びるには'),
    ],
    [
      b('This illustrates a problem', 'これは、ある問題を示しています'),
      b('that researchers call maladaptation: an attempt', '研究者が「不適応」と呼ぶ問題、つまり、ある試みが'),
      b('to reduce one risk', '一つの危険を減らそうとする'),
      b('can create a new risk or deepen an old inequality', '新しい危険を生んだり、以前からの不平等を深めたりする可能性があるという問題です'),
    ],
    [
      b('A park that cools a wealthy district, for example, may increase nearby rents and force lower-income residents', '例えば、裕福な地区を涼しくする公園が、周辺の家賃を上げ、低所得の住民に迫るかもしれません'),
      b('to move', '転居するように'),
      b('before they enjoy the benefits', 'その住民が恩恵を受ける前に'),
    ],
    [
      b('Planners must therefore examine not only', 'したがって計画者は、次のことだけでなく検討しなければなりません'),
      b('whether an intervention works physically but also', '対策が物理的に機能するかどうかだけでなく'),
      b('how its costs and benefits are distributed', 'その費用と恩恵がどのように分配されるのかも'),
    ],
    [
      b('Good policy must be based on evidence from the actual community rather than on attractive ideas copied', 'よい政策は、借りてきた魅力的な考えではなく、実際の地域から得た証拠に基づかなければなりません'),
      b('from other cities', 'ほかの都市から'),
    ],
    [
      b('Some cities have begun', '一部の都市は始めています'),
      b('to invite residents to map dangerous intersections, hot streets', '住民に、危険な交差点や暑い通りを地図に記してもらうことを'),
      b('and places', 'そして、場所も'),
      b('where water remains', 'そこには水が残ります'),
      b('after heavy rain', '大雨のあとに'),
    ],
    [
      b('This process takes time', 'この過程には時間がかかります'),
      b('and it may reveal disagreements about', 'そして、あることについての意見の相違を明らかにするかもしれません'),
      b('which projects should come first', 'どの事業を最初に行うべきかという'),
    ],
    [
      b('Nevertheless', 'それにもかかわらず'),
      b('it can build trust', 'この過程は信頼を築くことができます'),
      b('because residents see', 'なぜなら、住民には分かるからです'),
      b('that their daily experience is treated as valuable information', '自分たちの日常の経験が、価値ある情報として扱われていると'),
    ],
    [
      b('Local knowledge also helps officials identify failures', '地域の知識は、行政担当者が不具合を見つける助けにもなります'),
      b('that computer models miss', 'その不具合を、コンピューターモデルは見落とします'),
    ],
    [
      b('A drainage map may look complete', '排水地図は完全に見えるかもしれません'),
      b('yet residents may know', 'それでも、住民は知っているかもしれません'),
      b('that blocked street drains regularly send water', '道路の排水口の詰まりが、繰り返し水を流し込むということを'),
      b('into a particular apartment building', '特定の集合住宅へ'),
    ],
    [
      b('Such observations do not replace scientific data', 'そのような観察は、科学的データに取って代わるものではありません'),
      b('they reveal', '観察が明らかにするのです'),
      b('where additional measurement is needed', 'どこで追加の測定が必要なのかを'),
    ],
    [
      b('The financial side of adaptation is equally difficult', '適応の財政面も同じように難しいものです'),
    ],
    [
      b('Large infrastructure projects are attractive to politicians', '大規模なインフラ事業は、政治家にとって魅力的です'),
      b('because they are visible and can be announced as decisive action', 'なぜなら、目に見えやすく、決定的な行動として発表できるからです'),
    ],
    [
      b('Yet smaller investments, such as training neighborhood volunteers or improving warning messages in several languages, may save more lives', 'しかし、地域ボランティアの訓練や多言語の警告改善など、小規模な投資の方が、より多くの命を救うかもしれません'),
      b('during an emergency', '緊急時に'),
    ],
    [
      b('Because these measures are less dramatic', 'こうした対策は目立ちにくいため'),
      b('they are often the first', '対策は最初のものになりがちです'),
      b('to be reduced', '削減される'),
      b('when budgets become tight', '予算が厳しくなったときに'),
    ],
    [
      b('A city that takes resilience seriously must therefore evaluate projects over a long period rather than only', 'したがって、回復力を真剣に考える都市は、事業を短期間だけでなく長期にわたって評価しなければなりません'),
      b('during the year in', 'その年の間だけでなく'),
      b('which they are introduced', 'その年に事業が導入されます'),
    ],
    [
      b('It must also recognize', '都市はさらに認識しなければなりません'),
      b('that the absence of disaster is not proof', '災害が起こらなかったことは証拠ではないと'),
      b('that preparation was unnecessary', '準備が不要だったという'),
    ],
    [
      b('Finally', '最後に'),
      b('adaptation plans must remain flexible', '適応計画は柔軟であり続けなければなりません'),
    ],
    [
      b('A project', 'ある事業は'),
      b('that performs well', 'うまく機能していても'),
      b('under today\'s conditions', '現在の条件のもとで'),
      b('may be inadequate', '不十分になるかもしれません'),
      b('if migration, land use', 'もし人口移動や土地利用が'),
      b('or rainfall patterns change', 'あるいは降雨の傾向が変化すれば'),
    ],
    [
      b('Setting review dates and publishing results allows governments', '見直しの日程を定めて結果を公表すれば、政府はできるようになります'),
      b('to revise policies without treating revision as failure', '見直すことを失敗とみなさずに、政策を改めることが'),
    ],
    [
      b('As climate conditions remain uncertain', '気候条件が不確かなままである中'),
      b('the cities that adapt most successfully will probably be those that combine technical knowledge', '最もうまく適応する都市は、おそらく専門的な知識を組み合わせる都市でしょう'),
      b('with public participation', '市民参加と'),
    ],
  ]),

  p_pre1_cashless_inclusion: passage([
    [
      b('Cashless payment has recently moved from a convenient option to the expected form of payment', 'キャッシュレス決済は近年、便利な選択肢から、当然とされる支払い方法へ変化してきました'),
      b('in many shops, transport systems, and public facilities', '多くの店や交通機関や公共施設で'),
    ],
    [
      b('Supporters cite faster transactions, lower handling costs', '支持者は、より速い取引や、より低い現金処理費用を挙げます'),
      b('and reduced risk of theft', 'そして、盗難の危険が減ることも'),
      b('for merchants', '商店にとって'),
    ],
    [
      b('Digital records can also help consumers follow their spending and allow small businesses', 'デジタル記録は、消費者が支出を追う助けとなり、小規模事業者ができるようにもします'),
      b('to sell goods online', 'オンラインで商品を売ることが'),
    ],
    [
      b('These benefits are real', 'こうした利点は現実にあります'),
      b('but they are not shared equally', 'しかし、その利点は平等に共有されてはいません'),
    ],
    [
      b('Some people do not have a bank account', '銀行口座を持たない人もいます'),
      b('a suitable phone', '適した電話も'),
      b('reliable internet access', '信頼できるインターネット接続も'),
      b('or the identity documents required', 'あるいは、必要とされる身分証明書も'),
      b('to open a digital account', 'デジタル口座を開設するために'),
    ],
    [
      b('Others can use digital services but struggle', '別の人々はデジタルサービスを使えますが、苦労しています'),
      b('with small fees, complex passwords', '少額の手数料や複雑なパスワードに'),
      b('or interfaces that were not designed', 'あるいは、設計されていない画面に'),
      b('for disabilities', '障害のある人々のために'),
    ],
    [
      b('For these users', 'こうした利用者にとって'),
      b('refusing cash', '現金を拒否されることは'),
      b('does more than remove a familiar habit', '慣れ親しんだ習慣を奪うだけにはとどまりません'),
      b('it can limit access to food, transport, and public life', '食料や交通や公共生活へのアクセスを制限する可能性があります'),
    ],
    [
      b('Privacy is a different concern', 'プライバシーは別の懸念です'),
    ],
    [
      b('Cash usually leaves no detailed record linking a person to a particular purchase', '現金は通常、人と特定の購入を結び付ける詳しい記録を残しません'),
      b('whereas digital payment creates data', '一方、デジタル決済はデータを生み出します'),
      b('that may be stored, combined, or sold', 'そのデータは、保存されたり、組み合わされたり、販売されたりするかもしれません'),
    ],
    [
      b('Such records can detect fraud and improve services', 'そのような記録は、不正を発見し、サービスを改善できます'),
      b('yet they can also reveal medical needs, political interests, or daily movements', 'しかし、医療上の必要や政治的関心、日々の移動を明らかにすることもあります'),
    ],
    [
      b('People with little economic or political power may be especially vulnerable', '経済的または政治的な力が乏しい人々は、特に弱い立場に置かれるかもしれません'),
      b('when they cannot choose a private alternative', 'プライバシーを守れる代替手段を選べないときに'),
    ],
    [
      b('A common response is', '一般的な対応は、次のことです'),
      b('to teach digital skills and provide low-cost accounts', 'デジタル技能を教え、低費用の口座を提供することです'),
    ],
    [
      b('These measures can expand participation', 'こうした対策は参加を広げられます'),
      b('but they do not solve every problem', 'しかし、すべての問題を解決するわけではありません'),
    ],
    [
      b('Training provides only limited value in rural areas with weak mobile service or during payment system failures', '訓練は、携帯通信が弱い農村部や、決済システムの停止中には、限られた価値しか持ちません'),
      b('after serious natural disasters and emergencies', '深刻な自然災害や緊急事態のあとに起こる'),
    ],
    [
      b('Nor should inclusion mean forcing everyone', 'さらに、包摂は全員に強いることを意味するべきではありません'),
      b('into a system simply', '一つの仕組みの中へ、ただ'),
      b('because institutions find it efficient', '制度を運営する側が、それを効率的だと考えるからという理由で'),
    ],
    [
      b('Cash can also provide a simple budgeting tool', '現金は簡単な家計管理の手段にもなります'),
      b('for households', '家庭にとって'),
      b('whose income changes', 'その家庭の収入は変化します'),
      b('from week to week', '週ごとに'),
    ],
    [
      b('A fixed amount', '決まった金額は'),
      b('in an envelope stays visible', '封筒の中にあれば、目に見えるままです'),
      b('while digital balances may be divided', '一方、デジタルの残高は分かれているかもしれません'),
      b('across several apps and delayed transactions', '複数のアプリや、処理が遅れた取引にまたがって'),
    ],
    [
      b('This does not make cash universally superior', 'このことが、現金をあらゆる場合に優れたものにするわけではありません'),
      b('but it shows', 'しかし、このことは示しています'),
      b('why a preferred tool can depend', 'なぜ、好ましい道具が左右されることがあるのかを'),
      b('on a person’s circumstances rather than technical knowledge alone', '技術知識だけでなく、その人の事情によって'),
    ],
    [
      b('Some governments therefore require essential businesses', 'そのため、一部の政府は生活に不可欠な事業者に求めています'),
      b('to accept cash while encouraging digital innovation elsewhere', 'ほかではデジタル革新を促しながら、現金を受け入れるように'),
    ],
    [
      b('Critics argue', '批判する人々は主張します'),
      b('that such rules create costs', 'そのような規則が費用を生じさせると'),
      b('for merchants', '商店にとって'),
      b('who must maintain two payment systems', 'その商店は二つの決済方式を維持しなければなりません'),
    ],
    [
      b('That objection is important, particularly for small shops', 'その反論は重要です、特に小規模な店にとって'),
      b('with narrow profit margins', '利益幅の小さい'),
    ],
    [
      b('Policy can reduce the burden', '政策はその負担を減らせます'),
      b('through shared cash services, tax incentives', '共同の現金取扱サービスや税制上の優遇によって'),
      b('or exemptions for clearly defined cases', 'あるいは、明確に定義された場合の免除によって'),
    ],
    [
      b('The broader lesson is', 'より広い教訓は、次のことです'),
      b('that innovation should be judged', '革新は評価されるべきだということです'),
      b('by the range of people', '人々の範囲によって'),
      b('who can use it, not only', 'その革新を利用できる、そして次の基準だけでなく'),
      b('by the speed of its average transaction', '平均的な取引の速さによってだけではなく'),
    ],
    [
      b('A payment system is part of social infrastructure', '決済制度は社会基盤の一部です'),
      b('and infrastructure must remain usable', 'そして、社会基盤は利用できる状態を保たなければなりません'),
      b('under varied human and technical conditions', '多様な人間的・技術的条件のもとで'),
    ],
    [
      b('Cash may sometimes appear inefficient', '現金は、ときに非効率に見えるかもしれません'),
      b('as an option, just', '選択肢として、ちょうど'),
      b('as backup power can appear wasteful', '予備電源が無駄に見えるのと同じように'),
      b('on an ordinary day', '平常の日には'),
    ],
    [
      b('However', 'しかし'),
      b('this apparent duplication provides valuable resilience', 'この一見した重複が、価値ある回復力をもたらします'),
      b('during a network failure', '通信障害の間に'),
    ],
    [
      b('The goal need not be', '目標は、そのことである必要はありません'),
      b('to stop the transition toward digital payment', 'デジタル決済への移行を止めること'),
    ],
    [
      b('It should be', '目標は、そのことであるべきです'),
      b('to preserve meaningful alternatives', '実質的な代替手段を保つこと'),
      b('while removing barriers that prevent people', '同時に、人々を妨げる障壁を取り除くこと'),
      b(
        'from choosing freely',
        '自由に選ぶのを',
        'prevent A from doing で「Aが〜するのを妨げる」。前の people と合わせて「人々が自由に選ぶのを妨げる障壁」です。',
      ),
    ],
    [
      b('A genuinely modern system is not one', '真に現代的な制度とは、そのようなものではありません'),
      b('that eliminates older tools as quickly as possible', '古い道具をできるだけ早くなくす'),
      b('but one that combines convenience, privacy, inclusion', 'そうではなく、利便性、プライバシー、包摂を組み合わせるものです'),
      b('and flexibility in practice', 'そして、実際の柔軟性も'),
    ],
  ]),
})
