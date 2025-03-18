import i18next from 'i18next'
import { z } from 'zod'

import { useDefaultFilters, useSettingsStore } from './store'

export const ConfigureDefaultValuesPayloadSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  language: z.string(),
  zoomFactor: z.number(),
  report_title_id: z.number().optional()
})
export type ConfigureDefaultValuesPayloadType = z.infer<typeof ConfigureDefaultValuesPayloadSchema>

export const defaultValues: ConfigureDefaultValuesPayloadType = {
  from: useDefaultFilters.getState().from,
  to: useDefaultFilters.getState().to,
  language: i18next.language,
  zoomFactor: 1,
  report_title_id: useSettingsStore.getState().report_title_id
}
