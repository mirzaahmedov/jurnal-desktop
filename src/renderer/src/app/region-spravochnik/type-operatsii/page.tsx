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

import { TypeOperatsiiColumns } from './columns'
import { TypeOperatsiiQueryKeys } from './config'
import { TypeOperatsiiDialog } from './dialog'
import { TypeOperatsiiService } from './service'

const TypeOperatsiiPage = () => {
  const dialogToggle = useToggle()
  const pagination = usePagination()
  const queryClient = useQueryClient()
  const setLayout = useLayout()

  const [search] = useSearchFilter()
  const [selected, setSelected] = useState<TypeOperatsii | null>(null)

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const { data: typeOperatsii, isFetching } = useQuery({
    queryKey: [
      TypeOperatsiiQueryKeys.getAll,
      {
        ...pagination,
        search
      }
    ],
    queryFn: TypeOperatsiiService.getAll
  })
  const { mutate: deleteTypeOperatsii, isPending } = useMutation({
    mutationKey: [TypeOperatsiiQueryKeys.delete],
    mutationFn: TypeOperatsiiService.delete,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [TypeOperatsiiQueryKeys.getAll]
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
        deleteTypeOperatsii(row.id)
      }
    })
  }

  return (
    <ListView>
      <ListView.Content isLoading={isFetching || isPending}>
        <GenericTable
          data={typeOperatsii?.data ?? []}
          columnDefs={TypeOperatsiiColumns}
          getRowId={(row) => row.id}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          count={typeOperatsii?.meta?.count ?? 0}
          pageCount={typeOperatsii?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
      <TypeOperatsiiDialog
        selected={selected}
        isOpen={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
      />
    </ListView>
  )
}

export default TypeOperatsiiPage
