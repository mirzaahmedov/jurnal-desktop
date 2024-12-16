import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type DefaultFiltersState = {
  operatsiiId: number
}
type DefaultFiltersStore = DefaultFiltersState & {
  setOperatsiiId: (id: number) => void
}

const useFiltersStore = create(
  persist<DefaultFiltersStore>(
    (set) => ({
      operatsiiId: 0,
      setOperatsiiId: (id: number) => set({ operatsiiId: id })
    }),
    {
      name: 'filters/org-monitor'
    }
  )
)

export { useFiltersStore }
