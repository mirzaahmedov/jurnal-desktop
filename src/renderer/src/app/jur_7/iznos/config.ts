import { z } from 'zod'

export const iznosQueryKeys = {
  getAll: 'iznos/all'
}

export const IznosFormSchema = z.object({
  iznos_summa: z.number()
})

export type IznosFormValues = z.infer<typeof IznosFormSchema>

export const defaultValues: IznosFormValues = {
  iznos_summa: 0
}
