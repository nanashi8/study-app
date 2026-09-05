// 形態素分解で見つけた候補を、1語ずつ語源辞典の見出しで確かめて残した語根リンク。
//
// - 候補づくり: derive-roots.js の autoRootIds（語頭または既知の接頭辞の直後にある語根だけ）
// - 確認: Online Etymology Dictionary と Wiktionary の見出しで、語根の言語・系統を照合
// - 別系統だった語は REJECTED_MORPHEME_LINKS に理由つきで残し、カードには出さない
//
// 綴りだけの推測を公開しないため、確認結果をここに固定する。自動再生成はしない。
export const AUDITED_MORPHEME_ROOT_WORDS = Object.freeze({
  // anim ＝ 心・命・気（ラテン語 anima / animus「息・心」）
  anim: Object.freeze(['animated', 'animosity', 'animus']),
  // aqua ＝ 水（ラテン語 aqua「水」）
  aqua: Object.freeze(['aquarium', 'aquatic']),
  // astro / aster ＝ 星（ギリシャ語 astron「星」）
  astro: Object.freeze(['asteroid', 'astronaut', 'astronomy', 'disaster']),
  // aud / audi ＝ 聞く（ラテン語 audīre「聞く」）
  aud: Object.freeze(['audience', 'audit', 'auditor']),
  // auto ＝ 自分・自動（ギリシャ語 autos「自身」）
  auto: Object.freeze(['autobiography', 'autocracy', 'autocrat', 'autocratic', 'autograph', 'automate', 'automatic', 'automatically', 'automation', 'autonomy']),
  // bene ＝ 良い（ラテン語 bene「良く」）
  bene: Object.freeze(['beneficial', 'benefit', 'benevolence', 'benevolent']),
  // bio ＝ 生命（ギリシャ語 bios「生命」）
  bio: Object.freeze(['antibiotic', 'autobiography', 'biodegradable', 'biodiversity', 'biography', 'biological', 'biosphere', 'symbiosis', 'symbiotic']),
  // cap / cept ＝ 取る・つかむ（ラテン語 capere「取る」）
  cept: Object.freeze(['capability', 'captivate', 'captivating', 'captive', 'captivity', 'captor', 'conceptual', 'deception', 'deceptive', 'exception', 'exceptional', 'incapable', 'incapacitate', 'incapacity', 'inception', 'perceptible', 'perception', 'perceptive', 'precept', 'reception']),
  // ceed / cess ＝ 進む・行く（ラテン語 cēdere「進む・譲る」）
  cess: Object.freeze(['cessation', 'exceedingly', 'excess', 'excessive', 'excessively', 'incessant', 'recession', 'successful', 'succession', 'successive', 'successor']),
  // chron ＝ 時（ギリシャ語 khronos「時」）
  chron: Object.freeze(['anachronism', 'chronic']),
  // circ ＝ 輪・まわり（ラテン語 circus / circum「輪」）
  circ: Object.freeze(['circle', 'circuit', 'circuitous', 'circular', 'circularity', 'circulate', 'circulation', 'circulatory', 'circumspect', 'circumstance', 'circumstantial', 'circumvent']),
  // claim / clam ＝ 叫ぶ・主張する（ラテン語 clāmāre「叫ぶ」）
  claim: Object.freeze(['claim', 'claims', 'clamor', 'exclaim', 'exclamation', 'proclaim', 'proclamation']),
  // clud / clus / clos ＝ 閉じる（ラテン語 claudere「閉じる」）
  clud: Object.freeze(['close', 'closing', 'conclude', 'concluding', 'conclusion', 'conclusive', 'disclose', 'disclosure', 'exclude', 'exclusion', 'exclusive', 'exclusively', 'include', 'inclusion', 'inclusive', 'inclusivity', 'preclude', 'recluse', 'reclusive', 'seclude', 'secluded', 'seclusion']),
  // corp ＝ 体（ラテン語 corpus「体」）
  corp: Object.freeze(['corporate', 'corporation', 'corpse', 'incorporate']),
  // crat / cracy ＝ 支配・力（ギリシャ語 kratos「力」）
  crat: Object.freeze(['autocracy', 'autocrat', 'autocratic']),
  // cred ＝ 信じる（ラテン語 crēdere「信じる」）
  cred: Object.freeze(['credence', 'credential', 'credibility', 'credible', 'credit', 'creditworthy', 'credulity', 'credulous', 'incredible']),
  // dict / dic ＝ 言う・示す（ラテン語 dīcere「言う」）
  dict: Object.freeze(['abdicate', 'dedicate', 'dedicated', 'dedication', 'dictator', 'dictatorial', 'dictatorship', 'dictionary', 'indicate', 'indication', 'indicator', 'indict', 'predicament', 'predictable']),
  // doc ＝ 教える（ラテン語 docēre「教える」）
  doc: Object.freeze(['docile', 'doctrinal', 'doctrine', 'document']),
  // duc / duct ＝ 導く（ラテン語 dūcere「導く」）
  duct: Object.freeze(['conducive', 'conductivity', 'conductor', 'deduce', 'deduct', 'deduction', 'induce', 'producer', 'production', 'productive', 'productivity', 'products', 'reduced', 'reduction']),
  // dur ＝ 続く・固い（ラテン語 dūrāre / dūrus「続く・固い」）
  dur: Object.freeze(['durability', 'durable', 'duration', 'during', 'endurance', 'endure', 'enduring', 'obdurate']),
  // equ ＝ 等しい（ラテン語 aequus「等しい」）
  equ: Object.freeze(['adequacy', 'adequate', 'adequately', 'equal', 'equality', 'equally', 'equanimity', 'equation', 'equator', 'equilibrium', 'equitable', 'equity', 'equivalence', 'equivalent', 'equivocal', 'equivocate', 'inequality', 'inequitable', 'inequity', 'unequal']),
  // fac / fect / fic ＝ 作る・なす（ラテン語 facere「作る・なす」）
  fact: Object.freeze(['affection', 'affectionate', 'defect', 'defective', 'deficiency', 'deficient', 'deficit', 'effective', 'effectively', 'efficacy', 'efficiency', 'efficient', 'efficiently', 'facilitate', 'facilitating', 'facts', 'faculty', 'infect', 'infection', 'infectious', 'office', 'officer', 'official', 'officially', 'proficiency', 'proficient', 'sufficiency', 'sufficiently']),
  // fer ＝ 運ぶ・もたらす（ラテン語 ferre「運ぶ」）
  fer: Object.freeze(['confer', 'conference', 'defer', 'deference', 'fertile', 'fertilize', 'infer', 'inference', 'preferable', 'preference', 'preferential', 'referee', 'reference', 'suffering']),
  // fid ＝ 信頼（ラテン語 fīdere「信じる」）
  fid: Object.freeze(['confide', 'confidence', 'confident', 'confidential', 'confidentiality', 'confidently', 'fidelity', 'infidelity', 'perfidy']),
  // fin ＝ 終わり・限界（ラテン語 fīnis「終わり・境界」）
  fin: Object.freeze(['affinity', 'confine', 'confinement', 'define', 'definite', 'definitely', 'definitive', 'final', 'finale', 'finally', 'finance', 'financial', 'fine', 'finish', 'finite', 'infinite', 'infinity', 'refine', 'refined', 'refinement', 'unfinished']),
  // firm ＝ 固い（ラテン語 firmus「固い」）
  firm: Object.freeze(['affirm', 'confirm', 'confirmation', 'firm', 'firmly']),
  // flect / flex ＝ 曲げる（ラテン語 flectere「曲げる」）
  flect: Object.freeze(['deflect', 'flexibility', 'inflexibility', 'inflexible', 'reflect', 'reflective', 'reflex']),
  // flu ＝ 流れる（ラテン語 fluere「流れる」）
  flu: Object.freeze(['affluence', 'affluent', 'confluence', 'fluctuate', 'fluctuation', 'fluent', 'fluid', 'influence', 'influential', 'influx', 'superfluous']),
  // form ＝ 形づくる（ラテン語 forma「形」）
  form: Object.freeze(['conform', 'conformity', 'form', 'formal', 'formally', 'format', 'formation', 'formula', 'formulate', 'formulation', 'inform', 'informal', 'informally', 'information', 'informative', 'reform', 'transform']),
  // fract / frag ＝ 砕く・壊す（ラテン語 frangere「砕く」）
  fract: Object.freeze(['fraction', 'fractious', 'fracture', 'fragile', 'fragility', 'fragment', 'fragmentation', 'refractory']),
  // fund / found ＝ 底・基礎（ラテン語 fundus「底」）
  fund: Object.freeze(['foundation', 'fund', 'fundamental', 'fundamentally', 'profoundly']),
  // gen ＝ 生む・種（ラテン語 genus / gignere「生む」）
  gen: Object.freeze(['congenial', 'engender', 'gender', 'gene', 'generalist', 'generalize', 'generally', 'generosity', 'generously', 'genetic', 'genial', 'genome', 'genre', 'gentle', 'gentleman', 'gentleness', 'gently', 'genuine', 'genuinely', 'ingenuity', 'ingenuous']),
  // geo ＝ 地球・土地（ギリシャ語 gē「大地」）
  geo: Object.freeze(['geometry', 'geothermal']),
  // grad / gress ＝ 進む・段階（ラテン語 gradī / gradus「歩む」）
  grad: Object.freeze(['aggressive', 'congress', 'congressional', 'congressman', 'degradation', 'gradation', 'grade', 'gradual', 'gradually', 'graduate', 'graduation', 'progress', 'progression', 'progressive', 'progressively', 'transgress', 'undergraduate']),
  // graph / gram ＝ 書く・描く（ギリシャ語 graphein「書く」）
  graph: Object.freeze(['biography', 'geographic', 'geography', 'grammar', 'photographer', 'telegram', 'telegraph']),
  // grat ＝ 感謝・喜ばせる（ラテン語 grātus「うれしい」）
  grat: Object.freeze(['congratulate', 'grateful', 'gratitude', 'gratuitous', 'ingratiate']),
  // ject ＝ 投げる（ラテン語 iacere「投げる」）
  ject: Object.freeze(['abject', 'dejected', 'injection', 'objection', 'objectionable', 'objective', 'rejection', 'subjective', 'trajectory']),
  // jud / jur / jus ＝ 法・正しい（ラテン語 jūs / jūdicāre「法・裁く」）
  jud: Object.freeze(['conjure', 'injure', 'injured', 'injury', 'injustice', 'judge', 'judgment', 'judicial', 'judiciary', 'jurisdiction', 'jury', 'just', 'justice', 'justification', 'justify', 'prejudice', 'prejudiced', 'unjust']),
  // lect ＝ 選ぶ・読む（ラテン語 legere「集める・読む」）
  lect: Object.freeze(['collect', 'collected', 'collection', 'collective', 'collectively', 'lecture', 'lecturer', 'select', 'selection', 'selective']),
  // liber ＝ 自由（ラテン語 līber「自由な」）
  liber: Object.freeze(['liberal', 'liberally', 'liberate', 'liberation', 'liberty']),
  // loc ＝ 場所（ラテン語 locus「場所」）
  loc: Object.freeze(['allocate', 'allocated', 'allocation', 'locate', 'located', 'location', 'relocate', 'relocation']),
  // magn ＝ 大きい（ラテン語 magnus「大きい」）
  magn: Object.freeze(['magnanimous', 'magnificent', 'magnify', 'magnitude']),
  // mand / mend ＝ 命じる・任せる（ラテン語 mandāre「任せる」）
  mand: Object.freeze(['command', 'commander', 'commend', 'commendable', 'demand', 'demanding', 'demands', 'mandate', 'mandatory']),
  // manu ＝ 手（ラテン語 manus「手」）
  manu: Object.freeze(['manual', 'manually', 'manufacture', 'manufacturer', 'manuscript']),
  // medi ＝ 中間（ラテン語 medius「中間の」）
  medi: Object.freeze(['immediate', 'immediately', 'intermediary', 'mediate', 'mediation', 'mediator', 'medieval', 'mediocre', 'mediocrity', 'medium']),
  // meter / metr ＝ 測る・尺度（ギリシャ語 metron「尺度」）
  meter: Object.freeze(['diameter', 'geometry', 'meter', 'parameter', 'symmetry']),
  // migr ＝ 移動する（ラテン語 migrāre「移る」）
  migr: Object.freeze(['immigrant', 'immigrate', 'immigration', 'migrant', 'migrate', 'migration', 'migratory']),
  // mit / miss ＝ 送る（ラテン語 mittere「送る」）
  miss: Object.freeze(['admittedly', 'commission', 'commit', 'commitment', 'committed', 'committee', 'dismiss', 'dismissal', 'intermittent', 'missile', 'permission', 'remiss', 'remit', 'remittance', 'submission', 'submissive']),
  // mono ＝ 一つ（ギリシャ語 monos「単一」）
  mono: Object.freeze(['monopoly', 'monotonous', 'monotony']),
  // mort ＝ 死（ラテン語 mors / mortis「死」）
  mort: Object.freeze(['immortal', 'immortality', 'mortal', 'mortality', 'mortgage', 'mortified', 'mortify']),
  // mov / mot ＝ 動く（ラテン語 movēre「動く」）
  mot: Object.freeze(['commotion', 'motionless', 'motivate', 'motivated', 'motivation', 'motor', 'movable', 'movement', 'movie', 'moving', 'remote', 'removal']),
  // multi ＝ 多い（ラテン語 multus「多い」）
  multi: Object.freeze(['multiple', 'multiplicity', 'multiply']),
  // nat ＝ 生まれる（ラテン語 nāscī / nātus「生まれる」）
  nat: Object.freeze(['innate', 'international', 'nation', 'national', 'nationalism', 'nationality', 'nationwide', 'native', 'natural']),
  // nounce / nunci ＝ 告げる（ラテン語 nūntiāre「知らせる」）
  nounce: Object.freeze(['announce', 'announcement', 'announcements', 'denounce', 'denounced', 'denunciation', 'pronounce', 'renounce']),
  // nov ＝ 新しい（ラテン語 novus「新しい」）
  nov: Object.freeze(['innovate', 'innovation', 'innovative', 'innovator', 'novel', 'novelist', 'novice', 'renovate', 'renovation']),
  // numer ＝ 数（ラテン語 numerus「数」）
  numer: Object.freeze(['numerous']),
  // part ＝ 部分・分ける（ラテン語 pars / partīre「部分」）
  part: Object.freeze(['depart', 'department', 'departure', 'impartial', 'part', 'partial', 'partially', 'participant', 'participate', 'participation', 'particle', 'particular', 'particularly', 'partisan', 'partly', 'partner', 'partnership', 'party']),
  // patr / pater ＝ 父（ラテン語 pater「父」）
  patr: Object.freeze(['patriot', 'repatriate', 'repatriation']),
  // pend / pens ＝ ぶら下がる・量る・払う（ラテン語 pendēre「垂れる・量る」）
  pend: Object.freeze(['append', 'appendix', 'compensation', 'dependence', 'dependency', 'dependent', 'dispensation', 'dispense', 'expenditure', 'expenses', 'expensive', 'impending', 'pending', 'pensive', 'propensity', 'suspense', 'suspension']),
  // phil ＝ 愛する（ギリシャ語 philein「愛する」）
  phil: Object.freeze(['philander', 'philosophy']),
  // phon ＝ 音・声（ギリシャ語 phōnē「音」）
  phon: Object.freeze(['phone', 'telephone']),
  // photo / phos ＝ 光（ギリシャ語 phōs「光」）
  photo: Object.freeze(['photo', 'photocopier', 'photocopy', 'photograph', 'photographer', 'photovoltaic']),
  // plic / plex / ploy ＝ 折る・重ねる（ラテン語 plicāre「折る」）
  plic: Object.freeze(['applicant', 'application', 'complex', 'complexity', 'complicate', 'complicated', 'complicity', 'deploy', 'deployment', 'employ', 'employee', 'employer', 'employment', 'explicit', 'explicitly', 'implicate', 'implication', 'implicit', 'implicitly', 'perplex', 'perplexing', 'perplexity', 'replica', 'replicate', 'replication']),
  // popul / publ ＝ 民衆（ラテン語 populus「人々」）
  popul: Object.freeze(['populate', 'population', 'publication', 'publicity', 'publicly', 'publish', 'republic', 'republican', 'unpopular']),
  // port ＝ 運ぶ（ラテン語 portāre「運ぶ」）
  port: Object.freeze(['comport', 'deport', 'deportation', 'exportation', 'importance', 'importantly', 'importation', 'reporter', 'supporter', 'supportive']),
  // pos / pon ＝ 置く（ラテン語 pōnere「置く」）
  pos: Object.freeze(['component', 'composition', 'compostable', 'disposition', 'opponent', 'opposite', 'opposition', 'position', 'positioned', 'positive', 'postpone', 'postponed', 'posture', 'proposition']),
  // press ＝ 押す（ラテン語 premere「押す」）
  press: Object.freeze(['depressed', 'depression', 'depressive', 'expression', 'expressionless', 'expressive', 'impression', 'impressive', 'oppress', 'oppression', 'oppressive', 'repress', 'repression', 'suppress', 'suppression']),
  // prim / prin ＝ 第一・最初（ラテン語 prīmus「最初の」）
  prim: Object.freeze(['primarily', 'primate', 'prime', 'primitive', 'prince', 'princess', 'principal', 'principle']),
  // priv ＝ 個人・奪う（ラテン語 prīvus「個々の」）
  priv: Object.freeze(['deprivation', 'deprive', 'privacy', 'private', 'privilege']),
  // prob / prov ＝ ためす・証明（ラテン語 probāre「ためす」）
  prob: Object.freeze(['approbation', 'approval', 'approve', 'disprove', 'improbable', 'probability', 'probable', 'probably', 'probe', 'probity', 'prove', 'reprobate']),
  // psych ＝ 心・精神（ギリシャ語 psȳchē「魂」）
  psych: Object.freeze(['psychiatrist', 'psychologically', 'psychology']),
  // quer / quir / quis / ques ＝ 求める・問う（ラテン語 quaerere「求める」）
  quer: Object.freeze(['conquer', 'conquest', 'inquire', 'inquiry', 'inquisitive', 'query', 'quest', 'question', 'questionnaire', 'request', 'requirement']),
  // rect / reg ＝ まっすぐ・治める（ラテン語 regere「導く・治める」）
  rect: Object.freeze(['correct', 'correction', 'correctly', 'direct', 'direction', 'director', 'irregular', 'irregularly', 'rectify', 'rectitude', 'region', 'regular', 'regularly', 'regulate', 'regulation', 'regulator', 'regulatory']),
  // rupt ＝ 破る・壊す（ラテン語 rumpere「破る」）
  rupt: Object.freeze(['abrupt', 'abruptly', 'corrupt', 'corrupted', 'corruption', 'disrupt', 'disruption', 'interrupt', 'interruption', 'rupture']),
  // sacr / sanct ＝ 聖なる（ラテン語 sacer「聖なる」）
  sacr: Object.freeze(['sacred', 'sacrifice', 'sanctify', 'sanctimonious', 'sanctimony', 'sanction', 'sanctuary']),
  // sci ＝ 知る（ラテン語 scīre「知る」）
  sci: Object.freeze(['conscience', 'conscientious', 'conscious', 'consciousness', 'prescient', 'science', 'scientific', 'scientist']),
  // scrib / script ＝ 書く（ラテン語 scrībere「書く」）
  script: Object.freeze(['conscription', 'inscribe', 'prescription', 'proscribe', 'script']),
  // sens / sent ＝ 感じる（ラテン語 sentīre「感じる」）
  sens: Object.freeze(['consensus', 'consent', 'insensitive', 'resent', 'resentful', 'resentment', 'sensation', 'sensational', 'sensible', 'sensibly', 'sensitive', 'sensitivity', 'sensor', 'sensory', 'sentence', 'sentiment', 'sentimental']),
  // sequ / secut ＝ 従う・続く（ラテン語 sequī「従う」）
  sequ: Object.freeze(['consecutive', 'consequently', 'obsequious', 'persecute', 'persecution', 'prosecute', 'prosecution', 'prosecutor', 'sequence', 'sequential', 'subsequent', 'subsequently']),
  // sign ＝ しるし（ラテン語 signum「しるし」）
  sign: Object.freeze(['assign', 'assigned', 'design', 'designate', 'designated', 'designation', 'designer', 'insignificance', 'insignificant', 'resign', 'resignation', 'sign', 'signal', 'signature', 'significance', 'significant', 'significantly']),
  // solv / solut ＝ 解く・ゆるめる（ラテン語 solvere「解く」）
  solv: Object.freeze(['absolute', 'absolutely', 'absolution', 'absolve', 'dissolution', 'dissolve', 'insolvent', 'resolute', 'resolutely', 'resolution', 'resolve', 'solution', 'solve', 'solvent']),
  // spect / spic ＝ 見る（ラテン語 specere「見る」）
  spect: Object.freeze(['despicable', 'inspection', 'inspector', 'perspicacious', 'prospect', 'respectability', 'respectable', 'respectful', 'respective', 'respectively', 'retrospect', 'spectacular', 'spectrum']),
  // spir ＝ 呼吸する・息（ラテン語 spīrāre「息をする」）
  spir: Object.freeze(['conspiracy', 'dispirited', 'inspire', 'respiration', 'spirit', 'spirited', 'spiritual']),
  // spond / spons ＝ 約束する（ラテン語 spondēre「誓う」）
  spond: Object.freeze(['despondent', 'respond', 'responsibility', 'responsible']),
  // strict / strain ＝ 締める・張る（ラテン語 stringere「締める」）
  strict: Object.freeze(['constrain', 'constraint', 'constrict', 'constriction', 'district', 'restrain', 'restraint', 'restricted', 'restriction', 'strict']),
  // struct ＝ 建てる・積む（ラテン語 struere「建てる」）
  struct: Object.freeze(['destruction', 'instruction', 'instructive', 'instructor', 'obstructed', 'obstructive']),
  // tact / tang / tag ＝ 触れる（ラテン語 tangere「触れる」）
  tact: Object.freeze(['contact', 'contagious', 'intact', 'tact', 'tactful', 'tactless', 'tangible']),
  // tain / ten ＝ 保つ（ラテン語 tenēre「保つ」）
  tain: Object.freeze(['container', 'detain', 'pertain', 'sustainability', 'sustainable']),
  // tele ＝ 遠い（ギリシャ語 tēle「遠く」）
  tele: Object.freeze(['telemedicine', 'telephone', 'television']),
  // tempor ＝ 時（ラテン語 tempus「時」）
  tempor: Object.freeze(['contemporary', 'temporary']),
  // tend / tens ＝ 伸ばす・張る（ラテン語 tendere「伸ばす」）
  tend: Object.freeze(['attendant', 'extended', 'extension', 'extensive', 'intense', 'intensely', 'intensified', 'intensify', 'intensity', 'pretense', 'tend', 'tendentious', 'tense']),
  // terr ＝ 土地・大地（ラテン語 terra「大地」）
  terr: Object.freeze(['terrestrial', 'territory']),
  // therm ＝ 熱（ギリシャ語 thermē「熱」）
  therm: Object.freeze(['geothermal', 'thermal']),
  // tort ＝ ねじる（ラテン語 torquēre「ねじる」）
  tort: Object.freeze(['distort', 'retort', 'tortuous', 'torture', 'torturous']),
  // tract ＝ 引く（ラテン語 trahere「引く」）
  tract: Object.freeze(['abstraction', 'attractive', 'contraction', 'distracted', 'distraction', 'extraction', 'intractable', 'protract', 'subtraction', 'tractable', 'tractor']),
  // typ ＝ 型・打つ（ギリシャ語 typos「型」）
  typ: Object.freeze(['type', 'typical']),
  // vac ＝ 空（から）（ラテン語 vacāre「空である」）
  vac: Object.freeze(['vacancy', 'vacant', 'vacate', 'vacation', 'vacuous', 'vacuum']),
  // vad / vas ＝ 行く・進む（ラテン語 vādere「行く」）
  vad: Object.freeze(['invade', 'pervade', 'pervasive']),
  // val / vail ＝ 価値・力（ラテン語 valēre「力がある」）
  val: Object.freeze(['convalescence', 'invalid', 'invalidate', 'prevalent', 'valiant', 'valid', 'validate', 'validity', 'valor', 'valuable', 'value']),
  // ven / vent ＝ 来る（ラテン語 venīre「来る」）
  vent: Object.freeze(['adventurer', 'convene', 'convenience', 'convention', 'conventional', 'intervene', 'intervention', 'invented', 'invention', 'inventive', 'inventiveness', 'inventor', 'inventory', 'prevention', 'revenue', 'venture']),
  // veri ＝ 真実（ラテン語 vērus「真の」）
  veri: Object.freeze(['verification', 'verify']),
  // vert / vers ＝ 回す・向ける（ラテン語 vertere「回す」）
  vers: Object.freeze(['adverse', 'advertise', 'advertisement', 'conversation', 'conversational', 'converse', 'conversely', 'diversion', 'diversity', 'divert', 'reversal', 'versatility', 'verse', 'version', 'versus', 'vertical']),
  // vid / vis ＝ 見る（ラテン語 vidēre「見る」）
  vis: Object.freeze(['advise', 'adviser', 'envisage', 'envision', 'invidious', 'invisible', 'provision', 'provisional', 'revise', 'revision', 'supervision', 'supervisor', 'television', 'visionary', 'visit', 'visual', 'visualize']),
  // viv ＝ 生きる（ラテン語 vīvere「生きる」）
  viv: Object.freeze(['revival', 'revive', 'vivacious', 'vivid', 'vividly']),
  // voc / vok ＝ 声・呼ぶ（ラテン語 vocāre / vōx「呼ぶ・声」）
  voc: Object.freeze(['invocation', 'invoke', 'provocation', 'revoke', 'vociferate', 'vociferous']),
  // volv / volut ＝ 回す・巻く（ラテン語 volvere「回す」）
  volv: Object.freeze(['convoluted', 'involve', 'involvement', 'revolution', 'revolutionary', 'revolve']),
})

// 綴りは合うのに語源が別だった語。再監査で同じ誤りを繰り返さないために残す。
export const REJECTED_MORPHEME_LINKS = Object.freeze([
  Object.freeze({ root: 'medi', word: 'telemedicine', reason: 'medicine は medicus / medērī「治す」由来で、medius「中間」とは別系統' }),
  Object.freeze({ root: 'lect', word: 'dialect', reason: 'ギリシャ語 dialektos < legein 由来で、カードが示すラテン語 legere とは別言語の系統' }),
  Object.freeze({ root: 'pos', word: 'composed', reason: '古フランス語 poser（後期ラテン語 pausāre）系の -pose 動詞は pōnere と混ざった形' }),
  Object.freeze({ root: 'pos', word: 'composer', reason: '同上' }),
  Object.freeze({ root: 'pos', word: 'composure', reason: '同上' }),
  Object.freeze({ root: 'pos', word: 'depose', reason: '同上' }),
  Object.freeze({ root: 'pos', word: 'disposable', reason: '同上' }),
  Object.freeze({ root: 'pos', word: 'dispose', reason: '同上' }),
  Object.freeze({ root: 'pos', word: 'exposed', reason: '同上' }),
  Object.freeze({ root: 'pos', word: 'exposure', reason: '同上' }),
  Object.freeze({ root: 'pos', word: 'impose', reason: '同上' }),
  Object.freeze({ root: 'pos', word: 'imposed', reason: '同上' }),
  Object.freeze({ root: 'pos', word: 'oppose', reason: '同上' }),
  Object.freeze({ root: 'pos', word: 'suppose', reason: '同上' }),
  Object.freeze({ root: 'pos', word: 'supposedly', reason: '同上' }),
])

