export type BankMonitoringType = {
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

export type KassaMonitoringType = {
  id: number
  doc_num: string
  doc_date: string
  prixod_sum?: number
  rasxod_sum?: number
  id_podotchet_litso: number
  spravochnik_podotchet_litso_name: string
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
