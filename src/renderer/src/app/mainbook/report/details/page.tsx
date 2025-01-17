import {
  EditableTable,
  EditableTableCell,
  EditableTableRow
} from '@renderer/common/components/editable-table'
import { Fieldset, SelectField, inputVariants } from '@renderer/common/components'
import { Form, FormField } from '@renderer/common/components/ui/form'
import {
  MainbookReportFormSchema,
  MainbookReportProvodkaSchema,
  defaultValues,
  mainbookReportQueryKeys
} from '../config'
import {
  createEditorChangeHandler,
  createEditorCreateHandler,
  createEditorDeleteHandler
} from '@renderer/common/components/editable-table/helpers'
import { useEffect, useMemo, useRef } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { DetailsView } from '@renderer/common/views'
import { Input } from '@renderer/common/components/ui/input'
import { MonthPicker } from '@renderer/common/components/month-picker'
import { cn } from '@renderer/common/lib/utils'
import { documentTypes } from '@renderer/app/mainbook/common/data'
import { formatNumber } from '@renderer/common/lib/format'
import { mainbookReportService } from '../service'
import { provodkaColumns } from './provodka'
import { toast } from '@renderer/common/hooks'
import { useForm } from 'react-hook-form'
import { useLayout } from '@renderer/common/features/layout'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { zodResolver } from '@hookform/resolvers/zod'

const MainbookReportDetailsPage = () => {
  const tableRef = useRef<HTMLTableElement>(null)
  const navigate = useNavigate()
  const params = useParams()
  const budjet_id = useRequisitesStore((store) => store.budjet_id)

  const [searchParams] = useSearchParams()

  const date = searchParams.get('date')
  const type_document = searchParams.get('type_document')
  const [year, month] = date ? date.split('-').map(Number) : [0, 0]

  const form = useForm({
    defaultValues: {
      ...defaultValues,
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1
    },
    resolver: zodResolver(MainbookReportFormSchema)
  })

  const { data: report, isFetching } = useQuery({
    queryKey: [
      mainbookReportQueryKeys.getById,
      100,
      {
        budjet_id,
        type_document,
        year,
        month
      }
    ],
    queryFn: mainbookReportService.getById,
    enabled: params.id === 'edit' && !!year && !!month
  })
  const { mutate: createReport, isPending: isCreating } = useMutation({
    mutationFn: mainbookReportService.create,
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
    mutationFn: mainbookReportService.update,
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
                    onValueChange={(value) => field.onChange(value)}
                    options={documentTypes}
                    placeholder="Выберите тип документа"
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.key}
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
              schema: MainbookReportProvodkaSchema,
              defaultValues: defaultValues.childs[0]
            })}
            onDelete={createEditorDeleteHandler({
              form
            })}
            onChange={createEditorChangeHandler({
              form
            })}
            validate={({ id, key, payload }) => {
              if (key !== 'spravochnik_main_book_schet_id') {
                return true
              }

              return !form.getValues('childs').some((child, index) => {
                if (
                  id !== index &&
                  payload.spravochnik_main_book_schet_id === child.spravochnik_main_book_schet_id
                ) {
                  toast({
                    variant: 'destructive',
                    title: 'Подводка с таким счетом уже существует'
                  })

                  const input = tableRef?.current?.querySelector(
                    `[data-editorid="${index}-spravochnik_main_book_schet_id"]`
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

export default MainbookReportDetailsPage
