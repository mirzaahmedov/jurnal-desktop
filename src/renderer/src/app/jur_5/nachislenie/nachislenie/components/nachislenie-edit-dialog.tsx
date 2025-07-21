import type { Nachislenie } from '@/common/models'
import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect } from 'react'

import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

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
import { MonthSelect } from '@/common/components/month-select'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { YearSelect } from '@/common/components/year-select'
import { formatDate, parseDate, parseLocaleDate } from '@/common/lib/date'
import { formatLocaleDate } from '@/common/lib/format'

import { defaultValues } from '../config'
import { NachislenieService } from '../service'

export interface NachislenieEditDialogProps extends Omit<DialogTriggerProps, 'children'> {
  mainSchetId: number
  spravochnikBudjetNameId: number
  selectedNachislenie: Nachislenie
}
export const NachislenieEditDialog = ({
  mainSchetId,
  spravochnikBudjetNameId,
  selectedNachislenie,
  ...props
}: NachislenieEditDialogProps) => {
  const { t } = useTranslation(['app'])

  const { mutate: updateNachislenie, isPending } = useMutation({
    mutationFn: NachislenieService.update,
    onSuccess: () => {
      toast.success(t('update_success'))
      props?.onOpenChange?.(false)
    },
    onError: () => {
      toast.error(t('update_failed'))
    }
  })

  const form = useForm({
    defaultValues
  })

  const handleSubmit = form.handleSubmit((values) => {
    updateNachislenie({
      id: selectedNachislenie.id,
      values: {
        ...values,
        docDate: formatLocaleDate(values.docDate),
        mainSchetId,
        spravochnikBudjetNameId
      }
    })
  })

  useEffect(() => {
    if (selectedNachislenie) {
      form.reset({
        ...selectedNachislenie,
        docDate: formatDate(parseLocaleDate(selectedNachislenie.docDate))
      })
    }
  }, [form, selectedNachislenie])

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('nachislenie')}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              noValidate
              onSubmit={handleSubmit}
              className="mt-5 h-full flex flex-col gap-5"
            >
              <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
                <FormField
                  control={form.control}
                  name="docNum"
                  render={({ field }) => (
                    <FormElement
                      direction="column"
                      label={t('doc_num')}
                    >
                      <Input
                        type="number"
                        {...field}
                      />
                    </FormElement>
                  )}
                />
                <FormField
                  control={form.control}
                  name="docDate"
                  render={({ field }) => (
                    <FormElement
                      direction="column"
                      label={t('doc_date')}
                    >
                      <JollyDatePicker
                        {...field}
                        onChange={(value) => {
                          field.onChange(value)
                          if (value) {
                            const date = parseDate(value)
                            form.setValue('nachislenieYear', date.getFullYear())
                            form.setValue('nachislenieMonth', date.getMonth() + 1)
                          }
                        }}
                      />
                    </FormElement>
                  )}
                />

                <div className="flex items-center gap-5">
                  <FormField
                    control={form.control}
                    name="nachislenieYear"
                    render={({ field }) => (
                      <FormElement
                        direction="column"
                        label={t('year')}
                      >
                        <YearSelect
                          isReadOnly
                          selectedKey={field.value}
                          onSelectionChange={field.onChange}
                        />
                      </FormElement>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nachislenieMonth"
                    render={({ field }) => (
                      <FormElement
                        direction="column"
                        label={t('month')}
                      >
                        <MonthSelect
                          isReadOnly
                          selectedKey={field.value}
                          onSelectionChange={field.onChange}
                          className="w-32"
                        />
                      </FormElement>
                    )}
                  />
                </div>
              </div>

              <div className="text-end">
                <Button
                  type="submit"
                  isPending={isPending}
                >
                  {t('save')}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
