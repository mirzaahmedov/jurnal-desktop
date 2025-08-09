export interface Workplace {
  id: number
  vacantId: number
  rayon: string
  prOk: string
  razryad: number
  oklad: number
  poryadNum: number
  stavka: number
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
