// 英語の土着語（ゲルマン系）の語根・接辞カード。
//
// ラテン語・ギリシャ語の語根は「接頭辞＋語根＋接尾辞」の組み立てが綴りに残るが、
// 英語本来の語は母音交替と複合で語を作るため、同じ語源でも綴りがそろわない
// （sit / set / seat、grow / grass / green など）。そこで
//  1) 今も生きている土着の接頭辞・接尾辞
//  2) 綴りが違っても同じ古英語の語にさかのぼる語族
// の2つだけをカードにする。どちらも「初見の語の意味を推測できる」か
// 「別々に覚えていた語が1つにまとまる」ことを条件にした。
//
// カードに載せる語の範囲:
// - 接辞カードは、その接辞が最後の派生になっている語だけを載せる。借用語幹との
//   混成語（misinterpret, unreasonable など）は接辞が土着なので入れるが、
//   さらに複合しただけの語（wavelength, commonwealth）は元の語と重ねない。
// - 語族カードは語そのものが土着の語に限る。同じ語根から育った複合語
//   （birthday, bystander, sunset）は、語族のつながりを見せるので入れる。
//
// 重要:
// - 語根の意味・由来は Online Etymology Dictionary と Wiktionary の見出しで
//   確認した事実だけを短く書く。
// - 紐づく単語は綴りの自動推測ではなく、1語ずつ辞書で系統を確かめた明示リスト。
// - LEARNING_ROOTS と違って形態素オートリンクの対象にはしない。
//
// 綴りが似ているだけで別語源のため、意図的に外した語（誤接続の再発防止）:
//   outrage / overt / betray / forfeit（古フランス語）、mischief / misnomer（フランス語 mes-）、
//   miserable / misery / missile / misanthrope（ラテン語 miser・mittere / ギリシャ語 misos）、
//   reward / award / coward（古フランス語）、uproar（オランダ語 oproer）、
//   less / unless / nevertheless / nonetheless（古英語 lǣssa。接尾辞 -less とは別語）、
//   harness（古フランス語 harneis）、random（古フランス語 randon）、
//   because（by + cause）、forever（for + ever）、beckon（bēacen「合図」）、
//   foreign / forest（ラテン語 foris）、unique / union / unit / universe（ラテン語 ūnus）、
//   uncle / until（un- ではない）、ward（古英語 weard「見張り」。接尾辞 -ward とは別語）。

export const GERMANIC_ROOTS = Object.freeze([
  // ── 土着の接頭辞 ──
  Object.freeze({ id: 'ge-be', form: 'be-', meaning: 'すっかり・〜にする', origin: '古英語 be-「まわりに・すっかり」', emoji: '🔄' }),
  Object.freeze({ id: 'ge-for', form: 'for-', meaning: '離れて・打ち消し', origin: '古英語 for-「離れて・すっかり」', emoji: '🚫' }),
  Object.freeze({ id: 'ge-fore', form: 'fore- / forth', meaning: '前に・前もって', origin: '古英語 fore「前に」', emoji: '⏩' }),
  Object.freeze({ id: 'ge-with', form: 'with-', meaning: '逆らって・後ろへ', origin: '古英語 wið「〜に向かって・逆らって」', emoji: '🛡️' }),
  Object.freeze({ id: 'ge-out', form: 'out-', meaning: '外へ・〜より勝って', origin: '古英語 ūt「外へ」', emoji: '🚪' }),
  Object.freeze({ id: 'ge-over', form: 'over-', meaning: '上に・越えて・過度に', origin: '古英語 ofer「上に・越えて」', emoji: '🔝' }),
  Object.freeze({ id: 'ge-under', form: 'under-', meaning: '下に・足りない', origin: '古英語 under「下に」', emoji: '⬇️' }),
  Object.freeze({ id: 'ge-up', form: 'up-', meaning: '上へ・すっかり', origin: '古英語 up「上へ」', emoji: '⬆️' }),
  Object.freeze({ id: 'ge-mis', form: 'mis-', meaning: '誤って・悪く', origin: '古英語・古ノルド語 mis-「誤って」', emoji: '❌' }),
  Object.freeze({ id: 'ge-un', form: 'un-', meaning: '〜でない', origin: '古英語 un-「〜でない」', emoji: '🚷' }),
  Object.freeze({ id: 'ge-a', form: 'a-', meaning: '〜の状態で', origin: '古英語 on「〜の上に・〜の状態で」', emoji: '🌀' }),

  // ── 土着の接尾辞 ──
  Object.freeze({ id: 'ge-ship', form: '-ship', meaning: '状態・身分・技量', origin: '古英語 -scipe「〜である状態」', emoji: '🎖️' }),
  Object.freeze({ id: 'ge-hood', form: '-hood', meaning: '状態・身分', origin: '古英語 hād「身分・状態」', emoji: '🏘️' }),
  Object.freeze({ id: 'ge-dom', form: '-dom', meaning: '状態・領域', origin: '古英語 dōm「判断・定め」', emoji: '👑' }),
  Object.freeze({ id: 'ge-th', form: '-th', meaning: '（形・動詞から）〜であること', origin: '古英語 -þu「〜であること」', emoji: '📏' }),
  Object.freeze({ id: 'ge-en', form: '-en', meaning: '〜にする・〜になる', origin: '古英語 -nian「〜にする」', emoji: '🔧' }),
  Object.freeze({ id: 'ge-ward', form: '-ward', meaning: '〜の方へ', origin: '古英語 -weard「〜の方を向いた」', emoji: '🧭' }),
  Object.freeze({ id: 'ge-some', form: '-some', meaning: '〜させる・〜しがちな', origin: '古英語 -sum「〜の性質を持つ」', emoji: '😖' }),
  Object.freeze({ id: 'ge-less', form: '-less', meaning: '〜がない', origin: '古英語 lēas「欠いた」', emoji: '🕳️' }),
  Object.freeze({ id: 'ge-ful', form: '-ful', meaning: '〜に満ちた', origin: '古英語 full「満ちた」', emoji: '🥣' }),
  Object.freeze({ id: 'ge-ness', form: '-ness', meaning: '〜であること', origin: '古英語 -nes「〜の状態」', emoji: '📦' }),

  // ── 綴りが違っても同じ語にさかのぼる語族 ──
  Object.freeze({ id: 'ge-sit', form: 'sit / set / seat', meaning: '座る・据える', origin: '古英語 sittan「座る」/ settan「据える」（saddle・nest も同じ「座る」の語根）', emoji: '🪑' }),
  Object.freeze({ id: 'ge-rise', form: 'rise / raise', meaning: '昇る・上げる', origin: '古英語 rīsan「昇る」/ 古ノルド語 reisa「立たせる」', emoji: '🌅' }),
  Object.freeze({ id: 'ge-stand', form: 'stand', meaning: '立つ', origin: '古英語 standan「立つ」', emoji: '🧍' }),
  Object.freeze({ id: 'ge-know', form: 'know', meaning: '知る', origin: '古英語 cnāwan「知る」', emoji: '💡' }),
  Object.freeze({ id: 'ge-wit', form: 'wit / wis', meaning: '知る・賢い', origin: '古英語 witan「知る」/ wīs「賢い」', emoji: '🦉' }),
  Object.freeze({ id: 'ge-tell', form: 'tell / tale', meaning: '数える・語る', origin: '古英語 tellan「数える・語る」', emoji: '🗣️' }),
  Object.freeze({ id: 'ge-think', form: 'think / thank', meaning: '思う・考える', origin: '古英語 þencan「考える」/ þancian「礼を言う」', emoji: '🧠' }),
  Object.freeze({ id: 'ge-speak', form: 'speak / speech', meaning: '話す', origin: '古英語 sprecan「話す」', emoji: '💬' }),
  Object.freeze({ id: 'ge-bear', form: 'bear / birth', meaning: '運ぶ・産む', origin: '古英語 beran「運ぶ・産む」（birth は同じ語根の古ノルド語形）', emoji: '👶' }),
  Object.freeze({ id: 'ge-whole', form: 'whole / heal / holy', meaning: '欠けがない・健全', origin: '古英語 hāl「無傷の・健全な」', emoji: '💚' }),
  Object.freeze({ id: 'ge-full', form: 'full / fill', meaning: '満ちる・満たす', origin: '古英語 full「いっぱいの」/ fyllan「満たす」', emoji: '🫗' }),
  Object.freeze({ id: 'ge-food', form: 'food / feed', meaning: '食べ物・養う', origin: '古英語 fōda「食べ物」/ fēdan「養う」', emoji: '🍽️' }),
  Object.freeze({ id: 'ge-blood', form: 'bleed / bless', meaning: '血', origin: '古英語 blōd「血」（bless は血で清める儀式から）', emoji: '🩸' }),
  Object.freeze({ id: 'ge-drink', form: 'drink / drench', meaning: '飲む', origin: '古英語 drincan「飲む」', emoji: '🥤' }),
  Object.freeze({ id: 'ge-grow', form: 'grow / grass / green', meaning: '育つ・緑', origin: '古英語 grōwan「育つ」/ græs「草」', emoji: '🌱' }),
  Object.freeze({ id: 'ge-two', form: 'two / twi-', meaning: '2', origin: '古英語 twā「2」', emoji: '✌️' }),
  Object.freeze({ id: 'ge-one', form: 'one / -one', meaning: '1', origin: '古英語 ān「1つの」', emoji: '☝️' }),
  Object.freeze({ id: 'ge-break', form: 'break / breach', meaning: '壊す・破る', origin: '古英語 brecan「壊す」', emoji: '💥' }),
  Object.freeze({ id: 'ge-drive', form: 'drive / drift', meaning: '駆り立てる', origin: '古英語 drīfan「駆る」（drift は同じ語根の古ノルド語形）', emoji: '🚗' }),
  Object.freeze({ id: 'ge-strike', form: 'strike / stroke', meaning: '打つ・なでる', origin: '古英語 strīcan「なでる・打つ」', emoji: '✊' }),
  Object.freeze({ id: 'ge-choose', form: 'choose / choice', meaning: '選ぶ', origin: '古英語 cēosan「選ぶ」（choice は同じゲルマン語根が古フランス語を経た形）', emoji: '🔀' }),
  Object.freeze({ id: 'ge-shade', form: 'shade / shadow', meaning: '影', origin: '古英語 sceadu「影」', emoji: '🌑' }),
  Object.freeze({ id: 'ge-glow', form: 'gl-', meaning: '光る', origin: '古英語 glōwan「輝く」/ glæs「ガラス」など gl- の語群', emoji: '✨' }),
  Object.freeze({ id: 'ge-bind', form: 'bind / bond', meaning: '結ぶ', origin: '古英語 bindan「縛る」（bond は同じ語根の古ノルド語形）', emoji: '🪢' }),
  Object.freeze({ id: 'ge-ride', form: 'ride / road', meaning: '乗って行く', origin: '古英語 rīdan「馬で行く」', emoji: '🐎' }),
])

// 語根ごとの確認済み単語。ここに書いた語だけが語源カードへ載る。
export const GERMANIC_ROOT_WORDS = Object.freeze({
  // be- ＝ すっかり・〜にする（古英語 be-）
  'ge-be': Object.freeze(['become', 'becoming', 'before', 'begin', 'beginner', 'beginning', 'behave', 'behavior', 'behind', 'belabor', 'belie', 'belief', 'believable', 'believe', 'believer', 'belong', 'belongings', 'below', 'bemoan', 'bequeath', 'bequest', 'bereft', 'beset', 'beside', 'besides', 'bestow', 'beguile', 'behalf', 'between', 'bewilder', 'beyond']),
  // for- ＝ 離れて・打ち消し（古英語 for-）
  'ge-for': Object.freeze(['forbearance', 'forbid', 'forget', 'forgettable', 'forgive', 'forgiveness', 'forgiving', 'forgo', 'forsake']),
  // fore- / forth ＝ 前に・前もって（古英語 fore）
  'ge-fore': Object.freeze(['forebears', 'forecast', 'forefathers', 'forehead', 'foreman', 'foremost', 'forerunner', 'foresee', 'foresight', 'forestall', 'foretell', 'forth', 'forward']),
  // with- ＝ 逆らって・後ろへ（古英語 wið）
  'ge-with': Object.freeze(['withdraw', 'withdrawal', 'withhold', 'within', 'without', 'withstand']),
  // out- ＝ 外へ・〜より勝って（古英語 ūt）
  'ge-out': Object.freeze(['outbreak', 'outcome', 'outcry', 'outdate', 'outdated', 'outdo', 'outdoor', 'outfit', 'outflow', 'outlast', 'outlay', 'outlet', 'outline', 'outlive', 'outlook', 'outnumber', 'output', 'outright', 'outside', 'outsider', 'outspoken', 'outstanding', 'outweigh']),
  // over- ＝ 上に・越えて・過度に（古英語 ofer）
  'ge-over': Object.freeze(['overall', 'overcast', 'overcome', 'overconsumption', 'overdo', 'overeating', 'overflow', 'overhaul', 'overhear', 'overjoyed', 'overlap', 'overlook', 'overpower', 'overpowering', 'override', 'overrun', 'overseas', 'oversee', 'overseer', 'oversight', 'overtake', 'overthrow', 'overturn', 'overweight', 'overwhelm', 'overwhelming', 'overwhelmingly']),
  // under- ＝ 下に・足りない（古英語 under）
  'ge-under': Object.freeze(['under', 'underestimate', 'undergo', 'undergraduate', 'underground', 'underlie', 'underling', 'underlying', 'undermine', 'understand', 'understanding', 'undertake', 'undertaking', 'underwater', 'underwear', 'underweight']),
  // up- ＝ 上へ・すっかり（古英語 up）
  'ge-up': Object.freeze(['upbeat', 'upbraid', 'upbringing', 'update', 'upgrade', 'upheaval', 'uphold', 'upkeep', 'uplift', 'upload', 'upright', 'uprising', 'upset', 'upsetting', 'uptight']),
  // mis- ＝ 誤って・悪く（古英語・古ノルド語 mis-）
  'ge-mis': Object.freeze(['misconception', 'misfortune', 'misguide', 'misguided', 'mishandle', 'misinformation', 'misinterpret', 'mislaid', 'mislead', 'misleading', 'mismanage', 'mismatched', 'misplaced', 'misread', 'mistake', 'mistaken', 'mistreat', 'misunderstand', 'misunderstanding', 'misuse']),
  // un- ＝ 〜でない（古英語 un-）
  'ge-un': Object.freeze(['unabridged', 'unacceptable', 'unafraid', 'unapologetic', 'unarmed', 'unauthorized', 'unaware', 'unbearable', 'unbecoming', 'unbelievable', 'unbroken', 'uncaring', 'uncertain', 'uncertainty', 'unchanging', 'unclear', 'uncomfortable', 'uncommitted', 'uncommon', 'unconcerned', 'unconfirmed', 'unconnected', 'unconscious', 'unconsciousness', 'unconstitutional', 'uncontrolled', 'unconventional', 'unconvincing', 'uncooperative', 'uncut', 'undamaged', 'undecided', 'undoubtedly', 'unduly', 'undying', 'unease', 'uneasy', 'unemotional', 'unemployment', 'unequal', 'uneven', 'unevenly', 'unexpected', 'unfair', 'unfairness', 'unfaithful', 'unfamiliar', 'unfavorable', 'unfinished', 'unfit', 'unflattering', 'unforgettable', 'unforgiving', 'unfortunate', 'unfortunately', 'unfulfilled', 'ungodly', 'unhappy', 'unharmed', 'unhelpful', 'unhurried', 'unhurt', 'unimaginative', 'unimpressive', 'uninformed', 'uninspired', 'unintended', 'unintentional', 'unintentionally', 'unjust', 'unknown', 'unlawful', 'unlikely', 'unlimited', 'unlucky', 'unmatched', 'unoccupied', 'unofficial', 'unorthodox', 'unpleasant', 'unpopular', 'unprecedented', 'unpredictable', 'unprocessed', 'unproductive', 'unreal', 'unreasonable', 'unreasonably', 'unrelated', 'unrepentant', 'unresolved', 'unrestrained', 'unrivaled', 'unruly', 'unsanitary', 'unscathed', 'unseemly', 'unsightly', 'unskilled', 'unstable', 'unsteady', 'unsuccessful', 'unsuitable', 'unsure', 'untenable', 'untidy', 'untouched', 'untoward', 'untrue', 'untruth', 'unusual', 'unwanted', 'unwell', 'unwieldy', 'unwilling', 'unwillingly', 'unwitting', 'unyielding']),
  // a- ＝ 〜の状態で（古英語 on）
  'ge-a': Object.freeze(['abroad', 'ahead', 'alive', 'amid', 'among', 'away']),

  // -ship ＝ 状態・身分・技量（古英語 -scipe）
  'ge-ship': Object.freeze(['apprenticeship', 'companionship', 'dictatorship', 'entrepreneurship', 'fellowship', 'friendship', 'hardship', 'internship', 'leadership', 'ownership', 'partnership', 'relationship', 'scholarship', 'township', 'worship']),
  // -hood ＝ 状態・身分（古英語 hād）
  'ge-hood': Object.freeze(['falsehood', 'neighborhood']),
  // -dom ＝ 状態・領域（古英語 dōm）
  'ge-dom': Object.freeze(['boredom', 'freedom', 'kingdom', 'wisdom']),
  // -th ＝ 形容詞・動詞から名詞をつくる（古英語 -þu）。母音が変わる語が多い。
  'ge-th': Object.freeze(['birth', 'breadth', 'death', 'depth', 'filth', 'growth', 'health', 'length', 'mirth', 'sloth', 'strength', 'truth', 'warmth', 'wealth', 'width']),
  // -en ＝ 〜にする・〜になる（古英語 -nian）
  'ge-en': Object.freeze(['awaken', 'brighten', 'broaden', 'dampen', 'fasten', 'flatten', 'frighten', 'hasten', 'heighten', 'lengthen', 'lessen', 'lighten', 'loosen', 'madden', 'quicken', 'shorten', 'straighten', 'strengthen', 'threaten', 'tighten', 'weaken', 'widen', 'worsen']),
  // -ward ＝ 〜の方へ（古英語 -weard）
  'ge-ward': Object.freeze(['awkward', 'forward', 'straightforward', 'toward', 'untoward']),
  // -some ＝ 〜させる・〜しがちな（古英語 -sum）
  'ge-some': Object.freeze(['awesome', 'bothersome', 'cumbersome', 'fulsome', 'gruesome', 'irksome', 'nettlesome', 'wholesome', 'winsome']),
  // -less ＝ 〜がない（古英語 lēas「欠いた」）
  'ge-less': Object.freeze(['ageless', 'boundless', 'careless', 'cashless', 'ceaseless', 'countless', 'defenseless', 'effortless', 'endless', 'expressionless', 'fearless', 'feckless', 'flawless', 'fruitless', 'hapless', 'harmless', 'heartless', 'helpless', 'hopeless', 'limitless', 'listless', 'merciless', 'motionless', 'painless', 'peerless', 'penniless', 'powerless', 'priceless', 'reckless', 'regardless', 'relentless', 'remorseless', 'restless', 'ruthless', 'selfless', 'spotless', 'tactless', 'thoughtless', 'timeless', 'useless', 'wireless']),
  // -ful ＝ 〜に満ちた（古英語 full）
  'ge-ful': Object.freeze(['awful', 'baleful', 'beautiful', 'careful', 'cheerful', 'colorful', 'deceitful', 'delightful', 'disdainful', 'disgraceful', 'disrespectful', 'distrustful', 'doleful', 'doubtful', 'dreadful', 'faithful', 'fearful', 'forceful', 'fruitful', 'gleeful', 'graceful', 'grateful', 'harmful', 'helpful', 'hopeful', 'insightful', 'joyful', 'lawful', 'meaningful', 'merciful', 'mournful', 'painful', 'peaceful', 'plentiful', 'powerful', 'remorseful', 'resentful', 'respectful', 'restful', 'scornful', 'shameful', 'sinful', 'sorrowful', 'spiteful', 'successful', 'tactful', 'tasteful', 'thankful', 'thoughtful', 'unfaithful', 'unhelpful', 'unlawful', 'unsuccessful', 'useful', 'vengeful', 'wasteful', 'watchful', 'wonderful']),
  // -ness ＝ 〜であること（古英語 -nes）
  'ge-ness': Object.freeze(['aloofness', 'awareness', 'awkwardness', 'bitterness', 'boldness', 'brightness', 'business', 'cleanliness', 'clumsiness', 'coldness', 'consciousness', 'dampness', 'darkness', 'dryness', 'dullness', 'eagerness', 'emptiness', 'fairness', 'faithfulness', 'fondness', 'foolishness', 'forgiveness', 'frankness', 'friendliness', 'fullness', 'gentleness', 'goodness', 'greenness', 'happiness', 'harshness', 'hopefulness', 'hopelessness', 'idleness', 'illness', 'inventiveness', 'kindness', 'laziness', 'likeness', 'narrowness', 'nothingness', 'openness', 'pettiness', 'politeness', 'preparedness', 'readiness', 'recklessness', 'restlessness', 'rudeness', 'sadness', 'sameness', 'shyness', 'sickness', 'sluggishness', 'stillness', 'stubbornness', 'sturdiness', 'thankfulness', 'timeliness', 'tiredness', 'toughness', 'trustworthiness', 'ugliness', 'unconsciousness', 'unfairness', 'uniqueness', 'wastefulness', 'weakness', 'weariness', 'wickedness', 'wilderness', 'willingness', 'witness']),

  // sit / set / seat ＝ 座る・据える（古英語 sittan / settan）
  'ge-sit': Object.freeze(['nest', 'offset', 'saddle', 'seat', 'set', 'setting', 'settle', 'settlement', 'settler', 'sit', 'sunset', 'upset']),
  // rise / raise ＝ 昇る・上げる（古英語 rīsan）
  'ge-rise': Object.freeze(['arise', 'raise', 'raised', 'rise', 'sunrise', 'uprising']),
  // stand ＝ 立つ（古英語 standan）
  'ge-stand': Object.freeze(['bystander', 'misunderstand', 'outstanding', 'stand', 'standstill', 'understand', 'understanding', 'withstand']),
  // know ＝ 知る（古英語 cnāwan）
  'ge-know': Object.freeze(['acknowledge', 'acknowledgement', 'acknowledgment', 'know', 'knowledge', 'knowledgeable', 'unknown']),
  // wit / wis ＝ 知る・賢い（古英語 witan / wīs）
  'ge-wit': Object.freeze(['likewise', 'otherwise', 'wisdom', 'wise', 'wit', 'witness', 'witty', 'wizard']),
  // tell / tale ＝ 数える・語る（古英語 tellan）
  'ge-tell': Object.freeze(['foretell', 'storyteller', 'talk', 'talkative', 'tell']),
  // think / thank ＝ 思う・考える（古英語 þencan / þancian）
  'ge-think': Object.freeze(['thank', 'thankful', 'thankfulness', 'think', 'thought', 'thoughtful', 'thoughtless']),
  // speak / speech ＝ 話す（古英語 sprecan）
  'ge-speak': Object.freeze(['outspoken', 'speak', 'speaker', 'speech', 'spokesman']),
  // bear / birth ＝ 運ぶ・産む（古英語 beran）
  'ge-bear': Object.freeze(['bearable', 'bearer', 'birth', 'birthday', 'born', 'burden', 'forbearance']),
  // whole / heal / holy ＝ 欠けがない・健全（古英語 hāl）
  'ge-whole': Object.freeze(['heal', 'healing', 'health', 'healthy', 'holiday', 'holy', 'whole', 'wholesome', 'wholly']),
  // full / fill ＝ 満ちる・満たす（古英語 full / fyllan）
  'ge-full': Object.freeze(['fill', 'fulfill', 'fulfillment', 'full', 'fullness', 'refill']),
  // food / feed ＝ 食べ物・養う（古英語 fōda / fēdan）
  'ge-food': Object.freeze(['feed', 'food', 'foster']),
  // bleed / bless ＝ 血（古英語 blōd）
  'ge-blood': Object.freeze(['bleed', 'bless', 'blessed', 'blessing']),
  // drink / drench ＝ 飲む（古英語 drincan）
  'ge-drink': Object.freeze(['drench', 'drink', 'drown']),
  // grow / grass / green ＝ 育つ・緑（古英語 grōwan / græs）
  'ge-grow': Object.freeze(['grass', 'graze', 'green', 'greenery', 'grow', 'growth']),
  // two / twi- ＝ 2（古英語 twā）
  'ge-two': Object.freeze(['between', 'twelve', 'twenty', 'twice', 'twilight', 'twist', 'two']),
  // one / -one ＝ 1（古英語 ān）
  'ge-one': Object.freeze(['alone', 'anyone', 'atone', 'lonely', 'none', 'once', 'one', 'only']),
  // break / breach ＝ 壊す・破る（古英語 brecan）
  'ge-break': Object.freeze(['breach', 'break', 'breakdown', 'breakthrough', 'outbreak']),
  // drive / drift ＝ 駆り立てる（古英語 drīfan）
  'ge-drive': Object.freeze(['drift', 'drive', 'driven', 'driver']),
  // strike / stroke ＝ 打つ・なでる（古英語 strīcan）
  'ge-strike': Object.freeze(['strike', 'striking', 'strikingly', 'stroke']),
  // choose / choice ＝ 選ぶ（古英語 cēosan）
  'ge-choose': Object.freeze(['choice', 'choose', 'choosy']),
  // shade / shadow ＝ 影（古英語 sceadu）
  'ge-shade': Object.freeze(['shade', 'shadow', 'shady']),
  // gl- ＝ 光る（古英語 glōwan / glæs）
  'ge-glow': Object.freeze(['glare', 'glass', 'glimpse', 'glow']),
  // bind / bond ＝ 結ぶ（古英語 bindan）
  'ge-bind': Object.freeze(['bind', 'bond', 'bundle']),
  // ride / road ＝ 乗って行く（古英語 rīdan）
  'ge-ride': Object.freeze(['ride', 'road']),
})
