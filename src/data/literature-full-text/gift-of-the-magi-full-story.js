import part1 from './gift-of-the-magi-full-story-part-1.js'
import part2 from './gift-of-the-magi-full-story-part-2.js'

const scenes = Object.freeze([...part1, ...part2])

export default Object.freeze({
  id: 'lit_en_gift_of_magi_opening',
  excerpt: 'The Gift of the Magi・短編全文',
  coverage: Object.freeze({
    unitType: 'story',
    label: '短編全文',
    sourceUnit: 'The Gift of the Magi',
    complete: true,
    sourceWordCount: 2071,
    maxWordTarget: 5000,
    limitNote: '短編集のうち、5,000語以内で完結する表題作を全文収録',
    startMarker: scenes[0].original.slice(0, 80),
    endMarker: scenes.at(-1).original.slice(-100),
    sourceSha256: '1912e0386e1ac11256d62ec17df9c0d6407e96a74891246b71bcd462ff5cb1a8',
    checkedOn: '2026-08-27',
  }),
  scenes,
})
