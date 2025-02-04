import type { Bank } from '@/common/models'

import { useState } from 'react'

import { usePagination } from '@renderer/common/hooks'
import { ListView } from '@renderer/common/views'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useLayout } from '@/common/features/layout'
import { useToggle } from '@/common/hooks/use-toggle'

import { bankColumns } from './columns'
import { bankQueryKeys } from './config'
import { BankDialog } from './dialog'
import { bankService } from './service'

const BankPage = () => {
  const [selected, setSelected] = useState<Bank>()

  const dialogToggle = useToggle()
  const queryClient = useQueryClient()
  const pagination = usePagination()

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const { data: podpisList, isFetching } = useQuery({
    queryKey: [
      bankQueryKeys.getAll,
      {
        ...pagination
      }
    ],
    queryFn: bankService.getAll
  })
  const { mutate: deletePodpis, isPending } = useMutation({
    mutationKey: [bankQueryKeys.delete],
    mutationFn: bankService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [bankQueryKeys.getAll]
      })
    }
  })

  const handleClickEdit = (data: Bank) => {
    setSelected(data)
    dialogToggle.setOpen(true)
  }
  const handleClickDelete = (data: Bank) => {
    confirm({
      title: 'Удаление подписи',
      onConfirm() {
        deletePodpis(data.id)
      }
    })
  }

  const openDialog = dialogToggle.open
  useLayout({
    title: t('pages.bank'),
    onCreate() {
      openDialog()
    }
  })

  return (
    <ListView>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          data={podpisList?.data ?? []}
          columnDefs={bankColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={podpisList?.meta.pageCount ?? 0}
        />
      </ListView.Footer>
      <BankDialog
        data={selected}
        open={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
      />
    </ListView>
  )
}

export default BankPage
