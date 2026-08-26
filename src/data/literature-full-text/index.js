import aliceChapter1 from './alice-chapter-1.js'
import giftOfTheMagi from './gift-of-the-magi-full-story.js'
import happyPrince from './happy-prince-full-story.js'
import mobyDickChapter1 from './moby-dick-chapter-1.js'
import prideAndPrejudiceChapter1 from './pride-and-prejudice-chapter-1.js'
import taleOfTwoCitiesChapter1 from './tale-of-two-cities-chapter-1.js'

const works = [
  mobyDickChapter1,
  prideAndPrejudiceChapter1,
  taleOfTwoCitiesChapter1,
  aliceChapter1,
  happyPrince,
  giftOfTheMagi,
]

export const LITERATURE_FULL_TEXT = Object.freeze(
  Object.fromEntries(works.map((work) => [work.id, work])),
)
