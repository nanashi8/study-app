// 既存の語源カードへ結び直した、再監査ぶんの明示リンク。
//
// 語源カードは語根ごとの許可リストで運用しているため、同じ語源の語が
// 後から収録されても自動では載らない。そこで
//  1) 各語の語源メモが、カードの由来文と同じラテン語・ギリシャ語の語を
//     挙げているのに未リンクの語（例: condition ← dicere、omit ← mittere）
//  2) カード収録語の素直な派生形なのに漏れていた語（例: acceptable ← accept）
// を機械的に洗い出し、1語ずつ辞書で確かめて採用した。
//
// 採用しなかった主な候補（同綴・別語源のため）:
//   adjacent（iacēre「横たわる」。iacere「投げる」とは別動詞）、
//   suppose / impose / oppose / dispose / depose / purpose / pose
//     （古フランス語 poser 経由。pōnere の確定的な同根語としては出さない既存方針）、
//   former（古英語 forma。ラテン語 forma とは別語）、
//   library（liber「本」。liber「自由な」とは同綴の別語）、
//   pass / compass / pace（passus「歩み」であって patī「耐える」ではない）、
//   severity（severus「厳しい」。separāre とは別語）、
//   traitor（trādere「引き渡す」。trahere「引く」とは別語）、
//   tender（tener「柔らかい」）、glower（中英語 gloren「にらむ」）、
//   main（古英語 mægen「力」。ラテン語 magnus とは別語）。

export const AUDITED_LINK_WORDS = Object.freeze({
  anim: Object.freeze(['equanimity', 'magnanimous', 'pusillanimous']),
  ann: Object.freeze(['millennium']),
  aud: Object.freeze(['obey']),
  bene: Object.freeze(['benign']),
  bio: Object.freeze(['microbe', 'microbes']),
  caput: Object.freeze(['achievement', 'chiefly']),
  cept: Object.freeze(['acceptable', 'conceive', 'deceive', 'perceive', 'receipt', 'recover', 'recuperate']),
  cess: Object.freeze(['ancestor', 'concede', 'precede', 'precedent', 'recede']),
  cid: Object.freeze(['cadence', 'case', 'chance']),
  claim: Object.freeze(['acclaim']),
  cord: Object.freeze(['accordingly']),
  cred: Object.freeze(['accreditation']),
  cura: Object.freeze(['procurement', 'securely', 'surely']),
  curr: Object.freeze(['incur', 'recur']),
  dem: Object.freeze(['demagogue']),
  dict: Object.freeze(['condition', 'edict', 'jurisdiction']),
  duct: Object.freeze(['subdue']),
  dur: Object.freeze(['dour']),
  equ: Object.freeze(['iniquity']),
  fact: Object.freeze(['amplify', 'artifice', 'artificial', 'certificate', 'certify', 'clarify', 'defeat', 'feasible', 'feat', 'justify', 'magnificent', 'magnify', 'malefactor', 'modify', 'mollify', 'mortify', 'notify', 'nullify', 'ossify', 'pacific', 'pacify', 'profit', 'prolific', 'qualify', 'ratify', 'rectify', 'sacrifice', 'sanctify', 'satisfy', 'specify', 'verify']),
  fer: Object.freeze(['differently', 'proliferate', 'vociferate', 'vociferous']),
  fid: Object.freeze(['defy']),
  form: Object.freeze(['uniform']),
  fract: Object.freeze(['infringe']),
  fus: Object.freeze(['confound']),
  'ge-drive': Object.freeze(['drifter']),
  'ge-en': Object.freeze(['broadening', 'frightened', 'frightening', 'heightened', 'lessened', 'maddening', 'shortened', 'threatening', 'weakened', 'widening']),
  'ge-ful': Object.freeze(['carefully', 'gleefully', 'joyfully', 'peacefully']),
  'ge-full': Object.freeze(['filled', 'fulfilled']),
  'ge-glow': Object.freeze(['glowing']),
  'ge-grow': Object.freeze(['grower']),
  'ge-less': Object.freeze(['endlessly']),
  'ge-one': Object.freeze(['atonement']),
  grad: Object.freeze(['degree', 'ingredient']),
  graph: Object.freeze(['calligraphy']),
  her: Object.freeze(['hesitantly']),
  junct: Object.freeze(['juncture']),
  lect: Object.freeze(['election', 'intelligent', 'neglect']),
  lex: Object.freeze(['allegations', 'allegedly']),
  lig: Object.freeze(['league']),
  liter: Object.freeze(['letter']),
  long: Object.freeze(['longing']),
  manu: Object.freeze(['manage', 'mandate', 'manifest', 'manipulate', 'manner']),
  migr: Object.freeze(['emigrant', 'emigrate']),
  miss: Object.freeze(['emission', 'emit', 'omit', 'surmise']),
  mod: Object.freeze(['accommodate', 'mode']),
  mon: Object.freeze(['summon']),
  mono: Object.freeze(['monarch']),
  mot: Object.freeze(['emotional', 'mobile', 'momentum', 'mutiny']),
  nat: Object.freeze(['nascent']),
  nounce: Object.freeze(['enunciate']),
  numer: Object.freeze(['number']),
  nutri: Object.freeze(['nourishing', 'nurse']),
  oper: Object.freeze(['office']),
  ord: Object.freeze(['orderly']),
  pare: Object.freeze(['separately', 'several']),
  pel: Object.freeze(['appeal']),
  phon: Object.freeze(['cacophony', 'smartphone']),
  plere: Object.freeze(['accomplishment', 'completely', 'implementation']),
  plic: Object.freeze(['apply', 'imply', 'multiply', 'reply']),
  popul: Object.freeze(['people']),
  pos: Object.freeze(['compound']),
  punct: Object.freeze(['poignant', 'pungent']),
  quer: Object.freeze(['acquirement']),
  rect: Object.freeze(['erect']),
  rupt: Object.freeze(['erupt']),
  satis: Object.freeze(['asset']),
  scend: Object.freeze(['descendants', 'scan']),
  sed: Object.freeze(['obsession', 'reside', 'sedentary', 'session', 'supersede']),
  sens: Object.freeze(['scent']),
  sequ: Object.freeze(['execute', 'sue']),
  simil: Object.freeze(['simultaneously']),
  solus: Object.freeze(['sullen']),
  spect: Object.freeze(['despise', 'expectation', 'specimen']),
  spir: Object.freeze(['aspiration', 'aspire', 'expire']),
  sta: Object.freeze(['cost', 'existing', 'instantly', 'obstinate', 'stage', 'statement']),
  stinct: Object.freeze(['extinct', 'extinction', 'extinguish']),
  tact: Object.freeze(['attain', 'contamination']),
  tain: Object.freeze(['content', 'entertain', 'tenable', 'tenant']),
  tempor: Object.freeze(['tempo']),
  tend: Object.freeze(['portend']),
  terr: Object.freeze(['mediterranean']),
  ton: Object.freeze(['tone']),
  tort: Object.freeze(['torment']),
  typ: Object.freeze(['prototype', 'stereotype']),
  vad: Object.freeze(['evade']),
  val: Object.freeze(['ambivalent', 'equivalent', 'evaluate']),
  vent: Object.freeze(['circumvent']),
  veri: Object.freeze(['aver']),
  vers: Object.freeze(['aversion', 'avert', 'controversial', 'extrovert']),
  via: Object.freeze(['triviality']),
  vis: Object.freeze(['evidently']),
  volv: Object.freeze(['evolve', 'revolt', 'vault', 'voluble']),})
