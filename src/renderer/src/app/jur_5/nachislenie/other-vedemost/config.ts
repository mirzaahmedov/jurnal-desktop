import { t } from 'i18next'
import { z } from 'zod'

import { formatDate } from '@/common/lib/date'

export const NachislenieOthersFormSchema = z.object({
  spravochnikBudjetNameId: z.number(),
  mainSchetId: z.number(),
  nachislenieYear: z.number(),
  nachislenieMonth: z.number(),
  docNum: z.number().min(1),
  docDate: z.string().nonempty(),
  givenDocDate: z.string().nonempty(),
  description: z.string(),
  paymentType: z.string().nonempty(),
  amount: z.number().gt(0, t('required_field')),
  paymentId: z.number().min(1),
  childCreatDtos: z.array(
    z.object({
      mainZarplataId: z.number()
    })
  ),
  payments: z
    .array(
      z.object({
        paymentId: z.number()
      })
    )
    .optional()
})
export type OtherVedemostFormValues = z.infer<typeof NachislenieOthersFormSchema>

const today = new Date()
export const defaultValues: OtherVedemostFormValues = {
  spravochnikBudjetNameId: 0,
  mainSchetId: 0,
  nachislenieYear: today.getFullYear(),
  nachislenieMonth: today.getMonth() + 1,
  docNum: 0,
  docDate: formatDate(today),
  givenDocDate: '',
  description: '',
  paymentType: '',
  amount: 0,
  paymentId: 0,
  childCreatDtos: [],
  payments: []
}

export const OtherVedemostProvdkaFormSchema = z.object({
  fio: z.string(),
  kartochka: z.string(),
  doljnostName: z.string(),
  summa: z.number()
})
export type OtherVedemostProvodkaFormValues = z.infer<typeof OtherVedemostProvdkaFormSchema>

export const OtherVedemostDeductionFormSchema = z.object({
  mainZarplataId: z.number().optional().nullable(),
  percentage: z.number(),
  summa: z.number(),
  deductionId: z.number()
})
export type OtherVedemostDeductionFormValues = z.infer<typeof OtherVedemostDeductionFormSchema>
export const deductionDefaultValues: OtherVedemostDeductionFormValues = {
  mainZarplataId: null,
  percentage: 0,
  summa: 0,
  deductionId: 0
}
