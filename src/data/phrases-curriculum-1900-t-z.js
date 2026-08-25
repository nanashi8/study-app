import { parseCurriculum1900PhraseRows } from './curriculum-phrase-utils.js'

// 出典順ではなく、正規形の英字順。空所で始まる2項目も語句本体の t で配置する。
const ROWS = String.raw`
take ~ by surprise	2	〜を驚かせる	The sudden question took me by surprise.	突然の質問に私は驚いた。	structure
take A for B	pre2	AをBだと思い込む	I took the distant light for a star.	私は遠くの明かりを星だと思った。	structure
take a risk	pre2	危険を冒す	Sometimes we must take a risk to improve.	改善するには時に危険を冒さなければならない。	idiom
take control of	2	〜を支配する・管理する	A new team took control of the project.	新しいチームが計画の管理を引き受けた。	idiom
take hold of	pre1	〜をしっかりつかむ	Take hold of the rail before you step down.	降りる前に手すりをしっかりつかみなさい。	idiom
take it easy	pre1	気楽にする・無理をしない	You look tired, so take it easy today.	疲れているようだから今日は無理をしないで。	idiom
take notice of	pre1	〜に注意を払う	The council finally took notice of our request.	評議会はついに私たちの要望に注意を向けた。	idiom
take office	pre2	就任する	The new mayor takes office next month.	新市長は来月就任する。	idiom
take one's place	pre2	〜の代わりをする・所定の位置に着く	Mika took her place at the front of the line.	ミカは列の先頭の所定の位置に着いた。	idiom
take one's time	pre1	ゆっくり時間をかける	Take your time and read each question.	急がず各問題を読んでください。	idiom
take pains	pre1	骨を折る	She took pains to explain every step.	彼女は各段階を説明するのに骨を折った。	idiom
take pity on	2	〜を気の毒に思う	A farmer took pity on the injured bird.	農夫は傷ついた鳥を気の毒に思った。	idiom
take shape	pre2	形を成す	The plan began to take shape after the meeting.	会議後、その計画は形を成し始めた。	idiom
take the trouble to do	pre2	わざわざ〜する	He took the trouble to check every figure.	彼はわざわざすべての数字を確認した。	structure
take turns	pre2	交代でする	We took turns reading aloud.	私たちは交代で音読した。	idiom
talk A into B	2	Aを説得してBさせる	She talked me into joining the club.	彼女は私を説得してクラブに入らせた。	structure
tell on	pre1	〜に悪影響を及ぼす・〜を告げ口する	Lack of sleep is beginning to tell on him.	睡眠不足が彼に響き始めている。	phrasal-verb
Thank you.	4	ありがとう	Thank you for waiting.	待ってくれてありがとう。	conversation
Thanks for ~ .	4	〜をありがとう	Thanks for your helpful advice.	役に立つ助言をありがとう。	conversation
that is to say	2	すなわち	The route is direct; that is to say, there are no changes.	その経路は直通、つまり乗り換えがない。	discourse
that much 比較級	pre1	それだけいっそう〜	The clear map made the walk that much easier.	分かりやすい地図のおかげで徒歩がそれだけ楽になった。	structure
That's right.	4	そのとおりです	Is this the final stop? That's right.	ここが終点ですか。そのとおりです。	conversation
the bottom line	pre2	最も重要な点・最終結果	The bottom line is that we need more time.	最も重要なのは、もっと時間が必要だということだ。	idiom
The chances are that	pre1	おそらく〜だ	The chances are that the road is closed.	おそらくその道は閉鎖されている。	structure
the elephant in the room	pre1	皆が避けている明白な問題	The rising cost was the elephant in the room.	費用の増大は皆が避けていた明白な問題だった。	idiom
the former ..., the latter ...	pre1	前者は〜、後者は…	Tea and coffee are offered; the former is free, the latter is not.	紅茶とコーヒーがあり、前者は無料だが後者は有料だ。	structure
the last ... to do	2	最も〜しそうにない…	He is the last person to break a promise.	彼は最も約束を破りそうにない人だ。	structure
the moment	pre1	〜するとすぐ	Call me the moment you arrive.	着いたらすぐ私に電話して。	structure
the other way around	pre1	逆に・反対に	I thought she helped him, but it was the other way around.	彼女が彼を助けたと思ったが、逆だった。	idiom
the pros and cons	pre1	賛否・長所と短所	We discussed the pros and cons of the proposal.	私たちは提案の長所と短所を話し合った。	idiom
There is no doing	pre1	〜することはできない	There is no knowing what will happen.	何が起こるか知ることはできない。	structure
There is something wrong with	pre2	〜の具合が悪い・〜に問題がある	There is something wrong with this printer.	このプリンターはどこか具合が悪い。	structure
these days	4	近ごろ	Many people work from home these days.	近ごろは多くの人が自宅で働く。	idiom
think again	pre1	考え直す	If you think the task is easy, think again.	その課題が簡単だと思うなら、考え直した方がよい。	idiom
think much of	pre1	〜を高く評価する	The critics did not think much of the film.	批評家はその映画を高く評価しなかった。	idiom
think of A as B	pre2	AをBと考える	We think of the library as a shared classroom.	私たちは図書館を共有の教室と考えている。	structure
throw up	pre1	吐く・急いで建てる	The rough sea made several passengers throw up.	荒れた海で何人かの乗客が吐いた。	phrasal-verb
tie up	pre2	〜を縛る・〜をふさぐ	The accident tied up traffic for an hour.	事故で交通が1時間滞った。	phrasal-verb
... to come	2	これから先の〜	This decision will matter for years to come.	この決定はこれから何年にもわたって重要になる。	structure
to death	2	死ぬほど・ひどく	The loud noise frightened me to death.	大きな音に私はひどく驚いた。	idiom
... to go	2	残り〜	We have only two pages to go.	残りは2ページだけだ。	structure
to make matters worse	2	さらに悪いことに	To make matters worse, it began to rain.	さらに悪いことに、雨が降り始めた。	discourse
to one's advantage	2	〜に有利に	She used her experience to her advantage.	彼女は経験を自分に有利に生かした。	idiom
to oneself	3	自分だけに・独り占めして	I had the whole room to myself.	私は部屋全体を独り占めした。	idiom
to say nothing of	2	〜は言うまでもなく	The hike is hard for adults, to say nothing of children.	その山歩きは大人にも大変で、子どもならなおさらだ。	discourse
to tell the truth	2	実を言うと	To tell the truth, I forgot the appointment.	実を言うと、約束を忘れていた。	discourse
to the best of one's knowledge	pre1	〜の知る限りでは	To the best of my knowledge, the data are correct.	私の知る限り、そのデータは正しい。	idiom
to the contrary	pre2	それと反対の趣旨の	There is no evidence to the contrary.	それと反対の証拠はない。	idiom
to the effect that	pre1	〜という趣旨の	We received a message to the effect that the event was canceled.	催しが中止だという趣旨の連絡を受けた。	structure
to the full	pre1	十分に・心ゆくまで	Enjoy the holiday to the full.	休暇を心ゆくまで楽しみなさい。	idiom
to the point	2	要点を突いて	Her answer was brief and to the point.	彼女の答えは簡潔で要点を突いていた。	idiom
treat A to B	pre1	AにBをおごる・味わわせる	My aunt treated us to lunch.	叔母が私たちに昼食をおごってくれた。	structure
turn a blind eye to	pre2	〜を見て見ぬふりをする	We must not turn a blind eye to bullying.	いじめを見て見ぬふりしてはいけない。	idiom
turn A into B	pre2	AをBに変える	They turned the warehouse into a theater.	彼らは倉庫を劇場に変えた。	structure
turn in	2	〜を提出する・寝る	Please turn in your report by Friday.	金曜日までに報告書を提出してください。	phrasal-verb
under way	2	進行中で	The repairs are already under way.	修理はすでに進行中だ。	idiom
up and down	2	上下に・あちこち	The boat moved up and down on the waves.	船は波の上で上下に動いた。	idiom
up to date	pre2	最新の	Keep your contact information up to date.	連絡先情報を最新に保ちなさい。	idiom
upside down	pre2	上下逆さまに	The picture was hanging upside down.	その絵は上下逆さまに掛かっていた。	idiom
upwards of	pre1	〜を超える	The repair may cost upwards of ten thousand yen.	修理には1万円を超える費用がかかるかもしれない。	preposition
used to do	pre2	以前はよく〜した	I used to walk this path every day.	私は以前毎日この道を歩いたものだ。	structure	現在の習慣ではなく過去の習慣・状態を表す。be used to doing と区別する。
very much	4	とても	I enjoyed the concert very much.	私はその演奏会をとても楽しんだ。	idiom
want to	3	〜したい	I want to learn another language.	私は別の言語を学びたい。	structure
watch one's step	pre1	足元に気を付ける・行動に注意する	Watch your step on the wet floor.	ぬれた床では足元に気を付けて。	idiom
wear out	2	使い古す・疲れ果てさせる	These shoes wore out after years of use.	この靴は何年も使ってすり減った。	phrasal-verb
Welcome to ~ .	4	〜へようこそ	Welcome to our school.	私たちの学校へようこそ。	conversation
What ... for?	2	何のために〜か	What did you buy this rope for?	何のためにこのロープを買ったのですか。	structure
what ... is	2	〜の現在の姿・本質	Experience made the town what it is today.	経験がその町を今日の姿にした。	structure
What about ~ ?	4	〜はどうですか	What about the second option?	二つ目の選択肢はどうですか。	conversation
What is ... like?	2	〜はどのようなものか	What is your new teacher like?	新しい先生はどんな人ですか。	structure
what is more	pre1	さらに	The route is short; what is more, it is safe.	その道は短く、さらに安全だ。	discourse
what we call	pre1	いわゆる	This is what we call a feedback loop.	これはいわゆるフィードバック・ループだ。	structure
what with A and B	pre2	AやらBやらで	What with the rain and the wind, we stayed home.	雨やら風やらで、私たちは家にいた。	structure
What's up?	4	どうしたの・最近どう	You look worried. What's up?	心配そうだね。どうしたの。	conversation
when it comes to	pre1	〜のこととなると	When it comes to maps, Aya is the expert.	地図のこととなると、アヤが専門家だ。	preposition
Why don't we ~ ?	4	〜しませんか	Why don't we take a short break?	少し休憩しませんか。	conversation
will do	2	間に合う・十分である	Any clean container will do.	清潔な容器ならどれでも間に合う。	idiom
with all	2	〜にもかかわらず	With all his experience, he still asks questions.	経験豊富なのに、彼は今も質問する。	preposition
worse still	pre1	さらに悪いことに	The road was narrow and, worse still, icy.	道は狭く、さらに悪いことに凍っていた。	discourse
would like A to do	4	Aに〜してほしい	I would like you to read this page.	あなたにこのページを読んでほしい。	structure
would like to	4	〜したい	I would like to ask a question.	質問したいです。	structure
would rather do	2	むしろ〜したい	I would rather wait until morning.	私はむしろ朝まで待ちたい。	structure
Would you like ~ ?	4	〜はいかがですか	Would you like some water?	お水はいかがですか。	conversation
yearn for	pre1	〜を切望する	People everywhere yearn for peace.	あらゆる場所の人々が平和を切望している。	preposition
You're kidding me.	pre1	冗談でしょう	The train left already? You're kidding me.	列車はもう出たの。冗談でしょう。	conversation
`

export const CURRICULUM_1900_PHRASES_T_Z = Object.freeze(
  parseCurriculum1900PhraseRows(ROWS),
)
