import type { VacantTreeNode } from '../ui/vacant-tree'

import { useCallback } from 'react'

import { useVacantTreeViewStore } from './use-vacant-tree-view-store'

export interface UseVacantTreeState {
  treeNodes: VacantTreeNode[]
}
export const useVacantTreeState = ({ treeNodes }: UseVacantTreeState) => {
  const { setNodeStates } = useVacantTreeViewStore()

  const foldAll = useCallback(() => {
    setNodeStates({})
  }, [setNodeStates])
  const unfoldAll = useCallback(() => {
    const newStates = {} as Record<number, boolean>
    const walk = (nodes: VacantTreeNode[]) => {
      nodes.forEach((node) => {
        newStates[node.id] = true
        if (node.children.length) {
          walk(node.children)
        }
      })
    }
    walk(treeNodes)
    setNodeStates(newStates)
  }, [setNodeStates, treeNodes])

  return {
    foldAll,
    unfoldAll
  }
}
