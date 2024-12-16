import { z } from 'zod'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { withPreprocessor } from '@/common/lib/validation'

const MainSchetStateSchema = withPreprocessor(
  z.object({
    id: z.number(),
    account_number: z.string(),
    user_id: z.number(),
    budget_id: z.number()
  })
)

type MainSchetStoreType = {
  main_schet?: {
    id: number
    account_number: string
    user_id: number
    budget_id: number
  }
  setMainSchet: (payload?: MainSchetStoreType['main_schet']) => void
}
export const useMainSchet = create<MainSchetStoreType>()(
  persist(
    (set) => ({
      setMainSchet: (payload) => {
        const result = MainSchetStateSchema.safeParse(payload)
        if (result.success) {
          set({
            main_schet: result.data
          })
          return
        }
        set({
          main_schet: undefined
        })
      }
    }),
    {
      name: 'main-schet'
    }
  )
)

export const getMainSchetId = () => {
  return useMainSchet.getState().main_schet?.id
}
export const getMainSchetBudgetId = () => {
  return useMainSchet.getState().main_schet?.budget_id
}
