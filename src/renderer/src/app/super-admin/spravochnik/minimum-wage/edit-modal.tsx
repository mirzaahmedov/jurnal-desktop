import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect } from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { NumericInput } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { JollyDatePicker } from '@/common/components/jolly-date-picker'
import { Button } from '@/common/components/jolly/button'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'

import { type MinimumWage, MinimumWageService } from './service'

export interface MinimumWageEditModalProps extends Omit<DialogTriggerProps, 'children'> {
  selected: MinimumWage | null
}
export const MinimumWageEditModal = ({ selected, ...props }: MinimumWageEditModalProps) => {
  const { t } = useTranslation(['app'])

  const queryClient = useQueryClient()

  const { mutate: updateMinimumWage, isPending } = useMutation({
    mutationKey: [MinimumWageService.QueryKeys.Update],
    mutationFn: MinimumWageService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [MinimumWageService.QueryKeys.GetAll]
      })
      props.onOpenChange?.(false)
    }
  })

  const form = useForm({
    defaultValues: {
      doc_date: '',
      doc_num: '',
      start: '',
      summa: 0
    }
  })

  const handleSubmit = form.handleSubmit((values) => {
    if (!selected) {
      return
    }
    updateMinimumWage({
      id: selected.id,
      summa: values.summa
    })
  })

  useEffect(() => {
    if (selected) {
      form.reset({
        doc_num: selected.doc_num,
        doc_date: selected.doc_date,
        start: selected.start,
        summa: selected.summa
      })
    } else {
      form.reset({
        summa: 0,
        doc_date: '',
        doc_num: '',
        start: ''
      })
    }
  }, [form, selected])

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('pages.bhm')}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <FormField
                control={form.control}
                name="doc_num"
                render={({ field }) => (
                  <FormElement
                    label={t('doc_num')}
                    grid="2:5"
                  >
                    <Input
                      readOnly
                      {...field}
                    />
                  </FormElement>
                )}
              />

              <FormField
                control={form.control}
                name="doc_date"
                render={({ field }) => (
                  <FormElement
                    label={t('doc_date')}
                    grid="2:5"
                  >
                    <JollyDatePicker
                      readOnly
                      {...field}
                    />
                  </FormElement>
                )}
              />

              <FormField
                control={form.control}
                name="start"
                render={({ field }) => (
                  <FormElement
                    label={t('start_date')}
                    grid="2:5"
                  >
                    <JollyDatePicker
                      readOnly
                      {...field}
                    />
                  </FormElement>
                )}
              />

              <FormField
                control={form.control}
                name="summa"
                render={({ field }) => (
                  <FormElement
                    label={t('summa')}
                    grid="2:5"
                  >
                    <NumericInput
                      onBlur={field.onBlur}
                      ref={field.ref}
                      value={field.value}
                      onValueChange={(values) => field.onChange(values.floatValue ?? 0)}
                    />
                  </FormElement>
                )}
              />

              <DialogFooter>
                <Button
                  isPending={isPending}
                  type="submit"
                >
                  {t('save')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
