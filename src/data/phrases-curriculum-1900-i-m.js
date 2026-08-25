import { parseCurriculum1900PhraseRows } from './curriculum-phrase-utils.js'

// 出典順ではなく、正規形の英字順。
const ROWS = String.raw`
I see.	4	なるほど・分かりました	I see. That explains the delay.	なるほど。それで遅れた理由が分かりました。	conversation
I'm afraid not.	pre1	残念ですが違います・できません	Will the shop reopen today? I'm afraid not.	店は今日また開きますか。残念ですが開きません。	conversation
if any	pre2	もしあれば・あるとしても	There are few errors, if any.	誤りは、あるとしてもほとんどない。	structure
if anything	pre1	どちらかといえば・むしろ	The second route is, if anything, safer.	二つ目の道は、どちらかといえばより安全だ。	discourse
if it were not for	2	〜がなければ	If it were not for this map, we would be lost.	この地図がなければ私たちは迷っているだろう。	structure
if only	2	〜でありさえすれば・〜だったらなあ	If only I had more time.	もっと時間があればなあ。	structure
ill at ease	2	落ち着かない	The formal interview made me feel ill at ease.	正式な面接で私は落ち着かなかった。	idiom
in a row	pre1	連続して・一列に	Our team won three games in a row.	私たちのチームは3試合連続で勝った。	preposition
in a way	2	ある意味では	In a way, both answers are correct.	ある意味では、どちらの答えも正しい。	discourse
in a word	2	一言で言えば	In a word, the experiment failed.	一言で言えば、その実験は失敗した。	discourse
in case of	3	〜の場合には	In case of fire, use the stairs.	火事の場合は階段を使いなさい。	preposition
in danger of	2	〜の危険があって	The wetland is in danger of disappearing.	その湿地は消滅の危機にある。	preposition
in demand	2	需要がある	Skilled technicians are in demand.	熟練技術者は需要がある。	idiom
in earnest	1	本気で・本格的に	Work began in earnest after lunch.	昼食後、仕事が本格的に始まった。	idiom
in exchange for	2	〜と引き換えに	I gave her my notes in exchange for the book.	私はその本と引き換えに彼女へノートを渡した。	preposition
in fashion	3	流行して	Wide trousers are in fashion again.	幅の広いズボンがまた流行している。	idiom
in good shape	1	調子がよい・良好な状態で	The old bicycle is still in good shape.	その古い自転車はまだ良好な状態だ。	idiom
in harmony with	2	〜と調和して	The new building is in harmony with the park.	新しい建物は公園と調和している。	preposition
in honor of	2	〜に敬意を表して	A concert was held in honor of the composer.	その作曲家に敬意を表して演奏会が開かれた。	preposition
in itself	2	それ自体では	Technology is not harmful in itself.	技術はそれ自体では有害ではない。	idiom
in line	3	列に並んで	We waited in line for tickets.	私たちは切符を買うため列で待った。	preposition
in need	3	困って・必要として	The fund helps families in need.	その基金は困っている家庭を助ける。	idiom
in order	2	順序よく・正常で	Please put the cards in order.	カードを順番に並べてください。	idiom
in part	2	一部は	The delay was caused in part by fog.	遅れは一部、霧が原因だった。	discourse
in person	1	直接会って・本人が	You must apply in person.	本人が直接申し込まなければならない。	idiom
in place	2	所定の位置に・準備が整って	The safety measures are now in place.	安全対策は今や整っている。	idiom
in preparation for	pre2	〜に備えて	We practiced daily in preparation for the contest.	大会に備えて私たちは毎日練習した。	preposition
in principle	pre1	原則として	I agree with the proposal in principle.	私は原則としてその提案に賛成だ。	discourse
in proportion to	pre1	〜に比例して	Costs rise in proportion to distance.	費用は距離に比例して増える。	preposition
in reality	pre2	実際には	The task looked easy but was hard in reality.	その課題は簡単そうだったが、実際には難しかった。	discourse
in short	2	要するに	In short, we need a better plan.	要するに、もっとよい計画が必要だ。	discourse
in store for	1	〜を待ち受けて	No one knew what was in store for us.	何が私たちを待ち受けているか誰にも分からなかった。	idiom
in that	pre2	〜という点で	This method is useful in that it saves time.	この方法は時間を節約するという点で有用だ。	structure
in the air	pre2	気配が漂って・未決定で	Excitement was in the air.	興奮した空気が漂っていた。	idiom
in the distance	pre2	遠くに	We could see mountains in the distance.	遠くに山々が見えた。	preposition
in the first place	2	そもそも・第一に	Why did you agree in the first place?	そもそも、なぜ同意したのですか。	discourse
in the middle of	5	〜の真ん中に・〜の最中に	Do not call me in the middle of class.	授業の最中に電話しないで。	preposition
in the presence of	2	〜のいる所で	The document was signed in the presence of two witnesses.	その文書は2人の証人の前で署名された。	preposition
in the way	2	邪魔になって	Your bag is in the way.	あなたのかばんが邪魔になっている。	idiom
in the way of	pre2	〜の点で・〜の妨げになって	The village has little in the way of public transport.	その村には公共交通と呼べるものがほとんどない。	idiom
in the works	pre1	準備中で	A new library is in the works.	新しい図書館が準備中だ。	idiom
inside out	pre2	裏返しに・隅々まで	Your shirt is inside out.	あなたのシャツは裏返しだ。	idiom
It couldn't be better.	pre1	これ以上よくなりようがない	How was the trip? It couldn't be better.	旅行はどうでしたか。最高でした。	conversation
It goes without saying that	pre1	〜は言うまでもない	It goes without saying that safety comes first.	安全が第一なのは言うまでもない。	structure
It happens that	pre1	たまたま〜である	It happens that I know the owner.	たまたま私はその所有者を知っている。	structure
It is high time that	pre1	もう〜してよい頃だ	It is high time that we took action.	もう私たちが行動を起こしてよい頃だ。	structure	that 節では過去形を用いて、今すべきことを表す。
It is no wonder that	pre1	〜は不思議ではない	It is no wonder that she is tired.	彼女が疲れているのは不思議ではない。	structure
It is not long before	pre1	まもなく〜する	It was not long before the sun appeared.	まもなく太陽が現れた。	structure
It is not until ... that	pre1	〜して初めて…する	It was not until noon that the fog lifted.	正午になって初めて霧が晴れた。	structure
It is said that ...	3	〜だと言われている	It is said that the lake never freezes.	その湖は決して凍らないと言われている。	structure
it is time to	4	〜する時間だ	It is time to go home.	家に帰る時間だ。	structure
It is true that ..., but ...	pre1	確かに〜だが…	It is true that the plan costs more, but it is safer.	確かにその計画は費用が高いが、より安全だ。	structure
joking aside	2	冗談はさておき	Joking aside, we need to decide today.	冗談はさておき、今日決める必要がある。	discourse
judging from	2	〜から判断すると	Judging from the clouds, it may snow.	雲から判断すると、雪になるかもしれない。	preposition
Just a moment.	4	ちょっと待ってください	Just a moment. I'll find the file.	ちょっと待ってください。ファイルを探します。	conversation
just about	3	ほとんど・だいたい	We are just about ready.	私たちはほぼ準備ができている。	idiom
Just as ..., so ...	pre1	ちょうど〜であるように…である	Just as exercise strengthens the body, so reading trains the mind.	運動が体を強くするように、読書は心を鍛える。	structure
keep ~ company	pre1	〜と一緒にいて寂しくさせない	I stayed to keep my grandmother company.	祖母が寂しくないよう一緒にいた。	structure
keep ~ in mind	2	〜を心に留めておく	Keep the deadline in mind.	締め切りを心に留めておきなさい。	structure
keep an eye on	2	〜を見守る	Could you keep an eye on my bag?	私のかばんを見ていてくれますか。	idiom
keep doing	pre2	〜し続ける	Keep practicing every day.	毎日練習を続けなさい。	structure
keep on ~ing	5	〜し続ける	He kept on asking the same question.	彼は同じ質問をし続けた。	structure
keep one's fingers crossed	pre2	幸運を祈る	Keep your fingers crossed for us.	私たちの幸運を祈っていてください。	idiom
keep one's temper	2	怒りを抑える	She kept her temper during the argument.	彼女は口論の間も怒りを抑えた。	idiom
keep pace with	pre2	〜に遅れずついていく	Small firms struggle to keep pace with change.	小企業は変化に遅れずついていこうと苦労する。	idiom
keep track of	pre1	〜の経過を把握する	This chart helps us keep track of costs.	この表で費用の推移を把握できる。	idiom
know ~ by sight	pre2	〜の顔は知っている	I know the teacher by sight but not by name.	その先生は顔だけ知っていて名前は知らない。	structure
know better than to do	pre1	〜するほど愚かではない	You should know better than to trust that rumor.	そのうわさを信じるほど分別がないはずはない。	structure
last but not least	pre2	最後だが重要な	Last but not least, thank you to our volunteers.	最後になりましたが、ボランティアの皆さんに感謝します。	discourse
learn ~ by heart	pre2	〜を暗記する	We learned the poem by heart.	私たちはその詩を暗記した。	structure
leave ~ alone	pre2	〜を放っておく	Leave the sleeping dog alone.	眠っている犬をそっとしておきなさい。	structure
leave A to B	2	AをBに任せる	Leave the final choice to me.	最終判断は私に任せてください。	structure
leave nothing to be desired	pre2	申し分がない	The service leaves nothing to be desired.	そのサービスは申し分ない。	idiom
Legend has it that	pre1	伝説によれば〜だ	Legend has it that a giant built the wall.	伝説によれば巨人がその壁を築いたという。	structure
lest ~ should do	pre2	〜しないように	She spoke softly lest she should wake the baby.	赤ん坊を起こさないよう彼女は静かに話した。	structure
let alone	pre2	〜はもちろんのこと	He cannot cook an egg, let alone a full meal.	彼は卵すら料理できず、まして一食分など無理だ。	discourse
let go of	pre1	〜を手放す	Let go of the rope slowly.	ロープをゆっくり手放しなさい。	phrasal-verb
Let's see.	4	ええと・考えてみよう	Let's see. Where did I put the key?	ええと、鍵をどこに置いたかな。	conversation
lie in	pre2	〜にある	The solution lies in better communication.	解決策はよりよい意思疎通にある。	preposition
live a ~ life	pre2	〜な生活を送る	They live a quiet life by the sea.	彼らは海辺で静かな生活を送っている。	structure
long for	2	〜を切望する	The travelers longed for a hot meal.	旅行者たちは温かい食事を切望した。	preposition
look ~ in the eye	pre1	〜の目をまっすぐ見る	Look me in the eye and tell the truth.	私の目を見て本当のことを言いなさい。	structure
look on A as B	pre2	AをBと見なす	Many people look on the park as a shared garden.	多くの人がその公園を共有の庭と見なしている。	structure
look to	2	〜に期待する・注意を向ける	We look to science for answers.	私たちは答えを科学に求める。	preposition
lose face	pre2	面目を失う	He feared losing face in front of the team.	彼はチームの前で面目を失うことを恐れた。	idiom
major in	pre2	〜を専攻する	She majors in biology.	彼女は生物学を専攻している。	preposition
make a point of doing	2	必ず〜するようにする	I make a point of checking every source.	私は必ずすべての出典を確認するようにしている。	structure
make believe that	pre1	〜のふりをする	The children made believe that the box was a ship.	子どもたちは箱を船に見立てて遊んだ。	idiom
make do with	pre1	〜で間に合わせる	We had to make do with one small room.	私たちは小さな一部屋で間に合わせなければならなかった。	idiom
make fun of	pre2	〜をからかう	Do not make fun of other people's mistakes.	他人の失敗をからかってはいけない。	idiom
make good	pre1	成功する・約束を果たす	She worked hard and made good in business.	彼女は懸命に働き事業で成功した。	idiom
make it	2	間に合う・成功する	We can still make it before six.	私たちはまだ6時前に間に合う。	idiom
make much of	2	〜を重視する・大げさに扱う	The report makes much of the cost difference.	その報告書は費用の違いを重視している。	idiom
make oneself understood	pre1	自分の考えを理解してもらう	I could make myself understood in simple English.	簡単な英語で自分の考えを理解してもらえた。	structure
make the best of	2	不利な状況を最大限に生かす	We made the best of the rainy afternoon.	私たちは雨の午後をできる限り楽しんだ。	idiom
make the most of	2	〜を最大限に活用する	Make the most of your time abroad.	海外での時間を最大限に活用しなさい。	idiom
make way	pre2	道を譲る・取って代わられる	The old bridge made way for a new one.	古い橋は新しい橋に場所を譲った。	idiom
manage to do	2	何とか〜する	We managed to finish before dark.	私たちは暗くなる前に何とか終えた。	structure
many a	1	多くの〜	Many a traveler has lost the path here.	多くの旅行者がここで道に迷ってきた。	structure	単数名詞を続け、動詞も単数扱いにする。
may well do	2	〜するのももっともだ・おそらく〜する	You may well be surprised by the result.	その結果に驚くのももっともだ。	structure
Me, too.	4	私もです	I love this song. Me, too.	私はこの歌が大好きです。私もです。	conversation
meet with	2	〜を経験する・〜と会う	The proposal met with strong opposition.	その提案は強い反対に遭った。	preposition
might as well do	2	〜するほうがよい	We might as well walk; the bus is late.	バスが遅いので歩いたほうがよさそうだ。	structure
miss out on	pre1	〜の機会を逃す	Don't miss out on this chance.	この機会を逃さないで。	phrasal-verb
mistake A for B	pre2	AをBと間違える	I mistook the shadow for a person.	私は影を人と間違えた。	structure
more and more	4	ますます多くの	More and more students cycle to school.	ますます多くの生徒が自転車で通学している。	structure
more often than not	1	たいてい	More often than not, the simple answer is best.	たいてい、単純な答えが最善だ。	idiom
more or less	pre2	だいたい・多かれ少なかれ	The work is more or less complete.	仕事はだいたい完成している。	idiom
much less	pre1	まして〜ない	He cannot read French, much less write it.	彼はフランス語を読めず、まして書けない。	discourse
My pleasure.	4	どういたしまして	Thank you for your help. My pleasure.	手伝ってくれてありがとう。どういたしまして。	conversation
`

export const CURRICULUM_1900_PHRASES_I_M = Object.freeze(
  parseCurriculum1900PhraseRows(ROWS),
)
