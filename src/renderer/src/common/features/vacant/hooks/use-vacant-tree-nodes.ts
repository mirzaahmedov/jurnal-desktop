import { useEffect, useMemo, useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import { useRequisitesStore } from '@/common/features/requisites'
import { VacantService } from '@/common/features/vacant/service'
import {
  arrayToTreeByRelations,
  flattenTree,
  searchTreeNodes
} from '@/common/lib/tree/relation-tree'

import { useVacantTreeState } from './use-vacant-tree-state'

export const useVacantTreeNodes = (selectedBudjetId?: number) => {
  const budjetId = useRequisitesStore((store) => store.budjet_id)
  const [search, setSearch] = useState('')

  const vacantsQuery = useQuery({
    queryKey: [
      VacantService.QueryKeys.GetAll,
      {
        page: 1,
        limit: 100000000000000,
        spId: selectedBudjetId ?? budjetId!
      }
    ],
    queryFn: VacantService.getAll,
    enabled: !!budjetId
  })

  const treeNodes = useMemo(
    () =>
      arrayToTreeByRelations({
        array: vacantsQuery?.data?.data ?? [],
        getId: (node) => node.id,
        getParentId: (node) => node.parentId
      }),
    [vacantsQuery?.data]
  )

  const flatNodes = useMemo(() => {
    return flattenTree(treeNodes)
  }, [treeNodes])
  const filteredTreeNodes = useMemo(() => {
    return search ? searchTreeNodes(treeNodes, search, (item) => item.name) : treeNodes
  }, [search, treeNodes])
  const flatFilteredNodes = useMemo(() => {
    return flattenTree(filteredTreeNodes)
  }, [search, filteredTreeNodes])

  const { unfoldAll } = useVacantTreeState({ treeNodes: filteredTreeNodes })

  useEffect(() => {
    if (search) {
      unfoldAll()
    }
  }, [search, filteredTreeNodes, unfoldAll])

  return {
    search,
    setSearch,
    treeNodes,
    flatNodes,
    filteredTreeNodes,
    flatFilteredNodes,
    vacantsQuery
  }
}
