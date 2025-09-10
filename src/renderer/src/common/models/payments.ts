export interface Payment {
  id: number
  code: number
  name: string
  nameUz: string
  isINPSTaxable: boolean
  isUnionDeductible: boolean
  isAlimonyDeductible: boolean
  isIncomeTaxDeductible: boolean
  isUSTDeductible: boolean
  expenseAccount: string
  creditAccount: string
  subAccount: string
  sourceFund: string
  calculationFormula: string
  typePayment: boolean
}
