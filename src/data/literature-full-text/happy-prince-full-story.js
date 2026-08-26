import part1 from './happy-prince-full-story-part-1.js'
import part2 from './happy-prince-full-story-part-2.js'

const scenes = Object.freeze([...part1, ...part2])

export default Object.freeze({
  id: 'lit_en_happy_prince_statue',
  excerpt: 'The Happy Prince・短編全文',
  coverage: Object.freeze({
    unitType: 'story',
    label: '短編全文',
    sourceUnit: 'The Happy Prince',
    complete: true,
    sourceWordCount: 3499,
    maxWordTarget: 5000,
    limitNote: '短編集のうち、5,000語以内で完結する表題作を全文収録',
    startMarker: scenes[0].original.slice(0, 80),
    endMarker: scenes.at(-1).original.slice(-100),
    sourceSha256: '6cb9a50e99700abb4a285fceb9cae02c17bd3064ee0c81491315ae0f6dd4a253',
    checkedOn: '2026-08-27',
  }),
  scenes,
})
