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
export type NachislenieOthersFormValues = z.infer<typeof NachislenieOthersFormSchema>

const today = new Date()
export const defaultValues: NachislenieOthersFormValues = {
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
