export type MonthlyReportDocumentType =
  | 'start'
  | 'jur1'
  | 'jur2'
  | 'jur3'
  | 'jur4'
  | 'jur5'
  | 'jur6'
  | 'jur7'
  | 'jur8'
  | 'end'

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

export type CreateMonthlyReport = {
  year: number
  month: number
  type_document: MonthlyReportDocumentType
  kredit: number
  debet_sum: number
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
  status: number
}

export interface CompleteMonthlyReportProvodka {
  type: string
  schets: CompleteMonthlyReportSchet[]
  debet_sum: number
  kredit_sum: number
}

export type CompleteMonthlyReportSchet = {
  spravochnik_operatsii_id: number
  schet_name: string
  schet: string
  debet_sum: number
  kredit_sum: number
}

export interface CompleteMonthlyReportTableItem {
  id: string
  name: string
  schet: string
  start_debet: number
  start_kredit: number
  jur1_debet: number
  jur1_kredit: number
  jur2_debet: number
  jur2_kredit: number
  jur3_debet: number
  jur3_kredit: number
  jur4_debet: number
  jur4_kredit: number
  jur5_debet: number
  jur5_kredit: number
  jur6_debet: number
  jur6_kredit: number
  jur7_debet: number
  jur7_kredit: number
  jur8_debet: number
  jur8_kredit: number
  end_debet: number
  end_kredit: number
}
