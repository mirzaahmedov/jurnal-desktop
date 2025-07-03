import type { VacantTreeNode } from '@/app/region-admin/vacant/vacant-tree'
import type { MainZarplata } from '@/common/models'
import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { UserCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { Fieldset, LoadingOverlay } from '@/common/components'
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
import { Input } from '@/common/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/common/components/ui/tabs'
import { Textarea } from '@/common/components/ui/textarea'
import { MainZarplataService } from '@/common/features/main-zarplata/service'
import { PayrollPayments } from '@/common/features/payroll-payment/payroll-payments'
import { WorkplaceService } from '@/common/features/workplace/service'
import { useToggle } from '@/common/hooks'

import { ZarplataStavkaOptions } from '../common/data'
import { AssignEmployeePositionDialog } from './assign-employee-position-dialog'
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
  const assignDialogToggle = useToggle()

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
