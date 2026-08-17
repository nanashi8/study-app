// ── 語根オートリンク（精度重視）─────────────────────────────────────
// スペルの素朴な部分一致ではなく「(既知の接頭辞)＋語根」で形態素分解できる
// 語だけに語根を付ける。さらに、同じ綴りでも語源が別系統の語は除外リストで落とす。
// これにより「語源で覚える」に出る派生語が誤っていない状態を保つ。
//
// 使い方: autoRootIds('transport') -> ['port']
// vocab.js の正規化後、手書き(etymology.parts由来)の roots とマージして使う。

// ラテン語由来の主な接頭辞（同化形を含む）。これらが語根の直前にあるときだけ採用。
const PREFIXES = [
  'ab','abs','ad','af','ag','al','an','ap','as','at',
  'com','con','co','col','cor','de','dis','di',
  'ex','ef','en','em','im','in','il','ir','inter','intro',
  'ob','oc','of','op','per','post','pre','pro','re','retro',
  'se','sub','suc','suf','sug','sup','sus','super','trans','tra',
  'un','under','over','out',
  // ギリシャ系の連結形（複合語の後半語根が一致するように接頭辞扱い）
  'photo','tele','micro','macro','auto','geo','bio','thermo','hydro',
  'mono','poly','neo','anti','para','peri','epi','dia','syn','sym','pan','ana','astro','chrono',
]
const PREFIX_SET = new Set(PREFIXES)

// 語根の検出ステム。原則は roots.js の form から作るが、短すぎ・曖昧なものは
// ここで上書きして精度を確保する（例: tain は 'ten' を使わない＝tend系の誤検出回避）。
const STEM_OVERRIDE = {
  tain: ['tain'], // 'ten'(保つ) は tend(伸ばす) と衝突するため不採用
  lect: ['lect'], // 'leg'/'lig'(法/束ねる)は別語源と衝突するため lect のみ
  veri: ['veri'], // 'ver' は very/version 等と衝突するため veri のみ
}

// 同じ綴りでも語源が別系統で、語根に含めてはいけない語（語根id -> 除外語）。
const DENY = {
  duct: ['duck'],
  vent: ['vendor','venom','seven','venal','venality','venerate','veneration','venerable','revenge','vengeance','vengeful','venal'],
  port: ['portray','portrait','portion','proportion','proportional','portend','portent','portentous','portly','opportunity','opportune'],
  spect: ['spice'],
  pos: ['ponder','ponderous','pond','postulate','possess','possession','repose','post','poster','postcard','possible'],
  fer: ['ferocious','ferociously','fervent','fervor','fervently','fervid','effervescent','inferior','inferiority','interfere'],
  cept: ['capital','capitalism','capitalist','capitalize','captain','cape','capricious','capitulate','recapitulate','recap'],
  miss: ['mitigate','enmity','miss','missing'],
  vis: ['divide','dividend','division','divisible','viscous','devise'],
  tain: ['taint','tainted','attain'],
  fact: ['fiction','fictional','fickle','face','facade','superficial','efface','facetious','facile','interface','preface'],
  mot: ['mother','moth'],
  gen: ['cogent'],
  // 追加語根の除外（同綴り・別語源）
  aud: ['audacious','audacity'],
  form: ['former','formerly','formidable','perform','performance','performer'],
  magn: ['magnet','magnetic','magnetism','magnesium','magnolia'],
  nov: ['november'],
  equ: ['equip','equipment','equipped','equestrian'],
  bene: ['beneath'],
  vac: ['vaccine','vaccinate','vaccination','vaccinated','vacillate','vacillation'],
  // 追加バッチ（ラテン/ギリシャ）の除外
  spir: ['spiral','spire'],
  val: ['valley','valve','interval'],
  rect: ['regret','regrettable','regrettably','regard','regarding','regardless','register','registration','registered'],
  fin: ['fin','finger','fingerprint','find','finding','findings'],
  fund: ['found','confound','confounded','refund'],
  sens: ['present','presently','absent'],
  sci: ['discipline','disciplinary','disciplined','disciple','scissors','rescind','scintilla','scintillating'],
  flu: ['fluster','flustered','flummox','flummoxed'],
  crat: ['crate','crater'],
  // 追加バッチ2の除外
  claim: ['clamber'],
  clud: ['cluster'],
  doc: ['dock','docks','docked'],
  fract: ['fragrance','fragrant'],
  liber: ['deliberate','deliberately','deliberation'],
  loc: ['lock','locker','lockdown','lockout','locket','locked'],
  mand: ['mendacious','mendacity','mend'],
  medi: ['medicine','medical','medication','medicinal','medic'],
  nat: ['senator','senate','senatorial'],
  prob: ['provoke','provide','provision','provisional','provincial','provocation','province','provident','providence','problem','problematic','improve','improvement','improvisation','improvise'],
  jud: ['adjustable'],
  quer: ['querulous'],
  tact: ['protagonist','antagonist','antagonism','antagonize','tactics','tactician','tag','tangle'],
  terr: ['terror','terrible','terribly','terrify','terrifying','terrified','deterrent','terrific','terrorist','terrorism','terrorize','interrupt','interruption'],
  tort: ['tortoise'],
  typ: ['typhoon'],
  vad: ['vast','vase','devastate','devastation','devastated','devastating'],
  veri: ['severity','severe','severely'],
  vers: ['covert','covertly'],
  press: ['empress'],
  tend: ['tender'],
  prim: ['prim'],
}

// roots(配列) を受け取り、検出設定 [{id, stems, deny:Set}] を作る。
export function buildRootMatchers(roots) {
  return roots.map((r) => ({
    id: r.id,
    stems: (STEM_OVERRIDE[r.id] ?? r.form.split('/').map((s) => s.trim().toLowerCase()))
      .filter((s) => s.length >= 3),
    deny: new Set(DENY[r.id] ?? []),
  }))
}

// 1語(小文字)に対し、形態素分解で確実に当たる語根idの配列を返す。
export function autoRootIds(wordLower, matchers) {
  const out = []
  for (const { id, stems, deny } of matchers) {
    if (deny.has(wordLower)) continue
    for (const stem of stems) {
      const idx = wordLower.indexOf(stem)
      if (idx === -1) continue
      // 語頭、または直前が「既知の接頭辞ぴったり」のときだけ採用。
      if (idx === 0 || PREFIX_SET.has(wordLower.slice(0, idx))) {
        out.push(id)
        break
      }
    }
  }
  return out
}
