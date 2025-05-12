import type { SmetaGrafikProvodka } from '@/common/models'

import { useEffect, useMemo, useRef, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import {
  EditableTable,
  EditableTableCell,
  EditableTableRow
} from '@/common/components/editable-table'
import {
  createEditorCreateHandler,
  createEditorDeleteHandler
} from '@/common/components/editable-table/helpers'
import { FormElement } from '@/common/components/form'
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

  const form = useForm({
    resolver: zodResolver(SmetaGrafikFormSchema),
    defaultValues: defaultValues
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
    oy_12: 0
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
      createGrafik(values)
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
      form.reset(defaultValues)
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

  const smetas = useWatch({
    control: form.control,
    name: 'smetas'
  })

  useEffect(() => {
    setTotal(calculateColumnTotals(smetas))
    smetas.forEach((smeta, index) => {
      const total = calculateRowTotals(smeta)
      if (total !== form.getValues(`smetas.${index}.total`)) {
        form.setValue(`smetas.${index}.total`, total)
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

  return (
    <DetailsView>
      <DetailsView.Content loading={isFetching}>
        <Form {...form}>
          <form onSubmit={onSubmit}>
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

            <div className="w-full overflow-x-auto scrollbar">
              <EditableTable
                tableRef={tableRef}
                tabIndex={5}
                columnDefs={columnDefs}
                form={form}
                name="smetas"
                errors={form.formState.errors.smetas}
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
                    ? createEditorDeleteHandler({
                        form,
                        field: 'smetas'
                      })
                    : undefined
                }
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
                      'oy_12'
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
