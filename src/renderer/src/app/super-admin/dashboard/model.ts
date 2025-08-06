export interface AdminDashboardRegion {
  id: number
  name: string
  summa: number
  budjets: Budjet[]
  podotchets: AdminDashboardPodotchet[]
}
export interface AdminDashboardPodotchet {
  id: number
  name: string
  rayon: string
  user_id: number
  created_at: string
  updated_at: string
  isdeleted: boolean
  position: string
  rank: null
  summa: Summa
}
interface Summa {
  prixod_sum: number
  rasxod_sum: number
  summa: number
}
interface Budjet {
  id: number
  name: string
  main_schets: Mainschet[]
}

interface Mainschet {
  id: number
  spravochnik_budjet_name_id: number
  tashkilot_nomi: string
  tashkilot_bank: string
  tashkilot_mfo: string
  tashkilot_inn: string
  account_number: string
  account_name: string
  jur1_schet: string
  jur1_subschet: null | string
  jur2_schet: string
  jur2_subschet: null | string
  jur3_schet: null | string
  jur3_subschet: null | string
  jur4_schet: null | string
  jur4_subschet: null | string
  user_id: number
  created_at: string
  updated_at: string
  isdeleted: boolean
  gazna_number: null | string
  jur5_schet: null | string
  jur7_schet: null | string
  budjet_name: string
  jur3_schets_159: Jur3schets159[]
  jur3_schets_152: Jur3schets159[]
  jur4_schets: Jur3schets159[]
  login: string
  fio: string
}
interface Jur3schets159 {
  id: number
  schet: string
  main_schet_id: number
  type: string
  created_at: string
  updated_at: string
  isdeleted: boolean
}
