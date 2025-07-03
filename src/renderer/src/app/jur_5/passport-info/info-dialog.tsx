import type { VacantTreeNode } from '@/app/region-admin/vacant/vacant-tree'
import type { MainZarplata } from '@/common/models'
import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect, useState } from 'react'

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

import { EmployeeWorkplace } from './employee-workplace'
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

  const [tabValue, setTabValue] = useState<PassportInfoTabs.Main>(PassportInfoTabs.Main)

  const queryClient = useQueryClient()

  const { data: mainZarplata, isFetching: isFetchingMainZarplata } = useQuery({
    queryKey: [MainZarplataService.QueryKeys.GetById, selectedMainZarplata?.id ?? 0],
    queryFn: MainZarplataService.getById,
    enabled: !!selectedMainZarplata?.id
  })

  const { mutate: getPositionSalary, isPending: isCalculating } = useMutation({
    mutationFn: MainZarplataService.getPositionSalary,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [MainZarplataService.QueryKeys.GetById, selectedMainZarplata?.id ?? 0]
      })
    }
  })

  useEffect(() => {
    getPositionSalary(selectedMainZarplata?.id ?? 0)
  }, [mainZarplata, getPositionSalary])

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
                            <div>
                              {mainZarplata?.data && mainZarplata?.data?.workplaceId ? (
                                <EmployeeWorkplace mainZarplata={mainZarplata.data} />
                              ) : null}
                            </div>
                            <div>
                              {selectedMainZarplata ? (
                                <PayrollPayments mainZarplataId={selectedMainZarplata.id} />
                              ) : null}
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
    </>
  )
}
