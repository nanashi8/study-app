import { parseCurriculum1900PhraseRows } from './curriculum-phrase-utils.js'

// 正規形の英字順。
const ROWS = String.raw`
dare to do	pre1	思い切って〜する	She dared to question the old rule.	彼女は思い切って古い規則に疑問を呈した。	structure	否定文・疑問文では to を付けない形もある（How dare you say that!）。	dare(思い切ってする)＋to do(〜することを)。危険や反発を恐れず〜することから「思い切って〜する」。
date back to	2	〜までさかのぼる	This bridge dates back to the 1800s.	この橋は1800年代までさかのぼる。	phrasal-verb	進行形にせず現在形で使う（This bridge dates back to the 1800s.）。date from もほぼ同じ意味。	date(日付をもつ)＋back(さかのぼって)＋to(〜まで)。始まりの日付が〜までさかのぼることから「〜までさかのぼる」。
date from	2	〜に始まる・〜の時代のものである	The manuscript dates from the tenth century.	その写本は10世紀のものだ。	preposition	現在形で使い、from の後ろに時代・年を置く。date back to とほぼ同じ意味。	date(日付をもつ)＋from(〜から)。〜の時代からの日付を持っていることから「〜に始まる・〜の時代のものである」。
dawn on	2	〜に突然分かる	It dawned on me that I had the wrong key.	違う鍵を持っていたことに突然気付いた。	phrasal-verb	It dawned on me that … の形でよく使い、分かった人を on の後ろに置く。	dawn(夜が明ける)＋on(〜の上に)。夜明けの光が差すように、〜の頭に考えが差し込むことから「〜に突然分かる」。
deal in	pre1	〜を商う・扱う	The gallery deals in modern art.	その画廊は現代美術を扱う。	preposition	in の後ろは商品の種類。deal with は「〜に対処する・〜と取引する」で意味が違う。	deal(取引する)＋in(〜の分野で)。〜という品物の分野で取引することから「〜を商う・扱う」。
decide on	2	〜に決める	We decided on the blue design.	私たちは青いデザインに決めた。	preposition	on の後ろは名詞（decide on the blue design）。動詞なら decide to do。	decide(決める)＋on(〜の上に)。いくつかの候補の中から〜の上に決めることから「〜に決める」。
decide to	4	〜することに決める	I decided to walk to school.	私は学校まで歩くことに決めた。	structure	to の後ろは動詞の原形。decide doing とは言わない。	decide(決める)＋to do(〜することを)。これから〜することを決めることから「〜することに決める」。
derive from	2	〜に由来する	The word derives from Latin.	その語はラテン語に由来する。	preposition	自動詞で「由来する」、derive A from B で「BからAを得る」。受け身 be derived from も同じ意味。	derive(引き出される)＋from(〜から)。de(〜から)＋rive(川)で、川から水を引くように〜から出てきていることから「〜に由来する」。
diagnose A as B	2	AをBと診断する	The doctor diagnosed the illness as influenza.	医師はその病気をインフルエンザと診断した。	structure	人を主語にした受け身 be diagnosed with 病名 もよく使う（She was diagnosed with the flu.）。	diagnose(診断する)＋A＋as B(Bとして)。dia(通して)＋gnose(知る)で、症状を通して病気を見分けることから「AをBと診断する」。
die of	pre2	〜で死ぬ	Many trees died of disease.	多くの木が病気で枯れた。	preposition	病気・飢えなど体の内側の原因には of がよく使われ、けがなど外からの原因には from がよく使われる。	die(死ぬ)＋of(〜が原因で)。of が死の原因となる病気などを示し、「〜で死ぬ」。
die out	3	絶滅する・消滅する	Some traditions may die out.	いくつかの伝統は消えてしまうかもしれない。	phrasal-verb	種・習慣・言語などを主語にする。die away は「音などがしだいに消える」。	die(死ぬ)＋out(すっかり消えて)。すっかり死に絶えて消えることから「絶滅する・消滅する」。
do ~ good	2	〜のためになる	A short walk will do you good.	短い散歩はあなたのためになる。	structure	反対は do ~ harm（害を与える）。do good to 人 の形も使う。	do(もたらす)＋~(人)＋good(よいこと)。人によいことをもたらすことから「〜のためになる」。
do well	3	うまくいく・よい成績を取る	She did well on the exam.	彼女は試験でよい成績を取った。	collocation	試験・仕事・商売などに使う（did well on the exam）。do well to do は「〜するのが賢明だ」。	do(やる)＋well(うまく)。うまくやることから「うまくいく・よい成績を取る」。
do with	2	〜を必要とする・〜で済ませる	I could do with a cup of tea.	紅茶を一杯いただけるとありがたい。	phrasal-verb	could do with 〜 で「〜があるとありがたい」。What did you do with 〜? は「〜をどうしたか」。	do(やっていく)＋with(〜があれば)。〜があればやっていけることから「〜を必要とする」、〜でやっていくことから「〜で済ませる」。
don't have to	3	〜する必要はない	You don't have to hurry.	急ぐ必要はない。	structure	禁止ではなく「必要がない」を表す。must not と区別する。	don't(〜ない)＋have to(〜しなければならない)。「〜しなければならない」を打ち消すことから「〜する必要はない」。
down the road	2	将来に・この先で	This choice may help us down the road.	この選択は将来私たちの助けになるかもしれない。	idiom	会話的な表現で、数年先のことにも使う。further down the road で「もっと先に」。	down(先の方へ)＋the road(道)。道の先の方にということから、時間の先の「将来に・この先で」。
dozens of	3	何十もの・多数の	Dozens of birds rested by the lake.	何十羽もの鳥が湖畔で休んでいた。	collocation	数詞と一緒なら dozen は複数形にしない（two dozen eggs）。概数では dozens of にする。	dozens(12のまとまりがいくつも)＋of(〜の)。1ダース(12)がいくつもあることから「何十もの・多数の」。
drive at	pre2	〜を言おうとする	I don't understand what you're driving at.	あなたが何を言おうとしているのか分からない。	phrasal-verb	進行形の疑問文でよく使う（What are you driving at?）。	drive(進む)＋at(〜をめがけて)。話が〜をめがけて進んでいることから「〜を言おうとする」。
drop out	2	中途でやめる・脱落する	He dropped out of the course in June.	彼は6月にその講座を中途でやめた。	phrasal-verb	やめる対象を言うときは drop out of（drop out of school）。名詞は dropout（中退者）。	drop(落ちる)＋out(外へ)。集団や課程から外へこぼれ落ちることから「中途でやめる・脱落する」。
early on	pre1	早い段階で	We noticed the error early on.	私たちは早い段階で誤りに気付いた。	idiom	過程の初めのころを表す（noticed the error early on）。文末に置くことが多い。	early(早い時期に)＋on(進む流れの中で)。物事が進む中の早い時期にということから「早い段階で」。
eat out	3	外食する	We eat out once a month.	私たちは月に一度外食する。	phrasal-verb	目的語を取らない。反対は eat in（家で食べる）。	eat(食べる)＋out(外で)。家の外で食べることから「外食する」。
encourage A to B	3	AにBするよう勧める	The coach encouraged us to keep trying.	コーチは私たちに挑戦を続けるよう励ました。	structure	to の後ろは動詞の原形（encouraged us to keep trying）。discourage A from doing と対になる。	encourage(勇気づける)＋A＋to do(〜するように)。en(与える)＋courage(勇気)で、Aに勇気を与えて〜させることから「AにBするよう勧める」。
enjoy oneself	3	楽しく過ごす	Did you enjoy yourself at the festival?	祭りを楽しみましたか。	idiom	oneself を主語に合わせて変える（Did you enjoy yourself?）。enjoy だけのときは目的語が必要。	enjoy(楽しませる)＋oneself(自分自身)。自分自身を楽しませることから「楽しく過ごす」。
enough ~ to go around	1	全員に行き渡るだけの〜	There is enough food to go around.	全員に行き渡るだけの食べ物がある。	structure	物の量が人数に足りるかを言う（enough food to go around）。英国では go round とも言う。	enough ~(十分な〜)＋to go around(ぐるりと回るのに)。全員の間をぐるりと回るのに足りる量ということから「全員に行き渡るだけの〜」。
enter into	2	〜に入る・〜を始める	The two companies entered into an agreement.	2社は契約を結んだ。	preposition	契約・議論・関係などに使う（enter into an agreement）。部屋などの場所には enter だけで into は付けない。	enter(入る)＋into(〜の中へ)。話し合いや契約の中へ入ることから「〜に入る・〜を始める」。
even as	pre2	まさに〜する間にも	The town changed even as we watched.	私たちが見ている間にも町は変わった。	structure	2つのことが同時に進むことを強調する。even if・even though とは意味が違う。	even(まさに)＋as(〜する間に)。まさに〜しているその間にということから「まさに〜する間にも」。
even if	3	たとえ〜でも	I will go even if it rains.	たとえ雨でも私は行く。	structure	起こるか分からないことを仮定する。事実を認める「〜だけれども」は even though。	even(たとえ)＋if(もし〜なら)。if を even で強め、仮にそうなってもということから「たとえ〜でも」。
every other	1	一つおきの・隔〜	The bus runs every other hour.	そのバスは2時間に1本走る。	collocation	every other day は「1日おき（2日に1回）」、every other week は「隔週」。	every(どの〜も)＋other(一つおいた別の)。一つおきに選んでいくことから「一つおきの・隔〜」。
every time	pre1	〜するたびに	Every time I hear the song, I remember home.	その歌を聞くたびに故郷を思い出す。	structure	後ろに主語＋動詞を置く（Every time I hear the song, …）。whenever とほぼ同じ意味。	every(どの〜も)＋time(回)。どの回もということから、接続詞として「〜するたびに」。
Excuse me.	4	すみません	Excuse me. Is this seat free?	すみません。この席は空いていますか。	conversation	人に話しかける、前を通る、軽くわびるときに使う。はっきり謝るなら I'm sorry.。	excuse(許す)＋me(私を)。私の失礼を許してくださいということから「すみません」。
expose A to B	2	AをBにさらす	Do not expose the film to direct sunlight.	そのフィルムを直射日光にさらさないでください。	structure	受け身 be exposed to もよく使う。新しい考えや文化に「触れさせる」意味にもなる。	expose(さらす)＋A＋to B(Bに)。ex(外に)＋pose(置く)で、Aを外に出してBに当てることから「AをBにさらす」。
fall in love with	pre2	〜に恋をする・〜が大好きになる	She fell in love with the quiet town.	彼女はその静かな町が大好きになった。	idiom	恋をしている状態は be in love with。人にも場所・物にも使う。	fall(落ちる)＋in love(恋の状態に)＋with(〜と)。恋の状態に落ちることから「〜に恋をする」、場所や物を心から好きになることから「〜が大好きになる」。
fall on	2	〜に当たる・〜に降りかかる	This year's holiday falls on a Monday.	今年の祝日は月曜日に当たる。	preposition	曜日・日付に当たるときは on の後ろに曜日を置く（falls on a Monday）。	fall(落ちる)＋on(〜の上に)。日付が〜の曜日の上に落ちることから「〜に当たる」、責任などが人の上に落ちることから「〜に降りかかる」。
fall victim to	2	〜の犠牲になる	Several farms fell victim to the flood.	いくつかの農場が洪水の被害に遭った。	idiom	victim に冠詞を付けない定型。病気・災害・詐欺などを to の後ろに置く。	fall(〜になる)＋victim(犠牲者)＋to(〜の)。〜による犠牲者になることから「〜の犠牲になる」。
far away	5	遠くに	My grandparents live far away.	祖父母は遠くに住んでいる。	idiom	far away from 〜 で「〜から遠く離れて」。名詞の前では faraway（a faraway country）。	far(遠く)＋away(離れて)。遠く離れた所にということから「遠くに」。
far from	pre2	決して〜でない・〜から遠い	The task is far from easy.	その課題は決して簡単ではない。	preposition	「決して〜でない」では後ろに形容詞・名詞・動名詞を置く（far from easy）。	far(遠く)＋from(〜から)。〜から遠く離れていることから「〜から遠い」、その状態から遠いことから「決して〜でない」。
feed on	2	〜を餌にする	These birds feed on small fish.	これらの鳥は小魚を餌にする。	preposition	動物を主語にする（These birds feed on small fish.）。人が食べ物や収入で生きるなら live on。	feed(えさを食べる)＋on(〜を糧にして)。〜を糧にして生きることから「〜を餌にする」。
feel free to	3	遠慮なく〜する	Feel free to use this desk.	遠慮なくこの机を使ってください。	structure	命令文で、相手に遠慮しないよう勧める（Feel free to use this desk.）。	feel free(自由だと感じる)＋to do(〜することを)。〜することを自由に感じてよいということから「遠慮なく〜する」。
feel like doing	2	〜したい気がする	I feel like taking a walk.	散歩したい気分だ。	structure	like の後ろには動名詞を置く。	feel like(〜のような気がする)＋doing(〜すること)。〜することに気持ちが向いていることから「〜したい気がする」。
feel sorry for	2	〜を気の毒に思う	I felt sorry for the lost child.	私は迷子を気の毒に思った。	preposition	feel sorry for oneself は「自分をあわれむ」。自分が謝るときの I'm sorry for 〜 とは使い方が違う。	feel sorry(気の毒に思う)＋for(〜のことを)。for が気の毒に思う相手を示し、「〜を気の毒に思う」。
fill out	pre2	記入する	Please fill out this form in ink.	この用紙にインクで記入してください。	phrasal-verb	fill in とほぼ同じ意味で、米国でよく使う。目的語は用紙（fill out this form）。	fill(埋める)＋out(すっかり)。用紙の空欄をすっかり埋めることから「記入する」。
find fault with	2	〜のあら探しをする	He always finds fault with minor details.	彼はいつも細部のあら探しをする。	idiom	fault に冠詞を付けない。細かいことに文句を言う否定的な表現。	find(見つける)＋fault(欠点)＋with(〜について)。〜について欠点を探し出すことから「〜のあら探しをする」。
find one's way to	2	〜へたどり着く	We found our way to the village before dark.	私たちは暗くなる前に村へたどり着いた。	idiom	one's は主語に合わせて変える。迷いながら、あるいは苦労して着く感じを含む。	find one's way(道を見つけて進む)＋to(〜へ)。道を見つけながら〜へ進むことから「〜へたどり着く」。
find oneself	pre1	気が付くと〜にいる・自分を知る	I found myself agreeing with her.	気が付くと私は彼女に同意していた。	structure	後ろに場所・doing・形容詞を置く（found myself agreeing with her）。	find(気づく)＋oneself(自分自身が)。ふと気づくと自分がある場所・状態にいることから「気が付くと〜にいる」、本当の自分を見つけることから「自分を知る」。
first of all	2	まず第一に	First of all, check the address.	まず第一に住所を確認しなさい。	discourse	いくつかの点を順に述べる最初に置く。to begin with とほぼ同じ意味。	first(最初)＋of all(すべての中で)。すべての中の最初にということから「まず第一に」。
follow suit	1	人にならう	One store cut prices, and the others followed suit.	一店が値下げし、ほかの店もそれにならった。	idiom	前の人や会社と同じ行動をとることを表す（the others followed suit）。suit は無冠詞。	follow(続く)＋suit(同じ組の札)。トランプで、前の人と同じ組の札を出すことから「人にならう」。
follow through on	pre1	〜を最後まで実行する	We must follow through on our promise.	私たちは約束を最後まで実行しなければならない。	phrasal-verb	on の後ろに約束・計画などを置く（follow through on our promise）。	follow through(最後まで振り抜く)＋on(〜について)。打った後もバットを振り抜くように、〜を最後までやりとげることから「〜を最後まで実行する」。
for a change	pre1	気分転換に・いつもと違って	Let's cook at home for a change.	気分を変えて家で料理しよう。	idiom	いつもと違うことをするときに文末に置く。	for(〜のために)＋a change(変化)。いつもと違う変化のためにということから「気分転換に・いつもと違って」。
for a rainy day	1	万一に備えて	She saves a little money for a rainy day.	彼女は万一に備えて少しお金を貯めている。	idiom	save / keep money for a rainy day の形でよく使う。	for(〜に備えて)＋a rainy day(雨の日)。雨の日を困った時のたとえにして、そのような時に備えることから「万一に備えて」。
for a while	pre2	しばらくの間	Please wait here for a while.	ここでしばらく待ってください。	preposition	継続の期間を表す。after a while は「しばらくして」で意味が違う。	for(〜の間)＋a while(少しの時間)。少しの時間の間ということから「しばらくの間」。
for all I know	pre1	私の知る限りでは・ひょっとすると	For all I know, the meeting may be canceled.	ひょっとすると会議は中止かもしれない。	idiom	自分には分からないので可能性はあると言う（For all I know, the meeting may be canceled.）。	for all(〜の範囲では)＋I know(私が知っている)。私の知っている範囲では否定できないということから「ひょっとすると」。
for nothing	pre1	無料で・無駄に	We did not work all night for nothing.	私たちは無駄に徹夜したのではない。	idiom	not ~ for nothing は「理由があって〜した・無駄に〜したのではない」。	for(〜と引きかえに)＋nothing(何もない)。何とも引きかえにしないことから「無料で」、何も得られないことから「無駄に」。
for now	pre2	今のところは	This solution will work for now.	今のところはこの解決法でうまくいく。	discourse	後で変わるかもしれない一時的な判断を表す。別れ際の Bye for now. は「じゃあまた」。	for(〜の間は)＋now(今)。今の間はということから「今のところは」。
for one's part	2	〜としては	For my part, I support the proposal.	私としてはその提案を支持する。	discourse	one's は話す人に合わせる（For my part, …）。ほかの人と比べて自分の意見を言うときに使う。	for(〜について言えば)＋one's part(その人の役割・立場)。自分の立場について言えばということから「〜としては」。
for sure	2	確かに	I don't know for sure yet.	まだ確かなことは分からない。	idiom	否定文で「はっきりとは〜ない」（I don't know for sure.）。会話の That's for sure. は「間違いない」。	for(〜として)＋sure(確かな)。確かなこととしてということから「確かに」。
for the most part	pre2	大部分は	The road is, for the most part, flat.	その道は大部分が平らだ。	discourse	例外があることを認めつつ全体を言う。mostly とほぼ同じ意味。	for(〜について)＋the most part(大部分)。大部分についてはということから「大部分は」。
for the present	2	当分の間	The museum will remain closed for the present.	その博物館は当分閉館する。	idiom	for now / for the time being とほぼ同じ意味で、やや改まった表現。	for(〜の間は)＋the present(現在)。現在の間はということから「当分の間」。
forbid A from B	2	AがBするのを禁じる	The rule forbids visitors from taking photos.	その規則は来場者の写真撮影を禁じている。	structure	forbid A to do の形も使う。from の後ろは動名詞。	forbid(禁じる)＋A＋from doing(〜することから遠ざけて)。for(遠ざけて)＋bid(命じる)で、〜から離れるよう命じることから「AがBするのを禁じる」。
from ~ on	2	〜からずっと	From Monday on, the office opens at nine.	月曜日からずっと事務所は9時に開く。	structure	~ に時を表す語を置く（from Monday on / from now on）。on を落とさない。	from(〜から)＋~(起点の時)＋on(先へずっと)。〜の時を起点に先へずっとということから「〜からずっと」。
from ~ point of view	2	〜の観点から	From a learner's point of view, the guide is clear.	学習者の観点から見ると、その案内は明快だ。	structure	~ には名詞の所有格や my・your などを置く。from the viewpoint of も同じ意味。	from(〜から)＋~'s point of view(〜が物を見る地点)。〜が見る地点からということから「〜の観点から」。
from scratch	pre2	ゼロから	They built the app from scratch.	彼らはそのアプリをゼロから作った。	idiom	何もない状態から作る・始めることを表す（built the app from scratch）。	from(〜から)＋scratch(地面に引いた線)。競走で地面に引いたスタートの線から始めることから「ゼロから」。
from time to time	pre2	時々	I visit the old library from time to time.	私は時々その古い図書館を訪れる。	idiom	sometimes とほぼ同じ意味で、あまり多くない頻度を表す。	from time(ある時から)＋to time(また別の時へ)。時から時へ間をあけてということから「時々」。
generally speaking	2	一般的に言えば	Generally speaking, smaller classes help.	一般的に言えば、少人数学級は役に立つ。	discourse	分詞構文の決まった形で、文頭に置く。strictly speaking「厳密に言えば」と同じ作り。	generally(全体として)＋speaking(言うと)。全体として言うとということから「一般的に言えば」。
get along	3	うまくやっていく	The two new members get along well.	2人の新しい会員は仲良くやっている。	phrasal-verb	相手を言うときは get along with 人（get along with my classmates）。英国では get on (with) とも言う。	get(進む)＋along(一緒に・先へ)。人と一緒にうまく進んでいくことから「うまくやっていく」。
get even with	pre1	〜に仕返しする	He tried to get even with his rival.	彼はライバルに仕返ししようとした。	idiom	with の後ろは仕返しする相手。くだけた表現で、怒りや恨みの含みがある。	get(ある状態になる)＋even(貸し借りなしの)＋with(〜と)。受けた仕打ちをやり返して相手と貸し借りなしにすることから「〜に仕返しする」。
get in touch with	2	〜と連絡を取る	Please get in touch with me tomorrow.	明日私に連絡してください。	idiom	連絡を取り始める動作を表す。連絡を取り続けるなら keep / stay in touch with。	get(ある状態になる)＋in touch(触れ合った状態に)＋with(〜と)。相手と触れ合える状態になることから「〜と連絡を取る」。
get on ~'s nerves	1	〜をいらいらさせる	That constant tapping gets on my nerves.	その絶え間ない音は私をいらいらさせる。	idiom	主語はいらいらの原因（That noise gets on my nerves.）。~'s は my・his などの所有格。	get on(〜の上に乗る)＋~'s nerves(〜の神経)。人の神経の上に乗ってさわり続けることから「〜をいらいらさせる」。
get the better of	pre1	〜に勝つ・〜を抑えきれなくなる	Curiosity got the better of me.	私は好奇心を抑えられなかった。	idiom	感情を主語にすると「〜を抑えられなくなる」（Curiosity got the better of me.）。	get(手に入れる)＋the better(優位)＋of(〜に対する)。〜に対する優位を手に入れることから「〜に勝つ」、感情が自分に勝つことから「〜を抑えきれなくなる」。
give ~ a hand	3	〜を手伝う	Could you give me a hand with these boxes?	この箱を運ぶのを手伝ってくれますか。	structure	手伝う作業は with で示す（give me a hand with these boxes）。give ~ a big hand は「〜に大きな拍手を送る」。	give(与える)＋~(人)＋a hand(手)。人に自分の手を貸すことから「〜を手伝う」。
give ~ a try	3	〜を試してみる	Give the new method a try.	新しい方法を試してみなさい。	structure	~ には方法・食べ物・店などを置く（Give it a try.）。have a try とほぼ同じ意味。	give(与える)＋~(物事)＋a try(一度の試み)。物事に一度の試みを与えることから「〜を試してみる」。
give birth to	2	〜を産む・〜を生み出す	The discovery gave birth to a new field.	その発見は新しい分野を生み出した。	idiom	人・動物の出産のほか、発見や考えが新しい分野を生む意味にも使う。	give(与える)＋birth(誕生)＋to(〜に)。子に誕生を与えることから「〜を産む」、新しいものを生み出すことから「〜を生み出す」。
give one's regards to	pre1	〜によろしく伝える	Please give my regards to your family.	ご家族によろしくお伝えください。	idiom	one's は話す人に合わせる（give my regards to your family）。say hello to より少し改まった言い方。	give(伝える)＋one's regards(その人の好意・敬意)＋to(〜に)。自分の好意や敬意を〜に伝えることから「〜によろしく伝える」。
given that	pre2	〜を考慮すると	Given that time is short, we should begin.	時間があまりないことを考えると、始めるべきだ。	structure	後ろに主語＋動詞を置く。名詞だけなら given 名詞（given the time limit）。	given(与えられた)＋that(〜ということが)。〜ということが前提として与えられているならということから「〜を考慮すると」。
go ~ing	4	〜しに行く	We went swimming after school.	私たちは放課後泳ぎに行った。	structure	行き先は to ではなく in / at などで示す（go swimming in the river）。shopping・fishing・camping など娯楽に使う。	go(行く)＋~ing(〜すること)。〜する活動をしに出かけることから「〜しに行く」。
go a long way to do	1	〜するのに大いに役立つ	A kind word can go a long way to build trust.	親切な一言は信頼を築くのに大いに役立つ。	structure	to do の代わりに toward(s) doing も使う。主語は行為や物（A kind word can go a long way.）。	go(進む)＋a long way(長い道のり)＋to do(〜する方へ)。〜するための長い道のりを進められることから「〜するのに大いに役立つ」。
go along	4	一緒に行く・進む	You may go along with us.	私たちと一緒に行ってもよい。	phrasal-verb	一緒の相手は with で示す（go along with us）。go along with 意見 は「〜に同意する」。	go(行く)＋along(一緒に・先へ)。一緒について行くことから「一緒に行く」、先へ進むことから「進む」。
go back to	pre2	〜に戻る・〜までさかのぼる	This custom goes back to ancient times.	この習慣は古代までさかのぼる。	preposition	起源を表すときは現在形で使う（This custom goes back to ancient times.）。date back to と近い。	go back(戻る)＋to(〜へ)。〜へ戻ることから「〜に戻る」、時間をさかのぼって〜に行き着くことから「〜までさかのぼる」。
go blind	2	失明する	The old dog gradually went blind.	その老犬は徐々に目が見えなくなった。	collocation	go は好ましくない変化によく使う（go bad「腐る」/ go wrong「うまくいかない」）。	go(〜の状態になる)＋blind(目の見えない)。よくない状態に変わることを表す go で「失明する」。
go so far as to do	2	〜するところまでいく	He went so far as to rewrite the whole report.	彼は報告書全体を書き直すところまでやった。	structure	驚くほど極端な行動に使う。to の後ろは動詞の原形（went so far as to rewrite the report）。	go so far(そこまで遠くへ行く)＋as to do(〜するほど)。〜するほどまで行き過ぎることから「〜するところまでいく」。
go to the polls	pre2	投票する	Citizens will go to the polls on Sunday.	市民は日曜日に投票する。	idiom	選挙で有権者が投票に行くことを表す。the polls は複数形で「投票所・投票」。	go to(〜へ行く)＋the polls(投票所)。poll はもと「頭」の意味で、頭数を数える投票へ行くことから「投票する」。
go with	2	〜と調和する・〜を選ぶ	This blue tie goes with your jacket.	この青いネクタイは上着に合う。	phrasal-verb	服や色の組み合わせによく使う（goes with your jacket）。「選ぶ」は会話的（I'll go with the red one.）。	go(一緒に行く)＋with(〜と)。〜と一緒にいても合うことから「〜と調和する」、〜と一緒に進むことに決めることから「〜を選ぶ」。
hand down	2	〜を後世に伝える・判決を下す	The recipe was handed down for generations.	そのレシピは何世代にもわたり伝えられた。	phrasal-verb	受け身で使うことが多い（was handed down for generations）。	hand(手渡す)＋down(下の世代へ)。上の世代から下の世代へ手渡すことから「〜を後世に伝える」、上から判決を渡すことから「判決を下す」。
hand over	2	〜を引き渡す	Please hand over the key at the desk.	受付で鍵を引き渡してください。	phrasal-verb	目的語が代名詞なら hand it over。権限や責任を渡す意味にも使う（hand over control）。	hand(手渡す)＋over(相手の側へ)。持っていたものを相手の側へ渡すことから「〜を引き渡す」。
hang around	pre1	ぶらぶらする・近くにいる	We hung around the station after lunch.	私たちは昼食後、駅の周りで時間を過ごした。	phrasal-verb	場所を続けるときは around の後ろに置く（hang around the station）。英国では hang about とも言う。	hang(ぶら下がる・とどまる)＋around(あたりに)。あたりにだらだらととどまることから「ぶらぶらする・近くにいる」。
happen to do	2	たまたま〜する	I happened to meet her on the train.	私はたまたま電車で彼女に会った。	structure	to の後ろは動詞の原形。It happens that … の形に言いかえられる。	happen(偶然起こる)＋to do(〜することが)。〜することが偶然起こることから「たまたま〜する」。
have ~ off	3	〜を休みにする	I have Friday off this week.	今週は金曜日が休みだ。	structure	~ に曜日や日数を置く（have Friday off / have two days off）。take ~ off は「休みを取る」。	have(持つ)＋~(日・時間)＋off(仕事から離れて)。仕事から離れた日を持つことから「〜を休みにする」。
have ~ on one's mind	pre1	〜を気に掛けている	She has the exam on her mind.	彼女は試験のことを気に掛けている。	structure	one's は主語に合わせる。What do you have on your mind? は「何を考えているの」。	have(持つ)＋~(物事)＋on one's mind(心の上に)。物事を心の上に載せていることから「〜を気に掛けている」。
have a good command of	pre2	〜を自在に使いこなす	She has a good command of English.	彼女は英語を自在に使いこなす。	idiom	外国語の力によく使う（a good command of English）。good を excellent などに変えて程度を表す。	have(持つ)＋a good command(十分な支配力)＋of(〜に対する)。言葉などを思うように扱える力を持つことから「〜を自在に使いこなす」。
have A in common with B	2	AをBと共通に持つ	I have a love of music in common with Ken.	私は音楽好きという点でケンと共通している。	structure	A には much・nothing・something なども置く（have nothing in common with him）。	have(持つ)＋A＋in common(共通に)＋with B(Bと)。AをBと共通に持っていることから「AをBと共通に持つ」。
have a liking for	2	〜が好きである	He has a liking for spicy food.	彼は辛い食べ物が好きだ。	idiom	食べ物や趣味など好みに使う。take a liking to は「〜が好きになる」。	have(持つ)＋a liking(好み)＋for(〜への)。〜への好みを持っていることから「〜が好きである」。
have a look at	pre2	〜を見てみる	Have a look at this chart.	この表を見てみてください。	idiom	take a look at と同じ意味で、英国でよく使う。look at より「ちょっと見る」感じ。	have(する)＋a look(一目見ること)＋at(〜を)。〜を一度見ることから「〜を見てみる」。
have a say	pre2	発言権を持つ	Students should have a say in the decision.	生徒もその決定に発言権を持つべきだ。	idiom	発言する事柄は in で示す（have a say in the decision）。	have(持つ)＋a say(言う権利)。意見を言う権利を持つことから「発言権を持つ」。
have A to do with B	2	AはBと関係がある	The problem has something to do with heat.	その問題は熱と何らかの関係がある。	structure	A に something（何らかの）・nothing（何も〜ない）・a lot（大いに）を置いて関係の強さを表す。	have(持つ)＋A＋to do with B(Bにかかわる)。Bにかかわることを A だけ持っていることから「AはBと関係がある」。
have an eye for	pre1	〜を見る目がある	She has an eye for good design.	彼女には良いデザインを見る目がある。	idiom	for の後ろに美しさ・デザイン・才能などを置く。	have(持つ)＋an eye(見る目)＋for(〜を見分ける)。〜のよしあしを見分ける目を持つことから「〜を見る目がある」。
have an influence on	2	〜に影響を与える	Sleep has an influence on memory.	睡眠は記憶に影響を与える。	preposition	influence の前に great・strong などを付けて強さを表す。have an effect on とほぼ同じ意味。	have(持つ)＋an influence(影響)＋on(〜の上に)。〜の上に及ぶ影響を持つことから「〜に影響を与える」。
have no idea	3	まったく分からない	I have no idea where he went.	彼がどこへ行ったのかまったく分からない。	idiom	後ろに疑問詞の節を置くことが多い（I have no idea where he went.）。I don't know より強い。	have(持つ)＋no idea(少しの考えもない)。まったく見当がつかないことから「まったく分からない」。
have no other choice but to do	2	〜するほかない	We had no other choice but to wait.	私たちは待つほかなかった。	structure	have no choice but to do とも言う。to の後ろは動詞の原形。	have no other choice(ほかの選択肢がない)＋but to do(〜すること以外に)。〜する以外に選ぶ道がないことから「〜するほかない」。
have one's way	2	思いどおりにする	The child always wants to have his way.	その子はいつも思いどおりにしたがる。	idiom	one's は主語に合わせる。get one's way も同じ意味。	have(手に入れる)＋one's way(自分のやり方)。自分のやり方を通すことから「思いどおりにする」。
have to	3	〜しなければならない	I have to finish this today.	私は今日これを終えなければならない。	structure	外の事情による必要を表すことが多い。否定の don't have to は「〜する必要はない」で、禁止ではない。	have(抱えている)＋to do(するべきこと)。するべきことを抱えていることから「〜しなければならない」。
have yet to do	pre1	まだ〜していない	The committee has yet to announce a date.	委員会はまだ日程を発表していない。	structure	改まった表現で、否定語を使わずに「まだ〜していない」を表す（has yet to announce a date）。	have(残している)＋yet(まだ)＋to do(〜すること)。〜することをまだ残していることから「まだ〜していない」。
having said that	pre2	そうは言っても	Having said that, the plan still has value.	そうは言っても、その計画にはなお価値がある。	discourse	直前の内容を認めたうえで反対の点を述べるときに文頭に置く。that said も同じ意味。	having said(言ってしまった)＋that(そのことを)。そのことを言ったうえでということから「そうは言っても」。
help A with B	3	AのBを手伝う	Could you help me with my homework?	宿題を手伝ってくれますか。	structure	人を目的語にし、作業を with で示す（help me with my homework）。help my homework とは言わない。	help(手伝う)＋A(人)＋with B(Bについて)。with が手伝う作業を示し、「AのBを手伝う」。
help oneself to	pre1	〜を自由に取る	Please help yourself to some fruit.	果物を自由に取ってください。	idiom	食べ物や飲み物を勧めるときに使う（Please help yourself to some fruit.）。oneself を主語に合わせる。	help(取ってあげる)＋oneself(自分自身に)＋to(〜を)。自分で自分に〜を取ってあげることから「〜を自由に取る」。
Here is ~ .	4	ここに〜があります	Here is your ticket.	こちらがあなたの切符です。	conversation	複数なら Here are ~.。物を渡すときの Here you are. と近い。	here(ここに)＋is ~(〜がある)。相手に物を示して、ここに〜があると言うことから「ここに〜があります」。
Here we are.	pre1	さあ着きました・これです	Here we are. This is the museum.	さあ着きました。ここが博物館です。	conversation	到着したときや、探し物が見つかったときに使う。	here(ここに)＋we are(私たちがいる)。目的の場所に私たちが来ていることから「さあ着きました」、探していた物を見つけて「これです」。
hit it off with	pre1	〜とすぐ気が合う	I hit it off with my new neighbor.	私は新しい隣人とすぐ気が合った。	idiom	くだけた表現で、初対面ですぐ仲良くなることを表す。2人を主語にして They hit it off. とも言う。	hit it off(うまくかみ合う)＋with(〜と)。出会ってすぐ互いの気持ちがうまくかみ合うことから「〜とすぐ気が合う」。
hit on	pre2	〜を思いつく	We finally hit on a practical solution.	私たちはついに実用的な解決策を思いついた。	phrasal-verb	on の後ろに案・方法を置く（hit on a practical solution）。hit upon も同じ意味。	hit(ぶつかる)＋on(〜に行き当たって)。考えがふと〜に行き当たることから「〜を思いつく」。
hold ~ in check	pre1	〜を抑える	The barrier held the floodwater in check.	その堤防は洪水を抑えた。	structure	~ に感情・物価・病気・水などを置く。keep ~ in check も同じ意味。	hold(押さえておく)＋~＋in check(抑えられた状態に)。check はチェスの「王手」から「動きを抑えること」の意味になり、その状態に押さえておくことから「〜を抑える」。
hold one's breath	pre2	息を止める	We held our breath as the result appeared.	結果が表示された時、私たちは息を止めた。	idiom	one's は主語に合わせる。緊張や期待で結果を待つ場面によく使う。	hold(保つ)＋one's breath(自分の息)。息を吸ったまま止めておくことから「息を止める」。
hold true	1	当てはまる・有効である	The same principle holds true here.	同じ原則がここでも当てはまる。	idiom	規則・原則・説明が別の場合にも成り立つことを表す（The same principle holds true here.）。	hold(持ちこたえる)＋true(本当のまま)。本当であるまま持ちこたえることから「当てはまる・有効である」。
hold up	2	〜を遅らせる・持ちこたえる	Heavy traffic held us up.	激しい渋滞で私たちは遅れた。	phrasal-verb	受け身 be held up で「足止めされる」。名詞 holdup は「遅れ・強盗」。	hold(押さえる)＋up(止めて)。進むものを押さえて止めることから「〜を遅らせる」、倒れずに上に保つことから「持ちこたえる」。
How about ~ ?	4	〜はどうですか	How about lunch at noon?	正午に昼食はどうですか。	conversation	後ろは名詞・動名詞（How about going out?）。提案や勧誘に使う。	how(どう)＋about ~(〜について)。〜についてどう思うかとたずねることから「〜はどうですか」。
How are you?	4	お元気ですか	Hi, Mina. How are you?	こんにちは、ミナ。元気ですか。	conversation	あいさつとして使い、答えは Fine, thank you. / I'm good. など。	how(どのように)＋are you(あなたはある)。あなたはどんな状態かとたずねることから「お元気ですか」。
How come ~ ?	pre1	どうして〜なの	How come you know my name?	どうして私の名前を知っているの。	conversation	くだけた表現で、後ろは主語＋動詞の語順のまま（How come you know my name?）。	how(どのように)＋come(〜ということになる)。How did it come about that ~?（どのようにして〜ということになったのか）を短くした形で「どうして〜なの」。
How long ~ ?	4	どのくらい長く・どのくらいの期間	How long did the trip take?	その旅行にはどのくらい時間がかかりましたか。	conversation	時間の長さのほか、物の長さもたずねる。回数は How often ~?。	how(どれくらい)＋long(長く)。どれくらい長い時間かをたずねることから「どのくらい長く・どのくらいの期間」。
`

export const CURRICULUM_1900_PHRASES_D_H = Object.freeze(
  parseCurriculum1900PhraseRows(ROWS),
)
