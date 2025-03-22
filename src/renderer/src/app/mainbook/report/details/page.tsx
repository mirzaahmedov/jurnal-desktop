import { useEffect, useMemo, useRef } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { documentTypes } from '@renderer/app/mainbook/common/data'
import { Fieldset, LoadingOverlay, SelectField } from '@renderer/common/components'
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
import { Button } from '@renderer/common/components/ui/button'
import { Form, FormField } from '@renderer/common/components/ui/form'
import { Input } from '@renderer/common/components/ui/input'
import { useLayout } from '@renderer/common/features/layout'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { inputVariants } from '@renderer/common/features/spravochnik'
import { formatNumber } from '@renderer/common/lib/format'
import { cn } from '@renderer/common/lib/utils'
import { DetailsView } from '@renderer/common/views'
import { useMutation, useQuery } from '@tanstack/react-query'
import { CloudDownload } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import {
  MainbookReportFormSchema,
  MainbookReportProvodkaSchema,
  type MainbookReportProvodkaValues,
  defaultValues,
  mainbookReportQueryKeys
} from '../config'
import { autofillMainbookReportQuery, mainbookReportService } from '../service'
import { provodkaColumns } from './provodka'

const MainbookReportDetailsPage = () => {
  const tableRef = useRef<HTMLTableElement>(null)

  const navigate = useNavigate()
  const params = useParams()
  const budjet_id = useRequisitesStore((store) => store.budjet_id)

  const [searchParams] = useSearchParams()

  const date = searchParams.get('date')
  const type_document = searchParams.get('type_document')
  const [year, month] = date ? date.split('-').map(Number) : [0, 0]

  const { t } = useTranslation()

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
      toast.success('Запись успешно создана')
      navigate(-1)
    },
    onError(error) {
      console.error(error)
      toast.error(error.message)
    }
  })
  const { mutate: updateReport, isPending: isUpdating } = useMutation({
    mutationFn: mainbookReportService.update,
    onSuccess() {
      toast.success('Запись успешно обновлена')
      navigate(-1)
    },
    onError(error) {
      console.error(error)
      toast.error(error.message)
    }
  })
  const { mutate: autofill, isPending: isAutofilling } = useMutation({
    mutationFn: autofillMainbookReportQuery,
    onSuccess(res) {
      if (!Array.isArray(res.data)) {
        throw new Error('invalid response')
      }

      form.setValue(
        'childs',
        res.data.map<MainbookReportProvodkaValues>((item) => ({
          spravochnik_main_book_schet_id: item.id,
          debet_sum: item.debet_sum,
          kredit_sum: item.kredit_sum
        }))
      )
      form.trigger('childs')
    },
    onError(error) {
      toast.error(error.message ?? '')
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
        result.debet += item?.debet_sum
        result.credit += item?.kredit_sum
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
          <div>
            <Button
              onClick={() => {
                autofill({
                  year: form.getValues('year'),
                  month: form.getValues('month'),
                  type_document: form.getValues('type_document')
                })
              }}
              disabled={
                isAutofilling ||
                !form.watch('year') ||
                !form.watch('month') ||
                !form.watch('type_document')
              }
            >
              <CloudDownload className="btn-icon icon-start" /> {t('autofill')}
            </Button>
          </div>
          <div>
            <EditableTable
              tableRef={tableRef}
              tabIndex={5}
              columnDefs={provodkaColumns}
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
                    toast.error('Подводка с таким счетом уже существует')

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
            {isAutofilling ? <LoadingOverlay /> : null}
          </div>
        </Fieldset>
      </DetailsView.Content>
    </DetailsView>
  )
}

export default MainbookReportDetailsPage
