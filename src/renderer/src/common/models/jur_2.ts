export interface BankMonitoring {
  id: number
  doc_num: string
  doc_date: string
  prixod_sum?: number
  rasxod_sum?: number
  id_spravochnik_organization: number
  spravochnik_organization_name: string
  spravochnik_organization_raschet_schet: string
  spravochnik_organization_inn: string
  shartnomalar_doc_num?: string
  shartnomalar_doc_date?: string
  opisanie?: string
  user_id: number
  fio: string
  login: string
  provodki_array: [
    {
      provodki_schet: string
      provodki_sub_schet: string
    }
  ]
}

export interface BankSaldo {
  id: number
  main_schet_id: number
  summa: number
  month: number
  year: number
  date_saldo: string
  budjet_id: number
  user_id: number
  created_at: string
  updated_at: string
  isdeleted: boolean
  account_number: string
  updated: boolean
}
