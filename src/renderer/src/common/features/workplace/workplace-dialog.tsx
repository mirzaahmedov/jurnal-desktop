import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
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
import { Input } from '@/common/components/ui/input'
import { capitalize } from '@/common/lib/string'

import { WorkplaceFormSchema, type WorkplaceFormValues, defaultValues } from './config'

export interface WorkplaceDialogProps extends Omit<DialogTriggerProps, 'children'> {
  selected: undefined | WorkplaceFormValues
  onSubmit: (values: WorkplaceFormValues) => void
}
export const WorkplaceDialog = ({ selected, onSubmit, ...props }: WorkplaceDialogProps) => {
  const { t } = useTranslation()

  const form = useForm({
    defaultValues,
    resolver: zodResolver(WorkplaceFormSchema)
  })

  useEffect(() => {
    if (selected) {
      form.reset(selected)
    } else {
      form.reset(defaultValues)
    }
  }, [selected])

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selected
                ? t('shtatka')
                : capitalize(t('create-something', { something: t('shtatka') }))}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4 mt-10"
            >
              <div className="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-5">
                <FormField
                  control={form.control}
                  name="poryadNum"
                  render={({ field }) => (
                    <FormElement
                      grid="1:2"
                      label={t('numeric-order')}
                    >
                      <NumericInput
                        ref={field.ref}
                        value={field.value}
                        onValueChange={(values) => field.onChange(values)}
                      />
                    </FormElement>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prOk"
                  render={({ field }) => (
                    <FormElement
                      grid="1:2"
                      label={t('pr_nth', { nth: t('ok') })}
                    >
                      <Input
                        ref={field.ref}
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormElement>
                  )}
                />

                <FormField
                  control={form.control}
                  name="koef"
                  render={({ field }) => (
                    <FormElement
                      grid="1:2"
                      label={t('koef')}
                    >
                      <NumericInput
                        ref={field.ref}
                        value={field.value}
                        onValueChange={(values) => field.onChange(values.floatValue)}
                      />
                    </FormElement>
                  )}
                />

                <FormField
                  control={form.control}
                  name="oklad"
                  render={({ field }) => (
                    <FormElement
                      grid="1:2"
                      label={t('oklad')}
                    >
                      <NumericInput
                        ref={field.ref}
                        value={field.value}
                        onValueChange={(values) => field.onChange(values.floatValue)}
                      />
                    </FormElement>
                  )}
                />

                <FormField
                  control={form.control}
                  name="okladPrikaz"
                  render={({ field }) => (
                    <FormElement
                      grid="1:2"
                      label={t('prikaz_oklad')}
                    >
                      <NumericInput
                        ref={field.ref}
                        value={field.value}
                        onValueChange={(values) => field.onChange(values.floatValue)}
                      />
                    </FormElement>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stavka"
                  render={({ field }) => (
                    <FormElement
                      grid="1:2"
                      label={t('stavka')}
                    >
                      <Input
                        ref={field.ref}
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormElement>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stavkaPrikaz"
                  render={({ field }) => (
                    <FormElement
                      grid="1:2"
                      label={t('prikaz_stavka')}
                    >
                      <Input
                        ref={field.ref}
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormElement>
                  )}
                />
              </div>
              <DialogFooter>
                <Button>{t('save')}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
