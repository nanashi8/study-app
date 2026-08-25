import { parseCurriculum1900PhraseRows } from './curriculum-phrase-utils.js'

// 出典順ではなく、正規形の英字順。
const ROWS = String.raw`
dare to do	pre1	思い切って〜する	She dared to question the old rule.	彼女は思い切って古い規則に疑問を呈した。	structure
date back to	2	〜までさかのぼる	This bridge dates back to the 1800s.	この橋は1800年代までさかのぼる。	phrasal-verb
date from	2	〜に始まる・〜の時代のものである	The manuscript dates from the tenth century.	その写本は10世紀のものだ。	preposition
dawn on	2	〜に突然分かる	It dawned on me that I had the wrong key.	違う鍵を持っていたことに突然気付いた。	phrasal-verb
deal in	pre1	〜を商う・扱う	The gallery deals in modern art.	その画廊は現代美術を扱う。	preposition
decide on	2	〜に決める	We decided on the blue design.	私たちは青いデザインに決めた。	preposition
decide to	4	〜することに決める	I decided to walk to school.	私は学校まで歩くことに決めた。	structure
derive from	2	〜に由来する	The word derives from Latin.	その語はラテン語に由来する。	preposition
diagnose A as B	2	AをBと診断する	The doctor diagnosed the illness as influenza.	医師はその病気をインフルエンザと診断した。	structure
die of	pre2	〜で死ぬ	Many trees died of disease.	多くの木が病気で枯れた。	preposition
die out	3	絶滅する・消滅する	Some traditions may die out.	いくつかの伝統は消えてしまうかもしれない。	phrasal-verb
do ~ good	2	〜のためになる	A short walk will do you good.	短い散歩はあなたのためになる。	structure
do well	3	うまくいく・よい成績を取る	She did well on the exam.	彼女は試験でよい成績を取った。	collocation
do with	2	〜を必要とする・〜で済ませる	I could do with a cup of tea.	紅茶を一杯いただけるとありがたい。	phrasal-verb
don't have to	3	〜する必要はない	You don't have to hurry.	急ぐ必要はない。	structure	禁止ではなく「必要がない」を表す。must not と区別する。
down the road	2	将来に・この先で	This choice may help us down the road.	この選択は将来私たちの助けになるかもしれない。	idiom
dozens of	3	何十もの・多数の	Dozens of birds rested by the lake.	何十羽もの鳥が湖畔で休んでいた。	collocation
drive at	pre2	〜を言おうとする	I don't understand what you're driving at.	あなたが何を言おうとしているのか分からない。	phrasal-verb
drop out	2	中途でやめる・脱落する	He dropped out of the course in June.	彼は6月にその講座を中途でやめた。	phrasal-verb
early on	pre1	早い段階で	We noticed the error early on.	私たちは早い段階で誤りに気付いた。	idiom
eat out	3	外食する	We eat out once a month.	私たちは月に一度外食する。	phrasal-verb
encourage A to B	3	AにBするよう勧める	The coach encouraged us to keep trying.	コーチは私たちに挑戦を続けるよう励ました。	structure
enjoy oneself	3	楽しく過ごす	Did you enjoy yourself at the festival?	祭りを楽しみましたか。	idiom
enough ~ to go around	1	全員に行き渡るだけの〜	There is enough food to go around.	全員に行き渡るだけの食べ物がある。	structure
enter into	2	〜に入る・〜を始める	The two companies entered into an agreement.	2社は契約を結んだ。	preposition
even as	pre2	まさに〜する間にも	The town changed even as we watched.	私たちが見ている間にも町は変わった。	structure
even if	3	たとえ〜でも	I will go even if it rains.	たとえ雨でも私は行く。	structure
every other	1	一つおきの・隔〜	The bus runs every other hour.	そのバスは2時間おきに走る。	collocation
every time	pre1	〜するたびに	Every time I hear the song, I remember home.	その歌を聞くたびに故郷を思い出す。	structure
Excuse me.	4	すみません	Excuse me. Is this seat free?	すみません。この席は空いていますか。	conversation
expose A to B	2	AをBにさらす	Do not expose the film to direct sunlight.	そのフィルムを直射日光にさらさないでください。	structure
fall in love with	pre2	〜に恋をする・〜が大好きになる	She fell in love with the quiet town.	彼女はその静かな町が大好きになった。	idiom
fall on	2	〜に当たる・〜に降りかかる	This year's holiday falls on a Monday.	今年の祝日は月曜日に当たる。	preposition
fall victim to	2	〜の犠牲になる	Several farms fell victim to the flood.	いくつかの農場が洪水の被害に遭った。	idiom
far away	5	遠くに	My grandparents live far away.	祖父母は遠くに住んでいる。	idiom
far from	pre2	決して〜でない・〜から遠い	The task is far from easy.	その課題は決して簡単ではない。	preposition
feed on	2	〜を餌にする	These birds feed on small fish.	これらの鳥は小魚を餌にする。	preposition
feel free to	3	遠慮なく〜する	Feel free to use this desk.	遠慮なくこの机を使ってください。	structure
feel like doing	2	〜したい気がする	I feel like taking a walk.	散歩したい気分だ。	structure	like の後ろには動名詞を置く。
feel sorry for	2	〜を気の毒に思う	I felt sorry for the lost child.	私は迷子を気の毒に思った。	preposition
fill out	pre2	記入する	Please fill out this form in ink.	この用紙にインクで記入してください。	phrasal-verb
find fault with	2	〜のあら探しをする	He always finds fault with minor details.	彼はいつも細部のあら探しをする。	idiom
find one's way to	2	〜へたどり着く	We found our way to the village before dark.	私たちは暗くなる前に村へたどり着いた。	idiom
find oneself	pre1	気が付くと〜にいる・自分を知る	I found myself agreeing with her.	気が付くと私は彼女に同意していた。	structure
first of all	2	まず第一に	First of all, check the address.	まず第一に住所を確認しなさい。	discourse
follow suit	1	人にならう	One store cut prices, and the others followed suit.	一店が値下げし、ほかの店もそれにならった。	idiom
follow through on	pre1	〜を最後まで実行する	We must follow through on our promise.	私たちは約束を最後まで実行しなければならない。	phrasal-verb
for a change	pre1	気分転換に・いつもと違って	Let's cook at home for a change.	気分を変えて家で料理しよう。	idiom
for a rainy day	1	万一に備えて	She saves a little money for a rainy day.	彼女は万一に備えて少しお金を貯めている。	idiom
for a while	pre2	しばらくの間	Please wait here for a while.	ここでしばらく待ってください。	preposition
for all I know	pre1	私の知る限りでは・ひょっとすると	For all I know, the meeting may be canceled.	ひょっとすると会議は中止かもしれない。	idiom
for nothing	pre1	無料で・無駄に	We did not work all night for nothing.	私たちは無駄に徹夜したのではない。	idiom
for now	pre2	今のところは	This solution will work for now.	今のところはこの解決法でうまくいく。	discourse
for one's part	2	〜としては	For my part, I support the proposal.	私としてはその提案を支持する。	discourse
for sure	2	確かに	I don't know for sure yet.	まだ確かなことは分からない。	idiom
for the most part	pre2	大部分は	The road is, for the most part, flat.	その道は大部分が平らだ。	discourse
for the present	2	当分の間	The museum will remain closed for the present.	その博物館は当分閉館する。	idiom
forbid A from B	2	AがBするのを禁じる	The rule forbids visitors from taking photos.	その規則は来場者の写真撮影を禁じている。	structure	標準的には forbid A to do もよく使う。
from ~ on	2	〜からずっと	From Monday on, the office opens at nine.	月曜日からずっと事務所は9時に開く。	structure
from ~ point of view	2	〜の観点から	From a learner's point of view, the guide is clear.	学習者の観点から見ると、その案内は明快だ。	structure
from scratch	pre2	ゼロから	They built the app from scratch.	彼らはそのアプリをゼロから作った。	idiom
from time to time	pre2	時々	I visit the old library from time to time.	私は時々その古い図書館を訪れる。	idiom
generally speaking	2	一般的に言えば	Generally speaking, smaller classes help.	一般的に言えば、少人数学級は役に立つ。	discourse
get along	3	うまくやっていく	The two new members get along well.	2人の新しい会員は仲良くやっている。	phrasal-verb
get even with	pre1	〜に仕返しする	He tried to get even with his rival.	彼はライバルに仕返ししようとした。	idiom
get in touch with	2	〜と連絡を取る	Please get in touch with me tomorrow.	明日私に連絡してください。	idiom
get on ~'s nerves	1	〜をいらいらさせる	That constant tapping gets on my nerves.	その絶え間ない音は私をいらいらさせる。	idiom
get the better of	pre1	〜に勝つ・〜を抑えきれなくなる	Curiosity got the better of me.	私は好奇心を抑えられなかった。	idiom
give ~ a hand	3	〜を手伝う	Could you give me a hand with these boxes?	この箱を運ぶのを手伝ってくれますか。	structure
give ~ a try	3	〜を試してみる	Give the new method a try.	新しい方法を試してみなさい。	structure
give birth to	2	〜を産む・〜を生み出す	The discovery gave birth to a new field.	その発見は新しい分野を生み出した。	idiom
give one's regards to	pre1	〜によろしく伝える	Please give my regards to your family.	ご家族によろしくお伝えください。	idiom
given that	pre2	〜を考慮すると	Given that time is short, we should begin.	時間が短いことを考えると、始めるべきだ。	structure
go ~ing	4	〜しに行く	We went swimming after school.	私たちは放課後泳ぎに行った。	structure
go a long way to do	1	〜するのに大いに役立つ	A kind word can go a long way to build trust.	親切な一言は信頼を築くのに大いに役立つ。	structure
go along	4	一緒に行く・進む	You may go along with us.	私たちと一緒に行ってもよい。	phrasal-verb
go back to	pre2	〜に戻る・〜までさかのぼる	This custom goes back to ancient times.	この習慣は古代までさかのぼる。	preposition
go blind	2	失明する	The old dog gradually went blind.	その老犬は徐々に目が見えなくなった。	collocation
go so far as to do	2	〜するところまでいく	He went so far as to rewrite the whole report.	彼は報告書全体を書き直すところまでやった。	structure
go to the polls	pre2	投票する	Citizens will go to the polls on Sunday.	市民は日曜日に投票する。	idiom
go with	2	〜と調和する・〜を選ぶ	This blue tie goes with your jacket.	この青いネクタイは上着に合う。	phrasal-verb
hand down	2	〜を後世に伝える・判決を下す	The recipe was handed down for generations.	そのレシピは何世代にもわたり伝えられた。	phrasal-verb
hand over	2	〜を引き渡す	Please hand over the key at the desk.	受付で鍵を引き渡してください。	phrasal-verb
hang around	pre1	ぶらぶらする・近くにいる	We hung around the station after lunch.	私たちは昼食後、駅の周りで時間を過ごした。	phrasal-verb
happen to do	2	たまたま〜する	I happened to meet her on the train.	私はたまたま電車で彼女に会った。	structure
have ~ off	3	〜を休みにする	I have Friday off this week.	今週は金曜日が休みだ。	structure
have ~ on one's mind	pre1	〜を気に掛けている	She has the exam on her mind.	彼女は試験のことを気に掛けている。	structure
have a good command of	pre2	〜を自在に使いこなす	She has a good command of English.	彼女は英語を自在に使いこなす。	idiom
have A in common with B	2	AをBと共通に持つ	I have a love of music in common with Ken.	私は音楽好きという点でケンと共通している。	structure
have a liking for	2	〜が好きである	He has a liking for spicy food.	彼は辛い食べ物が好きだ。	idiom
have a look at	pre2	〜を見てみる	Have a look at this chart.	この表を見てみてください。	idiom
have a say	pre2	発言権を持つ	Students should have a say in the decision.	生徒もその決定に発言権を持つべきだ。	idiom
have A to do with B	2	AはBと関係がある	The problem has something to do with heat.	その問題は熱と何らかの関係がある。	structure
have an eye for	pre1	〜を見る目がある	She has an eye for good design.	彼女には良いデザインを見る目がある。	idiom
have an influence on	2	〜に影響を与える	Sleep has an influence on memory.	睡眠は記憶に影響を与える。	preposition
have no idea	3	まったく分からない	I have no idea where he went.	彼がどこへ行ったのかまったく分からない。	idiom
have no other choice but to do	2	〜するほかない	We had no other choice but to wait.	私たちは待つほかなかった。	structure
have one's way	2	思いどおりにする	The child always wants to have his way.	その子はいつも思いどおりにしたがる。	idiom
have to	3	〜しなければならない	I have to finish this today.	私は今日これを終えなければならない。	structure
have yet to do	pre1	まだ〜していない	The committee has yet to announce a date.	委員会はまだ日程を発表していない。	structure
having said that	pre2	そうは言っても	Having said that, the plan still has value.	そうは言っても、その計画にはなお価値がある。	discourse
help A with B	3	AのBを手伝う	Could you help me with my homework?	宿題を手伝ってくれますか。	structure
help oneself to	pre1	〜を自由に取る	Please help yourself to some fruit.	果物を自由に取ってください。	idiom
Here is ~ .	4	ここに〜があります	Here is your ticket.	こちらがあなたの切符です。	conversation
Here we are.	pre1	さあ着きました・これです	Here we are. This is the museum.	さあ着きました。ここが博物館です。	conversation
hit it off with	pre1	〜とすぐ気が合う	I hit it off with my new neighbor.	私は新しい隣人とすぐ気が合った。	idiom
hit on	pre2	〜を思いつく	We finally hit on a practical solution.	私たちはついに実用的な解決策を思いついた。	phrasal-verb
hold ~ in check	pre1	〜を抑える	The barrier held the floodwater in check.	その堤防は洪水を抑えた。	structure
hold one's breath	pre2	息を止める	We held our breath as the result appeared.	結果が表示された時、私たちは息を止めた。	idiom
hold true	1	当てはまる・有効である	The same principle holds true here.	同じ原則がここでも当てはまる。	idiom
hold up	2	〜を遅らせる・持ちこたえる	Heavy traffic held us up.	激しい渋滞で私たちは遅れた。	phrasal-verb
How about ~ ?	4	〜はどうですか	How about lunch at noon?	正午に昼食はどうですか。	conversation
How are you?	4	お元気ですか	Hi, Mina. How are you?	こんにちは、ミナ。元気ですか。	conversation
How come ~ ?	pre1	どうして〜なの	How come you know my name?	どうして私の名前を知っているの。	conversation
How long ~ ?	4	どのくらい長く・どのくらいの期間	How long did the trip take?	その旅行にはどのくらい時間がかかりましたか。	conversation
`

export const CURRICULUM_1900_PHRASES_D_H = Object.freeze(
  parseCurriculum1900PhraseRows(ROWS),
)
