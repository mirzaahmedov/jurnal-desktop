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
  spravochnikBudjetName: string;
  spravochnikBudjetNameId: number
  mainSchetId: number
  description: string | null
}

export interface NachislenieSostav {
  id: number;
  mainZarplataId: number;
  foiz: number;
  summa: number;
  nachislenieName: string;
  nachislenieTypeCode: number;
  spravochnikZarpaltaNachislenieId: number;
}