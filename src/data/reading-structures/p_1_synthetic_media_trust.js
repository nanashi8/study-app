import { st } from './entry.js'

export default Object.freeze([
  st('[M {前| For most {前| of the last century}}], [S {並列| a photograph | or a sound recording}] [V carried] [O a special kind {前| of authority}] [M {前| in public argument}].', {
    chunks: [
      ['For most of the last century,', '前世紀のほとんどの間'],
      ['a photograph or a sound recording', '写真や録音は'],
      ['carried a special kind of authority', '特別な種類の権威を持っていました（どこでかは次へ）'],
      ['in public argument', '公の議論の中で'],
    ],
    notes: {
      'For most of the last century,': 'the last century は「前世紀（20世紀）」。most of 〜 で「〜の大部分」。',
      'carried a special kind of authority': 'carry authority で「権威を持つ（重んじられる）」。証拠として強い力を持っていたということです。',
    },
    rules: ['paragraph-map', 'main-clause-skeleton', 'noun-boundary'],
  }),
  st('[S That authority] [M never] [V came] [M {前| from the image alone}], [接 and] [S it] [V was] [M never] [C absolute].', {
    chunks: [
      ['That authority never came from the image alone,', 'その権威は、画像だけから生まれたのではありませんでした'],
      ['and it was never absolute', 'そして、決して絶対のものでもありませんでした'],
    ],
    notes: {
      'That authority never came from the image alone,': 'alone は the image の後ろで「〜だけ」。never は「決して〜ない」。',
      'and it was never absolute': 'it は That authority を指します。absolute は「絶対の」。',
    },
  }),
  st('[S It] [V depended] [M {前| on a production process {関係>a production process| [S that] [V was] [C {並列| expensive, | slow, | and difficult {to:副詞(形容詞)| [V to conceal]}}]}}].', {
    chunks: [
      ['It depended on a production process', 'それは、作る過程に支えられていました（どんな過程かは次へ）'],
      ['that was expensive, slow, and difficult to conceal', 'お金がかかり、時間もかかり、隠しにくい（過程に）'],
    ],
    notes: {
      'It depended on a production process': 'It は前の文の That authority を指します。depend on 〜 で「〜に支えられている・〜しだいである」。',
      'that was expensive, slow, and difficult to conceal': 'difficult to conceal で「隠すのが難しい」。to conceal は difficult の中身を限定します。',
    },
  }),
  st('[S Convincing fabrication] [V required] [O {並列| equipment, | skill, | and time} {関係>equipment, skill, and time| [O that] [S very few people] [V possessed]}].', {
    chunks: [
      ['Convincing fabrication required equipment, skill, and time', '本物らしい偽物を作るには、機材と技術と時間が必要でした（どんなものかは次へ）'],
      ['that very few people possessed', 'ごく少ない人しか持っていない（ものが）'],
    ],
    notes: {
      'Convincing fabrication required equipment, skill, and time': 'fabrication は「でっちあげ・偽造」。convincing は「本物らしく思わせる」。',
      'that very few people possessed': 'very few は「ほとんど〜ない」。持っている人がごくわずかだったということです。',
    },
  }),
  st('[S Ordinary readers] [V could] [M therefore] [V treat] [O a published photograph] [C {前| as reasonable evidence}] [M {前| without {動名詞| [V examining] [O it] [M closely]}}].', {
    chunks: [
      ['Ordinary readers could therefore treat a published photograph', 'そのため、ふつうの読者は、公表された写真を扱うことができました（何としてかは次へ）'],
      ['as reasonable evidence', 'もっともな証拠として'],
      ['without examining it closely', 'くわしく調べなくても'],
    ],
    notes: {
      'Ordinary readers could therefore treat a published photograph': 'treat A as B で「AをBとして扱う」。therefore は、偽物を作るのが難しかったことを受けます。',
      'without examining it closely': 'without の後ろの examining は動名詞。it は a published photograph を指します。',
    },
  }),
  st('[S Synthetic media] [V has weakened] [O this assumption] [接 rather than] [V destroyed] [O it] [M outright].', {
    chunks: [
      ['Synthetic media has weakened this assumption', '合成メディアは、この前提を弱めました'],
      ['rather than destroyed it outright', '完全に壊したのではなく'],
    ],
    notes: {
      'Synthetic media has weakened this assumption': 'synthetic media は、機械で作られた画像や音声などのことです。this assumption は、前の段落の「写真は証拠になる」という前提です。',
      'rather than destroyed it outright': 'rather than の後ろの destroyed は has に続く過去分詞で、weakened と比べています。outright は「完全に」。',
    },
    rules: ['paragraph-map', 'contrast-concession', 'reference-chain'],
  }),
  st('[S {並列| Realistic images, | voices, | and video}] [V can] [M now] [V be produced] [M quickly] [接 and] [M {前| at very low cost}].', {
    chunks: [
      ['Realistic images, voices, and video', '本物そっくりの画像や声、映像が'],
      ['can now be produced', '今では作れます（どのようにかは次へ）'],
      ['quickly and at very low cost', 'すばやく、しかもとても安く'],
    ],
    notes: {
      'can now be produced': 'can be produced は受け身で「作られうる」。now は「今では」。',
    },
  }),
  st('[S The necessary tools] [V are] [C widely available], [接 and] [S each improvement] [V lowers] [O the effort {過去分詞>the effort| [V required]}] [M again].', {
    chunks: [
      ['The necessary tools are widely available,', '必要な道具は、広く手に入ります'],
      ['and each improvement lowers the effort required again', 'そして改良のたびに、必要な手間はまた下がります'],
    ],
    notes: {
      'and each improvement lowers the effort required again': 'required は the effort を後ろから説明する過去分詞で「必要とされる手間」。again は lowers にかかります。',
    },
  }),
  st('[S A single convincing file] [V can reach] [O millions {前| of people}] [M long {副詞節:時| [接 before] [S any expert] [V examines] [O it]}].', {
    chunks: [
      ['A single convincing file', '本物らしいファイル一つが'],
      ['can reach millions of people', '何百万もの人に届くことがあります（いつかは次へ）'],
      ['long before any expert examines it', '専門家が調べるずっと前に'],
    ],
    notes: {
      'can reach millions of people': 'millions of 〜 で「何百万もの〜」。can は「〜することがある」。',
      'long before any expert examines it': 'long before 〜 で「〜よりずっと前に」。it は A single convincing file を指します。',
    },
  }),
  st('[S The obvious concern] [V is] [C {that節| [接 that] [S false material] [V will be believed] [M {前| by people {関係>people| [S who] [V have] [O no reason {to:形容詞>no reason| [V to doubt] [O it]}]}}]}].', {
    chunks: [
      ['The obvious concern is that', 'すぐ思いつく心配は、〜ということです（内容は次へ）'],
      ['false material will be believed', 'にせの素材が信じられてしまう（だれにかは次へ）'],
      ['by people', '人々に'],
      ['who have no reason to doubt it', 'それを疑う理由のない（人々に）'],
    ],
    notes: {
      'The obvious concern is that': 'that 以下が is の補語になる名詞のまとまりです。obvious は「明らかな・すぐ思いつく」。',
      'who have no reason to doubt it': 'no reason to 〜 で「〜する理由がない」。it は false material を指します。',
    },
    rules: ['paragraph-map', 'that-diagnosis', 'passive-active'],
  }),
  st('[S A fabricated recording {過去分詞>A fabricated recording| [V released] [M the night {前| before an election}]}] [V can cause] [O damage {関係>damage| [O that] [S no later correction] [V repairs]}].', {
    chunks: [
      ['A fabricated recording', '作りものの録音は（どんな録音かは次へ）'],
      ['released the night before an election', '選挙の前の晩に出された'],
      ['can cause damage', '損害を生むことがあります（どんな損害かは次へ）'],
      ['that no later correction repairs', 'あとからのどんな訂正でも直せない（損害を）'],
    ],
    notes: {
      'released the night before an election': 'released 以下は A fabricated recording を後ろから説明する過去分詞で「公開された録音」。the night before 〜 で「〜の前の晩に」。',
      'that no later correction repairs': 'no later correction は「あとのどんな訂正も〜ない」。that は damage を受けて repairs の目的語にあたります。',
    },
  }),
  st('[S Corrections] [V travel] [M more slowly {前| than the material {関係省略:目的格>the material| [S they] [V answer]}}], [接 and] [S they] [V reach] [O a much smaller audience].', {
    chunks: [
      ['Corrections travel more slowly', '訂正は、よりゆっくり伝わります（何よりかは次へ）'],
      ['than the material they answer', '訂正する相手の素材よりも'],
      ['and they reach a much smaller audience', 'しかも、届く相手もずっと少ないのです'],
    ],
    notes: {
      'than the material they answer': 'the material の後ろで目的格の関係代名詞が省かれています。answer はここでは「〜に答える（反論する）」。',
      'and they reach a much smaller audience': 'they は Corrections を指します。much は比較級 smaller を強めます。',
    },
  }),
  st('[S Many readers {前| of a false claim}] [M never] [V see] [O the response {前| to it}].', {
    chunks: [
      ['Many readers of a false claim', 'にせの主張を読んだ人の多くは'],
      ['never see the response to it', 'それへの反論を目にすることがありません'],
    ],
    notes: {
      'never see the response to it': 'the response to 〜 で「〜への返答・反論」。it は a false claim を指します。',
    },
  }),
  st('[S A subtler danger] [V works] [M {前| in the opposite direction}] [接 and] [V may prove] [C more damaging].', {
    chunks: [
      ['A subtler danger works in the opposite direction', 'もっと気づきにくい危険は、逆の向きに働き'],
      ['and may prove more damaging', 'さらに害が大きいとわかるかもしれません'],
    ],
    notes: {
      'A subtler danger works in the opposite direction': 'subtler は subtle（気づきにくい）の比較級。opposite direction は、前の段落の「にせ物が信じられる」とは逆の向きです。',
      'and may prove more damaging': 'prove ＋ 形容詞 で「〜だとわかる」。and の後ろの主語も A subtler danger です。',
    },
    rules: ['paragraph-map', 'contrast-concession', 'comparison-pairs'],
  }),
  st('[M {副詞節:時| [接 Once] [S audiences] [V know] [O {that節| [接 that] [S anything] [V can be faked]}]}], [S genuine evidence] [V can be dismissed] [M {前| at will}].', {
    chunks: [
      ['Once audiences know that', '人々がいったん〜と知ってしまうと（内容は次へ）'],
      ['anything can be faked,', '何でも作りものにできる（と）'],
      ['genuine evidence can be dismissed at will', '本物の証拠まで、好きなようにはねつけられてしまいます'],
    ],
    notes: {
      'Once audiences know that': 'Once は接続詞で「いったん〜すると」。',
      'genuine evidence can be dismissed at will': 'at will は「思いのままに」。dismiss は「退ける・はねつける」。',
    },
  }),
  st('[S An official] [V can] [M simply] [V claim] [O {that節| [接 that] [S a recording {前| of a bribe}] [V was generated]}].', {
    chunks: [
      ['An official can simply claim that', '役人は、〜と言い張るだけでよいのです（内容は次へ）'],
      ['a recording of a bribe was generated', 'わいろの録音は機械で作られたものだ（と）'],
    ],
    notes: {
      'An official can simply claim that': 'simply は「ただ〜するだけで」。前の文の「本物の証拠がはねつけられる」例です。',
      'a recording of a bribe was generated': 'bribe は「わいろ」。was generated は受け身で「（機械で）作られた」。',
    },
  }),
  st('[S Researchers] [V describe] [O this] [C {前| as a dividend {過去分詞>a dividend| [V paid] [M {前| to dishonest people}] [M {前| by the mere possibility {前| of fabrication}}]}}].', {
    chunks: [
      ['Researchers describe this as a dividend', '研究者はこれを、配当と呼びます（どんな配当かは次へ）'],
      ['paid to dishonest people', '不誠実な人々に支払われる'],
      ['by the mere possibility of fabrication', '偽造がありうるというだけのことによって'],
    ],
    notes: {
      'Researchers describe this as a dividend': 'describe A as B で「AをBと呼ぶ・説明する」。dividend は「（株の）配当」で、ここでは「おまけの得」のたとえです。',
      'paid to dishonest people': 'paid 以下は a dividend を後ろから説明する過去分詞です。',
      'by the mere possibility of fabrication': 'mere は「単なる」。偽造が本当にされなくても、ありうるというだけで得をする人がいる、ということです。',
    },
  }),
  st('[S It] [V requires] [O no technical skill], [M {副詞節:理由| [接 because] [S doubt itself] [V has become] [C extremely cheap {to:副詞(形容詞)| [V to manufacture]}]}].', {
    chunks: [
      ['It requires no technical skill,', 'それには、技術の力がまったく要りません（なぜかは次へ）'],
      ['because doubt itself has become extremely cheap', '疑いそのものが、とても安くなったからです（何をするのがかは次へ）'],
      ['to manufacture', '作り出すのが'],
    ],
    notes: {
      'It requires no technical skill,': 'It は前の文の dividend（不誠実な人が得る得）を指します。',
      'to manufacture': 'cheap to manufacture で「作り出すのが安い」。to manufacture は cheap の中身を限定します。',
    },
  }),
  st('[S Accountability] [V weakens] [M {副詞節:時| [接 whenever] [S an inconvenient record] [V can be denied] [M {前| without any supporting argument}]}].', {
    chunks: [
      ['Accountability weakens', '説明する責任は弱まります（いつかは次へ）'],
      ['whenever an inconvenient record can be denied', '都合の悪い記録を否定できるときはいつでも'],
      ['without any supporting argument', '何の裏づけもなしに'],
    ],
    notes: {
      'Accountability weakens': 'accountability は「（自分の行いを）説明する責任」。',
      'whenever an inconvenient record can be denied': 'whenever は「〜するときはいつでも」。inconvenient は「都合の悪い」。',
    },
  }),
  st('[S Detection software] [V is] [M usually] [V proposed] [C {前| as the first answer}], [接 and] [S it] [V is] [M genuinely] [C useful].', {
    chunks: [
      ['Detection software is usually proposed', '見分けるソフトは、たいてい持ち出されます（何としてかは次へ）'],
      ['as the first answer,', '最初の答えとして'],
      ['and it is genuinely useful', 'そして実際に役に立ちます'],
    ],
    notes: {
      'Detection software is usually proposed': 'detection は「見つけ出すこと・検出」。is proposed は受け身で「提案される」。',
      'and it is genuinely useful': 'genuinely は「本当に」。まずは役に立つ点を認めています。',
    },
    rules: ['paragraph-map', 'passive-active', 'parallel-shape'],
  }),
  st('[S Such tools] [V search] [M {前| for statistical traces {関係>statistical traces| [O that] [S generation] [V leaves behind] [M {前| in {並列| pixels | or sound}}]}}].', {
    chunks: [
      ['Such tools search for statistical traces', 'そうした道具は、統計上の手がかりを探します（どんなものかは次へ）'],
      ['that generation leaves behind', '生成が残していく（手がかりを）'],
      ['in pixels or sound', '画素や音の中に'],
    ],
    notes: {
      'Such tools search for statistical traces': 'search for 〜 で「〜を探す」。trace は「あと・痕跡」。',
      'that generation leaves behind': 'leave behind で「あとに残す」。generation はここでは「（機械による）生成」です。',
    },
  }),
  st('[S Their accuracy] [V falls] [M sharply] [M {副詞節:時| [接 when] [S a file] [V is compressed], [V cropped], [接 or] [V recorded] [M again] [M {前| from a screen}]}].', {
    chunks: [
      ['Their accuracy falls sharply', 'その正確さは、ぐっと落ちます（いつかは次へ）'],
      ['when a file is compressed, cropped,', 'ファイルが圧縮されたり、切り取られたり'],
      ['or recorded again from a screen', '画面から撮り直されたりすると'],
    ],
    notes: {
      'Their accuracy falls sharply': 'Their は Such tools を指します。sharply は「急に・大きく」。',
      'when a file is compressed, cropped,': 'is の後ろに compressed・cropped・recorded の三つの過去分詞が並ぶ受け身です。',
    },
  }),
  st('[S Every published detector] [M also] [V teaches] [O1 the next generation {前| of systems}] [O2 precisely {疑問詞to| [O what] [V to avoid]}].', {
    chunks: [
      ['Every published detector also teaches', '公開された見分け道具は、どれも教えてしまいます（だれに何をかは次へ）'],
      ['the next generation of systems', '次の世代のシステムに'],
      ['precisely what to avoid', '何を避ければよいかを、正確に'],
    ],
    notes: {
      'Every published detector also teaches': 'teach ＋ 人 ＋ こと で「人にことを教える」。ここでは見分け方を知られると、作る側がそれを避ける、ということです。',
      'precisely what to avoid': 'what to avoid で「何を避けるべきか」。precisely は「正確に」。',
    },
  }),
  st('[S The contest] [V is] [C asymmetric], [M {副詞節:理由| [接 since] [S one success] [V is] [C enough {前| for an attacker}] [M {副詞節:対比| [接 while] [S a verifier] [V needs] [O consistent reliability]}]}].', {
    chunks: [
      ['The contest is asymmetric,', 'この争いは、つり合っていません（なぜかは次へ）'],
      ['since one success is enough for an attacker', '攻める側は一度うまくいけば足りるのに'],
      ['while a verifier needs consistent reliability', '確かめる側はいつも確かであることが必要だからです'],
    ],
    notes: {
      'The contest is asymmetric,': 'asymmetric は「つり合いのとれていない・非対称の」。',
      'since one success is enough for an attacker': 'since はここでは「〜なので」と理由を表します。',
      'while a verifier needs consistent reliability': 'while は「〜する一方で」と対比を表します。verifier は「確かめる人」。',
    },
  }),
  st('[S Detection] [M therefore] [V deserves] [O continued investment], [接 but] [S it] [V cannot carry] [O the whole burden {前| of public trust}].', {
    chunks: [
      ['Detection therefore deserves continued investment,', 'そのため、見分ける技術には投資を続ける価値があります'],
      ['but it cannot carry the whole burden', 'しかし、それだけで重荷の全部は背負えません（何の重荷かは次へ）'],
      ['of public trust', '人々の信頼という'],
    ],
    notes: {
      'Detection therefore deserves continued investment,': 'deserve は「〜に値する」。',
      'but it cannot carry the whole burden': 'it は Detection を指します。burden は「重荷・負担」。',
    },
  }),
  st('[S A second approach] [V records] [O {疑問詞節| [M where] [S a file] [V originated]}] [M {前| instead of {動名詞| [V asking] [O {疑問詞節| [O what] [S it] [V looks like]}]}}].', {
    chunks: [
      ['A second approach records where a file originated', '二つ目のやり方は、ファイルがどこで生まれたかを記録します（何の代わりにかは次へ）'],
      ['instead of asking what it looks like', 'それがどう見えるかを問う代わりに'],
    ],
    notes: {
      'A second approach records where a file originated': 'where 以下は records の目的語になる疑問詞の節です。originate は「生まれる・始まる」。',
      'instead of asking what it looks like': 'instead of 〜ing で「〜する代わりに」。what it looks like は「それがどう見えるか」。',
    },
    rules: ['paragraph-map', 'wh-clause', 'contrast-concession'],
  }),
  st('[S A camera] [V can sign] [O an image] [M {前| at the moment {前| of capture}}], [接 and] [S later edits] [V can be added] [M {前| to the same record}].', {
    chunks: [
      ['A camera can sign an image', 'カメラは、画像に署名できます（いつかは次へ）'],
      ['at the moment of capture,', '撮った瞬間に'],
      ['and later edits can be added', 'そして、あとからの編集も加えられます（どこにかは次へ）'],
      ['to the same record', '同じ記録に'],
    ],
    notes: {
      'A camera can sign an image': 'sign はここでは「（電子的に）署名する」。',
      'at the moment of capture,': 'capture はここでは「撮影」。',
    },
  }),
  st('[S Readers] [M then] [V examine] [O a chain {前| of custody} {前| rather than the pixels themselves}].', {
    chunks: [
      ['Readers then examine a chain of custody', 'そうすると読者は、受け渡しの記録のつながりを確かめます（何ではなくかは次へ）'],
      ['rather than the pixels themselves', '画素そのものではなく'],
    ],
    notes: {
      'Readers then examine a chain of custody': 'a chain of custody は「（証拠が）だれの手をどう通ってきたかの記録のつながり」。',
      'rather than the pixels themselves': 'themselves は the pixels を強めて「画素そのもの」。',
    },
  }),
  st('[S A file {前| without such a record}] [V is] [M then] [V treated] [C {前| as unverified {前| rather than false}}], [接 so] [S the approach] [V fails] [M safely].', {
    chunks: [
      ['A file without such a record', 'そうした記録のないファイルは'],
      ['is then treated as unverified rather than false,', 'そのとき、偽物ではなく、まだ確かめられていないものとして扱われます'],
      ['so the approach fails safely', 'だから、このやり方はうまくいかないときも安全な側に倒れます'],
    ],
    notes: {
      'is then treated as unverified rather than false,': 'be treated as 〜 は受け身で「〜として扱われる」。unverified は「まだ確かめられていない」。',
      'so the approach fails safely': 'fail safely は「失敗しても安全な結果になる」。本物を偽物と決めつけずにすむ、ということです。',
    },
  }),
  st('[S {並列| Several manufacturers | and news organizations}] [V have] [M already] [V begun] [O {to:名詞| [V to adopt] [O versions {前| of this standard}]}].', {
    chunks: [
      ['Several manufacturers and news organizations', 'いくつかのメーカーや報道機関が'],
      ['have already begun', 'すでに〜し始めています（何をかは次へ）'],
      ['to adopt versions of this standard', 'この規格のいくつかの形を取り入れることを'],
    ],
    notes: {
      'have already begun': 'have begun の間の already は「すでに」。',
      'to adopt versions of this standard': 'adopt は「取り入れる」。standard はここでは「規格」。',
    },
  }),
  st('[S Provenance systems] [V carry] [O their own risks], [接 and] [S those risks] [V deserve] [O equal attention].', {
    chunks: [
      ['Provenance systems carry their own risks,', '出どころを記録する仕組みにも、それなりの危険があります'],
      ['and those risks deserve equal attention', 'そしてその危険も、同じように注意を払う価値があります'],
    ],
    notes: {
      'Provenance systems carry their own risks,': 'provenance は「出どころ・来歴」。carry はここでは「（危険などを）伴う」。',
      'and those risks deserve equal attention': 'equal は「（見分ける技術の問題と）同じだけの」。',
    },
    rules: ['paragraph-map', 'parallel-shape', 'main-clause-skeleton'],
  }),
  st('[S Signing equipment] [V is] [C expensive], [接 so] [S the poorest witnesses] [V are] [C least able {to:副詞(形容詞)| [V to prove] [O {what節| [O what] [S they] [V saw]}]}].', {
    chunks: [
      ['Signing equipment is expensive,', '署名できる機材は高いので'],
      ['so the poorest witnesses are least able', 'いちばん貧しい目撃者ほど、いちばんできません（何をかは次へ）'],
      ['to prove what they saw', '見たことを証明することが'],
    ],
    notes: {
      'so the poorest witnesses are least able': 'least は little の最上級で「いちばん〜ない」。be able to 〜 で「〜できる」。',
      'to prove what they saw': 'what they saw は「彼らが見たこと」。what が saw の目的語にあたります。',
    },
  }),
  st('[S Metadata {関係>Metadata| [S that] [V establishes] [O authenticity]}] [V may] [M also] [V reveal] [O {並列| the location, | the device, | and the identity {前| of a source}}].', {
    chunks: [
      ['Metadata that establishes authenticity', '本物であることを示すメタデータは'],
      ['may also reveal the location, the device,', '場所や機器も明かしてしまうかもしれません'],
      ['and the identity of a source', 'そして情報源の身元までも'],
    ],
    notes: {
      'Metadata that establishes authenticity': 'metadata は、ファイルについている撮影日時や機器などの情報です。authenticity は「本物であること」。',
      'and the identity of a source': 'source はここでは「情報を出した人」。identity は「身元」。',
    },
  }),
  st('[S A system {過去分詞>A system| [V designed] [M {to:副詞(目的)| [V to protect] [O the public]}]}] [V can] [M therefore] [V endanger] [O the people {関係>the people| [S who] [V expose] [O wrongdoing]}].', {
    chunks: [
      ['A system designed to protect the public', '人々を守るために作られた仕組みが'],
      ['can therefore endanger the people', 'そのため、人々を危険にさらすことがあります（どんな人々かは次へ）'],
      ['who expose wrongdoing', '不正を明るみに出す（人々を）'],
    ],
    notes: {
      'A system designed to protect the public': 'designed 以下は A system を後ろから説明する過去分詞で「〜のために作られた仕組み」。',
      'who expose wrongdoing': 'expose は「明るみに出す」、wrongdoing は「不正」。',
    },
  }),
  st('[S Any serious design] [V must allow] [O selective disclosure], [M {副詞節:目的| [接 so that] [S a claim] [V can be verified] [M {前| without {動名詞| [V exposing] [O a person]}}]}].', {
    chunks: [
      ['Any serious design must allow selective disclosure,', '真剣に作る仕組みはどれも、見せる情報を選べるようにしなければなりません'],
      ['so that a claim can be verified', '主張を確かめられるように'],
      ['without exposing a person', '人をさらすことなく'],
    ],
    notes: {
      'Any serious design must allow selective disclosure,': 'selective disclosure は「選んで明かすこと」。必要な情報だけを見せる、ということです。',
      'so that a claim can be verified': 'so that 〜 can … で「〜が…できるように」と目的を表します。',
    },
  }),
  st('[S Technical measures] [V are] [C less important {前| than the institutions {関係>the institutions| [S that] [V interpret] [接 and] [V apply] [O them]}}].', {
    chunks: [
      ['Technical measures are less important', '技術の手段は、それほど大事ではありません（何と比べてかは次へ）'],
      ['than the institutions that interpret and apply them', 'それを読み解いて使う制度ほどには'],
    ],
    notes: {
      'Technical measures are less important': 'less ＋ 形容詞 で「より〜でない」。',
      'than the institutions that interpret and apply them': 'them は Technical measures を指します。interpret and apply は「読み解いて当てはめる」。',
    },
    rules: ['paragraph-map', 'comparison-pairs', 'relative-clause'],
  }),
  st('[S Courts] [V have handled] [O disputed evidence] [M {前| for centuries}] [M {前| without {動名詞| [V assuming] [O {that節| [接 that] [S documents] [V prove] [O themselves]}]}}].', {
    chunks: [
      ['Courts have handled disputed evidence for centuries', '裁判所は何百年も、争いのある証拠を扱ってきました（どのようにかは次へ）'],
      ['without assuming that', '〜と決めてかかることなく（内容は次へ）'],
      ['documents prove themselves', '文書がそれだけで自分の正しさを示す（と）'],
    ],
    notes: {
      'Courts have handled disputed evidence for centuries': 'have handled は現在完了で「（ずっと）扱ってきた」。disputed は「争われている」。',
      'documents prove themselves': 'prove themselves は「自分で自分を証明する」。文書だけでは本物かどうか決まらない、ということです。',
    },
  }),
  st('[S They] [V rely] [M {前| on {並列| procedures, | expert testimony, | and clear rules {前| about {疑問詞節| [S who] [V must prove] [O what]}}}}].', {
    chunks: [
      ['They rely on procedures, expert testimony,', '裁判所は、手続きや専門家の証言に頼ります'],
      ['and clear rules about who must prove what', 'そして、だれが何を証明しなければならないかの、はっきりした決まりにも'],
    ],
    notes: {
      'They rely on procedures, expert testimony,': 'They は Courts を指します。rely on 〜 で「〜に頼る」。testimony は「証言」。',
      'and clear rules about who must prove what': 'who must prove what は「だれが何を証明しなければならないか」という二つの疑問詞を持つ節です。',
    },
  }),
  st('[S Newsrooms {関係>Newsrooms| [S that] [V publish] [O their verification steps]}] [V allow] [O readers] [C {to:補語| [V to judge] [O the strength {前| of a report}]}].', {
    chunks: [
      ['Newsrooms that publish their verification steps', '確かめる手順を公開する報道機関は'],
      ['allow readers', '読者が〜できるようにします（何をかは次へ）'],
      ['to judge the strength of a report', '記事がどれほど確かかを判断することを'],
    ],
    notes: {
      'allow readers': 'allow ＋ 人 ＋ to 〜 で「人が〜できるようにする」。',
      'to judge the strength of a report': 'the strength of a report は「記事の確かさ・根拠の強さ」。',
    },
  }),
  st('[S Trust {前| of this kind}] [V is] [C harder {to:副詞(形容詞)| [V to destroy]} {前| than trust {現在分詞>trust| [V resting] [M {前| on the appearance {前| of a single file}}]}}].', {
    chunks: [
      ['Trust of this kind is harder to destroy', 'この種の信頼は、壊れにくいのです（何と比べてかは次へ）'],
      ['than trust resting on the appearance', '見た目に頼っている信頼よりも（何の見た目かは次へ）'],
      ['of a single file', 'たった一つのファイルの'],
    ],
    notes: {
      'Trust of this kind is harder to destroy': 'Trust of this kind は、手続きや手順の公開に支えられた信頼です。harder to destroy は「壊すのがより難しい」。',
      'than trust resting on the appearance': 'resting 以下は trust を後ろから説明する現在分詞で「〜に頼っている信頼」。',
    },
  }),
  st('[S Platform labels] [V are] [C a weaker instrument {副詞節:比較| [接 than] [S they] [M first] [V appear] [C {to:補語| [V to be]}]}].', {
    chunks: [
      ['Platform labels are a weaker instrument', '配信サービスの表示は、力の弱い道具です（何と比べてかは次へ）'],
      ['than they first appear to be', '最初にそう見えるよりも'],
    ],
    notes: {
      'Platform labels are a weaker instrument': 'platform はここでは、動画や投稿を配信するサービスです。label は、画面に付く「注意書き」。',
      'than they first appear to be': 'they は Platform labels を指します。appear to be で「〜であるように見える」。',
    },
    rules: ['paragraph-map', 'comparison-pairs', 'main-clause-skeleton'],
  }),
  st('[S Warning labels] [V can help], [接 yet] [S unlabeled material] [V may] [M then] [V seem] [C verified] [M {前| by default}].', {
    chunks: [
      ['Warning labels can help,', '注意の表示は役に立ちます'],
      ['yet unlabeled material may then seem verified', 'しかしそうなると、表示のない素材が確かめ済みに見えてしまうかもしれません（どうしてかは次へ）'],
      ['by default', '何もしないままでも'],
    ],
    notes: {
      'yet unlabeled material may then seem verified': 'yet は「しかし」。seem ＋ 形容詞 で「〜のように見える」。unlabeled は「表示の付いていない」。',
      'by default': 'by default は「特に何もしなければ（そうなる）」。表示がないこと自体が「確認済み」の合図に見えてしまう、ということです。',
    },
  }),
  st('[S Researchers] [V describe] [O this] [C {前| as the implied truth effect}], [接 and] [S it] [V grows] [C stronger] [M {副詞節:比例| [接 as] [S labeling] [V expands]}].', {
    chunks: [
      ['Researchers describe this as the implied truth effect,', '研究者はこれを、暗黙の真実効果と呼びます'],
      ['and it grows stronger', 'そしてそれは強まっていきます（どんなときかは次へ）'],
      ['as labeling expands', '表示が広がるにつれて'],
    ],
    notes: {
      'Researchers describe this as the implied truth effect,': 'implied は「暗に示された」。表示がないものは本当だと思われる、という働きの名前です。',
      'as labeling expands': 'as はここでは「〜するにつれて」。',
    },
  }),
  st('[S Labels] [V must] [M therefore] [V describe] [O {what節| [S what] [V was] [M actually] [V checked]}], [M not merely] [V announce] [O {that節| [接 that] [S something] [V was checked]}].', {
    chunks: [
      ['Labels must therefore describe what was actually checked,', 'そのため表示は、実際に何を確かめたかを書かなければなりません'],
      ['not merely announce that something was checked', '何かを確かめた、と知らせるだけではいけません'],
    ],
    notes: {
      'Labels must therefore describe what was actually checked,': 'what was actually checked は「実際に確かめられたもの」。describe の目的語です。',
      'not merely announce that something was checked': 'must の後ろに describe と announce が並びます。not merely は「単に〜するだけでなく」。',
    },
  }),
  st('[S Education] [V is] [M often] [V recommended], [接 and] [S it] [V is] [M genuinely] [C necessary {前| rather than merely fashionable}].', {
    chunks: [
      ['Education is often recommended,', '教育はよくすすめられます'],
      ['and it is genuinely necessary', 'そして本当に必要なものです（何ではなくかは次へ）'],
      ['rather than merely fashionable', 'ただの流行りではなく'],
    ],
    notes: {
      'Education is often recommended,': 'is recommended は受け身で「すすめられる」。',
      'rather than merely fashionable': 'fashionable は「流行の」。merely は「単に」。',
    },
    rules: ['paragraph-map', 'contrast-concession', 'passive-active'],
  }),
  st('[S The real goal] [V is] [C careful judgment {前| rather than the universal suspicion {関係>the universal suspicion| [S that] [V spreads] [M so easily]}}].', {
    chunks: [
      ['The real goal is careful judgment', '本当のねらいは、慎重な判断です（何ではなくかは次へ）'],
      ['rather than the universal suspicion', '何でも疑う気持ちではなく（どんな気持ちかは次へ）'],
      ['that spreads so easily', 'とても広がりやすい（何でも疑う気持ち）'],
    ],
    notes: {
      'rather than the universal suspicion': 'universal suspicion は「何に対しても向ける疑い」。',
    },
  }),
  st('[S A public {関係>A public| [S that] [V doubts] [O everything]}] [V is] [C as easy {to:副詞(形容詞)| [V to manipulate]} {前| as a public {関係>a public| [S that] [V believes] [O everything]}}].', {
    chunks: [
      ['A public that doubts everything', '何でも疑う人々は'],
      ['is as easy to manipulate', '同じくらい操られやすいのです（何と比べてかは次へ）'],
      ['as a public that believes everything', '何でも信じる人々と'],
    ],
    notes: {
      'A public that doubts everything': 'a public は「（一つのまとまりとしての）人々・世間」。',
      'is as easy to manipulate': 'as 〜 as … で「…と同じくらい〜」。easy to manipulate は「操りやすい」。',
    },
  }),
  st('[S Useful teaching] [V shows] [O1 students] [O2 {疑問詞to| [M how] [V to ask] [O {並列| {疑問詞節| [S who] [V published] [O a claim]} | and {疑問詞節| [S what independent evidence] [V supports] [O it]}}]}].', {
    chunks: [
      ['Useful teaching shows students how to ask', '役に立つ教え方は、生徒に問い方を示します（何を問うかは次へ）'],
      ['who published a claim', 'だれがその主張を出したのか'],
      ['and what independent evidence supports it', 'そして、どんな独立した証拠がそれを支えているのか（を）'],
    ],
    notes: {
      'Useful teaching shows students how to ask': 'show ＋ 人 ＋ how to 〜 で「人に〜のしかたを示す」。',
      'and what independent evidence supports it': 'what はここでは「どんな」で、what independent evidence が節の主語です。it は a claim を指します。',
    },
  }),
  st('[S The burden {前| of this new work}] [V is distributed] [M very unevenly] [M {前| across the world}].', {
    chunks: [
      ['The burden of this new work', 'この新しい仕事の負担は'],
      ['is distributed very unevenly across the world', '世界の中で、とても偏って分かれています'],
    ],
    notes: {
      'The burden of this new work': 'this new work は、証拠を確かめる仕事のことです。',
      'is distributed very unevenly across the world': 'is distributed は受け身で「分けられている」。unevenly は「むらがあって・偏って」。',
    },
    rules: ['paragraph-map', 'passive-active', 'main-clause-skeleton'],
  }),
  st('[S Large newsrooms] [V can employ] [O verification teams], [M {副詞節:対比| [接 while] [S a local reporter {現在分詞>a local reporter| [V covering] [O a rural election]}] [V cannot]}].', {
    chunks: [
      ['Large newsrooms can employ verification teams,', '大きな報道機関は、確かめる専門のチームを雇えます'],
      ['while a local reporter covering a rural election', '一方、地方の選挙を取材する地元の記者には'],
      ['cannot', 'できません'],
    ],
    notes: {
      'while a local reporter covering a rural election': 'while は「〜する一方で」と対比を表します。covering は a local reporter を後ろから説明する現在分詞で「〜を取材する記者」。',
      'cannot': 'cannot の後ろには employ verification teams が省かれています。',
    },
  }),
  st('[S {並列| Most detection tools | and training materials}] [V are produced] [M {前| for a few widely spoken languages}].', {
    chunks: [
      ['Most detection tools and training materials are produced', '見分ける道具や研修の資料のほとんどは、作られています（何向けにかは次へ）'],
      ['for a few widely spoken languages', '広く話されている少しの言語のために'],
    ],
    notes: {
      'for a few widely spoken languages': 'widely spoken は「広く話されている」。a few は「少しの」。それ以外の言語を使う地域は取り残されやすい、ということです。',
    },
  }),
  st('[S Communities {前| with the fewest resources}] [M therefore] [V face] [O the highest risk {前| of manufactured evidence}].', {
    chunks: [
      ['Communities with the fewest resources', '使えるものがいちばん少ない地域社会が'],
      ['therefore face the highest risk', 'そのため、いちばん高い危険にさらされます（何のかは次へ）'],
      ['of manufactured evidence', '作られた証拠の'],
    ],
    notes: {
      'Communities with the fewest resources': 'fewest は few の最上級で「いちばん少ない」。',
      'of manufactured evidence': 'manufactured はここでは「（にせ物として）作られた」。',
    },
  }),
  st('[S A better approach] [V asks] [O {疑問詞節| [S what] [V supports] [O a claim]} {前| rather than {whether節| [接 whether] [S an image] [V is] [C real]}}].', {
    chunks: [
      ['A better approach asks what supports a claim', 'よりよいやり方は、何が主張を支えているのかを問います（何ではなくかは次へ）'],
      ['rather than whether an image is real', '画像が本物かどうかではなく'],
    ],
    notes: {
      'A better approach asks what supports a claim': 'what supports a claim は「何が主張を支えるのか」という疑問詞の節で、asks の目的語です。',
      'rather than whether an image is real': 'rather than の後ろに whether の節が来て、二つの問いを比べています。',
    },
    rules: ['paragraph-map', 'wh-clause', 'contrast-concession'],
  }),
  st('[S A single file] [V is] [M rarely] [C decisive] [M {前| on its own}], [M {副詞節:譲歩| [接 whether] [S it] [V happens to be] [C genuine] [M or not]}].', {
    chunks: [
      ['A single file is rarely decisive', '一つのファイルが決め手になることは、めったにありません（どのようにかは次へ）'],
      ['on its own,', 'それだけで'],
      ['whether it happens to be genuine or not', 'たまたま本物であっても、そうでなくても'],
    ],
    notes: {
      'A single file is rarely decisive': 'decisive は「決め手になる」。rarely は「めったに〜ない」。',
      'on its own,': 'on its own は「それだけで」。',
      'whether it happens to be genuine or not': 'whether 〜 or not で「〜であってもなくても」。happen to 〜 は「たまたま〜する」。',
    },
  }),
  st('[S {並列| Independent records, | consistent testimony, | and institutions {関係>institutions| [S that] [V can be questioned]}}] [V carry] [O far more weight] [M together].', {
    chunks: [
      ['Independent records, consistent testimony,', '別々の記録や、食い違いのない証言'],
      ['and institutions that can be questioned', 'そして問いただすことのできる制度は'],
      ['carry far more weight together', '合わさると、ずっと大きな重みを持ちます'],
    ],
    notes: {
      'and institutions that can be questioned': 'that は institutions を受ける関係代名詞で、受け身の can be questioned の主語にあたります。',
      'carry far more weight together': 'far は比較級 more を強めて「はるかに」。together は「合わさって」。',
    },
  }),
  st('[S Belief] [M never] [V rested] [M {前| on the image alone}], [接 and] [S the present task] [V is] [C {to:補語| [V to rebuild] [O the arrangements {関係>the arrangements| [S that] [V made] [O evidence] [C trustworthy]}]}].', {
    chunks: [
      ['Belief never rested on the image alone,', '信じることは、画像だけに支えられていたのではありません'],
      ['and the present task', 'そして今の課題は'],
      ['is to rebuild the arrangements', '仕組みを立て直すことです（どんな仕組みかは次へ）'],
      ['that made evidence trustworthy', '証拠を信頼できるものにしていた（仕組みを）'],
    ],
    notes: {
      'Belief never rested on the image alone,': 'rest on 〜 で「〜に支えられる」。第2文の「権威は画像だけから生まれたのではない」とつながる結びです。',
      'that made evidence trustworthy': 'make ＋ O ＋ C で「OをCにする」。trustworthy は「信頼できる」。',
    },
  }),
])
