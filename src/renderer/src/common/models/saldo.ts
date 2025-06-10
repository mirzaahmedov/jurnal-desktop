export enum SaldoType {
  Import = 'import',
  Saldo = 'saldo',
  Prixod = 'prixod'
}

export interface SaldoProduct {
  id: number
  eski_iznos_summa: number
  region_id: number
  product_id: number
  name: string
  edin: string
  unit_id: number
  inventar_num: string
  serial_num: string
  group_id: number
  group_name: string
  group_number: string
  provodka_debet: string
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
  year: number
  month: number
  isdeleted: boolean
  type: string
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
    summa: number
    iznos_summa: number
    sena: number
    prixod_kol: number
    rasxod_kol: number
    prixod_summa: number
    rasxod_summa: number
    prixod_iznos_summa: number
    rasxod_iznos_summa: number
  }
  to: {
    kol: number
    summa: number
    iznos_summa: number
    sena: number
    month_iznos: number
  }
}
