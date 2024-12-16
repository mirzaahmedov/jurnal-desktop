import { numberToWords, roundNumberToTwoDecimalPlaces } from '@/common/lib/utils'

type BuildContractDetailsTextParams = {
  percentageValue: string
  summaValue: number
  summaTotal: number
  payment_date: string
}
const buildContractDetailsText = ({
  percentageValue,
  summaValue,
  summaTotal,
  payment_date
}: BuildContractDetailsTextParams) => {
  const date = new Date(payment_date)
  const month = date.toLocaleString('ru', { month: 'long' })
  const year = date.getFullYear()
  const summa =
    percentageValue === 'custom' ? summaValue : (summaTotal * Number(percentageValue)) / 100
  const percentage =
    percentageValue === 'custom' ? (summaValue / summaTotal) * 100 : percentageValue

  return `Умумий сумма ${summaTotal} ${numberToWords(summaTotal)}. юкорида курсатилган суммадан ${summa} суми ёки шартноманинг умумий суммасининг ${roundNumberToTwoDecimalPlaces(Number(percentage))}%ни ${year} йил ${month} ойида олдиндан туланиши лозим`
}

export { buildContractDetailsText }
