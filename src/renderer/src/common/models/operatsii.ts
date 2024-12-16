type Operatsii = {
  id: number
  name: string
  schet: string
  sub_schet: string
  smeta_id: number
}

enum TypeSchetOperatsii {
  KASSA_PRIXOD = 'kassa_prixod',
  KASSA_RASXOD = 'kassa_rasxod',
  BANK_PRIXOD = 'bank_prixod',
  BANK_RASXOD = 'bank_rasxod',
  AKT = 'akt',
  AVANS_OTCHET = 'avans_otchet',
  POKAZAT_USLUGI = 'show_service',
  GENERAL = 'general'
}

export { TypeSchetOperatsii }
export type { Operatsii }
