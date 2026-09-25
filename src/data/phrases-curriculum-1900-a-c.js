import { parseCurriculum1900PhraseRows } from './curriculum-phrase-utils.js'

// 正規形の英字順。
const ROWS = String.raw`
a ~ amount of	4	ある量の	A small amount of salt is enough.	少量の塩で十分です。	structure	amount は数えられない名詞に使う（a large amount of water）。数えられる名詞には a large number of を使う。	a(ひとつの)＋~(量の大小を表す形容詞)＋amount(量)＋of(〜の)。amount の前に small・large などを入れて、どれくらいの量かを表す。
A as well as B	pre2	BだけでなくAも	Maya as well as Ken joined the team.	ケンだけでなくマヤもチームに加わった。	structure	主語になるときは動詞をAに合わせる（Maya as well as her friends is coming.）。not only B but also A と語順が逆になる。	as well as(〜と同じようによく)。Bと同じようにAもということから「BだけでなくAも」で、言いたい中心はA。
a case in point	pre1	その好例	This village is a case in point.	この村がその好例だ。	idiom	直前に述べた主張の具体例として出す。This is a case in point. の形でよく使う。	a case(事例)＋in point(話題の点に当てはまる)。話題の点にぴたりと当てはまる事例ということから「その好例」。
a couple of	3	2、3の・数個の	I need a couple of minutes.	2、3分必要です。	collocation	後ろは数えられる名詞の複数形（a couple of days）。正確に2つと言うなら two を使う。	a couple(2つ一組)＋of(〜の)。2つ一組の意味から、厳密に2つとは限らない「2、3の・数個の」。
a handful of	pre1	一握りの・少数の	Only a handful of seats remain.	席はほんのわずかしか残っていない。	idiom	後ろは数えられる名詞の複数形が多い（a handful of people）。「わずかしかない」という少なさを強調する。	a handful(片手に一杯の量)＋of(〜の)。片手でつかめるほどの量ということから「一握りの・少数の」。
a host of	pre1	多数の	The plan created a host of problems.	その計画は多くの問題を生んだ。	idiom	後ろは複数名詞（a host of problems）。問題・理由・問いなど、いろいろな種類が次々にあることを表す。	a host(大勢の群れ)＋of(〜の)。host はもと「軍勢」の意味で、軍勢のように数が多いことから「多数の」。
A is one thing; B is another	pre1	AとBは別問題だ	Knowing the rule is one thing; using it is another.	規則を知ることと使えることは別問題だ。	structure	AとBには動名詞や名詞を置く（Knowing the rule is one thing; using it is another.）。another の後ろの thing は省く。	one thing(一つの事柄)と another(別の事柄)を並べ、AとBがそれぞれ別の事柄だと示すことから「AとBは別問題だ」。
A is to B what C is to D	pre1	AのBに対する関係はCのDに対する関係と同じだ	Reading is to the mind what exercise is to the body.	読書の心に対する関係は運動の体に対する関係と同じだ。	structure	身近な関係（CとD）を使って、分かりにくい関係（AとB）を説明するたとえの型。what の後ろの動詞は C に合わせる。	what C is to D(CがDに対してであるもの)をAとBの関係に当てはめる形。「AのBに対する関係は、CのDに対する関係と同じだ」とたとえる。
a lot	4	とても・たくさん	We learned a lot today.	私たちは今日たくさん学んだ。	collocation	副詞として動詞の後ろに置く（learn a lot）。名詞の前では a lot of にする。	a lot(ひと山・大量)。lot はもと「くじで分けた分け前」の意味で、そこから「ひと山」、さらに「たくさん」になった。
a white elephant	pre1	持て余す高価な物	The empty stadium became a white elephant.	その使われていない競技場は金食い虫になった。	idiom	費用ばかりかかって役に立たない建物・計画などに使う（The stadium became a white elephant.）。	white elephant(白い象)。昔のシャム(タイ)で、王が世話に大金のかかる白い象を家来に贈って困らせたという言い伝えから「持て余す高価な物」。
abound in	pre2	〜が豊富にある	These woods abound in wildlife.	この森には野生動物が豊富にいる。	preposition	主語は場所（These woods abound in wildlife.）。物を主語にするなら Wildlife abounds in these woods. と言う。	abound(あふれるほどある)＋in(〜で)。abound は ab(あふれ出て)＋ound(波打つ)で、波があふれるように多くあることから「〜が豊富にある」。
adjust A to B	pre2	AをBに合わせる	Adjust the seat to your height.	座席を自分の身長に合わせなさい。	structure	物を合わせるときは adjust A to B。自分が環境に慣れるなら adjust to B / adjust oneself to B。	adjust(合わせて整える)＋A＋to B(Bに)。AをBにちょうど合うように整えることから「AをBに合わせる」。
admit to	2	〜を認める	He admitted to making the mistake.	彼はその誤りを犯したと認めた。	preposition	to は前置詞なので後ろは名詞・動名詞（admit to making the mistake）。admit making / admit that節 とも言える。	admit(認める)＋to(〜について)。自分のよくない行いについて認めることから「〜を認める」。
after a while	4	しばらくして	After a while, the rain stopped.	しばらくして雨がやんだ。	discourse	話の流れの中で時間の経過を示し、文頭によく置く。for a while は「しばらくの間」で意味が違う。	after(〜の後で)＋a while(少しの時間)。少しの時間がたった後でということから「しばらくして」。
agree to	pre2	〜に同意する	They agreed to the new terms.	彼らは新しい条件に同意した。	preposition	to の後ろは提案・条件（agree to the terms）か動詞の原形（agree to help）。人に同意するなら agree with。	agree(同意する)＋to(〜に向けて)。提案や条件に向けて賛成を示すことから「〜に同意する」。
ahead of	pre2	〜より前に・〜の先に	We arrived ahead of schedule.	私たちは予定より早く着いた。	preposition	時間にも場所にも使う（ahead of schedule / ahead of us）。ahead of time は「前もって」。	ahead(前方に)＋of(〜の)。〜より前方にあることから「〜の先に」、時間で前にあることから「〜より前に」。
all manner of	1	あらゆる種類の	The shop sells all manner of tools.	その店はあらゆる種類の道具を売っている。	collocation	改まった表現で、後ろは複数名詞や数えられない名詞（all manner of tools）。manner は複数形にしない。	all(あらゆる)＋manner(種類)＋of(〜の)。manner をここでは「種類」の意味で使い、「あらゆる種類の」。
all of a sudden	pre2	突然	All of a sudden, the lights went out.	突然、明かりが消えた。	discourse	suddenly と同じ意味で、文頭によく置く。会話的で、驚いた気持ちを強く出す。	all(まったく)＋of a sudden(突然に)。sudden を名詞のように使った古い形 of a sudden を all で強めて「突然」。
all on one's own	1	まったく一人で	She built the website all on her own.	彼女はまったく一人でそのサイトを作った。	idiom	one's は主語に合わせて変える（She did it all on her own.）。by oneself とほぼ同じ意味。	all(まったく)＋on one's own(自分自身の力で)。on one's own を all で強めて「まったく一人で」。
All one has to do is (to) do	2	〜しさえすればよい	All you have to do is press this button.	このボタンを押しさえすればよい。	structure	is の後ろの to は省くことが多い（All you have to do is press this button.）。one を you・we などに変える。	all(すべて)＋one has to do(しなければならないこと)＋is to do(〜することだ)。しなければならないことの全部が〜だけということから「〜しさえすればよい」。
all over the world	3	世界中で	The song is known all over the world.	その歌は世界中で知られている。	preposition	around the world / throughout the world も同じ意味。all over の前に in を付けない。	all over(〜の一面に)＋the world(世界)。世界の上一面にということから「世界中で」。
All right.	4	わかりました・大丈夫です	All right. I'll help you.	わかりました。手伝います。	conversation	依頼への返事や、相手の様子をたずねる Are you all right? で使う。alright とつづるのはくだけた書き方。	all(まったく)＋right(正しい・よい)。すべてよい状態だということから、了解の「わかりました」、無事の「大丈夫です」。
all the same	pre2	それでも・まったく同じ	It was difficult, but I tried all the same.	難しかったが、それでも私は挑戦した。	discourse	逆接の意味では文末によく置く（I tried all the same.）。「どちらでも同じ」なら It's all the same to me.。	all(まったく)＋the same(同じ)。事情があっても結果はまったく同じだということから「それでも」。
all the way	pre2	はるばる・ずっと	We walked all the way home.	私たちは家までずっと歩いた。	idiom	副詞として使うので、home の前に to を付けない（walk all the way home）。「完全に」の意味でも使う。	all(全部の)＋the way(道のり)。道のりの全部をということから「はるばる・ずっと」。
all the 比較級	pre1	それだけいっそう〜	I like her all the better for her honesty.	正直なので私は彼女がいっそう好きだ。	structure	理由を for 名詞 / because 節 で添える（all the better for her honesty）。the を落とさない。	all(まさに)＋the(その分だけ)＋比較級。the が「その理由の分だけ」を表し、「それだけいっそう〜」。
all too	pre1	あまりにも	The risk is all too real.	その危険はあまりにも現実的だ。	idiom	好ましくないことに使う（all too real / all too often）。後ろには形容詞・副詞を置く。	all(まったく)＋too(〜すぎる)。too を all で強めて「あまりにも」。
along with	2	〜と一緒に・〜に加えて	The guide came along with two students.	案内役は2人の生徒と一緒に来た。	preposition	主語に付いても、動詞は前の主語に合わせる（The guide, along with two students, was late.）。	along(一緒に進んで)＋with(〜と)。〜と連れ立って進むことから「〜と一緒に」、ほかに付け加えることから「〜に加えて」。
and ~ at that	pre2	しかも〜で	The task was hard, and urgent at that.	その仕事は難しく、しかも緊急だった。	discourse	付け足す点は形容詞や名詞で短く置く（hard, and urgent at that）。at that は文末に置く。	and(そして)＋~(付け足す点)＋at that(そのうえ)。前の内容にもう一つの点を付け足して「しかも〜で」。
and so on	pre2	〜など	We bought paper, pens, folders, and so on.	私たちは紙、ペン、フォルダーなどを買った。	discourse	例を2つ以上並べた後に置く。書き言葉では etc. とも書く。	and(そして)＋so on(そのように先へ)。同じような例がそのまま先へ続くことから「〜など」。
and yet	pre2	それなのに	The path was steep, and yet nobody complained.	道は険しかった。それなのに誰も不平を言わなかった。	discourse	意外な対比を強く示す。but だけより、驚きや納得のいかなさが出る。	and(そして)＋yet(それでも)。前の内容を受けて、それでも逆の結果になることを強めて「それなのに」。
apply to	pre2	〜に当てはまる・〜に申し込む	This rule applies to every member.	この規則は全会員に当てはまる。	preposition	「申し込む」では、申し込む先を to、ほしいものを for で示す（apply to the college for a scholarship）。	apply(当てる)＋to(〜に)。規則を〜に当てることから「〜に当てはまる」、自分の願いを相手に当てることから「〜に申し込む」。
around the corner	2	すぐ近くに・間近に	Spring is just around the corner.	春はもうすぐそこだ。	idiom	季節や行事が近いことによく使う（Spring is just around the corner.）。just を付けて近さを強める。	around(〜を回った所に)＋the corner(角)。角を曲がればすぐそこにあることから「すぐ近くに」、時期がすぐそこに来ていることから「間近に」。
as ~ as any	2	どれにも劣らず〜	This route is as safe as any.	この道はどの道にも劣らず安全だ。	structure	any の後ろに名詞を置くこともある（as safe as any route）。最上級に近い高い評価を表す。	as ~ as(〜と同じくらい)＋any(どれでも)。どれと比べても同じくらい〜だということから「どれにも劣らず〜」。
as ~ go	2	〜としては	As laptops go, this one is light.	ノートパソコンとしては、これは軽い。	structure	~ には複数名詞を置く（As laptops go, this one is light.）。その種類の基準で見た評価に使う。	as(〜のように)＋~(複数名詞)＋go(ふつうにあるさまで)。世の中の〜がふつうそうであるのと比べると、ということから「〜としては」。
as a matter of course	pre2	当然のこととして	We checked the brakes as a matter of course.	私たちは当然のこととしてブレーキを点検した。	idiom	習慣や手順として毎回することに使う（check the brakes as a matter of course）。	as(〜として)＋a matter of course(決まった進み方の事柄)。course(決まった進み方)どおりの事柄としてということから「当然のこととして」。
as a result of	3	〜の結果として	The game was canceled as a result of the storm.	嵐のため試合は中止になった。	preposition	of の後ろは名詞（as a result of the storm）。前の文全体を受けるなら As a result, で文を始める。	as(〜として)＋a result(結果)＋of(〜の)。〜から生じた結果としてということから「〜の結果として」。
as a rule	pre2	概して・原則として	As a rule, this library closes at six.	原則として、この図書館は6時に閉まる。	discourse	習慣やふつうの傾向を言い、例外があることを含む。文頭によく置く。	as(〜として)＋a rule(決まり)。いつもの決まりとしてということから「概して・原則として」。
as far as ~ be concerned	2	〜に関する限り	As far as safety is concerned, the plan is sound.	安全に関する限り、その計画は妥当だ。	structure	~ に話題を置き、be は主語と時制に合わせる（As far as safety is concerned）。「私の知る限り」は as far as I know。	as far as(〜の範囲までは)＋~ be concerned(〜がかかわる)。〜がかかわる範囲に限って言えばということから「〜に関する限り」。
as good as	2	ほとんど〜も同然で	The old machine is as good as useless.	その古い機械は役に立たないも同然だ。	idiom	後ろに形容詞・過去分詞を置く（as good as useless / as good as finished）。まだ完全ではないことを含む。	as good as(〜と同じくらいよい)。〜と同じだと見てよいほどということから「ほとんど〜も同然で」。
as if	pre2	まるで〜のように	He talks as if he knew everything.	彼はまるですべて知っているかのように話す。	structure	事実と違うことを言うときは節の動詞を過去形にする（talks as if he knew）。as though も同じ意味。	as(〜のように)＋if(もし〜なら)。もし〜であるかのようにということから「まるで〜のように」。
as is often the case with	2	〜にはよくあることだが	As is often the case with beginners, I rushed.	初心者にはよくあることだが、私は焦った。	structure	as が後ろの主節の内容全体を受ける。主節の前に置くことが多い。	as(〜のように)＋is often the case(よくある事例である)＋with(〜について)。〜についてよくある事例のようにということから「〜にはよくあることだが」。
as it is	2	実際のところ・現状のままで	Leave the design as it is.	そのデザインを今のままにしておきなさい。	idiom	文末では「今のままで」（leave it as it is）、文頭では仮定と対比して「実際は」。複数なら as they are。	as(〜のとおり)＋it is(それが今ある)。今あるとおりにということから「現状のままで」、思っていたこととは違う現実はということから「実際のところ」。
as it were	2	いわば	The brain is, as it were, a control center.	脳はいわば制御センターだ。	discourse	たとえの語の前後に挟んで使う（The brain is, as it were, a control center.）。so to speak と同じ意味。	as(〜のように)＋it were(それがそうであるとすれば)。仮定の were を使い、そういう言い方をしてみればということから「いわば」。
as many as	2	〜もの多数	As many as eighty people attended.	80人もの人が出席した。	structure	後ろに数詞を置き、数えられる名詞に使う（as many as eighty people）。量なら as much as。	as many as(〜と同じ数だけ)。数字と同じだけ多くということから、その数の多さを強調して「〜もの多数」。
as of	pre1	〜現在で・〜以降	As of Monday, the rule will change.	月曜日以降、その規則は変わる。	preposition	後ろは日付・曜日・時刻（as of Monday）。as of now / as of today の形も使う。	as(〜として)＋of(〜の時点の)。〜の時点のものとしてということから「〜現在で」、その時点から始まるものとして「〜以降」。
as such	pre1	そういうものとして・それ自体では	The room is not a lab as such.	その部屋は厳密には研究室ではない。	idiom	否定文では「厳密には〜ではない」（not a lab as such）。such は前に出た名詞を指す。	as(〜として)＋such(そのようなもの)。そのようなものとしてということから「そういうものとして」、否定文で「厳密な意味では・それ自体では」。
aside from	pre2	〜は別として・〜に加えて	Aside from one typo, the report is clear.	誤字が一つある点を除けば、報告書は明快だ。	preposition	apart from と同じく「除いて」と「加えて」の両方になる。どちらの意味かは文脈で判断する。	aside(わきに)＋from(〜から離して)。〜をわきにどけておくことから「〜は別として」、わきに置いたものに加えて「〜に加えて」。
ask ~ a favor	pre2	〜に頼み事をする	May I ask you a favor?	あなたにお願いをしてもいいですか。	collocation	相手を直接目的語にする（ask you a favor）。ask a favor of you の形もある。do me a favor は「頼みを聞く」。	ask(頼む)＋~(相手)＋a favor(好意による手助け)。相手に好意の手助けを一つ求めることから「〜に頼み事をする」。
assure A of B	2	AにBを保証する	I assured her of our support.	私は彼女に私たちの支援を保証した。	structure	A は人（assure her of our support）。assure A that節 の形も使う。ensure は「物事を確実にする」で目的語が違う。	assure(請け合う)＋A＋of B(Bについて)。as(〜に)＋sure(確かな)で、Aに対してBが確かだと請け合うことから「AにBを保証する」。
at ~'s convenience	pre1	〜の都合のよい時に	Reply at your convenience.	ご都合のよい時に返信してください。	preposition	丁寧な依頼でよく使う（Reply at your convenience.）。at your earliest convenience は「ご都合がつきしだい」。	at(〜の時に)＋~'s convenience(〜にとっての都合のよさ)。相手にとって都合のよい時にということから「〜の都合のよい時に」。
at ~'s disposal	1	〜が自由に使える	You have several tools at your disposal.	自由に使える道具がいくつかある。	preposition	主語は使えるもの（Several tools are at your disposal.）か、have A at one's disposal の形で使う。	at(〜の状態に)＋~'s disposal(〜が思いどおりに扱えること)。〜が好きなように使える状態に置かれていることから「〜が自由に使える」。
at a distance	pre2	少し離れて	Please keep the animals at a distance.	動物から距離を置いてください。	preposition	keep A at a distance で「Aを遠ざけておく」。from a distance は「遠くから」。	at(〜の位置に)＋a distance(ある距離)。ある程度の距離をおいた位置にということから「少し離れて」。
at a time	pre2	一度に	Take one tablet at a time.	一度に1錠飲みなさい。	preposition	数と一緒に使う（one at a time / two at a time）。at one time は「かつて」なので区別する。	at(〜の時に)＋a time(一回)。一回につきということから「一度に」。
at all	pre2	少しでも・いったい	If you have any questions at all, please ask.	少しでも質問があれば聞いてください。	idiom	否定文で not ... at all「まったく〜ない」、疑問文・if 節で「少しでも」。	at(〜の点で)＋all(すべて)。どんな点をとってもということから、否定文で「まったく〜ない」、疑問文で「少しでも」。
at ease	2	くつろいで	Her smile put us at ease.	彼女の笑顔で私たちは安心した。	idiom	put A at ease で「Aを安心させる」。反対は ill at ease「落ち着かない」。	at(〜の状態で)＋ease(気楽さ)。気持ちが楽な状態にあることから「くつろいで」。
at first hand	pre1	直接に	I heard the story at first hand.	私はその話を直接聞いた。	idiom	経験・情報を人から聞くのでなく自分で得ること。形容詞は firsthand（firsthand experience）。	at(〜で)＋first hand(最初の手)。人の手を経ず、最初の手から直接受け取ることから「直接に」。
at heart	2	本質的には・心の底では	He is a teacher at heart.	彼は根っからの教師だ。	idiom	外からの見え方と対比して、本当の性質を言う（He is a teacher at heart.）。	at(〜の所で)＋heart(心・中心)。外見でなく心の中心ではということから「本質的には・心の底では」。
at intervals	2	時々・間隔を置いて	Bells rang at intervals.	鐘が間隔を置いて鳴った。	preposition	at regular intervals で「一定の間隔で」。at intervals of ten minutes のように間隔の長さも示せる。	at(〜で)＋intervals(間隔)。interval は inter(間の)＋val(とりで)で、とりでととりでの間のすき間から「間隔」。間隔を置いてくり返すことから「時々」。
at issue	1	問題となっている	The policy at issue affects every school.	問題となっている政策は全校に影響する。	idiom	名詞の後ろに置く（the policy at issue）。「それは論点ではない」は That is not at issue.。	at(〜の状態で)＋issue(争点)。議論の争点になっている状態から「問題となっている」。
at large	2	全体として・逃走中で	The suspect is still at large.	容疑者はまだ逃走中だ。	idiom	「全体として」は名詞の後ろに置く（society at large）。「逃走中」は犯人などを主語にする。	at(〜の状態で)＋large(広い・自由な)。広い所に自由にいることから「逃走中で」、広く全体を見ることから「全体として」。
at short notice	pre1	急な知らせで	Thank you for coming at short notice.	急なお願いなのに来てくれてありがとう。	idiom	急な依頼に応じてくれたことへの感謝によく使う。米国では on short notice も使う。	at(〜で)＋short notice(短い予告)。前もって知らせる期間が短いことから「急な知らせで」。
at that time	4	その時	I lived in Osaka at that time.	私はその時大阪に住んでいた。	preposition	過去の文でよく使う。then と同じ意味で、文頭にも文末にも置ける。	at(〜の時点で)＋that time(その時)。話に出たその時点でということから「その時」。
at the mercy of	2	〜のなすがままで	The boat was at the mercy of the waves.	その船は波のなすがままだった。	idiom	嵐・波・天候・強い相手など、逆らえない力を of の後ろに置く。	at(〜の状態で)＋the mercy(慈悲)＋of(〜の)。〜の慈悲次第でしか助からない状態にあることから「〜のなすがままで」。
at the moment	2	今のところ・今	She is busy at the moment.	彼女は今忙しい。	preposition	現在の状態を言う文で使う。過去の話で「その時」なら at that moment。	at(〜の時点で)＋the moment(この瞬間)。今この瞬間の時点でということから「今のところ・今」。
at the sight of	2	〜を見て	The child smiled at the sight of the puppy.	その子は子犬を見て笑顔になった。	preposition	見た瞬間の感情や反応を表す（smiled at the sight of the puppy）。	at(〜をきっかけに)＋the sight(見ること)＋of(〜を)。〜を目にしたことをきっかけにということから「〜を見て」。
at the wheel	pre2	運転して	Do not use a phone at the wheel.	運転中に電話を使ってはいけない。	idiom	車・船の運転中を表す（fall asleep at the wheel）。behind the wheel も同じ意味。	at(〜の所に)＋the wheel(ハンドル)。ハンドルの所に座っていることから「運転して」。
at will	2	自由に・思いのままに	Users can change the font at will.	利用者は自由に字体を変えられる。	idiom	制限なく好きな時に好きなようにできることを表す（change the font at will）。	at(〜のままに)＋will(意志)。自分の意志のままにということから「自由に・思いのままに」。
at work	2	仕事中で・作用して	Several forces are at work here.	ここではいくつかの力が作用している。	idiom	人なら「職場で・仕事中」、力や要因なら「働いている」（Several forces are at work here.）。	at(〜の状態で)＋work(仕事・働き)。仕事をしている状態から「仕事中で」、力が働いている状態から「作用して」。
attach A to B	2	AをBに取り付ける	Attach the label to the box.	ラベルを箱に付けなさい。	structure	メールにファイルを添付するときも attach A to B。attach importance to は「〜を重視する」。	attach(くっつける)＋A＋to B(Bに)。AをBにくっつけることから「AをBに取り付ける」。
attend to	pre1	〜に対処する・世話をする	A nurse attended to the injured runner.	看護師が負傷した走者を手当てした。	preposition	attend 場所 は「出席する」で to を付けない。attend to は仕事・客・けが人などに対応する意味。	attend(心を向ける)＋to(〜に)。at(〜に)＋tend(伸ばす)で、〜に心を伸ばして向けることから「〜に対処する・世話をする」。
back and forth	2	行ったり来たり	The pendulum moved back and forth.	振り子が行ったり来たりした。	idiom	動きや、やりとりのくり返しに使う（move back and forth / emails going back and forth）。	back(後ろへ)＋and＋forth(前へ)。後ろへ行って前へ行くことをくり返すことから「行ったり来たり」。
be about to do	pre2	まさに〜しようとしている	The train is about to leave.	列車はまさに出発しようとしている。	structure	すぐ先の未来を言うので、tomorrow などの時を表す語とは一緒に使わない。	about(〜のすぐ近くに)＋to do(〜すること)。〜することのすぐ手前にいることから「まさに〜しようとしている」。
be abundant in	2	〜が豊富である	The region is abundant in clean water.	その地域はきれいな水が豊富だ。	preposition	主語は場所・地域（The region is abundant in clean water.）。rich in とほぼ同じ意味。	abundant(あふれるほどある)＋in(〜の点で)。abound(あふれる)と同じ語源で、〜の点であふれるほど豊かなことから「〜が豊富である」。
be accustomed to	2	〜に慣れている	I am accustomed to working early.	私は朝早くから働くことに慣れている。	preposition	to は前置詞なので、後ろには名詞または動名詞を置く。	accustomed(慣れた)＋to(〜に)。custom(習慣)と同じ語源で、〜が習慣になっていることから「〜に慣れている」。
be acquainted with	2	〜を知っている・〜と面識がある	She is acquainted with the local history.	彼女は地元の歴史をよく知っている。	preposition	人との面識にも知識にも使う。get acquainted with で「〜と知り合いになる」。	acquainted(知り合いの)＋with(〜と)。〜と顔見知りになっていることから「〜と面識がある」、物事と親しんでいることから「〜を知っている」。
be all ears	pre1	ぜひ聞きたい・熱心に耳を傾けている	Tell me your idea; I'm all ears.	君の案を話して。ぜひ聞きたい。	idiom	会話で、相手の話を聞く準備ができていることを伝える（I'm all ears.）。	all(全部)＋ears(耳)。体じゅうが耳になったように聞くことから「熱心に耳を傾けている」。
be all the rage	pre1	大流行している	Reusable bottles are all the rage now.	今は再利用ボトルが大流行している。	idiom	一時的な流行に使う（are all the rage now）。くだけた表現。	all(まったく)＋the rage(熱狂)。rage(激しい怒り・熱狂)から、世の中が熱狂するほど流行していることから「大流行している」。
be anxious to do	2	ぜひ〜したい	We are anxious to hear the result.	私たちはぜひ結果を聞きたい。	structure	be anxious about は「〜を心配している」で意味が違う。to do が続くと強い願いを表す。	anxious(気がかりで落ち着かない)＋to do(〜することを)。〜したくて落ち着かない気持ちから「ぜひ〜したい」。
be apt to do	2	〜しがちである	People are apt to forget small details.	人は細部を忘れがちだ。	structure	好ましくない傾向によく使う。性質としてそうなりやすいという含みがある。	apt(向きやすい)＋to do(〜する方へ)。〜する方へ向きやすいことから「〜しがちである」。
be beside oneself with	pre1	〜で我を忘れている	He was beside himself with joy.	彼は喜びで我を忘れていた。	idiom	with の後ろに強い感情を置く（beside himself with joy / anger）。oneself は主語に合わせる。	beside(〜のわきに)＋oneself(自分自身)＋with(〜のせいで)。感情のせいで心が自分自身のわきへはみ出していることから「〜で我を忘れている」。
be born	4	生まれる	My sister was born in May.	妹は5月に生まれた。	collocation	過去の出来事なので was / were born にする。場所は in、日付は on、年・月は in で示す。	bear(産む)の過去分詞 born を使った受け身。母親に産み出されることから「生まれる」。
be bound to do	2	きっと〜する	Careful practice is bound to help.	丁寧な練習はきっと役に立つ。	structure	話し手の強い確信を表す。be bound for は「〜行きである」で、もとが別の語。	bound(縛られた)＋to do(〜することに)。bind(縛る)の過去分詞で、〜するように縛られていることから「きっと〜する」。
be busy with	2	〜で忙しい	She is busy with her science project.	彼女は科学の課題で忙しい。	preposition	with の後ろは名詞。動作なら be busy doing（be busy preparing）。	busy(忙しい)＋with(〜を抱えて)。〜を抱えて手がふさがっていることから「〜で忙しい」。
be careful with	3	〜の扱いに注意する	Be careful with that glass.	そのグラスの扱いに気を付けて。	preposition	物やお金の扱いに使う（Be careful with that glass.）。行為や判断に注意するなら be careful about。	careful(注意深い)＋with(〜を扱うときに)。〜を扱うときに注意深くあることから「〜の扱いに注意する」。
be considerate of	2	〜に思いやりがある	Please be considerate of other passengers.	ほかの乗客に配慮してください。	preposition	considerable(かなりの)とつづりが似ているので区別する。be considerate to 人 も使う。	considerate(思いやりのある)＋of(〜について)。consider(よく考える)から来た語で、相手の立場をよく考えることから「〜に思いやりがある」。
be content with	2	〜に満足している	He is content with the simple plan.	彼はその簡単な計画に満足している。	preposition	今あるもので十分だと受け入れる気持ち。be content to do の形もある。	content(満ち足りた)＋with(〜に)。contain(含む)と同じ語源で、今あるもので心が満ちていることから「〜に満足している」。
be convinced of	2	〜を確信している	I am convinced of her honesty.	私は彼女が正直だと確信している。	preposition	of の後ろは名詞（convinced of her honesty）。節なら be convinced that。	convinced(納得させられた)＋of(〜について)。convince(納得させる)の受け身で、〜について納得しきっていることから「〜を確信している」。
be curious about	pre2	〜に好奇心がある	The students are curious about space.	生徒たちは宇宙に好奇心を持っている。	preposition	be curious to do で「〜したがる」。物を主語にすると「奇妙な」の意味になる（a curious sound）。	curious(知りたがる)＋about(〜について)。about が知りたい対象を示し、「〜に好奇心がある」。
be cut out to be	pre1	〜に向いている	She is cut out to be a leader.	彼女は指導者に向いている。	idiom	否定文でよく使う（I'm not cut out to be a teacher.）。be cut out for 名詞 の形もある。	cut out(型に合わせて切り抜かれた)＋to be(〜になるように)。〜になるように型どおりに切り抜かれていることから「〜に向いている」。
be dedicated to	pre1	〜に打ち込んでいる	The team is dedicated to improving access.	そのチームは利用しやすさの改善に打ち込んでいる。	preposition	to は前置詞なので後ろは名詞・動名詞（dedicated to improving access）。	dedicated(ささげた)＋to(〜に)。de(すっかり)＋dicate(宣言する)で、〜に身をささげると宣言していることから「〜に打ち込んでいる」。
be due to	2	〜する予定である	The bus is due to arrive at noon.	バスは正午に到着する予定だ。	structure	原因の due to + 名詞とは区別する。	due(予定された)＋to do(〜することが)。前もって決まった予定として〜することになっていることから「〜する予定である」。
be eligible for	pre1	〜の資格がある	All members are eligible for the award.	全会員にその賞の資格がある。	preposition	for の後ろは賞・制度・職など。行為なら be eligible to do（eligible to vote）。	eligible(選ばれうる)＋for(〜に)。elect(選ぶ)と同じ語源で、〜に選ばれる条件を満たしていることから「〜の資格がある」。
be equal to	2	〜に等しい・〜に耐えられる	One meter is equal to one hundred centimeters.	1メートルは100センチメートルに等しい。	preposition	数量が等しい意味と、仕事・課題をこなす力がある意味（equal to the task）がある。	equal(等しい)＋to(〜に)。〜と等しいことから「〜に等しい」、課題の大きさに力が等しいことから「〜に耐えられる」。
be equipped with	2	〜を備えている	The room is equipped with two screens.	その部屋には画面が2台備わっている。	preposition	主語は部屋・車・人など。with の後ろに設備・装置・能力を置く。	equipped(装備された)＋with(〜を持って)。equip(装備させる)の受け身で、〜を持たされていることから「〜を備えている」。
be familiar to	4	〜によく知られている	That melody is familiar to many people.	その旋律は多くの人によく知られている。	preposition	人が物を知っている be familiar with と主語の関係が逆になる。	familiar(なじみのある)＋to(〜にとって)。family(家族)と同じ語源で、〜にとって家族のように身近なことから「〜によく知られている」。
be fed up with	pre1	〜にうんざりしている	We are fed up with the constant noise.	私たちは絶え間ない騒音にうんざりしている。	idiom	くだけた表現で、同じことが続いて嫌になった気持ちを表す。with の後ろは名詞・動名詞。	fed up(食べさせられすぎた)＋with(〜を)。feed(食べさせる)の過去分詞で、〜をおなかいっぱい以上に与えられたことから「〜にうんざりしている」。
be filled with	4	〜で満たされている	The hall was filled with music.	ホールは音楽で満たされていた。	preposition	感情にも使う（be filled with joy）。be full of とほぼ同じ意味。	filled(満たされた)＋with(〜で)。fill(満たす)の受け身で、with が中身を示し「〜で満たされている」。
be forced to do	2	〜せざるを得ない	We were forced to change the route.	私たちは経路を変えざるを得なかった。	structure	自分の意思ではなく、外の事情によることを表す。	forced(力で押しつけられた)＋to do(〜するように)。force(力ずくでさせる)の受け身で、事情の力で〜させられることから「〜せざるを得ない」。
be free to do	2	自由に〜してよい	You are free to ask questions.	自由に質問してよい。	structure	相手に許可を与える言い方（You are free to leave.）。be free from は「〜がない」で意味が違う。	free(自由な)＋to do(〜することが)。〜することに縛りがないことから「自由に〜してよい」。
be guilty of	2	〜の罪がある・〜をして悪い	He was found guilty of fraud.	彼は詐欺で有罪となった。	preposition	of の後ろは名詞・動名詞（guilty of fraud / guilty of lying）。反対は innocent of。	guilty(罪がある)＋of(〜について)。of が罪や過ちの中身を示し、「〜の罪がある」。
be here to stay	pre1	定着してなくならない	Online meetings are here to stay.	オンライン会議は定着してなくならないだろう。	idiom	新しい習慣や技術が一時的な流行で終わらないと言うときに使う（are here to stay）。	be here(ここにある)＋to stay(居続けるために)。ここに居続けるために来ていることから「定着してなくならない」。
be in trouble	4	困っている	Call me if you are in trouble.	困ったら私に電話して。	preposition	get into trouble で「困ったことになる」。be in trouble with 人 は「〜に叱られそうだ」。	in(〜の中に)＋trouble(困りごと)。困りごとの中にいることから「困っている」。
be indispensable to	2	〜に不可欠である	Water is indispensable to life.	水は生命に不可欠だ。	preposition	essential とほぼ同じ意味。for を使うこともある（indispensable for success）。	indispensable(なしで済ませられない)＋to(〜にとって)。in(〜ない)＋dispense(なしで済ませる)＋able で、〜にとってなしでは済まないことから「〜に不可欠である」。
be lacking in	2	〜が不足している	The proposal is lacking in detail.	その提案は具体性に欠ける。	preposition	in の後ろは性質や中身（lacking in detail / confidence）。lack は他動詞なので lack detail とも言う。	lacking(欠けている)＋in(〜の点で)。〜の点で欠けていることから「〜が不足している」。
be married to	pre2	〜と結婚している	She is married to a doctor.	彼女は医師と結婚している。	preposition	相手の前は with でなく to。「〜と結婚する」という動作は marry 人 か get married to 人。	married(結婚した)＋to(〜と結ばれて)。to が結ばれた相手を示し、「〜と結婚している」。
be no match for	pre1	〜にはかなわない	Our small boat was no match for the storm.	私たちの小舟は嵐にはかなわなかった。	idiom	主語が弱い方（Our boat was no match for the storm.）。match は「対等な相手」の意味。	no(少しも〜ない)＋match(好敵手)＋for(〜の)。〜の好敵手にまったくならないことから「〜にはかなわない」。
be out to do	pre1	〜しようと企んでいる	The group is out to change the rule.	その団体は規則を変えようとしている。	idiom	強い目的を持って動いていることを表し、悪意の含みで使うことが多い。	out(外へ乗り出して)＋to do(〜するために)。〜するつもりで外へ乗り出していることから「〜しようと企んでいる」。
be particular about	2	〜に好みがうるさい	He is particular about coffee.	彼はコーヒーにこだわりがある。	preposition	食べ物・服・道具などへのこだわりを表す。「細かすぎる」という否定的な含みにもなる。	particular(細かい点にこだわる)＋about(〜について)。〜について細部まで気にすることから「〜に好みがうるさい」。
be preferable to	2	〜より好ましい	Walking is preferable to waiting here.	ここで待つより歩く方がよい。	preposition	than ではなく to を使う。preferable に比較の意味が入っているので、ふつう more preferable とは言わない。	preferable(より好ましい)＋to(〜に比べて)。prefer A to B と同じく、比べる相手を to で示して「〜より好ましい」。
be ready to	4	〜する準備ができている	We are ready to begin.	私たちは始める準備ができている。	structure	to の後ろは動詞の原形。名詞なら be ready for（ready for school）。「進んで〜する」の意味にもなる。	ready(用意ができた)＋to do(〜することの)。〜することの用意ができていることから「〜する準備ができている」。
be sensitive to	2	〜に敏感である	Some plants are sensitive to cold.	寒さに敏感な植物もある。	preposition	「傷つきやすい」の意味もある。sensible(分別のある)と区別する。	sensitive(感じやすい)＋to(〜に対して)。sense(感覚)と同じ語源で、〜に対して感じやすいことから「〜に敏感である」。
be sure of	pre2	〜を確信している	Are you sure of the answer?	その答えに確信がありますか。	preposition	of の後ろは名詞・動名詞。be sure to do は「きっと〜する」で意味が違う。	sure(確かだと思う)＋of(〜について)。〜について確かだと思っていることから「〜を確信している」。
be susceptible to	pre1	〜の影響を受けやすい	Young trees are susceptible to frost.	若木は霜の影響を受けやすい。	preposition	病気・影響・圧力を受けやすいことを表す（susceptible to frost / disease）。	susceptible(受け入れやすい)＋to(〜を)。sus(下から)＋cept(取る)で、下から受け取ってしまいやすいことから「〜の影響を受けやすい」。
be tired from	pre2	〜で疲れている	I was tired from the long walk.	私は長い距離を歩いて疲れていた。	preposition	体の疲れの原因を言う。be tired of は「〜にうんざりしている」で意味が違う。	tired(疲れた)＋from(〜が原因で)。from が疲れの原因を示し、「〜で疲れている」。
be to blame for	2	〜の責任がある	No single person is to blame for the delay.	その遅れを一人だけの責任にはできない。	idiom	to blame は能動の形のまま「責められるべき」を表す（ふつう to be blamed とは言わない）。	be to blame(責められるべきである)＋for(〜のことで)。be to do の「〜されるべき」の意味で、〜のことで責められるべきだということから「〜の責任がある」。
be to do	2	〜することになっている	The president is to visit tomorrow.	大統領は明日訪問することになっている。	structure	公式の予定（The president is to visit tomorrow.）のほか、義務・可能・意図の意味にもなるので文脈で判断する。	be＋to do(〜する方へ向かっている)。これから〜する方へ向かっている状態から、予定・義務・運命などを表し「〜することになっている」。
be true of	pre2	〜に当てはまる	The same is true of this example.	同じことがこの例にも当てはまる。	preposition	The same is true of … の形でよく使う。be true to は「〜に忠実である」で意味が違う。	true(真実である)＋of(〜について)。〜について言っても真実であることから「〜に当てはまる」。
be true to	pre2	〜に忠実である	Stay true to your principles.	自分の信念に忠実でいなさい。	preposition	信念・約束・友人などに使う（stay true to your principles）。	true(誠実な)＋to(〜に対して)。〜に対して誠実であり続けることから「〜に忠実である」。
be used to doing	2	〜することに慣れている	She is used to speaking in public.	彼女は人前で話すことに慣れている。	structure	used to do「以前は〜した」と区別し、to の後は動名詞にする。	used(慣れた)＋to(〜に)。to は前置詞で、〜することに慣れた状態を表し「〜することに慣れている」。
be versed in	2	〜に精通している	He is versed in environmental law.	彼は環境法に精通している。	preposition	改まった表現で、well を付けて強める（well versed in law）。in の後ろは分野・技能。	versed(通じた)＋in(〜の分野に)。versed はラテン語の「慣れ親しむ」から来た語で、〜の分野に長く親しんで通じていることから「〜に精通している」。
be wary of	2	〜を警戒している	Be wary of offers that seem too easy.	うますぎる話を警戒しなさい。	preposition	of の後ろに危険な人・物・話を置く。be aware of は単に「気づいている」で、警戒の意味はない。	wary(用心深い)＋of(〜を)。aware(気づいている)と同じ語源で、危険に気づいて身構えていることから「〜を警戒している」。
be well off	pre2	裕福である・恵まれている	Her family is fairly well off.	彼女の家族はかなり裕福だ。	idiom	反対は be badly off。比較級の be better off は「〜した方がよい・前より暮らしがよい」。	well(よく)＋off(〜な暮らし向きで)。off が暮らし向きの状態を表し、よい暮らし向きにあることから「裕福である・恵まれている」。
be worth doing	pre1	〜する価値がある	This book is worth reading twice.	この本は二度読む価値がある。	structure	worth の後ろは動名詞を置く。	worth(〜の価値がある)＋doing(〜すること)。worth は前置詞のように名詞・動名詞を後ろに取り、〜するだけの価値があることから「〜する価値がある」。
be worthy of	2	〜に値する	The idea is worthy of careful study.	その考えは慎重に研究する価値がある。	preposition	of の後ろは名詞（worthy of careful study / respect）。be worth 名詞 と違って of が必要。	worthy(値する)＋of(〜に)。worth(価値)から来た語で、〜を受けるだけの価値があることから「〜に値する」。
become of	2	〜はどうなる	What became of the old station?	古い駅はどうなりましたか。	preposition	疑問詞 what を主語にして使う（What became of the old station?）。	become(〜になる)＋of(〜のことが)。〜のことがどうなったかをたずねる形から「〜はどうなる」。
before one knows it	pre2	いつの間にか	Before I knew it, the sun had set.	いつの間にか日が沈んでいた。	structure	主語と時制を合わせて変える（Before I knew it, the summer was over.）。	before(〜する前に)＋one knows it(それに気づく)。自分が気づく前にということから「いつの間にか」。
behind the times	2	時代遅れで	That rule is behind the times.	その規則は時代遅れだ。	idiom	the times は複数形で「時代」。人・考え・規則が古いと言うときに使う。	behind(〜の後ろに)＋the times(時代)。時代の流れより後ろにいることから「時代遅れで」。
believe in	pre2	〜の存在・価値を信じる	I believe in giving everyone a chance.	私は全員に機会を与えることが大切だと信じている。	preposition	believe 人 は「その人の言うことを信じる」、believe in 人 は「その人を信頼する」。	believe(信じる)＋in(〜の中に)。〜の存在や価値の中に心を置くことから「〜の存在・価値を信じる」。
believe it or not	2	信じられないかもしれないが	Believe it or not, the turtle escaped.	信じられないかもしれないが、亀が逃げた。	discourse	意外な事実を話す前の前置きとして文頭に置く。	believe it(それを信じなさい)＋or not(信じなくても)。信じても信じなくてもということから「信じられないかもしれないが」。
between you and me	pre2	ここだけの話だが	Between you and me, I prefer the first plan.	ここだけの話、私は最初の案の方が好きだ。	idiom	前置詞の後ろなので I ではなく me を使う。秘密や本音を打ち明けるときの前置き。	between(〜の間で)＋you and me(あなたと私)。あなたと私の2人の間だけの話としてということから「ここだけの話だが」。
beyond description	2	言葉では表せないほど	The view was beautiful beyond description.	その眺めは言葉で表せないほど美しかった。	idiom	形容詞の後ろに置いて程度の強さを表す（beautiful beyond description）。beyond words も同じ意味。	beyond(〜を越えて)＋description(言葉で描くこと)。言葉で描ける範囲を越えていることから「言葉では表せないほど」。
boast of	2	〜を誇りにする・〜を有する	The city boasts of a long history.	その都市は長い歴史を誇る。	preposition	boast about も同じ意味。場所が「〜を持っている」ときは of なしの boast 名詞 もよく使う（The city boasts a long history.）。	boast(自慢する)＋of(〜のことを)。〜のことを自慢することから「〜を誇りにする」、場所が自慢できるものを持っていることから「〜を有する」。
bother to do	2	わざわざ〜する	He didn't bother to reply.	彼は返事をしようともしなかった。	structure	否定文でよく使う（He didn't bother to reply.「返事をしようともしなかった」）。bother doing も同じ意味。	bother(面倒なことをする)＋to do(〜することを)。面倒を承知で〜することから「わざわざ〜する」。
bring oneself to do	pre2	〜する気になる	I could not bring myself to throw it away.	私はそれを捨てる気になれなかった。	structure	否定文でよく使い、can / could と一緒になることが多い（I could not bring myself to throw it away.）。	bring(連れて行く)＋oneself(自分自身)＋to do(〜する方へ)。気の進まない自分を〜する方へ連れて行くことから「〜する気になる」。
brush up	3	〜を磨き直す	I need to brush up my French.	私はフランス語を学び直す必要がある。	phrasal-verb	目的語を直接取る（brush up my French）。brush up on 名詞 の形もある。	brush(ブラシでこする)＋up(きれいに仕上げて)。さびを落として磨き直すことから「〜を磨き直す」。
burn down	2	全焼する・焼き尽くす	The old barn burned down overnight.	古い納屋は一晩で全焼した。	phrasal-verb	建物に使う（The barn burned down.）。burn up は「すっかり燃え尽きる」。	burn(燃える)＋down(崩れ落ちて)。建物が燃えて崩れ落ちることから「全焼する・焼き尽くす」。
burst into	2	突然〜し始める	The audience burst into laughter.	聴衆は突然笑い出した。	preposition	into の後ろは名詞（burst into tears / laughter / flames）。burst out doing も同じ意味（burst out laughing）。	burst(はじける)＋into(〜の状態の中へ)。急にはじけるように〜の状態に入ることから「突然〜し始める」。
but for	pre1	〜がなければ	But for your help, we would have failed.	君の助けがなければ、私たちは失敗していただろう。	preposition	仮定法の文で使う（But for your help, we would have failed.）。without / if it were not for と同じ意味。	but(〜を除いて)＋for(〜があること)。〜がないとすればということから「〜がなければ」。
by any chance	pre2	ひょっとして	Do you, by any chance, know her name?	ひょっとして彼女の名前を知っていますか。	idiom	疑問文で丁寧にたずねるときに挟む（Do you, by any chance, know her name?）。	by(〜によって)＋any chance(何かの偶然)。何かの偶然でということから「ひょっとして」。
by degrees	pre2	徐々に	The sky grew brighter by degrees.	空は徐々に明るくなった。	idiom	gradually と同じ意味で、少し改まった表現。	by(〜ずつ)＋degrees(段階)。degree はもと「階段の段」の意味で、一段ずつということから「徐々に」。
by far	pre1	はるかに・断然	This is by far the safest route.	これは断然最も安全な道だ。	idiom	最上級や比較級を強める（by far the safest / better by far）。	by(〜の差で)＋far(大きく)。大きな差をつけてということから「はるかに・断然」。
by hand	pre2	手で・手作業で	Each card was painted by hand.	各カードは手で描かれた。	preposition	hand に冠詞を付けない。「手渡しで」の意味にもなる（delivered by hand）。	by(〜を使って)＋hand(手)。機械ではなく手を使ってということから「手で・手作業で」。
by now	pre2	今ごろはもう	They should be home by now.	彼らは今ごろもう家にいるはずだ。	preposition	推量の should / must とよく使う（They should be home by now.）。	by(〜までに)＋now(今)。今までにはということから「今ごろはもう」。
by the time	pre2	〜する時までには	By the time we arrived, the shop had closed.	私たちが着いた時には店は閉まっていた。	structure	後ろに主語＋動詞を置く。未来のことでも節の中は現在形（By the time you arrive, …）。	by(〜までに)＋the time(〜する時)。〜する時までにはということから「〜する時までには」。
by way of	2	〜を経由して・〜として	We flew to Rome by way of Paris.	私たちはパリ経由でローマへ飛んだ。	preposition	経由地を示すほか、by way of example「例として」、by way of apology「おわびとして」の形も使う。	by(〜を通って)＋way(道)＋of(〜の)。〜の道を通ってということから「〜を経由して」、〜という形をとってということから「〜として」。
call it a day	pre2	その日の仕事を終える	We've done enough; let's call it a day.	十分やったので、今日は終わりにしよう。	idiom	作業をひと区切りにするときの会話表現（Let's call it a day.）。	call(〜と呼ぶ)＋it(今日の仕事)＋a day(1日分)。ここまでを1日分の仕事と呼ぶことから「その日の仕事を終える」。
Call me ~ .	4	私を〜と呼んでください	My name is Alexander, but call me Alex.	名前はアレクサンダーですが、アレックスと呼んでください。	conversation	自己紹介で愛称を伝えるときに使う（Call me Alex.）。call A B で「AをBと呼ぶ」。	call(呼ぶ)＋me(私を)＋~(呼び名)。私を〜という名で呼んでほしいと頼むことから「私を〜と呼んでください」。
calm down	3	落ち着く・落ち着かせる	Take a breath and calm down.	深呼吸して落ち着きなさい。	phrasal-verb	自動詞にも他動詞にも使う（calm down / calm the baby down）。怒っている相手に言うとかえって怒らせることがある。	calm(静まる)＋down(下がって)。高ぶった気持ちが静まって下がることから「落ち着く・落ち着かせる」。
can afford to do	2	〜する余裕がある	We cannot afford to waste water.	私たちには水を無駄にする余裕はない。	structure	can / cannot とセットで使う（We cannot afford to waste water.）。名詞なら can afford 名詞（can't afford a car）。	can afford(余裕がある)＋to do(〜することの)。afford はもと「成しとげる」の意味で、〜するだけのお金や時間の余裕があることから「〜する余裕がある」。
Can I ~ ?	4	〜してもいいですか	Can I open the window?	窓を開けてもいいですか。	conversation	May I ~? はより丁寧。答えは Sure. / Of course. などを使う。	can(〜できる)＋I(私が)。私が〜できるかをたずねる形で、相手の許可を求めて「〜してもいいですか」。
Can you ~ ?	4	〜してくれますか	Can you show me the map?	地図を見せてくれますか。	conversation	親しい相手への頼み方。Could you ~? にするとより丁寧になる。	can(〜できる)＋you(あなたが)。相手が〜できるかをたずねる形で、依頼を表して「〜してくれますか」。
cannot ~ too	2	いくら〜してもしすぎることはない	You cannot be too careful with fire.	火の扱いはいくら注意してもしすぎることはない。	structure	注意・感謝などを強調する（You cannot be too careful.）。too の後ろに形容詞・副詞を置く。	cannot(〜できない)＋too(〜すぎる)。〜しすぎることはありえない、つまりいくら〜しても足りないことから「いくら〜してもしすぎることはない」。
cannot help doing	2	〜せずにはいられない	I cannot help smiling at that photo.	その写真を見ると笑わずにはいられない。	structure	help の後ろは動名詞（cannot help smiling）。cannot help but do も同じ意味。	cannot help(避けられない)＋doing(〜することを)。help をここでは「避ける」の意味で使い、〜することを避けられないことから「〜せずにはいられない」。
catch ~ doing	2	〜が…しているところを見つける	I caught him reading my notes.	私は彼が私のノートを読んでいるところを見つけた。	structure	よくないことをしている場面によく使う（caught him reading my notes）。受け身は be caught doing。	catch(つかまえる)＋~(人)＋doing(〜しているところを)。〜しているところを押さえることから「〜が…しているところを見つける」。
catch sight of	2	〜を見つける	We caught sight of a whale offshore.	私たちは沖にクジラを見つけた。	idiom	一瞬見えたことを表す。反対に「見失う」は lose sight of。	catch(とらえる)＋sight(視界)＋of(〜の)。〜の姿を視界にとらえることから「〜を見つける」。
catch up	pre1	追いつく	Run faster if you want to catch up.	追いつきたいならもっと速く走りなさい。	phrasal-verb	相手を言うときは catch up with 人。catch up on は「遅れを取り戻す」。	catch(つかまえる)＋up(並ぶところまで)。前を行く相手に並ぶまで追うことから「追いつく」。
change hands	pre2	所有者が変わる	The building changed hands last year.	その建物は昨年所有者が変わった。	idiom	建物・会社・財産などを主語にする（The building changed hands.）。hands は複数形。	change(取りかえる)＋hands(持ち主の手)。持ち主の手が別の手にかわることから「所有者が変わる」。
cheer up	2	元気を出す・元気づける	Cheer up; tomorrow is another day.	元気を出して。明日があるよ。	phrasal-verb	自動詞（Cheer up!）にも他動詞（cheer her up）にも使う。	cheer(元気づける)＋up(上向きに)。気持ちを上向きに元気づけることから「元気を出す・元気づける」。
cling to	2	〜にしがみつく・固執する	The child clung to her mother's hand.	その子は母親の手にしがみついた。	preposition	過去形・過去分詞は clung。望み・考え・習慣への固執にも使う（cling to hope）。	cling(しがみつく)＋to(〜に)。〜にしがみついて離れないことから「〜にしがみつく」、考えを手放さないことから「固執する」。
close at hand	2	すぐ近くに	Keep a flashlight close at hand.	懐中電灯をすぐ手の届く所に置きなさい。	idiom	物がすぐ使える所にある、時期が迫っている、の両方に使う。	close(すぐ近くに)＋at hand(手の届く所に)。手の届くすぐ近くにあることから「すぐ近くに」。
come by	pre2	〜を手に入れる・立ち寄る	Reliable data is hard to come by.	信頼できるデータは入手しにくい。	phrasal-verb	「手に入れる」は hard to come by（手に入りにくい）の形が多い。「立ち寄る」は会話的。	come(来る)＋by(そばに)。そばにやって来ることから「立ち寄る」、物が手元のそばへ来ることから「〜を手に入れる」。
come close to doing	2	もう少しで〜するところである	The climber came close to falling.	その登山者はもう少しで落ちるところだった。	structure	to は前置詞なので後ろは動名詞（came close to falling）。実際にはしなかったことを含む。	come close(近くまで来る)＋to doing(〜することの)。〜することのすぐ近くまで来たことから「もう少しで〜するところである」。
come in handy	1	役に立つ	This small tool may come in handy.	この小さな道具が役に立つかもしれない。	idiom	道具や知識が、いざという時に役立つことを表す（may come in handy）。	come in(入って来る)＋handy(手近で便利な)。手近で便利なものとして役に立つことから「役に立つ」。
come of age	1	成人する・成熟する	The young artist came of age in Tokyo.	その若い芸術家は東京で大人になった。	idiom	人のほか、技術・産業などが十分に発展したことにも使う。	come(至る)＋of age(一人前の年齢に)。法律で一人前とされる年齢に達することから「成人する」、分野や人が十分に育つことから「成熟する」。
come to	2	意識を取り戻す・合計〜になる	She came to a few minutes later.	彼女は数分後に意識を取り戻した。	phrasal-verb	「意識を取り戻す」は目的語なしで使う（She came to.）。「合計〜になる」は後ろに金額を置く（The bill came to 50 dollars.）。	come(戻って来る)＋to(意識のある所へ)。意識が戻って来ることから「意識を取り戻す」、数が積み重なってある額に至ることから「合計〜になる」。
come to an end	2	終わる	The long meeting came to an end.	長い会議が終わった。	idiom	end だけより改まった表現。bring A to an end は「Aを終わらせる」。	come to(〜に至る)＋an end(終わり)。終わりに至ることから「終わる」。
come to light	1	明るみに出る	New evidence came to light yesterday.	新しい証拠が昨日明るみに出た。	idiom	事実・証拠・不正などを主語にする。bring A to light は「Aを明るみに出す」。	come(出て来る)＋to light(光の当たる所へ)。隠れていたものが光の当たる所へ出て来ることから「明るみに出る」。
come to think of it	pre1	そういえば	Come to think of it, I haven't seen Ken today.	そういえば、今日はケンを見ていない。	discourse	会話で、ふと思い出したことを付け加えるときに文頭に置く。	come to think of it(そのことを考えるに至ると)。考えてみるとということから、話の途中で思い出して「そういえば」。
compensate for	pre2	〜を埋め合わせる	Extra practice compensated for lost time.	追加練習が失った時間を埋め合わせた。	preposition	for の後ろに損失・不足を置く（compensated for lost time）。compensate 人 for 損害 で「人に損害を補償する」。	compensate(埋め合わせる)＋for(〜の分を)。com(一緒に)＋pens(重さをはかる)で、足りない分と釣り合う重さを加えることから「〜を埋め合わせる」。
confine A to B	2	AをBに限定する・閉じ込める	Please confine your answer to two sentences.	答えを2文に限定してください。	structure	受け身 be confined to もよく使う（The damage was confined to one room.）。	confine(閉じ込める)＋A＋to B(Bの範囲に)。con(共に)＋fine(境界)で、Aを境界の内側に閉じ込めることから「AをBに限定する・閉じ込める」。
consist in	pre2	〜に本質がある	True strength consists in patience.	本当の強さは忍耐にある。	preposition	consist of は「〜から成る」で意味が違う。in の後ろは名詞・動名詞。	consist(成り立つ)＋in(〜の中に)。con(一緒に)＋sist(立つ)で、本質が〜の中に立っていることから「〜に本質がある」。
correspond with	2	〜と一致する・文通する	The results correspond with our prediction.	結果は私たちの予測と一致する。	preposition	「一致する」は correspond to / with のどちらも使う。「文通する」は with を使う。	correspond(応じ合う)＋with(〜と)。互いに応じ合うことから「〜と一致する」、手紙で応じ合うことから「〜と文通する」。
could use	pre1	〜が欲しい・〜があると助かる	I could use a short break.	少し休憩できると助かる。	idiom	会話で控えめに欲しいものを言う（I could use a short break.）。過去の意味ではない。	could(〜できるだろう)＋use(使う)。〜を使えたらありがたいという気持ちから「〜が欲しい・〜があると助かる」。
Could you ~ ?	4	〜していただけますか	Could you speak more slowly?	もう少しゆっくり話していただけますか。	conversation	Can you ~? より丁寧。応じるときは Sure. / Of course. などと答える。	could(can を控えめにした形)＋you(あなたが)。can より遠回しに相手の力をたずねて、丁寧に頼むことから「〜していただけますか」。
count for	pre1	重要である・価値がある	Honesty counts for more than speed here.	ここでは速さより正直さが重要だ。	preposition	count for a lot / count for nothing の形でよく使う。count on は「〜を当てにする」。	count(重みを持つ)＋for(〜の価値として)。〜の価値として数に入ることから「重要である・価値がある」。
`

export const CURRICULUM_1900_PHRASES_A_C = Object.freeze(
  parseCurriculum1900PhraseRows(ROWS),
)
