import type { MainZarplata } from '@/common/models'
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

import { DopOplataForm } from './dop-oplata-form'

export enum DopOplataTabOptions {
  SickLeave = 'sick_leave',
  AnnualLeave = 'annual_leave'
}

const tabOptions: DopOplataTabOptions[] = [
  DopOplataTabOptions.SickLeave,
  DopOplataTabOptions.AnnualLeave
]

export interface DopOplataDialogProps extends Omit<DialogTriggerProps, 'children'> {
  mainZarplata: MainZarplata
}
export const DopOplataDialog = ({ mainZarplata, ...props }: DopOplataDialogProps) => {
  const { t } = useTranslation(['app'])

  const [tabValue, setTabValue] = useState<DopOplataTabOptions>(DopOplataTabOptions.SickLeave)

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="w-full max-w-2xl h-full max-h-[800px] px-0">
          <div className="flex flex-col h-full overflow-hidden gap-5">
            <DialogHeader className="px-5">
              <DialogTitle>{t('dop-oplata')}</DialogTitle>
            </DialogHeader>
            <Tabs
              value={tabValue}
              onValueChange={(value) => setTabValue(value as any)}
              className="flex-1 min-h-0 flex flex-col"
            >
              <TabsList className="self-start mx-5">
                {tabOptions.map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                  >
                    {t(tab)}
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent
                value={DopOplataTabOptions.SickLeave}
                className="flex-1 overflow-hidden"
              >
                <DopOplataForm
                  mainZarplata={mainZarplata}
                  tabValue={tabValue}
                />
              </TabsContent>

              <TabsContent
                value={DopOplataTabOptions.AnnualLeave}
                className="flex-1 overflow-hidden"
              >
                <DopOplataForm
                  mainZarplata={mainZarplata}
                  tabValue={tabValue}
                />
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
