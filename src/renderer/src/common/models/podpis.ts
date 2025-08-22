export enum PodpisTypeDocument {
  BANK_RASXOD_PORUCHENIYA = 'BANK_RASXOD_PORUCHENIYA',
  SHARTNOMA_GRAFIK_OPLATI = 'SHARTNOMA_GRAFIK_OPLATI',
  AKT_SVERKA = 'akt_sverka',
  DAYS_REPORT = 'daysReport',
  CAP = 'cap',
  JUR7_MATERIAL = 'jur7_material',
  JUR7_AKT_PRIYOM = 'jur7_akt_priyom'
}

export interface Podpis {
  id: number
  numeric_poryadok: number
  doljnost_name: string
  fio_name: string
  type_document: PodpisTypeDocument
}

export interface PodpisType {
  id: number
  name: string
  key: string
}
