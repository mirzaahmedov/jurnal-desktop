export interface BankOstatok {
  id: number
  doc_num: string
  doc_date: string
  rasxod_summa: number
  prixod_summa: number
  prixod: boolean
  rasxod: boolean
  opisanie: string
  user_id: number
  main_schet_id: number
  created_at: string
  updated_at: any
  isdeleted: boolean
  provodki_array: Array<{
    provodki_schet: string
    provodki_sub_schet: string
  }>
  childs: Array<{
    operatsii_id: number
    podraz_id: any
    sostav_id: any
    type_operatsii_id: any
    summa: number
  }>
}
