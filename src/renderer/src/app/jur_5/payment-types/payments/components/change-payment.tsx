import type { MainZarplata } from '@/common/models'
import type { Payment } from '@/common/models/payments'

import { useState } from 'react'

import { useMutation, useQuery } from '@tanstack/react-query'
import { Allotment } from 'allotment'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { SelectedVacantsFilter } from '@/app/jur_5/common/components/selected-vacants-filter'
import { MainZarplataTable } from '@/app/jur_5/common/features/main-zarplata/main-zarplata-table'
import { useVacantFilters } from '@/app/jur_5/common/hooks/use-selected-vacant-filters'
import { LoadingOverlay, NumericInput } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { Button } from '@/common/components/jolly/button'
import { Checkbox } from '@/common/components/jolly/checkbox'
import { Form, FormField } from '@/common/components/ui/form'
import { Label } from '@/common/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/common/components/ui/radio-group'
import { Tabs, TabsList, TabsTrigger } from '@/common/components/ui/tabs'
import { Textarea } from '@/common/components/ui/textarea'
import { MainZarplataService } from '@/common/features/main-zarplata/service'
import { PayrollPaymentService } from '@/common/features/payroll-payment/service'
import { useVacantTreeNodes } from '@/common/features/vacant/hooks/use-vacant-tree-nodes'
import {
  VacantTree,
  type VacantTreeNode,
  VacantTreeSearch
} from '@/common/features/vacant/ui/vacant-tree'
import { useToggle } from '@/common/hooks'
import { getVacantRayon } from '@/common/utils/zarplata'

import { PaymentsChoosePaymentsDialog } from './choose-payments-dialog'

enum PaymentsChangePaymentOptions {
  ALL = 'all',
  SELECTED = 'selected'
}

export const PaymentsChangePayment = () => {
  const paymentToggle = useToggle()

  const form = useForm({
    defaultValues: {
      type: 'all',
      percentage: 0,
      summa: 0,
      paymentId: 0
    }
  })

  const { t } = useTranslation(['app'])
  const { search, setSearch, treeNodes, filteredTreeNodes, vacantsQuery } = useVacantTreeNodes()

  const [tabValue, setTabValue] = useState(PaymentsChangePaymentOptions.ALL)
  const [selectedPayment, setSelectedPayment] = useState<Payment>()
  const [selectedVacant, setSelectedVacant] = useState<VacantTreeNode>()
  const [selectedMainZarplata, setSelectedMainZarplata] = useState<MainZarplata[]>([])
  const [visibleVacant, setVisibleVacant] = useState<number | null>(null)

  const { mutate: changePayment, isPending } = useMutation({
    mutationFn: PayrollPaymentService.changePayment,
    onSuccess: () => {
      form.reset()
      setSelectedPayment(undefined)
      setSelectedVacant(undefined)
      setSelectedMainZarplata([])
      toast.success(t('update_success'))
    }
  })
  const mainZarplataQuery = useQuery({
    queryKey: [
      MainZarplataService.QueryKeys.GetByVacantId,
      {
        vacantId: selectedVacant?.id ?? 0
      }
    ],
    queryFn: MainZarplataService.getByVacantId,
    enabled: !!selectedVacant
  })

  const handleSubmit = form.handleSubmit((values) => {
    changePayment({
      isXarbiy: values.type === 'military' ? true : values.type === 'civilian' ? false : undefined,
      values: {
        paymentId: values.paymentId,
        payment: selectedPayment,
        mains: selectedMainZarplata.map((mainZarplata) => ({ mainZarplataId: mainZarplata.id })),
        percentage: values.percentage,
        summa: values.summa
      }
    })
  })

  const filterOptions = useVacantFilters({
    vacants: treeNodes,
    selectedItems: selectedMainZarplata,
    getItemVacantId: (item) => item.vacantId
  })

  const selectedIds = selectedMainZarplata.map((mainZarplata) => mainZarplata.id)
  const isAllSelected =
    mainZarplataQuery?.data?.every((vacant) =>
      selectedMainZarplata.some((selected) => selected.id === vacant.id)
    ) ?? false

  const handleSelectNode = (node: MainZarplata) => {
    setSelectedMainZarplata((prev) => {
      const isSelected = selectedIds.includes(node.id)
      if (isSelected) {
        return prev.filter((m) => m.id !== node.id)
      }
      return [...prev, node]
    })
  }
  const handleDeselectNode = (node: MainZarplata) => {
    setSelectedMainZarplata((prev) => prev.filter((m) => m.id !== node.id))
  }
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedMainZarplata((prev) =>
        prev.filter((m) => !mainZarplataQuery?.data?.some((vacant) => vacant.id === m.id))
      )
    } else {
      setSelectedMainZarplata((prev) => {
        return [
          ...prev,
          ...((mainZarplataQuery?.data ?? [])?.filter((m) => !selectedIds.includes(m.id)) ?? [])
        ]
      })
    }
  }

  return (
    <Allotment>
      <Allotment.Pane
        preferredSize={300}
        maxSize={600}
        minSize={300}
        className="w-full bg-gray-50"
      >
        <div className="h-full flex flex-col">
          <VacantTreeSearch
            search={search}
            treeNodes={filteredTreeNodes}
            onValueChange={setSearch}
          />
          <div className="flex-1 overflow-y-auto scrollbar">
            {vacantsQuery.isFetching ? <LoadingOverlay /> : null}
            <VacantTree
              nodes={filteredTreeNodes}
              selectedIds={selectedVacant ? [selectedVacant.id] : []}
              onSelectNode={setSelectedVacant}
            />
          </div>
        </div>
      </Allotment.Pane>
      <Allotment.Pane>
        <div className="ml-px h-full overflow-hidden flex flex-col">
          <div className="border-b p-5">
            <h5 className="text-xs font-bold text-gray-600">
              {selectedVacant ? getVacantRayon(selectedVacant) : null}
            </h5>
          </div>

          <div className="px-4 py-1 flex flex-wrap justify-between items-center border-b">
            {tabValue === PaymentsChangePaymentOptions.ALL ? (
              <div className="flex items-center gap-2">
                <Checkbox
                  id="select-all"
                  isSelected={isAllSelected}
                  isIndeterminate={
                    !isAllSelected &&
                    !!mainZarplataQuery.data?.some((m) => selectedIds.includes(m.id))
                  }
                  onChange={handleSelectAll}
                />
                <Label
                  htmlFor="select-all"
                  className="text-xs font-semibold text-gray-600"
                >
                  {t('select_all')}
                </Label>
              </div>
            ) : null}
            {tabValue === PaymentsChangePaymentOptions.SELECTED && (
              <SelectedVacantsFilter
                selectedVacants={filterOptions}
                selectedCount={selectedMainZarplata?.length ?? 0}
                visibleVacant={visibleVacant}
                setVisibleVacant={setVisibleVacant}
              />
            )}

            <Tabs
              value={tabValue}
              onValueChange={(value) => setTabValue(value as PaymentsChangePaymentOptions)}
              className="px-4 py-1"
            >
              <TabsList>
                <TabsTrigger value={PaymentsChangePaymentOptions.ALL}>{t('all')}</TabsTrigger>
                <TabsTrigger value={PaymentsChangePaymentOptions.SELECTED}>
                  {t('selected')}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {tabValue === PaymentsChangePaymentOptions.ALL ? (
            <>
              {mainZarplataQuery.isFetching ? <LoadingOverlay /> : null}
              <div className="flex-1 overflow-auto scrollbar">
                <MainZarplataTable
                  data={mainZarplataQuery.data ?? []}
                  selectedIds={selectedIds}
                  onClickRow={handleSelectNode}
                />
              </div>
            </>
          ) : null}
          {tabValue === PaymentsChangePaymentOptions.SELECTED ? (
            <div className="flex-1 overflow-auto scrollbar">
              <MainZarplataTable
                data={
                  visibleVacant
                    ? selectedMainZarplata?.filter((m) => m.vacantId === visibleVacant)
                    : selectedMainZarplata
                }
                onDelete={handleDeselectNode}
              />
            </div>
          ) : null}

          <div className="border-r border-t bg-gray-100">
            <Form {...form}>
              <form
                onSubmit={handleSubmit}
                className="px-5 py-5"
              >
                <div className="flex flex-wrap gap-x-10 gap-y-2.5">
                  <div className="w-full">
                    <FormElement label={t('payment')}>
                      <Textarea
                        readOnly
                        rows={2}
                        value={[selectedPayment?.name, selectedPayment?.nameUz]
                          .filter(Boolean)
                          .join(' - ')}
                        onDoubleClick={paymentToggle.open}
                      />
                    </FormElement>
                  </div>
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex items-center gap-5"
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem
                            value="all"
                            id="all"
                          />
                          <Label htmlFor="all">{t('all')}</Label>
                        </div>
                        <div className="flex items-center gap-3">
                          <RadioGroupItem
                            value="military"
                            id="military"
                          />
                          <Label htmlFor="military">{t('military')}</Label>
                        </div>
                        <div className="flex items-center gap-3">
                          <RadioGroupItem
                            value="civilian"
                            id="civilian"
                          />
                          <Label htmlFor="civilian">{t('civilian')}</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                  <FormField
                    name="percentage"
                    control={form.control}
                    render={({ field }) => (
                      <FormElement label={`${t('payment_percent')} (%)`}>
                        <NumericInput
                          ref={field.ref}
                          onBlur={field.onBlur}
                          value={field.value}
                          allowNegative={false}
                          isAllowed={(values) => (values.floatValue ?? 0) <= 100}
                          onValueChange={(values) => {
                            if (values.floatValue) {
                              form.setValue('summa', 0)
                            }
                            field.onChange(values.floatValue ?? 0)
                          }}
                        />
                      </FormElement>
                    )}
                  />
                  <FormField
                    name="summa"
                    control={form.control}
                    render={({ field }) => (
                      <FormElement label={t('summa')}>
                        <NumericInput
                          ref={field.ref}
                          onBlur={field.onBlur}
                          value={field.value}
                          onValueChange={(values) => {
                            if (values.floatValue) {
                              form.setValue('percentage', 0)
                            }
                            field.onChange(values.floatValue ?? 0)
                          }}
                        />
                      </FormElement>
                    )}
                  />
                  <Button
                    isPending={isPending}
                    isDisabled={
                      isPending || !selectedMainZarplata.length || !form.watch('paymentId')
                    }
                    type="submit"
                  >
                    {t('save')}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          <PaymentsChoosePaymentsDialog
            isOpen={paymentToggle.isOpen}
            onOpenChange={paymentToggle.setOpen}
            selectedPaymentId={form.watch('paymentId')}
            onSelect={(payment) => {
              form.setValue('paymentId', payment.id)
              setSelectedPayment(payment)
              paymentToggle.close()
            }}
          />
        </div>
      </Allotment.Pane>
    </Allotment>
  )
}
