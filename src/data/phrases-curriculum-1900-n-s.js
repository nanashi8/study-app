import { parseCurriculum1900PhraseRows } from './curriculum-phrase-utils.js'

// 出典順ではなく、正規形の英字順。
const ROWS = String.raw`
name A after B	pre2	BにちなんでAと名付ける	They named the school after its founder.	彼らは創設者にちなんで学校を名付けた。	structure
needless to say	2	言うまでもなく	Needless to say, everyone needs clean water.	言うまでもなく、誰にでもきれいな水が必要だ。	discourse
never ... without doing	pre1	〜すれば必ず…する	He never visits without bringing flowers.	彼は訪ねる時には必ず花を持ってくる。	structure
Nice to meet you.	4	はじめまして	Hello, I'm Aya. Nice to meet you.	こんにちは、アヤです。はじめまして。	conversation
no doubt	pre2	きっと・疑いなく	She will no doubt notice the change.	彼女はきっとその変化に気付くだろう。	idiom
No problem.	4	問題ありません・どういたしまして	Can you help me? No problem.	手伝ってくれますか。もちろんです。	conversation
No, thank you.	4	いいえ、結構です	Would you like more tea? No, thank you.	紅茶をもう少しいかがですか。いいえ、結構です。	conversation
none other than	pre2	ほかならぬ〜	The visitor was none other than the mayor.	訪問者はほかならぬ市長だった。	idiom
not ... in the least	pre1	少しも〜ない	I am not worried in the least.	私は少しも心配していない。	structure
not all that	pre1	それほど〜ではない	The test was not all that difficult.	その試験はそれほど難しくなかった。	idiom
not always	4	必ずしも〜とは限らない	Expensive tools are not always better.	高価な道具が必ずしも優れているとは限らない。	structure
not so much A as B	pre1	AというよりむしろB	The story is not so much sad as hopeful.	その物語は悲しいというより希望に満ちている。	structure
not so much as do	pre1	〜さえしない	He left without so much as saying goodbye.	彼はさよならを言うことさえなく去った。	structure
not to mention	2	〜は言うまでもなく	The room is bright, not to mention spacious.	その部屋は広いのはもちろん、明るい。	discourse
nothing but	pre2	〜にすぎない・〜だけ	The claim is nothing but a rumor.	その主張はただのうわさにすぎない。	idiom
Nothing is more A than B	pre1	BほどAなものはない	Nothing is more valuable than time.	時間ほど貴重なものはない。	structure
nothing short of	pre1	まさに〜・〜にほかならない	Her recovery was nothing short of remarkable.	彼女の回復はまさに驚くべきものだった。	idiom
now that	pre2	今や〜なので	Now that the rain has stopped, let's leave.	雨がやんだので、出発しよう。	structure
occur to	2	〜の心に浮かぶ	A simple solution occurred to me.	簡単な解決策が私の心に浮かんだ。	preposition
of importance	pre2	重要で	This question is of great importance.	この問題は非常に重要だ。	preposition
of late	2	最近	She has been busy of late.	彼女は最近忙しい。	idiom
of one's own	pre1	自分自身の	Every child needs a space of their own.	どの子にも自分だけの場所が必要だ。	idiom
of one's own doing	pre1	自分自身が招いた	The confusion was of his own doing.	その混乱は彼自身が招いたものだった。	idiom
on ~ terms with	pre1	〜な間柄で	She is on friendly terms with her neighbors.	彼女は近所の人と友好的な間柄だ。	structure
on a ~ basis	2	〜という基準・方式で	We meet on a weekly basis.	私たちは週単位で会う。	structure
on a ~ scale	2	〜な規模で	The survey was conducted on a national scale.	その調査は全国規模で行われた。	structure
on a charge of	2	〜の容疑で	He was arrested on a charge of theft.	彼は窃盗の容疑で逮捕された。	preposition
on board	2	乗り物に乗って	There were fifty passengers on board.	乗客が50人乗っていた。	idiom
on display	2	展示されて	The winning photos are on display.	入賞写真が展示されている。	idiom
on duty	3	勤務中で	A nurse is on duty all night.	看護師が一晩中勤務している。	idiom
on earth	pre2	いったい・地上で	Why on earth did you do that?	いったいなぜそんなことをしたのですか。	idiom
on end	2	続けて・直立して	It rained for three days on end.	3日間続けて雨が降った。	idiom
on guard	2	警戒して	The guards remained on guard.	警備員たちは警戒を続けた。	idiom
on occasion	pre2	時折	We eat outdoors on occasion.	私たちは時折外で食べる。	idiom
on one's part	2	〜の側では・〜としては	The mistake was not intentional on her part.	彼女の側ではその誤りは故意ではなかった。	idiom
on schedule	3	予定どおりに	The train arrived on schedule.	列車は予定どおり到着した。	idiom
on second thought	pre1	考え直してみると	On second thought, I'll take the train.	考え直して、電車で行くことにする。	discourse
on the ~ side	pre1	やや〜なほうで	The room is on the small side.	その部屋はやや小さめだ。	structure
on the air	pre2	放送中で	The interview will be on the air at eight.	そのインタビューは8時に放送される。	idiom
on the dot	pre2	時間きっかりに	The meeting started at nine on the dot.	会議は9時きっかりに始まった。	idiom
on the face of it	pre1	一見したところ	On the face of it, the offer seems fair.	一見したところ、その提案は公正に見える。	discourse
on the increase	2	増加中で	Online orders are on the increase.	オンライン注文は増加している。	idiom
on the move	pre1	移動中で・活動中で	Our team is constantly on the move.	私たちのチームは絶えず移動している。	idiom
on the other hand	3	他方では	The plan is cheap; on the other hand, it is risky.	その計画は安いが、他方では危険だ。	discourse
on the spot	pre1	その場で・窮地に	She answered the question on the spot.	彼女はその場で質問に答えた。	idiom
on the way back	4	帰る途中で	We bought fruit on the way back.	私たちは帰る途中で果物を買った。	idiom
on the way to	pre2	〜へ行く途中で	I met Ken on the way to school.	学校へ行く途中でケンに会った。	preposition
on the whole	pre1	全体として	On the whole, the event was successful.	全体として、その催しは成功だった。	discourse
once and for all	pre1	きっぱりと・これを最後に	Let's settle the issue once and for all.	この問題をきっぱり解決しよう。	idiom
once in a while	pre2	時々	We go hiking once in a while.	私たちは時々ハイキングに行く。	idiom
once upon a time	4	昔々	Once upon a time, a fox lived here.	昔々、ここにキツネが住んでいた。	discourse
one of these days	pre1	近いうちに	I'll visit the island one of these days.	近いうちにその島を訪ねるつもりだ。	idiom
only too	pre1	非常に・喜んで	I am only too happy to help.	喜んでお手伝いします。	idiom
order A from B	2	BにAを注文する	We ordered the parts from a local shop.	私たちは地元の店に部品を注文した。	structure
out of breath	2	息を切らして	I was out of breath after running upstairs.	階段を駆け上がって息が切れた。	idiom
out of character	2	その人らしくなく	His angry reply was out of character.	彼の怒った返事は彼らしくなかった。	idiom
out of hand	2	手に負えなくなって・即座に	The crowd got out of hand.	群衆は手に負えなくなった。	idiom
owing to	pre2	〜のために	The flight was delayed owing to fog.	霧のため飛行機は遅れた。	preposition
Pardon me?	4	もう一度言ってください	Pardon me? I couldn't hear you.	もう一度お願いします。聞こえませんでした。	conversation
part and parcel of	pre1	〜の不可欠な部分	Mistakes are part and parcel of learning.	間違いは学習に付きものだ。	idiom
part with	2	〜を手放す	She refused to part with the old letter.	彼女はその古い手紙を手放そうとしなかった。	preposition
pass out	pre1	気を失う・配る	He passed out from the heat.	彼は暑さで気を失った。	phrasal-verb
pay a visit to	pre2	〜を訪問する	We paid a visit to the science museum.	私たちは科学博物館を訪れた。	idiom
per capita	2	一人当たり	Water use per capita has fallen.	一人当たりの水使用量は減った。	idiom
play a joke on	1	〜にいたずらをする	They played a harmless joke on their coach.	彼らはコーチに害のないいたずらをした。	idiom
present A with B	2	AにBを贈る・提示する	The club presented her with an award.	クラブは彼女に賞を贈った。	structure
pride oneself on	2	〜を自慢する	The hotel prides itself on friendly service.	そのホテルは親切なサービスを誇りにしている。	structure
provide for	2	〜を養う・〜に備える	She works hard to provide for her family.	彼女は家族を養うため懸命に働く。	preposition
pull ~'s leg	pre2	〜をからかう	Relax; I'm just pulling your leg.	落ち着いて。からかっているだけだよ。	structure
pull up	pre1	車を止める・引き上げる	A taxi pulled up outside the gate.	タクシーが門の外に止まった。	phrasal-verb
punish A for B	2	BのことでAを罰する	The school punished him for cheating.	学校は不正行為のことで彼を罰した。	structure
put ~ to use	1	〜を活用する	Let's put this empty room to use.	この空き部屋を活用しよう。	structure
put aside	2	〜を取っておく・脇に置く	Put aside a little money each month.	毎月少しお金を取っておきなさい。	phrasal-verb
put emphasis on	2	〜を重視する	The course puts emphasis on clear writing.	その講座は明快な文章を重視する。	preposition
put in	2	〜を提出する・注ぎ込む	She put in many hours of practice.	彼女は何時間も練習に費やした。	phrasal-verb
quite a few	1	かなり多くの	Quite a few students chose the second option.	かなり多くの生徒が二つ目の選択肢を選んだ。	idiom
read between the lines	1	行間を読む	Read between the lines to understand his concern.	彼の懸念を理解するには行間を読みなさい。	idiom
reflect on	2	〜をよく考える	Take time to reflect on what you learned.	学んだことをよく考える時間を取りなさい。	preposition
remain to be seen	pre2	まだ分からない	Whether the plan works remains to be seen.	その計画がうまくいくかはまだ分からない。	structure
remember doing	pre2	〜したことを覚えている	I remember meeting her at the library.	私は図書館で彼女に会ったことを覚えている。	structure	過去にした行為を覚えている時は動名詞を使う。
remember to do	pre2	忘れずに〜する	Remember to lock the door.	忘れずにドアに鍵を掛けなさい。	structure	これからすべき行為を忘れない時は不定詞を使う。
rest on	2	〜に基づく・〜にかかっている	The decision rests on reliable evidence.	その決定は信頼できる証拠に基づく。	preposition
right as rain	pre1	すっかり元気で	After a night's rest, I felt right as rain.	一晩休むと私はすっかり元気になった。	idiom
round up	pre1	〜を集める	We rounded up volunteers for the cleanup.	私たちは清掃のためにボランティアを集めた。	phrasal-verb
scores of	1	多数の	Scores of people attended the open day.	多数の人が公開日に参加した。	collocation
second to none	pre1	誰にも劣らない	Her knowledge of the region is second to none.	彼女の地域についての知識は誰にも劣らない。	idiom
see much of	pre1	〜によく会う	I don't see much of my old classmates now.	今は昔の同級生にあまり会わない。	idiom
see that	pre2	必ず〜するようにする	See that every window is closed.	すべての窓が閉まっていることを確認しなさい。	structure
see the sights of	1	〜を観光する	We spent a day seeing the sights of Kyoto.	私たちは一日京都を観光して過ごした。	idiom
See you.	4	またね	See you. Have a good weekend.	またね。よい週末を。	conversation
serve ~ right	pre2	〜には当然の報いだ	It serves him right for ignoring the warning.	警告を無視した彼には当然の報いだ。	structure
shake hands	pre2	握手する	The two leaders shook hands.	2人の指導者は握手した。	idiom
Shall I ~ ?	4	〜しましょうか	Shall I carry that bag?	そのかばんを持ちましょうか。	conversation
shut up	2	黙る・閉じ込める	He suddenly shut up when the teacher entered.	先生が入ると彼は急に黙った。	phrasal-verb	強い言い方なので、相手に直接使う時は注意する。
shy away	pre1	尻込みする	Do not shy away from difficult questions.	難しい質問に尻込みしないで。	phrasal-verb
sign up for ~	2	〜に申し込む	I signed up for the evening class.	私は夜の講座に申し込んだ。	phrasal-verb
sit up	2	上体を起こす・きちんと座る	She sat up when she heard the news.	その知らせを聞いて彼女は上体を起こした。	phrasal-verb
slow down	2	速度を落とす	Slow down near the school.	学校の近くでは速度を落としなさい。	phrasal-verb
..., so that ...	pre1	〜、その結果…	The road was blocked, so that we had to turn back.	道がふさがれていた。その結果、私たちは引き返さなければならなかった。	structure	目的を表す so that S can do と区別し、コンマの前の事実から生じた結果を表す。
so that ~ can do	pre2	〜が…できるように	Speak clearly so that everyone can hear.	全員に聞こえるようにはっきり話しなさい。	structure
so to speak	2	いわば	The library is the heart of the school, so to speak.	図書館はいわば学校の心臓部だ。	discourse
Some A. Others B.	3	Aする人もいればBする人もいる	Some students walked. Others took the bus.	歩いた生徒もいれば、バスに乗った生徒もいた。	structure
something of a	pre1	ちょっとした〜・かなりの〜	The trip was something of an adventure.	その旅はちょっとした冒険だった。	idiom
sort of / kind of	pre1	いくぶん・〜のような	I was kind of surprised by the answer.	私はその答えに少し驚いた。	idiom
sound like	3	〜のように聞こえる	That sounds like a good idea.	それはよい考えのように聞こえる。	preposition
speak out	2	はっきり意見を述べる	Students spoke out against the change.	生徒たちはその変更に反対だとはっきり述べた。	phrasal-verb
speaking of	2	〜と言えば	Speaking of travel, have you packed yet?	旅行と言えば、もう荷造りしましたか。	discourse
spend ~ in doing	2	〜を…することに費やす	She spent the afternoon in reading.	彼女は午後を読書に費やした。	structure	現代英語では in を省いて spend time doing とすることも多い。
stand to reason	1	当然である	It stands to reason that practice improves skill.	練習で技能が上がるのは当然だ。	idiom
step up	2	〜を強化する・進み出る	The city stepped up safety checks.	市は安全点検を強化した。	phrasal-verb
stick around	pre2	その場に残る	Stick around after class if you have questions.	質問があれば授業後も残ってください。	phrasal-verb
stick out	2	突き出る・目立つ	The red door sticks out on this street.	その赤い扉はこの通りで目立つ。	phrasal-verb
strike A as B	pre2	AにBという印象を与える	The proposal struck me as practical.	その提案は私には実用的に思えた。	structure
submit to	pre1	〜に従う・屈する	The samples were submitted to careful testing.	試料は慎重な検査にかけられた。	preposition
such as it is	pre1	たいしたものではないが	You may use my desk, such as it is.	たいした机ではないが、使ってよい。	idiom
Suffice it to say that	2	〜と言えば十分だ	Suffice it to say that the plan needs work.	その計画には改善が必要だと言えば十分だ。	structure
sum up	2	要約する	Let me sum up the main points.	要点をまとめます。	phrasal-verb
surrender to	2	〜に降伏する・屈する	The army surrendered to the opposing forces.	軍は敵軍に降伏した。	preposition
sympathize with	2	〜に同情する	I sympathize with people facing the same problem.	私は同じ問題に直面する人々に同情する。	preposition
`

export const CURRICULUM_1900_PHRASES_N_S = Object.freeze(
  parseCurriculum1900PhraseRows(ROWS),
)
