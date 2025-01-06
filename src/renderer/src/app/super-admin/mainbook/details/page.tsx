import { adminMainBookService, adminMainBookUpdateQuery } from '../service'
import { calculateColumnTotals, calculateRowTotals, transformData } from './utils'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { Button } from '@renderer/common/components/ui/button'
import { DetailsView } from '@renderer/common/views'
import { Mainbook } from '@renderer/common/models'
import { ReportTable } from '../report-table'
import { queryKeys } from '../config'
import { useConfirm } from '@renderer/common/features/confirm'
import { useLayout } from '@renderer/common/features/layout'
import { useMemo } from 'react'

const AdminMainBookDetailsPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const { confirm } = useConfirm()

  const [year, month] = searchParams.get('date')?.split('-')?.map(Number) ?? [0, 0]
  const { data: report, isFetching } = useQuery({
    queryKey: [
      queryKeys.getById,
      1000,
      {
        region_id: searchParams.get('region_id'),
        budjet_id: searchParams.get('budjet_id'),
        year: Number(year),
        month: Number(month)
      }
    ],
    queryFn: adminMainBookService.getById,
    enabled: !!searchParams.get('region_id') && !!searchParams.get('budjet_id') && !!year && !!month
  })
  const { mutate: updateReport, isPending } = useMutation({
    mutationFn: adminMainBookUpdateQuery,
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
        updateReport({
          status: 2,
          month: Number(month),
          year: Number(year),
          region_id: Number(searchParams.get('region_id')),
          budjet_id: Number(searchParams.get('budjet_id'))
        })
      }
    })
  }

  const handleReject = () => {
    confirm({
      title: 'Отклонить отчёт?',
      onConfirm: () => {
        updateReport({
          status: 3,
          month: Number(month),
          year: Number(year),
          region_id: Number(searchParams.get('region_id')),
          budjet_id: Number(searchParams.get('budjet_id'))
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

export default AdminMainBookDetailsPage
