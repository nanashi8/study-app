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
        use: '日本地図（都道府県・北方領土・竹島・尖閣諸島・琵琶湖）と世界地図（国の形・大河の流れ）に使いました。',
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
    id: 'economy',
    title: '経済の数値',
    items: Object.freeze([
      Object.freeze({
        id: 'world-bank-wdi',
        name: '世界銀行「世界開発指標（World Development Indicators）」（CC BY 4.0）',
        url: 'https://data.worldbank.org/',
        use: '地理「ヨーロッパ州」の、EUの国々の1人あたりの国内総生産（2024年）のグラフに使いました。',
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
