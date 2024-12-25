import { adminMainBookService, adminMainBookUpdateQuery } from '../service'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { AdminMainbookDetails } from '@renderer/common/models'
import { Button } from '@renderer/common/components/ui/button'
import { DetailsView } from '@renderer/common/views'
import { ReportTable } from '../report-table'
import { queryKeys } from '../config'
import { transformData } from './utils'
import { useConfirm } from '@renderer/common/features/confirm'
import { useLayout } from '@renderer/common/features/layout'
import { useMemo } from 'react'

const AdminMainBookDetailsPage = () => {
  const navigate = useNavigate()
  const params = useParams()
  const [searchParams] = useSearchParams()

  const { confirm } = useConfirm()

  const { data: report, isFetching } = useQuery({
    queryKey: [
      queryKeys.getById,
      Number(params.id),
      {
        region_id: searchParams.get('region_id')
      }
    ],
    queryFn: adminMainBookService.getById
  })
  const { mutate: updateReport, isPending } = useMutation({
    mutationFn: adminMainBookUpdateQuery,
    onSuccess: () => {
      navigate(-1)
    }
  })

  const transformed = useMemo(() => {
    if (!report?.data) {
      return []
    }

    return transformData(report?.data as unknown as AdminMainbookDetails)
  }, [report?.data])

  const handleAccept = () => {
    confirm({
      title: 'Принять отчёт?',
      onConfirm: () => {
        updateReport({
          id: Number(params.id),
          status: 2,
          region_id: Number(searchParams.get('region_id'))
        })
      }
    })
  }

  const handleReject = () => {
    confirm({
      title: 'Отклонить отчёт?',
      onConfirm: () => {
        updateReport({
          id: Number(params.id),
          status: 3,
          region_id: Number(searchParams.get('region_id'))
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
        <Button onClick={handleAccept}>Принять</Button>
        <Button
          variant="destructive"
          onClick={handleReject}
        >
          Отказ
        </Button>
      </div>
    </DetailsView>
  )
}

export default AdminMainBookDetailsPage
