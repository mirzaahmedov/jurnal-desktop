import type { ProvodkaType } from './common'
import type { ReportStatus } from './reports'
import type { SmetaGrafik } from './smeta-grafik'

export interface RealCost {
  id: number
  status: ReportStatus
  accept_time: any
  send_time: string
  main_schet_id: number
  accept_user_id: any
  user_id: number
  fio: string
  login: string
  month: number
  year: number
  created_at: string
  updated_at: string
  isdeleted: boolean
  accept_user_fio: any
  accept_user_login: any
  childs: RealCostProvodka[]
}

export interface RealCostProvodka {
  id: number
  smeta_name: string
  smeta_number: string
  group_number: string
  smeta_grafik: SmetaGrafik | null
  smeta_id: number
  month_summa: number
  year_summa: number
  by_month: RealCostShartnomaGrafik[]
  by_year: RealCostShartnomaGrafik[]
}

export interface RealCostShartnomaGrafik {
  id: number
  id_shartnomalar_organization: number
  user_id: number
  oy_1: string
  oy_2: string
  oy_3: string
  oy_4: string
  oy_5: string
  oy_6: string
  oy_7: string
  oy_8: string
  oy_9: string
  oy_10: string
  oy_11: string
  oy_12: string
  year: number
  organ_inn: string
  organ_name: string
  created_at: string
  updated_at: string
  isdeleted: boolean
  yillik_oylik: any
  budjet_id: any
  smeta_id: string
  itogo: string
  main_schet_id: number
  doc_num: string
  doc_date: string
  name: string
  inn: string
  rasxod_summa: number
  contract_grafik_summa: number
  remaining_summa: number
}

export interface RealCostRasxod {
  id: number
  doc_num: string
  doc_date: string
  schet: string
  sub_schet: string
  summa: number
  type: ProvodkaType
}

export type RealCostDocument = RealCostProvodka | RealCostShartnomaGrafik | RealCostRasxod

export interface AdminRealCost {
  id: number
  status: ReportStatus
  accept_time: null | number
  send_time: string
  user_id: number
  fio: string
  login: string
  year: number
  month: number
  main_schet_id: number
  account_number: string
  accept_user_id: null | number
  accept_user_fio: null | string
  accept_user_login: null | string
  region_id: number
  region_name: string
  childs: RealCostProvodka[]
}
