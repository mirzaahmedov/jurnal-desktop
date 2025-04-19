import type { TypeOperatsii } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { SearchFilterDebounced } from '@/common/features/filters/search/search-filter-debounced'
import { useSearchFilter } from '@/common/features/filters/search/search-filter-debounced'
import { usePagination } from '@/common/hooks'
import { useToggle } from '@/common/hooks/use-toggle'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { typeOperatsiiColumns } from './columns'
import { typeOperatsiiQueryKeys } from './config'
import { TypeOperatsiiDialog } from './dialog'
import { typeOperatsiiService } from './service'

const TypeOperatsiiPage = () => {
  const [selected, setSelected] = useState<TypeOperatsii | null>(null)

  const dialogToggle = useToggle()
  const pagination = usePagination()
  const queryClient = useQueryClient()

  const setLayout = useLayout()

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()
  const [search] = useSearchFilter()

  const { data: operationTypes, isFetching } = useQuery({
    queryKey: [
      typeOperatsiiQueryKeys.getAll,
      {
        ...pagination,
        search
      }
    ],
    queryFn: typeOperatsiiService.getAll
  })
  const { mutate: deleteMutation, isPending } = useMutation({
    mutationKey: [typeOperatsiiQueryKeys.delete],
    mutationFn: typeOperatsiiService.delete,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [typeOperatsiiQueryKeys.getAll]
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
      title: t('pages.type-operatsii'),
      breadcrumbs: [
        {
          title: t('pages.spravochnik')
        }
      ],
      content: SearchFilterDebounced,
      onCreate: dialogToggle.open
    })
  }, [setLayout, t, dialogToggle.open])

  const handleClickEdit = (row: TypeOperatsii) => {
    setSelected(row)
    dialogToggle.open()
  }
  const handleClickDelete = (row: TypeOperatsii) => {
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
          data={operationTypes?.data ?? []}
          columnDefs={typeOperatsiiColumns}
          getRowId={(row) => row.id}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={operationTypes?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
      <TypeOperatsiiDialog
        selected={selected}
        open={dialogToggle.isOpen}
        onChangeOpen={dialogToggle.setOpen}
      />
    </ListView>
  )
}

export default TypeOperatsiiPage
