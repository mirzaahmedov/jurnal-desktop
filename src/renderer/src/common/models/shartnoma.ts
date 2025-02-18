export interface ShartnomaGrafik {
  smeta_id: number
  sub_schet: string
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
}

export interface Shartnoma {
  id: number
  doc_num: string
  doc_date: string
  user_id: number
  summa: number
  opisanie: string
  smeta_id: any
  smeta2_id: any
  spravochnik_organization_id: number
  pudratchi_bool: boolean
  created_at: string
  updated_at: string
  isdeleted: boolean
  yillik_oylik: any
  budjet_id: number
  organization: {
    id: number
    name: string
    okonx: string
    bank_klient: string
    raschet_schet: string
    raschet_schet_gazna: string
    inn: string
    mfo: string
    user_id: number
    created_at: string
    updated_at: string
    isdeleted: boolean
    parent_id: any
  }
  grafiks: Array<ShartnomaGrafik>
}
