import type { Group } from './group'
import type { Naimenovanie } from './naimenovanie'

export type BankRasxod = {
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
  tulanmagan_summa: number
  tulangan_tulanmagan: boolean
  provodki_array: [
    {
      provodki_schet: string
      provodki_sub_schet: string
    }
  ]
  childs: BankRasxodProvodka[]
}

export type BankRasxodProvodka = {
  id: number
  spravochnik_operatsii_id: number
  spravochnik_operatsii_name: string
  summa: number
  tulanmagan_summa: number
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
  provodki_array: [
    {
      provodki_schet: string
      provodki_sub_schet: string
    }
  ]
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

export interface Jur7RasxodChild {
  id: number
  user_id: number
  document_rasxod_jur7_id: number
  naimenovanie_tovarov_jur7_id: number
  kol: number
  sena: number
  nds_foiz: any
  nds_summa: any
  summa_s_nds: any
  summa: number
  debet_schet: string
  debet_sub_schet: string
  kredit_schet: string
  kredit_sub_schet: string
  data_pereotsenka: string
  main_schet_id: number
  created_at: string
  updated_at: string
  isdeleted: boolean
  iznos_schet: string
  iznos_sub_schet: string
  iznos_summa: number
  iznos: boolean
  product: Naimenovanie
  group: Group
}
export interface Jur7Rasxod {
  id: number
  doc_num: string
  doc_date: string
  opisanie?: string
  summa: number
  kimdan_name: string
  kimga_name: string
  childs: Jur7RasxodChild[]
}
