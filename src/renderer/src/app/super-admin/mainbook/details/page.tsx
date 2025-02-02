import { useMemo } from 'react'

import { Button } from '@renderer/common/components/ui/button'
import { useConfirm } from '@renderer/common/features/confirm'
import { useLayout } from '@renderer/common/features/layout'
import {
  useQueryBudjetId,
  useQueryDateParams,
  useQueryRegionId
} from '@renderer/common/lib/query-params'
import { Mainbook } from '@renderer/common/models'
import { DetailsView } from '@renderer/common/views'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { queryKeys } from '../config'
import { ReportTable } from '../report-table'
import { adminMainbookService, adminMainbookUpdateQuery } from '../service'
import { calculateColumnTotals, calculateRowTotals, transformData } from './utils'

const AdminMainbookDetailsPage = () => {
  const navigate = useNavigate()

  const { budjet_id } = useQueryBudjetId()
  const { region_id } = useQueryRegionId()
  const { month, year } = useQueryDateParams('date')

  const { confirm } = useConfirm()

  const { data: report, isFetching } = useQuery({
    queryKey: [
      queryKeys.getById,
      1000,
      {
        region_id,
        budjet_id,
        year,
        month
      }
    ],
    queryFn: adminMainbookService.getById,
    enabled: !!region_id && !!budjet_id && !!year && !!month
  })
  const { mutate: updateReport, isPending } = useMutation({
    mutationFn: adminMainbookUpdateQuery,
    onSuccess: () => {
      navigate(-1)
    }
  })

  const transformed = useMemo(() => {
    const data = (report?.data as unknown as Mainbook.AdminReportDetails) || {}
    if (!data?.types) {
      return []
    }
    const rows = transformData(data?.types).sort((a, b) =>
      a.schet.padStart(3, '0').localeCompare(b.schet.padStart(3, '0'))
    )

    rows.push(calculateColumnTotals(rows))

    return calculateRowTotals(rows)
  }, [report?.data])

  const handleAccept = () => {
    confirm({
      title: 'Принять отчёт?',
      onConfirm: () => {
        if (!region_id || !budjet_id) {
          return
        }
        updateReport({
          status: 2,
          month,
          year,
          region_id,
          budjet_id
        })
      }
    })
  }

  const handleReject = () => {
    confirm({
      title: 'Отклонить отчёт?',
      onConfirm: () => {
        if (!region_id || !budjet_id) {
          return
        }
        updateReport({
          status: 3,
          month,
          year,
          region_id,
          budjet_id
        })
      }
    })
  }

  useLayout({
    title: 'Детали отчёта',
    onBack: () => {
      navigate(-1)
    }
  })

  return (
    <DetailsView>
      <div className="w-full relative overflow-x-hidden">
        <ReportTable
          isLoading={isFetching}
          data={transformed}
          onDelete={() => {}}
          onEdit={() => {}}
        />
      </div>
      <div className="p-5 flex justify-between border-t">
        <Button
          disabled={isPending}
          onClick={handleAccept}
        >
          Принять
        </Button>
        <Button
          variant="destructive"
          disabled={isPending}
          onClick={handleReject}
        >
          Отказ
        </Button>
      </div>
    </DetailsView>
  )
}

export default AdminMainbookDetailsPage
