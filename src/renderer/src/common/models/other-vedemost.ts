import type { PayrollDeduction } from './payroll-deduction'

export interface OtherVedemost {
  id: number
  spravochnikBudjetNameId: number
  mainSchetId: number
  nachislenieYear: number
  nachislenieMonth: number
  docNum: number
  docDate: string
  givenDocDate: string
  description: string
  paymentType: string
  paymentId: number
  paymentName: string
  amount: number
  type: string
  childCreatDtos: Array<{
    mainZarplataId: number
  }>
  payments: Array<{
    paymentId: number
  }>
}

export interface OtherVedemostProvodka {
  id: number
  mainZarplataId: number
  fio: string
  kartochka: string
  doljnostName: string
  summa: number
  deductions: PayrollDeduction[]
}

export interface OtherVedemostPayment {
  paymentId: number
  paymentName: string
}
