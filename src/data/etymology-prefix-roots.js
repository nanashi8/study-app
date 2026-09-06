// ラテン語・ギリシャ語の接頭辞カード。
//
// 既存の語根カードは語幹（portāre, dīcere …）だけを扱っていたため、
// suffocation の sub-、ideology の前半のように「語のもう半分」が出てこなかった。
// 接頭辞は初見の語の方向・否定・強弱を読み取る手がかりになるので、
// 土着の接辞（be- / un- / -th …）と同じ形でカードにする。
//
// 収録の条件（1か2を満たし、かつ綴りがその接頭辞の形＝同化形を含む＝で始まる語だけ）:
//  1) すでに語幹カードに入っている＝ラテン語・ギリシャ語の複合語だと確認済みの語。
//     語幹の綴りより前に残る部分が接頭辞と一致することまで確かめる。
//  2) 語源メモがその接頭辞を明示して分解している語（例:「ラテン ad(〜に)+plicare」）。
//     語幹側にカードが無い preliminary・superficial・paradox などはこちらで拾う。
// どちらも「接頭辞＋語幹」の分解が二重に裏づけされた語だけが載る。
//
// 例外的に手で確かめて足した語: suffocate / suffocation（sub- ＋ faucēs「喉」。
// faucēs から来た英語がこの1語族だけで、語幹側のカードを作れないため）。
//
// 綴りが似ているだけで接頭辞ではない語（監査で除外）:
//   republic / republican（rēs pūblica「公のもの」）、office / officer / official
//   （opus + facere）、diminish（de + minuere）、alarm（イタリア語 all'arme）、
//   empathy / endemic / energy / embryo / enzyme（ギリシャ語 en-）、exodus（ギリシャ語 ex-）、
//   problem / prophet（ギリシャ語 pro-）、dilemma（ギリシャ語 di-「2つ」）。ラテン語のカードには入れない。
//   into / inside / input / intake / inflow / income / insight / inborn / inmate / inland /
//   instead / indeed（英語の前置詞 in ＋ 英語の語。古英語 in であってラテン語 in- ではない）。
//   enemy（in-（否定）＋ amīcus だが綴りが en- になり接頭辞の形と合わないため、
//   語の成り立ちの台帳で受け持つ）。
// 語族が1つしかなく不採用: epi-（epidemic のみ）、post-（postpone / postponed のみ）。
//
// in- は「〜でない」と「中へ」の2語が同じ綴りになるため、意味で2枚に分けた。

// 同化形をふくむ、各接頭辞の綴り。収録語はここに書いた形のどれかで始まる。
export const PREFIX_VARIANTS = Object.freeze({
  'pf-ad': Object.freeze(['ad', 'ac', 'af', 'ag', 'al', 'an', 'ap', 'ar', 'as', 'at']),
  'pf-com': Object.freeze(['com', 'con', 'col', 'cor', 'co']),
  'pf-de': Object.freeze(['de']),
  'pf-dis': Object.freeze(['dis', 'dif', 'di']),
  'pf-ex': Object.freeze(['ex', 'ef', 'e']),
  'pf-in-into': Object.freeze(['in', 'im', 'il', 'ir', 'en', 'em']),
  'pf-in-not': Object.freeze(['in', 'im', 'il', 'ir']),
  'pf-inter': Object.freeze(['inter', 'intel']),
  'pf-ob': Object.freeze(['ob', 'oc', 'of', 'op']),
  'pf-per': Object.freeze(['per']),
  'pf-pre': Object.freeze(['pre']),
  'pf-pro': Object.freeze(['pro', 'por', 'pur']),
  'pf-re': Object.freeze(['re']),
  'pf-sub': Object.freeze(['sub', 'suc', 'suf', 'sug', 'sup', 'sus']),
  'pf-super': Object.freeze(['super', 'sur']),
  'pf-trans': Object.freeze(['trans', 'tran', 'tra']),
  'pf-se': Object.freeze(['se']),
  'pf-circum': Object.freeze(['circum']),
  'pf-contra': Object.freeze(['contra', 'contro', 'counter']),
  'pf-extra': Object.freeze(['extra', 'extro']),
  'pf-syn': Object.freeze(['syn', 'sym', 'syl']),
  'pf-dia': Object.freeze(['dia']),
  'pf-para': Object.freeze(['para']),
  'pf-anti': Object.freeze(['anti']),
})

export const PREFIX_ROOTS = Object.freeze([
  Object.freeze({ id: 'pf-ad', form: 'ad- / ac- / af- / at-', meaning: '〜の方へ・くっつく', origin: 'ラテン語 ad「〜の方へ」（次の子音に合わせて形が変わる）', emoji: '➡️' }),
  Object.freeze({ id: 'pf-com', form: 'com- / con- / col- / cor-', meaning: '共に・すっかり', origin: 'ラテン語 cum「共に」', emoji: '🤝' }),
  Object.freeze({ id: 'pf-de', form: 'de-', meaning: '下へ・離れて・すっかり', origin: 'ラテン語 de「下へ・離れて」', emoji: '⬇️' }),
  Object.freeze({ id: 'pf-dis', form: 'dis- / dif- / di-', meaning: '離れて・反対に', origin: 'ラテン語 dis「バラバラに」', emoji: '↔️' }),
  Object.freeze({ id: 'pf-ex', form: 'ex- / ef- / e-', meaning: '外へ・すっかり', origin: 'ラテン語 ex「外へ」', emoji: '📤' }),
  Object.freeze({ id: 'pf-in-into', form: 'in- / im- / en-', meaning: '中へ・上へ', origin: 'ラテン語 in「中へ・上に」', emoji: '📥' }),
  Object.freeze({ id: 'pf-in-not', form: 'in- / im- / il- / ir-', meaning: '〜でない', origin: 'ラテン語 in「〜でない」', emoji: '🚫' }),
  Object.freeze({ id: 'pf-inter', form: 'inter-', meaning: '間に・互いに', origin: 'ラテン語 inter「間に」', emoji: '↔️' }),
  Object.freeze({ id: 'pf-ob', form: 'ob- / oc- / of- / op-', meaning: '〜に向かって・逆らって', origin: 'ラテン語 ob「〜に向かって」', emoji: '🛑' }),
  Object.freeze({ id: 'pf-per', form: 'per-', meaning: '通して・すっかり', origin: 'ラテン語 per「通り抜けて」', emoji: '🕳️' }),
  Object.freeze({ id: 'pf-pre', form: 'pre- / prae-', meaning: '前に・あらかじめ', origin: 'ラテン語 prae「前に」', emoji: '⏮️' }),
  Object.freeze({ id: 'pf-pro', form: 'pro- / por-', meaning: '前へ・代わりに', origin: 'ラテン語 pro「前へ」', emoji: '⏭️' }),
  Object.freeze({ id: 'pf-re', form: 're-', meaning: '再び・元へ・後ろへ', origin: 'ラテン語 re「再び・元へ」', emoji: '🔄' }),
  Object.freeze({ id: 'pf-sub', form: 'sub- / suc- / suf- / sup-', meaning: '下に・下から', origin: 'ラテン語 sub「下に」', emoji: '⬇️' }),
  Object.freeze({ id: 'pf-super', form: 'super- / sur-', meaning: '上に・越えて', origin: 'ラテン語 super「上に」', emoji: '🔝' }),
  Object.freeze({ id: 'pf-trans', form: 'trans- / tra-', meaning: '越えて・向こうへ', origin: 'ラテン語 trans「越えて」', emoji: '🌉' }),
  Object.freeze({ id: 'pf-se', form: 'se-', meaning: '離して・別に', origin: 'ラテン語 se「離れて」', emoji: '✂️' }),
  Object.freeze({ id: 'pf-circum', form: 'circum-', meaning: 'まわりを', origin: 'ラテン語 circum「まわりに」', emoji: '⭕' }),
  Object.freeze({ id: 'pf-contra', form: 'contra- / contro-', meaning: '反対に', origin: 'ラテン語 contra「反対に」', emoji: '⚔️' }),
  Object.freeze({ id: 'pf-extra', form: 'extra- / extro-', meaning: '外の・範囲を越えて', origin: 'ラテン語 extra「外に」', emoji: '🚀' }),
  Object.freeze({ id: 'pf-syn', form: 'syn- / sym-', meaning: '共に・同じ', origin: 'ギリシャ語 syn「共に」', emoji: '🧩' }),
  Object.freeze({ id: 'pf-dia', form: 'dia-', meaning: '通して・横切って', origin: 'ギリシャ語 dia「通して」', emoji: '➰' }),
  Object.freeze({ id: 'pf-para', form: 'para-', meaning: '横に・並んで', origin: 'ギリシャ語 para「そばに」', emoji: '🪢' }),
  Object.freeze({ id: 'pf-anti', form: 'anti-', meaning: '反対の・対抗する', origin: 'ギリシャ語 anti「反対に」', emoji: '🛡️' }),
])

// 接頭辞ごとの確認済み単語。ここに書いた語だけが語源カードへ載る。
export const PREFIX_ROOT_WORDS = Object.freeze({
  // ad- / ac- / af- / at- ＝ 〜の方へ・くっつく
  'pf-ad': Object.freeze([
    'accelerate', 'acceleration', 'accent', 'accept', 'acceptable', 'access', 'accessible', 'accident',
    'accidental', 'accidentally', 'acclaim', 'accommodate', 'accompany', 'accomplish', 'accord',
    'according', 'accordingly', 'accost', 'accreditation', 'accumulate', 'accumulation', 'accuracy',
    'accurate', 'accurately', 'accuse', 'accustomed', 'acquaint', 'acquire', 'acquirement', 'acquit',
    'adapt', 'addict', 'address', 'adequacy', 'adequate', 'adequately', 'adhere', 'adjacent', 'administer',
    'administration', 'administrative', 'admire', 'admission', 'admit', 'admittance', 'admittedly',
    'admonish', 'admonition', 'adopt', 'adore', 'advent', 'adventure', 'adventurer', 'adversary',
    'adverse', 'adversity', 'advertise', 'advertisement', 'advice', 'advise', 'adviser', 'advocate',
    'affable', 'affect', 'affection', 'affectionate', 'affiliate', 'affinity', 'affirm', 'affluence',
    'affluent', 'affront', 'aggravate', 'aggregate', 'aggressive', 'allegation', 'allegations', 'allege',
    'alleged', 'allegedly', 'alleviate', 'alleviation', 'allocate', 'allocated', 'allocation', 'ally',
    'annihilate', 'annihilation', 'annotation', 'announce', 'announcement', 'announcements', 'apparatus',
    'apparent', 'apparently', 'apparition', 'appeal', 'appear', 'appearance', 'append', 'appendix',
    'appetite', 'applaud', 'applicant', 'application', 'apply', 'appoint', 'appointed', 'appointment',
    'appraise', 'appreciate', 'apprehensive', 'approach', 'approbation', 'appropriate', 'approval',
    'approve', 'approximate', 'arrest', 'arrive', 'arrogant', 'ascend', 'ascertain', 'aspiration',
    'aspire', 'assail', 'assemble', 'assembly', 'assent', 'assert', 'asset', 'assign', 'assigned',
    'assignment', 'assimilate', 'assimilation', 'assist', 'assistant', 'associate', 'assuage', 'assume',
    'assumption', 'assure', 'attain', 'attempt', 'attend', 'attendance', 'attendant', 'attenuate',
    'attest', 'attract', 'attraction', 'attractive', 'attribute',
  ]),
  // com- / con- / col- / cor- ＝ 共に・すっかり
  'pf-com': Object.freeze([
    'coalesce', 'coalition', 'coauthor', 'coerce', 'coherence', 'coherent', 'cohesion', 'coincide',
    'collaborate', 'collapse', 'colleague', 'collect', 'collected', 'collection', 'collective',
    'collectively', 'collide', 'combat', 'combatant', 'combine', 'comfort', 'comfortable', 'comforting',
    'command', 'commander', 'commemorate', 'commemoration', 'commemorative', 'commence', 'commend',
    'commendable', 'comment', 'commerce', 'commiserate', 'commission', 'commit', 'commitment', 'committed',
    'committee', 'commodious', 'commodity', 'common', 'commotion', 'commute', 'compact', 'companion',
    'company', 'compare', 'compass', 'compassion', 'compassionate', 'compatible', 'compatriot', 'compel',
    'compelling', 'compensate', 'compensation', 'compete', 'competence', 'competent', 'competition',
    'competitive', 'competitor', 'complacent', 'complain', 'complement', 'complete', 'completely',
    'complex', 'complexity', 'complicate', 'complicated', 'complicity', 'comply', 'component', 'comport',
    'composition', 'compostable', 'compound', 'comprehend', 'compress', 'comprise', 'compromise',
    'compulsion', 'compulsory', 'compunction', 'compute', 'conceal', 'concede', 'conceive', 'concentrate',
    'concept', 'conceptual', 'concern', 'concert', 'concise', 'concisely', 'conclude', 'concluding',
    'conclusion', 'conclusive', 'concomitant', 'concrete', 'concurrent', 'condemn', 'condense',
    'condescend', 'condition', 'conducive', 'conduct', 'conductivity', 'conductor', 'confer', 'conference',
    'confess', 'confide', 'confidence', 'confident', 'confidential', 'confidentiality', 'confidently',
    'configuration', 'confine', 'confined', 'confinement', 'confirm', 'confirmation', 'conflagration',
    'conflict', 'conflicting', 'confluence', 'conform', 'conformity', 'confound', 'confront', 'confuse',
    'confusing', 'confusion', 'congenial', 'congenital', 'congestion', 'congratulate', 'congress',
    'congressional', 'congressman', 'conjure', 'connect', 'connection', 'connectivity', 'connote',
    'conquer', 'conquest', 'conscience', 'conscientious', 'conscious', 'consciousness', 'conscription',
    'consecrate', 'consecutive', 'consensus', 'consent', 'consequence', 'consequently', 'conservation',
    'conservationist', 'conservative', 'conserve', 'consign', 'consignment', 'consist', 'consistency',
    'consistent', 'consistently', 'console', 'consolidate', 'conspicuous', 'conspiracy', 'conspire',
    'constant', 'constituency', 'constitute', 'constitution', 'constitutional', 'constrain', 'constraint',
    'constrict', 'constriction', 'construct', 'construction', 'constructive', 'consume', 'consumer',
    'consumerism', 'consumption', 'contact', 'contagion', 'contagious', 'contain', 'container',
    'contamination', 'contemporary', 'contend', 'content', 'contest', 'contestable', 'contestant',
    'context', 'contract', 'contraction', 'contractor', 'contribute', 'contribution', 'contributor',
    'contrived', 'convalescence', 'convection', 'convene', 'convenience', 'convenient', 'convention',
    'conventional', 'converge', 'conversation', 'conversational', 'converse', 'conversely', 'convert',
    'convey', 'convict', 'conviction', 'convince', 'convinced', 'convincing', 'convincingly', 'convoluted',
    'cooperate', 'cooperation', 'cooperative', 'coordinate', 'coordination', 'coordinator', 'copilot',
    'correct', 'correction', 'correctly', 'correlate', 'correspond', 'corroborate', 'corrode', 'corrupt',
    'corrupted', 'corruption', 'cost', 'cover', 'coworker',
  ]),
  // de- ＝ 下へ・離れて・すっかり
  'pf-de': Object.freeze([
    'deactivate', 'debase', 'debate', 'debug', 'decarbonization', 'decay', 'deceive', 'deception',
    'deceptive', 'decide', 'decipher', 'declare', 'decline', 'declining', 'decode', 'decompose',
    'decrease', 'decreased', 'dedicate', 'dedicated', 'dedication', 'deduce', 'deduct', 'deduction',
    'defame', 'defect', 'defective', 'defend', 'defendant', 'defense', 'defenseless', 'defensive', 'defer',
    'deference', 'deficiency', 'deficient', 'deficit', 'define', 'definite', 'definitely', 'definition',
    'definitive', 'deflate', 'deflect', 'deforest', 'deforestation', 'deform', 'defrost', 'degenerate',
    'degradation', 'degrade', 'degree', 'dejected', 'delegate', 'delegation', 'deliberate', 'delineate',
    'deliver', 'delude', 'demand', 'demanding', 'demands', 'dementia', 'demilitarize', 'demobilize',
    'demoralize', 'demote', 'demotion', 'demur', 'denigrate', 'denominate', 'denomination', 'denote',
    'denounce', 'denounced', 'denunciation', 'deny', 'depart', 'department', 'departure', 'depend',
    'dependence', 'dependency', 'dependent', 'depict', 'deplete', 'deplorable', 'deplore', 'deploy',
    'deployment', 'deport', 'deportation', 'depose', 'deposit', 'deprave', 'deprecate', 'depreciate',
    'depress', 'depressed', 'depression', 'depressive', 'deprivation', 'deprive', 'deride', 'derision',
    'derive', 'descend', 'descendant', 'descendants', 'descent', 'describe', 'desecrate', 'desert',
    'deserve', 'desiccate', 'design', 'designate', 'designated', 'designation', 'designer', 'desolate',
    'despair', 'desperate', 'despicable', 'despise', 'despite', 'despondent', 'destabilize', 'destitute',
    'destruction', 'destructive', 'detach', 'detain', 'detect', 'deter', 'detest', 'detestable', 'detour',
    'detrimental', 'devastate', 'deviate', 'deviation', 'devious', 'devolve', 'devote', 'devour',
  ]),
  // dis- / dif- / di- ＝ 離れて・反対に
  'pf-dis': Object.freeze([
    'differ', 'different', 'differently', 'diffuse', 'diffusion', 'digest', 'dilate', 'dilute',
    'dimension', 'direct', 'direction', 'director', 'disable', 'disabuse', 'disadvantage', 'disagree',
    'disagreeable', 'disagreement', 'disappear', 'disappoint', 'disapproval', 'disarm', 'disarmament',
    'disaster', 'disband', 'discard', 'discern', 'discharge', 'disclose', 'disclosure', 'discomfort',
    'disconcert', 'disconnect', 'disconnection', 'discontent', 'discontented', 'discontinuity', 'discord',
    'discordant', 'discount', 'discourage', 'discover', 'discoverable', 'discovered', 'discovery',
    'discrepancy', 'discursive', 'disease', 'disengage', 'disfavor', 'disgrace', 'disgruntled', 'disgust',
    'dishonest', 'dishonor', 'disincentive', 'disinclined', 'disinformation', 'dislike', 'disloyal',
    'dismiss', 'dismissal', 'disobedience', 'disobedient', 'disobey', 'disorder', 'disorderly',
    'disorganized', 'disparity', 'dispassionate', 'dispel', 'dispensation', 'dispense', 'disperse',
    'dispirited', 'displease', 'displeasure', 'dispose', 'disposition', 'disprove', 'dispute', 'disregard',
    'disreputable', 'disrespectful', 'disrupt', 'disruption', 'dissatisfaction', 'dissatisfied',
    'dissemble', 'disseminate', 'dissent', 'dissimilar', 'dissolution', 'dissolve', 'dissonance',
    'dissuade', 'distance', 'distant', 'distaste', 'distinct', 'distinction', 'distinctive', 'distinguish',
    'distinguishable', 'distort', 'distract', 'distracted', 'distraction', 'distribute', 'distribution',
    'district', 'distrust', 'disturb', 'diverge', 'diverse', 'diversion', 'diversity', 'divert', 'divulge',
  ]),
  // ex- / ef- / e- ＝ 外へ・すっかり
  'pf-ex': Object.freeze([
    'edict', 'educate', 'effect', 'effective', 'effectively', 'efficacy', 'efficiency', 'efficient',
    'efficiently', 'effort', 'effortless', 'effusive', 'egregious', 'eject', 'elaborate', 'elated',
    'election', 'elevate', 'elevation', 'elicit', 'eliminate', 'elucidate', 'elude', 'elusive', 'emanate',
    'emancipate', 'emerge', 'emigrant', 'emigrate', 'eminent', 'emission', 'emit', 'emotion', 'emotional',
    'enormous', 'enumerate', 'enumeration', 'enunciate', 'eradicate', 'erase', 'erect', 'erode', 'erosion',
    'erupt', 'escape', 'evacuate', 'evade', 'evaluate', 'evaporate', 'event', 'evidence', 'evident',
    'evidently', 'evoke', 'evolve', 'exacerbate', 'exactly', 'exaggerate', 'exalt', 'exasperate', 'exceed',
    'exceedingly', 'except', 'exception', 'exceptional', 'excerpt', 'excess', 'excessive', 'excessively',
    'exchange', 'excite', 'exclaim', 'exclamation', 'exclude', 'exclusion', 'exclusive', 'exclusively',
    'excoriate', 'exculpate', 'excursion', 'excuse', 'execute', 'exempt', 'exemption', 'exercise', 'exert',
    'exhale', 'exhaust', 'exhibit', 'exhibition', 'exhort', 'exhume', 'exile', 'exist', 'exit',
    'exonerate', 'expand', 'expatriate', 'expedient', 'expedite', 'expedition', 'expel', 'expenditure',
    'expense', 'expenses', 'expensive', 'experience', 'expire', 'explain', 'explicit', 'explicitly',
    'explode', 'explore', 'export', 'exportation', 'express', 'expression', 'expressionless', 'expressive',
    'expulsion', 'extant', 'extend', 'extended', 'extension', 'extensive', 'extinct', 'extinction',
    'extinguish', 'extol', 'extract', 'extraction', 'extricate', 'exuberant',
  ]),
  // in- / im- / en- ＝ 中へ・上へ
  'pf-in-into': Object.freeze([
    'embrace', 'employ', 'employee', 'employer', 'employment', 'enable', 'enact', 'enchant', 'enclose',
    'enclosure', 'encode', 'encompass', 'encounter', 'encourage', 'encrypt', 'endanger', 'endangered',
    'endeavor', 'endorse', 'endurance', 'endure', 'enduring', 'enfeeble', 'enforce', 'enforced',
    'enforcement', 'engender', 'engrave', 'engulf', 'enlarge', 'enlighten', 'enlist', 'enmesh', 'ennoble',
    'enrage', 'enrich', 'enroll', 'enslave', 'ensure', 'entail', 'entitle', 'entrust', 'envisage',
    'envision', 'envoy', 'illuminate', 'illuminating', 'illumination', 'immerse', 'immigrant', 'immigrate',
    'immigration', 'imminent', 'impact', 'impassioned', 'impede', 'impediment', 'impeding', 'impel',
    'impending', 'imperil', 'impersonate', 'impetuous', 'impetus', 'impinge', 'implant', 'implement',
    'implementation', 'implicate', 'implication', 'implicit', 'implicitly', 'implode', 'implore', 'imply',
    'import', 'importance', 'important', 'importantly', 'importation', 'impose', 'impound', 'impoverish',
    'impress', 'impression', 'impressive', 'imprison', 'impugn', 'impulse', 'impulsive', 'incarcerate',
    'incarnation', 'inception', 'incident', 'incite', 'inclination', 'incline', 'include', 'including',
    'inclusion', 'inclusive', 'inclusivity', 'incorporate', 'increase', 'increased', 'increasingly',
    'incriminate', 'incur', 'indicate', 'indication', 'indicator', 'indict', 'induce', 'infect',
    'infection', 'infectious', 'infer', 'inference', 'infiltrate', 'inflame', 'inflate', 'inflict',
    'influence', 'influential', 'influx', 'inform', 'information', 'informative', 'infringe', 'infuriate',
    'ingenious', 'ingenuity', 'ingenuous', 'ingest', 'ingratiate', 'ingredient', 'inhabit', 'inhabitant',
    'inhale', 'inherent', 'inherit', 'inhibit', 'initial', 'initially', 'initiate', 'initiative', 'inject',
    'injection', 'innate', 'innovate', 'innovation', 'innovative', 'innovator', 'inquire', 'inquiry',
    'inquisitive', 'inscribe', 'insert', 'insist', 'insistence', 'insistent', 'inspect', 'inspection',
    'inspector', 'inspiration', 'inspire', 'install', 'instant', 'instantly', 'instill', 'instinct',
    'instinctive', 'institute', 'institution', 'instruct', 'instruction', 'instructive', 'instructor',
    'intend', 'intense', 'intensely', 'intensified', 'intensify', 'intensity', 'intimidate', 'intricate',
    'intrude', 'intuition', 'inundate', 'invade', 'invent', 'invented', 'invention', 'inventive',
    'inventiveness', 'inventor', 'inventory', 'investigate', 'invidious', 'invigorate', 'invocation',
    'invoke', 'involve', 'involvement', 'irrigate', 'irrigation',
  ]),
  // in- / im- / il- / ir- ＝ 〜でない
  'pf-in-not': Object.freeze([
    'illegal', 'illicit', 'illiteracy', 'illiterate', 'illogical', 'imbalance', 'immaculate', 'immediate',
    'immediately', 'immemorial', 'immense', 'immobile', 'immobility', 'immobilize', 'immoral', 'immortal',
    'immortality', 'immutable', 'impartial', 'impassable', 'impasse', 'impassive', 'impatience',
    'impatient', 'impeccable', 'imperceptible', 'impertinent', 'impervious', 'impious', 'implacable',
    'implausible', 'impolite', 'impossible', 'improbable', 'improper', 'imprudent', 'impure', 'inability',
    'inaccuracy', 'inaccurate', 'inaction', 'inactive', 'inadequacy', 'inadequate', 'inadvertent',
    'inadvertently', 'inappropriate', 'inarticulate', 'inattentive', 'incapable', 'incapacitate',
    'incapacity', 'incessant', 'incoherence', 'incomparable', 'incompatible', 'incompetence',
    'incompetent', 'incomplete', 'inconclusive', 'incongruity', 'incongruous', 'inconsistency',
    'inconsistent', 'incontrovertible', 'incorrect', 'incorrigible', 'incredible', 'indecency', 'indecent',
    'indecisive', 'indefatigable', 'indelible', 'independence', 'indifference', 'indifferent', 'indignant',
    'indirect', 'indiscreet', 'indiscriminate', 'indistinguishable', 'indivisible', 'indolent',
    'indomitable', 'ineffable', 'ineffective', 'inefficiency', 'inefficient', 'inept', 'inequality',
    'inequitable', 'inequity', 'inexorable', 'inexpensive', 'inexperience', 'inexperienced', 'infamous',
    'infamy', 'infancy', 'infant', 'infidelity', 'infinite', 'infinity', 'inflexibility', 'inflexible',
    'informal', 'informally', 'infrequent', 'infrequently', 'inhospitable', 'inimitable', 'iniquity',
    'injure', 'injured', 'injury', 'injustice', 'innocent', 'innocuous', 'insatiable', 'inscrutable',
    'insecure', 'insensitive', 'inseparable', 'insignificance', 'insignificant', 'insipid', 'insolent',
    'insolvent', 'instability', 'insubordinate', 'insubordination', 'insufferable', 'insufficiency',
    'insufficient', 'intact', 'intangible', 'intolerable', 'intolerance', 'intolerant', 'intractable',
    'intrepid', 'invalid', 'invalidate', 'invariably', 'invisible', 'irrational', 'irregular',
    'irregularly', 'irrelevant', 'irresistible', 'irreverent',
  ]),
  // inter- ＝ 間に・互いに
  'pf-inter': Object.freeze([
    'intelligent', 'interact', 'interaction', 'interdisciplinary', 'interface', 'interfere', 'interloper',
    'intermediary', 'intermediate', 'intermittent', 'international', 'interrupt', 'interruption',
    'interval', 'intervene', 'intervention', 'interview',
  ]),
  // ob- / oc- / of- / op- ＝ 〜に向かって・逆らって
  'pf-ob': Object.freeze([
    'obdurate', 'obese', 'obey', 'obfuscate', 'object', 'objection', 'objectionable', 'objective',
    'obligation', 'obligatory', 'oblige', 'obliterate', 'obloquy', 'obsequious', 'observance', 'observant',
    'observation', 'observe', 'observer', 'obsession', 'obsolete', 'obstacle', 'obstinate', 'obstreperous',
    'obstruct', 'obstructed', 'obstruction', 'obstructive', 'obtain', 'obviate', 'obvious', 'occasion',
    'occasional', 'occasionally', 'occur', 'occurrence', 'offend', 'offender', 'offense', 'offensive',
    'offer', 'opponent', 'opportunity', 'oppose', 'opposite', 'opposition', 'oppress', 'oppression',
    'oppressive', 'opprobrium',
  ]),
  // per- ＝ 通して・すっかり
  'pf-per': Object.freeze([
    'perceive', 'perceptible', 'perception', 'perceptive', 'perennial', 'perfect', 'perfidy', 'perfume',
    'perhaps', 'permanent', 'permeate', 'permission', 'permit', 'pernicious', 'perplex', 'perplexing',
    'perplexity', 'persecute', 'persecution', 'persevere', 'persist', 'persistence', 'persistent',
    'perspective', 'perspicacious', 'perspiration', 'perspire', 'persuade', 'pertain', 'pervade',
    'pervasive',
  ]),
  // pre- / prae- ＝ 前に・あらかじめ
  'pf-pre': Object.freeze([
    'precaution', 'precede', 'precedent', 'precept', 'precise', 'precisely', 'preclude', 'precocious',
    'precursor', 'predecessor', 'predicament', 'predict', 'predictable', 'prediction', 'predilection',
    'preface', 'prefecture', 'prefer', 'preferable', 'preference', 'preferential', 'prefix', 'prehistoric',
    'prejudice', 'prejudiced', 'preliminary', 'preoccupied', 'preoccupy', 'preparation', 'prepare',
    'prerequisite', 'prescient', 'prescribe', 'prescription', 'present', 'preservation', 'preserve',
    'preside', 'president', 'presumably', 'presume', 'presumption', 'pretend', 'pretense', 'prevail',
    'prevalent', 'prevent', 'prevention', 'preview', 'previous',
  ]),
  // pro- / por- ＝ 前へ・代わりに
  'pf-pro': Object.freeze([
    'portend', 'proceed', 'process', 'proclaim', 'proclamation', 'procure', 'procurement', 'produce',
    'producer', 'product', 'production', 'productive', 'productivity', 'products', 'profane',
    'proficiency', 'proficient', 'profit', 'profound', 'profoundly', 'profuse', 'program', 'progress',
    'progression', 'progressive', 'progressively', 'prohibit', 'prohibition', 'project', 'prolong',
    'prolonged', 'promote', 'promotion', 'pronounce', 'propel', 'propeller', 'propensity', 'proportion',
    'proposition', 'propulsion', 'proscribe', 'prosecute', 'prosecution', 'prosecutor', 'prospect',
    'prospective', 'prosper', 'prosperous', 'protect', 'protest', 'protract', 'provenance', 'proverb',
    'provide', 'provision', 'provisional', 'provocation', 'provoke', 'purpose',
  ]),
  // re- ＝ 再び・元へ・後ろへ
  'pf-re': Object.freeze([
    'react', 'reaction', 'reaffirm', 'reassess', 'reassure', 'rebel', 'reboot', 'recalcitrance',
    'recalcitrant', 'recall', 'recant', 'recapitulate', 'recede', 'receipt', 'reception', 'recess',
    'recession', 'recite', 'recline', 'recluse', 'reclusive', 'recoil', 'recollect', 'recommend',
    'reconcile', 'reconsider', 'record', 'recount', 'recover', 'recrimination', 'recuperate', 'recur',
    'recurrence', 'recurrent', 'recycle', 'redirect', 'redo', 'reduce', 'reduced', 'reduction', 'refer',
    'referee', 'reference', 'refine', 'refined', 'refinement', 'reflect', 'reflective', 'reflex', 'reform',
    'refractory', 'refrain', 'refresh', 'refuge', 'refund', 'refurbish', 'refusal', 'refuse', 'regain',
    'regard', 'reimburse', 'reinforce', 'reinstate', 'reiterate', 'reject', 'rejection', 'rekindle',
    'relapse', 'relationship', 'relax', 'relegate', 'relentless', 'relevance', 'relevant', 'relieve',
    'relinquish', 'relocate', 'relocation', 'remain', 'remark', 'remarkable', 'remedy', 'remember',
    'remind', 'remiss', 'remit', 'remittance', 'remodel', 'remote', 'removal', 'remove', 'renege', 'renew',
    'renounce', 'renovate', 'renovation', 'repair', 'reparation', 'repatriate', 'repatriation', 'repeat',
    'repel', 'repellent', 'repercussion', 'replace', 'replenish', 'replete', 'replica', 'replicate',
    'replication', 'reply', 'report', 'reporter', 'repose', 'represent', 'repress', 'repression',
    'reprobate', 'reproduce', 'repugnant', 'repulsive', 'reputation', 'request', 'require', 'requirement',
    'rescue', 'research', 'resemblance', 'resemble', 'resent', 'resentful', 'resentment', 'reservation',
    'reserve', 'reserved', 'reside', 'resign', 'resignation', 'resilient', 'resist', 'resistance',
    'resistant', 'resolute', 'resolutely', 'resolution', 'resolve', 'resonate', 'resound', 'resource',
    'respect', 'respectability', 'respectable', 'respectful', 'respective', 'respectively', 'respiration',
    'respond', 'response', 'responsibility', 'responsible', 'restitution', 'restock', 'restore',
    'restrain', 'restraint', 'restrict', 'restricted', 'restriction', 'result', 'resume', 'retain',
    'retaliate', 'retire', 'retort', 'retreat', 'retribution', 'return', 'reunion', 'revamp', 'reveal',
    'revenge', 'revenue', 'revere', 'reversal', 'reverse', 'review', 'revise', 'revision', 'revitalize',
    'revival', 'revive', 'revoke', 'revolt', 'revolution', 'revolutionary', 'revolve',
  ]),
  // sub- / suc- / suf- / sup- ＝ 下に・下から
  'pf-sub': Object.freeze([
    'subcommittee', 'subconscious', 'subdue', 'subject', 'subjective', 'subjugate', 'submarine',
    'submerge', 'submission', 'submissive', 'submit', 'subnormal', 'subordinate', 'subordination',
    'subscribe', 'subscription', 'subsequent', 'subsequently', 'subside', 'subsist', 'subsistence',
    'substance', 'substandard', 'substitute', 'substitution', 'subtitle', 'subtract', 'subtraction',
    'subtropical', 'suburb', 'suburban', 'subway', 'succeed', 'success', 'successful', 'succession',
    'successive', 'successor', 'succinct', 'succumb', 'suffer', 'suffering', 'suffice', 'sufficiency',
    'sufficient', 'sufficiently', 'suffocate', 'suffocation', 'supplement', 'supplementary', 'supply',
    'support', 'supporter', 'supportive', 'suppose', 'suppress', 'suppression', 'susceptible', 'suspend',
    'suspense', 'suspension', 'sustain', 'sustainability', 'sustainable',
  ]),
  // super- / sur- ＝ 上に・越えて
  'pf-super': Object.freeze([
    'superficial', 'superfluous', 'supermarket', 'supernatural', 'supersede', 'supervise', 'supervision',
    'supervisor', 'surcharge', 'surface', 'surmise', 'surmount', 'surname', 'surpass', 'surplus',
    'surprise', 'surrender', 'surround', 'survey', 'survival', 'survive',
  ]),
  // trans- / tra- ＝ 越えて・向こうへ
  'pf-trans': Object.freeze([
    'tradition', 'trajectory', 'transcend', 'transcendent', 'transfer', 'transform', 'transformation',
    'transgress', 'transient', 'transit', 'transition', 'translate', 'transmit', 'transparency',
    'transparent', 'transplant', 'transport', 'transportation',
  ]),
  // se- ＝ 離して・別に
  'pf-se': Object.freeze([
    'seclude', 'secluded', 'seclusion', 'secure', 'securely', 'security', 'segregate', 'segregation',
    'select', 'selection', 'selective', 'separate', 'separately',
  ]),
  // circum- ＝ まわりを
  'pf-circum': Object.freeze([
    'circumspect', 'circumstance', 'circumstantial', 'circumvent',
  ]),
  // contra- / contro- ＝ 反対に
  'pf-contra': Object.freeze([
    'contradict', 'contrast', 'control', 'controversial', 'controversy',
  ]),
  // extra- / extro- ＝ 外の・範囲を越えて
  'pf-extra': Object.freeze([
    'extraordinary', 'extravagant', 'extrovert',
  ]),
  // syn- / sym- ＝ 共に・同じ
  'pf-syn': Object.freeze([
    'symbiosis', 'symbiotic', 'symmetry', 'sympathetic', 'sympathize', 'sympathy', 'symptom', 'syndrome',
    'synthesis', 'synthesize',
  ]),
  // dia- ＝ 通して・横切って
  'pf-dia': Object.freeze([
    'diagnose', 'diagnosis', 'dialogue', 'diameter', 'diaphanous', 'diatribe',
  ]),
  // para- ＝ 横に・並んで
  'pf-para': Object.freeze([
    'paradigm', 'paradox', 'paragraph', 'parallel', 'parameter', 'parasite',
  ]),
  // anti- ＝ 反対の・対抗する
  'pf-anti': Object.freeze([
    'antibiotic', 'antidote', 'antipathy', 'antithesis',
  ]),
})
