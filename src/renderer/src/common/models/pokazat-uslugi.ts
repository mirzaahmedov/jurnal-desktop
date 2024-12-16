type PokazatUslugi = {
  id: number
  doc_num: string
  doc_date: string
  opisanie: string
  summa: number
  spravochnik_operatsii_own_id: number
  id_spravochnik_organization: number
  spravochnik_organization_name: string
  spravochnik_organization_raschet_schet: string
  spravochnik_organization_inn: string
  shartnomalar_organization_id: number
  shartnomalar_organization_doc_num: string
  shartnomalar_organization_doc_date: string
  childs: PokazatUslugiProvodka[]
}

type PokazatUslugiProvodka = {
  spravochnik_operatsii_id: number
  kol: number
  sena: number
  nds_foiz: number
  id_spravochnik_podrazdelenie?: number
  id_spravochnik_sostav?: number
  id_spravochnik_type_operatsii?: number
}

export type { PokazatUslugi, PokazatUslugiProvodka }
