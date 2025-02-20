export type Operatsii = {
  id: number
  name: string
  schet: string
  sub_schet: string
  type_schet: Exclude<TypeSchetOperatsii, TypeSchetOperatsii.ALL>
  smeta_id: number
  budjet_id: number
}

export enum TypeSchetOperatsii {
  KASSA_PRIXOD = 'kassa_prixod',
  KASSA_RASXOD = 'kassa_rasxod',
  BANK_PRIXOD = 'bank_prixod',
  BANK_RASXOD = 'bank_rasxod',
  AKT = 'Akt_priyom_peresdach',
  AVANS_OTCHET = 'avans_otchet',
  POKAZAT_USLUGI = 'show_service',
  JUR7 = 'jur7',
  GENERAL = 'general',
  ALL = 'all'
}
