import type { Bank } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { SearchFilterDebounced } from '@/common/features/filters/search/search-filter-debounced'
import { useSearchFilter } from '@/common/features/filters/search/search-filter-debounced'
import { usePagination } from '@/common/hooks'
import { useToggle } from '@/common/hooks/use-toggle'
import { useLayoutStore } from '@/common/layout/store'
import { ListView } from '@/common/views'

import { bankColumns } from './columns'
import { bankQueryKeys } from './config'
import { BankDialog } from './dialog'
import { bankService } from './service'

const BankPage = () => {
  const [selected, setSelected] = useState<Bank>()

  const setLayout = useLayoutStore((store) => store.setLayout)

  const dialogToggle = useToggle()
  const queryClient = useQueryClient()
  const pagination = usePagination()

  const { t } = useTranslation(['app'])
  const [search] = useSearchFilter()
  const { confirm } = useConfirm()

  const { data: podpisList, isFetching } = useQuery({
    queryKey: [
      bankQueryKeys.getAll,
      {
        search,
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

  useEffect(() => {
    setLayout({
      title: t('pages.bank'),
      content: SearchFilterDebounced,
      onCreate() {
        dialogToggle.open()
      }
    })
  }, [t, dialogToggle])

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
          pageCount={podpisList?.meta?.pageCount ?? 0}
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
