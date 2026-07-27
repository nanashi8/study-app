// 英会話ライトノベル（English-only Visual Novel）のシナリオデータ。
//
// 世界設定：英語しか通じない小さな町の学校に転入する。会話はすべて英語。
//   学校生活を舞台に、受験（英検・大学入試）で問われる英会話の「機能表現」
//   （あいさつ・依頼・提案・許可・申し出・謝罪 など）を場面で体験する。
//
// 設計：3択はどれを選んでも話がつながる（合流型）。各選択肢は同じ場面で使える
//   別の言い回しで、選ぶと相手の反応(reply)が変わるが、次の場面(next)は共通。
//   これにより「同じ働きの色々な表現」を1場面で味わえる。
//
//   ノード（nodes[id]）:
//     speaker  … SPEAKERS のキー、または 'narration'
//     en, ja   … セリフ（en＝英語／ja＝和訳ヘルプ）
//     note     … 表現メモ { label, en, ja }（任意・受験ポイントの要点）
//     next     … 次ノードid（セリフ/ナレーションのとき）
//     choices  … プレイヤーの選択肢 [{ en, ja, reply:{speaker?, en, ja}, next }]
//     end      … true ならエピソード終了

export const SPEAKERS = {
  you: { name: 'You', jaName: 'あなた', emoji: '🙂', color: '#6366f1', side: 'right' },
  lisa: { name: 'Lisa', jaName: 'リサ', emoji: '👧', color: '#ec4899', side: 'left' },
  kenta: { name: 'Kenta', jaName: 'ケンタ', emoji: '👦', color: '#0ea5e9', side: 'left' },
  brown: { name: 'Ms. Brown', jaName: 'ブラウン先生', emoji: '👩‍🏫', color: '#10b981', side: 'left' },
  senpai: { name: 'Senior', jaName: '先輩', emoji: '🧑', color: '#f59e0b', side: 'left' },
  // 異世界編の仲間たち
  aria: { name: 'Aria', jaName: 'アリア', emoji: '🧝‍♀️', color: '#22c55e', side: 'left' },
  leon: { name: 'Leon', jaName: 'レオン', emoji: '🛡️', color: '#ef4444', side: 'left' },
  sage: { name: 'Sage', jaName: '賢者', emoji: '🧙', color: '#8b5cf6', side: 'left' },
  child: { name: 'Lost Child', jaName: '迷子', emoji: '🧒', color: '#f97316', side: 'left' },
  boatman: { name: 'Boatman', jaName: '船頭', emoji: '🧓', color: '#0f766e', side: 'left' },
  narrator: { name: 'Narrator', jaName: '語り手', emoji: '💬', color: '#64748b', side: 'left' },
}

export const VN_EPISODES = [
  // ════════════ Episode 1：転校初日 ════════════
  {
    id: 'ep1_first_day',
    title: 'First Day at School',
    titleJa: '転校初日',
    emoji: '🏫',
    color: '#6366f1',
    blurb: 'はじめての学校。あいさつ・自己紹介・道のたずね方を英語で。',
    focus: ['あいさつ', '自己紹介', '出身をきく', '道をたずねる', 'お礼'],
    start: 'intro',
    nodes: {
      intro: {
        speaker: 'narration',
        en: "It's your first day at a new school in a small English-speaking town. You take a deep breath and open the classroom door.",
        ja: '英語しか通じない小さな町の学校。転入初日のあなたは、深呼吸して教室のドアを開けた。',
        next: 'teacher1',
      },
      teacher1: {
        speaker: 'brown',
        en: 'Good morning, everyone. We have a new student today. Please come in and introduce yourself.',
        ja: 'みなさんおはよう。今日は転入生が来ています。さあ、入って自己紹介してね。',
        next: 'selfintro',
      },
      selfintro: {
        speaker: 'narration',
        en: 'Everyone is looking at you. Time to introduce yourself.',
        ja: 'みんなが注目している。自己紹介の時間だ。',
        note: {
          label: '自己紹介の基本',
          en: "I'm ~ . / My name is ~ . / Nice to meet you.",
          ja: '名乗りは I’m ~ か My name is ~。「はじめまして」は Nice to meet you。',
        },
        choices: [
          {
            en: "Hello, I'm Yuto. Nice to meet you.",
            ja: 'こんにちは、ユウトです。はじめまして。',
            reply: { speaker: 'brown', en: 'Nice to meet you too, Yuto. Welcome to our class!', ja: 'こちらこそはじめまして、ユウト。ようこそ！' },
            next: 'sit',
          },
          {
            en: 'Hi, my name is Yuto. I just moved here from Japan.',
            ja: 'やあ、ユウトといいます。日本から引っ越してきたばかりです。',
            reply: { speaker: 'brown', en: "Thank you, Yuto. I'm sure you'll make friends soon.", ja: 'ありがとう、ユウト。すぐに友達ができるわよ。' },
            next: 'sit',
          },
          {
            en: "Good morning. I'm Yuto, and I'm happy to be here.",
            ja: 'おはようございます。ユウトです。ここに来られてうれしいです。',
            reply: { speaker: 'brown', en: 'What a polite greeting! Welcome aboard.', ja: 'なんて礼儀正しいあいさつ！ようこそ。' },
            next: 'sit',
          },
        ],
      },
      sit: {
        speaker: 'brown',
        en: 'You can sit next to Lisa. Lisa, could you help Yuto today?',
        ja: 'リサの隣に座って。リサ、今日はユウトを手伝ってあげてね。',
        next: 'lisa1',
      },
      lisa1: {
        speaker: 'lisa',
        en: "Hi! I'm Lisa. Nice to meet you!",
        ja: 'やあ！リサだよ。はじめまして！',
        note: {
          label: '「こちらこそ」の返し方',
          en: 'Nice to meet you, too. / Likewise.',
          ja: '相手の Nice to meet you. には too や Likewise（こちらこそ）で返す。',
        },
        choices: [
          {
            en: 'Nice to meet you too, Lisa.',
            ja: 'こちらこそはじめまして、リサ。',
            reply: { en: "Great! Let's get along.", ja: 'よろしくね！仲良くしよう。' },
            next: 'where',
          },
          {
            en: 'Pleased to meet you, Lisa.',
            ja: 'お会いできてうれしいです、リサ。',
            reply: { en: 'Wow, your English sounds polite!', ja: 'わあ、ていねいな英語だね！' },
            next: 'where',
          },
          {
            en: 'Hi Lisa! Thanks for helping me.',
            ja: 'やあリサ！手伝ってくれてありがとう。',
            reply: { en: 'No problem at all!', ja: 'ぜんぜん平気だよ！' },
            next: 'where',
          },
        ],
      },
      where: {
        speaker: 'lisa',
        en: 'So, where are you from?',
        ja: 'ところで、出身はどこ？',
        note: {
          label: '出身をきく／答える',
          en: "Where are you from? — I'm from ~ . / I come from ~ .",
          ja: '出身は Where are you from? と聞き、I’m from ~. や I come from ~. で答える。',
        },
        choices: [
          {
            en: "I'm from Osaka, Japan.",
            ja: '日本の大阪出身だよ。',
            reply: { en: "Cool! I've always wanted to visit Japan.", ja: 'いいね！前から日本に行ってみたかったんだ。' },
            next: 'askdir',
          },
          {
            en: 'I come from a small town in Japan.',
            ja: '日本の小さな町の出身なんだ。',
            reply: { en: 'That sounds lovely.', ja: 'すてきなところそうだね。' },
            next: 'askdir',
          },
          {
            en: 'I moved here from Tokyo last week.',
            ja: '先週、東京からここに引っ越してきたんだ。',
            reply: { en: 'Oh, a big change! Welcome.', ja: 'うわ、大きな変化だね！ようこそ。' },
            next: 'askdir',
          },
        ],
      },
      askdir: {
        speaker: 'narration',
        en: "After class, you need to find the library, but you're not sure where it is.",
        ja: '授業のあと、図書館へ行きたいが場所がわからない。',
        note: {
          label: '道・場所をたずねる',
          en: 'Where is ~ ? / Could you tell me how to get to ~ ?',
          ja: 'ていねいに聞くなら Could you tell me how to get to ~ ? が便利。',
        },
        choices: [
          {
            en: 'Excuse me, where is the library?',
            ja: 'すみません、図書館はどこですか？',
            reply: { speaker: 'lisa', en: "It's on the second floor, next to the music room.", ja: '2階の音楽室のとなりだよ。' },
            next: 'thanks',
          },
          {
            en: 'Could you tell me how to get to the library?',
            ja: '図書館への行き方を教えてくれますか？',
            reply: { speaker: 'lisa', en: 'Sure! Go straight and turn left at the stairs.', ja: 'いいよ！まっすぐ進んで、階段で左に曲がってね。' },
            next: 'thanks',
          },
          {
            en: 'Do you know where the library is?',
            ja: '図書館がどこか知ってる？',
            reply: { speaker: 'lisa', en: "Yeah, I'll take you there.", ja: 'うん、連れて行ってあげる。' },
            next: 'thanks',
          },
        ],
      },
      thanks: {
        speaker: 'lisa',
        en: 'Here we are. If you need anything, just ask me, okay?',
        ja: '着いたよ。困ったらいつでも聞いてね。',
        note: {
          label: 'お礼の言い方',
          en: 'Thank you so much. / I really appreciate it.',
          ja: 'ていねいなお礼は I (really) appreciate it. や Thank you so much.。',
        },
        choices: [
          {
            en: 'Thank you so much, Lisa.',
            ja: '本当にありがとう、リサ。',
            reply: { en: "You're welcome!", ja: 'どういたしまして！' },
            next: 'fin',
          },
          {
            en: "Thanks a lot. You're very kind.",
            ja: 'どうもありがとう。とても親切だね。',
            reply: { en: 'Aww, thank you!', ja: 'えへへ、ありがとう！' },
            next: 'fin',
          },
          {
            en: 'I really appreciate your help.',
            ja: '手伝ってくれて本当に感謝してるよ。',
            reply: { en: 'Anytime!', ja: 'いつでもどうぞ！' },
            next: 'fin',
          },
        ],
      },
      fin: {
        speaker: 'narration',
        en: 'Your first day went well. You made a new friend — and practiced a lot of useful English!',
        ja: '初日は上々。新しい友達ができて、実用的な英語もたくさん使えた！',
        end: true,
      },
    },
  },

  // ════════════ Episode 2：昼休み ════════════
  {
    id: 'ep2_lunch',
    title: 'Lunch Time',
    titleJa: '昼休みのカフェテリア',
    emoji: '🍱',
    color: '#0ea5e9',
    blurb: 'さそう・提案する・注文する・意見を言う英語を体験。',
    focus: ['さそい', '提案', '注文・おすすめ', '意見を述べる'],
    start: 'l1',
    nodes: {
      l1: {
        speaker: 'narration',
        en: "It's lunchtime. Lisa walks up to your desk with a smile.",
        ja: 'お昼の時間。リサが笑顔であなたの席にやってきた。',
        next: 'l2',
      },
      l2: {
        speaker: 'lisa',
        en: 'Hey, are you hungry? Do you want to have lunch together?',
        ja: 'ねえ、おなかすいた？一緒にお昼食べない？',
        note: {
          label: 'さそいに応じる',
          en: "Sure, I'd love to. / That sounds great.",
          ja: '誘いを快諾するなら I’d love to. / Sounds great. が定番。',
        },
        choices: [
          {
            en: "Sure, I'd love to!",
            ja: 'うん、ぜひ！',
            reply: { en: "Awesome! Let's go.", ja: 'やった！行こう。' },
            next: 'l3',
          },
          {
            en: 'That sounds great. Thank you!',
            ja: 'いいね。ありがとう！',
            reply: { en: 'The cafeteria is this way.', ja: 'カフェテリアはこっちだよ。' },
            next: 'l3',
          },
          {
            en: "Yes, please. I'm starving.",
            ja: 'お願い。おなかペコペコなんだ。',
            reply: { en: 'Haha, me too!', ja: 'あはは、私も！' },
            next: 'l3',
          },
        ],
      },
      l3: {
        speaker: 'narration',
        en: 'At the cafeteria, a cheerful boy named Kenta joins you.',
        ja: 'カフェテリアで、明るい男の子ケンタが合流した。',
        next: 'l4',
      },
      l4: {
        speaker: 'kenta',
        en: "Hi, I'm Kenta. What are you going to eat?",
        ja: 'やあ、ケンタだよ。何食べるの？',
        note: {
          label: '注文する／おすすめをきく',
          en: "I'll have ~ . / What do you recommend?",
          ja: '注文は I’ll have ~.、おすすめを聞くなら What do you recommend?。',
        },
        choices: [
          {
            en: "I think I'll have the curry.",
            ja: 'カレーにしようかな。',
            reply: { en: "Good choice! The curry here is really good.", ja: 'いい選択！ここのカレー、ほんとおいしいよ。' },
            next: 'l5',
          },
          {
            en: "I'm not sure. What do you recommend?",
            ja: '迷うなあ。おすすめは何？',
            reply: { en: 'The ramen is the best, trust me.', ja: 'ラーメンが一番。間違いないよ。' },
            next: 'l5',
          },
          {
            en: "I'll just have a sandwich and some juice.",
            ja: 'サンドイッチとジュースにするよ。',
            reply: { en: 'A light eater, huh? Nice.', ja: '少食なんだね。いいね。' },
            next: 'l5',
          },
        ],
      },
      l5: {
        speaker: 'lisa',
        en: "By the way, why don't we go to the new café near the station after school?",
        ja: 'そうだ、放課後に駅前の新しいカフェに行かない？',
        note: {
          label: '提案する／受ける・断る',
          en: 'Why don’t we ~ ? / How about ~ing? — Sounds good. / Maybe next time.',
          ja: '提案は Why don’t we ~? や How about ~ing?。賛成は Sounds good.、やんわり断りは Maybe next time.。',
        },
        choices: [
          {
            en: "Sounds good! Let's do it.",
            ja: 'いいね！そうしよう。',
            reply: { en: 'Yay! I can’t wait.', ja: 'やった！楽しみ。' },
            next: 'l6',
          },
          {
            en: 'How about inviting Kenta too?',
            ja: 'ケンタも誘うのはどう？',
            reply: { en: 'Good idea! The more, the merrier.', ja: 'いい考え！多いほど楽しいもんね。' },
            next: 'l6',
          },
          {
            en: "Sorry, I can't today. Maybe next time?",
            ja: 'ごめん、今日は無理なんだ。また今度でいい？',
            reply: { en: 'No worries, next time then.', ja: '大丈夫、じゃあまた今度ね。' },
            next: 'l6',
          },
        ],
      },
      l6: {
        speaker: 'kenta',
        en: 'So, what do you think of our school so far?',
        ja: 'で、うちの学校、今のところどう思う？',
        note: {
          label: '意見を言う',
          en: 'I think ~ . / In my opinion ~ . / To be honest ~ .',
          ja: '意見は I think ~ / In my opinion ~。「正直に言うと」は To be honest ~。',
        },
        choices: [
          {
            en: "I think it's great. Everyone is friendly.",
            ja: 'すごくいいと思う。みんな親切だよ。',
            reply: { en: "I'm glad to hear that!", ja: 'それを聞けてうれしいよ！' },
            next: 'lfin',
          },
          {
            en: 'In my opinion, the classes are interesting.',
            ja: '私の意見では、授業が面白いね。',
            reply: { en: 'Right? The teachers are cool.', ja: 'でしょ？先生たちもいい感じなんだ。' },
            next: 'lfin',
          },
          {
            en: "To be honest, I'm a little nervous, but excited.",
            ja: '正直、少し緊張してるけど、わくわくもしてる。',
            reply: { en: "That's totally normal. You'll be fine.", ja: '当たり前のことだよ。きっと大丈夫。' },
            next: 'lfin',
          },
        ],
      },
      lfin: {
        speaker: 'narration',
        en: 'Lunch was fun, and the conversation flowed in English. You are starting to feel at home.',
        ja: 'お昼は楽しく、会話も英語で弾んだ。少しずつここに馴染んできた。',
        end: true,
      },
    },
  },

  // ════════════ Episode 3：放課後の部活 ════════════
  {
    id: 'ep3_club',
    title: 'Joining a Club',
    titleJa: '放課後の部活',
    emoji: '🎭',
    color: '#f59e0b',
    blurb: '許可を求める・能力を言う・手伝いを申し出る・予定を決める・あやまる。',
    focus: ['許可を求める', '能力を言う', '手伝いの申し出', '予定を決める', '謝罪'],
    start: 'c1',
    nodes: {
      c1: {
        speaker: 'narration',
        en: "After school, you walk past the gym and hear music. It's the English Drama Club.",
        ja: '放課後、体育館の前を通ると音楽が聞こえる。英語演劇部だ。',
        next: 'c2',
      },
      c2: {
        speaker: 'lisa',
        en: 'Oh, you found our club! Are you interested in joining?',
        ja: 'あ、部活を見つけたんだね！入るのに興味ある？',
        note: {
          label: '許可を求める',
          en: 'Can I ~ ? / May I ~ ? / Is it okay if I ~ ?',
          ja: '許可は Can I ~?、よりていねいに May I ~? / Is it okay if I ~?。',
        },
        choices: [
          {
            en: 'Yes! Can I join the club?',
            ja: 'うん！入部してもいい？',
            reply: { en: "Of course! We'd love to have you.", ja: 'もちろん！ぜひ来てほしいな。' },
            next: 'c3',
          },
          {
            en: 'May I watch your practice first?',
            ja: 'まず練習を見学してもいいですか？',
            reply: { en: 'Sure, take a seat.', ja: 'いいよ、座って見てて。' },
            next: 'c3',
          },
          {
            en: "I'd like to join, if that's okay.",
            ja: 'もしよければ、入部したいです。',
            reply: { en: 'Absolutely, welcome aboard!', ja: 'もちろん、ようこそ！' },
            next: 'c3',
          },
        ],
      },
      c3: {
        speaker: 'kenta',
        en: 'Cool! Are you good at acting or singing?',
        ja: 'いいね！演技か歌は得意？',
        note: {
          label: '得意・能力を言う',
          en: "I'm good at ~ing. / I can ~ .",
          ja: '得意は be good at ~ing、能力は can ~ で表す。',
        },
        choices: [
          {
            en: "I'm good at singing.",
            ja: '歌うのが得意だよ。',
            reply: { en: 'Perfect, we need singers!', ja: '完璧、歌い手が欲しかったんだ！' },
            next: 'c4',
          },
          {
            en: "I'm not good at acting, but I want to try.",
            ja: '演技は得意じゃないけど、挑戦してみたい。',
            reply: { en: "That's the spirit!", ja: 'その意気だよ！' },
            next: 'c4',
          },
          {
            en: 'I can play the guitar, actually.',
            ja: '実はギターが弾けるんだ。',
            reply: { en: 'No way! That’s awesome.', ja: 'うそ！すごいじゃん。' },
            next: 'c4',
          },
        ],
      },
      c4: {
        speaker: 'narration',
        en: 'The club is getting ready for the school festival. Lisa is carrying a heavy box and looks like she needs help.',
        ja: '部は文化祭の準備中。リサが重そうな箱を運んでいて、手伝いが要りそうだ。',
        note: {
          label: '手伝いを申し出る',
          en: 'Do you need a hand? / Shall I help you? / Let me ~ .',
          ja: '申し出は Do you need a hand? / Shall I help you?。Let me ~ で「私が〜するよ」。',
        },
        choices: [
          {
            en: 'Do you need a hand?',
            ja: '手伝おうか？',
            reply: { speaker: 'lisa', en: 'Yes, please! Thank you.', ja: 'うん、お願い！ありがとう。' },
            next: 'c5',
          },
          {
            en: 'Shall I help you with that?',
            ja: 'それ、手伝いましょうか？',
            reply: { speaker: 'lisa', en: 'That would be great!', ja: '助かる！' },
            next: 'c5',
          },
          {
            en: 'Let me carry that for you.',
            ja: 'それ、運んであげるよ。',
            reply: { speaker: 'lisa', en: "You're a lifesaver!", ja: '命の恩人だね！' },
            next: 'c5',
          },
        ],
      },
      c5: {
        speaker: 'lisa',
        en: "We're meeting this Saturday to practice. Can you come?",
        ja: '今度の土曜に集まって練習するんだ。来られる？',
        note: {
          label: '予定を決める／断る',
          en: 'What time should we meet? / I’m sorry, I can’t make it.',
          ja: '時間決めは What time should we meet?、都合がつかないときは I’m sorry, I can’t make it.。',
        },
        choices: [
          {
            en: 'Sure, what time should we meet?',
            ja: 'もちろん、何時に集合する？',
            reply: { en: "Let's meet at ten in front of the gym.", ja: '体育館の前に10時集合にしよう。' },
            next: 'c6',
          },
          {
            en: "I'd love to, but I have to ask my parents first.",
            ja: 'ぜひ。でもまず親に聞かないと。',
            reply: { en: 'Of course, just let me know!', ja: 'もちろん、決まったら教えてね！' },
            next: 'c6',
          },
          {
            en: "I'm sorry, I can't make it on Saturday.",
            ja: 'ごめん、土曜は都合がつかないんだ。',
            reply: { en: "No problem, we'll catch you next time.", ja: '大丈夫、また次回ね。' },
            next: 'c6',
          },
        ],
      },
      c6: {
        speaker: 'narration',
        en: 'In a hurry to help, you accidentally bump into a senior student in the hallway.',
        ja: '手伝おうと急いだあなたは、廊下で先輩にぶつかってしまった。',
        note: {
          label: 'あやまる',
          en: "I'm sorry. / I apologize. / Excuse me.",
          ja: '謝罪は I’m sorry. / My apologies.。軽い「すみません」は Excuse me.。',
        },
        choices: [
          {
            en: "Oh, I'm so sorry!",
            ja: 'あっ、ごめんなさい！',
            reply: { speaker: 'senpai', en: "It's okay, no harm done.", ja: '大丈夫、何ともないよ。' },
            next: 'cfin',
          },
          {
            en: "I'm really sorry. Are you all right?",
            ja: '本当にすみません。大丈夫ですか？',
            reply: { speaker: 'senpai', en: "I'm fine, don't worry.", ja: '平気だよ、心配しないで。' },
            next: 'cfin',
          },
          {
            en: "Excuse me, I didn't see you. My apologies.",
            ja: 'すみません、気づきませんでした。失礼しました。',
            reply: { speaker: 'senpai', en: 'No problem at all.', ja: 'まったく問題ないよ。' },
            next: 'cfin',
          },
        ],
      },
      cfin: {
        speaker: 'narration',
        en: 'You joined the Drama Club and made even more friends. Your new school life in English has just begun!',
        ja: '演劇部に入り、友達もさらに増えた。英語での新しい学校生活が、いま始まった！',
        end: true,
      },
    },
  },

  // ════════════ Episode 4：異世界召喚（分岐して合流するフィナーレ）════════════
  {
    id: 'ep4_isekai',
    title: 'Summoned to Another World',
    titleJa: '異世界に召喚されて',
    emoji: '⚔️',
    color: '#8b5cf6',
    blurb: '仲間と異世界を冒険。どの道を選んでも、巡り巡って同じフィナーレへ。',
    focus: ['仲間と話す', '提案・決断', '手伝う', '依頼する', '励ます', '別れのことば'],
    start: 'i1',
    nodes: {
      i1: {
        speaker: 'narration',
        en: 'A bright light surrounds you. When you open your eyes, you are standing in a world of magic — and English is the only language anyone speaks.',
        ja: 'まばゆい光に包まれ、目を開けると、そこは魔法の世界。誰もが英語しか話さない。',
        next: 'i2',
      },
      i2: {
        speaker: 'aria',
        en: "You're the hero from another world! I'm Aria. Will you travel with us to save this land?",
        ja: 'あなたが異世界の勇者ね！私はアリア。この地を救うため、一緒に旅してくれる？',
        note: {
          label: '申し出に応じる・意志',
          en: "I'll do my best. / Count me in. / I'd be glad to help.",
          ja: '「やってみる」は I’ll do my best.、「仲間に入れて」は Count me in.。',
        },
        choices: [
          {
            en: "Of course. I'll do my best.",
            ja: 'もちろん。全力を尽くすよ。',
            reply: { en: 'Thank you, brave one!', ja: 'ありがとう、勇者さま！' },
            next: 'i3',
          },
          {
            en: "Count me in. Let's save this world together.",
            ja: '仲間に入れて。一緒にこの世界を救おう。',
            reply: { en: 'I knew we could rely on you.', ja: '頼りになると思ってた。' },
            next: 'i3',
          },
          {
            en: "I'm a little scared, but I'd be glad to help.",
            ja: '少し怖いけど、喜んで力になるよ。',
            reply: { en: "Don't worry, we're with you.", ja: '心配しないで、私たちがついてる。' },
            next: 'i3',
          },
        ],
      },
      i3: {
        speaker: 'leon',
        en: "I'm Leon, a knight. The Demon Castle lies ahead, but there are three ways to reach it. Which way should we go?",
        ja: '俺は騎士のレオン。魔王城はこの先だが、行き方は三つある。どの道を行く？',
        note: {
          label: '提案・決断する',
          en: "Let's take ~ . / I think we should ~ . / How about ~ing?",
          ja: '決断・提案は Let’s ~ / I think we should ~ / How about ~ing?。どれを選んでも旅は続く。',
        },
        choices: [
          {
            en: "Let's take the forest path.",
            ja: '森の道を行こう。',
            reply: { en: 'The forest it is. Stay close.', ja: '森だな。はぐれるなよ。' },
            next: 'forest',
          },
          {
            en: 'I think we should follow the river.',
            ja: '川沿いを進むべきだと思う。',
            reply: { en: 'Good thinking. The river is safer.', ja: 'いい考えだ。川沿いは安全だ。' },
            next: 'river',
          },
          {
            en: 'How about climbing over the mountain?',
            ja: '山を越えるのはどう？',
            reply: { en: 'Bold choice! To the mountain.', ja: '大胆だな！では山へ。' },
            next: 'mountain',
          },
        ],
      },

      // ── 分岐A：森の道 ──
      forest: {
        speaker: 'narration',
        en: 'In the deep forest, you find a small child crying, lost among the trees.',
        ja: '深い森で、木々の間に迷い込んで泣いている小さな子どもを見つけた。',
        note: {
          label: '手伝いを申し出る',
          en: 'Are you okay? / Do you need help? / Let me help you.',
          ja: '「大丈夫？」は Are you okay?、「手伝おうか」は Do you need help? / Let me help you.。',
        },
        choices: [
          {
            en: 'Are you okay? Do you need help?',
            ja: '大丈夫？手伝おうか？',
            reply: { speaker: 'child', en: "I can't find my home...", ja: 'おうちが見つからないの…' },
            next: 'converge',
          },
          {
            en: "Don't cry. Let me help you find your way.",
            ja: '泣かないで。道を見つけるのを手伝うよ。',
            reply: { speaker: 'child', en: 'Really? Thank you!', ja: 'ほんと？ありがとう！' },
            next: 'converge',
          },
          {
            en: "It's okay. We'll take you home safely.",
            ja: '大丈夫。安全におうちまで送るよ。',
            reply: { speaker: 'child', en: 'You are so kind!', ja: 'やさしいんだね！' },
            next: 'converge',
          },
        ],
      },

      // ── 分岐B：川の道 ──
      river: {
        speaker: 'narration',
        en: 'A wide river blocks the way. An old boatman watches you from the shore.',
        ja: '広い川が行く手をはばむ。岸辺で年老いた船頭がこちらを見ている。',
        note: {
          label: 'ていねいに依頼する',
          en: 'Could you ~ ? / Would you mind ~ing? / May we ~ ?',
          ja: 'ていねいな依頼は Could you ~? / Would you mind ~ing?。',
        },
        choices: [
          {
            en: 'Excuse me, could you take us across the river?',
            ja: 'すみません、川を渡してもらえますか？',
            reply: { speaker: 'boatman', en: 'Hop on, travelers.', ja: '乗りな、旅人さん。' },
            next: 'converge',
          },
          {
            en: 'Would you mind helping us cross?',
            ja: '渡るのを手伝っていただけませんか？',
            reply: { speaker: 'boatman', en: 'Not at all. Climb aboard.', ja: 'かまわんよ。乗りなさい。' },
            next: 'converge',
          },
          {
            en: 'May we ride your boat, please?',
            ja: '船に乗せてもらえますか？',
            reply: { speaker: 'boatman', en: 'Of course. Hold on tight.', ja: 'もちろん。しっかりつかまって。' },
            next: 'converge',
          },
        ],
      },

      // ── 分岐C：山の道 ──
      mountain: {
        speaker: 'narration',
        en: 'The mountain path is steep. Aria looks tired and out of breath.',
        ja: '山道は険しい。アリアは疲れ、息を切らしている。',
        note: {
          label: '励ます・前向きな声かけ',
          en: "You can do it! / Don't give up. / We're almost there.",
          ja: '励ましは You can do it! / Don’t give up! / We’re almost there.（もうすぐだ）。',
        },
        choices: [
          {
            en: "You can do it, Aria! We're almost there.",
            ja: 'やれるよ、アリア！もうすぐだ。',
            reply: { speaker: 'aria', en: "Thanks. Your words give me strength.", ja: 'ありがとう。その言葉で力が出るわ。' },
            next: 'converge',
          },
          {
            en: "Don't give up. Let's take a short break.",
            ja: 'あきらめないで。少し休もう。',
            reply: { speaker: 'aria', en: 'Good idea. Just a moment.', ja: 'いい考えね。少しだけ。' },
            next: 'converge',
          },
          {
            en: 'Take my hand. I’ll help you up.',
            ja: '手をつかんで。引き上げるよ。',
            reply: { speaker: 'aria', en: "You're so reliable!", ja: 'ほんとに頼もしいね！' },
            next: 'converge',
          },
        ],
      },

      // ── 合流：どの道でもここへ ──
      converge: {
        speaker: 'narration',
        en: 'No matter which road you took, all paths lead to the same place: the gate of the Demon Castle. Your companions gather at your side.',
        ja: 'どの道を選んでも、すべての道は同じ場所へ——魔王城の門へと続いていた。仲間たちがあなたの隣に集まる。',
        next: 'i_before_final',
      },
      i_before_final: {
        speaker: 'sage',
        en: 'Hero, the final battle is near. Your kind words and brave choices have united us all.',
        ja: '勇者よ、最後の戦いは近い。そなたの優しい言葉と勇気ある選択が、皆を一つにした。',
        note: {
          label: '決意・呼びかけ',
          en: "Let's do this together. / We can win. / I won't let you down.",
          ja: '決意は Let’s do this together. / We can win. / I won’t let you down.（期待を裏切らない）。',
        },
        choices: [
          {
            en: "Let's do this together, everyone!",
            ja: 'みんな、一緒にやろう！',
            reply: { speaker: 'leon', en: 'Aye! To victory!', ja: 'おう！勝利を！' },
            next: 'i_end',
          },
          {
            en: "We've come this far. We can win!",
            ja: 'ここまで来たんだ。勝てるさ！',
            reply: { speaker: 'leon', en: 'That’s the spirit, hero!', ja: 'その意気だ、勇者！' },
            next: 'i_end',
          },
          {
            en: "I won't let you down. Let's finish this.",
            ja: '期待は裏切らない。終わらせよう。',
            reply: { speaker: 'leon', en: 'We believe in you.', ja: '俺たちは君を信じてる。' },
            next: 'i_end',
          },
        ],
      },
      i_end: {
        speaker: 'narration',
        en: 'Side by side with the friends you met along every road, you step through the gate. However you wandered, your journey reaches one shining finale — together. The End.',
        ja: 'どの道でも出会った仲間と肩を並べ、あなたは門をくぐる。どう巡ろうとも、旅は一つの輝くフィナーレへ——共に。完。',
        end: true,
      },
    },
  },
]

export const getEpisode = (id) => VN_EPISODES.find((e) => e.id === id)

// エピソードの「場面数」（選択肢ノードの数）。一覧の目安表示に使う。
export const episodeSceneCount = (ep) =>
  Object.values(ep.nodes).filter((n) => n.choices?.length).length
