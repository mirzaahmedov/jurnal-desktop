import type { PodotchetSaldoProvodka } from '@/common/models'
import type { GridApi, GridReadyEvent } from 'ag-grid-community'

import { type KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, RefreshCw } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { AvansService } from '@/app/jur_4/avans/service'
import { WorkTripService } from '@/app/jur_4/work-trip/service'
import { PodotchetDialog } from '@/app/region-spravochnik/podotchet/dialog'
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
import { capitalize } from '@/common/lib/string'
import { DetailsView } from '@/common/views'

import { PodotchetMonitorQueryKeys } from '../../monitor/config'
import {
  type PodotchetSaldoProvodkaFormValues,
  PodotchetSaldoQueryKeys,
  defaultValues
} from '../config'
import { PodotchetSaldoService } from '../service'
import { usePodotchetSaldo } from '../use-saldo'
import { PodotchetSaldoTable } from './podotchet-saldo-table'
import { getProvodkaTotal } from './utils'

const PodotchetSaldoDetailsPage = () => {
  const { id } = useParams()
  useRequisitesRedirect(-1, id !== 'create')

  const gridApi = useRef<GridApi>()

  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const dialogToggle = useToggle()
  const setLayout = useLayout()
  const startDate = useSelectedMonthStore((store) => store.startDate)

  const { queuedMonths } = usePodotchetSaldo()

  const [isEditable, setEditable] = useState(false)
  const [isEmptyRowsHidden, setEmptyRowsHidden] = useState(false)

  const [totalRow, setTotalRow] = useState<Pick<
    PodotchetSaldoProvodka,
    'name' | 'prixod' | 'rasxod' | 'summa'
  > | null>(null)

  const { t } = useTranslation(['app'])
  const { budjet_id, main_schet_id, jur4_schet_id } = useRequisitesStore()

  const form = useForm({
    defaultValues: {
      ...defaultValues,
      year: location.state?.year ?? startDate.getFullYear(),
      month: startDate.getMonth() + 1
    },
    shouldUnregister: false
  })

  const invalidateQueries = () => {
    queryClient.invalidateQueries({
      queryKey: [PodotchetMonitorQueryKeys.getAll]
    })
    queryClient.invalidateQueries({
      queryKey: [PodotchetSaldoQueryKeys.getAll]
    })
    queryClient.invalidateQueries({
      queryKey: [AvansService.getAll]
    })
    queryClient.invalidateQueries({
      queryKey: [WorkTripService.getAll]
    })
  }

  const {
    data: saldo,
    isFetching,
    error
  } = useQuery({
    queryKey: [PodotchetSaldoQueryKeys.getById, Number(id)],
    queryFn: PodotchetSaldoService.getById,
    enabled: id !== 'create' && !queuedMonths.length
  })

  const { isPending: isCheckingSaldo, mutate: checkSaldo } = useMutation({
    mutationKey: [PodotchetSaldoQueryKeys.getCheckSaldo],
    mutationFn: PodotchetSaldoService.getSaldoCheck,
    onSuccess: () => {
      autoFill({
        year,
        month,
        budjet_id: budjet_id!,
        main_schet_id: main_schet_id!,
        schet_id: jur4_schet_id!,
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
          schet_id: jur4_schet_id!,
          first: true
        })
        return
      }
      toast.error(error?.message)
    }
  })

  const { isPending: isAutoFilling, mutate: autoFill } = useMutation({
    mutationKey: [PodotchetSaldoQueryKeys.getAutofill],
    mutationFn: PodotchetSaldoService.getAutofillData,
    onSuccess: (res, values) => {
      let data: PodotchetSaldoProvodka[] = []

      if (!isEditable) {
        data = (res?.data ?? []).map((item) => ({
          ...item,
          summa: (item.prixod ?? 0) - (item.rasxod ?? 0)
        }))
      } else {
        const prevData = form.getValues('podotchets')
        const newData = res?.data ?? []

        data = newData.map((item) => {
          const prev = prevData.find((prev) => prev.podotchet_id === item.podotchet_id)
          return {
            ...item,
            prixod: prev?.prixod ?? 0,
            rasxod: prev?.rasxod ?? 0,
            summa: prev?.summa ?? 0
          } satisfies PodotchetSaldoProvodka
        })
      }

      if (data.length) {
        const total = getProvodkaTotal(data)
        setTotalRow({
          name: t('total'),
          prixod: total.prixod,
          rasxod: total.rasxod,
          summa: total.prixod - total.rasxod
        })
      }

      form.setValue('podotchets', data)
      setEditable(values.first)
    },
    onError: () => {
      form.setValue('podotchets', [])
    }
  })

  const { mutate: createSaldo, isPending: isCreatingMainbook } = useMutation({
    mutationFn: PodotchetSaldoService.create,
    onSuccess: (res) => {
      toast.success(res?.message)

      handleSaldoResponseDates(SaldoNamespace.JUR_4, res)
      invalidateQueries()

      navigate(-1)
    }
  })
  const { mutate: updateSaldo, isPending: isUpdatingMainbook } = useMutation({
    mutationFn: PodotchetSaldoService.update,
    onSuccess: (res) => {
      toast.success(res?.message)

      handleSaldoResponseDates(SaldoNamespace.JUR_4, res)
      invalidateQueries()

      navigate(-1)
    }
  })

  const year = form.watch('year')
  const month = form.watch('month')
  const date = useMemo(() => formatDate(new Date(year, month - 1)), [year, month])

  useEffect(() => {
    if (saldo?.data) {
      if (saldo.data.childs?.length) {
        const total = getProvodkaTotal(saldo.data.childs)
        setTotalRow({
          name: t('total'),
          prixod: total.prixod,
          rasxod: total.rasxod,
          summa: total.prixod - total.rasxod
        })
      }
      form.reset({
        month: saldo.data.month,
        year: saldo.data.year,
        podotchets: saldo.data.childs ?? []
      })
      setEditable(saldo.data.first)
    }
  }, [form, saldo, id, startDate])
  useEffect(() => {
    setLayout({
      title: id === 'create' ? t('create') : t('edit'),
      breadcrumbs: [
        {
          title: t('pages.podotchet')
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
        schet_id: jur4_schet_id!
      })
    }
  }, [id, year, month, budjet_id, main_schet_id, jur4_schet_id])

  const handleSubmit = () => {
    const values = form.getValues()
    values.podotchets.pop()

    if (id === 'create') {
      createSaldo(values)
    } else {
      updateSaldo({
        id: Number(id),
        ...values
      })
    }
  }

  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.stopPropagation()
      e.preventDefault()

      const value = e.currentTarget.value
      if (value.length > 0) {
        gridApi.current?.forEachNodeAfterFilterAndSort((node) => {
          if (node?.data?.name?.toLowerCase()?.includes(value?.toLowerCase())) {
            gridApi.current?.ensureIndexVisible(node.rowIndex!)
            gridApi.current?.setFocusedCell(node.rowIndex!, 'name')
          }
        })
      }
    }
  }

  const isRowEmpty = (row: PodotchetSaldoProvodkaFormValues) => {
    return !row.prixod && !row.rasxod
  }

  const onGridReady = (params: GridReadyEvent) => {
    gridApi.current = params.api
  }

  useEffect(() => {
    if (error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_4, error)
    }
  }, [error])

  useEffect(() => {
    gridApi.current?.refreshCells({ force: true })
  }, [isEmptyRowsHidden])

  const isExternalFilterPresent = useCallback(() => isEmptyRowsHidden, [isEmptyRowsHidden])
  const doesExternalFilterPass = useCallback(
    (node) => {
      const data = node.data as PodotchetSaldoProvodkaFormValues
      return !isEmptyRowsHidden || !isRowEmpty(data)
    },
    [isEmptyRowsHidden]
  )

  return (
    <DetailsView className="h-full">
      <DetailsView.Content
        isLoading={isFetching || isAutoFilling || isCheckingSaldo}
        className="overflow-hidden h-full pb-20"
      >
        <form
          noValidate
          onSubmit={form.handleSubmit(() => {})}
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
                    {
                      form
                        .watch('podotchets')
                        .slice(0, form.watch('podotchets').length - 1)
                        .filter(isRowEmpty).length
                    }
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
                        schet_id: jur4_schet_id!,
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
                    {capitalize(t('create-something', { something: t('podotchet-litso') }))}
                  </Button>
                ) : null}

                {isEditable ? (
                  <Button
                    type="button"
                    IconStart={RefreshCw}
                    onClick={() => {
                      autoFill({
                        year,
                        month,
                        budjet_id: budjet_id!,
                        main_schet_id: main_schet_id!,
                        schet_id: jur4_schet_id!,
                        first: true
                      })
                    }}
                    isPending={isAutoFilling}
                  >
                    {t('update_data')}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    IconStart={RefreshCw}
                    onClick={() => {
                      autoFill({
                        year,
                        month,
                        budjet_id: budjet_id!,
                        main_schet_id: main_schet_id!,
                        schet_id: jur4_schet_id!,
                        first: false
                      })
                    }}
                    isPending={isAutoFilling}
                  >
                    {t('autofill')}
                  </Button>
                )}
              </div>
            </div>
            <div className="overflow-auto scrollbar flex-1 relative">
              <PodotchetSaldoTable
                form={form}
                arrayName="podotchets"
                pinnedBottomRowData={totalRow ? [totalRow] : []}
                onGridReady={onGridReady}
                isExternalFilterPresent={isExternalFilterPresent}
                doesExternalFilterPass={doesExternalFilterPass}
                context={{
                  isEditable
                }}
                onCellValueChanged={(params) => {
                  const { colDef, node } = params
                  if (colDef.field === 'prixod' || colDef.field === 'rasxod') {
                    const { data } = node
                    const prixod = Number(data.prixod) || 0
                    const rasxod = Number(data.rasxod) || 0
                    form.setValue(
                      `podotchets.${params.data?._originalIndex}.summa`,
                      prixod - rasxod
                    )
                    node.setDataValue('summa', prixod - rasxod)
                  }

                  const values = form.getValues('podotchets') ?? []
                  const total = getProvodkaTotal(values)
                  const name = t('total')

                  setTotalRow({
                    name,
                    prixod: total.prixod,
                    rasxod: total.rasxod,
                    summa: total.prixod - total.rasxod
                  })
                }}
              />
            </div>
          </div>

          <DetailsView.Footer>
            <Button
              type="button"
              onPress={handleSubmit}
              isDisabled={isCreatingMainbook || isUpdatingMainbook}
              isPending={isCreatingMainbook || isUpdatingMainbook}
            >
              {t('save')}
            </Button>
          </DetailsView.Footer>
        </form>

        <PodotchetDialog
          open={dialogToggle.isOpen}
          onOpenChange={dialogToggle.setOpen}
        />
      </DetailsView.Content>
    </DetailsView>
  )
}

export default PodotchetSaldoDetailsPage
