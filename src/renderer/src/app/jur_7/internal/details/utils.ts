import type { InternalFormValues } from '../config'
import type { UseFormReturn } from 'react-hook-form'

import { formatLocaleDate } from '@/common/lib/format'

const attorneyRegExp = /^(.*?) ваколатнома /
const schetFaktura = /хамда \d{2}\.\d{2}\.\d{4} йил № (.*?) сонли хисоб фактура /

export interface ChangeOpisaniePowerOfAttorneyArgs {
  form: UseFormReturn<InternalFormValues>
  attorney: string
}
export const changeOpisaniePowerOfAttorney = ({
  form,
  attorney
}: ChangeOpisaniePowerOfAttorneyArgs) => {
  if (!attorney) {
    form.setValue('opisanie', form.getValues('opisanie')?.replace(attorneyRegExp, '') ?? '')
    return
  }

  if (attorneyRegExp.test(form.getValues('opisanie') || '')) {
    form.setValue(
      'opisanie',
      form.getValues('opisanie')?.replace(attorneyRegExp, `${attorney} ваколатнома `) ?? ''
    )
    return
  }
  form.setValue('opisanie', `${attorney} ваколатнома ` + (form.getValues('opisanie') ?? ''))
}

export interface ChangeOpisanieSchetFakturaArgs {
  form: UseFormReturn<InternalFormValues>
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
