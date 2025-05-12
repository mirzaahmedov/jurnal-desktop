import type { Operatsii } from './operatsii'
import type { Organization } from './organization'
import type { Podrazdelenie } from './podrazdelenie'
import type { Shartnoma } from './shartnoma'
import type { ShartnomaGrafik } from './shartnoma-grafik'
import type { Sostav } from './sostav'
import type { TypeOperatsii } from './type-operatsii'

export interface Akt {
  id: number
  doc_num: string
  doc_date: string
  opisanie: string
  summa: number
  organ: Organization
  account_number: Organization.RaschetSchet
  gazna_number: Organization.RaschetSchetGazna
  contract: Shartnoma
  contract_grafik: ShartnomaGrafik
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
  childs: AktProvodka[]
}

export interface AktProvodka {
  id: number
  bajarilgan_ishlar_jur3_id: number
  spravochnik_operatsii_id: number
  spravochnik_operatsii_name: string
  summa: number
  id_spravochnik_podrazdelenie: number | null
  spravochnik_podrazdelenie_name: string | null
  id_spravochnik_sostav: number | null
  spravochnik_sostav_name: string | null
  id_spravochnik_type_operatsii: number | null
  spravochnik_type_operatsii_name: string | null
  kol: number
  sena: number
  nds_foiz: number
  nds_summa: number
  summa_s_nds: number
  operatsii: Operatsii
  podrazdelenie: Podrazdelenie
  type_operatsii: TypeOperatsii
  sostav: Sostav
}
