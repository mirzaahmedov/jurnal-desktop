import type { Operatsii } from './operatsii'
import type { Organization } from './organization'
import type { Podrazdelenie } from './podrazdelenie'
import type { Shartnoma } from './shartnoma'
import type { ShartnomaGrafik } from './shartnoma-grafik'
import type { Sostav } from './sostav'
import type { TypeOperatsii } from './type-operatsii'

export interface PokazatUslugi {
  id: number
  doc_num: string
  doc_date: string
  opisanie: string
  summa: number
  organ: Organization
  smeta_name: string
  smeta_number: string
  contract: Shartnoma
  contract_grafik: ShartnomaGrafik
  account_number: Organization.RaschetSchet
  gazna_number: Organization.RaschetSchetGazna
  spravochnik_operatsii_own_id: number
  id_spravochnik_organization: number
  spravochnik_organization_name: string
  spravochnik_organization_raschet_schet: string
  spravochnik_organization_inn: string
  shartnomalar_organization_id: number
  shartnomalar_organization_doc_num: string
  shartnomalar_organization_doc_date: string
  provodki_array: Array<{
    provodki_schet: string
    provodki_sub_schet: string
  }>
  childs: PokazatUslugiProvodka[]
}

export interface PokazatUslugiProvodka {
  spravochnik_operatsii_id: number
  kol: number
  sena: number
  nds_foiz: number
  id_spravochnik_podrazdelenie?: number
  id_spravochnik_sostav?: number
  id_spravochnik_type_operatsii?: number
  operatsii: Operatsii
  type_operatsii: TypeOperatsii
  sostav: Sostav
  podrazdelenie: Podrazdelenie
}
