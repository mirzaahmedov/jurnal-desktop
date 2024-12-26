type Podotchet = {
  id: number
  name: string
  rayon: string
}

type PodotchetMonitor = {
  id: number
  doc_num: string
  doc_date: string
  prixod_sum: number
  rasxod_sum: number
  opisanie: string
  podotchet_litso_id: number
  podotchet_name: string
  user_id: number
  fio: string
  login: string
  type: string
  operatsii?: string
  provodki_schet: string
  provodki_sub_schet: string
}

export type { Podotchet, PodotchetMonitor }
