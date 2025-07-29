import type { NachislenieOthers } from '@/common/models'

import { useEffect } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GenericTable, LoadingOverlay } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useRequisitesStore } from '@/common/features/requisites'
import { usePagination, useToggle } from '@/common/hooks'
import { useLayout } from '@/common/layout'

import { NachislenieTabs } from '../nachislenie-tabs'
import { NachislenieOthersColumnDefs } from './columns'
import { PremyaMatPomoshCreateDialog } from './components/premya-create-dialog'
import { NachislenieOthersService } from './service'

export const PremyaMatPomosh = () => {
  const createToggle = useToggle()
  const pagination = usePagination()
  const queryClient = useQueryClient()
  const setLayout = useLayout()

  const { t } = useTranslation(['app'])
  const { budjet_id } = useRequisitesStore()
  const { confirm } = useConfirm()

  const { data: nachislenieOthers, isFetching: isFetchingNachislenieOthers } = useQuery({
    queryKey: [
      NachislenieOthersService.QueryKeys.GetAll,
      {
        page: pagination.page,
        limit: pagination.limit,
        budjet_name_id: budjet_id!
      }
    ],
    queryFn: NachislenieOthersService.getAll
  })
  const deleteMutation = useMutation({
    mutationFn: NachislenieOthersService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [NachislenieOthersService.QueryKeys.GetAll]
      })
    }
  })

  useEffect(() => {
    setLayout({
      title: t('nachislenie'),
      breadcrumbs: [
        {
          title: t('pages.zarplata')
        }
      ],
      content: NachislenieTabs,
      onCreate: createToggle.open
    })
  }, [t, setLayout, createToggle.open])

  const handleDelete = (row: NachislenieOthers) => {
    confirm({
      onConfirm: () => deleteMutation.mutate(row.id)
    })
  }

  return (
    <div className="relative w-full overflow-auto scrollbar pl-px">
      {isFetchingNachislenieOthers ? <LoadingOverlay /> : null}
      <GenericTable
        data={nachislenieOthers?.data ?? []}
        columnDefs={NachislenieOthersColumnDefs}
        onDelete={handleDelete}
        className="table-generic-xs"
      />
      <PremyaMatPomoshCreateDialog
        isOpen={createToggle.isOpen}
        onOpenChange={createToggle.setOpen}
      />
    </div>
  )
}
