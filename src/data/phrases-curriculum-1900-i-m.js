import { parseCurriculum1900PhraseRows } from './curriculum-phrase-utils.js'

// 正規形の英字順。
const ROWS = String.raw`
I see.	4	なるほど・分かりました	I see. That explains the delay.	なるほど。それで遅れた理由が分かりました。	conversation	相手の説明に納得したことを示すあいづち。	I(私は)＋see(分かる)。see を「目で見る」から「理解する」の意味で使い、「なるほど・分かりました」。
I'm afraid not.	pre1	残念ですが違います・できません	Will the shop reopen today? I'm afraid not.	店は今日また開きますか。残念ですが開きません。	conversation	相手の期待に反する返事を丁寧に伝える。「残念ながらそうです」は I'm afraid so.。	I'm afraid(残念ながら)＋not(そうではない)。残念ながらそうではないと答えることから「残念ですが違います・できません」。
if any	pre2	もしあれば・あるとしても	There are few errors, if any.	誤りは、あるとしてもほとんどない。	structure	few・little と一緒に「あるとしてもほとんどない」の意味で使う（few errors, if any）。	if(もし〜なら)＋any(いくらかでも)。もしいくらかでもあるならということから「もしあれば・あるとしても」。
if anything	pre1	どちらかといえば・むしろ	The second route is, if anything, safer.	二つ目の道は、どちらかといえばより安全だ。	discourse	前の内容と逆の方向に少し寄っていると言うときに挟む（is, if anything, safer）。	if(もし〜なら)＋anything(何かしら)。何か違いがあるとすればということから「どちらかといえば・むしろ」。
if it were not for	2	〜がなければ	If it were not for this map, we would be lost.	この地図がなければ私たちは迷っているだろう。	structure	主節は would＋動詞の原形。過去の事実に反するなら If it had not been for 〜。but for / without と同じ意味。	if(もし〜なら)＋it were not for(〜のためでなければ)。〜がなければと今の事実に反して仮定することから「〜がなければ」。
if only	2	〜でありさえすれば・〜だったらなあ	If only I had more time.	もっと時間があればなあ。	structure	かなわない願いを表すときは動詞を過去形・過去完了にする（If only I had more time.）。	if(もし〜なら)＋only(〜さえ)。もし〜でさえあればということから「〜でありさえすれば・〜だったらなあ」。
ill at ease	2	落ち着かない	The formal interview made me feel ill at ease.	正式な面接で私は落ち着かなかった。	idiom	at ease の反対。feel / look ill at ease の形でよく使う。	ill(悪く)＋at ease(くつろいで)。くつろいだ状態から悪い方にずれていることから「落ち着かない」。
in a row	pre1	連続して・一列に	Our team won three games in a row.	私たちのチームは3試合連続で勝った。	preposition	回数と一緒に使う（three games in a row）。	in(〜の状態で)＋a row(一列)。一列に並んだ状態から「一列に」、出来事が続けて並ぶことから「連続して」。
in a way	2	ある意味では	In a way, both answers are correct.	ある意味では、どちらの答えも正しい。	discourse	in a sense とほぼ同じ意味。全面的には言い切れない主張に使う。	in(〜の点で)＋a way(ある一つの見方)。ある一つの見方ではということから「ある意味では」。
in a word	2	一言で言えば	In a word, the experiment failed.	一言で言えば、その実験は失敗した。	discourse	話を短くまとめるときに文頭に置く。in short とほぼ同じ意味。	in(〜で)＋a word(一語)。一つの語で言い表すとということから「一言で言えば」。
in case of	3	〜の場合には	In case of fire, use the stairs.	火事の場合は階段を使いなさい。	preposition	後ろは名詞（in case of fire）。節なら in case 主語＋動詞 で「〜するといけないから」。	in case(場合に)＋of(〜の)。〜という場合にということから「〜の場合には」。
in danger of	2	〜の危険があって	The wetland is in danger of disappearing.	その湿地は消滅の危機にある。	preposition	of の後ろは名詞・動名詞（in danger of disappearing）。in danger だけでも「危険な状態で」。	in(〜の中に)＋danger(危険)＋of(〜の)。〜という危険の中にあることから「〜の危険があって」。
in demand	2	需要がある	Skilled technicians are in demand.	熟練技術者は需要がある。	idiom	人・技能・商品などに使う（are in demand）。in great demand で「大いに求められて」。	in(〜の中に)＋demand(需要)。求められている中にあることから「需要がある」。
in earnest	1	本気で・本格的に	Work began in earnest after lunch.	昼食後、仕事が本格的に始まった。	idiom	始まる・取り組むなどと一緒に使う（began in earnest）。	in(〜の状態で)＋earnest(まじめさ)。まじめな状態でということから「本気で・本格的に」。
in exchange for	2	〜と引き換えに	I gave her my notes in exchange for the book.	私はその本と引き換えに彼女へノートを渡した。	preposition	for の後ろに受け取るものを置く。in return for とほぼ同じ意味。	in(〜として)＋exchange(交換)＋for(〜と)。〜との交換としてということから「〜と引き換えに」。
in fashion	3	流行して	Wide trousers are in fashion again.	幅の広いズボンがまた流行している。	idiom	反対は out of fashion。come into fashion で「流行し始める」。	in(〜の中に)＋fashion(流行)。流行の中にあることから「流行して」。
in good shape	1	調子がよい・良好な状態で	The old bicycle is still in good shape.	その古い自転車はまだ良好な状態だ。	idiom	人の体調にも物の状態にも使う。反対は in bad shape。	in(〜の状態で)＋good shape(よい形・状態)。よい状態にあることから「調子がよい・良好な状態で」。
in harmony with	2	〜と調和して	The new building is in harmony with the park.	新しい建物は公園と調和している。	preposition	live in harmony with nature のように、人と自然・周りとの関係にも使う。	in(〜の状態で)＋harmony(調和)＋with(〜との)。〜と調和した状態にあることから「〜と調和して」。
in honor of	2	〜に敬意を表して	A concert was held in honor of the composer.	その作曲家に敬意を表して演奏会が開かれた。	preposition	式典・行事・記念の名付けに使う（named in honor of the founder）。	in(〜として)＋honor(敬意)＋of(〜への)。〜への敬意としてということから「〜に敬意を表して」。
in itself	2	それ自体では	Technology is not harmful in itself.	技術はそれ自体では有害ではない。	idiom	ほかの条件から切り離して評価する（not harmful in itself）。複数なら in themselves。	in(〜の中で)＋itself(それ自身)。それ自身の中だけで見るとということから「それ自体では」。
in line	3	列に並んで	We waited in line for tickets.	私たちは切符を買うため列に並んで待った。	preposition	wait / stand in line の形でよく使う。in line with は「〜と一致して」で意味が違う。	in(〜の中に)＋line(列)。列の中にいることから「列に並んで」。
in need	3	困って・必要として	The fund helps families in need.	その基金は困っている家庭を助ける。	idiom	名詞の後ろに置くことが多い（families in need）。何が必要かは in need of 〜 で示す。	in(〜の状態で)＋need(必要・困窮)。必要なものがない状態にあることから「困って・必要として」。
in order	2	順序よく・正常で	Please put the cards in order.	カードを順番に並べてください。	idiom	in order to do（〜するために）とは別の表現。out of order は「故障して・順序が乱れて」。	in(〜の状態で)＋order(順序・整った状態)。順序どおりに並んだ状態から「順序よく」、きちんと整った状態から「正常で」。
in part	2	一部は	The delay was caused in part by fog.	遅れは一部、霧が原因だった。	discourse	原因などが全部ではないことを表す（caused in part by fog）。partly とほぼ同じ意味。	in(〜の点で)＋part(部分)。部分的な点ではということから「一部は」。
in person	1	直接会って・本人が	You must apply in person.	本人が直接申し込まなければならない。	idiom	電話・手紙・オンラインでなく直接行うことを表す（apply in person）。	in(〜の形で)＋person(本人の体)。本人が体ごとその場にいる形でということから「直接会って・本人が」。
in place	2	所定の位置に・準備が整って	The safety measures are now in place.	安全対策は今や整っている。	idiom	制度・対策が実施されていることにも使う（measures are in place）。out of place は「場違いで」。	in(〜の中に)＋place(所定の場所)。所定の場所に収まっていることから「所定の位置に」、仕組みが用意されていることから「準備が整って」。
in preparation for	pre2	〜に備えて	We practiced daily in preparation for the contest.	大会に備えて私たちは毎日練習した。	preposition	for の後ろに行事・試験などを置く。to prepare for とほぼ同じ意味。	in(〜として)＋preparation(準備)＋for(〜への)。〜への準備としてということから「〜に備えて」。
in principle	pre1	原則として	I agree with the proposal in principle.	私は原則としてその提案に賛成だ。	discourse	細かい点は別として基本の考えに賛成するときに使う（agree in principle）。「理論上は」の意味にもなる。	in(〜の点で)＋principle(原則)。原則の点ではということから「原則として」。
in proportion to	pre1	〜に比例して	Costs rise in proportion to distance.	費用は距離に比例して増える。	preposition	一方が増えるともう一方も同じ割合で増えることを表す。out of proportion to は「釣り合わず」。	in(〜の状態で)＋proportion(釣り合い)＋to(〜との)。〜と釣り合いを保ってということから「〜に比例して」。
in reality	pre2	実際には	The task looked easy but was hard in reality.	その課題は簡単そうだったが、実際には難しかった。	discourse	見かけや予想と実際を対比する（looked easy but was hard in reality）。	in(〜の中では)＋reality(現実)。現実の中ではということから「実際には」。
in short	2	要するに	In short, we need a better plan.	要するに、もっとよい計画が必要だ。	discourse	長い説明を一言でまとめるときに文頭に置く。in brief も同じ意味。	in(〜で)＋short(短い形)。短い形でまとめるとということから「要するに」。
in store for	1	〜を待ち受けて	No one knew what was in store for us.	何が私たちを待ち受けているか誰にも分からなかった。	idiom	be in store for 人 の形で、これから起こることを表す（what was in store for us）。	in store(蓄えられて・用意されて)＋for(〜のために)。〜のために先に用意されていることから「〜を待ち受けて」。
in that	pre2	〜という点で	This method is useful in that it saves time.	この方法は時間を節約するという点で有用だ。	structure	後ろに主語＋動詞を置く（useful in that it saves time）。理由を限定して示す改まった表現。	in(〜の点で)＋that(〜という)。〜という点においてということから「〜という点で」。
in the air	pre2	気配が漂って・未決定で	Excitement was in the air.	興奮した空気が漂っていた。	idiom	雰囲気・うわさ・季節の気配に使う。「未決定」は up in the air の形が多い。	in(〜の中に)＋the air(空気)。空気の中に漂っていることから「気配が漂って」、宙に浮いて決まっていないことから「未決定で」。
in the distance	pre2	遠くに	We could see mountains in the distance.	遠くに山々が見えた。	preposition	見える・聞こえる物の位置を表す（see mountains in the distance）。at a distance は「少し離れて」。	in(〜の中に)＋the distance(遠い所)。遠く離れた所にということから「遠くに」。
in the first place	2	そもそも・第一に	Why did you agree in the first place?	そもそも、なぜ同意したのですか。	discourse	疑問文・否定文の文末で「そもそも」（Why did you agree in the first place?）。	in(〜で)＋the first place(最初の場所)。最初の段階ではということから「そもそも」、並べる最初の点として「第一に」。
in the middle of	5	〜の真ん中に・〜の最中に	Do not call me in the middle of class.	授業の最中に電話しないで。	preposition	場所にも時間・行為にも使う（in the middle of class）。	in(〜の中に)＋the middle(真ん中)＋of(〜の)。〜の真ん中にあることから「〜の真ん中に」、行為の途中にあることから「〜の最中に」。
in the presence of	2	〜のいる所で	The document was signed in the presence of two witnesses.	その文書は2人の証人の前で署名された。	preposition	改まった場面や証人がいる場面に使う。in the absence of は「〜がいない所で・〜がない場合に」。	in(〜の中で)＋the presence(その場にいること)＋of(〜が)。〜がその場にいる中でということから「〜のいる所で」。
in the way	2	邪魔になって	Your bag is in the way.	あなたのかばんが邪魔になっている。	idiom	get in the way で「邪魔になる」。on the way は「途中で」で意味が違う。	in(〜の中に)＋the way(通り道)。通り道の中にあることから「邪魔になって」。
in the way of	pre2	〜の点で・〜の妨げになって	The village has little in the way of public transport.	その村には公共交通と呼べるものがほとんどない。	idiom	「〜と呼べるもの」は little / nothing と一緒に使う（little in the way of public transport）。	in(〜の中で)＋the way(種類・道)＋of(〜の)。〜という種類の中でということから「〜の点で」、〜の通り道にあることから「〜の妨げになって」。
in the works	pre1	準備中で	A new library is in the works.	新しい図書館が準備中だ。	idiom	新しい計画・製品などがまだ完成していないことを表す（A new library is in the works.）。	in(〜の中に)＋the works(作業場・仕掛け)。作業場の中で作っている最中であることから「準備中で」。
inside out	pre2	裏返しに・隅々まで	Your shirt is inside out.	あなたのシャツは裏返しだ。	idiom	know ~ inside out で「〜を隅々まで知っている」。上下逆さまは upside down。	inside(内側)＋out(外へ)。内側が外に出ていることから「裏返しに」、内側まで知り尽くすことから「隅々まで」。
It couldn't be better.	pre1	これ以上よくなりようがない	How was the trip? It couldn't be better.	旅行はどうでしたか。最高でした。	conversation	調子や結果が最高だと答える会話表現。反対は It couldn't be worse.「最悪だ」。	could not(ありえない)＋be better(もっとよくなる)。今よりよくなることはありえないことから「これ以上よくなりようがない」。
It goes without saying that	pre1	〜は言うまでもない	It goes without saying that safety comes first.	安全が第一なのは言うまでもない。	structure	that の後ろに当然の内容を置く。Needless to say, とほぼ同じ意味。	it goes(それは通る)＋without saying(言わなくても)。言わなくても通じることから「〜は言うまでもない」。
It happens that	pre1	たまたま〜である	It happens that I know the owner.	たまたま私はその所有者を知っている。	structure	happen to do に言いかえられる（I happen to know the owner.）。	it happens(偶然そうなっている)＋that(〜ということが)。〜ということが偶然起きていることから「たまたま〜である」。
It is high time that	pre1	もう〜してよい頃だ	It is high time that we took action.	もう私たちが行動を起こしてよい頃だ。	structure	that 節では過去形を用いて、今すべきことを表す。	it is high time(真っ盛りの時だ)＋that(〜する)。high は「真っ盛りの」の意味で（high noon「正午ちょうど」と同じ）、〜すべき時がすっかり来ていることから「もう〜してよい頃だ」。
It is no wonder that	pre1	〜は不思議ではない	It is no wonder that she is tired.	彼女が疲れているのは不思議ではない。	structure	会話では No wonder she is tired. と It is を省く。理由が分かって納得したときに使う。	no wonder(驚くことではない)＋that(〜ということは)。〜ということは不思議でも何でもないことから「〜は不思議ではない」。
It is not long before	pre1	まもなく〜する	It was not long before the sun appeared.	まもなく太陽が現れた。	structure	過去なら It was not long before …。before の後ろは主語＋動詞。	it is not long(長くはない)＋before(〜するまでに)。〜するまでに長い時間はかからないことから「まもなく〜する」。
It is not until ... that	pre1	〜して初めて…する	It was not until noon that the fog lifted.	正午になって初めて霧が晴れた。	structure	not until の部分を強める強調構文。Not until ... did ... と倒置する言い方もある。	it is not until ...(〜になるまではそうではない)＋that(…する)。〜になって初めて…することを強調する形から「〜して初めて…する」。
It is said that ...	3	〜だと言われている	It is said that the lake never freezes.	その湖は決して凍らないと言われている。	structure	主語を変えて They say that … / 主語 is said to do とも言える。	it is said(言われている)＋that(〜と)。人々によって〜と言われていることから「〜だと言われている」。
it is time to	4	〜する時間だ	It is time to go home.	家に帰る時間だ。	structure	to の後ろは動詞の原形。It is time for 名詞 の形もある（It is time for lunch.）。	it is time(時間だ)＋to do(〜する)。〜するための時間になっていることから「〜する時間だ」。
It is true that ..., but ...	pre1	確かに〜だが…	It is true that the plan costs more, but it is safer.	確かにその計画は費用が高いが、より安全だ。	structure	相手の意見を認めてから自分の主張を述べる譲歩の型。Of course ..., but … とも言う。	it is true(本当だ)＋that(〜ということは)＋but(しかし)。〜はいったん本当だと認めたうえで反対の点を言うことから「確かに〜だが…」。
joking aside	2	冗談はさておき	Joking aside, we need to decide today.	冗談はさておき、今日決める必要がある。	discourse	冗談の後にまじめな話に戻るとき文頭に置く。Seriously, とほぼ同じ意味。	joking(冗談を言うこと)＋aside(わきに置いて)。冗談をわきに置いてということから「冗談はさておき」。
judging from	2	〜から判断すると	Judging from the clouds, it may snow.	雲から判断すると、雪になるかもしれない。	preposition	分詞構文の決まった形で、文頭に置く。judging by も同じ意味。	judging(判断すると)＋from(〜から)。〜を材料に判断するとということから「〜から判断すると」。
Just a moment.	4	ちょっと待ってください	Just a moment. I'll find the file.	ちょっと待ってください。ファイルを探します。	conversation	Just a minute. / One moment, please. とも言う。電話や受付でよく使う。	just(ちょっと)＋a moment(一瞬)。ほんの一瞬待ってほしいと頼むことから「ちょっと待ってください」。
just about	3	ほとんど・だいたい	We are just about ready.	私たちはほぼ準備ができている。	idiom	ready・finished などの前に置く（just about ready）。almost とほぼ同じ意味。	just(ちょうど)＋about(だいたい)。ちょうどと言っていいほどだいたいということから「ほとんど・だいたい」。
Just as ..., so ...	pre1	ちょうど〜であるように…である	Just as exercise strengthens the body, so reading trains the mind.	運動が体を強くするように、読書は心を鍛える。	structure	似た関係の2つを比べて説明する。so の後ろで主語と動詞が倒置されることもある。	just as(ちょうど〜のように)＋so(そのように)。ちょうど〜であるのと同じように…だと並べることから「ちょうど〜であるように…である」。
keep ~ company	pre1	〜と一緒にいて寂しくさせない	I stayed to keep my grandmother company.	祖母が寂しくないよう一緒にいた。	structure	company に冠詞を付けない。keep company with 人 は「〜と付き合う」。	keep(保つ)＋~(人)＋company(同席・仲間)。人のそばに仲間としていることを保つことから「〜と一緒にいて寂しくさせない」。
keep ~ in mind	2	〜を心に留めておく	Keep the deadline in mind.	締め切りを心に留めておきなさい。	structure	~ が長いときは keep in mind that … の語順にする。bear ~ in mind も同じ意味。	keep(保つ)＋~＋in mind(心の中に)。〜を心の中にとどめておくことから「〜を心に留めておく」。
keep an eye on	2	〜を見守る	Could you keep an eye on my bag?	私のかばんを見ていてくれますか。	idiom	荷物・子ども・状況などを注意して見ておくことを表す（keep an eye on my bag）。	keep(保つ)＋an eye(目)＋on(〜の上に)。目を〜の上に置き続けることから「〜を見守る」。
keep doing	pre2	〜し続ける	Keep practicing every day.	毎日練習を続けなさい。	structure	keep の後ろは動名詞（Keep practicing.）。keep on doing も同じ意味。	keep(保つ)＋doing(〜していること)。〜している状態を保つことから「〜し続ける」。
keep on ~ing	5	〜し続ける	He kept on asking the same question.	彼は同じ質問をし続けた。	structure	keep doing より、しつこく続ける感じが出る（kept on asking the same question）。	keep on(続けて)＋~ing(〜すること)。on が「続けて」を表し、〜することを続けることから「〜し続ける」。
keep one's fingers crossed	pre2	幸運を祈る	Keep your fingers crossed for us.	私たちの幸運を祈っていてください。	idiom	for の後ろに祈る相手を置く（Keep your fingers crossed for us.）。	keep(保つ)＋one's fingers crossed(指を交差させた状態)。人差し指と中指を交差させて幸運を願うしぐさから「幸運を祈る」。
keep one's temper	2	怒りを抑える	She kept her temper during the argument.	彼女は口論の間も怒りを抑えた。	idiom	反対は lose one's temper「かっとなる」。	keep(保つ)＋one's temper(落ち着いた気分)。temper をここでは「落ち着いた気分」の意味で使い、それを保つことから「怒りを抑える」。
keep pace with	pre2	〜に遅れずついていく	Small firms struggle to keep pace with change.	小企業は変化に遅れずついていこうと苦労する。	idiom	変化・技術・需要など速く動くものに使う。keep up with とほぼ同じ意味。	keep(保つ)＋pace(歩調・速さ)＋with(〜と)。〜と同じ歩調を保つことから「〜に遅れずついていく」。
keep track of	pre1	〜の経過を把握する	This chart helps us keep track of costs.	この表で費用の推移を把握できる。	idiom	反対は lose track of「〜が分からなくなる」。予算・時間・人の居場所などに使う。	keep(保つ)＋track(通った跡)＋of(〜の)。〜の通った跡を見失わずに保つことから「〜の経過を把握する」。
know ~ by sight	pre2	〜の顔は知っている	I know the teacher by sight but not by name.	その先生は顔だけ知っていて名前は知らない。	structure	直接の付き合いはないことを含む。名前を知っているなら know ~ by name。	know(知っている)＋~(人)＋by sight(見た目で)。見た目によって知っているだけということから「〜の顔は知っている」。
know better than to do	pre1	〜するほど愚かではない	You should know better than to trust that rumor.	君ならそのうわさを信じたりしない分別があるはずだ。	structure	should know better than to do で「〜するべきではないと分かっているはずだ」と相手をとがめる。	know better(もっと分別がある)＋than to do(〜するよりは)。〜するよりはましな分別があることから「〜するほど愚かではない」。
last but not least	pre2	最後だが重要な	Last but not least, thank you to our volunteers.	最後になりましたが、ボランティアの皆さんに感謝します。	discourse	スピーチや一覧の最後の項目を紹介するときの決まり文句。	last(最後だが)＋but not least(一番小さいわけではない)。順番は最後でも重要さは劣らないということから「最後だが重要な」。
learn ~ by heart	pre2	〜を暗記する	We learned the poem by heart.	私たちはその詩を暗記した。	structure	詩・せりふ・番号などに使う。memorize とほぼ同じ意味。	learn(覚える)＋~＋by heart(心で)。心に刻んで覚えることから「〜を暗記する」。
leave ~ alone	pre2	〜を放っておく	Leave the sleeping dog alone.	眠っている犬をそっとしておきなさい。	structure	人・物・話題に使う（Leave me alone.「ほっといて」）。let alone は「〜はもちろん」で別の表現。	leave(置いておく)＋~＋alone(そのままに)。手を出さずにそのままにしておくことから「〜を放っておく」。
leave A to B	2	AをBに任せる	Leave the final choice to me.	最終判断は私に任せてください。	structure	Leave it to me.「私に任せて」の形でよく使う。遺産を残す意味にもなる。	leave(ゆだねて置いていく)＋A＋to B(Bに)。AをBの手にゆだねて置いていくことから「AをBに任せる」。
leave nothing to be desired	pre2	申し分がない	The service leaves nothing to be desired.	そのサービスは申し分ない。	idiom	反対は leave much to be desired「不十分な点が多い」。	leave(残す)＋nothing(何も〜ない)＋to be desired(望まれるべき)。これ以上望むことを何も残さないことから「申し分がない」。
Legend has it that	pre1	伝説によれば〜だ	Legend has it that a giant built the wall.	伝説によれば巨人がその壁を築いたという。	structure	has it は「〜と言っている」の意味。Rumor has it that …「うわさでは〜だ」も同じ作り。	legend(伝説)＋has it(〜と伝えている)＋that(〜ということを)。伝説が〜と伝えていることから「伝説によれば〜だ」。
lest ~ should do	pre2	〜しないように	She spoke softly lest she should wake the baby.	赤ん坊を起こさないよう彼女は静かに話した。	structure	改まった書き言葉。should を省いて原形を使うこともある（lest she wake the baby）。for fear that とほぼ同じ意味。	lest(〜するといけないから)＋~＋should do。lest は「〜するといけないから」を表す古い接続詞で、「〜しないように」。
let alone	pre2	〜はもちろんのこと	He cannot cook an egg, let alone a full meal.	彼は卵すら料理できず、まして一食分など無理だ。	discourse	否定の内容の後に、それよりさらに難しいことを続ける（cannot cook an egg, let alone a full meal）。	let(させる)＋alone(そのままに)。〜のことは話に出すまでもなくということから、否定文の後で「〜はもちろんのこと」。
let go of	pre1	〜を手放す	Let go of the rope slowly.	ロープからゆっくり手を離しなさい。	phrasal-verb	物をつかむ手を離す意味と、考えや感情を手放す意味がある。let go だけでも使う。	let go(離してやる)＋of(〜を)。つかんでいた〜を離してやることから「〜を手放す」。
Let's see.	4	ええと・考えてみよう	Let's see. Where did I put the key?	ええと、鍵をどこに置いたかな。	conversation	答えをすぐ言えずに考えるときのつなぎの言葉。Let me see. も同じ意味。	let's(〜しよう)＋see(確かめる)。確かめてみようと言いながら考えることから「ええと・考えてみよう」。
lie in	pre2	〜にある	The solution lies in better communication.	解決策はよりよい意思疎通にある。	preposition	原因・解決策・価値などを主語にする（The solution lies in better communication.）。lie の活用は lay, lain。	lie(ある・横たわる)＋in(〜の中に)。問題の核心が〜の中にあることから「〜にある」。
live a ~ life	pre2	〜な生活を送る	They live a quiet life by the sea.	彼らは海辺で静かな生活を送っている。	structure	~ に形容詞を置く（live a quiet life）。live と life は同じ語源の組み合わせ。	live(送る)＋a ~ life(〜な生活)。〜な生活を生きることから「〜な生活を送る」。
long for	2	〜を切望する	The travelers longed for a hot meal.	旅行者たちは温かい食事を切望した。	preposition	for の後ろは名詞。動詞なら long to do。	long(待ち遠しく思う)＋for(〜を求めて)。動詞 long は「長く感じる」から「待ち遠しく思う」の意味になり、〜を求めて待ち遠しく思うことから「〜を切望する」。
look ~ in the eye	pre1	〜の目をまっすぐ見る	Look me in the eye and tell the truth.	私の目を見て本当のことを言いなさい。	structure	正直さや自信を示す場面で使う（Look me in the eye and tell the truth.）。	look(見る)＋~(人)＋in the eye(目の中を)。人の目の中をまっすぐ見ることから「〜の目をまっすぐ見る」。
look on A as B	pre2	AをBと見なす	Many people look on the park as a shared garden.	多くの人がその公園を共有の庭と見なしている。	structure	regard A as B / see A as B とほぼ同じ意味。B には名詞・形容詞を置く。	look on(見る)＋A＋as B(Bとして)。AをBとして見ることから「AをBと見なす」。
look to	2	〜に期待する・注意を向ける	We look to science for answers.	私たちは答えを科学に求める。	preposition	look to A for B で「AにBを求める」（look to science for answers）。	look(目を向ける)＋to(〜の方へ)。助けや答えを求めて〜の方へ目を向けることから「〜に期待する・注意を向ける」。
lose face	pre2	面目を失う	He feared losing face in front of the team.	彼はチームの前で面目を失うことを恐れた。	idiom	反対は save face「面目を保つ」。face に冠詞を付けない。	lose(失う)＋face(面目)。face をここでは「人前での体面」の意味で使い、それを失うことから「面目を失う」。
major in	pre2	〜を専攻する	She majors in biology.	彼女は生物学を専攻している。	preposition	大学での専攻に使う（major in biology）。名詞 major は「専攻科目」。	major(専攻する)＋in(〜の分野で)。〜の分野を主に学ぶことから「〜を専攻する」。
make a point of doing	2	必ず〜するようにする	I make a point of checking every source.	私は必ずすべての出典を確認するようにしている。	structure	of の後ろは動名詞（make a point of checking every source）。	make(する)＋a point(大事な点)＋of doing(〜することを)。〜することを大事な点にしていることから「必ず〜するようにする」。
make believe that	pre1	〜のふりをする	The children made believe that the box was a ship.	子どもたちは箱を船に見立てて遊んだ。	idiom	子どもの遊びでよく使う。名詞 make-believe は「見せかけ・ごっこ遊び」。	make(させる)＋believe(信じる)＋that(〜と)。自分や周りに〜と信じさせるように振る舞うことから「〜のふりをする」。
make do with	pre1	〜で間に合わせる	We had to make do with one small room.	私たちは小さな一部屋で間に合わせなければならなかった。	idiom	with の後ろは不十分なもの。make do without は「〜なしで済ませる」。	make do(何とかやっていく)＋with(〜で)。十分ではない〜で何とかやっていくことから「〜で間に合わせる」。
make fun of	pre2	〜をからかう	Do not make fun of other people's mistakes.	他人の失敗をからかってはいけない。	idiom	悪気のある笑いに使うことが多い。laugh at とほぼ同じ意味。	make(作る)＋fun(からかい)＋of(〜を種に)。〜を種にしてからかいの笑いを作ることから「〜をからかう」。
make good	pre1	成功する・約束を果たす	She worked hard and made good in business.	彼女は懸命に働き事業で成功した。	idiom	「約束を果たす」は make good on a promise の形がよく使われる。	make(〜になる)＋good(よい状態に)。よい状態になることから「成功する」、約束をよい形で果たすことから「約束を果たす」。
make it	2	間に合う・成功する	We can still make it before six.	私たちはまだ6時前に間に合う。	idiom	時間・場所に間に合う（make it before six）、困難を乗り越えて成功する意味がある。	make(成しとげる)＋it(その目標)。目標を成しとげることから「間に合う・成功する」。
make much of	2	〜を重視する・大げさに扱う	The report makes much of the cost difference.	その報告書は費用の違いを重視している。	idiom	反対は make little of「〜を軽く見る」。	make(扱う)＋much(大きく)＋of(〜を)。〜を大きなものとして扱うことから「〜を重視する・大げさに扱う」。
make oneself understood	pre1	自分の考えを理解してもらう	I could make myself understood in simple English.	簡単な英語で自分の考えを理解してもらえた。	structure	外国語で意思を伝える場面によく使う（make myself understood in English）。	make(〜させる)＋oneself(自分自身を)＋understood(理解された状態に)。自分を理解された状態にすることから「自分の考えを理解してもらう」。
make the best of	2	不利な状況を最大限に生かす	We made the best of the rainy afternoon.	私たちは雨の午後をできる限り楽しんだ。	idiom	悪い条件の中でできるだけのことをする。make the most of はよい条件を最大限に生かす。	make(する)＋the best(最善)＋of(〜の)。不利な〜から最善を引き出すことから「不利な状況を最大限に生かす」。
make the most of	2	〜を最大限に活用する	Make the most of your time abroad.	海外での時間を最大限に活用しなさい。	idiom	機会・時間・才能などよい条件に使う（Make the most of your time abroad.）。	make(する)＋the most(最大)＋of(〜の)。〜から最大のものを引き出すことから「〜を最大限に活用する」。
make way	pre2	道を譲る・取って代わられる	The old bridge made way for a new one.	古い橋は新しい橋に場所を譲った。	idiom	譲る相手は for で示す（made way for a new one）。	make(作る)＋way(通り道)。通り道を作ってあけることから「道を譲る」、後から来るものに場所をあけることから「取って代わられる」。
manage to do	2	何とか〜する	We managed to finish before dark.	私たちは暗くなる前に何とか終えた。	structure	実際にやりとげたことを表す。過去の1回の成功には could より managed to が合う。	manage(うまく扱う)＋to do(〜することを)。困難をうまく扱って〜することから「何とか〜する」。
many a	1	多くの〜	Many a traveler has lost the path here.	多くの旅行者がここで道に迷ってきた。	structure	単数名詞を続け、動詞も単数扱いにする。	many(多くの)＋a(1つの)。多くのものを1つずつ思い浮かべる言い方で「多くの〜」。
may well do	2	〜するのももっともだ・おそらく〜する	You may well be surprised by the result.	その結果に驚くのももっともだ。	structure	might well も同じ意味。may as well（〜したほうがよい）とは違う。	may(〜かもしれない)＋well(十分に)。十分にありうることから「おそらく〜する」、十分な理由があることから「〜するのももっともだ」。
Me, too.	4	私もです	I love this song. Me, too.	私はこの歌が大好きです。私もです。	conversation	相手の肯定の文に同意するくだけた言い方。否定文への同意は Me neither.。	me(私)＋too(〜も)。私も同じだということから「私もです」。
meet with	2	〜を経験する・〜と会う	The proposal met with strong opposition.	その提案は強い反対に遭った。	preposition	「経験する」では反対・成功・事故などを後ろに置く（met with strong opposition）。	meet(出会う)＋with(〜と)。〜と出くわすことから「〜を経験する」、人と約束して会うことから「〜と会う」。
might as well do	2	〜するほうがよい	We might as well walk; the bus is late.	バスが遅いので歩いたほうがよさそうだ。	structure	消極的な提案に使う（We might as well walk.）。may as well も同じ意味。	might as well(同じくらいよい)＋do(〜しても)。ほかの選択と同じくらいよいのでということから「〜するほうがよい」。
miss out on	pre1	〜の機会を逃す	Don't miss out on this chance.	この機会を逃さないで。	phrasal-verb	on の後ろに機会・楽しみを置く（Don't miss out on this chance.）。	miss out(逃す)＋on(〜の機会を)。〜のよい機会を逃すことから「〜の機会を逃す」。
mistake A for B	pre2	AをBと間違える	I mistook the shadow for a person.	私は影を人と間違えた。	structure	受け身 be mistaken for もよく使う。confuse A with B とほぼ同じ意味。	mistake(取り違える)＋A＋for B(Bと)。AをBだと取り違えることから「AをBと間違える」。
more and more	4	ますます多くの	More and more students cycle to school.	ますます多くの生徒が自転車で通学している。	structure	名詞の前にも形容詞の前にも置く（more and more students / more and more difficult）。	more(より多く)を and で重ねた形。より多くがどんどん加わることから「ますます多くの」。
more often than not	1	たいてい	More often than not, the simple answer is best.	たいてい、単純な答えが最善だ。	idiom	usually とほぼ同じ意味で、半分より多いことを表す。	more often(より多く)＋than not(そうでない時よりも)。そうでない時より多いことから「たいてい」。
more or less	pre2	だいたい・多かれ少なかれ	The work is more or less complete.	仕事はだいたい完成している。	idiom	完全ではないことを表す（more or less complete）。	more(より多い)＋or less(あるいはより少ない)。多少の差はあってもということから「だいたい・多かれ少なかれ」。
much less	pre1	まして〜ない	He cannot read French, much less write it.	彼はフランス語を読めず、まして書けない。	discourse	否定文の後に置く（cannot read French, much less write it）。let alone とほぼ同じ意味。	much(ずっと)＋less(より少なく)。否定の後で、それよりずっと当てはまらないことから「まして〜ない」。
My pleasure.	4	どういたしまして	Thank you for your help. My pleasure.	手伝ってくれてありがとう。どういたしまして。	conversation	It's my pleasure. / The pleasure is mine. とも言う。You're welcome. より丁寧な響き。	my(私の)＋pleasure(喜び)。それは私にとって喜びだと答えることから、お礼への「どういたしまして」。
`

export const CURRICULUM_1900_PHRASES_I_M = Object.freeze(
  parseCurriculum1900PhraseRows(ROWS),
)
