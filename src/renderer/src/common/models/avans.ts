type Avans = {
  id: number
  doc_num: string
  doc_date: string
  opisanie: string
  summa: number
  id_podotchet_litso: number
  id_spravochnik_podotchet_litso: number
  spravochnik_podotchet_litso_name: string
  spravochnik_podotchet_litso_rayon: string
  spravochnik_operatsii_own_id: number
  provodki_array: Array<{
    provodki_schet: string
    provodki_sub_schet: string
  }>
  childs: Array<AvansProvodka>
}

type AvansProvodka = {
  id: number
  spravochnik_operatsii_id: number
  summa: number
  id_spravochnik_podrazdelenie: number
  id_spravochnik_sostav: number
  id_spravochnik_type_operatsii: number
}

export type { Avans, AvansProvodka }
