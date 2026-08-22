const role = (roleCode, text) => Object.freeze({ role: roleCode, text })
const sceneGuide = (parts, options = {}) => Object.freeze({
  parts: Object.freeze(parts),
  allowVerbOmission: Boolean(options.allowVerbOmission),
  note: options.note ?? '',
})
const question = (id, prompt, choices, answer, explanation, evidenceScene) => Object.freeze({
  id,
  prompt,
  choices: Object.freeze(choices),
  answer,
  explanation,
  evidenceScene,
})

const MOBY_DICK_SCENES = Object.freeze([
  sceneGuide([
    role('LINK', 'There'), role('M', 'now'), role('V', 'is'), role('S', 'your insular city'),
    role('M', 'of the Manhattoes'), role('M', 'belted round by wharves'), role('LINK', 'as'),
    role('S', 'Indian isles'), role('M', 'by coral reefs—commerce'),
    role('V', 'surrounds'), role('O', 'it'), role('M', 'with her surf'),
  ], { note: 'There is の存在構文から都市の比喩へ進み、commerce surrounds it が独立した主節として続きます。' }),
  sceneGuide([
    role('M', 'Right and left'), role('S', 'the streets'), role('V', 'take'), role('O', 'you'),
    role('M', 'waterward'), role('S', 'Its extreme downtown'), role('V', 'is'),
    role('C', 'the battery'), role('M', 'where'), role('S', 'that noble mole'),
    role('V', 'is washed'), role('M', 'by waves'), role('LINK', 'and'), role('V', 'cooled'),
    role('M', 'by breezes'), role('S', 'which'), role('M', 'a few hours previous'),
    role('V', 'were'), role('M', 'out of sight of land'), role('V', 'Look'),
    role('M', 'at the crowds'), role('M', 'of water-gazers there'),
  ], { note: '通りを主語にした take you waterward のあと、where と which が岬と風を順に説明します。' }),
  sceneGuide([
    role('V', 'Circumambulate'), role('O', 'the city'), role('M', 'of a dreamy Sabbath afternoon'),
    role('V', 'Go'), role('M', 'from Corlears Hook'), role('M', 'to Coenties Slip'),
    role('LINK', 'and'), role('M', 'from thence'), role('M', 'by Whitehall'), role('M', 'northward'),
    role('C', 'What'), role('V', 'do'), role('S', 'you'), role('V', 'see'),
    role('M', 'Posted like silent sentinels all around the town'), role('V', 'stand'),
    role('S', 'thousands upon thousands of mortal men'), role('M', 'fixed in ocean reveries'),
  ], { note: '三つの命令・疑問で視線を誘導し、Posted ... stand ... の倒置で群衆を初めて主語として示します。' }),
  sceneGuide([
    role('S', 'Some'), role('V', 'leaning'), role('M', 'against the spiles'),
    role('S', 'some'), role('V', 'seated'), role('M', 'upon the pier-heads'),
    role('S', 'some'), role('V', 'looking'), role('M', 'over the bulwarks'),
    role('M', 'of ships from China'), role('S', 'some'), role('M', 'high aloft in the rigging'),
    role('LINK', 'as if'), role('V', 'striving'), role('M', 'to get a still better seaward peep'),
  ], { note: '前場面の men を受けた分詞句です。Some を四度反復し、異なる姿勢を一つの海への視線で束ねます。' }),
  sceneGuide([
    role('LINK', 'But'), role('S', 'these'), role('V', 'are'), role('C', 'all landsmen'),
    role('M', 'of week days'), role('V', 'pent up'), role('M', 'in lath and plaster—tied'),
    role('M', 'to counters'), role('V', 'nailed'), role('M', 'to benches'),
    role('V', 'clinched'), role('M', 'to desks'), role('LINK', 'How then'),
    role('V', 'is'), role('S', 'this'), role('V', 'Are'), role('S', 'the green fields'),
    role('C', 'gone'), role('C', 'What'), role('V', 'do'), role('S', 'they'), role('M', 'here'),
  ], { note: '受け身の三語 tied・nailed・clinched が仕事の拘束を重ね、続く疑問文が水辺へ来る理由を迫ります。' }),
  sceneGuide([
    role('LINK', 'But'), role('V', 'look'), role('LINK', 'here'), role('V', 'come'),
    role('S', 'more crowds'), role('V', 'pacing'), role('M', 'straight for the water'),
    role('LINK', 'and'), role('M', 'seemingly'), role('V', 'bound'), role('M', 'for a dive'),
    role('C', 'Strange'), role('S', 'Nothing'), role('V', 'will content'), role('O', 'them'),
    role('LINK', 'but'), role('O', 'the extremest limit of the land'), role('S', 'loitering'),
    role('M', 'under the shady lee of yonder warehouses'), role('V', 'will not suffice'),
    role('LINK', 'No'),
  ], { note: 'here come は場所を先に出す倒置です。Nothing ... but ... が「陸の端以外では満足しない」と限定します。' }),
  sceneGuide([
    role('S', 'They'), role('V', 'must get'), role('M', 'just as nigh the water'),
    role('LINK', 'as'), role('S', 'they'), role('M', 'possibly'), role('V', 'can'),
    role('M', 'without falling in'), role('LINK', 'And there'), role('S', 'they'),
    role('V', 'stand—miles'), role('M', 'of them—leagues'), role('C', 'Inlanders all'),
    role('S', 'they'), role('V', 'come'), role('M', 'from lanes and alleys'),
    role('M', 'streets and avenues—north east south and west'), role('LINK', 'Yet here'),
    role('S', 'they'), role('M', 'all'), role('V', 'unite'),
  ], { note: 'as ... as they can が限界まで近づく意味を作り、四方から来た人々を Yet here で一か所へ集めます。' }),
  sceneGuide([
    role('V', 'Tell'), role('O', 'me'), role('V', 'does'), role('S', 'the magnetic virtue'),
    role('M', 'of the needles'), role('M', 'of the compasses'), role('M', 'of all those ships'),
    role('V', 'attract'), role('O', 'them'), role('M', 'thither'),
  ], { note: 'does ... attract ...? の疑問文です。of が三層に重なり、磁力の持ち主を船の羅針盤の針までたどります。' }),
])

const PRIDE_PREJUDICE_SCENES = Object.freeze([
  sceneGuide([
    role('S', 'It'), role('V', 'is'), role('C', 'a truth'), role('M', 'universally acknowledged'),
    role('LINK', 'that'), role('S', 'a single man'), role('M', 'in possession of a good fortune'),
    role('V', 'must be'), role('C', 'in want'), role('M', 'of a wife'),
  ], { note: 'It is a truth の内容を that 節が説明します。must は本人の事実ではなく、世間の決めつけを皮肉に響かせます。' }),
  sceneGuide([
    role('M', 'However little known'), role('S', 'the feelings or views'),
    role('M', 'of such a man'), role('V', 'may be'), role('M', 'on his first entering a neighbourhood'),
    role('S', 'this truth'), role('V', 'is'), role('M', 'so well'), role('V', 'fixed'),
    role('M', 'in the minds of the surrounding families'), role('LINK', 'that'),
    role('S', 'he'), role('V', 'is considered'), role('C', 'the rightful property'),
    role('M', 'of some one or other of their daughters'),
  ], { note: 'However little ... may be の譲歩節を越えると、主節 this truth is ... と so ... that ... の結果が現れます。' }),
  sceneGuide([
    role('C', 'My dear Mr Bennet'), role('V', 'said'), role('S', 'his lady'),
    role('M', 'to him one day'), role('V', 'have'), role('S', 'you'), role('V', 'heard'),
    role('LINK', 'that'), role('S', 'Netherfield Park'), role('V', 'is let'), role('M', 'at last'),
  ], { note: '引用を said his lady が分けています。have you heard の目的語は that 以下の「屋敷が貸された」という知らせです。' }),
  sceneGuide([
    role('S', 'Mr Bennet'), role('V', 'replied'), role('LINK', 'that'), role('S', 'he'),
    role('V', 'had not'), role('LINK', 'But'), role('S', 'it'), role('V', 'is'),
    role('V', 'returned'), role('S', 'she'), role('LINK', 'for'), role('S', 'Mrs Long'),
    role('V', 'has just been'), role('M', 'here'), role('LINK', 'and'), role('S', 'she'),
    role('V', 'told'), role('O', 'me'), role('O2', 'all about it'),
  ], { note: 'had not の後ろでは heard が省略されています。for 以下は、夫人が「本当」と断言する根拠です。' }),
  sceneGuide([
    role('S', 'Mr Bennet'), role('V', 'made'), role('O', 'no answer'), role('V', 'Do'),
    role('S', 'you'), role('M', 'not'), role('V', 'want'), role('O', 'to know'),
    role('S', 'who'), role('V', 'has taken'), role('O', 'it'), role('V', 'cried'),
    role('S', 'his wife'), role('M', 'impatiently'), role('S', 'You'), role('V', 'want'),
    role('O', 'to tell me'), role('LINK', 'and'), role('S', 'I'), role('V', 'have'),
    role('O', 'no objection'), role('M', 'to hearing it'),
  ], { note: '妻は主語 you で夫の関心を問い、夫は同じ you を使って「話したいのは君だ」と静かに返します。' }),
  sceneGuide([
    role('S', 'This'), role('V', 'was'), role('C', 'invitation enough'), role('LINK', 'Why'),
    role('C', 'my dear'), role('S', 'you'), role('V', 'must know'), role('S', 'Mrs Long'),
    role('V', 'says'), role('LINK', 'that'), role('S', 'Netherfield'), role('V', 'is taken'),
    role('M', 'by a young man of large fortune from the north of England'),
    role('LINK', 'that'), role('S', 'he'), role('V', 'came down'), role('M', 'on Monday'),
    role('M', 'in a chaise and four'), role('M', 'to see the place'), role('LINK', 'and'),
    role('V', 'was'), role('M', 'so much'), role('C', 'delighted'), role('M', 'with it'),
    role('LINK', 'that'), role('S', 'he'), role('V', 'agreed'), role('M', 'with Mr Morris immediately'),
    role('LINK', 'that'), role('S', 'he'), role('V', 'is to take possession'),
    role('M', 'before Michaelmas'), role('LINK', 'and'), role('S', 'some of his servants'),
    role('V', 'are to be'), role('M', 'in the house'), role('M', 'by the end of next week'),
  ], { note: 'Mrs. Long says に三つの that 節が続き、来訪・契約・入居予定を息つく間もなく報告します。' }),
  sceneGuide([
    role('C', 'What'), role('V', 'is'), role('S', 'his name'), role('C', 'Bingley'),
    role('V', 'Is'), role('S', 'he'), role('C', 'married'), role('LINK', 'or'), role('C', 'single'),
  ], { note: 'Bingley は一語だけの応答です。二つ目の疑問文は married or single という補語を対比します。' }),
  sceneGuide([
    role('LINK', 'Oh'), role('C', 'Single'), role('C', 'my dear'), role('M', 'to be sure'),
    role('C', 'A single man'), role('M', 'of large fortune'), role('C', 'four or five thousand a year'),
    role('C', 'What a fine thing'), role('M', 'for our girls'),
  ], {
    allowVerbOmission: true,
    note: '省略の多い感嘆の連続です。Single、財産、年収、our girls の順に、夫人の関心がはっきりします。',
  }),
])

const TALE_TWO_CITIES_SCENES = Object.freeze([
  sceneGuide([
    role('S', 'It'), role('V', 'was'), role('C', 'the best of times'), role('S', 'it'),
    role('V', 'was'), role('C', 'the worst of times'), role('S', 'it'), role('V', 'was'),
    role('C', 'the age of wisdom'), role('S', 'it'), role('V', 'was'),
    role('C', 'the age of foolishness'),
    role('S', 'it'), role('V', 'was'), role('C', 'the epoch of belief'), role('S', 'it'),
    role('V', 'was'), role('C', 'the epoch of incredulity'), role('S', 'it'), role('V', 'was'),
    role('C', 'the season of Light'), role('S', 'it'), role('V', 'was'),
    role('C', 'the season of Darkness'),
    role('S', 'it'), role('V', 'was'), role('C', 'the spring of hope'), role('S', 'it'),
    role('V', 'was'), role('C', 'the winter of despair'), role('S', 'we'), role('V', 'had'),
    role('O', 'everything'), role('M', 'before us'), role('S', 'we'), role('V', 'had'),
    role('O', 'nothing'), role('M', 'before us'),
    role('S', 'we'), role('V', 'were all going'), role('M', 'direct to Heaven'), role('S', 'we'),
    role('V', 'were all going'), role('M', 'direct the other way—in short'),
    role('S', 'the period'), role('V', 'was'), role('M', 'so far'), role('C', 'like the present period'),
    role('LINK', 'that'), role('S', 'some of its noisiest authorities'), role('V', 'insisted'),
    role('M', 'on its being received'), role('M', 'for good or for evil'),
    role('M', 'in the superlative degree of comparison only'),
  ], { note: 'It was の反復に正反対の補語を重ね、最後の so ... that ... で「最上級だけで語る論者」への皮肉へ着地します。' }),
  sceneGuide([
    role('LINK', 'There'), role('V', 'were'), role('S', 'a king with a large jaw'),
    role('LINK', 'and'), role('S', 'a queen with a plain face'), role('M', 'on the throne of England'),
    role('LINK', 'there'), role('V', 'were'), role('S', 'a king with a large jaw'),
    role('LINK', 'and'), role('S', 'a queen with a fair face'), role('M', 'on the throne of France'),
  ], { note: 'There were の存在構文を二国で繰り返し、王は同じ描写、王妃は plain / fair の対比にします。' }),
  sceneGuide([
    role('M', 'In both countries'), role('S', 'it'), role('V', 'was'),
    role('C', 'clearer than crystal'), role('M', 'to the lords'),
    role('M', 'of the State preserves of loaves and fishes'), role('LINK', 'that'),
    role('S', 'things in general'), role('V', 'were settled'), role('M', 'for ever'),
  ], { note: '形式主語 it の内容は that 以下です。clearer than crystal が支配者の過信を強い比較で示します。' }),
  sceneGuide([
    role('S', 'It'), role('V', 'was'), role('C', 'the year'), role('M', 'of Our Lord'),
    role('C', 'one thousand seven hundred and seventy-five'),
  ], { note: 'It was the year ... の単純な骨格で、抽象的な時代の対比から具体的な1775年へ切り替えます。' }),
  sceneGuide([
    role('S', 'Spiritual revelations'), role('V', 'were conceded'), role('M', 'to England'),
    role('M', 'at that favoured period'), role('M', 'as at this'), role('S', 'Mrs Southcott'),
    role('V', 'had recently attained'), role('O', 'her five-and-twentieth blessed birthday'),
    role('M', 'of whom'), role('S', 'a prophetic private'), role('M', 'in the Life Guards'),
    role('V', 'had heralded'), role('O', 'the sublime appearance'), role('M', 'by announcing'),
    role('LINK', 'that'), role('S', 'arrangements'), role('V', 'were made'),
    role('M', 'for the swallowing up of London and Westminster'),
  ], { note: '受け身 were conceded の一般論から実例へ進み、by announcing 以下が兵卒の予告方法を説明します。' }),
])

const ALICE_SCENES = Object.freeze([
  sceneGuide([
    role('S', 'Alice'), role('V', 'was beginning to get'), role('C', 'very tired'),
    role('M', 'of sitting'), role('M', 'by her sister'), role('M', 'on the bank'),
    role('LINK', 'and'), role('M', 'of having nothing to do'),
  ], { note: 'of sitting と of having は、退屈の理由を並列で補っています。' }),
  sceneGuide([
    role('M', 'Once or twice'), role('S', 'she'), role('V', 'had peeped'),
    role('M', 'into the book'), role('S', 'her sister'), role('V', 'was reading'),
    role('LINK', 'but'), role('S', 'it'), role('V', 'had'), role('O', 'no pictures'),
    role('LINK', 'or'), role('O', 'conversations'), role('M', 'in it'),
  ], { note: 'the book の直後に関係代名詞 that が省略され、her sister was reading が book を説明します。' }),
  sceneGuide([
    role('LINK', 'And'), role('C', 'what'), role('V', 'is'), role('S', 'the use'),
    role('M', 'of a book'), role('V', 'thought'), role('S', 'Alice'),
    role('M', 'without pictures'), role('LINK', 'or'), role('M', 'conversations'),
  ], { note: '疑問文の引用の途中に thought Alice が挟まっています。引用の骨格を先につかみます。' }),
  sceneGuide([
    role('LINK', 'There'), role('V', 'was'), role('S', 'nothing'),
    role('C', 'so very remarkable'), role('M', 'in that'), role('LINK', 'nor'),
    role('V', 'did'), role('S', 'Alice'), role('V', 'think'), role('O', 'it'),
    role('C', 'so very much out of the way'), role('M', 'to hear'),
    role('O', 'the Rabbit'), role('V', 'say'), role('M', 'to itself'),
    role('LINK', 'Oh dear Oh dear'), role('S', 'I'), role('V', 'shall be'), role('C', 'late'),
  ], { note: 'nor が前に出たため did Alice think と倒置しています。引用内の I shall be late は独立した S＋V です。' }),
  sceneGuide([
    role('LINK', 'But when'), role('S', 'the Rabbit'), role('M', 'actually'),
    role('V', 'took'), role('O', 'a watch'), role('M', 'out of its waistcoat-pocket'),
    role('LINK', 'and'), role('V', 'looked'), role('M', 'at it'),
    role('LINK', 'and then'), role('V', 'hurried'), role('M', 'on'),
    role('S', 'Alice'), role('V', 'started'), role('M', 'to her feet'),
  ], { note: 'when 節の三つの動作 took → looked → hurried のあと、主節 Alice started が来ます。' }),
  sceneGuide([
    role('M', 'Burning with curiosity'), role('S', 'she'), role('V', 'ran'),
    role('M', 'across the field'), role('M', 'after it'), role('LINK', 'and'),
    role('V', 'was'), role('C', 'just in time'), role('M', 'to see'),
    role('O', 'it'), role('V', 'pop down'), role('M', 'a large rabbit-hole'),
    role('M', 'under the hedge'),
  ], { note: 'Burning ... は主語 she の状態。see＋it＋pop は「それが飛び込むのを見る」です。' }),
  sceneGuide([
    role('M', 'In another moment'), role('M', 'down'), role('V', 'went'),
    role('S', 'Alice'), role('M', 'after it'), role('M', 'never once'),
    role('V', 'considering'), role('LINK', 'how'), role('M', 'in the world'),
    role('S', 'she'), role('V', 'was to get'), role('M', 'out again'),
  ], { note: 'down を先頭に出した倒置です。通常の骨格 Alice went down を復元して読みます。' }),
])

const HAPPY_PRINCE_SCENES = Object.freeze([
  sceneGuide([
    role('M', 'High above the city'), role('M', 'on a tall column'),
    role('V', 'stood'), role('S', 'the statue'), role('M', 'of the Happy Prince'),
  ], { note: '場所を先に見せる倒置。通常の骨格は the statue stood です。' }),
  sceneGuide([
    role('S', 'He'), role('V', 'was gilded'), role('M', 'all over'),
    role('M', 'with thin leaves of fine gold'), role('M', 'for eyes'),
    role('S', 'he'), role('V', 'had'), role('O', 'two bright sapphires'),
    role('LINK', 'and'), role('S', 'a large red ruby'), role('V', 'glowed'),
    role('M', 'on his sword-hilt'),
  ], { note: 'セミコロン相当の三つの描写を、金箔→目→剣の柄の順に追います。' }),
  sceneGuide([
    role('S', 'He'), role('V', 'was'), role('M', 'very much'), role('V', 'admired'), role('M', 'indeed'),
  ], { note: 'was admired は受け身で、「人々が彼を称賛した」を像の側から述べています。' }),
  sceneGuide([
    role('S', 'He'), role('V', 'is'), role('C', 'as beautiful'), role('LINK', 'as'),
    role('C', 'a weathercock'), role('V', 'remarked'), role('S', 'one of the Town Councillors'),
    role('S', 'who'), role('V', 'wished'), role('O', 'to gain a reputation'),
    role('M', 'for having artistic tastes'),
  ], { note: 'as ... as の比較のあとに発言者が続き、who 以下がその人物の見栄を説明します。' }),
  sceneGuide([
    role('LINK', 'Only'), role('C', 'not quite so useful'), role('S', 'he'),
    role('V', 'added'), role('M', 'fearing'), role('LINK', 'lest'),
    role('S', 'people'), role('V', 'should think'), role('O', 'him'), role('C', 'unpractical'),
  ], { note: '引用部は He is が省略された補足。lest 以下は「そう思われるといけないので」という理由です。' }),
  sceneGuide([
    role('LINK', 'Why'), role('V', 'can’t'), role('S', 'you'), role('V', 'be'),
    role('C', 'like the Happy Prince'), role('V', 'asked'), role('S', 'a sensible mother'),
    role('M', 'of her little boy'), role('S', 'who'), role('V', 'was crying'), role('M', 'for the moon'),
  ], { note: '疑問文のあとに asked＋発言者。who 以下は little boy を説明します。' }),
  sceneGuide([
    role('S', 'The Happy Prince'), role('M', 'never'), role('V', 'dreams'),
    role('M', 'of crying'), role('M', 'for anything'),
  ], { note: 'never dreams of ... は「…など夢にも思わない」という強い否定です。' }),
  sceneGuide([
    role('S', 'I'), role('V', 'am'), role('C', 'glad'), role('LINK', 'there'),
    role('V', 'is'), role('S', 'some one'), role('M', 'in the world'),
    role('S', 'who'), role('V', 'is'), role('C', 'quite happy'),
    role('V', 'muttered'), role('S', 'a disappointed man'), role('LINK', 'as'),
    role('S', 'he'), role('V', 'gazed'), role('M', 'at the wonderful statue'),
  ], { note: '発言内容・発言者・as の同時動作という三層です。who は some one を説明します。' }),
])

const MAGI_SCENES = Object.freeze([
  sceneGuide([
    role('C', 'One dollar and eighty-seven cents'), role('S', 'That'), role('V', 'was'), role('C', 'all'),
  ], { note: '最初は金額だけの断片。その金額を That で受け、That was all と断定します。' }),
  sceneGuide([
    role('LINK', 'And'), role('S', 'sixty cents of it'), role('V', 'was'), role('C', 'in pennies'),
  ], { note: 'And で前の金額へ追い打ちをかけ、しかも大半が小銭だったと示します。' }),
  sceneGuide([
    role('S', 'Pennies'), role('V', 'saved'), role('M', 'one and two at a time'),
    role('M', 'by bulldozing'), role('O', 'the grocer'), role('LINK', 'and'),
    role('O', 'the vegetable man'), role('LINK', 'and'), role('O', 'the butcher'),
    role('LINK', 'until'), role('S', 'one’s cheeks'), role('V', 'burned'),
    role('M', 'with the silent imputation'), role('M', 'of parsimony'),
    role('O', 'that'), role('S', 'such close dealing'), role('V', 'implied'),
  ], { note: 'Pennies (were) saved と受け身の were が省略された断片から、until 節へ伸びる一文です。' }),
  sceneGuide([
    role('M', 'Three times'), role('S', 'Della'), role('V', 'counted'), role('O', 'it'),
    role('C', 'One dollar and eighty-seven cents'), role('LINK', 'And'),
    role('S', 'the next day'), role('V', 'would be'), role('C', 'Christmas'),
  ], { note: '数え直す動作→金額の反復→翌日はクリスマス、という短文三段で切迫感を作ります。' }),
  sceneGuide([
    role('LINK', 'There'), role('V', 'was'), role('M', 'clearly'), role('S', 'nothing'),
    role('M', 'to do'), role('LINK', 'but'), role('V', 'flop down'),
    role('M', 'on the shabby little couch'), role('LINK', 'and'), role('V', 'howl'),
    role('LINK', 'So'), role('S', 'Della'), role('V', 'did'), role('O', 'it'),
  ], { note: 'nothing to do but ... は「…するほかない」。最後の短文が語り手のユーモアです。' }),
  sceneGuide([
    role('S', 'Which'), role('V', 'instigates'), role('O', 'the moral reflection'),
    role('LINK', 'that'), role('S', 'life'), role('V', 'is made up'),
    role('M', 'of sobs sniffles and smiles'), role('M', 'with sniffles predominating'),
  ], { note: 'Which は直前の泣く行動全体を受けます。that 以下が reflection の内容です。' }),
  sceneGuide([
    role('LINK', 'While'), role('S', 'the mistress'), role('M', 'of the home'),
    role('V', 'is'), role('M', 'gradually'), role('V', 'subsiding'),
    role('M', 'from the first stage to the second'), role('V', 'take'),
    role('O', 'a look'), role('M', 'at the home'),
  ], { note: 'While 節のあと、主節は命令文 take a look。主語 you は省略されています。' }),
  sceneGuide([
    role('C', 'A furnished flat'), role('M', 'at $8 per week'),
  ], {
    allowVerbOmission: true,
    note: 'Vなし：A furnished flat ... という名詞句だけで部屋を提示する、文体上の断片です。',
  }),
])

export const LITERATURE_READING_GUIDES = Object.freeze({
  lit_en_moby_dick_water_gazers: MOBY_DICK_SCENES,
  lit_en_pride_prejudice_netherfield: PRIDE_PREJUDICE_SCENES,
  lit_en_tale_two_cities_times: TALE_TWO_CITIES_SCENES,
  lit_en_alice_rabbit_hole: ALICE_SCENES,
  lit_en_happy_prince_statue: HAPPY_PRINCE_SCENES,
  lit_en_gift_of_magi_opening: MAGI_SCENES,
})

export const LITERATURE_READING_QUESTIONS = Object.freeze({
  lit_en_moby_dick_water_gazers: Object.freeze([
    question('moby-q1', 'What direction do the streets of the Manhattoes seem to take people?', [
      'Toward the green fields.',
      'Toward the water.',
      'Toward the northern mountains.',
      'Toward the market counters.',
    ], 1, '第2場面の the streets take you waterward が、通りが人を水辺へ導くと明示しています。', 1),
    question('moby-q2', 'What do the many different people around the waterfront have in common?', [
      'They are sailors returning from China.',
      'They are selling goods at the warehouses.',
      'They are landsmen whose attention is fixed on the sea.',
      'They are searching for green fields.',
    ], 2, '第3〜5場面では姿勢や仕事は違っても、all landsmen が ocean reveries に心を奪われています。', 4),
    question('moby-q3', 'What does the final question suggest about the sea?', [
      'It attracts people with a force compared to magnetism.',
      'It is dangerous because every compass is broken.',
      'It separates people arriving from different directions.',
      'It matters only to those who work on ships.',
    ], 0, '最終場面は羅針盤の magnetic virtue を持ち出し、海の引力を磁力になぞらえています。', 7),
  ]),
  lit_en_pride_prejudice_netherfield: Object.freeze([
    question('pride-q1', 'Whose assumption is presented as a “truth” in the opening?', [
      'The wealthy man’s private wish.',
      'The surrounding families’ belief that he should marry one of their daughters.',
      'Mr. Bennet’s plan to rent Netherfield Park.',
      'Mrs. Long’s decision to move north.',
    ], 1, '第2場面で this truth は surrounding families の心に根づき、男性を娘の相手と見なす考えだと分かります。', 1),
    question('pride-q2', 'Why does Mrs. Bennet know so much about the new tenant?', [
      'Mr. Morris wrote directly to her.',
      'Her husband had already visited him.',
      'Mrs. Long had just visited and told her about it.',
      'One of her daughters had rented the house.',
    ], 2, '第4場面の Mrs. Long has just been here, and she told me all about it が情報源です。', 3),
    question('pride-q3', 'What most clearly reveals Mrs. Bennet’s interest in the news?', [
      'She asks whether the house has a garden.',
      'She repeats that Bingley came from northern England.',
      'She calls his arrival a fine thing for their girls.',
      'She objects to hearing any more details.',
    ], 2, '最後の What a fine thing for our girls! が、娘たちの結婚を期待する夫人の狙いを直接示します。', 7),
  ]),
  lit_en_tale_two_cities_times: Object.freeze([
    question('cities-q1', 'How does the narrator first describe the period?', [
      'By giving only a list of its achievements.',
      'By pairing opposite descriptions of the same time.',
      'By comparing England with ancient Greece.',
      'By explaining one ruler’s private thoughts.',
    ], 1, '第1〜3場面では best / worst、wisdom / foolishness など正反対の語を同じ時代へ重ねています。', 0),
    question('cities-q2', 'What attitude does the phrase “superlative degree ... only” criticize?', [
      'Refusing to compare the past with the present.',
      'Describing a complex period only in extreme terms.',
      'Using dates instead of seasons.',
      'Trusting every spiritual revelation.',
    ], 1, '第1場面は good / evil のどちらでも最上級だけで評価する論者を皮肉り、単純な時代像を批判します。', 0),
    question('cities-q3', 'What did the rulers of both countries believe?', [
      'That the existing order would remain settled for ever.',
      'That every citizen should move to the capital.',
      'That England and France should share one throne.',
      'That London had already disappeared.',
    ], 0, '第3場面の things in general were settled for ever が、支配する側の思い込みを示します。', 2),
  ]),
  lit_en_alice_rabbit_hole: Object.freeze([
    question('alice-q1', 'Why was Alice becoming tired?', [
      'She had been running across the field.',
      'She had nothing to do and the book lacked pictures and conversations.',
      'Her sister would not let her read.',
      'The Rabbit had taken her watch.',
    ], 1, '第1・2場面では、することがなく、本に絵も会話もないことが退屈の理由です。', 1),
    question('alice-q2', 'What finally made Alice start to her feet?', [
      'The Rabbit spoke to her sister.',
      'The book fell into the river.',
      'The Rabbit took out a watch, looked at it, and hurried on.',
      'She heard someone call her name.',
    ], 2, '時計を取り出して時刻を見て急いだ、という普通ではない三つの動作が決め手です。', 4),
    question('alice-q3', 'What did Alice fail to consider before following the Rabbit?', [
      'How she would get out again.',
      'Whether the Rabbit could speak.',
      'Where her sister had gone.',
      'How late it had become.',
    ], 0, '最後の never once considering 以下が、出口を考えなかったことを明示します。', 6),
  ]),
  lit_en_happy_prince_statue: Object.freeze([
    question('prince-q1', 'Where did the statue of the Happy Prince stand?', [
      'Inside the Town Hall.',
      'Beside a weathercock.',
      'High above the city on a tall column.',
      'Near the little boy’s home.',
    ], 2, '冒頭の場所表現 High above the city, on a tall column が根拠です。', 0),
    question('prince-q2', 'Why did the Councillor add “not quite so useful”?', [
      'He wanted the statue to be removed.',
      'He feared people might think him unpractical.',
      'He disliked artistic tastes.',
      'He believed the statue was crying.',
    ], 1, 'fearing lest ... が発言を付け足した理由を表しています。', 4),
    question('prince-q3', 'What do the speakers have in common in this passage?', [
      'They know how the Prince truly feels.',
      'They judge happiness or value mainly from appearance and their own concerns.',
      'They all want the Prince’s jewels.',
      'They have met the Prince in person.',
    ], 1, '人々は像の外見や自分の都合から「幸福」「有用」を決め、王子の内面はまだ知りません。', 7),
  ]),
  lit_en_gift_of_magi_opening: Object.freeze([
    question('magi-q1', 'How much money did Della have?', [
      'Sixty cents.',
      'Eight dollars.',
      'One dollar and eighty-seven cents.',
      'Eighty-seven dollars.',
    ], 2, '冒頭と第4場面で One dollar and eighty-seven cents が反復されます。', 0),
    question('magi-q2', 'How had many of the pennies been saved?', [
      'By bargaining at the grocer, vegetable seller, and butcher.',
      'By selling the furnished flat.',
      'By working for the Town Councillor.',
      'By finding coins under the couch.',
    ], 0, 'by bulldozing ... は、店で一度に1、2セントずつ値切ったことを表します。', 2),
    question('magi-q3', 'What is the main effect of the repeated amount and short fragments?', [
      'They make the home seem luxurious.',
      'They hide when Christmas will arrive.',
      'They stress Della’s poverty and emotional pressure.',
      'They show that Della cannot count.',
    ], 2, '金額の反復と短い断片は、わずかな所持金とクリスマス前日の切迫感を強めます。', 3),
  ]),
})

export function getLiteratureReadingGuide(workId, sceneIndex) {
  return LITERATURE_READING_GUIDES[workId]?.[sceneIndex] ?? null
}

export function getLiteratureReadingQuestions(workId) {
  return LITERATURE_READING_QUESTIONS[workId] ?? Object.freeze([])
}
