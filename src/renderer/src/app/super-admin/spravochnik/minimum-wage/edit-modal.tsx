import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect } from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { NumericInput } from '@/common/components'
import { FormElement } from '@/common/components/form'
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
        queryKey: [MinimumWageService.QueryKeys.GetWage]
      })
      props.onOpenChange?.(false)
    }
  })

  const form = useForm({
    defaultValues: {
      summa: 0
    }
  })

  const handleSubmit = form.handleSubmit((values) => {
    updateMinimumWage({
      summa: values.summa
    })
  })

  useEffect(() => {
    if (selected) {
      form.reset({
        summa: selected.summa
      })
    } else {
      form.reset({
        summa: 0
      })
    }
  }, [form, selected])

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('pages.minimum-wage')}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <FormField
                control={form.control}
                name="summa"
                render={({ field }) => (
                  <FormElement label={t('summa')}>
                    <NumericInput
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
