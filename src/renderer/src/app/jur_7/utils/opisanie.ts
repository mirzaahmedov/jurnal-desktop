import type { UseFormReturn } from 'react-hook-form'

import { formatLocaleDate } from '@/common/lib/format'

const dovernostRegExp = /^(.*?) ишончнома /
const schetFaktura = /хамда \d{2}\.\d{2}\.\d{4} йил № (.*?) сонли хисоб фактура /

export interface ChangeOpisanieDovernostArgs {
  form: UseFormReturn<any>
  dovernost: string
}
export const changeOpisanieDovernost = ({ form, dovernost }: ChangeOpisanieDovernostArgs) => {
  if (!dovernost) {
    form.setValue('opisanie', form.getValues('opisanie')?.replace(dovernostRegExp, '') ?? '')
    return
  }

  if (dovernostRegExp.test(form.getValues('opisanie') || '')) {
    form.setValue(
      'opisanie',
      form.getValues('opisanie')?.replace(dovernostRegExp, `${dovernost} ишончнома `) ?? ''
    )
    return
  }
  form.setValue('opisanie', `${dovernost} ишончнома ` + (form.getValues('opisanie') ?? ''))
}

export interface ChangeOpisanieSchetFakturaArgs {
  form: UseFormReturn<any>
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
