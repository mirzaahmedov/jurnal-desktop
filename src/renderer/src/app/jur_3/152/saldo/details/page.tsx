import type { EditableTableMethods } from '@/common/components/editable-table'
import type { OrganSaldoProvodka } from '@/common/models'

import { type KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, RefreshCw } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { OrganizationDialog } from '@/app/region-spravochnik/organization/dialog'
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

import { type OrganSaldoProvodkaFormValues, OrganSaldoQueryKeys, defaultValues } from '../config'
import { OrganSaldoService } from '../service'
import { useUslugiSaldo } from '../use-saldo'
import { OrganSaldoTable } from './organ-saldo-table'
import { getOrganSaldoProvodkaColumns } from './provodki'
import { SaldoSubChildsDialog } from './saldo-sub-childs-dialog'
import { calculateTotal } from './utils'

const OrganSaldoDetailsPage = () => {
  const { id } = useParams()
  useRequisitesRedirect(-1, id !== 'create')

  const tableMethods = useRef<EditableTableMethods>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const dialogToggle = useToggle()
  const queryClient = useQueryClient()
  const setLayout = useLayout()
  const startDate = useSelectedMonthStore((store) => store.startDate)

  const [selectedRowIndex, setSelectedRowIndex] = useState<number>()
  const [selectedOrganName, setSelectedOrganName] = useState('')

  const [isEditable, setEditable] = useState(false)
  const [isRendering, setRendering] = useState(false)
  const [isEmptyRowsHidden, setEmptyRowsHidden] = useState(false)

  const { t } = useTranslation(['app'])
  const { queuedMonths } = useUslugiSaldo()
  const { budjet_id, main_schet_id, jur3_schet_152_id } = useRequisitesStore()

  const form = useForm({
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
      handleAutofill({
        year,
        month,
        budjet_id: budjet_id!,
        main_schet_id: main_schet_id!,
        schet_id: jur3_schet_152_id!,
        first: false
      })
    },
    onError: (error) => {
      if ('status' in error && error.status === 404) {
        setEditable(true)
        handleAutofill({
          year,
          month,
          budjet_id: budjet_id!,
          main_schet_id: main_schet_id!,
          schet_id: jur3_schet_152_id!,
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
        data = res?.data ?? []
      } else {
        const prevData = form.getValues('organizations')
        const newData = res?.data ?? []

        data = newData.map((item) => {
          const prev = prevData.find((prev) => prev.organization_id === item.organization_id)
          return {
            ...item,
            prixod: prev?.prixod ?? 0,
            rasxod: prev?.rasxod ?? 0
          } satisfies OrganSaldoProvodka
        })
      }

      if (data.length) {
        const total = calculateTotal(data)
        data.push({
          _total: true,
          name: t('total'),
          prixod: total.prixod,
          rasxod: total.rasxod
        } as OrganSaldoProvodka)
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
      handleSaldoResponseDates(SaldoNamespace.JUR_3_152, res)

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
      handleSaldoResponseDates(SaldoNamespace.JUR_3_152, res)

      navigate(-1)
    }
  })

  const year = form.watch('year')
  const month = form.watch('month')
  const date = useMemo(() => formatDate(new Date(year, month - 1)), [year, month])

  useEffect(() => {
    if (saldo?.data) {
      if (saldo.data.childs?.length) {
        const total = calculateTotal(saldo.data.childs)
        saldo.data.childs.push({
          _total: true,
          name: t('total'),
          prixod: total.prixod,
          rasxod: total.rasxod
        } as OrganSaldoProvodka)
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
        schet_id: jur3_schet_152_id!
      })
    }
  }, [id, year, month, budjet_id, main_schet_id, jur3_schet_152_id])

  const onSubmit = form.handleSubmit((values) => {
    values.organizations.pop()

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
        const index = rows.findIndex(
          (row) =>
            row.name?.toLowerCase()?.includes(value?.toLowerCase()) ||
            row.inn?.toLowerCase()?.includes(value.toLowerCase())
        )
        tableMethods.current?.scrollToRow(index)
      }
    }
  }

  const rows = useWatch({
    control: form.control,
    name: 'organizations'
  })
  useEffect(() => {
    if (!isEditable || rows.length === 0) {
      return
    }

    const total = calculateTotal(rows, true)
    const totalRow = rows[rows.length - 1]
    const name = t('total')

    if (Number(totalRow?.prixod) !== Number(total.prixod)) {
      form.setValue(`organizations.${rows.length - 1}.prixod`, total.prixod)
    }
    if (Number(totalRow?.rasxod) !== Number(total.rasxod)) {
      form.setValue(`organizations.${rows.length - 1}.rasxod`, total.rasxod)
    }
    if (totalRow?.name !== name) {
      form.setValue(`organizations.${rows.length - 1}.name`, name)
    }
  }, [rows, form, isEditable, t])

  const columns = useMemo(() => getOrganSaldoProvodkaColumns(false), [isEditable])

  const isRowEmpty = (row: OrganSaldoProvodkaFormValues) => {
    return !row.prixod && !row.rasxod
  }
  const isRowVisible = useCallback<(args: { index: number }) => boolean>(
    ({ index }) => {
      return isEmptyRowsHidden ? !isRowEmpty(form.getValues(`organizations.${index}`)) : true
    },
    [isEmptyRowsHidden, form]
  )

  useEffect(() => {
    requestAnimationFrame(() => {
      setRendering(false)
    })
  }, [rows])
  useEffect(() => {
    if (error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_3_152, error)
    }
  }, [error])

  const handleAutofill = (values: Parameters<typeof autoFill>[0]) => {
    setRendering(true)
    autoFill(values)
  }

  return (
    <DetailsView className="h-full">
      <DetailsView.Content
        isLoading={isFetching || isRendering || isAutoFilling || isCheckingSaldo}
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
                    {rows.slice(0, rows.length - 1).filter(isRowEmpty).length}
                  </Badge>
                </Button>

                <MonthPicker
                  value={date}
                  onChange={(value) => {
                    const date = new Date(value)
                    form.setValue('year', date.getFullYear())
                    form.setValue('month', date.getMonth() + 1)
                    if (id !== 'create' && !isEditable) {
                      handleAutofill({
                        year: date.getFullYear(),
                        month: date.getMonth() + 1,
                        budjet_id: budjet_id!,
                        main_schet_id: main_schet_id!,
                        schet_id: jur3_schet_152_id!,
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
                      handleAutofill({
                        year,
                        month,
                        budjet_id: budjet_id!,
                        main_schet_id: main_schet_id!,
                        schet_id: jur3_schet_152_id!,
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
                      handleAutofill({
                        year,
                        month,
                        budjet_id: budjet_id!,
                        main_schet_id: main_schet_id!,
                        schet_id: jur3_schet_152_id!,
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
              <OrganSaldoTable
                columnDefs={columns}
                methods={tableMethods}
                form={form}
                name="organizations"
                isRowVisible={isRowVisible}
                onCellDoubleClick={({ index, row }) => {
                  setSelectedRowIndex(index)
                  setSelectedOrganName(row.name ?? '')
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

        <SaldoSubChildsDialog
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
        />
      </DetailsView.Content>
    </DetailsView>
  )
}

export default OrganSaldoDetailsPage
