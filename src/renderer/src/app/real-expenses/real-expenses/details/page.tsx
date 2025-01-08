import { FileDown, Save } from 'lucide-react'
import { calculateColumnTotals, calculateRowTotals, transformData } from './utils'
import { getRealExpenseById, getRealExpenseInfo, realExpensesService } from '../service'
import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'

import { Button } from '@renderer/common/components/ui/button'
import { DetailsView } from '@renderer/common/views'
import { MonthPicker } from '@renderer/common/components/month-picker'
import { RealExpenses } from '@renderer/common/models'
import { ReportTable } from '../report-table'
import { expensesQueryKeys } from '../config'
import { formatDate } from '@renderer/common/lib/date'
import { toast } from '@renderer/common/hooks'
import { useLayout } from '@renderer/common/features/layout'
import { useQueryDateParams } from '@renderer/common/lib/query-params'
import { useRequisitesStore } from '@renderer/common/features/requisites'

const ExpensesDetailsPage = () => {
  const budjet_id = useRequisitesStore((store) => store.budjet_id)
  const navigate = useNavigate()
  const params = useParams()

  const [values, setValues] = useState<RealExpenses.ReportPreviewProvodka[]>()
  const [date, setDate] = useState(formatDate(new Date()))
  const [year, month] = date.split('-')

  const dateParams = useQueryDateParams('date')

  const { data: reportInfo, isFetching: isFetchingInfo } = useQuery({
    queryKey: [
      getRealExpenseInfo,
      {
        year: Number(year),
        month: Number(month),
        budjet_id
      }
    ],
    queryFn: getRealExpenseInfo,
    enabled: !!budjet_id && params.id === 'create'
  })

  const { data: mainbook, isFetching } = useQuery({
    queryKey: [
      expensesQueryKeys.getById,
      1000,
      {
        budjet_id,
        year: dateParams.year,
        month: dateParams.month
      }
    ],
    queryFn: getRealExpenseById,
    enabled: !!budjet_id && params.id !== 'create' && !!dateParams.year && !!dateParams.month
  })

  const { mutate: createMainbook, isPending: isCreating } = useMutation({
    mutationFn: realExpensesService.create,
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
  const { mutate: updateMainbook, isPending: isUpdating } = useMutation({
    mutationFn: realExpensesService.update,
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
    mutationFn: getRealExpenseInfo,
    onSuccess: (response) => {
      toast({
        title: 'Информация успешно загружена'
      })
      setValues(response?.data?.type_documents ?? [])
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

  const rows = useMemo(() => {
    if (!values) {
      return []
    }
    const rows = transformData(values).sort((a, b) => a.smeta_number.localeCompare(b.smeta_number))

    rows.push(calculateColumnTotals(rows))

    return calculateRowTotals(rows)
  }, [values])

  useEffect(() => {
    setValues(reportInfo?.data?.type_documents ?? mainbook?.data?.types ?? [])
  }, [reportInfo?.data, mainbook?.data])

  useEffect(() => {
    const data = mainbook?.data
    if (!data) {
      return
    }

    setDate(`${data.year}-${data.month}-01`)
  }, [mainbook?.data])

  return (
    <DetailsView>
      <div className="flex gap-10 p-5 border-b">
        <MonthPicker
          disabled={params.id !== 'create'}
          value={date}
          onChange={setDate}
          className="disabled:opacity-85"
        />
      </div>
      <div className="relative w-full flex-1 overflow-hidden">
        <ReportTable
          isLoading={isFetching || isFetchingInfo || isPending}
          data={rows}
          onDelete={() => {}}
          onEdit={() => {}}
        />
      </div>

      <div className="p-5 border-t flex items-center gap-2">
        <Button
          type="button"
          disabled={isCreating || isUpdating || isPending || !budjet_id || !month || !year}
          onClick={() => {
            if (params.id === 'create') {
              createMainbook({
                month: Number(month),
                year: Number(year)
              })
            } else {
              updateMainbook({
                month: dateParams.month,
                year: dateParams.year
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
                  getRealExpenseInfo,
                  {
                    year: Number(year),
                    month: Number(month),
                    budjet_id
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

export default ExpensesDetailsPage
