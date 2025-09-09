export interface OtdelniyRaschet {
  id: number
  prikazNum: string
  prikazDate: string
  opisanie: string
  forMonth: string
  forYear: string
  summa: string
  mainZarplataId: number
  vacantId: number
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
