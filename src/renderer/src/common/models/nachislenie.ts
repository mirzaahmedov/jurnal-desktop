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
