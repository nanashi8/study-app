// 再監査で新しく起こした語幹カード。
//
// 全語の語源メモを機械監査したところ、語根カードが無いまま残っていた語の中に
// 「同じラテン語・ギリシャ語から来た仲間が3語以上いる」組が67種あった。
// 語根カードの目的は初見の語の意味を推測できるようにすることなので、
// 仲間が3語以上そろう組だけをカードにする（2語だけの組は語の成り立ちの本文で受け持つ）。
//
// 紐づく語は、各語の語源メモが同じ語をあげていることを1語ずつ確かめた明示リスト。
// 既存カードと同じ語族だった組（species→spect、vital→viv、major→magn、
// noun→nom、establish→sta、discreet→cert）は、新しいカードを作らず既存へ足した。

export const AUDIT_STEM_ROOTS = Object.freeze([
  Object.freeze({ id: 'ag', form: 'ag / act', meaning: '行う・駆り立てる', origin: 'ラテン語 agere「行う・駆り立てる」', emoji: '⚙️' }),
  Object.freeze({ id: 'uni', form: 'uni / un', meaning: '1つ', origin: 'ラテン語 ūnus「1つ」', emoji: '☝️' }),
  Object.freeze({ id: 'radi', form: 'radi', meaning: '光線・放射', origin: 'ラテン語 radius「光線・車輪の輻」', emoji: '☀️' }),
  Object.freeze({ id: 'rat', form: 'rat / ratio', meaning: '計算・理', origin: 'ラテン語 ratiō「計算・理」', emoji: '🧮' }),
  Object.freeze({ id: 'temper', form: 'temper', meaning: 'ほどよく混ぜる・加減する', origin: 'ラテン語 temperāre「ほどよく混ぜる」', emoji: '🌡️' }),
  Object.freeze({ id: 'hospit', form: 'hospit / host', meaning: '客・もてなす', origin: 'ラテン語 hospes「客・もてなす主人」', emoji: '🏨' }),
  Object.freeze({ id: 'amic', form: 'amic / ami', meaning: '友・愛する', origin: 'ラテン語 amīcus「友」（amāre「愛する」から）', emoji: '🤝' }),
  Object.freeze({ id: 'fals', form: 'fals / fall / faul', meaning: '欺く・そこなう', origin: 'ラテン語 fallere「欺く」', emoji: '🎭' }),
  Object.freeze({ id: 'camp', form: 'camp', meaning: '平原・戦場', origin: 'ラテン語 campus「平原・戦場」', emoji: '🏕️' }),
  Object.freeze({ id: 'err', form: 'err', meaning: 'さまよう・誤る', origin: 'ラテン語 errāre「さまよう」', emoji: '🌀' }),
  Object.freeze({ id: 'ferv', form: 'ferv', meaning: '沸き立つ・熱い', origin: 'ラテン語 fervēre「沸き立つ」', emoji: '♨️' }),
  Object.freeze({ id: 'pict', form: 'pict / paint', meaning: '描く', origin: 'ラテン語 pingere「描く」', emoji: '🎨' }),
  Object.freeze({ id: 'situ', form: 'situ / site', meaning: '置かれた場所', origin: 'ラテン語 situs「置かれた場所」', emoji: '📍' }),
  Object.freeze({ id: 'und', form: 'und', meaning: '波・あふれる', origin: 'ラテン語 unda「波」', emoji: '🌊' }),
  Object.freeze({ id: 'hod', form: 'hod / od', meaning: '道・行き方', origin: 'ギリシャ語 hodos「道」', emoji: '🛤️' }),
  Object.freeze({ id: 'vari', form: 'vari', meaning: 'さまざまな', origin: 'ラテン語 varius「さまざまな」', emoji: '🔀' }),
  Object.freeze({ id: 'ante', form: 'ante / anci', meaning: '前に・先に', origin: 'ラテン語 ante「前に」', emoji: '⏪' }),
  Object.freeze({ id: 'mechan', form: 'mechan', meaning: '仕掛け・からくり', origin: 'ギリシャ語 mēkhanē「仕掛け」', emoji: '🔩' }),
  Object.freeze({ id: 'arbitr', form: 'arbitr', meaning: '裁定する・判断する', origin: 'ラテン語 arbiter「裁定者」', emoji: '⚖️' }),
  Object.freeze({ id: 'apt', form: 'apt / att', meaning: '適した・合う', origin: 'ラテン語 aptus「適した」', emoji: '🧩' }),
  Object.freeze({ id: 'integ', form: 'integ / entir', meaning: '手つかずの・欠けがない', origin: 'ラテン語 integer「手をつけていない・完全な」', emoji: '🔒' }),
  Object.freeze({ id: 'salv', form: 'salv / sav / saf', meaning: '無事な・救う', origin: 'ラテン語 salvus「無事な」', emoji: '🛟' }),
  Object.freeze({ id: 'class', form: 'class', meaning: '区分・等級', origin: 'ラテン語 classis「区分」', emoji: '🗂️' }),
  Object.freeze({ id: 'tex', form: 'tex / text', meaning: '織る', origin: 'ラテン語 texere「織る」', emoji: '🧵' }),
  Object.freeze({ id: 'preti', form: 'preti / prec / prais', meaning: '値段・価値', origin: 'ラテン語 pretium「値段」', emoji: '💰' }),
  Object.freeze({ id: 'estim', form: 'estim / aim', meaning: '見積もる・値ぶみする', origin: 'ラテン語 aestimāre「見積もる」', emoji: '🎯' }),
  Object.freeze({ id: 'spher', form: 'spher', meaning: '球', origin: 'ギリシャ語 sphaira「球」', emoji: '🔵' }),
  Object.freeze({ id: 'acu', form: 'acu / ac / acr', meaning: '鋭い・とがった', origin: 'ラテン語 acus「針」/ acer「鋭い」', emoji: '📌' }),
  Object.freeze({ id: 'divid', form: 'divid / devi', meaning: '分ける', origin: 'ラテン語 dīvidere「分ける」', emoji: '➗' }),
  Object.freeze({ id: 'domin', form: 'domin', meaning: '主人・支配する', origin: 'ラテン語 dominus「主人」', emoji: '🏛️' }),
  Object.freeze({ id: 'termin', form: 'termin / term', meaning: '境界・終わり', origin: 'ラテン語 terminus「境界」', emoji: '🏁' }),
  Object.freeze({ id: 'eth', form: 'eth', meaning: '習わし・気風', origin: 'ギリシャ語 ēthos「習わし・気風」', emoji: '🧭' }),
  Object.freeze({ id: 'humil', form: 'humil / hum', meaning: '低い・土', origin: 'ラテン語 humilis「低い」（humus「土」から）', emoji: '🌍' }),
  Object.freeze({ id: 'zeal', form: 'zeal / jeal', meaning: '熱意・ねたみ', origin: 'ギリシャ語 zēlos「熱意」', emoji: '🔥' }),
  Object.freeze({ id: 'optim', form: 'optim', meaning: '最良の', origin: 'ラテン語 optimus「最良の」', emoji: '🌟' }),
  Object.freeze({ id: 'organ', form: 'organ', meaning: '道具・器官', origin: 'ギリシャ語 organon「道具・器官」', emoji: '🫀' }),
  Object.freeze({ id: 'toler', form: 'toler', meaning: '耐える・持ちこたえる', origin: 'ラテン語 tolerāre「耐える」', emoji: '🤲' }),
  Object.freeze({ id: 'trem', form: 'trem', meaning: '震える', origin: 'ラテン語 tremere「震える」', emoji: '〰️' }),
  Object.freeze({ id: 'ident', form: 'ident / idem', meaning: '同じ', origin: 'ラテン語 idem「同じ」', emoji: '🪪' }),
  Object.freeze({ id: 'poen', form: 'poen / pun / pain', meaning: '罰・苦しみ', origin: 'ラテン語 poena「罰」', emoji: '💢' }),
  Object.freeze({ id: 'grav', form: 'grav / griev', meaning: '重い', origin: 'ラテン語 gravis「重い」', emoji: '🪨' }),
  Object.freeze({ id: 'heres', form: 'her / heir', meaning: '相続する', origin: 'ラテン語 hērēs「相続人」', emoji: '🎁' }),
  Object.freeze({ id: 'virus', form: 'virus / virul', meaning: '毒', origin: 'ラテン語 vīrus「毒」', emoji: '☣️' }),
  Object.freeze({ id: 'insul', form: 'insul / isl', meaning: '島', origin: 'ラテン語 īnsula「島」', emoji: '🏝️' }),
  Object.freeze({ id: 'nav', form: 'nav', meaning: '船', origin: 'ラテン語 nāvis「船」', emoji: '🚢' }),
  Object.freeze({ id: 'imper', form: 'imper / empir', meaning: '命じる・支配', origin: 'ラテン語 imperium「支配」', emoji: '🏰' }),
  Object.freeze({ id: 'plumb', form: 'plumb / plung', meaning: '鉛・おもり', origin: 'ラテン語 plumbum「鉛」', emoji: '⚓' }),
  Object.freeze({ id: 'brev', form: 'brev / bridg', meaning: '短い', origin: 'ラテン語 brevis「短い」', emoji: '📏' }),
  Object.freeze({ id: 'plac', form: 'plac / pleas', meaning: '気に入る・なだめる', origin: 'ラテン語 placēre「気に入る」', emoji: '😊' }),
  Object.freeze({ id: 'terrere', form: 'terr / terrif', meaning: '怖がらせる', origin: 'ラテン語 terrēre「怖がらせる」', emoji: '😱' }),
  Object.freeze({ id: 'dies', form: 'di / diurn', meaning: '日', origin: 'ラテン語 diēs「日」', emoji: '📅' }),
  Object.freeze({ id: 'don', form: 'don / dot', meaning: '贈る・与える', origin: 'ラテン語 dōnāre「贈る」', emoji: '🎀' }),
  Object.freeze({ id: 'germ', form: 'germ', meaning: '芽・生まれ出るもの', origin: 'ラテン語 germen「芽」', emoji: '🌱' }),
  Object.freeze({ id: 'rap', form: 'rap / rept', meaning: 'つかみ取る・さらう', origin: 'ラテン語 rapere「つかみ取る」', emoji: '🫳' }),
  Object.freeze({ id: 'lic', form: 'lic / leis', meaning: '許される', origin: 'ラテン語 licēre「許される」', emoji: '🎫' }),
  Object.freeze({ id: 'laud', form: 'laud', meaning: 'ほめる', origin: 'ラテン語 laudāre「ほめる」', emoji: '👏' }),
])

export const AUDIT_STEM_ROOT_WORDS = Object.freeze({
  // ag / act ＝ 行う・駆り立てる
  ag: Object.freeze(['act', 'active', 'actor', 'agency', 'agenda', 'agent', 'agile', 'mitigate', 'navigate']),
  // uni / un ＝ 1つ
  uni: Object.freeze(['unify', 'union', 'unique', 'unison', 'unit', 'unite', 'unity']),
  // radi ＝ 光線・放射
  radi: Object.freeze(['radiant', 'radiate', 'radiation', 'radio', 'radius', 'ray']),
  // rat / ratio ＝ 計算・理
  rat: Object.freeze(['rate', 'ratio', 'rational', 'rationale', 'reason']),
  // temper ＝ ほどよく混ぜる・加減する
  temper: Object.freeze(['temper', 'temperament', 'temperance', 'temperate', 'temperature']),
  // hospit / host ＝ 客・もてなす
  hospit: Object.freeze(['hospitable', 'hospital', 'hospitality', 'host']),
  // amic / ami ＝ 友・愛する
  amic: Object.freeze(['amiable', 'amicable', 'amity']),
  // fals / fall / faul ＝ 欺く・そこなう
  fals: Object.freeze(['fallacy', 'fallible', 'false', 'fault']),
  // camp ＝ 平原・戦場
  camp: Object.freeze(['camp', 'campaign', 'camping', 'champion']),
  // err ＝ さまよう・誤る
  err: Object.freeze(['errant', 'erratic', 'erroneous', 'error']),
  // ferv ＝ 沸き立つ・熱い
  ferv: Object.freeze(['effervescent', 'fervent', 'fervid', 'fervor']),
  // pict / paint ＝ 描く
  pict: Object.freeze(['paint', 'painter', 'picture']),
  // situ / site ＝ 置かれた場所
  situ: Object.freeze(['site', 'situate', 'situation']),
  // und ＝ 波・あふれる
  und: Object.freeze(['abound', 'abundance', 'abundant', 'redundant']),
  // hod / od ＝ 道・行き方
  hod: Object.freeze(['exodus', 'method', 'period']),
  // vari ＝ さまざまな
  vari: Object.freeze(['variety', 'various', 'vary']),
  // ante / anci ＝ 前に・先に
  ante: Object.freeze(['a.m.', 'advance', 'ancient']),
  // mechan ＝ 仕掛け・からくり
  mechan: Object.freeze(['mechanic', 'mechanical', 'mechanism']),
  // arbitr ＝ 裁定する・判断する
  arbitr: Object.freeze(['arbiter', 'arbitrary', 'arbitrate']),
  // apt / att ＝ 適した・合う
  apt: Object.freeze(['apt', 'aptitude', 'attitude']),
  // integ / entir ＝ 手つかずの・欠けがない
  integ: Object.freeze(['entire', 'integral', 'integrate', 'integrity']),
  // salv / sav / saf ＝ 無事な・救う
  salv: Object.freeze(['safe', 'safety', 'save']),
  // class ＝ 区分・等級
  class: Object.freeze(['class', 'classify', 'classroom']),
  // tex / text ＝ 織る
  tex: Object.freeze(['textbook', 'textile', 'texture']),
  // preti / prec / prais ＝ 値段・価値
  preti: Object.freeze(['praise', 'precious', 'price']),
  // estim / aim ＝ 見積もる・値ぶみする
  estim: Object.freeze(['aim', 'esteem', 'estimate']),
  // spher ＝ 球
  spher: Object.freeze(['atmosphere', 'hemisphere', 'sphere']),
  // acu / ac / acr ＝ 鋭い・とがった
  acu: Object.freeze(['acid', 'acumen', 'eager']),
  // divid / devi ＝ 分ける
  divid: Object.freeze(['device', 'divide', 'dividend']),
  // domin ＝ 主人・支配する
  domin: Object.freeze(['domain', 'dominate', 'dominion']),
  // termin / term ＝ 境界・終わり
  termin: Object.freeze(['term', 'terminal', 'terminate']),
  // eth ＝ 習わし・気風
  eth: Object.freeze(['ethic', 'ethical', 'ethics']),
  // humil / hum ＝ 低い・土
  humil: Object.freeze(['humble', 'humiliate', 'humility']),
  // zeal / jeal ＝ 熱意・ねたみ
  zeal: Object.freeze(['jealous', 'zeal', 'zealot']),
  // optim ＝ 最良の
  optim: Object.freeze(['optimal', 'optimistic', 'optimize']),
  // organ ＝ 道具・器官
  organ: Object.freeze(['organ', 'organic', 'organize']),
  // toler ＝ 耐える・持ちこたえる
  toler: Object.freeze(['tolerance', 'tolerant', 'tolerate']),
  // trem ＝ 震える
  trem: Object.freeze(['tremble', 'tremendous', 'tremor']),
  // ident / idem ＝ 同じ
  ident: Object.freeze(['identical', 'identify', 'identity']),
  // poen / pun / pain ＝ 罰・苦しみ
  poen: Object.freeze(['pain', 'punish', 'subpoena']),
  // grav / griev ＝ 重い
  grav: Object.freeze(['gravity', 'grief', 'grieve']),
  // her / heir ＝ 相続する
  heres: Object.freeze(['heir', 'heirs', 'heritage']),
  // virus / virul ＝ 毒
  virus: Object.freeze(['virulence', 'virulent', 'virus']),
  // insul / isl ＝ 島
  insul: Object.freeze(['insular', 'insulate', 'peninsula']),
  // nav ＝ 船
  nav: Object.freeze(['naval', 'navigate', 'navy']),
  // imper / empir ＝ 命じる・支配
  imper: Object.freeze(['empire', 'imperial', 'imperious']),
  // plumb / plung ＝ 鉛・おもり
  plumb: Object.freeze(['plumber', 'plummet', 'plunge']),
  // brev / bridg ＝ 短い
  brev: Object.freeze(['abridge', 'brevity', 'brief']),
  // plac / pleas ＝ 気に入る・なだめる
  plac: Object.freeze(['placate', 'placid', 'pleasure']),
  // terr / terrif ＝ 怖がらせる
  terrere: Object.freeze(['terrible', 'terrify', 'terror']),
  // di / diurn ＝ 日
  dies: Object.freeze(['dial', 'diary', 'dismal']),
  // don / dot ＝ 贈る・与える
  don: Object.freeze(['donate', 'donor', 'pardon']),
  // germ ＝ 芽・生まれ出るもの
  germ: Object.freeze(['germ', 'germinate', 'germs']),
  // rap / rept ＝ つかみ取る・さらう
  rap: Object.freeze(['rapacious', 'rapture', 'surreptitious']),
  // lic / leis ＝ 許される
  lic: Object.freeze(['leisure', 'license', 'licentious']),
  // laud ＝ ほめる
  laud: Object.freeze(['laud', 'laudable', 'laudatory']),
})
