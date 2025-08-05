import type { VacantTreeNode } from '@/common/features/vacant/ui/vacant-tree'

import { useMemo } from 'react'

export interface UseVacantFiltersOptions<T extends object> {
  selectedItems: T[]
  vacants: VacantTreeNode[]
  getItemVacantId: (item: T) => number
}
export const useVacantFilters = <T extends object>({
  vacants,
  selectedItems,
  getItemVacantId
}: UseVacantFiltersOptions<T>) => {
  const filterOptions = useMemo(() => {
    const vacantIds = new Map<number, number>()
    const vacantNodes: (VacantTreeNode & { _selectedCount: number })[] = []
    selectedItems.forEach((item) => {
      if (!vacantIds.has(getItemVacantId(item))) {
        vacantIds.set(getItemVacantId(item), 0)
      }
      vacantIds.set(getItemVacantId(item), vacantIds.get(getItemVacantId(item))! + 1)
    })
    const walk = (node: VacantTreeNode) => {
      if (vacantIds.has(node.id)) {
        vacantNodes.push({
          ...node,
          _selectedCount: vacantIds.get(node.id) ?? 0
        })
      }
      node.children.forEach(walk)
    }
    vacants.forEach((vacant) => {
      walk(vacant)
    })
    return vacantNodes
  }, [vacants, selectedItems])

  return filterOptions
}
