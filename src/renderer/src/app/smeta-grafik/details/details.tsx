import type { Smeta, SmetaGrafikProvodka } from '@/common/models'

import { type KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import {
  EditableTable,
  EditableTableCell,
  type EditableTableMethods,
  EditableTableRow
} from '@/common/components/editable-table'
import { createEditorCreateHandler } from '@/common/components/editable-table/helpers'
import { FormElement } from '@/common/components/form'
import { SearchInput } from '@/common/components/search-input'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { Textarea } from '@/common/components/ui/textarea'
import { YearSelect } from '@/common/components/year-select'
import { useRequisitesStore } from '@/common/features/requisites'
import { formatNumber } from '@/common/lib/format'
import { DetailsView } from '@/common/views'

import {
  SmetaGrafikFormSchema,
  SmetaGrafikProvodkaFormSchema,
  SmetaGrafikQueryKeys,
  defaultValues
} from '../config'
import { SmetaGrafikService } from '../service'
import { getProvodkaColumns } from './provodka'
import { calculateColumnTotals, calculateRowTotals } from './utils'

export interface SmetaGrafikDetailsProps {
  id: string
  isEditable?: boolean
  year?: string
}
export const SmetaGrafikDetails = ({ id, year, isEditable }: SmetaGrafikDetailsProps) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const tableRef = useRef<HTMLTableElement>(null)
  const tableMethods = useRef<EditableTableMethods>(null)

  const form = useForm({
    resolver: zodResolver(SmetaGrafikFormSchema),
    defaultValues
  })

  const { t } = useTranslation()
  const { main_schet_id, budjet_id } = useRequisitesStore()

  const [total, setTotal] = useState<SmetaGrafikProvodka>({
    smeta_id: 0,
    smeta_number: t('total'),
    smeta_name: 'total',
    oy_1: 0,
    oy_2: 0,
    oy_3: 0,
    oy_4: 0,
    oy_5: 0,
    oy_6: 0,
    oy_7: 0,
    oy_8: 0,
    oy_9: 0,
    oy_10: 0,
    oy_11: 0,
    oy_12: 0,
    itogo: 0
  } as SmetaGrafikProvodka)

  const { data: smetaGrafik, isFetching } = useQuery({
    queryKey: [
      SmetaGrafikQueryKeys.getById,
      Number(id),
      {
        year,
        main_schet_id
      }
    ],
    queryFn: SmetaGrafikService.getById
  })

  const { mutate: getByOrderNumber, isPending: isLoadingByOrderNumber } = useMutation({
    mutationFn: SmetaGrafikService.getByOrderNumber,
    onSuccess: (res) => {
      if (res?.data) {
        form.setValue('command', '')
        form.setValue('smetas', res.data.smetas)
        form.setValue('year', res.data.year)
      } else {
        form.reset(defaultValues)
      }
    },
    onError: () => {
      form.reset(defaultValues)
    }
  })
  const { mutate: createGrafik, isPending: isCreating } = useMutation({
    mutationKey: [SmetaGrafikQueryKeys.create],
    mutationFn: SmetaGrafikService.create,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [SmetaGrafikQueryKeys.getAll]
      })
      navigate(-1)
    }
  })
  const { mutate: updateGrafik, isPending: isUpdating } = useMutation({
    mutationKey: [SmetaGrafikQueryKeys.update],
    mutationFn: SmetaGrafikService.update,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [SmetaGrafikQueryKeys.getAll]
      })
      navigate(-1)
    }
  })

  const onSubmit = form.handleSubmit((values) => {
    if (!budjet_id || !main_schet_id) {
      toast.error('Выберите бюджет и главный счет')
      return
    }
    if (id === 'create') {
      createGrafik({
        command: values.command,
        smetas: values.smetas,
        year: values.year
      })
    } else {
      updateGrafik({
        id: Number(id),
        smetas: values.smetas,
        command: values.command,
        year: undefined as any
      })
    }
  })

  useEffect(() => {
    if (id === 'create') {
      return
    }

    if (smetaGrafik?.data) {
      form.reset({
        command: smetaGrafik.data.command,
        year: smetaGrafik.data.year,
        smetas: smetaGrafik.data.smetas
      })
    } else {
      form.reset(defaultValues)
    }
  }, [form, smetaGrafik, id])

  const selectedYear = form.watch('year')
  useEffect(() => {
    if (id === 'create') {
      getByOrderNumber({
        order_number: 0,
        year: selectedYear
      })
    }
  }, [id, selectedYear, getByOrderNumber])

  const smetas = useWatch({
    control: form.control,
    name: 'smetas'
  })

  useEffect(() => {
    setTotal(calculateColumnTotals(smetas))
    smetas.forEach((smeta, index) => {
      const itogo = calculateRowTotals(smeta)
      if (itogo !== form.getValues(`smetas.${index}.itogo`)) {
        form.setValue(`smetas.${index}.itogo`, itogo)
      }
    })
  }, [form, smetas])

  const columnDefs = useMemo(
    () =>
      getProvodkaColumns({
        readOnly: !isEditable
      }),
    [isEditable]
  )

  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.stopPropagation()
      e.preventDefault()

      const value = e.currentTarget.value
      if (value.length > 0) {
        const rows = form.getValues('smetas')
        const index = rows.findIndex((row) =>
          row.smeta_number?.toLowerCase()?.includes(value?.toLowerCase())
        )
        tableMethods.current?.scrollToRow(index)
      }
    }
  }

  return (
    <DetailsView>
      <DetailsView.Content loading={isFetching || isLoadingByOrderNumber}>
        <Form {...form}>
          <form
            onSubmit={onSubmit}
            noValidate
          >
            <div className="p-5 flex items-start gap-5">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormElement
                    label={t('year')}
                    direction="column"
                  >
                    <YearSelect
                      isReadOnly={id !== 'create'}
                      selectedKey={field.value}
                      onSelectionChange={field.onChange}
                      className="w-24 gap-0 mt-2"
                    />
                  </FormElement>
                )}
              />

              <FormField
                control={form.control}
                name="command"
                render={({ field }) => (
                  <FormElement
                    label={t('decree')}
                    direction="column"
                  >
                    <Textarea
                      rows={4}
                      cols={60}
                      value={field.value}
                      onChange={field.onChange}
                      className="mt-2"
                    />
                  </FormElement>
                )}
              />
            </div>

            <div className="p-5">
              <SearchInput onKeyDown={handleSearch} />
            </div>
            <div className="w-full overflow-x-auto scrollbar pb-24">
              <EditableTable
                tableRef={tableRef}
                tabIndex={5}
                columnDefs={columnDefs}
                form={form}
                name="smetas"
                errors={form.formState.errors.smetas}
                methods={tableMethods}
                onCreate={
                  isEditable
                    ? createEditorCreateHandler({
                        form,
                        schema: SmetaGrafikProvodkaFormSchema,
                        defaultValues: defaultValues.smetas[0],
                        field: 'smetas'
                      })
                    : undefined
                }
                onDelete={
                  isEditable
                    ? ({ id }) => {
                        const newSmetas = form
                          .getValues('smetas')
                          .filter((_, index) => index !== id)
                        console.log({ newSmetas })
                        form.setValue('smetas', newSmetas)
                      }
                    : undefined
                }
                params={{
                  onSmetaChange: (rowIndex: number, smeta: Smeta) => {
                    form.setValue(`smetas.${rowIndex}.smeta_number`, smeta?.smeta_number)
                  }
                }}
                validate={({ id, key, payload }) => {
                  if (key !== 'smeta_id') {
                    return true
                  }

                  return !form.getValues('smetas').some((grafik, index) => {
                    if (grafik?.smeta_id && payload.smeta_id === grafik.smeta_id && id !== index) {
                      toast.error('Проводка с этой сметой уже существует')

                      const input = tableRef?.current?.querySelector(
                        `[data-editorid="${index}-smeta_id"]`
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
                  <EditableTableRow focusable={false}>
                    <EditableTableCell></EditableTableCell>
                    <EditableTableCell className="sticky left-0 z-50">
                      <Input
                        editor
                        readOnly
                        className="font-bold"
                        value={t('total')}
                      />
                    </EditableTableCell>
                    {[
                      'oy_1',
                      'oy_2',
                      'oy_3',
                      'oy_4',
                      'oy_5',
                      'oy_6',
                      'oy_7',
                      'oy_8',
                      'oy_9',
                      'oy_10',
                      'oy_11',
                      'oy_12',
                      'itogo'
                    ].map((key) => (
                      <EditableTableCell key={key}>
                        <Input
                          editor
                          readOnly
                          className="font-bold text-end"
                          value={formatNumber(total[key as keyof SmetaGrafikProvodka] as number, 0)}
                        />
                      </EditableTableCell>
                    ))}
                    <EditableTableCell className="sticky right-0 z-50 border-l"></EditableTableCell>
                    {isEditable ? <EditableTableCell></EditableTableCell> : null}
                  </EditableTableRow>
                }
              />
            </div>
            {isEditable ? (
              <DetailsView.Footer>
                <DetailsView.Create
                  isPending={isCreating || isUpdating}
                  type="submit"
                >
                  {t('save')}
                </DetailsView.Create>
              </DetailsView.Footer>
            ) : null}
          </form>
        </Form>
      </DetailsView.Content>
    </DetailsView>
  )
}
