// 外部の語源資料をきっかけに、既存の全語彙を再監査して確認した補助語根。
// 著作物の文章・図・配列は保存せず、語源という事実だけをアプリ独自の短い表現にする。
//
// 重要:
// - 綴りの部分一致では誤語源が混ざるため、単語は下の許可リストで明示する。
// - referenceRoots は、手動監査台帳に載った語根だけ公開語源カードと辞書表示に使う。
//   保存互換用の旧カードIDを守るため、etymology-compression.js の旧分類には使わない。

import { AUDITED_MORPHEME_ROOT_WORDS } from './etymology-morpheme-audit.js'
import { CLASSICAL_ROOT_WORDS } from './etymology-classical-roots.js'

export const REFERENCE_ROOTS = [
  { id: 'mini', form: 'minu / mini / minor', meaning: '小さい・少ない', origin: 'ラテン語 minuere / minor「小さくする・より小さい」', emoji: '🔎' },
  { id: 'mon', form: 'mon / monit', meaning: '注意を向ける・思い出させる', origin: 'ラテン語 monēre「注意させる」', emoji: '🔔' },
  { id: 'punct', form: 'point / punct', meaning: '刺す・点', origin: 'ラテン語 pungere / punctum「刺す・刺した点」', emoji: '📍' },
  { id: 'cura', form: 'cur / cure', meaning: '世話・注意', origin: 'ラテン語 cūra「世話・注意」', emoji: '🫶' },
  { id: 'curr', form: 'cur / curr / curs', meaning: '走る・流れる', origin: 'ラテン語 currere「走る」', emoji: '🏃' },
  { id: 'serv', form: 'serv', meaning: '守る・保つ', origin: 'ラテン語 servāre「守る・保つ」', emoji: '🛡️' },
  { id: 'servire', form: 'serv', meaning: '仕える', origin: 'ラテン語 servīre「仕える」', emoji: '🤝' },
  { id: 'fend', form: 'fend / fens', meaning: '打つ・防ぐ', origin: 'ラテン語 fendere「打つ」', emoji: '🥊' },
  { id: 'cresc', form: 'cresc / creas', meaning: '育つ・増える', origin: 'ラテン語 crēscere「育つ」', emoji: '📈' },
  { id: 'pet', form: 'pet / petit', meaning: '求める・向かう', origin: 'ラテン語 petere「求める・向かう」', emoji: '🎯' },
  { id: 'memor', form: 'memor / memo', meaning: '覚えている', origin: 'ラテン語 memor「覚えている」', emoji: '🧠' },
  { id: 'pel', form: 'pel / puls', meaning: '押す・駆り立てる', origin: 'ラテン語 pellere / pulsus「押す」', emoji: '👉' },
  { id: 'cide', form: 'cide / cise', meaning: '切る', origin: 'ラテン語 caedere「切る」', emoji: '✂️' },
  { id: 'bat', form: 'bat / batt', meaning: '打つ', origin: '後期ラテン語 battuere「打つ」', emoji: '⚔️' },
  { id: 'turn', form: 'tour / turn', meaning: '回る', origin: 'ラテン語 tornāre「回す」', emoji: '↩️' },
  { id: 'sta', form: 'sta / stat / stit / sist', meaning: '立つ・置く', origin: 'ラテン語 stāre / sistere / statuere「立つ・立てる」', emoji: '🧍' },
  { id: 'pass', form: 'pass / pace', meaning: '歩み・通る', origin: 'ラテン語 passus「歩み」', emoji: '👣' },
  { id: 'long', form: 'long / leng', meaning: '長い', origin: '古英語 lang / ラテン語 longus「長い」', emoji: '📏' },
  { id: 'testis', form: 'test / testi', meaning: '証人・証言する', origin: 'ラテン語 testis / testārī「証人・証言する」', emoji: '🗣️' },
  { id: 'hab', form: 'hab / hibit', meaning: '持つ・保つ', origin: 'ラテン語 habēre「持つ」', emoji: '🤲' },
  { id: 'plere', form: 'ple / plete', meaning: '満たす', origin: 'ラテン語 plēre「満たす」', emoji: '🫗' },
  { id: 'simil', form: 'simil / sembl', meaning: '似ている・一緒', origin: 'ラテン語 similis / simul「似た・一緒に」', emoji: '🪞' },
  { id: 'sult', form: 'sult / sal', meaning: '跳ぶ', origin: 'ラテン語 salīre / saltāre「跳ぶ」', emoji: '🦘' },
  { id: 'fort', form: 'fort / forc', meaning: '強い', origin: 'ラテン語 fortis「強い」', emoji: '💪' },
  { id: 'mod', form: 'mod', meaning: '尺度・型', origin: 'ラテン語 modus「尺度・方法」', emoji: '📐' },
  { id: 'lev', form: 'lev', meaning: '軽い・持ち上げる', origin: 'ラテン語 levis / levāre「軽い・持ち上げる」', emoji: '🎈' },
  { id: 'clin', form: 'clin', meaning: '傾く', origin: 'ラテン語 clīnāre「傾ける」', emoji: '📉' },
  { id: 'ped', form: 'ped', meaning: '足', origin: 'ラテン語 pēs / pedis「足」', emoji: '🦶' },
  { id: 'cord', form: 'cor / cord', meaning: '心・心臓', origin: 'ラテン語 cor / cordis「心・心臓」', emoji: '❤️' },
  { id: 'it', form: 'it / iter', meaning: '行く', origin: 'ラテン語 īre / itum「行く」', emoji: '🚶' },
  { id: 'util', form: 'uti / use / util', meaning: '使う・役立つ', origin: 'ラテン語 ūtī / ūtilis「使う・役立つ」', emoji: '🧰' },
  { id: 'ori', form: 'ori / origin', meaning: '生まれる・昇る', origin: 'ラテン語 orīrī「生じる・昇る」', emoji: '🌅' },
  { id: 'stinct', form: 'stinct / sting', meaning: '刺す・印をつける', origin: 'ラテン語 stinguere「刺す」につながる語形', emoji: '📌' },
  { id: 'pare', form: 'par / pare', meaning: '整える・準備する', origin: 'ラテン語 parāre「整える」', emoji: '🧰' },
  { id: 'path', form: 'path', meaning: '感じる・苦しむ', origin: 'ギリシャ語 pathos「感情・苦しみ」', emoji: '💗' },
  { id: 'nom', form: 'nom / nym', meaning: '名前', origin: 'ラテン語 nōmen / ギリシャ語 onyma「名前」', emoji: '🏷️' },
  { id: 'cert', form: 'cert / cern / crit', meaning: '見分ける・決める', origin: 'ラテン語 cernere / ギリシャ語 krinein「見分ける」', emoji: '🔍' },
  { id: 'cover', form: 'cover / covert', meaning: '覆う', origin: 'ラテン語 cooperīre「覆う」から古フランス語を経た形', emoji: '☂️' },
  { id: 'via', form: 'via / voy', meaning: '道', origin: 'ラテン語 via「道」', emoji: '🛣️' },
  { id: 'caput', form: 'capit / chief', meaning: '頭・先頭', origin: 'ラテン語 caput「頭」', emoji: '👑' },
  { id: 'ord', form: 'ord / ordin', meaning: '順序', origin: 'ラテン語 ordō / ordinis「順序」', emoji: '🔢' },
  { id: 'cast', form: 'cast', meaning: '投げる', origin: '古ノルド語 kasta「投げる」', emoji: '🤾' },
  { id: 'lig', form: 'lig / li', meaning: '結ぶ', origin: 'ラテン語 ligāre「結ぶ」', emoji: '🪢' },
  { id: 'carr', form: 'car / carr / charg', meaning: '車・運ぶ', origin: '後期ラテン語 carrus「車」', emoji: '🛞' },
  { id: 'arma', form: 'arm / arma', meaning: '武器・武装する', origin: 'ラテン語 arma「武器」', emoji: '🛡️' },
  { id: 'pear', form: 'par / pear', meaning: '現れる', origin: 'ラテン語 appārēre「現れる」', emoji: '👁️' },
  { id: 'fari', form: 'fa / fam / fabl', meaning: '話す', origin: 'ラテン語 fārī「話す」', emoji: '💬' },
  { id: 'ton', form: 'ton / tone', meaning: '張り・調子', origin: 'ギリシャ語 tonos「張り・調子」', emoji: '🎵' },
  { id: 'ann', form: 'ann / enn', meaning: '年', origin: 'ラテン語 annus「年」', emoji: '📅' },
  { id: 'sed', form: 'sed / sid / sess', meaning: '座る', origin: 'ラテン語 sedēre「座る」', emoji: '🪑' },
// 資料の掲載順は保持せず、アプリ固有のID順で表示する。
].sort((left, right) => left.id.localeCompare(right.id, 'en'))

// 単純な綴り一致で拾うと imminent→mini、curse→curr、passion→pass などの
// 誤接続が起きる。全項目を既存の語源メモと照合した完全一致リストに限定する。
export const REFERENCE_ROOT_WORDS = {
  ann: ['anniversary', 'annual', 'annually', 'annuity', 'biennial', 'biennially', 'perennial'],
  sed: ['preside', 'president'],
  mini: ['administer', 'administrative', 'administration', 'diminish', 'diminished', 'minimum', 'minimal', 'minimalism', 'minimize', 'minor', 'minority', 'minute', 'minister', 'ministry'],
  mon: ['admonish', 'admonition', 'monitor', 'monitoring', 'monument'],
  punct: ['appoint', 'appointed', 'appointment', 'point', 'punctual', 'punctuality', 'compunction', 'punctilious'],
  cura: ['accurate', 'accuracy', 'accurately', 'inaccuracy', 'inaccurate', 'cure', 'curious', 'procure', 'secure', 'security', 'sure', 'reassure'],
  curr: ['occur', 'occurrence', 'current', 'currently', 'currency', 'curriculum', 'cursor', 'precursor', 'cursory', 'recurrence', 'recurrent', 'discursive', 'concurrent', 'course', 'excursion', 'recourse'],
  serv: ['observe', 'observant', 'observation', 'observer', 'observance', 'conserve', 'conservation', 'conservationist', 'conservative', 'preserve', 'preservation', 'reserve', 'reservation', 'reserved'],
  servire: ['serve', 'server', 'service', 'servicing', 'servant', 'servile', 'servitude', 'deserve'],
  fend: ['offend', 'offender', 'offense', 'offensive', 'defend', 'defendant', 'defense', 'defensive', 'defenseless'],
  cresc: ['concrete', 'increase', 'increased', 'increasingly', 'decrease', 'decreased'],
  pet: ['compete', 'competent', 'competence', 'competition', 'competitive', 'competitor', 'appetite', 'impetus', 'impetuous', 'petition', 'repeat'],
  memor: ['commemorate', 'commemoration', 'commemorative', 'memory', 'memorial', 'memoir', 'memorable', 'memorize', 'immemorial', 'remembrance'],
  pel: ['compel', 'compelling', 'compulsion', 'compulsory', 'expel', 'expulsion', 'impel', 'impulse', 'impulsive', 'propel', 'propeller', 'propulsion', 'repel', 'repellent', 'repulsive', 'dispel', 'pulse'],
  cide: ['decide', 'decision', 'precise', 'precisely', 'concise', 'concisely', 'suicide'],
  bat: ['debate', 'battle', 'battlefield', 'battleship', 'batter', 'combat', 'combatant'],
  turn: ['detour', 'tour', 'tourism', 'tourist', 'tournament', 'turn', 'return', 'overturn', 'turnaround', 'turncoat'],
  sta: ['substitute', 'substitution', 'substance', 'constitute', 'constitution', 'constitutional', 'constituency', 'institution', 'institute', 'destitute', 'restitution', 'exist', 'consist', 'consistent', 'consistently', 'consistency', 'assist', 'assistant', 'persist', 'persistent', 'persistence', 'insist', 'insistence', 'insistent', 'resist', 'resistance', 'resistant', 'state', 'status', 'station', 'static', 'stable', 'statute', 'stance', 'constant', 'contrast', 'circumstance', 'circumstantial', 'distance', 'distant', 'instant', 'extant', 'obstacle', 'subsist', 'subsistence'],
  pass: ['surpass', 'pass', 'passable', 'passage', 'passenger', 'passer-by', 'pace', 'compass', 'passport', 'impasse', 'impassable'],
  long: ['prolong', 'prolonged', 'long', 'length', 'lengthy', 'lengthen', 'lengthened', 'longevity', 'longitude', 'wavelength'],
  testis: ['protest', 'testimony', 'contest', 'contestant', 'testify', 'attest', 'detest', 'detestable', 'contestable'],
  hab: ['prohibit', 'prohibition', 'exhibit', 'exhibition', 'inhibit', 'habit', 'habitual', 'habituate', 'inhabit', 'inhabitant', 'habitat'],
  plere: ['supply', 'accomplish', 'comply', 'complete', 'implement', 'deplete', 'compliment', 'supplement', 'supplementary', 'replenish', 'complement', 'replete'],
  simil: ['resemble', 'resemblance', 'similar', 'similarity', 'similarly', 'simultaneous', 'dissimilar', 'assemble', 'assembly', 'assimilate', 'assimilation', 'dissemble'],
  sult: ['result', 'resilient', 'salient', 'assail'],
  fort: ['reinforce', 'reinforcement', 'force', 'forces', 'forceful', 'forcefully', 'enforce', 'enforced', 'enforcement', 'fort', 'fortify', 'fortitude', 'fortress', 'effort', 'effortless', 'comfort', 'comfortable', 'comforting'],
  mod: ['remodel', 'model', 'module', 'modify', 'modification', 'moderate', 'moderately', 'moderation', 'modest', 'modesty', 'modern', 'modernize', 'commodity', 'commodious', 'modicum'],
  lev: ['relieve', 'relief', 'alleviate', 'alleviation', 'relevant', 'relevance', 'lever', 'levy', 'levied', 'levity', 'elevate', 'elevation'],
  clin: ['incline', 'inclination', 'decline', 'declining', 'recline'],
  ped: ['impediment', 'impede', 'impeding', 'expedite', 'expedition', 'expedient', 'pedal', 'pedestrian'],
  cord: ['encourage', 'courage', 'courageous', 'cordial', 'core', 'discord', 'discordant', 'accord', 'according', 'record', 'discourage', 'discouragement', 'encouragement', 'discouraged', 'encouraged'],
  it: ['initiate', 'initial', 'initially', 'initiative', 'itinerant', 'itinerary', 'transition', 'transit', 'transient', 'exit', 'issue', 'circuit', 'ambitious'],
  util: ['abuse', 'usage', 'utilize', 'utility'],
  ori: ['abort', 'abortion', 'abortive', 'origin', 'original', 'originally', 'originality', 'originate', 'orient', 'orientation'],
  stinct: ['distinguish', 'distinction', 'distinguishable', 'distinct', 'distinctive', 'instinct', 'instinctive'],
  pare: ['separate', 'sever', 'prepare', 'preparation', 'repair', 'apparatus', 'reparation'],
  path: ['apathy', 'empathy', 'sympathy', 'sympathetic', 'sympathize', 'antipathy', 'pathogen'],
  nom: ['anonymous', 'anonymity', 'denominate', 'denomination', 'nominal', 'nominate', 'nomination', 'nominee'],
  cert: ['uncertain', 'uncertainty', 'certain', 'certainty', 'certainly', 'ascertain', 'certificate', 'certify', 'critic', 'criterion', 'criticize', 'criticism', 'critique', 'criticized', 'crisis'],
  cover: ['uncover', 'uncovered', 'cover', 'covert', 'covertly', 'discover', 'discovery', 'discovered', 'discoverable'],
  via: ['trivial', 'voyage', 'deviate', 'deviation', 'devious', 'obviate', 'envoy'],
  caput: ['achieve', 'chief', 'capital', 'capitalism', 'capitalist', 'capitalize', 'captain', 'chapter', 'cape'],
  ord: ['subordinate', 'subordination', 'insubordinate', 'insubordination', 'ordinary', 'extraordinary', 'coordinate', 'coordination', 'coordinator', 'ordinance', 'order'],
  cast: ['forecast', 'cast', 'castaway', 'broadcast', 'downcast', 'overcast'],
  lig: ['rely', 'oblige', 'obligation', 'obligatory', 'ally'],
  carr: ['discharge', 'car', 'charge', 'charges', 'charged', 'cargo', 'career', 'carrier', 'carriage'],
  arma: ['disarm', 'disarmament', 'army', 'armistice', 'arms', 'armament', 'armaments', 'armed', 'unarmed', 'alarm', 'alarming'],
  pear: ['disappear', 'appear', 'appearance', 'apparition', 'apparent', 'apparently', 'transparent', 'transparency'],
  fari: ['infant', 'infancy', 'preface', 'affable', 'ineffable', 'fable', 'fabled', 'famous', 'fame', 'infamous', 'infamy', 'defame'],
  ton: ['monotone', 'monotonous', 'monotony', 'tonic'],

  // 既存語根の綴り違い。新しい語根は増やさず、事実上同じ語根へだけつなぐ。
  tract: ['attraction', 'contractor', 'retreat', 'treat', 'treatment', 'treaty', 'trait'],
  vis: ['improvisation', 'improvise', 'preview', 'survey', 'visibility'],
  viv: ['survive', 'survival'],
  vac: ['evacuate'],
  manu: ['emancipate'],
  cept: ['emancipate'],
  gen: ['congenital', 'degenerate', 'indigenous', 'photogenic'],
  plic: ['duplicate', 'multiple', 'multiplicity'],
  vers: ['anniversary', 'universal'],
  duct: ['abduct', 'abduction', 'introduction'],
  dict: ['addict', 'dictation', 'prediction'],
  spect: ['expectancy', 'prospective'],
  struct: ['constructive', 'destructive', 'obstruction'],
  mot: ['demote', 'demotion', 'promotion'],
  grad: ['degrade'],
  rect: ['regime', 'regional'],
  fin: ['confined', 'definition'],
  sens: ['assent', 'dissent'],
  clud: ['enclose', 'enclosure', 'including'],
  jud: ['juror'],
  medi: ['intermediate', 'mediterranean'],
  nat: ['naturalize', 'supernatural'],
  patr: ['compatriot', 'expatriate', 'paternal', 'paternity', 'patriotic', 'patronize'],
  strict: ['strain'],
  tact: ['contagion', 'intangible'],
  spir: ['conspire', 'inspiration', 'perspiration', 'perspire'],
  sign: ['consign', 'consignment', 'signify'],
  volv: ['devolve'],
  photo: ['photogenic'],
  geo: ['geographic', 'geography'],
  tele: ['telegram', 'telegraph'],
  mono: ['monochrome', 'monocycle', 'monologue', 'monotone'],
  form: ['deform', 'transformation'],
  miss: ['admittance'],
  fact: ['signify', 'suffice'],
  cess: ['recess'],
  pos: ['imposing', 'supposing'],
  voc: ['avocation', 'vocation', 'vocational'],
}

// 手書きの許可リストと、形態素分解の候補を1語ずつ辞書で確かめた台帳を合わせて引く。
// どちらも「確認済みの明示リンク」で、綴りの自動推測はここへ入れない。
const REFERENCE_ROOT_IDS_BY_WORD = new Map()
for (const source of [REFERENCE_ROOT_WORDS, AUDITED_MORPHEME_ROOT_WORDS, CLASSICAL_ROOT_WORDS]) {
  for (const [rootId, words] of Object.entries(source)) {
    for (const word of words) {
      const key = word.toLowerCase()
      if (!REFERENCE_ROOT_IDS_BY_WORD.has(key)) REFERENCE_ROOT_IDS_BY_WORD.set(key, [])
      if (!REFERENCE_ROOT_IDS_BY_WORD.get(key).includes(rootId)) {
        REFERENCE_ROOT_IDS_BY_WORD.get(key).push(rootId)
      }
    }
  }
}

export const REFERENCE_ROOT_LINK_COUNT = [...REFERENCE_ROOT_IDS_BY_WORD.values()]
  .reduce((sum, rootIds) => sum + rootIds.length, 0)

export function referenceRootIdsForWord(word = '') {
  return REFERENCE_ROOT_IDS_BY_WORD.get(word.toLowerCase()) ?? []
}
