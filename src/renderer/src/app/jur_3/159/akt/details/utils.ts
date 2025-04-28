import type { AktFormValues } from '../config'
import type { Shartnoma } from '@/common/models'
import type { UseFormReturn } from 'react-hook-form'

import { formatLocaleDate } from '@/common/lib/format'

const shartnomaRegExp = /\d{2}\.\d{2}\.\d{4} йил кунги № (.*?) шартнома /
const schetFaktura = /хамда \d{2}\.\d{2}\.\d{4} йил № (.*?) сонли хисоб фактура /

export interface ChangeOpisanieContractArgs {
  form: UseFormReturn<AktFormValues>
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
          `${formatLocaleDate(contract.doc_date)} йил кунги № ${contract.doc_num} шартнома `
        ) ?? ''
    )
    return
  }
  form.setValue(
    'opisanie',
    `${formatLocaleDate(contract.doc_date)} йил кунги № ${contract.doc_num} шартнома ` +
      (form.getValues('opisanie') ?? '')
  )
}

export interface ChangeOpisanieSchetFakturaArgs {
  form: UseFormReturn<AktFormValues>
  doc_num: string
  doc_date: string
}
export const changeOpisanieSchetFaktura = ({
  form,
  doc_num,
  doc_date
}: ChangeOpisanieSchetFakturaArgs) => {
  if (!(doc_num && doc_date)) {
    form.setValue('opisanie', form.getValues('opisanie')?.replace(schetFaktura, '')) ?? ''
    return
  }

  if (schetFaktura.test(form.getValues('opisanie') || '')) {
    form.setValue(
      'opisanie',
      form
        .getValues('opisanie')
        ?.replace(
          schetFaktura,
          `хамда ${formatLocaleDate(doc_date)} йил № ${doc_num} сонли хисоб фактура `
        ) ?? ''
    )
    return
  }

  form.setValue(
    'opisanie',
    `хамда ${formatLocaleDate(doc_date)} йил № ${doc_num} сонли хисоб фактура `
  )
}
