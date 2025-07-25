import { useMemo } from 'react'

import { useQuery } from '@tanstack/react-query'

import { VacantService } from '@/common/features/vacant/service'
import { arrayToTreeByRelations, flattenTree } from '@/common/lib/tree/relation-tree'

export const useVacantTreeNodes = () => {
  const vacantsQuery = useQuery({
    queryKey: [VacantService.QueryKeys.GetAll, { page: 1, limit: 100000000000000 }],
    queryFn: VacantService.getAll
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

  return {
    treeNodes,
    flatNodes,
    vacantsQuery
  }
}
