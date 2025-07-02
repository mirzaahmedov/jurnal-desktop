import type { Vacant } from '@/common/models/vacant'

import { useMemo } from 'react'

import { useQuery } from '@tanstack/react-query'

import { vacantQueryKeys } from '@/app/region-admin/vacant/config'
import { getVacantListQuery } from '@/app/region-admin/vacant/service'
import { VacantTree } from '@/app/region-admin/vacant/vacant-tree'
import { LoadingOverlay } from '@/common/components'
import { useAuthenticationStore } from '@/common/features/auth'
import { type RelationTreeNode, arrayToTreeByRelations } from '@/common/lib/tree/relation-tree'

export interface VacantsProps {
  selected: RelationTreeNode<Vacant, number | null> | undefined
  onSelect: (vacant: RelationTreeNode<Vacant, number | null>) => void
}
export const Vacants = ({ selected, onSelect: setSelected }: VacantsProps) => {
  const userOwnId = useAuthenticationStore((store) => store.user?.id)

  const { data: vacants, isFetching: isFetchingVacants } = useQuery({
    queryKey: [vacantQueryKeys.getAll, { userId: userOwnId! }],
    queryFn: getVacantListQuery,
    enabled: !!userOwnId
  })

  const treeNodes = useMemo(
    () =>
      arrayToTreeByRelations({
        array: vacants?.data ?? [],
        getId: (node) => node.id,
        getParentId: (node) => node.parentId
      }),
    [vacants]
  )

  return (
    <>
      {isFetchingVacants ? <LoadingOverlay /> : null}
      <VacantTree
        nodes={treeNodes}
        selectedIds={selected ? [selected.id] : []}
        onSelectNode={(vacant) => {
          setSelected(vacant)
        }}
      />
    </>
  )
}
