import type { VacantTreeNode } from '@/app/region-admin/vacant/vacant-tree'
import type { PayrollPaymentFormValues } from '@/common/features/payroll-payment/config'
import type { ZarplataApiResponse } from '@/common/lib/zarplata_new'
import type { MainZarplata, MainZarplataCalculation } from '@/common/models'
import type { PayrollPayment } from '@/common/models/payroll-payment'
import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, UserCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { Fieldset, FooterCell, FooterRow, GenericTable, LoadingOverlay } from '@/common/components'
import { FormElement } from '@/common/components/form'
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
import { SummaCell } from '@/common/components/table/renderers/summa'
import { Input } from '@/common/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/common/components/ui/tabs'
import { Textarea } from '@/common/components/ui/textarea'
import { useConfirm } from '@/common/features/confirm'
import { MainZarplataService } from '@/common/features/main-zarplata/service'
import { PayrollPaymentDialog } from '@/common/features/payroll-payment/payroll-payment-dialog'
import { PayrollPaymentService } from '@/common/features/payroll-payment/service'
import { WorkplaceService } from '@/common/features/workplace/service'
import { useToggle } from '@/common/hooks'
import { formatNumber } from '@/common/lib/format'

import { ZarplataStavkaOptions } from '../common/data'
import { AssignPositionDialog } from './assign-position-dialog'
import { MainZarplataForm } from './main-zarplata-form'

export enum PassportInfoTabs {
  Main = 'main',
  Labor = 'labor',
  Deduction = 'deduction',
  BankCard = 'bank_card',
  AdditionalPayment = 'additional_payment',
  SeperateCalculation = 'separate_calculation',
  Payroll = 'payroll'
}

const tabOptions = [
  PassportInfoTabs.Main,
  PassportInfoTabs.Labor,
  PassportInfoTabs.Deduction,
  PassportInfoTabs.BankCard,
  PassportInfoTabs.AdditionalPayment,
  PassportInfoTabs.SeperateCalculation,
  PassportInfoTabs.Payroll
]

export interface PassportInfoDialogProps extends Omit<DialogTriggerProps, 'children'> {
  vacant: VacantTreeNode
  selectedMainZarplata: MainZarplata | undefined
}
export const PassportInfoDialog = ({
  vacant,
  selectedMainZarplata,
  ...props
}: PassportInfoDialogProps) => {
  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const [tabValue, setTabValue] = useState<PassportInfoTabs.Main>(PassportInfoTabs.Main)
  const [selectedPayrollPayment, setSelectedPayrollPayment] = useState<PayrollPayment | undefined>()
  const [calculations, setCalculations] = useState<ZarplataApiResponse<
    MainZarplataCalculation[]
  > | null>(null)

  const queryClient = useQueryClient()
  const assignDialogToggle = useToggle()
  const paymentDialogToggle = useToggle()

  const { data: mainZarplata, isFetching: isFetchingMainZarplata } = useQuery({
    queryKey: [MainZarplataService.QueryKeys.GetById, selectedMainZarplata?.id ?? 0],
    queryFn: MainZarplataService.getById,
    enabled: !!selectedMainZarplata?.id
  })
  const { mutate: updateMainZarplata, isPending: isUpdating } = useMutation({
    mutationFn: MainZarplataService.update,
    onSuccess: (values) => {
      toast.success(t('update_success'))
      queryClient.invalidateQueries({
        queryKey: [MainZarplataService.QueryKeys.GetById, values.id]
      })
      queryClient.invalidateQueries({
        queryKey: [WorkplaceService.QueryKeys.GetAll]
      })
    },
    onError: () => {
      toast.error(t('update_failed'))
    }
  })
  const { mutate: getPositionSalary, isPending: isCalculating } = useMutation({
    mutationFn: MainZarplataService.getPositionSalary,
    onSuccess: (values) => {
      setCalculations(values)
    }
  })

  const { mutate: createPayroll, isPending: isCreatingPayroll } = useMutation({
    mutationFn: PayrollPaymentService.create,
    onSuccess: () => {
      toast.success(t('create_success'))
      queryClient.invalidateQueries({
        queryKey: [PayrollPaymentService.QueryKeys.GetAll]
      })
      paymentDialogToggle.close()
      getPositionSalary(selectedMainZarplata?.id ?? 0)
    },
    onError: () => {
      toast.error(t('create_failed'))
    }
  })
  const { mutate: updatePayroll, isPending: isUpdatingPayroll } = useMutation({
    mutationFn: PayrollPaymentService.update,
    onSuccess: () => {
      toast.success(t('update_success'))
      queryClient.invalidateQueries({
        queryKey: [PayrollPaymentService.QueryKeys.GetAll]
      })
      paymentDialogToggle.close()
      getPositionSalary(selectedMainZarplata?.id ?? 0)
    },
    onError: () => {
      toast.error(t('update_failed'))
    }
  })
  const { mutate: deletePayroll, isPending: isDeletingPayroll } = useMutation({
    mutationFn: PayrollPaymentService.delete,
    onSuccess: () => {
      toast.success(t('delete_success'))
      queryClient.invalidateQueries({
        queryKey: [PayrollPaymentService.QueryKeys.GetAll]
      })
      paymentDialogToggle.close()
      getPositionSalary(selectedMainZarplata?.id ?? 0)
    },
    onError: () => {
      toast.error(t('delete_failed'))
    }
  })

  useEffect(() => {
    getPositionSalary(selectedMainZarplata?.id ?? 0)
  }, [mainZarplata, getPositionSalary])

  const handlePayrollDelete = (payment: PayrollPayment) => {
    confirm({
      onConfirm: () => {
        deletePayroll(payment.id)
      }
    })
  }
  const handlePayrollCreate = () => {
    setSelectedPayrollPayment(undefined)
    paymentDialogToggle.open()
  }
  const handlePayrollEdit = (payment: PayrollPayment) => {
    setSelectedPayrollPayment(payment)
    paymentDialogToggle.open()
  }
  const handlePayrollSubmit = (values: PayrollPaymentFormValues) => {
    if (!selectedMainZarplata) {
      toast.error(t('select_employee'))
      return
    }
    if (selectedPayrollPayment) {
      updatePayroll({
        id: selectedPayrollPayment.id,
        values: {
          ...values,
          mainZarplataId: selectedMainZarplata.id,
          paymentId: selectedPayrollPayment.paymentId
        }
      })
    } else {
      createPayroll({
        ...values,
        mainZarplataId: selectedMainZarplata.id
      })
    }
  }

  return (
    <>
      <DialogTrigger {...props}>
        <DialogOverlay>
          <DialogContent className="max-w-9xl h-full max-h-[1000px]">
            <div className="h-full flex flex-col space-y-5 overflow-hidden relative">
              {isFetchingMainZarplata ? <LoadingOverlay /> : null}
              <DialogHeader>
                <DialogTitle>{t('pages.passport_info')}</DialogTitle>
              </DialogHeader>
              <Tabs
                value={tabValue}
                onValueChange={(value) => setTabValue(value as any)}
                className="flex min-h-0 flex-1 w-full gap-5 overflow-hidden"
              >
                <div className="h-full overflow-hidden">
                  <TabsList className="h-full w-full flex-col justify-start p-2 bg-transparent border">
                    {tabOptions.map((tab) => (
                      <TabsTrigger
                        key={tab}
                        value={tab}
                        className="w-full justify-start px-3 py-1.5 data-[state=active]:bg-brand/5 data-[state=active]:text-brand font-semibold !shadow-none"
                      >
                        {t(tab)}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
                <div className="border rounded-lg flex-1 h-full overflow-hidden">
                  <TabsContent
                    value={PassportInfoTabs.Main}
                    className="h-full overflow-hidden scrollbar"
                  >
                    {mainZarplata?.data ? (
                      <MainZarplataForm
                        vacant={vacant}
                        selectedMainZarplata={mainZarplata?.data}
                        onClose={() => props?.onOpenChange?.(false)}
                        content={
                          <div className="grid grid-cols-2 gap-5">
                            <Fieldset
                              name={t('shtatka')}
                              className="bg-gray-100 rounded-lg gap-2 relative"
                            >
                              <Textarea
                                className="bg-white"
                                readOnly
                                value={mainZarplata?.data?.rayon ?? ''}
                              />
                              <FormElement label={t('doljnost')}>
                                <Input
                                  readOnly
                                  value={mainZarplata?.data?.doljnostName ?? ''}
                                />
                              </FormElement>
                              <Button
                                className="my-2"
                                isPending={isUpdating}
                                onClick={() => {
                                  assignDialogToggle.open()
                                }}
                              >
                                <UserCheck className="btn-icon icon-start" />
                                {t('assign_to_position')}
                              </Button>
                              <div className="flex items-center gap-2">
                                <FormElement
                                  direction="column"
                                  label={t('order_number')}
                                >
                                  <Input
                                    readOnly
                                    value={mainZarplata?.data?.doljnostPrikazNum ?? ''}
                                  />
                                </FormElement>
                                <FormElement
                                  direction="column"
                                  label={t('order_date')}
                                >
                                  <JollyDatePicker
                                    readOnly
                                    value={mainZarplata?.data?.doljnostPrikazDate ?? ''}
                                  />
                                </FormElement>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex-1">
                                  <FormElement
                                    direction="column"
                                    label={t('source_of_finance')}
                                  >
                                    <Input
                                      readOnly
                                      value={
                                        mainZarplata.data
                                          ?.spravochnikZarplataIstochnikFinanceName ?? ''
                                      }
                                    />
                                  </FormElement>
                                </div>
                                <FormElement
                                  direction="column"
                                  label={t('stavka')}
                                >
                                  <JollySelect
                                    isReadOnly
                                    items={ZarplataStavkaOptions}
                                    placeholder={t('stavka')}
                                    selectedKey={mainZarplata.data?.stavka ?? ''}
                                    className="w-24"
                                  >
                                    {(item) => (
                                      <SelectItem id={item.value}>{item.value}</SelectItem>
                                    )}
                                  </JollySelect>
                                </FormElement>
                              </div>
                              <div className="col-span-full">
                                <FormElement
                                  direction="column"
                                  label={t('sostav')}
                                >
                                  <Input
                                    readOnly
                                    value={mainZarplata.data?.spravochnikSostavName ?? ''}
                                  />
                                </FormElement>
                              </div>
                            </Fieldset>
                            <div className="relative h-full overflow-auto scrollbar">
                              {isUpdatingPayroll || isDeletingPayroll ? <LoadingOverlay /> : null}
                              <GenericTable
                                data={calculations?.data ?? []}
                                columnDefs={[
                                  {
                                    key: 'name'
                                  },
                                  {
                                    key: 'percentage',
                                    header: 'foiz'
                                  },
                                  {
                                    key: 'summa',
                                    renderCell: (row) => <SummaCell summa={row.summa} />,
                                    numeric: true
                                  }
                                ]}
                                className="table-generic-xs border-t border-l"
                                onEdit={handlePayrollEdit}
                                onDelete={handlePayrollDelete}
                                footer={
                                  <FooterRow>
                                    <FooterCell
                                      title={t('total')}
                                      colSpan={3}
                                    />
                                    <FooterCell
                                      content={formatNumber(calculations?.totalCount ?? 0)}
                                    />
                                  </FooterRow>
                                }
                              />
                              <div className="text-end">
                                <Button
                                  className="mt-2"
                                  isPending={isCreatingPayroll}
                                  onClick={handlePayrollCreate}
                                >
                                  <Plus className="btn-icon icon-start" /> {t('add')}
                                </Button>
                              </div>
                            </div>
                          </div>
                        }
                        onCalculate={getPositionSalary}
                        isCalculating={isCalculating}
                        onRemovePosition={() => {}}
                      />
                    ) : null}
                  </TabsContent>
                  <TabsContent value={PassportInfoTabs.Labor}>Labor</TabsContent>
                </div>
              </Tabs>
            </div>
          </DialogContent>
        </DialogOverlay>
      </DialogTrigger>

      <AssignPositionDialog
        isOpen={assignDialogToggle.isOpen}
        onOpenChange={assignDialogToggle.setOpen}
        selectedMainZarplata={selectedMainZarplata}
        onAssign={({ workplaceId, doljnostPrikazNum, doljnostPrikazDate }) => {
          if (!selectedMainZarplata) {
            toast.error('Xodimni tanlang!')
            return
          }
          updateMainZarplata({
            id: selectedMainZarplata.id,
            values: {
              ...selectedMainZarplata,
              doljnostPrikazNum,
              doljnostPrikazDate,
              workplaceId
            }
          })
          assignDialogToggle.close()
        }}
      />

      <PayrollPaymentDialog
        isOpen={paymentDialogToggle.isOpen}
        onOpenChange={paymentDialogToggle.setOpen}
        selected={selectedPayrollPayment}
        onSubmit={handlePayrollSubmit}
      />
    </>
  )
}
