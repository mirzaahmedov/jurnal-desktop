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
  day1: number
  itogo: number
  workplaceId: number
  doljnostName: string
  doljnostOklad: number
  doljnostPrikazNum: string
  doljnostPrikazDate: string
  spravochnikZarplataIstochnikFinanceId: number
  spravochnikZarplataIstochnikFinanceName: string
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
