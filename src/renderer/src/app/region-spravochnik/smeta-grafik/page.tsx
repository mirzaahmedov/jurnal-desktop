import type { SmetaGrafik } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { useConfirm } from '@/common/features/confirm'
import { SearchFilterDebounced } from '@/common/features/filters/search/search-filter-debounced'
import { useSearchFilter } from '@/common/features/filters/search/search-filter-debounced'
import { useRequisitesStore } from '@/common/features/requisites'
import { usePagination } from '@/common/hooks'
import { useToggle } from '@/common/hooks/use-toggle'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { SmetaTable } from './components'
import { smetaGrafikQueryKeys } from './constants'
import { SmetaGrafikDialog } from './dialog'
import { smetaGrafikService } from './service'

const SmetaGrafikPage = () => {
  const pagination = usePagination()
  const queryClient = useQueryClient()
  const dialogToggle = useToggle()

  const setLayout = useLayout()

  const [selected, setSelected] = useState<null | SmetaGrafik>(null)

  const { main_schet_id, budjet_id } = useRequisitesStore()
  const { confirm } = useConfirm()
  const [search] = useSearchFilter()
  const { t } = useTranslation(['app'])

  const { data: smetaGrafikList, isFetching } = useQuery({
    queryKey: [
      smetaGrafikQueryKeys.getAll,
      {
        ...pagination,
        search,
        budjet_id,
        main_schet_id
      }
    ],
    queryFn: smetaGrafikService.getAll,
    enabled: !!budjet_id && !!main_schet_id
  })
  const { mutate: deleteSmetaGrafik, isPending } = useMutation({
    mutationKey: [smetaGrafikQueryKeys.delete],
    mutationFn: smetaGrafikService.delete,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [smetaGrafikQueryKeys.getAll]
      })
    }
  })

  const handleClickEdit = (row: SmetaGrafik) => {
    setSelected(row)
    dialogToggle.open()
  }
  const handleClickDelete = (row: SmetaGrafik) => {
    confirm({
      onConfirm() {
        deleteSmetaGrafik(row.id)
      }
    })
  }

  useEffect(() => {
    setLayout({
      title: t('pages.smeta-grafik'),
      breadcrumbs: [
        {
          title: t('pages.spravochnik')
        }
      ],
      content: SearchFilterDebounced,
      onCreate: () => {
        setSelected(null)
        dialogToggle.open()
      }
    })
  }, [setLayout, t])

  return (
    <ListView>
      <ListView.Content
        loading={false}
        className="relative w-full flex-1"
      >
        <SmetaTable
          isLoading={isFetching || isPending}
          data={smetaGrafikList?.data ?? []}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={smetaGrafikList?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
      <SmetaGrafikDialog
        selected={selected}
        open={dialogToggle.isOpen}
        onClose={dialogToggle.close}
      />
    </ListView>
  )
}

export default SmetaGrafikPage
