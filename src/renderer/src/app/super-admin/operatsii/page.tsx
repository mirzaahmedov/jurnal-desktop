import type { Operatsii } from '@/common/models'

import { useEffect, useState } from 'react'

import { usePagination } from '@renderer/common/hooks'
import { ListView } from '@renderer/common/views'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useLayout } from '@/common/features/layout'
import { useSearch } from '@/common/features/search'
import { useToggle } from '@/common/hooks/use-toggle'

import { operatsiiColumns } from './columns'
import { operatsiiQueryKeys } from './constants'
import { OperatsiiDialog } from './dialog'
import { OperatsiiFilter, useOperatsiiFilters } from './filter'
import { operatsiiService } from './service'

const OperatsiiPage = () => {
  const [selected, setSelected] = useState<Operatsii | null>(null)

  const toggle = useToggle()
  const queryClient = useQueryClient()
  const pagination = usePagination()

  const { t } = useTranslation(['app'])
  const { filters } = useOperatsiiFilters()
  const { confirm } = useConfirm()
  const { search } = useSearch()

  const { data: operations, isFetching } = useQuery({
    queryKey: [
      operatsiiQueryKeys.getAll,
      {
        ...pagination,
        type_schet: filters.type_schet,
        search
      },
      filters.type_schet
    ],
    queryFn: operatsiiService.getAll
  })
  const { mutate: deleteMutation, isPending } = useMutation({
    mutationKey: [operatsiiQueryKeys.delete],
    mutationFn: operatsiiService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [operatsiiQueryKeys.getAll]
      })
    }
  })

  useEffect(() => {
    if (!toggle.isOpen) {
      setSelected(null)
    }
  }, [toggle.isOpen])
  useLayout({
    title: t('pages.operatsii'),
    content: OperatsiiFilter,
    onCreate: toggle.open
  })

  const handleClickEdit = (row: Operatsii) => {
    setSelected(row)
    toggle.open()
  }
  const handleClickDelete = (row: Operatsii) => {
    confirm({
      onConfirm() {
        deleteMutation(row.id)
      }
    })
  }

  return (
    <ListView>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          data={operations?.data ?? []}
          columnDefs={operatsiiColumns}
          getRowId={(row) => row.id}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={operations?.meta.pageCount ?? 0}
        />
      </ListView.Footer>
      <OperatsiiDialog
        data={selected}
        open={toggle.isOpen}
        onChangeOpen={toggle.setOpen}
      />
    </ListView>
  )
}

export default OperatsiiPage
