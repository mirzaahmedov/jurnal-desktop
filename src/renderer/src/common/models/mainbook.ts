import type { ReportStatus } from './reports'

export interface MainbookSaldoMonthValue {
  budjet_id: number
  main_book_id: number
  main_schet_id: number
  month: number
  schet_id: number
  year: number
}

export interface Mainbook {
  id: number
  status: number
  acsept_time: null | string
  send_time: ReportStatus
  user_id: number
  fio: string
  login: string
  year: number
  month: number
  budjet_id: number
  budjet_name: string
  accept_user_id: null | number
  accept_user_fio: null | string
  accept_user_login: null | string
  first: boolean
  isdeleted: boolean
  childs: MainbookProvodka[]
}

export interface MainbookProvodka {
  type_id: number
  type_name: string
  prixod: number
  rasxod: number
  sub_childs: Array<{
    id: number
    schet: string
    prixod: number
    rasxod: number
  }>
}

export interface MainbookDocumentInfo {
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

export interface AdminMainbook {
  id: number
  status: number
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
  childs: MainbookProvodka[]
}
