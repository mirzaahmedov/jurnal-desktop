export interface Nachislenie {
  id: number
  mainZarplataId: number
  kartochka: string
  fio: string
  rayon: string
  vacantId: number
  doljnostName: string
  zvanieName: string
  istochFinance: string
  sostav: string
  typeVedomost: string
  typeVedomostSpravochnikZarplataId: number | null
  docNum: number
  docDate: any
  tabelDocNum: number
  tabelDocDate: string
  nachislenieYear: number
  nachislenieMonth: number
  nachislenieText: string
  uderjanieText: string
  dopOplataText: string
  nachislenieSum: number
  dopOplataSum: number
  uderjanieSum: number
  naRuki: number
  spravochnikBudjetNameId: number
  mainSchetId: number
  description: string | null
}
