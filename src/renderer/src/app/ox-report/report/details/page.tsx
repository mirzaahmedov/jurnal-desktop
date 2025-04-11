import { useEffect, useMemo, useRef } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { Fieldset } from '@/common/components'
import {
  EditableTable,
  EditableTableCell,
  EditableTableRowData
} from '@/common/components/editable-table'
import {
  createEditorChangeHandler,
  createEditorCreateHandler,
  createEditorDeleteHandler
} from '@/common/components/editable-table/helpers'
import { MonthPicker } from '@/common/components/month-picker'
import { Form } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { useRequisitesStore } from '@/common/features/requisites'
import { inputVariants } from '@/common/features/spravochnik'
import { toast } from '@/common/hooks'
import { useLayout } from '@/common/layout/store'
import { formatNumber } from '@/common/lib/format'
import { cn } from '@/common/lib/utils'
import { DetailsView } from '@/common/views'

import {
  OXReportFormSchema,
  OXReportProvodkaSchema,
  defaultValues,
  oxReportQueryKeys
} from '../config'
import { oxReportService } from '../service'
import { provodkaColumns } from './provodka'

const OXReportDetailsPage = () => {
  const tableRef = useRef<HTMLTableElement>(null)
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

  const childs = form.watch('childs')
  const itogo = useMemo(() => {
    return childs?.reduce(
      (result, item) => {
        result.ajratilgan_mablag += item.ajratilgan_mablag
        result.haqiqatda_harajatlar += item.haqiqatda_harajatlar
        result.kassa_rasxod += item.kassa_rasxod
        result.tulangan_mablag_smeta_buyicha += item.tulangan_mablag_smeta_buyicha
        result.remainder += item.remainder
        return result
      },
      {
        ajratilgan_mablag: 0,
        haqiqatda_harajatlar: 0,
        kassa_rasxod: 0,
        tulangan_mablag_smeta_buyicha: 0,
        remainder: 0
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
            columnDefs={provodkaColumns}
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
                    value={formatNumber(itogo.ajratilgan_mablag)}
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
                    value={formatNumber(itogo.tulangan_mablag_smeta_buyicha)}
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
                    value={formatNumber(itogo.kassa_rasxod)}
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
                    value={formatNumber(itogo.haqiqatda_harajatlar)}
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
                    value={formatNumber(itogo.remainder)}
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

export default OXReportDetailsPage
