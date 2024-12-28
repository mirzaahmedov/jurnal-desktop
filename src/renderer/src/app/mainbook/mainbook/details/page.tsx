import { FileDown, Save } from 'lucide-react'
import { calculateColumnTotals, calculateRowTotals, transformData } from './utils'
import { getMainbookById, getMainbookInfo, mainbookService } from '../service'
import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'

import { Button } from '@renderer/common/components/ui/button'
import { DetailsView } from '@renderer/common/views'
import { Mainbook } from '@renderer/common/models'
import { MonthPicker } from '@renderer/common/components/month-picker'
import { ReportTable } from '../report-table'
import { formatDate } from '@renderer/common/lib/date'
import { mainbookQueryKeys } from '../config'
import { toast } from '@renderer/common/hooks'
import { useLayout } from '@renderer/common/features/layout'
import { useRequisitesStore } from '@renderer/common/features/requisites'

const MainbookDetailsPage = () => {
  const budjet_id = useRequisitesStore((store) => store.budjet_id)
  const navigate = useNavigate()
  const params = useParams()

  const [values, setValues] = useState<Mainbook.ReportPreviewProvodka[]>()
  const [date, setDate] = useState(formatDate(new Date()))
  const [year, month] = date.split('-')

  const { data: reportInfo, isFetching: isFetchingInfo } = useQuery({
    queryKey: [
      getMainbookInfo,
      {
        year: Number(year),
        month: Number(month),
        budjet_id
      }
    ],
    queryFn: getMainbookInfo,
    enabled: !!budjet_id && params.id === 'create'
  })

  const { data: mainbook, isFetching } = useQuery({
    queryKey: [
      mainbookQueryKeys.getById,
      Number(params.id),
      {
        budjet_id
      }
    ],
    queryFn: getMainbookById,
    enabled: !!budjet_id && params.id !== 'create'
  })

  const { mutate: createMainbook, isPending: isCreating } = useMutation({
    mutationFn: mainbookService.create,
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
    mutationFn: mainbookService.update,
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
    mutationFn: getMainbookInfo,
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

  const rows = useMemo(() => {
    if (!values) {
      return []
    }
    const rows = transformData(values).sort((a, b) =>
      a.schet.padStart(3, '0').localeCompare(b.schet.padStart(3, '0'))
    )

    rows.push(calculateColumnTotals(rows))

    return calculateRowTotals(rows)
  }, [values])

  useEffect(() => {
    setValues(reportInfo?.data ?? mainbook?.data?.data ?? [])
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
          className="disabled:opacity-100"
        />
      </div>
      <div className="relative w-full overflow-x-hidden">
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
                data: values,
                month: Number(month),
                year: Number(year)
              })
            } else {
              updateMainbook({
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
                  getMainbookInfo,
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

export default MainbookDetailsPage
