import type { MainSchet } from '@/common/models'

import { useEffect, useState } from 'react'

import { usePagination } from '@renderer/common/hooks'
import { ListView } from '@renderer/common/views'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useLayoutStore } from '@/common/features/layout'
import { SearchField, useSearch } from '@/common/features/search'
import { useToggle } from '@/common/hooks/use-toggle'

import { mainSchetColumns } from './columns'
import { mainSchetQueryKeys } from './constants'
import { MainSchetDialog } from './dialog'
import { mainSchetService } from './service'

const MainSchetPage = () => {
  const [selected, setSelected] = useState<MainSchet | null>(null)

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()
  const { search } = useSearch()

  const dialogToggle = useToggle()
  const pagination = usePagination()
  const queryClient = useQueryClient()

  const setLayout = useLayoutStore((store) => store.setLayout)

  const { data: mainSchets, isFetching } = useQuery({
    queryKey: [
      mainSchetQueryKeys.getAll,
      {
        ...pagination,
        search
      }
    ],
    queryFn: mainSchetService.getAll
  })
  const { mutate: deleteMutation, isPending } = useMutation({
    mutationKey: [mainSchetQueryKeys.delete],
    mutationFn: mainSchetService.delete,
    onSuccess() {
      toast.success(t('delete_success'))
      queryClient.invalidateQueries({
        queryKey: [mainSchetQueryKeys.getAll]
      })
    },
    onError() {
      toast.error(t('delete_failed'))
    }
  })

  useEffect(() => {
    if (!dialogToggle.isOpen) {
      setSelected(null)
    }
  }, [dialogToggle.isOpen])
  useEffect(() => {
    setLayout({
      title: t('pages.main-schet'),
      breadcrumbs: [
        {
          title: t('pages.spravochnik')
        }
      ],
      content: SearchField,
      onCreate: dialogToggle.open
    })
  }, [setLayout, t, dialogToggle.open])

  const handleClickEdit = (row: MainSchet) => {
    setSelected(row)
    dialogToggle.open()
  }
  const handleClickDelete = (row: MainSchet) => {
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
          data={mainSchets?.data ?? []}
          columnDefs={mainSchetColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={mainSchets?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
      <MainSchetDialog
        selected={selected}
        open={dialogToggle.isOpen}
        onChangeOpen={dialogToggle.setOpen}
        original={mainSchets?.data?.[0] ?? undefined}
      />
    </ListView>
  )
}

export default MainSchetPage
