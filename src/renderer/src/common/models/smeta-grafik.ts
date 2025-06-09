export interface SmetaGrafikProvodka {
  id: number
  smeta_id: number
  smeta_name: string
  smeta_number: string
  itogo?: number
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

export interface SmetaGrafik {
  id: number
  year: number
  order_number: number
  user_id: number
  main_schet_id: number
  isdeleted: boolean
  created_at: string
  updated_at: boolean
  account_number: string
  summa: number
  command: string
  smetas: SmetaGrafikProvodka[]
}
