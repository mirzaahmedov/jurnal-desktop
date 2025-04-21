import type { SmetaGrafik } from '@/common/models'

import { useEffect } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
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
import { smetaGrafikQueryKeys } from './config'
import { SmetaGrafikService } from './service'

const SmetaGrafikPage = () => {
  const pagination = usePagination()
  const queryClient = useQueryClient()
  const dialogToggle = useToggle()
  const navigate = useNavigate()
  const setLayout = useLayout()

  const [search] = useSearchFilter()

  const { main_schet_id, budjet_id } = useRequisitesStore()
  const { confirm } = useConfirm()
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
    queryFn: SmetaGrafikService.getAll,
    enabled: !!budjet_id && !!main_schet_id
  })
  const { mutate: deleteSmetaGrafik, isPending } = useMutation({
    mutationKey: [smetaGrafikQueryKeys.delete],
    mutationFn: SmetaGrafikService.delete,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [smetaGrafikQueryKeys.getAll]
      })
    }
  })

  const handleClickEdit = (row: SmetaGrafik) => {
    navigate(`${row.id}`)
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
        navigate('create')
      }
    })
  }, [setLayout, t, dialogToggle.open, navigate])

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
          count={smetaGrafikList?.meta?.count ?? 0}
          pageCount={smetaGrafikList?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default SmetaGrafikPage
