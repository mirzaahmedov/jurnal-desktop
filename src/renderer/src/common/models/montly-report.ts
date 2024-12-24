export type MonthlyReportStatus = 'draft' | 'approved' | 'rejected'
export type MonthlyReportDocumentType =
  | 'akt'
  | 'shartnoma'
  | 'avans'
  | 'internal-transfer'
  | 'pereotsenka'
  | 'reestr'
  | 'schet-operatsii'
  | 'podpis'

export interface CreateMonthlyReport {
  year: number
  month: number
  type_document: MonthlyReportDocumentType
  kredit: number
  debet_sum: number
}

export interface CloseMonthlyReport {
  month: number
  year: number
  user_id: number
  user_id_qabul_qilgan: any
  budjet_id: number
  budjet_name: string
  status: number
}

export interface CloseMonthlyReportDetails {
  key: string
  schets: Schet[]
  debet_sum: number
  kredit_sum: number
}

export interface Schet {
  id: number
  name: string
  schet: string
  sub_schet: string
  type_schet: string
  smeta_id: number
  summa: Summa
}

export interface Summa {
  debet_sum: number
  kredit_sum: number
}

export interface CloseMonthlyReportTableItem {
  id: number
  name: string
  schet: string
  sub_schet: string
  type_schet: string
  smeta_id: number
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
