import type { Operatsii } from './operatsii'
import type { Podotchet } from './podotchet'
import type { Podrazdelenie } from './podrazdelenie'
import type { Sostav } from './sostav'
import type { TypeOperatsii } from './type-operatsii'

export interface Avans {
  id: number
  doc_num: string
  doc_date: string
  opisanie: string
  summa: number
  id_podotchet_litso: number
  id_spravochnik_podotchet_litso: number
  podotchet: Podotchet
  spravochnik_podotchet_litso_name: string
  spravochnik_podotchet_litso_rayon: string
  spravochnik_operatsii_own_id: number
  provodki_array: Array<{
    provodki_schet: string
    provodki_sub_schet: string
  }>
  childs: Array<AvansProvodka>
}

export interface AvansProvodka {
  id: number
  spravochnik_operatsii_id: number
  summa: number
  id_spravochnik_podrazdelenie: number
  id_spravochnik_sostav: number
  id_spravochnik_type_operatsii: number
  operatsii: Operatsii
  type_operatsii: TypeOperatsii
  sostav: Sostav
  podrazdelenie: Podrazdelenie
}
