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
  spravochnik_organization_id: number
  doc_num: string
  doc_date: string
  opisanie?: string
  summa: number
  pudratchi_bool: boolean
  grafik_year?: number
  yillik_oylik: boolean
  grafiks: ShartnomaGrafik[]
}
