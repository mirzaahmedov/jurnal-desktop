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
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { BankColumns } from './columns'
import { BankQueryKeys } from './config'
import { BankDialog } from './dialog'
import { BankService } from './service'

const BankPage = () => {
  const setLayout = useLayout()
  const dialogToggle = useToggle()
  const queryClient = useQueryClient()
  const pagination = usePagination()

  const [selected, setSelected] = useState<Bank>()
  const [search] = useSearchFilter()

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const { data: banks, isFetching } = useQuery({
    queryKey: [
      BankQueryKeys.getAll,
      {
        search,
        ...pagination
      }
    ],
    queryFn: BankService.getAll
  })
  const { mutate: deleteBank, isPending } = useMutation({
    mutationKey: [BankQueryKeys.delete],
    mutationFn: BankService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [BankQueryKeys.getAll]
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
        deleteBank(data.id)
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
      <ListView.Content isLoading={isFetching || isPending}>
        <GenericTable
          data={banks?.data ?? []}
          columnDefs={BankColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          count={banks?.meta?.count ?? 0}
          pageCount={banks?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
      <BankDialog
        selected={selected}
        isOpen={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
      />
    </ListView>
  )
}

export default BankPage
