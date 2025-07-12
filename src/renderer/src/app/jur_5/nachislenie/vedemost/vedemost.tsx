import { useMemo, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { Allotment } from 'allotment'

import { NachislenieService } from '@/app/jur_5/nachislenie/nachislenie/service'
import { VacantTree, type VacantTreeNode } from '@/app/region-admin/vacant/vacant-tree'
import { GenericTable, LoadingOverlay } from '@/common/components'
import { VacantService } from '@/common/features/vacant/service'
import { arrayToTreeByRelations } from '@/common/lib/tree/relation-tree'

import { VedemostColumnDefs } from './columns'

export const Vedemosts = () => {
  const [selectedVacant, setSelectedVacant] = useState<VacantTreeNode | null>(null)

  const { data: vacants, isFetching: isFetchingVacants } = useQuery({
    queryKey: [VacantService.QueryKeys.GetAll, { page: 1, limit: 100000000000000 }],
    queryFn: VacantService.getAll
  })
  const { data: vedemost, isFetching: isFetchingVedemost } = useQuery({
    queryKey: [
      NachislenieService.QueryKeys.GetByVacantId,
      {
        vacantId: selectedVacant?.id ?? 0
      }
    ],
    queryFn: NachislenieService.getByVacantId,
    enabled: !!selectedVacant
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
    <Allotment className="h-full">
      <Allotment.Pane
        preferredSize={300}
        maxSize={600}
        minSize={200}
        className="w-full"
      >
        <div className="relative overflow-auto scrollbar h-full">
          {isFetchingVacants ? <LoadingOverlay /> : null}
          <VacantTree
            nodes={treeNodes}
            selectedIds={selectedVacant ? [selectedVacant.id] : []}
            onSelectNode={setSelectedVacant}
          />
        </div>
      </Allotment.Pane>
      <Allotment.Pane>
        <div className="relative w-full overflow-auto scrollbar">
          {isFetchingVedemost ? <LoadingOverlay /> : null}
          <GenericTable
            data={vedemost?.data ?? []}
            columnDefs={VedemostColumnDefs}
            className="table-generic-xs"
          />
        </div>
      </Allotment.Pane>
    </Allotment>
  )
}
