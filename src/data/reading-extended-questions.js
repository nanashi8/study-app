const question = ({ id, q, questionJa, choices, answer, explain }) => {
  const englishChoices = choices.map(([en]) => en)
  const translations = Object.freeze(Object.fromEntries(choices))
  return Object.freeze({
    id,
    q,
    questionJa,
    choices: Object.freeze(englishChoices),
    answer,
    answerJa: translations[answer],
    choiceTranslations: translations,
    explain,
  })
}

const freezeQuestions = (items) => Object.freeze(items.map(question))

export const EXTENDED_READING_QUESTIONS = Object.freeze({
  p_ext_1000_civic_decisions: freezeQuestions([
    {
      id: 'erq_civic_01',
      q: 'How does the opening section describe representation?',
      questionJa: '最初の節は「代表」をどのように説明していますか。',
      choices: [
        ['As a practice rather than a title.', '肩書ではなく実践として。'],
        ['As a reward for avoiding public debate.', '公的な議論を避けた報酬として。'],
        ['As a legal status that can never change.', '決して変わらない法的地位として。'],
        ['As a private skill used only at school.', '学校でだけ使う私的な技能として。'],
      ],
      answer: 'As a practice rather than a title.',
      explain: '「声と代表」の第3文が Representation is therefore a practice rather than a title. と対比しています。',
    },
    {
      id: 'erq_civic_02',
      q: 'What happens when important information is hidden or hard to verify?',
      questionJa: '重要な情報が隠され、検証しにくいとどうなりますか。',
      choices: [
        ['Citizens cannot compare proposals.', '市民は提案を比較できません。'],
        ['Every proposal becomes less expensive.', 'どの提案もより安くなります。'],
        ['Legal duties disappear automatically.', '法的義務が自動的になくなります。'],
        ['Media no longer need education.', 'メディアは教育を必要としなくなります。'],
      ],
      answer: 'Citizens cannot compare proposals.',
      explain: '「議論の前に必要な情報」の第2文が、数字が隠され・遅らされ・分からない言葉で表されると Comparison becomes impossible. と述べています。',
    },
    {
      id: 'erq_civic_03',
      q: 'Why does the text connect budgets with public promises?',
      questionJa: '本文はなぜ予算と公的な約束を結び付けていますか。',
      choices: [
        ['Every promise uses resources that could serve another goal.', 'どの約束も、別の目的に使えた資源を使うから。'],
        ['Public promises never require labor or time.', '公的な約束には労働も時間も必要ないから。'],
        ['Economic examples always prove one slogan correct.', '経済の事例は必ず一つの主張を正しいと証明するから。'],
        ['Money is the only public resource that matters.', '金銭だけが重要な公共資源だから。'],
      ],
      answer: 'Every promise uses resources that could serve another goal.',
      explain: '「予算と公共の選択」の冒頭が the time, labor, land, or money that could have served another goal と、別の目的に使えたはずの資源を並べています。',
    },
    {
      id: 'erq_civic_04',
      q: 'What balance should a democratic choice maintain?',
      questionJa: '民主的な選択はどのような均衡を保つべきですか。',
      choices: [
        ['It should guide action and remain open to revision.', '行動を導きつつ、見直しに開かれているべきです。'],
        ['It should remain vague and never guide action.', '曖昧なままで、決して行動を導かないべきです。'],
        ['It should treat every correction as defeat.', 'あらゆる修正を敗北とみなすべきです。'],
        ['It should exclude evidence after a decision.', '決定後は証拠を排除すべきです。'],
      ],
      answer: 'It should guide action and remain open to revision.',
      explain: '「見直せる決定」の冒頭が firm enough to guide action と open enough to be revised を and で並べ、両方を条件にしています。',
    },
  ]),

  p_ext_2000_customs_across_borders: freezeQuestions([
    {
      id: 'erq_customs_01',
      q: 'Why does the text say that neither name order is more polite than the other?',
      questionJa: '本文はなぜ、どちらの名前の順番も他方より礼儀正しいわけではないと述べていますか。',
      choices: [
        ['Because each answers a different question about where a person belongs.', 'それぞれが、人がどこに属するかについての別の問いに答えているから。'],
        ['Because both orders were invented at the same time.', 'どちらの順番も同じ時期に作られたから。'],
        ['Because titles are always more polite than first names.', '肩書は常に名前より礼儀正しいから。'],
        ['Because only bilingual speakers use family names first.', '二言語を話す人だけが姓を先に使うから。'],
      ],
      answer: 'Because each answers a different question about where a person belongs.',
      explain: '「挨拶と第一印象」の第6文が、丁寧さの優劣ではなく所属を示す問いの違いだと述べています。',
    },
    {
      id: 'erq_customs_02',
      q: 'According to the text, what is a guest expected to notice at a table?',
      questionJa: '本文によれば、客は食卓で何に気づくことを期待されていますか。',
      choices: [
        ['The effort behind the meal rather than its expense.', '食事にかかった費用ではなく、その手間。'],
        ['The exact number of dishes that are served.', '供される皿のちょうどの数。'],
        ['Whether the host followed a written rule book.', '主人が成文の規則集に従ったかどうか。'],
        ['How much the ingredients cost at the market.', '材料が市場でいくらしたか。'],
      ],
      answer: 'The effort behind the meal rather than its expense.',
      explain: '「もてなしと食卓」で The effort rather than the expense … と、費用ではなく手間が焦点だと示されています。',
    },
    {
      id: 'erq_customs_03',
      q: 'What does the text say about a festival that has changed its purpose?',
      questionJa: '目的が変わった祭りについて、本文は何と述べていますか。',
      choices: [
        ['It is not false, because meaning is assigned by the people who keep it.', 'それを続ける人々が意味を与えるので、偽物ではない。'],
        ['It stops being a festival once money is involved.', '金銭が関わった時点で祭りではなくなる。'],
        ['It must return to its original religious form.', 'もとの宗教的な形に戻らなければならない。'],
        ['It can only be studied inside a museum.', '博物館の中でしか研究できない。'],
      ],
      answer: 'It is not false, because meaning is assigned by the people who keep it.',
      explain: '「祭り・信仰・日常生活」が Neither change makes the festival false … と述べ、意味の担い手を続ける人々に置いています。',
    },
    {
      id: 'erq_customs_04',
      q: 'What is the error in a stereotype, according to the final section?',
      questionJa: '最終節によれば、固定観念の誤りはどこにありますか。',
      choices: [
        ['The range over which an observation is applied.', '観察が適用される範囲。'],
        ['The fact that the traveller saw anything at all.', '旅行者が何かを見たということ自体。'],
        ['The decision to compare two cultures.', '二つの文化を比べるという決定。'],
        ['The use of examples taken from one family.', '一つの家族から取った例を使うこと。'],
      ],
      answer: 'The range over which an observation is applied.',
      explain: '「決めつけずに学ぶ」が The error is not the original observation … the range over which it is applied と限定しています。',
    },
  ]),

  p_ext_3000_shared_watershed: freezeQuestions([
    {
      id: 'erq_watershed_01',
      q: 'Why does the text compare a river basin to a sponge rather than to a pipe?',
      questionJa: '本文はなぜ流域を管ではなく海綿にたとえていますか。',
      choices: [
        ['Because much of the rain sinks in and is released slowly.', '雨の多くがしみ込み、ゆっくりと放出されるから。'],
        ['Because a basin is always the same shape as a sponge.', '流域はいつも海綿と同じ形をしているから。'],
        ['Because rivers are usually built by engineers.', '川はたいてい技術者によって造られるから。'],
        ['Because rain never reaches the channel at all.', '雨が川筋に届くことはまったくないから。'],
      ],
      answer: 'Because much of the rain sinks in and is released slowly.',
      explain: '「雨から川へ」で、しみ込んだ水は蓄えられ流れ去る水は一度に届くと述べ、表面の不揃いな海綿にたとえています。',
    },
    {
      id: 'erq_watershed_02',
      q: 'What does the text call the most important fact about living systems?',
      questionJa: '本文は、生きた仕組みについて最も重要な事実を何だと述べていますか。',
      choices: [
        ['Damage is quick and cheap while repair is slow and costly.', '損傷は速く安いのに、修復は遅く高くつくこと。'],
        ['Every species benefits equally from a warmer river.', 'どの種も川が暖まれば等しく利益を得ること。'],
        ['Vegetation along a bank has almost no effect.', '岸辺の植生にはほとんど効果がないこと。'],
        ['New species are always noticed before they spread.', '新しい種は広がる前に必ず気づかれること。'],
      ],
      answer: 'Damage is quick and cheap while repair is slow and costly.',
      explain: '「生きた仕組み」が、岸辺の帯は取り除くのは安く速いが同じ働きの回復には数十年かかると述べ、その非対称を最重要としています。',
    },
    {
      id: 'erq_watershed_03',
      q: 'According to the text, why can a field become less productive while every harvest looks successful?',
      questionJa: '本文によれば、どの収穫も成功に見えるのに畑の生産力が落ちるのはなぜですか。',
      choices: [
        ['Because irrigation leaves salt behind in the soil.', '灌漑が土に塩を残していくから。'],
        ['Because farmers stop using any fertilizer at all.', '農民が肥料をまったく使わなくなるから。'],
        ['Because trade always lowers the price of grain.', '貿易が必ず穀物の価格を下げるから。'],
        ['Because cover crops remove the topsoil each year.', '被覆作物が毎年表土を取り除くから。'],
      ],
      answer: 'Because irrigation leaves salt behind in the soil.',
      explain: '「農地・食料・土」で、蒸発した水が鉱物を残し、収穫時には成功に見えながら生産力が落ちると説明しています。',
    },
    {
      id: 'erq_watershed_04',
      q: 'What does the text say makes a treaty about a shared river hold together?',
      questionJa: '共有された川についての条約をつなぎとめるものは何だと本文は述べていますか。',
      choices: [
        ['The cost of leaving the agreement rather than a penalty inside it.', '内部の罰則ではなく、その合意から抜ける費用。'],
        ['The strength of the army on the upstream side.', '上流側の軍隊の強さ。'],
        ['A promise of restraint from the downstream side.', '下流側からの自制の約束。'],
        ['The number of pages the treaty contains.', '条約の頁数。'],
      ],
      answer: 'The cost of leaving the agreement rather than a penalty inside it.',
      explain: '「下流まで共有する資源」が What holds an agreement together … the cost of leaving it rather than any penalty stated inside it と明記しています。',
    },
  ]),

  p_ext_4000_generational_city: freezeQuestions([
    {
      id: 'erq_city_01',
      q: 'Why does the text say that the choice of a discount rate settles the answer in advance?',
      questionJa: '本文はなぜ、割引率の選択が前もって答えを決めてしまうと述べていますか。',
      choices: [
        ['A high rate makes the distant future almost worth nothing.', '高い率は遠い未来をほとんど無価値にしてしまうから。'],
        ['A discount rate is decided by an international treaty.', '割引率は国際条約によって決められるから。'],
        ['Economists never state the rate they have used.', '経済学者は使った率を決して述べないから。'],
        ['The rate is the only figure a household ever feels.', '家庭が感じるのはその率だけだから。'],
      ],
      answer: 'A high rate makes the distant future almost worth nothing.',
      explain: '「翌年より先を考える」で、高い率は遠い未来をほとんど無価値に、低い率はほぼ現在として扱うと対比しています。',
    },
    {
      id: 'erq_city_02',
      q: 'According to the text, why does design matter more than persuasion?',
      questionJa: '本文によれば、なぜ説得より設計のほうが重要なのですか。',
      choices: [
        ['A system that makes the desired action easiest survives changes in enthusiasm.', '望ましい行動を最も簡単にする仕組みは、熱意の変化を生き延びるから。'],
        ['People always prefer to be persuaded rather than instructed.', '人は指示されるより説得されるほうを常に好むから。'],
        ['Habits play almost no part in ordinary daily life.', '習慣は日常生活でほとんど役割を果たさないから。'],
        ['Recycling is the only activity that a city has to maintain.', 'リサイクルこそ都市が維持すべき唯一の活動だから。'],
      ],
      answer: 'A system that makes the desired action easiest survives changes in enthusiasm.',
      explain: '「恐れ・希望・注意」が、望ましい行動を最も簡単な選択肢にする仕組みは世論の熱意の変化を生き延びると述べています。',
    },
    {
      id: 'erq_city_03',
      q: 'What does the text say about a policy that moves care from an institution to a family?',
      questionJa: 'ケアを施設から家庭へ移す政策について、本文は何と述べていますか。',
      choices: [
        ['It has moved a cost rather than removed it.', '費用を取り除いたのではなく移しただけである。'],
        ['It always reduces the total cost of care.', 'ケアの総費用を必ず減らす。'],
        ['It appears clearly in the national accounts.', '国民経済計算にはっきり現れる。'],
        ['It removes the need for any medical treatment.', 'あらゆる医療を不要にする。'],
      ],
      answer: 'It has moved a cost rather than removed it.',
      explain: '「生涯にわたるケア」が、家庭でのケアは無償で統計に現れないため、費用は取り除かれず移されただけだと述べています。',
    },
    {
      id: 'erq_city_04',
      q: 'What does a review date do to a decision, according to the final section?',
      questionJa: '最終節によれば、見直しの期日は決定に何をしますか。',
      choices: [
        ['It makes a permanent commitment temporary without weakening it today.', '今日の効力を弱めずに、恒久的な約束を暫定的なものに変える。'],
        ['It cancels the decision as soon as the date arrives.', '期日が来た時点で決定を取り消す。'],
        ['It transfers the decision to a different office.', '決定を別の部署へ移す。'],
        ['It prevents any future government from changing the rule.', '将来のどの政府も規則を変えられないようにする。'],
      ],
      answer: 'It makes a permanent commitment temporary without weakening it today.',
      explain: '「見直しに開かれた未来」が、期日は今日の効力を弱めずに恒久的な約束を暫定的なものへ変えると明記しています。',
    },
  ]),
})
