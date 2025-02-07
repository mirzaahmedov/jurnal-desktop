export namespace Mainbook {
  type Summa = {
    debet_sum: number
    kredit_sum: number
  }

  export enum Status {
    SENT = 1,
    ACCEPTED = 2,
    REJECTED = 3
  }

  export type Schet = {
    id: number
    name: string
    schet: string
    created_at: string
    updated_at: string
  }

  export interface Autofill {
    id: number
    name: string
    schet: string
    created_at: string
    updated_at: string
    debet_sum: number
    kredit_sum: number
  }

  export type AdminReport = {
    month: number
    year: number
    budjet_id: number
    budjet_name: string
    user_id: number
    user_login: string
    user_id_qabul_qilgan: any
    user_login_qabul_qilgan: any
    status: number
    region_id: number
    region_name: string
    document_yaratilgan_vaqt: string
    document_qabul_qilingan_vaqt: any
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

  export type Report = {
    id: number
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
    user_id_qabul_qilgan: any
    user_login_qabul_qilgan: any
    status: number
    document_yaratilgan_vaqt: string
    document_qabul_qilingan_vaqt: any
  }

  export type ReportPreviewDetails = {
    year: number
    month: number
    types: ReportPreviewProvodka[]
  }

  export type ReportPreviewInfo = {
    year: number
    month: number
    type_documents: ReportPreviewProvodka[]
  }

  export type ReportPreviewProvodka = {
    type: string
    schets: Array<{
      id: number
      name: string
      schet: string
      summa: Summa
    }>
    debet_sum: number
    kredit_sum: number
  }
}
