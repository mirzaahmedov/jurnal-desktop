export interface ShartnomaSmetaGrafikOptions {
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
  itogo: number
  smeta_id: number
  sub_schet: string
}
export interface ShartnomaGrafikPDFDocumentOptions {
  chapter: string
  subchapter: string
  section: string
  createdDate: string
  shartnomaDetails: string
  paymentDetails: string
  glav_mib: string
  rukovoditel: string
  grafiks: ShartnomaSmetaGrafikOptions[]
}
