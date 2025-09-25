import type { VacantTreeNode } from '@/app/region-admin/vacant/vacant-tree'
import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { BudjetSelect } from '@/app/super-admin/budjet/budjet-select'
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
import { FieldGroup } from '@/common/components/jolly/field'
import {
  NumberField,
  NumberFieldInput,
  NumberFieldSteppers
} from '@/common/components/jolly/number-field'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { capitalize } from '@/common/lib/string'

import { VacantFormSchema, type VacantFormValues, defaultValues } from '../config'

export interface VacantDialogProps extends Omit<DialogTriggerProps, 'children'> {
  vacant: undefined | VacantTreeNode
  onSubmit: (values: VacantFormValues) => void
}
export const VacantDialog = ({ vacant, onSubmit, ...props }: VacantDialogProps) => {
  const { t } = useTranslation()

  const form = useForm({
    defaultValues,
    resolver: zodResolver(VacantFormSchema)
  })

  useEffect(() => {
    if (vacant) {
      form.reset({
        name: vacant.name,
        parentId: vacant.parentId ?? null,
        number: vacant.number ?? null,
        spravochnikBudjetNameId: vacant.spravochnikBudjetNameId ?? 0
      })
    } else {
      form.reset(defaultValues)
    }
  }, [vacant])

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit(values)
    form.reset(defaultValues)
  })

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {vacant ? t('vacant') : capitalize(t('create-something', { something: t('vacant') }))}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormElement label={t('name')}>
                    <Input
                      autoFocus
                      {...field}
                    />
                  </FormElement>
                )}
              />

              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <NumberField
                    value={field.value}
                    onChange={field.onChange}
                    minValue={1}
                    formatOptions={{
                      maximumFractionDigits: 0
                    }}
                  >
                    <FieldGroup>
                      <NumberFieldInput />
                      <NumberFieldSteppers />
                    </FieldGroup>
                  </NumberField>
                )}
              />

              {vacant ? (
                <FormField
                  control={form.control}
                  name="spravochnikBudjetNameId"
                  render={({ field }) => (
                    <BudjetSelect
                      inputRef={field.ref}
                      onBlur={field.onBlur}
                      selectedKey={field.value ?? null}
                      onSelectionChange={(value) => field.onChange(value ?? 0)}
                      className="w-full"
                    />
                  )}
                />
              ) : null}

              <DialogFooter>
                <Button type="submit">{t('save')}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
