// 設問が「the man / the woman / the boy / the girl」で指す人物が、台本の話者 A・B のどちらかを問題ごとに決めた台帳
// （requests/2026-10-14-content-observations-fix.json）。台本には性別が書かれず、音声は端末の声で話者を分けるので、
// 設問の「the woman」が聞こえる声とつながるよう、この台帳で性別を声の高さ・声の種類へ割り当て、本文の話者名にも添える。
//
// 書き方: 問題 id → { 話者: 人物 }。人物は woman・man・boy・girl のどれか。
// 決め方は1問ずつ台本を読み、設問が問う発言（「〜するつもりだ」「〜を提案する」など）をした話者を選んだ。
// 設問が1人だけを指す問題は、その話者だけを書く。もう一方の話者の性別は台本から決められないので書かない
// （声は反対の性別の声にして聞き分けられるようにするが、本文の話者名には出さない）。
// 絵の設問（Which sentence matches the picture?）の man・woman・boy・girl は話者ではなく絵の人物なので、ここに入れない。
export const LISTENING_SPEAKER_ROLES = Object.freeze({
  listen_1_03: Object.freeze({ A: 'woman' }), // 条件を述べる（provided the obligations are enforceable）のは A
  listen_1_05: Object.freeze({ A: 'man' }), // renewable loan を提案するのは A
  listen_2_01: Object.freeze({ A: 'man' }), // 録画を見て会議は続けるのは A
  listen_2_02: Object.freeze({ B: 'woman' }), // I will take the local train と言うのは B
  listen_2_03: Object.freeze({ A: 'woman', B: 'man' }), // 助言する A（女性）と、助言される B（男性）
  listen_2_04: Object.freeze({ B: 'woman' }), // 光熱費の懸念を挙げるのは B
  listen_3_09: Object.freeze({ B: 'boy' }), // make it for my family と言うのは B
  listen_3_10: Object.freeze({ B: 'woman' }), // Join us by phone と提案するのは B
  listen_3_11: Object.freeze({ B: 'girl' }), // I will finish it tonight と言うのは B
  listen_4_11: Object.freeze({ A: 'girl' }), // 靴を買ったのは A（値段と割引を話す）
  listen_4_14: Object.freeze({ B: 'boy' }), // I will call her back after dinner と言うのは B
  listen_5_10: Object.freeze({ A: 'girl' }), // Is this bus for Central Park? と尋ねるのは A
  listen_5_11: Object.freeze({ B: 'girl' }), // I will bring a cake と言うのは B
  listen_5_13: Object.freeze({ B: 'woman' }), // I will take my umbrella と言うのは B
  listen_pre2_08: Object.freeze({ B: 'boy' }), // 練習のあとなら空いていると言うのは B
  listen_pre2_12: Object.freeze({ A: 'woman' }), // 仕事のあとに本を取りに行くと言うのは A
  listen_pre2_13: Object.freeze({ A: 'boy' }), // 医者に走るなと言われたのは A
  listen_pre2plus_01: Object.freeze({ A: 'woman' }), // 同僚に金曜の回を聞くと言うのは A
  listen_pre2plus_06: Object.freeze({ B: 'man' }), // 練習通話を提案するのは B
  listen_pre2plus_07: Object.freeze({ A: 'woman' }), // 修理の見積もりを頼むと決めるのは A
  listen_pre1_01: Object.freeze({ A: 'woman' }), // リーダーシップの経験に関心を示すのは A
  listen_pre1_06: Object.freeze({ A: 'man' }), // 不利な条件で検証しようと勧めるのは A
})

export const LISTENING_ROLE_LABELS = Object.freeze({
  woman: '女性',
  man: '男性',
  girl: '女の子',
  boy: '男の子',
})

/** 台帳にある問題の、話者ごとの人物（なければ空のオブジェクト）。 */
export function listeningSpeakerRoles(item) {
  return LISTENING_SPEAKER_ROLES[item?.id] ?? {}
}
