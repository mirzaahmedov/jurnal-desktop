export namespace OX {
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
    id: number
    type_document: string
    month: number
    year: number
    summa: {
      debet_sum: number
      kredit_sum: number
    }
  }

  export type ReportPreview = {
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
    created_at: string
    accepted_time: null | string
  }

  export type ReportPreviewDetails = {
    id: number
    user_id: number
    user_id_accepted: number
    budjet_id: number
    accepted_time: string
    month: number
    year: number
    status: number
    data: Array<ReportPreviewProvodka>
  }

  export type ReportPreviewProvodka = {
    type: string
    debet_sum: number
    kredit_sum: number
    grafiks: Array<ReportPreviewProvodkaGrafik>
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
