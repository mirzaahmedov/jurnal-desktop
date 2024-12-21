type MonthlyReportStatus = 'draft' | 'approved' | 'rejected'
type MonthlyReportDocumentType =
  | 'akt'
  | 'shartnoma'
  | 'avans'
  | 'internal-transfer'
  | 'pereotsenka'
  | 'reestr'
  | 'schet-operatsii'
  | 'podpis'

type CreateMonthlyReport = {
  id: number
  year: number
  month: number
  type_document: MonthlyReportDocumentType
  kredit: number
  debet_sum: number
}

type CloseMonthlyReport = {
  id: number
  year: number
  month: number
  user_id: number
  yaratilgan_vaqt: string
  user_id_qabul_qilgan: number
  document_qabul_qilingan_vaqt: string
  status: MonthlyReportStatus
}

type CloseMonthlyReportDetails = {
  id: number
  spravochnik_operatsii_id: number
  spravochnik_operatsii_name: string
  spravochnik_operatsii_schet: string
  start_debet: number
  start_kredit: number
  jur1_debet: number
  jur1_kredit: number
  jur2_debet: number
  jur2_kredit: number
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

export type {
  MonthlyReportStatus,
  MonthlyReportDocumentType,
  CreateMonthlyReport,
  CloseMonthlyReport,
  CloseMonthlyReportDetails
}
