import { z } from 'zod'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { withPreprocessor } from '@/common/lib/validation'

export const RequisitesFormSchema = withPreprocessor(
  z.object({
    main_schet_id: z.number().optional(),
    budjet_id: z.number().optional(),
    jur3_schet_152_id: z.number().optional(),
    jur3_schet_159_id: z.number().optional(),
    jur4_schet_id: z.number().optional(),
    user_id: z.number().optional()
  })
)

export type RequisitesFormValues = z.infer<typeof RequisitesFormSchema>

type RequisitesStore = RequisitesFormValues & {
  setRequisites: (params: RequisitesFormValues) => void
}
export const useRequisitesStore = create(
  persist<RequisitesStore>(
    (set) => ({
      setRequisites: (values) => {
        set(values)
      }
    }),
    {
      name: 'requisites'
    }
  )
)

export const getMainschetId = () => {
  return useRequisitesStore.getState().main_schet_id
}
export const getBudjetId = () => {
  return useRequisitesStore.getState().budjet_id
}
export const getJur3Schet159Id = () => {
  return useRequisitesStore.getState().jur3_schet_159_id
}
export const getJur3Schet152Id = () => {
  return useRequisitesStore.getState().jur3_schet_152_id
}
export const getJur4SchetId = () => {
  return useRequisitesStore.getState().jur4_schet_id
}
