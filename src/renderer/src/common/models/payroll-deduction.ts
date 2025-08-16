export interface PayrollDeduction {
  id: number
  code: number
  mainZarplataId: number
  percentage: number
  summa: number
  deductionId: number
}

export interface AlimentDeduction {
  id: number
  mainZarplataId: number
  deductionId: number
  poluchatelFio: string
  cardNumber: string
  organizationId: number
}
