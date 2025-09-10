export interface OtdelniyRaschet {
  id: number
  spravochnikBudjetNameId: number
  mainSchetId: number
  nachislenieYear: number
  nachislenieMonth: number
  docNum: number
  docDate: string
  mainZarplataId: number
  rabDni: number
  otrabDni: number
  noch: number
  prazdnik: number
  pererabodka: number
  kazarma: number
  createdAt?: string
  updatedAt?: string
  nachislenieSum: number
  uderjanieSum: number
  otdelniyRaschetPaymentDtos: OtdelniyRaschetPaymentDto[]
  otdelniyRaschetDeductionDtos: OtdelniyRaschetDeductionDto[]
}

export interface OtdelniyRaschetDeductionDto {
  id: number
  otdelniyRaschetMainId: number
  summa: number
  percentage: number
  deductionId: number
  deductionName: string
}

export interface OtdelniyRaschetPaymentDto {
  id: number
  otdelniyRaschetMainId: number
  summa: number
  percentage: number
  paymentId: number
  paymentName: string
}
