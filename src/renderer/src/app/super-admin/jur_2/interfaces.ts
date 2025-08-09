export interface AdminBank {
  id: number
  name: string
  main_schets: AdminBankMainSchet[]
  summa_from: number
  prixod: number
  rasxod: number
  summa_to: number
  docs: AdminBankDocument[]
}

export interface AdminBankMainSchet {
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
  docs: AdminBankDocument[]
}

export interface AdminBankDocument {
  id: number
  doc_num: string
  doc_date: string
  prixod_sum: number
  rasxod_sum: number
  id_spravochnik_organization: number
  spravochnik_organization_name: string
  spravochnik_organization_raschet_schet: null
  spravochnik_organization_inn: string
  id_shartnomalar_organization: null
  shartnomalar_doc_num: null
  shartnomalar_doc_date: null
  opisanie: string
  combined_doc_date: string
  combined_id: number
  combined_doc_num: string
  login: string
  fio: string
  user_id: number
  provodki_array: Array<{
    provodki_schet: string
    provodki_sub_schet: string
  }>
  type: string
}
