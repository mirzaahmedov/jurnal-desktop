import { formatDate, getFirstDayOfMonth, getLastDayOfMonth } from '@/common/lib/date'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type DefaultFiltersState = {
  from: string
  to: string
}
type DefaultFiltersStore = DefaultFiltersState & {
  setDefaultFilters: (filters: Partial<DefaultFiltersState>) => void
}

const useDefaultFilters = create<DefaultFiltersStore>()(
  persist(
    (set) => ({
      from: formatDate(getFirstDayOfMonth()),
      to: formatDate(getLastDayOfMonth()),
      setDefaultFilters: (filters) => {
        set(filters)
      }
    }),
    {
      name: 'default-filters'
    }
  )
)

type DefaultFormFieldsState = {
  rukovoditel: string
  glav_buxgalter: string
}
type DefaultFormFieldsStore = DefaultFormFieldsState & {
  setDefaultFormFields: (fields: Partial<DefaultFormFieldsState>) => void
}

const useDefaultFormFields = create<DefaultFormFieldsStore>()(
  persist(
    (set) => ({
      rukovoditel: '',
      glav_buxgalter: '',
      setDefaultFormFields: (fields) => {
        set(fields)
      }
    }),
    {
      name: 'default-form-fields'
    }
  )
)

export { useDefaultFilters, useDefaultFormFields }
