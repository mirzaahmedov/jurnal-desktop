import type { TypeOperatsii } from '@/common/models'

import { useEffect, useState } from 'react'

import { usePagination } from '@renderer/common/hooks'
import { ListView } from '@renderer/common/views'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useLayoutStore } from '@/common/features/layout'
import { SearchField, useSearch } from '@/common/features/search'
import { useToggle } from '@/common/hooks/use-toggle'

import { typeOperatsiiColumns } from './columns'
import { typeOperatsiiQueryKeys } from './constants'
import { TypeOperatsiiDialog } from './dialog'
import { typeOperatsiiService } from './service'

const TypeOperatsiiPage = () => {
  const [selected, setSelected] = useState<TypeOperatsii | null>(null)

  const dialogToggle = useToggle()
  const pagination = usePagination()
  const queryClient = useQueryClient()
  const setLayout = useLayoutStore((store) => store.setLayout)

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()
  const { search } = useSearch()

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
    onSuccess() {
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
      content: SearchField,
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
          pageCount={operationTypes?.meta.pageCount ?? 0}
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
