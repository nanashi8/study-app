// 単語から熟語・構文へのつながりのうち、全件を1件ずつ読んだ見直しで外したもの（lib/wordPhrases.js が使う）。
// キーは「見出し語の id|熟語・構文の id」、値は外した理由。
// つながりは見出しのつづりと規則的な変化形で拾うので、別の語が同じつづりになった形（be の変化形に見える bed）や、
// 同じつづりの別の語の熟語が混ざる。同じつづりの別の語の熟語は、その語の見出し語（homograph-words.js の phraseIds）へ移す。
// 見直した語は docs/audits/phrase-links-review.json に記録し、scripts/checks/phrase-links-review.mjs が全件を確かめる。
export const PHRASE_LINK_EXCLUDED = Object.freeze({
  'bee|curr_idm_2_come_into_being': 'being は bee（ハチ）の変化形ではなく be の -ing 形',
  'bee|curr_idm_pre1_for_the_time_being': 'being は bee（ハチ）の変化形ではなく be の -ing 形',
  'be|curr_idm_5_go_to_bed': 'bed（ベッド）は be の変化形ではなく別の語',
  'even|curr_idm_5_in_the_evening': 'evening（夕方）は even の変化形ではない別の語',
  'fee|curr1900_idm_2_feed_on': 'feed（食べさせる）は fee（料金）の変化形ではない別の語',
  'mean|curr_idm_2_by_all_means': 'means（手段）は mean（意味する）の変化形ではなく別の語で、means のカードに出る',
  'mean|curr_idm_2_by_no_means': 'means（手段）は mean（意味する）の変化形ではなく別の語で、means のカードに出る',
  'mean|curr_idm_pre1_a_means_of': 'means（手段）は mean（意味する）の変化形ではなく別の語で、means のカードに出る',
  'mean|exam_idm_by_means_of': 'means（手段）は mean（意味する）の変化形ではなく別の語で、means のカードに出る',
  'verse|curr1900_idm_2_be_versed_in': 'versed（精通した）は verse（韻文）の変化形ではない別の語',
})
