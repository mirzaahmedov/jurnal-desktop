export interface OstatokProduct {
  id: number
  eski_iznos_summa: number
  region_id: number
  product_id: number
  name: string
  edin: string
  inventar_num: string
  serial_num: string
  group_id: number
  group_name: string
  group_number: string
  responsible_id: number
  fio: string
  iznos: boolean
  month_iznos_summa: number
  iznos_start: string
  iznos_schet: string
  iznos_sub_schet: string
  debet_schet: string
  debet_sub_schet: string
  kredit_schet: string
  kredit_sub_schet: string
  prixodData: {
    docNum: string
    docDate: string
    docId: any
  }
  from: {
    sena: number
    summa: number
    iznos_summa: number
    kol: number
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
