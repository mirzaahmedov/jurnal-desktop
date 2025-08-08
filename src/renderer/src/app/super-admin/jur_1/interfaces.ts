export interface AdminKassa {
  id: number
  name: string
  main_schets: AdminKassaMainSchet[]
  summa_from: number
  prixod: number
  rasxod: number
  summa_to: number
}

export interface AdminKassaMainSchet {
  id: number
  account_number: string
  jur1_schet: string
  jur2_schet: string
  budjet_name: string
  budjet_id: number
  jur3_schets_159: Array<{
    id: number
    schet: string
  }>
  jur3_schets_152: Array<{
    id: number
    schet: string
  }>
  jur4_schets: Array<{
    id: number
    schet: string
  }>
  saldo: {
    id: number
    main_schet_id: number
    summa: number
    month: number
    year: number
    user_id: number
    created_at: string
    updated_at: string
    isdeleted: boolean
    budjet_id: number
    date_saldo: string
  }
  summa_from: number
  prixod: number
  rasxod: number
  summa_to: number
}
