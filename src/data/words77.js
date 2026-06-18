// 単語データ（探索マップ＋足場ジェネレータ #33）— フロンティア由来。意味はフロンティア値。語族=1エントリ。
import { expandCompact } from './compact.js'

const RAW = [
  ['state', '名', 'pre1', '状態・国家・州・述べる', 'the state of the economy', '経済の状態', 'ラテン status(立っていること)→ stand と同系。', { syn: [{ w: 'condition', m: '状態' }, { w: 'nation', m: '国家' }], fam: [{ w: 'statement', m: '声明' }], field: '一般' }],
  ['renew', '動', 'pre1', '一新する・更新する・再開する', 'renew a passport', '旅券を更新する', 're(再)+古フランス novel(新しい)→ new と同系。', { syn: [{ w: 'update', m: '更新する' }, { w: 'restore', m: '回復する' }], ant: [{ w: 'cancel', m: '解約する' }], fam: [{ w: 'renewable', m: '再生可能な' }], field: '一般' }],
  ['settler', '名', '2', '入植者・定住者', 'early settlers', '初期の入植者', 'settle(定住する)+ -er', { fam: [{ w: 'settle', m: '定住する' }], syn: [{ w: 'colonist', m: '植民者' }, { w: 'pioneer', m: '開拓者' }], ant: [{ w: 'nomad', m: '遊牧民' }], field: '社会' }],
  ['township', '名', '1', '町区・郡区', 'a rural township', '農村の町区', 'town(町)+ -ship。', { syn: [{ w: 'borough', m: '自治区' }, { w: 'municipality', m: '自治体' }], field: '政治' }],
  ['wanderer', '名', 'pre1', '放浪者・さすらい人', 'a lonely wanderer', '孤独な放浪者', 'wander(さまよう)+ -er', { fam: [{ w: 'wander', m: 'さまよう' }], syn: [{ w: 'drifter', m: '流れ者' }, { w: 'nomad', m: '遊牧民' }], ant: [{ w: 'settler', m: '定住者' }], field: '社会' }],
  ['country', '名', 'pre1', '国・国土・田舎', 'a foreign country', '外国', '古フランス contrée(地方)。', { syn: [{ w: 'nation', m: '国家' }, { w: 'state', m: '国' }], ant: [{ w: 'city', m: '都市' }], fam: [{ w: 'countryside', m: '田園' }], field: '政治' }],
  ['countrywide', '形', 'pre1', '全国的な・全国規模の', 'a countrywide search', '全国規模の捜索', 'country(国)+wide(広い)。', { syn: [{ w: 'nationwide', m: '全国的な' }, { w: 'national', m: '全国の' }], ant: [{ w: 'local', m: '地方の' }], field: '社会' }],
  ['exterior', '名', 'pre1', '外部・外面・外側の', 'the exterior of the building', '建物の外観', 'ラテン exterior(より外の)。', { syn: [{ w: 'outside', m: '外側' }, { w: 'facade', m: '外観' }], ant: [{ w: 'interior', m: '内部' }], field: '一般' }],
  ['hallucination', '名', '1', '幻覚・幻影', 'suffer hallucinations', '幻覚に苦しむ', 'ラテン hallucinari(心がさまよう)。', { syn: [{ w: 'illusion', m: '錯覚' }, { w: 'mirage', m: '蜃気楼' }], ant: [{ w: 'reality', m: '現実' }], fam: [{ w: 'hallucinate', m: '幻覚を見る' }], field: '医学' }],
  ['inflexibility', '名', '1', '融通のきかなさ・硬直性', 'the inflexibility of the system', '制度の硬直性', 'inflexible(融通のきかない)+ -ity。', { syn: [{ w: 'rigidity', m: '硬直性' }, { w: 'stubbornness', m: '頑固さ' }], ant: [{ w: 'flexibility', m: '柔軟性' }], fam: [{ w: 'inflexible', m: '融通のきかない' }], field: '性質・状態' }],
  ['inside', '名', 'pre1', '内側・内部・中に', 'the inside of the box', '箱の内側', 'in(中)+side(側)。', { syn: [{ w: 'interior', m: '内部' }, { w: 'core', m: '中心' }], ant: [{ w: 'outside', m: '外側' }], field: '一般' }],
  ['notices', '名', 'pre1', '通知・掲示・注目', 'post notices', '掲示を貼る', 'notice(通知)の複数。', { syn: [{ w: 'announcements', m: '発表' }, { w: 'warnings', m: '警告' }], fam: [{ w: 'notify', m: '通知する' }], field: 'メディア' }],
  ['notify', '動', 'pre1', '通知する・知らせる', 'notify the authorities', '当局に通報する', 'ラテン notus(知られた)+facere(する)→ note と同系。', { syn: [{ w: 'inform', m: '知らせる' }, { w: 'alert', m: '警告する' }], ant: [{ w: 'conceal', m: '隠す' }], fam: [{ w: 'notification', m: '通知' }], field: '一般' }],
  ['nourishment', '名', 'pre1', '栄養・滋養', 'a source of nourishment', '栄養源', 'nourish(養う)+ -ment。', { syn: [{ w: 'nutrition', m: '栄養' }, { w: 'sustenance', m: '食物' }], ant: [{ w: 'starvation', m: '飢餓' }], fam: [{ w: 'nourish', m: '養う' }], field: '医学' }],
  ['novelist', '名', 'pre1', '小説家', 'a best-selling novelist', 'ベストセラー作家', 'novel(小説)+ -ist。', { syn: [{ w: 'author', m: '作家' }, { w: 'writer', m: '著述家' }], fam: [{ w: 'novel', m: '小説' }], field: '文学' }],
  ['nuanced', '形', 'pre1', '微妙な・ニュアンスのある', 'a nuanced argument', '微妙な陰影のある議論', 'nuance(微妙な差)+ -d。', { syn: [{ w: 'subtle', m: '繊細な' }, { w: 'sophisticated', m: '洗練された' }], ant: [{ w: 'simplistic', m: '単純すぎる' }], fam: [{ w: 'nuance', m: '微妙な差' }], field: '言語' }],
  ['nullify', '動', '1', '無効にする・帳消しにする', 'nullify the contract', '契約を無効にする', 'ラテン nullus(無)+facere(する)。', { syn: [{ w: 'invalidate', m: '無効にする' }, { w: 'cancel', m: '取り消す' }], ant: [{ w: 'validate', m: '有効にする' }], fam: [{ w: 'null', m: '無効の' }], field: '法律' }],
  ['nutritious', '形', 'pre1', '栄養のある・滋養に富む', 'a nutritious meal', '栄養豊富な食事', 'ラテン nutrire(養う)→ nourish と同系。', { syn: [{ w: 'nourishing', m: '滋養になる' }, { w: 'wholesome', m: '健康によい' }], ant: [{ w: 'unhealthy', m: '不健康な' }], fam: [{ w: 'nutrition', m: '栄養' }], field: '医学' }],
  ['obese', '形', '1', '肥満の・太りすぎの', 'an obese patient', '肥満の患者', 'ラテン ob+edere(食べる)→食べ尽くした。', { syn: [{ w: 'overweight', m: '太りすぎの' }, { w: 'corpulent', m: '肥満の' }], ant: [{ w: 'slim', m: 'ほっそりした' }], fam: [{ w: 'obesity', m: '肥満' }], field: '医学' }],
  ['obliged', '形', 'pre1', '義務がある・恩義を感じて', 'obliged to comply', '従う義務がある', 'oblige(義務づける)+ -d。', { syn: [{ w: 'bound', m: '縛られた' }, { w: 'compelled', m: '強いられた' }], ant: [{ w: 'free', m: '自由な' }], fam: [{ w: 'oblige', m: '義務づける' }], field: '法律' }],
  ['oblique', '形', '1', '斜めの・遠回しの', 'an oblique reference', '遠回しの言及', 'ラテン obliquus(斜めの)。', { syn: [{ w: 'indirect', m: '間接的な' }, { w: 'slanting', m: '傾いた' }], ant: [{ w: 'direct', m: '直接の' }], field: '一般' }],
  ['obliteration', '名', '1', '抹消・完全な破壊', 'the obliteration of the city', '都市の壊滅', 'obliterate(消し去る)+ -ation', { fam: [{ w: 'obliterate', m: '完全に消し去る' }], syn: [{ w: 'annihilation', m: '全滅' }, { w: 'erasure', m: '抹消' }], ant: [{ w: 'preservation', m: '保存' }], field: '軍事' }],
]

export const WORDS_MORE76 = RAW.map(expandCompact)
