import type { Sostav } from '@/common/models'

import { useEffect, useState } from 'react'

import { usePagination } from '@renderer/common/hooks'
import { ListView } from '@renderer/common/views'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GenericTable, LoadingOverlay } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useLayoutStore } from '@/common/features/layout'
import { SearchField, useSearch } from '@/common/features/search'
import { useToggle } from '@/common/hooks/use-toggle'

import { sostavColumns } from './columns'
import { sostavQueryKeys } from './constants'
import SostavDialog from './dialog'
import { sostavService } from './service'

const SostavPage = () => {
  const [selected, setSelected] = useState<Sostav | null>(null)

  const toggle = useToggle()
  const pagination = usePagination()
  const queryClient = useQueryClient()
  const setLayout = useLayoutStore((store) => store.setLayout)

  const { confirm } = useConfirm()
  const { search } = useSearch()
  const { t } = useTranslation(['app'])

  const { data: sostavList, isFetching } = useQuery({
    queryKey: [
      sostavQueryKeys.getAll,
      {
        ...pagination,
        search
      }
    ],
    queryFn: sostavService.getAll
  })
  const { mutate: deleteMutation, isPending } = useMutation({
    mutationFn: sostavService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [sostavQueryKeys.getAll]
      })
    }
  })

  useEffect(() => {
    if (!toggle.isOpen) {
      setSelected(null)
    }
  }, [toggle.isOpen])

  useEffect(() => {
    setLayout({
      title: t('pages.sostav'),
      breadcrumbs: [
        {
          title: t('pages.spravochnik')
        }
      ],
      content: SearchField,
      onCreate: toggle.open
    })
  }, [setLayout, t, toggle.open])

  const handleClickEdit = (row: Sostav) => {
    setSelected(row)
    toggle.open()
  }
  const handleClickDelete = (row: Sostav) => {
    confirm({
      onConfirm() {
        deleteMutation(row.id)
      }
    })
  }

  return (
    <ListView>
      <div className="flex-1 relative">
        {isFetching || isPending ? <LoadingOverlay /> : null}
        <GenericTable
          data={sostavList?.data ?? []}
          columnDefs={sostavColumns}
          getRowId={(row) => row.id}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </div>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={sostavList?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
      <SostavDialog
        selected={selected}
        open={toggle.isOpen}
        onChangeOpen={toggle.setOpen}
      />
    </ListView>
  )
}

export default SostavPage
