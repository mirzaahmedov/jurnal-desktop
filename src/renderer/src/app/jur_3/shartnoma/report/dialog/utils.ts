import type { MainSchet, Organization } from '@/common/models'

import i18next from 'i18next'

import { validateDate } from '@/common/lib/date'
import { formatLocaleDate, formatNumber } from '@/common/lib/format'
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

  const templates = {
    uz: 'Umumiy summa {summaTotal} {summaWords}. yuqorida koʻrsatilgan summadan {summa} soʻmi yoki shartnomaning umumiy summasining {percentage}%ni {year} yil {month} oyida oldindan toʻlanishi lozim.',
    cyrl: 'Умумий сумма {summaTotal} {summaWords}. юқорида кўрсатилган суммадан {summa} сўми ёки шартноманинг умумий суммасининг {percentage}%ни {year} йил {month} ойида олдиндан тўланиши лозим.',
    ru: 'Общая сумма составляет {summaTotal} {summaWords}. Из указанной выше суммы {summa} сумов или {percentage}% от общей суммы договора должно быть оплачено авансом в {month} {year} году.'
  }
  const template =
    i18next.language === 'ru'
      ? templates.ru
      : i18next.language === 'cyrl'
        ? templates.cyrl
        : templates.uz

  return template
    .replace('{summaTotal}', formatNumber(summaTotal))
    .replace('{summaWords}', numberToWords(summaTotal, i18next.language))
    .replace('{summa}', formatNumber(summa))
    .replace('{percentage}', roundNumberToTwoDecimalPlaces(Number(percentage)).toString())
    .replace('{year}', year)
    .replace('{month}', month)
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
  const templates = {
    ru: 'В адрес {mchs} и {organization} на общую сумму {summa} {summa_words}, согласно договору № {doc_num} от {doc_date}.',
    uz: '{mchs} va {organization} bilan umumiy summadagi {summa} {summa_words}. {doc_date} yildagi {doc_num}-sonli shartnomaga',
    cyrl: '{mchs} ва {organization} билан умумий суммадаги {summa} {summa_words}. {doc_date} йилдаги {doc_num}-сонли шартномага'
  }
  const template =
    i18next.language === 'ru'
      ? templates.ru
      : i18next.language === 'cyrl'
        ? templates.cyrl
        : templates.uz

  return template
    .replace('{mchs}', main_schet.tashkilot_nomi)
    .replace('{organization}', organization.name)
    .replace('{summa}', formatNumber(summa))
    .replace('{summa_words}', numberToWords(summa, i18next.language))
    .replace('{doc_num}', doc_num)
    .replace('{doc_date}', formatLocaleDate(doc_date))
}
