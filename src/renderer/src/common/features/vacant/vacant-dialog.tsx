import type { VacantTreeNode } from '@/app/region-admin/vacant/vacant-tree'
import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

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

import { VacantFormSchema, type VacantFormValues, defaultValues } from './config'

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
        parentId: vacant.parentId ?? null
      })
    } else {
      form.reset(defaultValues)
    }
  }, [vacant])

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
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => <Input {...field} />}
              />
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
