import type { Organization } from './organization'
import type { Smeta } from './smeta'

export interface ShartnomaGrafik {
  id: number
  id_shartnomalar_organization: number
  user_id: number
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
  created_at: string
  updated_at: string
  isdeleted: boolean
  yillik_oylik: boolean
  budjet_id: number
  smeta_id: number
  itogo: number
  smeta: Smeta
}

export interface Shartnoma {
  id: number
  doc_num: string
  doc_date: string
  user_id: number
  summa: string
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
  organization: Organization
  grafiks: ShartnomaGrafik[]
}
