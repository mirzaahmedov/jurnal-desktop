export interface Ostatok {
  id: number
  fio: string
  spravochnik_podrazdelenie_jur7_id: number
  spravochnik_podrazdelenie_jur7_name: string
  products: OstatokProduct[]
}

export interface OstatokProduct {
  id: number
  name: string
  edin: string
  group_jur7_id: number
  spravochnik_budjet_name_id: number
  inventar_num: string
  serial_num: string
  group_jur7_name: string
  iznos_foiz: number
  spravochnik_budjet_name: string
  from: {
    kol: number
    kol_rasxod: number
    kol_prixod: number
    summa: number
    summa_prixod: number
    summa_rasxod: number
    sena: number
  }
  internal: {
    kol: number
    kol_rasxod: number
    kol_prixod: number
    summa: number
    summa_prixod: number
    summa_rasxod: number
    sena: any
  }
  to: {
    kol: number
    kol_rasxod: number
    kol_prixod: number
    summa: number
    summa_prixod: number
    summa_rasxod: number
    sena: number
  }
  prixod_data: {
    doc_date: string
    doc_num: string
  }
}
