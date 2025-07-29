import type { VacantTreeNode } from '@/common/features/vacant/ui/vacant-tree'
import type { MainZarplata } from '@/common/models'
import type { Payment } from '@/common/models/payments'
import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Allotment } from 'allotment'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { MainZarplataTable } from '@/app/jur_5/common/features/main-zarplata/main-zarplata-table'
import { useMainZarplataList } from '@/app/jur_5/common/features/main-zarplata/use-fetchers'
import { PaymentColumnDefs } from '@/app/jur_5/payment-types/payments/columns'
import { PaymentsService } from '@/app/jur_5/payment-types/payments/service'
import { GenericTable, LoadingOverlay, NumericInput } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { Debouncer } from '@/common/components/hoc/debouncer'
import { JollyDatePicker } from '@/common/components/jolly-date-picker'
import { Button } from '@/common/components/jolly/button'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { JollySelect, SelectItem } from '@/common/components/jolly/select'
import { MonthSelect } from '@/common/components/month-select'
import { Pagination } from '@/common/components/pagination'
import { SearchInputDebounced } from '@/common/components/search-input-debounced'
import { Badge } from '@/common/components/ui/badge'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/common/components/ui/tabs'
import { Textarea } from '@/common/components/ui/textarea'
import { YearSelect } from '@/common/components/year-select'
import { useRequisitesStore } from '@/common/features/requisites'
import { useVacantTreeNodes } from '@/common/features/vacant/hooks/use-vacant-tree-nodes'
import { VacantTree, VacantTreeSearch } from '@/common/features/vacant/ui/vacant-tree'
import { parseDate } from '@/common/lib/date'
import { formatLocaleDate } from '@/common/lib/format'

import { NachislenieOthersFormSchema, defaultValues } from '../config'
import { NachislenieOthersService } from '../service'

export enum CreateDialogTabOption {
  MainZarplata = 'mainZarplata',
  Payments = 'payments'
}

export interface PremyaMatPomoshCreateDialogProps extends Omit<DialogTriggerProps, 'children'> {}
export const PremyaMatPomoshCreateDialog = (props: PremyaMatPomoshCreateDialogProps) => {
  const { t } = useTranslation(['app'])
  const { vacantsQuery, filteredTreeNodes, search, setSearch } = useVacantTreeNodes()
  const { main_schet_id, budjet_id } = useRequisitesStore()

  const [paymentPage, setPaymentPage] = useState(1)
  const [paymentLimit, setPaymentLimit] = useState(10)
  const [paymentCode, setPaymentCode] = useState<string>('')
  const [paymentName, setPaymentName] = useState<string>('')
  const [tabValue, setTabValue] = useState<CreateDialogTabOption>(
    CreateDialogTabOption.MainZarplata
  )
  const [searchValue, setSearchValue] = useState<string>('')
  const [selectedVacant, setSelectedVacant] = useState<VacantTreeNode | undefined>(undefined)
  const [selectedMainZarplata, setSelectedMainZarplata] = useState<MainZarplata[]>([])
  const [selectedPayments, setSelectedPayments] = useState<Payment[]>([])

  const queryClient = useQueryClient()
  const form = useForm({
    defaultValues,
    resolver: zodResolver(NachislenieOthersFormSchema)
  })
  const mainZarplataQuery = useMainZarplataList({
    vacantId: selectedVacant?.id
  })
  const paymentsQuery = useQuery({
    queryKey: [
      PaymentsService.QueryKeys.GetAll,
      {
        page: paymentPage,
        limit: paymentLimit,
        code: paymentCode,
        name: paymentName
      }
    ],
    queryFn: PaymentsService.getAll
  })

  const createMutation = useMutation({
    mutationFn: NachislenieOthersService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [NachislenieOthersService.QueryKeys.GetAll]
      })
      props?.onOpenChange?.(false)
      form.reset()
    }
  })
  const docNumMutation = useMutation({
    mutationFn: NachislenieOthersService.getMaxDocNum,
    onSuccess: (docNum) => {
      form.setValue('docNum', docNum)
    }
  })

  const handleSubmit = form.handleSubmit((values) => {
    createMutation.mutate({
      ...values,
      spravochnikBudjetNameId: budjet_id!,
      mainSchetId: main_schet_id!,
      docDate: formatLocaleDate(values.docDate),
      givenDocDate: formatLocaleDate(values.givenDocDate),
      childCreatDtos: selectedMainZarplata.map((item) => ({
        mainZarplataId: item.id
      })),
      payments: undefined
    })
  })

  useEffect(() => {
    if (!props.isOpen) {
      docNumMutation.mutate()
    }
  }, [docNumMutation.mutate, props.isOpen])

  useEffect(() => {
    if (!props.isOpen) {
      setSelectedPayments([])
      setSelectedMainZarplata([])
    }
  }, [props.isOpen])

  const isPercent = form.watch('paymentType') === '%'

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="w-full max-w-full h-full p-0">
          <div className="overflow-hidden h-full flex flex-col">
            <DialogHeader className="p-5">
              <DialogTitle>{t('nachislenie')}</DialogTitle>
            </DialogHeader>
            <Allotment className="flex-1 min-h-0">
              <Allotment.Pane
                preferredSize={300}
                maxSize={600}
                minSize={300}
                className="w-full bg-gray-50"
              >
                <div className="h-full flex flex-col">
                  {vacantsQuery.isFetching ? <LoadingOverlay /> : null}
                  <VacantTreeSearch
                    search={search}
                    onValueChange={setSearch}
                    treeNodes={filteredTreeNodes}
                  />
                  <div className="flex-1 overflow-y-auto scrollbar">
                    <VacantTree
                      nodes={filteredTreeNodes}
                      selectedIds={selectedVacant ? [selectedVacant?.id] : []}
                      onSelectNode={setSelectedVacant}
                    />
                  </div>
                </div>
              </Allotment.Pane>
              <Allotment.Pane>
                <Form {...form}>
                  <form
                    noValidate
                    onSubmit={handleSubmit}
                    className="pl-5 h-full flex flex-col gap-2.5"
                  >
                    <div className="flex flex-wrap gap-x-5">
                      <FormField
                        control={form.control}
                        name="docNum"
                        render={({ field }) => (
                          <FormElement
                            direction="column"
                            label={t('doc_num')}
                          >
                            <Input
                              type="number"
                              {...field}
                            />
                          </FormElement>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="docDate"
                        render={({ field }) => (
                          <FormElement
                            direction="column"
                            label={t('doc_date')}
                          >
                            <JollyDatePicker
                              {...field}
                              onChange={(value) => {
                                field.onChange(value)
                                if (value) {
                                  const date = parseDate(value)
                                  form.setValue('nachislenieYear', date.getFullYear())
                                  form.setValue('nachislenieMonth', date.getMonth() + 1)
                                }
                              }}
                            />
                          </FormElement>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="nachislenieYear"
                        render={({ field }) => (
                          <FormElement
                            direction="column"
                            label={t('year')}
                          >
                            <YearSelect
                              isReadOnly
                              selectedKey={field.value}
                              onSelectionChange={field.onChange}
                            />
                          </FormElement>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="nachislenieMonth"
                        render={({ field }) => (
                          <FormElement
                            direction="column"
                            label={t('month')}
                          >
                            <MonthSelect
                              isReadOnly
                              selectedKey={field.value}
                              onSelectionChange={field.onChange}
                              className="w-32"
                            />
                          </FormElement>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="givenDocDate"
                        render={({ field }) => (
                          <FormElement
                            direction="column"
                            label={t('given_doc_date')}
                          >
                            <JollyDatePicker {...field} />
                          </FormElement>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormElement
                            direction="column"
                            label={t('opisanie')}
                            className="w-full max-w-lg"
                          >
                            <Textarea {...field} />
                          </FormElement>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormElement
                            direction="column"
                            label={t('type')}
                          >
                            <JollySelect
                              inputRef={field.ref}
                              onBlur={field.onBlur}
                              items={[
                                { label: t('premya'), value: 'premya' },
                                { label: t('mat_pomosh'), value: 'mat_pomosh' }
                              ]}
                              selectedKey={field.value}
                              onSelectionChange={field.onChange}
                              className="w-40"
                            >
                              {(item) => <SelectItem id={item.value}>{item.label}</SelectItem>}
                            </JollySelect>
                          </FormElement>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="paymentType"
                        render={({ field }) => (
                          <FormElement
                            direction="column"
                            label={t('payment_type')}
                          >
                            <JollySelect
                              inputRef={field.ref}
                              onBlur={field.onBlur}
                              items={[
                                { label: '%', value: '%' },
                                { label: t('summa'), value: 'summa' }
                              ]}
                              selectedKey={field.value}
                              onSelectionChange={(selectedKey) => {
                                if (selectedKey === '%') {
                                  setTabValue(CreateDialogTabOption.Payments)
                                  form.setValue('amount', 0)
                                } else {
                                  setTabValue(CreateDialogTabOption.MainZarplata)
                                  form.setValue('amount', 0)
                                  setSelectedPayments([])
                                }
                                field.onChange(selectedKey as string)
                              }}
                              className="w-40"
                            >
                              {(item) => <SelectItem id={item.value}>{item.label}</SelectItem>}
                            </JollySelect>
                          </FormElement>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormElement
                            direction="column"
                            label={t('amount')}
                          >
                            <NumericInput
                              isAllowed={(values) =>
                                !isPercent ? true : (values.floatValue ?? 0) <= 100
                              }
                              allowNegative={false}
                              ref={field.ref}
                              value={field.value}
                              onValueChange={(values) => field.onChange(values.floatValue ?? 0)}
                              onBlur={field.onBlur}
                            />
                          </FormElement>
                        )}
                      />
                    </div>

                    <Tabs
                      value={tabValue}
                      onValueChange={(value) => setTabValue(value as CreateDialogTabOption)}
                      className="flex-1 w-full min-h-0 flex flex-col items-start overflow-hidden"
                    >
                      {isPercent ? (
                        <TabsList>
                          <TabsTrigger value={CreateDialogTabOption.MainZarplata}>
                            {t('employees')}
                          </TabsTrigger>
                          <TabsTrigger value={CreateDialogTabOption.Payments}>
                            {t('payments')}
                            <Badge className="ml-2 -my-2">{selectedPayments.length}</Badge>
                          </TabsTrigger>
                        </TabsList>
                      ) : null}

                      <TabsContent
                        value={CreateDialogTabOption.MainZarplata}
                        className="w-full flex-1 min-h-0"
                      >
                        <div className="h-full rounded-lg border p-2.5 flex flex-col gap-2.5">
                          <div>
                            <SearchInputDebounced
                              value={searchValue}
                              onValueChange={setSearchValue}
                            />
                          </div>
                          <div className="flex-1 overflow-y-auto scrollbar">
                            {mainZarplataQuery.isFetching ? <LoadingOverlay /> : null}
                            <MainZarplataTable
                              data={mainZarplataQuery?.data ?? []}
                              selectedIds={selectedMainZarplata.map((item) => item.id)}
                              onClickRow={(item) => {
                                setSelectedMainZarplata((prev) => {
                                  if (prev.some((i) => i.id === item.id)) {
                                    return prev.filter((i) => i.id !== item.id)
                                  }
                                  return [...prev, item]
                                })
                              }}
                              className="table-generic-xs"
                            />
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent
                        value={CreateDialogTabOption.Payments}
                        className="flex-1 w-full min-h-0"
                      >
                        <div className="h-full rounded-lg border p-2.5 flex flex-col gap-2.5">
                          <div className="flex items-center justify-start gap-2.5">
                            <Debouncer
                              value={paymentName}
                              onChange={setPaymentName}
                            >
                              {({ value, onChange }) => (
                                <Input
                                  value={value}
                                  onChange={(e) => onChange(e.target.value)}
                                  placeholder={t('name')}
                                  className="w-64"
                                />
                              )}
                            </Debouncer>
                            <Debouncer
                              value={paymentCode}
                              onChange={setPaymentCode}
                            >
                              {({ value, onChange }) => (
                                <Input
                                  value={value}
                                  onChange={(e) => onChange(e.target.value)}
                                  placeholder={t('code')}
                                  className="w-64"
                                />
                              )}
                            </Debouncer>
                          </div>
                          <div className="flex-1 min-h-0 overflow-y-auto scrollbar">
                            {mainZarplataQuery.isFetching ? <LoadingOverlay /> : null}
                            <GenericTable
                              columnDefs={PaymentColumnDefs({ isMutable: false })}
                              data={paymentsQuery?.data?.data ?? []}
                              selectedIds={selectedPayments.map((item) => item.id)}
                              onClickRow={(item) => {
                                setSelectedPayments((prev) => {
                                  if (prev.some((i) => i.id === item.id)) {
                                    return prev.filter((i) => i.id !== item.id)
                                  }
                                  return [...prev, item]
                                })
                              }}
                              className="table-generic-xs"
                            />
                          </div>
                          <Pagination
                            page={paymentPage}
                            limit={paymentLimit}
                            count={paymentsQuery?.data?.meta?.count ?? 0}
                            pageCount={paymentsQuery?.data?.meta?.pageCount ?? 0}
                            onChange={(values) => {
                              if (values.page) {
                                setPaymentPage(values.page)
                              }
                              if (values.limit) {
                                setPaymentLimit(values.limit)
                              }
                            }}
                          />
                        </div>
                      </TabsContent>
                    </Tabs>

                    <div className="p-5 text-end">
                      <Button
                        type="submit"
                        isPending={createMutation.isPending}
                      >
                        {t('save')}
                      </Button>
                    </div>
                  </form>
                </Form>
              </Allotment.Pane>
            </Allotment>
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
