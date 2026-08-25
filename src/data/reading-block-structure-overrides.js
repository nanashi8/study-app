// 自動ブロック境界だけでは支配関係を表せない、ユーザー確認済みの構造。
// 配列位置は既存の文法ブロック位置に対応し、ブロック数は変えない。

const block = ({ label, kind, role, scope = '', note }) => Object.freeze({
  label,
  kind,
  role,
  scope,
  note,
})

export const READING_BLOCK_STRUCTURE_OVERRIDES = Object.freeze({
  'People often describe choice as if it begins only when a person consciously compares several options.': Object.freeze([
    block({
      label: '主節・文の骨格',
      kind: 'core',
      role: null,
      note: 'People がS、often がM、describe がV、choice がOです。主節はSVOで、後ろのas if節はdescribeの様子を添えるMです。',
    }),
    block({
      label: 'as if副詞節の入口（as）',
      kind: 'clause',
      role: 'M',
      scope: 'as if節内',
      note: 'as は単独の目的格補語Cではありません。直後のifと一組でas ifを作り、「まるで〜かのように」という様態の副詞節Mを導きます。',
    }),
    block({
      label: 'as if副詞節（if以下）',
      kind: 'clause',
      role: 'M',
      scope: 'as if節内',
      note: 'if はここでは独立した条件節の入口ではなく、直前のasと一組です。itがS、beginsがV、onlyが後続のwhen節を限定するMです。',
    }),
    block({
      label: 'onlyが限定するwhen時節',
      kind: 'clause',
      role: 'M',
      scope: 'when節内',
      note: 'when以下はbeginsの時を示す副詞節Mです。onlyはこのwhen節全体に焦点を当て、「そのときにだけ始まる」と範囲を限定します。',
    }),
  ]),
  'This evidence makes it easier to improve a design or decide that a simpler solution would work better.': Object.freeze([
    block({
      label: '主節・文の骨格',
      kind: 'core',
      role: null,
      note: 'make O C の主節です。it は形式目的語で、実質内容は後ろの二つの不定詞へ送られます。',
    }),
    block({
      label: '形式目的語itの実質内容',
      kind: 'phrase',
      role: 'M',
      scope: '実質内容の不定詞列',
      note: 'to improve a design と (to) decide that ... が or で並列します。二つ目のtoは構造表示だけに補い、音声では発音しません。',
    }),
    block({
      label: 'decideの目的語となる内容節',
      kind: 'clause',
      role: 'O',
      scope: 'decideの内容節内',
      note: 'that は関係代名詞ではなく、decide の目的語となる内容節の入口です。節末の better までが判断内容です。',
    }),
  ]),
  'The integrity of public memory is then shaped less by what is available than by what is repeatedly presented as relevant.': Object.freeze([
    block({
      label: '主節と比較の程度',
      kind: 'core',
      role: null,
      note: 'is then shaped が一つの受動態Vで、less が less ... than ... の比較を予告します。',
    }),
    block({
      label: '比較前半の融合関係詞節',
      kind: 'clause',
      role: 'M',
      scope: '比較前半・by what節内',
      note: 'by what is available は「利用可能なものによって」。what は先行詞を含み、節全体が by の目的語です。than で比較後半へ切り替えます。',
    }),
    block({
      label: '比較後半の融合関係詞節',
      kind: 'clause',
      role: 'M',
      scope: '比較後半・by what節内',
      note: '二つ目の by what も一単位です。is repeatedly presented が what の内容、as relevant が present A as C の補語Cです。',
    }),
  ]),
  'If that practice declines, even perfect archives will not prevent societies from losing their ability to learn from what they once knew.': Object.freeze([
    block({
      label: '条件の副詞節',
      kind: 'clause',
      role: 'M',
      scope: '条件節内',
      note: 'If that practice declines 全体が「その実践が衰えれば」という条件です。',
    }),
    block({
      label: '主節・文の骨格',
      kind: 'core',
      role: null,
      note: 'even は主語 perfect archives を焦点化し、prevent O from -ing のOは societies です。',
    }),
    block({
      label: 'prevent O from -ing句',
      kind: 'phrase',
      role: 'M',
      scope: 'prevent O from -ing内',
      note: 'from losing は prevent O from -ing の一部で、societies が losing の意味上の主語、their ability が目的語です。',
    }),
    block({
      label: 'abilityを説明する不定詞',
      kind: 'phrase',
      role: 'M',
      scope: 'abilityの後置不定詞',
      note: 'to learn は ability の内容を後ろから説明し、「学ぶ能力」となります。',
    }),
    block({
      label: 'from what融合関係詞節・前半',
      kind: 'clause',
      role: 'M',
      scope: 'from what融合関係詞節内',
      note: 'from what を一つの発音・意味単位にします。what は先行詞を含み、後ろの節内では目的語を兼ねます。',
    }),
    block({
      label: 'from what融合関係詞節・後半',
      kind: 'clause',
      role: 'M',
      scope: 'from what融合関係詞節内',
      note: 'they が節内主語、once は条件でなく「かつて」という時のM、knew が節内Vです。別の時・条件節ではありません。',
    }),
  ]),
})

// block数を変えずに、文全体の見取り図では本来の節・句の範囲を示す。
// 下段カードの分割境界をそのまま括弧へすると、同じ節が二つに見えたり、
// than が融合関係詞節の内側に見えたりするため、直接確認済みの三文を固定する。
export const READING_SENTENCE_STRUCTURE_OVERRIDES = Object.freeze({
  'People often describe choice as if it begins only when a person consciously compares several options.':
    'People often describe choice (as if it begins only when a person consciously compares several options)',
  'This evidence makes it easier to improve a design or decide that a simpler solution would work better.':
    'This evidence makes it easier <to improve a design or decide (that a simpler solution would work better)>',
  'The integrity of public memory is then shaped less by what is available than by what is repeatedly presented as relevant.':
    'The integrity of public memory is then shaped less (by what is available) than (by what is repeatedly presented as relevant)',
  'If that practice declines, even perfect archives will not prevent societies from losing their ability to learn from what they once knew.':
    '(If that practice declines) even perfect archives will not prevent societies <from losing their ability> <to learn> (from what they once knew)',
})
