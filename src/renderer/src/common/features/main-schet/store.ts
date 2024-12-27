import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { withPreprocessor } from '@/common/lib/validation'
import { z } from 'zod'

const RequisitesSchema = withPreprocessor(
  z.object({
    main_schet_id: z.number().optional(),
    budjet_id: z.number().optional(),
    user_id: z.number().optional()
  })
)

type Requisites = {
  main_schet_id?: number
  budjet_id?: number
  user_id?: number
}

type RequisitesStore = Requisites & {
  setRequisites: (params: Requisites) => void
}
export const useRequisitesStore = create(
  persist<RequisitesStore>(
    (set) => ({
      setRequisites: ({ main_schet_id, budjet_id, user_id }) => {
        const result = RequisitesSchema.safeParse({
          main_schet_id,
          budjet_id,
          user_id
        })
        if (result.success) {
          set({
            main_schet_id: result.data.main_schet_id,
            budjet_id: result.data.budjet_id,
            user_id: result.data.user_id
          })
          return
        }
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
export const getBudgetId = () => {
  return useRequisitesStore.getState().budjet_id
}
