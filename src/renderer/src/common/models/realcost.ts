import type { ReportStatus } from './reports'

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
  smeta_grafik: any
  smeta_id: number
  month_summa: number
  year_summa: number
  by_month: RealCostGrafik[]
  by_year: RealCostGrafik[]
}

export interface RealCostGrafik {
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

export interface RealCostDocument {
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
  created_at: string
  updated_at: string
  isdeleted: boolean
  yillik_oylik: any
  budjet_id: any
  smeta_id: string
  itogo: string
  main_schet_id: number
  contract_grafik_id: number
  doc_num: string
  doc_date: string
  spravochnik_organization_id: number
  name: string
  inn: string
  rasxod_summa: number
  contract_grafik_summa: number
  remaining_summa: number
  summa: number
}

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
  region_name: string
  childs: RealCostProvodka[]
}
