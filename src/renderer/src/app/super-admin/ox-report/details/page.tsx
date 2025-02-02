import { useMemo } from 'react'

import { Button } from '@renderer/common/components/ui/button'
import { useConfirm } from '@renderer/common/features/confirm'
import { useLayout } from '@renderer/common/features/layout'
import { toast } from '@renderer/common/hooks'
import {
  useQueryBudjetId,
  useQueryDateParams,
  useQueryRegionId
} from '@renderer/common/lib/query-params'
import { OX } from '@renderer/common/models'
import { DetailsView } from '@renderer/common/views'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { queryKeys } from '../config'
import { ReportTable } from '../report-table'
import { adminOXService, adminOXUpdateQuery } from '../service'

const AdminOXDetailsPage = () => {
  const navigate = useNavigate()

  const { year, month } = useQueryDateParams('date')
  const { region_id } = useQueryRegionId()
  const { budjet_id } = useQueryBudjetId()

  const { confirm } = useConfirm()

  const { data: report, isFetching } = useQuery({
    queryKey: [
      queryKeys.getById,
      1000,
      {
        region_id,
        budjet_id,
        month,
        year
      }
    ],
    queryFn: adminOXService.getById,
    enabled: !!region_id && !!year && !!month && !!budjet_id
  })
  const { mutate: updateReport, isPending } = useMutation({
    mutationFn: adminOXUpdateQuery,
    onSuccess: () => {
      toast({
        title: 'Отчёт успешно обновлён'
      })
      navigate(-1)
    },
    onError: (error) => {
      console.error(error)
      toast({
        variant: 'destructive',
        title: error.message
      })
    }
  })

  const values = useMemo(() => {
    if (!report?.data) {
      return []
    }

    const data = report?.data as unknown as OX.AdminReportDetails
    return data?.smeta_grafiks
  }, [report?.data])

  const handleAccept = () => {
    confirm({
      title: 'Принять отчёт?',
      onConfirm: () => {
        updateReport({
          status: 2,
          year,
          month,
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
        updateReport({
          status: 3,
          year,
          month,
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
          data={values}
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

export default AdminOXDetailsPage
