import type { PayrollDeduction } from './payroll-deduction'
import type { PayrollPayment } from './payroll-payment'

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
  mainZarplataId: number
  fio: string
  kartochka: string
  doljnostName: string
  nachisleniePayrollPayments: PayrollPayment[]
  nachisleniePayrollDeductions: PayrollDeduction[]
  totalNachislenie: number
  totalUderjanie: number
  totalNaruki: number
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
}

export interface NachislenieOthersPayment {
  paymentId: number
  paymentName: string
}
