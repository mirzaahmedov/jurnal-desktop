import {
  CreateMonthlyReportFormSchema,
  CreateMonthlyReportProvodkaSchema,
  createMonthlyReportQueryKeys,
  defaultValues
} from '../config'
import { Fieldset, SelectField } from '@renderer/common/components'
import { Form, FormField } from '@renderer/common/components/ui/form'
import {
  createEditorChangeHandler,
  createEditorCreateHandler,
  createEditorDeleteHandler
} from '@renderer/common/features/editable-table/helpers'
import {
  createMonthlyReportCreateQuery,
  createMonthlyReportGetByIdQuery,
  createMonthlyReportUpdateQuery
} from '../service'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'

import { DetailsView } from '@renderer/common/views'
import { EditableTable } from '@renderer/common/features/editable-table'
import { FormElement } from '@renderer/common/components/form'
import { MonthPicker } from '@renderer/common/components/month-picker'
import { provodkaColumns } from './provodka'
import { toast } from '@renderer/common/hooks'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useLayout } from '@renderer/common/features/layout'
import { useMainSchet } from '@renderer/common/features/main-schet'
import { zodResolver } from '@hookform/resolvers/zod'

const documentTypeOptions = [
  { value: 'jur1', label: 'Ж.О.1' },
  { value: 'jur2', label: 'Ж.О.2' },
  { value: 'jur3', label: 'Ж.О.3' },
  { value: 'jur4', label: 'Ж.О.4' },
  { value: 'jur5', label: 'Ж.О.5' },
  { value: 'jur6', label: 'Ж.О.6' },
  { value: 'jur7', label: 'Ж.О.7' },
  { value: 'jur8', label: 'Ж.О.8' }
]

const CreateMonthlyReportDetailsPage = () => {
  const navigate = useNavigate()
  const params = useParams()
  const main_schet_id = useMainSchet((store) => store.main_schet?.id)

  const form = useForm({
    defaultValues: {
      ...defaultValues,
      year: params.year ? Number(params.year) : defaultValues.year,
      month: params.month ? Number(params.month) : defaultValues.month
    },
    resolver: zodResolver(CreateMonthlyReportFormSchema)
  })

  const { data: createMontlyReport, isFetching } = useQuery({
    queryKey: [
      createMonthlyReportQueryKeys.getById,
      {
        main_schet_id: main_schet_id!,
        type_document: params.type_document!,
        year: Number(params.year),
        month: Number(params.month)
      }
    ],
    queryFn: createMonthlyReportGetByIdQuery,
    enabled: params.type_document !== 'create'
  })
  const { mutate: createCreateMontlyReport, isPending: isCreating } = useMutation({
    mutationFn: createMonthlyReportCreateQuery,
    onSuccess() {
      toast({
        title: 'Запись успешно создана'
      })
      navigate('/main-book/create-monthly-report')
    },
    onError(error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: 'Ошибка при создании записи'
      })
    }
  })
  const { mutate: updateCreateMontlyReport, isPending: isUpdating } = useMutation({
    mutationFn: createMonthlyReportUpdateQuery,
    onSuccess() {
      toast({
        title: 'Запись успешно обновлена'
      })
      navigate('/main-book/create-monthly-report')
    },
    onError(error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: 'Ошибка при обновлении записи'
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
    form.reset(
      createMontlyReport?.data
        ? {
            ...createMontlyReport?.data,
            childs: createMontlyReport?.data.childs.map((child) => ({
              ...child,
              debet_sum: !isNaN(Number(child.debet_sum)) ? Number(child.debet_sum) : 0,
              kredit_sum: !isNaN(Number(child.kredit_sum)) ? Number(child.kredit_sum) : 0
            }))
          }
        : defaultValues
    )
  }, [createMontlyReport])

  const onSubmit = form.handleSubmit((values) => {
    if (params.type_document === 'create') {
      createCreateMontlyReport({
        ...values,
        main_schet_id: main_schet_id!
      })
    } else {
      updateCreateMontlyReport({
        ...values,
        main_schet_id: main_schet_id!
      })
    }
  })

  return (
    <DetailsView>
      <DetailsView.Content loading={isFetching}>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-4 gap-10 p-5">
              <FormElement label="Период">
                <MonthPicker
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
                />
              </FormElement>
              <FormField
                control={form.control}
                name="type_document"
                render={({ field }) => (
                  <SelectField
                    {...field}
                    onValueChange={(value) => field.onChange(value)}
                    options={documentTypeOptions}
                    placeholder="Выберите тип документа"
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.value}
                  />
                )}
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
              schema: CreateMonthlyReportProvodkaSchema,
              defaultValues: defaultValues.childs[0]
            })}
            onDelete={createEditorDeleteHandler({
              form
            })}
            onChange={createEditorChangeHandler({
              form
            })}
          />
        </Fieldset>
      </DetailsView.Content>
    </DetailsView>
  )
}

export default CreateMonthlyReportDetailsPage
