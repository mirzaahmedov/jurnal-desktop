export type BankRasxodType = {
  id: number
  doc_num: string
  doc_date: string
  summa: number
  opisanie: string
  id_spravochnik_organization: number
  id_shartnomalar_organization: number
  spravochnik_organization_name?: string
  spravochnik_organization_okonx?: string
  spravochnik_organization_bank_klient?: string
  spravochnik_organization_raschet_schet?: string
  spravochnik_organization_raschet_schet_gazna?: string
  spravochnik_organization_mfo?: string
  spravochnik_organization_inn?: string
  glav_buxgalter: string | null
  rukovoditel: string | null
  childs: BankRasxodProvodkaType[]
}

export type BankRasxodProvodkaType = {
  id: number
  spravochnik_operatsii_id: number
  spravochnik_operatsii_name: string
  summa: number
  id_spravochnik_podrazdelenie: number
  spravochnik_podrazdelenie_name: string
  id_spravochnik_sostav: number
  spravochnik_sostav_name: string
  id_spravochnik_type_operatsii: number
  spravochnik_type_operatsii_name: string
  own_schet: string
  own_subschet: string
}

export type KassaRasxodType = {
  id: number
  doc_num: string
  doc_date: string
  opisanie: string
  summa: number
  id_podotchet_litso: number
  spravochnik_podotchet_litso_name: string
  spravochnik_podotchet_litso_rayon: string
  spravochnik_operatsii_own_id: number
  childs: KassaRasxodProvodkaType[]
}

export type KassaRasxodProvodkaType = {
  id: number
  spravochnik_operatsii_id: number
  summa: number
  id_spravochnik_podrazdelenie: number
  id_spravochnik_sostav: number
  id_spravochnik_type_operatsii: number
  spravochnik_operatsii_own_id: number
}

type MO7RasxodChild = {
  naimenovanie_tovarov_jur7_id: number
  kol: number
  sena: number
  summa: number
  debet_schet: string
  debet_sub_schet: string
  kredit_schet: string
  kredit_sub_schet: string
  data_pereotsenka: string
}
type MO7Rasxod = {
  id: number
  doc_num: string
  doc_date: string
  opisanie?: string
  summa: number
  kimdan_name: string
  kimga_name: string
  childs: MO7RasxodChild[]
}

export type { MO7RasxodChild, MO7Rasxod }
