// 語根カードの似た語（src/data/lookalike-origins.js の 1）。カードごとに [つながり, '語 語 …', 説明]。
// つながりはカードの語根との関係。same 同じ語源・distant 遠い親戚・unrelated 別の語源・unclear はっきりしない。
const S = 'same'
const D = 'distant'
const U = 'unrelated'
const Q = 'unclear'

export const ROOT_LOOKALIKES = Object.freeze({
  // port ＝ 運ぶ（ラテン語 portāre）
  port: [
    [D, 'opportunity', 'ラテン語 ob-「〜に向かって」＋ portus「港」から。港へ向かう（のによい風が吹く）→よい折→「機会」。portus「港」と portāre「運ぶ」は、どちらも「通り抜ける・渡る」を表す古い語根にさかのぼる遠い親戚。'],
    [S, 'portly', 'port「身のこなし・態度」＋ -ly。port は古フランス語 port「体の運び方」（ラテン語 portāre「運ぶ」から）で、体を堂々と運ぶ→「恰幅のよい」。このカードと同じ portāre から。'],
    [U, 'portray portrait', '古フランス語 portraire「描き出す」（pour-「前へ」＋ traire「引く」。ラテン語 prōtrahere から）。port ではなく por-「前へ」＋ trait「引く」で、tract（引く）の仲間。portāre とは関係ない。'],
    [U, 'portion proportion', 'ラテン語 portiō「分け前」（pars「部分」の仲間とされる）から。proportion は prō portiōne「分け前に応じて」から。portāre「運ぶ」とは関係ない。'],
    [U, 'portend portent portentous', 'ラテン語 portendere「前もって示す」（por-「前へ」＋ tendere「差し出す」）から。port ではなく por- ＋ tend（伸ばす）で、portāre とは関係ない。'],
  ],
  // spect / spic ＝ 見る（ラテン語 specere）
  spect: [
    [S, 'circumspect', 'ラテン語 circum-「まわりを」＋ specere「見る」→まわりをよく見る→「慎重な・用心深い」。このカードと同じ specere から。'],
  ],
  // ject ＝ 投げる（ラテン語 iacere）
  ject: [
    [S, 'eject', 'ラテン語 ē-「外へ」＋ iacere「投げる」→外へ投げ出す→「追い出す・放出する」。このカードと同じ iacere から。'],
  ],
  // duc / duct ＝ 導く（ラテン語 dūcere）
  duct: [
    [U, 'duck', '古英語 duce「水にもぐる鳥」（dūcan「もぐる」から）。英語にもとからある語で、ラテン語 dūcere「導く」とは関係ない。'],
  ],
  // pos / pon ＝ 置く（ラテン語 pōnere）
  pos: [
    [S, 'post postcard post_office', 'post はイタリア語 posta「宿場」（ラテン語 pōnere「置く」の過去分詞 posita から）。街道に置いた中継所→「郵便」、人を置く持ち場→「地位」。このカードと同じ pōnere から。'],
    [Q, 'suppose impose depose', '古フランス語 poser「置く」から。poser は後期ラテン語 pausāre「止める・休ませる」から来たが、ラテン語 pōnere「置く」と混ざってその意味を受け継いだ。形の元は別の語で、意味は pōnere の仲間。'],
    [U, 'repose', '古フランス語 reposer「休む」（後期ラテン語 repausāre、pausāre「止まる・休む」から）。pause の仲間で、pōnere「置く」とは関係ない。'],
    [U, 'possess possession possible impossible', 'ラテン語 potis「力のある」の仲間（posse「できる」、possidēre「占有する」＝ potis ＋ sedēre「座る」）。この pos は pōnere「置く」ではない。'],
    [U, 'ponder ponderous', 'ラテン語 pondus「重さ」（pendere「量る」の仲間）から。重さを量る→「熟考する」。pend（ぶら下がる・量る）の仲間で、pōnere とは関係ない。'],
    [U, 'postulate', 'ラテン語 postulāre「求める」（poscere「求める」の仲間）から。議論の出発点として認めるよう求める→「仮定する」。pōnere「置く」とは関係ない。'],
    [U, 'post_2 poster', 'ラテン語 postis「戸口の柱」から。柱に貼り紙を掲げる→「掲示する・投稿する」、貼り出すもの→「ポスター」。「郵便」の post とは別の語で、pōnere とは関係ない。'],
    [U, 'pond', '中英語 ponde「囲った水」から（pound「囲い」と同じ語源）。英語にもとからある語で、pōnere とは関係ない。'],
  ],
  // ven / vent ＝ 来る（ラテン語 venīre）
  vent: [
    [U, 'vendor venal venality', 'ラテン語 vēnum「売り物」の仲間（vendere「売る」＝ vēnum ＋ dare「与える」、vēnālis「売り物の」）。venīre「来る」とは関係ない。'],
    [U, 'revenge vengeance vengeful', '古フランス語 vengier「仕返しする」（ラテン語 vindicāre「取り戻す・罰する」から）。avenge の仲間で、venīre「来る」とは関係ない。'],
    [U, 'venerate veneration venerable venom', 'ラテン語 venus「愛・魅力」と同じ仲間の語から。venerārī「あがめる」から venerate、venēnum（もとは「ほれ薬」→「毒」）から venom。venīre「来る」とは関係ない。'],
  ],
  // fer ＝ 運ぶ・もたらす（ラテン語 ferre）
  fer: [
    [U, 'fervent fervently fervor fervid', 'ラテン語 fervēre「沸き立つ」から（ferv のカードの仲間）。ferre「運ぶ」とは関係ない。'],
    [U, 'ferociously', 'ferocious「どう猛な」（ラテン語 ferōx、ferus「野生の」から）＋ -ly。ferre「運ぶ」とは関係ない。'],
    [U, 'interfere', "古フランス語 s'entreferir「打ち合う」（ラテン語 ferīre「打つ」から）。この fer は ferre「運ぶ」ではなく ferīre「打つ」。"],
  ],
  // cap / cept ＝ 取る・つかむ（ラテン語 capere）
  cept: [
    [U, 'capital capitalism capitalist capitalize captain cape capitulate recapitulate', 'ラテン語 caput「頭」の仲間（caput のカード）。頭→「首都・資本・大文字」、頭に立つ人→「船長・主将」、陸の頭のように突き出た所→「岬」、見出しごとの条項→「降伏する」「要約する」。capere「取る」とは別の語。'],
    [U, 'capricious', 'イタリア語 capriccio「気まぐれ」から（capo「頭」＋ riccio「ハリネズミ」で、こわくて髪が逆立つことから、という説がある）。capere「取る」とは関係ない。'],
  ],
  // mit / miss ＝ 送る（ラテン語 mittere）
  miss: [
    [U, 'mitigate mitigation', 'ラテン語 mītigāre「和らげる」（mītis「柔らかい」＋ agere「する」）から。mittere「送る」とは関係ない。'],
    [U, 'miss missing', '古英語 missan「的を外す」から。英語にもとからある語で、mittere「送る」とは関係ない（mission・missile の miss とは別）。'],
  ],
  // vid / vis ＝ 見る（ラテン語 vidēre）
  vis: [
    [U, 'viscous', 'ラテン語 viscum「ヤドリギ・（その実から作る）鳥もち」から。鳥もちのようにねばねば→「粘り気のある」。vidēre「見る」とは関係ない。'],
  ],
  // tain / ten ＝ 保つ（ラテン語 tenēre）
  tain: [
    [S, 'tenacious tenacity tenet tenancy', 'ラテン語 tenēre「保つ・持つ」から（tenāx「しっかりつかんで離さない」、tenet「彼は持っている」、tenant「借りて持つ人」）。このカードと同じ tenēre。'],
    [S, 'tennis', '古フランス語 tenez「受けよ」（tenir「持つ・受ける」の命令の形。ラテン語 tenēre から）から来たとされる。サーブの前のかけ声から。このカードと同じ tenēre にさかのぼる。'],
    [D, 'attend attendance attendant extend extended extensive extension intend intense intensely intensify intensified intensity pretend pretense contend portend tend tendency tendentious tense tension tend_2', 'ラテン語 tendere「伸ばす・張る」の仲間（tend のカード）。tenēre「保つ」とは別の語だが、どちらも「ぴんと張る・引き伸ばす」を表す古い語根にさかのぼる遠い親戚（しっかり張って離さない→保つ）。'],
    [D, 'tender', 'ラテン語 tener「柔らかい・か弱い」から。tenuis「細い」と同じく「引き伸ばす」を表す古い語根から来たとされ、tenēre とは遠い親戚（引き伸ばして薄い→か弱い）。'],
    [D, 'tenuous attenuate', 'ラテン語 tenuis「細い・薄い」から（引き伸ばして細い）。tenēre と同じ「引き伸ばす」を表す古い語根にさかのぼる遠い親戚。'],
    [Q, 'tentative', 'ラテン語 temptāre・tentāre「さわってみる・試す」から（tempt・attempt の仲間）。tenēre・tendere とつながるとする説もあるが、はっきりしない。'],
    [Q, 'tense_2', '古フランス語 tens「時」（ラテン語 tempus「時」から）。文法の「時制」の tense。tempus は「引き伸ばす」を表す古い語根から来たとする説もあるが、はっきりしない。'],
    [U, 'attain', '古フランス語 ataindre（ラテン語 attingere、ad-「〜へ」＋ tangere「触れる」）から。手が届く→「達成する」。tact（触れる）の仲間で、tenēre とは関係ない。'],
    [U, 'taint tainted', '古フランス語 teint「染めた」（ラテン語 tingere「染める・ぬらす」から）。tint の仲間で、tenēre とは関係ない。'],
    [U, 'ten tenth', '古英語 tīen「10」から。英語にもとからある数の語で、tenēre とは関係ない。'],
  ],
  // fac / fect / fic ＝ 作る・なす（ラテン語 facere）
  fact: [
    [S, 'face surface superficial interface facade', 'ラテン語 faciēs「姿・形・顔」から。faciēs は facere「作る」から出た語とされ、作られた形→「姿・顔」。surface は上の面、superficial は表面の、facade は建物の顔（正面）。'],
    [U, 'preface', 'ラテン語 praefātiō「前置きのことば」（prae-「前に」＋ fārī「話す」）から。face「顔」とも facere「作る」とも関係ない。'],
    [U, 'fiction fictional', 'ラテン語 fingere「形づくる・こしらえる」から（figure の仲間）。facere「作る」とは別の語。'],
    [U, 'fickle', '古英語 ficol「ずるい・人を欺く」から。英語にもとからある語で、facere とは関係ない。'],
    [Q, 'facetious', 'ラテン語 facētus「機知に富む・上品な」から、フランス語を経た語。facētus の元ははっきりせず、facere とのつながりも分かっていない。'],
  ],
  // mov / mot ＝ 動く（ラテン語 movēre）
  mot: [
    [U, 'mother', '古英語 mōdor「母」から。英語にもとからある語で、ラテン語 movēre「動く」とは関係ない。'],
    [U, 'moth', '古英語 moþþe「ガ」から。英語にもとからある語で、movēre とは関係ない。'],
  ],
  // tend / tens ＝ 伸ばす・張る（ラテン語 tendere）
  tend: [
    [S, 'tend_2', 'attend「付き添う」の頭が落ちてできた語（ラテン語 attendere、ad-「〜へ」＋ tendere「伸ばす」）。心を向ける→「世話をする」。このカードと同じ tendere にさかのぼる。'],
    [D, 'tender', 'ラテン語 tener「柔らかい・か弱い」から。tenuis「細い」と同じく「引き伸ばす」を表す古い語根から来たとされ、tendere とは遠い親戚（引き伸ばして薄い→か弱い）。'],
    [Q, 'tense_2', '古フランス語 tens「時」（ラテン語 tempus「時」から）。文法の「時制」の tense。tempus は「引き伸ばす」を表す古い語根から来たとする説もあるが、はっきりしない。'],
  ],
  // form ＝ 形づくる（ラテン語 forma）
  form: [
    [U, 'formidable', 'ラテン語 formīdō「恐れ」から。恐れを起こさせる→「恐るべき・手ごわい」。forma「形」とは関係ない。'],
    [U, 'former formerly', '古英語 forma「最初の」（fore「前に」の仲間）に、比べる形の -er が付いた語。英語にもとからある語で、forma「形」とは関係ない。'],
  ],
  // vac ＝ 空（から）（ラテン語 vacāre）
  vac: [
    [U, 'vaccine vaccinate', 'ラテン語 vacca「雌牛」から。牛がかかる軽い病気のうみを使った予防接種から→「ワクチン」。vacāre「空である」とは関係ない。'],
    [U, 'vacillate', 'ラテン語 vacillāre「ぐらぐら揺れる」から→「（決心が）ぐらつく」。vacāre とは関係ない。'],
  ],
  // spir ＝ 呼吸する・息（ラテン語 spīrāre）
  spir: [
    [U, 'spiral', 'ギリシャ語 speira「巻いたもの」から（中世ラテン語 spīrālis を経た語）。spīrāre「息をする」とは関係ない。'],
    [U, 'spire', '古英語 spīr「細長い茎・芽」から。細長くとがったもの→「尖塔」。英語にもとからある語で、spīrāre とは関係ない。'],
  ],
  // val / vail ＝ 価値・力（ラテン語 valēre）
  val: [
    [U, 'valley', 'ラテン語 vallis「谷」から（古フランス語 valee を経た語）。valēre「力がある」とは関係ない。'],
    [U, 'valve', 'ラテン語 valva「両開きの扉の片方」から。開いたり閉じたりする扉→「弁・バルブ」。valēre とは関係ない。'],
    [U, 'interval', 'ラテン語 intervallum「とりでの柵と柵の間」（inter-「間に」＋ vallum「柵・城壁」）から→「間隔・合間」。valēre とは関係ない。'],
  ],
  // rect / reg ＝ まっすぐ・治める（ラテン語 regere）
  rect: [
    [U, 'regret regrettable', '古フランス語 regreter「亡くした人を嘆く」から（re- に、泣くことを表すゲルマン語が付いた語とされる）。regere「導く・治める」とは関係ない。'],
    [U, 'regard regarding regardless disregard', '古フランス語 regarder「見る・気にかける」（re- ＋ garder「見張る」。guard の仲間でゲルマン語から）。regere とは関係ない。'],
    [U, 'register registration', '中世ラテン語 regesta「書き留めたもの」（regerere「記録する」＝ re- ＋ gerere「運ぶ」）から。この reg は re- ＋ gerere で、regere「導く・治める」ではない。'],
    [U, 'regain', 're-「再び」＋ gain「得る」（古フランス語 gaaignier「かせぐ」、ゲルマン語から）。regere とは関係ない。'],
  ],
  // fin ＝ 終わり・限界（ラテン語 fīnis）
  fin: [
    [U, 'finger fingerprint', '古英語 finger「指」から。英語にもとからある語で、ラテン語 fīnis「終わり」とは関係ない。'],
    [U, 'find finding', '古英語 findan「見つける」から。英語にもとからある語で、fīnis とは関係ない。'],
    [U, 'fin', '古英語 finn「ひれ」から。英語にもとからある語で、fīnis とは関係ない。'],
  ],
  // fund / found ＝ 底・基礎（ラテン語 fundus）
  fund: [
    [U, 'refund confound', 'ラテン語 fundere「注ぐ」の仲間（fus のカード）。refund は注ぎ返す→「払い戻す」、confound は一緒に注いで混ぜる→「混同する・当惑させる」。fundus「底」とは別の語。'],
    [U, 'found', 'find「見つける」の過去分詞（古英語 findan から）。「設立する」の found（ラテン語 fundāre「基礎を置く」、fundus から）とは別の語で、fundus とは関係ない。'],
  ],
  // sens / sent ＝ 感じる（ラテン語 sentīre）
  sens: [
    [U, 'present', 'ラテン語 praesēns「目の前にある」（prae-「前に」＋ esse「ある」）から。目の前にある→「現在」、差し出すもの→「贈り物」。この sent は sentīre「感じる」ではない。'],
  ],
  // meter / metr ＝ 測る・尺度（ギリシャ語 metron）
  meter: [
    [U, 'metropolitan', 'ギリシャ語 mētropolis「母なる都市」（mētēr「母」＋ polis「都市」）から→「大都市の・首都圏の」。この metr は metron「尺度」ではなく mētēr「母」。'],
  ],
  // clud / clus / clos ＝ 閉じる（ラテン語 claudere）
  clud: [
    [U, 'cluster', '古英語 clyster「房」から。英語にもとからある語で、ラテン語 claudere「閉じる」とは関係ない。'],
  ],
  // doc ＝ 教える（ラテン語 docēre）
  doc: [
    [U, 'dock', '中世オランダ語 docke「船だまり」から。ラテン語 docēre「教える」とは関係ない。'],
  ],
  // loc ＝ 場所（ラテン語 locus）
  loc: [
    [U, 'lock locker', '古英語 loc「締める仕掛け」から。英語にもとからある語で、ラテン語 locus「場所」とは関係ない。'],
  ],
  // medi ＝ 中間（ラテン語 medius）
  medi: [
    [U, 'medicine medical', 'ラテン語 medicus「医者」（medērī「治す」から）の仲間。medius「中間の」とは別の語。'],
  ],
  // quer / quir / quis / ques ＝ 求める・問う（ラテン語 quaerere）
  quer: [
    [U, 'querulous', 'ラテン語 querī「嘆く・不平を言う」から（quarrel「口論」の仲間）。quaerere「求める」とは別の語。'],
  ],
  // tact / tang / tag ＝ 触れる（ラテン語 tangere）
  tact: [
    [U, 'tactics tactician', 'ギリシャ語 taktikē「兵を並べる技」（tassein「並べる」から）。ラテン語 tangere「触れる」とは関係ない。'],
    [U, 'tag', '中英語 tagge「垂れ下がった布切れ」から（その前ははっきりしない）。tangere とは関係ない。'],
    [U, 'tangle', '中英語 tangilen「もつれさせる」から（北ヨーロッパの言葉から来たとされる）。tangere とは関係ない。'],
  ],
  // ann / enn ＝ 年（ラテン語 annus）
  ann: [
    [U, 'announce announcement', 'ラテン語 annūntiāre（ad-「〜へ」＋ nūntiāre「知らせる」）から。この ann は ad- が n の前で形を変えたもので、annus「年」ではない。'],
    [U, 'annoy annoyance annoyed annoying ennui', 'ラテン語 in odiō「憎しみの中に」から（古フランス語 anoier・フランス語 ennui を経た語）。annus「年」とは関係ない。'],
    [U, 'annihilate annihilation', 'ラテン語 annihilāre（ad-「〜へ」＋ nihil「無」）→無にする→「全滅させる」。annus とは関係ない。'],
    [U, 'annotation', 'ラテン語 annotāre（ad-「〜へ」＋ notāre「印を付ける」）から。annus とは関係ない。'],
    [U, 'ennoble', 'en-「〜にする」＋ noble「高貴な」（ラテン語 nōbilis「名の知られた」から）。この enn は annus とは関係ない。'],
  ],
  // arm / arma ＝ 武器・武装する（ラテン語 arma）
  arma: [
    [D, 'arm', '古英語 earm「腕」から。英語にもとからある語だが、ラテン語 arma「武器（戦いの道具）」と同じく、「組み合わせる・はめ込む」を表す古い語根にさかのぼる遠い親戚とされる（肩にはまった腕、組み立てた道具）。'],
  ],
  // bat / batt ＝ 打つ（後期ラテン語 battuere）
  bat: [
    [S, 'battery', 'フランス語 batterie「打つこと・大砲の列」（battre「打つ」、後期ラテン語 battuere から）から。並べた大砲→並べてつないだ電池→「電池」。このカードと同じ battuere から。'],
    [U, 'bathroom', 'bath「入浴」（古英語 bæþ）＋ room「部屋」。英語にもとからある語で、battuere とは関係ない。'],
  ],
  // capit / chief ＝ 頭・先頭（ラテン語 caput）
  caput: [
    [S, 'capitulate recapitulate', 'ラテン語 capitulum「（文書の）見出し・条項」（caput「頭」を小さくいう語）から。条項を決めて降参する→「降伏する」、見出しごとにまとめ直す→「要約する」。このカードと同じ caput から。'],
  ],
  // car / carr / charg ＝ 車・運ぶ（後期ラテン語 carrus）
  carr: [
    [S, 'surcharge', '古フランス語 surcharger「荷を積みすぎる」（sur-「上に」＋ charger「荷を積む」。後期ラテン語 carricāre、carrus「車」から）→「追加料金」。charge と同じく carrus から。'],
    [D, 'carpenter', 'ラテン語 carpentārius「荷車を作る職人」（carpentum「二輪の車」から）。carpentum も carrus も古いガリアの言葉から入った語で、どちらも「走る」を表す古い語根にさかのぼる遠い親戚。'],
    [U, 'care careful carefully careless caring caretaker carefree', '古英語 caru「心配・悲しみ」から。英語にもとからある語で、carrus「車」とは関係ない。'],
    [U, 'card discard', 'card はギリシャ語 chartēs「パピルスの紙」から（ラテン語 charta を経た語）。discard は手札を捨てる→「捨てる」。carrus「車」とは関係ない。'],
    [U, 'carbon decarbonization carbon_neutral', 'ラテン語 carbō「炭」から。carrus「車」とは関係ない。'],
    [U, 'carve carver', '古英語 ceorfan「切る」から。英語にもとからある語で、carrus とは関係ない。'],
    [U, 'cart', '古ノルド語 kartr「荷車」から。意味は近いが、carrus「車」とは別の語。'],
    [U, 'incarcerate', 'ラテン語 in-「中へ」＋ carcer「ろう屋」→「投獄する」。carrus とは関係ない。'],
    [U, 'incarnation', 'ラテン語 in-「中へ」＋ carō（carnis）「肉」→肉体を持つこと→「化身」。carrus とは関係ない。'],
    [U, 'carrot', 'ギリシャ語 karōton（ラテン語 carōta）から。carrus とは関係ない。'],
  ],
  // cast ＝ 投げる（古ノルド語 kasta）
  cast: [
    [U, 'castle', 'ラテン語 castellum「とりで」から。古ノルド語 kasta「投げる」とは関係ない。'],
    [U, 'castigate', 'ラテン語 castīgāre「正す・罰する」（castus「清い」＋ agere「する」）から。kasta とは関係ない。'],
  ],
  // cert / cern / crit ＝ 見分ける・決める（ラテン語 cernere / ギリシャ語 krinein）
  cert: [
    [S, 'discern', 'ラテン語 discernere（dis-「分けて」＋ cernere「ふるい分ける」）→「見分ける」。このカードと同じ cernere から。'],
    [S, 'concern', '中世ラテン語 concernere「関わる」（com-「共に」＋ cernere「ふるい分ける」）から。このカードと同じ cernere から（意味は大きく変わった）。'],
    [S, 'concert', 'イタリア語 concerto（concertāre「合わせる」＝ con-「共に」＋ certāre「競う」）から。certāre は cernere「決める」から出た語で、このカードと同じ cernere にさかのぼる。'],
  ],
  // cide / cise ＝ 切る（ラテン語 caedere）
  cide: [
    [U, 'accident accidental accidentally incident', 'ラテン語 cadere「落ちる」の仲間（cid / cas のカード）。ふりかかる→「事故・出来事」。caedere「切る」とは別の語。'],
  ],
  // clin ＝ 傾く（ラテン語 clīnāre）
  clin: [
    [D, 'clinic', 'ギリシャ語 klinikos「寝台の」（klinē「寝台」、klinein「もたれる・傾ける」から）。ラテン語 clīnāre「傾ける」とは、どちらも「傾く」を表す古い語根から分かれた遠い親戚。'],
    [U, 'cling', '古英語 clingan「くっつく・縮む」から。英語にもとからある語で、clīnāre とは関係ない。'],
  ],
  // cor / cord ＝ 心・心臓（ラテン語 cor / cordis）
  cord: [
    [U, 'corner', 'ラテン語 cornū「角（つの）」から。つののように突き出た所→「角（かど）・隅」。cor「心」とは関係ない。'],
    [U, 'corroborate', 'ラテン語 corrōborāre（com-「すっかり」＋ rōbur「カシの木・強さ」）→強める→「裏付ける」。この cor は com- で、cor「心」ではない。'],
    [U, 'correspond correspondence correspondent corresponding', '中世ラテン語 correspondēre（com-「互いに」＋ respondēre「応じる」）。この cor は com- で、cor「心」ではない。'],
    [U, 'corridor', 'イタリア語 corridore（correre「走る」、ラテン語 currere から）→走り抜ける通路→「廊下」。cor「心」とは関係ない。'],
    [U, 'corrupt corrupted corruption', 'ラテン語 corrumpere（com-「すっかり」＋ rumpere「壊す」）。この cor は com- で、cor「心」ではない。'],
    [U, 'corporation corporate incorporate corpse', 'ラテン語 corpus「体」の仲間（corp のカード）。cor「心」とは関係ない。'],
    [U, 'correlate correlation', '中世ラテン語 correlātiō（com-「共に」＋ relātiō「関係づけること」）。この cor は com- で、cor「心」ではない。'],
    [U, 'correct correction correctly incorrect', 'ラテン語 corrigere（com-「すっかり」＋ regere「まっすぐ導く」）。この cor は com- で、cor「心」ではない。'],
    [U, 'corrode corrosion', 'ラテン語 corrōdere（com-「すっかり」＋ rōdere「かじる」）。この cor は com- で、cor「心」ではない。'],
    [U, 'cord', 'ギリシャ語 chordē「腸・楽器の弦」から（ラテン語 chorda を経た語）。cor「心」とは関係ない。'],
    [U, 'corn', '古英語 corn「穀物のつぶ」から。英語にもとからある語で、cor とは関係ない。'],
    [U, 'coral', 'ギリシャ語 korallion「サンゴ」から（ラテン語を経た語）。cor「心」とは関係ない。'],
    [U, 'cork', 'スペイン語 alcorque「コルク底の靴」から、オランダ語 kurk を経た語とされる（さらに元はラテン語 quercus「カシ」か cortex「樹皮」とされる）。cor「心」とは関係ない。'],
    [U, 'cortex', 'ラテン語 cortex「樹皮・外側の皮」から→器官の外側の層「皮質」。cor「心」とは関係ない。'],
    [U, 'excoriate', 'ラテン語 excoriāre（ex-「はがして」＋ corium「皮」）→皮をはぐ→はぐほど厳しく責める→「酷評する」。cor「心」とは関係ない。'],
    [U, 'incorrigible', 'ラテン語 in-「〜でない」＋ corrigere「正す」（com-「すっかり」＋ regere「まっすぐ導く」）→「矯正できない」。correct の仲間で、cor「心」ではない。'],
    [U, 'correspondingly', 'corresponding「対応する」＋ -ly。correspond は中世ラテン語 correspondēre（com-「互いに」＋ respondēre「応じる」）から。この cor は com- で、cor「心」ではない。'],
  ],
  // cover / covert ＝ 覆う（ラテン語 cooperīre から古フランス語を経た形）
  cover: [
    [U, 'recover', '古フランス語 recovrer（ラテン語 recuperāre「取り戻す」から。capere「取る」の仲間とされる）。re- ＋ cover「覆う」ではなく、cooperīre とは関係ない。'],
  ],
  // cur / cure ＝ 世話・注意（ラテン語 cūra）
  cura: [
    [U, 'current currently currency curriculum cursor cursory occur occurrence incur recur recurrence recurrent precursor discursive concurrent excursion', 'ラテン語 currere「走る・流れる」の仲間（curr のカード）。cūra「世話・注意」とは別の語。'],
    [U, 'curve curved curb', 'ラテン語 curvus「曲がった」から。curb は古フランス語 courbe を経て、馬を抑える曲がった鎖→「抑える」。cūra とは関係ない。'],
    [U, 'curt curtail', 'ラテン語 curtus「短い」から。curtail は古フランス語 courtault「しっぽを短く切った馬」を経て「切り詰める」。cūra とは関係ない。'],
    [U, 'curtain', '後期ラテン語 cortīna「幕」から（古フランス語 courtine を経た語）。cūra とは関係ない。'],
    [U, 'curse cursed', '古英語 curs「のろい」から（その前ははっきりしない）。cūra とは関係ない。'],
    [U, 'curl', '中英語 crulle「縮れた」（オランダ語系の語）から。cūra とは関係ない。'],
    [U, 'curfew', '古フランス語 cuevrefeu「火を覆え」（covrir「覆う」＋ feu「火」）から。夜に火を消す合図→「門限・外出禁止令」。cover の仲間で、cūra とは関係ない。'],
    [U, 'curry', 'タミル語 kari「汁・ソース」から（ポルトガル語などを経た語）。cūra とは関係ない。'],
    [U, 'curmudgeon', '16世紀から使われている語で、由来は分かっていないが、cūra から来たという記録はない。'],
  ],
  // cur / curr / curs ＝ 走る・流れる（ラテン語 currere）
  curr: [
    [U, 'cure curious curiosity accurate accuracy accurately procure procurement secure securely security', 'ラテン語 cūra「世話・注意」の仲間（cur / cure のカード）。currere「走る」とは別の語。'],
    [U, 'curve curved curb', 'ラテン語 curvus「曲がった」から。curb は古フランス語 courbe を経て、馬を抑える曲がった鎖→「抑える」。currere とは関係ない。'],
    [U, 'curt curtail', 'ラテン語 curtus「短い」から。curtail は古フランス語 courtault「しっぽを短く切った馬」を経て「切り詰める」。currere とは関係ない。'],
    [U, 'curtain', '後期ラテン語 cortīna「幕」から（古フランス語 courtine を経た語）。currere とは関係ない。'],
    [U, 'curse cursed', '古英語 curs「のろい」から（その前ははっきりしない）。currere とは関係ない。'],
    [U, 'curl', '中英語 crulle「縮れた」（オランダ語系の語）から。currere とは関係ない。'],
    [U, 'curfew', '古フランス語 cuevrefeu「火を覆え」（covrir「覆う」＋ feu「火」）から。夜に火を消す合図→「門限・外出禁止令」。cover の仲間で、currere とは関係ない。'],
    [U, 'curry', 'タミル語 kari「汁・ソース」から（ポルトガル語などを経た語）。currere とは関係ない。'],
    [U, 'curmudgeon', '16世紀から使われている語で、由来は分かっていないが、currere から来たという記録はない。'],
  ],
  // fa / fam / fabl ＝ 話す（ラテン語 fārī）
  fari: [
    [U, 'family familiar familiarity familiarize', 'ラテン語 familia「家の者・召使い全体」（famulus「召使い」から）の仲間。fārī「話す」とは関係ない。'],
    [U, 'famine', 'ラテン語 famēs「飢え」から（古フランス語を経た語）。多くの人が飢えること。fārī とは関係ない。'],
  ],
  // fort / forc ＝ 強い（ラテン語 fortis）
  fort: [
    [U, 'fortune fortunate fortunately fortuitous', 'ラテン語 fors・fortūna「偶然・運」の仲間。fortis「強い」とは別の語。'],
    [U, 'forth', '古英語 forþ「前へ」から。英語にもとからある語で、fortis とは関係ない。'],
    [U, 'forty', 'four「4」（古英語 fēower）＋ -ty「10のまとまり」→「40」。fortis とは関係ない（つづりは fourty ではない）。'],
  ],
  // it / iter ＝ 行く（ラテン語 īre / itum）
  it: [
    [U, 'reiterate', 'ラテン語 iterāre「くり返す」（iterum「もう一度」から）に re-「再び」が付いた語。itinerary の iter「道のり」（īre「行く」から）とは別の語。'],
  ],
  // lev ＝ 軽い・持ち上げる（ラテン語 levis / levāre）
  lev: [
    [U, 'level', '古フランス語 livel「水準器」（ラテン語 lībella、lībra「てんびん」から）→「水準・段階」。levis「軽い」とは関係ない。'],
  ],
  // lig / li ＝ 結ぶ（ラテン語 ligāre）
  lig: [
    [U, 'light lighten lighting lightning enlighten', '古英語 lēoht「光」から。英語にもとからある語で、ラテン語 ligāre「結ぶ」とは関係ない。'],
    [U, 'light_2 lighten_2', '古英語 lēoht「軽い」から。英語にもとからある語で、ligāre とは関係ない（「光」の light とも別の語）。'],
  ],
  // minu / mini / minor ＝ 小さい・少ない（ラテン語 minuere / minor）
  mini: [
    [S, 'minutiae', 'ラテン語 minūtia「小ささ」（minūtus「小さくした」、minuere「小さくする」から）→「ささいな事柄・細部」。このカードと同じ minuere から。'],
    [U, 'minion', 'フランス語 mignon「かわいい者・お気に入り」から（ケルト語かゲルマン語から来たとされる）。minor「小さい」とは関係ない。'],
  ],
  // mon / monit ＝ 注意を向ける・思い出させる（ラテン語 monēre）
  mon: [
    [S, 'monster', 'ラテン語 mōnstrum「神のお告げの前ぶれ・怪物」（monēre「警告する」から）→「怪物」。このカードと同じ monēre から。'],
    [Q, 'money monetary', 'ラテン語 monēta「貨幣・お金を造る所」から。硬貨を造った神殿の女神ユノの呼び名 Monēta から出た語で、この名を monēre「注意させる」（警告する女神）から来たとみる説があるが、はっきりしない。'],
    [U, 'monotony monotonous monotone monarch monarchy monopoly monochrome monologue monocycle monk', 'ギリシャ語 monos「ただ一つの・独りの」の仲間（monk は「独りで暮らす人」）。monēre「注意させる」とは関係ない。'],
    [U, 'common', 'ラテン語 commūnis「共有の」（com-「共に」＋ mūnis「務め」）から。この mon は com- ＋ mūnis で、monēre ではない。'],
    [U, 'month', '古英語 mōnaþ「月（暦）」から（moon「月」と同じ語源）。英語にもとからある語で、monēre とは関係ない。'],
    [U, 'monkey', '16世紀から使われている語で、由来ははっきりしない（低地ドイツ語から来たとする説がある）。monēre とは関係ない。'],
    [U, 'monday', '古英語 mōnandæg「月の日」（mōna「月」＋ dæg「日」）から。英語にもとからある語で、monēre「注意させる」とは関係ない。'],
  ],
  // nom / nym ＝ 名前（ラテン語 nōmen / ギリシャ語 onyma）
  nom: [
    [U, 'nomad nomadic', 'ギリシャ語 nomas「牧草地を渡り歩く人」（nemein「分ける・放牧する」から）。nōmen「名前」とは関係ない。'],
  ],
  // ord / ordin ＝ 順序（ラテン語 ordō）
  ord: [
    [S, 'disorder disorderly', 'dis-「反対に」＋ order「秩序」（ラテン語 ōrdō「列・順序」から）→「無秩序・乱れた」。このカードと同じ ōrdō から。'],
    [U, 'ordeal', '古英語 ordāl「裁き」（deal「分ける」の仲間の語から）。熱湯や火で罪を試した昔の裁判→「厳しい試練」。英語にもとからある語で、ōrdō とは関係ない。'],
  ],
  // par / pare ＝ 整える・準備する（ラテン語 parāre）
  pare: [
    [S, 'parade', 'スペイン語 parada「止まること・隊列」（parar「止める・整える」、ラテン語 parāre から）→フランス語を経た語。隊列を整えて見せる→「パレード」。このカードと同じ parāre から。'],
    [D, 'parent', 'ラテン語 parere「産む」から。parāre「整える・用意する」とは、「生み出す・用意する」を表す同じ古い語根から出た兄弟の語とされる遠い親戚。'],
    [U, 'part partly partial partially impartial particle particular particularly participate participant participation partner partnership party partisan parcel depart departure department', 'ラテン語 pars「部分」の仲間（part のカード）。parāre「整える」とは別の語。'],
    [U, 'compare parity disparity', 'ラテン語 pār「等しい」の仲間（pair「一対」、peer「同等の人」も同じ）。compare は並べて比べる、parity は同等。parāre「整える」とは別の語。'],
    [U, 'paragraph paradox parallel parasite parasitic paradigm parable paralysis paralyze parameter parochial paragon parliament parley', 'ギリシャ語 para-「そばに・並んで・反して」で始まる語（paragraph は本文のそばの印、parallel は並んだ、paradox は常識に反する説、parochial は教区＝そばに住む人々）。parliament・parley はフランス語 parler「話す」からで、これもギリシャ語 parabolē「たとえ話」（parable と同じ語）にさかのぼる。ラテン語 parāre とは関係ない。', 'affix'],
    [U, 'transparent transparency', 'ラテン語 trānspārēre「透けて見える」（trans-「越えて」＋ pārēre「現れる」）から。appear の仲間（par / pear のカード）で、parāre「整える」とは別の語。'],
    [U, 'paramount', '古フランス語 par amont「上の方に」（amont はラテン語 ad montem「山の方へ」から）→「最高の」。parāre とは関係ない。'],
    [U, 'pardon', '中世ラテン語 perdōnāre（per-「すっかり」＋ dōnāre「与える」）から。この par は per- で、parāre とは関係ない。'],
    [U, 'park', '古フランス語 parc「囲い地」（ゲルマン語から入った語）から。parāre とは関係ない。'],
    [U, 'pariah', 'タミル語 paraiyar「太鼓をたたく人」から。parāre とは関係ない。'],
    [U, 'parsimonious', 'ラテン語 parsimōnia「倹約」（parcere「惜しむ」から）。parāre とは関係ない。'],
  ],
  // pass / pace ＝ 歩み・通る（ラテン語 passus）
  pass: [
    [S, 'password', 'pass「通る」（ラテン語 passus「歩み」から）＋ word「ことば」→通るための合いことば。このカードと同じ passus から。'],
    [U, 'passion passionate passionately passive passivity impassive compassion compassionate dispassionate impassioned', 'ラテン語 patī「苦しむ・受ける」の仲間（pati / pass のカード）。passus「歩み」とは別の語。'],
  ],
  // path ＝ 感じる・苦しむ（ギリシャ語 pathos）
  path: [
    [U, 'path pathway', '古英語 pæþ「小道」から。英語にもとからある語で、ギリシャ語 pathos「感情・苦しみ」とは関係ない。'],
  ],
  // par / pear ＝ 現れる（ラテン語 appārēre）
  pear: [
    [U, 'prepare preparation separate separately reparation parade', 'ラテン語 parāre「整える・用意する」の仲間（par / pare のカード）。pārēre「現れる」とは別の語。'],
    [U, 'parent', 'ラテン語 parere「産む」から。pārēre「現れる」とは別の語。'],
    [U, 'part partly partial partially impartial particle particular particularly participate participant participation partner partnership party partisan parcel depart departure department', 'ラテン語 pars「部分」の仲間（part のカード）。pārēre「現れる」とは別の語。'],
    [U, 'compare parity disparity', 'ラテン語 pār「等しい」の仲間（pair「一対」、peer「同等の人」も同じ）。pārēre とは別の語。'],
    [U, 'paragraph paradox parallel parasite parasitic paradigm parable paralysis paralyze parameter parochial paragon parliament parley', 'ギリシャ語 para-「そばに・並んで・反して」で始まる語（paragraph は本文のそばの印、parallel は並んだ、paradox は常識に反する説、parochial は教区＝そばに住む人々）。parliament・parley はフランス語 parler「話す」からで、これもギリシャ語 parabolē「たとえ話」（parable と同じ語）にさかのぼる。ラテン語 pārēre とは関係ない。', 'affix'],
    [U, 'paramount', '古フランス語 par amont「上の方に」（amont はラテン語 ad montem「山の方へ」から）→「最高の」。pārēre とは関係ない。'],
    [U, 'pardon', '中世ラテン語 perdōnāre（per-「すっかり」＋ dōnāre「与える」）から。この par は per- で、pārēre とは関係ない。'],
    [U, 'park', '古フランス語 parc「囲い地」（ゲルマン語から入った語）から。pārēre とは関係ない。'],
    [U, 'pariah', 'タミル語 paraiyar「太鼓をたたく人」から。pārēre とは関係ない。'],
    [U, 'parsimonious', 'ラテン語 parsimōnia「倹約」（parcere「惜しむ」から）。pārēre とは関係ない。'],
    [U, 'pearl', '古フランス語 perle から（ラテン語 perna「脚の形をした貝」にさかのぼるとされる）。pārēre とは関係ない。'],
  ],
  // ped ＝ 足（ラテン語 pēs / pedis）
  ped: [
    [S, 'pedigree', '中期フランス語 pié de grue「ツルの足」から。家系図の枝分かれをツルの足に見立てた→「血統」。pié「足」はラテン語 pēs から来た語で、このカードと同じ。'],
    [U, 'pedagogy pedantic', 'pedagogy はギリシャ語 pais（paidos）「子ども」＋ agōgos「導く人」から。pedantic はイタリア語 pedante「先生」からで、これも同じギリシャ語から来たとされる。pēs「足」とは関係ない。'],
  ],
  // pet / petit ＝ 求める・向かう（ラテン語 petere）
  pet: [
    [S, 'petulant', 'ラテン語 petulāns「生意気な」（petere「襲いかかる・向かう」から）→すぐ突っかかる→「不機嫌な・短気な」。このカードと同じ petere から。'],
    [U, 'petty petite pettiness', 'フランス語 petit「小さい」から。子どもの言葉のような語から来たとされ、petere「求める」とは関係ない。'],
    [U, 'petrify', 'ギリシャ語 petra「岩」（ラテン語を経た語）＋ -fy「〜にする」→石にする→「石化する・すくませる」。petere とは関係ない。'],
    [U, 'petal', 'ギリシャ語 petalon「葉・薄い板」（「広がる」を表す語から）。petere とは関係ない。'],
    [U, 'pet', '16世紀から使われている語で、由来ははっきりしない（スコットランドの言葉から来たとする説がある）。petere とは関係ない。'],
  ],
  // ple / plete ＝ 満たす（ラテン語 plēre）
  plere: [
    [S, 'plenty plentiful', 'plenty「たくさん」（ラテン語 plēnitās「満ちていること」、plēnus「満ちた」から）。このカードと同じ plēre から。'],
    [D, 'plethora', 'ギリシャ語 plēthōrē「満ちあふれること」（plēthein「満ちる」から）。ラテン語 plēre とは、どちらも「満たす」を表す古い語根から分かれた遠い親戚。'],
    [U, 'please pleased pleasant pleasure displease displeasure plead', 'ラテン語 placēre「気に入る」の仲間（plac / pleas のカード）。plead は古フランス語 plaidier「訴える」（ラテン語 placitum「決まったこと」、placēre から）から。plēre「満たす」とは別の語。'],
    [U, 'complex complexity perplex perplexing perplexity', 'ラテン語 plectere「編む・からませる」の仲間（plic / plex のカード）。complex はからみ合った、perplex はすっかりからまって困らせる。plēre「満たす」とは別の語。'],
    [U, 'pledge', '古フランス語 plege「保証人・担保」（ゲルマン語から入った語）から。plēre とは関係ない。'],
  ],
  // sed / sid / sess ＝ 座る（ラテン語 sedēre）
  sed: [
    [S, 'subside', 'ラテン語 subsīdere（sub-「下に」＋ sīdere「腰を下ろす・沈む」）→「静まる・沈下する」。sīdere は sedēre「座る」と同じ語根から出た動詞で、このカードの仲間。'],
    [U, 'side sidewalk', '古英語 sīde「脇腹」から。英語にもとからある語で、ラテン語 sedēre「座る」とは関係ない。'],
    [U, 'sedition seditious', 'ラテン語 sēditiō「離れて行くこと・反乱」（sēd-「離れて」＋ īre「行く」）から。この sed は sedēre「座る」ではない。'],
  ],
  // serv ＝ 守る・保つ（ラテン語 servāre）
  serv: [
    [U, 'serve server servant service servicing servitude servile deserve', 'ラテン語 servus「召使い」・servīre「仕える」の仲間（serv ＝ 仕える のカード）。servāre「守る・保つ」とは別の語。'],
  ],
  // serv ＝ 仕える（ラテン語 servīre）
  servire: [
    [U, 'observe observant observation observer observance conserve conservative conservation conservationist preserve preservation reserve reservation reserved', 'ラテン語 servāre「守る・保つ」の仲間（serv ＝ 守る・保つ のカード）。servīre「仕える」とは別の語。'],
  ],
  // sta / stat / stit / sist ＝ 立つ・置く（ラテン語 stāre / sistere / statuere）
  sta: [
    [S, 'stay staid', '古フランス語 ester「立つ・とどまる」（ラテン語 stāre「立つ」から）→「とどまる・滞在する」。staid は stay の古い過去分詞で、とどまって動かない→「落ち着いた」。このカードと同じ stāre から。'],
    [S, 'statue', 'ラテン語 statua「立像」（stāre「立つ」から）。このカードと同じ stāre から。'],
    [S, 'statistics statistical', 'ドイツ語 Statistik「国の状態の学問」（ラテン語 status「状態」から）→「統計」。state と同じく status（stāre から）にさかのぼる。'],
    [S, 'stationery', 'stationer「決まった店を持つ本屋」（中世ラテン語 statiōnārius、statiō「立つ所・持ち場」から）→その店で売る品→「文房具」。station と同じく stāre から。'],
    [S, 'stable_2', 'ラテン語 stabulum「家畜を立たせておく所」（stāre「立つ」から）→「馬小屋」。「安定した」の stable とは別々に入った語だが、同じ stāre から。'],
    [S, 'destabilize instability', 'de-「反対に」・in-「〜でない」＋ stabilize・stability（ラテン語 stabilis「しっかり立った」から）。このカードと同じ stāre から。'],
    [S, 'stamina', 'ラテン語 stāmen「（はた織りの）縦糸」の複数形 stāmina から。運命の女神が紡ぐ命の糸→「持久力」。stāmen はぴんと立つ縦糸のことで、stāre「立つ」と同じ語根から出た語。'],
    [D, 'stand standstill', '古英語 standan「立つ」から。英語にもとからある語だが、ラテン語 stāre と同じ「立つ」を表す古い語根にさかのぼる遠い親戚。'],
    [D, 'stalwart', '古英語 stǣlwierþe「役に立つ・しっかりした」（staþol「土台・立つ場所」＋ wierþe「値する」）から。staþol は stāre と同じ「立つ」を表す古い語根にさかのぼる遠い親戚。'],
    [Q, 'standard standardize substandard', '古フランス語 estandart「軍旗」から。ゲルマン語の「しっかり立つ」（stand の仲間）から来たとする説と、ラテン語 extendere「広げる」から来たとする説があり、はっきりしない。前者なら stāre とは遠い親戚。'],
    [Q, 'staunch', '古フランス語 estanche「水を通さない・しっかりした」（estanchier「流れを止める」から）。これをラテン語 stāre「立つ」の分詞 stāns から来たとみる説があるが、はっきりしない。'],
    [Q, 'stadium', 'ギリシャ語 stadion「長さの単位・競走路」から（ラテン語を経た語）。「しっかり立った」を表すギリシャ語から来て stāre の遠い親戚とする説と、別の語が形を変えたとする説があり、はっきりしない。'],
    [U, 'stall install', '古英語 steall「家畜の立つ所・仕切り」（ゲルマン語）の仲間。install は中世ラテン語 installāre（in-「中へ」＋ stallum「席」、同じゲルマン語から）→席につかせる・据える→「設置する・就任させる」。stāre とは別の語。'],
    [U, 'stalk', '中英語 stalke「茎」（古英語 stalu「立てた木」から来たとされる）。stāre とは関係ない。'],
    [U, 'stalk_2', '古英語 bestealcian「こっそり歩く」から（steal「盗む」の仲間とされる）。stāre とは関係ない。'],
    [U, 'star', '古英語 steorra「星」から。英語にもとからある語で、stāre「立つ」とは関係ない。'],
    [U, 'start startle', '古英語 styrtan「跳び上がる」から（startle も同じ仲間）。stāre とは関係ない。'],
    [U, 'stare', '古英語 starian「じっと見る」（「こわばる」を表す語から）。stāre「立つ」とは関係ない。'],
    [U, 'stark', '古英語 stearc「硬い・強い」から→飾りのない→「荒涼とした・全くの」。stāre とは関係ない。'],
    [U, 'starve starvation', '古英語 steorfan「死ぬ」（こわばる→死ぬ）から。飢えて死ぬ→「飢える」。stāre とは関係ない。'],
    [U, 'stagger staggering', '古ノルド語 stakra「押しのける・よろめく」から。stāre とは関係ない。'],
    [U, 'stagnant stagnate stagnation', 'ラテン語 stāgnum「よどんだ水・池」から。「たまり水」の意味から stāre「立つ」の仲間に見えるが、「しみ出る」を表す別の語とされる。'],
    [U, 'stale', '古フランス語 estale「動かずに置かれた」から来たとされる（ゲルマン語から入った語）。stāre とは関係ない。'],
    [U, 'stitch', '古英語 stice「刺すこと」から（stick「刺す」の仲間）。stāre とは関係ない。'],
    [U, 'stain', '古フランス語 desteindre「色を抜く」（des-「取り去る」＋ teindre「染める」、ラテン語 tingere から）が短くなった形から。stāre とは関係ない。'],
    [U, 'distaste', 'dis-「反対に」＋ taste「味・好み」（古フランス語 taster「さわって確かめる・味わう」から）。stāre とは関係ない。'],
    [U, 'stack', '古ノルド語 stakkr「干し草の山」から。stāre とは関係ない。'],
    [U, 'stake stakeholder', '古英語 staca「くい」から→くいに掛けた掛け金→「利害・持ち分」。stāre とは関係ない。'],
    [U, 'stair', '古英語 stǣger「階段」（stīgan「登る」から）。stāre「立つ」とは関係ない。'],
    [U, 'stamp', '中英語 stampen「踏みつける」（ゲルマン語から）から。stāre とは関係ない。'],
    [U, 'staple', '古英語 stapol「柱」から（留め金の意味）、同じ語の中世オランダ語 stapel「市場・倉庫」から（主要な品）。stāre とは関係ない。'],
    [U, 'staff', '古英語 stæf「棒・つえ」から→支える人々→「職員」。stāre とは関係ない。'],
    [U, 'sister', '古英語 sweostor・古ノルド語 systir「姉・妹」から。英語にもとからある語で、sistere「立たせる」とは関係ない。'],
  ],
  // sult / sal ＝ 跳ぶ（ラテン語 salīre / saltāre）
  sult: [
    [Q, 'salmon', 'ラテン語 salmō「サケ」から（古フランス語 saumon を経た語）。川をさかのぼって跳ぶ魚として salīre「跳ぶ」から来たとする説があるが、はっきりしない。'],
    [U, 'salary salad', 'ラテン語 sal「塩」の仲間。salary は兵士が塩を買うために出した手当（salārium）が元と言われ、salad は塩で味をつけた野菜から。salīre「跳ぶ」とは関係ない。'],
    [U, 'salt salty', '古英語 sealt「塩」から。英語にもとからある語で、salīre「跳ぶ」とは関係ない。'],
    [U, 'salvation salvage salutary', 'ラテン語 salvus「無事な」・salūs「健康・無事」の仲間（salv のカード）。salīre「跳ぶ」とは関係ない。'],
    [U, 'sale', '古ノルド語 sala「売ること」から（sell「売る」の仲間）。salīre とは関係ない。'],
  ],
  // test / testi ＝ 証人・証言する（ラテン語 testis / testārī）
  testis: [
    [U, 'test testy', 'ラテン語 testa・testum「土の器・かけら」の仲間。test は金属の質を調べる土のつぼ→「試験」、testy はアングロ・フランス語 teste「頭」（器→頭の骨→頭）から→頭が固い→「短気な」。testis「証人」とは関係ない。'],
  ],
  // ton / tone ＝ 張り・調子（ギリシャ語 tonos）
  ton: [
    [U, 'tongue', '古英語 tunge「舌・ことば」から。英語にもとからある語で、ギリシャ語 tonos「張り・調子」とは関係ない。'],
    [U, 'ton', '古フランス語 tonne「大だる」から（その量・重さの単位になった）。tonos とは関係ない。'],
    [U, 'tonight', 'to-「この」＋ night「夜」（古英語 niht）から。tonos とは関係ない。'],
  ],
  // tour / turn ＝ 回る（ラテン語 tornāre）
  turn: [
    [Q, 'turnip', '中英語で、turn「回す→丸い形」＋ nepe「カブ」（ラテン語 nāpus から）とされる語。turn の部分が本当に tornāre から来たかは、はっきりしない。'],
  ],
  // via / voy ＝ 道（ラテン語 via）
  via: [
    [S, 'via', 'ラテン語 via「道」を「道を通って」の意味で使った形（viā）から→「〜経由で」。このカードの via そのもの。'],
    [U, 'viable', 'フランス語 viable「生きていける」（vie「命」、ラテン語 vīta から）→「存続できる・実行可能な」。via「道」とは関係ない。'],
  ],
  // aud / audi ＝ 聞く（ラテン語 audīre）
  aud: [
    [U, 'audacious audacity', 'ラテン語 audēre「思い切ってする」（audāx「大胆な」）から。audīre「聞く」とは別の語。'],
  ],
  // magn ＝ 大きい（ラテン語 magnus）
  magn: [
    [U, 'magnet magnetic magnetism', 'ギリシャ語 Magnēs lithos「マグネシアの石」（小アジアの地名 Magnēsia から）。magnus「大きい」とは関係ない。'],
  ],
  // equ ＝ 等しい（ラテン語 aequus）
  equ: [
    [U, 'equip equipment', '古フランス語 esquiper「船に装備を積む」（古ノルド語 skipa、skip「船」から）。aequus「等しい」とは関係ない。'],
  ],
  // sci ＝ 知る（ラテン語 scīre）
  sci: [
    [U, 'scissors', '後期ラテン語 cīsōrium「切る道具」（caedere「切る」から）→古フランス語 cisoires を経た語。sc のつづりは、あとでラテン語 scindere「裂く」に似せて付いたもので、scīre「知る」から来た語ではない。'],
    [U, 'scintilla', 'ラテン語 scintilla「火花」から→火花ほどのわずか。scīre とは関係ない。'],
  ],
  // flu ＝ 流れる（ラテン語 fluere）
  flu: [
    [Q, 'flush', '中英語 flusshen「（鳥が）ぱっと飛び立つ」から（音をまねた語とされる）。水をどっと流す意味には、ラテン語 fluxus「流れ」の影響をみる説もあるが、はっきりしない。'],
    [U, 'fluster flustered', 'fluster「うろたえさせる」は北ヨーロッパの言葉から来たとされる（アイスランド語 flaustr「あわてること」）。ラテン語 fluere「流れる」とは関係ない。'],
    [U, 'flummox', '19世紀から使われている英語の方言の語で、由来ははっきりしないが、fluere から来たという記録はない。'],
  ],
  // crat / cracy ＝ 支配・力（ギリシャ語 kratos）
  crat: [
    [U, 'crate', 'ラテン語 crātis「編み枠」から→枝で編んだかご→「木箱」。ギリシャ語 kratos「力」とは関係ない。'],
    [U, 'crater', 'ギリシャ語 kratēr「酒と水を混ぜる大きなはち」（kerannynai「混ぜる」から）→はちの形のくぼみ→「噴火口」。kratos「力」とは関係ない。'],
  ],
  // claim / clam ＝ 叫ぶ・主張する（ラテン語 clāmāre）
  claim: [
    [U, 'clamber', '中英語 clambren「つかんで登る」（climb「登る」の仲間）から。英語にもとからある語で、clāmāre「叫ぶ」とは関係ない。'],
  ],
  // fract / frag ＝ 砕く・壊す（ラテン語 frangere）
  fract: [
    [U, 'fragrance', 'ラテン語 frāgrāre「よい香りを放つ」から。frangere「砕く」とは関係ない。'],
  ],
  // liber ＝ 自由（ラテン語 līber）
  liber: [
    [U, 'deliberate', 'ラテン語 dēlīberāre（dē-「すっかり」＋ lībrāre「てんびんにかける」、lībra「てんびん」から）→よく量って考える→「慎重な・意図的な」。līber「自由な」とは関係ない。'],
  ],
  // mand / mend ＝ 命じる・任せる（ラテン語 mandāre）
  mand: [
    [U, 'mend mendacious mendacity', 'ラテン語 menda・mendum「傷・誤り」の仲間。mend は amend（ēmendāre「誤りを取り除く」）の頭が落ちた語、mendacious は mendāx「うその」から。mandāre「任せる」とは関係ない。'],
  ],
  // prim / prin ＝ 第一・最初（ラテン語 prīmus）
  prim: [
    [U, 'print', '古フランス語 preinte「押した跡」（ラテン語 premere「押す」から）。press の仲間で、prīmus「最初の」とは関係ない。'],
    [Q, 'prim', '17世紀から使われている語で、由来ははっきりしない。古フランス語 prim「すぐれた・繊細な」（ラテン語 prīmus「最初の」から）から来たとする説がある。'],
  ],
  // prob / prov ＝ ためす・証明（ラテン語 probāre）
  prob: [
    [U, 'provoke provocation', 'ラテン語 prōvocāre（prō-「前へ」＋ vocāre「呼ぶ」）→呼び出す→「挑発する」。この prov は prō- ＋ voc で、probāre「ためす」ではない。'],
    [U, 'provide provision provisional', 'ラテン語 prōvidēre（prō-「前もって」＋ vidēre「見る」）→先を見て備える→「供給する・備え」。この prov は prō- ＋ vid で、probāre ではない。'],
    [U, 'provenance', 'フランス語 provenance「出所」（provenir、ラテン語 prōvenīre「前へ出て来る」から）。この prov は prō- ＋ ven で、probāre ではない。'],
    [U, 'proverb', 'ラテン語 prōverbium「広く使われる言い回し」（prō-「前に」＋ verbum「ことば」）から。probāre とは関係ない。'],
    [U, 'province provincial', 'ラテン語 prōvincia「（ローマが治める）属州・受け持ち」から（その元ははっきりしない）。probāre とは関係ない。'],
    [U, 'problem problematic', 'ギリシャ語 problēma「前に投げ出されたもの」（pro-「前に」＋ ballein「投げる」）→「問題」。probāre とは関係ない。'],
    [U, 'opprobrium', 'ラテン語 opprobrium「非難・不名誉」（ob-「〜に向けて」＋ probrum「恥」）から。probāre「ためす」とは別の語。'],
  ],
  // terr ＝ 土地・大地（ラテン語 terra）
  terr: [
    [U, 'terrible terror terrify terrified terrifying', 'ラテン語 terrēre「怖がらせる」の仲間（terr / terrif のカード）。terra「大地」とは別の語。'],
  ],
  // tort ＝ ねじる（ラテン語 torquēre）
  tort: [
    [Q, 'tortoise', '中世ラテン語 tortūca「カメ」から。足の形からラテン語 tortus「ねじれた」（torquēre から）と結びつける説と、別の語から来たとする説があり、はっきりしない。'],
  ],
  // typ ＝ 型・打つ（ギリシャ語 typos）
  typ: [
    [U, 'typhoon', '中国語（広東語）taai fung「大風」から来たとされ、ギリシャ神話の風の怪物 Typhōn の名に引かれてつづりが変わった。typos「型」とは関係ない。'],
  ],
  // vad / vas ＝ 行く・進む（ラテン語 vādere）
  vad: [
    [U, 'vast devastate', 'ラテン語 vastus「がらんとした・広大な」の仲間（devastate は vastāre「荒らす」から）。waste と同じ語源で、vādere「行く」とは関係ない。'],
    [U, 'vase', 'ラテン語 vās「器」から（フランス語を経た語）。vessel と同じ語源で、vādere とは関係ない。'],
  ],
  // stinct / sting ＝ 刺す・印をつける（ラテン語 stinguere につながる語形）
  stinct: [
    [Q, 'sting', '古英語 stingan「刺す」から。意味も形もラテン語 stinguere「刺す」に似ているが、同じ古い語根から来たかは、はっきりしない。'],
  ],
  // arch / archi ＝ 始まり・支配（ギリシャ語 arkhē / arkhos）
  arch: [
    [S, 'archetype', 'ギリシャ語 arkhetypon「最初の型」（arkhe-「最初の」＋ typos「型」）→「原型」。このカードと同じ arkhē から。'],
    [U, 'arch arched archway', 'ラテン語 arcus「弓」から（arc と同じ語源）。ギリシャ語 arkhē「始まり・支配」とは関係ない。'],
  ],
  // cid / cas ＝ 落ちる・起こる（ラテン語 cadere / cāsus）
  cid: [
    [U, 'decide', 'ラテン語 dēcīdere（dē-「離れて」＋ caedere「切る」）→迷いを切り離す→「決める」。caedere（cide のカード）の仲間で、cadere「落ちる」とは別の語。'],
    [U, 'cash cashless', 'ラテン語 capsa「箱」（capere「取る・入れる」の仲間）から、フランス語 caisse「金庫」を経た語→金庫のお金→「現金」。cāsus とは関係ない。'],
    [U, 'cast castaway', '古ノルド語 kasta「投げる」から（cast のカード）。cadere とは関係ない。'],
    [U, 'castle', 'ラテン語 castellum「とりで」から。cadere・cāsus とは関係ない。'],
    [U, 'castigate', 'ラテン語 castīgāre「正す・罰する」（castus「清い」＋ agere「する」）から。cadere とは関係ない。'],
  ],
  // civ / cit ＝ 市民（ラテン語 cīvis）
  civ: [
    [S, 'citadel', 'イタリア語 cittadella「小さな都市」（città「都市」、ラテン語 cīvitās から）→町を守るとりで。このカードと同じ cīvis から。'],
    [U, 'cite recite incite excite', 'ラテン語 citāre「呼び出す・動かす」（ciēre「動かす」から）の仲間。cīvis「市民」とは関係ない。'],
  ],
  // dem ＝ 民衆（ギリシャ語 dēmos）
  dem: [
    [U, 'demand demanding demands demonstrate demonstration demoralize demoralized demilitarize demilitarized demilitarization demobilize demote demotion demure demur dementia', 'ラテン語 dē-「下へ・離れて・すっかり・取り去る」で始まる語。demand は dē- ＋ mandāre「任せる」、demonstrate は dē- ＋ mōnstrāre「示す」、demoralize は de- ＋ moral「士気」、demilitarize は de- ＋ military「軍の」、demote は de- ＋ promote の -mote、demur は dēmorārī「ぐずぐずする」、demure は古フランス語 meur「落ち着いた」、dementia は dē- ＋ mēns「心」から。どれもギリシャ語 dēmos「民衆」とは関係ない。', 'affix'],
    [U, 'condemn', 'ラテン語 condemnāre（com-「すっかり」＋ damnāre「罰する」。damnum「損害」は damage と同じ語）から。dēmos とは関係ない。'],
  ],
  // empt / eem ＝ 買う・取る（ラテン語 emere）
  empt: [
    [U, 'empty emptiness', '古英語 ǣmettig「ひまな・空の」（ǣmetta「ひま」から）。英語にもとからある語で、ラテン語 emere「買う・取る」とは関係ない。'],
  ],
  // fus / fut ＝ 注ぐ・溶かす（ラテン語 fundere / fūsus）
  fus: [
    [S, 'futile futility', 'ラテン語 fūtilis「（器から）こぼれやすい」から→入れてもこぼれる→「無駄な」。fundere「注ぐ」と同じ語根から出た語とされる。'],
    [U, 'future', 'ラテン語 futūrus「これからある」（esse「ある」の未来の分詞）から。fundere「注ぐ」とは関係ない。'],
    [U, 'obfuscate', 'ラテン語 obfuscāre「暗くする」（ob-「おおって」＋ fuscus「暗い」）から。fundere とは関係ない。'],
  ],
  // her / hes ＝ くっつく（ラテン語 haerēre）
  her: [
    [U, 'inherit heritage', 'ラテン語 hērēs「相続人」の仲間（her / heir のカード）。haerēre「くっつく」とは別の語。'],
    [U, 'hero heroism', 'ギリシャ語 hērōs「英雄」から。ラテン語 haerēre「くっつく」とは関係ない。'],
    [U, 'heresy', 'ギリシャ語 hairesis「選ぶこと・派」から→正統とちがう考えを選ぶこと→「異端」。haerēre とは関係ない。'],
    [U, 'herb', 'ラテン語 herba「草」から。haerēre とは関係ない。'],
    [U, 'herd', '古英語 heord「（家畜の）群れ」から。英語にもとからある語で、haerēre とは関係ない。'],
    [U, 'her hers herself', '古英語 hire「彼女の・彼女に」から。英語にもとからある語で、haerēre とは関係ない。'],
    [U, 'here', '古英語 hēr「ここに」から。英語にもとからある語で、haerēre とは関係ない。'],
  ],
  // ide / idea ＝ 見えるもの・姿・観念（ギリシャ語 idea）
  ide: [
    [U, 'identify identification identifiable identical identity', 'ラテン語 idem「同じ」の仲間（ident / idem のカード）。ギリシャ語 idea「見えるもの・姿」とは別の語。'],
  ],
  // junct / jug / join ＝ つなぐ（ラテン語 jungere）
  junct: [
    [U, 'juggle', '古フランス語 jogler「芸をする」（ラテン語 joculārī「冗談を言う」、jocus「冗談」から）。joke の仲間で、jungere「結ぶ」とは関係ない。'],
    [U, 'juggernaut', 'ヒンディー語 Jagannāth「世界の主（クリシュナ神の呼び名）」から。この神の像を乗せた巨大な山車が止められずに進んだことから。jungere とは関係ない。'],
  ],
  // leg / legis ＝ 法（ラテン語 lēx / lēgis）
  lex: [
    [S, 'relegate', 'ラテン語 relēgāre（re-「遠くへ」＋ lēgāre「任務を与えて送る」）→遠くへ送りやる→「左遷する」。lēgāre は lēx「法」から出た動詞で（delegate と同じ）、このカードと同じ lēx から。'],
    [Q, 'legend legendary', '中世ラテン語 legenda「読まれるべきもの」（legere「読む」から、lect のカード）。lēx「法」も legere と同じ「集める」を表す古い語根から来たとする説があるが、はっきりしない。'],
    [U, 'leg', '古ノルド語 leggr「脚」から。ラテン語 lēx「法」とは関係ない。'],
  ],
  // lingu / langu ＝ 舌・ことば（ラテン語 lingua）
  lingu: [
    [U, 'languish languid', 'ラテン語 languēre「ぐったりする・衰える」から。lingua「舌・ことば」とは関係ない（language の langu とは別）。'],
  ],
  // log / logue / logy ＝ ことば・理（ギリシャ語 logos）
  log: [
    [Q, 'logistics', 'フランス語 logistique「軍の泊まる場所と補給の計画」（loger「泊まらせる」、ゲルマン語から）。ギリシャ語 logistikos「計算の」（logos の仲間）の影響も受けたとされ、つながりははっきりしない。'],
    [U, 'log', '中英語 logge「丸太」から（北ヨーロッパの言葉から来たとされる）。丸太を流して船の速さを測り書き留めた→「記録」。ギリシャ語 logos とは関係ない。'],
  ],
  // luc / lumin ＝ 光（ラテン語 lūx / lūmen）
  luc: [
    [U, 'lucrative', 'ラテン語 lucrum「もうけ」から。lūx「光」とは関係ない。'],
    [U, 'luck lucky', '中世オランダ語 luc「幸運」から（賭け事のことばとして入ったとされる）。lūx とは関係ない。'],
  ],
  // mut ＝ 変える（ラテン語 mūtāre）
  mut: [
    [U, 'mutiny mutinous', '中期フランス語 mutin「反抗的な」（meute「反乱・動き」、ラテン語 movēre「動かす」から）。move の仲間で、mūtāre「変える」とは関係ない。'],
    [U, 'mutter', '中英語の、つぶやく音をまねた語。mūtāre「変える」とは関係ない。'],
  ],
  // nect / nex ＝ 結ぶ（ラテン語 nectere）
  nect: [
    [U, 'next', '古英語 nīehst「いちばん近い」（nigh「近い」のいちばん上の形）から。英語にもとからある語で、ラテン語 nectere「結ぶ」とは関係ない。'],
  ],
  // opt ＝ 選ぶ・願う（ラテン語 optāre）
  opt: [
    [U, 'optimism optimist optimistic optimal optimize optimization', 'ラテン語 optimus「最もよい」の仲間（optim のカード）。optāre「選ぶ・願う」とは別の語。'],
  ],
  // pati / pass ＝ 耐える・感じる（ラテン語 patī / passus）
  pati: [
    [S, 'impassive', 'in-「〜でない」＋ passive「受け身の」（ラテン語 patī「受ける・耐える」から）→心を動かされない→「無感動な」。このカードと同じ patī から。'],
    [U, 'pass passable impassable passage passenger passport password surpass compass impasse passer_by', 'ラテン語 passus「歩み」の仲間（pass / pace のカード）。patī「苦しむ・耐える」とは別の語（どちらも過去分詞が passus になるので、形が重なった）。'],
  ],
  // poli / polit ＝ 都市・国（ギリシャ語 polis）
  polis: [
    [S, 'police_officer police_station', 'police officer は「警察官」、police station は「警察署」。どちらも police「警察」（このカードの語）を使った語で、このカードと同じ polis から。'],
    [U, 'polite politeness impolite polish', 'ラテン語 polīre「磨く」の仲間（polite は politus「磨かれた」から）。ギリシャ語 polis「都市」とは関係ない。'],
  ],
  // pot / poss ＝ できる・力（ラテン語 posse / potis）
  pot: [
    [S, 'possess possession', 'ラテン語 possidēre「占有する」（potis「力のある」＋ sedēre「座る」）→主人として座る→「所有する」。このカードと同じ potis から。'],
    [U, 'pot pottery', '古英語 pott「つぼ・鍋」から（pottery は pot を作る人 potter の仕事）。potis「力のある」とは関係ない。'],
    [U, 'potato', 'スペイン語 patata（カリブ海の言葉 batata「サツマイモ」から）。potis とは関係ない。'],
  ],
  // satis / sat ＝ 十分（ラテン語 satis / satur）
  satis: [
    [S, 'satire', 'ラテン語 satura「いろいろ詰めた料理→ごちゃまぜの詩」（satur「満ちた」から）→世の中を皮肉る詩→「風刺」。このカードと同じ satur・satis から。'],
    [U, 'satellite', 'ラテン語 satelles「お供・護衛」から→惑星のまわりを回る天体→「衛星」。satis「十分」とは関係ない。'],
    [U, 'saturday', '古英語 Sæterndæg「サトゥルヌスの日」（ローマ神話の農業の神 Sāturnus から）から。satis「十分」とは関係ない。'],
  ],
  // scend / scent ＝ 登る（ラテン語 scandere）
  scend: [
    [U, 'scent', '古フランス語 sentir「においをかぐ・感じる」（ラテン語 sentīre から、sens のカード）。c は17世紀にあとから入ったつづりで、scandere「登る」とは関係ない。'],
  ],
  // sen ＝ 年老いた（ラテン語 senex）
  sen: [
    [U, 'sense sensible sensibly sensitive sensitivity insensitive sensor sensory sensation sensational sentiment sentimental sentence consent consensus dissent resent resentful resentment', 'ラテン語 sentīre「感じる」の仲間（sens / sent のカード）。senex「年老いた」とは関係ない。'],
    [U, 'present', 'ラテン語 praesēns「目の前にある」（prae-「前に」＋ esse「ある」）から。senex とは関係ない。'],
    [U, 'send sender', '古英語 sendan「送る」から。英語にもとからある語で、senex とは関係ない。'],
    [U, 'disengage', 'dis-「反対に」＋ engage「約束する・かかわる」（古フランス語 engagier、gage「担保」から）。senex とは関係ない。'],
  ],
  // sol / sole ＝ 一つ・単独（ラテン語 sōlus）
  solus: [
    [U, 'solve solvent insolvent solution resolve resolution resolute resolutely dissolve dissolution', 'ラテン語 solvere「解く・溶かす・支払う」の仲間（solv / solut のカード）。sōlus「ただ一つの」とは別の語。'],
    [U, 'solid solidify consolidate soldier', 'ラテン語 solidus「かたい・中の詰まった」の仲間（金貨の名にもなり、soldier はその金貨で雇われた兵）。sōlus「ただ一つの」とは関係ない。'],
    [U, 'obsolete insolent', 'ラテン語 solēre「いつもしている・慣れている」の仲間。obsolete は使われなくなった、insolent は慣れ（しきたり）に外れた→「横柄な」。sōlus とは関係ない。'],
    [U, 'console solace', 'ラテン語 sōlārī「慰める」の仲間（console は com-「共に」＋ sōlārī）。sōlus とは関係ない。'],
    [U, 'solicit solicitor solicitous solicitude', 'ラテン語 sollicitus「すっかりかき乱された・心配した」（sollus「すべての」＋ ciēre「動かす」）の仲間。sōlus とは関係ない。'],
    [U, 'solemn', 'ラテン語 sollemnis「毎年決まって行う（儀式の）」から→儀式のように重々しい→「厳粛な」。sōlus とは関係ない。'],
    [U, 'solar', 'ラテン語 sōl「太陽」から。sōlus「ただ一つの」とは関係ない。'],
    [U, 'sole_2', 'ラテン語 solea「サンダル・足の裏」（solum「地面・底」から）から。「唯一の」の sole（sōlus から）とは別の語で、sōlus とは関係ない。'],
  ],
  // sper ＝ 望む（ラテン語 spērāre）
  sper: [
    [U, 'disperse', 'ラテン語 dispergere（dis-「ばらばらに」＋ spargere「まく」）→「分散させる」。spērāre「望む」とは関係ない。'],
  ],
  // sum / sumpt ＝ 取る・受け取る（ラテン語 sūmere）
  sum: [
    [S, 'sumptuous', 'ラテン語 sūmptus「費用」（sūmere「取る・使う」から）→お金をたっぷり使った→「豪華な」。このカードと同じ sūmere から。'],
    [U, 'sum summary summarize summit', 'ラテン語 summus「いちばん上の」・summa「合計・頂上」の仲間（super「上に」から）。sūmere「取る」とは関係ない。'],
    [U, 'summon summons', 'ラテン語 summonēre「そっと注意する」（sub-「下から・そっと」＋ monēre「注意させる」）→「呼び出す」。この sum は sub- ＋ mon で、sūmere ではない（mon のカードの仲間）。'],
    [U, 'summer', '古英語 sumor「夏」から。英語にもとからある語で、ラテン語 sūmere「取る」とは関係ない。'],
  ],
  // trib ＝ 割り当てる・与える（ラテン語 tribuere）
  trib: [
    [S, 'tribe tribal', 'ラテン語 tribus「（古代ローマの）部族」から。tribuere「分け与える」は、もともと「部族ごとに割り当てる」という tribus から出た動詞で、このカードと同じ語源。'],
    [U, 'diatribe', 'ギリシャ語 diatribē「時間をつぶすこと・講話」（dia-「通して」＋ tribein「こする」）から→長々とした論評→「痛烈な非難」。tribuere とは関係ない。'],
  ],
  // vinc / vict ＝ 勝つ・打ち負かす（ラテン語 vincere）
  vict: [
    [U, 'victim', 'ラテン語 victima「いけにえの動物」から→犠牲になる人→「被害者」。vincere「勝つ」とは別の語とされる。'],
  ],
  // vol / volunt ＝ 望む・意志（ラテン語 velle / voluntās）
  vol: [
    [U, 'involve involvement evolve revolve revolution revolutionary revolt convoluted devolve volume voluble', 'ラテン語 volvere「回す・巻く」の仲間（volv / volut のカード）。volume は巻物、voluble は舌がよく回る。velle「望む」とは別の語。'],
    [U, 'volatile volatility volleyball', 'ラテン語 volāre「飛ぶ」の仲間（volatile は volātilis「飛び去る」、volleyball の volley はフランス語 volée「飛ぶこと」から）。velle とは関係ない。'],
    [U, 'volcano volcanic', 'ローマ神話の火の神ウルカヌス（Vulcānus）の名から（イタリア語 vulcano を経た語）。velle とは関係ない。'],
    [U, 'voltage', 'イタリアの物理学者ボルタ（Volta）の名から→電圧の単位 volt→「電圧」。velle とは関係ない。'],
  ],
  // sit / set / seat ＝ 座る・据える（古英語 sittan / settan）
  'ge-sit': [
    [S, 'setback', 'set「置く」（古英語 settan「据える」から）＋ back「後ろへ」→後ろへ戻される→「後退・挫折」。このカードと同じ settan から。'],
    [U, 'situation situate situated site', 'ラテン語 situs「置かれた場所・位置」の仲間（situ / site のカード）。英語の sit「座る」とは関係ない。'],
    [U, 'parasite', 'ギリシャ語 parasītos「そばで食べる人」（para-「そばで」＋ sītos「食べ物」）→ただ食いする者→「寄生者」。英語の sit とは関係ない。'],
  ],
  // stand ＝ 立つ（古英語 standan）
  'ge-stand': [
    [Q, 'standard standardize substandard', '古フランス語 estandart「軍旗」から。ゲルマン語の「しっかり立つ」（stand の仲間）から来たとする説と、ラテン語 extendere「広げる」から来たとする説があり、はっきりしない。前者ならこのカードと同じ語源。'],
  ],
  // wit / wis ＝ 知る・賢い（古英語 witan / wīs）
  'ge-wit': [
    [U, 'with within without withdraw withdrawal withhold withstand', '古英語 wiþ「〜に向かって・〜に逆らって」から（with- のカードの仲間）。witan「知る」とは関係ない。'],
    [Q, 'wistful', 'wishful「願いをこめた」と古い語 wistly「じっと・熱心に」が混ざってできたとされる。wistly の元は分かっておらず、witan「知る」とのつながりもはっきりしない。'],
    [U, 'wish', '古英語 wȳscan「願う」から。witan「知る」・wīs「賢い」とは関係ない。'],
    [U, 'wither', '中英語 wydderen「しぼむ」（weather「風雨にさらす」の変わった形とされる）。witan とは関係ない。'],
    [U, 'witch', '古英語 wicce「女の魔法使い」から（元ははっきりしない）。wizard は wise の仲間だが、witch は witan とは関係ない。'],
  ],
  // tell / tale ＝ 数える・語る（古英語 tellan）
  'ge-tell': [
    [U, 'talent talented', 'ギリシャ語 talanton「てんびん・重さとお金の単位」から（ラテン語を経た語）。聖書の、預かったお金を生かす話から→神から預かった力→「才能」。古英語 tellan「語る」とは関係ない。'],
  ],
  // bear / birth ＝ 運ぶ・産む（古英語 beran）
  'ge-bear': [
    [U, 'bear', '古英語 bera「クマ」から（もとは「茶色いもの」とされる）。「耐える・運ぶ」の bear（古英語 beran）とは別の語。'],
    [U, 'beard', '古英語 beard「ひげ」から。beran「運ぶ・産む」とは関係ない。'],
  ],
  // whole / heal / holy ＝ 欠けがない・健全（古英語 hāl）
  'ge-whole': [
    [S, 'wholesale', 'whole「全体」（古英語 hāl「無傷の」から）＋ sale「販売」→まとめて売る→「卸売り」。このカードと同じ hāl から。'],
  ],
  // food / feed ＝ 食べ物・養う（古英語 fōda / fēdan）
  'ge-food': [
    [S, 'feedback', 'feed「与える」（古英語 fēdan「養う」から）＋ back「戻して」→結果を戻して与える→「反応・意見」。このカードと同じ fēdan から。'],
  ],
  // grow / grass / green ＝ 育つ・緑（古英語 grōwan / græs）
  'ge-grow': [
    [S, 'greenhouse', 'green「緑の」（古英語 grēne から）＋ house「家」→植物を育てる建物→「温室」。このカードと同じ語源。'],
  ],
  // two / twi- ＝ 2（古英語 twā）
  'ge-two': [
    [S, 'twig', '古英語 twigge「小枝」から。もとは「2つに分かれた所（枝の股）」を表した語とされ、このカードと同じ「2」の語根から。'],
  ],
  // one / -one ＝ 1（古英語 ān）
  'ge-one': [
    [U, 'exonerate onerous', 'ラテン語 onus「重荷」の仲間（exonerate は ex-「外へ」＋ onus →重荷を下ろす→「潔白を証明する」）。古英語 ān「1つの」とは関係ない。'],
  ],
  // break / breach ＝ 壊す・破る（古英語 brecan）
  'ge-break': [
    [S, 'breakfast', 'break「破る」（古英語 brecan から）＋ fast「断食」→一晩の断食を破る食事→「朝食」。このカードと同じ brecan から。'],
  ],
  // bind / bond ＝ 結ぶ（古英語 bindan）
  'ge-bind': [
    [Q, 'bondage', '中英語 bond「農奴・小作人」（古英語 bonda「家の主」、古ノルド語 bóndi から）＋ -age から。のちに bond「縛るもの」（bindan から）と重なって「束縛」の意味になった。形の元は別の語で、意味が bindan の仲間に寄った。'],
  ],
  // ride / road ＝ 乗って行く（古英語 rīdan）
  'ge-ride': [
    [U, 'deride', 'ラテン語 dērīdēre（dē-「下に見て」＋ rīdēre「笑う」）→「あざ笑う」。ridicule の仲間で、古英語 rīdan「馬で行く」とは関係ない。'],
  ],
  // ag / act ＝ 行う・駆り立てる（ラテン語 agere）
  ag: [
    [S, 'actual actually actuality exactly interact interaction inactive inaction enact react reaction deactivate', 'ラテン語 agere「行う」から来た act・active・action・actual（āctus「行い」から）に、inter-・in-・en-・re-・de- が付いた語や、exact（exigere「量る」＝ ex- ＋ agere）の仲間。このカードと同じ agere から。'],
  ],
  // uni / un ＝ 1つ（ラテン語 ūnus）
  uni: [
    [S, 'universe universal university uniform uniformity uniformly unicycle reunion', 'ラテン語 ūnus「1つ」から（universe は ūnus ＋ vertere「回す」で1つにまとめた全体、uniform は1つの形、unicycle は車輪が1つ、reunion は再び1つに）。このカードと同じ ūnus から。'],
    [U, 'unintentional unintentionally unintended unimaginative unimpressive uninformed uninspired', '英語の un-「〜でない」（un- のカード）＋ intentional・imaginative などの語。uni- ではなく un- ＋ i で始まる語で、ūnus「1つ」とは関係ない。', 'affix'],
  ],
  // radi ＝ 光線・放射（ラテン語 radius）
  radi: [
    [U, 'eradicate radical', 'ラテン語 rādīx「根」の仲間（eradicate は根を抜く→「根絶する」、radical は根本の→「根本的な・急進的な」）。radius「光線・車輪のスポーク」とは別の語。'],
  ],
  // rat / ratio ＝ 計算・理（ラテン語 ratiō）
  rat: [
    [S, 'irrational', 'in-「〜でない」＋ rational「理性的な」（ラテン語 ratiō「計算・理」から）。このカードと同じ ratiō から。'],
    [S, 'ratify ratification', 'ラテン語 ratus「決まった」（rērī「数える・考える」の過去分詞）＋ facere「する」→確定させる→「批准する」。ratiō も ratus から出た語で、このカードと同じ語源。'],
    [U, 'rattle', 'ガラガラという音をまねた中英語の語。ratiō とは関係ない。'],
    [U, 'rather', '古英語 hraþor「より早く」（hraþe「すばやく」の比べる形）から→より早く選ぶ→「むしろ」。ratiō とは関係ない。'],
  ],
  // hospit / host ＝ 客・もてなす（ラテン語 hospes）
  hospit: [
    [S, 'hostile hostility host_2', 'ラテン語 hostis「よそ者→敵」から（host_2 は古フランス語 host「軍勢」を経た「大群」）。hospes「客・もてなす主人」は、hostis と同じ「よそ者」を表す語根に「主人」を表す語が合わさった語で、このカードと同じ語根から。よそ者をもてなせば客、戦えば敵。'],
    [S, 'hostage', '古フランス語 hostage「宿を借りること・保証に預けられた人」（hoste「客・主人」、ラテン語 hospes から）→「人質」。このカードと同じ hospes から。'],
    [S, 'inhospitable', 'in-「〜でない」＋ hospitable「もてなしのよい」（ラテン語 hospes「客をもてなす人」から）→「無愛想な・住みにくい」。このカードと同じ hospes から。'],
  ],
  // amic / ami ＝ 友・愛する（ラテン語 amīcus）
  amic: [
    [U, 'amid', 'a-「〜に」＋ mid「真ん中」（古英語 midd から）→「〜のまっただ中に」。英語にもとからある語で、ラテン語 amīcus「友」とは関係ない。'],
  ],
  // fals / fall / faul ＝ 欺く・そこなう（ラテン語 fallere）
  fals: [
    [Q, 'fall', '古英語 feallan「落ちる」から。ラテン語 fallere「欺く（もとは足をすくう）」と同じ古い語根から来たとする説もあるが、はっきりしない。'],
    [U, 'fallow', '古英語 fealg「耕した土地」から→耕したまま休ませている→「休閑中の」。fallere とは関係ない。'],
  ],
  // err ＝ さまよう・誤る（ラテン語 errāre）
  err: [
    [U, 'errand', '古英語 ǣrende「伝言・使い」から→「用事・使い走り」。英語にもとからある語で、ラテン語 errāre「さまよう」とは関係ない。'],
  ],
  // pict / paint ＝ 描く（ラテン語 pingere）
  pict: [
    [S, 'depict', 'ラテン語 dēpingere（dē-「すっかり」＋ pingere「描く」）→「描写する」。このカードと同じ pingere から。'],
  ],
  // situ / site ＝ 置かれた場所（ラテン語 situs）
  situ: [
    [U, 'parasite', 'ギリシャ語 parasītos「そばで食べる人」（para-「そばで」＋ sītos「食べ物」）→ただ食いする者→「寄生者」。ラテン語 situs「置かれた場所」とは関係ない。'],
  ],
  // und ＝ 波・あふれる（ラテン語 unda）
  und: [
    [S, 'inundate', 'ラテン語 inundāre（in-「中へ」＋ unda「波」）→波が押し寄せる→「水浸しにする・殺到する」。このカードと同じ unda から。'],
    [U, 'under underground underlying underlie underwater underwear underweight underling underestimate undergraduate undergo undertake undertaking undermine understand understanding', '英語の under「下に」（古英語 under から）で始まる語。英語にもとからある語で、ラテン語 unda「波」とは関係ない。', 'affix'],
    [U, 'undo undamaged undoubtedly unduly undying undecided', '英語の un-「〜でない・元に戻す」（un- のカード）＋ do・damaged・doubt などの語。ラテン語 unda「波」とは関係ない。', 'affix'],
  ],
  // vari ＝ さまざまな（ラテン語 varius）
  vari: [
    [S, 'invariably', 'in-「〜でない」＋ variable「変わる」（ラテン語 variāre「変える」、varius「さまざまな」から）＋ -ly→変わることなく→「常に」。このカードと同じ varius から。'],
  ],
  // ante / anci ＝ 前に・先に（ラテン語 ante）
  ante: [
    [U, 'antenna', 'ラテン語 antenna「帆げた（帆を張る横木）」から→昆虫の触角→電波を受ける棒→「アンテナ」。ante「前に」とは関係ない。'],
    [U, 'ancillary', 'ラテン語 ancilla「召使いの女性」から→主人を助ける→「補助的な」。ante「前に」とは関係ない。'],
  ],
  // apt / att ＝ 適した・合う（ラテン語 aptus）
  apt: [
    [S, 'adapt', 'ラテン語 adaptāre（ad-「〜に」＋ aptāre「合わせる」、aptus「適した」から）→「適応する」。このカードと同じ aptus から。'],
    [U, 'attract attractive attraction attend attendance attendant attention attentive inattentive attempt attain attribute attest attenuate', 'ラテン語 ad-「〜の方へ」が t の前で at- になった語（attract は ad- ＋ trahere「引く」、attend は ad- ＋ tendere「伸ばす」、attribute は ad- ＋ tribuere「割り当てる」など）。apt「適した」とは関係ない。', 'affix'],
    [U, 'attach attack', '古フランス語 estachier「くいで留める」・イタリア語 attaccare「取りつく」から（どちらもゲルマン語の「くい」から来たとされる）。aptus とは関係ない。'],
    [U, 'attorney', '古フランス語 atorné「任命された人」（atorner「割り当てる」、a-「〜に」＋ torner「回す」から）→代わりを任された人→「弁護士」。aptus とは関係ない。'],
  ],
  // salv / sav / saf ＝ 無事な・救う（ラテン語 salvus）
  salv: [
    [S, 'salvation salvage', 'ラテン語 salvāre「救う」（salvus「無事な」から）。このカードと同じ salvus から。'],
    [S, 'safeguard', 'safe「安全な」（ラテン語 salvus から）＋ guard「守り」→「保護策・守る」。このカードと同じ salvus から。'],
    [U, 'savage savagely', 'ラテン語 silvāticus「森の・野生の」（silva「森」から）→古フランス語 sauvage を経た語→「野蛮な・凶暴な」。salvus とは関係ない。'],
    [U, 'savor savvy', 'ラテン語 sapere「味がする・分かる」の仲間（savor は sapor「味」から「味わう」、savvy はスペイン語 sabe「知っている」から「精通した」）。salvus とは関係ない。'],
  ],
  // class ＝ 区分・等級（ラテン語 classis）
  class: [
    [S, 'classmate', 'class「学級」（ラテン語 classis「区分」から）＋ mate「仲間」→「同級生」。このカードと同じ classis から。'],
  ],
  // tex / text ＝ 織る（ラテン語 texere）
  tex: [
    [S, 'text context', 'ラテン語 textus「織られたもの」（texere「織る」から）→ことばを織り上げたもの→「文章」、context は com-「共に」＋ texere →前後の織り合わせ→「文脈」。このカードと同じ texere から。'],
  ],
  // preti / prec / prais ＝ 値段・価値（ラテン語 pretium）
  preti: [
    [S, 'depreciate', 'ラテン語 dēpretiāre（dē-「下へ」＋ pretium「値段」）→「価値が下がる」。このカードと同じ pretium から。'],
    [U, 'precise precisely precision precede preceding precedent precursor preclude precaution precocious precipitate precipitous precept', 'ラテン語 prae-「前に」で始まる語（precise は prae- ＋ caedere「切る」、precede は prae- ＋ cēdere「行く」、precipitate は prae- ＋ caput「頭」など）。pretium「値段」とは関係ない。', 'affix'],
    [U, 'precarious precariously deprecate', 'ラテン語 prex（precis）「頼み・祈り」の仲間（precarious は頼んで得た→いつ取り上げられるか分からない→「不安定な」、deprecate は祈って退ける→「非難する」）。pretium とは関係ない。'],
  ],
  // acu / ac / acr ＝ 鋭い・とがった（ラテン語 acus / acer）
  acu: [
    [S, 'acute acutely acuity', 'ラテン語 acūtus「とがった」（acuere「鋭くする」から）→「鋭い・急性の」。このカードと同じ語根から。'],
    [S, 'acrid acrimony acrimonious', 'ラテン語 ācer「鋭い」の仲間（ācrimōnia「鋭さ・辛さ」）→「辛らつな・とげとげしい」。このカードと同じ ācer から。'],
    [U, 'across', 'a-「〜に」＋ cross「十字・横切る」（ラテン語 crux「十字架」から）→「〜を横切って」。ācer とは関係ない。'],
  ],
  // divid / devi ＝ 分ける（ラテン語 dīvidere）
  divid: [
    [S, 'devise', '古フランス語 deviser「分ける・工夫する」（ラテン語 dīvidere「分ける」から）→「考案する」。device と同じく dīvidere から。'],
    [U, 'deviate deviation devious', 'ラテン語 dē-「離れて」＋ via「道」の仲間（via のカード）→道をそれる→「逸脱する」。dīvidere とは関係ない。'],
    [U, 'devil', 'ギリシャ語 diabolos「中傷する者」（dia-「越えて」＋ ballein「投げる」）→神に逆らう者→「悪魔」。dīvidere とは関係ない。'],
  ],
  // eth ＝ 習わし・気風（ギリシャ語 ēthos）
  eth: [
    [D, 'ethnic ethnicity', 'ギリシャ語 ethnos「民族・人々」から。ēthos「習わし・気風」とは別の語だが、どちらも「自分（たち）の」を表す古い語根から来たとされる遠い親戚（自分たちの仲間・自分たちの習わし）。'],
    [U, 'ethereal', 'ギリシャ語 aithēr「空の上の澄んだ空気」から→天上のように軽い→「この世のものとは思えない」。ēthos とは関係ない。'],
  ],
  // humil / hum ＝ 低い・土（ラテン語 humilis）
  humil: [
    [S, 'exhume', 'ラテン語 ex-「外へ」＋ humus「土」→土の中から掘り出す→「（死体を）発掘する」。humble・humiliate の元の humilis「低い（地面に近い）」と同じ humus「土」から。'],
    [D, 'human humane humanity humanitarian humankind', 'ラテン語 hūmānus「人間の」から（humane は human の古いつづりで、意味が分かれた）。hūmānus は homō「人」の仲間とされ、もとは「大地に住むもの（天の神に対する人間）」を表した。humilis「低い」も humus「土・地面」から来た語なので、さかのぼると、どちらも「土・大地」を表す同じ古い語根につながる遠い親戚。'],
    [U, 'humid humidity humor', 'ラテン語 ūmēre「湿っている」の仲間（ūmidus「湿った」、ūmor「水分・体液」）。h は、あとで humus「土」と結びつけられて付いたもの。humor は、体液の具合で気分が決まると考えられたことから「気分・ユーモア」になった。humilis とは関係ない。'],
    [U, 'hum', 'ブーンという音をまねてできた英語。humilis とは関係ない。'],
  ],
  // organ ＝ 道具・器官（ギリシャ語 organon）
  organ: [
    [S, 'disorganized', 'dis-「反対に」＋ organized「整った」（organize、ギリシャ語 organon「道具・器官」から）→「まとまりのない」。このカードと同じ organon から。'],
  ],
  // toler ＝ 耐える・持ちこたえる（ラテン語 tolerāre）
  toler: [
    [S, 'intolerant intolerance intolerable', 'in-「〜でない」＋ tolerant・tolerance・tolerable（ラテン語 tolerāre「耐える」から）。このカードと同じ tolerāre から。'],
  ],
  // poen / pun / pain ＝ 罰・苦しみ（ラテン語 poena）
  poen: [
    [S, 'painstaking', 'pains「骨折り」（pain、ラテン語 poena「罰」から）＋ taking「引き受ける」→苦労をいとわない→「入念な」。このカードと同じ poena から。'],
    [U, 'paint painter painting', 'ラテン語 pingere「描く・塗る」の仲間（pict / paint のカード）→古フランス語 peint を経た語。poena「罰」とは関係ない。'],
    [U, 'punctual punctuality punctilious pungent compunction', 'ラテン語 pungere「刺す」・punctum「点」の仲間（point / punct のカード）。poena とは関係ない。'],
  ],
  // grav / griev ＝ 重い（ラテン語 gravis）
  grav: [
    [U, 'grave engrave', '古英語 græf「掘った穴」・grafan「掘る・彫る」から（grave は「墓」、engrave は en-「中に」＋ grave「彫る」）。英語にもとからある語で、ラテン語 gravis「重い」とは関係ない（「重大な」の grave は gravis から来た別の語）。'],
  ],
  // her / heir ＝ 相続する（ラテン語 hērēs）
  heres: [
    [U, 'inherent adhere', 'ラテン語 haerēre「くっつく」の仲間（her / hes のカード）。hērēs「相続人」とは別の語。'],
    [U, 'hero heroism', 'ギリシャ語 hērōs「英雄」から。ラテン語 hērēs「相続人」とは関係ない。'],
    [U, 'heresy', 'ギリシャ語 hairesis「選ぶこと・派」から→正統とちがう考えを選ぶこと→「異端」。hērēs とは関係ない。'],
    [U, 'herb', 'ラテン語 herba「草」から。hērēs とは関係ない。'],
    [U, 'herd', '古英語 heord「（家畜の）群れ」から。英語にもとからある語で、hērēs とは関係ない。'],
    [U, 'her hers herself', '古英語 hire「彼女の・彼女に」から。英語にもとからある語で、hērēs とは関係ない。'],
    [U, 'here', '古英語 hēr「ここに」から。英語にもとからある語で、hērēs とは関係ない。'],
  ],
  // insul / isl ＝ 島（ラテン語 īnsula）
  insul: [
    [U, 'island', '古英語 īegland「水に囲まれた土地」から。s は16世紀に、ラテン語 īnsula から来た isle「島」に引かれて入ったつづりで（発音しない）、island は īnsula とは関係ない。'],
    [U, 'insult insulting', 'ラテン語 insultāre「飛びかかる」（in-「〜に」＋ saltāre「跳ぶ」）→「侮辱する」。sult / sal（跳ぶ）の仲間で、īnsula とは関係ない。'],
  ],
  // imper / empir ＝ 命じる・支配（ラテン語 imperium）
  imper: [
    [S, 'imperative', 'ラテン語 imperātīvus「命令の」（imperāre「命じる」から）→「必須の」。このカードと同じ imperium の仲間。'],
    [U, 'imperil impertinent impersonate impersonation imperceptible impervious', 'ラテン語 in-（im-）「〜に・〜でない」で始まる語（imperil は im- ＋ peril「危険」、impertinent は im- ＋ pertinent「関係のある」、impersonate は im- ＋ persona「役」、imperceptible・impervious は im-「〜でない」＋ per- の語）。imperium とは関係ない。', 'affix'],
    [U, 'empirical', 'ギリシャ語 empeiria「経験」（en-「中で」＋ peira「試み」から）→「経験にもとづく」。imperium とは関係ない。'],
  ],
  // brev / bridg ＝ 短い（ラテン語 brevis）
  brev: [
    [U, 'bridge', '古英語 brycg「橋」から。英語にもとからある語で、ラテン語 brevis「短い」とは関係ない（abridge の bridg とは別）。'],
  ],
  // plac / pleas ＝ 気に入る・なだめる（ラテン語 placēre）
  plac: [
    [S, 'displease displeasure', 'dis-「反対に」＋ please・pleasure（ラテン語 placēre「気に入る」から）。このカードと同じ placēre から。'],
    [S, 'implacable', 'ラテン語 in-「〜でない」＋ plācāre「なだめる」（placēre と同じ語根）→「なだめがたい」。このカードの仲間。'],
    [S, 'complacent', 'ラテン語 complacēre（com-「すっかり」＋ placēre「気に入る」）→自分にすっかり満足した→「現状に満足した」。このカードと同じ placēre から。'],
    [S, 'placebo', 'ラテン語 placēbō「私は喜ばせるだろう」（placēre から）→気持ちを落ち着かせるだけの薬→「偽薬」。このカードと同じ placēre から。'],
    [U, 'place placement replace', 'ギリシャ語 plateia「広い通り」から（ラテン語 platea・古フランス語を経た語）→「場所・置く」。plaza の仲間で、placēre とは関係ない。'],
  ],
  // terr / terrif ＝ 怖がらせる（ラテン語 terrēre）
  terrere: [
    [U, 'territory terrestrial', 'ラテン語 terra「大地・土地」の仲間（terr のカード）。terrēre「怖がらせる」とは別の語。'],
  ],
  // don / dot ＝ 贈る・与える（ラテン語 dōnāre）
  don: [
    [D, 'antidote', 'ギリシャ語 antidoton「対して与えるもの」（anti-「〜に対して」＋ didonai「与える」）→毒に対して与える薬→「解毒剤」。ラテン語 dōnāre とは、どちらも「与える」を表す古い語根から分かれた遠い親戚。'],
    [U, 'dote', '中世オランダ語 doten「ぼける」から→分別をなくすほど→「溺愛する」。dōnāre とは関係ない。'],
  ],
  // rap / rept ＝ つかみ取る・さらう（ラテン語 rapere）
  rap: [
    [S, 'rapid rapidly', 'ラテン語 rapidus「ひったくるように速い」（rapere「奪い取る」から）→「急速な」。このカードと同じ rapere から。'],
    [U, 'reptile', 'ラテン語 rēpere「はう」から→地面をはう生き物→「爬虫類」。rapere とは関係ない。'],
    [U, 'rapport', 'フランス語 rapporter「持ち帰る・結びつける」（re- ＋ apporter「運んでくる」、ラテン語 portāre から）→「良好な関係」。rapere とは関係ない。'],
  ],
  // lic / leis ＝ 許される（ラテン語 licēre）
  lic: [
    [S, 'illicit', 'in-「〜でない」＋ ラテン語 licitus「許された」（licēre から）→「違法の」。このカードと同じ licēre から。'],
    [U, 'elicit', 'ラテン語 ēlicere（ē-「外へ」＋ lacere「誘う」）→誘い出す→「引き出す」。licēre とは関係ない。'],
  ],
  // nov ＝ 新しい（ラテン語 novus）
  nov: [
    [U, 'november', 'ラテン語 November から。novem「9」（ローマの暦は3月から始まるので、9番目の月）から来た語で、novus「新しい」とは別の語。'],
  ],
  // germ ＝ 芽（ラテン語 germen）
  germ: [
    [U, 'germany', 'ラテン語 Germānia「ゲルマン人の地」から。ゲルマン人を指す Germānī という名はラテン語ではないとされ、由来ははっきりしない（ガリアのことばから来たとする説がある）。germane の元の germānus「同じ親から生まれた」（germen「芽」の仲間）とは別の語とされる。'],
  ],
})

// 同じカードのまとまりどうしで、決まり（lookalike-origins.js の説明）に当てはまらない組。[語, 語, つながり, 説明]
export const ROOT_LOOKALIKE_LINKS = Object.freeze({
  pos: [
    ['repose', 'suppose', S, 'どちらも後期ラテン語 pausāre「止まる・休ませる」から。'],
  ],
  cept: [
    ['capricious', 'capital', Q, 'capriccio の capo「頭」を caput から来たとみる説があるが、はっきりしない。'],
  ],
  sta: [
    ['stare', 'stark', D, 'どちらも「こわばる」を表す同じ古い語根にさかのぼる遠い親戚。'],
    ['stare', 'starve', D, 'どちらも「こわばる」を表す同じ古い語根にさかのぼる遠い親戚（こわばる→死ぬ）。'],
    ['stark', 'starve', D, 'どちらも「こわばる」を表す同じ古い語根にさかのぼる遠い親戚。'],
    ['stall', 'stalk', D, 'どちらも「据える・立てる」を表す同じ古い語根にさかのぼるとされる遠い親戚（stall は立つ所、stalk は立つ茎）。'],
    ['stamp', 'staple', D, 'どちらも「しっかり支える・踏みしめる」を表す同じ古い語根にさかのぼるとされる遠い親戚。'],
    ['stamp', 'staff', D, 'どちらも「しっかり支える・踏みしめる」を表す同じ古い語根にさかのぼるとされる遠い親戚。'],
    ['staple', 'staff', D, 'どちらも「柱・支え」を表す同じ古い語根にさかのぼるとされる遠い親戚。'],
    ['stake', 'stack', D, 'どちらも「棒・くい」を表す同じ古い語根にさかのぼるとされる遠い親戚。'],
  ],
  sult: [
    ['salt', 'salary', D, '英語の salt とラテン語の sal は、同じ「塩」を表す古い語から分かれた遠い親戚。'],
  ],
  her: [
    ['her', 'here', D, 'どちらも「これ」を指す古い語から出た遠い親戚（he・him も同じ仲間）。'],
  ],
  heres: [
    ['her', 'here', D, 'どちらも「これ」を指す古い語から出た遠い親戚（he・him も同じ仲間）。'],
  ],
})
