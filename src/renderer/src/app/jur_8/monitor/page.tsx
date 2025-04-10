import type { JUR8Monitor } from '@/common/models'

import { useEffect } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useRequisitesStore } from '@/common/features/requisites'
import { usePagination } from '@/common/hooks'
import { useLayoutStore } from '@/common/layout/store'
import { ListView } from '@/common/views'

import { JUR8MonitorColumns } from './columns'
import { JUR8MonitorQueryKeys } from './config'
import { JUR8MonitorFilters, useYearFilter } from './filters'
import { JUR8MonitorService } from './service'

const JUR8MonitorPage = () => {
  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const [year] = useYearFilter()

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const pagination = usePagination()
  const budjet_id = useRequisitesStore((store) => store.budjet_id)
  const setLayout = useLayoutStore((store) => store.setLayout)

  const { data: monitoring, isFetching } = useQuery({
    queryKey: [
      JUR8MonitorQueryKeys.getAll,
      {
        ...pagination,
        year,
        budjet_id
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
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={monitoring?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default JUR8MonitorPage
