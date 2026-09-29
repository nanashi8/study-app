// 名作（英語）の一文ごとの構造台帳。作品の本文を1文ずつ読んで、主節の要素と、節・句の中の要素を
// 入れ子で書いた正解。画面の一文の構文解説（文の要素・構造図・文型・節・句の解説・語順訳）はここから作る。
// 並べた文をつなぐと作品の本文と一字一句同じになる（tests/literature-sentence-structures.test.mjs）。

import alice from './alice.js'
import giftOfTheMagi from './gift-of-the-magi.js'
import happyPrince from './happy-prince.js'
import mobyDick from './moby-dick.js'
import prideAndPrejudice from './pride-and-prejudice.js'
import taleOfTwoCities from './tale-of-two-cities.js'

export const LITERATURE_SENTENCE_STRUCTURES = Object.freeze({
  lit_en_moby_dick_water_gazers: mobyDick,
  lit_en_pride_prejudice_netherfield: prideAndPrejudice,
  lit_en_tale_two_cities_times: taleOfTwoCities,
  lit_en_alice_rabbit_hole: alice,
  lit_en_happy_prince_statue: happyPrince,
  lit_en_gift_of_magi_opening: giftOfTheMagi,
})
