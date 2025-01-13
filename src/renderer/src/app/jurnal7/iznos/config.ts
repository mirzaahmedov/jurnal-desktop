import { withPreprocessor } from '@renderer/common/lib/validation'
import { z } from 'zod'

export const iznosQueryKeys = {
  getAll: 'iznos/all'
}

export const IznosFormSchema = withPreprocessor(
  z.object({
    iznos_start_date: z.string().nonempty(),
    eski_iznos_summa: z.number()
  })
)
export type IznosFormValues = z.infer<typeof IznosFormSchema>

export const defaultValues: IznosFormValues = {
  eski_iznos_summa: 0,
  iznos_start_date: ''
}
