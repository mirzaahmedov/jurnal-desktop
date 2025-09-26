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
  nachislenieMainId: number
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
