export enum PodpisDoljnost {
  RUKOVODITEL = 'RUKOVODITEL',
  BOLIM_BOSHLIGI = 'BOLIM_BOSHLIGI',
  BOSH_BUXGALTER = 'BOSH_BUXGALTER',
  BUXGALTER = 'BUXGALTER',
  KASSIR = 'KASSIR'
}

export enum PodpisTypeDocument {
  KASSA = 'KASSA',
  BANK = 'BANK',
  ORGANIZATION_MONITORING = 'ORGANIZATION_MONITORING',
  PODOTCHET_OTCHET = 'PODOTCHET_OTCHET',
  MATERIAL_SKLAD = 'MATERIAL_SKLAD'
}

type Podpis = {
  id: number
  numeric_poryadok: number
  doljnost_name: PodpisDoljnost
  fio_name: string
  type_document: PodpisTypeDocument
}

export type { Podpis }
