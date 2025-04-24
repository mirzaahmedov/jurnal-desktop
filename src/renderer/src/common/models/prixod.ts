import type { Operatsii } from './operatsii'
import type { Podrazdelenie } from './podrazdelenie'
import type { Sostav } from './sostav'
import type { TypeOperatsii } from './type-operatsii'

export interface BankPrixod {
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
  spravochnik_organization_inn: string
  provodki_array: [
    {
      provodki_schet: string
      provodki_sub_schet: string
    }
  ]
  childs?: BankPrixodPodvodka[]
}

export interface BankPrixodPodvodka {
  id: number
  user_id: number
  spravochnik_operatsii_id: number
  summa: number
}

export interface KassaPrixodProvodka {
  id: number
  user_id: number
  spravochnik_operatsii_id: number
  operatsii: Operatsii
  summa: number
  id_spravochnik_podrazdelenie: number | null
  podrazdelenie: Podrazdelenie | null
  id_spravochnik_sostav: number | null
  sostav: Sostav | null
  id_spravochnik_type_operatsii: number | null
  type_operatsii: TypeOperatsii | null
  kassa_prixod_id: number
  main_schet_id: number
  created_at: string
  updated_at: string
  isdeleted: boolean
  schet: string
}
export interface KassaPrixod {
  id: number
  doc_num: string
  doc_date: string
  opisanie: any
  summa: string
  id_podotchet_litso: any
  user_id: number
  main_schet_id: number
  created_at: string
  updated_at: string
  isdeleted: boolean
  main_zarplata_id: any
  organ_id: number
  contract_id: number
  contract_grafik_id: any
  organ_account_id: number
  organ_gazna_id: number
  type: string
  spravochnik_podotchet_litso_name: string | null
  spravochnik_podotchet_litso_rayon: string | null
  zarplata_fio: any
  childs: KassaPrixodProvodka[]
  podotchet: any
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
export type MO7Prixod = {
  id: number
  doc_num: string
  doc_date: string
  opisanie?: string
  summa: number
  kimdan_name: string
  kimga_name: string
  childs: MO7PrixodChild[]
}
