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
import { useNavigate, useParams } from 'react-router-dom'

import { DetailsView } from '@renderer/common/views'
import { EditableTable } from '@renderer/common/features/editable-table'
import { FormElement } from '@renderer/common/components/form'
import { MonthPicker } from '@renderer/common/components/month-picker'
import { createMonthlyReportService } from '../service'
import { provodkaColumns } from './provodka'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useLayout } from '@renderer/common/features/layout'
import { useQuery } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'

const documentTypeOptions = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' }
]

const CreateMonthlyReportDetailsPage = () => {
  const navigate = useNavigate()
  const params = useParams()

  const form = useForm({
    defaultValues,
    resolver: zodResolver(CreateMonthlyReportFormSchema)
  })

  const { data: createMontlyReport, isFetching } = useQuery({
    queryKey: [createMonthlyReportQueryKeys.getById, params.id],
    queryFn: () => createMonthlyReportService.getById(Number(params.id)),
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
      <DetailsView.Content loading={isFetching}>
        <Form {...form}>
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
        <DetailsView.Footer>
          <DetailsView.Create />
        </DetailsView.Footer>
      </DetailsView.Content>
    </DetailsView>
  )
}

export default CreateMonthlyReportDetailsPage
