import { useEffect, useState } from 'react'

import { useSearch } from '@renderer/common/features/search/use-search'
import { usePagination } from '@renderer/common/hooks'
import { useLocationState } from '@renderer/common/hooks/use-location-state'
import { ListView } from '@renderer/common/views'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useLayout } from '@/common/features/layout'
import { useToggle } from '@/common/hooks/use-toggle'
import { type Operatsii, TypeSchetOperatsii } from '@/common/models'

import { operatsiiColumns } from './columns'
import { operatsiiQueryKeys } from './config'
import { OperatsiiDialog } from './dialog'
import { OperatsiiFilter } from './filter'
import { operatsiiService } from './service'

const OperatsiiPage = () => {
  const [selected, setSelected] = useState<Operatsii | null>(null)

  const dialogToggle = useToggle()
  const queryClient = useQueryClient()
  const pagination = usePagination()

  const [typeSchet] = useLocationState('type_schet', TypeSchetOperatsii.ALL)

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()
  const { search } = useSearch()

  const { data: operations, isFetching } = useQuery({
    queryKey: [
      operatsiiQueryKeys.getAll,
      {
        ...pagination,
        type_schet: typeSchet,
        search
      },
      typeSchet
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
    if (!dialogToggle.isOpen) {
      setSelected(null)
    }
  }, [dialogToggle.isOpen])
  useLayout({
    title: t('pages.operatsii'),
    content: OperatsiiFilter,
    onCreate: dialogToggle.open
  })

  const handleClickEdit = (row: Operatsii) => {
    setSelected(row)
    dialogToggle.open()
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
          pageCount={operations?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
      <OperatsiiDialog
        data={selected}
        open={dialogToggle.isOpen}
        onChangeOpen={dialogToggle.setOpen}
      />
    </ListView>
  )
}

export default OperatsiiPage
