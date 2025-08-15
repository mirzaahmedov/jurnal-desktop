import type { Operatsii } from './operatsii'
import type { Organization } from './organization'
import type { Podotchet } from './podotchet'
import type { Podrazdelenie } from './podrazdelenie'
import type { Shartnoma } from './shartnoma'
import type { ShartnomaGrafik } from './shartnoma-grafik'
import type { Sostav } from './sostav'
import type { TypeOperatsii } from './type-operatsii'

export interface BankPrixod {
  id: number
  doc_num: string
  doc_date: string
  summa: number
  provodki_boolean: any
  dop_provodki_boolean: any
  opisanie: any
  id_spravochnik_organization: number
  id_shartnomalar_organization: number
  organization_by_raschet_schet_id: number
  organization_by_raschet_schet_gazna_id: any
  shartnoma_grafik_id: number
  organ: Organization
  smeta_name: string
  smeta_number: string
  account_number: Organization.RaschetSchet
  gazna_number: Organization.RaschetSchetGazna
  contract: Shartnoma
  contract_grafik: ShartnomaGrafik
  childs: BankPrixodPodvodka[]
}

export interface BankPrixodPodvodka {
  id: number
  spravochnik_operatsii_id: number
  spravochnik_operatsii_name: string
  summa: number
  schet: string
  id_spravochnik_podrazdelenie: any
  spravochnik_podrazdelenie_name: any
  id_spravochnik_sostav: number
  spravochnik_sostav_name: string
  id_spravochnik_type_operatsii: number
  spravochnik_type_operatsii_name: string
  id_spravochnik_podotchet_litso: number
  spravochnik_podotchet_litso_name: string
  main_zarplata_id: any
  operatsii: Operatsii
  podrazdelenie: Podrazdelenie
  type_operatsii: TypeOperatsii
  sostav: Sostav
  podotchet: Podotchet
}

export interface KassaPrixodProvodka {
  id: number
  user_id: number
  spravochnik_operatsii_id: number
  summa: number
  id_spravochnik_podrazdelenie: number | null
  id_spravochnik_sostav: number | null
  id_spravochnik_type_operatsii: number | null
  kassa_prixod_id: number
  main_schet_id: number
  created_at: string
  updated_at: string
  isdeleted: boolean
  schet: string
  operatsii: Operatsii
  podrazdelenie: Podrazdelenie | null
  sostav: Sostav | null
  type_operatsii: TypeOperatsii | null
}
export interface KassaPrixod {
  id: number
  doc_num: string
  doc_date: string
  opisanie: string | null
  summa: string
  id_podotchet_litso: number | null
  user_id: number
  main_schet_id: number
  created_at: string
  updated_at: string
  isdeleted: boolean
  main_zarplata_id: number | null
  organ_id: number
  contract_id: number
  contract_grafik_id: number | null
  organ_account_id: number
  organ_gazna_id: number
  type: string
  organization_name: string | null
  organization_inn: string | null
  spravochnik_podotchet_litso_name: string | null
  spravochnik_podotchet_litso_rayon: string | null
  zarplata_fio: string | null
  childs: KassaPrixodProvodka[]
  provodki_array: Array<{
    provodki_schet: string
    provodki_sub_schet: string
  }>
  podotchet: any
}
