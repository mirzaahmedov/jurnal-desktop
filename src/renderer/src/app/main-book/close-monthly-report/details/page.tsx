import { CloseMonthlyReportFormSchema, closeMonthlyReportQueryKeys, defaultValues } from '../config'
import {
  createCloseMonthlyReport,
  getCloseMonthlyReportInfo,
  updateCloseMonthlyReport
} from '../service'
import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'

import { Button } from '@renderer/common/components/ui/button'
import { CircleArrowDown } from 'lucide-react'
import { DetailsView } from '@renderer/common/views'
import { Form } from '@renderer/common/components/ui/form'
import { FormElement } from '@renderer/common/components/form'
import { LoadingOverlay } from '@renderer/common/components'
import { MonthPicker } from '@renderer/common/components/month-picker'
import { ReportTable } from '../report-table'
import { toast } from '@renderer/common/hooks'
import { transformData } from './utils'
import { useForm } from 'react-hook-form'
import { useLayout } from '@renderer/common/features/layout'
import { useMainSchet } from '@renderer/common/features/main-schet'
import { zodResolver } from '@hookform/resolvers/zod'

const CloseMonthlyReportDetailsPage = () => {
  const main_schet_id = useMainSchet((store) => store.main_schet?.id)
  const navigate = useNavigate()
  const params = useParams()

  const defaultDate =
    params.month === 'create'
      ? new Date().toISOString().slice(0, 10)
      : new Date(`${params.year}-${params.month}-01`).toISOString().slice(0, 10)

  console.log({ defaultDate })

  const [date, setDate] = useState(defaultDate)
  const [year, month] = date.split('-')

  const form = useForm({
    defaultValues: {
      ...defaultValues,
      month: Number(month),
      year: Number(year)
    },
    resolver: zodResolver(CloseMonthlyReportFormSchema)
  })

  const { data: closeMonthlyReport, isFetching } = useQuery({
    queryKey: [
      closeMonthlyReportQueryKeys.getById,
      {
        year: Number(year),
        month: Number(month),
        main_schet_id: main_schet_id!
      }
    ],
    queryFn: getCloseMonthlyReportInfo
  })
  const { mutate: create, isPending: isCreating } = useMutation({
    mutationFn: createCloseMonthlyReport,
    onError: (error) => {
      console.error(error)
      toast({
        variant: 'destructive',
        title: 'Ошибка при сохранении месячного отчета'
      })
    },
    onSuccess: () => {
      navigate(-1)
      toast({
        title: 'Месячный отчет успешно отправлен'
      })
    }
  })
  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationFn: updateCloseMonthlyReport,
    onError: (error) => {
      console.error(error)
      toast({
        variant: 'destructive',
        title: 'Ошибка при сохранении месячного отчета'
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
    title: params.month === 'create' ? 'Создать месячный отчет' : 'Редактировать месячный отчет',
    onBack: () => {
      navigate(-1)
    }
  })

  const transformed = useMemo(() => {
    if (!closeMonthlyReport?.data) {
      return []
    }

    return transformData(closeMonthlyReport.data)
  }, [closeMonthlyReport?.data])

  return (
    <DetailsView>
      <Form {...form}>
        <div className="flex gap-10 p-5 border-b">
          <FormElement label="Период">
            <MonthPicker
              value={date}
              onChange={setDate}
            />
          </FormElement>
          <div>
            <Button type="button">
              <CircleArrowDown className="btn-icon icon-start" />
              Загрузить
            </Button>
          </div>
        </div>
      </Form>
      <div className="relative w-full overflow-x-hidden">
        {isFetching && <LoadingOverlay />}
        <ReportTable
          isLoading={false}
          data={transformed}
          onDelete={() => {}}
          onEdit={() => {}}
        />
      </div>
      <div className="p-5 border-t">
        <Button
          type="button"
          disabled={
            isCreating ||
            isUpdating ||
            !main_schet_id ||
            !closeMonthlyReport?.data ||
            !month ||
            !year
          }
          onClick={() => {
            if (params.month === 'create') {
              create({
                main_schet_id: main_schet_id!,
                data: closeMonthlyReport!.data!,
                month: Number(month),
                year: Number(year)
              })
            } else {
              update({
                main_schet_id: main_schet_id!,
                data: closeMonthlyReport!.data!,
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

export default CloseMonthlyReportDetailsPage
