import type { DialogProps } from '@radix-ui/react-dialog'

import { useEffect, useState } from 'react'

import { reportTitleQueryKeys, reportTitleService } from '@renderer/app/super-admin/report-title'
import { useDates } from '@renderer/common/hooks/use-dates'
import { usePagination } from '@renderer/common/hooks/use-pagination'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { DatePicker, SelectField } from '@/common/components'
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
import { useConfirm } from '@/common/features/confirm'

import { ManagementFields } from './components/managements'
import { defaultValues } from './constants'
import { useDefaultFilters, useDefaultFormFields, useSettingsStore } from './store'

enum TabOption {
  Fitlers = 'Filters',
  Form = 'Form',
  UI = 'UI',
  Report = 'Report'
}

interface ConfigureDefaultValuesDialogProps extends DialogProps {}
export const ConfigureDefaultValuesDialog = ({
  open,
  onOpenChange
}: ConfigureDefaultValuesDialogProps) => {
  const dates = useDates()
  const pagination = usePagination()

  const [tabValue, setTabValue] = useState<TabOption>(TabOption.Fitlers)

  const { t } = useTranslation()

  const { confirm } = useConfirm()
  const { setDefaultFilters } = useDefaultFilters()
  const { setDefaultFormFields } = useDefaultFormFields()
  const { setSettings } = useSettingsStore()

  const { data: reportTitles, isFetching } = useQuery({
    queryKey: [reportTitleQueryKeys.getAll, { page: 1, limit: 1000000 }],
    queryFn: reportTitleService.getAll
  })

  const form = useForm({
    defaultValues
  })

  const onSubmit = form.handleSubmit((values) => {
    setDefaultFilters({
      from: values.from,
      to: values.to
    })
    setSettings({
      report_title_id: values.report_title_id
    })
    setDefaultFormFields({
      rukovoditel: values.rukovoditel,
      glav_buxgalter: values.glav_buxgalter
    })

    window.api.setZoomFactor(values.zoomFactor)

    dates.onChange({
      from: undefined,
      to: undefined
    })
    pagination.onChange({
      page: 1
    })

    form.reset(values)

    onOpenChange?.(false)
  })

  const handleClose = (open: boolean) => {
    if (!open && form.formState.isDirty) {
      confirm({
        title: t('unsaved_changes_want_to_exit'),
        onConfirm: () => {
          form.reset({}, { keepDefaultValues: true })
          onOpenChange?.(false)
        }
      })

      return
    }
    onOpenChange?.(open)
  }

  useEffect(() => {
    if (open) {
      window.api.getZoomFactor().then((zoomFactor) => {
        form.setValue('zoomFactor', zoomFactor)
        form.resetField('zoomFactor', {
          defaultValue: zoomFactor
        })
      })
    }
  }, [form, open])

  return (
    <Dialog
      open={open}
      onOpenChange={handleClose}
    >
      <DialogContent className="flex flex-col w-full max-w-3xl h-full max-h-[400px]">
        <DialogHeader>
          <DialogTitle>{t('configure-programm')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={onSubmit}
            className="flex-1 flex flex-col mt-4"
          >
            <Tabs
              value={tabValue}
              onValueChange={(value) => setTabValue(value as TabOption)}
              className="flex-1"
            >
              <div className="h-full flex flex-row gap-5">
                <div className="h-full w-48">
                  <TabsList className="h-full w-full flex-col justify-start p-1 bg-transparent">
                    <TabsTrigger
                      value={TabOption.Fitlers}
                      className="w-full justify-start px-3 py-1.5 !shadow-none data-[state=active]:bg-slate-100 data-[state=active]:text-brand"
                    >
                      {t('filters')}
                    </TabsTrigger>
                    <TabsTrigger
                      value={TabOption.Form}
                      className="w-full justify-start px-3 py-1.5 !shadow-none data-[state=active]:bg-slate-100 data-[state=active]:text-brand"
                    >
                      {t('form')}
                    </TabsTrigger>
                    <TabsTrigger
                      value={TabOption.UI}
                      className="w-full justify-start px-3 py-1.5 !shadow-none data-[state=active]:bg-slate-100 data-[state=active]:text-brand"
                    >
                      {t('interface')}
                    </TabsTrigger>
                    <TabsTrigger
                      value={TabOption.Report}
                      className="w-full justify-start px-3 py-1.5 !shadow-none data-[state=active]:bg-slate-100 data-[state=active]:text-brand"
                    >
                      {t('report')}
                    </TabsTrigger>
                  </TabsList>
                </div>
                <div className="h-full flex-1">
                  <TabsContent
                    tabIndex={-1}
                    value={TabOption.Fitlers}
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
                  <TabsContent value={TabOption.Form}>
                    <ManagementFields
                      form={form}
                      className="p-0"
                      containerProps={{
                        className: 'flex-col'
                      }}
                    />
                  </TabsContent>
                  <TabsContent value={TabOption.UI}>
                    <FormField
                      control={form.control}
                      name="zoomFactor"
                      render={({ field }) => (
                        <FormElement label="Масштаб">
                          <SelectField
                            value={field.value?.toString()}
                            defaultValue="1"
                            onValueChange={(value) => field.onChange(Number(value))}
                            options={[0.25, 0.5, 0.75, 1, 1.5, 2, 3]}
                            getOptionLabel={(o) => `${o * 100}%`}
                            getOptionValue={(o) => o}
                          />
                        </FormElement>
                      )}
                    />
                  </TabsContent>
                  <TabsContent value={TabOption.Report}>
                    <FormField
                      control={form.control}
                      name="report_title_id"
                      render={({ field }) => (
                        <FormElement label={t('report-title')}>
                          <SelectField
                            {...field}
                            disabled={isFetching}
                            value={field.value?.toString()}
                            onValueChange={(value) => {
                              field.onChange(value ? Number(value) : undefined)
                            }}
                            options={reportTitles?.data ?? []}
                            getOptionLabel={(o) => o.name}
                            getOptionValue={(o) => o.id}
                          />
                        </FormElement>
                      )}
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
