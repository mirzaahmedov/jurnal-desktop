import type { RealExpenses } from '@renderer/common/models'

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
import { DetailsView } from '@renderer/common/views'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { queryKeys } from '../config'
import { ReportTable } from '../report-table'
import { adminRealExpenseUpdateQuery, adminRealExpensesService } from '../service'
import { calculateColumnTotals, calculateRowTotals, transformData } from './utils'

const AdminRealExpenseDetailsPage = () => {
  const navigate = useNavigate()

  const { year, month } = useQueryDateParams('date')
  const { region_id } = useQueryRegionId()
  const { budjet_id } = useQueryBudjetId()

  const { t } = useTranslation(['app'])
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
    queryFn: adminRealExpensesService.getById,
    enabled: !!region_id && !!year && !!month && !!budjet_id
  })
  const { mutate: updateReport, isPending } = useMutation({
    mutationFn: adminRealExpenseUpdateQuery,
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

  const transformed = useMemo(() => {
    if (!report?.data) {
      return []
    }

    const data = report?.data as unknown as RealExpenses.AdminReportDetails
    if (!data?.types) {
      return []
    }
    const rows = transformData(data?.types).sort((a, b) =>
      a.smeta_number?.localeCompare(b.smeta_number)
    )

    rows.push(calculateColumnTotals(rows))

    return calculateRowTotals(rows)
  }, [report?.data])

  const handleAccept = () => {
    confirm({
      title: t('accept_report'),
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
      title: t('reject_report'),
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
    title: t('pages.real-expenses'),
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
          {t('accept')}
        </Button>
        <Button
          variant="destructive"
          disabled={isPending}
          onClick={handleReject}
        >
          {t('reject')}
        </Button>
      </div>
    </DetailsView>
  )
}

export default AdminRealExpenseDetailsPage
