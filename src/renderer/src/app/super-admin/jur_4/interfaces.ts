export interface AdminPodotchet {
  id: number
  name: string
  main_schets: AdminPodotchetMainSchet[]
  summa_from: number
  summa_to: number
}

export interface AdminPodotchetMainSchet {
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
  jur3_schets_152: AdminPodotchetSchet[]
  jur4_schets: Array<{
    id: number
    schet: string
  }>
  summa_from: number
  summa_to: number
}

export interface AdminPodotchetSchet {
  id: number
  schet: string
  saldo: {
    id: number
    main_schet_id: number
    schet_id: number
    month: number
    year: number
    date_saldo: string
    budjet_id: number
    user_id: number
    created_at: string
    updated_at: string
    isdeleted: boolean
    childs: Array<{
      id: number
      parent_id: number
      organization_id: number
      created_at: string
      updated_at: string
      isdeleted: boolean
      prixod: number
      rasxod: number
      name: string
      inn: string
      bank_klient: string
      mfo: string
      summa: number
    }>
    account_number: string
    schet: string
    prixod: number
    rasxod: number
    summa: number
  }
  summa_from: number
  summa_to: number
}
