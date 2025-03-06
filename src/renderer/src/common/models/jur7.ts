export interface Jur7Child {
  naimenovanie_tovarov_jur7_id: number
  kol: number
  sena: number
  nds_foiz: number
  summa: number
  debet_schet: string
  debet_sub_schet: string
  kredit_schet: string
  kredit_sub_schet: string
  data_pereotsenka: string
}
export interface Jur7Rasxod {
  id: number
  doc_num: string
  doc_date: string
  opisanie?: string
  summa: number
  kimdan_name: string
  kimga_name: string
  childs: Jur7Child[]
}
export interface Jur7Prixod {
  id: number
  doc_num: string
  doc_date: string
  opisanie?: string
  summa: number
  kimdan_name: string
  kimga_name: string
  childs: Jur7Child[]
}
export interface Jur7InternalTransfer {
  id: number
  doc_num: string
  doc_date: string
  opisanie?: string
  summa: number
  kimdan_name: string
  kimga: {
    id: number
    spravochnik_podrazdelenie_jur7_id: number
    fio: string
    user_id: number
    created_at: string
    updated_at: string
    isdeleted: boolean
  }
  childs: Jur7Child[]
}
