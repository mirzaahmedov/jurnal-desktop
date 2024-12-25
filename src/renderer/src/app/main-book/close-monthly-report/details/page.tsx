import {
  CompleteMonthlyReportFormSchema,
  completeMonthlyReportQueryKeys,
  defaultValues
} from '../config'
import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'

import { Button } from '@renderer/common/components/ui/button'
import { CircleArrowDown } from 'lucide-react'
import { DetailsView } from '@renderer/common/views'
import { Form } from '@renderer/common/components/ui/form'
import { MonthPicker } from '@renderer/common/components/month-picker'
import { ReportTable } from '../report-table'
import { completeMonthlyReportService } from '../service'
import { toast } from '@renderer/common/hooks'
import { transformData } from './utils'
import { useForm } from 'react-hook-form'
import { useLayout } from '@renderer/common/features/layout'
import { useMainSchet } from '@renderer/common/features/main-schet'
import { zodResolver } from '@hookform/resolvers/zod'

const CompleteMonthlyReportDetailsPage = () => {
  const main_schet = useMainSchet((store) => store.main_schet)
  const navigate = useNavigate()
  const params = useParams()

  const defaultDate =
    params.id === 'create'
      ? new Date().toISOString().slice(0, 10)
      : new Date(`${params.year}-${params.month}-01`).toISOString().slice(0, 10)

  const [date, setDate] = useState(defaultDate)
  const [year, month] = date.split('-')

  const form = useForm({
    defaultValues: {
      ...defaultValues,
      month: Number(month),
      year: Number(year)
    },
    resolver: zodResolver(CompleteMonthlyReportFormSchema)
  })

  const { data: reportInfo, isFetching } = useQuery({
    queryKey: [
      completeMonthlyReportQueryKeys.getById,
      1,
      {
        year: Number(year),
        month: Number(month),
        budjet_id: main_schet?.budget_id
      }
    ],
    queryFn: completeMonthlyReportService.getById,
    enabled: !!main_schet?.budget_id && params.id === 'create'
  })

  const { data: report, isFetching } = useQuery({
    queryKey: [
      completeMonthlyReportQueryKeys.getById,
      Number(params.id),
      { budjet_id: main_schet?.budget_id }
    ],
    queryFn: completeMonthlyReportService.getById
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

  useLayout({
    title: params.id === 'create' ? 'Создать месячный отчет' : 'Редактировать месячный отчет',
    onBack: () => {
      navigate(-1)
    }
  })

  const transformed = useMemo(() => {
    if (!reportInfo?.data) {
      return []
    }

    return transformData(reportInfo.data as any)
  }, [reportInfo?.data])

  return (
    <DetailsView>
      <Form {...form}>
        <div className="flex gap-10 p-5 border-b">
          <MonthPicker
            disabled={params.id !== 'create'}
            value={date}
            onChange={setDate}
            className="disabled:opacity-100"
          />
          <div>
            <Button type="button">
              <CircleArrowDown className="btn-icon icon-start" />
              Загрузить
            </Button>
          </div>
        </div>
      </Form>
      <div className="relative w-full overflow-x-hidden">
        <ReportTable
          isLoading={isFetching}
          data={transformed}
          onDelete={() => {}}
          onEdit={() => {}}
        />
      </div>
      <div className="p-5 border-t">
        <Button
          type="button"
          disabled={isCreating || isUpdating || !main_schet || !reportInfo?.data || !month || !year}
          onClick={() => {
            if (params.id === 'create') {
              createReport({
                data: reportInfo!.data!,
                month: Number(month),
                year: Number(year)
              })
            } else {
              updateReport({
                data: reportInfo!.data!,
                month: Number(month),
                year: Number(year)
              })
            }
          }}
        >
          Сохранить
        </Button>
      </div>
    </DetailsView>
  )
}

export default CompleteMonthlyReportDetailsPage
