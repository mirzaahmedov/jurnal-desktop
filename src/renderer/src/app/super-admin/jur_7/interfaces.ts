export interface AdminMaterial {
  id: number
  name: string
  main_schets: AdminMaterialMainSchet[]
  summa_from: number
  summa_to: number
}

export interface AdminMaterialMainSchet {
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
    data: Array<any>
    from_summa: number
    from_kol: number
    internal_rasxod_summa: number
    internal_rasxod_kol: number
    internal_prixod_summa: number
    internal_prixod_kol: number
    to_summa: number
    to_iznos_summa: number
    to_kol: number
    page_from_summa: number
    page_from_kol: number
    page_internal_rasxod_summa: number
    page_internal_rasxod_kol: number
    page_internal_prixod_summa: number
    page_internal_prixod_kol: number
    page_to_summa: number
    page_to_iznos_summa: number
    page_to_kol: number
    total: number
  }
  summa_from: number
  summa_to: number
}
