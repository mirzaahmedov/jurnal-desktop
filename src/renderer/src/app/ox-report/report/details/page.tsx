import {
  OXReportFormSchema,
  OXReportProvodkaSchema,
  defaultValues,
  oxReportQueryKeys
} from '../config'
import {
  createEditorChangeHandler,
  createEditorCreateHandler,
  createEditorDeleteHandler
} from '@renderer/common/features/editable-table/helpers'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { DetailsView } from '@renderer/common/views'
import { EditableTable } from '@renderer/common/features/editable-table'
import { Fieldset } from '@renderer/common/components'
import { Form } from '@renderer/common/components/ui/form'
import { MonthPicker } from '@renderer/common/components/month-picker'
import { oxReportService } from '../service'
import { provodkaColumns } from './provodka'
import { toast } from '@renderer/common/hooks'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useLayout } from '@renderer/common/features/layout'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { zodResolver } from '@hookform/resolvers/zod'

const OXReportDetailsPage = () => {
  const navigate = useNavigate()
  const params = useParams()
  const budjet_id = useRequisitesStore((store) => store.budjet_id)

  const [searchParams] = useSearchParams()
  const date = searchParams.get('date')
  const [year, month] = date ? date.split('-').map(Number) : [0, 0]

  const form = useForm({
    defaultValues: {
      ...defaultValues,
      year: year || new Date().getFullYear(),
      month: month || new Date().getMonth() + 1
    },
    resolver: zodResolver(OXReportFormSchema)
  })

  const { data: report, isFetching } = useQuery({
    queryKey: [
      oxReportQueryKeys.getById,
      100,
      {
        budjet_id,
        year,
        month
      }
    ],
    queryFn: oxReportService.getById,
    enabled: params.id === 'edit'
  })
  const { mutate: createReport, isPending: isCreating } = useMutation({
    mutationFn: oxReportService.create,
    onSuccess() {
      toast({
        title: 'Запись успешно создана'
      })
      navigate(-1)
    },
    onError(error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: error.message
      })
    }
  })
  const { mutate: updateReport, isPending: isUpdating } = useMutation({
    mutationFn: oxReportService.update,
    onSuccess() {
      toast({
        title: 'Запись успешно обновлена'
      })
      navigate(-1)
    },
    onError(error) {
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
    form.reset(report?.data ? report?.data : defaultValues)
  }, [report])

  const onSubmit = form.handleSubmit((values) => {
    if (params.id === 'create') {
      createReport(values)
    } else {
      updateReport(values)
    }
  })

  return (
    <DetailsView>
      <DetailsView.Content loading={isFetching}>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-4 gap-10 p-5">
              <MonthPicker
                disabled={isFetching || isCreating || isUpdating || params.id !== 'create'}
                value={
                  form.watch('year') && form.watch('month')
                    ? `${form.watch('year')}-${form.watch('month')}-01`
                    : ''
                }
                onChange={(date) => {
                  if (!date) {
                    form.setValue('year', 0)
                    form.setValue('month', 0)
                    return
                  }
                  const [year, month] = date.split('-').map(Number)
                  form.setValue('year', year)
                  form.setValue('month', month)
                }}
                className="disabled:opacity-85"
              />
            </div>
            <DetailsView.Footer>
              <DetailsView.Create disabled={isFetching || isCreating || isUpdating} />
            </DetailsView.Footer>
          </form>
        </Form>
        <Fieldset
          name="Подводка"
          className="flex-1 mt-5 pb-24 bg-slate-50"
        >
          <EditableTable
            tabIndex={5}
            columns={provodkaColumns}
            data={form.watch('childs')}
            errors={form.formState.errors.childs}
            onCreate={createEditorCreateHandler({
              form,
              schema: OXReportProvodkaSchema,
              defaultValues: defaultValues.childs[0]
            })}
            onDelete={createEditorDeleteHandler({
              form
            })}
            onChange={createEditorChangeHandler({
              form
            })}
            params={{
              month: form.watch('month')
            }}
          />
        </Fieldset>
      </DetailsView.Content>
    </DetailsView>
  )
}

export default OXReportDetailsPage
