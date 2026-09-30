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
        id: 'stat-dashboard-census',
        name: '総務省統計局「統計ダッシュボード」の国勢調査（2020年）の値',
        url: 'https://dashboard.e-stat.go.jp/',
        use: '地理「関東地方」の、東京都と周りの県の昼夜間人口比率のグラフに使いました。',
      }),
    ]),
  }),
  Object.freeze({
    id: 'economy',
    title: '経済の数値',
    items: Object.freeze([
      Object.freeze({
        id: 'world-bank-wdi',
        name: '世界銀行「世界開発指標（World Development Indicators）」（CC BY 4.0）',
        url: 'https://data.worldbank.org/',
        use: '地理「ヨーロッパ州」の、EUの国々の1人あたりの国内総生産（2024年）のグラフ、「アフリカ州」の人口の移り変わりのグラフ、「日本の地域的特色」の子どもと高齢者の割合のグラフと、歴史「新たな時代の日本と世界」の日本の人口の移り変わりのグラフに使いました。',
      }),
      Object.freeze({
        id: 'cao-long-term-sna',
        name: '内閣府「長期経済統計」の国民経済計算（年度統計）',
        url: 'https://www5.cao.go.jp/j-j/wp/wp-je12/h10_data01.html',
        use: '歴史「冷戦と日本の発展」と「新たな時代の日本と世界」の、日本の経済成長率の移り変わりのグラフ（1956〜2010年度の実質国内総生産の前年度比）に使いました。',
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
    id: 'election',
    title: '選挙の数値',
    items: Object.freeze([
      Object.freeze({
        id: 'soumu-turnout',
        name: '総務省「国政選挙の年代別投票率の推移について」',
        url: 'https://www.soumu.go.jp/senkyo/senkyo_s/news/sonota/nendaibetu/',
        use: '公民「現代の民主政治」の、年代別の投票率のグラフ（2026年2月の第51回衆議院議員総選挙）に使いました。',
      }),
    ]),
  }),
  Object.freeze({
    id: 'environment',
    title: '環境の数値',
    items: Object.freeze([
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
