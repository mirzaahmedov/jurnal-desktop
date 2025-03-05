export interface OstatokResponsible {
  id: number
  fio: string
  spravochnik_podrazdelenie_jur7_id: number
  spravochnik_podrazdelenie_jur7_name: string
  products: OstatokProduct[]
}

export interface OstatokGroup {
  id: number
  smeta_id: number
  name: string
  schet: string
  iznos_foiz: number
  provodka_debet: string
  group_number: string
  provodka_kredit: string
  provodka_subschet: string
  roman_numeral: any
  pod_group: string
  smeta_name: string
  smeta_number: string
  products: OstatokProduct[]
}

export interface OstatokProduct {
  id: number
  user_id: number
  naimenovanie_tovarov_jur7_id: number
  kol: number
  sena: number
  summa: number
  year: number
  month: number
  date_saldo: string
  kimning_buynida: number
  created_at: string
  updated_at: string
  isdeleted: boolean
  iznos_summa_bir_oylik: number
  prixod_id: number
  doc_date: string
  iznos: boolean
  doc_num: string
  region_id: number
  iznos_schet: any
  iznos_sub_schet: any
  iznos_summa: number
  iznos_start: string | null
  eski_iznos_summa: number
  responsible_id: number
  product: {
    id: number
    user_id: number
    spravochnik_budjet_name_id: number
    name: string
    edin: string
    group_jur7_id: number
    created_at: string
    updated_at: string
    isdeleted: boolean
    inventar_num: string
    serial_num: string
    iznos: boolean
  }
  name: string
  edin: string
  group_jur7_name: string
  prixod_data: {
    doc_num: string
    doc_date: string
    doc_id: number
  }
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
  responsible: {
    id: number
    spravochnik_podrazdelenie_jur7_id: number
    fio: string
    user_id: number
    created_at: string
    updated_at: string
    isdeleted: boolean
  }
  from: {
    kol: number
    sena: number
    summa: number
    iznos_summa: number
    iznos_schet: any
    iznos_sub_schet: any
  }
  internal: {
    kol: number
    kol_rasxod: number
    kol_prixod: number
    summa: number
    summa_prixod: number
    summa_rasxod: number
    iznos_rasxod: number
    iznos_prixod: number
    iznos_summa: number
  }
  to: {
    kol: number
    summa: number
    iznos_summa: number
    sena: number
  }
}
