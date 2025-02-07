export enum DocumentType {
  BANK_RASXOD = 'bank_rasxod',
  BANK_PRIXOD = 'bank_prixod',
  KASSA_RASXOD = 'kassa_rasxod',
  KASSA_PRIXOD = 'kassa_prixod',
  AVANS = 'avans',
  AKT = 'akt',
  JUR7_PRIXOD = 'jur7_prixod',
  JUR7_RASXOD = 'jur7_rasxod',
  JUR7_INTERNAL = 'jur7_internal',
  SHOW_SERVICE = 'show_service',
  CONTRACT = 'contract'
}

export const queryKeys = {
  getDocumentNumber: '/features/doc-num'
}
