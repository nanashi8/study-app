import { BATTLE_STUDENTS, battleStudentById } from './battleCast.js'
import {
  characterTalkHash,
  characterTalkPersonaById,
  resolveCharacterTalkCast,
} from './characterTalk.js'

export const CHARACTER_GRIEVANCE_STANCES = [
  {
    id: 'listen',
    label: 'じっくり聞く',
    emoji: '👂',
    description: '話を遮らず、気持ちを受け止める',
    lines: [
      '「うん、急がなくていいよ。最後まで聞く」',
      '「それはしんどかったね。もう少し話して」',
    ],
    playerEmotions: ['gentle', 'curious'],
    speakerEmotions: ['relieved', 'gentle'],
    companionEmotions: ['gentle', 'relieved'],
  },
  {
    id: 'ignore',
    label: 'スルーする',
    emoji: '💨',
    description: '愚痴には触れず、話題を変える',
    lines: [
      '「……そっか。ところで、次の授業って何だっけ？」',
      '「ごめん、今は別の話をしたいな」',
    ],
    playerEmotions: ['idle', 'embarrassed'],
    speakerEmotions: ['sad', 'embarrassed'],
    companionEmotions: ['worried', 'thinking'],
  },
  {
    id: 'cold',
    label: '冷たく返す',
    emoji: '🧊',
    description: '突き放すような言葉を返す',
    lines: [
      '「それくらい、自分で何とかしたら？」',
      '「愚痴を言っても、何も変わらないと思う」',
    ],
    playerEmotions: ['determined', 'angry'],
    speakerEmotions: ['hurt', 'angry'],
    companionEmotions: ['worried', 'angry'],
  },
  {
    id: 'encourage',
    label: '励ます',
    emoji: '📣',
    description: '頑張りを認め、次の一歩を支える',
    lines: [
      '「ここまで頑張ったの、ちゃんとすごいよ」',
      '「一人で抱えなくていい。次を一緒に考えよう」',
    ],
    playerEmotions: ['cheering', 'confident'],
    speakerEmotions: ['relieved', 'determined'],
    companionEmotions: ['cheering', 'confident'],
  },
]

const STANCE_BY_ID = new Map(CHARACTER_GRIEVANCE_STANCES.map((stance) => [stance.id, stance]))

function grievance(id, label, emotionId, lines) {
  return { id, label, emotionId, lines }
}

export const CHARACTER_GRIEVANCES = {
  mio: [
    grievance('choir-balance', '合唱部', 'worried', [
      'みんなの声をまとめたいのに、私が気にしすぎると空気まで固くなるんだ。どう言えばいいのか分からなくて。',
      '合唱で音がずれると、つい私ばかり焦っちゃう。楽しく歌いたいのに、細かいことが気になってしまうんだ。',
    ]),
    grievance('voice-condition', '声の調子', 'exhausted', [
      '今日は声が思うように出なくて、練習しても空回りしてる気がする。休むのも怖いんだよね。',
      '喉の調子が悪い日は、自分だけ置いていかれる感じがするの。無理しない方がいいって分かってるんだけど。',
    ]),
    grievance('word-problem', '数学', 'thinking', [
      '数学の文章題、何を聞かれているか分かるまでに時間がかかるんだ。周りが先へ進むと、余計に焦っちゃう。',
      '文章題を読むたびに数字がばらばらの音みたいに見えるの。落ち着けばいいのに、テストだとできなくて。',
    ]),
    grievance('mediator', '友だち', 'worried', [
      '友だち同士が気まずくなると、私が間に入らなきゃって思ってしまうの。ほんとは私も少し疲れてる。',
      'みんなの気持ちを聞いていたら、自分の気持ちを言う順番がなくなっちゃった。こういうの、少し寂しいね。',
    ]),
    grievance('expectation', '期待', 'embarrassed', [
      '穏やかでいなきゃって思われている気がして、悔しい日まで笑ってしまうんだ。たまには不機嫌でもいいのかな。',
      '「ミオなら大丈夫」って言われると、弱音を言いにくくなるの。大丈夫じゃない日だってあるのにね。',
    ]),
  ],
  ren: [
    grievance('unfinished-art', '作品づくり', 'exhausted', [
      '描いても描いても完成に見えなくて、締切だけが近づいてくる。どこで筆を置けばいいのか分からないんだ。',
      '直す場所ばかり見つかって、最初に好きだった絵が見えなくなってきた。完成させるって難しいね。',
    ]),
    grievance('group-compromise', '共同制作', 'worried', [
      '共同制作だから譲るのは分かるけど、僕の案が少しずつ消えていくのはやっぱり寂しいな。',
      'みんなの意見を混ぜたら、誰も本当に好きじゃない絵になりそうでさ。でも反対ばかりするのも嫌なんだ。',
    ]),
    grievance('criticism', '作品の評価', 'hurt', [
      '一生懸命描いたところを「よく分からない」で終わらされると、平気なふりをしても結構残るんだ。',
      '感想をもらえるのはありがたいけど、軽く笑われた一言だけがずっと頭に残ってる。消しゴムでも消えないね。',
    ]),
    grievance('listening', '英語', 'thinking', [
      '英語の聞き取り、音がつながると知っている単語まで別の形に聞こえる。何度戻しても同じで嫌になるよ。',
      'リスニングだけ、景色が速く流れて置いていかれる感じがするんだ。止めて描けたらいいのに。',
    ]),
    grievance('creative-slump', 'アイデア', 'sad', [
      '最近、何を見ても描きたいと思えないんだ。好きだったはずなのに、白い紙がただ白いままでさ。',
      '前は勝手に浮かんだ構図が、今は探しても見つからない。才能までどこかへ行った気がしてしまうよ。',
    ]),
  ],
  haru: [
    grievance('library-noise', '図書室', 'worried', [
      '図書室で騒いでいる人へ注意したら、僕だけ細かいみたいな顔をされたんだ。言い方が悪かったのかな。',
      '静かに読める場所を守りたいだけなのに、注意するたび嫌な役になるのが少しつらい。',
    ]),
    grievance('return-load', '委員の仕事', 'exhausted', [
      '返却本が一度に重なると、誰にも気づかれないまま仕事だけ増えていくんだ。今日はさすがに疲れたよ。',
      '図書委員の仕事、好きだけど当たり前みたいに任され続けると、少しくらい手伝ってって言いたくなる。',
    ]),
    grievance('ask-help', '質問', 'embarrassed', [
      '分からないって言うまでに考えすぎて、質問する頃には授業が終わってる。もっと早く声を出せればいいのに。',
      '質問したいのに、こんなことも知らないのかと思われそうで黙ってしまうんだ。結局、あとで困るのにね。',
    ]),
    grievance('fast-english', 'リスニング', 'thinking', [
      '英語の会話が速いと、最初の一文を考えている間に全部終わるんだ。手がかりを拾う暇もないよ。',
      '聞き取れなかった一語へ戻ろうとして、その先まで落としてしまう。分かっていても同じことをするんだ。',
    ]),
    grievance('quiet-misread', '自分の性格', 'sad', [
      '黙っていると「何も考えてない」って決められることがある。言葉を選んでいるだけなんだけどな。',
      '静かにしているのが好きなだけなのに、つまらなそうって心配されるんだ。無理に明るくするのも違うよね。',
    ]),
  ],
  akari: [
    grievance('failed-experiment', '実験', 'hurt', [
      '同じ条件にしたはずなのに、また結果がそろわなかった！ 原因が見えない失敗って、ほんと悔しい。',
      '三回やり直して全部違う結果なの。面白いより先に、もう器具を全部ひっくり返したい気分だよ。',
    ]),
    grievance('repeat-work', '記録', 'exhausted', [
      '新しい実験をしたいのに、確認と記録ばかりで一日が終わるんだ。大事だけど、正直ちょっと飽きた！',
      '同じ測定を何十回も繰り返すの、必要なのは分かるけど気持ちが先に走っちゃう。',
    ]),
    grievance('classical-grammar', '古文', 'thinking', [
      '古文の助動詞、見た目が似ているのに意味が変わりすぎ！ 実験ならラベルを貼れるのにな。',
      '助動詞を覚えても文の中だと判別できなくなるの。条件分岐が多すぎて、頭が煙を出しそう。',
    ]),
    grievance('idea-dismissed', 'アイデア', 'angry', [
      '試す前から「無理そう」で終わらされたの、まだ納得してない。失敗するかどうかは実験して決めたいよ。',
      '変な案って笑われたけど、変かどうかと役に立つかは別でしょ。ちゃんと聞いてほしかったな。',
    ]),
    grievance('always-energetic', '元気なふり', 'sad', [
      '私が黙ってると、みんなすぐ具合悪いのって聞くんだ。考えたい日だってあるのに。',
      'いつも元気で面白いことを言う役みたいになってて、今日は静かにしたいって言いにくいんだよね。',
    ]),
  ],
  kaito: [
    grievance('record-plateau', '陸上', 'hurt', [
      '毎日走ってるのに、タイムが全然縮まらない。頑張った分だけ速くなるわけじゃないの、分かってても悔しい。',
      'あと少しで自己ベストなのに、その少しがずっと遠いんだ。走るたび同じ数字を見るの、きついな。',
    ]),
    grievance('long-writing', '国語', 'thinking', [
      '国語の長い記述、言いたいことはあるのにマス目へ入らないんだ。走るより時間かかるよ。',
      '記述問題って、どこまで書けばいいかゴールが見えない。気づくと同じところをぐるぐる走ってる。',
    ]),
    grievance('summer-heat', '夏の練習', 'exhausted', [
      '朝練でも暑くて、今日は途中から足が全然動かなかった。気持ちだけ前へ行くの、危ないよな。',
      '夏の練習、休めって言われても仲間が走ってると止まりにくいんだ。置いていかれそうでさ。',
    ]),
    grievance('rest-guilt', '休むこと', 'worried', [
      '少し痛みがあるから休んだ方がいいって分かってる。でも休むと怠けてるみたいで落ち着かない。',
      '体を休めるのも練習って言うけど、走らない日は何もしてない気がするんだよな。',
    ]),
    grievance('impatience', '焦り', 'embarrassed', [
      'うまくいかないと、つい「もっとやればいい」って自分にも仲間にも言いすぎる。あとで毎回反省するんだ。',
      '待つのが苦手で、考えてる仲間を急かしちゃった。悪気はなかったけど、あの顔は忘れられないな。',
    ]),
  ],
  rei: [
    grievance('schedule-requests', '予定調整', 'exhausted', [
      'みんな「レイならまとめられる」って予定を持ってくるの。私の予定まで誰かにまとめてほしい日もあるわ。',
      '調整役を任されるのは嫌いじゃない。でも全員が自分の希望だけ言う日は、さすがに疲れる。',
    ]),
    grievance('perfection', '完璧さ', 'worried', [
      '一つ抜けているだけで、全部失敗したように感じてしまうの。そんな考え方は非効率だと分かっているのに。',
      '十分できていると言われても、できなかった一つばかり見てしまう。自分で自分を追い込んでいるわね。',
    ]),
    grievance('fairness', '公平さ', 'hurt', [
      '公平に決めたつもりでも、誰かには必ず不満が残る。責められるのが調整した私だけなのは、少し納得できない。',
      '全員の希望を聞いたのに、「レイが勝手に決めた」って言われたの。議事録を見せても気持ちは晴れないわ。',
    ]),
    grievance('art-deadline', '美術', 'thinking', [
      '美術は予定表どおりに発想が出てこないのが困るわ。締切は動かないのに、手だけが止まるの。',
      '時間を区切っても、絵はそこで完成してくれない。管理できないものへ向き合うのは苦手ね。',
    ]),
    grievance('cannot-ask', '頼ること', 'sad', [
      '頼られるのには慣れているのに、自分から「手伝って」が言えない。できない人に見られるのが怖いのかも。',
      '困っていることを説明する前に、自分で片づけた方が早いと思ってしまうの。そうしてまた抱え込むのよね。',
    ]),
  ],
  nao: [
    grievance('language-mistake', 'ことばの失敗', 'embarrassed', [
      '外国語を言い間違えて、みんなは笑ってくれたけど、今日は私も一緒には笑えなかったんだ。',
      '通じなかっただけなら平気。でも変な意味になったってあとで知って、急に恥ずかしくなっちゃった。',
    ]),
    grievance('math-proof', '数学', 'thinking', [
      '数学の証明って、頭では分かってるのに順番に書くと途中が抜けるの。会話なら言い直せるのにな。',
      '証明問題、ゴールは見えてるのに途中の言葉が出てこない！ 数式にもジェスチャーが使えたらいいのに。',
    ]),
    grievance('cheerful-role', '明るい役', 'sad', [
      '私が静かだと、みんなを心配させちゃうみたい。でも毎日ずっと盛り上げ役でいるのは疲れるよ。',
      '今日は聞く側でいたかったのに、「ナオ、何か面白い話して」って言われてさ。笑ったけど少し苦しかった。',
    ]),
    grievance('message-overload', 'メッセージ', 'exhausted', [
      'いろんなグループから連絡が来て、全部返してたら宿題の時間がなくなった。既読をつけるのが怖くなりそう。',
      '返事が早いって思われてるから、少し遅れるだけで心配されるの。スマホを置く時間もほしいな。',
    ]),
    grievance('event-prep', '交流会', 'worried', [
      '交流会で全員に楽しんでほしくて予定を増やしたら、準備する側がへとへと。欲張りすぎたかな。',
      '初参加の人を一人にしたくないけど、私一人で全員の隣にはいられない。どうしても気になっちゃう。',
    ]),
  ],
  tsubaki: [
    grievance('form-plateau', '剣道', 'hurt', [
      '何度直しても同じところで構えが崩れる。基本ができていない自分に、今日は腹が立つ。',
      '稽古では迷うなと言われるが、考えるほど体が遅れるんだ。積み重ねが足りないのかな。',
    ]),
    grievance('fast-listening', '英語', 'thinking', [
      '英語の聞き取りは、相手の速さへ合わせようとすると意味が抜ける。呼吸を整える間もない。',
      '一語聞き逃すと、その一語を追って残りも失う。同じ失敗を何度もするのが悔しい。',
    ]),
    grievance('strong-assumption', '強さ', 'sad', [
      '私なら平気だと思われているのか、つらいときほど誰も声をかけてこない。強く見えるのも考えものだな。',
      '弱音を吐くと驚かれる。それを見ると、やはり黙っていようと思ってしまうんだ。',
    ]),
    grievance('responsibility', '責任', 'worried', [
      '後輩の前では迷いを見せまいとしているが、私だって正解が分からない日もある。',
      '任された以上はやり切りたい。だが、全部一人で背負うのが正しいとも思えなくなってきた。',
    ]),
    grievance('fatigue', '疲れ', 'exhausted', [
      '朝稽古から授業まで集中を切らさないようにしていたら、今日はもう何も考えたくない。',
      '休めば戻る疲れだと分かっている。だが、休むと決めることの方が稽古より難しいな。',
    ]),
  ],
  noa: [
    grievance('mystery-bug', '不具合', 'hurt', [
      '再現しない不具合が一番困る。直ったように見えて、忘れた頃にまた出る。ずっと監視されてる気分。',
      '原因を一つ直したら別の場所が壊れた。今日のコード、私に恨みでもあるのかな。',
    ]),
    grievance('team-code', '共同開発', 'angry', [
      '相談なしで大きく書き換えられて、私の作業が全部ぶつかった。履歴は戻せても時間は戻らない。',
      '動けばいいって説明なしのコードを渡された。未来の誰かが困るって言ったのに、細かい扱いされたよ。',
    ]),
    grievance('classical-honorific', '古文', 'thinking', [
      '古文の敬語、誰から誰への敬意か追っているうちに主語まで見失う。ログが表示されればいいのに。',
      '同じ語でも相手で意味が変わるの、仕様が暗黙すぎる。説明書を先に読みたい。',
    ]),
    grievance('late-night', '夜更かし', 'exhausted', [
      'あと一か所だけ直すつもりで、また寝る時間を過ぎた。翌日の効率が落ちる方が損なのに止められない。',
      '動いた瞬間がうれしくて検証を続けたら、時計がひどい時間になってた。朝の自分に怒られそう。',
    ]),
    grievance('app-dismissed', '校内アプリ', 'sad', [
      '使いにくいって言われるのは直せるからいい。でも触りもしないで不要と言われたのは、少しきつい。',
      '時間をかけた機能を「誰が使うの」で終わらされた。必要な人をちゃんと説明できなかった私も悪いけど。',
    ]),
  ],
  yuu: [
    grievance('blank-page', '原稿', 'sad', [
      '書きたい場面はあるのに、最初の一文だけが出てこない。白いページに見張られているみたいだ。',
      '頭の中では登場人物が話しているのに、文字にすると全部よそ行きになる。今日は一行も好きになれない。',
    ]),
    grievance('critique', '感想', 'hurt', [
      '勇気を出して原稿を見せたら、直す所だけたくさん返ってきた。正しい感想ほど痛いこともあるね。',
      '作品への意見だと分かっているのに、自分まで否定された気持ちになる。切り分けるのが難しいよ。',
    ]),
    grievance('calculation-speed', '数学', 'thinking', [
      '計算は分かるのに、時間を測ると手が固まる。物語なら急がせないのに、数字は待ってくれない。',
      '途中式を丁寧に書くと間に合わず、省くと間違える。どちらを選んでも不安になるんだ。',
    ]),
    grievance('deadline', '部誌', 'exhausted', [
      'みんなの原稿を待ちながら自分の原稿も直していたら、締切が全部同じ日に見えてきた。',
      '部誌を完成させたい気持ちはある。でも好きで書いていたはずの時間が、予定表の枠に押しつぶされそうだ。',
    ]),
    grievance('quiet-voice', '会話', 'embarrassed', [
      '話し始めるまで考えていたら、別の話題へ進んでしまうことが多い。言えなかった言葉ばかり増えるよ。',
      '声が小さくて聞き返されると、二回目はもっと言いにくくなるんだ。大した話じゃないふりをしてしまう。',
    ]),
  ],
}

export const CHARACTER_GRIEVANCE_COUNT = Object.values(CHARACTER_GRIEVANCES)
  .reduce((total, items) => total + items.length, 0)

const NEGATIVE_TARGET_REACTIONS = {
  mio: {
    ignore: ['そっか……今は聞いてもらえるタイミングじゃなかったんだね。この話はしまっておくよ。', '話題を変えたいんだね。分かった。でも、少しだけ胸に残っちゃった。'],
    cold: ['そう言われると、弱音を話したことまで間違いみたいに聞こえるよ。もう少し一人でいるね。', '自分で何とかしなきゃいけないのは分かってる。でも今は、その言い方が少し痛いな。'],
  },
  ren: {
    ignore: ['話の上から別の色を塗られた感じだ。今は、この部分を見ない方がいいんだね。', 'そっちの話へ行くんだね。分かったよ。僕の話は余白に残しておく。'],
    cold: ['その線は思ったより深く残るな。話さなければよかったとまでは思いたくないけど。', '正しいかもしれない。でも今は、絵を丸ごと破られたみたいに聞こえたよ。'],
  },
  haru: {
    ignore: ['途中で本を閉じられたみたいだけど、今は続きまで読めないんだね。分かった。', '別の話にするんだね。僕の話は、しおりを挟んでおくよ。'],
    cold: ['そう言われると、このページを見せたことまで後悔しそうだ。少し静かにしているね。', '解決しなきゃいけないのは僕だよ。でも、今ほしかったのは結論だけじゃなかったんだ。'],
  },
  akari: {
    ignore: ['あ、話題を変えるんだね。了解。でも、このもやもやはまだ実験台に残ってる感じ。', '今はこの話じゃないってことか。分かったよ。あとで一人で原因を探してみる。'],
    cold: ['それは反応が強すぎるよ。私だって、ただ失敗を投げ出したいわけじゃない。', '自分で何とかする前に少しくらい愚痴ってもいいでしょ。今の言葉は予想より痛かった。'],
  },
  kaito: {
    ignore: ['そっか、ここでは止まらず次の話へ行くんだな。分かった。でも少し息が残ってる。', '今は聞く気分じゃないってことか。了解。ひとまず一人で走ってくるよ。'],
    cold: ['自分で何とかしたいから練習してるよ。でも、今はその一言が追い打ちみたいに感じる。', '愚痴だけで終わるつもりはない。でも突き放されると、さすがに足が止まるな。'],
  },
  rei: {
    ignore: ['話題変更ね。了解したわ。ただ、今の件が消えたわけではないことだけ覚えておいて。', '聞かないという選択も分かったわ。では、この話は私の方で保留にします。'],
    cold: ['解決する責任が私にあることは理解しているわ。でも、その言い方を受け入れる義務はない。', '愚痴だけで終えるつもりはないわ。だからこそ、今の返しは少し残念ね。'],
  },
  nao: {
    ignore: ['あ、話題変わっちゃった。うん、今はこの話を聞く余裕がなかったんだね。', 'Okay、別の話にしよう。でも、さっきの気持ちはまだ未送信のままかな。'],
    cold: ['それはちょっと刺さるよ。言い直してもらえたら、もう一度ちゃんと聞けるんだけどな。', '自分で動くつもりはあるよ。でも、弱音まで禁止されたみたいで悲しい。'],
  },
  tsubaki: {
    ignore: ['話を変えるのだな。承知した。だが、今の沈黙を平気だとは受け取らないでほしい。', '今は向き合わないということか。分かった。この件は自分で持ち帰ろう。'],
    cold: ['厳しさと突き放すことは違う。今の言葉には、私は納得できない。', '自分で立つつもりだ。だが、倒れかけた者へその言葉を向けるのは違うと思う。'],
  },
  noa: {
    ignore: ['入力を受け取らず次の処理へ進んだ感じ。了解。でも、この件は未解決のまま残る。', '話題変更を確認。今は聞く余裕がないなら、そう記録しておくよ。'],
    cold: ['その返答は問題解決に寄与しない上に、追加の不具合を増やしてると思う。', '自分で直すよ。でも、相談したこと自体をエラー扱いされるのは困る。'],
  },
  yuu: {
    ignore: ['僕の話だけ段落ごと飛ばされたみたいだ。今は読む余裕がなかったんだね。', '別の話へ進むんだね。分かった。この場面は、まだ書きかけのままにしておく。'],
    cold: ['その一言で、話していた場面の温度が急に下がったよ。少し離れて続きを考えるね。', '変えるのは僕の役目だ。でも今は、物語ごと否定されたみたいで苦しい。'],
  },
}

const NEGATIVE_WITNESS_REACTIONS = {
  mio: {
    ignore: ['話題を変える前に、「今は聞けない」って一言あると少しやさしいかも。', '聞く余裕がない日もあるよね。でも、置いていかれた気持ちは残りそう。'],
    cold: ['今の言葉、少し強く響いたよ。伝え直せるなら、私は待つね。', '解決を急ぐより先に、痛かった気持ちだけは受け止めてもいいと思う。'],
  },
  ren: {
    ignore: ['話題を塗り替えた跡が、少し目立ってる。今は聞けないって線を残してもよかったね。', '余白へ追いやられた話も消えないよ。あとで見直せるといいな。'],
    cold: ['その色はかなり強い。もう少し薄く重ねても、言いたいことは伝わると思う。', '突き放す線だけだと出口がなくなる。描き直す余白は残しておこう。'],
  },
  haru: {
    ignore: ['途中のページを飛ばすなら、あとで戻るしおりがあるといいと思う。', '今は読めないと伝えるだけでも、話を捨てたことにはならないよ。'],
    cold: ['正論だけでは読めないページもあるよ。今は少し言葉を置き直した方がいい。', 'その一文は強すぎると思う。結論の前に、気持ちを読む時間が必要だよ。'],
  },
  akari: {
    ignore: ['話題変更で反応を止めても、もやもやの原因は消えないよ。あとで再実験しよう。', '聞く余裕がないなら、それを先に伝えた方が誤差は小さくなると思う！'],
    cold: ['今の返し、刺激が強すぎ！ もう少し安全な言い方に変えよう。', 'その言葉で結果が良くなるかは疑問だな。別の返しを試す価値があるよ。'],
  },
  kaito: {
    ignore: ['今は伴走できないなら、そう言って一度止まるのもありだと思う。', '話題を変えても疲れは置いていけないよ。あとで戻ってこよう。'],
    cold: ['今のは背中を押すより突き飛ばしてる。言い直した方がいい。', '厳しくするなら、次に立つ場所も一緒に示さないと走れないよ。'],
  },
  rei: {
    ignore: ['聞く余裕がないことと、無視することは分けた方がいいわ。短く伝え直しましょう。', '議題変更は可能よ。ただし、未処理の気持ちまで削除しないこと。'],
    cold: ['その表現は目的に対して攻撃性が高すぎるわ。内容を保ったまま言い換えられる。', '解決を促すことと、相手を傷つけることは別です。今の返答は再検討が必要ね。'],
  },
  nao: {
    ignore: ['話せない日なら “not now” って伝えて、あとで戻ればいいんじゃないかな。', '会話を切り替える前に、聞こえてたよって合図だけは送っておきたいな。'],
    cold: ['今の言い方は翻訳してもやっぱり冷たいよ。別の言葉を探そう。', '同じ意味でも、相手を一人にしない言い方はあると思う。言い直してみない？'],
  },
  tsubaki: {
    ignore: ['聞けないなら、正面からそう伝えるべきだ。黙ってかわすのは誤解を残す。', '話を変える前に一礼するような言葉があれば、受け取り方は違っただろう。'],
    cold: ['それは厳しさではない。ただ相手を遠ざける言葉だ。', '立ち直る力を求めるにしても、今の一言は必要以上に傷を増やしている。'],
  },
  noa: {
    ignore: ['要求を保留にするなら、保留だと返す方が通信として正確。無応答は不具合を生む。', '別タスクへ移る前に、あとで戻るかどうかだけ共有した方がいい。'],
    cold: ['その応答は問題を一件増やした。内容を変えずに、攻撃性だけ下げられるはず。', '冷たい返答で処理を終了しても、原因は残る。言い直しを推奨する。'],
  },
  yuu: {
    ignore: ['場面を飛ばすなら、あとで戻る伏線を一つ置いてほしいな。', '聞けないと伝える一文があれば、この話は消えずに待てると思う。'],
    cold: ['今の台詞は、相手を立ち直らせる役より傷つける役が強すぎるよ。', '厳しい言葉を使う場面でも、逃げ道まで閉じる必要はないと思う。'],
  },
}

function cyclePick(list, turn, ...parts) {
  const start = characterTalkHash(parts.join('|')) % list.length
  return list[(start + turn) % list.length]
}

export function characterGrievanceStanceById(id) {
  return STANCE_BY_ID.get(id) ?? CHARACTER_GRIEVANCE_STANCES[0]
}

export function characterGrievancePrompt({ speakerId, seed = 0, turn = 0 }) {
  const speaker = battleStudentById(speakerId)
  const grievances = CHARACTER_GRIEVANCES[speaker.id] ?? CHARACTER_GRIEVANCES.mio
  const start = characterTalkHash(`grievance|${speaker.id}|${seed}`) % grievances.length
  const item = grievances[(start + turn) % grievances.length]
  return {
    ...item,
    text: cyclePick(item.lines, turn, 'grievance-line', speaker.id, item.id, seed),
  }
}

export function characterGrievanceChoices({ playerId, speakerId, seed = 0, turn = 0 }) {
  return CHARACTER_GRIEVANCE_STANCES.map((stance) => ({
    ...stance,
    text: cyclePick(
      stance.lines,
      turn,
      'grievance-choice', playerId, speakerId, stance.id, seed,
    ),
  }))
}

export function createCharacterGrievanceExchange({
  playerId,
  speakerId,
  companionId,
  stanceId,
  seed = 0,
  turn = 0,
}) {
  const { player, speaker, companion } = resolveCharacterTalkCast({
    playerId,
    speakerId,
    companionId,
    seed: `${seed}|grievance|${turn}`,
  })
  const prompt = characterGrievancePrompt({ speakerId: speaker.id, seed, turn })
  const stance = characterGrievanceStanceById(stanceId)
  const choice = characterGrievanceChoices({
    playerId: player.id,
    speakerId: speaker.id,
    seed,
    turn,
  }).find((item) => item.id === stance.id)
  const speakerPersona = characterTalkPersonaById(speaker.id)
  const companionPersona = characterTalkPersonaById(companion.id)
  const speakerReplies = stance.id === 'listen'
    ? speakerPersona.responses.empathy
    : stance.id === 'encourage'
      ? speakerPersona.responses.action
      : NEGATIVE_TARGET_REACTIONS[speaker.id][stance.id]
  const companionReplies = stance.id === 'listen'
    ? companionPersona.reactions.empathy
    : stance.id === 'encourage'
      ? companionPersona.reactions.action
      : NEGATIVE_WITNESS_REACTIONS[companion.id][stance.id]

  return {
    player,
    speaker,
    companion,
    prompt,
    stance,
    choice,
    messages: [
      {
        id: `grievance-${seed}-${turn}-${speaker.id}-${prompt.id}`,
        role: 'character',
        studentId: speaker.id,
        emotionId: prompt.emotionId,
        text: prompt.text,
      },
      {
        id: `grievance-user-${seed}-${turn}-${player.id}-${stance.id}`,
        role: 'user',
        studentId: player.id,
        emotionId: cyclePick(stance.playerEmotions, turn, 'grievance-player-emotion', player.id, stance.id, seed),
        text: choice.text,
      },
      {
        id: `grievance-answer-${seed}-${turn}-${speaker.id}-${stance.id}`,
        role: 'character',
        studentId: speaker.id,
        emotionId: cyclePick(stance.speakerEmotions, turn, 'grievance-speaker-emotion', speaker.id, stance.id, seed),
        text: cyclePick(speakerReplies, turn, 'grievance-answer', speaker.id, stance.id, prompt.id, seed),
      },
      {
        id: `grievance-witness-${seed}-${turn}-${companion.id}-${stance.id}`,
        role: 'character',
        studentId: companion.id,
        emotionId: cyclePick(stance.companionEmotions, turn, 'grievance-companion-emotion', companion.id, stance.id, seed),
        text: cyclePick(companionReplies, turn, 'grievance-witness', companion.id, stance.id, prompt.id, seed),
      },
    ],
  }
}

export function characterGrievancePatternCount() {
  let total = 0
  for (const speaker of BATTLE_STUDENTS) {
    const speakerPersona = characterTalkPersonaById(speaker.id)
    for (const prompt of CHARACTER_GRIEVANCES[speaker.id]) {
      for (const companion of BATTLE_STUDENTS) {
        if (companion.id === speaker.id) continue
        const companionPersona = characterTalkPersonaById(companion.id)
        const playerCount = BATTLE_STUDENTS.filter(
          (player) => player.id !== speaker.id && player.id !== companion.id,
        ).length
        for (const stance of CHARACTER_GRIEVANCE_STANCES) {
          const speakerReplyCount = stance.id === 'listen'
            ? speakerPersona.responses.empathy.length
            : stance.id === 'encourage'
              ? speakerPersona.responses.action.length
              : NEGATIVE_TARGET_REACTIONS[speaker.id][stance.id].length
          const companionReplyCount = stance.id === 'listen'
            ? companionPersona.reactions.empathy.length
            : stance.id === 'encourage'
              ? companionPersona.reactions.action.length
              : NEGATIVE_WITNESS_REACTIONS[companion.id][stance.id].length
          total += playerCount
            * prompt.lines.length
            * stance.lines.length
            * speakerReplyCount
            * companionReplyCount
        }
      }
    }
  }
  return total
}

export const CHARACTER_GRIEVANCE_PATTERN_COUNT = characterGrievancePatternCount()
