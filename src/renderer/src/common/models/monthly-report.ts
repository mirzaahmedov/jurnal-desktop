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

export interface CompleteMonthlyReportProvodka {
  year: number
  month: number
  data: CompleteMonthlyReportProvodkaData[]
}

export interface CompleteMonthlyReportProvodkaData {
  type: string
  schets: Array<{
    id: number
    name: string
    schet: string
    sub_schet: string
    type_schet: string
    smeta_id: number
    summa: Summa
  }>
  debet_sum: number
  kredit_sum: number
}
