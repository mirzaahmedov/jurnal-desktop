import type { SettingsFormValues } from './config'
import type { DialogProps } from '@radix-ui/react-dialog'

import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { reportTitleQueryKeys, reportTitleService } from '@/app/super-admin/report-title'
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
import { Slider } from '@/common/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/common/components/ui/tabs'
import { useConfirm } from '@/common/features/confirm'
import { LanguageSelect } from '@/common/features/locales'
import { useDates } from '@/common/hooks/use-dates'
import { usePagination } from '@/common/hooks/use-pagination'
import { capitalize } from '@/common/lib/string'

import { useSettingsStore } from './store'

enum TabOption {
  Fitlers = 'Filters',
  UI = 'UI',
  Report = 'Report'
}

export const SettingsDialog = ({ open, onOpenChange }: DialogProps) => {
  const dates = useDates()
  const pagination = usePagination()

  const { t, i18n } = useTranslation()

  const [tabValue, setTabValue] = useState(TabOption.Fitlers)

  const { confirm } = useConfirm()
  const { default_start_date, default_end_date, report_title_id, setSettings } = useSettingsStore()

  const { data: reportTitles, isFetching } = useQuery({
    queryKey: [reportTitleQueryKeys.getAll, { page: 1, limit: 1000000 }],
    queryFn: reportTitleService.getAll
  })

  const form = useForm<SettingsFormValues>({
    defaultValues: {
      default_start_date,
      default_end_date,
      language: i18n.language,
      zoom: 1,
      report_title_id
    }
  })

  const onSubmit = form.handleSubmit((values) => {
    setSettings({
      report_title_id: values.report_title_id,
      default_start_date: values.default_start_date,
      default_end_date: values.default_end_date
    })
    window.api.setZoomFactor(values.zoom)
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
        form.setValue('zoom', zoomFactor)
        form.resetField('zoom', {
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
                        name="default_start_date"
                        render={({ field }) => (
                          <div className="flex items-center justify-between gap-10">
                            <FormLabel>{t('start_date')}</FormLabel>
                            <DatePicker {...field} />
                          </div>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="default_end_date"
                        render={({ field }) => (
                          <div className="flex items-center justify-between gap-10">
                            <FormLabel>{capitalize(t('end_date'))}</FormLabel>
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
                        name="zoom"
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
