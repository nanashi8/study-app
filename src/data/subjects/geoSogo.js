// 高校・地理総合の単元（章ごとのファイルを順に並べる）。単元の並びは出版社の教科書の目次の順。書き方は meta.js の冒頭。
import { GEO_SOGO_CH1 } from './geoSogo1.js'
import { GEO_SOGO_CH2 } from './geoSogo2.js'
import { GEO_SOGO_CH3 } from './geoSogo3.js'
import { GEO_SOGO_CH4 } from './geoSogo4.js'
import { GEO_SOGO_CH5 } from './geoSogo5.js'

export const GEO_SOGO_UNITS = [...GEO_SOGO_CH1, ...GEO_SOGO_CH2, ...GEO_SOGO_CH3, ...GEO_SOGO_CH4, ...GEO_SOGO_CH5]
