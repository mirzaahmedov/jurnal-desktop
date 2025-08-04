import type { ProvodkaType } from './common'
import type { ReportStatus } from './reports'
import type { SmetaGrafik } from './smeta-grafik'

export interface TwoF {
  id: number
  status: ReportStatus
  accept_time: any
  send_time: string
  main_schet_id: number
  accept_user_id: any
  user_id: number
  user_fio: string
  user_login: string
  month: number
  year: number
  created_at: string
  updated_at: string
  isdeleted: boolean
  accept_user_fio: string | null
  accept_user_login: string | null
  childs: TwoFProvodka[]
}

export interface TwoFProvodka {
  type_id: number
  type_name: string
  sort_order: number
  sub_childs: Array<{
    id: number
    smeta_id: number
    summa: number
    smeta_name: string
    smeta_number: string
    group_number: string
  }>
  summa: number
}

export interface TwoFDocumentInfo {
  id: number
  doc_num: string
  doc_date: string
  opisanie: any
  main_schet_id: number
  summa: number
  debet_schet: string
  kredit_schet: string
  budjet_id: number
  type: string
}

export interface TwoFRasxod {
  id: number
  doc_num: string
  doc_date: string
  sub_schet: string
  summa: number
  type: ProvodkaType
}

export interface TwoFGrafik {
  id: number
  smeta_name: string
  smeta_number: string
  group_number: string
  smeta_grafik: SmetaGrafik
  smeta_id: number
  summa: number
}

export type TwoFRemaining = {
  grafik_data: TwoFGrafik
  jur1_jur2_rasxod_data: TwoFGrafik
  summa: number
}

export type TwoFDocument = TwoFRasxod | TwoFGrafik

export interface AdminTwoF {
  id: number
  status: number
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
  childs: TwoFProvodka[]
}
