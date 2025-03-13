export interface PodotchetOstatokChild {
  operatsii_id: number
  podraz_id: any
  sostav_id: any
  type_operatsii_id: any
  summa: number
}

export interface PodotchetOstatok {
  id: number
  doc_num: string
  doc_date: string
  user_id: number
  opisanie: any
  podotchet_id: number
  main_schet_id: number
  created_at: string
  updated_at: any
  isdeleted: boolean
  prixod_summa: number
  rasxod_summa: number
  prixod: boolean
  rasxod: boolean
  podotchet_name: string
  podotchet_rayon: string
  provodki_array: Array<{
    provodki_schet: string
    provodki_sub_schet: string
  }>
  childs: Array<PodotchetOstatokChild>
}
