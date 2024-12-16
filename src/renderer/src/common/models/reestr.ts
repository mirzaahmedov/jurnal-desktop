type ReestrOperation = {
  id: number
  shartnoma_id: number
  doc_num: string
  doc_date: string
  opisanie: string
  summa_rasxod: number
  summa_prixod: number
  user_id: number
  login: string
  fio: string
  schet_array: Array<string>
}
type ReestrContract = {
  id: number
  spravochnik_organization_id: number
  organization_name: string
  doc_num: string
  doc_date: string
  smeta_id: number
  smeta2_id: number
  opisanie: string
  summa: number
  pudratchi_bool: boolean
  smeta_number: number
  login: string
  fio: string
  user_id: number
  array: Array<ReestrOperation>
  summa_rasxod: number
  summa_prixod: number
}

export type { ReestrContract, ReestrOperation }
