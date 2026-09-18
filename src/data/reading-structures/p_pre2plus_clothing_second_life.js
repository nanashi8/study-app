import { st } from './entry.js'

export default Object.freeze([
  st('[S {動名詞| [V Producing] [O clothing]}] [V requires] [O {並列| water, | energy, | labor, | and transportation {前| across long distances}}].', {
    chunks: [
      ['Producing clothing requires', '衣服を生産するには〜が必要です（何がかは次へ）'],
      ['water, energy, labor, and transportation', '水、エネルギー、労働、そして輸送が'],
      ['across long distances', '長い距離にわたる（輸送が）'],
    ],
    notes: {
      'Producing clothing requires': 'Producing clothing は動名詞のまとまりで、文の主語です。',
      'water, energy, labor, and transportation': 'requires の目的語に4つが and で並んでいます。',
      'across long distances': 'across long distances は transportation を後ろから説明して「長い距離にわたる輸送」。',
    },
  }),
  st('[M Yet] [S many useful clothes] [V are thrown] [M away] [M {副詞節:理由| [接 because] [S styles] [V change] [接 or] [S small parts] [V break]}].', {
    chunks: [
      ['Yet many useful clothes are thrown away', 'しかし、まだ使える多くの服が捨てられています'],
      ['because styles change', '流行が変わったり'],
      ['or small parts break', '小さな部分が壊れたりするため'],
    ],
    notes: {
      'Yet many useful clothes are thrown away': 'Yet は「しかし」。are thrown away は throw away（捨てる）の受け身です。',
      'or small parts break': 'or は because の節の中で、styles change と small parts break の2つの理由を並べています。',
    },
  }),
  st('[S Donation] [V can help], [接 but] [S not every donated item] [V finds] [O a new owner].', {
    chunks: [
      ['Donation can help,', '寄付は役に立つことがあります'],
      ['but not every donated item', 'しかし、寄付された品のすべてが〜わけではありません（何がかは次へ）'],
      ['finds a new owner', '新しい持ち主を見つける（わけではありません）'],
    ],
    notes: {
      'Donation can help,': 'can は「〜することがある」という可能性を表します。',
      'but not every donated item': 'not … every は「すべてが〜というわけではない」という部分否定です。',
    },
  }),
  st('[S {動名詞| [V Sending] [O unwanted clothing] [M overseas]}] [V can shift] [O disposal costs] [M {前| to communities {関係>communities| [S that] [V cannot use] [O every item]}}].', {
    chunks: [
      ['Sending unwanted clothing overseas', '不要な衣服を海外へ送ることは'],
      ['can shift disposal costs', '処分の費用を移すことがあります（どこへかは次へ）'],
      ['to communities that cannot use every item', 'すべての品を使えるわけではない地域へ'],
    ],
    notes: {
      'Sending unwanted clothing overseas': 'Sending から overseas までが動名詞のまとまりで、文の主語です。',
      'can shift disposal costs': 'shift A to B で「AをBへ移す」。disposal costs は「処分にかかる費用」。',
      'to communities that cannot use every item': 'cannot use every item は「すべての品を使えるわけではない」という部分否定です。',
    },
    rules: ['relative-clause', 'negation-scope', 'ing-ed-role'],
  }),
  st('[S A group {前| of schools}] [V created] [O a clothing exchange {前| with a repair station}].', {
    chunks: [
      ['A group of schools created a clothing exchange', 'いくつかの学校が衣服の交換会を開きました（どんな交換会かは次へ）'],
      ['with a repair station', '修理コーナーのある（交換会を）'],
    ],
    notes: {
      'A group of schools created a clothing exchange': 'A group of schools は「いくつかの学校」。clothing exchange は服を交換する催しです。',
      'with a repair station': 'with a repair station は a clothing exchange を後ろから説明して「修理コーナーのある」。',
    },
  }),
  st('[S Families] [V brought] [O clean items] [接 and] [V described] [O any damage] [M {前| on a small card}].', {
    chunks: [
      ['Families brought clean items', '家族は清潔な品を持ってきました'],
      ['and described any damage on a small card', 'そして、傷みがあれば小さなカードに書きました'],
    ],
    notes: {
      'and described any damage on a small card': 'and の後ろの described の主語も Families です。any damage は「傷んでいる点があればどれでも」。',
    },
  }),
  st('[S Volunteers] [V sorted] [O the clothes] [M {前| by {並列| size | and condition}} {前| rather than {前| by price}}].', {
    chunks: [
      ['Volunteers sorted the clothes', 'ボランティアは服を分けました（何によってかは次へ）'],
      ['by size and condition', 'サイズと状態によって'],
      ['rather than by price', '価格によってではなく'],
    ],
    notes: {
      'Volunteers sorted the clothes': 'sort は「仕分ける・分類する」。',
      'rather than by price': 'A rather than B で「BではなくA」。実際に使った基準が前、使わなかった基準が後ろです。',
    },
  }),
  st('[M {前| At the repair table}], [S visitors] [V learned] [O {to:名詞| [V to replace] [O buttons] [接 and] [V close] [O simple tears]}].', {
    chunks: [
      ['At the repair table,', '修理テーブルでは'],
      ['visitors learned', '来場者は〜を学びました（何をかは次へ）'],
      ['to replace buttons', 'ボタンを付け替えることや'],
      ['and close simple tears', '簡単な破れをふさぐことを'],
    ],
    notes: {
      'visitors learned': 'learn to 〜 で「〜のし方を学ぶ」。',
      'and close simple tears': 'and は to replace と (to) close をつないでいます。tear は「破れ・裂け目」。',
    },
  }),
  st('[S A repair] [V did not need] [O {to:名詞| [V to look] [C perfect]}]; [S it] [V needed] [O {to:名詞| [V to make] [O the item] [C {並列| safe | and useful}]}].', {
    chunks: [
      ['A repair did not need to look perfect;', '修理は見た目が完璧である必要はありませんでした'],
      ['it needed to make the item', 'その品を〜にする必要がありました（どんな状態かは次へ）'],
      ['safe and useful', '安全で役に立つもの（に）'],
    ],
    notes: {
      'A repair did not need to look perfect;': 'look ＋ 形容詞 で「〜に見える」。not は need を打ち消しています。',
      'it needed to make the item': 'it は A repair を指します。make ＋ もの ＋ 形容詞 で「ものを〜の状態にする」。',
    },
  }),
  st('[S Clothes {関係>Clothes| [S that] [V could not be worn]}] [V were not] [M automatically] [V counted] [C {前| as useless}].', {
    chunks: [
      ['Clothes that could not be worn', '着ることができない服も'],
      ['were not automatically counted', 'そのまま〜として扱われたわけではありませんでした（何としてかは次へ）'],
      ['as useless', '役に立たないもの（として）'],
    ],
    notes: {
      'Clothes that could not be worn': 'could not be worn は wear（着る）の受け身で「着られない」。',
      'were not automatically counted': 'count A as B（AをBとみなす）の受け身です。automatically は「そのまま・当然のように」。',
    },
    rules: ['passive-active', 'relative-clause', 'paragraph-map'],
  }),
  st('[S Some cotton shirts] [V became] [C cleaning cloths], [M {副詞節:対比| [接 while] [S artists] [V used] [O colorful material] [M {前| in school projects}]}].', {
    chunks: [
      ['Some cotton shirts became cleaning cloths,', '綿のシャツの一部は掃除用の布になりました'],
      ['while artists used colorful material', '一方、芸術家たちは色鮮やかな素材を使いました（どこでかは次へ）'],
      ['in school projects', '学校の作品づくりで'],
    ],
    notes: {
      'Some cotton shirts became cleaning cloths,': 'become ＋ 名詞 で「〜になる」。cleaning cloths は「掃除用の布」。',
      'while artists used colorful material': 'while はここでは「一方で」と2つの使い道を対比します。',
    },
  }),
  st('[M However], [S mixed materials] [V were] [M often] [C difficult {to:副詞(形容詞)| [V to reuse] [M safely]}].', {
    chunks: [
      ['However, mixed materials were often difficult', 'しかし、混ざった素材は難しいことがよくありました（何がかは次へ）'],
      ['to reuse safely', '安全に再利用するのが'],
    ],
    notes: {
      'However, mixed materials were often difficult': 'mixed materials は「何種類かが混ざった素材」。',
      'to reuse safely': 'difficult to 〜 で「〜するのが難しい」。to reuse は形容詞 difficult の内容を説明します。',
    },
  }),
  st('[S Items {過去分詞>Items| [V made] [M {前| from one clearly labeled material}]}] [V were] [C easier {to:副詞(形容詞)| [V to sort]} {前| than items {前| with hidden mixtures}}].', {
    chunks: [
      ['Items made from one clearly labeled material', 'はっきり表示された1種類の素材でできた品は'],
      ['were easier to sort', '分類しやすいものでした（何よりかは次へ）'],
      ['than items with hidden mixtures', '素材が見えないところで混ざっている品より'],
    ],
    notes: {
      'Items made from one clearly labeled material': 'made は過去分詞で Items を後ろから説明して「〜でできた品」。labeled は「表示された」。',
      'were easier to sort': 'easier は easy の比較級です。easy to sort で「分類しやすい」。',
      'than items with hidden mixtures': 'than の後ろが比べる相手です。hidden mixtures は「見えないところで混ざっていること」。',
    },
  }),
  st('[S The organizers] [V wanted] [O {to:名詞| [V to know] [O {whether節| [接 whether] [S the exchange] [M truly] [V reduced] [O waste]}]}].', {
    chunks: [
      ['The organizers wanted to know', '主催者は知りたいと考えました（何をかは次へ）'],
      ['whether the exchange truly reduced waste', '交換会が本当にごみを減らしたかどうかを'],
    ],
    notes: {
      'The organizers wanted to know': 'organizer は「主催者・まとめ役」。',
      'whether the exchange truly reduced waste': 'whether 以下のまとまりが to know の目的語です。truly は「本当に」。',
    },
  }),
  st('[S {動名詞| [V Counting] [O exchanged items] [M alone]}] [V would give] [O an incomplete answer].', {
    chunks: [
      ['Counting exchanged items alone', '交換された品を数えるだけでは'],
      ['would give an incomplete answer', '不完全な答えしか得られないでしょう'],
    ],
    notes: {
      'Counting exchanged items alone': 'Counting から alone までが動名詞のまとまりで、文の主語です。alone は「〜だけ」。',
      'would give an incomplete answer': 'would は「〜だろう」という控えめな言い方です。incomplete は「不完全な」。',
    },
  }),
  st('[S A shirt] [V has] [O little environmental benefit] [M {副詞節:条件| [接 if] [S it] [V remains] [C unused] [M {前| in another closet}]}].', {
    chunks: [
      ['A shirt has little environmental benefit', 'シャツには環境への利点がほとんどありません'],
      ['if it remains unused in another closet', '別のクローゼットで使われないままなら'],
    ],
    notes: {
      'A shirt has little environmental benefit': 'little は「ほとんどない」という否定の意味です。',
      'if it remains unused in another closet': 'remain ＋ 形容詞 で「〜のままである」。it は A shirt を指します。',
    },
  }),
  st('[S Participants] [M therefore] [V answered] [O a later survey {前| about {what節| [O what] [S they] [M actually] [V wore]}}].', {
    chunks: [
      ['Participants therefore answered a later survey', 'そこで参加者は、後日のアンケートに答えました（何についてかは次へ）'],
      ['about what they actually wore', '実際に何を着たかについての（アンケートに）'],
    ],
    notes: {
      'Participants therefore answered a later survey': 'therefore は「そこで」で、前の2文の理由を受けています。',
      'about what they actually wore': 'what 以下は「何を〜か」という名詞のまとまりで、about の目的語です。wore は wear の過去形です。',
    },
  }),
  st('[S The survey] [V asked] [O {whether節| [接 whether] [S an exchanged item] [V replaced] [O a planned purchase]}], [M {副詞節:理由| [接 since] [S that choice] [V could reduce] [O new production]}].', {
    chunks: [
      ['The survey asked', 'アンケートは尋ねました（何をかは次へ）'],
      ['whether an exchanged item replaced a planned purchase,', '交換した品が、買う予定だった品の代わりになったかどうかを'],
      ['since that choice could reduce new production', 'そうした選択なら新たな生産を減らせるからです'],
    ],
    notes: {
      'whether an exchanged item replaced a planned purchase,': 'replace は「〜の代わりになる」。a planned purchase は「買う予定だった品」。',
      'since that choice could reduce new production': 'since はここでは「〜だから」と理由を示します。',
    },
  }),
  st('[S The project] [M also] [V had to consider] [O {並列| hygiene, | personal taste, | and dignity}].', {
    chunks: [
      ['The project also had to consider', 'その活動は〜にも配慮しなければなりませんでした（何にかは次へ）'],
      ['hygiene, personal taste, and dignity', '衛生、個人の好み、そして尊厳'],
    ],
    notes: {
      'The project also had to consider': 'had to は have to（〜しなければならない）の過去形です。',
      'hygiene, personal taste, and dignity': 'consider の目的語に3つが and で並んでいます。personal taste は「個人の好み」。',
    },
    rules: ['parallel-shape', 'paragraph-map', 'main-clause-skeleton'],
  }),
  st('[S Nobody] [V was required] [C {to:補語| [V to explain] [O {疑問詞節| [M why] [S they] [V wanted] [O {並列| free | or low-cost clothing}]}]}].', {
    chunks: [
      ['Nobody was required to explain', 'だれも説明するよう求められませんでした（何をかは次へ）'],
      ['why they wanted free or low-cost clothing', 'なぜ無料や安い服をほしいと思ったのかを'],
    ],
    notes: {
      'Nobody was required to explain': 'Nobody は「だれも〜ない」。require ＋ 人 ＋ to 〜（人に〜するよう求める）の受け身です。',
      'why they wanted free or low-cost clothing': 'why 以下は「なぜ〜か」という名詞のまとまりで、explain の目的語です。low-cost は「低価格の」。',
    },
  }),
  st('[S {並列| Students, | teachers, | and neighbors}] [M all] [V used] [O the same {並列| tables | and choice system}].', {
    chunks: [
      ['Students, teachers, and neighbors all used', '生徒も先生も近所の人も、みな使いました（何をかは次へ）'],
      ['the same tables and choice system', '同じテーブルと同じ選び方の仕組みを'],
    ],
    notes: {
      'Students, teachers, and neighbors all used': 'all は主語をまとめて「みな」。3つの主語が and で並んでいます。',
      'the same tables and choice system': 'the same は tables と choice system の両方にかかります。だれも別扱いにしなかったということです。',
    },
  }),
  st('[S The exchange] [V showed] [O {that節| [接 that] [S local action] [V can extend] [O the life {前| of many products}]}].', {
    chunks: [
      ['The exchange showed that local action', 'その交換会は、地域の行動が〜ことを示しました（何ができるかは次へ）'],
      ['can extend the life of many products', '多くの製品の寿命を延ばせる（ことを）'],
    ],
    notes: {
      'The exchange showed that local action': 'that 以下が showed の目的語で、local action がその節の主語です。can extend は「延ばせる」。',
      'can extend the life of many products': 'the life of many products は「多くの製品の寿命」。extend は「延ばす」。',
    },
  }),
  st('[S It] [M also] [V revealed] [O problems {関係>problems| [O that] [S local volunteers] [V could not solve] [M alone]}].', {
    chunks: [
      ['It also revealed problems', 'それはまた、問題も明らかにしました（どんな問題かは次へ）'],
      ['that local volunteers could not solve alone', '地域のボランティアだけでは解決できない（問題を）'],
    ],
    notes: {
      'It also revealed problems': 'It は前の文の The exchange を指します。reveal は「明らかにする」。',
      'that local volunteers could not solve alone': 'solve の目的語が that で、alone は「自分たちだけで」。',
    },
  }),
  st('[S The organizers] [V reported] [O {並列| successful exchanges | and waste {関係省略:目的格>waste| [S they] [V could not process]}}]; [S they] [V did not publish] [O only a cheerful total].', {
    chunks: [
      ['The organizers reported successful exchanges', '主催者は、うまくいった交換を報告しました'],
      ['and waste they could not process;', 'そして、処理できなかった廃棄物も（報告しました）'],
      ['they did not publish only a cheerful total', '明るい合計の数だけを公表することはしませんでした'],
    ],
    notes: {
      'and waste they could not process;': 'reported の目的語は successful exchanges と waste の2つです。',
      'they did not publish only a cheerful total': 'not … only は「〜だけを…するのではない」。a cheerful total は「うまくいった分だけを足した明るい数字」。',
    },
  }),
  st('[S Manufacturers] [V influence] [O waste] [M {副詞節:時| [接 when] [S they] [V choose] [O materials] [接 and] [V decide] [O {whether節| [接 whether] [S products] [V can be repaired]}]}].', {
    chunks: [
      ['Manufacturers influence waste', 'メーカーは廃棄物に影響を与えます（いつかは次へ）'],
      ['when they choose materials', '素材を選ぶときや'],
      ['and decide whether products can be repaired', '製品を修理できるようにするかどうかを決めるときに'],
    ],
    notes: {
      'Manufacturers influence waste': 'manufacturer は「製造業者・メーカー」。',
      'and decide whether products can be repaired': 'whether 以下のまとまりが decide の目的語です。can be repaired は repair の受け身です。',
    },
  }),
  st('[S A useful second life] [V begins] [M {前| with {並列| exchange | and repair}}], [接 but] [S it] [M also] [V depends] [M {前| on {並列| durable design | and fewer unnecessary purchases}}].', {
    chunks: [
      ['A useful second life begins', '役に立つ二度目の生は始まります（何からかは次へ）'],
      ['with exchange and repair,', '交換と修理から'],
      ['but it also depends', 'しかし、それは〜にもかかっています（何にかは次へ）'],
      ['on durable design and fewer unnecessary purchases', '丈夫な設計と、不必要な購入を減らすことに'],
    ],
    notes: {
      'A useful second life begins': 'a useful second life は題名の「役立つ二度目の生」です。begin with 〜 で「〜から始まる」。',
      'but it also depends': 'it は A useful second life を指します。',
      'on durable design and fewer unnecessary purchases': 'depend on 〜 で「〜次第である」。durable は「丈夫な」、fewer unnecessary purchases は「不必要な買い物が減ること」。',
    },
  }),
])
