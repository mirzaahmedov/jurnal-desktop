export interface OrganizationOstatok {
  id: number
  doc_num: string
  doc_date: string
  user_id: number
  opisanie: any
  organ_id: number
  contract_id: number
  main_schet_id: number
  created_at: string
  updated_at: any
  isdeleted: boolean
  organ_account_number_id: number
  organ_gazna_number_id: any
  prixod_summa: number
  rasxod_summa: number
  prixod: boolean
  rasxod: boolean
  contract_grafik_id: number
  organ_name: string
  organ_bank_name: string
  organ_bank_mfo: string
  organ_inn: string
  provodki_array: Array<{
    provodki_schet: string
    provodki_sub_schet: string
  }>
}
