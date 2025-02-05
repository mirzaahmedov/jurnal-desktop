import { useState } from 'react'

import { useDates } from '@renderer/common/hooks/use-dates'
import { usePagination } from '@renderer/common/hooks/use-pagination'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { DatePicker } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { Button } from '@/common/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/common/components/ui/dialog'
import { Form, FormField } from '@/common/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/common/components/ui/tabs'

import { ManagementFields } from './components/managements'
import { defaultValues } from './constants'
import { useDefaultFilters, useDefaultFormFields } from './store'

type ConfigureDefaultValuesDialogProps = {
  open: boolean
  onClose: () => void
}
const ConfigureDefaultValuesDialog = ({ open, onClose }: ConfigureDefaultValuesDialogProps) => {
  const dates = useDates()
  const pagination = usePagination()

  const [currentTab, setCurrentTab] = useState<string>('filters')

  const { t } = useTranslation()

  const { setDefaultFilters } = useDefaultFilters()
  const { setDefaultFormFields } = useDefaultFormFields()

  const form = useForm({
    defaultValues
  })

  const onSubmit = form.handleSubmit(({ from, to, rukovoditel, glav_buxgalter }) => {
    setDefaultFilters({
      from,
      to
    })
    dates.onChange({
      from: undefined,
      to: undefined
    })
    pagination.onChange({ page: 1 })
    setDefaultFormFields({
      rukovoditel,
      glav_buxgalter
    })
    onClose()
  })

  return (
    <Dialog
      open={open}
      onOpenChange={onClose}
    >
      <DialogContent className="flex flex-col w-full max-w-3xl h-full max-h-[400px]">
        <DialogHeader>
          <DialogTitle>Настроить значения по умолчанию</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={onSubmit}
            className="flex-1 flex flex-col mt-4"
          >
            <Tabs
              value={currentTab}
              onValueChange={setCurrentTab}
              className="flex-1"
            >
              <div className="h-full flex flex-row gap-5">
                <div className="h-full w-48">
                  <TabsList className="h-full w-full flex-col justify-start p-1 bg-transparent">
                    <TabsTrigger
                      value="filters"
                      className="w-full justify-start px-3 py-1.5 !shadow-none data-[state=active]:bg-slate-100 data-[state=active]:text-brand"
                    >
                      Фильтры
                    </TabsTrigger>
                    <TabsTrigger
                      value="form"
                      className="w-full justify-start px-3 py-1.5 !shadow-none data-[state=active]:bg-slate-100 data-[state=active]:text-brand"
                    >
                      Форма
                    </TabsTrigger>
                  </TabsList>
                </div>
                <div className="h-full flex-1">
                  <TabsContent
                    tabIndex={-1}
                    value="filters"
                  >
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="from"
                        render={({ field }) => (
                          <FormElement
                            label="Дата с"
                            grid="1:4"
                          >
                            <DatePicker {...field} />
                          </FormElement>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="to"
                        render={({ field }) => (
                          <FormElement
                            label="Дата по"
                            grid="1:4"
                          >
                            <DatePicker {...field} />
                          </FormElement>
                        )}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="form">
                    <ManagementFields
                      form={form}
                      className="p-0"
                      containerProps={{
                        className: 'flex-col'
                      }}
                    />
                  </TabsContent>
                </div>
              </div>
            </Tabs>
            <DialogFooter className="border-none">
              <Button>{t('save')}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export { ConfigureDefaultValuesDialog }
