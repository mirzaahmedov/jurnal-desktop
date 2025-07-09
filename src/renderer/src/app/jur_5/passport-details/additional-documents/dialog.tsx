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

enum AdditionalDocumentTabOptions {
  SickLeave = 'sick_leave',
  AnnualLeave = 'annual_leave'
}

const tabOptions: AdditionalDocumentTabOptions[] = [
  AdditionalDocumentTabOptions.SickLeave,
  AdditionalDocumentTabOptions.AnnualLeave
]

export interface AdditionalDocumentDialogProps extends Omit<DialogTriggerProps, 'children'> {}
export const AdditionalDocumentDialog = (props: AdditionalDocumentDialogProps) => {
  const { t } = useTranslation()

  const [tabValue, setTabValue] = useState<AdditionalDocumentTabOptions>(
    AdditionalDocumentTabOptions.SickLeave
  )

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="max-w-full h-full max-h-[1000px]">
          <div className="h-full flex flex-col space-y-5 overflow-hidden relative">
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
                  value={AdditionalDocumentTabOptions.SickLeave}
                  className="h-full overflow-hidden scrollbar"
                >
                  <h1>Sick Leave</h1>
                </TabsContent>

                <TabsContent
                  value={AdditionalDocumentTabOptions.AnnualLeave}
                  className="mt-0"
                >
                  <h1>Annual Leave</h1>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
