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
  iznos: boolean
  group: {
    id: number
    smeta_id: any
    name: string
    schet: string
    iznos_foiz: number
    provodka_debet: string
    provodka_subschet: string
    group_number: string
    provodka_kredit: string
    roman_numeral: any
    pod_group: string
    created_at: string
    updated_at: string
    isdeleted: boolean
  }
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
    sena: number
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
    id: number
    doc_date: string
    doc_num: string
  }
  iznos_data: {
    eski_iznos_summa: number
    iznos_summa: number
    summa: number
    year: number
    month: number
    kol: number
    sena: number
    new_summa: number
    responsible_id: number
  }
}
