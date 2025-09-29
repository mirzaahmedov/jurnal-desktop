import type { Deduction } from './deduction'

export interface DopOplata {
  id: number
  mainZarplataId: number
  paymentId: number
  paymentName: string
  from: string
  to: string
  percentage: number
  summa: number
  additionalDeductions: Deduction[]
}

export interface DopOplataById {
  id: number
  mainZarplataId: number
  paymentId: number
  paymentName: string
  from: string
  to: string
  docNum: string | null
  docDate: string | null
  summa: number
  day: number
  additionalDeductions: AdditionalDeduction[]
}
interface AdditionalDeduction {
  id: number
  deductionId: number
  deductionName: string
  summa: number
  percentage: number
}
