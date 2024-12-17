export type BankPrixodType = {
  id: number
  doc_num: string
  doc_date: string
  summa: number
  opisanie: string
  id_spravochnik_organization: number
  id_shartnomalar_organization: number
  spravochnik_operatsii_own_id: number
  main_schet_id: number
  spravochnik_organization_name?: string
  spravochnik_organization_okonx?: string
  spravochnik_organization_bank_klient?: string
  spravochnik_organization_raschet_schet?: string
  spravochnik_organization_raschet_schet_gazna?: string
  spravochnik_organization_mfo?: string
  spravochnik_organization_inn?: string
  childs?: BankPrixodPodvodkaType[]
}

export type BankPrixodPodvodkaType = {
  id: number
  user_id: number
  spravochnik_operatsii_id: number
  summa: number
}

export type KassaPrixodType = {
  id: number
  doc_num: string
  doc_date: string
  summa: number
  opisanie?: string
  id_podotchet_litso: number
  spravochnik_podotchet_litso_name: string
  spravochnik_podotchet_litso_rayon: string
  childs?: BankPrixodPodvodkaType[]
}

type MO7PrixodChild = {
  naimenovanie_tovarov_jur7_id: number
  kol: number
  sena: number
  summa: number
  debet_schet: string
  debet_sub_schet: string
  kredit_schet: string
  kredit_sub_schet: string
  data_pereotsenka: string
  iznos_foiz?: number
}
type MO7Prixod = {
  id: number
  doc_num: string
  doc_date: string
  opisanie?: string
  summa: number
  kimdan_name: string
  kimga_name: string
  childs: MO7PrixodChild[]
}

export type { MO7Prixod }
