import { z } from 'zod'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { withPreprocessor } from '@/common/lib/validation'

export const RequisitesFormSchema = withPreprocessor(
  z.object({
    main_schet_id: z.number().optional(),
    budjet_id: z.number().optional(),
    jur3_schet_id: z.number().optional(),
    jur4_schet_id: z.number().optional(),
    user_id: z.number().optional()
  })
)

export interface RequisitesFormValues {
  main_schet_id?: number
  budjet_id?: number
  user_id?: number
  jur3_schet_id?: number
  jur4_schet_id?: number
}

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
export const getJur3SchetId = () => {
  return useRequisitesStore.getState().jur3_schet_id
}
export const getJur4SchetId = () => {
  return useRequisitesStore.getState().jur4_schet_id
}
