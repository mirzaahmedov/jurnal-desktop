export interface Workplace {
  id: number
  vacantId: number
  rayon: string
  prOk: string
  koef: number
  oklad: number
  poryadNum: number
  stavka: string
  stavkaPrikaz: string
  okladPrikaz: number
  kartochkaNum: string | null
  fio: string | null
  spravochnikSostavId: number
  spravochnikSostavName: string
  spravochnikZarpaltaDoljnostId: number
  spravochnikZarpaltaDoljnostName: string
  spravochnikZarplataIstochnikFinanceId: number
  spravochnikZarplataIstochnikFinanceName: string
  mainZarplataId: number
  userId: number
  setka: number
}
