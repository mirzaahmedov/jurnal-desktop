import type { Nachislenie, NachislenieSostav } from '@/common/models'

import { useMemo, useState } from 'react'

import { useMutation, useQuery } from '@tanstack/react-query'
import { Allotment } from 'allotment'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { VacantTree, type VacantTreeNode } from '@/app/region-admin/vacant/vacant-tree'
import { GenericTable, LoadingOverlay } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { VacantService } from '@/common/features/vacant/service'
import { useToggle } from '@/common/hooks'
import { queryClient } from '@/common/lib/query-client'
import { arrayToTreeByRelations } from '@/common/lib/tree/relation-tree'

import { NachislenieColumns, NachislenieSostavColumns } from './columns'
import { NachislenieService, NachislenieSostavService } from './service'

export const Nachislenies = () => {
  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const [selectedVacant, setSelectedVacant] = useState<VacantTreeNode | null>(null)
  const [selectedSostav, setSelectedSostav] = useState<NachislenieSostav | undefined>()
  const [, setSelectedNachislenie] = useState<Nachislenie | undefined>()

  const editDialogToggle = useToggle()

  const { data: vacants, isFetching: isFetchingVacants } = useQuery({
    queryKey: [VacantService.QueryKeys.GetAll, { page: 1, limit: 100000000000000 }],
    queryFn: VacantService.getAll
  })
  const { data: nachislenie, isFetching: isFetchingNachislenie } = useQuery({
    queryKey: [
      NachislenieService.QueryKeys.GetByVacantId,
      {
        vacantId: selectedVacant?.id ?? 0
      }
    ],
    queryFn: NachislenieService.getByVacantId,
    enabled: !!selectedVacant
  })
  const { data: sostav, isFetching: isFetchingSostav } = useQuery({
    queryKey: [
      NachislenieSostavService.QueryKeys.GetByVacantId,
      {
        vacantId: selectedVacant?.id ?? 0
      }
    ],
    queryFn: NachislenieSostavService.getByVacantId,
    enabled: !!selectedVacant
  })

  const { mutate: deleteNachislenie, isPending: isDeleting } = useMutation({
    mutationFn: NachislenieService.delete,
    onSuccess: () => {
      toast.success(t('delete_success'))
      queryClient.invalidateQueries({
        queryKey: [NachislenieService.QueryKeys.GetByVacantId]
      })
    },
    onError: (res: { message: string }) => {
      toast.error(res.message ?? t('delete_failed'))
    }
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

  const handleRowEdit = (row: Nachislenie) => {
    setSelectedNachislenie(row)
    editDialogToggle.open()
  }
  const handleRowDelete = (row: Nachislenie) => {
    confirm({
      onConfirm: () => {
        deleteNachislenie(row.id)
      }
    })
  }

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
        <div className="h-full flex flex-col overflow-hidden pl-1">
          <div className="flex-1 relative w-full overflow-auto scrollbar">
            {isFetchingSostav || isDeleting ? <LoadingOverlay /> : null}
            <GenericTable
              data={sostav?.data ?? []}
              columnDefs={NachislenieSostavColumns}
              selectedIds={selectedSostav ? [selectedSostav.id] : []}
              onClickRow={(value) => setSelectedSostav(value)}
              className="table-generic-xs"
            />
          </div>
          <div className="flex-[2] relative w-full overflow-auto scrollbar">
            {isFetchingNachislenie || isDeleting ? <LoadingOverlay /> : null}
            <GenericTable
              data={nachislenie?.data ?? []}
              columnDefs={NachislenieColumns}
              onEdit={handleRowEdit}
              onDelete={handleRowDelete}
              className="table-generic-xs"
            />
          </div>
        </div>
      </Allotment.Pane>
    </Allotment>
  )
}
