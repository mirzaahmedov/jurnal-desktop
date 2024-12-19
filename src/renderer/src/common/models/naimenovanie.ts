type Naimenovanie = {
  id: number
  name: string
  edin: string
  inventar_num?: string
  serial_num?: string
  group_jur7_id: number
  group_jur7_name: string
  spravochnik_budjet_name_id: number
  spravochnik_budjet_name: string
}

type NaimenovanieKol = {
  id: number
  name: string
  edin: string
  group_jur7_id: number
  group_jur7_name: string
  spravochnik_budjet_name_id: number
  spravochnik_budjet_name: string
  prixod1: number
  prixod2: number
  rasxod1: number
  rasxod2: number
  result: number
  doc_date: string
  sena: string
}

export type { Naimenovanie, NaimenovanieKol }
