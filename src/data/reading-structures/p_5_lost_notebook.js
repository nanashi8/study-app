import { st } from './entry.js'

export default Object.freeze([
  st('[S Rina] [V is] [C a junior high school student].', {
    chunks: [
      ['Rina is', 'リナは〜です（内容は次へ）'],
      ['a junior high school student', '中学生'],
    ],
    notes: {
      'a junior high school student': '主語 Rina が何者かを説明します（Rina＝中学生）。',
    },
  }),
  st('[S She] [V goes] [M to school] [M by bus] [M every morning].', {
    notes: {
      'every morning': '前置詞を付けずに「いつ」を表します。',
    },
  }),
  st('[M On Monday], [S she] [V has] [O English, music, and science classes].', {
    notes: {
      'has English, music, and science classes': 'English, music, and science が classes を前から説明し、三つの教科の授業全体で一つの目的語です。have classes で「授業がある」。',
    },
  }),
  st('[S She] [V likes] [O English] [M {副詞節:理由| [接 because] [S her teacher] [V uses] [O many pictures]}].', {
    notes: {
      'likes English': 'like の目的語は、日本語では「〜が好き」と訳します。',
    },
  }),
  st('[M After lunch], [S Rina] [V cannot find] [O her blue notebook].', {
    chunks: [
      ['After lunch', '昼食のあとに'],
      ['Rina', 'リナは'],
      ['cannot find her blue notebook', '自分の青いノートを見つけられません'],
    ],
    notes: {
      'cannot find her blue notebook': 'her はリナ自身を指すので「自分の」と訳します。',
    },
  }),
  st('[S Her friend Ken] [V looks] [M under the desks] [M with her].'),
  st('[M Then] [S Ken] [V sees] [O the notebook] [M near the classroom door].', {
    chunks: [
      ['Then', 'それから'],
      ['Ken', 'ケンは'],
      ['sees the notebook', 'そのノートを見つけます'],
      ['near the classroom door', '教室のドアの近くに'],
    ],
  }),
  st('[S Rina] [V says] [O thank you] [接 and] [V writes] [O a short story] [M in it].', {
    chunks: [
      ['Rina', 'リナは'],
      ['says thank you', 'お礼を言います'],
      ['and', 'そして'],
      ['writes a short story', '短い物語を書きます'],
      ['in it', 'そのノートに'],
    ],
    notes: {
      'in it': 'it は前の文の the notebook を指します。',
    },
  }),
  st('[S She] [V is] [C happy] [M {副詞節:理由| [接 because] [S she] [V can use] [O the story] [M in English class]}].', {
    chunks: [
      ['She', '彼女は'],
      ['is happy', 'うれしいです'],
      ['because', 'なぜなら'],
      ['she', '彼女は'],
      ['can use the story', 'その物語を使えます'],
      ['in English class', '英語の授業で（使えるからです）'],
    ],
  }),
])
