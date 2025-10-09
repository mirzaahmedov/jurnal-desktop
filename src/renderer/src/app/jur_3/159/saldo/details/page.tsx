import type { OrganSaldoProvodka } from '@/common/models'
import type { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community'
import type { CustomCellRendererProps } from 'ag-grid-react'

import { type KeyboardEvent, useCallback, useEffect, useMemo, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, RefreshCw } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { OrganSaldoShartnomaDialog } from '@/app/jur_3/shared/components/organ-saldo-shartnoma-dialog'
import { calculateSumma } from '@/app/jur_3/shared/utils/calculate-summa'
import { OrganizationDialog } from '@/app/region-spravochnik/organization/dialog'
import { EditorTable } from '@/common/components/editor-table/editor-table'
import { Button } from '@/common/components/jolly/button'
import { MonthPicker } from '@/common/components/month-picker'
import { SearchInput } from '@/common/components/search-input'
import { Badge } from '@/common/components/ui/badge'
import { useRequisitesStore } from '@/common/features/requisites'
import { useRequisitesRedirect } from '@/common/features/requisites/use-main-schet-redirect'
import {
  SaldoNamespace,
  handleSaldoErrorDates,
  handleSaldoResponseDates
} from '@/common/features/saldo'
import { useSelectedMonthStore } from '@/common/features/selected-month'
import { useToggle } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { formatDate } from '@/common/lib/date'
import { DetailsView } from '@/common/views'

import {
  type OrganSaldoFormValues,
  type OrganSaldoProvodkaFormValues,
  OrganSaldoQueryKeys,
  defaultValues
} from '../config'
import { OrganSaldoService } from '../service'
import { useAktSaldo } from '../use-saldo'

const OrganSaldoDetailsPage = () => {
  const { id } = useParams()
  useRequisitesRedirect(-1, id !== 'create')

  const navigate = useNavigate()
  const location = useLocation()
  const dialogToggle = useToggle()
  const queryClient = useQueryClient()
  const setLayout = useLayout()
  const startDate = useSelectedMonthStore((store) => store.startDate)

  const [selectedRowIndex, setSelectedRowIndex] = useState<number>()
  const [selectedOrganName, setSelectedOrganName] = useState('')

  const [totalRow, setTotalRow] = useState<
    Pick<OrganSaldoProvodkaFormValues, 'name' | 'prixod' | 'rasxod' | 'summa'>[]
  >([])

  const [isEditable, setEditable] = useState(false)
  const [gridApi, setGridApi] = useState<GridApi>()
  const [isEmptyRowsHidden, setEmptyRowsHidden] = useState(false)

  const { t } = useTranslation(['app'])
  const { queuedMonths } = useAktSaldo()
  const { budjet_id, main_schet_id, jur3_schet_159_id } = useRequisitesStore()

  const form = useForm<OrganSaldoFormValues>({
    defaultValues: {
      ...defaultValues,
      year: location.state?.year ?? startDate.getFullYear(),
      month: startDate.getMonth() + 1
    }
  })

  const {
    data: saldo,
    isFetching,
    error
  } = useQuery({
    queryKey: [OrganSaldoQueryKeys.getById, Number(id)],
    queryFn: OrganSaldoService.getById,
    enabled: id !== 'create' && !queuedMonths.length
  })

  const { isPending: isCheckingSaldo, mutate: checkSaldo } = useMutation({
    mutationKey: [OrganSaldoQueryKeys.getCheckSaldo],
    mutationFn: OrganSaldoService.getSaldoCheck,
    onSuccess: () => {
      autoFill({
        year,
        month,
        budjet_id: budjet_id!,
        main_schet_id: main_schet_id!,
        schet_id: jur3_schet_159_id!,
        first: false
      })
    },
    onError: (error) => {
      if ('status' in error && error.status === 404) {
        setEditable(true)
        autoFill({
          year,
          month,
          budjet_id: budjet_id!,
          main_schet_id: main_schet_id!,
          schet_id: jur3_schet_159_id!,
          first: true
        })
        return
      }
      toast.error(error?.message)
    }
  })

  const { isPending: isAutoFilling, mutate: autoFill } = useMutation({
    mutationKey: [OrganSaldoQueryKeys.getAutofill],
    mutationFn: OrganSaldoService.getAutofillData,
    onSuccess: (res) => {
      let data: OrganSaldoProvodka[] = []

      if (!isEditable) {
        data = (res?.data ?? []).map((item) => ({
          ...item,
          summa: (item.prixod ?? 0) - (item.rasxod ?? 0)
        }))
      } else {
        const prevData = form.getValues('organizations')
        const newData = res?.data ?? []

        data = newData.map((item) => {
          const prev = prevData.find((prev) => prev.organization_id === item.organization_id)

          item.sub_childs = item.sub_childs?.map((child) => {
            const prevChild = prev?.sub_childs?.find(
              (prevChild) => prevChild.contract_id === child.contract_id
            )
            const prixod = prevChild?.prixod ?? child.prixod ?? 0
            const rasxod = prevChild?.rasxod ?? child.rasxod ?? 0
            const summa = prixod - rasxod
            return {
              ...child,
              prixod,
              rasxod,
              summa
            }
          })

          const totalSums = item.sub_childs.reduce(
            (sum, item) => {
              return {
                prixod: sum.prixod + (item.prixod ?? 0),
                rasxod: sum.rasxod + (item.rasxod ?? 0),
                summa: sum.summa + (item.summa ?? 0)
              }
            },
            {
              prixod: 0,
              rasxod: 0,
              summa: 0
            }
          )

          return {
            ...item,
            prixod: totalSums.prixod,
            rasxod: totalSums.rasxod,
            summa: totalSums.summa
          } satisfies OrganSaldoProvodka
        })
      }

      if (data.length) {
        const total = calculateSumma(data)
        setTotalRow([
          {
            name: t('total'),
            prixod: total.prixod,
            rasxod: total.rasxod,
            summa: total.prixod - total.rasxod
          }
        ])
      } else {
        setTotalRow([])
      }
      form.setValue('organizations', data)
    },
    onError: () => {
      form.setValue('organizations', [])
    }
  })

  const { mutate: createMainbook, isPending: isCreatingMainbook } = useMutation({
    mutationFn: OrganSaldoService.create,
    onSuccess: (res) => {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [OrganSaldoQueryKeys.getAll]
      })
      handleSaldoResponseDates(SaldoNamespace.JUR_3_159, res)

      navigate(-1)
    }
  })
  const { mutate: updateMainbook, isPending: isUpdatingMainbook } = useMutation({
    mutationFn: OrganSaldoService.update,
    onSuccess: (res) => {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [OrganSaldoQueryKeys.getAll]
      })
      handleSaldoResponseDates(SaldoNamespace.JUR_3_159, res)

      navigate(-1)
    }
  })

  const year = form.watch('year')
  const month = form.watch('month')
  const date = useMemo(() => formatDate(new Date(year, month - 1)), [year, month])

  useEffect(() => {
    if (saldo?.data) {
      if (saldo.data.childs?.length) {
        const total = calculateSumma(saldo.data.childs)
        setTotalRow([
          {
            name: t('total'),
            prixod: total.prixod,
            rasxod: total.rasxod,
            summa: total.prixod - total.rasxod
          }
        ])
      } else {
        setTotalRow([])
      }
      form.reset({
        month: saldo.data.month,
        year: saldo.data.year,
        organizations: saldo.data.childs ?? []
      })
      setEditable(saldo.data.first)
    }
  }, [form, saldo, id])
  useEffect(() => {
    setLayout({
      title: id === 'create' ? t('create') : t('edit'),
      breadcrumbs: [
        {
          title: t('pages.organization')
        }
      ],
      onBack: () => {
        navigate(-1)
      }
    })
  }, [setLayout, navigate, t, id])
  useEffect(() => {
    if (id === 'create') {
      checkSaldo({
        budjet_id: budjet_id!,
        main_schet_id: main_schet_id!,
        schet_id: jur3_schet_159_id!
      })
    }
  }, [id, year, month, budjet_id, main_schet_id, jur3_schet_159_id])

  const onSubmit = form.handleSubmit((values) => {
    if (id === 'create') {
      createMainbook(values)
    } else {
      updateMainbook({
        id: Number(id),
        ...values
      })
    }
  })

  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.stopPropagation()
      e.preventDefault()

      const value = e.currentTarget.value
      if (value.length > 0) {
        const rows = form.getValues('organizations')
        const index = rows.findIndex((row) =>
          row.name?.toLowerCase()?.includes(value?.toLowerCase())
        )
        gridApi?.forEachNode((node) => {
          if (node.data.__originalIndex === index) {
            gridApi?.ensureIndexVisible(node.rowIndex!, 'middle')
            node.setSelected(true, true)
          }
        })
      }
    }
  }

  const isRowEmpty = (row: OrganSaldoProvodkaFormValues) => {
    return !row.prixod && !row.rasxod
  }
  const isRowVisible = useCallback<(args: { index: number }) => boolean>(
    ({ index }) => {
      return isEmptyRowsHidden ? !isRowEmpty(form.getValues(`organizations.${index}`)) : true
    },
    [isEmptyRowsHidden, form]
  )
  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api)
  }, [])

  const columnDefs = useMemo<ColDef<OrganSaldoProvodkaFormValues>[]>(
    () => [
      {
        field: 'organization_id',
        width: 100,
        pinned: 'left',
        headerName: t('id'),
        valueFormatter: (params) => (params.value ? `#${params.value}` : '')
      },
      {
        field: 'name',
        width: 300,
        pinned: 'left',
        headerName: t('name'),
        cellClassRules: {
          'font-bold': (params) => params.node.rowPinned === 'bottom'
        }
      },
      {
        field: 'inn',
        width: 160,
        headerName: t('inn')
      },
      {
        field: 'mfo',
        width: 100,
        headerName: t('mfo')
      },
      {
        field: 'bank_klient',
        width: 300,
        headerName: t('bank')
      },
      {
        field: 'prixod',
        flex: 1,
        minWidth: 160,
        headerName: t('prixod'),
        cellRendererParams: {
          readOnly: true
        },
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
        cellClassRules: {
          'font-bold': (params) => params.node.rowPinned === 'bottom'
        }
      },
      {
        field: 'rasxod',
        flex: 1,
        minWidth: 160,
        headerName: t('rasxod'),
        cellRendererParams: {
          readOnly: true
        },
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
        cellClassRules: {
          'font-bold': (params) => params.node.rowPinned === 'bottom'
        }
      },
      {
        field: 'summa',
        pinned: 'right',
        flex: 1,
        minWidth: 160,
        headerName: t('summa'),
        cellRendererParams: {
          readOnly: true,
          allowNegative: true
        },
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
        cellClassRules: {
          'font-bold': (params) => params.node.rowPinned === 'bottom'
        }
      },
      {
        field: 'sub_childs',
        width: 80,
        pinned: 'right',
        headerName: '',
        cellRenderer: (props: CustomCellRendererProps) => {
          const count = props.value?.length ?? 0
          return props.node.rowPinned === 'bottom' ? null : (
            <div className="text-center">
              <Badge
                className="mx-auto"
                variant={count > 0 ? 'default' : 'secondary'}
              >
                {count}
              </Badge>
            </div>
          )
        }
      }
    ],
    [t]
  )

  useEffect(() => {
    if (error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_3_159, error)
    }
  }, [error])

  return (
    <DetailsView className="h-full">
      <DetailsView.Content
        isLoading={isFetching || isAutoFilling || isCheckingSaldo}
        className="overflow-hidden h-full pb-20"
      >
        <form
          noValidate
          onSubmit={onSubmit}
          className="h-full"
        >
          <div className="relative h-full flex flex-col">
            <div className="flex items-center justify-between gap-5 p-5 border-b">
              <SearchInput onKeyDown={handleSearch} />
              <div className="flex items-center gap-5">
                <Button
                  variant="ghost"
                  onPress={() => setEmptyRowsHidden((prev) => !prev)}
                >
                  {isEmptyRowsHidden ? t('show_empty_rows') : t('hide_empty_rows')}{' '}
                  <Badge className="ml-2.5 text-xs">
                    {form.watch('organizations').filter(isRowEmpty).length}
                  </Badge>
                </Button>

                <MonthPicker
                  value={date}
                  onChange={(value) => {
                    const date = new Date(value)
                    form.setValue('year', date.getFullYear())
                    form.setValue('month', date.getMonth() + 1)
                    if (id !== 'create' && !isEditable) {
                      autoFill({
                        year: date.getFullYear(),
                        month: date.getMonth() + 1,
                        budjet_id: budjet_id!,
                        main_schet_id: main_schet_id!,
                        schet_id: jur3_schet_159_id!,
                        first: isEditable
                      })
                    }
                  }}
                />

                {isEditable ? (
                  <Button
                    type="button"
                    variant="outline"
                    IconStart={Plus}
                    onPress={dialogToggle.open}
                  >
                    {t('create-something', { something: t('organization') })}
                  </Button>
                ) : null}

                {isEditable ? (
                  <Button
                    type="button"
                    onClick={() => {
                      autoFill({
                        year,
                        month,
                        budjet_id: budjet_id!,
                        main_schet_id: main_schet_id!,
                        schet_id: jur3_schet_159_id!,
                        first: true
                      })
                    }}
                    IconStart={RefreshCw}
                    isPending={isAutoFilling}
                  >
                    {t('update_data')}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={() => {
                      autoFill({
                        year,
                        month,
                        budjet_id: budjet_id!,
                        main_schet_id: main_schet_id!,
                        schet_id: jur3_schet_159_id!,
                        first: false
                      })
                    }}
                    IconStart={RefreshCw}
                    isPending={isAutoFilling}
                  >
                    {t('autofill')}
                  </Button>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-auto scrollbar">
              <EditorTable
                columnDefs={columnDefs}
                form={form}
                arrayField="organizations"
                onGridReady={onGridReady}
                onRowDoubleClicked={(params) => {
                  setSelectedRowIndex(params.data?.__originalIndex)
                  setSelectedOrganName(params.data?.name ?? '')
                }}
                pinnedBottomRowData={totalRow}
                isExternalFilterPresent={() => isEmptyRowsHidden}
                doesExternalFilterPass={(params) => {
                  return isRowVisible({ index: params.data?.__originalIndex })
                }}
              />
            </div>
          </div>

          <DetailsView.Footer>
            <Button
              type="submit"
              isDisabled={isCreatingMainbook || isUpdatingMainbook}
              isPending={isCreatingMainbook || isUpdatingMainbook}
            >
              {t('save')}
            </Button>
          </DetailsView.Footer>
        </form>
        <OrganizationDialog
          open={dialogToggle.isOpen}
          onOpenChange={dialogToggle.setOpen}
        />

        <OrganSaldoShartnomaDialog
          isOpen={selectedRowIndex !== undefined}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setSelectedRowIndex(undefined)
              setSelectedOrganName('')
            }
          }}
          organName={selectedOrganName}
          form={form}
          rowIndex={selectedRowIndex}
          isEditable={isEditable}
          refetch={() => {
            autoFill({
              year,
              month,
              budjet_id: budjet_id!,
              main_schet_id: main_schet_id!,
              schet_id: jur3_schet_159_id!,
              first: isEditable
            })
          }}
          onChangeTotal={() => {
            const total = calculateSumma(form.getValues('organizations'))
            setTotalRow([
              {
                name: t('total'),
                prixod: total.prixod,
                rasxod: total.rasxod,
                summa: total.prixod - total.rasxod
              }
            ])
          }}
        />
      </DetailsView.Content>
    </DetailsView>
  )
}

export default OrganSaldoDetailsPage
