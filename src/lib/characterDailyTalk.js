import { BATTLE_STUDENTS } from './battleCast.js'
import {
  CHARACTER_TALK_PERSONAS,
  characterTalkHash,
  characterTalkPersonaById,
  resolveCharacterTalkCast,
} from './characterTalk.js'

export const CHARACTER_DAILY_CATEGORIES = [
  { id: 'surprise', label: '意外な一面', emoji: '🎭' },
  { id: 'school', label: '学校・テスト', emoji: '🏫' },
  { id: 'study', label: '勉強', emoji: '✏️' },
  { id: 'learning-technique', label: '勉強のコツ', emoji: '🧠' },
  { id: 'learning-advice', label: '学習相談', emoji: '🧭' },
  { id: 'club', label: '部活', emoji: '🎽', outfitId: 'club' },
  { id: 'routine', label: '毎日の生活', emoji: '⏰' },
  { id: 'food', label: 'ごはん', emoji: '🍙' },
  { id: 'friends', label: '友だち', emoji: '🤝' },
  { id: 'weekend', label: '休日', emoji: '🗓️', outfitId: 'weekend' },
  { id: 'summer', label: '夏休み', emoji: '🌻' },
  { id: 'hobby', label: '趣味', emoji: '🎨' },
  { id: 'future', label: 'これから', emoji: '🌠' },
  { id: 'home', label: '家での時間', emoji: '🏠', outfitId: 'home' },
  { id: 'family', label: '家族との時間', emoji: '👪', outfitId: 'home' },
  { id: 'room', label: '自分の部屋', emoji: '🛏️', outfitId: 'home' },
  { id: 'chores', label: '家事', emoji: '🧺', outfitId: 'home' },
  { id: 'appearance', label: '身支度・服', emoji: '👕', outfitId: 'home' },
  { id: 'shopping', label: '買い物', emoji: '🛍️', outfitId: 'weekend' },
  { id: 'digital-life', label: 'スマホ生活', emoji: '📱', outfitId: 'home' },
  { id: 'evening', label: '夜の過ごし方', emoji: '🌙', outfitId: 'home' },
  { id: 'neighborhood', label: '近所', emoji: '🚶', outfitId: 'weekend' },
  { id: 'money', label: 'お小遣い', emoji: '👛', outfitId: 'weekend' },
  { id: 'self-care', label: '体調・休息', emoji: '🫖', outfitId: 'home' },
  { id: 'feelings', label: '気持ち', emoji: '💭' },
  { id: 'classroom', label: '教室', emoji: '🪑' },
  { id: 'events', label: '学校行事', emoji: '🎪' },
  { id: 'seasons', label: '季節・天気', emoji: '🍃' },
  { id: 'places', label: '校内スポット', emoji: '🗺️' },
  { id: 'small-talk', label: 'ちょっとした話', emoji: '💬' },
]

export const CHARACTER_DAILY_COMPANION_TOPICS = {
  surprise: 'mystery',
  school: 'study',
  study: 'study',
  'learning-technique': 'mistakes',
  'learning-advice': 'mistakes',
  club: 'club',
  routine: 'today',
  food: 'favorites',
  friends: 'friends',
  weekend: 'weekend',
  summer: 'weekend',
  hobby: 'favorites',
  future: 'dreams',
  home: 'today',
  family: 'friends',
  room: 'mystery',
  chores: 'today',
  appearance: 'favorites',
  shopping: 'favorites',
  'digital-life': 'today',
  evening: 'today',
  neighborhood: 'mystery',
  money: 'mistakes',
  'self-care': 'friends',
  feelings: 'friends',
  classroom: 'study',
  events: 'club',
  seasons: 'today',
  places: 'mystery',
  'small-talk': 'favorites',
}

export const CHARACTER_DAILY_FACTS = {
  mio: {
    studyWeekday: '平日は45分くらい', studyWeekend: '休日は1時間半くらい', studyTime: '夕食前の18時半から', studyPlace: 'ピアノの横の小さな机',
    studyMethod: '英語は声に出してリズムで覚える', testPrep: '10日前から範囲を一日分ずつ分ける', favoriteSubject: '音楽と英語', difficultSubject: '数学の文章題',
    summerClub: 'コンクール前は週5日の午前練習', clubGoal: '英語の合唱曲を全員で自然に歌うこと', clubHard: '声の調子が日によって変わること',
    wake: '6時20分', sleep: '22時45分ごろ', commute: 'バスと徒歩で30分', afterSchool: '合唱部の練習をしてから帰る',
    breakfast: 'トーストとヨーグルト', lunch: '卵焼き入りのお弁当', snack: 'はちみつ味ののど飴', favoriteFood: 'オムライス', drink: '温かい紅茶',
    hangout: '放課後に音楽室か図書館で話す', phone: '宿題のあとにまとめて返す', hobby: '気分ごとのプレイリスト作り', weekend: '窓を開けて歌ってからゆっくり過ごす',
    summerPlan: '海辺で録音した音を使って一曲作りたい', summerEvent: 'みんなで浴衣を着て花火を見たい',
    unexpectedSide: '穏やかそうに見えて、勝負になると一音のミスまで本気で悔しがる',
    sweetSecret: '超がつく甘党で、練習後なら大きなパフェも一人で完食する',
    animalSide: '犬派で、散歩中の犬の足音から勝手にリズムを作ってしまう',
    secretHobby: '音楽ゲームを最高難度で詰めるヘビーゲーマー',
    weekendLook: '大きなヘッドホンと黒いパーカーのストリート系で、学校よりずっとクールになる',
  },
  ren: {
    studyWeekday: '平日は30分から40分', studyWeekend: '休日は1時間くらい', studyTime: '夜21時から', studyPlace: '窓際のスケッチ机',
    studyMethod: '図や色分けで全体を一枚に描く', testPrep: '一週間前に範囲を大きな一枚へまとめる', favoriteSubject: '美術と社会', difficultSubject: '英語の聞き取り',
    summerClub: '週3日の午後に文化祭の大作を描く', clubGoal: '校舎の壁いっぱいの共同作品を完成させること', clubHard: '完成を決める締切と向き合うこと',
    wake: '6時50分', sleep: '23時30分ごろ', commute: '自転車で15分', afterSchool: '美術室で日が傾くまで描いている',
    breakfast: 'チーズトーストとカフェオレ', lunch: 'サンドイッチと果物', snack: 'ラムネ', favoriteFood: '焼き野菜カレー', drink: 'レモネード',
    hangout: '画材店や文具店を一緒に見て回る', phone: '考えてから返すので少し遅め', hobby: '街角の影や看板のスケッチ', weekend: '知らない路地を歩いて絵にする',
    summerPlan: '小さな美術館をいくつも巡りたい', summerEvent: '商店街のアート祭へ出したい',
    unexpectedSide: '猫を見つけると、いつもの落ち着いた口調が消えて声が一段高くなる',
    sweetSecret: '見た目が面白い和菓子を一つずつスケッチしてから食べる',
    animalSide: '断然猫派で、近所の猫を模様だけで見分けられる',
    secretHobby: '消しゴムほど小さい家具を作って、架空の部屋を完成させる',
    weekendLook: '絵の具だらけのつなぎと丸眼鏡で、画材店の店員に間違えられる',
  },
  haru: {
    studyWeekday: '平日は1時間くらい', studyWeekend: '休日は2時間くらい', studyTime: '夕食後の19時半から', studyPlace: '図書室か家の本棚の前',
    studyMethod: '一段落を一言で要約してから先へ読む', testPrep: '二週間前から読み返すページを決める', favoriteSubject: '国語と英語', difficultSubject: 'リスニングの速い会話',
    summerClub: '週2回の図書室当番と新刊整理', clubGoal: '夏のおすすめ本カードを百枚そろえること', clubHard: '返却本を一度に運ぶこと',
    wake: '6時10分', sleep: '22時30分ごろ', commute: '徒歩と電車で40分', afterSchool: '図書室を閉めてから静かに帰る',
    breakfast: 'ごはんとみそ汁', lunch: '小さめのお弁当', snack: 'バタークッキー', favoriteFood: 'きつねうどん', drink: 'ほうじ茶',
    hangout: '図書館の帰りに本屋へ寄る', phone: '本を読み終えた区切りで返す', hobby: '古本の栞や書き込みを眺めること', weekend: '朝の図書館で時計を見ずに読む',
    summerPlan: '古本市で知らない作家の一冊を選びたい', summerEvent: '夜の図書館イベントを手伝いたい',
    unexpectedSide: '静かな図書委員なのに、休日は実家のうどん店で店中に通る声を出す看板店員になる',
    sweetSecret: '固めのプリンにはかなりうるさく、店ごとの食感をノートに記録している',
    animalSide: '大型犬派で、図書館へ来るセラピー犬の日をひそかに楽しみにしている',
    secretHobby: '家族と新しいきつねうどんの薬味を考え、試食の感想を一冊のノートにまとめる',
    weekendLook: '手ぬぐいと紺の前掛けで店に立ち、図書室では聞けない大きな声で客を迎える',
  },
  akari: {
    studyWeekday: '平日は40分くらい', studyWeekend: '休日は1時間半くらい', studyTime: '夜20時から', studyPlace: '台所に近い大きなテーブル',
    studyMethod: '図と実験メモで「なぜ」を残す', testPrep: '一週間前から小テストを自作する', favoriteSubject: '理科と数学', difficultSubject: '古文の助動詞',
    summerClub: '週3日の午後に科学コンテストの実験', clubGoal: '雨の日に役立つ小さな発明を完成させること', clubHard: '同じ条件を何度も再現すること',
    wake: '6時30分', sleep: '23時ごろ', commute: '自転車で20分', afterSchool: '理科室で実験ノートを書いてから帰る',
    breakfast: '目玉焼きとトースト', lunch: '彩りを実験したお弁当', snack: 'ソーダ味のグミ', favoriteFood: 'チーズ入りハンバーグ', drink: '炭酸水',
    hangout: '百円ショップで実験材料を探す', phone: '思いついたらすぐ返す', hobby: '身近な材料で装置を作ること', weekend: '分解と試作で机をいっぱいにする',
    summerPlan: '星空を自作カメラで撮影したい', summerEvent: '自由研究フェアで実演したい',
    unexpectedSide: '実験中より犬と遊ぶときの方が夢中で、名前を呼ぶ声まで一段高くなる',
    sweetSecret: '甘さ控えめより、酸っぱいレモンタルトを選ぶ',
    animalSide: '犬派で、特に元気な大型犬と全力で遊びたい',
    secretHobby: '犬が飽きずに安全に遊べるおもちゃを、身近な材料で試作する',
    weekendLook: '動きやすいパーカー姿で公園を走り回り、白衣の発明家より犬の遊び相手になる',
  },
  kaito: {
    studyWeekday: '平日は25分から30分', studyWeekend: '休日は1時間くらい', studyTime: '練習後の19時から', studyPlace: '家のダイニングテーブル',
    studyMethod: '15分ずつ区切って問題数を決める', testPrep: '5日前から毎日一周ずつ解き直す', favoriteSubject: '体育と英語', difficultSubject: '国語の長い記述',
    summerClub: '週6日の朝練で、昼前には終わる', clubGoal: '100メートルの自己ベストを更新すること', clubHard: '暑い日のペース配分',
    wake: '5時45分', sleep: '22時ごろ', commute: '自転車で15分', afterSchool: '陸上部で走って、シャワー後に宿題をする',
    breakfast: 'バナナと大きなおにぎり', lunch: '肉多めのお弁当', snack: 'あんパン', favoriteFood: 'しょうが焼き', drink: '冷たい麦茶',
    hangout: '川沿いを歩いたり走ったりする', phone: '短文ですぐ返す', hobby: '知らない道を走って地図を広げること', weekend: '朝に走ってからみんなと朝ごはんを食べる',
    summerPlan: '早朝の海沿いを走ってみたい', summerEvent: '河川敷の花火大会で場所取りをしたい',
    unexpectedSide: '小学生の妹の前では、靴ひもも忘れ物も疲れ具合も先回りして見る世話焼きなお兄ちゃんになる',
    sweetSecret: '妹と新作あんパンを半分こするとき、必ず大きい方を妹へ渡す',
    animalSide: '猫派で、ランニングコースは会える猫の多さで決める',
    secretHobby: '妹が行きたい公園や店を一日で回れるよう、休日コースを地図にして考える',
    weekendLook: '自分の荷物より先に妹のうさぎリュックと水筒を持つ、完全なお兄ちゃん装備になる',
  },
  rei: {
    studyWeekday: '平日は1時間15分くらい', studyWeekend: '休日は2時間半くらい', studyTime: '夜20時半から', studyPlace: '予定表を広げられる自分の机',
    studyMethod: '最初に優先順位と終了時刻を決める', testPrep: '二週間前に全範囲の予定表を作る', favoriteSubject: '社会と英語', difficultSubject: '時間制限のある美術課題',
    summerClub: '週3日の生徒会と文化祭準備', clubGoal: '全クラスの文化祭希望を時間内にまとめること', clubHard: '全員の希望を公平に調整すること',
    wake: '6時', sleep: '23時ごろ', commute: '電車で35分', afterSchool: '生徒会室で確認事項を終えてから帰る',
    breakfast: 'ごはんと焼き魚', lunch: '仕切りの多いお弁当', snack: '小さなチョコレート', favoriteFood: 'きのこのリゾット', drink: '無糖のミルクティー',
    hangout: '駅前の静かなカフェで予定を立てる', phone: '通知をためず決めた時間に返す', hobby: '手帳と文房具を整えること', weekend: '午前に用事を終えて午後を空ける',
    summerPlan: '地域のボランティア運営を手伝いたい', summerEvent: '夏祭りの案内係をやってみたい',
    unexpectedSide: '学校では隙がないのに、休日は待ち合わせ相手が通り過ぎるほど雰囲気を変える',
    sweetSecret: '実は超甘党で、会議のあとはクリームたっぷりのパンケーキを頼む',
    animalSide: '犬派で、きちんと訓練された犬を見ると予定を忘れて見入ってしまう',
    secretHobby: 'コスメの色と組み合わせを手帳に記録して試す',
    weekendLook: 'ばっちりメイクと華やかな服で、学校の知り合いにも誰だか分からないと言われる',
  },
  nao: {
    studyWeekday: '平日は35分くらい', studyWeekend: '休日は1時間くらい', studyTime: '夜21時から', studyPlace: '家族のいるリビング',
    studyMethod: '覚えた表現をその日のうちに会話で使う', testPrep: '一週間前から友達と問題を出し合う', favoriteSubject: '英語と社会', difficultSubject: '数学の証明',
    summerClub: '週2回の準備と、月末に三日間の交流会', clubGoal: '初参加の人全員と一回は話すこと', clubHard: '言葉が通じないときも会話を止めないこと',
    wake: '6時40分', sleep: '23時15分ごろ', commute: 'バスで25分', afterSchool: '国際交流部でおしゃべりしてから帰る',
    breakfast: 'シリアルと果物', lunch: '交換しやすい小さなおかずのお弁当', snack: '世界のお菓子を一つ', favoriteFood: 'タコス', drink: 'マンゴージュース',
    hangout: '商店街で食べたことのない料理を探す', phone: '絵文字多めですぐ返す', hobby: 'いろんな国の挨拶を集めること', weekend: '近所で小さな世界旅行をする',
    summerPlan: '海外から来る学生を町案内したい', summerEvent: '多文化フード屋台を開きたい',
    unexpectedSide: 'にぎやかな場所が好きそうに見えて、一人で千ピースのパズルへ黙々と向かう',
    sweetSecret: '世界のお菓子を国別に並べ、友だちと味の地図を作っている',
    animalSide: '犬派で、どの国の言葉でも最初に「いい子だね」を覚える',
    secretHobby: '難しいジグソーパズルを制限時間つきで解く',
    weekendLook: '古着と大きなサングラスで、毎回違う国の街角みたいな格好をする',
  },
  tsubaki: {
    studyWeekday: '平日は45分くらい', studyWeekend: '休日は2時間くらい', studyTime: '夕食後の20時から', studyPlace: '姿勢を正せる低い机',
    studyMethod: '最初の一問へ集中し、終わったら短く振り返る', testPrep: '10日前から毎朝一科目ずつ確認する', favoriteSubject: '国語と体育', difficultSubject: '英語の速い聞き取り',
    summerClub: '週6日の朝稽古で、日曜は休み', clubGoal: '迷わず正しい構えへ戻れるようになること', clubHard: '暑くても集中を切らさないこと',
    wake: '5時30分', sleep: '22時ごろ', commute: '徒歩で25分', afterSchool: '剣道部の稽古と道場掃除をして帰る',
    breakfast: 'ごはんと納豆', lunch: '梅干し入りのおにぎり弁当', snack: '塩せんべい', favoriteFood: '鶏の照り焼き', drink: '常温の麦茶',
    hangout: '道場の帰りにみんなで温かいものを食べる', phone: '用件を短く、でも必ず返す', hobby: '竹刀の手入れと時代小説', weekend: '朝稽古のあと静かに体を休める',
    summerPlan: '海辺で朝稽古をしてみたい', summerEvent: '神社の夏祭りで警備を手伝いたい',
    unexpectedSide: '竹刀を握る手で、フランス人形の磁器の頬へ髪の毛ほど細い筆を迷わず運べる',
    sweetSecret: '甘味は控えめだが、人形作りが一段落した日のあんみつだけは大盛りを選ぶ',
    animalSide: '猫派で、道場の裏に来る三毛猫には構えを崩してしまう',
    secretHobby: '稽古のない夜に、アンティーク調のフランス人形へガラスの瞳と巻き髪を合わせ、レースのドレスを一針ずつ仕立てる',
    weekendLook: '花柄のエプロンでフランス人形のボンネットやリボンを選んでいて、道着姿からは想像されない',
  },
  noa: {
    studyWeekday: '平日は50分くらい', studyWeekend: '休日は2時間くらい', studyTime: '夜22時から', studyPlace: 'モニターを二つ置いた机',
    studyMethod: '間違いをログにして翌日もう一度だけ試す', testPrep: '一週間前から出題範囲を一覧にする', favoriteSubject: '数学と情報', difficultSubject: '古文の敬語',
    summerClub: '週3日の午後に校内アプリを開発', clubGoal: '迷わず使える校内案内アプリを公開すること', clubHard: '原因の分からない不具合を探すこと',
    wake: '7時', sleep: '23時45分ごろ', commute: '電車で25分', afterSchool: '電脳研究会でコードを書いてから帰る',
    breakfast: '小さなパンと牛乳', lunch: '片手でも食べやすいサンドイッチ', snack: 'ミントタブレット', favoriteFood: 'チーズピザ', drink: '無糖の炭酸水',
    hangout: '電器店やゲームセンターを一緒に見る', phone: '既読後に考えてから返す', hobby: '古い機械の分解と再利用', weekend: '動かない機械へ別の役目を与える',
    summerPlan: '星の動きを記録するプログラムを作りたい', summerEvent: '夜のデジタル展示会を開きたい',
    unexpectedSide: 'デジタル一筋に見えて、夜明け前は端末を鞄へしまい、紙の星図だけで空を追う',
    sweetSecret: '甘いものは苦手そうに見られるが、マシュマロ入りココアだけは別',
    animalSide: '犬派で、散歩アプリを作る口実で近所の犬の名前を全部覚えた',
    secretHobby: '古い星図と今の空を見比べ、端末を使わず星を見つける',
    weekendLook: 'モニターから離れてアウトドア帽と大きなリュックで歩き回る',
  },
  yuu: {
    studyWeekday: '平日は1時間くらい', studyWeekend: '休日は2時間くらい', studyTime: '夜21時から', studyPlace: '本と原稿に囲まれた机',
    studyMethod: '分かったことを自分の一文に書き直す', testPrep: '二週間前から少しずつ読み返す', favoriteSubject: '国語と英語', difficultSubject: '数学の計算速度',
    summerClub: '週2回の文芸部と作品の読み合わせ', clubGoal: '十人の短編をまとめた部誌を完成させること', clubHard: '自分の原稿を人に読んでもらうこと',
    wake: '6時40分', sleep: '23時20分ごろ', commute: '徒歩で25分', afterSchool: '文芸部で一ページ書いてから帰る',
    breakfast: 'ジャムトーストとココア', lunch: '本を汚しにくいおにぎり', snack: 'カステラ', favoriteFood: 'クリームシチュー', drink: 'ココア',
    hangout: '喫茶店や古本屋でゆっくり話す', phone: '文章を考えすぎて返事は遅め', hobby: '町で見かけた人から短い物語を考えること', weekend: '知らない喫茶店で一場面を書く',
    summerPlan: '各駅停車で小さな町を巡って物語を書きたい', summerEvent: '夕涼み朗読会へ作品を出したい',
    unexpectedSide: '内面はかなり内向的で人前では声が縮むのに、ヒトカラでは別人のように力強く歌う',
    sweetSecret: '超甘党で、執筆中はカステラとココアがないと一章進まない',
    animalSide: '猫派で、本の上に座られても退かせず自分が別の本を取る',
    secretHobby: '誰にも会わない時間を選んでヒトカラへ行き、歌詞ノートを見ながら一人で練習する',
    weekendLook: '大きな黒いパーカーと控えめな眼鏡で、人混みでは友達の半歩後ろを歩く',
  },
}

// 学校での肩書きだけでは見えない、10人それぞれの生活の手触り。
// 回答を共通テンプレートだけで済ませず、家庭・部屋・家事・買い物まで本人固有にする。
export const CHARACTER_PRIVATE_LIFE = {
  mio: {
    familyScene: '夕食後は家族が一曲ずつ「今日聴きたい曲」を出し、居間の小さなスピーカーで順番に流す',
    familyRole: '朝いちばんにカーテンを開け、眠そうな家族へ鼻歌で時間を知らせる係になっている',
    roomScene: 'ピアノの横へ譜面と色別のプレイリストノートを並べ、加湿器だけは一年中置いている',
    privateTreasure: '初めてソロを任された演奏会の折れたプログラムを、楽譜の間へ大切に挟んでいる',
    choreStyle: '食器を拭くのは速いが、歌いながら畳む洗濯物は一曲ごとに手が止まってしまう',
    homeCooking: '休日の昼は半熟卵のオムライスを作り、ケチャップでその日の音符を一つ描く',
    morningStyle: '起きたら白湯で喉を起こし、声を出す前に髪を低い位置でゆっくり結ぶ',
    offDutyStyle: '黒いパーカーと大きなヘッドホンを選び、靴だけ曲の気分に合わせて色を変える',
    shoppingStyle: '中古CD店の試聴棚と紅茶店を一周し、最後に小さなのど飴を一袋だけ買う',
    savingGoal: '海や街の環境音をきれいに録れる、小型のフィールドレコーダーのために貯めている',
    phoneStyle: '待受は無人のステージで、通知は宿題後にまとめて開き、音楽アプリだけ例外にしている',
    photoStyle: '空の色、手書きのセットリスト、友だちが笑った直後の手元をそっと撮る',
    dinnerTime: '食卓では今日いちばん耳に残った音を話し、家族の答えを翌日のプレイリストへ入れる',
    bedtimeStyle: '加湿器の水を確かめ、翌日の曲を一度だけ小さくハミングしてから明かりを消す',
    neighborhoodSpot: '川沿いの歩道橋の下は声が柔らかく返るため、誰もいない朝に立ち寄る',
    neighborTie: '近所のパン屋が合唱本番の日を覚えていて、はちみつ味ののど飴を取り置いてくれる',
    allowanceStyle: 'お小遣いを「音楽」「友だち」「貯金」の三つの封筒へ分け、使った日に一言残す',
    giftStyle: '相手の好きな曲を五曲選んだ手書きカードに、香りのやさしい紅茶を添える',
    sickDay: '声が出ない日は無理に話さず、家族とはメモでやり取りしながら温かい飲み物を取る',
    resetStyle: '部屋を少し暗くして一曲だけ最初から最後まで聴き、終わるまで答えを急がない',
  },
  ren: {
    familyScene: '家族が気に入った落書きを冷蔵庫へ貼るため、台所の扉が小さな展覧会になっている',
    familyRole: '包装紙や収納箱へ見やすい絵を描き、家族が迷わない目印を作る役を引き受ける',
    roomScene: '窓際は整ったスケッチ机だが、床には色見本と作りかけの小家具が島のように広がる',
    privateTreasure: '初めて自分の絵を褒めてもらった日に拾った青いガラス片を、小箱にしまっている',
    choreStyle: '洗濯物の色合わせは得意だが、掃除中に古い紙を見つけると素材として眺め始めてしまう',
    homeCooking: 'カレーの野菜を色ごとに焼き、盛り付けが完成するまで家族を少しだけ待たせる',
    morningStyle: 'カーテンに落ちる影を一枚だけ描いてから、寝癖を水で直して静かに着替える',
    offDutyStyle: '絵の具の跡が残るつなぎと丸眼鏡で、ポケットへ短い鉛筆を何本も入れる',
    shoppingStyle: '画材店では表の新商品より奥の端材箱を見て、使い道の浮かぶ紙だけを選ぶ',
    savingGoal: '小さな作品を夜も正しい色で見られる、古い形の作業灯を買おうとしている',
    phoneStyle: '待受は壁のひび割れの写真で、制作中は通知を切り、返信用の下書きだけ後で作る',
    photoStyle: '路地の影、古い看板、猫のしっぽなど、形が一瞬だけ面白くなった場所を撮る',
    dinnerTime: '料理の味より最初に皿の色合わせを口にしてしまい、家族にまた始まったと笑われる',
    bedtimeStyle: '筆を洗った水が透明になるまで片づけ、最後に三十秒だけ翌日の構図を眺める',
    neighborhoodSpot: '古い塀と植木鉢が続く裏路地を気に入り、季節ごとの影を同じ場所で描いている',
    neighborTie: '文具店の店主が包装紙の切れ端を捨てずに集め、模型へ使えそうな日に渡してくれる',
    allowanceStyle: '画材費を先に取り分け、残りだけで飲み物やおやつを選ぶため衝動買いは少ない',
    giftStyle: '相手の部屋を想像した小さな絵か、机へ置ける消しゴム大の家具を手作りする',
    sickDay: '布団のしわをぼんやりスケッチして過ごすが、熱がある日は画材へ触れない約束を守る',
    resetStyle: 'カメラも画材も持たずに一駅分歩き、帰ってから覚えている形だけを炭で描く',
  },
  haru: {
    familyScene: '実家のうどん店を閉めたあと、家族で遅い夕食を囲み、今日の客の一言を話して笑う',
    familyRole: '開店前の暖簾と献立札を任され、忙しい日は年下の客へ先に水を運ぶ',
    roomScene: '本棚は作者順に整っているが、枕元だけは読みかけの本が三冊まで重なっている',
    privateTreasure: '常連の子どもが折ってくれた不格好な狐の栞を、いちばん好きな本へ挟んでいる',
    choreStyle: '大量の皿を静かに洗うのは得意だが、前掛けを同じ幅で畳む作業だけ妙に時間がかかる',
    homeCooking: '家族と新しい薬味を試し、だしの香りを消さない量を小さなノートへ記録する',
    morningStyle: '店の引き戸を開けて朝の空気を入れ、制服へ着替える前に短く店先を掃く',
    offDutyStyle: '紺の前掛けと手ぬぐいで店へ立ち、学校より大きな声で客の注文を繰り返す',
    shoppingStyle: '古本屋と乾物店を同じ日に回り、本の紙とだしの香りを交互に確かめる',
    savingGoal: '閉店後にも目が疲れにくい読書灯と、絶版になった短編集のために貯めている',
    phoneStyle: '待受は文字のない生成り色で、本を読み終えた区切りにだけ通知をまとめて確認する',
    photoStyle: '本棚の背表紙、湯気の向こうの丼、閉店後の空席など人の気配が残る景色を撮る',
    dinnerTime: '店の残り物を家族で少しずつ分け、明日の仕込みと最近読んだ一節を一つずつ話す',
    bedtimeStyle: '短編を一作だけ読み、栞を次の章の頭へそろえて置いてから灯りを落とす',
    neighborhoodSpot: '商店街の共同ベンチは店の音と人の会話が遠く聞こえ、読書の休憩にちょうどいい',
    neighborTie: '近所の常連客から季節の野菜をもらい、家族で合う薬味を考えて翌日に感想を返す',
    allowanceStyle: '新刊用と古本市用を分け、予定外の一冊を買った月は喫茶店へ寄る回数を減らす',
    giftStyle: '相手が今読み切れそうな薄さの本を選び、押しつけにならない短い紹介文を添える',
    sickDay: '店の二階で音を聞きながら休み、目が疲れる日は本を閉じて朗読音声だけを流す',
    resetStyle: 'だしを弱火で取りながら本棚を一段だけ並べ直すと、考えがゆっくり整ってくる',
  },
  akari: {
    familyScene: '夕食前に家族へ「今日の試作品」を三十秒で説明し、安全かどうか最初の判定をもらう',
    familyRole: '家電の調子と電池の残量を見つける係だが、分解前には必ず家族の許可を取る',
    roomScene: '机の右半分を実験、左半分を宿題とテープで区切り、壁には失敗作の部品を番号順に置く',
    privateTreasure: '最初は動かなかった小型モーターを、失敗一号として透明なケースへ飾っている',
    choreStyle: '排水口や棚の仕組みを改善するのは得意だが、掃除そのものより道具の改造へ熱中しやすい',
    homeCooking: 'ハンバーグの焼き時間と肉汁を記録し、家族の投票で次回の条件を一つだけ変える',
    morningStyle: '窓辺の自作センサーで気温を確かめ、髪をまとめながら今日の持ち物を声に出す',
    offDutyStyle: 'ポケットの多いパーカーとカーゴパンツで、公園では犬用の試作品をすぐ取り出せる',
    shoppingStyle: '百円ショップと金物店を回り、完成品より別の用途へ使えそうな部品を探す',
    savingGoal: '温度を細かく調整できるはんだごてと、星空撮影用の小さなレンズを狙っている',
    phoneStyle: '待受は自作センサーのグラフで、天気と電池残量だけは通知を常に表示している',
    photoStyle: '犬の足の動き、雲の形、失敗直前の装置など、あとで原因を比べられる瞬間を撮る',
    dinnerTime: '家族へ今日の仮説と結果を一つずつ話し、説明が長いときは箸を置くよう注意される',
    bedtimeStyle: '充電中の電池と電源を指差し確認し、実験ノートへ明日の一手だけ書いて眠る',
    neighborhoodSpot: '大きな犬が集まる公園の外周を歩き、遊び方と安全な距離を観察している',
    neighborTie: '金物店の店主が危ない使い方には必ず待ったをかけ、代わりの部品を一緒に考えてくれる',
    allowanceStyle: '部品六割、貯金三割、飲み物一割と先に決め、レシートへ実験番号を書いて保管する',
    giftStyle: '相手の小さな困りごとを聞き、壊れても直せる単純な仕組みの道具を作る',
    sickDay: '体温をグラフにしたくなるが、家族に端末を預けて水分と睡眠を優先する決まりがある',
    resetStyle: '使わない機械を一つだけ分解して部品を並べるか、犬と全力で走って頭を空にする',
  },
  kaito: {
    familyScene: '小学生の妹ヒナが学校の話を始めると、夕食が終わっても最後まで聞いてから席を立つ',
    familyRole: 'ヒナの靴ひも、水筒、明日の持ち物を先回りして確認する世話焼きなお兄ちゃん役',
    roomScene: '記録証とランニング地図の横へ、ヒナが描いた応援旗や折り紙をまっすぐ飾っている',
    privateTreasure: '初めてリレーで渡された擦り傷のあるバトンと、ヒナの「がんばれ券」を同じ箱に入れる',
    choreStyle: '重い洗濯かごや買い出しは進んで持つが、小さな靴下を左右そろえる作業だけ苦手',
    homeCooking: '大きな卵焼きを作り、ヒナの皿だけ海苔で顔をつけてから自分の分を盛る',
    morningStyle: '短い朝ランのあと自分の支度を一気に済ませ、最後にヒナのリュックの留め具を見る',
    offDutyStyle: 'スポーツTシャツに動きやすいパンツで、自分の荷物より妹のうさぎリュックを持つ',
    shoppingStyle: 'スーパーの特売とパン屋の新作をヒナと回り、帰り道に公園を一つ追加する',
    savingGoal: 'ヒナと水族館へ行く日の交通費と、自分の次のランニングシューズを並行して貯める',
    phoneStyle: '待受はヒナが描いたゴールテープで、連絡は短文ですぐ返し、位置情報は家族だけ共有する',
    photoStyle: '走っている仲間の背中、道で会う猫、ヒナが何かを完成させた手元を多く撮る',
    dinnerTime: '練習の結果より先にヒナの一日を聞き、自分の話は今日できた一つだけに絞る',
    bedtimeStyle: '足首を伸ばしながら翌日の天気を見て、家族の玄関へ必要な傘をまとめて置く',
    neighborhoodSpot: '川沿いのランニング道には猫が集まる場所が三つあり、速度を落として通る',
    neighborTie: '兄妹で通うパン屋に顔を覚えられ、新作あんパンが出ると小さな試食を二つ用意してくれる',
    allowanceStyle: '競技用品、家族で出かける分、自由に使う分へ分け、大きな出費は一晩考える',
    giftStyle: '相手が今すぐ使える物を選び、食べ物なら自分より少し大きい方を必ず渡す',
    sickDay: '休むのが苦手で走ろうとするため、ヒナの手書き「本日休養」の紙を部屋へ貼られる',
    resetStyle: '時計を持たずに川沿いをゆっくり走り、帰ったら熱いシャワーと麦茶で区切りをつける',
  },
  rei: {
    familyScene: '居間の共有予定表へ家族が予定を書き、夕食では今日よかったことを一人一つだけ話す',
    familyRole: '薬や日用品の残りと家族の締切を確認するが、本人が望まない予定までは決めない',
    roomScene: '机は書類と勉強、鏡台はコスメと色見本に分け、どちらも使い終えると何も残さない',
    privateTreasure: '初めて最後まで使い切った手帳を、失敗した予定も消さずに箱へ保管している',
    choreStyle: 'アイロンと在庫管理は得意だが、家族が予告なく家具を動かすと落ち着くまで時間がかかる',
    homeCooking: 'きのこのリゾットを時間どおり仕上げ、最後の盛り付けだけは毎回少し華やかにする',
    morningStyle: '制服の日は日焼け止めと髪だけを整え、休日用のメイクは前夜に色を決めておく',
    offDutyStyle: '鮮やかなメイクと揺れるアクセサリーを選び、学校とは違う色を思い切って着る',
    shoppingStyle: '文具売場で実用性を確認してからコスメ売場へ行き、手持ちと重ならない色だけ試す',
    savingGoal: '自然光に近い鏡と、長く使える革の手帳カバーを買うため月ごとに積み立てる',
    phoneStyle: 'ホーム画面は一列だけで、通知は昼と夜の二回にまとめ、緊急連絡だけ音を残す',
    photoStyle: '服とメイクの配色、季節の花、会議後の甘い物を撮り、人の顔は必ず確認してから残す',
    dinnerTime: '食事中は予定表を開かず、今日うまくいかなかったことも結論を急がず家族へ話す',
    bedtimeStyle: 'メイクを丁寧に落とし、翌日の服と鞄を並べ、手帳へ余白を一枠残して眠る',
    neighborhoodSpot: '駅から一本離れた静かなカフェの窓際で、予定を立てずに紅茶を飲む時間がある',
    neighborTie: '近所の花屋が季節の一輪を教えてくれ、行事の受付へ飾る花を一緒に選ぶ',
    allowanceStyle: '固定費と自由費を手帳へ記録し、甘い物だけは月二回の例外枠を用意している',
    giftStyle: '相手の持ち物と好みをさりげなく調べ、包装を開けた瞬間から使い方が分かる物を選ぶ',
    sickDay: '症状と薬の時間を記録したら予定を早めに断り、回復するまで新しい約束を入れない',
    resetStyle: '手帳を閉じて一時間だけ予定のない時間を作り、メイクの色を試すか遠回りして歩く',
  },
  nao: {
    familyScene: '夕食では家族が今日覚えた言葉を一つ持ち寄り、発音が違っても笑って言い直す',
    familyRole: '来客へ最初に声をかけ、靴や飲み物で迷わないよう小さな案内役になる',
    roomScene: '壁は海外の絵葉書で埋まり、机の半分には千ピースパズルを崩さない専用板がある',
    privateTreasure: '交流会でもらった短い手紙を言語別ではなく、受け取った日の気持ち別にしまっている',
    choreStyle: '音楽をかけた洗濯と食卓の準備は速いが、色違いの靴下を面白がって組にしてしまう',
    homeCooking: '家族とタコスを作り、具材ごとに違う国の挨拶を一つ言えたら皿へ乗せる',
    morningStyle: '海外ラジオを流しながら着替え、服の色を一つだけその日の挨拶カードに合わせる',
    offDutyStyle: '古着と大きなサングラスを組み合わせ、訪れる店の国に合わせて小物を変える',
    shoppingStyle: '輸入食品店と古着屋を回り、読めない表示がある商品ほど店員へ意味を聞く',
    savingGoal: '交流会で使える小型翻訳イヤホンと、いつか自分で行く短い海外旅行のために貯める',
    phoneStyle: '待受は友だちにもらった絵文字の集合で、グループ通知は多いがパズル中だけ全部止める',
    photoStyle: '初めて食べた料理、街の多言語看板、友だちの変なポーズを許可を取って撮る',
    dinnerTime: '今日聞いた新しい言葉と、その言葉を教えてくれた人の話を一緒に食卓へ持ち帰る',
    bedtimeStyle: '音声メッセージを二件まで返し、パズルへ布をかけて未完成のまま眠れる状態にする',
    neighborhoodSpot: '商店街の小さな国際食材店を近所の世界地図と呼び、週末に一棚ずつ見ている',
    neighborTie: '各国料理店の店主に顔を覚えられ、新しい挨拶を教わる代わりに日本の若者言葉を説明する',
    allowanceStyle: '週ごとの小さな冒険費を決め、知らない食べ物は友だちと分けて種類を増やす',
    giftStyle: '相手の好きな味に近い海外菓子と、その国の「ありがとう」を書いたカードを渡す',
    sickDay: '最初は話しすぎるが、声がかすれたら家族に端末を預け、短い字幕動画だけ見て休む',
    resetStyle: '一人でパズルの外周を一辺だけ完成させ、誰にも話さない静かな時間を確保する',
  },
  tsubaki: {
    familyScene: '朝食は家族と静かに取り、祖母の人形工房で進んだ作業を一つだけ聞いてから家を出る',
    familyRole: '道場の雨戸と玄関を開け、祖母が使うレースや糸の不足も一緒に確かめる',
    roomScene: '低い机と竹刀掛けは簡素だが、引き出しにはフランス人形用のリボンが色順に並ぶ',
    privateTreasure: '祖母から譲られた青いガラスの瞳を一組、いつか最高の人形へ使うため残している',
    choreStyle: '床磨きとアイロンは得意だが、掃除機の大きな音は集中を乱すため最後まで慣れない',
    homeCooking: '鶏の照り焼きと切りそろえた野菜を作り、味より先に姿勢よく配膳を整える',
    morningStyle: '短い黙想と素振りを終え、髪を高く結び直してから制服へ袖を通す',
    offDutyStyle: '紺の動きやすい服か花柄の前掛けを選び、工房では細い紫のリボンを髪へ足す',
    shoppingStyle: '布店のレース棚と骨董市の人形小物を見て、縫い目と傷を一つずつ確かめる',
    savingGoal: '古いフランス製の青いガラス眼と、黄ばみの少ない細いレースのために貯めている',
    phoneStyle: '待受は無地で連絡も短いが、人形資料の画像だけは用途別のフォルダへ細かく分ける',
    photoStyle: '完成した人形の横顔、祖母の手元、道場裏の三毛猫を同じ静かな距離から撮る',
    dinnerTime: '稽古で直した一手と工房で進んだ一工程を家族へ報告し、食後は急須を片づける',
    bedtimeStyle: '竹刀を拭き、人形へ埃よけの布を掛け、明朝の稽古着を畳んでから休む',
    neighborhoodSpot: '神社裏から道場へ続く石畳を歩き、季節ごとに変わる木の音を聞いている',
    neighborTie: '骨董店の店主が人形用の小さなボタンを取っておき、状態の見分け方も厳しく教える',
    allowanceStyle: '必要品を帳面へ書いてから買い、稽古道具と人形材料のどちらも衝動では選ばない',
    giftStyle: '相手の持ち物へ合う色の小さな守り袋を縫い、目立たない場所へ一針だけ花を入れる',
    sickDay: '稽古を休む判断は早いが、布団の中で人形衣装の型紙を考え始めて祖母に止められる',
    resetStyle: '道場の床を一列だけ磨き、ほうじ茶を飲んでから三毛猫が来る裏口へ座る',
  },
  noa: {
    familyScene: '家族は食卓だけ端末を伏せ、今日見つけた面白いことを検索せずに一人一つ説明する',
    familyRole: '家の通信機器と天気通知を管理し、再起動の手順を誰でも読める紙へして貼っている',
    roomScene: '二枚のモニターと工具箱の間に紙の星図が広がり、古い機械は用途別に積まれている',
    privateTreasure: '初めて直して音が鳴った小さなラジオを、傷も消さずに机の上へ置いている',
    choreStyle: '家事の時刻を自動通知する仕組みは作るが、洗濯物をきれいに畳む作業だけは手動で遅い',
    homeCooking: 'ピザトーストの焼き時間を秒単位で比べ、家族が一番好きな設定を保存している',
    morningStyle: 'スマート照明を段階的に明るくし、最後のアラームで起きて最短手順で支度する',
    offDutyStyle: 'アウトドア帽と大きなリュックで端末を奥へしまい、紙の地図を外ポケットへ入れる',
    shoppingStyle: '電器店のジャンク箱とアウトドア店を回り、壊れた部品にも別の用途を探す',
    savingGoal: '望遠鏡の交換レンズと、夜通し観測できる軽い予備電源のために積み立てている',
    phoneStyle: '待受は星図の暗色画面で、通知は重要度で三段階に分け、夜は家族以外を止める',
    photoStyle: 'エラー画面、分解前の配線、星の位置を撮り、後から同じ条件を再現できるようにする',
    dinnerTime: '一つの話題だけは端末で調べず、家族の記憶と推測で最後まで話してみる',
    bedtimeStyle: 'コードを一度保存し全画面を消してから、紙の星図へ明日の空を鉛筆で印す',
    neighborhoodSpot: '町外れの低い丘は街灯が少なく、端末をしまって星を探すための定位置になっている',
    neighborTie: '古い電器修理店の店主から直せない機械も受け取り、分解前に元の用途を聞いて記録する',
    allowanceStyle: '部品、定額サービス、観測旅行の三項目を表計算へ入れ、月末に余りを自動で貯金へ回す',
    giftStyle: '相手が毎日一度使える小さな道具を選び、説明書を一枚だけ分かりやすく作る',
    sickDay: '体温を記録したくなるが、数字が上がったら端末を閉じ、水分と睡眠を優先する閾値を決めている',
    resetStyle: '端末を鞄の奥へ入れて丘まで歩き、星を三つ自力で見つけるまで検索しない',
  },
  yuu: {
    familyScene: '朝食は静かだが、家族が読み終えた本を食卓の端へ置き、気になった人が次に読む',
    familyRole: '買い物メモや提出書類の文章を整え、家族が伝えにくい内容を短い言葉へ直す',
    roomScene: '本と原稿は物語ごとの山になり、机の片隅にはヒトカラ用の歌詞ノートが伏せてある',
    privateTreasure: '初めて自作を最後まで読んでもらった日の感想カードと、最初のライブチケットを保管する',
    choreStyle: '朗読を聞きながらタオルを畳むのは得意だが、掃除機の音で考えが切れると動きも止まる',
    homeCooking: 'クリームシチューを弱火で煮ながら、湯気の向こうに浮かんだ場面をメモする',
    morningStyle: 'ココアを一口飲むまではほとんど話さず、昨夜の一文だけ読み返して髪を整える',
    offDutyStyle: '大きな黒いパーカーと控えめな眼鏡で、友だちと歩くときは半歩後ろを選ぶ',
    shoppingStyle: '古本屋、静かな喫茶店、空いている時間のカラオケを一人で順番に回る',
    savingGoal: '雑音を拾いにくい小さなマイクと、好きな作家の初版本のどちらを先に買うか迷っている',
    phoneStyle: '待受は雨の窓で、短い返信にも下書きを作り、送る直前に一文だけ削る',
    photoStyle: '誰もいない椅子、雨粒の窓、閉店前の看板など物語が始まりそうな余白を撮る',
    dinnerTime: '家族の話を聞く方が多いが、心に残った言い回しは食後に原稿へそっと書き留める',
    bedtimeStyle: '一段落だけ書き、歌詞ノートを小声で一度読み、続きの一文を決めずに眠る',
    neighborhoodSpot: '駅裏の古い喫茶店の隅は人の声が遠く、短い物語を書く定位置になっている',
    neighborTie: '古本屋の店主が会話を急かさず、好みに合いそうな一冊を無言でカウンターへ置いてくれる',
    allowanceStyle: '本代と喫茶店代を先に分け、ライブやカラオケへ行く月は古本を一冊我慢する',
    giftStyle: '相手に似た登場人物のいる本を選び、理由は押しつけず栞へ一行だけ書く',
    sickDay: '布団へ本を持ち込みすぎるが、熱がある日は目を閉じて朗読だけを聞き、返信もしない',
    resetStyle: '空いているヒトカラで一曲だけ思い切り歌うか、友だちの半歩後ろを黙って歩く',
  },
}

export const CHARACTER_LEARNING_ADVICE = {
  mio: {
    focus: '15分のタイマーをかけ、終わるまでは一つの問題だけを見る',
    memory: '覚えたい言葉を声とリズムに乗せ、見ないでもう一度言う',
    review: '習った夜、翌日、三日後の三回に分けて短く思い出す',
    mistakes: '間違えた理由を一文で読み上げ、正しい手順を言い直す',
    explain: '歌詞を紹介するように、要点を自分の言葉で三行にする',
    motivation: '好きな曲を一曲だけ開始の合図にして、曲が終わる前に机へ向かう',
    planning: 'テスト範囲を十日分の小節みたいに分け、毎日一つずつ終える',
    stuck: '文章題を「場面・分かる数字・聞かれていること」の三つに分ける',
    nerves: '四拍で吸って八拍で吐き、最初は確実に解ける一問から始める',
    backlog: '遅れを全部数えず、次の得点につながる一単元だけを今日の目標にする',
  },
  ren: {
    focus: '机の上を白い紙一枚にして、二十五分だけその紙の範囲へ集中する',
    memory: '関係する言葉を色と矢印で一枚の図にし、ラベルを隠して描き直す',
    review: '元のノートを閉じ、白紙へどこまで再現できるか確かめる',
    mistakes: '間違えた考えを薄い色、直した考えを濃い色で並べて違いを見る',
    explain: '初めて見る人にも伝わる図を一つ描き、言葉は三つまでに絞る',
    motivation: 'いちばん描きやすい図や表から手を動かし、勢いが出てから本文へ進む',
    planning: '範囲全体を一枚に広げ、未着手・練習中・確認済みを色分けする',
    stuck: '長い説明を箱と矢印へ置き換え、つながらない場所だけ質問にする',
    nerves: '問題全体を眺めて見慣れた形へ印をつけ、そこから解き始める',
    backlog: '全範囲の地図を先に作り、空白の中から重要な三か所だけを塗る',
  },
  haru: {
    focus: '一段落読んだら本を閉じ、一言で要約してから次へ進む',
    memory: '答えを隠した小さなカードで、読むより先に思い出す練習をする',
    review: 'その日、翌日、一週間後に同じ問いへ答え、忘れた所だけ読み返す',
    mistakes: '正解を書き写す前に「なぜその答えを選んだか」を一行残す',
    explain: '結論・根拠・具体例の順で、三文だけの説明を作る',
    motivation: 'まず二ページ、または一問だけと決め、続けるかは終えてから選ぶ',
    planning: '章や単元を栞の位置で区切り、毎日の終点を目で見えるようにする',
    stuck: '問題文から確実に言える一文を探し、そこを最初の根拠にする',
    nerves: '設問の条件へ静かに線を引き、急いで答える前に読み落としを止める',
    backlog: '全部を同じ深さで読まず、頻出の章から要約一行ずつ取り戻す',
  },
  akari: {
    focus: '二十分だけ「今から確かめること」を一つ決め、ほかの疑問はメモへ逃がす',
    memory: '覚える前に予想し、答えを見た後で予想との違いを言葉にする',
    review: '同じ問題を数字や条件だけ変えて、翌日にもう一度実験する',
    mistakes: '原因を知識不足・読み違い・計算の三つに分類し、直す方法も一つ書く',
    explain: '予想・方法・結果・分かったことの四枠で説明する',
    motivation: '五分で終わる小さな実験問題を一つ選び、結果への好奇心を入口にする',
    planning: '試験日から逆算し、理解する日・練習する日・確かめる日を分ける',
    stuck: '条件を一つずつ変え、どこから答えが変わるかを確かめる',
    nerves: '使う公式や注意点を開始前に三つだけ書き、頭の作業台を空ける',
    backlog: '一番大きな穴を小テストで特定し、その原因へ一回だけ修正実験をする',
  },
  kaito: {
    focus: '十五分を一本の練習にして、問題数を決めたら途中で種目を変えない',
    memory: '短いカードで答えを先に思い出し、正解したカードほど間隔を空ける',
    review: '練習直後・翌日・週末の三本に分け、短時間で同じ問題へ戻る',
    mistakes: '間違えた一問へ翌日もう一度挑み、できたら再戦済みの印をつける',
    explain: 'チームメートへ作戦を伝えるつもりで、最初の一手から声に出す',
    motivation: '準備運動みたいな簡単な一問を解き、その勢いで本番の一問へ移る',
    planning: '範囲を一周する日を先に決め、二周目は間違いだけに絞る',
    stuck: '似た例題へ戻って一手目だけまねし、違う条件を見つける',
    nerves: '肩の力を抜いて長く息を吐き、取れる問題からリズムを作る',
    backlog: '遅れを短い区間へ切り、今日は一区間を走り切れば合格にする',
  },
  rei: {
    focus: '終了時刻と終える作業を先に決め、通知を切って二十五分だけ実行する',
    memory: 'ノートを質問の形へ直し、答えを隠して説明できるか確認する',
    review: '一日後・三日後・一週間後を予定表へ入れ、忘れた項目だけ再確認する',
    mistakes: '原因と次の対策を一行ずつ記録し、同じ原因の再発を数える',
    explain: '結論を先に述べ、理由と例を一つずつ続ける',
    motivation: '五分だけの着手を予定として確保し、続きは始めた自分へ任せる',
    planning: '重要度と締切で優先順位をつけ、毎日必須一つと余裕があれば一つに絞る',
    stuck: '分かること・分からないこと・試したことを分けてから質問する',
    nerves: '持ち物と解く順番を前日に確認し、当日は決めた手順だけを実行する',
    backlog: '課題を重要度A・B・Cに分け、まずAの最小単位だけを完了させる',
  },
  nao: {
    focus: '友だちと開始時刻を合わせ、二十分後にできたことを一言送り合う',
    memory: '覚えた言葉をその日の会話で一度使い、翌日は別の文で使い直す',
    review: '友だちと短い問題を出し合い、説明できなかった所だけ持ち帰る',
    mistakes: '間違えた文と直した文を並べ、笑える例文にしてもう一度使う',
    explain: '相手の表情を見ながら別の言い方を二つ試す',
    motivation: '勉強仲間へ「今から一問」と宣言し、終わったら結果だけ知らせる',
    planning: '一人で抱えず、問題を出し合う日と自分で直す日を交互に置く',
    stuck: 'どの言葉から分からないかを口に出し、そこだけ誰かへ聞く',
    nerves: '完璧な一言より伝わる一言を選び、間違えたら言い直せばいいと決める',
    backlog: '助けを頼む課題を一つ、自分で進める課題を一つ選んで同時に抱えすぎない',
  },
  tsubaki: {
    focus: '姿勢と机を整え、最初の一問が終わるまでは席を立たない',
    memory: '見ずに唱えてから書き、抜けた部分だけをもう一度唱える',
    review: '当日・翌日・三日後に一度ずつ向き合い、できたら回数を減らす',
    mistakes: '途中の型を一手ずつ確認し、崩れ始めた場所からやり直す',
    explain: '手順を一つずつ短く言い切り、順番を変えずに伝える',
    motivation: '机へ座って五分だけ型を確かめ、終われば休んでもよいことにする',
    planning: '朝に一科目だけ確認し、夜はその日の間違いだけを直す',
    stuck: '難しい技へ急がず、使っている基本事項を一つずつ確かめる',
    nerves: 'ゆっくり礼をするように呼吸を整え、一問ごとに姿勢を戻す',
    backlog: '最も弱い基本を一つ選び、今日の稽古はそこだけに集中する',
  },
  noa: {
    focus: '通知を止めて二十五分だけ作業し、気になったことは別のメモへ退避する',
    memory: '答えを見るカードではなく、答えを入力してから照合するカードを作る',
    review: '翌日・三日後・一週間後に通知を置き、正解した項目は次の間隔を伸ばす',
    mistakes: '誤答ログへ原因・正しい手順・次に気づく合図の三点を残す',
    explain: '解き方をプログラムの手順みたいに、条件分岐まで順番に書く',
    motivation: '教材を開いて一件だけログをつける。続行するかはその後に判断する',
    planning: '課題を小さなタスクへ分解し、未着手・作業中・確認済みで管理する',
    stuck: '条件を最小にした簡単な問題で同じ失敗が起きるか再現する',
    nerves: '見直しチェックを固定し、計算・単位・設問条件の順で機械的に確認する',
    backlog: '課題一覧から次の一件だけ選び、完了してから新しい一件を開く',
  },
  yuu: {
    focus: '二十分を一場面として区切り、その時間は一つの問いだけを書き進める',
    memory: '覚える内容を短い物語や具体的な場面へ置き換えて思い出す',
    review: 'ノートを閉じて要約を書き、翌日に元の内容との違いを確かめる',
    mistakes: '誤った答えを消さず、どこで話の筋が変わったかを書き添える',
    explain: '自分の一文で結論を書き、根拠になる一文を資料から添える',
    motivation: '完成を考えず最初の一文だけ書き、次の一文はその後で決める',
    planning: '範囲を章立てし、毎日一節ずつ終わる小さな締切を置く',
    stuck: '何が分からないかを疑問文で書き、答えに必要な情報を探す',
    nerves: '解き始めの合図になる言葉を決め、答案の最初の一行へ集中する',
    backlog: 'いちばん大切な一ページを選び、そこだけは自分の言葉で書き直す',
  },
}

// この会話世界の架空の年間予定。利用者本人の学校日程とは混同しない。
export const CHARACTER_SCHOOL_TESTS = [
  { id: 'year-end', month: 2, day: 19, label: '学年末テスト' },
  { id: 'first-midterm', month: 5, day: 21, label: '一学期中間テスト' },
  { id: 'first-final', month: 7, day: 2, label: '一学期期末テスト' },
  { id: 'second-midterm', month: 10, day: 15, label: '二学期中間テスト' },
  { id: 'second-final', month: 12, day: 3, label: '二学期期末テスト' },
]

export function nextCharacterSchoolTest(now = new Date()) {
  const currentUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  const candidates = []
  for (const year of [now.getFullYear(), now.getFullYear() + 1]) {
    for (const test of CHARACTER_SCHOOL_TESTS) {
      const eventUtc = Date.UTC(year, test.month - 1, test.day)
      if (eventUtc >= currentUtc) candidates.push({ ...test, year, eventUtc })
    }
  }
  candidates.sort((a, b) => a.eventUtc - b.eventUtc)
  const next = candidates[0]
  return {
    ...next,
    dateLabel: `${next.month}月${next.day}日`,
    daysUntil: Math.round((next.eventUtc - currentUtc) / 86_400_000),
  }
}

function question(id, categoryId, intentId, phrases, answer) {
  return { id, categoryId, intentId, phrases, answer }
}

const factAnswers = (first, second) => (context) => [first(context), second(context)]

export const CHARACTER_DAILY_QUESTIONS = [
  question('unexpected-side', 'surprise', 'curious', ['「みんなが知らない意外な一面ってある？」', '「学校では見せない顔、こっそり教えて？」'], factAnswers(
    ({ facts }) => `実は、${facts.unexpectedSide}んだ。自分ではそんなに意外だと思っていなかったけどね。`,
    ({ facts }) => `${facts.unexpectedSide}よ。初めて見た友だちには、だいたい二度見される。`,
  )),
  question('sweet-secret', 'surprise', 'playful', ['「実は、ものすごい甘党だったりする？」', '「甘いものの前だと性格変わる？」'], factAnswers(
    ({ facts }) => `${facts.sweetSecret}んだ。甘いものの前では、少しくらい表情に出ても仕方ないよね。`,
    ({ facts }) => `${facts.sweetSecret}よ。これは学校での印象と違うって、よく驚かれる。`,
  )),
  question('animal-side', 'surprise', 'playful', ['「猫派？ 犬派？」', '「動物の前だと、いつもと雰囲気変わる？」'], factAnswers(
    ({ facts }) => `${facts.animalSide}んだ。見かけると、つい普段より顔がゆるんでしまう。`,
    ({ facts }) => `${facts.animalSide}よ。たぶん動物の前が、いちばん無防備かもしれない。`,
  )),
  question('secret-hobby', 'surprise', 'curious', ['「誰にも言ってない趣味ってある？」', '「放課後の姿から想像できない趣味、ある？」'], factAnswers(
    ({ facts }) => `実は、${facts.secretHobby}んだ。話すきっかけがなくて、あまり知られていない。`,
    ({ facts }) => `${facts.secretHobby}よ。始めると時間を忘れるくらい夢中になる。`,
  )),
  question('weekend-transformation', 'surprise', 'playful', ['「休日は学校と雰囲気変わる？」', '「休みの日、別人みたいになるって本当？」'], factAnswers(
    ({ facts }) => `休日は、${facts.weekendLook}んだ。待ち合わせでは先に声をかけるようにしてる。`,
    ({ facts }) => `${facts.weekendLook}よ。学校の姿しか知らない人には、すぐ気づいてもらえない。`,
  )),

  question('test-countdown', 'school', 'curious', ['「学校のテストまで、あと何日だっけ？」', '「次の定期テストって、いつだっけ？」'], ({ schedule, persona }) => {
    const countdown = schedule.daysUntil === 0 ? '今日' : `あと${schedule.daysUntil}日`
    return [`この学校の次の${schedule.label}は${schedule.dateLabel}。今日を入れずに${countdown}だよ。${persona.motto}`, `${schedule.dateLabel}の${schedule.label}が次だね。${countdown}だから、${persona.topics.study}`]
  }),
  question('test-start', 'school', 'action', ['「テスト勉強、いつから始める？」', '「定期テストの準備は何日前から？」'], factAnswers(
    ({ facts }) => `私は${facts.testPrep}よ。全部を一晩でやろうとしないようにしてる。`,
    ({ facts }) => `${facts.testPrep}かな。最初の日は、範囲を確かめるだけでも始めたことにしてる。`,
  )),
  question('favorite-subject', 'school', 'playful', ['「いちばん好きな教科は？」', '「授業で楽しみなのは何？」'], factAnswers(
    ({ facts, student }) => `${facts.favoriteSubject}が好き。${student.club}で過ごす時間にも、意外とつながってるんだ。`,
    ({ facts }) => `楽しみなのは${facts.favoriteSubject}。授業のあとも${facts.hobby}へ結びつけて考えたくなるよ。`,
  )),
  question('difficult-subject', 'school', 'empathy', ['「ちょっと苦手な教科はある？」', '「どの授業がいちばん難しい？」'], factAnswers(
    ({ facts }) => `${facts.difficultSubject}は少し苦手。だから、分からない場所を一つずつ切り分けてる。`,
    ({ facts }) => `今は${facts.difficultSubject}かな。苦手って分かったところが、次の練習場所だと思ってる。`,
  )),
  question('school-place', 'school', 'curious', ['「学校で落ち着く場所はどこ？」', '「校内でいちばん好きな場所は？」'], ({ student, persona }) => [`${student.club}で使う場所が落ち着くよ。${persona.topics.club}`, `${persona.topics.favorites} 学校では${student.club}のいつもの場所に戻ると、ほっとする。`]),

  question('study-daily', 'study', 'curious', ['「1日どれくらい勉強してる？」', '「普段の勉強時間って何分くらい？」'], factAnswers(
    ({ facts }) => `${facts.studyWeekday}。${facts.studyMethod}ようにしてるよ。`,
    ({ facts }) => `だいたい${facts.studyWeekday}かな。${facts.studyTime}、忙しい日は半分でも触れるよ。`,
  )),
  question('study-weekend', 'study', 'curious', ['「休みの日は何時間くらい勉強する？」', '「休日も勉強してる？」'], factAnswers(
    ({ facts }) => `${facts.studyWeekend}。終わったら${facts.weekend}よ。`,
    ({ facts }) => `勉強は${facts.studyWeekend}かな。区切りがついたら「${facts.hobby}」へ切り替える。`,
  )),
  question('study-time', 'study', 'action', ['「いつ勉強することが多い？」', '「勉強を始める時間は決めてる？」'], factAnswers(
    ({ facts }) => `${facts.studyTime}、${facts.studyPlace}で始めることが多いよ。`,
    ({ facts }) => `だいたい${facts.studyTime}。${facts.studyMethod}ようにして、迷う時間を減らすんだ。`,
  )),
  question('study-place', 'study', 'curious', ['「どこで勉強すると集中できる？」', '「家ではどこで宿題してる？」'], factAnswers(
    ({ facts }) => `${facts.studyPlace}がいちばん集中できる。必要なものだけ置くようにしてるよ。`,
    ({ facts }) => `宿題は${facts.studyPlace}でやることが多いな。そこへ座ると勉強の気分に切り替わる。`,
  )),
  question('study-method', 'study', 'action', ['「覚えるとき、どんな工夫してる？」', '「おすすめの勉強法ある？」'], factAnswers(
    ({ facts }) => `私は${facts.studyMethod}よ。自分の得意なやり方へ変えると続きやすい。`,
    ({ facts }) => `${facts.studyMethod}のがおすすめ。合わなければ、少しずつ変えていいと思う。`,
  )),

  question('technique-focus', 'learning-technique', 'action', ['「集中が続くコツを教えて」', '「勉強中に気が散るとき、どうしてる？」'], factAnswers(
    ({ learning }) => `私なら、${learning.focus}よ。短い区切りの間だけ守ればいいから、始めやすい。`,
    ({ learning }) => `まず${learning.focus}。終わったら一度休んで、次も続けるか選ぶといいよ。`,
  )),
  question('technique-memory', 'learning-technique', 'curious', ['「暗記しやすくなる方法、ある？」', '「覚えてもすぐ忘れるときはどうする？」'], factAnswers(
    ({ learning }) => `私は${learning.memory}ようにしてる。読むだけでなく、思い出す時間を作るのがポイント。`,
    ({ learning }) => `${learning.memory}のがおすすめ。答えを見ない一回が、記憶の練習になるよ。`,
  )),
  question('technique-review', 'learning-technique', 'action', ['「復習って、いつやればいい？」', '「習ったことを忘れにくくするには？」'], factAnswers(
    ({ learning }) => `${learning.review}よ。一回を長くするより、間を空けて思い出す回数を作るんだ。`,
    ({ learning }) => `私は${learning.review}。全部ではなく、思い出せなかった所へ時間を使うよ。`,
  )),
  question('technique-mistakes', 'learning-technique', 'curious', ['「間違えた問題はどう直してる？」', '「解き直しを身につけるコツは？」'], factAnswers(
    ({ learning }) => `${learning.mistakes}よ。答えだけ直すより、次に同じ所で止まれるようになる。`,
    ({ learning }) => `私は${learning.mistakes}。間違いは消すものじゃなく、次の手がかりにしてる。`,
  )),
  question('technique-explain', 'learning-technique', 'curious', ['「本当に理解できたか確かめる方法は？」', '「分かったつもりを防ぐにはどうする？」'], factAnswers(
    ({ learning }) => `${learning.explain}よ。途中で言葉に詰まった場所が、もう一度見る場所。`,
    ({ learning }) => `ノートを閉じて、${learning.explain}。自分で説明できれば理解の輪郭が見えるよ。`,
  )),

  question('advice-motivation', 'learning-advice', 'empathy', ['「やる気が出ない日は、どう始めればいい？」', '「勉強したくないときの最初の一歩は？」'], factAnswers(
    ({ learning }) => `そんな日は、${learning.motivation}のがいいよ。やる気は始めたあとに来ても大丈夫。`,
    ({ learning }) => `私なら${learning.motivation}。小さく始められたら、今日はもう前進してる。`,
  )),
  question('advice-planning', 'learning-advice', 'action', ['「テスト勉強の計画、一緒に考えて」', '「勉強計画がいつも崩れるんだけど？」'], factAnswers(
    ({ learning }) => `${learning.planning}と崩れにくいよ。予定には休む日と直す日も入れておこう。`,
    ({ learning }) => `私は${learning.planning}。できなかった分を翌日へ全部足さず、優先順位を決め直すよ。`,
  )),
  question('advice-stuck', 'learning-advice', 'empathy', ['「分からない問題で止まったら、どうする？」', '「考えても解けないとき、何から見直す？」'], factAnswers(
    ({ learning }) => `${learning.stuck}と入口が見えやすいよ。十分考えたら、印をつけて質問していい。`,
    ({ learning }) => `私は${learning.stuck}。分からないまま粘る時間にも、区切りを決めてる。`,
  )),
  question('advice-nerves', 'learning-advice', 'empathy', ['「テスト本番で緊張したら、どうする？」', '「試験になると頭が真っ白になるんだ」'], factAnswers(
    ({ learning }) => `${learning.nerves}と落ち着きやすいよ。緊張しても、身につけた力まで消えたわけじゃない。`,
    ({ learning }) => `まず${learning.nerves}。全部を一度に考えず、目の前の一問へ戻ろう。`,
  )),
  question('advice-backlog', 'learning-advice', 'action', ['「勉強が遅れたとき、どう取り戻せばいい？」', '「やることが多すぎて、どこから手をつける？」'], factAnswers(
    ({ learning }) => `${learning.backlog}と動き出せるよ。全部を今日取り戻そうとしなくていい。`,
    ({ learning }) => `まず${learning.backlog}。終えたら次の一つを選べば、山も少しずつ低くなる。`,
  )),

  question('summer-club-busy', 'club', 'curious', ['「夏休みは部活、忙しいの？」', '「夏の部活って週に何日ある？」'], factAnswers(
    ({ facts }) => `${facts.summerClub}だよ。忙しいけど、休む日はちゃんと休むつもり。`,
    ({ facts }) => `夏は${facts.summerClub}。いつもより集中する分、終わったあとの時間も大事にしてる。`,
  )),
  question('club-name', 'club', 'playful', ['「何部に入ってるんだっけ？」', '「放課後はどの部活へ行くの？」'], ({ student, facts }) => [`${student.club}だよ。放課後は${facts.afterSchool}ことが多い。`, `私は${student.club}。活動日は、${facts.afterSchool}よ。`]),
  question('club-goal', 'club', 'action', ['「部活で今の目標は？」', '「この夏、部活で達成したいことは？」'], factAnswers(
    ({ facts }) => `今の目標は、${facts.clubGoal}。少しずつ近づいてるところ。`,
    ({ facts }) => `${facts.clubGoal}のが目標だよ。結果だけじゃなく、そこまでの過程も残したい。`,
  )),
  question('club-hard', 'club', 'empathy', ['「部活で大変なのはどんなところ？」', '「練習でつらいときってある？」'], factAnswers(
    ({ facts }) => `${facts.clubHard}は大変。でも、仲間と話すと次のやり方が見えてくる。`,
    ({ facts }) => `つらいのは${facts.clubHard}かな。うまくいかない日も練習の一部だと思うようにしてる。`,
  )),
  question('club-fun', 'club', 'playful', ['「部活のいちばん楽しい瞬間は？」', '「その部活に入ってよかった？」'], ({ persona }) => [`入ってよかったよ。${persona.topics.club}`, `${persona.topics.club} その瞬間があるから、また次も行きたくなる。`]),

  question('wake-time', 'routine', 'curious', ['「朝は何時に起きてる？」', '「いつも早起き？」'], factAnswers(
    ({ facts }) => `${facts.wake}に起きて、${facts.breakfast}で目を覚ますよ。`,
    ({ facts }) => `だいたい${facts.wake}。朝の支度が終わると${facts.commute}の通学が始まる。`,
  )),
  question('sleep-time', 'routine', 'empathy', ['「夜は何時ごろ寝る？」', '「ちゃんと寝られてる？」'], factAnswers(
    ({ facts }) => `${facts.sleep}には寝るようにしてる。その前に${facts.hobby}で気持ちを切り替える日もあるよ。`,
    ({ facts }) => `目標は${facts.sleep}。遅くなった日は、翌日の${facts.afterSchool}予定を詰めすぎない。`,
  )),
  question('commute', 'routine', 'curious', ['「学校までどうやって来てる？」', '「通学ってどれくらいかかる？」'], factAnswers(
    ({ facts }) => `${facts.commute}だよ。途中で${facts.hobby}のことを考える日もある。`,
    ({ facts }) => `通学は${facts.commute}くらい。放課後は「${facts.afterSchool}」という流れで、帰り道に気持ちを切り替える。`,
  )),
  question('after-school', 'routine', 'curious', ['「放課後はいつも何してる？」', '「授業が終わったら、すぐ帰る？」'], factAnswers(
    ({ facts }) => `たいていは${facts.afterSchool}よ。何もない日は少し寄り道もする。`,
    ({ facts }) => `授業のあとは、${facts.afterSchool}。帰り道で一日のことを考えるのも好き。`,
  )),
  question('phone-reply', 'routine', 'playful', ['「メッセージの返事、早い方？」', '「既読つけてから考えるタイプ？」'], factAnswers(
    ({ facts }) => `私は${facts.phone}タイプ。遅くても忘れてるわけじゃないよ。`,
    ({ facts }) => `${facts.phone}かな。返し方にも性格って出るよね。`,
  )),

  question('breakfast', 'food', 'curious', ['「朝ごはん、何を食べた？」', '「いつもの朝ごはんは？」'], factAnswers(
    ({ facts }) => `今日は${facts.breakfast}。朝に食べると、やっと一日が始まる感じがする。`,
    ({ facts }) => `いつもは${facts.breakfast}が多いよ。忙しくても少しは食べる。`,
  )),
  question('lunch', 'food', 'curious', ['「今日のお昼、何持ってきた？」', '「お弁当はどんな感じ？」'], factAnswers(
    ({ facts }) => `${facts.lunch}だよ。昼休みにみんなで開けるのが楽しみ。`,
    ({ facts }) => `今日は${facts.lunch}。少しずつ交換するのも面白いよね。`,
  )),
  question('snack', 'food', 'playful', ['「帰りに何か食べていく？」', '「よく買うおやつは何？」'], factAnswers(
    ({ facts }) => `${facts.snack}をよく選ぶよ。今日はみんなで分ける？`,
    ({ facts }) => `帰りなら${facts.snack}かな。頑張った日の小さな回復アイテム。`,
  )),
  question('favorite-food', 'food', 'playful', ['「いちばん好きな食べ物は？」', '「ごほうびに食べたいものは？」'], factAnswers(
    ({ facts }) => `${facts.favoriteFood}！ 頑張った日のごほうびなら、迷わず選ぶよ。`,
    ({ facts }) => `いちばんは${facts.favoriteFood}かな。話してたら急に食べたくなってきた。`,
  )),
  question('drink', 'food', 'curious', ['「休憩するとき何を飲む？」', '「水筒には何を入れてる？」'], factAnswers(
    ({ facts }) => `${facts.drink}を飲むことが多いよ。一口飲むと休憩の合図になる。`,
    ({ facts }) => `水筒は${facts.drink}。季節で温度だけ変えてるよ。`,
  )),

  question('friend-hangout', 'friends', 'playful', ['「友だちとはどこで遊ぶ？」', '「放課後、みんなでどこへ行く？」'], factAnswers(
    ({ facts }) => `${facts.hangout}ことが多いよ。目的がなくても話してるだけで楽しい。`,
    ({ facts }) => `みんなとは${facts.hangout}かな。途中の寄り道がいちばん長くなる。`,
  )),
  question('friend-talk', 'friends', 'curious', ['「友だちと何を話すことが多い？」', '「みんなでいるとき、どんな話で盛り上がる？」'], ({ facts, persona }) => [`${facts.hobby}の話から、いつも別の話へ脱線するよ。${persona.topics.friends}`, `${persona.topics.friends} 最近は${facts.hobby}の話で盛り上がることが多い。`]),
  question('friend-fight', 'friends', 'empathy', ['「友だちと気まずくなったらどうする？」', '「けんかしたあと、最初になんて言う？」'], ({ persona }) => [`すぐ結論を出さず、まず相手の話を聞くよ。${persona.topics.friends}`, `${persona.topics.friends} だから「さっきはごめん、もう一度話せる？」から始めたい。`]),
  question('friend-help', 'friends', 'empathy', ['「困ったとき、友だちに頼れる？」', '「助けてって言うの、得意？」'], ({ persona }) => [`得意とは言えないけど、一人で抱えすぎる前に短く伝える練習中。${persona.motto}`, `${persona.motto} だから最近は「少しだけ手伝って」と具体的に言うようにしてる。`]),
  question('group-role', 'friends', 'playful', ['「グループではどんな役になる？」', '「みんなで出かけるとき、計画する方？」'], ({ student }) => [`${student.trait} たぶん、そんな自分らしい役になるかな。自分では自然にしてるだけ。`, `${student.club}での癖が出て、できる役を先に探すことが多いよ。`]),

  question('weekend-plan', 'weekend', 'curious', ['「今度の休み、何する予定？」', '「休日はどう過ごしてる？」'], factAnswers(
    ({ facts }) => `${facts.weekend}つもり。予定を詰めすぎない日も必要だよね。`,
    ({ facts }) => `休みの日は、${facts.weekend}ことが多いよ。気分で少し変える。`,
  )),
  question('rainy-day', 'weekend', 'playful', ['「雨の休日は何してる？」', '「外に出られない日は退屈じゃない？」'], factAnswers(
    ({ facts }) => `雨の日は家で${facts.hobby}。静かな音があると、いつもより集中できる。`,
    ({ facts }) => `退屈しないよ。${facts.hobby}なら、雨の日だからこそゆっくりできる。`,
  )),
  question('weekend-study', 'weekend', 'curious', ['「土日も勉強時間を決めてる？」', '「休みの日の勉強はいつやる？」'], factAnswers(
    ({ facts }) => `${facts.studyWeekend}を目安にしてる。終わったら${facts.weekend}よ。`,
    ({ facts }) => `勉強は${facts.studyWeekend}を目安にして、そのあと${facts.hobby}へ切り替えることが多い。`,
  )),
  question('weekend-early', 'weekend', 'playful', ['「休みの日も早起きする？」', '「土曜の朝、二度寝するタイプ？」'], factAnswers(
    ({ facts }) => `普段は${facts.wake}だけど、休日は少しゆっくり。それから${facts.weekend}よ。`,
    ({ facts }) => `${facts.wake}より遅く起きることもある。${facts.summerPlan}日は逆に早起きできそう。`,
  )),
  question('weekend-outing', 'weekend', 'action', ['「次にみんなでどこへ行きたい？」', '「一日空いたら、何しに行く？」'], factAnswers(
    ({ facts }) => `${facts.summerPlan}な。みんなで行ける形に計画してみよう。`,
    ({ facts }) => `一日あるなら、${facts.summerPlan}。行き方から一緒に調べたい。`,
  )),

  question('summer-plan', 'summer', 'curious', ['「夏休みにやりたいことは？」', '「今年の夏、楽しみにしてることある？」'], factAnswers(
    ({ facts }) => `${facts.summerPlan}んだ。宿題とは別に、一つ思い出を作りたい。`,
    ({ facts }) => `楽しみなのは、${facts.summerPlan}こと。写真だけじゃなく、ちゃんと覚えていたい。`,
  )),
  question('summer-club', 'summer', 'empathy', ['「夏の部活、休む日もある？」', '「夏休みの部活、大変じゃない？」'], factAnswers(
    ({ facts }) => `${facts.summerClub}だけど、休みの日もあるよ。${facts.clubHard}には気をつける。`,
    ({ facts }) => `大変な日はある。夏は${facts.summerClub}だから、無理を続けないことも目標。`,
  )),
  question('summer-homework', 'summer', 'action', ['「夏休みの宿題、いつやる？」', '「宿題は最後にまとめるタイプ？」'], factAnswers(
    ({ facts }) => `最初に範囲を分けて、${facts.studyTime}${facts.studyPlace}で少しずつやるよ。最後の日は空けたい。`,
    ({ facts }) => `まとめないように、「${facts.studyMethod}」というやり方で毎日少し進めるつもり。`,
  )),
  question('summer-heat', 'summer', 'empathy', ['「暑い日、どうやって休んでる？」', '「夏バテしてない？」'], factAnswers(
    ({ facts }) => `${facts.drink}を飲んで、無理せず涼しい場所へ移るよ。頑張る前に休む。`,
    ({ facts }) => `少し疲れた日は${facts.favoriteFood}を食べて早めに寝る。夏は回復も予定に入れたい。`,
  )),
  question('summer-event', 'summer', 'playful', ['「夏祭り、みんなで行く？」', '「夏のイベントなら何が楽しみ？」'], factAnswers(
    ({ facts }) => `${facts.summerEvent}な。予定が合う人みんなで行こうよ。`,
    ({ facts }) => `私は${facts.summerEvent}。帰り道まで含めて楽しみ。`,
  )),

  question('hobby-now', 'hobby', 'curious', ['「最近ハマってることは？」', '「時間を忘れるくらい好きなことある？」'], factAnswers(
    ({ facts }) => `最近は${facts.hobby}。気づくと時間が過ぎてるよ。`,
    ({ facts }) => `${facts.hobby}かな。誰かに見せる予定がなくても続けたくなる。`,
  )),
  question('favorite-reason', 'hobby', 'curious', ['「それを好きになったきっかけは？」', '「好きなもののどこがいちばん好き？」'], ({ persona }) => [`きっかけは小さかったけど、続けるうちに大切になった。${persona.topics.favorites}`, `${persona.topics.favorites} 好きな理由は、今も少しずつ増えてるよ。`]),
  question('hobby-alone', 'hobby', 'empathy', ['「一人の時間は何してる？」', '「一人で過ごすのも好き？」'], factAnswers(
    ({ facts }) => `一人のときは${facts.hobby}。誰にも急かされない時間も好きだよ。`,
    ({ facts }) => `うん。${facts.hobby}ながら、自分のペースへ戻ることが多い。`,
  )),
  question('hobby-challenge', 'hobby', 'action', ['「次に挑戦したいことは？」', '「今できるようになりたいことある？」'], factAnswers(
    ({ facts }) => `次は${facts.clubGoal}。まず今週できるところから始めるよ。`,
    ({ facts }) => `${facts.clubGoal}のが今の挑戦。失敗しても記録は残したい。`,
  )),
  question('hobby-recommend', 'hobby', 'playful', ['「私にもおすすめを一つ教えて」', '「一緒にやるなら何がおすすめ？」'], factAnswers(
    ({ facts }) => `それなら${facts.hobby}を一緒にやろう。最初は見てるだけでも大丈夫。`,
    ({ facts }) => `${facts.favoriteFood}を用意して、${facts.hobby}会を開くのはどう？`,
  )),

  question('future-dream', 'future', 'curious', ['「将来やってみたいことは？」', '「大人になったら何になりたい？」'], ({ persona }) => [`${persona.topics.dreams} まだ形は変わるかもしれないけどね。`, `今考えているのは、${persona.topics.dreams} そのための一歩を探してる。`]),
  question('future-english', 'future', 'action', ['「英語でできるようになりたいことは？」', '「英語が話せたら何をしたい？」'], ({ persona }) => [`${persona.topics.english} 次は自分から一言届けられるようになりたい。`, `英語がもっと使えたら、${persona.topics.dreams} その世界を広げられそう。`]),
  question('future-near-goal', 'future', 'action', ['「今いちばん近い目標は？」', '「今月中にできるようになりたいことは？」'], factAnswers(
    ({ facts }) => `近い目標は、${facts.clubGoal}。今月できる小さな区切りを決めてる。`,
    ({ facts }) => `${facts.clubGoal}こと。今日できる一つまで小さくして進めるよ。`,
  )),
  question('future-tomorrow', 'future', 'playful', ['「明日の放課後、何してる？」', '「明日もここで話せる？」'], factAnswers(
    ({ facts }) => `明日は${facts.afterSchool}予定。そのあとなら、またここで話せるよ。`,
    ({ facts }) => `${facts.afterSchool}けど、終わったら来る。続きも取っておいて。`,
  )),
  question('future-school-goal', 'future', 'empathy', ['「学校生活で大切にしたいことは？」', '「卒業までに残したいものはある？」'], ({ student, persona }) => [`${persona.motto} だから、${student.club}で仲間と過ごした時間を大切に残したい。`, `${student.trait} そんな自分のまま、誰かと一緒に挑戦した記憶を残したいな。`]),

  question('home-arrival', 'home', 'curious', ['「家に着いたら、最初に何する？」', '「ただいまのあとって、いつも何してる？」'], factAnswers(
    ({ facts }) => `放課後は「${facts.afterSchool}」ことが多いから、家に着いたらまず${facts.drink}を一口飲むよ。`,
    ({ facts }) => `家に着いたら${facts.snack}で一息ついて、それから今日の残りを考える。`,
  )),
  question('home-room', 'home', 'curious', ['「自分の部屋ってどんな感じ？」', '「家でいちばん落ち着く場所は？」'], factAnswers(
    ({ facts }) => `${facts.studyPlace}の周りが、いちばん自分らしい場所かな。${facts.hobby}の道具も近くにあるよ。`,
    ({ facts }) => `落ち着くのは${facts.studyPlace}。勉強しない日は、そこで${facts.hobby}をしてる。`,
  )),
  question('home-meal', 'home', 'playful', ['「家のごはんで楽しみなのは？」', '「今日の晩ごはん、何だったらうれしい？」'], factAnswers(
    ({ facts }) => `${facts.favoriteFood}だったら、玄関で匂いに気づいた瞬間からうれしい。`,
    ({ facts }) => `今日は${facts.favoriteFood}がいいな。食後に${facts.drink}まであれば完璧。`,
  )),
  question('home-relax', 'home', 'empathy', ['「家ではどうやって力を抜いてる？」', '「疲れて帰った日は、何をすると落ち着く？」'], factAnswers(
    ({ facts }) => `疲れた日は${facts.hobby}。上手にやろうとせず、好きなだけ触れると落ち着くよ。`,
    ({ facts }) => `${facts.weekend}ような時間を少しだけ作る。家では急がないことも大事にしてる。`,
  )),
  question('home-night', 'home', 'empathy', ['「寝る前に必ずすること、ある？」', '「夜の最後はどう過ごしてる？」'], factAnswers(
    ({ facts }) => `連絡を返す速さは「${facts.phone}」くらい。${facts.sleep}までには明日の準備も終えるよ。`,
    ({ facts }) => `夜の最後は${facts.hobby}を少しだけ。${facts.sleep}には明かりを消したいな。`,
  )),

  question('feelings-tired', 'feelings', 'empathy', ['「疲れたって気づくのはどんなとき？」', '「無理しすぎた日のサインってある？」'], factAnswers(
    ({ facts }) => `「${facts.clubHard}」がいつも以上につらく感じたら、疲れてる合図。${facts.drink}を飲んで一度止まるよ。`,
    ({ facts }) => `いつもの${facts.hobby}まで楽しめなくなったら休む。頑張り直すのは、そのあとでいい。`,
  )),
  question('feelings-cheer-up', 'feelings', 'playful', ['「落ち込んだときの回復方法は？」', '「元気を出したい日に何する？」'], factAnswers(
    ({ facts }) => `${facts.snack}を用意して${facts.hobby}を始めると、少しずついつもの気分へ戻れるよ。`,
    ({ facts }) => `元気がない日は${facts.favoriteFood}を楽しみにして、まず今日を小さく終わらせる。`,
  )),
  question('feelings-proud', 'feelings', 'curious', ['「最近、自分をちょっと誇らしく思ったことは？」', '「誰かに褒めてほしい頑張り、ある？」'], ({ student, facts }) => [
    `「${facts.clubGoal}」へ向けて続けてることかな。${student.trait} そんな自分も少し悪くないと思えた。`,
    `${student.club}で、昨日できなかった一つをやり直したこと。結果より、逃げなかった自分を褒めたい。`,
  ]),
  question('feelings-nervous', 'feelings', 'empathy', ['「緊張するとき、どうやって落ち着く？」', '「本番前に心臓が速くなったらどうする？」'], factAnswers(
    ({ facts, learning }) => `${facts.difficultSubject}の本番でも、${learning.nerves}ようにしてる。緊張を消すより、最初の一歩を決めるんだ。`,
    ({ learning }) => `私は${learning.nerves}。落ち着いてから始めるんじゃなく、落ち着く手順ごと始めるよ。`,
  )),
  question('feelings-lonely', 'feelings', 'empathy', ['「ちょっと寂しい日は、誰かに言える？」', '「一人でいたくないとき、どうしてる？」'], factAnswers(
    ({ facts }) => `短くても連絡するよ。普段の返事は「${facts.phone}」という感じだけど、「少し話せる？」なら送れる。`,
    ({ facts }) => `${facts.hangout}友だちの顔を思い出して、次に会う約束を一つ作るかな。`,
  )),

  question('classroom-seat', 'classroom', 'curious', ['「教室ではどの席が好き？」', '「席替えなら、どのあたりを狙う？」'], factAnswers(
    ({ facts }) => `${facts.studyPlace}みたいに落ち着ける席がいいな。${facts.favoriteSubject}の板書も見やすい場所。`,
    ({ facts }) => `${facts.hobby}のことを考えすぎないよう、先生の声がきちんと届く席を選びたい。`,
  )),
  question('classroom-break', 'classroom', 'playful', ['「休み時間は何してる？」', '「次の授業まで十分あったらどう過ごす？」'], factAnswers(
    ({ facts }) => `${facts.snack}の話をしたり、${facts.hobby}の続きを少し考えたりしてるよ。`,
    ({ facts }) => `友だちと「次は${facts.hangout}？」って相談してると、十分なんてすぐ終わっちゃう。`,
  )),
  question('classroom-group', 'classroom', 'action', ['「班活動ではどんな役になる？」', '「グループで意見が割れたらどうする？」'], ({ student, persona }) => [
    `${student.trait} そんな自分らしく、まず全員の案を並べる役になることが多い。${persona.topics.friends}`,
    `${student.club}で覚えたやり方で、できることを小さく分けるよ。最後は全員が話せる順番にしたい。`,
  ]),
  question('classroom-presentation', 'classroom', 'action', ['「発表をうまくするコツ、ある？」', '「みんなの前で話すとき何を意識する？」'], factAnswers(
    ({ facts, learning }) => `${facts.favoriteSubject}の発表なら、「${learning.explain}」を自分の型にする。順番が決まると声も出しやすいよ。`,
    ({ learning }) => `私は${learning.explain}。全部を言うより、聞いた人が一つ持ち帰れる発表にしたい。`,
  )),
  question('classroom-forgotten', 'classroom', 'playful', ['「忘れ物に気づいたらどうする？」', '「教科書を忘れたら、最初に誰へ頼む？」'], ({ student, facts }) => [
    `まず先生へ正直に言って、${student.club}の仲間にも予備がないか聞く。隠して一時間困るより早いよ。`,
    `普段の連絡は「${facts.phone}」という感じ。登校前なら友だちへ短く確認して、着いてからなら隣の人に事情を話すよ。`,
  ]),

  question('event-culture-festival', 'events', 'action', ['「文化祭で何をやってみたい？」', '「クラスの出し物、何がいいと思う？」'], factAnswers(
    ({ facts }) => `${facts.hobby}を生かした展示がいいな。見る人も少し参加できる形にしたい。`,
    ({ facts }) => `部活で目指している「${facts.clubGoal}」の経験を使って、みんなで一つのものを完成させたい。`,
  )),
  question('event-sports-day', 'events', 'playful', ['「体育祭ではどの種目に出たい？」', '「応援と競技、どっちが燃える？」'], ({ student, facts }) => [
    `${student.club}らしさを生かせる役を探すよ。競技のあとは${facts.drink}を持って応援へ回りたい。`,
    `「${facts.clubHard}」の大変さを知ってるから、競技だけでなく最後まで声をかける係も大事にしたい。`,
  ]),
  question('event-school-trip', 'events', 'curious', ['「校外学習ならどこへ行きたい？」', '「遠足の自由時間、何をしたい？」'], factAnswers(
    ({ facts }) => `校外学習でも「${facts.summerPlan}」につながる場所へ行けたら楽しそう。移動中の景色も覚えておきたい。`,
    ({ facts }) => `自由時間は${facts.hangout}みたいに、少人数で寄り道できる余白がほしいな。`,
  )),
  question('event-committee', 'events', 'action', ['「学校行事では何係を選ぶ？」', '「準備が遅れていたら、どんな役をする？」'], ({ student, facts }) => [
    `${student.club}で慣れていることを使える係かな。普段の「${facts.afterSchool}」という経験も準備に生かせそう。`,
    `${student.trait} そんな自分なりに、残っている作業を見つけて一つ引き受けるよ。`,
  ]),
  question('event-food-stall', 'events', 'playful', ['「文化祭の屋台なら何を売りたい？」', '「模擬店のメニュー、一つ選ぶなら？」'], factAnswers(
    ({ facts }) => `${facts.favoriteFood}を学校向けの小さなサイズにして出したい。味見係は譲らないよ。`,
    ({ facts }) => `${facts.snack}を少し特別に飾ったメニュー。みんなで分けやすいのがいいな。`,
  )),

  question('season-spring', 'seasons', 'curious', ['「春になったら始めたいことは？」', '「新学期に一つ変えるなら何？」'], factAnswers(
    ({ facts }) => `春は「${facts.clubGoal}」へ近づく新しい一歩を始めたい。最初は小さくていい。`,
    ({ facts }) => `新学期は「${facts.studyMethod}」という自分のやり方を、今までより丁寧に続けてみたい。`,
  )),
  question('season-rain', 'seasons', 'empathy', ['「雨の日の登校、ちょっと憂うつじゃない？」', '「雨の日を楽しくする方法、ある？」'], factAnswers(
    ({ facts }) => `${facts.commute}の道は少し大変。でも帰ったら${facts.drink}を飲むって決めると気が楽になる。`,
    ({ facts }) => `雨音を聞きながら${facts.hobby}のことを考えるよ。急がない日に変えてしまえば悪くない。`,
  )),
  question('season-summer-sky', 'seasons', 'playful', ['「夏の空を見たら何したくなる？」', '「いちばん夏らしい瞬間って何だと思う？」'], factAnswers(
    ({ facts }) => `${facts.summerPlan}って思う。空の色まで、その日の記憶に残したいな。`,
    ({ facts }) => `私にとっては「${facts.summerEvent}」って考えてる時間も夏らしい。暑さも帰り道の風も、まとめて覚えていたい。`,
  )),
  question('season-autumn', 'seasons', 'curious', ['「秋の放課後は何をしたい？」', '「日が短くなると、過ごし方も変わる？」'], factAnswers(
    ({ facts }) => `秋は${facts.hobby}にちょうどいい。帰る前に${facts.snack}があれば、もう少しだけ続けたい。`,
    ({ facts }) => `暗くなる前に帰れるよう、友だちと${facts.hangout}日でも少し早めに切り上げるよ。`,
  )),
  question('season-winter', 'seasons', 'playful', ['「寒い朝、どうやって起きてる？」', '「冬に食べたくなるものは？」'], factAnswers(
    ({ facts }) => `${facts.breakfast}を楽しみにして布団から出るよ。温かい朝ごはんは強い味方。`,
    ({ facts }) => `冬なら${facts.favoriteFood}。それに${facts.drink}があれば、寒い日も少し好きになれる。`,
  )),

  question('place-favorite-campus', 'places', 'curious', ['「放課後、校内のどこにいることが多い？」', '「学校で君を探すなら、どこへ行けばいい？」'], ({ student, facts }) => [
    `普段は「${facts.afterSchool}」って感じだから、まず${student.club}の活動場所を探してみて。たぶんそこにいるよ。`,
    `放課後なら${student.club}の近くかな。帰る前には、いつもの場所を一度片づけてる。`,
  ]),
  question('place-library', 'places', 'curious', ['「図書室で一冊選ぶなら、どんな本？」', '「図書室では勉強する？ 本を読む？」'], factAnswers(
    ({ facts }) => `${facts.favoriteSubject}につながる本を一冊と、${facts.hobby}のヒントになる本を一冊選びたい。`,
    ({ facts }) => `最初は調べものをするけど、最後には${facts.hobby}に関係する棚へ寄ってしまう。`,
  )),
  question('place-rooftop', 'places', 'curious', ['「屋上へ行けたら、何を話したい？」', '「空がよく見える場所で考えたいことは？」'], ({ persona, facts }) => [
    `${persona.topics.dreams} そんな少し先の話を、${facts.drink}を飲みながらゆっくりしたい。`,
    `${persona.topics.today} 空が広い場所なら、いつもより正直に話せそう。`,
  ]),
  question('place-infirmary', 'places', 'empathy', ['「友だちが保健室へ行くとき、どうする？」', '「具合が悪そうな子がいたら声をかける？」'], factAnswers(
    ({ facts }) => `自分も「${facts.clubHard}」がつらい日はあるから、理由を問い詰めず一緒に先生のところへ行く。`,
    ({ facts }) => `声はかけるよ。「${facts.drink}、持ってこようか？」みたいに、答えやすい聞き方をする。`,
  )),
  question('place-courtyard', 'places', 'playful', ['「中庭で昼休みを過ごすなら何する？」', '「校庭のすみで動物を見つけたら？」'], factAnswers(
    ({ facts }) => `${facts.snack}を持って、友だちとゆっくり話したい。教室と違う声が聞こえるのも好き。`,
    ({ facts }) => `${facts.animalSide}から、たぶん授業のチャイム直前まで見てしまう。写真は驚かせない距離からね。`,
  )),

  question('small-stationery', 'small-talk', 'playful', ['「筆箱の中でいちばん気に入ってる物は？」', '「文房具を一つ新しくするなら何？」'], factAnswers(
    ({ facts }) => `${facts.studyMethod}ときに使いやすいペンかな。${facts.favoriteSubject}のノートだけ色を変えてる。`,
    ({ facts }) => `${facts.hobby}のメモにも使える、小さくて書きやすいペンを選びたい。`,
  )),
  question('small-lucky-item', 'small-talk', 'curious', ['「お守りみたいに持ってる物、ある？」', '「大事な日に鞄へ入れる物は？」'], ({ student, facts }) => [
    `${student.club}で使ってきた小さな道具かな。見ると「${facts.clubGoal}」という目標を思い出せる。`,
    `${facts.hobby}に関係する小物を一つ。役に立たなくても、自分の調子へ戻る合図になるよ。`,
  ]),
  question('small-nickname', 'small-talk', 'playful', ['「あだ名をつけるなら、どんなのがいい？」', '「友だちから何て呼ばれたい？」'], ({ student, persona }) => [
    `${student.trait} そんな自分らしさが伝わる、呼びやすい名前ならうれしい。本人のいない所でも優しいあだ名がいいな。`,
    `${persona.motto} そんな自分を笑って呼べるような、短いあだ名をみんなで考えたい。`,
  ]),
  question('small-photo', 'small-talk', 'playful', ['「みんなで写真を撮るなら、どんな一枚？」', '「学校生活の一枚を残すなら、いつ撮る？」'], factAnswers(
    ({ facts }) => `${facts.summerEvent}日に、準備中の顔まで入った写真を残したい。きれいに並びすぎない一枚。`,
    ({ facts }) => `${facts.weekendLook}姿で集合して、学校とは違うみんなを一枚にしたら面白そう。`,
  )),
  question('small-free-hour', 'small-talk', 'action', ['「放課後に一時間だけ空いたら何する？」', '「予定が急になくなったら、どこへ行く？」'], factAnswers(
    ({ facts }) => `${facts.hangout}よ。一時間なら、目的を決めすぎず話すくらいがちょうどいい。`,
    ({ facts }) => `急に空いたなら${facts.hobby}。誰かが一緒なら、その人の好きなことも半分やってみたい。`,
  )),

  question('family-atmosphere', 'family', 'curious', ['「家族といるとき、家はどんな雰囲気？」', '「家の中でいちばんにぎやかな時間は？」'], factAnswers(
    ({ privateLife }) => `${privateLife.familyScene}。学校とは違う速さで時間が流れるよ。`,
    ({ privateLife }) => `家で印象に残るのは、${privateLife.familyScene}。その時間はなるべく席を外さない。`,
  )),
  question('family-role', 'family', 'curious', ['「家族の中ではどんな役？」', '「家でいつも任されてること、ある？」'], factAnswers(
    ({ privateLife }) => `家では、${privateLife.familyRole}。頼られると、つい先回りしてしまう。`,
    ({ privateLife }) => `${privateLife.familyRole}よ。学校での役とは少し違うけど、これも自分らしいと思う。`,
  )),
  question('family-conversation', 'family', 'empathy', ['「家族には学校のことを話す？」', '「夕食ではどんな話をしてる？」'], factAnswers(
    ({ privateLife }) => `${privateLife.dinnerTime}。全部は話さなくても、一つだけ持ち帰るようにしてる。`,
    ({ privateLife }) => `食卓では、${privateLife.dinnerTime}。相手の一日を聞く時間も大事にしてるよ。`,
  )),
  question('family-rule', 'family', 'action', ['「家だけの決まりってある？」', '「家族みんなで守ってる習慣は？」'], factAnswers(
    ({ privateLife }) => `${privateLife.familyScene}。厳しい決まりというより、一緒に過ごすための合図かな。`,
    ({ privateLife }) => `家で続いている役は「${privateLife.familyRole}」。誰か一人へ任せきりにしないようにしてる。`,
  )),
  question('family-keepsake', 'family', 'curious', ['「家族にまだ見せてない宝物、ある？」', '「家で大切にしまってる物は？」'], factAnswers(
    ({ privateLife }) => `${privateLife.privateTreasure}。見せるのが嫌というより、話すならゆっくり説明したい。`,
    ({ privateLife }) => `大切なのは、${privateLife.privateTreasure}。見ると、その頃の自分へ戻れる気がする。`,
  )),

  question('room-look', 'room', 'curious', ['「自分の部屋、もっと詳しく教えて？」', '「部屋を開けたら最初に何が見える？」'], factAnswers(
    ({ privateLife }) => `${privateLife.roomScene}。片づいている場所と、今使っている場所がすぐ分かるよ。`,
    ({ privateLife }) => `扉を開けると、${privateLife.roomScene}。たぶん学校より性格が出てる。`,
  )),
  question('room-treasure', 'room', 'curious', ['「部屋でいちばん大切な物は？」', '「なくしたら本気で困る物って何？」'], factAnswers(
    ({ privateLife }) => `値段では決められない物がある。${privateLife.privateTreasure}。今も大切にしてるよ。`,
    ({ privateLife }) => `なくしたくない物の話なら、${privateLife.privateTreasure}。同じ物を買っても埋まらないと思う。`,
  )),
  question('room-mess', 'room', 'playful', ['「部屋で散らかりやすい場所は？」', '「急に部屋を見られても平気？」'], factAnswers(
    ({ privateLife }) => `${privateLife.roomScene}から、使っている途中の場所だけは見られると少し困る。`,
    ({ privateLife }) => `急なら五分ほしいな。家事にも自分なりの癖があって、${privateLife.choreStyle}。`,
  )),
  question('room-sound', 'room', 'curious', ['「部屋では音楽かける？ 静かな方が好き？」', '「一人の部屋では、どんな音がしてる？」'], factAnswers(
    ({ facts }) => `一人のときは${facts.hobby}。その日の集中具合で、小さな音を流すか静かにするか決める。`,
    ({ privateLife }) => `${privateLife.bedtimeStyle}。夜は昼より小さな音だけを残すようにしてる。`,
  )),
  question('room-visitor', 'room', 'playful', ['「友だちを部屋へ呼ぶなら、最初に何を隠す？」', '「私が遊びに行ったら、どこへ座ればいい？」'], factAnswers(
    ({ privateLife }) => `${privateLife.roomScene}から、まず作業中の物だけ安全な場所へ移す。座る場所はちゃんと空けるよ。`,
    ({ privateLife }) => `大切な物も隠さないよ。${privateLife.privateTreasure}。触る前に一声かけてくれたらうれしい。`,
  )),

  question('chore-best', 'chores', 'curious', ['「いちばん得意な家事は？」', '「家の手伝いで任せてって言えるものは？」'], factAnswers(
    ({ privateLife }) => `${privateLife.choreStyle}。その中でも、迷わず手が動く方なら任せて。`,
    ({ privateLife }) => `家事では、${privateLife.choreStyle}。得意な所から引き受けるようにしてる。`,
  )),
  question('chore-weak', 'chores', 'playful', ['「逆に、苦手な家事はある？」', '「つい後回しにする家事って何？」'], factAnswers(
    ({ privateLife }) => `${privateLife.choreStyle}。苦手な方は、始める時刻を決めないと後回しになりやすい。`,
    ({ privateLife }) => `実は、${privateLife.choreStyle}。得意な家事と交換してもらえるなら相談したいな。`,
  )),
  question('chore-cooking', 'chores', 'playful', ['「家で料理するなら何を作る？」', '「得意料理、一つ食べさせて？」'], factAnswers(
    ({ privateLife }) => `${privateLife.homeCooking}。味だけでなく、作っている時間にも自分の癖が出るよ。`,
    ({ privateLife }) => `作るなら、${privateLife.homeCooking}。次は一人分多く用意しておく。`,
  )),
  question('chore-routine', 'chores', 'action', ['「家事はいつまとめてやる？」', '「部屋の片づけを続けるコツは？」'], factAnswers(
    ({ privateLife }) => `${privateLife.bedtimeStyle}から、一日の終わりに小さく片づけることが多い。全部は一度にやらない。`,
    ({ privateLife }) => `${privateLife.choreStyle}。得意な作業を最初にすると、その流れで残りへ手をつけやすい。`,
  )),
  question('chore-together', 'chores', 'action', ['「一緒に家事するなら何を任せて？」', '「二人で片づけるなら、どう分担する？」'], factAnswers(
    ({ privateLife }) => `${privateLife.choreStyle}から、私は得意な方を受け持つよ。君には途中で止まりやすい方を手伝ってほしい。`,
    ({ privateLife }) => `${privateLife.homeCooking}。料理なら私が中心を進めるから、隣で道具を戻してくれるとうれしい。`,
  )),

  question('appearance-morning', 'appearance', 'curious', ['「朝の身支度、どんな順番？」', '「起きてから制服になるまで何してる？」'], factAnswers(
    ({ privateLife }) => `${privateLife.morningStyle}。順番を決めておくと、眠い朝でも迷わない。`,
    ({ privateLife }) => `朝は、${privateLife.morningStyle}。最後に鞄を見て家を出るよ。`,
  )),
  question('appearance-hair', 'appearance', 'curious', ['「髪型は毎朝どうやって決める？」', '「寝癖がひどい朝はどうする？」'], factAnswers(
    ({ privateLife }) => `${privateLife.morningStyle}。髪が決まらない日も、最低限だけ整えて急ぎすぎない。`,
    ({ privateLife }) => `寝癖の日も朝の順番は同じ。休日の服ほどは迷わないよ。休みの日は、${privateLife.offDutyStyle}。`,
  )),
  question('appearance-off-duty', 'appearance', 'playful', ['「学校じゃない日の服、どんな感じ？」', '「完全に気を抜いた日の格好は？」'], factAnswers(
    ({ privateLife }) => `学校の外では、${privateLife.offDutyStyle}。楽なだけでなく、好きなことをしやすい服を選ぶ。`,
    ({ privateLife }) => `${privateLife.offDutyStyle}よ。知り合いに気づかれなくても、その方が落ち着く日もある。`,
  )),
  question('appearance-bag', 'appearance', 'action', ['「鞄は前の日に準備する？」', '「忘れ物を防ぐ自分ルール、ある？」'], factAnswers(
    ({ privateLife, facts }) => `${privateLife.bedtimeStyle}。その流れで${facts.afterSchool}日に必要な物も一つずつ確かめる。`,
    ({ privateLife }) => `${privateLife.morningStyle}。朝にも確認するけど、迷う物は前夜に玄関へ置くよ。`,
  )),
  question('appearance-secret', 'appearance', 'playful', ['「その格好を学校で見られたら恥ずかしい？」', '「私服を見られるの、ちょっと照れる？」'], factAnswers(
    ({ privateLife }) => `${privateLife.offDutyStyle}から、最初は少し照れる。でも笑わず似合うと言ってくれたらうれしい。`,
    ({ privateLife }) => `見られて困るわけじゃないよ。休日は、${privateLife.offDutyStyle}。そんな自分でも普通に話せる。`,
  )),

  question('shopping-route', 'shopping', 'curious', ['「休日の買い物コースは？」', '「買い物へ行くと必ず寄る店はある？」'], factAnswers(
    ({ privateLife }) => `${privateLife.shoppingStyle}。目的の物がなくても、この順番で歩くと休日らしくなる。`,
    ({ privateLife }) => `よく行く日は、${privateLife.shoppingStyle}。最後に買った物を鞄の中で確かめる。`,
  )),
  question('shopping-choice', 'shopping', 'curious', ['「買う物はすぐ決める？ かなり迷う？」', '「買い物でいちばん見るポイントは？」'], factAnswers(
    ({ privateLife }) => `${privateLife.allowanceStyle}から、使い道と残りを考えてから決める方だよ。`,
    ({ privateLife }) => `${privateLife.shoppingStyle}。見た目だけでなく、家でどう使うか浮かぶ物を選ぶ。`,
  )),
  question('shopping-saving-goal', 'shopping', 'action', ['「今、何を買うために貯めてる？」', '「次に欲しい大きな物は？」'], factAnswers(
    ({ privateLife }) => `${privateLife.savingGoal}。まだ先でも、近づいているのが分かると楽しい。`,
    ({ privateLife }) => `今は、${privateLife.savingGoal}。買う前に本当に使う場面も考えてる。`,
  )),
  question('shopping-impulse', 'shopping', 'playful', ['「つい予定外で買っちゃう物は？」', '「衝動買いしたこと、ある？」'], factAnswers(
    ({ privateLife }) => `${privateLife.shoppingStyle}から、そこで見つけた小さな物には弱い。大きな物はその日に決めないよ。`,
    ({ privateLife }) => `あるよ。でも${privateLife.allowanceStyle}から、使っていい範囲を越えたら棚へ戻す。`,
  )),
  question('shopping-together', 'shopping', 'playful', ['「一緒に買い物するなら、どこへ連れていく？」', '「私の買い物にも付き合ってくれる？」'], factAnswers(
    ({ privateLife }) => `${privateLife.shoppingStyle}。まず自分の好きな店を一つ案内して、次は君の行きたい店へ行こう。`,
    ({ privateLife }) => `もちろん。私は${privateLife.giftStyle}から、人に合う物を探す時間もけっこう好きなんだ。`,
  )),

  question('digital-wallpaper', 'digital-life', 'curious', ['「スマホの待受、何にしてる？」', '「ホーム画面って性格出るよね？」'], factAnswers(
    ({ privateLife }) => `${privateLife.phoneStyle}。毎日見る場所だから、情報を増やしすぎないようにしてる。`,
    ({ privateLife }) => `私の画面はこんな感じ。${privateLife.phoneStyle}。学校での印象と違うって言われるかも。`,
  )),
  question('digital-notifications', 'digital-life', 'action', ['「通知って全部すぐ見る？」', '「スマホに集中を邪魔されない工夫ある？」'], factAnswers(
    ({ privateLife }) => `${privateLife.phoneStyle}。見る時刻や例外を決めると、鳴るたびに追いかけなくて済む。`,
    ({ privateLife }) => `通知との付き合い方は決めてる。${privateLife.phoneStyle}。大事な人の連絡だけは見落とさない。`,
  )),
  question('digital-photos', 'digital-life', 'curious', ['「写真フォルダには何が多い？」', '「つい撮ってしまうものは？」'], factAnswers(
    ({ privateLife }) => `${privateLife.photoStyle}。あとで見返すと、その日の空気まで少し思い出せる。`,
    ({ privateLife }) => `フォルダに多い物を言うなら、${privateLife.photoStyle}。自分が気づいた瞬間を残したい。`,
  )),
  question('digital-reply', 'digital-life', 'empathy', ['「返信を考えすぎること、ある？」', '「既読のあと、何分くらい悩む？」'], factAnswers(
    ({ privateLife, facts }) => `普段の返し方は「${facts.phone}」。${privateLife.phoneStyle}。遅いときも、雑に返したくないだけなんだ。`,
    ({ privateLife }) => `内容によっては考えるよ。${privateLife.phoneStyle}から、自分の区切りで落ち着いて返す。`,
  )),
  question('digital-offline', 'digital-life', 'action', ['「スマホを見ない時間、作ってる？」', '「一日だけ圏外なら何して過ごす？」'], factAnswers(
    ({ privateLife, facts }) => `${privateLife.resetStyle}。端末から離れた方が、${facts.hobby}に集中できる日もある。`,
    ({ privateLife }) => `圏外なら、${privateLife.neighborhoodSpot}。画面へ残さず、自分の目だけで覚えてみたい。`,
  )),

  question('evening-dinner', 'evening', 'curious', ['「家の夕食はみんな一緒？」', '「晩ごはんのとき、何を話す？」'], factAnswers(
    ({ privateLife }) => `${privateLife.dinnerTime}。毎日全員そろわなくても、会えた日は少し話す。`,
    ({ privateLife }) => `夕食では、${privateLife.dinnerTime}。食べ終わるまで答えを急がない話もあるよ。`,
  )),
  question('evening-bath', 'evening', 'empathy', ['「お風呂のあとは何してる？」', '「夜にやっと落ち着くのは何時ごろ？」'], factAnswers(
    ({ privateLife }) => `お風呂のあとは、${privateLife.bedtimeStyle}。その流れへ入ると一日が終わる感じがする。`,
    ({ privateLife, facts }) => `${facts.sleep}へ近づく頃かな。${privateLife.bedtimeStyle}ようにして、気持ちを静かにする。`,
  )),
  question('evening-snack', 'evening', 'playful', ['「夜にこっそり食べる物、ある？」', '「寝る前にお腹が空いたらどうする？」'], factAnswers(
    ({ facts }) => `「${facts.snack}」には心が動くけど、まず${facts.drink}を少し飲む。夜は食べすぎないようにしてる。`,
    ({ privateLife, facts }) => `本当に空いていたら「${facts.snack}」を少しだけ。${privateLife.bedtimeStyle}前には食べ終えるよ。`,
  )),
  question('evening-bedtime', 'evening', 'curious', ['「寝る直前のルーティンは？」', '「一日の最後に必ずすることは？」'], factAnswers(
    ({ privateLife }) => `${privateLife.bedtimeStyle}。同じ順番にすると、考えごとを明日へ置いていける。`,
    ({ privateLife }) => `最後は、${privateLife.bedtimeStyle}。全部できない日も一つだけは守る。`,
  )),
  question('evening-insomnia', 'evening', 'empathy', ['「眠れない夜はどうする？」', '「考えごとで眠れないとき、起きてる？」'], factAnswers(
    ({ privateLife }) => `${privateLife.resetStyle}。長く続けず、一度だけ気持ちを切り替えてから布団へ戻る。`,
    ({ privateLife }) => `眠れないときも、${privateLife.bedtimeStyle}。明るい画面を開かず、続きを明日へ残すよ。`,
  )),

  question('neighborhood-favorite', 'neighborhood', 'curious', ['「近所でいちばん好きな場所は？」', '「家の近くで一人になれる場所、ある？」'], factAnswers(
    ({ privateLife }) => `${privateLife.neighborhoodSpot}。遠くへ行かなくても、自分の気分へ戻れる場所なんだ。`,
    ({ privateLife }) => `好きな場所の話なら、${privateLife.neighborhoodSpot}。時間帯で表情が変わるのも面白い。`,
  )),
  question('neighborhood-people', 'neighborhood', 'curious', ['「近所の人に顔を覚えられてる？」', '「よく話す近所の人っている？」'], factAnswers(
    ({ privateLife }) => `${privateLife.neighborTie}。学校とは別の名前や役目で覚えてもらえるのがうれしい。`,
    ({ privateLife }) => `いるよ。${privateLife.neighborTie}。短い会話でも町に帰ってきた感じがする。`,
  )),
  question('neighborhood-detour', 'neighborhood', 'playful', ['「帰り道でつい寄り道する場所は？」', '「まっすぐ帰らない日はどこへ行く？」'], factAnswers(
    ({ privateLife }) => `寄り道したくなる場所がある。${privateLife.neighborhoodSpot}。十分だけのつもりでも少し長くなる。`,
    ({ privateLife }) => `寄り道なら、${privateLife.shoppingStyle}こともある。買わずに眺めるだけの日も好き。`,
  )),
  question('neighborhood-help', 'neighborhood', 'action', ['「町内の手伝いなら何ができそう？」', '「近所で困ってる人がいたら声をかける？」'], factAnswers(
    ({ privateLife }) => `家では「${privateLife.familyRole}」。その経験を使える役なら引き受ける。まず困りごとを聞くよ。`,
    ({ privateLife }) => `声はかけるよ。${privateLife.neighborTie}から、普段助けてもらっている分も少し返したい。`,
  )),
  question('neighborhood-guide', 'neighborhood', 'playful', ['「近所を案内してくれる？」', '「半日だけ町を歩くなら、どこへ連れていく？」'], factAnswers(
    ({ privateLife }) => `最初に見せたいのはこの場所。${privateLife.neighborhoodSpot}。そのあと、${privateLife.shoppingStyle}。急がず歩こう。`,
    ({ privateLife }) => `${privateLife.neighborTie}から、挨拶できる場所も通りたい。最後は座って話せる所へ行こう。`,
  )),

  question('money-allowance', 'money', 'curious', ['「お小遣い、どうやって管理してる？」', '「使ったお金は記録する方？」'], factAnswers(
    ({ privateLife }) => `${privateLife.allowanceStyle}。細かく管理することより、次に困らない形を守ってる。`,
    ({ privateLife }) => `私は、${privateLife.allowanceStyle}。使った理由まで覚えていれば後悔が減るよ。`,
  )),
  question('money-saving', 'money', 'action', ['「貯金を続けるコツは？」', '「欲しい物のために我慢できる？」'], factAnswers(
    ({ privateLife }) => `目標があるんだ。${privateLife.savingGoal}。だから先に小さく取り分けて、残りを使うようにしてる。`,
    ({ privateLife }) => `今は、${privateLife.savingGoal}。我慢だけにせず、近づいた額が見えるようにする。`,
  )),
  question('money-weakness', 'money', 'playful', ['「財布のひもが緩むのはどんなとき？」', '「これだけは節約できないって物、ある？」'], factAnswers(
    ({ privateLife }) => `${privateLife.shoppingStyle}から、自分の好きな分野の小さな新発見には弱い。`,
    ({ privateLife }) => `${privateLife.allowanceStyle}けど、${privateLife.giftStyle}ときは少し予算を広げてしまう。`,
  )),
  question('money-day-budget', 'money', 'action', ['「千円だけで休日を過ごすなら？」', '「お金をあまり使わない遊び、考えて？」'], factAnswers(
    ({ privateLife }) => `まず近所を歩く。${privateLife.neighborhoodSpot}。買うのは飲み物だけで、残りは貯金へ回すよ。`,
    ({ privateLife, facts }) => `${facts.hobby}なら大きなお金はいらないよ。${privateLife.allowanceStyle}から、今日は自由分だけ使う。`,
  )),
  question('money-gift', 'money', 'playful', ['「友だちへの贈り物、どう選ぶ？」', '「誕生日プレゼントは実用派？ 驚かせたい派？」'], factAnswers(
    ({ privateLife }) => `${privateLife.giftStyle}。値段より、その人を見て選んだと伝わる物にしたい。`,
    ({ privateLife }) => `私は、${privateLife.giftStyle}。驚きは小さくても、長く覚えてもらえる方がうれしい。`,
  )),

  question('self-care-sick', 'self-care', 'empathy', ['「風邪をひいた日はどう過ごす？」', '「体調が悪いとき、ちゃんと休める？」'], factAnswers(
    ({ privateLife }) => `${privateLife.sickDay}。休むのも予定の一つだと思うようにしてる。`,
    ({ privateLife }) => `体調を崩したら、${privateLife.sickDay}。元気な日の基準で動かないことが大切だね。`,
  )),
  question('self-care-sign', 'self-care', 'curious', ['「休んだ方がいい自分のサインは？」', '「疲れすぎる前に気づける？」'], factAnswers(
    ({ privateLife, facts }) => `${facts.hobby}まで楽しくなくなったら止まる。実際に休む日はこうする。${privateLife.sickDay}。回復を先にする。`,
    ({ privateLife }) => `いつもの順番が急に面倒になったら合図。${privateLife.resetStyle}時間を短くても作るよ。`,
  )),
  question('self-care-bad-mood', 'self-care', 'empathy', ['「機嫌が悪い日は、一人になりたい？」', '「落ち込んでるとき、そっとしてほしい？」'], factAnswers(
    ({ privateLife }) => `最初は少し一人で、${privateLife.resetStyle}。落ち着いたら短く声をかけてもらえるとうれしい。`,
    ({ privateLife }) => `${privateLife.resetStyle}から、すぐ答えを求められなければ誰かが近くにいても平気だよ。`,
  )),
  question('self-care-reset', 'self-care', 'action', ['「気持ちを切り替える自分だけの方法は？」', '「嫌な一日の終わらせ方を教えて？」'], factAnswers(
    ({ privateLife }) => `${privateLife.resetStyle}。失敗を消すんじゃなく、今日の終わりを自分で決めるんだ。`,
    ({ privateLife }) => `私は、${privateLife.resetStyle}。終わったら明日やることを一つだけ残して休む。`,
  )),
  question('self-care-help', 'self-care', 'empathy', ['「つらいとき、どう助けてほしい？」', '「体調が悪そうなら、何をしてあげればいい？」'], factAnswers(
    ({ privateLife }) => `${privateLife.sickDay}から、まず静かに休めるようにしてほしい。必要な物は自分から一つずつ言うよ。`,
    ({ privateLife }) => `${privateLife.resetStyle}時間を急かさず待ってくれたら助かる。そのあと温かい物を一緒に飲みたい。`,
  )),
]

const QUESTION_BY_ID = new Map(CHARACTER_DAILY_QUESTIONS.map((item) => [item.id, item]))

function dailyCyclePick(list, turn, ...parts) {
  const start = characterTalkHash(parts.join('|')) % list.length
  return list[(start + turn) % list.length]
}

export function characterDailyQuestionById(id) {
  return QUESTION_BY_ID.get(id) ?? CHARACTER_DAILY_QUESTIONS[0]
}

export function characterDailyQuestionSuggestions({
  categoryId = 'school',
  speakerId,
  seed = 0,
  turn = 0,
  count = 4,
}) {
  const matching = CHARACTER_DAILY_QUESTIONS.filter((item) => item.categoryId === categoryId)
  const pool = matching.length > 0 ? matching : CHARACTER_DAILY_QUESTIONS
  const start = characterTalkHash(`${speakerId}|${categoryId}|${seed}|${turn}`) % pool.length
  return Array.from({ length: Math.min(count, pool.length) }, (_, offset) => {
    const item = pool[(start + offset) % pool.length]
    return {
      ...item,
      text: dailyCyclePick(item.phrases, turn, 'daily-question', speakerId, seed, item.id),
    }
  })
}

const DAILY_EMOTIONS = {
  empathy: ['gentle', 'relieved'],
  curious: ['curious', 'thinking'],
  playful: ['playful', 'delighted'],
  action: ['focused', 'determined'],
}

export function createCharacterDailyExchange({
  playerId,
  speakerId,
  companionId,
  questionId,
  seed = 0,
  turn = 0,
  now = new Date(),
}) {
  const { player, speaker, companion } = resolveCharacterTalkCast({
    playerId,
    speakerId,
    companionId,
    seed: `${seed}|daily|${turn}`,
  })
  const questionItem = characterDailyQuestionById(questionId)
  const facts = CHARACTER_DAILY_FACTS[speaker.id] ?? CHARACTER_DAILY_FACTS.mio
  const privateLife = CHARACTER_PRIVATE_LIFE[speaker.id] ?? CHARACTER_PRIVATE_LIFE.mio
  const learning = CHARACTER_LEARNING_ADVICE[speaker.id] ?? CHARACTER_LEARNING_ADVICE.mio
  const persona = characterTalkPersonaById(speaker.id)
  const companionPersona = characterTalkPersonaById(companion.id)
  const schedule = nextCharacterSchoolTest(now)
  const questionText = dailyCyclePick(
    questionItem.phrases,
    turn,
    'daily-question', speaker.id, seed, questionItem.id,
  )
  const answers = questionItem.answer({ facts, privateLife, learning, persona, student: speaker, schedule })
  const answer = dailyCyclePick(
    answers,
    turn,
    'daily-answer', speaker.id, companion.id, questionItem.id, seed,
  )
  const companionReaction = dailyCyclePick(
    companionPersona.reactions[questionItem.intentId],
    turn,
    'daily-reaction', speaker.id, companion.id, questionItem.intentId, seed,
  )
  const companionTopicId = CHARACTER_DAILY_COMPANION_TOPICS[questionItem.categoryId] ?? 'today'
  const companionReply = `${companionReaction} ${companionPersona.topics[companionTopicId]}`
  return {
    player,
    speaker,
    companion,
    question: { ...questionItem, text: questionText },
    messages: [
      {
        id: `daily-user-${seed}-${turn}-${questionItem.id}`,
        role: 'user',
        studentId: player.id,
        emotionId: dailyCyclePick(DAILY_EMOTIONS[questionItem.intentId], turn, 'daily-player-emotion', player.id, seed),
        text: questionText,
      },
      {
        id: `daily-answer-${seed}-${turn}-${speaker.id}`,
        role: 'character',
        studentId: speaker.id,
        emotionId: dailyCyclePick(DAILY_EMOTIONS[questionItem.intentId], turn, 'daily-emotion', speaker.id, seed),
        text: answer,
      },
      {
        id: `daily-reaction-${seed}-${turn}-${companion.id}`,
        role: 'character',
        studentId: companion.id,
        emotionId: dailyCyclePick(DAILY_EMOTIONS[questionItem.intentId], turn, 'daily-companion-emotion', companion.id, seed),
        text: companionReply,
      },
    ],
  }
}

export function characterDailyPatternCount() {
  let total = 0
  for (const questionItem of CHARACTER_DAILY_QUESTIONS) {
    for (const speaker of BATTLE_STUDENTS) {
      const facts = CHARACTER_DAILY_FACTS[speaker.id]
      const privateLife = CHARACTER_PRIVATE_LIFE[speaker.id]
      const learning = CHARACTER_LEARNING_ADVICE[speaker.id]
      const persona = CHARACTER_TALK_PERSONAS[speaker.id]
      const answerCount = questionItem.answer({
        facts,
        privateLife,
        learning,
        persona,
        student: speaker,
        schedule: nextCharacterSchoolTest(new Date(2026, 7, 1)),
      }).length
      for (const companion of BATTLE_STUDENTS) {
        if (companion.id === speaker.id) continue
        const playerCount = BATTLE_STUDENTS.filter(
          (player) => player.id !== speaker.id && player.id !== companion.id,
        ).length
        total += playerCount
          * questionItem.phrases.length
          * answerCount
          * CHARACTER_TALK_PERSONAS[companion.id].reactions[questionItem.intentId].length
      }
    }
  }
  return total
}

export const CHARACTER_DAILY_PATTERN_COUNT = characterDailyPatternCount()
