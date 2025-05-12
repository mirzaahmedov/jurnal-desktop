import type { SmetaGrafik } from '@/common/models'

import { useEffect } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Eye } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { GenericTable } from '@/common/components'
import { Button } from '@/common/components/jolly/button'
import { useConfirm } from '@/common/features/confirm'
import { useSearchFilter } from '@/common/features/filters/search/search-filter-debounced'
import { useRequisitesStore } from '@/common/features/requisites'
import { usePagination } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { SmetaGrafikColumns } from './columns'
import { SmetaGrafikQueryKeys } from './config'
import { SmetaGrafikFilters, useYearFilter } from './filters'
import { SmetaGrafikService } from './service'

const SmetaGrafikPage = () => {
  const pagination = usePagination()
  const queryClient = useQueryClient()
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
    navigate(`${row.id}?year=${row.year}&editable=true`)
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
  }, [setLayout, t, navigate])

  return (
    <ListView>
      <ListView.Content
        loading={isFetching || isPending}
        className="relative w-full flex-1"
      >
        <GenericTable
          data={grafiks?.data ?? []}
          columnDefs={SmetaGrafikColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
          getRowDeletable={(row) => row.isdeleted}
          getRowEditable={(row) => row.isdeleted}
          actions={(row) =>
            !row.isdeleted ? (
              <Button
                variant="ghost"
                size="icon"
                onPress={() => {
                  navigate(`${row.id}?year=${row.year}&editable=false`)
                }}
              >
                <Eye className="btn-icon" />
              </Button>
            ) : null
          }
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
