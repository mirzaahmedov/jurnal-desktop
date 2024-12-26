import { FileDown, Save } from 'lucide-react'
import {
  completeMonthlyReportService,
  getCompleteMonthlyReportById,
  getCompleteMonthlyReportInfo
} from '../service'
import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'

import { Button } from '@renderer/common/components/ui/button'
import { CompleteMonthlyReportProvodkaData } from '@renderer/common/models'
import { DetailsView } from '@renderer/common/views'
import { MonthPicker } from '@renderer/common/components/month-picker'
import { ReportTable } from '../report-table'
import { completeMonthlyReportQueryKeys } from '../config'
import { formatDate } from '@renderer/common/lib/date'
import { toast } from '@renderer/common/hooks'
import { transformData } from './utils'
import { useLayout } from '@renderer/common/features/layout'
import { useMainSchet } from '@renderer/common/features/main-schet'

const CompleteMonthlyReportDetailsPage = () => {
  const main_schet = useMainSchet((store) => store.main_schet)
  const navigate = useNavigate()
  const params = useParams()

  const [values, setValues] = useState<CompleteMonthlyReportProvodkaData[]>()
  const [date, setDate] = useState(formatDate(new Date()))
  const [year, month] = date.split('-')

  const { data: reportInfo, isFetching: isFetchingInfo } = useQuery({
    queryKey: [
      getCompleteMonthlyReportInfo,
      {
        year: Number(year),
        month: Number(month),
        budjet_id: main_schet?.budget_id
      }
    ],
    queryFn: getCompleteMonthlyReportInfo,
    enabled: !!main_schet?.budget_id && params.id === 'create'
  })

  const { data: report, isFetching } = useQuery({
    queryKey: [
      completeMonthlyReportQueryKeys.getById,
      Number(params.id),
      { budjet_id: main_schet?.budget_id }
    ],
    queryFn: getCompleteMonthlyReportById,
    enabled: !!main_schet?.budget_id && params.id !== 'create'
  })

  const { mutate: createReport, isPending: isCreating } = useMutation({
    mutationFn: completeMonthlyReportService.create,
    onError: (error) => {
      console.error(error)
      toast({
        variant: 'destructive',
        title: error.message
      })
    },
    onSuccess: () => {
      navigate(-1)
      toast({
        title: 'Месячный отчет успешно отправлен'
      })
    }
  })
  const { mutate: updateReport, isPending: isUpdating } = useMutation({
    mutationFn: completeMonthlyReportService.update,
    onError: (error) => {
      console.error(error)
      toast({
        variant: 'destructive',
        title: error.message
      })
    },
    onSuccess: () => {
      navigate(-1)
      toast({
        title: 'Месячный отчет успешно отправлен'
      })
    }
  })
  const { mutate: loadInfo, isPending } = useMutation({
    mutationFn: getCompleteMonthlyReportInfo,
    onSuccess: (response) => {
      toast({
        title: 'Информация успешно загружена'
      })
      setValues(response?.data ?? [])
    },
    onError: (error) => {
      console.error(error)
      toast({
        variant: 'destructive',
        title: error.message
      })
    }
  })

  useLayout({
    title: params.id === 'create' ? 'Создать месячный отчет' : 'Редактировать месячный отчет',
    onBack: () => {
      navigate(-1)
    }
  })

  const transformed = useMemo(() => {
    if (!values) {
      return []
    }

    return transformData(values).sort((a, b) => a.schet.localeCompare(b.schet))
  }, [values])

  useEffect(() => {
    setValues(reportInfo?.data ?? report?.data?.data ?? [])
  }, [reportInfo?.data, report?.data])

  useEffect(() => {
    const data = report?.data
    if (!data) {
      return
    }

    setDate(`${data.year}-${data.month}-01`)
  }, [report?.data])

  return (
    <DetailsView>
      <div className="flex gap-10 p-5 border-b">
        <MonthPicker
          disabled={params.id !== 'create'}
          value={date}
          onChange={setDate}
          className="disabled:opacity-100"
        />
      </div>
      <div className="relative w-full overflow-x-hidden">
        <ReportTable
          isLoading={isFetching || isFetchingInfo || isPending}
          data={transformed}
          onDelete={() => {}}
          onEdit={() => {}}
        />
      </div>

      <div className="p-5 border-t flex items-center gap-2">
        <Button
          type="button"
          disabled={isCreating || isUpdating || isPending || !main_schet || !month || !year}
          onClick={() => {
            if (params.id === 'create') {
              createReport({
                data: values,
                month: Number(month),
                year: Number(year)
              })
            } else {
              updateReport({
                id: Number(params.id),
                data: values,
                month: Number(month),
                year: Number(year)
              })
            }
          }}
        >
          <Save className="btn-icon icon-start" /> Сохранить
        </Button>
        {params.id !== 'create' ? (
          <Button
            disabled={isPending}
            variant="outline"
            onClick={() => {
              loadInfo({
                queryKey: [
                  getCompleteMonthlyReportInfo,
                  {
                    year: Number(year),
                    month: Number(month),
                    budjet_id: main_schet?.budget_id
                  }
                ]
              } as any)
            }}
          >
            <FileDown className="btn-icon icon-start" /> Загрузить обновления
          </Button>
        ) : null}
      </div>
    </DetailsView>
  )
}

export default CompleteMonthlyReportDetailsPage
