import type { Position } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { usePagination } from '@/common/hooks'
import { useToggle } from '@/common/hooks/use-toggle'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { PositionColumns } from './columns'
import { PositionQueryKeys } from './config'
import { PositionDialog } from './dialog'
import { PositionService } from './service'

const PositionPage = () => {
  const setLayout = useLayout()
  const dialogToggle = useToggle()
  const queryClient = useQueryClient()
  const pagination = usePagination()

  const [selected, setSelected] = useState<Position | null>(null)

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const { data: positions, isFetching } = useQuery({
    queryKey: [
      PositionQueryKeys.getAll,
      {
        page: pagination.page,
        limit: pagination.limit
      }
    ],
    queryFn: PositionService.getAll
  })

  const { mutate: deletePosition, isPending: isDeleting } = useMutation({
    mutationKey: [PositionQueryKeys.delete],
    mutationFn: PositionService.delete,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [PositionQueryKeys.getAll]
      })
    }
  })

  useEffect(() => {
    if (!dialogToggle.isOpen) {
      setSelected(null)
    }
  }, [dialogToggle.isOpen])
  useEffect(() => {
    setLayout({
      title: t('pages.position'),
      onCreate: dialogToggle.open
    })
  }, [setLayout, dialogToggle.open, t])

  const handleClickEdit = (row: Position) => {
    setSelected(row)
    dialogToggle.open()
  }
  const handleClickDelete = (row: Position) => {
    confirm({
      onConfirm() {
        deletePosition(row.id)
      }
    })
  }

  return (
    <ListView>
      <ListView.Content isLoading={isFetching || isDeleting}>
        <GenericTable
          data={positions?.data ?? []}
          columnDefs={PositionColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </ListView.Content>
      <PositionDialog
        selected={selected}
        isOpen={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
      />
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={positions?.meta?.pageCount ?? 0}
          count={positions?.meta?.count ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default PositionPage
