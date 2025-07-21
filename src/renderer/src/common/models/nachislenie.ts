export interface Nachislenie {
  id: number
  spravochnikBudjetNameId: number
  mainSchetId: number
  nachislenieYear: number
  nachislenieMonth: number
  docNum: number
  docDate: string
  total: number
  nachislenieSum: number
  uderjanieSum: number
  naRukiSum: number
}

export interface NachislenieSostav {
  id: number
  mainZarplataId: number
  foiz: number
  summa: number
  nachislenieName: string
  nachislenieTypeCode: number
  spravochnikZarpaltaNachislenieId: number
}
