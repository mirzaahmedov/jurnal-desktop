import { useEffect, useState } from 'react'

import { MonthPicker } from '@renderer/common/components/month-picker'
import { Button } from '@renderer/common/components/ui/button'
import { useLayout } from '@renderer/common/features/layout'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { toast } from '@renderer/common/hooks'
import { formatDate } from '@renderer/common/lib/date'
import type { OX } from '@renderer/common/models'
import { DetailsView } from '@renderer/common/views'
import { useMutation, useQuery } from '@tanstack/react-query'
import { FileDown, Save } from 'lucide-react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { oxQueryKeys } from '../config'
import { ReportTable } from '../report-table'
import { getOXById, getOXInfo, oxService } from '../service'

const OXDetailsPage = () => {
  const budjet_id = useRequisitesStore((store) => store.budjet_id)
  const navigate = useNavigate()
  const params = useParams()

  const [values, setValues] = useState<OX.ReportPreviewProvodka[]>()
  const [date, setDate] = useState(formatDate(new Date()))
  const [year, month] = date.split('-')

  const [searchParams] = useSearchParams()
  const [yearParam, monthParam] = searchParams.get('date')?.split('-') ?? [0, 0]

  const { data: reportInfo, isFetching: isFetchingInfo } = useQuery({
    queryKey: [
      getOXInfo,
      {
        year: Number(year),
        month: Number(month),
        budjet_id
      }
    ],
    queryFn: getOXInfo,
    enabled: !!budjet_id && params.id === 'create'
  })

  const { data: ox, isFetching } = useQuery({
    queryKey: [
      oxQueryKeys.getById,
      Number(params.id),
      {
        year: Number(yearParam),
        month: Number(monthParam),
        budjet_id
      }
    ],
    queryFn: getOXById,
    enabled: !!budjet_id && params.id !== 'create' && !!monthParam && !!yearParam
  })

  const { mutate: createOX, isPending: isCreating } = useMutation({
    mutationFn: oxService.create,
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
  const { mutate: updateOX, isPending: isUpdating } = useMutation({
    mutationFn: oxService.update,
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
    mutationFn: getOXInfo,
    onSuccess: (response) => {
      toast({
        title: 'Информация успешно загружена'
      })
      setValues(response?.data?.smeta_grafiks ?? [])
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

  useEffect(() => {
    setValues(reportInfo?.data?.smeta_grafiks ?? ox?.data?.smeta_grafiks ?? [])
  }, [reportInfo?.data, ox?.data])

  useEffect(() => {
    const data = ox?.data
    if (!data) {
      return
    }

    setDate(`${data.year}-${data.month}-01`)
  }, [ox?.data])

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
      <div className="relative w-full flex-1 overflow-hidden">
        <ReportTable
          isLoading={isFetching || isFetchingInfo || isPending}
          data={values ?? []}
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
              createOX({
                data: values,
                month: Number(month),
                year: Number(year)
              })
            } else {
              updateOX({
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
                  getOXInfo,
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

export default OXDetailsPage
