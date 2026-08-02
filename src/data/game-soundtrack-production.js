// 「放課後の魔法と言葉」オリジナル・サウンドトラックの音源設計。
// General MIDI番号はレンダリング時だけ使い、ブラウザでは完成済みAACを再生する。

export const GAME_SOUNDTRACK_VERSION = 'school-ensemble-v2'

const profile = (spec) => Object.freeze({
  ...spec,
  soundtrackVersion: GAME_SOUNDTRACK_VERSION,
})

export const GAME_SOUNDTRACK_PRODUCTION_BY_TRACK_ID = Object.freeze({
  'daily-morning': profile({
    ensemble: '朝のピアノ、ナイロンギター、フルート、ピチカート弦、グロッケン',
    groove: 'breezy', piano: 0, guitar: 24, bass: 32, strings: 45,
    melody: 73, counter: 71, color: 9, brass: null, drumStyle: 'brush', reverb: 20,
  }),
  'daily-commute': profile({
    ensemble: 'エレクトリックピアノ、スチールギター、クラリネット、雨粒のヴィブラフォン',
    groove: 'rainy', piano: 4, guitar: 25, bass: 32, strings: 48,
    melody: 71, counter: 68, color: 11, brass: null, drumStyle: 'brush', reverb: 25,
  }),
  'daily-classroom': profile({
    ensemble: 'スタッカート・ピアノ、クリーンギター、クラリネット、ピチカート弦',
    groove: 'witty', piano: 0, guitar: 27, bass: 33, strings: 45,
    melody: 71, counter: 68, color: 12, brass: 56, drumStyle: 'light-pop', reverb: 17,
  }),
  'daily-everyday': profile({
    ensemble: 'ナイロンギター、ピアノ、フルート、ピチカート弦、ブラシドラム',
    groove: 'picnic', piano: 0, guitar: 24, bass: 32, strings: 45,
    melody: 73, counter: 69, color: 11, brass: null, drumStyle: 'brush', reverb: 19,
  }),
  'daily-club': profile({
    ensemble: '放課後バンドのピアノ、スチールギター、アルトサックス、弦と小編成ブラス',
    groove: 'band-pop', piano: 0, guitar: 25, bass: 33, strings: 48,
    melody: 65, counter: 73, color: 11, brass: 56, drumStyle: 'pop', reverb: 18,
  }),
  'daily-cafe': profile({
    ensemble: 'エレクトリックピアノ、ナイロンギター、アルトサックス、ヴィブラフォン',
    groove: 'cafe-swing', piano: 4, guitar: 24, bass: 32, strings: 45,
    melody: 65, counter: 71, color: 11, brass: null, drumStyle: 'brush', reverb: 22,
  }),
  'daily-snack': profile({
    ensemble: '夕暮れのピアノ、アコーディオン、クラリネット、アコースティックギター',
    groove: 'sunset-skip', piano: 0, guitar: 25, bass: 32, strings: 45,
    melody: 21, counter: 71, color: 9, brass: null, drumStyle: 'brush', reverb: 18,
  }),
  'daily-shopping': profile({
    ensemble: 'マーチ風ピアノ、クリーンギター、クラリネット、トランペット、木琴',
    groove: 'parade', piano: 0, guitar: 27, bass: 33, strings: 45,
    melody: 71, counter: 73, color: 12, brass: 56, drumStyle: 'light-pop', reverb: 16,
  }),
  'daily-library': profile({
    ensemble: '静かなグランドピアノ、オーボエ、チェロ、室内弦、ハープ',
    groove: 'chamber', piano: 0, guitar: null, bass: 42, strings: 48,
    melody: 68, counter: 73, color: 46, brass: null, drumStyle: 'none', reverb: 30,
  }),
  'daily-arcade': profile({
    ensemble: '高速ピアノ、クリーンギター、アルトサックス、トランペット、ポップドラム',
    groove: 'comic-chase', piano: 1, guitar: 27, bass: 33, strings: 48,
    melody: 65, counter: 71, color: 12, brass: 56, drumStyle: 'pop', reverb: 14,
  }),
  'daily-homeward': profile({
    ensemble: '帰り道のピアノ、スチールギター、フルート、温かな弦楽',
    groove: 'homeward', piano: 0, guitar: 25, bass: 32, strings: 48,
    melody: 73, counter: 69, color: 11, brass: null, drumStyle: 'soft', reverb: 28,
  }),

  'rank-5': profile({
    ensemble: 'ピアノ、クリーンギター、クラリネット、ピチカート弦の軽快な初戦編成',
    groove: 'battle-pop', piano: 0, guitar: 27, bass: 33, strings: 45,
    melody: 71, counter: 65, color: 12, brass: 56, drumStyle: 'pop', reverb: 15,
  }),
  'rank-4': profile({
    ensemble: 'ピアノ、スチールギター、アルトサックス、弦とブラスの疾走編成',
    groove: 'battle-pop', piano: 1, guitar: 25, bass: 33, strings: 48,
    melody: 65, counter: 73, color: 11, brass: 56, drumStyle: 'pop', reverb: 16,
  }),
  'rank-3': profile({
    ensemble: 'ピアノ、クリーンギター、テナーサックス、ストリングス、フレンチホルン',
    groove: 'orchestral-pop', piano: 0, guitar: 27, bass: 33, strings: 48,
    melody: 66, counter: 71, color: 11, brass: 60, drumStyle: 'rock', reverb: 19,
  }),
  'rank-pre2': profile({
    ensemble: 'ドライブするピアノとギター、ヴァイオリン、アルトサックス、小編成ブラス',
    groove: 'orchestral-pop', piano: 1, guitar: 29, bass: 33, strings: 40,
    melody: 65, counter: 73, color: 12, brass: 61, drumStyle: 'rock', reverb: 17,
  }),
  'rank-2': profile({
    ensemble: 'グランドピアノ、ストリングス、トランペット、フレンチホルン、ロックドラム',
    groove: 'brass-drive', piano: 0, guitar: 27, bass: 33, strings: 48,
    melody: 56, counter: 68, color: 9, brass: 60, drumStyle: 'rock', reverb: 22,
  }),
  'rank-pre1': profile({
    ensemble: 'ピアノ、教会オルガン、弦楽、オーボエ、シネマティック・ブラス',
    groove: 'cinematic-school', piano: 0, guitar: 19, bass: 42, strings: 49,
    melody: 68, counter: 71, color: 46, brass: 61, drumStyle: 'cinematic', reverb: 29,
  }),
  'rank-1': profile({
    ensemble: 'フルピアノ、弦楽、トランペット、ホルン、木管とティンパニの総奏',
    groove: 'finale', piano: 0, guitar: 27, bass: 42, strings: 49,
    melody: 56, counter: 73, color: 9, brass: 60, drumStyle: 'cinematic', reverb: 27,
  }),

  'boss-grass-wolf': profile({
    ensemble: 'せわしないピアノ、クラリネット、ピチカート弦、短いブラスの応酬',
    groove: 'teacher-comedy', piano: 0, guitar: 27, bass: 33, strings: 45,
    melody: 71, counter: 68, color: 12, brass: 56, drumStyle: 'pop', reverb: 16,
  }),
  'boss-forest-keeper': profile({
    ensemble: '箏、尺八、木管、ピチカート弦と小太鼓による国語教師戦',
    groove: 'japanese-school', piano: 107, guitar: 106, bass: 42, strings: 45,
    melody: 77, counter: 68, color: 13, brass: null, drumStyle: 'wood', reverb: 25,
  }),
  'boss-chronos': profile({
    ensemble: 'マリンバ、ピアノ、バスーン、ピチカート弦が刻む時計仕掛け',
    groove: 'clockwork', piano: 0, guitar: 12, bass: 42, strings: 45,
    melody: 70, counter: 71, color: 9, brass: 60, drumStyle: 'clockwork', reverb: 18,
  }),
  'boss-leviathan': profile({
    ensemble: 'スチールギター、フルート、イングリッシュホルン、弦楽と旅の打楽器',
    groove: 'voyage', piano: 0, guitar: 25, bass: 32, strings: 48,
    melody: 73, counter: 69, color: 11, brass: 60, drumStyle: 'world', reverb: 25,
  }),
  'boss-librarian': profile({
    ensemble: 'ヴィブラフォン、マリンバ、クラリネット、ピチカート弦の実験室アンサンブル',
    groove: 'laboratory', piano: 4, guitar: 12, bass: 33, strings: 45,
    melody: 71, counter: 68, color: 11, brass: 56, drumStyle: 'light-pop', reverb: 20,
  }),
  'boss-silent-dragon': profile({
    ensemble: 'ピアノ、イングリッシュホルン、クラリネット、深い弦とホルンの英語教師戦',
    groove: 'dramatic-school', piano: 0, guitar: 25, bass: 42, strings: 49,
    melody: 69, counter: 71, color: 46, brass: 60, drumStyle: 'cinematic', reverb: 30,
  }),
  'boss-tempest': profile({
    ensemble: '高速ピアノ、クリーンギター、アルトサックス、ブラス、スポーツドラム',
    groove: 'sports-day', piano: 1, guitar: 29, bass: 33, strings: 48,
    melody: 65, counter: 73, color: 12, brass: 61, drumStyle: 'sports', reverb: 14,
  }),
  'boss-nameless-king': profile({
    ensemble: '低音ピアノ、マリンバ、バスーン、チェロ、重いブラスとフロアタム',
    groove: 'earthwork', piano: 0, guitar: 12, bass: 42, strings: 48,
    melody: 70, counter: 68, color: 11, brass: 57, drumStyle: 'heavy', reverb: 23,
  }),
  'boss-archive-angel': profile({
    ensemble: 'ハープ、フルート、弦楽、グロッケンと木管の色彩的な生物教師戦',
    groove: 'sketch-rhapsody', piano: 46, guitar: 0, bass: 42, strings: 49,
    melody: 73, counter: 68, color: 9, brass: 60, drumStyle: 'world', reverb: 31,
  }),
  'boss-word-emperor': profile({
    ensemble: 'スネア行進、ピアノ、トランペット、ホルン、弦楽による歴史教師戦',
    groove: 'school-march', piano: 0, guitar: 27, bass: 42, strings: 48,
    melody: 56, counter: 71, color: 12, brass: 60, drumStyle: 'march', reverb: 22,
  }),
  'boss-endless-book': profile({
    ensemble: 'フルピアノ、弦楽、木管、トランペット、ホルンとティンパニの最終総奏',
    groove: 'grand-finale', piano: 0, guitar: 27, bass: 42, strings: 49,
    melody: 56, counter: 73, color: 9, brass: 60, drumStyle: 'cinematic', reverb: 29,
  }),

  'result-victory': profile({
    ensemble: '花まるファンファーレのピアノ、トランペット、弦楽、グロッケン',
    groove: 'fanfare', piano: 0, guitar: 25, bass: 33, strings: 48,
    melody: 56, counter: 73, color: 9, brass: 60, drumStyle: 'pop', reverb: 24,
  }),
  'result-draw': profile({
    ensemble: 'エレクトリックピアノ、ナイロンギター、クラリネット、柔らかな弦',
    groove: 'reflection', piano: 4, guitar: 24, bass: 32, strings: 48,
    melody: 71, counter: 73, color: 11, brass: null, drumStyle: 'soft', reverb: 25,
  }),
  'result-retreat': profile({
    ensemble: '明日へつなぐピアノ、フルート、イングリッシュホルン、室内弦',
    groove: 'hopeful-coda', piano: 0, guitar: null, bass: 42, strings: 48,
    melody: 73, counter: 69, color: 46, brass: null, drumStyle: 'none', reverb: 31,
  }),
})

export function gameSoundtrackProduction(trackId) {
  return GAME_SOUNDTRACK_PRODUCTION_BY_TRACK_ID[trackId] ?? null
}

export function gameSoundtrackAudioPath(trackId) {
  return `assets/bgm/school-ensemble/${trackId}.m4a`
}
