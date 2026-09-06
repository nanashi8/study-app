// ラテン語・ギリシャ語の接頭辞カード。
//
// 既存の語根カードは語幹（portāre, dīcere …）だけを扱っていたため、
// suffocation の sub-、ideology の前半のように「語のもう半分」が出てこなかった。
// 接頭辞は初見の語の方向・否定・強弱を読み取る手がかりになるので、
// 土着の接辞（be- / un- / -th …）と同じ形でカードにする。
//
// 収録の条件（どちらも満たす語だけを載せる）:
//  1) すでに語幹カードに入っている＝ラテン語・ギリシャ語の複合語だと確認済みの語
//  2) 語幹の綴りより前に残る部分が、その接頭辞の形（同化形を含む）と一致する語
// これで「接頭辞＋語幹」の分解が二重に裏づけされた語だけが載る。
//
// 例外的に手で確かめて足した語: suffocate / suffocation（sub- ＋ faucēs「喉」。
// faucēs から来た英語がこの1語族だけで、語幹側のカードを作れないため）。
//
// 綴りが似ているだけで接頭辞ではない語（監査で除外）:
//   republic / republican（rēs pūblica「公のもの」）、office / officer / official
//   （opus + facere）、diminish（de + minuere）、alarm（イタリア語 all'arme）、
//   empathy / endemic（ギリシャ語 en-。ラテン語 in- とは別に扱う）。
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
    'accept', 'acceptable', 'access', 'accessible', 'accident', 'accidental', 'accidentally', 'acclaim',
    'accord', 'according', 'accordingly', 'accreditation', 'accuracy', 'accurate', 'accurately', 'acquire',
    'acquirement', 'addict', 'adequacy', 'adequate', 'adequately', 'adhere', 'administer',
    'administration', 'administrative', 'admission', 'admit', 'admittance', 'admittedly', 'admonish',
    'admonition', 'adopt', 'advent', 'adventure', 'adventurer', 'adversary', 'adverse', 'adversity',
    'advertise', 'advertisement', 'advise', 'adviser', 'advocate', 'affable', 'affect', 'affection',
    'affectionate', 'affinity', 'affirm', 'affluence', 'affluent', 'aggregate', 'aggressive', 'allegation',
    'allegations', 'allege', 'alleged', 'allegedly', 'alleviate', 'alleviation', 'allocate', 'allocated',
    'allocation', 'announce', 'announcement', 'announcements', 'apparatus', 'apparent', 'apparently',
    'apparition', 'appear', 'appearance', 'append', 'appendix', 'appetite', 'applicant', 'application',
    'appoint', 'appointed', 'appointment', 'approbation', 'approval', 'approve', 'ascertain', 'assemble',
    'assembly', 'assent', 'assign', 'assigned', 'assignment', 'assimilate', 'assimilation', 'assist',
    'assistant', 'assume', 'assumption', 'attend', 'attendance', 'attendant', 'attest', 'attract',
    'attraction', 'attractive', 'attribute',
  ]),
  // com- / con- / col- / cor- ＝ 共に・すっかり
  'pf-com': Object.freeze([
    'coherence', 'coherent', 'cohesion', 'collect', 'collected', 'collection', 'collective',
    'collectively', 'combat', 'combatant', 'comfort', 'comfortable', 'comforting', 'command', 'commander',
    'commemorate', 'commemoration', 'commemorative', 'commend', 'commendable', 'commission', 'commit',
    'commitment', 'committed', 'committee', 'commodious', 'commodity', 'commotion', 'commute', 'compass',
    'compassion', 'compassionate', 'compatible', 'compatriot', 'compel', 'compelling', 'compensate',
    'compensation', 'compete', 'competence', 'competent', 'competition', 'competitive', 'competitor',
    'complement', 'complete', 'completely', 'complex', 'complexity', 'complicate', 'complicated',
    'complicity', 'component', 'comport', 'composition', 'compostable', 'compress', 'compulsion',
    'compulsory', 'compunction', 'concept', 'conceptual', 'concise', 'concisely', 'conclude', 'concluding',
    'conclusion', 'conclusive', 'concurrent', 'conducive', 'conduct', 'conductivity', 'conductor',
    'confer', 'conference', 'confide', 'confidence', 'confident', 'confidential', 'confidentiality',
    'confidently', 'confine', 'confined', 'confinement', 'confirm', 'confirmation', 'conflict',
    'conflicting', 'confluence', 'conform', 'conformity', 'confuse', 'confusing', 'confusion', 'congenial',
    'congenital', 'congratulate', 'congress', 'congressional', 'congressman', 'conjure', 'connect',
    'connection', 'connectivity', 'conquer', 'conquest', 'conscience', 'conscientious', 'conscious',
    'consciousness', 'conscription', 'consecutive', 'consensus', 'consent', 'consequence', 'consequently',
    'conservation', 'conservationist', 'conservative', 'conserve', 'consign', 'consignment', 'consist',
    'consistency', 'consistent', 'consistently', 'conspicuous', 'conspiracy', 'conspire', 'constant',
    'constituency', 'constitute', 'constitution', 'constitutional', 'constrain', 'constraint', 'constrict',
    'constriction', 'construct', 'construction', 'constructive', 'consume', 'consumer', 'consumerism',
    'consumption', 'contact', 'contagion', 'contagious', 'contain', 'container', 'contemporary', 'contend',
    'content', 'contest', 'contestable', 'contestant', 'contract', 'contraction', 'contractor',
    'contribute', 'contribution', 'contributor', 'convalescence', 'convene', 'convenience', 'convenient',
    'convention', 'conventional', 'conversation', 'conversational', 'converse', 'conversely', 'convert',
    'convict', 'conviction', 'convince', 'convinced', 'convincing', 'convincingly', 'convoluted',
    'cooperate', 'cooperation', 'cooperative', 'coordinate', 'coordination', 'coordinator', 'correct',
    'correction', 'correctly', 'corrupt', 'corrupted', 'corruption',
  ]),
  // de- ＝ 下へ・離れて・すっかり
  'pf-de': Object.freeze([
    'debate', 'deception', 'deceptive', 'decide', 'decline', 'declining', 'decrease', 'decreased',
    'dedicate', 'dedicated', 'dedication', 'deduce', 'deduct', 'deduction', 'defame', 'defect',
    'defective', 'defend', 'defendant', 'defense', 'defenseless', 'defensive', 'defer', 'deference',
    'deficiency', 'deficient', 'deficit', 'define', 'definite', 'definitely', 'definition', 'definitive',
    'deflect', 'deform', 'degenerate', 'degradation', 'degrade', 'dejected', 'delegate', 'delegation',
    'demand', 'demanding', 'demands', 'demote', 'demotion', 'denominate', 'denomination', 'denounce',
    'denounced', 'denunciation', 'depart', 'department', 'departure', 'depend', 'dependence', 'dependency',
    'dependent', 'deplete', 'deploy', 'deployment', 'deport', 'deportation', 'deposit', 'depress',
    'depressed', 'depression', 'depressive', 'deprivation', 'deprive', 'descend', 'descendant',
    'descendants', 'descent', 'describe', 'deserve', 'design', 'designate', 'designated', 'designation',
    'designer', 'desolate', 'desperate', 'despicable', 'despondent', 'destitute', 'destruction',
    'destructive', 'detain', 'detest', 'detestable', 'detour', 'deviate', 'deviation', 'devolve',
  ]),
  // dis- / dif- / di- ＝ 離れて・反対に
  'pf-dis': Object.freeze([
    'differ', 'different', 'differently', 'diffuse', 'diffusion', 'direct', 'direction', 'director',
    'disarm', 'disarmament', 'disaster', 'discharge', 'disclose', 'disclosure', 'discord', 'discordant',
    'discover', 'discoverable', 'discovered', 'discovery', 'discursive', 'dismiss', 'dismissal',
    'dispassionate', 'dispel', 'dispensation', 'dispense', 'dispirited', 'disposition', 'disprove',
    'disrupt', 'disruption', 'dissatisfaction', 'dissatisfied', 'dissemble', 'dissent', 'dissimilar',
    'dissolution', 'dissolve', 'distance', 'distant', 'distinct', 'distinction', 'distinctive',
    'distinguish', 'distinguishable', 'distort', 'distract', 'distracted', 'distraction', 'distribute',
    'distribution', 'district', 'diverse', 'diversion', 'diversity', 'divert',
  ]),
  // ex- / ef- / e- ＝ 外へ・すっかり
  'pf-ex': Object.freeze([
    'edict', 'educate', 'effect', 'effective', 'effectively', 'efficacy', 'efficiency', 'efficient',
    'efficiently', 'effort', 'effortless', 'effusive', 'egregious', 'election', 'elevate', 'elevation',
    'elucidate', 'emigrant', 'emigrate', 'emission', 'emit', 'emotion', 'emotional', 'enumerate',
    'enumeration', 'enunciate', 'erect', 'erupt', 'evacuate', 'evade', 'evaluate', 'event', 'evidence',
    'evident', 'evidently', 'evoke', 'evolve', 'exceed', 'exceedingly', 'except', 'exception',
    'exceptional', 'excess', 'excessive', 'excessively', 'exclaim', 'exclamation', 'exclude', 'exclusion',
    'exclusive', 'exclusively', 'excursion', 'exempt', 'exemption', 'exhibit', 'exhibition', 'exit',
    'expatriate', 'expedient', 'expedite', 'expedition', 'expel', 'expenditure', 'expense', 'expenses',
    'expensive', 'explicit', 'explicitly', 'export', 'exportation', 'express', 'expression',
    'expressionless', 'expressive', 'expulsion', 'extend', 'extended', 'extension', 'extensive', 'extract',
    'extraction',
  ]),
  // in- / im- / en- ＝ 中へ・上へ
  'pf-in-into': Object.freeze([
    'employ', 'employee', 'employer', 'employment', 'enclose', 'enclosure', 'endurance', 'endure',
    'enduring', 'enforce', 'enforced', 'enforcement', 'engender', 'envisage', 'envision', 'envoy',
    'illuminate', 'illuminating', 'illumination', 'immigrant', 'immigrate', 'immigration', 'impassioned',
    'impede', 'impediment', 'impeding', 'impel', 'impending', 'impetuous', 'impetus', 'implement',
    'implementation', 'implicate', 'implication', 'implicit', 'implicitly', 'import', 'importance',
    'important', 'importantly', 'importation', 'impress', 'impression', 'impressive', 'impulse',
    'impulsive', 'inception', 'incident', 'inclination', 'incline', 'include', 'including', 'inclusion',
    'inclusive', 'inclusivity', 'incorporate', 'increase', 'increased', 'increasingly', 'incur',
    'indicate', 'indication', 'indicator', 'indict', 'induce', 'infect', 'infection', 'infectious',
    'infer', 'inference', 'inflict', 'influence', 'influential', 'influx', 'inform', 'information',
    'informative', 'ingenious', 'ingenuity', 'ingenuous', 'ingratiate', 'inhabit', 'inhabitant',
    'inherent', 'inhibit', 'initial', 'initially', 'initiate', 'initiative', 'inject', 'injection',
    'innate', 'innovate', 'innovation', 'innovative', 'innovator', 'inquire', 'inquiry', 'inquisitive',
    'inscribe', 'insist', 'insistence', 'insistent', 'inspect', 'inspection', 'inspector', 'inspiration',
    'inspire', 'instant', 'instantly', 'instinct', 'instinctive', 'institute', 'institution', 'instruct',
    'instruction', 'instructive', 'instructor', 'intend', 'intense', 'intensely', 'intensified',
    'intensify', 'intensity', 'invade', 'invent', 'invented', 'invention', 'inventive', 'inventiveness',
    'inventor', 'inventory', 'invidious', 'invocation', 'invoke', 'involve', 'involvement',
  ]),
  // in- / im- / il- / ir- ＝ 〜でない
  'pf-in-not': Object.freeze([
    'illegal', 'illiteracy', 'illiterate', 'illogical', 'immediate', 'immediately', 'immemorial',
    'immortal', 'immortality', 'immutable', 'impartial', 'impassable', 'impasse', 'impatience',
    'impatient', 'impossible', 'improbable', 'incapable', 'incapacitate', 'incapacity', 'incessant',
    'incredible', 'inequality', 'inequitable', 'inequity', 'infamous', 'infamy', 'infancy', 'infant',
    'infidelity', 'infinite', 'infinity', 'inflexibility', 'inflexible', 'informal', 'informally',
    'injure', 'injured', 'injury', 'injustice', 'insatiable', 'insensitive', 'insignificance',
    'insignificant', 'insolvent', 'intact', 'intangible', 'intractable', 'invalid', 'invalidate',
    'invisible', 'irregular', 'irregularly',
  ]),
  // inter- ＝ 間に・互いに
  'pf-inter': Object.freeze([
    'intermediary', 'intermediate', 'intermittent', 'international', 'interrupt', 'interruption',
    'intervene', 'intervention',
  ]),
  // ob- / oc- / of- / op- ＝ 〜に向かって・逆らって
  'pf-ob': Object.freeze([
    'obdurate', 'object', 'objection', 'objectionable', 'objective', 'obligation', 'obligatory', 'oblige',
    'obliterate', 'obsequious', 'observance', 'observant', 'observation', 'observe', 'observer',
    'obsession', 'obstacle', 'obstruct', 'obstructed', 'obstruction', 'obstructive', 'obtain', 'obviate',
    'occasion', 'occasional', 'occasionally', 'occur', 'occurrence', 'offend', 'offender', 'offense',
    'offensive', 'offer', 'opponent', 'opposite', 'opposition', 'oppress', 'oppression', 'oppressive',
  ]),
  // per- ＝ 通して・すっかり
  'pf-per': Object.freeze([
    'perceptible', 'perception', 'perceptive', 'perennial', 'perfect', 'perfidy', 'permission', 'permit',
    'perplex', 'perplexing', 'perplexity', 'persecute', 'persecution', 'persist', 'persistence',
    'persistent', 'perspective', 'perspicacious', 'perspiration', 'perspire', 'pertain', 'pervade',
    'pervasive',
  ]),
  // pre- / prae- ＝ 前に・あらかじめ
  'pf-pre': Object.freeze([
    'precept', 'precise', 'precisely', 'preclude', 'precursor', 'predicament', 'predict', 'predictable',
    'prediction', 'preface', 'prefecture', 'prefer', 'preferable', 'preference', 'preferential',
    'prejudice', 'prejudiced', 'preparation', 'prepare', 'prescient', 'prescribe', 'prescription',
    'preservation', 'preserve', 'preside', 'president', 'presumably', 'presume', 'presumption', 'pretend',
    'pretense', 'prevail', 'prevalent', 'prevent', 'prevention',
  ]),
  // pro- / por- ＝ 前へ・代わりに
  'pf-pro': Object.freeze([
    'portend', 'proceed', 'process', 'proclaim', 'proclamation', 'procure', 'procurement', 'produce',
    'producer', 'product', 'production', 'productive', 'productivity', 'products', 'proficiency',
    'proficient', 'profound', 'profoundly', 'profuse', 'program', 'progress', 'progression', 'progressive',
    'progressively', 'prohibit', 'prohibition', 'project', 'prolong', 'prolonged', 'promote', 'promotion',
    'pronounce', 'propel', 'propeller', 'propensity', 'proposition', 'propulsion', 'proscribe',
    'prosecute', 'prosecution', 'prosecutor', 'prospect', 'prospective', 'prosper', 'prosperous',
    'protest', 'protract', 'provenance', 'proverb', 'provide', 'provision', 'provisional', 'provocation',
    'provoke',
  ]),
  // re- ＝ 再び・元へ・後ろへ
  'pf-re': Object.freeze([
    'reception', 'recess', 'recession', 'recline', 'recluse', 'reclusive', 'record', 'recur', 'recurrence',
    'recurrent', 'reduce', 'reduced', 'reduction', 'refer', 'referee', 'reference', 'refine', 'refined',
    'refinement', 'reflect', 'reflective', 'reflex', 'reform', 'refractory', 'refusal', 'refuse', 'reject',
    'rejection', 'relevance', 'relevant', 'relocate', 'relocation', 'remiss', 'remit', 'remittance',
    'remodel', 'remote', 'removal', 'remove', 'renounce', 'renovate', 'renovation', 'reparation',
    'repatriate', 'repatriation', 'repel', 'repellent', 'replenish', 'replete', 'replica', 'replicate',
    'replication', 'report', 'reporter', 'repress', 'repression', 'reprobate', 'repulsive', 'request',
    'require', 'requirement', 'resemblance', 'resemble', 'resent', 'resentful', 'resentment',
    'reservation', 'reserve', 'reserved', 'reside', 'resign', 'resignation', 'resist', 'resistance',
    'resistant', 'resolute', 'resolutely', 'resolution', 'resolve', 'respect', 'respectability',
    'respectable', 'respectful', 'respective', 'respectively', 'respiration', 'respond', 'response',
    'responsibility', 'responsible', 'restitution', 'restrain', 'restraint', 'restrict', 'restricted',
    'restriction', 'result', 'resume', 'retain', 'retort', 'retribution', 'return', 'revenue', 'reversal',
    'reverse', 'revise', 'revision', 'revival', 'revive', 'revoke', 'revolution', 'revolutionary',
    'revolve',
  ]),
  // sub- / suc- / suf- / sup- ＝ 下に・下から
  'pf-sub': Object.freeze([
    'subject', 'subjective', 'subjugate', 'submission', 'submissive', 'submit', 'subordinate',
    'subordination', 'subscribe', 'subscription', 'subsequent', 'subsequently', 'subsist', 'subsistence',
    'substance', 'substitute', 'substitution', 'subtract', 'subtraction', 'suburb', 'suburban', 'succeed',
    'success', 'successful', 'succession', 'successive', 'successor', 'suffer', 'suffering', 'suffice',
    'sufficiency', 'sufficient', 'sufficiently', 'suffocate', 'suffocation', 'supplement', 'supplementary',
    'support', 'supporter', 'supportive', 'suppress', 'suppression', 'susceptible', 'suspend', 'suspense',
    'suspension', 'sustain', 'sustainability', 'sustainable',
  ]),
  // super- / sur- ＝ 上に・越えて
  'pf-super': Object.freeze([
    'superfluous', 'supernatural', 'supersede', 'supervise', 'supervision', 'supervisor', 'surpass',
    'survival', 'survive',
  ]),
  // trans- / tra- ＝ 越えて・向こうへ
  'pf-trans': Object.freeze([
    'trajectory', 'transcend', 'transcendent', 'transfer', 'transform', 'transformation', 'transgress',
    'transit', 'transition', 'transmit', 'transparency', 'transparent', 'transport', 'transportation',
  ]),
  // se- ＝ 離して・別に
  'pf-se': Object.freeze([
    'seclude', 'secluded', 'seclusion', 'secure', 'securely', 'security', 'segregate', 'segregation',
    'select', 'selection', 'selective', 'separate', 'separately',
  ]),
  // circum- ＝ まわりを
  'pf-circum': Object.freeze([
    'circumstance', 'circumstantial', 'circumvent',
  ]),
  // contra- / contro- ＝ 反対に
  'pf-contra': Object.freeze([
    'contradict', 'controversial', 'controversy',
  ]),
  // extra- / extro- ＝ 外の・範囲を越えて
  'pf-extra': Object.freeze([
    'extraordinary', 'extrovert',
  ]),
  // syn- / sym- ＝ 共に・同じ
  'pf-syn': Object.freeze([
    'symbiosis', 'symbiotic', 'symmetry', 'sympathetic', 'sympathize', 'sympathy',
  ]),
  // dia- ＝ 通して・横切って
  'pf-dia': Object.freeze([
    'dialogue', 'diameter', 'diatribe',
  ]),
  // para- ＝ 横に・並んで
  'pf-para': Object.freeze([
    'paragraph', 'parameter',
  ]),
  // anti- ＝ 反対の・対抗する
  'pf-anti': Object.freeze([
    'antibiotic', 'antipathy',
  ]),
})
