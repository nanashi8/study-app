// 出典のページ（メニューのいちばん下の「出典」）に載せるもの。
// 教材づくりで参考にしたものと、図や数値に使った資料。学習の画面には出さず、このページにまとめる（利用者の指示、2026-09-29）。
//
//   項目 = { id, name, url?, use, stations? }
//   stations は雨温図の地点（'japan' は日本の地点、'world' は世界の地点）。ページが data/subjects/climate.js から地点名を並べる。
// 図（figure）が使う資料は tests/junior-social-science.test.mjs が確かめる：
//   日本地図・世界地図 → natural-earth、雨温図 → jma-normals-japan / jma-normals-world、figure.source → その id。

export const CREDIT_SECTIONS = Object.freeze([
  Object.freeze({
    id: 'units',
    title: '単元の並び',
    note: '要点・重要語句・問題・図の文は、このアプリで書いたものです。',
    items: Object.freeze([
      Object.freeze({
        id: 'tosho-social',
        name: '東京書籍『新編 新しい社会 地理』『新編 新しい社会 歴史』『新編 新しい社会 公民』（令和7年度用）',
        url: 'https://www.tokyo-shoseki.co.jp/',
        use: '社会アプリの単元の並びと単元名を参考にしました。',
      }),
      Object.freeze({
        id: 'tosho-science',
        name: '東京書籍『新編 新しい科学 1』『新編 新しい科学 2』『新編 新しい科学 3』（令和7年度用）',
        url: 'https://www.tokyo-shoseki.co.jp/',
        use: '理科アプリの単元の並びと単元名を参考にしました。',
      }),
    ]),
  }),
  Object.freeze({
    id: 'maps',
    title: '地図',
    items: Object.freeze([
      Object.freeze({
        id: 'natural-earth',
        name: 'Natural Earth',
        url: 'https://www.naturalearthdata.com/',
        use: '日本地図（都道府県・北方領土・竹島・尖閣諸島・琵琶湖）と世界地図（国の形・大河の流れ・大きな湖）に使いました。',
      }),
    ]),
  }),
  Object.freeze({
    id: 'climate',
    title: '気候の数値',
    items: Object.freeze([
      Object.freeze({
        id: 'jma-normals-japan',
        name: '気象庁「過去の気象データ検索」の平年値（1991〜2020年）',
        url: 'https://www.data.jma.go.jp/stats/etrn/',
        use: '雨温図の月の平均気温と月降水量に使いました。',
        stations: 'japan',
      }),
      Object.freeze({
        id: 'jma-normals-world',
        name: '気象庁「世界の天候データツール」の地点別平年値（1991〜2020年）',
        url: 'https://www.data.jma.go.jp/cpd/monitor/normal/',
        use: '雨温図の月の平均気温と月降水量に使いました。',
        stations: 'world',
      }),
    ]),
  }),
  Object.freeze({
    id: 'territory',
    title: '領域の数値',
    items: Object.freeze([
      Object.freeze({
        id: 'kaiho-ryokai',
        name: '海上保安庁「日本の領海等概念図」の面積',
        url: 'https://www1.kaiho.mlit.go.jp/ryokai/gainenzu.html',
        use: '地理「日本の姿」の、国土と領海・排他的経済水域の面積をくらべるグラフに使いました。',
      }),
    ]),
  }),
  Object.freeze({
    id: 'population',
    title: '人口の数値',
    items: Object.freeze([
      Object.freeze({
        id: 'census-2020-commute',
        name: '総務省統計局「令和2年国勢調査 従業地・通学地による人口・就業状態等集計 結果の概要」',
        url: 'https://www.stat.go.jp/data/kokusei/2020/kekka/pdf/outline_04.pdf',
        use: '地理「関東地方」の、東京都と周りの県の昼夜間人口比率のグラフに使いました。',
      }),
      Object.freeze({
        id: 'moj-isa-r6',
        name: '出入国在留管理庁「令和6年の出入国在留管理業務の状況」',
        url: 'https://www.moj.go.jp/isa/content/001435886.pdf',
        use: '公民「現代社会の特色と私たち」の、在留外国人数の移り変わり（2019〜2024年末）のグラフに使いました。',
      }),
      Object.freeze({
        id: 'census-2020-aging',
        name: '総務省統計局「令和2年国勢調査 人口等基本集計」',
        url: 'https://www.stat.go.jp/data/kokusei/2020/kekka.html',
        use: '地理「中国・四国地方」の、全国と中国・四国地方の県の65歳以上の人の割合（2020年）のグラフに使いました。',
      }),
      Object.freeze({
        id: 'abs-census-2016',
        name: 'オーストラリア統計局（ABS）「Census of Population and Housing: Australia Revealed, 2016」',
        url: 'https://www.abs.gov.au/ausstats/abs@.nsf/Latestproducts/2024.0Main%20Features22016',
        use: '地理「オセアニア州」の、オーストラリアに住む外国生まれの人の出身地域の割合（2001・2011・2016年）のグラフに使いました。',
      }),
      Object.freeze({
        id: 'pew-religion-2020',
        name: 'Pew Research Center「Religious Composition by Country, 2010-2020」（2025年）',
        url: 'https://www.pewresearch.org/religion/feature/religious-composition-by-country-2010-2020/',
        use: '地理「人々の生活と環境」の、国でいちばん信者の多い宗教（2020年の推計）の地図に使いました。',
      }),
    ]),
  }),
  Object.freeze({
    id: 'history',
    title: '歴史の数値',
    items: Object.freeze([
      Object.freeze({
        id: 'sekiya-nochi-kaikaku',
        name: '関谷俊作「農地改革と農地制度の展開」（『農林業問題研究』第33巻第2号、1997年）',
        url: 'https://www.jstage.jst.go.jp/article/arfe1965/33/2/33_2_57/_article/-char/ja',
        use: '歴史「戦後日本の出発」の、農地改革の前と後の自作地・小作地の割合のグラフに使いました。',
      }),
      Object.freeze({
        id: 'cao-durables',
        name: '内閣府「消費動向調査」主要耐久消費財等の普及率（全世帯、2004年3月末現在の表）',
        url: 'https://www.esri.cao.go.jp/jp/stat/shouhi/shouhi.html',
        use: '歴史「冷戦と日本の発展」の、白黒テレビとカラーテレビの普及率の移り変わりのグラフに使いました。',
      }),
      Object.freeze({
        id: 'mext-gakusei-100',
        name: '文部省『学制百年史』資料編「明治6年以降教育累年統計」第1表 学齢児童数および就学児童数（1972年）',
        url: 'https://www.mext.go.jp/b_menu/hakusho/html/others/detail/1318190.htm',
        use: '歴史「日清・日露戦争と近代産業」の、小学校の就学率（男子・女子）の移り変わりのグラフに使いました。',
      }),
      Object.freeze({
        id: 'sekiyama-edo-population',
        name: '関山直太郎『近世日本の人口構造』（吉川弘文館、1958年）',
        use: '歴史「江戸幕府の成立と対外政策の変化」の、江戸時代の身分別の人口の割合（推計）のグラフに使いました。',
      }),
    ]),
  }),
  Object.freeze({
    id: 'economy',
    title: '経済の数値',
    items: Object.freeze([
      Object.freeze({
        id: 'maff-fishery-stat',
        name: '農林水産省「漁業・養殖業生産統計」（漁業・養殖業部門別累年統計 生産量 全国、1979〜2024年）',
        url: 'https://www.maff.go.jp/j/tokei/kouhyou/kaimen_gyosei/',
        use: '地理「北海道地方」の、日本の漁業・養殖業の生産量の移り変わりのグラフに使いました。',
      }),
      Object.freeze({
        id: 'nta-income-tax',
        name: '国税庁「No.2260 所得税の税率」',
        url: 'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2260.htm',
        use: '公民「財政と国民の福祉」の、所得の区分ごとの所得税の税率のグラフに使いました。',
      }),
      Object.freeze({
        id: 'enecho-whitepaper-2024',
        name: '資源エネルギー庁「令和5年度エネルギーに関する年次報告（エネルギー白書2024）」第2部第2章第2節',
        url: 'https://www.enecho.meti.go.jp/about/whitepaper/2024/html/2-2-2.html',
        use: '公民「さまざまな国際問題」の、石油・天然ガス・石炭の可採年数のグラフに使いました。',
      }),
      Object.freeze({
        id: 'enecho-energy-2024',
        name: '資源エネルギー庁「令和6年度（2024年度）エネルギー需給実績（確報）」（2026年4月）',
        url: 'https://www.enecho.meti.go.jp/statistics/total_energy/results.html',
        use: '地理「日本の地域的特色」の、発電電力量の割合（2010年度・2024年度）のグラフと、理科3年「科学技術と人間」の、再生可能エネルギーによる発電電力量のグラフ（2010〜2024年度）に使いました。',
      }),
      Object.freeze({
        id: 'trade-transport',
        name: '財務省「貿易統計」（2024年の輸出入額と、運送形態別の航空貨物の輸出入額）、国土交通省海事局「海事レポート」第4章（2023年の海上輸送の割合、トン数）',
        url: 'https://www.customs.go.jp/toukei/info/',
        use: '地理「日本の地域的特色」の、貿易の荷物を運んだ船と航空機の割合（重さ・輸出額・輸入額）のグラフに使いました。',
      }),
      Object.freeze({
        id: 'world-bank-wdi',
        name: '世界銀行「世界開発指標（World Development Indicators）」（CC BY 4.0）',
        url: 'https://data.worldbank.org/',
        use: '地理「ヨーロッパ州」の、EUの国々の1人あたりの国内総生産（2024年）のグラフ、「アフリカ州」の人口の移り変わりのグラフ、「南アメリカ州」のブラジルの森林面積の移り変わりのグラフ、「日本の地域的特色」の子どもと高齢者の割合のグラフ、歴史「新たな時代の日本と世界」の日本の人口の移り変わりのグラフ、公民「現代社会の特色と私たち」の輸出額と輸入額・インターネットを利用する人の割合・合計特殊出生率・65歳以上の人の割合・65歳以上の人1人に対する15〜64歳の人の数のグラフ、「さまざまな国際問題」の国ごとの二酸化炭素の排出量の割合（2024年）と1人あたりの国民総所得（2024年）のグラフに使いました。',
      }),
      Object.freeze({
        id: 'mof-finance',
        name: '財務省「財政に関する資料」（令和8年度一般会計歳出・歳入の構成、普通国債残高の累増）',
        url: 'https://www.mof.go.jp/tax_policy/summary/condition/a02.htm',
        use: '公民「財政と国民の福祉」の、国の一般会計の歳出と歳入の内訳のグラフ（2026年度予算）と、普通国債残高の移り変わりのグラフに使いました。',
      }),
      Object.freeze({
        id: 'cao-long-term-sna',
        name: '内閣府「長期経済統計」の国民経済計算（年度統計）',
        url: 'https://www5.cao.go.jp/j-j/wp/wp-je12/h10_data01.html',
        use: '歴史「冷戦と日本の発展」「新たな時代の日本と世界」と公民「これからの経済と社会」の、日本の経済成長率の移り変わりのグラフ（1956〜2010年度の実質国内総生産の前年度比）に使いました。',
      }),
    ]),
  }),
  Object.freeze({
    id: 'local',
    title: '地方自治の数値',
    items: Object.freeze([
      Object.freeze({
        id: 'soumu-local-finance',
        name: '総務省「地方財政白書」令和7年版（令和5年度決算）',
        url: 'https://www.soumu.go.jp/menu_seisaku/hakusyo/chihou/r07data/2025data/mokuji.html',
        use: '公民「地方自治と私たち」の、地方公共団体の歳入の内訳のグラフ（2023年度）と、2023年度の市町村の数に使いました。',
      }),
      Object.freeze({
        id: 'soumu-gappei',
        name: '総務省「『平成の合併』による市町村数の変化」',
        url: 'https://www.soumu.go.jp/gapei/pdf/090416_09.pdf',
        use: '公民「地方自治と私たち」の、市町村の数の変化のグラフ（1999年3月末と2010年3月末）に使いました。',
      }),
    ]),
  }),
  Object.freeze({
    id: 'labor',
    title: '労働の数値',
    items: Object.freeze([
      Object.freeze({
        id: 'mhlw-nonregular',
        name: '厚生労働省「『非正規雇用』の現状と課題」（総務省「労働力調査」をもとにした資料）',
        url: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/part_haken/index.html',
        use: '公民「生産と労働」の、非正規雇用労働者の割合の移り変わりのグラフに使いました。',
      }),
    ]),
  }),
  Object.freeze({
    id: 'tourism',
    title: '国際交流の数値',
    items: Object.freeze([
      Object.freeze({
        id: 'jnto-visitors',
        name: '日本政府観光局（JNTO）「ビジット・ジャパン事業開始以降の訪日客数の推移（2003年〜2025年）」',
        url: 'https://www.jnto.go.jp/statistics/data/visitors-statistics/',
        use: '公民「これからの地球社会と日本」の、日本を訪れた外国人旅行者の数の移り変わりのグラフに使いました。',
      }),
    ]),
  }),
  Object.freeze({
    id: 'election',
    title: '選挙の数値',
    items: Object.freeze([
      Object.freeze({
        id: 'soumu-senkyo-ayumi',
        name: '総務省「特集 国民参政135周年・普通選挙100周年・婦人参政80周年 選挙のあゆみと今」',
        url: 'https://www.soumu.go.jp/main_content/001042908.pdf',
        use: '歴史「大正デモクラシーの時代」の、有権者が人口にしめる割合のグラフに使いました。',
      }),
      Object.freeze({
        id: 'soumu-turnout',
        name: '総務省「国政選挙の年代別投票率の推移について」',
        url: 'https://www.soumu.go.jp/senkyo/senkyo_s/news/sonota/nendaibetu/',
        use: '公民「現代の民主政治」の、年代別の投票率のグラフ（2026年2月の第51回衆議院議員総選挙）に使いました。',
      }),
    ]),
  }),
  Object.freeze({
    id: 'science',
    title: '理科の数値',
    items: Object.freeze([
      Object.freeze({
        id: 'mendel-1866',
        name: 'G. メンデル「植物雑種の実験」（1866年）の英訳（『Genetics』第204巻第2号、2016年）',
        url: 'https://academic.oup.com/genetics/article/204/2/407/6072056',
        use: '理科3年「遺伝の規則性と遺伝子」の、孫の代に現れた形質の数の帯グラフに使いました。',
      }),
      Object.freeze({
        id: 'soumu-tsushin-2025',
        name: '総務省「令和7年通信利用動向調査の結果」（2026年5月29日）',
        url: 'https://www.soumu.go.jp/menu_news/s-news/01tsushin02_02000183.html',
        use: '理科3年「科学技術と人間」の、主な情報通信機器を保有している世帯の割合のグラフ（2016〜2025年）に使いました。',
      }),
    ]),
  }),
  Object.freeze({
    id: 'environment',
    title: '環境の数値',
    items: Object.freeze([
      Object.freeze({
        id: 'env-ghg-2024',
        name: '環境省「2024年度の我が国の温室効果ガス排出量及び吸収量について」',
        url: 'https://www.env.go.jp/press/press_04043.html',
        use: '公民「これからの経済と社会」の、日本の温室効果ガスの排出・吸収量のグラフ（2013〜2024年度）に使いました。',
      }),
      Object.freeze({
        id: 'jccca-household-co2-2024',
        name: '全国地球温暖化防止活動推進センター「家庭からの二酸化炭素排出量（2024年度）」（温室効果ガスインベントリオフィス「日本の1990-2024年度の温室効果ガス排出量データ」2026年4月発表による）',
        url: 'https://www.jccca.org/download/65499',
        use: '理科3年「持続可能な社会のために」の、家庭から出る二酸化炭素の用途別の量（1世帯あたり）のグラフに使いました。',
      }),
      Object.freeze({
        id: 'jma-co2',
        name: '気象庁「大気中二酸化炭素濃度の観測結果」の年平均値（綾里）',
        url: 'https://www.data.jma.go.jp/ghg/kanshi/obs/co2_yearave.html',
        use: '理科3年「持続可能な社会のために」の、大気中の二酸化炭素の濃度のグラフに使いました（1990〜2020年の5年ごと）。',
      }),
    ]),
  }),
])

export const CREDIT_IDS = Object.freeze(CREDIT_SECTIONS.flatMap((section) => section.items.map((item) => item.id)))
