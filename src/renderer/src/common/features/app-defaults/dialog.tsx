import type { DialogProps } from '@radix-ui/react-dialog'

import { useEffect, useState } from 'react'

import { reportTitleQueryKeys, reportTitleService } from '@renderer/app/super-admin/report-title'
import { Slider } from '@renderer/common/components/ui/slider'
import { useDates } from '@renderer/common/hooks/use-dates'
import { usePagination } from '@renderer/common/hooks/use-pagination'
import { capitalize } from '@renderer/common/lib/string'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { DatePicker, SelectField } from '@/common/components'
import { Button } from '@/common/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/common/components/ui/dialog'
import { Form, FormField, FormLabel } from '@/common/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/common/components/ui/tabs'
import { useConfirm } from '@/common/features/confirm'
import { LanguageSelect } from '@/common/features/locales'

import { defaultValues } from './constants'
import { useDefaultFilters, useSettingsStore } from './store'

enum TabOption {
  Fitlers = 'Filters',
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

  const { t, i18n } = useTranslation()

  const [tabValue, setTabValue] = useState<TabOption>(TabOption.Fitlers)

  const { confirm } = useConfirm()
  const { setDefaultFilters } = useDefaultFilters()
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
    window.api.setZoomFactor(values.zoomFactor)
    i18n.changeLanguage(values.language)

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
  useEffect(() => {
    const handleChangeLanguage = (language: string) => {
      form.setValue('language', language)
      form.resetField('language', {
        defaultValue: language
      })
    }

    i18n.on('languageChanged', handleChangeLanguage)

    return () => {
      i18n.off('languageChanged', handleChangeLanguage)
    }
  }, [i18n])

  return (
    <Dialog
      open={open}
      onOpenChange={handleClose}
    >
      <DialogContent className="flex flex-col w-full max-w-4xl h-full max-h-[400px]">
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
                  <TabsList className="h-full w-full flex-col justify-start p-2 bg-transparent border">
                    <TabsTrigger
                      value={TabOption.Fitlers}
                      className="w-full justify-start px-3 py-1.5 data-[state=active]:bg-brand/5 data-[state=active]:text-brand font-semibold !shadow-none"
                    >
                      {t('filters')}
                    </TabsTrigger>
                    <TabsTrigger
                      value={TabOption.UI}
                      className="w-full justify-start px-3 py-1.5 data-[state=active]:bg-brand/5 data-[state=active]:text-brand font-semibold !shadow-none"
                    >
                      {t('interface')}
                    </TabsTrigger>
                    <TabsTrigger
                      value={TabOption.Report}
                      className="w-full justify-start px-3 py-1.5 data-[state=active]:bg-brand/5 data-[state=active]:text-brand font-semibold !shadow-none"
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
                    <div className="flex flex-col gap-2">
                      <FormField
                        control={form.control}
                        name="from"
                        render={({ field }) => (
                          <div className="flex items-center justify-between gap-10">
                            <FormLabel>{t('from')}</FormLabel>
                            <DatePicker {...field} />
                          </div>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="to"
                        render={({ field }) => (
                          <div className="flex items-center justify-between gap-10">
                            <FormLabel>{capitalize(t('to'))}</FormLabel>
                            <DatePicker {...field} />
                          </div>
                        )}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value={TabOption.UI}>
                    <div className="flex flex-col gap-2">
                      <FormField
                        control={form.control}
                        name="language"
                        render={({ field }) => (
                          <div className="flex items-center justify-between gap-10">
                            <FormLabel>{t('language')}</FormLabel>
                            <div>
                              <LanguageSelect
                                value={field.value}
                                onValueChange={(value) => field.onChange(value)}
                              />
                            </div>
                          </div>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="zoomFactor"
                        render={({ field }) => (
                          <div className="flex items-center justify-between gap-10 min-h-10">
                            <FormLabel>{t('zoom')}</FormLabel>
                            <div className="w-full flex items-center gap-5">
                              <Slider
                                step={0.25}
                                min={0.5}
                                max={2}
                                value={[field.value]}
                                onValueChange={(value) => field.onChange(value[0])}
                              />
                              <span>{field.value * 100}%</span>
                            </div>
                          </div>
                        )}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value={TabOption.Report}>
                    <FormField
                      control={form.control}
                      name="report_title_id"
                      render={({ field }) => (
                        <div className="flex items-center justify-between gap-10 min-h-10">
                          <FormLabel>{t('name')}</FormLabel>
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
                        </div>
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
