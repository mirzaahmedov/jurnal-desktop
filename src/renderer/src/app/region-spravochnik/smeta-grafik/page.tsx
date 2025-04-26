import type { SmetaGrafik } from '@/common/models'

import { useEffect } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { SquareActivity } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { Button } from '@/common/components/jolly/button'
import { useConfirm } from '@/common/features/confirm'
import { useSearchFilter } from '@/common/features/filters/search/search-filter-debounced'
import { useRequisitesStore } from '@/common/features/requisites'
import { usePagination } from '@/common/hooks'
import { useToggle } from '@/common/hooks/use-toggle'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { SmetaTable } from './components'
import { SmetaGrafikQueryKeys } from './config'
import { SmetaGrafikFilters, useYearFilter } from './filters'
import { SmetaGrafikService } from './service'

const SmetaGrafikPage = () => {
  const pagination = usePagination()
  const queryClient = useQueryClient()
  const dialogToggle = useToggle()
  const navigate = useNavigate()
  const setLayout = useLayout()

  const [search] = useSearchFilter()
  const [year] = useYearFilter()

  const { main_schet_id, budjet_id } = useRequisitesStore()
  const { confirm } = useConfirm()
  const { t } = useTranslation(['app'])

  const { data: grafiks, isFetching } = useQuery({
    queryKey: [
      SmetaGrafikQueryKeys.getAll,
      {
        ...pagination,
        search,
        year,
        budjet_id,
        main_schet_id
      }
    ],
    queryFn: SmetaGrafikService.getAll,
    enabled: !!budjet_id && !!main_schet_id
  })
  const { mutate: deleteGrafik, isPending } = useMutation({
    mutationKey: [SmetaGrafikQueryKeys.delete],
    mutationFn: SmetaGrafikService.delete,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [SmetaGrafikQueryKeys.getAll]
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
        deleteGrafik(row.id)
      }
    })
  }

  useEffect(() => {
    setLayout({
      title: t('pages.smeta_grafik'),
      breadcrumbs: [
        {
          title: t('pages.spravochnik')
        }
      ],
      content: SmetaGrafikFilters,
      onCreate: () => {
        navigate('create')
      }
    })
  }, [setLayout, t, dialogToggle.open, navigate])

  return (
    <ListView>
      <ListView.Header className="flex items-center justify-end">
        <Button
          variant="ghost"
          onPress={() => {
            navigate('monitor/old')
          }}
        >
          <SquareActivity className="btn-icon icon-start" />
          {t('old_smeta_grafiks')}
        </Button>
      </ListView.Header>
      <ListView.Content
        loading={false}
        className="relative w-full flex-1"
      >
        <SmetaTable
          isLoading={isFetching || isPending}
          data={grafiks?.data ?? []}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </ListView.Content>
      <ListView.Footer className="flex items-center justify-between">
        <ListView.Pagination
          {...pagination}
          count={grafiks?.meta?.count ?? 0}
          pageCount={grafiks?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default SmetaGrafikPage
