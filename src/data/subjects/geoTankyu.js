// 高校・地理探究の単元（編・章ごとのファイルを順に並べる）。単元の並びは出版社の教科書の目次の順。書き方は meta.js の冒頭。
import { GEO_TANKYU_CH1A } from './geoTankyu1.js'
import { GEO_TANKYU_CH1B } from './geoTankyu2.js'
import { GEO_TANKYU_CH2 } from './geoTankyu3.js'
import { GEO_TANKYU_CH3 } from './geoTankyu4.js'
import { GEO_TANKYU_CH5 } from './geoTankyu5.js'
import { GEO_TANKYU_REGIONS_A } from './geoTankyu6.js'
import { GEO_TANKYU_REGIONS_B } from './geoTankyu7.js'
import { GEO_TANKYU_REGIONS_C } from './geoTankyu8.js'

export const GEO_TANKYU_UNITS = [
  ...GEO_TANKYU_CH1A,
  ...GEO_TANKYU_CH1B,
  ...GEO_TANKYU_CH2,
  ...GEO_TANKYU_CH3,
  ...GEO_TANKYU_CH5,
  ...GEO_TANKYU_REGIONS_A,
  ...GEO_TANKYU_REGIONS_B,
  ...GEO_TANKYU_REGIONS_C,
]
