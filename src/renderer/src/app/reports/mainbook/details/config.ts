import { z } from 'zod'

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
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  childs: []
}
