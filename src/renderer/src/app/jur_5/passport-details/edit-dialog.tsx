import type { VacantTreeNode } from '@/app/region-admin/vacant/vacant-tree'
import type { MainZarplata } from '@/common/models'
import type { DialogTriggerProps } from 'react-aria-components'

import { useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { LoadingOverlay } from '@/common/components'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/common/components/ui/tabs'
import { MainZarplataService } from '@/common/features/main-zarplata/service'
import { PayrollPayments } from '@/common/features/payroll-payment/payroll-payments'
import { PayrollPaymentService } from '@/common/features/payroll-payment/service'

import { EmployeeWorkplace } from './employee-workplace'
import { Employments } from './employment/employment'
import { MainZarplataForm } from './main-zarplata-form'

export enum PassportInfoTabs {
  Main = 'main',
  Employment = 'employment',
  Deduction = 'deduction',
  BankCard = 'bank_card',
  AdditionalPayment = 'additional_payment',
  SeperateCalculation = 'separate_calculation',
  Payroll = 'payroll'
}

const tabOptions = [
  PassportInfoTabs.Main,
  PassportInfoTabs.Employment,
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

  const [tabValue, setTabValue] = useState<PassportInfoTabs.Main>(PassportInfoTabs.Main)

  const queryClient = useQueryClient()

  const { data: mainZarplata, isFetching: isFetchingMainZarplata } = useQuery({
    queryKey: [MainZarplataService.QueryKeys.GetById, selectedMainZarplata?.id ?? 0],
    queryFn: MainZarplataService.getById,
    enabled: props?.isOpen || !!selectedMainZarplata?.id
  })

  const { mutate: getPositionSalary, isPending: isCalculating } = useMutation({
    mutationFn: MainZarplataService.getPositionSalary,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          PayrollPaymentService.QueryKeys.GetByMainZarplataId,
          selectedMainZarplata?.id ?? 0
        ]
      })
    }
  })

  return (
    <>
      <DialogTrigger {...props}>
        <DialogOverlay>
          <DialogContent className="max-w-9xl h-full max-h-[1000px]">
            <div className="h-full flex flex-col space-y-5 overflow-hidden relative">
              {isFetchingMainZarplata ? <LoadingOverlay /> : null}
              <DialogHeader>
                <DialogTitle>{t('pages.passport_details')}</DialogTitle>
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
                            <div className="h-full">
                              <EmployeeWorkplace
                                mainZarplata={mainZarplata.data}
                                workplace={
                                  mainZarplata.data.workplaceId
                                    ? {
                                        rayon: mainZarplata.data.rayon,
                                        doljnostName: mainZarplata.data.doljnostName,
                                        doljnostPrikazNum: mainZarplata.data.doljnostPrikazNum,
                                        doljnostPrikazDate: mainZarplata.data.doljnostPrikazDate,
                                        spravochnikSostavName:
                                          mainZarplata.data.spravochnikSostavName,
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
                            </div>
                            <div>
                              <PayrollPayments mainZarplata={mainZarplata?.data} />
                            </div>
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
                    <Employments mainZarplataId={selectedMainZarplata?.id ?? 0} />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </DialogContent>
        </DialogOverlay>
      </DialogTrigger>
    </>
  )
}
