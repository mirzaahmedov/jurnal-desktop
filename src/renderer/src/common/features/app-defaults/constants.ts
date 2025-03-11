import { z } from 'zod'

import { useDefaultFilters, useDefaultFormFields, useSettingsStore } from './store'

export const ConfigureDefaultValuesPayloadSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  rukovoditel: z.string().optional(),
  glav_buxgalter: z.string().optional(),
  zoomFactor: z.number().optional(),
  report_title_id: z.number().optional()
})
export type ConfigureDefaultValuesPayloadType = z.infer<typeof ConfigureDefaultValuesPayloadSchema>

export const defaultValues: ConfigureDefaultValuesPayloadType = {
  from: useDefaultFilters.getState().from,
  to: useDefaultFilters.getState().to,
  rukovoditel: useDefaultFormFields.getState().rukovoditel,
  glav_buxgalter: useDefaultFormFields.getState().glav_buxgalter,
  zoomFactor: 1,
  report_title_id: useSettingsStore.getState().report_title_id
}
