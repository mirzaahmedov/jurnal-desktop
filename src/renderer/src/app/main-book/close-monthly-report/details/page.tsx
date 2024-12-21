import { CloseMonthlyReportFormSchema, closeMonthlyReportQueryKeys, defaultValues } from '../config'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Button } from '@renderer/common/components/ui/button'
import { CircleArrowDown } from 'lucide-react'
import { DetailsView } from '@renderer/common/views'
import { Form } from '@renderer/common/components/ui/form'
import { FormElement } from '@renderer/common/components/form'
import { MonthPicker } from '@renderer/common/components/month-picker'
import { ReportTable } from '../report-table'
import { closeMonthlyReportService } from '../service'
import { mockCloseMonthlyReportDetails } from './data'
import { useForm } from 'react-hook-form'
import { useLayout } from '@renderer/common/features/layout'
import { useQuery } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'

const CloseMonthlyReportDetailsPage = () => {
  const [date, setDate] = useState('')

  const navigate = useNavigate()
  const params = useParams()

  const form = useForm({
    defaultValues,
    resolver: zodResolver(CloseMonthlyReportFormSchema)
  })

  const { data: createMontlyReport } = useQuery({
    queryKey: [closeMonthlyReportQueryKeys.getById, params.id],
    queryFn: () => closeMonthlyReportService.getById(Number(params.id)),
    enabled: params.id !== 'create'
  })

  useLayout({
    title: params.id === 'create' ? 'Создать месячный отчет' : 'Редактировать месячный отчет',
    onBack: () => {
      navigate(-1)
    }
  })

  useEffect(() => {
    form.reset(createMontlyReport?.data ?? defaultValues)
  }, [createMontlyReport])

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
      <div className="relative w-full overflow-hidden">
        <ReportTable
          isLoading={false}
          data={mockCloseMonthlyReportDetails}
          onDelete={() => {}}
          onEdit={() => {}}
        />
      </div>
      <DetailsView.Footer>
        <DetailsView.Create />
      </DetailsView.Footer>
    </DetailsView>
  )
}

export default CloseMonthlyReportDetailsPage
