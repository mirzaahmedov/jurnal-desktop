export type Naimenovanie = {
  id: number
  name: string
  edin: string
  group_jur7_id: number
  group_name: string
  schet: string
  iznos_foiz: number
  provodka_debet: string
  group_number: string
  provodka_kredit: string
  provodka_subschet: string
  roman_numeral: string
  pod_group: string
  spravochnik_budjet_name_id: number
  inventar_num: string
  serial_num: string
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

export type { NaimenovanieKol }
