import type { ReportStatus } from './reports'

export interface Odinox {
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
  childs: OdinoxProvodka[]
}

export interface OdinoxProvodka {
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

export interface OdinoxDocumentInfo {
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

export interface AdminOdinox {
  id: number
  status: ReportStatus
  accept_time: string
  send_time: string
  user_id: number
  fio: string
  login: string
  year: number
  month: number
  budjet_id: number
  budjet_name: string
  accept_user_id: number
  accept_user_fio: string
  accept_user_login: string
  region_name: string
  childs: OdinoxProvodka[]
}
