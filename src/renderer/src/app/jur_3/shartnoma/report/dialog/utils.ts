import type { MainSchet, Organization } from '@/common/models'

import { validateDate } from '@/common/lib/date'
import { formatLocaleDate } from '@/common/lib/format'
import { numberToWords, roundNumberToTwoDecimalPlaces } from '@/common/lib/utils'

type BuildContractPaymentDetailsTextParams = {
  percentageValue: string
  summaValue: number
  summaTotal: number
  paymentDate?: string
}
export const buildContractPaymentDetailsText = ({
  percentageValue,
  summaValue,
  summaTotal,
  paymentDate
}: BuildContractPaymentDetailsTextParams) => {
  let month = '__________________'
  let year = '__________'

  if (paymentDate && validateDate(paymentDate)) {
    const date = new Date(paymentDate)
    month = date.toLocaleString('ru', { month: 'long' })
    year = date.getFullYear().toString()
  }

  const summa =
    percentageValue === 'custom' ? summaValue : (summaTotal * Number(percentageValue)) / 100
  const percentage =
    percentageValue === 'custom' ? (summaValue / summaTotal) * 100 : percentageValue

  return `Umumiy summa ${summaTotal} ${numberToWords(summaTotal, 'uz')}. yuqorida koʻrsatilgan summadan ${summa} soʻmi yoki shartnomaning umumiy summasining ${roundNumberToTwoDecimalPlaces(Number(percentage))}%ni ${year} yil ${month} oyida oldindan toʻlanishi lozim.`
}

type BuildContractDetailsTextParams = {
  main_schet: MainSchet
  organization: Organization
  doc_date: string
  doc_num: string
  summa: number
}
export const buildContractDetailsText = ({
  doc_date,
  doc_num,
  main_schet,
  organization,
  summa
}: BuildContractDetailsTextParams) => {
  return `${main_schet.tashkilot_nomi} va ${organization.name} bilan umumiy summadagi ${summa} ${numberToWords(summa, 'uz')}. ${formatLocaleDate(doc_date)} yildagi ${doc_num}-sonli shartnomaga`
}
