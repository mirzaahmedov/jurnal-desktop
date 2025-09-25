import type { VacantTreeNode } from '@/app/region-admin/vacant/vacant-tree'
import type { MainZarplata } from '@/common/models'
import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { LoadingOverlay } from '@/common/components'
import { ContentStepper } from '@/common/components/content-stepper'
import { ComboboxItem, JollyComboBox } from '@/common/components/jolly/combobox'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/common/components/ui/tabs'
import { MainZarplataService } from '@/common/features/main-zarplata/service'
import { PayrollDeductions } from '@/common/features/payroll-deduction/payroll-deductions'
import { PayrollDeductionService } from '@/common/features/payroll-deduction/service'
import { PayrollPayments } from '@/common/features/payroll-payment/payroll-payments'
import { PayrollPaymentService } from '@/common/features/payroll-payment/service'
import { PassportInfoTabs, useZarplataStore } from '@/common/features/zarplata/store'
import { useToggle } from '@/common/hooks'

import { BankCard } from '../bank-card'
import { DopOplataContainer } from '../dop-oplata'
import { Employments } from '../employment/employment'
import { OtdelniyRaschetContainer } from '../otdelniy-raschet'
import { Payroll } from '../payroll'
import { MainZarplataForm } from './main-zarplata-form'
import { EmployeeWorkplace } from './passport-info-employee-workplace'

const tabOptions = [
  PassportInfoTabs.Main,
  PassportInfoTabs.Employment,
  PassportInfoTabs.AdditionalDocument,
  PassportInfoTabs.Payroll,
  PassportInfoTabs.SeperateCalculation,
  PassportInfoTabs.BankCard
]

export interface PassportInfoViewDialogProps extends Omit<DialogTriggerProps, 'children'> {
  vacant: VacantTreeNode | null
  mainZarplataId: number | null
  items: MainZarplata[]
  onNavigateItem?: (index: number) => void
}
export const PassportInfoViewDialog = ({
  vacant,
  mainZarplataId,
  items,
  onNavigateItem,
  ...props
}: PassportInfoViewDialogProps) => {
  const { t } = useTranslation(['app'])
  const { currentTab, setCurrentTab } = useZarplataStore()

  const [comboValue, setComboValue] = useState(null)
  const [paymentTotal, setPaymentTotal] = useState<number>(0)
  const [deductionsTotal, setDeductionsTotal] = useState<number>(0)

  const comboModal = useToggle()
  const queryClient = useQueryClient()

  const { data: mainZarplata, isFetching: isFetchingMainZarplata } = useQuery({
    queryKey: [MainZarplataService.QueryKeys.GetById, mainZarplataId ?? 0],
    queryFn: MainZarplataService.getById,
    enabled: props?.isOpen || !!mainZarplataId
  })

  const { mutate: getPositionSalary, isPending: isCalculating } = useMutation({
    mutationFn: MainZarplataService.getPositionSalary,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PayrollPaymentService.QueryKeys.GetAll, mainZarplataId ?? 0]
      })
      queryClient.invalidateQueries({
        queryKey: [PayrollDeductionService.QueryKeys.GetAll, mainZarplataId ?? 0]
      })
    }
  })

  useEffect(() => {
    if (!props.isOpen) {
      setCurrentTab(PassportInfoTabs.Main)
    }
  }, [props.isOpen])

  const handleSearchMainZarplata = (value: number | null) => {
    if (value) {
      onNavigateItem?.(items.findIndex((i) => i.id === value) ?? 0)
    }
    setComboValue(null)
    comboModal.close()
  }

  return (
    <>
      <DialogTrigger {...props}>
        <DialogOverlay>
          <DialogContent className="relative max-w-full h-full max-h-full">
            {isFetchingMainZarplata ? <LoadingOverlay /> : null}
            <div className="h-full flex flex-col space-y-5 overflow-hidden relative">
              <DialogHeader className="flex flex-row items-center gap-10">
                <div className="space-y-1">
                  <DialogTitle>{t('pages.passport_details')}</DialogTitle>
                  <div className="font-bold text-sm text-brand">
                    {t('rayon')}: {mainZarplata?.data?.rayon}
                  </div>
                </div>
                <div className="flex items-center bg-gray-100 rounded-md">
                  <JollyComboBox
                    hideLabel
                    defaultItems={items}
                    selectedKey={comboValue}
                    menuTrigger="focus"
                    inputProps={{
                      onClick: () => comboModal.open()
                    }}
                    onOpenChange={comboModal.setOpen}
                    onSelectionChange={(value) =>
                      handleSearchMainZarplata(value ? Number(value) : null)
                    }
                    popoverProps={{
                      isOpen: comboModal.isOpen
                    }}
                    className="mt-0"
                  >
                    {(item) => <ComboboxItem id={item.id}>{item.fio}</ComboboxItem>}
                  </JollyComboBox>
                  <div className="size-10 grid place-items-center">
                    <Search className="btn-icon text-gray-400" />
                  </div>
                </div>
              </DialogHeader>
              <Tabs
                value={currentTab}
                onValueChange={(value) => setCurrentTab(value as any)}
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
                    className="h-full overflow-hidden scrollbar py-2.5"
                  >
                    {mainZarplata?.data ? (
                      <MainZarplataForm
                        vacant={vacant}
                        mainZarplataData={mainZarplata?.data}
                        onClose={() => props?.onOpenChange?.(false)}
                        naRuki={paymentTotal - deductionsTotal}
                        workplace={
                          <EmployeeWorkplace
                            mainZarplata={mainZarplata.data}
                            workplace={
                              mainZarplata.data.workplaceId
                                ? {
                                    rayon: mainZarplata.data.rayon,
                                    doljnostName: mainZarplata.data.doljnostName,
                                    doljnostPrikazNum: mainZarplata.data.doljnostPrikazNum,
                                    doljnostPrikazDate: mainZarplata.data.doljnostPrikazDate,
                                    spravochnikSostavName: mainZarplata.data.spravochnikSostavName,
                                    spravochnikZarplataIstochnikFinanceName:
                                      mainZarplata.data.spravochnikZarplataIstochnikFinanceName,
                                    stavka: mainZarplata.data.stavka
                                  }
                                : {
                                    doljnostName: '',
                                    doljnostPrikazNum: '',
                                    doljnostPrikazDate: '',
                                    rayon: '',
                                    spravochnikSostavName: '',
                                    spravochnikZarplataIstochnikFinanceName: '',
                                    stavka: 1
                                  }
                            }
                          />
                        }
                        content={
                          <div className="col-span-full grid grid-cols-[repeat(auto-fit,minmax(600px,1fr))] gap-5">
                            <PayrollPayments
                              mainZarplata={mainZarplata?.data}
                              setPaymentsTotal={setPaymentTotal}
                            />
                            <PayrollDeductions
                              mainZarplata={mainZarplata?.data}
                              setDeductionsTotal={setDeductionsTotal}
                            />
                          </div>
                        }
                        onCalculate={getPositionSalary}
                        isCalculating={isCalculating}
                      />
                    ) : null}
                  </TabsContent>

                  <TabsContent
                    value={PassportInfoTabs.Employment}
                    className="mt-0"
                  >
                    {mainZarplata?.data ? <Employments mainZarplata={mainZarplata?.data} /> : null}
                  </TabsContent>

                  <TabsContent
                    value={PassportInfoTabs.AdditionalDocument}
                    className="mt-0"
                  >
                    {mainZarplata?.data ? (
                      <DopOplataContainer mainZarplata={mainZarplata?.data} />
                    ) : null}
                  </TabsContent>

                  <TabsContent
                    value={PassportInfoTabs.Payroll}
                    className="mt-0"
                  >
                    {mainZarplata?.data ? (
                      <Payroll mainZarplataId={mainZarplata?.data?.id} />
                    ) : null}
                  </TabsContent>

                  <TabsContent
                    value={PassportInfoTabs.SeperateCalculation}
                    className="mt-0"
                  >
                    {mainZarplata?.data ? (
                      <OtdelniyRaschetContainer mainZarplata={mainZarplata?.data} />
                    ) : null}
                  </TabsContent>

                  <TabsContent
                    value={PassportInfoTabs.BankCard}
                    className="mt-0 h-full overflow-hidden"
                  >
                    {mainZarplata?.data ? <BankCard mainZarplataData={mainZarplata.data} /> : null}
                  </TabsContent>
                </div>
              </Tabs>
              {items && onNavigateItem ? (
                <div>
                  <ContentStepper
                    currentIndex={items.findIndex((i) => i.id === mainZarplataId)}
                    onIndexChange={onNavigateItem}
                    itemsCount={items.length}
                  />
                </div>
              ) : null}
            </div>
          </DialogContent>
        </DialogOverlay>
      </DialogTrigger>
    </>
  )
}
