import type { ApiResponse, Smeta, SmetaGrafikProvodka } from '@/common/models'
import type { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community'

import { type KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { RefreshCcw } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { type EditableTableMethods } from '@/common/components/editable-table'
import { EditorTable } from '@/common/components/editor-table/editor-table'
import { FormElement } from '@/common/components/form'
import { Button } from '@/common/components/jolly/button'
import { SearchInput } from '@/common/components/search-input'
import { Form, FormField } from '@/common/components/ui/form'
import { Textarea } from '@/common/components/ui/textarea'
import { YearSelect } from '@/common/components/year-select'
import { useRequisitesStore } from '@/common/features/requisites'
import { formatNumber } from '@/common/lib/format'
import { api } from '@/common/lib/http'
import { DetailsView } from '@/common/views'

import { SmetaGrafikFormSchema, SmetaGrafikQueryKeys, defaultValues } from '../config'
import { SmetaGrafikService } from '../service'

export interface SmetaGrafikDetailsProps {
  id: string
  isEditable?: boolean
  year?: string
}
export const SmetaGrafikDetails = ({ id, year, isEditable }: SmetaGrafikDetailsProps) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const tableMethods = useRef<EditableTableMethods>(null)

  const form = useForm({
    resolver: zodResolver(SmetaGrafikFormSchema),
    defaultValues
  })

  const { t } = useTranslation()
  const { main_schet_id, budjet_id } = useRequisitesStore()

  const [gridApi, setGridApi] = useState<GridApi>()
  const [totalRow, setTotalRow] = useState<SmetaGrafikProvodka[]>([
    {
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
    } as SmetaGrafikProvodka
  ])

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

  const fetchSmetas = useMutation({
    mutationFn: async () => {
      const res = await api.get<ApiResponse<Smeta[]>>('/smeta', {
        params: {
          page: 1,
          limit: 1000000
        }
      })
      return res.data
    },
    onSuccess: (res) => {
      if (!res.data) {
        return
      }
      form.setValue(
        'smetas',
        res.data.map((item) => ({
          smeta_id: item.id,
          smeta_number: item.smeta_number,
          smeta_name: item.smeta_name,
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
        }))
      )
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

  // const smetas = useWatch({
  //   control: form.control,
  //   name: 'smetas'
  // })

  // useEffect(() => {
  //   setTotal(calculateColumnTotals(smetas))
  //   smetas.forEach((smeta, index) => {
  //     const itogo = calculateRowTotals(smeta)
  //     if (itogo !== form.getValues(`smetas.${index}.itogo`)) {
  //       form.setValue(`smetas.${index}.itogo`, itogo)
  //     }
  //   })
  // }, [form, smetas])
  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api)
  }, [])

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

  const columnDefs = useMemo(
    () =>
      [
        {
          field: 'smeta_id',
          headerName: t('smeta'),
          width: 200,
          pinned: 'left',
          cellRenderer: 'smetaEditor',
          cellRendererParams: {
            className: 'font-semibold',
            getSmetaInfo: (row) => ({
              smeta_number: row?.smeta_number || '',
              smeta_name: row?.smeta_name || ''
            }),
            setSmetaInfo: ({ smeta_number, smeta_name, rowIndex }) => {
              form.setValue(`smetas.${rowIndex}.smeta_name` as any, smeta_name)
              form.setValue(`smetas.${rowIndex}.smeta_number` as any, smeta_number)
            }
          }
        },
        {
          field: 'oy_1',
          headerName: t('january'),
          cellRendererSelector: (params) => {
            if (params.node.rowPinned === 'bottom') {
              return {
                component: 'numberCell'
              }
            }
            return {
              component: 'numberEditor'
            }
          },
          headerClass: 'right-aligned'
        },
        {
          field: 'oy_2',
          headerName: t('february'),
          cellRendererSelector: (params) => {
            if (params.node.rowPinned === 'bottom') {
              return {
                component: 'numberCell'
              }
            }
            return {
              component: 'numberEditor'
            }
          },
          cellClass: 'text-end',
          headerClass: 'right-aligned'
        },
        {
          field: 'oy_3',
          headerName: t('march'),
          cellRendererSelector: (params) => {
            if (params.node.rowPinned === 'bottom') {
              return {
                component: 'numberCell'
              }
            }
            return {
              component: 'numberEditor'
            }
          },
          cellClass: 'text-end',
          headerClass: 'right-aligned'
        },
        {
          field: 'oy_4',
          headerName: t('april'),
          cellRendererSelector: (params) => {
            if (params.node.rowPinned === 'bottom') {
              return {
                component: 'numberCell'
              }
            }
            return {
              component: 'numberEditor'
            }
          },
          headerClass: 'right-aligned'
        },
        {
          field: 'oy_5',
          headerName: t('may'),
          cellRendererSelector: (params) => {
            if (params.node.rowPinned === 'bottom') {
              return {
                component: 'numberCell'
              }
            }
            return {
              component: 'numberEditor'
            }
          },
          headerClass: 'right-aligned'
        },
        {
          field: 'oy_6',
          headerName: t('june'),
          cellRendererSelector: (params) => {
            if (params.node.rowPinned === 'bottom') {
              return {
                component: 'numberCell'
              }
            }
            return {
              component: 'numberEditor'
            }
          },
          headerClass: 'right-aligned'
        },
        {
          field: 'oy_7',
          headerName: t('july'),
          cellRendererSelector: (params) => {
            if (params.node.rowPinned === 'bottom') {
              return {
                component: 'numberCell'
              }
            }
            return {
              component: 'numberEditor'
            }
          },
          headerClass: 'right-aligned'
        },
        {
          field: 'oy_8',
          headerName: t('august'),
          cellRendererSelector: (params) => {
            if (params.node.rowPinned === 'bottom') {
              return {
                component: 'numberCell'
              }
            }
            return {
              component: 'numberEditor'
            }
          },
          headerClass: 'right-aligned'
        },
        {
          field: 'oy_9',
          headerName: t('september'),
          cellRendererSelector: (params) => {
            if (params.node.rowPinned === 'bottom') {
              return {
                component: 'numberCell'
              }
            }
            return {
              component: 'numberEditor'
            }
          },
          headerClass: 'right-aligned'
        },
        {
          field: 'oy_10',
          headerName: t('october'),
          cellRendererSelector: (params) => {
            if (params.node.rowPinned === 'bottom') {
              return {
                component: 'numberCell'
              }
            }
            return {
              component: 'numberEditor'
            }
          },
          headerClass: 'right-aligned'
        },
        {
          field: 'oy_11',
          headerName: t('november'),
          cellRendererSelector: (params) => {
            if (params.node.rowPinned === 'bottom') {
              return {
                component: 'numberCell'
              }
            }
            return {
              component: 'numberEditor'
            }
          },
          headerClass: 'right-aligned'
        },
        {
          field: 'oy_12',
          headerName: t('december'),
          cellRendererSelector: (params) => {
            if (params.node.rowPinned === 'bottom') {
              return {
                component: 'numberCell'
              }
            }
            return {
              component: 'numberEditor'
            }
          },
          headerClass: 'right-aligned'
        },
        {
          field: 'itogo',
          headerName: t('total'),
          pinned: 'right',
          cellRendererSelector: (params) => {
            if (params.node.rowPinned === 'bottom') {
              return {
                component: 'numberCell'
              }
            }
            return {
              component: 'numberEditor'
            }
          },
          cellRendererParams: {
            className: 'font-semibold'
          },
          headerClass: 'right-aligned'
        }
      ] satisfies ColDef<any>[],
    [form]
  )
  const onValueEdited = useCallback(
    (rowIndex: number, field: string) => {
      if (field.startsWith('oy')) {
        const row = form.getValues(`smetas.${rowIndex}`)
        let rowTotal = 0
        for (let i = 1; i <= 12; i++) {
          rowTotal += row[`oy_${i}`]
        }
        form.setValue(`smetas.${rowIndex}.itogo`, rowTotal)

        const value = row[field]
        const formattedValue = formatNumber(value, 0, 2)

        const column = gridApi?.getColumn(field)
        const newWidth = formattedValue.length * 8.5 + 2 * 16
        const currentWidth = column?.getActualWidth() ?? 0

        if (newWidth > currentWidth) {
          gridApi?.setColumnWidths([
            {
              key: field,
              newWidth
            }
          ])
        }

        const formattedTotalValue = formatNumber(value, 0, 2)

        const totalColumn = gridApi?.getColumn('itogo')
        const newTotalWidth = formattedTotalValue.length * 8.5 + 2 * 16
        const currentTotalWidth = totalColumn?.getActualWidth() ?? 0

        if (newTotalWidth > currentTotalWidth) {
          gridApi?.setColumnWidths([
            {
              key: 'itogo',
              newWidth: newTotalWidth
            }
          ])
        }

        const rows = form.getValues('smetas')
        const totals = {
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
        } as SmetaGrafikProvodka
        rows.forEach((row) => {
          for (let i = 1; i <= 12; i++) {
            totals[`oy_${i}`] += row[`oy_${i}`]
          }
          totals['itogo'] = (totals['itogo'] || 0) + (row['itogo'] || 0)
        })

        // const bottomRows = gridApi?.getPinnedBottomRow(0)
        // gridApi?.refreshCells({
        //   force: true
        // })

        // setTotalRow((prev) => {
        //   prev[0] = totals
        //   return prev
        // })
      }
    },
    [gridApi, t]
  )

  console.log({ total: totalRow })

  return (
    <DetailsView>
      <DetailsView.Content
        isLoading={isFetching || isLoadingByOrderNumber}
        className="overflow-hidden flex-1"
      >
        <Form {...form}>
          <form
            onSubmit={onSubmit}
            noValidate
            className="h-full flex flex-col overflow-hidden"
          >
            <div className="p-5 flex items-end justify-between gap-5">
              <div className="flex items-center gap-5">
                <SearchInput onKeyDown={handleSearch} />
                <Button
                  IconStart={RefreshCcw}
                  onClick={() => {
                    fetchSmetas.mutate()
                  }}
                >
                  {t('autofill')}
                </Button>
              </div>

              <div className="flex gap-5">
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
                      hideDescription
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
            </div>

            <div className="flex-1 w-full overflow-x-auto scrollbar mb-24">
              <EditorTable
                form={form}
                arrayField="smetas"
                columnDefs={columnDefs}
                onGridReady={onGridReady}
                onValueEdited={onValueEdited}
                pinnedBottomRowData={totalRow}
                autoSizeStrategy={{
                  type: 'fitGridWidth'
                }}
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
