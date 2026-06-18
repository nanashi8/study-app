// 単語データ（統一フォーマット＋分野field）。[word,pos,level,"意味","英例文","和訳",語源,{syn,ant,der,usage,field}]
import { expandCompact } from './compact.js'

const RAW = [
  ["economical","形","pre1","節約的な・無駄のない","A small car is more economical.","小型車のほうが経済的(燃費がよい)だ。","economy(経済・節約)+ -al →「節約的な」。economic(経済の)と意味が分かれる。",{"syn":[{"w":"thrifty","m":"倹約な"},{"w":"frugal","m":"質素な"}],"usage":"「節約的な・無駄のない」。economic(経済の)と意味が分かれる。","field":"性質・状態"}],
  ["industrious","形","pre1","勤勉な","She is an industrious student.","彼女は勤勉な学生だ。","ラテン industria(勤勉)→「勤勉な」。industry(産業)と意味が分かれる。",{"syn":[{"w":"diligent","m":"勤勉な"},{"w":"hardworking","m":"勤勉な"}],"ant":[{"w":"lazy","m":"怠惰な"}],"usage":"industry(産業)とは別の意味「勤勉な」。","field":"性質・状態"}],
  ["respectable","形","pre1","立派な・まともな","He has a respectable job.","彼はまともな職に就いている。","respect(尊敬)+ -able → 尊敬に値する→「立派な」。",{"syn":[{"w":"decent","m":"きちんとした"}],"usage":"respectable(立派な) / respectful(礼儀正しい) / respective(それぞれの) は意味が分かれる。","field":"性質・状態"}],
  ["respectful","形","pre1","礼儀正しい・敬意を払う","Be respectful to elderly people.","年配の人には礼儀正しくしなさい。","respect + -ful → 敬意に満ちた→「礼儀正しい」。",{"ant":[{"w":"rude","m":"失礼な"}],"usage":"be respectful to/toward ～（～に敬意を払う）。","field":"性質・状態"}],
  ["respective","形","1","それぞれの","They returned to their respective homes.","彼らはそれぞれの家に帰った。","respect(振り返って見る)+ -ive → めいめいの→「それぞれの」。",{"usage":"名詞の前で「めいめいの」。副詞 respectively(それぞれ)も頻出。","field":"性質・状態"}],
  ["sensible","形","pre1","分別のある・賢明な","That was a sensible decision.","それは賢明な決断だった。","sense(分別)+ -ible →「分別のある」。sensitive(敏感な)と混同注意。",{"syn":[{"w":"reasonable","m":"分別のある"},{"w":"wise","m":"賢明な"}],"usage":"sensible(分別のある) ≠ sensitive(敏感な)。","field":"性質・状態"}],
  ["sensitive","形","pre1","敏感な・繊細な","She is sensitive to criticism.","彼女は批判に敏感だ。","sense(感じる)+ -itive → 感じやすい→「敏感な」。",{"ant":[{"w":"insensitive","m":"無神経な"}],"usage":"sensitive(敏感な) ≠ sensible(分別のある)。be sensitive to ～。","field":"性質・状態"}],
  ["considerate","形","pre1","思いやりのある","He is considerate of others.","彼は他人に思いやりがある。","consider(よく考える)+ -ate → 相手を思いやる→「思いやりのある」。considerable(かなりの)と区別。",{"syn":[{"w":"thoughtful","m":"思いやりのある"}],"ant":[{"w":"inconsiderate","m":"思いやりのない"}],"usage":"considerate(思いやりのある) ≠ considerable(かなりの)。","field":"心理"}],
  ["successive","形","1","連続する・引き続く","It rained for three successive days.","3日連続で雨が降った。","succeed(続く)+ -ive → 次々続く→「連続する」。",{"syn":[{"w":"consecutive","m":"連続する"}],"field":"性質・状態"}],
  ["literate","形","1","読み書きができる","Most adults here are literate.","ここの大人の大半は読み書きができる。","ラテン littera(文字)→「読み書きができる」。literal(文字通りの)と区別。",{"ant":[{"w":"illiterate","m":"読み書きできない"}],"usage":"literate(読み書きできる) ≠ literal(文字通りの)。","field":"教育"}],
]

export const WORDS_MORE12 = RAW.map(expandCompact)
