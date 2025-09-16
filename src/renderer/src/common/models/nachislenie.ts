import type { PayrollDeduction } from './payroll-deduction'

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

export interface NachislenieProvodka {
  id: number
  docNum: number
  mainZarplataId: number
  fio: string
  kartochka: string
  doljnostName: string
  totalNachislenie: number
  totalUderjanie: number
  totalNaruki: number
  tabel: NachislenieTabel
  nachisleniePayrollPayments: Array<{
    id: number
    summa: number
    percentage: number
    name: string
    paymentId: number
    mainZarplataId: number
  }>
  nachisleniePayrollDeductions: Array<{
    id: number
    summa: number
    percentage: number
    name: string
    deductionId: number
    mainZarplataId: number
  }>
}
export interface NachislenieTabel {
  id: number
  mainZarplataId: number
  fio: null
  doljnost: null
  rabDni: number
  otrabDni: number
  noch: number
  prazdnik: number
  pererabodka: number
  kazarma: number
}

export interface NachislenieOthers {
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
  amount: number
  type: string
  childCreatDtos: Array<{
    mainZarplataId: number
  }>
  payments: Array<{
    paymentId: number
  }>
}

export interface NachislenieOthersProvodka {
  id: number
  mainZarplataId: number
  fio: string
  kartochka: string
  doljnostName: string
  summa: number
  deductions: PayrollDeduction[]
}

export interface NachislenieOthersPayment {
  paymentId: number
  paymentName: string
}

export interface NachislenieDeductionDto {
  id: number
  mainZarplataId: number
  percentage: number
  summa: number
  deductionId: number
}

export interface NachisleniePaymentDto {
  id: number
  mainZarplataId: number
  percentage: number
  summa: number
  paymentId: number
}
