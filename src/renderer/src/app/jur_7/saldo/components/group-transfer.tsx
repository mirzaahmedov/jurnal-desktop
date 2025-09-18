import type { MaterialSaldoProduct } from '@/common/models'
import type { DialogTriggerProps } from 'react-aria-components'

import { type FC, useCallback, useEffect, useMemo, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CircleArrowDown } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { createGroupSpravochnik } from '@/app/super-admin/group/service'
import { ChooseSpravochnik, GenericTable, LoadingOverlay } from '@/common/components'
import { JollyDatePicker } from '@/common/components/jolly-date-picker'
import { Button } from '@/common/components/jolly/button'
import { Checkbox } from '@/common/components/jolly/checkbox'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Pagination } from '@/common/components/pagination'
import { SearchInputDebounced } from '@/common/components/search-input-debounced'
import { SelectCell } from '@/common/components/table/renderers/select'
import { Badge } from '@/common/components/ui/badge'
import { FormField } from '@/common/components/ui/form'
import { Tabs, TabsList, TabsTrigger } from '@/common/components/ui/tabs'
import { useRequisitesStore } from '@/common/features/requisites'
import { useSelectedMonthStore } from '@/common/features/selected-month'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'
import { ISO_DATE_REGEX, formatDate, parseDate, validateDate } from '@/common/lib/date'
import { formatLocaleDate } from '@/common/lib/format'

import { createResponsibleSpravochnik } from '../../responsible/service'
import { CommonMaterialSaldoProductColumns } from '../columns'
import { MaterialSaldoQueryKeys } from '../config'
import { MaterialSaldoProductService, MaterialSaldoService } from '../service'
import { useMaterialSaldo } from '../use-saldo'

const columns = [
  {
    key: 'id',
    header: ' ',
    renderCell: SelectCell
  },
  ...CommonMaterialSaldoProductColumns
] satisfies typeof CommonMaterialSaldoProductColumns

enum GroupTransferTabs {
  All = 'ALL',
  Select = 'SELECTED'
}

export interface GroupTransferProps extends Omit<DialogTriggerProps, 'children'> {
  defaultDate: Date
}
export const GroupTransfer: FC<GroupTransferProps> = (props) => {
  const { defaultDate, ...dialogProps } = props

  const budjetId = useRequisitesStore((store) => store.budjet_id)

  const { queuedMonths } = useMaterialSaldo()
  const { startDate, endDate } = useSelectedMonthStore()
  const { t } = useTranslation(['app'])

  const [tabValue, setTabValue] = useState(GroupTransferTabs.All)
  const [targetGroupId, setTargetGroupId] = useState<number | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<MaterialSaldoProduct[]>([])
  const [selectedDate, setSelectedDate] = useState<undefined | Date>(startDate)
  const [search, setSearch] = useState('')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10
  })

  const form = useForm({
    defaultValues: {
      date: startDate
    }
  })

  const queryClient = useQueryClient()

  const responsibleSpravochnik = useSpravochnik(createResponsibleSpravochnik({}))
  const groupSpravochnik = useSpravochnik(createGroupSpravochnik({}))
  const targetGroupSpravochnik = useSpravochnik(
    createGroupSpravochnik({
      value: targetGroupId ?? 0,
      onChange: (value) => {
        setTargetGroupId(value || null)
      }
    })
  )

  const saldoProductsQuery = useQuery({
    queryKey: [
      MaterialSaldoQueryKeys.getAllProducts,
      {
        page: pagination.page,
        limit: pagination.limit,
        to: formatDate(selectedDate!),
        search,
        responsible_id: responsibleSpravochnik.selected?.id,
        group_id: groupSpravochnik.selected?.id,
        budjetId: budjetId!
      }
    ],
    queryFn: MaterialSaldoProductService.getAll,
    enabled: !!selectedDate && !!budjetId && queuedMonths.length === 0,
    select: (data) => (!!selectedDate && !!budjetId && queuedMonths.length === 0 ? data : undefined)
  })

  const saldoTransferGroupMutation = useMutation({
    mutationFn: MaterialSaldoService.transferProducts,
    onSuccess(res) {
      toast.success(t(res?.message ?? 'update_success'))
      queryClient.invalidateQueries({
        queryKey: [MaterialSaldoQueryKeys.getAllProducts]
      })
      props.onOpenChange?.(false)
      setSelectedProducts([])
    }
  })

  const onSubmit = form.handleSubmit((values) => {
    setSelectedDate(values.date)
  })

  const productsData = useMemo(
    () => saldoProductsQuery?.data?.data ?? [],
    [saldoProductsQuery?.data?.data]
  )
  const selectedIds = useMemo(() => selectedProducts.map((p) => p.product_id), [selectedProducts])

  const isAllSelected = useMemo(() => {
    if (!productsData.length) {
      return false
    }
    return productsData.every((p) => selectedIds.includes(p.product_id)) ?? false
  }, [productsData, selectedIds])

  const handleSelectAll = useCallback(() => {
    setSelectedProducts((prev) => {
      if (isAllSelected) {
        return prev.filter(
          (item) => !productsData.find((row) => row.product_id === item.product_id)
        )
      } else {
        const missingProducts = productsData.filter(
          (row) => !prev.some((item) => item.product_id === row.product_id)
        )
        return [...prev, ...missingProducts]
      }
    })
  }, [form, isAllSelected, productsData])
  const handleSelectRow = (row: MaterialSaldoProduct) => {
    if (selectedProducts.find((p) => p.product_id === row.product_id)) {
      setSelectedProducts((prev) => prev.filter((e) => e.product_id !== row.product_id))
      return
    }
    setSelectedProducts((prev) => [...prev, row])
  }

  const handleTransfer = () => {
    if (!targetGroupId) {
      return
    }
    const payload = selectedProducts.map((p) => ({
      product_id: p.product_id,
      old_group_id: p.group_id,
      new_group_id: targetGroupId
    }))

    saldoTransferGroupMutation.mutate({
      data: payload
    })
  }

  useEffect(() => {
    form.setValue('date', defaultDate)
    setSelectedDate(defaultDate)
  }, [form, defaultDate])

  return (
    <DialogTrigger {...dialogProps}>
      <DialogOverlay>
        <DialogContent className="w-full max-w-full h-full max-h-[900px] overflow-hidden">
          <div className="h-full overflow-hidden flex flex-col gap-5">
            <DialogHeader>
              <DialogTitle>{t('transfer_to_new_group')}</DialogTitle>
              <div className="pt-5">
                <div className="flex items-center gap-5">
                  <ChooseSpravochnik
                    spravochnik={groupSpravochnik}
                    placeholder={t('group')}
                    getName={(selected) => `${selected.group_number ?? ''} - ${selected.name}`}
                    getElements={(selected) => [{ name: t('name'), value: selected.name }]}
                  />

                  <ChooseSpravochnik
                    spravochnik={responsibleSpravochnik}
                    placeholder={t('responsible')}
                    getName={(selected) => selected.fio}
                    getElements={(selected) => [
                      { name: t('fio'), value: selected.fio },
                      {
                        name: t('podrazdelenie'),
                        value: selected.spravochnik_podrazdelenie_jur7_name
                      }
                    ]}
                  />
                  <SearchInputDebounced
                    value={search}
                    onValueChange={setSearch}
                  />
                </div>
                <div className="flex items-center justify-between gap-2.5 mt-5">
                  <form
                    onSubmit={onSubmit}
                    className="flex items-center justify-start gap-5"
                  >
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <JollyDatePicker
                          value={field.value ? formatDate(field.value) : ''}
                          onChange={(value) => {
                            field.onChange(value ? parseDate(value) : undefined)
                          }}
                          validate={(date) => {
                            if (!validateDate(date)) {
                              if (ISO_DATE_REGEX.test(date)) {
                                toast.error(t('date_does_not_exist'))
                              }
                              return false
                            }
                            const isValid =
                              startDate <= parseDate(date) && parseDate(date) <= endDate
                            if (!isValid && date?.length === 10) {
                              toast.error(
                                t('out_of_range', {
                                  startDate: formatLocaleDate(formatDate(startDate)),
                                  endDate: formatLocaleDate(formatDate(endDate))
                                })
                              )
                            }
                            return isValid
                          }}
                          calendarProps={{
                            fromMonth: startDate,
                            toMonth: endDate
                          }}
                        />
                      )}
                    />
                    <Button type="submit">
                      <CircleArrowDown className="btn-icon icon-start" />
                      {t('load')}
                    </Button>
                  </form>
                  <Tabs
                    value={tabValue}
                    onValueChange={(value) => setTabValue(value as GroupTransferTabs)}
                  >
                    <TabsList>
                      <TabsTrigger value={GroupTransferTabs.All}>{t('all')}</TabsTrigger>
                      <TabsTrigger value={GroupTransferTabs.Select}>
                        {t('selected')} <Badge className="ml-5 -my-5">{selectedIds.length}</Badge>
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </DialogHeader>

            {tabValue === GroupTransferTabs.All && (
              <div className="w-full">
                <Button
                  variant="ghost"
                  className="flex items-center h-auto py-1 px-0 gap-2 hover:!bg-transparent"
                  onClick={handleSelectAll}
                >
                  <Checkbox
                    isReadOnly
                    isSelected={isAllSelected}
                    className="pointer-events-none"
                  />
                  <span className="text-xs">
                    {isAllSelected ? t('deselect_all') : t('select_all')}
                  </span>
                </Button>
              </div>
            )}
            <div className="flex-1 min-h-0 relative overflow-auto scrollbar">
              {saldoProductsQuery.isFetching && tabValue === GroupTransferTabs.All && (
                <LoadingOverlay />
              )}
              {tabValue === GroupTransferTabs.All ? (
                <GenericTable
                  columnDefs={columns}
                  data={productsData}
                  getRowId={(row) => row.product_id}
                  getRowKey={(row) => row.id}
                  selectedIds={selectedIds}
                  onClickRow={handleSelectRow}
                />
              ) : (
                <GenericTable
                  columnDefs={columns}
                  data={selectedProducts}
                  getRowId={(row) => row.product_id}
                  getRowKey={(row) => row.id}
                  onDelete={handleSelectRow}
                />
              )}
            </div>
            {tabValue === GroupTransferTabs.All && (
              <div className="flex flex-wrap justify-between">
                <Pagination
                  pageCount={saldoProductsQuery?.data?.meta?.pageCount ?? 0}
                  count={saldoProductsQuery?.data?.meta?.count ?? 0}
                  page={pagination.page}
                  limit={pagination.limit}
                  onChange={({ page, limit }) => {
                    if (page) {
                      setPagination((prev) => ({ ...prev, page: page }))
                    }
                    if (limit) {
                      setPagination((prev) => ({ ...prev, limit: limit }))
                    }
                  }}
                />

                <DialogTrigger>
                  <Button>{t('transfer_to_new_group')}</Button>
                  <DialogOverlay>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t('select_new_group')}</DialogTitle>
                      </DialogHeader>
                      <SpravochnikInput
                        {...targetGroupSpravochnik}
                        getInputValue={(selected) => selected?.name ?? ''}
                        placeholder={t('group')}
                      />
                      <DialogFooter>
                        <Button
                          isDisabled={!targetGroupId || saldoTransferGroupMutation.isPending}
                          isPending={saldoTransferGroupMutation.isPending}
                          onPress={handleTransfer}
                        >
                          {t('update')}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </DialogOverlay>
                </DialogTrigger>
              </div>
            )}
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
