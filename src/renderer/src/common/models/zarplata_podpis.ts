export enum ZarplataPodpisType {
  MonthlyVedemost = 'Ish haqi oylik vedemost',
  OtherVedemost = 'Boshqa vedemostlar',
  OtdelniyRaschet = 'Alohida hisob kitob',
  VedemostShapka = 'Vedemost shapka'
}

export interface IZarplataPodpis {
  id: number
  position: string
  fio: string
  type: ZarplataPodpisType
}
