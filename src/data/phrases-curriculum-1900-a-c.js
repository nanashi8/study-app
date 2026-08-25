import { parseCurriculum1900PhraseRows } from './curriculum-phrase-utils.js'

// 出典順ではなく、正規形の英字順。
const ROWS = String.raw`
a ~ amount of	4	ある量の	A small amount of salt is enough.	少量の塩で十分です。	structure
A as well as B	pre2	BだけでなくAも	Maya as well as Ken joined the team.	ケンだけでなくマヤもチームに加わった。	structure
a case in point	pre1	その好例	This village is a case in point.	この村がその好例だ。	idiom
a couple of	3	2、3の・数個の	I need a couple of minutes.	2、3分必要です。	collocation
a handful of	pre1	一握りの・少数の	Only a handful of seats remain.	席はほんのわずかしか残っていない。	idiom
a host of	pre1	多数の	The plan created a host of problems.	その計画は多くの問題を生んだ。	idiom
A is one thing; B is another	pre1	AとBは別問題だ	Knowing the rule is one thing; using it is another.	規則を知ることと使えることは別問題だ。	structure
A is to B what C is to D	pre1	AのBに対する関係はCのDに対する関係と同じだ	Reading is to the mind what exercise is to the body.	読書の心に対する関係は運動の体に対する関係と同じだ。	structure
a lot	4	とても・たくさん	We learned a lot today.	私たちは今日たくさん学んだ。	collocation
a white elephant	pre1	持て余す高価な物	The empty stadium became a white elephant.	その空の競技場は金食い虫になった。	idiom
abound in	pre2	〜が豊富にある	These woods abound in wildlife.	この森には野生動物が豊富にいる。	preposition
adjust A to B	pre2	AをBに合わせる	Adjust the seat to your height.	座席を自分の身長に合わせなさい。	structure
admit to	2	〜を認める	He admitted to making the mistake.	彼はその誤りを犯したと認めた。	preposition
after a while	4	しばらくして	After a while, the rain stopped.	しばらくして雨がやんだ。	discourse
agree to	pre2	〜に同意する	They agreed to the new terms.	彼らは新しい条件に同意した。	preposition
ahead of	pre2	〜より前に・〜の先に	We arrived ahead of schedule.	私たちは予定より早く着いた。	preposition
all manner of	1	あらゆる種類の	The shop sells all manner of tools.	その店はあらゆる種類の道具を売っている。	collocation
all of a sudden	pre2	突然	All of a sudden, the lights went out.	突然、明かりが消えた。	discourse
all on one's own	1	まったく一人で	She built the website all on her own.	彼女はまったく一人でそのサイトを作った。	idiom
All one has to do is (to) do	2	〜しさえすればよい	All you have to do is press this button.	このボタンを押しさえすればよい。	structure
all over the world	3	世界中で	The song is known all over the world.	その歌は世界中で知られている。	preposition
All right.	4	わかりました・大丈夫です	All right. I'll help you.	わかりました。手伝います。	conversation
all the same	pre2	それでも・まったく同じ	It was difficult, but I tried all the same.	難しかったが、それでも私は挑戦した。	discourse
all the way	pre2	はるばる・ずっと	We walked all the way home.	私たちは家までずっと歩いた。	idiom
all the 比較級	pre1	それだけいっそう〜	I like her all the better for her honesty.	正直なので私は彼女がいっそう好きだ。	structure
all too	pre1	あまりにも	The risk is all too real.	その危険はあまりにも現実的だ。	idiom
along with	2	〜と一緒に・〜に加えて	The guide came along with two students.	案内役は2人の生徒と一緒に来た。	preposition
and ~ at that	pre2	しかも〜で	The task was hard, and urgent at that.	その仕事は難しく、しかも緊急だった。	discourse
and so on	pre2	〜など	We bought paper, pens, folders, and so on.	私たちは紙、ペン、フォルダーなどを買った。	discourse
and yet	pre2	それなのに	The path was steep, and yet nobody complained.	道は険しかった。それなのに誰も不平を言わなかった。	discourse
apply to	pre2	〜に当てはまる・〜に申し込む	This rule applies to every member.	この規則は全会員に当てはまる。	preposition
around the corner	2	すぐ近くに・間近に	Spring is just around the corner.	春はもうすぐそこだ。	idiom
as ~ as any	2	どれにも劣らず〜	This route is as safe as any.	この道はどの道にも劣らず安全だ。	structure
as ~ go	2	〜としては	As laptops go, this one is light.	ノートパソコンとしては、これは軽い。	structure
as a matter of course	pre2	当然のこととして	We checked the brakes as a matter of course.	私たちは当然のこととしてブレーキを点検した。	idiom
as a result of	3	〜の結果として	The game was canceled as a result of the storm.	嵐のため試合は中止になった。	preposition
as a rule	pre2	概して・原則として	As a rule, this library closes at six.	原則として、この図書館は6時に閉まる。	discourse
as far as ~ be concerned	2	〜に関する限り	As far as safety is concerned, the plan is sound.	安全に関する限り、その計画は妥当だ。	structure
as good as	2	ほとんど〜も同然で	The old machine is as good as useless.	その古い機械は役に立たないも同然だ。	idiom
as if	pre2	まるで〜のように	He talks as if he knew everything.	彼はまるですべて知っているかのように話す。	structure
as is often the case with	2	〜にはよくあることだが	As is often the case with beginners, I rushed.	初心者にはよくあることだが、私は焦った。	structure
as it is	2	実際のところ・現状のままで	Leave the design as it is.	そのデザインを今のままにしておきなさい。	idiom
as it were	2	いわば	The brain is, as it were, a control center.	脳はいわば制御センターだ。	discourse
as many as	2	〜もの多数	As many as eighty people attended.	80人もの人が出席した。	structure
as of	pre1	〜現在で・〜以降	As of Monday, the rule will change.	月曜日以降、その規則は変わる。	preposition
as such	pre1	そういうものとして・それ自体では	The room is not a lab as such.	その部屋は厳密には研究室ではない。	idiom
aside from	pre2	〜は別として・〜に加えて	Aside from one typo, the report is clear.	誤字が一つある点を除けば、報告書は明快だ。	preposition
ask ~ a favor	pre2	〜に頼み事をする	May I ask you a favor?	あなたにお願いをしてもいいですか。	collocation
assure A of B	2	AにBを保証する	I assured her of our support.	私は彼女に私たちの支援を保証した。	structure
at ~'s convenience	pre1	〜の都合のよい時に	Reply at your convenience.	ご都合のよい時に返信してください。	preposition
at ~'s disposal	1	〜が自由に使える	You have several tools at your disposal.	自由に使える道具がいくつかある。	preposition
at a distance	pre2	少し離れて	Please keep the animals at a distance.	動物から距離を置いてください。	preposition
at a time	pre2	一度に	Take one tablet at a time.	一度に1錠飲みなさい。	preposition
at all	pre2	少しでも・いったい	I don't understand it at all.	私はそれがまったく分からない。	idiom
at ease	2	くつろいで	Her smile put us at ease.	彼女の笑顔で私たちは安心した。	idiom
at first hand	pre1	直接に	I heard the story at first hand.	私はその話を直接聞いた。	idiom
at heart	2	本質的には・心の底では	He is a teacher at heart.	彼は根っからの教師だ。	idiom
at intervals	2	時々・間隔を置いて	Bells rang at intervals.	鐘が間隔を置いて鳴った。	preposition
at issue	1	問題となっている	The policy at issue affects every school.	問題となっている政策は全校に影響する。	idiom
at large	2	全体として・逃走中で	The suspect is still at large.	容疑者はまだ逃走中だ。	idiom
at short notice	pre1	急な知らせで	Thank you for coming at short notice.	急なお願いなのに来てくれてありがとう。	idiom
at that time	4	その時	I lived in Osaka at that time.	私はその時大阪に住んでいた。	preposition
at the mercy of	2	〜のなすがままで	The boat was at the mercy of the waves.	その船は波のなすがまだった。	idiom
at the moment	2	今のところ・今	She is busy at the moment.	彼女は今忙しい。	preposition
at the sight of	2	〜を見て	The child smiled at the sight of the puppy.	その子は子犬を見て笑顔になった。	preposition
at the wheel	pre2	運転して	Do not use a phone at the wheel.	運転中に電話を使ってはいけない。	idiom
at will	2	自由に・思いのままに	Users can change the font at will.	利用者は自由に字体を変えられる。	idiom
at work	2	仕事中で・作用して	Several forces are at work here.	ここではいくつかの力が作用している。	idiom
attach A to B	2	AをBに取り付ける	Attach the label to the box.	ラベルを箱に付けなさい。	structure
attend to	pre1	〜に対処する・世話をする	A nurse attended to the injured runner.	看護師が負傷した走者を手当てした。	preposition
back and forth	2	行ったり来たり	The pendulum moved back and forth.	振り子が前後に動いた。	idiom
be about to do	pre2	まさに〜しようとしている	The train is about to leave.	列車はまさに出発しようとしている。	structure
be abundant in	2	〜が豊富である	The region is abundant in clean water.	その地域はきれいな水が豊富だ。	preposition
be accustomed to	2	〜に慣れている	I am accustomed to working early.	私は早く働くことに慣れている。	preposition	to は前置詞なので、後ろには名詞または動名詞を置く。
be acquainted with	2	〜を知っている・〜と面識がある	She is acquainted with the local history.	彼女は地元の歴史をよく知っている。	preposition
be all ears	pre1	ぜひ聞きたい・熱心に耳を傾けている	Tell me your idea; I'm all ears.	君の案を話して。ぜひ聞きたい。	idiom
be all the rage	pre1	大流行している	Reusable bottles are all the rage now.	今は再利用ボトルが大流行している。	idiom
be anxious to do	2	ぜひ〜したい	We are anxious to hear the result.	私たちはぜひ結果を聞きたい。	structure
be apt to do	2	〜しがちである	People are apt to forget small details.	人は細部を忘れがちだ。	structure
be beside oneself with	pre1	〜で我を忘れている	He was beside himself with joy.	彼は喜びで我を忘れていた。	idiom
be born	4	生まれる	My sister was born in May.	妹は5月に生まれた。	collocation
be bound to do	2	きっと〜する	Careful practice is bound to help.	丁寧な練習はきっと役に立つ。	structure
be busy with	2	〜で忙しい	She is busy with her science project.	彼女は科学の課題で忙しい。	preposition
be careful with	3	〜の扱いに注意する	Be careful with that glass.	そのグラスの扱いに気を付けて。	preposition
be considerate of	2	〜に思いやりがある	Please be considerate of other passengers.	ほかの乗客に配慮してください。	preposition
be content with	2	〜に満足している	He is content with the simple plan.	彼はその簡単な計画に満足している。	preposition
be convinced of	2	〜を確信している	I am convinced of her honesty.	私は彼女が正直だと確信している。	preposition
be curious about	pre2	〜に好奇心がある	The students are curious about space.	生徒たちは宇宙に好奇心を持っている。	preposition
be cut out to be	pre1	〜に向いている	She is cut out to be a leader.	彼女は指導者に向いている。	idiom
be dedicated to	pre1	〜に打ち込んでいる	The team is dedicated to improving access.	そのチームは利用しやすさの改善に打ち込んでいる。	preposition
be due to	2	〜する予定である	The bus is due to arrive at noon.	バスは正午に到着する予定だ。	structure	原因の due to + 名詞とは区別する。
be eligible for	pre1	〜の資格がある	All members are eligible for the award.	全会員にその賞の資格がある。	preposition
be equal to	2	〜に等しい・〜に耐えられる	One meter is equal to one hundred centimeters.	1メートルは100センチメートルに等しい。	preposition
be equipped with	2	〜を備えている	The room is equipped with two screens.	その部屋には画面が2台備わっている。	preposition
be familiar to	4	〜によく知られている	That melody is familiar to many people.	その旋律は多くの人によく知られている。	preposition	人が物を知っている be familiar with と主語の関係が逆になる。
be fed up with	pre1	〜にうんざりしている	We are fed up with the constant noise.	私たちは絶え間ない騒音にうんざりしている。	idiom
be filled with	4	〜で満たされている	The hall was filled with music.	ホールは音楽で満たされていた。	preposition
be forced to do	2	〜せざるを得ない	We were forced to change the route.	私たちは経路を変えざるを得なかった。	structure
be free to do	2	自由に〜してよい	You are free to ask questions.	自由に質問してよい。	structure
be guilty of	2	〜の罪がある・〜をして悪い	He was found guilty of fraud.	彼は詐欺で有罪となった。	preposition
be here to stay	pre1	定着してなくならない	Online meetings are here to stay.	オンライン会議は定着してなくならないだろう。	idiom
be in trouble	4	困っている	Call me if you are in trouble.	困ったら私に電話して。	preposition
be indispensable to	2	〜に不可欠である	Water is indispensable to life.	水は生命に不可欠だ。	preposition
be lacking in	2	〜が不足している	The proposal is lacking in detail.	その提案は具体性に欠ける。	preposition
be married to	pre2	〜と結婚している	She is married to a doctor.	彼女は医師と結婚している。	preposition
be no match for	pre1	〜にはかなわない	Our small boat was no match for the storm.	私たちの小舟は嵐にはかなわなかった。	idiom
be out to do	pre1	〜しようと企んでいる	The group is out to change the rule.	その団体は規則を変えようとしている。	idiom
be particular about	2	〜に好みがうるさい	He is particular about coffee.	彼はコーヒーにこだわりがある。	preposition
be preferable to	2	〜より好ましい	Walking is preferable to waiting here.	ここで待つより歩く方がよい。	preposition
be ready to	4	〜する準備ができている	We are ready to begin.	私たちは始める準備ができている。	structure
be sensitive to	2	〜に敏感である	Some plants are sensitive to cold.	寒さに敏感な植物もある。	preposition
be sure of	pre2	〜を確信している	Are you sure of the answer?	その答えに確信がありますか。	preposition
be susceptible to	pre1	〜の影響を受けやすい	Young trees are susceptible to frost.	若木は霜の影響を受けやすい。	preposition
be tired from	pre2	〜で疲れている	I was tired from the long walk.	私は長い徒歩で疲れていた。	preposition
be to blame for	2	〜の責任がある	No single person is to blame for the delay.	その遅れを一人だけの責任にはできない。	idiom
be to do	2	〜することになっている	The president is to visit tomorrow.	大統領は明日訪問することになっている。	structure
be true of	pre2	〜に当てはまる	The same is true of this example.	同じことがこの例にも当てはまる。	preposition
be true to	pre2	〜に忠実である	Stay true to your principles.	自分の信念に忠実でいなさい。	preposition
be used to doing	2	〜することに慣れている	She is used to speaking in public.	彼女は人前で話すことに慣れている。	structure	used to do「以前は〜した」と区別し、to の後は動名詞にする。
be versed in	2	〜に精通している	He is versed in environmental law.	彼は環境法に精通している。	preposition
be wary of	2	〜を警戒している	Be wary of offers that seem too easy.	うますぎる話を警戒しなさい。	preposition
be well off	pre2	裕福である・恵まれている	Her family is fairly well off.	彼女の家族はかなり裕福だ。	idiom
be worth doing	pre1	〜する価値がある	This book is worth reading twice.	この本は二度読む価値がある。	structure	worth の後ろは動名詞を置く。
be worthy of	2	〜に値する	The idea is worthy of careful study.	その考えは慎重に研究する価値がある。	preposition
become of	2	〜はどうなる	What became of the old station?	古い駅はどうなりましたか。	preposition
before one knows it	pre2	いつの間にか	Before I knew it, the sun had set.	いつの間にか日が沈んでいた。	structure
behind the times	2	時代遅れで	That rule is behind the times.	その規則は時代遅れだ。	idiom
believe in	pre2	〜の存在・価値を信じる	I believe in giving everyone a chance.	私は全員に機会を与えることが大切だと信じている。	preposition
believe it or not	2	信じられないかもしれないが	Believe it or not, the turtle escaped.	信じられないかもしれないが、亀が逃げた。	discourse
between you and me	pre2	ここだけの話だが	Between you and me, I prefer the first plan.	ここだけの話、私は最初の案の方が好きだ。	idiom
beyond description	2	言葉では表せないほど	The view was beautiful beyond description.	その眺めは言葉で表せないほど美しかった。	idiom
boast of	2	〜を誇りにする・〜を有する	The city boasts of a long history.	その都市は長い歴史を誇る。	preposition
bother to do	2	わざわざ〜する	He didn't bother to reply.	彼は返事をしようともしなかった。	structure
bring oneself to do	pre2	〜する気になる	I could not bring myself to throw it away.	私はそれを捨てる気になれなかった。	structure
brush up	3	〜を磨き直す	I need to brush up my French.	私はフランス語を学び直す必要がある。	phrasal-verb
burn down	2	全焼する・焼き尽くす	The old barn burned down overnight.	古い納屋は一晩で全焼した。	phrasal-verb
burst into	2	突然〜し始める	The audience burst into laughter.	聴衆は突然笑い出した。	preposition
but for	pre1	〜がなければ	But for your help, we would have failed.	君の助けがなければ、私たちは失敗していただろう。	preposition
by any chance	pre2	ひょっとして	Do you, by any chance, know her name?	ひょっとして彼女の名前を知っていますか。	idiom
by degrees	pre2	徐々に	The sky grew brighter by degrees.	空は徐々に明るくなった。	idiom
by far	pre1	はるかに・断然	This is by far the safest route.	これは断然最も安全な道だ。	idiom
by hand	pre2	手で・手作業で	Each card was painted by hand.	各カードは手で描かれた。	preposition
by now	pre2	今ごろはもう	They should be home by now.	彼らは今ごろもう家にいるはずだ。	preposition
by the time	pre2	〜する時までには	By the time we arrived, the shop had closed.	私たちが着いた時には店は閉まっていた。	structure
by way of	2	〜を経由して・〜として	We flew to Rome by way of Paris.	私たちはパリ経由でローマへ飛んだ。	preposition
call it a day	pre2	その日の仕事を終える	We've done enough; let's call it a day.	十分やったので、今日は終わりにしよう。	idiom
Call me ~ .	4	私を〜と呼んでください	My name is Alexander, but call me Alex.	名前はアレクサンダーですが、アレックスと呼んでください。	conversation
calm down	3	落ち着く・落ち着かせる	Take a breath and calm down.	深呼吸して落ち着きなさい。	phrasal-verb
can afford to do	2	〜する余裕がある	We cannot afford to waste water.	私たちには水を無駄にする余裕はない。	structure
Can I ~ ?	4	〜してもいいですか	Can I open the window?	窓を開けてもいいですか。	conversation
Can you ~ ?	4	〜してくれますか	Can you show me the map?	地図を見せてくれますか。	conversation
cannot ~ too	2	いくら〜してもしすぎることはない	You cannot be too careful with fire.	火の扱いはいくら注意してもしすぎることはない。	structure
cannot help doing	2	〜せずにはいられない	I cannot help smiling at that photo.	その写真を見ると笑わずにはいられない。	structure
catch ~ doing	2	〜が…しているところを見つける	I caught him reading my notes.	私は彼が私のノートを読んでいるところを見つけた。	structure
catch sight of	2	〜を見つける	We caught sight of a whale offshore.	私たちは沖にクジラを見つけた。	idiom
catch up	pre1	追いつく	Run faster if you want to catch up.	追いつきたいならもっと速く走りなさい。	phrasal-verb
change hands	pre2	所有者が変わる	The building changed hands last year.	その建物は昨年所有者が変わった。	idiom
cheer up	2	元気を出す・元気づける	Cheer up; tomorrow is another day.	元気を出して。明日があるよ。	phrasal-verb
cling to	2	〜にしがみつく・固執する	The child clung to her mother's hand.	その子は母親の手にしがみついた。	preposition
close at hand	2	すぐ近くに	Keep a flashlight close at hand.	懐中電灯をすぐ手の届く所に置きなさい。	idiom
come by	pre2	〜を手に入れる・立ち寄る	Reliable data is hard to come by.	信頼できるデータは入手しにくい。	phrasal-verb
come close to doing	2	もう少しで〜するところである	The climber came close to falling.	その登山者はもう少しで落ちるところだった。	structure
come in handy	1	役に立つ	This small tool may come in handy.	この小さな道具が役に立つかもしれない。	idiom
come of age	1	成人する・成熟する	The young artist came of age in Tokyo.	その若い芸術家は東京で成長した。	idiom
come to	2	意識を取り戻す・合計〜になる	She came to a few minutes later.	彼女は数分後に意識を取り戻した。	phrasal-verb
come to an end	2	終わる	The long meeting came to an end.	長い会議が終わった。	idiom
come to light	1	明るみに出る	New evidence came to light yesterday.	新しい証拠が昨日明るみに出た。	idiom
come to think of it	pre1	そういえば	Come to think of it, I haven't seen Ken today.	そういえば、今日はケンを見ていない。	discourse
compensate for	pre2	〜を埋め合わせる	Extra practice compensated for lost time.	追加練習が失った時間を埋め合わせた。	preposition
confine A to B	2	AをBに限定する・閉じ込める	Please confine your answer to two sentences.	答えを2文に限定してください。	structure
consist in	pre2	〜に本質がある	True strength consists in patience.	本当の強さは忍耐にある。	preposition
correspond with	2	〜と一致する・文通する	The results correspond with our prediction.	結果は私たちの予測と一致する。	preposition
could use	pre1	〜が欲しい・〜があると助かる	I could use a short break.	少し休憩できると助かる。	idiom
Could you ~ ?	4	〜していただけますか	Could you speak more slowly?	もう少しゆっくり話していただけますか。	conversation
count for	pre1	重要である・価値がある	Honesty counts for more than speed here.	ここでは速さより正直さが重要だ。	preposition
`

export const CURRICULUM_1900_PHRASES_A_C = Object.freeze(
  parseCurriculum1900PhraseRows(ROWS),
)
