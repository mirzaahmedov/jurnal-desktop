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
    accepted_time: null | string
    status: number
    region_id: number
    region_name: string
    created_at: string
  }

  export type AdminReportDetails = {
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
      schets: Array<{
        id: number
        name: string
        schet: string
        created_at: string
        updated_at: string
        summa: Summa
      }>
      debet_sum: number
      kredit_sum: number
    }>
  }

  export type Report = {
    id: number
    type_document: string
    month: number
    year: number
    summa: Summa
  }

  export type ReportPreview = {
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

  export type ReportPreviewDetails = {
    year: number
    month: number
    data: ReportPreviewProvodka[]
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
