export namespace OX {
  type Summa = {
    ajratilgan_mablag: number
    tulangan_mablag_smeta_buyicha: number
    kassa_rasxod: number
    haqiqatda_harajatlar: number
    qoldiq: number
  }

  export type Schet = {
    id: number
    name: string
    schet: string
    created_at: string
    updated_at: string
  }

  export type AdminReport = {
    id: number
    month: number
    year: number
    budjet_id: number
    name: string
    user_id: number
    user_login: string
    accepted_id: null | number
    accepted_login: null | string
    status: number
    region_id: number
    region_name: string
    accepted_time: null | string
    created_at: string
  }

  export type Report = {
    month: number
    year: number
    ajratilgan_mablag: number
    tulangan_mablag_smeta_buyicha: number
    kassa_rasxod: number
    haqiqatda_harajatlar: number
    qoldiq: number
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
    document_yaratilgan_vaqt: string
    document_qabul_qilingan_vaqt: null | string
  }

  export type ReportPreviewDetails = {
    year: number
    month: number
    summa: Summa
    smeta_grafiks: Array<ReportPreviewProvodka>
  }

  export type ReportPreviewProvodka = {
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
    id: number
    user_id: number
    user_id_accepted: any
    budjet_id: number
    accepted_time: any
    month: number
    year: number
    status: number
    created_at: string
    childs: Array<ReportPreviewProvodka>
  }
}
