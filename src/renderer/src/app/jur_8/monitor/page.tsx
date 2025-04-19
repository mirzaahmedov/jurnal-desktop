import type { JUR8Monitor } from '@/common/models'

import { useEffect } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { FooterCell, FooterRow, GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useRequisitesStore } from '@/common/features/requisites'
import { usePagination } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { formatNumber } from '@/common/lib/format'
import { ListView } from '@/common/views'

import { JUR8MonitorColumns } from './columns'
import { JUR8MonitorQueryKeys } from './config'
import { JUR8MonitorFilters, useYearFilter } from './filters'
import { JUR8MonitorService } from './service'

const JUR8MonitorPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const pagination = usePagination()
  const setLayout = useLayout()

  const [year] = useYearFilter()

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()
  const { budjet_id, main_schet_id } = useRequisitesStore()

  const { data: monitoring, isFetching } = useQuery({
    queryKey: [
      JUR8MonitorQueryKeys.getAll,
      {
        ...pagination,
        year,
        budjet_id,
        main_schet_id
      }
    ],
    queryFn: JUR8MonitorService.getAll
  })
  const { mutate: deleteMonitor, isPending } = useMutation({
    mutationKey: [JUR8MonitorQueryKeys.delete],
    mutationFn: JUR8MonitorService.delete,
    onSuccess: (res) => {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [JUR8MonitorQueryKeys.getAll]
      })
    }
  })

  useEffect(() => {
    setLayout({
      title: t('pages.monitoring'),
      breadcrumbs: [
        {
          title: t('pages.jur8')
        }
      ],
      content: JUR8MonitorFilters,
      onCreate: () => {
        navigate('create')
      }
    })
  }, [setLayout, navigate, t])

  const handleEdit = (row: JUR8Monitor) => {
    navigate(`${row.id}`)
  }
  const handleDelete = (row: JUR8Monitor) => {
    confirm({
      onConfirm: () => {
        deleteMonitor(row.id)
      }
    })
  }

  return (
    <ListView>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          columnDefs={JUR8MonitorColumns}
          data={monitoring?.data ?? []}
          onEdit={handleEdit}
          onDelete={handleDelete}
          footer={
            <FooterRow>
              <FooterCell
                colSpan={4}
                title={t('total')}
                content={formatNumber(monitoring?.meta?.summa ?? 0)}
              />
            </FooterRow>
          }
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          count={monitoring?.meta?.count ?? 0}
          pageCount={monitoring?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default JUR8MonitorPage
