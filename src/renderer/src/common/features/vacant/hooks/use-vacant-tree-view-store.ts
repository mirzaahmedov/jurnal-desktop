import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export const useVacantTreeViewStore = create(
  persist<{
    nodesState: Record<number, boolean>
    toggleNodeState: (id: number) => void
    setNodeState: (id: number, state: boolean) => void
    setNodeStates: (nodesState: Record<number, boolean>) => void
    resetNodeStates: VoidFunction
  }>(
    (set) => ({
      nodesState: {} as Record<number, boolean>,
      toggleNodeState: (id: number) =>
        set((state) => ({
          nodesState: {
            ...state.nodesState,
            [id]: !state.nodesState[id]
          }
        })),
      setNodeState: (id: number, state: boolean) =>
        set((prev) => ({
          nodesState: {
            ...prev.nodesState,
            [id]: state
          }
        })),
      setNodeStates: (nodesState: Record<number, boolean>) => set({ nodesState }),
      resetNodeStates: () => set({ nodesState: {} })
    }),
    {
      name: 'vacant-tree-view-state',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)
