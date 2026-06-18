// 語根（ごこん）インデックス。
// 単語データの parts[].root がここの id を指す。これで「語源つながり」を辿れる。
// origin は史実に基づく簡潔な語源。emoji は学習画面のアイコン。

export const ROOTS = [
  { id: 'port',   form: 'port',          meaning: '運ぶ',          origin: 'ラテン語 portāre「運ぶ」',          emoji: '🚚' },
  { id: 'dict',   form: 'dict / dic',    meaning: '言う・示す',     origin: 'ラテン語 dīcere「言う」',           emoji: '🗣️' },
  { id: 'spect',  form: 'spect / spic',  meaning: '見る',          origin: 'ラテン語 specere「見る」',          emoji: '👀' },
  { id: 'ject',   form: 'ject',          meaning: '投げる',        origin: 'ラテン語 iacere「投げる」',         emoji: '🎯' },
  { id: 'script', form: 'scrib / script', meaning: '書く',         origin: 'ラテン語 scrībere「書く」',         emoji: '✍️' },
  { id: 'tract',  form: 'tract',         meaning: '引く',          origin: 'ラテン語 trahere「引く」',          emoji: '🪝' },
  { id: 'duct',   form: 'duc / duct',    meaning: '導く',          origin: 'ラテン語 dūcere「導く」',           emoji: '🧭' },
  { id: 'vers',   form: 'vert / vers',   meaning: '回す・向ける',   origin: 'ラテン語 vertere「回す」',          emoji: '🔄' },
  { id: 'pos',    form: 'pos / pon',     meaning: '置く',          origin: 'ラテン語 pōnere「置く」',           emoji: '📦' },
  { id: 'vent',   form: 'ven / vent',    meaning: '来る',          origin: 'ラテン語 venīre「来る」',           emoji: '🚪' },
  { id: 'voc',    form: 'voc / vok',     meaning: '声・呼ぶ',       origin: 'ラテン語 vocāre / vōx「呼ぶ・声」',  emoji: '📣' },
  { id: 'graph',  form: 'graph / gram',  meaning: '書く・描く',     origin: 'ギリシャ語 graphein「書く」',       emoji: '🖊️' },
  { id: 'fer',    form: 'fer',           meaning: '運ぶ・もたらす',  origin: 'ラテン語 ferre「運ぶ」',            emoji: '🎁' },
  { id: 'cept',   form: 'cap / cept',    meaning: '取る・つかむ',    origin: 'ラテン語 capere「取る」',           emoji: '🤲' },
  { id: 'miss',   form: 'mit / miss',    meaning: '送る',          origin: 'ラテン語 mittere「送る」',          emoji: '📨' },
  { id: 'vis',    form: 'vid / vis',     meaning: '見る',          origin: 'ラテン語 vidēre「見る」',           emoji: '🔭' },
  { id: 'struct', form: 'struct',        meaning: '建てる・積む',    origin: 'ラテン語 struere「建てる」',        emoji: '🏛️' },
  { id: 'cess',   form: 'ceed / cess',   meaning: '進む・行く',      origin: 'ラテン語 cēdere「進む・譲る」',     emoji: '🚶' },
  { id: 'tain',   form: 'tain / ten',    meaning: '保つ',          origin: 'ラテン語 tenēre「保つ」',           emoji: '🤝' },
  { id: 'press',  form: 'press',         meaning: '押す',          origin: 'ラテン語 premere「押す」',          emoji: '👇' },
  { id: 'fact',   form: 'fac / fect / fic', meaning: '作る・なす',   origin: 'ラテン語 facere「作る・なす」',      emoji: '🏭' },
  { id: 'mot',    form: 'mov / mot',     meaning: '動く',          origin: 'ラテン語 movēre「動く」',           emoji: '🏃' },
  { id: 'pend',   form: 'pend / pens',   meaning: 'ぶら下がる・量る・払う', origin: 'ラテン語 pendēre「垂れる・量る」', emoji: '⚖️' },
  { id: 'tend',   form: 'tend / tens',   meaning: '伸ばす・張る',    origin: 'ラテン語 tendere「伸ばす」',        emoji: '🏹' },
  { id: 'gen',    form: 'gen',           meaning: '生む・種',       origin: 'ラテン語 genus / gignere「生む」',  emoji: '🌱' },
]

export const ROOTS_BY_ID = Object.fromEntries(ROOTS.map((r) => [r.id, r]))
