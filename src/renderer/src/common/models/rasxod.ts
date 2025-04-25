import type { Operatsii } from './operatsii'
import type { Organization } from './organization'
import type { Podotchet } from './podotchet'
import type { Podrazdelenie } from './podrazdelenie'
import type { Shartnoma } from './shartnoma'
import type { ShartnomaGrafik } from './shartnoma-grafik'
import type { Sostav } from './sostav'
import type { TypeOperatsii } from './type-operatsii'

export interface BankRasxod {
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
  spravochnik_organization_inn: string
  glav_buxgalter: string | null
  rukovoditel: string | null
  tulanmagan_summa: number
  tulangan_tulanmagan: boolean
  organ: Organization
  account_number: Organization.RaschetSchet
  gazna_number: Organization.RaschetSchetGazna
  contract: Shartnoma
  contract_grafik: ShartnomaGrafik
  provodki_array: [
    {
      provodki_schet: string
      provodki_sub_schet: string
    }
  ]
  childs: BankRasxodProvodka[]
}

export interface BankRasxodProvodka {
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
  operatsii: Operatsii
  podrazdelenie: Podrazdelenie
  type_operatsii: TypeOperatsii
  sostav: Sostav
  podotchet: Podotchet
}

export interface KassaRasxod {
  id: number
  doc_num: string
  doc_date: string
  opisanie: any
  summa: number
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
  spravochnik_podotchet_litso_name: any
  spravochnik_podotchet_litso_rayon: any
  zarplata_fio: any
  childs: KassaRasxodProvodka[]
  podotchet: any
}

export interface KassaRasxodProvodka {
  id: number
  spravochnik_operatsii_id: number
  summa: number
  id_spravochnik_podrazdelenie: number
  id_spravochnik_sostav: number
  id_spravochnik_type_operatsii: number
  spravochnik_operatsii_own_id: number
  operatsii: Operatsii
  podrazdelenie: Podrazdelenie | null
  sostav: Sostav | null
  type_operatsii: TypeOperatsii | null
}
