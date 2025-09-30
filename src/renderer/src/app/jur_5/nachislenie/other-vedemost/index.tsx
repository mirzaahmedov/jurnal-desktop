import type { OtherVedemost } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GenericTable, LoadingOverlay } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useRequisitesStore } from '@/common/features/requisites'
import { usePagination, useToggle } from '@/common/hooks'
import { useLayout } from '@/common/layout'

import { NachislenieTabs } from '../nachislenie-tabs'
import { NachislenieOthersColumnDefs } from './columns'
import { PremyaMatPomoshCreateDialog } from './components/other-vedemost-create'
import { OtherVedemostViewDialog } from './components/other-vedemost-view'
import { OtherVedemostService } from './service'

export const PremyaMatPomosh = () => {
  const editToggle = useToggle()
  const createToggle = useToggle()
  const pagination = usePagination()
  const queryClient = useQueryClient()
  const setLayout = useLayout()

  const [selectedPremya, setSelectedPremya] = useState<OtherVedemost | undefined>(undefined)

  const { t } = useTranslation(['app'])
  const { budjet_id } = useRequisitesStore()
  const { confirm } = useConfirm()

  const { data: nachislenieOthers, isFetching: isFetchingNachislenieOthers } = useQuery({
    queryKey: [
      OtherVedemostService.QueryKeys.GetAll,
      {
        page: pagination.page,
        limit: pagination.limit,
        budjet_name_id: budjet_id!
      }
    ],
    queryFn: OtherVedemostService.getAll
  })
  const deleteMutation = useMutation({
    mutationFn: OtherVedemostService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [OtherVedemostService.QueryKeys.GetAll]
      })
    }
  })

  useEffect(() => {
    setLayout({
      title: t('other_vedemost'),
      breadcrumbs: [
        {
          title: t('pages.zarplata')
        }
      ],
      content: NachislenieTabs,
      onCreate: createToggle.open
    })
  }, [t, setLayout, createToggle.open])

  const handleDelete = (row: OtherVedemost) => {
    confirm({
      onConfirm: () => deleteMutation.mutate(row.id)
    })
  }
  const handleEdit = (row: OtherVedemost) => {
    setSelectedPremya(row)
    editToggle.open()
  }

  return (
    <div className="relative w-full overflow-auto scrollbar pl-px">
      {isFetchingNachislenieOthers ? <LoadingOverlay /> : null}
      <GenericTable
        data={nachislenieOthers?.data ?? []}
        columnDefs={NachislenieOthersColumnDefs}
        onDelete={handleDelete}
        onEdit={handleEdit}
        className="table-generic-xs"
      />
      <PremyaMatPomoshCreateDialog
        isOpen={createToggle.isOpen}
        onOpenChange={createToggle.setOpen}
      />
      <OtherVedemostViewDialog
        isOpen={editToggle.isOpen}
        onOpenChange={editToggle.setOpen}
        selectedVedemost={selectedPremya}
      />
    </div>
  )
}
