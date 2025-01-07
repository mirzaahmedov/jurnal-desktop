export namespace RealExpenses {
  type Summa = {
    debet_sum: number
    kredit_sum: number
  }

  export type Schet = {
    id: number
    name: string
    schet: string
    created_at: string
    updated_at: string
  }

  export type AdminReport = {
    month: number
    year: number
    budjet_id: number
    budjet_name: string
    user_id: number
    user_login: string
    user_id_qabul_qilgan: null | number
    user_login_qabul_qilgan: null | string
    status: number
    region_id: number
    region_name: string
    document_yaratilgan_vaqt: string
    document_qabul_qilingan_vaqt: string | null
  }

  export type Report = {
    type_document: string
    month: number
    year: number
    debet_sum: number
    kredit_sum: number
  }

  export type ReportPreview = {
    month: number
    year: number
    budjet_id: number
    budjet_name: string
    user_id: number
    user_login: string
    user_id_qabul_qilgan: null | number
    user_login_qabul_qilgan: null | string
    status: number
    region_id: number
    document_yaratilgan_vaqt: string
    document_qabul_qilingan_vaqt: null | string
  }

  export type ReportPreviewDetails = {
    month: number
    year: number
    types: Array<ReportPreviewProvodka>
  }
  export type ReportPreviewInfo = {
    month: number
    year: number
    type_documents: Array<ReportPreviewProvodka>
  }

  export type ReportPreviewProvodka = {
    type: string
    smeta_grafiks: Array<ReportPreviewProvodkaGrafik>
  }

  export type ReportPreviewProvodkaGrafik = {
    id: number
    smeta_id: number
    smeta_name: string
    smeta_number: string
    spravochnik_budjet_name_id: number
    budjet_name: string
    itogo: number
    oy_1: number
    oy_2: number
    oy_3: number
    oy_4: number
    oy_5: number
    oy_6: number
    oy_7: number
    oy_8: number
    oy_9: number
    oy_10: number
    oy_11: number
    oy_12: number
    year: number
    summa: Summa
  }

  export type AdminReportDetails = {
    month: number
    year: number
    budjet_id: number
    budjet_name: string
    user_id: number
    user_login: string
    user_id_qabul_qilgan: null | number
    user_login_qabul_qilgan: null | string
    status: number
    document_yaratilgan_vaqt: string
    document_qabul_qilingan_vaqt: null | string
    types: ReportPreviewProvodka[]
  }
}
