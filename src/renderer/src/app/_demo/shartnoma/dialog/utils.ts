import type { MainSchet, Organization } from '@renderer/common/models'

import { formatLocaleDate } from '@renderer/common/lib/format'
import i18next from 'i18next'

import { numberToWords, roundNumberToTwoDecimalPlaces } from '@/common/lib/utils'

type BuildContractPaymentDetailsTextParams = {
  percentageValue: string
  summaValue: number
  summaTotal: number
  paymentDate: string
}
export const buildContractPaymentDetailsText = ({
  percentageValue,
  summaValue,
  summaTotal,
  paymentDate
}: BuildContractPaymentDetailsTextParams) => {
  const date = new Date(paymentDate)
  const month = date.toLocaleString('ru', { month: 'long' })
  const year = date.getFullYear()
  const summa =
    percentageValue === 'custom' ? summaValue : (summaTotal * Number(percentageValue)) / 100
  const percentage =
    percentageValue === 'custom' ? (summaValue / summaTotal) * 100 : percentageValue

  return `Умумий сумма ${summaTotal} ${numberToWords(summaTotal, i18next.language)}. юкорида курсатилган суммадан ${summa} суми ёки шартноманинг умумий суммасининг ${roundNumberToTwoDecimalPlaces(Number(percentage))}%ни ${year} йил ${month} ойида олдиндан туланиши лозим`
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
  return `${main_schet.tashkilot_nomi} ва ${organization.name} билан умумий суммадаги ${summa} ${numberToWords(summa, i18next.language)}. ${formatLocaleDate(doc_date)} йилдаги ${doc_num}-сонли шартномага`
}
