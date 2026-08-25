// 1900.xlsx は照合用の語彙候補としてのみ使う。
// 出版物由来の並びは保持せず、明白な誤記・省略記号・既存カードとの表記差を
// 学習用の正規形へ明示的に解決する。監査と検索が同じ判断を共有するための表。

export const CURRICULUM_1900_WORD_RESOLUTIONS = Object.freeze({
  mil: 'mill',
  repot: 'report',
  stat: 'start',
})

export const CURRICULUM_1900_PHRASE_RESOLUTIONS = Object.freeze({
  'A is to B what C is to D.': 'A is to B what C is to D',
  'All one has to do is to do.': 'All one has to do is (to) do',
  "Couldn't be better.": "It couldn't be better.",
  'Here you are.': 'here you are',
  'How many ~?': 'how many',
  'How much ~?': 'how much',
  'It is no use doing.': 'It is no use doing',
  'It is not until ~ that': 'It is not until ... that',
  'It is said that ~ .': 'It is said that ...',
  'It is true ~ , but': 'It is true that ..., but ...',
  'Just as ~ , so ~': 'Just as ..., so ...',
  'Nothing is more A than B.': 'Nothing is more A than B',
  'Something is wrong with': 'There is something wrong with',
  'What ~ for?': 'What ... for?',
  'What ~ like?': 'What is ... like?',
  "You're welcome.": "you're welcome",
  '~ and so on': 'and so on',
  '~, so that': '..., so that ...',
  '~ to come': '... to come',
  '~ to go': '... to go',
  'a ~ variety of': 'a variety of',
  'as soon as': 'as soon as ~',
  'as ~ as possible': 'as ... as possible',
  'at all cost': 'at all costs',
  'at sight of': 'at the sight of',
  'at the most': 'at most',
  'be about to': 'be about to do',
  'be at odds with': 'at odds with',
  'be inclined to do': 'be inclined to',
  'be liable to do': 'be liable to',
  'be likely to do': 'be likely to',
  'be willing to do': 'be willing to',
  'discourage A from B': 'discourage A from doing',
  'feel like ~ing': 'feel like doing',
  'hardly ~ when': 'hardly ... when ~',
  'have good command of': 'have a good command of',
  'in as much as': 'inasmuch as',
  'in face of': 'in the face of',
  'in order to': 'in order to do',
  'in the light of': 'in light of',
  'keep A from B': 'keep A from doing',
  "keep one's promise": 'keep a promise',
  'keep in touch': 'keep in touch with',
  "lose one's face": 'lose face',
  'make both ends meet': 'make ends meet',
  'no matter how': 'no matter how ...',
  'no sooner ~ than': 'no sooner ... than ~',
  'never do without': 'never ... without doing',
  'not ~ in the least': 'not ... in the least',
  'not ~ at all': 'not ... at all',
  'on charge of': 'on a charge of',
  'on the condition that': 'on condition that',
  'prevent A from B': 'prevent A from doing',
  'prohibit A from B': 'prohibit A from doing',
  'put ~ into practice': 'put A into practice',
  'remind A of B.': 'remind A of B',
  roundup: 'round up',
  'see ~ off': 'see off',
  'so A that B': 'so ... that ~',
  'so ~ that': 'so ... that ~',
  'sort kind of': 'sort of / kind of',
  'take ~ away': 'take away',
  'take ~ for granted': 'take A for granted',
  'take ~ into account': 'take into account',
  'the 比較級 ~, the 比較級 ~': 'the 比較級, the 比較級',
  'the former ~ , the latter ~': 'the former ..., the latter ...',
  'the last ~ to do': 'the last ... to do',
  'to ~ extent': 'to some extent',
  'too A to B': 'too ... to do',
  'with a view to doing': 'with a view to',
  'within walking distance of': 'within walking distance',
  'what ~ is': 'what ... is',
  'would like A to B': 'would like A to do',
})

const resolutionKey = (value) => String(value ?? '')
  .normalize('NFKC')
  .replace(/[‘’]/g, "'")
  .replace(/\s+/g, ' ')
  .trim()
  .toLowerCase()

const PHRASE_RESOLUTION_BY_KEY = new Map(
  Object.entries(CURRICULUM_1900_PHRASE_RESOLUTIONS)
    .map(([source, target]) => [resolutionKey(source), target]),
)
const WORD_RESOLUTION_BY_KEY = new Map(
  Object.entries(CURRICULUM_1900_WORD_RESOLUTIONS)
    .map(([source, target]) => [resolutionKey(source), target]),
)

export const curriculum1900CanonicalPhrase = (phrase) =>
  CURRICULUM_1900_PHRASE_RESOLUTIONS[phrase] ?? PHRASE_RESOLUTION_BY_KEY.get(resolutionKey(phrase)) ?? phrase

export const curriculum1900CanonicalWord = (word) =>
  CURRICULUM_1900_WORD_RESOLUTIONS[word] ?? WORD_RESOLUTION_BY_KEY.get(resolutionKey(word)) ?? word

export const curriculum1900PhraseAliasesFor = (phrase) => Object.entries(CURRICULUM_1900_PHRASE_RESOLUTIONS)
  .filter(([, target]) => resolutionKey(target) === resolutionKey(phrase))
  .map(([source]) => source)
