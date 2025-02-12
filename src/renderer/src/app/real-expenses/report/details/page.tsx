import { useEffect, useMemo, useRef } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { documentTypes } from '@renderer/app/mainbook/common/data'
import { Fieldset, SelectField } from '@renderer/common/components'
import {
  EditableTable,
  EditableTableCell,
  EditableTableRow
} from '@renderer/common/components/editable-table'
import {
  createEditorChangeHandler,
  createEditorCreateHandler,
  createEditorDeleteHandler
} from '@renderer/common/components/editable-table/helpers'
import { MonthPicker } from '@renderer/common/components/month-picker'
import { Form, FormField } from '@renderer/common/components/ui/form'
import { Input } from '@renderer/common/components/ui/input'
import { useLayout } from '@renderer/common/features/layout'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { inputVariants } from '@renderer/common/features/spravochnik'
import { toast } from '@renderer/common/hooks'
import { formatNumber } from '@renderer/common/lib/format'
import { useQueryDateParams, useQueryTypeDocument } from '@renderer/common/lib/query-params'
import { cn } from '@renderer/common/lib/utils'
import { DetailsView } from '@renderer/common/views'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'

import {
  RealExpensesReportFormSchema,
  RealExpensesReportProvodkaSchema,
  defaultValues,
  realExpensesReportQueryKeys
} from '../config'
import { realExpensesReportService } from '../service'
import { provodkaColumns } from './provodka'

const ExpensesReportDetailsPage = () => {
  const tableRef = useRef<HTMLTableElement>(null)
  const navigate = useNavigate()
  const params = useParams()
  const budjet_id = useRequisitesStore((store) => store.budjet_id)

  const { year, month } = useQueryDateParams('date')
  const { type_document } = useQueryTypeDocument()

  const form = useForm({
    defaultValues: {
      ...defaultValues,
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1
    },
    resolver: zodResolver(RealExpensesReportFormSchema)
  })

  const { data: report, isFetching } = useQuery({
    queryKey: [
      realExpensesReportQueryKeys.getById,
      1000,
      {
        year,
        month,
        type_document,
        budjet_id
      }
    ],
    queryFn: realExpensesReportService.getById,
    enabled: params.id !== 'create' && !!budjet_id && !!year && !!month
  })
  const { mutate: createReport, isPending: isCreating } = useMutation({
    mutationFn: realExpensesReportService.create,
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
    mutationFn: realExpensesReportService.update,
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

  const childs = form.watch('childs')
  const itogo = useMemo(() => {
    return childs?.reduce(
      (result, item) => {
        result.debet += item.debet_sum
        result.credit += item.kredit_sum
        return result
      },
      {
        debet: 0,
        credit: 0
      }
    )
  }, [childs])

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
              <FormField
                control={form.control}
                name="type_document"
                render={({ field }) => (
                  <SelectField
                    {...field}
                    disabled={isFetching || isCreating || isUpdating || params.id !== 'create'}
                    onValueChange={(value) => field.onChange(value)}
                    options={documentTypes}
                    placeholder="Выберите тип документа"
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.key}
                    triggerClassName="disabled:opacity-85"
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
            tableRef={tableRef}
            tabIndex={5}
            columns={provodkaColumns}
            data={form.watch('childs')}
            errors={form.formState.errors.childs}
            onCreate={createEditorCreateHandler({
              form,
              schema: RealExpensesReportProvodkaSchema,
              defaultValues: defaultValues.childs[0]
            })}
            onDelete={createEditorDeleteHandler({
              form
            })}
            onChange={createEditorChangeHandler({
              form
            })}
            validate={({ id, key, payload }) => {
              if (key !== 'smeta_grafik_id') {
                return true
              }

              return !form.getValues('childs').some((child, index) => {
                if (id !== index && payload.smeta_grafik_id === child.smeta_grafik_id) {
                  toast({
                    variant: 'destructive',
                    title: 'Подводка с таким счетом уже существует'
                  })

                  const input = tableRef?.current?.querySelector(
                    `[data-editorid="${index}-smeta_grafik_id"]`
                  ) as HTMLInputElement
                  if (input) {
                    setTimeout(() => {
                      input.focus()
                    }, 100)
                  }

                  return true
                }
                return false
              })
            }}
            footerRows={
              <EditableTableRow className="!border">
                <EditableTableCell>
                  <Input
                    aria-hidden
                    readOnly
                    tabIndex={-1}
                    className={cn(
                      inputVariants({ editor: true }),
                      'pointer-events-none text-xs text-gray-700 font-extrabold'
                    )}
                    value="Итого"
                  />
                </EditableTableCell>
                <EditableTableCell>
                  <Input
                    aria-hidden
                    readOnly
                    tabIndex={-1}
                    className={cn(
                      inputVariants({ editor: true }),
                      'pointer-events-none font-bold text-right'
                    )}
                    value={formatNumber(itogo.debet)}
                  />
                </EditableTableCell>
                <EditableTableCell>
                  <Input
                    aria-hidden
                    readOnly
                    tabIndex={-1}
                    className={cn(
                      inputVariants({ editor: true }),
                      'pointer-events-none font-bold text-right'
                    )}
                    value={formatNumber(itogo.credit)}
                  />
                </EditableTableCell>
                <EditableTableCell></EditableTableCell>
              </EditableTableRow>
            }
          />
        </Fieldset>
      </DetailsView.Content>
    </DetailsView>
  )
}

export default ExpensesReportDetailsPage
