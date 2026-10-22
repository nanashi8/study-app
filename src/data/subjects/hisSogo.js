// 高校・歴史総合の単元（部ごとのファイルを順に並べる）。単元の並びは出版社の教科書の目次の順。書き方は meta.js の冒頭。
import { HIS_SOGO_P1 } from './hisSogo1.js'
import { HIS_SOGO_P2 } from './hisSogo2.js'
import { HIS_SOGO_P3 } from './hisSogo3.js'
import { HIS_SOGO_P4 } from './hisSogo4.js'
import { HIS_SOGO_P5 } from './hisSogo5.js'
import { HIS_SOGO_P6 } from './hisSogo6.js'
import { HIS_SOGO_P7 } from './hisSogo7.js'
import { HIS_SOGO_P8 } from './hisSogo8.js'
import { HIS_SOGO_P9 } from './hisSogo9.js'

export const HIS_SOGO_UNITS = [...HIS_SOGO_P1, ...HIS_SOGO_P2, ...HIS_SOGO_P3, ...HIS_SOGO_P4, ...HIS_SOGO_P5, ...HIS_SOGO_P6, ...HIS_SOGO_P7, ...HIS_SOGO_P8, ...HIS_SOGO_P9]
