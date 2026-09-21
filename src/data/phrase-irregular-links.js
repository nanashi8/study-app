// 規則の変化形（-s・-ed・-ing）では作れない形でしか現れない熟語・構文を、元の語のカードにつなぐかどうかの台帳。
//   be → there is / as it were、make → be made of、tooth → brush one's teeth
// 候補は src/lib/wordPhrases.js の irregularPhraseCandidates が、下の IRREGULAR_WORD_FORMS と
// 子音字を重ねる長い語（commit → committed）・-ie → -ying・不規則な複数形（duplicate-forms.js）から拾う。
// 1件ずつ読み、元の語の使い方なら true、つづりが同じ別の語（turn left の left は「左」）なら外す理由を書く。
// 候補と台帳は tests/word-phrase-links.test.mjs が突き合わせ、読んでいない候補・候補でなくなった行を止める。

// 不規則な過去形・過去分詞・比較級・最上級などを、見出し語の id ごとに書く（助動詞の could・would などは別の見出し語なので入れない）。
export const IRREGULAR_WORD_FORMS = Object.freeze({
  arise: ['arose', 'arisen'],
  beat: ['beaten'],
  become: ['became'],
  begin: ['began', 'begun'],
  bend: ['bent'],
  bet: [],
  bid: [],
  bind: ['bound'],
  bite: ['bit', 'bitten'],
  bleed: ['bled'],
  blow: ['blew', 'blown'],
  break: ['broke', 'broken'],
  breed: ['bred'],
  bring: ['brought'],
  build: ['built'],
  burn: ['burnt'],
  burst: [],
  buy: ['bought'],
  cast: [],
  catch: ['caught'],
  choose: ['chose', 'chosen'],
  cling: ['clung'],
  come: ['came'],
  creep: ['crept'],
  cut: [],
  dig: ['dug'],
  dive: ['dove'],
  do: ['does', 'did', 'done'],
  draw: ['drew', 'drawn'],
  drink: ['drank', 'drunk'],
  drive: ['drove', 'driven'],
  dwell: ['dwelt'],
  eat: ['ate', 'eaten'],
  fall: ['fell', 'fallen'],
  feed: ['fed'],
  feel: ['felt'],
  fight: ['fought'],
  find: ['found'],
  flee: ['fled'],
  fling: ['flung'],
  fly: ['flew', 'flown'],
  forbid: ['forbade', 'forbidden'],
  forecast: [],
  foresee: ['foresaw', 'foreseen'],
  foretell: ['foretold'],
  forget: ['forgot', 'forgotten'],
  forgive: ['forgave', 'forgiven'],
  forsake: ['forsook', 'forsaken'],
  freeze: ['froze', 'frozen'],
  get: ['got', 'gotten'],
  give: ['gave', 'given'],
  go: ['goes', 'went', 'gone'],
  grind: ['ground'],
  grow: ['grew', 'grown'],
  hang: ['hung'],
  have: ['has', 'had'],
  hear: ['heard'],
  hide: ['hid', 'hidden'],
  hit: [],
  hold: ['held'],
  hurt: [],
  keep: ['kept'],
  kneel: ['knelt'],
  know: ['knew', 'known'],
  lay: ['laid'],
  lead: ['led'],
  lean: ['leant'],
  leap: ['leapt'],
  learn: ['learnt'],
  leave: ['left'],
  lend: ['lent'],
  let: [],
  'lie_2': ['lay', 'lain'],
  lose: ['lost'],
  make: ['made'],
  mean: ['meant'],
  meet: ['met'],
  mislead: ['misled'],
  overcome: ['overcame'],
  overhear: ['overheard'],
  overtake: ['overtook', 'overtaken'],
  overthrow: ['overthrew', 'overthrown'],
  pay: ['paid'],
  prove: ['proven'],
  put: [],
  quit: [],
  read: [],
  rid: [],
  ride: ['rode', 'ridden'],
  'ring_2': ['rang', 'rung'],
  rise: ['rose', 'risen'],
  run: ['ran'],
  say: ['said'],
  see: ['saw', 'seen'],
  seek: ['sought'],
  sell: ['sold'],
  send: ['sent'],
  sew: ['sewn'],
  shake: ['shook', 'shaken'],
  'shed_2': [],
  shine: ['shone'],
  shoot: ['shot'],
  show: ['shown'],
  shrink: ['shrank', 'shrunk'],
  shut: [],
  sing: ['sang', 'sung'],
  sink: ['sank', 'sunk'],
  sit: ['sat'],
  sleep: ['slept'],
  slide: ['slid'],
  smell: ['smelt'],
  sow: ['sown'],
  speak: ['spoke', 'spoken'],
  spell: ['spelt'],
  spend: ['spent'],
  spill: ['spilt'],
  spin: ['spun'],
  spit: ['spat'],
  split: [],
  spoil: ['spoilt'],
  spread: [],
  stand: ['stood'],
  steal: ['stole', 'stolen'],
  stick: ['stuck'],
  sting: ['stung'],
  stride: ['strode', 'stridden'],
  strike: ['struck', 'stricken'],
  strive: ['strove', 'striven'],
  swear: ['swore', 'sworn'],
  sweep: ['swept'],
  swell: ['swollen'],
  swim: ['swam', 'swum'],
  swing: ['swung'],
  take: ['took', 'taken'],
  teach: ['taught'],
  tell: ['told'],
  think: ['thought'],
  throw: ['threw', 'thrown'],
  thrust: [],
  undergo: ['underwent', 'undergone'],
  understand: ['understood'],
  undertake: ['undertook', 'undertaken'],
  undo: ['undid', 'undone'],
  uphold: ['upheld'],
  wake: ['woke', 'woken'],
  wear: ['wore', 'worn'],
  weave: ['wove', 'woven'],
  weep: ['wept'],
  win: ['won'],
  withdraw: ['withdrew', 'withdrawn'],
  withhold: ['withheld'],
  withstand: ['withstood'],
  write: ['wrote', 'written'],
  be: ['am', 'is', 'are', 'was', 'were', 'been', 'being'],
  // 形容詞・副詞の不規則な比較級・最上級
  good: ['better', 'best'],
  well: ['better', 'best'],
  bad: ['worse', 'worst'],
  many: ['more', 'most'],
  much: ['more', 'most'],
  little: ['less', 'least'],
  far: ['further', 'farther', 'furthest', 'farthest'],
  old: ['elder', 'eldest'],
  deal: ['dealt'],
  dream: ['dreamt'],
  mistake: ['mistook', 'mistaken'],
  tear: ['tore', 'torn'],
  light: ['lit'],
  speed: ['sped'],
  string: ['strung'],
})

// '見出し語id|熟語・構文id': true（つなぐ）／外す理由
export const IRREGULAR_PHRASE_LINKS = Object.freeze({
  'make|exam_idm_be_made_of': true, // be made of（made）
  'make|exam_idm_be_made_from': true, // be made from（made）
  'give|curr1900_idm_pre2_given_that': true, // given that（given）
  'see|curr1900_idm_pre2_remain_to_be_seen': true, // remain to be seen（seen）
  'lose|curr_idm_4_get_lost': true, // get lost（lost）
  'think|curr1900_idm_pre1_on_second_thought': '名詞 thought（考え）の熟語で、think の過去形ではない（ほかの品詞の形の thought から引ける）', // on second thought（thought）
  'know|curr_idm_pre2_be_known_for': true, // be known for（known）
  'say|curr1900_idm_pre2_having_said_that': true, // having said that（said）
  'say|curr1900_idm_3_it_is_said_that_blank': true, // It is said that ...（said）
  'leave|exam_idm_turn_left': 'left は「左」の意味で、leave の過去形ではない', // turn left（left）
  'tooth|curr_idm_5_brush_ones_teeth': true, // brush one's teeth（teeth）
  'bind|curr_idm_2_be_bound_for': 'bound は「〜行きの」の意味の別の語で、bind の過去分詞ではない', // be bound for（bound）
  'bind|curr1900_idm_2_be_bound_to_do': true, // be bound to do（bound）
  'understand|curr1900_idm_pre1_make_oneself_understood': true, // make oneself understood（understood）
  'commit|curr_idm_pre1_be_committed_to': true, // be committed to（committed）
  'have|curr1900_idm_2_all_one_has_to_do_is_to_do': true, // All one has to do is (to) do（has）
  'have|curr1900_idm_pre1_legend_has_it_that': true, // Legend has it that（has）
  'have|syn_had_better': true, // had better do（had）
  'feed|curr1900_idm_pre1_be_fed_up_with': true, // be fed up with（fed）
  'be|syn_there_is': true, // there is / are ~（is）
  'be|syn_it_for_to': true, // It is ... for — to do（is）
  'be|syn_no_use_doing': true, // It is no use doing（is）
  'be|curr1900_idm_pre1_a_is_one_thing_b_is_another': true, // A is one thing; B is another（is）
  'be|curr1900_idm_pre1_a_is_to_b_what_c_is_to_d': true, // A is to B what C is to D（is）
  'be|curr1900_idm_2_all_one_has_to_do_is_to_do': true, // All one has to do is (to) do（is）
  'be|curr1900_idm_2_as_is_often_the_case_with': true, // as is often the case with（is）
  'be|curr1900_idm_2_as_it_is': true, // as it is（is）
  'be|curr1900_idm_4_here_is_blank': true, // Here is ~ .（is）
  'be|curr1900_idm_pre1_it_is_high_time_that': true, // It is high time that（is）
  'be|curr1900_idm_pre1_it_is_no_wonder_that': true, // It is no wonder that（is）
  'be|curr1900_idm_pre1_it_is_not_long_before': true, // It is not long before（is）
  'be|curr1900_idm_pre1_it_is_not_until_blank_that': true, // It is not until ... that（is）
  'be|curr1900_idm_3_it_is_said_that_blank': true, // It is said that ...（is）
  'be|curr1900_idm_4_it_is_time_to': true, // it is time to（is）
  'be|curr1900_idm_pre1_it_is_true_that_blank_but_blank': true, // It is true that ..., but ...（is）
  'be|curr1900_idm_pre1_nothing_is_more_a_than_b': true, // Nothing is more A than B（is）
  'be|curr1900_idm_pre1_such_as_it_is': true, // such as it is（is）
  'be|curr1900_idm_2_that_is_to_say': true, // that is to say（is）
  'be|curr1900_idm_pre1_there_is_no_doing': true, // There is no doing（is）
  'be|curr1900_idm_pre2_there_is_something_wrong_with': true, // There is something wrong with（is）
  'be|curr1900_idm_2_what_blank_is': true, // what ... is（is）
  'be|curr1900_idm_2_what_is_blank_like': true, // What is ... like?（is）
  'be|curr1900_idm_pre1_what_is_more': true, // what is more（is）
  'be|curr_idm_4_here_you_are': true, // here you are（are）
  'be|curr1900_idm_pre1_here_we_are': true, // Here we are.（are）
  'be|curr1900_idm_4_how_are_you': true, // How are you?（are）
  'be|curr1900_idm_pre1_the_chances_are_that': true, // The chances are that（are）
  'be|curr1900_idm_2_as_it_were': true, // as it were（were）
  'be|curr1900_idm_2_if_it_were_not_for': true, // if it were not for（were）
  'be|exam_idm_have_been_to': true, // have been to（been）
  'lie_2|exam_idm_lay_the_groundwork_for': '動詞 lay（置く・築く）の熟語で、lie の過去形 lay ではない', // lay the groundwork for（lay）
  'lie_2|curr_idm_2_lay_off': '動詞 lay（置く）の熟語で、lie の過去形 lay ではない', // lay off（lay）
  'lie_2|curr_idm_pre1_lay_out': '動詞 lay（置く・並べる）の熟語で、lie の過去形 lay ではない', // lay out（lay）
  // 比較級・最上級の熟語（good・bad・many・much・little へつなぐ）
  'good|syn_had_better': true, // had better do（better）
  'good|curr_idm_1_for_better_or_worse': true, // for better or worse（better）
  'good|curr1900_idm_pre1_get_the_better_of': true, // get the better of（better）
  'good|curr1900_idm_pre1_it_couldn_t_be_better': true, // It couldn't be better.（better）
  'good|curr1900_idm_pre1_know_better_than_to_do': true, // know better than to do（better）
  'good|exam_idm_do_ones_best': true, // do one's best（best）
  'good|curr_idm_pre1_at_best': true, // at best（best）
  'good|curr1900_idm_2_make_the_best_of': true, // make the best of（best）
  'good|curr1900_idm_pre1_to_the_best_of_ones_knowledge': true, // to the best of one's knowledge（best）
  'little|curr_idm_4_less_than': true, // less than（less）
  'little|curr1900_idm_pre2_more_or_less': true, // more or less（less）
  'little|curr1900_idm_pre1_much_less': true, // much less（less）
  'little|exam_idm_at_least': true, // at least（least）
  'little|curr_idm_1_not_least': true, // not least（least）
  'little|curr1900_idm_pre2_last_but_not_least': true, // last but not least（least）
  'little|curr1900_idm_pre1_not_blank_in_the_least': true, // not ... in the least（least）
  'bad|curr_idm_1_for_better_or_worse': true, // for better or worse（worse）
  'bad|curr1900_idm_2_to_make_matters_worse': true, // to make matters worse（worse）
  'bad|curr1900_idm_pre1_worse_still': true, // worse still（worse）
  'well|syn_had_better': 'better・best は good の比較級・最上級として good のカードに出す（well の比較級も同じ形なので重ねない）', // had better do（better）
  'well|curr_idm_1_for_better_or_worse': 'better・best は good の比較級・最上級として good のカードに出す（well の比較級も同じ形なので重ねない）', // for better or worse（better）
  'well|curr1900_idm_pre1_get_the_better_of': 'better・best は good の比較級・最上級として good のカードに出す（well の比較級も同じ形なので重ねない）', // get the better of（better）
  'well|curr1900_idm_pre1_it_couldn_t_be_better': 'better・best は good の比較級・最上級として good のカードに出す（well の比較級も同じ形なので重ねない）', // It couldn't be better.（better）
  'well|curr1900_idm_pre1_know_better_than_to_do': 'better・best は good の比較級・最上級として good のカードに出す（well の比較級も同じ形なので重ねない）', // know better than to do（better）
  'well|exam_idm_do_ones_best': 'better・best は good の比較級・最上級として good のカードに出す（well の比較級も同じ形なので重ねない）', // do one's best（best）
  'well|curr_idm_pre1_at_best': 'better・best は good の比較級・最上級として good のカードに出す（well の比較級も同じ形なので重ねない）', // at best（best）
  'well|curr1900_idm_2_make_the_best_of': 'better・best は good の比較級・最上級として good のカードに出す（well の比較級も同じ形なので重ねない）', // make the best of（best）
  'well|curr1900_idm_pre1_to_the_best_of_ones_knowledge': 'better・best は good の比較級・最上級として good のカードに出す（well の比較級も同じ形なので重ねない）', // to the best of one's knowledge（best）
  'many|curr_idm_4_more_than': true, // more than（more）
  'many|curr_idm_1_all_the_more': true, // all the more（more）
  'many|curr1900_idm_4_more_and_more': true, // more and more（more）
  'many|curr1900_idm_1_more_often_than_not': true, // more often than not（more）
  'many|curr1900_idm_pre2_more_or_less': true, // more or less（more）
  'many|curr1900_idm_pre1_nothing_is_more_a_than_b': true, // Nothing is more A than B（more）
  'many|curr1900_idm_pre1_what_is_more': true, // what is more（more）
  'many|curr_idm_4_most_of': true, // most of（most）
  'many|curr_idm_pre2_at_most': true, // at most（most）
  'many|curr1900_idm_pre2_for_the_most_part': true, // for the most part（most）
  'many|curr1900_idm_2_make_the_most_of': true, // make the most of（most）
  'much|curr_idm_4_more_than': true, // more than（more）
  'much|curr_idm_1_all_the_more': true, // all the more（more）
  'much|curr1900_idm_4_more_and_more': true, // more and more（more）
  'much|curr1900_idm_1_more_often_than_not': true, // more often than not（more）
  'much|curr1900_idm_pre2_more_or_less': true, // more or less（more）
  'much|curr1900_idm_pre1_nothing_is_more_a_than_b': true, // Nothing is more A than B（more）
  'much|curr1900_idm_pre1_what_is_more': true, // what is more（more）
  'much|curr_idm_4_most_of': true, // most of（most）
  'much|curr_idm_pre2_at_most': true, // at most（most）
  'much|curr1900_idm_pre2_for_the_most_part': true, // for the most part（most）
  'much|curr1900_idm_2_make_the_most_of': true, // make the most of（most）
})
