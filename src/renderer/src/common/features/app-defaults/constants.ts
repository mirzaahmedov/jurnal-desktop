import { z } from 'zod'
import { useDefaultFilters, useDefaultFormFields } from './store'

const ConfigureDefaultValuesPayloadSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  rukovoditel: z.string().optional(),
  glav_buxgalter: z.string().optional()
})
type ConfigureDefaultValuesPayloadType = z.infer<typeof ConfigureDefaultValuesPayloadSchema>

const defaultValues: ConfigureDefaultValuesPayloadType = {
  from: useDefaultFilters.getState().from,
  to: useDefaultFilters.getState().to,
  rukovoditel: useDefaultFormFields.getState().rukovoditel,
  glav_buxgalter: useDefaultFormFields.getState().glav_buxgalter
}

export { ConfigureDefaultValuesPayloadSchema, defaultValues }
export type { ConfigureDefaultValuesPayloadType }
