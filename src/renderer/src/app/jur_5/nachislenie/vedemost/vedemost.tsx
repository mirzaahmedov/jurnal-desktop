import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { Allotment } from 'allotment'

import { NachislenieService } from '@/app/jur_5/nachislenie/nachislenie/service'
import { GenericTable, LoadingOverlay } from '@/common/components'
import { useRequisitesStore } from '@/common/features/requisites'
import { useVacantTreeNodes } from '@/common/features/vacant/hooks/use-vacant-tree-nodes'
import {
  VacantTree,
  type VacantTreeNode,
  VacantTreeSearch
} from '@/common/features/vacant/ui/vacant-tree'
import { usePagination } from '@/common/hooks'

import { VedemostColumnDefs } from './columns'

export const Vedemosts = () => {
  const pagination = usePagination()

  const [selectedVacant, setSelectedVacant] = useState<VacantTreeNode | null>(null)

  const { budjet_id } = useRequisitesStore()
  const { filteredTreeNodes, search, setSearch, vacantsQuery } = useVacantTreeNodes()
  const { data: vedemost, isFetching: isFetchingVedemost } = useQuery({
    queryKey: [
      NachislenieService.QueryKeys.GetByVacantId,
      {
        page: pagination.page,
        limit: pagination.limit,
        vacantId: selectedVacant?.id ?? 0,
        budjet_name_id: budjet_id!
      }
    ],
    queryFn: NachislenieService.getByVacantId,
    enabled: !!selectedVacant
  })

  return (
    <Allotment className="h-full">
      <Allotment.Pane
        preferredSize={300}
        maxSize={600}
        minSize={300}
        className="w-full bg-gray-50"
      >
        <div className="relative h-full flex flex-col">
          {vacantsQuery.isFetching ? <LoadingOverlay /> : null}
          <VacantTreeSearch
            search={search}
            onValueChange={setSearch}
            treeNodes={filteredTreeNodes}
          />
          <div className="flex-1 overflow-auto scrollbar">
            <VacantTree
              nodes={filteredTreeNodes}
              selectedIds={selectedVacant ? [selectedVacant.id] : []}
              onSelectNode={setSelectedVacant}
            />
          </div>
        </div>
      </Allotment.Pane>
      <Allotment.Pane>
        <div className="relative w-full overflow-auto scrollbar pl-px">
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
