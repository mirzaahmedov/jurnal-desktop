import type { DialogTriggerProps } from 'react-aria-components'

import { useState } from 'react'

import { useTranslation } from 'react-i18next'

import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/common/components/ui/tabs'

import { Main } from './components/main'

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

export interface PassportInfoDialogProps extends Omit<DialogTriggerProps, 'children'> {}
export const PassportInfoDialog = ({ ...props }: PassportInfoDialogProps) => {
  const { t } = useTranslation(['app'])

  const [tabValue, setTabValue] = useState<PassportInfoTabs.Main>(PassportInfoTabs.Main)

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="max-w-9xl h-full max-h-[800px]">
          <div className="h-full flex flex-col space-y-5">
            <DialogHeader>
              <DialogTitle>{t('pages.passport_info')}</DialogTitle>
            </DialogHeader>
            <Tabs
              value={tabValue}
              onValueChange={(value) => setTabValue(value as any)}
              className="flex flex-1 w-full gap-5"
            >
              <div>
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
              <div className="border rounded-lg flex-1 h-full">
                <TabsContent
                  value={PassportInfoTabs.Main}
                  className="h-full"
                >
                  <Main />
                </TabsContent>
                <TabsContent value={PassportInfoTabs.Labor}>Labor</TabsContent>
              </div>
            </Tabs>
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
