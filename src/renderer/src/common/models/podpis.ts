export enum PodpisDoljnost {
  RUKOVODITEL = 'RUKOVODITEL',
  NACHALNIK_OTDELA = 'NACHALNIK_OTDELA',
  GLAV_BUXGALTER = 'GLAV_BUXGALTER',
  GLAV_MIB = 'GLAV_MIB',
  BUXGALTER = 'BUXGALTER',
  KASSIR = 'KASSIR'
}

export enum PodpisTypeDocument {
  BANK_RASXOD_PORUCHENIYA = 'BANK_RASXOD_PORUCHENIYA',
  SHARTNOMA_GRAFIK_OPLATI = 'SHARTNOMA_GRAFIK_OPLATI',
  AKT_SVERKA = 'akt_sverka',
  DAYS_REPORT = 'daysReport',
  CAP = 'cap',
  JUR7_MATERIAL = 'jur7_material'
}

export interface Podpis {
  id: number
  numeric_poryadok: number
  doljnost_name: PodpisDoljnost
  fio_name: string
  type_document: PodpisTypeDocument
}
