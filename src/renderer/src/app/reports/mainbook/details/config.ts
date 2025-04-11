import { z } from 'zod'

import { useSelectedMonthStore } from '@/common/features/selected-month'

export const MainbookFormSchema = z.object({
  year: z.number(),
  month: z.number(),
  childs: z.array(
    z.object({
      schet: z.string()
    })
  )
})
export type MainbookFormValues = z.infer<typeof MainbookFormSchema>

export const defaultValues: MainbookFormValues = {
  year: useSelectedMonthStore.getState().startDate.getFullYear(),
  month: useSelectedMonthStore.getState().startDate.getMonth() + 1,
  childs: []
}
