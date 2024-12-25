export type Summa = {
  debet_sum: number
  kredit_sum: number
}

export type OpenMonthlyReport = {
  id: number
  type_document: string
  month: number
  year: number
  summa: Summa
}

export type CompleteMonthlyReport = {
  id: number
  month: number
  year: number
  budjet_id: number
  name: string
  user_id: number
  user_login: string
  accepted_id: null | string
  accepted_login: null | string
  accepted_time: null | string
  created_at: string
  status: number
}

/*====================================================
    report info response types
====================================================*/

export type CompleteMonthlyReportInfo = Array<{
  type: string
  schets: SchetInfo[]
  debet_sum: number
  kredit_sum: number
}>

export interface SchetInfo {
  id: number
  name: string
  schet: string
  sub_schet: string
  type_schet: string
  smeta_id: number
  summa: Summa
}

/*====================================================
    report by id response types
====================================================*/

export type CompleteMonthlyReportById = {
  id: number
  user_id: number
  user_id_accepted: number
  budjet_id: number
  accepted_time: string
  month: number
  year: number
  status: number
  data: Array<{
    type: string
    schets: SchetById[]
    debet_sum: number
    kredit_sum: number
  }>
}

export interface SchetById {
  spravochnik_operatsii_id: number
  schet_name: string
  schet: string
  summa: Summa
}
