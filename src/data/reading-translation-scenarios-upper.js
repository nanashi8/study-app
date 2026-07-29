// 2級・準1級長文の講師監修・語順訳シナリオ。

const b = (en, orderedJa, tip = '') => {
  const jaSegments = Object.freeze(orderedJa.split('／').map((segment) => segment.trim()))
  return Object.freeze({
    en,
    ja: jaSegments.join(' → '),
    jaSegments,
    speechJa: jaSegments.join('、'),
    tip,
  })
}
const passage = (sentences) => Object.freeze(sentences.map((sentence) => Object.freeze(sentence)))

export const UPPER_READING_TRANSLATION_SCENARIOS = Object.freeze({
  p_2_quiet_technology: passage([
    [
      b('When people discuss technology', '〜するとき／人々が／話し合う／技術について'),
      b('they often imagine large machines, bright screens', '人々は／しばしば思い浮かべます／大きな機械・明るい画面を'),
      b('or dramatic changes', 'あるいは、劇的な変化を'),
      b('in daily life', '日常生活における'),
    ],
    [
      b('In recent years', '近年では'),
      b('however, some of the most useful technologies have been designed', 'しかし／最も役立つ技術のいくつかは／設計されてきました'),
      b('to be almost invisible', 'ほとんど目立たないように'),
    ],
    [
      b('For example', '例えば'),
      b('several train stations have introduced sensors', 'いくつかの駅は／導入しています／センサーを'),
      b('that measure', 'そしてそのセンサーが／測ります'),
      b('how crowded each platform is', 'どのくらい混雑しているかを／それぞれのホームが'),
    ],
    [
      b('The information is sent to signs and phone apps', 'その情報は／送られます／表示板とスマートフォンのアプリへ'),
      b('so passengers can choose a less crowded area', 'そのため／乗客は／選べます／より空いている場所を'),
      b('before the train arrives', '〜する前に／電車が／到着する'),
    ],
    [
      b('The system does not tell people what to do', 'その仕組みは／伝えません／人々に／何をすべきかを'),
      b('but it gives them a better source of information', 'しかし／その仕組みは／与えます／人々に／よりよい情報源を'),
    ],
    [
      b('This small difference can reduce stress, especially for elderly passengers or parents traveling', 'この小さな違いは／減らせます／ストレスを／特に高齢の乗客や移動中の親にとって'),
      b('with children', '子どもを連れて'),
    ],
    [
      b('Another example can be found', '別の例は／見つけられます'),
      b('in public libraries', '公共図書館で'),
    ],
    [
      b('Some libraries now use quiet air-control systems', '一部の図書館は／今では使っています／静かな空調システムを'),
      b('that keep rooms comfortable while using less energy than older equipment', 'そしてそのシステムは／保ちます／部屋を／快適に／同時に使いながら／より少ないエネルギーを／古い設備より'),
    ],
    [
      b('Visitors may not notice the system', '来館者は／気づかないかもしれません／そのシステムに'),
      b('at all', 'まったく'),
      b('yet it affects', 'それでも／そのシステムは／影響を与えます'),
      b('how long they can read or study', 'どのくらい長く／来館者が／読書や勉強を続けられるかに'),
      b('without becoming tired', '疲れることなく'),
    ],
    [
      b('These cases suggest', 'こうした例は／示しています'),
      b('that successful technology is not always the technology', '成功した技術は／必ずしもその技術ではないということを'),
      b('that attracts the most attention', 'そしてその技術が／集めます／最も多くの注目を'),
    ],
    [
      b('Cost is still an important factor', '費用は／依然として重要な要因です'),
      b('and cities must consider', 'そして／都市は／検討しなければなりません'),
      b('whether new systems can be maintained', '〜かどうかを／新しいシステムが／維持できる'),
      b('for many years', '何年にもわたって'),
    ],
    [
      b('Privacy is another concern', 'プライバシーは／もう一つの懸念です'),
      b('because sensors can collect data', 'なぜなら／センサーは／集められるからです／データを'),
      b('about public behavior', '内容は／公共の場での人々の行動について'),
    ],
    [
      b('For that reason', 'その理由から'),
      b('officials should explain clearly', '行政担当者は／説明すべきです／明確に'),
      b('what kind of data is collected and', 'どの種類のデータが／集められるのか／そして'),
      b('how it will be protected', 'どのように／そのデータが／保護されるのかを'),
    ],
    [
      b('There is also a social problem', 'あります／さらに社会的な問題が'),
      b(
        'that is easy',
        'そしてその問題は／容易です（内容は次へ）',
        'easy だけで意味を閉じず、後ろの to overlook が「何をするのが容易か」を示すまで待ちます。',
      ),
      b(
        'to overlook',
        '見落とすことが／つまり見落としやすい問題です',
        'easy to overlook を一つにすると「見落としやすい」。to overlook は easy の具体的な内容です。',
      ),
    ],
    [
      b('If only wealthy areas receive the newest systems', 'もし／裕福な地域だけが／受け取るなら／最新のシステムを'),
      b('technology may make public services more unequal instead of more convenient', '技術は／するかもしれません／公共サービスを／より不平等に／より便利にする代わりに'),
    ],
    [
      b('City leaders therefore need', '都市の指導者は／したがって必要としています'),
      b('to ask', '問うことが'),
      b('where a new system will have the greatest effect and', 'どこで／新しいシステムが／持つのか／最大の効果を／そして'),
      b(
        'who might be',
        'だれが／そうなるかもしれないのか（内容は次へ）',
        '受け身の be の後ろに left out が続きます。「だれが取り残されるかもしれないのか」と完成させます。',
      ),
      b('left out', '取り残されるのか'),
    ],
    [
      b('In some cases', '場合によっては'),
      b('a simple repair to an old bus stop or a clearer sign may help residents more than an expensive digital service', '簡単な修理は／古いバス停への／あるいは、より分かりやすい標識は／役立つかもしれません／住民に／高価なデジタルサービスより'),
    ],
    [
      b('Several cities have therefore begun small trial programs', 'いくつかの都市は／そのため始めています／小規模な試験運用を'),
      b('before introducing a system everywhere', '〜する前に／システムを導入する／あらゆる場所へ'),
    ],
    [
      b('They compare energy use, waiting times', '都市は／比較します／エネルギー使用量・待ち時間を'),
      b('and complaints in different neighborhoods, then publish the results', 'そして苦情を／異なる地域の／そのあと公表します／結果を'),
    ],
    [
      b('This evidence makes it easier', 'この証拠は／より容易にします／次のことを'),
      b('to improve a design or decide', '改善することを／設計を／または判断することを'),
      b('that a simpler solution would work better', 'もっと単純な解決策が／よりうまく機能するだろうと'),
    ],
    [
      b('Technology should be judged not by', '技術は／評価されるべきです／次の基準によってではなく'),
      b('how modern it appears', 'どのくらい現代的に／それが／見えるか'),
      b('but by whether it solves a real problem', 'そうではなく／〜かどうかによって／それが／解決する／実際の問題を'),
      b('for the people', 'その人々にとっての'),
      b('who use the space', 'そしてその人々が／使う／その空間を'),
    ],
    [
      b('If these issues are handled carefully', 'もし／こうした問題が／扱われれば／慎重に'),
      b('quiet technology can improve public spaces without making people feel controlled', '静かな技術は／改善できます／公共空間を／人々に感じさせずに／支配されていると'),
      b('by it', 'その技術によって'),
    ],
  ]),

  p_2_online_health_claims: passage([
    [
      b('A short video claims', 'ある短い動画が／主張します'),
      b('that a certain drink improves memory', '特定の飲み物が／高めると／記憶力を'),
      b('and thousands of users share it', 'そして／何千人もの利用者が／共有します／その動画を'),
      b('within a day', '1日のうちに'),
    ],
    [
      b('The speaker may sound confident and may even mention a scientific study', '話し手は／自信があるように聞こえるかもしれません／そして触れることさえあるかもしれません／科学的研究に'),
    ],
    [
      b('Yet these details alone do not show', 'しかし／こうした詳細だけでは／示せません'),
      b('whether the health claim is reliable', '〜かどうかを／その健康情報が／信頼できる'),
    ],
    [
      b('A careful reader first asks', '注意深い読み手は／まず問いかけます'),
      b('who produced the message and', 'だれが／作ったのか／その情報を／そして'),
      b('what evidence is actually available', 'どのような証拠が／実際に利用できるのかを'),
    ],
    [
      b('Readers can check a university report', '読み手は／確認できます／大学の報告書を'),
      b('that describes its methods more easily than a video', 'そしてその報告書は／説明しています／方法を／より容易に確認できます／動画より'),
      b('with no named source', '情報源の名前が示されていない'),
    ],
    [
      b('However', 'しかし'),
      b('the name of an expert or institution should not end the investigation', '専門家や機関の名前は／終わらせるべきではありません／調査を'),
    ],
    [
      b('Readers still need', '読み手は／それでも必要としています'),
      b('to examine', '調べることが'),
      b('how the study was designed and', 'どのように／その研究が／設計されたのか／そして'),
      b('whether other researchers found similar results', '〜かどうかを／ほかの研究者も／得た／同様の結果を'),
    ],
    [
      b('Sample size is one important clue', '標本の大きさは／重要な手がかりの一つです'),
    ],
    [
      b('A result from twelve volunteers may be interesting', 'ある結果は／12人のボランティアからの／興味深いかもしれません'),
      b('but it may not apply to people of different ages or health conditions', 'しかし／それは／当てはまらないかもしれません／年齢や健康状態が異なる人々には'),
    ],
    [
      b('A useful study also compares groups so', '役立つ研究は／さらに比較します／グループを／その目的は'),
      b('that researchers can separate the treatment', '研究者が／分けられるようにすることです／治療の効果を'),
      b('from other possible factors', 'ほかの考えられる要因から'),
    ],
    [
      b('Without such a comparison', 'そのような比較がなければ'),
      b('improvement may come', '改善は／生じたのかもしれません'),
      b('from sleep, diet, expectation, or simple chance', '睡眠や食事、期待、あるいは単なる偶然から'),
    ],
    [
      b('Another common mistake is', 'もう一つのよくある誤りは／〜です（内容は次へ）'),
      b('to treat correlation', '相関関係を扱うことです'),
      b('as proof of cause', '原因の証明として'),
    ],
    [
      b('Suppose a survey finds', '仮定してください／ある調査が／見つけたと'),
      b('that people', 'その人々は'),
      b('who drink more tea report less stress', 'そしてその人々は／飲みます／より多くのお茶を／報告します／より少ないストレスを'),
    ],
    [
      b('Tea might reduce stress', 'お茶が／減らすのかもしれません／ストレスを'),
      b('but perhaps relaxed people simply choose', 'しかし／もしかすると／リラックスした人々は／ただ選ぶのかもしれません'),
      b('to drink more tea', '飲むことを／もっと多くのお茶を'),
    ],
    [
      b('Income, working hours, and social habits might influence both tea drinking and stress as well', '収入・労働時間・社会的習慣も／影響している可能性があります／お茶を飲むこととストレスの両方に'),
    ],
    [
      b('Readers should also distinguish an early report', '読み手は／さらに区別するべきです／初期の報告を'),
      b('from a review', '再評価から'),
      b('that considers many studies', 'そしてその再評価は／検討しています／多数の研究を'),
    ],
    [
      b('One experiment can suggest a possibility', '一つの実験は／示せます／可能性を'),
      b('whereas repeated studies help show', '一方／繰り返し行われた研究は／示す助けになります'),
      b('whether an effect appears', '〜かどうかを／効果が／現れる'),
      b('under different conditions', '異なる条件のもとで'),
    ],
    [
      b('Financial interests behind a study provide useful context', '金銭的な利害関係は／研究の背後の／与えます／役立つ背景を'),
      b('for readers', '読み手に'),
    ],
    [
      b('Company funding does not automatically make research false', '企業の資金提供は／自動的にするわけではありません／研究を／誤ったものに'),
      b('but readers should check', 'しかし／読み手は／確認するべきです'),
      b('whether the company sells the product being tested', '〜かどうかを／その企業が／販売している／試験されている製品を'),
    ],
    [
      b('Independent review and a clear statement of possible conflicts make the evidence easier', '独立した審査と、起こり得る利害対立の明確な説明は／します／証拠を／より容易に'),
      b('to evaluate', '評価することが'),
    ],
    [
      b('None of these questions gives a quick promise', 'こうした問いのどれも／与えません／すぐの保証を'),
      b('that a claim is true or false', 'ある主張が／正しいか誤りかという'),
    ],
    [
      b('Instead, they help readers to judge', 'その代わりに／こうした問いは／助けます／読み手が／判断することを'),
      b('how strong a conclusion can reasonably be', 'どの程度強く／結論が／妥当であり得るのかを'),
    ],
    [
      b('When a decision involves serious health risks', '〜するとき／ある決定が／伴う／重大な健康上の危険を'),
      b('online reading should support, not replace, advice', 'オンラインで読むことは／補うべきであり、置き換えるべきではありません／助言を'),
      b('from a qualified professional', '資格を持つ専門家からの'),
    ],
    [
      b('Responsible readers are not people', '責任ある読み手は／そのような人々ではありません'),
      b('who doubt everything', 'つまり／あらゆることを疑う人々ではなく'),
      b('they are people', '責任ある読み手は／そのような人々です'),
      b('who match their confidence to the quality of the evidence', 'つまり／合わせる人々です／自分の確信の強さを／証拠の質に'),
    ],
  ]),

  p_pre1_resilient_cities: passage([
    [
      b('Cities have always had to respond to weather', '都市は／常に対応しなければなりませんでした／天候に'),
      b('but the challenge has become more complicated', 'しかし／その課題は／さらに複雑になっています'),
      b('as extreme heat and sudden storms occur more frequently', '〜するにつれて／猛暑や突然の嵐が／起こる／より頻繁に'),
    ],
    [
      b('In the past', 'かつては'),
      b('local governments often treated floods, heat waves', '地方自治体は／しばしば扱いました／洪水・熱波を'),
      b('and water shortages', 'そして、水不足も'),
      b('as separate problems', '互いに別の問題として'),
    ],
    [
      b('Today', '今日では'),
      b('many planners argue', '多くの都市計画者は／主張しています'),
      b('that cities need a broader framework', '都市は／必要としていると／より広い枠組みを'),
      b('that connects transportation, housing, energy, and public health', 'そしてその枠組みは／結び付けます／交通・住宅・エネルギー・公衆衛生を'),
    ],
    [
      b('One reason is', '理由の一つは／〜です（内容は次へ）'),
      b('that a measure designed', 'ある対策が／設計された'),
      b('for a single purpose', '一つの目的のために'),
      b('can have unexpected consequences', 'もたらす可能性があることです／予期しない結果を'),
      b('in another area', '別の分野で'),
    ],
    [
      b('For instance', '例えば'),
      b('building higher concrete walls along a river may reduce flooding', 'より高いコンクリート壁を建てることは／川沿いに／減らすかもしれません／洪水を'),
      b('in one district while pushing water toward a poorer neighborhood downstream', 'ある地区では／同時に水を押しやりながら／より貧しい地域へ／下流の'),
    ],
    [
      b('Similarly', '同様に'),
      b('installing powerful', '設置することは／強力な（内容は次へ）'),
      b('air conditioners in public buildings may protect residents', 'エアコンを／公共施設に／守るかもしれません／住民を'),
      b('during heat waves', '熱波の間に'),
      b('yet it can increase energy demand', 'しかし／それは／増やす可能性があります／エネルギー需要を'),
      b(
        'when the power supply is already',
        '〜するときに／電力供給が／すでに（状態は次へ）',
        'be under pressure の途中です。already まで読んだら、状態を表す under pressure を次で受けます。',
      ),
      b('under pressure', '大きな負担を受けている'),
    ],
    [
      b('A more resilient city therefore begins', 'より回復力のある都市は／したがって始めます'),
      b('by assessing', '評価することから'),
      b('who is most vulnerable and', 'だれが／最も弱い立場にあるのか／そして'),
      b('which resources can serve several needs', 'どの資源が／役立てるのかを／複数の必要に'),
      b('at once', '同時に'),
    ],
    [
      b('Trees are a useful example', '樹木は／役立つ例です'),
    ],
    [
      b('They provide shade, absorb rainwater, improve air quality', '樹木は／作ります／日陰を／吸収します／雨水を／改善します／空気の質を'),
      b('and make streets more pleasant', 'そして／します／通りを／もっと快適に'),
      b('for walking', '歩くのに'),
    ],
    [
      b('However', 'しかし'),
      b('planting trees', '木を植えることは'),
      b('is not a simple solution', '単純な解決策ではありません'),
      b('if maintenance money is limited or', 'もし／維持費が／限られているなら／あるいは'),
      b('if sidewalks are too narrow', 'もし／歩道が／狭すぎるなら'),
      b('for roots', '根にとって'),
      b('to grow safely', '安全に伸びるには'),
    ],
    [
      b('This illustrates a problem', 'これは／示しています／ある問題を'),
      b('that researchers call maladaptation: an attempt', 'そして研究者は／呼びます／その問題を／不適応と／つまり、ある試みが'),
      b('to reduce one risk', '減らすための／一つの危険を'),
      b('can create a new risk or deepen an old inequality', '生み出す可能性がある／新しい危険を／または深める可能性がある／以前からの不平等を'),
    ],
    [
      b('A park that cools a wealthy district, for example, may increase nearby rents and force lower-income residents', 'ある公園は／裕福な地区を涼しくする／例えば／上げるかもしれません／近隣の家賃を／そして強いるかもしれません／低所得の住民に'),
      b('to move', '転居するように'),
      b('before they enjoy the benefits', '〜する前に／その住民が／享受する／恩恵を'),
    ],
    [
      b('Planners must therefore examine not only', '計画者は／したがって検討しなければなりません／次のことだけでなく'),
      b('whether an intervention works physically but also', '〜かどうかを／対策が／物理的に機能する／だけでなく、さらに'),
      b('how its costs and benefits are distributed', 'どのように／その費用と恩恵が／分配されるのかも'),
    ],
    [
      b('Good policy must be based on evidence from the actual community rather than on attractive ideas copied', 'よい政策は／基づかなければなりません／証拠に／実際の地域からの／魅力的な考えよりも／借りてきた'),
      b('from other cities', 'ほかの都市から'),
    ],
    [
      b('Some cities have begun', '一部の都市は／始めています'),
      b('to invite residents to map dangerous intersections, hot streets', '招くことを／住民に／地図に記してもらうために／危険な交差点・暑い通りを'),
      b('and places', 'そして、場所も'),
      b('where water remains', 'そしてそこには／水が／残ります'),
      b('after heavy rain', '大雨のあとに'),
    ],
    [
      b('This process takes time', 'この過程は／必要とします／時間を'),
      b('and it may reveal disagreements about', 'そして／この過程は／明らかにするかもしれません／意見の相違を／次のことについて'),
      b('which projects should come first', 'どの事業が／最初に来るべきか'),
    ],
    [
      b('Nevertheless', 'それにもかかわらず'),
      b('it can build trust', 'この過程は／築くことができます／信頼を'),
      b('because residents see', 'なぜなら／住民は／分かるからです'),
      b('that their daily experience is treated as valuable information', '自分たちの日常の経験が／扱われていると／価値ある情報として'),
    ],
    [
      b('Local knowledge also helps officials identify failures', '地域の知識は／さらに助けます／行政担当者が／見つけることを／不具合を'),
      b('that computer models miss', 'そしてその不具合を／コンピューターモデルは／見落とします'),
    ],
    [
      b('A drainage map may look complete', '排水地図は／完全に見えるかもしれません'),
      b('yet residents may know', 'それでも／住民は／知っているかもしれません'),
      b('that blocked street drains regularly send water', '道路の排水口の詰まりが／繰り返し流し込むということを／水を'),
      b('into a particular apartment building', '特定の集合住宅へ'),
    ],
    [
      b('Such observations do not replace scientific data', 'そのような観察は／置き換えません／科学的データを'),
      b('they reveal', 'その観察は／明らかにします'),
      b('where additional measurement is needed', 'どこで／追加の測定が／必要なのかを'),
    ],
    [
      b('The financial side of adaptation is equally difficult', '財政面は／適応の／同じように難しいものです'),
    ],
    [
      b('Large infrastructure projects are attractive to politicians', '大規模なインフラ事業は／魅力的です／政治家にとって'),
      b('because they are visible and can be announced as decisive action', 'なぜなら／それらは／目に見えやすく／そして発表できるからです／決定的な行動として'),
    ],
    [
      b('Yet smaller investments, such as training neighborhood volunteers or improving warning messages in several languages, may save more lives', 'しかし／より小規模な投資は／例えば地域ボランティアの訓練や、多言語の警告文の改善／救うかもしれません／より多くの命を'),
      b('during an emergency', '緊急時に'),
    ],
    [
      b('Because these measures are less dramatic', 'なぜなら／こうした対策は／目立ちにくいからです'),
      b('they are often the first', 'こうした対策は／しばしば最初のものになります'),
      b('to be reduced', '削減される'),
      b('when budgets become tight', '〜するときに／予算が／厳しくなる'),
    ],
    [
      b('A city that takes resilience seriously must therefore evaluate projects over a long period rather than only', 'ある都市は／回復力を真剣に扱う／したがって評価しなければなりません／事業を／長期間にわたって／〜だけでなく'),
      b('during the year in', 'その年の間だけ／その中で'),
      b('which they are introduced', '事業が／導入される'),
    ],
    [
      b('It must also recognize', '都市は／さらに認識しなければなりません'),
      b('that the absence of disaster is not proof', '災害が起こらなかったことは／証拠ではないと'),
      b('that preparation was unnecessary', 'つまり／準備が／不要だったという'),
    ],
    [
      b('Finally', '最後に'),
      b('adaptation plans must remain flexible', '適応計画は／柔軟であり続けなければなりません'),
    ],
    [
      b('A project', 'ある事業は'),
      b('that performs well', 'そしてその事業が／うまく機能する'),
      b('under today\'s conditions', '現在の条件のもとで'),
      b('may be inadequate', '不十分になるかもしれません'),
      b('if migration, land use', 'もし／人口移動や土地利用が'),
      b('or rainfall patterns change', 'あるいは降雨の傾向が／変化すれば'),
    ],
    [
      b('Setting review dates and publishing results allows governments', '見直しの日程を定めて結果を公表することは／可能にします／政府が'),
      b('to revise policies without treating revision as failure', '改めることを／政策を／見直しを失敗とみなさずに'),
    ],
    [
      b('As climate conditions remain uncertain', '〜である中／気候条件が／不確かなまま'),
      b('the cities that adapt most successfully will probably be those that combine technical knowledge', '都市は／最もうまく適応する／おそらくそのような都市でしょう／組み合わせる／専門知識を'),
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
