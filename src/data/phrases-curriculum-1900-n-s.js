import { parseCurriculum1900PhraseRows } from './curriculum-phrase-utils.js'

// 正規形の英字順。
const ROWS = String.raw`
name A after B	pre2	BにちなんでAと名付ける	They named the school after its founder.	彼らは創設者にちなんで学校を名付けた。	structure	受け身 be named after もよく使う（The school is named after its founder.）。米国では name A for B とも言う。	name(名付ける)＋A＋after B(Bにならって)。after は「〜にならって・〜を手本に」の意味で、Bにならった名前をAに付けることから「BにちなんでAと名付ける」。
needless to say	2	言うまでもなく	Needless to say, everyone needs clean water.	言うまでもなく、誰にでもきれいな水が必要だ。	discourse	文頭に置き、後ろにコンマを打つことが多い。It goes without saying that とほぼ同じ意味。	needless(必要のない)＋to say(言うことは)。言う必要もないことから「言うまでもなく」。
never ... without doing	pre1	〜すれば必ず…する	He never visits without bringing flowers.	彼は訪ねる時には必ず花を持ってくる。	structure	without の後ろは動名詞。He never visits without bringing flowers. は「花を持たずに訪ねることはない」＝「訪ねるときは必ず花を持ってくる」。	never ...(決して〜しない)＋without doing(…しないで)。「…しないで〜することは決してない」という二重の否定から「〜すれば必ず…する」。
Nice to meet you.	4	はじめまして	Hello, I'm Aya. Nice to meet you.	こんにちは、アヤです。はじめまして。	conversation	初対面のあいさつで、返事は Nice to meet you, too.。2回目からは Nice to see you. を使う。	(It is) nice(うれしい)＋to meet you(あなたに会えて)。初めて会えてうれしいと伝えることから「はじめまして」。
no doubt	pre2	きっと・疑いなく	She will no doubt notice the change.	彼女はきっとその変化に気付くだろう。	idiom	実際には「おそらく〜だろう」くらいの推測にも使う。強く言い切るなら without doubt / undoubtedly。	no(少しもない)＋doubt(疑い)。疑いが少しもないことから「きっと・疑いなく」。
No problem.	4	問題ありません・どういたしまして	Can you help me? No problem.	手伝ってくれますか。問題ありません。	conversation	くだけた会話表現。改まった場面のお礼の返事には You're welcome. などを使う。	(There is) no problem(問題はない)。頼みに対して問題ないと答えることから「いいですよ」、お礼に対して手間ではなかったと答えることから「どういたしまして」。
No, thank you.	4	いいえ、結構です	Would you like more tea? No, thank you.	紅茶をもう少しいかがですか。いいえ、結構です。	conversation	勧めを受けるときは Yes, please.。No thanks. はよりくだけた言い方。	no(いいえ)＋thank you(ありがとう)。勧めを断りながら申し出にはお礼を言うことから「いいえ、結構です」。
none other than	pre2	ほかならぬ〜	The visitor was none other than the mayor.	訪問者はほかならぬ市長だった。	idiom	意外な人物や物を強調して示す（none other than the mayor）。	none other(ほかの誰でもない)＋than(〜以外の)。〜以外の誰でもないことから「ほかならぬ〜」。
not ... in the least	pre1	少しも〜ない	I am not worried in the least.	私は少しも心配していない。	structure	not at all とほぼ同じ意味。Not in the least. だけで「全然（かまわない）」という返事にもなる。	not(〜ない)＋in the least(最も少ない程度においても)。最も小さな程度でも〜ないことから「少しも〜ない」。
not all that	pre1	それほど〜ではない	The test was not all that difficult.	その試験はそれほど難しくなかった。	idiom	くだけた言い方で、後ろに形容詞・副詞を置く。not that difficult とほぼ同じ意味。	not(〜ない)＋all that(そこまで)。that は「それほど」と程度を表し、all で強めた形で「それほど〜ではない」。
not always	4	必ずしも〜とは限らない	Expensive tools are not always better.	高価な道具が必ずしも優れているとは限らない。	structure	一部だけを否定する部分否定。「いつも〜ない」と全部を否定するなら never。	not(〜ない)＋always(いつも)。「いつも〜である」を否定し、そうでない場合もあることから「必ずしも〜とは限らない」。
not so much A as B	pre1	AというよりむしろB	The story is not so much sad as hopeful.	その物語は悲しいというより希望に満ちている。	structure	A と B に同じ種類の語を並べる（sad と hopeful）。B rather than A に言いかえられる。	not so much A(それほどAではない)＋as B(Bであるほどには)。Bであるほどには A ではないことから「AというよりむしろB」。
not so much as do	pre1	〜さえしない	He left without so much as saying goodbye.	彼はさよならを言うことさえなく去った。	structure	例文のように without so much as doing で「〜さえしないで」となる。not even do とほぼ同じ意味。	not(〜ない)＋so much as do(〜するほどのことも)。〜する程度の小さなことすらしないことから「〜さえしない」。
not to mention	2	〜は言うまでもなく	The room is bright, not to mention spacious.	その部屋は広いのはもちろん、明るい。	discourse	前の内容にさらに当然のことを付け加える。to say nothing of も同じ意味。let alone と違い、肯定文の後にも使える。	not(〜ない)＋to mention(話に出すこと)。話に出すまでもなく当然であることから「〜は言うまでもなく」。
nothing but	pre2	〜にすぎない・〜だけ	The claim is nothing but a rumor.	その主張はただのうわさにすぎない。	idiom	only とほぼ同じ意味。anything but は「決して〜ない」で意味が違う。	nothing(何も〜ない)＋but(〜を除いて)。〜を除いて何もないことから「〜にすぎない・〜だけ」。
Nothing is more A than B	pre1	BほどAなものはない	Nothing is more valuable than time.	時間ほど貴重なものはない。	structure	最上級と同じ内容を表す（Time is the most valuable thing.）。Nothing is as A as B も同じ意味。	nothing(何も〜ない)＋is more A(よりAである)＋than B(Bより)。Bより A なものは何もないことから「BほどAなものはない」。
nothing short of	pre1	まさに〜・〜にほかならない	Her recovery was nothing short of remarkable.	彼女の回復はまさに驚くべきものだった。	idiom	後ろには驚きや称賛を表す強い語を置くことが多い（nothing short of a miracle）。	nothing(何も〜ない)＋short of(〜に届かない)。〜に届かない点が何もないことから「まさに〜・〜にほかならない」。
now that	pre2	今や〜なので	Now that the rain has stopped, let's leave.	雨がもうやんだので、出発しよう。	structure	後ろに主語＋動詞を置く。会話では that を省いて Now 主語＋動詞 とも言う。	now(今)＋that(〜ということで)。今や〜という状況になったのでということから「今や〜なので」。
occur to	2	〜の心に浮かぶ	A simple solution occurred to me.	簡単な解決策が私の心に浮かんだ。	preposition	考えを主語にし、人を to の後ろに置く（It occurred to me that …）。人を主語にして I occurred とは言わない。	occur(ラテン語 ob「〜に向かって」＋currere「走る」)＋to(〜に)。考えが人の方へ走って来ることから「〜の心に浮かぶ」。
of importance	pre2	重要で	This question is of great importance.	この問題は非常に重要だ。	preposition	of＋抽象名詞で形容詞の働きをする（of importance = important）。great などで強める。	of(〜を持った)＋importance(重要性)。重要性を持っていることから「重要で」。
of late	2	最近	She has been busy of late.	彼女は最近忙しい。	idiom	現在完了とよく使う改まった言い方。lately / recently とほぼ同じ意味。	of(〜のうちの)＋late(近ごろ)。late を「近ごろ」の意味で名詞のように使い、近ごろのうちにということから「最近」。
of one's own	pre1	自分自身の	Every child needs a space of their own.	どの子にも自分だけの場所が必要だ。	idiom	名詞の後ろに置く（a room of my own）。one's own＋名詞 と同じ意味。	of(〜の)＋one's own(自分自身のもの)。自分自身のものであることから「自分自身の」。
of one's own doing	pre1	自分自身が招いた	The confusion was of his own doing.	その混乱は彼自身が招いたものだった。	idiom	悪い結果に使うことが多い。one's は結果を招いた人に合わせる（of his own doing）。	of(〜による)＋one's own doing(自分自身の行い)。doing を「行い」の意味の名詞で使い、自分自身の行いによるものということから「自分自身が招いた」。
on ~ terms with	pre1	〜な間柄で	She is on friendly terms with her neighbors.	彼女は近所の人と友好的な間柄だ。	structure	terms は必ず複数形。~ に good・friendly などを置く。	on(〜の状態で)＋~ terms(〜な間柄)＋with(〜との)。terms を複数形で「人との間柄」の意味に使い、〜との間柄がある状態から「〜な間柄で」。
on a ~ basis	2	〜という基準・方式で	We meet on a weekly basis.	私たちは毎週会っている。	structure	~ に weekly・daily などを置く。on a weekly basis は weekly 1語とほぼ同じ意味。	on(〜に基づいて)＋a ~ basis(〜な基礎)。〜という基礎に基づいてということから「〜という基準・方式で」。
on a ~ scale	2	〜な規模で	The survey was conducted on a national scale.	その調査は全国規模で行われた。	structure	~ に large・small・global などを置く。on a large scale は「大規模に」。	on(〜に基づいて)＋a ~ scale(〜な目盛り・規模)。scale はラテン語の「はしご」から「目盛り・規模」の意味になり、〜な規模に基づいてということから「〜な規模で」。
on a charge of	2	〜の容疑で	He was arrested on a charge of theft.	彼は窃盗の容疑で逮捕された。	preposition	be arrested（逮捕される）とよく使う。on charges of と複数形にもする。	on(〜に基づいて)＋a charge(告発)＋of(〜という)。〜という告発に基づいてということから「〜の容疑で」。
on board	2	乗り物に乗って	There were fifty passengers on board.	乗客が50人乗っていた。	idiom	船のほか飛行機・列車・バスにも使う。乗り物を続けるなら on board the ship のように言う。	on(〜の上に)＋board(船べり・甲板)。船の上にいることから「乗り物に乗って」。
on display	2	展示されて	The winning photos are on display.	入賞写真が展示されている。	idiom	on show も同じ意味。put ~ on display で「〜を展示する」。	on(〜の状態で)＋display(展示)。展示されている状態にあることから「展示されて」。
on duty	3	勤務中で	A nurse is on duty all night.	看護師が一晩中勤務している。	idiom	反対は off duty「非番で」。	on(〜の状態で)＋duty(務め)。務めについている状態から「勤務中で」。
on earth	pre2	いったい・地上で	Why on earth did you do that?	いったいなぜそんなことをしたのですか。	idiom	「いったい」は why・what などの疑問詞のすぐ後ろに置いて驚きやいらだちを強める。最上級と使うと「この世で一番」（the happiest person on earth）。	on(〜の上で)＋earth(地上)。「地上で・この世で」の意味を疑問詞の後ろに置き、この世でいったいということから「いったい」。
on end	2	続けて・直立して	It rained for three days on end.	3日間続けて雨が降った。	idiom	「続けて」は for hours / days on end の形で使う。「直立して」は髪が逆立つ場面などに使う（His hair stood on end.）。	on(〜の状態で)＋end(端)。端を下にして立てた状態から「直立して」。期間の後ろに置くと切れ目なく続くことを表して「続けて」。
on guard	2	警戒して	The guards remained on guard.	警備員たちは警戒を続けた。	idiom	警戒する対象は against で示す（be on guard against pickpockets）。off guard は「油断して」。	on(〜の状態で)＋guard(見張り・警戒)。見張りについている状態から「警戒して」。
on occasion	pre2	時折	We eat outdoors on occasion.	私たちは時折外で食べる。	idiom	occasionally とほぼ同じ意味で、sometimes より少ない回数を表す。	on(〜のときに)＋occasion(機会)。機会があるときにということから「時折」。
on one's part	2	〜の側では・〜としては	The mistake was not intentional on her part.	彼女の側ではその誤りは故意ではなかった。	idiom	one's は行為をした人に合わせる。on the part of＋人 も同じ意味（on the part of the government）。	on(〜の上で)＋one's part(その人の側・役割)。その人の側についてはということから「〜の側では・〜としては」。
on schedule	3	予定どおりに	The train arrived on schedule.	列車は予定どおり到着した。	idiom	早ければ ahead of schedule、遅れれば behind schedule。on time は「時間どおりに」。	on(〜に合って)＋schedule(予定表)。予定表に合った状態でということから「予定どおりに」。
on second thought	pre1	考え直してみると	On second thought, I'll take the train.	考え直して、電車で行くことにする。	discourse	前に言ったことを取り消すときに文頭に置く。英国では on second thoughts と複数形にする。	on(〜に基づいて)＋second thought(2度目の考え)。もう一度考えた結果ということから「考え直してみると」。
on the ~ side	pre1	やや〜なほうで	The room is on the small side.	その部屋はやや小さめだ。	structure	~ に small・expensive などの形容詞を置き、遠回しに言う（on the expensive side）。	on(〜の上に)＋the ~ side(〜な側)。〜の側に少し寄っていることから「やや〜なほうで」。
on the air	pre2	放送中で	The interview will be on the air at eight.	そのインタビューは8時に放送される。	idiom	反対は off the air。go on the air で「放送される・放送を始める」。	on(〜に乗って)＋the air(空中・電波)。電波に乗って空中を流れていることから「放送中で」。
on the dot	pre2	時間きっかりに	The meeting started at nine on the dot.	会議は9時きっかりに始まった。	idiom	時刻の後ろに置く（at nine on the dot）。sharp も同じ位置で使う（at nine sharp）。	on(〜の上に)＋the dot(点)。時計の文字盤の目盛りの点にちょうど針が重なることから「時間きっかりに」。
on the face of it	pre1	一見したところ	On the face of it, the offer seems fair.	一見したところ、その提案は公正に見える。	discourse	後に「実は違う」と続く含みがある。seem・appear とよく使う。	on(〜の上で)＋the face(表面)＋of it(それの)。それの表面だけを見るとということから「一見したところ」。
on the increase	2	増加中で	Online orders are on the increase.	オンライン注文は増加している。	idiom	increasing とほぼ同じ意味。減っているなら on the decline。	on(〜の状態で)＋the increase(増加)。増加の途中にある状態から「増加中で」。
on the move	pre1	移動中で・活動中で	Our team is constantly on the move.	私たちのチームは絶えず移動している。	idiom	忙しく動き回っている様子や、人や動物の群れが移動している様子に使う。	on(〜の状態で)＋the move(動き)。動いている途中の状態から「移動中で・活動中で」。
on the other hand	3	他方では	The plan is cheap; on the other hand, it is risky.	その計画は安いが、他方では危険だ。	discourse	対照的な2つを比べるときに使い、On the one hand ..., on the other hand ... の形もある。「その上」と付け加える意味には使わない。	on(〜の側で)＋the other hand(もう一方の手)。片手ともう一方の手に分けて比べることから「他方では」。
on the spot	pre1	その場で・窮地に	She answered the question on the spot.	彼女はその場で質問に答えた。	idiom	「窮地に」は put ~ on the spot（〜を答えに困らせる）の形で使う。	on(〜の上で)＋the spot(その地点)。まさにその地点でということから「その場で」、その場に立たされて逃げられないことから「窮地に」。
on the way back	4	帰る途中で	We bought fruit on the way back.	私たちは帰る途中で果物を買った。	idiom	どこからの帰りかは from で示す（on the way back from school）。on the way home は「家へ帰る途中で」。	on(〜の上で)＋the way back(帰り道)。帰り道の上でということから「帰る途中で」。
on the way to	pre2	〜へ行く途中で	I met Ken on the way to school.	学校へ行く途中でケンに会った。	preposition	home・here など副詞の前では to を付けない（on the way home）。in the way「邪魔になって」とは意味が違う。	on(〜の上で)＋the way(道)＋to(〜への)。〜への道の上でということから「〜へ行く途中で」。
on the whole	pre1	全体として	On the whole, the event was successful.	全体として、その催しは成功だった。	discourse	細かい問題はあってもおおむね、という含みがある。as a whole は名詞の後ろで「全体としての〜」（the country as a whole）。	on(〜に基づいて)＋the whole(全体)。細部でなく全体を見てということから「全体として」。
once and for all	pre1	きっぱりと・これを最後に	Let's settle the issue once and for all.	この問題をきっぱり解決しよう。	idiom	settle・decide などと使い、問題を最終的に片付けることを表す。	once(一度)＋and for all(すべての場合に対して)。一度だけ行って今後すべてに通じるようにすることから「きっぱりと・これを最後に」。
once in a while	pre2	時々	We go hiking once in a while.	私たちは時々ハイキングに行く。	idiom	sometimes より少ない回数で、「たまに」に近い。every once in a while とも言う。	once(一度)＋in a while(しばらくの間に)。しばらくの間に一度ということから「時々」。
once upon a time	4	昔々	Once upon a time, a fox lived here.	昔々、ここにキツネが住んでいた。	discourse	おとぎ話を始める決まり文句。	once(かつて)＋upon a time(ある時に)。かつてのある時にということから「昔々」。
one of these days	pre1	近いうちに	I'll visit the island one of these days.	近いうちにその島を訪ねるつもりだ。	idiom	日をはっきり決めない未来に使い、will とよく使う。one day は過去にも未来にも使う。	one(1日)＋of these days(これからの日々のうちの)。これからの日々のうちのいつか1日ということから「近いうちに」。
only too	pre1	非常に・喜んで	I am only too happy to help.	喜んでお手伝いします。	idiom	「残念ながら本当に」の意味にもなる（only too true「残念ながらまったく本当だ」）。	only(ただ)＋too(あまりに)。ただもうあまりにもということから「非常に」、be only too happy to do で「喜んで〜する」。
order A from B	2	BにAを注文する	We ordered the parts from a local shop.	私たちは地元の店に部品を注文した。	structure	注文先は from で示し、to は使わない。人のために注文するなら order A for＋人。	order(注文する)＋A＋from B(Bから)。Bから取り寄せるようにAを注文することから「BにAを注文する」。
out of breath	2	息を切らして	I was out of breath after running upstairs.	階段を駆け上がって息が切れた。	idiom	走った後などに使う。catch one's breath は「息を整える」。	out of(〜がなくなって)＋breath(息)。息が足りなくなった状態から「息を切らして」。
out of character	2	その人らしくなく	His angry reply was out of character.	彼の怒った返事は彼らしくなかった。	idiom	行動や発言を主語にすることが多い。「その人らしい」は in character。	out of(〜から外れて)＋character(性格)。その人の性格から外れていることから「その人らしくなく」。
out of hand	2	手に負えなくなって・即座に	The crowd got out of hand.	群衆は手に負えなくなった。	idiom	「手に負えなくなる」は get out of hand の形。reject ~ out of hand では「よく考えずに即座に」。	out of(〜の外へ)＋hand(手)。手で押さえられる範囲の外へ出ることから「手に負えなくなって」。
owing to	pre2	〜のために	The flight was delayed owing to fog.	霧のため飛行機は遅れた。	preposition	改まった言い方で、because of / due to とほぼ同じ意味。後ろは名詞。	owing(〜に負っている)＋to(〜に)。owe A to B「AはBのおかげだ」の owe を使い、原因を〜に負っていることから「〜のために」。
Pardon me?	4	もう一度言ってください	Pardon me? I couldn't hear you.	もう一度お願いします。聞こえませんでした。	conversation	上げ調子で言う。I beg your pardon? はより丁寧。下げ調子の Pardon me. は「失礼しました」。	pardon(許す)＋me(私を)。聞き取れなかった失礼を許してほしいと言うことから、聞き返しの「もう一度言ってください」。
part and parcel of	pre1	〜の不可欠な部分	Mistakes are part and parcel of learning.	間違いは学習に付きものだ。	idiom	be part and parcel of の形で、切り離せない一部であることを表す。part にも parcel にも a を付けない。	part(部分)＋and parcel(と一部分)。parcel はもと「一部分」の意味で、同じ意味の語を重ねて強めたことから「〜の不可欠な部分」。
part with	2	〜を手放す	She refused to part with the old letter.	彼女はその古い手紙を手放そうとしなかった。	preposition	大切な物を惜しみながら手放す場面に使う。part from＋人 は「〜と別れる」。	part(分かれる)＋with(〜と)。持っていた〜と分かれることから「〜を手放す」。
pass out	pre1	気を失う・配る	He passed out from the heat.	彼は暑さで気を失った。	phrasal-verb	「気を失う」は faint、「配る」は hand out とほぼ同じ意味（pass out the papers）。	pass(移る)＋out(外へ)。意識のある状態から外へ出ることから「気を失う」、手元から外へ次々と渡すことから「配る」。
pay a visit to	pre2	〜を訪問する	We paid a visit to the science museum.	私たちは科学博物館を訪れた。	idiom	visit 1語より改まった響き。pay＋人＋a visit の形もある（pay him a visit）。	pay(向ける)＋a visit(訪問)＋to(〜に)。pay attention の pay と同じく「向ける」の意味で使い、〜に訪問を向けることから「〜を訪問する」。
per capita	2	一人当たり	Water use per capita has fallen.	一人当たりの水使用量は減った。	idiom	名詞の後ろにも前にも置く（per capita income「一人当たりの所得」）。per person とほぼ同じ意味。	ラテン語 per(〜ごとに)＋capita(頭。caput の複数形)。頭数ごとにということから「一人当たり」。
play a joke on	1	〜にいたずらをする	They played a harmless joke on their coach.	彼らはコーチに害のないいたずらをした。	idiom	play a trick on とほぼ同じ意味。on の後ろはいたずらをされる人。	play(仕掛ける)＋a joke(冗談)＋on(〜に対して)。〜に冗談を仕掛けることから「〜にいたずらをする」。
present A with B	2	AにBを贈る・提示する	The club presented her with an award.	クラブは彼女に賞を贈った。	structure	人を先に置くときは with を使う。物を先に置くなら present B to A（presented an award to her）。	present(差し出す)＋A(人)＋with B(Bを添えて)。AにBを添えて差し出すことから「AにBを贈る・提示する」。
pride oneself on	2	〜を自慢する	The hotel prides itself on friendly service.	そのホテルは親切なサービスを誇りにしている。	structure	前置詞は on。be proud of / take pride in とほぼ同じ意味。oneself は主語に合わせる（The hotel prides itself on …）。	pride(誇らせる)＋oneself(自分自身を)＋on(〜について)。〜について自分を誇らしく思うことから「〜を自慢する・誇りにする」。
provide for	2	〜を養う・〜に備える	She works hard to provide for her family.	彼女は家族を養うため懸命に働く。	preposition	「養う」は家族などを後ろに置き、「備える」は provide for the future のように使う。provide A with B「AにBを与える」とは形が違う。	provide(ラテン語 pro「前もって」＋videre「見る」)＋for(〜のために)。〜のために先を見て用意することから「〜を養う・〜に備える」。
pull ~'s leg	pre2	〜をからかう	Relax; I'm just pulling your leg.	落ち着いて。からかっているだけだよ。	structure	冗談でだますことを表し、悪気は小さい。日本語の「足を引っ張る」（邪魔をする）とは意味が違う。	pull(引っ張る)＋~'s leg(〜の脚)。相手の脚を引っ張るようないたずらにたとえて「〜をからかう」。
pull up	pre1	車を止める・引き上げる	A taxi pulled up outside the gate.	タクシーが門の外に止まった。	phrasal-verb	止まる場所を後ろに置く（pulled up outside the gate）。pull over は「道路の端に寄せて止める」。	pull(引く)＋up(上へ)。馬の手綱を引いて止めたことから「車を止める・止まる」、物を上へ引くことから「引き上げる」。
punish A for B	2	BのことでAを罰する	The school punished him for cheating.	学校は不正行為のことで彼を罰した。	structure	for の後ろは名詞・動名詞（for cheating）。blame A for B / thank A for B と同じ形。	punish(罰する)＋A(人)＋for B(Bを理由に)。for が理由を表し、Bを理由にAを罰することから「BのことでAを罰する」。
put ~ to use	1	〜を活用する	Let's put this empty room to use.	この空き部屋を活用しよう。	structure	good・practical などを付けて put ~ to good use「〜を有効に使う」ともする。	put(置く)＋~＋to use(使う方へ)。〜を使われる状態に置くことから「〜を活用する」。
put aside	2	〜を取っておく・脇に置く	Put aside a little money each month.	毎月少しお金を取っておきなさい。	phrasal-verb	目的語が代名詞なら put it aside。問題や感情を「いったん脇に置く」意味にも使う。set aside とほぼ同じ意味。	put(置く)＋aside(脇へ)。脇へ置いておくことから「〜を取っておく・脇に置く」。
put emphasis on	2	〜を重視する	The course puts emphasis on clear writing.	その講座は明快な文章を重視する。	preposition	place emphasis on とも言う。great・special などで強める（put great emphasis on）。	put(置く)＋emphasis(強調)＋on(〜の上に)。〜の上に強調を置くことから「〜を重視する」。
put in	2	〜を提出する・注ぎ込む	She put in many hours of practice.	彼女は何時間も練習に費やした。	phrasal-verb	「提出する」は put in a request / an application の形。時間は put in many hours のように使う。	put(置く)＋in(中へ)。中へ入れることから、申請などを出して「提出する」、時間や労力を注ぎ入れて「注ぎ込む」。
quite a few	1	かなり多くの	Quite a few students chose the second option.	かなり多くの生徒が二つ目の選択肢を選んだ。	idiom	数えられる名詞の複数形に使う。数えられない名詞には quite a lot of などを使う。	quite(かなり)＋a few(いくつかの)。「いくつか」を quite で強め、控えめに言いながら実際には多いことを表して「かなり多くの」。
read between the lines	1	行間を読む	Read between the lines to understand his concern.	彼の懸念を理解するには行間を読みなさい。	idiom	文字どおりには書かれていない相手の本心や意図をくみ取ることを表す。	read(読む)＋between the lines(行と行の間を)。書かれた行の間に隠れた意味を読むことから「行間を読む」。
reflect on	2	〜をよく考える	Take time to reflect on what you learned.	学んだことをよく考える時間を取りなさい。	preposition	過去の経験や行いを振り返る場面に使う。reflect だけだと「反射する・反映する」。	reflect(ラテン語 re「後ろへ」＋flectere「曲げる」)＋on(〜について)。心を後ろへ向けて振り返ることから「〜をよく考える」。
remain to be seen	pre2	まだ分からない	Whether the plan works remains to be seen.	その計画がうまくいくかはまだ分からない。	structure	whether・how などの節や it を主語にする（It remains to be seen whether …）。	remain(残っている)＋to be seen(これから見られるべき)。これから見て確かめることとして残っていることから「まだ分からない」。
remember doing	pre2	〜したことを覚えている	I remember meeting her at the library.	私は図書館で彼女に会ったことを覚えている。	structure	過去にした行為を覚えている時は動名詞を使う。	remember(覚えている)＋doing(〜したこと)。動名詞がすでにした行為を表し、その行為を覚えていることから「〜したことを覚えている」。
remember to do	pre2	忘れずに〜する	Remember to lock the door.	忘れずにドアに鍵を掛けなさい。	structure	これからすべき行為を忘れない時は不定詞を使う。	remember(忘れずにいる)＋to do(これから〜すること)。不定詞がこれから先の行為を表し、それを忘れずにいることから「忘れずに〜する」。
rest on	2	〜に基づく・〜にかかっている	The decision rests on reliable evidence.	その決定は信頼できる証拠に基づく。	preposition	改まった言い方。be based on / depend on とほぼ同じ意味。	rest(載っている・支えられている)＋on(〜の上に)。〜の上に載って支えられていることから「〜に基づく・〜にかかっている」。
right as rain	pre1	すっかり元気で	After a night's rest, I felt right as rain.	一晩休むと私はすっかり元気になった。	idiom	くだけた言い方で、as right as rain とも言う。病気やけがから回復した人に使う。	right(正常な)＋as rain(雨のように)。right と rain の r の音をそろえて調子よくした言い方で、「すっかり正常で」から「すっかり元気で」。
round up	pre1	〜を集める	We rounded up volunteers for the cleanup.	私たちは清掃のためにボランティアを集めた。	phrasal-verb	人や動物を集めるほか、数を「切り上げる」意味にもなる（round up to 10）。	round(丸く囲む)＋up(すっかり)。散らばった家畜を周りから囲んですっかり集めることから「〜を集める」。
scores of	1	多数の	Scores of people attended the open day.	多数の人が公開日に参加した。	collocation	後ろは複数名詞。dozens of（何ダースもの）と同じ作りで、それより多い感じを表す。	score(20)の複数形＋of(〜の)。score はもと20を1組として数える単位で、何組もの20ということから「多数の」。
second to none	pre1	誰にも劣らない	Her knowledge of the region is second to none.	彼女の地域についての知識は誰にも劣らない。	idiom	be second to none の形で、最高であることを遠回しに言う。	second(2番目の)＋to none(誰に対しても〜ない)。誰に対しても2番目にならないことから「誰にも劣らない」。
see much of	pre1	〜によく会う	I don't see much of my old classmates now.	今は昔の同級生にあまり会わない。	idiom	否定文・疑問文で使うことが多い。肯定文では see a lot of が自然。	see(会う)＋much(多く)＋of(〜の)。〜の姿を多く見ることから「〜によく会う」。
see that	pre2	必ず〜するようにする	See that every window is closed.	必ずすべての窓が閉まっているようにしなさい。	structure	see to it that とも言う。that 節の中は未来のことでも現在形を使う（See that the door is locked.）。	see(見届ける)＋that(〜ということを)。〜という状態になるのを見届けることから「必ず〜するようにする」。
see the sights of	1	〜を観光する	We spent a day seeing the sights of Kyoto.	私たちは一日京都を観光して過ごした。	idiom	名詞 sightseeing「観光」も sight と see の組み合わせ。	see(見る)＋the sights(名所)＋of(〜の)。sight を複数形で「名所」の意味に使い、〜の名所を見ることから「〜を観光する」。
See you.	4	またね	See you. Have a good weekend.	またね。よい週末を。	conversation	See you later. / See you tomorrow. のように時を付けることも多い。	(I'll) see you (later)(またあなたに会う)。また会うことを約束する言い方を短くして「またね」。
serve ~ right	pre2	〜には当然の報いだ	It serves him right for ignoring the warning.	警告を無視した彼には当然の報いだ。	structure	主語は it や出来事で、悪い目にあった人を目的語にする。理由は for で示す（for ignoring the warning）。	serve(扱う)＋~(人)＋right(正しく)。その人にふさわしい正しい扱いをすることから「〜には当然の報いだ」。
shake hands	pre2	握手する	The two leaders shook hands.	2人の指導者は握手した。	idiom	手は2人分なので hands と複数形。相手は with で示す（shake hands with the mayor）。	shake(振る)＋hands(手)。2人が互いの手を握って振ることから「握手する」。
Shall I ~ ?	4	〜しましょうか	Shall I carry that bag?	そのかばんを持ちましょうか。	conversation	相手のために申し出るときに使う。Shall we ~? は「一緒に〜しましょうか」。答えは Yes, please. / No, thank you. など。	shall I(私が〜すべきか)＋~。私が〜するべきかと相手の意向をたずねることから「〜しましょうか」。
shut up	2	黙る・閉じ込める	He suddenly shut up when the teacher entered.	先生が入ると彼は急に黙った。	phrasal-verb	強い言い方なので、相手に直接使う時は注意する。	shut(閉じる)＋up(すっかり)。口をすっかり閉じることから「黙る」、建物などに入れて閉じることから「閉じ込める」。
shy away	pre1	尻込みする	Do not shy away from difficult questions.	難しい質問に尻込みしないで。	phrasal-verb	避ける対象は from で示す（shy away from difficult questions）。	shy(馬がおびえて飛びのく)＋away(離れて)。動詞 shy は馬が驚いて横に飛びのくことを表し、おびえて離れることから「尻込みする」。
sign up for ~	2	〜に申し込む	I signed up for the evening class.	私は夜の講座に申し込んだ。	phrasal-verb	for の後ろは講座・活動など。動詞を続けるなら sign up to do。	sign(署名する)＋up(すっかり)＋for(〜のために)。〜に参加するため名簿に名前を書き込むことから「〜に申し込む」。
sit up	2	上体を起こす・きちんと座る	She sat up when she heard the news.	その知らせを聞いて彼女は上体を起こした。	phrasal-verb	sit up late は「夜更かしする」。	sit(座る)＋up(上へ・まっすぐに)。寝た姿勢から上体を起こすことから「上体を起こす」、背筋をまっすぐ伸ばすことから「きちんと座る」。
slow down	2	速度を落とす	Slow down near the school.	学校の近くでは速度を落としなさい。	phrasal-verb	仕事や生活のペースを落とす意味にも使う。反対は speed up。	slow(遅くする)＋down(下げて)。速さを下げることから「速度を落とす」。
..., so that ...	pre1	〜、その結果…	The road was blocked, so that we had to turn back.	道がふさがれていた。その結果、私たちは引き返さなければならなかった。	structure	目的を表す so that S can do と区別し、コンマの前の事実から生じた結果を表す。	so(そのように)＋that(〜という結果に)。前の事実がそのように働いて〜という結果になることから「〜、その結果…」。
so that ~ can do	pre2	〜が…できるように	Speak clearly so that everyone can hear.	全員に聞こえるようにはっきり話しなさい。	structure	目的を表し、can・will・may を使う。過去の文では could・would になる。	so(そのように)＋that(〜するように)。〜が…できるようにそのようにするということから「〜が…できるように」。
so to speak	2	いわば	The library is the heart of the school, so to speak.	図書館はいわば学校の心臓部だ。	discourse	たとえを言うときに、その前後に挟む。as it were もほぼ同じ意味。	so(そのように)＋to speak(言うとすれば)。そのように言ってよければということから「いわば」。
Some A. Others B.	3	Aする人もいればBする人もいる	Some students walked. Others took the bus.	歩いた生徒もいれば、バスに乗った生徒もいた。	structure	残りの全員を指すなら the others を使う。	some(一部の人)＋others(ほかの人)。一部の人とほかの人を分けて並べることから「Aする人もいればBする人もいる」。
something of a	pre1	ちょっとした〜・かなりの〜	The trip was something of an adventure.	その旅はちょっとした冒険だった。	idiom	後ろの名詞に合わせて a / an を選ぶ（something of an adventure）。	something(いくらかのもの)＋of a(〜としての)。〜としての性質をいくらか持っていることから「ちょっとした〜・かなりの〜」。
sort of / kind of	pre1	いくぶん・〜のような	I was kind of surprised by the answer.	私はその答えに少し驚いた。	idiom	会話で程度をぼかすときに形容詞・動詞の前に置く。書き言葉では somewhat / rather を使う。	sort / kind(種類)＋of(〜の)。「一種の〜」の意味から、はっきり言い切らずに「いくぶん・〜のような」。
sound like	3	〜のように聞こえる	That sounds like a good idea.	それはよい考えのように聞こえる。	preposition	like の後ろは名詞。形容詞なら sound good のように like を付けない。	sound(〜に聞こえる)＋like(〜のように)。〜のように聞こえることから「〜のように聞こえる・〜のようだ」。
speak out	2	はっきり意見を述べる	Students spoke out against the change.	生徒たちはその変更に反対だとはっきり述べた。	phrasal-verb	反対なら against、擁護なら for を続ける（speak out against the change）。	speak(話す)＋out(外へ・はっきりと)。黙っていた意見を外へはっきり出すことから「はっきり意見を述べる」。
speaking of	2	〜と言えば	Speaking of travel, have you packed yet?	旅行と言えば、もう荷造りしましたか。	discourse	直前の話題から関連する話に移るときに文頭に置く。talking of も同じ意味。	speaking(話していると)＋of(〜について)。〜について話していることからつなげて「〜と言えば」。
spend ~ in doing	2	〜を…することに費やす	She spent the afternoon in reading.	彼女は午後を読書に費やした。	structure	現代英語では in を省いて spend time doing とすることも多い。	spend(費やす)＋~(時間)＋in doing(〜することの中で)。時間を〜することの中で使うことから「〜を…することに費やす」。
stand to reason	1	当然である	It stands to reason that practice improves skill.	練習で技能が上がるのは当然だ。	idiom	It stands to reason that … の形で使う。	stand(成り立つ)＋to reason(道理に照らして)。道理に照らして成り立つことから「当然である」。
step up	2	〜を強化する・進み出る	The city stepped up safety checks.	市は安全点検を強化した。	phrasal-verb	「強化する」は努力・対策・点検などを目的語にする（stepped up safety checks）。	step(一歩進む)＋up(上へ)。一段上へ上がることから「〜を強化する」、前へ一歩出ることから「進み出る」。
stick around	pre2	その場に残る	Stick around after class if you have questions.	質問があれば授業後も残ってください。	phrasal-verb	くだけた言い方。stay around とほぼ同じ意味。	stick(くっついて離れない)＋around(あたりに)。その場のあたりにくっついて離れないことから「その場に残る」。
stick out	2	突き出る・目立つ	The red door sticks out on this street.	その赤い扉はこの通りで目立つ。	phrasal-verb	stand out も「目立つ」。stick out one's tongue は「舌を出す」。	stick(突き出る)＋out(外へ)。外へ突き出ることから「突き出る」、周りから飛び出して見えることから「目立つ」。
strike A as B	pre2	AにBという印象を与える	The proposal struck me as practical.	その提案は私には実用的に思えた。	structure	主語は物事で、A に人を置く。B には形容詞・名詞を置く（struck me as practical）。	strike(心を打つ)＋A(人)＋as B(Bとして)。物事がBとして人の心を打つことから「AにBという印象を与える」。
submit to	pre1	〜に従う・屈する	The samples were submitted to careful testing.	試料は慎重な検査にかけられた。	preposition	例文のような submit A to B は「AをBにかける・提出する」（submit a report to the teacher）。	submit(ラテン語 sub「下に」＋mittere「置く・送る」)＋to(〜に)。自分を〜の下に置くことから「〜に従う・屈する」。
such as it is	pre1	たいしたものではないが	You may use my desk, such as it is.	たいした机ではないが、使ってよい。	idiom	名詞の後ろにコンマを置いて付け足し、自分の物をへりくだって言う。複数なら such as they are。	such(そのような)＋as it is(それが今あるとおりの)。今あるとおりのそのようなものだがということから「たいしたものではないが」。
Suffice it to say that	2	〜と言えば十分だ	Suffice it to say that the plan needs work.	その計画には改善が必要だと言えば十分だ。	structure	詳しく説明しない理由を示す改まった言い方。Suffice to say と it を省くこともある。	suffice(十分である)＋it to say(〜と言うことが)。Let it suffice to say と同じ意味の古い願いの形で、〜と言うだけで十分としようということから「〜と言えば十分だ」。
sum up	2	要約する	Let me sum up the main points.	要点をまとめます。	phrasal-verb	To sum up, … で「まとめると」と文頭に置く。	sum(合計する)＋up(すっかり)。全部を合わせて一つにまとめることから「要約する」。
surrender to	2	〜に降伏する・屈する	The army surrendered to the opposing forces.	軍は敵軍に降伏した。	preposition	誘惑や感情に負ける意味にも使う（surrender to temptation）。give in to とほぼ同じ意味。	surrender(古いフランス語 sur「上に」＋rendre「返す・渡す」)＋to(〜に)。自分を相手に引き渡すことから「〜に降伏する・屈する」。
sympathize with	2	〜に同情する	I sympathize with people facing the same problem.	私は同じ問題に直面する人々に同情する。	preposition	意見に「共感する・賛成する」意味にもなる。英国つづりは sympathise。	sympathize(ギリシャ語 syn「共に」＋pathos「感情」)＋with(〜と)。〜と感情を共にすることから「〜に同情する」。
`

export const CURRICULUM_1900_PHRASES_N_S = Object.freeze(
  parseCurriculum1900PhraseRows(ROWS),
)
