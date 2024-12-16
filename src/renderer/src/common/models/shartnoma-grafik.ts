type ShartnomaGrafik = {
  spravochnik_organization_id: number
  spravochnik_organization_name?: string
  spravochnik_organization_bank_klient?: string
  spravochnik_organization_mfo?: string
  spravochnik_organization_inn?: string
  spravochnik_organization_raschet_schet?: string
  id_shartnomalar_organization: number
  shartnomalar_organization_doc_num?: string
  shartnomalar_organization_doc_date?: string
  shartnomalar_organization_opisanie?: string
  shartnomalar_organization_summa?: number
  shartnomalar_organization_pudratchi_bool?: boolean
  smeta_number: number
  smeta2_number?: number
  id: number
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
  summa: number
}

type ShartnomaGrafikDetails = {
  id: number
  id_shartnomalar_organization: number
  doc_num: string
  doc_date: string
  summa: number
  opisanie: string
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
}

export type { ShartnomaGrafik, ShartnomaGrafikDetails }
