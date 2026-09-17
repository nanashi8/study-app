import { parseCurriculum1900PhraseRows } from './curriculum-phrase-utils.js'

// 正規形の英字順。空所で始まる2項目も語句本体の t で配置する。
const ROWS = String.raw`
take ~ by surprise	2	〜を驚かせる	The sudden question took me by surprise.	突然の質問に私は驚いた。	structure	主語は出来事で、~ は驚いた人。受け身 be taken by surprise もよく使う。	take(捕らえる)＋~＋by surprise(不意を突いて)。surprise はもと「不意打ち」の意味で、不意を突いて〜を捕らえることから「〜を驚かせる」。
take A for B	pre2	AをBだと思い込む	I took the distant light for a star.	私は遠くの明かりを星だと思った。	structure	mistake A for B とほぼ同じ意味。take A for granted は「Aを当然と思う」。	take(受け取る)＋A＋for B(Bとして)。AをBとして受け取ることから「AをBだと思い込む」。
take a risk	pre2	危険を冒す	Sometimes we must take a risk to improve.	改善するには時に危険を冒さなければならない。	idiom	take risks と複数形でも使う。危険の中身は of doing で示す（take the risk of losing money）。	take(引き受ける)＋a risk(危険)。危険を自分から引き受けることから「危険を冒す」。
take control of	2	〜を支配する・管理する	A new team took control of the project.	新しいチームが計画の管理を引き受けた。	idiom	支配・管理を始める動作を表す。している状態なら be in control of。	take(手に入れる)＋control(支配・管理)＋of(〜の)。〜の支配や管理を手に入れることから「〜を支配する・管理する」。
take hold of	pre1	〜をしっかりつかむ	Take hold of the rail before you step down.	降りる前に手すりをしっかりつかみなさい。	idiom	感情や考えが人の心をとらえる意味にも使う（Fear took hold of him.）。catch hold of もほぼ同じ意味。	take(取る)＋hold(握り・つかみ)＋of(〜の)。〜をつかむ握りを取ることから「〜をしっかりつかむ」。
take it easy	pre1	気楽にする・無理をしない	You look tired, so take it easy today.	疲れているようだから今日は無理をしないで。	idiom	別れぎわの「じゃあね・無理しないで」の意味にも使う。	take(受け止める)＋it(物事)＋easy(気楽に)。物事を気楽に受け止めることから「気楽にする・無理をしない」。
take notice of	pre1	〜に注意を払う	The council finally took notice of our request.	評議会はついに私たちの要望に注意を向けた。	idiom	否定の take no notice of「〜を気にしない・無視する」でよく使う。pay attention to とほぼ同じ意味。	take(取る)＋notice(注意・気付き)＋of(〜の)。〜に気付いて注意を向けることから「〜に注意を払う」。
take office	pre2	就任する	The new mayor takes office next month.	新市長は来月就任する。	idiom	office に冠詞を付けない。職を離れるのは leave office、在職中は be in office。	take(就く)＋office(公職)。office を「職務・公職」の意味に使い、公職に就くことから「就任する」。
take one's place	pre2	〜の代わりをする・所定の位置に着く	Mika took her place at the front of the line.	ミカは列の先頭の所定の位置に着いた。	idiom	one's が主語と同じ人なら「所定の位置に着く」、別の人なら「〜の代わりをする」。take the place of も「〜の代わりをする」。	take(取る)＋one's place(その人の場所)。ほかの人の場所を取ることから「〜の代わりをする」、自分の場所を取ることから「所定の位置に着く」。
take one's time	pre1	ゆっくり時間をかける	Take your time and read each question.	急がず各問題を読んでください。	idiom	Take your time. は「急がなくていいですよ」と相手を気づかう言い方。one's は主語に合わせる。	take(使う)＋one's time(自分の時間)。自分の時間を十分に使うことから「ゆっくり時間をかける」。
take pains	pre1	骨を折る	She took pains to explain every step.	彼女は各段階を説明するのに骨を折った。	idiom	pains は必ず複数形。何のためかは to do で示す（took pains to explain）。	take(引き受ける)＋pains(骨折り)。pain を複数形で「骨折り・苦労」の意味に使い、苦労を引き受けることから「骨を折る」。
take pity on	2	〜を気の毒に思う	A farmer took pity on the injured bird.	農夫は傷ついた鳥を気の毒に思った。	idiom	気の毒に思って助けるところまで含むことが多い。feel sorry for とほぼ同じ意味。	take(抱く)＋pity(哀れみ)＋on(〜に対して)。〜に対して哀れみを抱くことから「〜を気の毒に思う」。
take shape	pre2	形を成す	The plan began to take shape after the meeting.	会議後、その計画は形を成し始めた。	idiom	shape に冠詞を付けない。計画・考え・建物などが具体的になっていく様子に使う。	take(取る)＋shape(形)。はっきりした形を取ることから「形を成す」。
take the trouble to do	pre2	わざわざ〜する	He took the trouble to check every figure.	彼はわざわざすべての数字を確認した。	structure	否定文では「わざわざ〜しようとしない」（didn't take the trouble to call）。go to the trouble of doing も同じ意味。	take(引き受ける)＋the trouble(手間)＋to do(〜するための)。〜するための手間をあえて引き受けることから「わざわざ〜する」。
take turns	pre2	交代でする	We took turns reading aloud.	私たちは交代で音読した。	idiom	turns は複数形。する行為は doing か to do で示す（took turns reading aloud）。	take(取る)＋turns(順番)。順番を一人ずつ取ることから「交代でする」。
talk A into B	2	Aを説得してBさせる	She talked me into joining the club.	彼女は私を説得してクラブに入らせた。	structure	B は名詞・動名詞（into joining）。反対は talk A out of B「Aを説得してBをやめさせる」。	talk(話す)＋A(人)＋into B(Bの中へ)。話してAをBの中へ引き入れることから「Aを説得してBさせる」。
tell on	pre1	〜に悪影響を及ぼす・〜を告げ口する	Lack of sleep is beginning to tell on him.	睡眠不足が彼に響き始めている。	phrasal-verb	「悪影響」は疲れ・年齢・緊張などを主語にする。「告げ口する」は子どもどうしの会話でよく使う（I'll tell on you!）。	tell(効き目が表れる・話す)＋on(〜に対して)。tell は「はっきり影響が表れる」の意味でも使い、〜に影響が表れることから「〜に悪影響を及ぼす」、〜のことを話してしまうことから「〜を告げ口する」。
Thank you.	4	ありがとう	Thank you for waiting.	待ってくれてありがとう。	conversation	理由は for で示し、後ろは名詞・動名詞（Thank you for waiting.）。	(I) thank you(私はあなたに感謝する)。主語の I を省いた形で「ありがとう」。
Thanks for ~ .	4	〜をありがとう	Thanks for your helpful advice.	役に立つ助言をありがとう。	conversation	Thank you for ~. よりくだけた言い方。for の後ろは名詞・動名詞。	thanks(感謝。複数形の名詞)＋for(〜に対する)。〜に対する感謝を伝えることから「〜をありがとう」。
that is to say	2	すなわち	The route is direct; that is to say, there are no changes.	その経路は直通、つまり乗り換えがない。	discourse	前の内容を詳しく、または正確に言い直すときに使う。短く that is, とも言う。	that is(それは〜である)＋to say(言いかえると)。前の内容を言いかえるとそれはということから「すなわち」。
that much 比較級	pre1	それだけいっそう〜	The clear map made the walk that much easier.	分かりやすい地図のおかげで、歩くのがそれだけ楽になった。	structure	前に述べた理由の分だけ程度が増すことを表す。all the＋比較級 とほぼ同じ意味。	that much(それだけの分)＋比較級(より〜)。それだけの分さらに〜になることから「それだけいっそう〜」。
That's right.	4	そのとおりです	Is this the final stop? That's right.	ここが終点ですか。そのとおりです。	conversation	相手の確認に答えるときに使う。All right. は「わかった・大丈夫」で意味が違う。	that(それは)＋is right(正しい)。相手の言ったことが正しいと認めることから「そのとおりです」。
the bottom line	pre2	最も重要な点・最終結果	The bottom line is that we need more time.	最も重要なのは、もっと時間が必要だということだ。	idiom	The bottom line is (that) … の形で、結論を言うときに使う。	the bottom(一番下の)＋line(行)。決算書の一番下の行に最終的な損益が書かれることから「最終結果・最も重要な点」。
The chances are that	pre1	おそらく〜だ	The chances are that the road is closed.	おそらくその道は閉鎖されている。	structure	会話では The を省いて Chances are (that) … とも言う。	the chances(見込み)＋are that(〜ということだ)。見込みは〜ということだということから「おそらく〜だ」。
the elephant in the room	pre1	皆が避けている明白な問題	The rising cost was the elephant in the room.	費用の増大は皆が避けていた明白な問題だった。	idiom	気まずくて誰も口にしない問題に使う。address the elephant in the room で「その問題に向き合う」。	the elephant(象)＋in the room(部屋の中の)。部屋に象がいるほど明らかなのに誰も話題にしないことから「皆が避けている明白な問題」。
the former ..., the latter ...	pre1	前者は〜、後者は…	Tea and coffee are offered; the former is free, the latter is not.	紅茶とコーヒーがあり、前者は無料だが後者は有料だ。	structure	2つのものについて使う。3つ以上なら the first / the last などを使う。	former(前の)＋latter(後の)。先に述べたほうと後に述べたほうを指すことから「前者は〜、後者は…」。
the last ... to do	2	最も〜しそうにない…	He is the last person to break a promise.	彼は最も約束を破りそうにない人だ。	structure	「最後に〜した…」の意味にもなるので文脈で判断する（the last person to leave the room）。	the last(最後の)＋...＋to do(〜する)。〜しそうな人を並べると最後に来ることから「最も〜しそうにない…」。
the moment	pre1	〜するとすぐ	Call me the moment you arrive.	着いたらすぐ私に電話して。	structure	接続詞として後ろに主語＋動詞を置き、未来のことでも現在形を使う（the moment you arrive）。as soon as とほぼ同じ意味。	the moment(その瞬間に)。〜するその瞬間にということから「〜するとすぐ」。
the other way around	pre1	逆に・反対に	I thought she helped him, but it was the other way around.	彼女が彼を助けたと思ったが、逆だった。	idiom	関係や順序が逆であることを表す。英国では the other way round とも言う。	the other way(反対の向き)＋around(ぐるりと回して)。ぐるりと回して反対の向きにしたことから「逆に・反対に」。
the pros and cons	pre1	賛否・長所と短所	We discussed the pros and cons of the proposal.	私たちは提案の長所と短所を話し合った。	idiom	複数形で使う（the pros and cons of the proposal）。weigh the pros and cons で「長所と短所を比べて考える」。	ラテン語 pro(〜に賛成して)＋con(contra「〜に反対して」の略)。賛成の理由と反対の理由ということから「賛否・長所と短所」。
There is no doing	pre1	〜することはできない	There is no knowing what will happen.	何が起こるか知ることはできない。	structure	動名詞を置く（There is no knowing / telling …）。It is impossible to do に言いかえられる。	there is no(〜は存在しない)＋doing(〜すること)。〜することがありえないことから「〜することはできない」。
There is something wrong with	pre2	〜の具合が悪い・〜に問題がある	There is something wrong with this printer.	このプリンターはどこか具合が悪い。	structure	機械や体の不調に使う。問題がないなら There is nothing wrong with。	there is something wrong(何か具合の悪い点がある)＋with(〜について)。〜について何か具合の悪い点があることから「〜の具合が悪い・〜に問題がある」。
these days	4	近ごろ	Many people work from home these days.	近ごろは多くの人が自宅で働く。	idiom	現在形とよく使い、昔との違いを表す。in those days は「当時は」。	these(これらの)＋days(日々)。今のこの日々にはということから「近ごろ」。
think again	pre1	考え直す	If you think the task is easy, think again.	その課題が簡単だと思うなら、考え直した方がよい。	idiom	If you think …, think again. は「〜と思っているなら大間違いだ」と相手の思い込みを正す言い方。	think(考える)＋again(もう一度)。もう一度考えることから「考え直す」。
think much of	pre1	〜を高く評価する	The critics did not think much of the film.	批評家はその映画を高く評価しなかった。	idiom	否定文で使うことが多い（did not think much of the film）。肯定文では think highly of が自然。	think(評価する)＋much(大いに)＋of(〜を)。〜を大いに評価することから「〜を高く評価する」。
think of A as B	pre2	AをBと考える	We think of the library as a shared classroom.	私たちは図書館を共有の教室と考えている。	structure	regard A as B / look on A as B とほぼ同じ意味。B には名詞・形容詞を置く。	think of(〜を思う)＋A＋as B(Bとして)。AをBとして思うことから「AをBと考える」。
throw up	pre1	吐く・急いで建てる	The rough sea made several passengers throw up.	荒れた海で何人かの乗客が吐いた。	phrasal-verb	「吐く」は vomit のくだけた言い方。英国では be sick とも言う。	throw(投げる)＋up(上へ)。胃の中の物を上へ投げ出すことから「吐く」、上へ投げ上げるように素早く築くことから「急いで建てる」。
tie up	pre2	〜を縛る・〜をふさぐ	The accident tied up traffic for an hour.	事故で交通が1時間滞った。	phrasal-verb	受け身 be tied up で「手がふさがっている・忙しい」。	tie(結ぶ)＋up(すっかり)。すっかり結んで動けなくすることから「〜を縛る」、交通や回線を動けなくすることから「〜をふさぐ」。
... to come	2	これから先の〜	This decision will matter for years to come.	この決定はこれから何年にもわたって重要になる。	structure	名詞の後ろに置く（for years to come / in the days to come）。	...(時を表す名詞)＋to come(これから来る)。これからやって来る〜ということから「これから先の〜」。
to death	2	死ぬほど・ひどく	The loud noise frightened me to death.	大きな音に私はひどく驚いた。	idiom	bored・scared・worried などの後ろに置いて強める（bored to death）。文字どおり「死ぬまで」の意味にもなる（froze to death）。	to(〜に至るまで)＋death(死)。死に至るほどということから「死ぬほど・ひどく」。
... to go	2	残り〜	We have only two pages to go.	残りは2ページだけだ。	structure	数量の後ろに置く（two pages to go / three days to go）。	...(数量)＋to go(これから進むべき)。これから進まなければならない分ということから「残り〜」。
to make matters worse	2	さらに悪いことに	To make matters worse, it began to rain.	さらに悪いことに、雨が降り始めた。	discourse	文頭に置く決まった形。what is worse / worse still とほぼ同じ意味。	to make(〜にすることには)＋matters(事態)＋worse(さらに悪く)。事態をさらに悪くすることにはということから「さらに悪いことに」。
to one's advantage	2	〜に有利に	She used her experience to her advantage.	彼女は経験を自分に有利に生かした。	idiom	use ~ to one's advantage「〜を自分に有利に生かす」の形でよく使う。反対は to one's disadvantage。	to(〜になるように)＋one's advantage(その人の利益)。その人の利益になるようにということから「〜に有利に」。
to oneself	3	自分だけに・独り占めして	I had the whole room to myself.	私は部屋全体を独り占めした。	idiom	have ~ to oneself で「〜を独り占めする」、keep ~ to oneself で「〜を人に言わない」。	to(〜に)＋oneself(自分自身)。自分自身だけに向けてということから「自分だけに・独り占めして」。
to say nothing of	2	〜は言うまでもなく	The hike is hard for adults, to say nothing of children.	その山歩きは大人にも大変で、子どもならなおさらだ。	discourse	not to mention とほぼ同じ意味。	to say nothing(何も言わないとしても)＋of(〜について)。〜について何も言わなくても明らかなことから「〜は言うまでもなく」。
to tell the truth	2	実を言うと	To tell the truth, I forgot the appointment.	実を言うと、約束を忘れていた。	discourse	言いにくいことを打ち明ける前に文頭に置く決まった形。	to tell(話すとすれば)＋the truth(本当のこと)。本当のことを話すとすればということから「実を言うと」。
to the best of one's knowledge	pre1	〜の知る限りでは	To the best of my knowledge, the data are correct.	私の知る限り、そのデータは正しい。	idiom	確実とは言い切れないことを控えめに述べる。as far as I know とほぼ同じ意味。	to(〜まで)＋the best(最大限)＋of one's knowledge(その人の知識の)。自分の知識が及ぶ最大限まででということから「〜の知る限りでは」。
to the contrary	pre2	それと反対の趣旨の	There is no evidence to the contrary.	それと反対の証拠はない。	idiom	名詞の後ろに置く（evidence to the contrary）。on the contrary は「それどころか」で意味が違う。	to(〜に向かう)＋the contrary(反対のこと)。反対のことを示す方向にということから「それと反対の趣旨の」。
to the effect that	pre1	〜という趣旨の	We received a message to the effect that the event was canceled.	催しが中止だという趣旨の連絡を受けた。	structure	言葉どおりではなく内容をまとめて伝えるときに使う（a message to the effect that …）。	to(〜に向かう)＋the effect(趣旨)＋that(〜という)。effect を「趣旨」の意味で使い、〜という趣旨を持つことから「〜という趣旨の」。
to the full	pre1	十分に・心ゆくまで	Enjoy the holiday to the full.	休暇を心ゆくまで楽しみなさい。	idiom	enjoy・use などの後ろに置く。米国では to the fullest とも言う。	to(〜まで)＋the full(いっぱいの状態)。いっぱいになるところまでということから「十分に・心ゆくまで」。
to the point	2	要点を突いて	Her answer was brief and to the point.	彼女の答えは簡潔で要点を突いていた。	idiom	brief and to the point「簡潔で的を射た」の形でよく使う。get to the point は「本題に入る」。	to(〜に向かって)＋the point(要点)。要点にまっすぐ向かっていることから「要点を突いて」。
treat A to B	pre1	AにBをおごる・味わわせる	My aunt treated us to lunch.	おばが私たちに昼食をおごってくれた。	structure	名詞 treat は「おごり・ごちそう」（It's my treat.「私のおごりです」）。	treat(もてなす)＋A(人)＋to B(Bで)。AをBでもてなすことから「AにBをおごる・味わわせる」。
turn a blind eye to	pre2	〜を見て見ぬふりをする	We must not turn a blind eye to bullying.	いじめを見て見ぬふりしてはいけない。	idiom	不正や問題を知りながら黙認することを表す。	turn(向ける)＋a blind eye(見えない目)＋to(〜に)。〜に見えないほうの目を向けることから「〜を見て見ぬふりをする」。
turn A into B	pre2	AをBに変える	They turned the warehouse into a theater.	彼らは倉庫を劇場に変えた。	structure	自動詞で A turns into B「AがBに変わる」とも使う。change A into B とほぼ同じ意味。	turn(変える)＋A＋into B(Bの中へ)。Aを変えてBの状態の中へ入れることから「AをBに変える」。
turn in	2	〜を提出する・寝る	Please turn in your report by Friday.	金曜日までに報告書を提出してください。	phrasal-verb	「提出する」は hand in / submit とほぼ同じ意味。「寝る」はくだけた言い方（I'll turn in early tonight.）。	turn(向きを変える)＋in(中へ)。書類を相手の手の中へ渡すことから「〜を提出する」、寝床の中へ入ることから「寝る」。
under way	2	進行中で	The repairs are already under way.	修理はすでに進行中だ。	idiom	get under way で「始まる」。1語で underway ともつづる。	under(〜の最中で)＋way(進行)。船が港を出て進んでいる状態を表した航海の言葉から「進行中で」。
up and down	2	上下に・あちこち	The boat moved up and down on the waves.	船は波の上で上下に動いた。	idiom	walk up and down the room で「部屋の中を行ったり来たりする」。	up(上へ)＋and down(下へ)。上へ下へと動くことから「上下に」、行ったり来たりすることから「あちこち」。
up to date	pre2	最新の	Keep your contact information up to date.	連絡先情報を最新に保ちなさい。	idiom	名詞の前ではハイフンを付けて up-to-date とする（up-to-date information）。反対は out of date。	up to(〜まで)＋date(日付)。今日の日付まで追いついていることから「最新の」。
upside down	pre2	上下逆さまに	The picture was hanging upside down.	その絵は上下逆さまに掛かっていた。	idiom	裏返しは inside out。turn ~ upside down で「〜をひっくり返す」。	もとは up so down（上がまるで下のように）で、のちに upside（上側）と結び付いて upside down になった。上側が下になっていることから「上下逆さまに」。
upwards of	pre1	〜を超える	The repair may cost upwards of ten thousand yen.	修理には1万円を超える費用がかかるかもしれない。	preposition	数量の前に置く。more than とほぼ同じ意味で、米国では upward of ともつづる。	upwards(上の方へ)＋of(〜から)。〜の数から上の方へということから「〜を超える」。
used to do	pre2	以前はよく〜した	I used to walk this path every day.	私は以前毎日この道を歩いたものだ。	structure	現在の習慣ではなく過去の習慣・状態を表す。be used to doing と区別する。	used(習慣にしていた)＋to do(〜すること)。古い動詞 use「習慣にする」の過去形から、以前は〜するのが習慣だったことを表して「以前はよく〜した」。
very much	4	とても	I enjoyed the concert very much.	私はその演奏会をとても楽しんだ。	idiom	動詞を強めるときは文末に置く（enjoyed the concert very much）。形容詞は very だけで強める（very happy）。	very(非常に)＋much(大いに)。much を very で強めた形で「とても」。
want to	3	〜したい	I want to learn another language.	私は別の言語を学びたい。	structure	to の後ろは動詞の原形。人にしてほしいなら want＋人＋to do。	want(欲しい)＋to do(〜すること)。want はもと「欠けている」の意味で、欠けているものを求めることから「欲しい」になり、〜することを欲して「〜したい」。
watch one's step	pre1	足元に気を付ける・行動に注意する	Watch your step on the wet floor.	ぬれた床では足元に気を付けて。	idiom	Watch your step. は注意を呼びかける決まり文句。「言動に気を付けろ」と警告する意味にもなる。	watch(注意して見る)＋one's step(自分の足の運び)。足の運びを注意して見ることから「足元に気を付ける」、自分の歩み方に気を付けることから「行動に注意する」。
wear out	2	使い古す・疲れ果てさせる	These shoes wore out after years of use.	この靴は何年も使ってすり減った。	phrasal-verb	自動詞で「すり減る」（These shoes wore out.）。受け身 be worn out で「疲れ果てている・すり切れている」。	wear(すり減らす)＋out(すっかり)。使ってすっかりすり減らすことから「使い古す」、人の力をすり減らすことから「疲れ果てさせる」。
Welcome to ~ .	4	〜へようこそ	Welcome to our school.	私たちの学校へようこそ。	conversation	場所の前に to を置く（Welcome to our school.）。home・back など副詞の前では to を付けない（Welcome home.）。	welcome(歓迎される)＋to(〜へ)。welcome はもと「喜ばれる客」の意味の語で、〜へ来た人を喜んで迎えることから「〜へようこそ」。
What ... for?	2	何のために〜か	What did you buy this rope for?	何のためにこのロープを買ったのですか。	structure	What for? だけでも「何のために」と聞き返せる。	what(何)＋...＋for(〜のために)。for what（何のために）の what を文頭に出した形で「何のために〜か」。
what ... is	2	〜の現在の姿・本質	Tourism made the town what it is today.	観光がその町を今日の姿にした。	structure	過去の姿は what ... was / used to be。what I am は「今の私」。	what(〜であるもの)＋...＋is(である)。今〜であるところのものということから「〜の現在の姿・本質」。
What about ~ ?	4	〜はどうですか	What about the second option?	二つ目の選択肢はどうですか。	conversation	提案のほか、話題を移して相手の考えをたずねるときに使う。How about ~? とほぼ同じ意味。	what(何)＋about ~(〜について)。〜についてはどうなのかとたずねることから「〜はどうですか」。
What is ... like?	2	〜はどのようなものか	What is your new teacher like?	新しい先生はどんな人ですか。	structure	人柄・場所・天気などの様子をたずねる。like を落とさない（What is your new teacher like?）。	what(何)＋is ...(〜は)＋like(〜に似ている)。〜は何に似ているかとたずねることから「〜はどのようなものか」。
what is more	pre1	さらに	The route is short; what is more, it is safe.	その道は短く、さらに安全だ。	discourse	前の内容に同じ方向の内容を重ねるときに使う。what is worse は「さらに悪いことに」。	what(〜であること)＋is more(それ以上である)。それ以上であることにはということから「さらに」。
what we call	pre1	いわゆる	This is what we call a feedback loop.	これはいわゆるフィードバック・ループだ。	structure	what is called / what you call も同じ意味。後ろに名詞を置く。	what(〜するもの)＋we call(私たちが呼ぶ)。私たちが〜と呼ぶものということから「いわゆる」。
what with A and B	pre2	AやらBやらで	What with the rain and the wind, we stayed home.	雨やら風やらで、私たちは家にいた。	structure	理由を2つ以上並べる言い方で、よくない結果を続けることが多い。	what(一部は)＋with A and B(AとBのせいで)。what は「一部は〜のため」の意味の古い用法で、AやBなどのせいでということから「AやらBやらで」。
What's up?	4	どうしたの・最近どう	You look worried. What's up?	心配そうだね。どうしたの。	conversation	親しい相手へのくだけたあいさつ。返事は Not much. / Nothing much. など。	what(何が)＋is up(持ち上がっている)。up を「起きている・持ち上がっている」の意味で使い、何が起きているのかとたずねることから「どうしたの・最近どう」。
when it comes to	pre1	〜のこととなると	When it comes to maps, Aya is the expert.	地図のこととなると、アヤが専門家だ。	preposition	to は前置詞なので、後ろは名詞・動名詞（when it comes to cooking）。動詞の原形は置かない。	when it comes(話が及ぶと)＋to(〜に)。話が〜に及ぶとということから「〜のこととなると」。
Why don't we ~ ?	4	〜しませんか	Why don't we take a short break?	少し休憩しませんか。	conversation	一緒にすることを提案する。Why don't you ~? は「〜したらどうですか」と相手に勧める言い方。	why(なぜ)＋don't we(私たちは〜しない)。なぜ〜しないのか、しようということから「〜しませんか」。
will do	2	間に合う・十分である	Any clean container will do.	清潔な容器ならどれでも間に合う。	idiom	物を主語にする（Any container will do.）。That will do. は「それで十分だ」。	will(〜だろう)＋do(足りる・間に合う)。do を「足りる」の意味で使い、それで足りるだろうということから「間に合う・十分である」。
with all	2	〜にもかかわらず	With all his experience, he still asks questions.	経験豊富なのに、彼は今も質問する。	preposition	for all とほぼ同じ意味で、後ろは名詞。文脈によっては「〜があるので」の意味にもなる（With all this noise, I can't sleep.）。	with(〜を持っていて)＋all(すべての)。〜をすべて持っていてもということから「〜にもかかわらず」。
worse still	pre1	さらに悪いことに	The road was narrow and, worse still, icy.	道は狭く、さらに悪いことに凍っていた。	discourse	文頭や文の途中に挟んで使う。what is worse / to make matters worse とほぼ同じ意味。	worse(より悪い)＋still(さらに)。さらにもっと悪いことにはということから「さらに悪いことに」。
would like A to do	4	Aに〜してほしい	I would like you to read this page.	あなたにこのページを読んでほしい。	structure	want A to do より丁寧。A が代名詞なら目的格にする（would like you to read）。	would like(〜を望む)＋A＋to do(〜すること)。Aが〜することを望むことから「Aに〜してほしい」。
would like to	4	〜したい	I would like to ask a question.	質問したいです。	structure	want to より丁寧。会話では I'd like to と短くする。	would like(〜を好むだろう)＋to do(〜すること)。would で控えめにした言い方で「〜したい」。
would rather do	2	むしろ〜したい	I would rather wait until morning.	私はむしろ朝まで待ちたい。	structure	比べる相手は than で示す（would rather walk than wait）。否定は would rather not do。	would(〜したい)＋rather(むしろ)＋do。rather はもと「より早く」の意味で、ほかよりむしろ〜したいことから「むしろ〜したい」。
Would you like ~ ?	4	〜はいかがですか	Would you like some water?	お水はいかがですか。	conversation	物を勧めるときは名詞、行動を勧めるときは to do を続ける。答えは Yes, please. / No, thank you. など。	would you like(あなたは〜を好むだろうか)。would で控えめにたずねることから「〜はいかがですか」。
yearn for	pre1	〜を切望する	People everywhere yearn for peace.	あらゆる場所の人々が平和を切望している。	preposition	long for とほぼ同じ意味で、手に入らないものを強く求める響きがある。	yearn(思い焦がれる)＋for(〜を求めて)。〜を求めて思い焦がれることから「〜を切望する」。
You're kidding me.	pre1	冗談でしょう	The train left already? You're kidding me.	列車はもう出たの。冗談でしょう。	conversation	驚きや信じられない気持ちを表すくだけた言い方。You're kidding. / Are you kidding? とも言う。	you're kidding(からかっている)＋me(私を)。kid を「からかう」の意味で使い、私をからかっているのだろうということから「冗談でしょう」。
`

export const CURRICULUM_1900_PHRASES_T_Z = Object.freeze(
  parseCurriculum1900PhraseRows(ROWS),
)
