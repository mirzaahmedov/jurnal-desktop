import type { BankRasxodFormValues } from '../service'
import type { Shartnoma } from '@/common/models'
import type { UseFormReturn } from 'react-hook-form'

import { formatLocaleDate } from '@/common/lib/format'

const shartnomaRegExp = /№ (.*?)-сонли \d{2}.\d{2}.\d{4} йил кунги шартномага асосан\s?/
const smetaRegExp = / Ст:(.*?)$/

export interface ChangeOpisanieContractArgs {
  form: UseFormReturn<BankRasxodFormValues>
  contract: Shartnoma | undefined
}
export const changeOpisanieContract = ({ form, contract }: ChangeOpisanieContractArgs) => {
  if (!contract) {
    form.setValue('opisanie', form.getValues('opisanie')?.replace(shartnomaRegExp, '') ?? '')
    return
  }

  if (shartnomaRegExp.test(form.getValues('opisanie') || '')) {
    form.setValue(
      'opisanie',
      form
        .getValues('opisanie')
        ?.replace(
          shartnomaRegExp,
          `№ ${contract.doc_num}-сонли ${formatLocaleDate(contract.doc_date)} йил кунги шартномага асосан `
        ) ?? ''
    )
    return
  }
  form.setValue(
    'opisanie',
    `№ ${contract.doc_num}-сонли ${formatLocaleDate(contract.doc_date)} йил кунги шартномага асосан ` +
      (form.getValues('opisanie') ?? '')
  )
}

export interface ChangeOpisanieOperatsiiArgs {
  form: UseFormReturn<BankRasxodFormValues>
  operatsii: { schet: string; sub_schet: string }[] | undefined
}
export const changeOpisanieOperatsii = ({ form, operatsii }: ChangeOpisanieOperatsiiArgs) => {
  if (!operatsii) {
    form.setValue('opisanie', form.getValues('opisanie')?.replace(smetaRegExp, '')) ?? ''
    return
  }

  const value = Array.from(new Set(operatsii.map((o) => o.sub_schet))).join(', ')

  if (smetaRegExp.test(form.getValues('opisanie') || '')) {
    form.setValue(
      'opisanie',
      form.getValues('opisanie')?.replace(smetaRegExp, ` Ст: ${value}`) ?? ''
    )
    return
  }

  form.setValue('opisanie', `${form.getValues('opisanie') ?? ''} Ст: ${value}`)
}
