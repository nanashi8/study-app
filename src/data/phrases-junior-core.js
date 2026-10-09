import { splitMeanings } from './compact.js'

// 中学で学ぶ基本の熟語・構文（2026-10-09 に足した）。見出しは英字順（localeCompare の base：大文字小文字・記号を区別しない）。
// 列：見出し・級・意味・例文（英）・例文（和）・種類・注意書き・成り立ち。
// 注意書きと成り立ちは行ごとにその表現だけの文を書く（種類ごとの決まり文句で埋めない）。
// id は級を含めない（級を見直しても学習記録のキーが変わらないように）。
const CATEGORIES = new Set(['phrasal-verb', 'collocation', 'preposition', 'structure', 'discourse', 'conversation', 'idiom'])

const slug = (value) => value
  .toLowerCase()
  .replace(/one['’]s/g, 'ones')
  .replace(/~|\.\.\./g, 'blank')
  .replace(/[^a-z0-9]+/g, '_')
  .replace(/^_|_$/g, '')

const parseRows = (source) => source.trim().split('\n').map((line) => line.trim()).filter(Boolean).map((line, index) => {
  const [phrase, level, meaning, en, ja, category, note, origin, ...rest] = line.split('\t')
  if (!phrase || !level || !meaning || !en || !ja || !CATEGORIES.has(category) || !note || !origin || rest.length) {
    throw new Error(`中学の基本熟語 ${index + 1}行目: 必須列（注意書き・成り立ちを含む）またはcategoryが不正`)
  }
  return {
    id: `jr_idm_${slug(phrase)}`,
    kind: 'idiom',
    level,
    phrase,
    meaning,
    meanings: splitMeanings(meaning),
    example: { en, ja },
    origin,
    note,
    category,
  }
})

export const JUNIOR_CORE_PHRASES = Object.freeze(parseRows(String.raw`
~ kinds of	4	〜種類の	This shop sells many kinds of bread.	この店はたくさんの種類のパンを売っている。	collocation	~ には many・different・all・three などを入れる。a kind of は「一種の」。	kinds(種類)＋of(〜の)。前に数や量を表す語を置き、何種類あるかを表すことから「〜種類の」。
~ years later	4	〜年後	Ten years later, he came back to his hometown.	10年後、彼はふるさとに帰ってきた。	collocation	過去のある時から数えて「〜年後」。今から数えるときは in ten years。	years(年)＋later(あとで)。ある時から何年かたったあとでということから「〜年後」。
~ years old	5	〜歳	My sister is ten years old.	妹は10歳だ。	collocation	1歳は one year old。「10歳の少女」は a ten-year-old girl とハイフンでつなぎ、year を単数にする。	years(年)＋old(年をとった)。生まれてから何年たったかを表すことから「〜歳」。
a long time ago	4	ずっと前に・昔	This temple was built a long time ago.	この寺はずっと昔に建てられた。	collocation	ago は過去形の文で使い、現在完了の文には使わない。「ずっと前から〜している」なら for a long time。	a long time(長い時間)＋ago(前に)。今から長い時間をさかのぼった時にということから「ずっと前に」。
a member of	4	〜の一員	She is a member of the tennis club.	彼女はテニス部の一員だ。	collocation	部活動には club を使うことが多い。二人以上なら members of にする。	a member(一人の構成員)＋of(〜の)。集まりを作っている一人ということから「〜の一員」。
all day long	4	一日中	It rained all day long yesterday.	昨日は一日中雨が降った。	collocation	all day だけでも同じ意味。long を付けると「ずっと」の感じが強くなる。前に in を付けない。	all day(一日じゅう)＋long(ずっと)。一日の間ずっとということを強めて「一日中」。
and then	5	それから	We had dinner, and then we watched a movie.	私たちは夕食を食べて、それから映画を見た。	discourse	出来事を起こった順に並べるときに使う。then だけでも「それから」の意味になる。	and(そして)＋then(その次に)。前のことに続けてその次にということから「それから」。
around the world	4	世界中で・世界中の	Students around the world study English.	世界中の生徒が英語を勉強している。	preposition	all over the world とほぼ同じ意味。名詞の後ろに置くと「世界中の〜」になる（people around the world）。	around(〜のあちこちに)＋the world(世界)。世界のあちこちにということから「世界中で」。
as ... as ~	4	〜と同じくらい…	My brother is as tall as my father.	兄は父と同じくらいの背の高さだ。	structure	as と as の間には形容詞・副詞のもとの形を置く。否定の not as ... as は「〜ほど…ではない」。	as(同じくらい)＋形容詞・副詞＋as(〜と比べて)。二つを比べて程度が等しいことから「〜と同じくらい…」。
as ... as one can	3	できるだけ…	I ran as fast as I could.	私はできるだけ速く走った。	structure	as ... as possible に言いかえられる。one は主語に合わせ、過去の文では could にする。	as ... as(同じくらい…)＋one can(自分ができる)。自分にできる限りと同じくらい…ということから「できるだけ…」。
ask A to do	3	Aに〜するように頼む	I asked my friend to carry the box.	私は友達にその箱を運んでくれるように頼んだ。	structure	A には人を置く。ask A for B は「AにBを求める」で、後ろに物を置く。	ask(頼む)＋A(人)＋to do(〜すること)。人に、これから〜することを頼むことから「Aに〜するように頼む」。
at any time	3	いつでも	You can call me at any time.	いつでも電話してください。	collocation	at を省いて any time とも言う。「いつか」なら some time・sometime。	at(〜の時に)＋any time(どの時でも)。どの時を選んでもよいということから「いつでも」。
at the end of	3	〜の終わりに	We have a test at the end of this month.	今月の終わりにテストがある。	preposition	「〜の初めに」は at the beginning of。in the end（結局）と区別する。	at(〜の時点で)＋the end(終わり)＋of(〜の)。〜が終わるその時点でということから「〜の終わりに」。
at the time	3	その時(は)・当時	I was only five at the time.	私は当時まだ5歳だった。	collocation	at that time とほぼ同じ意味。「同時に」は at the same time で、意味が違う。	at(〜の時点で)＋the time(その時)。話に出ているその時点でということから「当時」。
away from	4	〜から離れて	The station is two kilometers away from my house.	駅は私の家から2キロ離れている。	preposition	距離を言うときは数を away の前に置く（two kilometers away from）。keep away from は「〜に近づかない」。	away(離れて)＋from(〜から)。〜から離れた所にということから「〜から離れて」。
be glad to do	4	〜してうれしい・喜んで〜する	I'm glad to hear the good news.	よい知らせを聞いてうれしい。	structure	be happy to do とほぼ同じ意味。うれしい理由を文で言うときは be glad that ... にする。	be glad(うれしい)＋to do(〜して)。〜したことでうれしい気持ちになっていることから「〜してうれしい」。
be going to do	4	〜するつもりだ・〜しそうだ	We are going to visit our grandparents this weekend.	私たちは今週末、祖父母を訪ねるつもりだ。	structure	be動詞は主語に合わせる（I am / He is going to）。空の様子などから「〜しそうだ」の意味でも使う（It is going to rain.）。	be going(向かって進んでいる)＋to do(〜することへ)。ある行動へ向かってもう進み始めていることから「〜するつもりだ・〜しそうだ」。
be happy to do	4	喜んで〜する・〜してうれしい	I'm happy to help you.	喜んでお手伝いします。	structure	申し出に使うと「喜んで〜します」。「〜してうれしい」の意味では I'm happy to see you. のように言う。	be happy(幸せな気持ちだ)＋to do(〜することに)。〜することを幸せに思っていることから「喜んで〜する」。
be known as	3	〜として知られている	Kyoto is known as the old capital of Japan.	京都は日本の古い都として知られている。	preposition	be known for（〜で有名だ）、be known to（〜に知られている）と区別する。	be known(知られている)＋as(〜として)。〜という名前や立場で人に知られていることから。
be made in	4	〜で作られている・〜製だ	This watch was made in Switzerland.	この時計はスイスで作られた。	preposition	in の後ろは国や場所。材料を言う be made of、原料を言う be made from と区別する。	be made(作られる)＋in(〜の中で)。〜という国や場所の中で作られることから「〜製だ」。
be moved by	3	〜に感動する	I was moved by her speech.	私は彼女のスピーチに感動した。	preposition	move の「心を動かす」という意味を受け身にした形。be touched by もほぼ同じ意味。	be moved(心を動かされる)＋by(〜によって)。〜によって心が動かされることから「〜に感動する」。
be over	4	終わる・終わっている	Summer vacation is over.	夏休みは終わった。	collocation	be動詞を使って終わった状態を表す。The game is over. も同じ形。	be(〜である)＋over(すっかり済んで)。over が「済んで」の意味になり、済んだ状態であることから「終わっている」。
be popular among	3	〜の間で人気がある	This game is popular among young people.	このゲームは若い人の間で人気がある。	preposition	with も使える（popular with students）。among の後ろには複数の人を置く。	be popular(人気がある)＋among(〜の間で)。ある人々の集まりの中で好かれていることから。
be sure that ...	3	きっと〜だと思う・〜と確信している	I'm sure that you will win the game.	きっとあなたは試合に勝つと思う。	structure	that は省くことが多い。be sure to do は「必ず〜する」で、使い方が違う。	be sure(確かだと思っている)＋that ...(…ということ)。…ということを確かだと思っていることから「きっと〜だと思う」。
be surprised to do	3	〜して驚く	I was surprised to see snow in April.	4月に雪を見て驚いた。	structure	驚いた原因が名詞なら be surprised at にする（at the news）。	be surprised(驚いている)＋to do(〜して)。〜したことが原因で驚いていることから「〜して驚く」。
begin to do	4	〜し始める	The children began to sing a song.	子どもたちは歌を歌い始めた。	structure	begin doing もほぼ同じ意味。begin の過去形は began、過去分詞は begun。	begin(始める)＋to do(〜すること)。〜するという動作を始めることから「〜し始める」。
better than	4	〜よりよい・〜より上手に	Your idea is better than mine.	あなたの考えは私の考えよりよい。	structure	better は good・well の比較級。like A better than B は「BよりAが好きだ」。	better(よりよい：good・well の比較級)＋than(〜よりも)。二つを比べてこちらのほうがよいことから。
change A into B	3	AをBに変える	The witch changed the frog into a prince.	魔女はカエルを王子に変えた。	structure	into は「〜へと（変わって）」を表す。turn A into B とほぼ同じ意味。	change(変える)＋A＋into B(Bへと)。AをBの形へと変えることから「AをBに変える」。
change trains	3	電車を乗り換える	We changed trains at Tokyo Station.	私たちは東京駅で電車を乗り換えた。	collocation	2本の電車にかかわるので trains と複数形にする。バスなら change buses。	change(取り替える)＋trains(電車)。乗っている電車を別の電車と取り替えることから「乗り換える」。
choose to do	3	〜することに決める・〜するほうを選ぶ	She chose to study music at college.	彼女は大学で音楽を学ぶことに決めた。	structure	decide to do とほぼ同じだが、いくつかの中から選ぶ気持ちが強い。choose の過去形は chose。	choose(選ぶ)＋to do(〜すること)。いくつかの道の中から〜することを選ぶことから。
close to	3	〜の近くに・〜に近い	My house is close to the park.	私の家は公園の近くにある。	preposition	この close は形容詞で、「閉める」の close とは発音が違う。near とほぼ同じ意味。	close(近い)＋to(〜に)。〜に近い所にあることから「〜の近くに」。
come and do	4	〜しに来る	Come and see me tomorrow.	明日、会いに来てください。	structure	come to do の話し言葉の形。go and do は「〜しに行く」。	come(来る)＋and do(そして〜する)。来て、それから〜することから「〜しに来る」。
come home	5	帰宅する	My father comes home at seven.	父は7時に帰宅する。	collocation	home は副詞なので to を付けない（come to home は誤り）。get home・go home も同じ。	come(来る)＋home(家へ)。自分の家へ来ることから「帰宅する」。
come into	4	〜に入って来る	A bird came into the room.	鳥が部屋に入って来た。	phrasal-verb	話し手のいる所へ「入って来る」。go into は話し手から離れて「入って行く」。	come(来る)＋into(〜の中へ)。〜の中へやって来ることから「〜に入って来る」。
come out of	3	〜から出て来る	A man came out of the bank.	一人の男性が銀行から出て来た。	phrasal-verb	反対は come into。come out だけなら「出て来る・発表される」。	come out(外へ出て来る)＋of(〜から)。〜の中から外へ出て来ることから。
come to do	3	〜するようになる	Over time, I came to understand his feelings.	時がたつにつれて、私は彼の気持ちが分かるようになった。	structure	後ろには like・know・understand など、気持ちや知ることを表す動詞が多い。become to do とは言わない。	come(来る・たどり着く)＋to do(〜することへ)。時がたって、ある気持ちや状態にたどり着くことから「〜するようになる」。
connect to	3	〜につながる・〜に接続する	This road connects to the highway.	この道は幹線道路につながっている。	phrasal-verb	インターネットに「接続する」ときにも使う（connect to the internet）。connect A with B は「AとBを結びつける」。	connect(つなぐ)＋to(〜に)。〜とつながった状態になることから「〜につながる」。
continue to do	3	〜し続ける	The population of the city continues to grow.	その市の人口は増え続けている。	structure	continue doing もほぼ同じ意味。話し言葉では keep doing をよく使う。	continue(続ける)＋to do(〜すること)。〜することを途切れずに続けることから「〜し続ける」。
each of	3	〜のそれぞれ	Each of the students has a computer.	生徒たちのそれぞれがコンピューターを持っている。	collocation	単数として扱う（Each of them has ...）。of の後ろは the や代名詞の付いた複数形。	each(それぞれ)＋of(〜のうちの)。〜のうちの一つ一つということから「〜のそれぞれ」。
each year	4	毎年	The festival is held each year in August.	その祭りは毎年8月に開かれる。	collocation	every year とほぼ同じ。each は一年一年を分けて見る気持ちがある。前に in を付けない。	each(それぞれの)＋year(年)。一年一年のどの年もということから「毎年」。
enjoy doing	4	〜して楽しむ	My father enjoys cooking on Sundays.	父は日曜日に料理をして楽しむ。	structure	後ろは動名詞で、enjoy to cook とは言わない。enjoy oneself は「楽しく過ごす」。	enjoy(楽しむ)＋doing(〜すること)。していることそのものを楽しむことから「〜して楽しむ」。
even though	3	〜だけれども	He went out even though it was raining.	雨が降っていたけれども、彼は出かけた。	discourse	although とほぼ同じで、本当にあったことについて使う。even if は「たとえ〜でも」で、仮の話に使う。	even(〜でさえ)＋though(〜だけれども)。though を even で強めた形で「〜だけれども」。
finish doing	4	〜し終える	Did you finish writing your report?	レポートを書き終えましたか。	structure	後ろは動名詞で、finish to do とは言わない。	finish(終える)＋doing(〜していること)。していた動作を終わりまで済ませることから「〜し終える」。
for oneself	3	自分で・自分のために	You should see it for yourself.	自分の目で見たほうがよい。	collocation	oneself は主語や相手に合わせる（for yourself）。by oneself（一人で）と区別する。	for(〜のために)＋oneself(自分自身)。人に頼らず自分自身のためにということから「自分で」。
forget to do	3	〜するのを忘れる	Don't forget to lock the door.	ドアに鍵をかけるのを忘れないでね。	structure	forget doing は「〜したことを忘れる」で、意味が違う。	forget(忘れる)＋to do(これから〜すること)。これからすべきことを忘れることから「〜するのを忘れる」。
from abroad	3	外国から	Many tourists come from abroad.	多くの旅行者が外国から来る。	preposition	abroad は副詞だが、from の後ろには置ける。go abroad（外国へ行く）には to を付けない。	from(〜から)＋abroad(外国で)。外国という所からということから「外国から」。
get angry with	3	〜に腹を立てる	My mother got angry with me for coming home late.	母は私が遅く帰ったことに腹を立てた。	preposition	人には with、物事には at・about を使う（get angry about the noise）。	get angry(怒った状態になる)＋with(〜に対して)。人に対して怒った状態になることから「〜に腹を立てる」。
get better	3	よくなる・上達する	I hope your cold gets better soon.	風邪が早くよくなるといいですね。	collocation	病気が治るときにも、技術が上達するときにも使う。反対は get worse（悪くなる）。	get(〜になる)＋better(よりよい)。前よりもよい状態になることから「よくなる」。
go around	3	回る・歩き回る	The earth goes around the sun.	地球は太陽の周りを回る。	phrasal-verb	食べ物などが「全員に行き渡る」意味もある（enough ~ to go around）。	go(進む)＋around(周りを)。何かの周りを進むことから「回る」。
go away	4	立ち去る・(痛みなどが)なくなる	The pain went away after I slept.	眠ったあとで痛みはなくなった。	phrasal-verb	人に Go away! と言うと「あっちへ行け」という強い言い方になる。	go(行く)＋away(離れて)。離れた所へ行ってしまうことから「立ち去る・なくなる」。
go down	4	下りる・下がる	We went down the stairs quietly.	私たちは静かに階段を下りた。	phrasal-verb	反対は go up。値段や温度が「下がる」ときにも使う。	go(行く)＋down(下へ)。下へ進むことから「下りる・下がる」。
go into	4	〜に入る	The girl went into the store.	少女は店に入った。	phrasal-verb	into は「〜の中へ」という動きを表す。go in だけなら「中に入る」。	go(行く)＋into(〜の中へ)。〜の中へ進むことから「〜に入る」。
go straight	4	まっすぐ行く	Go straight and turn right at the bank.	まっすぐ行って、銀行のところで右に曲がってください。	collocation	道案内でよく使う。この straight は副詞で「まっすぐに」。	go(行く)＋straight(まっすぐに)。曲がらずにまっすぐ進むことから。
go to hospital	3	入院する・(治療を受けに)病院へ行く	He had to go to hospital after the accident.	彼は事故のあと入院しなければならなかった。	collocation	英国の言い方で、米国では go to the hospital と the を付ける。the がないと治療を受けに行くことを表す。	go(行く)＋to hospital(病院へ)。治療を受けるために病院へ行くことから「入院する」。
go up	4	上がる・登る	We went up the mountain by bus.	私たちはバスで山を登った。	phrasal-verb	反対は go down。値段や温度が「上がる」ときにも使う。	go(行く)＋up(上へ)。上へ進むことから「上がる・登る」。
half of	4	〜の半分	Half of the students come to school by bike.	生徒の半分は自転車で通学している。	collocation	動詞は of の後ろの名詞に合わせる（Half of the cake is gone.）。	half(半分)＋of(〜の)。全体を二つに分けた一つということから「〜の半分」。
have a party	4	パーティーを開く	We had a party for Aya's birthday.	私たちはアヤの誕生日にパーティーを開いた。	collocation	have の代わりに give・throw も使う。go to a party は「パーティーに行く」。	have(持つ・行う)＋a party(パーティー)。パーティーを自分たちで行うことから「パーティーを開く」。
hear about	3	〜について聞く	Did you hear about the accident?	その事故について聞きましたか。	preposition	hear of もほぼ同じだが、hear of は「〜があると耳にする」の意味が強い。	hear(聞く)＋about(〜について)。〜についての話を耳にすることから。
hear that ...	3	〜だと聞く・〜だそうだ	I heard that the new shop is very popular.	新しい店はとても人気があると聞いた。	structure	hear from（〜から便りがある）、hear about（〜について聞く）と区別する。	hear(聞く)＋that ...(…ということ)。…という話を人から耳にすることから「〜だと聞く」。
hope that ...	3	〜だといいと思う	I hope that you will feel better soon.	あなたがすぐに元気になるといいと思う。	structure	that は省くことが多い（I hope you ...）。よくないことを思うときは I'm afraid that を使う。	hope(望む)＋that ...(…ということ)。…ということになるのを望むことから「〜だといいと思う」。
hope to do	3	〜したいと思う	I hope to see you again.	またお会いしたいと思います。	structure	hope A to do とは言わない。人に望むときは hope that A will do にする。	hope(望む)＋to do(〜すること)。これから〜することを望むことから「〜したいと思う」。
How old ~ ?	5	何歳ですか・どれくらい古いですか	How old is your brother?	あなたのお兄さんは何歳ですか。	conversation	建物などの古さをたずねるときにも使う（How old is this temple?）。答えは He is fifteen (years old). など。	how(どれくらい)＋old(年をとった・古い)。どれくらい年をとっているかをたずねることから。
how to do	4	〜の仕方・どのように〜するか	Can you show me how to use this camera?	このカメラの使い方を教えてくれますか。	structure	know・learn・teach・show の後ろによく置く。what to do は「何を〜すればよいか」。	how(どのように)＋to do(〜すればよいか)。どのようにすればよいかということから「〜の仕方」。
in ~ minutes	4	〜分後に・〜分で	The movie will start in ten minutes.	映画は10分後に始まる。	preposition	今から数えて「〜分たったら」の意味。「〜分以内に」は within を使う。	in(〜たてば)＋数＋minutes(分)。今から〜分の時間がたてばということから「〜分後に」。
in bed	4	寝て・ベッドで	My grandfather is sick in bed.	祖父は病気で寝ている。	preposition	寝る場所としてのベッドには a や the を付けない。go to bed は「寝る」。	in(〜の中に)＋bed(寝床)。寝床の中に入っていることから「寝て」。
in the past	3	昔は・過去に	In the past, there were no cars in this town.	昔は、この町に車はなかった。	discourse	in the future（将来）と組にして覚える。文の初めにも終わりにも置ける。	in(〜の中で)＋the past(過去)。過ぎ去った時の中ではということから「昔は」。
in this way	3	このようにして	In this way, the town became famous.	このようにして、その町は有名になった。	discourse	前に述べたやり方をまとめるときに文の初めで使う。in the same way は「同じように」。	in(〜で)＋this way(このやり方)。このやり方でということから「このようにして」。
introduce oneself	3	自己紹介する	Let me introduce myself.	自己紹介させてください。	collocation	oneself は主語に合わせる（introduce myself）。introduce A to B は「AをBに紹介する」。	introduce(紹介する)＋oneself(自分自身を)。自分で自分を紹介することから「自己紹介する」。
It says that ...	3	(本・掲示などに)〜と書いてある	It says on the sign that we cannot swim here.	看板に、ここで泳いではいけないと書いてある。	structure	主語には本・新聞・看板などを置く。The news says that ... の形もよく使う。	it(それ：本や掲示)＋says(言う)＋that ...(…と)。書かれたものが…と言っていることから「〜と書いてある」。
It takes ~ to do	3	〜するのに(時間)がかかる	It takes ten minutes to walk to the station.	駅まで歩いて10分かかる。	structure	It takes me ten minutes ... のように人を入れられる。お金がかかるときは It costs を使う。	it(それ)＋takes(必要とする)＋時間＋to do(〜すること)。〜することがそれだけの時間を必要とすることから「〜するのに〜かかる」。
just like	3	ちょうど〜のように・〜にそっくりで	She sings just like a professional singer.	彼女はまるでプロの歌手のように歌う。	preposition	この like は前置詞で、後ろに名詞を置く。Just like you! は「あなたらしいね」の意味にもなる。	just(ちょうど)＋like(〜のように)。ちょうど〜と同じようにということから。
last year	5	去年	We went to Okinawa last year.	私たちは去年、沖縄に行った。	collocation	前に in を付けない（in last year は誤り）。last week・last night も同じ。	last(この前の)＋year(年)。今年のすぐ前の年ということから「去年」。
learn to do	3	〜できるようになる	My little brother learned to swim last summer.	弟は去年の夏、泳げるようになった。	structure	練習や経験をして身につけることを表す。learn how to do は「〜の仕方を学ぶ」。	learn(身につける)＋to do(〜すること)。〜することを身につけることから「〜できるようになる」。
leave home	4	家を出る	I leave home at seven thirty.	私は7時30分に家を出る。	collocation	leave の後ろに場所を直接置く。「親元を離れて暮らし始める」意味にもなる。	leave(去る)＋home(家)。家を去って出かけることから「家を出る」。
Let me ~ .	4	私に〜させてください	Let me carry your bag.	私にかばんを運ばせてください。	conversation	後ろは動詞の原形。Let me see. は「ええと」と考えるときの言い方。	let(させる)＋me(私に)。私に〜させてほしいと申し出ることから「私に〜させてください」。
Let's do	5	〜しよう	Let's eat lunch in the park.	公園でお昼ご飯を食べよう。	conversation	後ろは動詞の原形。答えは Yes, let's. / No, let's not.。	let(させる)＋us(私たちに)の短い形 let's。「私たちに〜させよう」ということから「〜しよう」と誘う言い方。
like ... the best	4	…がいちばん好きだ	I like summer the best of all the seasons.	私はすべての季節の中で夏がいちばん好きだ。	structure	the を省くこともある。何がいちばん好きかは What do you like the best? でたずねる。	like(好む)＋the best(いちばんよく：well の最上級)。いちばんよく好むことから「…がいちばん好きだ」。
like to do	5	〜するのが好きだ	I like to read comics before bed.	私は寝る前に漫画を読むのが好きだ。	structure	like doing とほぼ同じ意味。would like to do は「〜したい」のていねいな言い方。	like(好む)＋to do(〜すること)。〜することを好むことから「〜するのが好きだ」。
live in	5	〜に住む	My aunt lives in a small town by the sea.	おばは海の近くの小さな町に住んでいる。	preposition	国・都市・家などには in を使う。通りの名前には on を使う（live on Main Street）。	live(住む・暮らす)＋in(〜の中で)。ある場所の中で暮らすことから「〜に住む」。
make a sound	3	音を立てる	Please don't make a sound in the library.	図書館では音を立てないでください。	collocation	make a noise（騒ぐ）とほぼ同じ。この sound は「音」という名詞。	make(生み出す)＋a sound(音)。音を生み出すことから「音を立てる」。
make a speech	3	スピーチをする・演説する	Ken made a speech about his dream.	ケンは自分の夢についてスピーチをした。	collocation	give a speech とも言う。do a speech とは言わない。	make(作り出す・行う)＋a speech(演説)。人の前で演説を行うことから「スピーチをする」。
many times	4	何度も	I have seen this movie many times.	私はこの映画を何度も見たことがある。	collocation	現在完了の経験の文でよく使う。回数をたずねるときは How many times ~?。	many(多くの)＋times(回)。多くの回数ということから「何度も」。
May I ~ ?	4	〜してもいいですか	May I sit here?	ここに座ってもいいですか。	conversation	Can I ~? よりていねい。答えは Sure. / Of course. / I'm sorry, but ... など。	may(〜してもよい)＋I。自分が〜してもよいかと許しを求めることから「〜してもいいですか」。
millions of	3	何百万もの・非常に多くの	Millions of people visit this city every year.	毎年、何百万人もの人がこの都市を訪れる。	collocation	millions と複数形にする。「200万」のように数を言うときは two million で s を付けない。	millions(何百万)＋of(〜の)。百万の何倍もの数ということから「非常に多くの」。
move around	3	動き回る	Small fish move around in the water.	小さな魚が水の中を動き回っている。	phrasal-verb	around は「あちこち」。walk around（歩き回る）と同じ形。	move(動く)＋around(あちこち)。あちこちへ動くことから「動き回る」。
move to	4	〜に引っ越す	My family moved to Osaka last spring.	私の家族は去年の春に大阪へ引っ越した。	preposition	引っ越し先には to を使う。move だけでは「動く・動かす」の意味もある。	move(移る)＋to(〜へ)。住む所を〜へ移すことから「〜に引っ越す」。
must not	4	〜してはいけない	You must not run in the hallway.	廊下を走ってはいけない。	structure	強い禁止を表し、短い形は mustn't。don't have to は「〜する必要はない」で、意味が違う。	must(どうしても〜しなければならない)＋not(〜ない)。〜しないことがどうしても必要だということから「〜してはいけない」。
need to do	4	〜する必要がある	You need to wear a helmet on your bike.	自転車ではヘルメットをかぶる必要がある。	structure	否定の don't need to do は「〜する必要はない」。must not（〜してはいけない）と意味が違う。	need(必要とする)＋to do(〜すること)。〜することを必要としていることから「〜する必要がある」。
next time	4	この次は・次回	Next time, let's go to the beach.	この次は、海に行こう。	collocation	前に in を付けない。Next time you come, ... のように後ろに文を続けることもある。	next(次の)＋time(回)。次の回ということから「この次は」。
no one	4	誰も〜ない	No one was in the classroom.	教室には誰もいなかった。	collocation	単数として扱う（No one knows.）。nobody とほぼ同じ意味。	no(一人も〜ない)＋one(人)。一人の人もいないことから「誰も〜ない」。
not ... any more	3	もう〜ない	He doesn't live here any more.	彼はもうここには住んでいない。	structure	anymore と1語でも書く。no longer とほぼ同じ意味。	not(〜ない)＋any more(それ以上は)。それ以上は〜しないことから「もう〜ない」。
not ... so much	3	それほど〜ない	I don't like coffee so much.	私はコーヒーがそれほど好きではない。	structure	not ... very much とほぼ同じ。not so much A as B（AというよりむしろB）は別の構文。	not(〜ない)＋so much(それほど多く)。それほど多くは〜しないことから「それほど〜ない」。
not ... yet	4	まだ〜していない	The bus has not come yet.	バスはまだ来ていない。	structure	yet は文の終わりに置く。疑問文の yet は「もう」（Have you eaten yet?）。	not(〜ない)＋yet(今までのところ)。今までのところ〜していないことから「まだ〜していない」。
not A but B	3	AではなくB	He is not a teacher but a doctor.	彼は先生ではなく医者だ。	structure	A と B は同じ形にそろえる。not only A but also B（AだけでなくBも）と区別する。	not A(Aではない)＋but B(そうではなくB)。Aを打ち消して代わりにBを示すことから「AではなくB」。
not really	4	それほどでもない・あまり〜ない	I'm not really hungry now.	今はそれほどお腹がすいていない。	conversation	質問に Not really. と答えると、やわらかく打ち消せる。really not は「本当に〜ない」で強い否定になる。	not(〜ない)＋really(本当に)。本当にそうだとまでは言えないことから「それほどでもない」。
not very	4	あまり〜ない	This soup is not very hot.	このスープはあまり熱くない。	structure	後ろに形容詞・副詞を置く。very を打ち消して、やわらかく否定する言い方。	not(〜ない)＋very(とても)。とても〜というわけではないことから「あまり〜ない」。
on one's left	4	〜の左側に	You will see the post office on your left.	左側に郵便局が見えます。	preposition	one's は相手や主語に合わせる。右側なら on one's right。	on(〜の側に)＋one's left(自分の左)。その人から見て左の側にということから「〜の左側に」。
on one's way	3	途中で	I bought some bread on my way home.	私は家に帰る途中でパンを買った。	preposition	one's は主語に合わせる（on my way）。行き先は to で示す（on my way to school）。家へなら to を付けない（on my way home）。	on(〜の上で)＋one's way(自分の通る道)。自分の進む道の上にいる間にということから「途中で」。
on the internet	4	インターネットで	I found the recipe on the internet.	私はその作り方をインターネットで見つけた。	preposition	前置詞は on を使う。Internet と大文字で書くこともある。	on(〜の上で)＋the internet(インターネット)。インターネットという場の上でということから「インターネットで」。
on the phone	4	電話で	My sister is talking on the phone.	姉は電話で話している。	preposition	by phone とも言う。be on the phone は「電話中だ」。	on(〜を使って)＋the phone(電話)。電話という道具を使ってということから「電話で」。
on TV	5	テレビで	I watched the game on TV.	私はテレビでその試合を見た。	preposition	on TV の TV には the を付けない。テレビの番組そのものを見るときは watch TV。	on(〜に出て)＋TV(テレビ)。テレビの画面に出ているものをということから「テレビで」。
out of	4	〜から外へ	A cat jumped out of the box.	ネコが箱から飛び出した。	preposition	into（〜の中へ）の反対。out of order（故障して）のように熟語の一部にもなる。	out(外へ)＋of(〜から離れて)。〜の中から離れて外へということから「〜から外へ」。
part of	4	〜の一部	Music is an important part of my life.	音楽は私の生活の大切な一部だ。	collocation	形容詞を付けるときは an important part of の形にする。part of だけなら a を付けないことが多い（Part of the money）。	part(部分)＋of(〜の)。全体の中のある部分ということから「〜の一部」。
play A with B	5	BとAをする	I play soccer with my friends after school.	私は放課後、友達とサッカーをする。	structure	スポーツには the を付けない（play soccer）。楽器には the を付ける（play the piano）。	play(〔スポーツ・遊びを〕する)＋A＋with B(Bと一緒に)。Bと一緒にAをすることから。
point to	3	〜を指さす	The boy pointed to the map on the wall.	少年は壁の地図を指さした。	preposition	point at もほぼ同じ。to は方向、at は目当ての物をはっきり指す感じがある。	point(指し示す)＋to(〜の方へ)。〜の方へ指を向けることから「〜を指さす」。
put A in B	4	AをBに入れる	Please put your books in your bag.	本をかばんに入れてください。	structure	B が入れ物のときは in を使う。put in だけだと「提出する・注ぎ込む」などの意味になる。	put(置く)＋A＋in B(Bの中に)。AをBの中に置くことから「AをBに入れる」。
put A into B	3	AをBに入れる・AをBに訳す	Please put this sentence into English.	この文を英語に直してください。	structure	「Bの言葉に訳す」意味でよく使う（put A into Japanese）。物を入れるときは put A in B も使う。	put(置く)＋A＋into B(Bの中へ)。AをBという入れ物や言葉の中へ移すことから。
return to	3	〜に戻る	He returned to Japan last month.	彼は先月、日本に戻った。	preposition	return は「戻る」なので back を付けない（return back は誤り）。go back to とほぼ同じ意味。	return(戻る)＋to(〜へ)。もとの場所へ戻ることから「〜に戻る」。
say to oneself	3	心の中で思う・独り言を言う	I said to myself that I would never give up.	私は決してあきらめないと心の中で思った。	collocation	oneself は主語に合わせる（said to myself）。声に出して独り言を言うのは talk to oneself。	say(言う)＋to oneself(自分自身に)。自分自身に向かって言うことから「心の中で思う」。
seem to do	3	〜するようだ	He seems to know the answer.	彼は答えを知っているようだ。	structure	It seems that he knows ... に言いかえられる。look（〜に見える）は後ろに形容詞を置く。	seem(〜のように思われる)＋to do(〜する)。〜するように思われることから「〜するようだ」。
Shall we ~ ?	4	(一緒に)〜しましょうか	Shall we go shopping this afternoon?	今日の午後、買い物に行きましょうか。	conversation	Let's ~ とほぼ同じ誘いの言い方。答えは Yes, let's. / No, let's not.。	shall(〜しようか：相手の気持ちをたずねる)＋we。私たちで〜しようかとたずねることから「〜しましょうか」。
share A with B	3	AをBと分け合う・共有する	I shared my lunch with my friend.	私は友達とお昼ご飯を分け合った。	structure	with の後ろに人を置く。考えや気持ちを人に伝える意味でも使う（share an idea with）。	share(分け合う)＋A＋with B(Bと)。AをBと一緒に持つことから「AをBと分け合う」。
since then	3	それ以来	I moved here five years ago and have lived here since then.	私は5年前にここへ越してきて、それ以来ここに住んでいる。	discourse	現在完了の文でよく使う。ever since then と強めることもある。	since(〜以来)＋then(その時)。その時から今までずっとということから「それ以来」。
smile at	4	〜にほほえみかける	The baby smiled at me.	赤ちゃんが私にほほえみかけた。	preposition	ほほえむ相手には at を使う。laugh at は「〜を笑う・あざ笑う」。	smile(ほほえむ)＋at(〜に向けて)。相手に向けてほほえむことから「〜にほほえみかける」。
some time	3	しばらくの間・いくらかの時間	I need some time to think.	考えるのにしばらく時間が必要だ。	collocation	sometime と1語なら「いつか」、sometimes は「ときどき」。	some(いくらかの)＋time(時間)。いくらかの時間ということから「しばらくの間」。
soon after	3	〜のすぐあとで	Soon after the game, it began to rain.	試合のすぐあとで雨が降り始めた。	preposition	後ろには名詞か文を置く。soon afterward は「その後すぐに」。	soon(すぐに)＋after(〜のあとで)。〜のあと、時間をおかずにということから「〜のすぐあとで」。
spend A on B	3	AをBに使う	She spends a lot of money on clothes.	彼女は服にたくさんのお金を使う。	structure	A にはお金や時間を置く。時間を「〜して過ごす」なら spend time doing。	spend(使う)＋A＋on B(Bに)。お金や時間をBに向けて使うことから「AをBに使う」。
start to do	4	〜し始める	It started to rain in the afternoon.	午後に雨が降り始めた。	structure	start doing もほぼ同じ意味。話し言葉では begin to do より start to do をよく使う。	start(動き出す)＋to do(〜すること)。〜する動きを起こすことから「〜し始める」。
stay at	4	〜に泊まる	We stayed at a hotel near the station.	私たちは駅の近くのホテルに泊まった。	preposition	ホテルや家には at、都市や国には in を使う（stay in Kyoto）。	stay(とどまる)＋at(〜という地点に)。ホテルなどの一つの地点にとどまることから「〜に泊まる」。
stay home	4	家にいる	I stayed home because I had a cold.	風邪をひいたので、私は家にいた。	collocation	home は副詞なので at を付けない言い方が多い。stay at home とも言う。	stay(とどまる)＋home(家に)。出かけずに家にとどまることから「家にいる」。
stay in	4	〜に滞在する	We stayed in Kyoto for three days.	私たちは京都に3日間滞在した。	preposition	都市や国には in、ホテルや人の家には at を使う（stay at a hotel）。stay in だけで「家にいる」の意味もある。	stay(とどまる)＋in(〜の中に)。ある土地の中にしばらくとどまることから「〜に滞在する」。
stay with	4	〜の家に泊まる	I stayed with my uncle during the summer.	私は夏の間、おじの家に泊まった。	preposition	with の後ろには人を置く。場所なら stay at・stay in を使う。	stay(とどまる)＋with(〜と一緒に)。人と一緒にとどまることから「〜の家に泊まる」。
stop doing	4	〜するのをやめる	Please stop talking during the test.	テストの間は話すのをやめてください。	structure	stop to do は「〜するために立ち止まる」で、意味が違う。	stop(止める)＋doing(〜していること)。していた動作を止めることから「〜するのをやめる」。
study abroad	3	留学する	My sister wants to study abroad in Canada.	姉はカナダに留学したがっている。	collocation	abroad は副詞なので to を付けない（study to abroad は誤り）。go abroad（外国へ行く）も同じ。	study(学ぶ)＋abroad(外国で)。外国で学ぶことから「留学する」。
such a ~	3	とても〜な・そんなに〜な	It was such a beautiful day.	とても天気のよい日だった。	structure	a の位置に注意する（such a nice boy）。複数や数えられない名詞には such を直接付ける（such nice people）。	such(それほどの)＋a＋形容詞＋名詞。それほどの〜ということから「とても〜な」。
take a class	3	授業を受ける	I take a piano class on Saturdays.	私は土曜日にピアノの授業を受けている。	collocation	授業を「受ける」には take を使う。授業を「する」先生の側は teach a class。	take(とる)＋a class(授業)。授業をとって受けることから「授業を受ける」。
take A to B	4	AをBに連れて行く・持って行く	My father took me to the zoo.	父が私を動物園に連れて行ってくれた。	structure	話し手の所へ連れて来るなら bring A to B。take to だけだと「〜を好きになる」。	take(連れて行く・持って行く)＋A＋to B(Bへ)。AをBへ連れて行くことから。
take a train	4	電車に乗る	We took a train to Nagoya.	私たちは名古屋まで電車に乗った。	collocation	交通手段を「使う」ときは take を使う（take a bus / take a taxi）。get on は「乗り込む」動作。	take(とる・利用する)＋a train(電車)。電車を移動の手段に使うことから「電車に乗る」。
talk to	5	〜と話す	Can I talk to you for a minute?	少し話してもいいですか。	preposition	talk with もほぼ同じ意味。speak to は少していねいな言い方。	talk(話す)＋to(〜に向かって)。相手に向かって話すことから「〜と話す」。
tell a lie	3	うそをつく	You should not tell a lie.	うそをついてはいけない。	collocation	say a lie とは言わない。tell the truth（本当のことを言う）と組にして覚える。	tell(話す)＋a lie(うそ)。うそを話して聞かせることから「うそをつく」。
tell A to do	3	Aに〜するように言う	The teacher told us to be quiet.	先生は私たちに静かにするように言った。	structure	否定は tell A not to do（〜しないように言う）。say は後ろに人を直接置かない。	tell(言う)＋A(人)＋to do(〜すること)。人に、これから〜することを言い聞かせることから「Aに〜するように言う」。
than any other ~	3	ほかのどの〜よりも	Mt. Fuji is higher than any other mountain in Japan.	富士山は日本のほかのどの山よりも高い。	structure	any other の後ろは単数形の名詞。最上級（the highest）と同じ内容を表す。	than(〜よりも)＋any other(ほかのどの)。ほかのどれと比べても上だということから「ほかのどの〜よりも」。
than before	3	以前より	You speak English better than before.	あなたは以前より英語を上手に話す。	structure	比較級の後ろに置く。than ever（今までになく）とも言う。	than(〜よりも)＋before(以前)。今を以前と比べることから「以前より」。
that way	4	その方法で・あちらへ	If you do it that way, it will be easier.	そのやり方でやれば、もっと楽になる。	collocation	前に in を付けなくても使える。道案内では「あちらへ」の意味になる（Go that way.）。	that(その・あの)＋way(方法・方向)。そのやり方で、またはあの方向へということから。
the next day	4	その次の日	He got sick, but he was fine the next day.	彼は具合が悪くなったが、次の日には元気だった。	collocation	今日から見た「明日」は tomorrow。過去の話の中で「その次の日」と言うときに使う。	the next(その次の)＋day(日)。話の中のある日のその次の日ということから「その次の日」。
the other day	3	先日	I met Mr. Kato at the station the other day.	先日、駅で加藤さんに会った。	collocation	過去の文で使う。数日前のことを表す。	the other(別の)＋day(日)。今日とは別の、少し前の日ということから「先日」。
the same ... as ~	3	〜と同じ…	I have the same bag as you.	私はあなたと同じかばんを持っている。	structure	same の前には必ず the を付ける。as の後ろに文を続けることもある。	the same(同じ)＋名詞＋as(〜と)。〜と比べて同じものであることから「〜と同じ…」。
the way to	4	〜への道	Could you tell me the way to the station?	駅への道を教えていただけますか。	collocation	道をたずねる決まった言い方。the way to do は「〜する方法」の意味にもなる。	the way(道)＋to(〜へ)。〜へ行く道ということから「〜への道」。
this morning	5	今朝	I got up early this morning.	私は今朝、早く起きた。	collocation	this を付けると前に in を付けない（in this morning は誤り）。this afternoon・this evening も同じ。	this(この・今日の)＋morning(朝)。今日の朝ということから「今朝」。
this time	4	今回は・今度は	I lost last time, but I won this time.	前回は負けたが、今回は勝った。	collocation	前に in を付けない。last time（前回）・next time（次回）と組にして覚える。	this(この)＋time(回)。この回ということから「今回は」。
together with	3	〜と一緒に	She came together with her brother.	彼女は兄と一緒に来た。	preposition	with だけより「一緒に」を強める。A together with B が主語のとき、動詞は A に合わせる。	together(一緒に)＋with(〜と)。〜と一緒にということを強めた言い方。
too ... for A to do	3	…すぎてAには〜できない	This book is too difficult for me to read.	この本は難しすぎて私には読めない。	structure	so ... that A can't do に言いかえられる（so difficult that I can't read it）。	too(…すぎる)＋for A(Aにとって)＋to do(〜するには)。Aが〜するには程度が過ぎていることから「…すぎてAには〜できない」。
try doing	3	試しに〜してみる	Try adding some salt to the soup.	スープに塩を少し入れてみて。	structure	try to do は「〜しようと努める」で、意味が違う。	try(試す)＋doing(〜すること)。実際に〜することを試すことから「試しに〜してみる」。
try to do	4	〜しようとする	Ken tried to climb the tall tree.	ケンは高い木に登ろうとした。	structure	try doing は「試しに〜してみる」で、意味が違う。	try(力を尽くす)＋to do(これから〜すること)。まだできていないことに向かって力を出すことから「〜しようとする」。
walk about	4	歩き回る	We walked about the old town.	私たちは古い町を歩き回った。	phrasal-verb	walk around とほぼ同じ意味。about は「あちこちを」。	walk(歩く)＋about(あちこちを)。あちこちを歩くことから「歩き回る」。
walk to	5	〜まで歩いて行く	I walk to school every day.	私は毎日歩いて学校へ行く。	preposition	home の前には to を付けない（walk home）。go to ~ on foot とも言う。	walk(歩く)＋to(〜へ)。〜へ向かって歩くことから「〜まで歩いて行く」。
want A to do	3	Aに〜してほしい	My mother wants me to clean my room.	母は私に部屋を掃除してほしいと思っている。	structure	A には人を置く（want me to help）。want that ... の形は使わない。	want(望む)＋A(人)＋to do(〜すること)。人が〜することを望むことから「Aに〜してほしい」。
way of	3	〜の方法・〜のやり方	Walking is a good way of staying healthy.	歩くことは健康でいるためのよい方法だ。	collocation	後ろには名詞か動名詞を置く（a way of life＝生き方）。a way to do もほぼ同じ意味。	way(方法・道)＋of(〜の)。〜するための道筋ということから「〜の方法」。
What a ~ !	4	なんて〜なのだろう	What a cute dog!	なんてかわいい犬なのだろう。	structure	a の後ろに形容詞と名詞を置く。名詞が複数か数えられないときは a を付けない（What nice flowers!）。	what(なんという)＋a＋形容詞＋名詞。驚いた気持ちをそのまま声に出す形で「なんて〜なのだろう」。
What kind of ~ ?	4	どんな種類の〜	What kind of music do you like?	あなたはどんな音楽が好きですか。	conversation	kind の後ろの名詞には a を付けない（What kind of dog）。	what(どんな)＋kind(種類)＋of(〜の)。どんな種類のものかをたずねることから。
what to do	3	何を〜すればよいか	I didn't know what to say.	私は何と言えばいいか分からなかった。	structure	know・decide・tell の後ろに置く。how to do は「〜の仕方」。	what(何を)＋to do(〜すべきか)。何をすべきかということから「何を〜すればよいか」。
Will you ~ ?	4	〜してくれませんか	Will you help me with my homework?	宿題を手伝ってくれませんか。	conversation	親しい人に頼む言い方。ていねいに頼むときは Would you ~? を使う。	will(〜するつもりだ)＋you。相手に〜するつもりがあるかをたずねて、頼む言い方になった。
with a smile	3	ほほえみながら	The nurse spoke to me with a smile.	看護師はほほえみながら私に話しかけた。	preposition	with は「〜を伴って」。with tears（涙を浮かべて）も同じ形。	with(〜を伴って)＋a smile(ほほえみ)。ほほえみを顔に浮かべたままということから「ほほえみながら」。
Would you ~ ?	4	〜していただけませんか	Would you open the window, please?	窓を開けていただけませんか。	conversation	Will you ~? よりていねい。答えは Sure. / Of course. など。	would(will の過去の形)＋you。will を過去の形にして控えめにたずねることから、ていねいな頼み方「〜していただけませんか」。
Would you like to ~ ?	4	〜しませんか・〜したいですか	Would you like to come to my party?	私のパーティーに来ませんか。	conversation	Do you want to ~? のていねいな言い方。誘いに応じるときは I'd love to. など。	would like(〜したいと思う：want のていねいな形)＋to do。相手に〜したいかをていねいにたずねることから「〜しませんか」。
`))
