export interface MainZarplata {
  id: number
  userId: number
  kartochka: string
  vacantId: number
  rayon: string
  fio: string
  spravochikZarplataZvanieId: number
  spravochikZarplataZvanieName: string
  xarbiy: boolean
  inn: string
  ostanovitRaschet: boolean
  raschetSchet: string
  fioDop: string
  bank: string
  dateBirth: string
  inps: string
  spravochnikZarplataGrafikRabotiId: number
  spravochnikZarplataGrafikRabotiName: string
  spravochnikZarplataGrafikRabotiTypeCode: number
  spravochnikSostavId: number
  spravochnikSostavName: string
  stavka: number
  nachaloSlujbi: string
  visNa1Year: number
  month1: number
  day: number | null
  day1: number
  itogo: number
  workplaceId: number
  isMatPomoch: boolean | null
  isPremya: boolean | null
  isRaschet: boolean | null
  isPoek: boolean | null
  doljnostName: string
  doljnostOklad: number
  doljnostPrikazNum: string
  doljnostPrikazDate: string
  spravochnikZarplataIstochnikFinanceId: number
  spravochnikZarplataIstochnikFinanceName: string
  spravochnikDoljnostId: number
}

export interface MainZarplataCalculation {
  id: number
  mainZarplataId: number
  percentage: number
  summa: number
  paymentId: number
  code: number
  name: string
}

export interface MainZarplataMatPomoch {
  id: number
  nachislenieYear: number
  nachislenieMonth: number
  docNum: number
  docDate: string
  type: string
  summa: number
}

export interface MainZarplataNachislenie {
  year: number
  month: number
  docNum: number
  docDate: string
  nachislenieSum: number
  uderjanieSum: number
  naRukiSum: number
  type: string
  payments: Payment[]
  deductions: Payment[]
}

interface Payment {
  id: number
  summa: number
  percentage: number
  name: string
}
